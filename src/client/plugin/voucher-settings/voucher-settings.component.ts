import { interval, Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OnDestroy, AfterContentInit } from '@angular/core';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { FormComponentInterface } from '@plano/client/shared/detail-form-component.interface';
import { SchedulingApiService } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';import { AsyncValidatorsService } from '@plano/shared/core/async-validators.service';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PPossibleErrorNames, PValidatorObject } from '../../../shared/core/validators.types';

const ticks$ = interval(3000);

@Component({
	selector: 'p-voucher-settings',
	templateUrl: './voucher-settings.component.html',
	styleUrls: ['./voucher-settings.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class VoucherSettingsComponent implements FormComponentInterface, OnDestroy, AfterContentInit {
	public formGroup : FormComponentInterface['formGroup'] = null;

	constructor(
		public api : SchedulingApiService,
		private pFormsService : PFormsService,
		private validators : ValidatorsService,
		private asyncValidators : AsyncValidatorsService,
		private changeDetectorRef : ChangeDetectorRef,
	) {
	}

	public PThemeEnum = PThemeEnum;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;

	private destroyed$ : Subject<void> = new Subject<void>();
	public codeExample : string = '-';
	public typingSpeed : number = 30;

	private generateRandomString(length : number, digitsOnly : boolean) : string {
		let result = '';
		let characters = '0123456789';
		if (!digitsOnly) {
			characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		}
		const charactersLength = characters.length;
		for ( let i = 0; i < length; i++ ) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	private clearCodeExampleInterval : number | null = null;
	private clearCodeExample(success ?: () => void) : void {
		if (this.fillCodeExampleInterval !== null) return;
		if (!this.codeExample) {
			if (success) success();
			return;
		}
		this.clearCodeExampleInterval = window.setInterval(() => {
			if (this.fillCodeExampleInterval !== null) return;
			if (!this.codeExample) {
				window.clearInterval(this.clearCodeExampleInterval ?? undefined);
				this.clearCodeExampleInterval = null;
				if (success) success();
				return;
			}
			if (this.codeExample.length === 1) {
				this.codeExample = '';
			} else {
				this.codeExample = this.codeExample.substring(0, this.codeExample.length - 1);
			}
			this.changeDetectorRef.detectChanges();
		}, this.typingSpeed);
	}

	private fillCodeExampleInterval : number | null = null;
	private fillCodeExample(newCode : string) : void {
		if (this.clearCodeExampleInterval !== null) return;
		this.fillCodeExampleInterval = window.setInterval(() => {
			if (this.clearCodeExampleInterval !== null) return;
			if (this.codeExample !== newCode.substring(0, this.codeExample.length)) {
				// HACK: Something went wrong and clear was running parallel to fill interval
				window.clearInterval(this.fillCodeExampleInterval ?? undefined);
				this.fillCodeExampleInterval = null;
			}
			this.codeExample = newCode.substring(0, this.codeExample.length + 1);
			if (this.codeExample === newCode) {
				window.clearInterval(this.fillCodeExampleInterval ?? undefined);
				this.fillCodeExampleInterval = null;
			}
		}, this.typingSpeed);
	}

	private generateNewCodeExample() : void {
		if (!this.api.isLoaded() || !this.api.data.voucherSettings.rawData) return;

		this.clearCodeExample(() => {
			// Next line can happen when user logs out while this component is loaded.
			if (!this.api.data.voucherSettings.rawData) return;

			const PREFIX = this.api.data.voucherSettings.voucherCodePrefix;
			const DIGITS_ONLY = this.api.data.voucherSettings.voucherCodeOnlyContainsDigits;
			const CODE = this.generateRandomString(this.api.data.voucherSettings.voucherCodeLength, DIGITS_ONLY).toUpperCase();
			this.fillCodeExample(PREFIX + CODE);
		});
	}

	public ngOnDestroy() : void {
		this.destroyed$.next();
		this.destroyed$.complete();
		this.subscription?.unsubscribe();
	}

	public ngAfterContentInit() : void {
		this.initFormGroup();
		this.startCodeExampleGenerator();
	}

	private subscription : Subscription | null = null;

	private startCodeExampleGenerator() : void {
		this.subscription = ticks$
			.pipe(takeUntil(this.destroyed$))
			.subscribe(() => {
				this.generateNewCodeExample();
			});
	}

	/**
	 * Load and set everything that is necessary for this component
	 */
	public initComponent(_success ?: () => void) : void {
		throw new Error('Method not implemented.');
	}

	// eslint-disable-next-line sonarjs/cognitive-complexity, max-lines-per-function, jsdoc/require-jsdoc
	public initFormGroup() : void {
		if (this.formGroup) { this.formGroup = null; }

		const tempFormGroup = this.pFormsService.group({});

		this.pFormsService.addControl(tempFormGroup, 'isVoucherSaleEnabled',
			{
				value : this.api.data.voucherSettings.isVoucherSaleEnabled,
				disabled: false,
			},
			[],
			(value) => {
				this.api.data.voucherSettings.isVoucherSaleEnabled = value;
			},
		);

		this.pFormsService.addControl(tempFormGroup, 'voucherMinPrice',
			{
				value : this.api.data.voucherSettings.voucherMinPrice,
				disabled: false,
			},
			[
				this.validators.maxDecimalPlacesCount(0, this.api.data.voucherSettings.attributeInfoVoucherMinPrice.primitiveType),
				this.validators.required(this.api.data.voucherSettings.attributeInfoVoucherMinPrice.primitiveType),
				this.validators.min(1, true, this.api.data.voucherSettings.attributeInfoVoucherMinPrice.primitiveType),
				new PValidatorObject<(control : Pick<AbstractControl, 'value'>) => {
					[PPossibleErrorNames.MAX] : {
							name : PPossibleErrorNames.MAX;
							primitiveType : PApiPrimitiveTypes.Currency;
							max : number;
							actual : number;
					};
			} | null>({name: PPossibleErrorNames.MIN, fn: (control) => {
						if (!this.api.data.voucherSettings.voucherMaxPrice) return null;
						if (!control.value) return null;
						if (Number.isNaN(+control.value)) return null;
						if (control.value === undefined) return null;
						if (control.value === '') return null;

						if (+control.value > this.api.data.voucherSettings.voucherMaxPrice) return {
							[PPossibleErrorNames.MAX]: {
								name: PPossibleErrorNames.MAX,
								primitiveType: PApiPrimitiveTypes.Currency,
								max: this.api.data.voucherSettings.voucherMaxPrice,
								actual: control.value,
							},
						};
						return null;
					}}),
			],
			(value) => {
				if (Number.isNaN(+value)) {
					this.api.data.voucherSettings.voucherMinPrice = undefined!;
					return;
				}
				this.api.data.voucherSettings.voucherMinPrice = value;
			},
		);

		this.pFormsService.addControl(tempFormGroup, 'voucherMaxPrice',
			{
				value : this.api.data.voucherSettings.voucherMaxPrice,
				disabled: false,
			},
			[
				this.validators.maxDecimalPlacesCount(0, this.api.data.voucherSettings.attributeInfoVoucherMaxPrice.primitiveType),
				this.validators.required(this.api.data.voucherSettings.attributeInfoVoucherMaxPrice.primitiveType),
				this.validators.min(1, true, this.api.data.voucherSettings.attributeInfoVoucherMaxPrice.primitiveType),
				new PValidatorObject<(control : Pick<AbstractControl, 'value'>) => {
					[PPossibleErrorNames.MIN] : {
							name : PPossibleErrorNames.MIN;
							primitiveType : PApiPrimitiveTypes.Currency;
							min : number;
							actual : number;
					};
			} | null>({name: PPossibleErrorNames.MIN, fn: (control) => {
						if (!this.api.data.voucherSettings.voucherMinPrice) return null;
						if (!control.value) return null;
						if (Number.isNaN(+control.value)) return null;
						if (control.value === undefined) return null;
						if (control.value === '') return null;

						if (+control.value < this.api.data.voucherSettings.voucherMinPrice) return {
							[PPossibleErrorNames.MIN]: {
								name: PPossibleErrorNames.MIN,
								primitiveType: PApiPrimitiveTypes.Currency,
								min: this.api.data.voucherSettings.voucherMinPrice,
								actual: control.value,
							},
						};
						return null;
					}}),
			],
			(value) => {
				if (Number.isNaN(+value)) {
					this.api.data.voucherSettings.voucherMinPrice = undefined!;
					return;
				}
				this.api.data.voucherSettings.voucherMaxPrice = value;
			},
		);


		this.pFormsService.addControl(tempFormGroup, 'voucherHomepageDescriptionText',
			{
				value : this.api.data.voucherSettings.voucherHomepageDescriptionText,
				disabled: false,
			},
			[
				this.validators.required(this.api.data.voucherSettings.attributeInfoVoucherHomepageDescriptionText.primitiveType),
			],
			(value) => {
				this.api.data.voucherSettings.voucherHomepageDescriptionText = value;
			},
		);

		const initialVoucherExpirationDuration = (() => {
			if (this.api.data.voucherSettings.voucherExpirationDuration === null) return undefined;
			return this.api.data.voucherSettings.voucherExpirationDuration;
		})();

		this.pFormsService.addControl(tempFormGroup, 'voucherExpirationDuration',
			{
				value : initialVoucherExpirationDuration,
				disabled: false,
			},
			[
				this.validators.min(1, true, this.api.data.voucherSettings.attributeInfoVoucherExpirationDuration.primitiveType),
				this.validators.maxDecimalPlacesCount(0, this.api.data.voucherSettings.attributeInfoVoucherExpirationDuration.primitiveType),
			],
			(value) => {
				if (
					value === '' ||
					value === undefined ||
					value < 0 ||
					Number.isNaN(+value)
				) {
					this.api.data.voucherSettings.voucherExpirationDuration = null;
					return;
				}
				this.api.data.voucherSettings.voucherExpirationDuration = (!value ? null : +value);
			},
		);


		// eslint-disable-next-line literal-blacklist/literal-blacklist
		this.pFormsService.addControl(tempFormGroup, 'voucherMailReplyTo',
			{
				value : this.api.data.voucherSettings.voucherMailReplyTo,
				disabled: false,
			},
			[
				this.validators.email(),
				this.validators.required(this.api.data.voucherSettings.attributeInfoVoucherMailReplyTo.primitiveType),
			],
			(value) => {
				this.api.data.voucherSettings.voucherMailReplyTo = value;
			},
			this.asyncValidators.emailValidAsync(),
		);

		this.pFormsService.addControl(tempFormGroup, 'voucherCodeOnlyContainsDigits',
			{
				value : this.api.data.voucherSettings.voucherCodeOnlyContainsDigits,
				disabled: false,
			},
			[
			],
			(value : boolean) => {
				window.clearInterval(this.clearCodeExampleInterval ?? undefined);
				window.clearInterval(this.fillCodeExampleInterval ?? undefined);
				this.clearCodeExampleInterval = null;
				this.fillCodeExampleInterval = null;
				this.codeExample = '';
				this.api.data.voucherSettings.voucherCodeOnlyContainsDigits = value;
				const voucherCodePrefixControl = tempFormGroup.get('voucherCodePrefix');
				if (voucherCodePrefixControl) {
					voucherCodePrefixControl.updateValueAndValidity();
					if (voucherCodePrefixControl.invalid) {
						voucherCodePrefixControl.markAsTouched();
					}
				}
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'voucherCodePrefix',
			{
				value : this.api.data.voucherSettings.voucherCodePrefix,
				disabled: false,
			},
			[
				this.validators.required(this.api.data.voucherSettings.attributeInfoVoucherCodePrefix.primitiveType),
				new PValidatorObject({name: PPossibleErrorNames.UPPERCASE, fn: (control) => {
					if (this.api.data.voucherSettings.voucherCodeOnlyContainsDigits === true) return null;
					return this.validators.uppercase().fn(control);
				}}),
				new PValidatorObject({name: PPossibleErrorNames.MAX_DECIMAL_PLACES_COUNT, fn: (control) => {
					if (this.api.data.voucherSettings.voucherCodeOnlyContainsDigits !== true) return null;
					return this.validators.maxDecimalPlacesCount(0, this.api.data.voucherSettings.attributeInfoVoucherCodePrefix.primitiveType).fn(control);
				}}),
			],
			(value : string) => {
				window.clearInterval(this.clearCodeExampleInterval ?? undefined);
				window.clearInterval(this.fillCodeExampleInterval ?? undefined);
				this.clearCodeExampleInterval = null;
				this.fillCodeExampleInterval = null;
				this.codeExample = '';
				this.api.data.voucherSettings.voucherCodePrefix = value ? value.toString().toUpperCase() : value;
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'voucherCodeLength',
			{
				value : this.api.data.voucherSettings.voucherCodeLength,
				disabled: false,
			},
			[
				this.validators.required(this.api.data.voucherSettings.attributeInfoVoucherCodeLength.primitiveType),
				this.validators.maxDecimalPlacesCount(0, this.api.data.voucherSettings.attributeInfoVoucherCodeLength.primitiveType),
				this.validators.min(9, true, this.api.data.voucherSettings.attributeInfoVoucherCodeLength.primitiveType),
			],
			(value : number) => {
				window.clearInterval(this.clearCodeExampleInterval ?? undefined);
				window.clearInterval(this.fillCodeExampleInterval ?? undefined);
				this.clearCodeExampleInterval = null;
				this.fillCodeExampleInterval = null;
				this.codeExample = '';
				this.api.data.voucherSettings.voucherCodeLength = value;
			},
		);

		this.formGroup = tempFormGroup;
	}
}
