import { NgxPopperjsContentComponent, NgxPopperjsPlacements, NgxPopperjsTriggers } from 'ngx-popperjs';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, Input, ViewChild, TemplateRef, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { PWishesService } from '@plano/client/scheduling/wishes.service';
import { NgbFormatsService } from '@plano/client/service/ngbformats.service';
import { BootstrapRounded, BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { ShiftAndShiftModelFormTabs } from '@plano/client/shared/component/p-shift-and-shiftmodel-form/p-shift-and-shiftmodel-form.component';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { AssignmentProcessesService } from '@plano/client/shared/p-sidebar/p-assignment-processes/assignment-processes.service';
import { SchedulingApiService, SchedulingApiMember, ApiListWrapper } from '@plano/shared/api';
import { SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiAssignmentProcess } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiShiftExchanges } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { ShiftItemViewStyles } from './../shift-item/shift-item-styles';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../../shared/core/null-type-utils';
import { PDictionarySourceString } from '../../../../../../shared/core/pipe/localize.dictionary';
import { IShiftItemComponent } from '../shift-item/shift-item.component';

@Component({
	selector: 'p-shift-item-list[shift][showCourseInfo][processStatusIconTemplate][memberBadgesTemplate][quickAssignmentTemplate][shiftExchangeIconsTemplate][linkedCourseInfoTemplate]',
	templateUrl: './shift-item-list.component.html',
	styleUrls: ['./shift-item-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class ShiftItemListComponent implements PComponentInterface, OnDestroy, IShiftItemComponent {
	@Input('isLoading') public _isLoading : PComponentInterface['isLoading'] = false;

	@Input() public readMode : boolean = false;

	@Input() public processStatusIconTemplate ! : TemplateRef<unknown>;
	@Input() public memberBadgesTemplate ! : TemplateRef<unknown>;
	@Input() public quickAssignmentTemplate ! : TemplateRef<unknown>;
	@Input() public shiftExchangeIconsTemplate ! : TemplateRef<unknown>;
	@Input() public linkedCourseInfoTemplate ! : TemplateRef<unknown>;

	public states : typeof SchedulingApiAssignmentProcessState = SchedulingApiAssignmentProcessState;

	@ViewChild('tooltipRef', { static: true }) private popperContent ! : NgxPopperjsContentComponent;

	@Input() public muteItem : boolean = false;
	@Input() public shiftIsSelectable : boolean = false;

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

	public ShiftItemViewStyles = ShiftItemViewStyles;
	@Input() public viewStyle : ShiftItemViewStyles = ShiftItemViewStyles.SMALL;

	@Output() public onClick : EventEmitter<{shift : SchedulingApiShift, event : MouseEvent}> = new EventEmitter();

	public readonly CONFIG : typeof Config = Config;

	private ngUnsubscribe : Subject<void> = new Subject<void>();

	/**
	 * Open details of shift
	 */
	@Output() public onClickEdit : EventEmitter<{
		shift : SchedulingApiShift,
		event : MouseEvent,
		openTab ?: ShiftAndShiftModelFormTabs,
	}> = new EventEmitter<{
		shift : SchedulingApiShift,
		event : MouseEvent,
		openTab ?: ShiftAndShiftModelFormTabs,
	}>();

	@Input() public isInThePast : boolean = false;

	constructor(
		private api : SchedulingApiService,
		public meService : MeService,
		public ngbFormats : NgbFormatsService,
		public highlightService : HighlightService,
		private assignmentProcessesService : AssignmentProcessesService,
		public rightsService : RightsService,
		public schedulingService : SchedulingService,
		private wishesService : PWishesService,
	) {
		// update tooltip visibility
		this.subscription = this.highlightService.onChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe( () => {
			const highlighted = this.highlightService.isHighlighted(this.shift);
			assumeDefinedToGetStrictNullChecksRunning(this.popperContent, 'popperContent');
			const tooltipVisible = this.popperContent.displayType !== 'none';

			if (highlighted && !tooltipVisible) {
				this.popperContent.show();
			} else if (!highlighted && tooltipVisible) {
				this.popperContent.hide();
			}
		});
	}

	public NgxPopperjsTriggers = NgxPopperjsTriggers;
	public BootstrapSize = BootstrapSize;
	public NgxPopperjsPlacements = NgxPopperjsPlacements;
	public BootstrapRounded = BootstrapRounded;

	public icons = PlanoFaIconPool;

	private subscription : Subscription | null = null;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isLoading() : PComponentInterface['isLoading'] {
		return this._isLoading;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get name() : string | null {
		if (this.isLoading) return null;
		return this.shift.model.attributeInfoName.value;
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get start() : number | null {
		if (this.isLoading) return null;
		return this.shift.start;
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get end() : number | null {
		if (this.isLoading) return null;
		return this.shift.end;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get hasIllnessShiftExchanges() : boolean | undefined {
		if (this.isLoading) return undefined;
		return !!this.illnessShiftExchanges.length;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get illnessShiftExchanges() : SchedulingApiShiftExchanges {
		if (this.isLoading) return new SchedulingApiShiftExchanges(null, false);
		return this.shiftExchanges.filterBy(item => {
			if (!item.isIllness) return false;

			// Only get the items where the illness is confirmed.
			if (this.shift.assignedMemberIds.contains(item.indisposedMemberId)) return false;

			return true;
		});
	}

	private get shiftExchanges() : SchedulingApiShiftExchanges {
		if (this.isLoading) return new SchedulingApiShiftExchanges(null, false);
		return this.api.data.shiftExchanges.filterBy(item => item.shiftRefs.contains(this.shift.id));
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public onCloseShiftTooltip( event : MouseEvent, popperContent : NgxPopperjsContentComponent ) : void {
		if (Config.IS_MOBILE) return;
		popperContent.hide();

		// a click on the calendar removes the highlightedShift.
		event.stopPropagation();

		if (
			// this.viewStyle !== shiftItemViewStyles.button &&
			this.viewStyle !== ShiftItemViewStyles.MEDIUM
		) {
			if (this.highlightService.isHighlighted(this.shift)) {
				this.highlightService.setHighlighted(null);
				this.wishesService.item = null;
			} else {
				this.highlightService.setHighlighted(this.shift);
				this.wishesService.item = this.shift;
			}
		}

		this.onClick.emit({
			shift: this.shift,
			event: event,
		});
	}

	public ngOnDestroy() : void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
		this.subscription?.unsubscribe();
	}

	// TODO: needs to be excluded in a own service?
	/**
	 * Get a title of the related process
	 */
	public processTitleForState(process : SchedulingApiAssignmentProcess) : PDictionarySourceString | null {
		if (this.isLoading) return null;
		const state = process.state !== SchedulingApiAssignmentProcessState.NEEDING_APPROVAL ? process.state : SchedulingApiAssignmentProcessState.APPROVE;
		return this.assignmentProcessesService.getDescription(state, this.rightsService.userCanEditAssignmentProcess(process)!);
	}

	/**
	 * Check if user can edit this shift
	 */
	public get userCanWrite() : boolean | null | undefined {
		if (this.isLoading) return undefined;
		return this.rightsService.userCanWrite(this.shift);
	}

	/**
	 * Check if user can read this shift
	 */
	public get userCanRead() : boolean | null {
		if (this.isLoading) return null;
		return this.rightsService.userCanRead(this.shift.model);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get memberIsHighlighted() : boolean {
		if (!this.highlightService.highlightedItem) return false;
		if (!(this.highlightService.highlightedItem instanceof SchedulingApiMember)) return false;
		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showWishesIconForMember() : boolean | undefined {
		if (this.isLoading) return undefined;
		if (!this.meService.isLoaded()) return false;
		if (!this.memberIsHighlighted) return false;
		if (
			!this.meService.data.isOwner &&
			// me has no right to write this shift
			!this.rightsService.userCanWrite(this.shift) &&
			// me is not highlighted
			!this.meService.data.id.equals(this.highlightService.highlightedItem!.id)
		) return false;
		if (!this.highlightService.showWishIcon(this.shift)) return false;
		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get multiSelectIsPossible() : boolean {
		// Shift-Related rules
		if (!this.selectable) return false;
		// if (this.viewStyle === shiftItemViewStyles.button) return false;

		// Environment-Related rules
		return (!Config.IS_MOBILE || !!this.showMultiSelectCheckbox);
	}

}
