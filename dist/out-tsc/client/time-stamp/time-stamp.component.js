var _a;
import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { ToastsService } from '@plano/client/service/toasts.service';
import { RightsService, TimeStampApiShift } from '@plano/shared/api';
import { TimeStampApiShiftModel, TimeStampApiService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { BootstrapSize, PThemeEnum } from '../shared/bootstrap-styles.enum';
let TimeStampComponent = class TimeStampComponent {
    constructor(meService, api, toasts, localize, rightsService) {
        this.meService = meService;
        this.api = api;
        this.toasts = toasts;
        this.localize = localize;
        this.rightsService = rightsService;
        this._alwaysTrue = true;
        /**
         * Flag to define if this work-session is a unplanned
         */
        this.isUnplanned = false;
        /**
         * The temporary selected shiftModel or shift that will be used as selected item if user hits
         * start
         * NOTE: We can not store it directly into api.data.selectedShiftId because this would have an
         * effect on the diff function – so it could cause trouble in the database.
         */
        this.tempSelectedItem = null;
        this.PThemeEnum = PThemeEnum;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.BootstrapSize = BootstrapSize;
        this.loadNewData();
    }
    /**
     * Returns starting time of currently stamped shift
     */
    get start() {
        if (!this.api.isLoaded())
            return undefined;
        return this.api.data.start;
    }
    /**
     * The temporary selected shift Id that will be used as selected item if user hits start
     */
    get tempSelectedShiftId() {
        if (this.tempSelectedItem instanceof TimeStampApiShift) {
            return this.tempSelectedItem.id;
        }
        return null;
    }
    // FIXME: PLANO-15429 - Return type should be ShiftId not Id
    /**
     * Returns the Id of the selected shift. No matter if temporary or already active.
     */
    get selectedShiftId() {
        if (this.api.data.selectedShiftId !== null) {
            return this.api.data.selectedShiftId;
        }
        return this.tempSelectedShiftId;
    }
    /**
     * Is there a temporary selected shift id that will be used as selected item if user hits start?
     */
    get hasTempSelectedShiftId() {
        return this.tempSelectedShiftId !== null;
    }
    /**
     * The temporary selected item that will be used if user hits start
     */
    get tempSelectedShiftModelId() {
        if (this.tempSelectedItem instanceof TimeStampApiShiftModel) {
            return this.tempSelectedItem.id;
        }
        return undefined;
    }
    /**
     * Load new Data from api
     */
    loadNewData() {
        this.api.load({
            success: () => {
                if (!this.api.data.shifts.length) {
                    this.isUnplanned = true;
                }
            },
        });
    }
    /**
     * Disables the checkbox for unplanned shifts
     */
    get disableUnplannedShiftToggle() {
        if (!this.api.isLoaded())
            return true;
        if (!this.unplannedEntriesPossible)
            return true;
        if (this.noStampableItemsAvailableForStamping)
            return true;
        return !!this.start || !this.api.data.shifts.length;
    }
    /**
     * Is tracking for unplanned entries for this user possible?
     */
    get unplannedEntriesPossible() {
        if (!this.shiftModelsForDropdown.length)
            return false;
        return true;
    }
    /**
     * Is tracking for planned entries (those for shifts where user is assigned) for this user possible?
     */
    get plannedEntriesPossible() {
        if (!this.api.data.shifts.length)
            return false;
        return true;
    }
    /**
     * User has selected a new shiftModel
     */
    onSelectShiftModelId(id) {
        this.onSelectItem(this.api.data.shiftModels.get(id !== null && id !== void 0 ? id : null));
    }
    /**
     * User has selected a new shift
     */
    onSelectShiftId(id) {
        this.onSelectItem(this.api.data.shifts.get(id !== null && id !== void 0 ? id : null));
    }
    /**
     * Disables the select shifts dropdown mostly depending on user action
     */
    get disableShiftSelect() {
        if (!this.api.isLoaded())
            return true;
        // some time-stamp entry is already running? block btn
        if (this.start)
            return true;
        // user selected "i want to track a unplanned shift"
        if (this.isUnplanned)
            return true;
        // user selected "i want to track a planned shift"
        if (!this.api.data.shifts.length)
            return true;
        return false;
    }
    /**
     * Disables the select shifts dropdown mostly depending on BE
     */
    get disableShiftModelSelect() {
        // Block every api-related button if api is not loaded
        if (!this.api.isLoaded())
            return true;
        // some time-stamp entry is already running? block btn
        if (this.start)
            return true;
        // this user can not do unplanned entries? block btn
        if (!this.unplannedEntriesPossible)
            return true;
        // user selected "i want to track a planned shift"
        if (!this.isUnplanned)
            return true;
        return false;
    }
    /**
     * User has selected a new item
     */
    onSelectItem(shiftItem = null) {
        this.tempSelectedItem = shiftItem;
    }
    /**
     * Returns generated warning messages
     */
    get warningMessages() {
        return this.api.warningMessages;
    }
    /**
     * toggle the 'is unplanned' checkbox and select an item
     */
    toggleIsUnplanned() {
        this.isUnplanned = !this.isUnplanned;
        this.onSelectItem();
    }
    /**
     * Returns the initial shift model of the selected Item
     */
    get initialShiftModel() {
        if (this.api.data.selectedItem instanceof TimeStampApiShiftModel) {
            return this.api.data.selectedItem;
        }
        return undefined;
    }
    /**
     * When user ends his tracked time.
     */
    onEnd() {
        this.addEndToast();
        this.refreshCommentReminderToast();
    }
    /**
     * Adds the reminder if necessary
     */
    refreshCommentReminderToast() {
        const newToast = {
            content: this.localize.transform('Du musst unten noch einen Kommentar für die Personalleitung abgeben.'),
            theme: PThemeEnum.WARNING,
            visibilityDuration: 'long',
        };
        if (!this.api.data.end)
            return;
        if (this.api.hasWarningMessages && !this.api.data.comment) {
            this.toasts.addToast(newToast);
        }
        else {
            this.toasts.removeToast(newToast);
        }
    }
    /**
     * Success-Toast
     */
    addEndToast() {
        if (!this.api.data.end)
            return;
        this.toasts.addToast({
            content: this.localize.transform(
            // eslint-disable-next-line literal-blacklist/literal-blacklist
            'Deine eingestempelten Zeiten wurden gespeichert! Du kannst sie in der <a href="client/report">Auswertung</a> einsehen.'),
            theme: PThemeEnum.SUCCESS,
            visibilityDuration: 'long',
        });
    }
    /**
     * ngOnDestroy
     */
    ngOnDestroy() {
        this.toasts.removeAllToasts();
    }
    /**
     * Reset the time-stamp so the user can e.g. start a new shift right away
     */
    resetTimeStamp(event) {
        this.tempSelectedItem = null;
        this.onSelectItem();
        if (event) {
            event.preventDefault();
        }
        this.toasts.removeAllToasts();
        this.api.setEmptyData();
        this.loadNewData();
    }
    /**
     * Is this device allowed to use the time stamp? `undefined` is returned if this cannot be determined yet.
     */
    get isAllowedTimeStampDevice() {
        return this.api.data.allowedTimeStampDevices.isDeviceAllowedToTimeStamp();
    }
    /**
     * Returns tooltip relating to unplanned shifts
     * @example 'Your are not allowed…'
     * @example 'Thank your for …'
     */
    get unplannedShiftToggleTooltipContent() {
        if (Config.IS_MOBILE)
            return undefined;
        if (!this.unplannedEntriesPossible)
            return this.localize.transform('Du darfst keine Tätigkeiten ausführen. Dementsprechend kannst du keinen ungeplanten Einsatz stempeln.');
        if (this.disableUnplannedShiftToggle)
            return this.localize.transform('Aktuell bist du keiner Schicht zugewiesen. Also kannst du nur einen ungeplanten Einsatz machen. Wähle dazu eine Tätigkeit und klicke auf »Einstempeln«.');
        return this.localize.transform('Du hilfst deinen Kollegen, obwohl du nicht für die Schicht eingetragen warst? Löblich! Deine Arbeitszeit kannst du dann als »ungeplanten Einsatz« stempeln. Wähle dazu eine Tätigkeit und klicke auf »Einstempeln«.');
    }
    /**
     * Returns the for the user available shift models
     */
    get shiftModelsForDropdown() {
        return this.api.data.shiftModels.filterBy(item => item.assignable && !item.trashed);
    }
    /**
     * Are there any shift models assigned to the user?
     */
    get noStampableItemsAvailableForStamping() {
        return !this.shiftModelsForDropdown.length && !this.api.data.shifts.length;
    }
    /**
     * Check if shiftmodels exists.
     */
    get noShiftModelExists() {
        return !this.api.data.shiftModels.filterBy(item => !item.trashed).length;
    }
    /**
     * Has the user rights to create shiftModels?
     */
    get canCreateShiftModels() {
        return this.rightsService.isOwner;
    }
    /**
     * Specially on mobile we want to show as few ui elements as possible.
     * So we don’t always show the section (checkbox and input) for unplanned shifts.
     */
    get showSectionForUnplanned() {
        if (Config.IS_MOBILE && !this.unplannedEntriesPossible)
            return false;
        return !this.api.data.start || !!this.initialShiftModel;
    }
    /**
     * Label for the button for the shift dropdown.
     * returning undefined means that the default will be used. default ist something like "choose your shift"
     */
    get shiftSelectPlaceholder() {
        if (!this.plannedEntriesPossible)
            return this.localize.transform('Keine Schichten zu stempeln');
        return null;
    }
};
__decorate([
    HostBinding('class.flex-grow-1'),
    HostBinding('class.d-flex'),
    HostBinding('class.position-relative'),
    __metadata("design:type", Object)
], TimeStampComponent.prototype, "_alwaysTrue", void 0);
TimeStampComponent = __decorate([
    Component({
        selector: 'p-time-stamp',
        templateUrl: './time-stamp.component.html',
        styleUrls: ['./time-stamp.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        // animations: [
        // 	trigger('slide', [
        // 		transition(':enter', [
        // 			style({
        // 				height: 0,
        // 				overflow: 'hidden',
        // 			}),
        // 			animate(300),
        // 		]),
        // 		transition(':leave', [
        // 			style({
        // 				height: 0,
        // 				overflow: 'hidden',
        // 			}),
        // 			animate(300),
        // 		]),
        // 	]),
        // ],
    }),
    __metadata("design:paramtypes", [MeService,
        TimeStampApiService,
        ToastsService,
        LocalizePipe, typeof (_a = typeof RightsService !== "undefined" && RightsService) === "function" ? _a : Object])
], TimeStampComponent);
export { TimeStampComponent };
//# sourceMappingURL=time-stamp.component.js.map