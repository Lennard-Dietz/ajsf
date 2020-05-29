/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import isEqual from 'lodash/isEqual';
import { _executeAsyncValidators, _executeValidators, _mergeErrors, _mergeObjects, getType, hasValue, isArray, isBoolean, isDefined, isEmpty, isNumber, isString, isType, toJavaScriptType, toObservable, xor } from './validator.functions';
import { forEachCopy } from './utility.functions';
import { forkJoin } from 'rxjs';
import { jsonSchemaFormatTests } from './format-regex.constants';
import { map } from 'rxjs/operators';
/**
 * 'JsonValidators' class
 *
 * Provides an extended set of validators to be used by form controls,
 * compatible with standard JSON Schema validation options.
 * http://json-schema.org/latest/json-schema-validation.html
 *
 * Note: This library is designed as a drop-in replacement for the Angular
 * Validators library, and except for one small breaking change to the 'pattern'
 * validator (described below) it can even be imported as a substitute, like so:
 *
 *   import { JsonValidators as Validators } from 'json-validators';
 *
 * and it should work with existing code as a complete replacement.
 *
 * The one exception is the 'pattern' validator, which has been changed to
 * matche partial values by default (the standard 'pattern' validator wrapped
 * all patterns in '^' and '$', forcing them to always match an entire value).
 * However, the old behavior can be restored by simply adding '^' and '$'
 * around your patterns, or by passing an optional second parameter of TRUE.
 * This change is to make the 'pattern' validator match the behavior of a
 * JSON Schema pattern, which allows partial matches, rather than the behavior
 * of an HTML input control pattern, which does not.
 *
 * This library replaces Angular's validators and combination functions
 * with the following validators and transformation functions:
 *
 * Validators:
 *   For all formControls:     required (*), type, enum, const
 *   For text formControls:    minLength (*), maxLength (*), pattern (*), format
 *   For numeric formControls: maximum, exclusiveMaximum,
 *                             minimum, exclusiveMinimum, multipleOf
 *   For formGroup objects:    minProperties, maxProperties, dependencies
 *   For formArray arrays:     minItems, maxItems, uniqueItems, contains
 *   Not used by JSON Schema:  min (*), max (*), requiredTrue (*), email (*)
 * (Validators originally included with Angular are maked with (*).)
 *
 * NOTE / TODO: The dependencies validator is not complete.
 * NOTE / TODO: The contains validator is not complete.
 *
 * Validators not used by JSON Schema (but included for compatibility)
 * and their JSON Schema equivalents:
 *
 *   Angular validator | JSON Schema equivalent
 *   ------------------|-----------------------
 *     min(number)     |   minimum(number)
 *     max(number)     |   maximum(number)
 *     requiredTrue()  |   const(true)
 *     email()         |   format('email')
 *
 * Validator transformation functions:
 *   composeAnyOf, composeOneOf, composeAllOf, composeNot
 * (Angular's original combination funciton, 'compose', is also included for
 * backward compatibility, though it is functionally equivalent to composeAllOf,
 * asside from its more generic error message.)
 *
 * All validators have also been extended to accept an optional second argument
 * which, if passed a TRUE value, causes the validator to perform the opposite
 * of its original finction. (This is used internally to enable 'not' and
 * 'composeOneOf' to function and return useful error messages.)
 *
 * The 'required' validator has also been overloaded so that if called with
 * a boolean parameter (or no parameters) it returns the original validator
 * function (rather than executing it). However, if it is called with an
 * AbstractControl parameter (as was previously required), it behaves
 * exactly as before.
 *
 * This enables all validators (including 'required') to be constructed in
 * exactly the same way, so they can be automatically applied using the
 * equivalent key names and values taken directly from a JSON Schema.
 *
 * This source code is partially derived from Angular,
 * which is Copyright (c) 2014-2017 Google, Inc.
 * Use of this source code is therefore governed by the same MIT-style license
 * that can be found in the LICENSE file at https://angular.io/license
 *
 * Original Angular Validators:
 * https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
 */
var /**
 * 'JsonValidators' class
 *
 * Provides an extended set of validators to be used by form controls,
 * compatible with standard JSON Schema validation options.
 * http://json-schema.org/latest/json-schema-validation.html
 *
 * Note: This library is designed as a drop-in replacement for the Angular
 * Validators library, and except for one small breaking change to the 'pattern'
 * validator (described below) it can even be imported as a substitute, like so:
 *
 *   import { JsonValidators as Validators } from 'json-validators';
 *
 * and it should work with existing code as a complete replacement.
 *
 * The one exception is the 'pattern' validator, which has been changed to
 * matche partial values by default (the standard 'pattern' validator wrapped
 * all patterns in '^' and '$', forcing them to always match an entire value).
 * However, the old behavior can be restored by simply adding '^' and '$'
 * around your patterns, or by passing an optional second parameter of TRUE.
 * This change is to make the 'pattern' validator match the behavior of a
 * JSON Schema pattern, which allows partial matches, rather than the behavior
 * of an HTML input control pattern, which does not.
 *
 * This library replaces Angular's validators and combination functions
 * with the following validators and transformation functions:
 *
 * Validators:
 *   For all formControls:     required (*), type, enum, const
 *   For text formControls:    minLength (*), maxLength (*), pattern (*), format
 *   For numeric formControls: maximum, exclusiveMaximum,
 *                             minimum, exclusiveMinimum, multipleOf
 *   For formGroup objects:    minProperties, maxProperties, dependencies
 *   For formArray arrays:     minItems, maxItems, uniqueItems, contains
 *   Not used by JSON Schema:  min (*), max (*), requiredTrue (*), email (*)
 * (Validators originally included with Angular are maked with (*).)
 *
 * NOTE / TODO: The dependencies validator is not complete.
 * NOTE / TODO: The contains validator is not complete.
 *
 * Validators not used by JSON Schema (but included for compatibility)
 * and their JSON Schema equivalents:
 *
 *   Angular validator | JSON Schema equivalent
 *   ------------------|-----------------------
 *     min(number)     |   minimum(number)
 *     max(number)     |   maximum(number)
 *     requiredTrue()  |   const(true)
 *     email()         |   format('email')
 *
 * Validator transformation functions:
 *   composeAnyOf, composeOneOf, composeAllOf, composeNot
 * (Angular's original combination funciton, 'compose', is also included for
 * backward compatibility, though it is functionally equivalent to composeAllOf,
 * asside from its more generic error message.)
 *
 * All validators have also been extended to accept an optional second argument
 * which, if passed a TRUE value, causes the validator to perform the opposite
 * of its original finction. (This is used internally to enable 'not' and
 * 'composeOneOf' to function and return useful error messages.)
 *
 * The 'required' validator has also been overloaded so that if called with
 * a boolean parameter (or no parameters) it returns the original validator
 * function (rather than executing it). However, if it is called with an
 * AbstractControl parameter (as was previously required), it behaves
 * exactly as before.
 *
 * This enables all validators (including 'required') to be constructed in
 * exactly the same way, so they can be automatically applied using the
 * equivalent key names and values taken directly from a JSON Schema.
 *
 * This source code is partially derived from Angular,
 * which is Copyright (c) 2014-2017 Google, Inc.
 * Use of this source code is therefore governed by the same MIT-style license
 * that can be found in the LICENSE file at https://angular.io/license
 *
 * Original Angular Validators:
 * https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
 */
