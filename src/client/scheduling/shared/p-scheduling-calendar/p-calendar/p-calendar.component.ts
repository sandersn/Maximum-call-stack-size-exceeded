import { CalendarMonthViewDay } from 'angular-calendar';
import { DAYS_OF_WEEK } from 'calendar-utils';
import { getWeekOfMonth } from 'date-fns';
import * as moment from 'moment-timezone';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { OnInit, TemplateRef, OnDestroy} from '@angular/core';
import { Component, Input, HostListener, ChangeDetectionStrategy, Output, EventEmitter, ViewEncapsulation, ChangeDetectorRef, forwardRef, NgZone, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor} from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { PFormControl } from '@plano/client/shared/p-forms/p-form-control';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiShift} from '@plano/shared/api';
import { SchedulingApiService, SchedulingApiHolidays, SchedulingApiShifts, SchedulingApiAbsences } from '@plano/shared/api';
import { ShiftId } from '@plano/shared/api';
import { Assertions } from '@plano/shared/core/assertions';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { PAllDayItemsListComponent } from './p-all-day-items-list/p-all-day-items-list.component';
import { DateTime } from '../../../../../shared/api/base/generated-types.ag';
import { PComponentInterface } from '../../../../../shared/core/interfaces/component.interface';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../shared/core/null-type-utils';
import { SchedulingApiBirthdays } from '../../api/scheduling-api-birthday.service';
import { PCalendarShiftStyle, ShiftItemViewStyles } from '../p-shift-item-module/shift-item/shift-item-styles';
import { ShiftItemComponent } from '../p-shift-item-module/shift-item/shift-item.component';

type ValueType = ShiftId | null;

@Component({
	selector: 'p-calendar[shifts]',
	templateUrl: './p-calendar.component.html',
	styleUrls: ['./p-calendar.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	encapsulation: ViewEncapsulation.None,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PSchedulingCalendarComponent),
			multi: true,
		},
	],
})
export class PSchedulingCalendarComponent implements PComponentInterface, OnDestroy, OnInit, ControlValueAccessor {
	@Input() public isLoading : PComponentInterface['isLoading'] = false;

	@Input() public shifts ! : SchedulingApiShifts;

	public selectedStartOfDay ! : number;

	/**
	 * CalendarMonthViewComponent needs in in date format
	 */
	public get selectedStartOfDayAsDate() : Date {
		return new Date(this.selectedStartOfDay);
	}

	@Input('selectedStartOfDay') private set _selectedStartOfDay(input : number) {
		Assertions.ensureIsDayStart(input);
		this.selectedStartOfDay = input;
	}

	@Input() public calendarMode : CalendarModes | null = CalendarModes.MONTH;
	@Input() public showAsList : boolean = false;

	@Input('neverShowDayTools') private _neverShowDayTools : boolean = false;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public neverShowDayTools(day : CalendarMonthViewDay) : boolean {
		if (this._neverShowDayTools === true) return true;
		if (this.isOutsideCurrentMonth(+day.date)) return true;
		return false;
	}

	@Input() public shiftStyle : PCalendarShiftStyle = PCalendarShiftStyle.FULL;
	@Input() public multiSelect : boolean = false;

	@Input() public absences : PAllDayItemsListComponent['absences'] = new SchedulingApiAbsences(null, false);
	@Input() public holidays : PAllDayItemsListComponent['holidays'] = new SchedulingApiHolidays(null, false);
	@Input() public birthdays : PAllDayItemsListComponent['birthdays'] = new SchedulingApiBirthdays(null, null, false);

	public ShiftItemViewStyles = ShiftItemViewStyles;

	@Output() public dayClick : EventEmitter<number> = new EventEmitter<number>();

	@Output() public onShiftClick : EventEmitter<{shift : SchedulingApiShift, event : MouseEvent}> = new EventEmitter();

	/**
	 * With this boolean the multi-select checkboxes can be turned off for all shifts
	 */
	@Input() public shiftIsSelectable : boolean = false;

	public readonly CONFIG : typeof Config = Config;

	@HostListener('click') private onClick() : void {
		this.highlightService.setHighlighted(null);
	}

	@Input() public shiftTemplate : TemplateRef<unknown> | null = null;

	private today ! : number;
	private startOfMonth : DateTime | null = null;
	private endOfMonth : DateTime | null = null;
	private apiLoadSubscription : Subscription | null = null;

	constructor(
		public api : SchedulingApiService,
		private highlightService : HighlightService,
		private console : LogService,
		public changeDetectorRef : ChangeDetectorRef,
		private pMoment : PMomentService,
		private zone : NgZone,
	) {
		if (!this.selectedStartOfDay) this.selectedStartOfDay = +this.pMoment.m().startOf('day');

		moment.updateLocale(Config.getLanguageCode(Config.LOCALE_ID), {
			week: {
				dow: DAYS_OF_WEEK.MONDAY,
				doy: 0,
			},
		});

		this.today = +this.pMoment.m().startOf('day');

		this.apiLoadSubscription = this.api.onDataLoaded.subscribe(() => {
			this.startOfMonth = +this.pMoment.m(this.selectedStartOfDay).startOf(this.calendarMode);
			this.endOfMonth = +this.pMoment.m(this.selectedStartOfDay).endOf(this.calendarMode);
		});
	}

