/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { cleanValueOfQuotes, copy, getExpressionType, getKeyAndValueByExpressionType, hasOwn, isEqual, isNotEqual, isNotExpression } from './utility.functions';
import { Injectable } from '@angular/core';
import { isArray, isDefined, isEmpty, isMap, isNumber, isObject, isString } from './validator.functions';
var JsonPointer = /** @class */ (function () {
    function JsonPointer() {
    }
    /**
     * 'get' function
     *
     * Uses a JSON Pointer to retrieve a value from an object.
     *
     * //  { object } object - Object to get value from
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { number = 0 } startSlice - Zero-based index of first Pointer key to use
     * //  { number } endSlice - Zero-based index of last Pointer key to use
     * //  { boolean = false } getBoolean - Return only true or false?
     * //  { boolean = false } errors - Show error if not found?
     * // { object } - Located value (or true or false if getBoolean = true)
     */
    /**
     * 'get' function
     *
     * Uses a JSON Pointer to retrieve a value from an object.
     *
     * //  { object } object - Object to get value from
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { number = 0 } startSlice - Zero-based index of first Pointer key to use
     * //  { number } endSlice - Zero-based index of last Pointer key to use
     * //  { boolean = false } getBoolean - Return only true or false?
     * //  { boolean = false } errors - Show error if not found?
     * // { object } - Located value (or true or false if getBoolean = true)
     * @param {?} object
     * @param {?} pointer
     * @param {?=} startSlice
     * @param {?=} endSlice
     * @param {?=} getBoolean
     * @param {?=} errors
     * @return {?}
     */
    JsonPointer.get = /**
     * 'get' function
     *
     * Uses a JSON Pointer to retrieve a value from an object.
     *
     * //  { object } object - Object to get value from
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { number = 0 } startSlice - Zero-based index of first Pointer key to use
     * //  { number } endSlice - Zero-based index of last Pointer key to use
     * //  { boolean = false } getBoolean - Return only true or false?
     * //  { boolean = false } errors - Show error if not found?
     * // { object } - Located value (or true or false if getBoolean = true)
     * @param {?} object
     * @param {?} pointer
     * @param {?=} startSlice
     * @param {?=} endSlice
     * @param {?=} getBoolean
     * @param {?=} errors
     * @return {?}
     */
    function (object, pointer, startSlice, endSlice, getBoolean, errors) {
        var e_1, _a;
        if (startSlice === void 0) { startSlice = 0; }
        if (endSlice === void 0) { endSlice = null; }
        if (getBoolean === void 0) { getBoolean = false; }
        if (errors === void 0) { errors = false; }
        if (object === null) {
            return getBoolean ? false : undefined;
        }
        /** @type {?} */
        var keyArray = this.parse(pointer, errors);
        if (typeof object === 'object' && keyArray !== null) {
            /** @type {?} */
            var subObject = object;
            if (startSlice >= keyArray.length || endSlice <= -keyArray.length) {
                return object;
            }
            if (startSlice <= -keyArray.length) {
                startSlice = 0;
            }
            if (!isDefined(endSlice) || endSlice >= keyArray.length) {
                endSlice = keyArray.length;
            }
            keyArray = keyArray.slice(startSlice, endSlice);
            try {
                for (var keyArray_1 = tslib_1.__values(keyArray), keyArray_1_1 = keyArray_1.next(); !keyArray_1_1.done; keyArray_1_1 = keyArray_1.next()) {
                    var key = keyArray_1_1.value;
                    if (key === '-' && isArray(subObject) && subObject.length) {
                        key = subObject.length - 1;
                    }
                    if (isMap(subObject) && subObject.has(key)) {
                        subObject = subObject.get(key);
                    }
                    else if (typeof subObject === 'object' && subObject !== null &&
                        hasOwn(subObject, key)) {
                        subObject = subObject[key];
                    }
                    else {
                        /** @type {?} */
                        var evaluatedExpression = JsonPointer.evaluateExpression(subObject, key);
                        if (evaluatedExpression.passed) {
                            subObject = evaluatedExpression.key ? subObject[evaluatedExpression.key] : subObject;
                        }
                        else {
                            this.logErrors(errors, key, pointer, object);
                            return getBoolean ? false : undefined;
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (keyArray_1_1 && !keyArray_1_1.done && (_a = keyArray_1.return)) _a.call(keyArray_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return getBoolean ? true : subObject;
        }
        if (errors && keyArray === null) {
            console.error("get error: Invalid JSON Pointer: " + pointer);
        }
        if (errors && typeof object !== 'object') {
            console.error('get error: Invalid object:');
            console.error(object);
        }
        return getBoolean ? false : undefined;
    };
    /**
     * @private
     * @param {?} errors
     * @param {?} key
     * @param {?} pointer
     * @param {?} object
     * @return {?}
     */
    JsonPointer.logErrors = /**
     * @private
     * @param {?} errors
     * @param {?} key
     * @param {?} pointer
     * @param {?} object
     * @return {?}
     */
    function (errors, key, pointer, object) {
        if (errors) {
            console.error("get error: \"" + key + "\" key not found in object.");
            console.error(pointer);
            console.error(object);
        }
    };
    /**
     * Evaluates conditional expression in form of `model.<property>==<value>` or
     * `model.<property>!=<value>` where the first one means that the value must match to be
     * shown in a form, while the former shows the property only when the property value is not
     * set, or does not equal the given value.
     *
     * // { subObject } subObject -  an object containing the data values of properties
     * // { key } key - the key from the for loop in a form of `<property>==<value>`
     *
     * Returns the object with two properties. The property passed informs whether
     * the expression evaluated successfully and the property key returns either the same
     * key if it is not contained inside the subObject or the key of the property if it is contained.
     */
    /**
     * Evaluates conditional expression in form of `model.<property>==<value>` or
     * `model.<property>!=<value>` where the first one means that the value must match to be
     * shown in a form, while the former shows the property only when the property value is not
     * set, or does not equal the given value.
     *
     * // { subObject } subObject -  an object containing the data values of properties
     * // { key } key - the key from the for loop in a form of `<property>==<value>`
     *
     * Returns the object with two properties. The property passed informs whether
     * the expression evaluated successfully and the property key returns either the same
     * key if it is not contained inside the subObject or the key of the property if it is contained.
     * @param {?} subObject
     * @param {?} key
     * @return {?}
     */
    JsonPointer.evaluateExpression = /**
     * Evaluates conditional expression in form of `model.<property>==<value>` or
     * `model.<property>!=<value>` where the first one means that the value must match to be
     * shown in a form, while the former shows the property only when the property value is not
     * set, or does not equal the given value.
     *
     * // { subObject } subObject -  an object containing the data values of properties
     * // { key } key - the key from the for loop in a form of `<property>==<value>`
     *
     * Returns the object with two properties. The property passed informs whether
     * the expression evaluated successfully and the property key returns either the same
     * key if it is not contained inside the subObject or the key of the property if it is contained.
     * @param {?} subObject
     * @param {?} key
     * @return {?}
     */
    function (subObject, key) {
        /** @type {?} */
        var defaultResult = { passed: false, key: key };
        /** @type {?} */
        var keysAndExpression = this.parseKeysAndExpression(key, subObject);
        if (!keysAndExpression) {
            return defaultResult;
        }
        /** @type {?} */
        var ownCheckResult = this.doOwnCheckResult(subObject, keysAndExpression);
        if (ownCheckResult) {
            return ownCheckResult;
        }
        /** @type {?} */
        var cleanedValue = cleanValueOfQuotes(keysAndExpression.keyAndValue[1]);
        /** @type {?} */
        var evaluatedResult = this.performExpressionOnValue(keysAndExpression, cleanedValue, subObject);
        if (evaluatedResult) {
            return evaluatedResult;
        }
        return defaultResult;
    };
    /**
     * Performs the actual evaluation on the given expression with given values and keys.
     * // { cleanedValue } cleanedValue - the given valued cleaned of quotes if it had any
     * // { subObject } subObject - the object with properties values
     * // { keysAndExpression } keysAndExpression - an object holding the expressions with
     */
    /**
     * Performs the actual evaluation on the given expression with given values and keys.
     * // { cleanedValue } cleanedValue - the given valued cleaned of quotes if it had any
     * // { subObject } subObject - the object with properties values
     * // { keysAndExpression } keysAndExpression - an object holding the expressions with
     * @private
     * @param {?} keysAndExpression
     * @param {?} cleanedValue
     * @param {?} subObject
     * @return {?}
     */
    JsonPointer.performExpressionOnValue = /**
     * Performs the actual evaluation on the given expression with given values and keys.
     * // { cleanedValue } cleanedValue - the given valued cleaned of quotes if it had any
     * // { subObject } subObject - the object with properties values
     * // { keysAndExpression } keysAndExpression - an object holding the expressions with
     * @private
     * @param {?} keysAndExpression
     * @param {?} cleanedValue
     * @param {?} subObject
     * @return {?}
     */
    function (keysAndExpression, cleanedValue, subObject) {
        /** @type {?} */
        var propertyByKey = subObject[keysAndExpression.keyAndValue[0]];
        if (this.doComparisonByExpressionType(keysAndExpression.expressionType, propertyByKey, cleanedValue)) {
            return { passed: true, key: keysAndExpression.keyAndValue[0] };
        }
        return null;
    };
    /**
     * @private
     * @param {?} expressionType
     * @param {?} propertyByKey
     * @param {?} cleanedValue
     * @return {?}
     */
    JsonPointer.doComparisonByExpressionType = /**
     * @private
     * @param {?} expressionType
     * @param {?} propertyByKey
     * @param {?} cleanedValue
     * @return {?}
     */
    function (expressionType, propertyByKey, cleanedValue) {
        if (isEqual(expressionType)) {
            return propertyByKey === cleanedValue;
        }
        if (isNotEqual(expressionType)) {
            return propertyByKey !== cleanedValue;
        }
        return false;
    };
    /**
     * Does the checks when the parsed key is actually no a property inside subObject.
     * That would mean that the equal comparison makes no sense and thus the negative result
     * is returned, and the not equal comparison is not necessary because it doesn't equal
     * obviously. Returns null when the given key is a real property inside the subObject.
     * // { subObject } subObject - the object with properties values
     * // { keysAndExpression } keysAndExpression - an object holding the expressions with
     * the associated keys.
     */
    /**
     * Does the checks when the parsed key is actually no a property inside subObject.
     * That would mean that the equal comparison makes no sense and thus the negative result
     * is returned, and the not equal comparison is not necessary because it doesn't equal
     * obviously. Returns null when the given key is a real property inside the subObject.
     * // { subObject } subObject - the object with properties values
     * // { keysAndExpression } keysAndExpression - an object holding the expressions with
     * the associated keys.
     * @private
     * @param {?} subObject
     * @param {?} keysAndExpression
     * @return {?}
     */
    JsonPointer.doOwnCheckResult = /**
     * Does the checks when the parsed key is actually no a property inside subObject.
     * That would mean that the equal comparison makes no sense and thus the negative result
     * is returned, and the not equal comparison is not necessary because it doesn't equal
     * obviously. Returns null when the given key is a real property inside the subObject.
     * // { subObject } subObject - the object with properties values
     * // { keysAndExpression } keysAndExpression - an object holding the expressions with
     * the associated keys.
     * @private
     * @param {?} subObject
     * @param {?} keysAndExpression
     * @return {?}
     */
    function (subObject, keysAndExpression) {
        /** @type {?} */
        var ownCheckResult = null;
        if (!hasOwn(subObject, keysAndExpression.keyAndValue[0])) {
            if (isEqual(keysAndExpression.expressionType)) {
                ownCheckResult = { passed: false, key: null };
            }
            if (isNotEqual(keysAndExpression.expressionType)) {
                ownCheckResult = { passed: true, key: null };
            }
        }
        return ownCheckResult;
    };
    /**
     * Does the basic checks and tries to parse an expression and a pair
     * of key and value.
     * // { key } key - the original for loop created value containing key and value in one string
     * // { subObject } subObject - the object with properties values
     */
    /**
     * Does the basic checks and tries to parse an expression and a pair
     * of key and value.
     * // { key } key - the original for loop created value containing key and value in one string
     * // { subObject } subObject - the object with properties values
     * @private
     * @param {?} key
     * @param {?} subObject
     * @return {?}
     */
    JsonPointer.parseKeysAndExpression = /**
     * Does the basic checks and tries to parse an expression and a pair
     * of key and value.
     * // { key } key - the original for loop created value containing key and value in one string
     * // { subObject } subObject - the object with properties values
     * @private
     * @param {?} key
     * @param {?} subObject
     * @return {?}
     */
    function (key, subObject) {
        if (this.keyOrSubObjEmpty(key, subObject)) {
            return null;
        }
        /** @type {?} */
        var expressionType = getExpressionType(key.toString());
        if (isNotExpression(expressionType)) {
            return null;
        }
        /** @type {?} */
        var keyAndValue = getKeyAndValueByExpressionType(expressionType, key);
        if (!keyAndValue || !keyAndValue[0] || !keyAndValue[1]) {
            return null;
        }
        return { expressionType: expressionType, keyAndValue: keyAndValue };
    };
    /**
     * @private
     * @param {?} key
     * @param {?} subObject
     * @return {?}
     */
    JsonPointer.keyOrSubObjEmpty = /**
     * @private
     * @param {?} key
     * @param {?} subObject
     * @return {?}
     */
    function (key, subObject) {
        return !key || !subObject;
    };
    /**
     * 'getCopy' function
     *
     * Uses a JSON Pointer to deeply clone a value from an object.
     *
     * //  { object } object - Object to get value from
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { number = 0 } startSlice - Zero-based index of first Pointer key to use
     * //  { number } endSlice - Zero-based index of last Pointer key to use
     * //  { boolean = false } getBoolean - Return only true or false?
     * //  { boolean = false } errors - Show error if not found?
     * // { object } - Located value (or true or false if getBoolean = true)
     */
    /**
     * 'getCopy' function
     *
     * Uses a JSON Pointer to deeply clone a value from an object.
     *
     * //  { object } object - Object to get value from
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { number = 0 } startSlice - Zero-based index of first Pointer key to use
     * //  { number } endSlice - Zero-based index of last Pointer key to use
     * //  { boolean = false } getBoolean - Return only true or false?
     * //  { boolean = false } errors - Show error if not found?
     * // { object } - Located value (or true or false if getBoolean = true)
     * @param {?} object
     * @param {?} pointer
     * @param {?=} startSlice
     * @param {?=} endSlice
     * @param {?=} getBoolean
     * @param {?=} errors
     * @return {?}
     */
    JsonPointer.getCopy = /**
     * 'getCopy' function
     *
     * Uses a JSON Pointer to deeply clone a value from an object.
     *
     * //  { object } object - Object to get value from
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { number = 0 } startSlice - Zero-based index of first Pointer key to use
     * //  { number } endSlice - Zero-based index of last Pointer key to use
     * //  { boolean = false } getBoolean - Return only true or false?
     * //  { boolean = false } errors - Show error if not found?
     * // { object } - Located value (or true or false if getBoolean = true)
     * @param {?} object
     * @param {?} pointer
     * @param {?=} startSlice
     * @param {?=} endSlice
     * @param {?=} getBoolean
     * @param {?=} errors
     * @return {?}
     */
    function (object, pointer, startSlice, endSlice, getBoolean, errors) {
        if (startSlice === void 0) { startSlice = 0; }
        if (endSlice === void 0) { endSlice = null; }
        if (getBoolean === void 0) { getBoolean = false; }
        if (errors === void 0) { errors = false; }
        /** @type {?} */
        var objectToCopy = this.get(object, pointer, startSlice, endSlice, getBoolean, errors);
        return this.forEachDeepCopy(objectToCopy);
    };
    /**
     * 'getFirst' function
     *
     * Takes an array of JSON Pointers and objects,
     * checks each object for a value specified by the pointer,
     * and returns the first value found.
     *
     * //  { [object, pointer][] } items - Array of objects and pointers to check
     * //  { any = null } defaultValue - Value to return if nothing found
     * //  { boolean = false } getCopy - Return a copy instead?
     * //  - First value found
     */
    /**
     * 'getFirst' function
     *
     * Takes an array of JSON Pointers and objects,
     * checks each object for a value specified by the pointer,
     * and returns the first value found.
     *
     * //  { [object, pointer][] } items - Array of objects and pointers to check
     * //  { any = null } defaultValue - Value to return if nothing found
     * //  { boolean = false } getCopy - Return a copy instead?
     * //  - First value found
     * @param {?} items
     * @param {?=} defaultValue
     * @param {?=} getCopy
     * @return {?}
     */
    JsonPointer.getFirst = /**
     * 'getFirst' function
     *
     * Takes an array of JSON Pointers and objects,
     * checks each object for a value specified by the pointer,
     * and returns the first value found.
     *
     * //  { [object, pointer][] } items - Array of objects and pointers to check
     * //  { any = null } defaultValue - Value to return if nothing found
     * //  { boolean = false } getCopy - Return a copy instead?
     * //  - First value found
     * @param {?} items
     * @param {?=} defaultValue
     * @param {?=} getCopy
     * @return {?}
     */
    function (items, defaultValue, getCopy) {
        var e_2, _a, e_3, _b;
        if (defaultValue === void 0) { defaultValue = null; }
        if (getCopy === void 0) { getCopy = false; }
        if (isEmpty(items)) {
            return;
        }
        if (isArray(items)) {
            try {
                for (var items_1 = tslib_1.__values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                    var item = items_1_1.value;
                    if (isEmpty(item)) {
                        continue;
                    }
                    if (isArray(item) && item.length >= 2) {
                        if (isEmpty(item[0]) || isEmpty(item[1])) {
                            continue;
                        }
                        /** @type {?} */
                        var value = getCopy ?
                            this.getCopy(item[0], item[1]) :
                            this.get(item[0], item[1]);
                        if (value) {
                            return value;
                        }
                        continue;
                    }
                    console.error('getFirst error: Input not in correct format.\n' +
                        'Should be: [ [ object1, pointer1 ], [ object 2, pointer2 ], etc... ]');
                    return;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return defaultValue;
        }
        if (isMap(items)) {
            try {
                for (var items_2 = tslib_1.__values(items), items_2_1 = items_2.next(); !items_2_1.done; items_2_1 = items_2.next()) {
                    var _c = tslib_1.__read(items_2_1.value, 2), object = _c[0], pointer = _c[1];
                    if (object === null || !this.isJsonPointer(pointer)) {
                        continue;
                    }
                    /** @type {?} */
                    var value = getCopy ?
                        this.getCopy(object, pointer) :
                        this.get(object, pointer);
                    if (value) {
                        return value;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (items_2_1 && !items_2_1.done && (_b = items_2.return)) _b.call(items_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return defaultValue;
        }
        console.error('getFirst error: Input not in correct format.\n' +
            'Should be: [ [ object1, pointer1 ], [ object 2, pointer2 ], etc... ]');
        return defaultValue;
    };
    /**
     * 'getFirstCopy' function
     *
     * Similar to getFirst, but always returns a copy.
     *
     * //  { [object, pointer][] } items - Array of objects and pointers to check
     * //  { any = null } defaultValue - Value to return if nothing found
     * //  - Copy of first value found
     */
    /**
     * 'getFirstCopy' function
     *
     * Similar to getFirst, but always returns a copy.
     *
     * //  { [object, pointer][] } items - Array of objects and pointers to check
     * //  { any = null } defaultValue - Value to return if nothing found
     * //  - Copy of first value found
     * @param {?} items
     * @param {?=} defaultValue
     * @return {?}
     */
    JsonPointer.getFirstCopy = /**
     * 'getFirstCopy' function
     *
     * Similar to getFirst, but always returns a copy.
     *
     * //  { [object, pointer][] } items - Array of objects and pointers to check
     * //  { any = null } defaultValue - Value to return if nothing found
     * //  - Copy of first value found
     * @param {?} items
     * @param {?=} defaultValue
     * @return {?}
     */
    function (items, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        /** @type {?} */
        var firstCopy = this.getFirst(items, defaultValue, true);
        return firstCopy;
    };
    /**
     * 'set' function
     *
     * Uses a JSON Pointer to set a value on an object.
     * Also creates any missing sub objects or arrays to contain that value.
     *
     * If the optional fourth parameter is TRUE and the inner-most container
     * is an array, the function will insert the value as a new item at the
     * specified location in the array, rather than overwriting the existing
     * value (if any) at that location.
     *
     * So set([1, 2, 3], '/1', 4) => [1, 4, 3]
     * and
     * So set([1, 2, 3], '/1', 4, true) => [1, 4, 2, 3]
     *
     * //  { object } object - The object to set value in
     * //  { Pointer } pointer - The JSON Pointer (string or array)
     * //   value - The new value to set
     * //  { boolean } insert - insert value?
     * // { object } - The original object, modified with the set value
     */
    /**
     * 'set' function
     *
     * Uses a JSON Pointer to set a value on an object.
     * Also creates any missing sub objects or arrays to contain that value.
     *
     * If the optional fourth parameter is TRUE and the inner-most container
     * is an array, the function will insert the value as a new item at the
     * specified location in the array, rather than overwriting the existing
     * value (if any) at that location.
     *
     * So set([1, 2, 3], '/1', 4) => [1, 4, 3]
     * and
     * So set([1, 2, 3], '/1', 4, true) => [1, 4, 2, 3]
     *
     * //  { object } object - The object to set value in
     * //  { Pointer } pointer - The JSON Pointer (string or array)
     * //   value - The new value to set
     * //  { boolean } insert - insert value?
     * // { object } - The original object, modified with the set value
     * @param {?} object
     * @param {?} pointer
     * @param {?} value
     * @param {?=} insert
     * @return {?}
     */
    JsonPointer.set = /**
     * 'set' function
     *
     * Uses a JSON Pointer to set a value on an object.
     * Also creates any missing sub objects or arrays to contain that value.
     *
     * If the optional fourth parameter is TRUE and the inner-most container
     * is an array, the function will insert the value as a new item at the
     * specified location in the array, rather than overwriting the existing
     * value (if any) at that location.
     *
     * So set([1, 2, 3], '/1', 4) => [1, 4, 3]
     * and
     * So set([1, 2, 3], '/1', 4, true) => [1, 4, 2, 3]
     *
     * //  { object } object - The object to set value in
     * //  { Pointer } pointer - The JSON Pointer (string or array)
     * //   value - The new value to set
     * //  { boolean } insert - insert value?
     * // { object } - The original object, modified with the set value
     * @param {?} object
     * @param {?} pointer
     * @param {?} value
     * @param {?=} insert
     * @return {?}
     */
    function (object, pointer, value, insert) {
        if (insert === void 0) { insert = false; }
        /** @type {?} */
        var keyArray = this.parse(pointer);
        if (keyArray !== null && keyArray.length) {
            /** @type {?} */
            var subObject = object;
            for (var i = 0; i < keyArray.length - 1; ++i) {
                /** @type {?} */
                var key = keyArray[i];
                if (key === '-' && isArray(subObject)) {
                    key = subObject.length;
                }
                if (isMap(subObject) && subObject.has(key)) {
                    subObject = subObject.get(key);
                }
                else {
                    if (!hasOwn(subObject, key)) {
                        subObject[key] = (keyArray[i + 1].match(/^(\d+|-)$/)) ? [] : {};
                    }
                    subObject = subObject[key];
                }
            }
            /** @type {?} */
            var lastKey = keyArray[keyArray.length - 1];
            if (isArray(subObject) && lastKey === '-') {
                subObject.push(value);
            }
            else if (insert && isArray(subObject) && !isNaN(+lastKey)) {
                subObject.splice(lastKey, 0, value);
            }
            else if (isMap(subObject)) {
                subObject.set(lastKey, value);
            }
            else {
                subObject[lastKey] = value;
            }
            return object;
        }
        console.error("set error: Invalid JSON Pointer: " + pointer);
        return object;
    };
    /**
     * 'setCopy' function
     *
     * Copies an object and uses a JSON Pointer to set a value on the copy.
     * Also creates any missing sub objects or arrays to contain that value.
     *
     * If the optional fourth parameter is TRUE and the inner-most container
     * is an array, the function will insert the value as a new item at the
     * specified location in the array, rather than overwriting the existing value.
     *
     * //  { object } object - The object to copy and set value in
     * //  { Pointer } pointer - The JSON Pointer (string or array)
     * //   value - The value to set
     * //  { boolean } insert - insert value?
     * // { object } - The new object with the set value
     */
    /**
     * 'setCopy' function
     *
     * Copies an object and uses a JSON Pointer to set a value on the copy.
     * Also creates any missing sub objects or arrays to contain that value.
     *
     * If the optional fourth parameter is TRUE and the inner-most container
     * is an array, the function will insert the value as a new item at the
     * specified location in the array, rather than overwriting the existing value.
     *
     * //  { object } object - The object to copy and set value in
     * //  { Pointer } pointer - The JSON Pointer (string or array)
     * //   value - The value to set
     * //  { boolean } insert - insert value?
     * // { object } - The new object with the set value
     * @param {?} object
     * @param {?} pointer
     * @param {?} value
     * @param {?=} insert
     * @return {?}
     */
    JsonPointer.setCopy = /**
     * 'setCopy' function
     *
     * Copies an object and uses a JSON Pointer to set a value on the copy.
     * Also creates any missing sub objects or arrays to contain that value.
     *
     * If the optional fourth parameter is TRUE and the inner-most container
     * is an array, the function will insert the value as a new item at the
     * specified location in the array, rather than overwriting the existing value.
     *
     * //  { object } object - The object to copy and set value in
     * //  { Pointer } pointer - The JSON Pointer (string or array)
     * //   value - The value to set
     * //  { boolean } insert - insert value?
     * // { object } - The new object with the set value
     * @param {?} object
     * @param {?} pointer
     * @param {?} value
     * @param {?=} insert
     * @return {?}
     */
    function (object, pointer, value, insert) {
        if (insert === void 0) { insert = false; }
        /** @type {?} */
        var keyArray = this.parse(pointer);
        if (keyArray !== null) {
            /** @type {?} */
            var newObject = copy(object);
            /** @type {?} */
            var subObject = newObject;
            for (var i = 0; i < keyArray.length - 1; ++i) {
                /** @type {?} */
                var key = keyArray[i];
                if (key === '-' && isArray(subObject)) {
                    key = subObject.length;
                }
                if (isMap(subObject) && subObject.has(key)) {
                    subObject.set(key, copy(subObject.get(key)));
                    subObject = subObject.get(key);
                }
                else {
                    if (!hasOwn(subObject, key)) {
                        subObject[key] = (keyArray[i + 1].match(/^(\d+|-)$/)) ? [] : {};
                    }
                    subObject[key] = copy(subObject[key]);
                    subObject = subObject[key];
                }
            }
            /** @type {?} */
            var lastKey = keyArray[keyArray.length - 1];
            if (isArray(subObject) && lastKey === '-') {
                subObject.push(value);
            }
            else if (insert && isArray(subObject) && !isNaN(+lastKey)) {
                subObject.splice(lastKey, 0, value);
            }
            else if (isMap(subObject)) {
                subObject.set(lastKey, value);
            }
            else {
                subObject[lastKey] = value;
            }
            return newObject;
        }
        console.error("setCopy error: Invalid JSON Pointer: " + pointer);
        return object;
    };
    /**
     * 'insert' function
     *
     * Calls 'set' with insert = TRUE
     *
     * //  { object } object - object to insert value in
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //   value - value to insert
     * // { object }
     */
    /**
     * 'insert' function
     *
     * Calls 'set' with insert = TRUE
     *
     * //  { object } object - object to insert value in
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //   value - value to insert
     * // { object }
     * @param {?} object
     * @param {?} pointer
     * @param {?} value
     * @return {?}
     */
    JsonPointer.insert = /**
     * 'insert' function
     *
     * Calls 'set' with insert = TRUE
     *
     * //  { object } object - object to insert value in
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //   value - value to insert
     * // { object }
     * @param {?} object
     * @param {?} pointer
     * @param {?} value
     * @return {?}
     */
    function (object, pointer, value) {
        /** @type {?} */
        var updatedObject = this.set(object, pointer, value, true);
        return updatedObject;
    };
    /**
     * 'insertCopy' function
     *
     * Calls 'setCopy' with insert = TRUE
     *
     * //  { object } object - object to insert value in
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //   value - value to insert
     * // { object }
     */
    /**
     * 'insertCopy' function
     *
     * Calls 'setCopy' with insert = TRUE
     *
     * //  { object } object - object to insert value in
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //   value - value to insert
     * // { object }
     * @param {?} object
     * @param {?} pointer
     * @param {?} value
     * @return {?}
     */
    JsonPointer.insertCopy = /**
     * 'insertCopy' function
     *
     * Calls 'setCopy' with insert = TRUE
     *
     * //  { object } object - object to insert value in
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //   value - value to insert
     * // { object }
     * @param {?} object
     * @param {?} pointer
     * @param {?} value
     * @return {?}
     */
    function (object, pointer, value) {
        /** @type {?} */
        var updatedObject = this.setCopy(object, pointer, value, true);
        return updatedObject;
    };
    /**
     * 'remove' function
     *
     * Uses a JSON Pointer to remove a key and its attribute from an object
     *
     * //  { object } object - object to delete attribute from
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * // { object }
     */
    /**
     * 'remove' function
     *
     * Uses a JSON Pointer to remove a key and its attribute from an object
     *
     * //  { object } object - object to delete attribute from
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * // { object }
     * @param {?} object
     * @param {?} pointer
     * @return {?}
     */
    JsonPointer.remove = /**
     * 'remove' function
     *
     * Uses a JSON Pointer to remove a key and its attribute from an object
     *
     * //  { object } object - object to delete attribute from
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * // { object }
     * @param {?} object
     * @param {?} pointer
     * @return {?}
     */
    function (object, pointer) {
        /** @type {?} */
        var keyArray = this.parse(pointer);
        if (keyArray !== null && keyArray.length) {
            /** @type {?} */
            var lastKey = keyArray.pop();
            /** @type {?} */
            var parentObject = this.get(object, keyArray);
            if (isArray(parentObject)) {
                if (lastKey === '-') {
                    lastKey = parentObject.length - 1;
                }
                parentObject.splice(lastKey, 1);
            }
            else if (isObject(parentObject)) {
                delete parentObject[lastKey];
            }
            return object;
        }
        console.error("remove error: Invalid JSON Pointer: " + pointer);
        return object;
    };
    /**
     * 'has' function
     *
     * Tests if an object has a value at the location specified by a JSON Pointer
     *
     * //  { object } object - object to chek for value
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * // { boolean }
     */
    /**
     * 'has' function
     *
     * Tests if an object has a value at the location specified by a JSON Pointer
     *
     * //  { object } object - object to chek for value
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * // { boolean }
     * @param {?} object
     * @param {?} pointer
     * @return {?}
     */
    JsonPointer.has = /**
     * 'has' function
     *
     * Tests if an object has a value at the location specified by a JSON Pointer
     *
     * //  { object } object - object to chek for value
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * // { boolean }
     * @param {?} object
     * @param {?} pointer
     * @return {?}
     */
    function (object, pointer) {
        /** @type {?} */
        var hasValue = this.get(object, pointer, 0, null, true);
        return hasValue;
    };
    /**
     * 'dict' function
     *
     * Returns a (pointer -> value) dictionary for an object
     *
     * //  { object } object - The object to create a dictionary from
     * // { object } - The resulting dictionary object
     */
    /**
     * 'dict' function
     *
     * Returns a (pointer -> value) dictionary for an object
     *
     * //  { object } object - The object to create a dictionary from
     * // { object } - The resulting dictionary object
     * @param {?} object
     * @return {?}
     */
    JsonPointer.dict = /**
     * 'dict' function
     *
     * Returns a (pointer -> value) dictionary for an object
     *
     * //  { object } object - The object to create a dictionary from
     * // { object } - The resulting dictionary object
     * @param {?} object
     * @return {?}
     */
    function (object) {
        /** @type {?} */
        var results = {};
        this.forEachDeep(object, (/**
         * @param {?} value
         * @param {?} pointer
         * @return {?}
         */
        function (value, pointer) {
            if (typeof value !== 'object') {
                results[pointer] = value;
            }
        }));
        return results;
    };
    /**
     * 'forEachDeep' function
     *
     * Iterates over own enumerable properties of an object or items in an array
     * and invokes an iteratee function for each key/value or index/value pair.
     * By default, iterates over items within objects and arrays after calling
     * the iteratee function on the containing object or array itself.
     *
     * The iteratee is invoked with three arguments: (value, pointer, rootObject),
     * where pointer is a JSON pointer indicating the location of the current
     * value within the root object, and rootObject is the root object initially
     * submitted to th function.
     *
     * If a third optional parameter 'bottomUp' is set to TRUE, the iterator
     * function will be called on sub-objects and arrays after being
     * called on their contents, rather than before, which is the default.
     *
     * This function can also optionally be called directly on a sub-object by
     * including optional 4th and 5th parameterss to specify the initial
     * root object and pointer.
     *
     * //  { object } object - the initial object or array
     * //  { (v: any, p?: string, o?: any) => any } function - iteratee function
     * //  { boolean = false } bottomUp - optional, set to TRUE to reverse direction
     * //  { object = object } rootObject - optional, root object or array
     * //  { string = '' } pointer - optional, JSON Pointer to object within rootObject
     * // { object } - The modified object
     */
    /**
     * 'forEachDeep' function
     *
     * Iterates over own enumerable properties of an object or items in an array
     * and invokes an iteratee function for each key/value or index/value pair.
     * By default, iterates over items within objects and arrays after calling
     * the iteratee function on the containing object or array itself.
     *
     * The iteratee is invoked with three arguments: (value, pointer, rootObject),
     * where pointer is a JSON pointer indicating the location of the current
     * value within the root object, and rootObject is the root object initially
     * submitted to th function.
     *
     * If a third optional parameter 'bottomUp' is set to TRUE, the iterator
     * function will be called on sub-objects and arrays after being
     * called on their contents, rather than before, which is the default.
     *
     * This function can also optionally be called directly on a sub-object by
     * including optional 4th and 5th parameterss to specify the initial
     * root object and pointer.
     *
     * //  { object } object - the initial object or array
     * //  { (v: any, p?: string, o?: any) => any } function - iteratee function
     * //  { boolean = false } bottomUp - optional, set to TRUE to reverse direction
     * //  { object = object } rootObject - optional, root object or array
     * //  { string = '' } pointer - optional, JSON Pointer to object within rootObject
     * // { object } - The modified object
     * @param {?} object
     * @param {?=} fn
     * @param {?=} bottomUp
     * @param {?=} pointer
     * @param {?=} rootObject
     * @return {?}
     */
    JsonPointer.forEachDeep = /**
     * 'forEachDeep' function
     *
     * Iterates over own enumerable properties of an object or items in an array
     * and invokes an iteratee function for each key/value or index/value pair.
     * By default, iterates over items within objects and arrays after calling
     * the iteratee function on the containing object or array itself.
     *
     * The iteratee is invoked with three arguments: (value, pointer, rootObject),
     * where pointer is a JSON pointer indicating the location of the current
     * value within the root object, and rootObject is the root object initially
     * submitted to th function.
     *
     * If a third optional parameter 'bottomUp' is set to TRUE, the iterator
     * function will be called on sub-objects and arrays after being
     * called on their contents, rather than before, which is the default.
     *
     * This function can also optionally be called directly on a sub-object by
     * including optional 4th and 5th parameterss to specify the initial
     * root object and pointer.
     *
     * //  { object } object - the initial object or array
     * //  { (v: any, p?: string, o?: any) => any } function - iteratee function
     * //  { boolean = false } bottomUp - optional, set to TRUE to reverse direction
     * //  { object = object } rootObject - optional, root object or array
     * //  { string = '' } pointer - optional, JSON Pointer to object within rootObject
     * // { object } - The modified object
     * @param {?} object
     * @param {?=} fn
     * @param {?=} bottomUp
     * @param {?=} pointer
     * @param {?=} rootObject
     * @return {?}
     */
    function (object, fn, bottomUp, pointer, rootObject) {
        var e_4, _a;
        if (fn === void 0) { fn = (/**
         * @param {?} v
         * @return {?}
         */
        function (v) { return v; }); }
        if (bottomUp === void 0) { bottomUp = false; }
        if (pointer === void 0) { pointer = ''; }
        if (rootObject === void 0) { rootObject = object; }
        if (typeof fn !== 'function') {
            console.error("forEachDeep error: Iterator is not a function:", fn);
            return;
        }
        if (!bottomUp) {
            fn(object, pointer, rootObject);
        }
        if (isObject(object) || isArray(object)) {
            try {
                for (var _b = tslib_1.__values(Object.keys(object)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var key = _c.value;
                    /** @type {?} */
                    var newPointer = pointer + '/' + this.escape(key);
                    this.forEachDeep(object[key], fn, bottomUp, newPointer, rootObject);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        if (bottomUp) {
            fn(object, pointer, rootObject);
        }
    };
    /**
     * 'forEachDeepCopy' function
     *
     * Similar to forEachDeep, but returns a copy of the original object, with
     * the same keys and indexes, but with values replaced with the result of
     * the iteratee function.
     *
     * //  { object } object - the initial object or array
     * //  { (v: any, k?: string, o?: any, p?: any) => any } function - iteratee function
     * //  { boolean = false } bottomUp - optional, set to TRUE to reverse direction
     * //  { object = object } rootObject - optional, root object or array
     * //  { string = '' } pointer - optional, JSON Pointer to object within rootObject
     * // { object } - The copied object
     */
    /**
     * 'forEachDeepCopy' function
     *
     * Similar to forEachDeep, but returns a copy of the original object, with
     * the same keys and indexes, but with values replaced with the result of
     * the iteratee function.
     *
     * //  { object } object - the initial object or array
     * //  { (v: any, k?: string, o?: any, p?: any) => any } function - iteratee function
     * //  { boolean = false } bottomUp - optional, set to TRUE to reverse direction
     * //  { object = object } rootObject - optional, root object or array
     * //  { string = '' } pointer - optional, JSON Pointer to object within rootObject
     * // { object } - The copied object
     * @param {?} object
     * @param {?=} fn
     * @param {?=} bottomUp
     * @param {?=} pointer
     * @param {?=} rootObject
     * @return {?}
     */
    JsonPointer.forEachDeepCopy = /**
     * 'forEachDeepCopy' function
     *
     * Similar to forEachDeep, but returns a copy of the original object, with
     * the same keys and indexes, but with values replaced with the result of
     * the iteratee function.
     *
     * //  { object } object - the initial object or array
     * //  { (v: any, k?: string, o?: any, p?: any) => any } function - iteratee function
     * //  { boolean = false } bottomUp - optional, set to TRUE to reverse direction
     * //  { object = object } rootObject - optional, root object or array
     * //  { string = '' } pointer - optional, JSON Pointer to object within rootObject
     * // { object } - The copied object
     * @param {?} object
     * @param {?=} fn
     * @param {?=} bottomUp
     * @param {?=} pointer
     * @param {?=} rootObject
     * @return {?}
     */
    function (object, fn, bottomUp, pointer, rootObject) {
        var e_5, _a;
        if (fn === void 0) { fn = (/**
         * @param {?} v
         * @return {?}
         */
        function (v) { return v; }); }
        if (bottomUp === void 0) { bottomUp = false; }
        if (pointer === void 0) { pointer = ''; }
        if (rootObject === void 0) { rootObject = object; }
        if (typeof fn !== 'function') {
            console.error("forEachDeepCopy error: Iterator is not a function:", fn);
            return null;
        }
        if (isObject(object) || isArray(object)) {
            /** @type {?} */
            var newObject = isArray(object) ? tslib_1.__spread(object) : tslib_1.__assign({}, object);
            if (!bottomUp) {
                newObject = fn(newObject, pointer, rootObject);
            }
            try {
                for (var _b = tslib_1.__values(Object.keys(newObject)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var key = _c.value;
                    /** @type {?} */
                    var newPointer = pointer + '/' + this.escape(key);
                    newObject[key] = this.forEachDeepCopy(newObject[key], fn, bottomUp, newPointer, rootObject);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_5) throw e_5.error; }
            }
            if (bottomUp) {
                newObject = fn(newObject, pointer, rootObject);
            }
            return newObject;
        }
        else {
            return fn(object, pointer, rootObject);
        }
    };
    /**
     * 'escape' function
     *
     * Escapes a string reference key
     *
     * //  { string } key - string key to escape
     * // { string } - escaped key
     */
    /**
     * 'escape' function
     *
     * Escapes a string reference key
     *
     * //  { string } key - string key to escape
     * // { string } - escaped key
     * @param {?} key
     * @return {?}
     */
    JsonPointer.escape = /**
     * 'escape' function
     *
     * Escapes a string reference key
     *
     * //  { string } key - string key to escape
     * // { string } - escaped key
     * @param {?} key
     * @return {?}
     */
    function (key) {
        /** @type {?} */
        var escaped = key.toString().replace(/~/g, '~0').replace(/\//g, '~1');
        return escaped;
    };
    /**
     * 'unescape' function
     *
     * Unescapes a string reference key
     *
     * //  { string } key - string key to unescape
     * // { string } - unescaped key
     */
    /**
     * 'unescape' function
     *
     * Unescapes a string reference key
     *
     * //  { string } key - string key to unescape
     * // { string } - unescaped key
     * @param {?} key
     * @return {?}
     */
    JsonPointer.unescape = /**
     * 'unescape' function
     *
     * Unescapes a string reference key
     *
     * //  { string } key - string key to unescape
     * // { string } - unescaped key
     * @param {?} key
     * @return {?}
     */
    function (key) {
        /** @type {?} */
        var unescaped = key.toString().replace(/~1/g, '/').replace(/~0/g, '~');
        return unescaped;
    };
    /**
     * 'parse' function
     *
     * Converts a string JSON Pointer into a array of keys
     * (if input is already an an array of keys, it is returned unchanged)
     *
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { string[] } - JSON Pointer array of keys
     */
    /**
     * 'parse' function
     *
     * Converts a string JSON Pointer into a array of keys
     * (if input is already an an array of keys, it is returned unchanged)
     *
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { string[] } - JSON Pointer array of keys
     * @param {?} pointer
     * @param {?=} errors
     * @return {?}
     */
    JsonPointer.parse = /**
     * 'parse' function
     *
     * Converts a string JSON Pointer into a array of keys
     * (if input is already an an array of keys, it is returned unchanged)
     *
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { string[] } - JSON Pointer array of keys
     * @param {?} pointer
     * @param {?=} errors
     * @return {?}
     */
    function (pointer, errors) {
        if (errors === void 0) { errors = false; }
        if (!this.isJsonPointer(pointer)) {
            if (errors) {
                console.error("parse error: Invalid JSON Pointer: " + pointer);
            }
            return null;
        }
        if (isArray(pointer)) {
            return (/** @type {?} */ (pointer));
        }
        if (typeof pointer === 'string') {
            if (((/** @type {?} */ (pointer)))[0] === '#') {
                pointer = pointer.slice(1);
            }
            if ((/** @type {?} */ (pointer)) === '' || (/** @type {?} */ (pointer)) === '/') {
                return [];
            }
            return ((/** @type {?} */ (pointer))).slice(1).split('/').map(this.unescape);
        }
    };
    /**
     * 'compile' function
     *
     * Converts an array of keys into a JSON Pointer string
     * (if input is already a string, it is normalized and returned)
     *
     * The optional second parameter is a default which will replace any empty keys.
     *
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { string | number = '' } defaultValue - Default value
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { string } - JSON Pointer string
     */
    /**
     * 'compile' function
     *
     * Converts an array of keys into a JSON Pointer string
     * (if input is already a string, it is normalized and returned)
     *
     * The optional second parameter is a default which will replace any empty keys.
     *
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { string | number = '' } defaultValue - Default value
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { string } - JSON Pointer string
     * @param {?} pointer
     * @param {?=} defaultValue
     * @param {?=} errors
     * @return {?}
     */
    JsonPointer.compile = /**
     * 'compile' function
     *
     * Converts an array of keys into a JSON Pointer string
     * (if input is already a string, it is normalized and returned)
     *
     * The optional second parameter is a default which will replace any empty keys.
     *
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { string | number = '' } defaultValue - Default value
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { string } - JSON Pointer string
     * @param {?} pointer
     * @param {?=} defaultValue
     * @param {?=} errors
     * @return {?}
     */
    function (pointer, defaultValue, errors) {
        var _this = this;
        if (defaultValue === void 0) { defaultValue = ''; }
        if (errors === void 0) { errors = false; }
        if (pointer === '#') {
            return '';
        }
        if (!this.isJsonPointer(pointer)) {
            if (errors) {
                console.error("compile error: Invalid JSON Pointer: " + pointer);
            }
            return null;
        }
        if (isArray(pointer)) {
            if (((/** @type {?} */ (pointer))).length === 0) {
                return '';
            }
            return '/' + ((/** @type {?} */ (pointer))).map((/**
             * @param {?} key
             * @return {?}
             */
            function (key) { return key === '' ? defaultValue : _this.escape(key); })).join('/');
        }
        if (typeof pointer === 'string') {
            if (pointer[0] === '#') {
                pointer = pointer.slice(1);
            }
            return pointer;
        }
    };
    /**
     * 'toKey' function
     *
     * Extracts name of the final key from a JSON Pointer.
     *
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { string } - the extracted key
     */
    /**
     * 'toKey' function
     *
     * Extracts name of the final key from a JSON Pointer.
     *
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { string } - the extracted key
     * @param {?} pointer
     * @param {?=} errors
     * @return {?}
     */
    JsonPointer.toKey = /**
     * 'toKey' function
     *
     * Extracts name of the final key from a JSON Pointer.
     *
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { string } - the extracted key
     * @param {?} pointer
     * @param {?=} errors
     * @return {?}
     */
    function (pointer, errors) {
        if (errors === void 0) { errors = false; }
        /** @type {?} */
        var keyArray = this.parse(pointer, errors);
        if (keyArray === null) {
            return null;
        }
        if (!keyArray.length) {
            return '';
        }
        return keyArray[keyArray.length - 1];
    };
    /**
     * 'isJsonPointer' function
     *
     * Checks a string or array value to determine if it is a valid JSON Pointer.
     * Returns true if a string is empty, or starts with '/' or '#/'.
     * Returns true if an array contains only string values.
     *
     * //   value - value to check
     * // { boolean } - true if value is a valid JSON Pointer, otherwise false
     */
    /**
     * 'isJsonPointer' function
     *
     * Checks a string or array value to determine if it is a valid JSON Pointer.
     * Returns true if a string is empty, or starts with '/' or '#/'.
     * Returns true if an array contains only string values.
     *
     * //   value - value to check
     * // { boolean } - true if value is a valid JSON Pointer, otherwise false
     * @param {?} value
     * @return {?}
     */
    JsonPointer.isJsonPointer = /**
     * 'isJsonPointer' function
     *
     * Checks a string or array value to determine if it is a valid JSON Pointer.
     * Returns true if a string is empty, or starts with '/' or '#/'.
     * Returns true if an array contains only string values.
     *
     * //   value - value to check
     * // { boolean } - true if value is a valid JSON Pointer, otherwise false
     * @param {?} value
     * @return {?}
     */
    function (value) {
        if (isArray(value)) {
            return value.every((/**
             * @param {?} key
             * @return {?}
             */
            function (key) { return typeof key === 'string'; }));
        }
        else if (isString(value)) {
            if (value === '' || value === '#') {
                return true;
            }
            if (value[0] === '/' || value.slice(0, 2) === '#/') {
                return !/(~[^01]|~$)/g.test(value);
            }
        }
        return false;
    };
    /**
     * 'isSubPointer' function
     *
     * Checks whether one JSON Pointer is a subset of another.
     *
     * //  { Pointer } shortPointer - potential subset JSON Pointer
     * //  { Pointer } longPointer - potential superset JSON Pointer
     * //  { boolean = false } trueIfMatching - return true if pointers match?
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { boolean } - true if shortPointer is a subset of longPointer, false if not
     */
    /**
     * 'isSubPointer' function
     *
     * Checks whether one JSON Pointer is a subset of another.
     *
     * //  { Pointer } shortPointer - potential subset JSON Pointer
     * //  { Pointer } longPointer - potential superset JSON Pointer
     * //  { boolean = false } trueIfMatching - return true if pointers match?
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { boolean } - true if shortPointer is a subset of longPointer, false if not
     * @param {?} shortPointer
     * @param {?} longPointer
     * @param {?=} trueIfMatching
     * @param {?=} errors
     * @return {?}
     */
    JsonPointer.isSubPointer = /**
     * 'isSubPointer' function
     *
     * Checks whether one JSON Pointer is a subset of another.
     *
     * //  { Pointer } shortPointer - potential subset JSON Pointer
     * //  { Pointer } longPointer - potential superset JSON Pointer
     * //  { boolean = false } trueIfMatching - return true if pointers match?
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { boolean } - true if shortPointer is a subset of longPointer, false if not
     * @param {?} shortPointer
     * @param {?} longPointer
     * @param {?=} trueIfMatching
     * @param {?=} errors
     * @return {?}
     */
    function (shortPointer, longPointer, trueIfMatching, errors) {
        if (trueIfMatching === void 0) { trueIfMatching = false; }
        if (errors === void 0) { errors = false; }
        if (!this.isJsonPointer(shortPointer) || !this.isJsonPointer(longPointer)) {
            if (errors) {
                /** @type {?} */
                var invalid = '';
                if (!this.isJsonPointer(shortPointer)) {
                    invalid += " 1: " + shortPointer;
                }
                if (!this.isJsonPointer(longPointer)) {
                    invalid += " 2: " + longPointer;
                }
                console.error("isSubPointer error: Invalid JSON Pointer " + invalid);
            }
            return;
        }
        shortPointer = this.compile(shortPointer, '', errors);
        longPointer = this.compile(longPointer, '', errors);
        return shortPointer === longPointer ? trueIfMatching :
            shortPointer + "/" === longPointer.slice(0, shortPointer.length + 1);
    };
    /**
     * 'toIndexedPointer' function
     *
     * Merges an array of numeric indexes and a generic pointer to create an
     * indexed pointer for a specific item.
     *
     * For example, merging the generic pointer '/foo/-/bar/-/baz' and
     * the array [4, 2] would result in the indexed pointer '/foo/4/bar/2/baz'
     *
     *
     * //  { Pointer } genericPointer - The generic pointer
     * //  { number[] } indexArray - The array of numeric indexes
     * //  { Map<string, number> } arrayMap - An optional array map
     * // { string } - The merged pointer with indexes
     */
    /**
     * 'toIndexedPointer' function
     *
     * Merges an array of numeric indexes and a generic pointer to create an
     * indexed pointer for a specific item.
     *
     * For example, merging the generic pointer '/foo/-/bar/-/baz' and
     * the array [4, 2] would result in the indexed pointer '/foo/4/bar/2/baz'
     *
     *
     * //  { Pointer } genericPointer - The generic pointer
     * //  { number[] } indexArray - The array of numeric indexes
     * //  { Map<string, number> } arrayMap - An optional array map
     * // { string } - The merged pointer with indexes
     * @param {?} genericPointer
     * @param {?} indexArray
     * @param {?=} arrayMap
     * @return {?}
     */
    JsonPointer.toIndexedPointer = /**
     * 'toIndexedPointer' function
     *
     * Merges an array of numeric indexes and a generic pointer to create an
     * indexed pointer for a specific item.
     *
     * For example, merging the generic pointer '/foo/-/bar/-/baz' and
     * the array [4, 2] would result in the indexed pointer '/foo/4/bar/2/baz'
     *
     *
     * //  { Pointer } genericPointer - The generic pointer
     * //  { number[] } indexArray - The array of numeric indexes
     * //  { Map<string, number> } arrayMap - An optional array map
     * // { string } - The merged pointer with indexes
     * @param {?} genericPointer
     * @param {?} indexArray
     * @param {?=} arrayMap
     * @return {?}
     */
    function (genericPointer, indexArray, arrayMap) {
        var e_6, _a;
        if (arrayMap === void 0) { arrayMap = null; }
        if (this.isJsonPointer(genericPointer) && isArray(indexArray)) {
            /** @type {?} */
            var indexedPointer_1 = this.compile(genericPointer);
            if (isMap(arrayMap)) {
                /** @type {?} */
                var arrayIndex_1 = 0;
                return indexedPointer_1.replace(/\/\-(?=\/|$)/g, (/**
                 * @param {?} key
                 * @param {?} stringIndex
                 * @return {?}
                 */
                function (key, stringIndex) {
                    return arrayMap.has(((/** @type {?} */ (indexedPointer_1))).slice(0, stringIndex)) ?
                        '/' + indexArray[arrayIndex_1++] : key;
                }));
            }
            else {
                try {
                    for (var indexArray_1 = tslib_1.__values(indexArray), indexArray_1_1 = indexArray_1.next(); !indexArray_1_1.done; indexArray_1_1 = indexArray_1.next()) {
                        var pointerIndex = indexArray_1_1.value;
                        indexedPointer_1 = indexedPointer_1.replace('/-', '/' + pointerIndex);
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (indexArray_1_1 && !indexArray_1_1.done && (_a = indexArray_1.return)) _a.call(indexArray_1);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
                return indexedPointer_1;
            }
        }
        if (!this.isJsonPointer(genericPointer)) {
            console.error("toIndexedPointer error: Invalid JSON Pointer: " + genericPointer);
        }
        if (!isArray(indexArray)) {
            console.error("toIndexedPointer error: Invalid indexArray: " + indexArray);
        }
    };
    /**
     * 'toGenericPointer' function
     *
     * Compares an indexed pointer to an array map and removes list array
     * indexes (but leaves tuple arrray indexes and all object keys, including
     * numeric keys) to create a generic pointer.
     *
     * For example, using the indexed pointer '/foo/1/bar/2/baz/3' and
     * the arrayMap [['/foo', 0], ['/foo/-/bar', 3], ['/foo/-/bar/-/baz', 0]]
     * would result in the generic pointer '/foo/-/bar/2/baz/-'
     * Using the indexed pointer '/foo/1/bar/4/baz/3' and the same arrayMap
     * would result in the generic pointer '/foo/-/bar/-/baz/-'
     * (the bar array has 3 tuple items, so index 2 is retained, but 4 is removed)
     *
     * The structure of the arrayMap is: [['path to array', number of tuple items]...]
     *
     *
     * //  { Pointer } indexedPointer - The indexed pointer (array or string)
     * //  { Map<string, number> } arrayMap - The optional array map (for preserving tuple indexes)
     * // { string } - The generic pointer with indexes removed
     */
    /**
     * 'toGenericPointer' function
     *
     * Compares an indexed pointer to an array map and removes list array
     * indexes (but leaves tuple arrray indexes and all object keys, including
     * numeric keys) to create a generic pointer.
     *
     * For example, using the indexed pointer '/foo/1/bar/2/baz/3' and
     * the arrayMap [['/foo', 0], ['/foo/-/bar', 3], ['/foo/-/bar/-/baz', 0]]
     * would result in the generic pointer '/foo/-/bar/2/baz/-'
     * Using the indexed pointer '/foo/1/bar/4/baz/3' and the same arrayMap
     * would result in the generic pointer '/foo/-/bar/-/baz/-'
     * (the bar array has 3 tuple items, so index 2 is retained, but 4 is removed)
     *
     * The structure of the arrayMap is: [['path to array', number of tuple items]...]
     *
     *
     * //  { Pointer } indexedPointer - The indexed pointer (array or string)
     * //  { Map<string, number> } arrayMap - The optional array map (for preserving tuple indexes)
     * // { string } - The generic pointer with indexes removed
     * @param {?} indexedPointer
     * @param {?=} arrayMap
     * @return {?}
     */
    JsonPointer.toGenericPointer = /**
     * 'toGenericPointer' function
     *
     * Compares an indexed pointer to an array map and removes list array
     * indexes (but leaves tuple arrray indexes and all object keys, including
     * numeric keys) to create a generic pointer.
     *
     * For example, using the indexed pointer '/foo/1/bar/2/baz/3' and
     * the arrayMap [['/foo', 0], ['/foo/-/bar', 3], ['/foo/-/bar/-/baz', 0]]
     * would result in the generic pointer '/foo/-/bar/2/baz/-'
     * Using the indexed pointer '/foo/1/bar/4/baz/3' and the same arrayMap
     * would result in the generic pointer '/foo/-/bar/-/baz/-'
     * (the bar array has 3 tuple items, so index 2 is retained, but 4 is removed)
     *
     * The structure of the arrayMap is: [['path to array', number of tuple items]...]
     *
     *
     * //  { Pointer } indexedPointer - The indexed pointer (array or string)
     * //  { Map<string, number> } arrayMap - The optional array map (for preserving tuple indexes)
     * // { string } - The generic pointer with indexes removed
     * @param {?} indexedPointer
     * @param {?=} arrayMap
     * @return {?}
     */
    function (indexedPointer, arrayMap) {
        if (arrayMap === void 0) { arrayMap = new Map(); }
        if (this.isJsonPointer(indexedPointer) && isMap(arrayMap)) {
            /** @type {?} */
            var pointerArray = this.parse(indexedPointer);
            for (var i = 1; i < pointerArray.length; i++) {
                /** @type {?} */
                var subPointer = this.compile(pointerArray.slice(0, i));
                if (arrayMap.has(subPointer) &&
                    arrayMap.get(subPointer) <= +pointerArray[i]) {
                    pointerArray[i] = '-';
                }
            }
            return this.compile(pointerArray);
        }
        if (!this.isJsonPointer(indexedPointer)) {
            console.error("toGenericPointer error: invalid JSON Pointer: " + indexedPointer);
        }
        if (!isMap(arrayMap)) {
            console.error("toGenericPointer error: invalid arrayMap: " + arrayMap);
        }
    };
    /**
     * 'toControlPointer' function
     *
     * Accepts a JSON Pointer for a data object and returns a JSON Pointer for the
     * matching control in an Angular FormGroup.
     *
     * //  { Pointer } dataPointer - JSON Pointer (string or array) to a data object
     * //  { FormGroup } formGroup - Angular FormGroup to get value from
     * //  { boolean = false } controlMustExist - Only return if control exists?
     * // { Pointer } - JSON Pointer (string) to the formGroup object
     */
    /**
     * 'toControlPointer' function
     *
     * Accepts a JSON Pointer for a data object and returns a JSON Pointer for the
     * matching control in an Angular FormGroup.
     *
     * //  { Pointer } dataPointer - JSON Pointer (string or array) to a data object
     * //  { FormGroup } formGroup - Angular FormGroup to get value from
     * //  { boolean = false } controlMustExist - Only return if control exists?
     * // { Pointer } - JSON Pointer (string) to the formGroup object
     * @param {?} dataPointer
     * @param {?} formGroup
     * @param {?=} controlMustExist
     * @return {?}
     */
    JsonPointer.toControlPointer = /**
     * 'toControlPointer' function
     *
     * Accepts a JSON Pointer for a data object and returns a JSON Pointer for the
     * matching control in an Angular FormGroup.
     *
     * //  { Pointer } dataPointer - JSON Pointer (string or array) to a data object
     * //  { FormGroup } formGroup - Angular FormGroup to get value from
     * //  { boolean = false } controlMustExist - Only return if control exists?
     * // { Pointer } - JSON Pointer (string) to the formGroup object
     * @param {?} dataPointer
     * @param {?} formGroup
     * @param {?=} controlMustExist
     * @return {?}
     */
    function (dataPointer, formGroup, controlMustExist) {
        var e_7, _a;
        if (controlMustExist === void 0) { controlMustExist = false; }
        /** @type {?} */
        var dataPointerArray = this.parse(dataPointer);
        /** @type {?} */
        var controlPointerArray = [];
        /** @type {?} */
        var subGroup = formGroup;
        if (dataPointerArray !== null) {
            try {
                for (var dataPointerArray_1 = tslib_1.__values(dataPointerArray), dataPointerArray_1_1 = dataPointerArray_1.next(); !dataPointerArray_1_1.done; dataPointerArray_1_1 = dataPointerArray_1.next()) {
                    var key = dataPointerArray_1_1.value;
                    if (hasOwn(subGroup, 'controls')) {
                        controlPointerArray.push('controls');
                        subGroup = subGroup.controls;
                    }
                    if (isArray(subGroup) && (key === '-')) {
                        controlPointerArray.push((subGroup.length - 1).toString());
                        subGroup = subGroup[subGroup.length - 1];
                    }
                    else if (hasOwn(subGroup, key)) {
                        controlPointerArray.push(key);
                        subGroup = subGroup[key];
                    }
                    else if (controlMustExist) {
                        console.error("toControlPointer error: Unable to find \"" + key + "\" item in FormGroup.");
                        console.error(dataPointer);
                        console.error(formGroup);
                        return;
                    }
                    else {
                        controlPointerArray.push(key);
                        subGroup = { controls: {} };
                    }
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (dataPointerArray_1_1 && !dataPointerArray_1_1.done && (_a = dataPointerArray_1.return)) _a.call(dataPointerArray_1);
                }
                finally { if (e_7) throw e_7.error; }
            }
            return this.compile(controlPointerArray);
        }
        console.error("toControlPointer error: Invalid JSON Pointer: " + dataPointer);
    };
    /**
     * 'toSchemaPointer' function
     *
     * Accepts a JSON Pointer to a value inside a data object and a JSON schema
     * for that object.
     *
     * Returns a Pointer to the sub-schema for the value inside the object's schema.
     *
     * //  { Pointer } dataPointer - JSON Pointer (string or array) to an object
     * //   schema - JSON schema for the object
     * // { Pointer } - JSON Pointer (string) to the object's schema
     */
    /**
     * 'toSchemaPointer' function
     *
     * Accepts a JSON Pointer to a value inside a data object and a JSON schema
     * for that object.
     *
     * Returns a Pointer to the sub-schema for the value inside the object's schema.
     *
     * //  { Pointer } dataPointer - JSON Pointer (string or array) to an object
     * //   schema - JSON schema for the object
     * // { Pointer } - JSON Pointer (string) to the object's schema
     * @param {?} dataPointer
     * @param {?} schema
     * @return {?}
     */
    JsonPointer.toSchemaPointer = /**
     * 'toSchemaPointer' function
     *
     * Accepts a JSON Pointer to a value inside a data object and a JSON schema
     * for that object.
     *
     * Returns a Pointer to the sub-schema for the value inside the object's schema.
     *
     * //  { Pointer } dataPointer - JSON Pointer (string or array) to an object
     * //   schema - JSON schema for the object
     * // { Pointer } - JSON Pointer (string) to the object's schema
     * @param {?} dataPointer
     * @param {?} schema
     * @return {?}
     */
    function (dataPointer, schema) {
        if (this.isJsonPointer(dataPointer) && typeof schema === 'object') {
            /** @type {?} */
            var pointerArray = this.parse(dataPointer);
            if (!pointerArray.length) {
                return '';
            }
            /** @type {?} */
            var firstKey = pointerArray.shift();
            if (schema.type === 'object' || schema.properties || schema.additionalProperties) {
                if ((schema.properties || {})[firstKey]) {
                    return "/properties/" + this.escape(firstKey) +
                        this.toSchemaPointer(pointerArray, schema.properties[firstKey]);
                }
                else if (schema.additionalProperties) {
                    return '/additionalProperties' +
                        this.toSchemaPointer(pointerArray, schema.additionalProperties);
                }
            }
            if ((schema.type === 'array' || schema.items) &&
                (isNumber(firstKey) || firstKey === '-' || firstKey === '')) {
                /** @type {?} */
                var arrayItem = firstKey === '-' || firstKey === '' ? 0 : +firstKey;
                if (isArray(schema.items)) {
                    if (arrayItem < schema.items.length) {
                        return '/items/' + arrayItem +
                            this.toSchemaPointer(pointerArray, schema.items[arrayItem]);
                    }
                    else if (schema.additionalItems) {
                        return '/additionalItems' +
                            this.toSchemaPointer(pointerArray, schema.additionalItems);
                    }
                }
                else if (isObject(schema.items)) {
                    return '/items' + this.toSchemaPointer(pointerArray, schema.items);
                }
                else if (isObject(schema.additionalItems)) {
                    return '/additionalItems' +
                        this.toSchemaPointer(pointerArray, schema.additionalItems);
                }
            }
            console.error("toSchemaPointer error: Data pointer " + dataPointer + " " +
                ("not compatible with schema " + schema));
            return null;
        }
        if (!this.isJsonPointer(dataPointer)) {
            console.error("toSchemaPointer error: Invalid JSON Pointer: " + dataPointer);
        }
        if (typeof schema !== 'object') {
            console.error("toSchemaPointer error: Invalid JSON Schema: " + schema);
        }
        return null;
    };
    /**
     * 'toDataPointer' function
     *
     * Accepts a JSON Pointer to a sub-schema inside a JSON schema and the schema.
     *
     * If possible, returns a generic Pointer to the corresponding value inside
     * the data object described by the JSON schema.
     *
     * Returns null if the sub-schema is in an ambiguous location (such as
     * definitions or additionalProperties) where the corresponding value
     * location cannot be determined.
     *
     * //  { Pointer } schemaPointer - JSON Pointer (string or array) to a JSON schema
     * //   schema - the JSON schema
     * //  { boolean = false } errors - Show errors?
     * // { Pointer } - JSON Pointer (string) to the value in the data object
     */
    /**
     * 'toDataPointer' function
     *
     * Accepts a JSON Pointer to a sub-schema inside a JSON schema and the schema.
     *
     * If possible, returns a generic Pointer to the corresponding value inside
     * the data object described by the JSON schema.
     *
     * Returns null if the sub-schema is in an ambiguous location (such as
     * definitions or additionalProperties) where the corresponding value
     * location cannot be determined.
     *
     * //  { Pointer } schemaPointer - JSON Pointer (string or array) to a JSON schema
     * //   schema - the JSON schema
     * //  { boolean = false } errors - Show errors?
     * // { Pointer } - JSON Pointer (string) to the value in the data object
     * @param {?} schemaPointer
     * @param {?} schema
     * @param {?=} errors
     * @return {?}
     */
    JsonPointer.toDataPointer = /**
     * 'toDataPointer' function
     *
     * Accepts a JSON Pointer to a sub-schema inside a JSON schema and the schema.
     *
     * If possible, returns a generic Pointer to the corresponding value inside
     * the data object described by the JSON schema.
     *
     * Returns null if the sub-schema is in an ambiguous location (such as
     * definitions or additionalProperties) where the corresponding value
     * location cannot be determined.
     *
     * //  { Pointer } schemaPointer - JSON Pointer (string or array) to a JSON schema
     * //   schema - the JSON schema
     * //  { boolean = false } errors - Show errors?
     * // { Pointer } - JSON Pointer (string) to the value in the data object
     * @param {?} schemaPointer
     * @param {?} schema
     * @param {?=} errors
     * @return {?}
     */
    function (schemaPointer, schema, errors) {
        if (errors === void 0) { errors = false; }
        if (this.isJsonPointer(schemaPointer) && typeof schema === 'object' &&
            this.has(schema, schemaPointer)) {
            /** @type {?} */
            var pointerArray = this.parse(schemaPointer);
            if (!pointerArray.length) {
                return '';
            }
            /** @type {?} */
            var firstKey = pointerArray.shift();
            if (firstKey === 'properties' ||
                (firstKey === 'items' && isArray(schema.items))) {
                /** @type {?} */
                var secondKey = pointerArray.shift();
                /** @type {?} */
                var pointerSuffix = this.toDataPointer(pointerArray, schema[firstKey][secondKey]);
                return pointerSuffix === null ? null : '/' + secondKey + pointerSuffix;
            }
            else if (firstKey === 'additionalItems' ||
                (firstKey === 'items' && isObject(schema.items))) {
                /** @type {?} */
                var pointerSuffix = this.toDataPointer(pointerArray, schema[firstKey]);
                return pointerSuffix === null ? null : '/-' + pointerSuffix;
            }
            else if (['allOf', 'anyOf', 'oneOf'].includes(firstKey)) {
                /** @type {?} */
                var secondKey = pointerArray.shift();
                return this.toDataPointer(pointerArray, schema[firstKey][secondKey]);
            }
            else if (firstKey === 'not') {
                return this.toDataPointer(pointerArray, schema[firstKey]);
            }
            else if (['contains', 'definitions', 'dependencies', 'additionalItems',
                'additionalProperties', 'patternProperties', 'propertyNames'].includes(firstKey)) {
                if (errors) {
                    console.error("toDataPointer error: Ambiguous location");
                }
            }
            return '';
        }
        if (errors) {
            if (!this.isJsonPointer(schemaPointer)) {
                console.error("toDataPointer error: Invalid JSON Pointer: " + schemaPointer);
            }
            if (typeof schema !== 'object') {
                console.error("toDataPointer error: Invalid JSON Schema: " + schema);
            }
            if (typeof schema !== 'object') {
                console.error("toDataPointer error: Pointer " + schemaPointer + " invalid for Schema: " + schema);
            }
        }
        return null;
    };
    /**
     * 'parseObjectPath' function
     *
     * Parses a JavaScript object path into an array of keys, which
     * can then be passed to compile() to convert into a string JSON Pointer.
     *
     * Based on mike-marcacci's excellent objectpath parse function:
     * https://github.com/mike-marcacci/objectpath
     *
     * //  { Pointer } path - The object path to parse
     * // { string[] } - The resulting array of keys
     */
    /**
     * 'parseObjectPath' function
     *
     * Parses a JavaScript object path into an array of keys, which
     * can then be passed to compile() to convert into a string JSON Pointer.
     *
     * Based on mike-marcacci's excellent objectpath parse function:
     * https://github.com/mike-marcacci/objectpath
     *
     * //  { Pointer } path - The object path to parse
     * // { string[] } - The resulting array of keys
     * @param {?} path
     * @return {?}
     */
    JsonPointer.parseObjectPath = /**
     * 'parseObjectPath' function
     *
     * Parses a JavaScript object path into an array of keys, which
     * can then be passed to compile() to convert into a string JSON Pointer.
     *
     * Based on mike-marcacci's excellent objectpath parse function:
     * https://github.com/mike-marcacci/objectpath
     *
     * //  { Pointer } path - The object path to parse
     * // { string[] } - The resulting array of keys
     * @param {?} path
     * @return {?}
     */
    function (path) {
        if (isArray(path)) {
            return (/** @type {?} */ (path));
        }
        if (this.isJsonPointer(path)) {
            return this.parse(path);
        }
        if (typeof path === 'string') {
            /** @type {?} */
            var index = 0;
            /** @type {?} */
            var parts = [];
            while (index < path.length) {
                /** @type {?} */
                var nextDot = path.indexOf('.', index);
                /** @type {?} */
                var nextOB = path.indexOf('[', index);
                if (nextDot === -1 && nextOB === -1) { // last item
                    parts.push(path.slice(index));
                    index = path.length;
                }
                else if (nextDot !== -1 && (nextDot < nextOB || nextOB === -1)) { // dot notation
                    parts.push(path.slice(index, nextDot));
                    index = nextDot + 1;
                }
                else { // bracket notation
                    if (nextOB > index) {
                        parts.push(path.slice(index, nextOB));
                        index = nextOB;
                    }
                    /** @type {?} */
                    var quote = path.charAt(nextOB + 1);
                    if (quote === '"' || quote === '\'') { // enclosing quotes
                        // enclosing quotes
                        /** @type {?} */
                        var nextCB = path.indexOf(quote + ']', nextOB);
                        while (nextCB !== -1 && path.charAt(nextCB - 1) === '\\') {
                            nextCB = path.indexOf(quote + ']', nextCB + 2);
                        }
                        if (nextCB === -1) {
                            nextCB = path.length;
                        }
                        parts.push(path.slice(index + 2, nextCB)
                            .replace(new RegExp('\\' + quote, 'g'), quote));
                        index = nextCB + 2;
                    }
                    else { // no enclosing quotes
                        // no enclosing quotes
                        /** @type {?} */
                        var nextCB = path.indexOf(']', nextOB);
                        if (nextCB === -1) {
                            nextCB = path.length;
                        }
                        parts.push(path.slice(index + 1, nextCB));
                        index = nextCB + 1;
                    }
                    if (path.charAt(index) === '.') {
                        index++;
                    }
                }
            }
            return parts;
        }
        console.error('parseObjectPath error: Input object path must be a string.');
    };
    JsonPointer.decorators = [
        { type: Injectable }
    ];
    return JsonPointer;
}());
export { JsonPointer };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbnBvaW50ZXIuZnVuY3Rpb25zLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFqc2YvY29yZS8iLCJzb3VyY2VzIjpbImxpYi9zaGFyZWQvanNvbnBvaW50ZXIuZnVuY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNMLGtCQUFrQixFQUNsQixJQUFJLEVBRUosaUJBQWlCLEVBQ2pCLDhCQUE4QixFQUM5QixNQUFNLEVBQ04sT0FBTyxFQUNQLFVBQVUsRUFDVixlQUFlLEVBQ2hCLE1BQU0scUJBQXFCLENBQUM7QUFDN0IsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFrQnZHO0lBQUE7SUFxOUJBLENBQUM7SUFsOUJDOzs7Ozs7Ozs7Ozs7T0FZRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQ0ksZUFBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBVixVQUNFLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBYyxFQUFFLFFBQXVCLEVBQ3hELFVBQWtCLEVBQUUsTUFBYzs7UUFEakIsMkJBQUEsRUFBQSxjQUFjO1FBQUUseUJBQUEsRUFBQSxlQUF1QjtRQUN4RCwyQkFBQSxFQUFBLGtCQUFrQjtRQUFFLHVCQUFBLEVBQUEsY0FBYztRQUVsQyxJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7WUFBRSxPQUFPLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7U0FBRTs7WUFDM0QsUUFBUSxHQUFVLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQztRQUNqRCxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFOztnQkFDL0MsU0FBUyxH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TSxDQUFDLENBQUMsQ0FBQzt3QkFDMUMsS0FBSyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7cUJBQ3BCO29CQUNELElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEVBQUU7d0JBQUUsS0FBSyxFQUFFLENBQUM7cUJBQUU7aUJBQzdDO2FBQ0Y7WUFDRCxPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsT0FBTyxDQUFDLEtBQUssQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO0lBQzlFLENBQUM7O2dCQXA5QkYsVUFBVTs7SUFxOUJYLGtCQUFDO0NBQUEsQUFyOUJELElBcTlCQztTQXA5QlksV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIGNsZWFuVmFsdWVPZlF1b3RlcyxcbiAgY29weSxcbiAgRXhwcmVzc2lvblR5cGUsXG4gIGdldEV4cHJlc3Npb25UeXBlLFxuICBnZXRLZXlBbmRWYWx1ZUJ5RXhwcmVzc2lvblR5cGUsXG4gIGhhc093bixcbiAgaXNFcXVhbCxcbiAgaXNOb3RFcXVhbCxcbiAgaXNOb3RFeHByZXNzaW9uXG59IGZyb20gJy4vdXRpbGl0eS5mdW5jdGlvbnMnO1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7aXNBcnJheSwgaXNEZWZpbmVkLCBpc0VtcHR5LCBpc01hcCwgaXNOdW1iZXIsIGlzT2JqZWN0LCBpc1N0cmluZ30gZnJvbSAnLi92YWxpZGF0b3IuZnVuY3Rpb25zJztcblxuLyoqXG4gKiAnSnNvblBvaW50ZXInIGNsYXNzXG4gKlxuICogU29tZSB1dGlsaXRpZXMgZm9yIHVzaW5nIEpTT04gUG9pbnRlcnMgd2l0aCBKU09OIG9iamVjdHNcbiAqIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM2OTAxXG4gKlxuICogZ2V0LCBnZXRDb3B5LCBnZXRGaXJzdCwgc2V0LCBzZXRDb3B5LCBpbnNlcnQsIGluc2VydENvcHksIHJlbW92ZSwgaGFzLCBkaWN0LFxuICogZm9yRWFjaERlZXAsIGZvckVhY2hEZWVwQ29weSwgZXNjYXBlLCB1bmVzY2FwZSwgcGFyc2UsIGNvbXBpbGUsIHRvS2V5LFxuICogaXNKc29uUG9pbnRlciwgaXNTdWJQb2ludGVyLCB0b0luZGV4ZWRQb2ludGVyLCB0b0dlbmVyaWNQb2ludGVyLFxuICogdG9Db250cm9sUG9pbnRlciwgdG9TY2hlbWFQb2ludGVyLCB0b0RhdGFQb2ludGVyLCBwYXJzZU9iamVjdFBhdGhcbiAqXG4gKiBTb21lIGZ1bmN0aW9ucyBiYXNlZCBvbiBtYW51ZWxzdG9mZXIncyBqc29uLXBvaW50ZXIgdXRpbGl0aWVzXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbWFudWVsc3RvZmVyL2pzb24tcG9pbnRlclxuICovXG5leHBvcnQgdHlwZSBQb2ludGVyID0gc3RyaW5nIHwgc3RyaW5nW107XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBKc29uUG9pbnRlciB7XG5cbiAgLyoqXG4gICAqICdnZXQnIGZ1bmN0aW9uXG4gICAqXG4gICAqIFVzZXMgYSBKU09OIFBvaW50ZXIgdG8gcmV0cmlldmUgYSB2YWx1ZSBmcm9tIGFuIG9iamVjdC5cbiAgICpcbiAgICogLy8gIHsgb2JqZWN0IH0gb2JqZWN0IC0gT2JqZWN0IHRvIGdldCB2YWx1ZSBmcm9tXG4gICAqIC8vICB7IFBvaW50ZXIgfSBwb2ludGVyIC0gSlNPTiBQb2ludGVyIChzdHJpbmcgb3IgYXJyYXkpXG4gICAqIC8vICB7IG51bWJlciA9IDAgfSBzdGFydFNsaWNlIC0gWmVyby1iYXNlZCBpbmRleCBvZiBmaXJzdCBQb2ludGVyIGtleSB0byB1c2VcbiAgICogLy8gIHsgbnVtYmVyIH0gZW5kU2xpY2UgLSBaZXJvLWJhc2VkIGluZGV4IG9mIGxhc3QgUG9pbnRlciBrZXkgdG8gdXNlXG4gICAqIC8vICB7IGJvb2xlYW4gPSBmYWxzZSB9IGdldEJvb2xlYW4gLSBSZXR1cm4gb25seSB0cnVlIG9yIGZhbHNlP1xuICAgKiAvLyAgeyBib29sZWFuID0gZmFsc2UgfSBlcnJvcnMgLSBTaG93IGVycm9yIGlmIG5vdCBmb3VuZD9cbiAgICogLy8geyBvYmplY3QgfSAtIExvY2F0ZWQgdmFsdWUgKG9yIHRydWUgb3IgZmFsc2UgaWYgZ2V0Qm9vbGVhbiA9IHRydWUpXG4gICAqL1xuICBzdGF0aWMgZ2V0KFxuICAgIG9iamVjdCwgcG9pbnRlciwgc3RhcnRTbGljZSA9IDAsIGVuZFNsaWNlOiBudW1iZXIgPSBudWxsLFxuICAgIGdldEJvb2xlYW4gPSBmYWxzZSwgZXJyb3JzID0gZmFsc2VcbiAgKSB7XG4gICAgaWYgKG9iamVjdCA9PT0gbnVsbCkgeyByZXR1cm4gZ2V0Qm9vbGVhbiA/IGZhbHNlIDogdW5kZWZpbmVkOyB9XG4gICAgbGV0IGtleUFycmF5OiBhbnlbXSA9IHRoaXMucGFyc2UocG9pbnRlciwgZXJyb3JzKTtcbiAgICBpZiAodHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYga2V5QXJyYXkgIT09IG51bGwpIHtcbiAgICAgIGxldCBzdWJPYmplY3QgPSBvYmplY3Q7XG4gICAgICBpZiAoc3RhcnRTbGljZSA+PSBrZXlBcnJheS5sZW5ndGggfHwgZW5kU2xpY2UgPD0gLWtleUFycmF5Lmxlbmd0aCkgeyByZXR1cm4gb2JqZWN0OyB9XG4gICAgICBpZiAoc3RhcnRTbGljZSA8PSAta2V5QXJyYXkubGVuZ3RoKSB7IHN0YXJ0U2xpY2UgPSAwOyB9XG4gICAgICBpZiAoIWlzRGVmaW5lZChlbmRTbGljZSkgfHwgZW5kU2xpY2UgPj0ga2V5QXJyYXkubGVuZ3RoKSB7IGVuZFNsaWNlID0ga2V5QXJyYXkubGVuZ3RoOyB9XG4gICAgICBrZXlBcnJheSA9IGtleUFycmF5LnNsaWNlKHN0YXJ0U2xpY2UsIGVuZFNsaWNlKTtcbiAgICAgIGZvciAobGV0IGtleSBvZiBrZXlBcnJheSkge1xuICAgICAgICBpZiAoa2V5ID09PSAnLScgJiYgaXNBcnJheShzdWJPYmplY3QpICYmIHN1Yk9iamVjdC5sZW5ndGgpIHtcbiAgICAgICAgICBrZXkgPSBzdWJPYmplY3QubGVuZ3RoIC0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNNYXAoc3ViT2JqZWN0KSAmJiBzdWJPYmplY3QuaGFzKGtleSkpIHtcbiAgICAgICAgICBzdWJPYmplY3QgPSBzdWJPYmplY3QuZ2V0KGtleSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHN1Yk9iamVjdCA9PT0gJ29iamVjdCcgJiYgc3ViT2JqZWN0ICE9PSBudWxsICYmXG4gICAgICAgICAgaGFzT3duKHN1Yk9iamVjdCwga2V5KVxuICAgICAgICApIHtcbiAgICAgICAgICBzdWJPYmplY3QgPSBzdWJPYmplY3Rba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBldmFsdWF0ZWRFeHByZXNzaW9uID0gSnNvblBvaW50ZXIuZXZhbHVhdGVFeHByZXNzaW9uKHN1Yk9iamVjdCwga2V5KTtcbiAgICAgICAgICBpZiAoZXZhbHVhdGVkRXhwcmVzc2lvbi5wYXNzZWQpIHtcbiAgICAgICAgICAgIHN1Yk9iamVjdCA9IGV2YWx1YXRlZEV4cHJlc3Npb24ua2V5ID8gc3ViT2JqZWN0W2V2YWx1YXRlZEV4cHJlc3Npb24ua2V5XSA6IHN1Yk9iamVjdDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2dFcnJvcnMoZXJyb3JzLCBrZXksIHBvaW50ZXIsIG9iamVjdCk7XG4gICAgICAgICAgICByZXR1cm4gZ2V0Qm9vbGVhbiA/IGZhbHNlIDogdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGdldEJvb2xlYW4gPyB0cnVlIDogc3ViT2JqZWN0O1xuICAgIH1cbiAgICBpZiAoZXJyb3JzICYmIGtleUFycmF5ID09PSBudWxsKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBnZXQgZXJyb3I6IEludmFsaWQgSlNPTiBQb2ludGVyOiAke3BvaW50ZXJ9YCk7XG4gICAgfVxuICAgIGlmIChlcnJvcnMgJiYgdHlwZW9mIG9iamVjdCAhPT0gJ29iamVjdCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2dldCBlcnJvcjogSW52YWxpZCBvYmplY3Q6Jyk7XG4gICAgICBjb25zb2xlLmVycm9yKG9iamVjdCk7XG4gICAgfVxuICAgIHJldHVybiBnZXRCb29sZWFuID8gZmFsc2UgOiB1bmRlZmluZWQ7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBsb2dFcnJvcnMoZXJyb3JzLCBrZXksIHBvaW50ZXIsIG9iamVjdCkge1xuICAgIGlmIChlcnJvcnMpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYGdldCBlcnJvcjogXCIke2tleX1cIiBrZXkgbm90IGZvdW5kIGluIG9iamVjdC5gKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IocG9pbnRlcik7XG4gICAgICBjb25zb2xlLmVycm9yKG9iamVjdCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV2YWx1YXRlcyBjb25kaXRpb25hbCBleHByZXNzaW9uIGluIGZvcm0gb2YgYG1vZGVsLjxwcm9wZXJ0eT49PTx2YWx1ZT5gIG9yXG4gICAqIGBtb2RlbC48cHJvcGVydHk+IT08dmFsdWU+YCB3aGVyZSB0aGUgZmlyc3Qgb25lIG1lYW5zIHRoYXQgdGhlIHZhbHVlIG11c3QgbWF0Y2ggdG8gYmVcbiAgICogc2hvd24gaW4gYSBmb3JtLCB3aGlsZSB0aGUgZm9ybWVyIHNob3dzIHRoZSBwcm9wZXJ0eSBvbmx5IHdoZW4gdGhlIHByb3BlcnR5IHZhbHVlIGlzIG5vdFxuICAgKiBzZXQsIG9yIGRvZXMgbm90IGVxdWFsIHRoZSBnaXZlbiB2YWx1ZS5cbiAgICpcbiAgICogLy8geyBzdWJPYmplY3QgfSBzdWJPYmplY3QgLSAgYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGRhdGEgdmFsdWVzIG9mIHByb3BlcnRpZXNcbiAgICogLy8geyBrZXkgfSBrZXkgLSB0aGUga2V5IGZyb20gdGhlIGZvciBsb29wIGluIGEgZm9ybSBvZiBgPHByb3BlcnR5Pj09PHZhbHVlPmBcbiAgICpcbiAgICogUmV0dXJucyB0aGUgb2JqZWN0IHdpdGggdHdvIHByb3BlcnRpZXMuIFRoZSBwcm9wZXJ0eSBwYXNzZWQgaW5mb3JtcyB3aGV0aGVyXG4gICAqIHRoZSBleHByZXNzaW9uIGV2YWx1YXRlZCBzdWNjZXNzZnVsbHkgYW5kIHRoZSBwcm9wZXJ0eSBrZXkgcmV0dXJucyBlaXRoZXIgdGhlIHNhbWVcbiAgICoga2V5IGlmIGl0IGlzIG5vdCBjb250YWluZWQgaW5zaWRlIHRoZSBzdWJPYmplY3Qgb3IgdGhlIGtleSBvZiB0aGUgcHJvcGVydHkgaWYgaXQgaXMgY29udGFpbmVkLlxuICAgKi9cbiAgc3RhdGljIGV2YWx1YXRlRXhwcmVzc2lvbihzdWJPYmplY3Q6IE9iamVjdCwga2V5OiBhbnkpIHtcbiAgICBjb25zdCBkZWZhdWx0UmVzdWx0ID0ge3Bhc3NlZDogZmFsc2UsIGtleToga2V5fTtcbiAgICBjb25zdCBrZXlzQW5kRXhwcmVzc2lvbiA9IHRoaXMucGFyc2VLZXlzQW5kRXhwcmVzc2lvbihrZXksIHN1Yk9iamVjdCk7XG4gICAgaWYgKCFrZXlzQW5kRXhwcmVzc2lvbikge1xuICAgICAgcmV0dXJuIGRlZmF1bHRSZXN1bHQ7XG4gICAgfVxuXG4gICAgY29uc3Qgb3duQ2hlY2tSZXN1bHQgPSB0aGlzLmRvT3duQ2hlY2tSZXN1bHQoc3ViT2JqZWN0LCBrZXlzQW5kRXhwcmVzc2lvbik7XG4gICAgaWYgKG93bkNoZWNrUmVzdWx0KSB7XG4gICAgICByZXR1cm4gb3duQ2hlY2tSZXN1bHQ7XG4gICAgfVxuXG4gICAgY29uc3QgY2xlYW5lZFZhbHVlID0gY2xlYW5WYWx1ZU9mUXVvdGVzKGtleXNBbmRFeHByZXNzaW9uLmtleUFuZFZhbHVlWzFdKTtcblxuICAgIGNvbnN0IGV2YWx1YXRlZFJlc3VsdCA9IHRoaXMucGVyZm9ybUV4cHJlc3Npb25PblZhbHVlKGtleXNBbmRFeHByZXNzaW9uLCBjbGVhbmVkVmFsdWUsIHN1Yk9iamVjdCk7XG4gICAgaWYgKGV2YWx1YXRlZFJlc3VsdCkge1xuICAgICAgcmV0dXJuIGV2YWx1YXRlZFJlc3VsdDtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVmYXVsdFJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyB0aGUgYWN0dWFsIGV2YWx1YXRpb24gb24gdGhlIGdpdmVuIGV4cHJlc3Npb24gd2l0aCBnaXZlbiB2YWx1ZXMgYW5kIGtleXMuXG4gICAqIC8vIHsgY2xlYW5lZFZhbHVlIH0gY2xlYW5lZFZhbHVlIC0gdGhlIGdpdmVuIHZhbHVlZCBjbGVhbmVkIG9mIHF1b3RlcyBpZiBpdCBoYWQgYW55XG4gICAqIC8vIHsgc3ViT2JqZWN0IH0gc3ViT2JqZWN0IC0gdGhlIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgdmFsdWVzXG4gICAqIC8vIHsga2V5c0FuZEV4cHJlc3Npb24gfSBrZXlzQW5kRXhwcmVzc2lvbiAtIGFuIG9iamVjdCBob2xkaW5nIHRoZSBleHByZXNzaW9ucyB3aXRoXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBwZXJmb3JtRXhwcmVzc2lvbk9uVmFsdWUoa2V5c0FuZEV4cHJlc3Npb246IGFueSwgY2xlYW5lZFZhbHVlOiBTdHJpbmcsIHN1Yk9iamVjdDogT2JqZWN0KSB7XG4gICAgY29uc3QgcHJvcGVydHlCeUtleSA9IHN1Yk9iamVjdFtrZXlzQW5kRXhwcmVzc2lvbi5rZXlBbmRWYWx1ZVswXV07XG4gICAgaWYgKHRoaXMuZG9Db21wYXJpc29uQnlFeHByZXNzaW9uVHlwZShrZXlzQW5kRXhwcmVzc2lvbi5leHByZXNzaW9uVHlwZSwgcHJvcGVydHlCeUtleSwgY2xlYW5lZFZhbHVlKSkge1xuICAgICAgcmV0dXJuIHtwYXNzZWQ6IHRydWUsIGtleToga2V5c0FuZEV4cHJlc3Npb24ua2V5QW5kVmFsdWVbMF19O1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZG9Db21wYXJpc29uQnlFeHByZXNzaW9uVHlwZShleHByZXNzaW9uVHlwZTogRXhwcmVzc2lvblR5cGUsIHByb3BlcnR5QnlLZXksIGNsZWFuZWRWYWx1ZTogU3RyaW5nKTogQm9vbGVhbiB7XG4gICAgaWYgKGlzRXF1YWwoZXhwcmVzc2lvblR5cGUpKSB7XG4gICAgICByZXR1cm4gcHJvcGVydHlCeUtleSA9PT0gY2xlYW5lZFZhbHVlO1xuICAgIH1cbiAgICBpZiAoaXNOb3RFcXVhbChleHByZXNzaW9uVHlwZSkpIHtcbiAgICAgIHJldHVybiBwcm9wZXJ0eUJ5S2V5ICE9PSBjbGVhbmVkVmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb2VzIHRoZSBjaGVja3Mgd2hlbiB0aGUgcGFyc2VkIGtleSBpcyBhY3R1YWxseSBubyBhIHByb3BlcnR5IGluc2lkZSBzdWJPYmplY3QuXG4gICAqIFRoYXQgd291bGQgbWVhbiB0aGF0IHRoZSBlcXVhbCBjb21wYXJpc29uIG1ha2VzIG5vIHNlbnNlIGFuZCB0aHVzIHRoZSBuZWdhdGl2ZSByZXN1bHRcbiAgICogaXMgcmV0dXJuZWQsIGFuZCB0aGUgbm90IGVxdWFsIGNvbXBhcmlzb24gaXMgbm90IG5lY2Vzc2FyeSBiZWNhdXNlIGl0IGRvZXNuJ3QgZXF1YWxcbiAgICogb2J2aW91c2x5LiBSZXR1cm5zIG51bGwgd2hlbiB0aGUgZ2l2ZW4ga2V5IGlzIGEgcmVhbCBwcm9wZXJ0eSBpbnNpZGUgdGhlIHN1Yk9iamVjdC5cbiAgICogLy8geyBzdWJPYmplY3QgfSBzdWJPYmplY3QgLSB0aGUgb2JqZWN0IHdpdGggcHJvcGVydGllcyB2YWx1ZXNcbiAgICogLy8geyBrZXlzQW5kRXhwcmVzc2lvbiB9IGtleXNBbmRFeHByZXNzaW9uIC0gYW4gb2JqZWN0IGhvbGRpbmcgdGhlIGV4cHJlc3Npb25zIHdpdGhcbiAgICogdGhlIGFzc29jaWF0ZWQga2V5cy5cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIGRvT3duQ2hlY2tSZXN1bHQoc3ViT2JqZWN0OiBPYmplY3QsIGtleXNBbmRFeHByZXNzaW9uKSB7XG4gICAgbGV0IG93bkNoZWNrUmVzdWx0ID0gbnVsbDtcbiAgICBpZiAoIWhhc093bihzdWJPYmplY3QsIGtleXNBbmRFeHByZXNzaW9uLmtleUFuZFZhbHVlWzBdKSkge1xuICAgICAgaWYgKGlzRXF1YWwoa2V5c0FuZEV4cHJlc3Npb24uZXhwcmVzc2lvblR5cGUpKSB7XG4gICAgICAgIG93bkNoZWNrUmVzdWx0ID0ge3Bhc3NlZDogZmFsc2UsIGtleTogbnVsbH07XG4gICAgICB9XG4gICAgICBpZiAoaXNOb3RFcXVhbChrZXlzQW5kRXhwcmVzc2lvbi5leHByZXNzaW9uVHlwZSkpIHtcbiAgICAgICAgb3duQ2hlY2tSZXN1bHQgPSB7cGFzc2VkOiB0cnVlLCBrZXk6IG51bGx9O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3duQ2hlY2tSZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogRG9lcyB0aGUgYmFzaWMgY2hlY2tzIGFuZCB0cmllcyB0byBwYXJzZSBhbiBleHByZXNzaW9uIGFuZCBhIHBhaXJcbiAgICogb2Yga2V5IGFuZCB2YWx1ZS5cbiAgICogLy8geyBrZXkgfSBrZXkgLSB0aGUgb3JpZ2luYWwgZm9yIGxvb3AgY3JlYXRlZCB2YWx1ZSBjb250YWluaW5nIGtleSBhbmQgdmFsdWUgaW4gb25lIHN0cmluZ1xuICAgKiAvLyB7IHN1Yk9iamVjdCB9IHN1Yk9iamVjdCAtIHRoZSBvYmplY3Qgd2l0aCBwcm9wZXJ0aWVzIHZhbHVlc1xuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgcGFyc2VLZXlzQW5kRXhwcmVzc2lvbihrZXk6IHN0cmluZywgc3ViT2JqZWN0KSB7XG4gICAgaWYgKHRoaXMua2V5T3JTdWJPYmpFbXB0eShrZXksIHN1Yk9iamVjdCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBleHByZXNzaW9uVHlwZSA9IGdldEV4cHJlc3Npb25UeXBlKGtleS50b1N0cmluZygpKTtcbiAgICBpZiAoaXNOb3RFeHByZXNzaW9uKGV4cHJlc3Npb25UeXBlKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGtleUFuZFZhbHVlID0gZ2V0S2V5QW5kVmFsdWVCeUV4cHJlc3Npb25UeXBlKGV4cHJlc3Npb25UeXBlLCBrZXkpO1xuICAgIGlmICgha2V5QW5kVmFsdWUgfHwgIWtleUFuZFZhbHVlWzBdIHx8ICFrZXlBbmRWYWx1ZVsxXSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB7ZXhwcmVzc2lvblR5cGU6IGV4cHJlc3Npb25UeXBlLCBrZXlBbmRWYWx1ZToga2V5QW5kVmFsdWV9O1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMga2V5T3JTdWJPYmpFbXB0eShrZXk6IGFueSwgc3ViT2JqZWN0OiBPYmplY3QpIHtcbiAgICByZXR1cm4gIWtleSB8fCAhc3ViT2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqICdnZXRDb3B5JyBmdW5jdGlvblxuICAgKlxuICAgKiBVc2VzIGEgSlNPTiBQb2ludGVyIHRvIGRlZXBseSBjbG9uZSBhIHZhbHVlIGZyb20gYW4gb2JqZWN0LlxuICAgKlxuICAgKiAvLyAgeyBvYmplY3QgfSBvYmplY3QgLSBPYmplY3QgdG8gZ2V0IHZhbHVlIGZyb21cbiAgICogLy8gIHsgUG9pbnRlciB9IHBvaW50ZXIgLSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSlcbiAgICogLy8gIHsgbnVtYmVyID0gMCB9IHN0YXJ0U2xpY2UgLSBaZXJvLWJhc2VkIGluZGV4IG9mIGZpcnN0IFBvaW50ZXIga2V5IHRvIHVzZVxuICAgKiAvLyAgeyBudW1iZXIgfSBlbmRTbGljZSAtIFplcm8tYmFzZWQgaW5kZXggb2YgbGFzdCBQb2ludGVyIGtleSB0byB1c2VcbiAgICogLy8gIHsgYm9vbGVhbiA9IGZhbHNlIH0gZ2V0Qm9vbGVhbiAtIFJldHVybiBvbmx5IHRydWUgb3IgZmFsc2U/XG4gICAqIC8vICB7IGJvb2xlYW4gPSBmYWxzZSB9IGVycm9ycyAtIFNob3cgZXJyb3IgaWYgbm90IGZvdW5kP1xuICAgKiAvLyB7IG9iamVjdCB9IC0gTG9jYXRlZCB2YWx1ZSAob3IgdHJ1ZSBvciBmYWxzZSBpZiBnZXRCb29sZWFuID0gdHJ1ZSlcbiAgICovXG4gIHN0YXRpYyBnZXRDb3B5KFxuICAgIG9iamVjdCwgcG9pbnRlciwgc3RhcnRTbGljZSA9IDAsIGVuZFNsaWNlOiBudW1iZXIgPSBudWxsLFxuICAgIGdldEJvb2xlYW4gPSBmYWxzZSwgZXJyb3JzID0gZmFsc2VcbiAgKSB7XG4gICAgY29uc3Qgb2JqZWN0VG9Db3B5ID1cbiAgICAgIHRoaXMuZ2V0KG9iamVjdCwgcG9pbnRlciwgc3RhcnRTbGljZSwgZW5kU2xpY2UsIGdldEJvb2xlYW4sIGVycm9ycyk7XG4gICAgcmV0dXJuIHRoaXMuZm9yRWFjaERlZXBDb3B5KG9iamVjdFRvQ29weSk7XG4gIH1cblxuICAvKipcbiAgICogJ2dldEZpcnN0JyBmdW5jdGlvblxuICAgKlxuICAgKiBUYWtlcyBhbiBhcnJheSBvZiBKU09OIFBvaW50ZXJzIGFuZCBvYmplY3RzLFxuICAgKiBjaGVja3MgZWFjaCBvYmplY3QgZm9yIGEgdmFsdWUgc3BlY2lmaWVkIGJ5IHRoZSBwb2ludGVyLFxuICAgKiBhbmQgcmV0dXJucyB0aGUgZmlyc3QgdmFsdWUgZm91bmQuXG4gICAqXG4gICAqIC8vICB7IFtvYmplY3QsIHBvaW50ZXJdW10gfSBpdGVtcyAtIEFycmF5IG9mIG9iamVjdHMgYW5kIHBvaW50ZXJzIHRvIGNoZWNrXG4gICAqIC8vICB7IGFueSA9IG51bGwgfSBkZWZhdWx0VmFsdWUgLSBWYWx1ZSB0byByZXR1cm4gaWYgbm90aGluZyBmb3VuZFxuICAgKiAvLyAgeyBib29sZWFuID0gZmFsc2UgfSBnZXRDb3B5IC0gUmV0dXJuIGEgY29weSBpbnN0ZWFkP1xuICAgKiAvLyAgLSBGaXJzdCB2YWx1ZSBmb3VuZFxuICAgKi9cbiAgc3RhdGljIGdldEZpcnN0KGl0ZW1zLCBkZWZhdWx0VmFsdWU6IGFueSA9IG51bGwsIGdldENvcHkgPSBmYWxzZSkge1xuICAgIGlmIChpc0VtcHR5KGl0ZW1zKSkgeyByZXR1cm47IH1cbiAgICBpZiAoaXNBcnJheShpdGVtcykpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuICAgICAgICBpZiAoaXNFbXB0eShpdGVtKSkgeyBjb250aW51ZTsgfVxuICAgICAgICBpZiAoaXNBcnJheShpdGVtKSAmJiBpdGVtLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgaWYgKGlzRW1wdHkoaXRlbVswXSkgfHwgaXNFbXB0eShpdGVtWzFdKSkgeyBjb250aW51ZTsgfVxuICAgICAgICAgIGNvbnN0IHZhbHVlID0gZ2V0Q29weSA/XG4gICAgICAgICAgICB0aGlzLmdldENvcHkoaXRlbVswXSwgaXRlbVsxXSkgOlxuICAgICAgICAgICAgdGhpcy5nZXQoaXRlbVswXSwgaXRlbVsxXSk7XG4gICAgICAgICAgaWYgKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2dldEZpcnN0IGVycm9yOiBJbnB1dCBub3QgaW4gY29ycmVjdCBmb3JtYXQuXFxuJyArXG4gICAgICAgICAgJ1Nob3VsZCBiZTogWyBbIG9iamVjdDEsIHBvaW50ZXIxIF0sIFsgb2JqZWN0IDIsIHBvaW50ZXIyIF0sIGV0Yy4uLiBdJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgfVxuICAgIGlmIChpc01hcChpdGVtcykpIHtcbiAgICAgIGZvciAoY29uc3QgW29iamVjdCwgcG9pbnRlcl0gb2YgaXRlbXMpIHtcbiAgICAgICAgaWYgKG9iamVjdCA9PT0gbnVsbCB8fCAhdGhpcy5pc0pzb25Qb2ludGVyKHBvaW50ZXIpKSB7IGNvbnRpbnVlOyB9XG4gICAgICAgIGNvbnN0IHZhbHVlID0gZ2V0Q29weSA/XG4gICAgICAgICAgdGhpcy5nZXRDb3B5KG9iamVjdCwgcG9pbnRlcikgOlxuICAgICAgICAgIHRoaXMuZ2V0KG9iamVjdCwgcG9pbnRlcik7XG4gICAgICAgIGlmICh2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgfVxuICAgIGNvbnNvbGUuZXJyb3IoJ2dldEZpcnN0IGVycm9yOiBJbnB1dCBub3QgaW4gY29ycmVjdCBmb3JtYXQuXFxuJyArXG4gICAgICAnU2hvdWxkIGJlOiBbIFsgb2JqZWN0MSwgcG9pbnRlcjEgXSwgWyBvYmplY3QgMiwgcG9pbnRlcjIgXSwgZXRjLi4uIF0nKTtcbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqICdnZXRGaXJzdENvcHknIGZ1bmN0aW9uXG4gICAqXG4gICAqIFNpbWlsYXIgdG8gZ2V0Rmlyc3QsIGJ1dCBhbHdheXMgcmV0dXJucyBhIGNvcHkuXG4gICAqXG4gICAqIC8vICB7IFtvYmplY3QsIHBvaW50ZXJdW10gfSBpdGVtcyAtIEFycmF5IG9mIG9iamVjdHMgYW5kIHBvaW50ZXJzIHRvIGNoZWNrXG4gICAqIC8vICB7IGFueSA9IG51bGwgfSBkZWZhdWx0VmFsdWUgLSBWYWx1ZSB0byByZXR1cm4gaWYgbm90aGluZyBmb3VuZFxuICAgKiAvLyAgLSBDb3B5IG9mIGZpcnN0IHZhbHVlIGZvdW5kXG4gICAqL1xuICBzdGF0aWMgZ2V0Rmlyc3RDb3B5KGl0ZW1zLCBkZWZhdWx0VmFsdWU6IGFueSA9IG51bGwpIHtcbiAgICBjb25zdCBmaXJzdENvcHkgPSB0aGlzLmdldEZpcnN0KGl0ZW1zLCBkZWZhdWx0VmFsdWUsIHRydWUpO1xuICAgIHJldHVybiBmaXJzdENvcHk7XG4gIH1cblxuICAvKipcbiAgICogJ3NldCcgZnVuY3Rpb25cbiAgICpcbiAgICogVXNlcyBhIEpTT04gUG9pbnRlciB0byBzZXQgYSB2YWx1ZSBvbiBhbiBvYmplY3QuXG4gICAqIEFsc28gY3JlYXRlcyBhbnkgbWlzc2luZyBzdWIgb2JqZWN0cyBvciBhcnJheXMgdG8gY29udGFpbiB0aGF0IHZhbHVlLlxuICAgKlxuICAgKiBJZiB0aGUgb3B0aW9uYWwgZm91cnRoIHBhcmFtZXRlciBpcyBUUlVFIGFuZCB0aGUgaW5uZXItbW9zdCBjb250YWluZXJcbiAgICogaXMgYW4gYXJyYXksIHRoZSBmdW5jdGlvbiB3aWxsIGluc2VydCB0aGUgdmFsdWUgYXMgYSBuZXcgaXRlbSBhdCB0aGVcbiAgICogc3BlY2lmaWVkIGxvY2F0aW9uIGluIHRoZSBhcnJheSwgcmF0aGVyIHRoYW4gb3ZlcndyaXRpbmcgdGhlIGV4aXN0aW5nXG4gICAqIHZhbHVlIChpZiBhbnkpIGF0IHRoYXQgbG9jYXRpb24uXG4gICAqXG4gICAqIFNvIHNldChbMSwgMiwgM10sICcvMScsIDQpID0+IFsxLCA0LCAzXVxuICAgKiBhbmRcbiAgICogU28gc2V0KFsxLCAyLCAzXSwgJy8xJywgNCwgdHJ1ZSkgPT4gWzEsIDQsIDIsIDNdXG4gICAqXG4gICAqIC8vICB7IG9iamVjdCB9IG9iamVjdCAtIFRoZSBvYmplY3QgdG8gc2V0IHZhbHVlIGluXG4gICAqIC8vICB7IFBvaW50ZXIgfSBwb2ludGVyIC0gVGhlIEpTT04gUG9pbnRlciAoc3RyaW5nIG9yIGFycmF5KVxuICAgKiAvLyAgIHZhbHVlIC0gVGhlIG5ldyB2YWx1ZSB0byBzZXRcbiAgICogLy8gIHsgYm9vbGVhbiB9IGluc2VydCAtIGluc2VydCB2YWx1ZT9cbiAgICogLy8geyBvYmplY3QgfSAtIFRoZSBvcmlnaW5hbCBvYmplY3QsIG1vZGlmaWVkIHdpdGggdGhlIHNldCB2YWx1ZVxuICAgKi9cbiAgc3RhdGljIHNldChvYmplY3QsIHBvaW50ZXIsIHZhbHVlLCBpbnNlcnQgPSBmYWxzZSkge1xuICAgIGNvbnN0IGtleUFycmF5ID0gdGhpcy5wYXJzZShwb2ludGVyKTtcbiAgICBpZiAoa2V5QXJyYXkgIT09IG51bGwgJiYga2V5QXJyYXkubGVuZ3RoKSB7XG4gICAgICBsZXQgc3ViT2JqZWN0ID0gb2JqZWN0O1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlBcnJheS5sZW5ndGggLSAxOyArK2kpIHtcbiAgICAgICAgbGV0IGtleSA9IGtleUFycmF5W2ldO1xuICAgICAgICBpZiAoa2V5ID09PSAnLScgJiYgaXNBcnJheShzdWJPYmplY3QpKSB7XG4gICAgICAgICAga2V5ID0gc3ViT2JqZWN0Lmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNNYXAoc3ViT2JqZWN0KSAmJiBzdWJPYmplY3QuaGFzKGtleSkpIHtcbiAgICAgICAgICBzdWJPYmplY3QgPSBzdWJPYmplY3QuZ2V0KGtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCFoYXNPd24oc3ViT2JqZWN0LCBrZXkpKSB7XG4gICAgICAgICAgICBzdWJPYmplY3Rba2V5XSA9IChrZXlBcnJheVtpICsgMV0ubWF0Y2goL14oXFxkK3wtKSQvKSkgPyBbXSA6IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdWJPYmplY3QgPSBzdWJPYmplY3Rba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgbGFzdEtleSA9IGtleUFycmF5W2tleUFycmF5Lmxlbmd0aCAtIDFdO1xuICAgICAgaWYgKGlzQXJyYXkoc3ViT2JqZWN0KSAmJiBsYXN0S2V5ID09PSAnLScpIHtcbiAgICAgICAgc3ViT2JqZWN0LnB1c2godmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChpbnNlcnQgJiYgaXNBcnJheShzdWJPYmplY3QpICYmICFpc05hTigrbGFzdEtleSkpIHtcbiAgICAgICAgc3ViT2JqZWN0LnNwbGljZShsYXN0S2V5LCAwLCB2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGlzTWFwKHN1Yk9iamVjdCkpIHtcbiAgICAgICAgc3ViT2JqZWN0LnNldChsYXN0S2V5LCB2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdWJPYmplY3RbbGFzdEtleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuICAgIGNvbnNvbGUuZXJyb3IoYHNldCBlcnJvcjogSW52YWxpZCBKU09OIFBvaW50ZXI6ICR7cG9pbnRlcn1gKTtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqICdzZXRDb3B5JyBmdW5jdGlvblxuICAgKlxuICAgKiBDb3BpZXMgYW4gb2JqZWN0IGFuZCB1c2VzIGEgSlNPTiBQb2ludGVyIHRvIHNldCBhIHZhbHVlIG9uIHRoZSBjb3B5LlxuICAgKiBBbHNvIGNyZWF0ZXMgYW55IG1pc3Npbmcgc3ViIG9iamVjdHMgb3IgYXJyYXlzIHRvIGNvbnRhaW4gdGhhdCB2YWx1ZS5cbiAgICpcbiAgICogSWYgdGhlIG9wdGlvbmFsIGZvdXJ0aCBwYXJhbWV0ZXIgaXMgVFJVRSBhbmQgdGhlIGlubmVyLW1vc3QgY29udGFpbmVyXG4gICAqIGlzIGFuIGFycmF5LCB0aGUgZnVuY3Rpb24gd2lsbCBpbnNlcnQgdGhlIHZhbHVlIGFzIGEgbmV3IGl0ZW0gYXQgdGhlXG4gICAqIHNwZWNpZmllZCBsb2NhdGlvbiBpbiB0aGUgYXJyYXksIHJhdGhlciB0aGFuIG92ZXJ3cml0aW5nIHRoZSBleGlzdGluZyB2YWx1ZS5cbiAgICpcbiAgICogLy8gIHsgb2JqZWN0IH0gb2JqZWN0IC0gVGhlIG9iamVjdCB0byBjb3B5IGFuZCBzZXQgdmFsdWUgaW5cbiAgICogLy8gIHsgUG9pbnRlciB9IHBvaW50ZXIgLSBUaGUgSlNPTiBQb2ludGVyIChzdHJpbmcgb3IgYXJyYXkpXG4gICAqIC8vICAgdmFsdWUgLSBUaGUgdmFsdWUgdG8gc2V0XG4gICAqIC8vICB7IGJvb2xlYW4gfSBpbnNlcnQgLSBpbnNlcnQgdmFsdWU/XG4gICAqIC8vIHsgb2JqZWN0IH0gLSBUaGUgbmV3IG9iamVjdCB3aXRoIHRoZSBzZXQgdmFsdWVcbiAgICovXG4gIHN0YXRpYyBzZXRDb3B5KG9iamVjdCwgcG9pbnRlciwgdmFsdWUsIGluc2VydCA9IGZhbHNlKSB7XG4gICAgY29uc3Qga2V5QXJyYXkgPSB0aGlzLnBhcnNlKHBvaW50ZXIpO1xuICAgIGlmIChrZXlBcnJheSAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgbmV3T2JqZWN0ID0gY29weShvYmplY3QpO1xuICAgICAgbGV0IHN1Yk9iamVjdCA9IG5ld09iamVjdDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5QXJyYXkubGVuZ3RoIC0gMTsgKytpKSB7XG4gICAgICAgIGxldCBrZXkgPSBrZXlBcnJheVtpXTtcbiAgICAgICAgaWYgKGtleSA9PT0gJy0nICYmIGlzQXJyYXkoc3ViT2JqZWN0KSkge1xuICAgICAgICAgIGtleSA9IHN1Yk9iamVjdC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTWFwKHN1Yk9iamVjdCkgJiYgc3ViT2JqZWN0LmhhcyhrZXkpKSB7XG4gICAgICAgICAgc3ViT2JqZWN0LnNldChrZXksIGNvcHkoc3ViT2JqZWN0LmdldChrZXkpKSk7XG4gICAgICAgICAgc3ViT2JqZWN0ID0gc3ViT2JqZWN0LmdldChrZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghaGFzT3duKHN1Yk9iamVjdCwga2V5KSkge1xuICAgICAgICAgICAgc3ViT2JqZWN0W2tleV0gPSAoa2V5QXJyYXlbaSArIDFdLm1hdGNoKC9eKFxcZCt8LSkkLykpID8gW10gOiB7fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3ViT2JqZWN0W2tleV0gPSBjb3B5KHN1Yk9iamVjdFtrZXldKTtcbiAgICAgICAgICBzdWJPYmplY3QgPSBzdWJPYmplY3Rba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgbGFzdEtleSA9IGtleUFycmF5W2tleUFycmF5Lmxlbmd0aCAtIDFdO1xuICAgICAgaWYgKGlzQXJyYXkoc3ViT2JqZWN0KSAmJiBsYXN0S2V5ID09PSAnLScpIHtcbiAgICAgICAgc3ViT2JqZWN0LnB1c2godmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChpbnNlcnQgJiYgaXNBcnJheShzdWJPYmplY3QpICYmICFpc05hTigrbGFzdEtleSkpIHtcbiAgICAgICAgc3ViT2JqZWN0LnNwbGljZShsYXN0S2V5LCAwLCB2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGlzTWFwKHN1Yk9iamVjdCkpIHtcbiAgICAgICAgc3ViT2JqZWN0LnNldChsYXN0S2V5LCB2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdWJPYmplY3RbbGFzdEtleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXdPYmplY3Q7XG4gICAgfVxuICAgIGNvbnNvbGUuZXJyb3IoYHNldENvcHkgZXJyb3I6IEludmFsaWQgSlNPTiBQb2ludGVyOiAke3BvaW50ZXJ9YCk7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuXG4gIC8qKlxuICAgKiAnaW5zZXJ0JyBmdW5jdGlvblxuICAgKlxuICAgKiBDYWxscyAnc2V0JyB3aXRoIGluc2VydCA9IFRSVUVcbiAgICpcbiAgICogLy8gIHsgb2JqZWN0IH0gb2JqZWN0IC0gb2JqZWN0IHRvIGluc2VydCB2YWx1ZSBpblxuICAgKiAvLyAgeyBQb2ludGVyIH0gcG9pbnRlciAtIEpTT04gUG9pbnRlciAoc3RyaW5nIG9yIGFycmF5KVxuICAgKiAvLyAgIHZhbHVlIC0gdmFsdWUgdG8gaW5zZXJ0XG4gICAqIC8vIHsgb2JqZWN0IH1cbiAgICovXG4gIHN0YXRpYyBpbnNlcnQob2JqZWN0LCBwb2ludGVyLCB2YWx1ZSkge1xuICAgIGNvbnN0IHVwZGF0ZWRPYmplY3QgPSB0aGlzLnNldChvYmplY3QsIHBvaW50ZXIsIHZhbHVlLCB0cnVlKTtcbiAgICByZXR1cm4gdXBkYXRlZE9iamVjdDtcbiAgfVxuXG4gIC8qKlxuICAgKiAnaW5zZXJ0Q29weScgZnVuY3Rpb25cbiAgICpcbiAgICogQ2FsbHMgJ3NldENvcHknIHdpdGggaW5zZXJ0ID0gVFJVRVxuICAgKlxuICAgKiAvLyAgeyBvYmplY3QgfSBvYmplY3QgLSBvYmplY3QgdG8gaW5zZXJ0IHZhbHVlIGluXG4gICAqIC8vICB7IFBvaW50ZXIgfSBwb2ludGVyIC0gSlNPTiBQb2ludGVyIChzdHJpbmcgb3IgYXJyYXkpXG4gICAqIC8vICAgdmFsdWUgLSB2YWx1ZSB0byBpbnNlcnRcbiAgICogLy8geyBvYmplY3QgfVxuICAgKi9cbiAgc3RhdGljIGluc2VydENvcHkob2JqZWN0LCBwb2ludGVyLCB2YWx1ZSkge1xuICAgIGNvbnN0IHVwZGF0ZWRPYmplY3QgPSB0aGlzLnNldENvcHkob2JqZWN0LCBwb2ludGVyLCB2YWx1ZSwgdHJ1ZSk7XG4gICAgcmV0dXJuIHVwZGF0ZWRPYmplY3Q7XG4gIH1cblxuICAvKipcbiAgICogJ3JlbW92ZScgZnVuY3Rpb25cbiAgICpcbiAgICogVXNlcyBhIEpTT04gUG9pbnRlciB0byByZW1vdmUgYSBrZXkgYW5kIGl0cyBhdHRyaWJ1dGUgZnJvbSBhbiBvYmplY3RcbiAgICpcbiAgICogLy8gIHsgb2JqZWN0IH0gb2JqZWN0IC0gb2JqZWN0IHRvIGRlbGV0ZSBhdHRyaWJ1dGUgZnJvbVxuICAgKiAvLyAgeyBQb2ludGVyIH0gcG9pbnRlciAtIEpTT04gUG9pbnRlciAoc3RyaW5nIG9yIGFycmF5KVxuICAgKiAvLyB7IG9iamVjdCB9XG4gICAqL1xuICBzdGF0aWMgcmVtb3ZlKG9iamVjdCwgcG9pbnRlcikge1xuICAgIGNvbnN0IGtleUFycmF5ID0gdGhpcy5wYXJzZShwb2ludGVyKTtcbiAgICBpZiAoa2V5QXJyYXkgIT09IG51bGwgJiYga2V5QXJyYXkubGVuZ3RoKSB7XG4gICAgICBsZXQgbGFzdEtleSA9IGtleUFycmF5LnBvcCgpO1xuICAgICAgY29uc3QgcGFyZW50T2JqZWN0ID0gdGhpcy5nZXQob2JqZWN0LCBrZXlBcnJheSk7XG4gICAgICBpZiAoaXNBcnJheShwYXJlbnRPYmplY3QpKSB7XG4gICAgICAgIGlmIChsYXN0S2V5ID09PSAnLScpIHsgbGFzdEtleSA9IHBhcmVudE9iamVjdC5sZW5ndGggLSAxOyB9XG4gICAgICAgIHBhcmVudE9iamVjdC5zcGxpY2UobGFzdEtleSwgMSk7XG4gICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KHBhcmVudE9iamVjdCkpIHtcbiAgICAgICAgZGVsZXRlIHBhcmVudE9iamVjdFtsYXN0S2V5XTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuICAgIGNvbnNvbGUuZXJyb3IoYHJlbW92ZSBlcnJvcjogSW52YWxpZCBKU09OIFBvaW50ZXI6ICR7cG9pbnRlcn1gKTtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqICdoYXMnIGZ1bmN0aW9uXG4gICAqXG4gICAqIFRlc3RzIGlmIGFuIG9iamVjdCBoYXMgYSB2YWx1ZSBhdCB0aGUgbG9jYXRpb24gc3BlY2lmaWVkIGJ5IGEgSlNPTiBQb2ludGVyXG4gICAqXG4gICAqIC8vICB7IG9iamVjdCB9IG9iamVjdCAtIG9iamVjdCB0byBjaGVrIGZvciB2YWx1ZVxuICAgKiAvLyAgeyBQb2ludGVyIH0gcG9pbnRlciAtIEpTT04gUG9pbnRlciAoc3RyaW5nIG9yIGFycmF5KVxuICAgKiAvLyB7IGJvb2xlYW4gfVxuICAgKi9cbiAgc3RhdGljIGhhcyhvYmplY3QsIHBvaW50ZXIpIHtcbiAgICBjb25zdCBoYXNWYWx1ZSA9IHRoaXMuZ2V0KG9iamVjdCwgcG9pbnRlciwgMCwgbnVsbCwgdHJ1ZSk7XG4gICAgcmV0dXJuIGhhc1ZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqICdkaWN0JyBmdW5jdGlvblxuICAgKlxuICAgKiBSZXR1cm5zIGEgKHBvaW50ZXIgLT4gdmFsdWUpIGRpY3Rpb25hcnkgZm9yIGFuIG9iamVjdFxuICAgKlxuICAgKiAvLyAgeyBvYmplY3QgfSBvYmplY3QgLSBUaGUgb2JqZWN0IHRvIGNyZWF0ZSBhIGRpY3Rpb25hcnkgZnJvbVxuICAgKiAvLyB7IG9iamVjdCB9IC0gVGhlIHJlc3VsdGluZyBkaWN0aW9uYXJ5IG9iamVjdFxuICAgKi9cbiAgc3RhdGljIGRpY3Qob2JqZWN0KSB7XG4gICAgY29uc3QgcmVzdWx0czogYW55ID0ge307XG4gICAgdGhpcy5mb3JFYWNoRGVlcChvYmplY3QsICh2YWx1ZSwgcG9pbnRlcikgPT4ge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHsgcmVzdWx0c1twb2ludGVyXSA9IHZhbHVlOyB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICAvKipcbiAgICogJ2ZvckVhY2hEZWVwJyBmdW5jdGlvblxuICAgKlxuICAgKiBJdGVyYXRlcyBvdmVyIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0IG9yIGl0ZW1zIGluIGFuIGFycmF5XG4gICAqIGFuZCBpbnZva2VzIGFuIGl0ZXJhdGVlIGZ1bmN0aW9uIGZvciBlYWNoIGtleS92YWx1ZSBvciBpbmRleC92YWx1ZSBwYWlyLlxuICAgKiBCeSBkZWZhdWx0LCBpdGVyYXRlcyBvdmVyIGl0ZW1zIHdpdGhpbiBvYmplY3RzIGFuZCBhcnJheXMgYWZ0ZXIgY2FsbGluZ1xuICAgKiB0aGUgaXRlcmF0ZWUgZnVuY3Rpb24gb24gdGhlIGNvbnRhaW5pbmcgb2JqZWN0IG9yIGFycmF5IGl0c2VsZi5cbiAgICpcbiAgICogVGhlIGl0ZXJhdGVlIGlzIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6ICh2YWx1ZSwgcG9pbnRlciwgcm9vdE9iamVjdCksXG4gICAqIHdoZXJlIHBvaW50ZXIgaXMgYSBKU09OIHBvaW50ZXIgaW5kaWNhdGluZyB0aGUgbG9jYXRpb24gb2YgdGhlIGN1cnJlbnRcbiAgICogdmFsdWUgd2l0aGluIHRoZSByb290IG9iamVjdCwgYW5kIHJvb3RPYmplY3QgaXMgdGhlIHJvb3Qgb2JqZWN0IGluaXRpYWxseVxuICAgKiBzdWJtaXR0ZWQgdG8gdGggZnVuY3Rpb24uXG4gICAqXG4gICAqIElmIGEgdGhpcmQgb3B0aW9uYWwgcGFyYW1ldGVyICdib3R0b21VcCcgaXMgc2V0IHRvIFRSVUUsIHRoZSBpdGVyYXRvclxuICAgKiBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBvbiBzdWItb2JqZWN0cyBhbmQgYXJyYXlzIGFmdGVyIGJlaW5nXG4gICAqIGNhbGxlZCBvbiB0aGVpciBjb250ZW50cywgcmF0aGVyIHRoYW4gYmVmb3JlLCB3aGljaCBpcyB0aGUgZGVmYXVsdC5cbiAgICpcbiAgICogVGhpcyBmdW5jdGlvbiBjYW4gYWxzbyBvcHRpb25hbGx5IGJlIGNhbGxlZCBkaXJlY3RseSBvbiBhIHN1Yi1vYmplY3QgYnlcbiAgICogaW5jbHVkaW5nIG9wdGlvbmFsIDR0aCBhbmQgNXRoIHBhcmFtZXRlcnNzIHRvIHNwZWNpZnkgdGhlIGluaXRpYWxcbiAgICogcm9vdCBvYmplY3QgYW5kIHBvaW50ZXIuXG4gICAqXG4gICAqIC8vICB7IG9iamVjdCB9IG9iamVjdCAtIHRoZSBpbml0aWFsIG9iamVjdCBvciBhcnJheVxuICAgKiAvLyAgeyAodjogYW55LCBwPzogc3RyaW5nLCBvPzogYW55KSA9PiBhbnkgfSBmdW5jdGlvbiAtIGl0ZXJhdGVlIGZ1bmN0aW9uXG4gICAqIC8vICB7IGJvb2xlYW4gPSBmYWxzZSB9IGJvdHRvbVVwIC0gb3B0aW9uYWwsIHNldCB0byBUUlVFIHRvIHJldmVyc2UgZGlyZWN0aW9uXG4gICAqIC8vICB7IG9iamVjdCA9IG9iamVjdCB9IHJvb3RPYmplY3QgLSBvcHRpb25hbCwgcm9vdCBvYmplY3Qgb3IgYXJyYXlcbiAgICogLy8gIHsgc3RyaW5nID0gJycgfSBwb2ludGVyIC0gb3B0aW9uYWwsIEpTT04gUG9pbnRlciB0byBvYmplY3Qgd2l0aGluIHJvb3RPYmplY3RcbiAgICogLy8geyBvYmplY3QgfSAtIFRoZSBtb2RpZmllZCBvYmplY3RcbiAgICovXG4gIHN0YXRpYyBmb3JFYWNoRGVlcChcbiAgICBvYmplY3QsIGZuOiAodjogYW55LCBwPzogc3RyaW5nLCBvPzogYW55KSA9PiBhbnkgPSAodikgPT4gdixcbiAgICBib3R0b21VcCA9IGZhbHNlLCBwb2ludGVyID0gJycsIHJvb3RPYmplY3QgPSBvYmplY3RcbiAgKSB7XG4gICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS5lcnJvcihgZm9yRWFjaERlZXAgZXJyb3I6IEl0ZXJhdG9yIGlzIG5vdCBhIGZ1bmN0aW9uOmAsIGZuKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFib3R0b21VcCkgeyBmbihvYmplY3QsIHBvaW50ZXIsIHJvb3RPYmplY3QpOyB9XG4gICAgaWYgKGlzT2JqZWN0KG9iamVjdCkgfHwgaXNBcnJheShvYmplY3QpKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhvYmplY3QpKSB7XG4gICAgICAgIGNvbnN0IG5ld1BvaW50ZXIgPSBwb2ludGVyICsgJy8nICsgdGhpcy5lc2NhcGUoa2V5KTtcbiAgICAgICAgdGhpcy5mb3JFYWNoRGVlcChvYmplY3Rba2V5XSwgZm4sIGJvdHRvbVVwLCBuZXdQb2ludGVyLCByb290T2JqZWN0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGJvdHRvbVVwKSB7IGZuKG9iamVjdCwgcG9pbnRlciwgcm9vdE9iamVjdCk7IH1cbiAgfVxuXG4gIC8qKlxuICAgKiAnZm9yRWFjaERlZXBDb3B5JyBmdW5jdGlvblxuICAgKlxuICAgKiBTaW1pbGFyIHRvIGZvckVhY2hEZWVwLCBidXQgcmV0dXJucyBhIGNvcHkgb2YgdGhlIG9yaWdpbmFsIG9iamVjdCwgd2l0aFxuICAgKiB0aGUgc2FtZSBrZXlzIGFuZCBpbmRleGVzLCBidXQgd2l0aCB2YWx1ZXMgcmVwbGFjZWQgd2l0aCB0aGUgcmVzdWx0IG9mXG4gICAqIHRoZSBpdGVyYXRlZSBmdW5jdGlvbi5cbiAgICpcbiAgICogLy8gIHsgb2JqZWN0IH0gb2JqZWN0IC0gdGhlIGluaXRpYWwgb2JqZWN0IG9yIGFycmF5XG4gICAqIC8vICB7ICh2OiBhbnksIGs/OiBzdHJpbmcsIG8/OiBhbnksIHA/OiBhbnkpID0+IGFueSB9IGZ1bmN0aW9uIC0gaXRlcmF0ZWUgZnVuY3Rpb25cbiAgICogLy8gIHsgYm9vbGVhbiA9IGZhbHNlIH0gYm90dG9tVXAgLSBvcHRpb25hbCwgc2V0IHRvIFRSVUUgdG8gcmV2ZXJzZSBkaXJlY3Rpb25cbiAgICogLy8gIHsgb2JqZWN0ID0gb2JqZWN0IH0gcm9vdE9iamVjdCAtIG9wdGlvbmFsLCByb290IG9iamVjdCBvciBhcnJheVxuICAgKiAvLyAgeyBzdHJpbmcgPSAnJyB9IHBvaW50ZXIgLSBvcHRpb25hbCwgSlNPTiBQb2ludGVyIHRvIG9iamVjdCB3aXRoaW4gcm9vdE9iamVjdFxuICAgKiAvLyB7IG9iamVjdCB9IC0gVGhlIGNvcGllZCBvYmplY3RcbiAgICovXG4gIHN0YXRpYyBmb3JFYWNoRGVlcENvcHkoXG4gICAgb2JqZWN0LCBmbjogKHY6IGFueSwgcD86IHN0cmluZywgbz86IGFueSkgPT4gYW55ID0gKHYpID0+IHYsXG4gICAgYm90dG9tVXAgPSBmYWxzZSwgcG9pbnRlciA9ICcnLCByb290T2JqZWN0ID0gb2JqZWN0XG4gICkge1xuICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYGZvckVhY2hEZWVwQ29weSBlcnJvcjogSXRlcmF0b3IgaXMgbm90IGEgZnVuY3Rpb246YCwgZm4pO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChpc09iamVjdChvYmplY3QpIHx8IGlzQXJyYXkob2JqZWN0KSkge1xuICAgICAgbGV0IG5ld09iamVjdCA9IGlzQXJyYXkob2JqZWN0KSA/IFsgLi4ub2JqZWN0IF0gOiB7IC4uLm9iamVjdCB9O1xuICAgICAgaWYgKCFib3R0b21VcCkgeyBuZXdPYmplY3QgPSBmbihuZXdPYmplY3QsIHBvaW50ZXIsIHJvb3RPYmplY3QpOyB9XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhuZXdPYmplY3QpKSB7XG4gICAgICAgIGNvbnN0IG5ld1BvaW50ZXIgPSBwb2ludGVyICsgJy8nICsgdGhpcy5lc2NhcGUoa2V5KTtcbiAgICAgICAgbmV3T2JqZWN0W2tleV0gPSB0aGlzLmZvckVhY2hEZWVwQ29weShcbiAgICAgICAgICBuZXdPYmplY3Rba2V5XSwgZm4sIGJvdHRvbVVwLCBuZXdQb2ludGVyLCByb290T2JqZWN0XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoYm90dG9tVXApIHsgbmV3T2JqZWN0ID0gZm4obmV3T2JqZWN0LCBwb2ludGVyLCByb290T2JqZWN0KTsgfVxuICAgICAgcmV0dXJuIG5ld09iamVjdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZuKG9iamVjdCwgcG9pbnRlciwgcm9vdE9iamVjdCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICdlc2NhcGUnIGZ1bmN0aW9uXG4gICAqXG4gICAqIEVzY2FwZXMgYSBzdHJpbmcgcmVmZXJlbmNlIGtleVxuICAgKlxuICAgKiAvLyAgeyBzdHJpbmcgfSBrZXkgLSBzdHJpbmcga2V5IHRvIGVzY2FwZVxuICAgKiAvLyB7IHN0cmluZyB9IC0gZXNjYXBlZCBrZXlcbiAgICovXG4gIHN0YXRpYyBlc2NhcGUoa2V5KSB7XG4gICAgY29uc3QgZXNjYXBlZCA9IGtleS50b1N0cmluZygpLnJlcGxhY2UoL34vZywgJ34wJykucmVwbGFjZSgvXFwvL2csICd+MScpO1xuICAgIHJldHVybiBlc2NhcGVkO1xuICB9XG5cbiAgLyoqXG4gICAqICd1bmVzY2FwZScgZnVuY3Rpb25cbiAgICpcbiAgICogVW5lc2NhcGVzIGEgc3RyaW5nIHJlZmVyZW5jZSBrZXlcbiAgICpcbiAgICogLy8gIHsgc3RyaW5nIH0ga2V5IC0gc3RyaW5nIGtleSB0byB1bmVzY2FwZVxuICAgKiAvLyB7IHN0cmluZyB9IC0gdW5lc2NhcGVkIGtleVxuICAgKi9cbiAgc3RhdGljIHVuZXNjYXBlKGtleSkge1xuICAgIGNvbnN0IHVuZXNjYXBlZCA9IGtleS50b1N0cmluZygpLnJlcGxhY2UoL34xL2csICcvJykucmVwbGFjZSgvfjAvZywgJ34nKTtcbiAgICByZXR1cm4gdW5lc2NhcGVkO1xuICB9XG5cbiAgLyoqXG4gICAqICdwYXJzZScgZnVuY3Rpb25cbiAgICpcbiAgICogQ29udmVydHMgYSBzdHJpbmcgSlNPTiBQb2ludGVyIGludG8gYSBhcnJheSBvZiBrZXlzXG4gICAqIChpZiBpbnB1dCBpcyBhbHJlYWR5IGFuIGFuIGFycmF5IG9mIGtleXMsIGl0IGlzIHJldHVybmVkIHVuY2hhbmdlZClcbiAgICpcbiAgICogLy8gIHsgUG9pbnRlciB9IHBvaW50ZXIgLSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSlcbiAgICogLy8gIHsgYm9vbGVhbiA9IGZhbHNlIH0gZXJyb3JzIC0gU2hvdyBlcnJvciBpZiBpbnZhbGlkIHBvaW50ZXI/XG4gICAqIC8vIHsgc3RyaW5nW10gfSAtIEpTT04gUG9pbnRlciBhcnJheSBvZiBrZXlzXG4gICAqL1xuICBzdGF0aWMgcGFyc2UocG9pbnRlciwgZXJyb3JzID0gZmFsc2UpIHtcbiAgICBpZiAoIXRoaXMuaXNKc29uUG9pbnRlcihwb2ludGVyKSkge1xuICAgICAgaWYgKGVycm9ycykgeyBjb25zb2xlLmVycm9yKGBwYXJzZSBlcnJvcjogSW52YWxpZCBKU09OIFBvaW50ZXI6ICR7cG9pbnRlcn1gKTsgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChpc0FycmF5KHBvaW50ZXIpKSB7IHJldHVybiA8c3RyaW5nW10+cG9pbnRlcjsgfVxuICAgIGlmICh0eXBlb2YgcG9pbnRlciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmICgoPHN0cmluZz5wb2ludGVyKVswXSA9PT0gJyMnKSB7IHBvaW50ZXIgPSBwb2ludGVyLnNsaWNlKDEpOyB9XG4gICAgICBpZiAoPHN0cmluZz5wb2ludGVyID09PSAnJyB8fCA8c3RyaW5nPnBvaW50ZXIgPT09ICcvJykgeyByZXR1cm4gW107IH1cbiAgICAgIHJldHVybiAoPHN0cmluZz5wb2ludGVyKS5zbGljZSgxKS5zcGxpdCgnLycpLm1hcCh0aGlzLnVuZXNjYXBlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogJ2NvbXBpbGUnIGZ1bmN0aW9uXG4gICAqXG4gICAqIENvbnZlcnRzIGFuIGFycmF5IG9mIGtleXMgaW50byBhIEpTT04gUG9pbnRlciBzdHJpbmdcbiAgICogKGlmIGlucHV0IGlzIGFscmVhZHkgYSBzdHJpbmcsIGl0IGlzIG5vcm1hbGl6ZWQgYW5kIHJldHVybmVkKVxuICAgKlxuICAgKiBUaGUgb3B0aW9uYWwgc2Vjb25kIHBhcmFtZXRlciBpcyBhIGRlZmF1bHQgd2hpY2ggd2lsbCByZXBsYWNlIGFueSBlbXB0eSBrZXlzLlxuICAgKlxuICAgKiAvLyAgeyBQb2ludGVyIH0gcG9pbnRlciAtIEpTT04gUG9pbnRlciAoc3RyaW5nIG9yIGFycmF5KVxuICAgKiAvLyAgeyBzdHJpbmcgfCBudW1iZXIgPSAnJyB9IGRlZmF1bHRWYWx1ZSAtIERlZmF1bHQgdmFsdWVcbiAgICogLy8gIHsgYm9vbGVhbiA9IGZhbHNlIH0gZXJyb3JzIC0gU2hvdyBlcnJvciBpZiBpbnZhbGlkIHBvaW50ZXI/XG4gICAqIC8vIHsgc3RyaW5nIH0gLSBKU09OIFBvaW50ZXIgc3RyaW5nXG4gICAqL1xuICBzdGF0aWMgY29tcGlsZShwb2ludGVyLCBkZWZhdWx0VmFsdWUgPSAnJywgZXJyb3JzID0gZmFsc2UpIHtcbiAgICBpZiAocG9pbnRlciA9PT0gJyMnKSB7IHJldHVybiAnJzsgfVxuICAgIGlmICghdGhpcy5pc0pzb25Qb2ludGVyKHBvaW50ZXIpKSB7XG4gICAgICBpZiAoZXJyb3JzKSB7IGNvbnNvbGUuZXJyb3IoYGNvbXBpbGUgZXJyb3I6IEludmFsaWQgSlNPTiBQb2ludGVyOiAke3BvaW50ZXJ9YCk7IH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoaXNBcnJheShwb2ludGVyKSkge1xuICAgICAgaWYgKCg8c3RyaW5nW10+cG9pbnRlcikubGVuZ3RoID09PSAwKSB7IHJldHVybiAnJzsgfVxuICAgICAgcmV0dXJuICcvJyArICg8c3RyaW5nW10+cG9pbnRlcikubWFwKFxuICAgICAgICBrZXkgPT4ga2V5ID09PSAnJyA/IGRlZmF1bHRWYWx1ZSA6IHRoaXMuZXNjYXBlKGtleSlcbiAgICAgICkuam9pbignLycpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHBvaW50ZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAocG9pbnRlclswXSA9PT0gJyMnKSB7IHBvaW50ZXIgPSBwb2ludGVyLnNsaWNlKDEpOyB9XG4gICAgICByZXR1cm4gcG9pbnRlcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogJ3RvS2V5JyBmdW5jdGlvblxuICAgKlxuICAgKiBFeHRyYWN0cyBuYW1lIG9mIHRoZSBmaW5hbCBrZXkgZnJvbSBhIEpTT04gUG9pbnRlci5cbiAgICpcbiAgICogLy8gIHsgUG9pbnRlciB9IHBvaW50ZXIgLSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSlcbiAgICogLy8gIHsgYm9vbGVhbiA9IGZhbHNlIH0gZXJyb3JzIC0gU2hvdyBlcnJvciBpZiBpbnZhbGlkIHBvaW50ZXI/XG4gICAqIC8vIHsgc3RyaW5nIH0gLSB0aGUgZXh0cmFjdGVkIGtleVxuICAgKi9cbiAgc3RhdGljIHRvS2V5KHBvaW50ZXIsIGVycm9ycyA9IGZhbHNlKSB7XG4gICAgY29uc3Qga2V5QXJyYXkgPSB0aGlzLnBhcnNlKHBvaW50ZXIsIGVycm9ycyk7XG4gICAgaWYgKGtleUFycmF5ID09PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG4gICAgaWYgKCFrZXlBcnJheS5sZW5ndGgpIHsgcmV0dXJuICcnOyB9XG4gICAgcmV0dXJuIGtleUFycmF5W2tleUFycmF5Lmxlbmd0aCAtIDFdO1xuICB9XG5cbiAgLyoqXG4gICAqICdpc0pzb25Qb2ludGVyJyBmdW5jdGlvblxuICAgKlxuICAgKiBDaGVja3MgYSBzdHJpbmcgb3IgYXJyYXkgdmFsdWUgdG8gZGV0ZXJtaW5lIGlmIGl0IGlzIGEgdmFsaWQgSlNPTiBQb2ludGVyLlxuICAgKiBSZXR1cm5zIHRydWUgaWYgYSBzdHJpbmcgaXMgZW1wdHksIG9yIHN0YXJ0cyB3aXRoICcvJyBvciAnIy8nLlxuICAgKiBSZXR1cm5zIHRydWUgaWYgYW4gYXJyYXkgY29udGFpbnMgb25seSBzdHJpbmcgdmFsdWVzLlxuICAgKlxuICAgKiAvLyAgIHZhbHVlIC0gdmFsdWUgdG8gY2hlY2tcbiAgICogLy8geyBib29sZWFuIH0gLSB0cnVlIGlmIHZhbHVlIGlzIGEgdmFsaWQgSlNPTiBQb2ludGVyLCBvdGhlcndpc2UgZmFsc2VcbiAgICovXG4gIHN0YXRpYyBpc0pzb25Qb2ludGVyKHZhbHVlKSB7XG4gICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdmFsdWUuZXZlcnkoa2V5ID0+IHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnKTtcbiAgICB9IGVsc2UgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgaWYgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJyMnKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICBpZiAodmFsdWVbMF0gPT09ICcvJyB8fCB2YWx1ZS5zbGljZSgwLCAyKSA9PT0gJyMvJykge1xuICAgICAgICByZXR1cm4gIS8oflteMDFdfH4kKS9nLnRlc3QodmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogJ2lzU3ViUG9pbnRlcicgZnVuY3Rpb25cbiAgICpcbiAgICogQ2hlY2tzIHdoZXRoZXIgb25lIEpTT04gUG9pbnRlciBpcyBhIHN1YnNldCBvZiBhbm90aGVyLlxuICAgKlxuICAgKiAvLyAgeyBQb2ludGVyIH0gc2hvcnRQb2ludGVyIC0gcG90ZW50aWFsIHN1YnNldCBKU09OIFBvaW50ZXJcbiAgICogLy8gIHsgUG9pbnRlciB9IGxvbmdQb2ludGVyIC0gcG90ZW50aWFsIHN1cGVyc2V0IEpTT04gUG9pbnRlclxuICAgKiAvLyAgeyBib29sZWFuID0gZmFsc2UgfSB0cnVlSWZNYXRjaGluZyAtIHJldHVybiB0cnVlIGlmIHBvaW50ZXJzIG1hdGNoP1xuICAgKiAvLyAgeyBib29sZWFuID0gZmFsc2UgfSBlcnJvcnMgLSBTaG93IGVycm9yIGlmIGludmFsaWQgcG9pbnRlcj9cbiAgICogLy8geyBib29sZWFuIH0gLSB0cnVlIGlmIHNob3J0UG9pbnRlciBpcyBhIHN1YnNldCBvZiBsb25nUG9pbnRlciwgZmFsc2UgaWYgbm90XG4gICAqL1xuICBzdGF0aWMgaXNTdWJQb2ludGVyKFxuICAgIHNob3J0UG9pbnRlciwgbG9uZ1BvaW50ZXIsIHRydWVJZk1hdGNoaW5nID0gZmFsc2UsIGVycm9ycyA9IGZhbHNlXG4gICkge1xuICAgIGlmICghdGhpcy5pc0pzb25Qb2ludGVyKHNob3J0UG9pbnRlcikgfHwgIXRoaXMuaXNKc29uUG9pbnRlcihsb25nUG9pbnRlcikpIHtcbiAgICAgIGlmIChlcnJvcnMpIHtcbiAgICAgICAgbGV0IGludmFsaWQgPSAnJztcbiAgICAgICAgaWYgKCF0aGlzLmlzSnNvblBvaW50ZXIoc2hvcnRQb2ludGVyKSkgeyBpbnZhbGlkICs9IGAgMTogJHtzaG9ydFBvaW50ZXJ9YDsgfVxuICAgICAgICBpZiAoIXRoaXMuaXNKc29uUG9pbnRlcihsb25nUG9pbnRlcikpIHsgaW52YWxpZCArPSBgIDI6ICR7bG9uZ1BvaW50ZXJ9YDsgfVxuICAgICAgICBjb25zb2xlLmVycm9yKGBpc1N1YlBvaW50ZXIgZXJyb3I6IEludmFsaWQgSlNPTiBQb2ludGVyICR7aW52YWxpZH1gKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2hvcnRQb2ludGVyID0gdGhpcy5jb21waWxlKHNob3J0UG9pbnRlciwgJycsIGVycm9ycyk7XG4gICAgbG9uZ1BvaW50ZXIgPSB0aGlzLmNvbXBpbGUobG9uZ1BvaW50ZXIsICcnLCBlcnJvcnMpO1xuICAgIHJldHVybiBzaG9ydFBvaW50ZXIgPT09IGxvbmdQb2ludGVyID8gdHJ1ZUlmTWF0Y2hpbmcgOlxuICAgICAgYCR7c2hvcnRQb2ludGVyfS9gID09PSBsb25nUG9pbnRlci5zbGljZSgwLCBzaG9ydFBvaW50ZXIubGVuZ3RoICsgMSk7XG4gIH1cblxuICAvKipcbiAgICogJ3RvSW5kZXhlZFBvaW50ZXInIGZ1bmN0aW9uXG4gICAqXG4gICAqIE1lcmdlcyBhbiBhcnJheSBvZiBudW1lcmljIGluZGV4ZXMgYW5kIGEgZ2VuZXJpYyBwb2ludGVyIHRvIGNyZWF0ZSBhblxuICAgKiBpbmRleGVkIHBvaW50ZXIgZm9yIGEgc3BlY2lmaWMgaXRlbS5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIG1lcmdpbmcgdGhlIGdlbmVyaWMgcG9pbnRlciAnL2Zvby8tL2Jhci8tL2JheicgYW5kXG4gICAqIHRoZSBhcnJheSBbNCwgMl0gd291bGQgcmVzdWx0IGluIHRoZSBpbmRleGVkIHBvaW50ZXIgJy9mb28vNC9iYXIvMi9iYXonXG4gICAqXG4gICAqXG4gICAqIC8vICB7IFBvaW50ZXIgfSBnZW5lcmljUG9pbnRlciAtIFRoZSBnZW5lcmljIHBvaW50ZXJcbiAgICogLy8gIHsgbnVtYmVyW10gfSBpbmRleEFycmF5IC0gVGhlIGFycmF5IG9mIG51bWVyaWMgaW5kZXhlc1xuICAgKiAvLyAgeyBNYXA8c3RyaW5nLCBudW1iZXI+IH0gYXJyYXlNYXAgLSBBbiBvcHRpb25hbCBhcnJheSBtYXBcbiAgICogLy8geyBzdHJpbmcgfSAtIFRoZSBtZXJnZWQgcG9pbnRlciB3aXRoIGluZGV4ZXNcbiAgICovXG4gIHN0YXRpYyB0b0luZGV4ZWRQb2ludGVyKFxuICAgIGdlbmVyaWNQb2ludGVyLCBpbmRleEFycmF5LCBhcnJheU1hcDogTWFwPHN0cmluZywgbnVtYmVyPiA9IG51bGxcbiAgKSB7XG4gICAgaWYgKHRoaXMuaXNKc29uUG9pbnRlcihnZW5lcmljUG9pbnRlcikgJiYgaXNBcnJheShpbmRleEFycmF5KSkge1xuICAgICAgbGV0IGluZGV4ZWRQb2ludGVyID0gdGhpcy5jb21waWxlKGdlbmVyaWNQb2ludGVyKTtcbiAgICAgIGlmIChpc01hcChhcnJheU1hcCkpIHtcbiAgICAgICAgbGV0IGFycmF5SW5kZXggPSAwO1xuICAgICAgICByZXR1cm4gaW5kZXhlZFBvaW50ZXIucmVwbGFjZSgvXFwvXFwtKD89XFwvfCQpL2csIChrZXksIHN0cmluZ0luZGV4KSA9PlxuICAgICAgICAgIGFycmF5TWFwLmhhcygoPHN0cmluZz5pbmRleGVkUG9pbnRlcikuc2xpY2UoMCwgc3RyaW5nSW5kZXgpKSA/XG4gICAgICAgICAgICAnLycgKyBpbmRleEFycmF5W2FycmF5SW5kZXgrK10gOiBrZXlcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoY29uc3QgcG9pbnRlckluZGV4IG9mIGluZGV4QXJyYXkpIHtcbiAgICAgICAgICBpbmRleGVkUG9pbnRlciA9IGluZGV4ZWRQb2ludGVyLnJlcGxhY2UoJy8tJywgJy8nICsgcG9pbnRlckluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5kZXhlZFBvaW50ZXI7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghdGhpcy5pc0pzb25Qb2ludGVyKGdlbmVyaWNQb2ludGVyKSkge1xuICAgICAgY29uc29sZS5lcnJvcihgdG9JbmRleGVkUG9pbnRlciBlcnJvcjogSW52YWxpZCBKU09OIFBvaW50ZXI6ICR7Z2VuZXJpY1BvaW50ZXJ9YCk7XG4gICAgfVxuICAgIGlmICghaXNBcnJheShpbmRleEFycmF5KSkge1xuICAgICAgY29uc29sZS5lcnJvcihgdG9JbmRleGVkUG9pbnRlciBlcnJvcjogSW52YWxpZCBpbmRleEFycmF5OiAke2luZGV4QXJyYXl9YCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICd0b0dlbmVyaWNQb2ludGVyJyBmdW5jdGlvblxuICAgKlxuICAgKiBDb21wYXJlcyBhbiBpbmRleGVkIHBvaW50ZXIgdG8gYW4gYXJyYXkgbWFwIGFuZCByZW1vdmVzIGxpc3QgYXJyYXlcbiAgICogaW5kZXhlcyAoYnV0IGxlYXZlcyB0dXBsZSBhcnJyYXkgaW5kZXhlcyBhbmQgYWxsIG9iamVjdCBrZXlzLCBpbmNsdWRpbmdcbiAgICogbnVtZXJpYyBrZXlzKSB0byBjcmVhdGUgYSBnZW5lcmljIHBvaW50ZXIuXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCB1c2luZyB0aGUgaW5kZXhlZCBwb2ludGVyICcvZm9vLzEvYmFyLzIvYmF6LzMnIGFuZFxuICAgKiB0aGUgYXJyYXlNYXAgW1snL2ZvbycsIDBdLCBbJy9mb28vLS9iYXInLCAzXSwgWycvZm9vLy0vYmFyLy0vYmF6JywgMF1dXG4gICAqIHdvdWxkIHJlc3VsdCBpbiB0aGUgZ2VuZXJpYyBwb2ludGVyICcvZm9vLy0vYmFyLzIvYmF6Ly0nXG4gICAqIFVzaW5nIHRoZSBpbmRleGVkIHBvaW50ZXIgJy9mb28vMS9iYXIvNC9iYXovMycgYW5kIHRoZSBzYW1lIGFycmF5TWFwXG4gICAqIHdvdWxkIHJlc3VsdCBpbiB0aGUgZ2VuZXJpYyBwb2ludGVyICcvZm9vLy0vYmFyLy0vYmF6Ly0nXG4gICAqICh0aGUgYmFyIGFycmF5IGhhcyAzIHR1cGxlIGl0ZW1zLCBzbyBpbmRleCAyIGlzIHJldGFpbmVkLCBidXQgNCBpcyByZW1vdmVkKVxuICAgKlxuICAgKiBUaGUgc3RydWN0dXJlIG9mIHRoZSBhcnJheU1hcCBpczogW1sncGF0aCB0byBhcnJheScsIG51bWJlciBvZiB0dXBsZSBpdGVtc10uLi5dXG4gICAqXG4gICAqXG4gICAqIC8vICB7IFBvaW50ZXIgfSBpbmRleGVkUG9pbnRlciAtIFRoZSBpbmRleGVkIHBvaW50ZXIgKGFycmF5IG9yIHN0cmluZylcbiAgICogLy8gIHsgTWFwPHN0cmluZywgbnVtYmVyPiB9IGFycmF5TWFwIC0gVGhlIG9wdGlvbmFsIGFycmF5IG1hcCAoZm9yIHByZXNlcnZpbmcgdHVwbGUgaW5kZXhlcylcbiAgICogLy8geyBzdHJpbmcgfSAtIFRoZSBnZW5lcmljIHBvaW50ZXIgd2l0aCBpbmRleGVzIHJlbW92ZWRcbiAgICovXG4gIHN0YXRpYyB0b0dlbmVyaWNQb2ludGVyKGluZGV4ZWRQb2ludGVyLCBhcnJheU1hcCA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCkpIHtcbiAgICBpZiAodGhpcy5pc0pzb25Qb2ludGVyKGluZGV4ZWRQb2ludGVyKSAmJiBpc01hcChhcnJheU1hcCkpIHtcbiAgICAgIGNvbnN0IHBvaW50ZXJBcnJheSA9IHRoaXMucGFyc2UoaW5kZXhlZFBvaW50ZXIpO1xuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwb2ludGVyQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc3ViUG9pbnRlciA9IHRoaXMuY29tcGlsZShwb2ludGVyQXJyYXkuc2xpY2UoMCwgaSkpO1xuICAgICAgICBpZiAoYXJyYXlNYXAuaGFzKHN1YlBvaW50ZXIpICYmXG4gICAgICAgICAgYXJyYXlNYXAuZ2V0KHN1YlBvaW50ZXIpIDw9ICtwb2ludGVyQXJyYXlbaV1cbiAgICAgICAgKSB7XG4gICAgICAgICAgcG9pbnRlckFycmF5W2ldID0gJy0nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5jb21waWxlKHBvaW50ZXJBcnJheSk7XG4gICAgfVxuICAgIGlmICghdGhpcy5pc0pzb25Qb2ludGVyKGluZGV4ZWRQb2ludGVyKSkge1xuICAgICAgY29uc29sZS5lcnJvcihgdG9HZW5lcmljUG9pbnRlciBlcnJvcjogaW52YWxpZCBKU09OIFBvaW50ZXI6ICR7aW5kZXhlZFBvaW50ZXJ9YCk7XG4gICAgfVxuICAgIGlmICghaXNNYXAoYXJyYXlNYXApKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGB0b0dlbmVyaWNQb2ludGVyIGVycm9yOiBpbnZhbGlkIGFycmF5TWFwOiAke2FycmF5TWFwfWApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAndG9Db250cm9sUG9pbnRlcicgZnVuY3Rpb25cbiAgICpcbiAgICogQWNjZXB0cyBhIEpTT04gUG9pbnRlciBmb3IgYSBkYXRhIG9iamVjdCBhbmQgcmV0dXJucyBhIEpTT04gUG9pbnRlciBmb3IgdGhlXG4gICAqIG1hdGNoaW5nIGNvbnRyb2wgaW4gYW4gQW5ndWxhciBGb3JtR3JvdXAuXG4gICAqXG4gICAqIC8vICB7IFBvaW50ZXIgfSBkYXRhUG9pbnRlciAtIEpTT04gUG9pbnRlciAoc3RyaW5nIG9yIGFycmF5KSB0byBhIGRhdGEgb2JqZWN0XG4gICAqIC8vICB7IEZvcm1Hcm91cCB9IGZvcm1Hcm91cCAtIEFuZ3VsYXIgRm9ybUdyb3VwIHRvIGdldCB2YWx1ZSBmcm9tXG4gICAqIC8vICB7IGJvb2xlYW4gPSBmYWxzZSB9IGNvbnRyb2xNdXN0RXhpc3QgLSBPbmx5IHJldHVybiBpZiBjb250cm9sIGV4aXN0cz9cbiAgICogLy8geyBQb2ludGVyIH0gLSBKU09OIFBvaW50ZXIgKHN0cmluZykgdG8gdGhlIGZvcm1Hcm91cCBvYmplY3RcbiAgICovXG4gIHN0YXRpYyB0b0NvbnRyb2xQb2ludGVyKGRhdGFQb2ludGVyLCBmb3JtR3JvdXAsIGNvbnRyb2xNdXN0RXhpc3QgPSBmYWxzZSkge1xuICAgIGNvbnN0IGRhdGFQb2ludGVyQXJyYXkgPSB0aGlzLnBhcnNlKGRhdGFQb2ludGVyKTtcbiAgICBjb25zdCBjb250cm9sUG9pbnRlckFycmF5OiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCBzdWJHcm91cCA9IGZvcm1Hcm91cDtcbiAgICBpZiAoZGF0YVBvaW50ZXJBcnJheSAhPT0gbnVsbCkge1xuICAgICAgZm9yIChjb25zdCBrZXkgb2YgZGF0YVBvaW50ZXJBcnJheSkge1xuICAgICAgICBpZiAoaGFzT3duKHN1Ykdyb3VwLCAnY29udHJvbHMnKSkge1xuICAgICAgICAgIGNvbnRyb2xQb2ludGVyQXJyYXkucHVzaCgnY29udHJvbHMnKTtcbiAgICAgICAgICBzdWJHcm91cCA9IHN1Ykdyb3VwLmNvbnRyb2xzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0FycmF5KHN1Ykdyb3VwKSAmJiAoa2V5ID09PSAnLScpKSB7XG4gICAgICAgICAgY29udHJvbFBvaW50ZXJBcnJheS5wdXNoKChzdWJHcm91cC5sZW5ndGggLSAxKS50b1N0cmluZygpKTtcbiAgICAgICAgICBzdWJHcm91cCA9IHN1Ykdyb3VwW3N1Ykdyb3VwLmxlbmd0aCAtIDFdO1xuICAgICAgICB9IGVsc2UgaWYgKGhhc093bihzdWJHcm91cCwga2V5KSkge1xuICAgICAgICAgIGNvbnRyb2xQb2ludGVyQXJyYXkucHVzaChrZXkpO1xuICAgICAgICAgIHN1Ykdyb3VwID0gc3ViR3JvdXBba2V5XTtcbiAgICAgICAgfSBlbHNlIGlmIChjb250cm9sTXVzdEV4aXN0KSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihgdG9Db250cm9sUG9pbnRlciBlcnJvcjogVW5hYmxlIHRvIGZpbmQgXCIke2tleX1cIiBpdGVtIGluIEZvcm1Hcm91cC5gKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGRhdGFQb2ludGVyKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGZvcm1Hcm91cCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnRyb2xQb2ludGVyQXJyYXkucHVzaChrZXkpO1xuICAgICAgICAgIHN1Ykdyb3VwID0geyBjb250cm9sczoge30gfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuY29tcGlsZShjb250cm9sUG9pbnRlckFycmF5KTtcbiAgICB9XG4gICAgY29uc29sZS5lcnJvcihgdG9Db250cm9sUG9pbnRlciBlcnJvcjogSW52YWxpZCBKU09OIFBvaW50ZXI6ICR7ZGF0YVBvaW50ZXJ9YCk7XG4gIH1cblxuICAvKipcbiAgICogJ3RvU2NoZW1hUG9pbnRlcicgZnVuY3Rpb25cbiAgICpcbiAgICogQWNjZXB0cyBhIEpTT04gUG9pbnRlciB0byBhIHZhbHVlIGluc2lkZSBhIGRhdGEgb2JqZWN0IGFuZCBhIEpTT04gc2NoZW1hXG4gICAqIGZvciB0aGF0IG9iamVjdC5cbiAgICpcbiAgICogUmV0dXJucyBhIFBvaW50ZXIgdG8gdGhlIHN1Yi1zY2hlbWEgZm9yIHRoZSB2YWx1ZSBpbnNpZGUgdGhlIG9iamVjdCdzIHNjaGVtYS5cbiAgICpcbiAgICogLy8gIHsgUG9pbnRlciB9IGRhdGFQb2ludGVyIC0gSlNPTiBQb2ludGVyIChzdHJpbmcgb3IgYXJyYXkpIHRvIGFuIG9iamVjdFxuICAgKiAvLyAgIHNjaGVtYSAtIEpTT04gc2NoZW1hIGZvciB0aGUgb2JqZWN0XG4gICAqIC8vIHsgUG9pbnRlciB9IC0gSlNPTiBQb2ludGVyIChzdHJpbmcpIHRvIHRoZSBvYmplY3QncyBzY2hlbWFcbiAgICovXG4gIHN0YXRpYyB0b1NjaGVtYVBvaW50ZXIoZGF0YVBvaW50ZXIsIHNjaGVtYSkge1xuICAgIGlmICh0aGlzLmlzSnNvblBvaW50ZXIoZGF0YVBvaW50ZXIpICYmIHR5cGVvZiBzY2hlbWEgPT09ICdvYmplY3QnKSB7XG4gICAgICBjb25zdCBwb2ludGVyQXJyYXkgPSB0aGlzLnBhcnNlKGRhdGFQb2ludGVyKTtcbiAgICAgIGlmICghcG9pbnRlckFycmF5Lmxlbmd0aCkgeyByZXR1cm4gJyc7IH1cbiAgICAgIGNvbnN0IGZpcnN0S2V5ID0gcG9pbnRlckFycmF5LnNoaWZ0KCk7XG4gICAgICBpZiAoc2NoZW1hLnR5cGUgPT09ICdvYmplY3QnIHx8IHNjaGVtYS5wcm9wZXJ0aWVzIHx8IHNjaGVtYS5hZGRpdGlvbmFsUHJvcGVydGllcykge1xuICAgICAgICBpZiAoKHNjaGVtYS5wcm9wZXJ0aWVzIHx8IHt9KVtmaXJzdEtleV0pIHtcbiAgICAgICAgICByZXR1cm4gYC9wcm9wZXJ0aWVzLyR7dGhpcy5lc2NhcGUoZmlyc3RLZXkpfWAgK1xuICAgICAgICAgICAgdGhpcy50b1NjaGVtYVBvaW50ZXIocG9pbnRlckFycmF5LCBzY2hlbWEucHJvcGVydGllc1tmaXJzdEtleV0pO1xuICAgICAgICB9IGVsc2UgIGlmIChzY2hlbWEuYWRkaXRpb25hbFByb3BlcnRpZXMpIHtcbiAgICAgICAgICByZXR1cm4gJy9hZGRpdGlvbmFsUHJvcGVydGllcycgK1xuICAgICAgICAgICAgdGhpcy50b1NjaGVtYVBvaW50ZXIocG9pbnRlckFycmF5LCBzY2hlbWEuYWRkaXRpb25hbFByb3BlcnRpZXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoKHNjaGVtYS50eXBlID09PSAnYXJyYXknIHx8IHNjaGVtYS5pdGVtcykgJiZcbiAgICAgICAgKGlzTnVtYmVyKGZpcnN0S2V5KSB8fCBmaXJzdEtleSA9PT0gJy0nIHx8IGZpcnN0S2V5ID09PSAnJylcbiAgICAgICkge1xuICAgICAgICBjb25zdCBhcnJheUl0ZW0gPSBmaXJzdEtleSA9PT0gJy0nIHx8IGZpcnN0S2V5ID09PSAnJyA/IDAgOiArZmlyc3RLZXk7XG4gICAgICAgIGlmIChpc0FycmF5KHNjaGVtYS5pdGVtcykpIHtcbiAgICAgICAgICBpZiAoYXJyYXlJdGVtIDwgc2NoZW1hLml0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuICcvaXRlbXMvJyArIGFycmF5SXRlbSArXG4gICAgICAgICAgICAgIHRoaXMudG9TY2hlbWFQb2ludGVyKHBvaW50ZXJBcnJheSwgc2NoZW1hLml0ZW1zW2FycmF5SXRlbV0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc2NoZW1hLmFkZGl0aW9uYWxJdGVtcykge1xuICAgICAgICAgICAgcmV0dXJuICcvYWRkaXRpb25hbEl0ZW1zJyArXG4gICAgICAgICAgICAgIHRoaXMudG9TY2hlbWFQb2ludGVyKHBvaW50ZXJBcnJheSwgc2NoZW1hLmFkZGl0aW9uYWxJdGVtcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KHNjaGVtYS5pdGVtcykpIHtcbiAgICAgICAgICByZXR1cm4gJy9pdGVtcycgKyB0aGlzLnRvU2NoZW1hUG9pbnRlcihwb2ludGVyQXJyYXksIHNjaGVtYS5pdGVtcyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3Qoc2NoZW1hLmFkZGl0aW9uYWxJdGVtcykpIHtcbiAgICAgICAgICByZXR1cm4gJy9hZGRpdGlvbmFsSXRlbXMnICtcbiAgICAgICAgICAgIHRoaXMudG9TY2hlbWFQb2ludGVyKHBvaW50ZXJBcnJheSwgc2NoZW1hLmFkZGl0aW9uYWxJdGVtcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnNvbGUuZXJyb3IoYHRvU2NoZW1hUG9pbnRlciBlcnJvcjogRGF0YSBwb2ludGVyICR7ZGF0YVBvaW50ZXJ9IGAgK1xuICAgICAgICBgbm90IGNvbXBhdGlibGUgd2l0aCBzY2hlbWEgJHtzY2hlbWF9YCk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmlzSnNvblBvaW50ZXIoZGF0YVBvaW50ZXIpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGB0b1NjaGVtYVBvaW50ZXIgZXJyb3I6IEludmFsaWQgSlNPTiBQb2ludGVyOiAke2RhdGFQb2ludGVyfWApO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHNjaGVtYSAhPT0gJ29iamVjdCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYHRvU2NoZW1hUG9pbnRlciBlcnJvcjogSW52YWxpZCBKU09OIFNjaGVtYTogJHtzY2hlbWF9YCk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqICd0b0RhdGFQb2ludGVyJyBmdW5jdGlvblxuICAgKlxuICAgKiBBY2NlcHRzIGEgSlNPTiBQb2ludGVyIHRvIGEgc3ViLXNjaGVtYSBpbnNpZGUgYSBKU09OIHNjaGVtYSBhbmQgdGhlIHNjaGVtYS5cbiAgICpcbiAgICogSWYgcG9zc2libGUsIHJldHVybnMgYSBnZW5lcmljIFBvaW50ZXIgdG8gdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWUgaW5zaWRlXG4gICAqIHRoZSBkYXRhIG9iamVjdCBkZXNjcmliZWQgYnkgdGhlIEpTT04gc2NoZW1hLlxuICAgKlxuICAgKiBSZXR1cm5zIG51bGwgaWYgdGhlIHN1Yi1zY2hlbWEgaXMgaW4gYW4gYW1iaWd1b3VzIGxvY2F0aW9uIChzdWNoIGFzXG4gICAqIGRlZmluaXRpb25zIG9yIGFkZGl0aW9uYWxQcm9wZXJ0aWVzKSB3aGVyZSB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZVxuICAgKiBsb2NhdGlvbiBjYW5ub3QgYmUgZGV0ZXJtaW5lZC5cbiAgICpcbiAgICogLy8gIHsgUG9pbnRlciB9IHNjaGVtYVBvaW50ZXIgLSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSkgdG8gYSBKU09OIHNjaGVtYVxuICAgKiAvLyAgIHNjaGVtYSAtIHRoZSBKU09OIHNjaGVtYVxuICAgKiAvLyAgeyBib29sZWFuID0gZmFsc2UgfSBlcnJvcnMgLSBTaG93IGVycm9ycz9cbiAgICogLy8geyBQb2ludGVyIH0gLSBKU09OIFBvaW50ZXIgKHN0cmluZykgdG8gdGhlIHZhbHVlIGluIHRoZSBkYXRhIG9iamVjdFxuICAgKi9cbiAgc3RhdGljIHRvRGF0YVBvaW50ZXIoc2NoZW1hUG9pbnRlciwgc2NoZW1hLCBlcnJvcnMgPSBmYWxzZSkge1xuICAgIGlmICh0aGlzLmlzSnNvblBvaW50ZXIoc2NoZW1hUG9pbnRlcikgJiYgdHlwZW9mIHNjaGVtYSA9PT0gJ29iamVjdCcgJiZcbiAgICAgIHRoaXMuaGFzKHNjaGVtYSwgc2NoZW1hUG9pbnRlcilcbiAgICApIHtcbiAgICAgIGNvbnN0IHBvaW50ZXJBcnJheSA9IHRoaXMucGFyc2Uoc2NoZW1hUG9pbnRlcik7XG4gICAgICBpZiAoIXBvaW50ZXJBcnJheS5sZW5ndGgpIHsgcmV0dXJuICcnOyB9XG4gICAgICBjb25zdCBmaXJzdEtleSA9IHBvaW50ZXJBcnJheS5zaGlmdCgpO1xuICAgICAgaWYgKGZpcnN0S2V5ID09PSAncHJvcGVydGllcycgfHxcbiAgICAgICAgKGZpcnN0S2V5ID09PSAnaXRlbXMnICYmIGlzQXJyYXkoc2NoZW1hLml0ZW1zKSlcbiAgICAgICkge1xuICAgICAgICBjb25zdCBzZWNvbmRLZXkgPSBwb2ludGVyQXJyYXkuc2hpZnQoKTtcbiAgICAgICAgY29uc3QgcG9pbnRlclN1ZmZpeCA9IHRoaXMudG9EYXRhUG9pbnRlcihwb2ludGVyQXJyYXksIHNjaGVtYVtmaXJzdEtleV1bc2Vjb25kS2V5XSk7XG4gICAgICAgIHJldHVybiBwb2ludGVyU3VmZml4ID09PSBudWxsID8gbnVsbCA6ICcvJyArIHNlY29uZEtleSArIHBvaW50ZXJTdWZmaXg7XG4gICAgICB9IGVsc2UgaWYgKGZpcnN0S2V5ID09PSAnYWRkaXRpb25hbEl0ZW1zJyB8fFxuICAgICAgICAoZmlyc3RLZXkgPT09ICdpdGVtcycgJiYgaXNPYmplY3Qoc2NoZW1hLml0ZW1zKSlcbiAgICAgICkge1xuICAgICAgICBjb25zdCBwb2ludGVyU3VmZml4ID0gdGhpcy50b0RhdGFQb2ludGVyKHBvaW50ZXJBcnJheSwgc2NoZW1hW2ZpcnN0S2V5XSk7XG4gICAgICAgIHJldHVybiBwb2ludGVyU3VmZml4ID09PSBudWxsID8gbnVsbCA6ICcvLScgKyBwb2ludGVyU3VmZml4O1xuICAgICAgfSBlbHNlIGlmIChbJ2FsbE9mJywgJ2FueU9mJywgJ29uZU9mJ10uaW5jbHVkZXMoZmlyc3RLZXkpKSB7XG4gICAgICAgIGNvbnN0IHNlY29uZEtleSA9IHBvaW50ZXJBcnJheS5zaGlmdCgpO1xuICAgICAgICByZXR1cm4gdGhpcy50b0RhdGFQb2ludGVyKHBvaW50ZXJBcnJheSwgc2NoZW1hW2ZpcnN0S2V5XVtzZWNvbmRLZXldKTtcbiAgICAgIH0gZWxzZSBpZiAoZmlyc3RLZXkgPT09ICdub3QnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvRGF0YVBvaW50ZXIocG9pbnRlckFycmF5LCBzY2hlbWFbZmlyc3RLZXldKTtcbiAgICAgIH0gZWxzZSBpZiAoWydjb250YWlucycsICdkZWZpbml0aW9ucycsICdkZXBlbmRlbmNpZXMnLCAnYWRkaXRpb25hbEl0ZW1zJyxcbiAgICAgICAgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJywgJ3BhdHRlcm5Qcm9wZXJ0aWVzJywgJ3Byb3BlcnR5TmFtZXMnXS5pbmNsdWRlcyhmaXJzdEtleSlcbiAgICAgICkge1xuICAgICAgICBpZiAoZXJyb3JzKSB7IGNvbnNvbGUuZXJyb3IoYHRvRGF0YVBvaW50ZXIgZXJyb3I6IEFtYmlndW91cyBsb2NhdGlvbmApOyB9XG4gICAgICB9XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmIChlcnJvcnMpIHtcbiAgICAgIGlmICghdGhpcy5pc0pzb25Qb2ludGVyKHNjaGVtYVBvaW50ZXIpKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYHRvRGF0YVBvaW50ZXIgZXJyb3I6IEludmFsaWQgSlNPTiBQb2ludGVyOiAke3NjaGVtYVBvaW50ZXJ9YCk7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHNjaGVtYSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgdG9EYXRhUG9pbnRlciBlcnJvcjogSW52YWxpZCBKU09OIFNjaGVtYTogJHtzY2hlbWF9YCk7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHNjaGVtYSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgdG9EYXRhUG9pbnRlciBlcnJvcjogUG9pbnRlciAke3NjaGVtYVBvaW50ZXJ9IGludmFsaWQgZm9yIFNjaGVtYTogJHtzY2hlbWF9YCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqICdwYXJzZU9iamVjdFBhdGgnIGZ1bmN0aW9uXG4gICAqXG4gICAqIFBhcnNlcyBhIEphdmFTY3JpcHQgb2JqZWN0IHBhdGggaW50byBhbiBhcnJheSBvZiBrZXlzLCB3aGljaFxuICAgKiBjYW4gdGhlbiBiZSBwYXNzZWQgdG8gY29tcGlsZSgpIHRvIGNvbnZlcnQgaW50byBhIHN0cmluZyBKU09OIFBvaW50ZXIuXG4gICAqXG4gICAqIEJhc2VkIG9uIG1pa2UtbWFyY2FjY2kncyBleGNlbGxlbnQgb2JqZWN0cGF0aCBwYXJzZSBmdW5jdGlvbjpcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL21pa2UtbWFyY2FjY2kvb2JqZWN0cGF0aFxuICAgKlxuICAgKiAvLyAgeyBQb2ludGVyIH0gcGF0aCAtIFRoZSBvYmplY3QgcGF0aCB0byBwYXJzZVxuICAgKiAvLyB7IHN0cmluZ1tdIH0gLSBUaGUgcmVzdWx0aW5nIGFycmF5IG9mIGtleXNcbiAgICovXG4gIHN0YXRpYyBwYXJzZU9iamVjdFBhdGgocGF0aCkge1xuICAgIGlmIChpc0FycmF5KHBhdGgpKSB7IHJldHVybiA8c3RyaW5nW10+cGF0aDsgfVxuICAgIGlmICh0aGlzLmlzSnNvblBvaW50ZXIocGF0aCkpIHsgcmV0dXJuIHRoaXMucGFyc2UocGF0aCk7IH1cbiAgICBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gW107XG4gICAgICB3aGlsZSAoaW5kZXggPCBwYXRoLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBuZXh0RG90ID0gcGF0aC5pbmRleE9mKCcuJywgaW5kZXgpO1xuICAgICAgICBjb25zdCBuZXh0T0IgPSBwYXRoLmluZGV4T2YoJ1snLCBpbmRleCk7IC8vIG5leHQgb3BlbiBicmFja2V0XG4gICAgICAgIGlmIChuZXh0RG90ID09PSAtMSAmJiBuZXh0T0IgPT09IC0xKSB7IC8vIGxhc3QgaXRlbVxuICAgICAgICAgIHBhcnRzLnB1c2gocGF0aC5zbGljZShpbmRleCkpO1xuICAgICAgICAgIGluZGV4ID0gcGF0aC5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSBpZiAobmV4dERvdCAhPT0gLTEgJiYgKG5leHREb3QgPCBuZXh0T0IgfHwgbmV4dE9CID09PSAtMSkpIHsgLy8gZG90IG5vdGF0aW9uXG4gICAgICAgICAgcGFydHMucHVzaChwYXRoLnNsaWNlKGluZGV4LCBuZXh0RG90KSk7XG4gICAgICAgICAgaW5kZXggPSBuZXh0RG90ICsgMTtcbiAgICAgICAgfSBlbHNlIHsgLy8gYnJhY2tldCBub3RhdGlvblxuICAgICAgICAgIGlmIChuZXh0T0IgPiBpbmRleCkge1xuICAgICAgICAgICAgcGFydHMucHVzaChwYXRoLnNsaWNlKGluZGV4LCBuZXh0T0IpKTtcbiAgICAgICAgICAgIGluZGV4ID0gbmV4dE9CO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBxdW90ZSA9IHBhdGguY2hhckF0KG5leHRPQiArIDEpO1xuICAgICAgICAgIGlmIChxdW90ZSA9PT0gJ1wiJyB8fCBxdW90ZSA9PT0gJ1xcJycpIHsgLy8gZW5jbG9zaW5nIHF1b3Rlc1xuICAgICAgICAgICAgbGV0IG5leHRDQiA9IHBhdGguaW5kZXhPZihxdW90ZSArICddJywgbmV4dE9CKTsgLy8gbmV4dCBjbG9zZSBicmFja2V0XG4gICAgICAgICAgICB3aGlsZSAobmV4dENCICE9PSAtMSAmJiBwYXRoLmNoYXJBdChuZXh0Q0IgLSAxKSA9PT0gJ1xcXFwnKSB7XG4gICAgICAgICAgICAgIG5leHRDQiA9IHBhdGguaW5kZXhPZihxdW90ZSArICddJywgbmV4dENCICsgMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobmV4dENCID09PSAtMSkgeyBuZXh0Q0IgPSBwYXRoLmxlbmd0aDsgfVxuICAgICAgICAgICAgcGFydHMucHVzaChwYXRoLnNsaWNlKGluZGV4ICsgMiwgbmV4dENCKVxuICAgICAgICAgICAgICAucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcJyArIHF1b3RlLCAnZycpLCBxdW90ZSkpO1xuICAgICAgICAgICAgaW5kZXggPSBuZXh0Q0IgKyAyO1xuICAgICAgICAgIH0gZWxzZSB7IC8vIG5vIGVuY2xvc2luZyBxdW90ZXNcbiAgICAgICAgICAgIGxldCBuZXh0Q0IgPSBwYXRoLmluZGV4T2YoJ10nLCBuZXh0T0IpOyAvLyBuZXh0IGNsb3NlIGJyYWNrZXRcbiAgICAgICAgICAgIGlmIChuZXh0Q0IgPT09IC0xKSB7IG5leHRDQiA9IHBhdGgubGVuZ3RoOyB9XG4gICAgICAgICAgICBwYXJ0cy5wdXNoKHBhdGguc2xpY2UoaW5kZXggKyAxLCBuZXh0Q0IpKTtcbiAgICAgICAgICAgIGluZGV4ID0gbmV4dENCICsgMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHBhdGguY2hhckF0KGluZGV4KSA9PT0gJy4nKSB7IGluZGV4Kys7IH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcnRzO1xuICAgIH1cbiAgICBjb25zb2xlLmVycm9yKCdwYXJzZU9iamVjdFBhdGggZXJyb3I6IElucHV0IG9iamVjdCBwYXRoIG11c3QgYmUgYSBzdHJpbmcuJyk7XG4gIH1cbn1cbiJdfQ==