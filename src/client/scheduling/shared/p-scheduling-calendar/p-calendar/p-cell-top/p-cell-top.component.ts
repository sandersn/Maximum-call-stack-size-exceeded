
import { OnInit, TemplateRef } from '@angular/core';
import { Component, Output, EventEmitter, Input, HostBinding, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { Assertions } from '@plano/shared/core/assertions';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { DateFormats, PDateFormat } from '@plano/shared/core/pipe/p-date.pipe';
import { assumeNonNull } from '../../../../../../shared/core/null-type-utils';
import { SchedulingApiShifts } from '../../../api/scheduling-api.service';
import { PCalendarService } from '../../p-calendar.service';

@Component({
	selector: 'p-cell-top[dayStart]',
	templateUrl: './p-cell-top.component.html',
	styleUrls: ['./p-cell-top.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PCellTopComponent implements OnInit {
	@HostBinding('class.cal-cell-top') protected _alwaysTrue = true;

	/**
	 * Check if given timestamp is today
	 */
	@HostBinding('class.cal-today') public get isToday() : boolean {
		return this.dayStart === this.todayDayStart;
	}

	@HostListener('click') private _onClick() : void {
		this.clickCellTop.emit(this.dayStart);
	}

	@Output() public clickCellTop : EventEmitter<number> = new EventEmitter();
	@Input() public dayStart ! : number;
	@Input() public dateFormat : DateFormats = PDateFormat.MINIMAL_DATE;
	@Input() private shiftsOfDay : SchedulingApiShifts | null = null;
	@Input() public neverShowDayTools : boolean = true;

	/**
	 * If this is set to false the icon will only be visible on hover or if content exists
	 */
	@Input() public pinStickyNote : boolean = false;

	@Input() public canEditMemos : boolean = false;

	private todayDayStart ! : number;
	public hover : boolean = false;

	constructor(
		private modalService : ModalService,
		private pCalendarService : PCalendarService,
		private pMoment : PMomentService,
	) {
	}

	public BootstrapSize = BootstrapSize;
	public PThemeEnum = PThemeEnum;
	public PBtnThemeEnum = PBtnThemeEnum;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get shiftsForCommentsModal() : SchedulingApiShifts {
		if (!this.dayStart || !this.shiftsOfDay) return new SchedulingApiShifts(null, false);
		return this.shiftsOfDay.filterBy((item) => !!item.description);
	}

	public ngOnInit() : void {
		this.todayDayStart = +this.pMoment.m().startOf('day');

		Assertions.ensureIsDayStart(this.dayStart);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public selectShifts(event : Event) : void {
		event.stopPropagation();
		assumeNonNull(this.shiftsOfDay);
		this.shiftsOfDay.setSelected(!this.shiftsAreSelected);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get shiftsAreSelected() : boolean {
		if (!this.shiftsAreSelectable) return false;
		assumeNonNull(this.shiftsOfDay);
		return this.shiftsOfDay.length === this.shiftsOfDay.selectedItems.length;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get shiftsAreSelectable() : boolean {
		assumeNonNull(this.shiftsOfDay);
		return !!this.shiftsOfDay.length;
	}

	/**
	 * Open form for changing the memo content
	 */
	public editComments(modalContent : TemplateRef<unknown>) : void {
		this.modalService.openModal(modalContent);
	}

	/**
	 * Check if shiftsOfDay have any descriptions
	 */
	public get shiftsOfDayHaveDescriptions() : boolean {
		return !!this.pCalendarService.shiftsOfDayHaveDescriptions(this.dayStart, { onlyForUser : true });
	}
}
