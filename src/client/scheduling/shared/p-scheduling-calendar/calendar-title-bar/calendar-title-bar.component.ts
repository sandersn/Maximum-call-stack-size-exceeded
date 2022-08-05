
import { HttpParams } from '@angular/common/http';
import { TemplateRef } from '@angular/core';
import { Component, EventEmitter, Output, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { CourseFilterService } from '@plano/client/scheduling/course-filter.service';
import { EarlyBirdService } from '@plano/client/scheduling/early-bird.service';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { PWishesService } from '@plano/client/scheduling/wishes.service';
import { ToastsService } from '@plano/client/service/toasts.service';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { FilterService } from '@plano/client/shared/filter.service';
import { PExportService } from '@plano/client/shared/p-export.service';
import { DropdownTypeEnum } from '@plano/client/shared/p-forms/p-dropdown/p-dropdown.component';
import { PInputDateComponent } from '@plano/client/shared/p-forms/p-input-date/p-input-date.component';
import { PMoment } from '@plano/client/shared/p-moment.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiMemo } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { ExportShiftsExcelApiService } from '@plano/shared/api';
import { SchedulingApiService, SchedulingApiShifts } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PPushNotificationsService, PRequestWebPushNotificationPermissionContext } from '@plano/shared/core/p-push-notifications.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '../../../../../shared/core/router.service';
import { ScrollTarget } from '../../../../../shared/core/router.service';
import { TextToHtmlService } from '../../text-to-html.service';

