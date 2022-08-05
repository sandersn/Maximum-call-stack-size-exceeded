import { Injectable } from '@angular/core';
import { AbsenceService } from '@plano/client/shared/absence.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiAccountingPeriod} from '@plano/shared/api';
import { SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefs } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiService, SchedulingApiMember, SchedulingApiShift, SchedulingApiAccountingPeriods } from '@plano/shared/api';
import { SchedulingApiShiftExchangeCommunicationSwapOffers, SchedulingApiShiftExchangeShiftRefs } from '@plano/shared/api';
import { SchedulingApiShiftExchangeSwappedShiftRefs } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPoolValues } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { FaIcon } from '../../../shared/core/component/fa-icon/fa-icon-types';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../shared/core/null-type-utils';
import { PThemeEnum } from '../bootstrap-styles.enum';
import { PAlertTheme} from '../bootstrap-styles.enum';
import { PossibleShiftPickerValueType } from '../p-shift-picker/shift-picker-picked-offers/shift-picker-picked-offers.component';

/** Type to feed toasts or alerts with */
export type ErrorArray = ErrorItem[];

/** Type to feed toast or alert with */
export interface ErrorItem {
	type : PAlertTheme;
	icon ?: FaIcon;
	text : string;
	dismissable ?: boolean;
}

/**
 * All special options that can be set for the filter service
 */

@Injectable()
export class ShiftMemberExchangeService {
	constructor(
		private api : SchedulingApiService,
		private absenceService : AbsenceService,
		private rightsService : RightsService,
		private console : LogService,
		private pMoment : PMomentService,
		private localize : LocalizePipe,
	) {}

	private postExpectedShiftEarningsForShift(
		member : SchedulingApiMember,
		shift : SchedulingApiShift,
	) : number {
		const duration = shift.end - shift.start;
		const assignableMember = shift.assignableMembers.getByMember(member);
		assumeDefinedToGetStrictNullChecksRunning(assignableMember, 'assignableMember');
		return assignableMember.hourlyEarnings *
			this.pMoment.duration(duration).asHours();
	}

	private postExpectedShiftEarningsForShiftRefs(
		member : SchedulingApiMember,
		shiftRefs : (
			SchedulingApiShiftExchangeShiftRefs |
			SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefs |
			SchedulingApiShiftExchangeSwappedShiftRefs
		),
		accountingPeriod : SchedulingApiAccountingPeriod,
	) : number {
		let result : number = 0;
		for (const shiftRef of shiftRefs.iterable()) {
			const shift = this.api.data.shifts.get(shiftRef.id);

			assumeDefinedToGetStrictNullChecksRunning(shift, 'shift');
			if (accountingPeriod.start > shift.end) continue;
			if (accountingPeriod.end < shift.start) continue;

			result += this.postExpectedShiftEarningsForShift(member, shift);
		}
		return result;
	}

	private postExpectedShiftEarningsForSwapOffers(
		member : SchedulingApiMember,
		offers : SchedulingApiShiftExchangeCommunicationSwapOffers,
		accountingPeriod : SchedulingApiAccountingPeriod,
	) : number {
		let result : number = 0;
		for (const offer of offers.iterable()) {
			result += this.postExpectedShiftEarningsForShiftRefs(member, offer.shiftRefs, accountingPeriod);
		}
		return result;
	}

	private postExpectedShiftEarnings(
		member : SchedulingApiMember,
		input : SchedulingApiShift | PossibleShiftPickerValueType,
		accountingPeriod : SchedulingApiAccountingPeriod,
	) : number | null {
		if (input instanceof SchedulingApiShift) {
			if (accountingPeriod.start > input.end) return null;
			if (accountingPeriod.end < input.start) return null;
			return this.postExpectedShiftEarningsForShift(member, input);
		} else if (
			input instanceof SchedulingApiShiftExchangeCommunicationSwapOffers
		) {
			return this.postExpectedShiftEarningsForSwapOffers(member, input, accountingPeriod);
		} else if (
			input instanceof SchedulingApiShiftExchangeShiftRefs ||
			input instanceof SchedulingApiShiftExchangeSwappedShiftRefs
		) {
			return this.postExpectedShiftEarningsForShiftRefs(member, input, accountingPeriod);
		}

		if (Config.DEBUG) throw new Error('unknown type in postExpectedShiftEarnings');
		return null;
	}

	/**
	 * Get the accountingPeriods which contains the shifts.
	 */
	private relatedAccountingPeriods(
		input : SchedulingApiShift | PossibleShiftPickerValueType,
	) : SchedulingApiAccountingPeriods {
		if (!this.api.data.accountingPeriods.length) return new SchedulingApiAccountingPeriods(null, false);
		if (input instanceof SchedulingApiShift) {
			return this.api.data.accountingPeriods.filterBy(item => {
				if (item.start > input.end) return false;
				if (item.end < input.start) return false;
				return true;
			});
		} else if (input instanceof SchedulingApiShiftExchangeShiftRefs) {
			return this.api.data.accountingPeriods.filterBy(item => {
				for (const shiftRef of input.iterable()) {
					if (item.start > shiftRef.id.end) return false;
					if (item.end < shiftRef.id.start) return false;

					return true;
				}
				return false;
			});
		}
		throw new Error('relatedAccountingPeriods: unsupported type');
	}

