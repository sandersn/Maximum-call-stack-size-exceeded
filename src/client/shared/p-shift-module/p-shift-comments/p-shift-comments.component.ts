import { OnInit } from '@angular/core';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FilterService } from '@plano/client/shared/filter.service';
import { SchedulingApiTodaysShiftDescription, SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiTodaysShiftDescriptions, SchedulingApiShifts } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';

@Component({
	selector: 'p-shift-comments',
	templateUrl: './p-shift-comments.component.html',
	styleUrls: ['./p-shift-comments.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})

export class PShiftCommentsComponent implements OnInit {
	public showAllDescriptions : boolean = false;
	@Input() private date : number | null = null;
	@Input() public shiftsForList : SchedulingApiShifts = new SchedulingApiShifts(null, false);

	constructor(
		public me : MeService,
		private api : SchedulingApiService,
		private filterService : FilterService,
		public rightsService : RightsService,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;

	public ngOnInit() : void {
		this.showAllDescriptions = !this.isForDesk;
	}

	private get isForDesk() : boolean {
		return !this.date;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get shiftDescriptionsForList() : SchedulingApiTodaysShiftDescriptions {
		if (this.date || !this.api.isLoaded()) return new SchedulingApiTodaysShiftDescriptions(null, false);
		return this.api.data.todaysShiftDescriptions.filterBy((item) => {
			return this.filterService.isVisible(item);
		});
	}

	/**
	 * get shifts for this day for current user
	 */
	public get shiftDescriptionsForMember() : SchedulingApiTodaysShiftDescriptions {
		if (!this.api.isLoaded()) return new SchedulingApiTodaysShiftDescriptions(null, false);

		return this.shiftDescriptionsForList.filterBy((item) => {
			return this.shiftIsForMe(item);
		});
	}

	/**
	 * get shifts for this day for current user
	 */
	public get shiftsForMember() : SchedulingApiShifts {
		if (!this.api.isLoaded()) return new SchedulingApiShifts(null, false);

		return this.shiftsForList.filterBy((item) => {
			return item.assignedMemberIds.contains(this.me.data.id);
		});
	}

	/**
	 * get visible descriptions
	 */
	public get visibleDescriptions() : SchedulingApiTodaysShiftDescriptions {
		if (!this.api.isLoaded()) return new SchedulingApiTodaysShiftDescriptions(null, false);

		if (this.showAllDescriptions) return this.shiftDescriptionsForList;
		return this.shiftDescriptionsForMember;
	}

	/**
	 * Check if the shift comment of this shift is relevant for me
	 * This can also be used in the template to highlight shift comments that are relevant for the user
	 */
	public shiftIsForMe(input : SchedulingApiTodaysShiftDescription) : boolean {
		return input.isRequesterAssigned;
	}

	/**
	 * Check if that day has more shift comments than the comments for current user
	 * @returns difference
	 */
	public get hasMoreComments() : number {
		if (this.isForDesk) {
			return this.shiftDescriptionsForList.length - this.shiftDescriptionsForMember.length;
		}
		return this.shiftsForList.length - this.shiftsForMember.length;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isAdmin() : boolean {
		return this.me.data.isOwner;
	}

	/**
	 * Should all shift-comments be visible? Is not, only the shift-comments for members shifts are visible.
	 */
	public onToggleShowAll() : void {
		this.showAllDescriptions = !this.showAllDescriptions;
	}

	/**
	 * Check if user can edit this items comment
	 */
	public userCanWrite(item : SchedulingApiShift | SchedulingApiTodaysShiftDescription) : boolean | null {
		return this.rightsService.userCanWrite(item);
	}
}
