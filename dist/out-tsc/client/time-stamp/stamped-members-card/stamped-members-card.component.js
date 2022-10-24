import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TimeStampApiService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
let StampedMembersCardComponent = class StampedMembersCardComponent {
    constructor(api) {
        this.api = api;
        this.interval = null;
        // don’t start automatic api update for tests to prevent 401 errors.
        // Because there we cannot know who is currently logged in.
        if (Config.APPLICATION_MODE !== 'TEST')
            this.setUpdateInterval(120000);
    }
    ngOnDestroy() {
        var _a;
        window.clearInterval((_a = this.interval) !== null && _a !== void 0 ? _a : undefined);
    }
    setUpdateInterval(intervalDuration) {
        this.interval = window.setInterval(() => {
            if (!this.api.isLoaded())
                return;
            this.api.save({
                saveEmptyData: true,
                sendRootMetaOnEmptyData: true,
            });
        }, intervalDuration);
    }
};
StampedMembersCardComponent = __decorate([
    Component({
        selector: 'p-stamped-members-card',
        templateUrl: './stamped-members-card.component.html',
        styleUrls: ['./stamped-members-card.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [TimeStampApiService])
], StampedMembersCardComponent);
export { StampedMembersCardComponent };
//# sourceMappingURL=stamped-members-card.component.js.map