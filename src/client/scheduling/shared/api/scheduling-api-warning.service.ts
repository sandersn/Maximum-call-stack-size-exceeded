import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { SchedulingApiServiceBase, SchedulingApiShiftExchangeCommunicationSwapOffer } from '@plano/shared/api';
import { SchedulingApiWarningBase, SchedulingApiWarningSeverity, SchedulingApiWarningsBase } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';

export class SchedulingApiWarnings<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiWarningsBase<ValidationMode> {
	constructor(public override readonly api : SchedulingApiServiceBase | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get withSeverityFatalCount() : number {
		return this.filterBy((item) => item.severity === SchedulingApiWarningSeverity.FATAL).length;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get withSeverityInfoCount() : number {
		return this.filterBy((item) => item.severity === SchedulingApiWarningSeverity.INFO).length;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get withSeverityWarningCount() : number {
		return this.filterBy((item) => item.severity === SchedulingApiWarningSeverity.WARNING).length;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public getByOffer(offer : SchedulingApiShiftExchangeCommunicationSwapOffer) : SchedulingApiWarnings {
		assumeDefinedToGetStrictNullChecksRunning(offer, 'offer');
		return this.filterBy((item) => {
			if (!item.forSwapOfferId) throw new Error('Item has no forSwapOfferId');
			if (item.forSwapOfferId.equals(offer.id)) return true;
			if (item.forSwapOfferNewItemId === offer.newItemId) return true;
			return false;
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public getByMember(memberId : Id | null) : SchedulingApiWarnings {
		if (memberId === null) return new SchedulingApiWarnings(null, false);
		return this.filterBy((item) => item.concernsMemberId.equals(memberId));
	}

	/**
	 * Filters a list of Shifts by a function that returns a boolean.
	 * Returns a new list of Shifts.
	 */
	public filterBy( fn : (item : SchedulingApiWarning) => boolean ) : SchedulingApiWarnings {
		const result = new SchedulingApiWarnings(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}
}

export class SchedulingApiWarning<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiWarningBase<ValidationMode> {
	constructor( public override api : SchedulingApiServiceBase | null ) {
		super(api);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get theme() : PThemeEnum {
		switch (this.severity) {
			case SchedulingApiWarningSeverity.FATAL :
				return PThemeEnum.DANGER;
			case SchedulingApiWarningSeverity.INFO :
				return PThemeEnum.INFO;
			case SchedulingApiWarningSeverity.WARNING :
				return PThemeEnum.WARNING;
			default :
				throw new Error('unknown severity');
		}
	}

}
