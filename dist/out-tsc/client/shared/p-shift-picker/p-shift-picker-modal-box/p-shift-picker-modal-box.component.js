var PShiftPickerModalBoxComponent_1;
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, ViewChild, forwardRef, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { SchedulingApiShiftExchangeShiftRef, SchedulingApiShiftExchangeCommunicationSwapOffer } from '@plano/shared/api';
import { SchedulingApiShifts } from '@plano/shared/api';
import { SchedulingApiShiftExchangeShiftRefs } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PPossibleErrorNames } from '@plano/shared/core/validators.types';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { PShiftExchangeService } from '../../p-shift-exchange/shift-exchange.service';
import { PShiftPickerService } from '../p-shift-picker.service';
import { PShiftPickerComponent } from '../p-shift-picker/p-shift-picker.component';
let PShiftPickerModalBoxComponent = PShiftPickerModalBoxComponent_1 = class PShiftPickerModalBoxComponent {
    constructor(console, pShiftExchangeService, pShiftPickerService, modalService, localize, changeDetectorRef, rightsService) {
        this.console = console;
        this.pShiftExchangeService = pShiftExchangeService;
        this.pShiftPickerService = pShiftPickerService;
        this.modalService = modalService;
        this.localize = localize;
        this.changeDetectorRef = changeDetectorRef;
        this.rightsService = rightsService;
        this.readMode = false;
        this.calendarBtnClick = new EventEmitter();
        this.loadDetailedItem = null;
        this.member = null;
        // @ViewChild('pEditableModalBox', { static: true }) private pEditableModalBox !: PEditableModalBoxComponent;
        this.shiftTemplate = null;
        this.addItem = new EventEmitter();
        this.onAddShifts = new EventEmitter();
        /**
         * Triggers when modal gets opened
         */
        this.onModalOpen = new EventEmitter();
        /**
         * Triggers when modal gets closed
         */
        this.onModalClosed = new EventEmitter();
        /**
         * With this boolean you can hide the calendarBtn even if calendarBtnClick has observers
         */
        this._showCalendarBtn = null;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.CONFIG = Config;
        this.beforeModalClose = (success) => {
            if (!this.giveUserAHintAboutUnusedSelectedShifts) {
                success();
                return;
            }
            this.modalService.confirm({
                modalTitle: this.localize.transform('Sicher?'),
                description: this.localize.transform('Du hast Schichten im Kalender selektiert, aber sie nicht der Tauschbörse hinzugefügt.'),
                closeBtnLabel: this.localize.transform('Trotzdem schließen'),
                dismissBtnLabel: this.localize.transform('Zurück'),
            }, {
                success: () => {
                    this.api.data.shifts.selectedItems.setSelected(false);
                    success();
                },
                theme: PThemeEnum.WARNING,
                size: BootstrapSize.MD,
            });
        };
        // These are necessary Inputs and Outputs for pEditable form-element
        this.pEditable = false;
        this.api = null;
        this.valid = null;
        this.onSaveStart = new EventEmitter();
        this.onSaveSuccess = new EventEmitter();
        this.onDismiss = new EventEmitter();
        this.onLeaveCurrent = new EventEmitter();
        this.editMode = new EventEmitter(undefined);
        /**
         * This is the minimum code that is required for a custom control in Angular.
         * Its necessary to make [(ngModel)] and [formControl] work.
         */
        this.disabled = false;
        // eslint-disable-next-line @typescript-eslint/ban-types
        this.formArray = null;
        this._required = false;
        this._value = null;
        this.onChange = () => { };
        /** onTouched */
        this.onTouched = () => { };
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftRefs() {
        const array = new SchedulingApiShiftExchangeShiftRefs(null, false);
        for (const control of this.formArray.controls) {
            array.push(control.value);
        }
        return array;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get sortedShiftRefs() {
        return this.offersRef.iterableSortedBy((item) => {
            const shift = this.api.data.shifts.get(item.id);
            if (!shift)
                throw new Error('Could not find shift');
            return shift.start;
        });
    }
    ngAfterContentInit() {
        assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
    }
    /**
     * Load necessary data for this modal
     */
    openModalSubscriber() {
        this.console.debug('open Modal');
        // This is a hack to reduce the "Freezing modal slide-in animation" effect.
        window.setTimeout(() => {
            assumeDefinedToGetStrictNullChecksRunning(this, 'this');
            if (this.shiftPickerRef)
                this.shiftPickerRef.loadNewData();
        }, 350);
        this.onModalOpen.emit();
    }
    get giveUserAHintAboutUnusedSelectedShifts() {
        return !!this.availableShifts.selectedItems.length;
    }
    /**
     * Save changes
     */
    closeModalSubscriber() {
        this.console.debug('close Modal');
        this.onModalClosed.emit();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isValid() {
        return this.valid !== null ? this.valid : (!this.formArray || !this.formArray.invalid);
    }
    /**
     * Is this a required field?
     * This can be set as Input() but if there is a formControl binding,
     * then it takes the info from the formControl’s validators.
     */
    get required() {
        var _a, _b;
        if (this._required)
            return this._required;
        if (this.formArray) {
            const validator = (_b = (_a = this.formArray).validator) === null || _b === void 0 ? void 0 : _b.call(_a, this.formArray);
            if (!validator)
                return false;
            return !!validator[PPossibleErrorNames.REQUIRED] || !!validator[PPossibleErrorNames.ID_DEFINED] || !!validator[PPossibleErrorNames.NOT_UNDEFINED];
        }
        return false;
    }
    /** the value of this control */
    get value() { return this._value; }
    set value(value) {
        if (value === this._value)
            return;
        this._value = value;
        this.onChange(value);
    }
    /** Write a new value to the element. */
    writeValue(value) {
        if (this._value === value)
            return;
        this._value = value;
        this.changeDetectorRef.detectChanges();
    }
    /**
     * @see ControlValueAccessor['registerOnChange']
     *
     * Note that registerOnChange() only gets called if a formControl is bound.
     * @param fn Accepts a callback function which you can call when changes happen so that you can notify the outside world that
     * the data model has changed.
     * Note that you call it with the changed data model value.
     */
    registerOnChange(fn) { this.onChange = fn; }
    /** Set the function to be called when the control receives a touch event. */
    registerOnTouched(fn) { this.onTouched = fn; }
    /** setDisabledState */
    setDisabledState(isDisabled) {
        var _a, _b;
        if (this.disabled === isDisabled)
            return;
        // Set internal attribute which gets used in the template.
        this.disabled = isDisabled;
        // Refresh the formArray. #two-way-binding
        this.disabled ? (_a = this.formArray) === null || _a === void 0 ? void 0 : _a.disable() : (_b = this.formArray) === null || _b === void 0 ? void 0 : _b.enable();
    }
    /**
     * Highlight the related shift in the calendar. This action is made for the Scheduling site.
     */
    onCalendarClick(shiftRef) {
        this.calendarBtnClick.emit(shiftRef);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showCalendarBtn() {
        if (this._showCalendarBtn !== null)
            return this._showCalendarBtn;
        return !!this.calendarBtnClick.observers.length;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onRemoveOffer(offer) {
        this.pShiftPickerService.onRemoveOffer(this.formArray, this.offersRef, offer);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    removeFromOffer(shiftRef, offer) {
        if (shiftRef instanceof SchedulingApiShiftExchangeShiftRef) {
            this.onRemoveOffer(shiftRef);
        }
        else if (offer instanceof SchedulingApiShiftExchangeCommunicationSwapOffer) {
            offer.shiftRefs.removeItem(shiftRef);
            this.formArray.updateValueAndValidity();
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get labelText() {
        var _a;
        if ((_a = this.formArray) === null || _a === void 0 ? void 0 : _a.length)
            return undefined;
        return this.localize.transform('Bitte wählen…');
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftPickerBtnLabel() {
        if (this.formArray.length >= 2)
            return undefined;
        if (Config.IS_MOBILE)
            return undefined;
        return this.localize.transform('Schichten hinzufügen');
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isMe() {
        var _a;
        if (!this.member)
            return null;
        return (_a = this.rightsService.isMe(this.member.id)) !== null && _a !== void 0 ? _a : null;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PShiftPickerModalBoxComponent.prototype, "readMode", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], PShiftPickerModalBoxComponent.prototype, "calendarBtnClick", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftPickerModalBoxComponent.prototype, "loadDetailedItem", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftPickerModalBoxComponent.prototype, "member", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_g = typeof SchedulingApiShifts !== "undefined" && SchedulingApiShifts) === "function" ? _g : Object)
], PShiftPickerModalBoxComponent.prototype, "availableShifts", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftPickerModalBoxComponent.prototype, "shiftTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_j = typeof SchedulingApiShiftExchangeShiftRefs !== "undefined" && SchedulingApiShiftExchangeShiftRefs) === "function" ? _j : Object)
], PShiftPickerModalBoxComponent.prototype, "offersRef", void 0);
__decorate([
    ViewChild('shiftPickerRef', { static: false }),
    __metadata("design:type", PShiftPickerComponent)
], PShiftPickerModalBoxComponent.prototype, "shiftPickerRef", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_k = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _k : Object)
], PShiftPickerModalBoxComponent.prototype, "addItem", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_l = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _l : Object)
], PShiftPickerModalBoxComponent.prototype, "onAddShifts", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_m = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _m : Object)
], PShiftPickerModalBoxComponent.prototype, "onModalOpen", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_o = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _o : Object)
], PShiftPickerModalBoxComponent.prototype, "onModalClosed", void 0);
__decorate([
    Input('showCalendarBtn'),
    __metadata("design:type", Object)
], PShiftPickerModalBoxComponent.prototype, "_showCalendarBtn", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftPickerModalBoxComponent.prototype, "pEditable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftPickerModalBoxComponent.prototype, "api", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftPickerModalBoxComponent.prototype, "valid", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftPickerModalBoxComponent.prototype, "saveChangesHook", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PShiftPickerModalBoxComponent.prototype, "onSaveStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PShiftPickerModalBoxComponent.prototype, "onSaveSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PShiftPickerModalBoxComponent.prototype, "onDismiss", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PShiftPickerModalBoxComponent.prototype, "onLeaveCurrent", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PShiftPickerModalBoxComponent.prototype, "editMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PShiftPickerModalBoxComponent.prototype, "disabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftPickerModalBoxComponent.prototype, "formArray", void 0);
__decorate([
    Input('required'),
    __metadata("design:type", Boolean)
], PShiftPickerModalBoxComponent.prototype, "_required", void 0);
PShiftPickerModalBoxComponent = PShiftPickerModalBoxComponent_1 = __decorate([
    Component({
        selector: 'p-shift-picker-modal-box[availableShifts][offersRef]',
        templateUrl: './p-shift-picker-modal-box.component.html',
        styleUrls: ['./p-shift-picker-modal-box.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PShiftPickerModalBoxComponent_1),
                multi: true,
            },
        ],
    }),
    __metadata("design:paramtypes", [LogService,
        PShiftExchangeService,
        PShiftPickerService,
        ModalService,
        LocalizePipe, typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object, typeof (_b = typeof RightsService !== "undefined" && RightsService) === "function" ? _b : Object])
], PShiftPickerModalBoxComponent);
export { PShiftPickerModalBoxComponent };
//# sourceMappingURL=p-shift-picker-modal-box.component.js.map