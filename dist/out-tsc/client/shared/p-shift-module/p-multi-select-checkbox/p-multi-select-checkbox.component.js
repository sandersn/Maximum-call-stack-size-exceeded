var PMultiSelectCheckboxComponent_1;
var _a;
import { __decorate, __metadata } from "tslib";
import { Component, Input, HostBinding, forwardRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { SchedulingApiShiftMemberPrefValue } from '@plano/shared/api';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '../../../../shared/core/p-modal/modal.service';
import { BootstrapSize } from '../../bootstrap-styles.enum';
import { EditableDirective } from '../../p-editable/editable/editable.directive';
import { PCheckboxComponent } from '../../p-forms/p-checkbox/p-checkbox.component';
let PMultiSelectCheckboxComponent = PMultiSelectCheckboxComponent_1 = class PMultiSelectCheckboxComponent extends PCheckboxComponent {
    constructor(changeDetectorRef, console, pFormsService, modalService) {
        super(changeDetectorRef, console, pFormsService, modalService);
        this.attributeInfoRequired = false;
        this._alwaysTrue = true;
        this.hasMinWidth = '2em';
        this.meIsAssignable = false;
        this.myPref = null;
        this.wishPickerMode = false;
        this.earlyBirdMode = false;
        // NOTE: This causes problems when selecting items in shift-picker on mobile
        // this.onClick.subscribe((event : Event) => { event.stopPropagation(); });
        this.hasButtonStyle = false;
        this._size = BootstrapSize.SM;
        this._readMode = false;
    }
    get _bgWhite() {
        return !this.isColored;
    }
    get _enabled() {
        return !this.disabled;
    }
    get _hasBgSuccess() {
        return this.isWant;
    }
    get _hasBgWarning() {
        return this.isWarning;
    }
    get _hasBgDanger() {
        return this.isDanger;
    }
    get _hasBgDark() {
        return this.isDark;
    }
    ngAfterContentChecked() {
        this.textWhite = this.isColored;
        return super.ngAfterContentChecked();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isColored() {
        return (this.wishPickerMode &&
            !this.disabled &&
            this.meIsAssignable);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isDark() {
        return this.isColored && !this.myPref;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isWant() {
        return this.isColored && this.myPref === SchedulingApiShiftMemberPrefValue.WANT;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isWarning() {
        return this.isColored && this.myPref === SchedulingApiShiftMemberPrefValue.CAN;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isDanger() {
        return this.isColored && this.myPref === SchedulingApiShiftMemberPrefValue.CANNOT;
    }
    get _thereIsNoUsefulMultiSelectCase() {
        if (this.earlyBirdMode)
            return true;
        return false;
    }
};
__decorate([
    HostBinding('class.small'),
    HostBinding('class.justify-content-stretch'),
    __metadata("design:type", Boolean)
], PMultiSelectCheckboxComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    HostBinding('class.bg-white'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PMultiSelectCheckboxComponent.prototype, "_bgWhite", null);
__decorate([
    HostBinding('style.min-width'),
    __metadata("design:type", String)
], PMultiSelectCheckboxComponent.prototype, "hasMinWidth", void 0);
__decorate([
    HostBinding('class.not-disabled'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PMultiSelectCheckboxComponent.prototype, "_enabled", null);
__decorate([
    HostBinding('class.bg-success'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PMultiSelectCheckboxComponent.prototype, "_hasBgSuccess", null);
__decorate([
    HostBinding('class.bg-warning'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PMultiSelectCheckboxComponent.prototype, "_hasBgWarning", null);
__decorate([
    HostBinding('class.bg-danger'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PMultiSelectCheckboxComponent.prototype, "_hasBgDanger", null);
__decorate([
    HostBinding('class.bg-dark'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PMultiSelectCheckboxComponent.prototype, "_hasBgDark", null);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PMultiSelectCheckboxComponent.prototype, "meIsAssignable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PMultiSelectCheckboxComponent.prototype, "myPref", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PMultiSelectCheckboxComponent.prototype, "wishPickerMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PMultiSelectCheckboxComponent.prototype, "earlyBirdMode", void 0);
__decorate([
    HostBinding('class.d-none'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PMultiSelectCheckboxComponent.prototype, "_thereIsNoUsefulMultiSelectCase", null);
PMultiSelectCheckboxComponent = PMultiSelectCheckboxComponent_1 = __decorate([
    Component({
        selector: 'p-multi-select-checkbox',
        templateUrl: './../../p-forms/p-checkbox/p-checkbox.component.html',
        styleUrls: ['./../../p-forms/p-checkbox/p-checkbox.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PMultiSelectCheckboxComponent_1),
                multi: true,
            },
            EditableDirective,
        ],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object, LogService,
        PFormsService,
        ModalService])
], PMultiSelectCheckboxComponent);
export { PMultiSelectCheckboxComponent };
//# sourceMappingURL=p-multi-select-checkbox.component.js.map