import { OnDestroy } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Meta } from '@angular/platform-browser';

/**
 * Page not found
 */
@Component({
	selector: 'p-page-not-found',
	templateUrl: './page-not-found.component.html',
	styleUrls: ['./page-not-found.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundComponent implements OnDestroy {
	constructor(private meta : Meta) {
		// Set status code for prerender.io to 404 so the page will not be cached by prerender.io.
		// This is important because some bots will randomly check out many urls. Without
		// these all the urls would be cached by prerender.io.
		// So also https://prerender.io/documentation/best-practices
		this.meta.updateTag({ name: 'prerender-status-code', content: '404' });
	}

	public ngOnDestroy() : void {
		this.meta.removeTag("name='prerender-status-code'");
	}
}
