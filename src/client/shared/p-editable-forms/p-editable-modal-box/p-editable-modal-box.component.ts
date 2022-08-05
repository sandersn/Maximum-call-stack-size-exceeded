
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { AfterViewInit} from '@angular/core';
import { Component, HostBinding, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, TemplateRef, ElementRef } from '@angular/core';
import { EditableControlInterface, EditableDirective, EditableTriggerClickableDirective } from '@plano/client/shared/p-editable/editable/editable.directive';
import { FaIcon } from '@plano/shared/core/component/fa-icon/fa-icon-types';
import { Config } from '@plano/shared/core/config';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { ModalServiceOptions } from '@plano/shared/core/p-modal/modal.service.options';
import { PEditableModalButtonComponent } from '../../p-editable/p-editable-modal-button/p-editable-modal-button.component';
import { SectionWhitespace } from '../../page/section/section.component';

/**
 * A component that shows a box with some content (can be defined in <p-editable-modal-box-showroom> inside).
 * And has an edit button, which opens a form (can be defined in <p-editable-modal-box-form> inside) to edit these contents.
 * The form will be shown in a modal.
 *
 * This concept makes it possible to capsule inputs that are related through validation. The whole changes of the can only
 * be dismissed or confirmed as once by the user.
 *
 * If this is an active 'editable', then it will save all data of the contained form when the contained form gets closed.
 *
 * If you want another Modal to open right before save, you can use editables [saveChangesHook].
 */

