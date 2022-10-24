var PShiftPickerComponent_1;
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Input } from '@angular/core';
import { forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SectionWhitespace } from '@plano/client/shared/page/section/section.component';
import { SchedulingApiShiftExchange, SchedulingApiShiftExchangeCommunicationSwapOffers, SchedulingApiShiftExchangeShiftRefs } from '@plano/shared/api';
import { SchedulingApiShifts, SchedulingApiService, SchedulingApiMembers } from '@plano/shared/api';
import { SchedulingApiShiftExchangeShiftRef, SchedulingApiShiftExchangeCommunicationSwapOffer, SchedulingApiShiftExchangeSwappedShiftRefs } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PPossibleErrorNames } from '@plano/shared/core/validators.types';
import { PThemeEnum } from '../../bootstrap-styles.enum';
import { HighlightService } from '../../highlight.service';
import { PFormControl } from '../../p-forms/p-form-control';
import { PShiftExchangeService } from '../../p-shift-exchange/shift-exchange.service';
import { PShiftPickerService } from '../p-shift-picker.service';
import { PShiftPickerCalendarComponent } from '../shift-picker-calendar/shift-picker-calendar.component';
let PShiftPickerComponent = PShiftPickerComponent_1 = class PShiftPickerComponent {
    constructor(
    // TODO: Obsolete?
    api, 
    // TODO: Obsolete?
    highlightService, 
    // TODO: Obsolete?
    pShiftPickerService, pShiftExchangeService, meService, localize, pMoment, changeDetectorRef) {
        this.api = api;
        this.highlightService = highlightService;
        this.pShiftPickerService = pShiftPickerService;
        this.pShiftExchangeService = pShiftExchangeService;
        this.meService = meService;
        this.localize = localize;
        this.pMoment = pMoment;
        this.changeDetectorRef = changeDetectorRef;
        this.hideAddToOffersBtn = false;
        this.loadDetailedItem = null;
        this.shiftTemplate = null;
        this.offerTemplate = null;
        this.addItem = new EventEmitter();
        this.onAddShifts = new EventEmitter();
        /**
         * This is the minimum code that is required for a custom control in Angular.
         * Its necessary to make [(ngModel)] and [formControl] work.
         */
        this.disabled = false;
        // eslint-disable-next-line @typescript-eslint/ban-types
        this.formArray = null;
        this._required = false;
        this.CONFIG = Config;
        this.showList = true;
        this.showAsList = false;
        this.PThemeEnum = PThemeEnum;
        this.SectionWhitespace = SectionWhitespace;
        this.someHint = null;
        this._value = null;
        this.onChange = () => { };
        /** onTouched */
        this.onTouched = () => { };
        this.alerts = [];
        this.alertForHasBundle = null;
        this.alertForEqualoffers = null;
        this.alertForCommunicationReset = null;
        this.alertForNoMember = null;
        this.now = +this.pMoment.m();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isValid() {
        var _a;
        return !((_a = this.formArray) === null || _a === void 0 ? void 0 : _a.invalid);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get availableShifts() {
        const date = this.pShiftPickerService.date;
        const start = (+this.pMoment.m(date).startOf(this.pShiftPickerService.mode));
        const end = (+this.pMoment.m(date).startOf(this.pShiftPickerService.mode).add(1, this.pShiftPickerService.mode));
        return this._availableShifts.filterBy(item => {
            if (start > item.end)
                return false;
            if (end < item.start)
                return false;
            return true;
        });
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    loadNewData() {
        this.shiftPickerCalendarRef.loadNewData();
    }
    /**
     * A list of all assignable members for this ShiftRef
     * Assignable are members that are assignable to each and every of the provided shiftRefs
     */
    get assignableMembersForShiftRefs() {
        if (!(this.loadDetailedItem instanceof SchedulingApiShiftExchange))
            return undefined;
        const members = new SchedulingApiMembers(null, false);
        for (const assignableMember of this.loadDetailedItem.shiftRefs.assignableMembers.iterable()) {
            // Is this the indisposed member?
            if (this.loadDetailedItem.indisposedMemberId.equals(assignableMember.memberId))
                continue;
            const member = this.api.data.members.get(assignableMember.memberId);
            if (!member)
                throw new Error('Could not find assignable member');
            members.push(member);
        }
        return members;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get noMemberAvailableForTheseShiftRefs() {
        if (!(this.loadDetailedItem instanceof SchedulingApiShiftExchange))
            return undefined;
        if (!this.loadDetailedItem.shiftRefs.length)
            return undefined;
        if (!(this.loadDetailedItem instanceof SchedulingApiShiftExchange))
            return undefined;
        if (!this.assignableMembersForShiftRefs)
            throw new Error('can not get length of null');
        return !this.assignableMembersForShiftRefs.length;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showCommunicationResetAlert() {
        if (!(this.loadDetailedItem instanceof SchedulingApiShiftExchange))
            return undefined;
        if (!this.pShiftExchangeService.iAmTheResponsiblePersonForThisIllness(this.loadDetailedItem))
            return undefined;
        const communications = this.loadDetailedItem.communications;
        const reactionsLength = communications.reactionsForList.filterBy((item) => {
            var _a;
            if ((_a = communications.managerResponseCommunication) === null || _a === void 0 ? void 0 : _a.id.equals(item.id))
                return false;
            return true;
        }).length;
        return !!reactionsLength;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showBoundShiftOfferSetBtn() {
        return this.isPickerForCommunication;
    }
    get isPickerForCommunication() {
        return (this.offersRef instanceof SchedulingApiShiftExchangeCommunicationSwapOffers);
    }
    // private isSamePacketAsShiftRefs(itemId : ShiftId) : boolean {
    // 	for (const shiftRef of this.shiftRefs.iterable()) {
    // 		if (shiftRef instanceof SchedulingApiShiftExchangeCommunicationSwapOffer) {
    // 			for (const offerRef of shiftRef.shiftRefs.iterable()) {
    // 				if (offerRef.id.isSamePacket(itemId)) continue;
    // 				return false;
    // 			}
    // 		} else if (shiftRef.id.isSamePacket(itemId)) {
    // 			continue;
    // 		}
    // 		return false;
    // 	}
    // 	return true;
    // }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftRefs() {
        if (!this.formArray.controls.length)
            return new SchedulingApiShiftExchangeShiftRefs(null, false);
        let array;
        if (this.offersRef instanceof SchedulingApiShiftExchangeCommunicationSwapOffers) {
            array = new SchedulingApiShiftExchangeCommunicationSwapOffers(null, false);
        }
        else if (this.offersRef instanceof SchedulingApiShiftExchangeShiftRefs) {
            array = new SchedulingApiShiftExchangeShiftRefs(null, false);
        }
        else if (this.offersRef instanceof SchedulingApiShiftExchangeSwappedShiftRefs) {
            array = new SchedulingApiShiftExchangeSwappedShiftRefs(null, false);
        }
        else {
            throw new TypeError('Unexpected shiftRefs type.');
        }
        for (const control of this.formArray.controls) {
            array.push(control.value);
        }
        return array;
    }
    /**
     * Check if the bound ngModel/formControl.value already contains the provided id
     */
    valueContainsShiftId(shiftId) {
        for (const offer of this.offersRef.iterable()) {
            if (offer instanceof SchedulingApiShiftExchangeCommunicationSwapOffer) {
                for (const shiftRef of offer.shiftRefs.iterable()) {
                    if (shiftRef.id.equals(shiftId))
                        return true;
                }
            }
            // eslint-disable-next-line sonarjs/no-collapsible-if
            if (offer instanceof SchedulingApiShiftExchangeShiftRef) {
                if (offer.id.equals(shiftId))
                    return true;
            }
        }
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onRemoveOffer(offer) {
        this.pShiftPickerService.onRemoveOffer(this.formArray, this.offersRef, offer);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onRemoveShiftRefFromOffer(input) {
        if (input.shiftRef instanceof SchedulingApiShiftExchangeShiftRef) {
            this.onRemoveOffer(input.shiftRef);
        }
        else if (input.offer instanceof SchedulingApiShiftExchangeCommunicationSwapOffer) {
            input.offer.shiftRefs.removeItem(input.shiftRef);
            this.formArray.updateValueAndValidity();
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onAddSelectedShifts() {
        const selectedShifts = this.api.data.shifts.filterBy(item => item.selected);
        if (this.someHint)
            this.someHint = null;
        this.onAddShifts.emit(selectedShifts);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    addSelectedShiftsToRefs(refs) {
        // We show shiftExchangeShiftRefs as a package, but in code we treat them like a non-bundled offer
        if (this.offersRef instanceof SchedulingApiShiftExchangeShiftRefs) {
            this.onAddSelectedShifts();
            return;
        }
        for (const selectedShift of this.api.data.shifts.filterBy(item => item.selected).iterable()) {
            selectedShift.selected = false;
            if (refs.contains(selectedShift.id))
                continue;
            refs.createNewItem(selectedShift.id);
            this.formArray.updateValueAndValidity();
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    addSelectedShiftsAsPacket() {
        const newOfferPaket = this.offersRef.createNewItem();
        this.addSelectedShiftsToRefs(newOfferPaket.shiftRefs);
        this.formArray.push(new PFormControl({ formState: { value: newOfferPaket, disabled: false } }));
    }
    ngAfterContentChecked() {
        this.initAlertDefaults();
        this.refreshAlertsArray();
    }
    ngAfterContentInit() {
        this.someHint = this.initialSomeHintText;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get pickedOffersHeadline() {
        if (this.offersRef instanceof SchedulingApiShiftExchangeCommunicationSwapOffers) {
            return this.localize.transform('Schichten für den Tausch');
        }
        if (this.offersRef instanceof SchedulingApiShiftExchangeShiftRefs &&
            this.loadDetailedItem instanceof SchedulingApiShiftExchange) {
            if (this.loadDetailedItem.isIllness)
                return this.localize.transform('Schichten für Krankmeldung');
            return this.localize.transform('Schichten für Ersatzsuche');
        }
        return this.localize.transform('Schicht-Auswahl');
    }
    get initialSomeHintText() {
        if (this.shiftRefs.length)
            return null;
        if (this.offersRef instanceof SchedulingApiShiftExchangeCommunicationSwapOffers &&
            this.loadDetailedItem instanceof SchedulingApiShiftExchange &&
            !this.pShiftExchangeService.iAmTheIndisposedMember(this.loadDetailedItem)) {
            return this.localize.transform('Wähle im Kalender die Schichten, die du ${firstName} zum Tausch anbieten möchtest, und füge sie anschließend hier hinzu.', { firstName: this.loadDetailedItem.indisposedMember.firstName });
        }
        else if (this.offersRef instanceof SchedulingApiShiftExchangeShiftRefs &&
            this.loadDetailedItem instanceof SchedulingApiShiftExchange) {
            if (this.loadDetailedItem.isIllness) {
                const I_AM_THE_INDISPOSED_MEMBER = this.pShiftExchangeService.iAmTheIndisposedMember(this.loadDetailedItem);
                const recipient = I_AM_THE_INDISPOSED_MEMBER ? this.localize.transform('dich') : this.loadDetailedItem.indisposedMember.firstName;
                return this.localize.transform('Wähle im Kalender diejenigen Schichten, für die du ${recipient} krank melden möchtest, und füge sie anschließend hier hinzu.', { recipient: recipient });
            }
            return this.localize.transform('Wähle im Kalender die Schichten, für die du Ersatz suchen möchtest, und füge sie anschließend hier hinzu.');
        }
        return null;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get addToOffersBtnLabel() {
        const selectedShifts = this.api.data.shifts.filterBy(item => item.selected);
        let result;
        if (this.offersRef instanceof SchedulingApiShiftExchangeCommunicationSwapOffers) {
            if (selectedShifts.length <= 1)
                return this.localize.transform('Schicht hinzufügen');
            result = '${counter} Schichten einzeln hinzufügen';
        }
        else if (this.offersRef instanceof SchedulingApiShiftExchangeShiftRefs &&
            this.loadDetailedItem instanceof SchedulingApiShiftExchange) {
            if (this.loadDetailedItem.isIllness) {
                result = '${counter} Schichten der Krankmeldung hinzufügen';
            }
            else {
                result = '${counter} Schichten der Suche hinzufügen';
            }
        }
        else {
            result = '${counter} Schichten der Auswahl hinzufügen';
        }
        return this.localize.transform(result, { counter: selectedShifts.length.toString() }, false);
    }
    ngOnInit() {
        this.highlightService.clear();
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
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showHasBundleWarning() {
        // For info about this, see initAlertForHasBundle
        if (!this.alertForHasBundle)
            return false;
        if (!(this.loadDetailedItem instanceof SchedulingApiShiftExchange))
            return undefined;
        if (this.loadDetailedItem.isIllness)
            return false;
        if (this.offersRef instanceof SchedulingApiShiftExchangeShiftRefs)
            return this.offersRef.length > 1;
        if (!(this.offersRef instanceof SchedulingApiShiftExchangeCommunicationSwapOffers))
            return undefined;
        if (this.offersRef.findBy(item => item.shiftRefs.length > 1))
            return true;
        return false;
    }
    initAlertForHasBundle() {
        // If there are already multiple shiftRefs when user opened the modal, we assume, that we don’t need to remind him
        // again, so we leave .alertForHasBundle undefined
        if (this.shiftRefs.length > 1)
            return;
        let textForAlertForHasBundle;
        if (this.offersRef instanceof SchedulingApiShiftExchangeShiftRefs) {
            textForAlertForHasBundle = this.localize.transform('Du hast mehrere Schichten hinzugefügt. Sie alle müssen von einer Person komplett übernommen werden. Möchtest du das nicht, solltest du die Schichten einzeln in die Tauschbörse stellen.');
        }
        else {
            textForAlertForHasBundle = this.localize.transform('Bedenke, dass dein Verhandlungspartner ein gebündeltes Schicht-Angebot komplett übernehmen muss und sich nicht einzelne Schichten rauspicken kann.');
        }
        this.alertForHasBundle = {
            type: PThemeEnum.WARNING,
            text: textForAlertForHasBundle,
        };
    }
    initAlertDefaults() {
        this.initAlertForHasBundle();
        this.alertForEqualoffers = {
            type: PThemeEnum.DANGER,
            text: this.localize.transform('Zwei Angebote gleichen sich.'),
        };
        this.alertForCommunicationReset = {
            type: PThemeEnum.WARNING,
            text: this.localize.transform('Es gibt Mitarbeitende, die schon auf die bisherige Schicht-Auswahl geantwortet haben. Änderst du die Auswahl, müssen sie erneut antworten.'),
        };
        this.alertForNoMember = {
            type: PThemeEnum.DANGER,
            text: this.localize.transform('Niemand aus dem Team kann deine aktuelle Schicht-Auswahl übernehmen. Du solltest deine Auswahl ändern.'),
        };
    }
    pushItToAlertsIfPossible(error) {
        const isAlreadyAdded = this.alerts.find(item => item.text === error.text && item.type === error.type);
        if (!isAlreadyAdded)
            this.alerts.push(error);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    refreshAlertsArray() {
        this.alerts = [];
        if (this.formArray.hasError('equaloffers'.toLowerCase()))
            this.pushItToAlertsIfPossible(this.alertForEqualoffers);
        if (this.showCommunicationResetAlert)
            this.pushItToAlertsIfPossible(this.alertForCommunicationReset);
        if (this.noMemberAvailableForTheseShiftRefs)
            this.pushItToAlertsIfPossible(this.alertForNoMember);
        return this.alerts;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    requesterIsAssigned(shift) {
        if (!this.meService.isLoaded())
            return false;
        return shift.assignedMemberIds.contains(this.meService.data.id);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onShiftClick(shift) {
        if (!this.requesterIsAssigned(shift))
            return;
        if (this.valueContainsShiftId(shift.id))
            return;
        if (this.pShiftExchangeService.shiftExchangeExistsForShiftAndRequester(shift.id))
            return;
        shift.selected = !shift.selected;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PShiftPickerComponent.prototype, "hideAddToOffersBtn", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftPickerComponent.prototype, "loadDetailedItem", void 0);
__decorate([
    Input('availableShifts'),
    __metadata("design:type", typeof (_e = typeof SchedulingApiShifts !== "undefined" && SchedulingApiShifts) === "function" ? _e : Object)
], PShiftPickerComponent.prototype, "_availableShifts", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftPickerComponent.prototype, "shiftTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftPickerComponent.prototype, "offerTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftPickerComponent.prototype, "offersRef", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_h = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _h : Object)
], PShiftPickerComponent.prototype, "addItem", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_j = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _j : Object)
], PShiftPickerComponent.prototype, "onAddShifts", void 0);
__decorate([
    ViewChild('shiftPickerCalendarRef'),
    __metadata("design:type", PShiftPickerCalendarComponent)
], PShiftPickerComponent.prototype, "shiftPickerCalendarRef", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PShiftPickerComponent.prototype, "disabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftPickerComponent.prototype, "formArray", void 0);
__decorate([
    Input('required'),
    __metadata("design:type", Boolean)
], PShiftPickerComponent.prototype, "_required", void 0);
PShiftPickerComponent = PShiftPickerComponent_1 = __decorate([
    Component({
        selector: 'p-shift-picker[availableShifts][offersRef]',
        templateUrl: './p-shift-picker.component.html',
        styleUrls: ['./p-shift-picker.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PShiftPickerComponent_1),
                multi: true,
            },
        ],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, HighlightService,
        PShiftPickerService,
        PShiftExchangeService,
        MeService,
        LocalizePipe,
        PMomentService, typeof (_b = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _b : Object])
], PShiftPickerComponent);
export { PShiftPickerComponent };
//# sourceMappingURL=p-shift-picker.component.js.map