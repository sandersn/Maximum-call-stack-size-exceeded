import { storiesOf, moduleMetadata } from '@storybook/angular';
import { FakeSchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service.mock';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { AccesscontrolModule } from '../accesscontrol.module';

const fakeApi = new FakeSchedulingApiService();

const myStory = storiesOf('Client/AccesscontrolModule/p-rightgroup-header', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				AccesscontrolModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-rightgroup-header
			></p-rightgroup-header>
			<p-rightgroup-header
				[rightGroup]="fakeApi.data.rightGroups.get(0)"
				[rightGroups]="fakeApi.data.rightGroups"
				(rightGroupChange)="doSomething()"
			></p-rightgroup-header>
		`,
		props: {
			fakeApi: fakeApi,
			doSomething: () => {},
		},
	}));
