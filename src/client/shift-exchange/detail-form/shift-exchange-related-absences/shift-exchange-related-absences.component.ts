import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { SchedulingApiAbsences } from '@plano/shared/api';
import { SchedulingApiAbsence } from '@plano/shared/api';
import { ApiListWrapper } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';

@Component({
	selector: 'p-shift-exchange-related-absences[absences]',
	templateUrl: './shift-exchange-related-absences.component.html',
	styleUrls: ['./shift-exchange-related-absences.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PShiftExchangeRelatedAbsencesComponent {
	@Input() private absences ! : SchedulingApiAbsences;
	@Output() public onClickAbsence : EventEmitter<Id> = new EventEmitter<Id>();

	constructor(
	) {}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get absencesForList() : ApiListWrapper<SchedulingApiAbsence> {
		return this.absences.sortedBy(item => item.time.start, false);
	}
}
