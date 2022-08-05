import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { TimeStampApiService } from '@plano/shared/api';

@Component({
	selector: 'p-devices-list',
	templateUrl: './devices-list.component.html',
	styleUrls: ['./devices-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class DevicesListComponent {
	@HostBinding('class.h-100')
	@HostBinding('class.bg-dark') protected _alwaysTrue = true;

	constructor(public api : TimeStampApiService) {}

	public PThemeEnum = PThemeEnum;
}