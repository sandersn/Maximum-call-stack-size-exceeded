/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { OnChanges, TemplateRef } from '@angular/core';
import { Component, Input, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { Config } from '../../config';
import { ModalService } from '../../p-modal/modal.service';
import { PlanoFaIconPool } from '../../plano-fa-icon-pool.enum';

@Component({
	selector: 'p-youtube[key]',
	templateUrl: './p-youtube.component.html',
	styleUrls: ['./p-youtube.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PYoutubeComponent implements OnChanges {
	@Input() public key ! : string;

	/**
	 * The youtube thumbnail quality values.
	 * Possible values are "default", "mqdefault", "hqdefault", "sddefault" and "maxresdefault". cSpell:disable-line
	 * Source: https://stackoverflow.com/a/2068371
	 */
	@Input() public quality : string | null = null;

	@ViewChild('videoModalContent', { static: true }) videoModalContent ! : ElementRef<TemplateRef<unknown>>;

	constructor(
		public modalService : ModalService,
		private sanitizer : DomSanitizer,
	) {

	}

	public PlanoFaIconPool = PlanoFaIconPool;

	public ngOnChanges() : void {
		if (!this.key) {
			throw new Error(`"key" is a required value.`);
		}

		if (!this.quality) {
			throw new Error(`"quality" is a required value.`);
		}

		this._imageUrl = this.sanitizer.
			bypassSecurityTrustUrl(`https://img.youtube.com/vi/${this.key}/${this.quality}.jpg`);

		// The player parameter "showinfo" has been deprecated in 2018. Therefore the video title will always be shown in embedded videos. For more info about available parameters head over to https://developers.google.com/youtube/player_parameters
		// cSpell:ignore showinfo
		this._iFrameUrl = this.sanitizer.
			bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.key}?rel=0`);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public onImageClick() : void {
		// On ios app the webview could not show youtube iframe. So, we let the app open the video in external browser.
		if (Config.platform === 'appIOS') {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(window as any).nsWebViewInterface.emit('openYoutube', this.key);
		} else {
			// Otherwise open our own modal with embedded video
			this.modalService.openModal(this.videoModalContent, {size: BootstrapSize.LG});
		}
	}

	private _imageUrl : SafeUrl | null = null;
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get imageUrl() : SafeUrl | null {
		return this._imageUrl;
	}

	private _iFrameUrl : SafeResourceUrl | null = null;
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get iFrameUrl() : SafeResourceUrl | null {
		return this._iFrameUrl;
	}
}
