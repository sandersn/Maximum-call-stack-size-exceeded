import { Directive, HostListener, Input } from '@angular/core';
import { ModalContentOptions } from './modal-default-template/modal-default-template.component';
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

@Directive({
	selector: '[pModal]',
	// exportAs: 'pModal',
})
export class ModalDirective {
	@Input() private modalContent : unknown;
	@Input() private modalContentOptions : ModalContentOptions = {
		modalTitle: 'Sicher?',
		description: 'Echt jetzt?',
		closeBtnLabel: 'Okay …',
		dismissBtnLabel: 'Never ever!',
		hideDismissBtn: false,
		icon: undefined!,
	};
	@Input() private modalServiceOptions : ModalServiceOptions = {};
	@Input() private disabled : boolean | null = null;

	constructor(
		private modalService : ModalService,
		private console : LogService,
	) {
	}

	@HostListener('click') private onClick() : void {
		this.console.log('clicked');
		if (this.disabled) return;
		this.openModal();
	}

	private openModal() : void {
		if (!this.modalContent) {
			this.modalService.openDefaultModal(this.modalContentOptions, this.modalServiceOptions);
			return;
		}
		this.modalService.openModal(this.modalContent, this.modalServiceOptions);
	}
}
