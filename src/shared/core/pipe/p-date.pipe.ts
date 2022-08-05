import * as moment from 'moment-timezone';
import { DatePipe } from '@angular/common';
import { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import { PSupportedLanguageCodes, PSupportedLocaleIds } from '../../api/base/generated-types.ag';
import { Config } from '../config';
import { LogService } from '../log.service';
import { PSupportedTimeZoneOffset } from '../time-zones.enums';

export enum AngularDatePipeFormat {

	/**	E.g. `14.04.20, 19:52` */
	SHORT = 'short',

	/**	E.g. `13.09.2021, 16:00:00` */
	MEDIUM = 'medium',
	LONG = 'long',
	FULL = 'full',

	SHORT_DATE = 'shortDate',

	/**	E.g. `13.09.2021` */
	MEDIUM_DATE = 'mediumDate',

	LONG_DATE = 'longDate',
	FULL_DATE = 'fullDate',

	/**	E.g. `16:00 Uhr` */
	SHORT_TIME = 'shortTime',

	MEDIUM_TIME = 'mediumTime',
	LONG_TIME = 'longTime',
	FULL_TIME = 'fullTime',
}

/** Custom dates for plano */
export enum PDateFormat {

	/**	E.g. `13.9.` */
	MINIMAL_DATE = 'minimalDate',

	/**	E.g. `13.09.21` */
	VERY_SHORT_DATE = 'veryShortDate',

	/**	E.g. `16:00` */
	VERY_SHORT_TIME = 'veryShortTime',
}

// TODO: get rid of `| string`
export type DateFormats = AngularDatePipeFormat | PDateFormat | string;

@Pipe({ name: 'date' })

export class PDatePipe implements PipeTransform {
	constructor(
		private datePipe : DatePipe,
		private console ?: LogService | null,
	) {
	}

	private getCustomAppend(locale : PSupportedLocaleIds, format ?: DateFormats) : string {
		const LANGUAGE : PSupportedLanguageCodes = Config.getLanguageCode(locale);
		// eslint-disable-next-line sonarjs/no-small-switch
		switch (format) {
			case 'shortTime' :
				if (LANGUAGE === PSupportedLanguageCodes.de) return ' Uhr';
				return '';
			default:
				return '';
		}
	}

	private getShortTimeFormat(format : DateFormats | string, locale : PSupportedLocaleIds) : DateFormats | string {
		if (locale === PSupportedLocaleIds.en_NL) return 'HH:mm';
		return format;
	}
	private getVeryShortTimeFormat(_format : DateFormats, locale : PSupportedLocaleIds) : DateFormats {
		if (locale === PSupportedLocaleIds.en_NL) return 'HH:mm';
		return 'shortTime';
	}
	private getMinimalDateFormat(format : DateFormats, locale : PSupportedLocaleIds) : DateFormats {
		switch (locale) {
			case PSupportedLocaleIds.de_AT :
			case PSupportedLocaleIds.de_CH :
			case PSupportedLocaleIds.de_DE :
			case PSupportedLocaleIds.de_LU :
				return 'd.M.';
			case PSupportedLocaleIds.en_NL :
			case PSupportedLocaleIds.en_BE :
			case PSupportedLocaleIds.en_GB :
			case PSupportedLocaleIds.en_CZ :
			case PSupportedLocaleIds.en_SE :
				return 'd/M';
			case PSupportedLocaleIds.en :
				return 'M/d';
			default :
				throw new Error(this.throwText(format, locale));
		}
	}
	private getVeryShortDateFormat(format : DateFormats, locale : PSupportedLocaleIds) : DateFormats {
		const LANGUAGE : PSupportedLanguageCodes = Config.getLanguageCode(locale);
		if (LANGUAGE === PSupportedLanguageCodes.de) return 'dd.MM.yy';
		switch (locale) {
			case PSupportedLocaleIds.de_AT :
			case PSupportedLocaleIds.de_CH :
			case PSupportedLocaleIds.de_DE :
			case PSupportedLocaleIds.de_LU :
				return 'dd.MM.yy';
			case PSupportedLocaleIds.en_NL :
			case PSupportedLocaleIds.en_BE :
			case PSupportedLocaleIds.en_GB :
			case PSupportedLocaleIds.en_CZ :
			case PSupportedLocaleIds.en_SE :
				return 'dd/MM/yy';
			case PSupportedLocaleIds.en :
				return 'MM/dd/yy';
			default :
				throw new Error(this.throwText(format, locale));
		}
	}
	private getShortDateFormat(format : DateFormats, locale : PSupportedLocaleIds) : DateFormats {
		const LANGUAGE : PSupportedLanguageCodes = Config.getLanguageCode(locale);
		if (LANGUAGE === PSupportedLanguageCodes.de) return 'dd.MM.yyyy';
		// eslint-disable-next-line sonarjs/no-small-switch
		switch (locale) {
			case PSupportedLocaleIds.en_NL :
				return 'dd/MM/yyyy';
			default :
				return format;
		}
	}

	private turnIntoAngularFormat(locale : PSupportedLocaleIds, format : DateFormats) : DateFormats {
		switch (format) {
			case 'shortTime' :
				return this.getShortTimeFormat(format, locale);
			case 'veryShortTime' :
				return this.getVeryShortTimeFormat(format, locale);
			case 'minimalDate' :
				return this.getMinimalDateFormat(format, locale);
			case 'veryShortDate' :
				return this.getVeryShortDateFormat(format, locale);
			case 'shortDate' :
				return this.getShortDateFormat(format, locale);
			default:
				return format;
		}
	}

	public transform(
		value : number,
		format ?: DateFormats,
		timezoneInput ?: PSupportedTimeZoneOffset,
		locale ?: PSupportedLocaleIds,
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	) : '-' | string;
	public transform(
		value : number | null,
		format ?: DateFormats,
		timezoneInput ?: PSupportedTimeZoneOffset,
		locale ?: PSupportedLocaleIds,
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	) : '-' | string | null;

	/**
	 * Generate human readable date from given timestamp
	 */
	public transform(
		value : number | null,
		format ?: DateFormats,
		timezoneInput ?: PSupportedTimeZoneOffset,
		locale ?: PSupportedLocaleIds,
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	) : '-' | string | null {
		// In your app it is not possible to set a date to timestamp 30.12.1969 23:59:59:999 aka timestamp -1
		if (value === null) return '-';

		const LOCALE : PSupportedLocaleIds = locale ?? Config.LOCALE_ID;

		const APPEND = this.getCustomAppend(LOCALE, format);
		if (format !== undefined) {
			// We support more formats than the angular date pipe (e.g. 'veryShortDate'). They will be processed here.
			format = this.turnIntoAngularFormat(LOCALE, format);
		}

		let timezoneOffset : PSupportedTimeZoneOffset;
		if (timezoneInput) {
			timezoneOffset = timezoneInput;
		} else {
			const TIME_ZONE = Config.getTimeZone(LOCALE);
			if (!TIME_ZONE) {
				const errorMsg = 'PDatePipe: TIME_ZONE is not defined [PLANO-21080]';
				if (Config.DEBUG) if (this.console) { this.console.error(errorMsg); } else { console.error(errorMsg); } // eslint-disable-line no-console
			}
			const mom = TIME_ZONE ? moment(value).tz(TIME_ZONE) : moment(value);
			timezoneOffset = mom.format('ZZ') as PSupportedTimeZoneOffset;
		}

		const date = this.datePipe.transform(value, format, timezoneOffset, LOCALE);
		if (date === null) return null;
		return `${date}${APPEND}`;
	}

	private throwText(format : string, locale ?: string) : string {
		throw new Error(`date format for »${format}« is not defined for »${locale ?? Config.LOCALE_ID}« yet`);
	}
}
