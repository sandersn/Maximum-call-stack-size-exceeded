import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { Config } from '@plano/shared/core/config';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PThemeEnum } from '../shared/bootstrap-styles.enum';

@Component({
	selector: 'p-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class MenuComponent {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.position-relative')
	@HostBinding('class.border')
	@HostBinding('class.border-top')
	@HostBinding('class.flex-column')
	@HostBinding('class.bg-primary') protected _alwaysTrue = true;

	public readonly CONFIG : typeof Config = Config;

	constructor(
		public modalService : ModalService,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public PThemeEnum = PThemeEnum;

	/**
	 * Open a Modal containing the settings.
	 */
	public openSettingsMenu(content : unknown) : void {
		this.modalService.openModal(content, {
			size: 'fullscreen',
			centered: true,
		});
	}
}
