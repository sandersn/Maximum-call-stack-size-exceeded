/* eslint "@typescript-eslint/no-restricted-imports": ["error", {
    "name": "./scheduling-api.service",
    "message": "Need a class as type? Add an Interface for it in scheduling-api.interfaces.ts"
}, {
    "name": "./@plano/shared/api",
    "message": "This adds a huge import chain. Avoid it!."
}] */
import { PlanoFaIconPool } from '../../../../shared/core/plano-fa-icon-pool.enum';
import { PTextColorEnum, PThemeEnum } from '../../../shared/bootstrap-styles.enum';
export var PPaymentStatusEnum;
(function (PPaymentStatusEnum) {
    /**
     * Money need to be paid to booking person.
     */
    PPaymentStatusEnum["CASHBACK"] = "CASHBACK";
    /**
     * Bookable has been paid completely.
     */
    PPaymentStatusEnum["PAID"] = "PAID";
    /**
     * Bookable has been paid partially.
     */
    PPaymentStatusEnum["INSTALMENT"] = "INSTALMENT";
    /**
     * Nothing was paid for the bookable.
     */
    PPaymentStatusEnum["UNPAID"] = "UNPAID";
    /**
     * Bookable is free.
     */
    PPaymentStatusEnum["FREE"] = "FREE";
    /**
     * Nothing has been paid for bookable but because status of bookable is void (e.g. canceled or booking inquiry)
     * no payment is required at the moment.
     */
    PPaymentStatusEnum["NO_CASHBACK"] = "NO_CASHBACK";
})(PPaymentStatusEnum || (PPaymentStatusEnum = {}));
export const getPaymentStatusIcon = (paymentStatus) => {
    if (paymentStatus === null)
        return PlanoFaIconPool.LOADING;
    if (paymentStatus === PPaymentStatusEnum.CASHBACK)
        return PlanoFaIconPool.OUTGOING_PAYMENT;
    return PlanoFaIconPool.BOOKING_PAYMENT_STATUS;
};
export const getPaymentStatusIconStyle = (paymentStatus) => {
    switch (paymentStatus) {
        case PPaymentStatusEnum.FREE:
            return PTextColorEnum.MUTED;
        case PPaymentStatusEnum.PAID:
            return PThemeEnum.SUCCESS;
        case PPaymentStatusEnum.UNPAID:
        case PPaymentStatusEnum.CASHBACK:
            return PThemeEnum.DANGER;
        case PPaymentStatusEnum.INSTALMENT:
            return PThemeEnum.WARNING;
        default:
            return null;
    }
};
export const getPaymentStatusTooltipBgClass = (paymentStatus) => {
    switch (paymentStatus) {
        case PPaymentStatusEnum.FREE:
            return 'bg-light';
        case PPaymentStatusEnum.PAID:
            return 'bg-success';
        case PPaymentStatusEnum.UNPAID:
        case PPaymentStatusEnum.CASHBACK:
            return 'bg-danger';
        case PPaymentStatusEnum.INSTALMENT:
            return 'bg-warning';
        default:
            return '';
    }
};
/**
 * getter for the title of the status of payment
 */
export const paymentStatusTitle = (paymentStatus) => {
    switch (paymentStatus) {
        case null:
        case undefined:
            throw new Error(`[paymentStatus]="…" must be defined`);
        case PPaymentStatusEnum.CASHBACK:
            return 'Rückerstattung fällig';
        case PPaymentStatusEnum.NO_CASHBACK:
            return 'Keine Zahlungen offen';
        case PPaymentStatusEnum.FREE:
            return 'Kostenlose Buchung';
        case PPaymentStatusEnum.PAID:
            return 'Komplett bezahlt';
        case PPaymentStatusEnum.UNPAID:
            return 'Noch nicht bezahlt';
        case PPaymentStatusEnum.INSTALMENT:
            return 'Teils bezahlt';
        default:
            const NEVER = paymentStatus;
            throw new Error(`could not get paymentStatus ${NEVER}`);
    }
};
export const compareFnName = (a, b) => {
    if (!a)
        return -1;
    if (!b)
        return 1;
    return a.localeCompare(b);
};
export const sortShiftsForListViewFns = [
    (itemA, itemB) => itemA.id.seriesId - itemB.id.seriesId,
    (itemA, itemB) => { var _a, _b; return compareFnName((_a = itemA.name) !== null && _a !== void 0 ? _a : null, (_b = itemB.name) !== null && _b !== void 0 ? _b : null); },
    (aShift, bShift) => aShift.end - bShift.end,
    (aShift, bShift) => aShift.start - bShift.start,
];
export const sortShiftsForTimelineViewFns = [
    (a, b) => a.shift.id.seriesId - b.shift.id.seriesId,
    (a, b) => { var _a, _b; return compareFnName((_a = a.shift.name) !== null && _a !== void 0 ? _a : null, (_b = b.shift.name) !== null && _b !== void 0 ? _b : null); },
    (a, b) => a.shift.end - b.shift.end,
    (a, b) => a.shift.start - b.shift.start,
];
//# sourceMappingURL=scheduling-api.utils.js.map