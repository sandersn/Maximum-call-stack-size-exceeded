import { DAYS_OF_WEEK } from 'angular-calendar';
import * as moment from 'moment-timezone';
import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { Integer} from '@plano/shared/api/base/generated-types.ag';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { assumeNonNull } from '../../shared/core/null-type-utils';

/* eslint-disable-next-line @typescript-eslint/no-namespace */
export namespace PMoment {
	export type Moment = moment.Moment;
	/* eslint-disable-next-line @typescript-eslint/no-namespace */
	export namespace unitOfTime {
		export type Base = moment.unitOfTime.Base;
	}
}

class PDuration {
	private inputTimestamp : number | null = null;
	constructor(inp : number | string | null) {
		this.initValues(inp);
	}

	/**
	 * Set some default values for properties that are not defined yet
	 */
	public initValues(inp : number | string | null) : void {
		if (inp === null) return;
		switch (typeof inp) {
			case 'string' :
				this.inputTimestamp = +moment.duration(inp);
				break;
			case 'number' :
				this.inputTimestamp = inp;
				break;
			default :
				throw new Error('invalid input for PDuration');
		}
	}

	/** @see PDuration['as'] */
	public to(unit : moment.unitOfTime.Base) : number {
		return this.as(unit);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public as(unit : moment.unitOfTime.Base) : number {
		assumeNonNull(this.inputTimestamp);
		switch (unit) {
			case 'days' :
				return this.inputTimestamp / 864e5;
			case 'hours' :
				return this.inputTimestamp / 36e5;
			case 'minutes' :
				return this.inputTimestamp / 6e4;
			case 'seconds' :
				return this.inputTimestamp / 1000;
			case 'milliseconds' :
				return this.inputTimestamp;
			default :
				throw new Error('error');
		}
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public asMilliseconds() : number { return this.as('milliseconds'); }
	// eslint-disable-next-line jsdoc/require-jsdoc
	public asSeconds() : number { return this.as('seconds'); }
	// eslint-disable-next-line jsdoc/require-jsdoc
	public asMinutes() : number { return this.as('minutes'); }
	// eslint-disable-next-line jsdoc/require-jsdoc
	public asHours() : number { return this.as('hours'); }
	// eslint-disable-next-line jsdoc/require-jsdoc
	public asDays() : number { return this.as('days'); }

	// eslint-disable-next-line jsdoc/require-jsdoc
	public format(format : 'HH:mm') : string {
		// eslint-disable-next-line sonarjs/no-small-switch
		switch (format) {
			case 'HH:mm' :
				const duration = moment.duration(this.inputTimestamp);
				const date = moment.utc(0);
				date.add(duration.hours(), 'hours');
				date.add(duration.minutes(), 'minutes');
				return date.format(format);
			default :
				throw new Error('This format could work but has not been tested yet');
		}
	}
}

/**
 * This Service provides the same functionality as moment.js.
 *
 * This Service exists for these reasons:
 * - To have a single point in our app where moment.js gets the LOCALE_ID.
 * - To overwrite a buggy moment.js function.
 * - To step by step in the future.
 *
 * I replaced all moment.duration(…) with this.pMoment.duration(…)
 * And all moment(…) with this.pMoment.m(…)
 */

@Injectable()
export class PMomentService {
	public type = moment;

	constructor(

		/*
		 * NOTE: You can set locale to undefined (like this: `new PMomentService(undefined)`)
		 * if you only want to use locale un-aware methods
		 */
		@Inject(LOCALE_ID) private locale ?: PSupportedLocaleIds,
		private console ?: LogService,
	) {
		const LOCALE = locale ?? Config.LOCALE_ID;
		moment.locale(Config.getLanguageCode(LOCALE));
		const TIME_ZONE = Config.getTimeZone(LOCALE);
		if (Config.DEBUG && this.console && !TIME_ZONE) this.console.warn('TIME_ZONE is not defined');
		moment.tz.setDefault(TIME_ZONE ?? undefined);
		moment.updateLocale(Config.getLanguageCode(LOCALE), {
			week: {
				dow: DAYS_OF_WEEK.MONDAY,
				doy: 0,
			},
		});
		// console.log('getLocaleFirstDayOfWeek(this.locale)', getLocaleFirstDayOfWeek(this.locale));
	}

	/**
	 * @deprecated use PMomentService.d(…) instead of this.pMoment.duration(…) if possible
	 * If not possible, tell Nils about it.
	 */
	public duration(inp ?: moment.DurationInputArg1, unit ?: moment.DurationInputArg2) : moment.Duration {
		return moment.duration(inp, unit);
	}

	/** @deprecated use static instead. Replace `this.pMomentService.d(` with `PMomentService.d(` */
	public d(inp ?: number | string) : PDuration {
		return PMomentService.d(inp);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public static d(inp ?: number | string) : PDuration {
		return new PDuration(inp !== undefined ? inp : null);
	}

	/**
	 * This is the implementation of the "days-from-now" min/max validator. See api xml documentation for more info.
	 * @param daysCount Number of days relative to now. Can be negative.
	 * @returns A moment calculated by `daysCount` relative to now.
	 */
	public daysFromNow(daysCount : Integer) : moment.Moment {
		if (daysCount >= 0) {
			return moment().endOf('day').add(daysCount, 'days');
		} else {
			return moment().startOf('day').add(daysCount, 'days');
		}
	}

	/**
	 * This is the implementation of the "months-from-now" min/max validator. See api xml documentation for more info.
	 * @param monthsCount Number of months relative to now. Can be negative.
	 * @returns A moment calculated by `monthsCount` relative to now.
	 */
	public monthsFromNow(monthsCount : Integer) : moment.Moment {
		if (monthsCount >= 0) {
			return moment().endOf('day').add(monthsCount, 'months');
		} else {
			return moment().startOf('day').add(monthsCount, 'months');
		}
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public m(inp ?: moment.MomentInput, format ?: moment.MomentFormatSpecification, strict ?: boolean) : moment.Moment {
		const LOCALE = this.locale ? Config.getLanguageCode(this.locale) : this.locale;
		if (!LOCALE || LOCALE !== moment.locale()) {
			let errorMsg = `Locale aware method probably returns unexpected result. this.locale is ${LOCALE}; moment.locale() is ${moment.locale()}.`;

			if (LOCALE) {
				errorMsg += ' The moment.locale will be updated.';
				moment.locale(LOCALE);
				moment.updateLocale(LOCALE, null);
			}

			if (!this.console && Config.DEBUG) {
				// eslint-disable-next-line no-console
				console.error('Please provide LogService here.');
				// eslint-disable-next-line no-console
				console.error(errorMsg);
			}
			if (this.console) this.console.warn(errorMsg);
		}
		if (!Config.TIME_ZONE) {
			const errorMsg = 'TIME_ZONE is not defined [PLANO-21080]';
			// eslint-disable-next-line no-console
			if (Config.DEBUG) if (this.console) { this.console.error(errorMsg); } else { console.error(errorMsg); }
			return moment(inp ?? undefined, format, strict);
		}
		const TIME_ZONE = Config.getTimeZone(this.locale ?? Config.LOCALE_ID);
		if (!TIME_ZONE) throw new Error('Could not get TIME_ZONE');
		return moment(inp ?? undefined, format, strict).tz(TIME_ZONE);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public utc(inp ?: moment.MomentInput, format ?: moment.MomentFormatSpecification, strict ?: boolean) : moment.Moment {
		return moment.utc(inp, format, strict);
	}
}
