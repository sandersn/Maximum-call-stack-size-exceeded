/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * BEFORE EDITING THESE DIRECTIVES, CHECK THIS:
 * https://drplano.atlassian.net/browse/PLANO-20987
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
import { __decorate, __metadata } from "tslib";
/* NOTE: Dont make this file even bigger. Invest some time to cleanup/split into several files */
/* eslint max-lines: ["error", 850] */
/**
 * This is a quite complex set of directives. Here is an overview. Note: These things are all directives. I only
 * start lines with »(at)param« for code editor highlighting reasons.
 * @param pEditable: A wrapper for all the other Directives
 * @param pEditableTriggerFocussable Triggers the edit-mode of the pEditable. Its needed for inputs, textareas, etc.
 * @param pEditableTriggerClickable Triggers the edit-mode of the pEditable. Its needed for pEditable boxes with
 * e.g. an button with pencil icon.
 * @param pEditableInstantSaveButton Instantly saves value to api. Its needed for e.g. checkboxes.
 * @param pEditableSuccessButton A save button that is shown wenn the pEditable is in edit-mode.
 * @param pEditableDismissButton A dismiss button that is shown wenn the pEditable is in edit-mode.
 * @param pVisibleInEditMode This only controls the »hidden« attribute of html elements related to the edit-mode.
 * @param pHiddenInEditMode This only controls the »hidden« attribute of html elements related to the edit-mode.
 */
// * @param disabledIfAnyEditMode This sets an html element to disable if any edit-mode is active in the whole app.
import * as $ from 'jquery';
import { Directive, Input, Output, EventEmitter, HostBinding, HostListener, ChangeDetectorRef } from '@angular/core';
import { ElementRef } from '@angular/core';
import { NgZone } from '@angular/core';
import { ApplicationRef } from '@angular/core';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '../../../../shared/core/pipe/localize.pipe';
import { ToastsService } from '../../../service/toasts.service';
export let activeEditable = null;
/**
 * Collects all pEditables that are on the page
 */
const allEditables = [];
/**
 * Is the modal-hook for a pEditable open / currently shown to the user?
 */
let hookIsActive = false;
/**
 * This exists to make sure the handler gets created only once
 */
let globalClickHandlerCreated = false;
/**
 * Figure out if the user has clicked an area outside any pEditable like whitespace
 */
const determineIfClickedOutside = (event) => {
    var _a;
    const previouslySelectedEditable = activeEditable;
    if (!previouslySelectedEditable)
        return;
    const targetHtmlElement = event.target;
    // Get the new targeted Editable
    let newSelectedEditable = null;
    newSelectedEditable = (_a = allEditables.find((item) => {
        return item.el.nativeElement.contains(targetHtmlElement);
    })) !== null && _a !== void 0 ? _a : null;
    // Is outside if target is not an Editable
    if (newSelectedEditable)
        return;
    // Nothing to do here if outsideClick's are blocked
    if (previouslySelectedEditable.blockOutsideClick)
        return;
    // saveChanges() sets previouslySelectedEditable to null but we need the applicationRef in the success callback.
    const applicationRef = previouslySelectedEditable.applicationRef;
    previouslySelectedEditable.saveChanges(() => {
        // this code is run outside angular. So manually trigger change detection
        applicationRef.tick();
    });
};
/**
 * A wrapper for all the other Directives.
 * active: False if all functionality of this wrapper and related Directives inside this wrapper
 *   should be ignored.
 * valid: True if the PFormControl is valid. Invalid pEditables can not be saved and will be resetted
 *   on dismiss/leave.
 * api: Required. Thus the pEditable can be used in various environments.
 */
