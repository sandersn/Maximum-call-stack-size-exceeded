var _a, _b;
import { __decorate, __metadata } from "tslib";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { ToastsService } from '@plano/client/service/toasts.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PApiPrimitiveTypes } from '../../../../shared/api/base/generated-types.ag';
import { BootstrapRounded, PThemeEnum } from '../../bootstrap-styles.enum';
let PInputCopyStringComponent = class PInputCopyStringComponent {
    constructor(toasts, zone, localize, activeModal) {
        this.toasts = toasts;
        this.zone = zone;
        this.localize = localize;
        this.activeModal = activeModal;
        this.valueToCopy = null;
        this.copiedToClipboard = null;
        this.timeout = null;
        this.isLoading = false;
        this.type = PApiPrimitiveTypes.string;
        this.BootstrapRounded = BootstrapRounded;
        this.PThemeEnum = PThemeEnum;
    }
    /**
     * Copy string to clipboard
     */
    copyString(input) {
        var _a;
        window.clearTimeout((_a = this.timeout) !== null && _a !== void 0 ? _a : undefined);
        // Create a dummy input to copy the string array inside it
        const dummy = document.createElement('input');
        // Output the array into it
        dummy.value = input;
        // Add it to the document
        document.body.appendChild(dummy);
        // Set its ID
        dummy.setAttribute('id', 'dummy_id');
        // Select it
        dummy.select();
        // Copy its contents
        document.execCommand('copy');
        // Remove it as its not needed anymore
        document.body.removeChild(dummy);
        this.toasts.addToast({
            content: this.localize.transform('Wurde in die Zwischenablage kopiert'),
            theme: PThemeEnum.SUCCESS,
            icon: 'clipboard',
            visibilityDuration: 'short',
        });
        this.copiedToClipboard = input;
        this.zone.runOutsideAngular(() => {
            this.timeout = window.setTimeout(() => {
                this.zone.run(() => {
                    if (this.copiedToClipboard) {
                        this.copiedToClipboard = null;
                    }
                    this.activeModal.close();
                });
            }, 1000);
        });
    }
    /**
     * Close modal
     */
    close() {
        this.activeModal.close();
    }
    /**
     * Dismiss modal
     */
    dismiss() {
        this.activeModal.dismiss();
    }
    /**
     * Get icon for the 'copy' button
     */
    get icon() {
        if (this.isLoading)
            return PlanoFaIconPool.SYNCING;
        return this.copiedToClipboard === this.valueToCopy ? 'check' : 'clipboard';
    }
    /**
     * Is the icon of the 'copy' button spinning?
     */
    get iconSpinning() {
        if (this.icon === PlanoFaIconPool.SYNCING)
            return true;
        return false;
    }
    /**
     * Select whole text if someone sets focus inside.
     * Be one step ahead the users thoughts ;)
     */
    onFocus(event) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (event.target.select)
            event.target.select();
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputCopyStringComponent.prototype, "valueToCopy", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputCopyStringComponent.prototype, "isLoading", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputCopyStringComponent.prototype, "type", void 0);
PInputCopyStringComponent = __decorate([
    Component({
        selector: 'p-input-copy-string',
        templateUrl: './p-input-copy-string.component.html',
        styleUrls: ['./p-input-copy-string.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [ToastsService, typeof (_a = typeof NgZone !== "undefined" && NgZone) === "function" ? _a : Object, LocalizePipe, typeof (_b = typeof NgbActiveModal !== "undefined" && NgbActiveModal) === "function" ? _b : Object])
], PInputCopyStringComponent);
export { PInputCopyStringComponent };
//# sourceMappingURL=p-input-copy-string.component.js.map