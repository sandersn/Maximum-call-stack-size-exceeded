import { storiesOf, moduleMetadata } from '@storybook/angular';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { SchedulingApiShiftExchange } from '@plano/shared/api';
import { SchedulingApiService, SchedulingApiMember } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { CoreModule } from '@plano/shared/core/core.module';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PShiftExchangeListItemComponent } from './p-shift-exchange-list-item.component';
import { FakeMeService } from '../../../../shared/core/me/me.service.mock';
import { PEditableModule } from '../../p-editable/p-editable.module';
import { PFormsModule } from '../../p-forms/p-forms.module';
import { PListsModule } from '../../p-lists/p-lists.module';
import { PMemberModule } from '../../p-member/p-member.module';
import { PShiftModule } from '../../p-shift-module/p-shift.module';

const testingUtils : TestingUtils = new TestingUtils();

const shiftExchange : SchedulingApiShiftExchange = new SchedulingApiShiftExchange(null);
shiftExchange._updateRawData([[5, null, null, null, 'SHIFT_EXCHANGE'], [[null, true, null, null, 'SHIFT_EXCHANGE_COMMUNICATIONS']], true, 1, 6, 1, 1553532885121, 1, false, false, 0, null, 2599, 0, true, 1553532885121, 0, '', ''], true);

const member : SchedulingApiMember = new SchedulingApiMember(null);
member._updateRawData([[2599, null, null, null, 'MEMBER'], 'Hans', 'Wurst', false, 0, 450, 450, [[null, true, null, null, 'MEMBER_RIGHT_GROUP_IDS'], 2628], 0.4380704041720991, 3.75, [[null, true, null, null, 'MEMBER_ASSIGNABLE_SHIFT_MODELS'], [[2557, null, null, null, 'MEMBER_ASSIGNABLE_SHIFT_MODEL'], 10, 2557], [[2547, null, null, null, 'MEMBER_ASSIGNABLE_SHIFT_MODEL'], 11, 2547], [[2537, null, null, null, 'MEMBER_ASSIGNABLE_SHIFT_MODEL'], 11, 2537]]], true);

const newAssignedMember : SchedulingApiMember = new SchedulingApiMember(null);
newAssignedMember._updateRawData([[2599, null, null, null, 'MEMBER'], testingUtils.getRandomString(10), testingUtils.getRandomString(10), false, 0, 450, 450, [[null, true, null, null, 'MEMBER_RIGHT_GROUP_IDS'], 2628], 0.4380704041720991, 3.75, [[null, true, null, null, 'MEMBER_ASSIGNABLE_SHIFT_MODELS'], [[2557, null, null, null, 'MEMBER_ASSIGNABLE_SHIFT_MODEL'], 10, 2557], [[2547, null, null, null, 'MEMBER_ASSIGNABLE_SHIFT_MODEL'], 11, 2547], [[2537, null, null, null, 'MEMBER_ASSIGNABLE_SHIFT_MODEL'], 11, 2537]]], true);

storiesOf('Client/PShiftExchange/p-shift-exchange-list-item', module)
	.addDecorator(
		moduleMetadata({
			imports: [
				CoreModule,
				PListsModule,
				PFormsModule,
				PShiftModule,
				PEditableModule,
				PMemberModule,
				HttpClientModule,
				RouterModule.forRoot([{
					path: 'iframe.html',
					component: PShiftExchangeListItemComponent,
					pathMatch: 'full',
				}]),
				CoreModule,
			],
			schemas: [],
			declarations: [
				PShiftExchangeListItemComponent,
			],
			providers: [
				SchedulingApiService,
				{ provide: APP_BASE_HREF, useValue: '' },
				{ provide: MeService, useClass: FakeMeService },
			],
		}),
	)
	.add('default', (/* input*/) => {
		return {
			props: {
				shiftExchange: shiftExchange,
				member: member,
				newAssignedMember: newAssignedMember,
			},
			template: `
			<div class="d-flex justify-content-center">
				<div class="" style="width: 400px; max-width: 100%">
					<p-shift-exchange-list-item
						class="m-3"
						[shiftExchange]="shiftExchange"
						[indisposedMember]="member"
						[newAssignedMember]="newAssignedMember"
					></p-shift-exchange-list-item>
				</div>
			</div>
			`,
		};
	});
