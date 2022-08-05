import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PButtonComponent } from './p-button.component';
import { BootstrapRounded } from '../../bootstrap-styles.enum';
import { PFormsModule } from '../p-forms.module';

describe('#PFormsModule#PButtonComponent', () => {
	let component : PButtonComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [PFormsModule] });

	beforeAll(() => {
		component = testingUtils.createComponent(PButtonComponent);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('get isRoundedRight & get isRoundedLeft', () => {
		it('should be false', () => {
			expect(component.rounded === BootstrapRounded.RIGHT).toBeFalse();
			expect(component.rounded === BootstrapRounded.LEFT).toBeFalse();
			expect(component.rounded === BootstrapRounded.NONE).toBeFalse();
		});
	});
});
