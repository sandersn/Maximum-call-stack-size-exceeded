
import { NgxPopperjsContentComponent, NgxPopperjsPlacements, NgxPopperjsTriggers } from 'ngx-popperjs';
import { Subject } from 'rxjs';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OnDestroy, AfterContentInit} from '@angular/core';
import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { Router } from '@angular/router';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { PMoment} from '@plano/client/shared/p-moment.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiHolidays } from '@plano/shared/api';
import { SchedulingApiAbsences } from '@plano/shared/api';
import { SchedulingApiMember } from '@plano/shared/api';
import { SchedulingApiAbsence, SchedulingApiHoliday } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiHolidayType } from '@plano/shared/api';
import { Assertions } from '@plano/shared/core/assertions';
import { Config } from '@plano/shared/core/config';
import { Data } from '@plano/shared/core/data/data';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { PlanoFaIconPoolValues } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../../../shared/core/null-type-utils';
import { CalendarModes } from '../../../../../calendar-modes';
import { SchedulingApiBirthday } from '../../../../api/scheduling-api-birthday.service';
import { SchedulingApiBirthdays } from '../../../../api/scheduling-api-birthday.service';
import { CalendarAllDayItemType } from '../../../calender-all-day-item-layout.service';

@Component({
	selector: 'p-all-day-item[item][items][startOfDay][popperPlacement]',
	templateUrl: './p-all-day-item.component.html',
	styleUrls: ['./p-all-day-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PAllDayItemComponent implements OnDestroy, AfterContentInit {
	@Input() public item ! : CalendarAllDayItemType;

	@Input() public items ! : SchedulingApiAbsences | SchedulingApiHolidays | SchedulingApiBirthdays;

	@ViewChild('tooltipRef', { static: true }) private popperContent ! : NgxPopperjsContentComponent;
	@Input() public popperPlacement ! : NgxPopperjsPlacements;

	@Input() public startOfDay ! : number;

	@Input() public readMode : boolean = false;

	private ngUnsubscribe : Subject<void> = new Subject<void>();
	private subscription : ISubscription | null = null;

	constructor(
		private api : SchedulingApiService,
		private highlightService : HighlightService,
		private schedulingService : SchedulingService,
		private router : Router,
		public rightsService : RightsService,
		private localize : LocalizePipe,
		private pMoment : PMomentService,
		private datePipe : PDatePipe,
	) {
		// update tooltip visibility
		this.subscription = this.highlightService.onChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe( () => {
			// Performance: Explicitly check if this day of this all-day-item is highlighted (by passing this.startOfDay)
			// or otherwise "this.popperContent.show()" will be called for each day of the item.
			const highlighted = this.highlightService.isHighlighted(this.item, this.startOfDay);
			assumeDefinedToGetStrictNullChecksRunning(this.popperContent, 'this.popperContent');
			const tooltipVisible = this.popperContent.displayType !== 'none';

			if (highlighted && !tooltipVisible) {
				this.popperContent.show();
				// window.setTimeout(() => {
				// 	this.changeDetectorRef.detectChanges();
				// }, 0);
			} else if (!highlighted && tooltipVisible) {
				this.popperContent.hide();
			}
		});
	}

	public NgxPopperjsTriggers = NgxPopperjsTriggers;
	public PlanoFaIconPool = PlanoFaIconPool;
	public Config = Config;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isSwitzerland() : boolean | undefined {
		if (!this.api.isLoaded()) return undefined;
		return this.api.isSwitzerland;
	}

	public ngAfterContentInit() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.startOfDay, 'startOfDay');
		assumeDefinedToGetStrictNullChecksRunning(this.item, 'item');
		Assertions.ensureIsDayStart(this.startOfDay);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isHoliday() : boolean {
		return this.item instanceof SchedulingApiHoliday;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isAbsence() : boolean {
		return this.item instanceof SchedulingApiAbsence;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isBirthday() : boolean {
		return this.item instanceof SchedulingApiBirthday;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get typeTitle() : string | undefined {
		if (!(this.item instanceof SchedulingApiHoliday)) return undefined;

		switch (this.item.type) {
			case SchedulingApiHolidayType.SCHOOL_HOLIDAYS :
				return this.localize.transform('Schulferien');
			case SchedulingApiHolidayType.FESTIVE_DAY :
				return this.localize.transform('Ist ein Festtag und kein gesetzlicher Feiertag');
			case SchedulingApiHolidayType.NATIONAL_HOLIDAY :
				return this.localize.transform('Ist ein gesetzlicher Feiertag');
			default :
				return undefined;
		}
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get style() : PThemeEnum.LIGHT | PThemeEnum.DARK | PThemeEnum.INFO {
		if (this.item instanceof SchedulingApiHoliday) return PThemeEnum.LIGHT;
		if (this.item instanceof SchedulingApiAbsence) return PThemeEnum.DARK;
		return PThemeEnum.INFO;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get icon() : PlanoFaIconPoolValues | null {
		if (this.item instanceof SchedulingApiHoliday) return null;
		if (this.item instanceof SchedulingApiAbsence) return this.item.typeIconName;
		return PlanoFaIconPool.BIRTHDAY;
	}

	private containsString(input : string) : boolean | undefined {
		if (this.item instanceof SchedulingApiAbsence) return undefined;
		if (this.item instanceof SchedulingApiHoliday) {
			if (this.item.name.includes(input)) return true;
			return false;
		}
		return this.item.lastName.includes(input) || this.item.firstName.includes(input);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get federalState() : string | null {
		return (this.item instanceof SchedulingApiHoliday) ? 	this.item.federalState : null;
	}

	private get titleEmoji() : string | undefined {
		if (this.item instanceof SchedulingApiAbsence) return undefined;
		if (this.item instanceof SchedulingApiHoliday) {
			// emoji version 6 is the highest version we support.
			switch (this.item.type) {
				case SchedulingApiHolidayType.FESTIVE_DAY :
					return this.titleEmojiForFestiveDay;
				case SchedulingApiHolidayType.NATIONAL_HOLIDAY :
					return this.titleEmojiForNationalHoliday;
				case SchedulingApiHolidayType.SCHOOL_HOLIDAYS :
					return this.titleEmojiForSchoolHolidays;
				default :
					return undefined;
			}
		}
		return undefined;
	}

	private get titleEmojiForFestiveDay() : string | undefined {
		// TODO: Support other Languages
		if (this.containsString('Silvester')) return '🌟';
		if (this.containsString('Palmsonntag')) return '🌴';
		if (this.containsString('Vatertag')) return '👨';
		if (this.containsString('Valentinstag')) return '💚';
		if (this.containsString('Halloween')) return '🎃';
		if (this.containsString('Rosenmontag')) return '🌹';
		if (this.containsString('Fastnacht')) return '🎭';
		if (this.containsString('Advent')) return '🎄';
		if (this.containsString('Heiligabend')) return '🎄';
		if (this.containsString('Muttertag')) return '👩';
		if (this.containsString('Nikolaus')) return '🎅';
		if (this.containsString('Gründonnerstag')) return '🍵';
		return undefined;
	}

	private get titleEmojiForNationalHoliday() : string | undefined {
		// if (this.containsString('Buß- und Bettag')) return '🙏';
		// if (this.containsString('Neujahr')) return '🎆';
		// if (this.containsString('Heilige Drei Könige')) return '👑👑👑';
		// if (this.containsString('Karfreitag')) return '✝';
		if (this.containsString('Ostermontag')) return '🐰';
		if (this.containsString('Tag der Arbeit')) return '💪';
		if (this.containsString('Christi Himmelfahrt')) return '✝ 🚀';
		// if (this.containsString('Pfingstmontag')) return '✝';
		// if (this.containsString('Fronleichnam')) return '✝';
		if (this.containsString('Augsburger Friedensfest')) return '☮️';
		// if (this.containsString('Mariä Himmelfahrt')) return '✝';
		// if (this.containsString('Tag der Deutschen Einheit')) return '🇩🇪';
		// if (this.containsString('Reformationstag')) return '✝';
		// if (this.containsString('Allerheiligen')) return '✝';
		if (this.containsString('Weihnacht')) return '🎄';
		return undefined;
	}

	private get titleEmojiForSchoolHolidays() : string | undefined {
		if (this.containsString('Winterferien')) return '⛄️';
		// if (this.containsString('Osterferien')) return '';
		// if (this.containsString('Pfingstferien')) return '';
		if (this.containsString('Sommerferien')) return '🌻';
		if (this.containsString('Herbstferien')) return '🍂';
		if (this.containsString('Weihnachtsferien')) return '⛄️';
		return undefined;
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get title() : string | undefined {
		if (this.item instanceof SchedulingApiAbsence) {
			if (this.member) {
				return `${this.member.firstName} ${this.member.lastName}`;
			}
			return undefined;
		}
		if (this.item instanceof SchedulingApiHoliday) {
			let result = '';
			if (this.titleEmoji) result += `${this.titleEmoji} `;
			result += this.item.name;

			return result;
		}
		if (this.item instanceof SchedulingApiBirthday) {
			return `${this.item.firstName} ${this.item.lastName}`;
		}
		return undefined;
	}

	public ngOnDestroy() : void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
		this.subscription?.unsubscribe();
	}

	private _isFirstItemOfItem : Data<boolean> = new Data<boolean>(this.api);
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isFirstItemOfItem() : boolean {
		return this._isFirstItemOfItem.get(() => {
			const item = this.item;

			let itemStart : number;

			if (item instanceof SchedulingApiBirthday) {
				const lastRequestedDate = +this.api.getLastLoadSearchParams()!.get('start')!;
				const startOfDayForYear = item.startBasedOnCalendarRequest(lastRequestedDate, this.pMoment);
				// get item interval (start and end of day)
				itemStart = this.getStartOf(startOfDayForYear, 'day');
			} else {
				itemStart = item.time.start;
			}

			return itemStart >= this.startOfDay;
		});
	}

	private getStartOf(timestamp : number, unitOfTime : PMoment.unitOfTime.Base) : number {
		return this.pMoment.m(timestamp).startOf(unitOfTime).valueOf();
	}

	private getEndOf(timestamp : number, unitOfTime : PMoment.unitOfTime.Base) : number {
		return this.pMoment.m(timestamp).add(1, unitOfTime).startOf(unitOfTime).valueOf();
	}

	private _isLastItemOfItem : Data<boolean> = new Data<boolean>(this.api);
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isLastItemOfItem() : boolean {
		return this._isLastItemOfItem.get(() => {
			const item = this.item;

			let itemEnd : number;

			if (item instanceof SchedulingApiBirthday) {
				const lastRequestedDate = +this.api.getLastLoadSearchParams()!.get('start')!;
				const startOfDayForYear = item.startBasedOnCalendarRequest(lastRequestedDate, this.pMoment);
				// get item interval (start and end of day)
				itemEnd = this.getEndOf(startOfDayForYear, 'day');
			} else {
				itemEnd = item.time.end;
			}

			return itemEnd <= +this.pMoment.m(this.startOfDay).add(1, 'day');
		});
	}

	private _isStartOfBar : Data<boolean> = new Data<boolean>(this.api);

	/**
	 * Is this the start day of a week?
	 */
	public get isStartOfBar() : boolean {
		return this._isStartOfBar.get(() => {
			if (this.schedulingService.urlParam!.calendarMode === CalendarModes.DAY) return true;
			if (
				this.schedulingService.urlParam!.calendarMode === CalendarModes.MONTH &&
				this.pMoment.m(this.startOfDay).date() === 1
			) return true;
			return this.pMoment.m(this.startOfDay).weekday() === 0;
		});
	}

	private _isEndOfBar : Data<boolean> = new Data<boolean>(this.api);

	/**
	 * Is this the end day of a week?
	 */
	public get isEndOfBar() : boolean {
		return this._isEndOfBar.get(() => {
			if (this.schedulingService.urlParam!.calendarMode === CalendarModes.DAY) return true;
			if (
				this.schedulingService.urlParam!.calendarMode === CalendarModes.MONTH &&
				+this.pMoment.m(this.startOfDay).endOf('day') === +this.pMoment.m(this.startOfDay).add(1, 'months').date(0).endOf('day')
			) return true;
			return this.pMoment.m(this.startOfDay).weekday() === 6;
		});
	}

	private formattedTime(timestamp : number) : ReturnType<PDatePipe['transform']> {
		if (
			this.item instanceof SchedulingApiHoliday ||
			this.item instanceof SchedulingApiAbsence && this.item.isFullDay
		) {
			return this.datePipe.transform(timestamp, 'shortDate');
		}

		const start = this.item.time.start;
		const end = this.item.time.end;
		if (this.pMoment.m(start).isSame(end, 'day')) {
			return this.datePipe.transform(timestamp, 'shortTime');
		}
		return `${this.datePipe.transform(timestamp, 'shortDate')} ${this.datePipe.transform(timestamp, 'shortTime')}`;
	}

	private _start : Data<string | null> = new Data<string | null>(this.api);

	/**
	 * Start Date/Time
	 */
	public get start() : string | null {
		return this._start.get(() => {
			const start = this.item.time.start;
			return this.formattedTime(start);
		});
	}

	private _end : Data<string | null> = new Data<string | null>(this.api);

	/**
	 * End Date/Time
	 */
	public get end() : string | null {
		return this._end.get(() => {
			const end = this.item.time.end;
			if (end === +this.pMoment.m(end).startOf('day')) {
				const timestamp = end - 1;
				return this.datePipe.transform(timestamp, 'shortDate');
			}
			return this.formattedTime(end);
		});
	}

	/**
	 * Should bar-info be visible?
	 */
	public get hasBarInfo() : boolean {
		return (
			this.isFirstItemOfItem ||
			this.isStartOfBar
		);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get member() : SchedulingApiMember | null {
		if (this.item instanceof SchedulingApiHoliday) return null;
		return this.api.data.members.get(this.item.memberId);
	}

	/**
	 * Is this part of the absence highlighted?
	 */
	public get isHighlighted() : boolean {
		return this.highlightService.isHighlighted(this.item, this.startOfDay);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isHighlightedItem() : boolean {
		return this.highlightService.isHighlighted(this.item);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isHovered() : boolean {
		return this.item.isHovered;
	}

	public set isHovered(input : boolean) {
		this.item.isHovered = input;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get muteItem() : boolean {
		return this.highlightService.isMuted(this.item);
	}

	/**
	 * Mark item as highlighted
	 */
	public onClick( event : MouseEvent) : void {
		if (this.isHighlighted) {
			this.highlightService.setHighlighted(null);
		} else {
			this.highlightService.setHighlighted(this.item, this.startOfDay);
		}

		// a click on the calendar makes unset the highlightedShift.
		event.stopPropagation();
	}

	/**
	 * Nav to detail form of this absence
	 */
	public navToDetailForm() : void {
		if (!(this.item instanceof SchedulingApiAbsence) && !(this.item instanceof SchedulingApiHoliday)) return;
		this.highlightService.setHighlighted(null);
		this.router.navigate([`client/absence/${this.item.id.toString()}`]);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showEditButton() : boolean {
		if (this.readMode) return false;
		if (this.item instanceof SchedulingApiHoliday) return false;
		if (this.item instanceof SchedulingApiAbsence) {
			if (!this.rightsService.userCanWriteAbsences) return false;
			return true;
		}
		return false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get tooltipTitle() : string | undefined {
		if (this.item instanceof SchedulingApiHoliday) return undefined;
		if (this.item instanceof SchedulingApiAbsence) return this.localize.transform(this.item.title!);
		return `${this.item.firstName} ${this.item.lastName}`;
	}
}
