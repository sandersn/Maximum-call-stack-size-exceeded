import { Subscription } from 'rxjs';
import { AfterContentChecked, AfterContentInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ApiAttributeInfo } from '../../../../shared/api/base/api-attribute-info';
import { PApiPrimitiveTypes } from '../../../../shared/api/base/generated-types.ag';
import { Duration } from '../../../../shared/api/base/generated-types.ag';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { PDictionarySourceString } from '../../../../shared/core/pipe/localize.dictionary';
import { PFormsService } from '../../../service/p-forms.service';
import { PFormGroup } from '../p-form-control';
import { FormControlSwitchType } from '../p-form-control-switch/p-form-control-switch.component';
import { PFormControlSwitchComponent } from '../p-form-control-switch/p-form-control-switch.component';
import { PFormGroupComponent } from '../p-form-group/p-form-group.component';
import { PInputComponent } from '../p-input/p-input.component';
import { DurationUIType } from '../p-input/p-input.types';

type Option = {
	text : PDictionarySourceString,
	value : DurationUIType | null,
};

/**
 * This is a peace of crap.
 * I was frustrated when i created it. So better avoid it.
 * @deprecated
 */
@Component({
	selector: 'p-form-control-switch-duration[group]',
	templateUrl: './p-form-control-switch-duration.component.html',
	styleUrls: ['./p-form-control-switch-duration.component.scss'],
})
export class PFormControlSwitchDurationComponent implements AfterContentInit, OnDestroy, AfterContentChecked, AfterViewInit {
	@Input() public group ! : PFormGroup;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	@Input() public attributeInfo! : ApiAttributeInfo<any, any>;

	@Input() public label : PFormGroupComponent['label'] = null;
	@Input() public description : PFormGroupComponent['description'] | null = null;
	@Input() public maxDecimalPlacesCount : PInputComponent['maxDecimalPlacesCount'] = null;

	private _durationUIType : PInputComponent['durationUIType'] = null;

	/**
	 * The type of this value
	 */
	public get durationUIType() : PInputComponent['durationUIType'] {
		return this._durationUIType;
	}
	@Input() public set durationUIType(input : PInputComponent['durationUIType']) {
		this._durationUIType = input;
		if (this.dropdownValue !== this._durationUIType) this.dropdownValue = this._durationUIType;
	}

	/**
	 * Options that gets available in the appending dropdown
	 */
	@Input() public options : Option[] = [
		{
			text : 'Tage',
			value : PApiPrimitiveTypes.Days,
		},
		{
			text : 'Unbegrenzt',
			value : null,
		},
	];

	/**
	 * @see PFormControlSwitchComponent.placeholder
	 */
	@Input() public placeholder : PFormControlSwitchComponent['placeholder'] = null;

	@Input() public inputGroupAppendIcon : PFormControlSwitchComponent['inputGroupAppendIcon'] = null;

	constructor(
		private pFormsService : PFormsService,
		private changeDetectorRef : ChangeDetectorRef,
	) {}

	private _dropdownValue : Option['value'] | null = null;

	/**
	 * Some unique value that is represented by the selected dropdown item.
	 */
	public get dropdownValue() : Option['value'] {
		return this._dropdownValue;
	}
	public set dropdownValue(input : Option['value']) {
		if (this._dropdownValue === input) return;
		this._dropdownValue = input;

		const formControl = this.group.get(this.attributeInfo.id);
		if (!formControl) return;

		// We need to prevent the value to change when the component loads initially
		if (!this.viewInitialized) return;

		if (input === null) {
			const newValue = null;
			formControl.setValue(newValue);
		} else {
			formControl.setValue(undefined);
			// Enable this now, so the next check will notice that the form is invalid. Disabled inputs are never considered
			// to a validation check.
			formControl.enable();
		}
		formControl.markAsTouched();
		formControl.markAsDirty();

		this.changeDetectorRef.detectChanges();
	}

	private viewInitialized = false;

	public ngAfterViewInit() : void {
		this.viewInitialized = true;
	}

	public ngAfterContentChecked() : void {
		this.validateComponentValues();

		const formControl = this.group.get(this.attributeInfo.id);
		if (!formControl) return;
		if (this.dropdownValue === null) {
			if (formControl.enabled) formControl.disable({onlySelf: true, emitEvent: false});
		} else {
			if (!formControl.enabled) formControl.enable({onlySelf: true, emitEvent: false});
		}
	}

	private validateComponentValues() : void {
		switch (this.attributeInfo.primitiveType) {
			case PApiPrimitiveTypes.Duration:
			case PApiPrimitiveTypes.Years:
			case PApiPrimitiveTypes.Months:
			case PApiPrimitiveTypes.Days:
			case PApiPrimitiveTypes.Hours:
			case PApiPrimitiveTypes.Minutes:
				break;
			default:
				throw new TypeError('Unexpected primitiveType');
		}
	}

	private subscription : Subscription | null = null;

	public ngOnDestroy() : void {
		if (!this.attributeInfo.apiObjWrapper.rawData) return; // Reference got lost e.g. due to api.save()
		const formControl = this.group.get(this.attributeInfo.id);
		if (!formControl) return;
		if (formControl.disabled) formControl.enable({ emitEvent: false, onlySelf: true });
		this.subscription?.unsubscribe();
	}

	public FormControlSwitchType = FormControlSwitchType;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;

	private initDropdownValue() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.attributeInfo.primitiveType, 'attributeInfo.primitiveType');
		if (this.attributeInfo.value === null && this.options.some(item => item.value === null)) {
			this.dropdownValue = null;
			return;
		}
		this.dropdownValue = this.durationUIType;
	}

	public ngAfterContentInit() : void {
		this.initDropdownValue();

		const formControl = this.pFormsService.getByAI(this.group, this.attributeInfo);

		this.subscription = formControl.valueChanges.subscribe((newValue : Duration) => {
			if (newValue > 0) this.dropdownValue = PApiPrimitiveTypes.Days;
		});
	}
}
