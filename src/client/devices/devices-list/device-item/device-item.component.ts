import { Component, Input, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { TimeStampApiService } from '@plano/shared/api';
import { TimeStampApiAllowedTimeStampDevice } from '@plano/shared/api';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';

@Component({
	selector: 'p-device-item[device]',
	templateUrl: './device-item.component.html',
	styleUrls: ['./device-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class DeviceItemComponent {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	@ViewChild('pInputRef', { static: false }) public pInputRef ?: any;
	@Input() public device ! : TimeStampApiAllowedTimeStampDevice;
	public editMode : boolean = false;

	constructor(public api : TimeStampApiService) {}

	public PlanoFaIconPool = PlanoFaIconPool;
	public BootstrapSize = BootstrapSize;

	/**
	 * Remove device from the list of allowed devices
	 */
	public onRemoveDevice() : void {
		this.api.data.allowedTimeStampDevices.removeItem(this.device);
		this.api.save();
	}

	/**
	 * Check if this device is the device the user is sitting at
	 */
	public get isCurrentDevice() : boolean {
		return this.api.data.allowedTimeStampDevices.matchesDeviceItem(this.device) ?? false;
	}

	/**
	 * Toggle editMode visually and save to api.
	 */
	public onToggleEditMode() : void {
		if (this.editMode) {
			this.api.save();
			this.editMode = false;
		} else {
			this.editMode = true;
			window.setTimeout(() => { this.pInputRef?.inputEl.nativeElement.focus(); }, 50);
		}

		// this.api.data.allowedTimeStampDevices.removeItem(this.device);
		// this.api.save();
	}

	/**
	 * Save changed name on enter
	 */
	public onEnter() : void {
		this.onToggleEditMode();
	}

}
