import { AfterContentInit } from '@angular/core';
import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { BootstrapSize, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { MeService } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';

@Component({
	selector: 'p-beta7',
	templateUrl: './beta7.component.html',
	styleUrls: ['./beta7.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class Beta7Component implements AfterContentInit {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.flex-column') protected _alwaysTrue = true;

	private initialIsUsingBeta7Value : boolean = false;

	constructor(
		public meService : MeService,
		public api : SchedulingApiService,
		private schedulingService : SchedulingService,
	) {
	}

	public PThemeEnum = PThemeEnum;
	public BootstrapSize = BootstrapSize;

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

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get clientId() : string {
		if (!this.meService.isLoaded()) return 'Loading…';
		return this.meService.data.clientId.toString();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public activate(input : boolean) : void {
		this.api.data.isUsingBeta7 = input;
		if (input === true) {
			this.initValues();
		}
	}

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	private initValues() : void {
		this.initialIsUsingBeta7Value = this.api.data.isUsingBeta7;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showUnlinkHint() : boolean {
		if (this.initialIsUsingBeta7Value !== true) return false;
		if (this.api.data.isUsingBeta7) return false;
		return true;
	}
}
