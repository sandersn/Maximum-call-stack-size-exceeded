import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PInputDateComponent } from './p-input-date.component';
describe('#PFormsModule#PInputDateComponent', () => {
    let component;
    const testingUtils = new TestingUtils();
    beforeEach(() => {
        component = testingUtils.createComponent(PInputDateComponent);
    });
    it('should have a defined component', () => {
        expect(component).toBeDefined();
    });
    it('should be able to execute setControlValue() [PLANO-14511]', () => {
        expect(() => {
            component.setControlValue();
        }).not.toThrow();
    });
});
//# sourceMappingURL=p-input-date.component.spec.js.map