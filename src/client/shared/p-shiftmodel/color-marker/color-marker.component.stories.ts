import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PShiftModelModule } from '../p-shiftmodel.module';

const myStory = storiesOf('Client/PShiftModel/color-marker', module);

myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PShiftModelModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
		<div class="d-flex justify-content-start position-relative bg-light">
			<p-color-marker
				[hexColor]="hexColor"
				[title]="title"
				[isPacket]="isPacket"
				[isLoading]="isLoading"
			></p-color-marker><span class="pt-2 pb-2 pl-3">Fooo</span>
		</div>
		`,
		props: {
			title: 'some color marker',
			hexColor: '#900',
			isPacket: true,
			isLoading: false,
		},
	}));
