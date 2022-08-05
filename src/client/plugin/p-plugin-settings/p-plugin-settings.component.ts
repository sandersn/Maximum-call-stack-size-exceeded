import { Component, ChangeDetectionStrategy, EventEmitter, Output, Input } from '@angular/core';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PFormGroup } from '@plano/client/shared/p-forms/p-form-control';
import { SectionWhitespace } from '@plano/client/shared/page/section/section.component';
import { AccountApiService, SchedulingApiService } from '@plano/shared/api';
import { Config } from '../../../shared/core/config';
import { PThemeEnum } from '../../shared/bootstrap-styles.enum';

@Component({
	selector: 'p-plugin-settings',
	templateUrl: './p-plugin-settings.component.html',
	styleUrls: ['./p-plugin-settings.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PPluginSettingsComponent {
	@Input('group') public formGroup : PFormGroup | null = null;

	@Output() public initFormGroup : EventEmitter<undefined> = new EventEmitter();

	constructor(
		public api : SchedulingApiService,
		public accountApi : AccountApiService,
		public pFormsService : PFormsService,
	) {
	}

	public Config = Config;
	public PThemeEnum = PThemeEnum;

	public SectionWhitespace = SectionWhitespace;
}
