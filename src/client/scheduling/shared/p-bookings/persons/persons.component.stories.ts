import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PBookingsModule } from '../p-bookings.module';

const myStory = storiesOf('Client/PBookings/p-persons', module);
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
			<p-persons
				class="card pl-3 pr-3 pt-2 pb-2"
				[count]="12"
				tariffName="FooBar"
				[ageMin]="12"
				[ageMax]="18"
			></p-persons>
		`,
	}));
