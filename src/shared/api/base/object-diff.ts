import * as $ from 'jquery';
import * as _ from 'underscore';
import { Integer } from './generated-types.ag';
import { Meta } from '..';

/**
 * The value being used in the diff to mark that data has not changed.
 */
export const NOT_CHANGED = '\uE000';

/**
 * Compares to objects. See scheduler.access/api/common.txt for information about the data structure.
 */
export class ObjectDiff {

	/**
	 * Calculates the diff of two arrays.
	 * @param orig original array
	 * @param curr current array
	 * @param onlyPath Optionally give a specific data path for which diff should be calculated.
	 * 	This is an array of indices from the array.
	 * @returns The diff object.
	 */
	public static diff(orig : any[] | null, curr : any[], onlyPath : Array<number> | null = null) : any[] | typeof NOT_CHANGED {
		// don’t modify the original onlyPath array.
		if (onlyPath)
			onlyPath = [...onlyPath];

		// calc diff
		if (!orig)
			return curr;
		else if (Meta.isObject(orig))
			return ObjectDiff.diffObject(orig, curr, onlyPath);
		else if (Meta.isList(orig))
			return ObjectDiff.diffList(orig, curr, onlyPath);
		else
			throw new Error(`Type could not be determined for: ${  JSON.stringify(orig)}`);
	}

	/**
	 * Merges an array with a to it belonging diff.
	 * 	@param orig original array. The result is stored here.
	 * 	@param diff diff with the same structure as the "orig" array
	 */
	public static merge(orig : any[], diff : any[] | typeof NOT_CHANGED) : void {
		if (diff === NOT_CHANGED)
			return;

		// calc merge
		if (Meta.isObject(orig))
			ObjectDiff.mergeObject(orig, diff);
		else if (Meta.isList(orig))
			ObjectDiff.mergeList(orig, diff);
		else
			throw new Error(`Type could not be determined for: ${  JSON.stringify(orig)}`);
	}

	/**
	 * @returns The diff between two "objects".
	 */
	// eslint-disable-next-line sonarjs/cognitive-complexity
	protected static diffObject(orig : any[] | null, curr : any[], onlyPath : Array<number> | null) : any[] | typeof NOT_CHANGED {
		// make sure structure is preserved even if "curr" is empty (rest of code only considers the data. not structure)
		if (!orig && curr.length === 1)
			return curr;

		// should diff be filtered by "onlyPath"?
		let onlyItemIndex : Integer | null = null;

		if (onlyPath) {
			onlyItemIndex = onlyPath[0];

			// remove first element
			onlyPath.shift();

			if (onlyPath.length === 0)
				onlyPath = null;
		}

		// calc diff
		let i; const diff = [];
		const atomic = Meta.isAtomic(curr);

		for (i = 1; i < curr.length; ++i) {
			// skip this item?
			if (onlyItemIndex !== null && i !== onlyItemIndex)
				continue;

			//
			// 	Check diff
			//
			const currElem = curr[i];

			const origElement = orig ? orig[i] : null;
			let diffElement : any[] | typeof NOT_CHANGED = NOT_CHANGED;

			// api sometimes send empty arrays (see e.g. shifts when data=calendar) Ignore these values.
			if (Array.isArray(currElem) && currElem.length === 0)
				continue;

			// list?
			if (Meta.isList(currElem)) {
				diffElement = ObjectDiff.diffList(origElement, currElem, onlyPath);
			} else if (Meta.isObject(currElem)) { // object?
				diffElement = ObjectDiff.diffObject(origElement, currElem, onlyPath);
			} else { // primitive type
				if (currElem !== origElement)
					diffElement = currElem;
			}

			// elem has changed?
			if (diffElement !== NOT_CHANGED) {
				if (atomic)
					return $.extend(true, [], curr); // We can return copy of whole object if it is atomic
				else
					diff[i] = diffElement; // add elem to diff
			}
		}

		// return result
		if ($.isEmptyObject(diff)) {
			return NOT_CHANGED;
		} else {
			// add meta (meta is read-only so no need to copy it)
			diff[0] = curr[0];

			// javascript has automatically added "undefined" for the values which have not changed.
			// Convert them to NOT_CHANGED
			for (i = 1; i < diff.length; ++i) {
				if (diff[i] === undefined)
					diff[i] = NOT_CHANGED;
			}

			return diff;
		}
	}

