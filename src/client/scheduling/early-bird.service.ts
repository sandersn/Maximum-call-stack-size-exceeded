import { Injectable } from '@angular/core';
import { SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { SchedulingApiService } from './shared/api/scheduling-api.service';

@Injectable()
export class EarlyBirdService {
	constructor(
		public api : SchedulingApiService,
	) {
	}

	/**
	 * Get the amouot of available seats for logged in member of all time and all processes.
	 * Returns undefined if there is no process in EARLY_BIRD_SCHEDULING state.
	 */
	public get freeEarlyBirdSeatsCount() : number | undefined {
		if (!this.api.isLoaded()) return undefined;
		const assignmentProcesses = this.api.data.assignmentProcesses.filterBy((process) => {
			return process.state === SchedulingApiAssignmentProcessState.EARLY_BIRD_SCHEDULING;
		});
		if (!assignmentProcesses.length) { return undefined; }

		let result = 0;
		for (const assignmentProcess of assignmentProcesses.iterable()) {
			result += assignmentProcess.todoShiftsCountCurrentView;
			result += assignmentProcess.todoShiftsCountRightView;
			result += assignmentProcess.todoShiftsCountLeftView;
		}
		return result;
	}
}
