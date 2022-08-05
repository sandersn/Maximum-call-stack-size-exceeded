import { AfterContentInit} from '@angular/core';
import { Component, TemplateRef, ChangeDetectionStrategy, ViewChild, forwardRef, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor} from '@angular/forms';
import { NG_VALUE_ACCESSOR, UntypedFormArray } from '@angular/forms';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { EditableControlInterface, EditableDirective } from '@plano/client/shared/p-editable/editable/editable.directive';
import { SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiBooking } from '@plano/shared/api';
import { SchedulingApiShiftExchangeCommunicationSwapOfferShiftRef } from '@plano/shared/api';
import { SchedulingApiShiftExchange} from '@plano/shared/api';
import { SchedulingApiShiftExchangeShiftRef, SchedulingApiShiftExchangeCommunicationSwapOffer } from '@plano/shared/api';
import { SchedulingApiMember, SchedulingApiShifts, SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiShiftExchangeShiftRefs } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PPossibleErrorNames } from '@plano/shared/core/validators.types';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { PShiftExchangeService } from '../../p-shift-exchange/shift-exchange.service';
import { PShiftPickerService } from '../p-shift-picker.service';
import { PShiftPickerComponent } from '../p-shift-picker/p-shift-picker.component';
import { PossibleShiftPickerValueItemType } from '../p-shift-picker/p-shift-picker.component';
import { PossibleShiftPickerValueType } from '../shift-picker-picked-offers/shift-picker-picked-offers.component';

type ValueType = PossibleShiftPickerValueType;

