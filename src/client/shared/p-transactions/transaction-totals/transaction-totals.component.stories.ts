import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { TransactionTotalsComponent } from './transaction-totals.component';
import { PFormsModule } from '../../p-forms/p-forms.module';
import { PTransactionsModule } from '../p-transactions.module';

// eslint-disable-next-line import/no-default-export
export default {
	title: 'Client/PTransactions/p-transaction-totals',
	component: TransactionTotalsComponent,
	decorators: [
		moduleMetadata({
			imports: [
				StorybookModule,
				PTransactionsModule,
				PFormsModule,
			],
		}),
	],
	argTypes: {
	},
} as Meta;

const TEMPLATE : Story<TransactionTotalsComponent> = (args : TransactionTotalsComponent) => ({
	template: `
		<p-transaction-totals
			[isLoading]="isLoading"
			[totalIncomingPayments]="transactions.totalIncomingPayments"
			[totalOutgoingPayments]="transactions.totalOutgoingPayments"
		>
      <p-button
        [attributeInfo]="null"
				[icon]="${PlanoFaIconPool.EXPORT}"
      >Export</p-button>
    </p-transaction-totals>
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

