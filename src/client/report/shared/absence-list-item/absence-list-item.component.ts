import { AfterContentChecked} from '@angular/core';
import { Component, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { FilterService } from '@plano/client/shared/filter.service';
import { SchedulingApiWorkingTime } from '@plano/shared/api';
import { SchedulingApiAbsence, SchedulingApiService, SchedulingApiAbsences } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { Data } from '@plano/shared/core/data/data';
import { assumeNonNull } from '../../../../shared/core/null-type-utils';
import { PDictionarySourceString } from '../../../../shared/core/pipe/localize.dictionary';
import { FormattedDateTimePipe } from '../../../shared/formatted-date-time.pipe';
import { DateInfo } from '../../../shared/formatted-date-time.pipe';
import { ReportFilterService } from '../../report-filter.service';

@Component({
	selector: 'p-absence-list-item[absence][min][max]',
	templateUrl: './absence-list-item.component.html',
	styleUrls: ['./absence-list-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class AbsenceListItemComponent implements AfterContentChecked {
	@HostBinding('id') private get hasId() : string {
		return `scroll-target-id-${this.absence.id.toString()}`;
	}

	public readonly CONFIG : typeof Config = Config;

	@Input() public absence ! : SchedulingApiAbsence;
	@Input() public absences : SchedulingApiAbsences | null = null;
	@Input() public min ! : number;
	@Input() public max ! : number;

	constructor(
		private router : Router,
		private api : SchedulingApiService,
		private filterService : FilterService,
		private reportFilterService : ReportFilterService,
		private formattedDateTimePipe : FormattedDateTimePipe,
		public rightsService : RightsService,
	) {}

	public ngAfterContentChecked() : void {
	}

	/**
	 * Edit a absence entry for a member
	 */
	public openItem() : void {
		// Do nothing if user does not have the right to see the detail page.
		if (!this.absence.attributeInfoThis.canEdit) return;

		if (!this.rightsService.isOwner) return;
		const ID : string = this.absence.id.toString();
		this.router.navigate([`client/absence/${ID}`]);
	}

	private _dateInfos : Data<Map<SchedulingApiWorkingTime | SchedulingApiAbsence, DateInfo>> =
		new Data<Map<SchedulingApiWorkingTime | SchedulingApiAbsence, DateInfo>>(
			this.api, this.filterService, this.reportFilterService,
		);
	// eslint-disable-next-line jsdoc/require-jsdoc
	public getDateInfo(item : SchedulingApiWorkingTime | SchedulingApiAbsence) : DateInfo {
		const dateInfosMap = this._dateInfos.get(() => {
			const result = new Map<SchedulingApiWorkingTime | SchedulingApiAbsence, DateInfo>();

			for (const absence of this.absences!.iterable()) {
				result.set(absence, this.formattedDateTimePipe.
					getFormattedDateInfo(
						absence.time.start,
						absence.time.end,
						true,
						absence.isFullDay,
						!Config.IS_MOBILE,
					));
			}

			return result;
		});

		return dateInfosMap.get(item)!;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get absenceIsOutsideRange() : boolean {
		if (this.absence.isFullDay && this.max < this.absence.time.end) return true;
		if (!this.absence.isFullDay && this.max <= this.absence.time.end) return true;
		return false;
	}

	/**
	 * Shorthand for the title
	 */
	public get title() : PDictionarySourceString {
		assumeNonNull(this.absence.title);
		return this.absence.title;
	}
}
