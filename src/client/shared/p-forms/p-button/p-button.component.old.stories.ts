import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { SchedulingApiRoot } from '@plano/shared/api';
import { ApiAttributeInfo } from '@plano/shared/api/base/api-attribute-info';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PButtonType } from './p-button.component';
import { PButtonComponent} from './p-button.component';
import { PBtnThemeEnum, PThemeEnum } from '../../bootstrap-styles.enum';
import { PBtnTheme as PButtonTheme} from '../../bootstrap-styles.enum';
import { BOOTSTRAP_SIZES } from '../../p-no-items/p-no-item/p-no-item.component.stories';
import { PBadgeComponentInterface } from '../../shared/p-badge/p-badge.types';
import { SharedModule } from '../../shared/shared.module';
import { PFormsModule } from '../p-forms.module';

const myStory = storiesOf('Client/PForms/p-button', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PFormsModule,
				SharedModule,
			],
			declarations: [
			],
		}),
	);

const getTemplate = (type : PButtonTheme | PBtnThemeEnum) : string => `
	<div class="d-flex justify-content-between">
			<p-button
				class="m-3"
				[attributeInfo]="attributeInfo"
				[badge]="badge"
				[badgeAlign]="badgeAlign"
				[size]="size"
				theme="${type}"
				[buttonType]="buttonType"
				[icon]="icon"
				[isActiveButton]="false"
				(triggerClick)="triggerClick($event)"
				[darkMode]="darkMode"
			>${type}</p-button>
			<p-button
				class="m-3"
				[attributeInfo]="attributeInfo"
				[badge]="badge"
				[badgeAlign]="badgeAlign"
				[size]="size"
				theme="${type}"
				[buttonType]="buttonType"
				[icon]="icon"
				(triggerClick)="triggerClick($event)"
				[darkMode]="darkMode"
				[isActiveButton]="true"
			>${type}</p-button>
			<p-button
				class="m-3"
				[attributeInfo]="attributeInfo"
				[badge]="badge"
				[badgeAlign]="badgeAlign"
				[size]="size"
				theme="${type}"
				[buttonType]="buttonType"
				[icon]="icon"
				(triggerClick)="triggerClick($event)"
				[darkMode]="darkMode"
				[isActiveButton]="true"
				[disabled]="true"
			>${type}</p-button>
		</div>
	`;

const getAllButtonTemplates = () : string => {
	let allButtons = '';
	allButtons += `
		<div class="d-flex justify-content-between bg-light p-1 my-1">
			<label class="m-0">Passiv</label>
			<label class="m-0">Active <span *ngIf="buttonType==='toggle'">Tgl</span></label>
			<label class="m-0">Disabled</label>
		</div>
	`;

	for (const type of Object.values(PThemeEnum)) allButtons += getTemplate(type);
	for (const type of Object.values(PBtnThemeEnum)) allButtons += getTemplate(type);

	allButtons += `
		<div class="">
			<label class="m-0">darkMode is on</label>
			<p>{{darkMode ? '✓' : '×'}}</p>
		</div>
	`;

	return allButtons;
};

myStory
	.add('default', () => ({
		template: `<div class="d-flex justify-content-center"><div>${getAllButtonTemplates()}</div></div>`,
		props: {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			attributeInfo: null as unknown as ApiAttributeInfo<any, any>,
			badge: 123,
			text: 'Hallo Welt',
			badgeAlign: 'right' as PBadgeComponentInterface['align'],
			size: undefined as unknown as PButtonComponent['size'],
			triggerClick: action('triggerClick'),
			buttonType: PButtonType.DEFAULT,
			isActiveButton: false,
			darkMode: undefined as unknown as PButtonComponent['darkMode'],
		},
	}));
myStory
	.add(`size 'sm'`, () => ({
		template: `<div class="d-flex justify-content-center"><div>${getAllButtonTemplates()}</div></div>`,
		props: {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			attributeInfo: null as unknown as ApiAttributeInfo<any, any>,
			badge: true,
			text: 'Hallo Welt',
			badgeAlign: 'right' as PBadgeComponentInterface['align'],
			size: BOOTSTRAP_SIZES.sm,
			triggerClick: action('triggerClick'),
			buttonType: PButtonType.DEFAULT,
			isActiveButton: false,
			darkMode: undefined as unknown as PButtonComponent['darkMode'],
		},
	}));

