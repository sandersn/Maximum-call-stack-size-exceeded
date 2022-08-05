import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { SchedulingApiRoot } from '@plano/shared/api';
import { ApiAttributeInfo } from '@plano/shared/api/base/api-attribute-info';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PTabSizeEnum } from './p-tab/p-tab.component';
import { PTabsTheme } from './p-tabs.component';
import { BootstrapSize } from '../../bootstrap-styles.enum';
import { PFormsModule } from '../../p-forms/p-forms.module';
import { PTabsModule } from '../p-tabs.module';

const getTemplate = ({ theme = PTabsTheme.DEFAULT, darkMode, isLoading } : {
	theme : PTabsTheme,
	darkMode ?: boolean,
	isLoading ?: boolean,
}) : string => `
	<p-tabs
		[tryToStickButtonsToBottom]="tryToStickButtonsToBottom"
		[size]="size"
		[darkMode]="${darkMode}"
		[isLoading]="${isLoading}"
		[theme]="${theme}"
		[showIconOnlyBtns]="showIconOnlyBtns"
	>
		<p-tab
			[attributeInfo]="attributeInfo"
			class="${darkMode ? 'text-white' : ''}"
			label="Dein Schreibtisch"
			icon="star"
			(select)="select1($event)"
		>
			<h4
				class="${darkMode ? 'text-white' : ''}"
			>Foo Bar</h4>
			<p>Reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id.</p>
		</p-tab>
		<p-tab
			[attributeInfo]="attributeInfo"
			class="${darkMode ? 'text-white' : ''}"
			[label]="labelTab1"
			icon="hand-spock"
			[hasFilter]="true"
			(select)="select2($event)"
		>
			<h3
				class="${darkMode ? 'text-white' : ''}"
			>Hallo Welt</h3>
			<ul>
				<li>Es geht mir gut, ich mein' es könnte weiß Gott schlimmer sein</li>
				<li>Klar es kommt vor man schließt sich in sein Zimmer ein</li>
				<li>Samt Depri-Mucke und Spinnereien</li><li>Und findet alles nur noch so höchstens zweite bis dritte Wahl</li>
				<li>So zwischen ganz toll und irgendwie widerlich wie'n Mittelstrahl</li>
			</ul>
		</p-tab>
		<p-tab
			[attributeInfo]="attributeInfo"
			class="${darkMode ? 'text-white' : ''}"
			[label]="labelTab2"
			[hasDanger]="true"
			icon="store"
			(select)="select3($event)"
		>
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
			<p-form-group
				[hasDanger]="true"
				label="First Name"
			>
				<p-input
					[required]="true"
					[checkTouched]="true"
				></p-input>
				<p-validation-hint
					[isInvalid]="true"
					[checkTouched]="false"
				></p-validation-hint>
			</p-form-group>
		</p-tab>
		<p-tab
			[attributeInfo]="attributeInfo"
			class="${darkMode ? 'text-white' : ''}"
			[label]="labelTab2"
			[badgeContent]="true"
			icon="store"
			(select)="select3($event)"
		>
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
			<p-form-group
				[hasDanger]="true"
				label="First Name"
			>
				<p-input
					[required]="true"
					[checkTouched]="true"
				></p-input>
				<p-validation-hint
					[isInvalid]="true"
					[checkTouched]="false"
				></p-validation-hint>
			</p-form-group>
		</p-tab>
	</p-tabs>
`;

const TEMPLATE = (
	// eslint-disable-next-line prefer-template
	`<div class="bg-light p-3">` +
	getTemplate({
		theme: PTabsTheme.CLEAN,
	}) +
	getTemplate({
		theme: PTabsTheme.DEFAULT,
	}) +
	getTemplate({
		theme: PTabsTheme.DEFAULT,
		darkMode: true,
	}) +
	getTemplate({
		theme: PTabsTheme.DEFAULT,
		darkMode: true,
		isLoading: true,
	}) +
	'</div>'
);

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
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	validations: function(this : SchedulingApiRoot) {
		return [
			() => VALIDATORS.required(PApiPrimitiveTypes.boolean),
		];
	},
	vars: {},
});


const myStory = storiesOf('Client/PTabs/p-tabs', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PFormsModule,
				PTabsModule,
			],
		}),
	);
myStory
	.add('default', () => ({
		template: TEMPLATE,
		props: {
			attributeInfo: AI,
			labelTab1: 'Test Nr. 1',
			labelTab2: 'Test Nr. 2',
			tryToStickButtonsToBottom: true,
			showIconOnlyBtns: undefined as unknown as boolean,
			size: undefined as unknown as BootstrapSize,
			select1: action('select1'),
			select2: action('select2'),
			select3: action('select3'),
		},
	}));
