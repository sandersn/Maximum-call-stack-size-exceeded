var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { PWishesService } from '@plano/client/scheduling/wishes.service';
import { SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiMember } from '@plano/shared/api';
import { SchedulingApiShiftMemberPrefValue } from '@plano/shared/api';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '../../../../shared/core/pipe/localize.pipe';
import { AbsenceService } from '../../absence.service';
let PMemberWishIconComponent = class PMemberWishIconComponent {
    constructor(pWishesService, absenceService, console, localizePipe) {
        this.pWishesService = pWishesService;
        this.absenceService = absenceService;
        this.console = console;
        this.localizePipe = localizePipe;
        this.shift = null;
        this.member = null;
        this.console.debug('IMPROVE: Make wish-icon component dump');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get item() {
        var _a;
        return (_a = this.shift) !== null && _a !== void 0 ? _a : this.member;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get wish() {
        return this.pWishesService.getWish(this.item);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get title() {
        if (this.cannot)
            return this.localizePipe.transform('Kann nicht');
        if (this.can)
            return this.localizePipe.transform('Wenn es sein muss');
        if (this.want)
            return this.localizePipe.transform('Möchte die Schicht');
        return 'Kein Schichtwunsch vorhanden';
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get cannot() {
        return this.wish === SchedulingApiShiftMemberPrefValue.CANNOT;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get can() {
        return this.wish === SchedulingApiShiftMemberPrefValue.CAN;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get want() {
        return this.wish === SchedulingApiShiftMemberPrefValue.WANT;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get hasBeenAsked() {
        if (!this.pWishesService.isAssignable(this.item))
            return false;
        const member = this.item instanceof SchedulingApiMember ? this.item : this.pWishesService.item;
        const shift = this.item instanceof SchedulingApiShift ? this.item : this.pWishesService.item;
        if (this.absenceService.absenceTypeIconName(member.id, shift))
            return false;
        return true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get hasAnswer() {
        return this.cannot || this.can || this.want || this.hasBeenAsked;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PMemberWishIconComponent.prototype, "shift", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PMemberWishIconComponent.prototype, "member", void 0);
PMemberWishIconComponent = __decorate([
    Component({
        selector: 'p-member-wish-icon',
        templateUrl: './member-wish-icon.component.html',
        styleUrls: ['./member-wish-icon.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof PWishesService !== "undefined" && PWishesService) === "function" ? _a : Object, AbsenceService,
        LogService,
        LocalizePipe])
], PMemberWishIconComponent);
export { PMemberWishIconComponent };
//# sourceMappingURL=member-wish-icon.component.js.map