@Component({
	selector: 'p-calendar-title-bar[selectedDate]',
	templateUrl: './calendar-title-bar.component.html',
	styleUrls: ['./calendar-title-bar.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class CalendarTitleBarComponent {
	private now ! : number;

	public states : typeof SchedulingApiAssignmentProcessState = SchedulingApiAssignmentProcessState;

	@Input() public selectedDate ! : number;
	@Output() public selectedDateChange : EventEmitter<number> = new EventEmitter<number>();

	@Input() public calendarMode : CalendarModes | null = CalendarModes.DAY;
	public config : typeof Config = Config;

	@ViewChild('inputDateRef', { static: true }) private inputDateRef ! : PInputDateComponent;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public inputDateClick(event : Event) : void {
		this.inputDateRef.editDate(event);
	}

	constructor(
		public api : SchedulingApiService,
		private meService : MeService,
		private toastsService : ToastsService,
		private router : Router,
		private filterService : FilterService,
		public courseService : CourseFilterService,
		private exportShiftsExcelApi : ExportShiftsExcelApiService,
		public schedulingService : SchedulingService,
		private textToHtmlService : TextToHtmlService,
		private pWishesService : PWishesService,
		private earlyBirdService : EarlyBirdService,
		private modalService : ModalService,
		public rightsService : RightsService,
		private pPushNotificationsService : PPushNotificationsService,
		private pRouterService : PRouterService,
		private localize : LocalizePipe,
		private pMoment : PMomentService,
		private pExport : PExportService,
	) {
		this.now = +this.pMoment.m().startOf('day');
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public BootstrapSize = BootstrapSize;
	public PThemeEnum = PThemeEnum;
	public PBtnThemeEnum = PBtnThemeEnum;
	public DropdownTypeEnum = DropdownTypeEnum;


	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showMemoOfTodayBar() : boolean {
		return this.calendarMode === CalendarModes.DAY && this.api.isLoaded() && !!this.memoOfToday && !!this.memoOfToday.message;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onStickyNoteClick(modalContent : TemplateRef<unknown>) : void {
		if (this.calendarMode !== CalendarModes.DAY) return;
		this.editMemo(modalContent);
	}

	/**
	 * Check if user is allowed to write at least one shiftModel
	 */
	public get canWriteAnyShiftModel() : boolean | undefined {
		return this.rightsService.userCanWriteAnyShiftModel;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get userCanManageBookings() : boolean {
		return this.rightsService.userCanManageBookings;
	}

	/**
	 * Open form with the details of a shift
	 */
	public showShiftDetails() : void {
		this.router.navigate([`/client/shift/create/start/${this.selectedDate}`]);
	}

	/**
	 * Open form with the details of a absence
	 */
	public showAbsenceDetails() : void {
		this.router.navigate(['/client/absence/0']);
	}

	/**
	 * Open form with the details of a booking
	 */
	public showBookingDetails() : void {
		this.router.navigate(['/client/booking/create/']);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showMemoOfTodayButton() : boolean {
		if (this.calendarMode !== CalendarModes.DAY) return false;
		if (!this.api.isLoaded()) return false;
		if (!this.rightsService.isOwner) return false;

		// Not enough space on mobile
		// if (Config.IS_MOBILE) return false;

		if (this.memoOfToday?.message) return false;

		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get memoOfTodayButtonText() : string | undefined {
		if (!this.api.isLoaded()) return undefined;
		if (!this.rightsService.isOwner) return undefined;

		// Not enough space on mobile
		if (Config.IS_MOBILE) return undefined;

		if (this.memoOfToday?.message) return undefined;
		return this.localize.transform('Hinzufügen');
	}

	/**
	 * Get memo for this day
	 */
	public get memoOfToday() : SchedulingApiMemo | null {
		return this.api.data.memos.getByDay(this.selectedDate);
	}

	/**
	 * Turn the text into html [and crop it if wanted]
	 */
	public textToHtml(text : string) : string {
		return this.textToHtmlService.textToHtml(text, false, 1, false);
	}

	/**
	 * Check if given timestamp is today
	 */
	public dateIsToday(timestamp : number) : boolean {
		return this.pMoment.m(timestamp).isSame(this.now, 'day');
	}

	/**
	 * is the api currently loading?
	 */
	public get isApiLoading() : boolean {
		return this.api.isLoadOperationRunning;
	}

	/**
	 * Export for people who like microsoft more than us...
	 */
	public exportIsRunning = false;
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public exportShifts() : void {
		// set shifts to be exported
		this.exportShiftsExcelApi.setEmptyData();

		for (const item of this.api.data.shifts.iterable()) {
			if (this.filterService.isVisible(item)) {
				this.exportShiftsExcelApi.data.shiftIds.createNewItem(item.id);
			}
		}

		// set members to be exported
		for (const member of this.api.data.members.iterable()) {
			if (this.filterService.isVisible(member))
				this.exportShiftsExcelApi.data.memberIds.push(member.id);
		}
		// set shiftModel to be exported
		for (const shiftModel of this.api.data.shiftModels.iterable()) {
			if (this.filterService.isVisible(shiftModel))
				this.exportShiftsExcelApi.data.shiftModelIds.push(shiftModel.id);
		}

		// get query parameters
		const queryParams = new HttpParams()
			.set('start', (this.schedulingService.shiftsStart).toString())
			.set('end', (this.schedulingService.shiftsEnd).toString());

		// cSpell:ignore kalenderexport
		const fileName = this.pExport.getFileName(this.localize.transform('kalenderexport'), this.schedulingService.shiftsStart, this.schedulingService.shiftsEnd - 1);

		// download file
		this.exportIsRunning = true;
		this.exportShiftsExcelApi.downloadFile(fileName, 'xlsx', queryParams, 'PUT', () => {
			this.exportIsRunning = false;
		});
	}

	/**
	 * Sends evaluation report to the user.
	 */
	public evaluateShiftPlan() : void {
		this.toastsService.addToast({
			content: this.localize.transform('Das Ergebnis der Überprüfung wird dir per Email zugeschickt an: <strong>${email}</strong>', {
				email: this.meService.data.email,
			}),
			theme: PThemeEnum.SUCCESS,
		});
		this.api.data.evaluation.generate = true;
		this.api.save();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public stopMode() : void {
		if (this.api.isLoaded()) {
			this.api.data.shifts.setSelected(false);
		}
		if (this.config.IS_MOBILE) {
			this.filterService.showOnlyEarlyBirdAssignmentProcesses(false);
		}
		this.schedulingService.earlyBirdMode = false;
		this.askForNotificationPermissionIfNecessary();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public toggleWishPickerMode() : void {
		if (this.api.isLoaded()) {
			this.api.data.shifts.setSelected(false);
		}
		if (this.config.IS_MOBILE) {
			this.filterService.showOnlyEarlyBirdAssignmentProcesses(false);
			this.filterService.showOnlyWishPickerAssignmentProcesses(!this.schedulingService.wishPickerMode);
		}
		this.schedulingService.wishPickerMode = !this.schedulingService.wishPickerMode;
		const shiftsWithNoPrefs = this.api.data.shifts.filterBy((item : {
			id : SchedulingApiShift['id'],
			assignableMembers : SchedulingApiShift['assignableMembers'],
			myPref : SchedulingApiShift['myPref']
		}) => {
			const process = this.api.data.assignmentProcesses.getByShiftId(item.id);
			if (!process) return false;
			if (process.state !== SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES) return false;
			if (!item.assignableMembers.containsMemberId(this.meService.data.id)) return false;
			return item.myPref === null;
		});

		const firstSelectedShift = shiftsWithNoPrefs.sortedBy('start', false).first;
		if (firstSelectedShift && !firstSelectedShift.isNewItem()) this.pRouterService.scrollToSelector(
			`#scroll-target-id-${firstSelectedShift.id.toPrettyString()}` as ScrollTarget,
			undefined,
			true,
			true,
			false,
		);

	}

	private askForNotificationPermissionIfNecessary() : void {
		this.pPushNotificationsService.requestWebPushNotificationPermission(
			PRequestWebPushNotificationPermissionContext.CLOSED_UI_EARLY_BIRD_MODE,
		);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public toggleEarlyBirdMode() : void {
		if (this.api.isLoaded()) {
			this.api.data.shifts.setSelected(false);
		}
		if (this.config.IS_MOBILE) {
			this.filterService.showOnlyWishPickerAssignmentProcesses(false);
			this.filterService.showOnlyEarlyBirdAssignmentProcesses(
				!this.schedulingService.earlyBirdMode,
			);
		}
		this.schedulingService.earlyBirdMode = !this.schedulingService.earlyBirdMode;

		const shifts = this.api.data.shifts.filterBy((item) => this.showAssignMeButton(item));
		const firstSelectedShift = shifts.sortedBy('start', false).first;
		if (firstSelectedShift && !firstSelectedShift.isNewItem()) this.pRouterService.scrollToSelector(
			`#scroll-target-id-${firstSelectedShift.id.toPrettyString()}` as ScrollTarget,
			undefined,
			true,
			true,
			false,
		);
	}

	/**
	 * Is the current user allowed to be assigned? Is the related process an early bird thing etc.
	 */
	public showAssignMeButton(item : SchedulingApiShift) : boolean {
		// Is not in assign-me-mode?
		if (!this.schedulingService.earlyBirdMode) return false;

		const process = this.api.data.assignmentProcesses.getByShiftId(item.id);

		// backend decides if user can pick wish
		return process?.shiftRefs.get(item.id)?.requesterCanDoEarlyBird === true || false;
	}

	/**
	 * Get the amount of free wishes of all time and all processes.
	 * Returns undefined if there is no process in ASKING_MEMBER_PREFERENCES state.
	 */
	public get freeWishesCount() : number | undefined {
		return this.pWishesService.freeWishesCount;
	}

	/**
	 * Get the amount of available seats for logged in member of all time and all processes.
	 * Returns undefined if there is no process in EARLY_BIRD_SCHEDULING state.
	 */
	public get freeEarlyBirdSeatsCount() : number | undefined {
		return this.earlyBirdService.freeEarlyBirdSeatsCount;
	}

	/**
	 * Space in this title-bar is rare if a lot of buttons, sidebars and stuff like this is visible.
	 */
	public get spaceIsRare() : boolean {
		if (this.config.IS_MOBILE) return true;
		if (this.courseService.bookingsVisible) return true;
		if (this.api.hasSelectedItems) return true;
		return false;
	}

	/**
	 * Open form for changing the memo content
	 */
	public editMemo(modalContent : TemplateRef<unknown>) : void {
		this.api.createDataCopy();
		this.modalService.openModal(modalContent, {
			success: () => {
				this.api.mergeDataCopy();
				if (!this.memoOfToday!.message.length) this.removeEditableMemo(this.memoOfToday!);

				// HACK: Sometimes there are memos without a message. i don’t know why. ¯\_(ツ)_/¯
				for (const item of this.api.data.memos.iterable()) {
					if (item.message.length) continue;
					this.api.data.memos.removeItem(item);
				}

				this.api.save();
			},
			dismiss: () => {
				this.api.dismissDataCopy();
				if (this.memoOfToday?.isNewItem()) {
					this.removeEditableMemo(this.memoOfToday);
					this.api.save();
				}
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

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get memoModalDefaultDate() : number | undefined {
		if (this.calendarMode !== CalendarModes.DAY) return undefined;
		return this.selectedDate;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get memoDatepickerMin() : number {
		return +this.pMoment.m(this.selectedDate).startOf(this.calendarMode);
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get memoDatepickerMax() : number {
		return +this.pMoment.m(this.selectedDate).endOf(this.calendarMode);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftsForCommentsModal() : SchedulingApiShifts {
		if (!this.memoModalDefaultDate || !this.api.isLoaded()) return new SchedulingApiShifts(null, false);
		return this.api.data.shifts.filterBy(item => !!item.description);
	}

	/**
	 * Navigate to next day|week|month…
	 */
	public navTo(input : number) : void {
		const goal = this.pMoment.m(input);
		this.selectedDateChange.emit(this.cleanUpUrlTimestamp(goal));
	}

	private cleanUpUrlTimestamp(input : PMoment.Moment) : number {
		if (!input.isSame(this.now, this.calendarMode)) return +input.startOf(this.calendarMode);
		return +this.pMoment.m(this.now).startOf('day');
	}
}
