import { Injectable } from '@angular/core';
import { FilterService } from '@plano/client/shared/filter.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { RightsService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { ThreeParameterData } from '@plano/shared/core/data/three-parameter-data';
import { SchedulingService } from '../../scheduling.service';
import { SchedulingApiShifts, SchedulingApiService } from '../api/scheduling-api.service';

@Injectable()
export class PCalendarService {
	constructor(
		public api : SchedulingApiService,
		private meService : MeService,
		private schedulingService : SchedulingService,
		private filterService : FilterService,
		private rightsService : RightsService,
		private pMoment : PMomentService,
	) {
	}

	/**
	 * Check if there is a memo for given day or a shift-description for the current user for the shifts of the given day.
	 */
	public hasImportantNoteForDay(startOfDay ?: number, onlyForUser : boolean = true) : boolean | undefined {
		// If no startOfDay is defined, today will be checked.

		if (!this.api.isLoaded()) return undefined;

		// Has comment for the day?
		// eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
		const memo = this.api.data.memos.getByDay(startOfDay ? startOfDay : +this.pMoment.m().startOf('day'));
		if (memo?.message) return true;

		const hasImportantShiftDescriptions = this.shiftsOfDayHaveDescriptions(startOfDay, {
			onlyForUser : onlyForUser,
			onlyIfNotInAProcess : !this.rightsService.userCanEditAssignmentProcesses,
		});

		if (hasImportantShiftDescriptions) return true;
		return false;
	}

	private _shiftsOfDayHaveDescriptions : ThreeParameterData<boolean, number, boolean, boolean> =
		new ThreeParameterData<boolean, number, boolean, boolean>(this.api, this.filterService);

	/**
	 * Check if shiftsOfDay have any descriptions
	 */
	public shiftsOfDayHaveDescriptions(startOfDay : number | undefined, input : {
		onlyForUser ?: boolean,
		onlyIfNotInAProcess ?: boolean,
	} = {}) : boolean | null {
		// If no startOfDay is defined, today will be checked.
		if (!this.meService.isLoaded()) return null;
		if (startOfDay === undefined) {
			if (this.api.data.todaysShiftDescriptions.findBy((item) => {
				return !input.onlyForUser || item.isRequesterAssigned;
			})) return true;
			return false;
		}

		input.onlyForUser = input.onlyForUser !== undefined ? input.onlyForUser : false;
		input.onlyIfNotInAProcess = !!input.onlyIfNotInAProcess;

		return this._shiftsOfDayHaveDescriptions.get(startOfDay, input.onlyForUser, input.onlyIfNotInAProcess,
			() : boolean => {
				if (!startOfDay) return false;

				const shifts = this.shiftsOfDay(startOfDay);
				if (!shifts.length) return false;

				let shiftsToCheck : SchedulingApiShifts;
				if (input.onlyForUser) {
					if (!this.meService.isLoaded()) return false;
					shiftsToCheck = shifts.filterBy((item) => item.assignedMemberIds.contains(this.meService.data.id));
				} else {
					shiftsToCheck = shifts;
				}

				const assignmentProcesses = this.api.data.assignmentProcesses;
				for (const shift of shiftsToCheck.filterBy((item) => !!item.description).iterable()) {
					if (!input.onlyIfNotInAProcess || !assignmentProcesses.getByShiftId(shift.id)) {
						return true;
					}
				}
				return false;
			});
	}

	/**
	 * Get all shifts if a day
	 */
	private shiftsOfDay(day ?: number) : SchedulingApiShifts {
		const timestamp = day ?? this.schedulingService.urlParam!.date!;
		if (!this.api.isLoaded()) return new SchedulingApiShifts(null, false);
		if (!this.schedulingService.urlParam!.date) return new SchedulingApiShifts(null, false);

		// TODO: This should be replaced by ???
		const filteredShifts = this.api.data.shifts.filterByFilterService(this.filterService);

		return filteredShifts.getByDay(timestamp);
	}
}
