/* NOTE: Don’t make this file even bigger. Invest some time to cleanup/split into several files */
/* eslint max-lines: ["error", 900] */
import { Subscription } from 'rxjs';
import { OnDestroy} from '@angular/core';
import { Injectable, NgZone } from '@angular/core';
import { ApiDataWrapperBase } from '@plano/shared/api';
import { SchedulingApiService, SchedulingApiHoliday, SchedulingApiShiftModels, SchedulingApiShiftModel, SchedulingApiMember, SchedulingApiMembers, SchedulingApiShift, SchedulingApiAbsence, SchedulingApiAbsences, SchedulingApiTodaysShiftDescription } from '@plano/shared/api';
import { ApiListWrapper } from '@plano/shared/api';
import { SchedulingApiRightGroupRole } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { DataInput } from '@plano/shared/core/data/data-input';
import { LogService } from '@plano/shared/core/log.service';
import { PServiceWithCookiesInterface, PCookieKeyDataType } from '@plano/shared/core/p-cookie.service';
import { PCookieService } from '@plano/shared/core/p-cookie.service';
import { PServiceInterface } from '@plano/shared/core/p-service.interface';
import { PThemeEnum } from './bootstrap-styles.enum';
import { ClientRoutingService, CurrentPageEnum } from './routing.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../shared/core/null-type-utils';
import { LocalizePipe } from '../../shared/core/pipe/localize.pipe';
import { ReportFilterService } from '../report/report-filter.service';
import { SchedulingFilterService } from '../scheduling/scheduling-filter.service';
import { SchedulingApiBirthday } from '../scheduling/shared/api/scheduling-api-birthday.service';
import { SchedulingApiBooking } from '../scheduling/shared/api/scheduling-api-booking.service';
import { SchedulingApiWorkingTime } from '../scheduling/shared/api/scheduling-api-working-time.service';
import { ToastsService } from '../service/toasts.service';

export type FilterItem = (
	SchedulingApiShiftModel |
	SchedulingApiMember |
	SchedulingApiMembers |
	SchedulingApiShiftModels |
	SchedulingApiShift |
	SchedulingApiAbsence |
	SchedulingApiAbsences |
	SchedulingApiHoliday |
	SchedulingApiBirthday |
	SchedulingApiBooking |
	SchedulingApiWorkingTime |
	SchedulingApiTodaysShiftDescription
);

export interface FilterServiceInterface extends PServiceInterface {
	isVisible(input : unknown) : boolean;
	unloadFilters() : void;
}

/**
 * A list of cookies.
 */

export class CookieListOfDataWrappers<T extends ApiDataWrapperBase> extends ApiListWrapper<T> {
	constructor(
		private pCookieService : PCookieService,
		private cookieData : PCookieKeyDataType,
	) {
		super(null, false);
	}

	/**
	 * Get an array of the cookies
	 */
	public get cookieArray() : number[] {
		if (!this.pCookieService.has(this.cookieData)) return [];
		const cookieValue = this.pCookieService.get(this.cookieData)!;
		const result = JSON.parse(cookieValue);
		if (!Array.isArray(result)) return [];
		return result;
	}

