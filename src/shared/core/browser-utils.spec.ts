import { getBrowserInfoByUserAgent } from './browser-utils';

describe('getBrowserInfoByUserAgent', () => {
	it('should be defined', () => {
		expect(getBrowserInfoByUserAgent('')).toBeDefined();
	});

	it('should work for opera', () => {
		const browserInfo = getBrowserInfoByUserAgent('Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.168 Safari/537.36 OPR/51.0.2830.40');
		expect(browserInfo).toBeDefined();
		expect(browserInfo.name).toBe('opera');
		expect(browserInfo.version).toBe(51);
	});

	it('should work for some older edge', () => {
		const browserInfo = getBrowserInfoByUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393');
		expect(browserInfo).toBeDefined();
		expect(browserInfo.name).toBe('edge');
		expect(browserInfo.version).toBe(14);
	});

	it('should work for some newer edge', () => {
		const browserInfo = getBrowserInfoByUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36 Edg/90.0.818.46');
		expect(browserInfo).toBeDefined();
		expect(browserInfo.name).toBe('edge');
		expect(browserInfo.version).toBe(90);
	});

	it('should work for some newer edge on android', () => {
		const browserInfo = getBrowserInfoByUserAgent('User-Agent: Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Mobile Safari/537.36 EdgA/90.0.818.46');
		expect(browserInfo).toBeDefined();
		expect(browserInfo.name).toBe('edge');
		expect(browserInfo.version).toBe(90);
	});

	it('should work for some older edge', () => {
		const browserInfo = getBrowserInfoByUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36');
		expect(browserInfo).toBeDefined();
		expect(browserInfo.name).toBe('chrome');
		expect(browserInfo.version).toBe(96);
	});
});
