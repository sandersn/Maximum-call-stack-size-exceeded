var _a;
import { __decorate, __metadata } from "tslib";
import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingApiMembers, SchedulingApiAbsenceType } from '@plano/shared/api';
import { AbsenceService } from '../../absence.service';
let MemberBadgesComponent = class MemberBadgesComponent {
    constructor(absenceService) {
        this.absenceService = absenceService;
        this._alwaysTrue = true;
        this.emptyMemberSlots = null;
        this.shiftStart = null;
        this.shiftEnd = null;
        this.shiftId = null;
        this.myId = null;
        this.SchedulingApiAbsenceType = SchedulingApiAbsenceType;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    absenceType(memberId) {
        var _a;
        if ((_a = this.members.get(memberId)) === null || _a === void 0 ? void 0 : _a.trashed)
            return 'trashed';
        if (this.shiftStart === null)
            return null;
        if (this.shiftEnd === null)
            return null;
        if (this.shiftId === null)
            return null;
        const type = this.absenceService.absenceType(memberId, {
            start: this.shiftStart,
            end: this.shiftEnd,
            id: this.shiftId,
        });
        return type === SchedulingApiAbsenceType.OTHER ? null : type !== null && type !== void 0 ? type : null;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    isMe(member) {
        if (this.myId === null)
            return undefined;
        if (member.isNewItem())
            return undefined;
        return this.myId.equals(member.id);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get membersForList() {
        return this.members.iterableSortedBy([
            item => item.lastName,
            item => item.firstName,
            item => !item.trashed,
            item => this.isMe(item),
        ], true);
    }
};
__decorate([
    HostBinding('class.d-flex'),
    HostBinding('class.badges-stack'),
    __metadata("design:type", Object)
], MemberBadgesComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_a = typeof SchedulingApiMembers !== "undefined" && SchedulingApiMembers) === "function" ? _a : Object)
], MemberBadgesComponent.prototype, "members", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MemberBadgesComponent.prototype, "emptyMemberSlots", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MemberBadgesComponent.prototype, "shiftStart", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MemberBadgesComponent.prototype, "shiftEnd", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MemberBadgesComponent.prototype, "shiftId", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MemberBadgesComponent.prototype, "myId", void 0);
MemberBadgesComponent = __decorate([
    Component({
        selector: 'p-member-badges[members]',
        templateUrl: './member-badges.component.html',
        styleUrls: ['./member-badges.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [AbsenceService])
], MemberBadgesComponent);
export { MemberBadgesComponent };
//# sourceMappingURL=member-badges.component.js.map