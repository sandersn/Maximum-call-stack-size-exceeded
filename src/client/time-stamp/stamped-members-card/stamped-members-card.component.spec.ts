import { TimeStampModule } from '@plano/client/time-stamp/time-stamp.module';
import { TimeStampApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { StampedMembersCardComponent } from './stamped-members-card.component';

describe('StampedMembersCardComponent #needsapi', () => {
	let component : StampedMembersCardComponent;

	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [TimeStampModule] });

	beforeAll((done) => {
		testingUtils.login({
			success: () => {
				testingUtils.unloadAndLoadApi(TimeStampApiService, () => {
					component = testingUtils.createComponent(StampedMembersCardComponent);
					done();
				});
			},
		});
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
