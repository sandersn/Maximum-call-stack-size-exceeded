import { Component, Input, forwardRef, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor} from '@angular/forms';
import { NG_VALUE_ACCESSOR, UntypedFormArray } from '@angular/forms';
import { SLIDE_ON_NGIF_TRIGGER } from '@plano/animations';
import { BookingSystemRights } from '@plano/client/accesscontrol/rights-enums';
import { PParticipantsService } from '@plano/client/booking/detail-form/p-participants/p-participants.service';
import { BootstrapSize, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { EditableControlInterface, EditableDirective } from '@plano/client/shared/p-editable/editable/editable.directive';
import { PFormControl, PFormGroup } from '@plano/client/shared/p-forms/p-form-control';
import { PShiftmodelTariffService } from '@plano/client/shared/p-forms/p-shiftmodel-tariff.service';
import { SchedulingApiShiftModelCourseTariffs, SchedulingApiShiftModelCourseTariff } from '@plano/shared/api';
import { SchedulingApiBookingParticipant } from '@plano/shared/api';
import { SchedulingApiBooking } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PPossibleErrorNames } from '../../../../../../../shared/core/validators.types';

type ValueType = Id | null;

/**
 * A component for selecting one of the available tariffs for a course-booking.
 */

export class FormArrayWithFormGroups extends UntypedFormArray {
	public override controls : PFormGroup[] = [];
}

@Component({
	selector: 'p-tariff-input[booking]',
	templateUrl: './p-tariff-input.component.html',
	styleUrls: ['./p-tariff-input.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PTariffInputComponent),
			multi: true,
		},
	],
	animations: [
		SLIDE_ON_NGIF_TRIGGER,
	],
})
export class PTariffInputComponent implements ControlValueAccessor, EditableControlInterface {
	public CONFIG : typeof Config = Config;

	/**
	 * Form array for all the tariffs
	 */
	@Input() public formArray : FormArrayWithFormGroups | null = null;

	/**
	 * The participant the tariff should be applied to
	 */
	@Input() public participant : SchedulingApiBookingParticipant | null = null;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get tariffsAreCustomizable() : boolean {
		return this.formArray !== null;
	}

	// These are necessary Inputs and Outputs for pEditable form-element
	@Input() public pEditable : EditableControlInterface['pEditable'] = false;
	@Input() public api : EditableControlInterface['api'] = null;
	@Input() public valid : EditableControlInterface['valid'] = null;
	@Input() public saveChangesHook ?: EditableControlInterface['saveChangesHook'];
	@Output() public onSaveStart : EditableControlInterface['onSaveStart'] = new EventEmitter();
	@Output() public onSaveSuccess : EditableControlInterface['onSaveSuccess'] = new EventEmitter();
	@Output() public onDismiss : EditableDirective['onDismiss'] = new EventEmitter();
	@Output() public onLeaveCurrent : EditableControlInterface['onLeaveCurrent'] = new EventEmitter();
	@Output() public editMode : EditableControlInterface['editMode'] = new EventEmitter<boolean>(undefined);

	/** Is this valid? [valid]="…" overwrites the valid state if the formControl. */
	public get isValid() : boolean {
		if (this.valid !== null) return this.valid;
		return !this.formControl?.invalid;
	}

	@Input() public participantCount : number = 1;
	@Input() public booking ! : SchedulingApiBooking;

