var _a, _b, _c, _d, _e;
import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, TemplateRef, ElementRef } from '@angular/core';
import { Config } from '@plano/shared/core/config';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PEditableModalButtonComponent } from '../../p-editable/p-editable-modal-button/p-editable-modal-button.component';
import { SectionWhitespace } from '../../page/section/section.component';
/**
 * A component that shows a box with some content (can be defined in <p-editable-modal-box-showroom> inside).
 * And has an edit button, which opens a form (can be defined in <p-editable-modal-box-form> inside) to edit these contents.
 * The form will be shown in a modal.
 *
 * This concept makes it possible to capsule inputs that are related through validation. The whole changes of the can only
 * be dismissed or confirmed as once by the user.
 *
 * If this is an active 'editable', then it will save all data of the contained form when the contained form gets closed.
 *
 * If you want another Modal to open right before save, you can use editables [saveChangesHook].
 */
let PEditableModalBoxComponent = class PEditableModalBoxComponent {
    constructor(changeDetectorRef, modalService) {
        this.changeDetectorRef = changeDetectorRef;
        this.modalService = modalService;
        // HACK: Need this for p-input-member-id
        // TODO: Make this obsolete
        this.hideRemoveBtn = false;
        this._alwaysTrue = true;
        this.required = false;
        /**
         * Theme defines the background color/style of the Box and Modal
         */
        this.theme = null;
        /**
         * Defines the background color/style of the Modal
         */
        this.borderStyle = null;
        /**
         * Headline of box and modal
         */
        this.label = null;
        /**
         * Label gets used as edit button text.
         */
        this.btnLabel = null;
        /**
         * Label gets used as edit button text.
         */
        this._showBtnLabel = null;
        /**
         * Icon gets used as edit button text.
         */
        this.btnIcon = null;
        /**
         * Should the icon be visible?
         */
        this.showBtnIcon = null;
        /**
         * If set to true, the modal will close when the pEditable is done with the api-call.
         */
        this.waitForEditableCompleteBeforeClose = false;
        /**
         * Component disabled?
         * If set to true, the edit button doesn’t show up
         */
        this.disabled = false;
        this.onRemoveItemClick = new EventEmitter();
        this.removeButtonDisabled = false;
        this.removeModalText = null;
        this.removeModalButtonLabel = null;
        /**
         * Triggers when modal gets opened.
         * If this is a modal with a active pEditable, then the onModalOpen() method happens AFTER api.createDataCopy()
         */
        this.onModalOpen = new EventEmitter();
        /** @see PEditableModalButtonComponent['onModalClosed'] */
        this.onModalClosed = new EventEmitter();
        /** @see PEditableModalButtonComponent['onModalDismissed'] */
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
        this.boxEditMode = false;
    }
    get _hasBorder0() {
        return this.disabled;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get hasCardStyle() {
        return !(this.disabled && !this.showShowroom);
    }
    get _hasFormControlStyle() {
        // NOTE: compare this to showSimpleReadOnlyMode
        return this.disabled && !this.showShowroom && !this.label;
    }
    get _classBgLightCold() {
        return !this.theme;
    }
    get _classBgLight() {
        return this.theme === 'light';
    }
    get _classBgWhite() {
        return this.theme === 'white';
    }
    get _classBgDark() {
        return this.theme === 'dark';
    }
    get _classBorderDanger() {
        // if (this.required) return false;
        return this.isValid === false || this.borderStyle === 'danger';
    }
    get _classRequired() {
        return this.required;
    }
    get _classBorderPrimary() {
        return !this.isValid && this.borderStyle === 'primary';
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isValid() {
        // TODO: implement formControl support
        // return this.valid !== null ? this.valid : (!this.formControl || !this.formControl.invalid);
        return this.valid !== null ? this.valid : true;
    }
    ngAfterViewInit() {
        this.changeDetectorRef.detectChanges();
    }
    get hasShadow() {
        if (this.disabled)
            return false;
        return true;
    }
    get _hasShadowHover() {
        if (Config.IS_MOBILE)
            return false;
        if (!this.hasShadow)
            return false;
        return true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showShowroom() {
        return this.showroom.nativeElement.children.length > 0;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    updateEditMode(event) {
        this.boxEditMode = event;
        this.editMode.emit(event);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showSimpleReadOnlyMode() {
        return this.disabled && !this.showShowroom && !!this.label;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showEditButtonPopover() {
        if (Config.IS_MOBILE)
            return false;
        return true;
    }
    /**
     * Should the button-label be visible?
     */
    get showBtnLabel() {
        if (Config.IS_MOBILE)
            return false;
        if (this._showBtnLabel !== null)
            return this._showBtnLabel;
        return !!this.btnLabel;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PEditableModalBoxComponent.prototype, "hideRemoveBtn", void 0);
__decorate([
    ViewChild('showroom', { static: true }),
    __metadata("design:type", typeof (_b = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _b : Object)
], PEditableModalBoxComponent.prototype, "showroom", void 0);
__decorate([
    ViewChild('modalButtonRef'),
    __metadata("design:type", PEditableModalButtonComponent)
], PEditableModalBoxComponent.prototype, "modalButtonRef", void 0);
__decorate([
    HostBinding('class.border-0'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PEditableModalBoxComponent.prototype, "_hasBorder0", null);
__decorate([
    HostBinding('class.card'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PEditableModalBoxComponent.prototype, "hasCardStyle", null);
__decorate([
    HostBinding('class.form-control-read-mode'),
    HostBinding('class.p-0'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PEditableModalBoxComponent.prototype, "_hasFormControlStyle", null);
__decorate([
    HostBinding('class.o-hidden'),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    HostBinding('class.bg-light-cold'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PEditableModalBoxComponent.prototype, "_classBgLightCold", null);
__decorate([
    HostBinding('class.bg-light'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PEditableModalBoxComponent.prototype, "_classBgLight", null);
__decorate([
    HostBinding('class.bg-white'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PEditableModalBoxComponent.prototype, "_classBgWhite", null);
__decorate([
    HostBinding('class.bg-dark'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PEditableModalBoxComponent.prototype, "_classBgDark", null);
__decorate([
    HostBinding('class.border-danger'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PEditableModalBoxComponent.prototype, "_classBorderDanger", null);
__decorate([
    HostBinding('class.required'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PEditableModalBoxComponent.prototype, "_classRequired", null);
__decorate([
    HostBinding('class.border-primary'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PEditableModalBoxComponent.prototype, "_classBorderPrimary", null);
__decorate([
    Input('required'),
    __metadata("design:type", Boolean)
], PEditableModalBoxComponent.prototype, "required", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "backdrop", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "theme", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "size", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "scrollable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "borderStyle", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "label", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "btnLabel", void 0);
__decorate([
    Input('showBtnLabel'),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "_showBtnLabel", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "btnIcon", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "showBtnIcon", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "saveButtonPopover", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_c = typeof TemplateRef !== "undefined" && TemplateRef) === "function" ? _c : Object)
], PEditableModalBoxComponent.prototype, "editButtonPopover", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PEditableModalBoxComponent.prototype, "waitForEditableCompleteBeforeClose", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PEditableModalBoxComponent.prototype, "disabled", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_d = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _d : Object)
], PEditableModalBoxComponent.prototype, "onRemoveItemClick", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PEditableModalBoxComponent.prototype, "removeButtonDisabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "removeModalText", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "removeModalButtonLabel", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_e = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _e : Object)
], PEditableModalBoxComponent.prototype, "onModalOpen", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "onModalClosed", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "onModalDismissed", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "beforeModalClose", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], PEditableModalBoxComponent.prototype, "modalWhitespace", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "pEditable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "api", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "valid", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "saveChangesHook", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "onSaveStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "onSaveSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "onDismiss", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "onLeaveCurrent", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "editMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalBoxComponent.prototype, "beforeEditHook", void 0);
__decorate([
    HostBinding('class.shadow-sm'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PEditableModalBoxComponent.prototype, "hasShadow", null);
__decorate([
    HostBinding('class.shadow-hover'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PEditableModalBoxComponent.prototype, "_hasShadowHover", null);
PEditableModalBoxComponent = __decorate([
    Component({
        selector: 'p-editable-modal-box',
        templateUrl: './p-editable-modal-box.component.html',
        styleUrls: ['./p-editable-modal-box.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object, ModalService])
], PEditableModalBoxComponent);
export { PEditableModalBoxComponent };
let PEditableModalBoxHeaderComponent = class PEditableModalBoxHeaderComponent {
    // @HostBinding('class.bg-white') private _alwaysTrue = true;
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
], PEditableModalBoxHeaderComponent.prototype, "_alwaysTrue", void 0);
PEditableModalBoxHeaderComponent = __decorate([
    Component({
        selector: 'p-editable-modal-box-header',
        template: '<ng-content></ng-content>',
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [])
], PEditableModalBoxHeaderComponent);
export { PEditableModalBoxHeaderComponent };
let PEditableModalBoxShowroomComponent = class PEditableModalBoxShowroomComponent {
    constructor() {
        this._alwaysTrue = true;
        this.size = null;
    }
    get _classP0() { return this.size === 'frameless'; }
    get _classP1() { return this.size === 'small'; }
    get _classP2() { return this.size === 'medium'; }
    get _classP3() { return this.size === 'large'; }
};
__decorate([
    HostBinding('class.d-block'),
    HostBinding('class.o-hidden'),
    HostBinding('class.p-3'),
    HostBinding('class.card-body'),
    __metadata("design:type", Object)
], PEditableModalBoxShowroomComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    HostBinding('class.p-0'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PEditableModalBoxShowroomComponent.prototype, "_classP0", null);
__decorate([
    HostBinding('class.p-1'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PEditableModalBoxShowroomComponent.prototype, "_classP1", null);
__decorate([
    HostBinding('class.p-2'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PEditableModalBoxShowroomComponent.prototype, "_classP2", null);
__decorate([
    HostBinding('class.p-3'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PEditableModalBoxShowroomComponent.prototype, "_classP3", null);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableModalBoxShowroomComponent.prototype, "size", void 0);
PEditableModalBoxShowroomComponent = __decorate([
    Component({
        selector: 'p-editable-modal-box-showroom',
        template: '<ng-content></ng-content>',
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [])
], PEditableModalBoxShowroomComponent);
export { PEditableModalBoxShowroomComponent };
let PEditableModalBoxFormComponent = class PEditableModalBoxFormComponent {
    constructor() {
        this._alwaysTrue = true;
    }
};
__decorate([
    HostBinding('class.d-block'),
    HostBinding('class.w-100'),
    __metadata("design:type", Object)
], PEditableModalBoxFormComponent.prototype, "_alwaysTrue", void 0);
PEditableModalBoxFormComponent = __decorate([
    Component({
        selector: 'p-editable-modal-box-form',
        template: '<ng-content></ng-content>',
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [])
], PEditableModalBoxFormComponent);
export { PEditableModalBoxFormComponent };
//# sourceMappingURL=p-editable-modal-box.component.js.map