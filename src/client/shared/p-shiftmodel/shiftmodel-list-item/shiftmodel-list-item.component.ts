
import { Input, Component, ChangeDetectionStrategy, HostBinding, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'p-shiftmodel-list-item[label]',
	templateUrl: './shiftmodel-list-item.component.html',
	styleUrls: ['./shiftmodel-list-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PShiftmodelListItemComponent {
	@HostBinding('class.d-flex')
	@HostBinding('class.justify-content-between')
	@HostBinding('class.align-items-center')
	@HostBinding('class.position-relative') private _alwaysTrue = true;

	@Input('hasOnClickBinding') public _hasOnClickBinding : boolean | null = null;

	/**
	 * Is there a (onClick)="…" on this component?
	 */
	@HostBinding('class.list-group-item-action')
	public get hasOnClickBinding() : boolean {
		if (this._hasOnClickBinding !== null) return this._hasOnClickBinding;
		return this.onClick.observers.length > 0;
	}

	@Input() public label ! : string;
	@Input() public color : string | null = null;
	@Input() public isPacket : boolean | null = null;

	@Output() public onClick : EventEmitter<undefined> = new EventEmitter<undefined>();

	constructor(
	) {
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get hexColor() : string | null {
		if (!this.color) return null;
		return `#${this.color}`;
	}
}
