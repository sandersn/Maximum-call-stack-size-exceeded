import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { Id } from '@plano/shared/api/base/id';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { PCurrencyPipe } from '@plano/shared/core/pipe/p-currency.pipe';
import { AngularDatePipeFormat, PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { FaIcon } from '../../../../shared/core/component/fa-icon/fa-icon-types';
import { PlanoFaIconPool } from '../../../../shared/core/plano-fa-icon-pool.enum';
import { BootstrapSize, PTextColorEnum, PThemeEnum } from '../../bootstrap-styles.enum';
import { PTextColor} from '../../bootstrap-styles.enum';
import { AttributeInfoComponentBaseDirective } from '../../p-attribute-info/attribute-info-component-base';
import { PFormGroupComponent } from '../p-form-group/p-form-group.component';

@Component({
	selector: 'p-form-control-showcase',
	templateUrl: './form-control-showcase.component.html',
	styleUrls: ['./form-control-showcase.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})

/**
 * In situations where a lot data must be shown but the user will never be able to edit them (like our transactions)
 * we want to show them in another visual style than a input in 'readMode'. The input can be interpreted as indicator
 * that the data can be edited in some other setting. We want to prevent that confusion.
 *
 * @example
 *   <p-form-control-showcase
 *     label="FooBar" i18n-label
 *     [attributeInfo]="item.attributeInfoFooBar"
 *   ></p-form-control-showcase>
 */

export class FormControlShowcaseComponent extends AttributeInfoComponentBaseDirective implements PComponentInterface {
	@Input() public isLoading : PComponentInterface['isLoading'] = false;

	@Input('label') private _label : PFormGroupComponent['label'] = null;

	@Input() public description : PFormGroupComponent['description'] | null = null;
	@Input() public descriptionHTML : PFormGroupComponent['descriptionHTML'] = null;

	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	@Input('content') private _content : string | Id | number | unknown;
	@Input() public appendContent : string | null = null;

	@Input('icon') private _icon ?: FormControlShowcaseComponent['icon'];

	@Input('primitiveType') private _primitiveType ?: FormControlShowcaseComponent['primitiveType'];
	@Input('contentTheme') private _contentTheme : PTextColor | null = null;
	@Input('monospace') private _monospace : boolean | null = null;

	constructor(
		private pCurrencyPipe : PCurrencyPipe,
		private pDatePipe : PDatePipe,
	) {
		super(false, undefined);
	}

	public BootstrapSize = BootstrapSize;

	private get value() : FormControlShowcaseComponent['_content'] {
		if (this.isLoading) return null;
		if (this._content !== undefined) return this._content;
		if (!!this.attributeInfo?.value) return this.attributeInfo.value;
		return null;
	}

	/**
	 * Get content for this component.
	 */
	public get content() : string | null {
		if (this.isLoading) return '██████';
		if (this.value === null) return null;
		return this.getFormattedValue(this.value);
	}

	private get primitiveType() : PApiPrimitiveTypes | 'longText' {
		if (this._primitiveType !== undefined) return this._primitiveType;
		if (this.attributeInfo) return this.attributeInfo.primitiveType;
		return PApiPrimitiveTypes.string;
	}

	/**
	 * Some content can be linked. Here comes the link. Null if 'unlinkable'.
	 */
	public get link() : string | null {
		if (this.primitiveType === PApiPrimitiveTypes.Email) return `mailto:${this.value}`;
		return null;
	}

	/**
	 * You can either set an icon, or this component will try to figure out the best icon based on primitiveType
	 */
	public get icon() : FaIcon | null {
		if (this._icon !== undefined) return this._icon;
		if (this.primitiveType === PApiPrimitiveTypes.Email) return PlanoFaIconPool.EMAIL_NOTIFICATION;
		return null;
	}

	private getFormattedValue(input : FormControlShowcaseComponent['_content']) : string | null {
		switch (this.primitiveType) {
			case PApiPrimitiveTypes.Currency:
				return this.pCurrencyPipe.transform(input as number, undefined, undefined, undefined, undefined, undefined, true);
			case PApiPrimitiveTypes.Id:
				return (input as Id).toString();
			case PApiPrimitiveTypes.DateTime:
				return `${this.pDatePipe.transform(input as number, AngularDatePipeFormat.SHORT_DATE)}, ${this.pDatePipe.transform(input as number, AngularDatePipeFormat.SHORT_TIME)}`;
			default:
				return (input as string | number | boolean).toString();
		}
	}

	/**
	 * Get label for this component.
	 */
	public get label() : string | null {
		if (this._label !== null) return this._label;
		if (!!this.attributeInfo) return this.attributeInfo.name;
		return null;
	}

	/**
	 * Get a theme for the content
	 */
	private get contentTheme() : PTextColor | null {
		if (this._contentTheme !== null) return this._contentTheme;
		if (this.primitiveType !== PApiPrimitiveTypes.Currency) return null;
		const value = this.value as number;
		if (value > 0) return PThemeEnum.SUCCESS;
		if (value < 0) return PThemeEnum.DANGER;
		return PTextColorEnum.MUTED;
	}

	/**
	 * Get a text-color for the content
	 */
	public get contentThemeClass() : string {
		if (this.contentTheme === null) return '';
		return `text-${this.contentTheme}`;
	}

	/**
	 * Should this be shown as monospace or not?
	 */
	private get isMonospaceType() : boolean {
		switch (this.primitiveType) {
			case PApiPrimitiveTypes.Currency:
			case PApiPrimitiveTypes.Id:
			case PApiPrimitiveTypes.DateTime:
			case PApiPrimitiveTypes.number:
			case PApiPrimitiveTypes.Integer:
				return true;
			default:
				return false;
		}
	}

	/**
	 * Should this be shown as monospace or not?
	 */
	public get monospaceClass() : '' | 'text-monospace' {
		if (this._monospace !== null) return this._monospace ? 'text-monospace' : '';
		return this.isMonospaceType ? 'text-monospace' : '';
	}

	/**
	 * Some content, e.g. html-email-content, should be styled different than string.
	 */
	public get cardClasses() : 'px-3 border-left border-info' | '' {
		if (this.primitiveType === 'longText') return 'px-3 border-left border-info';
		return '';
	}
}
