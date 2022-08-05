import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { SLIDE_ON_NGIF_TRIGGER } from '@plano/animations';
import { SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefs, SchedulingApiShiftExchangeShiftRefs } from '@plano/shared/api';
import { SchedulingApiShiftExchangeCommunicationSwapOfferShiftRef} from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiWarnings } from '@plano/shared/api';
import { SchedulingApiShiftExchangeCommunicationSwapOffer } from '@plano/shared/api';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { PossibleShiftPickerValueItemType } from '../p-shift-picker/p-shift-picker.component';

@Component({
	selector: 'p-picked-offer',
	templateUrl: './picked-offer.component.html',
	styleUrls: ['./picked-offer.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	animations: [SLIDE_ON_NGIF_TRIGGER],
})
export class PickedOfferComponent {
	@Input() public readMode : boolean = false;
	@Input() public offer : PossibleShiftPickerValueItemType | null = null;

	@Input() public addToOfferBtnDisabled : boolean = false;
	@Input() public selectedOffer : boolean = false;
	@Input() public affectedOffer : boolean = false;

	@Output() public addToOffer : EventEmitter<SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefs | SchedulingApiShiftExchangeShiftRefs> =
		new EventEmitter<SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefs | SchedulingApiShiftExchangeShiftRefs>();

	@Output() public onRemoveOffer =
		new EventEmitter<PossibleShiftPickerValueItemType>();

	@Output() public onRemoveFromOffer : EventEmitter<SchedulingApiShiftExchangeCommunicationSwapOfferShiftRef> =
		new EventEmitter<SchedulingApiShiftExchangeCommunicationSwapOfferShiftRef>();

	constructor( public api : SchedulingApiService ) {
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get warnings() : SchedulingApiWarnings {
		const emptyList = new SchedulingApiWarnings(null, false);
		if (!this.api.isLoaded()) return emptyList;
		if (!(this.offer instanceof SchedulingApiShiftExchangeCommunicationSwapOffer)) return emptyList;
		assumeDefinedToGetStrictNullChecksRunning(this.api.data.warnings, 'api.data.warnings');
		return this.api.data.warnings.getByOffer(this.offer);
	}
}
