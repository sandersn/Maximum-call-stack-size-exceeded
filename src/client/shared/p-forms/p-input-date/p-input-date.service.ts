import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import { PNgbDateTimeStruct } from '@plano/client/service/ngbformats.service';
import { NgbFormatsService } from '@plano/client/service/ngbformats.service';
import { DateTime, PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { PMomentService } from '../../p-moment.service';

@Injectable()
export class PInputDateService {
	constructor(
		private ngbFormatsService : NgbFormatsService,
	) {
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public convertNgbDateAndNgbTimeToTimestamp(
		locale : PSupportedLocaleIds,
		date : NgbDateStruct | '-' | null,
		time : number,
		showTimeInput : boolean | null = null,
	) : number | null {
		if (!date) return 0;
		if (date === '-') return 0;

		let result : DateTime | null = null;
		result = this.ngbFormatsService.dateTimeObjectToTimestamp(date, locale);
		result = +(new PMomentService(locale).m(result).startOf('day'));
		if (!showTimeInput) return result;

		// NOTE: ['time'].value can be -1 if input is of type 'time'
		if (time !== -1) {
			const ngbDateTime = date as PNgbDateTimeStruct;
			ngbDateTime.second = +(new PMomentService(locale)).duration(time).get('seconds');
			ngbDateTime.minute = +(new PMomentService(locale)).duration(time).get('minutes');
			ngbDateTime.hour = +(new PMomentService(locale)).duration(time).get('hours');
			return this.ngbFormatsService.dateTimeObjectToTimestamp(ngbDateTime, locale);
		}
		return result;
	}
}
