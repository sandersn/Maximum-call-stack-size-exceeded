import { TemplateRef } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { TextToHtmlService } from '@plano/client/scheduling/shared/text-to-html.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { SchedulingApiShiftModel} from '@plano/shared/api';
import { SchedulingApiShift, SchedulingApiTodaysShiftDescription } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../../shared/core/null-type-utils';

@Component({
	selector: 'p-shift-comment',
	templateUrl: './p-shift-comment.component.html',
	styleUrls: ['./p-shift-comment.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})

export class PShiftCommentComponent {
	@Input() public todaysShiftDescription : SchedulingApiTodaysShiftDescription | null = null;
	@Input() public shift : SchedulingApiShift | null = null;
	@Input() public userCanWrite : boolean = false;

	public config : typeof Config = Config;

	constructor(
		public api : SchedulingApiService,
		private modalService : ModalService,
		private textToHtmlService : TextToHtmlService,
	) {
	}

	public PThemeEnum = PThemeEnum;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get item() : SchedulingApiTodaysShiftDescription | SchedulingApiShift | null {
		if (this.shift) return this.shift;
		if (this.todaysShiftDescription) return this.todaysShiftDescription;
		return null;
	}

	private textToHtml(text : string, doNotCut ?: boolean) : string {
		return this.textToHtmlService.textToHtml(text, doNotCut, doNotCut);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public innerHTML(doNotCut : boolean = false) : string | undefined {
		if (!this.api.isLoaded()) return undefined;
		assumeNonNull(this.item);
		assumeDefinedToGetStrictNullChecksRunning(this.item.description, 'this.item.description');
		const description = this.textToHtml(this.item.description, doNotCut);
		if (description) return description;
		return '…';
	}

	/**
	 * Modal with question if comments should be removed
	 */
	public removeDescriptionPrompt(removeMemoModalContent : TemplateRef<unknown>) : void {
		this.modalService.openModal(removeMemoModalContent, {
			theme: PThemeEnum.DANGER,
			success: () => {
				this.removeDescriptionAndSave();
			},
		});
	}

	/**
	 * Remove a comment
	 */
	private removeDescriptionAndSave() : void {
		this.removeDescription();
		this.api.save();
	}

	private removeDescription() : void {
		if (this.shift) this.shift.description = '';
		if (this.todaysShiftDescription) this.todaysShiftDescription.description = '';
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get shiftModel() : SchedulingApiShiftModel | null {
		if (this.shift) {
			return this.api.data.shiftModels.get(this.shift.id.shiftModelId);
		}
		if (this.todaysShiftDescription) return this.api.data.shiftModels.get(this.todaysShiftDescription.id.shiftModelId);
		return null;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get title() : string | undefined {
		if (this.shift) return this.shift.name;
		if (this.shiftModel) return this.shiftModel.name;
		if (this.todaysShiftDescription) return this.todaysShiftDescription.name;
		return '';
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get start() : number | undefined {
		if (this.shift) return this.shift.start;
		if (this.todaysShiftDescription) return this.todaysShiftDescription.shiftStart;
		return undefined;
	}

}
