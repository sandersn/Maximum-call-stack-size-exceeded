import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { ApiDataWrapperBase} from '@plano/shared/api';
import { SchedulingApiRoot, StoryBookApiService } from '@plano/shared/api';
import { ApiAttributeInfo } from '@plano/shared/api/base/api-attribute-info';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { STORYBOOK_OUTPUT_FN, STORYBOOK_STRINGIFY_FN } from '../../../../storybook/storybook.utils';
import { PFormGroup } from '../p-form-control';
import { PFormsModule } from '../p-forms.module';

const VALIDATORS = new ValidatorsService();
const apiObjectWrapper = new SchedulingApiRoot(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ATTRIBUTE_INFO_BOOKING_PAGE_COVER = new ApiAttributeInfo<SchedulingApiRoot, any>({
	apiObjWrapper: apiObjectWrapper,
	id: 'BOOKING_PAGE_COVER',
	name: 'bookingPageCover',
	canEdit: null,
	primitiveType: PApiPrimitiveTypes.Days,
	readMode: null,
	show: null,
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	validations: function(this : SchedulingApiRoot) {
		return [
			() => VALIDATORS.imageRatio(2.6315789),
			() => VALIDATORS.imageMaxFileSize(1024),
			() => VALIDATORS.imageMinWidth(900),
			() => VALIDATORS.imageMinHeight(342),
			() => VALIDATORS.imageMaxWidth(1800),
			() => VALIDATORS.imageMaxHeight(684),
		];
	},
	vars: {},
});

ATTRIBUTE_INFO_BOOKING_PAGE_COVER.isNewItem();

const myStory = storiesOf('Client/PForms/p-form-control-switch', module);
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
				<p-form-control-switch
					[attributeInfo]="attributeInfo"
					[group]="formGroup"
					[type]="'Duration'"
					[durationUIType]="dropdownValue"
					[(dropdownValue)]="dropdownValue"
				>
					<p-form-control-switch-item
						label="Minutes"
						[value]="'Minutes'"
					></p-form-control-switch-item>
					<p-form-control-switch-item
						label="Hours"
						[value]="'Hours'"
					></p-form-control-switch-item>
					<p-form-control-switch-item
						label="Null"
						[value]="null"
						(onClick)="attributeInfo.value=-1;onClick($event)"
					></p-form-control-switch-item>

				</p-form-control-switch>
			</form>
			<hr>
			${STORYBOOK_OUTPUT_FN('dropdownValue')}
			<hr>
			${STORYBOOK_OUTPUT_FN('attributeInfo.value')}
		`,
		props: {
			dropdownValue: PApiPrimitiveTypes.Minutes,
			stringify: STORYBOOK_STRINGIFY_FN,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			attributeInfo: new ApiAttributeInfo<SchedulingApiRoot, any>({
				apiObjWrapper: apiObjectWrapper,
				id: 'SOME_DURATION',
				name: 'someDuration',
				canEdit: null,
				primitiveType: PApiPrimitiveTypes.Duration,
				readMode: null,
				show: null,
				/* eslint-disable-next-line jsdoc/require-jsdoc */
				validations: function(this : SchedulingApiRoot) {
					return [
					];
				},
				vars: {},
			}),
			formGroup: new PFormGroup({}),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onClick: (event : any) => {
				return action('onClick')(event);
			},
		},
	}))
	.add('days', () => ({
		template: `
			<form [formGroup]="$any(formGroup)">
				<p-form-control-switch
					[attributeInfo]="attributeInfo"
					[group]="formGroup"
				>
				</p-form-control-switch>
			</form>
			<hr>
			${STORYBOOK_OUTPUT_FN('attributeInfo.value')}
		`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			attributeInfo: new ApiAttributeInfo<SchedulingApiRoot, any>({
				apiObjWrapper: apiObjectWrapper,
				id: 'SOME_DAYS',
				name: 'someDays',
				canEdit: null,
				primitiveType: PApiPrimitiveTypes.Days,
				readMode: null,
				show: null,
				/* eslint-disable-next-line jsdoc/require-jsdoc */
				validations: function(this : SchedulingApiRoot) {
					return [
					];
				},
				vars: {},
			}),
			formGroup: new PFormGroup({}),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onClick: (event : any) => {
				return action('onClick')(event);
			},
		},
	}))
	.add('image upload', () => ({
		template: `
			<form [formGroup]="$any(formGroup)">
				<p-form-control-switch
					[attributeInfo]="attributeInfo"
					[group]="formGroup"
				>
					<p-form-control-switch-item
						label="Pasta"
						[value]="true"
					></p-form-control-switch-item>
					<p-form-control-switch-item
						label="Pizza"
						[value]="false"
					></p-form-control-switch-item>
				</p-form-control-switch>
			</form>
		`,
		props: {
			attributeInfo: ATTRIBUTE_INFO_BOOKING_PAGE_COVER,
			formGroup: new PFormGroup({}),
		},
	}));
myStory
	.add('cannotEditHint', () => ({
		template: `
			<form [formGroup]="$any(formGroup)">
				<p-form-control-switch
					[attributeInfo]="attributeInfo"
					[group]="formGroup"
					[cannotEditHint]="'Lorem ipsum dolor sit amet!'"
				></p-form-control-switch>

				<!--
				<p-form-control-switch
					[attributeInfo]="attributeInfo"
					[group]="formGroup"
					[cannotEditHint]="'Lorem ipsum dolor sit amet!'"
				></p-form-control-switch>
				-->

			</form>
		`,
		props: {
			attributeInfo: ATTRIBUTE_INFO_BOOKING_PAGE_COVER,
			formGroup: new PFormGroup({}),
		},
	}));



const getStoryBookPath = (apiPath : string) : string => {
	const base = 'Client/PForms/p-storybook-api-preview';

	// add to "base" api-path without last path item
	const lastSlashIndex = apiPath.lastIndexOf('/');
	const apiPathWithoutLastItem = apiPath.substr(0, lastSlashIndex);

	return apiPathWithoutLastItem ? `${base}/${apiPathWithoutLastItem}` : base;
};

const getStoryBookName = (apiPath : string) : string => {
	// return last api-path item
	const lastSlashIndex = apiPath.lastIndexOf('/');
	return apiPath.substr(lastSlashIndex + 1);
};

const addStoryBookApiPreview = (apiPath : string) : void => {
	storiesOf(getStoryBookPath(apiPath), module)
		.addDecorator(
			moduleMetadata({
				imports: [
					StorybookModule,
					PFormsModule,
				],
			}),
		)
		.add(getStoryBookName(apiPath), () => ({
			template: `
				<p-storybook-api-preview
					[path]="path"
				>
				<hr>
				`,
			props: {
				path: apiPath,
			},
		}));
};

/**
 * Note that this instance of StoryBookApiService is not initialized with
 * any dependencies and is just used to generate the correct menu structure (as we did not find a way to
 * inject a service at this place).
 * The storybook-api-preview injects its own instance of StoryBookApiService which will have correct
 * dependencies.
 */
const storyBookApi = new StoryBookApiService(undefined!, undefined!, undefined!, undefined!, undefined!);

/**
 * Create storybook previews pages for each wrapper object in story-book api
 */
const addStoryBookApiPreviewsRecursively = (data : ApiDataWrapperBase, path ?: string) : void => {
	// add preview if current object has primitive children
	if (data.getChildPrimitiveNames().length > 0) {

		// for (const childPrimitiveName of data.getChildPrimitiveNames()) {
		// 	addStoryBookApiPreview(path + '/' + childPrimitiveName);
		// }

		addStoryBookApiPreview(path!);

	}

	// continue recursively on all child wrappers
	for (const childWrapperName of data.getChildWrapperNames()) {
		const nextPath = path ? `${path}/${childWrapperName}` : childWrapperName;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		addStoryBookApiPreviewsRecursively((data as any)[childWrapperName], nextPath);
	}
};

addStoryBookApiPreviewsRecursively(storyBookApi.data);


