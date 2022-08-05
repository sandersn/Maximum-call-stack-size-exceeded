
import { AfterContentChecked, AfterContentInit } from '@angular/core';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { DateFormats, PDateFormat, PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { PTextColor, PThemeEnum } from '../../bootstrap-styles.enum';
import { PMomentService } from '../../p-moment.service';

/**
 * A Directive to show a deadline as a badge. The badge automatically gets some kind of »danger« style, when it the
 * deadline passes.
 *
 * @example
 *   <p-deadline
 *     [timestamp]="future"
 *     [theme]="PThemeEnum.DARK"
 *     label="Mach schon" i18n-label
 *     tooltipContent="Ist echt wichtig, dass du das einhältst." i18n-tooltipContent
 *   ></p-deadline>
 */
@Component({
	selector: 'p-deadline',
	templateUrl: './deadline.component.html',
	styleUrls: ['./deadline.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PDeadlineComponent implements AfterContentChecked, AfterContentInit {

	/**
	 * The timestamp of the deadline
	 */
	@Input() public timestamp : number | null = null;

	/**
	 * Theme of the badge
	 */
	@Input() public theme : PTextColor | null = null;

	/**
	 * Text on the left side of the date.
	 * Describes what kind of date this is.
	 */
	@Input() public label : string | null = null;

	/**
	 * Text for a Tooltip that shows up on hover.
	 */
	@Input() public tooltipContent : string | null = null;

	/**
	 * In which format should the date be shown?
	 */
	@Input() public dateFormat : DateFormats = PDateFormat.VERY_SHORT_DATE;

	constructor(
		private datePipe : PDatePipe,
		private localize : LocalizePipe,
		private pMoment : PMomentService,
		private localizePipe : LocalizePipe,
	) {
	}

	private now ! : number;

	public ngAfterContentChecked() : void {
		this.now = +this.pMoment.m();
	}

	private get timestampIsInThePast() : boolean {
		if (!this.timestamp) return false;
		if (this.timestamp <= this.now) return true;
		return false;
	}

	public ngAfterContentInit() : void {
		if (this.theme === PThemeEnum.DANGER) throw new Error(`Theme 'DANGER' is not supported on p-deadline`);
		if (!this.label) this.label = this.localizePipe.transform('Frist');
		if (!this.tooltipContent) {
			assumeDefinedToGetStrictNullChecksRunning(this.timestamp, 'timestamp');
			const date = this.datePipe.transform(this.timestamp - 1, 'shortDate');
			const time = this.datePipe.transform(this.timestamp - 1, 'shortTime');
			this.tooltipContent = this.localize.transform('Frist für Ersatzsuche: ${date}, ${time}', { date: date, time: time });
		}
	}

	/**
	 * Get more styling classes for this component
	 */
	public get cssClasses() : string {
		let result = 'border badge align-self-center';
		result += ` `;
		result += this.timestampIsInThePast ? 'border-danger' : '';
		result += ` `;
		if (!this.theme) {
			result += `badge-light`;
			result += ` `;
			result += `border-${this.timestampIsInThePast ? 'danger' : 'gray'}`;
			result += ` `;
		} else {
			result += `badge-${!this.timestampIsInThePast ? this.theme : 'danger'}`;
			result += ` `;
			result += `border-${!this.timestampIsInThePast ? this.theme : 'gray'}`;
			result += ` `;
		}
		return result;
	}
}
