import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { RightgroupHeaderComponent } from './rightgroup-header.component';
import { AccesscontrolModule } from '../accesscontrol.module';

describe('RightgroupHeaderComponent', () => {
	let component : RightgroupHeaderComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [AccesscontrolModule] });

	beforeAll(() => {
		component = testingUtils.createComponent(RightgroupHeaderComponent);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
