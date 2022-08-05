import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { SchedulingApiShiftModelCancellationPolicyFeePeriod } from '../../../../../shared/api';
import { PThemeEnum } from '../../../bootstrap-styles.enum';

@Component({
	selector: 'p-fee-period-time-text',
	templateUrl: './fee-period-time-text.component.html',
	styleUrls: ['./fee-period-time-text.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeePeriodTimeTextComponent {
	@Input() public start : SchedulingApiShiftModelCancellationPolicyFeePeriod['start'] = null;
	@Input() public end : SchedulingApiShiftModelCancellationPolicyFeePeriod['end'] = null;

	constructor(
	) {
	}

	public PThemeEnum = PThemeEnum;

	/**
	 * Some identifier for the text that should be shown.
	 * The decision which text should be shown is quite complex. So we need this method.
	 * But we don’t want to translate in ts. We want the i18n feature of angular templates. Thus we needed a Id.
	 */
	public get textId() : 'zeroToNull' | 'nullToY' | 'XToY' | 'XToNull' | null {
		if (this.start === 0 && this.end === null) return 'zeroToNull';
		if ((this.start === null || this.start >= 1) && this.end === null) return 'XToNull';
		if (this.start === null && this.end !== null) return 'nullToY';
		if (this.start !== null && this.end !== null) return 'XToY';
		// throw new Error('could not calculate text id');
		return null;
	}
}


