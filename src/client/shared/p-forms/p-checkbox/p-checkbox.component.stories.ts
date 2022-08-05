import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { HttpResponse } from '@angular/common/http';
import { FakeSchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service.mock';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { STORYBOOK_OUTPUT_FN, STORYBOOK_STRINGIFY_FN } from '@plano/storybook/storybook.utils';
import { ApiBase, ApiLoadArgs, ApiSaveArgs } from '../../../../shared/api';
import { ApiAttributeInfo } from '../../../../shared/api/base/api-attribute-info';
import { ApiObjectWrapper } from '../../../../shared/api/base/api-object-wrapper';
import { PApiPrimitiveTypes } from '../../../../shared/api/base/generated-types.ag';
import { Id } from '../../../../shared/api/base/id';
import { FaIcon } from '../../../../shared/core/component/fa-icon/fa-icon-types';
import { ValidatorsService } from '../../../../shared/core/validators.service';
import { SchedulingApiRoot } from '../../../scheduling/shared/api/scheduling-api.service';
import { PThemeEnum } from '../../bootstrap-styles.enum';
import { PBtnTheme as PButtonTheme} from '../../bootstrap-styles.enum';
import { PFormControl, PFormGroup } from '../p-form-control';
import { PFormsModule } from '../p-forms.module';

const myStory = storiesOf('Client/PForms/p-checkbox', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PFormsModule,
			],
			providers: [
			],
		}),
	);

const fakeApi = new FakeSchedulingApiService();

const getTemplate = (style : PButtonTheme) : string => `
		<div class="d-flex flex-column justify-content-center mb-4">
			<label>${style}</label>
			<p-checkbox
				class="mb-3"
				[formControl]="formControl"
				[ngModel]="formControl.value"
				[hasButtonStyle]="hasButtonStyle"
				theme="${style}"
				[size]="size"
				[textWhite]="textWhite"
				[isLoading]="isLoading"
				[valueText]="valueText"
				[icon]="icon"
				[cannotEditHint]="'Lorem Ipsum'"
			>{{text}}</p-checkbox>
			<p-checkbox
				class="mb-3"
				[disabled]="true"
				[readMode]="false"
				[ngModel]="formControl.value"
				[hasButtonStyle]="hasButtonStyle"
				theme="${style}"
				[size]="size"
				[textWhite]="textWhite"
				[isLoading]="isLoading"
				[valueText]="valueText"
				[icon]="icon"
				[cannotEditHint]="'Lorem Ipsum'"
			>{{text}}</p-checkbox>
			<p-checkbox
				class="mb-3"
				[disabled]="true"
				[ngModel]="formControl.value"
				[hasButtonStyle]="hasButtonStyle"
				theme="${style}"
				[size]="size"
				[textWhite]="textWhite"
				[isLoading]="isLoading"
				[valueText]="valueText"
				[icon]="icon"
				[cannotEditHint]="'Lorem Ipsum'"
			>{{text}}</p-checkbox>
		</div>
	`;

let template = '';
for (const type of Object.values(PThemeEnum)) template += getTemplate(type);

let ngModel = false;

myStory
	.add('default', () => ({
		template: template,
		props: {
			formControl: new PFormControl({
				formState: {
					value: true,
					disabled: false,
				},
			}),
			size: 'md',
			hasButtonStyle: true,
			textWhite: undefined as unknown as boolean,
			isLoading: false,
			valueText: 'Hallo Welt',
			icon: undefined as unknown as FaIcon,
		},
	}));
myStory
	.add('with ngModel', () => ({
		template: `
		<div class="d-flex flex-column justify-content-center">
			<p-checkbox
				class="m-3"
				[(ngModel)]="ngModel"
				valueText="Mit ngModel und ngModelChange binding"
			></p-checkbox>
			<br>
			${STORYBOOK_OUTPUT_FN('ngModel')}
		</div>
		`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			// ngModelChange: (event : any) => {
			// 	ngModel = event;
			// 	return action('ngModelChange')(event);
			// },
			ngModel: ngModel,
		},
	}));
myStory
	.add('with formControl', () => ({
		template: `
		<div class="d-flex flex-column justify-content-center">
			<p-checkbox
				class="m-3"
				[formControl]="ormControl"
				valueText="Mit formControl binding"
			></p-checkbox>
			<br>
			${STORYBOOK_OUTPUT_FN('formControl.value')}
		</div>
		`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			formControl: new PFormControl({
				formState: {
					value: true,
					disabled: false,
				},
			}),
		},
	}));
myStory
	.add('with editable', () => ({
		template: `
		<div class="d-flex flex-column justify-content-center">
			<p-checkbox
				[pEditable]="true"
				[api]="api"

				class="m-3"
				[ngModel]="ngModel"
				(ngModelChange)="ngModelChange($event)"
				valueText="Mit ngModel und ngModelChange binding"
			></p-checkbox>
			${STORYBOOK_OUTPUT_FN('ngModel')}
		</div>
		`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			value: true,
			ngModel: ngModel,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			ngModelChange: (event : any) => {
				ngModel = event;
				return action('ngModelChange')(event);
			},
			api: fakeApi,
		},
	}));
