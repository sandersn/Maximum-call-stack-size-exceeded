import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReportUrlParamsService } from '@plano/client/report/report-url-params.service';
import { ReportService } from '@plano/client/report/report.service';
import { CourseFilterService } from '@plano/client/scheduling/course-filter.service';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { BookingsService } from '@plano/client/scheduling/shared/p-bookings/bookings.service';
import { FilterService } from '@plano/client/shared/filter.service';
import { PShiftExchangeListService } from '@plano/client/shared/p-shift-exchange/p-shift-exchange-list/p-shift-exchange-list.service';
import { PSidebarService } from '@plano/client/shared/p-sidebar/p-sidebar.service';
import { SchedulingApiService } from '@plano/shared/api';
import { TimeStampApiService } from '@plano/shared/api';
import { AccountApiService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { PCookieService } from '../../../shared/core/p-cookie.service';
import { BirthdayService } from '../../scheduling/shared/api/birthday.service';

/**
 * By having a special logout component we ensure correct code execution order:
 * 1. redirect to path logout path
 * 2. old component is destroyed. This can trigger communication with backend
 * 	(this operation still requires user's credentials)
 * 3. The constructor of this component will clear credentials and redirect to another page
 */
@Component({
	selector: 'p-logout',
	templateUrl: './logout.component.html',
})
export class LogoutComponent {
	constructor(
		private accountApi : AccountApiService,
		private schedulingApi : SchedulingApiService,
		private timeStampApi : TimeStampApiService,
		private pSidebarService : PSidebarService,
		private reportService : ReportService,
		private reportUrlParamsService : ReportUrlParamsService,
		private courseService : CourseFilterService,
		private meService : MeService,
		private router : Router,
		private filterService : FilterService,
		private schedulingService : SchedulingService,
		private bookingsService : BookingsService,
		private pShiftExchangeListService : PShiftExchangeListService,
		private pCookieService : PCookieService,
		private birthdayService : BirthdayService,
	) {
		// unload all apis
		this.accountApi.unload();
		this.schedulingApi.unload();
		this.timeStampApi.unload();

		// unload all services
		this.reportService.unload();
		this.reportUrlParamsService.unload();
		this.courseService.unload();
		this.filterService.unload();
		this.pSidebarService.unload();
		this.schedulingService.unload();
		this.bookingsService.unload();
		this.pShiftExchangeListService.unload();
		this.pCookieService.unload();
		this.birthdayService.unload();

		// logout and navigate to public page
		this.meService.logout();
		this.router.navigate([Config.IS_MOBILE ? '/mobile-login' : '/']);
	}
}