	public BootstrapSize = BootstrapSize;
	public CalendarModes = CalendarModes;

	private delayIsActiveStore : { [key : number] : boolean | undefined } = {};

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public resetDelayIsActiveStore() : void {
		this.delayIsActiveStore = {};
		this.changeDetectorRef.markForCheck();
	}

	/**
	 * It was so slow to render the month view if there are a lot of shifts, that we invented this hack…
	 * After data is loaded we immediately show the content for the first week, but…
	 * most likely the other weeks are not visible yet. They are outside the scroll-area. So we fill these areas with
	 * skeletons, and fill these skeletons with content week by week.
	 */
	public delayIsActive(day : CalendarMonthViewDay<unknown> | number) : boolean {
		const date : Date = typeof day === 'number' ? new Date(day) : day.date;
		const weekInMonth = getWeekOfMonth(date, { weekStartsOn: 1 });
		if (weekInMonth === 1) return false;
		if (this.delayIsActiveStore[weekInMonth] === undefined) {
			this.delayIsActiveStore[weekInMonth] = true;
			this.changeDetectorRef.markForCheck();
			window.setTimeout(() => {
				this.delayIsActiveStore[weekInMonth] = false;
				this.changeDetectorRef.markForCheck();
			}, 0);
			return true;
		} else {
			const result = this.delayIsActiveStore[weekInMonth];
			assumeDefinedToGetStrictNullChecksRunning(result, 'result');
			return result;
		}
	}

	@ViewChild('topAnchor', { static: false }) public topAnchor ?: ElementRef<HTMLElement>;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public scrollToTop() : void {
		this.zone.runOutsideAngular(() => {
			requestAnimationFrame(() => {
				if (!this.topAnchor) return;
				// In case of showAsList, other components will handle the scroll
				if (!this.showAsList) return;
				const el = this.topAnchor.nativeElement;
				el.scrollIntoView();
			});
		});
	}

	public ngOnInit() : void {
		this.initNeverShowDayTools();
	}

	private initNeverShowDayTools() : void {
		switch (this.shiftStyle) {
			case PCalendarShiftStyle.OVERVIEW :
			case PCalendarShiftStyle.SHIFT_PICKER :
				this._neverShowDayTools = true;
				break;
			case PCalendarShiftStyle.FULL :
				this._neverShowDayTools = false;
				break;
			default :
				const RESULT : never = this.shiftStyle;
				throw new Error(RESULT);
		}
	}

	/**
	 * If this calendar is in month mode - in wich mode should the shifts be viewed?
	 */
	public get monthShiftStyle() : ShiftItemComponent['viewStyle'] | undefined {
		switch (this.shiftStyle) {
			case PCalendarShiftStyle.SHIFT_PICKER :
				if (this.multiSelect) return ShiftItemViewStyles.MULTI_SELECT;
				return ShiftItemViewStyles.SMALL;
			case PCalendarShiftStyle.OVERVIEW :
			case PCalendarShiftStyle.FULL :
				return ShiftItemViewStyles.SMALL;
		}
	}

	/**
	 * If this calendar is in week mode - in wich mode should the shifts be viewed?
	 */
	public get weekShiftStyle() : ShiftItemComponent['viewStyle'] | undefined {
		switch (this.shiftStyle) {
			case PCalendarShiftStyle.SHIFT_PICKER :
				if (this.multiSelect) return ShiftItemViewStyles.MULTI_SELECT;
				return this.ShiftItemViewStyles.SMALL;
			case PCalendarShiftStyle.OVERVIEW :
			case PCalendarShiftStyle.FULL :
				return ShiftItemViewStyles.SMALL;
		}
	}

	/**
	 * If this calendar is in day mode - in wich mode should the shifts be viewed?
	 */
	public get dayShiftStyle() : ShiftItemComponent['viewStyle'] | undefined {
		switch (this.shiftStyle) {
			case PCalendarShiftStyle.SHIFT_PICKER :
				if (this.multiSelect) return ShiftItemViewStyles.MEDIUM_MULTI_SELECT;
				return ShiftItemViewStyles.MEDIUM;
			case PCalendarShiftStyle.OVERVIEW :
			case PCalendarShiftStyle.FULL :
				return ShiftItemViewStyles.DETAILED;
		}
	}

	/**
	 * Smartphone users get a simpler list-mode then desktop users.
	 * E.g.
	 * Smartphone week: All days in on column
	 * Desktop week: All days in a row
	 */
	public get simpleListMode() : boolean {
		if (Config.IS_MOBILE) return true;
		if (this.calendarMode === CalendarModes.DAY && this.dayShiftStyle === ShiftItemViewStyles.MEDIUM) return true;
		// if (this.showAsList) {
		// 	if (this.calendarMode !== CalendarModes.WEEK && this.calendarMode !== CalendarModes.MONTH) return true;
		// }
		return false;
	}