myStory
	.add('without button style', () => ({
		template: `
		<div class="d-flex flex-column justify-content-center">
			<p-checkbox
				class="m-3"
				valueText="Mit ngModel und ngModelChange binding"

				[hasButtonStyle]="false"
			></p-checkbox>
			<br>
			<p-checkbox
				class="m-3"
				valueText="Mit ngModel und ngModelChange binding"

				[hasButtonStyle]="false"
				[disabled]="true"
				[readMode]="false"
			></p-checkbox>
			<hr>
			${STORYBOOK_OUTPUT_FN('ngModel')}
		</div>
		`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			value: true,
			ngModel: ngModel,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			ngModelChange: (event : any) => {
				ngModel = event;
				return action('ngModelChange')(event);
			},
			api: fakeApi,
		},
	}));

const VALIDATORS = new ValidatorsService();

class ObjectWrapperForStorybook<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<ObjectWrapperForStorybook, ValidationMode> {
	constructor(api : ApiBase | null) {
		super(api, ObjectWrapperForStorybook);
	}

	public override loadDetailed({success = null, error = null, searchParams = null} : ApiLoadArgs = {}) : Promise<HttpResponse<unknown>> {
		error;searchParams;
		if (success) success(new HttpResponse<unknown>());
		return new Promise(() => new HttpResponse());
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	protected get dni() : string {
		throw new Error('Method not implemented.');
	}

	public override saveDetailed(_input : ApiSaveArgs = {}) : Promise<HttpResponse<unknown>> {
		throw new Error('Method not implemented.');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get id() : Id {
		throw new Error('Method not implemented.');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public _fixIds() : void {
		throw new Error('Method not implemented.');
	}

	public isFooAttributeInfo = new ApiAttributeInfo<SchedulingApiRoot<ValidationMode>, unknown>({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		apiObjWrapper: this as any,
		id: 'IS_FOO',
		name: 'isFoo',
		canEdit: () => true,
		primitiveType: PApiPrimitiveTypes.boolean,
		readMode: null!,
		show: () => true,
		/* eslint-disable-next-line jsdoc/require-jsdoc */
		validations: function(this : SchedulingApiRoot) {
			return [
				() => VALIDATORS.required(PApiPrimitiveTypes.boolean),
			];
		},
		vars: {},
	});
	public isBarAttributeInfo = new ApiAttributeInfo<SchedulingApiRoot<ValidationMode>, unknown>({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		apiObjWrapper: this as any,
		id: 'IS_BAR',
		name: 'isBar',
		canEdit: () => true,
		primitiveType: PApiPrimitiveTypes.boolean,
		readMode: null!,
		show: () => true,
		/* eslint-disable-next-line jsdoc/require-jsdoc */
		validations: function(this : SchedulingApiRoot) {
			if (!objectWrapper.isFooAttributeInfo.value) return [
				() => VALIDATORS.required(PApiPrimitiveTypes.boolean),
			];
			return [];
		},
		vars: {},
	});
}
const objectWrapper = new ObjectWrapperForStorybook(null);

const formGroup = new PFormGroup({});

myStory
	.add('with AttributeInfo validator', () => ({
		template: `
		<div class="">
			<p-form-control-switch
				class="m-3"
				valueText="Turn on required validator on next checkbox?"
				[pEditable]="false"
				[api]="api"

				[group]="formGroup"
				[attributeInfo]="attributeInfo1.attributeInfo"
			></p-form-control-switch>
			<br>
			<p-form-control-switch
				class="m-3"
				valueText="Is Bar?"
				[pEditable]="false"
				[api]="api"

				[group]="formGroup"
				[attributeInfo]="attributeInfo2.attributeInfo"
			></p-form-control-switch>
			<hr>
			${STORYBOOK_OUTPUT_FN('formGroup.get(attributeInfo1.attributeInfo.id)?.errors')}
			<br>
			${STORYBOOK_OUTPUT_FN('formGroup.get(attributeInfo2.attributeInfo.id)?.errors')}
			<br>
			<br>
			${STORYBOOK_OUTPUT_FN('attributeInfo1.attributeInfo.value')}
			<br>
			${STORYBOOK_OUTPUT_FN('attributeInfo2.attributeInfo.value')}
		</div>
		`,
		props: {
			attributeInfo1 : {
				attributeInfo : objectWrapper.isFooAttributeInfo,
			},
			attributeInfo2 : {
				attributeInfo : objectWrapper.isBarAttributeInfo,
			},
			api: fakeApi,
			formGroup: formGroup,
			stringify: STORYBOOK_STRINGIFY_FN,
		},
	}));


myStory
	.add('with AttributeInfos and ngif', () => ({
		template: `
		<div class="">
			<p-form-control-switch
				class="m-3"
				valueText="Turn on required validator on next checkbox?"
				[pEditable]="false"
				[api]="api"

				[group]="formGroup"
				[attributeInfo]="attributeInfo1.attributeInfo"
			></p-form-control-switch>
			<br>
			<p-form-control-switch
				*ngIf="attributeInfo1.attributeInfo.value"
				class="m-3"
				valueText="Is Bar?"
				[pEditable]="false"
				[api]="api"

				[group]="formGroup"
				[attributeInfo]="attributeInfo2.attributeInfo"
			></p-form-control-switch>
			<hr>
			${STORYBOOK_OUTPUT_FN('Object?.keys(formGroup.controls)?.length')}
			<br>
			${STORYBOOK_OUTPUT_FN('formGroup.value')}
		</div>
		`,
		props: {
			attributeInfo1 : {
				attributeInfo : objectWrapper.isFooAttributeInfo,
			},
			attributeInfo2 : {
				attributeInfo : objectWrapper.isBarAttributeInfo,
			},
			Object: Object,
			api: fakeApi,
			formGroup: formGroup,
			stringify: STORYBOOK_STRINGIFY_FN,
		},
	}));

class ObjectWrapperForStorybook2<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<ObjectWrapperForStorybook2, ValidationMode> {
	constructor(api : ApiBase | null) {
		super(api, ObjectWrapperForStorybook2);
	}

	public override loadDetailed({success = null, error = null, searchParams = null} : ApiLoadArgs = {}) : Promise<HttpResponse<unknown>> {
		error;searchParams;
		if (success) success(new HttpResponse<unknown>());
		return new Promise(() => new HttpResponse());
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	protected get dni() : string {
		throw new Error('Method not implemented.');
	}

	public override saveDetailed(_input : ApiSaveArgs = {}) : Promise<HttpResponse<unknown>> {
		throw new Error('Method not implemented.');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get id() : Id {
		throw new Error('Method not implemented.');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public _fixIds() : void {
		throw new Error('Method not implemented.');
	}

	public isFooAttributeInfo = new ApiAttributeInfo<SchedulingApiRoot<ValidationMode>, unknown>({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		apiObjWrapper: this as any,
		id: 'IS_FOO',
		name: 'isFoo',
		canEdit: () => true,
		primitiveType: PApiPrimitiveTypes.boolean,
		readMode: null!,
		show: () => true,
		/* eslint-disable-next-line jsdoc/require-jsdoc */
		validations: function(this : SchedulingApiRoot) {
			return [
				() => VALIDATORS.required(PApiPrimitiveTypes.boolean),
			];
		},
		vars: {},
	});
	public isBarAttributeInfo = new ApiAttributeInfo<SchedulingApiRoot<ValidationMode>, unknown>({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		apiObjWrapper: this as any,
		id: 'IS_BAR',
		name: 'isBar',
		canEdit: () => true,
		primitiveType: PApiPrimitiveTypes.boolean,
		readMode: null!,
		show: () => !!objectWrapper2.isFooAttributeInfo.value,
		/* eslint-disable-next-line jsdoc/require-jsdoc */
		validations: function(this : SchedulingApiRoot) {
			if (!!objectWrapper2.isFooAttributeInfo.value) return [
				() => VALIDATORS.required(PApiPrimitiveTypes.boolean),
			];
			return [];
		},
		vars: {},
	});
}

const objectWrapper2 = new ObjectWrapperForStorybook2(null);

const formGroup2 = new PFormGroup({});

myStory
	.add('with AttributeInfos. second has error', () => ({
		template: `
		<div class="">
			<p>The second input has an error. If its invisible, it should not cause an error on the formGroup</p>
			<p-form-control-switch
				class="m-3"
				valueText="The next ?"
				[pEditable]="false"
				[api]="api"

				[group]="formGroup"
				[attributeInfo]="attributeInfo1.attributeInfo"
			></p-form-control-switch>
			<br>
			<p-form-control-switch
				class="m-3"
				valueText="Is Bar?"
				[pEditable]="false"
				[api]="api"

				[group]="formGroup"
				[attributeInfo]="attributeInfo2.attributeInfo"
			></p-form-control-switch>
			<hr>
			${STORYBOOK_OUTPUT_FN('Object?.keys(formGroup.controls)?.length')}
			<hr>
			${STORYBOOK_OUTPUT_FN('formGroup.controls[attributeInfo1.attributeInfo.id]?.valid')}
			<br>
			${STORYBOOK_OUTPUT_FN('formGroup.controls[attributeInfo2.attributeInfo.id]?.valid')}
			<br>
			${STORYBOOK_OUTPUT_FN('formGroup.controls[attributeInfo1.attributeInfo.id]?.disabled')}
			<br>
			${STORYBOOK_OUTPUT_FN('formGroup.controls[attributeInfo2.attributeInfo.id]?.disabled')}
			<hr>
			${STORYBOOK_OUTPUT_FN('formGroup.value')}
			<br>
			${STORYBOOK_OUTPUT_FN('formGroup.valid')}
			<br>
			${STORYBOOK_OUTPUT_FN('formGroup.errors')}
		</div>
		`,
		props: {
			attributeInfo1 : {
				attributeInfo : objectWrapper2.isFooAttributeInfo,
			},
			attributeInfo2 : {
				attributeInfo : objectWrapper2.isBarAttributeInfo,
			},
			Object: Object,
			api: fakeApi,
			formGroup: formGroup2,
			stringify: STORYBOOK_STRINGIFY_FN,
		},
	}));
