var _a, _b, _c, _d, _e, _f, _g, _h;
import { __decorate, __metadata } from "tslib";
import { Component, Input, Output, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { PWishesService } from '@plano/client/scheduling/wishes.service';
import { ToastsService } from '@plano/client/service/toasts.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { FilterService } from '@plano/client/shared/filter.service';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiShiftMemberPrefValue } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { PPushNotificationsService, PRequestWebPushNotificationPermissionContext } from '@plano/shared/core/p-push-notifications.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
let WishPickerComponent = class WishPickerComponent {
    constructor(schedulingService, filterService, pWishesService, toastsService, pPushNotificationsService, localize) {
        this.schedulingService = schedulingService;
        this.filterService = filterService;
        this.pWishesService = pWishesService;
        this.toastsService = toastsService;
        this.pPushNotificationsService = pPushNotificationsService;
        this.localize = localize;
        this._alwaysTrue = true;
        this.memberPrefValues = {
            CAN: SchedulingApiShiftMemberPrefValue.CAN,
            CANNOT: SchedulingApiShiftMemberPrefValue.CANNOT,
            WANT: SchedulingApiShiftMemberPrefValue.WANT,
        };
        this.shift = null;
        this.shifts = null;
        this.onPick = new EventEmitter();
        this.collapsed = false;
        this.CONFIG = Config;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    onUncollapse(event) {
        // this.collapsed = false;
        // this.onCollapseChanges.emit(this.collapsed);
        event.preventDefault();
        event.stopPropagation();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get pickerButtonsDisabled() {
        var _a;
        if (!this.shift && !((_a = this.shifts) === null || _a === void 0 ? void 0 : _a.length))
            return true;
        return false;
    }
    /**
     * Handle click on one of the whish buttons
     */
    handleOnPick($event, whish = 0) {
        if (this.pickerButtonsDisabled)
            return;
        // this.collapsed = true;
        // this.onCollapseChanges.emit(this.collapsed);
        $event.preventDefault();
        $event.stopPropagation();
        if (this.shift) {
            this.shift.myPref = whish;
        }
        else if (this.shifts) {
            for (const shift of this.shifts.iterable()) {
                shift.myPref = whish;
            }
        }
        this.shifts.setSelected(false);
        this.onPick.emit(whish);
        this.api.save();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get myPref() {
        var _a;
        if (this.shift)
            return this.shift.myPref;
        if (this.shifts)
            return (_a = this.shifts.myPref) !== null && _a !== void 0 ? _a : null;
        return null;
    }
    askForNotificationPermissionIfNecessary() {
        this.pPushNotificationsService.requestWebPushNotificationPermission(PRequestWebPushNotificationPermissionContext.CLOSED_UI_WISH_PICKER_MODE);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    stopMode() {
        if (this.api.isLoaded()) {
            this.api.data.shifts.setSelected(false);
        }
        if (Config.IS_MOBILE) {
            this.filterService.showOnlyWishPickerAssignmentProcesses(false);
        }
        this.schedulingService.wishPickerMode = false;
        this.triggerThankYouMessage();
        this.askForNotificationPermissionIfNecessary();
    }
    triggerThankYouMessage() {
        let msg = this.localize.transform('Danke für deine Schichtwünsche.');
        if (this.pWishesService.freeWishesCount) {
            msg += `<br>${this.pWishesService.freeWishesCount}`;
            if (this.pWishesService.freeWishesCount === 1) {
                msg += ` ${this.localize.transform('Schichtwunsch ist noch offen.')}`;
            }
            else if (this.pWishesService.freeWishesCount > 1) {
                msg += ` ${this.localize.transform('Schichtwünsche sind noch offen.')}`;
            }
        }
        this.toastsService.addToast({
            content: msg,
            theme: this.pWishesService.freeWishesCount ? PThemeEnum.INFO : PThemeEnum.SUCCESS,
            visibleOnMobile: true,
        });
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get popoverForREMOVE() {
        if (this.pickerButtonsDisabled)
            return this.localize.transform('Bitte erst Schichten auswählen');
        return this.localize.transform('Schichtwunsch entfernen');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get popoverForWANT() {
        if (this.pickerButtonsDisabled)
            return this.localize.transform('Bitte erst Schichten auswählen');
        return this.localize.transform('Möchte die Schicht');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get popoverForCAN() {
        if (this.pickerButtonsDisabled)
            return this.localize.transform('Bitte erst Schichten auswählen');
        return this.localize.transform('Wenn es sein muss');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get popoverForCANNOT() {
        if (this.pickerButtonsDisabled)
            return this.localize.transform('Bitte erst Schichten auswählen');
        return this.localize.transform('Kann nicht');
    }
};
__decorate([
    HostBinding('class.d-flex'),
    __metadata("design:type", Object)
], WishPickerComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], WishPickerComponent.prototype, "shift", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], WishPickerComponent.prototype, "shifts", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_g = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _g : Object)
], WishPickerComponent.prototype, "api", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_h = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _h : Object)
], WishPickerComponent.prototype, "onPick", void 0);
WishPickerComponent = __decorate([
    Component({
        selector: 'p-wish-picker[api]',
        templateUrl: './wish-picker.component.html',
        styleUrls: ['./wish-picker.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        // host: {
        // 	'(dragover)': 'onDragOver()'
        // },
        // animations: [
        // 	// TODO: This is very slow. Need to find a better solution before i reenable this.
        // 	// trigger('scaleIn', [
        // 	// 	state('false', style({
        // 	// 		display: 'none !important',
        // 	// 		padding: '0',
        // 	// 		width: '0',
        // 	// 		opacity: '0'
        // 	// 	})),
        // 	// 	state('true', style({
        // 	// 	})),
        // 	//
        // 	// 	transition('false => true', [
        // 	// 		animate(150)
        // 	// 	]),
        // 	// 	transition('true => false', [
        // 	// 		animate(0)
        // 	// 	]),
        // 	// ]),
        // 	// trigger('scale', [
        // 	// 	state('false', style({
        // 	// 		display: 'none !important',
        // 	// 		padding: '0',
        // 	// 		width: '0',
        // 	// 		opacity: '0'
        // 	// 	})),
        // 	// 	state('true', style({
        // 	// 	})),
        // 	//
        // 	// 	transition('false => true', [
        // 	// 		animate(150)
        // 	// 	]),
        // 	// 	transition('true => false', [
        // 	// 		animate(150)
        // 	// 	]),
        // 	// ])
        // ],
    }),
    __metadata("design:paramtypes", [SchedulingService, typeof (_a = typeof FilterService !== "undefined" && FilterService) === "function" ? _a : Object, PWishesService, typeof (_b = typeof ToastsService !== "undefined" && ToastsService) === "function" ? _b : Object, typeof (_c = typeof PPushNotificationsService !== "undefined" && PPushNotificationsService) === "function" ? _c : Object, typeof (_d = typeof LocalizePipe !== "undefined" && LocalizePipe) === "function" ? _d : Object])
], WishPickerComponent);
export { WishPickerComponent };
//# sourceMappingURL=wish-picker.component.js.map