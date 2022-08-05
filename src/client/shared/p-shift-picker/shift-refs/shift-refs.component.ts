import { AfterContentInit } from '@angular/core';
import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefs, ShiftId, SchedulingApiShiftExchangeSwappedShiftRef, SchedulingApiShiftExchangeCommunicationSwapOfferShiftRef } from '@plano/shared/api';
import { SchedulingApiShiftExchangeShiftRefs, SchedulingApiShiftExchangeCommunicationSwapOffer } from '@plano/shared/api';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { LogService } from '../../../../shared/core/log.service';
import { assumeNonNull } from '../../../../shared/core/null-type-utils';
import { BootstrapRounded, BootstrapSize, PThemeEnum } from '../../bootstrap-styles.enum';
import { PossibleShiftPickerValueItemType } from '../p-shift-picker/p-shift-picker.component';

export type PossibleOfferType = (
	SchedulingApiShiftExchangeCommunicationSwapOffer |
	SchedulingApiShiftExchangeSwappedShiftRef |
	SchedulingApiShiftExchangeShiftRefs
);

@Component({
	selector: 'p-shift-refs',
	templateUrl: './shift-refs.component.html',
	styleUrls: ['./shift-refs.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class ShiftRefsComponent implements AfterContentInit {
	@Input() public readMode : boolean = false;
	@Input() public offer : SchedulingApiShiftExchangeCommunicationSwapOffer | PossibleShiftPickerValueItemType | null = null;

	@Output() public onAddToOffer : EventEmitter<SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefs | SchedulingApiShiftExchangeShiftRefs> =
		new EventEmitter<SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefs | SchedulingApiShiftExchangeShiftRefs>();
	@Output() public onRemoveOffer =
		new EventEmitter<PossibleShiftPickerValueItemType>();
	@Output() public onRemoveFromOffer : EventEmitter<SchedulingApiShiftExchangeCommunicationSwapOfferShiftRef> =
		new EventEmitter<SchedulingApiShiftExchangeCommunicationSwapOfferShiftRef>();

	@Input() public selectedOffer : boolean = false;
	@Output() public selectedOfferChange : EventEmitter<SchedulingApiShiftExchangeCommunicationSwapOffer | PossibleShiftPickerValueItemType> =
		new EventEmitter<SchedulingApiShiftExchangeCommunicationSwapOffer | PossibleShiftPickerValueItemType>();
	@Input() public affectedOffer : boolean = false;

	@Input() public selectable : boolean = false;

	@Input() public addToOfferBtnDisabled : boolean = false;

	constructor(
		private localize : LocalizePipe,
		private console : LogService,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public PThemeEnum = PThemeEnum;
	public BootstrapSize = BootstrapSize;
	public BootstrapRounded = BootstrapRounded;

	public ngAfterContentInit() : void {
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftId() : ShiftId | null {
		if (this.isPaket) return null;
		if (this.offer instanceof SchedulingApiShiftExchangeShiftRefs) {
			const OFFER = this.offer.get(0);
			return OFFER !== null ? OFFER.id : null;
		}

		if (this.offer === null) throw new Error('Can not get shiftId when offer is undefined [PLANO-FE-4NX]');

		// NOTE: I had to make p-shifts-info>shiftId happy and remove null from method return type
		this.console.error('Add Id as possible type to PShiftsInfoComponent.shiftId');
		return this.offer.id as ShiftId;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftRefs() :
		| SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefs
		| SchedulingApiShiftExchangeShiftRefs
		| null {

		if (!this.isPaket) return null;
		if (this.offer instanceof SchedulingApiShiftExchangeShiftRefs) return this.offer;
		return (this.offer as SchedulingApiShiftExchangeCommunicationSwapOffer).shiftRefs;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onSelect(offer : SchedulingApiShiftExchangeCommunicationSwapOffer | PossibleShiftPickerValueItemType) : void {
		this.selectedOffer = !this.selectedOffer;
		this.selectedOfferChange.emit(this.selectedOffer ? offer : undefined);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isPaket() : boolean | undefined {
		if (this.offer instanceof SchedulingApiShiftExchangeShiftRefs) return true;
		if (this.offer instanceof SchedulingApiShiftExchangeCommunicationSwapOffer) return true;
		return undefined;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showAddToOfferButton() : boolean {
		if (this.readMode) return false;
		if (!this.isPaket) return false;
		return this.onAddToOffer.observers.length > 0;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showOnRemoveOfferButton() : boolean {
		if (this.readMode) return false;
		if (this.offer instanceof SchedulingApiShiftExchangeShiftRefs) return this.offer.length === 1;
		return this.onRemoveOffer.observers.length > 0;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showOnRemoveFromOfferButton() : boolean {
		if (this.readMode) return false;
		if (!this.isPaket) return false;
		return this.onRemoveFromOffer.observers.length > 0;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showOnSelectButton() : boolean {
		if (this.readMode) return false;
		if (!this.isPaket) return false;
		return this.selectable;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public addToOffer(shiftRefs : SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefs | SchedulingApiShiftExchangeShiftRefs | null) : void {
		assumeNonNull(shiftRefs);
		if (this.addToOfferBtnDisabled) return;
		this.onAddToOffer.emit(shiftRefs);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get addToOfferBtnDisabledLabel() : string | undefined {
		if (!this.addToOfferBtnDisabled) return undefined;
		return this.localize.transform('Wähle weitere Schichten im Kalender, um sie diesem Angebot gebündelt hinzuzufügen.');
	}
}
