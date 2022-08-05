import { AfterContentInit } from '@angular/core';
import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { SchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';

@Component({
	selector: 'p-kletterszene',
	templateUrl: './kletterszene.component.html',
	styleUrls: ['./kletterszene.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class KletterszeneComponent implements AfterContentInit {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.flex-column') protected _alwaysTrue = true;

	private _wantsToUseKletterszene : boolean = false;

	constructor(
		public api : SchedulingApiService,
		private schedulingService : SchedulingService,
	) {
	}

	public BootstrapSize = BootstrapSize;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get wantsToUseKletterszene() : boolean {
		return this._wantsToUseKletterszene;
	}

	public set wantsToUseKletterszene(value : boolean) {
		this._wantsToUseKletterszene = value;

		if (!value) {
			this.api.data.kletterszeneId = '';
			this.api.save();
		}
	}

	public ngAfterContentInit() : void {
		// Make sure we have some data as basis for this item
		if (!this.api.isLoaded()) {
			this.schedulingService.updateQueryParams();
			this.api.load({
				searchParams: this.schedulingService.queryParams,
				success: () => {
					this.initValues();
				},
			});
		} else {
			this.initValues();
		}
	}

	private initValues() : void {
		this._wantsToUseKletterszene = !!this.api.data.kletterszeneId;
	}
}
