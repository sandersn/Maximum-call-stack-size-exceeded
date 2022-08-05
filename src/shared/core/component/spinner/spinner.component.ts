import { Component, ChangeDetectionStrategy, HostBinding, Input } from '@angular/core';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { PFormControlComponentInterface } from '@plano/client/shared/p-forms/p-form-control.interface';

@Component({
	selector: 'p-spinner',
	templateUrl: './spinner.component.html',
	styleUrls: ['./spinner.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
	@HostBinding('class.align-items-center')
	@HostBinding('class.justify-content-center')
	@HostBinding('class.h-100') protected _alwaysTrue = true;

	@Input() public size ?: PFormControlComponentInterface['size'] = null;

	constructor() {}

	public BootstrapSize = BootstrapSize;
}
