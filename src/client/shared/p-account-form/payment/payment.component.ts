import { AfterContentInit } from '@angular/core';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { AccountApiService, SchedulingApiService, SchedulingApiAccountHolderState, AccountApiType } from '@plano/shared/api';
import { PSupportedCurrencyCodes } from '@plano/shared/api/base/generated-types.ag';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PThemeEnum } from '../../bootstrap-styles.enum';
import { PFormGroup } from '../../p-forms/p-form-control';

@Component({
	selector: 'p-payment[group]',
	templateUrl: './payment.component.html',
	styleUrls: ['./payment.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PaymentComponent implements AfterContentInit {
	@Input('group') public formGroup ! : PFormGroup;
	@Input() public turnIntoRealAccountForm : boolean = false;

	private adyenRelevantDataInitial ! : {
		bankAccountOwner : string | null,
		bankAccountBic : string | null,
		bankAccountIban : string | null,
	};

	constructor(
		public api : AccountApiService,
		public schedulingAPI : SchedulingApiService,
	) { }

	public AccountApiType = AccountApiType;
	public SchedulingApiAccountHolderState = SchedulingApiAccountHolderState;
	public PThemeEnum = PThemeEnum;
	public PlanoFaIconPool = PlanoFaIconPool;
	public PSupportedCurrencyCodes = PSupportedCurrencyCodes;

	public ngAfterContentInit() : void {
		// load scheduling api for access to adyenAccountHolderState
		this.schedulingAPI.load({
			success: () => {
			},
		});

		this.api.isLoaded(() => {
			this.adyenRelevantDataInitial = {
				bankAccountBic: this.api.data.billing.bankAccountBic,
				bankAccountIban: this.api.data.billing.bankAccountIban,
				bankAccountOwner: this.api.data.billing.bankAccountOwner,
			};
		});
	}

	/**
	 * Has the Adyen-relevant data been changed during the lifecycle of this component?
	 */
	public get adyenRelevantDataHasChanged() : boolean {
		if (this.adyenRelevantDataInitial.bankAccountBic !== this.api.data.billing.bankAccountBic) return true;
		if (this.adyenRelevantDataInitial.bankAccountIban !== this.api.data.billing.bankAccountIban) return true;
		if (this.adyenRelevantDataInitial.bankAccountOwner !== this.api.data.billing.bankAccountOwner) return true;
		return false;
	}
}
