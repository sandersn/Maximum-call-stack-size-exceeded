var _a;
import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { Input } from '@angular/core';
export var SectionWhitespace;
(function (SectionWhitespace) {
    SectionWhitespace[SectionWhitespace["MEDIUM"] = 0] = "MEDIUM";
    SectionWhitespace[SectionWhitespace["NONE"] = 1] = "NONE";
    SectionWhitespace[SectionWhitespace["LG"] = 2] = "LG";
})(SectionWhitespace || (SectionWhitespace = {}));
let PFormSectionComponent = class PFormSectionComponent {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this._alwaysTrue = true;
        this.label = null;
        this.hasDanger = false;
        /**
         * Background color of the whole Section
         */
        this.background = null;
        /**
         * How much whitespace should there be horizontally?
         */
        this.whitespace = SectionWhitespace.LG;
    }
    ngAfterViewInit() {
        if (this.background !== null)
            this.elementRef.nativeElement.classList.add(`bg-${this.background}`);
        switch (this.whitespace) {
            case SectionWhitespace.MEDIUM:
                this.elementRef.nativeElement.classList.add('px-3', 'px-md-4', 'py-3');
                break;
            case SectionWhitespace.LG:
                this.elementRef.nativeElement.classList.add('px-4', 'px-md-5', 'py-4');
                break;
            case SectionWhitespace.NONE:
                this.elementRef.nativeElement.classList.add('p-0');
                break;
            default:
                break;
        }
    }
};
__decorate([
    HostBinding('class.d-block'),
    __metadata("design:type", Object)
], PFormSectionComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormSectionComponent.prototype, "label", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PFormSectionComponent.prototype, "hasDanger", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormSectionComponent.prototype, "background", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], PFormSectionComponent.prototype, "whitespace", void 0);
PFormSectionComponent = __decorate([
    Component({
        selector: 'p-section',
        templateUrl: './section.component.html',
        styleUrls: ['./section.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _a : Object])
], PFormSectionComponent);
export { PFormSectionComponent };
//# sourceMappingURL=section.component.js.map