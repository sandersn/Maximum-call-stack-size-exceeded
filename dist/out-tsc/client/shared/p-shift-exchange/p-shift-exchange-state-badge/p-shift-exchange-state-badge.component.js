var _a, _b;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { SchedulingApiShiftExchange } from '@plano/shared/api';
import { PShiftExchangeConceptService } from '../p-shift-exchange-concept.service';
let PShiftExchangeStateBadgeComponent = class PShiftExchangeStateBadgeComponent {
    constructor(pShiftExchangeConceptService) {
        this.pShiftExchangeConceptService = pShiftExchangeConceptService;
        this.communication = null;
        this._text = null;
        this._theme = null;
    }
    get text() {
        if (this._text)
            return this._text;
        if (this.communication) {
            return this.pShiftExchangeConceptService.getActionStateText(this.shiftExchange, this.communication, this.communication.lastAction);
        }
        return this.pShiftExchangeConceptService.getStateText(this.shiftExchange);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get theme() {
        if (this._theme)
            return this._theme;
        if (this.communication) {
            this.pShiftExchangeConceptService.getCommunicationStateStyle(this.communication.communicationState, this.communication.lastAction);
        }
        return this.pShiftExchangeConceptService.getStateStyle(this.shiftExchange);
    }
};
__decorate([
    Input(),
    __metadata("design:type", typeof (_a = typeof SchedulingApiShiftExchange !== "undefined" && SchedulingApiShiftExchange) === "function" ? _a : Object)
], PShiftExchangeStateBadgeComponent.prototype, "shiftExchange", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftExchangeStateBadgeComponent.prototype, "communication", void 0);
__decorate([
    Input('text'),
    __metadata("design:type", Object)
], PShiftExchangeStateBadgeComponent.prototype, "_text", void 0);
__decorate([
    Input('theme'),
    __metadata("design:type", Object)
], PShiftExchangeStateBadgeComponent.prototype, "_theme", void 0);
__decorate([
    HostBinding('title')
    // eslint-disable-next-line jsdoc/require-jsdoc
    ,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], PShiftExchangeStateBadgeComponent.prototype, "text", null);
PShiftExchangeStateBadgeComponent = __decorate([
    Component({
        selector: 'p-shift-exchange-state-badge[shiftExchange]',
        templateUrl: './p-shift-exchange-state-badge.component.html',
        styleUrls: ['./p-shift-exchange-state-badge.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [PShiftExchangeConceptService])
], PShiftExchangeStateBadgeComponent);
export { PShiftExchangeStateBadgeComponent };
//# sourceMappingURL=p-shift-exchange-state-badge.component.js.map