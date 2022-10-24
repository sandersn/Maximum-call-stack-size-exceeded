import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { FormattedDateTimePipe } from '../../formatted-date-time.pipe';
let PBasicInfoComponent = class PBasicInfoComponent {
    constructor(datePipe, formattedDateTimePipe) {
        this.datePipe = datePipe;
        this.formattedDateTimePipe = formattedDateTimePipe;
        this._alwaysTrue = true;
        this.name = null;
        this.start = null;
        this.end = null;
        this.showDate = true;
        this.showTime = true;
        this.showEndTime = true;
        /**
         * Should the date and time be shown in a 'danger' style
         */
        this.dateTimeHasDanger = false;
        this.oneLine = false;
        this.isRemoved = false;
    }
    get _hasAlignItemsCenter() {
        return this.oneLine;
    }
    /**
     * The time. No matter if a shiftId or shiftsRefs or whatever is provided.
     */
    get time() {
        if (!this.start)
            return '█:█ - █:█';
        let result = this.datePipe.transform(this.start, 'veryShortTime');
        const HAS_END_TIME = this.end && this.showEndTime;
        if (HAS_END_TIME)
            result += ` – ${this.datePipe.transform(this.end, 'veryShortTime')}`;
        return result;
    }
    /**
     * The date. No matter if a shiftId or shiftsRefs or whatever is provided.
     */
    get date() {
        if (!this.start)
            return '██████ ████████';
        if (this.end)
            return this.formattedDateTimePipe.getFormattedDateInfo(this.start, this.end, true).full;
        return this.datePipe.transform(this.start, 'shortDate');
    }
};
__decorate([
    HostBinding('class.title'),
    __metadata("design:type", Object)
], PBasicInfoComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PBasicInfoComponent.prototype, "name", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PBasicInfoComponent.prototype, "start", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PBasicInfoComponent.prototype, "end", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PBasicInfoComponent.prototype, "showDate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PBasicInfoComponent.prototype, "showTime", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PBasicInfoComponent.prototype, "showEndTime", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PBasicInfoComponent.prototype, "dateTimeHasDanger", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PBasicInfoComponent.prototype, "oneLine", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PBasicInfoComponent.prototype, "isRemoved", void 0);
__decorate([
    HostBinding('class.d-flex'),
    HostBinding('class.justify-content-between'),
    HostBinding('class.align-items-center'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PBasicInfoComponent.prototype, "_hasAlignItemsCenter", null);
PBasicInfoComponent = __decorate([
    Component({
        selector: 'p-basic-info',
        templateUrl: './basic-info.component.html',
        styleUrls: ['./basic-info.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [PDatePipe,
        FormattedDateTimePipe])
], PBasicInfoComponent);
export { PBasicInfoComponent };
//# sourceMappingURL=basic-info.component.js.map