import { Meta } from '@plano/shared/api';
import { NOT_CHANGED, ObjectDiff } from './object-diff';

describe('#ObjectDiff', function() {
	it('diff lists', function() {
		const diff = ObjectDiff.diff([true, 1, 2, 3], [true, 1, 3, 4, 5]);
		expect(diff).toEqual([true, [4, 5], [2]]);
	});

	it('diff objects', function() {
		const diff = ObjectDiff.diff([1, true, 4, 30, 10], [1, true, 5, 40, 10]);
		expect(diff).toEqual([1, NOT_CHANGED, 5, 40]);
	});

	it('diff atomic objects', function() {
		const diff = ObjectDiff.diff([[1, false, true], 1, 2, 3, 4], [[1, false, true], 1, 10, 3, 4]);
		expect(diff).toEqual([[1, false, true], 1, 10, 3, 4]);
	});

	it('merging a diff', function() {
		const data = [[0, true], [1, true, 'a', [true, 1, 3, 7]], 		[2, false, 'c', [true, [1, [true, 3]]]], [4, true]];
		const dataNew = [[0, true], [1, false, 'b', [true, 1, 3, 15]], 	[2, true, 'c', 	[true, [1, [true, 3]], [2, [true, 3]]]], [3, 1]];

		const diff = ObjectDiff.diff(data, dataNew);
		ObjectDiff.merge(data, diff);

		// merging the diff should result into the new data
		expect(data).toEqual(dataNew);
	});

	it('structure is preserved', function() {
		// Not only the "data" should be copied but also the array structure. This is important
		// when calling diff+merge on a new item which should still have valid array structure after merging.
		const data = [true];

		const newItem = Meta.createNewObject(false);
		newItem[3] = [true]; // add empty structure without data
		newItem[5] = [196];

		const dataNew : any[] = [true, newItem];

		const diff = ObjectDiff.diff(data, dataNew);
		ObjectDiff.merge(data, diff);

		// merging the diff should result into the new data
		expect(data).toEqual(dataNew);
	});
});
