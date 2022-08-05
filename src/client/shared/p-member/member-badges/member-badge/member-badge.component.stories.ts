import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PMemberModule } from '../../p-member.module';

const myStory = storiesOf('Client/PMember/member-badge', module);
myStory

	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PMemberModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-member-badge
				[text]="text"
				[hasDanger]="hasDanger"
				[memberIsAbsent]="memberIsAbsent"
				[icon]="icon"
				[firstName]="firstName"
				[lastName]="lastName"
				[memberId]="memberId"
				[isMe]="false"
			></p-member-badge>
			<hr>
			<p-member-badge
				[text]="text"
				[hasDanger]="hasDanger"
				[memberIsAbsent]="memberIsAbsent"
				[icon]="icon"
				[firstName]="firstName"
				[lastName]="lastName"
				[memberId]="memberId"
				[isMe]="true"
			></p-member-badge>
			<br>
			<p-member-badge
				[text]="text"
				[hasDanger]="true"
				[firstName]="firstName"
				[lastName]="lastName"
				[memberId]="memberId"
				[isMe]="false"
			></p-member-badge>
			<br>
			<p-member-badge
				[text]="text"
				[memberIsAbsent]="true"
				[icon]="'umbrella-beach'"
				[firstName]="firstName"
				[lastName]="lastName"
				[memberId]="memberId"
				[isMe]="false"
			></p-member-badge>
			<br>
			<p-member-badge></p-member-badge>
			<br>
			<p-member-badge
				text="♻︎"
			></p-member-badge>
		`,
		props: {
			text: '',
			hasDanger: false,
			memberIsAbsent: false,
			icon: '',
			firstName: 'Nils',
			lastName: 'Karlsson', // cSpell:ignore Karlsson
			memberId: null,
		},
	}));