myStory
	.add('darkMode true', () => ({
		template: `<div class="d-flex justify-content-center bg-dark"><div>${getAllButtonTemplates()}</div></div>`,
		props: {
			attributeInfo: null as PButtonComponent['attributeInfo'],
			badge: 123,
			text: 'Hallo Welt',
			badgeAlign: 'right' as PButtonComponent['badgeAlign'],
			size: undefined as unknown as PButtonComponent['size'],
			triggerClick: action('triggerClick'),
			buttonType: PButtonType.DEFAULT,
			isActiveButton: false,
			darkMode: true,
		},
	}));

const VALIDATORS = new ValidatorsService();
const apiObjectWrapper = new SchedulingApiRoot(null);
const AI = new ApiAttributeInfo<SchedulingApiRoot, unknown>({
	apiObjWrapper: apiObjectWrapper,
	id: 'FOO',
	name: 'foo',
	canEdit: () => false,
	primitiveType: PApiPrimitiveTypes.boolean,
	readMode: null,
	show: () => true,
	validations: () => {
		return [
			() => VALIDATORS.required(PApiPrimitiveTypes.boolean),
		];
	},
	vars: {},
});


myStory
	.add('attributeInfo', () => ({
		template: `<div class="d-flex justify-content-center" style="background-color: #777 !important;"><div>${getAllButtonTemplates()}</div></div>`,
		props: {
			attributeInfo: AI,
			badge: undefined as unknown as PButtonComponent['badge'],
			text: 'Hallo Welt',
			badgeAlign: 'right' as PBadgeComponentInterface['align'],
			size: undefined as unknown as PButtonComponent['size'],
			triggerClick: action('triggerClick'),
			buttonType: PButtonType.DEFAULT,
			isActiveButton: false,
			darkMode: false,
		},
	}));
myStory
	.add('PButtonType.TOGGLE', () => ({
		template: `<div class="d-flex justify-content-center"><div>${getAllButtonTemplates()}</div></div>`,
		props: {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			attributeInfo: null as unknown as ApiAttributeInfo<any, any>,
			badge: undefined as unknown as PButtonComponent['badge'],
			text: 'Hallo Welt',
			badgeAlign: 'right' as PBadgeComponentInterface['align'],
			size: undefined as unknown as PButtonComponent['size'],
			triggerClick: action('triggerClick'),
			buttonType: PButtonType.TOGGLE,
			icon: 'filter',
			isActiveButton: false,
			darkMode: false,
		},
	}));
myStory
	.add('PButtonType.TOGGLE darkMode', () => ({
		template: `<div class="d-flex justify-content-center bg-dark"><div>${getAllButtonTemplates()}</div></div>`,
		props: {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			attributeInfo: null as unknown as ApiAttributeInfo<any, any>,
			badge: undefined as unknown as PButtonComponent['badge'],
			text: 'Hallo Welt',
			badgeAlign: 'right' as PBadgeComponentInterface['align'],
			size: undefined as unknown as PButtonComponent['size'],
			triggerClick: action('triggerClick'),
			buttonType: PButtonType.TOGGLE,
			icon: 'filter',
			isActiveButton: false,
			darkMode: true,
		},
	}));
myStory
	.add('PButtonType.FILTER', () => ({
		template: `<div class="d-flex justify-content-center"><div>${getAllButtonTemplates()}</div></div>`,
		props: {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			attributeInfo: null as unknown as ApiAttributeInfo<any, any>,
			badge: undefined as unknown as PButtonComponent['badge'],
			text: 'Hallo Welt',
			badgeAlign: 'right' as PBadgeComponentInterface['align'],
			size: undefined as unknown as PButtonComponent['size'],
			triggerClick: action('triggerClick'),
			buttonType: PButtonType.FILTER,
			isActiveButton: false,
			darkMode: false,
		},
	}));
myStory
	.add('PButtonType.FILTER darkMode', () => ({
		template: `<div class="d-flex justify-content-center bg-dark"><div>${getAllButtonTemplates()}</div></div>`,
		props: {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			attributeInfo: null as unknown as ApiAttributeInfo<any, any>,
			badge: undefined as unknown as PButtonComponent['badge'],
			text: 'Hallo Welt',
			badgeAlign: 'right' as PBadgeComponentInterface['align'],
			size: undefined as unknown as PButtonComponent['size'],
			triggerClick: action('triggerClick'),
			buttonType: PButtonType.FILTER,
			isActiveButton: false,
			darkMode: true,
		},
	}));
myStory
	.add('with badge inside', () => ({
		template: `<p-button [attributeInfo]="null" style="outline-primary"><fa-icon icon="filter"></fa-icon><span>&nbsp;</span><p-badge [theme]="PThemeEnum.PRIMARY" [content]="true"></p-badge></p-button>`,
	}));
