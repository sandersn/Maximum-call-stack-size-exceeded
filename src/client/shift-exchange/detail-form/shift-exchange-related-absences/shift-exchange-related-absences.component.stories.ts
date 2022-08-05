import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { SchedulingApiAbsences } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiAbsenceType } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PSupportedLocaleIds } from '../../../../shared/api/base/generated-types.ag';
import { ShiftExchangeModule } from '../../shift-exchange.module';

const myStory = storiesOf('Client/ShiftExchange/p-shift-exchange-related-absences', module);

const now = +(new PMomentService(PSupportedLocaleIds.de_DE).m());
const absences = new SchedulingApiAbsences(null, false);
const addAbsence = () : void => {
	const absence = absences.createNewItem(Id.create(12));
	absence.type = SchedulingApiAbsenceType.ILLNESS;
	absence.time.start = +(new PMomentService(PSupportedLocaleIds.de_DE).m(now).set('hour', 9));
	absence.time.end = +(new PMomentService(PSupportedLocaleIds.de_DE).m(now).set('hour', 17));
};
addAbsence();
addAbsence();
addAbsence();

export class FakeRightsService {
	public userCanWriteAbsences : boolean = true;

	constructor() {}
}

myStory

	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				ShiftExchangeModule,
			],
			providers: [
				{ provide: RightsService, useClass: FakeRightsService },
			],
		}),
	)
	.add('with content', () => ({
		template: `
			<p-shift-exchange-related-absences
				[absences]="absences"
				(onClickAbsence)="onClickAbsence($event)"
			></p-shift-exchange-related-absences>
		`,
		props: {
			absences: absences,
			onClickAbsence: action('onClickAbsence'),
		},
	}));
