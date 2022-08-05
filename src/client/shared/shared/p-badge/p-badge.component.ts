import { DecimalPipe } from '@angular/common';
import { AfterViewInit } from '@angular/core';
import { Component, ChangeDetectionStrategy, HostBinding, Renderer2, ElementRef } from '@angular/core';
import { Input } from '@angular/core';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { PBadgeAlign, PBadgeContent } from './p-badge.types';
import { PBadgeIcon, PBadgeComponentInterface } from './p-badge.types';
import { LogService } from '../../../../shared/core/log.service';
import { BootstrapSize, PThemeEnum } from '../../bootstrap-styles.enum';
import { PFormControlComponentInterface } from '../../p-forms/p-form-control.interface';

@Component({
	selector: 'p-badge',
	templateUrl: './p-badge.component.html',
	styleUrls: ['./p-badge.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PBadgeComponent implements PBadgeComponentInterface, AfterViewInit, PComponentInterface {
	@HostBinding('class.border')
	@HostBinding('class.badge')
	@HostBinding('class.todo-badge') private _alwaysTrue = true;

	@HostBinding('class.text-skeleton-animated')
	@Input() public isLoading : PComponentInterface['isLoading'] = null;

	@Input() public theme : PThemeEnum = PThemeEnum.DANGER;
	@Input() public content : PBadgeContent | null = null;
	@Input() public align : PBadgeAlign = false;
	@Input() public size ?: PFormControlComponentInterface['size'] = null;

	@HostBinding('class.small') private get hasClassSmall() : boolean {
		return this.size === BootstrapSize.SM;
	}
	@HostBinding('class.p-1') private get hasClassLarge() : boolean {
		return this.size === BootstrapSize.LG;
	}

	@HostBinding('class.empty') private get isEmpty() : boolean {
		return this.content === null || this.content === true;
	}

	constructor(
		private renderer : Renderer2,
		private element : ElementRef<HTMLElement>,
		private decimalPipe : DecimalPipe,
		private console : LogService,
	) {
	}

	public ngAfterViewInit() : void {
		if (!this.element.nativeElement.classList.contains(`badge-${this.theme}`)) {
			this.renderer.addClass(this.element.nativeElement, `badge-${this.theme}`);
		}

		if (!this.element.nativeElement.classList.contains(`border-${this.borderColor}`)) {
			this.renderer.addClass(this.element.nativeElement, `border-${this.borderColor}`);
		}

		if (this.textColor && !this.element.nativeElement.classList.contains(`text-${this.textColor}`)) {
			this.renderer.addClass(this.element.nativeElement, `text-${this.textColor}`);
		}

		if (this.align && !this.element.nativeElement.classList.contains(`align-${this.align}`)) {
			this.renderer.addClass(this.element.nativeElement, `align-${this.align}`);
		}

		if (this.textColor === this.theme) {
			const content = this.content ? `Content: »${this.content}«` : '';
			this.console.error(`p-badge: Icon color AND theme is: »${this.icon}«. Icon is probably invisible. ${content}`);
		}
	}

	private get borderColor() : PThemeEnum {
		if (this.icon === 'times') return PThemeEnum.DANGER;
		if (this.icon === 'check') return PThemeEnum.SUCCESS;
		return this.theme;
	}

	private get textColor() : PThemeEnum | undefined {
		if (this.icon && this.borderColor !== this.theme) return this.borderColor;
		return undefined;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get icon() : PBadgeIcon | undefined {
		if (typeof this.content === 'number') {
			return undefined;
		}
		if (this.content === 'times' || this.content === 'check' || this.content === 'question') {
			return this.content;
		}
		return undefined;
	}

	@HostBinding('class.no-text')
	private get noText() : boolean {
		return !this.text;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get text() : string | null {
		if (typeof this.content === 'boolean') return `&nbsp;`;
		if (typeof this.content === 'number') return this.decimalPipe.transform(this.content);
		if (typeof this.content === 'string') return this.content;
		return this.content;
	}

}
