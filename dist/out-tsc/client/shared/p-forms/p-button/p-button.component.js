var _a, _b, _c, _d;
import { __decorate, __metadata, __param } from "tslib";
import { Component, ChangeDetectionStrategy, HostBinding, ElementRef, Host, Optional, ChangeDetectorRef } from '@angular/core';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { ModalDirective } from '../../../../shared/core/p-modal/modal.directive';
import { ModalService } from '../../../../shared/core/p-modal/modal.service';
import { PlanoFaIconPool } from '../../../../shared/core/plano-fa-icon-pool.enum';
import { BootstrapRounded, PThemeEnum, PTextColorEnum, PBtnThemeEnum, BootstrapSize } from '../../bootstrap-styles.enum';
import { AttributeInfoComponentBaseDirective } from '../../p-attribute-info/attribute-info-component-base';
export var PButtonType;
(function (PButtonType) {
    PButtonType["DEFAULT"] = "default";
    PButtonType["TOGGLE"] = "toggle";
    PButtonType["FILTER"] = "filter";
})(PButtonType || (PButtonType = {}));
let PButtonComponent = class PButtonComponent extends AttributeInfoComponentBaseDirective {
    constructor(modalService, changeDetectorRef, elementRef, pModal, console) {
        super(true, changeDetectorRef, console);
        this.modalService = modalService;
        this.changeDetectorRef = changeDetectorRef;
        this.elementRef = elementRef;
        this.pModal = pModal;
        this.console = console;
        this.attributeInfoRequired = false;
        this.isLoading = false;
        this._alwaysTrue = true;
        this.size = null;
        this._theme = null;
        this.btnClasses = '';
        this.textStyle = null;
        this.buttonType = PButtonType.DEFAULT;
        this.isActiveButton = false;
        this.darkMode = false;
        /**
         * Text that should be shown in a badge. E.g. a counter for something
         */
        this.badge = null;
        this.badgeAlign = 'right';
        /**
         * Use this instead of (click)
         * TODO: Give this a more intuitive name. I can probably take a (onClick) and bind the pEditable triggerClick to it.
         */
        this.triggerClick = new EventEmitter();
        /**
         * @deprecated
         */
        // eslint-disable-next-line @angular-eslint/no-output-native
        this.click = new EventEmitter();
        /**
         * For a non-rounded button use workaround: [btnClasses]="'rounded-0'"
         */
        this.rounded = null;
        /**
         * Button will have a pill style if its a toggle button. With [pill]="false" you can enforce a non-pill button.
         */
        this._pill = null;
        // These are necessary Inputs and Outputs for pEditable form-element
        this.pEditable = false;
        this.api = null;
        this.valid = null;
        this.onSaveStart = new EventEmitter();
        this.onSaveSuccess = new EventEmitter();
        this.onDismiss = new EventEmitter();
        this.onLeaveCurrent = new EventEmitter();
        this.editMode = new EventEmitter(undefined);
        // public get isValid() : boolean {
        // 	return this.valid !== null ? this.valid : (!this.formControl || !this.formControl.invalid);
        // }
        this._disabled = false;
        this.required = false;
        this._icon = null;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.BootstrapRounded = BootstrapRounded;
        this.PTextColorEnum = PTextColorEnum;
        this.PThemeEnum = PThemeEnum;
        this.PButtonType = PButtonType;
        this.PBtnThemeEnum = PBtnThemeEnum;
        this.BootstrapSize = BootstrapSize;
        this.config = Config;
        /**
         * Should the ng-content be visible?
         */
        this._showContent = false;
        // eslint-disable-next-line @angular-eslint/no-output-native
        this.focus = new EventEmitter();
        // eslint-disable-next-line @angular-eslint/no-output-native
        this.blur = new EventEmitter();
    }
    /**
     * Is this button disabled?
     */
    get disabled() {
        return this._disabled || !this.canEdit;
    }
    set disabled(input) {
        this._disabled = input;
    }
    /** setDisabledState */
    setDisabledState(isDisabled) {
        if (this._disabled === isDisabled)
            return;
        // Set internal attribute
        this._disabled = isDisabled;
    }
    set type(_input) {
        if (this.console) {
            this.console.error('Setting a button type is not supported on p-button yet');
        }
        else {
            throw new Error('Setting a button type is not supported on p-button yet');
        }
    }
    set class(input) {
        var _a;
        if (input.includes('btn'))
            (_a = this.console) === null || _a === void 0 ? void 0 : _a.error(`Don’t set button classes on p-button. Use e.g. [theme]="PThemeEnum.PRIMARY" or [theme]="PBtnThemeEnum.OUTLINE_SECONDARY". Your current classes are »${input}«`);
    }
    /**
     * Icon next to the button-text
     */
    get icon() {
        if (this._icon)
            return this._icon;
        if (this.buttonType === PButtonType.FILTER) {
            return this.isActiveButton ? PlanoFaIconPool.INVISIBLE : PlanoFaIconPool.VISIBLE;
        }
        return null;
    }
    set icon(input) {
        this._icon = input;
    }
    /**
     * In which theme-color should the icon appear.
     * If this is some kind of toggle-button, then this will probably change based on active state.
     */
    get iconTheme() {
        if (this.buttonType === PButtonType.FILTER && this.isActiveButton) {
            switch (this.theme) {
                case PThemeEnum.SECONDARY:
                    return PThemeEnum.PRIMARY;
                case PBtnThemeEnum.OUTLINE_DANGER:
                case PBtnThemeEnum.OUTLINE_DARK:
                case PBtnThemeEnum.OUTLINE_LIGHT:
                case PBtnThemeEnum.OUTLINE_PRIMARY:
                case PBtnThemeEnum.OUTLINE_SECONDARY:
                    return this.disabled ? PTextColorEnum.WHITE : PThemeEnum.SECONDARY;
                default:
                    return this.theme;
            }
        }
        return null;
    }
    ngOnInit() {
        this.initValues();
        return super.ngOnInit();
    }
    /**
     * In which color-theme should the button appear?
     */
    get theme() {
        if (this._theme)
            return this._theme;
        if (this.buttonType === PButtonType.TOGGLE)
            return PThemeEnum.PRIMARY;
        if (this.buttonType === PButtonType.FILTER)
            return PThemeEnum.SECONDARY;
        return PThemeEnum.SECONDARY;
    }
    /**
     * Set values that are necessary for this function.
     * These initValues methods are used in many components.
     * They mostly get used for class attributes that would cause performance issues as a getter.
     */
    initValues() {
        this.validateValues();
    }
    /**
     * Validate if required attributes are set and
     * if the set values work together / make sense / have a working implementation.
     */
    validateValues() {
        var _a, _b, _c, _d, _e, _f;
        // Output names should never collide with native HTML dom events
        // See: https://medium.com/angular-athens/naming-of-output-events-in-angular-2063cad94183
        if (!!this.click.observers.length && !this.pModal) {
            (_a = this.console) === null || _a === void 0 ? void 0 : _a.warn(`Button has potential problem: ${(_c = (_b = this.elementRef) === null || _b === void 0 ? void 0 : _b.nativeElement.outerText) !== null && _c !== void 0 ? _c : this.icon}`);
            (_d = this.console) === null || _d === void 0 ? void 0 : _d.warn(`Use the components '(triggerClick)' instead of native html’s '(click)'. For more info, see https://medium.com/angular-athens/naming-of-output-events-in-angular-2063cad94183`);
        }
        if ((this.buttonType === PButtonType.TOGGLE || this.buttonType === PButtonType.FILTER) && this.icon === null && ((_e = this.content) === null || _e === void 0 ? void 0 : _e.nativeElement.children.length) === 0)
            (_f = this.console) === null || _f === void 0 ? void 0 : _f.error('icon must be provided for toggle buttons');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isAOutlineStyle() {
        if (!this.theme)
            return;
        if (this.theme.includes('outline-primary'))
            return false;
        return this.theme.includes('outline-');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get justifyClass() {
        if (this.btnClasses.includes('justify-content-'))
            return '';
        if (this.buttonType === PButtonType.TOGGLE)
            return 'justify-content-start';
        if (this.buttonType === PButtonType.FILTER)
            return 'justify-content-start';
        return 'justify-content-center';
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get alignItemsClass() {
        if (this.btnClasses.includes('align-items-'))
            return '';
        return 'align-items-center';
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showContent() {
        const hasContent = this.content.nativeElement && (this.content.nativeElement.children.length > 0 ||
            this.content.nativeElement.innerHTML.length > 0);
        if (hasContent)
            this._showContent = hasContent;
        return this._showContent;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get hasBadgePillClass() {
        if (this._pill !== null)
            return this._pill;
        return this.buttonType === PButtonType.TOGGLE || this.buttonType === PButtonType.FILTER;
    }
    /**
     * Open a Modal like info-circle does it when in IS_MOBILE mode.
     */
    openCannotEditHint() {
        var _a;
        if (this.cannotEditHint === null) {
            (_a = this.console) === null || _a === void 0 ? void 0 : _a.error('It should not have been possible to run this method');
            return;
        }
        this.modalService.openCannotEditHintModal(this.cannotEditHint);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PButtonComponent.prototype, "isLoading", void 0);
__decorate([
    HostBinding('class.btn-group'),
    HostBinding('class.d-flex'),
    __metadata("design:type", Object)
], PButtonComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PButtonComponent.prototype, "size", void 0);
__decorate([
    Input('theme'),
    __metadata("design:type", Object)
], PButtonComponent.prototype, "_theme", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], PButtonComponent.prototype, "btnClasses", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PButtonComponent.prototype, "textStyle", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], PButtonComponent.prototype, "buttonType", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PButtonComponent.prototype, "isActiveButton", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PButtonComponent.prototype, "darkMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PButtonComponent.prototype, "badge", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PButtonComponent.prototype, "badgeAlign", void 0);
__decorate([
    ViewChild('content', { static: true }),
    __metadata("design:type", Object)
], PButtonComponent.prototype, "content", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], PButtonComponent.prototype, "triggerClick", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_d = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _d : Object)
], PButtonComponent.prototype, "click", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PButtonComponent.prototype, "rounded", void 0);
__decorate([
    Input('pill'),
    __metadata("design:type", Object)
], PButtonComponent.prototype, "_pill", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PButtonComponent.prototype, "pEditable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PButtonComponent.prototype, "api", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PButtonComponent.prototype, "valid", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PButtonComponent.prototype, "saveChangesHook", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PButtonComponent.prototype, "onSaveStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PButtonComponent.prototype, "onSaveSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PButtonComponent.prototype, "onDismiss", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PButtonComponent.prototype, "onLeaveCurrent", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PButtonComponent.prototype, "editMode", void 0);
__decorate([
    Input('disabled'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], PButtonComponent.prototype, "disabled", null);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PButtonComponent.prototype, "required", void 0);
__decorate([
    Input('type'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], PButtonComponent.prototype, "type", null);
__decorate([
    Input('class'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], PButtonComponent.prototype, "class", null);
__decorate([
    Input('icon'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], PButtonComponent.prototype, "icon", null);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PButtonComponent.prototype, "focus", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PButtonComponent.prototype, "blur", void 0);
PButtonComponent = __decorate([
    Component({
        selector: 'p-button',
        templateUrl: './p-button.component.html',
        styleUrls: ['./p-button.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __param(3, Optional()),
    __param(3, Host()),
    __metadata("design:paramtypes", [ModalService, typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object, typeof (_b = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _b : Object, ModalDirective,
        LogService])
], PButtonComponent);
export { PButtonComponent };
//# sourceMappingURL=p-button.component.js.map