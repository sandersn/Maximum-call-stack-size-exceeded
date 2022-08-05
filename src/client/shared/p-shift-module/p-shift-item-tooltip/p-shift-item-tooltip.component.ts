import { Subscription } from 'rxjs';
import { OnInit, OnDestroy} from '@angular/core';
import { Component, Input, ChangeDetectorRef, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { CalenderTimelineLayoutService } from '@plano/client/scheduling/shared/p-scheduling-calendar/calender-timeline-layout.service';
import { TextToHtmlService } from '@plano/client/scheduling/shared/text-to-html.service';
import { NgbFormatsService } from '@plano/client/service/ngbformats.service';
import { ShiftAndShiftModelFormTabs } from '@plano/client/shared/component/p-shift-and-shiftmodel-form/p-shift-and-shiftmodel-form.component';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { BootstrapSize } from '../../bootstrap-styles.enum';

@Component({
	selector: 'p-shift-item-tooltip[shift]',
	templateUrl: './p-shift-item-tooltip.component.html',
	styleUrls: ['./p-shift-item-tooltip.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PShiftItemTooltipComponent implements OnInit, OnDestroy {
	@Input() public readMode : boolean = false;

	@Input() public quickAssignmentTemplate : TemplateRef<unknown> | null = null;
	@Input() public processInfoTemplate : TemplateRef<unknown> | null = null;
	@Input() public illnessShiftExchangesListTemplate : TemplateRef<unknown> | null = null;
	@Input() public linkedCourseInfoTemplate : TemplateRef<unknown> | null = null;

	@Input() public shift ! : SchedulingApiShift;
	@Input() public showProcessStatusIcon : boolean = false;

	@Output() public onClickEdit : EventEmitter<{
		shift : SchedulingApiShift,
		event : MouseEvent,
		openTab ?: ShiftAndShiftModelFormTabs,
	}> = new EventEmitter();

	/**
	 * User closes the tooltip
	 */
	@Output() public onClose : EventEmitter<MouseEvent> = new EventEmitter();

	public states : typeof SchedulingApiAssignmentProcessState = SchedulingApiAssignmentProcessState;

	constructor(
		public me : MeService,
		public api : SchedulingApiService,
		public layout : CalenderTimelineLayoutService,

		public ngbFormats : NgbFormatsService,
		public rightsService : RightsService,
		private textToHtmlService : TextToHtmlService,
		private changeDetectorRef : ChangeDetectorRef,
	) {
	}

	public BootstrapSize = BootstrapSize;

	public icons = PlanoFaIconPool;

	private subscription : Subscription | null = null;

	public ngOnInit() : void {
		this.subscription = this.api.onChange.subscribe(() => {
			this.changeDetectorRef.markForCheck();
		});
	}

	public ngOnDestroy() : void {
		this.subscription?.unsubscribe();
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showEditShiftButton() : boolean {
		if (this.readMode) return false;
		if (!this.rightsService.userCanRead(this.shift.model)) return false;
		return true;
	}

	/**
	 * Check if user can edit this shift
	 */
	public get userCanWrite() : boolean {
		return !!this.rightsService.userCanWrite(this.shift);
	}

	/**
	 * Turn the text into html [and crop it if wanted]
	 */
	public textToHtml(text : string, maxLength ?: number) : string {
		return this.textToHtmlService.textToHtml(text, maxLength, false);
	}
}
