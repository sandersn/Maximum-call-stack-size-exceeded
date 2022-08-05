import { Component, HostBinding, Input, ChangeDetectionStrategy } from '@angular/core';
import { CourseFilterService } from '@plano/client/scheduling/course-filter.service';
import { SchedulingFilterService } from '@plano/client/scheduling/scheduling-filter.service';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { PDropdownComponent } from '@plano/client/shared/p-forms/p-dropdown/p-dropdown.component';
import { DropdownTypeEnum } from '@plano/client/shared/p-forms/p-dropdown/p-dropdown.component';
import { RightsService, SchedulingApiService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';

@Component({
	selector: 'p-calendar-filter-settings',
	templateUrl: './calendar-filter-settings.component.html',
	styleUrls: ['./calendar-filter-settings.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class CalendarFilterSettingsComponent {
	public config : typeof Config = Config;

	@HostBinding('class.d-flex')
	@HostBinding('class.align-items-stretch')
	@HostBinding('class.justify-content-between') protected _alwaysTrue = true;

	// FIXME: PLANO-9707 get rid of showShiftsFilterBtn and showShowOnlyMemberBtn in calendar-filter-settings
	@Input() public showShiftsFilterBtn : boolean = false;
	// FIXME: PLANO--9707 get rid of showShiftsFilterBtn and showShowOnlyMemberBtn in calendar-filter-settings
	@Input() public showShowOnlyMemberBtn : boolean = false;

	@Input() public itemsFilterTitle : PDropdownComponent['itemsFilterTitle'] = null;

	constructor(
		public meService : MeService,
		public api : SchedulingApiService,
		public course : CourseFilterService,
		public highlightService : HighlightService,
		public schedulingFilterService : SchedulingFilterService,
		public courseService : CourseFilterService,
		public rightsService : RightsService,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public BootstrapSize = BootstrapSize;
	public DropdownTypeEnum = DropdownTypeEnum;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get hasSchulferienData() : boolean {
		if (!this.api.isLoaded()) return false;
		return !this.api.isSwitzerland;
	}

	private get hasCoursesInCurrentShifts() : boolean {
		return !!this.api.data.shifts.findBy((item) => !!item.isCourse);
	}


	/**
	 * Check if member has read permissions for one or more courses
	 */
	private get memberHasReadPermissionForCourses() : boolean | null {
		if (!this.api.isLoaded()) return null;

		const COURSES = this.api.data.shiftModels.filterBy((item) => item.isCourse);
		if (this.rightsService.userCanReadAny(COURSES)) return true;

		// Show Dropdown if there is at least one course.
		if (this.hasCoursesInCurrentShifts) return true;

		return false;
	}



	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showCourseViewOptionsDropdown() : boolean {
		// On Mobile the bookings area is currently not supported course info is always visible.
		if (Config.IS_MOBILE) return false;

		// We had an edge-case here, where a user has set bookings to visible, and then his/her permission to see bookings
		// got removed. "bookingsVisible" was stored in the cookies. The user then had a visible broken sidebar, and was not
		// able to set it to hidden.
		// The next code line should not be necessary because the bookings sidebar should not be visible as soon as user has
		// no permission. But just to be sure, i always give the ability to set a visible bookings sidebar to hidden.
		if (this.courseService.bookingsVisible) return true;

		// Has User permission to see this data?
		if (this.memberHasReadPermissionForCourses) return true;
		return false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public toggleCourseVisible() : void {
		this.courseService.courseVisible = !this.courseService.courseVisible;
		this.highlightService.setHighlighted(null);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public hideAllHolidaysAndBirthdays() : void {
		const toggledValue = !this.schedulingFilterService.hideAllHolidays;
		this.schedulingFilterService.hideAllHolidays = toggledValue;
		this.schedulingFilterService.hideAllBirthdays = toggledValue;
	}
}
