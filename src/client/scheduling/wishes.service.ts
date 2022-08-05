import { Injectable } from '@angular/core';
import { SchedulingApiShiftMemberPrefValue} from '@plano/shared/api';
import { SchedulingApiMember, SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiShift } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { RightsService } from '../accesscontrol/rights.service';

@Injectable()
export class PWishesService {
	public visible : boolean = false;
	public member : SchedulingApiMember | undefined;
	private shift : SchedulingApiShift | undefined;

	constructor(
		private me : MeService,
		public api : SchedulingApiService,
		private rightsService : RightsService,
	) {
	}

	/**
	 * Get the whishes for shift by member of for member by shift
	 * returns false if there was no pref data for this member|shift
	 */
	public getWish(
		item : SchedulingApiShift | SchedulingApiMember,
	) : SchedulingApiShiftMemberPrefValue | boolean | undefined {
		let shift : SchedulingApiShift | null = null;
		let member : SchedulingApiMember | null = null;
		if (item instanceof SchedulingApiShift && this.member) {
			shift = item;
			member = this.member;
		} else if (item instanceof SchedulingApiMember && !!this.shift && this.shift.rawData) {
			shift = this.shift;
			member = item;
		}

		if (!shift || !member) return undefined;

		const me = this.api.data.members.get(this.me.data.id);
		if (me === null) throw new Error('Could not find me');
		if (
			this.me.isLoaded() && this.me.data.isOwner ||
			me.canWrite(shift)
		) {
			for (const memberPref of shift.memberPrefs.iterable()) {
				if (memberPref.memberId.equals(member.id)) {
					return memberPref.pref;
				}
			}
		} else if (shift.myPref !== null) {
			return shift.myPref;
		}

		// No preferences found
		return false;
	}

	private prevWishesItem : SchedulingApiShift | SchedulingApiMember | null = null;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public resetToPreviousItem() : void {
		if (this.prevWishesItem === null) return;
		this.item = this.prevWishesItem;
	}

	public set item(input : SchedulingApiMember | SchedulingApiShift | null) {
		if (this.member) this.prevWishesItem = this.member;
		if (this.shift) this.prevWishesItem = this.shift;

		if (!input) {
			this.shift = undefined;
			this.member = undefined;
		}
		if (input instanceof SchedulingApiMember) {
			this.shift = undefined;
			this.member = input;
		} else if (input instanceof SchedulingApiShift) {
			this.shift = input;
			this.member = undefined;
		}

		this.visible = !!input;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get item() : SchedulingApiMember | SchedulingApiShift | null {
		if (this.member) return this.member;
		if (this.shift) return this.shift;
		return null;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public isAssignable(item : SchedulingApiShift | SchedulingApiMember) : boolean {
		// Non-Members don’t get shifts where they are not assignable
		if (this.member && this.me.isLoaded() && !this.me.data.isOwner) return true;

		let shift : SchedulingApiShift | null = null;
		let member : SchedulingApiMember | null = null;
		if (item instanceof SchedulingApiShift && this.member) {
			shift = item;
			member = this.member;
		} else if (item instanceof SchedulingApiMember && !!this.shift && this.shift.rawData) {
			shift = this.shift;
			member = item;
		}

		if (!shift) return false;
		if (!member) return false;

		return shift.assignableMembers.containsMember(member);
	}

	/**
	 * How many undefined wishes are there for this user in total?
	 */
	public get freeWishesCount() : number | undefined {
		const assignmentProcesses = this.api.data.assignmentProcesses.filterBy((process) => {
			return process.state === SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES;
		});
		if (!assignmentProcesses.length) { return undefined; }

		let result = 0;
		for (const assignmentProcess of assignmentProcesses.iterable()) {
			result += assignmentProcess.todoShiftsCountCurrentView;
			result += assignmentProcess.todoShiftsCountRightView;
			result += assignmentProcess.todoShiftsCountLeftView;
		}

		// If the user has been assignable but all wishes are set, this function has to return 0 instead of undefined
		if (!this.someShiftModelIsAssignableToCurrentUser()) return undefined;

		return result;
	}

	/**
	 * Are there any shifts where user is assignable?
	 */
	private someShiftModelIsAssignableToCurrentUser() : boolean {

		// BUG: This function is not complete because...
		// We assumed that members only get shiftmodels where they are assignable, but it this assumption is outdated since
		// we have "canRead". If a member has canRead on a shiftModel where he is not assignable, then it breaks.
		// Currently the api does not provide enough data to fix this.

		// NOTE: non-owners only get shiftmodels where they are assignable.
		if (!this.rightsService.isOwner) {
			for (const assignmentProcess of this.api.data.assignmentProcesses.iterable()) {
				if (assignmentProcess.state !== SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES) continue;
				return true;
			}
		}
		if (!this.rightsService.isOwner) return !!this.api.data.shiftModels.length;

		// BUG: Wrong. Correct would be: check every fucking shift.assignableMembers of the related processes. Because its
		// possible that admin is assignable to the shift but not the shiftModel
		// BUG: Returns true even if these shiftmodels are not part of the affected processes

		// NOTE: owners this if for the owners.
		for (const shiftModel of this.api.data.shiftModels.iterable()) {
			const userIsAssignable = shiftModel.assignableMembers.contains(this.me.data.id);
			if (userIsAssignable) return true;
		}

		return false;
	}
}
