import { Injectable, ApplicationRef } from '@angular/core';
import { CourseFilterService } from '@plano/client/scheduling/course-filter.service';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { FilterService } from '@plano/client/shared/filter.service';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiShift } from '@plano/shared/api';
import { ILayout, IShiftData, IColumnData } from './calender-timeline-layout.types';
import { LogService } from '../../../../shared/core/log.service';
import { notUndefined } from '../../../../shared/core/null-type-utils';
import { CalendarModes } from '../../calendar-modes';
import { SchedulingFilterService } from '../../scheduling-filter.service';
import { ISchedulingApiShift } from '../api/scheduling-api.interfaces';
import { sortShiftsForTimelineViewFns } from '../api/scheduling-api.utils';

class Layout implements ILayout {
	public x = 0;
	public y = 0;
	public z = 0;
	public width = 0;
	public height = 0;
	public show = true;
}

export class ShiftData implements IShiftData {

	/**
	 * Layout object for this shift.
	 */
	public layout = new Layout();

	constructor(public readonly shift : ISchedulingApiShift) {}
}

export class ColumnData implements IColumnData {

	/**
	 * Layout object for this column.
	 */
	public layout = new Layout();

	/**
	 * Shifts data belonging to this column.
	 */
	public shifts = new Array<ShiftData>();

	/**
	 *
	 * @param name Name of the column. Possible types:
	 * - string: The column represents a shiftmodel-parent.
	 * - number: The column represents a day column (timestamp of start of the day).
	 */
	constructor(public readonly name : string | number) {}
}

@Injectable()
export class CalenderTimelineLayoutService {

	/**
	 * Shift min height in pixel.
	 */
	private readonly SHIFT_MIN_HEIGHT = 35;

	/**
	 * Base shift title area in pixel (starting from top of the shift).
	 */
	private readonly TITLE_HEIGHT_BASE = 60;

	/**
	 * Value being added to "TITLE_HEIGHT_BASE" when shift course-info is shown.
	 */
	private readonly TITLE_HEIGHT_COURSE_INFO = 30;

	/**
	 * Z value being set on the shift which is highlighted.
	 */
	private readonly HIGHLIGHTED_SHIFT_Z_VALUE = 50;

	/**
	 * Z value being set on the now-line.
	 */
	private readonly NOW_LINE_Z_VALUE = 10;

	/**
	 * Units added to left of shift when intersecting title.
	 */
	private readonly UNITS_LEFT_INTERSECTION_TITLE = 9;

	/**
	 * Units added to left of shift when intersecting some area other than the title.
	 */
	private readonly UNITS_LEFT_INTERSECTION_SHIFT = 1.8;

	/**
	 * Factor multiplied with width of a shift when it completely contains another shift.
	 */
	private readonly UNITS_PERCENT_CONTAINS_SHIFT = 0.9;

	/**
	 * Margin units on right of each column.
	 */
	private readonly UNITS_COLUMN_MARGIN_RIGHT = 1;

	/**
	 * Margin units on left of each column.
	 */
	private readonly UNITS_COLUMN_MARGIN_LEFT = 1;


	private _containerWidth : number | null = null;
	private _containerHeight : number | null = null;
	private container : HTMLElement | null = null;
	private layoutData : Map<string | number | ISchedulingApiShift, ILayout> | null = null;
	private hiddenLayout ! : ILayout;

	constructor(
		private api : SchedulingApiService,
		private schedulingService : SchedulingService,
		private filterService : FilterService,
		private highlightService : HighlightService,
		private courseService : CourseFilterService,
		private applicationRef : ApplicationRef,
		private schedulingFilterService : SchedulingFilterService,
		private pMoment : PMomentService,
		private console : LogService,
	) {
		this.api.onChange.subscribe(() => {
			this.calculateLayout();
		});
		this.filterService.onChange.subscribe(() => {
			this.calculateLayout();
		});
		this.schedulingFilterService.onChange.subscribe(() => {
			this.calculateLayout();
		});
		this.highlightService.onChange.subscribe(() => {
			this.calculateLayout();
		});
		this.courseService.onChange.subscribe(() => {
			this.calculateLayout();
		});

		// check for container size change
		window.setInterval(() => {
			if (this.checkContainerResize())
				this.applicationRef.tick();
		}, 1000);

		// update view every 10 mins so now-line ist rendered correctly
		window.setInterval(() => {
			this.applicationRef.tick();
		}, 1000 * 60 * 10);

		this.hiddenLayout = new Layout();
		this.hiddenLayout.show = false;
	}

