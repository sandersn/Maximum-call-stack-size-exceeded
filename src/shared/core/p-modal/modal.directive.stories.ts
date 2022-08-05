import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular';
import { ModalDirective } from './modal.directive';
import { PModalModule } from './modal.module';
import { PThemeEnum } from '../../../client/shared/bootstrap-styles.enum';
import { PLedComponent } from '../../../client/shared/p-led/p-led.component';
import { CoreModule } from '../core.module';




const modalServiceOptions : ModalDirective['modalServiceOptions'] = {
	theme: PThemeEnum.LIGHT,
	success: action('success'),
	dismiss: action('dismiss'),
	size: 'fullscreen',
};
const modalContentOptions : ModalDirective['modalContentOptions'] = {
	// cSpell:ignore Halooooo Directiveee
	modalTitle: 'Halooooo',
	description: `
	Ready or not, here I come, you can't hide<br>
	Gonna find you and take it slowly<br>
	Ready or not, here I come (Oh, oh), you can't hide<br>
	Gonna find you and make you want me<br>
	Ready or not, here I come, you can't hide<br>
	Gonna find you and take it slowly<br>
	Ready or not, here I come (Oh, oh), you can't hide<br>
	Gonna find you and make you want me<br>
	You can't run away from this style I got<br>
	Ready or not, here I come, you can't hide<br>
	Gonna find you and take it slowly<br>
	Ready or not, here I come (Oh, oh), you can't hide<br>
	Gonna find you and make you want me<br>
	Ready or not, here I come, you can't hide<br>
	Gonna find you and take it slowly<br>
	Ready or not, here I come (Oh, oh), you can't hide<br>
	Gonna find you and make you want me<br>
	You can't run away from this style I got<br>
	Oh, baby, hey,…
	`,
};

const allArgs = {
	...modalContentOptions,
	...modalServiceOptions,
};


// eslint-disable-next-line import/no-default-export
export default {
	title: 'Core/Modal/pModal Directiveee',
	component: PLedComponent,
	decorators: [
		moduleMetadata({
			imports: [
				CoreModule,
				PModalModule,
			],
		}),
	],
	argTypes: {
		theme: {
			options: Object.values(PThemeEnum), // an array of serializable values
			control: {
				type: 'select', // type 'select' is automatically inferred when 'options' is defined
			},
		},
	},
} as Meta;

const TEMPLATE : Story<typeof allArgs> = (_args : typeof allArgs) => {
	return {
		template: `
			<div
				pModal
			>Click here</div>
			<button
				pModal
				[modalContentOptions]="modalContentOptions"
				[modalServiceOptions]="modalServiceOptions"
			>Or click here</button>

		`, // Needed to pass arbitrary child content
		props: {
			modalContentOptions: modalContentOptions,
			modalServiceOptions: modalServiceOptions,
		},
	};
};

export const DEFAULT = TEMPLATE.bind({});
DEFAULT.args = allArgs;










// // const myStory = storiesOf('Core/Modal/pModal Directive', module);
// myStory
// 	.addDecorator(
// 		moduleMetadata({
// 			imports: [
// 				CoreModule,
// 				PModalModule,
// 			],
// 		}),
// 	)
// 	.add('directive', () => ({
// 		template: `
// 			<div
// 				pModal
// 			>Click here</div>
// 			<div
// 				pModal
// 				[modalContentOptions]="modalContentOptions"
// 				[modalServiceOptions]="modalServiceOptions"
// 			>Or click here</div>
// 		`,
// 		props: {
// 			modalContentOptions: {
// 				modalTitle: 'Oh ha!',
// 				description: `
// 					Ready or not, here I come, you can't hide<br>
// 					Gonna find you and take it slowly<br>
// 					Ready or not, here I come (Oh, oh), you can't hide<br>
// 					Gonna find you and make you want me<br>
// 					Ready or not, here I come, you can't hide<br>
// 					Gonna find you and take it slowly<br>
// 					Ready or not, here I come (Oh, oh), you can't hide<br>
// 					Gonna find you and make you want me<br>
// 					You can't run away from this style I got<br>
// 					Oh, baby, hey,…
// 				`,
// 				closeBtnLabel: 'To The Moon!',
// 				icon: 'rocket',
// 			},
// 			modalServiceOptions: modalServiceOptions,
// 		},
// 	}));

// myStory
// 	.add('directive with custom content', () => ({
// 		template: `
// 			<div
// 				pModal
// 				[modalContent]="modalContentRef"
// 			>Click here</div>

// 			<ng-template #modalContentRef let-c="close" let-d="dismiss">
// 				<div class="p-3">Custom content</div>
// 			</ng-template>
// 		`,
// 		props: {
// 		},
// 	}));
