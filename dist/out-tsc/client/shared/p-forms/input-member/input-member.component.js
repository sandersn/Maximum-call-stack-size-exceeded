var InputMemberComponent_1;
var _a, _b, _c, _d, _e, _f, _g;
import { __decorate, __metadata } from "tslib";
import { NgZone, ChangeDetectionStrategy, Component, Input, forwardRef, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PWishesService } from '@plano/client/scheduling/wishes.service';
import { SchedulingApiAbsenceType, SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { AbsenceService } from '../../absence.service';
let InputMemberComponent = InputMemberComponent_1 = class InputMemberComponent {
    constructor(zone, absenceService, api, pWishesService, changeDetectorRef, rightsService) {
        this.zone = zone;
        this.absenceService = absenceService;
        this.api = api;
        this.pWishesService = pWishesService;
        this.changeDetectorRef = changeDetectorRef;
        this.rightsService = rightsService;
        this.searchTerm = null;
        this.control = null;
        this.members = null;
        this.isSelectMode = false;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.PApiPrimitiveTypes = PApiPrimitiveTypes;
        this.clicked = false;
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
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isValid() {
        return (!this.formControl || !this.formControl.invalid);
    }
    /**
     * set initial values
     */
    ngAfterContentInit() {
        this.isSelectMode = !this.value;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get membersForList() {
        var _a;
        let members = (_a = this.members) !== null && _a !== void 0 ? _a : this.api.data.members;
        members = members.filterBy((item) => !item.trashed);
        if (this.searchTerm)
            members = members.search(this.searchTerm);
        return members.iterableSortedBy([
            (item) => item.lastName,
            (item) => item.firstName,
            (item) => -this.pWishesService.getWish(item),
        ]);
    }
    /**
     * Icon of the members absence
     */
    absenceTypeIconName(memberId) {
        return this.absenceService.absenceTypeIconName(memberId, this.shift);
    }
    /**
     * Icon of the members absence
     */
    absenceType(memberId) {
        var _a;
        if ((_a = this.shift.assignedMembers.get(memberId)) === null || _a === void 0 ? void 0 : _a.trashed)
            return 'trashed';
        const type = this.absenceService.absenceType(memberId, this.shift);
        return type === SchedulingApiAbsenceType.OTHER ? null : type !== null && type !== void 0 ? type : null;
    }
    /**
     * Animate this input when value changes
     */
    animateSuccessButton() {
        this.clicked = true;
        this.waitForAnimation(() => {
            this.clicked = false;
        });
    }
    /**
     * Wait for animation
     */
    waitForAnimation(callback) {
        this.zone.runOutsideAngular(() => {
            window.setTimeout(() => {
                this.zone.run(() => {
                    callback();
                });
            }, 600);
        });
    }
    /**
     * Toggle if user is about to select a new/other member
     */
    toggleIsSelectMode() {
        if (this.disabled)
            return;
        if (!this.isSelectMode) {
            this.startSelectMode();
        }
        else {
            this.endSelectMode();
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    startSelectMode() {
        if (this.disabled)
            return;
        this.searchTerm = null;
        if (this.value)
            this.value = null;
        this.isSelectMode = true;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    endSelectMode() {
        if (this.disabled)
            return;
        this.searchTerm = this.value ? `${this.value.firstName} ${this.value.lastName}` : null;
        this.isSelectMode = false;
    }
    /**
     * Set new selected member as value
     */
    onClickMember(member) {
        this.animateSuccessButton();
        this.value = member;
        this.toggleIsSelectMode();
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
    registerOnChange(fn) {
        this.onChange = () => {
            fn(this.value);
        };
    }
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
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    isMe(member) {
        return !!this.rightsService.isMe(member.id);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], InputMemberComponent.prototype, "searchTerm", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], InputMemberComponent.prototype, "control", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], InputMemberComponent.prototype, "members", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_g = typeof SchedulingApiShift !== "undefined" && SchedulingApiShift) === "function" ? _g : Object)
], InputMemberComponent.prototype, "shift", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], InputMemberComponent.prototype, "disabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], InputMemberComponent.prototype, "formControl", void 0);
InputMemberComponent = InputMemberComponent_1 = __decorate([
    Component({
        selector: 'p-input-member[shift]',
        templateUrl: './input-member.component.html',
        styleUrls: ['./input-member.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => InputMemberComponent_1),
                multi: true,
            },
        ],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof NgZone !== "undefined" && NgZone) === "function" ? _a : Object, AbsenceService, typeof (_b = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _b : Object, typeof (_c = typeof PWishesService !== "undefined" && PWishesService) === "function" ? _c : Object, typeof (_d = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _d : Object, typeof (_e = typeof RightsService !== "undefined" && RightsService) === "function" ? _e : Object])
], InputMemberComponent);
export { InputMemberComponent };
//# sourceMappingURL=input-member.component.js.map