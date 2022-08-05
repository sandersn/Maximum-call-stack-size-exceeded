import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { ResultTemplateContext } from '@ng-bootstrap/ng-bootstrap/typeahead/typeahead-window';
import { Subject, merge, Observable } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { AfterContentChecked, AfterContentInit} from '@angular/core';
import { Component, Input, ViewChild, ChangeDetectionStrategy, Output, EventEmitter, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { forwardRef } from '@angular/core';
import { ControlValueAccessor} from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SchedulingApiShiftModels} from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { SchedulingApiShiftModel } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { EditableControlInterface, EditableTriggerFocussableDirective} from '@plano/client/shared/p-editable/editable/editable.directive';
import { EditableDirective } from '@plano/client/shared/p-editable/editable/editable.directive';
import { ApiObjectWrapper, TimeStampApiShiftModels } from '@plano/shared/api';
import { TimeStampApiShiftModel } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { FaIcon } from '@plano/shared/core/component/fa-icon/fa-icon-types';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PPossibleErrorNames } from '@plano/shared/core/validators.types';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { PFormControl } from '../p-form-control';
import { PFormControlComponentInterface } from '../p-form-control.interface';

type ValueType = Id | null;

@Component({
	selector: 'p-input-shiftmodel-id[items]',
	templateUrl: './p-input-shiftmodel-id.component.html',
	styleUrls: ['./p-input-shiftmodel-id.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PInputShiftModelIdComponent),
			multi: true,
		},
	],
})
export class PInputShiftModelIdComponent
implements ControlValueAccessor, AfterContentInit, AfterContentChecked, EditableControlInterface, PFormControlComponentInterface {
	@Input() public readMode : PFormControlComponentInterface['readMode'] = false;
	@Input() public items ! : SchedulingApiShiftModels | TimeStampApiShiftModels;
	@Input('required') private _required : boolean = false;
	@Input('placeholder') private _placeholder : string | null = null;
	@ViewChild(EditableDirective, { static: false }) private pEditableRef ?: EditableDirective;
	@Input() public icon : FaIcon = 'search';

	/**
	 * How one item should look like.
	 */
	@Input() public itemTemplate : TemplateRef<ResultTemplateContext> | null = null;

	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public focusout : EventEmitter<Event> = new EventEmitter<Event>();
	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public focus : EventEmitter<Event> = new EventEmitter<Event>();

	@Input() public checkTouched : PFormControlComponentInterface['checkTouched'] = false;

	constructor(
		private localize : LocalizePipe,
		private changeDetectorRef : ChangeDetectorRef,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;

	public inputHasClassRoundedRight : boolean = false;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public changeEditMode(event : boolean) : void {
		if (this.pEditableRef) this.inputHasClassRoundedRight = event;
		this.editMode.emit(event);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get placeholder() : string {
		if (this._placeholder !== null) return this._placeholder;
		return this.localize.transform('Wähle eine Tätigkeit…');
	}

	@ViewChild('instance', { static: false }) public instance ?: NgbTypeahead;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onFocus(event : FocusEvent) : void {
		this.focus.emit(event);
		this.focus$.next((event.target as HTMLTextAreaElement).value);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onClick(
		event : MouseEvent,
	) : void {
		const TARGET = event.target as HTMLTextAreaElement;
		this.click$.next(TARGET.value);
	}

	// I am not quite sure how this works. It was copy paste ¯\_(ツ)_/¯ ^nn
	public focus$ : Subject<string> = new Subject<string>();
	public click$ : Subject<string> = new Subject<string>();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public search = (text$ : Observable<string>) : Observable<ApiObjectWrapper<any>[]> => {
		const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
		const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !!(this.instance && !this.instance.isPopupOpen())));
		const inputFocus$ = this.focus$;

		return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
			map((term : string) => {
				const items = this.items.search(term).filterBy((item : SchedulingApiShiftModel | TimeStampApiShiftModel) => {
					if (!item.trashed) return true;
					if (this.value && item.id.equals(this.value)) return true;
					return false;
				});
				return items.iterableSortedBy(['parentName']);
			}),
		);
	};

	public formatter = (item : SchedulingApiShiftModel) : string => {
		// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
		if (!item) return '';
		// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
		if (!item.id) return '';
		// eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
		return item.name ? item.name : '';
	};

	private _tempValue : string | null = null;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get valueItem() : SchedulingApiShiftModel | TimeStampApiShiftModel | string | null {
		if (this._tempValue) return this._tempValue;
		return this.items.get(this.value);
	}

	public set valueItem(input : SchedulingApiShiftModel | TimeStampApiShiftModel | string | null) {
		if (
			input instanceof SchedulingApiShiftModel ||
			input instanceof TimeStampApiShiftModel
		) {
			this.value = input.id;
			this._tempValue = null;
		} else {
			this._tempValue = input;

			assumeDefinedToGetStrictNullChecksRunning(input, 'input');
			const ID = this.getIdByInput(input);
			if (ID instanceof Id) {
				this._tempValue = null;
				this.onClickItem(ID);
				this.instance!.dismissPopup();
			}
		}
	}

	private getIdByInput(input : string) : Id | string {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const searchedShiftModels = this.items.filterBy((item : any) => `${item.name.toLowerCase()}` === input.toLowerCase());
		if (searchedShiftModels.length > 0) {
			const firstItem = searchedShiftModels.get(0);
			if (!firstItem) throw new Error('Could not get firstItem');
			return firstItem.id;
		}
		return input;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get allItems() : boolean | null {
		if (this.value === null) return false;
		return true;
	}

	/**
	 * Is this a required field?
	 * This can be set as Input() but if there is a formControl binding,
	 * then it takes the info from the formControl’s validators.
	 * TODO: 	Replace this by:
	 * 				return this.formControlInitialRequired();
	 */
	public get required() : boolean {
		if (this._required) return this._required;
		if (this.formControl) {
			const validator = this.formControl.validator?.(this.formControl);
			if (!validator) return false;
			return !!validator[PPossibleErrorNames.REQUIRED] || !!validator[PPossibleErrorNames.ID_DEFINED] || !!validator[PPossibleErrorNames.NOT_UNDEFINED];
		}
		return false;
	}

	public ngAfterContentInit() : void {
		this.initValues();
	}

	/**
	 * Set some default values for properties that are not defined yet
	 */
	public initValues() : void {
		this.inputHasClassRoundedRight = !this.pEditable;
	}

	public ngAfterContentChecked() : void {
	}

	/**
	 * Set new selected member as value
	 */
	private onClickItem(id : Id | null) : void {
		// this.animateSuccessButton();
		this.value = id;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public typeaheadOnSelect(
		input : NgbTypeaheadSelectItemEvent<SchedulingApiShiftModel>,
		pEditableTriggerFocussableRef : HTMLInputElement,
	) : void {
		this.value = input.item.id;
		$(pEditableTriggerFocussableRef).trigger('enter');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public setFocus(
		pEditableTriggerFocussableRef : TemplateRef<EditableTriggerFocussableDirective> | HTMLInputElement,
	) : void {
		$(pEditableTriggerFocussableRef).trigger('focus');
	}

	// These are necessary Inputs and Outputs for pEditable form-element
	@Input() public pEditable : EditableControlInterface['pEditable'] = false;
	@Input() public api : EditableControlInterface['api'] = null;
	@Input() public valid : EditableControlInterface['valid'] = null;
	@Input() public saveChangesHook ?: EditableControlInterface['saveChangesHook'];
	@Output() public onSaveStart : EditableControlInterface['onSaveStart'] = new EventEmitter();
	@Output() public onSaveSuccess : EditableControlInterface['onSaveSuccess'] = new EventEmitter();
	@Output() public onDismiss : EditableDirective['onDismiss'] = new EventEmitter();
	@Output() public onLeaveCurrent : EditableControlInterface['onLeaveCurrent'] = new EventEmitter();
	@Output() public editMode : EditableControlInterface['editMode'] = new EventEmitter<boolean>(undefined);

	/** Is this valid? [valid]="…" overwrites the valid state if the formControl. */
	public get isValid() : boolean {
		if (this.valid !== null) return this.valid;
		return !this.formControl?.invalid;
	}

	/**
	 * This is the minimum code that is required for a custom control in Angular.
	 * Its necessary to make [(ngModel)] and [formControl] work.
	 */
	@Input() public disabled : boolean = false;
	@Input() public formControl : PFormControl | null = null;

	private _value : ValueType | null = null;

	/**
	 * Transform input into fitting output format
	 */
	private stringToOutput(input : string) : Id | null {
		const ID = this.getIdByInput(input);
		if (ID instanceof Id) return ID;
		return null;
	}

	public _onChange : (value : ValueType | null) => void = () => {};
	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public keyup : EventEmitter<Event> = new EventEmitter<Event>();

	/** Get keyup event from inside this component, and pass it on. */
	public onKeyUp(event : KeyboardEvent) : void {
		const output = this.stringToOutput((event.target as HTMLInputElement).value);
		this._onChange(output);
		this.keyup.emit(event);
	}
	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public blur : EventEmitter<Event> = new EventEmitter<Event>();
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onBlur() : void { this.onTouched(); }
	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public change : EventEmitter<Event> = new EventEmitter<Event>();
	/* eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/no-explicit-any */
	public onChange(event : any) : void {
		const output = this.stringToOutput((event.target as HTMLInputElement).value);
		this._onChange(output);
		this.change.emit(event);
	}

	/** onTouched */
	public onTouched = () : void => {};

	/** the value of this control */
	public get value() : ValueType | null { return this._value; }
	public set value(value : ValueType | null) {
		if (value === this._value) return;

		this._value = value;
		this._onChange(value);
	}

	/** Write a new value to the element. */
	public writeValue(value : ValueType) : void {
		if (this._value === value) return;
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
	public registerOnChange(fn : (value : ValueType | null) => void) : ReturnType<ControlValueAccessor['registerOnChange']> { this._onChange = fn; }

	/** Set the function to be called when the control receives a touch event. */
	public registerOnTouched(fn : () => void) : void { this.onTouched = fn; }

	/** setDisabledState */
	public setDisabledState(isDisabled : boolean) : void {
		if (this.disabled === isDisabled) return;
		// Set internal attribute which gets used in the template.
		this.disabled = isDisabled;
		// Refresh the formControl. #two-way-binding
		if (this.formControl && this.formControl.disabled !== this.disabled) {
			this.disabled ? this.formControl.disable() : this.formControl.enable();
		}
	}
}
