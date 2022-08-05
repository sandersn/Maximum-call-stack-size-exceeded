import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { SchedulingApiBooking } from '../../../../shared/api';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { PThemeEnum } from '../../../shared/bootstrap-styles.enum';

@Component({
	selector: 'p-open-amount-display[currentlyPaid][amountToPay]',
	templateUrl: './open-amount-display.component.html',
	styleUrls: ['./open-amount-display.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenAmountDisplayComponent {
	@Input() public readonly amountToPay : SchedulingApiBooking['amountToPay'] = null;
	@Input() public readonly currentlyPaid ! : SchedulingApiBooking['currentlyPaid'];
	@Input() public openAmount : ReturnType<SchedulingApiBooking['getOpenAmount']> | null = null;
	@Input() public readonly price : SchedulingApiBooking['price'] | null = null;

	constructor(
	) {
	}

	/**
	 * Get the state of this component
	 */
	public get state() : 'needsRefund' | 'isPayed' | 'needsPayment' {
		assumeDefinedToGetStrictNullChecksRunning(this.amountToPay, 'amountToPay');
		if (this.amountToPay < this.currentlyPaid) return 'needsRefund';
		if (this.amountToPay === this.currentlyPaid) return 'isPayed';
		return 'needsPayment';
	}

	/**
	 * Get a theme color for the value
	 */
	public get textTheme() : PThemeEnum {
		switch (this.state) {
			case 'needsRefund':
				return PThemeEnum.DANGER;
			case 'isPayed':
				return PThemeEnum.SUCCESS;
			case 'needsPayment':
				assumeDefinedToGetStrictNullChecksRunning(this.openAmount, 'openAmount');
				if (this.openAmount <= 0) return PThemeEnum.DANGER;
				if (this.openAmount >= this.price!) return PThemeEnum.DANGER;
				return PThemeEnum.WARNING;
			default:
				throw new Error('could not be calculated');
		}
	}
}
