var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { RightsService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { assumeNonNull } from '../../../../shared/core/null-type-utils';
import { PBtnThemeEnum, PThemeEnum } from '../../bootstrap-styles.enum';
import { PShiftExchangeConceptService } from '../p-shift-exchange-concept.service';
import { PShiftExchangeService } from '../shift-exchange.service';
let PShiftExchangeBtnComponent = class PShiftExchangeBtnComponent {
    constructor(router, pShiftExchangeConceptService, rightsService, pShiftExchangeService, localize) {
        this.router = router;
        this.pShiftExchangeConceptService = pShiftExchangeConceptService;
        this.rightsService = rightsService;
        this.pShiftExchangeService = pShiftExchangeService;
        this.localize = localize;
        this.shiftExchange = null;
        this.shiftId = null;
        this.assignedMember = null;
        this.hideNonCounterBadges = false;
        this.colorizeIconIfShiftExchangeExists = false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get badgeValue() {
        if (!this.shiftExchange)
            return null;
        const icon = this.pShiftExchangeConceptService.getBadgeIcon(this.shiftExchange);
        if (icon && !this.hideNonCounterBadges)
            return icon;
        if (this.shiftExchange.todoCount)
            return this.shiftExchange.todoCount;
        return null;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get icon() {
        if (!this.shiftExchange) {
            if (Config.DEBUG && !this.assignedMember)
                throw new Error('provide assigned member here');
            if (this.rightsService.isMe(this.assignedMember.id))
                return 'hands-helping';
            return 'briefcase-medical';
        }
        else if (this.shiftExchange.isIllness && !this.shiftExchange.isBasedOnIllness) {
            return 'briefcase-medical';
        }
        return 'hands-helping';
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get title() {
        let result = '';
        if (this.icon === 'hands-helping') {
            result += this.shiftExchange ? this.localize.transform('Ersatzsuche anzeigen') : this.localize.transform('Ersatz suchen');
        }
        else if (this.icon === 'briefcase-medical') {
            if (this.shiftExchange) {
                result += this.localize.transform('Krankmeldung anzeigen');
            }
            else {
                result += this.localize.transform('Krank melden');
                if (
                /** If shift exists, check if user is allowed to manage it */
                // eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
                this.shiftExchange &&
                    // @ts-expect-error -- BUG: PLANO-18170 Nils… this.shiftExchange can not be defined here!
                    this.rightsService.hasManagerRightsForAllShiftRefs(this.shiftExchange.shiftRefs) ||
                    /** If shiftId exists, check if user is allowed to manage it */
                    this.shiftId &&
                        this.rightsService.hasManagerRightsForShiftModel(this.shiftId.shiftModelId)) {
                    result += ` & ${this.localize.transform('Ersatz suchen')}`;
                }
            }
        }
        else if (Config.DEBUG)
            throw new Error('Icon unknown');
        return result;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get style() {
        if (this.icon === 'briefcase-medical' && this.shiftExchange)
            return PBtnThemeEnum.OUTLINE_DANGER;
        return PThemeEnum.SECONDARY;
    }
    /**
     * Navigate to the detail page of this item
     */
    navToDetailPage() {
        if (
        // User wants to edit existing shiftExchange? Go for it!
        !this.shiftExchange) {
            assumeNonNull(this.shiftId);
            if (this.pShiftExchangeService.blockedByAssignmentProcessWarningModal(this.shiftId))
                return;
        }
        let lastPartOfRoute;
        if (this.shiftExchange) {
            lastPartOfRoute = this.shiftExchange.id.toString();
        }
        else if (this.shiftId) {
            lastPartOfRoute = `create/${this.shiftId.toUrl()}`;
            if (this.assignedMember) {
                lastPartOfRoute += `/member/${this.assignedMember.id.toString()}`;
            }
        }
        else {
            throw new Error('Could not navigate. Id is missing.');
        }
        this.router.navigate([`/client/shift-exchange/${lastPartOfRoute}/`]);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get iconHasTextPrimaryClass() {
        return this.icon === 'hands-helping' && !!this.shiftExchange && this.colorizeIconIfShiftExchangeExists;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftExchangeBtnComponent.prototype, "shiftExchange", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftExchangeBtnComponent.prototype, "shiftId", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftExchangeBtnComponent.prototype, "assignedMember", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PShiftExchangeBtnComponent.prototype, "hideNonCounterBadges", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PShiftExchangeBtnComponent.prototype, "colorizeIconIfShiftExchangeExists", void 0);
PShiftExchangeBtnComponent = __decorate([
    Component({
        selector: 'p-shift-exchange-btn',
        templateUrl: './p-shift-exchange-btn.component.html',
        styleUrls: ['./p-shift-exchange-btn.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof Router !== "undefined" && Router) === "function" ? _a : Object, PShiftExchangeConceptService, typeof (_b = typeof RightsService !== "undefined" && RightsService) === "function" ? _b : Object, PShiftExchangeService,
        LocalizePipe])
], PShiftExchangeBtnComponent);
export { PShiftExchangeBtnComponent };
//# sourceMappingURL=p-shift-exchange-btn.component.js.map