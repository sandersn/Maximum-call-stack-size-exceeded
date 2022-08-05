import { ApiBase} from '@plano/shared/api';
import { ApiListWrapper } from '@plano/shared/api';

/**
 * A list class containing other api-lists.
 */
export class ApiLists<T> extends ApiListWrapper<T> {
	constructor(public override readonly api : ApiBase | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems);
	}

	public override createNewItem() : T {
		throw new Error('unsupported');
	}

	protected override wrapItem(_item : any, _generateMissingData : boolean) : T {
		throw new Error('unsupported');
	}

	/**
	 * @returns Does this list contains primitive items?
	 */
	protected containsPrimitives() : boolean {
		return false;
	}

	/**
	 * @returns Does this list contains id items?
	 */
	protected containsIds() : boolean {
		return false;
	}

	/**
	 * @returns The `dni` value of this list. See `common.txt`.
	 */
	protected get dni() : string {
		return '0';
	}

	/**
	 * @returns Creates and returns a new instance of this list.
	 */
	protected createInstance(removeDestroyedItems : boolean) : ApiLists<T> {
		return new ApiLists<T>(this.api, removeDestroyedItems);
	}
}
