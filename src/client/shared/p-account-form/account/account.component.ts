import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { AccountApiService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { PFormGroup } from '../../p-forms/p-form-control';
import { SectionWhitespace } from '../../page/section/section.component';

@Component({
	selector: 'p-account[group]',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class AccountComponent {
	@Input('group') public formGroup ! : PFormGroup;
	@Input() public turnIntoRealAccountForm : boolean = false;

	constructor(
		public api : AccountApiService,
		public meService : MeService,
	) { }

	public SectionWhitespace = SectionWhitespace;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;

}
