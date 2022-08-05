import { Subscription } from 'rxjs';
import { PercentPipe } from '@angular/common';
import { AfterContentInit, OnDestroy} from '@angular/core';
import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RightsService, SchedulingApiBookingState, SchedulingApiPaymentMethodType, SchedulingApiShiftModelCoursePaymentMethods, SchedulingApiTransactionPaymentMethodType, SchedulingApiTransactionType, SchedulingApiVoucher } from '../../../../shared/api';
import { SchedulingApiShiftModelCancellationPolicyFeePeriod, SchedulingApiShiftModelCoursePaymentMethod, SchedulingApiTransaction} from '../../../../shared/api';
import { PApiPrimitiveTypes } from '../../../../shared/api/base/generated-types.ag';
import { Currency} from '../../../../shared/api/base/generated-types.ag';
import { PMath } from '../../../../shared/core/math-utils';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../shared/core/null-type-utils';
import { LocalizePipe } from '../../../../shared/core/pipe/localize.pipe';
import { PCurrencyPipe } from '../../../../shared/core/pipe/p-currency.pipe';
import { PlanoFaIconPool } from '../../../../shared/core/plano-fa-icon-pool.enum';
import { ValidatorsService } from '../../../../shared/core/validators.service';
import { PValidatorObject, PPossibleErrorNames } from '../../../../shared/core/validators.types';
import { SchedulingApiBooking } from '../../../scheduling/shared/api/scheduling-api-booking.service';
import { PFormsService } from '../../../service/p-forms.service';
import { PThemeEnum } from '../../../shared/bootstrap-styles.enum';
import { PFormGroup } from '../../../shared/p-forms/p-form-control';
import { FormControlSwitchType } from '../../../shared/p-forms/p-form-control-switch/p-form-control-switch.component';
import { PFormControlComponentChildInterface } from '../../../shared/p-forms/p-form-control.interface';
import { SectionWhitespace } from '../../../shared/page/section/section.component';

enum PaymentMethodTypeDisabledReason {
	NO_BOOKING_BALANCE,
	NO_ONLINE_BALANCE,
	ONLINE_PAYMENT_NOT_ACTIVE,
}

