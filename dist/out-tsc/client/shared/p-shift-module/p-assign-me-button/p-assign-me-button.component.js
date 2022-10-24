var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
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
let PAssignMeButtonComponent = class PAssignMeButtonComponent {
    constructor(modalService, me, rightsService, shiftMemberExchangeService, earlyBirdService, schedulingService) {
        this.modalService = modalService;
        this.me = me;
        this.rightsService = rightsService;
        this.shiftMemberExchangeService = shiftMemberExchangeService;
        this.earlyBirdService = earlyBirdService;
        this.schedulingService = schedulingService;
        this.states = SchedulingApiAssignmentProcessState;
    }
    /**
     * Assign logged in user and save after user confirmed
     */
    assignMe(event, modalContent) {
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
    get errors() {
        return this.shiftMemberExchangeService.errors(this.me.data.id, this.shift);
    }
    /**
     * @returns Returns other shifts from the packet which will also be assigned to user.
     * "null" is returned if no such shifts exist.
     */
    get otherPacketShifts() {
        if (this.shift.packetShifts.length <= 1)
            return null;
        const result = new SchedulingApiShiftPacketShifts(null, false);
        const process = this.shift.assignmentProcess;
        if (process === null)
            return null;
        for (const packetShift of this.shift.packetShifts.iterable()) {
            if (packetShift.id.equals(this.shift.id))
                continue;
            if (!process.shiftRefs.contains(packetShift.id))
                continue;
            result.push(packetShift);
        }
        return result.length ? result : null;
    }
};
__decorate([
    Input(),
    __metadata("design:type", typeof (_d = typeof SchedulingApiShift !== "undefined" && SchedulingApiShift) === "function" ? _d : Object)
], PAssignMeButtonComponent.prototype, "shift", void 0);
PAssignMeButtonComponent = __decorate([
    Component({
        selector: 'p-assign-me-button[shift]',
        templateUrl: './p-assign-me-button.component.html',
        styleUrls: ['./p-assign-me-button.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [ModalService,
        MeService, typeof (_a = typeof RightsService !== "undefined" && RightsService) === "function" ? _a : Object, ShiftMemberExchangeService, typeof (_b = typeof EarlyBirdService !== "undefined" && EarlyBirdService) === "function" ? _b : Object, typeof (_c = typeof SchedulingService !== "undefined" && SchedulingService) === "function" ? _c : Object])
], PAssignMeButtonComponent);
export { PAssignMeButtonComponent };
//# sourceMappingURL=p-assign-me-button.component.js.map