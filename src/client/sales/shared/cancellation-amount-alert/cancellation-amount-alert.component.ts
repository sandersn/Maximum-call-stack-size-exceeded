import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Currency } from '../../../../shared/api/base/generated-types.ag';
import { PAlertThemeEnum, PThemeEnum } from '../../../shared/bootstrap-styles.enum';
@Component({
	selector: 'p-cancellation-amount-alert',
	templateUrl: './cancellation-amount-alert.component.html',
	styleUrls: ['./cancellation-amount-alert.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancellationAmountAlertComponent {

	/**
	 * The amount to pay.
	 * Negative if shopper gets something back.
	 */
	@Input() public currencyAmount : Currency | null = null;

	constructor() {
	}

	public PThemeEnum = PThemeEnum;
	public PAlertThemeEnum = PAlertThemeEnum;

	/**
	 * Turn number into absolute number (remove `-` from negative numbers)
	 */
	public abs(input : number) : number {
		return Math.abs(input);
	}

	/**
	 * Check if is defined number
	 */
	public isAvailable(input : number | undefined | null) : boolean {
		if (Number.isNaN(input)) return false;
		return true;
	}

}
