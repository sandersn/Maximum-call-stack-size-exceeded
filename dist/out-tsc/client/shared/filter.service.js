var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Injectable, NgZone } from '@angular/core';
import { SchedulingApiService, SchedulingApiHoliday, SchedulingApiShiftModels, SchedulingApiShiftModel, SchedulingApiMember, SchedulingApiMembers, SchedulingApiShift, SchedulingApiAbsence, SchedulingApiAbsences, SchedulingApiTodaysShiftDescription } from '@plano/shared/api';
import { ApiListWrapper } from '@plano/shared/api';
import { SchedulingApiRightGroupRole } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { DataInput } from '@plano/shared/core/data/data-input';
import { LogService } from '@plano/shared/core/log.service';
import { PCookieService } from '@plano/shared/core/p-cookie.service';
import { PThemeEnum } from './bootstrap-styles.enum';
import { ClientRoutingService } from './routing.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../shared/core/null-type-utils';
import { LocalizePipe } from '../../shared/core/pipe/localize.pipe';
import { ReportFilterService } from '../report/report-filter.service';
import { SchedulingFilterService } from '../scheduling/scheduling-filter.service';
import { SchedulingApiBirthday } from '../scheduling/shared/api/scheduling-api-birthday.service';
import { SchedulingApiBooking } from '../scheduling/shared/api/scheduling-api-booking.service';
import { SchedulingApiWorkingTime } from '../scheduling/shared/api/scheduling-api-working-time.service';
import { ToastsService } from '../service/toasts.service';
/**
 * A list of cookies.
 */
