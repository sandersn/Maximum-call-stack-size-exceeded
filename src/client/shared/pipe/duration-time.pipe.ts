import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PMath } from './../../../shared/core/math-utils';
import { LogService } from '../../../shared/core/log.service';
import { PDictionarySourceString } from '../../../shared/core/pipe/localize.dictionary';

export enum SupportedDurationTimePipeUnits {
	DAYS = 'days',
	HOURS = 'hours',
	MINUTES = 'minutes',
	SECONDS = 'seconds',
}

/**
 * Which is larger, which is smaller?
 */
const supportedUnitsSize = {
	[SupportedDurationTimePipeUnits.DAYS] : 4,
	[SupportedDurationTimePipeUnits.HOURS] : 3,
	[SupportedDurationTimePipeUnits.MINUTES] : 2,
	[SupportedDurationTimePipeUnits.SECONDS] : 1,
};

type DurationAsUnits = {
	[SupportedDurationTimePipeUnits.DAYS] : number,
	[SupportedDurationTimePipeUnits.HOURS] : number,
	[SupportedDurationTimePipeUnits.MINUTES] : number,
	[SupportedDurationTimePipeUnits.SECONDS] : number,
};

@Pipe({ name: 'pDurationTime' })
export class PDurationTimePipe implements PipeTransform {
	constructor(
		private pMoment : PMomentService,
		private localize : LocalizePipe,
		private console ?: LogService,
	) {}

	private getDays(duration : number) : number {
		// You would get 0 days, if you have a duration of exactly 1 month (31 Days).
		// Therefore we use a little trick in the next line ;)
		return PMath.cutToDecimalPlaces(this.pMoment.duration(duration).asDays(), 0);
	}

	private getDurationAsUnits(duration : number) : DurationAsUnits {
		return {
			days : this.getDays(duration),
			hours : this.pMoment.duration(duration).hours(),
			minutes : this.pMoment.duration(duration).minutes(),
			seconds : this.pMoment.duration(duration).seconds(),
		};
	}

	private isBetween(
		value : SupportedDurationTimePipeUnits,
		lowestUnit : SupportedDurationTimePipeUnits,
		highestUnit : SupportedDurationTimePipeUnits,
	) : boolean {
		if (supportedUnitsSize[value] > supportedUnitsSize[highestUnit]) return false;
		if (supportedUnitsSize[value] < supportedUnitsSize[lowestUnit]) return false;
		return true;
	}

	private getHighestUnit(
		durationAsUnits : DurationAsUnits,
	) : SupportedDurationTimePipeUnits {
		if (!!durationAsUnits[SupportedDurationTimePipeUnits.DAYS]) return SupportedDurationTimePipeUnits.DAYS;
		if (!!durationAsUnits[SupportedDurationTimePipeUnits.HOURS]) return SupportedDurationTimePipeUnits.HOURS;
		if (!!durationAsUnits[SupportedDurationTimePipeUnits.MINUTES]) return SupportedDurationTimePipeUnits.MINUTES;
		if (!!durationAsUnits[SupportedDurationTimePipeUnits.SECONDS]) return SupportedDurationTimePipeUnits.SECONDS;
		this.console?.error('Unhandled case'); return null!;
	}

	private isLowestNecessaryUnit(
		value : SupportedDurationTimePipeUnits,
		durationAsUnits : DurationAsUnits,
		cutUnitsBelow : SupportedDurationTimePipeUnits,
	) : boolean {
		if (supportedUnitsSize[value] < supportedUnitsSize[cutUnitsBelow]) return false;
		if (!durationAsUnits[value]) return false;
		return true;
	}

	private getLowestUnit(
		durationAsUnits : DurationAsUnits,
		cutUnitsBelow : SupportedDurationTimePipeUnits,
		shortestFormatting : boolean = false,
	) : SupportedDurationTimePipeUnits {
		if (!shortestFormatting) return cutUnitsBelow;
		if (this.isLowestNecessaryUnit(SupportedDurationTimePipeUnits.SECONDS, durationAsUnits, cutUnitsBelow)) return SupportedDurationTimePipeUnits.SECONDS;
		if (this.isLowestNecessaryUnit(SupportedDurationTimePipeUnits.MINUTES, durationAsUnits, cutUnitsBelow)) return SupportedDurationTimePipeUnits.MINUTES;
		if (this.isLowestNecessaryUnit(SupportedDurationTimePipeUnits.HOURS, durationAsUnits, cutUnitsBelow)) return SupportedDurationTimePipeUnits.HOURS;
		return SupportedDurationTimePipeUnits.DAYS;
	}

	private getUnitsToAdd(
		durationAsUnits : DurationAsUnits,
		cutUnitsBelow : SupportedDurationTimePipeUnits,
		shortestFormatting : boolean = false,
	) : SupportedDurationTimePipeUnits[] {
		const highestUnit = this.getHighestUnit(durationAsUnits);
		const lowestUnit = this.getLowestUnit(durationAsUnits, cutUnitsBelow, shortestFormatting);

		const result = [];
		if (this.isBetween(SupportedDurationTimePipeUnits.DAYS, lowestUnit, highestUnit)) result.push(SupportedDurationTimePipeUnits.DAYS);
		if (this.isBetween(SupportedDurationTimePipeUnits.HOURS, lowestUnit, highestUnit)) result.push(SupportedDurationTimePipeUnits.HOURS);
		if (this.isBetween(SupportedDurationTimePipeUnits.MINUTES, lowestUnit, highestUnit)) result.push(SupportedDurationTimePipeUnits.MINUTES);
		if (this.isBetween(SupportedDurationTimePipeUnits.SECONDS, lowestUnit, highestUnit)) result.push(SupportedDurationTimePipeUnits.SECONDS);
		return result;
	}

