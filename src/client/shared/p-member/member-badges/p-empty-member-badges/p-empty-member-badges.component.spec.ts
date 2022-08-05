import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PEmptyMemberBadgesComponent } from './p-empty-member-badges.component';

describe('PEmptyMemberBadgesComponent', () => {
	let component : PEmptyMemberBadgesComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [SchedulingModule] });

	beforeAll((done) => {
		component = testingUtils.createComponent(PEmptyMemberBadgesComponent);
		done();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
