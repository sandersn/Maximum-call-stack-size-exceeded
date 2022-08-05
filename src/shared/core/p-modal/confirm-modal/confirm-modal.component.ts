import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { LocalizePipe } from '../../pipe/localize.pipe';
import { ModalContentOptions } from '../modal-default-template/modal-default-template.component';
import { ModalServiceOptions } from '../modal.service.options';

@Component({
	selector: 'p-confirm-modal',
	templateUrl: './confirm-modal.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PConfirmModalComponent {
	constructor(
		private activeModal : NgbActiveModal,
		private localize : LocalizePipe,
	) {}

	public PThemeEnum = PThemeEnum;

	public modalContentOptions : ModalContentOptions = {};
	public theme ?: ModalServiceOptions['theme'] = null;

	/**
	 * Initializes the Modal with the necessary properties from its parent component.
	 */
	public initModal(
		content : ModalContentOptions,
		theme ?: ModalServiceOptions['theme'],
	) : void {
		this.modalContentOptions = content;
		if (theme) this.theme = theme;
		if (this.modalContentOptions.closeBtnLabel === undefined) this.modalContentOptions.closeBtnLabel = this.localize.transform('Ok');
		if (this.modalContentOptions.hideDismissBtn === undefined) {
			this.modalContentOptions.hideDismissBtn = this.modalContentOptions.dismissBtnLabel === undefined;
		}
	}

	/**
	 * Close this modal
	 */
	public onClose() : void {
		this.activeModal.close();
	}

	/**
	 * Dismiss this modal
	 */
	public onDismiss() : void {
		this.activeModal.dismiss();
	}
}
