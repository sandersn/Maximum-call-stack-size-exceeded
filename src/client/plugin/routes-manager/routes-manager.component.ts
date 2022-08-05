import { AfterContentInit } from '@angular/core';
import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { SchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { BootstrapSize, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { Id } from '@plano/shared/api/base/id';
import { MeService } from '@plano/shared/core/me/me.service';

@Component({
	selector: 'p-routes-manager',
	templateUrl: './routes-manager.component.html',
	styleUrls: ['./routes-manager.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class RoutesManagerComponent implements AfterContentInit {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.flex-column') protected _alwaysTrue = true;

	private initialIsUsingRoutesManagerValue : boolean = false;

	constructor(
		public meService : MeService,
		public api : SchedulingApiService,
		private schedulingService : SchedulingService,
	) {
	}

	public BootstrapSize = BootstrapSize;
	public PThemeEnum = PThemeEnum;

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
	public get clientId() : Id | string {
		if (!this.meService.isLoaded()) return 'Loading…';
		return this.meService.data.clientId;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public activate(input : boolean) : void {
		this.api.data.isUsingRoutesManager = input;
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
		this.initialIsUsingRoutesManagerValue = this.api.data.isUsingRoutesManager;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showUnlinkHint() : boolean {
		if (this.initialIsUsingRoutesManagerValue !== true) return false;
		if (this.api.data.isUsingRoutesManager) return false;
		return true;
	}

}