@Component({
	selector: 'p-booking-transaction-form[bookable][group]',
	templateUrl: './booking-transaction-form.component.html',
	styleUrls: ['./booking-transaction-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class BookingTransactionFormComponent implements AfterContentInit, OnDestroy {
	@Input() public bookable ! : SchedulingApiBooking | SchedulingApiVoucher;

	/**
	 * Set this to true,
	 * - if user is about to change the cancellation fee.
	 * - if the user is about to change the state to CANCELED
	 */
	@Input() public modalVersion : 'CHANGE_CANCELLATION_FEE' | 'CHANGE_STATE_TO_CANCELED' | 'ADD_TRANSACTION' = 'ADD_TRANSACTION';

	@Input('group') private bookableGroup ! : PFormGroup;
	public group : PFormGroup | undefined;

	@Input() public transaction : SchedulingApiTransaction | null = null;

	constructor(
		public changeDetectorRef : ChangeDetectorRef,
		private pFormsService : PFormsService,
		private validatorsService : ValidatorsService,
		private pCurrencyPipe : PCurrencyPipe,
		private localizePipe : LocalizePipe,
		private percentPipe : PercentPipe,
		private rightsService : RightsService,
	) {
	}

	public FormControlSwitchType = FormControlSwitchType;
	public SchedulingApiTransactionType = SchedulingApiTransactionType;
	public PlanoFaIconPool = PlanoFaIconPool;
	public SchedulingApiTransactionPaymentMethodType = SchedulingApiTransactionPaymentMethodType;
	public SectionWhitespace = SectionWhitespace;
	public PThemeEnum = PThemeEnum;
	public SchedulingApiBookingState = SchedulingApiBookingState;
	public SchedulingApiPaymentMethodType = SchedulingApiPaymentMethodType;

	public ngAfterContentInit() : void {
		this.initComponent();
	}

	public ngOnDestroy() : void {
		this.destroyComponent();
	}

	public applicableFee : SchedulingApiShiftModelCancellationPolicyFeePeriod | null = null;
	public initialCancellationFee ! : Currency;

	/**
	 * Load and set everything that is necessary for this component
	 */
	public initComponent() : void {
		this.initValues();

		if (this.modalVersion === 'CHANGE_CANCELLATION_FEE' || this.modalVersion === 'CHANGE_STATE_TO_CANCELED') {
			this.addHandleRefundControl();
		} else {
			this.createTransaction();
		}

	}

	private initValues() : void {
		this.initialIsFirstTransactionForThisBooking = !this.bookable.transactions.length;

		if (this.bookable instanceof SchedulingApiBooking) {

			if (this.modalVersion === 'CHANGE_STATE_TO_CANCELED') {
				// We need to save the initial cancellationFee because:
				// If a booking gets canceled twice, the initial cancellation fee, should be added to the recommendedFee.
				this.initialCancellationFee = this.bookable.cancellationFee;
			}

			assumeDefinedToGetStrictNullChecksRunning(this.bookable.model, 'bookable.model');
			assumeDefinedToGetStrictNullChecksRunning(this.bookable.applicableCancellationFeePeriodId, 'bookable.applicableCancellationFeePeriodId');
			this.applicableFee = this.bookable.model
				.cancellationPolicies
				.get(this.bookable.cancellationPolicyId)
				?.feePeriods.get(this.bookable.applicableCancellationFeePeriodId) ?? null;
		}

		this.initCancellationFee();

		// Create a new formGroup. This makes it easier to handle transaction-related invalid states.
		const transactionFormGroup = new FormGroup({});
		this.pFormsService.addFormGroup(this.bookableGroup, 'transaction', transactionFormGroup);
		this.group = (this.bookableGroup.get('transaction') as PFormGroup | undefined);
	}

	private initCancellationFee() : void {
		if (!(this.bookable instanceof SchedulingApiBooking)) return;

		// If this is not a cancellation modal, than there is no need to chance the bookable.cancellationFee
		if (this.modalVersion !== 'CHANGE_STATE_TO_CANCELED') return;

		let newCancellationFee : number | null = null;
		newCancellationFee = this.recommendedFee;
		if (this.initialCancellationFee && newCancellationFee !== null) {
			newCancellationFee = newCancellationFee + this.initialCancellationFee;
		}
		if (newCancellationFee !== null) this.bookable.cancellationFee = newCancellationFee;
	}

	/**
	 * Create a new transaction.
	 * This can happen
	 * - when a user clicks "create new transaction" or
	 * - when a user chooses to "create new refund" during a cancellation
	 * The second case makes it necessary, that we create a new transaction inside this component.
	 */
	private createTransaction() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.bookable, 'bookable');
		assumeDefinedToGetStrictNullChecksRunning(this.bookable.api, 'bookable.api');
		const NEW_TRANSACTION = this.bookable.api.data.transactions.createNewItem();

		if (this.bookable instanceof SchedulingApiBooking) {
			NEW_TRANSACTION.bookingId = this.bookable.id;
		} else if (this.bookable instanceof SchedulingApiVoucher) {
			NEW_TRANSACTION.voucherId = this.bookable.id;
		} else {
			throw new TypeError('Instance unexpected');
		}

		if (this.modalVersion === 'CHANGE_CANCELLATION_FEE' || this.modalVersion === 'CHANGE_STATE_TO_CANCELED') NEW_TRANSACTION.type = SchedulingApiTransactionType.REFUND;

		// TODO: [PLANO-116675] We are about to release 3.0.0. I don’t want to change initial values now, but keep this for later.
		// if (this.showHandleRefundFormControl) {
		// 	NEW_TRANSACTION.type = SchedulingApiTransactionType.REFUND;
		// } else
		if (this.outgoingPaymentOptionDisabled && !this.incomingPaymentOptionDisabled) {
			NEW_TRANSACTION.type = SchedulingApiTransactionType.PAYMENT;
		}

		this.totalOnlineBalance = this.bookable.transactions.onlineRefundableAmount;

		this.transaction = NEW_TRANSACTION;

		this.changeDetectorRef.detectChanges();

		assumeDefinedToGetStrictNullChecksRunning(this.group, 'group');
		const TYPE_CONTROL = this.pFormsService.getByAI(this.group, this.transaction.attributeInfoType);

		this.refreshInitAbsAmount(TYPE_CONTROL.value);
		this.refreshInitPaymentMethodType(TYPE_CONTROL.value);

		this.transactionTypeSubscription = TYPE_CONTROL.valueChanges.subscribe((newType : SchedulingApiTransactionType) => {
			this.refreshInitAbsAmount(newType);
			this.refreshInitPaymentMethodType(newType);
		});

		this.group.updateValueAndValidity();
	}

	private refreshInitAbsAmount(type : SchedulingApiTransactionType) : void {
		if (!this.transaction) throw new Error('transaction is not defined');
		const absAmount = this.transaction.attributeInfoAbsAmount.value;
		if (absAmount !== null) return;
		const OPEN_AMOUNT = this.bookable.getOpenAmount(this.bookable.currentlyPaid);
		if (OPEN_AMOUNT === null) return;
		if (OPEN_AMOUNT > 0 && type !== SchedulingApiTransactionType.PAYMENT) return;
		if (OPEN_AMOUNT < 0 && type !== SchedulingApiTransactionType.REFUND) return;
		this.transaction.absAmount = Math.abs(OPEN_AMOUNT);
	}

	private refreshInitPaymentMethodType(type : SchedulingApiTransactionType) : void {
		assumeDefinedToGetStrictNullChecksRunning(this.transaction, 'transaction');
		if (type === SchedulingApiTransactionType.REFUND && !!this.paymentMethodOnlineBankingCannotEditHint) {
			this.transaction.paymentMethodType = SchedulingApiTransactionPaymentMethodType.MISC;
		} else {
			if (this.initialIsFirstTransactionForThisBooking) {
				this.transaction.paymentMethodType = SchedulingApiTransactionPaymentMethodType.MISC;
			} else {
				// @ts-expect-error -- TODO: PLANO-151864 nils this probably needs to use draft value
				this.transaction.paymentMethodType = null;
			}
		}
	}

	private handleRefundSubscription : Subscription | null = null;
	private transactionTypeSubscription : Subscription | null = null;

	private addHandleRefundControl() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.group, 'group');
		this.pFormsService.addPControl(this.group, 'handleRefund', {
			formState: {
				value: undefined,
				disabled: this.modalVersion !== 'CHANGE_CANCELLATION_FEE',
			},
			validatorOrOpts: [
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					if (!this.showHandleRefundFormControl) return null;
					return this.validatorsService.required(PApiPrimitiveTypes.boolean).fn(control);
				}}),
			],
			subscribe: (value : boolean) => {
				if (value === true) {
					if (!this.transaction) {
						this.createTransaction();
					} else {
						this.destroyTransaction();
					}
				} else {
					if (this.transaction) this.destroyTransaction();
				}
			},
		});

		this.setHandleRefundSubscription();
	}

	private setHandleRefundSubscription() : void {
		if (!(this.bookable instanceof SchedulingApiBooking)) return;

		assumeDefinedToGetStrictNullChecksRunning(this.group, 'group');
		const cancellationFeeFormControl = this.pFormsService.getByAI(this.group, this.bookable.attributeInfoCancellationFee);
		this.handleRefundSubscription = cancellationFeeFormControl.valueChanges.subscribe(() => {
			if (!(this.bookable instanceof SchedulingApiBooking)) return;

			assumeDefinedToGetStrictNullChecksRunning(this.group, 'group');
			const handleRefundFormControl = this.group.get('handleRefund');
			assumeDefinedToGetStrictNullChecksRunning(handleRefundFormControl, 'handleRefundFormControl');
			if (
				handleRefundFormControl.value === null ||
				handleRefundFormControl.value === undefined
			) {
				const control = this.group.get(this.bookable.attributeInfoCancellationFee.id);
				if (!control) throw new Error('control could not be found');
				if (!control.valid) {
					handleRefundFormControl.disable();
				} else {
					handleRefundFormControl.enable();
				}
			}
		});
	}

	/**
	 * Destroy the transaction that has been created at the time this transaction form was initialized.
	 * This method has to be called, BEFORE the component gets destroyed.
	 */
	public destroyTransaction() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.bookable, 'bookable');
		assumeDefinedToGetStrictNullChecksRunning(this.bookable.api, 'bookable.api');
		assumeDefinedToGetStrictNullChecksRunning(this.transaction, 'transaction');
		this.bookable.api.data.transactions.removeItem(this.transaction);
		this.transaction = null;
		this.changeDetectorRef.detectChanges();
		assumeDefinedToGetStrictNullChecksRunning(this.group, 'group');
		this.group.updateValueAndValidity();
	}

	/**
	 * Load and set everything that is necessary for this component
	 */
	public destroyComponent() : void {
		this.handleRefundSubscription?.unsubscribe();
		this.transactionTypeSubscription?.unsubscribe();
		assumeDefinedToGetStrictNullChecksRunning(this.group, 'group');
		this.group.removeControl('handleRefund');
		assumeDefinedToGetStrictNullChecksRunning(this.bookableGroup, 'bookableGroup');
		this.bookableGroup.removeControl('transaction');
	}

	public initialIsFirstTransactionForThisBooking : boolean = false;
	private totalOnlineBalance : Currency | null = null;

	private get paymentMethodTypeDisabledReason() : PaymentMethodTypeDisabledReason | null {
		assumeDefinedToGetStrictNullChecksRunning(this.bookable, 'bookable');
		assumeDefinedToGetStrictNullChecksRunning(this.bookable.api, 'bookable.api');
		if (!this.bookable.api.data.isOnlinePaymentAvailable) return PaymentMethodTypeDisabledReason.ONLINE_PAYMENT_NOT_ACTIVE;
		if (this.totalOnlineBalance === 0) return PaymentMethodTypeDisabledReason.NO_BOOKING_BALANCE;
		if (
			this.bookable.refundLimitDueToOnlineBalance === 0
		) return PaymentMethodTypeDisabledReason.NO_ONLINE_BALANCE;
		return null;
	}

	/**
	 * Is UI element für paymentMethod ONLINE_BANKING disabled?
	 */
	public get paymentMethodOnlineBankingCannotEditHint() : PFormControlComponentChildInterface['cannotEditHint'] {
		if (
			this.bookable instanceof SchedulingApiBooking &&
			!this.rightsService.userCanOnlineRefund(this.bookable.model)
		) return 'Du hast keine Berechtigung, Online-Rückerstattungen an Kunden zu veranlassen. Wende dich bitte an deine Personalleitung, falls das geändert werden soll.';
		switch (this.paymentMethodTypeDisabledReason) {
			case PaymentMethodTypeDisabledReason.ONLINE_PAYMENT_NOT_ACTIVE:
				// eslint-disable-next-line literal-blacklist/literal-blacklist
				return 'Um bequem Online-Rückerstattungen vornehmen zu können, aktiviere die <a href="client/plugin/payments" target="_blank">Online-Zahlungsfunktion</a>.';
			case PaymentMethodTypeDisabledReason.NO_BOOKING_BALANCE:
				// eslint-disable-next-line literal-blacklist/literal-blacklist
				return 'Online-Rückerstattung aktuell nicht möglich, da diese Buchung kein Online-Guthaben aufweist. Mehr dazu erfährst du <a href="client/plugin/faq-online-payment#refund" target="_blank">hier</a>.';
			case PaymentMethodTypeDisabledReason.NO_ONLINE_BALANCE:
				// eslint-disable-next-line literal-blacklist/literal-blacklist
				return 'Online-Rückerstattung aktuell nicht möglich, da dein gesamter Account <a href="client/sales/transactions" target="_blank">kein Online-Guthaben</a> aufweist.';
			default:
				return null;
		}
	}

	/**
	 * Are there multiple incoming payments?
	 */
	public get showMultiRefundHint() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.transaction, 'transaction');
		if (this.transaction.type !== SchedulingApiTransactionType.REFUND) return false;
		if (this.transaction.paymentMethodType !== SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT) return false;
		assumeDefinedToGetStrictNullChecksRunning(this.bookable, 'bookable');
		const amountOfOnlineTransactions = this.bookable.transactions.filterBy(item => {
			if (item.type !== SchedulingApiTransactionType.PAYMENT) return false;
			if (item.paymentMethodType !== SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT) return false;
			return true;
		}).length;
		return amountOfOnlineTransactions >= 2;
	}

	/**
	 * Decide which kind of recommendation to show.
	 */
	public get typeOfRecommendation() : (
	'withdrawalAllowed' |
	'hasApplicableFee' |
	'forFree' |
	'noFeePeriods' |
	null
	) {
		if (!(this.bookable instanceof SchedulingApiBooking)) return null;

		if (this.bookable.hasRightOfWithdrawal === true) return 'withdrawalAllowed';
		if (!!this.applicableFee) return 'hasApplicableFee';
		if (this.bookable.price === 0) return 'forFree';

		assumeDefinedToGetStrictNullChecksRunning(this.bookable.model, 'bookable.model');
		const cancellationPolicyId = (() => {
			if (this.bookable.attributeInfoCancellationPolicyId.value !== null) return this.bookable.cancellationPolicyId;
			return this.bookable.model.currentCancellationPolicyId;
		})();
		const FEE_PERIODS_FOR_THIS_BOOKING = this.bookable.model.cancellationPolicies.get(cancellationPolicyId)?.feePeriods ?? null;
		assumeNonNull(FEE_PERIODS_FOR_THIS_BOOKING, 'FEE_PERIODS_FOR_THIS_BOOKING');
		if (!FEE_PERIODS_FOR_THIS_BOOKING.length) {
			if (this.bookable.model.cancellationPolicies.length) return 'noFeePeriods';
			return null;
		}
		return null;
	}

	private get relativeFee() : number | null {
		assumeDefinedToGetStrictNullChecksRunning(this.bookable, 'bookable');
		if (this.bookable.state !== SchedulingApiBookingState.CANCELED) return null;
		assumeDefinedToGetStrictNullChecksRunning(this.applicableFee, 'applicableFee');
		const RELATIVE_FEE_AMOUNT = this.bookable.price / 100 * this.applicableFee.feePercentage;
		return Math.round(RELATIVE_FEE_AMOUNT * 100) / 100;
	}

	/**
	 * The calculation for the recommended fee.
	 */
	public get recommendedFee() : Currency | null {
		if (!this.applicableFee) return null;
		if (this.relativeFee === null) return null;

		const fixFee = this.applicableFee.feeFix;
		const relativeFee = this.relativeFee;

		return PMath.addCurrency(relativeFee, fixFee);
	}

	/**
	 * The calculation for the recommended fee.
	 */
	public get recommendationCalculation() : string {
		if (!this.applicableFee) throw new Error('No applicableFee defined.');
		let result : string = '';
		const fixFee = this.applicableFee.feeFix;

		if (fixFee) {
			result += this.pCurrencyPipe.transform(fixFee);
			result += ' ';
			result += this.localizePipe.transform('(fix)');
		}

		if (fixFee && this.applicableFee.feePercentage) {
			result += ' + ';
		}

		assumeDefinedToGetStrictNullChecksRunning(this.bookable, 'bookable');

		if (!!this.applicableFee.feePercentage) {
			if (this.bookable.state === SchedulingApiBookingState.CANCELED) {
				const relativeFee = this.relativeFee;
				result += this.pCurrencyPipe.transform(relativeFee);
				result += ' ';
			}

			if (this.bookable.state === SchedulingApiBookingState.CANCELED) result += '(';
			result += this.localizePipe.transform('${percentage} vom Buchungspreis', {
				percentage: this.percentPipe.transform(this.applicableFee.feePercentage / 100)!,
			});

			if (this.bookable.state === SchedulingApiBookingState.CANCELED) result += ')';
		}

		if (this.bookable.state === SchedulingApiBookingState.CANCELED && fixFee && this.applicableFee.feePercentage) {
			result += ' = ';
			result += this.pCurrencyPipe.transform(this.recommendedFee);
		}
		return result;
	}

	/**
	 * Get all payment methods available for the related model which should be selectable in this form.
	 */
	public get paymentMethodsForRadio() : SchedulingApiShiftModelCoursePaymentMethods {
		if (!(this.bookable instanceof SchedulingApiBooking)) return new SchedulingApiShiftModelCoursePaymentMethods(null, false);
		assumeNonNull(this.bookable.coursePaymentMethods, 'this.bookable.coursePaymentMethods');
		return this.bookable.coursePaymentMethods.filterBy(item => {
			if (this.transaction?.type === SchedulingApiTransactionType.PAYMENT && item.type === SchedulingApiPaymentMethodType.PAYPAL) return false;
			if (item.type === SchedulingApiPaymentMethodType.PAYPAL) return false;
			return item.type !== SchedulingApiPaymentMethodType.ONLINE_PAYMENT;
		});
	}

	/**
	 * Get a fitting description for the form field paymentMethodName
	 */
	public get paymentMethodNameDescription() : string {
		if (!(this.bookable instanceof SchedulingApiBooking)) return this.localizePipe.transform('Gib bitte den Namen der verwendeten Zahlungsart an. Das sorgt für Transparenz in der Kundenkommunikation. Außerdem kannst du so die Zahlungsvorgänge zu einem späteren Zeitpunkt besser nachvollziehen.');
		// TODO: [PLANO-69246]
		assumeDefinedToGetStrictNullChecksRunning(this.bookable.model, 'bookable.model');
		return this.localizePipe.transform('Die Angabe der Zahlungsart schafft Transparenz in der Kundenkommunikation. Außerdem kannst du so die Zahlungsvorgänge auch zu einem späteren Zeitpunkt gut nachvollziehen. Falls hier die benutzte Zahlungsart fehlt, dann musst du sie bitte erst in der Tätigkeit unter »Buchungseinstellungen« anlegen.', {
			modelName: this.bookable.model.name,
		});
	}

	/**
	 * Is this a form for a booking?
	 */
	public get isBooking() : boolean {
		return this.bookable instanceof SchedulingApiBooking;
	}

	/**
	 * Should the option for »Incoming Payment« be disabled?
	 * Related: PLANO-110601
	 */
	public get incomingPaymentOptionDisabled() : boolean {
		if (this.bookable instanceof SchedulingApiVoucher) return false;
		return !this.paymentMethodsForRadio.length;
	}

	/**
	 * Should the option for »Outgoing Payment« be disabled?
	 * Related: PLANO-110601
	 */
	public get outgoingPaymentOptionDisabled() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.bookable, 'bookable');
		// Related: PLANO-145137
		if (this.optionTypeOnlinePaymentDisabled && this.optionTypeMiscDisabled) return true;
		assumeDefinedToGetStrictNullChecksRunning(this.bookable.paidBeforeTransactionListIntroduction, 'bookable.paidBeforeTransactionListIntroduction');
		if (this.bookable.paidBeforeTransactionListIntroduction > 0) return false;
		return this.initialIsFirstTransactionForThisBooking;
	}

	/**
	 * Why is the option »Outgoing Payment« disabled?
	 * Related: PLANO-110601
	 */
	public get outgoingPaymentOptionCannotEditHint() : PFormControlComponentChildInterface['cannotEditHint'] {
		if (this.optionTypeOnlinePaymentDisabled && this.optionTypeMiscDisabled) return 'Eine Rückerstattung ist aktuell nicht möglich, da keine Zahlungsarten zur Verfügung stehen. Um das zu ändern, aktiviere die Online-Zahlung oder lege in der gewünschten Tätigkeit unter »Buchungseinstellungen« andere Zahlungsarten an.';
		return this.initialIsFirstTransactionForThisBooking ? 'Es sind keine Zahlungen vorhanden, die erstattet werden können.' : null;
	}

	/**
	 * Should the option type »Online Payment« be disabled?
	 * Related: PLANO-110601
	 */
	public get optionTypeOnlinePaymentDisabled() : boolean {
		return !!this.paymentMethodOnlineBankingCannotEditHint;
	}

	/**
	 * Should the option type »Misc« be disabled?
	 * Related: PLANO-110601
	 */
	public get optionTypeMiscDisabled() : boolean {
		if (this.bookable instanceof SchedulingApiVoucher) return false;
		if (this.coursePaymentMethodTypePaypalIsAvailable) return false;
		if (this.paymentMethodsForRadio.length) return false;
		return true;
	}

	/**
	 * Should the handleRefund radio element be visible to the user?
	 */
	public get showHandleRefundFormControl() : boolean {
		if (this.bookable instanceof SchedulingApiVoucher) return false;
		if (this.modalVersion === 'ADD_TRANSACTION') return false;
		assumeDefinedToGetStrictNullChecksRunning(this.group, 'group');
		assumeDefinedToGetStrictNullChecksRunning(this.bookable, 'bookable');
		if (!this.group.get(this.bookable.attributeInfoCancellationFee.id)?.valid) return false;
		const refundControl = this.group.get('handleRefund');
		if (!refundControl) return false;
		const openAmount = this.bookable.getOpenAmount();
		assumeDefinedToGetStrictNullChecksRunning(openAmount, 'openAmount');
		return !refundControl.disabled && openAmount < 0;
	}

	/**
	 * Is the payment method type option PayPal available for this transaction?
	 */
	public get coursePaymentMethodTypePaypalIsAvailable() : boolean {
		return !!this.coursePaymentMethodTypePaypal && this.transaction?.type === SchedulingApiTransactionType.REFUND;
	}

	/**
	 * Get PaymentMethod PayPal if possible.
	 */
	public get coursePaymentMethodTypePaypal() : SchedulingApiShiftModelCoursePaymentMethod | null {
		if (!(this.bookable instanceof SchedulingApiBooking)) return null;
		assumeNonNull(this.bookable.coursePaymentMethods, 'this.bookable.coursePaymentMethods');
		return this.bookable.coursePaymentMethods.findBy(item => item.type === SchedulingApiPaymentMethodType.PAYPAL);
	}

	/**
	 * PayPal has been selected as paymentMethodType
	 */
	public onClickPayPal() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.group, 'group');
		assumeDefinedToGetStrictNullChecksRunning(this.transaction, 'transaction');
		this.group.controls[this.transaction.attributeInfoMiscPaymentMethodName.id]?.setValue(null);
		this.group.controls[this.transaction.attributeInfoPaymentMethodType.id]?.setValue(SchedulingApiTransactionPaymentMethodType.PAYPAL);
		this.changeDetectorRef.detectChanges();
	}

	/**
	 * Something else than PayPal has been selected as paymentMethodType
	 */
	public onClickNonPayPal() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.group, 'group');
		assumeDefinedToGetStrictNullChecksRunning(this.transaction, 'transaction');
		this.group.controls[this.transaction.attributeInfoPaymentMethodType.id]?.setValue(SchedulingApiTransactionPaymentMethodType.MISC);
		this.changeDetectorRef.detectChanges();
	}

	/** user decided to change paymentMethod Type */
	public onClickTypePayment() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.transaction, 'transaction');
		this.transaction.paymentMethodType = SchedulingApiTransactionPaymentMethodType.MISC;
		this.transaction.miscPaymentMethodName = null;
		this.changeDetectorRef.detectChanges();
	}

	/** user decided to change paymentMethod Type */
	public onClickTypeRefund() : void {
		this.transaction!.miscPaymentMethodName = null;
		this.changeDetectorRef.detectChanges();
	}
}
