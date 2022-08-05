import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PShiftmodelListItemComponent } from '../shiftmodel-list-item/shiftmodel-list-item.component';

describe('#PShiftmodelListItemComponent', () => {
	let component : PShiftmodelListItemComponent;
	const testingUtils = new TestingUtils();

	beforeEach(() => {
		component = testingUtils.createComponent(PShiftmodelListItemComponent);
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
