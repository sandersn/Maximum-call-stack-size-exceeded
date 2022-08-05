import { moduleMetadata, storiesOf } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { FakeSchedulingApiService } from '../../api/scheduling-api.service.mock';
import { PBookingsModule } from '../p-bookings.module';

const fakeApi = new FakeSchedulingApiService();

const myStory = storiesOf('Client/PBookings/p-booking-list-headline', module);
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
			<p-booking-list-headline
				[isLoading]="true"
			></p-booking-list-headline>
			<br>
			<p-booking-list-headline
			></p-booking-list-headline>
		`,
		props: {
			bookings: fakeApi.data.bookings,
		},
	}));
