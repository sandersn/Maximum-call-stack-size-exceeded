import { __decorate, __metadata } from "tslib";
import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { MeService } from '@plano/shared/api';
let PAssignMembersHeadlineComponent = class PAssignMembersHeadlineComponent {
    constructor(me) {
        this.me = me;
        this._alwaysTrue = true;
        this.editMode = false;
        this.showHearts = false;
    }
};
__decorate([
    HostBinding('class.list-group-item'),
    HostBinding('class.p-0'),
    HostBinding('class.pl-3'),
    __metadata("design:type", Object)
], PAssignMembersHeadlineComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PAssignMembersHeadlineComponent.prototype, "editMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PAssignMembersHeadlineComponent.prototype, "showHearts", void 0);
PAssignMembersHeadlineComponent = __decorate([
    Component({
        selector: 'p-assign-members-headline',
        templateUrl: './p-assign-members-headline.component.html',
        styleUrls: ['./p-assign-members-headline.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [MeService])
], PAssignMembersHeadlineComponent);
export { PAssignMembersHeadlineComponent };
//# sourceMappingURL=p-assign-members-headline.component.js.map