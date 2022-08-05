import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';

@Component({
	selector: 'p-minimal-packet-info',
	templateUrl: './minimal-packet-info.component.html',
	styleUrls: ['./minimal-packet-info.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PMinimalPacketInfoComponent {
	@Input() public packetShiftsLength : number | null = null;
	@Input() public shiftIndex : number | null = null;

	constructor(
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;
}
