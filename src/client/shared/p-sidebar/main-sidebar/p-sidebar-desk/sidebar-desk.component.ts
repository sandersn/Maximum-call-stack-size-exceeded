import { OnInit } from '@angular/core';
import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output, HostBinding } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { SchedulingApiShiftExchanges } from '@plano/client/scheduling/shared/api/scheduling-api-shift-exchange.service';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { PShiftExchangeService } from '@plano/client/shared/p-shift-exchange/shift-exchange.service';
import { MeService } from '@plano/shared/api';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { Config } from '../../../../../shared/core/config';
import { LogService } from '../../../../../shared/core/log.service';
import { assumeNonNull } from '../../../../../shared/core/null-type-utils';
import { PCookieService } from '../../../../../shared/core/p-cookie.service';
import { PLaunchDarklyService } from '../../../../../shared/launch-darkly/launch-darkly';
import { LDDeskCardValue} from '../../../../../shared/launch-darkly/launch-darkly';

@Component({
	selector: 'p-sidebar-desk[shiftExchanges]',
	templateUrl: './sidebar-desk.component.html',
	styleUrls: ['./sidebar-desk.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PSidebarDeskComponent implements PComponentInterface, OnInit {
	@Input() public isLoading : PComponentInterface['isLoading'] = false;
	@Input() public shiftExchanges ! : SchedulingApiShiftExchanges;
	@Output() public navToShiftExchanges : EventEmitter<undefined> = new EventEmitter<undefined>();

	public now ! : number;

	@HostBinding('class.d-flex')
	@HostBinding('class.flex-column') private _alwaysTrue = true;

	constructor(
		public meService : MeService,
		private pMoment : PMomentService,
		public pShiftExchangeService : PShiftExchangeService,
		private pCookieService : PCookieService,
		private pLaunchDarklyService : PLaunchDarklyService,
		public domSanitizer : DomSanitizer,
		private console : LogService,
	) {
	}

	public Config = Config;

	/**
	 * First name of the user.
	 */
	public get firstName() : string {
		return this.meService.data.firstName;
	}

	public BootstrapSize = BootstrapSize;
	public PlanoFaIconPool = PlanoFaIconPool;

	/** OnInit */
	public ngOnInit() : void {
		this.now = +this.pMoment.m().startOf('day');
	}

	/** Should the section be visible? */
	public get deskCardIsVisible() : boolean {
		// Latest card id not available yet?
		if (this.latestDeskCardId === null) return false;
		return this.pCookieService.get({
			prefix : 'LaunchDarkly',
			name : 'lastHiddenDeskCardId',
		}) !== this.latestDeskCardId;
	}

	/** Get the content of a flag from LaunchDarkly */
	public launchDarklyValue(id : 'desk-card') : LDDeskCardValue | undefined {
		return this.pLaunchDarklyService.get(id);
	}

	private get latestDeskCardId() : string | null {
		const cardId = this.launchDarklyValue('desk-card')?.cardId;
		if (cardId === undefined || cardId === null) return null;
		return `${cardId}`;
	}

	/** Should the section be visible? */
	public hideSection(id : 'desk-card') : void {
		// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
		if (id === 'desk-card') {
			// We can expect latestDeskCardId to be available if user was able to click a button that hides the section
			assumeNonNull(this.latestDeskCardId, 'this.latestDeskCardId', 'Card should not have been visible');
			return this.pCookieService.put({
				prefix : 'LaunchDarkly',
				name : 'lastHiddenDeskCardId',
			}, this.latestDeskCardId);
		}
		this.console.error('Not implemented yet');
	}

	private _safeHtmlStr : SafeHtml | null = null;

	/** Get LS html as save html */
	public get safeHtmlStr() : SafeHtml | null {
		if (this._safeHtmlStr === null) {
			const unSaveHtml = this.launchDarklyValue('desk-card')?.content?.[Config.getLanguageCode()];
			if (!unSaveHtml) return null;
			this._safeHtmlStr = this.domSanitizer.bypassSecurityTrustHtml(unSaveHtml);
		}
		return this._safeHtmlStr;
	}
}
