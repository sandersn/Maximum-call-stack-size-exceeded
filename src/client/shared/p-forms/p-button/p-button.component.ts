import { OnInit } from '@angular/core';
import { Component, ChangeDetectionStrategy, HostBinding, ElementRef, Host, Optional, ChangeDetectorRef } from '@angular/core';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ViewChild } from '@angular/core';
import { EditableControlInterface, EditableDirective } from '@plano/client/shared/p-editable/editable/editable.directive';
import { FaIconComponent } from '@plano/shared/core/component/fa-icon/fa-icon.component';
import { Config } from '@plano/shared/core/config';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { LogService } from '@plano/shared/core/log.service';
import { ModalDirective } from '../../../../shared/core/p-modal/modal.directive';
import { ModalService } from '../../../../shared/core/p-modal/modal.service';
import { PlanoFaIconPool } from '../../../../shared/core/plano-fa-icon-pool.enum';
import { BootstrapRounded, PThemeEnum, PTextColorEnum, PBtnThemeEnum, BootstrapSize } from '../../bootstrap-styles.enum';
import { PBtnTheme, PTextColor} from '../../bootstrap-styles.enum';
import { AttributeInfoComponentBaseDirective } from '../../p-attribute-info/attribute-info-component-base';
import { PBadgeComponentInterface } from '../../shared/p-badge/p-badge.types';
import { PFormControlComponentInterface } from '../p-form-control.interface';

export enum PButtonType {
	DEFAULT = 'default',
	TOGGLE = 'toggle',
	FILTER = 'filter',
}

