import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PFormsModule } from '../../p-forms/p-forms.module';
import { PShiftModelModule } from '../p-shiftmodel.module';

const myStory = storiesOf('Client/PShiftModel/p-shiftmodel-list-item', module);

myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PShiftModelModule,
				PFormsModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-shiftmodel-list-item></p-shiftmodel-list-item>
			<p-shiftmodel-list-item
				label="Lorem Ipsum"
				[color]="color"
				[isPacket]="isPacket"
				(onItemClick)="onItemClick($event)"
				[hideMultiSelectBtn]="false"
			>
				<p-input></p-input>
			</p-shiftmodel-list-item>
		`,
		props: {
			color: '540',
			isPacket: true,
			onItemClick: action('onItemClick'),
		},
	}));
