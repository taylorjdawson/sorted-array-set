"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSortedArraySet = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
/**
 * Creates a SortedArraySet.
 *
 * @param {SortedArraySetOptions<T>} options - The options for the SortedArraySet.
 * @returns {BehaviorSubject<T[]> & Object} - Returns a BehaviorSubject extended with methods for set operations.
 *
 * @example
 * ```typescript
 * const mySetObservable$ = createSortedArraySet<number>({
 *   sortFn: (a, b) => a - b,
 *   maxSize: 3,
 * });
 *
 * mySetObservable$.subscribe(sortedArray => {
 *   console.log('Sorted Array:', sortedArray);
 * });
 *
 * mySetObservable$.add(3);
 * mySetObservable$.add(1);
 * mySetObservable$.add(2);
 * mySetObservable$.add(4); // Will remove the smallest element (1) to maintain maxSize
 *
 * mySetObservable$.remove(2);
 *
 * console.log('Has 3:', mySetObservable$.has(3));
 *
 * mySetObservable$.getTopN(2).subscribe(topN => {
 *   console.log('Top 2:', topN);
 * });
 * ```
 */
function createSortedArraySet(options) {
    const { sortFn, maxSize } = options;
    const data$ = new rxjs_1.BehaviorSubject([]);
    // Create a read-only Observable that is returned to the user
    // This is to prevent calling `next` `complete` `error` on the subject
    // We want to use the provided methods for manipulating the sorted array set
    const observable$ = data$.asObservable();
    const uniqueElements = new Set();
    /**
     * Adds an element to the set.
     * Time complexity: O(n log n)
     * @param {T} element - The element to add.
     */
    const add = (element) => {
        if (element == null) {
            console.warn("Cannot add null or undefined to SortedArraySet");
            return;
        }
        if (!uniqueElements.has(element)) {
            uniqueElements.add(element);
            const currentData = data$.getValue();
            const newData = [...currentData, element];
            newData.sort(sortFn);
            // Enforce maxSize if specified
            if (maxSize !== undefined && newData.length > maxSize) {
                const lastElement = newData.pop();
                if (lastElement !== undefined) {
                    uniqueElements.delete(lastElement);
                }
            }
            data$.next(newData);
        }
    };
    /**
     * Removes an element from the set.
     * Time complexity: O(n log n)
     * @param {T} element - The element to remove.
     */
    const remove = (element) => {
        uniqueElements.delete(element);
        const currentData = data$.getValue();
        const newData = currentData.filter(e => e !== element);
        newData.sort(sortFn);
        data$.next(newData);
    };
    /**
     * Checks if an element exists in the set.
     * Time complexity: O(1)
     * @param {T} element - The element to check.
     * @returns {boolean} - Returns true if the element exists, false otherwise.
     */
    const has = (element) => {
        return uniqueElements.has(element);
    };
    /**
     * Retrieves the top N elements from the set.
     * Time complexity: O(k) where k is the number of elements to retrieve.
     * @param {number} n - The number of elements to retrieve.
     * @returns {Observable<T[]>} - Returns an Observable emitting the top N elements.
     */
    const getTopN = (n) => {
        return data$.pipe((0, operators_1.map)(data => data.slice(0, n)));
    };
    /**
     * This method clears all elements from the set and resets the BehaviorSubject.
     * It's useful for releasing resources and should be called when the set is no longer needed.
     * Time Complexity: O(1)
     *
     * @example
     * ```typescript
     * mySetObservable$.clear();
     * ```
     *
     * @returns {void}
     */
    const clear = () => {
        uniqueElements.clear();
        data$.next([]);
    };
    return Object.assign(observable$, {
        add,
        remove,
        has,
        getTopN,
    });
}
exports.createSortedArraySet = createSortedArraySet;
