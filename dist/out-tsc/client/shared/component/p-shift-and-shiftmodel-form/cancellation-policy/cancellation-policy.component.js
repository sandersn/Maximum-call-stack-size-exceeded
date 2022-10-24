var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { SchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { AccountApiService, SchedulingApiCustomBookableMailEventType, SchedulingApiShiftModelCancellationPolicyFeePeriod } from '../../../../../shared/api';
import { PApiPrimitiveTypes } from '../../../../../shared/api/base/generated-types.ag';
import { LogService } from '../../../../../shared/core/log.service';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../../shared/core/null-type-utils';
import { PlanoFaIconPool } from '../../../../../shared/core/plano-fa-icon-pool.enum';
import { PPossibleErrorNames } from '../../../../../shared/core/validators.types';
import { PFormsService } from '../../../../service/p-forms.service';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '../../../bootstrap-styles.enum';
import { PFormControl, PFormGroup } from '../../../p-forms/p-form-control';
import { FormControlSwitchType } from '../../../p-forms/p-form-control-switch/p-form-control-switch.component';
import { PTabSizeEnum } from '../../../p-tabs/p-tabs/p-tab/p-tab.component';
import { PTabsTheme } from '../../../p-tabs/p-tabs/p-tabs.component';
import { SectionWhitespace } from '../../../page/section/section.component';
let CancellationPolicyComponent = class CancellationPolicyComponent {
    constructor(api, pFormsService, activeModal, accountApiService, changeDetectorRef, console) {
        this.api = api;
        this.pFormsService = pFormsService;
        this.activeModal = activeModal;
        this.accountApiService = accountApiService;
        this.changeDetectorRef = changeDetectorRef;
        this.console = console;
        this.shiftModel = null;
        this.formGroup = null;
        this.userCanWrite = false;
        this.initFormGroup = new EventEmitter();
        this.onSaveStart = new EventEmitter();
        this.onSaveSuccess = new EventEmitter();
        this.PThemeEnum = PThemeEnum;
        this.PApiPrimitiveTypes = PApiPrimitiveTypes;
        this.FormControlSwitchType = FormControlSwitchType;
        this.PBtnThemeEnum = PBtnThemeEnum;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.PTabsTheme = PTabsTheme;
        this.PTabSizeEnum = PTabSizeEnum;
        this.PPossibleErrorNames = PPossibleErrorNames;
        this.SectionWhitespace = SectionWhitespace;
        this.BootstrapSize = BootstrapSize;
        /**
         * Which options should be available?
         */
        this.startInputDurationOptions = [
            {
                text: 'Tage vor dem Angebotstag',
                value: PApiPrimitiveTypes.Days,
            },
            {
                text: 'Unbegrenzt',
                value: null,
            },
        ];
        /**
         * Which options should be available?
         */
        this.deadlinesInputDurationOptions = [
            {
                text: 'Tage vor dem Angebotstag',
                value: PApiPrimitiveTypes.Days,
            },
            {
                text: 'Unbegrenzt bis zum Angebotsbeginn',
                value: null,
            },
        ];
        this.subscriberForFormArray = null;
        this.subscriberForFormGroup = null;
    }
    /**
     * Add a feePeriod to the api object as well as the formArray.
     */
    onAddFeePeriodClick(index) {
        if (this.shiftModel.currentCancellationPolicy === null)
            throw new Error('AddFeePeriod should not have been clickable');
        // Create a new feePeriod in the api
        // TODO: I guess 'createNewItem' always puts the new feePeriod at the end of the array. I need a way to set a desired index.
        const feePeriod = new SchedulingApiShiftModelCancellationPolicyFeePeriod(this.api);
        if (index === 0)
            feePeriod.start = null;
        this.shiftModel.currentCancellationPolicy.feePeriods.insert(index, feePeriod);
        // Put the new item into the FormArray at the right place.
        this.addFeePeriod(feePeriod, index);
    }
    /**
     * Remove a feePeriod from the api object as well as the formArray.
     */
    onRemoveFeePeriodClick(formGroupToRemove) {
        assumeDefinedToGetStrictNullChecksRunning(this.shiftModel.currentCancellationPolicy, 'shiftModel.currentCancellationPolicy');
        const feePeriod = formGroupToRemove.get('feePeriodRef').value;
        assumeNonNull(this.feePeriodsFormArray);
        const index = this.feePeriodsFormArray.controls.indexOf(formGroupToRemove);
        this.feePeriodsFormArray.removeAt(index);
        this.shiftModel.currentCancellationPolicy.feePeriods.removeItem(feePeriod);
        this.feePeriodsFormArray.updateValueAndValidity();
    }
    addFeePeriod(feePeriod, index) {
        this.feePeriodsFormArray.insert(index, new PFormGroup({
            feePeriodRef: new PFormControl({
                formState: {
                    value: feePeriod,
                    disabled: false,
                },
            }),
        }));
    }
    /**
     * Check if there is a 'cancel booking' email
     */
    get cancelEmailIsDisabled() {
        const mail = this.api.data.customBookableMails.findBy(item => item.eventType === SchedulingApiCustomBookableMailEventType.BOOKING_CANCELED);
        if (mail === null)
            return null;
        return !this.shiftModel.automaticBookableMailIds.contains(mail.id);
    }
    /**
     * Check if there is a 'edit feePeriod' email
     */
    get editFeePeriodEmailIsDisabled() {
        const mail = this.api.data.customBookableMails.findBy(item => item.eventType === SchedulingApiCustomBookableMailEventType.AMOUNT_TO_PAY_CHANGED);
        if (mail === null)
            return null;
        return !this.shiftModel.automaticBookableMailIds.contains(mail.id);
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    get feePeriodsFormArray() {
        // eslint-disable-next-line @typescript-eslint/ban-types
        return this.formGroup.get('feePeriods');
    }
    /**
     * Check if there is a linked document containing the companies conditions for cancellation.
     */
    get noCancellationConditionsLinked() {
        if (!this.feePeriodsFormArray.length)
            return false;
        if (!this.accountApiService.isLoaded())
            return null;
        return !!this.accountApiService.data.cancellationPolicyUrl;
    }
    /**
     * Shorthand to get a very special error object.
     */
    get firstFeePeriodStartIsNullError() {
        if (this.feePeriodsFormArray.errors === null)
            return null;
        return this.feePeriodsFormArray.errors[PPossibleErrorNames.FIRST_FEE_PERIOD_START_IS_NULL];
    }
    /**
     * HACK:
     * Problem was:
     * - no feePeriods
     * - set shiftModel.attributeInfoOnlineCancellationForChargeableBookingsEnabled to true
     * - set shiftModel.attributeInfoOnlineCancellationForChargeableBookingsEnabled to false
     * > this.formGroup is invalid although all children are valid
     */
    get someChildrenAreInvalid() {
        if (!this.formGroup)
            return null;
        return Object.values(this.formGroup.controls).some(item => item.invalid);
    }
    /**
     * Just a shorthand to determine if the hint should be visible or not.
     */
    get showCancelEmailIsDisabledHint() {
        if (!this.cancelEmailIsDisabled)
            return false;
        return this.shiftModel.onlineCancellationForFreeBookingsEnabled || this.shiftModel.onlineCancellationForChargeableBookingsEnabled;
    }
    /**
     * Shorthand to get the cannotEditHint
     */
    get onlineCancellationForChargeableBookingsEnabledCannotEditHint() {
        const cannotEditHint = this.shiftModel.attributeInfoOnlineCancellationForChargeableBookingsEnabled.vars.cannotEditHint;
        if (cannotEditHint === undefined)
            return null;
        return typeof cannotEditHint === 'string' ? cannotEditHint : cannotEditHint();
    }
    /**
     * Just a shorthand to get the cannotEditHint.
     */
    get onlineCancellationAutomaticOnlineRefundEnabledCannotEditHint() {
        // TODO: I think this is obsolete. Remove it.
        const cannotEditHint = this.shiftModel.attributeInfoOnlineCancellationAutomaticOnlineRefundEnabled.vars.cannotEditHint;
        if (cannotEditHint === undefined)
            return null;
        return typeof cannotEditHint === 'string' ? cannotEditHint : cannotEditHint();
    }
    /**
     * Create a formArray containing all the data of currentCancellationPolicy.
     * Remember, that currentCancellationPolicy reference can change after a save.
     * So this must be destroyed and re-created in that case.
     */
    createCurrentCancellationPolicyFormGroup() {
        if (this.formGroup === null)
            throw new Error(`createCurrentCancellationPolicyForm() has been called with nullish formGroup`);
        if (this.shiftModel === null)
            throw new Error(`createCurrentCancellationPolicyForm() has been called with nullish shiftModel`);
        if (!this.shiftModel.currentCancellationPolicy)
            throw new Error('currentCancellationPolicy should never be undefined');
        this.pFormsService.addPControl(this.formGroup, 'idAsString', {
            formState: { disabled: true, value: this.shiftModel.currentCancellationPolicyId.toString() },
        });
        this.pFormsService.addArray(this.formGroup, 'feePeriods', []);
        assumeNonNull(this.feePeriodsFormArray);
        this.feePeriodsFormArray.setValidators([
            // Pack all validators together in one validator.
            // This way we make sure every execution checks if a
            // validator is active (validator object is returned) or not (null is returned)
            (control) => {
                assumeNonNull(this.shiftModel.currentCancellationPolicy);
                for (const validationObjectFn of this.shiftModel.currentCancellationPolicy.feePeriods.attributeInfoThis.validations) {
                    const validatorObj = validationObjectFn();
                    const validatorFn = validatorObj === null || validatorObj === void 0 ? void 0 : validatorObj.fn;
                    if (!validatorFn)
                        continue;
                    const ERROR = validatorFn(control);
                    // This returns only the first validation error in the list of validators.
                    if (ERROR !== null)
                        return ERROR;
                }
                return null;
            },
        ]);
        let prevHasError = false;
        this.subscriberForFormArray = this.feePeriodsFormArray.valueChanges.subscribe(() => {
            // NOTE: [PLANO-59911] see linked video in ticket
            this.feePeriodsFormArray.updateValueAndValidity({ emitEvent: false });
            if (prevHasError !== !!this.feePeriodsFormArray.errors) {
                prevHasError = !!this.feePeriodsFormArray.errors;
                this.changeDetectorRef.detectChanges();
            }
        });
        for (const feePeriod of this.shiftModel.currentCancellationPolicy.feePeriods.iterable()) {
            this.feePeriodsFormArray.push(new PFormGroup({
                feePeriodRef: new PFormControl({
                    formState: {
                        value: feePeriod,
                        disabled: false,
                    },
                }),
            }));
        }
        this.subscriberForFormGroup = this.formGroup.valueChanges.subscribe(() => {
            this.formGroup.updateValueAndValidity({ onlySelf: true, emitEvent: false });
            this.feePeriodsFormArray.updateValueAndValidity({ onlySelf: true, emitEvent: true });
        });
    }
    ngOnDestroy() {
        var _a, _b;
        (_a = this.subscriberForFormArray) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        (_b = this.subscriberForFormGroup) === null || _b === void 0 ? void 0 : _b.unsubscribe();
    }
    ngAfterContentChecked() {
        // NOTE: PLANO-98740
        if (!this.feePeriodsFormArray)
            this.createCurrentCancellationPolicyFormGroup();
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], CancellationPolicyComponent.prototype, "shiftModel", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CancellationPolicyComponent.prototype, "formGroup", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CancellationPolicyComponent.prototype, "userCanWrite", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CancellationPolicyComponent.prototype, "initFormGroup", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CancellationPolicyComponent.prototype, "saveChangesHook", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CancellationPolicyComponent.prototype, "onSaveStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CancellationPolicyComponent.prototype, "onSaveSuccess", void 0);
CancellationPolicyComponent = __decorate([
    Component({
        selector: 'p-cancellation-policy',
        templateUrl: './cancellation-policy.component.html',
        styleUrls: ['./cancellation-policy.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, PFormsService, typeof (_b = typeof NgbActiveModal !== "undefined" && NgbActiveModal) === "function" ? _b : Object, AccountApiService, typeof (_c = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _c : Object, LogService])
], CancellationPolicyComponent);
export { CancellationPolicyComponent };
//# sourceMappingURL=cancellation-policy.component.js.map