import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { MeService } from '@plano/shared/api';

@Component({
	selector: 'p-assign-members-headline',
	templateUrl: './p-assign-members-headline.component.html',
	styleUrls: ['./p-assign-members-headline.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PAssignMembersHeadlineComponent {
	@HostBinding('class.list-group-item')
	@HostBinding('class.p-0')
	@HostBinding('class.pl-3') protected _alwaysTrue = true;


	@Input() public editMode : boolean = false;
	@Input() public showHearts : boolean = false;

	constructor( public me : MeService ) {
	}
}
