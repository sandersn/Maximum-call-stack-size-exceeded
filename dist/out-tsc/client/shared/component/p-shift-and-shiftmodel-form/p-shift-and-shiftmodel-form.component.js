/* NOTE: Dont make this file even bigger. Invest some time to cleanup/split into several files */
/* eslint max-lines: ["error", 1894] */
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
import { __decorate, __metadata } from "tslib";
/**	NOTE: Do not make this service more complex than it already is */
/* eslint complexity: ["error", 12]  */
import { PercentPipe } from '@angular/common';
import { Component, Input, EventEmitter, Output, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SLIDE_ON_NGIF_TRIGGER } from '@plano/animations';
import { BookingSystemRights } from '@plano/client/accesscontrol/rights-enums';
import { EventTypesService } from '@plano/client/plugin/p-custom-course-emails/event-types.service';
import { BookingsService } from '@plano/client/scheduling/shared/p-bookings/bookings.service';
import { PWishesService } from '@plano/client/scheduling/wishes.service';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { ToastsService } from '@plano/client/service/toasts.service';
import { PShiftBookingsComponent, } from '@plano/client/shared/component/p-shift-and-shiftmodel-form/p-shift-bookings/p-shift-bookings.component';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { ShiftModalSizes } from '@plano/client/shift/shift-modal-sizes';
import { SchedulingApiService, SchedulingApiShiftModel, SchedulingApiShift, SchedulingApiPaymentMethodType } from '@plano/shared/api';
import { SchedulingApiShiftRepetitionType, SchedulingApiCourseType, SchedulingApiWorkingTimeCreationMethod, SchedulingApiBookingDesiredDateSetting, SchedulingApiPosSystem } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { PApiPrimitiveTypes, PSupportedCurrencyCodes } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { SHIFT_MODEL_COLOR_SHADES } from './available-color-shades';
import { IntervalEndDateModes, PShiftAndShiftmodelFormService } from './p-shift-and-shiftmodel-form.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { PCurrencyPipe } from '../../../../shared/core/pipe/p-currency.pipe';
import { AngularDatePipeFormat } from '../../../../shared/core/pipe/p-date.pipe';
import { PBookingFormService } from '../../../booking/booking-form.service';
import { BootstrapSize, PAlertThemeEnum, PBtnThemeEnum, PThemeEnum } from '../../bootstrap-styles.enum';
import { FormControlSwitchType } from '../../p-forms/p-form-control-switch/p-form-control-switch.component';
import { PShiftmodelTariffService } from '../../p-forms/p-shiftmodel-tariff.service';
import { PShiftService } from '../../p-shift-module/p-shift.service';
import { PTabSizeEnum } from '../../p-tabs/p-tabs/p-tab/p-tab.component';
import { PTypeOfChange } from '../../p-transmission/change-selectors-modal.component';
import { SectionWhitespace } from '../../page/section/section.component';
import { PDurationPipe } from '../../pipe/p-duration.pipe';
export var ShiftAndShiftModelFormTabs;
(function (ShiftAndShiftModelFormTabs) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ShiftAndShiftModelFormTabs["basissettings"] = "basissettings";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ShiftAndShiftModelFormTabs["bookingsettings"] = "bookingsettings";
})(ShiftAndShiftModelFormTabs || (ShiftAndShiftModelFormTabs = {}));
let PShiftAndShiftmodelFormComponent = class PShiftAndShiftmodelFormComponent {
    constructor(api, modalService, eventTypes, router, service, pWishesService, rightsService, pShiftModelTariffService, pShiftService, localize, percentPipe, pMoment, pDuration, bookingsService, toastsService, console, pFormsService, pCurrencyPipe, pBookingFormService) {
        this.api = api;
        this.modalService = modalService;
        this.eventTypes = eventTypes;
        this.router = router;
        this.service = service;
        this.pWishesService = pWishesService;
        this.rightsService = rightsService;
        this.pShiftModelTariffService = pShiftModelTariffService;
        this.pShiftService = pShiftService;
        this.localize = localize;
        this.percentPipe = percentPipe;
        this.pMoment = pMoment;
        this.pDuration = pDuration;
        this.bookingsService = bookingsService;
        this.toastsService = toastsService;
        this.console = console;
        this.pFormsService = pFormsService;
        this.pCurrencyPipe = pCurrencyPipe;
        this.pBookingFormService = pBookingFormService;
        this.Config = Config;
        this.shiftModel = null;
        this.shift = null;
        this.add = new EventEmitter();
        this.courseTypes = SchedulingApiCourseType;
        this.bookingDesiredDateSettings = SchedulingApiBookingDesiredDateSetting;
        this.formGroup = null;
        this.typeAheadShiftModelParentContent = [];
        this.typeAheadCourseGroupContent = [];
        this.costCentreTypeAheadArray = [];
        this.articleGroupTypeAheadArray = [];
        this.posAccountTypeAheadArray = [];
        this.shiftModelColorShades = SHIFT_MODEL_COLOR_SHADES;
        this.shiftModelColorShadeKeys = Object.keys(SHIFT_MODEL_COLOR_SHADES);
        this.intervalEndDateModes = IntervalEndDateModes;
        this.repetitionOptions = [
            { title: 'Tage', enum: SchedulingApiShiftRepetitionType.EVERY_X_DAYS },
            { title: 'Wochen', enum: SchedulingApiShiftRepetitionType.EVERY_X_WEEKS },
            { title: 'Monate', enum: SchedulingApiShiftRepetitionType.EVERY_X_MONTHS },
            { title: 'Jahre', enum: SchedulingApiShiftRepetitionType.EVERY_X_YEARS },
        ];
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.BootstrapSize = BootstrapSize;
        this.PThemeEnum = PThemeEnum;
        this.PApiPrimitiveTypes = PApiPrimitiveTypes;
        this.FormControlSwitchType = FormControlSwitchType;
        this.PAlertThemeEnum = PAlertThemeEnum;
        this.PBtnThemeEnum = PBtnThemeEnum;
        this.PTabSizeEnum = PTabSizeEnum;
        this.SectionWhitespace = SectionWhitespace;
        this.PTypeOfChange = PTypeOfChange;
        this.SchedulingApiPaymentMethodType = SchedulingApiPaymentMethodType;
    }
    /**
     * Should the bookingsettings be visible or not?
     */
    get showBookingsettingsTab() {
        // TODO: This should be replaced by rightsService.can()
        if (!this.userCanReadShiftModel)
            return false;
        // const MODEL = this.formItem instanceof SchedulingApiShift ? this.formItem.model : this.formItem;
        // if (!this.rightsService.can(ShiftsAndShiftModelsRights.readBookingSettings, MODEL)) return false;
        if (!this.formGroup)
            return false;
        // Currently the bookings-tab on mobile only shows the related bookings.
        // if there are no related bookings, no tab needed
        if (Config.IS_MOBILE && !this.showRelatedBookings)
            return false;
        if (this.formGroup.get('isCourse').value)
            return true;
        if (this.service.modeIsEditShiftModel)
            return true;
        if (this.service.modeIsCreateShiftModel)
            return true;
        return false;
    }
    /**
     * Should the accounting be visible or not?
     */
    get showAccountingTab() {
        if (!this.isOwner)
            return false;
        if (!this.showBookingsettingsTab)
            return false;
        if (this.service.modeIsEditShiftModel || this.service.modeIsCreateShiftModel)
            return true;
        return false;
    }
    ngOnInit() {
        // NOTE: Create-shift-Modal gets initialized without shift and shiftModel
        // Create-shiftModel-Modal gets initialized with a new and empty shiftModal item
        this.service.modeIsEditShift = (!!this.shift && !this.shift.isNewItem());
        this.service.modeIsEditShiftModel = (!!this.shiftModel && !this.shiftModel.isNewItem());
        this.service.modeIsCreateShift = (!!this.shift && this.shift.isNewItem());
        this.service.modeIsCreateShiftModel = (!!this.shiftModel && this.shiftModel.isNewItem());
        if (this.shift && !this.shiftModel) {
            this.shiftModel = this.shift.model;
        }
        this.now = +this.pMoment.m();
        this.service.now = this.now;
    }
    ngAfterContentInit() {
        this.initComponent();
    }
    /**
     * Load and set everything that is necessary for this component
     */
    initComponent(success) {
        assumeDefinedToGetStrictNullChecksRunning(this.formItem, 'formItem');
        if (this.formItem.isNewItem()) {
            this.initValues();
            this.initFormGroup();
            if (success) {
                success();
            }
        }
        else {
            // eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
            if (this.formItem.id === null)
                throw new Error('Can not load details if formItem has no defined id');
            this.formItem.loadDetailed({
                success: () => {
                    if (this.formItem instanceof SchedulingApiShift && !this.shiftModel) {
                        this.shiftModel = this.formItem.model;
                    }
                    this.initValues();
                    this.initFormGroup();
                    if (success)
                        success();
                },
            });
        }
    }
    initTypeAheadArrays() {
        this.typeAheadShiftModelParentContent = this.api.data.shiftModels.parentNames;
        this.typeAheadCourseGroupContent = this.api.data.shiftModels.courseGroups;
        const addTypeAheadValue = (value, array) => {
            if (value && !array.includes(value))
                array.push(value);
        };
        for (const shiftModel of this.api.data.shiftModels.iterable()) {
            addTypeAheadValue(shiftModel.costCentre, this.costCentreTypeAheadArray);
            addTypeAheadValue(shiftModel.articleGroup, this.articleGroupTypeAheadArray);
            for (const posAccount of shiftModel.posAccounts.iterable())
                addTypeAheadValue(posAccount.name, this.posAccountTypeAheadArray);
        }
    }
    initShiftModelValues() {
        var _a;
        if (!this.shiftModel)
            throw new Error('This method should never be called when shiftModel is null');
        if (this.shiftModel.courseType === null) {
            this.shiftModel.courseType = SchedulingApiCourseType.ONLINE_BOOKABLE;
        }
        if (!this.shiftModel.posAccounts.length) {
            for (const possibleTax of this.api.data.possibleTaxes.iterable()) {
                const newPosAccount = this.shiftModel.posAccounts.createNewItem();
                newPosAccount.tax = possibleTax;
                newPosAccount.name = this.localize.transform('Buchungen ${taxPercent}', {
                    taxPercent: (_a = this.percentPipe.transform(possibleTax / 100, '0.0-1')) !== null && _a !== void 0 ? _a : '…',
                });
            }
        }
    }
    initFormItemValues() {
        assumeDefinedToGetStrictNullChecksRunning(this.formItem, 'formItem');
        assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
        if (this.formItem.attributeInfoWorkingTimeCreationMethod.value === null) {
            if (this.shiftModel.attributeInfoWorkingTimeCreationMethod.value === null) {
                this.formItem.workingTimeCreationMethod = SchedulingApiWorkingTimeCreationMethod.AUTOMATIC;
            }
            else {
                this.formItem.workingTimeCreationMethod = this.shiftModel.workingTimeCreationMethod;
            }
        }
        if (this.formItem.attributeInfoMinCourseParticipantCount.value === null) {
            if (this.shiftModel.minCourseParticipantCount) {
                this.formItem.minCourseParticipantCount = this.shiftModel.minCourseParticipantCount;
            }
            else {
                this.formItem.minCourseParticipantCount = 1;
            }
        }
        if (this.formItem.maxCourseParticipantCount === null) {
            this.formItem.maxCourseParticipantCount = this.shiftModel.maxCourseParticipantCount;
        }
        if (this.formItem.isNewItem() && this.formItem instanceof SchedulingApiShiftModel) {
            if (this.formItem.repetition.attributeInfoType.value === null) {
                this.formItem.repetition.type = SchedulingApiShiftRepetitionType.NONE;
            }
            if (this.formItem.repetition.packetRepetition.attributeInfoType.value === null) {
                this.formItem.repetition.packetRepetition.type = SchedulingApiShiftRepetitionType.NONE;
            }
        }
    }
    initWishesServiceValue() {
        assumeDefinedToGetStrictNullChecksRunning(this.formItem, 'formItem');
        if (this.formItem.isNewItem() && this.formItem instanceof SchedulingApiShiftModel)
            return;
        this.pWishesService.item = this.formItem;
    }
    /**
     * Init all necessary values for this class
     */
    initValues() {
        this.initTypeAheadArrays();
        this.initStartOfDay();
        this.initEndOfDay();
        this.initFormItemValues();
        this.initShiftModelValues();
        this.initWishesServiceValue();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get formItem() {
        if (this.service.modeIsEditShift || this.service.modeIsCreateShift) {
            return this.shift;
        }
        return this.shiftModel;
    }
    /**
     * Initialize the formGroup for this component
     */
    initFormGroup() {
        if (this.formItem === null)
            throw new Error(`never call initFormGroup() without a defined formItem`);
        if (this.formGroup) {
            // this.pFormsService.removePControl(this.formGroup, 'currentCancellationPolicy');
            this.formGroup = null;
        }
        const model = this.formItem instanceof SchedulingApiShift ? this.formItem.model : this.formItem;
        this.formGroup = this.service.initFormGroup(this.formItem, this.userCanWrite, this.api.data.notificationsConf, this.api.data.shiftModels, this.modalContentForIsCoronaSlotBooking, model);
        this.pFormsService.addFormGroup(this.formGroup, 'currentCancellationPolicy', new FormGroup({}));
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    removeTariff(formGroup, i, tariff) {
        assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
        this.pShiftModelTariffService.removeTariff(formGroup, i, tariff, this.shiftModel);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    hasPaymentMethodOfType(type) {
        assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
        for (let i = 0; i < this.shiftModel.coursePaymentMethods.length; i++) {
            const coursePaymentMethod = this.shiftModel.coursePaymentMethods.get(i);
            if (!coursePaymentMethod)
                throw new Error('coursePaymentMethod not found');
            if (coursePaymentMethod.type === type && !coursePaymentMethod.trashed) {
                return true;
            }
        }
        return false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    removeCoursePaymentMethod(formGroup, i, coursePaymentMethod) {
        if (!coursePaymentMethod.isNewItem()) {
            this.service.setChangeSelectors(coursePaymentMethod);
        }
        if (coursePaymentMethod.isNewItem()) {
            assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
            this.shiftModel.coursePaymentMethods.removeItem(coursePaymentMethod);
        }
        else {
            coursePaymentMethod.trashed = true;
        }
        // eslint-disable-next-line @typescript-eslint/ban-types
        const formArray = formGroup.get('coursePaymentMethods');
        formArray.removeAt(i);
        formArray.updateValueAndValidity();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    trimParentName() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        this.trim(this.formGroup.get('parentName'));
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    trimCourseGroup() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        this.trim(this.formGroup.get('courseGroup'));
    }
    trim(control) {
        if (!control.value)
            return;
        control.setValue(control.value.trim());
        control.updateValueAndValidity();
    }
    /**
     * Check if color is selected
     * @param availableColor color that needs to be checked
     */
    isSelectedColor(availableColor) {
        assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
        return !!this.shiftModel.color && availableColor.toUpperCase() === this.shiftModel.color.toUpperCase();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get packetRepetitionTitle() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        switch (this.formGroup.get('packetRepetition_type').value) {
            case SchedulingApiShiftRepetitionType.EVERY_X_DAYS:
                return this.localize.transform(this.repetitionOptions[0].title);
            case SchedulingApiShiftRepetitionType.EVERY_X_WEEKS:
                return this.localize.transform(this.repetitionOptions[1].title);
            case SchedulingApiShiftRepetitionType.EVERY_X_MONTHS:
                return this.localize.transform(this.repetitionOptions[2].title);
            case SchedulingApiShiftRepetitionType.EVERY_X_YEARS:
                return this.localize.transform(this.repetitionOptions[3].title);
            case SchedulingApiShiftRepetitionType.NONE:
                return this.localize.transform('Wähle…');
            default:
                this.formGroup.get('packetRepetition_type').setValue(0);
                this.formGroup.get('packetRepetition_type').updateValueAndValidity();
                return 'Wähle…';
        }
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get repetitionTitle() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        switch (this.formGroup.get('repetition_type').value) {
            case SchedulingApiShiftRepetitionType.EVERY_X_DAYS:
                return this.localize.transform(this.repetitionOptions[0].title);
            case SchedulingApiShiftRepetitionType.EVERY_X_WEEKS:
                return this.localize.transform(this.repetitionOptions[1].title);
            case SchedulingApiShiftRepetitionType.EVERY_X_MONTHS:
                return this.localize.transform(this.repetitionOptions[2].title);
            case SchedulingApiShiftRepetitionType.EVERY_X_YEARS:
                return this.localize.transform(this.repetitionOptions[3].title);
            case SchedulingApiShiftRepetitionType.NONE:
                return this.localize.transform('Wähle…');
            default:
                this.formGroup.get('repetition_type').setValue(undefined);
                this.formGroup.get('repetition_type').updateValueAndValidity();
                return this.localize.transform('Wähle…');
        }
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get repetitionEndDateModeTitle() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        switch (this.formGroup.get('selectedRepetitionEndDateMode').value) {
            case IntervalEndDateModes.NEVER:
                return this.service.intervalEndDateModesIterable[0].title;
            case IntervalEndDateModes.AFTER_X_TIMES:
                assumeDefinedToGetStrictNullChecksRunning(this.formItem, 'formItem');
                if (this.formItem.repetition.endsAfterRepetitionCount > 1) {
                    if (this.formGroup.get('isPacket').value) {
                        return this.localize.transform('Paketen');
                    }
                    else {
                        return this.localize.transform('Schichten');
                    }
                }
                else {
                    if (this.formGroup.get('isPacket').value) {
                        return this.localize.transform('Paket');
                    }
                    else {
                        return this.localize.transform('Schicht');
                    }
                }
            case IntervalEndDateModes.ENDS_AFTER_DATE:
                return this.localize.transform('nach dem');
            default:
                return this.localize.transform('Wähle…');
        }
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get packetTypeIsWeekly() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        // this.formItem.repetition.packetRepetition.isRepeatingOnFriday
        return this.formGroup.get('packetRepetition_type').value ===
            SchedulingApiShiftRepetitionType.EVERY_X_WEEKS;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get typeIsWeekly() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        // this.formItem.repetition.packetRepetition.isRepeatingOnFriday
        return this.formGroup.get('repetition_type').value === SchedulingApiShiftRepetitionType.EVERY_X_WEEKS;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get packetIsEditableOrAlreadySet() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        return (this.service.modeIsEditShift && this.formGroup.get('isPacket').value) || !this.service.modeIsEditShift;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get intervalIsEditableOrAlreadySet() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        return (this.service.modeIsEditShift && this.formGroup.get('isInterval').value) || !this.service.modeIsEditShift;
    }
    /**
     * Handle click on delete button
     */
    getChangeSelectorModalAsHook(modalContent) {
        return this.modalService.getEditableHook(modalContent, {
            success: () => {
            },
            dismiss: () => {
                this.initFormGroup();
            },
            size: this.shift ? ShiftModalSizes.WITH_TRANSMISSION_PREVIEW : null,
        });
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    onDismiss() {
        // TODO: (PLANO-1868)
        if (this.shift) {
            this.shift = this.api.data.shifts.get(this.shift.id);
        }
        this.initFormGroup();
    }
    /**
     * Check if user can read this shift
     */
    get userCanReadShiftModel() {
        const MODEL = this.formItem instanceof SchedulingApiShift ? this.formItem.model : this.formItem;
        if (!MODEL)
            throw new Error('model can not be found');
        return this.rightsService.userCanRead(MODEL);
    }
    /**
     * open detail view to edit booking
     */
    navToBooking(booking) {
        if (booking) {
            assumeDefinedToGetStrictNullChecksRunning(booking.id, 'booking.id');
            this.router.navigate([`/client/booking/${booking.id.toString()}`]);
        }
        else if (this.shift) {
            this.router.navigate([`/client/booking/create/${this.shift.id.toUrl()}`]);
        }
        else {
            this.router.navigate(['/client/booking/']);
        }
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get hasBookingsForList() {
        const component = new PShiftBookingsComponent(this.api, this.pShiftService, this.bookingsService, this.console, this.pShiftModelTariffService, this.pBookingFormService);
        assumeDefinedToGetStrictNullChecksRunning(this.shift, 'this.shift');
        component.shift = this.shift;
        return component.hasBookingsForList;
    }
    /**
     * Check if user can edit this shift
     */
    get userCanWrite() {
        assumeDefinedToGetStrictNullChecksRunning(this.formItem, 'this.formItem');
        return !!this.rightsService.userCanWrite(this.formItem);
    }
    /**
     * Check if user can edit this shift
     */
    get isOwner() {
        return this.rightsService.isOwner;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get intervalSettingsAreValid() {
        return this.service.intervalSettingsAreValid(this.formGroup);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get shiftPacketSettingsValid() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        if (this.formGroup.get('isPacket').invalid)
            return false;
        if (this.formGroup.get('packet_x').invalid)
            return false;
        if (this.formGroup.get('packetRepetition_type').invalid)
            return false;
        if (this.formGroup.get('packet_endsAfterRepetitionCount').invalid)
            return false;
        if (this.formGroup.get('packet_weekdays').invalid)
            return false;
        return true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get shiftPacketSettingsDisabled() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        return (this.userCanWrite && this.service.modeIsEditShift ||
            this.formGroup.get('isPacket').disabled ||
            this.formGroup.get('packet_x').disabled ||
            this.formGroup.get('packetRepetition_type').disabled ||
            this.formGroup.get('packet_endsAfterRepetitionCount').disabled);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get intervalSettingsAreDisabled() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        if (this.userCanWrite && this.service.modeIsEditShift)
            return true;
        if (this.formGroup.get('repetition_type').disabled)
            return true;
        if (this.formGroup.get('repetition_x').disabled)
            return true;
        if (this.formGroup.get('repetition_endsAfterRepetitionCount').disabled)
            return true;
        return false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showRelatedBookings() {
        assumeDefinedToGetStrictNullChecksRunning(this.formItem, 'formItem');
        if (this.formItem.isNewItem())
            return false;
        if (this.service.modeIsEditShiftModel)
            return false;
        if (this.service.modeIsCreateShiftModel)
            return false;
        if (!this.userCanReadShiftModel)
            return false;
        assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
        if (this.shiftModel.courseType === SchedulingApiCourseType.NO_BOOKING)
            return false;
        return true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showNeededMembersCountConfShowroom() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        const tempFormGroup = this.formGroup.get('neededMembersCountConf');
        assumeDefinedToGetStrictNullChecksRunning(tempFormGroup, 'tempFormGroup');
        const modeIsFixedMembersCountControl = tempFormGroup.get('modeIsFixedMembersCount');
        assumeDefinedToGetStrictNullChecksRunning(modeIsFixedMembersCountControl, 'modeIsFixedMembersCountControl');
        if (modeIsFixedMembersCountControl.value)
            return false;
        if (!this.service.modeIsEditShift && !this.service.modeIsCreateShift)
            return false;
        return true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get neededMembersCountConfNotReached() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        assumeDefinedToGetStrictNullChecksRunning(this.shift, 'shift');
        const tempFormGroup = this.formGroup.get('neededMembersCountConf');
        assumeDefinedToGetStrictNullChecksRunning(tempFormGroup, 'tempFormGroup');
        const isZeroNotReachedMinParticipantsControls = tempFormGroup.get('isZeroNotReachedMinParticipantsCount');
        assumeDefinedToGetStrictNullChecksRunning(isZeroNotReachedMinParticipantsControls, 'isZeroNotReachedMinParticipantsControls');
        return (isZeroNotReachedMinParticipantsControls.value &&
            this.shift.currentCourseParticipantCount < this.shift.minCourseParticipantCount);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showSendEmailSetting() {
        if (!this.shift)
            return false;
        return this.shift.assignedMemberIds.length > 0;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    hasCourseEmails(type) {
        return this.api.data.customBookableMails.getByEventType(type).length > 0;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get basisSettingsTabLabel() {
        if (Config.IS_MOBILE)
            return this.localize.transform('Schichtinfo');
        return this.localize.transform('Grundeinstellungen');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get bookingsettingsTabLabel() {
        if (Config.IS_MOBILE)
            return this.localize.transform('Buchungsinfo');
        return this.localize.transform('Buchungseinstellungen');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get bookingsettingsTabHasDanger() {
        var _a, _b, _c, _d;
        if ((_b = (_a = this.formGroup) === null || _a === void 0 ? void 0 : _a.get('courseCodePrefix')) === null || _b === void 0 ? void 0 : _b.invalid)
            return true;
        if ((_d = (_c = this.formGroup) === null || _c === void 0 ? void 0 : _c.get('courseTariffs')) === null || _d === void 0 ? void 0 : _d.invalid)
            return true;
        return false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showQuickAssignment() {
        if (!Config.IS_MOBILE)
            return false;
        if (!this.shift)
            return false;
        if (this.shift.assignedMemberIds.length > 0)
            return true;
        if (this.shift.emptyMemberSlots > 0)
            return true;
        return false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showBookingOptionsSection() {
        if (this.service.modeIsEditShiftModel)
            return true;
        if (this.service.modeIsCreateShiftModel)
            return true;
        if (this.userCanWrite)
            return true;
        return false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get addButtonIsDisabled() {
        return !this.formGroup || this.formGroup.invalid || this.api.isBackendOperationRunning;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showControlCourseCodePrefix() {
        return (this.userCanWrite &&
            this.formGroup.get('isCourse').value &&
            (this.service.modeIsEditShiftModel || this.service.modeIsCreateShiftModel));
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showControlCourseCode() {
        return (this.formGroup.get('isCourse').value &&
            this.service.modeIsEditShift || this.service.modeIsCreateShift);
    }
    initStartOfDay() {
        this.startOfDay = this.pMoment.duration('00:00').asMilliseconds();
    }
    initEndOfDay() {
        this.endOfDay = this.pMoment.duration('23:59').asMilliseconds();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get translatedStartTimeValidationHintText() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        let end;
        if (!!this.formGroup.get('endTime').value &&
            this.formGroup.get('endTime').value !== null) {
            end = this.formGroup.get('endTime').value;
        }
        else {
            end = this.endOfDay;
        }
        return this.timeValidationHintText(this.startOfDay, end);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get translatedEndTimeValidationHintText() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        let start;
        if (!!this.formGroup.get('startTime').value &&
            this.formGroup.get('startTime').value !== null) {
            start = this.formGroup.get('startTime').value;
        }
        else {
            start = this.startOfDay;
        }
        return this.timeValidationHintText(start, this.endOfDay);
    }
    timeValidationHintText(start, end) {
        var _a, _b;
        return this.localize.transform('Benötigtes Format: ss:mm. Wähle eine Uhrzeit zwischen ${start} und ${end}', {
            start: (_a = this.pDuration.transform(start, AngularDatePipeFormat.SHORT_TIME)) !== null && _a !== void 0 ? _a : '…',
            end: (_b = this.pDuration.transform(end, AngularDatePipeFormat.SHORT_TIME)) !== null && _b !== void 0 ? _b : '…',
        });
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get translatedIsIntervalValueText() {
        var _a, _b;
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
        if (this.formGroup.get('isPacket').value) {
            return this.localize.transform('Das Schicht-Paket »${shiftModelName}« wiederholt sich.', {
                shiftModelName: (_a = this.shiftModel.attributeInfoName.value) !== null && _a !== void 0 ? _a : '…',
            });
        }
        return this.localize.transform('Die Schicht »${shiftModelName}« wiederholt sich.', {
            shiftModelName: (_b = this.shiftModel.attributeInfoName.value) !== null && _b !== void 0 ? _b : '…',
        });
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get translatedNeededMembersCountModalBoxLabel() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        const neededMembersCountConf = this.formGroup.get('neededMembersCountConf');
        const neededMembersCount = neededMembersCountConf.get('neededMembersCount').value;
        let result = '';
        switch (neededMembersCount) {
            case 0:
                result += this.localize.transform('0 Mitarbeitende');
                break;
            case 1:
                result += this.localize.transform('1 Mitarbeitende');
                break;
            default:
                result += this.localize.transform('${counter} Mitarbeitende', { counter: neededMembersCount });
        }
        const modeIsFixedMembersCount = neededMembersCountConf.get('modeIsFixedMembersCount').value;
        if (!modeIsFixedMembersCount) {
            result += ' ';
            result += this.localize.transform('pro ${x} teilnehmende', {
                x: neededMembersCountConf.get('perXParticipants').value,
            });
        }
        return result;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get packetEndsAfterRepetitionCountLabel() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        if (this.formGroup.get('packet_endsAfterRepetitionCount').value > 1) {
            return this.localize.transform('Verteilt auf die Tage');
        }
        return this.localize.transform('Am');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isPacketLabel() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        if (!this.formGroup.get('isPacket').value)
            return this.localize.transform('An jedem');
        return this.localize.transform('Das Paket beginnt jeweils am');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get affectedWeekdays() {
        let result = '';
        const addDayToResult = (day) => {
            if (result.length > 0)
                result += ', ';
            result += this.localize.transform(day);
        };
        assumeDefinedToGetStrictNullChecksRunning(this.formItem, 'formItem');
        if (this.formItem.repetition.packetRepetition.isRepeatingOnMonday)
            addDayToResult('Mo');
        if (this.formItem.repetition.packetRepetition.isRepeatingOnTuesday)
            addDayToResult('Di');
        if (this.formItem.repetition.packetRepetition.isRepeatingOnWednesday)
            addDayToResult('Mi');
        if (this.formItem.repetition.packetRepetition.isRepeatingOnThursday)
            addDayToResult('Do');
        if (this.formItem.repetition.packetRepetition.isRepeatingOnFriday)
            addDayToResult('Fr');
        if (this.formItem.repetition.packetRepetition.isRepeatingOnSaturday)
            addDayToResult('Sa');
        if (this.formItem.repetition.packetRepetition.isRepeatingOnSunday)
            addDayToResult('So');
        if (result === '')
            result = '–';
        return result;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showFreeclimberSettings() {
        if (this.shift)
            return false;
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        if (!this.formGroup.get('isCourse').value)
            return false;
        if (this.api.data.posSystem !== SchedulingApiPosSystem.FREECLIMBER)
            return false;
        return true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get formItemName() {
        if (!this.formItem || !this.formItem.name)
            return this.localize.transform('Neue Tätigkeit');
        return this.formItem.name;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    copyTariff(event, courseTariff) {
        event.preventDefault();
        event.stopPropagation();
        // Create a new tariff based on the clicked one
        const NEW_TARIFF = courseTariff.get('reference').value.copy();
        // Check if a copy already exists.
        const NEW_TARIFF_NAME = `${NEW_TARIFF.name} – ${this.localize.transform('Kopie')}`;
        assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
        if (this.shiftModel.courseTariffs.findBy(item => !item.trashed && item.name === NEW_TARIFF_NAME)) {
            this.toastsService.addToast({
                theme: PThemeEnum.DANGER,
                title: this.localize.transform('Momentchen …'),
                content: this.localize.transform('Ein Tarif mit dem Namen »${name}« existiert schon.', {
                    name: NEW_TARIFF_NAME,
                }),
            });
            return;
        }
        // Edit necessary values
        NEW_TARIFF.name = NEW_TARIFF_NAME;
        // Add the new tariff to the existing ones
        this.shiftModel.courseTariffs.push(NEW_TARIFF);
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        // eslint-disable-next-line @typescript-eslint/ban-types
        const formArray = this.formGroup.get('courseTariffs');
        const INDEX_OF_TEMPLATE = formArray.controls.indexOf(courseTariff);
        const NEW_INDEX = INDEX_OF_TEMPLATE !== -1 ? INDEX_OF_TEMPLATE + 1 : null;
        // Create a new form group based on the pushed item
        this.service.addTariff({
            formGroup: this.formGroup,
            userCanWrite: this.userCanWrite,
            shiftModel: this.shiftModel,
            item: NEW_TARIFF,
            indexToInsert: NEW_INDEX,
        });
    }
    /**
     * Add a brand new tariff to the list of tariffs.
     * Beware: This method also sets default values.
     */
    addNewTariff(formGroup, userCanWrite, shiftModel, item, index) {
        this.service.addTariff({
            formGroup: formGroup,
            userCanWrite: userCanWrite,
            shiftModel: shiftModel,
            item: item !== null && item !== void 0 ? item : null,
            indexToInsert: index !== null && index !== void 0 ? index : null,
        });
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    hasCourseDatesData(courseTariff) {
        return this.pShiftModelTariffService.hasCourseDatesData(courseTariff.negateForCourseDatesInterval, courseTariff.forCourseDatesFrom, courseTariff.forCourseDatesUntil);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    forCourseDatesPlaceholder(time) {
        return !time ? this.localize.transform('Unbegrenzt') : null;
    }
    paymentMethodIsPayPal(paymentMethod) {
        return paymentMethod.type === SchedulingApiPaymentMethodType.PAYPAL;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    paymentMethodIcon(paymentMethod) {
        if (this.paymentMethodIsPayPal(paymentMethod))
            return PlanoFaIconPool.BRAND_PAYPAL;
        return this.pCurrencyPipe.getPaymentMethodIcon(paymentMethod.type, paymentMethod.name);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get saveChangesHook() {
        assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
        const IS_FREE_COURSE = this.pShiftModelTariffService.isFreeCourse(this.shiftModel.courseTariffs, this.shiftModel.coursePaymentMethods);
        if (!IS_FREE_COURSE)
            return undefined;
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        if (this.formGroup.get('isFreeCourse').value)
            return undefined;
        return (success, dismiss) => {
            let text = '';
            assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
            const hasUntrashedPaymentMethods = this.shiftModel.courseTariffs.hasUntrashedItem;
            if (hasUntrashedPaymentMethods && !this.pShiftModelTariffService.hasVisiblePaymentMethod(this.shiftModel.coursePaymentMethods)) {
                text += this.localize.transform('Alle Zahlungsarten sind als interne Zahlungsart markiert.');
                text += ' ';
            }
            const hasUntrashedCourseTariff = this.shiftModel.courseTariffs.hasUntrashedItem;
            if (hasUntrashedCourseTariff && !this.pShiftModelTariffService.hasVisibleCourseTariffWithCosts(this.shiftModel.courseTariffs)) {
                text += this.localize.transform('Alle Tarife sind als interner Tarif markiert.');
                text += ' ';
            }
            text += this.localize.transform('${name} wird bei Online-Buchung als kostenlos angezeigt werden.', { name: this.shiftModel.name });
            this.modalService.confirm({
                description: text,
            }, {
                theme: PThemeEnum.WARNING,
                success: () => {
                    success();
                    assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
                    this.formGroup.get('isFreeCourse').setValue(true);
                },
                dismiss: dismiss,
            });
        };
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showIsCoronaSlotBooking() {
        if (this.service.modeIsEditShift || this.service.modeIsCreateShift)
            return false;
        assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
        if (!this.shiftModel.isCourse)
            return false;
        if (this.shiftModel.courseType !== SchedulingApiCourseType.ONLINE_BOOKABLE)
            return false;
        if (!this.rightsService.userCanWrite(this.shiftModel))
            return false;
        return true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get hasTariffWithNoCosts() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        // eslint-disable-next-line @typescript-eslint/ban-types
        const courseTariffsControl = this.formGroup.get('courseTariffs');
        assumeDefinedToGetStrictNullChecksRunning(courseTariffsControl, 'courseTariffsControl');
        const tariffs = courseTariffsControl.controls.map(item => {
            return item.get('reference').value;
        });
        for (const tariff of tariffs) {
            if (tariff.isInternal)
                continue;
            if (tariff.trashed)
                continue;
            if (tariff.fees.findBy(fee => fee.fee > 0))
                continue;
            return true;
        }
        return false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get hasTariffWithCosts() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        // eslint-disable-next-line @typescript-eslint/ban-types
        const tariffs = this.formGroup.get('courseTariffs').controls.map(item => {
            return item.get('reference').value;
        });
        for (const tariff of tariffs) {
            if (tariff.isInternal)
                continue;
            if (tariff.trashed)
                continue;
            if (!tariff.fees.findBy(fee => fee.fee > 0))
                continue;
            return true;
        }
        return false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get basisSettingsIsInvalid() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        return this.formGroup.get('name').invalid;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showAddBookingsBtn() {
        if (this.shiftModel === null)
            return null;
        if (!this.service.modeIsEditShift)
            return false;
        if (!this.rightsService.can(BookingSystemRights.createBookings, this.shiftModel))
            return false;
        return true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get shiftStart() {
        if (!this.shift)
            return undefined;
        if (!this.shift.rawData)
            throw new Error('Can not get start. Shift is lost. [PLANO-FE-3FN]');
        return this.shift.start;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/ban-types
    showPaymentMethodNameAndDescriptionFormFields(paymentMethodFormGroup) {
        const typeControl = paymentMethodFormGroup.get(paymentMethodFormGroup.get('reference').value.attributeInfoType.id);
        if (!typeControl) {
            this.console.error('No typeControl available');
            return undefined;
        }
        return typeControl.value !== this.service.paymentMethodTypes.PAYPAL && typeControl.value !== this.service.paymentMethodTypes.ONLINE_PAYMENT;
    }
    /**
     * @returns Should option paypal be available?
     */
    get showPaypal() {
        if (!this.api.data.isPaypalAvailable)
            return false;
        const now = +this.pMoment.m();
        return now <= Config.PAYPAL_SHUTDOWN_DATE;
    }
    /**
     * @returns Should option online-payment be available?
     */
    get showOnlinePayment() {
        return this.api.data.isOnlinePaymentAvailable;
    }
    /**
     * Is Adyen supported for this client?
     */
    get adyenIsSupported() {
        return Config.CURRENCY_CODE === PSupportedCurrencyCodes.EUR;
    }
    /**
     * Text for the case that online-payment is not available
     */
    get cannotEditOnlinePaymentHint() {
        // eslint-disable-next-line literal-blacklist/literal-blacklist
        if (!this.adyenIsSupported)
            return 'Online-Zahlung steht für deine Landeswährung noch nicht zur Verfügung. Falls du die Online-Zahlung nutzen möchtest, melde dich gerne bei uns im Chat oder per <a href="mailto:service@dr-plano.com">Email</a>.';
        // eslint-disable-next-line literal-blacklist/literal-blacklist
        return 'Bitte erst für deinen Account die <a href="client/plugin/payments" target="_blank">Online-Zahlung aktivieren</a>, um die Zahlungsart hier verwenden zu können.';
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftAndShiftmodelFormComponent.prototype, "shiftModel", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftAndShiftmodelFormComponent.prototype, "shift", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_l = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _l : Object)
], PShiftAndShiftmodelFormComponent.prototype, "add", void 0);
__decorate([
    ViewChild('modalContentForIsCoronaSlotBooking', { static: true }),
    __metadata("design:type", typeof (_m = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _m : Object)
], PShiftAndShiftmodelFormComponent.prototype, "modalContentForIsCoronaSlotBooking", void 0);
PShiftAndShiftmodelFormComponent = __decorate([
    Component({
        selector: 'p-shift-and-shiftmodel-form',
        templateUrl: './p-shift-and-shiftmodel-form.component.html',
        styleUrls: ['./p-shift-and-shiftmodel-form.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        animations: [SLIDE_ON_NGIF_TRIGGER],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, ModalService, typeof (_b = typeof EventTypesService !== "undefined" && EventTypesService) === "function" ? _b : Object, typeof (_c = typeof Router !== "undefined" && Router) === "function" ? _c : Object, PShiftAndShiftmodelFormService, typeof (_d = typeof PWishesService !== "undefined" && PWishesService) === "function" ? _d : Object, typeof (_e = typeof RightsService !== "undefined" && RightsService) === "function" ? _e : Object, PShiftmodelTariffService,
        PShiftService,
        LocalizePipe, typeof (_f = typeof PercentPipe !== "undefined" && PercentPipe) === "function" ? _f : Object, PMomentService,
        PDurationPipe, typeof (_g = typeof BookingsService !== "undefined" && BookingsService) === "function" ? _g : Object, ToastsService,
        LogService,
        PFormsService,
        PCurrencyPipe, typeof (_h = typeof PBookingFormService !== "undefined" && PBookingFormService) === "function" ? _h : Object])
], PShiftAndShiftmodelFormComponent);
export { PShiftAndShiftmodelFormComponent };
//# sourceMappingURL=p-shift-and-shiftmodel-form.component.js.map