import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Config } from '@plano/shared/core/config';

@Component({
	selector: 'p-person',
	templateUrl: './person.component.html',
	styleUrls: ['./person.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PPersonComponent {
	@Input() public firstName : string = '?';
	@Input() public lastName : string = '?';
	@Input() public tariffName : string | null = '?';
	@Input() public price : number | null = null;
	@Input() public additionalField : string | null = null;
	@Input() public additionalFieldValue : string | null = null;

	public CONFIG : typeof Config = Config;

	constructor(
	) {
	}
}
