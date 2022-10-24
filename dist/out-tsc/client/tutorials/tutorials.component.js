var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { MeService } from '@plano/shared/api';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PSupportedLanguageCodes } from '../../shared/api/base/generated-types.ag';
import { Config } from '../../shared/core/config';
import { RightsService } from '../accesscontrol/rights.service';
import { ReportUrlParamsService } from '../report/report-url-params.service';
import { SchedulingApiService } from '../scheduling/shared/api/scheduling-api.service';
let TutorialsComponent = class TutorialsComponent {
    constructor(me, rightsService, api, reportUrlParamsService) {
        this.me = me;
        this.rightsService = rightsService;
        this.api = api;
        this.reportUrlParamsService = reportUrlParamsService;
        this._alwaysTrue = true;
        this.Config = Config;
        this.PSupportedLanguageCodes = PSupportedLanguageCodes;
        this.PThemeEnum = PThemeEnum;
        this.PlanoFaIconPool = PlanoFaIconPool;
    }
    ngAfterContentInit() {
        if (this.api.isLoaded())
            return;
        this.reportUrlParamsService.updateQueryParams();
        this.api.load({ searchParams: this.reportUrlParamsService.queryParams });
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get userCanEditAssignmentProcesses() {
        return this.rightsService.userCanEditAssignmentProcesses;
    }
    /** @see RightsService['userCanWriteBooking'] */
    get userCanWriteBookings() {
        return this.rightsService.userCanWriteBookings();
    }
};
__decorate([
    HostBinding('class.flex-grow-1'),
    HostBinding('class.d-flex'),
    HostBinding('class.position-relative'),
    __metadata("design:type", Object)
], TutorialsComponent.prototype, "_alwaysTrue", void 0);
TutorialsComponent = __decorate([
    Component({
        selector: 'p-tutorials',
        templateUrl: './tutorials.component.html',
        styleUrls: ['./tutorials.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [MeService, typeof (_a = typeof RightsService !== "undefined" && RightsService) === "function" ? _a : Object, typeof (_b = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _b : Object, typeof (_c = typeof ReportUrlParamsService !== "undefined" && ReportUrlParamsService) === "function" ? _c : Object])
], TutorialsComponent);
export { TutorialsComponent };
//# sourceMappingURL=tutorials.component.js.map