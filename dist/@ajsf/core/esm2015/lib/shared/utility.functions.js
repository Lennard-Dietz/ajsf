/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { hasValue, inArray, isArray, isDefined, isEmpty, isMap, isObject, isSet, isString } from './validator.functions';
/**
 * Utility function library:
 *
 * addClasses, copy, forEach, forEachCopy, hasOwn, mergeFilteredObject,
 * uniqueItems, commonItems, fixTitle, toTitleCase
*/
/**
 * 'addClasses' function
 *
 * Merges two space-delimited lists of CSS classes and removes duplicates.
 *
 * // {string | string[] | Set<string>} oldClasses
 * // {string | string[] | Set<string>} newClasses
 * // {string | string[] | Set<string>} - Combined classes
 * @param {?} oldClasses
 * @param {?} newClasses
 * @return {?}
 */
export function addClasses(oldClasses, newClasses) {
    /** @type {?} */
    const badType = (/**
     * @param {?} i
     * @return {?}
     */
    i => !isSet(i) && !isArray(i) && !isString(i));
    if (badType(newClasses)) {
        return oldClasses;
    }
    if (badType(oldClasses)) {
        oldClasses = '';
    }
    /** @type {?} */
    const toSet = (/**
     * @param {?} i
     * @return {?}
     */
    i => isSet(i) ? i : isArray(i) ? new Set(i) : new Set(i.split(' ')));
    /** @type {?} */
    const combinedSet = toSet(oldClasses);
    /** @type {?} */
    const newSet = toSet(newClasses);
    newSet.forEach((/**
     * @param {?} c
     * @return {?}
     */
    c => combinedSet.add(c)));
    if (isSet(oldClasses)) {
        return combinedSet;
    }
    if (isArray(oldClasses)) {
        return Array.from(combinedSet);
    }
    return Array.from(combinedSet).join(' ');
}
/**
 * 'copy' function
 *
 * Makes a shallow copy of a JavaScript object, array, Map, or Set.
 * If passed a JavaScript primitive value (string, number, boolean, or null),
 * it returns the value.
 *
 * // {Object|Array|string|number|boolean|null} object - The object to copy
 * // {boolean = false} errors - Show errors?
 * // {Object|Array|string|number|boolean|null} - The copied object
 * @param {?} object
 * @param {?=} errors
 * @return {?}
 */
export function copy(object, errors = false) {
    if (typeof object !== 'object' || object === null) {
        return object;
    }
    if (isMap(object)) {
        return new Map(object);
    }
    if (isSet(object)) {
        return new Set(object);
    }
    if (isArray(object)) {
        return [...object];
    }
    if (isObject(object)) {
        return Object.assign({}, object);
    }
    if (errors) {
        console.error('copy error: Object to copy must be a JavaScript object or value.');
    }
    return object;
}
/**
 * 'forEach' function
 *
 * Iterates over all items in the first level of an object or array
 * and calls an iterator funciton on each item.
 *
 * The iterator function is called with four values:
 * 1. The current item's value
 * 2. The current item's key
 * 3. The parent object, which contains the current item
 * 4. The root object
 *
 * Setting the optional third parameter to 'top-down' or 'bottom-up' will cause
 * it to also recursively iterate over items in sub-objects or sub-arrays in the
 * specified direction.
 *
 * // {Object|Array} object - The object or array to iterate over
 * // {function} fn - the iterator funciton to call on each item
 * // {boolean = false} errors - Show errors?
 * // {void}
 * @param {?} object
 * @param {?} fn
 * @param {?=} recurse
 * @param {?=} rootObject
 * @param {?=} errors
 * @return {?}
 */
export function forEach(object, fn, recurse = false, rootObject = object, errors = false) {
    if (isEmpty(object)) {
        return;
    }
    if ((isObject(object) || isArray(object)) && typeof fn === 'function') {
        for (const key of Object.keys(object)) {
            /** @type {?} */
            const value = object[key];
            if (recurse === 'bottom-up' && (isObject(value) || isArray(value))) {
                forEach(value, fn, recurse, rootObject);
            }
            fn(value, key, object, rootObject);
            if (recurse === 'top-down' && (isObject(value) || isArray(value))) {
                forEach(value, fn, recurse, rootObject);
            }
        }
    }
    if (errors) {
        if (typeof fn !== 'function') {
            console.error('forEach error: Iterator must be a function.');
            console.error('function', fn);
        }
        if (!isObject(object) && !isArray(object)) {
            console.error('forEach error: Input object must be an object or array.');
            console.error('object', object);
        }
    }
}
/**
 * 'forEachCopy' function
 *
 * Iterates over all items in the first level of an object or array
 * and calls an iterator function on each item. Returns a new object or array
 * with the same keys or indexes as the original, and values set to the results
 * of the iterator function.
 *
 * Does NOT recursively iterate over items in sub-objects or sub-arrays.
 *
 * // {Object | Array} object - The object or array to iterate over
 * // {function} fn - The iterator funciton to call on each item
 * // {boolean = false} errors - Show errors?
 * // {Object | Array} - The resulting object or array
 * @param {?} object
 * @param {?} fn
 * @param {?=} errors
 * @return {?}
 */
export function forEachCopy(object, fn, errors = false) {
    if (!hasValue(object)) {
        return;
    }
    if ((isObject(object) || isArray(object)) && typeof object !== 'function') {
        /** @type {?} */
        const newObject = isArray(object) ? [] : {};
        for (const key of Object.keys(object)) {
            newObject[key] = fn(object[key], key, object);
        }
        return newObject;
    }
    if (errors) {
        if (typeof fn !== 'function') {
            console.error('forEachCopy error: Iterator must be a function.');
            console.error('function', fn);
        }
        if (!isObject(object) && !isArray(object)) {
            console.error('forEachCopy error: Input object must be an object or array.');
            console.error('object', object);
        }
    }
}
/**
 * 'hasOwn' utility function
 *
 * Checks whether an object or array has a particular property.
 *
 * // {any} object - the object to check
 * // {string} property - the property to look for
 * // {boolean} - true if object has property, false if not
 * @param {?} object
 * @param {?} property
 * @return {?}
 */
