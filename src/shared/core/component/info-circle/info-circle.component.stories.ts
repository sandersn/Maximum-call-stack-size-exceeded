import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';

const myStory = storiesOf('Core/info-circle', module);
myStory

	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
			Mobile:<br>
			<p-info-circle
				[headline]="headline"
				[isMobile]="true"
			>Lorem Ipsum</p-info-circle>
			<p-info-circle
				theme="warning"
				[isMobile]="true"
			>Lorem Ipsum</p-info-circle>
			<p-info-circle
				theme="danger"
				[isMobile]="true"
			>Lorem Ipsum</p-info-circle>
			<p-info-circle
				icon="star"
				[isMobile]="true"
			>Lorem Ipsum</p-info-circle>
			<br>
			Desktop:<br>
			<p-info-circle
				[headline]="headline"
				[isMobile]="false"
			>Lorem Ipsum</p-info-circle>
			<p-info-circle
				theme="warning"
				[isMobile]="false"
			>Lorem Ipsum</p-info-circle>
			<p-info-circle
				theme="danger"
				[isMobile]="false"
			>Lorem Ipsum</p-info-circle>
			<p-info-circle
				icon="star"
				[isMobile]="false"
			>Lorem Ipsum</p-info-circle>
		`,
		props: {
			headline: 'Hallo Welt',
			// placement: false,
		},
	}));
