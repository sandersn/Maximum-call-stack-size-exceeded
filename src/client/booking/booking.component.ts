import { OnDestroy, OnInit } from '@angular/core';
import { Component, HostBinding, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { SchedulingApiShiftModels } from '@plano/shared/api';
import { SchedulingApiBookingState, SchedulingApiService, SchedulingApiShift } from '@plano/shared/api';
import { ShiftId } from '@plano/shared/api';
import { SchedulingApiCourseType } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { DetailFormComponent } from './detail-form/detail-form.component';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../shared/core/null-type-utils';
import { PRouterService } from '../../shared/core/router.service';
import { BookingSystemRights } from '../accesscontrol/rights-enums';
import { RightsService } from '../accesscontrol/rights.service';
import { SchedulingService } from '../scheduling/scheduling.service';
import { SchedulingApiBookable } from '../scheduling/shared/api/scheduling-api-bookable.service';
import { SchedulingApiBooking } from '../scheduling/shared/api/scheduling-api-booking.service';
import { PDetailFormUtilsService } from '../shared/detail-form-utils.service';
import { DropdownTypeEnum } from '../shared/p-forms/p-dropdown/p-dropdown.component';
import { PageWithDetailFormComponentInterface } from '../shared/page-with-detail-form-component.interface';
import { SectionWhitespace } from '../shared/page/section/section.component';

export enum BookingTab {
	DETAILS = 'details',
	TRANSACTIONS = 'transactions',
}

@Component({
	selector: 'p-booking',
	templateUrl: './booking.component.html',
	styleUrls: ['./booking.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class BookingComponent implements OnInit, OnDestroy, PageWithDetailFormComponentInterface<SchedulingApiBooking> {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.flex-column') protected _alwaysTrue = true;

	@ViewChild('detailForm', { static: true }) public detailForm ! : DetailFormComponent;

	public CONFIG : typeof Config = Config;
	private _item : SchedulingApiBooking | null = null;

	constructor(
		private activatedRoute : ActivatedRoute,
		public api : SchedulingApiService,
		private rightsService : RightsService,
		private pDetailFormUtilsService : PDetailFormUtilsService,
		private schedulingUrlParams : SchedulingService,
		private localize : LocalizePipe,
		public pRouterService : PRouterService,
	) {
	}

	public SchedulingApiBookingState = SchedulingApiBookingState;
	public DropdownTypeEnum = DropdownTypeEnum;
	public PlanoFaIconPool = PlanoFaIconPool;
	public BootstrapSize = BootstrapSize;
	public PThemeEnum = PThemeEnum;
	public PBtnThemeEnum = PBtnThemeEnum;
	public SectionWhitespace = SectionWhitespace;

	public ngOnInit() : void {
		this.getItem();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get item() : SchedulingApiBooking | null {
		return this._item;
	}
	public set item(input : SchedulingApiBooking | null) {
		this._item = input;
		this.detailForm.item = input;
		this.detailForm.initComponent();
	}

	/**
	 * Get id from route
	 */
	public get routeId() : Id | null {
		const ID_AS_STRING = this.activatedRoute.snapshot.paramMap.get('id');
		if (ID_AS_STRING === '0') return null;
		if (ID_AS_STRING === null) return null;
		return Id.create(+ID_AS_STRING);
	}

	private createNewItemWithSomeDataIfShiftIdProvided(shiftId ?: ShiftId) : SchedulingApiBooking {
		this.api.createDataCopy();
		const item = this.api.data.bookings.createNewItem();
		if (shiftId) {
			item.shiftModelId = shiftId.shiftModelId;
			item.courseSelector = shiftId;
		}
		item.cancellationFee = 0;
		return item;
	}

	/**
	 * Check if url has shiftId
	 */
	public get routeShiftId() : ShiftId | null {
		const idAsString = this.activatedRoute.snapshot.paramMap.get(`shiftId`);
		if (!idAsString) return null;
		if (idAsString === '0') return null;
		return ShiftId.fromUrl(idAsString);
	}

	/**
	 * Create new item by the provided ShiftId
	 */
	private createByRouteShiftId() : boolean {
		// User navigated from e.g. shift-tooltip to this "Create Shift Exchange" form
		if (!this.routeShiftId) return false;

		SchedulingApiShift.loadDetailed(this.api, this.routeShiftId, {
			success: () => {
				if (!this.routeShiftId) throw new Error('routeShiftId should have been defined after loadDetailed()');
				this.item = this.createNewItemWithSomeDataIfShiftIdProvided(this.routeShiftId);
			},
			error: () => {
				throw new Error('Could not load requested shift');
			},
		});

		return true;
	}

	/**
	 * Get the item by the provided id
	 */
	private getByRouteId() : boolean {
		if (!this.routeId) return false;
		let item = this.api.data.bookings.get(this.routeId);
		if (!item) {
			SchedulingApiBooking.loadDetailed(this.api, this.routeId, {
				success: () => {
					if (this.routeId === null) throw new Error('routeId could not be determined');
					item = this.api.data.bookings.get(this.routeId);
					if (item === null) throw new Error(`Could not find item »${this.routeId.toString()}« in ${this.api.data.bookings.length} (T.loadDetailed)`);
					this.item = item;
				},
			});
			return true;
		}
		if (item.isNewItem()) {
			this.item = item;
			return true;
		}

		item.loadDetailed({
			success: () => {
				if (item === null) throw new Error('Item should have been available after item.loadDetailed');
				this.item = item;
			},
		});
		return true;
	}

	/**
	 * Get Item for this detail page
	 * If id is available load the item
	 * Else create a new item by provided shiftmodel
	 */
	public getItem() : void {
		if (this.getByRouteId()) return;
		if (this.createByRouteShiftId()) return;

		// Make sure we have some data as basis for this item
		if (!this.api.isLoaded()) {
			this.schedulingUrlParams.updateQueryParams();
			this.api.load({
				searchParams: this.schedulingUrlParams.queryParams,
				success: () => {
					if (this.getByRouteId()) return;
					if (this.createByRouteShiftId()) return;
					this.createNewItem();
				},
			});
		} else {
			this.createNewItem();
		}
	}

	/**
	 * Create new item which than can be filled with data from the form
	 */
	public createNewItem() : void {
		this.pDetailFormUtilsService.createNewItem(this.api, this.api.data.bookings, this.schedulingUrlParams, item => {
			item.cancellationFee = 0;
			this.item = item;
		});
	}

	public ngOnDestroy() : void {
		this.pDetailFormUtilsService.onDestroy(this.api);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftModelsForDropdown() : SchedulingApiShiftModels {
		return this.api.data.shiftModels.filterBy(
			(item) => {
				// Is it a bookable course?
				if (item.trashed) return false;
				if (!item.isCourse) return false;
				if (item.courseType === SchedulingApiCourseType.NO_BOOKING) return false;

				// Can user create bookings for it?
				return !!this.rightsService.can(BookingSystemRights.createBookings, item);
			},
		);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onSelectShiftModelId(id : Id) : void {
		assumeDefinedToGetStrictNullChecksRunning(id, 'id');
		assumeNonNull(this.item);
		if (this.item.shiftModelId.equals(id)) return;
		this.api.dismissDataCopy();
		// if (this.api.hasDataCopy()) this.api.dismissDataCopy();
		this.item = this.createNewItemWithSomeDataIfShiftIdProvided();
		this.item.shiftModelId = id;
		this.detailForm.item = this.item;
		// eslint-disable-next-line @angular-eslint/no-lifecycle-call
		this.detailForm.ngAfterContentInit();
	}

	/**
	 * Save the provided new item to the database
	 */
	public saveNewItem(item : SchedulingApiBooking) : void {
		this.pDetailFormUtilsService.saveNewItem(this.api, item, this.localize.transform('Buchung'));
	}

	/**
	 * Handle Click on delete button
	 */
	public onRemoveClick() : void {
		throw new Error('Removal of bookings is not allowed.');
	}

	/**
	 * Navigate to related FAQ pages
	 */
	public navToFaq() : void {
		this.pRouterService.navigate(['client/plugin/faq-online-payment']);
	}

	/** @see SchedulingApiBookable['showFaqBtn'] */
	public get showFaqBtn() : boolean {
		if (!this.api.isLoaded()) return false;
		assumeNonNull(this.api.data.rawData, 'this.api.data.rawData', 'PLANO-FE-4MZ');
		return SchedulingApiBookable.showFaqBtn(this.item ?? null, this.api.data.isOnlinePaymentAvailable);
	}
}
