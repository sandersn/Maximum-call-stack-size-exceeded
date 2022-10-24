var PInputMemberIdComponent_1;
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
import { __decorate, __metadata } from "tslib";
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Subject, merge } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { Component, Input, ViewChild, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { EditableDirective } from '@plano/client/shared/p-editable/editable/editable.directive';
import { SchedulingApiMember } from '@plano/shared/api';
import { SchedulingApiMembers } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PPossibleErrorNames } from '@plano/shared/core/validators.types';
let PInputMemberIdComponent = PInputMemberIdComponent_1 = class PInputMemberIdComponent {
    constructor(localize, changeDetectorRef, rightsService) {
        this.localize = localize;
        this.changeDetectorRef = changeDetectorRef;
        this.rightsService = rightsService;
        this.readMode = false;
        this.allMembersIsAllowed = null;
        this._required = false;
        this._placeholder = null;
        this.icon = PlanoFaIconPool.ITEMS_MEMBER;
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.focusout = new EventEmitter();
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.focus = new EventEmitter();
        this.checkTouched = false;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.inputHasClassRoundedRight = null;
        // I am not quite sure how this works. It was copy paste ¯\_(ツ)_/¯ ^nn
        this.focus$ = new Subject();
        this.click$ = new Subject();
        this.search = (text$) => {
            const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
            const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !!(this.instance && !this.instance.isPopupOpen())));
            const inputFocus$ = this.focus$;
            return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(map((term) => {
                const members = this.members.search(term).filterBy(item => {
                    if (!item.trashed)
                        return true;
                    if (this.value && item.id.equals(this.value))
                        return true;
                    return false;
                });
                const result = members.iterableSortedBy(['lastName', 'firstName', 'trashed']) /* .slice(0, 9)*/;
                if (this.allMembersIsAllowed) {
                    const pseudoMember = new SchedulingApiMember(null, 0);
                    pseudoMember.firstName = this.localize.transform('Alle');
                    pseudoMember.lastName = this.localize.transform('Berechtigten');
                    result.push(pseudoMember);
                }
                return result;
            }));
        };
        this.formatter = (member = null) => {
            var _a;
            if (!member)
                return '';
            // eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
            if (!member.id)
                return '';
            // eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
            let result = (_a = member.firstName) !== null && _a !== void 0 ? _a : '';
            if (member.lastName) {
                if (result.length)
                    result += ' ';
                result += member.lastName;
            }
            return result;
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
        if (this.allMembersIsAllowed)
            return this.localize.transform('Alle Berechtigten');
        return undefined;
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
    get valueMember() {
        if (this._tempValue)
            return this._tempValue;
        return this.members.get(this.value);
    }
    set valueMember(input) {
        if (!input && this.allMembersIsAllowed) {
            this.value = null;
            this._tempValue = null;
            return;
        }
        if (input instanceof SchedulingApiMember) {
            this.value = input.id;
            this._tempValue = null;
        }
        else {
            this._tempValue = input;
            const ID = this.getMemberIdByInput(input);
            if (ID instanceof Id) {
                this._tempValue = null;
                this.onClickMember(ID);
                this.instance.dismissPopup();
            }
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    getMemberIdByInput(input) {
        const searchedMembers = this.members.filterBy(member => `${member.firstName.toLowerCase()} ${member.lastName.toLowerCase()}` === input.toLowerCase());
        if (searchedMembers.length > 0) {
            return searchedMembers.get(0).id;
        }
        return input;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get allMembers() {
        if (!this.allMembersIsAllowed)
            return undefined;
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
    onClickMember(memberId) {
        // this.animateSuccessButton();
        this.value = memberId;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    typeaheadOnSelect(input, pEditableTriggerFocussableRef) {
        this.value = input.item.id;
        $(pEditableTriggerFocussableRef).trigger('enter');
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    typeaheadOnBlur(input, pEditableTriggerFocussableRef) {
        this.value = input.item;
        $(pEditableTriggerFocussableRef).trigger('enter');
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    setFocus(pEditableTriggerFocussableRef) {
        $(pEditableTriggerFocussableRef).trigger('focus');
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    isMe(member) {
        var _a;
        return (_a = this.rightsService.isMe(member.id)) !== null && _a !== void 0 ? _a : false;
    }
    /** Is this valid? [valid]="…" overwrites the valid state if the formControl. */
    get isValid() {
        return this.valid !== null ? this.valid : (!this.formControl || !this.formControl.invalid);
    }
    /**
     * Transform input into fitting output format
     */
    stringToOutput(input) {
        const ID = this.getMemberIdByInput(input);
        if (ID instanceof Id)
            return ID;
        return null;
    }
    /** Get keyup event from inside this component, and pass it on. */
    onKeyUp(event) {
        let output = this.stringToOutput(event.target.value);
        if (!output)
            output = this.allMembersIsAllowed ? null : output;
        this._onChange(output);
        this.keyup.emit(event);
    }
    /** Get blur event from inside this component, and pass it on. */
    onBlur() { this.onTouched(); this.blur.emit(event); }
    /* eslint-disable-next-line jsdoc/require-jsdoc */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange(event) {
        let output = this.stringToOutput(event.target.value);
        if (!output)
            output = this.allMembersIsAllowed ? null : output;
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
    /**
     * Has a member been chosen?
     */
    get hasMemberValue() {
        if (!this.valueMember)
            return false;
        if (typeof this.valueMember === 'string')
            return false;
        return true;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputMemberIdComponent.prototype, "readMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_c = typeof SchedulingApiMembers !== "undefined" && SchedulingApiMembers) === "function" ? _c : Object)
], PInputMemberIdComponent.prototype, "members", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputMemberIdComponent.prototype, "allMembersIsAllowed", void 0);
__decorate([
    Input('required'),
    __metadata("design:type", Boolean)
], PInputMemberIdComponent.prototype, "_required", void 0);
__decorate([
    Input('placeholder'),
    __metadata("design:type", Object)
], PInputMemberIdComponent.prototype, "_placeholder", void 0);
__decorate([
    ViewChild(EditableDirective),
    __metadata("design:type", EditableDirective)
], PInputMemberIdComponent.prototype, "pEditableRef", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputMemberIdComponent.prototype, "icon", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_d = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _d : Object)
], PInputMemberIdComponent.prototype, "focusout", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_e = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _e : Object)
], PInputMemberIdComponent.prototype, "focus", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputMemberIdComponent.prototype, "checkTouched", void 0);
__decorate([
    ViewChild('instance'),
    __metadata("design:type", typeof (_f = typeof NgbTypeahead !== "undefined" && NgbTypeahead) === "function" ? _f : Object)
], PInputMemberIdComponent.prototype, "instance", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputMemberIdComponent.prototype, "pEditable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputMemberIdComponent.prototype, "api", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputMemberIdComponent.prototype, "valid", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputMemberIdComponent.prototype, "saveChangesHook", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputMemberIdComponent.prototype, "onSaveStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputMemberIdComponent.prototype, "onSaveSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputMemberIdComponent.prototype, "onDismiss", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputMemberIdComponent.prototype, "onLeaveCurrent", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputMemberIdComponent.prototype, "editMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PInputMemberIdComponent.prototype, "disabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputMemberIdComponent.prototype, "formControl", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_g = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _g : Object)
], PInputMemberIdComponent.prototype, "keyup", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_h = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _h : Object)
], PInputMemberIdComponent.prototype, "blur", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_j = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _j : Object)
], PInputMemberIdComponent.prototype, "change", void 0);
PInputMemberIdComponent = PInputMemberIdComponent_1 = __decorate([
    Component({
        selector: 'p-input-member-id[members]',
        templateUrl: './p-input-member-id.component.html',
        styleUrls: ['./p-input-member-id.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PInputMemberIdComponent_1),
                multi: true,
            },
        ],
    }),
    __metadata("design:paramtypes", [LocalizePipe, typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object, typeof (_b = typeof RightsService !== "undefined" && RightsService) === "function" ? _b : Object])
], PInputMemberIdComponent);
export { PInputMemberIdComponent };
//# sourceMappingURL=p-input-member-id.component.js.map