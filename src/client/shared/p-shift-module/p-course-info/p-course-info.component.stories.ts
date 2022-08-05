import { storiesOf, moduleMetadata } from '@storybook/angular';
import { SchedulingApiShift, SchedulingApiShiftModel } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { SchedulingApiCourseType } from '@plano/shared/api';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PShiftModule } from '../p-shift.module';

const getTemplate = (
	// isCourse : SchedulingApiShift['isCourse'],
	isCourseCanceled : SchedulingApiShift['isCourseCanceled'],
	minCourseParticipantCount : SchedulingApiShift['minCourseParticipantCount'] | undefined,
	currentCourseParticipantCount : SchedulingApiShift['currentCourseParticipantCount'] | undefined,
	maxCourseParticipantCount : SchedulingApiShift['maxCourseParticipantCount'] | undefined,
	// courseType : SchedulingApiShift['courseType'],
	onlyWholeCourseBookable : SchedulingApiShiftModel['onlyWholeCourseBookable'] | undefined,
) : string => {
	return `
		<p-course-info
			[isCourse]="isCourse"
			[isCourseCanceled]="${isCourseCanceled}"
			[minCourseParticipantCount]="${minCourseParticipantCount}"
			[currentCourseParticipantCount]="${currentCourseParticipantCount}"
			[maxCourseParticipantCount]="${maxCourseParticipantCount}"
			[courseType]="courseType"
			[isCourseOnline]="isCourseOnline"
			[onlyWholeCourseBookable]="${onlyWholeCourseBookable}"
		></p-course-info>
	`;
};

const myStory = storiesOf('Client/PShift/p-course-info', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PShiftModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<h6>Alles Super</h6>
			${getTemplate(false, 10, 30, 30, undefined)}
			<br>
			<h6>Min nicht erreicht</h6>
			${getTemplate(false, 20, 10, 30, undefined)}
			<br>
			<h6>Max nicht erreicht</h6>
			${getTemplate(false, 10, 20, 30, undefined)}
			<br>
			<h6>Kein min</h6>
			${getTemplate(false, 0, 20, 30, undefined)}
			<br>
			<h6>Kein max</h6>
			${getTemplate(false, 20, 10, undefined, undefined)}
			<br>
			<h6>Fällt aus</h6>
			${getTemplate(true, undefined, undefined, undefined, undefined)}
		`,
		props: {
			isCourse: true,
			courseType: SchedulingApiCourseType.ONLINE_BOOKABLE,
			isCourseOnline: true,
		},
	}));