JsonValidators = /** @class */ (function () {
    function JsonValidators() {
    }
    /**
     * @param {?=} input
     * @return {?}
     */
    JsonValidators.required = /**
     * @param {?=} input
     * @return {?}
     */
    function (input) {
        if (input === undefined) {
            input = true;
        }
        switch (input) {
            case true: // Return required function (do not execute it yet)
                return (/**
                 * @param {?} control
                 * @param {?=} invert
                 * @return {?}
                 */
                function (control, invert) {
                    if (invert === void 0) { invert = false; }
                    if (invert) {
                        return null;
                    } // if not required, always return valid
                    return hasValue(control.value) ? null : { 'required': true };
                });
            case false: // Do nothing (if field is not required, it is always valid)
                return JsonValidators.nullValidator;
            default: // Execute required function
                return hasValue(((/** @type {?} */ (input))).value) ? null : { 'required': true };
        }
    };
    /**
     * 'type' validator
     *
     * Requires a control to only accept values of a specified type,
     * or one of an array of types.
     *
     * Note: SchemaPrimitiveType = 'string'|'number'|'integer'|'boolean'|'null'
     *
     * // {SchemaPrimitiveType|SchemaPrimitiveType[]} type - type(s) to accept
     * // {IValidatorFn}
     */
    /**
     * 'type' validator
     *
     * Requires a control to only accept values of a specified type,
     * or one of an array of types.
     *
     * Note: SchemaPrimitiveType = 'string'|'number'|'integer'|'boolean'|'null'
     *
     * // {SchemaPrimitiveType|SchemaPrimitiveType[]} type - type(s) to accept
     * // {IValidatorFn}
     * @param {?} requiredType
     * @return {?}
     */
    JsonValidators.type = /**
     * 'type' validator
     *
     * Requires a control to only accept values of a specified type,
     * or one of an array of types.
     *
     * Note: SchemaPrimitiveType = 'string'|'number'|'integer'|'boolean'|'null'
     *
     * // {SchemaPrimitiveType|SchemaPrimitiveType[]} type - type(s) to accept
     * // {IValidatorFn}
     * @param {?} requiredType
     * @return {?}
     */
    function (requiredType) {
        if (!hasValue(requiredType)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentValue = control.value;
            /** @type {?} */
            var isValid = isArray(requiredType) ?
                ((/** @type {?} */ (requiredType))).some((/**
                 * @param {?} type
                 * @return {?}
                 */
                function (type) { return isType(currentValue, type); })) :
                isType(currentValue, (/** @type {?} */ (requiredType)));
            return xor(isValid, invert) ?
                null : { 'type': { requiredType: requiredType, currentValue: currentValue } };
        });
    };
    /**
     * 'enum' validator
     *
     * Requires a control to have a value from an enumerated list of values.
     *
     * Converts types as needed to allow string inputs to still correctly
     * match number, boolean, and null enum values.
     *
     * // {any[]} allowedValues - array of acceptable values
     * // {IValidatorFn}
     */
    /**
     * 'enum' validator
     *
     * Requires a control to have a value from an enumerated list of values.
     *
     * Converts types as needed to allow string inputs to still correctly
     * match number, boolean, and null enum values.
     *
     * // {any[]} allowedValues - array of acceptable values
     * // {IValidatorFn}
     * @param {?} allowedValues
     * @return {?}
     */
    JsonValidators.enum = /**
     * 'enum' validator
     *
     * Requires a control to have a value from an enumerated list of values.
     *
     * Converts types as needed to allow string inputs to still correctly
     * match number, boolean, and null enum values.
     *
     * // {any[]} allowedValues - array of acceptable values
     * // {IValidatorFn}
     * @param {?} allowedValues
     * @return {?}
     */
    function (allowedValues) {
        if (!isArray(allowedValues)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentValue = control.value;
            /** @type {?} */
            var isEqualVal = (/**
             * @param {?} enumValue
             * @param {?} inputValue
             * @return {?}
             */
            function (enumValue, inputValue) {
                return enumValue === inputValue ||
                    (isNumber(enumValue) && +inputValue === +enumValue) ||
                    (isBoolean(enumValue, 'strict') &&
                        toJavaScriptType(inputValue, 'boolean') === enumValue) ||
                    (enumValue === null && !hasValue(inputValue)) ||
                    isEqual(enumValue, inputValue);
            });
            /** @type {?} */
            var isValid = isArray(currentValue) ?
                currentValue.every((/**
                 * @param {?} inputValue
                 * @return {?}
                 */
                function (inputValue) { return allowedValues.some((/**
                 * @param {?} enumValue
                 * @return {?}
                 */
                function (enumValue) {
                    return isEqualVal(enumValue, inputValue);
                })); })) :
                allowedValues.some((/**
                 * @param {?} enumValue
                 * @return {?}
                 */
                function (enumValue) { return isEqualVal(enumValue, currentValue); }));
            return xor(isValid, invert) ?
                null : { 'enum': { allowedValues: allowedValues, currentValue: currentValue } };
        });
    };
    /**
     * 'const' validator
     *
     * Requires a control to have a specific value.
     *
     * Converts types as needed to allow string inputs to still correctly
     * match number, boolean, and null values.
     *
     * TODO: modify to work with objects
     *
     * // {any[]} requiredValue - required value
     * // {IValidatorFn}
     */
    /**
     * 'const' validator
     *
     * Requires a control to have a specific value.
     *
     * Converts types as needed to allow string inputs to still correctly
     * match number, boolean, and null values.
     *
     * TODO: modify to work with objects
     *
     * // {any[]} requiredValue - required value
     * // {IValidatorFn}
     * @param {?} requiredValue
     * @return {?}
     */
    JsonValidators.const = /**
     * 'const' validator
     *
     * Requires a control to have a specific value.
     *
     * Converts types as needed to allow string inputs to still correctly
     * match number, boolean, and null values.
     *
     * TODO: modify to work with objects
     *
     * // {any[]} requiredValue - required value
     * // {IValidatorFn}
     * @param {?} requiredValue
     * @return {?}
     */
    function (requiredValue) {
        if (!hasValue(requiredValue)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentValue = control.value;
            /** @type {?} */
            var isEqualVal = (/**
             * @param {?} constValue
             * @param {?} inputValue
             * @return {?}
             */
            function (constValue, inputValue) {
                return constValue === inputValue ||
                    isNumber(constValue) && +inputValue === +constValue ||
                    isBoolean(constValue, 'strict') &&
                        toJavaScriptType(inputValue, 'boolean') === constValue ||
                    constValue === null && !hasValue(inputValue);
            });
            /** @type {?} */
            var isValid = isEqualVal(requiredValue, currentValue);
            return xor(isValid, invert) ?
                null : { 'const': { requiredValue: requiredValue, currentValue: currentValue } };
        });
    };
    /**
     * 'minLength' validator
     *
     * Requires a control's text value to be greater than a specified length.
     *
     * // {number} minimumLength - minimum allowed string length
     * // {boolean = false} invert - instead return error object only if valid
     * // {IValidatorFn}
     */
    /**
     * 'minLength' validator
     *
     * Requires a control's text value to be greater than a specified length.
     *
     * // {number} minimumLength - minimum allowed string length
     * // {boolean = false} invert - instead return error object only if valid
     * // {IValidatorFn}
     * @param {?} minimumLength
     * @return {?}
     */
    JsonValidators.minLength = /**
     * 'minLength' validator
     *
     * Requires a control's text value to be greater than a specified length.
     *
     * // {number} minimumLength - minimum allowed string length
     * // {boolean = false} invert - instead return error object only if valid
     * // {IValidatorFn}
     * @param {?} minimumLength
     * @return {?}
     */
    function (minimumLength) {
        if (!hasValue(minimumLength)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentLength = isString(control.value) ? control.value.length : 0;
            /** @type {?} */
            var isValid = currentLength >= minimumLength;
            return xor(isValid, invert) ?
                null : { 'minLength': { minimumLength: minimumLength, currentLength: currentLength } };
        });
    };
    /**
     * 'maxLength' validator
     *
     * Requires a control's text value to be less than a specified length.
     *
     * // {number} maximumLength - maximum allowed string length
     * // {boolean = false} invert - instead return error object only if valid
     * // {IValidatorFn}
     */
    /**
     * 'maxLength' validator
     *
     * Requires a control's text value to be less than a specified length.
     *
     * // {number} maximumLength - maximum allowed string length
     * // {boolean = false} invert - instead return error object only if valid
     * // {IValidatorFn}
     * @param {?} maximumLength
     * @return {?}
     */
    JsonValidators.maxLength = /**
     * 'maxLength' validator
     *
     * Requires a control's text value to be less than a specified length.
     *
     * // {number} maximumLength - maximum allowed string length
     * // {boolean = false} invert - instead return error object only if valid
     * // {IValidatorFn}
     * @param {?} maximumLength
     * @return {?}
     */
    function (maximumLength) {
        if (!hasValue(maximumLength)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            /** @type {?} */
            var currentLength = isString(control.value) ? control.value.length : 0;
            /** @type {?} */
            var isValid = currentLength <= maximumLength;
            return xor(isValid, invert) ?
                null : { 'maxLength': { maximumLength: maximumLength, currentLength: currentLength } };
        });
    };
    /**
     * 'pattern' validator
     *
     * Note: NOT the same as Angular's default pattern validator.
     *
     * Requires a control's value to match a specified regular expression pattern.
     *
     * This validator changes the behavior of default pattern validator
     * by replacing RegExp(`^${pattern}$`) with RegExp(`${pattern}`),
     * which allows for partial matches.
     *
     * To return to the default funcitonality, and match the entire string,
     * pass TRUE as the optional second parameter.
     *
     * // {string} pattern - regular expression pattern
     * // {boolean = false} wholeString - match whole value string?
     * // {IValidatorFn}
     */
    /**
     * 'pattern' validator
     *
     * Note: NOT the same as Angular's default pattern validator.
     *
     * Requires a control's value to match a specified regular expression pattern.
     *
     * This validator changes the behavior of default pattern validator
     * by replacing RegExp(`^${pattern}$`) with RegExp(`${pattern}`),
     * which allows for partial matches.
     *
     * To return to the default funcitonality, and match the entire string,
     * pass TRUE as the optional second parameter.
     *
     * // {string} pattern - regular expression pattern
     * // {boolean = false} wholeString - match whole value string?
     * // {IValidatorFn}
     * @param {?} pattern
     * @param {?=} wholeString
     * @return {?}
     */
    JsonValidators.pattern = /**
     * 'pattern' validator
     *
     * Note: NOT the same as Angular's default pattern validator.
     *
     * Requires a control's value to match a specified regular expression pattern.
     *
     * This validator changes the behavior of default pattern validator
     * by replacing RegExp(`^${pattern}$`) with RegExp(`${pattern}`),
     * which allows for partial matches.
     *
     * To return to the default funcitonality, and match the entire string,
     * pass TRUE as the optional second parameter.
     *
     * // {string} pattern - regular expression pattern
     * // {boolean = false} wholeString - match whole value string?
     * // {IValidatorFn}
     * @param {?} pattern
     * @param {?=} wholeString
     * @return {?}
     */
    function (pattern, wholeString) {
        if (wholeString === void 0) { wholeString = false; }
        if (!hasValue(pattern)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var regex;
            /** @type {?} */
            var requiredPattern;
            if (typeof pattern === 'string') {
                requiredPattern = (wholeString) ? "^" + pattern + "$" : pattern;
                regex = new RegExp(requiredPattern);
            }
            else {
                requiredPattern = pattern.toString();
                regex = pattern;
            }
            /** @type {?} */
            var currentValue = control.value;
            /** @type {?} */
            var isValid = isString(currentValue) ? regex.test(currentValue) : false;
            return xor(isValid, invert) ?
                null : { 'pattern': { requiredPattern: requiredPattern, currentValue: currentValue } };
        });
    };
    /**
     * 'format' validator
     *
     * Requires a control to have a value of a certain format.
     *
     * This validator currently checks the following formsts:
     *   date, time, date-time, email, hostname, ipv4, ipv6,
     *   uri, uri-reference, uri-template, url, uuid, color,
     *   json-pointer, relative-json-pointer, regex
     *
     * Fast format regular expressions copied from AJV:
     * https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js
     *
     * // {JsonSchemaFormatNames} requiredFormat - format to check
     * // {IValidatorFn}
     */
    /**
     * 'format' validator
     *
     * Requires a control to have a value of a certain format.
     *
     * This validator currently checks the following formsts:
     *   date, time, date-time, email, hostname, ipv4, ipv6,
     *   uri, uri-reference, uri-template, url, uuid, color,
     *   json-pointer, relative-json-pointer, regex
     *
     * Fast format regular expressions copied from AJV:
     * https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js
     *
     * // {JsonSchemaFormatNames} requiredFormat - format to check
     * // {IValidatorFn}
     * @param {?} requiredFormat
     * @return {?}
     */
    JsonValidators.format = /**
     * 'format' validator
     *
     * Requires a control to have a value of a certain format.
     *
     * This validator currently checks the following formsts:
     *   date, time, date-time, email, hostname, ipv4, ipv6,
     *   uri, uri-reference, uri-template, url, uuid, color,
     *   json-pointer, relative-json-pointer, regex
     *
     * Fast format regular expressions copied from AJV:
     * https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js
     *
     * // {JsonSchemaFormatNames} requiredFormat - format to check
     * // {IValidatorFn}
     * @param {?} requiredFormat
     * @return {?}
     */
    function (requiredFormat) {
        if (!hasValue(requiredFormat)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var isValid;
            /** @type {?} */
            var currentValue = control.value;
            if (isString(currentValue)) {
                /** @type {?} */
                var formatTest = jsonSchemaFormatTests[requiredFormat];
                if (typeof formatTest === 'object') {
                    isValid = ((/** @type {?} */ (formatTest))).test((/** @type {?} */ (currentValue)));
                }
                else if (typeof formatTest === 'function') {
                    isValid = ((/** @type {?} */ (formatTest)))((/** @type {?} */ (currentValue)));
                }
                else {
                    console.error("format validator error: \"" + requiredFormat + "\" is not a recognized format.");
                    isValid = true;
                }
            }
            else {
                // Allow JavaScript Date objects
                isValid = ['date', 'time', 'date-time'].includes(requiredFormat) &&
                    Object.prototype.toString.call(currentValue) === '[object Date]';
            }
            return xor(isValid, invert) ?
                null : { 'format': { requiredFormat: requiredFormat, currentValue: currentValue } };
        });
    };
    /**
     * 'minimum' validator
     *
     * Requires a control's numeric value to be greater than or equal to
     * a minimum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a minimum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} minimum - minimum allowed value
     * // {IValidatorFn}
     */
    /**
     * 'minimum' validator
     *
     * Requires a control's numeric value to be greater than or equal to
     * a minimum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a minimum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} minimum - minimum allowed value
     * // {IValidatorFn}
     * @param {?} minimumValue
     * @return {?}
     */
    JsonValidators.minimum = /**
     * 'minimum' validator
     *
     * Requires a control's numeric value to be greater than or equal to
     * a minimum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a minimum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} minimum - minimum allowed value
     * // {IValidatorFn}
     * @param {?} minimumValue
     * @return {?}
     */
    function (minimumValue) {
        if (!hasValue(minimumValue)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentValue = control.value;
            /** @type {?} */
            var isValid = !isNumber(currentValue) || currentValue >= minimumValue;
            return xor(isValid, invert) ?
                null : { 'minimum': { minimumValue: minimumValue, currentValue: currentValue } };
        });
    };
    /**
     * 'exclusiveMinimum' validator
     *
     * Requires a control's numeric value to be less than a maximum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a maximum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} exclusiveMinimumValue - maximum allowed value
     * // {IValidatorFn}
     */
    /**
     * 'exclusiveMinimum' validator
     *
     * Requires a control's numeric value to be less than a maximum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a maximum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} exclusiveMinimumValue - maximum allowed value
     * // {IValidatorFn}
     * @param {?} exclusiveMinimumValue
     * @return {?}
     */
    JsonValidators.exclusiveMinimum = /**
     * 'exclusiveMinimum' validator
     *
     * Requires a control's numeric value to be less than a maximum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a maximum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} exclusiveMinimumValue - maximum allowed value
     * // {IValidatorFn}
     * @param {?} exclusiveMinimumValue
     * @return {?}
     */
    function (exclusiveMinimumValue) {
        if (!hasValue(exclusiveMinimumValue)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentValue = control.value;
            /** @type {?} */
            var isValid = !isNumber(currentValue) || +currentValue < exclusiveMinimumValue;
            return xor(isValid, invert) ?
                null : { 'exclusiveMinimum': { exclusiveMinimumValue: exclusiveMinimumValue, currentValue: currentValue } };
        });
    };
    /**
     * 'maximum' validator
     *
     * Requires a control's numeric value to be less than or equal to
     * a maximum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a maximum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} maximumValue - maximum allowed value
     * // {IValidatorFn}
     */
    /**
     * 'maximum' validator
     *
     * Requires a control's numeric value to be less than or equal to
     * a maximum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a maximum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} maximumValue - maximum allowed value
     * // {IValidatorFn}
     * @param {?} maximumValue
     * @return {?}
     */
    JsonValidators.maximum = /**
     * 'maximum' validator
     *
     * Requires a control's numeric value to be less than or equal to
     * a maximum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a maximum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} maximumValue - maximum allowed value
     * // {IValidatorFn}
     * @param {?} maximumValue
     * @return {?}
     */
    function (maximumValue) {
        if (!hasValue(maximumValue)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentValue = control.value;
            /** @type {?} */
            var isValid = !isNumber(currentValue) || +currentValue <= maximumValue;
            return xor(isValid, invert) ?
                null : { 'maximum': { maximumValue: maximumValue, currentValue: currentValue } };
        });
    };
    /**
     * 'exclusiveMaximum' validator
     *
     * Requires a control's numeric value to be less than a maximum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a maximum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} exclusiveMaximumValue - maximum allowed value
     * // {IValidatorFn}
     */
    /**
     * 'exclusiveMaximum' validator
     *
     * Requires a control's numeric value to be less than a maximum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a maximum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} exclusiveMaximumValue - maximum allowed value
     * // {IValidatorFn}
     * @param {?} exclusiveMaximumValue
     * @return {?}
     */
    JsonValidators.exclusiveMaximum = /**
     * 'exclusiveMaximum' validator
     *
     * Requires a control's numeric value to be less than a maximum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a maximum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} exclusiveMaximumValue - maximum allowed value
     * // {IValidatorFn}
     * @param {?} exclusiveMaximumValue
     * @return {?}
     */
    function (exclusiveMaximumValue) {
        if (!hasValue(exclusiveMaximumValue)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentValue = control.value;
            /** @type {?} */
            var isValid = !isNumber(currentValue) || +currentValue < exclusiveMaximumValue;
            return xor(isValid, invert) ?
                null : { 'exclusiveMaximum': { exclusiveMaximumValue: exclusiveMaximumValue, currentValue: currentValue } };
        });
    };
    /**
     * 'multipleOf' validator
     *
     * Requires a control to have a numeric value that is a multiple
     * of a specified number.
     *
     * // {number} multipleOfValue - number value must be a multiple of
     * // {IValidatorFn}
     */
    /**
     * 'multipleOf' validator
     *
     * Requires a control to have a numeric value that is a multiple
     * of a specified number.
     *
     * // {number} multipleOfValue - number value must be a multiple of
     * // {IValidatorFn}
     * @param {?} multipleOfValue
     * @return {?}
     */
    JsonValidators.multipleOf = /**
     * 'multipleOf' validator
     *
     * Requires a control to have a numeric value that is a multiple
     * of a specified number.
     *
     * // {number} multipleOfValue - number value must be a multiple of
     * // {IValidatorFn}
     * @param {?} multipleOfValue
     * @return {?}
     */
    function (multipleOfValue) {
        if (!hasValue(multipleOfValue)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentValue = control.value;
            /** @type {?} */
            var isValid = isNumber(currentValue) &&
                currentValue % multipleOfValue === 0;
            return xor(isValid, invert) ?
                null : { 'multipleOf': { multipleOfValue: multipleOfValue, currentValue: currentValue } };
        });
    };
    /**
     * 'minProperties' validator
     *
     * Requires a form group to have a minimum number of properties (i.e. have
     * values entered in a minimum number of controls within the group).
     *
     * // {number} minimumProperties - minimum number of properties allowed
     * // {IValidatorFn}
     */
    /**
     * 'minProperties' validator
     *
     * Requires a form group to have a minimum number of properties (i.e. have
     * values entered in a minimum number of controls within the group).
     *
     * // {number} minimumProperties - minimum number of properties allowed
     * // {IValidatorFn}
     * @param {?} minimumProperties
     * @return {?}
     */
    JsonValidators.minProperties = /**
     * 'minProperties' validator
     *
     * Requires a form group to have a minimum number of properties (i.e. have
     * values entered in a minimum number of controls within the group).
     *
     * // {number} minimumProperties - minimum number of properties allowed
     * // {IValidatorFn}
     * @param {?} minimumProperties
     * @return {?}
     */
    function (minimumProperties) {
        if (!hasValue(minimumProperties)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentProperties = Object.keys(control.value).length || 0;
            /** @type {?} */
            var isValid = currentProperties >= minimumProperties;
            return xor(isValid, invert) ?
                null : { 'minProperties': { minimumProperties: minimumProperties, currentProperties: currentProperties } };
        });
    };
    /**
     * 'maxProperties' validator
     *
     * Requires a form group to have a maximum number of properties (i.e. have
     * values entered in a maximum number of controls within the group).
     *
     * Note: Has no effect if the form group does not contain more than the
     * maximum number of controls.
     *
     * // {number} maximumProperties - maximum number of properties allowed
     * // {IValidatorFn}
     */
    /**
     * 'maxProperties' validator
     *
     * Requires a form group to have a maximum number of properties (i.e. have
     * values entered in a maximum number of controls within the group).
     *
     * Note: Has no effect if the form group does not contain more than the
     * maximum number of controls.
     *
     * // {number} maximumProperties - maximum number of properties allowed
     * // {IValidatorFn}
     * @param {?} maximumProperties
     * @return {?}
     */
    JsonValidators.maxProperties = /**
     * 'maxProperties' validator
     *
     * Requires a form group to have a maximum number of properties (i.e. have
     * values entered in a maximum number of controls within the group).
     *
     * Note: Has no effect if the form group does not contain more than the
     * maximum number of controls.
     *
     * // {number} maximumProperties - maximum number of properties allowed
     * // {IValidatorFn}
     * @param {?} maximumProperties
     * @return {?}
     */
    function (maximumProperties) {
        if (!hasValue(maximumProperties)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            /** @type {?} */
            var currentProperties = Object.keys(control.value).length || 0;
            /** @type {?} */
            var isValid = currentProperties <= maximumProperties;
            return xor(isValid, invert) ?
                null : { 'maxProperties': { maximumProperties: maximumProperties, currentProperties: currentProperties } };
        });
    };
    /**
     * 'dependencies' validator
     *
     * Requires the controls in a form group to meet additional validation
     * criteria, depending on the values of other controls in the group.
     *
     * Examples:
     * https://spacetelescope.github.io/understanding-json-schema/reference/object.html#dependencies
     *
     * // {any} dependencies - required dependencies
     * // {IValidatorFn}
     */
    /**
     * 'dependencies' validator
     *
     * Requires the controls in a form group to meet additional validation
     * criteria, depending on the values of other controls in the group.
     *
     * Examples:
     * https://spacetelescope.github.io/understanding-json-schema/reference/object.html#dependencies
     *
     * // {any} dependencies - required dependencies
     * // {IValidatorFn}
     * @param {?} dependencies
     * @return {?}
     */
    JsonValidators.dependencies = /**
     * 'dependencies' validator
     *
     * Requires the controls in a form group to meet additional validation
     * criteria, depending on the values of other controls in the group.
     *
     * Examples:
     * https://spacetelescope.github.io/understanding-json-schema/reference/object.html#dependencies
     *
     * // {any} dependencies - required dependencies
     * // {IValidatorFn}
     * @param {?} dependencies
     * @return {?}
     */
    function (dependencies) {
        if (getType(dependencies) !== 'object' || isEmpty(dependencies)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var allErrors = _mergeObjects(forEachCopy(dependencies, (/**
             * @param {?} value
             * @param {?} requiringField
             * @return {?}
             */
            function (value, requiringField) {
                var e_1, _a, _b;
                if (!hasValue(control.value[requiringField])) {
                    return null;
                }
                /** @type {?} */
                var requiringFieldErrors = {};
                /** @type {?} */
                var requiredFields;
                /** @type {?} */
                var properties = {};
                if (getType(dependencies[requiringField]) === 'array') {
                    requiredFields = dependencies[requiringField];
                }
                else if (getType(dependencies[requiringField]) === 'object') {
                    requiredFields = dependencies[requiringField]['required'] || [];
                    properties = dependencies[requiringField]['properties'] || {};
                }
                try {
                    // Validate property dependencies
                    for (var requiredFields_1 = tslib_1.__values(requiredFields), requiredFields_1_1 = requiredFields_1.next(); !requiredFields_1_1.done; requiredFields_1_1 = requiredFields_1.next()) {
                        var requiredField = requiredFields_1_1.value;
                        if (xor(!hasValue(control.value[requiredField]), invert)) {
                            requiringFieldErrors[requiredField] = { 'required': true };
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (requiredFields_1_1 && !requiredFields_1_1.done && (_a = requiredFields_1.return)) _a.call(requiredFields_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                // Validate schema dependencies
                requiringFieldErrors = _mergeObjects(requiringFieldErrors, forEachCopy(properties, (/**
                 * @param {?} requirements
                 * @param {?} requiredField
                 * @return {?}
                 */
                function (requirements, requiredField) {
                    var _a;
                    /** @type {?} */
                    var requiredFieldErrors = _mergeObjects(forEachCopy(requirements, (/**
                     * @param {?} requirement
                     * @param {?} parameter
                     * @return {?}
                     */
                    function (requirement, parameter) {
                        /** @type {?} */
                        var validator = null;
                        if (requirement === 'maximum' || requirement === 'minimum') {
                            /** @type {?} */
                            var exclusive = !!requirements['exclusiveM' + requirement.slice(1)];
                            validator = JsonValidators[requirement](parameter, exclusive);
                        }
                        else if (typeof JsonValidators[requirement] === 'function') {
                            validator = JsonValidators[requirement](parameter);
                        }
                        return !isDefined(validator) ?
                            null : validator(control.value[requiredField]);
                    })));
                    return isEmpty(requiredFieldErrors) ?
                        null : (_a = {}, _a[requiredField] = requiredFieldErrors, _a);
                })));
                return isEmpty(requiringFieldErrors) ?
                    null : (_b = {}, _b[requiringField] = requiringFieldErrors, _b);
            })));
            return isEmpty(allErrors) ? null : allErrors;
        });
    };
    /**
     * 'minItems' validator
     *
     * Requires a form array to have a minimum number of values.
     *
     * // {number} minimumItems - minimum number of items allowed
     * // {IValidatorFn}
     */
    /**
     * 'minItems' validator
     *
     * Requires a form array to have a minimum number of values.
     *
     * // {number} minimumItems - minimum number of items allowed
     * // {IValidatorFn}
     * @param {?} minimumItems
     * @return {?}
     */
    JsonValidators.minItems = /**
     * 'minItems' validator
     *
     * Requires a form array to have a minimum number of values.
     *
     * // {number} minimumItems - minimum number of items allowed
     * // {IValidatorFn}
     * @param {?} minimumItems
     * @return {?}
     */
    function (minimumItems) {
        if (!hasValue(minimumItems)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentItems = isArray(control.value) ? control.value.length : 0;
            /** @type {?} */
            var isValid = currentItems >= minimumItems;
            return xor(isValid, invert) ?
                null : { 'minItems': { minimumItems: minimumItems, currentItems: currentItems } };
        });
    };
    /**
     * 'maxItems' validator
     *
     * Requires a form array to have a maximum number of values.
     *
     * // {number} maximumItems - maximum number of items allowed
     * // {IValidatorFn}
     */
    /**
     * 'maxItems' validator
     *
     * Requires a form array to have a maximum number of values.
     *
     * // {number} maximumItems - maximum number of items allowed
     * // {IValidatorFn}
     * @param {?} maximumItems
     * @return {?}
     */
    JsonValidators.maxItems = /**
     * 'maxItems' validator
     *
     * Requires a form array to have a maximum number of values.
     *
     * // {number} maximumItems - maximum number of items allowed
     * // {IValidatorFn}
     * @param {?} maximumItems
     * @return {?}
     */
    function (maximumItems) {
        if (!hasValue(maximumItems)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            /** @type {?} */
            var currentItems = isArray(control.value) ? control.value.length : 0;
            /** @type {?} */
            var isValid = currentItems <= maximumItems;
            return xor(isValid, invert) ?
                null : { 'maxItems': { maximumItems: maximumItems, currentItems: currentItems } };
        });
    };
    /**
     * 'uniqueItems' validator
     *
     * Requires values in a form array to be unique.
     *
     * // {boolean = true} unique? - true to validate, false to disable
     * // {IValidatorFn}
     */
    /**
     * 'uniqueItems' validator
     *
     * Requires values in a form array to be unique.
     *
     * // {boolean = true} unique? - true to validate, false to disable
     * // {IValidatorFn}
     * @param {?=} unique
     * @return {?}
     */
    JsonValidators.uniqueItems = /**
     * 'uniqueItems' validator
     *
     * Requires values in a form array to be unique.
     *
     * // {boolean = true} unique? - true to validate, false to disable
     * // {IValidatorFn}
     * @param {?=} unique
     * @return {?}
     */
    function (unique) {
        if (unique === void 0) { unique = true; }
        if (!unique) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var sorted = control.value.slice().sort();
            /** @type {?} */
            var duplicateItems = [];
            for (var i = 1; i < sorted.length; i++) {
                if (sorted[i - 1] === sorted[i] && duplicateItems.includes(sorted[i])) {
                    duplicateItems.push(sorted[i]);
                }
            }
            /** @type {?} */
            var isValid = !duplicateItems.length;
            return xor(isValid, invert) ?
                null : { 'uniqueItems': { duplicateItems: duplicateItems } };
        });
    };
    /**
     * 'contains' validator
     *
     * TODO: Complete this validator
     *
     * Requires values in a form array to be unique.
     *
     * // {boolean = true} unique? - true to validate, false to disable
     * // {IValidatorFn}
     */
    /**
     * 'contains' validator
     *
     * TODO: Complete this validator
     *
     * Requires values in a form array to be unique.
     *
     * // {boolean = true} unique? - true to validate, false to disable
     * // {IValidatorFn}
     * @param {?=} requiredItem
     * @return {?}
     */
    JsonValidators.contains = /**
     * 'contains' validator
     *
     * TODO: Complete this validator
     *
     * Requires values in a form array to be unique.
     *
     * // {boolean = true} unique? - true to validate, false to disable
     * // {IValidatorFn}
     * @param {?=} requiredItem
     * @return {?}
     */
    function (requiredItem) {
        if (requiredItem === void 0) { requiredItem = true; }
        if (!requiredItem) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value) || !isArray(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentItems = control.value;
            // const isValid = currentItems.some(item =>
            //
            // );
            /** @type {?} */
            var isValid = true;
            return xor(isValid, invert) ?
                null : { 'contains': { requiredItem: requiredItem, currentItems: currentItems } };
        });
    };
    /**
     * No-op validator. Included for backward compatibility.
     */
    /**
     * No-op validator. Included for backward compatibility.
     * @param {?} control
     * @return {?}
     */
    JsonValidators.nullValidator = /**
     * No-op validator. Included for backward compatibility.
     * @param {?} control
     * @return {?}
     */
    function (control) {
        return null;
    };
    /**
     * Validator transformation functions:
     * composeAnyOf, composeOneOf, composeAllOf, composeNot,
     * compose, composeAsync
     *
     * TODO: Add composeAnyOfAsync, composeOneOfAsync,
     *           composeAllOfAsync, composeNotAsync
     */
    /**
     * 'composeAnyOf' validator combination function
     *
     * Accepts an array of validators and returns a single validator that
     * evaluates to valid if any one or more of the submitted validators are
     * valid. If every validator is invalid, it returns combined errors from
     * all validators.
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     */
    /**
       * Validator transformation functions:
       * composeAnyOf, composeOneOf, composeAllOf, composeNot,
       * compose, composeAsync
       *
       * TODO: Add composeAnyOfAsync, composeOneOfAsync,
       *           composeAllOfAsync, composeNotAsync
       */
    /**
     * 'composeAnyOf' validator combination function
     *
     * Accepts an array of validators and returns a single validator that
     * evaluates to valid if any one or more of the submitted validators are
     * valid. If every validator is invalid, it returns combined errors from
     * all validators.
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     * @param {?} validators
     * @return {?}
     */
    JsonValidators.composeAnyOf = /**
       * Validator transformation functions:
       * composeAnyOf, composeOneOf, composeAllOf, composeNot,
       * compose, composeAsync
       *
       * TODO: Add composeAnyOfAsync, composeOneOfAsync,
       *           composeAllOfAsync, composeNotAsync
       */
    /**
     * 'composeAnyOf' validator combination function
     *
     * Accepts an array of validators and returns a single validator that
     * evaluates to valid if any one or more of the submitted validators are
     * valid. If every validator is invalid, it returns combined errors from
     * all validators.
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     * @param {?} validators
     * @return {?}
     */
    function (validators) {
        if (!validators) {
            return null;
        }
        /** @type {?} */
        var presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            /** @type {?} */
            var arrayOfErrors = _executeValidators(control, presentValidators, invert).filter(isDefined);
            /** @type {?} */
            var isValid = validators.length > arrayOfErrors.length;
            return xor(isValid, invert) ?
                null : _mergeObjects.apply(void 0, tslib_1.__spread(arrayOfErrors, [{ 'anyOf': !invert }]));
        });
    };
    /**
     * 'composeOneOf' validator combination function
     *
     * Accepts an array of validators and returns a single validator that
     * evaluates to valid only if exactly one of the submitted validators
     * is valid. Otherwise returns combined information from all validators,
     * both valid and invalid.
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     */
    /**
     * 'composeOneOf' validator combination function
     *
     * Accepts an array of validators and returns a single validator that
     * evaluates to valid only if exactly one of the submitted validators
     * is valid. Otherwise returns combined information from all validators,
     * both valid and invalid.
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     * @param {?} validators
     * @return {?}
     */
    JsonValidators.composeOneOf = /**
     * 'composeOneOf' validator combination function
     *
     * Accepts an array of validators and returns a single validator that
     * evaluates to valid only if exactly one of the submitted validators
     * is valid. Otherwise returns combined information from all validators,
     * both valid and invalid.
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     * @param {?} validators
     * @return {?}
     */
    function (validators) {
        if (!validators) {
            return null;
        }
        /** @type {?} */
        var presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            /** @type {?} */
            var arrayOfErrors = _executeValidators(control, presentValidators);
            /** @type {?} */
            var validControls = validators.length - arrayOfErrors.filter(isDefined).length;
            /** @type {?} */
            var isValid = validControls === 1;
            if (xor(isValid, invert)) {
                return null;
            }
            /** @type {?} */
            var arrayOfValids = _executeValidators(control, presentValidators, invert);
            return _mergeObjects.apply(void 0, tslib_1.__spread(arrayOfErrors, arrayOfValids, [{ 'oneOf': !invert }]));
        });
    };
    /**
     * 'composeAllOf' validator combination function
     *
     * Accepts an array of validators and returns a single validator that
     * evaluates to valid only if all the submitted validators are individually
     * valid. Otherwise it returns combined errors from all invalid validators.
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     */
    /**
     * 'composeAllOf' validator combination function
     *
     * Accepts an array of validators and returns a single validator that
     * evaluates to valid only if all the submitted validators are individually
     * valid. Otherwise it returns combined errors from all invalid validators.
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     * @param {?} validators
     * @return {?}
     */
    JsonValidators.composeAllOf = /**
     * 'composeAllOf' validator combination function
     *
     * Accepts an array of validators and returns a single validator that
     * evaluates to valid only if all the submitted validators are individually
     * valid. Otherwise it returns combined errors from all invalid validators.
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     * @param {?} validators
     * @return {?}
     */
    function (validators) {
        if (!validators) {
            return null;
        }
        /** @type {?} */
        var presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            /** @type {?} */
            var combinedErrors = _mergeErrors(_executeValidators(control, presentValidators, invert));
            /** @type {?} */
            var isValid = combinedErrors === null;
            return (xor(isValid, invert)) ?
                null : _mergeObjects(combinedErrors, { 'allOf': !invert });
        });
    };
    /**
     * 'composeNot' validator inversion function
     *
     * Accepts a single validator function and inverts its result.
     * Returns valid if the submitted validator is invalid, and
     * returns invalid if the submitted validator is valid.
     * (Note: this function can itself be inverted
     *   - e.g. composeNot(composeNot(validator)) -
     *   but this can be confusing and is therefore not recommended.)
     *
     * // {IValidatorFn[]} validators - validator(s) to invert
     * // {IValidatorFn} - new validator function that returns opposite result
     */
    /**
     * 'composeNot' validator inversion function
     *
     * Accepts a single validator function and inverts its result.
     * Returns valid if the submitted validator is invalid, and
     * returns invalid if the submitted validator is valid.
     * (Note: this function can itself be inverted
     *   - e.g. composeNot(composeNot(validator)) -
     *   but this can be confusing and is therefore not recommended.)
     *
     * // {IValidatorFn[]} validators - validator(s) to invert
     * // {IValidatorFn} - new validator function that returns opposite result
     * @param {?} validator
     * @return {?}
     */
    JsonValidators.composeNot = /**
     * 'composeNot' validator inversion function
     *
     * Accepts a single validator function and inverts its result.
     * Returns valid if the submitted validator is invalid, and
     * returns invalid if the submitted validator is valid.
     * (Note: this function can itself be inverted
     *   - e.g. composeNot(composeNot(validator)) -
     *   but this can be confusing and is therefore not recommended.)
     *
     * // {IValidatorFn[]} validators - validator(s) to invert
     * // {IValidatorFn} - new validator function that returns opposite result
     * @param {?} validator
     * @return {?}
     */
    function (validator) {
        if (!validator) {
            return null;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var error = validator(control, !invert);
            /** @type {?} */
            var isValid = error === null;
            return (xor(isValid, invert)) ?
                null : _mergeObjects(error, { 'not': !invert });
        });
    };
    /**
     * 'compose' validator combination function
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     */
    /**
     * 'compose' validator combination function
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     * @param {?} validators
     * @return {?}
     */
    JsonValidators.compose = /**
     * 'compose' validator combination function
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     * @param {?} validators
     * @return {?}
     */
    function (validators) {
        if (!validators) {
            return null;
        }
        /** @type {?} */
        var presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        function (control, invert) {
            if (invert === void 0) { invert = false; }
            return _mergeErrors(_executeValidators(control, presentValidators, invert));
        });
    };
    /**
     * 'composeAsync' async validator combination function
     *
     * // {AsyncIValidatorFn[]} async validators - array of async validators
     * // {AsyncIValidatorFn} - single combined async validator function
     */
    /**
     * 'composeAsync' async validator combination function
     *
     * // {AsyncIValidatorFn[]} async validators - array of async validators
     * // {AsyncIValidatorFn} - single combined async validator function
     * @param {?} validators
     * @return {?}
     */
    JsonValidators.composeAsync = /**
     * 'composeAsync' async validator combination function
     *
     * // {AsyncIValidatorFn[]} async validators - array of async validators
     * // {AsyncIValidatorFn} - single combined async validator function
     * @param {?} validators
     * @return {?}
     */
    function (validators) {
        if (!validators) {
            return null;
        }
        /** @type {?} */
        var presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return (/**
         * @param {?} control
         * @return {?}
         */
        function (control) {
            /** @type {?} */
            var observables = _executeAsyncValidators(control, presentValidators).map(toObservable);
            return map.call(forkJoin(observables), _mergeErrors);
        });
    };
    // Additional angular validators (not used by Angualr JSON Schema Form)
    // From https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
    /**
     * Validator that requires controls to have a value greater than a number.
     */
    // Additional angular validators (not used by Angualr JSON Schema Form)
    // From https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
    /**
     * Validator that requires controls to have a value greater than a number.
     * @param {?} min
     * @return {?}
     */
    JsonValidators.min = 
    // Additional angular validators (not used by Angualr JSON Schema Form)
    // From https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
    /**
     * Validator that requires controls to have a value greater than a number.
     * @param {?} min
     * @return {?}
     */
    function (min) {
        if (!hasValue(min)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @return {?}
         */
        function (control) {
            // don't validate empty values to allow optional controls
            if (isEmpty(control.value) || isEmpty(min)) {
                return null;
            }
            /** @type {?} */
            var value = parseFloat(control.value);
            /** @type {?} */
            var actual = control.value;
            // Controls with NaN values after parsing should be treated as not having a
            // minimum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-min
            return isNaN(value) || value >= min ? null : { 'min': { min: min, actual: actual } };
        });
    };
    /**
     * Validator that requires controls to have a value less than a number.
     */
    /**
     * Validator that requires controls to have a value less than a number.
     * @param {?} max
     * @return {?}
     */
    JsonValidators.max = /**
     * Validator that requires controls to have a value less than a number.
     * @param {?} max
     * @return {?}
     */
    function (max) {
        if (!hasValue(max)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @return {?}
         */
        function (control) {
            // don't validate empty values to allow optional controls
            if (isEmpty(control.value) || isEmpty(max)) {
                return null;
            }
            /** @type {?} */
            var value = parseFloat(control.value);
            /** @type {?} */
            var actual = control.value;
            // Controls with NaN values after parsing should be treated as not having a
            // maximum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-max
            return isNaN(value) || value <= max ? null : { 'max': { max: max, actual: actual } };
        });
    };
    /**
     * Validator that requires control value to be true.
     */
    /**
     * Validator that requires control value to be true.
     * @param {?} control
     * @return {?}
     */
    JsonValidators.requiredTrue = /**
     * Validator that requires control value to be true.
     * @param {?} control
     * @return {?}
     */
    function (control) {
        if (!control) {
            return JsonValidators.nullValidator;
        }
        return control.value === true ? null : { 'required': true };
    };
    /**
     * Validator that performs email validation.
     */
    /**
     * Validator that performs email validation.
     * @param {?} control
     * @return {?}
     */
    JsonValidators.email = /**
     * Validator that performs email validation.
     * @param {?} control
     * @return {?}
     */
    function (control) {
        if (!control) {
            return JsonValidators.nullValidator;
        }
        /** @type {?} */
        var EMAIL_REGEXP = 
        // tslint:disable-next-line:max-line-length
        /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
        return EMAIL_REGEXP.test(control.value) ? null : { 'email': true };
    };
    return JsonValidators;
}());
/**
 * 'JsonValidators' class
 *
 * Provides an extended set of validators to be used by form controls,
 * compatible with standard JSON Schema validation options.
 * http://json-schema.org/latest/json-schema-validation.html
 *
 * Note: This library is designed as a drop-in replacement for the Angular
 * Validators library, and except for one small breaking change to the 'pattern'
 * validator (described below) it can even be imported as a substitute, like so:
 *
 *   import { JsonValidators as Validators } from 'json-validators';
 *
 * and it should work with existing code as a complete replacement.
 *
 * The one exception is the 'pattern' validator, which has been changed to
 * matche partial values by default (the standard 'pattern' validator wrapped
 * all patterns in '^' and '$', forcing them to always match an entire value).
 * However, the old behavior can be restored by simply adding '^' and '$'
 * around your patterns, or by passing an optional second parameter of TRUE.
 * This change is to make the 'pattern' validator match the behavior of a
 * JSON Schema pattern, which allows partial matches, rather than the behavior
 * of an HTML input control pattern, which does not.
 *
 * This library replaces Angular's validators and combination functions
 * with the following validators and transformation functions:
 *
 * Validators:
 *   For all formControls:     required (*), type, enum, const
 *   For text formControls:    minLength (*), maxLength (*), pattern (*), format
 *   For numeric formControls: maximum, exclusiveMaximum,
 *                             minimum, exclusiveMinimum, multipleOf
 *   For formGroup objects:    minProperties, maxProperties, dependencies
 *   For formArray arrays:     minItems, maxItems, uniqueItems, contains
 *   Not used by JSON Schema:  min (*), max (*), requiredTrue (*), email (*)
 * (Validators originally included with Angular are maked with (*).)
 *
 * NOTE / TODO: The dependencies validator is not complete.
 * NOTE / TODO: The contains validator is not complete.
 *
 * Validators not used by JSON Schema (but included for compatibility)
 * and their JSON Schema equivalents:
 *
 *   Angular validator | JSON Schema equivalent
 *   ------------------|-----------------------
 *     min(number)     |   minimum(number)
 *     max(number)     |   maximum(number)
 *     requiredTrue()  |   const(true)
 *     email()         |   format('email')
 *
 * Validator transformation functions:
 *   composeAnyOf, composeOneOf, composeAllOf, composeNot
 * (Angular's original combination funciton, 'compose', is also included for
 * backward compatibility, though it is functionally equivalent to composeAllOf,
 * asside from its more generic error message.)
 *
 * All validators have also been extended to accept an optional second argument
 * which, if passed a TRUE value, causes the validator to perform the opposite
 * of its original finction. (This is used internally to enable 'not' and
 * 'composeOneOf' to function and return useful error messages.)
 *
 * The 'required' validator has also been overloaded so that if called with
 * a boolean parameter (or no parameters) it returns the original validator
 * function (rather than executing it). However, if it is called with an
 * AbstractControl parameter (as was previously required), it behaves
 * exactly as before.
 *
 * This enables all validators (including 'required') to be constructed in
 * exactly the same way, so they can be automatically applied using the
 * equivalent key names and values taken directly from a JSON Schema.
 *
 * This source code is partially derived from Angular,
 * which is Copyright (c) 2014-2017 Google, Inc.
 * Use of this source code is therefore governed by the same MIT-style license
 * that can be found in the LICENSE file at https://angular.io/license
 *
 * Original Angular Validators:
 * https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
 */