	private getStringToAdd(
		unit : SupportedDurationTimePipeUnits,
		padValue : boolean,
		durationAsUnits : DurationAsUnits,
		htmlCode : string,
		formatWithSubTags : boolean,
		textShortSingular : PDictionarySourceString,
		textSingular : PDictionarySourceString,
		textShortPlural : PDictionarySourceString,
		textPlural : PDictionarySourceString,
	) : string {
		// function to add one leading zero if value is smaller equal 9
		const pad = (value : number) : string | number => (padValue && value <= 9 ? `0${value}` : value);

		if (htmlCode || durationAsUnits[unit] > 0) {
			if (formatWithSubTags) {
				return `${pad(durationAsUnits[unit])}<sub>${this.localize.transform(durationAsUnits[unit] === 1 ? textShortSingular : textShortPlural)}</sub> `;
			} else {
				return `${pad(durationAsUnits[unit])} ${this.localize.transform(durationAsUnits[unit] === 1 ? textSingular : textPlural)} `;
			}
		}
		return '';
	}

	/**
	 * Format a duration like 123456789 to »1 Day 10 Hrs. 17 Min«
	 */
	public transform(
		duration : number | null,
		cutUnitsBelow : SupportedDurationTimePipeUnits | null = SupportedDurationTimePipeUnits.MINUTES,
		formatWithSubTags : boolean = true,
		shortestFormatting : boolean = false,
	) : string {
		if (!duration) return '';

		let htmlCode = '';

		const durationAsUnits : DurationAsUnits = this.getDurationAsUnits(duration);

		const unitsToAdd = this.getUnitsToAdd(durationAsUnits, cutUnitsBelow ?? SupportedDurationTimePipeUnits.MINUTES, shortestFormatting);

		if (unitsToAdd.includes(SupportedDurationTimePipeUnits.DAYS)) htmlCode += this.getStringToAdd(
			SupportedDurationTimePipeUnits.DAYS,
			false,
			durationAsUnits, htmlCode, formatWithSubTags,
			'Tag', 'Tag', 'Tage', 'Tage',
		);
		if (unitsToAdd.includes(SupportedDurationTimePipeUnits.HOURS)) htmlCode += this.getStringToAdd(
			SupportedDurationTimePipeUnits.HOURS,
			false,
			durationAsUnits, htmlCode, formatWithSubTags,
			'Std', 'Std.', 'Std', 'Std.',
		);
		if (unitsToAdd.includes(SupportedDurationTimePipeUnits.MINUTES)) htmlCode += this.getStringToAdd(
			SupportedDurationTimePipeUnits.MINUTES,
			unitsToAdd.includes(SupportedDurationTimePipeUnits.HOURS),
			durationAsUnits, htmlCode, formatWithSubTags,
			'M', 'Min.', 'M', 'Min.',
		);
		if (unitsToAdd.includes(SupportedDurationTimePipeUnits.SECONDS)) htmlCode += this.getStringToAdd(
			SupportedDurationTimePipeUnits.SECONDS,
			unitsToAdd.includes(SupportedDurationTimePipeUnits.MINUTES),
			durationAsUnits, htmlCode, formatWithSubTags,
			'S', 'Sek.', 'S', 'Sek.',
		);

		if (!htmlCode.length) htmlCode = '–';
		return htmlCode;
	}
}

@Pipe({ name: 'pDurationAsHours' })
export class PDurationHoursPipe implements PipeTransform {
	constructor(
		private pMoment : PMomentService,
		private localize : LocalizePipe,
	) {}

	private formatted(
		input : number,
		unitLabel : string,
		formatWithSubTags : boolean = true,
	) : string {
		// function to add one leading zero if value is smaller equal 9
		const pad = (value : number) : string | number => (value <= 9 ? `0${value}` : value);

		if (input > 0) {
			if (formatWithSubTags) {
				return `${pad(input)}<sub>${unitLabel}</sub> `;
			} else {
				return `${pad(input)} ${unitLabel} `;
			}
		}
		return '';
	}

	/**
	 * Format a duration (ms) to human readable hours.
	 * If the duration is multiple days, it will still stick to hours.
	 * Like two days will be displayed as 48 Hrs. 0 Min.
	 */
	public transform(duration : number | null, alwaysShowSeconds : boolean = true) : string {

		if (!duration) return '';

		let htmlCode = '';

		// hours
		const hours = Math.trunc(this.pMoment.duration(duration).asHours());
		htmlCode += this.formatted(hours, this.localize.transform('Std'));

		// minutes
		const minutes = this.pMoment.duration(duration).minutes();
		htmlCode += this.formatted(minutes, this.localize.transform('M'));

		// seconds
		const seconds = this.pMoment.duration(duration).seconds();
		if (
			alwaysShowSeconds ||
			this.pMoment.duration(duration).asSeconds() < 60
		) {
			htmlCode += ' ';
			if (htmlCode || seconds > 0) htmlCode += this.formatted(seconds, this.localize.transform('S'));
		}

		if (!htmlCode.length) htmlCode = '–';
		return htmlCode;
	}
}
