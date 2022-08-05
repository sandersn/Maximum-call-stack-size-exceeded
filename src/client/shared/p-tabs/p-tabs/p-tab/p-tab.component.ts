import { AfterContentInit } from '@angular/core';
import { Component, ChangeDetectorRef, ChangeDetectionStrategy, EventEmitter, Output, HostBinding } from '@angular/core';
import { Input, ElementRef } from '@angular/core';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { PFaIcon } from '../../../../../shared/core/component/fa-icon/fa-icon-types';
import { PDictionarySourceString } from '../../../../../shared/core/pipe/localize.dictionary';
import { AttributeInfoComponentBaseDirective } from '../../../p-attribute-info/attribute-info-component-base';
import { PBadgeComponentInterface } from '../../../shared/p-badge/p-badge.types';

export enum PTabSizeEnum {
	LG = 'lg',
	SM = 'sm',
	FRAMELESS = 'frameless',
}

@Component({
	selector: 'p-tab',
	templateUrl: './p-tab.component.html',
	styleUrls: ['./p-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PTabComponent extends AttributeInfoComponentBaseDirective implements AfterContentInit {
	protected override attributeInfoRequired = false;

	@Input() public label : string | null = null;
	@Input() public hasDanger : boolean = false;
	@Input('badgeContent') private _badgeContent : PBadgeComponentInterface['content'] = null;
	@Input() public hasFilter : boolean | null = null;
	@Input() public initialActiveTab : boolean = false;
	@Input() public icon : PFaIcon | null = null;
	@Input() public description : PDictionarySourceString | null = null;

	/* eslint-disable @angular-eslint/no-output-native */
	@Output() public select : EventEmitter<boolean> = new EventEmitter<boolean>();

	@HostBinding('class.flex-grow-1')
	private _active : boolean = false;

	@HostBinding('class.p-5')
	private get _p5() : boolean {
		return this.size === PTabSizeEnum.LG && !Config.IS_MOBILE;
	}
	@HostBinding('class.p-4')
	private get _p4() : boolean {
		return this.size === PTabSizeEnum.LG && Config.IS_MOBILE;
	}
	@HostBinding('class.p-3')
	private get _p3() : boolean {
		return this.size === PTabSizeEnum.SM;
	}
	@HostBinding('class.p-0')
	private get _p0() : boolean {
		return this.size === PTabSizeEnum.FRAMELESS;
	}

	@Input() public size : PTabSizeEnum = PTabSizeEnum.LG;

	/**
	 * This id is used to find tabs by url param
	 */
	@Input() public urlName : string | null = null;

	@HostBinding('hidden') private get isHidden() : boolean {
		return !this.active;
	}

	public hover : boolean = false;

	constructor(
		public el : ElementRef<HTMLElement>,
		protected override changeDetectorRef : ChangeDetectorRef,
		protected override console : LogService,
	) {
		super(true, changeDetectorRef, console);
	}

	/**
	 * Should there be a little dot on this tab? Maybe with a icon or a number inside?
	 */
	public get badgeContent() : PBadgeComponentInterface['content'] {
		if (this._badgeContent !== null) return this._badgeContent;
		return this.hasDanger;
	}

	/**
	 * Is this the currently selected tab?
	 */
	public get active() : boolean {
		return this._active;
	}

	/**
	 * Should this be the initially/currently selected tab?
	 */
	public set active(input : boolean) {
		this.select.emit(input);
		this._active = input;
		this.changeDetectorRef.detectChanges();
	}

	public override ngAfterContentInit() : never {
		if (this.label === null && this.icon === null) throw new Error('[label] OR [icon] must be set in p-tab');
		return super.ngAfterContentInit();
	}
}
