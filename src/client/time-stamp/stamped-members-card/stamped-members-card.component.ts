import { OnDestroy} from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TimeStampApiService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';

@Component({
	selector: 'p-stamped-members-card',
	templateUrl: './stamped-members-card.component.html',
	styleUrls: ['./stamped-members-card.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class StampedMembersCardComponent implements OnDestroy {
	private interval : number | null = null;

	constructor(public api : TimeStampApiService) {

		// don’t start automatic api update for tests to prevent 401 errors.
		// Because there we cannot know who is currently logged in.
		if (Config.APPLICATION_MODE !== 'TEST') this.setUpdateInterval(120000);
	}

	public ngOnDestroy() : void {
		window.clearInterval(this.interval ?? undefined);
	}

	private setUpdateInterval(intervalDuration : number) : void {
		this.interval = window.setInterval(() => {
			if (!this.api.isLoaded()) return;
			this.api.save({
				saveEmptyData: true,
				sendRootMetaOnEmptyData: true,
			});
		}, intervalDuration);
	}
}
