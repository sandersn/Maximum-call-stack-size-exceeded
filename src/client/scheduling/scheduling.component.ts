import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AfterContentChecked, OnDestroy, AfterContentInit} from '@angular/core';
import { Component, HostBinding, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, ActivatedRoute } from '@angular/router';
import { CourseFilterService } from '@plano/client/scheduling/course-filter.service';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiShiftModel, SchedulingApiMember, SchedulingApiShift, SchedulingApiShifts, SchedulingApiAbsence, SchedulingApiAbsences, SchedulingApiHolidays } from '@plano/shared/api';
import { ApiListWrapper } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { Data } from '@plano/shared/core/data/data';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { ScrollTarget } from '@plano/shared/core/router.service';
import { PRouterService } from '@plano/shared/core/router.service';
import { CalendarModes } from './calendar-modes';
import { DetailObjectType } from './scheduling-api-based-pages.service';
import { SchedulingFilterService } from './scheduling-filter.service';
import { BirthdayService } from './shared/api/birthday.service';
import { SchedulingApiBirthdays } from './shared/api/scheduling-api-birthday.service';
import { sortShiftsForListViewFns } from './shared/api/scheduling-api.utils';
import { PSchedulingCalendarComponent } from './shared/p-scheduling-calendar/p-calendar/p-calendar.component';
import { PAppStartupService } from '../../app-startup.service';
import { assumeNonNull } from '../../shared/core/null-type-utils';
import { CurrentModalsService } from '../../shared/core/p-modal/current-modals.service';
import { RightsService } from '../accesscontrol/rights.service';
import { BootstrapSize } from '../shared/bootstrap-styles.enum';
import { ShiftAndShiftModelFormTabs } from '../shared/component/p-shift-and-shiftmodel-form/p-shift-and-shiftmodel-form.component';
import { FilterService } from '../shared/filter.service';
import { HighlightService } from '../shared/highlight.service';
import { PSidebarService } from '../shared/p-sidebar/p-sidebar.service';

