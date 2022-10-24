var _a, _b;
import { __decorate, __metadata } from "tslib";
import { Subject } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import { Config } from './config';
import { LogService } from './log.service';
import { assumeNonNull } from './null-type-utils';
import { PProgressbarService } from './progressbar.service';
import { pCollapsibleAnimationSpeed } from '../../client/shared/p-collapsible/p-collapsible.component';
import { SchedulingApiService } from '../api';
/** A router wrapper, adding extra functions. */
let PScrollToSelectorService = class PScrollToSelectorService {
    constructor(schedulingApiService, zone, console, pProgressbarService) {
        this.schedulingApiService = schedulingApiService;
        this.zone = zone;
        this.console = console;
        this.pProgressbarService = pProgressbarService;
        this.changeDetectionTriggered = new Subject();
        this.startSearchForSelector = new Subject();
        this.scrollableElementData = [];
        this.INTERVAL_TIME = 100;
        // Every time api is loaded…
        this.schedulingApiService.onDataLoaded.subscribe(() => {
            this.console.debug('#-------------- API LOADED --------------#');
            // …wait for a change detection
            // eslint-disable-next-line rxjs/no-nested-subscribe
            const changeDetectionSubscription = this.changeDetectionTriggered.subscribe(() => {
                this.console.debug('#-------------- CHange Detection --------------#');
                this.startSearchForSelector.next();
                changeDetectionSubscription.unsubscribe();
            });
        });
        // interval(1000).subscribe(counter => console.debug(counter));
    }
    /**
     * Run callback after id is loaded.
     */
    async idIsLoaded(selector) {
        return new Promise((resolve, reject) => {
            let el = null;
            const keepTrying = () => {
                if (document.readyState !== 'complete')
                    return true;
                if (selector.match(/^#.*#$/) !== null)
                    this.console.error(`»${selector}« not a valid selector [PLANO-FE-4PW]`);
                el = document.querySelector(selector);
                if (!el)
                    return true;
                // It happened that we grabbed an item which has been removed from the dom. This line prevents it.
                if (el.parentNode === null)
                    return true;
                return false;
            };
            // We need to make sure the dom is ready and no change is expected after scroll.
            this.tryInALoop(keepTrying, 
            // It can take a while till document is ready. But user is busy looking at spinners, so thats ok.
            60000).then(() => {
                assumeNonNull(el);
                resolve(el);
            }).catch(reject);
        });
    }
    /**
     * Set a loop that runs circles as long as you wish. More or less a callback based implementation of a while-loop.
     * @param whileTrue A callback to define how long the loops should run. If it returns null, the loop will be canceled.
     * @param timeLimit How long should the loop run maximal?
     */
    async tryInALoop(whileTrue, timeLimit = 2000) {
        return new Promise((resolve, reject) => {
            // Count how much time passed for all tries
            let timePassed = 0;
            const keepTrying = () => {
                const condition = whileTrue();
                switch (condition) {
                    case null:
                        reject('Killed the loop');
                        return;
                    case true:
                        // If time limit has been reached, give up.
                        if (timePassed >= timeLimit) {
                            reject('Loop limit reached.');
                            return;
                        }
                        // Try some short time later
                        window.setTimeout(() => {
                            this.waitForAnimationFrame().then(() => {
                                keepTrying();
                            });
                        }, this.INTERVAL_TIME);
                        timePassed += this.INTERVAL_TIME;
                        return;
                    case false:
                        // Success!
                        resolve();
                }
            };
            // Try some short time later
            window.setTimeout(() => {
                this.waitForAnimationFrame().then(() => {
                    keepTrying();
                });
            }, this.INTERVAL_TIME);
        });
    }
    waitForAnimationFrame() {
        return new Promise((resolve) => {
            this.zone.runOutsideAngular(() => {
                requestAnimationFrame(() => {
                    resolve();
                });
            });
        });
    }
    /**
     * Wait for an element to appear in UI and scroll to it.
     *
     * @description
     * 	This is a quite complex Method. It prioritizes html-id-selectors higher than html-class-selectors.
     * 	It can handle multiple calls if the targets are part of different scroll-areas.
     * 	If possible it does not block any other, more important javascript processes.
     * 	It does a lot of magic 🙌
     */
    findSelectorAndScrollToIt(selector, scrollIntoViewOptions, animate = true, ignoreScrollPosition = false, lostParents) {
        // Start a loop that tries to find the selector in the dom
        this.idIsLoaded(selector)
            .then((el) => {
            // Each scrollable area should have only one scroll target.
            // updateMostImportantScrollTarget handles the prioritization
            // NOTE: Do not wrap this in waitForAnimationFrame() or some other delaying method/promise. [caused PLANO-149718]
            this.updateMostImportantScrollTarget(selector, el);
            return el;
        })
            .then((el) => {
            // Check that the element is not changing its position anymore
            return this.elPositionIsStable(el);
        })
            // If there is a collapsible inside, click it
            .then((el) => {
            return this.unCollapseContainedCollapsable(el);
        })
            .then((el) => {
            var _a;
            const parentData = this.getScrollableElementData(el);
            if (parentData === null) {
                if (selector.match(/^#.*/) === null)
                    return;
                lostParents = lostParents + 1;
                if (lostParents > 2)
                    return;
                this.console.debug(`Parent is lost. Try again`);
                this.findSelectorAndScrollToIt(selector, scrollIntoViewOptions, animate, ignoreScrollPosition, lostParents);
                return;
            }
            // Make sure there is only one scroll target per scroll-area
            const mostImportantScrollSelector = parentData.targetSelector;
            if (mostImportantScrollSelector !== selector) {
                this.console.debug(`block »${selector}«. ${mostImportantScrollSelector} is more important`);
                return;
            }
            // Make sure the user has not scrolled in the meantime
            const scrollableParent = (_a = this.nearestScrollableParent(el)) !== null && _a !== void 0 ? _a : document.body;
            if (!ignoreScrollPosition && scrollableParent.scrollTop > 20) {
                this.console.debug(`User has scrolled`);
                this.updateMostImportantScrollTarget(null, el);
                return;
            }
            if (Config.DEBUG) {
                if (ignoreScrollPosition === true) {
                    this.console.debug(`ignoreScrollPosition is »${ignoreScrollPosition}« scrollableParent.scrollTop is »${scrollableParent.scrollTop}«`);
                }
                else {
                    this.console.debug(`User has NOT scrolled. scrollableParent.scrollTop is »${scrollableParent.scrollTop}«`);
                }
            }
            if (animate) {
                // After scroll-animation has ended, add a css class so that the scroll target can be highlighted in ui.
                this.itemIsVisibleInScrollArea(el, () => {
                    el.classList.add('scrolled-to-this-selector');
                    window.setTimeout(() => el.classList.remove('scrolled-to-this-selector'), 5000);
                });
            }
            this.console.debug(`🎉 scrollIntoView »${selector}«`);
            el.scrollIntoView(scrollIntoViewOptions);
            this.updateMostImportantScrollTarget(null, el);
        })
            .catch((error) => {
            this.console.warn(error);
            if (typeof error === 'string' && error.includes('Please get new element')) {
                this.findSelectorAndScrollToIt(selector, scrollIntoViewOptions, animate, ignoreScrollPosition, lostParents);
            }
            this.updateMostImportantScrollTarget(null);
        }).finally(() => {
            this.pProgressbarService.complete();
        });
    }
    getScrollableElementData(el, param) {
        var _a, _b;
        const scrollableParent = (_a = this.nearestScrollableParent(el)) !== null && _a !== void 0 ? _a : document.body;
        const textContent = scrollableParent.textContent.toString().replace(/[\n\r]/g, '');
        const parentKey = textContent.slice(0, 50);
        const entry = (_b = this.scrollableElementData.find(item => item.key === parentKey)) !== null && _b !== void 0 ? _b : null;
        if (!entry) {
            this.console.debug(`Could not find entry for parent »${parentKey}«`);
            return null;
        }
        return param ? entry[param] : entry;
    }
    nearestScrollableParent(node) {
        if (node === null) {
            return null;
        }
        if (node.scrollHeight > node.clientHeight) {
            return node;
        }
        else {
            return this.nearestScrollableParent(node.parentNode);
        }
    }
    updateMostImportantScrollTarget(targetSelector, el = null) {
        var _a, _b, _c;
        const scrollableParent = (_a = this.nearestScrollableParent(el)) !== null && _a !== void 0 ? _a : document.body;
        const textContent = (_c = (_b = scrollableParent.textContent) === null || _b === void 0 ? void 0 : _b.toString().replace(/[\n\r]/g, '')) !== null && _c !== void 0 ? _c : null;
        // take the first 50 chars of the string as key.
        const parentKey = textContent === null ? null : textContent.slice(0, 50);
        // If scrollTarget is null, this means the whole array should be reset.
        if (parentKey === null) {
            this.console.debug(`🧹 Clear »scrollableElementData«`);
            this.scrollableElementData = [];
            return;
        }
        // If scrollTarget is null, this means the value should be reset.
        if (targetSelector === null) {
            this.console.debug(`🧹 Clear parent »${parentKey}« in »scrollableElementData«`);
            const index = this.scrollableElementData.findIndex(item => item.key === parentKey);
            this.scrollableElementData.splice(index, 1);
            return;
        }
        const existingEntry = this.scrollableElementData.find(item => item.key === parentKey);
        if (!!existingEntry) {
            // If there is already a scroll progress running that scrolls to an ID, dont change anything.
            if (!targetSelector.includes('#')) {
                this.console.debug(`🚫 »${targetSelector}« not added. There is already something inside: »${existingEntry.targetSelector}«`);
                return;
            }
            this.console.debug(`↔️ Replace »${existingEntry.targetSelector}« with »${targetSelector}« w. parent »${parentKey}« in »scrollableElementData«`);
            existingEntry.targetSelector = targetSelector;
            return;
        }
        this.console.debug(`➕ Add »${targetSelector}« w. parent »${parentKey}« in »scrollableElementData«`);
        this.scrollableElementData.push({ key: parentKey, targetSelector: targetSelector, scrollPosition: scrollableParent.scrollTop });
    }
    itemIsVisibleInScrollArea(el, success) {
        const interactionObserver = new IntersectionObserver((entries, observer) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                success();
                observer.disconnect();
            }
        });
        interactionObserver.observe(el);
    }
    /**
     * Run callback after element is loaded and no changes in dom are expected after callback.
     */
    async elPositionIsStable(el) {
        return this.waitForAnimationFrame().then(() => {
            return new Promise((resolve, reject) => {
                var _a;
                let offset = (_a = el.offsetTop) !== null && _a !== void 0 ? _a : null;
                this.tryInALoop(() => {
                    if (offset === null)
                        return true;
                    // This can happen when a element appears only for a short time.
                    if (el.parentElement === null) {
                        reject('Element is not part of DOM anymore. Please get new element.');
                        return null;
                    }
                    const newOffset = el.offsetTop;
                    if (offset !== newOffset) {
                        offset = newOffset;
                        return true;
                    }
                    return false;
                }).then(() => {
                    resolve(el);
                }).catch(reject);
            });
        });
    }
    async unCollapseContainedCollapsable(el) {
        return new Promise((resolve) => {
            const elements = el.querySelectorAll('p-collapsible.collapsed button');
            const firstButtonInside = elements === null || elements === void 0 ? void 0 : elements[0];
            if (firstButtonInside !== undefined) {
                firstButtonInside.click();
                window.setTimeout(() => {
                    resolve(el);
                }, pCollapsibleAnimationSpeed);
            }
            else {
                /*
                 * This timeout was necessary to increase the chance of overlapping async scroll requests so that the
                 * internal logic can decide which selector is the most important one.
                 */
                window.setTimeout(() => resolve(el), 10);
            }
        });
    }
    /**
     * Get an html element by id and scroll to id as soon as it is available.
     * If the element contains a collapsible, the collapsible will get clicked.
     * @param selector An css-like selector. E.g. `#foo` or `.bar`
     * @param ignoreScrollPosition Usually the method will stop if the user has scrolled. Set to true to disable this feature.
     */
    scrollToSelector(selector, scrollIntoViewOptions, animate = true, ignoreScrollPosition = false, waitForApiLoaded = true) {
        this.console.debug(`New Scroll request: ${selector}`);
        const scrollIntoViewOptionsWithDefaults = { behavior: 'smooth', block: 'center', inline: 'center', ...scrollIntoViewOptions };
        const lostParents = 0;
        if (!waitForApiLoaded) {
            this.findSelectorAndScrollToIt(selector, scrollIntoViewOptionsWithDefaults, animate, ignoreScrollPosition, lostParents);
            return;
        }
        this.pProgressbarService.start();
        const startSearchForSelectorSubscriber = this.startSearchForSelector.subscribe(() => {
            this.findSelectorAndScrollToIt(selector, scrollIntoViewOptionsWithDefaults, animate, ignoreScrollPosition, lostParents);
            startSearchForSelectorSubscriber.unsubscribe();
        });
    }
};
PScrollToSelectorService = __decorate([
    Injectable({ providedIn: 'root' }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, typeof (_b = typeof NgZone !== "undefined" && NgZone) === "function" ? _b : Object, LogService,
        PProgressbarService])
], PScrollToSelectorService);
export { PScrollToSelectorService };
//# sourceMappingURL=scroll-to-selector.service.js.map