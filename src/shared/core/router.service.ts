/**	NOTE: Do not make this service more complex than it already is */
/* eslint complexity: ["error", 21]  */
import { Observable, Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { Injectable, NgZone } from '@angular/core';
import { NavigationExtras, Event, UrlTree } from '@angular/router';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute } from '@angular/router';
import { SalesTabNames } from '@plano/client/sales/sales-tab-names.enum';
import { Config } from './config';
import { LogService } from './log.service';
import { PScrollToSelectorService } from './scroll-to-selector.service';

// TODO: 	Create a type that includes all possible routes.
// 				Problem: Some possible routes are unified by lazy loaded parts. Probably not possible to get lazy children as readonly array.
// 				IDEA: I can probably switch to relative paths everywhere to fix the typing issue above.
// 				type PossibleClientRoutes = typeof CLIENT_ROUTES[number]['path'] | `${typeof CLIENT_ROUTES[number]['path']}/${typeof CLIENT_ROUTES[number]['children'][number]['path']}`
// 				type PossibleAdminRoutes = typeof ADMIN_ROUTES[number]['path'] | `${typeof ADMIN_ROUTES[number]['path']}/${typeof ADMIN_ROUTES[number]['children'][number]['path']}`
// 				type PossibleRoutes = '/' | PossibleClientRoutes | PossibleAdminRoutes;

type StoredRoute = { url : string, queryParams ?: { [key : string] : string } };

export type ScrollTarget = `#scroll-target-id-${string}` | `.${string}`;

/** A router wrapper, adding extra functions. */
@Injectable( { providedIn: 'root' } )
export class PRouterService {
	constructor(
		private router : Router,
		private location : Location,
		private activatedRoute : ActivatedRoute,
		private console : LogService,
		private zone : NgZone,
		private pScrollToSelectorService : PScrollToSelectorService,
	) {
		const route = this.urlToStoredRoute(this.router.url);
		this.addUrl(route);

		this.setRouterListener();
		this.setSmartphoneAppListener();
	}

	private STORED_URL_BLACKLIST = [
		'client/menu',
		'client/report/0/0',
		'client/scheduling/month/0',
	] as const;

	/** @see Router['url'] */
	public get url() : string {
		return this.router.url;
	}

	private storedUrls : StoredUrls = new StoredUrls();

	/**
	 * Shorthand to make our PRouterService look like RouterService as much as possible.
	 */
	public get events() : Observable<Event> {
		return this.router.events;
	}

