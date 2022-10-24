var PDropdownComponent_1;
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
import { __decorate, __metadata } from "tslib";
import { collapseOnLeaveAnimation, expandOnEnterAnimation } from 'angular-animations';
import { Component, ChangeDetectionStrategy, ElementRef, NgZone, ChangeDetectorRef, Input, Output, EventEmitter, ContentChildren, QueryList, forwardRef, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PDropdownItemComponent } from './p-dropdown-item/p-dropdown-item.component';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '../../bootstrap-styles.enum';
import { PFormControlComponentBaseDirective } from '../../p-attribute-info/attribute-info-component-base';
export var DropdownTypeEnum;
(function (DropdownTypeEnum) {
    DropdownTypeEnum["FILTER"] = "filter";
    DropdownTypeEnum["MULTI_SELECT"] = "multiSelect";
    DropdownTypeEnum["BUTTONS"] = "buttons";
    DropdownTypeEnum["TOGGLE"] = "toggle";
})(DropdownTypeEnum || (DropdownTypeEnum = {}));
/**
 * <p-dropdown> is like <select> with all the options for pEditables
 * @example with PFormControl binding
 * 	<form [formGroup]="myFormGroup">
 * 		<p-dropdown
 * 			[formControl]="myFormGroup.get('favoriteFood')"
 * 		>
 * 			<p-dropdown-item
 * 				value="unhealthy"
 * 				i18n
 * 			>Pizza</p-dropdown-item>
 * 			<p-dropdown-item
 * 				value="healthy"
 * 				i18n
 * 			>Salat</p-dropdown-item>
 * 		</p-dropdown>
 * 	</form>
 * @example with model binding
 * 	<p-dropdown
 * 		[(ngModel)]="member.favoriteFood"
 * 	>
 * 		<p-dropdown-item
 * 			value="unhealthy"
 * 			i18n
 * 		>Pizza</p-dropdown-item>
 * 		<p-dropdown-item
 * 			value="healthy"
 * 			i18n
 * 		>Salat</p-dropdown-item>
 * 	</p-dropdown>
 * @example as editable
 * 	<form [formGroup]="myFormGroup">
 * 		<p-dropdown
 * 			[pEditable]="!member.isNewItem()"
 * 			[api]="api"
 *
 * 			[formControl]="myFormGroup.get('favoriteFood')"
 * 			placeholder="Plano" i18n-placeholder
 * 		>
 * 			<p-dropdown-item
 * 				value="unhealthy"
 * 				i18n
 * 			>Pizza</p-dropdown-item>
 * 			<p-dropdown-item
 * 				value="healthy"
 * 				i18n
 * 			>Salat</p-dropdown-item>
 * 		</p-dropdown>
 * 	</form>
 */
