import { AfterContentInit, TemplateRef } from '@angular/core';
import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input, NgZone } from '@angular/core';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { ToastsService } from '@plano/client/service/toasts.service';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { DetailFormComponentInterface } from '@plano/client/shared/detail-form-component.interface';
import { SchedulingApiVoucher } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { AsyncValidatorsService } from '@plano/shared/core/async-validators.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { ValidatorsService } from '@plano/shared/core/validators.service';

@Component({
	selector: 'p-detail-form[item]',
	templateUrl: './detail-form.component.html',
	styleUrls: ['./detail-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class DetailFormComponent implements AfterContentInit, DetailFormComponentInterface<SchedulingApiVoucher<'validated' | 'draft'>> {
	@Input() public item ! : SchedulingApiVoucher<'draft' | 'validated'>;
	public formGroup : DetailFormComponentInterface['formGroup'] | null = null;

	constructor(
		private zone : NgZone,
		public api : SchedulingApiService,
		private pFormsService : PFormsService,
		private pRouterService : PRouterService,
		private validators : ValidatorsService,
		private asyncValidators : AsyncValidatorsService,
		private modalService : ModalService,
		private toasts : ToastsService,
		private localize : LocalizePipe,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public PThemeEnum = PThemeEnum;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;

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

		const item = this.item;
		this.pFormsService.addControl(newFormGroup, 'reference',
			{
				value: item,
				disabled: false,
			},
		);
		this.pFormsService.addControl(newFormGroup, 'code',
			{
				value: item.code,
				disabled: false,
			},
		);
		this.pFormsService.addControl(newFormGroup, 'bookingNumber',
			{
				value: item.bookingNumber,
				disabled: true,
			},
		);
		this.pFormsService.addControl(newFormGroup, 'price',
			{
				value: item.price,
				disabled: false,
			},
		);
		this.pFormsService.addPControl(newFormGroup, 'currentValue',
			{
				formState: {
					value: item.currentValue,
					disabled: false,
				},
				validatorOrOpts: [
					this.validators.required(item.attributeInfoCurrentValue.primitiveType),
					this.validators.maxDecimalPlacesCount(0, item.attributeInfoCurrentValue.primitiveType),
					this.validators.max(item.price, true, item.attributeInfoCurrentValue.primitiveType),
				],
				subscribe: value => {
					item.currentValue = value;
				},
			},
		);
		this.pFormsService.addControl(newFormGroup, 'email',
			{
				value: item.email,
				disabled: false,
			},
			[
				this.validators.required(item.attributeInfoEmail.primitiveType),
				this.validators.email(),
			],
			(value : string) => {
				item.email = value;
			},
			this.asyncValidators.emailValidAsync(),
		);
		this.pFormsService.addControl(newFormGroup, 'firstName',
			{
				value: item.firstName,
				disabled: false,
			},
			[
				this.validators.required(item.attributeInfoFirstName.primitiveType),
			],
			(value : string) => {
				item.firstName = value;
			},
		);
		this.pFormsService.addControl(newFormGroup, 'lastName',
			{
				value: item.lastName,
				disabled: false,
			},
			[
				this.validators.required(item.attributeInfoLastName.primitiveType),
			],
			(value : string) => {
				item.lastName = value;
			},
		);
		this.pFormsService.addControl(newFormGroup, 'forDescription',
			{
				value: item.forDescription,
				disabled: false,
			},
			[
				this.validators.maxLength(75, item.attributeInfoForDescription.primitiveType),
			],
			(value : string) => {
				item.forDescription = value;
			},
		);

		this.pFormsService.addControl(newFormGroup, 'dateOfBooking',
			{
				value: item.dateOfBooking,
				disabled: false,
			},
		);

		this.pFormsService.addControl(newFormGroup, 'expirationDate',
			{
				value: item.expirationDate,
				disabled: false,
			},
			[],
		);

		this.formGroup = newFormGroup;
	}

	/**
	 * Remove Item of this Detail page
	 */
	public removeItem() : void {
		this.formGroup = null;
		this.api.data.vouchers.removeItem(this.item);

		this.pRouterService.navBack();
		this.api.save({
			success : () => {
			},
		});
	}

	/**
	 * Open a modal with all the placeholders available
	 */
	public showPlaceholdersForEmail(modalContent : TemplateRef<unknown>) : void {
		this.modalService.openModal(modalContent, {
			size: BootstrapSize.LG,
		});
	}

	@Output() public onAddItem : EventEmitter<SchedulingApiVoucher> =
		new EventEmitter<SchedulingApiVoucher>();

	/**
	 * Save this item
	 */
	public saveItem() : void {
		if (!this.item.isNewItem()) return;
		this.onAddItem.emit(this.item);
		this.pRouterService.navBack();
	}

	/**
	 * Copy string to clipboard
	 */
	public copySnippet(input : string) : void {
		this.copyString(input);
	}


	private timeout : number | null = null;
	public copiedToClipboard : string | number | null = null;

	/**
	 * Copy string to clipboard
	 */
	public copyString(input : string | number) : void {
		window.clearTimeout(this.timeout ?? undefined);

		// Create a dummy input to copy the string array inside it
		const dummy = document.createElement('input');
		// Output the array into it
		dummy.value = typeof input === 'number' ? input.toString() : input;
		// Add it to the document
		document.body.appendChild(dummy);
		// Set its ID
		dummy.setAttribute('id', 'dummy_id');
		// Select it
		dummy.select();
		// Copy its contents
		document.execCommand('copy');
		// Remove it as its not needed anymore
		document.body.removeChild(dummy);

		this.copiedToClipboard = input;

		this.toasts.addToast({
			title: this.localize.transform('OK!'),
			content: this.localize.transform('Wurde in die Zwischenablage kopiert'),
			// + ` und kann mit <code>STRG + V</code> bzw. <code>⌘ + V</code> eingefügt werden.`,
			theme: PThemeEnum.SUCCESS,
			icon: 'clipboard',
			visibilityDuration: 'short',
		});

		this.zone.runOutsideAngular(() => {
			this.timeout = window.setTimeout(() => {
				this.zone.run(() => {
					if (this.copiedToClipboard) this.copiedToClipboard = null;
				});
			}, 4500);
		});
	}

}
