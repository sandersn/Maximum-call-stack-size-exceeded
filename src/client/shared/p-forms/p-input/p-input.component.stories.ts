/* eslint-disable max-lines */
import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { FakeSchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service.mock';
import { EmailValidApiService } from '@plano/shared/api';
import { PApiPrimitiveTypes, PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '@plano/shared/core/config';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { STORYBOOK_STRINGIFY_FN, STORYBOOK_OUTPUT_FN, STORYBOOK_OBJECT_OUTPUT_FN } from '@plano/storybook/storybook.utils';
import { PInputComponent } from './p-input.component';
import { EnumUtils } from '../../../../shared/core/typescript-utils';
import { BOOTSTRAP_SIZES } from '../../p-no-items/p-no-item/p-no-item.component.stories';
import { PFormControl } from '../p-form-control';
import { PFormsModule } from '../p-forms.module';

const fakeApi = new FakeSchedulingApiService();

const myStory = storiesOf('Client/PForms/p-input', module);
myStory
	.addParameters({ component: PInputComponent })
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PFormsModule,
			],
			providers: [
				EmailValidApiService,
			],
			declarations: [
			],
		}),
	);

myStory
	.add('WIDERRUFSFRIST', () => ({
		template: `
			<p-input
				[type]="type"
				[formControl]="formControl"
				[disabled]="false"
				[placeholder]="placeholder"
				[size]="size"
				[readMode]="false"
				(blur)="blur($event)"
				[(ngModel)]="formControl.value"
				[(durationUIType)]="durationUIType"
			></p-input>
			<hr>
			<p>
				${STORYBOOK_OUTPUT_FN('formControl.value')}
			</p>
			<p>
				${STORYBOOK_OUTPUT_FN('durationUIType')}
			</p>
			`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			formControl: new PFormControl({
				formState: {
					value: '',
					disabled: false,
				},
			}),
			type: PApiPrimitiveTypes.Duration,
			durationUIType: null as PInputComponent['durationUIType'],
			size: undefined as PInputComponent['size'],
			placeholder: '',
			blur: action('blur'),
		},
	}));
myStory
	.add('default', () => ({
		template: `
			<p-input
				[type]="type"
				[formControl]="formControl"
				[disabled]="false"
				[placeholder]="placeholder"
				[size]="size"
				[readMode]="false"
				(blur)="blur($event)"
			></p-input>
			<br>
			<p-input
				[type]="type"
				[ngModel]="formControl.value"
				[disabled]="true"
				[placeholder]="placeholder"
				[size]="size"
				[readMode]="false"
			></p-input>
			<br>
			<p-input
				[type]="type"
				[ngModel]="formControl.value"
				[disabled]="true"
				[placeholder]="placeholder"
				[size]="size"
				[readMode]="true"
			></p-input>
			<hr>
			${STORYBOOK_OUTPUT_FN('formControl.value')}
		`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			formControl: new PFormControl({
				formState: {
					value: '',
					disabled: false,
				},
			}),
			type: PApiPrimitiveTypes.string,
			size: undefined as unknown as PInputComponent['size'],
			placeholder: '',
			blur: action('blur'),
		},
	}));


let allTypesTemplate = '';

for (const type of Object.values(PApiPrimitiveTypes)) {
	if (type === PApiPrimitiveTypes.Date) continue;
	if (type === PApiPrimitiveTypes.ShiftId) continue;
	if (type === PApiPrimitiveTypes.any) continue;
	if (type === PApiPrimitiveTypes.DateTime) continue;
	if (type === PApiPrimitiveTypes.Id) continue;
	if (type === PApiPrimitiveTypes.Enum) continue;
	if (type === PApiPrimitiveTypes.boolean) continue;
	if (type === PApiPrimitiveTypes.DateExclusiveEnd) continue;
	if (type === PApiPrimitiveTypes.ApiList) continue;
	if (type === PApiPrimitiveTypes.Image) continue;
	allTypesTemplate += `
		<p-form-group class="col-12 col-md-6 col-lg-4" label="type ${type}">
			<p-input
				type="${type}"
				[formControl]="formControl"
				[placeholder]="placeholder"
				[size]="size"
				[readMode]="readMode"
				[cannotEditHint]="'Geht nicht. Admin ist schuld.'"
				[disabled]="disabled"
				[readMode]="false"
				durationUIType="${type === PApiPrimitiveTypes.Duration ? PApiPrimitiveTypes.Minutes : ''}"
			></p-input>
		</p-form-group>
	`;
}

