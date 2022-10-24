var _a;
import { __decorate, __metadata } from "tslib";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { LocalizePipe } from '../../pipe/localize.pipe';
let PConfirmModalComponent = class PConfirmModalComponent {
    constructor(activeModal, localize) {
        this.activeModal = activeModal;
        this.localize = localize;
        this.PThemeEnum = PThemeEnum;
        this.modalContentOptions = {};
        this.theme = null;
    }
    /**
     * Initializes the Modal with the necessary properties from its parent component.
     */
    initModal(content, theme) {
        this.modalContentOptions = content;
        if (theme)
            this.theme = theme;
        if (this.modalContentOptions.closeBtnLabel === undefined)
            this.modalContentOptions.closeBtnLabel = this.localize.transform('Ok');
        if (this.modalContentOptions.hideDismissBtn === undefined) {
            this.modalContentOptions.hideDismissBtn = this.modalContentOptions.dismissBtnLabel === undefined;
        }
    }
    /**
     * Close this modal
     */
    onClose() {
        this.activeModal.close();
    }
    /**
     * Dismiss this modal
     */
    onDismiss() {
        this.activeModal.dismiss();
    }
};
PConfirmModalComponent = __decorate([
    Component({
        selector: 'p-confirm-modal',
        templateUrl: './confirm-modal.component.html',
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof NgbActiveModal !== "undefined" && NgbActiveModal) === "function" ? _a : Object, LocalizePipe])
], PConfirmModalComponent);
export { PConfirmModalComponent };
//# sourceMappingURL=confirm-modal.component.js.map