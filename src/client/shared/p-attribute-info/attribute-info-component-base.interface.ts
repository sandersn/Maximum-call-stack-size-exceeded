import { ApiDataWrapperBase } from '../../../shared/api';
import { ApiAttributeInfo } from '../../../shared/api/base/api-attribute-info';

/**
 * An interface that can be implemented in any component, that handles values from
 * [attributeInfo]="…" bindings.
 */
export interface AttributeInfoComponentBaseDirectiveInterface<T extends ApiDataWrapperBase> {
	show : boolean | null;
	canEdit : boolean | null;
	cannotEditHint ?: ApiAttributeInfo<T, unknown>['vars']['cannotEditHint'] | null;
}

/**
 * An interface that can be implemented in any component, that handles values from
 * [attributeInfo]="…" bindings in addition to [formControl]="…".
 */
export interface PFormControlComponentBaseDirectiveInterface<T extends ApiDataWrapperBase> extends AttributeInfoComponentBaseDirectiveInterface<T> {
	_onChange : (input : unknown) => void;
}
