var _a, _b, _c, _d, _e, _f, _g, _h, _j;
import { __decorate, __metadata } from "tslib";
import { NgWizardService, STEP_STATE, STEP_POSITION, STEP_DIRECTIN } from 'ng-wizard'; // cSpell:ignore DIRECTIN
import { of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Component, Input, ChangeDetectionStrategy, HostBinding, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { ViewChild } from '@angular/core';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { SchedulingApiService, SchedulingApiShiftChangeSelector } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { AffectedShiftsApiService, SchedulingApiShiftRepetitionType } from '@plano/shared/api';
import { MeService } from '@plano/shared/core/me/me.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../shared/core/null-type-utils';
import { AngularDatePipeFormat } from '../../../shared/core/pipe/p-date.pipe';
import { PlanoFaIconPool } from '../../../shared/core/plano-fa-icon-pool.enum';
import { ToastsService } from '../../service/toasts.service';
import { AffectedShiftsApiShifts } from '../api/affected-shifts-api.service';
import { PAlertThemeEnum, PThemeEnum } from '../bootstrap-styles.enum';
import { FormControlSwitchType } from '../p-forms/p-form-control-switch/p-form-control-switch.component';
import { SectionWhitespace } from '../page/section/section.component';
export var PTypeOfChange;
(function (PTypeOfChange) {
    PTypeOfChange["EDIT"] = "other";
    PTypeOfChange["DELETE"] = "remove";
    PTypeOfChange["CANCEL"] = "cancel";
})(PTypeOfChange || (PTypeOfChange = {}));
let ChangeSelectorsModalComponent = class ChangeSelectorsModalComponent {
    constructor(affectedShiftsApiService, schedulingService, api, pMoment, localize, pFormsService, meService, changeDetectorRef, ngWizardService, zone, toastsService) {
        this.affectedShiftsApiService = affectedShiftsApiService;
        this.schedulingService = schedulingService;
        this.api = api;
        this.pMoment = pMoment;
        this.localize = localize;
        this.pFormsService = pFormsService;
        this.meService = meService;
        this.changeDetectorRef = changeDetectorRef;
        this.ngWizardService = ngWizardService;
        this.zone = zone;
        this.toastsService = toastsService;
        /**
         * A function that will be called in the moment the modal closes.
         * TODO: Check if this should be replaced by a @Output() thingy.
         */
        this.close = () => { };
        /**
         * A function that will be called in the moment the modal is dismissed.
         * TODO: Check if this should be replaced by a @Output() thingy.
         */
        this.dismiss = () => { };
        /**
         * Needed to generate nice user-badges in the transmission-preview (little calendar with affected shifts).
         */
        this.members = null;
        /**
         * The shiftModel where the values have changed.
         * Only needs to be set if this is a change-selector-modal for a shiftModel.
         */
        this.shiftModel = null;
        /**
         * The shift where the values have changed.
         * Only needs to be set if this is a change-selector-modal for a shift.
         */
        this.shift = null;
        /**
         * HACK: This indicates if the modal was triggered by one of the course section in shift-forms.
         * The fields where this is true are (state 13. July 2020)
         * isCourseOnline
         * minCourseParticipantCount
         * maxCourseParticipantCount
         */
        this.modalForCourseRelatedValues = false;
        this.typeOfChange = PTypeOfChange.EDIT;
        this.minDate = null;
        this._minEndDate = null;
        this.customWarning = null;
        this._showApplyToShiftModelCheckbox = null;
        // @Input() public initValuesOnInit : boolean = false;
        this._alwaysTrue = true;
        this.PThemeEnum = PThemeEnum;
        this.SectionWhitespace = SectionWhitespace;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.AngularDatePipeFormat = AngularDatePipeFormat;
        this.FormControlSwitchType = FormControlSwitchType;
        this.PTypeOfChange = PTypeOfChange;
        this.PAlertThemeEnum = PAlertThemeEnum;
        this.STEP_STATE = STEP_STATE;
        this.componentInitialized = false;
        this.addChangeSelectors = false;
        this.transmissionPreviewIsLoading = false;
        this.affectedShifts = new AffectedShiftsApiShifts(null, false);
        this.transmissionPreviewTimestamp = null;
        this.formGroup = null;
        /**
         * Use this instead of shiftChangeSelector.start
         * It represents the same, but makes sure the 'start of day' will be set and it will update the preview of affected
         * shifts.
         *
         * @deprecated
         * TODO: 	Refactor this component so that submit gets obsolete.
         * 				See ngOnInit()
        */
        this._changeSelectorStart = null;
        this.modalRef = null;
        this.config = {
            selected: 0,
            toolbarSettings: {
                // toolbarExtraButtons: [
                // 	{ text: 'Finish', class: 'btn btn-info', event: () => { alert('Finished!!!'); } },
                // ],
                showNextButton: false,
                showPreviousButton: false,
            },
            anchorSettings: {
                anchorClickable: true,
            },
        };
        this.STEP_POSITION = STEP_POSITION;
        this.isValidTypeBoolean = true;
        this.captureInput = null;
        this.showSendMailCheckbox = false;
        this.today = +this.pMoment.m().startOf('day');
    }
    /**
     * @deprecated please use typeOfChange
     */
    set _isForDeletion(input) {
        if (!!input)
            this.typeOfChange = PTypeOfChange.DELETE;
    }
    /**
     * The Option »Apply to Shift Model« does not always make sense.
     * Here is the getter to decide if it should be visible.
     */
    get showApplyToShiftModelCheckbox() {
        if (!this.shift)
            return false;
        if (!this.addChangeSelectors)
            return false;
        if (this._showApplyToShiftModelCheckbox !== null)
            return this._showApplyToShiftModelCheckbox;
        return !this.isForDeletion;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get minEndDate() {
        if (this._minEndDate !== null)
            return this._minEndDate;
        return this.changeSelectorStart;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    getAffectedShifts() {
        if (this.transmissionPreviewIsLoading)
            return;
        this.transmissionPreviewIsLoading = true;
        const start = +this.pMoment.m(this.transmissionPreviewTimestamp).startOf('month');
        const end = +this.pMoment.m(start).add(1, 'month');
        const shiftChangeSelectorForParams = this.showTransmissionPreview ? this.shiftChangeSelector : null;
        let queryParams = new HttpParams()
            .set('action', this.typeOfChange)
            .set('start', start.toString())
            .set('end', end.toString());
        if (shiftChangeSelectorForParams !== null)
            queryParams = queryParams.set('shiftChangeSelector', encodeURIComponent(JSON.stringify(shiftChangeSelectorForParams.rawData)));
        if (this.shift) {
            const id = this.shift.id.toString();
            queryParams = queryParams.set('currentShiftId', id);
        }
        this.affectedShiftsApiService.load({
            searchParams: queryParams,
            success: () => {
                this.affectedShifts = this.affectedShiftsApiService.data.shifts.filterBy((item) => {
                    const startIsInMonth = item.start >= start && item.start < end;
                    if (startIsInMonth)
                        return true;
                    const endIsInMonth = item.end > start && item.end <= end;
                    if (endIsInMonth)
                        return true;
                    return false;
                });
                this.transmissionPreviewIsLoading = false;
            },
        });
    }
    validateValues() {
        if (!!this.shift && this.members === null) {
            throw new Error('members is required when using ChangeSelectorsModalComponent for a shift');
        }
    }
    ngOnInit() {
        // if (!this.initValuesOnInit) return;
        this.initComponent();
        // FIXME: PLANO-35789
        // TODO: Refactor this component so that submit gets obsolete. If you have this, you can remove a bunch of
        //       getAffectedShifts() calls and replace them by the following:
        // this.schedulingApiService?.onChange?.subscribe(() => {
        // 	this.getAffectedShifts();
        // });
    }
    /**
     * Load and set everything that is necessary for this component
     */
    initComponent() {
        this.validateValues();
        this.resetChangeSelectors();
        this.initValues();
        this.initFormGroup();
        // It is not necessary to get affected shifts when user applies settings from changes on shiftModel
        if (!!this.shift)
            this.getAffectedShifts();
        this.componentInitialized = true;
    }
    /**
     * Set some default values for properties that are not defined yet
     */
    initValues() {
        if (this.shift) {
            this.transmissionPreviewTimestamp = this.shift.start;
            if (this.alwaysGetsAppliedToPacket)
                this.setOptionShiftsOfPacket(true);
        }
        else {
            this.transmissionPreviewTimestamp = this.today;
        }
    }
    /**
     * Initialize the formGroup for this component
     */
    initFormGroup() {
        if (this.formGroup) {
            this.formGroup = null;
        }
        const newFormGroup = this.pFormsService.group({});
        if (this.shift) {
            this.pFormsService.addControl(newFormGroup, 'changeSelectorEnd', {
                value: undefined,
                disabled: false,
            });
        }
        this.formGroup = newFormGroup;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showCaptureRequest() {
        return this.applyToSomeOtherShifts;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get applyToSomeOtherShifts() {
        if (this.optionShiftsOfPacket)
            return true;
        if (this.optionShiftsOfSeries)
            return true;
        if (this.optionShiftsOfModel)
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showApplyToShiftsOfSeriesCheckbox() {
        assumeNonNull(this.shift);
        if (this.shift.repetition.rawData === undefined)
            throw new Error('No shift.repetition. Forgot shift.loadDetailed()?');
        return this.shift.repetition.type !== SchedulingApiShiftRepetitionType.NONE;
    }
    /**
     * Set if changes should be transferred to other shifts or not.
     */
    setAddChangeSelectors(input, success) {
        if (!this.shift)
            this.initChangeSelectorStart(input);
        if (!input) {
            this.resetChangeSelectors();
            this.shiftChangeSelector.shiftModelId = null;
            return;
        }
        const runMeWhenAllNecessaryDataIsAvailable = () => {
            this.addChangeSelectors = true;
            this.changeDetectorRef.detectChanges();
            if (success)
                success();
        };
        if (!this.shift || this.shift.repetition.rawData !== undefined) {
            runMeWhenAllNecessaryDataIsAvailable();
            return;
        }
        this.shift.loadDetailed({
            searchParams: this.schedulingService.queryParams,
            success: () => {
                runMeWhenAllNecessaryDataIsAvailable();
            },
        });
    }
    /**
     * (Re)set all changeSelectors.
     * More info: PLANO-1400
     */
    resetChangeSelectors() {
        var _a;
        this.addChangeSelectors = false;
        if (!!this.shift) {
            // NOTE: 	It is important to do this before setting 'changeSelectorEnd' to undefined.
            // 				Otherwise the validator of 'changeSelectorEnd' would return error,
            // 				because of calculations based on outdated data.
            this.optionShiftsOfPacket = this.alwaysGetsAppliedToPacket;
        }
        else {
            this.shiftModel.changeSelector.start = null;
        }
        this.shiftChangeSelector.start = null;
        if ((_a = this.formGroup) === null || _a === void 0 ? void 0 : _a.get('changeSelectorEnd')) {
            this.formGroup.get('changeSelectorEnd').setValue(undefined);
            this.changeDetectorRef.markForCheck();
        }
    }
    ngOnDestroy() {
        // this.resetChangeSelectors();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get selectedChangeSelectorStartIsCurrentDate() {
        return this.pMoment.m(this.changeSelectorStart).isSame(this.today, 'day');
    }
    /**
     * @deprecated
     * TODO: 	Refactor this component so that submit gets obsolete.
     * 				See ngOnInit()
    */
    get changeSelectorStart() {
        return this._changeSelectorStart;
    }
    /**
     * @deprecated
     * TODO: 	Refactor this component so that submit gets obsolete.
     * 				See ngOnInit()
    */
    set changeSelectorStart(input) {
        const PROCESSED_INPUT = input ? +this.pMoment.m(input).startOf('day') : input;
        this._changeSelectorStart = PROCESSED_INPUT;
        // eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
        if (this.shiftChangeSelector)
            this.shiftChangeSelector.start = PROCESSED_INPUT !== null && PROCESSED_INPUT !== void 0 ? PROCESSED_INPUT : 0;
        // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
        if (this.shiftModel.changeSelector.start)
            this.shiftChangeSelector.start = PROCESSED_INPUT ? PROCESSED_INPUT : 0;
        if (this.shift)
            this.getAffectedShifts();
    }
    /**
     * Check if defaultStartDate would be possible
     */
    defaultStartIsValid(defaultStart) {
        // If no defaultStartDate is available then it can only be valid.
        if (!defaultStart)
            return true;
        // If minDate is defined and startDate is before minDate, then it is invalid.
        if (this.minDate && defaultStart < this.minDate)
            return false;
        if (this.shiftChangeSelector.end) {
            const oneDayAsMilliseconds = 1000 * 60 * 60 * 24;
            return (this.shiftChangeSelector.end - oneDayAsMilliseconds) > defaultStart;
        }
        return true;
    }
    /**
     * Initialize start date for datepicker
     */
    initChangeSelectorStart(input) {
        if (input === false) {
            this.changeSelectorStart = null;
            return;
        }
        if (!this.shift) {
            this.changeSelectorStart = this.today;
        }
        else if (this.defaultStartIsValid(this.defaultStart)) {
            this.changeSelectorStart = this.defaultStart;
        }
        else if (this.shiftChangeSelector.end) {
            const oneDayAsMilliseconds = 1000 * 60 * 60 * 24;
            this.changeSelectorStart = this.shiftChangeSelector.end - oneDayAsMilliseconds;
        }
        else {
            // If there is no other solution then set today as default, because its always better do have a default then
            // to change all the items in the past 💣
            this.changeSelectorStart = this.today;
        }
    }
    /**
     * Returns true if changeSelector-flags are set to "apply to shifts of this shiftModel"
     */
    get optionToShiftModel() {
        return this.shiftChangeSelector.shiftModelId !== null;
    }
    set optionToShiftModel(input) {
        if (input) {
            this.shiftChangeSelector.shiftModelId = this.shiftModel.id;
        }
        else {
            this.shiftChangeSelector.shiftModelId = null;
        }
    }
    /**
     * Set shiftModelId in changeSelector flags
     * shiftModelId is required for all other changeSelector flags
     */
    toggleOptionToShiftModel() {
        this.optionToShiftModel = this.shiftChangeSelector.shiftModelId === null;
        if (this.shift)
            this.getAffectedShifts();
    }
    /**
     * Returns true if changeSelector-flags are set to "apply to shifts of this shiftModel"
     */
    get optionShiftsOfModel() {
        return this.shiftChangeSelector.shiftsOfShiftModelId !== null &&
            this.shiftChangeSelector.shiftsOfShiftModelVersion === null &&
            this.shiftChangeSelector.shiftsOfSeriesId === null &&
            this.shiftChangeSelector.shiftsOfPacketIndex === null;
    }
    set optionShiftsOfModel(input) {
        if (input) {
            this.shiftChangeSelector.shiftsOfShiftModelId = this.shiftModel.id;
            this.shiftChangeSelector.shiftsOfShiftModelVersion = null;
            this.shiftChangeSelector.shiftsOfSeriesId = null;
            this.shiftChangeSelector.shiftsOfPacketIndex = null;
        }
        else {
            this.setOptionShiftsOfPacket(this.alwaysGetsAppliedToPacket);
        }
    }
    /**
     * Set necessary flags to apply changes to shifts of this model at save
     */
    setOptionShiftsOfModel(input) {
        this.optionShiftsOfModel = input;
        if (this.shift) {
            if (!this.changeSelectorStart)
                this.initChangeSelectorStart(this.applyToSomeOtherShifts);
            this.getAffectedShifts();
        }
    }
    /**
     * Returns true if changeSelector-flags are set to "apply to shifts of this series"
     */
    get optionShiftsOfSeries() {
        const hasBeenSelected = (this.shiftChangeSelector.shiftsOfShiftModelId !== null &&
            this.shiftChangeSelector.shiftsOfShiftModelVersion !== null &&
            this.shiftChangeSelector.shiftsOfSeriesId !== null &&
            this.shiftChangeSelector.shiftsOfPacketIndex === null);
        return this.optionShiftsOfModel || hasBeenSelected;
    }
    set optionShiftsOfSeries(input) {
        if (input) {
            assumeNonNull(this.shift);
            this.shiftChangeSelector.shiftsOfShiftModelId = this.shiftModel.id;
            this.shiftChangeSelector.shiftsOfShiftModelVersion = this.shift.id.shiftModelVersion;
            this.shiftChangeSelector.shiftsOfSeriesId = this.shift.id.seriesId;
            this.shiftChangeSelector.shiftsOfPacketIndex = null;
        }
        else {
            this.setOptionShiftsOfPacket(this.alwaysGetsAppliedToPacket);
        }
    }
    /**
     * Set necessary flags to apply changes to shifts of this series at save
     */
    setOptionShiftsOfSeries(input) {
        this.optionShiftsOfSeries = input;
        if (this.shift) {
            if (!this.changeSelectorStart)
                this.initChangeSelectorStart(this.applyToSomeOtherShifts);
            this.getAffectedShifts();
        }
    }
    /**
     * Returns true if changeSelector-flags are set to "apply to shifts of this packet"
     */
    get optionShiftsOfPacket() {
        const hasBeenSelected = (this.shiftChangeSelector.shiftsOfShiftModelId !== null &&
            this.shiftChangeSelector.shiftsOfShiftModelVersion !== null &&
            this.shiftChangeSelector.shiftsOfSeriesId !== null &&
            this.shiftChangeSelector.shiftsOfPacketIndex !== null);
        return this.optionShiftsOfSeries || hasBeenSelected;
    }
    set optionShiftsOfPacket(input) {
        if (input) {
            assumeNonNull(this.shift);
            this.shiftChangeSelector.shiftsOfShiftModelId = this.shiftModel.id;
            this.shiftChangeSelector.shiftsOfShiftModelVersion = this.shift.id.shiftModelVersion;
            this.shiftChangeSelector.shiftsOfSeriesId = this.shift.id.seriesId;
            this.shiftChangeSelector.shiftsOfPacketIndex = this.shift.id.packetIndex;
        }
        else {
            this.shiftChangeSelector.shiftsOfShiftModelId = null;
            this.shiftChangeSelector.shiftsOfShiftModelVersion = null;
            this.shiftChangeSelector.shiftsOfSeriesId = null;
            this.shiftChangeSelector.shiftsOfPacketIndex = null;
        }
    }
    /**
     * Set necessary flags to apply changes to shifts of this packet at save
     */
    setOptionShiftsOfPacket(input) {
        this.optionShiftsOfPacket = input;
        if (this.shift) {
            if (!this.changeSelectorStart)
                this.initChangeSelectorStart(this.applyToSomeOtherShifts);
            this.getAffectedShifts();
        }
    }
    /**
     * Submit the form
     * TODO: 	Refactor this component so that submit gets obsolete.
     * 				See ngOnInit()
     */
    submit() {
        const START = !!this.shift ? this.shiftChangeSelector.start : this.shiftModel.changeSelector.start;
        // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
        const END = this.shiftChangeSelector.end ? this.shiftChangeSelector.end : 0;
        if (!this.shift) {
            if (this.addChangeSelectors) {
                this.shiftModel.changeSelector.start = START;
            }
            else {
                this.shiftModel.changeSelector.start = null;
            }
        }
        else {
            this.shiftChangeSelector.start = START;
            this.shiftChangeSelector.end = END;
        }
        if (this.api.data.automaticBookingCancellationSettings.automaticOnlineRefund) {
            this.toastsService.addToast({
                title: this.localize.transform('Check deine Emails'),
                content: this.localize.transform('Wir haben dir geschrieben, bei welchen Buchungen eine Online-Rückerstattung veranlasst wurde.'),
                theme: PThemeEnum.INFO,
                icon: PlanoFaIconPool.EMAIL_NOTIFICATION,
            });
        }
        this.close('Close click');
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get hasNgContent() {
        assumeDefinedToGetStrictNullChecksRunning(this.ngContent.nativeElement, 'this.ngContent.nativeElement');
        return this.ngContent.nativeElement.children.length > 0;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showDateRangeSelection() {
        if (!this.shift)
            return false;
        if (this.shift.packetShifts.length > 0)
            return true;
        if (this.showApplyToShiftsOfSeriesCheckbox)
            return true;
        if (this.shiftChangeSelector.shiftsOfShiftModelId !== null)
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get translatedAddChangeSelectorsRadioValue() {
        const thisThing = this.localize.transform(!this.shift ? 'diese Vorlage' : (this.alwaysGetsAppliedToPacket ? 'dieses Schicht-Paket' : 'diese Schicht'));
        return this.localize.transform('Nein, nur auf ${thisThing}', {
            thisThing: thisThing,
        });
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get title() {
        if (this._title)
            return this._title;
        return this.localize.transform('Änderung auf andere Bereiche übertragen?');
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onClickNowBtn() {
        this.changeSelectorStart = this.today;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get submitBtnIsDisabled() {
        var _a, _b;
        if ((_a = this.formGroup) === null || _a === void 0 ? void 0 : _a.invalid)
            return true;
        if (!this.shift)
            return false;
        if (!this.showCaptureRequest)
            return false;
        // If the user wants to apply this change to any other shifts or shiftModels, the user must confirm with capture.
        if (((_b = this.captureInput) === null || _b === void 0 ? void 0 : _b.toLowerCase()) !== this.captureRequest.toLowerCase())
            return true;
        if (this.changeSelectorStart)
            return false;
        if (this.shiftChangeSelector.shiftModelId !== null)
            return false;
        if (this.optionShiftsOfPacket)
            return false;
        if (this.optionShiftsOfSeries)
            return false;
        if (this.optionShiftsOfModel)
            return false;
        return true;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get changeSelectorEndPlaceholder() {
        return this.shiftChangeSelector.end === 0 ? this.localize.transform('Unbegrenzt') : null;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get changeSelectorStartPlaceholder() {
        return this.shiftChangeSelector.start === 0 ? this.localize.transform('Unbegrenzt') : null;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    transmissionPreviewTimestampChanged(input) {
        this.transmissionPreviewTimestamp = input;
        this.getAffectedShifts();
    }
    /**
     * If there are packetShifts, the course related value changes will always be applied to the
     * whole packet. The checkbox should be visible, checked and disabled.
     * More details: PLANO-5297
     */
    get alwaysGetsAppliedToPacket() {
        assumeNonNull(this.shift);
        if (!this.shift.packetShifts.length)
            return false;
        if (this.typeOfChange === PTypeOfChange.CANCEL)
            return true;
        if (this.modalForCourseRelatedValues)
            return true;
        return null;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showApplyToShiftPacketCheckbox() {
        if (this.alwaysGetsAppliedToPacket)
            return true;
        return !!this.shift && !!this.shift.packetShifts.length;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get applyToShiftPacketCheckboxIsDisabled() {
        if (this.alwaysGetsAppliedToPacket)
            return true;
        if (this.shiftChangeSelector.shiftsOfPacketIndex === null &&
            this.shiftChangeSelector.shiftsOfSeriesId !== null &&
            this.shiftChangeSelector.shiftsOfShiftModelId !== null) {
            return true;
        }
        if (this.shiftChangeSelector.shiftsOfPacketIndex === null &&
            this.shiftChangeSelector.shiftsOfSeriesId === null &&
            this.shiftChangeSelector.shiftsOfShiftModelId !== null) {
            return true;
        }
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showTransmissionPreview() {
        if (!this.shift)
            return false;
        if (!this.applyToSomeOtherShifts)
            return false;
        if (this.shiftChangeSelector.end === null)
            return false;
        return true;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    initModalContentComponent(modalRef, title, members, shiftModel, shift, shiftChangeSelector) {
        this.modalRef = modalRef;
        this._title = title;
        this.members = members;
        this.shiftModel = shiftModel;
        this.shift = shift;
        this.shiftChangeSelector = shiftChangeSelector;
        this.initComponent();
    }
    /**
     * Dismiss the current modal
     */
    dismissModal() {
        this.dismiss();
        if (this.modalRef)
            this.modalRef.dismiss();
    }
    /**
     * Close the current modal
     */
    closeModal(reason) {
        this.close(reason);
        if (this.modalRef)
            this.modalRef.close(reason);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    showPreviousStep(_event) {
        this.ngWizardService.previous();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    showNextStep(_event) {
        this.ngWizardService.next();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    resetWizard(_event) {
        this.ngWizardService.reset();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    setTheme(theme) {
        this.ngWizardService.theme(theme);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    stepChanged(args) {
        this.currentStepChange = args;
        this.zone.runOutsideAngular(() => {
            requestAnimationFrame(() => {
                var _a, _b, _c, _d;
                // TODO: There must be a safer way to do this.
                const stepElement = args.step.stepContent.viewContainerRef.element.nativeElement;
                const scrollTarget = (_d = (_c = (_b = (_a = stepElement.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.parentNode) === null || _c === void 0 ? void 0 : _c.parentNode) === null || _d === void 0 ? void 0 : _d.parentNode;
                if (!scrollTarget)
                    return;
                const el = scrollTarget;
                if (el)
                    el.scrollIntoView();
            });
        });
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    isValidFunctionReturnsBoolean(_args) {
        if (_args.direction === STEP_DIRECTIN.backward)
            return true;
        return !this.formGroup.invalid;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    isValidFunctionReturnsObservable(_args) {
        return of(true);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showCancellationSettings() {
        var _a, _b;
        if (this.typeOfChange === PTypeOfChange.EDIT)
            return false;
        if ((_a = this.shift) === null || _a === void 0 ? void 0 : _a.isCourse)
            return true;
        if ((_b = this.shiftModel) === null || _b === void 0 ? void 0 : _b.isCourse)
            return true;
        return this.api.data.automaticBookingCancellationSettings.attributeInfoThis.show;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get captureRequest() {
        switch (this.typeOfChange) {
            case PTypeOfChange.EDIT:
                return this.localize.transform('Bearbeiten');
            case PTypeOfChange.CANCEL:
                return this.localize.transform('Stornieren');
            case PTypeOfChange.DELETE:
                return this.localize.transform('Löschen');
            default:
                throw new Error('Unexpected value for typeOfChange');
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isForDeletion() {
        return this.typeOfChange === PTypeOfChange.DELETE;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get typeRelatedIcon() {
        switch (this.typeOfChange) {
            case PTypeOfChange.EDIT:
                return PlanoFaIconPool.EDIT;
            case PTypeOfChange.CANCEL:
                return PlanoFaIconPool.CANCELED;
            case PTypeOfChange.DELETE:
                return PlanoFaIconPool.DELETE;
            default:
                throw new Error('Unexpected value for typeOfChange');
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get typeRelatedIconTheme() {
        switch (this.typeOfChange) {
            case PTypeOfChange.EDIT:
                return PThemeEnum.SUCCESS;
            case PTypeOfChange.CANCEL:
                return PThemeEnum.DANGER;
            case PTypeOfChange.DELETE:
                return PThemeEnum.DANGER;
            default:
                throw new Error('Unexpected value for typeOfChange');
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get amountOfBookingsToCancelOrDecline() {
        return +this.affectedShiftsApiService.data.bookingsCanceledCount + +this.affectedShiftsApiService.data.bookingsDeclinedCount;
    }
    ngAfterContentChecked() {
        if (!this.currentStepChange)
            return;
        if (this.formGroup.invalid) {
            this.currentStepChange.step.state = STEP_STATE.error;
        }
        else {
            this.currentStepChange.step.state = STEP_STATE.normal;
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get someOptionIsSelected() {
        if (!this.shift)
            return !!this.changeSelectorStart;
        return !!this.optionToShiftModel || !!this.optionShiftsOfModel || !!this.optionShiftsOfPacket || !!this.optionShiftsOfSeries;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showNotificationCheckbox() {
        if (this.showSendMailCheckbox)
            return true;
        if (!this.shift)
            return false;
        if (this.typeOfChange === PTypeOfChange.DELETE)
            return true;
        if (this.typeOfChange === PTypeOfChange.CANCEL)
            return true;
        return false;
    }
};
__decorate([
    Input('title'),
    __metadata("design:type", String)
], ChangeSelectorsModalComponent.prototype, "_title", void 0);
__decorate([
    Input(),
    __metadata("design:type", Function)
], ChangeSelectorsModalComponent.prototype, "close", void 0);
__decorate([
    Input(),
    __metadata("design:type", Function)
], ChangeSelectorsModalComponent.prototype, "dismiss", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ChangeSelectorsModalComponent.prototype, "members", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ChangeSelectorsModalComponent.prototype, "shiftModel", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ChangeSelectorsModalComponent.prototype, "shift", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_h = typeof SchedulingApiShiftChangeSelector !== "undefined" && SchedulingApiShiftChangeSelector) === "function" ? _h : Object)
], ChangeSelectorsModalComponent.prototype, "shiftChangeSelector", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], ChangeSelectorsModalComponent.prototype, "defaultStart", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ChangeSelectorsModalComponent.prototype, "modalForCourseRelatedValues", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], ChangeSelectorsModalComponent.prototype, "typeOfChange", void 0);
__decorate([
    Input('isForDeletion'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], ChangeSelectorsModalComponent.prototype, "_isForDeletion", null);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ChangeSelectorsModalComponent.prototype, "minDate", void 0);
__decorate([
    Input('minEndDate'),
    __metadata("design:type", Object)
], ChangeSelectorsModalComponent.prototype, "_minEndDate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ChangeSelectorsModalComponent.prototype, "customWarning", void 0);
__decorate([
    Input('showApplyToShiftModelCheckbox'),
    __metadata("design:type", Object)
], ChangeSelectorsModalComponent.prototype, "_showApplyToShiftModelCheckbox", void 0);
__decorate([
    HostBinding('class.modal-content'),
    __metadata("design:type", Object)
], ChangeSelectorsModalComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    ViewChild('ngContent', { static: true }),
    __metadata("design:type", typeof (_j = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _j : Object)
], ChangeSelectorsModalComponent.prototype, "ngContent", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ChangeSelectorsModalComponent.prototype, "showSendMailCheckbox", void 0);
ChangeSelectorsModalComponent = __decorate([
    Component({
        selector: 'p-change-selectors-modal[shiftChangeSelector]',
        templateUrl: './change-selectors-modal.component.html',
        styleUrls: ['./change-selectors-modal.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [AffectedShiftsApiService, typeof (_a = typeof SchedulingService !== "undefined" && SchedulingService) === "function" ? _a : Object, typeof (_b = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _b : Object, PMomentService,
        LocalizePipe,
        PFormsService,
        MeService, typeof (_c = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _c : Object, typeof (_d = typeof NgWizardService !== "undefined" && NgWizardService) === "function" ? _d : Object, typeof (_e = typeof NgZone !== "undefined" && NgZone) === "function" ? _e : Object, ToastsService])
], ChangeSelectorsModalComponent);
export { ChangeSelectorsModalComponent };
//# sourceMappingURL=change-selectors-modal.component.js.map