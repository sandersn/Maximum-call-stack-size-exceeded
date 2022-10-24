var _a, _b;
import { __decorate, __metadata } from "tslib";
import { Injectable, NgZone } from '@angular/core';
import { SchedulingApiBirthday, SchedulingApiBirthdays } from './scheduling-api-birthday.service';
import { SchedulingApiService } from './scheduling-api.service';
import { DataInput } from '../../../../shared/core/data/data-input';
import { PMomentService } from '../../../shared/p-moment.service';
let BirthdayService = class BirthdayService extends DataInput {
    constructor(zone, api, pMoment) {
        super(zone);
        this.zone = zone;
        this.api = api;
        this.pMoment = pMoment;
        this._birthdays = new SchedulingApiBirthdays(null, null, false);
    }
    /**
     * A stack of all birthdays available for this account
     */
    get birthdays() {
        if (!this.api.isLoaded())
            return new SchedulingApiBirthdays(null, null, false);
        if (this._birthdays.length === 0)
            this.addMembersFromApi();
        return this._birthdays;
    }
    addMembersFromApi() {
        const membersWithBirthdays = this.api.data.members.filterBy(item => !!item.birthday);
        if (membersWithBirthdays.length === 0)
            return;
        this.addMembersToList(membersWithBirthdays);
    }
    addMembersToList(members) {
        const birthdays = members.filterBy(item => !!item.birthday).map(item => {
            const birthday = new SchedulingApiBirthday();
            birthday.firstName = item.firstName;
            birthday.lastName = item.lastName;
            birthday.day = +this.pMoment.m(item.birthday).get('date');
            birthday.month = +this.pMoment.m(item.birthday).get('month');
            birthday.memberId = item.id;
            return birthday;
        });
        for (const birthday of birthdays) {
            this._birthdays.push(birthday);
        }
    }
    /** @see PServiceInterface['unload'] */
    unload() {
        this._birthdays = new SchedulingApiBirthdays(null, null, false);
    }
    /** @see PServiceInterface['initValues'] */
    initValues() {
    }
};
BirthdayService = __decorate([
    Injectable({ providedIn: 'root' }),
    __metadata("design:paramtypes", [typeof (_a = typeof NgZone !== "undefined" && NgZone) === "function" ? _a : Object, SchedulingApiService, typeof (_b = typeof PMomentService !== "undefined" && PMomentService) === "function" ? _b : Object])
], BirthdayService);
export { BirthdayService };
//# sourceMappingURL=birthday.service.js.map