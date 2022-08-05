import { TemplateRef } from '@angular/core';
import { Component, Input, Output, EventEmitter, HostBinding, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { SchedulingApiAbsence} from '@plano/shared/api';
import { SchedulingApiWorkingTime } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../shared/core/null-type-utils';
import { PlanoFaIconPool } from '../../../../shared/core/plano-fa-icon-pool.enum';
import { ReportService } from '../../report.service';

@Component({
	selector: 'p-report-row',
	templateUrl: './report-row.component.html',
	styleUrls: ['./report-row.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class ReportRowComponent {
	public readonly CONFIG : typeof Config = Config;
	@Input() public memberName : string | null = null;
	@Input('regularPauseDuration') private _regularPauseDuration : number | null = null;
	@Input('automaticPauseDuration') private _automaticPauseDuration : number | null = null;
	@Input() public mergePauseDurations : boolean = false;
	@Input('duration') private _duration : number | null = null;
	@Input('warningAmount') private _warningAmount : number | null = null;

	@HostBinding('class.headline') @Input() public headline : boolean = false;

	@HostBinding('class.disabled') @Input() private disabled : boolean = false;

	@HostBinding('class.uncollapsed') @Input() private uncollapsed : boolean = false;

	@HostBinding('class.rounded-top')
	@HostBinding('class.border-0')
	@HostBinding('class.btn-primary') private get _highlightedHeadline() : boolean | null {
		if (!this.headline) return false;
		if (this.disabled) return false;
		if (this.uncollapsed) return true;
		// NOTE: This return was missing. I added it because our app works and i don’t want to change logic.
		return null;
	}

	@HostBinding('class.clickable')
	@HostBinding('class.collapsed') private get _collapsed() : boolean {
		if (!this.headline) return false;
		if (this.disabled) return false;
		return !this.uncollapsed;
	}

	@HostBinding('class.bg-white') private get _bgWhite() : boolean {
		if (this.headline && this.uncollapsed) return false;
		return !!this.highlightService.highlightedItem && !this.muteItem;
	}

	/**
	 * The amount of comments will be shown if this is set.
	 */
	@Input() public commentAmount : number | null = null;

	@Input() public workingTime : SchedulingApiWorkingTime | null = null;

	@Input() public absence : SchedulingApiAbsence | null = null;
	@Input() public hideEditBtn : boolean = false;

	// Is there a time-limit for this report-row? Limit effects duration, earning etc.
	@Input() public min : number | null = null;
	@Input() public max : number | null = null;

	@Input() public ruler : boolean = false;

	@Input('mutedItem') private _mutedItem : boolean | null = null;

	@Output() public onClick : EventEmitter<undefined> = new EventEmitter();
	@Output() public onEdit : EventEmitter<undefined> = new EventEmitter();

	public PlanoFaIconPool = PlanoFaIconPool;

	@HostBinding('class.muted-item')
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get muteItem() : boolean {
		if (this._mutedItem !== null) return this._mutedItem;
		if (this.absence && this.highlightService.isMuted(this.absence)) return true;
		if (this.workingTime && this.highlightService.isMuted(this.workingTime)) return true;
		return false;
	}

	@HostListener('click') private _onClickComponent() : void {
		// Do nothing if user does not have the right to see the detail page.
		if (!this.item?.attributeInfoThis.canEdit) return;

		if (this.showEditBtn) return;
		if (!Config.IS_MOBILE) return;
		if (this.workingTime?.isExpectedWorkingTime) {
			this.modalService.info({
				description: this.localize.transform('Diese Prognose für die Zukunft basiert auf dem aktuellen Schichtplan und kann nicht bearbeitet werden.'),
			});
			return;
		}
		this.onEdit.emit();
	}

	constructor(
		private modalService : ModalService,
		public me : MeService,
		private highlightService : HighlightService,
		public reportService : ReportService,
		private localize : LocalizePipe,
		public api : SchedulingApiService,
	) {
	}

	/**
	 * Is there a (onClick)="…" on this component?
	 */
	public get hasOnClickBinding() : boolean {
		if (this.disabled) return false;
		return this.onClick.observers.length > 0;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get hasOnEditBinding() : boolean {
		return this.onEdit.observers.length > 0;
	}

	/**
	 * Opens a modal
	 */
	public open(modalContent : TemplateRef<unknown>) : void {
		this.modalService.openModal(modalContent).result.then(
			() => {},
			() => {},
		);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get regularPauseDuration() : number | null {
		if (this.absence) return null;
		if (this.workingTime) return null;

		const result = this._regularPauseDuration;
		if (result === 0 || result! >= 60000) {
			return result;
		}
		return 60000;

	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get automaticPauseDuration() : number | null {
		if (this._automaticPauseDuration !== null) return this._automaticPauseDuration;
		if (this.absence) return null;
		// NOTE: This return was missing. I added it because our app works and i don’t want to change logic.
		return null;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get duration() : number {
		if (this._duration !== null) return this._duration;
		if (this.workingTime) throw new Error('set [duration]');
		if (this.absence) return this.absence.totalDaysBetween(this.min!, this.max!);
		throw new Error('Duration could not be calculated');

	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get comment() : string | null {
		if (this.workingTime) return this.workingTime.comment;
		if (this.absence) return this.absence.ownerComment;
		return null;
	}

	public set comment(input : string | null) {
		assumeDefinedToGetStrictNullChecksRunning(input, 'input');
		if (this.absence) {
			this.absence.ownerComment = input;
		}
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get warningAmount() : number | null {
		if (this.workingTime) return this.workingTime.warningAmount;
		if (this.absence) return null;
		return this._warningAmount;

	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showCommentIcons() : boolean {
		if (!this.warningAmount && !this.comment) return false;
		if (!this.workingTime && !this.absence) return false;
		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showEditBtn() : boolean {
		if (Config.IS_MOBILE) return false;
		if (!this.hasOnEditBinding) return false;
		if (this.hideEditBtn) return false;
		assumeNonNull(this.item);
		if (!this.item.attributeInfoThis.canEdit) return false;
		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get hasManyDays() : boolean {
		return this.absence!.totalDaysBetween(this.min!, this.max!) >= 2;
	}

	private get item() : SchedulingApiWorkingTime | SchedulingApiAbsence | null {
		return this.workingTime ?? this.absence;
	}
}
