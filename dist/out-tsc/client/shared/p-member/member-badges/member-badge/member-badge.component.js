var _a, _b;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingApiAbsenceType, SchedulingApiService } from '@plano/shared/api';
import { LogService } from '@plano/shared/core/log.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PMemberBadgeService } from './p-member-badge.service';
import { PThemeEnum } from '../../../bootstrap-styles.enum';
let MemberBadgeComponent = class MemberBadgeComponent {
    constructor(pMemberBadgeService, console, api) {
        this.pMemberBadgeService = pMemberBadgeService;
        this.console = console;
        this.api = api;
        this.member = null;
        this._borderStyle = undefined;
        this.absenceType = null;
        this._icon = null;
        this._iconStyle = undefined;
        // TODO: use BootstrapSize here
        this.size = 'small';
        this.shadow = false;
        this._memberId = null;
        this.isMe = false;
        this.alwaysShowMemberInitials = null;
        this.PThemeEnum = PThemeEnum;
    }
    /** ngAfterContentChecked */
    ngAfterContentChecked() {
        this.initValues();
    }
    /**
     * Set values that are necessary for this function.
     * These initValues methods are used in many components.
     * They mostly get used for class attributes that would cause performance issues as a getter.
     */
    initValues() {
        if (this.absenceType !== null && this._icon !== null) {
            if (this._icon === 'trash') {
                this.console.error('Remove [icon] here. Set absenceType »trashed«.');
                return;
            }
            this.console.error('You already set absenceType. Icon is most likely unnecessary.');
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isEmpty() {
        return !this.memberName;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get backgroundStyle() {
        if (this.isMe)
            return PThemeEnum.PRIMARY;
        return null;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get borderStyle() {
        // don’t set the border style here. Instead use styles from .is-me
        if (this.isMe)
            return undefined;
        if (this._borderStyle)
            return this._borderStyle;
        if (this.trashed)
            return PThemeEnum.DANGER;
        switch (this.absenceType) {
            case 'trashed':
            case SchedulingApiAbsenceType.ILLNESS:
            case SchedulingApiAbsenceType.VACATION:
                return PThemeEnum.DANGER;
            case null:
                return undefined;
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get badgeText() {
        var _a;
        if (this.icon && !this.alwaysShowMemberInitials)
            return null;
        if (this._text !== undefined)
            return this._text;
        return (_a = this.memberInitials) !== null && _a !== void 0 ? _a : '···';
    }
    debugHint() {
        // eslint-disable-next-line literal-blacklist/literal-blacklist
        this.console.warn('IMPROVE: Add [memberId]="member.id" [firstName]="member.firstName" [lastName]="member.lastName" [absenceType]="\'trashed\'" to make this a dump component.');
    }
    get firstName() {
        if (this._firstName !== undefined)
            return this._firstName;
        if (!this.member)
            return null;
        this.debugHint();
        return this.member.firstName;
    }
    get memberId() {
        if (this._memberId !== null)
            return this._memberId;
        if (!this.member)
            return null;
        this.debugHint();
        return this.member.id;
    }
    get lastName() {
        if (this._lastName !== undefined)
            return this._lastName;
        if (!this.member)
            return null;
        this.debugHint();
        return this.member.lastName;
    }
    get trashed() {
        if (this.absenceType === 'trashed')
            return true;
        if (!this.member)
            return null;
        this.debugHint();
        return this.member.trashed;
    }
    get memberInitials() {
        return this.pMemberBadgeService.getInitials({
            id: this.memberId,
            firstName: this.firstName,
            lastName: this.lastName,
            trashed: this.trashed,
        }, this.api.isLoaded() ? this.api.data.members : null);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get memberName() {
        let result = '';
        if (this.firstName)
            result += `${this.firstName}`;
        if (this.lastName)
            result += ` ${this.lastName}`;
        return result;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get icon() {
        if (this._icon)
            return this._icon;
        if (this.trashed)
            return PlanoFaIconPool.TRASHED;
        switch (this.absenceType) {
            case 'trashed':
                return PlanoFaIconPool.TRASHED;
            case SchedulingApiAbsenceType.ILLNESS:
                return PlanoFaIconPool.ITEMS_ABSENCE_ILLNESS;
            case SchedulingApiAbsenceType.VACATION:
                return PlanoFaIconPool.ITEMS_ABSENCE_VACATION;
            case null:
                return undefined;
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get iconStyle() {
        if (this._iconStyle)
            return this._iconStyle;
        return this.borderStyle;
    }
};
__decorate([
    Input('text'),
    __metadata("design:type", String)
], MemberBadgeComponent.prototype, "_text", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MemberBadgeComponent.prototype, "member", void 0);
__decorate([
    Input('borderStyle'),
    __metadata("design:type", Object)
], MemberBadgeComponent.prototype, "_borderStyle", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MemberBadgeComponent.prototype, "absenceType", void 0);
__decorate([
    Input('icon'),
    __metadata("design:type", Object)
], MemberBadgeComponent.prototype, "_icon", void 0);
__decorate([
    Input('iconStyle'),
    __metadata("design:type", Object)
], MemberBadgeComponent.prototype, "_iconStyle", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], MemberBadgeComponent.prototype, "size", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], MemberBadgeComponent.prototype, "shadow", void 0);
__decorate([
    Input('firstName'),
    __metadata("design:type", String)
], MemberBadgeComponent.prototype, "_firstName", void 0);
__decorate([
    Input('lastName'),
    __metadata("design:type", String)
], MemberBadgeComponent.prototype, "_lastName", void 0);
__decorate([
    Input('memberId'),
    __metadata("design:type", Object)
], MemberBadgeComponent.prototype, "_memberId", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], MemberBadgeComponent.prototype, "isMe", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MemberBadgeComponent.prototype, "alwaysShowMemberInitials", void 0);
MemberBadgeComponent = __decorate([
    Component({
        selector: 'p-member-badge',
        templateUrl: './member-badge.component.html',
        styleUrls: ['./member-badge.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [PMemberBadgeService,
        LogService, typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object])
], MemberBadgeComponent);
export { MemberBadgeComponent };
//# sourceMappingURL=member-badge.component.js.map