import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { SchedulingApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { EarningsBarComponent } from './earnings-bar.component';

describe('EarningsBarComponent #needsapi', () => {
	let component : EarningsBarComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({
		imports: [
			SchedulingModule,
		],
	});

	beforeEach((done) => {
		testingUtils.login({
			success: () => {
				testingUtils.unloadAndLoadApi(SchedulingApiService, () => {
					component = testingUtils.createComponent(EarningsBarComponent);
					done();
				},
				testingUtils.getApiQueryParams('calendar'));
			},
		});
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

	// it('new member should be invalid', () => {
	// 	expect( component.member.isValid() ).toBeDefined(false);
	// });

});
