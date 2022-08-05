import { SubscriptionLike as ISubscription } from 'rxjs';
import { OnInit, OnChanges, OnDestroy, AfterContentChecked} from '@angular/core';
import { Component, ChangeDetectionStrategy, HostBinding, ChangeDetectorRef } from '@angular/core';
import { Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiShiftModels } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiShifts } from '@plano/shared/api';
import { PRouterService } from '../../../../../../shared/core/router.service';
import { CalenderTimelineLayoutService } from '../../calender-timeline-layout.service';
import { PTimelineNowLineComponent } from '../timeline-now-line/timeline-now-line.component';
import { PTimelineSeparatorsComponent } from '../timeline-separators/timeline-separators.component';

@Component({
	selector: 'p-timeline-day',
	templateUrl: './timeline-day.component.html',
	styleUrls: ['./timeline-day.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})

export class PTimelineDayComponent implements OnInit, OnChanges, OnDestroy, AfterContentChecked {
	@Input() private shifts : SchedulingApiShifts | null = null;

	private timestamp : number | null = null;
	@Input('timestamp') private set _timestamp(input : number) {
		this.timestamp = input;
		this.api.isLoaded(() => {
			this.timelineSeparatorsRef.scrollToStartOfWorkday();
		});
	}

	@HostBinding('class.inside-week')
	@Input() public insideWeekView : boolean = false;
	@Input() public selectable : boolean = false;

	@ViewChild('nowLineRef', { static: false }) public nowLineRef ?: PTimelineNowLineComponent;

	constructor(
		public api : SchedulingApiService,
		public layout : CalenderTimelineLayoutService,
		private pMoment : PMomentService,
		private pRouterService : PRouterService,
		private changeDetectorRef : ChangeDetectorRef,
	) {
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	@ViewChild('shiftsWrap', { static: true }) private shiftsWrap ! : any;

	private subscriptions : ISubscription[] = [];

	public ngOnInit() : void {
		if (!this.insideWeekView) {
			this.layout.setTimelineContainer(this.shiftsWrap.nativeElement);
		}

		window.setTimeout(() => this.scrollToNowLine(false), 100);
		this.subscriptions.push(this.pRouterService.events.subscribe((event) => {
			if (!(event instanceof NavigationEnd)) return;
			this.scrollToNowLine(true);
		}));
	}

	private scrollToNowLine(waitForApiLoaded : boolean) : void {
		const callback = () : void => {
			requestAnimationFrame(() => {
				if (!this.nowLineRef?.layout.show) return;
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
		if (!this.insideWeekView) {
			this.layout.setTimelineContainer(null);
		}
	}

	@ViewChild('timelineSeparatorsRef', { static: true }) public timelineSeparatorsRef ! : PTimelineSeparatorsComponent;

	public ngOnChanges() : void {
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get shiftsForDay() : SchedulingApiShifts {
		return this.shifts!.between(
			+this.pMoment.m(this.timestamp).startOf('day'),
			+this.pMoment.m(this.timestamp).startOf('day').add(1, 'day'),
		);
	}

	/**
	 * Get shiftsModels for the gutter in background
	 */
	public get shiftModelsForList() : SchedulingApiShiftModels {
		return this.api.data.shiftModels.filterBy((item) => {
			return !item.trashed;
		});
	}

	private startOfToday ! : number;

	public ngAfterContentChecked() : void {
		this.startOfToday = +this.pMoment.m().startOf('day');
	}

}
