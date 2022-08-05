/* eslint-disable @typescript-eslint/no-explicit-any */
import { CookieService } from 'ngx-cookie-service';
import { PCookieKeyDataType} from '@plano/shared/core/p-cookie.service';
import { PCookieService } from '@plano/shared/core/p-cookie.service';
import { FakeCookieService } from './cookie.service.mock';
import { LogService } from './log.service';
import { FakeMeService } from './me/me.service.mock';
import { MeService } from '../api';
import { PSentryService } from '../sentry/sentry.service';

describe('#PCookieService', () => {
	let service : PCookieService;
	let logService : LogService;
	let cookieService : CookieService;
	let fakeMe : FakeMeService;

	const setAndGet = (cookieName : PCookieKeyDataType, setTo : string | number | boolean, returnValue : string) : void => {
		it(`setting ${cookieName} to ${setTo} should return ${returnValue}`, () => {
			service.put(cookieName, setTo);
			expect(service.get(cookieName)).toBe(returnValue);
		});
	};
	const setAndDontGet = (cookieName : PCookieKeyDataType, setTo : string | number | boolean, returnValue : string) : void => {
		it(`setting ${cookieName} to ${setTo} should not return ${returnValue}`, () => {
			service.put(cookieName, setTo);
			expect(service.get(cookieName)).not.toBe(returnValue);
		});
	};

	beforeAll(() => {
		cookieService = new FakeCookieService(null, null) as unknown as CookieService;
		fakeMe = new FakeMeService();
		service = new PCookieService(cookieService, fakeMe as MeService, logService);
		const pSentryService = new PSentryService();
		logService = new LogService(pSentryService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	// TODO: Its difficult to tests a cookie-related service in angular. You probably need a spy. Not sure if this test
	// makes sense when using a spy.
	describe('put()', () => {
		it('should not throw', () => {
			expect(() => { service.put({ name: 'someString', prefix: null } as any, true); }).not.toThrow();
		});
		it('turn boolean into string', () => {
			service.put({name : 'someString', prefix : null} as any, true);
			expect(service.get({name: 'someString', prefix: null} as any)).toBe('true');
		});
		it('turn number into string', () => {
			service.put({name : 'someString', prefix : null} as any, 3);
			expect(service.get({name : 'someString', prefix : null} as any)).toBe('3');
		});
	});

	describe('get()', () => {
		it('undefined', () => {
			expect(service.get({name : 'hasNeverBeenSet', prefix : null} as any)).toBe(undefined);
		});

		setAndGet({name : 'someString', prefix : null} as any, true, 'true');
		setAndGet({name : 'someString', prefix : null} as any, false, 'false');
		setAndGet({name : 'someString', prefix : null} as any, 'Hans', 'Hans');

		setAndGet({name : 'someString', prefix : null} as any, true, 'true');
		setAndGet({name : 'someString', prefix : null} as any, false, 'false');
		setAndGet({name : 'someString', prefix : null} as any, 'Hans', 'Hans');

		setAndDontGet({name : 'someString', prefix : null} as any, true, 'false');
		setAndDontGet({name : 'someString', prefix : null} as any, 'Hans', 'Wurst');
	});

	describe('has()', () => {
		it('should be true', () => {
			service.put({name: 'lfw4', prefix: null} as any, 'few');
			expect(service.has({name: 'lfw4', prefix: null} as any)).toBe(true);
		});
		it('should be false', () => {
			service.put({name: 'lfw4', prefix: null} as any, 'few');
			expect(service.has({name: 'neverHasBeenSet', prefix: null} as any)).toBe(false);
		});
	});

	describe('remove()', () => {
		it('should be removed', () => {
			service.put({name: 'lfw4', prefix: null} as any, 'few');
			service.remove({name: 'lfw4', prefix: null} as any);
			expect(service.has({name: 'lfw4', prefix: null} as any)).toBe(false);
		});
	});
});
