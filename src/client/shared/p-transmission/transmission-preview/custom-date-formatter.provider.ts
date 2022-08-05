import { CalendarDateFormatter, DateAdapter } from 'angular-calendar';
import { DateFormatterParams} from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';

@Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {
	constructor(
		protected override dateAdapter : DateAdapter,
	) {
		super(dateAdapter);
	}

	// you can override any of the methods defined in the parent class

	public override monthViewColumnHeader({ date, locale } : DateFormatterParams) : string {
		const result = new DatePipe(locale!).transform(date, 'EEE', locale);
		assumeDefinedToGetStrictNullChecksRunning(result, 'result');
		return result;
	}

	public override monthViewTitle({ date, locale } : DateFormatterParams) : string {
		const result = new DatePipe(locale!).transform(date, 'MMM y', locale);
		assumeDefinedToGetStrictNullChecksRunning(result, 'result');
		return result;
	}

	public override weekViewColumnHeader({ date, locale } : DateFormatterParams) : string {
		const result = new DatePipe(locale!).transform(date, 'EEE', locale);
		assumeDefinedToGetStrictNullChecksRunning(result, 'result');
		return result;
	}

	public override dayViewHour({ date, locale } : DateFormatterParams) : string {
		const result = new DatePipe(locale!).transform(date, 'HH:mm', locale);
		assumeDefinedToGetStrictNullChecksRunning(result, 'result');
		return result;
	}
}
