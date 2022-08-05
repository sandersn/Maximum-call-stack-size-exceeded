import { Component, ChangeDetectionStrategy, HostBinding, Input } from '@angular/core';
import { PBackgroundColorEnum } from '@plano/client/shared/bootstrap-styles.enum';

@Component({
	selector: 'p-interface-card',
	templateUrl: './interface-card.component.html',
	styleUrls: ['./interface-card.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class InterfaceCardComponent {
	@HostBinding('class.card')
	@HostBinding('class.bg-light')
	@HostBinding('class.clickable')
	@HostBinding('class.shadow-hover')
	private _alwaysTrue = true;

	@HostBinding('class.is-active') private get _isActive() : boolean {
		return this.isActive === true;
	}
	@HostBinding('class.is-inactive') private get _isInactive() : boolean {
		return this.isActive === false;
	}

	@Input() public isActive : boolean = false;
	@Input() public headline : string | null = null;
	@Input() public subtitle : string | null = null;
	@Input() public description : string | null = null;
	@Input() public img : string | null = null;

	@Input() public bgStyle : PBackgroundColorEnum = PBackgroundColorEnum.WHITE;

	constructor(
	) {
	}
}
