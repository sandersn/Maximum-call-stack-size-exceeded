import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular';
import { OpenAmountDisplayComponent } from './open-amount-display.component';
import { StorybookModule } from '../../../../storybook/storybook.module';
import { SalesSharedModule } from '../sales-shared.module';

// eslint-disable-next-line import/no-default-export
export default {
	title: 'Client/SalesSharedModule/OpenAmountDisplayComponent',
	component: OpenAmountDisplayComponent,
	decorators: [ moduleMetadata({ imports: [ SalesSharedModule, StorybookModule ] }) ],
} as Meta;

const TEMPLATE : Story<OpenAmountDisplayComponent> = (args : OpenAmountDisplayComponent) => ({
	props: args,
});

export const Default = TEMPLATE.bind({});
Default.args = {
	amountToPay: 100,
	currentlyPaid: 30,
	openAmount: 40,
	price: 200,
};
