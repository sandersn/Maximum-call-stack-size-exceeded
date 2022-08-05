import { KeyValue} from '@angular/common';
import { KeyValuePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, UntypedFormBuilder, FormArray, FormGroup } from '@angular/forms';
import { ValidatorFn, ValidationErrors, AbstractControlOptions, AbstractControl} from '@angular/forms';
import { AsyncValidatorFn } from '@angular/forms';
import { RegisterTestAccountApiRoot } from '@plano/shared/api';
import { ApiAttributeInfo } from '@plano/shared/api/base/api-attribute-info';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { AsyncValidatorsService } from '@plano/shared/core/async-validators.service';
import { LogService } from '@plano/shared/core/log.service';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PValidationErrorValue, PValidatorObject } from '@plano/shared/core/validators.types';
import { PPossibleErrorNames } from '@plano/shared/core/validators.types';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../shared/core/null-type-utils';
import { PFormControl, PFormGroup } from '../shared/p-forms/p-form-control';
import { PFormControlSignatureObject, PFormControlSignatureObjectValidatorOrOptsType} from '../shared/p-forms/p-form-control';

export type VisibleErrorsType = KeyValue<PPossibleErrorNames, PValidationErrorValue>[];

@Injectable()

/**
 * Helper functions to build new FormGroups.
 */

export class PFormsService {
	constructor(
		private console : LogService,
		private validatorsService : ValidatorsService,
		private asyncValidatorsService : AsyncValidatorsService,
		private keyValuePipe : KeyValuePipe,
		private formBuilder : UntypedFormBuilder,
	) {
	}

	/**
	 * Add a FormControl to a FormArray.
	 */
	public addItemToFormArray(
		array : FormArray<PFormControl>,
		value : unknown,
	) : void {
		array.push(new PFormControl({
			formState: {
				value: value,
				disabled: false,
			},
		}));
	}

	/**
	 * Get the PFormControl that is related to the provided attributeInfo.
	 * If there is no related PFormControl in the provided PFormGroup yet,
	 * one will be created and added.
	 *
	 * @deprecated 	It is dangerous to use this in e.g. a getter. It would always create a new formControl when you 'get'
	 * 							it. But we want p-form-control-switch to handle the creation and to destroying of the attributeInfo
	 * 							related formControls.
	 * 							So don’t use it. Instead do it like this:
	 * 							If you want to get it simply write this.group.controls[attributeInfo.id]
	 * 							If you want to create it, use pForms.addControlByAttInfo(…)
	 */
	public getByAI(
		group : PFormGroup | FormGroup,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		attributeInfo : ApiAttributeInfo<any, unknown>,
		label ?: string,
	) : PFormControl {
		if (!group.controls[attributeInfo.id]) this.addControlByAttInfo(group, attributeInfo, label);
		return group.controls[attributeInfo.id] as PFormControl;
	}

	/**
	 * A Method to create a new PFormControl by passing a ApiAttributeInfo
	 */
	public addControlByAttInfo(
		formGroup : FormGroup,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		attributeInfo : ApiAttributeInfo<any, any>,
		label ?: string,
		subscribe ?: (value : unknown) => void,
	) : void {
		const checkIsUsed = attributeInfo.apiObjWrapper instanceof RegisterTestAccountApiRoot;
		const asyncValidators = attributeInfo.primitiveType ? this.getAsyncValidatorsForPrimitiveType(attributeInfo.primitiveType, checkIsUsed) : null;

		this.addPControl(
			formGroup,
			attributeInfo.id,
			{
				formState: {
					value: attributeInfo.value,
					// TODO: This requires this.api to be defined.
					// So i can not use this for unit tests or storybook yet.
					// disabled: !attributeInfo.canEdit,
					disabled: !attributeInfo.canEdit,
				},
				labelText: label ?? null,
				isReadMode: attributeInfo.readMode,
				asyncValidator: asyncValidators ?? null,
				attributeInfo: attributeInfo,
				subscribe: (newValue) => {
					if (subscribe) {
						subscribe(newValue);
					} else {
						if (attributeInfo.canEdit && attributeInfo.value !== newValue) attributeInfo.value = newValue;
					}
				},
			},
		);
	}

