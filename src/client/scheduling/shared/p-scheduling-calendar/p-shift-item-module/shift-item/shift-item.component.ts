import { OnInit } from '@angular/core';
import { Component, Input, ChangeDetectionStrategy, HostBinding, HostListener, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CourseFilterService } from '@plano/client/scheduling/course-filter.service';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { PWishesService } from '@plano/client/scheduling/wishes.service';
import { AbsenceService } from '@plano/client/shared/absence.service';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { ShiftAndShiftModelFormTabs } from '@plano/client/shared/component/p-shift-and-shiftmodel-form/p-shift-and-shiftmodel-form.component';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { PShiftExchangeService } from '@plano/client/shared/p-shift-exchange/shift-exchange.service';
import { SchedulingApiMember } from '@plano/shared/api';
import { SchedulingApiAssignmentProcess } from '@plano/shared/api';
import { ApiListWrapper } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiShift } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { Data } from '@plano/shared/core/data/data';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { ShiftItemViewStyles } from './shift-item-styles';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../../shared/core/null-type-utils';
import { CalendarModes } from '../../../../calendar-modes';
import { ISchedulingApiShift } from '../../../api/scheduling-api.interfaces';
import { CalenderTimelineLayoutService } from '../../calender-timeline-layout.service';

export interface IShiftItemComponent extends PComponentInterface {
	readMode : boolean;

	/**
	 * Items in the past can be styles differently from items in the future.
	 */
	isInThePast : boolean;

	muteItem : boolean;
}

