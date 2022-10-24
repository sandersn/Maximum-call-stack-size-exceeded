var _a, _b, _c, _d, _e;
import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { NgbFormatsService } from '@plano/client/service/ngbformats.service';
import { ToastsService } from '@plano/client/service/toasts.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { PShiftExchangeService } from '@plano/client/shared/p-shift-exchange/shift-exchange.service';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiAssignmentProcess, SchedulingApiMembers } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState, SchedulingApiAssignmentProcessType, SchedulingApiAssignmentProcessAssignmentState } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PPushNotificationsService, PRequestWebPushNotificationPermissionContext } from '@plano/shared/core/p-push-notifications.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PSupportedTimeZoneOffset } from '@plano/shared/core/time-zones.enums';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../shared/core/null-type-utils';
import { AssignmentProcessesService } from '../assignment-processes.service';
let PAssignmentProcessComponent = class PAssignmentProcessComponent {
    constructor(api, ngbFormats, modalService, toasts, rightsService, console, pShiftExchangeService, pPushNotificationsService, localize, pMoment, pDatePipe, assignmentProcessesService) {
        this.api = api;
        this.ngbFormats = ngbFormats;
        this.modalService = modalService;
        this.toasts = toasts;
        this.rightsService = rightsService;
        this.console = console;
        this.pShiftExchangeService = pShiftExchangeService;
        this.pPushNotificationsService = pPushNotificationsService;
        this.localize = localize;
        this.pMoment = pMoment;
        this.pDatePipe = pDatePipe;
        this.assignmentProcessesService = assignmentProcessesService;
        this._alwaysTrue = true;
        this.selectProcess = new EventEmitter();
        this.onClickProcess = new EventEmitter();
        this.wholePackages = false;
        /**
         * All states in a var to use them in the template
         */
        this.states = SchedulingApiAssignmentProcessState;
        /**
         * All types in a var to use them in the template
         */
        this.types = SchedulingApiAssignmentProcessType;
        this.deadlineObject = '-';
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.PThemeEnum = PThemeEnum;
        this.membersThatNeedToSetWishes = [];
        this.now = +this.pMoment.m();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isCollapsible() {
        if (Config.IS_MOBILE)
            return false;
        return this.userCanEditAssignmentProcess;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get userCanEditAssignmentProcess() {
        return !!this.rightsService.userCanEditAssignmentProcess(this.process);
    }
    ngOnInit() {
        this.refreshMembersThatNeedToSetWishes();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get assignmentStateIsAllAssigned() {
        return this.process.assignmentState === SchedulingApiAssignmentProcessAssignmentState.ALL_ASSIGNED;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get assignmentStateIsNoneAssigned() {
        return this.process.assignmentState === SchedulingApiAssignmentProcessAssignmentState.NONE_ASSIGNED;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get assignmentStateIsPartiallyAssigned() {
        return this.process.assignmentState === SchedulingApiAssignmentProcessAssignmentState.PARTIALLY_ASSIGNED;
    }
    setInitialDeadlineObject() {
        const nextWeek = this.pMoment.m().add(1, 'week').valueOf();
        this.deadlineObject = this.ngbFormats.timestampToDateStruct(nextWeek);
    }
    /**
     * Only some processes have a state where members need to set their wishes.
     */
    get processHasWishesMode() {
        if (this.process.type === SchedulingApiAssignmentProcessType.DR_PLANO)
            return true;
        if (this.process.type === SchedulingApiAssignmentProcessType.MANUAL)
            return true;
        return false;
    }
    /**
     * Set new deadline
     */
    setProcessDeadline() {
        this.process.deadline = +this.pMoment.m(this.deadlineTimestamp).endOf('day');
    }
    /**
     * Edit deadline
     */
    onEditDeadline(modalContent) {
        this.deadlineObject = this.ngbFormats.timestampToDateStruct(this.process.deadline);
        if (this.processHasWishesMode && this.assignmentStateIsAllAssigned) {
            this.process.onlyAskPrefsForUnassignedShifts = false;
        }
        this.modalService.openModal(modalContent, {
            success: () => {
                this.setProcessDeadline();
                this.api.save();
            },
        });
    }
    askForNotificationPermissionIfNecessary(v) {
        switch (v) {
            case SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES:
                this.pPushNotificationsService.requestWebPushNotificationPermission(PRequestWebPushNotificationPermissionContext.MANAGER_STARTED_ASKING_MEMBER_PREFERENCES);
                break;
            case SchedulingApiAssignmentProcessState.EARLY_BIRD_SCHEDULING:
                this.pPushNotificationsService.requestWebPushNotificationPermission(PRequestWebPushNotificationPermissionContext.MANAGER_STARTED_EARLY_BIRD_SCHEDULING);
                break;
            default:
        }
    }
    /**
     * Start the phase where members should act
     */
    onStartProcess(modalContent) {
        this.setInitialDeadlineObject();
        if (this.processHasWishesMode) {
            if (this.assignmentStateIsAllAssigned) {
                this.process.onlyAskPrefsForUnassignedShifts = false;
            }
            else {
                this.process.onlyAskPrefsForUnassignedShifts = true;
            }
        }
        this.modalService.openModal(modalContent, {
            success: () => {
                this.setProcessDeadline();
                if (this.process.type === SchedulingApiAssignmentProcessType.DR_PLANO) {
                    this.process.state = SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES;
                }
                if (this.process.type === SchedulingApiAssignmentProcessType.EARLY_BIRD) {
                    this.process.state = SchedulingApiAssignmentProcessState.EARLY_BIRD_SCHEDULING;
                }
                if (this.process.type === SchedulingApiAssignmentProcessType.MANUAL) {
                    this.process.state = SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES;
                }
                this.askForNotificationPermissionIfNecessary(this.process.state);
                this.api.save();
            },
        });
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get deadlineTimestamp() {
        if (this.deadlineObject === '-')
            return null;
        return this.ngbFormats.dateTimeObjectToTimestamp(this.deadlineObject);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get daysTillDeadline() {
        const duration = +this.pMoment.m(this.deadlineTimestamp).endOf('day') - +this.pMoment.m(this.now).endOf('day');
        return Math.floor(this.pMoment.duration(duration).as('days'));
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get daysTillDeadlineText() {
        if (this.daysTillDeadline === 0)
            return this.localize.transform('bis heute Abend');
        let result = '';
        result += `${this.daysTillDeadline.toString()} `;
        if (this.daysTillDeadline > 1 ||
            this.daysTillDeadline < -1) {
            result += this.localize.transform('Tage');
        }
        else {
            result += this.localize.transform('Tag');
        }
        return result;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get addableSelectedShiftsAmount() {
        let result = 0;
        for (const selectedShift of this.api.data.shifts.selectedItems.iterable()) {
            if (!this.process.shiftRefs.contains(selectedShift.id)) {
                result++;
            }
        }
        return result;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get removableSelectedShiftsAmount() {
        let result = 0;
        for (const selectedShift of this.api.data.shifts.selectedItems.iterable()) {
            if (this.process.shiftRefs.contains(selectedShift.id)) {
                result++;
            }
        }
        return result;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get someSelectedShiftsAreAddable() {
        return !!this.addableSelectedShiftsAmount;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get someSelectedShiftsAreRemovable() {
        return !!this.removableSelectedShiftsAmount;
    }
    /**
     * Check if some selected items are part of a package in order to decide if prompt in necessary
     */
    addPackagePromptIsNecessary(shifts) {
        for (const shiftForLoop of shifts.iterable()) {
            for (const packetShift of shiftForLoop.packetShifts.iterable()) {
                if (
                // If the shift is already in the process everything is fine
                !this.process.shiftRefs.contains(packetShift.id)) {
                    const shift = this.api.data.shifts.get(packetShift.id);
                    if (
                    // if the shift is not in the current view, prompt is necessary
                    !shift ||
                        // if the shift is in the view but not selected prompt is necessary
                        !shift.selected)
                        return true;
                }
            }
        }
        return false;
    }
    /**
     * Check if some selected items are part of a package in order to decide if prompt in necessary
     */
    get removePackagePromptIsNecessary() {
        for (const selectedShift of this.api.data.shifts.selectedItems.iterable()) {
            for (const packetShift of selectedShift.packetShifts.iterable()) {
                if (
                // If the shift is in the process we probably need a prompt
                this.process.shiftRefs.contains(packetShift.id)) {
                    const shift = this.api.data.shifts.get(packetShift.id);
                    if (
                    // if the shift is not in the current view, prompt is necessary
                    !shift ||
                        // if the shift is in the view but not selected prompt is necessary
                        !shift.selected)
                        return true;
                }
            }
        }
        return false;
    }
    /**
     * Check if some selected items are already part of another process
     */
    someShiftsArePartOfAProcess(shifts) {
        return this.api.data.assignmentProcesses.filterBy(item => !item.id.equals(this.process.id)).containsAnyShift(shifts);
    }
    addSelectedShiftsRequestIsNeeded(shifts) {
        if (this.someSlotsAreEmptyButProcessHasEnded(shifts))
            return true;
        if (this.someShiftsArePartOfAProcess(shifts))
            return true;
        if (this.addPackagePromptIsNecessary(shifts))
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    someSlotsAreEmptyButProcessHasEnded(shifts) {
        if (this.process.state !== SchedulingApiAssignmentProcessState.NEEDING_APPROVAL)
            return false;
        if (!shifts.findBy(item => !!item.emptyMemberSlots))
            return false;
        return true;
    }
    /**
     * Ask User if shiftPaket items should be removed from this process
     */
    removeSelectedShiftsRequest(modalContent) {
        if (this.removePackagePromptIsNecessary) {
            return this.modalService.getEditableHook(modalContent, {
                success: () => {
                    this.removeAllRelatedPacketItems();
                },
            });
        }
        return null;
    }
    /**
     * Remove selected shifts from all other processes
     */
    removeSelectedShiftsFromAllOtherProcesses(shifts) {
        for (const selectedShift of shifts.iterable()) {
            for (const assignmentProcess of this.api.data.assignmentProcesses.iterable()) {
                if (!assignmentProcess.id.equals(this.process.id) &&
                    assignmentProcess.shiftRefs.contains(selectedShift.id)) {
                    assignmentProcess.shiftRefs.removeItem(selectedShift.id);
                }
            }
        }
    }
    /**
     * Add shift id to this process
     */
    addId(id, success) {
        if (this.process.shiftRefs.contains(id))
            return;
        const relatedProcess = this.api.data.assignmentProcesses.getByShiftId(id);
        if (relatedProcess) {
            relatedProcess.shiftRefs.removeItem(id);
        }
        this.process.shiftRefs.createNewItem(id);
        if (success) {
            success();
        }
    }
    /**
     * Add all related shiftPaket items to this process
     * @returns At least one Shift has been added
     */
    addAllRelatedPacketItems() {
        let result = false;
        for (const selectedShift of this.api.data.shifts.selectedItems.iterable()) {
            if (!this.wholePackages)
                continue;
            for (const packetShift of selectedShift.packetShifts.iterable()) {
                this.addId(packetShift.id, () => {
                    result = true;
                });
            }
        }
        return result;
    }
    addShifts(noShiftsHint, addShiftsRequestModalContent, shifts) {
        const success = (showNoShiftsHintIfNecessary = true, _shiftsHaveBeenAdded = false) => {
            let shiftsHaveBeenAdded = _shiftsHaveBeenAdded;
            for (const selectedShift of shifts.selectedItems.iterable()) {
                this.addId(selectedShift.id, () => {
                    shiftsHaveBeenAdded = true;
                });
            }
            if (!shiftsHaveBeenAdded) {
                if (showNoShiftsHintIfNecessary) {
                    this.modalService.openModal(noShiftsHint);
                }
            }
            else {
                this.api.save();
                this.refreshMembersThatNeedToSetWishes();
            }
        };
        if (!this.addSelectedShiftsRequestIsNeeded(shifts)) {
            success();
            return;
        }
        this.modalService.openModal(addShiftsRequestModalContent, {
            success: () => {
                const shiftsHaveBeenAdded = this.addAllRelatedPacketItems();
                this.removeSelectedShiftsFromAllOtherProcesses(shifts);
                success(false, shiftsHaveBeenAdded);
            },
        });
    }
    addSelectedShifts(noShiftsHint, addShiftsRequestModalContent, shiftsThatShouldBeSkipped) {
        this.addShifts(noShiftsHint, addShiftsRequestModalContent, this.api.data.shifts.filterBy(item => {
            if (!item.selected)
                return false;
            if (shiftsThatShouldBeSkipped === null || shiftsThatShouldBeSkipped === void 0 ? void 0 : shiftsThatShouldBeSkipped.contains(item))
                return false;
            return true;
        }));
    }
    /**
     * Add selectedShifts to this process
     */
    onAddSelectedShifts(noShiftsHint, addShiftsRequestModalContent) {
        this.pShiftExchangeService.blockedByShiftExchangeWarningModal(this.process, shiftsThatShouldBeSkipped => {
            this.addSelectedShifts(noShiftsHint, addShiftsRequestModalContent, shiftsThatShouldBeSkipped);
        });
    }
    /**
     * Remove shift id from this process
     */
    removeId(id, success) {
        if (!this.process.shiftRefs.contains(id))
            return;
        this.process.shiftRefs.removeItem(id);
        if (success)
            success();
    }
    /**
     * Remove all related shiftPaket items from this process
     */
    removeAllRelatedPacketItems() {
        for (const selectedShift of this.api.data.shifts.selectedItems.iterable()) {
            if (!this.wholePackages)
                return;
            for (const packetShift of selectedShift.packetShifts.iterable()) {
                this.removeId(packetShift.id);
            }
        }
    }
    /**
     * Remove selected shifts from this process
     */
    removeSelectedShifts(modalContentNoShiftsHint) {
        let nothingToDo = true;
        for (const selectedShift of this.api.data.shifts.selectedItems.iterable()) {
            this.removeId(selectedShift.id);
            nothingToDo = false;
        }
        if (nothingToDo) {
            this.modalService.openModal(modalContentNoShiftsHint);
        }
        else {
            this.refreshMembersThatNeedToSetWishes();
        }
    }
    /**
     * Remove this process.
     */
    removeProcess() {
        const processName = this.process.name;
        this.api.data.assignmentProcesses.removeItem(this.process);
        this.api.save({
            success: () => {
                this.console.log('processName', processName);
                this.console.log('this.process', this.process);
                this.toasts.addToast({
                    content: this.localize.transform('Der Vorgang »${name}« wurde gelöscht.', {
                        name: processName,
                    }),
                    theme: PThemeEnum.INFO,
                });
            },
        });
    }
    /**
     * User confirms that this early-bird process should be closed.
     */
    confirmEarlyBirdProcess() {
        const processName = this.process.name;
        this.api.data.assignmentProcesses.removeItem(this.process);
        this.api.save({
            success: () => {
                this.toasts.addToast({
                    content: this.localize.transform('Der Vorgang »${name}« wurde abgeschlossen.', {
                        name: processName,
                    }),
                    theme: PThemeEnum.SUCCESS,
                });
            },
        });
    }
    /**
     * User approves that the content of this process is what he/she wants
     */
    confirmProcess() {
        if (this.process.type === SchedulingApiAssignmentProcessType.EARLY_BIRD) {
            this.confirmEarlyBirdProcess();
        }
        else if (this.process.type === SchedulingApiAssignmentProcessType.MANUAL) {
            this.process.state = SchedulingApiAssignmentProcessState.APPROVE;
        }
        else {
            this.process.state = SchedulingApiAssignmentProcessState.APPROVE;
        }
    }
    refreshMembersThatNeedToSetWishes() {
        this.membersThatNeedToSetWishes = [];
        for (const shiftIdObj of this.process.shiftRefs.iterable()) {
            const shift = this.api.data.shifts.get(shiftIdObj.id);
            if (!shift)
                continue;
            for (const assignableMember of shift.assignableMembers.iterable()) {
                const member = this.api.data.members.get(assignableMember.memberId);
                if (!member)
                    throw new Error('Could not find by member');
                if (!this.membersThatNeedToSetWishes.includes(member)) {
                    this.membersThatNeedToSetWishes.push(member);
                }
            }
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get missingPrefsMemberIdsLength() {
        // FIXME: PLANO-1638
        if (this.process.missingPrefsMemberIds.rawData !== undefined &&
            this.process.missingPrefsMemberIds.length > 0) {
            return this.process.missingPrefsMemberIds.length;
        }
        return 0;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get namesOfMembersThatMissedToSetWishes() {
        let result = '';
        let index = 0;
        const members = new SchedulingApiMembers(null, false);
        for (const memberId of this.process.missingPrefsMemberIds.iterable()) {
            const member = this.api.data.members.get(memberId);
            if (member)
                members.push(member);
        }
        for (const member of members.sortedBy(item => item.firstName, false).iterable()) {
            result += `${member.firstName} ${member.lastName.charAt(0)}.`;
            index++;
            if (index < this.process.missingPrefsMemberIds.length) {
                result += ', ';
            }
        }
        return result;
    }
    /**
     * Decide if user should be warned that all existing assignments will be re-assigned
     */
    get showReAssignmentWarning() {
        switch (this.process.type) {
            case SchedulingApiAssignmentProcessType.EARLY_BIRD:
            case SchedulingApiAssignmentProcessType.MANUAL:
                return false;
            case SchedulingApiAssignmentProcessType.DR_PLANO:
                return this.assignmentStateIsAllAssigned;
        }
    }
    /**
     * Decide if user should be warned that all existing assignments will get lost
     */
    get showAllAssignmentsGetLostWarning() {
        return (!this.process.onlyAskPrefsForUnassignedShifts && this.process.type !== SchedulingApiAssignmentProcessType.MANUAL);
    }
    /**
     * If wishes for all shifts are requested the assignments of the shifts still remain untouched.
     */
    get showAssignmentsRemainUntouchedHint() {
        if (this.process.type === SchedulingApiAssignmentProcessType.DR_PLANO)
            return false;
        if (!this.assignmentStateIsPartiallyAssigned)
            return false;
        if (this.process.onlyAskPrefsForUnassignedShifts)
            return false;
        return true;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showYouHaveNoRightToDoThisAlert() {
        for (const shift of this.api.data.shifts.selectedItems.iterable()) {
            if (!this.rightsService.canGetManagerNotifications(shift))
                return true;
            if (!this.rightsService.userCanWrite(shift))
                return true;
        }
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get allOrNoneAssigned() {
        if (this.process.state === SchedulingApiAssignmentProcessState.NEEDING_APPROVAL &&
            (this.assignmentStateIsNoneAssigned || this.assignmentStateIsAllAssigned)) {
            return true;
        }
        if (this.process.state === SchedulingApiAssignmentProcessState.NOT_STARTED && (this.assignmentStateIsAllAssigned)) {
            return true;
        }
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showErneutAnfordernBtn() {
        return (this.process.state === SchedulingApiAssignmentProcessState.EARLY_BIRD_FINISHED ||
            this.process.state === SchedulingApiAssignmentProcessState.NEEDING_APPROVAL ||
            this.process.state === SchedulingApiAssignmentProcessState.MANUAL_SCHEDULING);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get selectShiftRefsBtnLabel() {
        if (this.process.shiftRefs.length === 0)
            return this.localize.transform('0 Schichten drin');
        if (this.process.shiftRefs.length === 1)
            return this.localize.transform('1 Schicht drin');
        return this.localize.transform('${amount} Schichten drin', {
            amount: this.process.shiftRefs.length.toString(),
        });
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get addAndRemovePopover() {
        if (!this.showYouHaveNoRightToDoThisAlert)
            return undefined;
        return this.localize.transform('Deine Auswahl beinhaltet Schichten, für die du nicht als bereichsleitende Person eingetragen bist.');
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get lastMinuteOfDayInTimeFormat() {
        return this.pDatePipe.transform(86340000, 'shortTime', PSupportedTimeZoneOffset.NO_ZONE); // 23:59 Uhr
    }
    /**
     * Get a title of the related process
     */
    processTitleForState(process) {
        const state = process.state !== SchedulingApiAssignmentProcessState.NEEDING_APPROVAL ? process.state : SchedulingApiAssignmentProcessState.APPROVE;
        const userCanEditAssignmentProcess = !!this.rightsService.userCanEditAssignmentProcess(process);
        const result = this.assignmentProcessesService.getDescription(state, userCanEditAssignmentProcess);
        assumeDefinedToGetStrictNullChecksRunning(result, 'result');
        return result;
    }
    /**
     * Should the radios buttons for process.onlyAskPrefsForUnassignedShifts be visible?
     */
    get showOnlyAskPrefsForUnassignedShiftsFormElement() {
        switch (this.process.type) {
            case SchedulingApiAssignmentProcessType.MANUAL:
            case SchedulingApiAssignmentProcessType.EARLY_BIRD:
                return false;
            case SchedulingApiAssignmentProcessType.DR_PLANO:
                if (this.process.state === SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES)
                    return false;
                return this.processHasWishesMode && this.assignmentStateIsPartiallyAssigned;
        }
    }
};
__decorate([
    HostBinding('class.d-block'),
    __metadata("design:type", Object)
], PAssignmentProcessComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], PAssignmentProcessComponent.prototype, "selectProcess", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_d = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _d : Object)
], PAssignmentProcessComponent.prototype, "onClickProcess", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_e = typeof SchedulingApiAssignmentProcess !== "undefined" && SchedulingApiAssignmentProcess) === "function" ? _e : Object)
], PAssignmentProcessComponent.prototype, "process", void 0);
PAssignmentProcessComponent = __decorate([
    Component({
        selector: 'p-assignment-process[process]',
        templateUrl: './p-assignment-process.component.html',
        styleUrls: ['./p-assignment-process.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, NgbFormatsService,
        ModalService,
        ToastsService, typeof (_b = typeof RightsService !== "undefined" && RightsService) === "function" ? _b : Object, LogService,
        PShiftExchangeService,
        PPushNotificationsService,
        LocalizePipe,
        PMomentService,
        PDatePipe,
        AssignmentProcessesService])
], PAssignmentProcessComponent);
export { PAssignmentProcessComponent };
//# sourceMappingURL=p-assignment-process.component.js.map