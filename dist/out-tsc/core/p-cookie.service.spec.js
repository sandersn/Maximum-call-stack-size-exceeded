import { PCookieService } from '@plano/shared/core/p-cookie.service';
import { FakeCookieService } from './cookie.service.mock';
import { LogService } from './log.service';
import { FakeMeService } from './me/me.service.mock';
import { PSentryService } from '../sentry/sentry.service';
describe('#PCookieService', () => {
    let service;
    let logService;
    let cookieService;
    let fakeMe;
    const setAndGet = (cookieName, setTo, returnValue) => {
        it(`setting ${cookieName} to ${setTo} should return ${returnValue}`, () => {
            service.put(cookieName, setTo);
            expect(service.get(cookieName)).toBe(returnValue);
        });
    };
    const setAndDontGet = (cookieName, setTo, returnValue) => {
        it(`setting ${cookieName} to ${setTo} should not return ${returnValue}`, () => {
            service.put(cookieName, setTo);
            expect(service.get(cookieName)).not.toBe(returnValue);
        });
    };
    beforeAll(() => {
        cookieService = new FakeCookieService(null, null);
        fakeMe = new FakeMeService();
        service = new PCookieService(cookieService, fakeMe, logService);
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
            expect(() => { service.put({ name: 'someString', prefix: null }, true); }).not.toThrow();
        });
        it('turn boolean into string', () => {
            service.put({ name: 'someString', prefix: null }, true);
            expect(service.get({ name: 'someString', prefix: null })).toBe('true');
        });
        it('turn number into string', () => {
            service.put({ name: 'someString', prefix: null }, 3);
            expect(service.get({ name: 'someString', prefix: null })).toBe('3');
        });
    });
    describe('get()', () => {
        it('undefined', () => {
            expect(service.get({ name: 'hasNeverBeenSet', prefix: null })).toBe(undefined);
        });
        setAndGet({ name: 'someString', prefix: null }, true, 'true');
        setAndGet({ name: 'someString', prefix: null }, false, 'false');
        setAndGet({ name: 'someString', prefix: null }, 'Hans', 'Hans');
        setAndGet({ name: 'someString', prefix: null }, true, 'true');
        setAndGet({ name: 'someString', prefix: null }, false, 'false');
        setAndGet({ name: 'someString', prefix: null }, 'Hans', 'Hans');
        setAndDontGet({ name: 'someString', prefix: null }, true, 'false');
        setAndDontGet({ name: 'someString', prefix: null }, 'Hans', 'Wurst');
    });
    describe('has()', () => {
        it('should be true', () => {
            service.put({ name: 'lfw4', prefix: null }, 'few');
            expect(service.has({ name: 'lfw4', prefix: null })).toBe(true);
        });
        it('should be false', () => {
            service.put({ name: 'lfw4', prefix: null }, 'few');
            expect(service.has({ name: 'neverHasBeenSet', prefix: null })).toBe(false);
        });
    });
    describe('remove()', () => {
        it('should be removed', () => {
            service.put({ name: 'lfw4', prefix: null }, 'few');
            service.remove({ name: 'lfw4', prefix: null });
            expect(service.has({ name: 'lfw4', prefix: null })).toBe(false);
        });
    });
});
//# sourceMappingURL=p-cookie.service.spec.js.map