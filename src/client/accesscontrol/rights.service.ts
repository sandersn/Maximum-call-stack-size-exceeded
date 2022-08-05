import { Injectable } from '@angular/core';
// cSpell:ignore jira
import { JiraTicketId } from '@plano/global-error-handler/jira-ticket-id.enum';
import { SentryTicketId } from '@plano/global-error-handler/sentry-ticket-id.enum';
import { MeService, SchedulingApiBooking } from '@plano/shared/api';
import { AuthenticatedApiRole } from '@plano/shared/api';
import { SchedulingApiRightGroupShiftModelRight } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { PPermissionService } from './permission.service';
import { RightEnums } from './permission.service';
import { BookingSystemRights } from './rights-enums';
import { assume, assumeDefinedToGetStrictNullChecksRunning } from '../../shared/core/null-type-utils';
import { SchedulingApiShiftExchangeShiftRefs } from '../scheduling/shared/api/scheduling-api-shift-exchange.service';
import { SchedulingApiService, SchedulingApiShiftModel, SchedulingApiMember } from '../scheduling/shared/api/scheduling-api.service';
import { SchedulingApiShift, SchedulingApiAssignmentProcess, SchedulingApiTodaysShiftDescription, SchedulingApiShiftModels } from '../scheduling/shared/api/scheduling-api.service';

@Injectable()
export class RightsService {
	constructor(
		private meService : MeService,
		private api : SchedulingApiService,
		private console : LogService,
		private pPermissionService : PPermissionService,
	) {
	}

	/**
	 * Is given member the logged in user?
	 */
	public isMe(input : SchedulingApiMember | Id) : boolean | undefined {
		if (!this.meService.isLoaded()) return undefined;

		const ID = input instanceof SchedulingApiMember ? input.id : input;
		return this.meService.data.id.equals(ID);
	}

	/**
	 * Check if this Member is Client Owner.
	 * Returns undefined, if it is currently not possible to figure it out. E.g. because meService is not loaded.
	 */
	public get isOwner() : boolean | null {
		const isOwner = this.requesterIs(AuthenticatedApiRole.CLIENT_OWNER);
		if (isOwner === null) return null;
		if (isOwner !== true) return false;
		return true;
	}

	/**
	 * @returns member object of Scheduling Api of currently logged in member.
	 */
	private get member() : SchedulingApiMember | null {
		if (!this.meService.isLoaded()) return null;

		const result = this.getCurrentMember(this.meService.data.id);
		if (!result) return null;
		return result;
	}

	/**
	 * Check if the member has a particular rights for a given shiftModel
	 */
	public can(name : RightEnums, shiftModel : SchedulingApiShiftModel) : boolean | null {
		if (!this.member) return null;
		for (const RIGHT_GROUP of this.member.rightGroups.iterable()) {

			let shiftModelRight = RIGHT_GROUP.shiftModelRights.getByShiftModel(shiftModel.id);
			if (!shiftModelRight) shiftModelRight = this.getDefaultShiftModelRight(shiftModel);

			const CAN = this.pPermissionService.getPermission(
				name,
				RIGHT_GROUP.role,
				shiftModelRight,
				!!shiftModel.assignableMembers.getByMemberId(this.meService.data.id),
			);
			if (CAN) return true;
		}
		return false;
	}

	/**
	 * If there is no specific set of rights we generate a set of default rights.
	 * These differ between members and owners.
	 */
	private	getDefaultShiftModelRight(
		shiftModel : SchedulingApiShiftModel,
	) : SchedulingApiRightGroupShiftModelRight {
		return {
			canGetManagerNotifications: this.userCanGetManagerNotifications(shiftModel),
			canRead: this.userCanRead(shiftModel),
			canWrite: this.userCanWrite(shiftModel),
			canWriteBookings: this.userCanWriteBookingsOfShiftModel(shiftModel),
		} as unknown as SchedulingApiRightGroupShiftModelRight;
	}

