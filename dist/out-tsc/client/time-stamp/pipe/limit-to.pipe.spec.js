import { LimitToPipe } from './limit-to.pipe';
describe('LimitToPipe', () => {
    let pipe;
    beforeAll(() => {
        pipe = new LimitToPipe();
    });
    it('should return first two letters', () => {
        expect(pipe.transform('Hello World', '2')).toBe('He');
    });
});
//# sourceMappingURL=limit-to.pipe.spec.js.map