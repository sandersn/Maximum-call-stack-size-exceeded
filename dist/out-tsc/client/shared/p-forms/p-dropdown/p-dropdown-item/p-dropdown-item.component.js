var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { ElementRef } from '@angular/core';
import { AttributeInfoComponentBaseDirective } from '@plano/client/shared/p-attribute-info/attribute-info-component-base';
import { LogService } from '@plano/shared/core/log.service';
let PDropdownItemComponent = class PDropdownItemComponent extends AttributeInfoComponentBaseDirective {
    constructor(el, changeDetectorRef, console) {
        super(true, changeDetectorRef, console);
        this.el = el;
        this.changeDetectorRef = changeDetectorRef;
        this.console = console;
        this.attributeInfoRequired = false;
        /**
         * @deprecated use
         * <p-dropdown-item><fa-icon icon="pen"></fa-icon> Hello</p-dropdown-item>
         * instead of
         * <p-dropdown-item label="Hello" icon="pen"></p-dropdown-item>
         */
        this.icon = null;
        /**
         * @deprecated use
         * <p-dropdown-item>Hello</p-dropdown-item>
         * instead of
         * <p-dropdown-item label="Hello"></p-dropdown-item>
         */
        this.label = '';
        this.description = '';
        this.active = null;
        this._disabled = false;
        this.isLoading = false;
        this.onClick = new EventEmitter();
        /**
         * This id is used to find tabs by url param
         */
        this.urlName = null;
        /**
         * The bootstrap button style for this checkbox
         */
        this.theme = null;
    }
    /**
     * Is this dropdown-item disabled?
     */
    get disabled() {
        if (this.isLoading)
            return true;
        return this._disabled;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownItemComponent.prototype, "value", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownItemComponent.prototype, "icon", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownItemComponent.prototype, "label", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownItemComponent.prototype, "description", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownItemComponent.prototype, "active", void 0);
__decorate([
    Input('disabled'),
    __metadata("design:type", Boolean)
], PDropdownItemComponent.prototype, "_disabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownItemComponent.prototype, "isLoading", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PDropdownItemComponent.prototype, "onClick", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownItemComponent.prototype, "urlName", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDropdownItemComponent.prototype, "theme", void 0);
__decorate([
    ViewChild('innerTemplate'),
    __metadata("design:type", typeof (_c = typeof TemplateRef !== "undefined" && TemplateRef) === "function" ? _c : Object)
], PDropdownItemComponent.prototype, "innerTemplate", void 0);
PDropdownItemComponent = __decorate([
    Component({
        selector: 'p-dropdown-item',
        templateUrl: './p-dropdown-item.component.html',
        styleUrls: ['./p-dropdown-item.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _a : Object, typeof (_b = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _b : Object, LogService])
], PDropdownItemComponent);
export { PDropdownItemComponent };
//# sourceMappingURL=p-dropdown-item.component.js.map