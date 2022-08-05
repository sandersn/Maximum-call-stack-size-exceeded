import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular';
import { BookingTransactionFormComponent } from './booking-transaction-form.component';
import { StorybookModule } from '../../../../storybook/storybook.module';
import { FakeSchedulingApiService } from '../../../scheduling/shared/api/scheduling-api.service.mock';
import { SalesSharedModule } from '../sales-shared.module';

// eslint-disable-next-line import/no-default-export
export default {
	title: 'Client/SalesSharedModule/BookingTransactionFormComponent',
	component: BookingTransactionFormComponent,
	decorators: [ moduleMetadata({ imports: [ SalesSharedModule, StorybookModule ] }) ],
} as Meta;

const TEMPLATE : Story<BookingTransactionFormComponent> = (args : BookingTransactionFormComponent) => ({
	props: args,
});

const fakeApi = new FakeSchedulingApiService();
const allBookings = fakeApi.data.bookings;
let booking = allBookings.filterBy(item => !!item.transactions.length).get(0);
if (!booking) booking = allBookings.get(0);

export const Default = TEMPLATE.bind({});
Default.args = {
	bookable: booking!,
	isBooking: true,
};
