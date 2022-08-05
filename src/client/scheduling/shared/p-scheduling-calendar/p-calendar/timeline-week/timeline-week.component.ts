import { SubscriptionLike as ISubscription } from 'rxjs';
import { ElementRef, OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { PMoment } from '@plano/client/shared/p-moment.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiShifts } from '@plano/shared/api';
import { PRouterService } from '../../../../../../shared/core/router.service';
import { CalenderTimelineLayoutService } from '../../calender-timeline-layout.service';
import { PTimelineNowLineComponent } from '../timeline-now-line/timeline-now-line.component';

@Component({
	selector: 'p-timeline-week[timestamp]',
	templateUrl: './timeline-week.component.html',
	styleUrls: ['./timeline-week.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})

export class PTimelineWeekComponent implements OnInit, OnDestroy {
	// This must be equal to the css styles of .pb-tawk
	public pbTawk = 200;

	@Input() public shifts : SchedulingApiShifts | null = null;
	@Input() public timestamp ! : number;

	@Input() public selectable : boolean = false;

	@ViewChild('timelineContainer', { static: true }) private timelineContainer ! : ElementRef<HTMLDivElement>;
	@ViewChild('nowLineRef', { static: true }) public nowLineRef ! : PTimelineNowLineComponent;
	private today ! : number;

	private subscriptions : ISubscription[] = [];

	constructor(
		public layout : CalenderTimelineLayoutService,
		public api : SchedulingApiService,
		private pMoment : PMomentService,
		private pRouterService : PRouterService,
	) {
		this.today = +this.pMoment.m().startOf('day');
	}

	public ngOnInit() : void {
		this.layout.setTimelineContainer(this.timelineContainer.nativeElement);
		window.setTimeout(() => this.scrollToNowLine(false), 100);
		this.subscriptions.push(this.pRouterService.events.subscribe((event) => {
			if (!(event instanceof NavigationEnd)) return;
			this.scrollToNowLine(true);
		}));
	}

	private scrollToNowLine(waitForApiLoaded : boolean) : void {
		const callback = () : void => {
			requestAnimationFrame(() => {
				if (!this.nowLineRef.layout.show) return;
				this.pRouterService.scrollToSelector('.scroll-target-id-now-line', undefined, false, false, false);
			});
		};
		if (!waitForApiLoaded) {
			callback();
			return;
		}

		const subscriber = this.api.onDataLoaded.subscribe(() => {
			callback();
			subscriber.unsubscribe();
		});
	}

	public ngOnDestroy() : void {
		this.layout.setTimelineContainer(null);
		for (const subscription of this.subscriptions) subscription.unsubscribe();
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get shiftsForWeek() : SchedulingApiShifts | null {
		return this.shifts;
	}

	private get weekStart() : PMoment.Moment {
		return this.pMoment.m(this.timestamp).startOf('isoWeek');
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get weekdays() : number[] {
		const result : number[] = [];
		for (let i = 0; i < 7; i++) {
			const dayTimestamp = this.weekStart.add(i, 'day').valueOf();
			result.push(dayTimestamp);
		}
		return result;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public isInThePast(startOfDay : number) : boolean {
		return this.pMoment.m(startOfDay).isBefore(this.today);
	}
}
