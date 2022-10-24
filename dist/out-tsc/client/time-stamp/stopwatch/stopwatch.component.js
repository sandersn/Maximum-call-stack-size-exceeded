var _a;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { ToastsService } from '@plano/client/service/toasts.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { TimeStampApiShift } from '@plano/shared/api';
import { TimeStampApiShiftModel } from '@plano/shared/api';
import { TimeStampApiService } from '@plano/shared/api';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PPushNotificationsService, PRequestWebPushNotificationPermissionContext } from '@plano/shared/core/p-push-notifications.service';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PApiPrimitiveTypes } from '../../../shared/api/base/generated-types.ag';
import { LogService } from '../../../shared/core/log.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../shared/core/null-type-utils';
import { PlanoFaIconPool } from '../../../shared/core/plano-fa-icon-pool.enum';
import { PPossibleErrorNames, PValidatorObject } from '../../../shared/core/validators.types';
import { BootstrapSize, PThemeEnum } from '../../shared/bootstrap-styles.enum';
let StopwatchComponent = class StopwatchComponent {
    constructor(api, modalService, toasts, pFormsService, validators, pPushNotificationsService, console, pMomentService) {
        this.api = api;
        this.modalService = modalService;
        this.toasts = toasts;
        this.pFormsService = pFormsService;
        this.validators = validators;
        this.pPushNotificationsService = pPushNotificationsService;
        this.console = console;
        this.pMomentService = pMomentService;
        this.onEnd = new EventEmitter();
        this.selectedItem = null;
        this.PApiPrimitiveTypes = PApiPrimitiveTypes;
        this.BootstrapSize = BootstrapSize;
        this.PThemeEnum = PThemeEnum;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.formGroup = null;
        this.modalRef = null;
        this.initValues();
    }
    /**
     * Set values that are necessary for this function.
     * These initValues methods are used in many components.
     * They mostly get used for class attributes that would cause performance issues as a getter.
     */
    initValues() {
        this.now = +this.pMomentService.m();
    }
    ngAfterContentInit() {
        this.initFormGroup();
    }
    /**
     * Initialize the formGroup for this component
     */
    initFormGroup() {
        if (this.formGroup)
            this.formGroup = null;
        const tempFormGroup = this.pFormsService.group({});
        // We should have something like <p-input type="Minutes" [formControlName]="duration"></p-input>
        this.pFormsService.addControl(tempFormGroup, 'duration', {
            value: this.api.data.regularPauseDuration,
            disabled: false,
        }, [
            this.validators.maxDecimalPlacesCount(0, PApiPrimitiveTypes.Integer),
            this.validators.required(PApiPrimitiveTypes.Duration),
            new PValidatorObject({ name: PPossibleErrorNames.MAX, fn: (control) => {
                    return control.value !== null ? this.maxPauseValidator(control.value) : null;
                } }),
        ], () => { });
        this.formGroup = tempFormGroup;
    }
    /**
     * Exists in the following components:
     * - DetailFormComponent
     * - StopwatchComponent
     */
    maxPauseValidator(value) {
        let end;
        let start = null;
        if (this.api.data.selectedItem instanceof TimeStampApiShift) {
            start = this.api.data.selectedItem.start;
            end = this.api.data.selectedItem.end;
        }
        else {
            start = this.api.data.start;
            end = +this.pMomentService.m();
        }
        if (start === null)
            return null;
        const maxDurationOfPause = end - start;
        const limitAsMinutes = this.pMomentService.d(maxDurationOfPause).asMinutes();
        const controlValueAsMinutes = this.pMomentService.d(value).asMinutes();
        return this.validators.max(limitAsMinutes, true, PApiPrimitiveTypes.Minutes, undefined, 'Die Pause war länger als die Arbeitszeit? Witzbold ;)').fn({ value: controlValueAsMinutes });
    }
    /**
     * Should the user be able to add a pause for this shift? If not, user must stamp the pause.
     */
    get isAddPauseMode() {
        if (this.api.data.selectedItem instanceof TimeStampApiShift) {
            if (this.api.data.whenMemberStampedStart === null)
                return false;
            // Did the user click the start button after shift.end?
            return this.api.data.whenMemberStampedStart > this.api.data.selectedItem.end;
        }
        if (this.api.data.selectedItem instanceof TimeStampApiShiftModel) {
            // Did the user select a start time that is before/outside a limit?
            const minLimit = +this.pMomentService.m(this.now).subtract(3, 'hours');
            if (this.api.data.start === null)
                return false;
            return this.api.data.start < minLimit;
        }
        return false;
    }
    /**
     * Should the start button be disabled?
     */
    get startButtonDisabled() {
        const started = !!this.api.data.start;
        const isInvalid = !this.selectedItem;
        return isInvalid || started;
    }
    /**
     * Should the Pause button be disabled?
     */
    get pauseButtonDisabled() {
        return !this.api.timeStampIsRunning();
    }
    /**
     * Should the Stop button be disabled?
     */
    get stopButtonDisabled() {
        return !this.api.timeStampIsRunning();
    }
    /**
     * Save the current data
     */
    save() {
        this.api.save();
    }
    /**
     * Start the Pause and save it
     */
    startPause() {
        this.api.startPause();
        this.save();
    }
    /**
     * Stop the Pause and save it
     */
    stopPause() {
        this.api.completePause();
        this.save();
    }
    askForNotificationPermissionIfNecessary() {
        if (!(this.selectedItem instanceof TimeStampApiShift))
            return;
        const deadline = +this.pMomentService.m(this.now).subtract(10, 'hours');
        if (this.selectedItem.end > deadline)
            return;
        // End was more then 10 hours ago. So user probably forgot to stamp his/her shift.
        this.pPushNotificationsService.requestWebPushNotificationPermission(PRequestWebPushNotificationPermissionContext.STAMPED_PAST_SHIFT);
    }
    /**
     * Start the time-stamp and save it
     */
    onStart(timestamp) {
        if (!this.selectedItem)
            throw new Error('No item is selected. Start button should have been disabled.');
        this.api.startTimeStamp(timestamp, this.selectedItem);
        this.askForNotificationPermissionIfNecessary();
        this.api.save();
    }
    /**
     * Stop the time-stamp and save it
     */
    onStop(timestamp) {
        if (this.api.isPausing) {
            this.stopPause();
        }
        this.api.stopTimeStamp(timestamp);
        this.askForNotificationPermissionIfNecessary();
        this.api.save({
            success: () => {
                this.onEnd.emit();
            },
        });
    }
    /**
     * Stop the pause
     */
    togglePause() {
        if (this.api.isPausing) {
            this.stopPause();
        }
        else {
            this.startPause();
        }
    }
    /**
     * Add the pause
     */
    addPause(modalContent) {
        this.initFormGroup();
        this.modalService.openModal(modalContent, {
            success: () => {
                assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
                this.api.completePause(this.formGroup.get('duration').value);
                this.api.save();
            },
            dismiss: () => {
                this.initFormGroup();
            },
        });
    }
    /** A time the user probably wants to set */
    get suggestionTimestampForStart() {
        if (this.selectedItem instanceof TimeStampApiShift) {
            return this.selectedItem.start;
        }
        else if (this.selectedItem instanceof TimeStampApiShiftModel) {
            return null;
        }
        return null;
    }
    /** A time the user probably wants to set */
    get suggestionTimestampForEnd() {
        var _a;
        const selectedItem = (_a = this.selectedItem) !== null && _a !== void 0 ? _a : this.api.data.selectedItem;
        if (selectedItem instanceof TimeStampApiShift) {
            let earliestPossibleEnd;
            if (this.api.data.start === null) {
                earliestPossibleEnd = this.api.data.regularPauseDuration;
            }
            else {
                earliestPossibleEnd = this.api.data.start + this.api.data.regularPauseDuration;
            }
            if (selectedItem.end < earliestPossibleEnd)
                return null;
            return selectedItem.end;
        }
        else if (selectedItem instanceof TimeStampApiShiftModel) {
            return null;
        }
        return null;
    }
    /**
     * The minimum possible timestamp the user can choose
     */
    get minStart() {
        var _a;
        const validationObjects = this.api.data.attributeInfoStart.validations.map(item => item());
        const comparedConst = (_a = validationObjects.find(item => (item === null || item === void 0 ? void 0 : item.name) === PPossibleErrorNames.MIN)) === null || _a === void 0 ? void 0 : _a.comparedConst;
        if (typeof comparedConst === 'function')
            this.console.error('Function is not implemented here');
        return comparedConst !== null && comparedConst !== void 0 ? comparedConst : null;
    }
    /**
     * The maximum possible timestamp the user can choose
     */
    get maxStart() {
        var _a;
        const validationObjects = this.api.data.attributeInfoStart.validations.map(item => item());
        const comparedConst = (_a = validationObjects.find(item => (item === null || item === void 0 ? void 0 : item.name) === PPossibleErrorNames.MAX)) === null || _a === void 0 ? void 0 : _a.comparedConst;
        if (typeof comparedConst === 'function')
            this.console.error('Function is not implemented here');
        return comparedConst !== null && comparedConst !== void 0 ? comparedConst : null;
    }
    /**
     * The min possible timestamp the user can choose
     */
    get minEnd() {
        var _a, _b;
        const validationObjects = this.api.data.attributeInfoEnd.validations.map(item => item());
        const comparedConst = (_a = validationObjects.find(item => (item === null || item === void 0 ? void 0 : item.name) === PPossibleErrorNames.MIN)) === null || _a === void 0 ? void 0 : _a.comparedConst;
        const minByValidator = typeof comparedConst === 'number' ? comparedConst : (_b = comparedConst === null || comparedConst === void 0 ? void 0 : comparedConst()) !== null && _b !== void 0 ? _b : null;
        const minByDuration = this.api.data.start !== null ? this.api.data.start + this.api.data.regularPauseDuration : this.api.data.regularPauseDuration;
        if (!minByValidator)
            return minByDuration;
        return minByValidator > minByDuration ? minByValidator : minByDuration;
    }
    /**
     * The maximum possible timestamp the user can choose
     */
    get maxEnd() {
        var _a, _b;
        const validationObjects = this.api.data.attributeInfoEnd.validations.map(item => item());
        const comparedConst = (_a = validationObjects.find(item => (item === null || item === void 0 ? void 0 : item.name) === PPossibleErrorNames.MAX)) === null || _a === void 0 ? void 0 : _a.comparedConst;
        const maxByValidator = typeof comparedConst === 'number' ? comparedConst : (_b = comparedConst === null || comparedConst === void 0 ? void 0 : comparedConst()) !== null && _b !== void 0 ? _b : null;
        if (maxByValidator === null)
            return null;
        if (this.minEnd !== null && maxByValidator < this.minEnd) {
            // this.console.warn('Min must be less than max');
            return null;
        }
        return maxByValidator;
    }
};
__decorate([
    Output(),
    __metadata("design:type", typeof (_a = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _a : Object)
], StopwatchComponent.prototype, "onEnd", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], StopwatchComponent.prototype, "selectedItem", void 0);
StopwatchComponent = __decorate([
    Component({
        selector: 'p-stopwatch',
        templateUrl: './stopwatch.component.html',
        styleUrls: ['./stopwatch.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [TimeStampApiService,
        ModalService,
        ToastsService,
        PFormsService,
        ValidatorsService,
        PPushNotificationsService,
        LogService,
        PMomentService])
], StopwatchComponent);
export { StopwatchComponent };
//# sourceMappingURL=stopwatch.component.js.map