import { SubscriptionLike as ISubscription } from 'rxjs';
import { OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Component, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Config } from '@plano/shared/core/config';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { PFormControl } from '../p-form-control';

@Component({
	selector: 'p-form-group',
	templateUrl: './p-form-group.component.html',
	styleUrls: ['./p-form-group.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})

/**
 * A wrapper for form-elements like checkbox, input, textarea etc.
 * It adds the Label to the form-element, it highlights the label if
 * the PFormControl is invalid etc.
 * @example
 *   <p-form-group
 *     label="First Name" i18n-label
 *     [control]="formGroup.get('firstName')!"
 *   >
 *     <p-checkbox ...></p-checkbox>
 *   </p-form-group>
 */

export class PFormGroupComponent implements OnInit, OnDestroy, PComponentInterface {
	@HostBinding('class.form-group') private _alwaysTrue = true;

	@Input() public readMode = false;

	@Input() public isLoading : PComponentInterface['isLoading'] = false;

	/**
	 * Determine if component has danger
	 */
	@HostBinding('class.has-danger') private get hasDanger() : boolean {
		if (this._hasDanger) return true;
		if (this.control && (!this.checkTouched || this.control.touched) && this.control.errors) return true;
		return false;
	}

	/**
	 * Content for the <label> above your input/checkbox/…
	 * Note that the label can also be set here: new PFormControl(labelText : string, …)
	 */
	@Input('label') private _label : string | null = null;

	/**
	 * More infos for the user about how this data is used later.
	 * Note that the description can also be set here: new PFormControl(…, …, description : string, …)
	 */
	@Input('description') private _description : string | null = null;

	/**
	 * If you want to use HTML in the description, set descriptionHTML instead of description
	 */
	@Input('descriptionHTML') public descriptionHTML : TemplateRef<HTMLElement> | null = null;

	/**
	 * Visual feedback if there is a problem like e.g. a validation error.
	 * It is not necessary to provide this, if you have provided a [control].
	 */
	@Input('hasDanger') private _hasDanger : boolean = false;

	@Input() public checkTouched : boolean = true;

	/**
	 * Some PFormControl.
	 * Needed to get info about errors.
	 */
	@Input() public control : AbstractControl | null = null;

	constructor(
		private changeDetectorRef : ChangeDetectorRef,
	) {
	}

	public ngOnInit() : void {
		this.initFormControlSubscriber();
	}

	private subscription : ISubscription | null = null;

	private initFormControlSubscriber() : void {
		if (!this.control) return;
		this.subscription = this.control.valueChanges.subscribe(() => {
			this.changeDetectorRef.detectChanges();
		});
	}

	public ngOnDestroy() : void {
		this.subscription?.unsubscribe();
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get label() : string | null {
		if (!!this._label) return this._label;
		if (!(this.control instanceof PFormControl)) return null;
		if (this.control.labelText === undefined) return null;
		return this.control.labelText;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get description() : string | null {
		if (!!this._description) return this._description;
		if (!(this.control instanceof PFormControl)) return null;
		if (this.control.description === undefined) return null;
		return this.control.description;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isMobile() : boolean {
		return Config.IS_MOBILE;
	}
}
