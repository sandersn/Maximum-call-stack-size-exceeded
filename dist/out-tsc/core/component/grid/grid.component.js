var _a;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy, HostBinding, ElementRef } from '@angular/core';
import { Config } from '../../config';
import { LogService } from '../../log.service';
let GridComponent = class GridComponent {
    constructor(elementRef, console) {
        this.elementRef = elementRef;
        this.console = console;
        this.isLoading = false;
        this.justifyContent = null;
    }
    ngAfterContentInit() {
        if (Config.DEBUG)
            this.validateContent();
    }
    validateContent() {
        var _a;
        if (!this.elementRef.nativeElement.children.length)
            return;
        for (const child of this.elementRef.nativeElement.children) {
            if (child.classList.contains('col') || child.classList.value.match(/col-[\w-]*/))
                return;
            let hint = (_a = child.textContent) !== null && _a !== void 0 ? _a : child.classList.value;
            if (!hint)
                hint = `${child.innerHTML.slice(0, 100)}…`;
            this.console.error(`Ups. There is a child of a <p-grid> which has no col class. This may help to find it: ${hint}`);
        }
    }
    get _hasClassAlignItemsCenter() {
        return this.justifyContent === 'center';
    }
    get _hasClassAlignItemsStretch() {
        return this.justifyContent === 'stretch';
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], GridComponent.prototype, "isLoading", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], GridComponent.prototype, "justifyContent", void 0);
__decorate([
    HostBinding('class.align-items-center'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], GridComponent.prototype, "_hasClassAlignItemsCenter", null);
__decorate([
    HostBinding('class.align-items-stretch'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], GridComponent.prototype, "_hasClassAlignItemsStretch", null);
GridComponent = __decorate([
    Component({
        selector: 'p-grid',
        templateUrl: './grid.component.html',
        styleUrls: ['./grid.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _a : Object, LogService])
], GridComponent);
export { GridComponent };
//# sourceMappingURL=grid.component.js.map