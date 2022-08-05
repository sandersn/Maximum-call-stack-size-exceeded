import { HttpParams } from '@angular/common/http';
import { AfterContentInit} from '@angular/core';
import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor} from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { SchedulingFilterService } from '@plano/client/scheduling/scheduling-filter.service';
import { PCalendarShiftStyle } from '@plano/client/scheduling/shared/p-scheduling-calendar/p-shift-item-module/shift-item/shift-item-styles';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { ShiftAndShiftModelFormTabs } from '@plano/client/shared/component/p-shift-and-shiftmodel-form/p-shift-and-shiftmodel-form.component';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { PEditableModalBoxComponent } from '@plano/client/shared/p-editable-forms/p-editable-modal-box/p-editable-modal-box.component';
import { EditableControlInterface, EditableDirective } from '@plano/client/shared/p-editable/editable/editable.directive';
import { activeEditable } from '@plano/client/shared/p-editable/editable/editable.directive';
import { PFormControl } from '@plano/client/shared/p-forms/p-form-control';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiShift, SchedulingApiShifts, SchedulingApiAbsence, SchedulingApiHoliday} from '@plano/shared/api';
import { SchedulingApiAbsences, SchedulingApiHolidays, SchedulingApiService } from '@plano/shared/api';
import { ShiftId } from '@plano/shared/api';
import { SchedulingApiBooking } from '@plano/shared/api';
import { SchedulingApiBookingState } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { LogService } from '../../../../shared/core/log.service';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../shared/core/null-type-utils';
import { BirthdayService } from '../../../scheduling/shared/api/birthday.service';
import { SchedulingApiBirthdays } from '../../../scheduling/shared/api/scheduling-api-birthday.service';

type ValueType = ShiftId | null;

@Component({
	selector: 'p-shift-selection[api][booking]',
	templateUrl: './p-shift-selection.component.html',
	styleUrls: ['./p-shift-selection.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PShiftSelectionComponent),
			multi: true,
		},
	],
})
export class PShiftSelectionComponent implements ControlValueAccessor, AfterContentInit, EditableControlInterface {
	public readonly CONFIG : typeof Config = Config;
	@Input() public booking ! : SchedulingApiBooking;

	public selectedDate ! : number;
	public calendarMode : CalendarModes = CalendarModes.MONTH;

	@Input() public showAsList : boolean = false;
	@Output() public showAsListChange : EventEmitter<boolean> = new EventEmitter();

	public bookingState : typeof SchedulingApiBookingState = SchedulingApiBookingState;

	// These are necessary Inputs and Outputs for pEditable form-element

	// This component is quite special in the way it handles data-copy. Currently it does not support pEditable.
	@Input() public pEditable : false = false;

	@Input() public api ! : SchedulingApiService;
	@Input() public valid : EditableControlInterface['valid'] = null;
	@Input() public saveChangesHook ?: EditableControlInterface['saveChangesHook'];
	@Output() public onSaveStart : EditableControlInterface['onSaveStart'] = new EventEmitter();
	@Output() public onSaveSuccess : EditableControlInterface['onSaveSuccess'] = new EventEmitter();
	@Output() public onDismiss : EditableDirective['onDismiss'] = new EventEmitter();
	@Output() public onLeaveCurrent : EditableControlInterface['onLeaveCurrent'] = new EventEmitter();
	@Output() public editMode : EditableControlInterface['editMode'] = new EventEmitter<boolean>(undefined);

	@Output() public onModalClosed : PEditableModalBoxComponent['onModalClosed'] = new EventEmitter(undefined);
	@Output() public onModalDismissed : PEditableModalBoxComponent['onModalDismissed'] = new EventEmitter(undefined);

	/** Is this valid? [valid]="…" overwrites the valid state if the formControl. */
	public get isValid() : boolean {
		if (this.valid !== null) return this.valid;
		return !this.formControl?.invalid;
	}

	constructor(
		private changeDetectorRef : ChangeDetectorRef,
		private highlightService : HighlightService,
		private schedulingFilterService : SchedulingFilterService,
		private birthdayService : BirthdayService,
		private pMoment : PMomentService,
		private pRouterService : PRouterService,
		private console : LogService,
	) {
	}

	public BootstrapSize = BootstrapSize;
	public PlanoFaIconPool = PlanoFaIconPool;
	public PThemeEnum = PThemeEnum;
	public PCalendarShiftStyle = PCalendarShiftStyle;
	public CalendarModes = CalendarModes;

