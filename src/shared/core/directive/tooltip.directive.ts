import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';
import { PopoverConfig, PopoverDirective } from 'ngx-bootstrap/popover';
import { PositioningService } from 'ngx-bootstrap/positioning';
import { AfterViewChecked, AfterViewInit} from '@angular/core';
import { Directive, ElementRef, Input, Renderer2, ViewContainerRef  } from '@angular/core';
import { LogService } from '../log.service';

@Directive({
	selector: '[pTooltip]',
	exportAs: 'p-tooltip',
})
export class PTooltipDirective extends PopoverDirective implements AfterViewChecked, AfterViewInit {
	@Input() public pTooltip : string | null = null;

	constructor(
		// eslint-disable-next-line max-len
		_config : PopoverConfig, _elementRef : ElementRef<HTMLElement>, _renderer : Renderer2, _viewContainerRef : ViewContainerRef, cis : ComponentLoaderFactory, _positionService : PositioningService,
		private console : LogService,
	) {
		// super(_viewContainerRef, _changeDetectorRef, _resolver, _elementRef, _renderer);
		super(_config, _elementRef, _renderer, _viewContainerRef, cis, _positionService);
	}

	// @HostBinding('popover') private getTooltip() : string | null { return this.el.nativeElement?.textContent; }
	public ngAfterViewChecked() : never {
		this.setTooltipAttribute();
		return null as never;
	}

	public ngAfterViewInit() : void {
		// I tried to add TemplateRef<any> to pTooltip Input, but it caused performance issues.
		if (this.pTooltip?.match(/&nbsp;/)) {
			const fixedTooltipContent = this.pTooltip.replace(/&nbsp;/, ' ');
			this.console.error(
				'pTooltip does not support HTML yet. Please remove &nbsp;',
				this.pTooltip,
				fixedTooltipContent,
			);
			this.pTooltip = fixedTooltipContent;
		}
		const htmlTag = this.pTooltip?.match(/<[a-z-]*>.*<\/[a-z-]*>/);
		if (!!htmlTag) {
			this.console.error(`pTooltip does not support HTML yet. Please remove »<{{htmlTag[1]}}>…</{{htmlTag[1]}}>« from string.`);
		}
	}

	/**
	 * Set tooltip attribute
	 */
	public setTooltipAttribute() : void {
		this.popover = this.pTooltip ?? '';
	}
}
