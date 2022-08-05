
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormArray } from '@angular/forms';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiShiftExchangeCommunicationSwapOffer, SchedulingApiShiftExchangeSwappedShiftRef, SchedulingApiShiftExchangeShiftRef } from '@plano/shared/api';
import { ShiftId } from '@plano/shared/api';
import { SchedulingApiShiftExchangeShiftRefs, SchedulingApiShiftExchangeCommunicationSwapOffers } from '@plano/shared/api';
import { SchedulingApiShiftExchangeSwappedShiftRefs } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { Assertions } from '@plano/shared/core/assertions';
import { PUrlParamsServiceInterface } from '@plano/shared/core/p-service.interface';
import { PossibleShiftPickerValueItemType } from './p-shift-picker/p-shift-picker.component';
import { PossibleShiftPickerValueType } from './shift-picker-picked-offers/shift-picker-picked-offers.component';

@Injectable()
export class PShiftPickerService implements PUrlParamsServiceInterface {
	private _date ! : number;
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get date() : number { return this._date; }
	public set date(input : number) {
		Assertions.ensureIsDayStart(input);
		this._date = input;
	}

	public mode : CalendarModes = CalendarModes.MONTH;

	public queryParams : HttpParams | null = null;

	/**
	 * If its a existing shiftExchange, the api calls always send the necessary shifts
	 * If its a new shiftExchange, the api calls must be filled with the ensureShifts param
	 */
	public ensureShifts : (ShiftId | Id)[] = [];

	constructor(
		private pMoment : PMomentService,
	) {
		this.initValues();
	}

	private get ensureShiftsAsAsString() : string {
		return JSON.stringify(
			this.ensureShifts,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(_key : string, value : any) => {
				return (value instanceof ShiftId ? value.rawData : value);
			},
		);
	}

	/**
	 * update queryParam values based on urlParam, bookingsService etc.
	 */
	public updateQueryParams() : void {

		const start = (+this.pMoment.m(this.date).startOf(this.mode)).toString();
		const end = (+this.pMoment.m(this.date).startOf(this.mode).add(1, this.mode)).toString();

		this.queryParams = new HttpParams()
			.set('data', 'calendar')
			.set('start', start)
			.set('end', end);

		this.updateEnsureShiftsParam();
	}

	private updateEnsureShiftsParam() : void {
		if (!this.ensureShifts.length) return;
		this.queryParams = this.queryParams!
			.set('ensureShifts', this.ensureShiftsAsAsString);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public initValues() : void {
		this._date = +this.pMoment.m().startOf('day');
		if (!this.date) this.date = +this.pMoment.m().startOf('day');
	}

	/** @see PServiceInterface['unload'] */
	public unload() : void {
		this.ensureShifts = [];
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onRemoveOffer(
		// eslint-disable-next-line @typescript-eslint/ban-types
		formArray : UntypedFormArray,
		offersRef : PossibleShiftPickerValueType,
		offer : PossibleShiftPickerValueItemType | SchedulingApiShiftExchangeShiftRefs,
	) : void {
		const itmToSearch = offer instanceof SchedulingApiShiftExchangeShiftRefs ? offer.get(0) : offer;
		const itemToRemove = formArray.controls.find((item) => item.value === itmToSearch);
		if (!itemToRemove) throw new Error('Could not find shiftRef in formArray');
		const itemToRemoveIndex = formArray.controls.indexOf(itemToRemove);
		formArray.removeAt(itemToRemoveIndex);
		// formArray.updateValueAndValidity();

		if (offersRef instanceof SchedulingApiShiftExchangeCommunicationSwapOffers) {
			offersRef.removeItem(itmToSearch as SchedulingApiShiftExchangeCommunicationSwapOffer);
		} else if (offersRef instanceof SchedulingApiShiftExchangeSwappedShiftRefs) {
			offersRef.removeItem(itmToSearch as SchedulingApiShiftExchangeSwappedShiftRef);
		} else {
			offersRef.removeItem(itmToSearch as SchedulingApiShiftExchangeShiftRef);
		}
	}
}
