import { Component, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { MeService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';

@Component({
	selector: 'p-settings-menu-for-mobile',
	templateUrl: './settings-menu-for-mobile.component.html',
	styleUrls: ['./settings-menu-for-mobile.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class SettingsMenuForMobileComponent {
	public readonly CONFIG : typeof Config = Config;
	@Output() public clickedAnyButton : EventEmitter<undefined> = new EventEmitter<undefined>();

	constructor(
		public meService : MeService,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;
}
