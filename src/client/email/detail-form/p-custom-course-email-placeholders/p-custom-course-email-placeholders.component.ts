import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { EventTypesService } from '@plano/client/plugin/p-custom-course-emails/event-types.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { SchedulingApiCustomBookableMail} from '@plano/shared/api';
import { SchedulingApiCustomBookableMailEventType } from '@plano/shared/api';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';

@Component({
	selector: 'p-custom-course-email-placeholders',
	templateUrl: './p-custom-course-email-placeholders.component.html',
	styleUrls: ['./p-custom-course-email-placeholders.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PCustomCourseEmailPlaceholdersComponent {
	@Input() public email : SchedulingApiCustomBookableMail | null = null;
	public readonly EVENT_TYPES = SchedulingApiCustomBookableMailEventType;

	constructor(
		public eventTypes : EventTypesService,

		private activeModal : NgbActiveModal,
	) {
	}


	public PThemeEnum = PThemeEnum;
	public PlanoFaIconPool = PlanoFaIconPool;
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get hasPaymentRelatedEvents() : boolean {
		if (!this.email) return false;

		if (this.email.eventType === SchedulingApiCustomBookableMailEventType.INQUIRY_ARRIVAL_NOTICE) return true;
		if (this.email.eventType === SchedulingApiCustomBookableMailEventType.BOOKED) return true;
		if (this.email.eventType === SchedulingApiCustomBookableMailEventType.PAYMENT_PARTIAL) return true;
		if (this.email.eventType === SchedulingApiCustomBookableMailEventType.REFUNDED) return true;
		if (this.email.eventType === SchedulingApiCustomBookableMailEventType.AMOUNT_TO_PAY_CHANGED) return true;
		if (this.email.eventType === SchedulingApiCustomBookableMailEventType.COURSE_REMINDER) return true;
		if (this.email.eventType === SchedulingApiCustomBookableMailEventType.PARTICIPATED) return true;
		if (this.email.eventType === SchedulingApiCustomBookableMailEventType.PAYMENT_METHOD_CHANGED) return true;
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get hasPaymentStatusEvents() : boolean {
		if (!this.email) return false;

		if (this.email.eventType === SchedulingApiCustomBookableMailEventType.PAYMENT_PARTIAL) return true;
		if (this.email.eventType === SchedulingApiCustomBookableMailEventType.PAYMENT_COMPLETE) return true;
		return false;
	}

	/**
	 * Close modal
	 */
	public close() : void {
		this.activeModal.close();
	}

	/**
	 * Dismiss modal
	 */
	// TODO: Obsolete?
	public dismiss() : void {
		this.activeModal.dismiss();
	}

}
