import { AfterContentInit} from '@angular/core';
import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { AccountApiService } from '@plano/shared/api';
import { PAccountFormService } from '../shared/p-account-form/p-account-form.service';
import { PFormGroup } from '../shared/p-forms/p-form-control';
import { PTabSizeEnum } from '../shared/p-tabs/p-tabs/p-tab/p-tab.component';

@Component({
	selector: 'p-account-form',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class AccountFormComponent implements AfterContentInit {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.position-relative') protected _alwaysTrue = true;

	constructor(
		private pAccountFormService : PAccountFormService,
		public api : AccountApiService,
		private pMoment : PMomentService,
	) {
	}

	public BootstrapSize = BootstrapSize;
	public PTabSizeEnum = PTabSizeEnum;

	public today ! : number;
	public formGroup : PFormGroup | null = null;

	public ngAfterContentInit() : void {
		this.initComponent();
	}

	/**
	 * Load and set everything that is necessary for this component
	 */
	public initComponent(done ?: () => void) : void {
		this.today = +this.pMoment.m().startOf('day');

		this.api.load({
			success: () => {
				this.initFormGroup();
				if (done) { done(); }
			},
		});
	}

	/**
	 * Initialize the formGroup for this component
	 */
	public initFormGroup() : void {
		if (this.formGroup) { this.formGroup = null; }
		this.formGroup = this.pAccountFormService.getPAccountFormGroup(this.api) as PFormGroup;
	}
}
