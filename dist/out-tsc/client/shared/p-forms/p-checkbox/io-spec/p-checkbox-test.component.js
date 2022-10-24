/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/**
 * This is a Component that is only used for the tests.
 */
var _a;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectorRef } from '@angular/core';
let CustomCheckboxTestComponent = class CustomCheckboxTestComponent {
    constructor(cd) {
        this.cd = cd;
        this._checked = false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get checked() {
        return this._checked;
    }
    set checked(input) {
        this._checked = input;
        this.cd.detectChanges();
    }
};
CustomCheckboxTestComponent = __decorate([
    Component({
        // eslint-disable-next-line literal-blacklist/literal-blacklist
        template: '<p-checkbox [(ngModel)]="checked"></p-checkbox>',
        // template: `
        // 	<p-input-new [placeholder]="placeholder" [type]="type" [id]="id" [(ngModel)]="name"></p-input-new>
        // `,
        selector: 'p-custom-checkbox-test-component',
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object])
], CustomCheckboxTestComponent);
export { CustomCheckboxTestComponent };
//# sourceMappingURL=p-checkbox-test.component.js.map