import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PBookingsModule } from '../p-bookings.module';

const myStory = storiesOf('Client/PBookings/p-person', module);
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
			<p-person
				class="card bg-white pl-3 pr-3 pt-2 pb-2"
				firstName="Nils"
				lastName="Karlsson"
				tariffName="FooBar"
				[price]="50"
				additionalField="Mitgliedsnummer"
				additionalFieldValue="124-1245-123"
			></p-person>
		`,
		props: {
			// onToggleAttended: action('onToggleAttended'),
		},
	}));
