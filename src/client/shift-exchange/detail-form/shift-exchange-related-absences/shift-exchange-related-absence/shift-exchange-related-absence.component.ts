import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
// cSpell:ignore datetime
import { DateInfo } from '@plano/client/shared/formatted-date-time.pipe';
import { FormattedDateTimePipe } from '@plano/client/shared/formatted-date-time.pipe';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiAbsence } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';

@Component({
	selector: 'p-shift-exchange-related-absence[absence]',
	templateUrl: './shift-exchange-related-absence.component.html',
	styleUrls: ['./shift-exchange-related-absence.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PShiftExchangeRelatedAbsenceComponent {
	@Input() public absence ! : SchedulingApiAbsence;
	@Output() public onClick : EventEmitter<Id> = new EventEmitter<Id>();

	constructor(
		private rightsService : RightsService,
		private formattedDateTimePipe : FormattedDateTimePipe,
	) {}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get hideEditBtn() : boolean {
		return !this.rightsService.userCanWriteAbsences;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public getDateInfo(absence : SchedulingApiAbsence) : DateInfo {
		return this.formattedDateTimePipe.getFormattedDateInfo(
			absence.time.start,
			absence.time.end,
			true,
			absence.isFullDay,
		);
	}
}
