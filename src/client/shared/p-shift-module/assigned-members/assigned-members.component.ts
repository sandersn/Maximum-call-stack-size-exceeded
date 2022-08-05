
import { OnInit, TemplateRef } from '@angular/core';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { AbsenceService } from '@plano/client/shared/absence.service';
import { SchedulingApiService, SchedulingApiShift, SchedulingApiAbsenceType } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiMember} from '@plano/shared/api';
import { SchedulingApiShiftExchange } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PlanoFaIconPoolValues } from '../../../../shared/core/plano-fa-icon-pool.enum';
import { BootstrapSize } from '../../bootstrap-styles.enum';
import { MemberBadgeComponent } from '../../p-member/member-badges/member-badge/member-badge.component';
import { PMomentService } from '../../p-moment.service';

@Component({
	selector: 'p-assigned-members[shift]',
	templateUrl: './assigned-members.component.html',
	styleUrls: ['./assigned-members.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignedMembersComponent implements OnInit {
	@Input() public readMode : boolean = false;

	@Input() public shift ! : SchedulingApiShift;

	@Input() public size : BootstrapSize.SM | null = null;

	public deletableMember ! : SchedulingApiMember;
	private now ! : number;

	constructor(
		private modalService : ModalService,
		public api : SchedulingApiService,
		private absenceService : AbsenceService,
		private rightsService : RightsService,
		private pMoment : PMomentService,
	) {
	}

	public ngOnInit() : void {
		this.now = +this.pMoment.m();
	}

	/**
	 * Should the button that navigates to the Shift-Exchange form be visible?
	 */
	public showExchangeBtn(assignedMember : SchedulingApiMember) : boolean {
		if (this.readMode) return false;

		if (this.shiftIsInThePast) return false;

		if (this.getShiftExchangeForMember(assignedMember.id)) return true;
		if (this.isMe(assignedMember)) return true;
		if (this.userCanCreateIllness) return true;

		return false;
	}

	private get userCanCreateIllness() : boolean | undefined {
		return this.rightsService.hasManagerRightsForShiftModel(this.shift.shiftModelId);
	}

	private get shiftIsInThePast() : boolean {
		return this.shift.end < this.now;
	}

	/**
	 * Is the given member the logged in user?
	 */
	public isMe(member : SchedulingApiMember) : boolean | undefined {
		return this.rightsService.isMe(member);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showDeleteButton() : boolean | null {
		if (this.readMode) return false;
		return this.rightsService.userCanWrite(this.shift);
	}

	/**
	 * Get the related shiftExchange if one is available
	 */
	public getShiftExchangeForMember(memberId : Id) : SchedulingApiShiftExchange | null {
		if (!this.api.isLoaded()) return null;
		return this.api.data.shiftExchanges.getByShiftAndMember(this.shift.id, memberId) ?? null;
	}

	/**
	 * Open some "Are you sure" modal
	 */
	public openDeleteModal(
		event : Event,
		assignedMember : SchedulingApiMember,
		modalContent : TemplateRef<unknown>,
	) : void {
		event.stopPropagation();
		this.deletableMember = assignedMember;
		this.modalService.openModal(modalContent, {
			success: () => {
				this.shift.assignedMemberIds.removeItem(assignedMember.id);
				this.shift.saveDetailed();
			},
		});
	}

	/**
	 * If the member has an absence at the time-range of the shift, then show an absence-icon.
	 */
	public absenceTypeIconName(memberId : Id) : PlanoFaIconPoolValues | null {
		return this.absenceService.absenceTypeIconName(memberId, this.shift);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get assignedMembersForList() : SchedulingApiMember[] {
		return this.shift.assignedMembers.iterableSortedBy([
			item => item.lastName,
			item => item.firstName,
			item => !item.trashed,
			item => this.isMe(item),
		]);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public absenceType(memberId : Id) : MemberBadgeComponent['absenceType'] {
		if (this.shift.assignedMembers.get(memberId)?.trashed) return 'trashed';
		const type = this.absenceService.absenceType(memberId, this.shift);
		return type === SchedulingApiAbsenceType.OTHER ? null : type ?? null;
	}
}
