import { Component, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormattedDateTimePipe } from '@plano/client/shared/formatted-date-time.pipe';
import { TimeStampApiShift} from '@plano/shared/api';
import { TimeStampApiShifts } from '@plano/shared/api';
import { TimeStampApiService } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';

@Component({
	selector: 'p-shift-select',
	templateUrl: './shift-select.component.html',
	styleUrls: ['./shift-select.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class ShiftSelectComponent {
	@Input() public disabled : boolean | null = null;
	@Input() private selectedShiftId : Id | null = null;
	@Output() private selectedShiftIdChange : EventEmitter<Id> = new EventEmitter<Id>();

	@Input('shifts') private _shifts : TimeStampApiShifts | null = null;

	/**
	 * Label for the trigger-button. Has a default like "Wähle deine Schicht" but can be overwritten here.
	 */
	@Input() public placeholder : string | null = null;

	constructor(
		public api : TimeStampApiService,
		public formattedDateTimePipe : FormattedDateTimePipe,
	) {
	}

	public isOpen : boolean = false;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public onSelect(shift : TimeStampApiShift) : void {
		this.isOpen = false;
		this.selectedShiftIdChange.emit(shift.id);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get selectedShift() : TimeStampApiShift | null {
		if (this.selectedShiftId !== null) {
			return this._shifts!.get(this.selectedShiftId);
		}
		return null;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get shifts() : TimeStampApiShift[] {
		return this._shifts!.iterableSortedBy(item => item.start);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public getFormattedTimeInfo(start : number, end ?: number) : string | null {
		return this.formattedDateTimePipe.getFormattedTimeInfo(start, end).full;
	}
}
