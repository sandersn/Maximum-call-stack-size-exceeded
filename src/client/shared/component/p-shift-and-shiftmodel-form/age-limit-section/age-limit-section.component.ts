import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SchedulingApiService, SchedulingApiShiftModel } from '../../../../../shared/api';
import { PThemeEnum } from '../../../bootstrap-styles.enum';
import { PFormGroup } from '../../../p-forms/p-form-control';
import { SectionWhitespace } from '../../../page/section/section.component';

@Component({
	selector: 'p-age-limit-section[shiftModel][formGroup][api]',
	templateUrl: './age-limit-section.component.html',
	styleUrls: ['./age-limit-section.component.scss'],
})
export class AgeLimitSectionComponent {
	@Input() public shiftModel ! : SchedulingApiShiftModel;
	@Input() public formGroup ! : PFormGroup;
	@Input() public api ! : SchedulingApiService;
	@Input() public userCanWrite : boolean = false;

	@Output() public initFormGroup = new EventEmitter();

	constructor(
	) { }

	public SectionWhitespace = SectionWhitespace;
	public PThemeEnum = PThemeEnum;

	/** Which limits are there for the booking person? Improves readability of the template file. */
	public get bookingPersonAgeLimits() : 'minLimit' | null {
		const hasMinLimit = (() : boolean => {
			return this.shiftModel.bookingPersonMinAge !== null;
		})();
		if (hasMinLimit) return 'minLimit';
		return null;
	}

	/** Which limits are there for the participants? Improves readability of the template file. */
	public get participantAgeLimits() : 'minLimit' | 'maxLimit' | 'minAndMaxLimit' | null {
		const hasMinLimit = this.shiftModel.participantMinAge !== null;
		const hasMaxLimit = this.shiftModel.participantMaxAge !== null;
		if (hasMinLimit) {
			if (hasMaxLimit) return 'minAndMaxLimit';
			return 'minLimit';
		}
		if (hasMaxLimit) return 'maxLimit';
		return null;
	}
}
