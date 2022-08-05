import { EventEmitter, TemplateRef } from '@angular/core';
import { ApiObjectWrapper } from '@plano/shared/api';
import { PFormGroup } from './p-forms/p-form-control';

export interface FormComponentInterface { // extends PComponentInterface
	initComponent(success ?: () => void) : void;
	formGroup : PFormGroup | null;
	initFormGroup() : void;
	ngAfterContentInit() : void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DetailFormComponentInterface<T extends ApiObjectWrapper<any, 'draft' | 'validated'>> extends FormComponentInterface {
	// TODO: Can we get rid of `| null` ?
	item : T | null;

	onAddItem : EventEmitter<T>;
	// onAddItem : EventEmitter<Id>;
	saveItem(input ?: T) : void;
	removeItem?(input ?: T | TemplateRef<unknown>) : void;
}
