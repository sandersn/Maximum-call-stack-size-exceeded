var _a;
import { __decorate, __metadata } from "tslib";
import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingApiShiftExchangeShiftRefs, SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefs } from '@plano/shared/api';
import { SchedulingApiService, SchedulingApiShiftModels } from '@plano/shared/api';
import { SchedulingApiShiftExchangeSwappedShiftRefs, SchedulingApiShiftPacketShifts, SchedulingApiShiftExchangeShiftRef, SchedulingApiShiftPacketShift } from '@plano/shared/api';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../shared/core/null-type-utils';
import { PMomentService } from '../../p-moment.service';
let PShiftInfoContentLeftComponent = class PShiftInfoContentLeftComponent {
};
PShiftInfoContentLeftComponent = __decorate([
    Component({
        selector: 'p-shift-info-content-left',
        template: '<ng-content></ng-content>',
        styleUrls: ['./p-shifts-info-content.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], PShiftInfoContentLeftComponent);
export { PShiftInfoContentLeftComponent };
let PShiftInfoContentRightComponent = class PShiftInfoContentRightComponent {
};
PShiftInfoContentRightComponent = __decorate([
    Component({
        selector: 'p-shift-info-content-right',
        template: '<ng-content></ng-content>',
        styleUrls: ['./p-shifts-info-content.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], PShiftInfoContentRightComponent);
export { PShiftInfoContentRightComponent };
let PShiftInfoContentInsideBasicInfoComponent = class PShiftInfoContentInsideBasicInfoComponent {
};
PShiftInfoContentInsideBasicInfoComponent = __decorate([
    Component({
        selector: 'p-shift-info-content-inside-basic-info',
        template: '<ng-content></ng-content>',
        styleUrls: ['./p-shifts-info-content.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], PShiftInfoContentInsideBasicInfoComponent);
export { PShiftInfoContentInsideBasicInfoComponent };
let PShiftsInfoComponent = class PShiftsInfoComponent {
    constructor(api, localize, datePipe, pMoment) {
        this.api = api;
        this.localize = localize;
        this.datePipe = datePipe;
        this.pMoment = pMoment;
        this._alwaysTrue = true;
        this.showDate = true;
        this.showEndTime = true;
        this.showTime = true;
        this.oneLine = false;
        /**
         * The refs for shifts that should be visualized
         * NOTE: You can use shiftRefs or shiftId - it will always look awesome ツ
         */
        this.shiftRefs = null;
        /**
         * The Shift-Id that should be visualized
         * NOTE: You can use shiftRefs or shiftId - it will always look awesome ツ
         */
        this.shiftId = null;
    }
    get shiftRefsSortedByStart() {
        if (!this.shiftRefs)
            return this.shiftRefs;
        if (this.shiftRefs instanceof SchedulingApiShiftExchangeShiftRefs ||
            this.shiftRefs instanceof SchedulingApiShiftPacketShifts ||
            this.shiftRefs instanceof SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefs ||
            this.shiftRefs instanceof SchedulingApiShiftExchangeSwappedShiftRefs) {
            return this.shiftRefs.sortedBy((item) => {
                if (item instanceof SchedulingApiShiftExchangeShiftRef)
                    return item.start;
                const shift = this.api.data.shifts.get(item.id);
                return shift ? shift.start : undefined;
            }, false);
        }
        // return this.shiftRefs.sortedBy((item) => {
        // 	const shift = this.api.data.shifts.get(item.id);
        // 	return shift ? shift.start : undefined;
        // }, false);
        throw new Error('unknown type of shiftRefs');
    }
    ngAfterContentChecked() {
        this.now = +this.pMoment.m();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showContent() {
        if (this.shiftRefs !== null)
            return true;
        if (this.shiftId !== null)
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftModel() {
        if (!this.api.isLoaded())
            return null;
        let shiftModelId = null;
        if (!!this.shiftId)
            shiftModelId = this.shiftId.shiftModelId;
        if (this.shiftRefs && this.shiftRefs.length === 1)
            shiftModelId = this.firstShiftId.shiftModelId;
        if (!shiftModelId)
            return null;
        return this.api.data.shiftModels.get(shiftModelId);
    }
    /**
     * List of all ShiftModels that are related to the shiftRefs
     */
    get shiftModels() {
        if (!this.shiftRefs)
            return undefined;
        if (!this.shiftRefs.length)
            return undefined;
        if (!this.api.isLoaded())
            return undefined;
        const shiftModels = new SchedulingApiShiftModels(null, false);
        for (const shiftRef of this.shiftRefs.iterable()) {
            const shiftModel = this.api.data.shiftModels.get(shiftRef.id.shiftModelId);
            assumeNonNull(shiftModel);
            shiftModels.push(shiftModel);
        }
        return shiftModels;
    }
    /**
     * List of all ShiftModels that are related to the shiftRefs
     */
    get uniqueShiftModelsCount() {
        let result = 0;
        const shiftModelIds = [];
        const shiftModelIdsContains = (id) => {
            for (const shiftModelId of shiftModelIds) {
                if (!shiftModelId.equals(id))
                    continue;
                return true;
            }
            return false;
        };
        assumeNonNull(this.shiftRefs);
        for (const shiftRef of this.shiftRefs.iterable()) {
            if (shiftModelIdsContains(shiftRef.id.shiftModelId))
                continue;
            ++result;
            shiftModelIds.push(shiftRef.id.shiftModelId);
        }
        return result;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftTitle() {
        if (this.shiftModel)
            return this.shiftModel.name;
        if (!this.shiftModels)
            return null;
        let result = '';
        assumeNonNull(this.shiftRefs);
        if (this.shiftRefs.length === 1) {
            result += this.localize.transform('Eine Schicht');
        }
        else {
            result += this.localize.transform('${counter} Schichten', {
                counter: this.shiftRefs.length.toString(),
            });
        }
        if (this.uniqueShiftModelsCount === 1) {
            // Some members get shift-exchanges with shifts of shiftModels with no read access
            if (!this.shiftModels.get(0))
                return result;
            result += ' ';
            result += this.localize.transform('aus ${shiftModelName}', {
                shiftModelName: this.shiftModels.get(0).name,
            });
        }
        else {
            result += ' ';
            result += this.localize.transform('aus ${counter} Tätigkeiten', {
                counter: this.uniqueShiftModelsCount.toString(),
            });
        }
        return result;
    }
    /**
     * Find a item which has .start and .end properties no matter if shiftId or what type of shiftRefs is provided.
     */
    getItemWthStartAndEnd(indexOfWantedItemInList, success) {
        if (!!this.shiftId)
            return this.firstShift ? success(this.firstShift) : undefined;
        if (!this.shiftRefs)
            return undefined;
        if (!this.shiftRefs.length)
            return undefined;
        assumeNonNull(this.shiftRefsSortedByStart);
        const shiftRef = this.shiftRefsSortedByStart.get(indexOfWantedItemInList);
        if (shiftRef instanceof SchedulingApiShiftPacketShift ||
            // FIXME: PLANO-16351 - replace '!!shiftRef.start && !!shiftRef.end' with '!shiftRef.isNewItem()'
            shiftRef instanceof SchedulingApiShiftExchangeShiftRef && !!shiftRef.start && !!shiftRef.end) {
            return success(shiftRef);
        }
        // Get the related shift to get the correct start and end. The shift.start and shift.end includes the correct time.
        // Other timestamps from .start and .end properties only includes the date, not the exact time.
        assumeNonNull(shiftRef);
        const shift = this.api.data.shifts.get(shiftRef.id);
        if (!shift)
            return success(shiftRef.id);
        return success(shift);
    }
    get firstShiftId() {
        if (!!this.shiftId)
            return this.shiftId;
        assumeNonNull(this.shiftRefs);
        const ref = this.shiftRefs.get(0);
        assumeNonNull(ref);
        return ref.id;
    }
    get firstShift() {
        if (!this.api.isLoaded())
            return null;
        return this.api.data.shifts.get(this.firstShiftId);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get dateTimeHasDanger() {
        if (this.lastShiftEnd === null)
            return true;
        return this.now >= this.lastShiftEnd;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get firstShiftStart() {
        var _a;
        return (_a = this.getItemWthStartAndEnd(0, item => {
            assumeDefinedToGetStrictNullChecksRunning(item.start, 'item.start');
            return item.start;
        })) !== null && _a !== void 0 ? _a : null;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get lastShiftEnd() {
        var _a;
        const index = this.shiftRefs ? this.shiftRefs.length - 1 : 0;
        return (_a = this.getItemWthStartAndEnd(index, item => {
            assumeDefinedToGetStrictNullChecksRunning(item.end, 'item.end');
            return item.end;
        })) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * The time. No matter if a shiftId or shiftsRefs or whatever is provided.
     */
    get allAtTheSameTime() {
        if (!!this.shiftId)
            return true;
        if (this.shiftRefs) {
            const firstShiftStart = this.datePipe.transform(this.firstShiftStart, 'shortTime');
            const lastShiftEnd = this.datePipe.transform(this.lastShiftEnd, 'shortTime');
            for (let i = 0; i < this.shiftRefs.length; i++) {
                const startTimestamp = this.getItemWthStartAndEnd(i, item => {
                    assumeDefinedToGetStrictNullChecksRunning(item.start, 'item.start');
                    return item.start;
                });
                const itemStart = this.datePipe.transform(startTimestamp, 'shortTime');
                if (itemStart !== firstShiftStart)
                    return false;
                const endTimestamp = this.getItemWthStartAndEnd(i, item => {
                    assumeDefinedToGetStrictNullChecksRunning(item.end, 'item.end');
                    return item.end;
                });
                const itemEnd = this.datePipe.transform(endTimestamp, 'shortTime');
                if (itemEnd !== lastShiftEnd)
                    return false;
            }
            return true;
        }
        return undefined;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get allShiftsRemoved() {
        if (!this.shiftRefs || this.shiftRefs.length === 0)
            return false;
        for (const shiftRef of this.shiftRefs.iterable()) {
            const shift = this.api.data.shifts.get(shiftRef.id);
            if (!shift)
                return false;
            if (!shift.isRemoved)
                return false;
        }
        return true;
    }
};
__decorate([
    HostBinding('class.d-flex'),
    HostBinding('class.flex-row'),
    HostBinding('class.position-relative'),
    __metadata("design:type", Object)
], PShiftsInfoComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftsInfoComponent.prototype, "showDate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftsInfoComponent.prototype, "showEndTime", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftsInfoComponent.prototype, "showTime", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftsInfoComponent.prototype, "oneLine", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftsInfoComponent.prototype, "shiftRefs", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftsInfoComponent.prototype, "shiftId", void 0);
PShiftsInfoComponent = __decorate([
    Component({
        selector: 'p-shifts-info',
        templateUrl: './p-shifts-info.component.html',
        styleUrls: ['./p-shifts-info.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, LocalizePipe,
        PDatePipe,
        PMomentService])
], PShiftsInfoComponent);
export { PShiftsInfoComponent };
//# sourceMappingURL=p-shifts-info.component.js.map