import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PAssignmentProcessIconComponent } from './p-assignment-process-icon.component';
import { assumeNonNull } from '../../../../shared/core/null-type-utils';

describe('PAssignmentProcessIconComponent #needsapi', () => {
	let component : PAssignmentProcessIconComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [SchedulingModule] });

	beforeAll((done) => {
		testingUtils.login({
			success: () => {
				testingUtils.unloadAndLoadApi(SchedulingApiService, () => {
					component = testingUtils.createComponent(PAssignmentProcessIconComponent);
					done();
				}, testingUtils.getApiQueryParams('calendar'));
			},
		});
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

	describe('.icon', () => {
		it('should be defined', () => {
			component.state = SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES;
			expect(component.icon).toBeDefined();
			assumeNonNull(component.icon);
			expect(component.icon.length).toBeGreaterThan(0);
		});
	});
});
