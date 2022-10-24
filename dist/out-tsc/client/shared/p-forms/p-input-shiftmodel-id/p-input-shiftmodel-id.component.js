var PInputShiftModelIdComponent_1;
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
import { __decorate, __metadata } from "tslib";
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Subject, merge } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { Component, Input, ViewChild, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SchedulingApiShiftModel } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { EditableDirective } from '@plano/client/shared/p-editable/editable/editable.directive';
import { TimeStampApiShiftModel } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PPossibleErrorNames } from '@plano/shared/core/validators.types';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
let PInputShiftModelIdComponent = PInputShiftModelIdComponent_1 = class PInputShiftModelIdComponent {
    constructor(localize, changeDetectorRef) {
        this.localize = localize;
        this.changeDetectorRef = changeDetectorRef;
        this.readMode = false;
        this._required = false;
        this._placeholder = null;
        this.icon = 'search';
        /**
         * How one item should look like.
         */
        this.itemTemplate = null;
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.focusout = new EventEmitter();
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.focus = new EventEmitter();
        this.checkTouched = false;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.inputHasClassRoundedRight = false;
        // I am not quite sure how this works. It was copy paste ¯\_(ツ)_/¯ ^nn
        this.focus$ = new Subject();
        this.click$ = new Subject();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.search = (text$) => {
            const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
            const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !!(this.instance && !this.instance.isPopupOpen())));
            const inputFocus$ = this.focus$;
            return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(map((term) => {
                const items = this.items.search(term).filterBy((item) => {
                    if (!item.trashed)
                        return true;
                    if (this.value && item.id.equals(this.value))
                        return true;
                    return false;
                });
                return items.iterableSortedBy(['parentName']);
            }));
        };
        this.formatter = (item) => {
            // eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
            if (!item)
                return '';
            // eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
            if (!item.id)
                return '';
            // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
            return item.name ? item.name : '';
        };
        this._tempValue = null;
        // These are necessary Inputs and Outputs for pEditable form-element
        this.pEditable = false;
        this.api = null;
        this.valid = null;
        this.onSaveStart = new EventEmitter();
        this.onSaveSuccess = new EventEmitter();
        this.onDismiss = new EventEmitter();
        this.onLeaveCurrent = new EventEmitter();
        this.editMode = new EventEmitter(undefined);
        /**
         * This is the minimum code that is required for a custom control in Angular.
         * Its necessary to make [(ngModel)] and [formControl] work.
         */
        this.disabled = false;
        this.formControl = null;
        this._value = null;
        this._onChange = () => { };
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.keyup = new EventEmitter();
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.blur = new EventEmitter();
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.change = new EventEmitter();
        /** onTouched */
        this.onTouched = () => { };
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    changeEditMode(event) {
        if (this.pEditableRef)
            this.inputHasClassRoundedRight = event;
        this.editMode.emit(event);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get placeholder() {
        if (this._placeholder !== null)
            return this._placeholder;
        return this.localize.transform('Wähle eine Tätigkeit…');
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onFocus(event) {
        this.focus.emit(event);
        this.focus$.next(event.target.value);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onClick(event) {
        const TARGET = event.target;
        this.click$.next(TARGET.value);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get valueItem() {
        if (this._tempValue)
            return this._tempValue;
        return this.items.get(this.value);
    }
    set valueItem(input) {
        if (input instanceof SchedulingApiShiftModel ||
            input instanceof TimeStampApiShiftModel) {
            this.value = input.id;
            this._tempValue = null;
        }
        else {
            this._tempValue = input;
            assumeDefinedToGetStrictNullChecksRunning(input, 'input');
            const ID = this.getIdByInput(input);
            if (ID instanceof Id) {
                this._tempValue = null;
                this.onClickItem(ID);
                this.instance.dismissPopup();
            }
        }
    }
    getIdByInput(input) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const searchedShiftModels = this.items.filterBy((item) => `${item.name.toLowerCase()}` === input.toLowerCase());
        if (searchedShiftModels.length > 0) {
            const firstItem = searchedShiftModels.get(0);
            if (!firstItem)
                throw new Error('Could not get firstItem');
            return firstItem.id;
        }
        return input;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get allItems() {
        if (this.value === null)
            return false;
        return true;
    }
    /**
     * Is this a required field?
     * This can be set as Input() but if there is a formControl binding,
     * then it takes the info from the formControl’s validators.
     * TODO: 	Replace this by:
     * 				return this.formControlInitialRequired();
     */
    get required() {
        var _a, _b;
        if (this._required)
            return this._required;
        if (this.formControl) {
            const validator = (_b = (_a = this.formControl).validator) === null || _b === void 0 ? void 0 : _b.call(_a, this.formControl);
            if (!validator)
                return false;
            return !!validator[PPossibleErrorNames.REQUIRED] || !!validator[PPossibleErrorNames.ID_DEFINED] || !!validator[PPossibleErrorNames.NOT_UNDEFINED];
        }
        return false;
    }
    ngAfterContentInit() {
        this.initValues();
    }
    /**
     * Set some default values for properties that are not defined yet
     */
    initValues() {
        this.inputHasClassRoundedRight = !this.pEditable;
    }
    ngAfterContentChecked() {
    }
    /**
     * Set new selected member as value
     */
    onClickItem(id) {
        // this.animateSuccessButton();
        this.value = id;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    typeaheadOnSelect(input, pEditableTriggerFocussableRef) {
        this.value = input.item.id;
        $(pEditableTriggerFocussableRef).trigger('enter');
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    setFocus(pEditableTriggerFocussableRef) {
        $(pEditableTriggerFocussableRef).trigger('focus');
    }
    /** Is this valid? [valid]="…" overwrites the valid state if the formControl. */
    get isValid() {
        var _a;
        if (this.valid !== null)
            return this.valid;
        return !((_a = this.formControl) === null || _a === void 0 ? void 0 : _a.invalid);
    }
    /**
     * Transform input into fitting output format
     */
    stringToOutput(input) {
        const ID = this.getIdByInput(input);
        if (ID instanceof Id)
            return ID;
        return null;
    }
    /** Get keyup event from inside this component, and pass it on. */
    onKeyUp(event) {
        const output = this.stringToOutput(event.target.value);
        this._onChange(output);
        this.keyup.emit(event);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onBlur() { this.onTouched(); }
    /* eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/no-explicit-any */
    onChange(event) {
        const output = this.stringToOutput(event.target.value);
        this._onChange(output);
        this.change.emit(event);
    }
    /** the value of this control */
    get value() { return this._value; }
    set value(value) {
        if (value === this._value)
            return;
        this._value = value;
        this._onChange(value);
    }
    /** Write a new value to the element. */
    writeValue(value) {
        if (this._value === value)
            return;
        this._value = value;
        this.changeDetectorRef.detectChanges();
    }
    /**
     * @see ControlValueAccessor['registerOnChange']
     *
     * Note that registerOnChange() only gets called if a formControl is bound.
     * @param fn Accepts a callback function which you can call when changes happen so that you can notify the outside world that
     * the data model has changed.
     * Note that you call it with the changed data model value.
     */
    registerOnChange(fn) { this._onChange = fn; }
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
], PInputShiftModelIdComponent.prototype, "readMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputShiftModelIdComponent.prototype, "items", void 0);
__decorate([
    Input('required'),
    __metadata("design:type", Boolean)
], PInputShiftModelIdComponent.prototype, "_required", void 0);
__decorate([
    Input('placeholder'),
    __metadata("design:type", Object)
], PInputShiftModelIdComponent.prototype, "_placeholder", void 0);
__decorate([
    ViewChild(EditableDirective, { static: false }),
    __metadata("design:type", EditableDirective)
], PInputShiftModelIdComponent.prototype, "pEditableRef", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputShiftModelIdComponent.prototype, "icon", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputShiftModelIdComponent.prototype, "itemTemplate", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_d = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _d : Object)
], PInputShiftModelIdComponent.prototype, "focusout", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_e = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _e : Object)
], PInputShiftModelIdComponent.prototype, "focus", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputShiftModelIdComponent.prototype, "checkTouched", void 0);
__decorate([
    ViewChild('instance', { static: false }),
    __metadata("design:type", typeof (_f = typeof NgbTypeahead !== "undefined" && NgbTypeahead) === "function" ? _f : Object)
], PInputShiftModelIdComponent.prototype, "instance", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputShiftModelIdComponent.prototype, "pEditable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputShiftModelIdComponent.prototype, "api", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputShiftModelIdComponent.prototype, "valid", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputShiftModelIdComponent.prototype, "saveChangesHook", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputShiftModelIdComponent.prototype, "onSaveStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputShiftModelIdComponent.prototype, "onSaveSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputShiftModelIdComponent.prototype, "onDismiss", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputShiftModelIdComponent.prototype, "onLeaveCurrent", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputShiftModelIdComponent.prototype, "editMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PInputShiftModelIdComponent.prototype, "disabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputShiftModelIdComponent.prototype, "formControl", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_g = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _g : Object)
], PInputShiftModelIdComponent.prototype, "keyup", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_h = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _h : Object)
], PInputShiftModelIdComponent.prototype, "blur", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_j = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _j : Object)
], PInputShiftModelIdComponent.prototype, "change", void 0);
PInputShiftModelIdComponent = PInputShiftModelIdComponent_1 = __decorate([
    Component({
        selector: 'p-input-shiftmodel-id[items]',
        templateUrl: './p-input-shiftmodel-id.component.html',
        styleUrls: ['./p-input-shiftmodel-id.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PInputShiftModelIdComponent_1),
                multi: true,
            },
        ],
    }),
    __metadata("design:paramtypes", [LocalizePipe, typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object])
], PInputShiftModelIdComponent);
export { PInputShiftModelIdComponent };
//# sourceMappingURL=p-input-shiftmodel-id.component.js.map