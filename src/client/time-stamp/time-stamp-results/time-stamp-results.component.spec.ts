import { TimeStampModule } from '@plano/client/time-stamp/time-stamp.module';
import { TimeStampApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { TimeStampResultsComponent } from './time-stamp-results.component';

describe('TimeStampResultsComponent #needsapi', () => {
	let component : TimeStampResultsComponent;

	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [TimeStampModule] });

	beforeAll((done) => {
		testingUtils.login({
			success: () => {
				testingUtils.unloadAndLoadApi(TimeStampApiService, () => {
					component = testingUtils.createComponent(TimeStampResultsComponent);
					done();
				});
			},
		});
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
