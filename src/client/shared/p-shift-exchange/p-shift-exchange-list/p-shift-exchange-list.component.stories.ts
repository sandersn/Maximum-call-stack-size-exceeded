import { storiesOf, moduleMetadata } from '@storybook/angular';
import { SchedulingApiService, SchedulingApiShiftExchange, SchedulingApiShiftExchanges } from '@plano/shared/api';
import { PShiftExchangeListComponent } from './p-shift-exchange-list.component';
import { CoreModule } from '../../../../shared/core/core.module';
import { FakeSchedulingApiService } from '../../../scheduling/shared/api/scheduling-api.service.mock';
import { PFormsModule } from '../../p-forms/p-forms.module';
import { PListsModule } from '../../p-lists/p-lists.module';
import { PShiftModule } from '../../p-shift-module/p-shift.module';
import { PShiftExchangeBtnComponent } from '../p-shift-exchange-btn/p-shift-exchange-btn.component';
import { PShiftExchangeListItemComponent } from '../p-shift-exchange-list-item/p-shift-exchange-list-item.component';

const shiftExchange1 : SchedulingApiShiftExchange = new SchedulingApiShiftExchange(null);
shiftExchange1._updateRawData([[5, null, null, null, 'SHIFT_EXCHANGE'], [[null, true, null, null, 'SHIFT_EXCHANGE_COMMUNICATIONS']], true, 1, 4, 1, 1553532885121, 1, false, false, 0, null, 2599, 0, true, 1553532885121, 0, '', ''], true);
const shiftExchange2 : SchedulingApiShiftExchange = new SchedulingApiShiftExchange(null);
shiftExchange2._updateRawData([[5, null, null, null, 'SHIFT_EXCHANGE'], [[null, true, null, null, 'SHIFT_EXCHANGE_COMMUNICATIONS']], true, 1, 4, 1, 1553532885121, 1, true, false, 0, null, 2599, 0, true, 1553532885121, 0, '', ''], true);

const shiftExchanges : SchedulingApiShiftExchanges = new SchedulingApiShiftExchanges(null, false);
shiftExchanges.push(shiftExchange1);
shiftExchanges.push(shiftExchange2);

storiesOf('Client/PShiftExchange/p-shift-exchange-list', module)
	.addDecorator(
		moduleMetadata({
			imports: [
				CoreModule,
				PListsModule,
				PFormsModule,
				PShiftModule,
			],
			schemas: [],
			declarations: [
				PShiftExchangeBtnComponent,
				PShiftExchangeListItemComponent,
				PShiftExchangeListComponent,
			],
			providers: [
				{ provide: SchedulingApiService, useClass: FakeSchedulingApiService },
			],
		}),
	)
	.add('default', () => ({
		props: {
			shiftExchanges: shiftExchanges,
		},
		template: `
		<div class="d-flex justify-content-center">
			<div class="" style="width: 400px; max-width: 100%">
				<p-shift-exchange-list
					class="m-3"
					[shiftExchanges]="shiftExchanges"
				></p-shift-exchange-list>
			</div>
		</div>
		`,
	}));
