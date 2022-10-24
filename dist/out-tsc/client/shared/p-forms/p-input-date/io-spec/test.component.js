/**
 * This is a Component that is only used for the tests.
 */
var _a;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectorRef } from '@angular/core';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { PInputDateTypes } from '../p-input-date.component';
let PInputDateTestComponent = class PInputDateTestComponent {
    constructor(cd) {
        this.cd = cd;
        this._value = '';
        // placeholder: string = 'custom placeholder';
        this.type = PInputDateTypes.deadline;
        this.min = null;
        this.max = null;
        this.locale = PSupportedLocaleIds.de_DE;
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
PInputDateTestComponent = __decorate([
    Component({
        templateUrl: './test.component.html',
        styleUrls: ['./test.component.scss'],
        selector: 'p-custom-input-test-component',
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object])
], PInputDateTestComponent);
export { PInputDateTestComponent };
//# sourceMappingURL=test.component.js.map