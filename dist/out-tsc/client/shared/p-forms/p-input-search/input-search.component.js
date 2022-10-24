var PInputSearchComponent_1;
var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Component, Input, forwardRef, ChangeDetectorRef, EventEmitter, Output, HostBinding, ViewChild, HostListener, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SLIDE_HORIZONTAL_ON_NGIF_TRIGGER, SLIDE_WIDTH_100_ON_BOOLEAN_TRIGGER, FLEX_GROW_ON_NGIF_TRIGGER } from '@plano/animations';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { BootstrapRounded, BootstrapSize, PBtnThemeEnum, PThemeEnum } from '../../bootstrap-styles.enum';
/**
 * <p-input-search> is much like <p-input> but specifically made for searches
 */
let PInputSearchComponent = PInputSearchComponent_1 = class PInputSearchComponent {
    constructor(changeDetectorRef, localize) {
        this.changeDetectorRef = changeDetectorRef;
        this.localize = localize;
        this.readMode = false;
        this.size = null;
        /**
         * Is the user currently searching something?
         * This can e.g. uncollapse a collapsed magnifier-icon-button to a input with a close button.
         */
        this.isActive = false;
        this.darkMode = false;
        this.theme = null;
        this.isActiveChange = new EventEmitter();
        this.checkTouched = false;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.BootstrapRounded = BootstrapRounded;
        this.BootstrapSize = BootstrapSize;
        this._alwaysTrue = true;
        this.inputHasFocus = false;
        /**
         * This is the minimum code that is required for a custom control in Angular.
         * Its necessary to make [(ngModel)] and [formControl] work.
         */
        this.disabled = false;
        this.formControl = null;
        this._value = null;
        this.onChange = () => { };
        /** onTouched */
        this.onTouched = () => { };
    }
    get _isActive() {
        return this.isActive;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isSizeSm() {
        return this.size === 'sm';
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isSizeLg() {
        return this.size === 'lg';
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    onKeydownHandler(_event) {
        if (this.inputHasFocus) {
            this.setIsActive(false);
        }
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    onClickSearchIcon() {
        this.setIsActive(!this.isActive);
    }
    setIsActive(active) {
        this.isActive = active;
        if (!this.isActive) {
            this.value = null;
        }
        else {
            const INTERVAL = window.setInterval(() => {
                assumeDefinedToGetStrictNullChecksRunning(this.inputEl.nativeElement); // eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
                if (!this.inputEl || !this.inputEl.nativeElement) {
                    return;
                }
                this.inputEl.nativeElement.focus();
                window.clearInterval(INTERVAL);
            }, 10);
        }
        this.isActiveChange.emit(this.isActive);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get btnStyle() {
        if (this.isActive)
            return PThemeEnum.PRIMARY;
        if (!this.theme)
            return PBtnThemeEnum.OUTLINE_SECONDARY;
        return this.theme;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get triggerButtonPopoverText() {
        if (!this.isActive)
            return this.localize.transform('Suche');
        return this.localize.transform('Suche verlassen (Esc)');
    }
    /** the value of this control */
    get value() { return this._value; }
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
    registerOnChange(fn) { this.onChange = fn; }
    /** Set the function to be called when the control receives a touch event. */
    registerOnTouched(fn) { this.onTouched = fn; }
    /** setDisabledState */
    setDisabledState(isDisabled) {
        if (this.disabled === isDisabled)
            return;
        // Set internal attribute which gets used in the template.
        this.disabled = isDisabled;
        // Refresh the formControl. #two-way-binding
        if (this.formControl && this.formControl.disabled !== this.disabled) {
            this.disabled ? this.formControl.disable() : this.formControl.enable();
        }
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputSearchComponent.prototype, "readMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputSearchComponent.prototype, "size", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PInputSearchComponent.prototype, "isActive", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PInputSearchComponent.prototype, "darkMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputSearchComponent.prototype, "theme", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_b = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _b : Object)
], PInputSearchComponent.prototype, "isActiveChange", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputSearchComponent.prototype, "checkTouched", void 0);
__decorate([
    HostBinding('class.input-group'),
    __metadata("design:type", Boolean)
], PInputSearchComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    HostBinding('class.flex-grow-1'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PInputSearchComponent.prototype, "_isActive", null);
__decorate([
    HostBinding('class.input-group-sm'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PInputSearchComponent.prototype, "isSizeSm", null);
__decorate([
    HostBinding('class.input-group-lg'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PInputSearchComponent.prototype, "isSizeLg", null);
__decorate([
    HostListener('document:keydown.escape', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], PInputSearchComponent.prototype, "onKeydownHandler", null);
__decorate([
    ViewChild('input', { static: false }),
    __metadata("design:type", typeof (_c = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _c : Object)
], PInputSearchComponent.prototype, "inputEl", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PInputSearchComponent.prototype, "disabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputSearchComponent.prototype, "formControl", void 0);
PInputSearchComponent = PInputSearchComponent_1 = __decorate([
    Component({
        selector: 'p-input-search',
        templateUrl: './input-search.component.html',
        styleUrls: ['./input-search.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PInputSearchComponent_1),
                multi: true,
            },
        ],
        animations: [SLIDE_HORIZONTAL_ON_NGIF_TRIGGER, SLIDE_WIDTH_100_ON_BOOLEAN_TRIGGER, FLEX_GROW_ON_NGIF_TRIGGER],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object, LocalizePipe])
], PInputSearchComponent);
export { PInputSearchComponent };
//# sourceMappingURL=input-search.component.js.map