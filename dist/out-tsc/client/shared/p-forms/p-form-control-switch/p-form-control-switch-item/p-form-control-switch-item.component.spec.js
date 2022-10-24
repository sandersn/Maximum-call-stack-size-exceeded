import { async, TestBed } from '@angular/core/testing';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PFormControlSwitchItemComponent } from './p-form-control-switch-item.component';
import { PFormsModule } from '../../p-forms.module';
describe('PFormControlSwitchItemComponent', () => {
    let component;
    let fixture;
    const testingUtils = new TestingUtils();
    testingUtils.init({ imports: [PFormsModule] });
    beforeEach(async(() => {
        component = testingUtils.createComponent(PFormControlSwitchItemComponent);
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(PFormControlSwitchItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=p-form-control-switch-item.component.spec.js.map