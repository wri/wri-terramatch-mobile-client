import { debounce } from "lodash";

/**
 * Prevents rapid tapping on a view causing handler function to be run many times.
 * See https://css-tricks.com/debouncing-throttling-explained-examples/#article-header-id-1
 * @param func
 * @returns debounced function
 */
export default function debounceFunc(func) {
  return debounce(func, 1000, { leading: true, trailing: false });
}
