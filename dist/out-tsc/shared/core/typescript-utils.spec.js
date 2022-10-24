import { EnumUtils } from './typescript-utils';
import { RegisterTestAccountApiHowDoYouKnow } from '../api';
describe('#EnumUtils', () => {
    describe('getValues()', () => {
        it('should work with enums with no explicitly defined values', () => {
            let Food;
            (function (Food) {
                Food[Food["BANANA"] = 0] = "BANANA";
                Food[Food["APPLE"] = 1] = "APPLE";
            })(Food || (Food = {}));
            const result = EnumUtils.getValues(Food);
            expect(result).toEqual([0, 1]);
        });
        it('should work with enums with explicitly defined string values', () => {
            let Food;
            (function (Food) {
                Food["BANANA"] = "banana";
                Food["APPLE"] = "apple";
            })(Food || (Food = {}));
            const result = EnumUtils.getValues(Food);
            expect(result).toEqual(['banana', 'apple']);
        });
        it('should work with enums with explicitly defined number values', () => {
            let Food;
            (function (Food) {
                Food[Food["BANANA"] = 100] = "BANANA";
                Food[Food["APPLE"] = 200] = "APPLE";
            })(Food || (Food = {}));
            expect(EnumUtils.getValues(Food)).toEqual([100, 200]);
        });
        it('should work with RegisterTestAccountApiHowDoYouKnow', () => {
            expect(EnumUtils.getValues(RegisterTestAccountApiHowDoYouKnow)).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });
});
//# sourceMappingURL=typescript-utils.spec.js.map