@Component({
	selector: 'p-button',
	templateUrl: './p-button.component.html',
	styleUrls: ['./p-button.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PButtonComponent extends AttributeInfoComponentBaseDirective implements EditableControlInterface, OnInit, PComponentInterface {
	protected override attributeInfoRequired = false;

	@Input() public isLoading : PComponentInterface['isLoading'] = false;

	@HostBinding('class.btn-group')
	@HostBinding('class.d-flex') protected _alwaysTrue = true;

	@Input() public size ?: PFormControlComponentInterface['size'] = null;

	@Input('theme') private _theme : PBtnTheme | null = null;

	@Input() public btnClasses : string = '';

	@Input() public textStyle : PTextColor | null = null;

	@Input() public buttonType : PButtonType = PButtonType.DEFAULT;
	@Input() public isActiveButton : boolean = false;
	@Input() public darkMode : boolean = false;

	/**
	 * Text that should be shown in a badge. E.g. a counter for something
	 */
	@Input() public badge : PBadgeComponentInterface['content'] = null;
	@Input() public badgeAlign : PBadgeComponentInterface['align'] = 'right';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	@ViewChild('content', { static: true }) public content ! : any;

	/**
	 * Use this instead of (click)
	 * TODO: Give this a more intuitive name. I can probably take a (onClick) and bind the pEditable triggerClick to it.
	 */
	@Output() public triggerClick : EventEmitter<Event> = new EventEmitter<Event>();

	/**
	 * @deprecated
	 */
	// eslint-disable-next-line @angular-eslint/no-output-native
	@Output() public click : EventEmitter<Event> = new EventEmitter<Event>();

	/**
	 * For a non-rounded button use workaround: [btnClasses]="'rounded-0'"
	 */
	@Input() public rounded ?: BootstrapRounded | null = null;

	/**
	 * Button will have a pill style if its a toggle button. With [pill]="false" you can enforce a non-pill button.
	 */
	@Input('pill') public _pill : boolean | null = null;

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


	public _disabled : boolean = false;

	/**
	 * Is this button disabled?
	 */
	public get disabled() : boolean {
		return this._disabled || !this.canEdit;
	}
	@Input('disabled') public set disabled(input : boolean) {
		this._disabled = input;
	}

	/** setDisabledState */
	public setDisabledState(isDisabled : boolean) : void {
		if (this._disabled === isDisabled) return;
		// Set internal attribute
		this._disabled = isDisabled;
	}

	@Input() public required : boolean = false;

	@Input('type') private set type(_input : 'button' | 'submit') {
		if (this.console) {
			this.console.error('Setting a button type is not supported on p-button yet');
		} else {
			throw new Error('Setting a button type is not supported on p-button yet');
		}
	}

	@Input('class') private set class(input : string) {
		if (input.includes('btn')) this.console?.error(`Don’t set button classes on p-button. Use e.g. [theme]="PThemeEnum.PRIMARY" or [theme]="PBtnThemeEnum.OUTLINE_SECONDARY". Your current classes are »${input}«`);
	}

	public _icon : FaIconComponent['icon'] | null = null;

	/**
	 * Icon next to the button-text
	 */
	public get icon() : FaIconComponent['icon'] | null {
		if (this._icon) return this._icon;
		if (this.buttonType === PButtonType.FILTER) {
			return this.isActiveButton ? PlanoFaIconPool.INVISIBLE : PlanoFaIconPool.VISIBLE;
		}
		return null;
	}
	@Input('icon') public set icon(input : FaIconComponent['icon'] | null) {
		this._icon = input;
	}


	/**
	 * In which theme-color should the icon appear.
	 * If this is some kind of toggle-button, then this will probably change based on active state.
	 */
	public get iconTheme() : PTextColor | null {
		if (this.buttonType === PButtonType.FILTER && this.isActiveButton) {
			switch (this.theme) {
				case PThemeEnum.SECONDARY:
					return PThemeEnum.PRIMARY;
				case PBtnThemeEnum.OUTLINE_DANGER:
				case PBtnThemeEnum.OUTLINE_DARK:
				case PBtnThemeEnum.OUTLINE_LIGHT:
				case PBtnThemeEnum.OUTLINE_PRIMARY:
				case PBtnThemeEnum.OUTLINE_SECONDARY:
					return this.disabled ? PTextColorEnum.WHITE : PThemeEnum.SECONDARY;
				default:
					return this.theme;
			}
		}
		return null;
	}

	constructor(
		private modalService : ModalService,
		protected override changeDetectorRef : ChangeDetectorRef,
		private elementRef ?: ElementRef,
		@Optional() @Host() public pModal ?: ModalDirective,
		protected override console ?: LogService,
	) {
		super(true, changeDetectorRef, console);
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public BootstrapRounded = BootstrapRounded;
	public PTextColorEnum = PTextColorEnum;
	public PThemeEnum = PThemeEnum;
	public PButtonType = PButtonType;
	public PBtnThemeEnum = PBtnThemeEnum;
	public BootstrapSize = BootstrapSize;

	public config : typeof Config = Config;

	public override ngOnInit() : never {
		this.initValues();
		return super.ngOnInit();
	}

	/**
	 * In which color-theme should the button appear?
	 */
	public get theme() : PButtonComponent['_theme'] {
		if (this._theme) return this._theme;
		if (this.buttonType === PButtonType.TOGGLE) return PThemeEnum.PRIMARY;
		if (this.buttonType === PButtonType.FILTER) return PThemeEnum.SECONDARY;
		return PThemeEnum.SECONDARY;
	}

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	private initValues() : void {
		this.validateValues();
	}

	/**
	 * Validate if required attributes are set and
	 * if the set values work together / make sense / have a working implementation.
	 */
	private validateValues() : void {

		// Output names should never collide with native HTML dom events
		// See: https://medium.com/angular-athens/naming-of-output-events-in-angular-2063cad94183
		if (!!this.click.observers.length && !this.pModal) {
			this.console?.warn(`Button has potential problem: ${this.elementRef?.nativeElement.outerText ?? this.icon}`);
			this.console?.warn(`Use the components '(triggerClick)' instead of native html’s '(click)'. For more info, see https://medium.com/angular-athens/naming-of-output-events-in-angular-2063cad94183`);
		}

		if ((this.buttonType === PButtonType.TOGGLE || this.buttonType === PButtonType.FILTER) && this.icon === null && this.content?.nativeElement.children.length === 0) this.console?.error('icon must be provided for toggle buttons');
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isAOutlineStyle() : boolean | void {
		if (!this.theme) return;
		if (this.theme.includes('outline-primary')) return false;
		return this.theme.includes('outline-');
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get justifyClass() : string {
		if (this.btnClasses.includes('justify-content-')) return '';
		if (this.buttonType === PButtonType.TOGGLE) return 'justify-content-start';
		if (this.buttonType === PButtonType.FILTER) return 'justify-content-start';
		return 'justify-content-center';
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get alignItemsClass() : string {
		if (this.btnClasses.includes('align-items-')) return '';
		return 'align-items-center';
	}

	/**
	 * Should the ng-content be visible?
	 */
	private _showContent : boolean = false;
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showContent() : boolean {
		const hasContent = this.content.nativeElement && (
			this.content.nativeElement.children.length > 0 ||
			this.content.nativeElement.innerHTML.length > 0
		);
		if (hasContent) this._showContent = hasContent;
		return this._showContent;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get hasBadgePillClass() : boolean {
		if (this._pill !== null) return this._pill;
		return this.buttonType === PButtonType.TOGGLE || this.buttonType === PButtonType.FILTER;
	}

	// eslint-disable-next-line @angular-eslint/no-output-native
	@Output() public focus = new EventEmitter<MouseEvent>();
	// eslint-disable-next-line @angular-eslint/no-output-native
	@Output() public blur = new EventEmitter<MouseEvent>();

	/**
	 * Open a Modal like info-circle does it when in IS_MOBILE mode.
	 */
	public openCannotEditHint() : void {
		if (this.cannotEditHint === null) {
			this.console?.error('It should not have been possible to run this method');
			return;
		}
		this.modalService.openCannotEditHintModal(this.cannotEditHint);
	}
}
