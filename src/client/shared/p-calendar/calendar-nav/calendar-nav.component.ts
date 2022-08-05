import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { PMoment } from '@plano/client/shared/p-moment.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiAssignmentProcesses } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { PThemeEnum, PBtnThemeEnum } from '../../bootstrap-styles.enum';
import { PFormControlComponentInterface } from '../../p-forms/p-form-control.interface';


@Component({
	selector: 'p-calendar-nav[calendarMode][selectedDate]',
	templateUrl: './calendar-nav.component.html',
	styleUrls: ['./calendar-nav.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class CalendarNavComponent {
	@HostBinding('class.d-flex')
	@HostBinding('class.justify-content-between') protected _alwaysTrue = true;

	@Input() public disabled : boolean = false;
	@Input() public hideLabels : boolean = false;
	@Input() public earlyBirdMode : boolean = false;
	@Input() public wishPickerMode : boolean = false;

	@Input() public selectedDate ! : number;
	@Output() public selectedDateChange : EventEmitter<number> = new EventEmitter();

	@Output() public onNavToToday : EventEmitter<number> = new EventEmitter();

	@Input() public calendarMode : CalendarModes | null = null;

	/**
	 * Visual size of this component.
	 * Can be useful if you have few space in a button-bar or want to have large buttons on mobile.
	 */
	@Input() public size ?: PFormControlComponentInterface['size'] = null;

	private now ! : number;
	public config : typeof Config = Config;

	constructor(
		public api : SchedulingApiService,
		private pMoment : PMomentService,
	) {
		this.now = +this.pMoment.m();
	}

	public PThemeEnum = PThemeEnum;
	public PBtnThemeEnum = PBtnThemeEnum;
	public PlanoFaIconPool = PlanoFaIconPool;

	private cleanUpUrlTimestamp(input : PMoment.Moment) : number {
		if (!input.isSame(this.now, this.calendarMode)) return +input.startOf(this.calendarMode);
		return +this.pMoment.m(this.now).startOf('day');
	}

	/**
	 * Navigate to previous day|week|month…
	 */
	public navPrev() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.calendarMode, 'this.calendarMode');
		const goal = this.pMoment.m(this.selectedDate).subtract(1, this.calendarMode);
		this.selectedDateChange.emit(this.cleanUpUrlTimestamp(goal));
	}

	/**
	 * Navigate to current day|week|month…
	 */
	public navToToday() : void {
		const day = this.pMoment.m();
		if (!this.pMoment.m(this.selectedDate).isSame(day, 'day')) {
			this.api.deselectAllSelections();
			this.selectedDateChange.emit(+day.startOf('day'));
		}
		this.onNavToToday.emit();
	}

	/**
	 * Navigate to next day|week|month…
	 */
	public navNext() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.calendarMode, 'this.calendarMode');
		const goal = this.pMoment.m(this.selectedDate).add(1, this.calendarMode);
		this.selectedDateChange.emit(this.cleanUpUrlTimestamp(goal));
	}

	/**
	 * Navigate to next day|week|month…
	 */
	public navTo(input : number) : void {
		const goal = this.pMoment.m(input);
		this.selectedDateChange.emit(this.cleanUpUrlTimestamp(goal));
	}

	/**
	 * Check if viewDate is today
	 * Helpful for highlighting »today« buttons
	 */
	public get viewDateIsToday() : boolean {
		return this.pMoment.m(this.now).isSame(this.selectedDate, this.calendarMode);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get todoLeftView() : number | null {
		const assignmentProcesses = this.getRelevantTodoProcesses();
		if (!assignmentProcesses) { return null; }

		// return todo count
		let result = 0;
		for (const assignmentProcess of assignmentProcesses.iterable()) {
			result += assignmentProcess.todoShiftsCountLeftView;
		}
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get todoCurrentView() : number | null {
		const assignmentProcesses = this.getRelevantTodoProcesses();
		if (!assignmentProcesses) { return null; }

		// return todo count
		let result = 0;
		for (const assignmentProcess of assignmentProcesses.iterable()) {
			result += assignmentProcess.todoShiftsCountCurrentView;
		}
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get todoRightView() : number | null {
		const assignmentProcesses = this.getRelevantTodoProcesses();
		if (!assignmentProcesses) { return null; }

		// return todo count
		let result = 0;
		for (const assignmentProcess of assignmentProcesses.iterable()) {
			result += assignmentProcess.todoShiftsCountRightView;
		}
		return result;
	}

	private getRelevantTodoProcesses() : SchedulingApiAssignmentProcesses | undefined {
		// get relevant process state
		let relevantState : SchedulingApiAssignmentProcessState | undefined = undefined;

		if (this.earlyBirdMode) {
			relevantState = SchedulingApiAssignmentProcessState.EARLY_BIRD_SCHEDULING;
		}

		if (this.wishPickerMode) {
			relevantState = SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES;
		}

		if (!relevantState) return undefined;

		// get relevant processes
		const assignmentProcesses = this.api.data.assignmentProcesses.filterBy((process) => {
			return process.state === relevantState;
		});
		if (!assignmentProcesses.length) { return undefined; }

		return assignmentProcesses;
	}

	public isHighlightedFn = (input : number) : boolean => {
		return this.pMoment.m(input).isSame(this.selectedDate, this.calendarMode);
	};
}
