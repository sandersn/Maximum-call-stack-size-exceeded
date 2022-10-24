var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, ChangeDetectionStrategy, HostBinding, ViewContainerRef, ViewChild } from '@angular/core';
import { LocalizePipe } from '../../pipe/localize.pipe';
let PModalDefaultTemplateComponent = class PModalDefaultTemplateComponent {
    constructor(activeModal, localize) {
        this.activeModal = activeModal;
        this.localize = localize;
        this._alwaysTrue = true;
        this.modalContentOptions = {};
        this.theme = null;
        /** @deprecated HACK: quick fix for modals that have no footer, since i implemented support for .footerViewContainerRef in modal-default-template */
        this.showCustomFooter = null;
    }
    /**
     * Initializes the Modal with the necessary properties from its parent component.
     */
    initModal(options, theme) {
        if (!!options.description === !!options.contentTemplateRef)
            throw new Error('Please set either description or contentTemplateRef');
        this.modalContentOptions = options;
        if (this.modalContentOptions.hideDismissBtn === undefined)
            this.modalContentOptions.hideDismissBtn = true;
        if (!this.modalContentOptions.dismissBtnLabel)
            this.modalContentOptions.dismissBtnLabel = this.localize.transform('Nein');
        if (theme)
            this.theme = theme;
        if (this.modalContentOptions.closeBtnLabel === null)
            this.modalContentOptions.closeBtnLabel = this.localize.transform('Ok');
        if (!!options.contentTemplateRef) {
            this.embeddedContentView = options.contentTemplateRef.createEmbeddedView(!!options.contentTemplateContext ? options.contentTemplateContext : {});
            this.contentViewContainerRef.insert(this.embeddedContentView);
        }
        if (!!options.footerTemplateRef) {
            this.embeddedFooterView = options.footerTemplateRef.createEmbeddedView(!!options.footerTemplateContext ? options.footerTemplateContext : {});
            this.footerViewContainerRef.insert(this.embeddedFooterView);
        }
        this.showCustomFooter = !!options.footerTemplateRef;
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
    /** Is close button disabled? */
    get closeBtnDisabled() {
        var _a, _b;
        return !!((_b = (_a = this.modalContentOptions).closeBtnDisabled) === null || _b === void 0 ? void 0 : _b.call(_a));
    }
};
__decorate([
    HostBinding('class.flex-grow-1'),
    __metadata("design:type", Object)
], PModalDefaultTemplateComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    ViewChild('content', { read: ViewContainerRef, static: true }),
    __metadata("design:type", typeof (_b = typeof ViewContainerRef !== "undefined" && ViewContainerRef) === "function" ? _b : Object)
], PModalDefaultTemplateComponent.prototype, "contentViewContainerRef", void 0);
__decorate([
    ViewChild('footer', { read: ViewContainerRef, static: true }),
    __metadata("design:type", typeof (_c = typeof ViewContainerRef !== "undefined" && ViewContainerRef) === "function" ? _c : Object)
], PModalDefaultTemplateComponent.prototype, "footerViewContainerRef", void 0);
PModalDefaultTemplateComponent = __decorate([
    Component({
        selector: 'p-modal-default-template',
        templateUrl: './modal-default-template.component.html',
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof NgbActiveModal !== "undefined" && NgbActiveModal) === "function" ? _a : Object, LocalizePipe])
], PModalDefaultTemplateComponent);
export { PModalDefaultTemplateComponent };
//# sourceMappingURL=modal-default-template.component.js.map