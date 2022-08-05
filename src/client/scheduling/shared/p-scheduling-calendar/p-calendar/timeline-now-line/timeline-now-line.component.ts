import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CalenderTimelineLayoutService } from '../../calender-timeline-layout.service';
import { ILayout } from '../../calender-timeline-layout.types';

@Component({
	selector: 'p-timeline-now-line',
	templateUrl: './timeline-now-line.component.html',
	styleUrls: ['./timeline-now-line.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PTimelineNowLineComponent {
	constructor(
		private layoutService : CalenderTimelineLayoutService,
	) {
	}

	/** Get layout data for the now line */
	public get layout() : ILayout {
		return this.layoutService.getLayout(this.layoutService.NOW_LINE);
	}
}
