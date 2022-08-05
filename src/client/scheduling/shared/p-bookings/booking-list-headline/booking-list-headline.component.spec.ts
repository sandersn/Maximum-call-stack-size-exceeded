import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { BookingListHeadlineComponent } from './booking-list-headline.component';

describe('BookingListHeadlineComponent', () => {
	let component : BookingListHeadlineComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [SchedulingModule] });

	beforeAll((done) => {
		component = testingUtils.createComponent(BookingListHeadlineComponent);
		done();
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});
});
