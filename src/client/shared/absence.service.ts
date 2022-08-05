import { Injectable } from '@angular/core';
import { ShiftId } from '@plano/shared/api';
import { SchedulingApiAbsenceType, SchedulingApiShiftExchangeState } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../shared/core/null-type-utils';
import { SchedulingApiService, SchedulingApiAbsences, SchedulingApiShift } from '../scheduling/shared/api/scheduling-api.service';
import { SchedulingApiAbsence } from '../scheduling/shared/api/scheduling-api.service';

@Injectable()
export class AbsenceService {

	constructor(private api : SchedulingApiService) {
	}

	/**
	 * Check if member has absences at that time.
	 */
	private absencesForMember(
		memberId : Id,
		start : number,
		_end : number,
	) : SchedulingApiAbsences {
		if (!start) return new SchedulingApiAbsences(null, false);
		const end = !!_end ? _end : start;
		return this.api.data.absences.filterBy((item) => {
			if (!item.memberId.equals(memberId)) return false;
			if (item.time.start >= end) return false;
			if (item.time.end <= start) return false;
			return true;
		});
	}

	/**
	 * Get absences in that time range
	 */
	public overlappingAbsences(
		memberId : Id,
		inputElement : {
			start : number,
			end ?: number,
		},
	) : SchedulingApiAbsences {
		const start = inputElement.start;
		const end = !!inputElement.end ? inputElement.end : start;
		return this.absencesForMember(memberId, start, end);
	}

	/**
	 * Get absence icon for member and time range
	 */
	public absenceType(
		memberId : Id,
		inputElement : {
			start : number,
			end ?: number,
			id ?: ShiftId | null,
		} | null = null,
	) : SchedulingApiAbsenceType | undefined {
		if (inputElement === null) return undefined;
		if (inputElement.id instanceof ShiftId && this.hasConfirmedIllnessShiftExchange(inputElement.id, memberId)) {
			return SchedulingApiAbsenceType.ILLNESS;
		}

		const absences = this.overlappingAbsences(memberId, inputElement);
		assumeDefinedToGetStrictNullChecksRunning(absences, 'absences', 'Could not find absences');
		if (absences.length === 0) return undefined;
		const firstItem = absences.get(0);
		if (!firstItem) throw new Error('Could not find firstItem');
		return firstItem.type;
	}

	/**
	 * Get absence icon for member and time range
	 */
	public absenceTypeIconName(
		memberId : Id,
		inputElement : {
			start : number,
			end ?: number,
			id ?: ShiftId | null,
		},
	) : SchedulingApiAbsence['typeIconName'] | null {
		// eslint-disable-next-line sonarjs/no-small-switch
		switch (this.absenceType(memberId, inputElement)) {
			case SchedulingApiAbsenceType.ILLNESS:
				return 'briefcase-medical';
			default:
				const absences = this.overlappingAbsences(memberId, inputElement);
				assumeDefinedToGetStrictNullChecksRunning(absences, 'absences', 'Could not find absences');
				if (absences.length === 0) return null;
				const firstItem = absences.get(0);
				if (!firstItem) throw new Error('Could not find firstItem');
				return firstItem.typeIconName;
		}
	}

	/**
	 * Has illness at that time range
	 */
	public hasOverlappingIllness(
		memberId : Id,
		inputElement : {
			start : number,
			end ?: number,
		} | SchedulingApiShift,
	) : boolean {
		const absences = this.overlappingAbsences(memberId, inputElement);
		assumeDefinedToGetStrictNullChecksRunning(absences, 'absences', 'Could not find absences');
		for (const absence of absences.iterable()) {
			if (absence.type === SchedulingApiAbsenceType.ILLNESS) return true;
		}

		if (inputElement instanceof SchedulingApiShift && this.hasConfirmedIllnessShiftExchange(inputElement.id, memberId)) {
			return true;
		}

		return false;
	}

	private hasConfirmedIllnessShiftExchange(shiftId : ShiftId, memberId : Id) : boolean {
		// Is there a confirmed illness-shiftExchange for this shift?
		// NOTE: When user has a confirmed illness, then he is not assigned to the shift anymore.
		// NOTE: ...so this case only happens when the confirmed user gets assigned again.
		const shiftExchange = this.api.data.shiftExchanges.getByShiftAndMember(shiftId, memberId);
		if (!shiftExchange) return false;
		if (!shiftExchange.isIllness) return false;

		if (shiftExchange.state === SchedulingApiShiftExchangeState.ILLNESS_NEEDS_CONFIRMATION) return false;
		if (shiftExchange.state === SchedulingApiShiftExchangeState.ILLNESS_DECLINED) return false;
		if (shiftExchange.state === SchedulingApiShiftExchangeState.CLOSED_MANUALLY) return false;
		return true;
	}
}
