import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';

@Component({
	selector: 'p-timeline-shiftmodel-parent-column',
	templateUrl: './timeline-shiftmodel-parent-column.component.html',
	styleUrls: ['./timeline-shiftmodel-parent-column.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PTimelineShiftModelParentColumnComponent {
	@HostBinding('class.border-left')
	@HostBinding('class.p-2') protected _alwaysTrue = true;

	@Input() public name : string | null = null;

	constructor(
	) {
	}

}
