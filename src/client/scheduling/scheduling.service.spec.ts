import { NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { LogService } from '@plano/shared/core/log.service';
import { PCookieService } from '@plano/shared/core/p-cookie.service';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { SchedulingModule } from './scheduling.module';
import { SchedulingService } from './scheduling.service';
import { BookingsService } from './shared/p-bookings/bookings.service';


describe('#SchedulingService', () => {
	let service : SchedulingService;
	let bookingsService : BookingsService;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [SchedulingModule] });

	beforeAll((done) => {
		const zone = TestBed.inject(NgZone);
		const cookieService = TestBed.inject(PCookieService);
		const logService = TestBed.inject(LogService);
		bookingsService = TestBed.inject(BookingsService);
		service = new SchedulingService(
			zone,
			bookingsService,
			cookieService,
			logService,
			PSupportedLocaleIds.de_DE,
		);
		done();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('bookingsService', () => {
		it('should be defined', () => {
			expect(bookingsService).toBeDefined();
		});
	});
});
