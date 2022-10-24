import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { SchedulingApiCourseType } from '@plano/shared/api';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PShiftService } from '../p-shift.service';
let PCourseInfoComponent = class PCourseInfoComponent {
    constructor(pShiftService, localize) {
        this.pShiftService = pShiftService;
        this.localize = localize;
        this.readMode = false;
        this.isCourse = null;
        this.courseType = null;
        this.onlyWholeCourseBookable = null;
        this.isCourseOnline = null;
        this.isCourseCanceled = null;
        this.minCourseParticipantCount = null;
        this.currentCourseParticipantCount = null;
        this.maxCourseParticipantCount = null;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.BootstrapSize = BootstrapSize;
    }
    get courseStateInfoText() {
        if (this.isCourseCanceled)
            return this.localize.transform('Angebot fällt aus');
        if (this.isOpenCourse)
            return this.localize.transform('Offenes Angebot – benötigt keine Buchungen');
        // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
        return `${this.localize.transform('Mindestens')}: ${this.minCourseParticipantCount} | ${this.localize.transform('Gebucht')}: ${this.currentCourseParticipantCount} | ${this.localize.transform('Maximal')}: ${this.maxCourseParticipantCount ? this.maxCourseParticipantCount : '∞'}`;
    }
    get ledStateInfoText() {
        if (this.ledOff)
            return `× ${this.localize.transform('Angebot ist online nicht sichtbar')}`;
        return `✓ ${this.localize.transform('Angebot ist online sichtbar')}`;
    }
    get _title() {
        return `${this.courseStateInfoText} | ${this.ledStateInfoText}`;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get ledOff() {
        return !this.isCourseOnline;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isOpenCourse() {
        return this.courseType === SchedulingApiCourseType.NO_BOOKING;
    }
    /**
     * Calculate color
     */
    get participantsCountStyle() {
        return this.pShiftService.participantsCountStyle({
            currentCourseParticipantCount: this.currentCourseParticipantCount,
            isCourseCanceled: this.isCourseCanceled,
            maxCourseParticipantCount: this.maxCourseParticipantCount,
            minCourseParticipantCount: this.minCourseParticipantCount,
        }, {
            courseType: this.courseType,
            onlyWholeCourseBookable: this.onlyWholeCourseBookable,
        });
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PCourseInfoComponent.prototype, "readMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PCourseInfoComponent.prototype, "isCourse", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PCourseInfoComponent.prototype, "courseType", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PCourseInfoComponent.prototype, "onlyWholeCourseBookable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PCourseInfoComponent.prototype, "isCourseOnline", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PCourseInfoComponent.prototype, "isCourseCanceled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PCourseInfoComponent.prototype, "minCourseParticipantCount", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PCourseInfoComponent.prototype, "currentCourseParticipantCount", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PCourseInfoComponent.prototype, "maxCourseParticipantCount", void 0);
__decorate([
    HostBinding('title'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], PCourseInfoComponent.prototype, "_title", null);
PCourseInfoComponent = __decorate([
    Component({
        selector: 'p-course-info',
        templateUrl: './p-course-info.component.html',
        styleUrls: ['./p-course-info.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [PShiftService,
        LocalizePipe])
], PCourseInfoComponent);
export { PCourseInfoComponent };
//# sourceMappingURL=p-course-info.component.js.map