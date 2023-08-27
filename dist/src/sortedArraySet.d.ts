import { Observable } from "rxjs";
/**
 * Options for creating a SortedArraySet.
 * @typedef {Object} SortedArraySetOptions
 * @property {(a: T, b: T) => number} sortFn - The sorting function.
 * @property {number} [maxSize] - Optional maximum size for the set.
 */
interface SortedArraySetOptions<T> {
    sortFn: (a: T, b: T) => number;
    maxSize?: number;
}
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
export declare function createSortedArraySet<T>(options: SortedArraySetOptions<T>): Observable<T[]> & {
    add: (element: T) => void;
    remove: (element: T) => void;
    has: (element: T) => boolean;
    getTopN: (n: number) => Observable<T[]>;
};
export {};
