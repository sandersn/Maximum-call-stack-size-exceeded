/* eslint-disable unicorn/no-unused-properties */
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { STORYBOOK_FORM_CONTROL_VALUE_OUTPUT, STORYBOOK_STRINGIFY_FN } from '@plano/storybook/storybook.utils';
import { DropdownTypeEnum } from './p-dropdown.component';
import { FaIcon } from '../../../../shared/core/component/fa-icon/fa-icon-types';
import { ClientSharedComponentsModule } from '../../component/client-shared-components.module';
import { PFormControl } from '../p-form-control';
import { PFormsModule } from '../p-forms.module';

const dropdownTypes : {
	[K in DropdownTypeEnum] : DropdownTypeEnum;
} = {
	[DropdownTypeEnum.BUTTONS]: DropdownTypeEnum.BUTTONS,
	[DropdownTypeEnum.FILTER]: DropdownTypeEnum.FILTER,
	[DropdownTypeEnum.MULTI_SELECT]: DropdownTypeEnum.MULTI_SELECT,
	[DropdownTypeEnum.TOGGLE]: DropdownTypeEnum.TOGGLE,
};

const myStory = storiesOf('Client/PForms/p-dropdown', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PFormsModule,
				NgbModalModule,
				ClientSharedComponentsModule,
			],
			providers: [
			],
		}),
	);
myStory
	.add('default', () => ({
		template: `
		<div class="d-flex flex-column justify-content-center">
			<p-dropdown
				[formControl]="formControl"
				[size]="size"
				[label]="label"
				[icon]="icon"
				[dropdownType]="dropdownType"
				[dropdownMenuVisible]="true"
				(focus)="focus($event)"
				(blur)="blur($event)"
				(onSelect)="onSelect($event)"
			>
				<p-dropdown-item [label]="item1Label" [value]="'value1'"></p-dropdown-item>
				<p-dropdown-item [label]="item2Label" [value]="'value2'"></p-dropdown-item>
			</p-dropdown>
			<br>
			<p-dropdown
				[disabled]="true"
				[ngModel]="formControl.value"
				[size]="size"
				[label]="label"
				[icon]="icon"
				[dropdownType]="dropdownType"
				(focus)="focus($event)"
				(blur)="blur($event)"
				(onSelect)="onSelect($event)"
			>
				<p-dropdown-item [label]="item1Label" [value]="'value1'"></p-dropdown-item>
				<p-dropdown-item [label]="item2Label" [value]="'value2'"></p-dropdown-item>
			</p-dropdown>
			<br>
			<p-dropdown
				[disabled]="true"
				[readMode]="true"
				[ngModel]="formControl.value"
				[size]="size"
				[label]="label"
				[icon]="icon"
				[dropdownType]="dropdownType"
				(focus)="focus($event)"
				(blur)="blur($event)"
				(onSelect)="onSelect($event)"
			>
				<p-dropdown-item [label]="item1Label" [value]="'value1'"></p-dropdown-item>
				<p-dropdown-item [label]="item2Label" [value]="'value2'"></p-dropdown-item>
			</p-dropdown>
			<hr>
			${STORYBOOK_FORM_CONTROL_VALUE_OUTPUT}
		</div>
		`,
		props: {
			formControl: new PFormControl({
				formState: {
					value: 'value2',
					disabled: false,
				},
			}),
			size: 'md',
			label: '',
			item1Label: 'Hallo Welt 1',
			item2Label: 'Hallo Welt 2',
			icon: undefined as unknown as FaIcon,
			focus: action('focus'),
			blur: action('blur'),
			onSelect: action('onSelect'),
			dropdownType: dropdownTypes.toggle,
			stringify: STORYBOOK_STRINGIFY_FN,
		},
	}));

myStory
	.add('multi-select', () => ({
		template: `
		<div class="d-flex flex-column justify-content-center">
			<p-dropdown
				[formControl]="ormControl"
				[size]="size"
				label="Filter"
				[icon]="icon"
				[dropdownType]="dropdownType"
				[dropdownMenuVisible]="true"
			>
				<p-dropdown-item
					[label]="item1Label"
				></p-dropdown-item>
				<p-dropdown-item
					[label]="item2Label"
					description="Lorem ipsum"
				></p-dropdown-item>
				<p-dropdown-item
					label="Verstecktes dropdown item"
					description="Sollte nicht sichtbar sein"
					[canEdit]="true"
					[show]="false"
				></p-dropdown-item>
			</p-dropdown>
			<hr>
			${STORYBOOK_FORM_CONTROL_VALUE_OUTPUT}
		</div>
		`,
		props: {
			formControl: new PFormControl({
				formState: {
					value: undefined,
					disabled: false,
				},
			}),
			size: 'md',
			item1Label: 'Hallo Welt 1',
			item2Label: 'Hallo Welt 2',
			dropdownType: dropdownTypes.multiSelect,
			stringify: STORYBOOK_STRINGIFY_FN,
		},
	}));

myStory
	.add('filter', () => ({
		template: `
		<div class="d-flex flex-column justify-content-center">
			<p-dropdown
				[formControl]="ormControl"
				[size]="size"
				label="Filter"
				[icon]="icon"
				[dropdownType]="dropdownType"
				[dropdownMenuVisible]="true"
			>
				<p-dropdown-item
					[active]="true"
					[label]="item1Label"
				></p-dropdown-item>
				<p-dropdown-item
					[active]="true"
					[label]="item2Label"
					description="Lorem ipsum"
				></p-dropdown-item>
			</p-dropdown>
			<p-dropdown
				[formControl]="ormControl"
				[size]="BootstrapSize.SM"
				label="Filter"
				[icon]="icon"
				[dropdownType]="dropdownType"
				[dropdownMenuVisible]="true"
			>
				<p-dropdown-item
					[active]="true"
					[label]="item1Label"
				></p-dropdown-item>
				<p-dropdown-item
					[active]="true"
					[label]="item2Label"
					description="Lorem ipsum"
				></p-dropdown-item>
			</p-dropdown>
			<hr>
			${STORYBOOK_FORM_CONTROL_VALUE_OUTPUT}
		</div>
		`,
		props: {
			formControl: new PFormControl({
				formState: {
					value: undefined,
					disabled: false,
				},
			}),
			size: 'md',
			item1Label: 'Ferien & Feiertage',
			item2Label: 'Abwesenheiten',
			item2: 'Abwesenheiten',
			dropdownType: dropdownTypes.filter,
			icon: PlanoFaIconPool.FILTER,
			stringify: STORYBOOK_STRINGIFY_FN,
		},
	}));

myStory
	.add('with description', () => ({
		template: `
		<div class="d-flex flex-column justify-content-center">
			<p-dropdown
				[size]="size"
				[label]="label"
				[icon]="icon"
				[dropdownType]="dropdownType"
				[dropdownMenuVisible]="true"
			>
				<p-dropdown-item
					[label]="item1Label"
					description="Lorem ipsum"
					icon="pen"
				></p-dropdown-item>
				<p-dropdown-item
					[label]="item2Label"
					description="Lorem ipsum"
					icon="eye"
				></p-dropdown-item>
			</p-dropdown>
		</div>
		`,
		props: {
			label: '',
			item1Label: 'Hallo Welt 1',
			item2Label: 'Hallo Welt 2',
			icon: 'bell',
			dropdownType: dropdownTypes.toggle,
			stringify: STORYBOOK_STRINGIFY_FN,
		},
	}));
