import { storiesOf, moduleMetadata } from '@storybook/angular';
import { PPermissionService } from '@plano/client/accesscontrol/permission.service';
import { FakeSchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service.mock';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { STORYBOOK_STRINGIFY_FN, STORYBOOK_OUTPUT_FN, STORYBOOK_OBJECT_OUTPUT_FN } from '@plano/storybook/storybook.utils';
import { PFormControl } from '../p-form-control';
import { PFormsModule } from '../p-forms.module';

const myStory = storiesOf('Client/PForms/p-input-member-id', module);
myStory

	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PFormsModule,
			],
			providers: [
				PPermissionService,
			],
		}),
	);

const fakeApi = new FakeSchedulingApiService();

myStory
	.add('default', () => ({
		template: `
			<p-input-member-id
				[formControl]="formControl"
				[members]="members"
			></p-input-member-id>
			<hr>
			<p>
				${STORYBOOK_OUTPUT_FN('formControl.value')}
			</p>
			<p>
				${STORYBOOK_OBJECT_OUTPUT_FN('formControl.errors')}
			</p>
		`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			formControl: new PFormControl({
				formState: {
					value: undefined,
					disabled: false,
				},
				validatorOrOpts: [
					new ValidatorsService().required(PApiPrimitiveTypes.Id),
					new ValidatorsService().idDefined(),
				],
			}),
			members: fakeApi.data.members,
		},
	}));
myStory
	.add(`[allMembersIsAllowed]="true"`, () => ({
		template: `
			<p-input-member-id
				[formControl]="formControl"
				[members]="members"
				[allMembersIsAllowed]="true"
			></p-input-member-id>
			<hr>
			<p>
				${STORYBOOK_OUTPUT_FN('formControl.value')}
			</p>
			<p>
				${STORYBOOK_OBJECT_OUTPUT_FN('formControl.errors')}
			</p>
		`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			formControl: new PFormControl({
				formState: {
					value: undefined,
					disabled: false,
				},
				validatorOrOpts: [
					new ValidatorsService().required(PApiPrimitiveTypes.Id),
				],
				subscribe: (value) => {
					// eslint-disable-next-line no-console
					console.log(value);
				},
			}),
			members: fakeApi.data.members,
		},
	}));
