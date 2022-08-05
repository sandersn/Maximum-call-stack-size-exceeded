import { AfterContentChecked} from '@angular/core';
import { Component, HostBinding, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { SchedulingApiShiftExchangeShiftRef, SchedulingApiShiftExchangeSwappedShiftRef } from '@plano/shared/api';
import { SchedulingApiAbsenceType, SchedulingApiShiftExchange } from '@plano/shared/api';
import { SchedulingApiMember, SchedulingApiService } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { BootstrapRounded, PBtnThemeEnum } from '../../bootstrap-styles.enum';
import { DropdownTypeEnum } from '../../p-forms/p-dropdown/p-dropdown.component';
import { PMomentService } from '../../p-moment.service';

@Component({
	selector: 'p-shift-exchange-list-item[shiftExchange]',
	templateUrl: './p-shift-exchange-list-item.component.html',
	styleUrls: ['./p-shift-exchange-list-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PShiftExchangeListItemComponent implements AfterContentChecked {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.flex-row')
	@HostBinding('class.d-flex')
	@HostBinding('class.card-options')
	@HostBinding('class.align-items-stretch')
	@HostBinding('class.w-100') protected _alwaysTrue = true;

	@Input() public shiftExchange ! : SchedulingApiShiftExchange;
	@Input('indisposedMember') private _indisposedMember : SchedulingApiMember | null = null;
	@Input('newAssignedMember') private _newAssignedMember : SchedulingApiMember | null = null;
	@Input() public detailed : boolean = true;

	/** If this a standalone item it has no list-headline with labels, so it probably needs some more info in itself. */
	@Input() public isStandaloneItem : boolean = false;

	@Output()
	public calendarBtnClick : EventEmitter<SchedulingApiShiftExchangeShiftRef | SchedulingApiShiftExchangeSwappedShiftRef> =
			new EventEmitter<SchedulingApiShiftExchangeShiftRef | SchedulingApiShiftExchangeSwappedShiftRef>();

	public readonly CONFIG : typeof Config = Config;

	private now ! : number;

	public hover : boolean = false;

	@HostListener('mouseover', ['$event']) private _mouseover(_event : Event) : void {
		this.hover = true;
	}
	@HostListener('mouseleave', ['$event']) private _mouseleave(_event : Event) : void {
		this.hover = false;
	}


	constructor(
		private api : SchedulingApiService,
		private console : LogService,
		private pMoment : PMomentService,
		private rightsService : RightsService,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public DropdownTypeEnum = DropdownTypeEnum;
	public PBtnThemeEnum = PBtnThemeEnum;
	public BootstrapRounded = BootstrapRounded;
	public SchedulingApiAbsenceType = SchedulingApiAbsenceType;

	public ngAfterContentChecked() : void {
		this.now = +this.pMoment.m();
	}

	/**
	 * Should the button be visible, that triggers onCalendarClick() ?
	 */
	public get showInCalendarBtnExists() : boolean {
		if (this.calendarBtnClick.observers.length === 0) return false;
		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public isSelectedShiftRef(
		shiftRef : SchedulingApiShiftExchangeShiftRef | SchedulingApiShiftExchangeSwappedShiftRef | null = null,
	) : boolean {
		if (!shiftRef) throw new Error('shiftRef not defined');
		const shift = this.api.data.shifts.get(shiftRef.id);
		if (!shift) return false;
		if (!shift.selected) return false;
		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get indisposedMember() : SchedulingApiMember | undefined {
		if (this._indisposedMember) return this._indisposedMember;
		if (!this.shiftExchange.indisposedMember) {
			this.console.error('Could not get indisposedMember');
			return undefined;
		}
		return this.shiftExchange.indisposedMember;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get memberAddressedTo() : SchedulingApiMember | null {
		if (!this.api.isLoaded()) {
			if (Config.DEBUG) this.console.error('Can not get memberAddressedTo when api is not loaded');
			return null;
		}
		return this.api.data.members.get(this.shiftExchange.memberIdAddressedTo);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get shiftDate() : number {
		return this.shiftExchange.shifts.get(0)!.id.start;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get shiftTitle() : string | undefined {
		if (!this.shiftExchange.shiftModel) return undefined;
		return this.shiftExchange.shiftModel.name;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get shiftStart() : number | undefined {
		if (!this.shiftExchange.shifts.length) return undefined;
		return this.shiftExchange.shifts.get(0)!.start;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get shiftEnd() : number | undefined {
		if (!this.shiftExchange.shifts.length) return undefined;
		return this.shiftExchange.shifts.get(0)!.end;
	}

	/**
	 * Highlight the related shift in the calendar. This action is made for the Scheduling site.
	 */
	public onCalendarClick(
		shiftRef : SchedulingApiShiftExchangeShiftRef | SchedulingApiShiftExchangeSwappedShiftRef,
	) : void {
		this.calendarBtnClick.emit(shiftRef);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get shiftName() : string {
		return this.shiftExchange.shifts.get(0)?.name ?? '█████';
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get deadlineIsInThePast() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.shiftExchange.deadline, 'shiftExchange.deadline');
		return this.shiftExchange.deadline < this.now;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showDeadline() : boolean {
		if (this.shiftExchange.isClosed) return false;
		if (this.shiftExchange.deadline) return true;
		return false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get shiftRefsForCalendarButtons() : (
		SchedulingApiShiftExchangeShiftRef | SchedulingApiShiftExchangeSwappedShiftRef
	)[] {
		const shiftRefs = [];
		for (const shiftRef of this.shiftExchange.shiftRefs.iterable()) {
			shiftRefs.push(shiftRef);
		}
		// for (const swappedShiftRef of this.shiftExchange.swappedShiftRefs.iterable()) {
		// 	// TODO: A swapped shiftRef has no .start ...so pShiftExchangeService.onCalendarBtnClick would throw an error if
		// 	// we would provide a swappedShiftRef
		// 	shiftRefs.push(swappedShiftRef.id);
		// }
		return shiftRefs;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public isMe(member : SchedulingApiMember) : boolean {
		return !!this.rightsService.isMe(member.id);
	}
}
