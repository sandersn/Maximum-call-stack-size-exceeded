/**
 * @returns Transforms a normal promise to a `QueryablePromise`.
 */
export const makeQueryablePromise = (promise) => {
    // Set initial state
    let isPending = true;
    let isRejected = false;
    let isFulfilled = false;
    // Observe the promise, saving the fulfillment in a closure scope.
    const result = promise.then((v) => {
        isFulfilled = true;
        isPending = false;
        return v;
    }, (error) => {
        isRejected = true;
        isPending = false;
        throw error;
    });
    result.isFulfilled = () => { return isFulfilled; };
    result.isPending = () => { return isPending; };
    result.isRejected = () => { return isRejected; };
    return result;
};
//# sourceMappingURL=queryable-promise.js.map