let PDropdownComponent = PDropdownComponent_1 = class PDropdownComponent extends PFormControlComponentBaseDirective {
    constructor(el, zone, changeDetectorRef, modalService, localize, pFormsService, console) {
        super(false, changeDetectorRef, pFormsService, console);
        this.el = el;
        this.zone = zone;
        this.changeDetectorRef = changeDetectorRef;
        this.modalService = modalService;
        this.localize = localize;
        this.pFormsService = pFormsService;
        this.console = console;
        this.readMode = null;
        this.onSelect = new EventEmitter();
        this.size = null;
        this.btnStyle = PThemeEnum.SECONDARY;
        this.borderStyle = null;
        this.triggerIsCardOption = false;
        this.dropdownMenuAlignment = 'right';
        // TODO: get rid of label - use placeholder instead
        /**
         * Label for the dropdown trigger button
         * If not set, the placeholder will be taken
         */
        this.label = null;
        // TODO: Change type of icon to PlanoFaIconPool
        this.icon = null;
        this.iconSpin = false;
        this.dropdownType = DropdownTypeEnum.TOGGLE;
        this.hideTriggerLabel = false;
        this.hideDropdownToggleTriangle = false;
        this.hideBadge = false;
        this.hideFilterLed = false;
        this.rounded = null;
        /**
         * Set this to false if the dropdown-items should just act like buttons
         */
        this.showActiveItem = true;
        this.dropdownMenuVisible = null;
        this.dropdownMenuVisibleChanged = new EventEmitter();
        this.dropdownItemTemplate = null;
        this.dropdownTriggerTemplate = null;
        this.checkTouched = false;
        this.timeoutMouseLeave = null;
        this.placeholder = null;
        this.PThemeEnum = PThemeEnum;
        this.PBtnThemeEnum = PBtnThemeEnum;
        this.BootstrapSize = BootstrapSize;
        this.CONFIG = Config;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.DropdownTypeEnum = DropdownTypeEnum;
        // These are necessary Inputs and Outputs for pEditable form-element
        this.pEditable = false;
        this.api = null;
        this.valid = null;
        this.onSaveStart = new EventEmitter();
        this.onSaveSuccess = new EventEmitter();
        this.onDismiss = new EventEmitter();
        this.onLeaveCurrent = new EventEmitter();
        this.editMode = new EventEmitter(undefined);
        this.onMouseLeave = () => {
            // Running the timeout outside angular and trigger changeDetection of this component manually
            // makes it possible to use ChangeDetectionStrategy.OnPush on this component.
            this.zone.runOutsideAngular(() => {
                this.timeoutMouseLeave = window.setTimeout(() => {
                    // Does 'this' dropdown still exist? It’s possible that the component has already been destroyed in the meantime.
                    // eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
                    if (!this)
                        return;
                    this.dropdownMenuVisible = false;
                    this.dropdownMenuVisibleChanged.emit(this.dropdownMenuVisible);
                    this.changeDetectorRef.detectChanges();
                }, 500);
            });
        };
        this.onMouseEnter = () => {
            var _a;
            window.clearTimeout((_a = this.timeoutMouseLeave) !== null && _a !== void 0 ? _a : undefined);
        };
        this.modalRef = null;
        this.itemsFilterTitle = null;
        this._disabled = false;
        this.formControl = null;
        this._required = false;
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        this._value = null;
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        this._onChange = () => { };
        this.onTouched = () => { };
        // eslint-disable-next-line @angular-eslint/no-output-native
        this.focus = new EventEmitter();
        // eslint-disable-next-line @angular-eslint/no-output-native
        this.blur = new EventEmitter();
        if (this.placeholder === null)
            this.placeholder = this.localize.transform('Bitte wählen…');
    }
    /**
     * There are several dropdownTypes that represent a multi-select.
     * This getter returns true if it is any of them.
     */
    get isMultiSelect() {
        return this.dropdownType === DropdownTypeEnum.MULTI_SELECT || this.dropdownType === DropdownTypeEnum.FILTER;
    }
    /**
     * Returns a icon fitting to the state and type of the multi-select.
     */
    multiSelectIcon(item) {
        if (!this.isMultiSelect)
            this.console.error('Don’t use this method if this is not a multi-select dropdown');
        if (this.dropdownType === DropdownTypeEnum.FILTER)
            return item.active === true ? PlanoFaIconPool.VISIBLE : PlanoFaIconPool.INVISIBLE;
        return item.active === true ? PlanoFaIconPool.CHECKBOX_SELECTED : PlanoFaIconPool.CHECKBOX_UNSELECTED;
    }
    /**
     * Returns true if this is not valid.
     * Invalid dropdown’s can be bordered red, or something similar that.
     */
    get hasDanger() {
        return (!this.formControl || this.formControl.touched) && !this.isValid;
    }
    /** Is this valid? [valid]="…" overwrites the valid state if the formControl. */
    get isValid() {
        return this.valid !== null ? this.valid : (!this.formControl || !this.formControl.invalid);
    }
    ngOnInit() {
        // make sure these events do not trigger change detection for performance reasons
        this.zone.runOutsideAngular(() => {
            this.el.nativeElement.addEventListener('mouseenter', this.onMouseEnter, false);
            this.el.nativeElement.addEventListener('mouseleave', this.onMouseLeave, false);
        });
        return super.ngOnInit();
    }
    /**
     * Set the label for the dropdown trigger button.
     */
    initLabel() {
        if (this.label === null) {
            if (this.activeItem && !this.isMultiSelect) {
                this.label = this.activeItem.label;
            }
            else {
                this.label = this.localize.transform('Bitte wählen…');
            }
        }
    }
    ngOnDestroy() {
        var _a;
        window.clearTimeout((_a = this.timeoutMouseLeave) !== null && _a !== void 0 ? _a : undefined);
        this.el.nativeElement.removeEventListener('mouseenter', this.onMouseEnter);
        this.el.nativeElement.removeEventListener('mouseleave', this.onMouseLeave);
        return super.ngOnDestroy();
    }
    /**
     * Should this dropdown item be visually highlighted?
     */
    isPrimary(item) {
        if (!this.showActiveItem)
            return false;
        // Our filter drop-downs say 'hide X' when INACTIVE. Therefore inactive items must be
        // the highlighted ones.
        // if (this.dropdownType === DropdownTypeEnum.FILTER) return !item.active;
        if (this.dropdownType === DropdownTypeEnum.FILTER)
            return false;
        return this.isActive(item);
    }
    /**
     * This method checks if the given item is in a active state.
     */
    isActive(item) {
        // If set, the item.checked value has a higher priority then the other expression
        if (item.active !== null)
            return item.active;
        if (item.value === undefined)
            return false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.value && this.value.equals)
            return this.value.equals(item.value);
        return this.value === item.value;
    }
    /**
     * If this is a multi select dropdown and if there is at least one selected item
     * then the button needs some kind of highlighting
     */
    get isHighlighted() {
        return this.dropdownType === DropdownTypeEnum.FILTER && !!this.inactiveItemsCounter;
    }
    /**
     * This returns a icon for the trigger button. Can be set from outside, but can also be the icon of
     * the selected item, if this is a dropdown with one possible active item. ..aka. "single select dropdown".
     */
    get triggerIcon() {
        var _a;
        if (this.icon)
            return this.icon;
        if ((_a = this.activeItem) === null || _a === void 0 ? void 0 : _a.icon)
            return this.activeItem.icon;
        return undefined;
    }
    /**
     * The label of the trigger button.
     */
    get triggerLabel() {
        if (this.showActiveItem && this.activeItem && this.activeItem.label)
            return this.activeItem.label;
        if (this.label)
            return this.label;
        if (this.placeholder)
            return this.placeholder;
        return undefined;
    }
    /**
     * Is it now possible to use ng-content of p-dropdown-item instead of a simple string (label property)
     * Therefore we need this getter
     */
    get triggerLabelTemplate() {
        var _a;
        if (!this.showActiveItem)
            return null;
        if (!this.activeItem)
            return null;
        if (!((_a = this.activeItem.innerTemplate) === null || _a === void 0 ? void 0 : _a.elementRef.nativeElement.childNodes.length))
            return null;
        return this.activeItem.innerTemplate;
    }
    /**
     * Get all items with the stat active
     */
    get activeItems() {
        return this.items.filter((item) => this.isActive(item));
    }
    /**
     * Get the selected item, if its not a multi-select-dropdown
     */
    get activeItem() {
        if (this.isMultiSelect)
            return null;
        if (!this.items)
            return null;
        return this.activeItems[0];
    }
    /**
     * This can be used for e.g. filter dropdown’s to show if one of the list-items is active.
     */
    get badgeContent() {
        return this.inactiveItemsCounter;
    }
    /**
     * Counts how many of the containing items are inactive. useful for e.g. filter dropdown’s.
     */
    get inactiveItemsCounter() {
        return this.items.length - this.activeItems.length;
    }
    /**
     * This happens when user clicks one of the list-items inside dropdown’s.
     */
    clickItem(clickedItem, success) {
        var _a, _b;
        // Don‘t close list on click if its a multiSelect
        if (!this.isMultiSelect) {
            this.dropdownMenuVisible = false;
            (_b = (_a = this.triggerRef) === null || _a === void 0 ? void 0 : _a.nativeElement.querySelector('button')) === null || _b === void 0 ? void 0 : _b.focus();
            this.dropdownMenuVisibleChanged.emit(this.dropdownMenuVisible);
        }
        // don’t do anything if dropdown-item is disabled
        if (clickedItem.disabled)
            return;
        // activate the tab the user has clicked on.
        if (this.dropdownType === DropdownTypeEnum.BUTTONS) {
            clickedItem.onClick.emit();
        }
        else {
            let newActiveState = false;
            if (this.isMultiSelect) {
                newActiveState = !clickedItem.active;
            }
            else {
                newActiveState = true;
            }
            if (clickedItem.active !== newActiveState) {
                clickedItem.active = newActiveState;
                clickedItem.onClick.emit();
            }
        }
        this.handleNonMultiSelect(clickedItem, success);
        this.value = clickedItem.value;
    }
    handleNonMultiSelect(clickedItem, success) {
        if (this.isMultiSelect)
            return;
        // deactivate all other tabs except the clicked one
        for (const item of this.items.toArray()) {
            if (item !== clickedItem && item.active)
                item.active = false;
        }
        if (clickedItem) {
            assumeDefinedToGetStrictNullChecksRunning(clickedItem, 'clickedItem');
            this.onSelect.emit(clickedItem.value);
        }
        if (success)
            success();
    }
    /**
     * User clicked the button that should open the dropdown thing
     */
    onClickTrigger(modalContent) {
        var _a, _b;
        if (Config.IS_MOBILE) {
            this.modalRef = this.modalService.openModal(modalContent, {
                size: BootstrapSize.SM,
                scrollable: true,
                success: () => { this.modalRef = null; },
                dismiss: () => { this.modalRef = null; },
            });
            return;
        }
        this.dropdownMenuVisible = !this.dropdownMenuVisible;
        (_b = (_a = this.triggerRef) === null || _a === void 0 ? void 0 : _a.nativeElement.querySelector('button')) === null || _b === void 0 ? void 0 : _b.focus();
        this.dropdownMenuVisibleChanged.emit(this.dropdownMenuVisible);
    }
    // public get showBadge() : boolean {
    // 	if (this.hideBadge) return false;
    // 	if (this.dropdownType !== 'filter') return false;
    // 	return !!this.badgeContent;
    // }
    /**
     * Should the filter-led be visible?
     */
    get showFilterLed() {
        if (this.hideFilterLed)
            return false;
        if (this.dropdownType !== DropdownTypeEnum.FILTER)
            return false;
        // if (this.dropdownMenuVisible) return true;
        // return !!this.badgeContent;
        return true;
    }
    /**
     * Should the label be visible?
     */
    get showLabel() {
        if (this.hideTriggerLabel)
            return false;
        return !!this.triggerLabel;
    }
    /**
     * This is the minimum code that is required for a custom control in Angular.
     * Its necessary to make [(ngModel)] and [formControl] work.
     */
    get disabled() {
        return this._disabled;
    }
    set disabled(input) {
        this.setDisabledState(input);
        this._disabled = input;
    }
    ngAfterViewInit() {
        if (this.value) {
            assumeDefinedToGetStrictNullChecksRunning(this.activeItem, 'activeItem');
            this.handleNonMultiSelect(this.activeItem);
        }
        this.initLabel();
        this.validateValues();
    }
    ngAfterContentChecked() {
        if (this.items.filter(item => item.show !== false).length === 0)
            this.console.error(`Dropdown is empty. Label: »${this.label}«`);
        return super.ngAfterContentChecked();
    }
    /**
     * Validate if required attributes are set and
     * if the set values work together / make sense / have a working implementation.
     */
    validateValues() {
        if (Config.DEBUG && this.dropdownType === DropdownTypeEnum.BUTTONS && this.items) {
            for (const item of this.items.toArray()) {
                if (!item.onClick.observers.length && item.value === undefined)
                    throw new Error(`All dropdown-items need to have (onClick)="…" binding if dropdown has dropdownType »BUTTONS«`);
            }
        }
    }
    /**
     * Is this a required field?
     * This can be set as Input() but if there is a formControl binding,
     * then it takes the info from the formControl’s validators.
     */
    get required() {
        if (this._required)
            return this._required;
        return this.formControlInitialRequired();
    }
    /** Get change event from inside this component, and pass it on. */
    onChange(value) {
        this._onChange(value);
    }
    /** the value of this control */
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    get value() { return this._value; }
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    set value(value) {
        if (value === this._value)
            return;
        this._value = value;
        this.onChange(value);
    }
    /** Write a new value to the element. */
    writeValue(value) {
        if (this._value === value)
            return;
        if (!!this.activeItem)
            this.activeItem.active = false;
        this._value = value;
        this.changeDetectorRef.markForCheck();
    }
    /**
     * @see ControlValueAccessor['registerOnChange']
     *
     * Note that registerOnChange() only gets called if a formControl is bound.
     * @param fn Accepts a callback function which you can call when changes happen so that you can notify the outside world that
     * the data model has changed.
     * Note that you call it with the changed data model value.
     */
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    registerOnChange(fn) { this._onChange = fn; }
    /** Set the function to be called when the control receives a touch event. */
    registerOnTouched(fn) { this.onTouched = fn; }
    /** setDisabledState */
    setDisabledState(isDisabled) {
        var _a, _b;
        if (this._disabled === isDisabled)
            return;
        // Set internal attribute
        this._disabled = isDisabled;
        this._disabled ? (_a = this.formControl) === null || _a === void 0 ? void 0 : _a.disable() : (_b = this.formControl) === null || _b === void 0 ? void 0 : _b.enable();
    }
    /** Filter all errors that should be shown in the ui. */
    get visibleErrors() {
        return this.pFormsService.visibleErrors(this.formControl);
    }
    /**
     * Check if focus is anywhere inside dropdown. If not, blur
     */
    onBlur() {
        window.setTimeout(() => {
            if (this.el.nativeElement.contains(document.activeElement))
                return;
            if (this.modalRef !== null)
                return;
            this.blur.emit();
        }, 200);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownComponent.prototype, "readMode", void 0);
