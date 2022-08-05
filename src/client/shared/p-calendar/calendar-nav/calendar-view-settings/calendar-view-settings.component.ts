import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { BootstrapRounded, BootstrapSize, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { Config } from '@plano/shared/core/config';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PButtonType } from '../../../p-forms/p-button/p-button.component';

@Component({
	selector: 'p-calendar-view-settings',
	templateUrl: './calendar-view-settings.component.html',
	styleUrls: ['./calendar-view-settings.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class CalendarViewSettingsComponent implements PComponentInterface {
	@Input() public showListBtn : boolean = true;
	@Input() public hideLabels : boolean = false;

	@Input() public calendarMode : CalendarModes | null = null;
	@Output() private calendarModeChange : EventEmitter<CalendarModes> = new EventEmitter();

	@Input() public showDayAsList : boolean = false;
	@Output() public showDayAsListChange : EventEmitter<boolean> = new EventEmitter();
	@Input() public showWeekAsList : boolean = false;
	@Output() public showWeekAsListChange : EventEmitter<boolean> = new EventEmitter();

	@Input() public isLoading : PComponentInterface['isLoading'] = false;

	/**
	 * Navigate to 'month', 'week', 'day'…
	 */
	public switchCalendarMode(input : CalendarModes) : void {
		this.calendarMode = input;
		this.calendarModeChange.emit(this.calendarMode);
	}

	constructor() {
	}

	public BootstrapRounded = BootstrapRounded;
	public PThemeEnum = PThemeEnum;
	public BootstrapSize = BootstrapSize;
	public CalendarModes = CalendarModes;
	public PButtonType = PButtonType;
	public PlanoFaIconPool = PlanoFaIconPool;

	public config : typeof Config = Config;
}
