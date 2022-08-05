import { AfterContentInit, OnDestroy} from '@angular/core';
import { ChangeDetectorRef, Component, ContentChildren, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PFormControlComponentChildInterface, PFormControlComponentInterface } from '@plano/client/shared/p-forms/p-form-control.interface';
import { ApiAttributeInfo } from '@plano/shared/api/base/api-attribute-info';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { LogService } from '@plano/shared/core/log.service';
import { PFormControlSwitchItemComponent } from './p-form-control-switch-item/p-form-control-switch-item.component';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { AttributeInfoComponentBaseDirective } from '../../p-attribute-info/attribute-info-component-base';
import { EditableControlInterface, EditableDirective } from '../../p-editable/editable/editable.directive';
import { PInputImageComponent } from '../input-image/input-image.component';
import { PCheckboxComponent } from '../p-checkbox/p-checkbox.component';
import { PFormControl, PFormGroup } from '../p-form-control';
import { PFormGroupComponent } from '../p-form-group/p-form-group.component';
import { PInputDateComponent } from '../p-input-date/p-input-date.component';
import { PInputComponent } from '../p-input/p-input.component';
import { PRadiosComponent } from '../p-radios/p-radios.component';

export enum FormControlSwitchType {
	CHECKBOX = 'CHECKBOX',
	INPUT = 'INPUT',
	TEXTAREA = 'TEXTAREA',
	RADIOS = 'RADIOS',
	DROPDOWN = 'DROPDOWN',
	DATE_PICKER = 'DATE_PICKER',
	IMAGE_UPLOAD = 'IMAGE_UPLOAD',
}

/**
 * A component that decides which form-control to show based on the attribute type.
 * The default (e.g. <input> for attribute type 'string') can be overwritten with e.g. type="TEXTAREA"
 *
 * Sometimes you will reach the limits of this component. If you need a more customized form-control like for example a
 * p-input with a custom icon and a type-ahead array, you will need to
 * a: use a <p-form-group> with a <p-input> inside, instead of <p-form-control-switch>
 * or
 * b: Ask a Frontend-Dev to implement the feature into <p-form-control-switch>
 *
 * NOTE: 	To the frontend dev’s: Be careful with new flags and features. This component tends to get cluttered quickly,
 * 				since it has to solve so many sub-cases.
 *
 * @example
 * shows a input
 * <p-form-control-switch
 * 	label="Name" i18n-label
 * 	[attributeInfo]="item.attributeInfoName"
 * 	[group]="formGroup"
 * ></p-form-control-switch>
 *
 * @example
 * shows a checkbox
 * <p-form-control-switch
 * 	label="Is Awesome" i18n-label
 * 	description="Because I'm a cute text over an info-circle."
 * 	[attributeInfo]="item.attributeInfoIsAwesome"
 * 	[group]="formGroup"
 * ></p-form-control-switch>
 *
 * @example
 * shows a editable input
 * <p-form-control-switch
 * 	[pEditable]="true"
 * 	[api]="api"
 *
 * 	label="Is Awesome" i18n-label
 * 	[attributeInfo]="item.attributeInfoIsAwesome"
 * 	[group]="formGroup"
 * ></p-form-control-switch>
 */
