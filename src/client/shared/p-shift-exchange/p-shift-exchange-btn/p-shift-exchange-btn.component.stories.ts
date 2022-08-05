import { storiesOf, moduleMetadata } from '@storybook/angular';
import { SchedulingApiShiftExchange } from '@plano/shared/api';
import { SchedulingApiService, SchedulingApiMember } from '@plano/shared/api';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { FakeSchedulingApiService } from '../../../scheduling/shared/api/scheduling-api.service.mock';
import { PEditableModule } from '../../p-editable/p-editable.module';
import { PFormsModule } from '../../p-forms/p-forms.module';
import { PListsModule } from '../../p-lists/p-lists.module';
import { PShiftModule } from '../../p-shift-module/p-shift.module';

const shiftExchange1 : SchedulingApiShiftExchange = new SchedulingApiShiftExchange(null);
shiftExchange1._updateRawData([[5, null, null, null, 'SHIFT_EXCHANGE'], [[null, true, null, null, 'SHIFT_EXCHANGE_COMMUNICATIONS']], true, 1, 4, 1, 1553532885121, 1, false, false, 0, null, 2599, 0, true, 1553532885121, 0, '', ''], true);

const shiftExchange2 : SchedulingApiShiftExchange = new SchedulingApiShiftExchange(null);
shiftExchange2._updateRawData([[5, null, null, null, 'SHIFT_EXCHANGE'], [[null, true, null, null, 'SHIFT_EXCHANGE_COMMUNICATIONS']], true, 1, 4, 1, 1553532885121, 1, true, false, 0, null, 2599, 0, true, 1553532885121, 0, '', ''], true);

const member : SchedulingApiMember = new SchedulingApiMember(null);
member._updateRawData([[2599, null, null, null, 'MEMBER'], 'Kurt', 'Albärtig', false, 0, 450, 450, [[null, true, null, null, 'MEMBER_RIGHT_GROUP_IDS'], 2628], 0.4380704041720991, 3.75, [[null, true, null, null, 'MEMBER_ASSIGNABLE_SHIFT_MODELS'], [[2557, null, null, null, 'MEMBER_ASSIGNABLE_SHIFT_MODEL'], 10, 2557], [[2547, null, null, null, 'MEMBER_ASSIGNABLE_SHIFT_MODEL'], 11, 2547], [[2537, null, null, null, 'MEMBER_ASSIGNABLE_SHIFT_MODEL'], 11, 2537]]], true);

storiesOf('Client/PShiftExchange/p-shift-exchange-btn', module)
	.addDecorator(
		moduleMetadata({
			imports: [
				PListsModule,
				PFormsModule,
				PShiftModule,
				PEditableModule,
				StorybookModule,
			],
			schemas: [],
			declarations: [
			],
			providers: [
				{ provide: SchedulingApiService, useClass: FakeSchedulingApiService },
			],
		}),
	)
	.add('default', () => ({
		props: {
			shiftExchange: shiftExchange1,
			member: member,
		},
		template: `
		<div class="d-flex justify-content-center">
			<div class="" style="width: 400px; max-width: 100%">
				<p-shift-exchange-btn
					class="m-3"
					[shiftExchange]="shiftExchange"
				></p-shift-exchange-btn>
			</div>
		</div>
		`,
	}))
	.add('ill', () => ({
		props: {
			shiftExchange: shiftExchange2,
			member: member,
		},
		template: `
		<div class="d-flex justify-content-center">
			<div class="" style="width: 400px; max-width: 100%">
				<p-shift-exchange-btn
					class="m-3"
					[shiftExchange]="shiftExchange"
				></p-shift-exchange-btn>
			</div>
		</div>
		`,
	}));
