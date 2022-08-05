import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { AngularDatePipeFormat } from '../../../../shared/core/pipe/p-date.pipe';
import { PThemeEnum } from '../../bootstrap-styles.enum';
import { PShiftExchangeModule } from '../p-shift-exchange.module';

const pastDate = new Date();
pastDate.setFullYear(pastDate.getFullYear() - 1);
const past = +pastDate;

const futureDate = new Date();
futureDate.setFullYear(futureDate.getFullYear() + 1);
const future = +futureDate;

// // eslint-disable-next-line import/no-default-export, @typescript-eslint/consistent-type-assertions
// export default {
// 	title: 'Client/PShiftExchange/PDeadlineComponent',
// 	component: PDeadlineComponent,
// 	decorators: [
// 		moduleMetadata({
// 			imports: [
// 				PDeadlineComponent,
// 			],
// 		}),
// 	],
// 	argTypes: {
// 		theme: {
// 			options: Object.values(PThemeEnum), // an array of serializable values
// 			control: {
// 				type: 'select', // type 'select' is automatically inferred when 'options' is defined
// 			},
// 		},
// 	},
// } as Meta;

// const TEMPLATE : Story<PDeadlineComponent> = (args : PDeadlineComponent) => ({
// 	props: args,
// });

// export const DEFAULT = TEMPLATE.bind({});

// cSpell:ignore hinne
const templateForOneTheme = (theme ?: PThemeEnum) : string => {
	return `
		<h4>${theme ?? 'Default'}</h4>
		<div>
			<label class="mr-2">In the future:</label>
			<p-deadline
				[timestamp]="future"
				theme="${theme ?? ''}"
				label="Mach hinne"
				[dateFormat]="dateFormat"
				tooltipContent="Ist echt wichtig, dass du das einhältst."
			></p-deadline>
		</div>
		<div>
			<label class="mr-2">In the past:</label>
			<p-deadline
				[timestamp]="past"
				theme="${theme}"
				label="Mach hinne"
				[dateFormat]="dateFormat"
				tooltipContent="Ist echt wichtig, dass du das einhältst."
			></p-deadline>
		</div>
		<hr>
	`;
};

const myStory = storiesOf('Client/PShiftExchange/p-deadline', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PShiftExchangeModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
		<div class="d-flex flex-column justify-content-center align-items-center position-relative">
			${templateForOneTheme()}
			${templateForOneTheme(PThemeEnum.WARNING)}
			${templateForOneTheme(PThemeEnum.SUCCESS)}
			${templateForOneTheme(PThemeEnum.DARK)}
			${templateForOneTheme(PThemeEnum.PRIMARY)}
		</div>
		`,
		props: {
			past: past,
			future: future,
		},
	}),
	);

myStory
	.add('with time', () => ({
		template: `
		<div class="d-flex flex-column justify-content-center align-items-center position-relative">
			${templateForOneTheme(PThemeEnum.SUCCESS)}
		</div>
		`,
		props: {
			future: future,
			past: past,
			dateFormat: AngularDatePipeFormat.SHORT,
		},
	}),
	);
