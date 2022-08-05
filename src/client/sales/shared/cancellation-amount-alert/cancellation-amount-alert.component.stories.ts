import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular';
import { CancellationAmountAlertComponent } from './cancellation-amount-alert.component';
import { SalesSharedModule } from '../sales-shared.module';

// eslint-disable-next-line import/no-default-export
export default {
	title: 'Client/SalesSharedModule/CancellationAmountAlert',
	component: CancellationAmountAlertComponent,
	decorators: [ moduleMetadata({ imports: [ SalesSharedModule ] }) ],
} as Meta;

const TEMPLATE : Story<CancellationAmountAlertComponent> = (args : CancellationAmountAlertComponent) => ({
	template: `
		<p-cancellation-amount-alert
			[currencyAmount]="-10"
		></p-cancellation-amount-alert>
		<p-cancellation-amount-alert
			[currencyAmount]="0"
		></p-cancellation-amount-alert>
		<p-cancellation-amount-alert
			[currencyAmount]="50.99"
		></p-cancellation-amount-alert>
	`,
	props: args,
});

export const Default = TEMPLATE.bind({});
Default.args = {
	// size: BootstrapSize.SM,
	currencyAmount: -50,
};
