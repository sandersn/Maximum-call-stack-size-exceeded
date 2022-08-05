
import { CallByRef } from '@plano/shared/core/call-by-ref';
import { IdBase } from './id-base';

/**
 * Utility class to handle meta information send by REST APIs.
 * This is only used internally by the Api classes.
 */
export class Meta {

	/**
	 * @returns The the id of `array`. This returns `null` when there is no id available or when `array` is completely `null`.
	 */
	public static getId(array : any[] | null) : number | any[] | null {
		const meta = Meta.getMeta(array);

		if (meta === null)
			return null;

		// abbreviated id form?
		if (typeof meta === 'number')
			return meta;
		else if (Array.isArray(meta))
			return meta[0];
		else
			return null;
	}

	/**
	 * Sets a `newId` on `array`.
	 * @returns The value of `newId`. If it could not be set then `null` is returned.
	 */
	private static setId(array : any[], newId : any) : any {
		const meta = Meta.getMeta(array);

		if (meta === null)
			return null;

		// abbreviated id form?
		if (typeof meta === 'number')
			return array[0] = newId;
		else if (Array.isArray(meta))
			return meta[0] = newId;
		else
			return null;
	}

	/**
	 * @returns The meta object of `array`.
	 */
	public static getMeta(array : any[] | null) : any[] | number | boolean | null {
		if (Array.isArray(array)) {
			// short for for an object? see common.txt
			if (array[0] === undefined || array[0] === null)
				return 0;
			else
				return array[0];
		} else {
			return null;
		}
	}

	/**
	 * @returns Is `array` a list?
	 */
	public static isList(array : any[]) : boolean {
		const meta = Meta.getMeta(array);

		if (meta === null)
			return false;

		// abbreviated list form?
		if (typeof meta === 'boolean')
			return meta;
		else if (Array.isArray(meta))
			return meta[1] === true;
		else // else meta is a "number" which cannot be a list
			return false;
	}

	/**
	 * @returns Is `array` an object?
	 */
	public static isObject(array : any[]) : boolean {
		return (Meta.getMeta(array) !== null) && (!Meta.isList(array));
	}

	private static generateNewItemId() : number {
		// don’t increase this value or we exceed integer range
		return -(Math.floor(Math.random() * 999999999) + 1);
	}

	/**
	 * @returns Creates a new object and returns it.
	 */
	public static createNewObject(atomic : boolean, id : any = null) : any[] {
		// returns an object array with generated new-item id.
		// See api -> common.txt for more details.
		const newItemId = Meta.generateNewItemId();
		return [[id, false, atomic, (id ? null : newItemId)]];
	}

	/**
	 * Recursively iterates `dataToUpdate` to check for new-items and updates db-ids available in `newData`.
	 */
	public static updateNewItemDbIds(dataToUpdate : any[], newData : any[]) : void {
		if (!(Array.isArray(dataToUpdate) && Array.isArray(newData)))
			return;

		const isList = Meta.isList(dataToUpdate);
		const isObject = Meta.isObject(dataToUpdate);

		for (let i = 1; i < dataToUpdate.length; ++i) {
			const currItemData = dataToUpdate[i];

			if (isObject) {
				// continue recursively
				Meta.updateNewItemDbIds(currItemData, newData[i]);
			} else if (isList) {
				const id = Meta.getId(currItemData);
				const newItemId = Meta.getNewItemId(currItemData);

				// Find index of item in "newData"
				let indexOfNewData = Meta.indexOf(newData, id);

				if (indexOfNewData < 0)
					indexOfNewData = Meta.indexOfByNewItemId(newData, newItemId);

				// update db-id
				if (newItemId && indexOfNewData >= 0) {
					const databaseId = Meta.getId(newData[indexOfNewData]);
					currItemData[0][0] = databaseId;
				}

				// continue recursively
				Meta.updateNewItemDbIds(currItemData, newData[indexOfNewData]);
			}
		}
	}

	/**
	 * Removed the old id of the object and instead sets a new-item-id.
	 * Currently id replacement is not supported with items with new-item id.
	 * When it is a persisted object but without an id then we know that this object cannot be referenced
	 * from anywhere else. Thus, we do not need to do any replacement.
	 * When there is a
	 * @param saveOldId The old id is stored here.
	 * @returns Returns the set new-item-id. Returns `null` when no replacement has been done.
	 */
	private static replaceIdByNewItemId(data : any[], saveOldId : CallByRef<any>) : number | null {
		// currently only objects have an id.
		if (!Meta.isObject(data))
			return null;

		// Is this item not persisted yet? For some items api always sends Meta.getId(data) === null
		// (in this case it is fine to silently don’t do any id replacement).
		// And When a new item is saved it will keep its Meta.getNewItemId(data). So to be sure
		// we check for both.
		if (Meta.getNewItemId(data) && !Meta.getId(data))
			throw new Error('id replacement is currently not supported for not-persisted items.');

		// save old id
		const oldId = Meta.getId(data);

		if (!oldId)
			return null;

		saveOldId.val = oldId;

		// create a new object and copy the meta to the meta of the given object
		const newObject = Meta.createNewObject(Meta.isAtomic(data));
		data[0] = newObject[0];

		// return generated new-item-id
		return Meta.getNewItemId(data);
	}

