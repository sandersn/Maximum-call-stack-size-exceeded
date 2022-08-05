import { MeService } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { AccountApiService } from '@plano/shared/api';
import { SchedulingApiRightGroupRole } from '@plano/shared/api';
import { TestingUtils, LoginRole } from '@plano/shared/testing/testing-utils';
import { DetailFormComponent } from './detail-form.component';
import { assumeNonNull } from '../../../shared/core/null-type-utils';

// TODO: Parts of this test depend on api data. don’t do end-to-end tests here.

describe('#Member_DetailFormComponent #needsapi', () => {
	let component : DetailFormComponent;
	let api : SchedulingApiService;
	let me : MeService;
	let accountApiService : AccountApiService;

	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [DetailFormComponent] });

	describe('as Admin', () => {

		beforeAll(async () => {
			me = await testingUtils.login();
			api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, testingUtils.getApiQueryParams('calendar'));
			accountApiService = await testingUtils.unloadAndLoadApi(AccountApiService, null);
			component = testingUtils.createComponent(DetailFormComponent);
		});

		it('should have a defined component', () => {
			expect(component).toBeDefined();
		});

		describe('.isLastAdmin', () => {
			it('should be false if other admin is the components member', () => {
				const otherOwner = api.data.members.filterBy(item => {
					return (item.role === SchedulingApiRightGroupRole.CLIENT_OWNER && !item.id.equals(me.data.id));
				}).get(0)!;
				component.item = otherOwner;
				expect(component.isLastAdmin).toBeFalsy();
			});
		});
	});

	describe('as Member', () => {

		beforeAll(async () => {
			me = await testingUtils.login({role: LoginRole.CLIENT_DEFAULT});
			api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, testingUtils.getApiQueryParams('calendar'));
			accountApiService = await testingUtils.unloadAndLoadApi(AccountApiService, null);
			component = testingUtils.createComponent(DetailFormComponent);
		});

		it('should have a defined component', () => {
			expect(component).toBeDefined();
		});

		describe('who looks at other member', () => {

			beforeAll(async () => {
				me = await testingUtils.login({role: LoginRole.CLIENT_DEFAULT});
				api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, testingUtils.getApiQueryParams('calendar'));
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				accountApiService = await testingUtils.unloadAndLoadApi(AccountApiService, null);
				component = testingUtils.createComponent(DetailFormComponent);
			});

			it('whole form should be disabled', done => {
				const otherMember = api.data.members.findBy(item => !item.id.equals(me.data.id))!;
				component.item = otherMember;
				component.initComponent(() => {
					assumeNonNull(component.formGroup);
					expect(component.formGroup.get('MEMBER_FIRST_NAME')!.disabled).toBeTruthy();
					expect(component.formGroup.get('MEMBER_LAST_NAME')!.disabled).toBeTruthy();
					expect(component.formGroup.get('email')!.disabled).toBeTruthy();
					expect(component.formGroup.get('phone')!.disabled).toBeTruthy();
					done();
				});
			});
		});

	});

});
