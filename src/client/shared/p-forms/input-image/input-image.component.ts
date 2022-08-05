import { AfterContentInit} from '@angular/core';
import { Component, ElementRef, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { Input } from '@angular/core';
import { forwardRef } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor} from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { VisibleErrorsType } from '@plano/client/service/p-forms.service';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { EditableControlInterface, EditableDirective } from '@plano/client/shared/p-editable/editable/editable.directive';
import { SchedulingApiService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { ModalServiceOptions } from '@plano/shared/core/p-modal/modal.service.options';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PPossibleErrorNames } from '@plano/shared/core/validators.types';
import { PInputImageCropperComponent } from './input-image-cropper/input-image-cropper.component';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../shared/core/null-type-utils';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '../../bootstrap-styles.enum';
import { PFormControlComponentBaseDirective } from '../../p-attribute-info/attribute-info-component-base';
import { PFormControl } from '../p-form-control';
import { PFormControlComponentInterface } from '../p-form-control.interface';

type ValueType = string;

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
@Component({
	selector: 'p-input-image',
	templateUrl: './input-image.component.html',
	styleUrls: ['./input-image.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PInputImageComponent),
			multi: true,
		},
	],
})
export class PInputImageComponent extends PFormControlComponentBaseDirective
	implements ControlValueAccessor, AfterContentInit, EditableControlInterface, PFormControlComponentInterface {

	/**
	 * Should the image be shown to the user?
	 */
	@Input() public showPreview : boolean = true;

	// These are necessary Inputs and Outputs for pEditable form-element
	@Input() public pEditable : EditableControlInterface['pEditable'] = false;
	@Input() public api : EditableControlInterface['api'] = null;
	@Input() public valid : EditableControlInterface['valid'] = null;
	// This should not be necessary
	@Input() public saveChangesHook ?: EditableControlInterface['saveChangesHook'];
	@Output() public onSaveStart : EditableControlInterface['onSaveStart'] = new EventEmitter();
	@Output() public onSaveSuccess : EditableControlInterface['onSaveSuccess'] = new EventEmitter();
	@Output() public onDismiss : EditableDirective['onDismiss'] = new EventEmitter();
	@Output() public onLeaveCurrent : EditableControlInterface['onLeaveCurrent'] = new EventEmitter();
	@Output() public editMode : EditableControlInterface['editMode'] = new EventEmitter<boolean>(undefined);

	/** Is this valid? [valid]="…" overwrites the valid state if the formControl. */
	public get isValid() : boolean {
		if (this.valid !== null) return this.valid;
		return !this.formControl?.invalid;
	}

	@Input() public checkTouched : boolean = false;

	/**
	 * Template for the preview of the image.
	 * If not set, a simple img tag will be shown.
	 */
	@Input() public previewTemplate : TemplateRef<unknown> | null = null;

	constructor(
		public element : ElementRef<HTMLElement>,
		protected override console : LogService,
		private localizePipe : LocalizePipe,
		protected override changeDetectorRef : ChangeDetectorRef,
		protected override pFormsService : PFormsService,
		private modalService : ModalService,
	) {
		super(false, changeDetectorRef, pFormsService, console);
	}

	public PThemeEnum = PThemeEnum;
	public PBtnThemeEnum = PBtnThemeEnum;

	@HostBinding('class.flex-grow-1') protected _alwaysTrue = true;

	@ViewChild('fileInput') public fileInput ?: ElementRef<HTMLInputElement>;
	@ViewChild('modalContent', { static: true }) public modalContent ! : ElementRef<HTMLElement>;

	public PlanoFaIconPool = PlanoFaIconPool;

	public readonly CONFIG : typeof Config = Config;

	private modalServiceOptions : ModalServiceOptions = {
		size: BootstrapSize.LG,
	};

	private previousValue : string | null = null;

	public override ngAfterContentInit() : never {

		if (this.valid !== null) throw new Error('Not implemented yet');
		// if (this.active !== undefined) throw new Error('Not implemented yet');
		if (this.saveChangesHook !== undefined) throw new Error('Not implemented yet');
		if (!!this.onSaveStart.observers.length) throw new Error('Not implemented yet');
		if (!!this.onSaveSuccess.observers.length) throw new Error('Not implemented yet');
		if (!!this.onDismiss.observers.length) throw new Error('Not implemented yet');
		if (!!this.onLeaveCurrent.observers.length) throw new Error('Not implemented yet');
		if (!!this.editMode.observers.length) throw new Error('Not implemented yet');
		if (this.checkTouched !== false) throw new Error('Not implemented yet');

		// TODO: [PLANO-53381]
		if (!!this.cannotEditHint) throw new Error('cannotEditHint not implemented yet in this component. See PLANO-53381');

		if (!this.formControl) throw new Error('Currently it is not possible to use image-upload without [formControl]. Please make sure the formControl has the image* validators.');

		this.previousValue = this.value;
		this.modalServiceOptions = {
			success: (cropperRef : PInputImageCropperComponent) => {
				this.value = cropperRef.croppedImage;
				this.previousValue = this.value;
				// cropperRef.onSuccess();
				if (this.pEditable && this.api) (this.api as SchedulingApiService).mergeDataCopy();
				if (this.pEditable && this.api) (this.api as SchedulingApiService).save();
				this.imageAsBlob = null;
				assumeDefinedToGetStrictNullChecksRunning(this.fileInput, 'fileInput');
				this.fileInput.nativeElement.value = '';
				this.showPreview = true;
			},
			dismiss: () => {
				if (this.pEditable && this.api) (this.api as SchedulingApiService).dismissDataCopy();
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

	public _disabled : boolean = false;

	/**
	 * This is the minimum code that is required for a custom control in Angular.
	 * Its necessary to make [(ngModel)] and [formControl] work.
	 */
	public get disabled() : boolean {
		return this._disabled || !this.canEdit;
	}
	@Input('disabled') public set disabled(input : boolean) {
		this._disabled = input;
	}

	@Input() public override formControl : PFormControl | null = null;

	@Input('readMode') private _readMode : PFormControlComponentInterface['readMode'] = null;
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get readMode() : PFormControlComponentInterface['readMode'] {
		if (this._readMode !== null) return this._readMode;
		return this.disabled;
	}

	/**
	 * Is this a required field?
	 * This can be set as Input() but if there is a formControl binding,
	 * then it takes the info from the formControl’s validators.
	 */
	public get required() : boolean {
		if (!this.formControl) return false;
		return this.formControl.validator?.(this.formControl)?.['required'];
	}

	private _value : ValueType | null = null;
	public override _onChange : (value : ValueType | null) => void = () => {};
	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public keyup : EventEmitter<Event> = new EventEmitter<Event>();

	/** Get keyup event from inside this component, and pass it on. */
	public onKeyUp(event : KeyboardEvent) : void { this._onChange((event.target as HTMLInputElement).value); this.keyup.emit(event); }
	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public blur : EventEmitter<Event> = new EventEmitter<Event>();

	/** Get blur event from inside this component, and pass it on. */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public onBlur(event : any) : void {
		this.onTouched(event);
		this.blur.emit(event);
	}
	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public change : EventEmitter<Event> = new EventEmitter<Event>();

	/** Get change event from inside this component, and pass it on. */
	public onChange(event : Event) : void {
		this._onChange((event.target as HTMLInputElement).value);
		this.change.emit(event);
	}

	/** onTouched */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public onTouched = (_event : any) : void => {};

	/** the value of this control */
	public get value() : ValueType | null { return this._value; }
	public set value(value : ValueType | null) {
		if (this._value === value) return;

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
	public writeValue(value : ValueType) : void {
		if (this._value === value) return;
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
	public registerOnChange(fn : (value : ValueType | null) => void) : ReturnType<ControlValueAccessor['registerOnChange']> { this._onChange = fn; }

	/** Set the function to be called when the control receives a touch event. */
	public registerOnTouched(fn : () => void) : void { this.onTouched = fn; }

	/** setDisabledState */
	public setDisabledState(isDisabled : boolean) : void {
		if (this.disabled !== isDisabled) this.changeDetectorRef.markForCheck();
		this.disabled = isDisabled;
	}

	/** Filter all errors that should be shown in the ui. */
	public get visibleErrors() : VisibleErrorsType {
		assumeNonNull(this.formControl);
		return this.pFormsService.visibleErrors(this.formControl);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public imageChangedEvent : any;

	/**
	 * Set some date for the cropper and open the cropper.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public fileChangeEvent(event ?: Event, modalContent ?: any) : void {
		this.imageChangedEvent = event;
		if ((!event || !(event.target as HTMLInputElement).files!.length) && (!this.imageAsBlob) || !modalContent) return;
		if (this.pEditable && this.api) (this.api as SchedulingApiService).createDataCopy();
		this.formControl!.updateValueAndValidity();

		this.showPreview = false;
		this.modalService.openModal(modalContent, this.modalServiceOptions);
	}

	/**
	 * Get image by url
	 */
	public getImage(imageUrl : string, _success ?: () => void) : Promise<Response> {
		return fetch(imageUrl);
	}

	public imageAsBlob : Blob | null = null;

	/**
	 * Open modal with current image
	 */
	public editImage() : void {
		this.getImage(this.value!).then(result => result.blob()).then((blob) => {
			this.imageAsBlob = blob;
			assumeDefinedToGetStrictNullChecksRunning(this.fileInput, 'fileInput');
			this.fileInput.nativeElement.dispatchEvent(new Event('change'));
		});
	}

	/**
	 * Clear the value
	 */
	public removeImage() : void {
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
				if (this.pEditable && this.api) (this.api as SchedulingApiService).save();
			},
		});
	}

	/**
	 * Determine if the 'Add this image' button in the modal should be disabled.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public closeBtnDisabled(cropperRef : { imageMinHeightError : any; imageMinWidthError : any; }) : boolean {
		assumeNonNull(this.formControl);
		if (!this.formControl.valid) return true;
		if (cropperRef.imageMinHeightError) return true;
		if (cropperRef.imageMinWidthError) return true;
		return false;
	}

	/**
	 * Get min height from the data provided by backend.
	 */
	public get minHeight() : number {
		assumeNonNull(this.formControl);
		return this.formControl.validatorObjects[PPossibleErrorNames.IMAGE_MIN_HEIGHT]?.comparedConst as number;
	}

	/**
	 * Get min width from the data provided by backend.
	 */
	public get minWidth() : number {
		assumeNonNull(this.formControl);
		return this.formControl.validatorObjects[PPossibleErrorNames.IMAGE_MIN_WIDTH]?.comparedConst as number;
	}

	/**
	 * Get image ratio from the data provided by backend.
	 */
	public get imageRatio() : number {
		assumeNonNull(this.formControl);
		return this.formControl.validatorObjects[PPossibleErrorNames.IMAGE_RATIO]?.comparedConst as number;
	}
}