const getTypeTemplate = (
	type : PApiPrimitiveTypes,
	locale ?: PInputComponent['locale'],
	placeholder ?: PInputComponent['placeholder'],
	durationUIType ?: PInputComponent['durationUIType'],
) : string => `
		<p-input
			type="${type}"
			locale="${locale ?? ''}"
			durationUIType="${durationUIType ?? ''}"
			placeholder="${placeholder ?? ''}"
			[formControl]="formControl"
			(blur)="blur($event)"
			(ngModelChange)="ngModelChange($event)"
		></p-input>
		<br>
		<p-input
			type="${type}"
			locale="${locale ?? ''}"
			durationUIType="${durationUIType ?? ''}"
			[ngModel]="formControl.value"
			[disabled]="true"
		></p-input>
		<hr>
		<p>
			${STORYBOOK_OUTPUT_FN('formControl.value')}
		</p>
		<p>
			${STORYBOOK_OBJECT_OUTPUT_FN('formControl.errors')}
		</p>
		${locale ? `
			<p>
				${STORYBOOK_OUTPUT_FN('locale', locale)}
			</p>
		` : ''}
	`;

myStory
	.add('all types', () => ({
		template: `<div class="row">${allTypesTemplate}</div>`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			formControl: new PFormControl({
				formState: {
					value: undefined,
					disabled: false,
				},
			}),
		},
	}))
	.add('all types disabled', () => ({
		template: `<div class="row">${allTypesTemplate}</div>`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			formControl: new PFormControl({
				formState: {
					value: undefined,
					disabled: true,
				},
			}),
			disabled: true,
			// cannotEditHint: 'Geht nicht. Admin ist schuld.',
			readMode: false,
		},
	}));

