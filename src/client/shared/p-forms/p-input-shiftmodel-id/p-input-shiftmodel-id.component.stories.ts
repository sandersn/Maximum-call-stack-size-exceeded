import { storiesOf, moduleMetadata } from '@storybook/angular';
import { FakeSchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service.mock';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PShiftModelModule } from '../../p-shiftmodel/p-shiftmodel.module';
import { PFormControl } from '../p-form-control';
import { PFormsModule } from '../p-forms.module';

const getTemplate = () : string => `
		<p-input-shiftmodel-id
			[formControl]="formControl"
			[items]="shiftModels"
			icon="${PlanoFaIconPool.ITEMS_SHIFT_MODELS}"
		></p-input-shiftmodel-id>
		<hr>
		<p>
			<span>model:&nbsp;<kbd>{{formControl.value}}</kbd></span>
		</p>
		<p>
			<span>errors:&nbsp;<kbd>{{stringify(formControl.errors)}}</kbd></span>
		</p>
	`;

const fakeApi = new FakeSchedulingApiService();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stringifyFn = (input : any) : string => String(JSON.stringify(input, null, 2));

const myStory = storiesOf('Client/PForms/p-input-shiftmodel-id', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PFormsModule,
				PShiftModelModule,
			],
		}),
	);

const formControl = new PFormControl({
	formState: {
		value: undefined,
		disabled: false,
	},
	validatorOrOpts: [
		( new ValidatorsService().required(PApiPrimitiveTypes.Id) ),
		( new ValidatorsService().idDefined() ),
	],
});

myStory
	.add('default', () => ({
		template: getTemplate(),
		props: {
			stringify: stringifyFn,
			formControl: formControl,
			shiftModels: fakeApi.data.shiftModels,
		},
	}));
