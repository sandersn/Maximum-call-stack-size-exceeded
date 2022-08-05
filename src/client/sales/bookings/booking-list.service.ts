import { Injectable } from '@angular/core';
import { ApiListWrapper, SchedulingApiBooking, ShiftSelector } from '@plano/shared/api';
import { ShiftId } from '@plano/shared/api/scheduling-api/shift-id/shift-id';
import { PServiceInterface } from '@plano/shared/core/p-service.interface';

@Injectable()
export class BookingListService implements PServiceInterface {
	private uncollapsedCourse : 'inquiry' | ShiftSelector | null = null;

	constructor() {
		this.initValues();
	}

	/**
	 * Set some default values for properties that are not defined yet
	 */
	public initValues() : void {
		// if (this.uncollapsedCourse === undefined) this.uncollapsedCourse = true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get hasUncollapsedCourse() : boolean {
		return this.uncollapsedCourse !== null;
	}

	private getValueForUnCollapsedCourse(booking : SchedulingApiBooking) : 'inquiry' | ShiftSelector {
		return booking.courseSelector ?? 'inquiry';
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public toggleCollapsedState(
		bookings : ApiListWrapper<SchedulingApiBooking>,
		collapse ?: boolean,
	) : void {
		const firstItem = bookings.get(0);
		if (!firstItem) return;
		const id = this.getValueForUnCollapsedCourse(firstItem);
		if (collapse === undefined) collapse = this.uncollapsedCourse !== id;
		if (collapse) {
			this.uncollapsedCourse = id;
		} else {
			this.uncollapsedCourse = null;
		}
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public isCollapsed(bookings : ApiListWrapper<SchedulingApiBooking>) : boolean {
		const firstItem = bookings.get(0);
		if (!firstItem) return true;
		const id = this.getValueForUnCollapsedCourse(firstItem);
		if (this.uncollapsedCourse instanceof ShiftId && id instanceof ShiftId) {
			const isUnCollapsed = this.uncollapsedCourse.equals(id);
			return !isUnCollapsed;
		}
		return this.uncollapsedCourse !== id;
	}


	// eslint-disable-next-line jsdoc/require-jsdoc
	public unload() : void {
		this.uncollapsedCourse = null;
	}
}
