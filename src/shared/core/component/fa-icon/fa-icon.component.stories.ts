import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';

const myStory = storiesOf('Core/fa-icon', module);
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
			<fa-icon [isLoading]="true"></fa-icon>
			<br>
			<fa-icon icon="search"></fa-icon>
			<br>
			<fa-icon [spin]="true" icon="sync"></fa-icon>
		`,
	}));
