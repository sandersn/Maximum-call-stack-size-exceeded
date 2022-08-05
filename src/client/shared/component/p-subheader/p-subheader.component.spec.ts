import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PSubheaderComponent } from './p-subheader.component';

describe('PSubheaderComponent #needsapi', () => {
	let component : PSubheaderComponent;

	const testingUtils = new TestingUtils();

	testingUtils.init({imports : [
		PSubheaderComponent,
	]});

	beforeAll((done) => {
		testingUtils.login({
			success: () => {
				component = testingUtils.createComponent(PSubheaderComponent);
				done();
			},
		});
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

	it('should have different texts when isNewItem differs', () => {
		component.isNewItem = true;
		const text1 = component.text;
		component.isNewItem = false;
		const text2 = component.text;
		expect(text1).not.toEqual(text2);
	});

});
