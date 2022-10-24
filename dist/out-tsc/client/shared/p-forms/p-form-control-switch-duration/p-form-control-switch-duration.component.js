var _a;
import { __decorate, __metadata } from "tslib";
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ApiAttributeInfo } from '../../../../shared/api/base/api-attribute-info';
import { PApiPrimitiveTypes } from '../../../../shared/api/base/generated-types.ag';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { PFormsService } from '../../../service/p-forms.service';
import { PFormGroup } from '../p-form-control';
import { FormControlSwitchType } from '../p-form-control-switch/p-form-control-switch.component';
/**
 * This is a peace of crap.
 * I was frustrated when i created it. So better avoid it.
 * @deprecated
 */
let PFormControlSwitchDurationComponent = class PFormControlSwitchDurationComponent {
    constructor(pFormsService, changeDetectorRef) {
        this.pFormsService = pFormsService;
        this.changeDetectorRef = changeDetectorRef;
        this.label = null;
        this.description = null;
        this.maxDecimalPlacesCount = null;
        this._durationUIType = null;
        /**
         * Options that gets available in the appending dropdown
         */
        this.options = [
            {
                text: 'Tage',
                value: PApiPrimitiveTypes.Days,
            },
            {
                text: 'Unbegrenzt',
                value: null,
            },
        ];
        /**
         * @see PFormControlSwitchComponent.placeholder
         */
        this.placeholder = null;
        this.inputGroupAppendIcon = null;
        this._dropdownValue = null;
        this.viewInitialized = false;
        this.subscription = null;
        this.FormControlSwitchType = FormControlSwitchType;
        this.PApiPrimitiveTypes = PApiPrimitiveTypes;
    }
    /**
     * The type of this value
     */
    get durationUIType() {
        return this._durationUIType;
    }
    set durationUIType(input) {
        this._durationUIType = input;
        if (this.dropdownValue !== this._durationUIType)
            this.dropdownValue = this._durationUIType;
    }
    /**
     * Some unique value that is represented by the selected dropdown item.
     */
    get dropdownValue() {
        return this._dropdownValue;
    }
    set dropdownValue(input) {
        if (this._dropdownValue === input)
            return;
        this._dropdownValue = input;
        const formControl = this.group.get(this.attributeInfo.id);
        if (!formControl)
            return;
        // We need to prevent the value to change when the component loads initially
        if (!this.viewInitialized)
            return;
        if (input === null) {
            const newValue = null;
            formControl.setValue(newValue);
        }
        else {
            formControl.setValue(undefined);
            // Enable this now, so the next check will notice that the form is invalid. Disabled inputs are never considered
            // to a validation check.
            formControl.enable();
        }
        formControl.markAsTouched();
        formControl.markAsDirty();
        this.changeDetectorRef.detectChanges();
    }
    ngAfterViewInit() {
        this.viewInitialized = true;
    }
    ngAfterContentChecked() {
        this.validateComponentValues();
        const formControl = this.group.get(this.attributeInfo.id);
        if (!formControl)
            return;
        if (this.dropdownValue === null) {
            if (formControl.enabled)
                formControl.disable({ onlySelf: true, emitEvent: false });
        }
        else {
            if (!formControl.enabled)
                formControl.enable({ onlySelf: true, emitEvent: false });
        }
    }
    validateComponentValues() {
        switch (this.attributeInfo.primitiveType) {
            case PApiPrimitiveTypes.Duration:
            case PApiPrimitiveTypes.Years:
            case PApiPrimitiveTypes.Months:
            case PApiPrimitiveTypes.Days:
            case PApiPrimitiveTypes.Hours:
            case PApiPrimitiveTypes.Minutes:
                break;
            default:
                throw new TypeError('Unexpected primitiveType');
        }
    }
    ngOnDestroy() {
        var _a;
        if (!this.attributeInfo.apiObjWrapper.rawData)
            return; // Reference got lost e.g. due to api.save()
        const formControl = this.group.get(this.attributeInfo.id);
        if (!formControl)
            return;
        if (formControl.disabled)
            formControl.enable({ emitEvent: false, onlySelf: true });
        (_a = this.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
    initDropdownValue() {
        assumeDefinedToGetStrictNullChecksRunning(this.attributeInfo.primitiveType, 'attributeInfo.primitiveType');
        if (this.attributeInfo.value === null && this.options.some(item => item.value === null)) {
            this.dropdownValue = null;
            return;
        }
        this.dropdownValue = this.durationUIType;
    }
    ngAfterContentInit() {
        this.initDropdownValue();
        const formControl = this.pFormsService.getByAI(this.group, this.attributeInfo);
        this.subscription = formControl.valueChanges.subscribe((newValue) => {
            if (newValue > 0)
                this.dropdownValue = PApiPrimitiveTypes.Days;
        });
    }
};
__decorate([
    Input(),
    __metadata("design:type", PFormGroup)
], PFormControlSwitchDurationComponent.prototype, "group", void 0);
__decorate([
    Input(),
    __metadata("design:type", ApiAttributeInfo)
], PFormControlSwitchDurationComponent.prototype, "attributeInfo", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchDurationComponent.prototype, "label", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchDurationComponent.prototype, "description", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchDurationComponent.prototype, "maxDecimalPlacesCount", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], PFormControlSwitchDurationComponent.prototype, "durationUIType", null);
__decorate([
    Input(),
    __metadata("design:type", Array)
], PFormControlSwitchDurationComponent.prototype, "options", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchDurationComponent.prototype, "placeholder", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchDurationComponent.prototype, "inputGroupAppendIcon", void 0);
PFormControlSwitchDurationComponent = __decorate([
    Component({
        selector: 'p-form-control-switch-duration[group]',
        templateUrl: './p-form-control-switch-duration.component.html',
        styleUrls: ['./p-form-control-switch-duration.component.scss'],
    }),
    __metadata("design:paramtypes", [PFormsService, typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object])
], PFormControlSwitchDurationComponent);
export { PFormControlSwitchDurationComponent };
//# sourceMappingURL=p-form-control-switch-duration.component.js.map