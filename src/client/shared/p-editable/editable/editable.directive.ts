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
import { HttpResponse } from '@angular/common/http';
import { Directive, Input, Output, EventEmitter, HostBinding, HostListener, ChangeDetectorRef } from '@angular/core';
import { ElementRef } from '@angular/core';
import { NgZone } from '@angular/core';
import { ApplicationRef } from '@angular/core';
import { OnDestroy, AfterContentChecked } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { LogService } from '@plano/shared/core/log.service';
import { ApiBase } from '../../../../shared/api';
import { LocalizePipe } from '../../../../shared/core/pipe/localize.pipe';
import { ToastsService } from '../../../service/toasts.service';

export let activeEditable : EditableDirective | null = null;

/**
 * Collects all pEditables that are on the page
 */

const allEditables : EditableDirective[] = [];

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

const determineIfClickedOutside = (event : Event) : void => {
	const previouslySelectedEditable = activeEditable;
	if (!previouslySelectedEditable) return;
	const targetHtmlElement = event.target as Node;

	// Get the new targeted Editable
	let newSelectedEditable : EditableDirective | null = null;
	newSelectedEditable = allEditables.find((item) => {
		return item.el.nativeElement.contains(targetHtmlElement);
	}) ?? null;

	// Is outside if target is not an Editable
	if (newSelectedEditable) return;

	// Nothing to do here if outsideClick's are blocked
	if (previouslySelectedEditable.blockOutsideClick) return;

	// saveChanges() sets previouslySelectedEditable to null but we need the applicationRef in the success callback.
	const applicationRef = previouslySelectedEditable.applicationRef;

	previouslySelectedEditable.saveChanges(() => {
		// this code is run outside angular. So manually trigger change detection
		applicationRef.tick();
	});

};

/**
 * This is a interface for the pEditable-component
 */

export interface EditableInterface {

	/**
	 * Api is needed if this is a editable interface element.
	 */
	api : ApiBase | {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key : string] : any,
		isLoaded : ApiBase['isLoaded'],
		save : ApiBase['save'],
		onError : ApiBase['onError'],
		hasDataCopy : ApiBase['hasDataCopy'],
		createDataCopy : ApiBase['createDataCopy'],
		dismissDataCopy : ApiBase['dismissDataCopy'],
		mergeDataCopy : ApiBase['mergeDataCopy'],
		hasDataCopyChanged : ApiBase['hasDataCopyChanged'],
	} | null; // NOTE: ApiBase doesn’t work here, because of error "this.api!.data is undefined"
	/**
	 * Is this a valid form element or are there e.g. any validation errors?
	 * If there are validation errors the EditableDirective will never try to
	 * save this broken data.
	 */
	valid : boolean | null;

	/**
	 * Here you can set a function that is able to dismiss or continue the editable process.
	 * Your The function will be executed. If your function calls the given success() callback, the EditableDirective
	 * continues as if nothing happened. If your function calls dismiss(), the editable stops and resets all changes
	 * the user was about to make.
	 *
	 * @example
	 *   <foo
	 *     [pEditable]="true"
	 *     [onSaveChangesHook]="someHook"
	 *     …
	 *
	 *   public someHook() : void {
	 *     this.modalService.openModal(this.modalContent, {
	 *       success: success,
	 *       dismiss: dismiss,
	 *     });
	 *   }
	 *
	 * @example
	 *   <foo
	 *     [pEditable]="true"
	 *     [onSaveChangesHook]="someHook"
	 *     …
	 *
	 *   public someHook() : EditableDirective['saveChangesHook'] {
	 *     return (success : () => void, dismiss : () => void) => {
	 *       if (this.noModalNecessary) { success(); return; }
	 *       this.modalService.openModal(this.modalContent, {
	 *         success: success,
	 *         dismiss: dismiss,
	 *       });
	 *     };
	 *   }
	 */
	saveChangesHook?(success : () => void, dismiss : () => void) : void;

	/**
	 * Happens right before saving. (after hook if hook is set)
	 */
	onSaveStart : EventEmitter<undefined>;

	/**
	 * Happens after the data has been saved.
	 */
	onSaveSuccess : EventEmitter<undefined>;

	// NOTE: Not all pEditables have a possibility to fire a dismiss event. E.g. radio-inputs.
	// onDismiss : EventEmitter<undefined>;

	/**
	 * Happens when user leaves change-mode. No matter if changes have been saved or not.
	 * Note that this does not wait for api callbacks.
	 */
	onLeaveCurrent : EventEmitter<undefined>;

	/**
	 * State of this pEditable.
	 */
	editMode : EventEmitter<boolean>;
	// readonly isValid : boolean = false;
}

