var _a, _b;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingApiService } from '@plano/shared/api';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '../../../../../../shared/core/plano-fa-icon-pool.enum';
let DeselectBtnComponent = class DeselectBtnComponent {
    constructor(api, localize) {
        this.api = api;
        this.localize = localize;
        this.PlanoFaIconPool = PlanoFaIconPool;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showContent() {
        if (!this.api.isLoaded())
            return false;
        return this.api.hasSelectedItems;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get borderPrimary() {
        if (!this.api.isLoaded())
            return null;
        return this.api.data.shifts.hasSelectedItem;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    onClick() {
        if (!this.api.isLoaded())
            return;
        this.api.deselectAllSelections();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get btnText() {
        if (!this.api.isLoaded())
            return '';
        if (!this.api.data.shifts.hasSelectedItem)
            return this.localize.transform('Alles deselektieren');
        const AMOUNT = this.api.data.shifts.selectedItems.length;
        if (this.api.data.shifts.selectedItems.length === 1)
            return this.localize.transform('Schicht deselektieren');
        return this.localize.transform('${amount} Schichten deselektieren', {
            amount: AMOUNT.toString(),
        });
    }
};
DeselectBtnComponent = __decorate([
    Component({
        selector: 'p-deselect-btn',
        templateUrl: './deselect-btn.component.html',
        styleUrls: ['./deselect-btn.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        // animations: [
        // 	trigger('popOpen', [
        // 		state('true', style({
        // 		})),
        // 		state('false', style({
        // 			display: 'none',
        // 			height: '0',
        // 		})),
        // 		transition('true => false', animate('100ms ease-in')),
        // 		transition('false => true', animate('300ms ease-out')),
        // 	]),
        // 	trigger('scale', [
        // 		state('false', style({
        // 			transform: 'scale(0)',
        // 		})),
        // 		state('true', style({
        // 		})),
        //
        // 		transition('false => true', [
        // 			animate(150),
        // 		]),
        // 		transition('true => false', [
        // 			animate(150),
        // 		]),
        // 	]),
        // ],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, typeof (_b = typeof LocalizePipe !== "undefined" && LocalizePipe) === "function" ? _b : Object])
], DeselectBtnComponent);
export { DeselectBtnComponent };
//# sourceMappingURL=deselect-btn.component.js.map