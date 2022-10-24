var PGenerateAbsencesOptionsComponent_1;
var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy, forwardRef, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SLIDE_ON_NGIF_TRIGGER } from '@plano/animations';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { GenerateAbsencesEarningSetting, GenerateAbsencesTimeSetting, GenerateAbsencesMode } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PPossibleErrorNames, PValidatorObject } from '@plano/shared/core/validators.types';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../shared/core/null-type-utils';
import { SectionWhitespace } from '../../shared/page/section/section.component';
let PGenerateAbsencesOptionsComponent = PGenerateAbsencesOptionsComponent_1 = class PGenerateAbsencesOptionsComponent {
    constructor(api, pFormsService, validators, changeDetectorRef, localize) {
        this.api = api;
        this.pFormsService = pFormsService;
        this.validators = validators;
        this.changeDetectorRef = changeDetectorRef;
        this.localize = localize;
        this.shiftRefs = null;
        this.indisposedMemberId = null;
        /**
         * This is the minimum code that is required for a custom control in Angular.
         * Its necessary to make [(ngModel)] and [formControl] work.
         */
        this.disabled = false;
        this.formControl = null;
        this._required = false;
        this.generateAbsencesModesEnum = GenerateAbsencesMode;
        this.timeSettingsEnum = GenerateAbsencesTimeSetting;
        this.earningSettingsEnum = GenerateAbsencesEarningSetting;
        this.formGroup = null;
        this.PApiPrimitiveTypes = PApiPrimitiveTypes;
        this.SectionWhitespace = SectionWhitespace;
        this.subscriptions = [];
        this._value = null;
        this.onChange = () => { };
        this.onTouched = () => { };
    }
    ngAfterContentInit() {
    }
    ngAfterContentChecked() {
        this.initAfterValueHack();
    }
    initAfterValueHack() {
        // HACK: this.value is not defined in the first run here. Therefore i ask for (this._value && !this.formGroup)
        // It is not clear why this.value is not defined. I added a post to Stackoverflow for this:
        // https://stackoverflow.com/questions/57918712/why-is-this-value-undefined-null-on-every-lifecycle-hook-when-using-ngmodel-t
        if (!this.value)
            return;
        if (this.formGroup)
            return;
        assumeDefinedToGetStrictNullChecksRunning(this.shiftRefs, 'shiftRefs');
        assumeDefinedToGetStrictNullChecksRunning(this.indisposedMemberId, 'indisposedMemberId');
        this.initFormGroup();
        this.setChangesListenerForControlError();
        this.setChangesListenerForReset();
    }
    setChangesListenerForControlError() {
        if (!this.formControl)
            return;
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        this.subscriptions.push(this.formGroup.valueChanges.subscribe(() => {
            assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
            if (this.formGroup.valid) {
                this.formControl.setErrors(null);
            }
            else {
                this.formControl.setErrors({ invalid: true });
            }
        }));
        // window.setInterval(() => {
        // 	this.console.log('!!formGroup.errors', !!this.formGroup.errors);
        // 	this.console.log('formGroup', this.formGroup);
        // },1000)
    }
    setChangesListenerForReset() {
        if (!this.formControl)
            return;
        this.subscriptions.push(this.formControl.valueChanges.subscribe(() => {
            this.initFormGroup();
        }));
        // window.setInterval(() => {
        // 	this.console.log('!!formGroup.errors', !!this.formGroup.errors);
        // 	this.console.log('formGroup', this.formGroup);
        // },1000)
    }
    /**
     * Initialize the formGroup for this component
     */
    /* eslint max-lines-per-function: ['warn', 250] */ // eslint-disable-next-line sonarjs/cognitive-complexity, jsdoc/require-jsdoc
    initFormGroup() {
        if (this.formGroup) {
            this.formGroup = null;
        }
        const newFormGroup = this.pFormsService.group({});
        this.pFormsService.addControl(newFormGroup, 'generateItems', {
            value: this.value.generateItems,
            disabled: false,
        }, [], (value) => {
            /**
             * Set or change the generateItems flag and refresh other generator values if necessary
             */
            this.value.generateItems = value;
            if (!this.value.generateItems) {
                newFormGroup.get('timeSetting').setValue(undefined);
                newFormGroup.get('timeSetting').updateValueAndValidity();
                newFormGroup.get('earningSetting').setValue(undefined);
                newFormGroup.get('earningSetting').updateValueAndValidity();
                newFormGroup.get('visibleToTeamMembers').setValue(undefined);
                newFormGroup.get('visibleToTeamMembers').updateValueAndValidity();
                newFormGroup.updateValueAndValidity();
            }
            else {
                this.refreshStartAndEnd();
                this.refreshEarningsPerHour();
                newFormGroup.get('timeSetting').updateValueAndValidity();
            }
        });
        this.pFormsService.addControl(newFormGroup, 'mode', {
            value: this.value.mode,
            disabled: false,
        }, [], value => {
            /**
             * Set or change the generateAbsencesMode and refresh other generator values if necessary
             */
            this.value.mode = value;
            const timeSettingControl = newFormGroup.get('timeSetting');
            assumeDefinedToGetStrictNullChecksRunning(timeSettingControl, 'timeSettingControl');
            if (this.value.mode === GenerateAbsencesMode.ONE_ABSENCE_FOR_ALL) {
                timeSettingControl.setValue(GenerateAbsencesTimeSetting.OVERWRITE_DURATION);
            }
            else {
                timeSettingControl.setValue(undefined);
                timeSettingControl.updateValueAndValidity();
            }
            this.refreshStartAndEnd();
            this.refreshEarningsPerHour();
        });
        this.pFormsService.addControl(newFormGroup, 'timeSetting', {
            value: this.value.timeSetting,
            disabled: false,
        }, [
            new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => {
                    // FIXME: PLANO-15096
                    if (!this.value.generateItems)
                        return null;
                    return this.validators.required(PApiPrimitiveTypes.string).fn(control);
                } }),
        ], value => {
            if (value === this.value.timeSetting)
                return;
            this.value.timeSetting = value;
            const control = newFormGroup.get('averageWorkingTimePerDay');
            assumeDefinedToGetStrictNullChecksRunning(control, 'control');
            if (value !== GenerateAbsencesTimeSetting.OVERWRITE_DURATION) {
                control.setValue(undefined);
            }
            control.updateValueAndValidity();
        });
        this.pFormsService.addControl(newFormGroup, 'wholeDayEntry', {
            value: this.value.wholeDayEntry,
            disabled: false,
        });
        this.pFormsService.addControl(newFormGroup, 'absenceStartDate', {
            value: this.value.absenceStartDate,
            disabled: false,
        }, [
            this.validators.maxDecimalPlacesCount(0, PApiPrimitiveTypes.Integer),
        ], value => {
            this.value.absenceStartDate = value;
        });
        this.pFormsService.addControl(newFormGroup, 'absenceEndDate', {
            value: this.value.absenceEndDate,
            disabled: false,
        }, [
            this.validators.maxDecimalPlacesCount(0, PApiPrimitiveTypes.Integer),
        ], value => {
            this.value.absenceEndDate = value;
        });
        this.pFormsService.addControl(newFormGroup, 'averageWorkingTimePerDay', {
            value: this.value.averageWorkingTimePerDay,
            disabled: false,
        }, [
            this.validators.maxDecimalPlacesCount(0, PApiPrimitiveTypes.Integer),
            new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => {
                    // FIXME: PLANO-15096
                    if (this.value.timeSetting === undefined)
                        return null;
                    if (this.value.timeSetting !== GenerateAbsencesTimeSetting.OVERWRITE_DURATION)
                        return null;
                    return this.validators.required(PApiPrimitiveTypes.Duration).fn(control);
                } }),
        ], value => {
            this.value.averageWorkingTimePerDay = value;
        });
        this.pFormsService.addControl(newFormGroup, 'paid', {
            value: this.value.paid,
            disabled: false,
        }, [], value => {
            this.value.paid = value;
            const control = newFormGroup.get('earningSetting');
            assumeDefinedToGetStrictNullChecksRunning(control, 'control');
            if (value !== true) {
                control.setValue(undefined);
            }
            else if (this.value.mode === GenerateAbsencesMode.ONE_ABSENCE_FOR_ALL) {
                control.setValue(GenerateAbsencesEarningSetting.OVERWRITE_EARNING);
            }
            control.updateValueAndValidity();
        });
        this.pFormsService.addControl(newFormGroup, 'earningSetting', {
            value: this.value.earningSetting,
            disabled: false,
        }, [
            new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => {
                    // FIXME: PLANO-15096
                    if (!this.value.paid)
                        return null;
                    if (!this.value.generateItems)
                        return null;
                    return this.validators.required(PApiPrimitiveTypes.string).fn(control);
                } }),
        ], value => {
            this.value.earningSetting = value;
            if (value !== GenerateAbsencesEarningSetting.OVERWRITE_EARNING) {
                newFormGroup.get('earningsPerHour').setValue(undefined);
            }
            newFormGroup.get('earningsPerHour').updateValueAndValidity();
        });
        this.pFormsService.addControl(newFormGroup, 'earningsPerHour', {
            value: this.value.earningsPerHour,
            disabled: false,
        }, [
            new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => {
                    // FIXME: PLANO-15096
                    if (this.value.earningSetting === undefined)
                        return null;
                    if (!this.value.paid)
                        return null;
                    if (this.value.earningSetting !== GenerateAbsencesEarningSetting.OVERWRITE_EARNING)
                        return null;
                    return this.validators.required(PApiPrimitiveTypes.string).fn(control);
                } }),
        ], value => {
            this.value.earningsPerHour = value;
        });
        this.pFormsService.addPControl(newFormGroup, 'visibleToTeamMembers', {
            formState: {
                value: this.value.visibleToTeamMembers,
                disabled: false,
            },
            validatorOrOpts: [
                new PValidatorObject({
                    name: PPossibleErrorNames.REQUIRED,
                    fn: (control) => {
                        if (!newFormGroup.get('generateItems').value)
                            return null;
                        return this.validators.required(PApiPrimitiveTypes.boolean).fn(control);
                    },
                }),
            ],
            subscribe: (value) => {
                this.value.visibleToTeamMembers = value;
            },
        });
        this.formGroup = newFormGroup;
    }
    /**
     * Is this a required field?
     * This can be set as Input() but if there is a formControl binding,
     * then it takes the info from the formControl’s validators.
     * TODO: 	Replace this by:
     * 				return this.formControlInitialRequired();
     */
    get required() {
        var _a, _b;
        if (this._required)
            return this._required;
        if (this.formControl) {
            const validator = (_b = (_a = this.formControl).validator) === null || _b === void 0 ? void 0 : _b.call(_a, this.formControl);
            if (!validator)
                return false;
            return !!validator[PPossibleErrorNames.REQUIRED] || !!validator[PPossibleErrorNames.ID_DEFINED] || !!validator[PPossibleErrorNames.NOT_UNDEFINED];
        }
        return false;
    }
    /** the value of this control */
    get value() { return this._value; }
    set value(value) {
        if (value === this._value)
            return;
        this._value = value;
        this.onChange(value);
    }
    /** Write a new value to the element. */
    writeValue(value) {
        if (this._value === value)
            return;
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
    registerOnChange(fn) { this.onChange = fn; }
    /** Set the function to be called when the control receives a touch event. */
    registerOnTouched(fn) { this.onTouched = fn; }
    /** setDisabledState */
    setDisabledState(isDisabled) {
        if (this.disabled === isDisabled)
            return;
        // Set internal attribute which gets used in the template.
        this.disabled = isDisabled;
        // Refresh the formControl. #two-way-binding
        if (this.formControl && this.formControl.disabled !== this.disabled) {
            this.disabled ? this.formControl.disable() : this.formControl.enable();
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showAverageWorkingTimePerDayInput() {
        if (this.value.timeSetting === GenerateAbsencesTimeSetting.OVERWRITE_DURATION) {
            return true;
        }
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get averageWorkingTimePerDayInputLabel() {
        if (!this.shiftRefs.length)
            return this.localize.transform('Abwesende Stunden');
        const unit = this.value.mode === GenerateAbsencesMode.ONE_ABSENCE_FOR_EACH ? 'Eintrag' : 'Tag';
        return this.localize.transform('Abwesende Stunden pro ${unit}', {
            unit: this.localize.transform(unit),
        });
    }
    get shiftRefsAsShiftsSorted() {
        return this.api.data.shifts.filterBy(item => this.shiftRefs.contains(item.id)).sortedBy(item => item.start, false);
    }
    get earliestShift() {
        return this.shiftRefsAsShiftsSorted.get(0);
    }
    get latestShift() {
        const shiftRefsAsShiftsSorted = this.shiftRefsAsShiftsSorted;
        return shiftRefsAsShiftsSorted.get(shiftRefsAsShiftsSorted.length - 1);
    }
    refreshEarningsPerHour() {
        const options = this.value;
        if (options.mode === GenerateAbsencesMode.ONE_ABSENCE_FOR_ALL && this.shiftRefs.length === 1) {
            options.earningsPerHour = this.earliestShift.assignableMembers.get(this.indisposedMemberId).hourlyEarnings;
        }
    }
    refreshStartAndEnd() {
        const options = this.value;
        if (options.mode !== GenerateAbsencesMode.ONE_ABSENCE_FOR_ALL)
            return;
        // If only one Absence gets created, the start and end must be calculated from the shiftRefs
        options.averageWorkingTimePerDay = null;
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        this.formGroup.get('absenceStartDate').setValue(this.earliestShift.start);
        this.formGroup.get('absenceEndDate').setValue(this.latestShift.end);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showTimeSettingInput() {
        if (this.value.mode === GenerateAbsencesMode.ONE_ABSENCE_FOR_EACH)
            return true;
        if (this.shiftRefs.length === 1)
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showAbsenceStartAndEndDateInput() {
        if (this.value.mode === GenerateAbsencesMode.ONE_ABSENCE_FOR_ALL &&
            this.value.timeSetting === GenerateAbsencesTimeSetting.OVERWRITE_DURATION)
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showTimeBox() {
        if (this.showTimeSettingInput)
            return true;
        if (this.showAverageWorkingTimePerDayInput)
            return true;
        if (this.showAbsenceStartAndEndDateInput)
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showEarningSettingInput() {
        if (!this.value.paid)
            return false;
        if (this.value.mode === GenerateAbsencesMode.ONE_ABSENCE_FOR_EACH)
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showEarningsPerHourInput() {
        if (!this.value.paid)
            return false;
        if (this.value.earningSetting === GenerateAbsencesEarningSetting.OVERWRITE_EARNING)
            return true;
        return false;
    }
    // TODO: Obsolete?
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showEarningsBox() {
        // if (this.showEarningSettingInput) return true;
        // if (this.showEarningsPerHourInput) return true;
        // return false;
        return true;
    }
    ngOnDestroy() {
        for (const subscription of this.subscriptions)
            subscription.unsubscribe();
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PGenerateAbsencesOptionsComponent.prototype, "shiftRefs", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PGenerateAbsencesOptionsComponent.prototype, "indisposedMemberId", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PGenerateAbsencesOptionsComponent.prototype, "disabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PGenerateAbsencesOptionsComponent.prototype, "formControl", void 0);
__decorate([
    Input('required'),
    __metadata("design:type", Boolean)
], PGenerateAbsencesOptionsComponent.prototype, "_required", void 0);
PGenerateAbsencesOptionsComponent = PGenerateAbsencesOptionsComponent_1 = __decorate([
    Component({
        selector: 'p-generate-absences-options',
        templateUrl: './generate-absences-options.component.html',
        styleUrls: ['./generate-absences-options.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        animations: [SLIDE_ON_NGIF_TRIGGER],
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PGenerateAbsencesOptionsComponent_1),
                multi: true,
            },
        ],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, PFormsService,
        ValidatorsService, typeof (_b = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _b : Object, LocalizePipe])
], PGenerateAbsencesOptionsComponent);
export { PGenerateAbsencesOptionsComponent };
//# sourceMappingURL=generate-absences-options.component.js.map