let EditableDirective = class EditableDirective {
    constructor(changeDetectorRef, el, zone, applicationRef, console, toastsService, localize) {
        this.changeDetectorRef = changeDetectorRef;
        this.el = el;
        this.zone = zone;
        this.applicationRef = applicationRef;
        this.console = console;
        this.toastsService = toastsService;
        this.localize = localize;
        this.api = null;
        this.valid = true;
        this.onSaveStart = new EventEmitter();
        this.onSaveSuccess = new EventEmitter();
        /**
         * Happens after the changes (dataCopy of the api) have been dismissed
         */
        this.onDismiss = new EventEmitter();
        this.onLeaveCurrent = new EventEmitter();
        this.editMode = new EventEmitter();
        // TODO: This should always be set to true when checkbox
        this.pEditableDisableOnDestroy = false;
        /**
         * Duration of animations like the pulsing success-button
         */
        this.animationDuration = 700;
        /**
         * Should success (and dismiss) buttons be visible?
         */
        this.showBtns = false;
        /**
         * Flag that checks if dismiss button has been clicked
         */
        this.clickedDismiss = false;
        /**
         * Flag that checks if success button has been clicked
         */
        this.clickedSuccess = false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get getActive() {
        return this.pEditable;
    }
    ngAfterContentChecked() {
        if (this.pEditable && !allEditables.includes(this)) {
            allEditables.push(this);
        }
    }
    ngAfterContentInit() {
        this.initValues();
    }
    ngAfterViewInit() {
        if (globalClickHandlerCreated)
            return;
        globalClickHandlerCreated = true;
        this.zone.runOutsideAngular(() => {
            $(document).on('mousedown', (event) => {
                determineIfClickedOutside(event);
            });
        });
    }
    /**
     * Set values that are necessary for this function.
     * These initValues methods are used in many components.
     * They mostly get used for class attributes that would cause performance issues as a getter.
     */
    initValues() {
        if (this.pEditable && this.api === undefined)
            throw new Error('You must set api input.');
    }
    /**
     * Dismiss if this pEditable was activated
     */
    onUndo() {
        this.console.debug('EditableDirective: onUndo()');
        if (!this.pEditable)
            return;
        if (this.doubleClick)
            return;
        if (!this.api.hasDataCopy())
            throw new Error('No data copy available. [PLANO-FE-188]');
        this.dismissChanges();
    }
    /**
     * Check if a double click just happened
     */
    get doubleClick() {
        return this.clickedSuccess || this.clickedDismiss;
    }
    /**
     * Try to save if this pEditable was activated
     */
    onSuccess(done) {
        this.console.debug('EditableDirective: onSuccess()');
        if (this.pEditable && !this.doubleClick) {
            this.saveChanges(done);
        }
    }
    /**
     * Handle esc
     */
    onEsc(event) {
        this.console.debug('EditableDirective: onEsc()');
        if (this.pEditable) {
            // event.stopPropagation();
            this.onUndo();
            this.handleBlur(event);
        }
    }
    /**
     * Handle enter
     */
    _onMetaEnter(event) {
        this.console.debug('EditableDirective: onMetaEnter()');
        this.onEnter(event);
    }
    /**
     * Handle shift enter
     */
    _onShiftEnter(event) {
        this.console.debug('EditableDirective: onShiftEnter()');
        this.onEnter(event);
    }
    /**
     * Handle meta enter
     */
    onEnter(event) {
        if (!this.showBtns)
            return;
        if (this.el.nativeElement.tagName === 'TEXTAREA')
            return;
        if ($(this.el.nativeElement).find('textarea').length)
            return;
        event.preventDefault();
        event.stopPropagation();
        if (this.pEditable) {
            this.onSuccess();
            this.handleBlur(event);
        }
    }
    /**
     * Blur the current element, and set focus to the underlying modal if any
     */
    handleBlur(event) {
        event.preventDefault();
        event.stopPropagation();
        event.target.blur();
        if ($('.modal.show').length) {
            $('.modal.show').trigger('focus');
        }
    }
    /**
     * Check if the clicked item is a date-picker Modal or something comparable
     */
    get blockOutsideClick() {
        let result = false;
        const modals = $('ngb-modal-window');
        if (!modals.length) {
            // If there is no modal, then there is nothing that needs to be blocked.
            result = false;
        }
        else if (this.el.nativeElement.contains($(':focus')[0]) || modals[0].contains($(':focus')[0])) {
            // If the focus is inside the current pEditable then its fine
            // This is the case when user has closed the date-picker modal
            result = true;
        }
        else {
            // The last item is the modal that the user is looking at.
            const lastItem = modals.last();
            // Is the modal that the user is looking at the one with the current pEditable?
            // eslint-disable-next-line unicorn/no-array-callback-reference
            const lastItemContainsCurrentEditable = lastItem.find(this.el.nativeElement).length;
            // If not then its probably a date-picker or something comparable and the click should be ignored.
            result = !lastItemContainsCurrentEditable;
        }
        return result;
    }
    /**
     * Starts this pEditable.
     * @returns Returns if this pEditable could be started.
     */
    startEditable(event) {
        // Is an inactive pEditable? Then do nothing.
        if (!this.pEditable)
            return false;
        // Start this pEditable
        this.console.debug('EditableDirective: startEditable()');
        // End previous pEditable
        if (activeEditable)
            activeEditable.saveChanges();
        // if hook from previous pEditable is still active we cannot start the new one.
        if (hookIsActive) {
            this.handleBlur(event);
            return false;
        }
        // start this pEditable
        if (this.api.hasDataCopy())
            throw new Error('Old data copy existed while starting a new edit mode.');
        // eslint-disable-next-line unicorn/no-this-assignment, @typescript-eslint/no-this-alias
        activeEditable = this;
        this.showBtns = true;
        this.changeDetectorRef.markForCheck();
        this.api.createDataCopy();
        this.editMode.emit(this.api.hasDataCopy());
        return true;
    }
    dismissChanges() {
        this.animateDismissButton();
        this.api.dismissDataCopy();
        activeEditable = null;
        this.onLeaveCurrent.emit();
        this.editMode.emit(this.api.hasDataCopy());
        this.onDismiss.emit();
    }
    /**
     * The important one method that tries to save data. This is where the editable magic happens.
     * @param done This handler is called when save process has finished (independent of the api call).
     */
    saveChanges(done = () => { }) {
        this.console.debug('EditableDirective: saveChanges()');
        if (!this.pEditable)
            throw new Error('Editable not active.');
        // This method should not be called when no data copy exists.
        if (!this.api.hasDataCopy())
            throw new Error('No data copy.');
        //
        // 	Form invalid? Then dismiss
        //
        if (!this.valid) {
            this.console.debug('EditableDirective: invalid form');
            this.dismissChanges();
            done();
            return;
        }
        //
        // Save changes
        //
        const saveProcess = (completed = () => { }) => {
            activeEditable = null;
            this.onSaveStart.emit();
            this.api.mergeDataCopy();
            this.editMode.emit(this.api.hasDataCopy());
            // NOTE: We often get this kind of error. Throws will turn into JIRA Tickets automatically.
            // We added a throw here, to give JIRA the info if this kind of error was caused by a pEditable.
            if (!this.api.isLoaded())
                throw new Error('[Editable] You cannot call save() when api is not loaded.');
            this.api.save({
                success: (_response, noChanges) => {
                    if (noChanges) {
                        this.showBtns = false;
                        this.changeDetectorRef.markForCheck();
                    }
                    else {
                        this.onSaveSuccess.emit();
                    }
                    completed();
                },
            });
            this.animateSuccessButton();
            this.onLeaveCurrent.emit();
        };
        const HAS_DATA_COPY_CHANGED = this.api.hasDataCopyChanged();
        if (!HAS_DATA_COPY_CHANGED)
            this.console.debug('EditableDirective: data has not changed');
        // start hook?
        if (this.saveChangesHook && HAS_DATA_COPY_CHANGED) {
            this.console.debug('EditableDirective: Start hook');
            hookIsActive = true;
            this.saveChangesHook(() => {
                this.console.debug('EditableDirective: Hook closed');
                saveProcess(done);
                hookIsActive = false;
            }, () => {
                this.console.debug('EditableDirective: Hook dismissed');
                this.dismissChanges();
                done();
                hookIsActive = false;
            });
        }
        else {
            // otherwise save immediately
            saveProcess(done);
        }
    }
    animateDismissButton() {
        this.clickedDismiss = true;
        this.changeDetectorRef.markForCheck();
        this.waitForAnimation(() => {
            this.clickedDismiss = false;
            this.changeDetectorRef.markForCheck();
        });
    }
    animateSuccessButton() {
        this.clickedSuccess = true;
        this.changeDetectorRef.markForCheck();
        this.waitForAnimation(() => {
            this.clickedSuccess = false;
            this.changeDetectorRef.markForCheck();
        });
    }
    lostItsFocus() {
        return !activeEditable || this !== activeEditable;
    }
    waitForAnimation(callback) {
        this.zone.runOutsideAngular(() => {
            window.setTimeout(() => {
                this.zone.run(() => {
                    if (this.lostItsFocus()) {
                        this.showBtns = false;
                        this.changeDetectorRef.markForCheck();
                    }
                    callback();
                });
            }, this.animationDuration);
        });
    }
    ngOnDestroy() {
        if (
        // NOTE: This causes problems when pEditable A (e.g. a checkbox) decides if pEditable B is visible (via *ngIf) and
        // A has a hook
        // Problem: Checkbox A got clicked, creates data copy, opens hook and removes B from the form. Then this
        // ngOnDestroy gets triggered and dismisses the dataCopy of the active pEditable A
        // To prevent that, use e.g. [class.d-none]="!foo" instead of *ngIf="foo" or set pEditableDisableOnDestroy true
        !this.pEditableDisableOnDestroy &&
            this.pEditable &&
            // NOTE: This caused problems when the trigger is in a tooltip and opens modal.
            // Tooltip closes, button gets destroyed => modal exists but no dataCopy.
            this.api.hasDataCopy()) {
            // PLANO-3464 Commented this out because it created problems
            // this.dismissChanges();
        }
        // remove this from global edit components Array
        const index = allEditables.indexOf(this);
        if (index >= 0)
            allEditables.splice(index, 1);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], EditableDirective.prototype, "pEditable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], EditableDirective.prototype, "api", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], EditableDirective.prototype, "valid", void 0);
__decorate([
    HostBinding('class.is-active'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], EditableDirective.prototype, "getActive", null);
__decorate([
    Input(),
    __metadata("design:type", Function)
], EditableDirective.prototype, "saveChangesHook", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_e = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _e : Object)
], EditableDirective.prototype, "onSaveStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_f = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _f : Object)
], EditableDirective.prototype, "onSaveSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_g = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _g : Object)
], EditableDirective.prototype, "onDismiss", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_h = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _h : Object)
], EditableDirective.prototype, "onLeaveCurrent", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_j = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _j : Object)
], EditableDirective.prototype, "editMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], EditableDirective.prototype, "pEditableDisableOnDestroy", void 0);
__decorate([
    HostListener('keyup.meta.enter', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], EditableDirective.prototype, "_onMetaEnter", null);
__decorate([
    HostListener('keyup.shift.enter', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], EditableDirective.prototype, "_onShiftEnter", null);
__decorate([
    HostListener('keyup.enter', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], EditableDirective.prototype, "onEnter", null);
EditableDirective = __decorate([
    Directive({
        selector: '[pEditable][api]',
        exportAs: 'pEditable',
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object, typeof (_b = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _b : Object, typeof (_c = typeof NgZone !== "undefined" && NgZone) === "function" ? _c : Object, typeof (_d = typeof ApplicationRef !== "undefined" && ApplicationRef) === "function" ? _d : Object, LogService,
        ToastsService,
        LocalizePipe])
], EditableDirective);
export { EditableDirective };
/**
 * pEditableTriggerFocussable is needed for inputs, textareas, etc.
 * note that there is a pEditableTriggerClickable too
 */
let EditableTriggerFocussableDirective = class EditableTriggerFocussableDirective {
    constructor(pEditableRef, elementRef, console) {
        this.pEditableRef = pEditableRef;
        this.elementRef = elementRef;
        this.console = console;
    }
    get _roundedBorder() {
        return !!this.pEditableRef.pEditable && !this.pEditableRef.showBtns;
    }
    get _hasHook() {
        return !!this.pEditableRef.saveChangesHook;
    }
    _onFocus(event) {
        this.pEditableRef.startEditable(event);
    }
    /**
     * Handle esc
     */
    _onEsc(event) {
        this.pEditableRef.onEsc(event);
    }
};
__decorate([
    HostBinding('class.rounded-right'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], EditableTriggerFocussableDirective.prototype, "_roundedBorder", null);
__decorate([
    HostBinding('class.p-editable-has-hook'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], EditableTriggerFocussableDirective.prototype, "_hasHook", null);
__decorate([
    HostListener('focus', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], EditableTriggerFocussableDirective.prototype, "_onFocus", null);
__decorate([
    HostListener('keyup.esc', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], EditableTriggerFocussableDirective.prototype, "_onEsc", null);
EditableTriggerFocussableDirective = __decorate([
    Directive({ selector: '[pEditableTriggerFocussable]' }),
    __metadata("design:paramtypes", [EditableDirective, typeof (_k = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _k : Object, LogService])
], EditableTriggerFocussableDirective);
export { EditableTriggerFocussableDirective };
/**
 * pEditableTriggerClickable is needed for buttons, links etc.
 * note that there is a pEditableTriggerFocussable too
 */
let EditableTriggerClickableDirective = class EditableTriggerClickableDirective {
    constructor(pEditableRef, console) {
        this.pEditableRef = pEditableRef;
        this.console = console;
    }
    _onClick(event) {
        if (!this.beforeEditHook) {
            this.pEditableRef.startEditable(event);
            return;
        }
        this.beforeEditHook(() => {
            this.pEditableRef.startEditable(event);
        }, () => {
            this.console.log('editable dismissed');
        });
    }
    get _isHidden() {
        return !(!this.pEditableRef.showBtns && this.pEditableRef.pEditable);
    }
    get _isDisabled() {
        if (!this.pEditableRef.pEditable)
            return false;
        return !this.pEditableRef.valid || this.pEditableRef.api.hasDataCopy();
    }
    /**
     * Handle esc
     */
    _onEsc(event) {
        this.pEditableRef.onEsc(event);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Function)
], EditableTriggerClickableDirective.prototype, "beforeEditHook", void 0);
__decorate([
    HostListener('click', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], EditableTriggerClickableDirective.prototype, "_onClick", null);
__decorate([
    HostBinding('hidden'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], EditableTriggerClickableDirective.prototype, "_isHidden", null);
__decorate([
    HostBinding('disabled'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], EditableTriggerClickableDirective.prototype, "_isDisabled", null);
__decorate([
    HostListener('keyup.esc', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], EditableTriggerClickableDirective.prototype, "_onEsc", null);
EditableTriggerClickableDirective = __decorate([
    Directive({ selector: '[pEditableTriggerClickable]' }),
    __metadata("design:paramtypes", [EditableDirective,
        LogService])
], EditableTriggerClickableDirective);
export { EditableTriggerClickableDirective };
/**
 * pEditableInstantSaveButton is needed for e.g. checkboxes
 * if pEditableInstantSaveButton is clicked the value gets saved instantly
 * no success or save button needed
 */
let EditableInstantSaveButtonDirective = class EditableInstantSaveButtonDirective {
    constructor(pEditableRef) {
        this.pEditableRef = pEditableRef;
        this.triggerClick = new EventEmitter();
        this.disabled = false;
    }
    get _hasHook() {
        return !!this.pEditableRef.saveChangesHook;
    }
    get _isActive() {
        return !!this.pEditableRef.pEditable;
    }
    /**
     * Handle click
     */
    _onClick(event) {
        if (this.pEditableRef.doubleClick)
            return;
        if (this.triggerClick.observers.length <= 0)
            return;
        if (!this.pEditableRef.pEditable) {
            this.triggerClick.emit(event);
            return;
        }
        if (this.pEditableRef.startEditable(event)) {
            this.triggerClick.emit(event);
            this.pEditableRef.saveChanges();
        }
    }
    get _isDisabled() {
        return this.disabled;
    }
    get _isClicked() { return this.pEditableRef.clickedSuccess; }
};
__decorate([
    HostBinding('class.p-editable-has-hook'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], EditableInstantSaveButtonDirective.prototype, "_hasHook", null);
__decorate([
    HostBinding('class.pulse'),
    HostBinding('class.pulse-success'),
    HostBinding('class.p-editable-active'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], EditableInstantSaveButtonDirective.prototype, "_isActive", null);
__decorate([
    Output(),
    __metadata("design:type", typeof (_l = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _l : Object)
], EditableInstantSaveButtonDirective.prototype, "triggerClick", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], EditableInstantSaveButtonDirective.prototype, "disabled", void 0);
__decorate([
    HostListener('click', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], EditableInstantSaveButtonDirective.prototype, "_onClick", null);
__decorate([
    HostBinding('disabled'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], EditableInstantSaveButtonDirective.prototype, "_isDisabled", null);
__decorate([
    HostBinding('class.clicked'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], EditableInstantSaveButtonDirective.prototype, "_isClicked", null);
EditableInstantSaveButtonDirective = __decorate([
    Directive({ selector: '[pEditableInstantSaveButton]' }),
    __metadata("design:paramtypes", [EditableDirective])
], EditableInstantSaveButtonDirective);
export { EditableInstantSaveButtonDirective };
let EditableSuccessButtonDirective = class EditableSuccessButtonDirective {
    constructor(pEditableRef) {
        this.pEditableRef = pEditableRef;
        this._alwaysTrue = true;
        this._type = 'button';
    }
    get _isDisabled() {
        return !this.pEditableRef.valid;
    }
    get _isHidden() {
        return !(this.pEditableRef.showBtns && this.pEditableRef.pEditable);
    }
    get _isClicked() { return this.pEditableRef.clickedSuccess; }
    _onClick() { this.pEditableRef.onSuccess(); }
};
__decorate([
    HostBinding('class.pulse'),
    HostBinding('class.pulse-success'),
    HostBinding('class.btn'),
    HostBinding('class.btn-outline-secondary'),
    __metadata("design:type", Object)
], EditableSuccessButtonDirective.prototype, "_alwaysTrue", void 0);
__decorate([
    HostBinding('type'),
    __metadata("design:type", String)
], EditableSuccessButtonDirective.prototype, "_type", void 0);
__decorate([
    HostBinding('disabled'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], EditableSuccessButtonDirective.prototype, "_isDisabled", null);
__decorate([
    HostBinding('hidden'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], EditableSuccessButtonDirective.prototype, "_isHidden", null);
__decorate([
    HostBinding('class.clicked'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], EditableSuccessButtonDirective.prototype, "_isClicked", null);
__decorate([
    HostListener('click', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EditableSuccessButtonDirective.prototype, "_onClick", null);
EditableSuccessButtonDirective = __decorate([
    Directive({ selector: '[pEditableSuccessButton]' }),
    __metadata("design:paramtypes", [EditableDirective])
], EditableSuccessButtonDirective);
export { EditableSuccessButtonDirective };
let EditableDismissButtonDirective = class EditableDismissButtonDirective {
    constructor(pEditable) {
        this.pEditable = pEditable;
        this._type = 'button';
        this._alwaysTrue = true;
    }
    get _isDisabled() {
        return false;
    }
    get _isHidden() {
        return !(this.pEditable.showBtns && this.pEditable.pEditable);
    }
    get _isClicked() { return this.pEditable.clickedDismiss; }
    _onClick() { this.pEditable.onUndo(); }
};
__decorate([
    HostBinding('type'),
    __metadata("design:type", String)
], EditableDismissButtonDirective.prototype, "_type", void 0);
__decorate([
    HostBinding('class.pulse'),
    HostBinding('class.btn'),
    HostBinding('class.btn-outline-secondary'),
    __metadata("design:type", Object)
], EditableDismissButtonDirective.prototype, "_alwaysTrue", void 0);
__decorate([
    HostBinding('disabled'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], EditableDismissButtonDirective.prototype, "_isDisabled", null);
__decorate([
    HostBinding('hidden'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], EditableDismissButtonDirective.prototype, "_isHidden", null);
__decorate([
    HostBinding('class.clicked'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], EditableDismissButtonDirective.prototype, "_isClicked", null);
__decorate([
    HostListener('click', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EditableDismissButtonDirective.prototype, "_onClick", null);
EditableDismissButtonDirective = __decorate([
    Directive({ selector: '[pEditableDismissButton]' }),
    __metadata("design:paramtypes", [EditableDirective])
], EditableDismissButtonDirective);
export { EditableDismissButtonDirective };
let PVisibleInEditModeDirective = class PVisibleInEditModeDirective {
    constructor(pEditable) {
        this.pEditable = pEditable;
    }
    get _isHidden() {
        // Editable is inactive when its e.g. a new member/shift/etc.
        const active = this.pEditable.pEditable;
        return !(!active || this.pEditable.showBtns);
    }
};
__decorate([
    HostBinding('hidden'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PVisibleInEditModeDirective.prototype, "_isHidden", null);
PVisibleInEditModeDirective = __decorate([
    Directive({
        selector: '[pVisibleInEditMode]',
    }),
    __metadata("design:paramtypes", [EditableDirective])
], PVisibleInEditModeDirective);
export { PVisibleInEditModeDirective };
let HiddenInEditModeDirective = class HiddenInEditModeDirective {
    constructor(pEditable) {
        this.pEditable = pEditable;
    }
    get _isHidden() {
        // Editable is active when its e.g. a existing member/shift/etc. form
        const active = this.pEditable.pEditable;
        return !active || this.pEditable.showBtns;
    }
};
__decorate([
    HostBinding('hidden'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], HiddenInEditModeDirective.prototype, "_isHidden", null);
HiddenInEditModeDirective = __decorate([
    Directive({
        selector: '[pHiddenInEditMode]',
    }),
    __metadata("design:paramtypes", [EditableDirective])
], HiddenInEditModeDirective);
export { HiddenInEditModeDirective };
//# sourceMappingURL=editable.directive.js.map