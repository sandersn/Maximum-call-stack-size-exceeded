import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';

@Pipe({ name: 'pUrlForHumans' })
export class PUrlForHumansPipe implements PipeTransform {
	constructor() {}

	/**
	 * Transform a url to a nice clean thing.
	 * @example
	 *   http://www.dr-plano.com to dr-plano.com
	 */
	public transform(url : string) : string | undefined {
		// remove protocol like 'https://'
		const withoutProtocol = url.replace(/^https?:\/\/(?:www\.)?/, '');

		const urlArray = withoutProtocol.split(/\//);
		const domain = urlArray.shift();
		let tail = urlArray.join('/');

		if (tail.length) {
			if (tail.length > 8) tail = `${tail.substring(0, 5)}…`;
			return `${domain}/${tail}`;
		} else {
			return domain;
		}

	}
}
