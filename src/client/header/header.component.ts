import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { OnInit } from '@angular/core';
import { Component, ChangeDetectionStrategy, ApplicationRef, Input } from '@angular/core';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { AuthenticatedApiClientType, MeService, SchedulingApiService } from '@plano/shared/api';
import { PSupportedLanguageCodes } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '@plano/shared/core/config';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../shared/core/null-type-utils';
import { RightsService } from '../accesscontrol/rights.service';

@Component({
	selector: 'p-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class HeaderComponent implements OnInit {
	@Input() public showSalesBtn : boolean = false;

	public AuthenticatedApiClientType = AuthenticatedApiClientType;
	public modalRef : NgbModalRef | null = null;

	constructor(
		public meService : MeService,
		public rightsService : RightsService,
		private pRouterService : PRouterService,
		private localize : LocalizePipe,
		private pMoment : PMomentService,
		private appRef : ApplicationRef,
		private decimalPipe : DecimalPipe,
		private schedulingApiService : SchedulingApiService,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public Config = Config;

	/**
	 * Should the booking settings button be visible?
	 */
	public get showBookingSystemBtn() : boolean | null {
		if (Config.IS_MOBILE) return false;
		return this.rightsService.canReadAndWriteBookingSystemSettings ?? null;
	}

	/**
	 * Nice and short version of company name
	 */
	public get locationName() : string {
		return this.meService.data.locationName;
	}

	/**
	 * Returns a string with a more readable duration
	 */
	private getTime() : string {
		assumeDefinedToGetStrictNullChecksRunning(this.meService.data.testAccountDeadline, 'meService.data.testAccountDeadline');
		const DURATION = Math.max(0, this.meService.data.testAccountDeadline - Date.now());
		const ONE_HOUR = 1000 * 60 * 60;
		if (DURATION < ONE_HOUR) {
			const AMOUNT = this.pMoment.d(DURATION).asMinutes();
			return `${this.decimalPipe.transform(AMOUNT, '1.0-0')} ${AMOUNT < 2 ? this.localize.transform('Minute') : this.localize.transform('Minuten')}`;
		}
		const ONE_DAY = ONE_HOUR * 24;
		if (DURATION < ONE_DAY) {
			const AMOUNT = this.pMoment.d(DURATION).asHours();
			return `${this.decimalPipe.transform(AMOUNT, '1.0-0')} ${AMOUNT < 2 ? this.localize.transform('Stunde') : this.localize.transform('Stunden')}`;
		}
		if (DURATION >= ONE_DAY) {
			const AMOUNT = this.pMoment.d(DURATION).asDays();
			return `${this.decimalPipe.transform(AMOUNT, '1.0-0')} ${AMOUNT < 2 ? this.localize.transform('Tag') : this.localize.transform('Tage')}`;
		}
		return '-';
	}

	/**
	 * Text for the button that is only visible in test-accounts
	 */
	public get testaccountButtonText() : string {
		return this.localize.transform('Test: noch ${time}', { time: this.getTime() });
	}

	/**
	 * The menu is an own page. So »toggling the menu« means »navigating back and forth«.
	 */
	public toggleMobileMenu(event : Event) : void {
		if (!this.pRouterService.url.includes('/client/menu')) return;
		event.preventDefault();
		event.stopPropagation();
		this.pRouterService.navToCurrentHistoryEntry();
	}

	/**
	 * Navigate back to previous page
	 */
	public navBack() : void {
		this.pRouterService.navBack();
	}

	/**
	 * Change the language in the localize pipe
	 */
	public debugToggleLocalizeLanguage() : void {
		this.localize.languageTestSetter(this.otherLanguage);
		this.appRef.tick();
	}

	/**
	 * Returns a language that is currently not active
	 */
	public get otherLanguage() : PSupportedLanguageCodes {
		if (this.localize.languageTestGetter() === PSupportedLanguageCodes.de) {
			return PSupportedLanguageCodes.en;
		}
		return PSupportedLanguageCodes.de;
	}

	/**
	 * Set a way to activate our fancy-schmancy developer tools.
	 */
	public ngOnInit() : void {
		if (!(Config.DEBUG && this.devToolsVisible === null)) return;
		this.devToolsVisible = false;
		document.addEventListener('keydown', (event) => { this.showDevTools(event); }, false);
		document.addEventListener('keyup', (event) => { this.stopDevToolsTimeout(event); }, false);
		this.makeSureSchedulingApiIsLoadedOnce();
	}

	/**
	 * @deprecated
	 * HACK: This hack solves PLANO-147729.
	 * We can not be sure if schedulingApiService has been loaded by any component.
	 * For example /client/time-stamp does not load schedulingApiService.
	 * But RightsService needs it because it needs the rightGroups to figure out if the user is allowed to see the
	 *   plugin-settings button in the dropdown of this header.
	 * TODO: Remove it. [PLANO-148429]
	 */
	private makeSureSchedulingApiIsLoadedOnce() : void {
		window.setTimeout(() => {
			if (!this.schedulingApiService.isLoaded() && !this.schedulingApiService.isBackendOperationRunning) {
				this.schedulingApiService.load();
			}
		}, 2000);
	}

	/**
	 * Are the dev tools (buttons that only developers use) visible in the header?
	 */
	public devToolsVisible : boolean | null = null;

	/**
	 * Show the dev tools (buttons that only developers use) in the header
	 */
	public showDevTools(event : KeyboardEvent) : void {
		if (event.key === 'Alt') {
			this.devToolsVisible = true;
		}
	}

	/**
	 * Hide the dev tools (buttons that only developers use) in the header
	 */
	public stopDevToolsTimeout(event : KeyboardEvent) : void {
		if (event.key === 'Alt') this.devToolsVisible = false;
	}

}
