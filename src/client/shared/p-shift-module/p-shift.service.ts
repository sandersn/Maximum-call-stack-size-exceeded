
import { Injectable } from '@angular/core';
import { SchedulingApiShift, SchedulingApiShiftModel } from '@plano/shared/api';
import { SchedulingApiCourseType } from '@plano/shared/api';

@Injectable()
export class PShiftService {
	constructor(
	) {
	}

	/**
	 * Calculate color
	 */
	public participantsCountStyle(
		{
			isCourseCanceled,
			maxCourseParticipantCount,
			currentCourseParticipantCount,
			minCourseParticipantCount,
		} : Pick<SchedulingApiShift, 'isCourseCanceled' | 'maxCourseParticipantCount' | 'currentCourseParticipantCount' | 'minCourseParticipantCount'>,
		{
			courseType,
			onlyWholeCourseBookable,
		} : Pick<SchedulingApiShiftModel, 'courseType' | 'onlyWholeCourseBookable'>,
	) : string {
		if (courseType === SchedulingApiCourseType.NO_BOOKING) return 'success';
		if (isCourseCanceled) return 'danger';

		if (
			maxCourseParticipantCount !== null &&
			currentCourseParticipantCount > maxCourseParticipantCount
		) {
			// Is over max
			return 'danger';
		}
		// fully booked but not over max
		if (this.isCourseFullyBooked({
			maxCourseParticipantCount: maxCourseParticipantCount,
			currentCourseParticipantCount: currentCourseParticipantCount,
			onlyWholeCourseBookable: onlyWholeCourseBookable,
		})) return 'success';

		if (maxCourseParticipantCount === null && currentCourseParticipantCount < minCourseParticipantCount) {
			// No max and currentCourseParticipantCount under min.
			return 'danger';
		}

		// Is under min
		if (currentCourseParticipantCount < minCourseParticipantCount) return 'danger';

		// Is exactly max
		if (currentCourseParticipantCount === maxCourseParticipantCount) return 'success';

		// Other
		return 'warning';
	}

	private isCourseFullyBooked(
		{
			maxCourseParticipantCount,
			currentCourseParticipantCount,
			onlyWholeCourseBookable,
		} : {
			maxCourseParticipantCount : SchedulingApiShift['maxCourseParticipantCount'],
			currentCourseParticipantCount : SchedulingApiShift['currentCourseParticipantCount'],
			onlyWholeCourseBookable : SchedulingApiShiftModel['onlyWholeCourseBookable'],
		},
	) : boolean {
		if (currentCourseParticipantCount > 0 && onlyWholeCourseBookable) return true;
		if (
			maxCourseParticipantCount &&
			currentCourseParticipantCount >= maxCourseParticipantCount
		) return true;
		return false;
	}
}
