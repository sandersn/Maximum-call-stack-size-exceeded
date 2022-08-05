import { Injectable } from '@angular/core';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { MeService } from '@plano/shared/api';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';

@Injectable()
export class PExportService {
	constructor(
		private pMoment : PMomentService,
		private localize : LocalizePipe,
		private meService : MeService,
	) {
	}

	/**
	 * Get Date in a format that can be used for a file-name
	 */
	public getFormattedDate(date : number) : string {
		const day = this.pMoment.m(date).get('date');
		const month = this.pMoment.m(date).get('month') + 1;
		const year = this.pMoment.m(date).get('year');

		return this.localize.transform('${day}_${month}_${year}', {
			day: day.toString().padStart(2, '0'),
			month: month.toString().padStart(2, '0'),
			year: year.toString(),
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getFileName(name : string, start ?: number, end ?: number) : string {
		const company = this.meService.data.locationName;
		let result = '';
		result += `${company}_`;
		result += `${name}`;

		if (start || end) {
			if (!(start && end))
				throw new Error('Start/end should be both provided or not at all.');

			result += `_${this.getFormattedDate(start)}`;
			result += `_${this.localize.transform('bis')}_`;
			result += `${this.getFormattedDate(end)}`;
		}

		return result;
	}

}
