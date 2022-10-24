var _a;
import { __decorate, __metadata } from "tslib";
import * as chroma from 'chroma-js';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingApiMember } from '@plano/shared/api';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
let EarningsBarComponent = class EarningsBarComponent {
    constructor() {
        this.expectedMemberEarnings = null;
        this.extract = null;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get minOverlayWidth() {
        if (this.member.attributeInfoMaxMonthlyEarnings.value === null)
            return null;
        if (this.member.attributeInfoMinMonthlyEarnings.value === null)
            return null;
        /* TODO: [PLANO-3464] */
        return (100 - this.maxOverlayWidth) / this.member.maxMonthlyEarnings * this.member.minMonthlyEarnings;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get maxOverlayWidth() {
        return 5;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get desiredMarkerOffset() {
        if (this.member.attributeInfoMaxMonthlyEarnings.value === null)
            return null;
        if (this.member.attributeInfoDesiredMonthlyEarnings.value === null)
            return null;
        /* TODO: [PLANO-3464] */
        return (100 - this.maxOverlayWidth) / this.member.maxMonthlyEarnings * this.member.desiredMonthlyEarnings;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get valueBarWidth() {
        /* TODO: [PLANO-3464] */
        if (this.expectedMemberEarnings && this.expectedMemberEarnings > this.member.maxMonthlyEarnings) {
            return 100;
        }
        else if (this.expectedMemberEarnings === 0) {
            return 0;
        }
        else if (this.member.attributeInfoMaxMonthlyEarnings.value !== null &&
            this.expectedMemberEarnings !== null) {
            return (100 - this.maxOverlayWidth) / this.member.maxMonthlyEarnings * this.expectedMemberEarnings;
        }
        return 0;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get valueBarColor() {
        assumeDefinedToGetStrictNullChecksRunning(this.minOverlayWidth, 'this.minOverlayWidth');
        if (this.valueBarWidth < this.minOverlayWidth)
            return '#ffc596';
        if (this.valueBarWidth > (100 - this.maxOverlayWidth))
            return '#d87777';
        // Value is between min and max.
        // Cut min and max and calculate new percentage.
        const newFullWidth = 100 - this.minOverlayWidth - this.maxOverlayWidth;
        const newValue = this.valueBarWidth - this.minOverlayWidth;
        const newPercentage = 100 / newFullWidth * newValue;
        // let newDesiredMarkerPosition = undefined;
        // if (
        // 	this.minOverlayWidth < this.desiredMarkerOffset &&
        // 	this.desiredMarkerOffset < (100 - this.maxOverlayWidth)
        // ) {
        // 	newDesiredMarkerPosition = 100 / newFullWidth * this.desiredMarkerOffset;
        // }
        // if (newDesiredMarkerPosition !== undefined) {
        // 	let floored = Math.floor(newDesiredMarkerPosition / 10);
        // } else {
        // }
        // Define color fading
        const scale = chroma.scale(['#ffc596', '#7aba98', '#7aba98', '#7aba98', '#ffc596']);
        // Get color from fading by percentage
        return scale(newPercentage / 100).hex();
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], EarningsBarComponent.prototype, "expectedMemberEarnings", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_a = typeof SchedulingApiMember !== "undefined" && SchedulingApiMember) === "function" ? _a : Object)
], EarningsBarComponent.prototype, "member", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], EarningsBarComponent.prototype, "extract", void 0);
EarningsBarComponent = __decorate([
    Component({
        selector: 'p-earnings-bar[member]',
        templateUrl: './earnings-bar.component.html',
        styleUrls: ['./earnings-bar.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [])
], EarningsBarComponent);
export { EarningsBarComponent };
//# sourceMappingURL=earnings-bar.component.js.map