import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { ClientSharedModule } from '../../client-shared.module';
import { PNoItemsModule } from '../p-no-items.module';

export const BOOTSTRAP_SIZES : {
	sm : 'sm',
	md : 'md',
	lg : 'lg',
} = {
	sm: 'sm',
	md: 'md',
	lg: 'lg',
};

const myStory = storiesOf('Client/ClientSharedComponents/p-no-item', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				ClientSharedModule,
				PNoItemsModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-no-item
				[size]="size"
			></p-no-item>
		`,
		props: {
			size: 'md',
		},
	}));
