import { Component, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { Input } from '@angular/core';

@Component({
	selector: 'p-pause-duration',
	templateUrl: './pause-duration.component.html',
	styleUrls: ['./pause-duration.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PauseDurationComponent {
	@Input() public merged : boolean = false;
	@Input() public duration : number | null = null;
	@Input() public regularPauseDuration : number | null = null;
	@Input() public automaticPauseDuration : number | null = null;
	@Input() public memberName : string | null = null;
	@Input() public tooltipTemplate : TemplateRef<unknown> | null = null;
	@Input() public isForecast : boolean = false;

	constructor() {}

}
