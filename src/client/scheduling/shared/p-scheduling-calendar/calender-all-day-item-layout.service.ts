
// TODO: Milad: Remove line above and fix lint errors
import { Injectable } from '@angular/core';
import { FilterService } from '@plano/client/shared/filter.service';
import { PMoment } from '@plano/client/shared/p-moment.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiAbsence } from '@plano/shared/api';
import { SchedulingApiHoliday } from '@plano/shared/api';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { SchedulingFilterService } from '../../scheduling-filter.service';
import { BirthdayService } from '../api/birthday.service';
import { SchedulingApiBirthday } from '../api/scheduling-api-birthday.service';

export type CalendarAllDayItemType = SchedulingApiAbsence | SchedulingApiHoliday | SchedulingApiBirthday;

export class Layout {
	public posIndex : number = -1;
	public show = true;
}

/**
 * Internal class to define a layout for a specific section of an item.
 */
class SectionLayout {

	/**
	 * Start of the section. It is always start of a day.
	 */
	public start : number | null = null;

	/**
	 * End of the section. It is always start of a day and exclusive.
	 * I.e. if section goes to end of 6. of September then this would be start of 7. of September.
	 */
	public end : number | null = null;

	/**
	 * The layout of this section.
	 */
	public layout = new Layout();

	public item ! : CalendarAllDayItemType;

	constructor(item : CalendarAllDayItemType) {
		this.item = item;
	}
}

@Injectable()
export class CalenderAllDayItemLayoutService {

	/**
	 * This maps stores <timestamp/day> -> <occupied_pos_indices>
	 */
	private occupiedPosIndices = new Map<number, number[]>();

	private layoutData = new Map<CalendarAllDayItemType, SectionLayout[]>();
	private recalculateLayout = true;
	private hiddenLayout ! : Layout;

	private shiftsStart : number | null = null;
	private shiftsEnd : number | null = null;

