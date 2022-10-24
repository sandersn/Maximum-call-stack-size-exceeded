var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Component, Input, Output, EventEmitter, ViewChild, HostBinding, TemplateRef } from '@angular/core';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PThemeEnum } from '../../bootstrap-styles.enum';
let PDeleteButtonComponent = class PDeleteButtonComponent {
    constructor(modalService, console, localize) {
        this.modalService = modalService;
        this.console = console;
        this.localize = localize;
        /**
         * Overwrite classes outside.
         */
        this.class = null;
        this.onModalSuccess = new EventEmitter();
        this.onModalDismiss = new EventEmitter();
        this.label = null;
        this._modalText = null;
        this.disabled = false;
        this.modalTheme = PThemeEnum.DANGER;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get modalText() {
        if (this._modalText)
            return this._modalText;
        if (this.label)
            return this.label;
        return this.localize.transform('Löschen');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    onRemoveClick(event) {
        var _a;
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
    HostBinding(),
    __metadata("design:type", Object)
], PDeleteButtonComponent.prototype, "class", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_a = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _a : Object)
], PDeleteButtonComponent.prototype, "onModalSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_b = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _b : Object)
], PDeleteButtonComponent.prototype, "onModalDismiss", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDeleteButtonComponent.prototype, "label", void 0);
__decorate([
    Input('modalText'),
    __metadata("design:type", Object)
], PDeleteButtonComponent.prototype, "_modalText", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PDeleteButtonComponent.prototype, "disabled", void 0);
__decorate([
    ViewChild('warningModalContentTemplate', { static: true }),
    __metadata("design:type", typeof (_c = typeof TemplateRef !== "undefined" && TemplateRef) === "function" ? _c : Object)
], PDeleteButtonComponent.prototype, "warningModalContentTemplate", void 0);
PDeleteButtonComponent = __decorate([
    Component({
        selector: 'p-delete-button',
        templateUrl: './p-delete-button.component.html',
        styleUrls: ['./p-delete-button.component.scss'],
    }),
    __metadata("design:paramtypes", [ModalService,
        LogService,
        LocalizePipe])
], PDeleteButtonComponent);
export { PDeleteButtonComponent };
//# sourceMappingURL=p-delete-button.component.js.map