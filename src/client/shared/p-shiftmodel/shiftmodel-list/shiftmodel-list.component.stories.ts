
import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { AbstractControl} from '@angular/forms';
import { FormArray } from '@angular/forms';
import { FakeSchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service.mock';
import { Id } from '@plano/shared/api/base/id';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { STORYBOOK_STRINGIFY_FN } from '@plano/storybook/storybook.utils';
import { ClientSharedComponentsModule } from '../../component/client-shared-components.module';
import { PFormControl, PFormGroup } from '../../p-forms/p-form-control';
import { PFormsModule } from '../../p-forms/p-forms.module';
import { PLedModule } from '../../p-led/p-led.module';
import { PListsModule } from '../../p-lists/p-lists.module';
import { PShiftModelModule } from '../p-shiftmodel.module';

const myStory = storiesOf('Client/PShiftModel/p-shiftmodel-list', module);

myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PShiftModelModule,
				PFormsModule,
				PListsModule,
				ClientSharedComponentsModule,
				PLedModule,
			],
		}),
	);

const fakeApi = new FakeSchedulingApiService();
const formArray = new FormArray<PFormGroup>([]);
for (const shiftModel of fakeApi.data.shiftModels.iterable()) {
	const formGroup = new PFormGroup({
		id: new PFormControl({
			formState: {
				value: shiftModel.id,
				disabled: false,
			},
		}),
		freeclimberArticleId: new PFormControl({
			formState: {
				value: shiftModel.freeclimberArticleId,
				disabled: false,
			},
			subscribe: (value) => {
				shiftModel.freeclimberArticleId = value;
			},
		}),
	});
	formGroup.get('freeclimberArticleId')!.setValidators(() => new ValidatorsService().maxLength(3, shiftModel.attributeInfoFreeclimberArticleId.primitiveType));
	formArray.push(formGroup);
}

myStory
	.add('default', () => ({
		template: `
			<p-shiftmodel-list
				[isLoading]="true"
			></p-shiftmodel-list>
			<p-shiftmodel-list
				[shiftModels]="shiftModels"
				[contentTemplate]="contentTemplate"
				label="Freeclimber Artikel-ID"
			></p-shiftmodel-list>

			<p-shiftmodel-list
				[shiftModels]="shiftModels"
				[contentTemplate]="contentTemplate"
				label="Freeclimber Artikel-ID"
			></p-shiftmodel-list>

			<ng-template #contentTemplate let-shiftModel>
				<p-input
					class="m-1"
					[type]="PApiPrimitiveTypes.string"
					style="max-width: 120px;"
					[formControl]="getFormControlForShiftModel(shiftModel.id).get('freeclimberArticleId')"
				></p-input>
				<p-led class="d-inline-block" [off]="!getFormControlForShiftModel(shiftModel.id).get('freeclimberArticleId').valid"></p-led>
			</ng-template>
			<hr>
			<div>formArray.valid:&nbsp;<p-led class="d-inline-block" [off]="!formArray.valid"></p-led></div>
			<div>formArray.value:<br><pre>{{stringify(formArray.value)}}</pre></div>
		`,
		props: {
			formArray: formArray,
			shiftModels: fakeApi.data.shiftModels,
			getFormControlForShiftModel: (shiftModelId : Id) => {
				return formArray.controls.find((control : AbstractControl) => (control.get('id')!.value as Id).equals(shiftModelId));
			},
			stringify: STORYBOOK_STRINGIFY_FN,
		},
	}));

myStory
	.add('with (onItemClick)', () => ({
		template: `
			<p-shiftmodel-list
				[shiftModels]="shiftModels"
				[contentTemplate]="contentTemplate"
				(onItemClick)="onItemClick($event)"

			></p-shiftmodel-list>
		`,
		props: {
			formArray: formArray,
			shiftModels: fakeApi.data.shiftModels,
			getFormControlForShiftModel: (shiftModelId : Id) => {
				return formArray.controls.find((control : AbstractControl) => (control.get('id')!.value as Id).equals(shiftModelId));
			},
			stringify: STORYBOOK_STRINGIFY_FN,
			onItemClick: action('onItemClick'),
		},
	}));
