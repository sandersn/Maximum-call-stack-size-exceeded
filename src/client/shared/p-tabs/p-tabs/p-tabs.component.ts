import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { AfterContentInit, OnDestroy, AfterViewInit} from '@angular/core';
import { Component, ChangeDetectionStrategy, ContentChildren, QueryList, EventEmitter, Output, ChangeDetectorRef, ElementRef, ViewChild, Input, HostBinding, NgZone } from '@angular/core';
import { ActivatedRoute, RoutesRecognized } from '@angular/router';
import { FLEX_GROW_ON_BOOLEAN_TRIGGER, FLEX_GROW_ON_NGIF_TRIGGER } from '@plano/animations';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { LogService } from '@plano/shared/core/log.service';
import { PRouterService } from '@plano/shared/core/router.service';
import { PTabComponent } from './p-tab/p-tab.component';
import { Config } from '../../../../shared/core/config';
import { BootstrapSize, PThemeEnum } from '../../bootstrap-styles.enum';

export enum PTabsTheme {
	DEFAULT,
	CLEAN,
}

@Component({
	selector: 'p-tabs',
	templateUrl: './p-tabs.component.html',
	styleUrls: ['./p-tabs.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	animations: [ FLEX_GROW_ON_BOOLEAN_TRIGGER, FLEX_GROW_ON_NGIF_TRIGGER ],
})
export class PTabsComponent implements PComponentInterface, AfterContentInit, AfterViewInit, OnDestroy {

	/**
	 * Should the tabs have more or less spacing around its content?
	 */
	@Input() public size : BootstrapSize.SM | null = null;

	/**
	 * Is this tabs component used at the top of a page?
	 * Will effect some margins, paddings etc.
	 */
	@HostBinding('class.page-sub-nav')
	@Input() public pageSubNav : boolean = false;

	@HostBinding('class.d-flex')
	@HostBinding('class.flex-column') private _alwaysTrue = true;

	/**
	 * Should there be a card around this component?
	 * Note that this does not effect the theme of the tabs.
	 */
	@HostBinding('class.card')
	public get hasCard() : boolean {
		if (this._card === null) return this.theme === PTabsTheme.DEFAULT;
		return this._card;
	}

	@Input('card') private set setCard(input : boolean) {
		this._card = input;
	}

	@HostBinding('class.theme-clean')
	private get hasCleanTheme() : boolean {
		return this.theme === PTabsTheme.CLEAN;
	}

	@HostBinding('class.theme-default')
	private get hasDefaultTheme() : boolean {
		return this.theme === PTabsTheme.DEFAULT;
	}

	@Input() public theme : PTabsTheme = PTabsTheme.DEFAULT;

	@HostBinding('class.taps-dark-mode')
	@Input() public darkMode : boolean = false;
	@Input() public isLoading : PComponentInterface['isLoading'] = false;

	/**
	 * If this is true, UI looks like normal tabs.
	 * If false, UI shows usual buttons with rounded corners and some whitespace around.
	 * The second version is equal to what we use on narrow screens.
	 */
	@Input() public tryToStickButtonsToBottom : boolean = true;

	/**
	 * If the horizontal space is to narrow – should the tab-buttons break into multiple lines?
	 */
	@Input() public noWrap : boolean = false;

	/**
	 * If this is set to true and if there is enough space for all tabs, then
	 * the not-active && not-hovered tabs will only show a icon and the active or hovered
	 * item will take as much space as possible and shows the label.
	 * The second described behavior is also known as 'flexible tabs'.
	 */
	@Input() public showIconOnlyBtns : boolean = false;

	@Input() public minHeaderTabBar : number | null = null;

	/**
	 * Observable being called whenever api data change.
	 */
	@Output() public onChange : EventEmitter<PTabComponent> = new EventEmitter<PTabComponent>();

	@ContentChildren(PTabComponent) public tabs ?: QueryList<PTabComponent>;
	@ViewChild('tabsWrap', { static: true }) public tabsWrap ! : ElementRef<HTMLUListElement>;

	constructor(
		public activatedRoute : ActivatedRoute,
		private location : Location,
		private pRouterService : PRouterService,
		private changeDetectorRef : ChangeDetectorRef,
		private zone : NgZone,
		private console : LogService,
	) {}

	private _card : boolean | null = null;

	public PTabsTheme = PTabsTheme;
	public BootstrapSize = BootstrapSize;
	public PThemeEnum = PThemeEnum;
	public Config = Config;

	/**
	 * Get all tabs that should be visible in the dom.
	 */
	public get visibleTabs() : PTabComponent[] {
		return this.tabs!.toArray().filter(tab => tab.active || tab.show !== false);
	}

	@HostBinding('class.has-scrollbar')
	public hasScrollbar : boolean = false;
	public scrollbarHasBeenCalculated : boolean = false;

	public ngAfterViewInit() : void {
		this.validateValues();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(document as any).fonts?.ready.then(() => {
			this.hasScrollbar = this.getHasScrollbar();
			this.scrollbarHasBeenCalculated = true;
			this.changeDetectorRef.detectChanges();
		});
		this.setRouterListenerToListenToOpenTab();
		this.anchorLinkHandlerSubscription = this.pRouterService.handleAnchorLinks();
	}

	private subscription : Subscription | null = null;
	private anchorLinkHandlerSubscription : Subscription | null = null;

	private setRouterListenerToListenToOpenTab() : void {
		this.subscription = this.pRouterService.events.subscribe((value) => {
			if (!(value instanceof RoutesRecognized)) return;

			let itemForOneIteration = value.state.root;
			while (!!itemForOneIteration.children.length && !itemForOneIteration.paramMap.has('opentab')) {
				itemForOneIteration = itemForOneIteration.children[0];
			}

			const NEW_ACTIVE_TAB_NAME = itemForOneIteration.paramMap.get('opentab');
			if (!NEW_ACTIVE_TAB_NAME) return;

			this.changeDetectorRef.detectChanges();
			if (this.activeTab && this.activeTab.urlName !== NEW_ACTIVE_TAB_NAME) {
				const NEW_ACTIVE_TAB = this.tabs!.find(item => item.urlName === NEW_ACTIVE_TAB_NAME);
				if (!NEW_ACTIVE_TAB) {

					// If there are no urlNames, then this component is not meant to be controlled by url.
					// It is possible that there are two tab-components on the page. One with urlNames, one without ;)
					if (!this.tabs!.some(item => !!item.urlName)) return;

					this.console.warn(`Route ${NEW_ACTIVE_TAB} not found in tabs of current tabs component.`);
				} else {
					this.scrollToTop();
					this.selectTab(NEW_ACTIVE_TAB);
				}
			}
		});
	}

	@ViewChild('topAnchor', { static: true }) public topAnchor ! : ElementRef<HTMLElement>;

	private scrollToTop() : void {
		this.zone.runOutsideAngular(() => {
			requestAnimationFrame(() => {
				const el = this.topAnchor.nativeElement;
				el.scrollIntoView({block: 'start', behavior: 'smooth'});
			});
		});
	}

	/**
	 * Validate if required attributes are set and
	 * if the set values work together / make sense / have a working implementation.
	 */
	private validateValues() : void {
		if (!this.showIconOnlyBtns) return;
		const TAB_WITHOUT_ICON = this.tabs!.find(item => !item.icon);
		if (TAB_WITHOUT_ICON) {
			throw new Error(`Icon on tab ${TAB_WITHOUT_ICON.label} needs to be set, when using [showIconOnlyBtns]="true"`);
		}
	}

	/**
	 * This calculates if there is a scrollbar.
	 * Should run one-time initially.
	 * Can be used, to transform the ui to get rid of the scrollbar if necessary.
	 */
	public getHasScrollbar() : boolean {
		if (this.tryToStickButtonsToBottom === false) return true;
		this.tabsWrap.nativeElement.style.flexWrap = 'nowrap';
		const heightBefore : number = this.tabsWrap.nativeElement.clientHeight;
		this.changeDetectorRef.detectChanges();
		this.tabsWrap.nativeElement.style.flexWrap = 'wrap';
		const heightAfter : number = this.tabsWrap.nativeElement.clientHeight;
		return heightBefore < heightAfter;
	}

	/**
	 * Select a tab.
	 */
	public selectTab(tab : PTabComponent) : void {
		if (tab.active) return;

		// deactivate all tabs
		for (const item of this.tabs!) {
			if (item === tab) continue;
			if (item.active) item.active = false;
		}

		// activate the tab the user has clicked on.
		// BUG: This causes change detection error
		tab.active = true;

		// Navigate to urlName
		this.updateUrl(tab);
	}

	private updateUrl(tab : PTabComponent) : void {
		// FIXME: PLANO-7401
		if (!tab.urlName) return;

		let newUrl : string = this.location.path();

		// If a tab is already written to the url, replace it, else append it.
		const tabWrittenToTheUrl = this.tabs!.find((item) => newUrl.includes(item.urlName!));
		if (tabWrittenToTheUrl) {
			// Replace old tab name from url string with new tab name
			newUrl = newUrl.replace(tabWrittenToTheUrl.urlName!, tab.urlName);

			// Without the use of router service, there will be this bug: PLANO-49677
			// If you choose pRouterService.navigate over location.replaceState you will have unwanted page spinners. e.g. at member page
			// this.pRouterService.navigate([newUrl], {replaceUrl: true});
			// this.location.replaceState(`${newUrl}`);
			this.pRouterService.updateUrl([`${newUrl}`]);
		} else {
			// Write the tab name to the url
			// this.location.replaceState(`${newUrl}/${tab.urlName}`);
			// this.pRouterService.navigate([newUrl, tab.urlName], {replaceUrl: true});
			this.pRouterService.updateUrl([`${newUrl}/${tab.urlName}`]);
		}
		if (!this.activeTab) {
			this.console.warn('Could not get active tab');
			return;
		}
		this.onChange.emit(this.activeTab);

		this.removeObsoleteTabs();
	}

	/**
	 * Returns the active (currently selected) tab.
	 */
	public get activeTab() : PTabComponent | null {
		// Can be null if e.g. someone navigated while a page with tabs was still loading.
		return (this.tabs?.find((item) => item.active)) ?? null;
	}

	public ngAfterContentInit() : void {
		const interval = window.setInterval(() => {
			if (this.isLoading) return;
			this.initActiveTab();
			window.clearTimeout(interval);
		}, 20);
	}

	/**
	 * Some tab must be selected. If not defined from outside, set one.
	 */
	public initActiveTab() : void {
		if (this.activeTab) return;

		/** Try to nav to the opentab from url. If that worked, the method returns true. */
		if (this.tryToNavToUrlOpenTab()) { return; }

		/** Try to nav to the opentab from url. If that worked, the method returns true. */
		if (this.tryToNavToInitialTab()) return;

		/** Try to nav to the first tab. If that worked, the method returns true. */
		// eslint-disable-next-line no-useless-return
		if (this.tryToNavToFirstTab()) return;

		// if(Config.DEBUG) {
		// 	throw new Error('t-tabs needs at least one tab that is marked as [initialActiveTab]="true"');
		// }
	}

	private removeObsoleteTabs() : void {
		for (const tab of this.tabs!.toArray()) {
			if (tab.active) return;
			if (tab.show !== false) return;
			tab.el.nativeElement.remove();
		}
	}

	private tryToNavToUrlOpenTab() : boolean {
		if (!this.activatedRoute.snapshot.paramMap.has('opentab')) return false;

		const opentab : string | null = this.activatedRoute.snapshot.paramMap.get('opentab');
		const tab = this.tabs!.find((item) => item.urlName === opentab);
		if (!tab) return false;

		// Open the tab in ui
		tab.active = true;
		this.onChange.emit(this.activeTab!);
		return true;
	}

	private tryToNavToInitialTab() : boolean {
		// If a initialActiveTab is defined then open it and change the url
		const tab = this.tabs!.find((item) => item.initialActiveTab);
		if (!tab) return false;

		// Open the tab in ui
		tab.active = true;
		this.updateUrl(tab);
		this.onChange.emit(this.activeTab!);
		return true;
	}

	private tryToNavToFirstTab() : boolean {
		// If a initialActiveTab is defined then open it and change the url
		const tab = this.tabs!.first as PTabComponent | undefined;
		if (!tab) return false;

		// Open the tab in ui
		tab.active = true;
		this.updateUrl(tab);
		this.onChange.emit(this.activeTab!);
		return true;
	}

	public ngOnDestroy() : void {
		if (!this.activeTab) {
			this.console.warn('Could not get active tab');
			return;
		}
		this.onChange.emit(this.activeTab);
		this.subscription?.unsubscribe();
		this.anchorLinkHandlerSubscription?.unsubscribe();
	}

	/**
	 * Should the label be visible?
	 * Its e.g. invisible if its an inactive tab with flexible width.
	 */
	public showLabel(tab : PTabComponent) : boolean {
		if (!tab.label) return false;

		if (!this.showIconOnlyBtns) return true;
		const OTHER_ITEM_IS_HOVERED = this.tabs!.find(item => item !== tab && item.hover);
		if (OTHER_ITEM_IS_HOVERED) return false;
		if (tab.active) return true;
		if (tab.hover) return true;
		return false;
	}

	/**
	 * Should this item take as much space as it can get?
	 * Check storybook if you don’t get it.
	 */
	public growListItem(tab : PTabComponent) : boolean {
		if (!this.showIconOnlyBtns) return false;
		if (this.isLoading) return true;
		return this.showLabel(tab);
	}

	/**
	 * Should the filter-led be visible?
	 */
	public showFilterLed(tab : PTabComponent) : boolean {
		if (tab.hasFilter === null) return false;
		// if (this.showLabel(tab)) return true;
		return tab.hasFilter;
	}
}
