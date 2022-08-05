import { CalendarDateFormatter } from 'angular-calendar';
import { CalendarMonthViewDay, CalendarEvent} from 'angular-calendar';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { AfterContentInit, AfterContentChecked, OnDestroy } from '@angular/core';
import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { SchedulingApiShiftModel} from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { SchedulingApiMembers } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { AuthenticatedApiRootBase } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { CustomDateFormatter } from './custom-date-formatter.provider';
import { assumeNotUndefined } from '../../../../shared/core/null-type-utils';
import { AffectedShiftsApiShifts } from '../../api/affected-shifts-api.service';
import { AffectedShiftsApiShift } from '../../api/affected-shifts-api.service';
import { BootstrapSize } from '../../bootstrap-styles.enum';
import { PMomentService } from '../../p-moment.service';

type PEventType = { event : CalendarEvent[], color : { primary : string, secondary : string }, isPacket : boolean};

@Component({
	selector: 'p-transmission-preview[shiftModel]',
	templateUrl: './transmission-preview.component.html',
	styleUrls: ['./transmission-preview.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.Default,
	// changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [{
		provide: CalendarDateFormatter,
		useClass: CustomDateFormatter,
	}],
})
export class TransmissionPreviewComponent implements PComponentInterface, AfterContentInit, AfterContentChecked, OnDestroy {
	@Input() public disabled : boolean = false;


	@Input() public affectedShifts : AffectedShiftsApiShifts = new AffectedShiftsApiShifts(null, false);
	@Input() public members : SchedulingApiMembers | null = new SchedulingApiMembers(null, false);

	@Input() public shiftModel ! : {
		name : SchedulingApiShiftModel['name'],
		color : SchedulingApiShiftModel['color'],
		isPacket : SchedulingApiShiftModel['isPacket'],
		isCourse : SchedulingApiShiftModel['isCourse'],
		courseType : SchedulingApiShiftModel['courseType'],
		onlyWholeCourseBookable : SchedulingApiShiftModel['onlyWholeCourseBookable'],
	};

	@Output() public timestampChanged : EventEmitter<number> = new EventEmitter<number>();
	@Input() public myId : AuthenticatedApiRootBase['id'] | null = null;

	@Input() public set timestamp(input : number) {
		this.viewDate = new Date(input);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get timestamp() : number {
		return +this.viewDate;
	}

	@Input() public set isLoading(input : PComponentInterface['isLoading']) {
		this._isLoading = input;
		// NOTE: this.changeDetectorRef is not defined when this binding triggers the first time.
		// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
		if (!input && this.changeDetectorRef) this.changeDetectorRef.detectChanges();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isLoading() : PComponentInterface['isLoading'] {
		return this._isLoading;
	}

	public CONFIG : typeof Config = Config;

	public viewDate : Date = new Date();

	private _isLoading : PComponentInterface['isLoading'] = false;

	constructor(
		private changeDetectorRef : ChangeDetectorRef,
		private pMomentService : PMomentService,
	) {
	}

	public CalendarModes = CalendarModes;
	public BootstrapSize = BootstrapSize;

	public events ! : CalendarEvent[];
	private subscriptions : ISubscription[] = [];

	public ngAfterContentInit() : void {
		if (this.affectedShifts.api?.onChange) {
			this.subscriptions.push(this.affectedShifts.api.onChange.subscribe(() => {
				this.events = this.getEvents();
			}));
		}
	}

	public ngAfterContentChecked() : void {
		this.events = this.getEvents();
	}

	private getAssignedMembers(ids : AffectedShiftsApiShift['assignedMemberIds']) : SchedulingApiMembers {
		if (!ids.length) return new SchedulingApiMembers(null, false);
		if (!this.members) throw new Error('members is not defined');
		if (!this.members.length) return new SchedulingApiMembers(null, false);
		return this.members.filterBy(item => ids.contains(item.id));
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getEvents() : CalendarEvent[] {
		const result : CalendarEvent<{
			assignedMembers : SchedulingApiMembers,
			isPacket : SchedulingApiShiftModel['isPacket'],
			isCourse : SchedulingApiShiftModel['isCourse'],
			courseType : SchedulingApiShiftModel['courseType'],
			onlyWholeCourseBookable : SchedulingApiShiftModel['onlyWholeCourseBookable'],
			emptyMemberSlots : AffectedShiftsApiShift['emptyMemberSlots'],
			isCourseOnline : AffectedShiftsApiShift['isCourseOnline'],
			minCourseParticipantCount : AffectedShiftsApiShift['minCourseParticipantCount'],
			currentCourseParticipantCount : AffectedShiftsApiShift['currentCourseParticipantCount'],
			maxCourseParticipantCount : AffectedShiftsApiShift['maxCourseParticipantCount'],
		}>[] = [];
		for (const affectedShift of this.affectedShifts.iterable()) {
			result.push({
				title: this.shiftModel.name,
				color: {
					primary: `#${this.shiftModel.color}`,
					secondary: `#${this.shiftModel.color}`,
				},
				start: new Date(affectedShift.start),
				end: new Date(affectedShift.end),
				meta : {
					isPacket: this.shiftModel.isPacket,
					assignedMembers: this.getAssignedMembers(affectedShift.assignedMemberIds),
					emptyMemberSlots: affectedShift.emptyMemberSlots,
					courseType: this.shiftModel.courseType,
					isCourse: this.shiftModel.isCourse,
					onlyWholeCourseBookable: this.shiftModel.onlyWholeCourseBookable,
					currentCourseParticipantCount: affectedShift.currentCourseParticipantCount,
					isCourseOnline: affectedShift.isCourseOnline,
					maxCourseParticipantCount: affectedShift.maxCourseParticipantCount,
					minCourseParticipantCount: affectedShift.minCourseParticipantCount,
				},
			});
		}
		return result.sort((a, b) => (a.start > b.start ? +1 : -1));
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public beforeMonthViewRender(input : { body : CalendarMonthViewDay[] }) : void {
		for (const cell of input.body) {
			const groups : { [key : string] : PEventType | undefined } = {};
			for (const event of cell.events as unknown as CalendarEvent<PEventType>[]) {
				if (!this.pMomentService.m(event.start).isSame(this.viewDate, 'month')) continue;
				// Use existing array or create new one.
				assumeNotUndefined(event.color);
				if (!groups[event.color.primary]) {
					groups[event.color.primary] = {
						event: [],
						color: { primary: event.color.primary, secondary: event.color.secondary },
						isPacket: event.meta!.isPacket,
					};
				}
				// Add an event.
				groups[event.color.primary]!.event.push(event);
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(cell as any)['eventGroups'] = Object.entries(groups);
		}
	}

	public activeDayIsOpen : boolean = false;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public dayClicked({ date, events } : { date : Date; events : CalendarEvent[] }) : void {
		if (!this.pMomentService.m(date).isSame(this.viewDate, 'month')) {
			this.activeDayIsOpen = false;
			this.onChangeDate(+date);
			return;
		}

		if (this.pMomentService.m(date).isSame(this.viewDate, 'day')) {
			// Clicked current day? => Toggle it
			this.activeDayIsOpen = events.length > 0 ? !this.activeDayIsOpen : false;
		} else {
			// Uncollapse if has events
			this.activeDayIsOpen = events.length > 0;
		}

		this.viewDate = date;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onChangeDate(timestamp : number) : void {
		this.activeDayIsOpen = false;
		this.viewDate = new Date(timestamp);
		this.timestampChanged.emit(timestamp);
	}

	public ngOnDestroy() : void {
		for (const subscription of this.subscriptions) subscription.unsubscribe();
	}
}
