import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { FormattedDateTimePipe } from '../../formatted-date-time.pipe';

@Component({
	selector: 'p-basic-info',
	templateUrl: './basic-info.component.html',
	styleUrls: ['./basic-info.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PBasicInfoComponent {
	@HostBinding('class.title') protected _alwaysTrue = true;

	@Input() public name : string | null = null;
	@Input() public start : number | null = null;
	@Input() public end : number | null = null;
	@Input() public showDate : boolean = true;
	@Input() public showTime : boolean = true;
	@Input() public showEndTime : boolean = true;

	/**
	 * Should the date and time be shown in a 'danger' style
	 */
	@Input() public dateTimeHasDanger : boolean = false;

	@Input() public oneLine : boolean = false;
	@Input() public isRemoved : boolean | null = false;

	@HostBinding('class.d-flex')
	@HostBinding('class.justify-content-between')
	@HostBinding('class.align-items-center') private get _hasAlignItemsCenter() : boolean {
		return this.oneLine;
	}

	constructor(
		private datePipe : PDatePipe,
		private formattedDateTimePipe : FormattedDateTimePipe,
	) { }

	/**
	 * The time. No matter if a shiftId or shiftsRefs or whatever is provided.
	 */
	public get time() : string | null {
		if (!this.start) return '█:█ - █:█';

		let result = this.datePipe.transform(this.start, 'veryShortTime');
		const HAS_END_TIME = this.end && this.showEndTime;
		if (HAS_END_TIME) result += ` – ${this.datePipe.transform(this.end, 'veryShortTime')}`;
		return result;
	}

	/**
	 * The date. No matter if a shiftId or shiftsRefs or whatever is provided.
	 */
	public get date() : string | null {
		if (!this.start) return '██████ ████████';
		if (this.end) return this.formattedDateTimePipe.getFormattedDateInfo(this.start, this.end, true).full;

		return this.datePipe.transform(this.start, 'shortDate');
	}

}
