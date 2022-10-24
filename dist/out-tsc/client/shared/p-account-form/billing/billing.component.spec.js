import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { BillingComponent } from './billing.component';
describe('#BillingComponent', () => {
    let component;
    const testingUtils = new TestingUtils();
    beforeEach(() => {
        component = testingUtils.createComponent(BillingComponent);
    });
    it('should have a defined component', () => {
        expect(component).toBeDefined();
    });
});
//# sourceMappingURL=billing.component.spec.js.map