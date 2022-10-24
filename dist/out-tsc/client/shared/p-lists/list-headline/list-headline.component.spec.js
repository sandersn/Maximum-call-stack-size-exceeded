import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { SchedulingApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { ListHeadlineComponent } from './list-headline.component';
describe('ListHeadlineComponent #needsapi', () => {
    let component;
    const testingUtils = new TestingUtils();
    testingUtils.init({ imports: [SchedulingModule] });
    beforeAll((done) => {
        testingUtils.login({
            success: () => {
                testingUtils.unloadAndLoadApi(SchedulingApiService, () => {
                    component = testingUtils.createComponent(ListHeadlineComponent);
                    done();
                }, testingUtils.getApiQueryParams('calendar'));
            },
        });
    });
    it('should have a defined component', () => {
        expect(component).toBeDefined();
    });
});
//# sourceMappingURL=list-headline.component.spec.js.map