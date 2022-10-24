var _a, _b, _c, _d, _e, _f;
import { __decorate, __metadata } from "tslib";
import * as $ from 'jquery';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgbFormatsService } from '@plano/client/service/ngbformats.service';
import { AbsenceService } from '@plano/client/shared/absence.service';
import { ShiftModalSizes } from '@plano/client/shift/shift-modal-sizes';
import { SchedulingApiShiftModel } from '@plano/shared/api';
import { SchedulingApiMembers } from '@plano/shared/api';
import { SchedulingApiShift } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../shared/core/null-type-utils';
let AssignMembersComponent = class AssignMembersComponent {
    constructor(ngbFormats, modalService, absenceService, rightsService, console) {
        this.ngbFormats = ngbFormats;
        this.modalService = modalService;
        this.absenceService = absenceService;
        this.rightsService = rightsService;
        this.console = console;
        this.CONFIG = Config;
        this.api = null;
        this.shift = null;
        this.formItemCopy = null;
        this.showHearts = false;
        this._disabled = null;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.tempAssignedMembers = null;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get boxDisabled() {
        if (Config.IS_MOBILE)
            return true;
        if (this._disabled !== null)
            return this._disabled;
        return !!this.shift && this.assignmentIsDisabled;
    }
    /**
     * Icon of the members absence
     */
    absenceTypeIconName(memberId) {
        return this.absenceService.absenceTypeIconName(memberId, {
            start: this.shift ? this.shift.start : this.shiftModel.time.start,
            end: this.shift ? this.shift.end : this.shiftModel.time.end,
            id: this.shift ? this.shift.id : null,
        });
    }
    ngAfterContentInit() {
        this.copyList();
        this.updateFormItemCopy();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    assignMembersHook(modalContent) {
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
    copyList() {
        // FIXME: PLANO-5166
        this.tempAssignedMembers = new SchedulingApiMembers(null, false);
        for (const item of this.formItem.assignedMembers.iterableSortedBy(['lastName', 'firstName', 'trashed'])) {
            this.tempAssignedMembers.push(item);
        }
    }
    /**
     * determine if the "send mail to members" checkbox should be visible or not
     */
    get showSendMailCheckbox() {
        // Never inform a member if ShiftModels gets edited [PLANO-15402]
        if (this.formItem instanceof SchedulingApiShiftModel)
            return false;
        // Changing assignedMembers ➡ Show Checkbox
        if (!this.formItem.assignedMembers.equals(this.tempAssignedMembers))
            return true;
        if (this.changingAssignableMembers)
            return true;
        return false;
    }
    get changingAssignableMembers() {
        // Changing "assignableMembers" and applying to other shifts?
        if (!this.api.data.shiftChangeSelector.isChangingShifts)
            return false;
        // Changing "assignableMembers" but invalid data
        if (!this.api.data.shiftChangeSelector.start)
            return false;
        // Changing "assignableMembers" but invalid data
        if (!this.api.data.shiftChangeSelector.end)
            return false;
        // Changing "assignableMembers"
        return true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get formItem() {
        if (this.shift)
            return this.shift;
        return this.shiftModel;
    }
    /**
     * Copy raw data and paste it to the formItemCopy.
     * Prevents some issues that happen when the references get lost.
     * @deprecated
     * TODO: This smells like crap. It probably needs to get removed, but remember to check if »references get lost«
     */
    updateFormItemCopy() {
        assumeDefinedToGetStrictNullChecksRunning(this.formItem, 'formItem');
        this.formItemCopy = null;
        if (this.formItem instanceof SchedulingApiShift) {
            this.formItemCopy = new SchedulingApiShift(this.api);
        }
        else {
            this.formItemCopy = new SchedulingApiShiftModel(this.api);
        }
        const rawDataCopy = $.extend(true, [], this.formItem.rawData);
        this.formItemCopy._updateRawData(rawDataCopy, false);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get assignableMembersForList() {
        const result = new SchedulingApiMembers(this.api, false);
        for (const assignableMember of this.formItemCopy.assignableMembers.iterable()) {
            const member = this.api.data.members.get(assignableMember.memberId);
            if (!member)
                throw new Error('Could not find assignable member');
            result.push(member);
        }
        return result.iterableSortedBy([
            item => item.lastName,
            item => item.firstName,
            item => !item.trashed,
        ]);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get assignedMembersForList() {
        const result = new SchedulingApiMembers(this.api, false);
        for (const assignedMembers of this.formItemCopy.assignedMembers.iterable()) {
            const member = this.api.data.members.get(assignedMembers.id);
            if (!member)
                throw new Error('Could not find assignable member');
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
    get hasAssignedMembersForList() {
        return !!this.formItemCopy.assignedMemberIds.length;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get hasAssignableMembersForList() {
        if (!this.formItemCopy.assignableMembers.hasUntrashedItem)
            return false;
        if (this.formItemCopy.assignableMembers.unTrashedItemsAmount <= this.formItemCopy.assignedMemberIds.length) {
            return false;
        }
        return true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    earningsForMember(member) {
        const ASSIGNABLE_MEMBER = this.formItem.assignableMembers.getByMember(member);
        if (ASSIGNABLE_MEMBER === null)
            return 0;
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
    toggleAssignableMember(member) {
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
    get assignmentIsDisabled() {
        if (!this.shift)
            this.console.warn('No Shift? How is this possible?');
        if (this.shift && this.rightsService.userCanEditAssignments(this.shift))
            return false;
        return true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    toggleAssignedMember(member) {
        if (this.formItem.assignedMemberIds.contains(member.id)) {
            this.formItem.assignedMemberIds.removeItem(member.id);
            return;
        }
        this.formItem.assignableMembers.addNewMember(member);
        this.formItem.assignedMemberIds.push(member.id);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    isMe(member) {
        const result = this.rightsService.isMe(member.id);
        assumeDefinedToGetStrictNullChecksRunning(result, 'result');
        return result;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isOwner() {
        const result = this.rightsService.isOwner;
        assumeDefinedToGetStrictNullChecksRunning(result, 'result');
        return result;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showListOfUnassignableMembers() {
        if (!this.isOwner)
            return false;
        return this.api.data.members.length > this.formItemCopy.assignableMembers.length;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], AssignMembersComponent.prototype, "api", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_c = typeof SchedulingApiShiftModel !== "undefined" && SchedulingApiShiftModel) === "function" ? _c : Object)
], AssignMembersComponent.prototype, "shiftModel", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AssignMembersComponent.prototype, "shift", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AssignMembersComponent.prototype, "formItemCopy", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AssignMembersComponent.prototype, "saveChangesHook", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], AssignMembersComponent.prototype, "showHearts", void 0);
__decorate([
    Input('disabled'),
    __metadata("design:type", Object)
], AssignMembersComponent.prototype, "_disabled", void 0);
AssignMembersComponent = __decorate([
    Component({
        selector: 'p-assign-members[shiftModel]',
        templateUrl: './assign-members.component.html',
        styleUrls: ['./assign-members.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [NgbFormatsService,
        ModalService,
        AbsenceService, typeof (_a = typeof RightsService !== "undefined" && RightsService) === "function" ? _a : Object, LogService])
], AssignMembersComponent);
export { AssignMembersComponent };
//# sourceMappingURL=assign-members.component.js.map