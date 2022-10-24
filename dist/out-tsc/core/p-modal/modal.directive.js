import { __decorate, __metadata } from "tslib";
import { Directive, HostListener, Input } from '@angular/core';
import { ModalService } from './modal.service';
import { ModalServiceOptions } from './modal.service.options';
import { LogService } from '../log.service';
/**
 * @example
 * 			<div
 * 				pModal
 * 				[modalContentOptions]="modalContentOptions"
 * 				[modalServiceOptions]="modalServiceOptions"
 * 			>Or click here</div>
 */
let ModalDirective = class ModalDirective {
    constructor(modalService, console) {
        this.modalService = modalService;
        this.console = console;
        this.modalContentOptions = {
            modalTitle: 'Sicher?',
            description: 'Echt jetzt?',
            closeBtnLabel: 'Okay …',
            dismissBtnLabel: 'Never ever!',
            hideDismissBtn: false,
            icon: undefined,
        };
        this.modalServiceOptions = {};
        this.disabled = null;
    }
    onClick() {
        this.console.log('clicked');
        if (this.disabled)
            return;
        this.openModal();
    }
    openModal() {
        if (!this.modalContent) {
            this.modalService.openDefaultModal(this.modalContentOptions, this.modalServiceOptions);
            return;
        }
        this.modalService.openModal(this.modalContent, this.modalServiceOptions);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], ModalDirective.prototype, "modalContent", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ModalDirective.prototype, "modalContentOptions", void 0);
__decorate([
    Input(),
    __metadata("design:type", ModalServiceOptions)
], ModalDirective.prototype, "modalServiceOptions", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ModalDirective.prototype, "disabled", void 0);
__decorate([
    HostListener('click'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ModalDirective.prototype, "onClick", null);
ModalDirective = __decorate([
    Directive({
        selector: '[pModal]',
        // exportAs: 'pModal',
    }),
    __metadata("design:paramtypes", [ModalService,
        LogService])
], ModalDirective);
export { ModalDirective };
//# sourceMappingURL=modal.directive.js.map