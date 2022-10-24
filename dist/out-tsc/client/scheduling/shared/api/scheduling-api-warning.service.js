import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { SchedulingApiWarningBase, SchedulingApiWarningSeverity, SchedulingApiWarningsBase } from '@plano/shared/api';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
export class SchedulingApiWarnings extends SchedulingApiWarningsBase {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems);
        this.api = api;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get withSeverityFatalCount() {
        return this.filterBy((item) => item.severity === SchedulingApiWarningSeverity.FATAL).length;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get withSeverityInfoCount() {
        return this.filterBy((item) => item.severity === SchedulingApiWarningSeverity.INFO).length;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get withSeverityWarningCount() {
        return this.filterBy((item) => item.severity === SchedulingApiWarningSeverity.WARNING).length;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    getByOffer(offer) {
        assumeDefinedToGetStrictNullChecksRunning(offer, 'offer');
        return this.filterBy((item) => {
            if (!item.forSwapOfferId)
                throw new Error('Item has no forSwapOfferId');
            if (item.forSwapOfferId.equals(offer.id))
                return true;
            if (item.forSwapOfferNewItemId === offer.newItemId)
                return true;
            return false;
        });
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    getByMember(memberId) {
        if (memberId === null)
            return new SchedulingApiWarnings(null, false);
        return this.filterBy((item) => item.concernsMemberId.equals(memberId));
    }
    /**
     * Filters a list of Shifts by a function that returns a boolean.
     * Returns a new list of Shifts.
     */
    filterBy(fn) {
        const result = new SchedulingApiWarnings(this.api, false);
        for (const item of this.iterable()) {
            if (!fn(item))
                continue;
            result.push(item);
        }
        return result;
    }
}
export class SchedulingApiWarning extends SchedulingApiWarningBase {
    constructor(api) {
        super(api);
        this.api = api;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get theme() {
        switch (this.severity) {
            case SchedulingApiWarningSeverity.FATAL:
                return PThemeEnum.DANGER;
            case SchedulingApiWarningSeverity.INFO:
                return PThemeEnum.INFO;
            case SchedulingApiWarningSeverity.WARNING:
                return PThemeEnum.WARNING;
            default:
                throw new Error('unknown severity');
        }
    }
}
//# sourceMappingURL=scheduling-api-warning.service.js.map