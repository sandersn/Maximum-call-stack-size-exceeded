/**
 * This is a Component that is only used for the tests.
 */
var _a;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectorRef } from '@angular/core';
let CustomTextareaTestComponent = class CustomTextareaTestComponent {
    constructor(cd) {
        this.cd = cd;
        this._value = '';
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
CustomTextareaTestComponent = __decorate([
    Component({
        // eslint-disable-next-line literal-blacklist/literal-blacklist
        template: '<p-textarea [(ngModel)]="value"></p-textarea>',
        // template: `
        // 	<p-input-new [placeholder]="placeholder" [type]="type" [id]="id" [(ngModel)]="name"></p-input-new>
        // `,
        selector: 'p-custom-textarea-test-component',
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object])
], CustomTextareaTestComponent);
export { CustomTextareaTestComponent };
//# sourceMappingURL=p-textarea-test.component.js.map