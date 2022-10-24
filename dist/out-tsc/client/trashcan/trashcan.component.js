var _a, _b;
import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiMembers } from '@plano/shared/api';
import { BootstrapSize } from '../shared/bootstrap-styles.enum';
let TrashcanComponent = class TrashcanComponent {
    constructor(api, schedulingService) {
        this.api = api;
        this.schedulingService = schedulingService;
        this._alwaysTrue = true;
        this.BootstrapSize = BootstrapSize;
        this.membersForList = new SchedulingApiMembers(null, false);
    }
    ngAfterContentInit() {
        if (!this.api.isLoaded()) {
            this.loadNewData();
        }
        else {
            this.getItems();
        }
    }
    /**
     * Load new Data from api
     */
    loadNewData() {
        this.schedulingService.updateQueryParams();
        this.api.load({
            searchParams: this.schedulingService.queryParams,
            success: () => {
                this.getItems();
            },
        });
    }
    getItems() {
        this.membersForList = this.api.data.members.filterBy((member) => {
            return member.trashed;
        }).sortedBy([
            (item) => item.lastName,
            (item) => item.firstName,
        ], true);
    }
};
__decorate([
    HostBinding('class.h-100'),
    HostBinding('class.bg-dark'),
    __metadata("design:type", Object)
], TrashcanComponent.prototype, "_alwaysTrue", void 0);
TrashcanComponent = __decorate([
    Component({
        selector: 'p-trashcan',
        templateUrl: './trashcan.component.html',
        styleUrls: ['./trashcan.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, typeof (_b = typeof SchedulingService !== "undefined" && SchedulingService) === "function" ? _b : Object])
], TrashcanComponent);
export { TrashcanComponent };
//# sourceMappingURL=trashcan.component.js.map