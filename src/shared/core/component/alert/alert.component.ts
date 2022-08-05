import { Component, HostBinding, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { SLIDE_ON_NGIF_TRIGGER } from '@plano/animations';
import { PAlertTheme, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PlanoFaIconPool } from '../../plano-fa-icon-pool.enum';
import { FaIcon } from '../fa-icon/fa-icon-types';

/**
 * A type for Alerts, that defines mainly the the color of a alert component
 */

@Component({
	selector: 'p-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [SLIDE_ON_NGIF_TRIGGER],
})
export class AlertComponent {

	/**
	 * Icon to show inside the box.
	 * Can be set to null if you dont want any icon.
	 */
	@Input('icon') private _icon ?: AlertComponent['icon'] | null;

	/**
	 * Some visual style for the overall look of this ui element.
	 */
	@Input() public theme : PAlertTheme = PThemeEnum.WARNING;

	/**
	 * Gets emitted when the user clicks some kind of close-button. E.g. a `×` on the top right.
	 */
	@Output() private dismiss : EventEmitter<undefined> = new EventEmitter();

	@HostBinding('class.alert-dismissible')
	@Input() public dismissable : boolean | undefined;

	@HostBinding('attr.role') private _role : 'alert' = 'alert';
	@HostBinding('class.alert')
	private _alwaysTrue : boolean = true;

	constructor(
	) {
	}

	@HostBinding('class.d-none')
	@HostBinding('hidden') private get _isHidden() : boolean {
		return !this.visible;
	}
	public visible : boolean = true;

	@HostBinding('class.alert-danger') private get _alertDanger() : boolean { return this.theme === 'danger'; }
	@HostBinding('class.alert-dark') private get _alertDark() : boolean { return this.theme === 'dark'; }
	@HostBinding('class.alert-info') private get _alertInfo() : boolean { return this.theme === 'info'; }
	@HostBinding('class.alert-light') private get _alertLight() : boolean { return this.theme === 'light'; }
	@HostBinding('class.alert-plain') private get _alertPlain() : boolean { return this.theme === 'plain'; }
	@HostBinding('class.alert-primary') private get _alertPrimary() : boolean { return this.theme === 'primary'; }
	@HostBinding('class.alert-secondary') private get _alertSecondary() : boolean {
		return this.theme === 'secondary';
	}
	@HostBinding('class.alert-success') private get _alertSuccess() : boolean { return this.theme === 'success'; }
	@HostBinding('class.alert-warning') private get _alertWarning() : boolean { return this.theme === 'warning'; }

	/**
	 * Icon to show inside the box.
	 */
	public get icon() : FaIcon | null {
		if (this._icon !== undefined) return this._icon;
		if (this.theme === 'warning') return 'exclamation-triangle';
		if (this.theme === 'info') return PlanoFaIconPool.MORE_INFO;
		if (this.theme === 'danger') return PlanoFaIconPool.NOT_POSSIBLE;
		if (this.theme === 'success') return 'thumbs-up';
		return null;
	}

	/**
	 * when user clicked close
	 */
	public onClose() : void {
		this.visible = false;
		this.dismiss.emit();
	}
}
