/* eslint-disable @angular-eslint/directive-selector */
import { Directive, Input, HostListener } from '@angular/core';
import { Config } from '../config';

@Directive({
	selector: '[externalLink]',
})
export class ExternalLinkDirective {
	@Input() private externalLink ! : string;

	// eslint-disable-next-line jsdoc/require-jsdoc
	@HostListener('click') public onClick() : void {
		// let app handle this?
		if (Config.platform === 'appAndroid' || Config.platform === 'appIOS') {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(window as any).nsWebViewInterface.emit('externalLink', this.externalLink);
		} else {
			// otherwise just open
			if (this.externalLink.startsWith('mailto:'))
				window.location.href = this.externalLink;
			else
				window.open(this.externalLink, '_blank');
		}
	}
}