	/**
	 * Very often i need a control with a subscriber.
	 * This function is just a helper for easier code writing.
	 */
	public addPControl(
		formGroup : FormGroup,
		name : string,
		pFormControlContent : PFormControlSignatureObject,
	) : void {
		const newControl = new PFormControl(pFormControlContent);
		formGroup.addControl(
			name,
			newControl,
		);
		// eslint-disable-next-line @typescript-eslint/ban-types
		newControl.setParent(formGroup as UntypedFormGroup);
	}

	/**
	 * Remove from formGroup and leave no traces 🤫
	 */
	public removePControl(
		formGroup : PFormGroup,
		name : string,
	) : void {
		const CONTROL = formGroup.controls[name]!;
		CONTROL.unsubscribe();
		formGroup.removeControl(name);
	}

	/**
	 * @deprecated Please use addPControl instead
	 *
	 * Very often i need a control with a subscriber.
	 * This function is just a helper for easier code writing.
	 */
	public addControl(
		tempFormGroup : FormGroup,
		name : string,
		input : {
			value ?: unknown,
			disabled ?: boolean,
		},
		validators : PFormControlSignatureObjectValidatorOrOptsType = [],
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		subscribe ?: (value : any) => void,
		asyncValidator ?: AsyncValidatorFn | AsyncValidatorFn[],
	) : void {
		tempFormGroup.addControl(
			name,
			new PFormControl({
				formState: {
					value : input.value,
					disabled: input.disabled,
				},
				validatorOrOpts: validators ?? null,
				asyncValidator: asyncValidator ?? null,
				subscribe: subscribe!,
			}),
		);
	}

	/**
	 * This function is just a helper for easier code writing.
	 */
	public addArray(
		tempFormGroup : FormGroup,
		name : string,
		input : PFormControl[],
		validators : ValidatorFn[] = [],
		subscribe ?: (value : unknown) => void,
		asyncValidator ?: AsyncValidatorFn | AsyncValidatorFn[],
	) : void {
		const newFormArray = new UntypedFormArray(input, validators, asyncValidator);
		tempFormGroup.addControl(name, newFormArray);
		newFormArray.valueChanges.subscribe((value) => {
			if (subscribe) { subscribe(value); }
		});
	}

	/**
	 * Same like addControl, but for PFormGroup
	 */
	public addFormGroup(
		parentFormGroup : FormGroup,
		name : string,
		childFormGroup : FormGroup,
	) : void {
		parentFormGroup.addControl(name, childFormGroup);
	}

	/**
	 * This logs all errors of a formGroup to the browser console.
	 *
	 * NOTE: Sadly it does not log all errors. It has issues with nested formGroups and nested formArrays
	 */
	// eslint-disable-next-line @typescript-eslint/ban-types
	public getFormValidationErrors(formGroup : PFormGroup | UntypedFormArray | null = null) : ValidationErrors | null {
		if (!formGroup) return null;
		const result : ValidationErrors = [];
		for (const key of Object.keys(formGroup.controls)) {
			const control = formGroup.get(key);
			if (!control) throw new Error(`Could not find control ${key}`);
			const controlErrors = control.errors;
			if (controlErrors === null) continue;

			for (const keyError of Object.keys(controlErrors)) {
				result[keyError] = controlErrors[keyError];
				this.console.log(`Key control: ${key}, keyError: ${keyError}, err value: `, controlErrors[keyError]);
			}
		}
		return result;
	}

