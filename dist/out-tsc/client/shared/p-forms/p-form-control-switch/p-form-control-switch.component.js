var _a, _b;
import { __decorate, __metadata } from "tslib";
import { ChangeDetectorRef, Component, ContentChildren, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { ApiAttributeInfo } from '@plano/shared/api/base/api-attribute-info';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { LogService } from '@plano/shared/core/log.service';
import { PFormControlSwitchItemComponent } from './p-form-control-switch-item/p-form-control-switch-item.component';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { AttributeInfoComponentBaseDirective } from '../../p-attribute-info/attribute-info-component-base';
import { PFormGroup } from '../p-form-control';
export var FormControlSwitchType;
(function (FormControlSwitchType) {
    FormControlSwitchType["CHECKBOX"] = "CHECKBOX";
    FormControlSwitchType["INPUT"] = "INPUT";
    FormControlSwitchType["TEXTAREA"] = "TEXTAREA";
    FormControlSwitchType["RADIOS"] = "RADIOS";
    FormControlSwitchType["DROPDOWN"] = "DROPDOWN";
    FormControlSwitchType["DATE_PICKER"] = "DATE_PICKER";
    FormControlSwitchType["IMAGE_UPLOAD"] = "IMAGE_UPLOAD";
})(FormControlSwitchType || (FormControlSwitchType = {}));
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
let PFormControlSwitchComponent = class PFormControlSwitchComponent extends AttributeInfoComponentBaseDirective {
    constructor(console, pFormsService, changeDetectorRef) {
        super(true, changeDetectorRef, console);
        this.console = console;
        this.pFormsService = pFormsService;
        this.changeDetectorRef = changeDetectorRef;
        this._readMode = null;
        this._group = null;
        /**
         * The text that should be shown if there is no value yet.
         * Obviously has no effect to non-string and non-number inputs like checkbox, radios, dropdown, etc.
         */
        this.placeholder = null;
        this.valueChange = new EventEmitter();
        /**
         * The button text that is shown to the user.
         * Only used in if the type is CHECKBOX.
         */
        this.valueText = null;
        this._label = null;
        this.description = null;
        this.durationUIType = null;
        this.maxDecimalPlacesCount = null;
        this.supportsUndefined = false;
        this.showEraseValueBtn = false;
        this.inputGroupAppendText = null;
        this.inputGroupAppendIcon = null;
        this.eraseValueBtnLabel = null;
        this.theme = null;
        this.inputDateType = null;
        this.previewTemplate = null;
        this.checkTouched = null;
        this._cannotEditHint = null;
        /**
         * Should the password strength meter be visible?
         * Only use this if type is Password.
         */
        this.showPasswordMeter = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.dropdownValueChange = new EventEmitter();
        this._control = null;
        // These are necessary Inputs and Outputs for pEditable form-element
        this.pEditable = null;
        /**
         * No Api necessary. attributeInfo.api will be used instead.
         */
        // @Input() public api : EditableControlInterface['api'] = null;
        this.valid = null;
        this.onSaveStart = new EventEmitter();
        this.onSaveSuccess = new EventEmitter();
        this.onDismiss = new EventEmitter();
        this.onLeaveCurrent = new EventEmitter();
        this.editMode = new EventEmitter(undefined);
        this._pInputType = null;
    }
    /**
     * PFormGroup for the PFormControl that is related to the provided attributeInfo.
     */
    // TODO: PLANO-FE-3EQ Get rid of ` | undefined`. Group should always be defined.
    get group() {
        return this._group;
    }
    set group(input) {
        this._group = input;
    }
    /**
     * Is the input in only read mode or is editable (default)?
     */
    get readMode() {
        if (this._readMode !== null)
            return this._readMode;
        if (this.attributeInfo.readMode)
            return this.attributeInfo.readMode;
        const control = this.group.controls[this.attributeInfo.id];
        if (control === null || control === void 0 ? void 0 : control.isReadMode)
            return control.isReadMode;
        return null;
    }
    /**
     * Is the input in only read mode or is editable (default)?
     */
    get cannotEditHint() {
        if (this._cannotEditHint !== null)
            return this._cannotEditHint;
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
    get label() {
        if (this._label)
            return this._label;
        const control = this.group.controls[this.attributeInfo.id];
        if (control === null || control === void 0 ? void 0 : control.labelText)
            return control.labelText;
        return null;
    }
    /**
     * The PFormControl that is related to the provided attributeInfo.
     */
    get control() {
        var _a;
        const IS_FIRST_GET = this._control === null;
        assumeDefinedToGetStrictNullChecksRunning(this.group, 'group');
        this._control = this.pFormsService.getByAI(this.group, this.attributeInfo, (_a = this._label) !== null && _a !== void 0 ? _a : undefined);
        if (IS_FIRST_GET)
            this.changeDetectorRef.markForCheck();
        return this._control;
    }
    removeFormControl() {
        const control = this.group.controls[this.attributeInfo.id];
        if (!control)
            return;
        control.unsubscribe();
        this.group.removeControl(this.attributeInfo.id);
        // this.console.debug(`Removed control ${this.attributeInfo.id}`);
        this.group.updateValueAndValidity();
        requestAnimationFrame(() => {
            this.changeDetectorRef.detectChanges();
        });
    }
    ngOnDestroy() {
        this.removeFormControl();
        this.changeDetectorRef.detectChanges();
    }
    /**
     * Turns a multiple input field from checkboxes into a dropdown
     * if there is more than 3 items
     */
    multiSelectUiFormControl() {
        if (this._type)
            return this._type;
        if (this.items && this.items.length <= 3)
            return FormControlSwitchType.RADIOS;
        return FormControlSwitchType.DROPDOWN;
    }
    /**
     * Determines the type of an input a return a matching input field for
     * @example a datepicker or a password fiel with hidden input
     */
    get typeOfUIFormControl() {
        var _a, _b;
        if (this._type !== undefined)
            return this._type;
        const primitiveType = this.attributeInfo.primitiveType;
        // The user added items?
        // Then the user seems to want some kind of multi-select ui form control,
        // no matter if it fits to the provided primitiveType or not.
        if ((_a = this.items) === null || _a === void 0 ? void 0 : _a.length)
            return this.multiSelectUiFormControl();
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
                if (((_b = this.items) === null || _b === void 0 ? void 0 : _b.length) && this.items.length <= 3)
                    return FormControlSwitchType.RADIOS;
                return FormControlSwitchType.DROPDOWN;
            case PApiPrimitiveTypes.Image:
                return FormControlSwitchType.IMAGE_UPLOAD;
            case PApiPrimitiveTypes.ApiList:
                throw new Error('PFormControlSwitchComponent does not support visualization of PApiPrimitiveTypes.ApiList.');
            case null:
                throw new Error(`could not get state null`);
            default:
                // throw new Error(`Type ${PApiPrimitiveTypes[primitiveType]} is not implemented in p-form-control-switch yet.`);
                const NEVER = primitiveType;
                throw new Error(`could not get state ${NEVER}`);
        }
    }
    /**
     * Is there an exclusive end of an interval?
     */
    get isExclusiveEnd() {
        if (this.attributeInfo.primitiveType === PApiPrimitiveTypes.DateExclusiveEnd)
            return true;
        return null;
    }
    validateImageUploadAttributes() {
        if (this.typeOfUIFormControl !== FormControlSwitchType.IMAGE_UPLOAD)
            return;
        if (this.saveChangesHook !== undefined ||
            !!this.onSaveStart.observers.length ||
            !!this.onSaveSuccess.observers.length ||
            !!this.onDismiss.observers.length ||
            !!this.onLeaveCurrent.observers.length ||
            !!this.editMode.observers.length ||
            this.checkTouched !== null) {
            this.console.error('Not implemented yet.');
        }
    }
    ngAfterContentInit() {
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
    initValues() {
        if (this.checkTouched === null)
            this.checkTouched = this.attributeInfo.isNewItem();
    }
    /**
 * Can the user edit the input field?
 */
    get isEditable() {
        if (this.pEditable !== null)
            return this.pEditable;
        else
            return !this.attributeInfo.isNewItem();
    }
    /**
     * Show milliseconds since 1970
     */
    get showTimeInput() {
        if (this.attributeInfo.primitiveType === PApiPrimitiveTypes.DateTime)
            return true;
        return null;
    }
    /**
     * Decide if the circle-icons of radio buttons should be visible.
     */
    get hideRadioCircles() {
        var _a;
        // If every item has an defined icon, there is no need for radio-circles.
        return !((_a = this.items) === null || _a === void 0 ? void 0 : _a.find(item => !item.icon));
    }
    /**
     * Returns true if the input of the user is valid
     */
    get isValid() {
        if (this.valid !== null)
            return this.valid;
        const control = this.group.controls[this.attributeInfo.id];
        return !(control === null || control === void 0 ? void 0 : control.invalid);
    }
    /**
     * A getter that returns the primitive type for <p-input>. It throws if <p-input> does not support ai’s primitive type.
     */
    get pInputType() {
        if (this._pInputType)
            return this._pInputType;
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
    onInputItemClick(item, event) {
        item.onClick.emit(event);
    }
};
__decorate([
    Input('readMode'),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "_readMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", ApiAttributeInfo)
], PFormControlSwitchComponent.prototype, "attributeInfo", void 0);
__decorate([
    Input(),
    __metadata("design:type", PFormGroup),
    __metadata("design:paramtypes", [PFormGroup])
], PFormControlSwitchComponent.prototype, "group", null);
__decorate([
    Input('type'),
    __metadata("design:type", String)
], PFormControlSwitchComponent.prototype, "_type", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "placeholder", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "valueChange", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "valueText", void 0);
__decorate([
    Input('label'),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "_label", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "description", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "durationUIType", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "maxDecimalPlacesCount", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "supportsUndefined", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "showEraseValueBtn", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "inputGroupAppendText", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "inputGroupAppendIcon", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "eraseValueBtnLabel", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "theme", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "inputDateType", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "previewTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "checkTouched", void 0);
__decorate([
    Input('cannotEditHint'),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "_cannotEditHint", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "showPasswordMeter", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "dropdownValue", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "dropdownValueChange", void 0);
__decorate([
    ContentChildren(PFormControlSwitchItemComponent),
    __metadata("design:type", typeof (_b = typeof QueryList !== "undefined" && QueryList) === "function" ? _b : Object)
], PFormControlSwitchComponent.prototype, "items", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "pEditable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "valid", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "saveChangesHook", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "onSaveStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "onSaveSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "onDismiss", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "onLeaveCurrent", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "editMode", void 0);
__decorate([
    Input('pInputType'),
    __metadata("design:type", Object)
], PFormControlSwitchComponent.prototype, "_pInputType", void 0);
PFormControlSwitchComponent = __decorate([
    Component({
        selector: 'p-form-control-switch[attributeInfo][group]',
        templateUrl: './p-form-control-switch.component.html',
        styleUrls: ['./p-form-control-switch.component.scss'],
    }),
    __metadata("design:paramtypes", [LogService,
        PFormsService, typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object])
], PFormControlSwitchComponent);
export { PFormControlSwitchComponent };
//# sourceMappingURL=p-form-control-switch.component.js.map