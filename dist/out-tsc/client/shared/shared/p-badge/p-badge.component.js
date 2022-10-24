var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { DecimalPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, HostBinding, Renderer2, ElementRef } from '@angular/core';
import { Input } from '@angular/core';
import { LogService } from '../../../../shared/core/log.service';
import { BootstrapSize, PThemeEnum } from '../../bootstrap-styles.enum';
let PBadgeComponent = class PBadgeComponent {
    constructor(renderer, element, decimalPipe, console) {
        this.renderer = renderer;
        this.element = element;
        this.decimalPipe = decimalPipe;
        this.console = console;
        this._alwaysTrue = true;
        this.isLoading = null;
        this.theme = PThemeEnum.DANGER;
        this.content = null;
        this.align = false;
        this.size = null;
    }
    get hasClassSmall() {
        return this.size === BootstrapSize.SM;
    }
    get hasClassLarge() {
        return this.size === BootstrapSize.LG;
    }
    get isEmpty() {
        return this.content === null || this.content === true;
    }
    ngAfterViewInit() {
        if (!this.element.nativeElement.classList.contains(`badge-${this.theme}`)) {
            this.renderer.addClass(this.element.nativeElement, `badge-${this.theme}`);
        }
        if (!this.element.nativeElement.classList.contains(`border-${this.borderColor}`)) {
            this.renderer.addClass(this.element.nativeElement, `border-${this.borderColor}`);
        }
        if (this.textColor && !this.element.nativeElement.classList.contains(`text-${this.textColor}`)) {
            this.renderer.addClass(this.element.nativeElement, `text-${this.textColor}`);
        }
        if (this.align && !this.element.nativeElement.classList.contains(`align-${this.align}`)) {
            this.renderer.addClass(this.element.nativeElement, `align-${this.align}`);
        }
        if (this.textColor === this.theme) {
            const content = this.content ? `Content: »${this.content}«` : '';
            this.console.error(`p-badge: Icon color AND theme is: »${this.icon}«. Icon is probably invisible. ${content}`);
        }
    }
    get borderColor() {
        if (this.icon === 'times')
            return PThemeEnum.DANGER;
        if (this.icon === 'check')
            return PThemeEnum.SUCCESS;
        return this.theme;
    }
    get textColor() {
        if (this.icon && this.borderColor !== this.theme)
            return this.borderColor;
        return undefined;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get icon() {
        if (typeof this.content === 'number') {
            return undefined;
        }
        if (this.content === 'times' || this.content === 'check' || this.content === 'question') {
            return this.content;
        }
        return undefined;
    }
    get noText() {
        return !this.text;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get text() {
        if (typeof this.content === 'boolean')
            return `&nbsp;`;
        if (typeof this.content === 'number')
            return this.decimalPipe.transform(this.content);
        if (typeof this.content === 'string')
            return this.content;
        return this.content;
    }
};
__decorate([
    HostBinding('class.border'),
    HostBinding('class.badge'),
    HostBinding('class.todo-badge'),
    __metadata("design:type", Object)
], PBadgeComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    HostBinding('class.text-skeleton-animated'),
    Input(),
    __metadata("design:type", Object)
], PBadgeComponent.prototype, "isLoading", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], PBadgeComponent.prototype, "theme", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PBadgeComponent.prototype, "content", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PBadgeComponent.prototype, "align", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PBadgeComponent.prototype, "size", void 0);
__decorate([
    HostBinding('class.small'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PBadgeComponent.prototype, "hasClassSmall", null);
__decorate([
    HostBinding('class.p-1'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PBadgeComponent.prototype, "hasClassLarge", null);
__decorate([
    HostBinding('class.empty'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PBadgeComponent.prototype, "isEmpty", null);
__decorate([
    HostBinding('class.no-text'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PBadgeComponent.prototype, "noText", null);
PBadgeComponent = __decorate([
    Component({
        selector: 'p-badge',
        templateUrl: './p-badge.component.html',
        styleUrls: ['./p-badge.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof Renderer2 !== "undefined" && Renderer2) === "function" ? _a : Object, typeof (_b = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _b : Object, typeof (_c = typeof DecimalPipe !== "undefined" && DecimalPipe) === "function" ? _c : Object, LogService])
], PBadgeComponent);
export { PBadgeComponent };
//# sourceMappingURL=p-badge.component.js.map