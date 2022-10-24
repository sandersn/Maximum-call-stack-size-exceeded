import { moduleMetadata } from '@storybook/angular';
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
    argTypes: {},
};
const TEMPLATE = (args) => ({
    template: `
		<p-transaction-list-headline
			[isLoading]="isLoading"
		></p-transaction-list-headline>
	`,
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
//# sourceMappingURL=transaction-list-headline.component.stories.js.map