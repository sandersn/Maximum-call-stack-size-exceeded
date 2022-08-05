import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular';
import { TransactionListHeadlineComponent } from './transaction-list-headline.component';
import { PTransactionsModule } from '../p-transactions.module';

// eslint-disable-next-line import/no-default-export
export default {
	title: 'Client/PTransactions/p-transaction-list-headline',
	component: TransactionListHeadlineComponent,
	decorators: [
		moduleMetadata({
			imports: [
				PTransactionsModule,
			],
		}),
	],
	argTypes: {
	},
} as Meta;

const TEMPLATE : Story<TransactionListHeadlineComponent> = (args : TransactionListHeadlineComponent) => ({
	template: `
		<p-transaction-list-headline
			[isLoading]="isLoading"
		></p-transaction-list-headline>
	`, // Needed to pass arbitrary child content
	props: args,
});


export const loading = TEMPLATE.bind({});
loading.args = {
	isLoading: true,
};

export const story = TEMPLATE.bind({});
story.args = {
	isLoading: false,
};
