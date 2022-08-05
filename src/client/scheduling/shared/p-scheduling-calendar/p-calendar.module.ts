import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, DateAdapter, CalendarDateFormatter, CalendarMomentDateFormatter, MOMENT } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment-timezone';
import { NgxPopperjsModule } from 'ngx-popperjs';
import { SlicePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReportFilterService } from '@plano/client/report/report-filter.service';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { ClientSharedComponentsModule } from '@plano/client/shared/component/client-shared-components.module';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { PCalendarModule } from '@plano/client/shared/p-calendar/p-calendar.module';
import { PFormsModule } from '@plano/client/shared/p-forms/p-forms.module';
import { PMemberModule } from '@plano/client/shared/p-member/p-member.module';
import { PMemoModule } from '@plano/client/shared/p-memo/p-memo.module';
import { PShiftModule } from '@plano/client/shared/p-shift-module/p-shift.module';
import { PSidebarModule } from '@plano/client/shared/p-sidebar/p-sidebar.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { CalendarAbsencesDayBarComponent } from './calendar-absences-day-bar/calendar-absences-day-bar.component';
import { CalendarAbsencesWeekBarItemComponent } from './calendar-absences-week-bar/calendar-absences-week-bar-item/calendar-absences-week-bar-item.component';
import { CalendarAbsencesWeekBarComponent } from './calendar-absences-week-bar/calendar-absences-week-bar.component';
import { CalendarFilterSettingsComponent } from './calendar-filter-settings/calendar-filter-settings.component';
import { CalendarMonthWeekdaysBarComponent } from './calendar-month-weekdays-bar/calendar-month-weekdays-bar.component';
import { CalendarTitleBarComponent } from './calendar-title-bar/calendar-title-bar.component';
import { DeselectBtnComponent } from './calendar-title-bar/deselect-btn/deselect-btn.component';
import { WishPickerComponent } from './calendar-title-bar/wish-picker/wish-picker.component';
import { CalendarWeekdayBarComponent } from './calendar-weekday-bar/calendar-weekday-bar.component';
import { CalendarWeekdaysBarComponent } from './calendar-weekdays-bar/calendar-weekdays-bar.component';
import { CalenderAllDayItemLayoutService } from './calender-all-day-item-layout.service';
import { CalenderTimelineLayoutService } from './calender-timeline-layout.service';
import { PCalendarService } from './p-calendar.service';
import { ListViewComponent } from './p-calendar/list-view/list-view.component';
import { MonthCellComponent } from './p-calendar/month-cell/month-cell.component';
import { PNowLineComponent } from './p-calendar/now-line/now-line.component';
import { PAllDayItemComponent } from './p-calendar/p-all-day-items-list/p-all-day-item/p-all-day-item.component';
import { PAllDayItemsListComponent } from './p-calendar/p-all-day-items-list/p-all-day-items-list.component';
import { PCalendarMonthViewComponent } from './p-calendar/p-calendar-month-view/p-calendar-month-view.component';
import { PSchedulingCalendarComponent } from './p-calendar/p-calendar.component';
import { PCellTopComponent } from './p-calendar/p-cell-top/p-cell-top.component';
import { PTimelineDayComponent } from './p-calendar/timeline-day/timeline-day.component';
import { PTimelineNowLineComponent } from './p-calendar/timeline-now-line/timeline-now-line.component';
import { PTimelineSeparatorsComponent } from './p-calendar/timeline-separators/timeline-separators.component';
import { PTimelineShiftModelParentColumnComponent } from './p-calendar/timeline-shiftmodel-parent-column/timeline-shiftmodel-parent-column.component';
import { PTimelineWeekComponent } from './p-calendar/timeline-week/timeline-week.component';
import { WeekCellComponent } from './p-calendar/week-view/week-cell/week-cell.component';
import { WeekViewComponent } from './p-calendar/week-view/week-view.component';
import { PShiftItemModule } from './p-shift-item-module/p-shift-item.module';
import { SchedulingFilterService } from '../../scheduling-filter.service';

export const momentAdapterFactory = () : DateAdapter => {
	return adapterFactory(moment);
};

@NgModule({
	imports: [
		CalendarModule.forRoot(
			{
				provide: DateAdapter,
				useFactory: momentAdapterFactory,
			},
			{
				dateFormatter: {
					provide: CalendarDateFormatter,
					useClass: CalendarMomentDateFormatter,
				},
			},
		),
		ClientSharedComponentsModule,
		ClientSharedModule,
		CoreModule,
		NgbDatepickerModule,
		PCalendarModule,
		NgxPopperjsModule.forRoot({ disableAnimation: true }),
		PFormsModule,
		PMemberModule,
		PMemoModule,
		PShiftItemModule,
		PShiftModule,
		PSidebarModule,
	],
	declarations: [
		CalendarAbsencesDayBarComponent,
		CalendarAbsencesWeekBarComponent,
		CalendarAbsencesWeekBarItemComponent,
		CalendarFilterSettingsComponent,
		CalendarMonthWeekdaysBarComponent,
		CalendarTitleBarComponent,
		CalendarWeekdayBarComponent,
		CalendarWeekdaysBarComponent,
		DeselectBtnComponent,
		ListViewComponent,
		MonthCellComponent,
		PAllDayItemComponent,
		PAllDayItemsListComponent,
		PCalendarMonthViewComponent,
		PCellTopComponent,
		PNowLineComponent,
		PSchedulingCalendarComponent,
		PTimelineDayComponent,
		PTimelineNowLineComponent,
		PTimelineSeparatorsComponent,
		PTimelineShiftModelParentColumnComponent,
		PTimelineWeekComponent,
		WeekCellComponent,
		WeekViewComponent,
		WishPickerComponent,
	],
	providers: [
		CalenderAllDayItemLayoutService,
		CalenderTimelineLayoutService,
		HighlightService,
		PCalendarService,
		PDatePipe,
		ReportFilterService,
		SchedulingFilterService,
		SlicePipe,
		{
			provide: MOMENT,
			useValue: moment,
		},
	],
	exports: [
		CalendarAbsencesDayBarComponent,
		CalendarAbsencesWeekBarComponent,
		CalendarFilterSettingsComponent,
		CalendarMonthWeekdaysBarComponent,
		CalendarTitleBarComponent,
		CalendarWeekdayBarComponent,
		CalendarWeekdaysBarComponent,
		PAllDayItemsListComponent,
		PCellTopComponent,
		PSchedulingCalendarComponent,
		WeekCellComponent,
	],
})
export class PSchedulingCalendarModule {}