export class CookieListOfDataWrappers extends ApiListWrapper {
    constructor(pCookieService, cookieData) {
        super(null, false);
        this.pCookieService = pCookieService;
        this.cookieData = cookieData;
    }
    /**
     * Get an array of the cookies
     */
    get cookieArray() {
        if (!this.pCookieService.has(this.cookieData))
            return [];
        const cookieValue = this.pCookieService.get(this.cookieData);
        const result = JSON.parse(cookieValue);
        if (!Array.isArray(result))
            return [];
        return result;
    }
    /**
     * Filters a list of Members by a function that returns a boolean.
     * Returns a new list of Members.
     */
    filterBy(fn) {
        const result = new CookieListOfDataWrappers(this.pCookieService, this.cookieData);
        for (const item of this.iterable()) {
            if (!fn(item))
                continue;
            result.push(item);
        }
        return result;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    containsIds() {
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    createInstance() {
        return new CookieListOfDataWrappers(this.pCookieService, this.cookieData);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    containsPrimitives() {
        return false;
    }
    onItemAdded(item) {
        super.onItemAdded(item);
        this.addIdToCookie(item);
    }
    onItemRemove(item) {
        super.onItemRemove(item);
        this.removeIdFromCookie(item);
    }
    addIdToCookie(item) {
        const primitiveArray = this.cookieArray;
        if (!primitiveArray.includes(item.id.rawData))
            primitiveArray.push(item.id.rawData);
        this.pCookieService.put(this.cookieData, JSON.stringify(primitiveArray));
    }
    removeIdFromCookie(item) {
        const idArray = this.cookieArray;
        const indexOfItem = idArray.indexOf(item.id.rawData);
        if (indexOfItem > -1)
            idArray.splice(indexOfItem, 1);
        this.pCookieService.put(this.cookieData, JSON.stringify(idArray));
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get dni() {
        return '0';
    }
}
/**
 * Filter items that are visible in the calendar.
 * Most of this information gets stored in the cookies.
 */
let FilterService = class FilterService extends DataInput {
    constructor(api, pCookieService, zone, console, clientRoutingService, reportFilterService, schedulingFilterService, localizePipe, toastsService) {
        super(zone);
        this.api = api;
        this.pCookieService = pCookieService;
        this.zone = zone;
        this.console = console;
        this.clientRoutingService = clientRoutingService;
        this.reportFilterService = reportFilterService;
        this.schedulingFilterService = schedulingFilterService;
        this.localizePipe = localizePipe;
        this.toastsService = toastsService;
        /**
         * Contains all items that need to be hidden
         */
        this.hiddenItems = { members: null, shiftModels: null };
        this.cookiesHaveBeenRead = false;
        // /**
        //  * Contains all items that need to be hidden
        //  */
        // hiddenAssignmentProcesses : SchedulingApiAssignmentProcesses;
        // NOTE: Quick n dirty…
        this.isOnlyWishPickerAssignmentProcesses = null;
        // NOTE: Quick n dirty…
        this.isOnlyEarlyBirdAssignmentProcesses = null;
        this.reportFilterServiceSubscription = null;
        this.schedulingFilterServiceSubscription = null;
        this.reportFilterServiceSubscription = this.reportFilterService.onChange.subscribe(() => { this.changed(null); });
        this.schedulingFilterServiceSubscription = this.schedulingFilterService.onChange.subscribe(() => { this.changed(null); });
        this.hiddenItems = {
            members: new CookieListOfDataWrappers(this.pCookieService, { name: 'hiddenMembers', prefix: null }),
            shiftModels: new CookieListOfDataWrappers(this.pCookieService, { name: 'hiddenShiftModels', prefix: null }),
        };
        this.initValues();
        /**
         * Guess what happens when an item gets removed from api.data through a api.load? Throw.
         * So here we make sure every api.data load refills the arrays with valid data.
         */
        this.api.onDataLoaded.subscribe(() => {
            this.hiddenItems['members'] = new CookieListOfDataWrappers(this.pCookieService, { name: 'hiddenMembers', prefix: null });
            this.hiddenItems['shiftModels'] = new CookieListOfDataWrappers(this.pCookieService, { name: 'hiddenShiftModels', prefix: null });
            this.readCookies();
        });
    }
    /**
     * returns true if filter is set to 'show all'
     */
    get isSetToShowAll() {
        if (!this.schedulingFilterService.isSetToShowAll)
            return false;
        if (!this.reportFilterService.isSetToShowAll)
            return false;
        if (this.isOnlyEarlyBirdAssignmentProcesses)
            return false;
        if (this.isOnlyWishPickerAssignmentProcesses)
            return false;
        if (this.hiddenItems['members'].length)
            return false;
        if (this.hiddenItems['shiftModels'].length)
            return false;
        return true;
    }
    /**
     * Read values from cookies if available
     */
    readCookies() {
        if (!this.api.isLoaded())
            this.console.warn('Api must be loaded to read Cookies for filter.service.');
        if (this.pCookieService.has({ name: 'hiddenMembers', prefix: null })) {
            for (const idAsNumber of this.hiddenItems['members'].cookieArray) {
                const item = this.api.data.members.get(Id.create(idAsNumber));
                if (item)
                    this.hiddenItems['members'].push(item);
            }
        }
        if (this.pCookieService.has({ name: 'hiddenShiftModels', prefix: null })) {
            for (const idAsNumber of this.hiddenItems['shiftModels'].cookieArray) {
                const item = this.api.data.shiftModels.get(Id.create(idAsNumber));
                if (item)
                    this.hiddenItems['shiftModels'].push(item);
            }
        }
        this.reportFilterService.readCookies();
        this.schedulingFilterService.readCookies();
        this.cookiesHaveBeenRead = true;
    }
    /**
     * Init all necessary values for this class
     */
    initValues() {
        this.reportFilterService.initValues();
        this.schedulingFilterService.initValues();
    }
    /**
     * Toggle visibility settings of a shiftModel, member or option
     */
    toggleItem(item) {
        if (!this.isVisible(item)) {
            this.show(item);
            return;
        }
        this.hide(item);
        if (item instanceof SchedulingApiShiftModel || item instanceof SchedulingApiMember) {
            this.api.data.shifts.getItemsRelatedTo(item).setSelected(false);
        }
    }
    /**
     * Sets all provided members to visible if all where hidden.
     * Sets all provided members to hidden if some where visible and some not.
     */
    toggleMembers(members) {
        if (!this.isVisible(members)) {
            this.show(members);
        }
        else {
            this.hide(members);
        }
    }
    /**
     * Sets shiftModels to visible if all where hidden.
     * Sets shiftModels to hidden if some where visible and some not.
     */
    toggleShiftModels(shiftModels) {
        if (!this.isVisible(shiftModels)) {
            this.show(shiftModels);
        }
        else {
            this.hide(shiftModels);
        }
    }
    /**
     * Sets given filterItem to 'hidden'
     */
    hide(input) {
        switch (input.constructor) {
            case SchedulingApiShiftModel:
                this.hideShiftModel(input);
                break;
            case SchedulingApiMember:
                this.hideMember(input);
                break;
            case SchedulingApiShiftModels:
                for (const shiftModel of input.iterable())
                    this.hideShiftModel(shiftModel);
                break;
            case SchedulingApiMembers:
                for (const item of input.iterable())
                    this.hideMember(item);
                break;
            default:
                throw new Error('wrong item type');
        }
        this.changed(null);
    }
    /**
     * Checks if given shiftModel, member, option, members or shiftModels is visible.
     * If you check a list of items, the method returns true if ALL of them are visible.
     */
    isVisible(input) {
        if (input instanceof SchedulingApiShift)
            return this.isVisibleShift(input);
        if (input instanceof SchedulingApiShiftModel)
            return this.isVisibleShiftModel(input);
        if (input instanceof SchedulingApiShiftModels)
            return this.isVisibleShiftModels(input);
        if (input instanceof SchedulingApiMember)
            return this.isVisibleMember(input);
        if (input instanceof SchedulingApiMembers)
            return this.isVisibleMembers(input);
        if (input instanceof SchedulingApiAbsence)
            return this.isVisibleAbsence(input);
        if (input instanceof SchedulingApiAbsences)
            return this.isVisibleAbsences(input);
        if (input instanceof SchedulingApiHoliday)
            return this.isVisibleHoliday(input);
        if (input instanceof SchedulingApiBirthday)
            return this.isVisibleBirthday(input);
        if (input instanceof SchedulingApiBooking)
            return this.isVisibleBooking(input);
        if (input instanceof SchedulingApiWorkingTime)
            return this.isVisibleWorkingTime(input);
        if (input instanceof SchedulingApiTodaysShiftDescription)
            return this.isVisibleTodaysShiftDescription(input);
        throw new Error('unexpected instance of input');
    }
    /**
     * returns true if filter is set to 'hide everything'
     */
    isHideAll(members, shiftModels) {
        const someMembersAreVisible = !this.isHideAllMembers(members);
        const someShiftModelsAreVisible = !this.isHideShiftModels(shiftModels);
        // let someAssignmentProcessesAreVisible = !this.isHideAssignmentProcesses(assignmentProcesses);
        return (!someMembersAreVisible ||
            !someShiftModelsAreVisible
        // || !someAssignmentProcessesAreVisible
        );
    }
    /**
     * returns true if filter is set to 'hide every member'
     */
    isHideAllMembers(members) {
        const MEMBERS_COUNT = members.length;
        const HIDDEN_MEMBERS_COUNT = this.hiddenItems['members'].filterBy((item) => {
            if (!item.rawData)
                return false;
            return !!members.get(item.id);
        }).length;
        return MEMBERS_COUNT === HIDDEN_MEMBERS_COUNT;
    }
    /**
     * returns true if filter is set to 'hide every shiftmodel'
     */
    isHideShiftModels(shiftModels) {
        const hiddenCount = this.hiddenItems['shiftModels'].filterBy((item) => !item.trashed).length;
        return hiddenCount === shiftModels.filterBy(item => !item.trashed).length;
    }
    /**
     * Checks if some shiftModels are visible with the current filter settings
     */
    someShiftModelsAreVisible(shiftModels) {
        if (!shiftModels)
            return !this.hiddenItems['shiftModels'].length;
        return shiftModels.some(item => {
            // Ignore trashed shiftmodels
            if (item.trashed)
                return null;
            return !this.hiddenItems['shiftModels'].contains(item);
        });
    }
    /**
     * Checks if some members are visible with the current filter settings
     */
    someMembersAreVisible(members) {
        if (!members)
            return !this.hiddenItems['members'].length;
        return members.some(item => !this.hiddenItems['members'].contains(item));
    }
    /**
     * Check if the filter is set to show only the shifts of one member
     */
    isOnlyMember(input) {
        let member = null;
        if (input instanceof SchedulingApiMember) {
            member = input;
        }
        else {
            if (!this.api.isLoaded())
                return false;
            member = this.api.data.members.get(input);
            if (!member) {
                if (Config.DEBUG) {
                    const id = input instanceof SchedulingApiMember ? input.id : input;
                    this.console.error(`Member with id ${id.toString()} could not be found.`);
                    this.console.error(`${this.api.data.members.length} Members available.`);
                }
                return false;
            }
        }
        if (!this.isVisibleMember(member))
            return false;
        const otherMembers = this.api.data.members.filterBy((item) => !item.id.equals(member.id));
        for (const otherMember of otherMembers.iterable()) {
            if (this.hiddenItems['members'].contains(otherMember))
                continue;
            return false;
        }
        return true;
    }
    /**
     * Set the filter to show only the shifts of the given member
     */
    showOnlyMember(id, value) {
        if (value) {
            this.hide(this.api.data.members);
            this.showMember(id);
            this.schedulingFilterService.showItemsWithEmptyMemberSlot = false;
        }
        else {
            this.showMembers();
            this.schedulingFilterService.showItemsWithEmptyMemberSlot = true;
        }
        this.changed(null);
    }
    // NOTE: Quick n dirty…
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    showOnlyWishPickerAssignmentProcesses(value) {
        this.isOnlyWishPickerAssignmentProcesses = value;
        this.changed(null);
    }
    // NOTE: Quick n dirty…
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    showOnlyEarlyBirdAssignmentProcesses(value) {
        this.isOnlyEarlyBirdAssignmentProcesses = value;
        this.changed(null);
    }
    ngOnDestroy() {
        this.unload();
    }
    /** @see PServiceInterface['unload'] */
    unload() {
        var _a, _b;
        (_a = this.reportFilterServiceSubscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        (_b = this.schedulingFilterServiceSubscription) === null || _b === void 0 ? void 0 : _b.unsubscribe();
        this.unloadFilters();
        this.cookiesHaveBeenRead = false;
        this.changed(null);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    unloadShiftModels() {
        this.hiddenItems['shiftModels'].clear();
        this.changed(null);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    unloadFilters() {
        this.hiddenItems['shiftModels'].clear();
        this.hiddenItems['members'].clear();
        this.isOnlyEarlyBirdAssignmentProcesses = false;
        this.isOnlyWishPickerAssignmentProcesses = false;
        this.reportFilterService.unload();
        this.schedulingFilterService.unload();
    }
    /**
     * Sets given filterItem to 'visible'
     * If you know the instanceof filterItem, you should prefer showMember() or showShiftModel()
     */
    show(item) {
        switch (item.constructor) {
            case SchedulingApiShiftModel:
                this.showShiftModel(item);
                break;
            case SchedulingApiMember:
                this.showMember(item);
                break;
            case SchedulingApiShiftModels:
                this.showShiftModels(item);
                break;
            case SchedulingApiMembers:
                this.showMembers(item);
                break;
            default:
                throw new Error('wrong item type');
        }
        this.changed(null);
    }
    /**
     * Check if this member is visible
     */
    isVisibleMember(input) {
        if (!this.api.isLoaded())
            return false;
        let member = null;
        if (input instanceof SchedulingApiMember) {
            member = input;
        }
        else {
            if (!this.api.isLoaded())
                return false;
            member = this.api.data.members.get(input);
            if (!member) {
                if (Config.DEBUG) {
                    const id = input instanceof SchedulingApiMember ? input.id : input;
                    this.console.error(`Member with id ${id.toString()} could not be found.`);
                    this.console.error(`${this.api.data.members.length} Members available.`);
                }
                return false;
            }
        }
        return !this.hiddenItems['members'].contains(member);
    }
    /**
     * Check if this absence is visible
     */
    isVisibleAbsence(input) {
        // If there is nothing hidden by any filter, then no further checks needs to be done
        if (this.isSetToShowAll)
            return true;
        // member of the absence is hidden?
        if (this.hiddenItems['members'].contains(input.memberId))
            return false;
        // Am i on a page with a calendar-view?
        if (this.clientRoutingService.currentPage === 0 /* CurrentPageEnum.SCHEDULING */ ||
            this.clientRoutingService.currentPage === 2 /* CurrentPageEnum.BOOKING */) {
            // NOTE: I stumbled upon this and I am not sure if this line
            // should apply to this.pRoutingService.currentPage === CurrentPageEnum.BOOKING
            if (!this.schedulingFilterService.isVisible(input))
                return false;
            const absenceMember = this.api.data.members.get(input.memberId);
            // Are all shift-models for which the member is assignable hidden?
            // Ignore this criteria for admins as they are often not assignable to specific shift-models.
            if (absenceMember === null)
                throw new Error('Could not get absenceMember [PLANO-18520]');
            if (absenceMember.role !== SchedulingApiRightGroupRole.CLIENT_OWNER) {
                let allAssignableShiftModelsHidden = true;
                for (const assignableShiftModel of absenceMember.assignableShiftModels.iterable()) {
                    if (this.hiddenItems['shiftModels'].contains(assignableShiftModel.shiftModel))
                        continue;
                    allAssignableShiftModelsHidden = false;
                    break;
                }
                if (allAssignableShiftModelsHidden && absenceMember.assignableShiftModels.length > 0)
                    return false;
            }
        }
        // eslint-disable-next-line sonarjs/no-collapsible-if
        if (this.clientRoutingService.currentPage === 1 /* CurrentPageEnum.REPORT */) {
            if (!this.reportFilterService.isVisible(input))
                return false;
        }
        // passed all tests
        return true;
    }
    /**
     * Check if this absence is visible
     */
    isVisibleAbsences(input) {
        for (const absence of input.iterable()) {
            if (!this.isVisibleAbsence(absence))
                continue;
            return false;
        }
        return true;
    }
    /**
     * Check if this holiday is visible
     */
    isVisibleHoliday(input) {
        // eslint-disable-next-line sonarjs/no-collapsible-if
        if (this.clientRoutingService.currentPage === 0 /* CurrentPageEnum.SCHEDULING */ ||
            this.clientRoutingService.currentPage === 2 /* CurrentPageEnum.BOOKING */) {
            if (!this.schedulingFilterService.isVisible(input))
                return false;
        }
        return true;
    }
    /**
     * Check if this holiday is visible
     */
    isVisibleBirthday(input) {
        // eslint-disable-next-line sonarjs/no-collapsible-if
        if (this.clientRoutingService.currentPage === 0 /* CurrentPageEnum.SCHEDULING */ ||
            this.clientRoutingService.currentPage === 2 /* CurrentPageEnum.BOOKING */) {
            if (!this.schedulingFilterService.isVisible(input))
                return false;
        }
        return true;
    }
    /**
     * Check if this Booking is visible
     */
    isVisibleBooking(input) {
        return !this.hiddenItems['shiftModels'].contains(input.shiftModelId);
    }
    /**
     * Check if this WorkingTime is visible
     */
    isVisibleWorkingTime(input) {
        if (this.hiddenItems['shiftModels'].contains(input.shiftModelId))
            return false;
        if (this.hiddenItems['members'].contains(input.memberId))
            return false;
        if (this.clientRoutingService.currentPage === 1 /* CurrentPageEnum.REPORT */ && !this.reportFilterService.isVisible(input))
            return false;
        return true;
    }
    /**
     * Check if this todaysShiftDescription is visible
     */
    isVisibleTodaysShiftDescription(input) {
        return !this.hiddenItems['shiftModels'].contains(input.id.shiftModelId);
    }
    /**
     * Check if these members are visible
     * true if all of these members are visible
     * false if any of these members is invisible
     */
    isVisibleMembers(members) {
        if (!this.hiddenItems['members'].length)
            return true;
        for (const member of members.iterable()) {
            if (this.isVisibleMember(member))
                continue;
            return false;
        }
        return true;
    }
    /**
     * Check if these members are visible
     * true if all of these members are invisible
     * false if any of these members is visible
     */
    isHiddenMembers(members) {
        if (!this.hiddenItems['members'].length)
            return false;
        for (const member of members.iterable()) {
            if (!this.isVisibleMember(member))
                continue;
            return false;
        }
        return true;
    }
    // /**
    //  * Check if these assignmentProcesses are visible
    //  * true if all of these assignmentProcesses are visible
    //  * false if any of these assignmentProcesses is invisible
    //  */
    // private isVisibleAssignmentProcesses(assignmentProcesses : SchedulingApiAssignmentProcesses) : boolean {
    // 	if (!this.hiddenAssignmentProcesses.length) {
    // 		return true;
    // 	}
    // 	for (let assignmentProcess of assignmentProcesses.iterable()) {
    // 		if (this.hiddenAssignmentProcesses.contains(assignmentProcess)) {
    // 			return false;
    // 		}
    // 	}
    // 	return true;
    // }
    /**
     * Check if this shift is visible
     */
    isVisibleShift(shift) {
        if (this.clientRoutingService.currentPage === 0 /* CurrentPageEnum.SCHEDULING */ && !this.schedulingFilterService.isVisible(shift))
            return false;
        assumeDefinedToGetStrictNullChecksRunning(shift.model, 'shift.model');
        // don’t show this shift if the related shiftmodel is not visible
        if (!this.isVisibleShiftModel(shift.model))
            return false;
        // don’t show this shift if all related members are hidden
        if (shift.assignedMemberIds.length && this.isHiddenMembers(shift.assignedMembers) &&
            // If a shift has Hans assigned and 1 free slot and hans is hidden,
            // then the shift should still show up [PLANO-20250]
            (!this.schedulingFilterService.showItemsWithEmptyMemberSlot || !shift.emptyMemberSlots))
            return false;
        return true;
    }
    /**
     * Check if this shiftModel is visible
     */
    isVisibleShiftModel(shiftModel) {
        return !this.hiddenItems['shiftModels'].contains(shiftModel);
    }
    /**
     * Check if these shiftModels is visible
     * true if all of these shiftModels are visible
     * false if any of these shiftModels is invisible
     */
    isVisibleShiftModels(shiftModels) {
        if (!this.hiddenItems['shiftModels'].length)
            return true;
        for (const shiftModel of shiftModels.iterable()) {
            if (shiftModel.trashed)
                continue;
            if (!this.hiddenItems['shiftModels'].contains(shiftModel))
                continue;
            return false;
        }
        return true;
    }
    /**
     * Sets all [given] shiftModels to 'visible'
     * Clears all if you don’t pass shiftModels
     */
    showShiftModels(shiftModels) {
        if (shiftModels === undefined) {
            this.hiddenItems['shiftModels'].clear();
        }
        else {
            for (const item of shiftModels.iterable()) {
                this.showShiftModel(item);
            }
        }
        this.changed(null);
    }
    /**
     * Sets all members to 'visible'
     * Clears all if you don’t pass members
     */
    showMembers(members) {
        if (members !== undefined) {
            for (const item of members.iterable()) {
                this.showMember(item);
            }
            if (!this.schedulingFilterService.showItemsWithEmptyMemberSlot && this.api.data.members === members) {
                this.schedulingFilterService.showItemsWithEmptyMemberSlot = true;
            }
        }
        else {
            this.schedulingFilterService.showItemsWithEmptyMemberSlot = true;
            this.hiddenItems['members'].clear();
        }
        this.changed(null);
    }
    /**
     * Sets provided member to 'visible'
     */
    showShiftModel(item) {
        const shiftModel = item instanceof SchedulingApiShiftModel ? item : this.api.data.shiftModels.get(item);
        if (this.hiddenItems['shiftModels'].contains(shiftModel)) {
            this.hiddenItems['shiftModels'].removeItem(shiftModel);
        }
    }
    /**
     * Sets provided member to 'hidden'
     */
    hideShiftModel(item) {
        var _a, _b, _c, _d, _e;
        const shiftModel = item instanceof SchedulingApiShiftModel ? item : this.api.data.shiftModels.get(item);
        (_a = this.toastsService) === null || _a === void 0 ? void 0 : _a.addToast({
            title: (_c = (_b = this.localizePipe) === null || _b === void 0 ? void 0 : _b.transform('Tätigkeit ausgeblendet')) !== null && _c !== void 0 ? _c : null,
            content: (_e = (_d = this.localizePipe) === null || _d === void 0 ? void 0 : _d.transform('… und dazugehörige Schichten, Tauschbörsen-Einträge, Arbeitseinsätze in der Auswertung etc.')) !== null && _e !== void 0 ? _e : '',
            theme: PThemeEnum.INFO,
            visibilityDuration: 'long',
        });
        if (!this.hiddenItems['shiftModels'].contains(shiftModel)) {
            this.hiddenItems['shiftModels'].push(shiftModel);
        }
    }
    /**
     * Sets provided member to 'visible'
     */
    showMember(item) {
        let member = null;
        if (item instanceof SchedulingApiMember) {
            member = item;
        }
        else {
            if (!this.api.isLoaded())
                throw new Error(`Api should be loaded here. #ERROR1`);
            member = this.api.data.members.get(item);
            if (!member)
                throw new Error(`member could not be found. member.id: ${item.rawData}. #ERROR2`);
        }
        if (this.hiddenItems['members'].contains(member)) {
            this.hiddenItems['members'].removeItem(member);
        }
    }
    /**
     * Sets provided member to 'hidden'
     */
    hideMember(item) {
        var _a, _b, _c, _d, _e;
        const member = item instanceof SchedulingApiMember ? item : this.api.data.members.get(item);
        (_a = this.toastsService) === null || _a === void 0 ? void 0 : _a.addToast({
            title: (_c = (_b = this.localizePipe) === null || _b === void 0 ? void 0 : _b.transform('User ausgeblendet')) !== null && _c !== void 0 ? _c : null,
            content: (_e = (_d = this.localizePipe) === null || _d === void 0 ? void 0 : _d.transform('… und dazugehörige Schichten, Tauschbörsen-Einträge, Arbeitseinsätze in der Auswertung etc.')) !== null && _e !== void 0 ? _e : '',
            theme: PThemeEnum.INFO,
            visibilityDuration: 'long',
        });
        if (!this.hiddenItems['members'].contains(member)) {
            this.hiddenItems['members'].push(member);
        }
    }
    /**
     * Counts hidden ShiftModels or Members
     */
    hiddenItemsCount(items) {
        if (items instanceof SchedulingApiShiftModels)
            return this.hiddenItems['shiftModels'].filterBy(item => !!items.get(item.id)).length;
        if (items instanceof SchedulingApiMembers)
            return this.hiddenItems['members'].filterBy(item => !!items.get(item.id)).length;
        return 0;
    }
};
FilterService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, PCookieService, typeof (_b = typeof NgZone !== "undefined" && NgZone) === "function" ? _b : Object, LogService,
        ClientRoutingService, typeof (_c = typeof ReportFilterService !== "undefined" && ReportFilterService) === "function" ? _c : Object, typeof (_d = typeof SchedulingFilterService !== "undefined" && SchedulingFilterService) === "function" ? _d : Object, LocalizePipe,
        ToastsService])
], FilterService);
export { FilterService };
//# sourceMappingURL=filter.service.js.map