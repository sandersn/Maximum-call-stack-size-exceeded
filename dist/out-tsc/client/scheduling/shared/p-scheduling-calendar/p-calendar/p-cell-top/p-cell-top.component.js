var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Component, Output, EventEmitter, Input, HostBinding, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { Assertions } from '@plano/shared/core/assertions';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { DateFormats, PDateFormat } from '@plano/shared/core/pipe/p-date.pipe';
import { assumeNonNull } from '../../../../../../shared/core/null-type-utils';
import { SchedulingApiShifts } from '../../../api/scheduling-api.service';
import { PCalendarService } from '../../p-calendar.service';
let PCellTopComponent = class PCellTopComponent {
    constructor(modalService, pCalendarService, pMoment) {
        this.modalService = modalService;
        this.pCalendarService = pCalendarService;
        this.pMoment = pMoment;
        this._alwaysTrue = true;
        this.clickCellTop = new EventEmitter();
        this.dateFormat = PDateFormat.MINIMAL_DATE;
        this.shiftsOfDay = null;
        this.neverShowDayTools = true;
        /**
         * If this is set to false the icon will only be visible on hover or if content exists
         */
        this.pinStickyNote = false;
        this.canEditMemos = false;
        this.hover = false;
        this.BootstrapSize = BootstrapSize;
        this.PThemeEnum = PThemeEnum;
        this.PBtnThemeEnum = PBtnThemeEnum;
    }
    /**
     * Check if given timestamp is today
     */
    get isToday() {
        return this.dayStart === this.todayDayStart;
    }
    _onClick() {
        this.clickCellTop.emit(this.dayStart);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get shiftsForCommentsModal() {
        if (!this.dayStart || !this.shiftsOfDay)
            return new SchedulingApiShifts(null, false);
        return this.shiftsOfDay.filterBy((item) => !!item.description);
    }
    ngOnInit() {
        this.todayDayStart = +this.pMoment.m().startOf('day');
        Assertions.ensureIsDayStart(this.dayStart);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    selectShifts(event) {
        event.stopPropagation();
        assumeNonNull(this.shiftsOfDay);
        this.shiftsOfDay.setSelected(!this.shiftsAreSelected);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get shiftsAreSelected() {
        if (!this.shiftsAreSelectable)
            return false;
        assumeNonNull(this.shiftsOfDay);
        return this.shiftsOfDay.length === this.shiftsOfDay.selectedItems.length;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get shiftsAreSelectable() {
        assumeNonNull(this.shiftsOfDay);
        return !!this.shiftsOfDay.length;
    }
    /**
     * Open form for changing the memo content
     */
    editComments(modalContent) {
        this.modalService.openModal(modalContent);
    }
    /**
     * Check if shiftsOfDay have any descriptions
     */
    get shiftsOfDayHaveDescriptions() {
        return !!this.pCalendarService.shiftsOfDayHaveDescriptions(this.dayStart, { onlyForUser: true });
    }
};
__decorate([
    HostBinding('class.cal-cell-top'),
    __metadata("design:type", Object)
], PCellTopComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    HostBinding('class.cal-today'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PCellTopComponent.prototype, "isToday", null);
__decorate([
    HostListener('click'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PCellTopComponent.prototype, "_onClick", null);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], PCellTopComponent.prototype, "clickCellTop", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], PCellTopComponent.prototype, "dayStart", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_d = typeof DateFormats !== "undefined" && DateFormats) === "function" ? _d : Object)
], PCellTopComponent.prototype, "dateFormat", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PCellTopComponent.prototype, "shiftsOfDay", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PCellTopComponent.prototype, "neverShowDayTools", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PCellTopComponent.prototype, "pinStickyNote", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PCellTopComponent.prototype, "canEditMemos", void 0);
PCellTopComponent = __decorate([
    Component({
        selector: 'p-cell-top[dayStart]',
        templateUrl: './p-cell-top.component.html',
        styleUrls: ['./p-cell-top.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ModalService !== "undefined" && ModalService) === "function" ? _a : Object, PCalendarService, typeof (_b = typeof PMomentService !== "undefined" && PMomentService) === "function" ? _b : Object])
], PCellTopComponent);
export { PCellTopComponent };
//# sourceMappingURL=p-cell-top.component.js.map