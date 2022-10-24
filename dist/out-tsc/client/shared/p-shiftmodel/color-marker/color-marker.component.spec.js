import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { ColorMarkerComponent } from './color-marker.component';
describe('#ColorMarkerComponent', () => {
    let component;
    const testingUtils = new TestingUtils();
    beforeEach(() => {
        component = testingUtils.createComponent(ColorMarkerComponent);
    });
    it('should have a defined component', () => {
        expect(component).toBeDefined();
    });
});
//# sourceMappingURL=color-marker.component.spec.js.map