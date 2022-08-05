import { AfterViewInit } from '@angular/core';
import { Component, ElementRef, ViewChild, ChangeDetectionStrategy, Input, NgZone } from '@angular/core';

@Component({
	selector: 'p-timeline-separators',
	templateUrl: './timeline-separators.component.html',
	styleUrls: ['./timeline-separators.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})

export class PTimelineSeparatorsComponent implements AfterViewInit {
	@Input() public showNumbers : boolean = false;

	@ViewChild('startOfWorkday', { static: true }) public startOfWorkday ! : ElementRef<HTMLDivElement>;

	constructor(
		private zone : NgZone,
	) {}

	public ngAfterViewInit() : void {
		this.scrollToStartOfWorkday();
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public scrollToStartOfWorkday() : void {
		this.zone.runOutsideAngular(() => {
			requestAnimationFrame(() => {
				const el = this.startOfWorkday.nativeElement;
				el.scrollIntoView();
			});
		});
	}
}
