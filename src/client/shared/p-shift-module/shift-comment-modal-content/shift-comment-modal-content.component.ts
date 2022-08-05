import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TemplateRef } from '@angular/core';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { TextToHtmlService } from '@plano/client/scheduling/shared/text-to-html.service';
import { SchedulingApiMembers} from '@plano/shared/api';
import { SchedulingApiShift, SchedulingApiTodaysShiftDescription } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { ModalContentComponent} from '@plano/shared/core/p-modal/modal-content-component.interface';
import { ModalContentComponentCloseReason } from '@plano/shared/core/p-modal/modal-content-component.interface';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { DateTime } from '../../../../shared/api/base/generated-types.ag';
import { PThemeEnum } from '../../bootstrap-styles.enum';
import { ShiftAndShiftModelFormTabs } from '../../component/p-shift-and-shiftmodel-form/p-shift-and-shiftmodel-form.component';
import { ShiftCommentModalDirective } from '../p-shift-comments/shift-comment-modal.directive';

@Component({
	selector: 'p-shift-comment-modal-content',
	templateUrl: './shift-comment-modal-content.component.html',
	styleUrls: ['./shift-comment-modal-content.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PShiftCommentModalContentComponent implements ModalContentComponent {
	@Input() public shift : ShiftCommentModalDirective['shift'] = null;

	@Input() public userCanWrite : boolean | null = null;

	public CONFIG : typeof Config = Config;

	constructor(
		private textToHtmlService : TextToHtmlService,
		private modalService : ModalService,
		private pRouterService : PRouterService,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public PThemeEnum = PThemeEnum;

	private modalRef ! : NgbModalRef;

	/** @see ModalContentComponent['initModalContentComponent'] */
	public initModalContentComponent(modalRef : NgbModalRef, shift : ShiftCommentModalDirective['shift'], userCanWrite : boolean) : void {
		this.modalRef = modalRef;
		this.shift = shift;
		this.userCanWrite = userCanWrite;
	}

	private textToHtml(text : string, doNotCut ?: boolean) : string {
		return this.textToHtmlService.textToHtml(text, doNotCut, doNotCut);
	}

	/**
	 * Get content for blockquote innerHTML.
	 */
	public get commentAsBlockquote() : string {
		if (this.shift!.description) return this.textToHtml(this.shift!.description, false);
		return '…';
	}

	/** @see ModalContentComponent['dismissModal'] */
	public dismissModal() : void {
		this.modalRef.dismiss();
	}

	/** @see ModalContentComponent['closeModal'] */
	public closeModal() : void {
		const success = () : void => {
			if (!this.userCanWrite) return;
			this.modalRef.close(ModalContentComponentCloseReason.ADD);
		};

		success();
	}

	/**
	 * Remove this item and close modal
	 */
	public onRemoveItem(removeDescriptionModalContent : TemplateRef<unknown>) : void {
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
	public get start() : DateTime | null {
		if (!this.shift) return null;
		if (this.shift instanceof SchedulingApiShift) return this.shift.start;
		if (this.shift instanceof SchedulingApiTodaysShiftDescription) return this.shift.shiftStart;
		return null;
	}

	/**
	 * Get end - no matter if SchedulingApiShift or SchedulingApiTodaysShiftDescription is provided
	 */
	public get end() : DateTime | null {
		if (!this.shift) return null;
		if (this.shift instanceof SchedulingApiShift) return this.shift.end;
		if (this.shift instanceof SchedulingApiTodaysShiftDescription) return this.shift.shiftEnd;
		return null;
	}

	/**
	 * Get assignedMembers if SchedulingApiShift is provided
	 */
	public get assignedMembers() : SchedulingApiMembers | null {
		if (this.shift instanceof SchedulingApiTodaysShiftDescription) return this.shift.assignedMembers;
		if (this.shift instanceof SchedulingApiShift) return this.shift.assignedMembers;
		return null;
	}

	/**
	 * Navigate to the comment editing area of this shifts form
	 */
	public navToShiftForm() : void {
		this.pRouterService.navigate([`/client/shift/${this.shift!.id.toUrl()}/${ShiftAndShiftModelFormTabs.basissettings}`]);
	}
}
