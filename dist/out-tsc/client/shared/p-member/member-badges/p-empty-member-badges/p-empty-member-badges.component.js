import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
let PEmptyMemberBadgesComponent = class PEmptyMemberBadgesComponent {
    constructor() { }
    /**
     * Sometimes we want to show a stack of »empty« member-badges in the ui. This can be used to generate
     * the stack.
     */
    get emptyMemberBadges() {
        let amount = 0;
        amount = this.emptyMemberSlots > 3 ? 3 : this.emptyMemberSlots;
        return Array.from({ length: amount });
    }
};
__decorate([
    Input(),
    __metadata("design:type", Number)
], PEmptyMemberBadgesComponent.prototype, "emptyMemberSlots", void 0);
PEmptyMemberBadgesComponent = __decorate([
    Component({
        selector: 'p-empty-member-badges[emptyMemberSlots]',
        templateUrl: './p-empty-member-badges.component.html',
        styleUrls: ['./p-empty-member-badges.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], PEmptyMemberBadgesComponent);
export { PEmptyMemberBadgesComponent };
//# sourceMappingURL=p-empty-member-badges.component.js.map