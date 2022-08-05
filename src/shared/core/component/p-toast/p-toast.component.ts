import { NgProgressComponent } from 'ngx-progressbar';
import { Subscription } from 'rxjs';
import { Md5 } from 'ts-md5/dist/md5';
import { AfterViewInit, OnDestroy} from '@angular/core';
import { Component, HostBinding, Input, ChangeDetectionStrategy, ViewChild, HostListener } from '@angular/core';
import { ExtendedToastObject, ToastsService } from '@plano/client/service/toasts.service';
import { PAlertTheme, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { Config } from '../../config';
import { assumeNonNull } from '../../null-type-utils';
import { LocalizePipe } from '../../pipe/localize.pipe';
import { PlanoFaIconPool } from '../../plano-fa-icon-pool.enum';
import { FaIcon } from '../fa-icon/fa-icon-types';

@Component({
	selector: 'p-toast[toast]',
	templateUrl: './p-toast.component.html',
	styleUrls: ['./p-toast.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PToastComponent implements AfterViewInit, OnDestroy {
	@Input() public toast ! : ExtendedToastObject;
	@Input('theme') public _theme ?: PAlertTheme;

	@HostBinding('class.d-md-block')
	@HostBinding('class.d-none') private get _hasFoo() : boolean {
		return !this.toast.visibleOnMobile;
	}

	@HostBinding('class.mb-3') protected _alwaysTrue = true;

	@ViewChild('progressBar', { static: false }) public progressBar : NgProgressComponent | null = null;

	@HostListener('mouseover') private _mouseover(_event : Event) : void {
		this.toast.progressPaused$.next(true);
	}
	@HostListener('mouseleave') private _mouseleave(_event : Event) : void {
		this.toast.progressPaused$.next(false);
	}

	constructor(
		public toasts : ToastsService,
		private localize : LocalizePipe,
	) {
	}

	private subscription : Subscription | null = null;

	/** @see NgProgressComponent['speed'] */
	public get progressbarSpeed() : NgProgressComponent['speed'] {
		return this.toasts.PROGRESSBAR_SPEED;
	}

	public ngAfterViewInit() : void {
		const visibilityDuration = this.toasts.visibilityDurationToNumber(this.toast.visibilityDuration ?? 'infinite');
		if (visibilityDuration !== null) {
			if (!this.notFirefox) return;
			assumeNonNull(this.progressBar);
			this.progressBar.color = '#ffffffaa';

			this.subscription = this.toast.progressChange$.subscribe((input) => {
				switch (input) {
					case 'start':
						this.progressBar?.start();
						break;
					case 'complete':
						this.progressBar?.complete();
						break;
					default:
						this.progressBar?.set(input);
				}
			});
		}
	}

	public visible : boolean = true;

	/**
	 * A type for Alerts, that defines mainly the the color of a alert component
	 */
	public get theme() : PAlertTheme {
		if (this._theme !== undefined) return this._theme;
		if (this.toast.theme !== undefined) return this.toast.theme;
		return PThemeEnum.PRIMARY;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get icon() : FaIcon | null {
		if (this.toast.icon !== undefined) return this.toast.icon;
		if (this.theme === 'primary') return PlanoFaIconPool.PUSH_NOTIFICATION;
		if (this.theme === 'warning') return 'exclamation-triangle';
		if (this.theme === 'info') return PlanoFaIconPool.MORE_INFO;
		if (this.theme === 'danger') return PlanoFaIconPool.NOT_POSSIBLE;
		if (this.theme === 'success') return 'thumbs-up';
		return null;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get title() : string | null {
		if (this.toast.title !== undefined) return this.toast.title;
		switch (this.theme) {
			case 'warning':
				return this.localize.transform('Achtung');
			case 'info':
				return this.localize.transform('Info');
			case 'danger':
				return this.localize.transform('Fehler!');
			case 'success':
				return this.localize.transform('Yeah!');
			case 'primary':
			default:
				return this.localize.transform('Hey…');
		}
	}

	/**
	 * when user clicked dismiss cross or btn
	 */
	public onDismiss() : void {
		this.visible = false;
		this.toasts.removeToast(this.toast);
	}

	/**
	 * when user clicked close btn
	 */
	public onClose() : void {
		this.onDismiss();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get textWhite() : boolean {
		return this.theme !== 'plain' && this.theme !== 'light';
	}

	public ngOnDestroy() : void {
		this.subscription?.unsubscribe();
	}

	/**
	 * Create unique hash that can be used as id
	 */
	public get titleHash() : string {
		const unHashedString = this.toast.title ?? this.toast.content;
		return Md5.hashStr(unHashedString);
	}

	/** Only show progressbar if this is not Firefox PLANO-149796 */
	public get notFirefox() : boolean {
		return Config.browser.name !== 'firefox';
	}
}
