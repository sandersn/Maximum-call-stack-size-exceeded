import { Component, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiShiftModel } from '@plano/shared/api';
import { PThemeEnum } from '../../../../client/shared/bootstrap-styles.enum';

@Component({
	selector: 'p-modal-header',
	templateUrl: './modal-header.component.html',
	styleUrls: ['./modal-header.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class ModalHeaderComponent {
	@Input() public title : string | null = null;
	@Input() public item : SchedulingApiShift | SchedulingApiShiftModel | null = null;
	@Output() public onClose : EventEmitter<Event> = new EventEmitter<Event>();
	@Input() private theme : PThemeEnum | null = null;
	@Input() public hasDanger : boolean | null = null;

	constructor() {
	}

	/**
	 * Calculate the text color
	 */
	public get textWhite() : boolean {
		return (
			!!this.theme &&
			this.theme !== PThemeEnum.WARNING &&
			this.theme !== PThemeEnum.LIGHT
		);
	}

	/**
	 * Start of item
	 */
	public get start() : number | null {
		if (this.item === null) return null;
		if (this.item instanceof SchedulingApiShiftModel) return null;
		return this.item.start;
	}
}
