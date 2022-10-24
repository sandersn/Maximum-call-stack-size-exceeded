var _a, _b, _c, _d, _e, _f, _g, _h;
import { __decorate, __metadata } from "tslib";
import { Location } from '@angular/common';
import { Component, ChangeDetectionStrategy, ContentChildren, QueryList, EventEmitter, Output, ChangeDetectorRef, ElementRef, ViewChild, Input, HostBinding, NgZone } from '@angular/core';
import { ActivatedRoute, RoutesRecognized } from '@angular/router';
import { FLEX_GROW_ON_BOOLEAN_TRIGGER, FLEX_GROW_ON_NGIF_TRIGGER } from '@plano/animations';
import { LogService } from '@plano/shared/core/log.service';
import { PRouterService } from '@plano/shared/core/router.service';
import { PTabComponent } from './p-tab/p-tab.component';
import { Config } from '../../../../shared/core/config';
import { BootstrapSize, PThemeEnum } from '../../bootstrap-styles.enum';
export var PTabsTheme;
(function (PTabsTheme) {
    PTabsTheme[PTabsTheme["DEFAULT"] = 0] = "DEFAULT";
    PTabsTheme[PTabsTheme["CLEAN"] = 1] = "CLEAN";
})(PTabsTheme || (PTabsTheme = {}));
let PTabsComponent = class PTabsComponent {
    constructor(activatedRoute, location, pRouterService, changeDetectorRef, zone, console) {
        this.activatedRoute = activatedRoute;
        this.location = location;
        this.pRouterService = pRouterService;
        this.changeDetectorRef = changeDetectorRef;
        this.zone = zone;
        this.console = console;
        /**
         * Should the tabs have more or less spacing around its content?
         */
        this.size = null;
        /**
         * Is this tabs component used at the top of a page?
         * Will effect some margins, paddings etc.
         */
        this.pageSubNav = false;
        this._alwaysTrue = true;
        this.theme = PTabsTheme.DEFAULT;
        this.darkMode = false;
        this.isLoading = false;
        /**
         * If this is true, UI looks like normal tabs.
         * If false, UI shows usual buttons with rounded corners and some whitespace around.
         * The second version is equal to what we use on narrow screens.
         */
        this.tryToStickButtonsToBottom = true;
        /**
         * If the horizontal space is to narrow – should the tab-buttons break into multiple lines?
         */
        this.noWrap = false;
        /**
         * If this is set to true and if there is enough space for all tabs, then
         * the not-active && not-hovered tabs will only show a icon and the active or hovered
         * item will take as much space as possible and shows the label.
         * The second described behavior is also known as 'flexible tabs'.
         */
        this.showIconOnlyBtns = false;
        this.minHeaderTabBar = null;
        /**
         * Observable being called whenever api data change.
         */
        this.onChange = new EventEmitter();
        this._card = null;
        this.PTabsTheme = PTabsTheme;
        this.BootstrapSize = BootstrapSize;
        this.PThemeEnum = PThemeEnum;
        this.Config = Config;
        this.hasScrollbar = false;
        this.scrollbarHasBeenCalculated = false;
        this.subscription = null;
        this.anchorLinkHandlerSubscription = null;
    }
    /**
     * Should there be a card around this component?
     * Note that this does not effect the theme of the tabs.
     */
    get hasCard() {
        if (this._card === null)
            return this.theme === PTabsTheme.DEFAULT;
        return this._card;
    }
    set setCard(input) {
        this._card = input;
    }
    get hasCleanTheme() {
        return this.theme === PTabsTheme.CLEAN;
    }
    get hasDefaultTheme() {
        return this.theme === PTabsTheme.DEFAULT;
    }
    /**
     * Get all tabs that should be visible in the dom.
     */
    get visibleTabs() {
        return this.tabs.toArray().filter(tab => tab.active || tab.show !== false);
    }
    ngAfterViewInit() {
        var _a;
        this.validateValues();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (_a = document.fonts) === null || _a === void 0 ? void 0 : _a.ready.then(() => {
            this.hasScrollbar = this.getHasScrollbar();
            this.scrollbarHasBeenCalculated = true;
            this.changeDetectorRef.detectChanges();
        });
        this.setRouterListenerToListenToOpenTab();
        this.anchorLinkHandlerSubscription = this.pRouterService.handleAnchorLinks();
    }
    setRouterListenerToListenToOpenTab() {
        this.subscription = this.pRouterService.events.subscribe((value) => {
            if (!(value instanceof RoutesRecognized))
                return;
            let itemForOneIteration = value.state.root;
            while (!!itemForOneIteration.children.length && !itemForOneIteration.paramMap.has('opentab')) {
                itemForOneIteration = itemForOneIteration.children[0];
            }
            const NEW_ACTIVE_TAB_NAME = itemForOneIteration.paramMap.get('opentab');
            if (!NEW_ACTIVE_TAB_NAME)
                return;
            this.changeDetectorRef.detectChanges();
            if (this.activeTab && this.activeTab.urlName !== NEW_ACTIVE_TAB_NAME) {
                const NEW_ACTIVE_TAB = this.tabs.find(item => item.urlName === NEW_ACTIVE_TAB_NAME);
                if (!NEW_ACTIVE_TAB) {
                    // If there are no urlNames, then this component is not meant to be controlled by url.
                    // It is possible that there are two tab-components on the page. One with urlNames, one without ;)
                    if (!this.tabs.some(item => !!item.urlName))
                        return;
                    this.console.warn(`Route ${NEW_ACTIVE_TAB} not found in tabs of current tabs component.`);
                }
                else {
                    this.scrollToTop();
                    this.selectTab(NEW_ACTIVE_TAB);
                }
            }
        });
    }
    scrollToTop() {
        this.zone.runOutsideAngular(() => {
            requestAnimationFrame(() => {
                const el = this.topAnchor.nativeElement;
                el.scrollIntoView({ block: 'start', behavior: 'smooth' });
            });
        });
    }
    /**
     * Validate if required attributes are set and
     * if the set values work together / make sense / have a working implementation.
     */
    validateValues() {
        if (!this.showIconOnlyBtns)
            return;
        const TAB_WITHOUT_ICON = this.tabs.find(item => !item.icon);
        if (TAB_WITHOUT_ICON) {
            throw new Error(`Icon on tab ${TAB_WITHOUT_ICON.label} needs to be set, when using [showIconOnlyBtns]="true"`);
        }
    }
    /**
     * This calculates if there is a scrollbar.
     * Should run one-time initially.
     * Can be used, to transform the ui to get rid of the scrollbar if necessary.
     */
    getHasScrollbar() {
        if (this.tryToStickButtonsToBottom === false)
            return true;
        this.tabsWrap.nativeElement.style.flexWrap = 'nowrap';
        const heightBefore = this.tabsWrap.nativeElement.clientHeight;
        this.changeDetectorRef.detectChanges();
        this.tabsWrap.nativeElement.style.flexWrap = 'wrap';
        const heightAfter = this.tabsWrap.nativeElement.clientHeight;
        return heightBefore < heightAfter;
    }
    /**
     * Select a tab.
     */
    selectTab(tab) {
        if (tab.active)
            return;
        // deactivate all tabs
        for (const item of this.tabs) {
            if (item === tab)
                continue;
            if (item.active)
                item.active = false;
        }
        // activate the tab the user has clicked on.
        // BUG: This causes change detection error
        tab.active = true;
        // Navigate to urlName
        this.updateUrl(tab);
    }
    updateUrl(tab) {
        // FIXME: PLANO-7401
        if (!tab.urlName)
            return;
        let newUrl = this.location.path();
        // If a tab is already written to the url, replace it, else append it.
        const tabWrittenToTheUrl = this.tabs.find((item) => newUrl.includes(item.urlName));
        if (tabWrittenToTheUrl) {
            // Replace old tab name from url string with new tab name
            newUrl = newUrl.replace(tabWrittenToTheUrl.urlName, tab.urlName);
            // Without the use of router service, there will be this bug: PLANO-49677
            // If you choose pRouterService.navigate over location.replaceState you will have unwanted page spinners. e.g. at member page
            // this.pRouterService.navigate([newUrl], {replaceUrl: true});
            // this.location.replaceState(`${newUrl}`);
            this.pRouterService.updateUrl([`${newUrl}`]);
        }
        else {
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
    get activeTab() {
        var _a, _b;
        // Can be null if e.g. someone navigated while a page with tabs was still loading.
        return (_b = ((_a = this.tabs) === null || _a === void 0 ? void 0 : _a.find((item) => item.active))) !== null && _b !== void 0 ? _b : null;
    }
    ngAfterContentInit() {
        const interval = window.setInterval(() => {
            if (this.isLoading)
                return;
            this.initActiveTab();
            window.clearTimeout(interval);
        }, 20);
    }
    /**
     * Some tab must be selected. If not defined from outside, set one.
     */
    initActiveTab() {
        if (this.activeTab)
            return;
        /** Try to nav to the opentab from url. If that worked, the method returns true. */
        if (this.tryToNavToUrlOpenTab()) {
            return;
        }
        /** Try to nav to the opentab from url. If that worked, the method returns true. */
        if (this.tryToNavToInitialTab())
            return;
        /** Try to nav to the first tab. If that worked, the method returns true. */
        // eslint-disable-next-line no-useless-return
        if (this.tryToNavToFirstTab())
            return;
        // if(Config.DEBUG) {
        // 	throw new Error('t-tabs needs at least one tab that is marked as [initialActiveTab]="true"');
        // }
    }
    removeObsoleteTabs() {
        for (const tab of this.tabs.toArray()) {
            if (tab.active)
                return;
            if (tab.show !== false)
                return;
            tab.el.nativeElement.remove();
        }
    }
    tryToNavToUrlOpenTab() {
        if (!this.activatedRoute.snapshot.paramMap.has('opentab'))
            return false;
        const opentab = this.activatedRoute.snapshot.paramMap.get('opentab');
        const tab = this.tabs.find((item) => item.urlName === opentab);
        if (!tab)
            return false;
        // Open the tab in ui
        tab.active = true;
        this.onChange.emit(this.activeTab);
        return true;
    }
    tryToNavToInitialTab() {
        // If a initialActiveTab is defined then open it and change the url
        const tab = this.tabs.find((item) => item.initialActiveTab);
        if (!tab)
            return false;
        // Open the tab in ui
        tab.active = true;
        this.updateUrl(tab);
        this.onChange.emit(this.activeTab);
        return true;
    }
    tryToNavToFirstTab() {
        // If a initialActiveTab is defined then open it and change the url
        const tab = this.tabs.first;
        if (!tab)
            return false;
        // Open the tab in ui
        tab.active = true;
        this.updateUrl(tab);
        this.onChange.emit(this.activeTab);
        return true;
    }
    ngOnDestroy() {
        var _a, _b;
        if (!this.activeTab) {
            this.console.warn('Could not get active tab');
            return;
        }
        this.onChange.emit(this.activeTab);
        (_a = this.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        (_b = this.anchorLinkHandlerSubscription) === null || _b === void 0 ? void 0 : _b.unsubscribe();
    }
    /**
     * Should the label be visible?
     * Its e.g. invisible if its an inactive tab with flexible width.
     */
    showLabel(tab) {
        if (!tab.label)
            return false;
        if (!this.showIconOnlyBtns)
            return true;
        const OTHER_ITEM_IS_HOVERED = this.tabs.find(item => item !== tab && item.hover);
        if (OTHER_ITEM_IS_HOVERED)
            return false;
        if (tab.active)
            return true;
        if (tab.hover)
            return true;
        return false;
    }
    /**
     * Should this item take as much space as it can get?
     * Check storybook if you don’t get it.
     */
    growListItem(tab) {
        if (!this.showIconOnlyBtns)
            return false;
        if (this.isLoading)
            return true;
        return this.showLabel(tab);
    }
    /**
     * Should the filter-led be visible?
     */
    showFilterLed(tab) {
        if (tab.hasFilter === null)
            return false;
        // if (this.showLabel(tab)) return true;
        return tab.hasFilter;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTabsComponent.prototype, "size", void 0);
__decorate([
    HostBinding('class.page-sub-nav'),
    Input(),
    __metadata("design:type", Boolean)
], PTabsComponent.prototype, "pageSubNav", void 0);
__decorate([
    HostBinding('class.d-flex'),
    HostBinding('class.flex-column'),
    __metadata("design:type", Object)
], PTabsComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    HostBinding('class.card'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PTabsComponent.prototype, "hasCard", null);
__decorate([
    Input('card'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], PTabsComponent.prototype, "setCard", null);
__decorate([
    HostBinding('class.theme-clean'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PTabsComponent.prototype, "hasCleanTheme", null);
__decorate([
    HostBinding('class.theme-default'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PTabsComponent.prototype, "hasDefaultTheme", null);
__decorate([
    Input(),
    __metadata("design:type", Number)
], PTabsComponent.prototype, "theme", void 0);
__decorate([
    HostBinding('class.taps-dark-mode'),
    Input(),
    __metadata("design:type", Boolean)
], PTabsComponent.prototype, "darkMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTabsComponent.prototype, "isLoading", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PTabsComponent.prototype, "tryToStickButtonsToBottom", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PTabsComponent.prototype, "noWrap", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PTabsComponent.prototype, "showIconOnlyBtns", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTabsComponent.prototype, "minHeaderTabBar", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_e = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _e : Object)
], PTabsComponent.prototype, "onChange", void 0);
__decorate([
    ContentChildren(PTabComponent),
    __metadata("design:type", typeof (_f = typeof QueryList !== "undefined" && QueryList) === "function" ? _f : Object)
], PTabsComponent.prototype, "tabs", void 0);
__decorate([
    ViewChild('tabsWrap', { static: true }),
    __metadata("design:type", typeof (_g = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _g : Object)
], PTabsComponent.prototype, "tabsWrap", void 0);
__decorate([
    HostBinding('class.has-scrollbar'),
    __metadata("design:type", Boolean)
], PTabsComponent.prototype, "hasScrollbar", void 0);
__decorate([
    ViewChild('topAnchor', { static: true }),
    __metadata("design:type", typeof (_h = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _h : Object)
], PTabsComponent.prototype, "topAnchor", void 0);
PTabsComponent = __decorate([
    Component({
        selector: 'p-tabs',
        templateUrl: './p-tabs.component.html',
        styleUrls: ['./p-tabs.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        animations: [FLEX_GROW_ON_BOOLEAN_TRIGGER, FLEX_GROW_ON_NGIF_TRIGGER],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ActivatedRoute !== "undefined" && ActivatedRoute) === "function" ? _a : Object, typeof (_b = typeof Location !== "undefined" && Location) === "function" ? _b : Object, PRouterService, typeof (_c = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _c : Object, typeof (_d = typeof NgZone !== "undefined" && NgZone) === "function" ? _d : Object, LogService])
], PTabsComponent);
export { PTabsComponent };
//# sourceMappingURL=p-tabs.component.js.map