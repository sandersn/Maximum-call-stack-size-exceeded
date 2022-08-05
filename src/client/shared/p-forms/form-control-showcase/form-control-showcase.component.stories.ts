import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular';
import { ApiDataWrapperBase } from '@plano/shared/api';
import { ApiAttributeInfo } from '@plano/shared/api/base/api-attribute-info';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { createEnumArg } from '@plano/storybook/storybook.utils';
import { FormControlShowcaseComponent } from './form-control-showcase.component';
import { PFormsModule } from '../p-forms.module';

// eslint-disable-next-line import/no-default-export, storybook/story-exports
export default {
	title: 'Client/PForms/FormControlShowcaseComponent',
	component: FormControlShowcaseComponent,
	decorators: [
		moduleMetadata({
			imports: [
				StorybookModule,
				PFormsModule,
			],
		}),
	],
	parameters: {
		controls: {
			expanded: true,
		},
	},
	argTypes: {
		...createEnumArg<PApiPrimitiveTypes, ApiAttributeInfo<ApiDataWrapperBase, unknown>>('primitiveType', PApiPrimitiveTypes, undefined),
	},
} as Meta;

const ARGS = {
	label: undefined as unknown,
	isLoading: false,
	show: () => true,
	canEdit: () => true,
	name: 'preis',
	value: 999.5,
	primitiveType: PApiPrimitiveTypes.Currency,
};

const TEMPLATE : Story<typeof ARGS> = (args : typeof ARGS) => {
	return {
		template: `
			<p-form-control-showcase
				[label]="label"
				[isLoading]="isLoading"
				[attributeInfo]="ai"
			></p-form-control-showcase>
		`,
		props: {
			...args,
			ai: args,
		},
	};
};

const myStory = TEMPLATE.bind({});
myStory.args = ARGS;

