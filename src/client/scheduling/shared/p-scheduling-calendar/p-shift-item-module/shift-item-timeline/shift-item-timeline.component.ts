import { NgxPopperjsContentComponent, NgxPopperjsPlacements, NgxPopperjsTriggers } from 'ngx-popperjs';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OnDestroy } from '@angular/core';
import { Component, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { TextToHtmlService } from '@plano/client/scheduling/shared/text-to-html.service';
import { BootstrapRounded } from '@plano/client/shared/bootstrap-styles.enum';
import { ShiftAndShiftModelFormTabs } from '@plano/client/shared/component/p-shift-and-shiftmodel-form/p-shift-and-shiftmodel-form.component';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { SchedulingApiMember} from '@plano/shared/api';
import { ApiListWrapper, SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiAssignmentProcess } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { IShiftItemComponent } from '../shift-item/shift-item.component';

@Component({
	selector: 'p-shift-item-timeline[shift][showCourseInfo][processStatusIconTemplate][memberBadgesTemplate][quickAssignmentTemplate]',
	templateUrl: './shift-item-timeline.component.html',
	styleUrls: ['./shift-item-timeline.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})

export class ShiftItemTimelineComponent implements PComponentInterface, OnDestroy, IShiftItemComponent {
	@Input() public isLoading : PComponentInterface['isLoading'] = false;

	@Input() public readMode : boolean = false;

	@Input() public processStatusIconTemplate ! : TemplateRef<unknown>;
	@Input() public quickAssignmentTemplate ! : TemplateRef<unknown>;
	@Input() public shiftExchangeIconsTemplate : TemplateRef<unknown> | null = null;
	@Input() public linkedCourseInfoTemplate : TemplateRef<unknown> | null = null;

	@Input() public memberBadgesTemplate ! : TemplateRef<unknown>;

	public states : typeof SchedulingApiAssignmentProcessState = SchedulingApiAssignmentProcessState;

	@ViewChild('tooltipRef', { static: true }) private popperContent ! : NgxPopperjsContentComponent;

	@Input() public muteItem : boolean = false;
	@Input() public shiftIsSelectable : boolean = false;

	/**
	 * With this boolean the multi-select checkboxes can be turned off for this shift
	 */
	@Input() public selectable : boolean = false;
	@Output() public selectedChange : EventEmitter<boolean> = new EventEmitter<boolean>();

	@Input() public process : SchedulingApiAssignmentProcess | null = null;
	@Input() public meIsAssignable : boolean = false;
	@Input() public showAssignMeButton : boolean = false;
	@Input() public showMultiSelectCheckbox : boolean = false;
	@Input() public showProcessStatusIcon : boolean = false;
	@Input() public showCourseInfo ! : boolean;

	@Input() public shift ! : SchedulingApiShift;
	@Input() public assignedMembers : ApiListWrapper<SchedulingApiMember> | null = null;

	public readonly CONFIG : typeof Config = Config;

	private ngUnsubscribe : Subject<void> = new Subject<void>();

	@Input() public isInThePast : boolean = false;

	constructor(
		public highlightService : HighlightService,
		private textToHtmlService : TextToHtmlService,
		public schedulingService : SchedulingService,
	) {
		// update tooltip visibility
		this.subscription = this.highlightService.onChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe( () => {
			const highlighted = this.highlightService.isHighlighted(this.shift);
			const tooltipVisible = this.popperContent.displayType !== 'none';

			if (highlighted && !tooltipVisible) {
				this.popperContent.show();
				window.setTimeout(() => {
					this.popperContent.update();
				});
			} else if (!highlighted && tooltipVisible) {
				this.popperContent.hide();
			}
		});
	}

	public NgxPopperjsTriggers = NgxPopperjsTriggers;
	public NgxPopperjsPlacements = NgxPopperjsPlacements;
	public BootstrapRounded = BootstrapRounded;

	private subscription : Subscription | null = null;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onCloseShiftTooltip( _event : MouseEvent, popperContent : NgxPopperjsContentComponent) : void {
		popperContent.hide();
		this.highlightService.isHighlighted(null);
	}

	public ngOnDestroy() : void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
		this.subscription?.unsubscribe();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get hexColor() : string {
		return this.shift.model.color;
	}

	/**
	 * Close tooltip if any and open details of shift
	 */
	@Output() public onClickEdit : EventEmitter<{
		shift : SchedulingApiShift,
		event : MouseEvent,
		openTab ?: ShiftAndShiftModelFormTabs,
	}> = new EventEmitter();

	/**
	 * Turn the text into html [and crop it if wanted]
	 */
	public textToHtml(text : string) : string {
		return this.textToHtmlService.textToHtml(text, false, false);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get multiSelectIsPossible() : boolean {
		// Shift-Related rules
		if (!this.selectable) return false;

		// Environment-Related rules
		return (!Config.IS_MOBILE || this.showMultiSelectCheckbox);
	}
}
