import { Pipe, Inject, LOCALE_ID } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { PDatePipe, AngularDatePipeFormat } from '@plano/shared/core/pipe/p-date.pipe';
import { PSupportedTimeZoneOffset } from '@plano/shared/core/time-zones.enums';

type PDurationPipeFormats = AngularDatePipeFormat.SHORT_TIME | 'shortTime';

@Pipe({ name: 'pDuration' })
export class PDurationPipe implements PipeTransform {
	constructor(
		@Inject(LOCALE_ID) private locale : PSupportedLocaleIds,
		private datePipe : PDatePipe,
	) {}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public transform(duration : number, format ?: PDurationPipeFormats) : string | null {
		if (!format) format = AngularDatePipeFormat.SHORT_TIME;
		return this.datePipe.transform(duration, format, PSupportedTimeZoneOffset.NO_ZONE, this.locale);
	}
}
