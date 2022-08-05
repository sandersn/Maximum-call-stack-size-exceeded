
import { OnChanges, TemplateRef } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { TextToHtmlService } from '@plano/client/scheduling/shared/text-to-html.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { SchedulingApiMemo } from '@plano/shared/api';
import { Assertions } from '@plano/shared/core/assertions';
import { Data } from '@plano/shared/core/data/data';
import { PrimitiveDataInput } from '@plano/shared/core/data/primitive-data-input';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeNonNull } from '../../../../shared/core/null-type-utils';
import { PThemeEnum } from '../../bootstrap-styles.enum';

@Component({
	selector: 'p-day-comment',
	templateUrl: './day-comment.component.html',
	styleUrls: ['./day-comment.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})

export class DayCommentComponent implements OnChanges {
	@Input() public dayStart : number | null = null;
	@Input() public showDateInput : boolean = false;
	@Input() public clickable : boolean = true;

	// TODO: Its not intuitive that these are true by default
	@Input() private maxLines : number | boolean = true;
	@Input() private maxTextLength : number | boolean = true;

	constructor(
		public me : MeService,
		public api : SchedulingApiService,
		private modalService : ModalService,
		private textToHtmlService : TextToHtmlService,
		private pMoment : PMomentService,
	) {}

	public PlanoFaIconPool = PlanoFaIconPool;
	public PThemeEnum = PThemeEnum;

	/** ngOnChanges */
	public ngOnChanges() : void {
		// When nothing is set it means "today"
		if (!this.dayStart) {
			this.dayStart = +this.pMoment.m().startOf('day');
		}

		Assertions.ensureIsDayStart(this.dayStart);
	}

	private _memo : Data<SchedulingApiMemo> =
		new Data<SchedulingApiMemo>(this.api, new PrimitiveDataInput<number>(() => this.dayStart!));
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get memo() : SchedulingApiMemo | null {
		const memo = this.api.data.memos.getByDay(this.dayStart!);
		if (!memo) return null;
		return this._memo.get(() => memo);
	}

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
				this.api.save();
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
	public get userCanEditMemos() : boolean {
		return this.api.data.memos.attributeInfoThis.canEdit;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public openMemo(modalContent : TemplateRef<unknown>) : void {
		this.api.createDataCopy();
		if (!this.hasMemo) this.createMemo();
		this.modalService.openModal(modalContent, {
			success: () => {
				this.api.mergeDataCopy();
				assumeNonNull(this.memo);
				if (!this.memo.message.length) this.removeEditableMemo(this.memo);

				// HACK: Sometimes there are memos without a message. i don’t know why. ¯\_(ツ)_/¯
				for (const item of this.api.data.memos.iterable()) {
					if (item.message.length) continue;
					this.api.data.memos.removeItem(item);
				}

				this.api.save();
			},
			dismiss: () => {
				this.api.dismissDataCopy();
			},
		});
	}

	private createMemo() : void {
		const newMemo = this.api.data.memos.createNewItem();
		newMemo.start = this.dayStart!;
		newMemo.end = this.pMoment.m(this.dayStart).add(1, 'day').valueOf();
		newMemo.message = '';
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
