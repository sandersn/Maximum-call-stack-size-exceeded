import { storiesOf, moduleMetadata } from '@storybook/angular';
import { Config } from '@plano/shared/core/config';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { STORYBOOK_STRINGIFY_FN, STORYBOOK_OUTPUT_FN } from '@plano/storybook/storybook.utils';
import { PInputDateTypes } from './p-input-date.component';
import { PSupportedLocaleIds, PSupportedTimeZones } from '../../../../shared/api/base/generated-types.ag';
import { PMomentService } from '../../p-moment.service';
import { PDurationPipe } from '../../pipe/p-duration.pipe';
import { PFormsModule } from '../p-forms.module';

// import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';

// Config.LOCALE_ID = PSupportedLocaleIds.de_DE;

// const todayAt9 = new PMomentService(Config.LOCALE_ID).m().set('hours', 9).set('minutes', 0);
// const model = +todayAt9;
// const model = undefined;
const model = 1586383200000; // 09.04.2020

// const min = +(new PMomentService(Config.LOCALE_ID).m().subtract(2, 'month').endOf('month').add(10, 'days')) + 1;
const min = +(new PMomentService(PSupportedLocaleIds.de_DE).m());
const days = 3;
const max = +(new PMomentService(Config.LOCALE_ID).m().add(days, 'days').startOf('day'));
// const max = 1586415600000; // Apr 09 2020 09:00:00 GMT+0200 (Central European Summer Time)
// const max = 1586383200000; // Apr 09 2020 00:00:00 GMT+0200 (Central European Summer Time)
Config.LOCALE_ID = PSupportedLocaleIds.de_DE;
const LOCALE = Config.LOCALE_ID;

const getTemplate = (
	type ?: PInputDateTypes,
	_isExclusiveEnd ?: boolean,
) : string => `
		${type === PInputDateTypes.deadline ? `
			<span>shift start:&nbsp;<kbd>{{max | date:'long':'+0200'}}</kbd> at timezone <kbd>{{timezone}}</kbd></span>
			<hr>
		` : ''}
		<div class="row">
			<label class="col-12">de-DE</label>
			<p-input-date
				class="col-6"
				${type ? `type="${type}"` : ''}
				[showDaysBeforeInput]="true"

				[showTimeInput]="showTimeInput"
				[showEraseValueBtn]="showEraseValueBtn"
				[isExclusiveEnd]="isExclusiveEnd !== undefined ? isExclusiveEnd : undefined"
				[(ngModel)]="model"
				[min]="min"
				[max]="max"
				locale="de-DE"
			></p-input-date>
			<p-input-date
				class="col-6"
				${type ? `type="${type}"` : ''}
				[showDaysBeforeInput]="true"
				[showTimeInput]="showTimeInput"
				[showEraseValueBtn]="showEraseValueBtn"
				[(ngModel)]="model"
				[disabled]="true"
				locale="de-DE"
			></p-input-date>
		</div>
		<div class="row">
			<label class="col-12">en-GB</label>
			<p-input-date
				class="col-6"
				${type ? `type="${type}"` : ''}
				[showDaysBeforeInput]="true"

				[showTimeInput]="showTimeInput"
				[showEraseValueBtn]="showEraseValueBtn"
				[(ngModel)]="model"
				[min]="min"
				[max]="max"
				locale="en-GB"
			></p-input-date>
			<p-input-date
				class="col-6"
				${type ? `type="${type}"` : ''}
				[showDaysBeforeInput]="true"
				[showTimeInput]="showTimeInput"
				[showEraseValueBtn]="showEraseValueBtn"
				[(ngModel)]="model"
				[disabled]="true"
				locale="en-GB"
			></p-input-date>
		</div>
		<br>
		<hr>
		${STORYBOOK_OUTPUT_FN('ngModel')}
		<br>
		➡ <kbd>{{model ? (model | date:'long':undefined:'de-DE') : '-'}}</kbd>
		${type === PInputDateTypes.deadline ? `
			<hr>
			<span>diff in hours:&nbsp;<kbd>{{model ? ((max - model) / 1000 / 60 / 60) : '-'}}</kbd>
		` : ''}
	`;

export class FakeConfig {
	public LOCALE_ID = PSupportedLocaleIds.de_DE;
	public TIME_ZONE = PSupportedTimeZones.EUROPE_BERLIN;
	public IS_MOBILE = false;
}

const myStory = storiesOf('Client/PForms/p-input-date', module);
myStory

	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PFormsModule,
			],
			declarations: [
			],
			providers: [
				PDurationPipe,
				{ provide: Config, useClass: FakeConfig },
			],
		}),
	)
	.add('default', () => ({
		template: getTemplate(),
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,

			// formControl: new PFormControl({
			// 	value: model,
			// 	disabled: false,
			// }),
			// formControl: { value: number('formControl.value', undefined) },
			model: model,

			min: min,
			max: max,
			showTimeInput: false,
			showEraseValueBtn: false,
			timezone: Config.getTimeZone(LOCALE),
		},
	}))
	.add('with time input', () => ({
		template: getTemplate(),
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,

			// formControl: new PFormControl({
			// 	value: model,
			// 	disabled: false,
			// }),
			// formControl: { value: number('formControl.value', undefined) },
			model: model,

			min: min,
			max: max,
			showTimeInput: true,
			showEraseValueBtn: false,
			timezone: Config.getTimeZone(LOCALE),
		},
	}));
myStory
	// eslint-disable-next-line literal-blacklist/literal-blacklist
	.add('[isExclusiveEnd]="true"', () => ({
		template: getTemplate(undefined, true),
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,

			// formControl: new PFormControl({
			// 	value: model,
			// 	disabled: false,
			// }),
			// formControl: { value: number('formControl.value', undefined) },
			model: model,

			isExclusiveEnd: true,
			min: min,
			max: 0,
			showTimeInput: false,
			showEraseValueBtn: false,
			timezone: Config.getTimeZone(LOCALE),
		},
	}));

for (const type of Object.values(PInputDateTypes)) {
	myStory
		.add(`type="${type}"`, () => ({
			template: getTemplate(type),
			props: {
				stringify: STORYBOOK_STRINGIFY_FN,

				// formControl: new PFormControl({
				// 	value: model,
				// 	disabled: false,
				// }),
				// formControl: { value: number('formControl.value', undefined) },
				model: model,

				min: min,
				max: max,
				showTimeInput: false,
				timezone: Config.getTimeZone(LOCALE),
			},
		}));
}
