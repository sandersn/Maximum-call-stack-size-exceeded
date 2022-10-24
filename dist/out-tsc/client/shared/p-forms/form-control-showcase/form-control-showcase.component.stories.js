import { moduleMetadata } from '@storybook/angular';
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
        ...createEnumArg('primitiveType', PApiPrimitiveTypes, undefined),
    },
};
const ARGS = {
    label: undefined,
    isLoading: false,
    show: () => true,
    canEdit: () => true,
    name: 'preis',
    value: 999.5,
    primitiveType: PApiPrimitiveTypes.Currency,
};
const TEMPLATE = (args) => {
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
//# sourceMappingURL=form-control-showcase.component.stories.js.map