export { JsonValidators };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi52YWxpZGF0b3JzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFqc2YvY29yZS8iLCJzb3VyY2VzIjpbImxpYi9zaGFyZWQvanNvbi52YWxpZGF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxPQUFPLE1BQU0sZ0JBQWdCLENBQUM7QUFDckMsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixrQkFBa0IsRUFDbEIsWUFBWSxFQUNaLGFBQWEsRUFFYixPQUFPLEVBQ1AsUUFBUSxFQUNSLE9BQU8sRUFDUCxTQUFTLEVBQ1QsU0FBUyxFQUNULE9BQU8sRUFDUCxRQUFRLEVBQ1IsUUFBUSxFQUNSLE1BQU0sRUFHTixnQkFBZ0IsRUFDaEIsWUFBWSxFQUNaLEdBQUcsRUFDRixNQUFNLHVCQUF1QixDQUFDO0FBRWpDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNsRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2hDLE9BQU8sRUFBeUIscUJBQXFCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RixPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUZyQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBQTtJQWd3QkEsQ0FBQzs7Ozs7SUExdEJRLHVCQUFROzs7O0lBQWYsVUFBZ0IsS0FBK0I7UUFDN0MsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQUUsS0FBSyxHQUFHLElBQUksQ0FBQztTQUFFO1FBQzFDLFFBQVEsS0FBSyxFQUFFO1lBQ2IsS0FBSyxJQUFJLEVBQUUsbURBQW1EO2dCQUM1RDs7Ozs7Z0JBQU8sVUFB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SSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLEdBQUcsS0FBQSxFQUFFLE1BQU0sUUFBQSxFQUFFLEVBQUUsQ0FBQztRQUMxRSxDQUFDLEVBQUM7SUFDSixDQUFDO0lBRUQ7O09BRUc7Ozs7OztJQUNJLDJCQUFZOzs7OztJQUFuQixVQUFvQixPQUF3QjtRQUMxQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQUUsT0FBTyxjQUFjLENBQUMsYUFBYSxDQUFDO1NBQUU7UUFDdEQsT0FBTyxPQUFPLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUM5RCxDQUFDO0lBRUQ7O09BRUc7Ozs7OztJQUNJLG9CQUFLOzs7OztJQUFaLFVBQWEsT0FBd0I7UUFDbkMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUFFLE9BQU8sY0FBYyxDQUFDLGFBQWEsQ0FBQztTQUFFOztZQUNoRCxZQUFZO1FBQ2hCLDJDQUEyQztRQUMzQyw0TEFBNEw7UUFDOUwsT0FBTyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUNyRSxDQUFDO0lBQ0gscUJBQUM7QUFBRCxDQUFDLEFBaHdCRCxJQWd3QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaXNFcXVhbCBmcm9tICdsb2Rhc2gvaXNFcXVhbCc7XG5pbXBvcnQge1xuICBfZXhlY3V0ZUFzeW5jVmFsaWRhdG9ycyxcbiAgX2V4ZWN1dGVWYWxpZGF0b3JzLFxuICBfbWVyZ2VFcnJvcnMsXG4gIF9tZXJnZU9iamVjdHMsXG4gIEFzeW5jSVZhbGlkYXRvckZuLFxuICBnZXRUeXBlLFxuICBoYXNWYWx1ZSxcbiAgaXNBcnJheSxcbiAgaXNCb29sZWFuLFxuICBpc0RlZmluZWQsXG4gIGlzRW1wdHksXG4gIGlzTnVtYmVyLFxuICBpc1N0cmluZyxcbiAgaXNUeXBlLFxuICBJVmFsaWRhdG9yRm4sXG4gIFNjaGVtYVByaW1pdGl2ZVR5cGUsXG4gIHRvSmF2YVNjcmlwdFR5cGUsXG4gIHRvT2JzZXJ2YWJsZSxcbiAgeG9yXG4gIH0gZnJvbSAnLi92YWxpZGF0b3IuZnVuY3Rpb25zJztcbmltcG9ydCB7IEFic3RyYWN0Q29udHJvbCwgVmFsaWRhdGlvbkVycm9ycywgVmFsaWRhdG9yRm4gfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBmb3JFYWNoQ29weSB9IGZyb20gJy4vdXRpbGl0eS5mdW5jdGlvbnMnO1xuaW1wb3J0IHsgZm9ya0pvaW4gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEpzb25TY2hlbWFGb3JtYXROYW1lcywganNvblNjaGVtYUZvcm1hdFRlc3RzIH0gZnJvbSAnLi9mb3JtYXQtcmVnZXguY29uc3RhbnRzJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuXG5cbi8qKlxuICogJ0pzb25WYWxpZGF0b3JzJyBjbGFzc1xuICpcbiAqIFByb3ZpZGVzIGFuIGV4dGVuZGVkIHNldCBvZiB2YWxpZGF0b3JzIHRvIGJlIHVzZWQgYnkgZm9ybSBjb250cm9scyxcbiAqIGNvbXBhdGlibGUgd2l0aCBzdGFuZGFyZCBKU09OIFNjaGVtYSB2YWxpZGF0aW9uIG9wdGlvbnMuXG4gKiBodHRwOi8vanNvbi1zY2hlbWEub3JnL2xhdGVzdC9qc29uLXNjaGVtYS12YWxpZGF0aW9uLmh0bWxcbiAqXG4gKiBOb3RlOiBUaGlzIGxpYnJhcnkgaXMgZGVzaWduZWQgYXMgYSBkcm9wLWluIHJlcGxhY2VtZW50IGZvciB0aGUgQW5ndWxhclxuICogVmFsaWRhdG9ycyBsaWJyYXJ5LCBhbmQgZXhjZXB0IGZvciBvbmUgc21hbGwgYnJlYWtpbmcgY2hhbmdlIHRvIHRoZSAncGF0dGVybidcbiAqIHZhbGlkYXRvciAoZGVzY3JpYmVkIGJlbG93KSBpdCBjYW4gZXZlbiBiZSBpbXBvcnRlZCBhcyBhIHN1YnN0aXR1dGUsIGxpa2Ugc286XG4gKlxuICogICBpbXBvcnQgeyBKc29uVmFsaWRhdG9ycyBhcyBWYWxpZGF0b3JzIH0gZnJvbSAnanNvbi12YWxpZGF0b3JzJztcbiAqXG4gKiBhbmQgaXQgc2hvdWxkIHdvcmsgd2l0aCBleGlzdGluZyBjb2RlIGFzIGEgY29tcGxldGUgcmVwbGFjZW1lbnQuXG4gKlxuICogVGhlIG9uZSBleGNlcHRpb24gaXMgdGhlICdwYXR0ZXJuJyB2YWxpZGF0b3IsIHdoaWNoIGhhcyBiZWVuIGNoYW5nZWQgdG9cbiAqIG1hdGNoZSBwYXJ0aWFsIHZhbHVlcyBieSBkZWZhdWx0ICh0aGUgc3RhbmRhcmQgJ3BhdHRlcm4nIHZhbGlkYXRvciB3cmFwcGVkXG4gKiBhbGwgcGF0dGVybnMgaW4gJ14nIGFuZCAnJCcsIGZvcmNpbmcgdGhlbSB0byBhbHdheXMgbWF0Y2ggYW4gZW50aXJlIHZhbHVlKS5cbiAqIEhvd2V2ZXIsIHRoZSBvbGQgYmVoYXZpb3IgY2FuIGJlIHJlc3RvcmVkIGJ5IHNpbXBseSBhZGRpbmcgJ14nIGFuZCAnJCdcbiAqIGFyb3VuZCB5b3VyIHBhdHRlcm5zLCBvciBieSBwYXNzaW5nIGFuIG9wdGlvbmFsIHNlY29uZCBwYXJhbWV0ZXIgb2YgVFJVRS5cbiAqIFRoaXMgY2hhbmdlIGlzIHRvIG1ha2UgdGhlICdwYXR0ZXJuJyB2YWxpZGF0b3IgbWF0Y2ggdGhlIGJlaGF2aW9yIG9mIGFcbiAqIEpTT04gU2NoZW1hIHBhdHRlcm4sIHdoaWNoIGFsbG93cyBwYXJ0aWFsIG1hdGNoZXMsIHJhdGhlciB0aGFuIHRoZSBiZWhhdmlvclxuICogb2YgYW4gSFRNTCBpbnB1dCBjb250cm9sIHBhdHRlcm4sIHdoaWNoIGRvZXMgbm90LlxuICpcbiAqIFRoaXMgbGlicmFyeSByZXBsYWNlcyBBbmd1bGFyJ3MgdmFsaWRhdG9ycyBhbmQgY29tYmluYXRpb24gZnVuY3Rpb25zXG4gKiB3aXRoIHRoZSBmb2xsb3dpbmcgdmFsaWRhdG9ycyBhbmQgdHJhbnNmb3JtYXRpb24gZnVuY3Rpb25zOlxuICpcbiAqIFZhbGlkYXRvcnM6XG4gKiAgIEZvciBhbGwgZm9ybUNvbnRyb2xzOiAgICAgcmVxdWlyZWQgKCopLCB0eXBlLCBlbnVtLCBjb25zdFxuICogICBGb3IgdGV4dCBmb3JtQ29udHJvbHM6ICAgIG1pbkxlbmd0aCAoKiksIG1heExlbmd0aCAoKiksIHBhdHRlcm4gKCopLCBmb3JtYXRcbiAqICAgRm9yIG51bWVyaWMgZm9ybUNvbnRyb2xzOiBtYXhpbXVtLCBleGNsdXNpdmVNYXhpbXVtLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW0sIGV4Y2x1c2l2ZU1pbmltdW0sIG11bHRpcGxlT2ZcbiAqICAgRm9yIGZvcm1Hcm91cCBvYmplY3RzOiAgICBtaW5Qcm9wZXJ0aWVzLCBtYXhQcm9wZXJ0aWVzLCBkZXBlbmRlbmNpZXNcbiAqICAgRm9yIGZvcm1BcnJheSBhcnJheXM6ICAgICBtaW5JdGVtcywgbWF4SXRlbXMsIHVuaXF1ZUl0ZW1zLCBjb250YWluc1xuICogICBOb3QgdXNlZCBieSBKU09OIFNjaGVtYTogIG1pbiAoKiksIG1heCAoKiksIHJlcXVpcmVkVHJ1ZSAoKiksIGVtYWlsICgqKVxuICogKFZhbGlkYXRvcnMgb3JpZ2luYWxseSBpbmNsdWRlZCB3aXRoIEFuZ3VsYXIgYXJlIG1ha2VkIHdpdGggKCopLilcbiAqXG4gKiBOT1RFIC8gVE9ETzogVGhlIGRlcGVuZGVuY2llcyB2YWxpZGF0b3IgaXMgbm90IGNvbXBsZXRlLlxuICogTk9URSAvIFRPRE86IFRoZSBjb250YWlucyB2YWxpZGF0b3IgaXMgbm90IGNvbXBsZXRlLlxuICpcbiAqIFZhbGlkYXRvcnMgbm90IHVzZWQgYnkgSlNPTiBTY2hlbWEgKGJ1dCBpbmNsdWRlZCBmb3IgY29tcGF0aWJpbGl0eSlcbiAqIGFuZCB0aGVpciBKU09OIFNjaGVtYSBlcXVpdmFsZW50czpcbiAqXG4gKiAgIEFuZ3VsYXIgdmFsaWRhdG9yIHwgSlNPTiBTY2hlbWEgZXF1aXZhbGVudFxuICogICAtLS0tLS0tLS0tLS0tLS0tLS18LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqICAgICBtaW4obnVtYmVyKSAgICAgfCAgIG1pbmltdW0obnVtYmVyKVxuICogICAgIG1heChudW1iZXIpICAgICB8ICAgbWF4aW11bShudW1iZXIpXG4gKiAgICAgcmVxdWlyZWRUcnVlKCkgIHwgICBjb25zdCh0cnVlKVxuICogICAgIGVtYWlsKCkgICAgICAgICB8ICAgZm9ybWF0KCdlbWFpbCcpXG4gKlxuICogVmFsaWRhdG9yIHRyYW5zZm9ybWF0aW9uIGZ1bmN0aW9uczpcbiAqICAgY29tcG9zZUFueU9mLCBjb21wb3NlT25lT2YsIGNvbXBvc2VBbGxPZiwgY29tcG9zZU5vdFxuICogKEFuZ3VsYXIncyBvcmlnaW5hbCBjb21iaW5hdGlvbiBmdW5jaXRvbiwgJ2NvbXBvc2UnLCBpcyBhbHNvIGluY2x1ZGVkIGZvclxuICogYmFja3dhcmQgY29tcGF0aWJpbGl0eSwgdGhvdWdoIGl0IGlzIGZ1bmN0aW9uYWxseSBlcXVpdmFsZW50IHRvIGNvbXBvc2VBbGxPZixcbiAqIGFzc2lkZSBmcm9tIGl0cyBtb3JlIGdlbmVyaWMgZXJyb3IgbWVzc2FnZS4pXG4gKlxuICogQWxsIHZhbGlkYXRvcnMgaGF2ZSBhbHNvIGJlZW4gZXh0ZW5kZWQgdG8gYWNjZXB0IGFuIG9wdGlvbmFsIHNlY29uZCBhcmd1bWVudFxuICogd2hpY2gsIGlmIHBhc3NlZCBhIFRSVUUgdmFsdWUsIGNhdXNlcyB0aGUgdmFsaWRhdG9yIHRvIHBlcmZvcm0gdGhlIG9wcG9zaXRlXG4gKiBvZiBpdHMgb3JpZ2luYWwgZmluY3Rpb24uIChUaGlzIGlzIHVzZWQgaW50ZXJuYWxseSB0byBlbmFibGUgJ25vdCcgYW5kXG4gKiAnY29tcG9zZU9uZU9mJyB0byBmdW5jdGlvbiBhbmQgcmV0dXJuIHVzZWZ1bCBlcnJvciBtZXNzYWdlcy4pXG4gKlxuICogVGhlICdyZXF1aXJlZCcgdmFsaWRhdG9yIGhhcyBhbHNvIGJlZW4gb3ZlcmxvYWRlZCBzbyB0aGF0IGlmIGNhbGxlZCB3aXRoXG4gKiBhIGJvb2xlYW4gcGFyYW1ldGVyIChvciBubyBwYXJhbWV0ZXJzKSBpdCByZXR1cm5zIHRoZSBvcmlnaW5hbCB2YWxpZGF0b3JcbiAqIGZ1bmN0aW9uIChyYXRoZXIgdGhhbiBleGVjdXRpbmcgaXQpLiBIb3dldmVyLCBpZiBpdCBpcyBjYWxsZWQgd2l0aCBhblxuICogQWJzdHJhY3RDb250cm9sIHBhcmFtZXRlciAoYXMgd2FzIHByZXZpb3VzbHkgcmVxdWlyZWQpLCBpdCBiZWhhdmVzXG4gKiBleGFjdGx5IGFzIGJlZm9yZS5cbiAqXG4gKiBUaGlzIGVuYWJsZXMgYWxsIHZhbGlkYXRvcnMgKGluY2x1ZGluZyAncmVxdWlyZWQnKSB0byBiZSBjb25zdHJ1Y3RlZCBpblxuICogZXhhY3RseSB0aGUgc2FtZSB3YXksIHNvIHRoZXkgY2FuIGJlIGF1dG9tYXRpY2FsbHkgYXBwbGllZCB1c2luZyB0aGVcbiAqIGVxdWl2YWxlbnQga2V5IG5hbWVzIGFuZCB2YWx1ZXMgdGFrZW4gZGlyZWN0bHkgZnJvbSBhIEpTT04gU2NoZW1hLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgcGFydGlhbGx5IGRlcml2ZWQgZnJvbSBBbmd1bGFyLFxuICogd2hpY2ggaXMgQ29weXJpZ2h0IChjKSAyMDE0LTIwMTcgR29vZ2xlLCBJbmMuXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyB0aGVyZWZvcmUgZ292ZXJuZWQgYnkgdGhlIHNhbWUgTUlULXN0eWxlIGxpY2Vuc2VcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqXG4gKiBPcmlnaW5hbCBBbmd1bGFyIFZhbGlkYXRvcnM6XG4gKiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2Jsb2IvbWFzdGVyL3BhY2thZ2VzL2Zvcm1zL3NyYy92YWxpZGF0b3JzLnRzXG4gKi9cbmV4cG9ydCBjbGFzcyBKc29uVmFsaWRhdG9ycyB7XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRvciBmdW5jdGlvbnM6XG4gICAqXG4gICAqIEZvciBhbGwgZm9ybUNvbnRyb2xzOiAgICAgcmVxdWlyZWQsIHR5cGUsIGVudW0sIGNvbnN0XG4gICAqIEZvciB0ZXh0IGZvcm1Db250cm9sczogICAgbWluTGVuZ3RoLCBtYXhMZW5ndGgsIHBhdHRlcm4sIGZvcm1hdFxuICAgKiBGb3IgbnVtZXJpYyBmb3JtQ29udHJvbHM6IG1heGltdW0sIGV4Y2x1c2l2ZU1heGltdW0sXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bSwgZXhjbHVzaXZlTWluaW11bSwgbXVsdGlwbGVPZlxuICAgKiBGb3IgZm9ybUdyb3VwIG9iamVjdHM6ICAgIG1pblByb3BlcnRpZXMsIG1heFByb3BlcnRpZXMsIGRlcGVuZGVuY2llc1xuICAgKiBGb3IgZm9ybUFycmF5IGFycmF5czogICAgIG1pbkl0ZW1zLCBtYXhJdGVtcywgdW5pcXVlSXRlbXMsIGNvbnRhaW5zXG4gICAqXG4gICAqIFRPRE86IGZpbmlzaCBkZXBlbmRlbmNpZXMgdmFsaWRhdG9yXG4gICAqL1xuXG4gIC8qKlxuICAgKiAncmVxdWlyZWQnIHZhbGlkYXRvclxuICAgKlxuICAgKiBUaGlzIHZhbGlkYXRvciBpcyBvdmVybG9hZGVkLCBjb21wYXJlZCB0byB0aGUgZGVmYXVsdCByZXF1aXJlZCB2YWxpZGF0b3IuXG4gICAqIElmIGNhbGxlZCB3aXRoIG5vIHBhcmFtZXRlcnMsIG9yIFRSVUUsIHRoaXMgdmFsaWRhdG9yIHJldHVybnMgdGhlXG4gICAqICdyZXF1aXJlZCcgdmFsaWRhdG9yIGZ1bmN0aW9uIChyYXRoZXIgdGhhbiBleGVjdXRpbmcgaXQpLiBUaGlzIG1hdGNoZXNcbiAgICogdGhlIGJlaGF2aW9yIG9mIGFsbCBvdGhlciB2YWxpZGF0b3JzIGluIHRoaXMgbGlicmFyeS5cbiAgICpcbiAgICogSWYgdGhpcyB2YWxpZGF0b3IgaXMgY2FsbGVkIHdpdGggYW4gQWJzdHJhY3RDb250cm9sIHBhcmFtZXRlclxuICAgKiAoYXMgd2FzIHByZXZpb3VzbHkgcmVxdWlyZWQpIGl0IGJlaGF2ZXMgdGhlIHNhbWUgYXMgQW5ndWxhcidzIGRlZmF1bHRcbiAgICogcmVxdWlyZWQgdmFsaWRhdG9yLCBhbmQgcmV0dXJucyBhbiBlcnJvciBpZiB0aGUgY29udHJvbCBpcyBlbXB0eS5cbiAgICpcbiAgICogT2xkIGJlaGF2aW9yOiAoaWYgaW5wdXQgdHlwZSA9IEFic3RyYWN0Q29udHJvbClcbiAgICogLy8ge0Fic3RyYWN0Q29udHJvbH0gY29udHJvbCAtIHJlcXVpcmVkIGNvbnRyb2xcbiAgICogLy8ge3tba2V5OiBzdHJpbmddOiBib29sZWFufX0gLSByZXR1cm5zIGVycm9yIG1lc3NhZ2UgaWYgbm8gaW5wdXRcbiAgICpcbiAgICogTmV3IGJlaGF2aW9yOiAoaWYgbm8gaW5wdXQsIG9yIGlucHV0IHR5cGUgPSBib29sZWFuKVxuICAgKiAvLyB7Ym9vbGVhbiA9IHRydWV9IHJlcXVpcmVkPyAtIHRydWUgdG8gdmFsaWRhdGUsIGZhbHNlIHRvIGRpc2FibGVcbiAgICogLy8ge0lWYWxpZGF0b3JGbn0gLSByZXR1cm5zIHRoZSAncmVxdWlyZWQnIHZhbGlkYXRvciBmdW5jdGlvbiBpdHNlbGZcbiAgICovXG4gIHN0YXRpYyByZXF1aXJlZChpbnB1dDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsO1xuICBzdGF0aWMgcmVxdWlyZWQoaW5wdXQ/OiBib29sZWFuKTogSVZhbGlkYXRvckZuO1xuXG4gIHN0YXRpYyByZXF1aXJlZChpbnB1dD86IEFic3RyYWN0Q29udHJvbHxib29sZWFuKTogVmFsaWRhdGlvbkVycm9yc3xudWxsfElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKGlucHV0ID09PSB1bmRlZmluZWQpIHsgaW5wdXQgPSB0cnVlOyB9XG4gICAgc3dpdGNoIChpbnB1dCkge1xuICAgICAgY2FzZSB0cnVlOiAvLyBSZXR1cm4gcmVxdWlyZWQgZnVuY3Rpb24gKGRvIG5vdCBleGVjdXRlIGl0IHlldClcbiAgICAgICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGludmVydCA9IGZhbHNlKTogVmFsaWRhdGlvbkVycm9yc3xudWxsID0+IHtcbiAgICAgICAgICBpZiAoaW52ZXJ0KSB7IHJldHVybiBudWxsOyB9IC8vIGlmIG5vdCByZXF1aXJlZCwgYWx3YXlzIHJldHVybiB2YWxpZFxuICAgICAgICAgIHJldHVybiBoYXNWYWx1ZShjb250cm9sLnZhbHVlKSA/IG51bGwgOiB7ICdyZXF1aXJlZCc6IHRydWUgfTtcbiAgICAgICAgfTtcbiAgICAgIGNhc2UgZmFsc2U6IC8vIERvIG5vdGhpbmcgKGlmIGZpZWxkIGlzIG5vdCByZXF1aXJlZCwgaXQgaXMgYWx3YXlzIHZhbGlkKVxuICAgICAgICByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjtcbiAgICAgIGRlZmF1bHQ6IC8vIEV4ZWN1dGUgcmVxdWlyZWQgZnVuY3Rpb25cbiAgICAgICAgcmV0dXJuIGhhc1ZhbHVlKCg8QWJzdHJhY3RDb250cm9sPmlucHV0KS52YWx1ZSkgPyBudWxsIDogeyAncmVxdWlyZWQnOiB0cnVlIH07XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICd0eXBlJyB2YWxpZGF0b3JcbiAgICpcbiAgICogUmVxdWlyZXMgYSBjb250cm9sIHRvIG9ubHkgYWNjZXB0IHZhbHVlcyBvZiBhIHNwZWNpZmllZCB0eXBlLFxuICAgKiBvciBvbmUgb2YgYW4gYXJyYXkgb2YgdHlwZXMuXG4gICAqXG4gICAqIE5vdGU6IFNjaGVtYVByaW1pdGl2ZVR5cGUgPSAnc3RyaW5nJ3wnbnVtYmVyJ3wnaW50ZWdlcid8J2Jvb2xlYW4nfCdudWxsJ1xuICAgKlxuICAgKiAvLyB7U2NoZW1hUHJpbWl0aXZlVHlwZXxTY2hlbWFQcmltaXRpdmVUeXBlW119IHR5cGUgLSB0eXBlKHMpIHRvIGFjY2VwdFxuICAgKiAvLyB7SVZhbGlkYXRvckZufVxuICAgKi9cbiAgc3RhdGljIHR5cGUocmVxdWlyZWRUeXBlOiBTY2hlbWFQcmltaXRpdmVUeXBlfFNjaGVtYVByaW1pdGl2ZVR5cGVbXSk6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFoYXNWYWx1ZShyZXF1aXJlZFR5cGUpKSB7IHJldHVybiBKc29uVmFsaWRhdG9ycy5udWxsVmFsaWRhdG9yOyB9XG4gICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGludmVydCA9IGZhbHNlKTogVmFsaWRhdGlvbkVycm9yc3xudWxsID0+IHtcbiAgICAgIGlmIChpc0VtcHR5KGNvbnRyb2wudmFsdWUpKSB7IHJldHVybiBudWxsOyB9XG4gICAgICBjb25zdCBjdXJyZW50VmFsdWU6IGFueSA9IGNvbnRyb2wudmFsdWU7XG4gICAgICBjb25zdCBpc1ZhbGlkID0gaXNBcnJheShyZXF1aXJlZFR5cGUpID9cbiAgICAgICAgKDxTY2hlbWFQcmltaXRpdmVUeXBlW10+cmVxdWlyZWRUeXBlKS5zb21lKHR5cGUgPT4gaXNUeXBlKGN1cnJlbnRWYWx1ZSwgdHlwZSkpIDpcbiAgICAgICAgaXNUeXBlKGN1cnJlbnRWYWx1ZSwgPFNjaGVtYVByaW1pdGl2ZVR5cGU+cmVxdWlyZWRUeXBlKTtcbiAgICAgIHJldHVybiB4b3IoaXNWYWxpZCwgaW52ZXJ0KSA/XG4gICAgICAgIG51bGwgOiB7ICd0eXBlJzogeyByZXF1aXJlZFR5cGUsIGN1cnJlbnRWYWx1ZSB9IH07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnZW51bScgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgY29udHJvbCB0byBoYXZlIGEgdmFsdWUgZnJvbSBhbiBlbnVtZXJhdGVkIGxpc3Qgb2YgdmFsdWVzLlxuICAgKlxuICAgKiBDb252ZXJ0cyB0eXBlcyBhcyBuZWVkZWQgdG8gYWxsb3cgc3RyaW5nIGlucHV0cyB0byBzdGlsbCBjb3JyZWN0bHlcbiAgICogbWF0Y2ggbnVtYmVyLCBib29sZWFuLCBhbmQgbnVsbCBlbnVtIHZhbHVlcy5cbiAgICpcbiAgICogLy8ge2FueVtdfSBhbGxvd2VkVmFsdWVzIC0gYXJyYXkgb2YgYWNjZXB0YWJsZSB2YWx1ZXNcbiAgICogLy8ge0lWYWxpZGF0b3JGbn1cbiAgICovXG4gIHN0YXRpYyBlbnVtKGFsbG93ZWRWYWx1ZXM6IGFueVtdKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIWlzQXJyYXkoYWxsb3dlZFZhbHVlcykpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgaWYgKGlzRW1wdHkoY29udHJvbC52YWx1ZSkpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZTogYW55ID0gY29udHJvbC52YWx1ZTtcbiAgICAgIGNvbnN0IGlzRXF1YWxWYWwgPSAoZW51bVZhbHVlLCBpbnB1dFZhbHVlKSA9PlxuICAgICAgICBlbnVtVmFsdWUgPT09IGlucHV0VmFsdWUgfHxcbiAgICAgICAgKGlzTnVtYmVyKGVudW1WYWx1ZSkgJiYgK2lucHV0VmFsdWUgPT09ICtlbnVtVmFsdWUpIHx8XG4gICAgICAgIChpc0Jvb2xlYW4oZW51bVZhbHVlLCAnc3RyaWN0JykgJiZcbiAgICAgICAgICB0b0phdmFTY3JpcHRUeXBlKGlucHV0VmFsdWUsICdib29sZWFuJykgPT09IGVudW1WYWx1ZSkgfHxcbiAgICAgICAgKGVudW1WYWx1ZSA9PT0gbnVsbCAmJiAhaGFzVmFsdWUoaW5wdXRWYWx1ZSkpIHx8XG4gICAgICAgIGlzRXF1YWwoZW51bVZhbHVlLCBpbnB1dFZhbHVlKTtcbiAgICAgIGNvbnN0IGlzVmFsaWQgPSBpc0FycmF5KGN1cnJlbnRWYWx1ZSkgP1xuICAgICAgICBjdXJyZW50VmFsdWUuZXZlcnkoaW5wdXRWYWx1ZSA9PiBhbGxvd2VkVmFsdWVzLnNvbWUoZW51bVZhbHVlID0+XG4gICAgICAgICAgaXNFcXVhbFZhbChlbnVtVmFsdWUsIGlucHV0VmFsdWUpXG4gICAgICAgICkpIDpcbiAgICAgICAgYWxsb3dlZFZhbHVlcy5zb21lKGVudW1WYWx1ZSA9PiBpc0VxdWFsVmFsKGVudW1WYWx1ZSwgY3VycmVudFZhbHVlKSk7XG4gICAgICByZXR1cm4geG9yKGlzVmFsaWQsIGludmVydCkgP1xuICAgICAgICBudWxsIDogeyAnZW51bSc6IHsgYWxsb3dlZFZhbHVlcywgY3VycmVudFZhbHVlIH0gfTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqICdjb25zdCcgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgY29udHJvbCB0byBoYXZlIGEgc3BlY2lmaWMgdmFsdWUuXG4gICAqXG4gICAqIENvbnZlcnRzIHR5cGVzIGFzIG5lZWRlZCB0byBhbGxvdyBzdHJpbmcgaW5wdXRzIHRvIHN0aWxsIGNvcnJlY3RseVxuICAgKiBtYXRjaCBudW1iZXIsIGJvb2xlYW4sIGFuZCBudWxsIHZhbHVlcy5cbiAgICpcbiAgICogVE9ETzogbW9kaWZ5IHRvIHdvcmsgd2l0aCBvYmplY3RzXG4gICAqXG4gICAqIC8vIHthbnlbXX0gcmVxdWlyZWRWYWx1ZSAtIHJlcXVpcmVkIHZhbHVlXG4gICAqIC8vIHtJVmFsaWRhdG9yRm59XG4gICAqL1xuICBzdGF0aWMgY29uc3QocmVxdWlyZWRWYWx1ZTogYW55KTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIWhhc1ZhbHVlKHJlcXVpcmVkVmFsdWUpKSB7IHJldHVybiBKc29uVmFsaWRhdG9ycy5udWxsVmFsaWRhdG9yOyB9XG4gICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGludmVydCA9IGZhbHNlKTogVmFsaWRhdGlvbkVycm9yc3xudWxsID0+IHtcbiAgICAgIGlmIChpc0VtcHR5KGNvbnRyb2wudmFsdWUpKSB7IHJldHVybiBudWxsOyB9XG4gICAgICBjb25zdCBjdXJyZW50VmFsdWU6IGFueSA9IGNvbnRyb2wudmFsdWU7XG4gICAgICBjb25zdCBpc0VxdWFsVmFsID0gKGNvbnN0VmFsdWUsIGlucHV0VmFsdWUpID0+XG4gICAgICAgIGNvbnN0VmFsdWUgPT09IGlucHV0VmFsdWUgfHxcbiAgICAgICAgaXNOdW1iZXIoY29uc3RWYWx1ZSkgJiYgK2lucHV0VmFsdWUgPT09ICtjb25zdFZhbHVlIHx8XG4gICAgICAgIGlzQm9vbGVhbihjb25zdFZhbHVlLCAnc3RyaWN0JykgJiZcbiAgICAgICAgICB0b0phdmFTY3JpcHRUeXBlKGlucHV0VmFsdWUsICdib29sZWFuJykgPT09IGNvbnN0VmFsdWUgfHxcbiAgICAgICAgY29uc3RWYWx1ZSA9PT0gbnVsbCAmJiAhaGFzVmFsdWUoaW5wdXRWYWx1ZSk7XG4gICAgICBjb25zdCBpc1ZhbGlkID0gaXNFcXVhbFZhbChyZXF1aXJlZFZhbHVlLCBjdXJyZW50VmFsdWUpO1xuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ2NvbnN0JzogeyByZXF1aXJlZFZhbHVlLCBjdXJyZW50VmFsdWUgfSB9O1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogJ21pbkxlbmd0aCcgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgY29udHJvbCdzIHRleHQgdmFsdWUgdG8gYmUgZ3JlYXRlciB0aGFuIGEgc3BlY2lmaWVkIGxlbmd0aC5cbiAgICpcbiAgICogLy8ge251bWJlcn0gbWluaW11bUxlbmd0aCAtIG1pbmltdW0gYWxsb3dlZCBzdHJpbmcgbGVuZ3RoXG4gICAqIC8vIHtib29sZWFuID0gZmFsc2V9IGludmVydCAtIGluc3RlYWQgcmV0dXJuIGVycm9yIG9iamVjdCBvbmx5IGlmIHZhbGlkXG4gICAqIC8vIHtJVmFsaWRhdG9yRm59XG4gICAqL1xuICBzdGF0aWMgbWluTGVuZ3RoKG1pbmltdW1MZW5ndGg6IG51bWJlcik6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFoYXNWYWx1ZShtaW5pbXVtTGVuZ3RoKSkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgY29uc3QgY3VycmVudExlbmd0aCA9IGlzU3RyaW5nKGNvbnRyb2wudmFsdWUpID8gY29udHJvbC52YWx1ZS5sZW5ndGggOiAwO1xuICAgICAgY29uc3QgaXNWYWxpZCA9IGN1cnJlbnRMZW5ndGggPj0gbWluaW11bUxlbmd0aDtcbiAgICAgIHJldHVybiB4b3IoaXNWYWxpZCwgaW52ZXJ0KSA/XG4gICAgICAgIG51bGwgOiB7ICdtaW5MZW5ndGgnOiB7IG1pbmltdW1MZW5ndGgsIGN1cnJlbnRMZW5ndGggfSB9O1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogJ21heExlbmd0aCcgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgY29udHJvbCdzIHRleHQgdmFsdWUgdG8gYmUgbGVzcyB0aGFuIGEgc3BlY2lmaWVkIGxlbmd0aC5cbiAgICpcbiAgICogLy8ge251bWJlcn0gbWF4aW11bUxlbmd0aCAtIG1heGltdW0gYWxsb3dlZCBzdHJpbmcgbGVuZ3RoXG4gICAqIC8vIHtib29sZWFuID0gZmFsc2V9IGludmVydCAtIGluc3RlYWQgcmV0dXJuIGVycm9yIG9iamVjdCBvbmx5IGlmIHZhbGlkXG4gICAqIC8vIHtJVmFsaWRhdG9yRm59XG4gICAqL1xuICBzdGF0aWMgbWF4TGVuZ3RoKG1heGltdW1MZW5ndGg6IG51bWJlcik6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFoYXNWYWx1ZShtYXhpbXVtTGVuZ3RoKSkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50TGVuZ3RoID0gaXNTdHJpbmcoY29udHJvbC52YWx1ZSkgPyBjb250cm9sLnZhbHVlLmxlbmd0aCA6IDA7XG4gICAgICBjb25zdCBpc1ZhbGlkID0gY3VycmVudExlbmd0aCA8PSBtYXhpbXVtTGVuZ3RoO1xuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ21heExlbmd0aCc6IHsgbWF4aW11bUxlbmd0aCwgY3VycmVudExlbmd0aCB9IH07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAncGF0dGVybicgdmFsaWRhdG9yXG4gICAqXG4gICAqIE5vdGU6IE5PVCB0aGUgc2FtZSBhcyBBbmd1bGFyJ3MgZGVmYXVsdCBwYXR0ZXJuIHZhbGlkYXRvci5cbiAgICpcbiAgICogUmVxdWlyZXMgYSBjb250cm9sJ3MgdmFsdWUgdG8gbWF0Y2ggYSBzcGVjaWZpZWQgcmVndWxhciBleHByZXNzaW9uIHBhdHRlcm4uXG4gICAqXG4gICAqIFRoaXMgdmFsaWRhdG9yIGNoYW5nZXMgdGhlIGJlaGF2aW9yIG9mIGRlZmF1bHQgcGF0dGVybiB2YWxpZGF0b3JcbiAgICogYnkgcmVwbGFjaW5nIFJlZ0V4cChgXiR7cGF0dGVybn0kYCkgd2l0aCBSZWdFeHAoYCR7cGF0dGVybn1gKSxcbiAgICogd2hpY2ggYWxsb3dzIGZvciBwYXJ0aWFsIG1hdGNoZXMuXG4gICAqXG4gICAqIFRvIHJldHVybiB0byB0aGUgZGVmYXVsdCBmdW5jaXRvbmFsaXR5LCBhbmQgbWF0Y2ggdGhlIGVudGlyZSBzdHJpbmcsXG4gICAqIHBhc3MgVFJVRSBhcyB0aGUgb3B0aW9uYWwgc2Vjb25kIHBhcmFtZXRlci5cbiAgICpcbiAgICogLy8ge3N0cmluZ30gcGF0dGVybiAtIHJlZ3VsYXIgZXhwcmVzc2lvbiBwYXR0ZXJuXG4gICAqIC8vIHtib29sZWFuID0gZmFsc2V9IHdob2xlU3RyaW5nIC0gbWF0Y2ggd2hvbGUgdmFsdWUgc3RyaW5nP1xuICAgKiAvLyB7SVZhbGlkYXRvckZufVxuICAgKi9cbiAgc3RhdGljIHBhdHRlcm4ocGF0dGVybjogc3RyaW5nfFJlZ0V4cCwgd2hvbGVTdHJpbmcgPSBmYWxzZSk6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFoYXNWYWx1ZShwYXR0ZXJuKSkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgbGV0IHJlZ2V4OiBSZWdFeHA7XG4gICAgICBsZXQgcmVxdWlyZWRQYXR0ZXJuOiBzdHJpbmc7XG4gICAgICBpZiAodHlwZW9mIHBhdHRlcm4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJlcXVpcmVkUGF0dGVybiA9ICh3aG9sZVN0cmluZykgPyBgXiR7cGF0dGVybn0kYCA6IHBhdHRlcm47XG4gICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChyZXF1aXJlZFBhdHRlcm4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVxdWlyZWRQYXR0ZXJuID0gcGF0dGVybi50b1N0cmluZygpO1xuICAgICAgICByZWdleCA9IHBhdHRlcm47XG4gICAgICB9XG4gICAgICBjb25zdCBjdXJyZW50VmFsdWU6IHN0cmluZyA9IGNvbnRyb2wudmFsdWU7XG4gICAgICBjb25zdCBpc1ZhbGlkID0gaXNTdHJpbmcoY3VycmVudFZhbHVlKSA/IHJlZ2V4LnRlc3QoY3VycmVudFZhbHVlKSA6IGZhbHNlO1xuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ3BhdHRlcm4nOiB7IHJlcXVpcmVkUGF0dGVybiwgY3VycmVudFZhbHVlIH0gfTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqICdmb3JtYXQnIHZhbGlkYXRvclxuICAgKlxuICAgKiBSZXF1aXJlcyBhIGNvbnRyb2wgdG8gaGF2ZSBhIHZhbHVlIG9mIGEgY2VydGFpbiBmb3JtYXQuXG4gICAqXG4gICAqIFRoaXMgdmFsaWRhdG9yIGN1cnJlbnRseSBjaGVja3MgdGhlIGZvbGxvd2luZyBmb3Jtc3RzOlxuICAgKiAgIGRhdGUsIHRpbWUsIGRhdGUtdGltZSwgZW1haWwsIGhvc3RuYW1lLCBpcHY0LCBpcHY2LFxuICAgKiAgIHVyaSwgdXJpLXJlZmVyZW5jZSwgdXJpLXRlbXBsYXRlLCB1cmwsIHV1aWQsIGNvbG9yLFxuICAgKiAgIGpzb24tcG9pbnRlciwgcmVsYXRpdmUtanNvbi1wb2ludGVyLCByZWdleFxuICAgKlxuICAgKiBGYXN0IGZvcm1hdCByZWd1bGFyIGV4cHJlc3Npb25zIGNvcGllZCBmcm9tIEFKVjpcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL2Vwb2JlcmV6a2luL2Fqdi9ibG9iL21hc3Rlci9saWIvY29tcGlsZS9mb3JtYXRzLmpzXG4gICAqXG4gICAqIC8vIHtKc29uU2NoZW1hRm9ybWF0TmFtZXN9IHJlcXVpcmVkRm9ybWF0IC0gZm9ybWF0IHRvIGNoZWNrXG4gICAqIC8vIHtJVmFsaWRhdG9yRm59XG4gICAqL1xuICBzdGF0aWMgZm9ybWF0KHJlcXVpcmVkRm9ybWF0OiBKc29uU2NoZW1hRm9ybWF0TmFtZXMpOiBJVmFsaWRhdG9yRm4ge1xuICAgIGlmICghaGFzVmFsdWUocmVxdWlyZWRGb3JtYXQpKSB7IHJldHVybiBKc29uVmFsaWRhdG9ycy5udWxsVmFsaWRhdG9yOyB9XG4gICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGludmVydCA9IGZhbHNlKTogVmFsaWRhdGlvbkVycm9yc3xudWxsID0+IHtcbiAgICAgIGlmIChpc0VtcHR5KGNvbnRyb2wudmFsdWUpKSB7IHJldHVybiBudWxsOyB9XG4gICAgICBsZXQgaXNWYWxpZDogYm9vbGVhbjtcbiAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZTogc3RyaW5nfERhdGUgPSBjb250cm9sLnZhbHVlO1xuICAgICAgaWYgKGlzU3RyaW5nKGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgY29uc3QgZm9ybWF0VGVzdDogRnVuY3Rpb258UmVnRXhwID0ganNvblNjaGVtYUZvcm1hdFRlc3RzW3JlcXVpcmVkRm9ybWF0XTtcbiAgICAgICAgaWYgKHR5cGVvZiBmb3JtYXRUZXN0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIGlzVmFsaWQgPSAoPFJlZ0V4cD5mb3JtYXRUZXN0KS50ZXN0KDxzdHJpbmc+Y3VycmVudFZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZm9ybWF0VGVzdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGlzVmFsaWQgPSAoPEZ1bmN0aW9uPmZvcm1hdFRlc3QpKDxzdHJpbmc+Y3VycmVudFZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGBmb3JtYXQgdmFsaWRhdG9yIGVycm9yOiBcIiR7cmVxdWlyZWRGb3JtYXR9XCIgaXMgbm90IGEgcmVjb2duaXplZCBmb3JtYXQuYCk7XG4gICAgICAgICAgaXNWYWxpZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEFsbG93IEphdmFTY3JpcHQgRGF0ZSBvYmplY3RzXG4gICAgICAgIGlzVmFsaWQgPSBbJ2RhdGUnLCAndGltZScsICdkYXRlLXRpbWUnXS5pbmNsdWRlcyhyZXF1aXJlZEZvcm1hdCkgJiZcbiAgICAgICAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoY3VycmVudFZhbHVlKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ2Zvcm1hdCc6IHsgcmVxdWlyZWRGb3JtYXQsIGN1cnJlbnRWYWx1ZSB9IH07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnbWluaW11bScgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgY29udHJvbCdzIG51bWVyaWMgdmFsdWUgdG8gYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvXG4gICAqIGEgbWluaW11bSBhbW91bnQuXG4gICAqXG4gICAqIEFueSBub24tbnVtZXJpYyB2YWx1ZSBpcyBhbHNvIHZhbGlkIChhY2NvcmRpbmcgdG8gdGhlIEhUTUwgZm9ybXMgc3BlYyxcbiAgICogYSBub24tbnVtZXJpYyB2YWx1ZSBkb2Vzbid0IGhhdmUgYSBtaW5pbXVtKS5cbiAgICogaHR0cHM6Ly93d3cudzMub3JnL1RSL2h0bWw1L2Zvcm1zLmh0bWwjYXR0ci1pbnB1dC1tYXhcbiAgICpcbiAgICogLy8ge251bWJlcn0gbWluaW11bSAtIG1pbmltdW0gYWxsb3dlZCB2YWx1ZVxuICAgKiAvLyB7SVZhbGlkYXRvckZufVxuICAgKi9cbiAgc3RhdGljIG1pbmltdW0obWluaW11bVZhbHVlOiBudW1iZXIpOiBJVmFsaWRhdG9yRm4ge1xuICAgIGlmICghaGFzVmFsdWUobWluaW11bVZhbHVlKSkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgY29uc3QgY3VycmVudFZhbHVlID0gY29udHJvbC52YWx1ZTtcbiAgICAgIGNvbnN0IGlzVmFsaWQgPSAhaXNOdW1iZXIoY3VycmVudFZhbHVlKSB8fCBjdXJyZW50VmFsdWUgPj0gbWluaW11bVZhbHVlO1xuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ21pbmltdW0nOiB7IG1pbmltdW1WYWx1ZSwgY3VycmVudFZhbHVlIH0gfTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqICdleGNsdXNpdmVNaW5pbXVtJyB2YWxpZGF0b3JcbiAgICpcbiAgICogUmVxdWlyZXMgYSBjb250cm9sJ3MgbnVtZXJpYyB2YWx1ZSB0byBiZSBsZXNzIHRoYW4gYSBtYXhpbXVtIGFtb3VudC5cbiAgICpcbiAgICogQW55IG5vbi1udW1lcmljIHZhbHVlIGlzIGFsc28gdmFsaWQgKGFjY29yZGluZyB0byB0aGUgSFRNTCBmb3JtcyBzcGVjLFxuICAgKiBhIG5vbi1udW1lcmljIHZhbHVlIGRvZXNuJ3QgaGF2ZSBhIG1heGltdW0pLlxuICAgKiBodHRwczovL3d3dy53My5vcmcvVFIvaHRtbDUvZm9ybXMuaHRtbCNhdHRyLWlucHV0LW1heFxuICAgKlxuICAgKiAvLyB7bnVtYmVyfSBleGNsdXNpdmVNaW5pbXVtVmFsdWUgLSBtYXhpbXVtIGFsbG93ZWQgdmFsdWVcbiAgICogLy8ge0lWYWxpZGF0b3JGbn1cbiAgICovXG4gIHN0YXRpYyBleGNsdXNpdmVNaW5pbXVtKGV4Y2x1c2l2ZU1pbmltdW1WYWx1ZTogbnVtYmVyKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIWhhc1ZhbHVlKGV4Y2x1c2l2ZU1pbmltdW1WYWx1ZSkpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgaWYgKGlzRW1wdHkoY29udHJvbC52YWx1ZSkpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IGNvbnRyb2wudmFsdWU7XG4gICAgICBjb25zdCBpc1ZhbGlkID0gIWlzTnVtYmVyKGN1cnJlbnRWYWx1ZSkgfHwgK2N1cnJlbnRWYWx1ZSA8IGV4Y2x1c2l2ZU1pbmltdW1WYWx1ZTtcbiAgICAgIHJldHVybiB4b3IoaXNWYWxpZCwgaW52ZXJ0KSA/XG4gICAgICAgIG51bGwgOiB7ICdleGNsdXNpdmVNaW5pbXVtJzogeyBleGNsdXNpdmVNaW5pbXVtVmFsdWUsIGN1cnJlbnRWYWx1ZSB9IH07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnbWF4aW11bScgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgY29udHJvbCdzIG51bWVyaWMgdmFsdWUgdG8gYmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvXG4gICAqIGEgbWF4aW11bSBhbW91bnQuXG4gICAqXG4gICAqIEFueSBub24tbnVtZXJpYyB2YWx1ZSBpcyBhbHNvIHZhbGlkIChhY2NvcmRpbmcgdG8gdGhlIEhUTUwgZm9ybXMgc3BlYyxcbiAgICogYSBub24tbnVtZXJpYyB2YWx1ZSBkb2Vzbid0IGhhdmUgYSBtYXhpbXVtKS5cbiAgICogaHR0cHM6Ly93d3cudzMub3JnL1RSL2h0bWw1L2Zvcm1zLmh0bWwjYXR0ci1pbnB1dC1tYXhcbiAgICpcbiAgICogLy8ge251bWJlcn0gbWF4aW11bVZhbHVlIC0gbWF4aW11bSBhbGxvd2VkIHZhbHVlXG4gICAqIC8vIHtJVmFsaWRhdG9yRm59XG4gICAqL1xuICBzdGF0aWMgbWF4aW11bShtYXhpbXVtVmFsdWU6IG51bWJlcik6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFoYXNWYWx1ZShtYXhpbXVtVmFsdWUpKSB7IHJldHVybiBKc29uVmFsaWRhdG9ycy5udWxsVmFsaWRhdG9yOyB9XG4gICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGludmVydCA9IGZhbHNlKTogVmFsaWRhdGlvbkVycm9yc3xudWxsID0+IHtcbiAgICAgIGlmIChpc0VtcHR5KGNvbnRyb2wudmFsdWUpKSB7IHJldHVybiBudWxsOyB9XG4gICAgICBjb25zdCBjdXJyZW50VmFsdWUgPSBjb250cm9sLnZhbHVlO1xuICAgICAgY29uc3QgaXNWYWxpZCA9ICFpc051bWJlcihjdXJyZW50VmFsdWUpIHx8ICtjdXJyZW50VmFsdWUgPD0gbWF4aW11bVZhbHVlO1xuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ21heGltdW0nOiB7IG1heGltdW1WYWx1ZSwgY3VycmVudFZhbHVlIH0gfTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqICdleGNsdXNpdmVNYXhpbXVtJyB2YWxpZGF0b3JcbiAgICpcbiAgICogUmVxdWlyZXMgYSBjb250cm9sJ3MgbnVtZXJpYyB2YWx1ZSB0byBiZSBsZXNzIHRoYW4gYSBtYXhpbXVtIGFtb3VudC5cbiAgICpcbiAgICogQW55IG5vbi1udW1lcmljIHZhbHVlIGlzIGFsc28gdmFsaWQgKGFjY29yZGluZyB0byB0aGUgSFRNTCBmb3JtcyBzcGVjLFxuICAgKiBhIG5vbi1udW1lcmljIHZhbHVlIGRvZXNuJ3QgaGF2ZSBhIG1heGltdW0pLlxuICAgKiBodHRwczovL3d3dy53My5vcmcvVFIvaHRtbDUvZm9ybXMuaHRtbCNhdHRyLWlucHV0LW1heFxuICAgKlxuICAgKiAvLyB7bnVtYmVyfSBleGNsdXNpdmVNYXhpbXVtVmFsdWUgLSBtYXhpbXVtIGFsbG93ZWQgdmFsdWVcbiAgICogLy8ge0lWYWxpZGF0b3JGbn1cbiAgICovXG4gIHN0YXRpYyBleGNsdXNpdmVNYXhpbXVtKGV4Y2x1c2l2ZU1heGltdW1WYWx1ZTogbnVtYmVyKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIWhhc1ZhbHVlKGV4Y2x1c2l2ZU1heGltdW1WYWx1ZSkpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgaWYgKGlzRW1wdHkoY29udHJvbC52YWx1ZSkpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IGNvbnRyb2wudmFsdWU7XG4gICAgICBjb25zdCBpc1ZhbGlkID0gIWlzTnVtYmVyKGN1cnJlbnRWYWx1ZSkgfHwgK2N1cnJlbnRWYWx1ZSA8IGV4Y2x1c2l2ZU1heGltdW1WYWx1ZTtcbiAgICAgIHJldHVybiB4b3IoaXNWYWxpZCwgaW52ZXJ0KSA/XG4gICAgICAgIG51bGwgOiB7ICdleGNsdXNpdmVNYXhpbXVtJzogeyBleGNsdXNpdmVNYXhpbXVtVmFsdWUsIGN1cnJlbnRWYWx1ZSB9IH07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnbXVsdGlwbGVPZicgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgY29udHJvbCB0byBoYXZlIGEgbnVtZXJpYyB2YWx1ZSB0aGF0IGlzIGEgbXVsdGlwbGVcbiAgICogb2YgYSBzcGVjaWZpZWQgbnVtYmVyLlxuICAgKlxuICAgKiAvLyB7bnVtYmVyfSBtdWx0aXBsZU9mVmFsdWUgLSBudW1iZXIgdmFsdWUgbXVzdCBiZSBhIG11bHRpcGxlIG9mXG4gICAqIC8vIHtJVmFsaWRhdG9yRm59XG4gICAqL1xuICBzdGF0aWMgbXVsdGlwbGVPZihtdWx0aXBsZU9mVmFsdWU6IG51bWJlcik6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFoYXNWYWx1ZShtdWx0aXBsZU9mVmFsdWUpKSB7IHJldHVybiBKc29uVmFsaWRhdG9ycy5udWxsVmFsaWRhdG9yOyB9XG4gICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGludmVydCA9IGZhbHNlKTogVmFsaWRhdGlvbkVycm9yc3xudWxsID0+IHtcbiAgICAgIGlmIChpc0VtcHR5KGNvbnRyb2wudmFsdWUpKSB7IHJldHVybiBudWxsOyB9XG4gICAgICBjb25zdCBjdXJyZW50VmFsdWUgPSBjb250cm9sLnZhbHVlO1xuICAgICAgY29uc3QgaXNWYWxpZCA9IGlzTnVtYmVyKGN1cnJlbnRWYWx1ZSkgJiZcbiAgICAgICAgY3VycmVudFZhbHVlICUgbXVsdGlwbGVPZlZhbHVlID09PSAwO1xuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ211bHRpcGxlT2YnOiB7IG11bHRpcGxlT2ZWYWx1ZSwgY3VycmVudFZhbHVlIH0gfTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqICdtaW5Qcm9wZXJ0aWVzJyB2YWxpZGF0b3JcbiAgICpcbiAgICogUmVxdWlyZXMgYSBmb3JtIGdyb3VwIHRvIGhhdmUgYSBtaW5pbXVtIG51bWJlciBvZiBwcm9wZXJ0aWVzIChpLmUuIGhhdmVcbiAgICogdmFsdWVzIGVudGVyZWQgaW4gYSBtaW5pbXVtIG51bWJlciBvZiBjb250cm9scyB3aXRoaW4gdGhlIGdyb3VwKS5cbiAgICpcbiAgICogLy8ge251bWJlcn0gbWluaW11bVByb3BlcnRpZXMgLSBtaW5pbXVtIG51bWJlciBvZiBwcm9wZXJ0aWVzIGFsbG93ZWRcbiAgICogLy8ge0lWYWxpZGF0b3JGbn1cbiAgICovXG4gIHN0YXRpYyBtaW5Qcm9wZXJ0aWVzKG1pbmltdW1Qcm9wZXJ0aWVzOiBudW1iZXIpOiBJVmFsaWRhdG9yRm4ge1xuICAgIGlmICghaGFzVmFsdWUobWluaW11bVByb3BlcnRpZXMpKSB7IHJldHVybiBKc29uVmFsaWRhdG9ycy5udWxsVmFsaWRhdG9yOyB9XG4gICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGludmVydCA9IGZhbHNlKTogVmFsaWRhdGlvbkVycm9yc3xudWxsID0+IHtcbiAgICAgIGlmIChpc0VtcHR5KGNvbnRyb2wudmFsdWUpKSB7IHJldHVybiBudWxsOyB9XG4gICAgICBjb25zdCBjdXJyZW50UHJvcGVydGllcyA9IE9iamVjdC5rZXlzKGNvbnRyb2wudmFsdWUpLmxlbmd0aCB8fCAwO1xuICAgICAgY29uc3QgaXNWYWxpZCA9IGN1cnJlbnRQcm9wZXJ0aWVzID49IG1pbmltdW1Qcm9wZXJ0aWVzO1xuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ21pblByb3BlcnRpZXMnOiB7IG1pbmltdW1Qcm9wZXJ0aWVzLCBjdXJyZW50UHJvcGVydGllcyB9IH07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnbWF4UHJvcGVydGllcycgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgZm9ybSBncm91cCB0byBoYXZlIGEgbWF4aW11bSBudW1iZXIgb2YgcHJvcGVydGllcyAoaS5lLiBoYXZlXG4gICAqIHZhbHVlcyBlbnRlcmVkIGluIGEgbWF4aW11bSBudW1iZXIgb2YgY29udHJvbHMgd2l0aGluIHRoZSBncm91cCkuXG4gICAqXG4gICAqIE5vdGU6IEhhcyBubyBlZmZlY3QgaWYgdGhlIGZvcm0gZ3JvdXAgZG9lcyBub3QgY29udGFpbiBtb3JlIHRoYW4gdGhlXG4gICAqIG1heGltdW0gbnVtYmVyIG9mIGNvbnRyb2xzLlxuICAgKlxuICAgKiAvLyB7bnVtYmVyfSBtYXhpbXVtUHJvcGVydGllcyAtIG1heGltdW0gbnVtYmVyIG9mIHByb3BlcnRpZXMgYWxsb3dlZFxuICAgKiAvLyB7SVZhbGlkYXRvckZufVxuICAgKi9cbiAgc3RhdGljIG1heFByb3BlcnRpZXMobWF4aW11bVByb3BlcnRpZXM6IG51bWJlcik6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFoYXNWYWx1ZShtYXhpbXVtUHJvcGVydGllcykpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgY29uc3QgY3VycmVudFByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhjb250cm9sLnZhbHVlKS5sZW5ndGggfHwgMDtcbiAgICAgIGNvbnN0IGlzVmFsaWQgPSBjdXJyZW50UHJvcGVydGllcyA8PSBtYXhpbXVtUHJvcGVydGllcztcbiAgICAgIHJldHVybiB4b3IoaXNWYWxpZCwgaW52ZXJ0KSA/XG4gICAgICAgIG51bGwgOiB7ICdtYXhQcm9wZXJ0aWVzJzogeyBtYXhpbXVtUHJvcGVydGllcywgY3VycmVudFByb3BlcnRpZXMgfSB9O1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogJ2RlcGVuZGVuY2llcycgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIHRoZSBjb250cm9scyBpbiBhIGZvcm0gZ3JvdXAgdG8gbWVldCBhZGRpdGlvbmFsIHZhbGlkYXRpb25cbiAgICogY3JpdGVyaWEsIGRlcGVuZGluZyBvbiB0aGUgdmFsdWVzIG9mIG90aGVyIGNvbnRyb2xzIGluIHRoZSBncm91cC5cbiAgICpcbiAgICogRXhhbXBsZXM6XG4gICAqIGh0dHBzOi8vc3BhY2V0ZWxlc2NvcGUuZ2l0aHViLmlvL3VuZGVyc3RhbmRpbmctanNvbi1zY2hlbWEvcmVmZXJlbmNlL29iamVjdC5odG1sI2RlcGVuZGVuY2llc1xuICAgKlxuICAgKiAvLyB7YW55fSBkZXBlbmRlbmNpZXMgLSByZXF1aXJlZCBkZXBlbmRlbmNpZXNcbiAgICogLy8ge0lWYWxpZGF0b3JGbn1cbiAgICovXG4gIHN0YXRpYyBkZXBlbmRlbmNpZXMoZGVwZW5kZW5jaWVzOiBhbnkpOiBJVmFsaWRhdG9yRm4ge1xuICAgIGlmIChnZXRUeXBlKGRlcGVuZGVuY2llcykgIT09ICdvYmplY3QnIHx8IGlzRW1wdHkoZGVwZW5kZW5jaWVzKSkge1xuICAgICAgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7XG4gICAgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgY29uc3QgYWxsRXJyb3JzID0gX21lcmdlT2JqZWN0cyhcbiAgICAgICAgZm9yRWFjaENvcHkoZGVwZW5kZW5jaWVzLCAodmFsdWUsIHJlcXVpcmluZ0ZpZWxkKSA9PiB7XG4gICAgICAgICAgaWYgKCFoYXNWYWx1ZShjb250cm9sLnZhbHVlW3JlcXVpcmluZ0ZpZWxkXSkpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgICAgICBsZXQgcmVxdWlyaW5nRmllbGRFcnJvcnM6IFZhbGlkYXRpb25FcnJvcnMgPSB7IH07XG4gICAgICAgICAgbGV0IHJlcXVpcmVkRmllbGRzOiBzdHJpbmdbXTtcbiAgICAgICAgICBsZXQgcHJvcGVydGllczogVmFsaWRhdGlvbkVycm9ycyA9IHsgfTtcbiAgICAgICAgICBpZiAoZ2V0VHlwZShkZXBlbmRlbmNpZXNbcmVxdWlyaW5nRmllbGRdKSA9PT0gJ2FycmF5Jykge1xuICAgICAgICAgICAgcmVxdWlyZWRGaWVsZHMgPSBkZXBlbmRlbmNpZXNbcmVxdWlyaW5nRmllbGRdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZ2V0VHlwZShkZXBlbmRlbmNpZXNbcmVxdWlyaW5nRmllbGRdKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJlcXVpcmVkRmllbGRzID0gZGVwZW5kZW5jaWVzW3JlcXVpcmluZ0ZpZWxkXVsncmVxdWlyZWQnXSB8fCBbXTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMgPSBkZXBlbmRlbmNpZXNbcmVxdWlyaW5nRmllbGRdWydwcm9wZXJ0aWVzJ10gfHwgeyB9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFZhbGlkYXRlIHByb3BlcnR5IGRlcGVuZGVuY2llc1xuICAgICAgICAgIGZvciAoY29uc3QgcmVxdWlyZWRGaWVsZCBvZiByZXF1aXJlZEZpZWxkcykge1xuICAgICAgICAgICAgaWYgKHhvcighaGFzVmFsdWUoY29udHJvbC52YWx1ZVtyZXF1aXJlZEZpZWxkXSksIGludmVydCkpIHtcbiAgICAgICAgICAgICAgcmVxdWlyaW5nRmllbGRFcnJvcnNbcmVxdWlyZWRGaWVsZF0gPSB7ICdyZXF1aXJlZCc6IHRydWUgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBWYWxpZGF0ZSBzY2hlbWEgZGVwZW5kZW5jaWVzXG4gICAgICAgICAgcmVxdWlyaW5nRmllbGRFcnJvcnMgPSBfbWVyZ2VPYmplY3RzKHJlcXVpcmluZ0ZpZWxkRXJyb3JzLFxuICAgICAgICAgICAgZm9yRWFjaENvcHkocHJvcGVydGllcywgKHJlcXVpcmVtZW50cywgcmVxdWlyZWRGaWVsZCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCByZXF1aXJlZEZpZWxkRXJyb3JzID0gX21lcmdlT2JqZWN0cyhcbiAgICAgICAgICAgICAgICBmb3JFYWNoQ29weShyZXF1aXJlbWVudHMsIChyZXF1aXJlbWVudCwgcGFyYW1ldGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICBsZXQgdmFsaWRhdG9yOiBJVmFsaWRhdG9yRm4gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgaWYgKHJlcXVpcmVtZW50ID09PSAnbWF4aW11bScgfHwgcmVxdWlyZW1lbnQgPT09ICdtaW5pbXVtJykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBleGNsdXNpdmUgPSAhIXJlcXVpcmVtZW50c1snZXhjbHVzaXZlTScgKyByZXF1aXJlbWVudC5zbGljZSgxKV07XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvciA9IEpzb25WYWxpZGF0b3JzW3JlcXVpcmVtZW50XShwYXJhbWV0ZXIsIGV4Y2x1c2l2ZSk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBKc29uVmFsaWRhdG9yc1tyZXF1aXJlbWVudF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yID0gSnNvblZhbGlkYXRvcnNbcmVxdWlyZW1lbnRdKHBhcmFtZXRlcik7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByZXR1cm4gIWlzRGVmaW5lZCh2YWxpZGF0b3IpID9cbiAgICAgICAgICAgICAgICAgICAgbnVsbCA6IHZhbGlkYXRvcihjb250cm9sLnZhbHVlW3JlcXVpcmVkRmllbGRdKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICByZXR1cm4gaXNFbXB0eShyZXF1aXJlZEZpZWxkRXJyb3JzKSA/XG4gICAgICAgICAgICAgICAgbnVsbCA6IHsgW3JlcXVpcmVkRmllbGRdOiByZXF1aXJlZEZpZWxkRXJyb3JzIH07XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIGlzRW1wdHkocmVxdWlyaW5nRmllbGRFcnJvcnMpID9cbiAgICAgICAgICAgIG51bGwgOiB7IFtyZXF1aXJpbmdGaWVsZF06IHJlcXVpcmluZ0ZpZWxkRXJyb3JzIH07XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgICAgcmV0dXJuIGlzRW1wdHkoYWxsRXJyb3JzKSA/IG51bGwgOiBhbGxFcnJvcnM7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnbWluSXRlbXMnIHZhbGlkYXRvclxuICAgKlxuICAgKiBSZXF1aXJlcyBhIGZvcm0gYXJyYXkgdG8gaGF2ZSBhIG1pbmltdW0gbnVtYmVyIG9mIHZhbHVlcy5cbiAgICpcbiAgICogLy8ge251bWJlcn0gbWluaW11bUl0ZW1zIC0gbWluaW11bSBudW1iZXIgb2YgaXRlbXMgYWxsb3dlZFxuICAgKiAvLyB7SVZhbGlkYXRvckZufVxuICAgKi9cbiAgc3RhdGljIG1pbkl0ZW1zKG1pbmltdW1JdGVtczogbnVtYmVyKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIWhhc1ZhbHVlKG1pbmltdW1JdGVtcykpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgaWYgKGlzRW1wdHkoY29udHJvbC52YWx1ZSkpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgIGNvbnN0IGN1cnJlbnRJdGVtcyA9IGlzQXJyYXkoY29udHJvbC52YWx1ZSkgPyBjb250cm9sLnZhbHVlLmxlbmd0aCA6IDA7XG4gICAgICBjb25zdCBpc1ZhbGlkID0gY3VycmVudEl0ZW1zID49IG1pbmltdW1JdGVtcztcbiAgICAgIHJldHVybiB4b3IoaXNWYWxpZCwgaW52ZXJ0KSA/XG4gICAgICAgIG51bGwgOiB7ICdtaW5JdGVtcyc6IHsgbWluaW11bUl0ZW1zLCBjdXJyZW50SXRlbXMgfSB9O1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogJ21heEl0ZW1zJyB2YWxpZGF0b3JcbiAgICpcbiAgICogUmVxdWlyZXMgYSBmb3JtIGFycmF5IHRvIGhhdmUgYSBtYXhpbXVtIG51bWJlciBvZiB2YWx1ZXMuXG4gICAqXG4gICAqIC8vIHtudW1iZXJ9IG1heGltdW1JdGVtcyAtIG1heGltdW0gbnVtYmVyIG9mIGl0ZW1zIGFsbG93ZWRcbiAgICogLy8ge0lWYWxpZGF0b3JGbn1cbiAgICovXG4gIHN0YXRpYyBtYXhJdGVtcyhtYXhpbXVtSXRlbXM6IG51bWJlcik6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFoYXNWYWx1ZShtYXhpbXVtSXRlbXMpKSB7IHJldHVybiBKc29uVmFsaWRhdG9ycy5udWxsVmFsaWRhdG9yOyB9XG4gICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGludmVydCA9IGZhbHNlKTogVmFsaWRhdGlvbkVycm9yc3xudWxsID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRJdGVtcyA9IGlzQXJyYXkoY29udHJvbC52YWx1ZSkgPyBjb250cm9sLnZhbHVlLmxlbmd0aCA6IDA7XG4gICAgICBjb25zdCBpc1ZhbGlkID0gY3VycmVudEl0ZW1zIDw9IG1heGltdW1JdGVtcztcbiAgICAgIHJldHVybiB4b3IoaXNWYWxpZCwgaW52ZXJ0KSA/XG4gICAgICAgIG51bGwgOiB7ICdtYXhJdGVtcyc6IHsgbWF4aW11bUl0ZW1zLCBjdXJyZW50SXRlbXMgfSB9O1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogJ3VuaXF1ZUl0ZW1zJyB2YWxpZGF0b3JcbiAgICpcbiAgICogUmVxdWlyZXMgdmFsdWVzIGluIGEgZm9ybSBhcnJheSB0byBiZSB1bmlxdWUuXG4gICAqXG4gICAqIC8vIHtib29sZWFuID0gdHJ1ZX0gdW5pcXVlPyAtIHRydWUgdG8gdmFsaWRhdGUsIGZhbHNlIHRvIGRpc2FibGVcbiAgICogLy8ge0lWYWxpZGF0b3JGbn1cbiAgICovXG4gIHN0YXRpYyB1bmlxdWVJdGVtcyh1bmlxdWUgPSB0cnVlKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIXVuaXF1ZSkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgY29uc3Qgc29ydGVkOiBhbnlbXSA9IGNvbnRyb2wudmFsdWUuc2xpY2UoKS5zb3J0KCk7XG4gICAgICBjb25zdCBkdXBsaWNhdGVJdGVtcyA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBzb3J0ZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHNvcnRlZFtpIC0gMV0gPT09IHNvcnRlZFtpXSAmJiBkdXBsaWNhdGVJdGVtcy5pbmNsdWRlcyhzb3J0ZWRbaV0pKSB7XG4gICAgICAgICAgZHVwbGljYXRlSXRlbXMucHVzaChzb3J0ZWRbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBpc1ZhbGlkID0gIWR1cGxpY2F0ZUl0ZW1zLmxlbmd0aDtcbiAgICAgIHJldHVybiB4b3IoaXNWYWxpZCwgaW52ZXJ0KSA/XG4gICAgICAgIG51bGwgOiB7ICd1bmlxdWVJdGVtcyc6IHsgZHVwbGljYXRlSXRlbXMgfSB9O1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogJ2NvbnRhaW5zJyB2YWxpZGF0b3JcbiAgICpcbiAgICogVE9ETzogQ29tcGxldGUgdGhpcyB2YWxpZGF0b3JcbiAgICpcbiAgICogUmVxdWlyZXMgdmFsdWVzIGluIGEgZm9ybSBhcnJheSB0byBiZSB1bmlxdWUuXG4gICAqXG4gICAqIC8vIHtib29sZWFuID0gdHJ1ZX0gdW5pcXVlPyAtIHRydWUgdG8gdmFsaWRhdGUsIGZhbHNlIHRvIGRpc2FibGVcbiAgICogLy8ge0lWYWxpZGF0b3JGbn1cbiAgICovXG4gIHN0YXRpYyBjb250YWlucyhyZXF1aXJlZEl0ZW0gPSB0cnVlKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIXJlcXVpcmVkSXRlbSkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSB8fCAhaXNBcnJheShjb250cm9sLnZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgY29uc3QgY3VycmVudEl0ZW1zID0gY29udHJvbC52YWx1ZTtcbiAgICAgIC8vIGNvbnN0IGlzVmFsaWQgPSBjdXJyZW50SXRlbXMuc29tZShpdGVtID0+XG4gICAgICAvL1xuICAgICAgLy8gKTtcbiAgICAgIGNvbnN0IGlzVmFsaWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ2NvbnRhaW5zJzogeyByZXF1aXJlZEl0ZW0sIGN1cnJlbnRJdGVtcyB9IH07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOby1vcCB2YWxpZGF0b3IuIEluY2x1ZGVkIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LlxuICAgKi9cbiAgc3RhdGljIG51bGxWYWxpZGF0b3IoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0b3IgdHJhbnNmb3JtYXRpb24gZnVuY3Rpb25zOlxuICAgKiBjb21wb3NlQW55T2YsIGNvbXBvc2VPbmVPZiwgY29tcG9zZUFsbE9mLCBjb21wb3NlTm90LFxuICAgKiBjb21wb3NlLCBjb21wb3NlQXN5bmNcbiAgICpcbiAgICogVE9ETzogQWRkIGNvbXBvc2VBbnlPZkFzeW5jLCBjb21wb3NlT25lT2ZBc3luYyxcbiAgICogICAgICAgICAgIGNvbXBvc2VBbGxPZkFzeW5jLCBjb21wb3NlTm90QXN5bmNcbiAgICovXG5cbiAgLyoqXG4gICAqICdjb21wb3NlQW55T2YnIHZhbGlkYXRvciBjb21iaW5hdGlvbiBmdW5jdGlvblxuICAgKlxuICAgKiBBY2NlcHRzIGFuIGFycmF5IG9mIHZhbGlkYXRvcnMgYW5kIHJldHVybnMgYSBzaW5nbGUgdmFsaWRhdG9yIHRoYXRcbiAgICogZXZhbHVhdGVzIHRvIHZhbGlkIGlmIGFueSBvbmUgb3IgbW9yZSBvZiB0aGUgc3VibWl0dGVkIHZhbGlkYXRvcnMgYXJlXG4gICAqIHZhbGlkLiBJZiBldmVyeSB2YWxpZGF0b3IgaXMgaW52YWxpZCwgaXQgcmV0dXJucyBjb21iaW5lZCBlcnJvcnMgZnJvbVxuICAgKiBhbGwgdmFsaWRhdG9ycy5cbiAgICpcbiAgICogLy8ge0lWYWxpZGF0b3JGbltdfSB2YWxpZGF0b3JzIC0gYXJyYXkgb2YgdmFsaWRhdG9ycyB0byBjb21iaW5lXG4gICAqIC8vIHtJVmFsaWRhdG9yRm59IC0gc2luZ2xlIGNvbWJpbmVkIHZhbGlkYXRvciBmdW5jdGlvblxuICAgKi9cbiAgc3RhdGljIGNvbXBvc2VBbnlPZih2YWxpZGF0b3JzOiBJVmFsaWRhdG9yRm5bXSk6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCF2YWxpZGF0b3JzKSB7IHJldHVybiBudWxsOyB9XG4gICAgY29uc3QgcHJlc2VudFZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzLmZpbHRlcihpc0RlZmluZWQpO1xuICAgIGlmIChwcmVzZW50VmFsaWRhdG9ycy5sZW5ndGggPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgY29uc3QgYXJyYXlPZkVycm9ycyA9XG4gICAgICAgIF9leGVjdXRlVmFsaWRhdG9ycyhjb250cm9sLCBwcmVzZW50VmFsaWRhdG9ycywgaW52ZXJ0KS5maWx0ZXIoaXNEZWZpbmVkKTtcbiAgICAgIGNvbnN0IGlzVmFsaWQgPSB2YWxpZGF0b3JzLmxlbmd0aCA+IGFycmF5T2ZFcnJvcnMubGVuZ3RoO1xuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IF9tZXJnZU9iamVjdHMoLi4uYXJyYXlPZkVycm9ycywgeyAnYW55T2YnOiAhaW52ZXJ0IH0pO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogJ2NvbXBvc2VPbmVPZicgdmFsaWRhdG9yIGNvbWJpbmF0aW9uIGZ1bmN0aW9uXG4gICAqXG4gICAqIEFjY2VwdHMgYW4gYXJyYXkgb2YgdmFsaWRhdG9ycyBhbmQgcmV0dXJucyBhIHNpbmdsZSB2YWxpZGF0b3IgdGhhdFxuICAgKiBldmFsdWF0ZXMgdG8gdmFsaWQgb25seSBpZiBleGFjdGx5IG9uZSBvZiB0aGUgc3VibWl0dGVkIHZhbGlkYXRvcnNcbiAgICogaXMgdmFsaWQuIE90aGVyd2lzZSByZXR1cm5zIGNvbWJpbmVkIGluZm9ybWF0aW9uIGZyb20gYWxsIHZhbGlkYXRvcnMsXG4gICAqIGJvdGggdmFsaWQgYW5kIGludmFsaWQuXG4gICAqXG4gICAqIC8vIHtJVmFsaWRhdG9yRm5bXX0gdmFsaWRhdG9ycyAtIGFycmF5IG9mIHZhbGlkYXRvcnMgdG8gY29tYmluZVxuICAgKiAvLyB7SVZhbGlkYXRvckZufSAtIHNpbmdsZSBjb21iaW5lZCB2YWxpZGF0b3IgZnVuY3Rpb25cbiAgICovXG4gIHN0YXRpYyBjb21wb3NlT25lT2YodmFsaWRhdG9yczogSVZhbGlkYXRvckZuW10pOiBJVmFsaWRhdG9yRm4ge1xuICAgIGlmICghdmFsaWRhdG9ycykgeyByZXR1cm4gbnVsbDsgfVxuICAgIGNvbnN0IHByZXNlbnRWYWxpZGF0b3JzID0gdmFsaWRhdG9ycy5maWx0ZXIoaXNEZWZpbmVkKTtcbiAgICBpZiAocHJlc2VudFZhbGlkYXRvcnMubGVuZ3RoID09PSAwKSB7IHJldHVybiBudWxsOyB9XG4gICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGludmVydCA9IGZhbHNlKTogVmFsaWRhdGlvbkVycm9yc3xudWxsID0+IHtcbiAgICAgIGNvbnN0IGFycmF5T2ZFcnJvcnMgPVxuICAgICAgICBfZXhlY3V0ZVZhbGlkYXRvcnMoY29udHJvbCwgcHJlc2VudFZhbGlkYXRvcnMpO1xuICAgICAgY29uc3QgdmFsaWRDb250cm9scyA9XG4gICAgICAgIHZhbGlkYXRvcnMubGVuZ3RoIC0gYXJyYXlPZkVycm9ycy5maWx0ZXIoaXNEZWZpbmVkKS5sZW5ndGg7XG4gICAgICBjb25zdCBpc1ZhbGlkID0gdmFsaWRDb250cm9scyA9PT0gMTtcbiAgICAgIGlmICh4b3IoaXNWYWxpZCwgaW52ZXJ0KSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgY29uc3QgYXJyYXlPZlZhbGlkcyA9XG4gICAgICAgIF9leGVjdXRlVmFsaWRhdG9ycyhjb250cm9sLCBwcmVzZW50VmFsaWRhdG9ycywgaW52ZXJ0KTtcbiAgICAgIHJldHVybiBfbWVyZ2VPYmplY3RzKC4uLmFycmF5T2ZFcnJvcnMsIC4uLmFycmF5T2ZWYWxpZHMsIHsgJ29uZU9mJzogIWludmVydCB9KTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqICdjb21wb3NlQWxsT2YnIHZhbGlkYXRvciBjb21iaW5hdGlvbiBmdW5jdGlvblxuICAgKlxuICAgKiBBY2NlcHRzIGFuIGFycmF5IG9mIHZhbGlkYXRvcnMgYW5kIHJldHVybnMgYSBzaW5nbGUgdmFsaWRhdG9yIHRoYXRcbiAgICogZXZhbHVhdGVzIHRvIHZhbGlkIG9ubHkgaWYgYWxsIHRoZSBzdWJtaXR0ZWQgdmFsaWRhdG9ycyBhcmUgaW5kaXZpZHVhbGx5XG4gICAqIHZhbGlkLiBPdGhlcndpc2UgaXQgcmV0dXJucyBjb21iaW5lZCBlcnJvcnMgZnJvbSBhbGwgaW52YWxpZCB2YWxpZGF0b3JzLlxuICAgKlxuICAgKiAvLyB7SVZhbGlkYXRvckZuW119IHZhbGlkYXRvcnMgLSBhcnJheSBvZiB2YWxpZGF0b3JzIHRvIGNvbWJpbmVcbiAgICogLy8ge0lWYWxpZGF0b3JGbn0gLSBzaW5nbGUgY29tYmluZWQgdmFsaWRhdG9yIGZ1bmN0aW9uXG4gICAqL1xuICBzdGF0aWMgY29tcG9zZUFsbE9mKHZhbGlkYXRvcnM6IElWYWxpZGF0b3JGbltdKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIXZhbGlkYXRvcnMpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBjb25zdCBwcmVzZW50VmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMuZmlsdGVyKGlzRGVmaW5lZCk7XG4gICAgaWYgKHByZXNlbnRWYWxpZGF0b3JzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBjb25zdCBjb21iaW5lZEVycm9ycyA9IF9tZXJnZUVycm9ycyhcbiAgICAgICAgX2V4ZWN1dGVWYWxpZGF0b3JzKGNvbnRyb2wsIHByZXNlbnRWYWxpZGF0b3JzLCBpbnZlcnQpXG4gICAgICApO1xuICAgICAgY29uc3QgaXNWYWxpZCA9IGNvbWJpbmVkRXJyb3JzID09PSBudWxsO1xuICAgICAgcmV0dXJuICh4b3IoaXNWYWxpZCwgaW52ZXJ0KSkgP1xuICAgICAgICBudWxsIDogX21lcmdlT2JqZWN0cyhjb21iaW5lZEVycm9ycywgeyAnYWxsT2YnOiAhaW52ZXJ0IH0pO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogJ2NvbXBvc2VOb3QnIHZhbGlkYXRvciBpbnZlcnNpb24gZnVuY3Rpb25cbiAgICpcbiAgICogQWNjZXB0cyBhIHNpbmdsZSB2YWxpZGF0b3IgZnVuY3Rpb24gYW5kIGludmVydHMgaXRzIHJlc3VsdC5cbiAgICogUmV0dXJucyB2YWxpZCBpZiB0aGUgc3VibWl0dGVkIHZhbGlkYXRvciBpcyBpbnZhbGlkLCBhbmRcbiAgICogcmV0dXJucyBpbnZhbGlkIGlmIHRoZSBzdWJtaXR0ZWQgdmFsaWRhdG9yIGlzIHZhbGlkLlxuICAgKiAoTm90ZTogdGhpcyBmdW5jdGlvbiBjYW4gaXRzZWxmIGJlIGludmVydGVkXG4gICAqICAgLSBlLmcuIGNvbXBvc2VOb3QoY29tcG9zZU5vdCh2YWxpZGF0b3IpKSAtXG4gICAqICAgYnV0IHRoaXMgY2FuIGJlIGNvbmZ1c2luZyBhbmQgaXMgdGhlcmVmb3JlIG5vdCByZWNvbW1lbmRlZC4pXG4gICAqXG4gICAqIC8vIHtJVmFsaWRhdG9yRm5bXX0gdmFsaWRhdG9ycyAtIHZhbGlkYXRvcihzKSB0byBpbnZlcnRcbiAgICogLy8ge0lWYWxpZGF0b3JGbn0gLSBuZXcgdmFsaWRhdG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBvcHBvc2l0ZSByZXN1bHRcbiAgICovXG4gIHN0YXRpYyBjb21wb3NlTm90KHZhbGlkYXRvcjogSVZhbGlkYXRvckZuKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIXZhbGlkYXRvcikgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgY29uc3QgZXJyb3IgPSB2YWxpZGF0b3IoY29udHJvbCwgIWludmVydCk7XG4gICAgICBjb25zdCBpc1ZhbGlkID0gZXJyb3IgPT09IG51bGw7XG4gICAgICByZXR1cm4gKHhvcihpc1ZhbGlkLCBpbnZlcnQpKSA/XG4gICAgICAgIG51bGwgOiBfbWVyZ2VPYmplY3RzKGVycm9yLCB7ICdub3QnOiAhaW52ZXJ0IH0pO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogJ2NvbXBvc2UnIHZhbGlkYXRvciBjb21iaW5hdGlvbiBmdW5jdGlvblxuICAgKlxuICAgKiAvLyB7SVZhbGlkYXRvckZuW119IHZhbGlkYXRvcnMgLSBhcnJheSBvZiB2YWxpZGF0b3JzIHRvIGNvbWJpbmVcbiAgICogLy8ge0lWYWxpZGF0b3JGbn0gLSBzaW5nbGUgY29tYmluZWQgdmFsaWRhdG9yIGZ1bmN0aW9uXG4gICAqL1xuICBzdGF0aWMgY29tcG9zZSh2YWxpZGF0b3JzOiBJVmFsaWRhdG9yRm5bXSk6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCF2YWxpZGF0b3JzKSB7IHJldHVybiBudWxsOyB9XG4gICAgY29uc3QgcHJlc2VudFZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzLmZpbHRlcihpc0RlZmluZWQpO1xuICAgIGlmIChwcmVzZW50VmFsaWRhdG9ycy5sZW5ndGggPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT5cbiAgICAgIF9tZXJnZUVycm9ycyhfZXhlY3V0ZVZhbGlkYXRvcnMoY29udHJvbCwgcHJlc2VudFZhbGlkYXRvcnMsIGludmVydCkpO1xuICB9XG5cbiAgLyoqXG4gICAqICdjb21wb3NlQXN5bmMnIGFzeW5jIHZhbGlkYXRvciBjb21iaW5hdGlvbiBmdW5jdGlvblxuICAgKlxuICAgKiAvLyB7QXN5bmNJVmFsaWRhdG9yRm5bXX0gYXN5bmMgdmFsaWRhdG9ycyAtIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvcnNcbiAgICogLy8ge0FzeW5jSVZhbGlkYXRvckZufSAtIHNpbmdsZSBjb21iaW5lZCBhc3luYyB2YWxpZGF0b3IgZnVuY3Rpb25cbiAgICovXG4gIHN0YXRpYyBjb21wb3NlQXN5bmModmFsaWRhdG9yczogQXN5bmNJVmFsaWRhdG9yRm5bXSk6IEFzeW5jSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIXZhbGlkYXRvcnMpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBjb25zdCBwcmVzZW50VmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMuZmlsdGVyKGlzRGVmaW5lZCk7XG4gICAgaWYgKHByZXNlbnRWYWxpZGF0b3JzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB7XG4gICAgICBjb25zdCBvYnNlcnZhYmxlcyA9XG4gICAgICAgIF9leGVjdXRlQXN5bmNWYWxpZGF0b3JzKGNvbnRyb2wsIHByZXNlbnRWYWxpZGF0b3JzKS5tYXAodG9PYnNlcnZhYmxlKTtcbiAgICAgIHJldHVybiBtYXAuY2FsbChmb3JrSm9pbihvYnNlcnZhYmxlcyksIF9tZXJnZUVycm9ycyk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIEFkZGl0aW9uYWwgYW5ndWxhciB2YWxpZGF0b3JzIChub3QgdXNlZCBieSBBbmd1YWxyIEpTT04gU2NoZW1hIEZvcm0pXG4gIC8vIEZyb20gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9ibG9iL21hc3Rlci9wYWNrYWdlcy9mb3Jtcy9zcmMvdmFsaWRhdG9ycy50c1xuXG4gIC8qKlxuICAgKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyBjb250cm9scyB0byBoYXZlIGEgdmFsdWUgZ3JlYXRlciB0aGFuIGEgbnVtYmVyLlxuICAgKi9cbiAgc3RhdGljIG1pbihtaW46IG51bWJlcik6IFZhbGlkYXRvckZuIHtcbiAgICBpZiAoIWhhc1ZhbHVlKG1pbikpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICAvLyBkb24ndCB2YWxpZGF0ZSBlbXB0eSB2YWx1ZXMgdG8gYWxsb3cgb3B0aW9uYWwgY29udHJvbHNcbiAgICAgIGlmIChpc0VtcHR5KGNvbnRyb2wudmFsdWUpIHx8IGlzRW1wdHkobWluKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgY29uc3QgdmFsdWUgPSBwYXJzZUZsb2F0KGNvbnRyb2wudmFsdWUpO1xuICAgICAgY29uc3QgYWN0dWFsID0gY29udHJvbC52YWx1ZTtcbiAgICAgIC8vIENvbnRyb2xzIHdpdGggTmFOIHZhbHVlcyBhZnRlciBwYXJzaW5nIHNob3VsZCBiZSB0cmVhdGVkIGFzIG5vdCBoYXZpbmcgYVxuICAgICAgLy8gbWluaW11bSwgcGVyIHRoZSBIVE1MIGZvcm1zIHNwZWM6IGh0dHBzOi8vd3d3LnczLm9yZy9UUi9odG1sNS9mb3Jtcy5odG1sI2F0dHItaW5wdXQtbWluXG4gICAgICByZXR1cm4gaXNOYU4odmFsdWUpIHx8IHZhbHVlID49IG1pbiA/IG51bGwgOiB7ICdtaW4nOiB7IG1pbiwgYWN0dWFsIH0gfTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIGNvbnRyb2xzIHRvIGhhdmUgYSB2YWx1ZSBsZXNzIHRoYW4gYSBudW1iZXIuXG4gICAqL1xuICBzdGF0aWMgbWF4KG1heDogbnVtYmVyKTogVmFsaWRhdG9yRm4ge1xuICAgIGlmICghaGFzVmFsdWUobWF4KSkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsID0+IHtcbiAgICAgIC8vIGRvbid0IHZhbGlkYXRlIGVtcHR5IHZhbHVlcyB0byBhbGxvdyBvcHRpb25hbCBjb250cm9sc1xuICAgICAgaWYgKGlzRW1wdHkoY29udHJvbC52YWx1ZSkgfHwgaXNFbXB0eShtYXgpKSB7IHJldHVybiBudWxsOyB9XG4gICAgICBjb25zdCB2YWx1ZSA9IHBhcnNlRmxvYXQoY29udHJvbC52YWx1ZSk7XG4gICAgICBjb25zdCBhY3R1YWwgPSBjb250cm9sLnZhbHVlO1xuICAgICAgLy8gQ29udHJvbHMgd2l0aCBOYU4gdmFsdWVzIGFmdGVyIHBhcnNpbmcgc2hvdWxkIGJlIHRyZWF0ZWQgYXMgbm90IGhhdmluZyBhXG4gICAgICAvLyBtYXhpbXVtLCBwZXIgdGhlIEhUTUwgZm9ybXMgc3BlYzogaHR0cHM6Ly93d3cudzMub3JnL1RSL2h0bWw1L2Zvcm1zLmh0bWwjYXR0ci1pbnB1dC1tYXhcbiAgICAgIHJldHVybiBpc05hTih2YWx1ZSkgfHwgdmFsdWUgPD0gbWF4ID8gbnVsbCA6IHsgJ21heCc6IHsgbWF4LCBhY3R1YWwgfSB9O1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgY29udHJvbCB2YWx1ZSB0byBiZSB0cnVlLlxuICAgKi9cbiAgc3RhdGljIHJlcXVpcmVkVHJ1ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICAgIGlmICghY29udHJvbCkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiBjb250cm9sLnZhbHVlID09PSB0cnVlID8gbnVsbCA6IHsgJ3JlcXVpcmVkJzogdHJ1ZSB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRvciB0aGF0IHBlcmZvcm1zIGVtYWlsIHZhbGlkYXRpb24uXG4gICAqL1xuICBzdGF0aWMgZW1haWwoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICBpZiAoIWNvbnRyb2wpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICBjb25zdCBFTUFJTF9SRUdFWFAgPVxuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgL14oPz0uezEsMjU0fSQpKD89LnsxLDY0fUApWy0hIyQlJicqKy8wLTk9P0EtWl5fYGEtent8fX5dKyhcXC5bLSEjJCUmJyorLzAtOT0/QS1aXl9gYS16e3x9fl0rKSpAW0EtWmEtejAtOV0oW0EtWmEtejAtOS1dezAsNjF9W0EtWmEtejAtOV0pPyhcXC5bQS1aYS16MC05XShbQS1aYS16MC05LV17MCw2MX1bQS1aYS16MC05XSk/KSokLztcbiAgICByZXR1cm4gRU1BSUxfUkVHRVhQLnRlc3QoY29udHJvbC52YWx1ZSkgPyBudWxsIDogeyAnZW1haWwnOiB0cnVlIH07XG4gIH1cbn1cbiJdfQ==