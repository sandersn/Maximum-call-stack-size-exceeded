import { Component, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { Input } from '@angular/core';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { Config } from '@plano/shared/core/config';

/**
 * The available styles for the backend color
 */
export type BackgroundColorStyle = PThemeEnum.LIGHT | PThemeEnum.DARK | PThemeEnum.PRIMARY | 'darker' | 'white';

@Component({
	/* eslint-disable-next-line @angular-eslint/component-selector */
	selector: 'scroll-shadow-box',
	templateUrl: './scroll-shadow-box.component.html',
	styleUrls: ['./scroll-shadow-box.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollShadowBoxComponent {
	@Input() private backgroundStyleTop : BackgroundColorStyle | null = null;
	@Input() private backgroundStyleBottom : BackgroundColorStyle | null = null;
	@Input() private backgroundStyle : BackgroundColorStyle | null = null;
	@Input() public alwaysShowScrollbar : boolean = false;

	@Input() public contentContainerStyles : string | null = null;

	@Input() public fixedFooterTemplate : TemplateRef<unknown> | null = null;
	// @Input() public shadowsDisabled : boolean = false;

	constructor(
	) {
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shadowsDisabled() : boolean {
		// HACK: PLANO-16038 iOS has problems with the position of the sticky overlays.
		if (this.shadowsDisabledOnPlatform) return true;
		if (this.shadowsDisabledOnBrowser) return true;

		return false;
	}

	private get shadowsDisabledOnPlatform() : boolean {
		// HACK: PLANO-16038 iOS has problems with the position of the sticky overlays.
		if (!Config.platform) return false;
		if (Config.platform.toLowerCase() === 'appIOS'.toLowerCase()) return true;
		return false;
	}
	private get shadowsDisabledOnBrowser() : boolean {
		// HACK: PLANO-16038 iOS has problems with the position of the sticky overlays.
		if (!Config.browser.name) return false;
		if (Config.browser.name.toLowerCase() === 'Safari'.toLowerCase()) return true;
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showFooterAsFixed() : boolean {
		if (Config.IS_MOBILE) return false;
		return !!this.fixedFooterTemplate;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get backgroundColor() : BackgroundColorStyle | undefined {
		if (this.backgroundStyle) return this.backgroundStyle;
		return undefined;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get backgroundColorTop() : BackgroundColorStyle | undefined {
		if (this.backgroundStyleTop) return this.backgroundStyleTop;
		if (this.backgroundStyle) return this.backgroundStyle;
		return undefined;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get backgroundColorBottom() : BackgroundColorStyle | undefined {
		if (this.backgroundStyleBottom) return this.backgroundStyleBottom;
		if (this.backgroundStyle) return this.backgroundStyle;
		return undefined;
	}
}