	/**
	 * Amount of money the member earns if he/she gets the shift(s)
	 */
	private postExpectedMemberEarnings(
		member : SchedulingApiMember,
		input : SchedulingApiShift | PossibleShiftPickerValueType,
		accountingPeriod ?: SchedulingApiAccountingPeriod,
	) : number | null {
		const period = accountingPeriod ?? this.relatedAccountingPeriods(input).get(0);
		if (!period) return null;

		const expectedMemberEarnings = this.expectedMemberEarnings(member, input, period);
		// eslint-disable-next-line unicorn/prefer-number-properties
		if (expectedMemberEarnings === null || isNaN(expectedMemberEarnings)) {
			if (Config.DEBUG) this.console.error('expectedMemberEarnings is NaN');
			return null;
		}

		const postExpectedShiftEarnings = this.postExpectedShiftEarnings(member, input, period);

		// eslint-disable-next-line unicorn/prefer-number-properties
		if (postExpectedShiftEarnings === null || isNaN(postExpectedShiftEarnings)) {
			if (Config.DEBUG) this.console.error('postExpectedShiftEarnings is NaN or null');
			return null;
		}

		return expectedMemberEarnings + postExpectedShiftEarnings;
	}

	/**
	 * Get the expected earnings for this member at the time the shift happens.
	 */
	private expectedMemberEarningsAtTimeOfShift(
		member : SchedulingApiMember,
		shift : SchedulingApiShift,
	) : number | null {
		const period = this.relatedAccountingPeriods(shift).get(0);
		assumeNonNull(period);

		const expectedMemberData = period.expectedMemberData.getByMember(member);
		return expectedMemberData?.earnings ?? null;
	}

	private expectedMemberEarningsForShiftRefs(
		member : SchedulingApiMember,
		shiftRefs : (
			SchedulingApiShiftExchangeShiftRefs |
			SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefs |
			SchedulingApiShiftExchangeSwappedShiftRefs
		),
		accountingPeriod : SchedulingApiAccountingPeriod,
	) : number {
		let result : number = 0;
		for (const shiftRef of shiftRefs.iterable()) {
			const shift = this.api.data.shifts.get(shiftRef.id);
			assumeNonNull(shift);

			if (accountingPeriod.start > shift.end) continue;
			if (accountingPeriod.end < shift.start) continue;

			const expectedEarnings = this.expectedMemberEarningsAtTimeOfShift(member, shift);

			result += expectedEarnings ?? 0;
		}
		return result;
	}

	private expectedMemberEarningsForSwapOffers(
		member : SchedulingApiMember,
		offers : SchedulingApiShiftExchangeCommunicationSwapOffers,
		accountingPeriod : SchedulingApiAccountingPeriod,
	) : number {
		let result : number = 0;
		for (const offer of offers.iterable()) {
			result += this.expectedMemberEarningsForShiftRefs(member, offer.shiftRefs, accountingPeriod);
		}
		return result;
	}

	private expectedMemberEarnings(
		member : SchedulingApiMember,
		input : SchedulingApiShift | PossibleShiftPickerValueType,
		accountingPeriod : SchedulingApiAccountingPeriod,
	) : number | null {
		if (input instanceof SchedulingApiShift) {
			return this.expectedMemberEarningsAtTimeOfShift(member, input);
		} else if (input instanceof SchedulingApiShiftExchangeCommunicationSwapOffers) {
			return this.expectedMemberEarningsForSwapOffers(member, input, accountingPeriod);
		} else if (
			input instanceof SchedulingApiShiftExchangeShiftRefs ||
			input instanceof SchedulingApiShiftExchangeSwappedShiftRefs
		) {
			return this.expectedMemberEarningsForShiftRefs(member, input, accountingPeriod);
		}
		if (Config.DEBUG) {
			// This case was unhandled before we turned on strictNullChecks. It is a potential bug.
			// Not sure if it is possible and how it should be handled.
			throw new Error('Not implemented yet');
		}
		return null;
	}

	/**
	 * Sky… eh… maxMonthlyEarnings is the limit
	 */
	private assignmentExceedsEarningLimit(
		member : SchedulingApiMember,
		input : SchedulingApiShift | PossibleShiftPickerValueType,
		accountingPeriod ?: SchedulingApiAccountingPeriod,
	) : boolean | null {

		/* TODO: [PLANO-3464] */

		if (accountingPeriod) {
			const postExpectedMemberEarnings = this.postExpectedMemberEarnings(member, input, accountingPeriod);
			if (postExpectedMemberEarnings === null) return false;
			return postExpectedMemberEarnings > member.maxMonthlyEarnings;
		} else if (input instanceof SchedulingApiShift) {
			const period : SchedulingApiAccountingPeriod = this.relatedAccountingPeriods(input).get(0)!;
			const postExpectedMemberEarnings = this.postExpectedMemberEarnings(member, input, period);
			if (postExpectedMemberEarnings === null) return false;
			return postExpectedMemberEarnings > member.maxMonthlyEarnings;
		}

		for (const relatedAccountingPeriod of this.relatedAccountingPeriods(input).iterable()) {
			const postExpectedMemberEarnings = this.postExpectedMemberEarnings(member, input, relatedAccountingPeriod);
			if (postExpectedMemberEarnings === null) return false;
			return postExpectedMemberEarnings > member.maxMonthlyEarnings;
		}

		if (Config.DEBUG) {
			// This case was unhandled before we turned on strictNullChecks. It is a potential bug.
			// Not sure if it is possible and how it should be handled.
			throw new Error('Not implemented yet');
		}
		return null;
	}

