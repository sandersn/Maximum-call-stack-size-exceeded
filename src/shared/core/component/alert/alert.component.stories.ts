import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular';
import { AlertComponent } from './alert.component';
import { PThemeEnum } from '../../../../client/shared/bootstrap-styles.enum';
import { StorybookModule } from '../../../../storybook/storybook.module';
import { FaIcon } from '../fa-icon/fa-icon-types';

// eslint-disable-next-line import/no-default-export
export default {
	title: 'Core/AlertComponent',
	component: AlertComponent,
	decorators: [ moduleMetadata({ imports: [ StorybookModule ] }) ],
	// argTypes: {
	// 	theme: {
	// 		defaultValue: PThemeEnum.WARNING,
	// 		description: 'foo',
	// 		name: 'foo foo',
	// 	},
	// },
} as Meta;

const TEMPLATE : Story<AlertComponent> = (args : AlertComponent) => ({
	template: (() => {
		let result = '';
		for (const theme of Object.values(PThemeEnum)) {
			result += `
				<p-alert
					class="mb-3"
					[icon]="icon"
					[dismissable]="dismissable"
					theme="${theme}"
				><h5>Hallo Welt!</h5>{{model}} Check mal die <a href="#">AGB</a>. <mark>Hervorgehobenes</mark> sieht <mark>so</mark> aus. <code>Code sieht anders</code> aus.</p-alert>
			`;
		}
		return result;
	})(),
	props: args,
});

export const Default = TEMPLATE.bind({});
Default.args = {
	icon: 'pen' as FaIcon,
	theme: PThemeEnum.WARNING,
	// isLoading: false,
};
