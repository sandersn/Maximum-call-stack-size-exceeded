var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { LogService } from '@plano/shared/core/log.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
let PEditableBoxHeaderComponent = class PEditableBoxHeaderComponent {
    constructor() { }
};
PEditableBoxHeaderComponent = __decorate([
    Component({
        selector: 'p-editable-box-header',
        template: '<ng-content></ng-content>',
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], PEditableBoxHeaderComponent);
export { PEditableBoxHeaderComponent };
let PEditableBoxShowroomComponent = class PEditableBoxShowroomComponent {
    constructor() {
        this._alwaysTrue = true;
    }
};
__decorate([
    HostBinding('class.d-block'),
    HostBinding('class.w-100'),
    __metadata("design:type", Object)
], PEditableBoxShowroomComponent.prototype, "_alwaysTrue", void 0);
PEditableBoxShowroomComponent = __decorate([
    Component({
        selector: 'p-editable-box-showroom',
        template: '<ng-content></ng-content>',
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], PEditableBoxShowroomComponent);
export { PEditableBoxShowroomComponent };
let PEditableBoxFormComponent = class PEditableBoxFormComponent {
    constructor() {
        this._alwaysTrue = true;
    }
};
__decorate([
    HostBinding('class.d-block'),
    HostBinding('class.w-100'),
    __metadata("design:type", Object)
], PEditableBoxFormComponent.prototype, "_alwaysTrue", void 0);
PEditableBoxFormComponent = __decorate([
    Component({
        selector: 'p-editable-box-form',
        template: '<ng-content></ng-content>',
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], PEditableBoxFormComponent);
export { PEditableBoxFormComponent };
let PEditableBoxComponent = class PEditableBoxComponent {
    // public get isValid() : boolean {
    // 	return this.valid !== null ? this.valid : (!this.formControl || !this.formControl.invalid);
    // }
    constructor(changeDetectorRef, console) {
        this.changeDetectorRef = changeDetectorRef;
        this.console = console;
        this.showShowroom = false;
        this.boxEditMode = false;
        /**
         * If the box is initially invalid the form must be visible till the next boxEditMode update comes
         */
        this.initialInvalid = false;
        this.label = null;
        this.disabled = false;
        this.onRemoveItemClick = new EventEmitter();
        // These are necessary Inputs and Outputs for pEditable form-element
        this.pEditable = false;
        this.api = null;
        this.valid = null;
        this.onSaveStart = new EventEmitter();
        this.onSaveSuccess = new EventEmitter();
        this.onDismiss = new EventEmitter();
        this.onLeaveCurrent = new EventEmitter();
        this.editMode = new EventEmitter(undefined);
        this.PlanoFaIconPool = PlanoFaIconPool;
    }
    ngAfterViewInit() {
        this.initialInvalid = !this.valid;
        this.showShowroom = this.showroom.nativeElement.children.length > 0;
        this.changeDetectorRef.detectChanges();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    updateEditMode(event) {
        this.console.log('updateEditMode');
        this.boxEditMode = event;
        this.editMode.emit(event);
    }
};
__decorate([
    ViewChild('showroom', { static: true }),
    __metadata("design:type", typeof (_b = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _b : Object)
], PEditableBoxComponent.prototype, "showroom", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableBoxComponent.prototype, "label", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PEditableBoxComponent.prototype, "disabled", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], PEditableBoxComponent.prototype, "onRemoveItemClick", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableBoxComponent.prototype, "pEditable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableBoxComponent.prototype, "api", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableBoxComponent.prototype, "valid", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PEditableBoxComponent.prototype, "saveChangesHook", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PEditableBoxComponent.prototype, "onSaveStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PEditableBoxComponent.prototype, "onSaveSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PEditableBoxComponent.prototype, "onDismiss", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PEditableBoxComponent.prototype, "onLeaveCurrent", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PEditableBoxComponent.prototype, "editMode", void 0);
PEditableBoxComponent = __decorate([
    Component({
        selector: 'p-editable-box',
        templateUrl: './p-editable-box.component.html',
        styleUrls: ['./p-editable-box.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object, LogService])
], PEditableBoxComponent);
export { PEditableBoxComponent };
//# sourceMappingURL=p-editable-box.component.js.map