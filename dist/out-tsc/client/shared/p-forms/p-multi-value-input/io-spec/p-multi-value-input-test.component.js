var _a;
import { __decorate, __metadata } from "tslib";
/**
 * This is a Component that is only used for the tests.
 */
import { Component, ChangeDetectorRef } from '@angular/core';
import { PFormControl } from '../../p-form-control';
let CustomMultiValueInputTestComponent = class CustomMultiValueInputTestComponent {
    constructor(cd) {
        this.cd = cd;
        this.formControl = new PFormControl({});
        this._value = [];
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get value() {
        return this._value;
    }
    set value(input) {
        this._value = input;
        this.cd.detectChanges();
    }
};
CustomMultiValueInputTestComponent = __decorate([
    Component({
        template: `<p-multi-value-input
		[(ngModel)]="value"
		[formControl]="formControl"
	></p-multi-value-input>`,
        // template: `
        // 	<p-input-new [placeholder]="placeholder" [type]="type" [id]="id" [(ngModel)]="name"></p-input-new>
        // `,
        selector: 'p-multi-value-input-component',
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object])
], CustomMultiValueInputTestComponent);
export { CustomMultiValueInputTestComponent };
//# sourceMappingURL=p-multi-value-input-test.component.js.map