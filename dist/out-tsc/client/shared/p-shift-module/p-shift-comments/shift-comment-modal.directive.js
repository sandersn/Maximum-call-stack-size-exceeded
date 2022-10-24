var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Directive, HostListener, Input } from '@angular/core';
import { RightsService, SchedulingApiService } from '@plano/shared/api';
import { LogService } from '@plano/shared/core/log.service';
import { ModalContentComponentCloseReason } from '@plano/shared/core/p-modal/modal-content-component.interface';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { assumeNonNull } from '../../../../shared/core/null-type-utils';
import { PShiftCommentModalContentComponent } from '../shift-comment-modal-content/shift-comment-modal-content.component';
let ShiftCommentModalDirective = class ShiftCommentModalDirective {
    constructor(modalService, api, rightsService, console) {
        this.modalService = modalService;
        this.api = api;
        this.rightsService = rightsService;
        this.console = console;
        this.modalContentOptions = {
            modalTitle: 'Sicher?',
            description: 'Echt jetzt?',
            closeBtnLabel: 'Okay …',
            dismissBtnLabel: 'Never ever!',
            hideDismissBtn: false,
        };
        this.modalServiceOptions = null;
        this.disabled = false;
        this.shift = null;
        this.userCanWrite = null;
        this.beforeSaveChangesHook = null;
    }
    openModalAndInitComponent() {
        if (this.api.isLoaded() && this.userCanWrite) {
            this.api.createDataCopy();
        }
        const modalRef = this.modalService.openModal(PShiftCommentModalContentComponent, {
            success: (result) => {
                this.console.debug('Success', result, ModalContentComponentCloseReason[result]);
                switch (result) {
                    case ModalContentComponentCloseReason.ADD:
                        break;
                    case ModalContentComponentCloseReason.REMOVE:
                        if (this.shift)
                            this.shift.description = '';
                        // if (this.todaysShiftDescription) this.todaysShiftDescription.description = '';
                        break;
                    default:
                        break;
                }
                if (this.beforeSaveChangesHook) {
                    this.beforeSaveChangesHook(() => {
                        this.api.mergeDataCopy();
                        this.api.save();
                    });
                }
                else {
                    this.api.mergeDataCopy();
                    this.api.save();
                }
            },
            dismiss: (_reason) => {
                this.console.debug('Dismiss');
                if (this.api.isLoaded() && this.userCanWrite) {
                    this.api.dismissDataCopy();
                }
            },
        });
        const contentComponentInstance = modalRef.componentInstance;
        assumeNonNull(this.userCanWrite);
        contentComponentInstance.initModalContentComponent(modalRef, this.shift, this.userCanWrite);
    }
    onClick() {
        if (this.disabled)
            return;
        // this.getCommentModalContent();
        this.openModalAndInitComponent();
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftCommentModalDirective.prototype, "modalContent", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftCommentModalDirective.prototype, "modalContentOptions", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftCommentModalDirective.prototype, "modalServiceOptions", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftCommentModalDirective.prototype, "disabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftCommentModalDirective.prototype, "shift", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftCommentModalDirective.prototype, "userCanWrite", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftCommentModalDirective.prototype, "beforeSaveChangesHook", void 0);
__decorate([
    HostListener('click'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShiftCommentModalDirective.prototype, "onClick", null);
ShiftCommentModalDirective = __decorate([
    Directive({
        selector: '[pShiftCommentModal][shift]',
        // exportAs: 'pModal',
    }),
    __metadata("design:paramtypes", [ModalService, typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, typeof (_b = typeof RightsService !== "undefined" && RightsService) === "function" ? _b : Object, LogService])
], ShiftCommentModalDirective);
export { ShiftCommentModalDirective };
//# sourceMappingURL=shift-comment-modal.directive.js.map