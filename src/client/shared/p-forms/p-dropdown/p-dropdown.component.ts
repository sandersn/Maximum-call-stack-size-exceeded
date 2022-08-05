import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { collapseOnLeaveAnimation, expandOnEnterAnimation } from 'angular-animations';
import { OnDestroy, OnInit, AfterViewInit, AfterContentChecked } from '@angular/core';
import { Component, ChangeDetectionStrategy, ElementRef, NgZone, ChangeDetectorRef, TemplateRef, Input, Output, EventEmitter, ContentChildren, QueryList, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor} from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { VisibleErrorsType } from '@plano/client/service/p-forms.service';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { FaIcon } from '@plano/shared/core/component/fa-icon/fa-icon-types';
import { FaIconComponent } from '@plano/shared/core/component/fa-icon/fa-icon.component';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PDropdownItemComponent } from './p-dropdown-item/p-dropdown-item.component';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '../../bootstrap-styles.enum';
import { BootstrapRounded} from '../../bootstrap-styles.enum';
import { PFormControlComponentBaseDirective } from '../../p-attribute-info/attribute-info-component-base';
import { EditableControlInterface, EditableDirective } from '../../p-editable/editable/editable.directive';
import { PButtonComponent } from '../p-button/p-button.component';
import { PFormControl } from '../p-form-control';
import { PFormControlComponentInterface } from '../p-form-control.interface';

export enum DropdownTypeEnum {
	FILTER = 'filter',
	MULTI_SELECT = 'multiSelect',
	BUTTONS = 'buttons',
	TOGGLE = 'toggle',
}

type ValueType = unknown;

/**
 * <p-dropdown> is like <select> with all the options for pEditables
 * @example with PFormControl binding
 * 	<form [formGroup]="myFormGroup">
 * 		<p-dropdown
 * 			[formControl]="myFormGroup.get('favoriteFood')"
 * 		>
 * 			<p-dropdown-item
 * 				value="unhealthy"
 * 				i18n
 * 			>Pizza</p-dropdown-item>
 * 			<p-dropdown-item
 * 				value="healthy"
 * 				i18n
 * 			>Salat</p-dropdown-item>
 * 		</p-dropdown>
 * 	</form>
 * @example with model binding
 * 	<p-dropdown
 * 		[(ngModel)]="member.favoriteFood"
 * 	>
 * 		<p-dropdown-item
 * 			value="unhealthy"
 * 			i18n
 * 		>Pizza</p-dropdown-item>
 * 		<p-dropdown-item
 * 			value="healthy"
 * 			i18n
 * 		>Salat</p-dropdown-item>
 * 	</p-dropdown>
 * @example as editable
 * 	<form [formGroup]="myFormGroup">
 * 		<p-dropdown
 * 			[pEditable]="!member.isNewItem()"
 * 			[api]="api"
 *
 * 			[formControl]="myFormGroup.get('favoriteFood')"
 * 			placeholder="Plano" i18n-placeholder
 * 		>
 * 			<p-dropdown-item
 * 				value="unhealthy"
 * 				i18n
 * 			>Pizza</p-dropdown-item>
 * 			<p-dropdown-item
 * 				value="healthy"
 * 				i18n
 * 			>Salat</p-dropdown-item>
 * 		</p-dropdown>
 * 	</form>
 */

@Component({
	selector: 'p-dropdown',
	templateUrl: './p-dropdown.component.html',
	styleUrls: ['./p-dropdown.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PDropdownComponent),
			multi: true,
		},
	],
	animations: [
		collapseOnLeaveAnimation({
			animateChildren: 'before',
			duration: 50,
		}),
		expandOnEnterAnimation(),
	],
})
export class PDropdownComponent extends PFormControlComponentBaseDirective
	implements ControlValueAccessor, AfterViewInit, AfterContentChecked, OnDestroy, OnInit, EditableControlInterface,
