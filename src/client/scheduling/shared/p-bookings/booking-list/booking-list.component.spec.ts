import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { BookingListComponent } from './booking-list.component';

describe('BookingListComponent', () => {
	let component : BookingListComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [SchedulingModule] });

	beforeAll((done) => {
		component = testingUtils.createComponent(BookingListComponent);
		done();
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
