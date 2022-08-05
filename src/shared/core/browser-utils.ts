import { UAParser } from 'ua-parser-js';

export type CommonBrowserNames = 'Amaya' | 'Android Browser' | 'Arora' | 'Avant' | 'Baidu' | 'Blazer' | 'Bolt' | 'Camino' | 'Chimera' | 'Chrome' | 'Chromium' | 'Comodo Dragon' | 'Conkeror' | 'Dillo' | 'Dolphin' | 'Doris' | 'Edge' | 'Epiphany' | 'Fennec' | 'Firebird' | 'Firefox' | 'Flock' | 'GoBrowser' | 'iCab' | 'ICE Browser' | 'IceApe' | 'IceCat' | 'IceDragon' | 'Iceweasel' | 'IE' | 'IE Mobile' | 'Iron' | 'Jasmine' | 'K-Meleon' | 'Konqueror' | 'Kindle' | 'Links' | 'Lunascape' | 'Lynx' | 'Maemo' | 'Maxthon' | 'Midori' | 'Minimo' | 'MIUI Browser' | 'Safari' | 'Mobile Safari' | 'Mosaic' | 'Mozilla' | 'Netfront' | 'Netscape' | 'NetSurf' | 'Nokia' | 'OmniWeb' | 'Opera Mini' | 'Opera Mobi' | 'Opera Tablet' | 'Phoenix' | 'Polaris' | 'QQBrowser' | 'RockMelt' | 'Silk' | 'Skyfire' | 'SeaMonkey' | 'SlimBrowser' | 'Swiftfox' | 'Tizen' | 'UCBrowser' | 'Vivaldi' | 'w3m' | 'Yandex' | 'Opera';
type LowercaseCommonBrowserNames = Lowercase<CommonBrowserNames>;
export type BrowserInfo = {
	nameUppercase : CommonBrowserNames | null,
	name : LowercaseCommonBrowserNames | null,
	version : number | null,
};

/**
 * We block access for some browsers. Usually because they are too old.
 * We don’t block all browser versions that angular does not have in there support list. We only block
 * those that cause too much trouble for our support colleagues.
 */
export const BROWSER_LIMITS : {
	name : BrowserInfo['name'],

	/** Set to null, if you want to block the whole browser, not only specific versions */
	lessThanOrEqual : number | null,
}[] = [
	{
		name: 'safari',
		lessThanOrEqual: 11,
	},
	{
		name: 'ie',
		lessThanOrEqual: null,
	},
	{
		name: 'edge',
		lessThanOrEqual: 83,
	},
	{
		name: 'chrome',
		lessThanOrEqual: 48,
	},
];

export const getBrowserInfoByUserAgent = (userAgent : string) : BrowserInfo => {
	const parser = new UAParser();
	parser.setUA(userAgent);
	const version = parser.getBrowser().version;

	const name = parser.getBrowser().name as CommonBrowserNames | undefined;
	const lowercaseName = name?.toLocaleLowerCase() as Lowercase<Exclude<typeof name, undefined>> | undefined;

	return {
		nameUppercase: name ?? null,
		name: lowercaseName ?? null,
		version: version ? +version.split('.')[0] : null,
	};
};
