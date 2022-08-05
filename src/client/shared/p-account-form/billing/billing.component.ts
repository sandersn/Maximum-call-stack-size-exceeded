import { AfterContentInit, TemplateRef } from '@angular/core';
import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { AccountApiCountry, AccountApiService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { TranslatePipe } from '@plano/shared/core/pipe/translate.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PThemeEnum } from '../../bootstrap-styles.enum';
import { EditableDirective } from '../../p-editable/editable/editable.directive';
import { PFormGroup } from '../../p-forms/p-form-control';
import { SectionWhitespace } from '../../page/section/section.component';

@Component({
	selector: 'p-billing[group]',
	templateUrl: './billing.component.html',
	styleUrls: ['./billing.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class BillingComponent implements AfterContentInit {
	public PlanoFaIconPool = PlanoFaIconPool;

	public readonly CONFIG : typeof Config = Config;
	@Input('group') public formGroup ! : PFormGroup;
	@Input() public turnIntoRealAccountForm : boolean = false;

	public countriesArray : AccountApiCountry[] = Object.values(AccountApiCountry).filter(
		(value) => !Number.isNaN(Number(value)),
	) as AccountApiCountry[];

	@Output() public initFormGroup = new EventEmitter<void>();

	constructor(
		public api : AccountApiService,
		private translatePipe : TranslatePipe,
		public modalService : ModalService,
		public pFormsService : PFormsService,
	) {
	}

	public PThemeEnum = PThemeEnum;
	public SectionWhitespace = SectionWhitespace;

	public ngAfterContentInit() : void {
		this.countriesArray = this.countriesArray.sort((a, b) => {
			const aKey = AccountApiCountry[a];
			const bKey = AccountApiCountry[b];
			const aLabel = this.translatePipe.transform(aKey);
			const bLabel = this.translatePipe.transform(bKey);
			if (aLabel === null || bLabel === null) return 0;
			if (typeof aLabel !== 'string' || typeof bLabel !== 'string') return 0;
			return aLabel.toLowerCase().localeCompare(bLabel.toLowerCase());
		});
	}

	/**
	 * Returns a modal that should shw up when the user switches to another country.
	 */
	public getBillCountryHook(billCountryHookContent : TemplateRef<unknown>) : EditableDirective['saveChangesHook'] {
		// Always return a hook. Sometimes the hook is instantly successful. Sometimes it opens a modal.
		return (success : () => void, dismiss : () => void) => {
			if (this.api.data.billing.country === AccountApiCountry.GERMANY) {
				success();
				return;
			}
			if (!!this.api.data.billing.vatNumber) {
				success();
				return;
			}

			this.modalService.openModal(billCountryHookContent, {
				success: success,
				dismiss: dismiss,
			});
		};
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isNoneGermanClient() : boolean {
		return this.api.data.locationCountry !== AccountApiCountry.GERMANY;
	}
}