	/**
	 * The height of the container. Is `null` when no container is available yet.
	 */
	public get containerHeight() : number | null {
		return this._containerHeight;
	}

	/**
	 * The width of the container. Is `null` when no container is available yet.
	 */
	public get containerWidth() : number | null {
		return this._containerWidth;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public setTimelineContainer(container : HTMLElement | null) : void {
		if (this.container === container) return;
		this.container = container;

		if (this.container) {
			// cspell:words layouted
			// set id so container is layouted properly by css
			this.container.id = 'timeline-container';

			// this method is called during change-detection. Avoid ExpressionChangedAfterItHasBeenCheckedError
			window.setTimeout(() => {
				this.checkContainerResize();
			});
		} else {
			this._containerWidth = null;
			this._containerHeight = null;
		}
	}

	/**
	 * @returns Returns "true" if container size has changed.
	 */
	private checkContainerResize() : boolean {
		if (this.container) {
			const newWidth = this.container.offsetWidth;
			let newHeight = this.container.offsetHeight;

			if (newWidth !== this._containerWidth || newHeight !== this._containerHeight) {
				this._containerWidth = newWidth;

				// We had this in PLANO-119831
				const limit = 5000;
				if (newHeight > limit) {
					this.console.error('Unrealistic calculated container height');
					newHeight = limit;
				}

				this._containerHeight = newHeight;

				this.calculateLayout();
				return true;
			}
		}

		return false;
	}

	public readonly NOW_LINE = -1;

	/**
	 * @param item The item for which the layout should be returned. Possible types:
	 * 	- SchedulingApiShift: A shift item
	 * 	- string: A shift-model-parent name which is shown as a column.
	 * 	- number: A timestamp (start of day) which represents a day column.
	 *  - NOW_LINE: To get layout for now-line.
	 * @returns Returns an items layout data.
	 */
	public getLayout(item : ISchedulingApiShift | string | number) : ILayout {
		// we cannot handle request when container does not exist yet
		if (!this.container || !this.layoutData)
			return this.hiddenLayout;

		// return layout
		const layout = this.layoutData.get(item);

		if (!layout)
			return this.hiddenLayout;

		return layout;
	}

	// eslint-disable-next-line sonarjs/cognitive-complexity
	private getColumns() : ColumnData[] {
		const result = new Array<ColumnData>();

		if (this.schedulingService.urlParam!.calendarMode === CalendarModes.WEEK) {
			// create week day columns
			const weekStart = this.pMoment.m(this.schedulingService.shiftsStart);

			for (let i = 0; i < 7; i++) {
				// create column
				const dayStart = weekStart.clone().add(i, 'day').valueOf();
				const dayEnd = weekStart.clone().add(i + 1, 'day').valueOf();

				const dayColumn = new ColumnData(dayStart);
				result.push(dayColumn);

				// add shifts to the columns
				for (const shift of this.api.data.shifts.iterable()) {
					if (!this.filterService.isVisible(shift.model)) continue;

					if (shift.start >= dayStart && shift.start < dayEnd) {
						const shiftData = new ShiftData(shift as ISchedulingApiShift);

						dayColumn.shifts.push(shiftData);
					}
				}
			}
		} else {
			// add shifts to the columns
			for (const shift of this.api.data.shifts.iterable()) {
				if (!this.filterService.isVisible(shift))
					continue;

				// get column for shift
				let column : ColumnData | null = null;
				const model = shift.model;
				const columnName = model.parentName;

				for (const currColumn of result) {
					if (currColumn.name === columnName) {
						column = currColumn;
					}
				}

				if (!column) {
					column = new ColumnData(columnName);
					result.push(column);
				}

				// attach shift to column
				const newShiftData = new ShiftData(shift as ISchedulingApiShift);
				column.shifts.push(newShiftData);
			}

			// sort columns alphabetically
			result.sort((a : ColumnData, b : ColumnData) : number => (a.name as string).localeCompare(b.name as string));
		}

		return result;
	}

	private sortShifts(columns : ColumnData[]) : void {
		for (const column of columns) {
			// sort shifts
			// 1. criteria: start of shift (smaller should appear first)
			// 2. criteria: end of shift (greater should appear first)
			// 3. criteria: name (of model)
			for (const sortShiftsForTimelineViewFn of sortShiftsForTimelineViewFns) {
				column.shifts = column.shifts.sort(sortShiftsForTimelineViewFn);
			}
		}
	}

	/**
	 * @returns The y-coordinate where `timestamp` should be positioned.
	 * Returns `null` when position cannot be determined because no container is available yet.
	 */
	private getY(timestamp : number) : number | null {
		if (this._containerHeight === null)
			return null;

		// calculate position based on hours/minutes instead of diff to day start to avoid problems with daylight saving time.
		const hours = this.pMoment.m(timestamp).hours();
		const minutes = this.pMoment.m(timestamp).minutes();
		const overallMinutes = hours * 60 + minutes;
		const dayMinutes = 24 * 60;

		return this._containerHeight / dayMinutes * overallMinutes;
	}

	private calculateVerticalPositions(columns : ColumnData[]) : void {
		if (this._containerHeight === null)
			return;

		for (const column of columns) {
			column.layout.y = 0;
			column.layout.height = this._containerHeight;

			// shifts of this column…
			for (const shift of column.shifts) {
				const shiftTop = this.getY(shift.shift.start);
				const shiftBottom = this.getY(shift.shift.end);

				if (shiftTop === null || shiftBottom === null)
					continue;

				shift.layout.y = shiftTop;
				shift.layout.height = Math.max(this.SHIFT_MIN_HEIGHT, shiftBottom - shiftTop);
			}
		}
	}

	/**
	 * Have two shifts intersection? This method uses "y" and "height" of the layout objects to determine intersection.
	 */
	private intersect(a : ShiftData, b : ShiftData) : boolean {
		return 	(a.layout.y <= b.layout.y && this.getBottom(a.layout) > b.layout.y)	||
			(b.layout.y <= a.layout.y && this.getBottom(b.layout) > a.layout.y);
	}

	private getTitleHeight(shift : ShiftData) : number {
		let result = this.TITLE_HEIGHT_BASE;

		if (this.courseService.courseVisible && shift.shift.model.isCourse)
			result += this.TITLE_HEIGHT_COURSE_INFO;

		return result;
	}

	/**
	 * Have two shifts intersection? This method uses "y" and "height" of the layout objects to determine intersection.
	 */
	private intersectsTitle(a : ShiftData, titleOfB : ShiftData) : boolean {
		const bTitleBottom = Math.min(titleOfB.layout.y + this.getTitleHeight(titleOfB)
			, 	this.getBottom(titleOfB.layout));

		return 	(a.layout.y <= titleOfB.layout.y && this.getBottom(a.layout) > titleOfB.layout.y)	||
			(titleOfB.layout.y <= a.layout.y && bTitleBottom > a.layout.y);
	}

	private calculateZValues(columns : ColumnData[]) : void {
		for (const column of columns) {
			column.layout.z = 0;

			for (const shift of column.shifts) {
				for (let z = 1;; ++z) {
					// We can assign current z value to shift if there is no other shift with that z-value which intersects this shift
					let canAssignZValue = true;

					for (const otherShift of column.shifts) {
						if (otherShift.layout.z === z && this.intersect(shift, otherShift)) {
							canAssignZValue = false;
							break;
						}
					}

					if (canAssignZValue) {
						shift.layout.z = z;
						break;
					}
				}
			}
		}
	}

	private getBottom(layout : ILayout) : number {
		return layout.y + layout.height;
	}

	private getRight(layout : ILayout) : number {
		return layout.x + layout.width;
	}

	/**
	 * Does "a" completely contains "b"?
	 */
	private contains(a : ShiftData, b : ShiftData) : boolean {
		return 	a.layout.y <= b.layout.y	&&
			this.getBottom(a.layout) >= this.getBottom(b.layout);
	}

	/**
	 * This method calculates the shift x positions (in units).
	 * It tries to avoid that a shift does not cover any relevant areas of other shifts with smaller z value.
	 * Concretely, it checks if the intersection is in title area in which case it will give more
	 * space to the covered shift.
	 * Otherwise, less space is given to the covered shift.
	 */
	// eslint-disable-next-line sonarjs/cognitive-complexity
	private calculateHorizontalPositionsInUnits(columns : ColumnData[]) : void {
		// First, sort shifts by their z-index.
		for (const column of columns) {
			column.shifts.sort((a, b) : number => a.layout.z - b.layout.z);
		}

		// calculate horizontal positions
		for (let columnIndex = 0; columnIndex < columns.length; ++columnIndex) {
			const column = columns[columnIndex];

			column.layout.x = (columnIndex === 0) ? 0 	:
				this.getRight(columns[columnIndex - 1].layout);

			// shifts of column
			let columnsMaxX = column.layout.x;

			for (let i = 0; i < column.shifts.length; ++i) {
				const shift = column.shifts[i];

				// iterate all shifts with lower z-index and find the x value (in units) which would ensure that
				// none of those shifts are covered
				let xInUnits = column.layout.x + this.UNITS_COLUMN_MARGIN_LEFT;

				for (let j = 0; j < i; ++j) {
					const otherShift = column.shifts[j];

					if (this.intersect(shift, otherShift)) {
						let newXInUnits;
						if (this.intersectsTitle(shift, otherShift)) {
							newXInUnits = otherShift.layout.x + this.UNITS_LEFT_INTERSECTION_TITLE;
						} else {
							newXInUnits = otherShift.layout.x + this.UNITS_LEFT_INTERSECTION_SHIFT;
						}

						if (newXInUnits > xInUnits)
							xInUnits = newXInUnits;
					}
				}

				shift.layout.x = xInUnits;

				if (xInUnits > columnsMaxX)
					columnsMaxX = xInUnits;
			}

			// the width of this column is that max x position of its shifts plus the width we allocate for a shift-title
			// (for the last shift which had that max x position)
			column.layout.width = (
				(columnsMaxX + this.UNITS_LEFT_INTERSECTION_TITLE) - column.layout.x + this.UNITS_COLUMN_MARGIN_RIGHT
			);

			// First let all shifts go to the end of the column
			for (const shift of column.shifts) {
				shift.layout.width = this.getRight(column.layout) - shift.layout.x - this.UNITS_COLUMN_MARGIN_RIGHT;
			}

			// Now, we want to avoid that a shift is completely contained by another shift because then when that outer shift
			// is highlighted the inner shift will be completely hidden. To, avoid this, we reduce the width of the outer shift.
			for (let i = column.shifts.length - 1; i >= 0; --i) {
				const shift = column.shifts[i];

				// iterate all shifts with lower z values
				for (let j = 0; j < i; ++j) {
					const otherShift = column.shifts[j];

					if (this.contains(otherShift, shift))
						otherShift.layout.width *= this.UNITS_PERCENT_CONTAINS_SHIFT;
				}
			}
		}
	}

	private getCalendarWidthInUnits(columns : ColumnData[]) : number {
		if (columns.length === 0)
			return 0;

		const lastColumnLayout = columns[columns.length - 1].layout;
		return this.getRight(lastColumnLayout);
	}

	private calculatePixelsPerUnit(calendarWidthInUnits : number) : number | null {
		if (this._containerWidth === null)
			return null;

		return this._containerWidth / calendarWidthInUnits;
	}

	private calculateAbsoluteHorizontalPositions(columns : ColumnData[], pixelsPerUnit : number) : void {
		for (const column of columns) {
			column.layout.x = column.layout.x * pixelsPerUnit;
			column.layout.width = column.layout.width * pixelsPerUnit;

			for (const shift of column.shifts) {
				shift.layout.x = shift.layout.x * pixelsPerUnit;
				shift.layout.width = shift.layout.width * pixelsPerUnit;
			}
		}
	}

	private getLayoutMap(columns : ColumnData[]) : Map<string | number | ISchedulingApiShift, Layout> {
		const result = new Map<string | number | ISchedulingApiShift, Layout>();

		// create map from column data
		for (const column of columns) {
			result.set(column.name, column.layout);

			for (const shift of column.shifts) {
				result.set(shift.shift, shift.layout);
			}
		}

		return result;
	}

	private updateZValueForHighlightedShift(layoutData : Map<string | number | ISchedulingApiShift, Layout>) : void {
		if (!this.highlightService.highlightedItem) return;
		let layout;
		if (this.highlightService.highlightedItem instanceof SchedulingApiShift) {
			layout = layoutData.get(this.highlightService.highlightedItem as ISchedulingApiShift);
		}

		if (layout) layout.z = this.HIGHLIGHTED_SHIFT_Z_VALUE;
	}

	private calculateLayout() : void {
		if (this.schedulingService.urlParam!.calendarMode === CalendarModes.DAY && this.schedulingService.showDayAsList) return;
		if (this.schedulingService.urlParam!.calendarMode === CalendarModes.WEEK && this.schedulingService.showWeekAsList) return;
		if (!this.container) return;

		const columns = this.getColumns();
		this.sortShifts(columns);
		this.calculateVerticalPositions(columns);
		this.calculateZValues(columns);
		this.calculateHorizontalPositionsInUnits(columns);
		const calendarWidthInUnits = this.getCalendarWidthInUnits(columns);

		const pixelsPerUnit = this.calculatePixelsPerUnit(calendarWidthInUnits);
		if (pixelsPerUnit !== null)
			this.calculateAbsoluteHorizontalPositions(columns, pixelsPerUnit);

		this.layoutData = this.getLayoutMap(columns);
		this.updateZValueForHighlightedShift(this.layoutData);

		const newLineLayout = this.calcNowLineLayout();

		if (newLineLayout !== null)
			this.layoutData.set(this.NOW_LINE, newLineLayout);
	}

	private calcNowLineLayout() : ILayout | null {
		if (this.containerHeight === null || this.containerWidth === null || this.layoutData === null)
			return null;

		// "now" is not in current view?
		const now = this.pMoment.m();

		if (now.valueOf() < this.schedulingService.shiftsStart || now.valueOf() >= this.schedulingService.shiftsEnd)
			return null;

		// calc y-value
		const nowTimeAsTimestamp = +now - +now.startOf('day');
		const nowTimeAsHours = this.pMoment.duration(nowTimeAsTimestamp).asHours();
		const y = this.containerHeight / 24 * nowTimeAsHours;

		// calc layout
		const layout = new Layout();
		layout.height = 1;
		layout.z = this.NOW_LINE_Z_VALUE;
		layout.y = y;

		if (this.schedulingService.urlParam!.calendarMode === CalendarModes.WEEK) {
			// let extend it over current day
			const currentDayStart = +now.startOf('day');
			const currentDayLayout = notUndefined(this.layoutData.get(currentDayStart));

			layout.x = currentDayLayout.x;
			layout.width = currentDayLayout.width;
		} else {
			// line should go over whole container
			layout.x = 0;
			layout.width = this.containerWidth;
		}

		return layout;
	}
}
