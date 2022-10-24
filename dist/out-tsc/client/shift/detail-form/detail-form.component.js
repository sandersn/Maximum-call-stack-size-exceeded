var _a, _b, _c, _d, _e, _f, _g, _h;
import { __decorate, __metadata } from "tslib";
/* eslint-disable @angular-eslint/component-selector */
import { Component, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingsService } from '@plano/client/scheduling/shared/p-bookings/bookings.service';
import { BootstrapSize, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PShiftBookingsComponent } from '@plano/client/shared/component/p-shift-and-shiftmodel-form/p-shift-bookings/p-shift-bookings.component';
import { PShiftmodelTariffService } from '@plano/client/shared/p-forms/p-shiftmodel-tariff.service';
import { PShiftService } from '@plano/client/shared/p-shift-module/p-shift.service';
import { SchedulingApiService, SchedulingApiShiftModels } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PRouterService } from '@plano/shared/core/router.service';
import { assumeNonNull } from '../../../shared/core/null-type-utils';
import { PBookingFormService } from '../../booking/booking-form.service';
import { FormattedDateTimePipe } from '../../shared/formatted-date-time.pipe';
import { ShiftModalSizes } from '../shift-modal-sizes';
let DetailFormComponent = class DetailFormComponent {
    constructor(activatedRoute, api, pRouterService, modalService, rightsService, pShiftService, formattedDateTimePipe, localize, bookingsService, console, pShiftModelTariffService, pBookingFormService) {
        this.activatedRoute = activatedRoute;
        this.api = api;
        this.pRouterService = pRouterService;
        this.modalService = modalService;
        this.rightsService = rightsService;
        this.pShiftService = pShiftService;
        this.formattedDateTimePipe = formattedDateTimePipe;
        this.localize = localize;
        this.bookingsService = bookingsService;
        this.console = console;
        this.pShiftModelTariffService = pShiftModelTariffService;
        this.pBookingFormService = pBookingFormService;
        this.isLoading = false;
        this.item = null;
        this.onAddItem = new EventEmitter();
        this.PThemeEnum = PThemeEnum;
        this.BootstrapSize = BootstrapSize;
        this.CONFIG = Config;
        this.formGroup = null;
        this.routeShiftModelId = null;
    }
    /**
     * Check if url has shiftModelId
     */
    getRouteShiftModelId() {
        const idAsString = this.activatedRoute.snapshot.paramMap.get('shiftmodelid');
        this.routeShiftModelId = idAsString === null ? null : Id.create(+idAsString);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    headlineDate() {
        assumeNonNull(this.item);
        return this.formattedDateTimePipe.getFormattedDateInfo(this.item.start, this.item.end, true).full;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get headlineTime() {
        assumeNonNull(this.item);
        const end = Config.IS_MOBILE ? this.item.end : undefined;
        return this.formattedDateTimePipe.getFormattedTimeInfo(this.item.start, end, Config.IS_MOBILE).full;
    }
    ngAfterContentInit() {
        this.initComponent();
    }
    /**
     * Load and set everything that is necessary for this component
     */
    initComponent() {
    }
    /**
     * Initialize the formGroup for this component
     */
    initFormGroup() {
        if (this.formGroup) {
            this.formGroup = null;
        }
    }
    /**
     * Remove Item of this Detail page
     */
    removeItem(deleteWarning) {
        this.modalService.openModal(deleteWarning, {
            size: ShiftModalSizes.WITH_TRANSMISSION_PREVIEW,
            success: () => {
                this.formGroup = null;
                assumeNonNull(this.item);
                this.api.data.shifts.removeItem(this.item);
                this.api.save({
                    success: () => {
                        this.pRouterService.navBack();
                    },
                });
            },
        });
    }
    /**
     * Save this item
     */
    saveItem() {
        assumeNonNull(this.item);
        if (!this.item.isNewItem())
            return;
        this.onAddItem.emit(this.item);
        this.pRouterService.navBack();
    }
    /** navBack */
    navBack() {
        this.pRouterService.navBack();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get hasBookingsForList() {
        const component = new PShiftBookingsComponent(this.api, this.pShiftService, this.bookingsService, this.console, this.pShiftModelTariffService, this.pBookingFormService);
        assumeNonNull(this.item);
        component.shift = this.item;
        return component.hasBookingsForList;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get courseCode() {
        assumeNonNull(this.item);
        if (!this.item.id.courseCode)
            return undefined;
        if (!this.item.model.isCourse)
            return undefined;
        return this.item.id.courseCode;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isCourse() {
        assumeNonNull(this.item);
        return this.item.model.isCourse;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftName() {
        var _a;
        if ((_a = this.item) === null || _a === void 0 ? void 0 : _a.name) {
            if (!this.item.rawData)
                throw new Error('Can not get shift name. Shift is lost [PLANO-FE-2TT]');
            return this.item.name;
        }
        return this.localize.transform('Neue Schicht');
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftColor() {
        if (!this.item)
            return null;
        if (!this.item.model.rawData)
            throw new Error('[PLANO-FE-JV]');
        if (!this.item.model.color)
            return null;
        return `#${this.item.model.color}`;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftModel() {
        if (!this.item)
            return undefined;
        return this.item.model;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftStart() {
        if (!this.item)
            return undefined;
        if (!this.item.rawData)
            return undefined;
        if (!this.item.start)
            return undefined;
        return this.item.start;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], DetailFormComponent.prototype, "isLoading", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], DetailFormComponent.prototype, "item", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_g = typeof SchedulingApiShiftModels !== "undefined" && SchedulingApiShiftModels) === "function" ? _g : Object)
], DetailFormComponent.prototype, "writableShiftModelsForMember", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_h = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _h : Object)
], DetailFormComponent.prototype, "onAddItem", void 0);
DetailFormComponent = __decorate([
    Component({
        selector: 'detail-form[item][writableShiftModelsForMember]',
        templateUrl: './detail-form.component.html',
        styleUrls: ['./detail-form.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ActivatedRoute !== "undefined" && ActivatedRoute) === "function" ? _a : Object, typeof (_b = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _b : Object, PRouterService,
        ModalService, typeof (_c = typeof RightsService !== "undefined" && RightsService) === "function" ? _c : Object, PShiftService,
        FormattedDateTimePipe,
        LocalizePipe, typeof (_d = typeof BookingsService !== "undefined" && BookingsService) === "function" ? _d : Object, LogService,
        PShiftmodelTariffService, typeof (_e = typeof PBookingFormService !== "undefined" && PBookingFormService) === "function" ? _e : Object])
], DetailFormComponent);
export { DetailFormComponent };
//# sourceMappingURL=detail-form.component.js.map