import { Subject } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import { Config } from './config';
import { LogService } from './log.service';
import { assumeNonNull } from './null-type-utils';
import { PProgressbarService } from './progressbar.service';
import { ScrollTarget } from './router.service';
import { pCollapsibleAnimationSpeed } from '../../client/shared/p-collapsible/p-collapsible.component';
import { SchedulingApiService } from '../api';

/** A router wrapper, adding extra functions. */
@Injectable( { providedIn: 'root' } )
export class PScrollToSelectorService {
	constructor(
		private schedulingApiService : SchedulingApiService,
		private zone : NgZone,
		private console : LogService,
		private pProgressbarService : PProgressbarService,
	) {
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

	public changeDetectionTriggered : Subject<void> = new Subject<void>();
	public startSearchForSelector : Subject<void> = new Subject<void>();

	/**
	 * Run callback after id is loaded.
	 */
	private async idIsLoaded(selector : string) : Promise<HTMLElement> {
		return new Promise((resolve : (el : HTMLElement) => void, reject) => {
			let el : HTMLElement | null = null;

			const keepTrying = () : boolean => {
				if (document.readyState !== 'complete') return true;
				if (selector.match(/^#.*#$/) !== null) this.console.error(`»${selector}« not a valid selector [PLANO-FE-4PW]`);
				el = document.querySelector<HTMLElement>(selector);
				if (!el) return true;
				// It happened that we grabbed an item which has been removed from the dom. This line prevents it.
				if (el.parentNode === null) return true;
				return false;
			};

			// We need to make sure the dom is ready and no change is expected after scroll.
			this.tryInALoop(
				keepTrying,
				// It can take a while till document is ready. But user is busy looking at spinners, so thats ok.
				60000,
			).then(() => {
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
	private async tryInALoop(
		whileTrue : () => boolean | null,
		timeLimit : number = 2000,
	) : Promise<void> {
		return new Promise((resolve, reject) => {
			// Count how much time passed for all tries
			let timePassed = 0;

			const keepTrying = () : void => {
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

	private waitForAnimationFrame() : Promise<void> {
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
	private findSelectorAndScrollToIt(
		selector : ScrollTarget,
		scrollIntoViewOptions : ScrollIntoViewOptions,
		animate : boolean = true,
		ignoreScrollPosition : boolean = false,
		lostParents : number,
	) : void {
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
				const parentData = this.getScrollableElementData(el);
				if (parentData === null) {
					if (selector.match(/^#.*/) === null) return;
					lostParents = lostParents + 1;
					if (lostParents > 2) return;
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
				const scrollableParent = this.nearestScrollableParent(el) ?? document.body;
				if (!ignoreScrollPosition && scrollableParent.scrollTop > 20) {
					this.console.debug(`User has scrolled`);
					this.updateMostImportantScrollTarget(null, el);
					return;
				}
				if (Config.DEBUG) {
					if (ignoreScrollPosition === true) {
						this.console.debug(`ignoreScrollPosition is »${ignoreScrollPosition}« scrollableParent.scrollTop is »${scrollableParent.scrollTop}«`);
					} else {
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

	private getScrollableElementData(el : HTMLElement) : PScrollToSelectorService['scrollableElementData'][number] | null;
	private getScrollableElementData<T extends keyof PScrollToSelectorService['scrollableElementData'][number]>(el : HTMLElement, param : T) : PScrollToSelectorService['scrollableElementData'][number][T] | null;
	private getScrollableElementData<T extends keyof PScrollToSelectorService['scrollableElementData'][number]>(el : HTMLElement, param ?: T) : PScrollToSelectorService['scrollableElementData'][number] | PScrollToSelectorService['scrollableElementData'][number][T] | null {
		const scrollableParent = this.nearestScrollableParent(el) ?? document.body;
		const textContent = scrollableParent.textContent!.toString().replace(/[\n\r]/g, '');
		const parentKey = textContent.slice(0, 50);
		const entry = this.scrollableElementData.find(item => item.key === parentKey) ?? null;
		if (!entry) {
			this.console.debug(`Could not find entry for parent »${parentKey}«`);
			return null;
		}
		return param ? entry[param] : entry;
	}

	private scrollableElementData : {
		key : string,
		targetSelector : ScrollTarget,
		scrollPosition : number,
	}[] = [];

	private nearestScrollableParent(node : HTMLElement | null) : HTMLElement | null {
		if (node === null) {
			return null;
		}

		if (node.scrollHeight > node.clientHeight) {
			return node;
		} else {
			return this.nearestScrollableParent(node.parentNode as HTMLElement | null);
		}
	}

	private updateMostImportantScrollTarget(targetSelector : ScrollTarget | null, el : HTMLElement | null = null) : void {
		const scrollableParent = this.nearestScrollableParent(el) ?? document.body;
		const textContent = scrollableParent.textContent?.toString().replace(/[\n\r]/g, '') ?? null;

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
		this.scrollableElementData.push({key: parentKey, targetSelector: targetSelector, scrollPosition: scrollableParent.scrollTop});
	}

	private INTERVAL_TIME = 100;

	private itemIsVisibleInScrollArea(el : HTMLElement, success : () => void) : void {
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
	private async elPositionIsStable<T extends HTMLElement = HTMLElement>(el : T) : Promise<T> {
		return this.waitForAnimationFrame().then(() => {
			return new Promise((resolve, reject) => {
				let offset : number | null = (el.offsetTop as number | undefined) ?? null;
				this.tryInALoop(
					() : boolean | null => {
						if (offset === null) return true;
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
					},
				).then(() => {
					resolve(el);
				}).catch(reject);
			});
		});
	}

	private async unCollapseContainedCollapsable<T extends HTMLElement = HTMLElement>(el : T) : Promise<T> {
		return new Promise((resolve) => {
			const elements : NodeListOf<HTMLElement> | undefined = el.querySelectorAll<HTMLElement>('p-collapsible.collapsed button') as NodeListOf<HTMLElement> | undefined;
			const firstButtonInside = elements?.[0];
			if (firstButtonInside !== undefined) {
				firstButtonInside.click();
				window.setTimeout(() => {
					resolve(el);
				}, pCollapsibleAnimationSpeed);
			} else {

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
	public scrollToSelector(
		selector : ScrollTarget,
		scrollIntoViewOptions ?: Partial<ScrollIntoViewOptions>,
		animate : boolean = true,
		ignoreScrollPosition : boolean = false,
		waitForApiLoaded : boolean = true,
	) : void {
		this.console.debug(`New Scroll request: ${selector}`);
		const scrollIntoViewOptionsWithDefaults : ScrollIntoViewOptions = {behavior: 'smooth', block: 'center', inline: 'center', ...scrollIntoViewOptions};

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
}
