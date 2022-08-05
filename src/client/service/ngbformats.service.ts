import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';

export type PNgbDateTimeStruct = NgbTimeStruct & NgbDateStruct;

@Injectable()
export class NgbFormatsService {

	constructor(
		private pMoment : PMomentService,
		private console : LogService,
	) {
	}

	/**
	 * Transform provided timestamp into a NgbDateStruct
	 * Returns current date/time if no timestamp is provided
	 */
	public timestampToDateStruct(input ?: number, locale ?: PSupportedLocaleIds) : NgbDateStruct | '-' {
		const now = +(new PMomentService(locale, this.console).m());
		// eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
		const timestamp = input ? input : now;
		return {
			year: new PMomentService(locale, this.console).m(timestamp).year(),
			month: new PMomentService(locale, this.console).m(timestamp).month() + 1,
			day: new PMomentService(locale, this.console).m(timestamp).date(),
		};
	}

	/**
	 * Transform provided timestamp into a NgbTimeStruct
	 * Returns current date/time if no timestamp is provided
	 */
	public timestampToTimeStruct(input ?: number) : NgbTimeStruct {
		const now = +this.pMoment.m();
		// eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
		const timestamp = input ? input : now;
		return {
			hour: this.pMoment.m(timestamp).hour(),
			minute: this.pMoment.m(timestamp).minute(),
			second: this.pMoment.m(timestamp).second(),
		};
	}

	/**
	 * Takes a object with infos about date and/or time and generates Timestamp from it.
	 * @param dateTimeObject: date/time object where .month starts at 1.
	 */
	public dateTimeObjectToTimestamp(
		dateTimeObject : NgbDateStruct | NgbTimeStruct | PNgbDateTimeStruct | '-' | null,
		locale ?: PSupportedLocaleIds,
	) : number | null {

		// TODO: "!dateTimeObject" should be obsolete after turing on strictNullChecks
		if (dateTimeObject === null || dateTimeObject === '-') {
			if (Config.DEBUG && dateTimeObject === null) {
				throw new Error(`dateTimeObject === null is not supported!`);
			}
			return null;
		}

		const zeroIndexedMonth : {
			hour ?: number, minute ?: number, second ?: number,
			year ?: number, month ?: number, day ?: number,
		} = {
		};
		if (
			(dateTimeObject as Partial<NgbDateStruct>).year !== undefined &&
			(dateTimeObject as Partial<NgbDateStruct>).month !== undefined &&
			(dateTimeObject as Partial<NgbDateStruct>).day !== undefined
		) {
			zeroIndexedMonth.year = (dateTimeObject as NgbDateStruct).year;
			zeroIndexedMonth.month = (dateTimeObject as NgbDateStruct).month - 1;
			zeroIndexedMonth.day = (dateTimeObject as NgbDateStruct).day;
		}
		if (
			(dateTimeObject as Partial<NgbTimeStruct>).hour !== undefined &&
				(dateTimeObject as Partial<NgbTimeStruct>).minute !== undefined &&
				(dateTimeObject as Partial<NgbTimeStruct>).second !== undefined
		) {
			zeroIndexedMonth.hour = (dateTimeObject as NgbTimeStruct).hour;
			zeroIndexedMonth.minute = (dateTimeObject as NgbTimeStruct).minute;
			zeroIndexedMonth.second = (dateTimeObject as NgbTimeStruct).second;
		}
		return +(new PMomentService(
			locale ?? Config.LOCALE_ID,
			this.console,
		).m(zeroIndexedMonth));
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public isSameDate(
		dateTimeObject : NgbDateStruct | '-',
		timestamp : number,
	) : boolean | null {
		if (dateTimeObject === '-') return null;

		if (dateTimeObject.year !== this.pMoment.m(timestamp).year()) return false;
		if (dateTimeObject.month !== (this.pMoment.m(timestamp).month() + 1)) return false;
		if (dateTimeObject.day !== this.pMoment.m(timestamp).date()) return false;

		return true;
	}
}
