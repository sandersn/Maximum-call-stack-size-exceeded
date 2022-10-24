import { ShiftExchangeModule } from '@plano/client/shift-exchange/shift-exchange.module';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PShiftExchangeCommunicationModalComponent } from './p-shift-exchange-communication-modal.component';
describe('PShiftExchangeCommunicationModalComponent', () => {
    let component;
    const testingUtils = new TestingUtils();
    testingUtils.init({ imports: [ShiftExchangeModule] });
    beforeAll(() => {
        component = testingUtils.createComponent(PShiftExchangeCommunicationModalComponent);
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=p-shift-exchange-communication-modal.component.spec.js.map