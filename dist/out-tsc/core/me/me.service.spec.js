import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { MeService } from './me.service';
describe('MeService #needsapi', () => {
    const testingUtils = new TestingUtils();
    let me;
    testingUtils.init({
        imports: [],
        providers: [MeService],
    });
    beforeAll(() => {
        me = testingUtils.getService(MeService);
    });
    describe('login', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        it('wrong-email', (done) => {
            me.login(me.calcBasisAuthValue('asdasd@asdasd.de', 'asd'), false, true, () => {
                fail();
                done();
            }, (response) => {
                expect(response).not.toBe('not_ascii');
                expect(response.status).toBe(401);
                done();
            });
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        it('wrong-password', (done) => {
            me.login(me.calcBasisAuthValue('adam@dr-plano.de', 'asd'), false, true, () => {
                fail();
                done();
            }, (response) => {
                expect(response).not.toBe('not_ascii');
                expect(response.status).toBe(401);
                done();
            });
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        it('correct-data', (done) => {
            me.login(me.calcBasisAuthValue('adam@dr-plano.de', 'Drp123.'), false, true, () => {
                expect().nothing();
                done();
            }, () => {
                fail();
                done();
            });
        });
    });
});
//# sourceMappingURL=me.service.spec.js.map