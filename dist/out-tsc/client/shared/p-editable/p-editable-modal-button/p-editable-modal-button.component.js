var _a, _b, _c, _d, _e, _f, _g;
import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, HostListener, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { EditableDirective } from '@plano/client/shared/p-editable/editable/editable.directive';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { ModalServiceOptions } from '@plano/shared/core/p-modal/modal.service.options';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { SchedulingApiService } from '../../../../shared/api';
import { assumeNonNull } from '../../../../shared/core/null-type-utils';
import { LocalizePipe } from '../../../../shared/core/pipe/localize.pipe';
import { PThemeEnum } from '../../bootstrap-styles.enum';
import { SectionWhitespace } from '../../page/section/section.component';
let PEditableModalButtonComponent = class PEditableModalButtonComponent {
    constructor(changeDetectorRef, modalService, console, pEditableRef, localizePipe) {
        this.changeDetectorRef = changeDetectorRef;
        this.modalService = modalService;
        this.console = console;
        this.pEditableRef = pEditableRef;
        this.localizePipe = localizePipe;
        /**
         * Theme defines the background color/style of the Modal
         */
        this.theme = null;
        /**
         * @see ModalContentOptions['closeBtnLabel']
         */
        this.closeBtnLabel = null;
        this.closeBtnTheme = PThemeEnum.PRIMARY;
        this.closeBtnDisabled = false;
        /**
         * Should the icon be visible?
         */
        this._showBtnIcon = null;
        /**
         * If set to true, the modal will close when the pEditable is done with the api-call.
         */
        this.waitForEditableCompleteBeforeClose = false;
        /**
         * Component disabled?
         */
        this.disabled = false;
        /**
         * Triggers when modal gets opened
         */
        this.onModalOpen = new EventEmitter();
        /**
         * Triggers when modal gets closed
         */
        this.onModalClosed = new EventEmitter();
        /**
         * Triggers when modal gets closed
         */
        this.onModalDismissed = new EventEmitter();
        /**
         * Triggers before modal gets closed
         */
        this.beforeModalClose = null;
        /**
         * How much whitespace should there be inside the modal?
         */
        this.modalWhitespace = SectionWhitespace.MEDIUM;
        // These are necessary Inputs and Outputs for pEditable form-element
        this.pEditable = false;
        this.api = null;
        this.valid = null;
        this.onSaveStart = new EventEmitter();
        this.onSaveSuccess = new EventEmitter();
        this.onDismiss = new EventEmitter();
        this.onLeaveCurrent = new EventEmitter();
        this.editMode = new EventEmitter(undefined);
        this._label = null;
        this.btnLabel = null;
        this._showBtnLabel = true;
        this.saveBtnHasBeenClicked = false;
        /**
         * Is the modal open?
         */
        this.modalIsOpen = false;
        /**
         * Gets used by e.g. PEditableModalBoxComponent
         */
        this.modalRef = null;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.SectionWhitespace = SectionWhitespace;
        this.PThemeEnum = PThemeEnum;
        this._alwaysTrue = true;
        /**
         * This is an alternative way to define a template instead of using <p-editable-modal-button-form>
         * Use it if you dont want the template content to be available in the Angular view structure while modal is NOT open.
         */
        this.contentTemplateRef = null;
        this.contentTemplateOptions = {};
    }
    /** @see PEditableModalButtonComponent['_icon'] */
    get icon() {
        if (!!this._icon)
            return this._icon;
        return PlanoFaIconPool.EDIT;
    }
    /** @see PEditableModalButtonComponent['_showBtnIcon'] */
    get showBtnIcon() {
        if (this._showBtnIcon !== null)
            return this._showBtnIcon;
        return !!this.icon;
    }
    /**
     * Label gets used as button-text.
     * If no label is set, the content of p-editable-modal-button-header gets used.
     */
    get label() {
        var _a;
        return (_a = this._label) !== null && _a !== void 0 ? _a : this.localizePipe.transform('Bearbeiten');
    }
    set label(input) {
        this._label = input;
        this.changeDetectorRef.markForCheck();
    }
    /**
     * Should any label be visible?
     * If false, the trigger-button will only have an icon.
     */
    get showBtnLabel() {
        return this._showBtnLabel;
    }
    set showBtnLabel(input) {
        this._showBtnLabel = input;
        this.changeDetectorRef.detectChanges();
    }
    get pEditableIsActive() {
        if (!this.pEditable)
            return false;
        return true;
    }
    get _pEditableHasHook() {
        return this.pEditableIsActive && !!this.saveChangesHook;
    }
    get _isDisabled() {
        return this.disabled || this.modalIsOpen;
    }
    _openEditableModal(event) {
        const success = () => {
            if (this.pEditableIsActive && !this.pEditableRef.startEditable(event))
                return;
            const modalServiceOptions = this.getModalServiceOptions();
            this.onModalOpen.emit();
            if (!!this.contentTemplateRef) {
                this.modalRef = this.modalService.openDefaultModal({
                    contentTemplateRef: this.contentTemplateRef,
                    contentTemplateContext: this.contentTemplateOptions,
                    dismissBtnLabel: this.localizePipe.transform('Verwerfen'),
                    closeBtnLabel: this.closeBtnLabel,
                    modalTitle: this.label,
                    footerTemplateRef: this.footerTemplateRef,
                    footerTemplateContext: {
                        dismiss: () => {
                            this.modalRef.dismiss();
                        },
                        close: () => {
                            this.modalRef.close();
                        },
                    },
                }, modalServiceOptions);
            }
            else {
                this.modalRef = this.modalService.openModal(this.formInModal, modalServiceOptions);
            }
        };
        if (!this.beforeEditHook) {
            success();
            return;
        }
        this.beforeEditHook(() => {
            success();
        }, () => {
            this.console.log('editable dismissed');
        });
    }
    ngAfterViewInit() {
        this.changeDetectorRef.detectChanges();
    }
    ngAfterContentInit() {
        this.initValues();
    }
    /**
     * Set values that are necessary for this function.
     * These initValues methods are used in many components.
     * They mostly get used for class attributes that would cause performance issues as a getter.
     */
    initValues() {
        if (!this.closeBtnLabel)
            this.closeBtnLabel = this.localizePipe.transform('Speichern');
    }
    /**	closeBtnLabel can be a fn which returns a string */
    get closeBtnLabelAsString() {
        if (typeof this.closeBtnLabel === 'string')
            return this.closeBtnLabel;
        assumeNonNull(this.closeBtnLabel);
        return this.closeBtnLabel();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onClose() {
        this.saveChanges(() => {
            this.modalRef.close();
        });
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    saveChanges(closeCallback) {
        if (this.saveBtnHasBeenClicked)
            return;
        this.saveBtnHasBeenClicked = true;
        window.setTimeout(() => {
            // eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
            if (this)
                this.saveBtnHasBeenClicked = false;
        }, 200);
        if (!this.pEditableIsActive) {
            if (this.beforeModalClose) {
                this.beforeModalClose(() => {
                    if (closeCallback)
                        closeCallback('close');
                });
                return;
            }
            if (closeCallback)
                closeCallback('close');
            return;
        }
        // Editable is active
        // TODO: Check if waitForEditableCompleteBeforeClose can be removed. Backend should be fast anyway.
        if (this.waitForEditableCompleteBeforeClose) {
            this.pEditableRef.onSuccess(() => {
                if (closeCallback)
                    closeCallback('close');
            });
        }
        else {
            this.pEditableRef.onSuccess();
            if (closeCallback)
                closeCallback('close');
        }
    }
    /**
     * This happens on dismiss-button and ×-button click
     */
    dismissChanges(dismissCallback) {
        if (!this.pEditableIsActive) {
            if (dismissCallback)
                dismissCallback('close');
            return;
        }
        // no copy available to dismiss?
        if (!this.api.hasDataCopy())
            // TODO: Find a way to add information about the source of this throw to the throw text.
            throw new Error('No data copy available. [PLANO-21475]');
        if (dismissCallback)
            dismissCallback('close');
        this.pEditableRef.onUndo();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    updateEditMode(event) {
        this.modalIsOpen = event;
        this.editMode.emit(event);
    }
    getModalServiceOptions() {
        const options = new ModalServiceOptions();
        // modalServiceOptions.keyboard = false;
        if (this.modalSize !== undefined)
            options.size = this.modalSize;
        if (this.scrollable !== undefined)
            options.scrollable = this.scrollable;
        if (this.centered !== undefined)
            options.centered = this.centered;
        if (this.backdrop !== undefined)
            options.backdrop = this.backdrop;
        if (!options.size)
            options.size = 'lg';
        if (!options.windowClass && this.theme)
            options.theme = this.theme;
        // open modal
        options.success = () => {
            if (!!this.contentTemplateRef)
                this.onClose();
            this.onModalClosed.emit();
        };
        options.dismiss = () => {
            this.onModalDismissed.emit();
            // NOTE:	If you want to change the next line, please check if these tickets are still fixed:
            // 				- PLANO-98740
            // 				- PLANO-92505
            if (!this.contentTemplateRef)
                this.pEditableRef.onUndo();
        };
        options.finally = () => {
            // BUG: 	We tried to fix PLANO-92566 with a HACK:
            //
            // 					if (!this.api?.hasDataCopy()) return;
            // 					this.dismissChanges();
            //
            // 				But they caused other issues:
            // 					NOTE: PLANO-92505 was not reproducible anymore.
        };
        return options;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showSuccessButtonLoadingAnimation() {
        if (this.api.isBackendOperationRunning)
            return true;
        if (this.api instanceof SchedulingApiService && this.api.isUpdatingWarnings)
            return true;
        if (this.saveBtnHasBeenClicked)
            return true;
        return false;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "backdrop", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "theme", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "modalSize", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "centered", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "scrollable", void 0);
__decorate([
    Input('icon'),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "_icon", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "closeBtnLabel", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "closeBtnTheme", void 0);
__decorate([
    Input(),
    __metadata("design:type", void 0)
], PEditableModalButtonComponent.prototype, "closeBtnDisabled", void 0);
__decorate([
    Input('showBtnIcon'),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "_showBtnIcon", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "saveButtonPopover", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PEditableModalButtonComponent.prototype, "waitForEditableCompleteBeforeClose", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PEditableModalButtonComponent.prototype, "disabled", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_b = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _b : Object)
], PEditableModalButtonComponent.prototype, "onModalOpen", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], PEditableModalButtonComponent.prototype, "onModalClosed", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_d = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _d : Object)
], PEditableModalButtonComponent.prototype, "onModalDismissed", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "beforeModalClose", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], PEditableModalButtonComponent.prototype, "modalWhitespace", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "pEditable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "api", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "valid", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "saveChangesHook", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "onSaveStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "onSaveSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "onDismiss", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "onLeaveCurrent", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "editMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "beforeEditHook", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "btnLabel", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], PEditableModalButtonComponent.prototype, "label", null);
__decorate([
    Input(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], PEditableModalButtonComponent.prototype, "showBtnLabel", null);
__decorate([
    HostBinding('class.btn'),
    HostBinding('class.d-flex'),
    HostBinding('class.align-items-center'),
    HostBinding('class.justify-content-center'),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    HostBinding('class.p-editable-active'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PEditableModalButtonComponent.prototype, "pEditableIsActive", null);
__decorate([
    HostBinding('class.p-editable-has-hook'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PEditableModalButtonComponent.prototype, "_pEditableHasHook", null);
__decorate([
    ViewChild('formInModal', { static: true }),
    __metadata("design:type", typeof (_e = typeof TemplateRef !== "undefined" && TemplateRef) === "function" ? _e : Object)
], PEditableModalButtonComponent.prototype, "formInModal", void 0);
__decorate([
    ViewChild('footerTemplateRef', { static: true }),
    __metadata("design:type", typeof (_f = typeof TemplateRef !== "undefined" && TemplateRef) === "function" ? _f : Object)
], PEditableModalButtonComponent.prototype, "footerTemplateRef", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "contentTemplateRef", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalButtonComponent.prototype, "contentTemplateOptions", void 0);
__decorate([
    HostBinding('disabled'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PEditableModalButtonComponent.prototype, "_isDisabled", null);
__decorate([
    HostListener('click', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], PEditableModalButtonComponent.prototype, "_openEditableModal", null);
PEditableModalButtonComponent = __decorate([
    Component({
        // eslint-disable-next-line @angular-eslint/component-selector
        selector: 'button[pEditableModalButton]',
        templateUrl: './p-editable-modal-button.component.html',
        styleUrls: ['./p-editable-modal-button.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object, ModalService,
        LogService,
        EditableDirective,
        LocalizePipe])
], PEditableModalButtonComponent);
export { PEditableModalButtonComponent };
let PEditableModalButtonHeaderComponent = class PEditableModalButtonHeaderComponent {
    constructor() {
        this._alwaysTrue = true;
    }
};
__decorate([
    HostBinding('class.w-100'),
    HostBinding('class.d-flex'),
    HostBinding('class.justify-content-between'),
    HostBinding('class.align-items-center'),
    __metadata("design:type", Object)
], PEditableModalButtonHeaderComponent.prototype, "_alwaysTrue", void 0);
PEditableModalButtonHeaderComponent = __decorate([
    Component({
        selector: 'p-editable-modal-button-header',
        template: '<ng-content></ng-content>',
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [])
], PEditableModalButtonHeaderComponent);
export { PEditableModalButtonHeaderComponent };
/**
 * @deprecated use [contentTemplateRef] instead
 */
let PEditableModalButtonFormComponent = class PEditableModalButtonFormComponent {
    constructor() {
        this._alwaysTrue = true;
    }
};
__decorate([
    HostBinding('class.d-flex'),
    HostBinding('class.flex-column'),
    HostBinding('class.w-100'),
    __metadata("design:type", Object)
], PEditableModalButtonFormComponent.prototype, "_alwaysTrue", void 0);
PEditableModalButtonFormComponent = __decorate([
    Component({
        selector: 'p-editable-modal-button-form',
        template: '<ng-content></ng-content>',
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], PEditableModalButtonFormComponent);
export { PEditableModalButtonFormComponent };
//# sourceMappingURL=p-editable-modal-button.component.js.map