import { AfterContentInit } from '@angular/core';
import { Component, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { ElementRef } from '@angular/core';
import { PBtnThemeEnum, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { AttributeInfoComponentBaseDirective } from '@plano/client/shared/p-attribute-info/attribute-info-component-base';
import { FaIconComponent } from '@plano/shared/core/component/fa-icon/fa-icon.component';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { LogService } from '@plano/shared/core/log.service';
import { PFormControlComponentChildInterface } from '../../p-form-control.interface';

@Component({
	selector: 'p-dropdown-item',
	templateUrl: './p-dropdown-item.component.html',
	styleUrls: ['./p-dropdown-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PDropdownItemComponent extends AttributeInfoComponentBaseDirective
	implements PComponentInterface, PFormControlComponentChildInterface, AfterContentInit {
	protected override attributeInfoRequired = false;

	@Input() public value : PFormControlComponentChildInterface['value'];

	/**
	 * @deprecated use
	 * <p-dropdown-item><fa-icon icon="pen"></fa-icon> Hello</p-dropdown-item>
	 * instead of
	 * <p-dropdown-item label="Hello" icon="pen"></p-dropdown-item>
	 */
	@Input() public icon : FaIconComponent['icon'] | null = null;

	/**
	 * @deprecated use
	 * <p-dropdown-item>Hello</p-dropdown-item>
	 * instead of
	 * <p-dropdown-item label="Hello"></p-dropdown-item>
	 */
	@Input() public label : PFormControlComponentChildInterface['label'] = '';
	@Input() public description : PFormControlComponentChildInterface['description'] = '';
	@Input() public active : PFormControlComponentChildInterface['active'] = null;

	@Input('disabled') private _disabled : boolean = false;
	@Input() public isLoading : PComponentInterface['isLoading'] = false;

	@Output() public onClick : PFormControlComponentChildInterface['onClick'] = new EventEmitter();

	/**
	 * This id is used to find tabs by url param
	 */
	@Input() public urlName : string | null = null;

	/**
	 * The bootstrap button style for this checkbox
	 */
	@Input() public theme : PThemeEnum.DANGER | PBtnThemeEnum.OUTLINE_DANGER | null = null;

	@ViewChild('innerTemplate') public innerTemplate ?: TemplateRef<ElementRef>;

	constructor(
		public el : ElementRef<HTMLElement>,
		protected override changeDetectorRef : ChangeDetectorRef,
		protected override console : LogService,
	) {
		super(true, changeDetectorRef, console);
	}

	/**
	 * Is this dropdown-item disabled?
	 */
	public get disabled() : boolean {
		if (this.isLoading) return true;
		return this._disabled;
	}
}
