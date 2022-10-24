var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { AbsenceService } from '@plano/client/shared/absence.service';
import { SchedulingApiService, SchedulingApiShift, SchedulingApiAbsenceType } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PMomentService } from '../../p-moment.service';
let AssignedMembersComponent = class AssignedMembersComponent {
    constructor(modalService, api, absenceService, rightsService, pMoment) {
        this.modalService = modalService;
        this.api = api;
        this.absenceService = absenceService;
        this.rightsService = rightsService;
        this.pMoment = pMoment;
        this.readMode = false;
        this.size = null;
    }
    ngOnInit() {
        this.now = +this.pMoment.m();
    }
    /**
     * Should the button that navigates to the Shift-Exchange form be visible?
     */
    showExchangeBtn(assignedMember) {
        if (this.readMode)
            return false;
        if (this.shiftIsInThePast)
            return false;
        if (this.getShiftExchangeForMember(assignedMember.id))
            return true;
        if (this.isMe(assignedMember))
            return true;
        if (this.userCanCreateIllness)
            return true;
        return false;
    }
    get userCanCreateIllness() {
        return this.rightsService.hasManagerRightsForShiftModel(this.shift.shiftModelId);
    }
    get shiftIsInThePast() {
        return this.shift.end < this.now;
    }
    /**
     * Is the given member the logged in user?
     */
    isMe(member) {
        return this.rightsService.isMe(member);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showDeleteButton() {
        if (this.readMode)
            return false;
        return this.rightsService.userCanWrite(this.shift);
    }
    /**
     * Get the related shiftExchange if one is available
     */
    getShiftExchangeForMember(memberId) {
        var _a;
        if (!this.api.isLoaded())
            return null;
        return (_a = this.api.data.shiftExchanges.getByShiftAndMember(this.shift.id, memberId)) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Open some "Are you sure" modal
     */
    openDeleteModal(event, assignedMember, modalContent) {
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
    absenceTypeIconName(memberId) {
        return this.absenceService.absenceTypeIconName(memberId, this.shift);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get assignedMembersForList() {
        return this.shift.assignedMembers.iterableSortedBy([
            item => item.lastName,
            item => item.firstName,
            item => !item.trashed,
            item => this.isMe(item),
        ]);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    absenceType(memberId) {
        var _a;
        if ((_a = this.shift.assignedMembers.get(memberId)) === null || _a === void 0 ? void 0 : _a.trashed)
            return 'trashed';
        const type = this.absenceService.absenceType(memberId, this.shift);
        return type === SchedulingApiAbsenceType.OTHER ? null : type !== null && type !== void 0 ? type : null;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], AssignedMembersComponent.prototype, "readMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_c = typeof SchedulingApiShift !== "undefined" && SchedulingApiShift) === "function" ? _c : Object)
], AssignedMembersComponent.prototype, "shift", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AssignedMembersComponent.prototype, "size", void 0);
AssignedMembersComponent = __decorate([
    Component({
        selector: 'p-assigned-members[shift]',
        templateUrl: './assigned-members.component.html',
        styleUrls: ['./assigned-members.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [ModalService, typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, AbsenceService, typeof (_b = typeof RightsService !== "undefined" && RightsService) === "function" ? _b : Object, PMomentService])
], AssignedMembersComponent);
export { AssignedMembersComponent };
//# sourceMappingURL=assigned-members.component.js.map