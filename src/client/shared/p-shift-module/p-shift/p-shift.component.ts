import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { ShiftId } from '@plano/shared/api';

@Component({
	selector: 'p-shift',
	templateUrl: './p-shift.component.html',
	styleUrls: ['./p-shift.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PShiftComponent {
	@Input() public id : ShiftId | null = null;

	@Input() public selected : boolean = false;
	@Output() public selectedChange : EventEmitter<boolean> = new EventEmitter<boolean>();

	@Input() public disabled : boolean = false;
	@Input() public showDate : boolean = true;

	// @HostBinding('class.clickable') private _hasClickableClass() : boolean {
	// 	return this.showCheckbox;
	// }
	@HostBinding('class.selected') private get _hasSelectedClass() : boolean {
		return this.selected;
	}

	constructor(
	) {
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showCheckbox() : boolean {
		return !!this.selectedChange.observers.length;
	}
}
