import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { WeekCellComponent } from './week-cell.component';
import { PSchedulingCalendarModule } from '../../../p-calendar.module';
describe('WeekCellComponent', () => {
    let component;
    const testingUtils = new TestingUtils();
    testingUtils.init({ imports: [PSchedulingCalendarModule] });
    beforeAll(() => {
        component = testingUtils.createComponent(WeekCellComponent);
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=week-cell.component.spec.js.map