import { TemplateRef } from '@angular/core';
import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingApiMember } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiMembers } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { BootstrapSize } from '../../bootstrap-styles.enum';
import { ShiftMemberExchangeService } from '../shift-member-exchange.service';
import { ErrorArray } from '../shift-member-exchange.service';

@Component({
	selector: 'p-quick-assignment[shift]',
	templateUrl: './quick-assignment.component.html',
	styleUrls: ['./quick-assignment.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickAssignmentComponent {
	@Input() private readMode : boolean = false;

	@HostBinding('class.d-flex')
	@HostBinding('class.align-items-stretch') protected _alwaysTrue = true;

	@Input() public shift ! : SchedulingApiShift;

	@Input() public size : BootstrapSize.SM | null = null;

	public readonly CONFIG : typeof Config = Config;

	public selectedMember : SchedulingApiMember | null = null;

	constructor(
		public modalService : ModalService,
		public api : SchedulingApiService,
		public me : MeService,
		private shiftMemberExchangeService : ShiftMemberExchangeService,
		private rightsService : RightsService,
	) {
	}

	/**
	 * Get an array of errors
	 */
	public get errors() : ErrorArray {
		assumeDefinedToGetStrictNullChecksRunning(this.selectedMember, 'this.selectedMember', 'Don’t try to get errors, when selected member is not available');
		return this.shiftMemberExchangeService.errors(this.selectedMember, this.shift);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public openQuickAssignModal(
		event : Event,
		modalContent : TemplateRef<unknown>,
	) : void {
		event.stopPropagation();
		this.modalService.openModal(modalContent, {
			success: () => {
				this.assignSelectedMember();
				this.clear();
			},
			dismiss: () => {
				this.clear();
			},
		});
	}

	/**
	 * create a list of assignable members for the input-member
	 */
	public get membersForList() : SchedulingApiMembers {
		const result = new SchedulingApiMembers(this.api, true);
		for (const member of this.api.data.members.iterable()) {
			if (
				!this.shift.assignedMemberIds.contains(member.id) &&
				this.shift.assignableMembers.contains(member.id)
			) {
				result.push(member);
			}
		}
		return result;
	}

	/**
	 * Assign member to this shift and save it to the database
	 */
	public assignSelectedMember() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.selectedMember, 'selectedMember');
		this.shift.assignedMemberIds.push(this.selectedMember.id);
		this.shift.saveDetailed();
	}

	/**
	 * Clear the temporary data to make the component reusable
	 */
	private clear() : void {
		this.selectedMember = null;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showInfoAboutBlockedAssignments() : boolean {
		return (
			!!this.rightsService.userCanWrite(this.shift.model) &&
			// HACK: Next line is a hack for PLANO-4625
			!this.shift.assignedMemberIds.rawData
		);
	}

	private get assignmentIsDisabled() : boolean {
		if (this.rightsService.userCanEditAssignments(this.shift)) return false;
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isEnabled() : boolean {
		if (this.readMode) return false;
		if (this.assignmentIsDisabled) return false;
		return true;
	}
}
