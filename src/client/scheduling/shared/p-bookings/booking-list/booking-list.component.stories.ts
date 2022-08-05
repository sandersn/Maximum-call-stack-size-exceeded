import { moduleMetadata, storiesOf } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { FakeSchedulingApiService } from '../../api/scheduling-api.service.mock';
import { PBookingsModule } from '../p-bookings.module';

const fakeApi = new FakeSchedulingApiService();

const myStory = storiesOf('Client/PBookings/p-booking-list', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PBookingsModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-booking-list
				[isLoading]="true"
			></p-booking-list>
			<br>
			<p-booking-list
				[bookings]="bookings"
			></p-booking-list>
		`,
		props: {
			bookings: fakeApi.data.bookings,
		},
	}));
