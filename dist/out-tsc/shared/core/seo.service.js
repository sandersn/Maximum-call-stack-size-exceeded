var _a, _b, _c;
import { __decorate, __metadata, __param } from "tslib";
import { filter } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { Config } from './config';
import { LocalizePipe } from './pipe/localize.pipe';
let SeoService = class SeoService {
    constructor(document, router, locale, meta, title, localize) {
        this.document = document;
        this.router = router;
        this.locale = locale;
        this.meta = meta;
        this.title = title;
        this.localize = localize;
        this.routeListener = null;
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
        this.routeListener = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
            let url = '';
            const urlTree = this.router.parseUrl(this.router.url);
            if (urlTree.root.hasChildren()) {
                const segments = urlTree.root.children['primary'].segments;
                if (segments && segments.length > 0) {
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
        });
    }
    /**
     * Create or update a link tag
     */
    updateTag(tag) {
        var _a;
        const selector = this.parseSelector(tag);
        const linkElement = (_a = this.document.head.querySelector(selector)) !== null && _a !== void 0 ? _a : this.document.head.appendChild(this.document.createElement('link'));
        if (linkElement) {
            for (const property of Object.keys(tag)) {
                const key = property;
                linkElement[key] = tag[property];
            }
        }
    }
    /**
     * Remove a link tag from DOM
     */
    removeTag(tag) {
        const selector = this.parseSelector(tag);
        const linkElement = this.document.head.querySelector(selector);
        if (linkElement) {
            this.document.head.removeChild(linkElement);
        }
    }
    /**
     * Get link tag
     */
    getTag(tag) {
        const selector = this.parseSelector(tag);
        return this.document.head.querySelector(selector);
    }
    /**
     * Get all link tags
     */
    getTags() {
        return this.document.head.querySelectorAll('link');
    }
    /**
     * Parse tag to create a selector
     * @return selector to use in querySelector
     */
    parseSelector(tag) {
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
    ngOnDestroy() {
        var _a;
        (_a = this.routeListener) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
};
SeoService = __decorate([
    Injectable({
        providedIn: 'root',
    }),
    __param(0, Inject(DOCUMENT)),
    __param(2, Inject(LOCALE_ID)),
    __metadata("design:paramtypes", [Document, typeof (_a = typeof Router !== "undefined" && Router) === "function" ? _a : Object, String, typeof (_b = typeof Meta !== "undefined" && Meta) === "function" ? _b : Object, typeof (_c = typeof Title !== "undefined" && Title) === "function" ? _c : Object, LocalizePipe])
], SeoService);
export { SeoService };
//# sourceMappingURL=seo.service.js.map