import { PipeTransform} from '@angular/core';
import { Pipe } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'pSafeHtml' })
export class SafeHtmlPipe implements PipeTransform {
	constructor(private sanitized : DomSanitizer) {}

	/**
	 * Sanitize given html
	 */
	public transform(html : string) : SafeHtml {
		return this.sanitized.bypassSecurityTrustHtml(html);
	}
}