	private static replaceIdsByNewItemIdsRecursive(data : any[], idReplacements : Map<any, number>, dontAddToIdReplacementList : any[]) : void {
		// replace id
		const oldId = new CallByRef<any>();
		const newItemId = Meta.replaceIdByNewItemId(data, oldId);

		// Add replacement to list?
		if (newItemId && !dontAddToIdReplacementList.includes(data)) {
			if (idReplacements.get(oldId.val))
				throw new Error(`Id "${oldId.val}" exists multiple times.`);

			idReplacements.set(oldId.val, newItemId);
		}

		// continue recursively
		for (let i = 1; i < data.length; ++i) {
			const child = data[i];
			if (Meta.isList(child) || Meta.isObject(child)) {
				Meta.replaceIdsByNewItemIdsRecursive(child, idReplacements, dontAddToIdReplacementList);
			}
		}
	}

	/**
	 * Replaces all ids by new-item-ids.
	 * @param data Data root for which id replacement should be done.
	 * @param dontAddToIdReplacementList A list of data items whose id replacements should not be added to the returned list. This is a not very nice solution
	 * to handle the problem that the api sometimes uses "fake" ids. E.g. SchedulingApiShiftModelAssignableMembers uses as id the id of the member.
	 * Those ids are not unique as they are also used by the members and they mess up the id replacement logic. So, they should be ignored.
	 * @returns Returns a map of all replaced ids (id -> new-item-id).
	 */
	public static replaceIdsByNewItemIds(data : any[], dontAddToIdReplacementList : any[]) : Map<any, number> {
		const idReplacements = new Map<any, number>();
		Meta.replaceIdsByNewItemIdsRecursive(data, idReplacements, dontAddToIdReplacementList);

		return idReplacements;
	}

	/**
	 *
	 * @param oldId Old id.
	 * @param idReplacements All the add replacements done.
	 * @returns Searches `idReplacements` for `oldId`. If it was replaced the new id will be returned. If it was not replaces `oldId` is returned.
	 */
	public static getReplacedId(oldId : any, idReplacements : Map<any, number>) : any {
		// old id was replaced?
		for (const key of idReplacements.keys()) {
			if (Meta.isSameId(oldId, key))
				return idReplacements.get(key);
		}

		// No replacement was found so return old id.
		return oldId;
	}

	/**
	 * @returns Creates a new list and returns it.
	 */
	public static createNewList() : any[] {
		return [true];
	}

	/**
	 * @returns Is `array` an atomic item?
	 */
	public static isAtomic(array : any[] | null) : boolean {
		const meta = Meta.getMeta(array);

		if (meta === null)
			return false;

		return Array.isArray(meta) && meta[2] === true;
	}

	/**
	 * @returns Returns the new-item-id of `array`. If it is not a new item then `null` is returned.
	 */
	public static getNewItemId(array : any[]) : number | null {
		const meta = Meta.getMeta(array);

		if (meta === null || !(Array.isArray(meta)) || meta[3] === undefined || meta[3] === null )
			return null;

		return meta[3];
	}

	/**
	 * @returns Finds in `array` the item with `newItemsId` and returns its index.
	 */
	public static indexOfByNewItemId(array : any[], newItemId : number | null) : number {
		if (newItemId === null)
			return -1;

		for (let i = 1; i < array.length; ++i) {
			if (Meta.getNewItemId(array[i]) === newItemId)
				return i;
		}

		return -1;
	}

	/**
	 * Checks if two ids are equal.
	 */
	public static isSameId(id1 : number | any[] | IdBase | null, id2 : number | any[] | IdBase | null) : boolean {
		id1 = id1 instanceof IdBase ? id1.rawData : id1;
		id2 = id2 instanceof IdBase ? id2.rawData : id2;

		if (Array.isArray(id1) && Array.isArray(id2)) {
			// do deep array comparison
			// We assume that the array only contains primitives, except first element which is meta which we can ignore.
			for (let i = 1; i < id1.length; ++i) {
				if (id1[i] !== id2[i])
					return false;
			}

			return id1.length === id2.length;
		} else {
			// Otherwise id just a primitive
			return id1 !== null && id1 === id2;
		}
	}

	/**
	 * Returns if given parameters are the same array by comparing id/new-item-id.
	 */
	public static checkIsSameArrayAndEnsureBackendId(array1 : any[], array2 : any[]) : boolean {
		// equal by newItemId?
		if (Meta.isSameId(Meta.getNewItemId(array1), Meta.getNewItemId(array2))) {
			// Then if backend id exist copy it to both arrays
			if (Meta.getId(array1)) {
				Meta.setId(array2, Meta.getId(array1));
			} else if (Meta.getId(array2)) {
				Meta.setId(array1, Meta.getId(array2));
			}

			return true;
		}

		// otherwise equal by backend id?
		return Meta.isSameId(Meta.getId(array1), Meta.getId(array2));
	}

	/**
	 * Iterates an array and returns the index of item which matches id.
	 * -1 is returned if the id could not be found.
	 */
	public static indexOf(array : any[], id : any) : number {
		for (let i = 1; i < array.length; ++i) {
			const element = array[i];

			if (Array.isArray(element) && Meta.isSameId(id, Meta.getId(element)))
				return i;
		}

		return -1;
	}

	/**
	 * Iterates an array and returns the item which matches id.
	 * null is returned if the id could not be found.
	 */
	public static find(array : any[], id : any) : any {
		const index = Meta.indexOf(array, id);
		return index >= 0 ? array[index] : null;
	}
}