	private setSmartphoneAppListener() : void {
		if (Config.platform !== 'appAndroid' && Config.platform !== 'appIOS') return;

		// inform app about current route
		// This service will never be unloaded
		this.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(window as any).nsWebViewInterface.emit('urlChanged', event.url);
			}
		});

		// navigate back on app back button
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any).nsWebViewInterface.on('backPressed', (_data : any) => {
			// WebViewInterface events are not called in angular zone. But routing needs this…
			this.zone.run(() => {
				this.navBack();
			});
		});
	}

	/**
	 * It is possible that e.g p-tabs has silently changed the url. In that case, store
	 * the latest url available as storedPreviousUrl and not the stored .storedCurrentUrl.
	 */
	private setRouterListener() : void {
		let currentUrl : string;

		this.events.subscribe((event) => {
			if (event instanceof NavigationStart) currentUrl = this.location.path();
			if (!(event instanceof NavigationEnd)) return;
			this.storeNewUrl(currentUrl, event.url);
		});
	}

	private storeNewUrl(currentUrl : string, newUrl : string) : void {
		// If required url has not changed, we have nothing todo.
		const route = this.urlToStoredRoute(newUrl);
		if (this.storedUrls.mostRecent !== null && this.storedUrls.mostRecent.url === route.url) return;

		// It is possible that p-tabs has silently changed the url.
		// In that case, overwrite the latest stored url
		if (this.activatedRoute.snapshot.paramMap.has('opentab')) this.addUrl({url: currentUrl, queryParams: this.activatedRoute.snapshot.queryParams}, true);

		this.addUrl(route);
	}

	/**
	 * Turns string url into StoredRoute
	 */
	public urlToStoredRoute(url : string) : StoredRoute {
		const urlTree = this.router.parseUrl(url);
		const urlTreeChildrenPrimary = urlTree.root.children['primary'];
		if (!(urlTreeChildrenPrimary as unknown)) {
			this.console.warn('Strange behavior in RouterService');
			return { url: '/' };
		}
		const urlWithoutParams = urlTreeChildrenPrimary.segments.map(it => it.path).join('/');
		let resultUrl = this.removeTrailingSlash(urlWithoutParams);
		// Make sure the url '/' wil not result in a undefined value
		resultUrl = resultUrl.length ? '/' : resultUrl;
		const { queryParams } : UrlTree = urlTree;
		return { url: resultUrl, queryParams: queryParams };
	}

	private removeTrailingSlash(input : string) : string {
		if (!input) return input;
		if (!input.endsWith('/')) return input;
		return input.substring(0, input.length - 1);
	}

	/**
	 * Nav to current history entry.
	 * (e.g. used when last navigation did not appear in history. like then user opens mobile menu)
	 */
	public navToCurrentHistoryEntry() : void {
		if (this.storedUrls.mostRecent === null || this.storedUrls.length <= 1) {
			this.navigate([this.getFallbackUrl()], { replaceUrl: true });
			return;
		}
		this.navigate([this.storedUrls.mostRecent.url], {queryParams: this.storedUrls.mostRecent.queryParams!});
	}

	/**
	 * Navigate back to the previous url in our store.
	 * If our store does not provide a good url, it will calculate some fallback-url.
	 */
	public navBack() : void {
		if (this.storedUrls.mostRecent === null || this.storedUrls.length <= 1) {
			// The fallback url will be calculated based on the most recent url.
			// So we need to handle this before we remove urls from store.
			this.navigate([this.getFallbackUrl()], { replaceUrl: true });
			return;
		}

		this.forgetMostRecentHistoryEntry();
		this.navigate([this.storedUrls.mostRecent.url], {queryParams: this.storedUrls.mostRecent.queryParams!});
	}

	private forgetMostRecentHistoryEntry() : void {
		this.storedUrls.pop();
	}

	/**
	 * Navigate to another Page.
	 * If you don’t want the current url in your history, provide a { replaceUrl: true } as second param.
	 */
	public navigate(commands : string[], extras ?: NavigationExtras) : void {
		if (extras?.replaceUrl) this.forgetMostRecentHistoryEntry();
		this.router.navigate(commands, extras);
	}

	private isPartOfBlacklist(url : string) : boolean {
		return !!this.STORED_URL_BLACKLIST.some((blacklistItem) => url.includes(blacklistItem));
	}

	private addUrl(input : StoredRoute, replacePrevious ?: boolean) : void {
		if (this.isPartOfBlacklist(input.url)) return;
		this.storedUrls.addUrl(input, replacePrevious);
	}

	private getFallbackUrlForInterfaceSubPages(mostRecentUrl : string) : string | null {
		const INTERFACES_URL = '/client/plugin/interfaces';
		if (mostRecentUrl.match(/^\/?client\/plugin\/boulderado/)) return INTERFACES_URL;
		if (mostRecentUrl.match(/^\/?client\/plugin\/freeclimber/)) return INTERFACES_URL;
		if (mostRecentUrl.match(/^\/?client\/plugin\/beta7/)) return INTERFACES_URL;
		if (mostRecentUrl.match(/^\/?client\/plugin\/routes-manager/)) return INTERFACES_URL;
		if (mostRecentUrl.match(/^\/?client\/plugin\/kletterszene/)) return INTERFACES_URL;
		if (mostRecentUrl.match(/^\/?client\/plugin\/paypal/)) return INTERFACES_URL;
		return null;
	}

	private getFallbackUrl() : string {
		if (!this.storedUrls.mostRecent) {
			return Config.IS_MOBILE ? '/client/desk' : '/client';
		}

		if (this.storedUrls.mostRecent.url.match(/^\/?client\/email\/.+/) !== null) return '/client/plugin/emails';
		if (this.storedUrls.mostRecent.url.match(/^\/?client\/menu\/.+/) !== null) return '/client/desk';
		if (this.storedUrls.mostRecent.url.match(/^\/?client\/notifications\/.+/) !== null) return '/client/scheduling';
		if (this.storedUrls.mostRecent.url.match(/^\/?client\/shift-exchange\/.+/) !== null) return Config.IS_MOBILE ? '/client/desk' : '/client/shift-exchanges';
		if (this.storedUrls.mostRecent.url.match(/^\/?client\/workingtime\/.+/) !== null) return '/client/report';
		if (this.storedUrls.mostRecent.url.match(/^\/?client\/absence\/.+/) !== null) return '/client/report';
		if (this.storedUrls.mostRecent.url.match(/^\/?client\/voucher\/.+/) !== null) return Config.IS_MOBILE ? '/client/desk' : `/client/sales/${SalesTabNames.GIFT_CARDS}`;
		if (this.storedUrls.mostRecent.url.match(/^\/?client\/booking\/.+/) !== null) return `/client/sales/${SalesTabNames.BOOKINGS}`;

		const fallbackUrlForInterfaceSubPages = this.getFallbackUrlForInterfaceSubPages(this.storedUrls.mostRecent.url);
		if (fallbackUrlForInterfaceSubPages !== null) return fallbackUrlForInterfaceSubPages;

		if (this.storedUrls.mostRecent.url.match(/^\/?client\/plugin\/.+\/.+/) !== null) return '/client/plugin';


		// If there is still client in the url, then this is some other sup-page of client.
		// Like shiftmodel, member, testaccount, etc.
		if (this.storedUrls.mostRecent.url.match(/^\/?client\//)) {
			// In most cases, desk is the go-to page for mobile-devices.
			if (Config.IS_MOBILE) return '/client/desk';

			return '/client';
		}

		return '';
	}

	// TODO: 	Remove this deprecated method.
	// 				I once tried to remove it, but then got a mess of bugs in the p-tabs component. See PLANO-49677
	/**
	 * Use this id you want to update the url without a real navigation
	 * @deprecated Use .navigate() instead
	 */
	public updateUrl(commands : string[], extras ?: { replaceUrl : boolean }) : void {
		if (extras?.replaceUrl) this.forgetMostRecentHistoryEntry();
		if (commands.length > 1) throw new Error('Multiple urls supported yet');
		this.addUrl({url: commands[0]}, true);
		this.location.replaceState(commands[0]);
	}

	/**
	 * Check if there is a fragment in the url, and if so, try to scroll to a related id in the html
	 */
	public handleAnchorLinks() : Subscription {
		return this.activatedRoute.fragment.subscribe((fragment) => {
			if (!fragment) return;
			this.console.debug(`There is an anchor-link => ${fragment}`);

			const FRAGMENT = this.activatedRoute.snapshot.fragment;
			if (!FRAGMENT) return;

			this.scrollToSelector(
				`#${FRAGMENT}` as `#scroll-target-id-${string}`,
				undefined,
				true,
				true,
				false,
			);
		});
	}

	/** @see PScrollToSelectorService['scrollToSelector'] */
	public scrollToSelector(
		selector : ScrollTarget,
		scrollIntoViewOptions ?: Partial<ScrollIntoViewOptions>,
		animate : boolean = true,
		ignoreScrollPosition : boolean = false,
		waitForApiLoaded : boolean = true,
	) : void {
		this.pScrollToSelectorService.scrollToSelector(selector, scrollIntoViewOptions, animate, ignoreScrollPosition, waitForApiLoaded);
	}
}


