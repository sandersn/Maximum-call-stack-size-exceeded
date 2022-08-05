import { PopoverDirective } from 'ngx-bootstrap/popover';
import { OnDestroy} from '@angular/core';
import { Component, ChangeDetectionStrategy, Input, HostBinding, HostListener, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { SchedulingApiBooking } from '@plano/client/scheduling/shared/api/scheduling-api-booking.service';
import { PTextColor } from '@plano/client/shared/bootstrap-styles.enum';
import { SchedulingApiBookingState } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPoolValues } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PDictionarySourceString } from '../../../../../../shared/core/pipe/localize.dictionary';
import { getPaymentStatusIcon, getPaymentStatusIconStyle, getPaymentStatusTooltipBgClass, paymentStatusTitle, PPaymentStatusEnum } from '../../../api/scheduling-api.utils';

@Component({
	selector: 'p-dumb-booking-item',
	templateUrl: './dumb-booking-item.component.html',
	styleUrls: ['./dumb-booking-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DumbBookingItemComponent implements PComponentInterface, OnDestroy {
	@HostBinding('id') private get hasId() : string {
		return `scroll-target-id-${this.id?.toString()}`;
	}

	@Input() public isLoading : PComponentInterface['isLoading'] = false;

	@Input() public hasDropdown : boolean | null = null;
	@Input() public dropdownMenuAlignment : 'right' | 'left' | 'fullWidth' = 'fullWidth';

	@Input() public model : SchedulingApiBooking['model'] | null = null;
	@Input() public state : SchedulingApiBooking['state'] | null = null;
	@Input() public paymentStatus : SchedulingApiBooking['paymentStatus'] | null = null;
	@Input('bookingNumber') private _bookingNumber : SchedulingApiBooking['bookingNumber'] | null = null;
	@Input() public dateOfBooking : SchedulingApiBooking['dateOfBooking'] | null = null;
	@Input() public noRelatedShiftsAvailable : boolean | null = null;

	/**
	 * If this component is shown inside a 'table' thing, then there need to be min-widths for each column.
	 */
	@Input('careAboutAlignment') public isInsideList : boolean = false;

	/**
	 * Set this to true if user has the rights to edit this booking
	 */
	@Input() public userCanWrite : boolean = false;

	@Input() public id ?: SchedulingApiBooking['id'];
	@Input() public firstName : SchedulingApiBooking['firstName'] | null = null;
	@Input() public lastName : SchedulingApiBooking['lastName'] | null = null;
	@Input() public ownerComment : SchedulingApiBooking['ownerComment'] | null = null;
	@Input() public bookingComment : SchedulingApiBooking['bookingComment'] | null = null;
	@Input() public participantCount : SchedulingApiBooking['participantCount'] | null = null;
	@Input() public price : SchedulingApiBooking['price'] | null = null;
	@Input() public firstShiftStart : SchedulingApiBooking['firstShiftStart'] | null = null;

	/**
	 * User has clicked a "edit this booking" button.
	 */
	@Output() public onEdit : EventEmitter<undefined> = new EventEmitter<undefined>();

	/**
	 * Has this course a courseSelector? E.g. false if its an unfulfilled inquiry.
	 */
	@Input() public showEditCourseBtn : boolean = false;

	/**
	 * User has clicked a "edit this course" button.
	 */
	@Output() public onEditCourse : EventEmitter<undefined> = new EventEmitter<undefined>();

	@Input() public relatedShiftsSelected : boolean = false;

	/**
	 * User has clicked a "edit this booking" button.
	 */
	@Output() public onSelectShifts : EventEmitter<undefined> = new EventEmitter<undefined>();

	@Input() public selectShiftIsDisabled : boolean = false;

	/**
	 * Should firstShiftStart be visible?
	 * @example Usually [showFirstShiftStart]="!groupByCourses" should be bound here.
	 */
	@Input() public showFirstShiftStart : boolean = true;

	@HostBinding('class.position-relative') private _alwaysTrue = true;

	@HostListener('mouseleave') private _onMouseLeave() : void {
		this.timeout = window.setTimeout(() => {
			// Does 'this' dropdown still exist?
			if (!(this as unknown)) return;
			this.dropdownMenuIsUncollapsed = false;
			if ((this.changeDetectorRef as unknown)) this.changeDetectorRef.detectChanges();
		}, 500);
	}

	@HostListener('mouseenter') private _onMouseEnter() : void {
		window.clearTimeout(this.timeout ?? undefined);
	}

	public dropdownMenuIsUncollapsed : boolean = false;

	constructor(
		private localize : LocalizePipe,
		private changeDetectorRef : ChangeDetectorRef,
		private console : LogService,
	) {}

	public PlanoFaIconPool = PlanoFaIconPool;
	public Config = Config;

	private timeout : number | null = null;

	/**
	 * Get the bookingNumber or some placeholder chars
	 */
	public get bookingNumber() : number | string {
		if (this.isLoading) return '███ █████';
		if (this._bookingNumber === null) throw new Error(`[state]="…" must be defined`);
		return this._bookingNumber;
	}

	/**
	 * Get the color
	 */
	public get modelColor() : string | null {
		if (!this.model!.color) return null;
		return `#${this.model!.color}`;
	}

	/**
	 * Name of the related shiftModel
	 */
	public get modelName() : string {
		return this.model!.name;
	}

	/**
	 * getter for the Status-Icon of this booking
	 */
	public get statusIcon() : PlanoFaIconPoolValues | null {
		if (this.isLoading) return null;
		switch (this.state) {
			case null :
			case undefined :
				throw new Error(`[state]="…" must be defined`);
			case SchedulingApiBookingState.BOOKED:
				return PlanoFaIconPool.BOOKING_BOOKED;
			case SchedulingApiBookingState.CANCELED:
				return PlanoFaIconPool.BOOKING_CANCELED;
			case SchedulingApiBookingState.INQUIRY:
				return PlanoFaIconPool.BOOKING_INQUIRY;
			case SchedulingApiBookingState.INQUIRY_DECLINED:
				return PlanoFaIconPool.BOOKING_DECLINED;
			default:
				const NEVER : never = this.state;
				throw new Error(`could not get state ${NEVER}`);
		}
	}

	/**
	 * getter for the Status-Icon of this booking
	 */
	public get statusLabel() : PopoverDirective['popover'] {
		switch (this.state) {
			case SchedulingApiBookingState.BOOKED:
				return this.localize.transform('Gebucht');
			case SchedulingApiBookingState.CANCELED:
				return this.localize.transform('Storniert');
			case SchedulingApiBookingState.INQUIRY:
				return this.localize.transform('Anfrage');
			case SchedulingApiBookingState.INQUIRY_DECLINED:
				return this.localize.transform('Anfrage abgelehnt');
			case null:
				return undefined;
		}
	}

	/**
	 * getter for the title of the status of payment
	 */
	public get paymentStatusTitle() : PDictionarySourceString {
		if (this.isLoading) return 'Lädt…';
		return paymentStatusTitle(this.paymentStatus!);
	}

	/**
	 * Get a icon for paymentStatus
	 */
	public get paymentStatusIcon() : PlanoFaIconPoolValues {
		return getPaymentStatusIcon(this.paymentStatus);
	}

	/**
	 * Get a theme / color for paymentStatus icon
	 */
	public get paymentStatusIconStyle() : PTextColor | null {
		return getPaymentStatusIconStyle(this.paymentStatus);
	}

	/**
	 * Get a class for color for background inside the paymentstatus tooltip
	 */
	public get paymentStatusTooltipBgClass() : 'bg-light' | 'bg-success' | 'bg-danger' | 'bg-warning' | '' {
		return getPaymentStatusTooltipBgClass(this.paymentStatus!);
	}

	/**
	 * Get a class for color for text inside the paymentstatus tooltip
	 */
	public get paymentStatusTooltipTextClass() : 'text-white' | '' {
		switch (this.paymentStatus) {
			case PPaymentStatusEnum.UNPAID :
			case PPaymentStatusEnum.CASHBACK :
				return 'text-white';
			default :
				return '';
		}
	}

	public ngOnDestroy() : void {
		window.clearTimeout(this.timeout ?? undefined);
	}

	/**
	 * Check if buttons should be shown
	 */
	public hasControls() : boolean {
		if (this.hasDropdown) return true;
		return !!this.onSelectShifts.observers.length || !!this.onEdit.observers.length;
	}
}
