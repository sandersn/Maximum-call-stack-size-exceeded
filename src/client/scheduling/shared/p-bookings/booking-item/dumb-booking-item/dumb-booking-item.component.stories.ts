import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { SchedulingApiBookingState } from '@plano/shared/api';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { FakeSchedulingApiService } from '../../../api/scheduling-api.service.mock';
import { PPaymentStatusEnum } from '../../../api/scheduling-api.utils';
import { PBookingsModule } from '../../p-bookings.module';

const fakeApi = new FakeSchedulingApiService();

const myStory = storiesOf('Client/PBookings/dumb-booking-item', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PBookingsModule,
			],
		}),
	);
myStory
	.add('default', () => ({
		template: `
		<p-dumb-booking-item
			class="card"

			[hasDropdown]="hasDropdown"
			[isLoading]="true"
		></p-dumb-booking-item>
		<p-dumb-booking-item
			class="card"

			[hasDropdown]="hasDropdown"
			[isLoading]="false"
			[id]="id"
			[model]="model"
			[state]="state"
			[paymentStatus]="paymentStatus"

			[bookingNumber]="bookingNumber"
			[ownerComment]="ownerComment"
			[bookingComment]="bookingComment"
			[dateOfBooking]="dateOfBooking"
			[userCanWrite]="userCanWrite"
			(onEdit)="onEdit()"
			[relatedShiftsSelected]="relatedShiftsSelected"
			(onSelectShifts)="onSelectShifts()"
			[selectShiftIsDisabled]="selectShiftIsDisabled"
		></p-dumb-booking-item>
		`,
		props: {
			hasDropdown: true,
			id: fakeApi.data.bookings.get(0)!.id,
			model: fakeApi.data.shiftModels.get(0),
			state: SchedulingApiBookingState.BOOKED,
			paymentStatus: PPaymentStatusEnum.CASHBACK,
			bookingNumber: 123,
			ownerComment: 'Ganz wichtiger Kunde',
			bookingComment: 'Bitte mit Pizza',
			dateOfBooking: Date.now(),
			userCanWrite: true,
			onEdit: action('onEdit'),
			relatedShiftsSelected: false,
			onSelectShifts: action('onSelectShifts'),
			selectShiftIsDisabled: false,
		},
	}));
