import { OnChanges} from '@angular/core';
import { Component, Input, HostBinding, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingApiShiftPacketShifts, SchedulingApiShiftPacketShift } from '@plano/shared/api';
import { ApiListWrapper } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';

type LineType = (string | SchedulingApiShiftPacketShift);
type LinesType = LineType[];

@Component({
	selector: 'p-packet-shifts',
	templateUrl: './packet-shifts.component.html',
	styleUrls: ['./packet-shifts.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PacketShiftsComponent implements OnChanges {
	@Input() private currentShiftId : Id | null = null;
	@Input() public packetShifts : SchedulingApiShiftPacketShifts | null = null;

	@Input() private collapsed : boolean = true;
	@Input() private clickable : boolean = true;

	@HostListener('mouseup', ['$event']) private _toggleCollapse(event : Event) : void {
		if (!this.isClickable) return;
		event.preventDefault();
		event.stopPropagation();
		this.collapsed = !this.collapsed;
		this.initValues();
	}

	@HostBinding('class.clickable')
	@HostBinding('class.btn-light') private get isClickable() : boolean | null {
		if (!this.clickable) return null;
		return this.isHugePackage;
	}

	private get isHugePackage() : boolean {
		return this.packetShifts!.length > 5;
	}

	public linesArray : LinesType = [];

	constructor(
		private localize : LocalizePipe,
		private datePipe : PDatePipe,
	) {
	}

	private get currentShift() : SchedulingApiShiftPacketShift | null {
		return this.packetShifts!.get(this.currentShiftId);
	}

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	private initValues() : void {
		if (!this.packetShifts) return;
		this.linesArray = this.getLinesArray();
	}

	private getFirstLine(
		sortedPacketShifts : ApiListWrapper<SchedulingApiShiftPacketShift>,
	) : SchedulingApiShiftPacketShift | null {
		return sortedPacketShifts.get(0);
	}

	private getLinesInTheMiddle(sortedPacketShifts : ApiListWrapper<SchedulingApiShiftPacketShift>) : LinesType | null {
		// Its a one-liner
		if (this.getFirstLine(sortedPacketShifts) === this.currentShift) return null;

		const secondShift = sortedPacketShifts.get(1);

		// It will be a two-liner
		assumeDefinedToGetStrictNullChecksRunning(secondShift, 'secondShift');
		if (sortedPacketShifts.length === 2 || secondShift === this.currentShift) return [secondShift];

		// It has some lines in the middle
		const result : LinesType = [];
		assumeDefinedToGetStrictNullChecksRunning(this.currentShift, 'currentShift');
		const indexOfCurrentShift = sortedPacketShifts.indexOf(this.currentShift);
		const COUNTER = indexOfCurrentShift === 0 ? sortedPacketShifts.length - 1 : indexOfCurrentShift - 1;
		result.push(COUNTER === 1 ? secondShift : `... ${COUNTER} ${this.localize.transform('Schichten')}`);
		const LAST_ONE_IS_CURRENT = sortedPacketShifts.get(sortedPacketShifts.length - 1) === this.currentShift;
		if (!LAST_ONE_IS_CURRENT) result.push(this.currentShift);
		return result;
	}

	private getLine3ToLast(sortedPacketShifts : ApiListWrapper<SchedulingApiShiftPacketShift>) : LinesType {
		const lastShift = sortedPacketShifts.get(sortedPacketShifts.length - 1);
		assumeDefinedToGetStrictNullChecksRunning(lastShift, 'lastShift');
		if (lastShift === this.currentShift) return [lastShift];

		const secondLastShift = sortedPacketShifts.get(sortedPacketShifts.length - 2);
		if (secondLastShift === this.currentShift) return [lastShift];

		const result : LinesType = [];
		assumeDefinedToGetStrictNullChecksRunning(this.currentShift, 'currentShift');
		const indexOfCurrentShift = sortedPacketShifts.indexOf(this.currentShift);
		const COUNTER = sortedPacketShifts.length - 1 - (indexOfCurrentShift + 1);
		const text = COUNTER === 1 ? secondLastShift : `... ${COUNTER} ${this.localize.transform('Schichten')}`;
		assumeDefinedToGetStrictNullChecksRunning(text, 'text');
		result.push(text, lastShift);

		return result;
	}

	private getLinesArray() : LinesType {
		const sortedPacketShifts = this.packetShifts!.sortedBy('start', false);
		if (!this.isHugePackage || !this.collapsed) return sortedPacketShifts.iterable();

		const result : LinesType = [];

		// Add line 1
		const firstLine = this.getFirstLine(sortedPacketShifts);
		assumeDefinedToGetStrictNullChecksRunning(firstLine, 'firstLine');
		result.push(firstLine);
		if (sortedPacketShifts.length === 1) return result;

		// Add line 2
		const LINES_IN_THE_MIDDLE = this.getLinesInTheMiddle(sortedPacketShifts);
		if (LINES_IN_THE_MIDDLE) {
			for (const LINE of LINES_IN_THE_MIDDLE) {
				result.push(LINE);
			}
		}

		if (sortedPacketShifts.length === 2) return result;

		// Add other lines
		const OTHER_LINES = this.getLine3ToLast(sortedPacketShifts);
		// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
		if (!OTHER_LINES) {
			assumeDefinedToGetStrictNullChecksRunning(OTHER_LINES, 'OTHER_LINES', 'getLine3ToLast() return type is wrong');
			return result;
		}

		for (const LINE of OTHER_LINES) {
			result.push(LINE);
		}
		return result;
	}

	public ngOnChanges() : void {
		this.initValues();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public isString(line : string | SchedulingApiShiftPacketShift) : boolean {
		if (line instanceof SchedulingApiShiftPacketShift) return false;
		return true;
	}

	/**
	 * Check if given shift is current shift if currentShiftId is set.
	 */
	public isCurrentShift(packetShift : SchedulingApiShiftPacketShift | string) : boolean {
		if (typeof packetShift === 'string') throw new Error('lineItem must be a SchedulingApiShiftPacketShift here');
		if (this.isString(packetShift)) return false;
		return this.currentShiftId!.equals(packetShift.id);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getDateInfo(packetShift : SchedulingApiShiftPacketShift | string) : string {
		if (typeof packetShift === 'string') throw new Error('input must be a SchedulingApiShiftPacketShift here');
		return `${this.datePipe.transform(packetShift.start, 'EE')} ${this.datePipe.transform(packetShift.start, 'shortDate')}`;
	}

}
