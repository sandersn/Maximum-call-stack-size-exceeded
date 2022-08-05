import { AfterContentInit, OnDestroy } from '@angular/core';
import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { AccountApiType, MeService } from '@plano/shared/api';
import { AccountApiService } from '@plano/shared/api';
import { PSupportedCurrencyCodes } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '@plano/shared/core/config';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../shared/core/null-type-utils';
import { BootstrapSize, PThemeEnum } from '../shared/bootstrap-styles.enum';
import { PAccountFormService } from '../shared/p-account-form/p-account-form.service';
import { PFormGroup } from '../shared/p-forms/p-form-control';

@Component({
	selector: 'p-test-account',
	templateUrl: './test-account.component.html',
	styleUrls: ['./test-account.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class TestAccountComponent implements AfterContentInit, OnDestroy {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.position-relative') protected _alwaysTrue = true;

	constructor(
		private pAccountFormService : PAccountFormService,
		public meService : MeService,
		private modalService : ModalService,
		public api : AccountApiService,
		private pRouterService : PRouterService,
		private pMoment : PMomentService,
	) {
		this.api.data.transformingToPaidAccount = true;
	}

	public AccountApiType = AccountApiType;
	public Config = Config;
	public PlanoFaIconPool = PlanoFaIconPool;
	public PSupportedCurrencyCodes = PSupportedCurrencyCodes;
	public PThemeEnum = PThemeEnum;

	public agreedToTerms : boolean = false;
	public agreedToDataUsage : boolean = false;

	public today ! : number;
	public formGroup : PFormGroup | null = null;

	public ngAfterContentInit() : void {
		this.initComponent();
	}

	public ngOnDestroy() : void {
		this.api.data.transformingToPaidAccount = false;
	}

	/**
	 * Load and set everything that is necessary for this component
	 */
	public initComponent(done ?: () => void) : void {
		this.today = +this.pMoment.m().startOf('day');

		// Site must be reloaded no matter where user is navigation from
		// if (this.api.isLoaded()) {
		// 	this.initFormGroup();
		// 	return;
		// }

		this.api.load({
			success: () => {

				this.initFormGroup();
				if (done) { done(); }
			},
		});
	}

	/**
	 * Initialize the form-group for this component
	 */
	public initFormGroup() : void {
		if (this.formGroup) this.formGroup = null;
		this.formGroup = this.pAccountFormService.getPAccountFormGroup(this.api) as PFormGroup;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public convertIntoRealAccount(
		modalContent : unknown,
		successModalContent : unknown,
	) : () => void {
		return this.modalService.getEditableHook(modalContent, {
			size: 'xl',
			success : () => {
				this.api.data.type = AccountApiType.PAID;
				this.api.save(
					{
						success: () => {
							this.meService.load();
							this.modalService.openModal(successModalContent, {
								size: BootstrapSize.LG,
								backdrop : 'static',
							});
						},
					},
				);
			},
			dismiss: () => {
				this.dismissConfirmModal();
			},
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onYeah() : void {
		this.pRouterService.navigate(['/client/']);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public dismissConfirmModal(d ?: (input : string) => void) : void {
		this.agreedToDataUsage = false;
		this.agreedToTerms = false;
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		const sepaControl = this.formGroup.get('payment')?.get('sepaAgreement') ?? null;
		assumeNonNull(sepaControl, `We assume 'sepaAgreement' to be defined here`);
		sepaControl.setValue(false);
		if (d) d('Dismiss click');
	}
}
