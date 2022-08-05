import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { PShiftmodelTariffService } from '../../p-forms/p-shiftmodel-tariff.service';

@Component({
	selector: 'p-tariff-meta-info',
	templateUrl: './tariff-meta-info.component.html',
	styleUrls: ['./tariff-meta-info.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PTariffMetaInfoComponent {
	@Input() public negateForCourseDatesInterval : boolean = false;
	@Input() public forCourseDatesFrom : number | null = null;
	@Input() public forCourseDatesUntil : number | null = null;
	@Input() public isInternal : boolean = false;
	@Input() public isInternalLabel : string | null = null;
	@Input() public longText : boolean = false;

	constructor(
		private pShiftmodelTariffService : PShiftmodelTariffService,
	) { }

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get hasCourseDatesData() : boolean {
		return this.pShiftmodelTariffService.hasCourseDatesData(
			this.negateForCourseDatesInterval,
			this.forCourseDatesFrom,
			this.forCourseDatesUntil,
		);
	}
}