	/**
	 * Merges `diff` into `orig`.
	 */
	protected static mergeObject(orig : any[], diff : any[]) : void {
		for (let i = 1; i < diff.length; ++i) {
			// nothing changed?
			const diffElement = diff[i];

			if (diffElement === NOT_CHANGED)
				continue;

			// merge…
			if (orig[i] === null) {
				// Then there is no "orig" value we can just take the new value
				orig[i] = this.diffToNormalFormat(diffElement);
			} else if (Meta.isList(diffElement) || Meta.isObject(diffElement)) { // list/object?
				ObjectDiff.merge(orig[i], diffElement);
			} else { // primitive type
				orig[i] = diffElement;
			}
		}
	}

	/**
	 * @returns The diff between two "lists".
	 */
	// eslint-disable-next-line max-statements, sonarjs/cognitive-complexity
	protected static diffList(orig : any[] | null, curr : any[], onlyPath : Array<number> | null) : any[]| typeof NOT_CHANGED {
		let i; let j; let currElem; let origElement; let isList; let isObject;

		// make sure structure is preserved even if "curr" is empty (rest of code only considers the data. not structure)
		if (!orig && curr.length === 1)
			return curr;

		// is the whole list atomic and it has changed?
		if (Meta.isAtomic(curr) && !_.isEqual(orig, curr)) {
			// add meta (meta is read-only so no need to copy it)
			const diff = [];
			diff[0] = curr[0];

			diff[1] = curr.slice(1);

			if (orig)
				diff[2] = orig.slice(1);

			return diff;
		}

		// check for added/updated elements in curr
		const diffUpdated = [];

		for (i = 1; i < curr.length; ++i) {
			currElem = curr[i];
			isList = Meta.isList(currElem);
			isObject = Meta.isObject(currElem);
			let foundCurrElem = false;
			const atomic = Meta.isAtomic(currElem);


			if (orig) {
				// does currElem exist in orig data. If so, handle diff process
				for (j = 1; j < orig.length; ++j) {
					origElement = orig[j];

					if (atomic) { // Atomic has priority over next conditions
						if (_.isEqual(currElem, origElement)) {
							foundCurrElem = true;
							break;
						}
					} else if (isList || isObject) {
						// found current elem?
						if (Meta.checkIsSameArrayAndEnsureBackendId(currElem, origElement)) {
							// add diff of objects
							const diffElement = this.diff(origElement, currElem, onlyPath);

							// eslint-disable-next-line max-depth
							if (diffElement !== NOT_CHANGED)
								diffUpdated.push(diffElement);

							foundCurrElem = true;
							break;
						}
					} else { // otherwise primitive type
						if (currElem === origElement) {
							foundCurrElem = true;
							break;
						}
					}
				}
			}

			// is currElem a new elem?
			if (!foundCurrElem) {
				if (isList || isObject) {
					// Even this is a new item backend's deserialization process expects a diff.
					// So, we store a diff to an empty item.
					let emptyItem;

					if (isList)
						emptyItem = [true];
					else
						emptyItem = [Meta.getMeta(currElem)];

					let _diff = this.diff(emptyItem, currElem, onlyPath);

					// if the array only consists of meta data (see for example selectedShiftIds for assignmentProcesses)
					// then diff is NOT_CHANGED now. But we still want to send the meta information of the new added object

					if (!isList && _diff === NOT_CHANGED)
						_diff = emptyItem;

					diffUpdated.push(_diff);

				} else { // primitive type
					diffUpdated.push(currElem);
				}
			}
		}

		// check for removed elements
		const diffRemoved = [];


		if (orig) {
			for (i = 1; i < orig.length; ++i) {
				origElement = orig[i];
				isList = Meta.isList(origElement);
				isObject = Meta.isObject(origElement);
				let foundOrigElement = false;
				const atomic = Meta.isAtomic(origElement);

				for (j = 1; j < curr.length; ++j) {
					currElem = curr[j];

					if (atomic) { // Atomic has priority over next conditions
						if (_.isEqual(currElem, origElement)) {
							foundOrigElement = true;
							break;
						}
					} else if (isList || isObject) {
						if (Meta.checkIsSameArrayAndEnsureBackendId(currElem, origElement)) {
							foundOrigElement = true;
							break;
						}
					} else { // primitive type
						if (currElem === origElement) {
							foundOrigElement = true;
							break;
						}
					}
				}

				// origElem was removed?
				if (!foundOrigElement)
					diffRemoved.push((!atomic && (isList || isObject)) ? Meta.getId(origElement) : origElement);
			}
		}

		// return results
		const diff = [];

		if (diffUpdated.length > 0)
			diff[1] = diffUpdated;

		if (diffRemoved.length > 0)
			diff[2] = diffRemoved;

		if ($.isEmptyObject(diff)) {
			return NOT_CHANGED;
		} else {
			// add meta (meta is read-only so no need to copy it)
			diff[0] = curr[0];
			return diff;
		}
	}

