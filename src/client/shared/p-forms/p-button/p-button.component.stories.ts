import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular';
import { createEnumArg, getArgsForPComponentInterface } from '@plano/storybook/storybook.utils';
import { PButtonComponent } from './p-button.component';
import { PThemeEnum } from '../../bootstrap-styles.enum';
import { PBtnTheme} from '../../bootstrap-styles.enum';
import { PFormsModule } from '../p-forms.module';

// eslint-disable-next-line import/no-default-export
export default {
	title: 'Client/PForms/PButtonComponent',
	component: PButtonComponent,
	decorators: [
		moduleMetadata({
			imports: [
				PFormsModule,
			],
		}),
	],
	argTypes: {
		...getArgsForPComponentInterface(new PButtonComponent(undefined!, undefined!, undefined)),
		...createEnumArg<PBtnTheme, PButtonComponent>('theme', PThemeEnum, (new PButtonComponent(undefined!, undefined!, undefined)).theme),
		cannotEditHint: {
			control: {
				type: 'string',
			},

			/** @deprecated */
			// cSpell:ignore Loreem, ipsuum, amet
			defaultValue: 'Loreem! ipsuum dolor sit amet.',
		},
		// ...createEnumArg<BootstrapSize, PButtonComponent>('size', (new PButtonComponent(undefined)).size, BootstrapSize),
		// ...getArgsForPFormControlComponentInterface(new PButtonComponent(undefined));
		// size: {
		// 	options: Object.values(BootstrapSize), // an array of serializable values
		// 	control: {
		// 		type: 'select', // type 'select' is automatically inferred when 'options' is defined
		// 	},
		// 	defaultValue: (new PButtonComponent(undefined)).size,
		// },
	},
} as Meta;

const TEMPLATE : Story<PButtonComponent> = (args : PButtonComponent | { cannotEditHint : string }) => ({
	template: `
		<p-button
			class="mb-3"
			[isLoading]="isLoading"
			[theme]="theme"
			[cannotEditHint]="'Geht nicht. Admin schuld.'"
		>{{theme}}</p-button>
		<p-button
			class="mb-3"
			[isLoading]="isLoading"
			[theme]="theme"
			[cannotEditHint]="'Geht nicht. Admin schuld.'"
			[disabled]="true"
		>{{theme}}</p-button>
	`, // Needed to pass arbitrary child content
	props: args,
});

export const myStory = TEMPLATE.bind({});
