import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { CoreModule } from '@plano/shared/core/core.module';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PInputDateService } from './p-input-date.service';


describe('#PInputDateService', () => {
	let service : PInputDateService;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [CoreModule] });

	beforeEach((done) => {
		service = testingUtils.getService(PInputDateService);
		done();
	});

	it('should have a defined component', () => {
		expect(service).toBeDefined();
	});

	it('should work on day of timesshift in germany [PLANO-9191]', () => {
		const result = service.convertNgbDateAndNgbTimeToTimestamp(
			PSupportedLocaleIds.de_DE,
			{
				year: 2020,
				month: 3,
				day: 29,
			},
			18000000,
			true,
		);
		expect(result).toBe(1585450800000);
	});

});
