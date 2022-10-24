/**
 * This is a Component that is only used for the tests.
 */
var _a;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectorRef } from '@angular/core';
import { PApiPrimitiveTypes, PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
// import { AbstractControl } from '@angular/forms';
let PInputTestComponent = class PInputTestComponent {
    constructor(cd) {
        this.cd = cd;
        // public override ngAfterContentChecked() : void {
        // 	if (!this.formControl) throw new Error('formControl is required for CustomInputTestComponent');
        // }
        // protected formGroup : PFormGroup;
        // public get formControl() : AbstractControl { return this.formGroup.get('someControl'); }
        // public set formControl(input : AbstractControl) {
        // 	this.formGroup.removeControl('someControl');
        // 	this.formGroup.addControl('someControl', input);
        // }
        this._value = null;
        this.placeholder = 'custom placeholder';
        this.type = PApiPrimitiveTypes.string;
        this.id = 'custom_id';
        this.locale = PSupportedLocaleIds.de_DE;
        this.durationUIType = null;
        // this.formGroup = new PFormGroup({});
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get value() {
        return this._value;
    }
    set value(input) {
        this._value = input;
        this.cd.detectChanges();
    }
};
PInputTestComponent = __decorate([
    Component({
        templateUrl: './test.component.html',
        styleUrls: ['./test.component.scss'],
        selector: 'p-custom-input-test-component',
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object])
], PInputTestComponent);
export { PInputTestComponent };
//# sourceMappingURL=test.component.js.map