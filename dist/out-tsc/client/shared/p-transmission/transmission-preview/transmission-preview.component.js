var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { CalendarDateFormatter } from 'angular-calendar';
import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { SchedulingApiMembers } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { Config } from '@plano/shared/core/config';
import { CustomDateFormatter } from './custom-date-formatter.provider';
import { assumeNotUndefined } from '../../../../shared/core/null-type-utils';
import { AffectedShiftsApiShifts } from '../../api/affected-shifts-api.service';
import { BootstrapSize } from '../../bootstrap-styles.enum';
import { PMomentService } from '../../p-moment.service';
let TransmissionPreviewComponent = class TransmissionPreviewComponent {
    constructor(changeDetectorRef, pMomentService) {
        this.changeDetectorRef = changeDetectorRef;
        this.pMomentService = pMomentService;
        this.disabled = false;
        this.affectedShifts = new AffectedShiftsApiShifts(null, false);
        this.members = new SchedulingApiMembers(null, false);
        this.timestampChanged = new EventEmitter();
        this.myId = null;
        this.CONFIG = Config;
        this.viewDate = new Date();
        this._isLoading = false;
        this.CalendarModes = CalendarModes;
        this.BootstrapSize = BootstrapSize;
        this.subscriptions = [];
        this.activeDayIsOpen = false;
    }
    set timestamp(input) {
        this.viewDate = new Date(input);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get timestamp() {
        return +this.viewDate;
    }
    set isLoading(input) {
        this._isLoading = input;
        // NOTE: this.changeDetectorRef is not defined when this binding triggers the first time.
        // eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
        if (!input && this.changeDetectorRef)
            this.changeDetectorRef.detectChanges();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isLoading() {
        return this._isLoading;
    }
    ngAfterContentInit() {
        var _a;
        if ((_a = this.affectedShifts.api) === null || _a === void 0 ? void 0 : _a.onChange) {
            this.subscriptions.push(this.affectedShifts.api.onChange.subscribe(() => {
                this.events = this.getEvents();
            }));
        }
    }
    ngAfterContentChecked() {
        this.events = this.getEvents();
    }
    getAssignedMembers(ids) {
        if (!ids.length)
            return new SchedulingApiMembers(null, false);
        if (!this.members)
            throw new Error('members is not defined');
        if (!this.members.length)
            return new SchedulingApiMembers(null, false);
        return this.members.filterBy(item => ids.contains(item.id));
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    getEvents() {
        const result = [];
        for (const affectedShift of this.affectedShifts.iterable()) {
            result.push({
                title: this.shiftModel.name,
                color: {
                    primary: `#${this.shiftModel.color}`,
                    secondary: `#${this.shiftModel.color}`,
                },
                start: new Date(affectedShift.start),
                end: new Date(affectedShift.end),
                meta: {
                    isPacket: this.shiftModel.isPacket,
                    assignedMembers: this.getAssignedMembers(affectedShift.assignedMemberIds),
                    emptyMemberSlots: affectedShift.emptyMemberSlots,
                    courseType: this.shiftModel.courseType,
                    isCourse: this.shiftModel.isCourse,
                    onlyWholeCourseBookable: this.shiftModel.onlyWholeCourseBookable,
                    currentCourseParticipantCount: affectedShift.currentCourseParticipantCount,
                    isCourseOnline: affectedShift.isCourseOnline,
                    maxCourseParticipantCount: affectedShift.maxCourseParticipantCount,
                    minCourseParticipantCount: affectedShift.minCourseParticipantCount,
                },
            });
        }
        return result.sort((a, b) => (a.start > b.start ? +1 : -1));
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    beforeMonthViewRender(input) {
        for (const cell of input.body) {
            const groups = {};
            for (const event of cell.events) {
                if (!this.pMomentService.m(event.start).isSame(this.viewDate, 'month'))
                    continue;
                // Use existing array or create new one.
                assumeNotUndefined(event.color);
                if (!groups[event.color.primary]) {
                    groups[event.color.primary] = {
                        event: [],
                        color: { primary: event.color.primary, secondary: event.color.secondary },
                        isPacket: event.meta.isPacket,
                    };
                }
                // Add an event.
                groups[event.color.primary].event.push(event);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cell['eventGroups'] = Object.entries(groups);
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    dayClicked({ date, events }) {
        if (!this.pMomentService.m(date).isSame(this.viewDate, 'month')) {
            this.activeDayIsOpen = false;
            this.onChangeDate(+date);
            return;
        }
        if (this.pMomentService.m(date).isSame(this.viewDate, 'day')) {
            // Clicked current day? => Toggle it
            this.activeDayIsOpen = events.length > 0 ? !this.activeDayIsOpen : false;
        }
        else {
            // Uncollapse if has events
            this.activeDayIsOpen = events.length > 0;
        }
        this.viewDate = date;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onChangeDate(timestamp) {
        this.activeDayIsOpen = false;
        this.viewDate = new Date(timestamp);
        this.timestampChanged.emit(timestamp);
    }
    ngOnDestroy() {
        for (const subscription of this.subscriptions)
            subscription.unsubscribe();
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], TransmissionPreviewComponent.prototype, "disabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", AffectedShiftsApiShifts)
], TransmissionPreviewComponent.prototype, "affectedShifts", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TransmissionPreviewComponent.prototype, "members", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TransmissionPreviewComponent.prototype, "shiftModel", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], TransmissionPreviewComponent.prototype, "timestampChanged", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TransmissionPreviewComponent.prototype, "myId", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [Number])
], TransmissionPreviewComponent.prototype, "timestamp", null);
__decorate([
    Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], TransmissionPreviewComponent.prototype, "isLoading", null);
TransmissionPreviewComponent = __decorate([
    Component({
        selector: 'p-transmission-preview[shiftModel]',
        templateUrl: './transmission-preview.component.html',
        styleUrls: ['./transmission-preview.component.scss'],
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.Default,
        // changeDetection: ChangeDetectionStrategy.OnPush,
        providers: [{
                provide: CalendarDateFormatter,
                useClass: CustomDateFormatter,
            }],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object, PMomentService])
], TransmissionPreviewComponent);
export { TransmissionPreviewComponent };
//# sourceMappingURL=transmission-preview.component.js.map