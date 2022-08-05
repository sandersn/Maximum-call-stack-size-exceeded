import { Component, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { FilterService } from '@plano/client/shared/filter.service';
import { DateInfo} from '@plano/client/shared/formatted-date-time.pipe';
import { FormattedDateTimePipe } from '@plano/client/shared/formatted-date-time.pipe';
import { SchedulingApiWorkingTime, SchedulingApiWorkingTimes } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { Data } from '@plano/shared/core/data/data';
import { ReportFilterService } from '../../report-filter.service';

@Component({
	selector: 'p-workingtime-list-item[workingTime][min][max]',
	templateUrl: './workingtime-list-item.component.html',
	styleUrls: ['./workingtime-list-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class WorkingtimeListItemComponent {
	@HostBinding('id') private get hasId() : string {
		return `scroll-target-id-${this.workingTime.id.toString()}`;
	}

	public readonly CONFIG : typeof Config = Config;

	@Input() public workingTime ! : SchedulingApiWorkingTime;
	@Input() public workingTimes : SchedulingApiWorkingTimes | null = null;
	@Input() public min ! : number;
	@Input() public max ! : number;

	constructor(
		private router : Router,
		private api : SchedulingApiService,
		private filterService : FilterService,
		private reportFilterService : ReportFilterService,
		private formattedDateTimePipe : FormattedDateTimePipe,
	) {}

	/**
	 * Edit a workingTime entry for a member
	 */
	public openItem() : void {
		// Do nothing if user does not have the right to see the detail page.
		if (!this.workingTime.attributeInfoThis.canEdit) return;

		const ID : string = this.workingTime.id.toString();
		this.router.navigate([`client/workingtime/${ID}`]);
	}

	private _dateInfos : Data<Map<SchedulingApiWorkingTime, DateInfo>> =
		new Data<Map<SchedulingApiWorkingTime, DateInfo>>(
			this.api, this.filterService, this.reportFilterService,
		);
	// eslint-disable-next-line jsdoc/require-jsdoc
	public getDateInfo(item : SchedulingApiWorkingTime) : DateInfo {
		const dateInfosMap = this._dateInfos.get(() => {
			const result = new Map<SchedulingApiWorkingTime, DateInfo>();

			for (const workingTime of this.workingTimes!.iterable()) {
				result.set(
					workingTime,
					this.formattedDateTimePipe.getFormattedDateInfo(
						workingTime.time.start,
						workingTime.time.end,
						true,
						undefined,
						!Config.IS_MOBILE,
					),
				);
			}

			return result;
		});

		return dateInfosMap.get(item)!;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get memberName() : string | null {
		if (!this.workingTime.member) return null;
		return this.workingTime.member.firstName;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get shiftModelName() : string | undefined {
		if (!this.workingTime.attributeInfoShiftModelId.value) return undefined;
		if (!this.api.isLoaded()) return undefined;
		const model = this.api.data.shiftModels.get(this.workingTime.shiftModelId);
		if (!model) return undefined;
		return model.name;

	}
}
