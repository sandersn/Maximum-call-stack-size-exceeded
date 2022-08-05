/* eslint-disable @angular-eslint/component-selector */
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PFormGroup } from '../../p-forms/p-form-control';
import { PShiftAndShiftmodelFormService } from '../p-shift-and-shiftmodel-form/p-shift-and-shiftmodel-form.service';

@Component({
	selector: 'weekdays[weekdayFormGroup]',
	templateUrl: './weekdays.component.html',
	styleUrls: ['./weekdays.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class WeekdaysComponent {
	@Input() public disabled : boolean = false;
	@Input() public label : string | null = null;

	@Input() public weekdayFormGroup ! : PFormGroup;

	constructor(
		public pShiftAndShiftmodelFormService : PShiftAndShiftmodelFormService,
		private localize : LocalizePipe,
	) {
		if (this.label === null) this.label = this.localize.transform('An jedem');
	}
}
