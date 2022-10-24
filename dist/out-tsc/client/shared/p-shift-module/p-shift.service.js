import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { SchedulingApiCourseType } from '@plano/shared/api';
let PShiftService = class PShiftService {
    constructor() {
    }
    /**
     * Calculate color
     */
    participantsCountStyle({ isCourseCanceled, maxCourseParticipantCount, currentCourseParticipantCount, minCourseParticipantCount, }, { courseType, onlyWholeCourseBookable, }) {
        if (courseType === SchedulingApiCourseType.NO_BOOKING)
            return 'success';
        if (isCourseCanceled)
            return 'danger';
        if (maxCourseParticipantCount !== null &&
            currentCourseParticipantCount > maxCourseParticipantCount) {
            // Is over max
            return 'danger';
        }
        // fully booked but not over max
        if (this.isCourseFullyBooked({
            maxCourseParticipantCount: maxCourseParticipantCount,
            currentCourseParticipantCount: currentCourseParticipantCount,
            onlyWholeCourseBookable: onlyWholeCourseBookable,
        }))
            return 'success';
        if (maxCourseParticipantCount === null && currentCourseParticipantCount < minCourseParticipantCount) {
            // No max and currentCourseParticipantCount under min.
            return 'danger';
        }
        // Is under min
        if (currentCourseParticipantCount < minCourseParticipantCount)
            return 'danger';
        // Is exactly max
        if (currentCourseParticipantCount === maxCourseParticipantCount)
            return 'success';
        // Other
        return 'warning';
    }
    isCourseFullyBooked({ maxCourseParticipantCount, currentCourseParticipantCount, onlyWholeCourseBookable, }) {
        if (currentCourseParticipantCount > 0 && onlyWholeCourseBookable)
            return true;
        if (maxCourseParticipantCount &&
            currentCourseParticipantCount >= maxCourseParticipantCount)
            return true;
        return false;
    }
};
PShiftService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], PShiftService);
export { PShiftService };
//# sourceMappingURL=p-shift.service.js.map