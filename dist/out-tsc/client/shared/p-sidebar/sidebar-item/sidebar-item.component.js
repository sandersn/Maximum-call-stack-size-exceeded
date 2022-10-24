var _a, _b, _c, _d, _e, _f;
import { __decorate, __metadata, __param } from "tslib";
import { Component, ChangeDetectionStrategy, Directive, TemplateRef, Inject, forwardRef } from '@angular/core';
import { Input } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { SchedulingApiService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
/**
 * Usage:
 * <p-sidebar-item>
 *   <div *sidebarItemHeader>Hallo</span>
 *   <div *sidebarItemContent>Content</div>
 * </p-sidebar-item>
 */
let SidebarItemComponent = class SidebarItemComponent {
    constructor(me, api) {
        this.me = me;
        this.api = api;
        this.onAdd = new EventEmitter();
        this.collapsed = false;
        this.collapsedChange = new EventEmitter();
        this.contentTemplate = null;
        this.headerTemplate = null;
        this.optionsTemplate = null;
        this.PlanoFaIconPool = PlanoFaIconPool;
    }
    get hasOnAddBinding() {
        return this.onAdd.observers.length > 0;
    }
};
__decorate([
    Output(),
    __metadata("design:type", typeof (_b = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _b : Object)
], SidebarItemComponent.prototype, "onAdd", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], SidebarItemComponent.prototype, "collapsed", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], SidebarItemComponent.prototype, "collapsedChange", void 0);
SidebarItemComponent = __decorate([
    Component({
        selector: 'p-sidebar-item',
        templateUrl: './sidebar-item.component.html',
        styleUrls: ['./sidebar-item.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [MeService, typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object])
], SidebarItemComponent);
export { SidebarItemComponent };
let SidebarItemHeaderDirective = class SidebarItemHeaderDirective {
    constructor(templateRef, parent) {
        this.templateRef = templateRef;
        this.parent = parent;
        this.parent.headerTemplate = this.templateRef;
    }
};
SidebarItemHeaderDirective = __decorate([
    Directive({
        /* eslint-disable-next-line @angular-eslint/directive-selector */
        selector: '[sidebarItemHeader]',
    }),
    __param(1, Inject(forwardRef(() => SidebarItemComponent))),
    __metadata("design:paramtypes", [typeof (_d = typeof TemplateRef !== "undefined" && TemplateRef) === "function" ? _d : Object, SidebarItemComponent])
], SidebarItemHeaderDirective);
export { SidebarItemHeaderDirective };
let SidebarItemContentDirective = class SidebarItemContentDirective {
    constructor(templateRef, parent) {
        this.templateRef = templateRef;
        this.parent = parent;
        this.parent.contentTemplate = this.templateRef;
    }
};
SidebarItemContentDirective = __decorate([
    Directive({
        /* eslint-disable-next-line @angular-eslint/directive-selector */
        selector: '[sidebarItemContent]',
    }),
    __param(1, Inject(forwardRef(() => SidebarItemComponent))),
    __metadata("design:paramtypes", [typeof (_e = typeof TemplateRef !== "undefined" && TemplateRef) === "function" ? _e : Object, SidebarItemComponent])
], SidebarItemContentDirective);
export { SidebarItemContentDirective };
let SidebarItemOptionsDirective = class SidebarItemOptionsDirective {
    constructor(templateRef, parent) {
        this.templateRef = templateRef;
        this.parent = parent;
        this.parent.optionsTemplate = this.templateRef;
    }
};
SidebarItemOptionsDirective = __decorate([
    Directive({
        /* eslint-disable-next-line @angular-eslint/directive-selector */
        selector: '[sidebarItemOptions]',
    }),
    __param(1, Inject(forwardRef(() => SidebarItemComponent))),
    __metadata("design:paramtypes", [typeof (_f = typeof TemplateRef !== "undefined" && TemplateRef) === "function" ? _f : Object, SidebarItemComponent])
], SidebarItemOptionsDirective);
export { SidebarItemOptionsDirective };
//# sourceMappingURL=sidebar-item.component.js.map