	/**
	 * Converts some data in diff format to normal format. This method returns a copy of the data.
	 * This method assumes that the data in diff format does not contain any removed elements.
	 */
	protected static diffToNormalFormat(data : any) : any {
		// Just a primitive
		if (!Array.isArray(data))
			return data;

		// A atomic object is not being changed in diffs. See api/common.txt
		if (Meta.isAtomic(data))
			return $.extend(true, [], data);

		//
		// Complex object
		//
		const result = [data[0]];

		for (let i = 1; i < data.length; ++i) {
			const curr = data[i];

			if (curr === NOT_CHANGED) {
				continue;
			} else if (Meta.isObject(curr)) {
				result[i] = ObjectDiff.diffToNormalFormat(curr);
			} else if (Meta.isList(curr)) {
				const list = [curr[0]];

				// added/modified elements
				const addedModifiedElements = curr[1];

				if (addedModifiedElements) {
					for (const addedModifiedElement of addedModifiedElements) {
						list.push(ObjectDiff.diffToNormalFormat(addedModifiedElement));
					}
				}

				result[i] = list;

				// removed elements
				if (!!curr[2])
					throw new Error('diffToNormalFormat() expects data not contain removed elements.');
			} else { // otherwise it is a primitive
				result[i] = curr;
			}
		}

		return result;
	}

	/**
	 * Merges `diff` into `orig`.
	 */
	// eslint-disable-next-line sonarjs/cognitive-complexity
	protected static mergeList(orig : any[], diff : any[]) : void {
		let i; let j; let isList; let isObject;

		const origLength = orig.length;

		// merge changed/added elements
		const diffUpdated = diff[1];

		if (diffUpdated) {
			for (i = 0; i < diffUpdated.length; ++i) {
				const updatedElement = diffUpdated[i];
				isList = Meta.isList(updatedElement);
				isObject = Meta.isObject(updatedElement);
				const atomic = Meta.isAtomic(updatedElement);

				if (!atomic && (isList || isObject)) {
					// search for existing elem to merge with
					let foundElement = false;
					for (j = 1; j < origLength; ++j) {
						if (Meta.checkIsSameArrayAndEnsureBackendId(orig[j], updatedElement)) {
							// then merge them
							ObjectDiff.merge(orig[j], updatedElement);
							foundElement = true;
						}
					}

					// new elem?
					if (!foundElement) {
						// updatedElem is in diff format. We need to convert it to "normal" format.
						// Then we can add it to the original data
						orig.push(ObjectDiff.diffToNormalFormat(updatedElement));
					}
				} else { // primitive/atomic type
					// Then it has to be new elem
					orig.push(updatedElement);
				}
			}
		}

		// merge removed elements
		const diffRemoved = diff[2];

		if (diffRemoved) {
			for (i = 0; i < diffRemoved.length; ++i) {
				const removedElement = diffRemoved[i];

				// we don’t know if removedElem is an id or the element itself. So in order to find out the type (list/object)
				// we instead look at the elements in the orig array
				if (origLength <= 1)
					break;

				isList = Meta.isList(orig[1]);
				isObject = Meta.isObject(orig[1]);
				const atomic = Meta.isAtomic(orig[1]);

				for (j = origLength - 1; j > 0; --j) {
					// Is this the elem to be removed?
					let removeThis;

					if (atomic) {
						removeThis = _.isEqual(orig[j], removedElement);
					} else if (isList || isObject) {
						const removedElementId = removedElement; // removedElem is in this case the id
						removeThis = Meta.isSameId(Meta.getId(orig[j]), removedElementId);
					} else { // primitive type
						removeThis = (orig[j] === removedElement);
					}

					// remove it
					if (removeThis) {
						orig.splice(j, 1);
						break;
					}
				}
			}
		}
	}
}
