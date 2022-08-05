import { AfterContentInit} from '@angular/core';
import { Component, ChangeDetectionStrategy, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { SchedulingApiShiftExchangeSwappedShiftRefs, SchedulingApiShiftExchangeCommunicationSwapOfferShiftRef, SchedulingApiShiftExchangeShiftRef, SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefs } from '@plano/shared/api';
import { SchedulingApiShiftExchangeCommunicationSwapOffer } from '@plano/shared/api';
import { SchedulingApiShifts } from '@plano/shared/api';
import { SchedulingApiShiftExchangeCommunicationSwapOffers, SchedulingApiShiftExchangeShiftRefs } from '@plano/shared/api';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { PShiftExchangeService } from '../../p-shift-exchange/shift-exchange.service';
import { ErrorArray } from '../../p-shift-module/shift-member-exchange.service';
import { PossibleShiftPickerValueItemType } from '../p-shift-picker/p-shift-picker.component';

export type PossibleShiftPickerValueType = (
	SchedulingApiShiftExchangeCommunicationSwapOffers |
	SchedulingApiShiftExchangeShiftRefs |
	SchedulingApiShiftExchangeSwappedShiftRefs
	// | ShiftId
);

@Component({
	selector: 'p-shift-picker-picked-offers[shiftsToBeAdded]',
	templateUrl: './shift-picker-picked-offers.component.html',
	styleUrls: ['./shift-picker-picked-offers.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PShiftPickerPickedOffersComponent implements AfterContentInit {
	@Input() public hideAddToOffersBtn : boolean = false;
	@Input() public offerTemplate : TemplateRef<unknown> | null = null;
	@Input() public showBoundShiftOfferSetBtn : boolean = false;
	@Input() public alerts : ErrorArray | null = null;
	// TODO: Get rid of `| any`
	/* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents */
	@Input() public offers : SchedulingApiShiftExchangeCommunicationSwapOffers | SchedulingApiShiftExchangeShiftRefs | any;
	@Input() public shiftsToBeAdded ! : SchedulingApiShifts;
	@Output() public addToOffer : EventEmitter<SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefs | SchedulingApiShiftExchangeShiftRefs> =
		new EventEmitter<(
		SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefs | SchedulingApiShiftExchangeShiftRefs
	)>();
	@Output() public addToOffers : EventEmitter<undefined> =
		new EventEmitter<undefined>();
	@Output() public addSelectedShiftsAsPacket : EventEmitter<undefined> =
		new EventEmitter<undefined>();
	@Output() public onRemoveOffer =
		new EventEmitter<PossibleShiftPickerValueItemType>();
	@Output() public onRemoveShiftRefFromOffer : EventEmitter<{
		shiftRef : SchedulingApiShiftExchangeCommunicationSwapOfferShiftRef | SchedulingApiShiftExchangeShiftRef,
		offer : SchedulingApiShiftExchangeCommunicationSwapOffer,
	}> =
			new EventEmitter<{
		shiftRef : SchedulingApiShiftExchangeCommunicationSwapOfferShiftRef | SchedulingApiShiftExchangeShiftRef,
		offer : SchedulingApiShiftExchangeCommunicationSwapOffer,
	}>();

	@Input() public addToOffersBtnLabel : string | null = null;

	constructor(
		private pShiftExchangeService : PShiftExchangeService,
		private localize : LocalizePipe,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public offerSelected(
		// TODO: Get rid of `| any`
		/* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents */
		offer : PossibleShiftPickerValueType | any,
	) : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.shiftsToBeAdded, 'shiftsToBeAdded');
		return this.pShiftExchangeService.offerSelected(offer, this.shiftsToBeAdded);
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public offerAffected(
		// TODO: Get rid of `| any`
		/* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents */
		offer : PossibleShiftPickerValueType | any,
	) : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.shiftsToBeAdded, 'shiftsToBeAdded');
		return this.pShiftExchangeService.offerAffected(offer, this.shiftsToBeAdded);
	}

	public ngAfterContentInit() : void {
		this.initValues();
	}

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	private initValues() : void {
		if (this.addToOffersBtnLabel === null) {
			this.addToOffersBtnLabel = this.localize.transform('Der Auswahl hinzufügen');
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public addToOfferBtnDisabled(offer : PossibleShiftPickerValueItemType) : boolean | undefined {
		if (offer instanceof SchedulingApiShiftExchangeShiftRefs) {
			if (!this.shiftsToBeAdded.length) return true;
			return false;
		}
		if (!(offer instanceof SchedulingApiShiftExchangeCommunicationSwapOffer)) return undefined;
		if (!this.shiftsToBeAdded.length) return true;
		const shiftsCanBeAddedCounter = this.shiftsToBeAdded.filterBy((item) => {

			/** Shifts can be added if they are not already contained */
			return !offer.shiftRefs.contains(item.id);
		}).length;
		if (!shiftsCanBeAddedCounter) return true;
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public removeFromOffer(
		shiftRef : SchedulingApiShiftExchangeCommunicationSwapOfferShiftRef | SchedulingApiShiftExchangeShiftRef,
		// TODO: Get rid of `| any`
		/* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents */
		offer : SchedulingApiShiftExchangeCommunicationSwapOffer | any,
	) : void {
		this.onRemoveShiftRefFromOffer.emit({
			shiftRef: shiftRef,
			offer: offer,
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isShiftExchangeShiftRefs() : boolean {
		return !!this.offers && this.offers instanceof SchedulingApiShiftExchangeShiftRefs;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftRefs() : SchedulingApiShiftExchangeShiftRefs | undefined {
		if (!this.offers) return undefined;
		if (!(this.offers instanceof SchedulingApiShiftExchangeShiftRefs)) return undefined;
		return this.offers;
	}


	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get boundShiftOfferSetBtnDisabled() : boolean {
		return this.shiftsToBeAdded.length <= 1;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get addToOffersBtnDisabled() : boolean {
		return !this.shiftsToBeAdded.length;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get addToOffersBtnPopover() : string | undefined {
		if (!this.addToOffersBtnDisabled) return undefined;
		return this.localize.transform('Wähle im Kalender mindestens 1 Schicht, die du hinzufügen möchtest.');
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get boundShiftOfferSetBtnPopover() : string | undefined {
		if (!this.boundShiftOfferSetBtnDisabled) return undefined;
		return this.localize.transform('Fügst du 2 oder mehr Schichten gebündelt hinzu, müssen sie komplett von einer Person übernommen werden.');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftExchangeShiftRefs() : SchedulingApiShiftExchangeShiftRefs | undefined {
		if (this.offers instanceof SchedulingApiShiftExchangeCommunicationSwapOffers) return undefined;
		return this.offers;
	}

}
