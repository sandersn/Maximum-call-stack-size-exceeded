import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { SchedulingApiCourseType } from '@plano/shared/api';
import { SchedulingApiShiftModel } from '@plano/shared/api';
import { SchedulingApiShift } from '@plano/shared/api';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PShiftService } from '../p-shift.service';

@Component({
	selector: 'p-course-info',
	templateUrl: './p-course-info.component.html',
	styleUrls: ['./p-course-info.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PCourseInfoComponent {
	@Input() public readMode : boolean = false;

	@Input() public isCourse : SchedulingApiShiftModel['isCourse'] | null = null;
	@Input() public courseType : SchedulingApiShiftModel['courseType'] = null;
	@Input() public onlyWholeCourseBookable : SchedulingApiShiftModel['onlyWholeCourseBookable'] | null = null;

	@Input() public isCourseOnline : SchedulingApiShift['isCourseOnline'] | null = null;
	@Input() public isCourseCanceled : SchedulingApiShift['isCourseCanceled'] | null = null;

	@Input() public minCourseParticipantCount : SchedulingApiShift['minCourseParticipantCount'] | null = null;
	@Input() public currentCourseParticipantCount : SchedulingApiShift['currentCourseParticipantCount'] | null = null;
	@Input() public maxCourseParticipantCount : SchedulingApiShift['maxCourseParticipantCount'] = null;

	private get courseStateInfoText() : string {
		if (this.isCourseCanceled) return this.localize.transform('Angebot fällt aus');
		if (this.isOpenCourse) return this.localize.transform('Offenes Angebot – benötigt keine Buchungen');
		// eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
		return `${this.localize.transform('Mindestens')}: ${this.minCourseParticipantCount} | ${this.localize.transform('Gebucht')}: ${this.currentCourseParticipantCount} | ${this.localize.transform('Maximal')}: ${this.maxCourseParticipantCount ? this.maxCourseParticipantCount : '∞'}`;
	}

	private get ledStateInfoText() : string {
		if (this.ledOff) return `× ${this.localize.transform('Angebot ist online nicht sichtbar')}`;
		return `✓ ${this.localize.transform('Angebot ist online sichtbar')}`;
	}

	@HostBinding('title') private get _title() : string {
		return `${this.courseStateInfoText} | ${this.ledStateInfoText}`;
	}

	constructor(
		private pShiftService : PShiftService,
		private localize : LocalizePipe,
	) {}

	public PlanoFaIconPool = PlanoFaIconPool;
	public BootstrapSize = BootstrapSize;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get ledOff() : boolean {
		return !this.isCourseOnline;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isOpenCourse() : boolean {
		return this.courseType === SchedulingApiCourseType.NO_BOOKING;
	}

	/**
	 * Calculate color
	 */
	public get participantsCountStyle() : string {
		return this.pShiftService.participantsCountStyle({
			currentCourseParticipantCount: this.currentCourseParticipantCount!,
			isCourseCanceled: this.isCourseCanceled!,
			maxCourseParticipantCount: this.maxCourseParticipantCount!,
			minCourseParticipantCount: this.minCourseParticipantCount!,
		}, {
			courseType: this.courseType,
			onlyWholeCourseBookable: this.onlyWholeCourseBookable!,
		});
	}

}
