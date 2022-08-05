import { AfterContentChecked } from '@angular/core';
import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingApiShiftModel, SchedulingApiShift} from '@plano/shared/api';
import { ShiftId } from '@plano/shared/api';
import { ApiListWrapper } from '@plano/shared/api';
import { SchedulingApiShiftExchangeCommunicationSwapOfferShiftRef, SchedulingApiShiftExchangeSwappedShiftRef} from '@plano/shared/api';
import { SchedulingApiShiftExchangeShiftRefs, SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefs } from '@plano/shared/api';
import { SchedulingApiService, SchedulingApiShiftModels } from '@plano/shared/api';
import { SchedulingApiShiftExchangeSwappedShiftRefs, SchedulingApiShiftPacketShifts, SchedulingApiShiftExchangeShiftRef, SchedulingApiShiftPacketShift } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../shared/core/null-type-utils';
import { PBasicInfoComponent } from '../../component/basic-shift-info/basic-info.component';
import { PMomentService } from '../../p-moment.service';

type PossibleShiftRefsTypes =
	SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefs |
	SchedulingApiShiftExchangeShiftRefs |
	SchedulingApiShiftExchangeSwappedShiftRefs |
	SchedulingApiShiftPacketShifts;
type PossibleShiftRefTypes =
	SchedulingApiShiftExchangeCommunicationSwapOfferShiftRef |
	SchedulingApiShiftExchangeShiftRef |
	SchedulingApiShiftExchangeSwappedShiftRef |
	SchedulingApiShiftPacketShift;

