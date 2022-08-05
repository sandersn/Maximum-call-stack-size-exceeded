import { PipeTransform } from '@angular/core';
import { Injectable } from '@angular/core';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '@plano/shared/core/config';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../shared/core/null-type-utils';

export class DateInfo {
	public start : string | null = null;
	public separator : string | null = null;
	public end : string | null = null;
	public full : string | null = null;
}

type MomentJsFormat = string;

@Injectable()
export class FormattedDateTimePipe implements PipeTransform {
	constructor(
		private pMoment : PMomentService,
		private datePipe : PDatePipe,
	) {
	}

	private getDayAndMonthFormat(veryShort : boolean, showWeekday : boolean, locale : PSupportedLocaleIds) : MomentJsFormat {
		let result = showWeekday ? 'dddd, ' : '';
		switch (locale) {
			case PSupportedLocaleIds.de_AT :
			case PSupportedLocaleIds.de_CH :
			case PSupportedLocaleIds.de_DE :
			case PSupportedLocaleIds.de_LU :
				result += veryShort ? 'DD.MM.' : 'DD. MMMM ';
				break;
			case PSupportedLocaleIds.en_NL :
			case PSupportedLocaleIds.en_BE :
			case PSupportedLocaleIds.en_GB :
			case PSupportedLocaleIds.en_CZ :
			case PSupportedLocaleIds.en_SE :
				result += veryShort ? 'DD/MM' : 'DD. MMMM ';
				break;
			case PSupportedLocaleIds.en :
				result += veryShort ? 'MM/DD' : 'DD. MMMM ';
				break;
			default :
				throw new Error('Locale not supported yet.');
		}
		return result;
	}

	private getYearFormat(veryShort : boolean, locale : PSupportedLocaleIds) : string {
		switch (locale) {
			case PSupportedLocaleIds.de_AT :
			case PSupportedLocaleIds.de_CH :
			case PSupportedLocaleIds.de_DE :
			case PSupportedLocaleIds.de_LU :
				return veryShort ? 'YY' : ' YYYY';
			case PSupportedLocaleIds.en_NL :
			case PSupportedLocaleIds.en_BE :
			case PSupportedLocaleIds.en_GB :
			case PSupportedLocaleIds.en_CZ :
			case PSupportedLocaleIds.en_SE :
			case PSupportedLocaleIds.en :
				return veryShort ? '/YY' : ' YYYY';
			default :
				throw new Error('Locale not supported yet.');
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getFormattedDateInfo(
		start : number | null,
		_end : number | null,
		veryShort : boolean = false,
		// Only for intervals. E.g. in an absence.
		isExclusiveEnd ?: boolean,
		showWeekday ?: boolean,
	) : DateInfo {
		const result : DateInfo = {
			start: null,
			separator: null,
			end: null,
			full: null,
		};

		if (start === null && _end === null) return result;

		const DAY_AND_MONTH_FORMAT : string = this.getDayAndMonthFormat(veryShort, !!showWeekday, Config.LOCALE_ID);
		const YEAR_FORMAT : string = this.getYearFormat(veryShort, Config.LOCALE_ID);

		const mStart = this.pMoment.m(start);

		let startDM = mStart.format(DAY_AND_MONTH_FORMAT);
		let startY = mStart.format(YEAR_FORMAT);

		let endDM = '';
		let endY = '';

		let resultSeparator = ' – ';

		if (_end) {
			const END = !isExclusiveEnd ? _end : _end - 1;
			const mEnd = this.pMoment.m(END);

			endDM = mEnd.format(DAY_AND_MONTH_FORMAT);
			endY = mEnd.format(YEAR_FORMAT);

			const SAME_D = mStart.isSame(END, 'day');
			const SAME_Y = mStart.isSame(END, 'year');

			if (SAME_D) resultSeparator = '';

			if (SAME_Y) {
				startY = '';
				if (SAME_D) {
					startDM = '';
				}
			}
		} else {
			resultSeparator = '';
		}
		const resultStart = startDM + startY;
		const resultEnd = endDM + endY;
		result.start = resultStart;
		result.separator = resultSeparator;
		result.end = resultEnd;
		result.full = resultStart + resultSeparator + resultEnd;
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getFormattedTimeInfo(
		start : number,
		end ?: number,
		veryShort ?: boolean,
	) : DateInfo {
		const result : DateInfo = { start: null, separator: null, end: null, full: null };

		const TRANSFORMED_START = this.datePipe.transform(start, !veryShort ? 'shortTime' : 'veryShortTime');
		result.start = TRANSFORMED_START !== '-' ? TRANSFORMED_START : null;
		if (end) {
			const END = this.datePipe.transform(end, !veryShort ? 'shortTime' : 'veryShortTime');
			result.end = result.start !== END ? END : null;

			if (result.end && result.start !== result.end) result.separator = ' – ';
		}
		assumeDefinedToGetStrictNullChecksRunning(result.start, 'result.start');
		result.full = result.end ? result.start + (result.separator ?? ' ') + result.end : result.start;

		return result;
	}

	public transform(
		start : number,
		end ?: number,
		veryShort ?: boolean,
		showWeekday ?: boolean,
	) : DateInfo;
	public transform(
		start : number,
		end : number | undefined,
		veryShort : boolean | undefined,
		showWeekday : boolean | undefined,
		part : keyof DateInfo,
	) : DateInfo;

	/**
	 * Provide a start and an end and it turns it into the shortest human readable format.
	 * @example start 01.01.2020 12:12 and end 02.12.2020 12:12 becomes 01.01 - 12.12.2020 12:12
	 * @example start 01.12.2020 12:12 and end 12.12.2020 12:12 becomes 01. - 12.12.2020 12:12
	 * @param start Timestamp of start date and time
	 * @param end Timestamp of end date and time
	 * @param veryShort Boolean if you want the shortest format like 2.3.20 instead of 02. Mar. 2020
	 * @param veryShort Which part should be returned
	 */
	public transform(
		start : number,
		end ?: number,
		veryShort ?: boolean,
		showWeekday ?: boolean,
		part ?: keyof DateInfo,
	) : DateInfo | DateInfo['start'] | DateInfo['separator'] | DateInfo['end'] | DateInfo['full'] {
		const dateInfo = this.getFormattedDateInfo(start, end ?? null, veryShort, undefined, showWeekday);
		return part ? dateInfo[part] : dateInfo;
	}
}
