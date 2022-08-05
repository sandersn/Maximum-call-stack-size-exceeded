import { AfterViewInit} from '@angular/core';
import { Input, ElementRef, HostListener, Directive } from '@angular/core';
import { LogService } from '../../../../shared/core/log.service';

/**
 * Makes the hight of a textarea grow automatically while user is writing more and more text.
 */

@Directive({
	/* eslint-disable @angular-eslint/directive-selector */
	selector: 'textarea[autosize]',
})
export class AutosizeDirective implements AfterViewInit {

	private el : HTMLElement;
	private _minHeight : string | null = null;
	private _maxHeight : string | null = null;
	private _clientWidth : number;

	@Input('minHeight') private get minHeight() : string { return this._minHeight!; }
	private set minHeight(value : string) {
		this._minHeight = value;
		this.updateMinHeight();
	}

	@Input('maxHeight') private get maxHeight() : string {
		return this._maxHeight!;
	}
	private set maxHeight(value : string) {
		this._maxHeight = value;
		this.updateMaxHeight();
	}

	constructor(
		public element : ElementRef<HTMLElement>,
		private console : LogService,
	) {
		this.el = element.nativeElement;
		this._clientWidth = this.el.clientWidth;
	}

	@HostListener('window:resize', ['$event.target']) private onResize() : void {
		// Only apply adjustment if element width had changed.
		if (this.el.clientWidth === this._clientWidth) {
			return;
		}
		this._clientWidth = this.element.nativeElement.clientWidth;
		this.adjust();
	}

	@HostListener('input', ['$event.target']) private onInput() : void {
		this.adjust();
	}

	public ngAfterViewInit() : void {
		// set element resize allowed manually by user
		const style = window.getComputedStyle(this.el, null);
		if (style.resize === 'both') {
			this.el.style.resize = 'horizontal';
		} else if (style.resize === 'vertical') {
			this.el.style.resize = 'none';
		}

		this.firstRunHack();
	}

	private totalTime : number = 0;
	private firstRunHack() : void {
		if (
			this.element.nativeElement.clientHeight &&
			this.element.nativeElement.scrollHeight &&
			this.element.nativeElement.clientHeight !== this.element.nativeElement.scrollHeight
		) return;
		// HACK: make sure first run works
		const runInitialAdjust = () : void => {
			requestAnimationFrame(() => {
				if (10000 < this.totalTime) return;
				if (this.el.clientHeight === 0) {
					window.setTimeout(runInitialAdjust, 100);
					this.totalTime += 100;
				}
				// run first adjust
				this.adjust();
			});
		};
		runInitialAdjust();
	}

	/**
	 * perform height adjustments after input changes, if height is different
	 */
	private adjust() : void {
		if (this.desiredHeight === null) return;
		if (this.el.style.height === `${this.desiredHeight}px`) return;

		this.el.style.overflow = this.maxHeightIsReached ? 'auto' : 'hidden';
		this.el.style.height = 'auto';
		this.el.style.height = `${this.desiredHeight}px`;
	}

	private get maxHeightAsNumber() : number | null {
		const result = this.maxHeight ? +this.maxHeight.replace('px', '') : null;
		if (result !== null && Number.isNaN(result)) {
			this.console.error('could not calculate maxHeightAsNumber');
			return null;
		}
		return result;
	}
	private get maxHeightIsReached() : boolean {
		const maxHeightAsNumber = this.maxHeightAsNumber;
		return maxHeightAsNumber === null ? false : this.el.scrollHeight >= maxHeightAsNumber;
	}

	private get desiredHeight() : AutosizeDirective['maxHeightAsNumber'] {
		return this.maxHeightIsReached ? this.maxHeightAsNumber : this.el.scrollHeight;
	}

	/**
	 * Set textarea min height if input defined
	 */
	private updateMinHeight() : void {
		this.el.style.minHeight = `${this._minHeight}px`;
	}

	/**
	 * Set textarea max height if input defined
	 */
	private updateMaxHeight() : void {
		this.el.style.maxHeight = `${this._maxHeight}px`;
	}

}