	/**
	 * TODO: [PLANO-35427] This happens when a admin logs out and another user logs in.
	 * News.. this also happens when a admin logs out and a MEMBER logs in.
	 * The members of the old admin are still there.
	 * The new user searches in the members of the old admin.
	 */
	private getCurrentMember(id : Id) : SchedulingApiMember | null {
		assume(this.api.isLoaded(), 'this.api.isLoaded()', 'Api must be loaded to get a current member');

		const MEMBERS = this.api.data.members;
		if (!MEMBERS.length) {
			// We assume every account should have at least one member
			this.console.error(`No members to search but api is loaded PLANO-35427 ${SentryTicketId.PLANO_FE_CY}`);

			// BUG: DONT RELOAD PAGE! If bug happens after reload we get an infinit reload loop here.
			// window.location.reload();

			return null;
		}

		const result = MEMBERS.get(id);

		if (result === null) {
			// HACK: A reload fixes the issue temporarily. This is necessary till PLANO-35427 is fixed.
			this.console.error(`Could not find own id in members PLANO-35427 ${SentryTicketId.PLANO_FE_CY}`);
			// BUG: DONT RELOAD PAGE! If bug happens after reload we get an infinit reload loop here.
			// window.location.reload();
		}

		return result;
	}

	/**
	 * @returns Can logged in user edit given `input`? null means that it can not be determined.
	 */
	public userCanWrite(
		input : SchedulingApiShift | SchedulingApiShiftModel | SchedulingApiTodaysShiftDescription,
	) : boolean | null {
		if (!this.meService.isLoaded()) return null;
		if (this.meService.data.isOwner) return true;

		const MEMBERS = this.api.data.members;

		// TODO: This could lead to SentryTicketId.PLANO_FE_CY
		if (!MEMBERS.length) {
			throw new Error('No Members available');
		}

		if (!this.member) return false;
		return this.member.canWrite(input);
	}

	/**
	 * Check if user can read this shift-model
	 */
	public userCanRead(shiftModel : SchedulingApiShiftModel) : boolean | null {
		// Members can read every course, because they don’t get courses from the api
		// when they are not assignable or don’t have read access
		if (shiftModel instanceof SchedulingApiShiftModel && shiftModel.isCourse) return true;

		if (!this.meService.isLoaded()) return null;
		// Owners can read everything
		if (this.meService.data.isOwner) return true;

		// This is a member
		if (!this.member) return false;
		return this.member.canRead(shiftModel.id) ?? null;
	}

	/**
	 * Check if user can read this shift-model
	 */
	public userCanGetManagerNotifications(item : SchedulingApiShiftModel) : boolean | undefined {
		if (!this.meService.isLoaded()) return undefined;
		// Owners can get everything
		if (this.meService.data.isOwner) return true;

		// This is a member
		const member = this.api.data.members.get(this.meService.data.id);
		if (!member) throw new Error('Could not find member');
		return member.canGetManagerNotifications(item.id);
	}

	/**
	 * Check if user can write bookings for given shift-model.
	 */
	public userCanWriteBookingsOfShiftModel(item : SchedulingApiShiftModel) : boolean | undefined {
		if (!this.meService.isLoaded()) return undefined;
		// Owners can write everything
		if (this.meService.data.isOwner) return true;

		// This is a member
		const member = this.api.data.members.get(this.meService.data.id);
		if (!member) throw new Error('Could not find member');
		return member.canWriteBookings(item);
	}

	/**
	 * @returns Can this Member write `booking`?
	 */
	public userCanWriteBooking(booking : SchedulingApiBooking) : boolean | undefined {
		if (!this.meService.isLoaded()) return undefined;
		const member = this.api.data.members.get(this.meService.data.id);
		if (!member) throw new Error('Could not find member');
		return member.canWriteBookings(booking.model);
	}

	/**
	 * Check if user can write bookings of at least one non trashed shift-model.
	 */
	public userCanWriteBookings() : boolean | null {
		if (!this.meService.isLoaded()) return null;
		if (!this.api.isLoaded()) return null;

		// Can current member write at least one shift-model?
		if (!this.member) return false;
		for (const shiftModel of this.api.data.shiftModels.iterable()) {
			if (!shiftModel.trashed && this.member.canWriteBookings(shiftModel))
				return true;
		}

		return false;
	}

	/**
	 * @returns Can this Member execute online-refunds?
	 */
	public userCanOnlineRefund(item : SchedulingApiBooking | SchedulingApiShiftModel) : boolean | undefined {
		if (!this.meService.isLoaded()) return undefined;
		const member = this.api.data.members.get(this.meService.data.id);
		if (!member) throw new Error('Could not find member');
		const shiftModel = item instanceof SchedulingApiBooking ? item.model : item;
		assumeDefinedToGetStrictNullChecksRunning(shiftModel, 'shiftModel');
		return member.canOnlineRefund(shiftModel);
	}

