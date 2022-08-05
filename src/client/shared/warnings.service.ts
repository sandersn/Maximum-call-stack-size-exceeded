import { Injectable } from '@angular/core';
import { PDictionarySourceString } from '@plano/shared/core/pipe/localize.dictionary';

export enum WarningId {
	WARN_STAMPED_NOT_SHIFT_TIME,
	WARN_UNPLANNED_WORK,
	WARN_STAMPED_NOT_CURRENT_TIME,
}

@Injectable()
export class WarningsService {

	constructor() {}

	/**
	 * Get warning by enum value
	 */
	public static get( id : WarningId ) : PDictionarySourceString | null {
		switch (id) {
			case WarningId.WARN_STAMPED_NOT_SHIFT_TIME:
				return 'Deine gestempelte Arbeitszeit weicht von der geplanten ab. Warum?';
			case WarningId.WARN_UNPLANNED_WORK:
				return 'Dein Arbeitseinsatz ist ungeplant? Wie kommt das?';
			case WarningId.WARN_STAMPED_NOT_CURRENT_TIME:
				return 'Warum hast du nicht die aktuelle Zeit gestempelt?';
			default:
				return null;
		}
	}

	/**
	 * Warning messages as simple array of strings
	 */
	public getWarningMessages(input : {
		warnStampedNotShiftTime : boolean,
		warnUnplannedWork : boolean,
		warnStampedNotCurrentTime : boolean,
	}) : PDictionarySourceString[] {
		let warningMessages : PDictionarySourceString[] = [];

		if (input.warnStampedNotShiftTime) {
			const warning = WarningsService.get(WarningId.WARN_STAMPED_NOT_SHIFT_TIME);
			if (warning) warningMessages.push(warning);
		}

		if (input.warnUnplannedWork) {
			const warning = WarningsService.get(WarningId.WARN_UNPLANNED_WORK);
			if (warning) warningMessages.push(warning);
		}

		if (input.warnStampedNotCurrentTime) {
			const warning = WarningsService.get(WarningId.WARN_STAMPED_NOT_CURRENT_TIME);
			if (warning) warningMessages.push(warning);
		}

		if (!warningMessages.length) {
			warningMessages = [];
		}

		return warningMessages;
	}
}
