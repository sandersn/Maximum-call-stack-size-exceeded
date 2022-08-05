import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { SchedulingApiRoot } from '@plano/shared/api';
import { ApiAttributeInfo } from '@plano/shared/api/base/api-attribute-info';
import { Duration } from '@plano/shared/api/base/generated-types.ag';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PFormControlSwitchDurationComponent } from './p-form-control-switch-duration.component';
import { PDictionarySourceString } from '../../../../shared/core/pipe/localize.dictionary';
import { STORYBOOK_OUTPUT_FN, STORYBOOK_STRINGIFY_FN } from '../../../../storybook/storybook.utils';
import { PFormsService } from '../../../service/p-forms.service';
import { PFormGroup } from '../p-form-control';
import { PFormsModule } from '../p-forms.module';

const VALIDATORS = new ValidatorsService();
const apiObjectWrapper = new SchedulingApiRoot(null);
const AI = new ApiAttributeInfo<SchedulingApiRoot, Duration>({
	apiObjWrapper: apiObjectWrapper,
	id: 'SOME_DURATION',
	name: 'someDuration',
	canEdit: () => true,
	primitiveType: PApiPrimitiveTypes.Duration,
	readMode: () => true,
	show: () => true,
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	validations: function(this : SchedulingApiRoot) {
		return [
			() => VALIDATORS.notUndefined(PApiPrimitiveTypes.Duration),
		];
	},
	vars: {},
});
const formGroup = new PFormGroup({});
const formControl = new PFormsService(undefined!, undefined!, undefined!, undefined!, undefined!).getByAI(formGroup, AI);

const myStory = storiesOf('Client/PForms/p-form-control-switch-duration', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PFormsModule,
			],
		}),
	)
	.add('duration', () => ({
		template: `
			<form [formGroup]="$any(formGroup)">
				<p-form-control-switch-duration
					label="Start der Zeitspanne" i18n-label
					[group]="formGroup"
					[attributeInfo]="attributeInfo"
					[durationUIType]="attributeInfo.value !== null ? pApiPrimitiveTypes.Days : null"
					[options]="deadlinesInputDurationOptions"
					[maxDecimalPlacesCount]="0"
				></p-form-control-switch-duration>
			</form>
			<hr>
			${STORYBOOK_OUTPUT_FN('attributeInfo.value')}
			<hr>
			${STORYBOOK_OUTPUT_FN('formGroup.value')}
			<hr>
			${STORYBOOK_OUTPUT_FN('formGroup.valid')}
			<hr>
			${STORYBOOK_OUTPUT_FN('formGroup.errors')}
			<hr>
			${STORYBOOK_OUTPUT_FN('formControl.errors')}
		`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			attributeInfo: AI,
			formGroup: formGroup,
			formControl: formControl,
			pApiPrimitiveTypes: PApiPrimitiveTypes,
			onClick: (event : unknown) => {
				return action('onClick')(event);
			},
			deadlinesInputDurationOptions: [
				{
					text: 'Tage vor Angebotsbeginn',
					value: PApiPrimitiveTypes.Days,
				},
				{
					text : 'Am Angebotstag' as PDictionarySourceString,
					value : 'custom',
					inputValue : 0,
				},
				{
					text: 'Unbegrenzt bis zum Angebotsbeginn',
					value: null,
				},
			] as PFormControlSwitchDurationComponent['options'],
		},
	}));
