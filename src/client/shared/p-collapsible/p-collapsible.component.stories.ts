/* eslint-disable @typescript-eslint/no-explicit-any */
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PCollapsibleComponent } from './p-collapsible.component';
import { PCollapsibleModule } from './p-collapsible.module';
import { BootstrapSize } from '../bootstrap-styles.enum';
import { PLedComponent } from '../p-led/p-led.component';

// eslint-disable-next-line import/no-default-export
export default {
	title: 'Client/ClientSharedComponents/p-collapsible',
	component: PCollapsibleComponent,
	decorators: [
		moduleMetadata({
			imports: [
				StorybookModule,
				PCollapsibleModule,
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
		collapsed: {
			control: {
				type: 'boolean',
				options: [true, false],
			},
		},
	},
} as Meta;

const TEMPLATE : Story<PCollapsibleComponent> = (args : PCollapsibleComponent) => ({
	template: `
		<p-collapsible
			[title]="title"
			[hasDanger]="hasDanger"
			[borderPrimary]="borderPrimary"
			[collapsed]="collapsed"
			(collapsedChange)="collapsedChange($event)"
		>
			<div trigger>Trigger</div>
			<div content class="card-body">Hallo Welt</div>
		</p-collapsible>
		<p-collapsible
			[title]="title"
			[hasDanger]="hasDanger"
			[borderPrimary]="borderPrimary"
			[collapsed]="true"
			(collapsedChange)="collapsedChange($event)"
		>
			<div trigger>Trigger</div>
			<div content class="card-body">Hallo Welt</div>
		</p-collapsible>
	`, // Needed to pass arbitrary child content
	props: args,
});

export const myStory = TEMPLATE.bind({});
myStory.args = {
	collapsed: false,
	hasDanger: false,
	borderPrimary: false,
	collapsedChange : action('collapsedChange') as any,
	size: BootstrapSize.SM,
};
