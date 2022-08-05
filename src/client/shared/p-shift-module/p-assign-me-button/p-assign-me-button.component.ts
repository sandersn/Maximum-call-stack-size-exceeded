import { TemplateRef } from '@angular/core';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { EarlyBirdService } from '@plano/client/scheduling/early-bird.service';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { SchedulingApiShift } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState, SchedulingApiShiftPacketShifts } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { ShiftMemberExchangeService } from '../shift-member-exchange.service';
import { ErrorArray } from '../shift-member-exchange.service';

@Component({
	selector: 'p-assign-me-button[shift]',
	templateUrl: './p-assign-me-button.component.html',
	styleUrls: ['./p-assign-me-button.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PAssignMeButtonComponent {
	@Input() public shift ! : SchedulingApiShift;
	public states : typeof SchedulingApiAssignmentProcessState = SchedulingApiAssignmentProcessState;

	constructor(
		private modalService : ModalService,
		private me : MeService,
		public rightsService : RightsService,
		private shiftMemberExchangeService : ShiftMemberExchangeService,
		private earlyBirdService : EarlyBirdService,
		private schedulingService : SchedulingService,
	) {
	}

	/**
	 * Assign logged in user and save after user confirmed
	 */
	public assignMe(
		event : Event,
		modalContent : TemplateRef<unknown>,
	) : void {
		event.stopPropagation();
		this.modalService.openModal(modalContent, {
			success: () => {
				this.shift.earlyBirdAssignToMe = true;
				this.shift.saveDetailed({
					success: () => {
						if (Config.IS_MOBILE && !this.earlyBirdService.freeEarlyBirdSeatsCount) {
							this.schedulingService.earlyBirdMode = false;
						}
					},
				});
			},
		});
	}

	/** @see ShiftMemberExchangeService['errors'] */
	public get errors() : ErrorArray {
		return this.shiftMemberExchangeService.errors(this.me.data.id, this.shift);
	}

	/**
	 * @returns Returns other shifts from the packet which will also be assigned to user.
	 * "null" is returned if no such shifts exist.
	 */
	public get otherPacketShifts() : SchedulingApiShiftPacketShifts | null {
		if (this.shift.packetShifts.length <= 1) return null;

		const result = new SchedulingApiShiftPacketShifts(null, false);
		const process = this.shift.assignmentProcess;
		if (process === null) return null;

		for (const packetShift of this.shift.packetShifts.iterable()) {
			if (packetShift.id.equals(this.shift.id)) continue;
			if (!process.shiftRefs.contains(packetShift.id)) continue;
			result.push(packetShift);
		}

		return result.length ? result : null;
	}
}
