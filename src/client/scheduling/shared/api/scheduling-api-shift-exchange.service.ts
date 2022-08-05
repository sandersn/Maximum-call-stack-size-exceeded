import { SchedulingApiShiftExchangesBase, SchedulingApiShiftExchangeBase, SchedulingApiShiftExchangeCommunicationBase, SchedulingApiShiftExchangeState, SchedulingApiShiftExchangeCommunicationsBase, SchedulingApiShiftExchangeCommunicationSwapOffersBase, SchedulingApiShiftExchangeCommunicationAction, SchedulingApiShiftExchangeCommunicationState, SchedulingApiShiftExchangeShiftRefsBase, SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefsBase } from '@plano/shared/api';
import { SchedulingApiShiftExchangeShiftRef, SchedulingApiServiceBase, SchedulingApiShiftExchangeCommunicationSwapOffer} from '@plano/shared/api';
import { ShiftId } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { SchedulingApiShifts, SchedulingApiShiftAssignableMembers, SchedulingApiAbsences } from './scheduling-api.service';
import { SchedulingApiMember, SchedulingApiShiftModel} from './scheduling-api.service';
import { DateTime } from '../../../../shared/api/base/generated-types.ag';
import { Data } from '../../../../shared/core/data/data';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';

export class SchedulingApiShiftExchanges<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiShiftExchangesBase<ValidationMode> {
	constructor(
		public override api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/**
	 * Filters a list of Shifts by a function that returns a boolean.
	 * Returns a new list of Shifts.
	 */
	public filterBy(
		fn : (item : SchedulingApiShiftExchange) => boolean,
	) : SchedulingApiShiftExchanges {
		const result = new SchedulingApiShiftExchanges(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}

	/**
	 * Get a shift-exchange item by provided member-id and shift
	 */
	public getByShiftAndMember(shiftId : ShiftId, memberId : Id) : SchedulingApiShiftExchange | undefined {
		for (const shiftExchange of this.iterable()) {
			if (!shiftExchange.indisposedMemberId.equals(memberId)) continue;
			if (!shiftExchange.shifts.contains(shiftId)) continue;
			return shiftExchange;
		}
		return undefined;
	}

}

/**
 * Its possible that one illness report has more than one shiftRef.
 * E.g. all shiftRefs of the three days the user is ill.
 * How many ShiftExchanges should be generated then?
 */

export enum GenerateShiftExchangesMode {

	/**
	 * Create one shiftExchange for each shift that is included in the shiftRefs of the original shiftExchange
	 */
	ONE_SHIFT_EXCHANGE_FOR_EACH,

	/**
	 * Create one shiftExchange for each shift that is included in the shiftRefs of the original shiftExchange, but
	 * shifts that are part of a package should result in one new generated shiftExchange
	 */
	ONE_SHIFT_EXCHANGE_FOR_EACH_PACKAGE,
}

/**
 * Its possible that one illness report has more than one shiftRef.
 * E.g. all shiftRefs of the three days the user is ill.
 * How many absences should be generated then?
 */

export enum GenerateAbsencesMode {
	ONE_ABSENCE_FOR_ALL,
	ONE_ABSENCE_FOR_EACH,
}

/**
 * Its possible that one illness report has more than one shiftRef.
 * E.g. all shiftRefs of the three days the user is ill.
 * How many absences should be generated then?
 */

export enum GenerateAbsencesTimeSetting {
	TAKE_DURATION_FROM_SHIFT,
	OVERWRITE_DURATION,
}

/**
 * Its possible that one illness report has more than one shiftRef.
 * E.g. all shiftRefs of the three days the user is ill.
 * How many absences should be generated then?
 */

export enum GenerateAbsencesEarningSetting {
	TAKE_EARNING_FROM_EACH_SHIFT,
	OVERWRITE_EARNING,
}

/**
 * These are all the settings that can be made to generate new Absences from a illness-shiftExchange
 */

export class GenerateAbsencesOptions {
	private _generateItems : boolean | null = null;

	/**
	 * Only set this if new items should be generated. Otherwise set it to undefined
	 * Changing this resets some of the other options
	 */
	public get generateItems() : boolean | null {
		return this._generateItems ?? null;
	}
	public set generateItems(input : boolean | null) {
		if (this._generateItems !== input && input && this.mode === null) {
			this.mode = GenerateAbsencesMode.ONE_ABSENCE_FOR_ALL;
		}
		this._generateItems = input;
	}

	private _mode : GenerateAbsencesMode | null = GenerateAbsencesMode.ONE_ABSENCE_FOR_EACH;

	/**
	 * Only set this if new items should be generated. Otherwise set it to undefined
	 * Changing this resets some of the other options
	 */
	public get mode() : GenerateAbsencesMode | null {
		return this._mode;
	}
	public set mode(input : GenerateAbsencesMode | null) {
		if (this._mode !== input) {
			this.refreshEarning(input);
			this.resetStartAndEnd();
		}
		this._mode = input;
	}

	public timeSetting ?: GenerateAbsencesTimeSetting | null = null;
	public absenceStartDate : number | null = null;
	public absenceEndDate : number | null = null;
	public wholeDayEntry ?: number | null = null;
	public averageWorkingTimePerDay : number | null = null;

	public visibleToTeamMembers : boolean | null = null;

	public paid ?: boolean | null = null;
	public earningSetting ?: GenerateAbsencesEarningSetting | null;
	public earningsPerHour : number | null = null;

	constructor(generateItems : boolean) {
		this.generateItems = generateItems;
	}

	private refreshEarning(input : GenerateAbsencesMode | null) : void {
		if (input === GenerateAbsencesMode.ONE_ABSENCE_FOR_EACH) {
			this.earningSetting = null;
			return;
		}
		this.earningSetting = GenerateAbsencesEarningSetting.OVERWRITE_EARNING;
	}

	private resetStartAndEnd() : void {
		this.averageWorkingTimePerDay = null;
		this.absenceStartDate = null;
		this.absenceEndDate = null;
	}

	/**
	 * Reset all values
	 */
	public reset() : void {
		this.generateItems = false;
		this.mode = null;
		this.timeSetting = null;
		this.absenceStartDate = null;
		this.absenceEndDate = null;
		this.wholeDayEntry = null;
		this.averageWorkingTimePerDay = null;
		this.paid = null;
		this.earningSetting = null;
		this.earningsPerHour = null;
		this.visibleToTeamMembers = null;
	}
}

/**
 * These are all the settings that can be made to generate new Absences from a illness-shiftExchange
 */

export class GenerateShiftExchangesOptions {
	public mode : GenerateShiftExchangesMode | null = null;
	public daysBefore : number | null = null;

	// TODO: [PLANO-110401] 	We removed @Output() showDaysBeforeInputChange from p-input-date, which changed subscriber callback in
	// 												FormControl 'deadline', which probably made the whole deadline attribute obsolete.
	// 												Remove next line and check the compiler.
	public deadline : number | null = null;

	constructor() {
	}

	/**
	 * Reset all values
	 */
	public reset() : void {
		this.mode = null;
		this.daysBefore = null;
		this.deadline = null;
	}
}

export class SchedulingApiShiftExchange<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiShiftExchangeBase<ValidationMode> {
	constructor(
		public override api : SchedulingApiServiceBase | null,
		idRaw ?: number,
	) {
		super(api, idRaw);
	}

	/**
	 * Managers can generate new shiftExchanges from a illness report if they want to.
	 * Managers get the option to generate them in the following cases:
	 * - manager confirms a shiftExchange
	 * - manager creates a illness shiftExchange for another user
	 * - manager turns a non-illness shiftExchange of another user into illness
	 * Only set this if new items should be generated. Otherwise set it to undefined
	 */
	public generateShiftExchangesOptions : GenerateShiftExchangesOptions = new GenerateShiftExchangesOptions();

	/**
	 * Managers can generate new absences from a illness report if they want to.
	 * Managers get the option to generate them in the following cases:
	 * - manager confirms a shiftExchange
	 * - manager creates a illness shiftExchange for another user
	 * - manager turns a non-illness shiftExchange of another user into illness
	 */
	public generateAbsencesOptions : GenerateAbsencesOptions = new GenerateAbsencesOptions(false);

	private _behavesAsNewItem : boolean | null = null;

	/**
	 * When a shiftExchange gets re-opened, the form should look and behave nearly the same as a
	 * form for a completely new item. In this case we need to set
	 * shiftExchange.behavesAsNewItem = true
	 */
	public get behavesAsNewItem() : boolean {
		if (this._behavesAsNewItem !== null) return this._behavesAsNewItem;
		return this.isNewItem();
	}

	public set behavesAsNewItem(value : boolean) {
		// this.api.changed();
		this._behavesAsNewItem = value;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get indisposedMember() : SchedulingApiMember | null {
		if (this.indisposedMemberId === null) return null;
		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		if (!this.api.isLoaded()) return null;
		return this.api.data.members.get(this.indisposedMemberId);
	}

	/**
	 * Get the id of the responsible person. This can be the indisposed member or a admin if the admin created it
	 * for a member, or responded to a members illness.
	 */
	public get responsibleMemberId() : Id | null {
		if (this.isNewItem()) return this.indisposedMemberId;
		if (!this.isIllness) return this.indisposedMemberId;
		const actionEnum = SchedulingApiShiftExchangeCommunicationAction;

		const response = this.communications.findBy((item) => {
			switch (item.lastAction) {
				case actionEnum.A_REPORTED_ILLNESS:
				case actionEnum.ILLNESS_DECLINED_A_ACCEPT_WITH_SHIFT_EXCHANGE:
				case actionEnum.ILLNESS_NEEDS_CONFIRMATION_A_ACCEPT_WITH_SHIFT_EXCHANGE:
				case actionEnum.ILLNESS_CONFIRMED_WITHOUT_SHIFT_EXCHANGE_A_START_SHIFT_EXCHANGE:
				case actionEnum.ILLNESS_DECLINED_A_ACCEPT_WITHOUT_SHIFT_EXCHANGE:
				case actionEnum.ILLNESS_NEEDS_CONFIRMATION_A_ACCEPT_WITHOUT_SHIFT_EXCHANGE:
				case actionEnum.ILLNESS_NEEDS_CONFIRMATION_A_DECLINED:

					return true;
				default :
					return false;
			}
		});
		if (response) return response.communicationPartnerId;
		return null;
	}

	/**
	 * Get the member based on .responsibleMemberId
	 */
	public get responsibleMember() : SchedulingApiMember | null {
		if (this.responsibleMemberId === null) return null;
		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		if (!this.api.isLoaded()) return null;
		return this.api.data.members.get(this.responsibleMemberId);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftModel() : SchedulingApiShiftModel | null | undefined {
		if (!this.shiftRefs.length) return undefined;
		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		if (!this.api.isLoaded()) return undefined;

		const firstShiftRef = this.shiftRefs.get(0);
		if (!firstShiftRef) throw new Error('Could not get first shift ref');
		return this.api.data.shiftModels.get(firstShiftRef.id.shiftModelId);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get newAssignedMember() : SchedulingApiMember | null {
		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		if (!this.api.isLoaded()) return null;
		assumeDefinedToGetStrictNullChecksRunning(this.newAssignedMemberId, 'newAssignedMemberId');
		return this.api.data.members.get(this.newAssignedMemberId);
	}

	private _shifts = new Data<SchedulingApiShifts>(this.api);
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shifts() : SchedulingApiShifts {
		return this._shifts.get(() => {
			const shifts = new SchedulingApiShifts(this.api, false);

			for (const shiftRef of this.shiftRefs.iterable()) {
				assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
				const shift = this.api.data.shifts.get(shiftRef.id);

				if (shift) shifts.push(shift);
			}

			return shifts;
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get swappedShifts() : SchedulingApiShifts {
		const result = new SchedulingApiShifts(this.api, false);

		for (const swappedShiftRef of this.swappedShiftRefs.iterable()) {
			assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
			const swappedShift = this.api.data.shifts.get(swappedShiftRef.id);

			if (swappedShift) result.push(swappedShift);
		}

		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isClosed() : boolean {
		// If a shiftExchange gets re-opened then this is possible:
		if (this.behavesAsNewItem) return false;

		if (this.state === SchedulingApiShiftExchangeState.ACTIVE) return false;
		if (this.state === SchedulingApiShiftExchangeState.ILLNESS_NEEDS_CONFIRMATION) return false;
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isSwappedSuccessful() : boolean {
		return this.state === SchedulingApiShiftExchangeState.SWAP_SUCCESSFUL;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isBasedOnIllness() : boolean {
		if (!this.isIllness) return false;
		if (this.state === SchedulingApiShiftExchangeState.ACTIVE) return true;
		if (this.state === SchedulingApiShiftExchangeState.TAKE_SUCCESSFUL) return true;
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get relatedAbsences() : SchedulingApiAbsences {
		// If api is not defined it is probably a instance of shiftExchange for a unit test
		if (!this.api) return new SchedulingApiAbsences(null, false);

		return this.api.data.absences.filterBy((item) => {
			return item.shiftExchangeId!.equals(this.id);
		});
	}

}

export class SchedulingApiShiftExchangeCommunications<ValidationMode extends 'draft' | 'validated' = 'validated'>
	extends SchedulingApiShiftExchangeCommunicationsBase<ValidationMode> {
	constructor(
		public override api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/**
	 * Filters a list of items by a function that returns a boolean.
	 * Returns a new list of items.
	 */
	public filterBy(
		fn : (item : SchedulingApiShiftExchangeCommunication) => boolean,
	) : SchedulingApiShiftExchangeCommunications {
		const result = new SchedulingApiShiftExchangeCommunications(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}

	/**
	 * returns the item where a admin responded to a members illness report. No matter if declined or confirmed.
	 */
	public get managerResponseCommunication() : SchedulingApiShiftExchangeCommunication | null {
		return this.findBy((item) => {
			return item.lastActionIsAIllnessReview;
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get reactionsForList() : SchedulingApiShiftExchangeCommunications {
		return this.filterBy((item) => {
			if (item.communicationState === SchedulingApiShiftExchangeCommunicationState.CP_NOT_RESPONDED) return false;
			if (item.communicationState === SchedulingApiShiftExchangeCommunicationState.CP_CANNOT_SHIFT_EXCHANGE) return false;
			return true;
		});
	}
}

export class SchedulingApiShiftExchangeCommunication<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiShiftExchangeCommunicationBase<ValidationMode> {
	constructor(
		public override api : SchedulingApiServiceBase | null,
	) {
		super(api);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get indisposedMembersSelectedSO() : SchedulingApiShiftExchangeCommunicationSwapOffer | null {
		if (!this.swapOffers.length) return null;
		assumeDefinedToGetStrictNullChecksRunning(this.indisposedMembersSelectedSOId, 'indisposedMembersSelectedSOId');
		return this.swapOffers.get(this.indisposedMembersSelectedSOId);
	}

	/**
	 * It is possible that indisposed member changed mind over time. So here is a getter that sometimes needs to be
	 * checked in combination with or before checking shiftExchange.indisposedMemberPrefersSwapping.
	 */
	public get iMChangedMindWantsSwap() : boolean {
		switch (this.lastAction) {
			case SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_SWAP_CP_ACCEPT :
			case SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_SWAP_CP_CANNOT :
			case SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_SWAP_IM_DECLINE_SWAP :
			case SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_SWAP_IM_CHANGE_SWAPPED_SHIFT :
			case SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_SWAP_CP_TAKE_SHIFT_PREF_MATCH :
			case SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_SWAP_CP_TAKE_SHIFT_PREF_MISMATCH :
			case SchedulingApiShiftExchangeCommunicationAction.IM_DECLINED_SWAP_IM_SWAP_SHIFT :
				return true;
			default :
				return false;
		}
	}

	/**
	 * It is possible that indisposed member changed mind over time. So here is a getter that sometimes needs to be
	 * checked in combination with or before checking shiftExchange.indisposedMemberPrefersSwapping.
	 */
	public get iMChangedMindWantsTake() : boolean {
		switch (this.lastAction) {
			case SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_TAKE_CP_ACCEPT :
			case SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_TAKE_CP_CANNOT :
			case SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_TAKE_CP_SWAP_SHIFT :
			case SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_TAKE_IM_DECLINE_TAKE :
			case SchedulingApiShiftExchangeCommunicationAction.IM_DECLINED_TAKE_IM_TAKE_SHIFT :
				return true;
			default :
				return false;
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get communicationPartner() : SchedulingApiMember | null {
		if (this.communicationPartnerId === null) return null;
		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		if (!this.api.isLoaded()) return null;
		return this.api.data.members.get(this.communicationPartnerId);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get lastActionIsAIllnessReview() : boolean {
		switch (this.lastAction) {
			case SchedulingApiShiftExchangeCommunicationAction.A_REPORTED_ILLNESS :
			case SchedulingApiShiftExchangeCommunicationAction.ILLNESS_NEEDS_CONFIRMATION_A_DECLINED :
			case SchedulingApiShiftExchangeCommunicationAction.ILLNESS_NEEDS_CONFIRMATION_A_ACCEPT_WITH_SHIFT_EXCHANGE :
			case SchedulingApiShiftExchangeCommunicationAction.ILLNESS_NEEDS_CONFIRMATION_A_ACCEPT_WITHOUT_SHIFT_EXCHANGE :
			case SchedulingApiShiftExchangeCommunicationAction.ILLNESS_CONFIRMED_WITHOUT_SHIFT_EXCHANGE_A_START_SHIFT_EXCHANGE :
				return true;
			default :
				return false;
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get lastActionIsAGeneratedIndisposedAction() : boolean {
		switch (this.lastAction) {
			case SchedulingApiShiftExchangeCommunicationAction.CP_IS_ILL :
			case SchedulingApiShiftExchangeCommunicationAction.CP_IS_ABSENT :
			case SchedulingApiShiftExchangeCommunicationAction.CP_ASSIGNED_SAME_TIME :
			case SchedulingApiShiftExchangeCommunicationAction.CP_ASSIGNED_SAME_SHIFT :
				return true;
			default :
				return false;
		}
	}
}

export class SchedulingApiShiftExchangeCommunicationSwapOffers<ValidationMode extends 'draft' | 'validated' = 'validated'> extends
	SchedulingApiShiftExchangeCommunicationSwapOffersBase<ValidationMode> {
	constructor(
		public override api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/**
	 * Check each shiftRef if its the provided shiftId
	 */
	public containsShiftId(shiftId : ShiftId) : boolean {
		for (const item of this.iterable()) {
			if (!item.shiftRefs.contains(shiftId)) continue;
			return true;
		}
		return false;
	}

	/**
	 * Filters a list of items by a function that returns a boolean.
	 * Returns a new list of items.
	 */
	public filterBy(
		fn : (item : SchedulingApiShiftExchangeCommunicationSwapOffer) => boolean,
	) : SchedulingApiShiftExchangeCommunicationSwapOffers {
		const result = new SchedulingApiShiftExchangeCommunicationSwapOffers(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}
}

export class SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefs<ValidationMode extends 'draft' | 'validated' = 'validated'> extends
	SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefsBase<ValidationMode> {
	constructor(
		public override api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/**
	 * Get the earliest shiftRef
	 */
	public get earliestStart() : number | null {
		if (!this.length) return null;
		const firstShiftRef = this.get(0);
		if (!firstShiftRef) throw new Error('Could not get first shift ref');
		let result = firstShiftRef.id.start;

		for (const shiftRef of this.iterable()) {
			const shiftStart = shiftRef.id.start;

			if (result <= shiftStart) continue;
			result = shiftStart;
		}
		return result;
	}
}
// export class SchedulingApiShiftExchangeShiftRefs extends
// 	SchedulingApiShiftExchangeShiftRefsBase {
// 	constructor(
// 		public api : SchedulingApiServiceBase | null,
// 		removeDestroyedItems : boolean,
// 	) {
// 		super(api, removeDestroyedItems);
// 	}
// }

export class SchedulingApiShiftExchangeShiftRefs<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiShiftExchangeShiftRefsBase<ValidationMode> {
	constructor(
		public override api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	private memberIsAssignableToEachShiftRef(memberId : Id) : boolean {
		if (this.api === null) throw new Error('You can not use this method when api is null');
		if (this.length === 1) return true;
		for (const item of this.iterable()) {
			const shift = this.api.data.shifts.get(item.id);
			if (!shift) throw new Error('Could not find shift for ShiftRef');
			if (!shift.assignableMembers.contains(memberId)) return false;

			// NOTE: We don’t filter assigned members. We show an alert in frontend if user selects a assigned member.
			// if (shift.assignedMemberIds.contains(memberId)) return false;

		}
		return true;
	}

	/**
	 * A list of all assignable members for this ShiftRef
	 * Assignable are members that are assignable to each and every of the provided shiftRefs
	 */
	public get assignableMembers() : SchedulingApiShiftAssignableMembers {
		const result = new SchedulingApiShiftAssignableMembers(null, false);
		if (!this.length) return result;
		if (this.api === null) throw new Error('You can not use this method when api is null');
		if (!this.api.isLoaded()) return result;

		const firstShiftRef = this.get(0);
		if (!firstShiftRef) throw new Error('Could not get first shift ref');
		const firstShift = this.api.data.shifts.get(firstShiftRef.id);
		if (!firstShift) return result;
		const assignableMembersOfFirstShift = firstShift.assignableMembers;

		for (const assignableMember of assignableMembersOfFirstShift.iterable()) {
			if (!this.memberIsAssignableToEachShiftRef(assignableMember.memberId)) continue;
			result.push(assignableMember);
		}

		return result;
	}


	private getEarliestDateTime(property : 'start' | 'end') : DateTime | null {
		if (!this.length) return null;

		const firstShiftRef = this.get(0);
		if (!firstShiftRef) throw new Error('Could not get first shift ref');

		const getShiftRef = (shiftRef : SchedulingApiShiftExchangeShiftRef) : DateTime => {
			// If the shiftRef is new - it has no defined [property]. Taking it from shiftRef.id is a (hacky) workaround
			// eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
			const result = shiftRef[property] ? shiftRef[property] : shiftRef.id[property];
			assumeDefinedToGetStrictNullChecksRunning(result, 'result');
			return result;
		};

		let result : number = getShiftRef(firstShiftRef);
		for (const shiftRef of this.iterable()) {
			// If the shiftFef is new - it has no defined [property]. Taking it from shiftRef.id is a (hacky) workaround
			const tempResult = getShiftRef(shiftRef);
			if (result <= tempResult) continue;
			result = tempResult;
		}
		return result;
	}

	/**
	 * Get the earliest shift start
	 */
	public get earliestStart() : number | null {
		return this.getEarliestDateTime('start');
	}

	/**
	 * Get the earliest end
	 */
	public get earliestEnd() : number | null {
		return this.getEarliestDateTime('end');
	}

	/**
	 * Get the earliest shiftRef
	 */
	public get latestEnd() : number | null {
		if (!this.length) return null;
		const firstShiftRef = this.get(0);
		if (!firstShiftRef) throw new Error('Could not get first shift ref');
		let result : number | null = firstShiftRef.id.end;
		for (const shiftRef of this.iterable()) {
			if (result >= shiftRef.id.end) continue;
			result = shiftRef.id.end;
		}
		return result;
	}
}