	/**
	 * Check if user can read any of these shift-models
	 */
	public userCanReadAny(items : SchedulingApiShiftModels) : boolean {
		for (const ITEM of items.iterable()) {
			if (this.userCanRead(ITEM)) return true;
		}
		return false;
	}

	/**
	 * Check if user can read and write booking settings
	 */
	public get canReadAndWriteBookingSystemSettings() : boolean | undefined {
		if (!this.meService.isLoaded()) return undefined;
		if (!this.api.isLoaded()) return undefined;
		if (!this.member) return false;
		const RIGHT_GROUP_IDS = this.member.rightGroupIds;
		for (const ID of RIGHT_GROUP_IDS.iterable()) {
			const rightGroup = this.api.data.rightGroups.get(ID);
			if (!rightGroup) throw new Error('Could not find rightGroup');
			if (!rightGroup.canReadAndWriteBookingSystemSettings) continue;
			return true;
		}
		return false;
	}

	/**
	 * @param shiftModelId Id of the shift
	 * Check if this Member has manager rights for this particular shiftModel.
	 */
	public hasManagerRightsForShiftModel(shiftModelId : Id) : boolean | undefined {
		if (!this.meService.isLoaded()) {
			this.console.error('[PLANO-17845] Could not get member in hasManagerRightsForShiftModel - meService is not loaded yet');
			return undefined;
		}
		if (!this.api.isLoaded()) {
			this.console.error('[PLANO-17845] Could not get member in hasManagerRightsForShiftModel - api is not loaded yet');
			return undefined;
		}
		if (this.requesterIs(AuthenticatedApiRole.CLIENT_OWNER)) return true;

		if (!this.member) return false;
		if (!this.member.canWrite(shiftModelId)) return false;
		if (!this.member.canGetManagerNotifications(shiftModelId)) return false;
		return true;
	}

	/**
	 * @returns Has the logged in user manager-rights for "member"? This returns true when logged in user has
	 * manager rights for at least one shift-model to which member is assignable.
	 */
	public hasManagerRightsForMember(member : SchedulingApiMember) : boolean | undefined {
		if (!this.meService.isLoaded()) return undefined;
		if (this.meService.data.isOwner) return true;

		for (const ASSIGNABLE_SHIFT_MODEL of member.assignableShiftModels.iterable()) {
			const SHIFT_MODEL = ASSIGNABLE_SHIFT_MODEL.shiftModel;

			// member might not have read-right for the shift-model and so SHIFT_MODEL might be "null"
			if (!SHIFT_MODEL.trashed && this.hasManagerRightsForShiftModel(SHIFT_MODEL.id))
				return true;
		}

		return false;
	}

	/**
	 * Does the logged in user have managerRights?
	 * Note that a user can be owner without manager rights
	 */
	public hasManagerRightsForAllShiftRefs(shiftRefs : SchedulingApiShiftExchangeShiftRefs) : boolean | undefined {
		if (this.requesterIs(AuthenticatedApiRole.CLIENT_OWNER)) return true;
		for (const SHIFT_REF of shiftRefs.iterable()) {
			if (!this.meService.isLoaded()) {
				this.console.error(`[${JiraTicketId.PLANO_17845}] [${SentryTicketId.PLANO_FE_59}] load meService before call hasManagerRightsForShiftModel`);
				return undefined;
			}
			if (!this.hasManagerRightsForShiftModel(SHIFT_REF.id.shiftModelId)) continue;
			return true;
		}
		return false;
	}

	/**
	 * @returns Is there at least one not trashed shift-model where the logged in user has manager rights?
	 */
	public get hasManagerRights() : boolean | undefined {
		if (this.requesterIs(AuthenticatedApiRole.CLIENT_OWNER)) return true;
		if (!this.api.isLoaded()) return undefined;
		if (!this.meService.isLoaded()) return undefined;
		for (const SHIFT_MODEL of this.api.data.shiftModels.iterable()) {
			if (!SHIFT_MODEL.trashed && this.hasManagerRightsForShiftModel(SHIFT_MODEL.id)) return true;
		}
		return false;
	}

	/**
	 * Check if user can get Admin Notifications for this shift or shift-model
	 */
	public canGetManagerNotifications(input : SchedulingApiShift | SchedulingApiShiftModel) : boolean | undefined {
		if (!this.meService.isLoaded()) return undefined;
		if (this.meService.data.isOwner) return true;
		const member = this.api.data.members.get(this.meService.data.id);
		if (!member) throw new Error('Could not find member');
		return member.canGetManagerNotifications(input);
	}

