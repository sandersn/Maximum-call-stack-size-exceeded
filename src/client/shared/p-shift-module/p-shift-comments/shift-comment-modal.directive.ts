import { Directive, HostListener, Input } from '@angular/core';
import { SchedulingApiShift, SchedulingApiTodaysShiftDescription } from '@plano/shared/api';
import { RightsService, SchedulingApiService } from '@plano/shared/api';
import { LogService } from '@plano/shared/core/log.service';
import { ModalContentComponentCloseReason } from '@plano/shared/core/p-modal/modal-content-component.interface';
import { ModalContentOptions } from '@plano/shared/core/p-modal/modal-default-template/modal-default-template.component';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { ModalServiceOptions } from '@plano/shared/core/p-modal/modal.service.options';
import { assumeNonNull } from '../../../../shared/core/null-type-utils';
import { PShiftCommentModalContentComponent } from '../shift-comment-modal-content/shift-comment-modal-content.component';

@Directive({
	selector: '[pShiftCommentModal][shift]',
	// exportAs: 'pModal',
})
export class ShiftCommentModalDirective {
	@Input() private modalContent : unknown;
	@Input() private modalContentOptions : ModalContentOptions = {
		modalTitle: 'Sicher?',
		description: 'Echt jetzt?',
		closeBtnLabel: 'Okay …',
		dismissBtnLabel: 'Never ever!',
		hideDismissBtn: false,
	};
	@Input() private modalServiceOptions : ModalServiceOptions | null = null;
	@Input() private disabled : boolean = false;

	@Input() public shift : SchedulingApiShift | SchedulingApiTodaysShiftDescription | null = null;

	@Input() public userCanWrite : boolean | null = null;

	@Input() public beforeSaveChangesHook : ((success : () => void) => void) | null = null;

	constructor(
		private modalService : ModalService,
		private api : SchedulingApiService,
		public rightsService : RightsService,
		private console : LogService,
	) {
	}

	private openModalAndInitComponent() : void {

		if (this.api.isLoaded() && this.userCanWrite) {
			this.api.createDataCopy();
		}

		const modalRef = this.modalService.openModal(PShiftCommentModalContentComponent, {
			success: (result : ModalContentComponentCloseReason) => {
				this.console.debug('Success', result, ModalContentComponentCloseReason[result]);
				switch (result) {
					case ModalContentComponentCloseReason.ADD:

						break;
					case ModalContentComponentCloseReason.REMOVE:
						if (this.shift) this.shift.description = '';
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
				} else {
					this.api.mergeDataCopy();
					this.api.save();
				}

			},
			dismiss: (_reason : unknown) => {
				this.console.debug('Dismiss');
				if (this.api.isLoaded() && this.userCanWrite) {
					this.api.dismissDataCopy();
				}
			},
		});
		const contentComponentInstance = modalRef.componentInstance as PShiftCommentModalContentComponent;
		assumeNonNull(this.userCanWrite);
		contentComponentInstance.initModalContentComponent(modalRef, this.shift, this.userCanWrite);
	}

	@HostListener('click') private onClick() : void {
		if (this.disabled) return;

		// this.getCommentModalContent();

		this.openModalAndInitComponent();
	}

	// private openModal() : void {
	// 	if (!this.modalContent) {
	// 		this.modalService.openDefaultModal(this.modalContentOptions, this.modalServiceOptions);
	// 		return;
	// 	}
	// 	this.modalService.openModal(this.modalContent, this.modalServiceOptions);
	// 	return;
	// }

}
