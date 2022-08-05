import { storiesOf, moduleMetadata } from '@storybook/angular';
import { Config } from '@plano/shared/core/config';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PTariffMetaInfoComponent } from './tariff-meta-info.component';
import { FakeConfig } from '../../p-forms/p-input-date/p-input-date.component.stories';
import { PShiftModelModule } from '../p-shiftmodel.module';

const myStory = storiesOf('Client/ClientSharedComponents/p-tariff-meta-info', module);
myStory.addParameters({ component: PTariffMetaInfoComponent });
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PShiftModelModule,
			],
			providers: [
				{ provide: Config, useClass: FakeConfig },
			],
			declarations: [
			],
		}),
	);
myStory
	.add('default', () => ({
		template: `
		<div class="d-flex flex-column justify-content-center position-relative">
			<p-tariff-meta-info
			></p-tariff-meta-info>
			<p-tariff-meta-info
				[negateForCourseDatesInterval]="negateForCourseDatesInterval"
				[forCourseDatesFrom]="!forCourseDatesFromIsDefined ? undefined : +forCourseDatesFrom"
				[forCourseDatesUntil]="!forCourseDatesUntilIsDefined ? undefined : +forCourseDatesUntil"
				isInternalLabel="Interne FooBar"
				[isInternal]="isInternal"
			></p-tariff-meta-info>
		</div>
		`,
		props: {
			negateForCourseDatesInterval: false,
			forCourseDatesFromIsDefined: false,
			forCourseDatesFrom: undefined as unknown as PTariffMetaInfoComponent['forCourseDatesFrom'],
			forCourseDatesUntilIsDefined: false,
			forCourseDatesUntil: undefined as unknown as PTariffMetaInfoComponent['forCourseDatesFrom'],
			isInternal: true,
		},
	}))
;