	/**
	 * Check if user is allowed to write assignmentProcesses
	 */
	public get userCanEditAssignmentProcesses() : boolean | undefined {
		if (!this.meService.isLoaded()) return undefined;

		// Owners can do everything
		if (this.meService.data.isOwner) return true;

		return this.hasManagerRights;
	}

	/**
	 * Check if user is allowed to write given assignmentProcess
	 */
	public userCanEditAssignmentProcess(process : SchedulingApiAssignmentProcess) : boolean | null {
		if (Config.IS_MOBILE) return false;

		if (!this.api.isLoaded()) return null;
		if (!this.meService.isLoaded()) return null;

		// Owners can do everything
		if (this.meService.data.isOwner) return true;

		return process.canEdit;
	}

	/**
	 * Check if this Member can edit this shift.
	 */
	public userCanEditAssignments(shift : SchedulingApiShift) : boolean {
		if (this.isOwner) return true;

		assumeDefinedToGetStrictNullChecksRunning(shift.model, 'shift.model', 'Can not figure out if userCanEditAssignments when model is not defined');
		if (
			this.userCanWrite(shift.model) &&
			// HACK: Next line is a hack for PLANO-4625
			shift.assignedMemberIds.rawData
		) return true;

		return false;
	}

	/**
	 * Check if user is allowed to write absences
	 */
	public get userCanWriteAbsences() : boolean | undefined {
		if (!this.meService.isLoaded()) return undefined;
		if (this.meService.data.isOwner) return true;
		return false;
	}

	/**
	 * Check if user is allowed to see earnings
	 */
	public userCanSeeEarningsForShiftModel(shiftModelId : Id, member ?: SchedulingApiMember) : boolean | undefined {
		if (!this.meService.isLoaded()) return undefined;
		if (this.meService.data.isOwner) return true;
		if (member?.id.equals(this.meService.data.id)) return true;
		if (this.hasManagerRightsForShiftModel(shiftModelId)) return true;
		return false;
	}

	/**
	 * @param member The member whose earnings should be shown.
	 * @returns Can logged in user see earnings of "member"? This is true when logged in user is the member himself or
	 * has manager-rights for that member.
	 */
	public userCanSeeEarningsOfMember(member : SchedulingApiMember) : boolean | undefined {
		return this.isMe(member) ?? this.hasManagerRightsForMember(member);
	}

	/**
	 * Check if user is allowed to export the statistics of bookings.
	 * The statistics include sensible data like member earnings.
	 */
	public get userCanExportBookingStatistics() : boolean | undefined {
		if (!this.meService.isLoaded()) return undefined;
		if (this.meService.data.isOwner) return true;

		return this.hasManagerRights;
	}

	/**
	 * Check if this Member can edit bookings.
	 */
	public get userCanManageBookings() : boolean {
		for (const SHIFT_MODEL of this.api.data.shiftModels.filterBy(item => item.isCourse).iterable()) {
			if (this.can(BookingSystemRights.editBookings, SHIFT_MODEL)) return true;

			// TODO: Next line is probably obsolete
			if (this.userCanWrite(SHIFT_MODEL)) return true;

		}
		return false;
	}

	/**
	 * Check if this Member can write at least one shiftModel.
	 */
	public get userCanWriteAnyShiftModel() : boolean | undefined {
		if (this.requesterIs(AuthenticatedApiRole.CLIENT_OWNER)) return true;
		if (!this.meService.isLoaded()) return undefined;
		if (!this.api.isLoaded()) return undefined;
		if (!this.api.data.members.length) {

			// TODO: turn back to error when PLANO-16825 is done
			this.console.error('Loading current member went wrong because list is empty.');

			return undefined;
		}
		if (!this.member) return false;
		if (this.member.canWriteAnyShiftModel) return true;
		return false;
	}

	/**
	 * Does the requester match at least one of the provided roles?
	 * You can also provide a Id of a Member to check if the requester equals this id.
	 */
	public requesterIs(...inputArray : (AuthenticatedApiRole | Id)[]) : boolean | null {
		if (!this.meService.isLoaded()) return null;
		for (const INPUT of inputArray) {
			if (INPUT instanceof Id) {
				if (!this.isMe(INPUT)) continue;
				return true;
			}

			if (INPUT === this.meService.data.role)
				return true;
		}
		return false;
	}
}
