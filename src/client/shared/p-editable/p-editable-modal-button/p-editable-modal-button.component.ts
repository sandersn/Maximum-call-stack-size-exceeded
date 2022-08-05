import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { AfterViewInit, AfterContentInit } from '@angular/core';
import { Component, HostBinding, HostListener, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { EditableControlInterface, EditableTriggerClickableDirective } from '@plano/client/shared/p-editable/editable/editable.directive';
import { EditableDirective } from '@plano/client/shared/p-editable/editable/editable.directive';
import { FaIcon } from '@plano/shared/core/component/fa-icon/fa-icon-types';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { ModalServiceOptions } from '@plano/shared/core/p-modal/modal.service.options';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { SchedulingApiService } from '../../../../shared/api';
import { assumeNonNull } from '../../../../shared/core/null-type-utils';
import { ModalContentOptions } from '../../../../shared/core/p-modal/modal-default-template/modal-default-template.component';
import { LocalizePipe } from '../../../../shared/core/pipe/localize.pipe';
import { PThemeEnum } from '../../bootstrap-styles.enum';
import { SectionWhitespace } from '../../page/section/section.component';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'button[pEditableModalButton]',
	templateUrl: './p-editable-modal-button.component.html',
	styleUrls: ['./p-editable-modal-button.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PEditableModalButtonComponent implements AfterViewInit, AfterContentInit, EditableControlInterface {

	/**
	 * Whether a backdrop element should be created for a given modal (true by default).
	 * Alternatively, specify 'static' for a backdrop which doesn't close the modal on click.
	 */
	@Input() public backdrop : ModalServiceOptions['backdrop'];

	/**
	 * Theme defines the background color/style of the Modal
	 */
	@Input() public theme ?: ModalServiceOptions['theme'] = null;

	/**
	 * size of the modal
	 */
	@Input() private modalSize : ModalServiceOptions['size'];

	/**
	 * position of the modal
	 */
	@Input() public centered : ModalServiceOptions['centered'];

	/**
	 * content of modal scrollable?
	 */
	@Input() public scrollable : ModalServiceOptions['scrollable'];

	/**
	 * fa-icon name for the button
	 */
	@Input('icon') private _icon ?: FaIcon | null;

	/** @see PEditableModalButtonComponent['_icon'] */
	public get icon() : FaIcon | false {
		if (!!this._icon) return this._icon;
		return PlanoFaIconPool.EDIT;
	}

	/**
	 * @see ModalContentOptions['closeBtnLabel']
	 */
	@Input() public closeBtnLabel : (string | (() => string)) | null = null;

	@Input() public closeBtnTheme : ModalContentOptions['closeBtnTheme'] = PThemeEnum.PRIMARY;

	@Input() public closeBtnDisabled : ReturnType<Exclude<ModalContentOptions['closeBtnDisabled'], undefined>> = false;

	/**
	 * Should the icon be visible?
	 */
	@Input('showBtnIcon') public _showBtnIcon : boolean | null = null;

	/** @see PEditableModalButtonComponent['_showBtnIcon'] */
	public get showBtnIcon() : boolean {
		if (this._showBtnIcon !== null) return this._showBtnIcon;
		return !!this.icon;
	}

	/**
	 * Popover for the save-button in the modal.
	 */
	@Input() public saveButtonPopover ?: PopoverDirective['popover'];

	/**
	 * If set to true, the modal will close when the pEditable is done with the api-call.
	 */
	@Input() private waitForEditableCompleteBeforeClose : boolean = false;

	/**
	 * Component disabled?
	 */
	@Input() public disabled : boolean = false;

	/**
	 * Triggers when modal gets opened
	 */
	@Output() private onModalOpen : EventEmitter<undefined> = new EventEmitter();

	/**
	 * Triggers when modal gets closed
	 */
	@Output() private onModalClosed : EventEmitter<undefined> = new EventEmitter();

	/**
	 * Triggers when modal gets closed
	 */
	@Output() private onModalDismissed : EventEmitter<undefined> = new EventEmitter();

	/**
	 * Triggers before modal gets closed
	 */
	@Input() private beforeModalClose : ((result : () => void) => void) | null = null;

	/**
	 * How much whitespace should there be inside the modal?
	 */
	@Input() public modalWhitespace : SectionWhitespace = SectionWhitespace.MEDIUM;

	// These are necessary Inputs and Outputs for pEditable form-element
	@Input() public pEditable : EditableControlInterface['pEditable'] = false;
	@Input() public api : EditableControlInterface['api'] = null;
	@Input() public valid : EditableControlInterface['valid'] = null;
	@Input() public saveChangesHook ?: EditableControlInterface['saveChangesHook'];
	@Output() public onSaveStart : EditableControlInterface['onSaveStart'] = new EventEmitter();
	@Output() public onSaveSuccess : EditableControlInterface['onSaveSuccess'] = new EventEmitter();
	@Output() public onDismiss : EditableDirective['onDismiss'] = new EventEmitter();
	@Output() public onLeaveCurrent : EditableControlInterface['onLeaveCurrent'] = new EventEmitter();
	@Output() public editMode : EditableControlInterface['editMode'] = new EventEmitter<boolean>(undefined);
	// public get isValid() : boolean {
	// 	return this.valid !== null ? this.valid : (!this.formControl || !this.formControl.invalid);
	// }

	@Input() public beforeEditHook : EditableTriggerClickableDirective['beforeEditHook'];

	private _label : string | null = null;

	@Input() public btnLabel : string | null = null;

	/**
	 * Label gets used as button-text.
	 * If no label is set, the content of p-editable-modal-button-header gets used.
	 */
	public get label() : string {
		return this._label ?? this.localizePipe.transform('Bearbeiten');
	}
	@Input() public set label(input : string | null) {
		this._label = input;
		this.changeDetectorRef.markForCheck();
	}

	private _showBtnLabel : boolean = true;

	/**
	 * Should any label be visible?
	 * If false, the trigger-button will only have an icon.
	 */
	public get showBtnLabel() : boolean {
		return this._showBtnLabel;
	}
	@Input() public set showBtnLabel(input : boolean) {
		this._showBtnLabel = input;
		this.changeDetectorRef.detectChanges();
	}

	public saveBtnHasBeenClicked : boolean = false;

	/**
	 * Is the modal open?
	 */
	public modalIsOpen : boolean = false;

	/**
	 * Gets used by e.g. PEditableModalBoxComponent
	 */
	public modalRef : NgbModalRef | null = null;

	constructor(
		private changeDetectorRef : ChangeDetectorRef,
		public modalService : ModalService,
		private console : LogService,
		public pEditableRef : EditableDirective,
		private localizePipe : LocalizePipe,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public SectionWhitespace = SectionWhitespace;
	public PThemeEnum = PThemeEnum;

	@HostBinding('class.btn')
	@HostBinding('class.d-flex')
	@HostBinding('class.align-items-center')
	@HostBinding('class.justify-content-center') protected _alwaysTrue = true;

	@HostBinding('class.p-editable-active') private get pEditableIsActive() : boolean {
		if (!this.pEditable) return false;
		return true;
	}

	@HostBinding('class.p-editable-has-hook') private get _pEditableHasHook() : boolean {
		return this.pEditableIsActive && !!this.saveChangesHook;
	}

	/**
	 * @deprecated use [contentTemplateRef] instead
	 */
	@ViewChild('formInModal', { static: true }) private formInModal ! : TemplateRef<unknown>;

	@ViewChild('footerTemplateRef', { static: true }) private footerTemplateRef ! : TemplateRef<unknown>;

	/**
	 * This is an alternative way to define a template instead of using <p-editable-modal-button-form>
	 * Use it if you dont want the template content to be available in the Angular view structure while modal is NOT open.
	 */
	@Input() private contentTemplateRef : TemplateRef<unknown> | null = null;

	@Input() private contentTemplateOptions : {[key : string] : unknown} = {};

	@HostBinding('disabled') private get _isDisabled() : boolean {
		return this.disabled || this.modalIsOpen;
	}

	@HostListener('click', ['$event']) private _openEditableModal(event : Event) : void {
		const success = () : void => {
			if (this.pEditableIsActive && !this.pEditableRef.startEditable(event)) return;
			const modalServiceOptions = this.getModalServiceOptions();

			this.onModalOpen.emit();

			if (!!this.contentTemplateRef) {
				this.modalRef = this.modalService.openDefaultModal({
					contentTemplateRef: this.contentTemplateRef,
					contentTemplateContext: this.contentTemplateOptions,
					dismissBtnLabel: this.localizePipe.transform('Verwerfen'),
					closeBtnLabel: this.closeBtnLabel,
					modalTitle: this.label,
					footerTemplateRef: this.footerTemplateRef,
					footerTemplateContext: {
						dismiss: () => {
							this.modalRef!.dismiss();
						},
						close: () => {
							this.modalRef!.close();
						},
					},
				}, modalServiceOptions);
			} else {
				this.modalRef = this.modalService.openModal(this.formInModal, modalServiceOptions);
			}
		};

		if (!this.beforeEditHook) {
			success();
			return;
		}

		this.beforeEditHook(() => {
			success();
		}, () => {
			this.console.log('editable dismissed');
		});
	}

	public ngAfterViewInit() : void {
		this.changeDetectorRef.detectChanges();
	}

	public ngAfterContentInit() : void {
		this.initValues();
	}

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	private initValues() : void {
		if (!this.closeBtnLabel) this.closeBtnLabel = this.localizePipe.transform('Speichern');
	}

	/**	closeBtnLabel can be a fn which returns a string */
	public get closeBtnLabelAsString() : string {
		if (typeof this.closeBtnLabel === 'string') return this.closeBtnLabel;
		assumeNonNull(this.closeBtnLabel);
		return this.closeBtnLabel();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onClose() : void {
		this.saveChanges(() => {
			this.modalRef!.close();
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public saveChanges(
		closeCallback ?: (result : unknown) => void,
	) : void {
		if (this.saveBtnHasBeenClicked) return;
		this.saveBtnHasBeenClicked = true;
		window.setTimeout(() => {
			// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
			if (this) this.saveBtnHasBeenClicked = false;
		}, 200);
		if (!this.pEditableIsActive) {
			if (this.beforeModalClose) {
				this.beforeModalClose(() => {
					if (closeCallback) closeCallback('close');
				});
				return;
			}
			if (closeCallback) closeCallback('close');
			return;
		}

		// Editable is active
		// TODO: Check if waitForEditableCompleteBeforeClose can be removed. Backend should be fast anyway.
		if (this.waitForEditableCompleteBeforeClose) {
			this.pEditableRef.onSuccess(() => {
				if (closeCallback) closeCallback('close');
			});
		} else {
			this.pEditableRef.onSuccess();
			if (closeCallback) closeCallback('close');
		}
	}

	/**
	 * This happens on dismiss-button and ×-button click
	 */
	public dismissChanges(
		dismissCallback ?: (result : unknown) => void,
	) : void {
		if (!this.pEditableIsActive) {
			if (dismissCallback) dismissCallback('close');
			return;
		}

		// no copy available to dismiss?
		if (!this.api!.hasDataCopy())
			// TODO: Find a way to add information about the source of this throw to the throw text.
			throw new Error('No data copy available. [PLANO-21475]');

		if (dismissCallback) dismissCallback('close');
		this.pEditableRef.onUndo();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public updateEditMode(event : boolean) : void {
		this.modalIsOpen = event;
		this.editMode.emit(event);
	}

	private getModalServiceOptions() : ModalServiceOptions {
		const options : ModalServiceOptions = new ModalServiceOptions();
		// modalServiceOptions.keyboard = false;
		if (this.modalSize !== undefined) options.size = this.modalSize;
		if (this.scrollable !== undefined) options.scrollable = this.scrollable;
		if (this.centered !== undefined) options.centered = this.centered;
		if (this.backdrop !== undefined) options.backdrop = this.backdrop;
		if (!options.size) options.size = 'lg';
		if (!options.windowClass && this.theme) options.theme = this.theme;
		// open modal
		options.success = () => {
			if (!!this.contentTemplateRef) this.onClose();
			this.onModalClosed.emit();
		};
		options.dismiss = () => {
			this.onModalDismissed.emit();

			// NOTE:	If you want to change the next line, please check if these tickets are still fixed:
			// 				- PLANO-98740
			// 				- PLANO-92505
			if (!this.contentTemplateRef) this.pEditableRef.onUndo();

		};

		options.finally = () => {
			// BUG: 	We tried to fix PLANO-92566 with a HACK:
			//
			// 					if (!this.api?.hasDataCopy()) return;
			// 					this.dismissChanges();
			//
			// 				But they caused other issues:
			// 					NOTE: PLANO-92505 was not reproducible anymore.
		};

		return options;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showSuccessButtonLoadingAnimation() : boolean {
		if (this.api!.isBackendOperationRunning) return true;
		if (this.api instanceof SchedulingApiService && this.api.isUpdatingWarnings) return true;
		if (this.saveBtnHasBeenClicked) return true;
		return false;
	}
}

@Component({
	selector: 'p-editable-modal-button-header',
	template: '<ng-content></ng-content>',
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PEditableModalButtonHeaderComponent {
	@HostBinding('class.w-100')
	@HostBinding('class.d-flex')
	@HostBinding('class.justify-content-between')
	@HostBinding('class.align-items-center') protected _alwaysTrue = true;

	constructor() {}
}

/**
 * @deprecated use [contentTemplateRef] instead
 */
@Component({
	selector: 'p-editable-modal-button-form',
	template: '<ng-content></ng-content>',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PEditableModalButtonFormComponent {
	@HostBinding('class.d-flex')
	@HostBinding('class.flex-column')
	@HostBinding('class.w-100') protected _alwaysTrue = true;

	constructor() {}
}
