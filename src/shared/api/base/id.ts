import { Integer } from './generated-types.ag';
import { IdBase } from './id-base';
import { NonZeroInteger } from '../../core/typescript-utils';

/**
 * Representing an database Id object. This should behave like an primitive.
 * The user expects to use the "=" operator to make copies. So, the content of an id should never be changed
 * afterward it was initialized.
 */
export class Id extends IdBase {

	/**
	 * @param value The raw-data of the shift-id or a negative new-item-id.
	 */
	public static create<T extends number>(value : NonZeroInteger<T>) : Id {
		return new Id(value);
	}

	protected constructor(value : Integer) {
		super(value);
	}
}
