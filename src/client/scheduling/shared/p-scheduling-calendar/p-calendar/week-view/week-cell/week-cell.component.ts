import { interval } from 'rxjs';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { Component, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiShifts } from '@plano/shared/api';
import { PMomentService } from '../../../../../../shared/p-moment.service';
import { SchedulingService } from '../../../../../scheduling.service';
import { PAllDayItemsListComponent } from '../../p-all-day-items-list/p-all-day-items-list.component';

@Component({
	selector: 'p-week-cell[weekday][shifts][absences][holidays][birthdays]',
	templateUrl: './week-cell.component.html',
	styleUrls: ['./week-cell.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class WeekCellComponent implements OnDestroy {
	@Input() public weekday ! : number;

	@Input() public shifts ! : SchedulingApiShifts;
	@Input() public absences ! : PAllDayItemsListComponent['absences'];
	@Input() public holidays ! : PAllDayItemsListComponent['holidays'];
	@Input() public birthdays ! : PAllDayItemsListComponent['birthdays'];

	@Output() public onShiftClick : EventEmitter<{shift : SchedulingApiShift, event : MouseEvent}> = new EventEmitter();

	@Input() public shiftTemplate : TemplateRef<unknown> | null = null;

	@Input() public readMode : boolean = false;
	@Input() public isLoading : boolean = false;

	constructor(
		private pMomentService : PMomentService,
	) {
		this.now = +this.pMomentService.m();
	}

	public now ! : number;

	public BootstrapSize = BootstrapSize;

	private firstShiftAfterNow : SchedulingApiShift | null = null;

	private nowLineUpdateIntervals : {[key : string] : Subscription | undefined} = {};

	private updateFirstShiftAfterNow(shifts : SchedulingApiShift[]) : void {
		const now = Date.now();
		this.firstShiftAfterNow = shifts.sort((a, b) => {
			if (!a.rawData || !b.rawData) {
				this.clearNowLineUpdateIntervals();
				return 0;
			}
			return a.start - b.start;
		}).find((item) => {
			if (!item.rawData) return null;
			return item.start > now;
		}) ?? null;
	}

	/** Should the now line be visible? */
	public showNowLine(shift : SchedulingApiShift) : boolean {
		if (!this.isToday(this.weekday)) return false;

		if (this.firstShiftAfterNow === null && !this.nowLineUpdateIntervals[`${this.weekday}${this.shifts.length}`]) {
			this.updateFirstShiftAfterNow(this.shifts.iterable());
			this.nowLineUpdateIntervals[`${this.weekday}${this.shifts.length}`] = interval(5000).pipe(
				// take(4),
			).subscribe(() => {
				this.updateFirstShiftAfterNow(this.shifts.iterable());
			});
			return false;
		}

		if (this.firstShiftAfterNow === null) return false;
		// eslint-disable-next-line sonarjs/prefer-immediate-return
		const isSameId = shift.id.equals(this.firstShiftAfterNow.id);
		return isSameId;
	}

	private isToday(date : Exclude<SchedulingService['urlParam'], null>['date']) : boolean {
		return this.pMomentService.m(date).isSame(this.now, 'date');
	}

	public ngOnDestroy() : void {
		this.clearNowLineUpdateIntervals();
	}

	private clearNowLineUpdateIntervals() : void {
		for (const key of Object.keys(this.nowLineUpdateIntervals)) {
			this.nowLineUpdateIntervals[key]?.unsubscribe();
			this.nowLineUpdateIntervals[key] = undefined;
		}
	}

}
