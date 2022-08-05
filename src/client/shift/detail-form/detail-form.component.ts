/* eslint-disable @angular-eslint/component-selector */
import { Component, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { Input } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingsService } from '@plano/client/scheduling/shared/p-bookings/bookings.service';
import { BootstrapSize, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PShiftBookingsComponent } from '@plano/client/shared/component/p-shift-and-shiftmodel-form/p-shift-bookings/p-shift-bookings.component';
import { DetailFormComponentInterface } from '@plano/client/shared/detail-form-component.interface';
import { PShiftmodelTariffService } from '@plano/client/shared/p-forms/p-shiftmodel-tariff.service';
import { PShiftService } from '@plano/client/shared/p-shift-module/p-shift.service';
import { SchedulingApiService, SchedulingApiShiftModels } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiShiftModel} from '@plano/shared/api';
import { SchedulingApiShift } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PRouterService } from '@plano/shared/core/router.service';
import { assumeNonNull } from '../../../shared/core/null-type-utils';
import { PBookingFormService } from '../../booking/booking-form.service';
import { FormattedDateTimePipe } from '../../shared/formatted-date-time.pipe';
import { ShiftModalSizes } from '../shift-modal-sizes';

@Component({
	selector: 'detail-form[item][writableShiftModelsForMember]',
	templateUrl: './detail-form.component.html',
	styleUrls: ['./detail-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class DetailFormComponent implements PComponentInterface, AfterContentInit, DetailFormComponentInterface<SchedulingApiShift<'validated' | 'draft'>> {
	@Input() public isLoading : PComponentInterface['isLoading'] = false;
	@Input() public item : SchedulingApiShift<'draft' | 'validated'> | null = null;
	@Input() public writableShiftModelsForMember ! : SchedulingApiShiftModels;
	@Output() public onAddItem : EventEmitter<SchedulingApiShift> = new EventEmitter<SchedulingApiShift>();

	constructor(
		private activatedRoute : ActivatedRoute,
		public api : SchedulingApiService,
		private pRouterService : PRouterService,
		private modalService : ModalService,
		public rightsService : RightsService,
		private pShiftService : PShiftService,
		public formattedDateTimePipe : FormattedDateTimePipe,
		private localize : LocalizePipe,
		private bookingsService : BookingsService,
		private console : LogService,
		private pShiftModelTariffService : PShiftmodelTariffService,
		private pBookingFormService : PBookingFormService,
	) {
	}

	public PThemeEnum = PThemeEnum;
	public BootstrapSize = BootstrapSize;

	public readonly CONFIG : typeof Config = Config;
	public formGroup : DetailFormComponentInterface['formGroup'] = null;

	public routeShiftModelId : Id | null = null;

	/**
	 * Check if url has shiftModelId
	 */
	public getRouteShiftModelId() : void {
		const idAsString = this.activatedRoute.snapshot.paramMap.get('shiftmodelid');
		this.routeShiftModelId = idAsString === null ? null : Id.create(+idAsString);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public headlineDate() : string | null {
		assumeNonNull(this.item);
		return this.formattedDateTimePipe.getFormattedDateInfo(this.item.start, this.item.end, true).full;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get headlineTime() : string | null {
		assumeNonNull(this.item);
		const end = Config.IS_MOBILE ? this.item.end : undefined;
		return this.formattedDateTimePipe.getFormattedTimeInfo(this.item.start, end, Config.IS_MOBILE).full;
	}

	public ngAfterContentInit() : void {
		this.initComponent();
	}

	/**
	 * Load and set everything that is necessary for this component
	 */
	public initComponent() : void {
	}

	/**
	 * Initialize the formGroup for this component
	 */
	public initFormGroup() : void {
		if (this.formGroup) { this.formGroup = null; }

	}

	/**
	 * Remove Item of this Detail page
	 */
	public removeItem(deleteWarning : TemplateRef<unknown>) : void {
		this.modalService.openModal(deleteWarning, {
			size: ShiftModalSizes.WITH_TRANSMISSION_PREVIEW,
			success: () : void => {
				this.formGroup = null;
				assumeNonNull(this.item);
				this.api.data.shifts.removeItem(this.item);

				this.api.save({
					success : () : void => {
						this.pRouterService.navBack();
					},
				});
			},
		});
	}

	/**
	 * Save this item
	 */
	public saveItem() : void {
		assumeNonNull(this.item);
		if (!this.item.isNewItem()) return;
		this.onAddItem.emit(this.item);
		this.pRouterService.navBack();
	}

	/** navBack */
	public navBack() : void {
		this.pRouterService.navBack();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get hasBookingsForList() : boolean {
		const component = new PShiftBookingsComponent(
			this.api,
			this.pShiftService,
			this.bookingsService,
			this.console,
			this.pShiftModelTariffService,
			this.pBookingFormService,
		);
		assumeNonNull(this.item);
		component.shift = this.item;
		return component.hasBookingsForList;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get courseCode() : string | undefined {
		assumeNonNull(this.item);
		if (!this.item.id.courseCode) return undefined;
		if (!this.item.model.isCourse) return undefined;
		return this.item.id.courseCode;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isCourse() : boolean {
		assumeNonNull(this.item);
		return this.item.model.isCourse;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftName() : string {

		if (this.item?.name) {
			if (!this.item.rawData) throw new Error('Can not get shift name. Shift is lost [PLANO-FE-2TT]');
			return this.item.name;
		}
		return this.localize.transform('Neue Schicht');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftColor() : string | null {

		if (!this.item) return null;
		if (!this.item.model.rawData) throw new Error('[PLANO-FE-JV]');
		if (!this.item.model.color) return null;
		return `#${this.item.model.color}`;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftModel() : SchedulingApiShiftModel | undefined {

		if (!this.item) return undefined;
		return this.item.model;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftStart() : number | undefined {

		if (!this.item) return undefined;
		if (!this.item.rawData) return undefined;
		if (!this.item.start) return undefined;
		return this.item.start;
	}
}
