var _a, _b;
import { __decorate, __metadata } from "tslib";
import { KeyValuePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { RegisterTestAccountApiRoot } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { AsyncValidatorsService } from '@plano/shared/core/async-validators.service';
import { LogService } from '@plano/shared/core/log.service';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PPossibleErrorNames } from '@plano/shared/core/validators.types';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../shared/core/null-type-utils';
import { PFormControl, PFormGroup } from '../shared/p-forms/p-form-control';
let PFormsService = class PFormsService {
    constructor(console, validatorsService, asyncValidatorsService, keyValuePipe, formBuilder) {
        this.console = console;
        this.validatorsService = validatorsService;
        this.asyncValidatorsService = asyncValidatorsService;
        this.keyValuePipe = keyValuePipe;
        this.formBuilder = formBuilder;
    }
    /**
     * Add a FormControl to a FormArray.
     */
    addItemToFormArray(array, value) {
        array.push(new PFormControl({
            formState: {
                value: value,
                disabled: false,
            },
        }));
    }
    /**
     * Get the PFormControl that is related to the provided attributeInfo.
     * If there is no related PFormControl in the provided PFormGroup yet,
     * one will be created and added.
     *
     * @deprecated 	It is dangerous to use this in e.g. a getter. It would always create a new formControl when you 'get'
     * 							it. But we want p-form-control-switch to handle the creation and to destroying of the attributeInfo
     * 							related formControls.
     * 							So don’t use it. Instead do it like this:
     * 							If you want to get it simply write this.group.controls[attributeInfo.id]
     * 							If you want to create it, use pForms.addControlByAttInfo(…)
     */
    getByAI(group, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attributeInfo, label) {
        if (!group.controls[attributeInfo.id])
            this.addControlByAttInfo(group, attributeInfo, label);
        return group.controls[attributeInfo.id];
    }
    /**
     * A Method to create a new PFormControl by passing a ApiAttributeInfo
     */
    addControlByAttInfo(formGroup, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attributeInfo, label, subscribe) {
        const checkIsUsed = attributeInfo.apiObjWrapper instanceof RegisterTestAccountApiRoot;
        const asyncValidators = attributeInfo.primitiveType ? this.getAsyncValidatorsForPrimitiveType(attributeInfo.primitiveType, checkIsUsed) : null;
        this.addPControl(formGroup, attributeInfo.id, {
            formState: {
                value: attributeInfo.value,
                // TODO: This requires this.api to be defined.
                // So i can not use this for unit tests or storybook yet.
                // disabled: !attributeInfo.canEdit,
                disabled: !attributeInfo.canEdit,
            },
            labelText: label !== null && label !== void 0 ? label : null,
            isReadMode: attributeInfo.readMode,
            asyncValidator: asyncValidators !== null && asyncValidators !== void 0 ? asyncValidators : null,
            attributeInfo: attributeInfo,
            subscribe: (newValue) => {
                if (subscribe) {
                    subscribe(newValue);
                }
                else {
                    if (attributeInfo.canEdit && attributeInfo.value !== newValue)
                        attributeInfo.value = newValue;
                }
            },
        });
    }
    /**
     * Very often i need a control with a subscriber.
     * This function is just a helper for easier code writing.
     */
    addPControl(formGroup, name, pFormControlContent) {
        const newControl = new PFormControl(pFormControlContent);
        formGroup.addControl(name, newControl);
        // eslint-disable-next-line @typescript-eslint/ban-types
        newControl.setParent(formGroup);
    }
    /**
     * Remove from formGroup and leave no traces 🤫
     */
    removePControl(formGroup, name) {
        const CONTROL = formGroup.controls[name];
        CONTROL.unsubscribe();
        formGroup.removeControl(name);
    }
    /**
     * @deprecated Please use addPControl instead
     *
     * Very often i need a control with a subscriber.
     * This function is just a helper for easier code writing.
     */
    addControl(tempFormGroup, name, input, validators = [], 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subscribe, asyncValidator) {
        tempFormGroup.addControl(name, new PFormControl({
            formState: {
                value: input.value,
                disabled: input.disabled,
            },
            validatorOrOpts: validators !== null && validators !== void 0 ? validators : null,
            asyncValidator: asyncValidator !== null && asyncValidator !== void 0 ? asyncValidator : null,
            subscribe: subscribe,
        }));
    }
    /**
     * This function is just a helper for easier code writing.
     */
    addArray(tempFormGroup, name, input, validators = [], subscribe, asyncValidator) {
        const newFormArray = new UntypedFormArray(input, validators, asyncValidator);
        tempFormGroup.addControl(name, newFormArray);
        newFormArray.valueChanges.subscribe((value) => {
            if (subscribe) {
                subscribe(value);
            }
        });
    }
    /**
     * Same like addControl, but for PFormGroup
     */
    addFormGroup(parentFormGroup, name, childFormGroup) {
        parentFormGroup.addControl(name, childFormGroup);
    }
    /**
     * This logs all errors of a formGroup to the browser console.
     *
     * NOTE: Sadly it does not log all errors. It has issues with nested formGroups and nested formArrays
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    getFormValidationErrors(formGroup = null) {
        if (!formGroup)
            return null;
        const result = [];
        for (const key of Object.keys(formGroup.controls)) {
            const control = formGroup.get(key);
            if (!control)
                throw new Error(`Could not find control ${key}`);
            const controlErrors = control.errors;
            if (controlErrors === null)
                continue;
            for (const keyError of Object.keys(controlErrors)) {
                result[keyError] = controlErrors[keyError];
                this.console.log(`Key control: ${key}, keyError: ${keyError}, err value: `, controlErrors[keyError]);
            }
        }
        return result;
    }
    /**
     * Get all basic validators that should ALWAYS apply to the provided primitiveType
     */
    getValidatorsForPrimitiveType(primitiveType) {
        switch (primitiveType) {
            case PApiPrimitiveTypes.Date:
            case PApiPrimitiveTypes.DateExclusiveEnd:
            case PApiPrimitiveTypes.DateTime:
            case PApiPrimitiveTypes.Enum:
            case PApiPrimitiveTypes.Id:
            case PApiPrimitiveTypes.LocalTime:
            case PApiPrimitiveTypes.ShiftId:
            case PApiPrimitiveTypes.ShiftSelector:
            case PApiPrimitiveTypes.any:
            case PApiPrimitiveTypes.boolean:
            case PApiPrimitiveTypes.string:
            case PApiPrimitiveTypes.Search:
            case PApiPrimitiveTypes.Image:
            case PApiPrimitiveTypes.ApiList:
            case PApiPrimitiveTypes.Duration:
                return [];
            case PApiPrimitiveTypes.number:
                return [this.validatorsService.number(primitiveType)];
            case PApiPrimitiveTypes.Email:
                return [this.validatorsService.email()];
            case PApiPrimitiveTypes.Url:
                return [this.validatorsService.url()];
            case PApiPrimitiveTypes.Iban:
                return [this.validatorsService.iban()];
            case PApiPrimitiveTypes.Bic:
                return [this.validatorsService.bic()];
            case PApiPrimitiveTypes.PostalCode:
                return [this.validatorsService.plz()];
            case PApiPrimitiveTypes.Tel:
                return [this.validatorsService.phone()];
            case PApiPrimitiveTypes.Password:
                return [this.validatorsService.password()];
            case PApiPrimitiveTypes.Currency:
                return [
                    this.validatorsService.currency(),
                ];
            case PApiPrimitiveTypes.Integer:
                return [this.validatorsService.maxDecimalPlacesCount(0, primitiveType)];
            case PApiPrimitiveTypes.Minutes:
            case PApiPrimitiveTypes.Hours:
            case PApiPrimitiveTypes.Days:
            case PApiPrimitiveTypes.Years:
            case PApiPrimitiveTypes.Months:
                return [
                    this.validatorsService.min(0, true, primitiveType),
                    this.validatorsService.maxDecimalPlacesCount(0, primitiveType),
                ];
            case PApiPrimitiveTypes.Percent:
                return [
                    this.validatorsService.min(0, true, primitiveType),
                ];
        }
    }
    /**
     * Get all async validators that should ALWAYS apply to the provided primitiveType
     */
    getAsyncValidatorsForPrimitiveType(primitiveType, checkIsUsed = false) {
        switch (primitiveType) {
            case PApiPrimitiveTypes.Date:
            case PApiPrimitiveTypes.DateExclusiveEnd:
            case PApiPrimitiveTypes.DateTime:
            case PApiPrimitiveTypes.Enum:
            case PApiPrimitiveTypes.Id:
            case PApiPrimitiveTypes.LocalTime:
            case PApiPrimitiveTypes.ShiftId:
            case PApiPrimitiveTypes.ShiftSelector:
            case PApiPrimitiveTypes.any:
            case PApiPrimitiveTypes.boolean:
            case PApiPrimitiveTypes.number:
            case PApiPrimitiveTypes.string:
            case PApiPrimitiveTypes.Search:
            case PApiPrimitiveTypes.Url:
            case PApiPrimitiveTypes.Iban:
            case PApiPrimitiveTypes.Bic:
            case PApiPrimitiveTypes.PostalCode:
            case PApiPrimitiveTypes.Tel:
            case PApiPrimitiveTypes.Password:
            case PApiPrimitiveTypes.Currency:
            case PApiPrimitiveTypes.Integer:
            case PApiPrimitiveTypes.Duration:
            case PApiPrimitiveTypes.Minutes:
            case PApiPrimitiveTypes.Hours:
            case PApiPrimitiveTypes.Days:
            case PApiPrimitiveTypes.Percent:
            case PApiPrimitiveTypes.Months:
            case PApiPrimitiveTypes.Years:
            case PApiPrimitiveTypes.Image:
            case PApiPrimitiveTypes.ApiList:
                return [];
            case PApiPrimitiveTypes.Email:
                return [this.asyncValidatorsService.emailValidAsync(checkIsUsed)];
        }
    }
    getMinErrors(keyValueArray) {
        return keyValueArray.filter(error => {
            if (error.key === PPossibleErrorNames.MIN)
                return true;
            if (error.key === PPossibleErrorNames.GREATER_THAN)
                return true;
            return false;
        });
    }
    getFormattingErrors(keyValueArray) {
        return keyValueArray.filter(error => {
            if (error.key === PPossibleErrorNames.FLOAT)
                return true;
            if (error.key === PPossibleErrorNames.INTEGER)
                return true;
            if (error.key === PPossibleErrorNames.NUMBER_NAN)
                return true;
            return false;
        });
    }
    getTypeRelatedFormattingErrors(keyValueArray) {
        return keyValueArray.filter(error => error.key === PPossibleErrorNames.CURRENCY);
    }
    getDetailedFormattingErrors(keyValueArray) {
        return keyValueArray.filter(error => error.key === PPossibleErrorNames.MAX_DECIMAL_PLACES_COUNT);
    }
    /**
     * Errors that should be shown to the UI transformed to a array objects with key/value pairs.
     */
    visibleErrors(formControl) {
        if (formControl.errors === null)
            return [];
        if (!Object.values(formControl.errors).length)
            return [];
        const keyValueArray = this.keyValuePipe.transform(formControl.errors);
        const MIN_ERRORS = this.getMinErrors(keyValueArray);
        if (!!MIN_ERRORS.length)
            return MIN_ERRORS;
        // Some formatting issues, like when user is about to type 10,5 and typed 10 in a 'Days' field, lead to nullish values.
        // In that case its better to show the formatting error before complaining about required.
        const FORMATTING_ERRORS = this.getFormattingErrors(keyValueArray);
        if (!!FORMATTING_ERRORS.length)
            return FORMATTING_ERRORS;
        // Some type related formatting issues are more important than other formatting issues.
        const TYPE_RELATED_FORMATTING_ERRORS = this.getTypeRelatedFormattingErrors(keyValueArray);
        if (!!TYPE_RELATED_FORMATTING_ERRORS.length)
            return TYPE_RELATED_FORMATTING_ERRORS;
        // Some formatting issues are more important than other formatting issues.
        const DETAILED_FORMATTING_ERRORS = this.getDetailedFormattingErrors(keyValueArray);
        if (!!DETAILED_FORMATTING_ERRORS.length)
            return DETAILED_FORMATTING_ERRORS;
        const REQUIRED_ERRORS = keyValueArray.filter(error => error.key === PPossibleErrorNames.REQUIRED);
        if (!!REQUIRED_ERRORS.length)
            return REQUIRED_ERRORS;
        return keyValueArray.filter(error => {
            switch (error.key) {
                case PPossibleErrorNames.URL_INCOMPLETE:
                    return false;
                case PPossibleErrorNames.FLOAT:
                    assumeDefinedToGetStrictNullChecksRunning(formControl, 'formControl');
                    return !(formControl.errors && (formControl.errors[PPossibleErrorNames.INTEGER] ||
                        formControl.errors[PPossibleErrorNames.MAX_DECIMAL_PLACES_COUNT] ||
                        formControl.errors[PPossibleErrorNames.NUMBER_NAN]));
                default:
                    return true;
            }
        }).splice(0, 1);
    }
    /**
     * Same as formBuilder.group() but with better typing.
     */
    group(controlsConfig, options) {
        return this.formBuilder.group(controlsConfig, options);
    }
    /**
     * Get formGroups inside a formArray typed.
     * Angular does not have strict typed FormArray.controls, FormGroup.controls etc.
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    getIterablePFormGroups(input) {
        if (input.controls.some(item => item instanceof UntypedFormGroup))
            this.console.error('Transform all FormGroup to PFormGroup or use old method getIterableFormGroups() instead.');
        // eslint-disable-next-line no-restricted-syntax
        const firstControl = input.controls[0];
        if (!(firstControl instanceof PFormGroup)) {
            if (firstControl instanceof UntypedFormGroup)
                this.console.error('Deprecated FormGroup inside FormArray in use here!');
            return [];
        }
        return input.controls;
    }
    /**
     * @deprecated Add PFormGroup’s instead of FormGroup’s to your FormArray, and switch to .getIterablePFormGroups(...)
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    getIterableFormGroups(input) {
        if (input.controls.some(item => item instanceof PFormGroup))
            this.console.error('Use new method getIterablePFormGroups() instead');
        // eslint-disable-next-line no-restricted-syntax
        if (!(input.controls[0] instanceof UntypedFormGroup))
            return [];
        // eslint-disable-next-line @typescript-eslint/ban-types
        return input.controls;
    }
};
PFormsService = __decorate([
    Injectable()
    /**
     * Helper functions to build new FormGroups.
     */
    ,
    __metadata("design:paramtypes", [LogService,
        ValidatorsService,
        AsyncValidatorsService, typeof (_a = typeof KeyValuePipe !== "undefined" && KeyValuePipe) === "function" ? _a : Object, typeof (_b = typeof UntypedFormBuilder !== "undefined" && UntypedFormBuilder) === "function" ? _b : Object])
], PFormsService);
export { PFormsService };
//# sourceMappingURL=p-forms.service.js.map