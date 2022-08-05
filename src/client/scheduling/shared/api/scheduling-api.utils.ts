/* eslint "@typescript-eslint/no-restricted-imports": ["error", {
	"name": "./scheduling-api.service",
	"message": "Need a class as type? Add an Interface for it in scheduling-api.interfaces.ts"
}, {
	"name": "./@plano/shared/api",
	"message": "This adds a huge import chain. Avoid it!."
}] */

import { ISchedulingApiShift } from './scheduling-api.interfaces';
import { PDictionarySourceString } from '../../../../shared/core/pipe/localize.dictionary';
import { PlanoFaIconPool } from '../../../../shared/core/plano-fa-icon-pool.enum';
import { PlanoFaIconPoolValues } from '../../../../shared/core/plano-fa-icon-pool.enum';
import { PTextColorEnum, PThemeEnum } from '../../../shared/bootstrap-styles.enum';
import { PTextColor} from '../../../shared/bootstrap-styles.enum';
import { IShiftData } from '../p-scheduling-calendar/calender-timeline-layout.types';

export enum PPaymentStatusEnum {

	/**
	 * Money need to be paid to booking person.
	 */
	CASHBACK = 'CASHBACK',

	/**
	 * Bookable has been paid completely.
	 */
	PAID = 'PAID',

	/**
	 * Bookable has been paid partially.
	 */
	INSTALMENT = 'INSTALMENT',

	/**
	 * Nothing was paid for the bookable.
	 */
	UNPAID = 'UNPAID',

	/**
	 * Bookable is free.
	 */
	FREE = 'FREE',

	/**
	 * Nothing has been paid for bookable but because status of bookable is void (e.g. canceled or booking inquiry)
	 * no payment is required at the moment.
	 */
	NO_CASHBACK = 'NO_CASHBACK',
}

export const getPaymentStatusIcon = (paymentStatus : PPaymentStatusEnum | null) : PlanoFaIconPoolValues => {
	if (paymentStatus === null) return PlanoFaIconPool.LOADING;
	if (paymentStatus === PPaymentStatusEnum.CASHBACK) return PlanoFaIconPool.OUTGOING_PAYMENT;
	return PlanoFaIconPool.BOOKING_PAYMENT_STATUS;
};

export const getPaymentStatusIconStyle = (paymentStatus : PPaymentStatusEnum | null) : PTextColor | null => {
	switch (paymentStatus) {
		case PPaymentStatusEnum.FREE :
			return PTextColorEnum.MUTED;
		case PPaymentStatusEnum.PAID :
			return PThemeEnum.SUCCESS;
		case PPaymentStatusEnum.UNPAID :
		case PPaymentStatusEnum.CASHBACK :
			return PThemeEnum.DANGER;
		case PPaymentStatusEnum.INSTALMENT :
			return PThemeEnum.WARNING;
		default :
			return null;
	}
};

export const getPaymentStatusTooltipBgClass = (paymentStatus : PPaymentStatusEnum) : 'bg-light' | 'bg-success' | 'bg-danger' | 'bg-warning' | '' => {
	switch (paymentStatus) {
		case PPaymentStatusEnum.FREE :
			return 'bg-light';
		case PPaymentStatusEnum.PAID :
			return 'bg-success';
		case PPaymentStatusEnum.UNPAID :
		case PPaymentStatusEnum.CASHBACK :
			return 'bg-danger';
		case PPaymentStatusEnum.INSTALMENT :
			return 'bg-warning';
		default :
			return '';
	}
};

/**
 * getter for the title of the status of payment
 */
export const paymentStatusTitle = (paymentStatus : PPaymentStatusEnum) : PDictionarySourceString => {
	switch (paymentStatus) {
		case null :
		case undefined :
			throw new Error(`[paymentStatus]="…" must be defined`);
		case PPaymentStatusEnum.CASHBACK :
			return 'Rückerstattung fällig';
		case PPaymentStatusEnum.NO_CASHBACK :
			return 'Keine Zahlungen offen';
		case PPaymentStatusEnum.FREE :
			return 'Kostenlose Buchung';
		case PPaymentStatusEnum.PAID :
			return 'Komplett bezahlt';
		case PPaymentStatusEnum.UNPAID :
			return 'Noch nicht bezahlt';
		case PPaymentStatusEnum.INSTALMENT :
			return 'Teils bezahlt';
		default :
			const NEVER : never = paymentStatus;
			throw new Error(`could not get paymentStatus ${NEVER}`);
	}
};

export const compareFnName = (a : string | null, b : string | null) : number => {
	if (!a) return -1;
	if (!b) return 1;
	return a.localeCompare(b);
};

export const sortShiftsForListViewFns : (Parameters<Array<ISchedulingApiShift>['sort']>[0])[] = [
	(itemA, itemB) => itemA.id.seriesId - itemB.id.seriesId,
	(itemA, itemB) => compareFnName(itemA.name ?? null, itemB.name ?? null),
	(aShift, bShift) => aShift.end - bShift.end,
	(aShift, bShift) => aShift.start - bShift.start,
];

export const sortShiftsForTimelineViewFns : (Parameters<Array<IShiftData>['sort']>[0])[] = [
	(a, b) => a.shift!.id.seriesId - b.shift!.id.seriesId,
	(a, b) => compareFnName(a.shift!.name ?? null, b.shift!.name ?? null),
	(a, b) => a.shift!.end - b.shift!.end,
	(a, b) => a.shift!.start - b.shift!.start,
];
