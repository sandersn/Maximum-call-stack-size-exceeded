import { ResizeObserver } from '@juggle/resize-observer';
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';
import { PopoverConfig } from 'ngx-bootstrap/popover';
import { PositioningService } from 'ngx-bootstrap/positioning';
import { AfterViewChecked, AfterContentInit, OnDestroy  } from '@angular/core';
import { Directive, ElementRef, HostBinding, Renderer2, ViewContainerRef  } from '@angular/core';
import { PTooltipDirective } from './tooltip.directive';
import { LogService } from '../log.service';

@Directive({ selector: '[pCropOnOverflow]' })
export class PCropOnOverflowDirective
	extends PTooltipDirective
	implements AfterViewChecked, AfterContentInit, OnDestroy {
	@HostBinding('class.crop-on-overflow') private _alwaysTrue = true;

	constructor(
		// eslint-disable-next-line max-len
		_config : PopoverConfig, _elementRef : ElementRef<HTMLElement>, _renderer : Renderer2, _viewContainerRef : ViewContainerRef, cis : ComponentLoaderFactory, _positionService : PositioningService,
		_console : LogService,
	) {
		super(_config, _elementRef, _renderer, _viewContainerRef, cis, _positionService, _console);
		this.el = _elementRef;
	}

	private el : ElementRef<HTMLElement>;

	public override ngAfterViewChecked() : never {
		return super.ngAfterViewChecked();
	}

	public ngAfterContentInit() : void {
		this.setRecalculationListener();
	}

	private previousDivWidth : number | null = null;

	private resizeObserver : ResizeObserver | null = null;

	private setRecalculationListener() : void {
		this.resizeObserver = new ResizeObserver((entries : ResizeObserverEntry[]) => {
			// Div has no content? Then there is no need for a tooltip.
			if (this.el.nativeElement.textContent === '') return;
			this.reCalculateTooltip(entries[0]);
		});
		this.resizeObserver.observe(this.el.nativeElement);
	}

	/**
	 * Calculate if the tooltip is necessary or not.
	 * Can be re-executed if necessary.
	 */
	private reCalculateTooltip(entry : ResizeObserverEntry) : void {
		const target = entry.target as HTMLElement;
		const contentWith = target.scrollWidth;

		// Size has not changed? Then there is nothing to recalculate.
		if (this.previousDivWidth === contentWith) return;
		this.previousDivWidth = contentWith;

		// Content has 0 px width? No need for a tooltip
		if (!contentWith) return;

		const divWidth = target.offsetWidth;

		const needsTooltip = divWidth < contentWith;
		if (needsTooltip) {
			if (!!this.pTooltip) return;
			this.pTooltip = this.el.nativeElement.textContent;
			this.setTooltipAttribute();
		} else {
			if (!this.pTooltip) return;
			this.pTooltip = null;
			this.setTooltipAttribute();
		}
	}

	public override ngOnDestroy() : void {
		this.resizeObserver?.disconnect();
	}
}