@Component({
	selector: 'p-editable-modal-box',
	templateUrl: './p-editable-modal-box.component.html',
	styleUrls: ['./p-editable-modal-box.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PEditableModalBoxComponent implements AfterViewInit, EditableControlInterface {
	// HACK: Need this for p-input-member-id
	// TODO: Make this obsolete
	@Input() public hideRemoveBtn : boolean = false;

	@ViewChild('showroom', { static: true }) private showroom ! : ElementRef<HTMLElement>;
	@ViewChild('modalButtonRef') public modalButtonRef ?: PEditableModalButtonComponent;

	@HostBinding('class.border-0') private get _hasBorder0() : boolean {
		return this.disabled;
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	@HostBinding('class.card') public get hasCardStyle() : boolean {
		return !(this.disabled && !this.showShowroom);
	}

	@HostBinding('class.form-control-read-mode')
	@HostBinding('class.p-0')
	private get _hasFormControlStyle() : boolean {
		// NOTE: compare this to showSimpleReadOnlyMode
		return this.disabled && !this.showShowroom && !this.label;
	}

	@HostBinding('class.o-hidden')
	protected _alwaysTrue = true;

	@HostBinding('class.bg-light-cold') private get _classBgLightCold() : boolean {
		return !this.theme;
	}
	@HostBinding('class.bg-light') private get _classBgLight() : boolean {
		return this.theme === 'light';
	}
	@HostBinding('class.bg-white') private get _classBgWhite() : boolean {
		return this.theme === 'white';
	}
	@HostBinding('class.bg-dark') private get _classBgDark() : boolean {
		return this.theme === 'dark';
	}

	@HostBinding('class.border-danger') private get _classBorderDanger() : boolean {
		// if (this.required) return false;
		return this.isValid === false || this.borderStyle === 'danger';
	}
	@HostBinding('class.required') private get _classRequired() : boolean {
		return this.required;
	}
	@HostBinding('class.border-primary') private get _classBorderPrimary() : boolean {
		return !this.isValid && this.borderStyle === 'primary';
	}

	@Input('required') private required : boolean = false;

	/**
	 * Whether a backdrop element should be created for a given modal (true by default).
	 * Alternatively, specify 'static' for a backdrop which doesn't close the modal on click.
	 */
	@Input() public backdrop : ModalServiceOptions['backdrop'];

	/**
	 * Theme defines the background color/style of the Box and Modal
	 */
	@Input() public theme : 'dark' | 'light' | 'white' | null = null;

	/**
	 * size of the modal
	 */
	@Input() public size : ModalServiceOptions['size'];

	/**
	 * content of modal scrollable?
	 */
	@Input() public scrollable : ModalServiceOptions['scrollable'];

	/**
	 * Defines the background color/style of the Modal
	 */
	@Input() public borderStyle : 'primary' | 'danger' | null = null;

	/**
	 * Headline of box and modal
	 */
	@Input() public label : string | null = null;

	/**
	 * Label gets used as edit button text.
	 */
	@Input() public btnLabel : string | null = null;

	/**
	 * Label gets used as edit button text.
	 */
	@Input('showBtnLabel') public _showBtnLabel : PEditableModalButtonComponent['showBtnLabel'] | null = null;

	/**
	 * Icon gets used as edit button text.
	 */
	@Input() public btnIcon : FaIcon | null = null;

	/**
	 * Should the icon be visible?
	 */
	@Input() public showBtnIcon : PEditableModalButtonComponent['showBtnLabel'] | null = null;

	/**
	 * Popover content of modal’s save button
	 */
	@Input() public saveButtonPopover ?: PopoverDirective['popover'];

	/**
	 * Popover content of modal’s edit button
	 */
	@Input() public editButtonPopover ?: TemplateRef<Event>;

	/**
	 * If set to true, the modal will close when the pEditable is done with the api-call.
	 */
	@Input() public waitForEditableCompleteBeforeClose : boolean = false;

	/**
	 * Component disabled?
	 * If set to true, the edit button doesn’t show up
	 */
	@Input() public disabled : boolean = false;

	@Output() public onRemoveItemClick : EventEmitter<Event> = new EventEmitter();
	@Input() public removeButtonDisabled : boolean = false;
	@Input() public removeModalText : string | null = null;
	@Input() public removeModalButtonLabel : string | null = null;

	/**
	 * Triggers when modal gets opened.
	 * If this is a modal with a active pEditable, then the onModalOpen() method happens AFTER api.createDataCopy()
	 */
	@Output() public onModalOpen : EventEmitter<undefined> = new EventEmitter();

	/** @see PEditableModalButtonComponent['onModalClosed'] */
	@Output() public onModalClosed : PEditableModalButtonComponent['onModalClosed'] = new EventEmitter();

	/** @see PEditableModalButtonComponent['onModalDismissed'] */
	@Output() public onModalDismissed : PEditableModalButtonComponent['onModalDismissed'] = new EventEmitter();

	/**
	 * Triggers before modal gets closed
	 */
	@Input() public beforeModalClose : ((success : () => void) => void) | null = null;

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

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isValid() : boolean {
		// TODO: implement formControl support
		// return this.valid !== null ? this.valid : (!this.formControl || !this.formControl.invalid);
		return this.valid !== null ? this.valid : true;
	}

	@Input() public beforeEditHook : EditableTriggerClickableDirective['beforeEditHook'];

	public boxEditMode : boolean = false;

	constructor(
		private changeDetectorRef : ChangeDetectorRef,
		public modalService : ModalService,
	) {
	}

	public ngAfterViewInit() : void {
		this.changeDetectorRef.detectChanges();
	}

	@HostBinding('class.shadow-sm') private get hasShadow() : boolean {
		if (this.disabled) return false;
		return true;
	}

	@HostBinding('class.shadow-hover') private get _hasShadowHover() : boolean {
		if (Config.IS_MOBILE) return false;
		if (!this.hasShadow) return false;
		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showShowroom() : boolean {
		return this.showroom.nativeElement.children.length > 0;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public updateEditMode(event : boolean) : void {
		this.boxEditMode = event;
		this.editMode.emit(event);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showSimpleReadOnlyMode() : boolean {
		return this.disabled && !this.showShowroom && !!this.label;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showEditButtonPopover() : boolean {
		if (Config.IS_MOBILE) return false;
		return true;
	}

	/**
	 * Should the button-label be visible?
	 */
	public get showBtnLabel() : PEditableModalButtonComponent['showBtnLabel'] {
		if (Config.IS_MOBILE) return false;
		if (this._showBtnLabel !== null) return this._showBtnLabel;
		return !!this.btnLabel;
	}
}

@Component({
	selector: 'p-editable-modal-box-header',
	template: '<ng-content></ng-content>',
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PEditableModalBoxHeaderComponent {
	@HostBinding('class.w-100')
	@HostBinding('class.d-flex')
	@HostBinding('class.justify-content-between')
	@HostBinding('class.align-items-center') private _alwaysTrue = true;

	// @HostBinding('class.bg-white') private _alwaysTrue = true;

	constructor() {}
}

@Component({
	selector: 'p-editable-modal-box-showroom',
	template: '<ng-content></ng-content>',
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PEditableModalBoxShowroomComponent {
	@HostBinding('class.d-block')
	@HostBinding('class.o-hidden')
	@HostBinding('class.p-3')
	@HostBinding('class.card-body') protected _alwaysTrue = true;
	@HostBinding('class.p-0') private get _classP0() : boolean { return this.size === 'frameless'; }
	@HostBinding('class.p-1') private get _classP1() : boolean { return this.size === 'small'; }
	@HostBinding('class.p-2') private get _classP2() : boolean { return this.size === 'medium'; }
	@HostBinding('class.p-3') private get _classP3() : boolean { return this.size === 'large'; }

	@Input() public size : 'small' | 'medium' | 'large' | 'frameless' | null = null;
	constructor() {}
}

@Component({
	selector: 'p-editable-modal-box-form',
	template: '<ng-content></ng-content>',
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PEditableModalBoxFormComponent {
	@HostBinding('class.d-block')
	@HostBinding('class.w-100') protected _alwaysTrue = true;

	constructor() {}
}
