import { AfterContentInit } from '@angular/core';
import { Component, Input, ChangeDetectionStrategy, ElementRef, Renderer2 } from '@angular/core';
import { SLIDE_ON_NGIF_TRIGGER } from '@plano/animations';
import { SchedulingApiWarnings } from '@plano/shared/api';

@Component({
	selector: 'p-warnings[warnings]',
	templateUrl: './warnings.component.html',
	styleUrls: ['./warnings.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	animations: [SLIDE_ON_NGIF_TRIGGER],
})
export class WarningsComponent implements AfterContentInit {
	@Input() public warnings ! : SchedulingApiWarnings;
	@Input() private disableAnimation : boolean | null = null;

	// TODO: This makes it possible to use class .rounded-bottom on p-warnings to map the wanted styles to
	// the p-warnings template
	@Input() private class ?: string;

	constructor(
		private el : ElementRef<HTMLElement>,
		private renderer : Renderer2,
	) {
	}

	public ngAfterContentInit() : void {
		this.setAnimation();
	}

	private setAnimation() : void {
		if (this.disableAnimation) return;
		// get overlay container to set property that disables animations
		const overlayContainerElement : HTMLElement = this.el.nativeElement;
		// angular animations renderer hooks up the logic to disable animations into setProperty
		this.renderer.setProperty( overlayContainerElement, '@slideVertical', true );
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get hasClassRoundedBottom() : boolean {
		return !!this.class?.includes('rounded-bottom');
	}
}