	/**
	 * Get all basic validators that should ALWAYS apply to the provided primitiveType
	 */
	public getValidatorsForPrimitiveType(primitiveType : PApiPrimitiveTypes) : PValidatorObject[] {
		switch (primitiveType) {
			case PApiPrimitiveTypes.Date:
			case PApiPrimitiveTypes.DateExclusiveEnd:
			case PApiPrimitiveTypes.DateTime:
			case PApiPrimitiveTypes.Enum:
			case PApiPrimitiveTypes.Id:
			case PApiPrimitiveTypes.LocalTime:
			case PApiPrimitiveTypes.ShiftId:
			case PApiPrimitiveTypes.ShiftSelector:
			case PApiPrimitiveTypes.any:
			case PApiPrimitiveTypes.boolean:
			case PApiPrimitiveTypes.string:
			case PApiPrimitiveTypes.Search:
			case PApiPrimitiveTypes.Image:
			case PApiPrimitiveTypes.ApiList:
			case PApiPrimitiveTypes.Duration:
				return [];
			case PApiPrimitiveTypes.number:
				return [ this.validatorsService.number(primitiveType) ];
			case PApiPrimitiveTypes.Email:
				return [ this.validatorsService.email() ];
			case PApiPrimitiveTypes.Url:
				return [ this.validatorsService.url() ];
			case PApiPrimitiveTypes.Iban:
				return [ this.validatorsService.iban() ];
			case PApiPrimitiveTypes.Bic:
				return [ this.validatorsService.bic() ];
			case PApiPrimitiveTypes.PostalCode:
				return [ this.validatorsService.plz() ];
			case PApiPrimitiveTypes.Tel:
				return [ this.validatorsService.phone() ];
			case PApiPrimitiveTypes.Password:
				return [ this.validatorsService.password() ];
			case PApiPrimitiveTypes.Currency:
				return [
					this.validatorsService.currency(),
				];
			case PApiPrimitiveTypes.Integer:
				return [ this.validatorsService.maxDecimalPlacesCount(0, primitiveType) ];
			case PApiPrimitiveTypes.Minutes:
			case PApiPrimitiveTypes.Hours:
			case PApiPrimitiveTypes.Days:
			case PApiPrimitiveTypes.Years:
			case PApiPrimitiveTypes.Months:
				return [
					this.validatorsService.min(0, true, primitiveType),
					this.validatorsService.maxDecimalPlacesCount(0, primitiveType),
				];
			case PApiPrimitiveTypes.Percent:
				return [
					this.validatorsService.min(0, true, primitiveType),
				];
		}
	}


	/**
	 * Get all async validators that should ALWAYS apply to the provided primitiveType
	 */
	public getAsyncValidatorsForPrimitiveType(primitiveType : PApiPrimitiveTypes, checkIsUsed : boolean = false) : AsyncValidatorFn[] | undefined {
		switch (primitiveType) {
			case PApiPrimitiveTypes.Date:
			case PApiPrimitiveTypes.DateExclusiveEnd:
			case PApiPrimitiveTypes.DateTime:
			case PApiPrimitiveTypes.Enum:
			case PApiPrimitiveTypes.Id:
			case PApiPrimitiveTypes.LocalTime:
			case PApiPrimitiveTypes.ShiftId:
			case PApiPrimitiveTypes.ShiftSelector:
			case PApiPrimitiveTypes.any:
			case PApiPrimitiveTypes.boolean:
			case PApiPrimitiveTypes.number:
			case PApiPrimitiveTypes.string:
			case PApiPrimitiveTypes.Search:
			case PApiPrimitiveTypes.Url:
			case PApiPrimitiveTypes.Iban:
			case PApiPrimitiveTypes.Bic:
			case PApiPrimitiveTypes.PostalCode:
			case PApiPrimitiveTypes.Tel:
			case PApiPrimitiveTypes.Password:
			case PApiPrimitiveTypes.Currency:
			case PApiPrimitiveTypes.Integer:
			case PApiPrimitiveTypes.Duration:
			case PApiPrimitiveTypes.Minutes:
			case PApiPrimitiveTypes.Hours:
			case PApiPrimitiveTypes.Days:
			case PApiPrimitiveTypes.Percent:
			case PApiPrimitiveTypes.Months:
			case PApiPrimitiveTypes.Years:
			case PApiPrimitiveTypes.Image:
			case PApiPrimitiveTypes.ApiList:
				return [];
			case PApiPrimitiveTypes.Email:
				return [ this.asyncValidatorsService.emailValidAsync(checkIsUsed) ];
		}
	}

	private getMinErrors(keyValueArray : VisibleErrorsType) : VisibleErrorsType {
		return keyValueArray.filter(error => {
			if (error.key === PPossibleErrorNames.MIN) return true;
			if (error.key === PPossibleErrorNames.GREATER_THAN) return true;
			return false;
		});
	}
	private getFormattingErrors(keyValueArray : VisibleErrorsType) : VisibleErrorsType {
		return keyValueArray.filter(error => {
			if (error.key === PPossibleErrorNames.FLOAT) return true;
			if (error.key === PPossibleErrorNames.INTEGER) return true;
			if (error.key === PPossibleErrorNames.NUMBER_NAN) return true;
			return false;
		});
	}

	private getTypeRelatedFormattingErrors(keyValueArray : VisibleErrorsType) : VisibleErrorsType {
		return keyValueArray.filter(error => error.key === PPossibleErrorNames.CURRENCY);
	}
	private getDetailedFormattingErrors(keyValueArray : VisibleErrorsType) : VisibleErrorsType {
		return keyValueArray.filter(error => error.key === PPossibleErrorNames.MAX_DECIMAL_PLACES_COUNT);
	}