export function hasOwn(object, property) {
    if (!object || !['number', 'string', 'symbol'].includes(typeof property) ||
        (!isObject(object) && !isArray(object) && !isMap(object) && !isSet(object))) {
        return false;
    }
    if (isMap(object) || isSet(object)) {
        return object.has(property);
    }
    if (typeof property === 'number') {
        if (isArray(object)) {
            return object[(/** @type {?} */ (property))];
        }
        property = property + '';
    }
    return object.hasOwnProperty(property);
}
/** @enum {number} */
const ExpressionType = {
    EQUALS: 0,
    NOT_EQUALS: 1,
    NOT_AN_EXPRESSION: 2,
};
export { ExpressionType };
ExpressionType[ExpressionType.EQUALS] = 'EQUALS';
ExpressionType[ExpressionType.NOT_EQUALS] = 'NOT_EQUALS';
ExpressionType[ExpressionType.NOT_AN_EXPRESSION] = 'NOT_AN_EXPRESSION';
/**
 * Detects the type of expression from the given candidate. `==` for equals,
 * `!=` for not equals. If none of these are contained in the candidate, the candidate
 * is not considered to be an expression at all and thus `NOT_AN_EXPRESSION` is returned.
 * // {expressionCandidate} expressionCandidate - potential expression
 * @param {?} expressionCandidate
 * @return {?}
 */
export function getExpressionType(expressionCandidate) {
    if (expressionCandidate.indexOf('==') !== -1) {
        return ExpressionType.EQUALS;
    }
    if (expressionCandidate.toString().indexOf('!=') !== -1) {
        return ExpressionType.NOT_EQUALS;
    }
    return ExpressionType.NOT_AN_EXPRESSION;
}
/**
 * @param {?} expressionType
 * @return {?}
 */
export function isEqual(expressionType) {
    return (/** @type {?} */ (expressionType)) === ExpressionType.EQUALS;
}
/**
 * @param {?} expressionType
 * @return {?}
 */
export function isNotEqual(expressionType) {
    return (/** @type {?} */ (expressionType)) === ExpressionType.NOT_EQUALS;
}
/**
 * @param {?} expressionType
 * @return {?}
 */
export function isNotExpression(expressionType) {
    return (/** @type {?} */ (expressionType)) === ExpressionType.NOT_AN_EXPRESSION;
}
/**
 * Splits the expression key by the expressionType on a pair of values
 * before and after the equals or nor equals sign.
 * // {expressionType} enum of an expression type
 * // {key} the given key from a for loop iver all conditions
 * @param {?} expressionType
 * @param {?} key
 * @return {?}
 */
export function getKeyAndValueByExpressionType(expressionType, key) {
    if (isEqual(expressionType)) {
        return key.split('==', 2);
    }
    if (isNotEqual(expressionType)) {
        return key.split('!=', 2);
    }
    return null;
}
/**
 * @param {?} keyAndValue
 * @return {?}
 */
export function cleanValueOfQuotes(keyAndValue) {
    if (keyAndValue.charAt(0) === '\'' && keyAndValue.charAt(keyAndValue.length - 1) === '\'') {
        return keyAndValue.replace('\'', '').replace('\'', '');
    }
    return keyAndValue;
}
/**
 * 'mergeFilteredObject' utility function
 *
 * Shallowly merges two objects, setting key and values from source object
 * in target object, excluding specified keys.
 *
 * Optionally, it can also use functions to transform the key names and/or
 * the values of the merging object.
 *
 * // {PlainObject} targetObject - Target object to add keys and values to
 * // {PlainObject} sourceObject - Source object to copy keys and values from
 * // {string[]} excludeKeys - Array of keys to exclude
 * // {(string: string) => string = (k) => k} keyFn - Function to apply to keys
 * // {(any: any) => any = (v) => v} valueFn - Function to apply to values
 * // {PlainObject} - Returns targetObject
 * @param {?} targetObject
 * @param {?} sourceObject
 * @param {?=} excludeKeys
 * @param {?=} keyFn
 * @param {?=} valFn
 * @return {?}
 */
export function mergeFilteredObject(targetObject, sourceObject, excludeKeys = (/** @type {?} */ ([])), keyFn = (/**
 * @param {?} key
 * @return {?}
 */
(key) => key), valFn = (/**
 * @param {?} val
 * @return {?}
 */
(val) => val)) {
    if (!isObject(sourceObject)) {
        return targetObject;
    }
    if (!isObject(targetObject)) {
        targetObject = {};
    }
    for (const key of Object.keys(sourceObject)) {
        if (!inArray(key, excludeKeys) && isDefined(sourceObject[key])) {
            targetObject[keyFn(key)] = valFn(sourceObject[key]);
        }
    }
    return targetObject;
}
/**
 * 'uniqueItems' function
 *
 * Accepts any number of string value inputs,
 * and returns an array of all input vaues, excluding duplicates.
 *
 * // {...string} ...items -
 * // {string[]} -
 * @param {...?} items
 * @return {?}
 */
export function uniqueItems(...items) {
    /** @type {?} */
    const returnItems = [];
    for (const item of items) {
        if (!returnItems.includes(item)) {
            returnItems.push(item);
        }
    }
    return returnItems;
}
/**
 * 'commonItems' function
 *
 * Accepts any number of strings or arrays of string values,
 * and returns a single array containing only values present in all inputs.
 *
 * // {...string|string[]} ...arrays -
 * // {string[]} -
 * @param {...?} arrays
 * @return {?}
 */
export function commonItems(...arrays) {
    /** @type {?} */
    let returnItems = null;
    for (let array of arrays) {
        if (isString(array)) {
            array = [array];
        }
        returnItems = returnItems === null ? [...array] :
            returnItems.filter((/**
             * @param {?} item
             * @return {?}
             */
            item => array.includes(item)));
        if (!returnItems.length) {
            return [];
        }
    }
    return returnItems;
}
/**
 * 'fixTitle' function
 *
 *
 * // {string} input -
 * // {string} -
 * @param {?} name
 * @return {?}
 */
export function fixTitle(name) {
    return name && toTitleCase(name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' '));
}
/**
 * 'toTitleCase' function
 *
 * Intelligently converts an input string to Title Case.
 *
 * Accepts an optional second parameter with a list of additional
 * words and abbreviations to force into a particular case.
 *
 * This function is built on prior work by John Gruber and David Gouch:
 * http://daringfireball.net/2008/08/title_case_update
 * https://github.com/gouch/to-title-case
 *
 * // {string} input -
 * // {string|string[]} forceWords? -
 * // {string} -
 * @param {?} input
 * @param {?=} forceWords
 * @return {?}
 */
