import { PipeTransform, OnDestroy } from '@angular/core';
import { Pipe, NgZone, ChangeDetectorRef } from '@angular/core';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PMomentService } from '../p-moment.service';
@Pipe({
	name: 'pTimeAgo',
	// pure: false
})
export class PTimeAgoPipe implements PipeTransform, OnDestroy {
	private timer : number | null = null;
	constructor(
		private changeDetectorRef : ChangeDetectorRef,
		private ngZone : NgZone,
		private localize : LocalizePipe,
		private pMoment : PMomentService,
	) {}

	/**
	 * Transform timestamp into human readable format like "vor 5 min"
	 */
	public transform(value : number, shortVersion ?: boolean) : string {
		if (!value) return '';
		this.removeTimer();

		// TODO: remove Date() since it can cause problems in other timezones
		const d = new Date(value);

		const now = +this.pMoment.m();
		const seconds = Math.round(Math.abs((now - d.getTime()) / 1000));
		const timeToUpdate = (Number.isNaN(seconds)) ? 1000 : this.getSecondsUntilUpdate(seconds) * 1000;
		this.timer = this.ngZone.runOutsideAngular(() => {
			if (typeof window !== 'undefined') {
				return window.setTimeout(() => {
					this.ngZone.run(() => {
						this.changeDetectorRef.markForCheck();
					});
				}, timeToUpdate);
			}
			return null;
		});

		if (Number.isNaN(seconds)) return '';

		return this.transformSecondsToText(seconds, shortVersion);
	}

	private transformSecondsToText(seconds : number, shortVersion ?: boolean) : string {
		const minutes = Math.round(Math.abs(seconds / 60));
		const hours = Math.round(Math.abs(minutes / 60));
		const days = Math.round(Math.abs(hours / 24));
		const months = Math.round(Math.abs(days / 30.416));
		const years = Math.round(Math.abs(days / 365));

		if (seconds <= 45) return this.localize.transform('gerade eben');

		if (seconds <= 90) return shortVersion ? this.localize.transform('vor 1 Min.') : this.localize.transform('vor 1 Minute');
		if (minutes <= 45) return shortVersion ? this.localize.transform('vor ${minutes} Min.', {
			minutes: minutes.toString(),
		}) : this.localize.transform('vor ${minutes} Minuten', {
			minutes: minutes.toString(),
		});

		if (minutes <= 90) return shortVersion ? this.localize.transform('vor 1 Std.') : this.localize.transform('vor 1 Stunde');
		if (hours <= 22) return shortVersion ? this.localize.transform('vor ${hours} Std.', {
			hours: hours.toString(),
		}) : this.localize.transform('vor ${hours} Stunden', {
			hours: hours.toString(),
		});

		if (hours <= 36) return this.localize.transform('vor 1 Tag');
		if (days <= 25) return this.localize.transform('vor ${days} Tagen', { days: days.toString() });

		if (days <= 45) return shortVersion ? this.localize.transform('vor 1 Mon.') : this.localize.transform('vor 1 Monat');
		if (hours <= 22) return shortVersion ? this.localize.transform('vor ${months} Mon.', {
			months: months.toString(),
		}) : this.localize.transform('vor ${months} Monaten', {
			months: months.toString(),
		});

		if (days <= 545) return this.localize.transform('vor 1 Jahr');
		return this.localize.transform('vor ${years} Jahren', { years: years.toString() });
	}

	public ngOnDestroy() : void {
		this.removeTimer();
	}

	private removeTimer() : void {
		if (!this.timer) return;
		window.clearTimeout(this.timer);
		this.timer = null;
	}

	private getSecondsUntilUpdate(seconds : number) : number {
		const min = 60;
		const hr = min * 60;
		const day = hr * 24;
		// less than 1 min, update every 2 secs
		if (seconds < min) return 2;
		// less than an hour, update every 30 secs
		if (seconds < hr) return 30;
		// less then a day, update every 5 mins
		if (seconds < day) return 300;
		// update every hour
		return 3600;
	}
}
