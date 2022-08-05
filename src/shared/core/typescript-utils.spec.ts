import { EnumUtils } from './typescript-utils';
import { RegisterTestAccountApiHowDoYouKnow } from '../api';

describe('#EnumUtils', () => {
	describe('getValues()', () => {
		it('should work with enums with no explicitly defined values', () => {
			enum Food { BANANA, APPLE }
			const result = EnumUtils.getValues(Food);
			expect(result).toEqual([0, 1]);
		});
		it('should work with enums with explicitly defined string values', () => {
			enum Food { BANANA = 'banana', APPLE = 'apple' }
			const result = EnumUtils.getValues<string>(Food);
			expect(result).toEqual(['banana', 'apple']);
		});
		it('should work with enums with explicitly defined number values', () => {
			enum Food { BANANA = 100, APPLE = 200 }
			expect(EnumUtils.getValues(Food)).toEqual([100, 200]);
		});
		it('should work with RegisterTestAccountApiHowDoYouKnow', () => {
			expect(EnumUtils.getValues(RegisterTestAccountApiHowDoYouKnow)).toEqual([1, 2, 3, 4, 5, 6]);
		});
	});
});