/** A class for the router service to store routes in a list. */
class StoredUrls {
	private storage : StoredRoute[] = [];
	private logRoutingToBrowserConsole : boolean = false;

	constructor(
	) {
	}

	/**
	 * Add an item or items to the array of stored routes
	 */
	public push(item : StoredRoute) : number | void {
		const inputWithoutTrainingSlash = this.removeTrailingSlash(item);

		/**
		 * TODO: [PLANO-110851] 	This should be stored in a array of forbidden urls. See commit e7e58cd8 for possible implementation.
		 *  			Check if PLANO-46646 is still working afterwards.
		 */
		// Never store start page. I user needs to be navigated to start page, then by fallback, not by navigation history.
		if (inputWithoutTrainingSlash.url === '') return;
		// Visiting this site would log out the user. This should not happen by browsing the history.
		if (inputWithoutTrainingSlash.url === Config.LOGOUT_PATH) return;

		// Make sure there are no duplicate urls next to each other
		if (this.mostRecent !== null && this.mostRecent.url === inputWithoutTrainingSlash.url) return;
		// eslint-disable-next-line no-console
		if (this.logRoutingToBrowserConsole) console.log('+', inputWithoutTrainingSlash);
		return this.storage.push(inputWithoutTrainingSlash);
	}

	/**
	 * Like Array.pop(…)
	 */
	public pop() : StoredRoute | null {
		const poppedItem = this.storage.pop();
		// eslint-disable-next-line no-console
		if (this.logRoutingToBrowserConsole) console.log('-', poppedItem);
		return poppedItem !== undefined ? poppedItem : null;
	}

	/**
	 * Get item from array by index
	 */
	private get(index : number) : StoredRoute | null {
		return this.storage[index] || null;
	}

	/**
	 * How many items are stored in our 'browser history'
	 */
	public get length() : number {
		return this.storage.length;
	}

	/**
	 * Add a url to our store
	 */
	public addUrl(input : StoredRoute, replacePrevious ?: boolean) : void {
		const inputWithoutTrainingSlash = this.removeTrailingSlash(input);
		// Make sure there are no duplicate urls next to each other
		if (this.mostRecent !== null && this.mostRecent.url === inputWithoutTrainingSlash.url) return;
		if (replacePrevious) this.pop();
		this.push(input);
	}

	/**
	 * The most recent url in the array.
	 * If the user jumped with a direct link into the app, the mostRecent equals the current url.
	 */
	public get mostRecent() : StoredRoute | null {
		return this.get(this.storage.length - 1);
	}

	public set mostRecent(input : StoredRoute | null) {
		if (input === null) throw new Error('Can not save route `null` to mostRecent');
		this.pop();
		this.push(input);
	}

	private removeTrailingSlash(input : StoredRoute) : StoredRoute {
		if (!input.url) return input;
		if (!input.url.endsWith('/')) return input;
		input.url = input.url.substring(0, input.url.length - 1);
		return input;
	}
}
