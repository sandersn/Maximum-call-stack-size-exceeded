
import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { PCalendarShiftStyle } from '@plano/client/scheduling/shared/p-scheduling-calendar/p-shift-item-module/shift-item/shift-item-styles';
import { SchedulingApiShifts, SchedulingApiService, SchedulingApiAbsences, SchedulingApiHolidays, SchedulingApiBooking, SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiShiftExchange } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { BirthdayService } from '../../../scheduling/shared/api/birthday.service';
import { SchedulingApiBirthdays } from '../../../scheduling/shared/api/scheduling-api-birthday.service';
import { BootstrapSize } from '../../bootstrap-styles.enum';
import { HighlightService } from '../../highlight.service';
import { PShiftPickerService } from '../p-shift-picker.service';

@Component({
	selector: 'p-shift-picker-calendar[loadDetailedItem][availableShifts]',
	templateUrl: './shift-picker-calendar.component.html',
	styleUrls: ['./shift-picker-calendar.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PShiftPickerCalendarComponent {
	@Input() public availableShifts ! : SchedulingApiShifts;
	@Input() public loadDetailedItem ! : SchedulingApiBooking | SchedulingApiShiftExchange | SchedulingApiShift;
	@Input() public shiftTemplate : TemplateRef<unknown> | null = null;

	public readonly CONFIG : typeof Config = Config;

	constructor(
		public pShiftPickerService : PShiftPickerService,
		private highlightService : HighlightService,
		public api : SchedulingApiService,
		public birthdayService : BirthdayService,
	) {
	}

	public BootstrapSize = BootstrapSize;
	public PCalendarShiftStyle = PCalendarShiftStyle;
	public CalendarModes = CalendarModes;

	/**
	 * Get the absences that should be available to the calendar component
	 */
	public get absences() : SchedulingApiAbsences {
		if (!this.api.isLoaded()) return new SchedulingApiAbsences(null, false);
		return this.api.data.absences;
	}

	/**
	 * Get the holidays that should be available to the calendar component
	 */
	public get holidays() : SchedulingApiHolidays {
		if (!this.api.isLoaded()) return new SchedulingApiHolidays(null, false);
		return this.api.data.holidays;
	}

	/**
	 * Get the birthdays that should be available to the calendar component
	 */
	public get birthdays() : SchedulingApiBirthdays {
		if (!this.api.isLoaded()) return new SchedulingApiBirthdays(null, null, false);
		return this.birthdayService.birthdays;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public setSelectedDateAndLoadData(value : number) : void {
		this.pShiftPickerService.date = value;
		this.loadNewData();
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public setCalendarModeAndLoadData(value : CalendarModes) : void {
		this.pShiftPickerService.mode = value;
		this.loadNewData();
	}

	/**
	 * Load new Data
	 */
	public loadNewData(success ?: () => void) : void {
		this.highlightService.clear();

		this.pShiftPickerService.updateQueryParams();
		if (this.loadDetailedItem.isNewItem()) {
			this.api.load({
				searchParams: this.pShiftPickerService.queryParams,
				success: () => {
					if (success) success();
				},
			});
		} else {
			this.loadDetailedItem.loadDetailed({
				searchParams: this.pShiftPickerService.queryParams,
				success: () => {
					if (success) success();
				},
			});
		}
	}
}