	/**
	 * Check if there is another assignment that conflicts whit this one
	 */
	private isAlreadyAssignedSomewhereElse(
		input : SchedulingApiMember | Id | null,
		inputShift : SchedulingApiShift,
	) : boolean | null {
		const memberId : Id | null = input instanceof SchedulingApiMember ? input.id : input;
		if (!memberId) return null;

		const ITEMS = this.api.data.shifts.filterBy(item => {
			if (!item.overlaps(inputShift.start, inputShift.end)) return false;
			if (!item.assignedMemberIds.contains(memberId)) return false;
			return true;
		});

		return !!ITEMS.length;
	}

	/**
	 * Get an array of errors
	 */
	public errors(input : SchedulingApiMember | Id | null, shift : SchedulingApiShift) : ErrorArray {
		const result : ErrorArray = [];
		if (!input) return result;
		if (!this.api.isLoaded()) return result;

		const member = input instanceof Id ? this.api.data.members.get(input) : input;
		if (!member) return result;

		const isAbsent = this.getIsAbsentWarning(member, shift);
		if (isAbsent) result.push(isAbsent);

		const assignedSomewhereElse = this.getIsAlreadyAssignedSomewhereElseWarning(member, shift);
		if (assignedSomewhereElse) result.push(assignedSomewhereElse);

		for (const relatedAccountingPeriod of this.relatedAccountingPeriods(shift).iterable()) {
			const exceedsEarningLimit = this.getExceedsEarningLimitWarning(member, shift, relatedAccountingPeriod);
			if (exceedsEarningLimit) result.push(exceedsEarningLimit);
		}

		return result;
	}

	private getIsAlreadyAssignedSomewhereElseWarning(member : SchedulingApiMember, shift : SchedulingApiShift) : {
		type : PAlertTheme,
		text : string,
	} | null {
		if (!this.isAlreadyAssignedSomewhereElse(member, shift)) return null;

		let text : string;
		if (this.rightsService.isMe(member)) {
			text = this.localize.transform('Du arbeitest zu der Zeit schon in einer anderen Schicht.');
		} else {
			text = this.localize.transform('${firstName} arbeitet zu der Zeit schon in einer anderen Schicht.', { firstName: member.firstName });
		}
		return {
			type: PThemeEnum.WARNING,
			text: text,
		};
	}

	private getExceedsEarningLimitWarning(
		member : SchedulingApiMember,
		shift : SchedulingApiShift,
		accountingPeriod : SchedulingApiAccountingPeriod,
	) : {
		type : PAlertTheme,
		text : string,
	} | null {
		if (!this.rightsService.userCanSeeEarningsForShiftModel(shift.shiftModelId, member)) return null;
		if (!this.assignmentExceedsEarningLimit(member, shift)) return null;

		const EXPECTED_EARNINGS = this.expectedMemberEarnings(member, shift, accountingPeriod);
		const TEXT = this.localize.transform('${MEMBER} ${WOULD} mit dieser Schicht den Maximallohn ${FURTHER} überschreiten.', {
			MEMBER: this.rightsService.isMe(member) ? this.localize.transform('Du') : member.firstName,
			WOULD: this.rightsService.isMe(member) ? this.localize.transform('würdest') : this.localize.transform('würde'),
			FURTHER: EXPECTED_EARNINGS !== null && EXPECTED_EARNINGS > member.maxMonthlyEarnings /* TODO: [PLANO-3464] */ ? `${this.localize.transform('weiter')} ` : '',
		});

		return {
			type: PThemeEnum.WARNING,
			text: TEXT,
		};
	}

	private getIsAbsentWarning(member : SchedulingApiMember, shift : SchedulingApiShift) : {
		type : PAlertTheme,
		icon : PlanoFaIconPoolValues,
		text : string,
	} | null {
		const absenceIcon = this.absenceService.absenceTypeIconName(member.id, shift);
		if (!absenceIcon) return null;

		let text : string;
		if (this.rightsService.isMe(member)) {
			text = this.localize.transform('Du hast für die gewählte Zeit einen Abwesenheitseintrag.');
		} else {
			text = this.localize.transform('${firstName} hat für die gewählte Zeit einen Abwesenheitseintrag.', { firstName: member.firstName });
		}
		return {
			type: PThemeEnum.DANGER,
			icon: absenceIcon,
			text: text,
		};
	}
}
