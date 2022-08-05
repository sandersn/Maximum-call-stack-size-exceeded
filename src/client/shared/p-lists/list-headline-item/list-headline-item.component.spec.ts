import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { ListHeadlineItemComponent } from './list-headline-item.component';

describe('ListHeadlineItemComponent', () => {
	let component : ListHeadlineItemComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [SchedulingModule] });

	beforeAll((done) => {
		component = testingUtils.createComponent(ListHeadlineItemComponent);
		done();
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
