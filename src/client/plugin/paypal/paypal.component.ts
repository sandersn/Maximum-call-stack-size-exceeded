import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { AfterContentInit } from '@angular/core';
import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BootstrapSize, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { AccountApiService, SchedulingApiService } from '@plano/shared/api';
import { PSupportedCurrencyCodes } from '@plano/shared/api/base/generated-types.ag';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { Config } from '../../../shared/core/config';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../shared/core/null-type-utils';
import { PlanoFaIconPool } from '../../../shared/core/plano-fa-icon-pool.enum';

@Component({
	selector: 'p-paypal',
	templateUrl: './paypal.component.html',
	styleUrls: ['./paypal.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PayPalComponent implements AfterContentInit, PComponentInterface {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.flex-column') protected _alwaysTrue = true;

	constructor(
		public accountApiService : AccountApiService,
		private localize : LocalizePipe,
		private route : ActivatedRoute,
		private router : Router,
		private location : Location,
		public accountApi : AccountApiService,
		public api : SchedulingApiService,
	) {
	}

	public Config = Config;
	public BootstrapSize = BootstrapSize;
	public PSupportedCurrencyCodes = PSupportedCurrencyCodes;
	public PlanoFaIconPool = PlanoFaIconPool;
	public PThemeEnum = PThemeEnum;

	public ngAfterContentInit() : void {
		// this.initValues();
		this.loadInitialData();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public loadInitialData() : void {
		//
		// Load Account api
		//

		// paypal authorization code given as query param?
		// Then we will perform an save() with paypal authorization code which will also
		// load account api
		const paypalAuthorizationCode = this.route.snapshot.queryParams['code'];

		if (paypalAuthorizationCode) {
			// remove query params so reloading page does not trigger this again.
			// We use this.location which also removes the params from browsers history stack.
			const url = this.router.url;
			const baseUrl = url.substring(0, url.indexOf('?'));
			this.location.replaceState(baseUrl);

			// Save authorization code which will as result also load accountApi
			this.accountApi.setEmptyData();
			this.accountApi.data.paypalAuthorizationCode = paypalAuthorizationCode;
			this.accountApi.save();
		} else {
			// load api
			this.accountApi.load();
		}

		// load scheduling api
		const queryParams = new HttpParams()
			.set('data', 'bookingSystemSettings');

		this.api.load({
			searchParams: queryParams,
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get translatedPayPalAccountEmailModel() : string {
		if (this.isLoading) return this.localize.transform('Lädt…');
		if (!this.accountApiService.data.paypalAccountEmail) return this.localize.transform('Noch nicht eingerichtet');
		return this.accountApiService.data.paypalAccountEmail;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isLoading() : PComponentInterface['isLoading'] {
		return !this.accountApi.isLoaded() || !this.api.isLoaded() || this.accountApi.isBackendOperationRunning;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get disablePaypalAuthorizationButton() : boolean {
		// On dev we still keep the button enabled because it is required for testing paypal
		return this.isLoading || (Config.APPLICATION_MODE === 'PROD' && Config.DEBUG === false);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public startPaypalAuthorization() : void {
		this.accountApiService.data.requestPaypalAuthorization = true;
		this.accountApiService.save({
			success: () => {
				assumeDefinedToGetStrictNullChecksRunning(this.accountApiService.data.paypalAuthorizationUrl, 'accountApiService.data.paypalAuthorizationUrl');
				// redirect to authorization page
				window.location.href = this.accountApiService.data.paypalAuthorizationUrl!;
			},
		});
	}

}