@Component({
	selector: 'p-shift-info-content-left',
	template: '<ng-content></ng-content>',
	styleUrls: ['./p-shifts-info-content.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PShiftInfoContentLeftComponent {}

@Component({
	selector: 'p-shift-info-content-right',
	template: '<ng-content></ng-content>',
	styleUrls: ['./p-shifts-info-content.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PShiftInfoContentRightComponent {}

@Component({
	selector: 'p-shift-info-content-inside-basic-info',
	template: '<ng-content></ng-content>',
	styleUrls: ['./p-shifts-info-content.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PShiftInfoContentInsideBasicInfoComponent {}

@Component({
	selector: 'p-shifts-info',
	templateUrl: './p-shifts-info.component.html',
	styleUrls: ['./p-shifts-info.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PShiftsInfoComponent implements AfterContentChecked {
	@HostBinding('class.d-flex')
	@HostBinding('class.flex-row')
	@HostBinding('class.position-relative') protected _alwaysTrue = true;

	@Input() public showDate : PBasicInfoComponent['showDate'] = true;
	@Input() public showEndTime : PBasicInfoComponent['showEndTime'] = true;
	@Input() public showTime : PBasicInfoComponent['showTime'] = true;
	@Input() public oneLine : PBasicInfoComponent['oneLine'] = false;

	/**
	 * The refs for shifts that should be visualized
	 * NOTE: You can use shiftRefs or shiftId - it will always look awesome ツ
	 */
	@Input() private shiftRefs : PossibleShiftRefsTypes | null = null;

	/**
	 * The Shift-Id that should be visualized
	 * NOTE: You can use shiftRefs or shiftId - it will always look awesome ツ
	 */
	@Input() private shiftId : ShiftId | null = null;

	private now ! : number;

	constructor(
		private api : SchedulingApiService,
		private localize : LocalizePipe,
		private datePipe : PDatePipe,
		private pMoment : PMomentService,
	) {
	}

	private get shiftRefsSortedByStart() : ApiListWrapper<PossibleShiftRefTypes> | null {
		if (!this.shiftRefs) return this.shiftRefs;
		if (
			this.shiftRefs instanceof SchedulingApiShiftExchangeShiftRefs ||
			this.shiftRefs instanceof SchedulingApiShiftPacketShifts ||
			this.shiftRefs instanceof SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefs ||
			this.shiftRefs instanceof SchedulingApiShiftExchangeSwappedShiftRefs
		) {
			return this.shiftRefs.sortedBy((
				item : (
					SchedulingApiShiftExchangeShiftRef |
					SchedulingApiShiftPacketShift |
					SchedulingApiShiftExchangeCommunicationSwapOfferShiftRef |
					SchedulingApiShiftExchangeSwappedShiftRef
				),
			) => {
				if (item instanceof SchedulingApiShiftExchangeShiftRef) return item.start;
				const shift = this.api.data.shifts.get(item.id);
				return shift ? shift.start : undefined;
			}, false);
		}
		// return this.shiftRefs.sortedBy((item) => {
		// 	const shift = this.api.data.shifts.get(item.id);
		// 	return shift ? shift.start : undefined;
		// }, false);
		throw new Error('unknown type of shiftRefs');
	}

	public ngAfterContentChecked() : void {
		this.now = +this.pMoment.m();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showContent() : boolean {
		if (this.shiftRefs !== null) return true;
		if (this.shiftId !== null) return true;
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftModel() : SchedulingApiShiftModel | null {
		if (!this.api.isLoaded()) return null;

		let shiftModelId : Id | null = null;
		if (!!this.shiftId) shiftModelId = this.shiftId.shiftModelId;
		if (this.shiftRefs && this.shiftRefs.length === 1) shiftModelId = this.firstShiftId.shiftModelId;
		if (!shiftModelId) return null;
		return this.api.data.shiftModels.get(shiftModelId);
	}

	/**
	 * List of all ShiftModels that are related to the shiftRefs
	 */
	public get shiftModels() : SchedulingApiShiftModels | undefined {
		if (!this.shiftRefs) return undefined;
		if (!this.shiftRefs.length) return undefined;
		if (!this.api.isLoaded()) return undefined;
		const shiftModels = new SchedulingApiShiftModels(null, false);
		for (const shiftRef of this.shiftRefs.iterable()) {
			const shiftModel = this.api.data.shiftModels.get(shiftRef.id.shiftModelId);
			assumeNonNull(shiftModel);
			shiftModels.push(shiftModel);
		}
		return shiftModels;
	}

	/**
	 * List of all ShiftModels that are related to the shiftRefs
	 */
	private get uniqueShiftModelsCount() : number {
		let result = 0;
		const shiftModelIds : Id[] = [];

		const shiftModelIdsContains = (id : Id) : boolean => {
			for (const shiftModelId of shiftModelIds) {
				if (!shiftModelId.equals(id)) continue;
				return true;
			}
			return false;
		};

		assumeNonNull(this.shiftRefs);
		for (const shiftRef of this.shiftRefs.iterable()) {
			if (shiftModelIdsContains(shiftRef.id.shiftModelId)) continue;
			++result;
			shiftModelIds.push(shiftRef.id.shiftModelId);
		}

		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftTitle() : string | null {
		if (this.shiftModel) return this.shiftModel.name;
		if (!this.shiftModels) return null;

		let result : string = '';
		assumeNonNull(this.shiftRefs);
		if (this.shiftRefs.length === 1) {
			result += this.localize.transform('Eine Schicht');
		} else {
			result += this.localize.transform('${counter} Schichten', {
				counter: this.shiftRefs.length.toString(),
			});
		}

		if (this.uniqueShiftModelsCount === 1) {
			// Some members get shift-exchanges with shifts of shiftModels with no read access
			if (!this.shiftModels.get(0)) return result;
			result += ' ';
			result += this.localize.transform('aus ${shiftModelName}', {
				shiftModelName: this.shiftModels.get(0)!.name,
			});
		} else {
			result += ' ';
			result += this.localize.transform('aus ${counter} Tätigkeiten', {
				counter: this.uniqueShiftModelsCount.toString(),
			});
		}
		return result;
	}

	/**
	 * Find a item which has .start and .end properties no matter if shiftId or what type of shiftRefs is provided.
	 */
	private getItemWthStartAndEnd(
		indexOfWantedItemInList : number,
		success : (input : { start : number | null, end : number | null }) => number,
	) : number | undefined {
		if (!!this.shiftId) return this.firstShift ? success(this.firstShift) : undefined;
		if (!this.shiftRefs) return undefined;
		if (!this.shiftRefs.length) return undefined;

		assumeNonNull(this.shiftRefsSortedByStart);
		const shiftRef = this.shiftRefsSortedByStart.get(indexOfWantedItemInList);
		if (
			shiftRef instanceof SchedulingApiShiftPacketShift ||
			// FIXME: PLANO-16351 - replace '!!shiftRef.start && !!shiftRef.end' with '!shiftRef.isNewItem()'
			shiftRef instanceof SchedulingApiShiftExchangeShiftRef && !!shiftRef.start && !!shiftRef.end
		) {
			return success(shiftRef);
		}

		// Get the related shift to get the correct start and end. The shift.start and shift.end includes the correct time.
		// Other timestamps from .start and .end properties only includes the date, not the exact time.
		assumeNonNull(shiftRef);
		const shift = this.api.data.shifts.get(shiftRef.id);
		if (!shift) return success(shiftRef.id);
		return success(shift);
	}

	private get firstShiftId() : ShiftId {
		if (!!this.shiftId) return this.shiftId;
		assumeNonNull(this.shiftRefs);
		const ref = this.shiftRefs.get(0);
		assumeNonNull(ref);
		return ref.id;
	}

	private get firstShift() : SchedulingApiShift | null {
		if (!this.api.isLoaded()) return null;
		return this.api.data.shifts.get(this.firstShiftId);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get dateTimeHasDanger() : boolean {
		if (this.lastShiftEnd === null) return true;
		return this.now >= this.lastShiftEnd;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get firstShiftStart() : number | null {
		return this.getItemWthStartAndEnd(0, item => {
			assumeDefinedToGetStrictNullChecksRunning(item.start, 'item.start');
			return item.start;
		}) ?? null;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get lastShiftEnd() : number | null {
		const index = this.shiftRefs ? this.shiftRefs.length - 1 : 0;
		return this.getItemWthStartAndEnd(index, item => {
			assumeDefinedToGetStrictNullChecksRunning(item.end, 'item.end');
			return item.end;
		}) ?? null;
	}

	/**
	 * The time. No matter if a shiftId or shiftsRefs or whatever is provided.
	 */
	public get allAtTheSameTime() : boolean | undefined {
		if (!!this.shiftId) return true;

		if (this.shiftRefs) {
			const firstShiftStart = this.datePipe.transform(this.firstShiftStart, 'shortTime');
			const lastShiftEnd = this.datePipe.transform(this.lastShiftEnd, 'shortTime');
			for (let i = 0; i < this.shiftRefs.length; i++) {
				const startTimestamp = this.getItemWthStartAndEnd(i, item => {
					assumeDefinedToGetStrictNullChecksRunning(item.start, 'item.start');
					return item.start;
				})!;
				const itemStart = this.datePipe.transform(startTimestamp, 'shortTime');
				if (itemStart !== firstShiftStart) return false;
				const endTimestamp = this.getItemWthStartAndEnd(i, item => {
					assumeDefinedToGetStrictNullChecksRunning(item.end, 'item.end');
					return item.end;
				})!;
				const itemEnd = this.datePipe.transform(endTimestamp, 'shortTime');
				if (itemEnd !== lastShiftEnd) return false;
			}
			return true;
		}
		return undefined;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get allShiftsRemoved() : boolean {
		if (!this.shiftRefs || this.shiftRefs.length === 0) return false;

		for (const shiftRef of this.shiftRefs.iterable()) {
			const shift = this.api.data.shifts.get(shiftRef.id);

			if (!shift) return false;
			if (!shift.isRemoved) return false;
		}

		return true;
	}
}
