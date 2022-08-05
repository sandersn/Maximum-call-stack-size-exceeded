import * as $ from 'jquery';
import { NgProgressComponent } from 'ngx-progressbar';
import { OnInit, OnDestroy} from '@angular/core';
import { Component, HostBinding, HostListener, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { PAppStartupService } from '@plano/app-startup.service';
import { ToastsService } from '@plano/client/service/toasts.service';
import { MeService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { PPushNotificationsService } from '@plano/shared/core/p-push-notifications.service';
import { SchedulingApiService } from './scheduling/shared/api/scheduling-api.service';
import { PWishesService } from './scheduling/wishes.service';
import { HighlightService } from './shared/highlight.service';
import { SLIDE_RTL_ON_NGIF_TRIGGER } from '../animations';
import { PProgressbarService } from '../shared/core/progressbar.service';
import { PLaunchDarklyService } from '../shared/launch-darkly/launch-darkly';

@Component({
	selector: 'p-client',
	templateUrl: './client.component.html',
	styleUrls: ['./client.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	animations: [SLIDE_RTL_ON_NGIF_TRIGGER],
})
export class ClientComponent implements OnInit, OnDestroy {
	@HostBinding('class.d-flex')
	@HostBinding('class.flex-column') protected _alwaysTrue = true;

	@ViewChild('progressBar', { static: true }) public progressBar ! : NgProgressComponent;

	constructor(
		public meService : MeService,
		public toasts : ToastsService,
		private highlightService : HighlightService,
		private pWishesService : PWishesService,
		private console : LogService,
		public api : SchedulingApiService,
		public pushNotifications : PPushNotificationsService,
		private pAppStartupService : PAppStartupService,
		private pLaunchDarklyService : PLaunchDarklyService,
		private pProgressbarService : PProgressbarService,
	) {
		pushNotifications.setApi(api);

		// The login form of the client area is on the public page
		Config.LOGIN_PATH = Config.IS_MOBILE ? '/mobile-login' : '/';

		// For this component we need credentials
		this.meService.loginFromCookieCredentials(undefined, () => {
			if (this.meService.showExpiredClientViewForOwner) return;
			this.meService.rememberPathWhenLoginFailed();
			this.meService.openLoginPage();
		});

		// init services after meService is loaded (as it is needed for reading personalized cookies)
		this.meService.isLoaded(() => {
			this.initAllServices();
			this.pLaunchDarklyService.init(this.meService.data.clientId.toString());
		});
	}

	private initAllServices() : void {
		// [Read cookies if they implement PServiceWithCookiesInterface and] initialize all Services
		this.pAppStartupService.init();
	}

	public ngOnInit() : void {
		$('html').addClass('client');

		this.pProgressbarService.setSubscriber(this.progressBar);
	}

	public ngOnDestroy() : void {
		$('html').removeClass('client');
	}

	@HostListener('document:keydown.esc', ['$event']) private _onEsc(_event : KeyboardEvent) : void {
		this.console.debug('ClientComponent._onEsc()');

		if (this.highlightService.highlightedItem) {
			this.highlightService.setHighlighted(null);
			this.pWishesService.item = null;
		}
	}

}