@Component({
	selector: 'p-scheduling',
	templateUrl: './scheduling.component.html',
	styleUrls: ['./scheduling.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class SchedulingComponent implements OnDestroy, AfterContentChecked, AfterContentInit {
	@HostBinding('class.o-hidden')
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex') protected _alwaysTrue = true;

	@ViewChild(PSchedulingCalendarComponent) public calendar : PSchedulingCalendarComponent | null = null;

	public modalRef : NgbModalRef | null = null;
	public now ! : number;
	public config : typeof Config = Config;
	public searchVisible : boolean = false;

	protected ICONS = PlanoFaIconPool;

	constructor(
		public api : SchedulingApiService,
		private meService : MeService,
		private pRouterService : PRouterService,
		private route : ActivatedRoute,
		private filterService : FilterService,
		public schedulingService : SchedulingService,
		public courseFilterService : CourseFilterService,
		public highlightService : HighlightService,
		public rightsService : RightsService,
		private console : LogService,
		private pSidebarService : PSidebarService,
		public currentModalsService : CurrentModalsService,
		private schedulingFilterService : SchedulingFilterService,
		private pMomentService : PMomentService,
		private birthdayService : BirthdayService,
		private localize : LocalizePipe,
		private pAppStartupService : PAppStartupService,
		private changeDetectorRef : ChangeDetectorRef,
	) {
		this.now = +this.pMomentService.m();
	}

	public BootstrapSize = BootstrapSize;
	public CalendarModes = CalendarModes;

	public ngAfterContentChecked() : void {
		this.handleIncompleteUrl();
	}

	/**
	 * If this url has no defined date, navigate to a default-value.
	 */
	private handleIncompleteUrl() : void {
		if (this.route.snapshot.params['date'] !== '0') return;

		const date = (this.schedulingService.urlParam!.date ) ?? +this.pMomentService.m().startOf('day');
		const calendarMode = this.schedulingService.urlParam!.calendarMode ?? this.initialCalendarMode();
		this.pRouterService.navigate([`/client/scheduling/${calendarMode}/${date}`], {replaceUrl: true});
		if (this.isToday(date)) this.scrollToToday();
	}

	private isToday(date : Exclude<SchedulingService['urlParam'], null>['date']) : boolean {
		return this.pMomentService.m(date).isSame(this.now, 'date');
	}

	/**
	 * initial calendar mode
	 */
	private initialCalendarMode() : CalendarModes {
		return CalendarModes.DAY;
	}

	/**
	 * Should the sidebar be fullscreen or part of screen.
	 */
	public get hasFullscreenSideBar() : boolean {
		return Config.IS_MOBILE && !this.pSidebarService.mainSidebarIsCollapsed;
	}

	/**
	 * This makes it possible to have meService private.
	 */
	public get showContent() : boolean {
		return this.meService.isLoaded();
	}

	/** AfterContentInit */
	public ngAfterContentInit() : void {
		this.loadInitialData();
		this.setRouterListener();
	}

	private loadInitialData() : void {
		this.pAppStartupService.isReady(() => {
			this.schedulingService.writeUrlParamsToService(this.route.snapshot.params);

			this.meService.isLoaded(() => {
				this.loadNewData(() => {
					this.runAllCallbacks();
					this.scrollToCurrentDate();
				});
			});
		});
	}

	/**
	 * Update values if url changed
	 */
	private loadNewData(success ?: () => void) : void {
		this.schedulingService.updateQueryParams(!this.courseFilterService.bookingsVisible);

		// TODO: Move the following code to p-calendar.component as well as the html:
		// <p-spinner [size]="BootstrapSize.LG" *ngIf="api.isLoadOperationRunning" class="area-blocking-spinner"></p-spinner>
		// Maybe i can rewrite it in p-calendar.component to something like
		// this.api.onChange.subscribe(() => {
		// 	if (this.api.isLoadOperationRunning) {
		// 	this.changeDetectorRef.detach();
		// 	this.api.isLoaded(() => { this.changeDetectorRef.reattach() });
		// }
		// })

		// When starting loading of a view we disable whole change-detection for calendar to:
		// 1. prevent calendar from showing intermediate data (e.g. api has still data of old view but the SchedulingService
		// contains the queryParams for next view)
		// 2. Improve performance as the calendar does not destroy/recreate views during loading process

		if (this.calendar) {
			this.console.log('CalenderComponent > changeDetectorRef.detach()');
			this.calendar.changeDetectorRef.detach();
			window.setTimeout(() => {
				this.changeDetectorRef.detach();
			}, 1);
		}

		// Load data
		this.api.load({
			searchParams: this.schedulingService.queryParams,
			success: () => {

				if (!this.filterService.cookiesHaveBeenRead) {
					this.filterService.readCookies();
					this.filterService.initValues();
				}

				if ( this.filterService.isHideAll(this.api.data.members, this.api.data.shiftModels) ) {
					this.filterService.unload();
					this.filterService.initValues();
				}

				this.showDetailView(
					this.schedulingService.urlParam!.detailObject,
					this.schedulingService.urlParam!.detailObjectId,
				);

				if (success) success();

				this.schedulingService.schedulingApiHasBeenLoadedOnSchedulingComponent.next();

				if (this.calendar) {
					this.calendar.resetDelayIsActiveStore();
					this.calendar.scrollToTop();
					window.setTimeout(() => {
						assumeNonNull(this.calendar);
						this.calendar.changeDetectorRef.reattach();
						this.changeDetectorRef.reattach();
					}, 1);
					// this.console.log('CalenderComponent > changeDetectorRef.reattach()');
				}
			},
		});
	}

	/**
	 * check if date has been switched within visible range
	 */
	private newDateIsInVisibleRange(oldCalendarMode : CalendarModes, oldDate : number) : boolean {
		if (oldCalendarMode !== this.schedulingService.urlParam!.calendarMode) return false;

		if (oldDate === this.schedulingService.urlParam!.date) return true;
		return this.pMomentService.m(oldDate).isSame(this.schedulingService.urlParam!.date, oldCalendarMode);
	}

	/**
	 * Set listeners for router changes
	 */
	private setRouterListener() : void {
		// eslint-disable-next-line rxjs/no-ignored-subscription -- Remove this before you work here.
		this.pRouterService.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
			(event) => {
				// don’t listen to any other events then NavigationEnd
				if (!(event instanceof NavigationEnd)) return;

				this.highlightService.setHighlighted(null);
				const prevCalendarMode = this.schedulingService.urlParam!.calendarMode;
				const prevDate = this.schedulingService.urlParam!.date;

				this.schedulingService.writeUrlParamsToService(this.route.snapshot.params);

				if (prevCalendarMode === null) return;
				if (this.newDateIsInVisibleRange(prevCalendarMode, prevDate!)) return;
				this.loadNewData(() => {
					this.runAllCallbacks();
					this.scrollToCurrentDate();
				});
			},
			(error : unknown) => { this.console.error(error); },
		);
	}

	private scrollToCurrentDate() : void {
		if (
			this.dateIsInsideRange(
				this.route.snapshot.paramMap.get('calendarMode') as CalendarModes,
				+this.route.snapshot.paramMap.get('date')!,
			)
		) {
			this.scrollToToday(false, false);
		}
	}

	private get timelineViewIsActive() : boolean {
		return (
			this.schedulingService.urlParam!.calendarMode === CalendarModes.DAY && !this.schedulingService.showDayAsList ||
			this.schedulingService.urlParam!.calendarMode === CalendarModes.WEEK && !this.schedulingService.showWeekAsList
		);
	}

	/**
	 * Scroll to today
	 */
	public scrollToToday(
		ignoreScrollPosition : boolean = true,
		waitForApiLoaded : boolean = false,
	) : void {
		const date = (this.schedulingService.urlParam!.date ) ?? +this.pMomentService.m().startOf('day');
		if ((this.schedulingService.urlParam!.calendarMode === CalendarModes.MONTH && !Config.IS_MOBILE) || !this.isToday(date)) {
			this.pRouterService.scrollToSelector('.cal-today', {behavior: 'smooth', block: 'start'}, false, ignoreScrollPosition, waitForApiLoaded);
			return;
		}
		this.pRouterService.scrollToSelector('.scroll-target-id-now-line', Config.IS_MOBILE ? { block: 'start' } : undefined, false, ignoreScrollPosition, waitForApiLoaded);
	}

	/**
	 * Check if given timestamp is inside the current range
	 */
	private dateIsInsideRange(calendarMode : CalendarModes, timestamp : number) : boolean {
		return this.pMomentService.m(timestamp).isSame(this.now, calendarMode);
	}

	private runAllCallbacks() : void {
		for (const callback of this.schedulingService.afterNavigationCallbacks) {
			callback();
		}
		this.schedulingService.afterNavigationCallbacks = [];
	}

	/**
	 * If there is a detailObject in the url, show the related details
	 */
	private showDetailView(object : DetailObjectType | null, objectId : number | null) : void {
		if (objectId === null) return;
		const id = Id.create(objectId);
		switch (object) {
			case 'shiftModel':
				const shiftModel = this.api.data.shiftModels.get(id);
				if (shiftModel) {
					this.showShiftModelDetails(shiftModel);
				}
				break;
			case 'member':
				const member = this.api.data.members.get(id);
				if (member) {
					this.showMemberDetails(member);
				}
				break;
			default:

		}
	}

	private ngUnsubscribe : Subject<void> = new Subject<void>();

	public ngOnDestroy() : void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	/**
	 * Open shiftModel form
	 */
	private showShiftModelDetails(shiftModel : SchedulingApiShiftModel) : void {
		this.pRouterService.navigate([`/client/shiftmodel/${shiftModel.id.toString()}`]);
	}

	/**
	 * Show details for specific member
	 */
	private showMemberDetails(member : SchedulingApiMember) : void {
		this.pRouterService.navigate([`/client/member/${member.id.toString()}`]);
	}

	/**
	 * Determine if this shift is selectable
	 */
	private shiftIsSelectable(shift : SchedulingApiShift) : boolean {
		if (!this.schedulingService.wishPickerMode) {
			return true;
		}
		const process = this.api.data.assignmentProcesses.getByShiftId(shift.id);
		if (
			process &&
			process.state === SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES
		) {
			return shift.assignableMembers.containsMemberId(this.meService.data.id);
		}
		return false;
	}

	private _shiftsForCalendar : Data<SchedulingApiShifts> = new Data<SchedulingApiShifts>(
		this.api, this.filterService, this.schedulingFilterService,
	);

	/**
	 * Get all shifts for calendar that are visible by the current filter settings.
	 */
	public get shiftsForCalendar() : SchedulingApiShifts {
		return this._shiftsForCalendar.get(() => {
			const filteredItems = this.api.data.shifts.filterBy((shift) => {
				return this.filterService.isVisible(shift);
			});
			const result = filteredItems.sort(sortShiftsForListViewFns, false);

			return result as SchedulingApiShifts;
		});
	}

	private _absencesForCalendar : Data<ApiListWrapper<SchedulingApiAbsence>> = new Data<ApiListWrapper<SchedulingApiAbsence>>(
		this.api, this.filterService, this.schedulingFilterService,
	);

	/**
	 * Get all absences for calendar
	 */
	public get absencesForCalendar() : SchedulingApiAbsences {
		return this._absencesForCalendar.get(() => {
			return this.api.data.absences.filterBy((absence) => {
				return this.filterService.isVisible(absence);
			});
		}).sortedBy([
			(item) => {
				try {
					return item.time.end;
				} catch (error) {
					// PLANO-FE-4N4
					this.console.error(error);
					return null;
				}
			},
			(item) => item.time.start,
		], false) as SchedulingApiAbsences;
	}

	private _holidaysForCalendar : Data<SchedulingApiHolidays> = new Data<SchedulingApiHolidays>(
		this.api, this.filterService, this.schedulingFilterService,
	);

	/**
	 * Get all holidays for calendar
	 */
	public get holidaysForCalendar() : SchedulingApiHolidays {
		return this._holidaysForCalendar.get(() => {
			const result = this.api.data.holidays.filterBy((holiday) => {
				return this.filterService.isVisible(holiday);
			});
			return result.sortedBy([
				(item) => {
					try {
						return item.time.end;
					} catch (error) {
						// PLANO-FE-4N4
						this.console.error(error);
						return null;
					}
				},
				(item) => item.time.start,
			], false) as SchedulingApiHolidays;
		});
	}

	/**
	 * Get list of birthdays of members in a p-calendar consumable way.
	 */
	public get birthdaysForCalendar() : SchedulingApiBirthdays {
		return this.birthdayService.birthdays;
	}

	/**
	 * handle dayClick of calendar
	 */
	public onDayClick(timestamp : number) : void {
		this.pRouterService.navigate([`/client/scheduling/${this.schedulingService.urlParam!.calendarMode}/${timestamp}`]);
	}

	/**
	 * handle shiftClick of calendar
	 */
	public onShiftSelect(input : {
		shift : SchedulingApiShift,
		event : MouseEvent,
	}) : void {
		input.event.stopPropagation();
		if (Config.IS_MOBILE) {
			this.openShiftItem(input);
		}
	}

	/**
	 * Close tooltip if any and open details of shift
	 */
	private openShiftItem(input : {
		shift : SchedulingApiShift,
		event : MouseEvent,
		openTab ?: ShiftAndShiftModelFormTabs,
	}) : void {
		input.event.stopPropagation();
		this.highlightService.setHighlighted(null);
		let url = `/client/shift/${input.shift.id.toUrl()}`;
		const openTab : string | undefined = input.openTab ?? undefined;
		if (openTab) url += `/${openTab}`;
		this.pRouterService.navigate([url]);
	}

	/**
	 * Select all shifts that have the same weekday as the given timestamp
	 */
	public selectAllShiftsOfThisWeekday(timestamp : number) : void {
		const shifts = this.shiftsForCalendar.filterBy((shift) => {
			if (this.pMomentService.m(shift.start).isoWeekday() === this.pMomentService.m(timestamp).isoWeekday()) return true;
			return false;
		}).filterBy((shift) => {
			return this.shiftIsSelectable(shift);
		});

		if (shifts.length === shifts.selectedItems.length) {
			shifts.setSelected(false);
		} else {
			shifts.setSelected();
		}
	}

	/**
	 * Navigate to a new date
	 */
	public onChangeDate(input : number) : void {
		this.api.deselectAllSelections();
		this.pRouterService.navigate([`/client/scheduling/${this.schedulingService.urlParam!.calendarMode}/${input}`]);
	}

	/**
	 * Navigate to a new calendarMode
	 */
	public onChangeMode(mode : CalendarModes) : void {
		this.api.deselectAllSelections();
		this.highlightService.setHighlighted(null);
		this.pRouterService.navigate([`/client/scheduling/${mode}/${this.schedulingService.urlParam!.date}`]);
	}

	/**
	 * Toggle show as List
	 */
	public onChangeShowDayAsList(newValue : boolean) : void {
		this.schedulingService.showDayAsList = newValue;
		this.api.data.shifts.setSelected(false);
	}

	/**
	 * Toggle show as List
	 */
	public onChangeShowWeekAsList(newValue : boolean) : void {
		this.schedulingService.showWeekAsList = newValue;
		this.api.data.shifts.setSelected(false);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public selectRelatedShifts(triggerItem : SchedulingApiShiftModel | SchedulingApiMember) : void {
		let shifts : SchedulingApiShifts;

		if (this.schedulingService.wishPickerMode) {
			shifts = this.shiftsForCalendar.filterBy(shift => {
				if (!this.filterService.isVisible(shift)) return false;

				// only select items that are selectable
				if (!shift.assignableMembers.contains(this.meService.data.id)) return false;

				const process = this.api.data.assignmentProcesses.getByShiftId(shift.id);
				if (process && process.state === SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES) {
					if (!process.onlyAskPrefsForUnassignedShifts) return true;
					if (shift.emptyMemberSlots) return true;
					return false;
				}
				return false;
			}).filterBy(shift => {
				return this.shiftIsSelectable(shift);
			});
		} else {
			shifts = this.shiftsForCalendar.filterBy(shift => {
				return this.filterService.isVisible(shift);
			}).filterBy(shift => {
				return this.shiftIsSelectable(shift);
			});
		}

		shifts.toggleSelectionByItem(triggerItem);

		const firstSelectedShift = shifts.sortedBy('start', false).find(item => item.selected);
		if (firstSelectedShift && !firstSelectedShift.isNewItem()) this.pRouterService.scrollToSelector(
			`#scroll-target-id-${firstSelectedShift.id.toPrettyString()}` as ScrollTarget,
			undefined,
			true,
			true,
			false,
		);
		shifts.first?.id.toPrettyString();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get itemsFilterTitle() : string {
		return this.localize.transform('Ausgeblendete Schichten: ${counter} von ${amount}', {
			counter: (this.api.data.shifts.length - this.shiftsForCalendar.length).toString(),
			amount: this.api.data.shifts.length.toString(),
		});
	}
}
