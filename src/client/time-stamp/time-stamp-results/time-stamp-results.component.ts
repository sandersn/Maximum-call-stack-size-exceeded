import { interval } from 'rxjs';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { FormattedDateTimePipe } from '@plano/client/shared/formatted-date-time.pipe';
import { TimeStampApiService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';

@Component({
	selector: 'p-time-stamp-results',
	templateUrl: './time-stamp-results.component.html',
	styleUrls: ['./time-stamp-results.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})

export class TimeStampResultsComponent implements OnDestroy {
	private interval : ISubscription | null = null;
	public workingTimeDuration : number | null = null;
	public regularPauseDuration : number | null = null;
	public automaticPauseDuration : number | null = null;

	constructor(
		public api : TimeStampApiService,
		public formattedDateTimePipe : FormattedDateTimePipe,
	) {
		// don’t start update interval on tests because we do not know the state of api there
		if (Config.APPLICATION_MODE !== 'TEST') {
			this.setUpdateInterval(500);
		}
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get start() : number | null {
		if (!this.api.isLoaded()) return null;
		return this.api.data.start;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get end() : number | null {
		if (!this.api.isLoaded()) return null;
		return this.api.data.end;
	}

	public ngOnDestroy() : void {
		this.interval?.unsubscribe();
	}

	private setUpdateInterval(intervalDuration : number) : void {
		this.interval = interval(intervalDuration)
			.subscribe(() => {
				this.workingTimeDuration = this.api.data.workingTimeDuration;
				this.regularPauseDuration = this.api.data.regularPauseDuration;
				this.automaticPauseDuration = this.api.data.automaticPauseDuration;
			});

		// this.interval = window.setInterval(
		// 	() => {
		// 		this.workingTimeDuration = this.api.data.workingTimeDuration;
		// 		this.regularPauseDuration = this.api.data.regularPauseDuration;
		// 	}, intervalDuration
		// );
	}

}