__decorate([
    ContentChildren(PDropdownItemComponent),
    __metadata("design:type", typeof (_d = typeof QueryList !== "undefined" && QueryList) === "function" ? _d : Object)
], PDropdownComponent.prototype, "items", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_e = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _e : Object)
], PDropdownComponent.prototype, "onSelect", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownComponent.prototype, "size", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownComponent.prototype, "btnStyle", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownComponent.prototype, "borderStyle", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PDropdownComponent.prototype, "triggerIsCardOption", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], PDropdownComponent.prototype, "dropdownMenuAlignment", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownComponent.prototype, "label", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownComponent.prototype, "icon", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PDropdownComponent.prototype, "iconSpin", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], PDropdownComponent.prototype, "dropdownType", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PDropdownComponent.prototype, "hideTriggerLabel", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PDropdownComponent.prototype, "hideDropdownToggleTriangle", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PDropdownComponent.prototype, "hideBadge", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PDropdownComponent.prototype, "hideFilterLed", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownComponent.prototype, "rounded", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PDropdownComponent.prototype, "showActiveItem", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownComponent.prototype, "dropdownMenuVisible", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_f = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _f : Object)
], PDropdownComponent.prototype, "dropdownMenuVisibleChanged", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownComponent.prototype, "dropdownItemTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownComponent.prototype, "dropdownTriggerTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PDropdownComponent.prototype, "checkTouched", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownComponent.prototype, "pEditable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownComponent.prototype, "api", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownComponent.prototype, "valid", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownComponent.prototype, "saveChangesHook", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PDropdownComponent.prototype, "onSaveStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PDropdownComponent.prototype, "onSaveSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PDropdownComponent.prototype, "onDismiss", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PDropdownComponent.prototype, "onLeaveCurrent", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PDropdownComponent.prototype, "editMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownComponent.prototype, "itemsFilterTitle", void 0);
__decorate([
    Input('disabled'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], PDropdownComponent.prototype, "disabled", null);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownComponent.prototype, "formControl", void 0);
__decorate([
    Input('required'),
    __metadata("design:type", Boolean)
], PDropdownComponent.prototype, "_required", void 0);
__decorate([
    ViewChild('triggerRef', { read: ElementRef, static: false }),
    __metadata("design:type", typeof (_j = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _j : Object)
], PDropdownComponent.prototype, "triggerRef", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PDropdownComponent.prototype, "focus", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PDropdownComponent.prototype, "blur", void 0);
PDropdownComponent = PDropdownComponent_1 = __decorate([
    Component({
        selector: 'p-dropdown',
        templateUrl: './p-dropdown.component.html',
        styleUrls: ['./p-dropdown.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PDropdownComponent_1),
                multi: true,
            },
        ],
        animations: [
            collapseOnLeaveAnimation({
                animateChildren: 'before',
                duration: 50,
            }),
            expandOnEnterAnimation(),
        ],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _a : Object, typeof (_b = typeof NgZone !== "undefined" && NgZone) === "function" ? _b : Object, typeof (_c = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _c : Object, ModalService,
        LocalizePipe,
        PFormsService,
        LogService])
], PDropdownComponent);
export { PDropdownComponent };
//# sourceMappingURL=p-dropdown.component.js.map