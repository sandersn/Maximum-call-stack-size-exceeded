import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PMemberModule } from '../../p-member.module';

const myStory = storiesOf('Client/PMember/p-empty-member-badges', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PMemberModule,
			],
		}),
	);

const getTemplate = (numberOfBadges : number) : string => {
	return `
		<p-empty-member-badges
			[emptyMemberSlots]="${numberOfBadges}"
		></p-empty-member-badges>
	`;
};

myStory
	.add('default', () => ({
		template: `
			${getTemplate(0)}
			<br>
			${getTemplate(1)}
			<br>
			${getTemplate(2)}
			<br>
			${getTemplate(3)}
			<br>
			${getTemplate(4)}
			<br>
			${getTemplate(1000)}
		`,
		props: {
		},
	}));