myStory
	.add('tryToStickButtonsToBottom false', () => ({
		template: TEMPLATE,
		props: {
			attributeInfo: AI,
			labelTab1: 'Test Nr. 1',
			labelTab2: 'Test Nr. 2',
			tryToStickButtonsToBottom: false,
			showIconOnlyBtns: undefined as unknown as boolean,
			size: undefined as unknown as BootstrapSize,
			select1: action('select1'),
			select2: action('select2'),
			select3: action('select3'),
		},
	}));
myStory
	.add('flexible buttons', () => ({
		template: TEMPLATE,
		props: {
			attributeInfo: AI,
			labelTab1: 'Test Nr. 1',
			labelTab2: 'Test Nr. 2',
			tryToStickButtonsToBottom: true,
			showIconOnlyBtns: true,
			size: undefined as unknown as BootstrapSize,
			select1: action('select1'),
			select2: action('select2'),
			select3: action('select3'),
		},
	}));
myStory
	.add(`size 'sm'`, () => ({
		template: TEMPLATE,
		props: {
			attributeInfo: AI,
			labelTab1: 'Test Nr. 1',
			labelTab2: 'Test Nr. 2',
			tryToStickButtonsToBottom: true,
			showIconOnlyBtns: true,
			size: BootstrapSize.SM,
			select1: action('select1'),
			select2: action('select2'),
			select3: action('select3'),
		},
	}));

myStory
	.add(`size 'sm' + flex`, () => ({
		template: TEMPLATE,
		props: {
			attributeInfo: AI,
			labelTab1: 'Tätigkeiten',
			labelTab2: 'User',
			tryToStickButtonsToBottom: true,
			showIconOnlyBtns: true,
			size: BootstrapSize.SM,
			select1: action('select1'),
			select2: action('select2'),
			select3: action('select3'),
		},
	}));


myStory
	.add(`pageSubNav: true`, () => ({
		template: `
		<p-tabs
			[theme]="${PTabsTheme.CLEAN}"
			[pageSubNav]="true"
		>
			<p-tab
				[attributeInfo]="null"
				label="Dein Schreibtisch"
			>
				<h4
				>Foo Bar</h4>
				<p>Reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id.</p>
			</p-tab>
			<p-tab
				[attributeInfo]="null"
				label="Tätigkeiten"
			>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
				<p-form-group
					[hasDanger]="true"
					label="First Name"
				>
					<p-input
						[required]="true"
						[checkTouched]="true"
					></p-input>
					<p-validation-hint
						[isInvalid]="true"
						[checkTouched]="false"
					></p-validation-hint>
				</p-form-group>
			</p-tab>
			<p-tab
				[attributeInfo]="null"
				label="Mitarbeitende"
			>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
				<p-form-group
					[hasDanger]="true"
					label="First Name"
				>
					<p-input
						[required]="true"
						[checkTouched]="true"
					></p-input>
					<p-validation-hint
						[isInvalid]="true"
						[checkTouched]="false"
					></p-validation-hint>
				</p-form-group>
			</p-tab>
		</p-tabs>
		`,
		props: {
			pageSubNav: true,
		},
	}));

myStory
	.add(`main-sidebar`, () => ({
		template: `
			<div class="bg-dark">
				<p-tabs
					class="m-0 rounded-0 flex-grow-1 o-hidden"
					[card]="false"
					[size]="BootstrapSize.SM"
					[tryToStickButtonsToBottom]="true"
					[minHeaderTabBar]="46"
					[showIconOnlyBtns]="true"
					[darkMode]="true"
					[isLoading]="false"
					[noWrap]="true"
				>
					<p-tab
						[attributeInfo]="null"
						label="Dein Schreibtisch" i18n-label
						class="p-3"
						icon="inbox"
						size="${PTabSizeEnum.FRAMELESS}"
					>
						TEst
					</p-tab>
					<p-tab
						[attributeInfo]="null"
						label="Tätigkeiten" i18n-label
						icon="${PlanoFaIconPool.ITEMS_SHIFT_MODELS}"
						size="${PTabSizeEnum.FRAMELESS}"
					>
						Lorem
					</p-tab>
					<p-tab
						[attributeInfo]="null"
						label="User" i18n-label
						icon="users"
						size="${PTabSizeEnum.FRAMELESS}"
					>
						Members
					</p-tab>
				</p-tabs>
			</div>
		`,
		props: {
		},
	}));
