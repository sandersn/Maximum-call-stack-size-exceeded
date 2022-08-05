import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { ClientSharedModule } from '../../client-shared.module';

const myStory = storiesOf('Client/ClientSharedComponents/pause-duration', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				ClientSharedModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-pause-duration
				[merged]="merged"
				[duration]="duration"
				[regularPauseDuration]="regularPauseDuration"
				[automaticPauseDuration]="automaticPauseDuration"
				[memberName]="memberName"
				[isForecast]="isForecast"
			></p-pause-duration>
		`,
		props: {
			merged: false,
			duration: 18000000,
			regularPauseDuration: 1800000,
			automaticPauseDuration: 1800000,
			memberName: 'Nils Karlsson',
			// tooltipTemplate: 'Nils Karlsson',
			isForecast: false,
		},
	}));
