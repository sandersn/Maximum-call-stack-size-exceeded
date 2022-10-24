var _a;
import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Config } from '@plano/shared/core/config';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { SectionWhitespace } from '../../page/section/section.component';
/**
 * @deprecated
 * Use a p-dropdown in the p-subheader instead.
 *
 * TODO: find another solution for p-form-delete-section for tariffs or paymentmethods
 */
let PFormDeleteSectionComponent = class PFormDeleteSectionComponent {
    constructor(localize) {
        this.localize = localize;
        this.CONFIG = Config;
        this.onRemove = new EventEmitter();
        this._label = null;
        this._btnLabel = null;
        this.disabled = false;
        this._modalText = null;
        this.SectionWhitespace = SectionWhitespace;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get label() {
        if (this._label)
            return this._label;
        if (this._btnLabel)
            return this._btnLabel;
        return this.localize.transform('Löschen');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get btnLabel() {
        if (this._btnLabel)
            return this._btnLabel;
        return this.label;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get modalText() {
        if (this._modalText)
            return this._modalText;
        if (this._label)
            return this._label;
        return this.localize.transform('Löschen');
    }
};
__decorate([
    Output(),
    __metadata("design:type", typeof (_a = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _a : Object)
], PFormDeleteSectionComponent.prototype, "onRemove", void 0);
__decorate([
    Input('label'),
    __metadata("design:type", Object)
], PFormDeleteSectionComponent.prototype, "_label", void 0);
__decorate([
    Input('btnLabel'),
    __metadata("design:type", Object)
], PFormDeleteSectionComponent.prototype, "_btnLabel", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PFormDeleteSectionComponent.prototype, "disabled", void 0);
__decorate([
    Input('modalText'),
    __metadata("design:type", Object)
], PFormDeleteSectionComponent.prototype, "_modalText", void 0);
PFormDeleteSectionComponent = __decorate([
    Component({
        selector: 'p-form-delete-section',
        templateUrl: './p-form-delete-section.component.html',
        styleUrls: ['./p-form-delete-section.component.scss'],
    }),
    __metadata("design:paramtypes", [LocalizePipe])
], PFormDeleteSectionComponent);
export { PFormDeleteSectionComponent };
//# sourceMappingURL=p-form-delete-section.component.js.map