PFormControlComponentInterface {

	@Input() public readMode : PFormControlComponentInterface['readMode'] = null;

	@ContentChildren(PDropdownItemComponent) public items ?: QueryList<PDropdownItemComponent>;
	@Output() private onSelect : EventEmitter<unknown> = new EventEmitter();
	@Input() public size ?: PFormControlComponentInterface['size'] = null;

	@Input() public btnStyle : PButtonComponent['theme'] = PThemeEnum.SECONDARY;
	@Input() public borderStyle : 'secondary' | 'none' | null = null;

	@Input() public triggerIsCardOption : boolean = false;
	@Input() public dropdownMenuAlignment : 'right' | 'left' = 'right';

	// TODO: get rid of label - use placeholder instead
	/**
	 * Label for the dropdown trigger button
	 * If not set, the placeholder will be taken
	 */
	@Input() public label : string | null = null;
	// TODO: Change type of icon to PlanoFaIconPool
	@Input() private icon : FaIcon | null = null;
	@Input() public iconSpin : boolean = false;
	@Input() public dropdownType : DropdownTypeEnum = DropdownTypeEnum.TOGGLE;
	@Input() public hideTriggerLabel : boolean = false;
	@Input() public hideDropdownToggleTriangle : boolean = false;
	@Input() public hideBadge : boolean = false;
	@Input() public hideFilterLed : boolean = false;
	@Input() public rounded : BootstrapRounded | null = null;

	/**
	 * There are several dropdownTypes that represent a multi-select.
	 * This getter returns true if it is any of them.
	 */
	public get isMultiSelect() : boolean {
		return this.dropdownType === DropdownTypeEnum.MULTI_SELECT || this.dropdownType === DropdownTypeEnum.FILTER;
	}

	/**
	 * Returns a icon fitting to the state and type of the multi-select.
	 */
	public multiSelectIcon(item : PDropdownItemComponent) : FaIcon {
		if (!this.isMultiSelect) this.console.error('Don’t use this method if this is not a multi-select dropdown');
		if (this.dropdownType === DropdownTypeEnum.FILTER) return item.active === true ? PlanoFaIconPool.VISIBLE : PlanoFaIconPool.INVISIBLE;
		return item.active === true ? PlanoFaIconPool.CHECKBOX_SELECTED : PlanoFaIconPool.CHECKBOX_UNSELECTED;
	}

	/**
	 * Set this to false if the dropdown-items should just act like buttons
	 */
	@Input() private showActiveItem : boolean = true;

	@Input() public dropdownMenuVisible : boolean | null = null;
	@Output() private dropdownMenuVisibleChanged : EventEmitter<boolean> = new EventEmitter();

	@Input() public dropdownItemTemplate : TemplateRef<unknown> | null = null;

	@Input() public dropdownTriggerTemplate : TemplateRef<unknown> | null = null;

	@Input() public checkTouched : boolean = false;

	private timeoutMouseLeave : number | null = null;
	private placeholder : string | null = null;

	constructor(
		private el : ElementRef<HTMLElement>,
		private zone : NgZone,
		protected override changeDetectorRef : ChangeDetectorRef,
		private modalService : ModalService,
		private localize : LocalizePipe,
		protected override pFormsService : PFormsService,
		protected override console : LogService,
	) {
		super(false, changeDetectorRef, pFormsService, console);
		if (this.placeholder === null) this.placeholder = this.localize.transform('Bitte wählen…');
	}

	public PThemeEnum = PThemeEnum;
	public PBtnThemeEnum = PBtnThemeEnum;
	public BootstrapSize = BootstrapSize;
	public CONFIG = Config;
	public PlanoFaIconPool = PlanoFaIconPool;
	public DropdownTypeEnum = DropdownTypeEnum;

	/**
	 * Returns true if this is not valid.
	 * Invalid dropdown’s can be bordered red, or something similar that.
	 */
	public get hasDanger() : boolean {

		return (!this.formControl || this.formControl.touched) && !this.isValid;
	}

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

	/** Is this valid? [valid]="…" overwrites the valid state if the formControl. */
	public get isValid() : boolean {
		return this.valid !== null ? this.valid : (!this.formControl || !this.formControl.invalid);
	}

	public override ngOnInit() : never {
		// make sure these events do not trigger change detection for performance reasons
		this.zone.runOutsideAngular(() => {
			this.el.nativeElement.addEventListener('mouseenter', this.onMouseEnter, false);
			this.el.nativeElement.addEventListener('mouseleave', this.onMouseLeave, false);
		});
		return super.ngOnInit();
	}

	/**
	 * Set the label for the dropdown trigger button.
	 */
	private initLabel() : void {
		if (this.label === null) {
			if (this.activeItem && !this.isMultiSelect) {
				this.label = this.activeItem.label;
			} else {
				this.label = this.localize.transform('Bitte wählen…');
			}
		}
	}

	public override ngOnDestroy() : never {
		window.clearTimeout(this.timeoutMouseLeave ?? undefined);

		this.el.nativeElement.removeEventListener('mouseenter', this.onMouseEnter);
		this.el.nativeElement.removeEventListener('mouseleave', this.onMouseLeave);

		return super.ngOnDestroy();
	}

	private onMouseLeave = () : void => {
		// Running the timeout outside angular and trigger changeDetection of this component manually
		// makes it possible to use ChangeDetectionStrategy.OnPush on this component.
		this.zone.runOutsideAngular(() => {
			this.timeoutMouseLeave = window.setTimeout(() => {
				// Does 'this' dropdown still exist? It’s possible that the component has already been destroyed in the meantime.
				// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
				if (!this) return;

				this.dropdownMenuVisible = false;
				this.dropdownMenuVisibleChanged.emit(this.dropdownMenuVisible);
				this.changeDetectorRef.detectChanges();
			}, 500);
		});
	};

	private onMouseEnter = () : void => {
		window.clearTimeout(this.timeoutMouseLeave ?? undefined);
	};

	/**
	 * Should this dropdown item be visually highlighted?
	 */
	public isPrimary(item : PDropdownItemComponent) : boolean {
		if (!this.showActiveItem) return false;

		// Our filter drop-downs say 'hide X' when INACTIVE. Therefore inactive items must be
		// the highlighted ones.
		// if (this.dropdownType === DropdownTypeEnum.FILTER) return !item.active;
		if (this.dropdownType === DropdownTypeEnum.FILTER) return false;

		return this.isActive(item);
	}

	/**
	 * This method checks if the given item is in a active state.
	 */
	public isActive(item : PDropdownItemComponent) : boolean {

		// If set, the item.checked value has a higher priority then the other expression
		if (item.active !== null) return item.active;

		if (item.value === undefined) return false;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if (this.value && (this.value as any).equals) return (this.value as any).equals(item.value);

		return this.value === item.value;
	}

	/**
	 * If this is a multi select dropdown and if there is at least one selected item
	 * then the button needs some kind of highlighting
	 */
	public get isHighlighted() : boolean {
		return this.dropdownType === DropdownTypeEnum.FILTER && !!this.inactiveItemsCounter;
	}

	/**
	 * This returns a icon for the trigger button. Can be set from outside, but can also be the icon of
	 * the selected item, if this is a dropdown with one possible active item. ..aka. "single select dropdown".
	 */
	public get triggerIcon() : FaIconComponent['icon'] | undefined {
		if (this.icon) return this.icon;
		if (this.activeItem?.icon) return this.activeItem.icon;
		return undefined;
	}

	/**
	 * The label of the trigger button.
	 */
	public get triggerLabel() : string | undefined {
		if (this.showActiveItem && this.activeItem && this.activeItem.label) return this.activeItem.label;

		if (this.label) return this.label;
		if (this.placeholder) return this.placeholder;

		return undefined;
	}

	/**
	 * Is it now possible to use ng-content of p-dropdown-item instead of a simple string (label property)
	 * Therefore we need this getter
	 */
	public get triggerLabelTemplate() : TemplateRef<ElementRef> | null {
		if (!this.showActiveItem) return null;
		if (!this.activeItem) return null;
		if (!this.activeItem.innerTemplate?.elementRef.nativeElement.childNodes.length) return null;
		return this.activeItem.innerTemplate;
	}

	/**
	 * Get all items with the stat active
	 */
	private get activeItems() : PDropdownItemComponent[] {
		return this.items!.filter((item) => this.isActive(item));
	}

	/**
	 * Get the selected item, if its not a multi-select-dropdown
	 */
	public get activeItem() : PDropdownItemComponent | null {
		if (this.isMultiSelect) return null;
		if (!this.items) return null;
		return this.activeItems[0];
	}

	/**
	 * This can be used for e.g. filter dropdown’s to show if one of the list-items is active.
	 */
	public get badgeContent() : number {
		return this.inactiveItemsCounter;
	}

	/**
	 * Counts how many of the containing items are inactive. useful for e.g. filter dropdown’s.
	 */
	private get inactiveItemsCounter() : number {
		return this.items!.length - this.activeItems.length;
	}

	/**
	 * This happens when user clicks one of the list-items inside dropdown’s.
	 */
	public clickItem(clickedItem : PDropdownItemComponent, success : () => void) : void {
		// Don‘t close list on click if its a multiSelect
		if (!this.isMultiSelect) {
			this.dropdownMenuVisible = false;
			this.triggerRef?.nativeElement.querySelector('button')?.focus();
			this.dropdownMenuVisibleChanged.emit(this.dropdownMenuVisible);
		}

		// don’t do anything if dropdown-item is disabled
		if (clickedItem.disabled) return;

		// activate the tab the user has clicked on.
		if (this.dropdownType === DropdownTypeEnum.BUTTONS) {
			clickedItem.onClick.emit();
		} else {
			let newActiveState : boolean = false;
			if (this.isMultiSelect) {
				newActiveState = !clickedItem.active;
			} else {
				newActiveState = true;
			}
			if (clickedItem.active !== newActiveState) {
				clickedItem.active = newActiveState;
				clickedItem.onClick.emit();
			}
		}

		this.handleNonMultiSelect(clickedItem, success);
		this.value = clickedItem.value;
	}

	private handleNonMultiSelect(clickedItem : PDropdownItemComponent | null, success ?: () => void) : void {
		if (this.isMultiSelect) return;
		// deactivate all other tabs except the clicked one
		for (const item of this.items!.toArray()) {
			if (item !== clickedItem && item.active) item.active = false;
		}
		if (clickedItem) {
			assumeDefinedToGetStrictNullChecksRunning(clickedItem, 'clickedItem');
			this.onSelect.emit(clickedItem.value);
		}
		if (success) success();
	}

	private modalRef : NgbModalRef | null = null;

	/**
	 * User clicked the button that should open the dropdown thing
	 */
	public onClickTrigger(modalContent : TemplateRef<unknown>) : void {
		if (Config.IS_MOBILE) {
			this.modalRef = this.modalService.openModal(modalContent, {
				size: BootstrapSize.SM,
				scrollable: true,
				success: () => { this.modalRef = null; },
				dismiss: () => { this.modalRef = null; },
			});
			return;
		}
		this.dropdownMenuVisible = !this.dropdownMenuVisible;
		this.triggerRef?.nativeElement.querySelector('button')?.focus();
		this.dropdownMenuVisibleChanged.emit(this.dropdownMenuVisible);

	}

	// public get showBadge() : boolean {
	// 	if (this.hideBadge) return false;
	// 	if (this.dropdownType !== 'filter') return false;
	// 	return !!this.badgeContent;
	// }

	/**
	 * Should the filter-led be visible?
	 */
	public get showFilterLed() : boolean {
		if (this.hideFilterLed) return false;
		if (this.dropdownType !== DropdownTypeEnum.FILTER) return false;
		// if (this.dropdownMenuVisible) return true;
		// return !!this.badgeContent;
		return true;
	}

	/**
	 * Should the label be visible?
	 */
	public get showLabel() : boolean {
		if (this.hideTriggerLabel) return false;
		return !!this.triggerLabel;
	}

	@Input() public itemsFilterTitle : string | null = null;

	public _disabled : boolean = false;

	/**
	 * This is the minimum code that is required for a custom control in Angular.
	 * Its necessary to make [(ngModel)] and [formControl] work.
	 */
	public get disabled() : boolean {
		return this._disabled;
	}
	@Input('disabled') public set disabled(input : boolean) {
		this.setDisabledState(input);
		this._disabled = input;
	}

	@Input() public override formControl : PFormControl | null = null;

	public ngAfterViewInit() : void {
		if (this.value) {
			assumeDefinedToGetStrictNullChecksRunning(this.activeItem, 'activeItem');
			this.handleNonMultiSelect(this.activeItem);
		}
		this.initLabel();
		this.validateValues();
	}

	public override ngAfterContentChecked() : never {
		if (this.items!.filter(item => item.show !== false).length === 0) this.console.error(`Dropdown is empty. Label: »${this.label}«`);
		return super.ngAfterContentChecked();
	}

	/**
	 * Validate if required attributes are set and
	 * if the set values work together / make sense / have a working implementation.
	 */
	private validateValues() : void {
		if (Config.DEBUG && this.dropdownType === DropdownTypeEnum.BUTTONS && this.items) {
			for (const item of this.items.toArray()) {
				if (!item.onClick.observers.length && item.value === undefined) throw new Error(`All dropdown-items need to have (onClick)="…" binding if dropdown has dropdownType »BUTTONS«`);
			}
		}
	}

	@Input('required') private _required : boolean = false;

	/**
	 * Is this a required field?
	 * This can be set as Input() but if there is a formControl binding,
	 * then it takes the info from the formControl’s validators.
	 */
	public get required() : boolean {
		if (this._required) return this._required;
		return this.formControlInitialRequired();
	}

	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	private _value : ValueType | null = null;
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	public override _onChange : (value : ValueType | null) => void = () => {};

	/** Get change event from inside this component, and pass it on. */
	public onChange(value : ValueType) : void {
		this._onChange(value);
	}

	public onTouched = () : void => {};

	/** the value of this control */
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	public get value() : ValueType | null { return this._value; }
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	public set value(value : ValueType | null) {
		if (value === this._value) return;

		this._value = value;
		this.onChange(value);
	}

	/** Write a new value to the element. */
	public writeValue(value : ValueType) : void {
		if (this._value === value) return;
		if (!!this.activeItem) this.activeItem.active = false;
		this._value = value;
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
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	public registerOnChange(fn : (value : ValueType | null) => void) : ReturnType<ControlValueAccessor['registerOnChange']> { this._onChange = fn; }

	/** Set the function to be called when the control receives a touch event. */
	public registerOnTouched(fn : () => void) : void { this.onTouched = fn; }

	/** setDisabledState */
	public setDisabledState(isDisabled : boolean) : void {
		if (this._disabled === isDisabled) return;
		// Set internal attribute
		this._disabled = isDisabled;

		this._disabled ? this.formControl?.disable() : this.formControl?.enable();
	}

	/** Filter all errors that should be shown in the ui. */
	public get visibleErrors() : VisibleErrorsType {
		return this.pFormsService.visibleErrors(this.formControl!);
	}


	@ViewChild('triggerRef', {read:ElementRef, static: false}) private triggerRef ?: ElementRef<HTMLElement>;

	// eslint-disable-next-line @angular-eslint/no-output-native
	@Output() public focus = new EventEmitter<MouseEvent>();
	// eslint-disable-next-line @angular-eslint/no-output-native
	@Output() public blur = new EventEmitter<MouseEvent>();

	/**
	 * Check if focus is anywhere inside dropdown. If not, blur
	 */
	public onBlur() : void {
		window.setTimeout(() => {
			if (this.el.nativeElement.contains(document.activeElement)) return;
			if (this.modalRef !== null) return;
			this.blur.emit();
		}, 200);
	}
}
