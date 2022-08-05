import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { CoreModule } from '@plano/shared/core/core.module';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { NgbFormatsService } from './ngbformats.service';
import { PNgbDateTimeStruct } from './ngbformats.service';


describe('#NgbFormatsService', () => {
	let service : NgbFormatsService;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [CoreModule] });

	beforeEach((done) => {
		service = testingUtils.getService(NgbFormatsService);
		done();
	});

	it('should have a defined component', () => {
		expect(service).toBeDefined();
	});

	it('timestampToTimeStruct()', () => {
		const startTime : NgbTimeStruct = service.timestampToTimeStruct();
		expect(startTime).toBeDefined();
		expect(startTime.hour).toBe(new PMomentService(PSupportedLocaleIds.de_DE).m().hour());
	});

	it('timestampToDateStruct()', () => {
		const startDate : NgbDateStruct = service.timestampToDateStruct() as NgbDateStruct;

		// +1 because pMoment.m().month() returns 0 - 11
		// NgbTimeStruct.month needs format 1 - 12
		// more info: https://github.com/ng-bootstrap/ng-bootstrap/issues/839
		const currentMonth : number = new PMomentService(PSupportedLocaleIds.de_DE).m().month() + 1;

		expect(startDate).toBeDefined();
		expect(startDate.month).toBe(currentMonth);
	});

	it('dateTimeObjectToTimestamp()', () => {
		const time : NgbTimeStruct = service.timestampToTimeStruct();
		const date : NgbDateStruct = service.timestampToDateStruct() as NgbDateStruct;
		const dateTimeObject : PNgbDateTimeStruct = { ...time, ...date };
		const calculatedTimestamp : number | null = service.dateTimeObjectToTimestamp(dateTimeObject);

		const pMomentService = new PMomentService(PSupportedLocaleIds.de_DE);
		expect( pMomentService.m(calculatedTimestamp).year() ).toEqual( pMomentService.m().year() );
		expect( pMomentService.m(calculatedTimestamp).month() ).toEqual( pMomentService.m().month() );
		expect( pMomentService.m(calculatedTimestamp).date() ).toEqual( pMomentService.m().date() );
		expect( pMomentService.m(calculatedTimestamp).hour() ).toEqual( pMomentService.m().hour() );
	});


});
