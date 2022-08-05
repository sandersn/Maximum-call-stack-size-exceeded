import { storiesOf, moduleMetadata } from '@storybook/angular';
import { PFormControl } from '@plano/client/shared/p-forms/p-form-control';
import { Config } from '@plano/shared/core/config';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PBasicInfoComponent } from './basic-info.component';
import { FakeConfig } from '../../p-forms/p-input-date/p-input-date.component.stories';
import { PMemberModule } from '../../p-member/p-member.module';
import { ClientSharedComponentsModule } from '../client-shared-components.module';

const myStory = storiesOf('Client/ClientSharedComponents/p-basic-info', module);
myStory.addParameters({ component: PBasicInfoComponent });
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				ClientSharedComponentsModule,
				PMemberModule,
			],
			providers: [
				{ provide: Config, useClass: FakeConfig },
			],
		}),
	);
myStory
	.add('default', () => ({
		template: `
		<div class="d-flex flex-column justify-content-center position-relative">
			<h4>With no Data</h4>
			<p-basic-info></p-basic-info>
			<br>
			<h4>With Data</h4>
			<p-basic-info
				[name]="name"
				[start]="start"
				[end]="end"
				[showDate]="showDate"
				[showTime]="showTime"
				[showEndTime]="showEndTime"
				[dateTimeHasDanger]="dateTimeHasDanger"
				[oneLine]="false"
				[isRemoved]="isRemoved"
			></p-basic-info>
			<br>
			<h4>With Time</h4>
			<p-basic-info
				[name]="name"
				[start]="start"
				[end]="end"
				[showDate]="false"
				[showTime]="showTime"
				[showEndTime]="showEndTime"
				[dateTimeHasDanger]="dateTimeHasDanger"
				[oneLine]="false"
				[isRemoved]="isRemoved"
			></p-basic-info>
			<h4>One Line</h4>
			<p-basic-info
				[name]="name"
				[start]="start"
				[end]="end"
				[showDate]="false"
				[showTime]="showTime"
				[showEndTime]="showEndTime"
				[dateTimeHasDanger]="dateTimeHasDanger"
				[oneLine]="true"
				[isRemoved]="isRemoved"
			></p-basic-info>
			<h4>One Line with ng-content</h4>
			<p-basic-info
				[name]="name"
				[start]="start"
				[end]="end"
				[showDate]="false"
				[showTime]="showTime"
				[showEndTime]="showEndTime"
				[dateTimeHasDanger]="dateTimeHasDanger"
				[oneLine]="true"
				[isRemoved]="isRemoved"
			>
				<p-member-badge
					class="ml-2"
				></p-member-badge>
			</p-basic-info>
		</div>
		`,
		props: {
			formControl: new PFormControl({
				formState: {
					value: '',
					disabled: false,
				},
			}),
			name: 'Frühschicht',
			start: 1545297200000,
			end: 1549297200000,
			showDate: true,
			showTime: true,
			showEndTime: true,
			dateTimeHasDanger: false,
			isRemoved: false,
		},
	}))
;