	public ngAfterContentInit() : void {
		this.initValues();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onOpenModal() : void {
		this.highlightService.clear();
		const startNewDataCopy = () : void => {
			if (!this.booking.isNewItem()) this.api.createDataCopy();
			this.loadNewData(() => {
				const shiftCouldBeSelected = this.selectCurrentlyLinkedShift();
				if (!!this.value && !shiftCouldBeSelected) {
					// This can happen when shift has been trashed.
					this.console.warn(`Shift could not be found in »${this.api.data.shifts.length}« shifts`);
				}
			});
		};
		if (activeEditable) {
			activeEditable.saveChanges(() => {
				startNewDataCopy();
			});
		} else {
			if (!this.booking.isNewItem() && this.api.hasDataCopy()) {
				this.api.dismissDataCopy();
				this.console.error('Some data copy already existed. Dismissed it. Latest user input probably got lost…');
			}
			startNewDataCopy();
		}
	}

	/**
	 * Select the shift that fits to the current value if possible.
	 * @returns Has a shift been selected?
	 */
	private selectCurrentlyLinkedShift() : boolean {
		if (this.value === null) return false;

		const shiftsOfSameModel = this.api.data.shifts.filterBy((item) => {
			return item.id.shiftModelId.equals(this.value!.shiftModelId);
		});

		// This can happen when shift has been trashed.
		if (!shiftsOfSameModel.length) return false;

		const shiftsOfSamePackage = shiftsOfSameModel.filterBy(item => {
			if (!item.packetShifts.length) return false;
			return item.id.isSamePacket(this.value!);
		});

		// Next line can be true, if value belongs to a shift which is not part of a packet
		// if (!shiftsOfSamePackage.length) this.console.error('shiftsOfSamePackage could not be found');

		if (!shiftsOfSamePackage.length) {
			const shift = shiftsOfSameModel.get(this.value);
			if (!shift) return false;
			shift.selected = true;
			return true;
		} else {
			// Get the first shift of this shift-package
			const firstShiftOfPacket = shiftsOfSamePackage.sortedBy(item => item.id.shiftIndex, false).get(0);
			if (!firstShiftOfPacket) return false;
			firstShiftOfPacket.selected = true;
			return true;
		}
	}

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	private initValues() : void {
		if (this.booking.firstShiftStart) {
			this.selectedDate = +this.pMoment.m(this.booking.firstShiftStart).startOf('day');
		} else if (this.booking.courseSelector !== null) {
			this.selectedDate = +this.pMoment.m(this.booking.courseSelector.start).startOf('day');
		} else {
			if (this.selectedDate) return;
			this.selectedDate = +this.pMoment.m().startOf('day');
		}
	}

	/**
	 * Get shifts
	 */
	public get shiftsForCalendar() : SchedulingApiShifts {
		if (this.api.isLoaded()) {
			return this.api.data.shifts.filterBy((shift : SchedulingApiShift) => {
				// Is other shiftModel? Dont!
				if (!shift.id.shiftModelId.equals(this.booking.shiftModelId)) return false;

				if (shift.isCourseCanceled) return false;

				// Is no packet? Show it!
				if (shift.packetShifts.length === 0) return true;

				// Find Id of the first shift in this packet
				let firstPacketShiftId : ShiftId | null = null;
				for (const packetShift of shift.packetShifts.iterable()) {
					if (!firstPacketShiftId || packetShift.id.shiftIndex < firstPacketShiftId.shiftIndex) {
						firstPacketShiftId = packetShift.id;
					}
				}
				assumeNonNull(firstPacketShiftId);
				// Is this shift the first item in this packet? Show it!
				return shift.id.equals(firstPacketShiftId);
			});
		}
		return new SchedulingApiShifts(null, false);
	}

	/**
	 * Get all shifts for calendar
	 */
	public get absencesForCalendar() : SchedulingApiAbsences {
		if (this.schedulingFilterService.hideAllAbsences) return new SchedulingApiAbsences(null, false);
		return this.api.data.absences.filterBy((item : SchedulingApiAbsence) => {
			if (this.schedulingFilterService.hideAllAbsences) return false;
			if (!this.booking.model.assignableMembers.contains(item.memberId)) return false;
			return true;
		});
	}

	/**
	 * Get all holidays for calendar
	 */
	public get holidaysForCalendar() : SchedulingApiHolidays {
		if (this.schedulingFilterService.hideAllHolidays) return new SchedulingApiHolidays(null, false);
		const result = this.api.data.holidays;
		return result.sortedBy([
			(item : SchedulingApiHoliday) => item.time.end,
			(item : SchedulingApiHoliday) => item.time.start,
		// HACK: Dangerous type assertion here
		], false) as SchedulingApiHolidays;
	}

	/**
	 * Get list of birthdays of members in a p-calendar consumable way.
	 */
	public get birthdaysForCalendar() : SchedulingApiBirthdays {
		return this.birthdayService.birthdays;
	}


	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public setSelectedDateAndLoadData(value : number) : void {
		this.selectedDate = value;
		this.loadNewData(() => {
			this.selectCurrentlyLinkedShift();
		});
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public setCalendarModeAndLoadData(value : CalendarModes) : void {
		this.calendarMode = value;
		this.loadNewData(() => {
			this.selectCurrentlyLinkedShift();
		});
	}

	/**
	 * Load new Data
	 */
	private loadNewData(success ?: () => void) : void {
		const start = (
			+this.pMoment.m(this.selectedDate).startOf(this.calendarMode)
		).toString();
		const end = (
			+this.pMoment.m(this.selectedDate).startOf(this.calendarMode).add(1, this.calendarMode)
		).toString();

		if (+start > +end) throw new Error('bookingsStart must be <= bookingsEnd');
		const queryParams = new HttpParams()
			.set('data', 'calendar')
			.set('start', start)
			.set('end', end)
			.set('bookingsStart', start)
			.set('bookingsEnd', end)
			.set('bookingsByShiftTime', 'true')
		;

		if (!this.booking.isNewItem()) {
			this.booking.loadDetailed({
				searchParams: queryParams,
				success: () => {
					if (success) success();
				},
			});
		} else {
			this.api.load({
				searchParams: queryParams,
				success: () => {
					if (success) success();
				},
			});
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftForNewBooking() : SchedulingApiShift | null {
		assumeDefinedToGetStrictNullChecksRunning(this.booking.courseSelector, 'booking.courseSelector');
		return this.api.data.shifts.get(this.booking.courseSelector);
	}

	/**
	 * Check if the related shift is part of a package
	 */
	public get shiftIsPartOfPacket() : boolean {
		if (this.shiftForNewBooking) return !!this.shiftForNewBooking.packetShifts.length;

		if (this.booking.courseSelector !== null) {
			const duration = this.booking.courseSelector.end! - this.booking.courseSelector.start!;
			return duration > (24 * 60 * 60 * 1000);
		}
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public setShiftForBooking() : void {
		const success = () : void => {
			this.initValues();
			this.loadNewData(() => {
				if (this.pEditable as boolean) this.onLeaveCurrent.emit();
			});
		};

		if (!this.booking.isNewItem()) {
			if (this.valid) {
				this.api.mergeDataCopy();
				this.api.save({
					success: () => {
						this.onModalClosed.emit();
						success();
					},
				});
			} else {
				this.dismissShiftForBooking();
				success();
			}
		} else {
			if (this.value !== null) {
				this.booking.courseSelector = this.value;
			} else {
				this.booking.courseSelector = null;
			}
			this.onModalClosed.emit();
			success();
		}
	}

	/**
	 * Dismiss like a editable
	 */
	public dismissShiftForBooking() : void {
		this.api.deselectAllSelections();
		if (!this.booking.isNewItem()) this.api.dismissDataCopy();
		this.onModalDismissed.emit();
		this.initValues();
		this.loadNewData(() => {
			// if (this.pEditable) {
			this.onLeaveCurrent.emit();
			// }
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public removeValue() : void {
		this.api.deselectAllSelections();
		this.value = null;
		if (!this.booking.isNewItem()) this.api.save();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onSelectedChange(shift : SchedulingApiShift) : void {
		this.api.deselectAllSelections();
		shift.selected = true;
		this.value = shift.id;
	}

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
		this.changeDetectorRef.markForCheck();
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

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public navToShift() : void {
		this.pRouterService.navigate([`client/shift/${this.booking.firstShiftSelector!.toUrl()}/${ShiftAndShiftModelFormTabs.bookingsettings}`]);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get someShiftIsSelected() : boolean | null {
		assumeDefinedToGetStrictNullChecksRunning(this.booking.courseSelector, 'booking.courseSelector');
		return this.value && (!!this.booking.firstShiftStart || !!this.api.data.shifts.get(this.booking.courseSelector));
	}
}
