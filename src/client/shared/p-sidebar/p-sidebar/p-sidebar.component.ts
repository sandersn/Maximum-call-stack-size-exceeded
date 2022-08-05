import { Component, HostBinding, HostListener, Input, ChangeDetectionStrategy } from '@angular/core';
import { PSidebarService } from '@plano/client/shared/p-sidebar/p-sidebar.service';
import { Config } from '@plano/shared/core/config';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PThemeEnum } from '../../bootstrap-styles.enum';

@Component({
	selector: 'p-sidebar',
	templateUrl: './p-sidebar.component.html',
	styleUrls: ['./p-sidebar.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PSidebarComponent {
	@HostBinding('class.d-flex') protected _alwaysTrue = true;

	@HostBinding('class.p-0')
	@HostBinding('class.btn-frameless')
	@HostBinding('class.btn-dark')
	@HostBinding('class.border-right')
	@HostBinding('class.btn')
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	@HostBinding('class.collapsed') public get collapsed() : boolean {
		return !!this.pSidebarService.mainSidebarIsCollapsed;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	@HostBinding('class.desktop-mode') public get hideIfCollapsed() : boolean {
		return !Config.IS_MOBILE;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	@HostBinding('class.mobile-mode') public get mobileMode() : boolean {
		return Config.IS_MOBILE;
	}

	@HostBinding('class.uncollapsed') private get _classUncollapsed() : boolean { return !this.collapsed; }

	@HostListener('click') private _onClick() : void {
		if (!this.collapsed) return;
		this.toggleCollapsed();
	}

	@Input() public showStickyNoteIcon : boolean = false;
	@Input() public showStickyNoteIconDot : boolean = false;
	@Input() public showFilterIcon : boolean = false;
	@Input() public badgeContent : number | null = null;

	public config : typeof Config = Config;

	constructor(
		private pSidebarService : PSidebarService,
		private localize : LocalizePipe,
	) {
		this.initValues();
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public PThemeEnum = PThemeEnum;

	/**
	 * Init all necessary values for this class
	 */
	public initValues() : void {
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public toggleCollapsed(event ?: Event) : void {
		if (event) event.stopPropagation();
		this.pSidebarService.mainSidebarIsCollapsed = !this.pSidebarService.mainSidebarIsCollapsed;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showFilterIconPopover() : string {
		if (!this.showFilterIcon) return this.localize.transform('Filter aus');
		return this.localize.transform('Filter sind aktiv');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get badgeContentPopover() : string {
		return this.localize.transform('${amount} To-dos vorhanden', { amount : this.badgeContent!.toString() });
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showStickyNoteIconPopover() : string {
		if (!this.showStickyNoteIcon) return this.localize.transform('Kein Kommentar für dich vorhanden');
		return this.localize.transform('Kommentare für dich vorhanden');
	}
}
