import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TimeStampApiService, TimeStampApiStampedMember } from '@plano/shared/api';

@Component({
	selector: 'p-stopwatch-image',
	templateUrl: './stopwatch-image.component.html',
	styleUrls: ['./stopwatch-image.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class StopwatchImageComponent {
	@Input() private stampedMember : TimeStampApiStampedMember | null = null;
	@Input() private invertedColors : boolean = false;

	constructor( private api : TimeStampApiService ) {
		if (!api.isLoaded()) {
			api.load();
		}
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get image() : string {
		let result : string;
		if ( !this.api.isLoaded() ) {
			if (this.invertedColors) {
				result = 'stopwatch_24px_weiss.png';
			} else {
				result = 'stopwatch.png';
			}
		} else if (this.stampedMember) {
			if (this.stampedMember.pausing) {
				result = 'pause_32px.png';
			} else {
				result = 'stopwatch-animated_32px.gif';
			}
		} else if (this.api.isWorking) {
			if (this.invertedColors) {
				result = 'stopwatch-animated_24px_weiss.gif';
			} else {
				result = 'stopwatch-animated.gif';
			}
		} else if (this.api.isPausing) {
			if (this.invertedColors) {
				result = 'pause-animated_24px_weiss.gif';
			} else {
				result = 'pause-animated.gif';
			}
		} else if (this.invertedColors) {
			result = 'stopwatch_24px_weiss.png';
		} else {
			result = 'stopwatch.png';
		}

		return result;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get maxHeight() : CSSStyleDeclaration['maxHeight'] {
		if (this.invertedColors) return '22';
		if (this.stampedMember?.attributeInfoPausing.value) return '32';
		return 'auto';
	}
}
