import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular';
import { PLedComponent } from './p-led.component';
import { PLedModule } from './p-led.module';
import { BootstrapSize, PThemeEnum } from '../bootstrap-styles.enum';

// eslint-disable-next-line import/no-default-export
export default {
	title: 'Client/PLedModule/PLedComponent',
	component: PLedComponent,
	decorators: [
		moduleMetadata({
			imports: [
				PLedModule,
			],
		}),
	],
	argTypes: {
		size: {
			options: Object.values(BootstrapSize), // an array of serializable values
			control: {
				type: 'select', // type 'select' is automatically inferred when 'options' is defined
			},

			/** @deprecated */
			defaultValue: (new PLedComponent()).size,
		},
		theme: {
			options: Object.values(PThemeEnum), // an array of serializable values
			control: {
				type: 'select', // type 'select' is automatically inferred when 'options' is defined
			},

			/** @deprecated */
			defaultValue: (new PLedComponent()).theme,
		},
	},
} as Meta;

const TEMPLATE : Story<PLedComponent> = (args : PLedComponent) => ({
	props: args,
});

export const Small = TEMPLATE.bind({});
Small.args = {
	size: BootstrapSize.SM,
};
export const Danger = TEMPLATE.bind({});
Danger.args = {
	off: false,
	theme: PThemeEnum.DANGER,
};

export const Success = TEMPLATE.bind({});
Success.args = {
	off: false,
	theme: PThemeEnum.SUCCESS,
};
export const WARNING = TEMPLATE.bind({});
WARNING.args = {
	off: false,
	theme: PThemeEnum.WARNING,
};

// // const myStory = storiesOf('Client/ClientSharedComponents/p-led', module);
// myStory
// 	.addDecorator(
// 		moduleMetadata({
// 			declarations: [
// 				PLedComponent,
// 			],
// 		}),
// 	)
// 	.addParameters({ component: PLedComponent })
// 	.add('default', () => ({
// 		template: `
// 			<p-led [off]="false"></p-led>
// 			<p-led [off]="true"></p-led>
// 			<hr>
// 			<p-led [off]="false" [theme]="PThemeEnum.PRIMARY"></p-led>
// 			<p-led [off]="true" [theme]="PThemeEnum.PRIMARY"></p-led>
// 			<hr>
// 			<p-led [off]="false" theme="warning"></p-led>
// 			<p-led [off]="true" theme="warning"></p-led>
// 			<hr>
// 			<p-led [off]="false" theme="danger"></p-led>
// 			<p-led [off]="true" theme="danger"></p-led>
// 			<hr>
// 			<p-led [off]="false" [size]="BootstrapSize.SM"></p-led>
// 			<p-led [off]="true" [size]="BootstrapSize.SM"></p-led>
// 		`,
// 		props: {
// 			off: true,
// 		},
// 	}));
