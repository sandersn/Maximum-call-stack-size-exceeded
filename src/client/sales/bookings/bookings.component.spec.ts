import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { SchedulingApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { LoginRole } from '@plano/shared/testing/testing-utils';
import { BookingsComponent } from './bookings.component';

describe('BookingsComponent #needsapi', () => {
	let component : BookingsComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [SchedulingModule] });

	beforeAll((done) => {
		testingUtils.login({
			role: LoginRole.CLIENT_DEFAULT,
			success: () => {
				testingUtils.unloadAndLoadApi(SchedulingApiService, () => {
					component = testingUtils.createComponent(BookingsComponent);
					done();
				}, testingUtils.getApiQueryParams('bookings'));
			},
		});
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
