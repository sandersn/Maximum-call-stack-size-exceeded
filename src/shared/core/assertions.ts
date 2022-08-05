import { AssertionError } from 'assert';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { Config } from './config';

export class Assertions {

	/**
	 * Backend does not accept other timestamps than day-start. It makes it easier for the app logic, but its
	 * sometimes difficult to always remember to put the day start in the right places.
	 * This method supposed to be used only in Debug mode.
	 */
	public static ensureIsDayStart(timestamp : number) : void {
		if (!Config.DEBUG || !timestamp) return;

		const pMoment = new PMomentService(Config.LOCALE_ID);
		const dayStart = +pMoment.m(timestamp).startOf('day');
		if (dayStart !== timestamp) throw new AssertionError({
			message: `You must pass start of day. ${timestamp} has offset about ${((timestamp - dayStart) / 1000 / 60 / 60).toString()}h`,
			actual: timestamp,
			expected: dayStart,
		});
	}
}
