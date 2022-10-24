var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
import { __decorate, __metadata } from "tslib";
import * as $ from 'jquery';
import { NgProgressComponent } from 'ngx-progressbar';
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
let ClientComponent = class ClientComponent {
    constructor(meService, toasts, highlightService, pWishesService, console, api, pushNotifications, pAppStartupService, pLaunchDarklyService, pProgressbarService) {
        this.meService = meService;
        this.toasts = toasts;
        this.highlightService = highlightService;
        this.pWishesService = pWishesService;
        this.console = console;
        this.api = api;
        this.pushNotifications = pushNotifications;
        this.pAppStartupService = pAppStartupService;
        this.pLaunchDarklyService = pLaunchDarklyService;
        this.pProgressbarService = pProgressbarService;
        this._alwaysTrue = true;
        pushNotifications.setApi(api);
        // The login form of the client area is on the public page
        Config.LOGIN_PATH = Config.IS_MOBILE ? '/mobile-login' : '/';
        // For this component we need credentials
        this.meService.loginFromCookieCredentials(undefined, () => {
            if (this.meService.showExpiredClientViewForOwner)
                return;
            this.meService.rememberPathWhenLoginFailed();
            this.meService.openLoginPage();
        });
        // init services after meService is loaded (as it is needed for reading personalized cookies)
        this.meService.isLoaded(() => {
            this.initAllServices();
            this.pLaunchDarklyService.init(this.meService.data.clientId.toString());
        });
    }
    initAllServices() {
        // [Read cookies if they implement PServiceWithCookiesInterface and] initialize all Services
        this.pAppStartupService.init();
    }
    ngOnInit() {
        $('html').addClass('client');
        this.pProgressbarService.setSubscriber(this.progressBar);
    }
    ngOnDestroy() {
        $('html').removeClass('client');
    }
    _onEsc(_event) {
        this.console.debug('ClientComponent._onEsc()');
        if (this.highlightService.highlightedItem) {
            this.highlightService.setHighlighted(null);
            this.pWishesService.item = null;
        }
    }
};
__decorate([
    HostBinding('class.d-flex'),
    HostBinding('class.flex-column'),
    __metadata("design:type", Object)
], ClientComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    ViewChild('progressBar', { static: true }),
    __metadata("design:type", typeof (_l = typeof NgProgressComponent !== "undefined" && NgProgressComponent) === "function" ? _l : Object)
], ClientComponent.prototype, "progressBar", void 0);
__decorate([
    HostListener('document:keydown.esc', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], ClientComponent.prototype, "_onEsc", null);
ClientComponent = __decorate([
    Component({
        selector: 'p-client',
        templateUrl: './client.component.html',
        styleUrls: ['./client.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        animations: [SLIDE_RTL_ON_NGIF_TRIGGER],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof MeService !== "undefined" && MeService) === "function" ? _a : Object, typeof (_b = typeof ToastsService !== "undefined" && ToastsService) === "function" ? _b : Object, typeof (_c = typeof HighlightService !== "undefined" && HighlightService) === "function" ? _c : Object, typeof (_d = typeof PWishesService !== "undefined" && PWishesService) === "function" ? _d : Object, typeof (_e = typeof LogService !== "undefined" && LogService) === "function" ? _e : Object, typeof (_f = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _f : Object, typeof (_g = typeof PPushNotificationsService !== "undefined" && PPushNotificationsService) === "function" ? _g : Object, typeof (_h = typeof PAppStartupService !== "undefined" && PAppStartupService) === "function" ? _h : Object, typeof (_j = typeof PLaunchDarklyService !== "undefined" && PLaunchDarklyService) === "function" ? _j : Object, typeof (_k = typeof PProgressbarService !== "undefined" && PProgressbarService) === "function" ? _k : Object])
], ClientComponent);
export { ClientComponent };
//# sourceMappingURL=client.component.js.map