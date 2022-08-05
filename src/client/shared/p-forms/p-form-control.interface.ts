import { EventEmitter } from '@angular/core';
import { PDictionarySourceString } from '../../../shared/core/pipe/localize.dictionary';
import { BootstrapSize } from '../bootstrap-styles.enum';
import { PAssignmentProcessIcon } from '../p-sidebar/p-assignment-processes/assignment-process-icon';

export interface PFormControlComponentInterface {

	/**
	 * Is this only to show data and will never be enabled? Then set this to true.
	 */
	readMode : boolean | null;

	/**
	 * Should validation be initially visible.
	 * If true, it will become visible after the user touched the form control.
	 */
	checkTouched : boolean | null;

	/**
	 * Visual size of this component.
	 * Can be useful if you have few space in a button-bar or want to have it large on mobile.
	 */
	// TODO: Get rid of `?`
	size ?: BootstrapSize | null;
}

/**
 * An interface that defines children of form components (like p-radio-item, p-dropdown-item, etc.).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PFormControlComponentChildInterface<ItemValue = any> {

	/**
	 * The value that will be set in the parent, when selected by user.
	 */
	value : ItemValue;

	/**
	 * The title of this value. This will be visible to the user.
	 */
	label : string;

	/**
	 * Additional text that describes the value more then the label.
	 */
	description : string | null;

	/**
	 * The title of this value. This will be visible to the user.
	 */
	// FIXME: p-radios-radio supports PAssignmentProcessIconComponent icons. Get rid of it and switch to `PlanoFaIconPoolValues | PFaIcon` here
	icon : PAssignmentProcessIcon | null;

	/**
	 * Sometimes a simple value===radio.value doesn’t work.
	 * E.g. when value is an Id and value.equals(radio.value) is needed. This can be done by
	 * [active]="item.id.equals(formControl.value)"
	 *
	 * If this is undefined, the parent component will do its own calculations. Something like
	 * if (this.value === item.value) return true;
	 */
	active : boolean | null;

	/**
	 * If this is set to ture, it will overwrite the settings in attributeInfo.canEdit.
	 * If this is set to undefined or false, attributeInfo.canEdit will decide if the control is enabled or disabled.
	 */
	disabled : boolean;

	/**
	 * A text that describes: »Why is this disabled?«
	 */
	cannotEditHint : PDictionarySourceString | null;

	/**
	 * Emitter if ite has been clicked
	 */
	onClick : EventEmitter<ItemValue>;
}
