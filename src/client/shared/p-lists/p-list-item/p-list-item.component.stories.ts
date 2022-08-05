import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PFormsModule } from '../../p-forms/p-forms.module';
import { PShiftModelModule } from '../../p-shiftmodel/p-shiftmodel.module';
import { PListsModule } from '../p-lists.module';

storiesOf('Client/PLists/p-list', module)

	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PShiftModelModule,
				PFormsModule,
				PListsModule,
			],
			declarations: [],
		}),
	)
	.add('default', () => ({
		template: `
			<p-list>
				<p-list-item>{{label1}}</p-list-item>
				<p-list-item>Test 2</p-list-item>
				<p-list-item>Test 3</p-list-item>
			</p-list>
			<hr class="mt-5 mb-5">
			<p-list>
				<list-headline text="Tätigkeiten" class="card mb-1 mt-1"></list-headline>
				<p-list-item
					size="frameless"
				>
					<p-color-marker
						hexColor="#700"
						[isPacket]="colorMarker.isPacket"
					></p-color-marker>
					<div class="d-flex align-items-stretch flex-grow-1">
						<div
							class="mr-auto p-2 pl-3 pr-3 flex-grow-1"
						>{{label1}}</div>
					</div>
					<p-checkbox
						class="flex-grow-0 d-flex justify-content-stretch border-left pl-2 pr-1"
						style="min-width: 2em"
						[hasButtonStyle]="false"
					></p-checkbox>
				</p-list-item>
				<p-list-item
					size="frameless"
				>
					<p-color-marker
						hexColor="#077"
					></p-color-marker>
					<div class="d-flex align-items-stretch flex-grow-1">
						<div
							class="mr-auto p-2 pl-3 pr-3 flex-grow-1"
						>Theke</div>
					</div>
					<p-checkbox
						class="flex-grow-0 d-flex justify-content-stretch border-left pl-2 pr-1"
						style="min-width: 2em"
						[hasButtonStyle]="false"
					></p-checkbox>
				</p-list-item>
				<p-list-item
					size="frameless"
				>
					<p-color-marker
						hexColor="#707"
						[isPacket]="true"
					></p-color-marker>
					<div class="d-flex align-items-stretch flex-grow-1">
						<div
							class="mr-auto p-2 pl-3 pr-3 flex-grow-1"
						>Anfängerkurs</div>
					</div>
					<p-checkbox
						class="flex-grow-0 d-flex justify-content-stretch border-left pl-2 pr-1"
						style="min-width: 2em"
						[hasButtonStyle]="false"
					></p-checkbox>
				</p-list-item>
			</p-list>
		`,
		props: {
			label1: 'Label Nr. 1',
			colorMarker: {
				isPacket: false,
			},
		},
	}))
	.add('clickable', () => ({
		template: `
			<p-list>
				<p-list-item (onClick)="!undefined">Test 1</p-list-item>
				<p-list-item (onClick)="!undefined">Test 2</p-list-item>
				<p-list-item (onClick)="!undefined">Test 3</p-list-item>
			</p-list>
		`,
	}))
	.add('selectable', () => ({
		template: `
			<p-list>
				<p-list-item (onClick)="selected = 1" [selected]="!selected || selected === 1">Test 1</p-list-item>
				<p-list-item (onClick)="selected = 2" [selected]="selected === 2">Test 2</p-list-item>
				<p-list-item (onClick)="selected = 3" [selected]="selected === 3">Test 3</p-list-item>
			</p-list>
		`,
		props: {
			selected: undefined,
		},
	}));