	private ngUnsubscribe : Subject<void> = new Subject<void>();

	/**
	 * Destroy
	 */
	public ngOnDestroy() : void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();

		this.apiLoadSubscription?.unsubscribe();

		// window.clearInterval(this.interval ?? undefined);

		if (this.api.isLoaded()) {
			this.api.data.shifts.setSelected(false);
		}
	}

	/**
	 * Highlight selected Day
	 */
	public beforeMonthViewRender( { body } : { body : CalendarMonthViewDay[] } ) : void {
		for (const day of body) {
			if (
				this.pMoment.m(day.date).format('DD.MM.YYYY') === this.pMoment.m(this.selectedStartOfDay).format('DD.MM.YYYY')
			) {
				day.cssClass = 'cal-day-selected';
			} else {
				day.cssClass = '';
			}
		}
	}

	/**
	 * on day click emit event if there is a (dayClick)="…" binding
	 * else just refresh the internal selectedStartOfDay
	 */
	public onDayClick(timestamp : number) : void {
		if (this.dayClick.observers.length) {
			this.dayClick.emit(timestamp);
		} else {
			this.selectedStartOfDay = timestamp;
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onSelectedChange(shift : SchedulingApiShift) : void {
		if (this.shiftStyle !== PCalendarShiftStyle.SHIFT_PICKER) return;
		if (shift.selected) {
			this.api.deselectAllSelections();
			shift.selected = true;
			this.value = shift.id;
			return;
		}
		this.api.deselectAllSelections();
		this.value = null;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public markShiftItemAsSelected(shift : SchedulingApiShift) : boolean {
		if (this.shiftStyle !== PCalendarShiftStyle.SHIFT_PICKER) return false;
		if (!this.value) return false;
		return shift.selected;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get readMode() : boolean {
		return this.shiftStyle === PCalendarShiftStyle.SHIFT_PICKER;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public isBeforeToday(
		startOfDay : number,
	) : boolean {
		return this.pMoment.m(startOfDay).isBefore(this.today);
	}

	private isOutsideCurrentMonth(start : number) : boolean {
		const end = start + 1;
		if (this.startOfMonth !== null && this.startOfMonth >= end) return true;
		if (this.endOfMonth === null || this.endOfMonth < start) {
			// HACK: endOfMonth should never be less then selectedStartOfDay
			if (this.endOfMonth === null || this.endOfMonth < this.selectedStartOfDay) {
				this.console.warn('endOfMonth should never be less then selectedStartOfDay');
				this.startOfMonth = +this.pMoment.m(this.selectedStartOfDay).startOf(this.calendarMode);
				this.endOfMonth = +this.pMoment.m(this.selectedStartOfDay).endOf(this.calendarMode);
			}
			return true;
		}
		return false;
	}

	/**
	 * The following code is for the case that this is a shiftPicker
	 */
	/**
	 * This is the minimum code that is required for a custom control in Angular.
	 * Its necessary to make [(ngModel)] and [formControl] work.
	 */
	@Input() public disabled : boolean = false;
	@Input() private formControl : PFormControl | null = null;
	private _value : ValueType | null = null;
	public onChange : (value : ValueType | null) => void = () => {};

	/** onTouched */
	public onTouched = () : void => {};

	/** the value of this control */
	public get value() : ValueType | null { return this._value; }
	public set value(value : ValueType | null) {
		if (value === this._value) return;

		this._value = value;
		this.onChange(value);
	}

	/** Write a new value to the element. */
	public writeValue(value : ValueType) : void {
		if (this._value === value) return;
		this._value = value;
		this.changeDetectorRef.detectChanges();
	}

	/**
	 * @see ControlValueAccessor['registerOnChange']
	 *
	 * Note that registerOnChange() only gets called if a formControl is bound.
	 * @param fn Accepts a callback function which you can call when changes happen so that you can notify the outside world that
	 * the data model has changed.
	 * Note that you call it with the changed data model value.
	 */
	public registerOnChange(fn : (value : ValueType | null) => void) : ReturnType<ControlValueAccessor['registerOnChange']> { this.onChange = fn; }

	/** Set the function to be called when the control receives a touch event. */
	public registerOnTouched(fn : () => void) : void { this.onTouched = fn; }

	/** setDisabledState */
	public setDisabledState(isDisabled : boolean) : void {
		if (this.disabled === isDisabled) return;
		// Set internal attribute which gets used in the template.
		this.disabled = isDisabled;
		// Refresh the formControl. #two-way-binding
		if (this.formControl && this.formControl.disabled !== this.disabled) {
			this.disabled ? this.formControl.disable() : this.formControl.enable();
		}
	}
}
