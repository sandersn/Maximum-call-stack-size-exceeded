import { __decorate, __metadata } from "tslib";
import { Component, Input, HostBinding, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingApiShiftPacketShift } from '@plano/shared/api';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
let PacketShiftsComponent = class PacketShiftsComponent {
    constructor(localize, datePipe) {
        this.localize = localize;
        this.datePipe = datePipe;
        this.currentShiftId = null;
        this.packetShifts = null;
        this.collapsed = true;
        this.clickable = true;
        this.linesArray = [];
    }
    _toggleCollapse(event) {
        if (!this.isClickable)
            return;
        event.preventDefault();
        event.stopPropagation();
        this.collapsed = !this.collapsed;
        this.initValues();
    }
    get isClickable() {
        if (!this.clickable)
            return null;
        return this.isHugePackage;
    }
    get isHugePackage() {
        return this.packetShifts.length > 5;
    }
    get currentShift() {
        return this.packetShifts.get(this.currentShiftId);
    }
    /**
     * Set values that are necessary for this function.
     * These initValues methods are used in many components.
     * They mostly get used for class attributes that would cause performance issues as a getter.
     */
    initValues() {
        if (!this.packetShifts)
            return;
        this.linesArray = this.getLinesArray();
    }
    getFirstLine(sortedPacketShifts) {
        return sortedPacketShifts.get(0);
    }
    getLinesInTheMiddle(sortedPacketShifts) {
        // Its a one-liner
        if (this.getFirstLine(sortedPacketShifts) === this.currentShift)
            return null;
        const secondShift = sortedPacketShifts.get(1);
        // It will be a two-liner
        assumeDefinedToGetStrictNullChecksRunning(secondShift, 'secondShift');
        if (sortedPacketShifts.length === 2 || secondShift === this.currentShift)
            return [secondShift];
        // It has some lines in the middle
        const result = [];
        assumeDefinedToGetStrictNullChecksRunning(this.currentShift, 'currentShift');
        const indexOfCurrentShift = sortedPacketShifts.indexOf(this.currentShift);
        const COUNTER = indexOfCurrentShift === 0 ? sortedPacketShifts.length - 1 : indexOfCurrentShift - 1;
        result.push(COUNTER === 1 ? secondShift : `... ${COUNTER} ${this.localize.transform('Schichten')}`);
        const LAST_ONE_IS_CURRENT = sortedPacketShifts.get(sortedPacketShifts.length - 1) === this.currentShift;
        if (!LAST_ONE_IS_CURRENT)
            result.push(this.currentShift);
        return result;
    }
    getLine3ToLast(sortedPacketShifts) {
        const lastShift = sortedPacketShifts.get(sortedPacketShifts.length - 1);
        assumeDefinedToGetStrictNullChecksRunning(lastShift, 'lastShift');
        if (lastShift === this.currentShift)
            return [lastShift];
        const secondLastShift = sortedPacketShifts.get(sortedPacketShifts.length - 2);
        if (secondLastShift === this.currentShift)
            return [lastShift];
        const result = [];
        assumeDefinedToGetStrictNullChecksRunning(this.currentShift, 'currentShift');
        const indexOfCurrentShift = sortedPacketShifts.indexOf(this.currentShift);
        const COUNTER = sortedPacketShifts.length - 1 - (indexOfCurrentShift + 1);
        const text = COUNTER === 1 ? secondLastShift : `... ${COUNTER} ${this.localize.transform('Schichten')}`;
        assumeDefinedToGetStrictNullChecksRunning(text, 'text');
        result.push(text, lastShift);
        return result;
    }
    getLinesArray() {
        const sortedPacketShifts = this.packetShifts.sortedBy('start', false);
        if (!this.isHugePackage || !this.collapsed)
            return sortedPacketShifts.iterable();
        const result = [];
        // Add line 1
        const firstLine = this.getFirstLine(sortedPacketShifts);
        assumeDefinedToGetStrictNullChecksRunning(firstLine, 'firstLine');
        result.push(firstLine);
        if (sortedPacketShifts.length === 1)
            return result;
        // Add line 2
        const LINES_IN_THE_MIDDLE = this.getLinesInTheMiddle(sortedPacketShifts);
        if (LINES_IN_THE_MIDDLE) {
            for (const LINE of LINES_IN_THE_MIDDLE) {
                result.push(LINE);
            }
        }
        if (sortedPacketShifts.length === 2)
            return result;
        // Add other lines
        const OTHER_LINES = this.getLine3ToLast(sortedPacketShifts);
        // eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
        if (!OTHER_LINES) {
            assumeDefinedToGetStrictNullChecksRunning(OTHER_LINES, 'OTHER_LINES', 'getLine3ToLast() return type is wrong');
            return result;
        }
        for (const LINE of OTHER_LINES) {
            result.push(LINE);
        }
        return result;
    }
    ngOnChanges() {
        this.initValues();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    isString(line) {
        if (line instanceof SchedulingApiShiftPacketShift)
            return false;
        return true;
    }
    /**
     * Check if given shift is current shift if currentShiftId is set.
     */
    isCurrentShift(packetShift) {
        if (typeof packetShift === 'string')
            throw new Error('lineItem must be a SchedulingApiShiftPacketShift here');
        if (this.isString(packetShift))
            return false;
        return this.currentShiftId.equals(packetShift.id);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    getDateInfo(packetShift) {
        if (typeof packetShift === 'string')
            throw new Error('input must be a SchedulingApiShiftPacketShift here');
        return `${this.datePipe.transform(packetShift.start, 'EE')} ${this.datePipe.transform(packetShift.start, 'shortDate')}`;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PacketShiftsComponent.prototype, "currentShiftId", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PacketShiftsComponent.prototype, "packetShifts", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PacketShiftsComponent.prototype, "collapsed", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PacketShiftsComponent.prototype, "clickable", void 0);
__decorate([
    HostListener('mouseup', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], PacketShiftsComponent.prototype, "_toggleCollapse", null);
__decorate([
    HostBinding('class.clickable'),
    HostBinding('class.btn-light'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], PacketShiftsComponent.prototype, "isClickable", null);
PacketShiftsComponent = __decorate([
    Component({
        selector: 'p-packet-shifts',
        templateUrl: './packet-shifts.component.html',
        styleUrls: ['./packet-shifts.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [LocalizePipe,
        PDatePipe])
], PacketShiftsComponent);
export { PacketShiftsComponent };
//# sourceMappingURL=packet-shifts.component.js.map