	constructor(
		private api : SchedulingApiService,
		private filterService : FilterService,
		private schedulingFilterService : SchedulingFilterService,
		private pMoment : PMomentService,
		private birthdayService : BirthdayService,
	) {
		this.hiddenLayout = new Layout();
		this.hiddenLayout.show = false;

		// recalculate on api change
		const recalculateOnApiChange = () : void => {
			const loadParams = this.api.getLastLoadSearchParams();

			if (loadParams && loadParams.get('data') === 'calendar') {
				this.recalculateLayout = true;

				// We explicitly don’t use SchedulingService.shiftsStart/SchedulingService.shiftsEnd
				// because these are not valid in shift-selection component of a booking.
				const start = this.api.getLastLoadSearchParams()!.get('start');
				assumeDefinedToGetStrictNullChecksRunning(start, 'start');
				this.shiftsStart = +start;
				const end = this.api.getLastLoadSearchParams()!.get('end');
				assumeDefinedToGetStrictNullChecksRunning(end, 'end');
				this.shiftsEnd = +end;

				// Ensure we are one day start/end. Just to be save…
				// End is exclusive. Subtract 1 or otherwise we might get the next day
				this.shiftsStart = this.getStartOf(this.shiftsStart, 'day');
				this.shiftsEnd = this.getEndOf(this.shiftsEnd - 1, 'day');
			}
		};

		if (this.api.isLoaded()) {
			recalculateOnApiChange();
		}

		this.api.onChange.subscribe(recalculateOnApiChange);

		this.birthdayService.onChange.subscribe(recalculateOnApiChange);

		// recalculate on filter-service change
		this.filterService.onChange.subscribe(() => {
			this.recalculateLayout = true;
		});
		this.schedulingFilterService.onChange.subscribe(() => {
			this.recalculateLayout = true;
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public getLayout(
		timestamp : number,
		item : CalendarAllDayItemType,
	) : Layout {
		this.updateLayoutIfNeeded();

		// return layout
		const layout = this.findLayout(timestamp, item);
		// eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
		return layout ? layout : this.hiddenLayout;
	}

	private findLayout(timestamp : number, item : CalendarAllDayItemType) : Layout | null {
		const sectionLayouts = this.layoutData.get(item);

		if (sectionLayouts) {
			for (const sectionLayout of sectionLayouts) {
				// timestamp is in given section?
				assumeDefinedToGetStrictNullChecksRunning(sectionLayout.start, 'sectionLayout.start');
				assumeDefinedToGetStrictNullChecksRunning(sectionLayout.end, 'sectionLayout.end');
				if (timestamp >= sectionLayout.start && timestamp < sectionLayout.end) {
					return sectionLayout.layout;
				}
			}
		}

		return null;
	}

	private updateLayoutIfNeeded() : void {
		if (!this.recalculateLayout) return;
		this.calculateLayout();
		this.recalculateLayout = false;
	}

	/**
	 * @returns Returns the maximum pos-index for the given day (defined by "timestamp").
	 * 		"-1" is returned if that day contains no all-day-items.
	 * @param timestamp The day for which the value should be returned.
	 */
	public getMaxPosIndex(
		timestamp : number,
	) : number {
		this.updateLayoutIfNeeded();

		// get occupied indices for day
		const occupiedPosIndicesForTimestamp = this.occupiedPosIndices.get(+this.pMoment.m(timestamp).startOf('day'));

		if (!occupiedPosIndicesForTimestamp) {
			return -1;
		}

		// find max value
		let maxPosIndex : number = -1;

		for (const occupiedPosIndex of occupiedPosIndicesForTimestamp) {
			if (occupiedPosIndex > maxPosIndex) {
				maxPosIndex = occupiedPosIndex;
			}
		}

		return maxPosIndex;
	}

	private calculateLayout() : void {
		if (this.shiftsStart === null) return;

		// clear old data
		this.occupiedPosIndices.clear();
		this.layoutData.clear();

		// get all sections
		let sections : SectionLayout[] = [];

		for (const item of this.getFilteredItems()) {
			sections = sections.concat(this.calculateSections(item));
		}

		// add sections week-wise
		let weekStart = this.getStartOf(this.shiftsStart, 'week');
		let weekEnd = this.getEndOf(weekStart, 'week');

		assumeDefinedToGetStrictNullChecksRunning(this.shiftsEnd, 'shiftsEnd');
		while (weekStart < this.shiftsEnd) {
			// Find all sections in current week
			// Note that the sections have been week-wise. So, each section will be processed only once.
			const sectionsInThisWeek : SectionLayout[] = [];

			for (const section of sections) {
				assumeDefinedToGetStrictNullChecksRunning(section.start, 'section.start');
				if (section.start >= weekStart && section.start < weekEnd) sectionsInThisWeek.push(section);
			}

			// sort sections
			this.sortSections(sectionsInThisWeek, weekEnd);

			// add them
			for (const section of sectionsInThisWeek) this.assignLowestPossiblePosIndexToSection(section);

			// goto next week
			weekStart = weekEnd;
			weekEnd = this.getEndOf(weekStart, 'week');
		}
	}

	private getFilteredItems() : CalendarAllDayItemType[] {
		const result : CalendarAllDayItemType[] = [];

		for (const item of this.api.data.absences.iterable()) {
			if (this.filterService.isVisible(item)) result.push(item);
		}

		for (const item of this.api.data.holidays.iterable()) {
			if (this.filterService.isVisible(item)) result.push(item);
		}

		for (const item of this.birthdayService.birthdays.iterable()) {
			if (this.filterService.isVisible(item)) result.push(item);
		}

		return result;
	}

	private sortSections(sections : SectionLayout[], weekStart : number) : void {
		// The sections should be added in following order:
		// - First all sections are added whose absences also are available in previous week.
		//   Add them in the posIndex order of previous week so their order remain unchanged
		// - Then add seconds which are not available in previous week. Sort these according to their start time
		const getSortValue = (section : SectionLayout) : number => {
			let result;

			// item also is available in previous week?
			const lastDayOfPrevWeek = this.pMoment.m(section.start).subtract(1, 'day').valueOf();
			const layoutLastWeek = this.findLayout(lastDayOfPrevWeek, section.item);

			if (layoutLastWeek) {
				// sort according posIndex of prev week
				result = layoutLastWeek.posIndex;
			} else {
				// otherwise we want to sort according section start normalized by week start
				assumeDefinedToGetStrictNullChecksRunning(section.start, 'section.start');
				result = section.start - weekStart;

				// make sure all sections which are not available in prev week come after the once which are available
				result += 8640000000;
			}

			return result;
		};

		sections.sort((a : SectionLayout, b : SectionLayout) : number => {
			return getSortValue(a) - getSortValue(b);
		});
	}

	private calculateSections(item : CalendarAllDayItemType) : SectionLayout[] {
		const result : SectionLayout[] = [];

		let itemStart : number;
		let itemEnd : number;

		if (item instanceof SchedulingApiBirthday) {
			const start = this.api.getLastLoadSearchParams()!.get('start');
			const lastRequestedDate = start !== null ? +start : 0; // Not sure if this is correct. Just re-implemented pre-null-check-behaviour
			const startOfDayForYear = item.startBasedOnCalendarRequest(lastRequestedDate, this.pMoment);
			itemStart = this.getStartOf(startOfDayForYear, 'day');
			itemEnd = this.getEndOf(startOfDayForYear, 'day');
		} else {
			// get item interval (start and end of day)
			itemStart = this.getStartOf(item.time.start, 'day');
			// End is exclusive. Subtract 1 or otherwise we might get the next day
			itemEnd = this.getEndOf(item.time.end - 1, 'day');
		}

		// we are only interested in current view
		itemStart = this.shiftsStart !== null ? Math.max(itemStart, this.shiftsStart) : itemStart;
		itemEnd = this.shiftsEnd !== null ? Math.min(itemEnd, this.shiftsEnd) : itemEnd;

		// calculate sections
		while (itemStart < itemEnd) {
			// get next section splitting week-wise
			const endOfWeek = this.getEndOf(itemStart, 'week');
			const endOfSection = Math.min(itemEnd, endOfWeek);

			const newSection = new SectionLayout(item);
			newSection.start = itemStart;
			newSection.end = endOfSection;

			result.push(newSection);

			// goto next section
			itemStart = endOfSection;
		}

		return result;
	}

	private getStartOf(timestamp : number, unitOfTime : PMoment.unitOfTime.Base) : number {
		return this.pMoment.m(timestamp).startOf(unitOfTime).valueOf();
	}

	private getEndOf(timestamp : number, unitOfTime : PMoment.unitOfTime.Base) : number {
		return this.pMoment.m(timestamp).add(1, unitOfTime).startOf(unitOfTime).valueOf();
	}

	private assignLowestPossiblePosIndexToSection(section : SectionLayout) : void {
		const timestamps = this.getSectionTimestamps(section);

		for (let posIndex = 0; ; ++posIndex) {
			// can we assign the section to this pos-index?
			let canAssignPosIndex = true;

			for (const timestamp of timestamps) {
				const posIndexOccupied = this.ensureOccupiedPosIndices(timestamp).includes(posIndex);

				if (posIndexOccupied) {
					canAssignPosIndex = false;
					break;
				}
			}

			// assign to pos-index
			if (canAssignPosIndex) {
				section.layout.posIndex = posIndex;

				// mark pos-index as occupied
				for (const timestamp of timestamps) {
					const occupiedPosIndex = this.occupiedPosIndices.get(timestamp);
					assumeDefinedToGetStrictNullChecksRunning(occupiedPosIndex, 'occupiedPosIndex');
					occupiedPosIndex.push(posIndex);
				}

				// add to layoutMap
				let layoutList = this.layoutData.get(section.item);

				if (!layoutList) {
					layoutList = [];
					this.layoutData.set(section.item, layoutList);
				}

				layoutList.push(section);

				// we are done
				return;
			}
		}
	}

	/**
	 * @returns Returns a list of all day timestamps in the given section
	 */
	private getSectionTimestamps(section : SectionLayout) : number[] {
		const result : number[] = [];
		assumeDefinedToGetStrictNullChecksRunning(section.start, 'section.start');
		let currTimestamp = section.start;

		assumeDefinedToGetStrictNullChecksRunning(section.end, 'section.end');
		while (currTimestamp < section.end) {
			result.push(currTimestamp);

			// goto next day
			currTimestamp = this.pMoment.m(currTimestamp).add(1, 'day').valueOf();
		}

		return result;
	}

	private ensureOccupiedPosIndices(timestamp : number) : number[] {
		let result = this.occupiedPosIndices.get(timestamp);

		if (!result) {
			result = [];
			this.occupiedPosIndices.set(timestamp, result);
		}

		return result;
	}
}
