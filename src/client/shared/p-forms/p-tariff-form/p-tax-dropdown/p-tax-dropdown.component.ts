import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiPossibleTaxes } from '@plano/shared/api';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PFormControl } from '../../p-form-control';

@Component({
	selector: 'p-tax-dropdown[control]',
	templateUrl: './p-tax-dropdown.component.html',
	styleUrls: ['./p-tax-dropdown.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PTaxDropdownComponent implements PComponentInterface {
	@Input() public control ! : PFormControl;
	@Input('disabled') private _disabled : boolean = false;

	constructor(
		private api : SchedulingApiService,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get possibleTaxes() : SchedulingApiPossibleTaxes {
		if (!this.api.isLoaded()) return new SchedulingApiPossibleTaxes(null, false);
		return this.api.data.possibleTaxes;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get disabled() : boolean {
		if (this.isLoading) return true;
		if (this._disabled) return true;
		return false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isLoading() : PComponentInterface['isLoading'] {
		return !this.api.isLoaded();
	}

}
