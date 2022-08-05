import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Config } from '@plano/shared/core/config';
import { PThemeEnum } from '../../../../shared/bootstrap-styles.enum';
import { SchedulingApiBooking } from '../../api/scheduling-api-booking.service';

@Component({
	selector: 'p-persons',
	templateUrl: './persons.component.html',
	styleUrls: ['./persons.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PPersonsComponent {
	@Input() public count : number | '?' = '?';
	@Input() public tariffName : string | null = '?';
	@Input() public ageMin : number | null | '?' = '?';
	@Input() public ageMax : number | null | '?' = '?';
	@Input() public additionalFieldLabel : string | null = null;
	@Input() public additionalFieldValue : SchedulingApiBooking['additionalFieldValue'] = null;
	@Input() public price : number | null = null;

	@Input() public tariffNotAvailableThatTime : boolean = false;
	@Input() public ageLimitWarning : string | null = null;

	public CONFIG : typeof Config = Config;

	constructor(
	) {
	}

	public PThemeEnum = PThemeEnum;
}
