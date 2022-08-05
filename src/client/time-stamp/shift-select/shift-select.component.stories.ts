import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { TimeStampApiShifts, TimeStampApiShift } from '../time-stamp-api.service';
import { TimeStampModule } from '../time-stamp.module';

const myStory = storiesOf('Client/TimeStamp/shift-select', module);
myStory

	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				TimeStampModule,
			],
			declarations: [
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-shift-select
				[shifts]="shifts"
				[(selectedShiftId)]="selectedShiftId"
			></p-shift-select>
		`,
		props: {
			shifts: (() : TimeStampApiShifts => {
				const shifts = new TimeStampApiShifts(null, false);
				const START_DATE1 = (() => {
					const result = new Date(); result.setTime(0); result.setHours(7); return result.valueOf();
				})();
				const END_DATE1 = (() => {
					const result = new Date(); result.setTime(0); result.setHours(13); return result.valueOf();
				})();
				const shift1 = new TimeStampApiShift(null, 1);
				shift1.start = START_DATE1;
				shift1.end = END_DATE1;
				shifts.push(shift1);
				const START_DATE2 = (() => {
					const result = new Date(); result.setTime(0); result.setHours(13); return result.valueOf();
				})();
				const END_DATE2 = (() => {
					const result = new Date(); result.setTime(0); result.setHours(20); return result.valueOf();
				})();
				const shift2 = new TimeStampApiShift(null, 2);
				shift2.start = START_DATE2;
				shift2.end = END_DATE2;
				shifts.push(shift2);
				return shifts;
			})(),
			// title: '',
			// isLoading: false,
		},
	}));
