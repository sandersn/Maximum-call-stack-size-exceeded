import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Subject, merge } from 'rxjs';
import { Observable} from 'rxjs';
import { debounceTime, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { AfterContentChecked, AfterContentInit} from '@angular/core';
import { Component, Input, ViewChild, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { forwardRef } from '@angular/core';
import { ControlValueAccessor} from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { EditableControlInterface} from '@plano/client/shared/p-editable/editable/editable.directive';
import { EditableDirective } from '@plano/client/shared/p-editable/editable/editable.directive';
import { SchedulingApiMember } from '@plano/shared/api';
import { SchedulingApiMembers } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { FaIcon } from '@plano/shared/core/component/fa-icon/fa-icon-types';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PPossibleErrorNames } from '@plano/shared/core/validators.types';
import { PFormControl } from '../p-form-control';
import { PFormControlComponentInterface } from '../p-form-control.interface';

type ValueType = Id | null;

@Component({
	selector: 'p-input-member-id[members]',
	templateUrl: './p-input-member-id.component.html',
	styleUrls: ['./p-input-member-id.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PInputMemberIdComponent),
			multi: true,
		},
	],
})
export class PInputMemberIdComponent
implements ControlValueAccessor, AfterContentInit, AfterContentChecked, EditableControlInterface, PFormControlComponentInterface {
	@Input() public readMode : PFormControlComponentInterface['readMode'] = false;
	@Input() public members ! : SchedulingApiMembers;
	@Input() public allMembersIsAllowed : boolean | null = null;
	@Input('required') private _required : boolean = false;
	@Input('placeholder') private _placeholder : string | null = null;
	@ViewChild(EditableDirective) private pEditableRef ?: EditableDirective;
	@Input() public icon : FaIcon = PlanoFaIconPool.ITEMS_MEMBER;

	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public focusout : EventEmitter<Event> = new EventEmitter<Event>();
	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public focus : EventEmitter<Event> = new EventEmitter<Event>();

	@Input() public checkTouched : PFormControlComponentInterface['checkTouched'] = false;

	constructor(
		private localize : LocalizePipe,
		private changeDetectorRef : ChangeDetectorRef,
		private rightsService : RightsService,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;

	public inputHasClassRoundedRight : boolean | null = null;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public changeEditMode(event : boolean) : void {
		if (this.pEditableRef) this.inputHasClassRoundedRight = event;
		this.editMode.emit(event);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get placeholder() : string | undefined {
		if (this._placeholder !== null) return this._placeholder;
		if (this.allMembersIsAllowed) return this.localize.transform('Alle Berechtigten');
		return undefined;
	}

	@ViewChild('instance') public instance ?: NgbTypeahead;

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

	public search = (text$ : Observable<string>) : Observable<SchedulingApiMember[]> => {
		const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
		const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !!(this.instance && !this.instance.isPopupOpen())));
		const inputFocus$ = this.focus$;

		return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
			map((term : string) => {
				const members = this.members.search(term).filterBy(item => {
					if (!item.trashed) return true;
					if (this.value && item.id.equals(this.value)) return true;
					return false;
				});
				const result = members.iterableSortedBy(['lastName', 'firstName', 'trashed'])/* .slice(0, 9)*/;
				if (this.allMembersIsAllowed) {
					const pseudoMember = new SchedulingApiMember(null, 0);
					pseudoMember.firstName = this.localize.transform('Alle');
					pseudoMember.lastName = this.localize.transform('Berechtigten');
					result.push(pseudoMember);
				}
				return result;
			}),
		);
	};

	public formatter = (member : SchedulingApiMember | null = null) : string => {
		if (!member) return '';
		// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
		if (!member.id) return '';
		// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
		let result = member.firstName ?? '';
		if (member.lastName) {
			if (result.length) result += ' ';
			result += member.lastName;
		}
		return result;
	};

	private _tempValue : string | null = null;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get valueMember() : SchedulingApiMember | string {
		if (this._tempValue) return this._tempValue;
		return this.members.get(this.value)!;
	}

	public set valueMember(input : SchedulingApiMember | string) {
		if (!input && this.allMembersIsAllowed) {
			this.value = null;
			this._tempValue = null;
			return;
		}
		if (input instanceof SchedulingApiMember) {
			this.value = input.id;
			this._tempValue = null;
		} else {
			this._tempValue = input;

			const ID = this.getMemberIdByInput(input);
			if (ID instanceof Id) {
				this._tempValue = null;
				this.onClickMember(ID);
				this.instance!.dismissPopup();
			}
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getMemberIdByInput(input : string) : Id | string {
		const searchedMembers = this.members.filterBy(member => `${member.firstName.toLowerCase()} ${member.lastName.toLowerCase()}` === input.toLowerCase());
		if (searchedMembers.length > 0) {
			return searchedMembers.get(0)!.id;
		}
		return input;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get allMembers() : boolean | undefined {
		if (!this.allMembersIsAllowed) return undefined;
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
	private onClickMember(memberId : Id | null) : void {
		// this.animateSuccessButton();
		this.value = memberId;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public typeaheadOnSelect(
		input : NgbTypeaheadSelectItemEvent<SchedulingApiMember>,
		pEditableTriggerFocussableRef : HTMLInputElement,
	) : void {
		this.value = input.item.id;
		$(pEditableTriggerFocussableRef).trigger('enter');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public typeaheadOnBlur(
		input : TypeaheadMatch,
		pEditableTriggerFocussableRef : HTMLInputElement,
	) : void {
		this.value = input.item;
		$(pEditableTriggerFocussableRef).trigger('enter');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public setFocus(
		pEditableTriggerFocussableRef : HTMLInputElement,
	) : void {
		$(pEditableTriggerFocussableRef).trigger('focus');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public isMe(member : SchedulingApiMember) : boolean {
		return this.rightsService.isMe(member.id) ?? false;
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
		return this.valid !== null ? this.valid : (!this.formControl || !this.formControl.invalid);
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
		const ID = this.getMemberIdByInput(input);
		if (ID instanceof Id) return ID;
		return null;
	}

	public _onChange : (value : ValueType | null) => void = () => {};
	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public keyup : EventEmitter<Event> = new EventEmitter<Event>();

	/** Get keyup event from inside this component, and pass it on. */
	public onKeyUp(event : KeyboardEvent) : void {
		let output = this.stringToOutput((event.target as HTMLInputElement).value);
		if (!output) output = this.allMembersIsAllowed ? null : output;
		this._onChange(output);
		this.keyup.emit(event);
	}
	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public blur : EventEmitter<Event> = new EventEmitter<Event>();

	/** Get blur event from inside this component, and pass it on. */
	public onBlur() : void { this.onTouched(); this.blur.emit(event); }
	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public change : EventEmitter<Event> = new EventEmitter<Event>();
	/* eslint-disable-next-line jsdoc/require-jsdoc */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
	public onChange(event : any) : void {
		let output = this.stringToOutput((event.target as HTMLInputElement).value);
		if (!output) output = this.allMembersIsAllowed ? null : output;
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

	/**
	 * Has a member been chosen?
	 */
	public get hasMemberValue() : boolean {
		if (!this.valueMember) return false;
		if (typeof this.valueMember === 'string') return false;
		return true;
	}
}
