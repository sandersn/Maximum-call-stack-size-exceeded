var _a, _b;
import { __decorate, __metadata } from "tslib";
import { ViewChild, Output, EventEmitter, Input, Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { BootstrapSize, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { Config } from '../../config';
import { assumeNonNull } from '../../null-type-utils';
import { LocalizePipe } from '../../pipe/localize.pipe';
/**
 * @example
 * 	<p-modal-content
 * 		(onDismiss)="dismiss('no')"
 * 		(onClose)="success('yep')"
 * 	>
 * 		<p-modal-content-body>
 * 			Hallo Welt
 * 		</p-modal-content-body>
 *  </p-modal-content>
 */
let PModalContentComponent = class PModalContentComponent {
    constructor(localize) {
        this.localize = localize;
        this.modalBodyHeight = null;
        this._alwaysTrue = true;
        this.theme = null;
        this.modalTitle = null;
        /**
         * Written to the dismiss button.
         * Default: No
         */
        this.dismissBtnLabel = null;
        /**
         * Written to the close button. »Close« means 'successful' here.
         * Default: Yes
         */
        this.closeBtnLabel = null;
        this.closeBtnDisabled = false;
        this.hideDismissBtn = false;
        /**
         * Happens when the user closes the modal with some kind of success/ok button
         */
        this.onClose = new EventEmitter();
        /**
         * Happens when the user closes the modal with some kind of cancel button.
         * E.g. a × icon in the top right corner.
         * This also triggers if the user clicks outside the modal (if outside-click is not disabled by any config)
         */
        this.onDismiss = new EventEmitter();
        // HACK: quick fix for modals that have no footer, since i implemented support for .footerViewContainerRef in modal-default-template
        this._showCustomFooter = null;
        this.BootstrapSize = BootstrapSize;
        this.Config = Config;
        this.PThemeEnum = PThemeEnum;
    }
    ngAfterContentChecked() {
        this.initValues();
    }
    /**	closeBtnLabel can be a fn which returns a string */
    get closeBtnLabelAsString() {
        if (typeof this.closeBtnLabel === 'string')
            return this.closeBtnLabel;
        assumeNonNull(this.closeBtnLabel);
        return this.closeBtnLabel();
    }
    /**
     * Set some default values for properties that are not defined yet
     */
    initValues() {
        if (this.modalTitle === undefined)
            this.modalTitle = this.localize.transform('Sicher?');
        if (this.dismissBtnLabel === null)
            this.dismissBtnLabel = this.localize.transform('Nein');
        if (this.closeBtnLabel === null)
            this.closeBtnLabel = this.localize.transform('Ja');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showCustomFooter() {
        if (this._showCustomFooter !== null)
            return this._showCustomFooter;
        return this.footer.nativeElement && this.footer.nativeElement.children.length > 0;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get textWhite() {
        return !!this.theme && this.theme !== PThemeEnum.WARNING && this.theme !== PThemeEnum.LIGHT;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PModalContentComponent.prototype, "modalBodyHeight", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PModalContentComponent.prototype, "size", void 0);
__decorate([
    HostBinding('class.h-100'),
    __metadata("design:type", Object)
], PModalContentComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PModalContentComponent.prototype, "theme", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PModalContentComponent.prototype, "modalTitle", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PModalContentComponent.prototype, "dismissBtnLabel", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PModalContentComponent.prototype, "closeBtnLabel", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PModalContentComponent.prototype, "closeBtnTheme", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PModalContentComponent.prototype, "closeBtnDisabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PModalContentComponent.prototype, "hideDismissBtn", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_a = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _a : Object)
], PModalContentComponent.prototype, "onClose", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_b = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _b : Object)
], PModalContentComponent.prototype, "onDismiss", void 0);
__decorate([
    ViewChild('footer', { static: true }),
    __metadata("design:type", Object)
], PModalContentComponent.prototype, "footer", void 0);
__decorate([
    Input('showCustomFooter'),
    __metadata("design:type", Object)
], PModalContentComponent.prototype, "_showCustomFooter", void 0);
PModalContentComponent = __decorate([
    Component({
        selector: 'p-modal-content',
        templateUrl: './p-modal-content.component.html',
        styleUrls: ['./p-modal-content.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [LocalizePipe])
], PModalContentComponent);
export { PModalContentComponent };
let PModalContentBodyComponent = class PModalContentBodyComponent {
    constructor() {
        this._alwaysTrue = true;
        // @Inject(PModalContentComponent) parent : PModalContentComponent;
    }
};
__decorate([
    HostBinding('class.d-block'),
    __metadata("design:type", Object)
], PModalContentBodyComponent.prototype, "_alwaysTrue", void 0);
PModalContentBodyComponent = __decorate([
    Component({
        selector: 'p-modal-content-body',
        template: '<ng-content></ng-content>',
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], PModalContentBodyComponent);
export { PModalContentBodyComponent };
let PModalContentFooterComponent = class PModalContentFooterComponent {
    constructor() {
        this._alwaysTrue = true;
        this.classJustifyContentBetween = true;
        this.classAlignItemsCenter = true;
    }
};
__decorate([
    HostBinding('class.modal-footer'),
    HostBinding('class.d-flex'),
    __metadata("design:type", Object)
], PModalContentFooterComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    HostBinding('class.justify-content-between'),
    __metadata("design:type", Object)
], PModalContentFooterComponent.prototype, "classJustifyContentBetween", void 0);
__decorate([
    HostBinding('class.align-items-center'),
    __metadata("design:type", Object)
], PModalContentFooterComponent.prototype, "classAlignItemsCenter", void 0);
PModalContentFooterComponent = __decorate([
    Component({
        selector: 'p-modal-content-footer',
        template: '<ng-content></ng-content>',
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], PModalContentFooterComponent);
export { PModalContentFooterComponent };
//# sourceMappingURL=p-modal-content.component.js.map