@Component({
	selector: 'p-form-control-switch[attributeInfo][group]',
	templateUrl: './p-form-control-switch.component.html',
	styleUrls: ['./p-form-control-switch.component.scss'],
})
export class PFormControlSwitchComponent extends AttributeInfoComponentBaseDirective implements AfterContentInit,
PFormControlComponentInterface, OnDestroy {

	@Input('readMode') private _readMode : PFormControlComponentInterface['readMode'] = null;

	/**
	 * The attributeInfo that should be added to the form.
	 * @example
	 *   attributeInfo="member.attributeInfoFirstName"
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	@Input() public override attributeInfo! : ApiAttributeInfo<any, any>;

	private _group : PFormGroup | null = null;

	/**
	 * PFormGroup for the PFormControl that is related to the provided attributeInfo.
	 */
	// TODO: PLANO-FE-3EQ Get rid of ` | undefined`. Group should always be defined.
	public get group() : PFormGroup {
		return this._group!;
	}
	@Input() public set group(input : PFormGroup) {
		this._group = input;
	}

	/**
	 * The default ui element (e.g. <input> for attribute type 'string') can be overwritten here.
	 * @example
	 *   type="TEXTAREA"
	 */
	@Input('type') public _type ?: FormControlSwitchType;

	/**
	 * The text that should be shown if there is no value yet.
	 * Obviously has no effect to non-string and non-number inputs like checkbox, radios, dropdown, etc.
	 */
	@Input() public placeholder : string | null = null;

	@Output() public valueChange = new EventEmitter<unknown>();

	/**
	 * The button text that is shown to the user.
	 * Only used in if the type is CHECKBOX.
	 */
	@Input() public valueText : PCheckboxComponent['valueText'] = null;

	@Input('label') private _label : PFormGroupComponent['label'] | null = null;
	@Input() public description : PFormGroupComponent['description'] = null;

	@Input() public durationUIType : PInputComponent['durationUIType'] = null;
	@Input() public maxDecimalPlacesCount : PInputComponent['maxDecimalPlacesCount'] = null;
	@Input() public supportsUndefined : PInputDateComponent['supportsUndefined'] = false;
	@Input() public showEraseValueBtn : PInputDateComponent['showEraseValueBtn'] = false;
	@Input() public inputGroupAppendText : PInputComponent['inputGroupAppendText'] = null;
	@Input() public inputGroupAppendIcon : PInputComponent['inputGroupAppendIcon'] = null;
	@Input() public eraseValueBtnLabel : PInputDateComponent['eraseValueBtnLabel'] = null;
	@Input() public theme : PCheckboxComponent['theme'] = null;

	@Input() public inputDateType : PInputDateComponent['type'] = null;

	@Input() public previewTemplate : PInputImageComponent['previewTemplate'] | null = null;

	@Input() public checkTouched : PFormControlComponentInterface['checkTouched'] = null;

	@Input('cannotEditHint') public override _cannotEditHint : PFormControlComponentChildInterface['cannotEditHint'] = null;

	/**
	 * Should the password strength meter be visible?
	 * Only use this if type is Password.
	 */
	@Input() public showPasswordMeter : PInputComponent['showPasswordMeter'] = false;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	@Input() public dropdownValue : any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	@Output() public dropdownValueChange = new EventEmitter<any>();

	constructor(
		protected override console : LogService,
		private pFormsService : PFormsService,
		protected override changeDetectorRef : ChangeDetectorRef,
	) {
		super(true, changeDetectorRef, console);
	}

	@ContentChildren(PFormControlSwitchItemComponent) public items ?: QueryList<PFormControlSwitchItemComponent>;

	/**
	 * Is the input in only read mode or is editable (default)?
	 */
	public get readMode() : boolean | null {
		if (this._readMode !== null) return this._readMode;
		if (this.attributeInfo.readMode) return this.attributeInfo.readMode;
		const control = this.group.controls[this.attributeInfo.id] as PFormControl | undefined;
		if (control?.isReadMode) return control.isReadMode;
		return null;
	}

	/**
	 * Is the input in only read mode or is editable (default)?
	 */
	public override get cannotEditHint() : PFormControlComponentChildInterface['cannotEditHint'] {
		if (this._cannotEditHint !== null) return this._cannotEditHint;
		const aICannotEditHint = this.attributeInfo.vars.cannotEditHint;
		if (aICannotEditHint) {
			return typeof aICannotEditHint === 'string' ? aICannotEditHint : aICannotEditHint();
		}
		return null;
	}

	/**
	 * The label of the input field
	 * Don't forget to append i18n-label
	 */
	public get label() : string | null {
		if (this._label) return this._label;
		const control = this.group.controls[this.attributeInfo.id] as PFormControl | undefined;
		if (control?.labelText) return control.labelText;
		return null;
	}

	private _control : PFormControl | null = null;

	/**
	 * The PFormControl that is related to the provided attributeInfo.
	 */
	public get control() : PFormControl {
		const IS_FIRST_GET = this._control === null;
		assumeDefinedToGetStrictNullChecksRunning(this.group, 'group');
		this._control = this.pFormsService.getByAI(this.group, this.attributeInfo, this._label ?? undefined);
		if (IS_FIRST_GET) this.changeDetectorRef.markForCheck();
		return this._control;
	}

	private removeFormControl() : void {
		const control = this.group.controls[this.attributeInfo.id] as PFormControl | undefined;
		if (!control) return;
		control.unsubscribe();
		this.group.removeControl(this.attributeInfo.id);
		// this.console.debug(`Removed control ${this.attributeInfo.id}`);
		this.group.updateValueAndValidity();
		requestAnimationFrame(() => {
			this.changeDetectorRef.detectChanges();
		});
	}

	public ngOnDestroy() : void {
		this.removeFormControl();
		this.changeDetectorRef.detectChanges();
	}

	/**
	 * Turns a multiple input field from checkboxes into a dropdown
	 * if there is more than 3 items
	 */
	private multiSelectUiFormControl() : FormControlSwitchType.RADIOS | FormControlSwitchType.DROPDOWN | FormControlSwitchType {
		if (this._type) return this._type;
		if (this.items && this.items.length <= 3) return FormControlSwitchType.RADIOS;
		return FormControlSwitchType.DROPDOWN;
	}

	/**
	 * Determines the type of an input a return a matching input field for
	 * @example a datepicker or a password fiel with hidden input
	 */
	public get typeOfUIFormControl() : FormControlSwitchType {
		if (this._type !== undefined) return this._type;
		const primitiveType = this.attributeInfo.primitiveType;

		// The user added items?
		// Then the user seems to want some kind of multi-select ui form control,
		// no matter if it fits to the provided primitiveType or not.
		if (this.items?.length) return this.multiSelectUiFormControl();

		switch (primitiveType) {
			case PApiPrimitiveTypes.ShiftId:
			case PApiPrimitiveTypes.ShiftSelector:
			case PApiPrimitiveTypes.Id:
			case PApiPrimitiveTypes.any:
			case PApiPrimitiveTypes.string:
			case PApiPrimitiveTypes.number:
			case PApiPrimitiveTypes.Currency:
			case PApiPrimitiveTypes.Password:
			case PApiPrimitiveTypes.PostalCode:
			case PApiPrimitiveTypes.Minutes:
			case PApiPrimitiveTypes.Hours:
			case PApiPrimitiveTypes.Days:
			case PApiPrimitiveTypes.Percent:
			case PApiPrimitiveTypes.Months:
			case PApiPrimitiveTypes.Years:
			case PApiPrimitiveTypes.Email:
			case PApiPrimitiveTypes.Integer:
			case PApiPrimitiveTypes.LocalTime:
			case PApiPrimitiveTypes.Tel:
			case PApiPrimitiveTypes.Duration:
			case PApiPrimitiveTypes.Search:
			case PApiPrimitiveTypes.Url:
			case PApiPrimitiveTypes.Iban:
			case PApiPrimitiveTypes.Bic:
				return FormControlSwitchType.INPUT;
			case PApiPrimitiveTypes.boolean:
				return FormControlSwitchType.CHECKBOX;
			case PApiPrimitiveTypes.DateTime:
			case PApiPrimitiveTypes.DateExclusiveEnd:
			case PApiPrimitiveTypes.Date:
				return FormControlSwitchType.DATE_PICKER;
			case PApiPrimitiveTypes.Enum:
				if (this.items?.length && this.items.length <= 3) return FormControlSwitchType.RADIOS;
				return FormControlSwitchType.DROPDOWN;
			case PApiPrimitiveTypes.Image:
				return FormControlSwitchType.IMAGE_UPLOAD;
			case PApiPrimitiveTypes.ApiList:
				throw new Error('PFormControlSwitchComponent does not support visualization of PApiPrimitiveTypes.ApiList.');
			case null:
				throw new Error(`could not get state null`);
			default:
				// throw new Error(`Type ${PApiPrimitiveTypes[primitiveType]} is not implemented in p-form-control-switch yet.`);
				const NEVER : never = primitiveType;
				throw new Error(`could not get state ${NEVER}`);
		}
	}

	/**
	 * Is there an exclusive end of an interval?
	 */
	public get isExclusiveEnd() : boolean | null {
		if (this.attributeInfo.primitiveType === PApiPrimitiveTypes.DateExclusiveEnd) return true;
		return null;
	}

	private validateImageUploadAttributes() : void {
		if (this.typeOfUIFormControl !== FormControlSwitchType.IMAGE_UPLOAD) return;
		if (
			this.saveChangesHook !== undefined ||
			!!this.onSaveStart.observers.length ||
			!!this.onSaveSuccess.observers.length ||
			!!this.onDismiss.observers.length ||
			!!this.onLeaveCurrent.observers.length ||
			!!this.editMode.observers.length ||
			this.checkTouched !== null
		) {
			this.console.error('Not implemented yet.');
		}

	}

	public override ngAfterContentInit() : never {
		this.validateImageUploadAttributes();
		if (this.typeOfUIFormControl !== FormControlSwitchType.INPUT && !!this.inputGroupAppendText) {
			this.console.error(`<p-form-control-switch [inputGroupAppendText]="…" is only available if typeOfUIFormControl is ${FormControlSwitchType.INPUT}.`);
		}
		if (this.typeOfUIFormControl !== FormControlSwitchType.IMAGE_UPLOAD && !!this.previewTemplate) {
			this.console.error(`<p-form-control-switch [previewTemplate]="…" is only available if typeOfUIFormControl is ${FormControlSwitchType.IMAGE_UPLOAD}.`);
		}

		// if (this.label === undefined) {
		// 	this.console.error('Label must be defined here.');
		// 	this._label = this.attributeInfo.name;
		// }

		if (this.placeholder !== null) {
			switch (this.typeOfUIFormControl) {
				case FormControlSwitchType.CHECKBOX:
				case FormControlSwitchType.RADIOS:
				case FormControlSwitchType.IMAGE_UPLOAD:
					throw new Error(`Placeholder is not available on type ${this.typeOfUIFormControl}.`);
				default:
			}
		}

		this.initValues();

		return super.ngAfterContentInit();
	}

	private initValues() : void {
		if (this.checkTouched === null) this.checkTouched = this.attributeInfo.isNewItem();
	}

	/**
 * Can the user edit the input field?
 */
	public get isEditable() : boolean {
		if (this.pEditable !== null)
			return this.pEditable;
		else
			return !this.attributeInfo.isNewItem();
	}

	/**
	 * Show milliseconds since 1970
	 */
	public get showTimeInput() : PInputDateComponent['showTimeInput'] {
		if (this.attributeInfo.primitiveType === PApiPrimitiveTypes.DateTime) return true;
		return null;
	}

	/**
	 * Decide if the circle-icons of radio buttons should be visible.
	 */
	public get hideRadioCircles() : PRadiosComponent['hideRadioCircles'] {
		// If every item has an defined icon, there is no need for radio-circles.
		return !this.items?.find(item => !item.icon);
	}

	// These are necessary Inputs and Outputs for pEditable form-element
	@Input() public pEditable : EditableControlInterface['pEditable'] | null = null;

	/**
	 * No Api necessary. attributeInfo.api will be used instead.
	 */
	// @Input() public api : EditableControlInterface['api'] = null;
	@Input() public valid : EditableControlInterface['valid'] = null;
	@Input() public saveChangesHook ?: EditableControlInterface['saveChangesHook'];
	@Output() public onSaveStart : EditableControlInterface['onSaveStart'] = new EventEmitter();
	@Output() public onSaveSuccess : EditableControlInterface['onSaveSuccess'] = new EventEmitter();
	@Output() public onDismiss : EditableDirective['onDismiss'] = new EventEmitter();
	@Output() public onLeaveCurrent : EditableControlInterface['onLeaveCurrent'] = new EventEmitter();
	@Output() public editMode : EditableControlInterface['editMode'] = new EventEmitter<boolean>(undefined);

	/**
	 * Returns true if the input of the user is valid
	 */
	public get isValid() : boolean {
		if (this.valid !== null) return this.valid;
		const control = this.group.controls[this.attributeInfo.id] as PFormControl | undefined;
		return !control?.invalid;
	}

	@Input('pInputType') private _pInputType : PInputComponent['type'] | null = null;

	/**
	 * A getter that returns the primitive type for <p-input>. It throws if <p-input> does not support ai’s primitive type.
	 */
	public get pInputType() : PInputComponent['type'] {
		if (this._pInputType) return this._pInputType;
		switch (this.attributeInfo.primitiveType) {
			case PApiPrimitiveTypes.Enum:
			case PApiPrimitiveTypes.Date:
			case PApiPrimitiveTypes.DateExclusiveEnd:
			case PApiPrimitiveTypes.DateTime:
			case PApiPrimitiveTypes.Id:
			case PApiPrimitiveTypes.Image:
			case PApiPrimitiveTypes.ShiftId:
			case PApiPrimitiveTypes.ShiftSelector:
			case PApiPrimitiveTypes.any:
			case PApiPrimitiveTypes.boolean:
			case PApiPrimitiveTypes.ApiList:
				throw new Error('unsupported primitiveType for p-input');
			default:
				assumeDefinedToGetStrictNullChecksRunning(this.attributeInfo.primitiveType, 'this.attributeInfo.primitiveType');
				return this.attributeInfo.primitiveType;
		}
	}

	/**
	 * Handle dropdown click
	 */
	public onInputItemClick(item : PFormControlSwitchItemComponent, event : unknown) : void {
		item.onClick.emit(event);
	}

}
