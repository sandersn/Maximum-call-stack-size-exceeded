var _a, _b;
import { __decorate, __metadata } from "tslib";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlatformLocation } from '@angular/common';
import { Injectable } from '@angular/core';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { CurrentModalsService } from './current-modals.service';
import { PModalDefaultTemplateComponent } from './modal-default-template/modal-default-template.component';
import { ModalServiceOptions } from './modal.service.options';
import { assumeNonNull } from '../null-type-utils';
import { LocalizePipe } from '../pipe/localize.pipe';
let ModalService = class ModalService {
    constructor(modal, currentModals, location, localize) {
        this.modal = modal;
        this.currentModals = currentModals;
        this.location = location;
        this.localize = localize;
        this.modalRef = null;
        this.modalServiceOptions = new ModalServiceOptions();
        this.location.onPopState((event) => {
            // ensure that modal is opened
            if (this.modalRef === null)
                return;
            event.preventDefault();
            this.modalRef.dismiss();
        });
    }
    modalServiceOptionsToNgbModalOptions(input) {
        var _a;
        const centered = input.centered !== undefined ? input.centered : (input.size === 'sm');
        const scrollable = input.scrollable !== undefined ? input.scrollable : true;
        const animation = input.animation !== undefined ? input.animation : input.size !== 'fullscreen';
        const theme = input.theme;
        // const theme = input.theme !== undefined ? input.theme : PThemeEnum.LIGHT;
        if (theme !== undefined) {
            input.windowClass += ` modal-${theme}`;
        }
        let backdropClass = '';
        backdropClass += ((_a = input.backdropClass) !== null && _a !== void 0 ? _a : '');
        backdropClass += (input.backdrop === 'static' ? ' not-clickable bg-white' : '');
        return {
            size: input.size,
            windowClass: input.windowClass,
            backdrop: input.backdrop,
            backdropClass: backdropClass,
            keyboard: input.keyboard,
            centered: centered,
            scrollable: scrollable,
            animation: animation,
        };
    }
    /**
     * Open a new Modal with the provided content and options
     */
    openModal(
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    modalContent, inputOptions = null) {
        if (inputOptions === null)
            inputOptions = this.modalServiceOptions;
        if (!inputOptions.success)
            inputOptions.success = () => { };
        if (!inputOptions.dismiss)
            inputOptions.dismiss = () => { };
        const ngbModalServiceOptions = this.modalServiceOptionsToNgbModalOptions(inputOptions);
        this.currentModals.addModal();
        this.modalRef = this.modal.open(modalContent, ngbModalServiceOptions);
        this.modalRef.result.then((result) => {
            var _a;
            assumeNonNull(inputOptions);
            this.currentModals.removeModal();
            (_a = inputOptions.success) === null || _a === void 0 ? void 0 : _a.call(inputOptions, result);
        }, (error) => {
            var _a;
            assumeNonNull(inputOptions);
            this.currentModals.removeModal();
            (_a = inputOptions.dismiss) === null || _a === void 0 ? void 0 : _a.call(inputOptions, error);
        }).finally(inputOptions.finally);
        // HACK: This is a hack for the modal-over-modal scroll issue.
        // More Info: https://github.com/ng-bootstrap/ng-bootstrap/issues/643
        this.modalRef.result.then(() => {
            if (document.querySelector('body > .modal.open')) {
                document.body.classList.add('modal-open');
            }
        }).catch(() => {
            if (document.querySelector('body.modal-open')) {
                document.body.classList.remove('modal-open');
            }
        });
        return this.modalRef;
    }
    /**
     * Opens a confirm modal without the need to provide a template for the inner content
     * If you don’t provide a dismiss handler, the Dismiss-Button in the footer will be hidden.
     */
    confirm(content, options = {}) {
        var _a, _b;
        if (content.closeBtnLabel === null)
            content.closeBtnLabel = this.localize.transform('Ja');
        if (content.dismissBtnLabel === undefined)
            content.dismissBtnLabel = this.localize.transform('Nein');
        const pConfirmModalComponent = this.openModal(PConfirmModalComponent, {
            size: (_a = options.size) !== null && _a !== void 0 ? _a : 'sm',
            theme: (_b = options.theme) !== null && _b !== void 0 ? _b : null,
            centered: true,
            success: (result) => {
                if (options.success)
                    options.success(result);
            },
            dismiss: (result) => {
                if (options.dismiss)
                    options.dismiss(result);
            },
        }).componentInstance;
        pConfirmModalComponent.initModal(content, options.theme);
    }
    /**
     * Opens a themed modal without the need to provide a template for the inner content
     * This has no callbacks. It is made for situations where we e.g. just want to block a functionality.
     */
    openDefaultModal(modalContentOptions, options = null) {
        if (options === null)
            options = {};
        if (!options.size)
            options.size = 'lg';
        const modalRef = this.openModal(PModalDefaultTemplateComponent, {
            ...options,
            success: (result) => {
                var _a, _b, _c;
                assumeNonNull(options);
                (_a = options.success) === null || _a === void 0 ? void 0 : _a.call(options, result);
                (_b = defaultModalComponent.embeddedContentView) === null || _b === void 0 ? void 0 : _b.destroy();
                (_c = defaultModalComponent.embeddedFooterView) === null || _c === void 0 ? void 0 : _c.destroy();
            },
            dismiss: (result) => {
                var _a, _b, _c;
                assumeNonNull(options);
                // It is important to destroy before you run options.dismiss.
                // Imagine: Dismiss could remove things from api which embeddedContentView relies on.
                (_a = defaultModalComponent.embeddedContentView) === null || _a === void 0 ? void 0 : _a.destroy();
                (_b = defaultModalComponent.embeddedFooterView) === null || _b === void 0 ? void 0 : _b.destroy();
                (_c = options.dismiss) === null || _c === void 0 ? void 0 : _c.call(options, result);
            },
        });
        const defaultModalComponent = modalRef.componentInstance;
        defaultModalComponent.initModal(modalContentOptions, options.theme);
        return modalRef;
    }
    /**
     * Shorthand to open a modal for Attribute Info’s `cannotEditHint`
     */
    openCannotEditHintModal(cannotEditHint) {
        this.openDefaultModal({
            modalTitle: null,
            description: this.localize.transform(cannotEditHint),
            closeBtnLabel: this.localize.transform('Nagut 🙄'),
        }, {
            // theme: BootstrapStyleEnum.,
            size: 'sm',
            centered: true,
        });
    }
    /**
     * Opens a warning modal without the need to provide a template for the inner content
     * It is made for situations where we e.g. just want to block a functionality.
     */
    warn(modalContentOptions, success) {
        if (!modalContentOptions.modalTitle)
            modalContentOptions.modalTitle = this.localize.transform('Achtung');
        const options = {
            theme: PThemeEnum.WARNING,
            centered: true,
        };
        if (success)
            options.success = success;
        this.openDefaultModal(modalContentOptions, options);
    }
    /**
     * Opens a info modal without the need to provide a template for the inner content
     * It is made for situations where we e.g. just want to block a functionality.
     */
    info(modalContentOptions, success) {
        if (!modalContentOptions.modalTitle)
            modalContentOptions.modalTitle = this.localize.transform('Hinweis');
        const options = {
            theme: PThemeEnum.INFO,
            centered: true,
        };
        if (success)
            options.success = success;
        this.openDefaultModal(modalContentOptions, options);
    }
    /**
     * Opens a error modal without the need to provide a template for the inner content
     * This has no callbacks. It is made for situations where we e.g. just want to block a functionality.
     */
    error(modalContentOptions) {
        if (!modalContentOptions.modalTitle)
            modalContentOptions.modalTitle = this.localize.transform('Fehler!');
        this.openDefaultModal(modalContentOptions, {
            theme: PThemeEnum.DANGER,
            centered: true,
        });
    }
    /**
     * This is a shorthand for bringing a templateRef of a modal-content into a structure that fits
     * into the saveChangesHook attribute of an pEditable
     */
    getEditableHook(modalContent, options = {}) {
        if (!options.success) {
            options.success = () => { };
        }
        if (!options.dismiss) {
            options.dismiss = () => { };
        }
        return (
        // This will be filled from inside the pEditable
        success = () => { }, 
        // This will be filled from inside the pEditable
        dismiss = () => { }) => {
            var _a, _b;
            this.openModal(modalContent, {
                success: (result) => {
                    var _a;
                    (_a = options.success) === null || _a === void 0 ? void 0 : _a.call(options, result);
                    success();
                },
                dismiss: (reason) => {
                    var _a;
                    (_a = options.dismiss) === null || _a === void 0 ? void 0 : _a.call(options, reason);
                    dismiss();
                },
                size: (_a = options.size) !== null && _a !== void 0 ? _a : null,
                theme: (_b = options.theme) !== null && _b !== void 0 ? _b : null,
            });
        };
    }
};
ModalService = __decorate([
    Injectable({ providedIn: 'root' }),
    __metadata("design:paramtypes", [typeof (_a = typeof NgbModal !== "undefined" && NgbModal) === "function" ? _a : Object, CurrentModalsService, typeof (_b = typeof PlatformLocation !== "undefined" && PlatformLocation) === "function" ? _b : Object, LocalizePipe])
], ModalService);
export { ModalService };
//# sourceMappingURL=modal.service.js.map