var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectorRef, ChangeDetectionStrategy, EventEmitter, Output, HostBinding } from '@angular/core';
import { Input, ElementRef } from '@angular/core';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { AttributeInfoComponentBaseDirective } from '../../../p-attribute-info/attribute-info-component-base';
export var PTabSizeEnum;
(function (PTabSizeEnum) {
    PTabSizeEnum["LG"] = "lg";
    PTabSizeEnum["SM"] = "sm";
    PTabSizeEnum["FRAMELESS"] = "frameless";
})(PTabSizeEnum || (PTabSizeEnum = {}));
let PTabComponent = class PTabComponent extends AttributeInfoComponentBaseDirective {
    constructor(el, changeDetectorRef, console) {
        super(true, changeDetectorRef, console);
        this.el = el;
        this.changeDetectorRef = changeDetectorRef;
        this.console = console;
        this.attributeInfoRequired = false;
        this.label = null;
        this.hasDanger = false;
        this._badgeContent = null;
        this.hasFilter = null;
        this.initialActiveTab = false;
        this.icon = null;
        this.description = null;
        /* eslint-disable @angular-eslint/no-output-native */
        this.select = new EventEmitter();
        this._active = false;
        this.size = PTabSizeEnum.LG;
        /**
         * This id is used to find tabs by url param
         */
        this.urlName = null;
        this.hover = false;
    }
    get _p5() {
        return this.size === PTabSizeEnum.LG && !Config.IS_MOBILE;
    }
    get _p4() {
        return this.size === PTabSizeEnum.LG && Config.IS_MOBILE;
    }
    get _p3() {
        return this.size === PTabSizeEnum.SM;
    }
    get _p0() {
        return this.size === PTabSizeEnum.FRAMELESS;
    }
    get isHidden() {
        return !this.active;
    }
    /**
     * Should there be a little dot on this tab? Maybe with a icon or a number inside?
     */
    get badgeContent() {
        if (this._badgeContent !== null)
            return this._badgeContent;
        return this.hasDanger;
    }
    /**
     * Is this the currently selected tab?
     */
    get active() {
        return this._active;
    }
    /**
     * Should this be the initially/currently selected tab?
     */
    set active(input) {
        this.select.emit(input);
        this._active = input;
        this.changeDetectorRef.detectChanges();
    }
    ngAfterContentInit() {
        if (this.label === null && this.icon === null)
            throw new Error('[label] OR [icon] must be set in p-tab');
        return super.ngAfterContentInit();
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTabComponent.prototype, "label", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PTabComponent.prototype, "hasDanger", void 0);
__decorate([
    Input('badgeContent'),
    __metadata("design:type", Object)
], PTabComponent.prototype, "_badgeContent", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTabComponent.prototype, "hasFilter", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PTabComponent.prototype, "initialActiveTab", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTabComponent.prototype, "icon", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTabComponent.prototype, "description", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], PTabComponent.prototype, "select", void 0);
__decorate([
    HostBinding('class.flex-grow-1'),
    __metadata("design:type", Boolean)
], PTabComponent.prototype, "_active", void 0);
__decorate([
    HostBinding('class.p-5'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PTabComponent.prototype, "_p5", null);
__decorate([
    HostBinding('class.p-4'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PTabComponent.prototype, "_p4", null);
__decorate([
    HostBinding('class.p-3'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PTabComponent.prototype, "_p3", null);
__decorate([
    HostBinding('class.p-0'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PTabComponent.prototype, "_p0", null);
__decorate([
    Input(),
    __metadata("design:type", String)
], PTabComponent.prototype, "size", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTabComponent.prototype, "urlName", void 0);
__decorate([
    HostBinding('hidden'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PTabComponent.prototype, "isHidden", null);
PTabComponent = __decorate([
    Component({
        selector: 'p-tab',
        templateUrl: './p-tab.component.html',
        styleUrls: ['./p-tab.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _a : Object, typeof (_b = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _b : Object, LogService])
], PTabComponent);
export { PTabComponent };
//# sourceMappingURL=p-tab.component.js.map