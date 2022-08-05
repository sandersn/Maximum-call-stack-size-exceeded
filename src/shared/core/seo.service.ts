import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { OnDestroy} from '@angular/core';
import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { Config } from './config';
import { LocalizePipe } from './pipe/localize.pipe';

@Injectable({
	providedIn: 'root',
})
export class SeoService implements OnDestroy {
	constructor(
		@Inject(DOCUMENT) private readonly document : Document,
		private readonly router : Router,
		@Inject(LOCALE_ID) private locale : PSupportedLocaleIds,
		private meta : Meta,
		private title : Title,
		private localize : LocalizePipe,
	) {
		// title
		// eslint-disable-next-line literal-blacklist/literal-blacklist
		this.title.setTitle(this.localize.transform('Dr. Plano – Software für Schichtplanung & Kursbuchung'));

		// description
		// eslint-disable-next-line literal-blacklist/literal-blacklist
		const description = this.localize.transform('Dr. Plano – Online-Software für Schichtplanung & Kursbuchung in Kletterhallen, Boulderhallen und Sportstätten. Automatische Schichtverteilung, Arbeitszeiterfassung, Schichttausch, online Buchungssystem für Slots, Kurse & Gutscheine samt Online-Zahlung und automatischen Emails. Alles bequem auch über mobile Apps fürs Handy bedienbar.');
		this.meta.updateTag({ name: 'description', content: description });

		// og description
		const ogDescription = this.localize.transform('Schichtplanung & Kursbuchung in Kletterhallen, Boulderhallen und Sportstätten');
		this.meta.updateTag({ name: 'og:description', content: ogDescription });

		// start route listener
		this.routeListener = this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
		).subscribe(
			() => {
				let url = '';
				const urlTree = this.router.parseUrl(this.router.url);

				if (urlTree.root.hasChildren()) {

					const segments = urlTree.root.children['primary'].segments;

					if ((segments as unknown) && segments.length > 0) {
						url = segments.map(segment => segment.path).join('/');
					}
				}

				// update canonical link
				this.updateTag({
					rel: 'canonical',
					href: `${Config.FRONTEND_URL_LOCALIZED}/${url}`,
				});

				// og tags
				this.meta.updateTag({ name: 'og:url', content: `${Config.FRONTEND_URL_LOCALIZED}/${url}` });
				this.meta.updateTag({ name: 'og:locale', content: this.locale });
				this.meta.updateTag({ name: 'og:type', content: 'website' });
				this.meta.updateTag({ name: 'og:image', content: `${Config.FRONTEND_URL_LOCALIZED}/static/og_image.${Config.getLanguageCode()}.png` });

				// google search thumbnail
				this.meta.updateTag({ name: 'thumbnail', content: `${Config.FRONTEND_URL_LOCALIZED}/static/google_search_thumbnail.png` });

				// update all locale specific alternate links
				for (const currentLocale of Object.values(PSupportedLocaleIds)) {
					const countryCode = Config.getCountryCode(currentLocale);

					if (countryCode) {
						this.updateTag({
							hreflang: currentLocale,
							rel: 'alternate',
							href: `${Config.FRONTEND_URL}/${countryCode}/${url}`,
						});
					}
				}

				// update x-default alternativ link
				this.updateTag({
					hreflang: 'x-default',
					rel: 'alternate',
					href: `${Config.FRONTEND_URL}/${url}`,
				});
			},
		);
	}

	private routeListener : Subscription | null = null;

	/**
	 * Create or update a link tag
	 */
	private updateTag(tag : LinkDefinition) : void {
		const selector = this.parseSelector(tag);
		const linkElement = this.document.head.querySelector(selector) ??
            this.document.head.appendChild(this.document.createElement('link'));

		if (linkElement as unknown) {
			for (const property of Object.keys(tag)) {
				const key = property as keyof LinkDefinition;
				(linkElement as unknown as LinkDefinition)[key] = tag[property];
			}
		}
	}

	/**
	 * Remove a link tag from DOM
	 */
	private removeTag(tag : LinkDefinition) : void {
		const selector = this.parseSelector(tag);
		const linkElement = this.document.head.querySelector(selector);

		if (linkElement) {
			this.document.head.removeChild(linkElement);
		}
	}

	/**
	 * Get link tag
	 */
	private getTag(tag : LinkDefinition) : HTMLLinkElement | null {
		const selector = this.parseSelector(tag);

		return this.document.head.querySelector(selector);
	}

	/**
	 * Get all link tags
	 */
	private getTags() : NodeListOf<HTMLLinkElement> {
		return this.document.head.querySelectorAll('link');
	}

	/**
	 * Parse tag to create a selector
	 * @return selector to use in querySelector
	 */
	private parseSelector(tag : LinkDefinition) : string {
		// We assume rel always be there
		let selector = `link[rel="${tag['rel']}"]`;

		// hreflang is optional
		if (tag.hreflang)
			selector += `[hreflang="${tag['hreflang']}"]`;

		return selector;
	}

	/**
	 * Destroy route listener when service is destroyed
	 */
	public ngOnDestroy() : void {
		this.routeListener?.unsubscribe();
	}
}

export declare type LinkDefinition = {
	charset ?: string;
	crossorigin ?: string;
	href ?: string;
	hreflang ?: string;
	media ?: string;
	rel ?: string;
	rev ?: string;
	sizes ?: string;
	target ?: string;
	type ?: string;
} & {
	[prop : string] : string;
};
