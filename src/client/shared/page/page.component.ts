import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
	selector: 'p-page',
	templateUrl: './page.component.html',
	styleUrls: ['./page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent {
	@Input() public whitespace : boolean = true;

	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.flex-column')
	@HostBinding('class.position-relative') protected _alwaysTrue = true;

	constructor() { }

}
