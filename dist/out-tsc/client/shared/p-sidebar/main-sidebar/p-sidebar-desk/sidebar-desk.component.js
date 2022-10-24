var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output, HostBinding } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SchedulingApiShiftExchanges } from '@plano/client/scheduling/shared/api/scheduling-api-shift-exchange.service';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { PShiftExchangeService } from '@plano/client/shared/p-shift-exchange/shift-exchange.service';
import { MeService } from '@plano/shared/api';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { Config } from '../../../../../shared/core/config';
import { LogService } from '../../../../../shared/core/log.service';
import { assumeNonNull } from '../../../../../shared/core/null-type-utils';
import { PCookieService } from '../../../../../shared/core/p-cookie.service';
import { PLaunchDarklyService } from '../../../../../shared/launch-darkly/launch-darkly';
let PSidebarDeskComponent = class PSidebarDeskComponent {
    constructor(meService, pMoment, pShiftExchangeService, pCookieService, pLaunchDarklyService, domSanitizer, console) {
        this.meService = meService;
        this.pMoment = pMoment;
        this.pShiftExchangeService = pShiftExchangeService;
        this.pCookieService = pCookieService;
        this.pLaunchDarklyService = pLaunchDarklyService;
        this.domSanitizer = domSanitizer;
        this.console = console;
        this.isLoading = false;
        this.navToShiftExchanges = new EventEmitter();
        this._alwaysTrue = true;
        this.Config = Config;
        this.BootstrapSize = BootstrapSize;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this._safeHtmlStr = null;
    }
    /**
     * First name of the user.
     */
    get firstName() {
        return this.meService.data.firstName;
    }
    /** OnInit */
    ngOnInit() {
        this.now = +this.pMoment.m().startOf('day');
    }
    /** Should the section be visible? */
    get deskCardIsVisible() {
        // Latest card id not available yet?
        if (this.latestDeskCardId === null)
            return false;
        return this.pCookieService.get({
            prefix: 'LaunchDarkly',
            name: 'lastHiddenDeskCardId',
        }) !== this.latestDeskCardId;
    }
    /** Get the content of a flag from LaunchDarkly */
    launchDarklyValue(id) {
        return this.pLaunchDarklyService.get(id);
    }
    get latestDeskCardId() {
        var _a;
        const cardId = (_a = this.launchDarklyValue('desk-card')) === null || _a === void 0 ? void 0 : _a.cardId;
        if (cardId === undefined || cardId === null)
            return null;
        return `${cardId}`;
    }
    /** Should the section be visible? */
    hideSection(id) {
        // eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
        if (id === 'desk-card') {
            // We can expect latestDeskCardId to be available if user was able to click a button that hides the section
            assumeNonNull(this.latestDeskCardId, 'this.latestDeskCardId', 'Card should not have been visible');
            return this.pCookieService.put({
                prefix: 'LaunchDarkly',
                name: 'lastHiddenDeskCardId',
            }, this.latestDeskCardId);
        }
        this.console.error('Not implemented yet');
    }
    /** Get LS html as save html */
    get safeHtmlStr() {
        var _a, _b;
        if (this._safeHtmlStr === null) {
            const unSaveHtml = (_b = (_a = this.launchDarklyValue('desk-card')) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b[Config.getLanguageCode()];
            if (!unSaveHtml)
                return null;
            this._safeHtmlStr = this.domSanitizer.bypassSecurityTrustHtml(unSaveHtml);
        }
        return this._safeHtmlStr;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PSidebarDeskComponent.prototype, "isLoading", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_b = typeof SchedulingApiShiftExchanges !== "undefined" && SchedulingApiShiftExchanges) === "function" ? _b : Object)
], PSidebarDeskComponent.prototype, "shiftExchanges", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], PSidebarDeskComponent.prototype, "navToShiftExchanges", void 0);
__decorate([
    HostBinding('class.d-flex'),
    HostBinding('class.flex-column'),
    __metadata("design:type", Object)
], PSidebarDeskComponent.prototype, "_alwaysTrue", void 0);
PSidebarDeskComponent = __decorate([
    Component({
        selector: 'p-sidebar-desk[shiftExchanges]',
        templateUrl: './sidebar-desk.component.html',
        styleUrls: ['./sidebar-desk.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [MeService,
        PMomentService,
        PShiftExchangeService,
        PCookieService,
        PLaunchDarklyService, typeof (_a = typeof DomSanitizer !== "undefined" && DomSanitizer) === "function" ? _a : Object, LogService])
], PSidebarDeskComponent);
export { PSidebarDeskComponent };
//# sourceMappingURL=sidebar-desk.component.js.map