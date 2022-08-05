/**
 * A promise whose state can be queried synchronously.
 */
export interface QueryablePromise<T> extends Promise<T> {

	/**
	 * Has the result successfully been fulfilled?
	 */
	isFulfilled() : boolean;

	/**
	 * Is the result pending?
	 */
	isPending() : boolean;

	/**
	 * Has there been an error and the result been rejected?
	 */
	isRejected() : boolean;
}

/**
 * @returns Transforms a normal promise to a `QueryablePromise`.
 */
export const makeQueryablePromise = <T>(promise : Promise<T>) : QueryablePromise<T> => {
	// Set initial state
	let isPending = true;
	let isRejected = false;
	let isFulfilled = false;

	// Observe the promise, saving the fulfillment in a closure scope.
	const result = promise.then(
		(v) => {
			isFulfilled = true;
			isPending = false;
			return v;
		},
		(error) => {
			isRejected = true;
			isPending = false;
			throw error;
		},
	) as QueryablePromise<T>;

	result.isFulfilled = () => { return isFulfilled; };
	result.isPending = () => { return isPending; };
	result.isRejected = () => { return isRejected; };

	return result;
};

