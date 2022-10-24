var PInputImageComponent_1;
var _a, _b, _c, _d, _e, _f, _g, _h;
import { __decorate, __metadata } from "tslib";
import { Component, ElementRef, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import { forwardRef } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PPossibleErrorNames } from '@plano/shared/core/validators.types';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../shared/core/null-type-utils';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '../../bootstrap-styles.enum';
import { PFormControlComponentBaseDirective } from '../../p-attribute-info/attribute-info-component-base';
/**
 * This component is for images in forms.
 * To use it you need to bind a PFormControl to [formControl] which MUST have all validators with the names image*.
 * The initial value of the control can be a url to an image.
 * The value that gets set by user interaction will always be a base64 string.
 *
 * @example
 * 	<p-input-image
 * 		[formControl]="someFormControl"
 * 	></p-input-image>
 * @example
 * 	<p-input-image
 * 		[pEditable]="true"
 * 		[api]="api"
 * 		[formControl]="pFormsService.getByAI(formGroup, api.data.attributeInfoCompanyLogo)"
 * 	></p-input-image>
 */
let PInputImageComponent = PInputImageComponent_1 = class PInputImageComponent extends PFormControlComponentBaseDirective {
    constructor(element, console, localizePipe, changeDetectorRef, pFormsService, modalService) {
        super(false, changeDetectorRef, pFormsService, console);
        this.element = element;
        this.console = console;
        this.localizePipe = localizePipe;
        this.changeDetectorRef = changeDetectorRef;
        this.pFormsService = pFormsService;
        this.modalService = modalService;
        /**
         * Should the image be shown to the user?
         */
        this.showPreview = true;
        // These are necessary Inputs and Outputs for pEditable form-element
        this.pEditable = false;
        this.api = null;
        this.valid = null;
        this.onSaveStart = new EventEmitter();
        this.onSaveSuccess = new EventEmitter();
        this.onDismiss = new EventEmitter();
        this.onLeaveCurrent = new EventEmitter();
        this.editMode = new EventEmitter(undefined);
        this.checkTouched = false;
        /**
         * Template for the preview of the image.
         * If not set, a simple img tag will be shown.
         */
        this.previewTemplate = null;
        this.PThemeEnum = PThemeEnum;
        this.PBtnThemeEnum = PBtnThemeEnum;
        this._alwaysTrue = true;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.CONFIG = Config;
        this.modalServiceOptions = {
            size: BootstrapSize.LG,
        };
        this.previousValue = null;
        this._disabled = false;
        this.formControl = null;
        this._readMode = null;
        this._value = null;
        this._onChange = () => { };
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.keyup = new EventEmitter();
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.blur = new EventEmitter();
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.change = new EventEmitter();
        /** onTouched */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.onTouched = (_event) => { };
        this.imageAsBlob = null;
    }
    /** Is this valid? [valid]="…" overwrites the valid state if the formControl. */
    get isValid() {
        var _a;
        if (this.valid !== null)
            return this.valid;
        return !((_a = this.formControl) === null || _a === void 0 ? void 0 : _a.invalid);
    }
    ngAfterContentInit() {
        if (this.valid !== null)
            throw new Error('Not implemented yet');
        // if (this.active !== undefined) throw new Error('Not implemented yet');
        if (this.saveChangesHook !== undefined)
            throw new Error('Not implemented yet');
        if (!!this.onSaveStart.observers.length)
            throw new Error('Not implemented yet');
        if (!!this.onSaveSuccess.observers.length)
            throw new Error('Not implemented yet');
        if (!!this.onDismiss.observers.length)
            throw new Error('Not implemented yet');
        if (!!this.onLeaveCurrent.observers.length)
            throw new Error('Not implemented yet');
        if (!!this.editMode.observers.length)
            throw new Error('Not implemented yet');
        if (this.checkTouched !== false)
            throw new Error('Not implemented yet');
        // TODO: [PLANO-53381]
        if (!!this.cannotEditHint)
            throw new Error('cannotEditHint not implemented yet in this component. See PLANO-53381');
        if (!this.formControl)
            throw new Error('Currently it is not possible to use image-upload without [formControl]. Please make sure the formControl has the image* validators.');
        this.previousValue = this.value;
        this.modalServiceOptions = {
            success: (cropperRef) => {
                this.value = cropperRef.croppedImage;
                this.previousValue = this.value;
                // cropperRef.onSuccess();
                if (this.pEditable && this.api)
                    this.api.mergeDataCopy();
                if (this.pEditable && this.api)
                    this.api.save();
                this.imageAsBlob = null;
                assumeDefinedToGetStrictNullChecksRunning(this.fileInput, 'fileInput');
                this.fileInput.nativeElement.value = '';
                this.showPreview = true;
            },
            dismiss: () => {
                if (this.pEditable && this.api)
                    this.api.dismissDataCopy();
                this.value = this.previousValue;
                this.imageAsBlob = null;
                assumeDefinedToGetStrictNullChecksRunning(this.fileInput, 'fileInput');
                this.fileInput.nativeElement.value = '';
                this.fileChangeEvent();
                this.showPreview = true;
            },
            size: BootstrapSize.LG,
        };
        return super.ngAfterContentInit();
    }
    /**
     * This is the minimum code that is required for a custom control in Angular.
     * Its necessary to make [(ngModel)] and [formControl] work.
     */
    get disabled() {
        return this._disabled || !this.canEdit;
    }
    set disabled(input) {
        this._disabled = input;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get readMode() {
        if (this._readMode !== null)
            return this._readMode;
        return this.disabled;
    }
    /**
     * Is this a required field?
     * This can be set as Input() but if there is a formControl binding,
     * then it takes the info from the formControl’s validators.
     */
    get required() {
        var _a, _b, _c;
        if (!this.formControl)
            return false;
        return (_c = (_b = (_a = this.formControl).validator) === null || _b === void 0 ? void 0 : _b.call(_a, this.formControl)) === null || _c === void 0 ? void 0 : _c['required'];
    }
    /** Get keyup event from inside this component, and pass it on. */
    onKeyUp(event) { this._onChange(event.target.value); this.keyup.emit(event); }
    /** Get blur event from inside this component, and pass it on. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onBlur(event) {
        this.onTouched(event);
        this.blur.emit(event);
    }
    /** Get change event from inside this component, and pass it on. */
    onChange(event) {
        this._onChange(event.target.value);
        this.change.emit(event);
    }
    /** the value of this control */
    get value() { return this._value; }
    set value(value) {
        if (this._value === value)
            return;
        this._value = value;
        this.changeDetectorRef.markForCheck();
        // TODO: Still necessary? p-input don’t has this
        if (this.formControl) {
            this.formControl.markAsTouched();
            this.formControl.markAsDirty();
            this.formControl.updateValueAndValidity();
        }
        this._onChange(value);
    }
    /** Write a new value to the element. */
    writeValue(value) {
        if (this._value === value)
            return;
        // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
        this._value = value ? value : '';
        this.changeDetectorRef.markForCheck();
    }
    /**
     * @see ControlValueAccessor['registerOnChange']
     *
     * Note that registerOnChange() only gets called if a formControl is bound.
     * @param fn Accepts a callback function which you can call when changes happen so that you can notify the outside world that
     * the data model has changed.
     * Note that you call it with the changed data model value.
     */
    registerOnChange(fn) { this._onChange = fn; }
    /** Set the function to be called when the control receives a touch event. */
    registerOnTouched(fn) { this.onTouched = fn; }
    /** setDisabledState */
    setDisabledState(isDisabled) {
        if (this.disabled !== isDisabled)
            this.changeDetectorRef.markForCheck();
        this.disabled = isDisabled;
    }
    /** Filter all errors that should be shown in the ui. */
    get visibleErrors() {
        assumeNonNull(this.formControl);
        return this.pFormsService.visibleErrors(this.formControl);
    }
    /**
     * Set some date for the cropper and open the cropper.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fileChangeEvent(event, modalContent) {
        this.imageChangedEvent = event;
        if ((!event || !event.target.files.length) && (!this.imageAsBlob) || !modalContent)
            return;
        if (this.pEditable && this.api)
            this.api.createDataCopy();
        this.formControl.updateValueAndValidity();
        this.showPreview = false;
        this.modalService.openModal(modalContent, this.modalServiceOptions);
    }
    /**
     * Get image by url
     */
    getImage(imageUrl, _success) {
        return fetch(imageUrl);
    }
    /**
     * Open modal with current image
     */
    editImage() {
        this.getImage(this.value).then(result => result.blob()).then((blob) => {
            this.imageAsBlob = blob;
            assumeDefinedToGetStrictNullChecksRunning(this.fileInput, 'fileInput');
            this.fileInput.nativeElement.dispatchEvent(new Event('change'));
        });
    }
    /**
     * Clear the value
     */
    removeImage() {
        this.modalService.openDefaultModal({
            modalTitle: this.localizePipe.transform('Sicher?'),
            description: this.localizePipe.transform('Willst du das aktuelle Bild wirklich löschen?'),
            closeBtnLabel: this.localizePipe.transform('Ja'),
            dismissBtnLabel: this.localizePipe.transform('Abbrechen'),
            hideDismissBtn: false,
        }, {
            centered: true,
            size: BootstrapSize.SM,
            theme: PThemeEnum.DANGER,
            success: () => {
                this.value = '';
                this.previousValue = '';
                this.imageAsBlob = null;
                assumeDefinedToGetStrictNullChecksRunning(this.fileInput, 'fileInput');
                this.fileInput.nativeElement.value = '';
                if (this.pEditable && this.api)
                    this.api.save();
            },
        });
    }
    /**
     * Determine if the 'Add this image' button in the modal should be disabled.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    closeBtnDisabled(cropperRef) {
        assumeNonNull(this.formControl);
        if (!this.formControl.valid)
            return true;
        if (cropperRef.imageMinHeightError)
            return true;
        if (cropperRef.imageMinWidthError)
            return true;
        return false;
    }
    /**
     * Get min height from the data provided by backend.
     */
    get minHeight() {
        var _a;
        assumeNonNull(this.formControl);
        return (_a = this.formControl.validatorObjects[PPossibleErrorNames.IMAGE_MIN_HEIGHT]) === null || _a === void 0 ? void 0 : _a.comparedConst;
    }
    /**
     * Get min width from the data provided by backend.
     */
    get minWidth() {
        var _a;
        assumeNonNull(this.formControl);
        return (_a = this.formControl.validatorObjects[PPossibleErrorNames.IMAGE_MIN_WIDTH]) === null || _a === void 0 ? void 0 : _a.comparedConst;
    }
    /**
     * Get image ratio from the data provided by backend.
     */
    get imageRatio() {
        var _a;
        assumeNonNull(this.formControl);
        return (_a = this.formControl.validatorObjects[PPossibleErrorNames.IMAGE_RATIO]) === null || _a === void 0 ? void 0 : _a.comparedConst;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PInputImageComponent.prototype, "showPreview", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputImageComponent.prototype, "pEditable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputImageComponent.prototype, "api", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputImageComponent.prototype, "valid", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputImageComponent.prototype, "saveChangesHook", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputImageComponent.prototype, "onSaveStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputImageComponent.prototype, "onSaveSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputImageComponent.prototype, "onDismiss", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputImageComponent.prototype, "onLeaveCurrent", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputImageComponent.prototype, "editMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PInputImageComponent.prototype, "checkTouched", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputImageComponent.prototype, "previewTemplate", void 0);
__decorate([
    HostBinding('class.flex-grow-1'),
    __metadata("design:type", Object)
], PInputImageComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    ViewChild('fileInput'),
    __metadata("design:type", typeof (_d = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _d : Object)
], PInputImageComponent.prototype, "fileInput", void 0);
__decorate([
    ViewChild('modalContent', { static: true }),
    __metadata("design:type", typeof (_e = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _e : Object)
], PInputImageComponent.prototype, "modalContent", void 0);
__decorate([
    Input('disabled'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], PInputImageComponent.prototype, "disabled", null);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputImageComponent.prototype, "formControl", void 0);
__decorate([
    Input('readMode'),
    __metadata("design:type", Object)
], PInputImageComponent.prototype, "_readMode", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_f = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _f : Object)
], PInputImageComponent.prototype, "keyup", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_g = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _g : Object)
], PInputImageComponent.prototype, "blur", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_h = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _h : Object)
], PInputImageComponent.prototype, "change", void 0);
PInputImageComponent = PInputImageComponent_1 = __decorate([
    Component({
        selector: 'p-input-image',
        templateUrl: './input-image.component.html',
        styleUrls: ['./input-image.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PInputImageComponent_1),
                multi: true,
            },
        ],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _a : Object, LogService,
        LocalizePipe, typeof (_b = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _b : Object, PFormsService,
        ModalService])
], PInputImageComponent);
export { PInputImageComponent };
//# sourceMappingURL=input-image.component.js.map