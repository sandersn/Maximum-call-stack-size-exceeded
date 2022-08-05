import { SchedulingApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { MemberComponent } from './member.component';

describe('MemberComponent #needsapi', () => {
	let component : MemberComponent;

	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [MemberComponent] });

	beforeAll((done) => {
		testingUtils.login(
			{
				success: () => {
					testingUtils.unloadAndLoadApi(SchedulingApiService, () => {
						component = testingUtils.createComponent(MemberComponent);
						done();
					}, testingUtils.getApiQueryParams('calendar'));
				},
			},
		);
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
