var _a;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, EventEmitter, Output, Input, ChangeDetectorRef } from '@angular/core';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { getBase64Dimensions } from '@plano/shared/core/base64-utils';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../shared/core/null-type-utils';
import { PPossibleErrorNames } from '../../../../../shared/core/validators.types';
import { PFormControl } from '../../p-form-control';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const base64ToFile = (base64Image) => {
    const split = base64Image.split(',');
    const type = split[0].replace('data:', '').replace(';base64', '');
    const byteString = atob(split[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i += 1) {
        ia[i] = byteString.codePointAt(i);
    }
    return new Blob([ab], { type: type });
};
let PInputImageCropperComponent = class PInputImageCropperComponent {
    constructor(changeDetectorRef, console) {
        this.changeDetectorRef = changeDetectorRef;
        this.console = console;
        /**
         * A emitter to get the result out of this component.
         * Emits a base64 string.
         */
        this.croppedImageChange = new EventEmitter();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.imageChangedEvent = '';
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents */
        this.imageFile = '';
        this.PThemeEnum = PThemeEnum;
        this.CONFIG = Config;
        this.canvasRotation = 0;
        this.rotation = 0;
        this.scale = 1;
        this.showCropperComponent = false;
        this.croppingIsDisabled = true;
        this.transform = {};
        this.cropperImageDimensions = null;
        /**
         * The image that the user chose to upload/crop.
         * As Base64
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.originalImage = '';
        this.originalImageDimensions = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.croppedImage = '';
        this.croppedImageDimensions = null;
        this._aspectRatio = null;
    }
    /**
     * Cropped image will be resized to at most this width (in px)
     */
    get resizeToWidth() {
        if (this.originalImageDimensions) {
            if (this.originalImageDimensions.width > this.cropperMaxWidth)
                return this.cropperMaxWidth;
            return this.originalImageDimensions.width;
        }
        return null;
    }
    /**
     * Cropped image will be resized to at most this height (in px)
     */
    get resizeToHeight() {
        var _a;
        assumeDefinedToGetStrictNullChecksRunning(this.control.validatorObjects, 'this.control.validatorObjects');
        return (_a = this.control.validatorObjects[PPossibleErrorNames.IMAGE_MAX_HEIGHT]) === null || _a === void 0 ? void 0 : _a.comparedConst;
    }
    /**
     * The cropper cannot be made smaller than this number of pixels in width (relative to original image's size) (in px)
     */
    get cropperMinWidth() {
        var _a;
        assumeDefinedToGetStrictNullChecksRunning(this.control.validatorObjects, 'this.control.validatorObjects');
        return (_a = this.control.validatorObjects[PPossibleErrorNames.IMAGE_MIN_WIDTH]) === null || _a === void 0 ? void 0 : _a.comparedConst;
    }
    /**
     * The cropper cannot be made smaller than this number of pixels in height (relative to original image's size) (in px)
     */
    get cropperMinHeight() {
        var _a;
        assumeDefinedToGetStrictNullChecksRunning(this.control.validatorObjects, 'this.control.validatorObjects');
        return (_a = this.control.validatorObjects[PPossibleErrorNames.IMAGE_MIN_HEIGHT]) === null || _a === void 0 ? void 0 : _a.comparedConst;
    }
    /**
     * The cropper cannot be made smaller than this number of pixels in width (relative to original image's size) (in px)
     */
    get cropperMaxWidth() {
        var _a;
        assumeDefinedToGetStrictNullChecksRunning(this.control.validatorObjects, 'this.control.validatorObjects');
        return (_a = this.control.validatorObjects[PPossibleErrorNames.IMAGE_MAX_WIDTH]) === null || _a === void 0 ? void 0 : _a.comparedConst;
    }
    /**
     * Get the aspectRatio if such info is provided in any way.
     */
    get aspectRatio() {
        var _a, _b, _c;
        if (this._aspectRatio)
            return this._aspectRatio;
        // eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
        const calculatedNewAspectRatio = (_b = (_a = this.control.validatorObjects) === null || _a === void 0 ? void 0 : _a[PPossibleErrorNames.IMAGE_RATIO]) === null || _b === void 0 ? void 0 : _b.comparedConst;
        if (calculatedNewAspectRatio) {
            this._aspectRatio = ((_c = (typeof calculatedNewAspectRatio === 'function' ? calculatedNewAspectRatio() : calculatedNewAspectRatio)) !== null && _c !== void 0 ? _c : null);
            this.changeDetectorRef.markForCheck();
            return this._aspectRatio;
        }
        return null;
    }
    /**
     * When you choose a file from the file input, it will trigger fileChangeEvent.
     */
    fileChangeEvent(event) {
        this.imageChangedEvent = event;
    }
    /**
     * Emits an ImageCroppedEvent each time the image is cropped
     */
    imageCropped(event) {
        if (this.croppingIsDisabled)
            return;
        this.croppedImage = event.base64;
        this.control.setValue(this.croppedImage);
        this.control.updateValueAndValidity();
        assumeDefinedToGetStrictNullChecksRunning(event.base64, 'event.base64');
        this.croppedImageDimensions = getBase64Dimensions(event.base64);
    }
    /**
     * Emits the Image when it was loaded into the cropper
     */
    imageLoaded(loadedImage) {
        // Save the original base64 into a property so it can be validated.
        this.originalImage = loadedImage.original.base64;
        this.originalImageDimensions = {
            ...loadedImage.original.size,
        };
        this.croppingIsDisabled = (this.originalImageDimensions.width === this.cropperMinWidth &&
            this.originalImageDimensions.height === this.cropperMinHeight);
        this.showCropperComponent = true;
    }
    /**
     * Emits when the cropper is ready to be interacted. The Dimensions object that is returned contains the displayed image size
     */
    cropperReady(cropperImageDimensions) {
        this.cropperImageDimensions = cropperImageDimensions;
    }
    /**
     * Emits when a wrong file type was selected (only png, gif and jpg are allowed)
     */
    loadImageFailed() {
        this.console.error('Load failed');
    }
    /**
     * Rotates the image
     */
    rotate(input) {
        if (input === 'left') {
            this.canvasRotation--;
        }
        else {
            this.canvasRotation++;
        }
        // I don’t know why this is necessary
        this.flipAfterRotate();
    }
    /**
     * idk what this method does. it is copy paste.
     */
    flipAfterRotate() {
        const result = { ...this.transform };
        if (this.transform.flipH)
            result.flipH = this.transform.flipH;
        if (this.transform.flipV)
            result.flipV = this.transform.flipV;
        this.transform = result;
    }
    /**
     * Make right to left and left to right
     */
    flipHorizontal() {
        this.transform = {
            ...this.transform,
            flipH: !this.transform.flipH,
        };
    }
    /**
     * Make top to bottom and bottom to top
     */
    flipVertical() {
        this.transform = {
            ...this.transform,
            flipV: !this.transform.flipV,
        };
    }
    /**
     * Resets everything the user did in the cropper area.
     * In other words: Return to the original image.
     */
    resetImage() {
        this.scale = 1;
        this.rotation = 0;
        this.canvasRotation = 0;
        this.transform = {};
    }
    /**
     * User wants to see more and smaller pixels
     */
    zoomOut() {
        this.scale -= .1;
        this.transform = {
            ...this.transform,
            scale: this.scale,
        };
    }
    /**
     * User wants to see less and bigger pixels :D
     */
    zoomIn() {
        this.scale += .1;
        this.transform = {
            ...this.transform,
            scale: this.scale,
        };
    }
    /**
     * Rotate the image by (probably modified) attribute .rotation
     */
    updateRotation() {
        this.transform = {
            ...this.transform,
            rotate: this.rotation,
        };
    }
    /**
     * Check if the original image is wide enough.
     * The formControl contains the cropped image and the validators. But we don’t want to validate the cropped image.
     * So we execute the validators of formControl with the original image.
     */
    get imageMinWidthError() {
        var _a, _b, _c;
        if (!this.originalImageDimensions)
            return undefined;
        const expected = (_b = (_a = this.control.validatorObjects[PPossibleErrorNames.IMAGE_MIN_WIDTH]) === null || _a === void 0 ? void 0 : _a.comparedConst) !== null && _b !== void 0 ? _b : null;
        if (expected === null)
            return null;
        if (this.originalImageDimensions.width < expected)
            return {
                name: PPossibleErrorNames.IMAGE_MIN_WIDTH,
                primitiveType: PApiPrimitiveTypes.Image,
                actual: this.originalImageDimensions.width,
                expected: (_c = this.control.validatorObjects[PPossibleErrorNames.IMAGE_MIN_WIDTH]) === null || _c === void 0 ? void 0 : _c.comparedConst,
            };
        return null;
    }
    /**
     * Check if the original image is high enough.
     * The formControl contains the cropped image and the validators. But we don’t want to validate the cropped image.
     * So we execute the validators of formControl with the original image.
     */
    get imageMinHeightError() {
        var _a, _b, _c;
        if (!this.originalImageDimensions)
            return undefined;
        const expected = (_b = (_a = this.control.validatorObjects[PPossibleErrorNames.IMAGE_MIN_HEIGHT]) === null || _a === void 0 ? void 0 : _a.comparedConst) !== null && _b !== void 0 ? _b : null;
        if (expected === null)
            return null;
        if (this.originalImageDimensions.height < expected)
            return {
                name: PPossibleErrorNames.IMAGE_MIN_HEIGHT,
                primitiveType: PApiPrimitiveTypes.Image,
                actual: this.originalImageDimensions.height,
                expected: (_c = this.control.validatorObjects[PPossibleErrorNames.IMAGE_MIN_HEIGHT]) === null || _c === void 0 ? void 0 : _c.comparedConst,
            };
        return null;
    }
    /** Just some data that i show in UI if we are in debug mode. Makes developing this component easier */
    get debugData() {
        return JSON.stringify({
            original: this.originalImageDimensions,
            cropped: this.croppedImageDimensions,
            errors: this.control.errors,
        });
    }
};
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputImageCropperComponent.prototype, "croppedImageChange", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputImageCropperComponent.prototype, "imageChangedEvent", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputImageCropperComponent.prototype, "imageFile", void 0);
__decorate([
    Input(),
    __metadata("design:type", PFormControl)
], PInputImageCropperComponent.prototype, "control", void 0);
PInputImageCropperComponent = __decorate([
    Component({
        selector: 'p-input-image-cropper[control]',
        templateUrl: './input-image-cropper.component.html',
        styleUrls: ['./input-image-cropper.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object, LogService])
], PInputImageCropperComponent);
export { PInputImageCropperComponent };
//# sourceMappingURL=input-image-cropper.component.js.map