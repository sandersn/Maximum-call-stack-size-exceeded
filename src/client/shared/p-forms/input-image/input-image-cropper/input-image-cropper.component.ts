import { Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { LoadedImage } from 'ngx-image-cropper/lib/services/load-image.service';
import { Component, ChangeDetectionStrategy, EventEmitter, Output, Input, ChangeDetectorRef } from '@angular/core';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { getBase64Dimensions } from '@plano/shared/core/base64-utils';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../shared/core/null-type-utils';
import { PPossibleErrorNames } from '../../../../../shared/core/validators.types';
import { PValidationErrorValue } from '../../../../../shared/core/validators.types';
import { PFormControl } from '../../p-form-control';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const base64ToFile = (base64Image : string) : Blob => {
	const split = base64Image.split(',');
	const type = split[0].replace('data:', '').replace(';base64', '');
	const byteString = atob(split[1]);
	const ab = new ArrayBuffer(byteString.length);
	const ia = new Uint8Array(ab);
	for (let i = 0; i < byteString.length; i += 1) {
		ia[i] = byteString.codePointAt(i)!;
	}
	return new Blob([ab], {type: type});
};

@Component({
	selector: 'p-input-image-cropper[control]',
	templateUrl: './input-image-cropper.component.html',
	styleUrls: ['./input-image-cropper.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PInputImageCropperComponent {

	/**
	 * A emitter to get the result out of this component.
	 * Emits a base64 string.
	 */
	@Output() public croppedImageChange = new EventEmitter<string>();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	@Input() public imageChangedEvent : any = '';

	/* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents */
	@Input() public imageFile : any | null = '';

	constructor(
		private changeDetectorRef : ChangeDetectorRef,
		private console : LogService,
	) {
	}

	public PThemeEnum = PThemeEnum;

	public CONFIG = Config;

	public canvasRotation = 0;
	public rotation = 0;
	public scale = 1;
	public showCropperComponent = false;
	public croppingIsDisabled = true;
	public transform : ImageTransform = {};
	public cropperImageDimensions : Dimensions | null = null;


	/**
	 * The image that the user chose to upload/crop.
	 * As Base64
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public originalImage : any = '';
	public originalImageDimensions : Dimensions | null = null;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public croppedImage : any = '';
	public croppedImageDimensions : Dimensions | null = null;

	/**
	 * Cropped image will be resized to at most this width (in px)
	 */
	public get resizeToWidth() : number | null {
		if (this.originalImageDimensions) {
			if (this.originalImageDimensions.width > this.cropperMaxWidth) return this.cropperMaxWidth;
			return this.originalImageDimensions.width;
		}
		return null;
	}

	/**
	 * Cropped image will be resized to at most this height (in px)
	 */
	public get resizeToHeight() : number {
		assumeDefinedToGetStrictNullChecksRunning(this.control.validatorObjects, 'this.control.validatorObjects');
		return this.control.validatorObjects[PPossibleErrorNames.IMAGE_MAX_HEIGHT]?.comparedConst as number;
	}

	/**
	 * The cropper cannot be made smaller than this number of pixels in width (relative to original image's size) (in px)
	 */
	public get cropperMinWidth() : number {
		assumeDefinedToGetStrictNullChecksRunning(this.control.validatorObjects, 'this.control.validatorObjects');
		return this.control.validatorObjects[PPossibleErrorNames.IMAGE_MIN_WIDTH]?.comparedConst as number;
	}

	/**
	 * The cropper cannot be made smaller than this number of pixels in height (relative to original image's size) (in px)
	 */
	public get cropperMinHeight() : number {
		assumeDefinedToGetStrictNullChecksRunning(this.control.validatorObjects, 'this.control.validatorObjects');
		return this.control.validatorObjects[PPossibleErrorNames.IMAGE_MIN_HEIGHT]?.comparedConst as number;
	}

	/**
	 * The cropper cannot be made smaller than this number of pixels in width (relative to original image's size) (in px)
	 */
	public get cropperMaxWidth() : number {
		assumeDefinedToGetStrictNullChecksRunning(this.control.validatorObjects, 'this.control.validatorObjects');
		return this.control.validatorObjects[PPossibleErrorNames.IMAGE_MAX_WIDTH]?.comparedConst as number;
	}

	private _aspectRatio : number | null = null;

	/**
	 * Get the aspectRatio if such info is provided in any way.
	 */
	public get aspectRatio() : number | null {
		if (this._aspectRatio) return this._aspectRatio;
		// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
		const calculatedNewAspectRatio = this.control.validatorObjects?.[PPossibleErrorNames.IMAGE_RATIO]?.comparedConst;
		if (calculatedNewAspectRatio) {
			this._aspectRatio = ((typeof calculatedNewAspectRatio === 'function' ? calculatedNewAspectRatio() : calculatedNewAspectRatio) ?? null) as number | null;
			this.changeDetectorRef.markForCheck();
			return this._aspectRatio;
		}
		return null;
	}

	/**
	 * When you choose a file from the file input, it will trigger fileChangeEvent.
	 */
	public fileChangeEvent(event : unknown) : void {
		this.imageChangedEvent = event;
	}

	/**
	 * Emits an ImageCroppedEvent each time the image is cropped
	 */
	public imageCropped(event : ImageCroppedEvent) : void {
		if (this.croppingIsDisabled) return;
		this.croppedImage = event.base64;
		this.control.setValue(this.croppedImage);
		this.control.updateValueAndValidity();
		assumeDefinedToGetStrictNullChecksRunning(event.base64, 'event.base64');
		this.croppedImageDimensions = getBase64Dimensions(event.base64);
	}

	/**
	 * Emits the Image when it was loaded into the cropper
	 */
	public imageLoaded(loadedImage : LoadedImage) : void {
		// Save the original base64 into a property so it can be validated.
		this.originalImage = loadedImage.original.base64;
		this.originalImageDimensions = {
			...loadedImage.original.size,
		};
		this.croppingIsDisabled = (
			this.originalImageDimensions.width === this.cropperMinWidth &&
			this.originalImageDimensions.height === this.cropperMinHeight
		);
		this.showCropperComponent = true;
	}

	/**
	 * Emits when the cropper is ready to be interacted. The Dimensions object that is returned contains the displayed image size
	 */
	public cropperReady(cropperImageDimensions : Dimensions) : void {
		this.cropperImageDimensions = cropperImageDimensions;
	}

	/**
	 * Emits when a wrong file type was selected (only png, gif and jpg are allowed)
	 */
	public loadImageFailed() : void {
		this.console.error('Load failed');
	}

	/**
	 * Rotates the image
	 */
	public rotate(input : 'left' | 'right') : void {
		if (input === 'left') {
			this.canvasRotation--;
		} else {
			this.canvasRotation++;
		}
		// I don’t know why this is necessary
		this.flipAfterRotate();
	}

	/**
	 * idk what this method does. it is copy paste.
	 */
	private flipAfterRotate() : void {
		const result : ImageTransform = { ...this.transform };
		if (this.transform.flipH) result.flipH = this.transform.flipH;
		if (this.transform.flipV) result.flipV = this.transform.flipV;
		this.transform = result;
	}

	/**
	 * Make right to left and left to right
	 */
	public flipHorizontal() : void {
		this.transform = {
			...this.transform,
			flipH: !this.transform.flipH,
		};
	}

	/**
	 * Make top to bottom and bottom to top
	 */
	public flipVertical() : void {
		this.transform = {
			...this.transform,
			flipV: !this.transform.flipV,
		};
	}

	/**
	 * Resets everything the user did in the cropper area.
	 * In other words: Return to the original image.
	 */
	public resetImage() : void {
		this.scale = 1;
		this.rotation = 0;
		this.canvasRotation = 0;
		this.transform = {};
	}

	/**
	 * User wants to see more and smaller pixels
	 */
	public zoomOut() : void {
		this.scale -= .1;
		this.transform = {
			...this.transform,
			scale: this.scale,
		};
	}

	/**
	 * User wants to see less and bigger pixels :D
	 */
	public zoomIn() : void {
		this.scale += .1;
		this.transform = {
			...this.transform,
			scale: this.scale,
		};
	}

	/**
	 * Rotate the image by (probably modified) attribute .rotation
	 */
	public updateRotation() : void {
		this.transform = {
			...this.transform,
			rotate: this.rotation,
		};
	}

	@Input() public control ! : PFormControl;

	/**
	 * Check if the original image is wide enough.
	 * The formControl contains the cropped image and the validators. But we don’t want to validate the cropped image.
	 * So we execute the validators of formControl with the original image.
	 */
	public get imageMinWidthError() : PValidationErrorValue | undefined | null {
		if (!this.originalImageDimensions) return undefined;
		const expected = this.control.validatorObjects[PPossibleErrorNames.IMAGE_MIN_WIDTH]?.comparedConst ?? null;
		if (expected === null) return null;
		if (this.originalImageDimensions.width < expected) return {
			name: PPossibleErrorNames.IMAGE_MIN_WIDTH,
			primitiveType: PApiPrimitiveTypes.Image,
			actual: this.originalImageDimensions.width,
			expected: this.control.validatorObjects[PPossibleErrorNames.IMAGE_MIN_WIDTH]?.comparedConst,
		};
		return null;
	}

	/**
	 * Check if the original image is high enough.
	 * The formControl contains the cropped image and the validators. But we don’t want to validate the cropped image.
	 * So we execute the validators of formControl with the original image.
	 */
	public get imageMinHeightError() : PValidationErrorValue | undefined | null {
		if (!this.originalImageDimensions) return undefined;
		const expected = this.control.validatorObjects[PPossibleErrorNames.IMAGE_MIN_HEIGHT]?.comparedConst ?? null;
		if (expected === null) return null;
		if (this.originalImageDimensions.height < expected) return {
			name: PPossibleErrorNames.IMAGE_MIN_HEIGHT,
			primitiveType: PApiPrimitiveTypes.Image,
			actual: this.originalImageDimensions.height,
			expected: this.control.validatorObjects[PPossibleErrorNames.IMAGE_MIN_HEIGHT]?.comparedConst,
		};
		return null;
	}

	/** Just some data that i show in UI if we are in debug mode. Makes developing this component easier */
	public get debugData() : string {
		return JSON.stringify({
			original: this.originalImageDimensions,
			cropped: this.croppedImageDimensions,
			errors: this.control.errors,
		});
	}
}
