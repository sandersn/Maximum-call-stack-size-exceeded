import { TemplateRef } from '@angular/core';
import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Input } from '@angular/core';
import { TextToHtmlService } from '@plano/client/scheduling/shared/text-to-html.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiMemo } from '@plano/shared/api';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeNonNull } from '../../../../../shared/core/null-type-utils';

@Component({
	selector: 'p-comment[userCanEditMemos]',
	templateUrl: './comment.component.html',
	styleUrls: ['./comment.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})

export class CommentComponent {
	@Input() public memo : SchedulingApiMemo | null = null;
	@Input() public showDateInput : boolean = false;
	@Input() public clickable : boolean = true;

	// TODO: Its not intuitive that these are true by default
	@Input() private maxLines : number | boolean = true;
	@Input() private maxTextLength : number | boolean = true;

	@Input() public userCanEditMemos ! : boolean;

	@Output() public onSave : EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() public onOpenModal : EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() public onModalSuccess : EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() public onModalDismiss : EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(
		public api : SchedulingApiService,
		private modalService : ModalService,
		private textToHtmlService : TextToHtmlService,
		private console : LogService,
	) {}

	public PlanoFaIconPool = PlanoFaIconPool;
	public PThemeEnum = PThemeEnum;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get hasMemo() : boolean {
		return this.api.isLoaded() && !!this.memo && !!this.memo.message;
	}

	/**
	 * Modal with question if memo should be removed
	 */
	public removeMemoPrompt(removeMemoModalContent : TemplateRef<unknown>) : void {
		this.modalService.openModal(removeMemoModalContent, {
			theme: PThemeEnum.DANGER,
			success: () => {
				assumeNonNull(this.memo);
				this.removeEditableMemo(this.memo);
				this.onSave.emit();
			},
		});
	}

	/**
	 * Turn the text into html [and crop it if wanted]
	 */
	public textToHtml(text : string) : string {
		return this.textToHtmlService.textToHtml(text, this.maxTextLength, this.maxLines);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get blockquoteIsClickable() : boolean {
		if (!this.clickable) return false;
		if (!this.userCanEditMemos && !this.hasMemo) return false;
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public openMemo(modalContent : TemplateRef<unknown>) : void {
		this.onOpenModal.emit();
		if (!this.hasMemo) {
			this.console.error('No memo available');
			return;
		}
		this.modalService.openModal(modalContent, {
			success: () => {
				this.onModalSuccess.emit();
			},
			dismiss: () => {
				this.onModalDismiss.emit();
			},
		});
	}

	/**
	 * Remove a memo
	 */
	private removeEditableMemo(memo : SchedulingApiMemo) : void {
		// HACK: Sometimes there are memos without a message. i don’t know why. ¯\_(ツ)_/¯
		for (const item of this.api.data.memos.iterable()) {
			if (item.message.length) continue;
			this.api.data.memos.removeItem(item);
		}
		this.api.data.memos.removeItem(memo);
	}
}