for (const enumValue of EnumUtils.getValues(PApiPrimitiveTypes)) {
	switch (enumValue) {
		case PApiPrimitiveTypes.Currency:
			myStory.add(`type="${PApiPrimitiveTypes.Currency}"`, () => ({
				template: `
					<p-input
						[type]="PApiPrimitiveTypes.Currency"
						[currencyCode]="getCurrencyCode(locale)"
						[locale]="locale"
						[formControl]="formControl"
					></p-input>
					<hr>
					${STORYBOOK_OUTPUT_FN('formControl.value')}
					<br>
					${STORYBOOK_OUTPUT_FN('locale')}
					<br>
					${STORYBOOK_OUTPUT_FN('getCurrencyCode(locale)')}
					<hr>
					<h6>Other currencies are possible</h6>
					<p-input
						[type]="PApiPrimitiveTypes.Currency"
						currencyCode="GBP"
						locale="en-GB"
						[formControl]="formControl"
					></p-input>
					<br>
					<p-input
						[type]="PApiPrimitiveTypes.Currency"
						currencyCode="CZK"
						locale="en-CZ"
						[formControl]="formControl"
					></p-input>
					<br>
					<h6>10.00 shows no trailing zeros by default</h6>
					<p-input
						[type]="PApiPrimitiveTypes.Currency"
						currencyCode="EUR"
						locale="de-DE"
						[ngModel]="10"
					>
						<p-input-append><span class="input-group-text">zzgl. MwSt.</span></p-input-append>
					</p-input>
					<br>
					<p-input
						[type]="PApiPrimitiveTypes.Currency"
						[ngModel]="formControl.value"
						[disabled]="true"
					>
						<p-input-append><span class="input-group-text">zzgl. MwSt.</span></p-input-append>
					</p-input>
					<br>
					<p-input
						[type]="PApiPrimitiveTypes.Currency"
						[ngModel]="formControl.value"
						[readMode]="true"
					>
						<p-input-append><span class="input-group-text">zzgl. MwSt.</span></p-input-append>
					</p-input>
				`,
				props: {
					stringify: STORYBOOK_STRINGIFY_FN,
					formControl: new PFormControl({
						formState: {
							value: 2 + 1.97, // NOTE: Result is 3.9699999999999998, because of floating point precision issue
							disabled: false,
						},
						validatorOrOpts: [(new ValidatorsService()).required(PApiPrimitiveTypes.number)],
					}),
					locale: PSupportedLocaleIds.de_DE,
					getCurrencyCode: (locale : PSupportedLocaleIds) => Config.getCurrencyCode(locale),
					PApiPrimitiveTypes: PApiPrimitiveTypes,
				},
			}));
			break;
		case PApiPrimitiveTypes.Days:
			myStory.add(`type="${PApiPrimitiveTypes.Days}"`, () => ({
				template: getTypeTemplate(PApiPrimitiveTypes.Days),
				props: {
					stringify: STORYBOOK_STRINGIFY_FN,
					formControl: new PFormControl({
						formState: {
							value: 345600000, // NOTE: 388800000 is 4 days
							disabled: false,
						},
						validatorOrOpts: [
							new ValidatorsService().required(PApiPrimitiveTypes.Days),
							new ValidatorsService().maxDecimalPlacesCount(0, PApiPrimitiveTypes.Days),
						].concat(
							new PFormControl(undefined!).getValidatorsForPrimitiveType(PApiPrimitiveTypes.Days),
						),
					}),
					blur: action('blur'),
					ngModelChange: action('ngModelChange'),
				},
			}));
			break;
		case PApiPrimitiveTypes.Duration:
			myStory.add(`type="${PApiPrimitiveTypes.Duration}"`, () => ({
				template: `
					<p-input
						[type]="PApiPrimitiveTypes.Duration"
						durationUIType="Minutes"
						[formControl]="formControl"
						[maxDecimalPlacesCount]="2"
					></p-input>
					<br>
					${STORYBOOK_OUTPUT_FN('formControl.value')}
					<hr>
					<p-input
						[type]="PApiPrimitiveTypes.Duration"
						[durationUIType]="PApiPrimitiveTypes.Hours"
						[formControl]="formControl"
					></p-input>
					<br>
					${STORYBOOK_OUTPUT_FN('formControl.value')}
					<hr>
					<p-input
						[type]="PApiPrimitiveTypes.Duration"
						durationUIType="Days"
						[formControl]="formControl"
					></p-input>
					<br>
					${STORYBOOK_OUTPUT_FN('formControl.value')}
				`,
				props: {
					stringify: STORYBOOK_STRINGIFY_FN,
					formControl: new PFormControl({
						formState: {
							value: 345600000, // NOTE: 388800000 is 4 days
							disabled: false,
						},
					}),
					blur: action('blur'),
					PApiPrimitiveTypes: PApiPrimitiveTypes,
				},
			}));
			break;
		case PApiPrimitiveTypes.Email:
			myStory.add(`type="${PApiPrimitiveTypes.Email}"`, () => ({
				template: getTypeTemplate(PApiPrimitiveTypes.Email),
				props: {
					stringify: STORYBOOK_STRINGIFY_FN,
					formControl: new PFormControl({
						formState: {
							value: 'peter@dr-plano.com',
							disabled: false,
						},
						validatorOrOpts: [( new ValidatorsService().email() )],
					}),
					type: PApiPrimitiveTypes.Email, // The first param of the knob function has to be exactly the same as the component input.
					blur: action('blur'),
					ngModelChange: action('ngModelChange'),
				},
			}));
			break;
		case PApiPrimitiveTypes.Hours:
			myStory.add(`type="${PApiPrimitiveTypes.Hours}"`, () => ({
				template: getTypeTemplate(PApiPrimitiveTypes.Hours),
				props: {
					stringify: STORYBOOK_STRINGIFY_FN,
					formControl: new PFormControl({
						formState: {
							value: 16200000, // NOTE: 16200000 is 4,5 hours
							disabled: false,
						},
					}),
					blur: action('blur'),
					ngModelChange: action('ngModelChange'),
				},
			}));
			break;
		case PApiPrimitiveTypes.LocalTime:
			myStory.add(`type="${PApiPrimitiveTypes.LocalTime}"`, () => ({
				template:
					getTypeTemplate(PApiPrimitiveTypes.LocalTime, PSupportedLocaleIds.de_DE) +
					getTypeTemplate(PApiPrimitiveTypes.LocalTime, PSupportedLocaleIds.en_GB),
				props: {
					stringify: STORYBOOK_STRINGIFY_FN,
					formControl: new PFormControl({
						formState: {
							value: 86340000, // NOTE: 16200000 is 4:30 am
							disabled: false,
						},
						validatorOrOpts: [(new ValidatorsService()).required(PApiPrimitiveTypes.LocalTime)],
					}),
					locale: PSupportedLocaleIds.de_DE,
					blur: action('blur'),
					ngModelChange: action('ngModelChange'),
				},
			}));
			break;
		case PApiPrimitiveTypes.Minutes:
			myStory.add(`type="${PApiPrimitiveTypes.Minutes}"`, () => ({
				template: getTypeTemplate(PApiPrimitiveTypes.Minutes),
				props: {
					stringify: STORYBOOK_STRINGIFY_FN,
					formControl: new PFormControl({
						formState: {
							value: 120,
							disabled: false,
						},
					}),
					blur: action('blur'),
					ngModelChange: action('ngModelChange'),
				},
			}));
			break;
		case PApiPrimitiveTypes.Password:
			myStory.add(`type="${PApiPrimitiveTypes.Password}"`, () => ({
				template: `
					<label>default</label>
					<p-input
						type="${PApiPrimitiveTypes.Password}"
						[formControl]="formControl"
					></p-input>
					<br>
					<label>[showPasswordMeter]="true"</label>
					<p-input
						type="${PApiPrimitiveTypes.Password}"
						[formControl]="formControl"
						[showPasswordMeter]="true"
					></p-input>
					<br>
					<p-input
						type="${PApiPrimitiveTypes.Password}"
						[ngModel]="formControl.value"
						[disabled]="true"
					></p-input>
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
							value: 'foo1234baR',
							disabled: false,
						},
						validatorOrOpts: [( new ValidatorsService().password() )],
					}),
					type: PApiPrimitiveTypes.Password, // The first param of the knob function has to be exactly the same as the component input.
				},
			}));
			break;
		case PApiPrimitiveTypes.Search:
			myStory.add(`type="${PApiPrimitiveTypes.Search}"`, () => ({
				template: getTypeTemplate(PApiPrimitiveTypes.Search, undefined, `Such hier doch mal was...`),
				props: {
					stringify: STORYBOOK_STRINGIFY_FN,
					formControl: new PFormControl({
						formState: {
							value: '',
							disabled: false,
						},
					}),
					type: PApiPrimitiveTypes.Search, // The first param of the knob function has to be exactly the same as the component input.
					blur: action('blur'),
					ngModelChange: action('ngModelChange'),
				},
			}));
			break;
		case PApiPrimitiveTypes.Tel:
			myStory.add(`type="${PApiPrimitiveTypes.Tel}"`, () => ({
				template: getTypeTemplate(PApiPrimitiveTypes.Tel),
				props: {
					stringify: STORYBOOK_STRINGIFY_FN,
					formControl: new PFormControl({
						formState: {
							value: '+49 176 12345678', // NOTE: 16200000 is 4,5 hours
							disabled: false,
						},
					}),
					blur: action('blur'),
					ngModelChange: action('ngModelChange'),
				},
			}));
			break;
		case PApiPrimitiveTypes.Years:
			myStory.add(`type="${PApiPrimitiveTypes.Years}"`, () => ({
				template: getTypeTemplate(PApiPrimitiveTypes.Years),
				props: {
					stringify: STORYBOOK_STRINGIFY_FN,
					formControl: new PFormControl({
						formState: {
							value: undefined,
							disabled: false,
						},
					}),
					blur: action('blur'),
					ngModelChange: action('ngModelChange'),
				},
			}));
			break;
		case PApiPrimitiveTypes.string:
			myStory.add(`type="${enumValue}"`, () => ({
				template: getTypeTemplate(enumValue),
				props: {
					stringify: STORYBOOK_STRINGIFY_FN,
					formControl: new PFormControl({
						formState: {
							value: undefined,
							disabled: false,
						},
					}),
					blur: action('blur'),
					ngModelChange: action('ngModelChange'),
				},
			}));
			break;
		case PApiPrimitiveTypes.ApiList:
		case PApiPrimitiveTypes.Bic:
		case PApiPrimitiveTypes.Date:
		case PApiPrimitiveTypes.DateExclusiveEnd:
		case PApiPrimitiveTypes.DateTime:
		case PApiPrimitiveTypes.Enum:
		case PApiPrimitiveTypes.Iban:
		case PApiPrimitiveTypes.Id:
		case PApiPrimitiveTypes.Image:
		case PApiPrimitiveTypes.Integer:
		case PApiPrimitiveTypes.Months:
		case PApiPrimitiveTypes.PostalCode:
		case PApiPrimitiveTypes.ShiftId:
		case PApiPrimitiveTypes.Url:
		case PApiPrimitiveTypes.any:
		case PApiPrimitiveTypes.boolean:
		case PApiPrimitiveTypes.number:
		case PApiPrimitiveTypes.Percent:
		case PApiPrimitiveTypes.ShiftSelector:
			myStory.add(`type="${enumValue}"`, () => ({
				template: '<p-todo>Story not implemented yet</p-todo>',
			}));
			break;
	}
}




myStory
	// eslint-disable-next-line literal-blacklist/literal-blacklist
	.add('[inputGroupAppendText]="text"', () => ({
		template: `
			<p-input
				[type]="PApiPrimitiveTypes.Duration"
				durationUIType="Days"
				[inputGroupAppendText]="text"
			></p-input>
			<br>
		`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			text: 'Tage vorher',
		},
	}))
	// eslint-disable-next-line literal-blacklist/literal-blacklist
	.add('[typeahead]="someArray"', () => ({
		template: `
			<p>Please type something…</p>
			<p-input
				[typeahead]="someArray"
				[typeaheadMinLength]="0"
				[formControl]="formControl"
			></p-input>
			<p-input
				[formControl]="formControl"
			></p-input>
			<p-input
				[formControl]="formControl"
				[disabled]="true"
			></p-input>
			<hr>
			${STORYBOOK_OUTPUT_FN('formControl.value')}
		`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			// eslint-disable-next-line literal-blacklist/literal-blacklist
			someArray: ['foo', 'bar', 'lorem', 'ipsum'],
			formControl: new PFormControl({
				formState: {
					value: 'foo',
					disabled: false,
				},
			}),
		},
	}))
	.add('validation', () => ({
		template: `
			<p-form-group
				label="Foo Bar"
				[control]="formControl2"
			>
				<p-input
					[formControl]="ormControl2"
				></p-input>
			</p-form-group>
			<span>errors:<br><pre>{{stringify(formControl2.errors)}}</pre></span>
			<hr>
			<p-form-group
				label="Foo Bar"
				[control]="formControl"
			>
				<p-input
					[formControl]="formControl"
				></p-input>
			</p-form-group>
			<span>errors:<br><pre>{{stringify(formControl.errors)}}</pre></span>
		`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			formControl: new PFormControl({
				formState: {
					value: 'Zwölf uhr dreißig',
					disabled: false,
				},
				validatorOrOpts :[
					(new ValidatorsService()).required(PApiPrimitiveTypes.string),
					(new ValidatorsService()).maxDecimalPlacesCount(0, PApiPrimitiveTypes.string),
					(new ValidatorsService()).number(PApiPrimitiveTypes.string),
					(new ValidatorsService()).currency(),
					(new ValidatorsService()).maxLength(2, PApiPrimitiveTypes.string),
				],
			}),
			formControl2: new PFormControl({
				formState: {
					value: 2,
					disabled: false,
				},
				validatorOrOpts: [
					(new ValidatorsService()).greaterThan(2.2, PApiPrimitiveTypes.Currency),
					(new ValidatorsService()).min(3, true, PApiPrimitiveTypes.Currency),
				],
			}),
		},
	}));
myStory
	.add('validation min duration', () => ({
		template: `
			<p-form-group
				label="Foo Bar"
				[control]="formControl"
			>
				<p-input
					[formControl]="formControl"
				></p-input>
			</p-form-group>
			<span>errors:<br><pre>{{stringify(formControl.errors)}}</pre></span>
		`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			formControl: new PFormControl({
				formState: {
					value: 'Zwölf uhr dreißig',
					disabled: false,
				},
				validatorOrOpts: [
					(new ValidatorsService()).min(360000, true, PApiPrimitiveTypes.Duration),
				],
			}),
		},
	}));

myStory
	.add('with [(formControl)]', () => ({
		template: `
			<p-input
				[type]="type"
				[formControl]="formControl"
				[placeholder]="placeholder"
				[size]="size"
				[readMode]="readMode"
			></p-input>
			<br>
			<p-checkbox [ngModel]="disabled" (ngModelChange)="$event ? formControl.disable() : formControl.enable()" valueText="Input disabled"></p-checkbox>
			<hr>
			<p-input
				[type]="type"
				[formControl]="formControl"
				[disabled]="disabled"
				[placeholder]="placeholder"
				[size]="size"
				[readMode]="readMode"
			></p-input>
			<br>
			<p-checkbox [ngModel]="disabled" (ngModelChange)="disabled=$event" valueText="Input disabled"></p-checkbox>
			<hr>
			${STORYBOOK_OUTPUT_FN('formControl.value')}
		`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			formControl: new PFormControl({
				formState: {
					value: '',
					disabled: false,
				},
			}),
			disabled: false,
			type: PApiPrimitiveTypes.string,
			size: undefined as unknown as PInputComponent['size'],
			placeholder: '',
			readMode: false,
		},
	}));

myStory
	.add('with ngModel', () => ({
		template: `
			<p-input
				[type]="type"
				[(ngModel)]="model"
				[disabled]="false"
				[placeholder]="placeholder"
				[size]="size"
				[readMode]="readMode"
			></p-input>
			<br>
			<p-input
				[type]="type"
				[(ngModel)]="model"
				[disabled]="true"
				[placeholder]="placeholder"
				[size]="size"
				[readMode]="readMode"
			></p-input>
			<hr>
			${STORYBOOK_OUTPUT_FN('model')}
		`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			model: '',
			type: PApiPrimitiveTypes.string,
			size: undefined as unknown as PInputComponent['size'],
			placeholder: '',
			readMode: false,
		},
	})).add('with editable', () => ({
		template: `
		<p-input
			[pEditable]="true"
			[api]="api"

			[type]="type"
			[(ngModel)]="model"
			[disabled]="false"
			[placeholder]="placeholder"
			[size]="size"
			[readMode]="readMode"
		></p-input>
		<br>
		<p-input
			[type]="type"
			[(ngModel)]="model"
			[disabled]="true"
			[placeholder]="placeholder"
			[size]="size"
			[readMode]="readMode"
		></p-input>
		<hr>
		${STORYBOOK_OUTPUT_FN('model')}
		`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			model: '',
			type: PApiPrimitiveTypes.string,
			size: undefined as unknown as PInputComponent['size'],
			placeholder: '',
			readMode: false,
			api: fakeApi,
		},
	}));

myStory
	.add('with dropdown-items', () => ({
		template: `
			<p-input
				[type]="type"
				[(ngModel)]="model"
				[(dropdownValue)]="dropdownValue"
				[durationUIType]="dropdownValue"
				[disabled]="false"
				[placeholder]="placeholder"
				[size]="size"
				[readMode]="readMode"
			>
				<p-dropdown-item
					[value]="primitiveTypes.Minutes"
					label="{{primitiveTypes.Minutes}}"
				></p-dropdown-item>
				<p-dropdown-item
					[value]="primitiveTypes.Hours"
					label="{{primitiveTypes.Hours}}"
				></p-dropdown-item>
				<p-dropdown-item
					[value]="null"
					(onClick)="model=-1"
					label="Unbegrenzt"
				></p-dropdown-item>
			</p-input>
			<hr>
			${STORYBOOK_OUTPUT_FN('model')}
			<hr>
			${STORYBOOK_OUTPUT_FN('dropdownValue')}
		`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			model: 7200000,
			dropdownValue: PApiPrimitiveTypes.Minutes,
			primitiveTypes: PApiPrimitiveTypes,
			type: PApiPrimitiveTypes.Duration,
			size: BOOTSTRAP_SIZES.lg,
			placeholder: '',
			readMode: false,
		},
	}))
	.add('with editable', () => ({
		template: `
		<p-input
			[pEditable]="true"
			[api]="api"

			[type]="type"
			[(ngModel)]="model"
			[disabled]="false"
			[placeholder]="placeholder"
			[size]="size"
			[readMode]="readMode"
		></p-input>
		<br>
		<p-input
			[type]="type"
			[(ngModel)]="model"
			[disabled]="true"
			[placeholder]="placeholder"
			[size]="size"
			[readMode]="readMode"
		></p-input>
		<hr>
		${STORYBOOK_OUTPUT_FN('model')}
		`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			model: '',
			type: PApiPrimitiveTypes.string,
			size: undefined as unknown as PInputComponent['size'],
			placeholder: '',
			readMode: false,
			api: fakeApi,
		},
	}))
	.add('with content', () => ({
		template: `
		<p-input
			[pEditable]="true"
			[api]="api"

			[type]="type"
			[(ngModel)]="model"
			[disabled]="false"
			[placeholder]="placeholder"
			[size]="size"
			[readMode]="readMode"
			#foo
		>Test content here. <strong>Value is »{{foo.value ? foo.value : 'undefined'}}«</strong></p-input>
		`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			model: '',
			type: PApiPrimitiveTypes.string,
			size: undefined as unknown as PInputComponent['size'],
			placeholder: '',
			readMode: false,
			api: fakeApi,
		},
	}));