	constructor(
		private changeDetectorRef : ChangeDetectorRef,
		private pParticipantsService : PParticipantsService,
		private pShiftmodelTariffService : PShiftmodelTariffService,
		private rightsService : RightsService,
		private modalService : ModalService,
		private localize : LocalizePipe,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public PThemeEnum = PThemeEnum;

	/**
	 * Is this the currently selected tariff?
	 */
	private isSelectedTariff(tariffId : Id) : boolean {
		return tariffId.equals(this.value);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public tariffRadioIsDisabled(courseTariff : SchedulingApiShiftModelCourseTariff) : boolean {
		if (this.disabled) return true;
		if (this.pShiftmodelTariffService.tariffRadioIsDisabled(courseTariff, this.value)) return true;

		return false;
	}

	/**
	 * get all tariffs for the list.
	 * Only show trashed items if they are selected.
	 */
	public get courseTariffsForList() : SchedulingApiShiftModelCourseTariffs {
		return this.pParticipantsService.courseTariffsForList(this.booking, this.value);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public onClick(input : Id) : void {
		this.value = input;
	}

	/**
	 * This is the minimum code that is required for a custom control in Angular.
	 * Its necessary to make [(ngModel)] and [formControl] work.
	 */
	@Input() public disabled : boolean = false;
	@Input() public formControl : PFormControl | null = null;

	@Input('required') private _required : boolean = false;

	/**
	 * Is this a required field?
	 * This can be set as Input() but if there is a formControl binding,
	 * then it takes the info from the formControl’s validators.
	 * TODO: 	Replace this by:
	 * 				return this.formControlInitialRequired();
	 */
	public get required() : boolean {
		if (this._required) return this._required;

		if (this.formControl) {
			const validator = this.formControl.validator?.(this.formControl);
			if (!validator) return false;
			return !!validator[PPossibleErrorNames.REQUIRED] || !!validator[PPossibleErrorNames.ID_DEFINED] || !!validator[PPossibleErrorNames.NOT_UNDEFINED];
		}
		return false;
	}

	private _value : ValueType | null = null;
	public onChange : (value : ValueType | null) => void = () => {};
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

	/**
	 * A place to temporary store all uncollapsed courseTariff forms.
	 */
	private visibleTariffIds : Id[] = [];

	/**
	 * Show courseTariff details/form.
	 */
	public toggleTariff(courseTariff : SchedulingApiShiftModelCourseTariff) : void {
		if (this.isUncollapsedTariff(courseTariff)) {
			const index = this.visibleTariffIds.indexOf(courseTariff.id.rawData);
			this.visibleTariffIds.splice(index, 1);
		} else {
			this.visibleTariffIds.push(courseTariff.id.rawData);
		}
	}

	/**
	 * Is this tariff uncollapsed?
	 */
	public isUncollapsedTariff(courseTariff : SchedulingApiShiftModelCourseTariff) : boolean {
		if (this.editTariffBtnIsDisabled(courseTariff.id)) return false;
		return this.visibleTariffIds.includes(courseTariff.id.rawData);
	}

	/**
	 * Is the edit button disabled?
	 * Only the selected tariff is enabled
	 */
	public editTariffBtnIsDisabled(tariffId : Id) : boolean {
		return !this.isSelectedTariff(tariffId) || this.itsNotPossibleToCreateCustomTariff;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showEditTariffBtn() : boolean {
		if (this.rightsService.can(BookingSystemRights.createCustomTariffs, this.booking.model)) return true;
		return false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get itsNotPossibleToCreateCustomTariff() : boolean {

		/**
		 * TODO: [PLANO-10646]
		 * HACK: Caused by PLANO-10644
		 */
		if (this.booking.isNewItem() && !this.booking.model.onlyWholeCourseBookable) return true;

		return false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public tariffNotAvailableThatTime(
		tariff : SchedulingApiShiftModelCourseTariff,
	) : boolean {
		let start = this.booking.firstShiftStart;
		if (!start && this.booking.courseSelector) start = this.booking.courseSelector.start;
		return this.pShiftmodelTariffService.tariffIsAvailableAtDate(tariff, start) === false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public onClickTariffRadio(
		tariff : SchedulingApiShiftModelCourseTariff | null = null,
	) : void {
		const SUCCESS_CALLBACK = () : void => {
			const NEW_VALUE = !tariff ? undefined : tariff.id;
			this.value = NEW_VALUE!;
		};

		if (this.tariffNotAvailableThatTime(tariff!)) {
			this.modalService.confirm({
				modalTitle: this.localize.transform('Bist du sicher?'),
				description: this.localize.transform('Dieser Tarif gilt nicht zum gewählten Angebotsdatum.'),
			}, {
				success: () => {
					SUCCESS_CALLBACK();
				},
				dismiss: () => {},
				size: BootstrapSize.SM,
				theme: PThemeEnum.WARNING,
			});
		} else {
			SUCCESS_CALLBACK();
		}
	}

	// TODO: Obsolete?
	// eslint-disable-next-line jsdoc/require-jsdoc
	public hasCourseDatesData(courseTariff : SchedulingApiShiftModelCourseTariff) : boolean {
		return this.pShiftmodelTariffService.hasCourseDatesData(
			courseTariff.negateForCourseDatesInterval,
			courseTariff.forCourseDatesFrom,
			courseTariff.forCourseDatesUntil,
		);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public forCourseDatesPlaceholder(time : number) : string | null {
		return !time ? this.localize.transform('Unbegrenzt') : null;
	}
}
