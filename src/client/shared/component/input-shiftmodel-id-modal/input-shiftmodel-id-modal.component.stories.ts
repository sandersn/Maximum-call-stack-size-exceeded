import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { FakeSchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service.mock';
import { PFormControl } from '@plano/client/shared/p-forms/p-form-control';
import { Id } from '@plano/shared/api/base/id';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { STORYBOOK_STRINGIFY_FN, STORYBOOK_OUTPUT_FN, STORYBOOK_OBJECT_OUTPUT_FN } from '@plano/storybook/storybook.utils';
import { ClientSharedComponentsModule } from '../client-shared-components.module';

const fakeApi = new FakeSchedulingApiService();

let model : Id;

const myStory = storiesOf('Client/ClientSharedComponents/p-input-shiftmodel-id-modal', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				ClientSharedComponentsModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-input-shiftmodel-id-modal
				[shiftModels]="shiftModels"
				[ngModel]="ngModel"
				(ngModelChange)="ngModelChange($event)"
				[formControl]="formControl"
			></p-input-shiftmodel-id-modal>
			<br>
			${STORYBOOK_OBJECT_OUTPUT_FN('formControl.value')}
			<br>
			${STORYBOOK_OUTPUT_FN('ngModel')}
		`,
		props: {
			formControl: new PFormControl({
				formState: {
					value: undefined,
					disabled: false,
				},
			}),
			ngModel: model,
			ngModelChange: (event : Id) => {
				model = event;
				action('ngModelChange')(event);
			},
			shiftModels: fakeApi.data.shiftModels,
			stringify: STORYBOOK_STRINGIFY_FN,
		},
	}));
