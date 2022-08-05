import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { PFormControl } from '@plano/client/shared/p-forms/p-form-control';
import { TimeStampApiService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PFingerprintService } from '../../shared/core/fingerprint.service';
import { PThemeEnum } from '../shared/bootstrap-styles.enum';

@Component({
	selector: 'p-devices',
	templateUrl: './devices.component.html',
	styleUrls: ['./devices.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class DevicesComponent {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.position-relative')
	@HostBinding('class.h-100') protected _alwaysTrue = true;

	public formControl ! : PFormControl;

	public readonly CONFIG : typeof Config = Config;

	constructor(
		public api : TimeStampApiService,
		private localize : LocalizePipe,
		public fingerprintService : PFingerprintService,
	) {
		this.api.load();
		this.initFormControl();
	}
	public PlanoFaIconPool = PlanoFaIconPool;
	public PThemeEnum = PThemeEnum;

	/**
	 * Get a placeholder / default name for a new device
	 */
	public get defaultDeviceName() : string {
		const deviceCount = this.api.data.allowedTimeStampDevices.length + 1;
		return this.localize.transform('Gerät Nr. ${deviceCount}', {
			deviceCount: deviceCount.toString(),
		});
	}

	/**
	 * Add the current device to the list of allowed devices
	 */
	public addDevice() : void {
		let name = '';
		if (this.formControl.value?.length) {
			name = this.formControl.value;
		} else {
			name = this.defaultDeviceName;
		}

		this.api.data.allowedTimeStampDevices.allowDeviceToTimeStamp(name);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onEnter() : void {
		this.addDevice();
	}

	/**
	 * Check if the current device is allowed to timestamp. `undefined` is returned if this cannot be determined yet.
	 */
	public get isAllowedTimeStampDevice() : boolean | undefined {
		return this.api.data.allowedTimeStampDevices.isDeviceAllowedToTimeStamp();
	}

	/**
	 * Should the "new Device" section be visible?
	 */
	public get showNewDeviceSection() : boolean {
		const allowedDevicesAreDefined = this.api.data.allowedTimeStampDevices.isDeviceAllowedToTimeStamp() !== undefined;
		const deviceIsNotAllowed = !this.isAllowedTimeStampDevice;
		return this.api.isLoaded() && allowedDevicesAreDefined && (
			deviceIsNotAllowed || !this.api.data.allowedTimeStampDevices.length
		);
	}

	private initFormControl() : void {
		this.formControl = new PFormControl({
			formState: {
				value : '',
				disabled: false,
			},
		});
	}
}
