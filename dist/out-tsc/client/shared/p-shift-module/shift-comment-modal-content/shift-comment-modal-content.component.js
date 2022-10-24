var _a;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { TextToHtmlService } from '@plano/client/scheduling/shared/text-to-html.service';
import { SchedulingApiShift, SchedulingApiTodaysShiftDescription } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { ModalContentComponentCloseReason } from '@plano/shared/core/p-modal/modal-content-component.interface';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { PThemeEnum } from '../../bootstrap-styles.enum';
import { ShiftAndShiftModelFormTabs } from '../../component/p-shift-and-shiftmodel-form/p-shift-and-shiftmodel-form.component';
let PShiftCommentModalContentComponent = class PShiftCommentModalContentComponent {
    constructor(textToHtmlService, modalService, pRouterService) {
        this.textToHtmlService = textToHtmlService;
        this.modalService = modalService;
        this.pRouterService = pRouterService;
        this.shift = null;
        this.userCanWrite = null;
        this.CONFIG = Config;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.PThemeEnum = PThemeEnum;
    }
    /** @see ModalContentComponent['initModalContentComponent'] */
    initModalContentComponent(modalRef, shift, userCanWrite) {
        this.modalRef = modalRef;
        this.shift = shift;
        this.userCanWrite = userCanWrite;
    }
    textToHtml(text, doNotCut) {
        return this.textToHtmlService.textToHtml(text, doNotCut, doNotCut);
    }
    /**
     * Get content for blockquote innerHTML.
     */
    get commentAsBlockquote() {
        if (this.shift.description)
            return this.textToHtml(this.shift.description, false);
        return '…';
    }
    /** @see ModalContentComponent['dismissModal'] */
    dismissModal() {
        this.modalRef.dismiss();
    }
    /** @see ModalContentComponent['closeModal'] */
    closeModal() {
        const success = () => {
            if (!this.userCanWrite)
                return;
            this.modalRef.close(ModalContentComponentCloseReason.ADD);
        };
        success();
    }
    /**
     * Remove this item and close modal
     */
    onRemoveItem(removeDescriptionModalContent) {
        this.modalService.openModal(removeDescriptionModalContent, {
            theme: PThemeEnum.DANGER,
            success: () => {
                this.modalRef.close(ModalContentComponentCloseReason.REMOVE);
            },
        });
    }
    /**
     * Get start - no matter if SchedulingApiShift or SchedulingApiTodaysShiftDescription is provided
     */
    get start() {
        if (!this.shift)
            return null;
        if (this.shift instanceof SchedulingApiShift)
            return this.shift.start;
        if (this.shift instanceof SchedulingApiTodaysShiftDescription)
            return this.shift.shiftStart;
        return null;
    }
    /**
     * Get end - no matter if SchedulingApiShift or SchedulingApiTodaysShiftDescription is provided
     */
    get end() {
        if (!this.shift)
            return null;
        if (this.shift instanceof SchedulingApiShift)
            return this.shift.end;
        if (this.shift instanceof SchedulingApiTodaysShiftDescription)
            return this.shift.shiftEnd;
        return null;
    }
    /**
     * Get assignedMembers if SchedulingApiShift is provided
     */
    get assignedMembers() {
        if (this.shift instanceof SchedulingApiTodaysShiftDescription)
            return this.shift.assignedMembers;
        if (this.shift instanceof SchedulingApiShift)
            return this.shift.assignedMembers;
        return null;
    }
    /**
     * Navigate to the comment editing area of this shifts form
     */
    navToShiftForm() {
        this.pRouterService.navigate([`/client/shift/${this.shift.id.toUrl()}/${ShiftAndShiftModelFormTabs.basissettings}`]);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftCommentModalContentComponent.prototype, "shift", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftCommentModalContentComponent.prototype, "userCanWrite", void 0);
PShiftCommentModalContentComponent = __decorate([
    Component({
        selector: 'p-shift-comment-modal-content',
        templateUrl: './shift-comment-modal-content.component.html',
        styleUrls: ['./shift-comment-modal-content.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof TextToHtmlService !== "undefined" && TextToHtmlService) === "function" ? _a : Object, ModalService,
        PRouterService])
], PShiftCommentModalContentComponent);
export { PShiftCommentModalContentComponent };
//# sourceMappingURL=shift-comment-modal-content.component.js.map