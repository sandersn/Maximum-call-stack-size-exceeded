import { storiesOf, moduleMetadata } from '@storybook/angular';
import { ListSortDirection } from './list-headline-item.component';
import { PListsModule } from '../p-lists.module';

storiesOf('Client/PLists/p-list-headline-item', module)

	.addDecorator(
		moduleMetadata({
			imports: [
				PListsModule,
			],
			declarations: [],
		}),
	)
	.add('default', () => ({
		template: `
			<p-list-headline-item></p-list-headline-item>
			<hr class="my-3">
			<p-list-headline-item label="Lorem Ipsum"></p-list-headline-item>
			<hr class="my-3">
			<p-list-headline-item label="Lorem Ipsum" [sortDirection]="sortDirection"></p-list-headline-item>
			<hr class="my-3">
			<p-list-headline-item labelIcon="euro-sign" [sortDirection]="sortDirection"></p-list-headline-item>
		`,
		props: {
			sortDirection: ListSortDirection.UP,
		},
	}));
