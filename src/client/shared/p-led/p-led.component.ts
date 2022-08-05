import { ChangeDetectionStrategy, Input, HostBinding, Component } from '@angular/core';
import { BootstrapSize, PThemeEnum } from '../bootstrap-styles.enum';
import { PFormControlComponentInterface } from '../p-forms/p-form-control.interface';

@Component({
	selector: 'p-led',
	templateUrl: './p-led.component.html',
	styleUrls: ['./p-led.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PLedComponent {

	/**
	 * Does the LED has electricity?
	 * true if not.
	 */
	@Input() public off : boolean = true;

	/**
	 * What color style should the led have if turned on?
	 */
	@Input() public theme : PThemeEnum.SUCCESS | PThemeEnum.PRIMARY | PThemeEnum.WARNING | PThemeEnum.DANGER = PThemeEnum.SUCCESS;

	/**
	 * Is it a big or small LED?
	 */
	@Input() public size ?: PFormControlComponentInterface['size'] = null;

	@HostBinding('class.small') private get hasClassSmall() : boolean {
		return this.size === BootstrapSize.SM;
	}
	@HostBinding('class.large') private get hasClassLarge() : boolean {
		return this.size === BootstrapSize.LG;
	}

	constructor(
	) {
	}

	public PThemeEnum = PThemeEnum;
}
