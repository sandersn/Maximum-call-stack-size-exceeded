var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Config } from '@plano/shared/core/config';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { SectionWhitespace } from '../../page/section/section.component';
let PFormRecoverSectionComponent = class PFormRecoverSectionComponent {
    constructor(localize) {
        this.localize = localize;
        this.CONFIG = Config;
        this.onOpenModal = new EventEmitter();
        this.onRecover = new EventEmitter();
        this.onDismiss = new EventEmitter();
        this._label = null;
        this._btnLabel = null;
        this.disabled = false;
        this._modalText = null;
        this.valid = true;
        this.SectionWhitespace = SectionWhitespace;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get label() {
        if (this._label)
            return this._label;
        if (this._btnLabel)
            return this._btnLabel;
        return this.localize.transform('Wiederherstellen');
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
        return this.localize.transform('Wiederherstellen');
    }
};
__decorate([
    Output(),
    __metadata("design:type", typeof (_a = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _a : Object)
], PFormRecoverSectionComponent.prototype, "onOpenModal", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_b = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _b : Object)
], PFormRecoverSectionComponent.prototype, "onRecover", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], PFormRecoverSectionComponent.prototype, "onDismiss", void 0);
__decorate([
    Input('label'),
    __metadata("design:type", Object)
], PFormRecoverSectionComponent.prototype, "_label", void 0);
__decorate([
    Input('btnLabel'),
    __metadata("design:type", Object)
], PFormRecoverSectionComponent.prototype, "_btnLabel", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PFormRecoverSectionComponent.prototype, "disabled", void 0);
__decorate([
    Input('modalText'),
    __metadata("design:type", Object)
], PFormRecoverSectionComponent.prototype, "_modalText", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PFormRecoverSectionComponent.prototype, "valid", void 0);
PFormRecoverSectionComponent = __decorate([
    Component({
        selector: 'p-form-recover-section',
        templateUrl: './p-form-recover-section.component.html',
        styleUrls: ['./p-form-recover-section.component.scss'],
    }),
    __metadata("design:paramtypes", [LocalizePipe])
], PFormRecoverSectionComponent);
export { PFormRecoverSectionComponent };
//# sourceMappingURL=p-form-recover-section.component.js.map