	/**
	 * Filters a list of Members by a function that returns a boolean.
	 * Returns a new list of Members.
	 */
	public filterBy( fn : (item : T) => boolean ) : CookieListOfDataWrappers<ApiDataWrapperBase> {
		const result = new CookieListOfDataWrappers(this.pCookieService, this.cookieData);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	protected containsIds() : boolean {
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	protected createInstance() : ApiListWrapper<T> {
		return new CookieListOfDataWrappers<T>(this.pCookieService, this.cookieData);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	protected containsPrimitives() : boolean {
		return false;
	}

	protected override onItemAdded(item : T) : void {
		super.onItemAdded(item);
		this.addIdToCookie(item);
	}

	protected override onItemRemove(item : T) : void {
		super.onItemRemove(item);
		this.removeIdFromCookie(item);
	}

	private addIdToCookie(item : T) : void {
		const primitiveArray = this.cookieArray;
		if (!primitiveArray.includes(item.id!.rawData)) primitiveArray.push(item.id!.rawData);
		this.pCookieService.put(this.cookieData, JSON.stringify(primitiveArray));
	}

	private removeIdFromCookie(item : T) : void {
		const idArray = this.cookieArray;
		const indexOfItem = idArray.indexOf(item.id!.rawData);
		if (indexOfItem > -1) idArray.splice(indexOfItem, 1);
		this.pCookieService.put(this.cookieData, JSON.stringify(idArray));
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	protected get dni() : string {
		return '0';
	}
}

/**
 * Filter items that are visible in the calendar.
 * Most of this information gets stored in the cookies.
 */

@Injectable()
export class FilterService extends DataInput
	implements OnDestroy, PServiceWithCookiesInterface, FilterServiceInterface {

	/**
	 * returns true if filter is set to 'show all'
	 */
	public get isSetToShowAll() : boolean {
		if (!this.schedulingFilterService.isSetToShowAll) return false;
		if (!this.reportFilterService.isSetToShowAll) return false;

		if (this.isOnlyEarlyBirdAssignmentProcesses) return false;
		if (this.isOnlyWishPickerAssignmentProcesses) return false;

		if (this.hiddenItems['members'].length) return false;
		if (this.hiddenItems['shiftModels'].length) return false;
		return true;
	}

	/**
	 * Contains all items that need to be hidden
	 */
	public hiddenItems : {
		members : CookieListOfDataWrappers<SchedulingApiMember>,
		shiftModels : CookieListOfDataWrappers<SchedulingApiShiftModel>,
	} = { members: null!, shiftModels: null! };

	public cookiesHaveBeenRead : boolean = false;

	// /**
	//  * Contains all items that need to be hidden
	//  */
	// hiddenAssignmentProcesses : SchedulingApiAssignmentProcesses;

	// NOTE: Quick n dirty…
	public isOnlyWishPickerAssignmentProcesses : boolean | null = null;

	// NOTE: Quick n dirty…
	public isOnlyEarlyBirdAssignmentProcesses : boolean | null = null;

	constructor(
		public api : SchedulingApiService,
		private pCookieService : PCookieService,
		public override zone : NgZone,
		private console : LogService,
		private clientRoutingService : ClientRoutingService,
		private reportFilterService : ReportFilterService,
		public schedulingFilterService : SchedulingFilterService,
		private localizePipe ?: LocalizePipe,
		private toastsService ?: ToastsService,
	) {
		super(zone);

		this.reportFilterServiceSubscription = this.reportFilterService.onChange.subscribe(() => { this.changed(null); });
		this.schedulingFilterServiceSubscription = this.schedulingFilterService.onChange.subscribe(() => { this.changed(null); });
		this.hiddenItems = {
			members: new CookieListOfDataWrappers(this.pCookieService, {name: 'hiddenMembers', prefix: null}),
			shiftModels: new CookieListOfDataWrappers(this.pCookieService, {name: 'hiddenShiftModels', prefix: null}),
		};
		this.initValues();

		/**
		 * Guess what happens when an item gets removed from api.data through a api.load? Throw.
		 * So here we make sure every api.data load refills the arrays with valid data.
		 */
		this.api.onDataLoaded.subscribe(() => {
			this.hiddenItems['members'] = new CookieListOfDataWrappers(this.pCookieService, {name: 'hiddenMembers', prefix: null});
			this.hiddenItems['shiftModels'] = new CookieListOfDataWrappers(this.pCookieService, {name: 'hiddenShiftModels', prefix: null});
			this.readCookies();
		});
	}

	private reportFilterServiceSubscription : Subscription | null = null;
	private schedulingFilterServiceSubscription : Subscription | null = null;

	/**
	 * Read values from cookies if available
	 */
	public readCookies() : void {
		if (!this.api.isLoaded()) this.console.warn('Api must be loaded to read Cookies for filter.service.');

		if (this.pCookieService.has({name: 'hiddenMembers', prefix: null})) {
			for (const idAsNumber of this.hiddenItems['members'].cookieArray) {
				const item = this.api.data.members.get(Id.create(idAsNumber));
				if (item) this.hiddenItems['members'].push(item);
			}
		}

		if (this.pCookieService.has({name: 'hiddenShiftModels', prefix: null})) {
			for (const idAsNumber of this.hiddenItems['shiftModels'].cookieArray) {
				const item = this.api.data.shiftModels.get(Id.create(idAsNumber));
				if (item) this.hiddenItems['shiftModels'].push(item);
			}
		}

		this.reportFilterService.readCookies();
		this.schedulingFilterService.readCookies();

		this.cookiesHaveBeenRead = true;
	}

	/**
	 * Init all necessary values for this class
	 */
	public initValues() : void {
		this.reportFilterService.initValues();
		this.schedulingFilterService.initValues();
	}

	/**
	 * Toggle visibility settings of a shiftModel, member or option
	 */
	public toggleItem( item : SchedulingApiShiftModel | SchedulingApiMember ) : void {
		if (!this.isVisible(item)) { this.show(item); return; }

		this.hide(item);
		if (item instanceof SchedulingApiShiftModel || item instanceof SchedulingApiMember) {
			this.api.data.shifts.getItemsRelatedTo(item).setSelected(false);
		}
	}

	/**
	 * Sets all provided members to visible if all where hidden.
	 * Sets all provided members to hidden if some where visible and some not.
	 */
	public toggleMembers(members : SchedulingApiMembers) : void {
		if (!this.isVisible(members)) {
			this.show(members);
		} else {
			this.hide(members);
		}
	}

	/**
	 * Sets shiftModels to visible if all where hidden.
	 * Sets shiftModels to hidden if some where visible and some not.
	 */
	public toggleShiftModels( shiftModels : SchedulingApiShiftModels ) : void {
		if (!this.isVisible(shiftModels)) {
			this.show(shiftModels);
		} else {
			this.hide(shiftModels);
		}
	}

	/**
	 * Sets given filterItem to 'hidden'
	 */
	public hide(input : SchedulingApiShiftModel | SchedulingApiMember | SchedulingApiShiftModels | SchedulingApiMembers) : void {
		switch (input.constructor) {
			case SchedulingApiShiftModel :
				this.hideShiftModel(input as SchedulingApiShiftModel);
				break;
			case SchedulingApiMember :
				this.hideMember(input as SchedulingApiMember);
				break;
			case SchedulingApiShiftModels :
				for (const shiftModel of (input as SchedulingApiShiftModels).iterable()) this.hideShiftModel(shiftModel);
				break;
			case SchedulingApiMembers :
				for (const item of (input as SchedulingApiMembers).iterable()) this.hideMember(item);
				break;
			default :
				throw new Error('wrong item type');
		}

		this.changed(null);
	}

	/**
	 * Checks if given shiftModel, member, option, members or shiftModels is visible.
	 * If you check a list of items, the method returns true if ALL of them are visible.
	 */
	public isVisible(input : FilterItem) : boolean {
		if (input instanceof SchedulingApiShift) return this.isVisibleShift(input);
		if (input instanceof SchedulingApiShiftModel) return this.isVisibleShiftModel(input);
		if (input instanceof SchedulingApiShiftModels) return this.isVisibleShiftModels(input);
		if (input instanceof SchedulingApiMember) return this.isVisibleMember(input);
		if (input instanceof SchedulingApiMembers) return this.isVisibleMembers(input);
		if (input instanceof SchedulingApiAbsence) return this.isVisibleAbsence(input);
		if (input instanceof SchedulingApiAbsences) return this.isVisibleAbsences(input);
		if (input instanceof SchedulingApiHoliday) return this.isVisibleHoliday(input);
		if (input instanceof SchedulingApiBirthday) return this.isVisibleBirthday(input);
		if (input instanceof SchedulingApiBooking) return this.isVisibleBooking(input);
		if (input instanceof SchedulingApiWorkingTime) return this.isVisibleWorkingTime(input);
		if (input instanceof SchedulingApiTodaysShiftDescription) return this.isVisibleTodaysShiftDescription(input);
		throw new Error('unexpected instance of input');
	}

	/**
	 * returns true if filter is set to 'hide everything'
	 */
	public isHideAll(
		members : SchedulingApiMembers,
		shiftModels : SchedulingApiShiftModels,
	) : boolean {
		const someMembersAreVisible = !this.isHideAllMembers(members);
		const someShiftModelsAreVisible = !this.isHideShiftModels(shiftModels);
		// let someAssignmentProcessesAreVisible = !this.isHideAssignmentProcesses(assignmentProcesses);
		return (
			!someMembersAreVisible ||
			!someShiftModelsAreVisible
			// || !someAssignmentProcessesAreVisible
		);
	}

	/**
	 * returns true if filter is set to 'hide every member'
	 */
	public isHideAllMembers(members : SchedulingApiMembers) : boolean {
		const MEMBERS_COUNT = members.length;
		const HIDDEN_MEMBERS_COUNT = this.hiddenItems['members'].filterBy((item) => {
			if (!item.rawData) return false;
			return !!members.get(item.id);
		}).length;
		return MEMBERS_COUNT === HIDDEN_MEMBERS_COUNT;
	}

	/**
	 * returns true if filter is set to 'hide every shiftmodel'
	 */
	public isHideShiftModels(shiftModels : SchedulingApiShiftModels) : boolean {
		const hiddenCount = this.hiddenItems['shiftModels'].filterBy((item) => !item.trashed).length;
		return hiddenCount === shiftModels.filterBy(item => !item.trashed).length;
	}

	/**
	 * Checks if some shiftModels are visible with the current filter settings
	 */
	public someShiftModelsAreVisible( shiftModels ?: SchedulingApiShiftModels ) : boolean {
		if (!shiftModels) return !this.hiddenItems['shiftModels'].length;
		return shiftModels.some(item => {
			// Ignore trashed shiftmodels
			if (item.trashed) return null;
			return !this.hiddenItems['shiftModels'].contains(item);
		});
	}

	/**
	 * Checks if some members are visible with the current filter settings
	 */
	public someMembersAreVisible( members ?: SchedulingApiMembers ) : boolean {
		if (!members) return !this.hiddenItems['members'].length;
		return members.some(item => !this.hiddenItems['members'].contains(item));
	}

	/**
	 * Check if the filter is set to show only the shifts of one member
	 */
	public isOnlyMember(input : SchedulingApiMember | Id) : boolean {
		let member : SchedulingApiMember | null = null;
		if (input instanceof SchedulingApiMember) {
			member = input;
		} else {
			if (!this.api.isLoaded()) return false;
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

		if (!this.isVisibleMember(member)) return false;
		const otherMembers = this.api.data.members.filterBy((item) => !item.id.equals(member!.id));

		for (const otherMember of otherMembers.iterable()) {
			if (this.hiddenItems['members'].contains(otherMember)) continue;
			return false;
		}
		return true;
	}

	/**
	 * Set the filter to show only the shifts of the given member
	 */
	public showOnlyMember(id : Id, value : boolean) : void {
		if (value) {
			this.hide(this.api.data.members);
			this.showMember(id);
			this.schedulingFilterService.showItemsWithEmptyMemberSlot = false;
		} else {
			this.showMembers();
			this.schedulingFilterService.showItemsWithEmptyMemberSlot = true;
		}

		this.changed(null);
	}

	// NOTE: Quick n dirty…
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public showOnlyWishPickerAssignmentProcesses(value : boolean) : void {
		this.isOnlyWishPickerAssignmentProcesses = value;
		this.changed(null);
	}

	// NOTE: Quick n dirty…
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public showOnlyEarlyBirdAssignmentProcesses(value : boolean) : void {
		this.isOnlyEarlyBirdAssignmentProcesses = value;
		this.changed(null);
	}

	public ngOnDestroy() : void {
		this.unload();
	}

	/** @see PServiceInterface['unload'] */
	public unload() : void {
		this.reportFilterServiceSubscription?.unsubscribe();
		this.schedulingFilterServiceSubscription?.unsubscribe();
		this.unloadFilters();
		this.cookiesHaveBeenRead = false;
		this.changed(null);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public unloadShiftModels() : void {
		this.hiddenItems['shiftModels'].clear();
		this.changed(null);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public unloadFilters() : void {
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
	private show( item : SchedulingApiShiftModel | SchedulingApiMember | SchedulingApiShiftModels | SchedulingApiMembers ) : void {
		switch (item.constructor) {
			case SchedulingApiShiftModel :
				this.showShiftModel(item as SchedulingApiShiftModel);
				break;
			case SchedulingApiMember :
				this.showMember(item as SchedulingApiMember);
				break;
			case SchedulingApiShiftModels :
				this.showShiftModels(item as SchedulingApiShiftModels);
				break;
			case SchedulingApiMembers :
				this.showMembers(item as SchedulingApiMembers);
				break;
			default :
				throw new Error('wrong item type');
		}

		this.changed(null);
	}

	/**
	 * Check if this member is visible
	 */
	private isVisibleMember( input : SchedulingApiMember | Id ) : boolean {
		if (!this.api.isLoaded()) return false;

		let member : SchedulingApiMember | null = null;
		if (input instanceof SchedulingApiMember) {
			member = input;
		} else {
			if (!this.api.isLoaded()) return false;
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
	private isVisibleAbsence( input : SchedulingApiAbsence ) : boolean {
		// If there is nothing hidden by any filter, then no further checks needs to be done
		if (this.isSetToShowAll) return true;

		// member of the absence is hidden?
		if (this.hiddenItems['members'].contains(input.memberId)) return false;

		// Am i on a page with a calendar-view?
		if (
			this.clientRoutingService.currentPage === CurrentPageEnum.SCHEDULING ||
			this.clientRoutingService.currentPage === CurrentPageEnum.BOOKING
		) {
			// NOTE: I stumbled upon this and I am not sure if this line
			// should apply to this.pRoutingService.currentPage === CurrentPageEnum.BOOKING
			if (!this.schedulingFilterService.isVisible(input)) return false;

			const absenceMember = this.api.data.members.get(input.memberId);

			// Are all shift-models for which the member is assignable hidden?
			// Ignore this criteria for admins as they are often not assignable to specific shift-models.
			if (absenceMember === null) throw new Error('Could not get absenceMember [PLANO-18520]');
			if (absenceMember.role !== SchedulingApiRightGroupRole.CLIENT_OWNER) {
				let allAssignableShiftModelsHidden = true;

				for (const assignableShiftModel of absenceMember.assignableShiftModels.iterable()) {
					if (this.hiddenItems['shiftModels'].contains(assignableShiftModel.shiftModel)) continue;
					allAssignableShiftModelsHidden = false;
					break;
				}

				if (allAssignableShiftModelsHidden && absenceMember.assignableShiftModels.length > 0) return false;
			}

		}

		// eslint-disable-next-line sonarjs/no-collapsible-if
		if (this.clientRoutingService.currentPage === CurrentPageEnum.REPORT) {
			if (!this.reportFilterService.isVisible(input)) return false;
		}

		// passed all tests
		return true;
	}

	/**
	 * Check if this absence is visible
	 */
	private isVisibleAbsences(input : SchedulingApiAbsences) : boolean {
		for (const absence of input.iterable()) {
			if (!this.isVisibleAbsence(absence)) continue;
			return false;
		}
		return true;
	}

	/**
	 * Check if this holiday is visible
	 */
	private isVisibleHoliday( input : SchedulingApiHoliday ) : boolean {
		// eslint-disable-next-line sonarjs/no-collapsible-if
		if (
			this.clientRoutingService.currentPage === CurrentPageEnum.SCHEDULING ||
			this.clientRoutingService.currentPage === CurrentPageEnum.BOOKING
		) {
			if (!this.schedulingFilterService.isVisible(input)) return false;
		}
		return true;
	}

	/**
	 * Check if this holiday is visible
	 */
	private isVisibleBirthday( input : SchedulingApiBirthday ) : boolean {
		// eslint-disable-next-line sonarjs/no-collapsible-if
		if (
			this.clientRoutingService.currentPage === CurrentPageEnum.SCHEDULING ||
			this.clientRoutingService.currentPage === CurrentPageEnum.BOOKING
		) {
			if (!this.schedulingFilterService.isVisible(input)) return false;
		}
		return true;
	}

	/**
	 * Check if this Booking is visible
	 */
	private isVisibleBooking( input : SchedulingApiBooking ) : boolean {
		return !this.hiddenItems['shiftModels'].contains(input.shiftModelId);
	}

	/**
	 * Check if this WorkingTime is visible
	 */
	private isVisibleWorkingTime( input : SchedulingApiWorkingTime ) : boolean {
		if (this.hiddenItems['shiftModels'].contains(input.shiftModelId)) return false;
		if (this.hiddenItems['members'].contains(input.memberId)) return false;
		if (this.clientRoutingService.currentPage === CurrentPageEnum.REPORT && !this.reportFilterService.isVisible(input)) return false;
		return true;
	}

	/**
	 * Check if this todaysShiftDescription is visible
	 */
	private isVisibleTodaysShiftDescription( input : SchedulingApiTodaysShiftDescription ) : boolean {
		return !this.hiddenItems['shiftModels'].contains(input.id.shiftModelId);
	}

	/**
	 * Check if these members are visible
	 * true if all of these members are visible
	 * false if any of these members is invisible
	 */
	private isVisibleMembers(members : SchedulingApiMembers) : boolean {
		if (!this.hiddenItems['members'].length) return true;
		for (const member of members.iterable()) {
			if (this.isVisibleMember(member)) continue;
			return false;
		}
		return true;
	}

	/**
	 * Check if these members are visible
	 * true if all of these members are invisible
	 * false if any of these members is visible
	 */
	private isHiddenMembers(members : SchedulingApiMembers) : boolean {
		if (!this.hiddenItems['members'].length) return false;
		for (const member of members.iterable()) {
			if (!this.isVisibleMember(member)) continue;
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
	private isVisibleShift(shift : SchedulingApiShift) : boolean {
		if (this.clientRoutingService.currentPage === CurrentPageEnum.SCHEDULING && !this.schedulingFilterService.isVisible(shift)) return false;

		assumeDefinedToGetStrictNullChecksRunning(shift.model, 'shift.model');

		// don’t show this shift if the related shiftmodel is not visible
		if (!this.isVisibleShiftModel(shift.model)) return false;

		// don’t show this shift if all related members are hidden
		if (
			shift.assignedMemberIds.length && this.isHiddenMembers(shift.assignedMembers) &&
			// If a shift has Hans assigned and 1 free slot and hans is hidden,
			// then the shift should still show up [PLANO-20250]
			(!this.schedulingFilterService.showItemsWithEmptyMemberSlot || !shift.emptyMemberSlots)
		) return false;

		return true;
	}

	/**
	 * Check if this shiftModel is visible
	 */
	private isVisibleShiftModel(shiftModel : SchedulingApiShiftModel) : boolean {
		return !this.hiddenItems['shiftModels'].contains(shiftModel);
	}

	/**
	 * Check if these shiftModels is visible
	 * true if all of these shiftModels are visible
	 * false if any of these shiftModels is invisible
	 */
	private isVisibleShiftModels(shiftModels : SchedulingApiShiftModels) : boolean {
		if (!this.hiddenItems['shiftModels'].length) return true;
		for (const shiftModel of shiftModels.iterable()) {
			if (shiftModel.trashed) continue;
			if (!this.hiddenItems['shiftModels'].contains(shiftModel)) continue;
			return false;
		}
		return true;
	}

	/**
	 * Sets all [given] shiftModels to 'visible'
	 * Clears all if you don’t pass shiftModels
	 */
	private showShiftModels( shiftModels ?: SchedulingApiShiftModels ) : void {
		if (shiftModels === undefined) {
			this.hiddenItems['shiftModels'].clear();
		} else {
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
	private showMembers(members ?: SchedulingApiMembers) : void {
		if (members !== undefined) {
			for (const item of members.iterable()) {
				this.showMember(item);
			}
			if (!this.schedulingFilterService.showItemsWithEmptyMemberSlot && this.api.data.members === members) {
				this.schedulingFilterService.showItemsWithEmptyMemberSlot = true;
			}
		} else {
			this.schedulingFilterService.showItemsWithEmptyMemberSlot = true;
			this.hiddenItems['members'].clear();
		}
		this.changed(null);
	}


	/**
	 * Sets provided member to 'visible'
	 */
	private showShiftModel(item : SchedulingApiShiftModel | Id) : void {
		const shiftModel = item instanceof SchedulingApiShiftModel ? item : this.api.data.shiftModels.get(item)!;

		if (this.hiddenItems['shiftModels'].contains(shiftModel)) {
			this.hiddenItems['shiftModels'].removeItem(shiftModel);
		}
	}

	/**
	 * Sets provided member to 'hidden'
	 */
	private hideShiftModel(item : SchedulingApiShiftModel | Id) : void {
		const shiftModel = item instanceof SchedulingApiShiftModel ? item : this.api.data.shiftModels.get(item)!;

		this.toastsService?.addToast({
			title: this.localizePipe?.transform('Tätigkeit ausgeblendet') ?? null,
			content: this.localizePipe?.transform('… und dazugehörige Schichten, Tauschbörsen-Einträge, Arbeitseinsätze in der Auswertung etc.') ?? '',
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
	private showMember(item : SchedulingApiMember | Id) : void {
		let member : SchedulingApiMember | null = null;
		if (item instanceof SchedulingApiMember) {
			member = item;
		} else {
			if (!this.api.isLoaded()) throw new Error(`Api should be loaded here. #ERROR1`);
			member = this.api.data.members.get(item);
			if (!member) throw new Error(`member could not be found. member.id: ${item.rawData}. #ERROR2`);
		}

		if (this.hiddenItems['members'].contains(member)) {
			this.hiddenItems['members'].removeItem(member);
		}
	}

	/**
	 * Sets provided member to 'hidden'
	 */
	private hideMember(item : SchedulingApiMember | Id) : void {
		const member = item instanceof SchedulingApiMember ? item : this.api.data.members.get(item)!;

		this.toastsService?.addToast({
			title: this.localizePipe?.transform('User ausgeblendet') ?? null,
			content: this.localizePipe?.transform('… und dazugehörige Schichten, Tauschbörsen-Einträge, Arbeitseinsätze in der Auswertung etc.') ?? '',
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
	public hiddenItemsCount(items : SchedulingApiShiftModels | SchedulingApiMembers) : number {
		if (items instanceof SchedulingApiShiftModels) return this.hiddenItems['shiftModels'].filterBy(item => !!items.get(item.id)).length;
		if (items instanceof SchedulingApiMembers) return this.hiddenItems['members'].filterBy(item => !!items.get(item.id)).length;
		return 0;
	}
}
