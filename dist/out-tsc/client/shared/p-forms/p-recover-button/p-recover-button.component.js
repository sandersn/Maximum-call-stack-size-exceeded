var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Component, Input, Output, EventEmitter, ViewChild, HostBinding, TemplateRef } from '@angular/core';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
let PRecoverButtonComponent = class PRecoverButtonComponent {
    constructor(modalService, localize) {
        this.modalService = modalService;
        this.localize = localize;
        this.valid = true;
        /**
         * Overwrite classes outside.
         */
        this.class = null;
        this.onOpenModal = new EventEmitter();
        this.onModalSuccess = new EventEmitter();
        this.onModalDismiss = new EventEmitter();
        this.label = null;
        this._modalText = null;
        this.disabled = false;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.modalTheme = null;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get modalText() {
        if (this._modalText)
            return this._modalText;
        if (this.label)
            return this.label;
        return this.localize.transform('Wiederherstellen');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    onRemoveClick(event) {
        var _a;
        this.onOpenModal.emit(event);
        this.modalService.openModal(this.warningModalContentTemplate, {
            theme: (_a = this.modalTheme) !== null && _a !== void 0 ? _a : null,
            centered: true,
            success: () => {
                this.onModalSuccess.emit(event);
            },
            dismiss: () => {
                this.onModalDismiss.emit(event);
            },
        });
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get translatedDeleteWarningModalCloseBtnLabel() {
        if (!this.label)
            return this.localize.transform('Ja');
        return this.localize.transform('Ja, ${label}', { label: this.label });
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PRecoverButtonComponent.prototype, "valid", void 0);
__decorate([
    Input(),
    HostBinding(),
    __metadata("design:type", Object)
], PRecoverButtonComponent.prototype, "class", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_a = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _a : Object)
], PRecoverButtonComponent.prototype, "onOpenModal", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_b = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _b : Object)
], PRecoverButtonComponent.prototype, "onModalSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], PRecoverButtonComponent.prototype, "onModalDismiss", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PRecoverButtonComponent.prototype, "label", void 0);
__decorate([
    Input('modalText'),
    __metadata("design:type", Object)
], PRecoverButtonComponent.prototype, "_modalText", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PRecoverButtonComponent.prototype, "disabled", void 0);
__decorate([
    ViewChild('warningModalContentTemplate', { static: true }),
    __metadata("design:type", typeof (_d = typeof TemplateRef !== "undefined" && TemplateRef) === "function" ? _d : Object)
], PRecoverButtonComponent.prototype, "warningModalContentTemplate", void 0);
PRecoverButtonComponent = __decorate([
    Component({
        selector: 'p-recover-button',
        templateUrl: './p-recover-button.component.html',
        styleUrls: ['./p-recover-button.component.scss'],
    }),
    __metadata("design:paramtypes", [ModalService,
        LocalizePipe])
], PRecoverButtonComponent);
export { PRecoverButtonComponent };
//# sourceMappingURL=p-recover-button.component.js.map