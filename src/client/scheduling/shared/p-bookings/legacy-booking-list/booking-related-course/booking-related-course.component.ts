import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { ApiListWrapper } from '@plano/shared/api';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../../../shared/core/null-type-utils';
import { SchedulingApiBooking } from '../../../api/scheduling-api-booking.service';
import { BookingsService } from '../../bookings.service';

@Component({
	selector: 'p-booking-related-course[bookings]',
	templateUrl: './booking-related-course.component.html',
	styleUrls: ['./booking-related-course.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class BookingRelatedCourseComponent implements PComponentInterface {
	@Input() public bookings ! : ApiListWrapper<SchedulingApiBooking>;
	@Output() public onClick : EventEmitter<Event> = new EventEmitter<Event>();
	@Input() public isCollapsed : boolean = false;

	@Input() public isLoading : PComponentInterface['isLoading'] = false;

	constructor(
		public bookingsService : BookingsService,
	) {}

	public PlanoFaIconPool = PlanoFaIconPool;
	public BootstrapSize = BootstrapSize;

	/**
	 * Is there a (onClick)="…" on this component?
	 */
	public get hasOnClickBinding() : boolean {
		return this.onClick.observers.length > 0;
	}

	private get booking() : SchedulingApiBooking | null {
		return this.bookings.get(0);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get label() : string {
		if (this.isLoading) return '████ ████';
		assumeNonNull(this.booking);
		return this.booking.model.name;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get date() : number | null {
		if (this.isLoading) return 1;
		assumeNonNull(this.booking);
		return this.booking.firstShiftStart;
	}

	/**
	 * Check if this component is fully loaded.
	 * Can be used to show skeletons/spinners then false.
	 */
	public get isLoaded() : boolean {
		if (this.isLoading) return false;
		return !!this.booking && !!this.booking.firstShiftStart;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get courseCode() : string | null {
		assumeDefinedToGetStrictNullChecksRunning(this.booking, 'this.booking');
		return this.booking.courseSelector?.courseCode ?? null;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get hasClassShiftsRemoved() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.booking, 'this.booking');
		return this.booking.allShiftsRemoved;
	}
}
