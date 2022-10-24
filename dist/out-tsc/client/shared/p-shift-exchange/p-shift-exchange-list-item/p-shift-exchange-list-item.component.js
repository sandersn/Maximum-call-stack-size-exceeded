var _a, _b, _c, _d, _e, _f;
import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { SchedulingApiAbsenceType, SchedulingApiShiftExchange } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { BootstrapRounded, PBtnThemeEnum } from '../../bootstrap-styles.enum';
import { DropdownTypeEnum } from '../../p-forms/p-dropdown/p-dropdown.component';
import { PMomentService } from '../../p-moment.service';
let PShiftExchangeListItemComponent = class PShiftExchangeListItemComponent {
    constructor(api, console, pMoment, rightsService) {
        this.api = api;
        this.console = console;
        this.pMoment = pMoment;
        this.rightsService = rightsService;
        this._alwaysTrue = true;
        this._indisposedMember = null;
        this._newAssignedMember = null;
        this.detailed = true;
        /** If this a standalone item it has no list-headline with labels, so it probably needs some more info in itself. */
        this.isStandaloneItem = false;
        this.calendarBtnClick = new EventEmitter();
        this.CONFIG = Config;
        this.hover = false;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.DropdownTypeEnum = DropdownTypeEnum;
        this.PBtnThemeEnum = PBtnThemeEnum;
        this.BootstrapRounded = BootstrapRounded;
        this.SchedulingApiAbsenceType = SchedulingApiAbsenceType;
    }
    _mouseover(_event) {
        this.hover = true;
    }
    _mouseleave(_event) {
        this.hover = false;
    }
    ngAfterContentChecked() {
        this.now = +this.pMoment.m();
    }
    /**
     * Should the button be visible, that triggers onCalendarClick() ?
     */
    get showInCalendarBtnExists() {
        if (this.calendarBtnClick.observers.length === 0)
            return false;
        return true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    isSelectedShiftRef(shiftRef = null) {
        if (!shiftRef)
            throw new Error('shiftRef not defined');
        const shift = this.api.data.shifts.get(shiftRef.id);
        if (!shift)
            return false;
        if (!shift.selected)
            return false;
        return true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get indisposedMember() {
        if (this._indisposedMember)
            return this._indisposedMember;
        if (!this.shiftExchange.indisposedMember) {
            this.console.error('Could not get indisposedMember');
            return undefined;
        }
        return this.shiftExchange.indisposedMember;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get memberAddressedTo() {
        if (!this.api.isLoaded()) {
            if (Config.DEBUG)
                this.console.error('Can not get memberAddressedTo when api is not loaded');
            return null;
        }
        return this.api.data.members.get(this.shiftExchange.memberIdAddressedTo);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get shiftDate() {
        return this.shiftExchange.shifts.get(0).id.start;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get shiftTitle() {
        if (!this.shiftExchange.shiftModel)
            return undefined;
        return this.shiftExchange.shiftModel.name;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get shiftStart() {
        if (!this.shiftExchange.shifts.length)
            return undefined;
        return this.shiftExchange.shifts.get(0).start;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get shiftEnd() {
        if (!this.shiftExchange.shifts.length)
            return undefined;
        return this.shiftExchange.shifts.get(0).end;
    }
    /**
     * Highlight the related shift in the calendar. This action is made for the Scheduling site.
     */
    onCalendarClick(shiftRef) {
        this.calendarBtnClick.emit(shiftRef);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get shiftName() {
        var _a, _b;
        return (_b = (_a = this.shiftExchange.shifts.get(0)) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '█████';
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get deadlineIsInThePast() {
        assumeDefinedToGetStrictNullChecksRunning(this.shiftExchange.deadline, 'shiftExchange.deadline');
        return this.shiftExchange.deadline < this.now;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showDeadline() {
        if (this.shiftExchange.isClosed)
            return false;
        if (this.shiftExchange.deadline)
            return true;
        return false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get shiftRefsForCalendarButtons() {
        const shiftRefs = [];
        for (const shiftRef of this.shiftExchange.shiftRefs.iterable()) {
            shiftRefs.push(shiftRef);
        }
        // for (const swappedShiftRef of this.shiftExchange.swappedShiftRefs.iterable()) {
        // 	// TODO: A swapped shiftRef has no .start ...so pShiftExchangeService.onCalendarBtnClick would throw an error if
        // 	// we would provide a swappedShiftRef
        // 	shiftRefs.push(swappedShiftRef.id);
        // }
        return shiftRefs;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    isMe(member) {
        return !!this.rightsService.isMe(member.id);
    }
};
__decorate([
    HostBinding('class.flex-grow-1'),
    HostBinding('class.flex-row'),
    HostBinding('class.d-flex'),
    HostBinding('class.card-options'),
    HostBinding('class.align-items-stretch'),
    HostBinding('class.w-100'),
    __metadata("design:type", Object)
], PShiftExchangeListItemComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_c = typeof SchedulingApiShiftExchange !== "undefined" && SchedulingApiShiftExchange) === "function" ? _c : Object)
], PShiftExchangeListItemComponent.prototype, "shiftExchange", void 0);
__decorate([
    Input('indisposedMember'),
    __metadata("design:type", Object)
], PShiftExchangeListItemComponent.prototype, "_indisposedMember", void 0);
__decorate([
    Input('newAssignedMember'),
    __metadata("design:type", Object)
], PShiftExchangeListItemComponent.prototype, "_newAssignedMember", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PShiftExchangeListItemComponent.prototype, "detailed", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PShiftExchangeListItemComponent.prototype, "isStandaloneItem", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_f = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _f : Object)
], PShiftExchangeListItemComponent.prototype, "calendarBtnClick", void 0);
__decorate([
    HostListener('mouseover', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], PShiftExchangeListItemComponent.prototype, "_mouseover", null);
__decorate([
    HostListener('mouseleave', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], PShiftExchangeListItemComponent.prototype, "_mouseleave", null);
PShiftExchangeListItemComponent = __decorate([
    Component({
        selector: 'p-shift-exchange-list-item[shiftExchange]',
        templateUrl: './p-shift-exchange-list-item.component.html',
        styleUrls: ['./p-shift-exchange-list-item.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, LogService,
        PMomentService, typeof (_b = typeof RightsService !== "undefined" && RightsService) === "function" ? _b : Object])
], PShiftExchangeListItemComponent);
export { PShiftExchangeListItemComponent };
//# sourceMappingURL=p-shift-exchange-list-item.component.js.map