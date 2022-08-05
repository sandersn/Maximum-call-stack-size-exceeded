import { AfterContentInit } from '@angular/core';
import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { BookingTab } from '@plano/client/booking/booking.component';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PTextColor} from '@plano/client/shared/bootstrap-styles.enum';
import { BootstrapSize, PTextColorEnum, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { DetailFormComponentInterface } from '@plano/client/shared/detail-form-component.interface';
import { FormControlSwitchType } from '@plano/client/shared/p-forms/p-form-control-switch/p-form-control-switch.component';
import { SectionWhitespace } from '@plano/client/shared/page/section/section.component';
import { SchedulingApiMember} from '@plano/shared/api';
import { RightsService, SchedulingApiTransaction, SchedulingApiTransactionPaymentMethodType, SchedulingApiTransactionType } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { PDictionarySourceString } from '@plano/shared/core/pipe/localize.dictionary';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PCurrencyPipe } from '@plano/shared/core/pipe/p-currency.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { Id } from '../../../shared/api/base/id';
import { FaIcon } from '../../../shared/core/component/fa-icon/fa-icon-types';
import { Config } from '../../../shared/core/config';

@Component({
	selector: 'p-detail-form[item]',
	templateUrl: './detail-form.component.html',
	styleUrls: ['./detail-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class DetailFormComponent implements AfterContentInit, DetailFormComponentInterface<SchedulingApiTransaction<'validated' | 'draft'>> {
	@Input() public item ! : SchedulingApiTransaction<'draft' | 'validated'>;
	public formGroup : DetailFormComponentInterface['formGroup'] | null = null;

	constructor(
		public api : SchedulingApiService,
		private pFormsService : PFormsService,
		private pRouterService : PRouterService,
		public rightsService : RightsService,
		private localizePipe : LocalizePipe,
		private pCurrencyPipe : PCurrencyPipe,
	) {
	}

	public Config = Config;
	public PlanoFaIconPool = PlanoFaIconPool;
	public PThemeEnum = PThemeEnum;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;
	public BootstrapSize = BootstrapSize;
	public FormControlSwitchType = FormControlSwitchType;
	public SectionWhitespace = SectionWhitespace;
	public SchedulingApiTransactionType = SchedulingApiTransactionType;

	/**
	 * Get a description for the dr plano fee.
	 */
	public drPlanoFeeDescription(transaction : SchedulingApiTransaction) : string | null {
		if (!transaction.drPlanoFeeVatDeprecated) return null;
		return this.localizePipe.transform('+ ${value} USt.', {
			value: this.pCurrencyPipe.transform(transaction.drPlanoFeeVatDeprecated),
		});
	}

	public ngAfterContentInit() : void {
		this.initComponent();
	}

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	private initValues() : void {
	}

	/**
	 * Load and set everything that is necessary for this component
	 */
	public initComponent(success ?: () => void) : void {
		if (!this.item.isNewItem()) {
			this.item.loadDetailed({
				success: () => {
					this.initValues();
					this.initFormGroup();
					if (success) { success(); }
				},
			});
		} else {
			this.initValues();
			this.initFormGroup();
			if (success) { success(); }
		}
	}

	/**
	 * Initialize the formGroup for this component
	 */
	public initFormGroup() : void {
		if (this.formGroup) { this.formGroup = null; }
		const newFormGroup = this.pFormsService.group({});
		// this.pFormsService.addPControl(newFormGroup, 'type', {
		// 	formState: {
		// 		value: 'BootstrapSize',
		// 		disabled: undefined,
		// 	},
		// 	isReadMode: true,
		// })
		this.formGroup = newFormGroup;
	}

	/**
	 * Remove Item of this Detail page
	 */
	public removeItem() : void {
		this.formGroup = null;
		this.api.data.transactions.removeItem(this.item);

		this.pRouterService.navBack();
		this.api.save({
			success : () => {
			},
		});
	}

	@Output() public onAddItem : EventEmitter<SchedulingApiTransaction> =
		new EventEmitter<SchedulingApiTransaction>();

	/**
	 * Save this item
	 */
	public saveItem() : void {
		if (!this.item.isNewItem()) return;
		this.onAddItem.emit(this.item);
		this.pRouterService.navBack();
	}

	/**
	 * Navigate to the related booking
	 */
	public navToBooking() : void {
		if (this.item.bookingId === null)
			throw new Error('This transaction does not belong to a booking.');

		this.pRouterService.navigate([`client/booking/${this.item.bookingId.toString()}/${BookingTab.TRANSACTIONS}`]);
	}

	/**
	 * Navigate to the related booking
	 */
	public navToGiftCard() : void {
		if (this.item.voucherId === null)
			throw new Error('This transaction does not belong to a voucher.');

		this.pRouterService.navigate([`client/gift-card/${this.item.voucherId.toString()}`]);
	}

	/**
	 * Export this transaction as pdf
	 */
	public exportAsPdf() : void {
		// TODO: [PLANO-48169]
		throw new Error('not implemented yet');
	}

	/**
	 * The creator of this transaction. Its a member of the submerchant
	 */
	public get creator() : SchedulingApiMember | null {
		if (this.item.creatorId === null) return null;
		return this.api.data.members.get(this.item.creatorId);
	}

	/**
	 * get css classes for balance change
	 */
	public get balanceChangeTheme() : PTextColor | null {
		if (this.item.paymentMethodType === SchedulingApiTransactionPaymentMethodType.POS) return PTextColorEnum.MUTED;
		if (this.item.paymentMethodType === SchedulingApiTransactionPaymentMethodType.MISC) return PTextColorEnum.MUTED;
		const value = this.item.balanceChange;
		if (value > 0) return PThemeEnum.SUCCESS;
		if (value < 0) return PThemeEnum.DANGER;
		return PTextColorEnum.MUTED;
	}

	/**
	 * get balance change
	 */
	public get balanceChange() : string {
		if (this.item.paymentMethodType === SchedulingApiTransactionPaymentMethodType.POS) return this.localizePipe.transform('nicht relevant');
		if (this.item.paymentMethodType === SchedulingApiTransactionPaymentMethodType.MISC) return this.localizePipe.transform('nicht relevant');
		const BALANCE = !!this.item.balanceChange ? this.item.balanceChange : 0;
		return this.pCurrencyPipe.transform(BALANCE, undefined, undefined, undefined, undefined, undefined, true)!;
	}


	/**
	 * A fitting label for the creator
	 */
	public get creatorIdLabel() : PDictionarySourceString | null {
		switch (this.item.type) {
			case SchedulingApiTransactionType.PAYMENT:
				return this.item.creatorId !== null ? 'Zahlung erfasst von' : null;
			case SchedulingApiTransactionType.REFUND:
				if (this.item.paymentMethodType === SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT) return 'Zahlung veranlasst von';
				return 'Zahlung erfasst von';
			case SchedulingApiTransactionType.PAYOUT:
			case SchedulingApiTransactionType.AUTO_DEBIT:
				return 'Mit ♥ beauftragt von';
			case SchedulingApiTransactionType.PAYOUT_FAILED:
			case SchedulingApiTransactionType.CHARGEBACK:
			case SchedulingApiTransactionType.CHARGEBACK_REVERSED:
			case SchedulingApiTransactionType.SECOND_CHARGEBACK:
			case SchedulingApiTransactionType.PAYMENT_FAILED:
			case SchedulingApiTransactionType.REFUND_FAILED:
			case SchedulingApiTransactionType.AUTO_DEBIT_FAILED:
			case SchedulingApiTransactionType.DR_PLANO_FEE_VAT:
				return null;
		}
	}

	/**
	 * What kind of creator doe’s this transaction have?
	 */
	public get creatorType() : 'dr-plano' | 'member' | null {
		if (this.item.type === SchedulingApiTransactionType.PAYOUT || this.item.type === SchedulingApiTransactionType.AUTO_DEBIT) return 'dr-plano';
		if (this.item.creatorId !== null) return 'member';
		return null;
	}

	/**
	 * Get an fitting icon for this payment-method name
	 */
	public get paymentMethodIcon() : FaIcon | null {
		return this.pCurrencyPipe.getPaymentMethodIcon(this.item.paymentMethodType, this.item.paymentMethodName);
	}

	/**
	 * Nav to the transaction with id `transactionId`.
	 */
	public navToTransaction(transactionId : Id | null) : void {
		if (transactionId === null) throw new Error('Button should not have been triggered');
		return this.pRouterService.navigate([`client/transaction/${transactionId.toString()}`]);
	}
}
