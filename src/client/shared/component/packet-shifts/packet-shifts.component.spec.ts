import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { SchedulingApiService } from '@plano/shared/api';
import { TestingUtils } from '../../../../shared/testing/testing-utils';
import { MemberBadgeComponent } from '../../p-member/member-badges/member-badge/member-badge.component';

describe('MemberBadgeComponent #needsapi', () => {
	let component : MemberBadgeComponent;

	const testingUtils = new TestingUtils();

	beforeAll((done) => {
		testingUtils.init({ imports : [SchedulingModule] });
		testingUtils.login({
			success: () => {
				testingUtils.loadApi(SchedulingApiService, () => {
					component = testingUtils.createComponent(MemberBadgeComponent);
					done();
				});
			},
		});
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
