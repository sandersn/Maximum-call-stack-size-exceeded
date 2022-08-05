import { OnInit } from '@angular/core';
import { Component, Input, EventEmitter, Output, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { TextToHtmlService } from '@plano/client/scheduling/shared/text-to-html.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiMemo } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { assumeNonNull } from '../../../../shared/core/null-type-utils';
import { PThemeEnum } from '../../bootstrap-styles.enum';

@Component({
	selector: 'p-memo-modal-content[userCanEditMemos]',
	templateUrl: './p-memo-modal-content.component.html',
	// styleUrls: ['./p-led.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PMemoModalContentComponent implements OnInit {
	@Input() public memo : SchedulingApiMemo | null = null;
	@Input() public memoModalDay : number | null = null;
	@Input('showDateInput') private _showDateInput : boolean = true;

	@Input() public userCanEditMemos ! : boolean;

	/**
	 * Theme defines the background color/style of the Modal
	 */
	@Input() public theme : PThemeEnum | null = null;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showDateInput() : boolean {
		if (!this._showDateInput) return false;
		if (!this.userCanEditMemos) return false;
		return true;
	}

	@Output() public onClose = new EventEmitter<SchedulingApiMemo>();
	@Output() private dismiss : EventEmitter<undefined> = new EventEmitter();

	/** maximum date and time of this input in timestamp format */
	@Input() public max : number = 0;

	/** minimum date and time of this input in timestamp format */
	@Input() public min : number = 0;

	public CONFIG = Config;

	constructor(
		public api : SchedulingApiService,
		private changeDetectorRef : ChangeDetectorRef,
		private textToHtmlService : TextToHtmlService,
		private pMoment : PMomentService,
	) {
	}

	public ngOnInit() : void {
		this.initValues();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public initValues() : void {
		this.initMemoModalDay();
		this.initMemo();
	}

	private initMemoModalDay() : void {
		if (this.memoModalDay) return;

		if (this.memo?.start) {
			this.memoModalDay = this.memo.start;
		}
	}

	private initMemo() : void {
		if (this.memo) return;

		// No given memo? Get one by time
		if (!this.memoModalDay) return;
		this.clearPrevMemo();
		this.memo = this.api.data.memos.getByDay(this.memoModalDay);
		this.changeDetectorRef.markForCheck();

		// Can not get a memo? Create one.
		if (!this.memo) this.createMemo();
	}

	private clearPrevMemo() : void {
		if (this.memo?.isNewItem()) this.api.data.memos.removeItem(this.memo);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onDateChange(input : number) : void {
		this.memoModalDay = input;
		if (this.memo?.isNewItem()) {
			this.api.data.memos.removeItem(this.memo);
		}
		this.memo = null;
		this.initMemo();
	}

	private createMemo() : void {
		this.clearPrevMemo();
		this.memo = this.api.data.memos.createNewItem();
		// this.changeDetectorRef.markForCheck();
		const momentDay = this.pMoment.m(this.memoModalDay).startOf('day');
		this.memo.start = momentDay.valueOf();
		this.memo.end = momentDay.add(1, 'day').valueOf();
		this.memo.message = '';
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onDismiss() : void {
		if (this.memo?.isNewItem()) this.api.data.memos.removeItem(this.memo);
		this.memo = null;
		this.dismiss.emit();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onRemoveMemo() : void {
		assumeNonNull(this.memo);
		this.memo.message = '';
		this.onClose.emit();
	}

	/**
	 * Turn the text into html [and crop it if wanted]
	 */
	public textToHtml(text : string) : string {
		return this.textToHtmlService.textToHtml(text, false, false);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showBlockquote() : boolean {
		// if (Config.IS_MOBILE) return true;
		if (!this.userCanEditMemos) return true;
		return false;
	}
}
