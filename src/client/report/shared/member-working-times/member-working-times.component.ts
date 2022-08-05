import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { SLIDE_ON_NGIF_TRIGGER } from '@plano/animations';
import { ReportService } from '@plano/client/report/report.service';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiAbsence, SchedulingApiWorkingTime } from '@plano/shared/api';
import { SchedulingApiMember } from '@plano/shared/api';
import { SchedulingApiAbsences } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiWorkingTimes } from '@plano/shared/api';
import { PFaIcon } from '@plano/shared/core/component/fa-icon/fa-icon-types';
import { Config } from '@plano/shared/core/config';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';

@Component({
	selector: 'p-member-working-times[member][absences]',
	templateUrl: './member-working-times.component.html',
	styleUrls: ['./member-working-times.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	animations: [SLIDE_ON_NGIF_TRIGGER], /* cspell:ignore ngif */
})
export class MemberWorkingTimesComponent {
	public readonly CONFIG : typeof Config = Config;
	@Input() public member ! : SchedulingApiMember;
	@Input() public workingTimes : SchedulingApiWorkingTimes | null = null;
	@Input() public absences ! : SchedulingApiAbsences;
	@Input() public min ?: number = 0;
	@Input() public max ?: number;
	@HostBinding('class.d-block') protected _alwaysTrue = true;

	@HostBinding('class.bg-white') private get _bgWhite() : boolean {
		return !!this.highlightService.highlightedItem && !this.muteItem;
	}

	constructor(
		public reportService : ReportService,
		public highlightService : HighlightService,
		public rightsService : RightsService,
		private pMoment : PMomentService,
	) {
		this.max = +this.pMoment.m();
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get collapsibleLineIcon() : PFaIcon {
		if (this.disabled) return 'minus';
		return !this.reportService.isCollapsed(this.member.id) ? PlanoFaIconPool.COLLAPSIBLE_OPEN : PlanoFaIconPool.COLLAPSIBLE_CLOSE;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isOwner() : boolean | null {
		return this.rightsService.isOwner;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get disabled() : boolean {
		if (!this.rightsService.isOwner) return false;
		if (!this.memberWorkingTimes.length && !this.absences.getByMember(this.member).length) return true;
		return false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get muteItem() : boolean | null {
		assumeDefinedToGetStrictNullChecksRunning(this.member, 'this.member');
		if (this.member === this.highlightService.highlightedItem) return false;
		if (this.highlightService.isMuted(this.memberWorkingTimes)) return true;
		return false;
	}

	/**
	 * This is a shortcut to get workingTimes by member.
	 * In order to simplify the template content.
	 */
	public get memberWorkingTimes() : SchedulingApiWorkingTimes {
		return this.workingTimes!.filterBy(item => {
			if (!item.memberId.equals(this.member.id)) return false;
			if (this.min && this.max && !item.overlaps(this.min, this.max - 1)) return false;
			return true;
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get totalDuration() : number {
		return (
			this.memberWorkingTimes.durationBetween(this.min, this.max) +
			this.absences.getByMember(this.member).durationBetween(this.min, this.max)
		);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get totalEarnings() : number {

		/** cspell:ignore WORKINGTIMES */
		const WORKINGTIMES_EARNINGS = this.memberWorkingTimes.totalEarningsBetween(this.min, this.max);
		const ABSENCES_EARNINGS = this.absences.getByMember(this.member).totalEarningsBetween(this.min, this.max);
		return WORKINGTIMES_EARNINGS + ABSENCES_EARNINGS;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get commentAmount() : number {
		return this.memberWorkingTimes.commentAmount + this.absences.getByMember(this.member).commentAmount;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public onClick() : void {
		if (this.disabled) return;
		this.reportService.toggle(this.member.id);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get hasForecasts() : boolean {
		return !!this.memberWorkingTimes.findBy(item => item.isExpectedWorkingTime);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get absencesForMember() : SchedulingApiAbsence[] {
		return this.absences.getByMember(this.member).iterableSortedBy(item => item.time.start);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get workingTimesForMember() : SchedulingApiWorkingTime[] {
		return this.memberWorkingTimes.iterableSortedBy(item => item.time.start);
	}
}
