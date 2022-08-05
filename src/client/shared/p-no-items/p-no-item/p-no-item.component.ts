import { Component, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';
import { BootstrapSize } from '../../bootstrap-styles.enum';

@Component({
	selector: 'p-no-item',
	templateUrl: './p-no-item.component.html',
	styleUrls: ['./p-no-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PNoItemComponent {
	@HostBinding('class.card')
	@HostBinding('class.text-muted')
	@HostBinding('class.text-center')
	private _alwaysTrue : boolean = true;

	@Input() public size : BootstrapSize.SM | null = null;

	constructor(
	) {
	}
}