@Component({
	selector: 'p-shift-item[shift]',
	templateUrl: './shift-item.component.html',
	styleUrls: ['./shift-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class ShiftItemComponent implements PComponentInterface, OnInit, IShiftItemComponent {
	@HostBinding('id') private get hasId() : string {
		return `scroll-target-id-${this.shift!.id.toPrettyString()}`;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isLoading() : PComponentInterface['isLoading'] {
		if (this._isLoading) return true;
		return !this.api.isLoaded() || !this.meService.isLoaded() || !this.shift;
	}
	@Input('isLoading') public _isLoading : PComponentInterface['isLoading'] = false;

	@Input() public readMode : boolean = false;

	@HostBinding('class.clickable')
	@HostBinding('class.card') private _alwaysTrue : boolean = true;

	@HostBinding('class.showAsList') private get _hasShowAsListClass() : boolean {
		return this.showAsList;
	}
	@HostBinding('class.showAsTimeline') private get _hasShowAsTimelineClass() : boolean {
		return !this.showAsList;
	}
	@HostBinding('class.mr-1')
	@HostBinding('class.ml-1')
	@HostBinding('class.mb-2') private get _hasSomeBottomSpaceClass() : boolean {
		return this.hasSomeSpaceAround;
	}

	@HostBinding('class.shadow') private get _hasShadowClass() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.shift, 'this.shift');
		return !Config.IS_MOBILE && this.highlightService.isHighlighted(this.shift);
	}
	@HostBinding('class.btn-outline-secondary')
	@HostBinding('class.border-left-0')
	@HostBinding('class.border-right-0')
	@HostBinding('class.o-hidden') private get _isMobile() : boolean {
		return Config.IS_MOBILE;
	}

	@HostBinding('class.highlighted') private get _hasHighlightedClass() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.shift, 'this.shift');
		return this.highlightService.isHighlighted(this.shift);
	}
	@HostBinding('style.z-index') private get _styleZIndex() : string {
		if (!this.showAsList) {
			return this.layout.getLayout(this.shift as ISchedulingApiShift).z.toString();
		}
		assumeDefinedToGetStrictNullChecksRunning(this.shift, 'this.shift');
		if (!this.highlightService.isHighlighted(this.shift)) return '0';
		return '1020';
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	@HostBinding('class.is-in-the-past-bg') public get isInThePast() : boolean {
		return this._isInThePast;
	}

	@HostBinding('style.left.px') private get _styleLeft() : number | undefined {
		if (this.showAsList) return undefined;
		return this.layout.getLayout(this.shift as ISchedulingApiShift).x;
	}

	@HostBinding('style.top.px') 	private get _styleTop() : number | undefined {
		if (this.showAsList) return undefined;
		return this.layout.getLayout(this.shift as ISchedulingApiShift).y;
	}

	@HostBinding('style.width.px') 	private get _styleWidth() : number | undefined {
		if (this.showAsList) return undefined;
		return this.layout.getLayout(this.shift as ISchedulingApiShift).width;
	}

	@HostBinding('style.height.px') private get _styleHeight() : number | undefined {
		if (this.showAsList) return undefined;
		return this.layout.getLayout(this.shift as ISchedulingApiShift).height;
	}


	@HostBinding('class.max-width-600') private get _hasClassMaxWidth600() : boolean {
		return this.classMaxWidth600;
	}

	@HostBinding('class.m-0') private get _hasClassM0() : boolean {
		return !this.classMaxWidth600;
	}

	@HostBinding('style.border-color') private get _borderColor() : string {
		assumeDefinedToGetStrictNullChecksRunning(this.shift, 'this.shift');
		return this.highlightService.isHighlighted(this.shift) ? `#${this.shift.model.color}` : '';
	}

	@HostBinding('class.wiggle') private get _hasWiggleClass() : boolean {
		if (!this.showAsList) return false;
		if (Config.IS_MOBILE) return false;
		return this.shift!.wiggle;
	}

	/**
	 * Mark shift as highlighted
	 */
	@HostListener('click', ['$event']) private _onClickShift( event : MouseEvent) : void {
		// a click on the calendar removes the highlighted shift.
		event.stopPropagation();

		if (
			!Config.IS_MOBILE &&
			this.viewStyle !== ShiftItemViewStyles.BUTTON &&
			this.viewStyle !== ShiftItemViewStyles.MEDIUM
		) {
			assumeDefinedToGetStrictNullChecksRunning(this.shift, 'this.shift');
			if (this.highlightService.isHighlighted(this.shift)) {
				this.highlightService.setHighlighted(null);
				this.wishesService.item = null;
			} else {
				this.highlightService.setHighlighted(this.shift);
				this.wishesService.item = this.shift;
			}
		}

		this.onClick.emit({
			shift: this.shift!,
			event: event,
		});
	}


	/**
	 * FIXME: Quick n dirty for 1.7.0
	 */
	@Input('showAsList') private _showAsList : boolean = true;

	@Input() public shift ?: SchedulingApiShift | null;
	@Input() public emptyMemberSlots : SchedulingApiShift['emptyMemberSlots'] = 0;
	@Input() public viewStyle : ShiftItemViewStyles = ShiftItemViewStyles.SMALL;

	/**
	 * With this boolean the multi-select checkboxes can be turned off for this shift
	 */
	@Input() public selectable : boolean = false;
	@Output() public selectedChange : EventEmitter<boolean> = new EventEmitter<boolean>();

	/**
	 * A property to overwrite any internal logic that decides if course-info is visible or not.
	 */
	@Input('showCourseInfo') private _showCourseInfo : boolean | null = null;

	@Output() public onClick : EventEmitter<{shift : SchedulingApiShift, event : MouseEvent}> = new EventEmitter();

	constructor(
		public api : SchedulingApiService,
		private router : Router,
		public meService : MeService,
		public layout : CalenderTimelineLayoutService,
		public highlightService : HighlightService,
		private schedulingService : SchedulingService,
		private absenceService : AbsenceService,
		public rightsService : RightsService,
		private wishesService : PWishesService,
		public courseService : CourseFilterService,
		private pShiftExchangeService : PShiftExchangeService,
		private pMoment : PMomentService,
	) {
	}

	public BootstrapSize = BootstrapSize;
	public ShiftAndShiftModelFormTabs = ShiftAndShiftModelFormTabs;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showCourseInfo() : boolean {
		if (Config.IS_MOBILE) return false;
		if (this._showCourseInfo !== null) return this._showCourseInfo;
		if (this.courseService.courseVisible !== null) return this.courseService.courseVisible;
		return false;
	}

	private now ! : number;
	private _isInThePast : boolean = false;

	public ngOnInit() : void {
		this.now = +this.pMoment.m();
		this._isInThePast = this.pMoment.m(this.shift!.end).isBefore(this.now);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showAsList() : boolean {
		if (this.schedulingService.urlParam!.calendarMode === CalendarModes.MONTH) return true;
		return this._showAsList;
	}


	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showProcessStatusIcon() : boolean {
		// Status icon is not relevant while user is in earlyBirdMode
		if (this.showAssignMeButton) return false;

		// Is not part of a process?
		if (!this.process) return false;

		// Owners and bereichsleitende can see all status icons
		if (this.rightsService.userCanEditAssignmentProcess(this.process)) {
			return true;
		}

		// Members can see the state if it is not APPROVE or EARLY_BIRD_FINISHED
		if (this.process.state === this.states.APPROVE) return false;
		if (this.process.state === this.states.EARLY_BIRD_FINISHED) return false;

		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get shiftIsSelectable() : boolean {
		if (!this.schedulingService.wishPickerMode) return true;
		if (this.allowedToPickWish) return true;

		return false;
	}

	/**
	 * Close tooltip if any and open details of shift
	 */
	public openShiftItem(input : {
		shift : SchedulingApiShift,
		event : MouseEvent,
		openTab ?: ShiftAndShiftModelFormTabs,
	}) : void {
		input.event.stopPropagation();
		this.highlightService.setHighlighted(null);
		const openTabAsString : string = input.openTab ?? ShiftAndShiftModelFormTabs.basissettings;
		this.router.navigate([`/client/shift/${input.shift.id.toUrl()}/${openTabAsString}`]);
	}

	private _process : Data<SchedulingApiAssignmentProcess | null> =
		new Data<SchedulingApiAssignmentProcess>(this.api);

	/**
	 * Get the the process where this shift-item is included
	 */
	public get process() : SchedulingApiAssignmentProcess | null {
		return this._process.get(() => {
			if (!this.api.data.assignmentProcesses.length) return null;
			return this.api.data.assignmentProcesses.getByShiftId(this.shift!.id);
		});
	}

	/**
	 * Check if logged in user is assignable to this shift.
	 */
	public get meIsAssignable() : boolean {
		if (!this.meService.isLoaded()) return false;
		return this.shift!.assignableMembers.containsMemberId(this.meService.data.id);
	}

	private get allowedToPickWish() : boolean {
		// backend decides if user can pick wish
		if (!this.process) return false;
		const SHIFT_REFS = this.process.shiftRefs;
		const RELATED_SHIFT_REF = SHIFT_REFS.get(this.shift!.id);
		if (!RELATED_SHIFT_REF) throw new Error('No related shiftRef');
		return RELATED_SHIFT_REF.requesterCanSetPref === true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get muteItem() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.shift, 'this.shift');
		if (this.shift.selected) return false;
		// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition -- TODO: PLANO-18170 nils: needs to be tested in ui
		if (this.highlightService.isMuted(this.shift) !== null) return this.highlightService.isMuted(this.shift);
		if (!this.shiftIsSelectable) return true;

		// App is in assign-me-mode but user is not assignable
		if (this.schedulingService.earlyBirdMode && !this.showAssignMeButton) return true;

		if (
			Config.IS_MOBILE &&
			this.schedulingService.wishPickerMode &&
			!(this.selectable && this.allowedToPickWish)
		) return true;

		return false;
	}

	public states : typeof SchedulingApiAssignmentProcessState = SchedulingApiAssignmentProcessState;

	/**
	 * Is the current user allowed to be assigned? Is the related process an early bird thing etc.
	 */
	public get showAssignMeButton() : boolean {
		// Is not in assign-me-mode?
		if (!this.schedulingService.earlyBirdMode) return false;

		// backend decides if user can pick wish
		return this.process?.shiftRefs.get(this.shift!.id)?.requesterCanDoEarlyBird === true || false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showMultiSelectCheckbox() : boolean {
		// Should never be visible in combination with earlyBirdMode
		if (this.schedulingService.earlyBirdMode) return false;

		// If is mobile device only allow checkbox on items in wishMode
		if (Config.IS_MOBILE) return this.schedulingService.wishPickerMode;

		if (this.api.isLoaded() && this.api.hasSelectedItems) return true;
		assumeDefinedToGetStrictNullChecksRunning(this.shift, 'this.shift');
		if (this.highlightService.isHighlighted(this.shift)) return true;
		if (this.schedulingService.wishPickerMode) return true;

		return false;
	}

	private _assignedMembers : Data<ApiListWrapper<SchedulingApiMember>> =
		new Data<ApiListWrapper<SchedulingApiMember>>(this.api);
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get assignedMembers() : ApiListWrapper<SchedulingApiMember> {
		return this._assignedMembers.get(() => {
			return this.shift!.assignedMembers.sortedBy([

				// Sort them by name
				(item) => item.lastName,
				(item) => item.firstName,

				// Prio 3: All other members

				// Prio 2: Current user
				(item) => !item.id.equals(this.meService.data.id),

				// Prio 1: Absent members
				(item) => {
					assumeDefinedToGetStrictNullChecksRunning(this.shift, 'this.shift');
					!this.absenceService.overlappingAbsences(item.id, this.shift).length;
				},

			], false);
		});
	}

	/**
	 * Check if this component is fully loaded.
	 * Can be used to show skeletons/spinners then false.
	 */
	public get isLoaded() : boolean {
		if (!this.api.isLoaded()) return false;
		// NOTE: The item will be null if it could not be found
		if (this.shift === null) return true;
		if (!this.meService.isLoaded()) return false;
		if (!this.shift) return false;
		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get hasSomeBottomSpace() : boolean {
		if (this.viewStyle === ShiftItemViewStyles.DETAILED) return false;
		if (!this.hasSomeSpaceAround) return false;
		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get hasSomeSpaceAround() : boolean {
		if (Config.IS_MOBILE) return false;
		if (this.viewStyle === ShiftItemViewStyles.MULTI_SELECT) return true;
		if (this.viewStyle === ShiftItemViewStyles.MEDIUM) return true;
		if (this.viewStyle === ShiftItemViewStyles.MEDIUM_MULTI_SELECT) return true;
		return false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get classMaxWidth600() : boolean {
		if (!this.showAsList) return false;
		if (this.viewStyle === ShiftItemViewStyles.MEDIUM) return true;
		if (this.viewStyle === ShiftItemViewStyles.MEDIUM_MULTI_SELECT) return true;
		if (this.viewStyle === ShiftItemViewStyles.DETAILED) return true;
		return false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showShiftExchangeIcon() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.shift, 'this.shift');
		return this.pShiftExchangeService.shiftHasActiveShiftExchangeSearch(this.shift);
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showIllnessIcon() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.shift, 'this.shift');
		return this.pShiftExchangeService.shiftHasActiveIllness(this.shift);
	}
}
