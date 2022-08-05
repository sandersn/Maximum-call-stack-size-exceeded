import { PSentryService } from './sentry.service';

const getReplacedItemsAmount = (textReplaceReturnObject : ReturnType<PSentryService['removeVarsFromText']>, id : string) : number => {
	return textReplaceReturnObject.replacedItems.filter(item => Object.keys(item)[0].includes(id)).length;
};

describe('PSentryService', () => {
	let service : PSentryService;

	beforeAll(() => {
		service = new PSentryService();
	});

	describe('removeVarsFromText', () => {

		it(`('') ➡ ''`, () => {
			expect(service.removeVarsFromText('').text).toBe('');
		});

		it(`('Error: Could not find item »205434191«') ➡ 'Error: Could not find item »<number_0>«'`, () => {
			expect(service.removeVarsFromText('Error: Could not find item »205434191«').text).toBe('Error: Could not find item »<number_0>«');
		});

		it(`('/de/foo/bar/') ➡ '/de/foo/bar'`, () => {
			const replaceObject = service.removeVarsFromText('/de/foo/bar/');
			expect(replaceObject.text).toBe('/de/foo/bar');
		});

		it(`('/de/client/shift/12345,0,0,0,61,1654034400000,1654120800000,2344/start-date/1234567890123/') ➡ '/de/client/shift/<shiftId_0>/start-date/<timestamp_0>'`, () => {
			const replaceObject = service.removeVarsFromText('/de/client/shift/12345,0,0,0,61,1654034400000,1654120800000,2344/start-date/1234567890123/');
			expect(replaceObject.text).toBe('/de/client/shift/<shiftId_0>/start-date/<timestamp_0>');
			expect(getReplacedItemsAmount(replaceObject, 'shiftId')).toBe(1);
			expect(getReplacedItemsAmount(replaceObject, 'timestamp')).toBe(1);
		});
		it(`('/de/client/shift/12345,0,0,0,61,1654034400000,1654120800000,2344,DP-12-FE323/start-date/1234567890123/') ➡ '/de/client/shift/<shiftId_0>/start-date/<timestamp_0>'`, () => {
			const replaceObject = service.removeVarsFromText('/de/client/shift/12345,0,0,0,61,1654034400000,1654120800000,2344,DP-12-FE323/start-date/1234567890123/');
			expect(replaceObject.text).toBe('/de/client/shift/<shiftId_0>/start-date/<timestamp_0>');
			expect(getReplacedItemsAmount(replaceObject, 'shiftId')).toBe(1);
			expect(getReplacedItemsAmount(replaceObject, 'timestamp')).toBe(1);
		});

		it(`('/de/client/report/1111111111111/9999999999999') ➡ '/de/client/report/<timestamp_0>/<timestamp_1>`, () => {
			const replaceObject = service.removeVarsFromText('/de/client/report/1111111111111/9999999999999');
			expect(replaceObject.text).toBe('/de/client/report/<timestamp_0>/<timestamp_1>');
			expect(getReplacedItemsAmount(replaceObject, 'timestamp')).toBe(2);
		});
		it(`('/de/number/30294/timestamp/1111111111111/timestamp/1111111111114') ➡ '/de/number/<number_0>/timestamp/<timestamp_0>/timestamp/<timestamp_1>`, () => {
			const replaceObject = service.removeVarsFromText('/de/number/30294/timestamp/1111111111111/timestamp/1111111111114');
			expect(replaceObject.text).toBe('/de/number/<number_0>/timestamp/<timestamp_0>/timestamp/<timestamp_1>');
			expect(getReplacedItemsAmount(replaceObject, 'timestamp')).toBe(2);
		});
	});
});
