var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiMembers } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { ShiftMemberExchangeService } from '../shift-member-exchange.service';
let QuickAssignmentComponent = class QuickAssignmentComponent {
    constructor(modalService, api, me, shiftMemberExchangeService, rightsService) {
        this.modalService = modalService;
        this.api = api;
        this.me = me;
        this.shiftMemberExchangeService = shiftMemberExchangeService;
        this.rightsService = rightsService;
        this.readMode = false;
        this._alwaysTrue = true;
        this.size = null;
        this.CONFIG = Config;
        this.selectedMember = null;
    }
    /**
     * Get an array of errors
     */
    get errors() {
        assumeDefinedToGetStrictNullChecksRunning(this.selectedMember, 'this.selectedMember', 'Don’t try to get errors, when selected member is not available');
        return this.shiftMemberExchangeService.errors(this.selectedMember, this.shift);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    openQuickAssignModal(event, modalContent) {
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
    get membersForList() {
        const result = new SchedulingApiMembers(this.api, true);
        for (const member of this.api.data.members.iterable()) {
            if (!this.shift.assignedMemberIds.contains(member.id) &&
                this.shift.assignableMembers.contains(member.id)) {
                result.push(member);
            }
        }
        return result;
    }
    /**
     * Assign member to this shift and save it to the database
     */
    assignSelectedMember() {
        assumeDefinedToGetStrictNullChecksRunning(this.selectedMember, 'selectedMember');
        this.shift.assignedMemberIds.push(this.selectedMember.id);
        this.shift.saveDetailed();
    }
    /**
     * Clear the temporary data to make the component reusable
     */
    clear() {
        this.selectedMember = null;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showInfoAboutBlockedAssignments() {
        return (!!this.rightsService.userCanWrite(this.shift.model) &&
            // HACK: Next line is a hack for PLANO-4625
            !this.shift.assignedMemberIds.rawData);
    }
    get assignmentIsDisabled() {
        if (this.rightsService.userCanEditAssignments(this.shift))
            return false;
        return true;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isEnabled() {
        if (this.readMode)
            return false;
        if (this.assignmentIsDisabled)
            return false;
        return true;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], QuickAssignmentComponent.prototype, "readMode", void 0);
__decorate([
    HostBinding('class.d-flex'),
    HostBinding('class.align-items-stretch'),
    __metadata("design:type", Object)
], QuickAssignmentComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_c = typeof SchedulingApiShift !== "undefined" && SchedulingApiShift) === "function" ? _c : Object)
], QuickAssignmentComponent.prototype, "shift", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], QuickAssignmentComponent.prototype, "size", void 0);
QuickAssignmentComponent = __decorate([
    Component({
        selector: 'p-quick-assignment[shift]',
        templateUrl: './quick-assignment.component.html',
        styleUrls: ['./quick-assignment.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [ModalService, typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, MeService,
        ShiftMemberExchangeService, typeof (_b = typeof RightsService !== "undefined" && RightsService) === "function" ? _b : Object])
], QuickAssignmentComponent);
export { QuickAssignmentComponent };
//# sourceMappingURL=quick-assignment.component.js.map