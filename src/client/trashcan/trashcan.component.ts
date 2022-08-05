import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiMembers } from '@plano/shared/api';
import { SchedulingApiMember } from '@plano/shared/api';
import { ApiListWrapper } from '@plano/shared/api';
import { BootstrapSize } from '../shared/bootstrap-styles.enum';

@Component({
	selector: 'p-trashcan',
	templateUrl: './trashcan.component.html',
	styleUrls: ['./trashcan.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class TrashcanComponent implements AfterContentInit {
	@HostBinding('class.h-100')
	@HostBinding('class.bg-dark') protected _alwaysTrue = true;

	constructor(
		public api : SchedulingApiService,
		private schedulingService : SchedulingService,
	) {
	}

	public BootstrapSize = BootstrapSize;

	public membersForList : ApiListWrapper<SchedulingApiMember> = new SchedulingApiMembers(
		null, false,
	);

	public ngAfterContentInit() : void {
		if (!this.api.isLoaded()) {
			this.loadNewData();
		} else {
			this.getItems();
		}
	}

	/**
	 * Load new Data from api
	 */
	private loadNewData() : void {
		this.schedulingService.updateQueryParams();
		this.api.load({
			searchParams: this.schedulingService.queryParams,
			success: () => {
				this.getItems();
			},
		});
	}

	private getItems() : void {
		this.membersForList = this.api.data.members.filterBy((member) => {
			return member.trashed;
		}).sortedBy([
			(item) => item.lastName,
			(item) => item.firstName,
		], true);
	}

}
