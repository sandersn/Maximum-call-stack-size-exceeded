var _a;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiPossibleTaxes } from '@plano/shared/api';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PFormControl } from '../../p-form-control';
let PTaxDropdownComponent = class PTaxDropdownComponent {
    constructor(api) {
        this.api = api;
        this._disabled = false;
        this.PlanoFaIconPool = PlanoFaIconPool;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get possibleTaxes() {
        if (!this.api.isLoaded())
            return new SchedulingApiPossibleTaxes(null, false);
        return this.api.data.possibleTaxes;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get disabled() {
        if (this.isLoading)
            return true;
        if (this._disabled)
            return true;
        return false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isLoading() {
        return !this.api.isLoaded();
    }
};
__decorate([
    Input(),
    __metadata("design:type", PFormControl)
], PTaxDropdownComponent.prototype, "control", void 0);
__decorate([
    Input('disabled'),
    __metadata("design:type", Boolean)
], PTaxDropdownComponent.prototype, "_disabled", void 0);
PTaxDropdownComponent = __decorate([
    Component({
        selector: 'p-tax-dropdown[control]',
        templateUrl: './p-tax-dropdown.component.html',
        styleUrls: ['./p-tax-dropdown.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object])
], PTaxDropdownComponent);
export { PTaxDropdownComponent };
//# sourceMappingURL=p-tax-dropdown.component.js.map