@Component({
	selector: 'p-shift-picker-modal-box[availableShifts][offersRef]',
	templateUrl: './p-shift-picker-modal-box.component.html',
	styleUrls: ['./p-shift-picker-modal-box.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PShiftPickerModalBoxComponent),
			multi: true,
		},
	],
})
export class PShiftPickerModalBoxComponent
implements ControlValueAccessor, EditableControlInterface, AfterContentInit {
	@Input() public readMode : boolean = false;
	@Output() public calendarBtnClick : EventEmitter<SchedulingApiShiftExchangeShiftRef> = new EventEmitter<SchedulingApiShiftExchangeShiftRef>();
	@Input() public loadDetailedItem : SchedulingApiBooking | SchedulingApiShiftExchange | SchedulingApiShift | null = null;

	@Input() public member : SchedulingApiMember | null = null;
	@Input() public availableShifts ! : SchedulingApiShifts;

	// @ViewChild('pEditableModalBox', { static: true }) private pEditableModalBox !: PEditableModalBoxComponent;

	@Input() public shiftTemplate : TemplateRef<unknown> | null = null;

	@Input() public offersRef ! : SchedulingApiShiftExchangeShiftRefs;

	@ViewChild('shiftPickerRef', { static: false }) private shiftPickerRef ?: PShiftPickerComponent;

	@Output() public addItem : EventEmitter<PossibleShiftPickerValueItemType> =
		new EventEmitter<PossibleShiftPickerValueItemType>();
	@Output() public onAddShifts : EventEmitter<SchedulingApiShifts> = new EventEmitter<SchedulingApiShifts>();

	/**
	 * Triggers when modal gets opened
	 */
	@Output() private onModalOpen : EventEmitter<undefined> = new EventEmitter();

	/**
	 * Triggers when modal gets closed
	 */
	@Output() private onModalClosed : EventEmitter<undefined> = new EventEmitter();

	/**
	 * With this boolean you can hide the calendarBtn even if calendarBtnClick has observers
	 */
	@Input('showCalendarBtn') private _showCalendarBtn : boolean | null = null;

	constructor(
		private console : LogService,
		public pShiftExchangeService : PShiftExchangeService,
		private pShiftPickerService : PShiftPickerService,
		private modalService : ModalService,
		private localize : LocalizePipe,
		private changeDetectorRef : ChangeDetectorRef,
		private rightsService : RightsService,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;

	public readonly CONFIG : typeof Config = Config;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftRefs() : PossibleShiftPickerValueType {
		const array = new SchedulingApiShiftExchangeShiftRefs(null, false);
		for (const control of this.formArray!.controls) {
			array.push(control.value);
		}
		return array;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get sortedShiftRefs() : SchedulingApiShiftExchangeShiftRef[] {
		return this.offersRef.iterableSortedBy((item : SchedulingApiShiftExchangeShiftRef) => {
			const shift = this.api!.data.shifts.get(item.id);
			if (!shift) throw new Error('Could not find shift');

			return shift.start;
		});
	}

	public ngAfterContentInit() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
	}

	/**
	 * Load necessary data for this modal
	 */
	public openModalSubscriber() : void {
		this.console.debug('open Modal');

		// This is a hack to reduce the "Freezing modal slide-in animation" effect.
		window.setTimeout(() => {
			assumeDefinedToGetStrictNullChecksRunning(this, 'this');
			if (this.shiftPickerRef) this.shiftPickerRef.loadNewData();
		}, 350);

		this.onModalOpen.emit();
	}

	private get giveUserAHintAboutUnusedSelectedShifts() : boolean {
		return !!this.availableShifts.selectedItems.length;
	}

	public beforeModalClose : (result : () => void) => void = (success : () => void) => {
		if (!this.giveUserAHintAboutUnusedSelectedShifts) {
			success();
			return;
		}
		this.modalService.confirm({
			modalTitle: this.localize.transform('Sicher?'),
			description: this.localize.transform('Du hast Schichten im Kalender selektiert, aber sie nicht der Tauschbörse hinzugefügt.'),
			closeBtnLabel: this.localize.transform('Trotzdem schließen'),
			dismissBtnLabel: this.localize.transform('Zurück'),
		}, {
			success: () => {
				this.api!.data.shifts.selectedItems.setSelected(false);
				success();
			},
			theme: PThemeEnum.WARNING,
			size: BootstrapSize.MD,
		});
	};

	/**
	 * Save changes
	 */
	public closeModalSubscriber() : void {
		this.console.debug('close Modal');
		this.onModalClosed.emit();
	}

	// These are necessary Inputs and Outputs for pEditable form-element
	@Input() public pEditable : EditableControlInterface['pEditable'] = false;
	@Input() public api : SchedulingApiService | null = null;
	@Input() public valid : EditableControlInterface['valid'] = null;
	@Input() public saveChangesHook ?: EditableControlInterface['saveChangesHook'];
	@Output() public onSaveStart : EditableControlInterface['onSaveStart'] = new EventEmitter();
	@Output() public onSaveSuccess : EditableControlInterface['onSaveSuccess'] = new EventEmitter();
	@Output() public onDismiss : EditableDirective['onDismiss'] = new EventEmitter();
	@Output() public onLeaveCurrent : EditableControlInterface['onLeaveCurrent'] = new EventEmitter();
	@Output() public editMode : EditableControlInterface['editMode'] = new EventEmitter<boolean>(undefined);
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isValid() : boolean {
		return this.valid !== null ? this.valid : (!this.formArray || !this.formArray.invalid);
	}

	/**
	 * This is the minimum code that is required for a custom control in Angular.
	 * Its necessary to make [(ngModel)] and [formControl] work.
	 */
	@Input() public disabled : boolean = false;
	// eslint-disable-next-line @typescript-eslint/ban-types
	@Input() public formArray : UntypedFormArray | null = null;

	@Input('required') private _required : boolean = false;

	/**
	 * Is this a required field?
	 * This can be set as Input() but if there is a formControl binding,
	 * then it takes the info from the formControl’s validators.
	 */
	public get required() : boolean {
		if (this._required) return this._required;
		if (this.formArray) {
			const validator = this.formArray.validator?.(this.formArray);
			if (!validator) return false;
			return !!validator[PPossibleErrorNames.REQUIRED] || !!validator[PPossibleErrorNames.ID_DEFINED] || !!validator[PPossibleErrorNames.NOT_UNDEFINED];
		}
		return false;
	}

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
		// Refresh the formArray. #two-way-binding
		this.disabled ? this.formArray?.disable() : this.formArray?.enable();
	}

	/**
	 * Highlight the related shift in the calendar. This action is made for the Scheduling site.
	 */
	public onCalendarClick(shiftRef : SchedulingApiShiftExchangeShiftRef) : void {
		this.calendarBtnClick.emit(shiftRef);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showCalendarBtn() : boolean {
		if (this._showCalendarBtn !== null) return this._showCalendarBtn;
		return !!this.calendarBtnClick.observers.length;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onRemoveOffer(offer : PossibleShiftPickerValueItemType | SchedulingApiShiftExchangeShiftRefs) : void {
		this.pShiftPickerService.onRemoveOffer(this.formArray!, this.offersRef, offer);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public removeFromOffer(
		shiftRef : SchedulingApiShiftExchangeCommunicationSwapOfferShiftRef | SchedulingApiShiftExchangeShiftRef,
		offer : SchedulingApiShiftExchangeCommunicationSwapOffer,
	) : void {
		if (shiftRef instanceof SchedulingApiShiftExchangeShiftRef) {
			this.onRemoveOffer(shiftRef);
		} else if (offer instanceof SchedulingApiShiftExchangeCommunicationSwapOffer) {
			offer.shiftRefs.removeItem(shiftRef);
			this.formArray!.updateValueAndValidity();
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get labelText() : string | undefined {
		if (this.formArray?.length) return undefined;
		return this.localize.transform('Bitte wählen…');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftPickerBtnLabel() : string | undefined {
		if (this.formArray!.length >= 2) return undefined;
		if (Config.IS_MOBILE) return undefined;
		return this.localize.transform('Schichten hinzufügen');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isMe() : boolean | null {
		if (!this.member) return null;
		return this.rightsService.isMe(this.member.id) ?? null;
	}
}