/**
 * This is a interface for formControls based on pEditables
 */

export interface EditableControlInterface extends EditableInterface {

	/**
	 * Should this be a editable?
	 * Usually false if its a new item (new member, new shift, etc.).
	 * Usually true if its not a new item (existing member, existing shift, etc.).
	 */
	pEditable : boolean;
}

/**
 * A wrapper for all the other Directives.
 * active: False if all functionality of this wrapper and related Directives inside this wrapper
 *   should be ignored.
 * valid: True if the PFormControl is valid. Invalid pEditables can not be saved and will be resetted
 *   on dismiss/leave.
 * api: Required. Thus the pEditable can be used in various environments.
 */
@Directive({
	selector: '[pEditable][api]',
	exportAs: 'pEditable',
})
export class EditableDirective
implements AfterContentInit, AfterContentChecked, AfterViewInit, EditableInterface, OnDestroy {
	@Input() public pEditable ! : EditableControlInterface['pEditable'];
	@Input() public api : EditableInterface['api'] | null = null;
	@Input() public valid : boolean | null = true;

	// eslint-disable-next-line jsdoc/require-jsdoc
	@HostBinding('class.is-active') public get getActive() : boolean | null {
		return this.pEditable;
	}

	/**
	 * @see EditableInterface['saveChangesHook']
	 */
	@Input() public saveChangesHook ?: (success : () => void, dismiss : () => void) => void;

	@Output() public onSaveStart : EventEmitter<undefined> = new EventEmitter();

	@Output() public onSaveSuccess : EventEmitter<undefined> = new EventEmitter();

	/**
	 * Happens after the changes (dataCopy of the api) have been dismissed
	 */
	@Output() public onDismiss : EventEmitter<undefined> = new EventEmitter();

	@Output() public onLeaveCurrent : EventEmitter<undefined> = new EventEmitter();

	@Output() public editMode : EventEmitter<boolean> = new EventEmitter<boolean>();

	// TODO: This should always be set to true when checkbox
	@Input() public pEditableDisableOnDestroy : boolean = false;

	constructor(
		protected changeDetectorRef : ChangeDetectorRef,
		public el : ElementRef<HTMLElement>,
		protected zone : NgZone,
		public applicationRef : ApplicationRef,
		protected console : LogService,
		protected toastsService : ToastsService,
		protected localize : LocalizePipe,
	) {
	}

	/**
	 * Duration of animations like the pulsing success-button
	 */
	private animationDuration : number = 700;

	/**
	 * Should success (and dismiss) buttons be visible?
	 */
	public showBtns : boolean = false;

	/**
	 * Flag that checks if dismiss button has been clicked
	 */
	public clickedDismiss : boolean = false;

	/**
	 * Flag that checks if success button has been clicked
	 */
	public clickedSuccess : boolean = false;

	public ngAfterContentChecked() : void {
		if (this.pEditable && !allEditables.includes(this)) {
			allEditables.push(this);
		}
	}

	public ngAfterContentInit() : void {
		this.initValues();
	}

	public ngAfterViewInit() : void {
		if (globalClickHandlerCreated) return;

		globalClickHandlerCreated = true;
		this.zone.runOutsideAngular(() => {
			$(document).on('mousedown', (event : Event) => {
				determineIfClickedOutside(event);
			});
		});
	}

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	private initValues() : void {
		if (this.pEditable && (this.api as unknown) === undefined) throw new Error('You must set api input.');
	}

	/**
	 * Dismiss if this pEditable was activated
	 */
	public onUndo() : void {
		this.console.debug('EditableDirective: onUndo()');

		if (!this.pEditable) return;
		if (this.doubleClick) return;
		if (!this.api!.hasDataCopy()) throw new Error('No data copy available. [PLANO-FE-188]');

		this.dismissChanges();
	}

	/**
	 * Check if a double click just happened
	 */
	public get doubleClick() : boolean {
		return this.clickedSuccess || this.clickedDismiss;
	}

	/**
	 * Try to save if this pEditable was activated
	 */
	public onSuccess(done ?: () => void) : void {
		this.console.debug('EditableDirective: onSuccess()');

		if (this.pEditable && ! this.doubleClick) {
			this.saveChanges(done);
		}
	}

	/**
	 * Handle esc
	 */
	public onEsc(event : Event) : void {
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
	@HostListener('keyup.meta.enter', ['$event']) private _onMetaEnter(event : Event) : void {
		this.console.debug('EditableDirective: onMetaEnter()');
		this.onEnter(event);
	}

	/**
	 * Handle shift enter
	 */
	@HostListener('keyup.shift.enter', ['$event']) private _onShiftEnter(event : Event) : void {
		this.console.debug('EditableDirective: onShiftEnter()');
		this.onEnter(event);
	}

	/**
	 * Handle meta enter
	 */
	@HostListener('keyup.enter', ['$event']) public onEnter(event : Event) : void {
		if (!this.showBtns) return;
		if (this.el.nativeElement.tagName === 'TEXTAREA') return;
		if ($(this.el.nativeElement).find('textarea').length) return;

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
	public handleBlur(event : Event) : void {
		event.preventDefault();
		event.stopPropagation();
		(event.target as HTMLElement).blur();
		if ($('.modal.show').length) {
			$('.modal.show').trigger('focus');
		}
	}

	/**
	 * Check if the clicked item is a date-picker Modal or something comparable
	 */
	public get blockOutsideClick() : boolean {
		let result : boolean = false;
		const modals = $('ngb-modal-window');
		if (!modals.length) {
			// If there is no modal, then there is nothing that needs to be blocked.
			result = false;
		} else if (this.el.nativeElement.contains($(':focus')[0]) || modals[0].contains($(':focus')[0])) {
			// If the focus is inside the current pEditable then its fine
			// This is the case when user has closed the date-picker modal
			result = true;
		} else {
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
	public startEditable(event : Event) : boolean {
		// Is an inactive pEditable? Then do nothing.
		if (!this.pEditable) return false;

		// Start this pEditable
		this.console.debug('EditableDirective: startEditable()');

		// End previous pEditable
		if (activeEditable) activeEditable.saveChanges();

		// if hook from previous pEditable is still active we cannot start the new one.
		if (hookIsActive) {
			this.handleBlur(event);
			return false;
		}

		// start this pEditable
		if (this.api!.hasDataCopy()) throw new Error('Old data copy existed while starting a new edit mode.');

		// eslint-disable-next-line unicorn/no-this-assignment, @typescript-eslint/no-this-alias
		activeEditable = this;
		this.showBtns = true;
		this.changeDetectorRef.markForCheck();

		this.api!.createDataCopy();
		this.editMode.emit(this.api!.hasDataCopy());

		return true;
	}

	private dismissChanges() : void {
		this.animateDismissButton();
		this.api!.dismissDataCopy();
		activeEditable = null;

		this.onLeaveCurrent.emit();
		this.editMode.emit(this.api!.hasDataCopy());
		this.onDismiss.emit();
	}

	/**
	 * The important one method that tries to save data. This is where the editable magic happens.
	 * @param done This handler is called when save process has finished (independent of the api call).
	 */
	public saveChanges(done : () => void = () => {}) : void {
		this.console.debug('EditableDirective: saveChanges()');

		if (!this.pEditable) throw new Error('Editable not active.');
		// This method should not be called when no data copy exists.
		if (!this.api!.hasDataCopy()) throw new Error('No data copy.');

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

		const saveProcess = (completed : () => void = () => {}) : void => {
			activeEditable = null;
			this.onSaveStart.emit();

			this.api!.mergeDataCopy();
			this.editMode.emit(this.api!.hasDataCopy());

			// NOTE: We often get this kind of error. Throws will turn into JIRA Tickets automatically.
			// We added a throw here, to give JIRA the info if this kind of error was caused by a pEditable.
			if (!this.api!.isLoaded()) throw new Error('[Editable] You cannot call save() when api is not loaded.');

			this.api!.save({
				success: (_response : HttpResponse<unknown> | null, noChanges : boolean) => {
					if (noChanges) {
						this.showBtns = false;
						this.changeDetectorRef.markForCheck();
					} else {
						this.onSaveSuccess.emit();
					}

					completed();
				},
			});

			this.animateSuccessButton();

			this.onLeaveCurrent.emit();
		};

		const HAS_DATA_COPY_CHANGED = this.api!.hasDataCopyChanged();
		if (!HAS_DATA_COPY_CHANGED) this.console.debug('EditableDirective: data has not changed');

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
		} else {
			// otherwise save immediately
			saveProcess(done);
		}
	}

	private animateDismissButton() : void {
		this.clickedDismiss = true;
		this.changeDetectorRef.markForCheck();
		this.waitForAnimation(() => {
			this.clickedDismiss = false;
			this.changeDetectorRef.markForCheck();
		});
	}

	private animateSuccessButton() : void {
		this.clickedSuccess = true;
		this.changeDetectorRef.markForCheck();
		this.waitForAnimation(() => {
			this.clickedSuccess = false;
			this.changeDetectorRef.markForCheck();
		});
	}

	private lostItsFocus() : boolean {
		return !activeEditable || this !== activeEditable;
	}

	private waitForAnimation(callback : () => void) : void {
		this.zone.runOutsideAngular(() => {
			window.setTimeout(() => {
				this.zone.run(() => {
					if ( this.lostItsFocus() ) {
						this.showBtns = false;
						this.changeDetectorRef.markForCheck();
					}
					callback();
				});
			}, this.animationDuration);
		});
	}

	public ngOnDestroy() : void {
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
			this.api!.hasDataCopy()
		) {
			// PLANO-3464 Commented this out because it created problems
			// this.dismissChanges();
		}

		// remove this from global edit components Array
		const index = allEditables.indexOf(this);

		if (index >= 0) allEditables.splice(index, 1);
	}

	// public get someDataCopyExists() : boolean {
	// 	return this.api!.hasDataCopy();
	// }

}

/**
 * pEditableTriggerFocussable is needed for inputs, textareas, etc.
 * note that there is a pEditableTriggerClickable too
 */

@Directive({ selector: '[pEditableTriggerFocussable]' })
export class EditableTriggerFocussableDirective {
	constructor(
		public pEditableRef : EditableDirective,
		public elementRef : ElementRef<HTMLElement>,
		private console : LogService,
	) {}

	@HostBinding('class.rounded-right') private get _roundedBorder() : boolean {
		return !!this.pEditableRef.pEditable && !this.pEditableRef.showBtns;
	}

	@HostBinding('class.p-editable-has-hook') private get _hasHook() : boolean {
		return !!this.pEditableRef.saveChangesHook;
	}

	@HostListener('focus', ['$event']) private _onFocus(event : Event) : void {
		this.pEditableRef.startEditable(event);
	}

	/**
	 * Handle esc
	 */
	@HostListener('keyup.esc', ['$event']) protected _onEsc(event : Event) : void {
		this.pEditableRef.onEsc(event);
	}

}

/**
 * pEditableTriggerClickable is needed for buttons, links etc.
 * note that there is a pEditableTriggerFocussable too
 */

@Directive({ selector: '[pEditableTriggerClickable]' })
export class EditableTriggerClickableDirective {
	constructor(
		public pEditableRef : EditableDirective,
		private console : LogService,
	) {}

	/**
	 * Like beforeEditHook but happens right before edit mode starts.
	 */
	@Input() public beforeEditHook ?: (success : () => void, dismiss : () => void) => void;

	@HostListener('click', ['$event']) private _onClick(event : Event) : void {
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

	@HostBinding('hidden') private get _isHidden() : boolean {
		return !(!this.pEditableRef.showBtns && this.pEditableRef.pEditable);
	}

	@HostBinding('disabled') private get _isDisabled() : boolean {
		if (!this.pEditableRef.pEditable) return false;
		return !this.pEditableRef.valid || this.pEditableRef.api!.hasDataCopy();
	}

	/**
	 * Handle esc
	 */
	@HostListener('keyup.esc', ['$event']) protected _onEsc(event : Event) : void {
		this.pEditableRef.onEsc(event);
	}

}

/**
 * pEditableInstantSaveButton is needed for e.g. checkboxes
 * if pEditableInstantSaveButton is clicked the value gets saved instantly
 * no success or save button needed
 */


@Directive({ selector: '[pEditableInstantSaveButton]' })
export class EditableInstantSaveButtonDirective {
	@HostBinding('class.p-editable-has-hook') private get _hasHook() : boolean {
		return !!this.pEditableRef.saveChangesHook;
	}

	@HostBinding('class.pulse')
	@HostBinding('class.pulse-success')
	@HostBinding('class.p-editable-active') private get _isActive() : boolean {
		return !!this.pEditableRef.pEditable;
	}

	@Output() public triggerClick : EventEmitter<Event> = new EventEmitter<Event>();
	@Input() private disabled : boolean = false;

	constructor( public pEditableRef : EditableDirective ) {
	}

	/**
	 * Handle click
	 */
	@HostListener('click', ['$event']) private _onClick(event : Event) : void {
		if (this.pEditableRef.doubleClick) return;
		if (this.triggerClick.observers.length <= 0) return;

		if (!this.pEditableRef.pEditable) {
			this.triggerClick.emit(event);
			return;
		}

		if (this.pEditableRef.startEditable(event)) {
			this.triggerClick.emit(event);
			this.pEditableRef.saveChanges();
		}
	}

	@HostBinding('disabled') private get _isDisabled() : boolean {
		return this.disabled;
	}

	@HostBinding('class.clicked') private get _isClicked() : boolean { return this.pEditableRef.clickedSuccess; }
}

@Directive({ selector: '[pEditableSuccessButton]' })
export class EditableSuccessButtonDirective {
	@HostBinding('class.pulse')
	@HostBinding('class.pulse-success')
	@HostBinding('class.btn')
	@HostBinding('class.btn-outline-secondary') protected _alwaysTrue = true;
	@HostBinding('type') private _type : string = 'button';

	constructor( public pEditableRef : EditableDirective ) {}

	@HostBinding('disabled') private get _isDisabled() : boolean {
		return !this.pEditableRef.valid;
	}

	@HostBinding('hidden') private get _isHidden() : boolean {
		return !(this.pEditableRef.showBtns && this.pEditableRef.pEditable);
	}

	@HostBinding('class.clicked') private get _isClicked() : boolean { return this.pEditableRef.clickedSuccess; }
	@HostListener('click', ['$event']) private _onClick() : void { this.pEditableRef.onSuccess(); }
}

@Directive({ selector: '[pEditableDismissButton]' })
export class EditableDismissButtonDirective {
	@HostBinding('type') private _type : string = 'button';
	@HostBinding('class.pulse')
	@HostBinding('class.btn')
	@HostBinding('class.btn-outline-secondary') protected _alwaysTrue = true;

	constructor( public pEditable : EditableDirective ) {}

	@HostBinding('disabled') private get _isDisabled() : boolean {
		return false;
	}

	@HostBinding('hidden') private get _isHidden() : boolean {
		return !(this.pEditable.showBtns && this.pEditable.pEditable);
	}

	@HostBinding('class.clicked') private get _isClicked() : boolean { return this.pEditable.clickedDismiss; }
	@HostListener('click', ['$event']) private _onClick() : void { this.pEditable.onUndo(); }
}


@Directive({
	selector: '[pVisibleInEditMode]',
})
export class PVisibleInEditModeDirective {
	constructor( public pEditable : EditableDirective ) {}

	@HostBinding('hidden') private get _isHidden() : boolean {
		// Editable is inactive when its e.g. a new member/shift/etc.
		const active = this.pEditable.pEditable;
		return !(!active || this.pEditable.showBtns);
	}
}

@Directive({
	selector: '[pHiddenInEditMode]',
})
export class HiddenInEditModeDirective {
	constructor( public pEditable : EditableDirective ) {}

	@HostBinding('hidden') private get _isHidden() : boolean {
		// Editable is active when its e.g. a existing member/shift/etc. form
		const active = this.pEditable.pEditable;
		return !active || this.pEditable.showBtns;
	}
}
