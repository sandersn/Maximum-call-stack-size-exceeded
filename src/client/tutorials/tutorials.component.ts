import { AfterContentInit} from '@angular/core';
import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { MeService } from '@plano/shared/api';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PSupportedLanguageCodes } from '../../shared/api/base/generated-types.ag';
import { Config } from '../../shared/core/config';
import { RightsService } from '../accesscontrol/rights.service';
import { ReportUrlParamsService } from '../report/report-url-params.service';
import { SchedulingApiService } from '../scheduling/shared/api/scheduling-api.service';

@Component({
	selector: 'p-tutorials',
	templateUrl: './tutorials.component.html',
	styleUrls: ['./tutorials.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class TutorialsComponent implements AfterContentInit {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.position-relative') protected _alwaysTrue = true;

	constructor(
		public me : MeService,
		private rightsService : RightsService,
		private api : SchedulingApiService,
		private reportUrlParamsService : ReportUrlParamsService,
	) {
	}

	public Config = Config;
	public PSupportedLanguageCodes = PSupportedLanguageCodes;
	public PThemeEnum = PThemeEnum;
	public PlanoFaIconPool = PlanoFaIconPool;

	public ngAfterContentInit() : void {
		if (this.api.isLoaded()) return;

		this.reportUrlParamsService.updateQueryParams();
		this.api.load({ searchParams: this.reportUrlParamsService.queryParams });
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get userCanEditAssignmentProcesses() : RightsService['userCanEditAssignmentProcesses'] {
		return this.rightsService.userCanEditAssignmentProcesses;
	}

	/** @see RightsService['userCanWriteBooking'] */
	public get userCanWriteBookings() : ReturnType<RightsService['userCanWriteBookings']> {
		return this.rightsService.userCanWriteBookings();
	}
}
