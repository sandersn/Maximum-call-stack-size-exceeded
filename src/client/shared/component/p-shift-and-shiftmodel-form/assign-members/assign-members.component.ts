import * as $ from 'jquery';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import { NgbFormatsService } from '@plano/client/service/ngbformats.service';
import { AbsenceService } from '@plano/client/shared/absence.service';
import { ShiftModalSizes } from '@plano/client/shift/shift-modal-sizes';
import { SchedulingApiMember } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiShiftModel } from '@plano/shared/api';
import { SchedulingApiMembers } from '@plano/shared/api';
import { SchedulingApiShift } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PlanoFaIconPoolValues } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../shared/core/null-type-utils';
import { EditableControlInterface } from '../../../p-editable/editable/editable.directive';

@Component({
	selector: 'p-assign-members[shiftModel]',
	templateUrl: './assign-members.component.html',
	styleUrls: ['./assign-members.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class AssignMembersComponent implements AfterContentInit {
	public readonly CONFIG : typeof Config = Config;

	@Input() public api : SchedulingApiService | null = null;
	@Input() public shiftModel ! : SchedulingApiShiftModel;
	@Input() public shift : SchedulingApiShift | null = null;
	@Input() public formItemCopy : SchedulingApiShiftModel | SchedulingApiShift | null = null;
	@Input() public saveChangesHook ?: EditableControlInterface['saveChangesHook'];
	@Input() public showHearts : boolean = false;
	@Input('disabled') private _disabled : boolean | null = null;

	constructor(
		public ngbFormats : NgbFormatsService,
		private modalService : ModalService,
		public absenceService : AbsenceService,
		private rightsService : RightsService,
		private console : LogService,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get boxDisabled() : boolean {
		if (Config.IS_MOBILE) return true;
		if (this._disabled !== null) return this._disabled;
		return !!this.shift && this.assignmentIsDisabled;
	}

	/**
	 * Icon of the members absence
	 */
	public absenceTypeIconName(memberId : Id) : PlanoFaIconPoolValues | null {
		return this.absenceService.absenceTypeIconName(memberId, {
			start : this.shift ? this.shift.start : this.shiftModel.time.start,
			end : this.shift ? this.shift.end : this.shiftModel.time.end,
			id : this.shift ? this.shift.id : null,
		});
	}

	public tempAssignedMembers : SchedulingApiMembers | null = null;

	public ngAfterContentInit() : void {
		this.copyList();
		this.updateFormItemCopy();
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public assignMembersHook(modalContent : TemplateRef<unknown>) : () => void {
		return this.modalService.getEditableHook(modalContent, {
			success: () => {
				this.copyList();
			},
			dismiss: () => {
				this.copyList();
			},
			size: ShiftModalSizes.WITH_TRANSMISSION_PREVIEW,
		});
	}

	/**
	 * Create a copy of the list.
	 * This is necessary to determine if the "send mail to members" checkbox should be visible or not.
	 */
	private copyList() : void {
		// FIXME: PLANO-5166
		this.tempAssignedMembers = new SchedulingApiMembers(null, false);
		for (const item of this.formItem.assignedMembers.iterableSortedBy(['lastName', 'firstName', 'trashed'])) {
			this.tempAssignedMembers.push(item);
		}
	}

	/**
	 * determine if the "send mail to members" checkbox should be visible or not
	 */
	public get showSendMailCheckbox() : boolean {
		// Never inform a member if ShiftModels gets edited [PLANO-15402]
		if (this.formItem instanceof SchedulingApiShiftModel) return false;

		// Changing assignedMembers ➡ Show Checkbox
		if (!this.formItem.assignedMembers.equals(this.tempAssignedMembers!)) return true;

		if (this.changingAssignableMembers) return true;

		return false;
	}

	private get changingAssignableMembers() : boolean {
		// Changing "assignableMembers" and applying to other shifts?
		if (!this.api!.data.shiftChangeSelector.isChangingShifts) return false;
		// Changing "assignableMembers" but invalid data
		if (!this.api!.data.shiftChangeSelector.start) return false;
		// Changing "assignableMembers" but invalid data
		if (!this.api!.data.shiftChangeSelector.end) return false;
		// Changing "assignableMembers"
		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get formItem() : SchedulingApiShift | SchedulingApiShiftModel {
		if (this.shift) return this.shift;
		return this.shiftModel;
	}

	/**
	 * Copy raw data and paste it to the formItemCopy.
	 * Prevents some issues that happen when the references get lost.
	 * @deprecated
	 * TODO: This smells like crap. It probably needs to get removed, but remember to check if »references get lost«
	 */
	public updateFormItemCopy() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.formItem, 'formItem');

		this.formItemCopy = null;
		if (this.formItem instanceof SchedulingApiShift) {
			this.formItemCopy = new SchedulingApiShift(this.api);
		} else {
			this.formItemCopy = new SchedulingApiShiftModel(this.api);
		}
		const rawDataCopy = $.extend(true, [], this.formItem.rawData);
		this.formItemCopy._updateRawData(rawDataCopy, false);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get assignableMembersForList() : SchedulingApiMember[] {
		const result = new SchedulingApiMembers(this.api, false);
		for (const assignableMember of this.formItemCopy!.assignableMembers.iterable()) {
			const member = this.api!.data.members.get(assignableMember.memberId);
			if (!member) throw new Error('Could not find assignable member');
			result.push(member);
		}
		return result.iterableSortedBy([
			item => item.lastName,
			item => item.firstName,
			item => !item.trashed,
		]);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get assignedMembersForList() : SchedulingApiMember[] {
		const result = new SchedulingApiMembers(this.api, false);
		for (const assignedMembers of this.formItemCopy!.assignedMembers.iterable()) {
			const member = this.api!.data.members.get(assignedMembers.id);
			if (!member) throw new Error('Could not find assignable member');
			result.push(member);
		}
		return result.iterableSortedBy([
			item => item.lastName,
			item => item.firstName,
			item => !item.trashed,
			item => this.isMe(item),
		]);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get hasAssignedMembersForList() : boolean {
		return !!this.formItemCopy!.assignedMemberIds.length;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get hasAssignableMembersForList() : boolean {
		if (!this.formItemCopy!.assignableMembers.hasUntrashedItem) return false;
		if (this.formItemCopy!.assignableMembers.unTrashedItemsAmount <= this.formItemCopy!.assignedMemberIds.length) {
			return false;
		}
		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public earningsForMember(member : SchedulingApiMember) : number | null {
		const ASSIGNABLE_MEMBER = this.formItem.assignableMembers.getByMember(member);
		if (ASSIGNABLE_MEMBER === null) return 0;
		const earnings = ASSIGNABLE_MEMBER.attributeInfoHourlyEarnings.value;
		if (earnings !== null && typeof earnings === 'number') {
			return earnings;
		}
		this.console.error('earningsForMember could not be calculated. Not sure if this should happen.');
		return null;
	}

	/**
	 * Toggle passed item in List of Assignable ShiftModels
	 * @param shiftModel Selected item
	 */
	public toggleAssignableMember(member : SchedulingApiMember) : void {
		if (!this.formItem.assignableMembers.containsMember(member)) {
			this.formItem.assignableMembers.addNewMember(member);
			return;
		}

		if (this.formItem.assignedMemberIds.contains(member.id)) {
			this.formItem.assignedMemberIds.removeItem(member.id);
		}
		this.formItem.assignableMembers.removeMember(member);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get assignmentIsDisabled() : boolean {
		if (!this.shift) this.console.warn('No Shift? How is this possible?');
		if (this.shift && this.rightsService.userCanEditAssignments(this.shift)) return false;
		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public toggleAssignedMember(member : SchedulingApiMember) : void {
		if (this.formItem.assignedMemberIds.contains(member.id)) {
			this.formItem.assignedMemberIds.removeItem(member.id);
			return;
		}

		this.formItem.assignableMembers.addNewMember(member);
		this.formItem.assignedMemberIds.push(member.id);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public isMe(member : SchedulingApiMember) : boolean {
		const result = this.rightsService.isMe(member.id);
		assumeDefinedToGetStrictNullChecksRunning(result, 'result');
		return result;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isOwner() : boolean {
		const result = this.rightsService.isOwner;
		assumeDefinedToGetStrictNullChecksRunning(result, 'result');
		return result;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showListOfUnassignableMembers() : boolean {
		if (!this.isOwner) return false;
		return this.api!.data.members.length > this.formItemCopy!.assignableMembers.length;
	}
}