export function toTitleCase(input, forceWords) {
    if (!isString(input)) {
        return input;
    }
    /** @type {?} */
    let forceArray = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'en',
        'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'per', 'the', 'to', 'v', 'v.',
        'vs', 'vs.', 'via'];
    if (isString(forceWords)) {
        forceWords = ((/** @type {?} */ (forceWords))).split('|');
    }
    if (isArray(forceWords)) {
        forceArray = forceArray.concat(forceWords);
    }
    /** @type {?} */
    const forceArrayLower = forceArray.map((/**
     * @param {?} w
     * @return {?}
     */
    w => w.toLowerCase()));
    /** @type {?} */
    const noInitialCase = input === input.toUpperCase() || input === input.toLowerCase();
    /** @type {?} */
    let prevLastChar = '';
    input = input.trim();
    return input.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, (/**
     * @param {?} word
     * @param {?} idx
     * @return {?}
     */
    (word, idx) => {
        if (!noInitialCase && word.slice(1).search(/[A-Z]|\../) !== -1) {
            return word;
        }
        else {
            /** @type {?} */
            let newWord;
            /** @type {?} */
            const forceWord = forceArray[forceArrayLower.indexOf(word.toLowerCase())];
            if (!forceWord) {
                if (noInitialCase) {
                    if (word.slice(1).search(/\../) !== -1) {
                        newWord = word.toLowerCase();
                    }
                    else {
                        newWord = word[0].toUpperCase() + word.slice(1).toLowerCase();
                    }
                }
                else {
                    newWord = word[0].toUpperCase() + word.slice(1);
                }
            }
            else if (forceWord === forceWord.toLowerCase() && (idx === 0 || idx + word.length === input.length ||
                prevLastChar === ':' || input[idx - 1].search(/[^\s-]/) !== -1 ||
                (input[idx - 1] !== '-' && input[idx + word.length] === '-'))) {
                newWord = forceWord[0].toUpperCase() + forceWord.slice(1);
            }
            else {
                newWord = forceWord;
            }
            prevLastChar = word.slice(-1);
            return newWord;
        }
    }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbGl0eS5mdW5jdGlvbnMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWpzZi9jb3JlLyIsInNvdXJjZXMiOlsibGliL3NoYXJlZC91dGlsaXR5LmZ1bmN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFjLE1BQU0sdUJBQXVCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQnBJLE1BQU0sVUFBVSxVQUFVLENBQ3hCLFVBQTJDLEVBQzNDLFVBQTJDOztVQUVyQyxPQUFPOzs7O0lBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUM3RCxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUFFLE9BQU8sVUFBVSxDQUFDO0tBQUU7SUFDL0MsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxVQUFVLEdBQUcsRUFBRSxDQUFDO0tBQUU7O1VBQ3ZDLEtBQUs7Ozs7SUFBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7O1VBQzNFLFdBQVcsR0FBYSxLQUFLLENBQUMsVUFBVSxDQUFDOztVQUN6QyxNQUFNLEdBQWEsS0FBSyxDQUFDLFVBQVUsQ0FBQztJQUMxQyxNQUFN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LEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLE9BQU8sT0FBTyxDQUFDO1NBQ2hCO0lBQ0gsQ0FBQyxFQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtoYXNWYWx1ZSwgaW5BcnJheSwgaXNBcnJheSwgaXNEZWZpbmVkLCBpc0VtcHR5LCBpc01hcCwgaXNPYmplY3QsIGlzU2V0LCBpc1N0cmluZywgUGxhaW5PYmplY3R9IGZyb20gJy4vdmFsaWRhdG9yLmZ1bmN0aW9ucyc7XG5cbi8qKlxuICogVXRpbGl0eSBmdW5jdGlvbiBsaWJyYXJ5OlxuICpcbiAqIGFkZENsYXNzZXMsIGNvcHksIGZvckVhY2gsIGZvckVhY2hDb3B5LCBoYXNPd24sIG1lcmdlRmlsdGVyZWRPYmplY3QsXG4gKiB1bmlxdWVJdGVtcywgY29tbW9uSXRlbXMsIGZpeFRpdGxlLCB0b1RpdGxlQ2FzZVxuKi9cblxuLyoqXG4gKiAnYWRkQ2xhc3NlcycgZnVuY3Rpb25cbiAqXG4gKiBNZXJnZXMgdHdvIHNwYWNlLWRlbGltaXRlZCBsaXN0cyBvZiBDU1MgY2xhc3NlcyBhbmQgcmVtb3ZlcyBkdXBsaWNhdGVzLlxuICpcbiAqIC8vIHtzdHJpbmcgfCBzdHJpbmdbXSB8IFNldDxzdHJpbmc+fSBvbGRDbGFzc2VzXG4gKiAvLyB7c3RyaW5nIHwgc3RyaW5nW10gfCBTZXQ8c3RyaW5nPn0gbmV3Q2xhc3Nlc1xuICogLy8ge3N0cmluZyB8IHN0cmluZ1tdIHwgU2V0PHN0cmluZz59IC0gQ29tYmluZWQgY2xhc3Nlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkQ2xhc3NlcyhcbiAgb2xkQ2xhc3Nlczogc3RyaW5nIHwgc3RyaW5nW10gfCBTZXQ8c3RyaW5nPixcbiAgbmV3Q2xhc3Nlczogc3RyaW5nIHwgc3RyaW5nW10gfCBTZXQ8c3RyaW5nPlxuKTogc3RyaW5nIHwgc3RyaW5nW10gfCBTZXQ8c3RyaW5nPiB7XG4gIGNvbnN0IGJhZFR5cGUgPSBpID0+ICFpc1NldChpKSAmJiAhaXNBcnJheShpKSAmJiAhaXNTdHJpbmcoaSk7XG4gIGlmIChiYWRUeXBlKG5ld0NsYXNzZXMpKSB7IHJldHVybiBvbGRDbGFzc2VzOyB9XG4gIGlmIChiYWRUeXBlKG9sZENsYXNzZXMpKSB7IG9sZENsYXNzZXMgPSAnJzsgfVxuICBjb25zdCB0b1NldCA9IGkgPT4gaXNTZXQoaSkgPyBpIDogaXNBcnJheShpKSA/IG5ldyBTZXQoaSkgOiBuZXcgU2V0KGkuc3BsaXQoJyAnKSk7XG4gIGNvbnN0IGNvbWJpbmVkU2V0OiBTZXQ8YW55PiA9IHRvU2V0KG9sZENsYXNzZXMpO1xuICBjb25zdCBuZXdTZXQ6IFNldDxhbnk+ID0gdG9TZXQobmV3Q2xhc3Nlcyk7XG4gIG5ld1NldC5mb3JFYWNoKGMgPT4gY29tYmluZWRTZXQuYWRkKGMpKTtcbiAgaWYgKGlzU2V0KG9sZENsYXNzZXMpKSB7IHJldHVybiBjb21iaW5lZFNldDsgfVxuICBpZiAoaXNBcnJheShvbGRDbGFzc2VzKSkgeyByZXR1cm4gQXJyYXkuZnJvbShjb21iaW5lZFNldCk7IH1cbiAgcmV0dXJuIEFycmF5LmZyb20oY29tYmluZWRTZXQpLmpvaW4oJyAnKTtcbn1cblxuLyoqXG4gKiAnY29weScgZnVuY3Rpb25cbiAqXG4gKiBNYWtlcyBhIHNoYWxsb3cgY29weSBvZiBhIEphdmFTY3JpcHQgb2JqZWN0LCBhcnJheSwgTWFwLCBvciBTZXQuXG4gKiBJZiBwYXNzZWQgYSBKYXZhU2NyaXB0IHByaW1pdGl2ZSB2YWx1ZSAoc3RyaW5nLCBudW1iZXIsIGJvb2xlYW4sIG9yIG51bGwpLFxuICogaXQgcmV0dXJucyB0aGUgdmFsdWUuXG4gKlxuICogLy8ge09iamVjdHxBcnJheXxzdHJpbmd8bnVtYmVyfGJvb2xlYW58bnVsbH0gb2JqZWN0IC0gVGhlIG9iamVjdCB0byBjb3B5XG4gKiAvLyB7Ym9vbGVhbiA9IGZhbHNlfSBlcnJvcnMgLSBTaG93IGVycm9ycz9cbiAqIC8vIHtPYmplY3R8QXJyYXl8c3RyaW5nfG51bWJlcnxib29sZWFufG51bGx9IC0gVGhlIGNvcGllZCBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvcHkob2JqZWN0OiBhbnksIGVycm9ycyA9IGZhbHNlKTogYW55IHtcbiAgaWYgKHR5cGVvZiBvYmplY3QgIT09ICdvYmplY3QnIHx8IG9iamVjdCA9PT0gbnVsbCkgeyByZXR1cm4gb2JqZWN0OyB9XG4gIGlmIChpc01hcChvYmplY3QpKSAgICB7IHJldHVybiBuZXcgTWFwKG9iamVjdCk7IH1cbiAgaWYgKGlzU2V0KG9iamVjdCkpICAgIHsgcmV0dXJuIG5ldyBTZXQob2JqZWN0KTsgfVxuICBpZiAoaXNBcnJheShvYmplY3QpKSAgeyByZXR1cm4gWyAuLi5vYmplY3QgXTsgICB9XG4gIGlmIChpc09iamVjdChvYmplY3QpKSB7IHJldHVybiB7IC4uLm9iamVjdCB9OyAgIH1cbiAgaWYgKGVycm9ycykge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2NvcHkgZXJyb3I6IE9iamVjdCB0byBjb3B5IG11c3QgYmUgYSBKYXZhU2NyaXB0IG9iamVjdCBvciB2YWx1ZS4nKTtcbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG4vKipcbiAqICdmb3JFYWNoJyBmdW5jdGlvblxuICpcbiAqIEl0ZXJhdGVzIG92ZXIgYWxsIGl0ZW1zIGluIHRoZSBmaXJzdCBsZXZlbCBvZiBhbiBvYmplY3Qgb3IgYXJyYXlcbiAqIGFuZCBjYWxscyBhbiBpdGVyYXRvciBmdW5jaXRvbiBvbiBlYWNoIGl0ZW0uXG4gKlxuICogVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGZvdXIgdmFsdWVzOlxuICogMS4gVGhlIGN1cnJlbnQgaXRlbSdzIHZhbHVlXG4gKiAyLiBUaGUgY3VycmVudCBpdGVtJ3Mga2V5XG4gKiAzLiBUaGUgcGFyZW50IG9iamVjdCwgd2hpY2ggY29udGFpbnMgdGhlIGN1cnJlbnQgaXRlbVxuICogNC4gVGhlIHJvb3Qgb2JqZWN0XG4gKlxuICogU2V0dGluZyB0aGUgb3B0aW9uYWwgdGhpcmQgcGFyYW1ldGVyIHRvICd0b3AtZG93bicgb3IgJ2JvdHRvbS11cCcgd2lsbCBjYXVzZVxuICogaXQgdG8gYWxzbyByZWN1cnNpdmVseSBpdGVyYXRlIG92ZXIgaXRlbXMgaW4gc3ViLW9iamVjdHMgb3Igc3ViLWFycmF5cyBpbiB0aGVcbiAqIHNwZWNpZmllZCBkaXJlY3Rpb24uXG4gKlxuICogLy8ge09iamVjdHxBcnJheX0gb2JqZWN0IC0gVGhlIG9iamVjdCBvciBhcnJheSB0byBpdGVyYXRlIG92ZXJcbiAqIC8vIHtmdW5jdGlvbn0gZm4gLSB0aGUgaXRlcmF0b3IgZnVuY2l0b24gdG8gY2FsbCBvbiBlYWNoIGl0ZW1cbiAqIC8vIHtib29sZWFuID0gZmFsc2V9IGVycm9ycyAtIFNob3cgZXJyb3JzP1xuICogLy8ge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JFYWNoKFxuICBvYmplY3Q6IGFueSwgZm46ICh2OiBhbnksIGs/OiBzdHJpbmcgfCBudW1iZXIsIGM/OiBhbnksIHJjPzogYW55KSA9PiBhbnksXG4gIHJlY3Vyc2U6IGJvb2xlYW4gfCBzdHJpbmcgPSBmYWxzZSwgcm9vdE9iamVjdDogYW55ID0gb2JqZWN0LCBlcnJvcnMgPSBmYWxzZVxuKTogdm9pZCB7XG4gIGlmIChpc0VtcHR5KG9iamVjdCkpIHsgcmV0dXJuOyB9XG4gIGlmICgoaXNPYmplY3Qob2JqZWN0KSB8fCBpc0FycmF5KG9iamVjdCkpICYmIHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKG9iamVjdCkpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gb2JqZWN0W2tleV07XG4gICAgICBpZiAocmVjdXJzZSA9PT0gJ2JvdHRvbS11cCcgJiYgKGlzT2JqZWN0KHZhbHVlKSB8fCBpc0FycmF5KHZhbHVlKSkpIHtcbiAgICAgICAgZm9yRWFjaCh2YWx1ZSwgZm4sIHJlY3Vyc2UsIHJvb3RPYmplY3QpO1xuICAgICAgfVxuICAgICAgZm4odmFsdWUsIGtleSwgb2JqZWN0LCByb290T2JqZWN0KTtcbiAgICAgIGlmIChyZWN1cnNlID09PSAndG9wLWRvd24nICYmIChpc09iamVjdCh2YWx1ZSkgfHwgaXNBcnJheSh2YWx1ZSkpKSB7XG4gICAgICAgIGZvckVhY2godmFsdWUsIGZuLCByZWN1cnNlLCByb290T2JqZWN0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKGVycm9ycykge1xuICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2ZvckVhY2ggZXJyb3I6IEl0ZXJhdG9yIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2Z1bmN0aW9uJywgZm4pO1xuICAgIH1cbiAgICBpZiAoIWlzT2JqZWN0KG9iamVjdCkgJiYgIWlzQXJyYXkob2JqZWN0KSkge1xuICAgICAgY29uc29sZS5lcnJvcignZm9yRWFjaCBlcnJvcjogSW5wdXQgb2JqZWN0IG11c3QgYmUgYW4gb2JqZWN0IG9yIGFycmF5LicpO1xuICAgICAgY29uc29sZS5lcnJvcignb2JqZWN0Jywgb2JqZWN0KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiAnZm9yRWFjaENvcHknIGZ1bmN0aW9uXG4gKlxuICogSXRlcmF0ZXMgb3ZlciBhbGwgaXRlbXMgaW4gdGhlIGZpcnN0IGxldmVsIG9mIGFuIG9iamVjdCBvciBhcnJheVxuICogYW5kIGNhbGxzIGFuIGl0ZXJhdG9yIGZ1bmN0aW9uIG9uIGVhY2ggaXRlbS4gUmV0dXJucyBhIG5ldyBvYmplY3Qgb3IgYXJyYXlcbiAqIHdpdGggdGhlIHNhbWUga2V5cyBvciBpbmRleGVzIGFzIHRoZSBvcmlnaW5hbCwgYW5kIHZhbHVlcyBzZXQgdG8gdGhlIHJlc3VsdHNcbiAqIG9mIHRoZSBpdGVyYXRvciBmdW5jdGlvbi5cbiAqXG4gKiBEb2VzIE5PVCByZWN1cnNpdmVseSBpdGVyYXRlIG92ZXIgaXRlbXMgaW4gc3ViLW9iamVjdHMgb3Igc3ViLWFycmF5cy5cbiAqXG4gKiAvLyB7T2JqZWN0IHwgQXJyYXl9IG9iamVjdCAtIFRoZSBvYmplY3Qgb3IgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyXG4gKiAvLyB7ZnVuY3Rpb259IGZuIC0gVGhlIGl0ZXJhdG9yIGZ1bmNpdG9uIHRvIGNhbGwgb24gZWFjaCBpdGVtXG4gKiAvLyB7Ym9vbGVhbiA9IGZhbHNlfSBlcnJvcnMgLSBTaG93IGVycm9ycz9cbiAqIC8vIHtPYmplY3QgfCBBcnJheX0gLSBUaGUgcmVzdWx0aW5nIG9iamVjdCBvciBhcnJheVxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9yRWFjaENvcHkoXG4gIG9iamVjdDogYW55LCBmbjogKHY6IGFueSwgaz86IHN0cmluZyB8IG51bWJlciwgbz86IGFueSwgcD86IHN0cmluZykgPT4gYW55LFxuICBlcnJvcnMgPSBmYWxzZVxuKTogYW55IHtcbiAgaWYgKCFoYXNWYWx1ZShvYmplY3QpKSB7IHJldHVybjsgfVxuICBpZiAoKGlzT2JqZWN0KG9iamVjdCkgfHwgaXNBcnJheShvYmplY3QpKSAmJiB0eXBlb2Ygb2JqZWN0ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgY29uc3QgbmV3T2JqZWN0OiBhbnkgPSBpc0FycmF5KG9iamVjdCkgPyBbXSA6IHt9O1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKG9iamVjdCkpIHtcbiAgICAgIG5ld09iamVjdFtrZXldID0gZm4ob2JqZWN0W2tleV0sIGtleSwgb2JqZWN0KTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld09iamVjdDtcbiAgfVxuICBpZiAoZXJyb3JzKSB7XG4gICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS5lcnJvcignZm9yRWFjaENvcHkgZXJyb3I6IEl0ZXJhdG9yIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2Z1bmN0aW9uJywgZm4pO1xuICAgIH1cbiAgICBpZiAoIWlzT2JqZWN0KG9iamVjdCkgJiYgIWlzQXJyYXkob2JqZWN0KSkge1xuICAgICAgY29uc29sZS5lcnJvcignZm9yRWFjaENvcHkgZXJyb3I6IElucHV0IG9iamVjdCBtdXN0IGJlIGFuIG9iamVjdCBvciBhcnJheS4nKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ29iamVjdCcsIG9iamVjdCk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogJ2hhc093bicgdXRpbGl0eSBmdW5jdGlvblxuICpcbiAqIENoZWNrcyB3aGV0aGVyIGFuIG9iamVjdCBvciBhcnJheSBoYXMgYSBwYXJ0aWN1bGFyIHByb3BlcnR5LlxuICpcbiAqIC8vIHthbnl9IG9iamVjdCAtIHRoZSBvYmplY3QgdG8gY2hlY2tcbiAqIC8vIHtzdHJpbmd9IHByb3BlcnR5IC0gdGhlIHByb3BlcnR5IHRvIGxvb2sgZm9yXG4gKiAvLyB7Ym9vbGVhbn0gLSB0cnVlIGlmIG9iamVjdCBoYXMgcHJvcGVydHksIGZhbHNlIGlmIG5vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzT3duKG9iamVjdDogYW55LCBwcm9wZXJ0eTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGlmICghb2JqZWN0IHx8ICFbJ251bWJlcicsICdzdHJpbmcnLCAnc3ltYm9sJ10uaW5jbHVkZXModHlwZW9mIHByb3BlcnR5KSB8fFxuICAgICghaXNPYmplY3Qob2JqZWN0KSAmJiAhaXNBcnJheShvYmplY3QpICYmICFpc01hcChvYmplY3QpICYmICFpc1NldChvYmplY3QpKVxuICApIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChpc01hcChvYmplY3QpIHx8IGlzU2V0KG9iamVjdCkpIHsgcmV0dXJuIG9iamVjdC5oYXMocHJvcGVydHkpOyB9XG4gIGlmICh0eXBlb2YgcHJvcGVydHkgPT09ICdudW1iZXInKSB7XG4gICAgaWYgKGlzQXJyYXkob2JqZWN0KSkgeyByZXR1cm4gb2JqZWN0WzxudW1iZXI+cHJvcGVydHldOyB9XG4gICAgcHJvcGVydHkgPSBwcm9wZXJ0eSArICcnO1xuICB9XG4gIHJldHVybiBvYmplY3QuaGFzT3duUHJvcGVydHkocHJvcGVydHkpO1xufVxuXG4vKipcbiAqIFR5cGVzIG9mIHBvc3NpYmxlIGV4cHJlc3Npb25zIHdoaWNoIHRoZSBhcHAgaXMgYWJsZSB0byBldmFsdWF0ZS5cbiAqL1xuZXhwb3J0IGVudW0gRXhwcmVzc2lvblR5cGUge1xuICBFUVVBTFMsXG4gIE5PVF9FUVVBTFMsXG4gIE5PVF9BTl9FWFBSRVNTSU9OXG59XG5cbi8qKlxuICogRGV0ZWN0cyB0aGUgdHlwZSBvZiBleHByZXNzaW9uIGZyb20gdGhlIGdpdmVuIGNhbmRpZGF0ZS4gYD09YCBmb3IgZXF1YWxzLFxuICogYCE9YCBmb3Igbm90IGVxdWFscy4gSWYgbm9uZSBvZiB0aGVzZSBhcmUgY29udGFpbmVkIGluIHRoZSBjYW5kaWRhdGUsIHRoZSBjYW5kaWRhdGVcbiAqIGlzIG5vdCBjb25zaWRlcmVkIHRvIGJlIGFuIGV4cHJlc3Npb24gYXQgYWxsIGFuZCB0aHVzIGBOT1RfQU5fRVhQUkVTU0lPTmAgaXMgcmV0dXJuZWQuXG4gKiAvLyB7ZXhwcmVzc2lvbkNhbmRpZGF0ZX0gZXhwcmVzc2lvbkNhbmRpZGF0ZSAtIHBvdGVudGlhbCBleHByZXNzaW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFeHByZXNzaW9uVHlwZShleHByZXNzaW9uQ2FuZGlkYXRlOiBzdHJpbmcpOiBFeHByZXNzaW9uVHlwZSB7XG4gIGlmIChleHByZXNzaW9uQ2FuZGlkYXRlLmluZGV4T2YoJz09JykgIT09IC0xKSB7XG4gICAgcmV0dXJuIEV4cHJlc3Npb25UeXBlLkVRVUFMUztcbiAgfVxuXG4gIGlmIChleHByZXNzaW9uQ2FuZGlkYXRlLnRvU3RyaW5nKCkuaW5kZXhPZignIT0nKSAhPT0gLTEpIHtcbiAgICByZXR1cm4gRXhwcmVzc2lvblR5cGUuTk9UX0VRVUFMUztcbiAgfVxuXG4gIHJldHVybiBFeHByZXNzaW9uVHlwZS5OT1RfQU5fRVhQUkVTU0lPTjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRXF1YWwoZXhwcmVzc2lvblR5cGUpIHtcbiAgcmV0dXJuIGV4cHJlc3Npb25UeXBlIGFzIEV4cHJlc3Npb25UeXBlID09PSBFeHByZXNzaW9uVHlwZS5FUVVBTFM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc05vdEVxdWFsKGV4cHJlc3Npb25UeXBlKSB7XG4gIHJldHVybiBleHByZXNzaW9uVHlwZSBhcyBFeHByZXNzaW9uVHlwZSA9PT0gRXhwcmVzc2lvblR5cGUuTk9UX0VRVUFMUztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTm90RXhwcmVzc2lvbihleHByZXNzaW9uVHlwZSkge1xuICByZXR1cm4gZXhwcmVzc2lvblR5cGUgYXMgRXhwcmVzc2lvblR5cGUgPT09IEV4cHJlc3Npb25UeXBlLk5PVF9BTl9FWFBSRVNTSU9OO1xufVxuXG4vKipcbiAqIFNwbGl0cyB0aGUgZXhwcmVzc2lvbiBrZXkgYnkgdGhlIGV4cHJlc3Npb25UeXBlIG9uIGEgcGFpciBvZiB2YWx1ZXNcbiAqIGJlZm9yZSBhbmQgYWZ0ZXIgdGhlIGVxdWFscyBvciBub3IgZXF1YWxzIHNpZ24uXG4gKiAvLyB7ZXhwcmVzc2lvblR5cGV9IGVudW0gb2YgYW4gZXhwcmVzc2lvbiB0eXBlXG4gKiAvLyB7a2V5fSB0aGUgZ2l2ZW4ga2V5IGZyb20gYSBmb3IgbG9vcCBpdmVyIGFsbCBjb25kaXRpb25zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRLZXlBbmRWYWx1ZUJ5RXhwcmVzc2lvblR5cGUoZXhwcmVzc2lvblR5cGU6IEV4cHJlc3Npb25UeXBlLCBrZXk6IHN0cmluZykge1xuICBpZiAoaXNFcXVhbChleHByZXNzaW9uVHlwZSkpIHtcbiAgICByZXR1cm4ga2V5LnNwbGl0KCc9PScsIDIpO1xuICB9XG5cbiAgaWYgKGlzTm90RXF1YWwoZXhwcmVzc2lvblR5cGUpKSB7XG4gICAgcmV0dXJuIGtleS5zcGxpdCgnIT0nLCAyKTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xlYW5WYWx1ZU9mUXVvdGVzKGtleUFuZFZhbHVlKTogU3RyaW5nIHtcbiAgaWYgKGtleUFuZFZhbHVlLmNoYXJBdCgwKSA9PT0gJ1xcJycgJiYga2V5QW5kVmFsdWUuY2hhckF0KGtleUFuZFZhbHVlLmxlbmd0aCAtIDEpID09PSAnXFwnJykge1xuICAgIHJldHVybiBrZXlBbmRWYWx1ZS5yZXBsYWNlKCdcXCcnLCAnJykucmVwbGFjZSgnXFwnJywgJycpO1xuICB9XG4gIHJldHVybiBrZXlBbmRWYWx1ZTtcbn1cblxuLyoqXG4gKiAnbWVyZ2VGaWx0ZXJlZE9iamVjdCcgdXRpbGl0eSBmdW5jdGlvblxuICpcbiAqIFNoYWxsb3dseSBtZXJnZXMgdHdvIG9iamVjdHMsIHNldHRpbmcga2V5IGFuZCB2YWx1ZXMgZnJvbSBzb3VyY2Ugb2JqZWN0XG4gKiBpbiB0YXJnZXQgb2JqZWN0LCBleGNsdWRpbmcgc3BlY2lmaWVkIGtleXMuXG4gKlxuICogT3B0aW9uYWxseSwgaXQgY2FuIGFsc28gdXNlIGZ1bmN0aW9ucyB0byB0cmFuc2Zvcm0gdGhlIGtleSBuYW1lcyBhbmQvb3JcbiAqIHRoZSB2YWx1ZXMgb2YgdGhlIG1lcmdpbmcgb2JqZWN0LlxuICpcbiAqIC8vIHtQbGFpbk9iamVjdH0gdGFyZ2V0T2JqZWN0IC0gVGFyZ2V0IG9iamVjdCB0byBhZGQga2V5cyBhbmQgdmFsdWVzIHRvXG4gKiAvLyB7UGxhaW5PYmplY3R9IHNvdXJjZU9iamVjdCAtIFNvdXJjZSBvYmplY3QgdG8gY29weSBrZXlzIGFuZCB2YWx1ZXMgZnJvbVxuICogLy8ge3N0cmluZ1tdfSBleGNsdWRlS2V5cyAtIEFycmF5IG9mIGtleXMgdG8gZXhjbHVkZVxuICogLy8geyhzdHJpbmc6IHN0cmluZykgPT4gc3RyaW5nID0gKGspID0+IGt9IGtleUZuIC0gRnVuY3Rpb24gdG8gYXBwbHkgdG8ga2V5c1xuICogLy8geyhhbnk6IGFueSkgPT4gYW55ID0gKHYpID0+IHZ9IHZhbHVlRm4gLSBGdW5jdGlvbiB0byBhcHBseSB0byB2YWx1ZXNcbiAqIC8vIHtQbGFpbk9iamVjdH0gLSBSZXR1cm5zIHRhcmdldE9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VGaWx0ZXJlZE9iamVjdChcbiAgdGFyZ2V0T2JqZWN0OiBQbGFpbk9iamVjdCxcbiAgc291cmNlT2JqZWN0OiBQbGFpbk9iamVjdCxcbiAgZXhjbHVkZUtleXMgPSA8c3RyaW5nW10+W10sXG4gIGtleUZuID0gKGtleTogc3RyaW5nKTogc3RyaW5nID0+IGtleSxcbiAgdmFsRm4gPSAodmFsOiBhbnkpOiBhbnkgPT4gdmFsXG4pOiBQbGFpbk9iamVjdCB7XG4gIGlmICghaXNPYmplY3Qoc291cmNlT2JqZWN0KSkgeyByZXR1cm4gdGFyZ2V0T2JqZWN0OyB9XG4gIGlmICghaXNPYmplY3QodGFyZ2V0T2JqZWN0KSkgeyB0YXJnZXRPYmplY3QgPSB7fTsgfVxuICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhzb3VyY2VPYmplY3QpKSB7XG4gICAgaWYgKCFpbkFycmF5KGtleSwgZXhjbHVkZUtleXMpICYmIGlzRGVmaW5lZChzb3VyY2VPYmplY3Rba2V5XSkpIHtcbiAgICAgIHRhcmdldE9iamVjdFtrZXlGbihrZXkpXSA9IHZhbEZuKHNvdXJjZU9iamVjdFtrZXldKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhcmdldE9iamVjdDtcbn1cblxuLyoqXG4gKiAndW5pcXVlSXRlbXMnIGZ1bmN0aW9uXG4gKlxuICogQWNjZXB0cyBhbnkgbnVtYmVyIG9mIHN0cmluZyB2YWx1ZSBpbnB1dHMsXG4gKiBhbmQgcmV0dXJucyBhbiBhcnJheSBvZiBhbGwgaW5wdXQgdmF1ZXMsIGV4Y2x1ZGluZyBkdXBsaWNhdGVzLlxuICpcbiAqIC8vIHsuLi5zdHJpbmd9IC4uLml0ZW1zIC1cbiAqIC8vIHtzdHJpbmdbXX0gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5pcXVlSXRlbXMoLi4uaXRlbXMpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IHJldHVybkl0ZW1zID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuICAgIGlmICghcmV0dXJuSXRlbXMuaW5jbHVkZXMoaXRlbSkpIHsgcmV0dXJuSXRlbXMucHVzaChpdGVtKTsgfVxuICB9XG4gIHJldHVybiByZXR1cm5JdGVtcztcbn1cblxuLyoqXG4gKiAnY29tbW9uSXRlbXMnIGZ1bmN0aW9uXG4gKlxuICogQWNjZXB0cyBhbnkgbnVtYmVyIG9mIHN0cmluZ3Mgb3IgYXJyYXlzIG9mIHN0cmluZyB2YWx1ZXMsXG4gKiBhbmQgcmV0dXJucyBhIHNpbmdsZSBhcnJheSBjb250YWluaW5nIG9ubHkgdmFsdWVzIHByZXNlbnQgaW4gYWxsIGlucHV0cy5cbiAqXG4gKiAvLyB7Li4uc3RyaW5nfHN0cmluZ1tdfSAuLi5hcnJheXMgLVxuICogLy8ge3N0cmluZ1tdfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21tb25JdGVtcyguLi5hcnJheXMpOiBzdHJpbmdbXSB7XG4gIGxldCByZXR1cm5JdGVtcyA9IG51bGw7XG4gIGZvciAobGV0IGFycmF5IG9mIGFycmF5cykge1xuICAgIGlmIChpc1N0cmluZyhhcnJheSkpIHsgYXJyYXkgPSBbYXJyYXldOyB9XG4gICAgcmV0dXJuSXRlbXMgPSByZXR1cm5JdGVtcyA9PT0gbnVsbCA/IFsgLi4uYXJyYXkgXSA6XG4gICAgICByZXR1cm5JdGVtcy5maWx0ZXIoaXRlbSA9PiBhcnJheS5pbmNsdWRlcyhpdGVtKSk7XG4gICAgaWYgKCFyZXR1cm5JdGVtcy5sZW5ndGgpIHsgcmV0dXJuIFtdOyB9XG4gIH1cbiAgcmV0dXJuIHJldHVybkl0ZW1zO1xufVxuXG4vKipcbiAqICdmaXhUaXRsZScgZnVuY3Rpb25cbiAqXG4gKlxuICogLy8ge3N0cmluZ30gaW5wdXQgLVxuICogLy8ge3N0cmluZ30gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gZml4VGl0bGUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIG5hbWUgJiYgdG9UaXRsZUNhc2UobmFtZS5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEgJDInKS5yZXBsYWNlKC9fL2csICcgJykpO1xufVxuXG4vKipcbiAqICd0b1RpdGxlQ2FzZScgZnVuY3Rpb25cbiAqXG4gKiBJbnRlbGxpZ2VudGx5IGNvbnZlcnRzIGFuIGlucHV0IHN0cmluZyB0byBUaXRsZSBDYXNlLlxuICpcbiAqIEFjY2VwdHMgYW4gb3B0aW9uYWwgc2Vjb25kIHBhcmFtZXRlciB3aXRoIGEgbGlzdCBvZiBhZGRpdGlvbmFsXG4gKiB3b3JkcyBhbmQgYWJicmV2aWF0aW9ucyB0byBmb3JjZSBpbnRvIGEgcGFydGljdWxhciBjYXNlLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gaXMgYnVpbHQgb24gcHJpb3Igd29yayBieSBKb2huIEdydWJlciBhbmQgRGF2aWQgR291Y2g6XG4gKiBodHRwOi8vZGFyaW5nZmlyZWJhbGwubmV0LzIwMDgvMDgvdGl0bGVfY2FzZV91cGRhdGVcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9nb3VjaC90by10aXRsZS1jYXNlXG4gKlxuICogLy8ge3N0cmluZ30gaW5wdXQgLVxuICogLy8ge3N0cmluZ3xzdHJpbmdbXX0gZm9yY2VXb3Jkcz8gLVxuICogLy8ge3N0cmluZ30gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9UaXRsZUNhc2UoaW5wdXQ6IHN0cmluZywgZm9yY2VXb3Jkcz86IHN0cmluZ3xzdHJpbmdbXSk6IHN0cmluZyB7XG4gIGlmICghaXNTdHJpbmcoaW5wdXQpKSB7IHJldHVybiBpbnB1dDsgfVxuICBsZXQgZm9yY2VBcnJheTogc3RyaW5nW10gPSBbJ2EnLCAnYW4nLCAnYW5kJywgJ2FzJywgJ2F0JywgJ2J1dCcsICdieScsICdlbicsXG4gICAnZm9yJywgJ2lmJywgJ2luJywgJ25vcicsICdvZicsICdvbicsICdvcicsICdwZXInLCAndGhlJywgJ3RvJywgJ3YnLCAndi4nLFxuICAgJ3ZzJywgJ3ZzLicsICd2aWEnXTtcbiAgaWYgKGlzU3RyaW5nKGZvcmNlV29yZHMpKSB7IGZvcmNlV29yZHMgPSAoPHN0cmluZz5mb3JjZVdvcmRzKS5zcGxpdCgnfCcpOyB9XG4gIGlmIChpc0FycmF5KGZvcmNlV29yZHMpKSB7IGZvcmNlQXJyYXkgPSBmb3JjZUFycmF5LmNvbmNhdChmb3JjZVdvcmRzKTsgfVxuICBjb25zdCBmb3JjZUFycmF5TG93ZXI6IHN0cmluZ1tdID0gZm9yY2VBcnJheS5tYXAodyA9PiB3LnRvTG93ZXJDYXNlKCkpO1xuICBjb25zdCBub0luaXRpYWxDYXNlOiBib29sZWFuID1cbiAgICBpbnB1dCA9PT0gaW5wdXQudG9VcHBlckNhc2UoKSB8fCBpbnB1dCA9PT0gaW5wdXQudG9Mb3dlckNhc2UoKTtcbiAgbGV0IHByZXZMYXN0Q2hhciA9ICcnO1xuICBpbnB1dCA9IGlucHV0LnRyaW0oKTtcbiAgcmV0dXJuIGlucHV0LnJlcGxhY2UoL1tBLVphLXowLTlcXHUwMEMwLVxcdTAwRkZdK1teXFxzLV0qL2csICh3b3JkLCBpZHgpID0+IHtcbiAgICBpZiAoIW5vSW5pdGlhbENhc2UgJiYgd29yZC5zbGljZSgxKS5zZWFyY2goL1tBLVpdfFxcLi4vKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiB3b3JkO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbmV3V29yZDogc3RyaW5nO1xuICAgICAgY29uc3QgZm9yY2VXb3JkOiBzdHJpbmcgPVxuICAgICAgICBmb3JjZUFycmF5W2ZvcmNlQXJyYXlMb3dlci5pbmRleE9mKHdvcmQudG9Mb3dlckNhc2UoKSldO1xuICAgICAgaWYgKCFmb3JjZVdvcmQpIHtcbiAgICAgICAgaWYgKG5vSW5pdGlhbENhc2UpIHtcbiAgICAgICAgICBpZiAod29yZC5zbGljZSgxKS5zZWFyY2goL1xcLi4vKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIG5ld1dvcmQgPSB3b3JkLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld1dvcmQgPSB3b3JkWzBdLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1dvcmQgPSB3b3JkWzBdLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnNsaWNlKDEpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBmb3JjZVdvcmQgPT09IGZvcmNlV29yZC50b0xvd2VyQ2FzZSgpICYmIChcbiAgICAgICAgICBpZHggPT09IDAgfHwgaWR4ICsgd29yZC5sZW5ndGggPT09IGlucHV0Lmxlbmd0aCB8fFxuICAgICAgICAgIHByZXZMYXN0Q2hhciA9PT0gJzonIHx8IGlucHV0W2lkeCAtIDFdLnNlYXJjaCgvW15cXHMtXS8pICE9PSAtMSB8fFxuICAgICAgICAgIChpbnB1dFtpZHggLSAxXSAhPT0gJy0nICYmIGlucHV0W2lkeCArIHdvcmQubGVuZ3RoXSA9PT0gJy0nKVxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgbmV3V29yZCA9IGZvcmNlV29yZFswXS50b1VwcGVyQ2FzZSgpICsgZm9yY2VXb3JkLnNsaWNlKDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3V29yZCA9IGZvcmNlV29yZDtcbiAgICAgIH1cbiAgICAgIHByZXZMYXN0Q2hhciA9IHdvcmQuc2xpY2UoLTEpO1xuICAgICAgcmV0dXJuIG5ld1dvcmQ7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==