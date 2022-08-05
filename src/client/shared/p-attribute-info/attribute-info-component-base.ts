import * as _ from 'underscore';
import { AfterContentChecked, AfterContentInit, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { ChangeDetectorRef, Directive, HostBinding, Inject, Input } from '@angular/core';
import { ApiAttributeInfo } from '@plano/shared/api/base/api-attribute-info';
import { LogService } from '@plano/shared/core/log.service';
import { AttributeInfoComponentBaseDirectiveInterface, PFormControlComponentBaseDirectiveInterface } from './attribute-info-component-base.interface';
import { ApiDataWrapperBase } from '../../../shared/api/base/api-data-wrapper-base';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../shared/core/null-type-utils';
import { PDictionarySourceString } from '../../../shared/core/pipe/localize.dictionary';
import { PPossibleErrorNames } from '../../../shared/core/validators.types';
import { PFormsService } from '../../service/p-forms.service';
import { PFormGroup } from '../p-forms/p-form-control';
import { PFormControl} from '../p-forms/p-form-control';
import { PFormControlComponentChildInterface } from '../p-forms/p-form-control.interface';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[attributeInfo]',
	providers: [ {provide: Boolean, useValue: true} ],
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class AttributeInfoComponentBaseDirective<T extends ApiDataWrapperBase = any, ValueType = unknown>
implements AttributeInfoComponentBaseDirectiveInterface<T>, AfterContentInit, OnInit, DoCheck, AfterContentChecked {
	@Input() protected attributeInfo ?: ApiAttributeInfo<T, ValueType> | null;

	/**
	 * Should this content be visible?
	 * If yes, set it to true
	 * If no set it to false
	 * If the decision can not be made yet (e.g. because api is not loaded yet), set it to null
	 * If the tab component should calculate it, dont set anything.
	 */
	@Input('show') protected showInput : AttributeInfoComponentBaseDirectiveInterface<T>['show'] | null = null;
	@Input('canEdit') protected canEditInput : AttributeInfoComponentBaseDirectiveInterface<T>['canEdit'] | null = null;
	@Input('cannotEditHint') protected _cannotEditHint ?: PFormControlComponentChildInterface['cannotEditHint'];

	constructor(
		@Inject(Boolean) protected attributeInfoRequired : boolean = true,
		protected changeDetectorRef ?: ChangeDetectorRef,
		protected console ?: LogService,
	) {
	}

	/**
	 * Check if canEdit has changed
	 * Info about ngDoCheck: https://indepth.dev/posts/1131/if-you-think-ngdocheck-means-your-component-is-being-checked-read-this-article
	 */
	public ngDoCheck() : never {
		if (this.prevCanEdit !== null && this.prevCanEdit !== this.canEdit) this.changeDetectorRef?.markForCheck();
		if (this.prevShow !== null && this.prevShow !== this.show) this.changeDetectorRef?.markForCheck();
		return null as never;
	}

	private prevCanEdit : AttributeInfoComponentBaseDirective['canEdit'] | null = null;
	private prevShow : AttributeInfoComponentBaseDirective['show'] = null;

	public ngAfterContentChecked() : void {
		this.prevCanEdit = this.canEdit;
		this.prevShow = this.show;
	}

	public ngOnInit() : never {
		this.validateAI();
		// Make sure lifecycle does not get overwritten in sub-classes.
		// More Info: https://github.com/microsoft/TypeScript/issues/21388#issuecomment-785184392
		return null as never;
	}

	/**
	 * Validate if required attributes are set and
	 * if the set values work together / make sense / have a working implementation.
	 */
	private validateAI() : void {
		if (!this.attributeInfoRequired) return;
		if (this.attributeInfo !== undefined) return;
		if (this.show !== null && this.canEdit !== null) return;
		if (!!this.console) {
			this.console.error(`attributeInfo (or show & canEdit) is required (${this.constructor.name})`);
		} else {
			throw new Error(`attributeInfo (or show & canEdit) is required (${this.constructor.name})`);
		}
	}

	public ngAfterContentInit() : never {
		if (this.attributeInfo !== null) return null as never;
		if (this.show !== null && this.canEdit !== null) return null as never;
		if (this.attributeInfoRequired) this.console?.deprecated(`${this.constructor.name}: bind either [attributeInfo]="…" or [show]="…" and [canEdit]="…"`);
		// Make sure lifecycle does not get overwritten in sub-classes.
		// More Info: https://github.com/microsoft/TypeScript/issues/21388#issuecomment-785184392
		return null as never;
	}

	/**
	 * Should the content of this Component be visible?
	 */
	public get show() : AttributeInfoComponentBaseDirectiveInterface<T>['show'] {
		if (this.showInput !== null) return this.showInput;
		if (this.attributeInfo) return this.attributeInfo.show;
		if (!this.attributeInfoRequired) return true;
		return null;
	}

	/**
	 * Should the user get UI elements to edit this components content?
	 */
	public get canEdit() : AttributeInfoComponentBaseDirectiveInterface<T>['canEdit'] | null {
		if (this.canEditInput !== null) return this.canEditInput;
		if (this.attributeInfo) return this.attributeInfo.canEdit;
		if (!this.attributeInfoRequired) return true;
		return null;
	}

	/**
	 * A text that describes: »Why is this disabled?«
	 */
	public get cannotEditHint() : PDictionarySourceString | null {
		if (this._cannotEditHint !== undefined) return this._cannotEditHint;
		if (!this.attributeInfo) return null;
		if (!this.attributeInfo.vars.cannotEditHint) return null;
		return typeof this.attributeInfo.vars.cannotEditHint === 'string' ? this.attributeInfo.vars.cannotEditHint : this.attributeInfo.vars.cannotEditHint();
	}

}

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[attributeInfo]',
	providers: [ {provide: Boolean, useValue: true} ],
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class PFormControlComponentBaseDirective<T extends ApiDataWrapperBase = any, ValueType = unknown>
	extends AttributeInfoComponentBaseDirective<T>
	implements PFormControlComponentBaseDirectiveInterface<T>, AfterContentInit, AfterContentChecked, DoCheck, OnDestroy {

	/**
	 * @deprecated Please use [group]
	 */
	@Input() public formControl ?: PFormControl | null = null;

	/**
	 * The FormGroup on which a new FormControl for this AttributeInfo should be applied to.
	 *
	 * Background: You can choose between
	 * - creating a formControl and bind it like [formControl]="myFormControl",
	 * or
	 * - set [group]="myFormGroup" and [attributeInfo]="myAttributeInfo"
	 * If you choose the second option, the component itself handles the lifecycle of the formControl.
	 * This is a newer approach. It will probably replace the whole ControlValueAccessor approach later.
	 */
	@Input() public group ?: PFormGroup;

	@HostBinding('class.form-control-less') private get _hasNoFormControl() : boolean {
		return !this.formControl;
	}

	constructor(

		/*
		 * In an component that extends PFormControlComponentBaseDirective you can set attributeInfoRequired = false
		 * This way we can implement attributeInfo step by step into every of our components.
		 * NOTE:  Not sure if it is the right way to implement it everywhere. Maybe we should reduce
		 *        implementation to PFormControlSwitchComponent
		*/
		@Inject(Boolean) protected override attributeInfoRequired : boolean = true,
		protected override changeDetectorRef : ChangeDetectorRef,
		protected pFormsService : PFormsService,
		protected override console ?: LogService,
		// protected ngControl ?: NgControl,
	) {
		super(attributeInfoRequired, changeDetectorRef, console);
	}

	public override ngAfterContentInit() : never {
		// if (!!this.group && !!this.formControl) throw new Error('Set either formControl or group, not both.')

		if (!!this.attributeInfo && !!this.group) {
			// Does this case currently exist in our code? If not, we can skip PLANO-79682 for now.
			assumeDefinedToGetStrictNullChecksRunning(this.console, 'console');
			this.console.error('Not (fully) implemented yet: PLANO-79682');

			this.updateExistenceOfFormControl();
		}

		return super.ngAfterContentInit();
	}

	public override ngAfterContentChecked() : never {
		// Update the Validators.
		// NOTE: This updates the Validators, but it does not re-run the validators.
		this.formControl?.updateValidators();

		// We need to re-run the validators. But re-run them here every time, would cause an endless loop of re-runs.
		// So first we check if it is necessary.
		const newErrors = this.formControl?.disabled ? null : this.formControl?.validator?.(this.formControl);
		const oldErrors = {
			...this.formControl?.errors,
		};

		// Don’t care about async validators here.
		delete oldErrors[PPossibleErrorNames.EMAIL_USED];
		delete oldErrors[PPossibleErrorNames.EMAIL_INVALID];

		const ERRORS_STILL_THE_SAME = (
			!(newErrors && Object.keys(newErrors).length) && !Object.keys(oldErrors).length ||
			_.isEqual(newErrors, oldErrors)
		);
		if (!(ERRORS_STILL_THE_SAME)) {
			this.formControl?.updateValueAndValidity();
			this.formControl?.markAsTouched();

			// HACK: Seemed like change detection was not updating the parent components.
			// I could not figure out why it happened but i had this issue:
			// I was in a "REFUND" modal on http://127.0.0.1:9000/de/client/booking/2587/participants. Click on a radio
			// button changed validators of anther input. Other input became invalid.
			//
			// PROBLEM:
			// ==> The modal still had the information that it is valid. <==
			//
			// It turned out that the next change detection fixed it.
			// I could not figure out where a change detection was missing.
			requestAnimationFrame(() => this.changeDetectorRef.detectChanges());

		}

		return null as never;
	}

	private _prevShow : AttributeInfoComponentBaseDirective['show'] = null;

	/**
	 * Imagine: If the component is hidden, and the control is not invalid, the group would be invalid, and the
	 * user could not do anything to solve the invalid state. This method should prevent the described case.
	 * @returns has changed
	 */
	private refreshShow() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.attributeInfo, 'attributeInfo');
		const newShow = this.attributeInfo.show;
		if (newShow === this._prevShow) return false;

		assumeDefinedToGetStrictNullChecksRunning(this.formControl, 'formControl');
		if (newShow) {
			if (this.formControl.disabled) {
				this.formControl.updateValueAndValidity();
			}
		} else {
			if (this.formControl.enabled) {
				// I added {emitEvent: false} to fix PLANO-74808
				this.formControl.setErrors(null);
			}
		}

		this._prevShow = newShow;
		return true;
	}

	/**
	 * @returns has changed
	 */
	private refreshValue() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.attributeInfo, 'attributeInfo');
		const newValue = this.attributeInfo.value;
		assumeDefinedToGetStrictNullChecksRunning(this.formControl, 'formControl');
		if (newValue === this.formControl.value) return false;
		this.formControl.setValue(newValue, {emitEvent: false});
		return true;
	}

	/**
	 * If a formControl should be hidden in UI, it should not leave any errors in the formGroup.
	 */
	private refreshValueAndShow() : void {
		if (!this.formControl) return;
		if (!this.attributeInfo) return;

		// const VALUE_HAS_CHANGED = this.refreshValue();
		const SHOW_HAS_CHANGED = this.refreshShow();
		// if (!VALUE_HAS_CHANGED && !SHOW_HAS_CHANGED) return;
		if (!SHOW_HAS_CHANGED) return;

		// this.formControl.updateValueAndValidity();
		this.changeDetectorRef.markForCheck();
	}

	public override ngDoCheck() : never {
		this.refreshValueAndShow();
		return super.ngDoCheck();
	}

	public ngOnDestroy() : never {
		this.refreshValueAndShow();
		if (this.attributeInfo && this.group) this.removeFormControl();
		return null as never;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public _onChange : (value : any) => void = () => {};

	private createFormControl() : void {
		if (!!this.formControl) return;
		assumeDefinedToGetStrictNullChecksRunning(this.group, 'group');
		assumeDefinedToGetStrictNullChecksRunning(this.attributeInfo, 'attributeInfo');
		const NEW_FORM_CONTROL = this.pFormsService.getByAI(this.group, this.attributeInfo);
		NEW_FORM_CONTROL.registerOnChange((newValue : ValueType) => {
			this._onChange(newValue);
		});
		this.formControl = NEW_FORM_CONTROL;
	}

	private removeFormControl() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.group, 'group');
		assumeDefinedToGetStrictNullChecksRunning(this.attributeInfo, 'attributeInfo');
		const CONTROL = this.group.controls[this.attributeInfo.id];
		if (!CONTROL) return;
		CONTROL.unsubscribe();
		this.formControl = null;
		this.group.removeControl(this.attributeInfo.id);
		this.group.updateValueAndValidity();
		this.changeDetectorRef.detectChanges();

		// requestAnimationFrame(() => {
		// 	this.changeDetectorRef.detectChanges();
		// });
	}

	private updateExistenceOfFormControl() : void {
		if (this.attributeInfo?.show) {
			this.createFormControl();
		} else {
			this.removeFormControl();
		}
	}

	/**
	 * Should this be marked as required in ui? E.g. red underline.
	 */
	protected formControlInitialRequired() : boolean {
		if (this.formControl) {
			const validator = this.formControl.validator?.(this.formControl);
			if (!validator) return false;
			return !!validator[PPossibleErrorNames.REQUIRED] || !!validator[PPossibleErrorNames.ID_DEFINED] || !!validator[PPossibleErrorNames.NOT_UNDEFINED];
		}
		return false;
	}
}