	/**
	 * Errors that should be shown to the UI transformed to a array objects with key/value pairs.
	 */
	public visibleErrors(formControl : AbstractControl) : VisibleErrorsType {
		if (formControl.errors === null) return [];
		if (!Object.values(formControl.errors).length) return [];
		const keyValueArray = this.keyValuePipe.transform(formControl.errors) as VisibleErrorsType;

		const MIN_ERRORS = this.getMinErrors(keyValueArray);
		if (!!MIN_ERRORS.length) return MIN_ERRORS;

		// Some formatting issues, like when user is about to type 10,5 and typed 10 in a 'Days' field, lead to nullish values.
		// In that case its better to show the formatting error before complaining about required.
		const FORMATTING_ERRORS = this.getFormattingErrors(keyValueArray);
		if (!!FORMATTING_ERRORS.length) return FORMATTING_ERRORS;

		// Some type related formatting issues are more important than other formatting issues.
		const TYPE_RELATED_FORMATTING_ERRORS = this.getTypeRelatedFormattingErrors(keyValueArray);
		if (!!TYPE_RELATED_FORMATTING_ERRORS.length) return TYPE_RELATED_FORMATTING_ERRORS;

		// Some formatting issues are more important than other formatting issues.
		const DETAILED_FORMATTING_ERRORS = this.getDetailedFormattingErrors(keyValueArray);
		if (!!DETAILED_FORMATTING_ERRORS.length) return DETAILED_FORMATTING_ERRORS;

		const REQUIRED_ERRORS = keyValueArray.filter(error => error.key === PPossibleErrorNames.REQUIRED);
		if (!!REQUIRED_ERRORS.length) return REQUIRED_ERRORS;

		return keyValueArray.filter(error => {
			switch (error.key ) {
				case PPossibleErrorNames.URL_INCOMPLETE :
					return false;
				case PPossibleErrorNames.FLOAT :
					assumeDefinedToGetStrictNullChecksRunning(formControl, 'formControl');
					return !(formControl.errors && (
						formControl.errors[PPossibleErrorNames.INTEGER] ||
						formControl.errors[PPossibleErrorNames.MAX_DECIMAL_PLACES_COUNT] ||
						formControl.errors[PPossibleErrorNames.NUMBER_NAN]
					));
				default :
					return true;
			}
		}).splice(0, 1);
	}

	/**
	 * Same as formBuilder.group() but with better typing.
	 */
	public group(controlsConfig : {
		[key : string] : unknown;
	}, options ?: AbstractControlOptions | null) : PFormGroup {
		return this.formBuilder.group(controlsConfig, options) as PFormGroup;
	}

	/**
	 * Get formGroups inside a formArray typed.
	 * Angular does not have strict typed FormArray.controls, FormGroup.controls etc.
	 */
	// eslint-disable-next-line @typescript-eslint/ban-types
	public getIterablePFormGroups(input : UntypedFormArray) : PFormGroup[] {
		if (input.controls.some(item => item instanceof UntypedFormGroup)) this.console.error('Transform all FormGroup to PFormGroup or use old method getIterableFormGroups() instead.');
		// eslint-disable-next-line no-restricted-syntax
		const firstControl = input.controls[0];
		if (!(firstControl instanceof PFormGroup)) {
			if (firstControl instanceof UntypedFormGroup) this.console.error('Deprecated FormGroup inside FormArray in use here!');
			return [];
		}
		return input.controls as PFormGroup[];
	}

	/**
	 * @deprecated Add PFormGroup’s instead of FormGroup’s to your FormArray, and switch to .getIterablePFormGroups(...)
	 */
	// eslint-disable-next-line @typescript-eslint/ban-types
	public getIterableFormGroups(input : UntypedFormArray) : UntypedFormGroup[] {
		if (input.controls.some(item => item instanceof PFormGroup)) this.console.error('Use new method getIterablePFormGroups() instead');
		// eslint-disable-next-line no-restricted-syntax
		if (!(input.controls[0] instanceof UntypedFormGroup)) return [];
		// eslint-disable-next-line @typescript-eslint/ban-types
		return input.controls as UntypedFormGroup[];
	}
}
