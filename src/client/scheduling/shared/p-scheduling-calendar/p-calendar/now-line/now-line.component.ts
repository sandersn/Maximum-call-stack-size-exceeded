import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'p-now-line',
	templateUrl: './now-line.component.html',
	styleUrls: ['./now-line.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PNowLineComponent {
	@HostBinding('class.scroll-target-id-now-line') protected _alwaysTrue = true;

	constructor(
	) {
	}
}
