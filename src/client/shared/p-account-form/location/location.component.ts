import { AfterContentInit } from '@angular/core';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { AccountApiCountry, AccountApiService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { TranslatePipe } from '@plano/shared/core/pipe/translate.pipe';
import { PFormGroup } from '../../p-forms/p-form-control';
import { FormControlSwitchType } from '../../p-forms/p-form-control-switch/p-form-control-switch.component';
import { SectionWhitespace } from '../../page/section/section.component';

@Component({
	selector: 'p-location[group]',
	templateUrl: './location.component.html',
	styleUrls: ['./location.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class LocationComponent implements AfterContentInit {
	public readonly CONFIG : typeof Config = Config;
	@Input('group') public formGroup ! : PFormGroup;
	@Input() public turnIntoRealAccountForm : boolean = false;

	public countriesArray : AccountApiCountry[] = Object.values(AccountApiCountry).filter(
		(value) => !Number.isNaN(Number(value)),
	) as AccountApiCountry[];

	constructor(
		public api : AccountApiService,
		private translatePipe : TranslatePipe,
	) {
	}

	public SectionWhitespace = SectionWhitespace;
	public FormControlSwitchType = FormControlSwitchType;

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
}
