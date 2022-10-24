import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { PThemeEnum } from '../../../bootstrap-styles.enum';
let FeePeriodTimeTextComponent = class FeePeriodTimeTextComponent {
    constructor() {
        this.start = null;
        this.end = null;
        this.PThemeEnum = PThemeEnum;
    }
    /**
     * Some identifier for the text that should be shown.
     * The decision which text should be shown is quite complex. So we need this method.
     * But we don’t want to translate in ts. We want the i18n feature of angular templates. Thus we needed a Id.
     */
    get textId() {
        if (this.start === 0 && this.end === null)
            return 'zeroToNull';
        if ((this.start === null || this.start >= 1) && this.end === null)
            return 'XToNull';
        if (this.start === null && this.end !== null)
            return 'nullToY';
        if (this.start !== null && this.end !== null)
            return 'XToY';
        // throw new Error('could not calculate text id');
        return null;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], FeePeriodTimeTextComponent.prototype, "start", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], FeePeriodTimeTextComponent.prototype, "end", void 0);
FeePeriodTimeTextComponent = __decorate([
    Component({
        selector: 'p-fee-period-time-text',
        templateUrl: './fee-period-time-text.component.html',
        styleUrls: ['./fee-period-time-text.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], FeePeriodTimeTextComponent);
export { FeePeriodTimeTextComponent };
//# sourceMappingURL=fee-period-time-text.component.js.map