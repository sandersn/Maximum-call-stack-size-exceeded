import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { TransmissionPreviewComponent } from './transmission-preview.component';
describe('#TransmissionPreviewComponent', () => {
    let component;
    const testingUtils = new TestingUtils();
    testingUtils.init({ imports: [TransmissionPreviewComponent] });
    beforeAll(() => {
        component = testingUtils.createComponent(TransmissionPreviewComponent);
    });
    it('should have a defined component', () => {
        expect(component).toBeDefined();
    });
});
//# sourceMappingURL=transmission-preview.component.spec.js.map