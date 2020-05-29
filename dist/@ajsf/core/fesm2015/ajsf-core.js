import { CommonModule } from '@angular/common';
import { FormControl, FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Injectable, ɵɵdefineInjectable, Component, ChangeDetectionStrategy, Input, ComponentFactoryResolver, ViewChild, ViewContainerRef, Inject, ɵɵinject, EventEmitter, ChangeDetectorRef, Output, Directive, ElementRef, NgZone, NgModule } from '@angular/core';
import cloneDeep from 'lodash/cloneDeep';
import isEqual$1 from 'lodash/isEqual';
import { from, Observable, forkJoin, Subject } from 'rxjs';
import Ajv from 'ajv';
import jsonDraft6 from 'ajv/lib/refs/json-schema-draft-06.json';
import { map } from 'rxjs/operators';
import filter from 'lodash/filter';
import map$1 from 'lodash/map';
import uniqueId from 'lodash/uniqueId';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * 'convertSchemaToDraft6' function
 *
 * Converts a JSON Schema from draft 1 through 4 format to draft 6 format
 *
 * Inspired by on geraintluff's JSON Schema 3 to 4 compatibility function:
 *   https://github.com/geraintluff/json-schema-compatibility
 * Also uses suggestions from AJV's JSON Schema 4 to 6 migration guide:
 *   https://github.com/epoberezkin/ajv/releases/tag/5.0.0
 * And additional details from the official JSON Schema documentation:
 *   http://json-schema.org
 *
 * //  { object } originalSchema - JSON schema (draft 1, 2, 3, 4, or 6)
 * //  { OptionObject = {} } options - options: parent schema changed?, schema draft number?
 * // { object } - JSON schema (draft 6)
 * @record
 */
function OptionObject() { }
if (false) {
    /** @type {?|undefined} */
    OptionObject.prototype.changed;
    /** @type {?|undefined} */
    OptionObject.prototype.draft;
}
/**
 * @param {?} schema
 * @param {?=} options
 * @return {?}
 */
function convertSchemaToDraft6(schema, options = {}) {
    /** @type {?} */
    let draft = options.draft || null;
    /** @type {?} */
    let changed = options.changed || false;
    if (typeof schema !== 'object') {
        return schema;
    }
    if (typeof schema.map === 'function') {
        return [...schema.map((/**
             * @param {?} subSchema
             * @return {?}
             */
            subSchema => convertSchemaToDraft6(subSchema, { changed, draft })))];
    }
    /** @type {?} */
    let newSchema = Object.assign({}, schema);
    /** @type {?} */
    const simpleTypes = ['array', 'boolean', 'integer', 'null', 'number', 'object', 'string'];
    if (typeof newSchema.$schema === 'string' &&
        /http\:\/\/json\-schema\.org\/draft\-0\d\/schema\#/.test(newSchema.$schema)) {
        draft = newSchema.$schema[30];
    }
    // Convert v1-v2 'contentEncoding' to 'media.binaryEncoding'
    // Note: This is only used in JSON hyper-schema (not regular JSON schema)
    if (newSchema.contentEncoding) {
        newSchema.media = { binaryEncoding: newSchema.contentEncoding };
        delete newSchema.contentEncoding;
        changed = true;
    }
    // Convert v1-v3 'extends' to 'allOf'
    if (typeof newSchema.extends === 'object') {
        newSchema.allOf = typeof newSchema.extends.map === 'function' ?
            newSchema.extends.map((/**
             * @param {?} subSchema
             * @return {?}
             */
            subSchema => convertSchemaToDraft6(subSchema, { changed, draft }))) :
            [convertSchemaToDraft6(newSchema.extends, { changed, draft })];
        delete newSchema.extends;
        changed = true;
    }
    // Convert v1-v3 'disallow' to 'not'
    if (newSchema.disallow) {
        if (typeof newSchema.disallow === 'string') {
            newSchema.not = { type: newSchema.disallow };
        }
        else if (typeof newSchema.disallow.map === 'function') {
            newSchema.not = {
                anyOf: newSchema.disallow
                    .map((/**
                 * @param {?} type
                 * @return {?}
                 */
                type => typeof type === 'object' ? type : { type }))
            };
        }
        delete newSchema.disallow;
        changed = true;
    }
    // Convert v3 string 'dependencies' properties to arrays
    if (typeof newSchema.dependencies === 'object' &&
        Object.keys(newSchema.dependencies)
            .some((/**
         * @param {?} key
         * @return {?}
         */
        key => typeof newSchema.dependencies[key] === 'string'))) {
        newSchema.dependencies = Object.assign({}, newSchema.dependencies);
        Object.keys(newSchema.dependencies)
            .filter((/**
         * @param {?} key
         * @return {?}
         */
        key => typeof newSchema.dependencies[key] === 'string'))
            .forEach((/**
         * @param {?} key
         * @return {?}
         */
        key => newSchema.dependencies[key] = [newSchema.dependencies[key]]));
        changed = true;
    }
    // Convert v1 'maxDecimal' to 'multipleOf'
    if (typeof newSchema.maxDecimal === 'number') {
        newSchema.multipleOf = 1 / Math.pow(10, newSchema.maxDecimal);
        delete newSchema.divisibleBy;
        changed = true;
        if (!draft || draft === 2) {
            draft = 1;
        }
    }
    // Convert v2-v3 'divisibleBy' to 'multipleOf'
    if (typeof newSchema.divisibleBy === 'number') {
        newSchema.multipleOf = newSchema.divisibleBy;
        delete newSchema.divisibleBy;
        changed = true;
    }
    // Convert v1-v2 boolean 'minimumCanEqual' to 'exclusiveMinimum'
    if (typeof newSchema.minimum === 'number' && newSchema.minimumCanEqual === false) {
        newSchema.exclusiveMinimum = newSchema.minimum;
        delete newSchema.minimum;
        changed = true;
        if (!draft) {
            draft = 2;
        }
    }
    else if (typeof newSchema.minimumCanEqual === 'boolean') {
        delete newSchema.minimumCanEqual;
        changed = true;
        if (!draft) {
            draft = 2;
        }
    }
    // Convert v3-v4 boolean 'exclusiveMinimum' to numeric
    if (typeof newSchema.minimum === 'number' && newSchema.exclusiveMinimum === true) {
        newSchema.exclusiveMinimum = newSchema.minimum;
        delete newSchema.minimum;
        changed = true;
    }
    else if (typeof newSchema.exclusiveMinimum === 'boolean') {
        delete newSchema.exclusiveMinimum;
        changed = true;
    }
    // Convert v1-v2 boolean 'maximumCanEqual' to 'exclusiveMaximum'
    if (typeof newSchema.maximum === 'number' && newSchema.maximumCanEqual === false) {
        newSchema.exclusiveMaximum = newSchema.maximum;
        delete newSchema.maximum;
        changed = true;
        if (!draft) {
            draft = 2;
        }
    }
    else if (typeof newSchema.maximumCanEqual === 'boolean') {
        delete newSchema.maximumCanEqual;
        changed = true;
        if (!draft) {
            draft = 2;
        }
    }
    // Convert v3-v4 boolean 'exclusiveMaximum' to numeric
    if (typeof newSchema.maximum === 'number' && newSchema.exclusiveMaximum === true) {
        newSchema.exclusiveMaximum = newSchema.maximum;
        delete newSchema.maximum;
        changed = true;
    }
    else if (typeof newSchema.exclusiveMaximum === 'boolean') {
        delete newSchema.exclusiveMaximum;
        changed = true;
    }
    // Search object 'properties' for 'optional', 'required', and 'requires' items,
    // and convert them into object 'required' arrays and 'dependencies' objects
    if (typeof newSchema.properties === 'object') {
        /** @type {?} */
        const properties = Object.assign({}, newSchema.properties);
        /** @type {?} */
        const requiredKeys = Array.isArray(newSchema.required) ?
            new Set(newSchema.required) : new Set();
        // Convert v1-v2 boolean 'optional' properties to 'required' array
        if (draft === 1 || draft === 2 ||
            Object.keys(properties).some((/**
             * @param {?} key
             * @return {?}
             */
            key => properties[key].optional === true))) {
            Object.keys(properties)
                .filter((/**
             * @param {?} key
             * @return {?}
             */
            key => properties[key].optional !== true))
                .forEach((/**
             * @param {?} key
             * @return {?}
             */
            key => requiredKeys.add(key)));
            changed = true;
            if (!draft) {
                draft = 2;
            }
        }
        // Convert v3 boolean 'required' properties to 'required' array
        if (Object.keys(properties).some((/**
         * @param {?} key
         * @return {?}
         */
        key => properties[key].required === true))) {
            Object.keys(properties)
                .filter((/**
             * @param {?} key
             * @return {?}
             */
            key => properties[key].required === true))
                .forEach((/**
             * @param {?} key
             * @return {?}
             */
            key => requiredKeys.add(key)));
            changed = true;
        }
        if (requiredKeys.size) {
            newSchema.required = Array.from(requiredKeys);
        }
        // Convert v1-v2 array or string 'requires' properties to 'dependencies' object
        if (Object.keys(properties).some((/**
         * @param {?} key
         * @return {?}
         */
        key => properties[key].requires))) {
            /** @type {?} */
            const dependencies = typeof newSchema.dependencies === 'object' ? Object.assign({}, newSchema.dependencies) : {};
            Object.keys(properties)
                .filter((/**
             * @param {?} key
             * @return {?}
             */
            key => properties[key].requires))
                .forEach((/**
             * @param {?} key
             * @return {?}
             */
            key => dependencies[key] =
                typeof properties[key].requires === 'string' ?
                    [properties[key].requires] : properties[key].requires));
            newSchema.dependencies = dependencies;
            changed = true;
            if (!draft) {
                draft = 2;
            }
        }
        newSchema.properties = properties;
    }
    // Revove v1-v2 boolean 'optional' key
    if (typeof newSchema.optional === 'boolean') {
        delete newSchema.optional;
        changed = true;
        if (!draft) {
            draft = 2;
        }
    }
    // Revove v1-v2 'requires' key
    if (newSchema.requires) {
        delete newSchema.requires;
    }
    // Revove v3 boolean 'required' key
    if (typeof newSchema.required === 'boolean') {
        delete newSchema.required;
    }
    // Convert id to $id
    if (typeof newSchema.id === 'string' && !newSchema.$id) {
        if (newSchema.id.slice(-1) === '#') {
            newSchema.id = newSchema.id.slice(0, -1);
        }
        newSchema.$id = newSchema.id + '-CONVERTED-TO-DRAFT-06#';
        delete newSchema.id;
        changed = true;
    }
    // Check if v1-v3 'any' or object types will be converted
    if (newSchema.type && (typeof newSchema.type.every === 'function' ?
        !newSchema.type.every((/**
         * @param {?} type
         * @return {?}
         */
        type => simpleTypes.includes(type))) :
        !simpleTypes.includes(newSchema.type))) {
        changed = true;
    }
    // If schema changed, update or remove $schema identifier
    if (typeof newSchema.$schema === 'string' &&
        /http\:\/\/json\-schema\.org\/draft\-0[1-4]\/schema\#/.test(newSchema.$schema)) {
        newSchema.$schema = 'http://json-schema.org/draft-06/schema#';
        changed = true;
    }
    else if (changed && typeof newSchema.$schema === 'string') {
        /** @type {?} */
        const addToDescription = 'Converted to draft 6 from ' + newSchema.$schema;
        if (typeof newSchema.description === 'string' && newSchema.description.length) {
            newSchema.description += '\n' + addToDescription;
        }
        else {
            newSchema.description = addToDescription;
        }
        delete newSchema.$schema;
    }
    // Convert v1-v3 'any' and object types
    if (newSchema.type && (typeof newSchema.type.every === 'function' ?
        !newSchema.type.every((/**
         * @param {?} type
         * @return {?}
         */
        type => simpleTypes.includes(type))) :
        !simpleTypes.includes(newSchema.type))) {
        if (newSchema.type.length === 1) {
            newSchema.type = newSchema.type[0];
        }
        if (typeof newSchema.type === 'string') {
            // Convert string 'any' type to array of all standard types
            if (newSchema.type === 'any') {
                newSchema.type = simpleTypes;
                // Delete non-standard string type
            }
            else {
                delete newSchema.type;
            }
        }
        else if (typeof newSchema.type === 'object') {
            if (typeof newSchema.type.every === 'function') {
                // If array of strings, only allow standard types
                if (newSchema.type.every((/**
                 * @param {?} type
                 * @return {?}
                 */
                type => typeof type === 'string'))) {
                    newSchema.type = newSchema.type.some((/**
                     * @param {?} type
                     * @return {?}
                     */
                    type => type === 'any')) ?
                        newSchema.type = simpleTypes :
                        newSchema.type.filter((/**
                         * @param {?} type
                         * @return {?}
                         */
                        type => simpleTypes.includes(type)));
                    // If type is an array with objects, convert the current schema to an 'anyOf' array
                }
                else if (newSchema.type.length > 1) {
                    /** @type {?} */
                    const arrayKeys = ['additionalItems', 'items', 'maxItems', 'minItems', 'uniqueItems', 'contains'];
                    /** @type {?} */
                    const numberKeys = ['multipleOf', 'maximum', 'exclusiveMaximum', 'minimum', 'exclusiveMinimum'];
                    /** @type {?} */
                    const objectKeys = ['maxProperties', 'minProperties', 'required', 'additionalProperties',
                        'properties', 'patternProperties', 'dependencies', 'propertyNames'];
                    /** @type {?} */
                    const stringKeys = ['maxLength', 'minLength', 'pattern', 'format'];
                    /** @type {?} */
                    const filterKeys = {
                        'array': [...numberKeys, ...objectKeys, ...stringKeys],
                        'integer': [...arrayKeys, ...objectKeys, ...stringKeys],
                        'number': [...arrayKeys, ...objectKeys, ...stringKeys],
                        'object': [...arrayKeys, ...numberKeys, ...stringKeys],
                        'string': [...arrayKeys, ...numberKeys, ...objectKeys],
                        'all': [...arrayKeys, ...numberKeys, ...objectKeys, ...stringKeys],
                    };
                    /** @type {?} */
                    const anyOf = [];
                    for (const type of newSchema.type) {
                        /** @type {?} */
                        const newType = typeof type === 'string' ? { type } : Object.assign({}, type);
                        Object.keys(newSchema)
                            .filter((/**
                         * @param {?} key
                         * @return {?}
                         */
                        key => !newType.hasOwnProperty(key) &&
                            ![...(filterKeys[newType.type] || filterKeys.all), 'type', 'default']
                                .includes(key)))
                            .forEach((/**
                         * @param {?} key
                         * @return {?}
                         */
                        key => newType[key] = newSchema[key]));
                        anyOf.push(newType);
                    }
                    newSchema = newSchema.hasOwnProperty('default') ?
                        { anyOf, default: newSchema.default } : { anyOf };
                    // If type is an object, merge it with the current schema
                }
                else {
                    /** @type {?} */
                    const typeSchema = newSchema.type;
                    delete newSchema.type;
                    Object.assign(newSchema, typeSchema);
                }
            }
        }
        else {
            delete newSchema.type;
        }
    }
    // Convert sub schemas
    Object.keys(newSchema)
        .filter((/**
     * @param {?} key
     * @return {?}
     */
    key => typeof newSchema[key] === 'object'))
        .forEach((/**
     * @param {?} key
     * @return {?}
     */
    key => {
        if (['definitions', 'dependencies', 'properties', 'patternProperties']
            .includes(key) && typeof newSchema[key].map !== 'function') {
            /** @type {?} */
            const newKey = {};
            Object.keys(newSchema[key]).forEach((/**
             * @param {?} subKey
             * @return {?}
             */
            subKey => newKey[subKey] =
                convertSchemaToDraft6(newSchema[key][subKey], { changed, draft })));
            newSchema[key] = newKey;
        }
        else if (['items', 'additionalItems', 'additionalProperties',
            'allOf', 'anyOf', 'oneOf', 'not'].includes(key)) {
            newSchema[key] = convertSchemaToDraft6(newSchema[key], { changed, draft });
        }
        else {
            newSchema[key] = cloneDeep(newSchema[key]);
        }
    }));
    return newSchema;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
function PlainObject() { }
/**
 * '_executeValidators' utility function
 *
 * Validates a control against an array of validators, and returns
 * an array of the same length containing a combination of error messages
 * (from invalid validators) and null values (from valid validators)
 *
 * //  { AbstractControl } control - control to validate
 * //  { IValidatorFn[] } validators - array of validators
 * //  { boolean } invert - invert?
 * // { PlainObject[] } - array of nulls and error message
 * @param {?} control
 * @param {?} validators
 * @param {?=} invert
 * @return {?}
 */
function _executeValidators(control, validators, invert = false) {
    return validators.map((/**
     * @param {?} validator
     * @return {?}
     */
    validator => validator(control, invert)));
}
/**
 * '_executeAsyncValidators' utility function
 *
 * Validates a control against an array of async validators, and returns
 * an array of observabe results of the same length containing a combination of
 * error messages (from invalid validators) and null values (from valid ones)
 *
 * //  { AbstractControl } control - control to validate
 * //  { AsyncIValidatorFn[] } validators - array of async validators
 * //  { boolean } invert - invert?
 * //  - array of observable nulls and error message
 * @param {?} control
 * @param {?} validators
 * @param {?=} invert
 * @return {?}
 */
function _executeAsyncValidators(control, validators, invert = false) {
    return validators.map((/**
     * @param {?} validator
     * @return {?}
     */
    validator => validator(control, invert)));
}
/**
 * '_mergeObjects' utility function
 *
 * Recursively Merges one or more objects into a single object with combined keys.
 * Automatically detects and ignores null and undefined inputs.
 * Also detects duplicated boolean 'not' keys and XORs their values.
 *
 * //  { PlainObject[] } objects - one or more objects to merge
 * // { PlainObject } - merged object
 * @param {...?} objects
 * @return {?}
 */
function _mergeObjects(...objects) {
    /** @type {?} */
    const mergedObject = {};
    for (const currentObject of objects) {
        if (isObject(currentObject)) {
            for (const key of Object.keys(currentObject)) {
                /** @type {?} */
                const currentValue = currentObject[key];
                /** @type {?} */
                const mergedValue = mergedObject[key];
                mergedObject[key] = !isDefined(mergedValue) ? currentValue :
                    key === 'not' && isBoolean(mergedValue, 'strict') &&
                        isBoolean(currentValue, 'strict') ? xor(mergedValue, currentValue) :
                        getType(mergedValue) === 'object' && getType(currentValue) === 'object' ?
                            _mergeObjects(mergedValue, currentValue) :
                            currentValue;
            }
        }
    }
    return mergedObject;
}
/**
 * '_mergeErrors' utility function
 *
 * Merges an array of objects.
 * Used for combining the validator errors returned from 'executeValidators'
 *
 * //  { PlainObject[] } arrayOfErrors - array of objects
 * // { PlainObject } - merged object, or null if no usable input objectcs
 * @param {?} arrayOfErrors
 * @return {?}
 */
function _mergeErrors(arrayOfErrors) {
    /** @type {?} */
    const mergedErrors = _mergeObjects(...arrayOfErrors);
    return isEmpty(mergedErrors) ? null : mergedErrors;
}
/**
 * 'isDefined' utility function
 *
 * Checks if a variable contains a value of any type.
 * Returns true even for otherwise 'falsey' values of 0, '', and false.
 *
 * //   value - the value to check
 * // { boolean } - false if undefined or null, otherwise true
 * @param {?} value
 * @return {?}
 */
function isDefined(value) {
    return value !== undefined && value !== null;
}
/**
 * 'hasValue' utility function
 *
 * Checks if a variable contains a value.
 * Returs false for null, undefined, or a zero-length strng, '',
 * otherwise returns true.
 * (Stricter than 'isDefined' because it also returns false for '',
 * though it stil returns true for otherwise 'falsey' values 0 and false.)
 *
 * //   value - the value to check
 * // { boolean } - false if undefined, null, or '', otherwise true
 * @param {?} value
 * @return {?}
 */
function hasValue(value) {
    return value !== undefined && value !== null && value !== '';
}
/**
 * 'isEmpty' utility function
 *
 * Similar to !hasValue, but also returns true for empty arrays and objects.
 *
 * //   value - the value to check
 * // { boolean } - false if undefined, null, or '', otherwise true
 * @param {?} value
 * @return {?}
 */
function isEmpty(value) {
    if (isArray(value)) {
        return !value.length;
    }
    if (isObject(value)) {
        return !Object.keys(value).length;
    }
    return value === undefined || value === null || value === '';
}
/**
 * 'isString' utility function
 *
 * Checks if a value is a string.
 *
 * //   value - the value to check
 * // { boolean } - true if string, false if not
 * @param {?} value
 * @return {?}
 */
function isString(value) {
    return typeof value === 'string';
}
/**
 * 'isNumber' utility function
 *
 * Checks if a value is a regular number, numeric string, or JavaScript Date.
 *
 * //   value - the value to check
 * //  { any = false } strict - if truthy, also checks JavaScript tyoe
 * // { boolean } - true if number, false if not
 * @param {?} value
 * @param {?=} strict
 * @return {?}
 */
function isNumber(value, strict = false) {
    if (strict && typeof value !== 'number') {
        return false;
    }
    return !isNaN(value) && value !== value / 0;
}
/**
 * 'isInteger' utility function
 *
 * Checks if a value is an integer.
 *
 * //   value - the value to check
 * //  { any = false } strict - if truthy, also checks JavaScript tyoe
 * // {boolean } - true if number, false if not
 * @param {?} value
 * @param {?=} strict
 * @return {?}
 */
function isInteger(value, strict = false) {
    if (strict && typeof value !== 'number') {
        return false;
    }
    return !isNaN(value) && value !== value / 0 && value % 1 === 0;
}
/**
 * 'isBoolean' utility function
 *
 * Checks if a value is a boolean.
 *
 * //   value - the value to check
 * //  { any = null } option - if 'strict', also checks JavaScript type
 *                              if TRUE or FALSE, checks only for that value
 * // { boolean } - true if boolean, false if not
 * @param {?} value
 * @param {?=} option
 * @return {?}
 */
function isBoolean(value, option = null) {
    if (option === 'strict') {
        return value === true || value === false;
    }
    if (option === true) {
        return value === true || value === 1 || value === 'true' || value === '1';
    }
    if (option === false) {
        return value === false || value === 0 || value === 'false' || value === '0';
    }
    return value === true || value === 1 || value === 'true' || value === '1' ||
        value === false || value === 0 || value === 'false' || value === '0';
}
/**
 * @param {?} item
 * @return {?}
 */
function isFunction(item) {
    return typeof item === 'function';
}
/**
 * @param {?} item
 * @return {?}
 */
function isObject(item) {
    return item !== null && typeof item === 'object';
}
/**
 * @param {?} item
 * @return {?}
 */
function isArray(item) {
    return Array.isArray(item);
}
/**
 * @param {?} item
 * @return {?}
 */
function isDate(item) {
    return !!item && Object.prototype.toString.call(item) === '[object Date]';
}
/**
 * @param {?} item
 * @return {?}
 */
function isMap(item) {
    return !!item && Object.prototype.toString.call(item) === '[object Map]';
}
/**
 * @param {?} item
 * @return {?}
 */
function isSet(item) {
    return !!item && Object.prototype.toString.call(item) === '[object Set]';
}
/**
 * @param {?} item
 * @return {?}
 */
function isSymbol(item) {
    return typeof item === 'symbol';
}
/**
 * 'getType' function
 *
 * Detects the JSON Schema Type of a value.
 * By default, detects numbers and integers even if formatted as strings.
 * (So all integers are also numbers, and any number may also be a string.)
 * However, it only detects true boolean values (to detect boolean values
 * in non-boolean formats, use isBoolean() instead).
 *
 * If passed a second optional parameter of 'strict', it will only detect
 * numbers and integers if they are formatted as JavaScript numbers.
 *
 * Examples:
 * getType('10.5') = 'number'
 * getType(10.5) = 'number'
 * getType('10') = 'integer'
 * getType(10) = 'integer'
 * getType('true') = 'string'
 * getType(true) = 'boolean'
 * getType(null) = 'null'
 * getType({ }) = 'object'
 * getType([]) = 'array'
 *
 * getType('10.5', 'strict') = 'string'
 * getType(10.5, 'strict') = 'number'
 * getType('10', 'strict') = 'string'
 * getType(10, 'strict') = 'integer'
 * getType('true', 'strict') = 'string'
 * getType(true, 'strict') = 'boolean'
 *
 * //   value - value to check
 * //  { any = false } strict - if truthy, also checks JavaScript tyoe
 * // { SchemaType }
 * @param {?} value
 * @param {?=} strict
 * @return {?}
 */
function getType(value, strict = false) {
    if (!isDefined(value)) {
        return 'null';
    }
    if (isArray(value)) {
        return 'array';
    }
    if (isObject(value)) {
        return 'object';
    }
    if (isBoolean(value, 'strict')) {
        return 'boolean';
    }
    if (isInteger(value, strict)) {
        return 'integer';
    }
    if (isNumber(value, strict)) {
        return 'number';
    }
    if (isString(value) || (!strict && isDate(value))) {
        return 'string';
    }
    return null;
}
/**
 * 'isType' function
 *
 * Checks wether an input (probably string) value contains data of
 * a specified JSON Schema type
 *
 * //  { PrimitiveValue } value - value to check
 * //  { SchemaPrimitiveType } type - type to check
 * // { boolean }
 * @param {?} value
 * @param {?} type
 * @return {?}
 */
function isType(value, type) {
    switch (type) {
        case 'string':
            return isString(value) || isDate(value);
        case 'number':
            return isNumber(value);
        case 'integer':
            return isInteger(value);
        case 'boolean':
            return isBoolean(value);
        case 'null':
            return !hasValue(value);
        default:
            console.error(`isType error: "${type}" is not a recognized type.`);
            return null;
    }
}
/**
 * 'isPrimitive' function
 *
 * Checks wether an input value is a JavaScript primitive type:
 * string, number, boolean, or null.
 *
 * //   value - value to check
 * // { boolean }
 * @param {?} value
 * @return {?}
 */
function isPrimitive(value) {
    return (isString(value) || isNumber(value) ||
        isBoolean(value, 'strict') || value === null);
}
/**
 * 'toJavaScriptType' function
 *
 * Converts an input (probably string) value to a JavaScript primitive type -
 * 'string', 'number', 'boolean', or 'null' - before storing in a JSON object.
 *
 * Does not coerce values (other than null), and only converts the types
 * of values that would otherwise be valid.
 *
 * If the optional third parameter 'strictIntegers' is TRUE, and the
 * JSON Schema type 'integer' is specified, it also verifies the input value
 * is an integer and, if it is, returns it as a JaveScript number.
 * If 'strictIntegers' is FALSE (or not set) the type 'integer' is treated
 * exactly the same as 'number', and allows decimals.
 *
 * Valid Examples:
 * toJavaScriptType('10',   'number' ) = 10   // '10'   is a number
 * toJavaScriptType('10',   'integer') = 10   // '10'   is also an integer
 * toJavaScriptType( 10,    'integer') = 10   //  10    is still an integer
 * toJavaScriptType( 10,    'string' ) = '10' //  10    can be made into a string
 * toJavaScriptType('10.5', 'number' ) = 10.5 // '10.5' is a number
 *
 * Invalid Examples:
 * toJavaScriptType('10.5', 'integer') = null // '10.5' is not an integer
 * toJavaScriptType( 10.5,  'integer') = null //  10.5  is still not an integer
 *
 * //  { PrimitiveValue } value - value to convert
 * //  { SchemaPrimitiveType | SchemaPrimitiveType[] } types - types to convert to
 * //  { boolean = false } strictIntegers - if FALSE, treat integers as numbers
 * // { PrimitiveValue }
 * @param {?} value
 * @param {?} types
 * @param {?=} strictIntegers
 * @return {?}
 */
function toJavaScriptType(value, types, strictIntegers = true) {
    if (!isDefined(value)) {
        return null;
    }
    if (isString(types)) {
        types = [types];
    }
    if (strictIntegers && inArray('integer', types)) {
        if (isInteger(value, 'strict')) {
            return value;
        }
        if (isInteger(value)) {
            return parseInt(value, 10);
        }
    }
    if (inArray('number', types) || (!strictIntegers && inArray('integer', types))) {
        if (isNumber(value, 'strict')) {
            return value;
        }
        if (isNumber(value)) {
            return parseFloat(value);
        }
    }
    if (inArray('string', types)) {
        if (isString(value)) {
            return value;
        }
        // If value is a date, and types includes 'string',
        // convert the date to a string
        if (isDate(value)) {
            return value.toISOString().slice(0, 10);
        }
        if (isNumber(value)) {
            return value.toString();
        }
    }
    // If value is a date, and types includes 'integer' or 'number',
    // but not 'string', convert the date to a number
    if (isDate(value) && (inArray('integer', types) || inArray('number', types))) {
        return value.getTime();
    }
    if (inArray('boolean', types)) {
        if (isBoolean(value, true)) {
            return true;
        }
        if (isBoolean(value, false)) {
            return false;
        }
    }
    return null;
}
/**
 * 'toSchemaType' function
 *
 * Converts an input (probably string) value to the "best" JavaScript
 * equivalent available from an allowed list of JSON Schema types, which may
 * contain 'string', 'number', 'integer', 'boolean', and/or 'null'.
 * If necssary, it does progressively agressive type coersion.
 * It will not return null unless null is in the list of allowed types.
 *
 * Number conversion examples:
 * toSchemaType('10', ['number','integer','string']) = 10 // integer
 * toSchemaType('10', ['number','string']) = 10 // number
 * toSchemaType('10', ['string']) = '10' // string
 * toSchemaType('10.5', ['number','integer','string']) = 10.5 // number
 * toSchemaType('10.5', ['integer','string']) = '10.5' // string
 * toSchemaType('10.5', ['integer']) = 10 // integer
 * toSchemaType(10.5, ['null','boolean','string']) = '10.5' // string
 * toSchemaType(10.5, ['null','boolean']) = true // boolean
 *
 * String conversion examples:
 * toSchemaType('1.5x', ['boolean','number','integer','string']) = '1.5x' // string
 * toSchemaType('1.5x', ['boolean','number','integer']) = '1.5' // number
 * toSchemaType('1.5x', ['boolean','integer']) = '1' // integer
 * toSchemaType('1.5x', ['boolean']) = true // boolean
 * toSchemaType('xyz', ['number','integer','boolean','null']) = true // boolean
 * toSchemaType('xyz', ['number','integer','null']) = null // null
 * toSchemaType('xyz', ['number','integer']) = 0 // number
 *
 * Boolean conversion examples:
 * toSchemaType('1', ['integer','number','string','boolean']) = 1 // integer
 * toSchemaType('1', ['number','string','boolean']) = 1 // number
 * toSchemaType('1', ['string','boolean']) = '1' // string
 * toSchemaType('1', ['boolean']) = true // boolean
 * toSchemaType('true', ['number','string','boolean']) = 'true' // string
 * toSchemaType('true', ['boolean']) = true // boolean
 * toSchemaType('true', ['number']) = 0 // number
 * toSchemaType(true, ['number','string','boolean']) = true // boolean
 * toSchemaType(true, ['number','string']) = 'true' // string
 * toSchemaType(true, ['number']) = 1 // number
 *
 * //  { PrimitiveValue } value - value to convert
 * //  { SchemaPrimitiveType | SchemaPrimitiveType[] } types - allowed types to convert to
 * // { PrimitiveValue }
 * @param {?} value
 * @param {?} types
 * @return {?}
 */
function toSchemaType(value, types) {
    if (!isArray((/** @type {?} */ (types)))) {
        types = (/** @type {?} */ ([types]));
    }
    if (((/** @type {?} */ (types))).includes('null') && !hasValue(value)) {
        return null;
    }
    if (((/** @type {?} */ (types))).includes('boolean') && !isBoolean(value, 'strict')) {
        return value;
    }
    if (((/** @type {?} */ (types))).includes('integer')) {
        /** @type {?} */
        const testValue = toJavaScriptType(value, 'integer');
        if (testValue !== null) {
            return +testValue;
        }
    }
    if (((/** @type {?} */ (types))).includes('number')) {
        /** @type {?} */
        const testValue = toJavaScriptType(value, 'number');
        if (testValue !== null) {
            return +testValue;
        }
    }
    if ((isString(value) || isNumber(value, 'strict')) &&
        ((/** @type {?} */ (types))).includes('string')) { // Convert number to string
        return toJavaScriptType(value, 'string');
    }
    if (((/** @type {?} */ (types))).includes('boolean') && isBoolean(value)) {
        return toJavaScriptType(value, 'boolean');
    }
    if (((/** @type {?} */ (types))).includes('string')) { // Convert null & boolean to string
        if (value === null) {
            return '';
        }
        /** @type {?} */
        const testValue = toJavaScriptType(value, 'string');
        if (testValue !== null) {
            return testValue;
        }
    }
    if ((((/** @type {?} */ (types))).includes('number') ||
        ((/** @type {?} */ (types))).includes('integer'))) {
        if (value === true) {
            return 1;
        } // Convert boolean & null to number
        if (value === false || value === null || value === '') {
            return 0;
        }
    }
    if (((/** @type {?} */ (types))).includes('number')) { // Convert mixed string to number
        // Convert mixed string to number
        /** @type {?} */
        const testValue = parseFloat((/** @type {?} */ (value)));
        if (!!testValue) {
            return testValue;
        }
    }
    if (((/** @type {?} */ (types))).includes('integer')) { // Convert string or number to integer
        // Convert string or number to integer
        /** @type {?} */
        const testValue = parseInt((/** @type {?} */ (value)), 10);
        if (!!testValue) {
            return testValue;
        }
    }
    if (((/** @type {?} */ (types))).includes('boolean')) { // Convert anything to boolean
        return !!value;
    }
    if ((((/** @type {?} */ (types))).includes('number') ||
        ((/** @type {?} */ (types))).includes('integer')) && !((/** @type {?} */ (types))).includes('null')) {
        return 0; // If null not allowed, return 0 for non-convertable values
    }
}
/**
 * 'isPromise' function
 *
 * //   object
 * // { boolean }
 * @param {?} object
 * @return {?}
 */
function isPromise(object) {
    return !!object && typeof object.then === 'function';
}
/**
 * 'isObservable' function
 *
 * //   object
 * // { boolean }
 * @param {?} object
 * @return {?}
 */
function isObservable(object) {
    return !!object && typeof object.subscribe === 'function';
}
/**
 * '_toPromise' function
 *
 * //  { object } object
 * // { Promise<any> }
 * @param {?} object
 * @return {?}
 */
function _toPromise(object) {
    return isPromise(object) ? object : object.toPromise();
}
/**
 * 'toObservable' function
 *
 * //  { object } object
 * // { Observable<any> }
 * @param {?} object
 * @return {?}
 */
function toObservable(object) {
    /** @type {?} */
    const observable = isPromise(object) ? from(object) : object;
    if (isObservable(observable)) {
        return observable;
    }
    console.error('toObservable error: Expected validator to return Promise or Observable.');
    return new Observable();
}
/**
 * 'inArray' function
 *
 * Searches an array for an item, or one of a list of items, and returns true
 * as soon as a match is found, or false if no match.
 *
 * If the optional third parameter allIn is set to TRUE, and the item to find
 * is an array, then the function returns true only if all elements from item
 * are found in the array list, and false if any element is not found. If the
 * item to find is not an array, setting allIn to TRUE has no effect.
 *
 * //  { any|any[] } item - the item to search for
 * //   array - the array to search
 * //  { boolean = false } allIn - if TRUE, all items must be in array
 * // { boolean } - true if item(s) in array, false otherwise
 * @param {?} item
 * @param {?} array
 * @param {?=} allIn
 * @return {?}
 */
function inArray(item, array, allIn = false) {
    if (!isDefined(item) || !isArray(array)) {
        return false;
    }
    return isArray(item) ?
        item[allIn ? 'every' : 'some']((/**
         * @param {?} subItem
         * @return {?}
         */
        subItem => array.includes(subItem))) :
        array.includes(item);
}
/**
 * 'xor' utility function - exclusive or
 *
 * Returns true if exactly one of two values is truthy.
 *
 * //   value1 - first value to check
 * //   value2 - second value to check
 * // { boolean } - true if exactly one input value is truthy, false if not
 * @param {?} value1
 * @param {?} value2
 * @return {?}
 */
function xor(value1, value2) {
    return (!!value1 && !value2) || (!value1 && !!value2);
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
function addClasses(oldClasses, newClasses) {
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
function copy(object, errors = false) {
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
function forEach(object, fn, recurse = false, rootObject = object, errors = false) {
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
function forEachCopy(object, fn, errors = false) {
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
function hasOwn(object, property) {
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
function getExpressionType(expressionCandidate) {
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
function isEqual(expressionType) {
    return (/** @type {?} */ (expressionType)) === ExpressionType.EQUALS;
}
/**
 * @param {?} expressionType
 * @return {?}
 */
function isNotEqual(expressionType) {
    return (/** @type {?} */ (expressionType)) === ExpressionType.NOT_EQUALS;
}
/**
 * @param {?} expressionType
 * @return {?}
 */
function isNotExpression(expressionType) {
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
function getKeyAndValueByExpressionType(expressionType, key) {
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
function cleanValueOfQuotes(keyAndValue) {
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
function mergeFilteredObject(targetObject, sourceObject, excludeKeys = (/** @type {?} */ ([])), keyFn = (/**
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
function uniqueItems(...items) {
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
function commonItems(...arrays) {
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
function fixTitle(name) {
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
function toTitleCase(input, forceWords) {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Framework {
    constructor() {
        this.widgets = {};
        this.stylesheets = [];
        this.scripts = [];
    }
}
Framework.decorators = [
    { type: Injectable }
];
if (false) {
    /** @type {?} */
    Framework.prototype.name;
    /** @type {?} */
    Framework.prototype.framework;
    /** @type {?} */
    Framework.prototype.widgets;
    /** @type {?} */
    Framework.prototype.stylesheets;
    /** @type {?} */
    Framework.prototype.scripts;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class JsonPointer {
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
    static get(object, pointer, startSlice = 0, endSlice = null, getBoolean = false, errors = false) {
        if (object === null) {
            return getBoolean ? false : undefined;
        }
        /** @type {?} */
        let keyArray = this.parse(pointer, errors);
        if (typeof object === 'object' && keyArray !== null) {
            /** @type {?} */
            let subObject = object;
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
            for (let key of keyArray) {
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
                    const evaluatedExpression = JsonPointer.evaluateExpression(subObject, key);
                    if (evaluatedExpression.passed) {
                        subObject = evaluatedExpression.key ? subObject[evaluatedExpression.key] : subObject;
                    }
                    else {
                        this.logErrors(errors, key, pointer, object);
                        return getBoolean ? false : undefined;
                    }
                }
            }
            return getBoolean ? true : subObject;
        }
        if (errors && keyArray === null) {
            console.error(`get error: Invalid JSON Pointer: ${pointer}`);
        }
        if (errors && typeof object !== 'object') {
            console.error('get error: Invalid object:');
            console.error(object);
        }
        return getBoolean ? false : undefined;
    }
    /**
     * @private
     * @param {?} errors
     * @param {?} key
     * @param {?} pointer
     * @param {?} object
     * @return {?}
     */
    static logErrors(errors, key, pointer, object) {
        if (errors) {
            console.error(`get error: "${key}" key not found in object.`);
            console.error(pointer);
            console.error(object);
        }
    }
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
    static evaluateExpression(subObject, key) {
        /** @type {?} */
        const defaultResult = { passed: false, key: key };
        /** @type {?} */
        const keysAndExpression = this.parseKeysAndExpression(key, subObject);
        if (!keysAndExpression) {
            return defaultResult;
        }
        /** @type {?} */
        const ownCheckResult = this.doOwnCheckResult(subObject, keysAndExpression);
        if (ownCheckResult) {
            return ownCheckResult;
        }
        /** @type {?} */
        const cleanedValue = cleanValueOfQuotes(keysAndExpression.keyAndValue[1]);
        /** @type {?} */
        const evaluatedResult = this.performExpressionOnValue(keysAndExpression, cleanedValue, subObject);
        if (evaluatedResult) {
            return evaluatedResult;
        }
        return defaultResult;
    }
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
    static performExpressionOnValue(keysAndExpression, cleanedValue, subObject) {
        /** @type {?} */
        const propertyByKey = subObject[keysAndExpression.keyAndValue[0]];
        if (this.doComparisonByExpressionType(keysAndExpression.expressionType, propertyByKey, cleanedValue)) {
            return { passed: true, key: keysAndExpression.keyAndValue[0] };
        }
        return null;
    }
    /**
     * @private
     * @param {?} expressionType
     * @param {?} propertyByKey
     * @param {?} cleanedValue
     * @return {?}
     */
    static doComparisonByExpressionType(expressionType, propertyByKey, cleanedValue) {
        if (isEqual(expressionType)) {
            return propertyByKey === cleanedValue;
        }
        if (isNotEqual(expressionType)) {
            return propertyByKey !== cleanedValue;
        }
        return false;
    }
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
    static doOwnCheckResult(subObject, keysAndExpression) {
        /** @type {?} */
        let ownCheckResult = null;
        if (!hasOwn(subObject, keysAndExpression.keyAndValue[0])) {
            if (isEqual(keysAndExpression.expressionType)) {
                ownCheckResult = { passed: false, key: null };
            }
            if (isNotEqual(keysAndExpression.expressionType)) {
                ownCheckResult = { passed: true, key: null };
            }
        }
        return ownCheckResult;
    }
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
    static parseKeysAndExpression(key, subObject) {
        if (this.keyOrSubObjEmpty(key, subObject)) {
            return null;
        }
        /** @type {?} */
        const expressionType = getExpressionType(key.toString());
        if (isNotExpression(expressionType)) {
            return null;
        }
        /** @type {?} */
        const keyAndValue = getKeyAndValueByExpressionType(expressionType, key);
        if (!keyAndValue || !keyAndValue[0] || !keyAndValue[1]) {
            return null;
        }
        return { expressionType: expressionType, keyAndValue: keyAndValue };
    }
    /**
     * @private
     * @param {?} key
     * @param {?} subObject
     * @return {?}
     */
    static keyOrSubObjEmpty(key, subObject) {
        return !key || !subObject;
    }
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
    static getCopy(object, pointer, startSlice = 0, endSlice = null, getBoolean = false, errors = false) {
        /** @type {?} */
        const objectToCopy = this.get(object, pointer, startSlice, endSlice, getBoolean, errors);
        return this.forEachDeepCopy(objectToCopy);
    }
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
    static getFirst(items, defaultValue = null, getCopy = false) {
        if (isEmpty(items)) {
            return;
        }
        if (isArray(items)) {
            for (const item of items) {
                if (isEmpty(item)) {
                    continue;
                }
                if (isArray(item) && item.length >= 2) {
                    if (isEmpty(item[0]) || isEmpty(item[1])) {
                        continue;
                    }
                    /** @type {?} */
                    const value = getCopy ?
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
            return defaultValue;
        }
        if (isMap(items)) {
            for (const [object, pointer] of items) {
                if (object === null || !this.isJsonPointer(pointer)) {
                    continue;
                }
                /** @type {?} */
                const value = getCopy ?
                    this.getCopy(object, pointer) :
                    this.get(object, pointer);
                if (value) {
                    return value;
                }
            }
            return defaultValue;
        }
        console.error('getFirst error: Input not in correct format.\n' +
            'Should be: [ [ object1, pointer1 ], [ object 2, pointer2 ], etc... ]');
        return defaultValue;
    }
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
    static getFirstCopy(items, defaultValue = null) {
        /** @type {?} */
        const firstCopy = this.getFirst(items, defaultValue, true);
        return firstCopy;
    }
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
    static set(object, pointer, value, insert = false) {
        /** @type {?} */
        const keyArray = this.parse(pointer);
        if (keyArray !== null && keyArray.length) {
            /** @type {?} */
            let subObject = object;
            for (let i = 0; i < keyArray.length - 1; ++i) {
                /** @type {?} */
                let key = keyArray[i];
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
            const lastKey = keyArray[keyArray.length - 1];
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
        console.error(`set error: Invalid JSON Pointer: ${pointer}`);
        return object;
    }
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
    static setCopy(object, pointer, value, insert = false) {
        /** @type {?} */
        const keyArray = this.parse(pointer);
        if (keyArray !== null) {
            /** @type {?} */
            const newObject = copy(object);
            /** @type {?} */
            let subObject = newObject;
            for (let i = 0; i < keyArray.length - 1; ++i) {
                /** @type {?} */
                let key = keyArray[i];
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
            const lastKey = keyArray[keyArray.length - 1];
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
        console.error(`setCopy error: Invalid JSON Pointer: ${pointer}`);
        return object;
    }
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
    static insert(object, pointer, value) {
        /** @type {?} */
        const updatedObject = this.set(object, pointer, value, true);
        return updatedObject;
    }
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
    static insertCopy(object, pointer, value) {
        /** @type {?} */
        const updatedObject = this.setCopy(object, pointer, value, true);
        return updatedObject;
    }
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
    static remove(object, pointer) {
        /** @type {?} */
        const keyArray = this.parse(pointer);
        if (keyArray !== null && keyArray.length) {
            /** @type {?} */
            let lastKey = keyArray.pop();
            /** @type {?} */
            const parentObject = this.get(object, keyArray);
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
        console.error(`remove error: Invalid JSON Pointer: ${pointer}`);
        return object;
    }
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
    static has(object, pointer) {
        /** @type {?} */
        const hasValue = this.get(object, pointer, 0, null, true);
        return hasValue;
    }
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
    static dict(object) {
        /** @type {?} */
        const results = {};
        this.forEachDeep(object, (/**
         * @param {?} value
         * @param {?} pointer
         * @return {?}
         */
        (value, pointer) => {
            if (typeof value !== 'object') {
                results[pointer] = value;
            }
        }));
        return results;
    }
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
    static forEachDeep(object, fn = (/**
     * @param {?} v
     * @return {?}
     */
    (v) => v), bottomUp = false, pointer = '', rootObject = object) {
        if (typeof fn !== 'function') {
            console.error(`forEachDeep error: Iterator is not a function:`, fn);
            return;
        }
        if (!bottomUp) {
            fn(object, pointer, rootObject);
        }
        if (isObject(object) || isArray(object)) {
            for (const key of Object.keys(object)) {
                /** @type {?} */
                const newPointer = pointer + '/' + this.escape(key);
                this.forEachDeep(object[key], fn, bottomUp, newPointer, rootObject);
            }
        }
        if (bottomUp) {
            fn(object, pointer, rootObject);
        }
    }
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
    static forEachDeepCopy(object, fn = (/**
     * @param {?} v
     * @return {?}
     */
    (v) => v), bottomUp = false, pointer = '', rootObject = object) {
        if (typeof fn !== 'function') {
            console.error(`forEachDeepCopy error: Iterator is not a function:`, fn);
            return null;
        }
        if (isObject(object) || isArray(object)) {
            /** @type {?} */
            let newObject = isArray(object) ? [...object] : Object.assign({}, object);
            if (!bottomUp) {
                newObject = fn(newObject, pointer, rootObject);
            }
            for (const key of Object.keys(newObject)) {
                /** @type {?} */
                const newPointer = pointer + '/' + this.escape(key);
                newObject[key] = this.forEachDeepCopy(newObject[key], fn, bottomUp, newPointer, rootObject);
            }
            if (bottomUp) {
                newObject = fn(newObject, pointer, rootObject);
            }
            return newObject;
        }
        else {
            return fn(object, pointer, rootObject);
        }
    }
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
    static escape(key) {
        /** @type {?} */
        const escaped = key.toString().replace(/~/g, '~0').replace(/\//g, '~1');
        return escaped;
    }
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
    static unescape(key) {
        /** @type {?} */
        const unescaped = key.toString().replace(/~1/g, '/').replace(/~0/g, '~');
        return unescaped;
    }
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
    static parse(pointer, errors = false) {
        if (!this.isJsonPointer(pointer)) {
            if (errors) {
                console.error(`parse error: Invalid JSON Pointer: ${pointer}`);
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
    }
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
    static compile(pointer, defaultValue = '', errors = false) {
        if (pointer === '#') {
            return '';
        }
        if (!this.isJsonPointer(pointer)) {
            if (errors) {
                console.error(`compile error: Invalid JSON Pointer: ${pointer}`);
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
            key => key === '' ? defaultValue : this.escape(key))).join('/');
        }
        if (typeof pointer === 'string') {
            if (pointer[0] === '#') {
                pointer = pointer.slice(1);
            }
            return pointer;
        }
    }
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
    static toKey(pointer, errors = false) {
        /** @type {?} */
        const keyArray = this.parse(pointer, errors);
        if (keyArray === null) {
            return null;
        }
        if (!keyArray.length) {
            return '';
        }
        return keyArray[keyArray.length - 1];
    }
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
    static isJsonPointer(value) {
        if (isArray(value)) {
            return value.every((/**
             * @param {?} key
             * @return {?}
             */
            key => typeof key === 'string'));
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
    }
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
    static isSubPointer(shortPointer, longPointer, trueIfMatching = false, errors = false) {
        if (!this.isJsonPointer(shortPointer) || !this.isJsonPointer(longPointer)) {
            if (errors) {
                /** @type {?} */
                let invalid = '';
                if (!this.isJsonPointer(shortPointer)) {
                    invalid += ` 1: ${shortPointer}`;
                }
                if (!this.isJsonPointer(longPointer)) {
                    invalid += ` 2: ${longPointer}`;
                }
                console.error(`isSubPointer error: Invalid JSON Pointer ${invalid}`);
            }
            return;
        }
        shortPointer = this.compile(shortPointer, '', errors);
        longPointer = this.compile(longPointer, '', errors);
        return shortPointer === longPointer ? trueIfMatching :
            `${shortPointer}/` === longPointer.slice(0, shortPointer.length + 1);
    }
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
    static toIndexedPointer(genericPointer, indexArray, arrayMap = null) {
        if (this.isJsonPointer(genericPointer) && isArray(indexArray)) {
            /** @type {?} */
            let indexedPointer = this.compile(genericPointer);
            if (isMap(arrayMap)) {
                /** @type {?} */
                let arrayIndex = 0;
                return indexedPointer.replace(/\/\-(?=\/|$)/g, (/**
                 * @param {?} key
                 * @param {?} stringIndex
                 * @return {?}
                 */
                (key, stringIndex) => arrayMap.has(((/** @type {?} */ (indexedPointer))).slice(0, stringIndex)) ?
                    '/' + indexArray[arrayIndex++] : key));
            }
            else {
                for (const pointerIndex of indexArray) {
                    indexedPointer = indexedPointer.replace('/-', '/' + pointerIndex);
                }
                return indexedPointer;
            }
        }
        if (!this.isJsonPointer(genericPointer)) {
            console.error(`toIndexedPointer error: Invalid JSON Pointer: ${genericPointer}`);
        }
        if (!isArray(indexArray)) {
            console.error(`toIndexedPointer error: Invalid indexArray: ${indexArray}`);
        }
    }
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
    static toGenericPointer(indexedPointer, arrayMap = new Map()) {
        if (this.isJsonPointer(indexedPointer) && isMap(arrayMap)) {
            /** @type {?} */
            const pointerArray = this.parse(indexedPointer);
            for (let i = 1; i < pointerArray.length; i++) {
                /** @type {?} */
                const subPointer = this.compile(pointerArray.slice(0, i));
                if (arrayMap.has(subPointer) &&
                    arrayMap.get(subPointer) <= +pointerArray[i]) {
                    pointerArray[i] = '-';
                }
            }
            return this.compile(pointerArray);
        }
        if (!this.isJsonPointer(indexedPointer)) {
            console.error(`toGenericPointer error: invalid JSON Pointer: ${indexedPointer}`);
        }
        if (!isMap(arrayMap)) {
            console.error(`toGenericPointer error: invalid arrayMap: ${arrayMap}`);
        }
    }
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
    static toControlPointer(dataPointer, formGroup, controlMustExist = false) {
        /** @type {?} */
        const dataPointerArray = this.parse(dataPointer);
        /** @type {?} */
        const controlPointerArray = [];
        /** @type {?} */
        let subGroup = formGroup;
        if (dataPointerArray !== null) {
            for (const key of dataPointerArray) {
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
                    console.error(`toControlPointer error: Unable to find "${key}" item in FormGroup.`);
                    console.error(dataPointer);
                    console.error(formGroup);
                    return;
                }
                else {
                    controlPointerArray.push(key);
                    subGroup = { controls: {} };
                }
            }
            return this.compile(controlPointerArray);
        }
        console.error(`toControlPointer error: Invalid JSON Pointer: ${dataPointer}`);
    }
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
    static toSchemaPointer(dataPointer, schema) {
        if (this.isJsonPointer(dataPointer) && typeof schema === 'object') {
            /** @type {?} */
            const pointerArray = this.parse(dataPointer);
            if (!pointerArray.length) {
                return '';
            }
            /** @type {?} */
            const firstKey = pointerArray.shift();
            if (schema.type === 'object' || schema.properties || schema.additionalProperties) {
                if ((schema.properties || {})[firstKey]) {
                    return `/properties/${this.escape(firstKey)}` +
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
                const arrayItem = firstKey === '-' || firstKey === '' ? 0 : +firstKey;
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
            console.error(`toSchemaPointer error: Data pointer ${dataPointer} ` +
                `not compatible with schema ${schema}`);
            return null;
        }
        if (!this.isJsonPointer(dataPointer)) {
            console.error(`toSchemaPointer error: Invalid JSON Pointer: ${dataPointer}`);
        }
        if (typeof schema !== 'object') {
            console.error(`toSchemaPointer error: Invalid JSON Schema: ${schema}`);
        }
        return null;
    }
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
    static toDataPointer(schemaPointer, schema, errors = false) {
        if (this.isJsonPointer(schemaPointer) && typeof schema === 'object' &&
            this.has(schema, schemaPointer)) {
            /** @type {?} */
            const pointerArray = this.parse(schemaPointer);
            if (!pointerArray.length) {
                return '';
            }
            /** @type {?} */
            const firstKey = pointerArray.shift();
            if (firstKey === 'properties' ||
                (firstKey === 'items' && isArray(schema.items))) {
                /** @type {?} */
                const secondKey = pointerArray.shift();
                /** @type {?} */
                const pointerSuffix = this.toDataPointer(pointerArray, schema[firstKey][secondKey]);
                return pointerSuffix === null ? null : '/' + secondKey + pointerSuffix;
            }
            else if (firstKey === 'additionalItems' ||
                (firstKey === 'items' && isObject(schema.items))) {
                /** @type {?} */
                const pointerSuffix = this.toDataPointer(pointerArray, schema[firstKey]);
                return pointerSuffix === null ? null : '/-' + pointerSuffix;
            }
            else if (['allOf', 'anyOf', 'oneOf'].includes(firstKey)) {
                /** @type {?} */
                const secondKey = pointerArray.shift();
                return this.toDataPointer(pointerArray, schema[firstKey][secondKey]);
            }
            else if (firstKey === 'not') {
                return this.toDataPointer(pointerArray, schema[firstKey]);
            }
            else if (['contains', 'definitions', 'dependencies', 'additionalItems',
                'additionalProperties', 'patternProperties', 'propertyNames'].includes(firstKey)) {
                if (errors) {
                    console.error(`toDataPointer error: Ambiguous location`);
                }
            }
            return '';
        }
        if (errors) {
            if (!this.isJsonPointer(schemaPointer)) {
                console.error(`toDataPointer error: Invalid JSON Pointer: ${schemaPointer}`);
            }
            if (typeof schema !== 'object') {
                console.error(`toDataPointer error: Invalid JSON Schema: ${schema}`);
            }
            if (typeof schema !== 'object') {
                console.error(`toDataPointer error: Pointer ${schemaPointer} invalid for Schema: ${schema}`);
            }
        }
        return null;
    }
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
    static parseObjectPath(path) {
        if (isArray(path)) {
            return (/** @type {?} */ (path));
        }
        if (this.isJsonPointer(path)) {
            return this.parse(path);
        }
        if (typeof path === 'string') {
            /** @type {?} */
            let index = 0;
            /** @type {?} */
            const parts = [];
            while (index < path.length) {
                /** @type {?} */
                const nextDot = path.indexOf('.', index);
                /** @type {?} */
                const nextOB = path.indexOf('[', index);
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
                    const quote = path.charAt(nextOB + 1);
                    if (quote === '"' || quote === '\'') { // enclosing quotes
                        // enclosing quotes
                        /** @type {?} */
                        let nextCB = path.indexOf(quote + ']', nextOB);
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
                        let nextCB = path.indexOf(']', nextOB);
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
    }
}
JsonPointer.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// updated from AJV fast format regular expressions:
// https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js
/** @type {?} */
const jsonSchemaFormatTests = {
    'date': /^\d\d\d\d-[0-1]\d-[0-3]\d$/,
    'time': /^[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?(?:z|[+-]\d\d:\d\d)?$/i,
    // Modified to allow incomplete entries, such as
    // "2000-03-14T01:59:26.535" (needs "Z") or "2000-03-14T01:59" (needs ":00Z")
    'date-time': /^\d\d\d\d-[0-1]\d-[0-3]\d[t\s][0-2]\d:[0-5]\d(?::[0-5]\d)?(?:\.\d+)?(?:z|[+-]\d\d:\d\d)?$/i,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'willful violation')
    'email': /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i,
    'hostname': /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*$/i,
    // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    'ipv4': /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
    // optimized http://stackoverflow.com/questions/53497/regular-expression-that-matches-valid-ipv6-addresses
    // tslint:disable-next-line:max-line-length
    'ipv6': /^\s*(?:(?:(?:[0-9a-f]{1,4}:){7}(?:[0-9a-f]{1,4}|:))|(?:(?:[0-9a-f]{1,4}:){6}(?::[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){5}(?:(?:(?::[0-9a-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){4}(?:(?:(?::[0-9a-f]{1,4}){1,3})|(?:(?::[0-9a-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){3}(?:(?:(?::[0-9a-f]{1,4}){1,4})|(?:(?::[0-9a-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){2}(?:(?:(?::[0-9a-f]{1,4}){1,5})|(?:(?::[0-9a-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){1}(?:(?:(?::[0-9a-f]{1,4}){1,6})|(?:(?::[0-9a-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[0-9a-f]{1,4}){1,7})|(?:(?::[0-9a-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(?:%.+)?\s*$/i,
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    'uri': /^(?:[a-z][a-z0-9+-.]*)(?::|\/)\/?[^\s]*$/i,
    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
    'uri-reference': /^(?:(?:[a-z][a-z0-9+-.]*:)?\/\/)?[^\s]*$/i,
    // uri-template: https://tools.ietf.org/html/rfc6570
    // tslint:disable-next-line:max-line-length
    'uri-template': /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    // For the source: https://gist.github.com/dperini/729294
    // For test cases: https://mathiasbynens.be/demo/url-regex
    // tslint:disable-next-line:max-line-length
    // @todo Delete current URL in favour of the commented out URL rule when this ajv issue is fixed https://github.com/eslint/eslint/issues/7983.
    // tslint:disable-next-line:max-line-length
    // URL: /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u{00a1}-\u{ffff}0-9]+-?)*[a-z\u{00a1}-\u{ffff}0-9]+)(?:\.(?:[a-z\u{00a1}-\u{ffff}0-9]+-?)*[a-z\u{00a1}-\u{ffff}0-9]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
    // tslint:disable-next-line:max-line-length
    'url': /^(?:(?:http[s\u017F]?|ftp):\/\/)(?:(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+(?::(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?@)?(?:(?!10(?:\.[0-9]{1,3}){3})(?!127(?:\.[0-9]{1,3}){3})(?!169\.254(?:\.[0-9]{1,3}){2})(?!192\.168(?:\.[0-9]{1,3}){2})(?!172\.(?:1[6-9]|2[0-9]|3[01])(?:\.[0-9]{1,3}){2})(?:[1-9][0-9]?|1[0-9][0-9]|2[01][0-9]|22[0-3])(?:\.(?:1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])){2}(?:\.(?:[1-9][0-9]?|1[0-9][0-9]|2[0-4][0-9]|25[0-4]))|(?:(?:(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-?)*(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)(?:\.(?:(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-?)*(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)*(?:\.(?:(?:[KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]){2,})))(?::[0-9]{2,5})?(?:\/(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?$/i,
    // uuid: http://tools.ietf.org/html/rfc4122
    'uuid': /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    // optimized https://gist.github.com/olmokramer/82ccce673f86db7cda5e
    // tslint:disable-next-line:max-line-length
    'color': /^\s*(#(?:[\da-f]{3}){1,2}|rgb\((?:\d{1,3},\s*){2}\d{1,3}\)|rgba\((?:\d{1,3},\s*){3}\d*\.?\d+\)|hsl\(\d{1,3}(?:,\s*\d{1,3}%){2}\)|hsla\(\d{1,3}(?:,\s*\d{1,3}%){2},\s*\d*\.?\d+\))\s*$/gi,
    // JSON-pointer: https://tools.ietf.org/html/rfc6901
    'json-pointer': /^(?:\/(?:[^~/]|~0|~1)*)*$|^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    'relative-json-pointer': /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    'regex': (/**
     * @param {?} str
     * @return {?}
     */
    function (str) {
        if (/[^\\]\\Z/.test(str)) {
            return false;
        }
        try {
            return true;
        }
        catch (e) {
            return false;
        }
    })
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class JsonValidators {
    /**
     * @param {?=} input
     * @return {?}
     */
    static required(input) {
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
                (control, invert = false) => {
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
    }
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
    static type(requiredType) {
        if (!hasValue(requiredType)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            const currentValue = control.value;
            /** @type {?} */
            const isValid = isArray(requiredType) ?
                ((/** @type {?} */ (requiredType))).some((/**
                 * @param {?} type
                 * @return {?}
                 */
                type => isType(currentValue, type))) :
                isType(currentValue, (/** @type {?} */ (requiredType)));
            return xor(isValid, invert) ?
                null : { 'type': { requiredType, currentValue } };
        });
    }
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
    static enum(allowedValues) {
        if (!isArray(allowedValues)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            const currentValue = control.value;
            /** @type {?} */
            const isEqualVal = (/**
             * @param {?} enumValue
             * @param {?} inputValue
             * @return {?}
             */
            (enumValue, inputValue) => enumValue === inputValue ||
                (isNumber(enumValue) && +inputValue === +enumValue) ||
                (isBoolean(enumValue, 'strict') &&
                    toJavaScriptType(inputValue, 'boolean') === enumValue) ||
                (enumValue === null && !hasValue(inputValue)) ||
                isEqual$1(enumValue, inputValue));
            /** @type {?} */
            const isValid = isArray(currentValue) ?
                currentValue.every((/**
                 * @param {?} inputValue
                 * @return {?}
                 */
                inputValue => allowedValues.some((/**
                 * @param {?} enumValue
                 * @return {?}
                 */
                enumValue => isEqualVal(enumValue, inputValue))))) :
                allowedValues.some((/**
                 * @param {?} enumValue
                 * @return {?}
                 */
                enumValue => isEqualVal(enumValue, currentValue)));
            return xor(isValid, invert) ?
                null : { 'enum': { allowedValues, currentValue } };
        });
    }
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
    static const(requiredValue) {
        if (!hasValue(requiredValue)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            const currentValue = control.value;
            /** @type {?} */
            const isEqualVal = (/**
             * @param {?} constValue
             * @param {?} inputValue
             * @return {?}
             */
            (constValue, inputValue) => constValue === inputValue ||
                isNumber(constValue) && +inputValue === +constValue ||
                isBoolean(constValue, 'strict') &&
                    toJavaScriptType(inputValue, 'boolean') === constValue ||
                constValue === null && !hasValue(inputValue));
            /** @type {?} */
            const isValid = isEqualVal(requiredValue, currentValue);
            return xor(isValid, invert) ?
                null : { 'const': { requiredValue, currentValue } };
        });
    }
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
    static minLength(minimumLength) {
        if (!hasValue(minimumLength)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            const currentLength = isString(control.value) ? control.value.length : 0;
            /** @type {?} */
            const isValid = currentLength >= minimumLength;
            return xor(isValid, invert) ?
                null : { 'minLength': { minimumLength, currentLength } };
        });
    }
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
    static maxLength(maximumLength) {
        if (!hasValue(maximumLength)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => {
            /** @type {?} */
            const currentLength = isString(control.value) ? control.value.length : 0;
            /** @type {?} */
            const isValid = currentLength <= maximumLength;
            return xor(isValid, invert) ?
                null : { 'maxLength': { maximumLength, currentLength } };
        });
    }
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
    static pattern(pattern, wholeString = false) {
        if (!hasValue(pattern)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            let regex;
            /** @type {?} */
            let requiredPattern;
            if (typeof pattern === 'string') {
                requiredPattern = (wholeString) ? `^${pattern}$` : pattern;
                regex = new RegExp(requiredPattern);
            }
            else {
                requiredPattern = pattern.toString();
                regex = pattern;
            }
            /** @type {?} */
            const currentValue = control.value;
            /** @type {?} */
            const isValid = isString(currentValue) ? regex.test(currentValue) : false;
            return xor(isValid, invert) ?
                null : { 'pattern': { requiredPattern, currentValue } };
        });
    }
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
    static format(requiredFormat) {
        if (!hasValue(requiredFormat)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            let isValid;
            /** @type {?} */
            const currentValue = control.value;
            if (isString(currentValue)) {
                /** @type {?} */
                const formatTest = jsonSchemaFormatTests[requiredFormat];
                if (typeof formatTest === 'object') {
                    isValid = ((/** @type {?} */ (formatTest))).test((/** @type {?} */ (currentValue)));
                }
                else if (typeof formatTest === 'function') {
                    isValid = ((/** @type {?} */ (formatTest)))((/** @type {?} */ (currentValue)));
                }
                else {
                    console.error(`format validator error: "${requiredFormat}" is not a recognized format.`);
                    isValid = true;
                }
            }
            else {
                // Allow JavaScript Date objects
                isValid = ['date', 'time', 'date-time'].includes(requiredFormat) &&
                    Object.prototype.toString.call(currentValue) === '[object Date]';
            }
            return xor(isValid, invert) ?
                null : { 'format': { requiredFormat, currentValue } };
        });
    }
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
    static minimum(minimumValue) {
        if (!hasValue(minimumValue)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            const currentValue = control.value;
            /** @type {?} */
            const isValid = !isNumber(currentValue) || currentValue >= minimumValue;
            return xor(isValid, invert) ?
                null : { 'minimum': { minimumValue, currentValue } };
        });
    }
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
    static exclusiveMinimum(exclusiveMinimumValue) {
        if (!hasValue(exclusiveMinimumValue)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            const currentValue = control.value;
            /** @type {?} */
            const isValid = !isNumber(currentValue) || +currentValue < exclusiveMinimumValue;
            return xor(isValid, invert) ?
                null : { 'exclusiveMinimum': { exclusiveMinimumValue, currentValue } };
        });
    }
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
    static maximum(maximumValue) {
        if (!hasValue(maximumValue)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            const currentValue = control.value;
            /** @type {?} */
            const isValid = !isNumber(currentValue) || +currentValue <= maximumValue;
            return xor(isValid, invert) ?
                null : { 'maximum': { maximumValue, currentValue } };
        });
    }
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
    static exclusiveMaximum(exclusiveMaximumValue) {
        if (!hasValue(exclusiveMaximumValue)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            const currentValue = control.value;
            /** @type {?} */
            const isValid = !isNumber(currentValue) || +currentValue < exclusiveMaximumValue;
            return xor(isValid, invert) ?
                null : { 'exclusiveMaximum': { exclusiveMaximumValue, currentValue } };
        });
    }
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
    static multipleOf(multipleOfValue) {
        if (!hasValue(multipleOfValue)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            const currentValue = control.value;
            /** @type {?} */
            const isValid = isNumber(currentValue) &&
                currentValue % multipleOfValue === 0;
            return xor(isValid, invert) ?
                null : { 'multipleOf': { multipleOfValue, currentValue } };
        });
    }
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
    static minProperties(minimumProperties) {
        if (!hasValue(minimumProperties)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            const currentProperties = Object.keys(control.value).length || 0;
            /** @type {?} */
            const isValid = currentProperties >= minimumProperties;
            return xor(isValid, invert) ?
                null : { 'minProperties': { minimumProperties, currentProperties } };
        });
    }
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
    static maxProperties(maximumProperties) {
        if (!hasValue(maximumProperties)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => {
            /** @type {?} */
            const currentProperties = Object.keys(control.value).length || 0;
            /** @type {?} */
            const isValid = currentProperties <= maximumProperties;
            return xor(isValid, invert) ?
                null : { 'maxProperties': { maximumProperties, currentProperties } };
        });
    }
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
    static dependencies(dependencies) {
        if (getType(dependencies) !== 'object' || isEmpty(dependencies)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            const allErrors = _mergeObjects(forEachCopy(dependencies, (/**
             * @param {?} value
             * @param {?} requiringField
             * @return {?}
             */
            (value, requiringField) => {
                if (!hasValue(control.value[requiringField])) {
                    return null;
                }
                /** @type {?} */
                let requiringFieldErrors = {};
                /** @type {?} */
                let requiredFields;
                /** @type {?} */
                let properties = {};
                if (getType(dependencies[requiringField]) === 'array') {
                    requiredFields = dependencies[requiringField];
                }
                else if (getType(dependencies[requiringField]) === 'object') {
                    requiredFields = dependencies[requiringField]['required'] || [];
                    properties = dependencies[requiringField]['properties'] || {};
                }
                // Validate property dependencies
                for (const requiredField of requiredFields) {
                    if (xor(!hasValue(control.value[requiredField]), invert)) {
                        requiringFieldErrors[requiredField] = { 'required': true };
                    }
                }
                // Validate schema dependencies
                requiringFieldErrors = _mergeObjects(requiringFieldErrors, forEachCopy(properties, (/**
                 * @param {?} requirements
                 * @param {?} requiredField
                 * @return {?}
                 */
                (requirements, requiredField) => {
                    /** @type {?} */
                    const requiredFieldErrors = _mergeObjects(forEachCopy(requirements, (/**
                     * @param {?} requirement
                     * @param {?} parameter
                     * @return {?}
                     */
                    (requirement, parameter) => {
                        /** @type {?} */
                        let validator = null;
                        if (requirement === 'maximum' || requirement === 'minimum') {
                            /** @type {?} */
                            const exclusive = !!requirements['exclusiveM' + requirement.slice(1)];
                            validator = JsonValidators[requirement](parameter, exclusive);
                        }
                        else if (typeof JsonValidators[requirement] === 'function') {
                            validator = JsonValidators[requirement](parameter);
                        }
                        return !isDefined(validator) ?
                            null : validator(control.value[requiredField]);
                    })));
                    return isEmpty(requiredFieldErrors) ?
                        null : { [requiredField]: requiredFieldErrors };
                })));
                return isEmpty(requiringFieldErrors) ?
                    null : { [requiringField]: requiringFieldErrors };
            })));
            return isEmpty(allErrors) ? null : allErrors;
        });
    }
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
    static minItems(minimumItems) {
        if (!hasValue(minimumItems)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            const currentItems = isArray(control.value) ? control.value.length : 0;
            /** @type {?} */
            const isValid = currentItems >= minimumItems;
            return xor(isValid, invert) ?
                null : { 'minItems': { minimumItems, currentItems } };
        });
    }
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
    static maxItems(maximumItems) {
        if (!hasValue(maximumItems)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => {
            /** @type {?} */
            const currentItems = isArray(control.value) ? control.value.length : 0;
            /** @type {?} */
            const isValid = currentItems <= maximumItems;
            return xor(isValid, invert) ?
                null : { 'maxItems': { maximumItems, currentItems } };
        });
    }
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
    static uniqueItems(unique = true) {
        if (!unique) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            const sorted = control.value.slice().sort();
            /** @type {?} */
            const duplicateItems = [];
            for (let i = 1; i < sorted.length; i++) {
                if (sorted[i - 1] === sorted[i] && duplicateItems.includes(sorted[i])) {
                    duplicateItems.push(sorted[i]);
                }
            }
            /** @type {?} */
            const isValid = !duplicateItems.length;
            return xor(isValid, invert) ?
                null : { 'uniqueItems': { duplicateItems } };
        });
    }
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
    static contains(requiredItem = true) {
        if (!requiredItem) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => {
            if (isEmpty(control.value) || !isArray(control.value)) {
                return null;
            }
            /** @type {?} */
            const currentItems = control.value;
            // const isValid = currentItems.some(item =>
            //
            // );
            /** @type {?} */
            const isValid = true;
            return xor(isValid, invert) ?
                null : { 'contains': { requiredItem, currentItems } };
        });
    }
    /**
     * No-op validator. Included for backward compatibility.
     * @param {?} control
     * @return {?}
     */
    static nullValidator(control) {
        return null;
    }
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
    static composeAnyOf(validators) {
        if (!validators) {
            return null;
        }
        /** @type {?} */
        const presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => {
            /** @type {?} */
            const arrayOfErrors = _executeValidators(control, presentValidators, invert).filter(isDefined);
            /** @type {?} */
            const isValid = validators.length > arrayOfErrors.length;
            return xor(isValid, invert) ?
                null : _mergeObjects(...arrayOfErrors, { 'anyOf': !invert });
        });
    }
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
    static composeOneOf(validators) {
        if (!validators) {
            return null;
        }
        /** @type {?} */
        const presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => {
            /** @type {?} */
            const arrayOfErrors = _executeValidators(control, presentValidators);
            /** @type {?} */
            const validControls = validators.length - arrayOfErrors.filter(isDefined).length;
            /** @type {?} */
            const isValid = validControls === 1;
            if (xor(isValid, invert)) {
                return null;
            }
            /** @type {?} */
            const arrayOfValids = _executeValidators(control, presentValidators, invert);
            return _mergeObjects(...arrayOfErrors, ...arrayOfValids, { 'oneOf': !invert });
        });
    }
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
    static composeAllOf(validators) {
        if (!validators) {
            return null;
        }
        /** @type {?} */
        const presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => {
            /** @type {?} */
            const combinedErrors = _mergeErrors(_executeValidators(control, presentValidators, invert));
            /** @type {?} */
            const isValid = combinedErrors === null;
            return (xor(isValid, invert)) ?
                null : _mergeObjects(combinedErrors, { 'allOf': !invert });
        });
    }
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
    static composeNot(validator) {
        if (!validator) {
            return null;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            const error = validator(control, !invert);
            /** @type {?} */
            const isValid = error === null;
            return (xor(isValid, invert)) ?
                null : _mergeObjects(error, { 'not': !invert });
        });
    }
    /**
     * 'compose' validator combination function
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     * @param {?} validators
     * @return {?}
     */
    static compose(validators) {
        if (!validators) {
            return null;
        }
        /** @type {?} */
        const presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return (/**
         * @param {?} control
         * @param {?=} invert
         * @return {?}
         */
        (control, invert = false) => _mergeErrors(_executeValidators(control, presentValidators, invert)));
    }
    /**
     * 'composeAsync' async validator combination function
     *
     * // {AsyncIValidatorFn[]} async validators - array of async validators
     * // {AsyncIValidatorFn} - single combined async validator function
     * @param {?} validators
     * @return {?}
     */
    static composeAsync(validators) {
        if (!validators) {
            return null;
        }
        /** @type {?} */
        const presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return (/**
         * @param {?} control
         * @return {?}
         */
        (control) => {
            /** @type {?} */
            const observables = _executeAsyncValidators(control, presentValidators).map(toObservable);
            return map.call(forkJoin(observables), _mergeErrors);
        });
    }
    // Additional angular validators (not used by Angualr JSON Schema Form)
    // From https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
    /**
     * Validator that requires controls to have a value greater than a number.
     * @param {?} min
     * @return {?}
     */
    static min(min) {
        if (!hasValue(min)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @return {?}
         */
        (control) => {
            // don't validate empty values to allow optional controls
            if (isEmpty(control.value) || isEmpty(min)) {
                return null;
            }
            /** @type {?} */
            const value = parseFloat(control.value);
            /** @type {?} */
            const actual = control.value;
            // Controls with NaN values after parsing should be treated as not having a
            // minimum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-min
            return isNaN(value) || value >= min ? null : { 'min': { min, actual } };
        });
    }
    /**
     * Validator that requires controls to have a value less than a number.
     * @param {?} max
     * @return {?}
     */
    static max(max) {
        if (!hasValue(max)) {
            return JsonValidators.nullValidator;
        }
        return (/**
         * @param {?} control
         * @return {?}
         */
        (control) => {
            // don't validate empty values to allow optional controls
            if (isEmpty(control.value) || isEmpty(max)) {
                return null;
            }
            /** @type {?} */
            const value = parseFloat(control.value);
            /** @type {?} */
            const actual = control.value;
            // Controls with NaN values after parsing should be treated as not having a
            // maximum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-max
            return isNaN(value) || value <= max ? null : { 'max': { max, actual } };
        });
    }
    /**
     * Validator that requires control value to be true.
     * @param {?} control
     * @return {?}
     */
    static requiredTrue(control) {
        if (!control) {
            return JsonValidators.nullValidator;
        }
        return control.value === true ? null : { 'required': true };
    }
    /**
     * Validator that performs email validation.
     * @param {?} control
     * @return {?}
     */
    static email(control) {
        if (!control) {
            return JsonValidators.nullValidator;
        }
        /** @type {?} */
        const EMAIL_REGEXP = 
        // tslint:disable-next-line:max-line-length
        /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
        return EMAIL_REGEXP.test(control.value) ? null : { 'email': true };
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * 'mergeSchemas' function
 *
 * Merges multiple JSON schemas into a single schema with combined rules.
 *
 * If able to logically merge properties from all schemas,
 * returns a single schema object containing all merged properties.
 *
 * Example: ({ a: b, max: 1 }, { c: d, max: 2 }) => { a: b, c: d, max: 1 }
 *
 * If unable to logically merge, returns an allOf schema object containing
 * an array of the original schemas;
 *
 * Example: ({ a: b }, { a: d }) => { allOf: [ { a: b }, { a: d } ] }
 *
 * //   schemas - one or more input schemas
 * //  - merged schema
 * @param {...?} schemas
 * @return {?}
 */
function mergeSchemas(...schemas) {
    schemas = schemas.filter((/**
     * @param {?} schema
     * @return {?}
     */
    schema => !isEmpty(schema)));
    if (schemas.some((/**
     * @param {?} schema
     * @return {?}
     */
    schema => !isObject(schema)))) {
        return null;
    }
    /** @type {?} */
    const combinedSchema = {};
    for (const schema of schemas) {
        for (const key of Object.keys(schema)) {
            /** @type {?} */
            const combinedValue = combinedSchema[key];
            /** @type {?} */
            const schemaValue = schema[key];
            if (!hasOwn(combinedSchema, key) || isEqual$1(combinedValue, schemaValue)) {
                combinedSchema[key] = schemaValue;
            }
            else {
                switch (key) {
                    case 'allOf':
                        // Combine all items from both arrays
                        if (isArray(combinedValue) && isArray(schemaValue)) {
                            combinedSchema.allOf = mergeSchemas(...combinedValue, ...schemaValue);
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'additionalItems':
                    case 'additionalProperties':
                    case 'contains':
                    case 'propertyNames':
                        // Merge schema objects
                        if (isObject(combinedValue) && isObject(schemaValue)) {
                            combinedSchema[key] = mergeSchemas(combinedValue, schemaValue);
                            // additionalProperties == false in any schema overrides all other values
                        }
                        else if (key === 'additionalProperties' &&
                            (combinedValue === false || schemaValue === false)) {
                            combinedSchema.combinedSchema = false;
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'anyOf':
                    case 'oneOf':
                    case 'enum':
                        // Keep only items that appear in both arrays
                        if (isArray(combinedValue) && isArray(schemaValue)) {
                            combinedSchema[key] = combinedValue.filter((/**
                             * @param {?} item1
                             * @return {?}
                             */
                            item1 => schemaValue.findIndex((/**
                             * @param {?} item2
                             * @return {?}
                             */
                            item2 => isEqual$1(item1, item2))) > -1));
                            if (!combinedSchema[key].length) {
                                return { allOf: [...schemas] };
                            }
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'definitions':
                        // Combine keys from both objects
                        if (isObject(combinedValue) && isObject(schemaValue)) {
                            /** @type {?} */
                            const combinedObject = Object.assign({}, combinedValue);
                            for (const subKey of Object.keys(schemaValue)) {
                                if (!hasOwn(combinedObject, subKey) ||
                                    isEqual$1(combinedObject[subKey], schemaValue[subKey])) {
                                    combinedObject[subKey] = schemaValue[subKey];
                                    // Don't combine matching keys with different values
                                }
                                else {
                                    return { allOf: [...schemas] };
                                }
                            }
                            combinedSchema.definitions = combinedObject;
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'dependencies':
                        // Combine all keys from both objects
                        // and merge schemas on matching keys,
                        // converting from arrays to objects if necessary
                        if (isObject(combinedValue) && isObject(schemaValue)) {
                            /** @type {?} */
                            const combinedObject = Object.assign({}, combinedValue);
                            for (const subKey of Object.keys(schemaValue)) {
                                if (!hasOwn(combinedObject, subKey) ||
                                    isEqual$1(combinedObject[subKey], schemaValue[subKey])) {
                                    combinedObject[subKey] = schemaValue[subKey];
                                    // If both keys are arrays, include all items from both arrays,
                                    // excluding duplicates
                                }
                                else if (isArray(schemaValue[subKey]) && isArray(combinedObject[subKey])) {
                                    combinedObject[subKey] =
                                        uniqueItems(...combinedObject[subKey], ...schemaValue[subKey]);
                                    // If either key is an object, merge the schemas
                                }
                                else if ((isArray(schemaValue[subKey]) || isObject(schemaValue[subKey])) &&
                                    (isArray(combinedObject[subKey]) || isObject(combinedObject[subKey]))) {
                                    // If either key is an array, convert it to an object first
                                    /** @type {?} */
                                    const required = isArray(combinedSchema.required) ?
                                        combinedSchema.required : [];
                                    /** @type {?} */
                                    const combinedDependency = isArray(combinedObject[subKey]) ?
                                        { required: uniqueItems(...required, combinedObject[subKey]) } :
                                        combinedObject[subKey];
                                    /** @type {?} */
                                    const schemaDependency = isArray(schemaValue[subKey]) ?
                                        { required: uniqueItems(...required, schemaValue[subKey]) } :
                                        schemaValue[subKey];
                                    combinedObject[subKey] =
                                        mergeSchemas(combinedDependency, schemaDependency);
                                }
                                else {
                                    return { allOf: [...schemas] };
                                }
                            }
                            combinedSchema.dependencies = combinedObject;
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'items':
                        // If arrays, keep only items that appear in both arrays
                        if (isArray(combinedValue) && isArray(schemaValue)) {
                            combinedSchema.items = combinedValue.filter((/**
                             * @param {?} item1
                             * @return {?}
                             */
                            item1 => schemaValue.findIndex((/**
                             * @param {?} item2
                             * @return {?}
                             */
                            item2 => isEqual$1(item1, item2))) > -1));
                            if (!combinedSchema.items.length) {
                                return { allOf: [...schemas] };
                            }
                            // If both keys are objects, merge them
                        }
                        else if (isObject(combinedValue) && isObject(schemaValue)) {
                            combinedSchema.items = mergeSchemas(combinedValue, schemaValue);
                            // If object + array, combine object with each array item
                        }
                        else if (isArray(combinedValue) && isObject(schemaValue)) {
                            combinedSchema.items =
                                combinedValue.map((/**
                                 * @param {?} item
                                 * @return {?}
                                 */
                                item => mergeSchemas(item, schemaValue)));
                        }
                        else if (isObject(combinedValue) && isArray(schemaValue)) {
                            combinedSchema.items =
                                schemaValue.map((/**
                                 * @param {?} item
                                 * @return {?}
                                 */
                                item => mergeSchemas(item, combinedValue)));
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'multipleOf':
                        // TODO: Adjust to correctly handle decimal values
                        // If numbers, set to least common multiple
                        if (isNumber(combinedValue) && isNumber(schemaValue)) {
                            /** @type {?} */
                            const gcd = (/**
                             * @param {?} x
                             * @param {?} y
                             * @return {?}
                             */
                            (x, y) => !y ? x : gcd(y, x % y));
                            /** @type {?} */
                            const lcm = (/**
                             * @param {?} x
                             * @param {?} y
                             * @return {?}
                             */
                            (x, y) => (x * y) / gcd(x, y));
                            combinedSchema.multipleOf = lcm(combinedValue, schemaValue);
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'maximum':
                    case 'exclusiveMaximum':
                    case 'maxLength':
                    case 'maxItems':
                    case 'maxProperties':
                        // If numbers, set to lowest value
                        if (isNumber(combinedValue) && isNumber(schemaValue)) {
                            combinedSchema[key] = Math.min(combinedValue, schemaValue);
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'minimum':
                    case 'exclusiveMinimum':
                    case 'minLength':
                    case 'minItems':
                    case 'minProperties':
                        // If numbers, set to highest value
                        if (isNumber(combinedValue) && isNumber(schemaValue)) {
                            combinedSchema[key] = Math.max(combinedValue, schemaValue);
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'not':
                        // Combine not values into anyOf array
                        if (isObject(combinedValue) && isObject(schemaValue)) {
                            /** @type {?} */
                            const notAnyOf = [combinedValue, schemaValue]
                                .reduce((/**
                             * @param {?} notAnyOfArray
                             * @param {?} notSchema
                             * @return {?}
                             */
                            (notAnyOfArray, notSchema) => isArray(notSchema.anyOf) &&
                                Object.keys(notSchema).length === 1 ?
                                [...notAnyOfArray, ...notSchema.anyOf] :
                                [...notAnyOfArray, notSchema]), []);
                            // TODO: Remove duplicate items from array
                            combinedSchema.not = { anyOf: notAnyOf };
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'patternProperties':
                        // Combine all keys from both objects
                        // and merge schemas on matching keys
                        if (isObject(combinedValue) && isObject(schemaValue)) {
                            /** @type {?} */
                            const combinedObject = Object.assign({}, combinedValue);
                            for (const subKey of Object.keys(schemaValue)) {
                                if (!hasOwn(combinedObject, subKey) ||
                                    isEqual$1(combinedObject[subKey], schemaValue[subKey])) {
                                    combinedObject[subKey] = schemaValue[subKey];
                                    // If both keys are objects, merge them
                                }
                                else if (isObject(schemaValue[subKey]) && isObject(combinedObject[subKey])) {
                                    combinedObject[subKey] =
                                        mergeSchemas(combinedObject[subKey], schemaValue[subKey]);
                                }
                                else {
                                    return { allOf: [...schemas] };
                                }
                            }
                            combinedSchema.patternProperties = combinedObject;
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'properties':
                        // Combine all keys from both objects
                        // unless additionalProperties === false
                        // and merge schemas on matching keys
                        if (isObject(combinedValue) && isObject(schemaValue)) {
                            /** @type {?} */
                            const combinedObject = Object.assign({}, combinedValue);
                            // If new schema has additionalProperties,
                            // merge or remove non-matching property keys in combined schema
                            if (hasOwn(schemaValue, 'additionalProperties')) {
                                Object.keys(combinedValue)
                                    .filter((/**
                                 * @param {?} combinedKey
                                 * @return {?}
                                 */
                                combinedKey => !Object.keys(schemaValue).includes(combinedKey)))
                                    .forEach((/**
                                 * @param {?} nonMatchingKey
                                 * @return {?}
                                 */
                                nonMatchingKey => {
                                    if (schemaValue.additionalProperties === false) {
                                        delete combinedObject[nonMatchingKey];
                                    }
                                    else if (isObject(schemaValue.additionalProperties)) {
                                        combinedObject[nonMatchingKey] = mergeSchemas(combinedObject[nonMatchingKey], schemaValue.additionalProperties);
                                    }
                                }));
                            }
                            for (const subKey of Object.keys(schemaValue)) {
                                if (isEqual$1(combinedObject[subKey], schemaValue[subKey]) || (!hasOwn(combinedObject, subKey) &&
                                    !hasOwn(combinedObject, 'additionalProperties'))) {
                                    combinedObject[subKey] = schemaValue[subKey];
                                    // If combined schema has additionalProperties,
                                    // merge or ignore non-matching property keys in new schema
                                }
                                else if (!hasOwn(combinedObject, subKey) &&
                                    hasOwn(combinedObject, 'additionalProperties')) {
                                    // If combinedObject.additionalProperties === false,
                                    // do nothing (don't set key)
                                    // If additionalProperties is object, merge with new key
                                    if (isObject(combinedObject.additionalProperties)) {
                                        combinedObject[subKey] = mergeSchemas(combinedObject.additionalProperties, schemaValue[subKey]);
                                    }
                                    // If both keys are objects, merge them
                                }
                                else if (isObject(schemaValue[subKey]) &&
                                    isObject(combinedObject[subKey])) {
                                    combinedObject[subKey] =
                                        mergeSchemas(combinedObject[subKey], schemaValue[subKey]);
                                }
                                else {
                                    return { allOf: [...schemas] };
                                }
                            }
                            combinedSchema.properties = combinedObject;
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'required':
                        // If arrays, include all items from both arrays, excluding duplicates
                        if (isArray(combinedValue) && isArray(schemaValue)) {
                            combinedSchema.required = uniqueItems(...combinedValue, ...schemaValue);
                            // If booleans, aet true if either true
                        }
                        else if (typeof schemaValue === 'boolean' &&
                            typeof combinedValue === 'boolean') {
                            combinedSchema.required = !!combinedValue || !!schemaValue;
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case '$schema':
                    case '$id':
                    case 'id':
                        // Don't combine these keys
                        break;
                    case 'title':
                    case 'description':
                    case '$comment':
                        // Return the last value, overwriting any previous one
                        // These properties are not used for validation, so conflicts don't matter
                        combinedSchema[key] = schemaValue;
                        break;
                    case 'type':
                        if ((isArray(schemaValue) || isString(schemaValue)) &&
                            (isArray(combinedValue) || isString(combinedValue))) {
                            /** @type {?} */
                            const combinedTypes = commonItems(combinedValue, schemaValue);
                            if (!combinedTypes.length) {
                                return { allOf: [...schemas] };
                            }
                            combinedSchema.type = combinedTypes.length > 1 ? combinedTypes : combinedTypes[0];
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'uniqueItems':
                        // Set true if either true
                        combinedSchema.uniqueItems = !!combinedValue || !!schemaValue;
                        break;
                    default:
                        return { allOf: [...schemas] };
                }
            }
        }
    }
    return combinedSchema;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * JSON Schema function library:
 *
 * buildSchemaFromLayout:   TODO: Write this function
 *
 * buildSchemaFromData:
 *
 * getFromSchema:
 *
 * removeRecursiveReferences:
 *
 * getInputType:
 *
 * checkInlineType:
 *
 * isInputRequired:
 *
 * updateInputOptions:
 *
 * getTitleMapFromOneOf:
 *
 * getControlValidators:
 *
 * resolveSchemaReferences:
 *
 * getSubSchema:
 *
 * combineAllOf:
 *
 * fixRequiredArrayProperties:
 */
/**
 * 'buildSchemaFromLayout' function
 *
 * TODO: Build a JSON Schema from a JSON Form layout
 *
 * //   layout - The JSON Form layout
 * //  - The new JSON Schema
 * @param {?} layout
 * @return {?}
 */
function buildSchemaFromLayout(layout) {
    return;
    // let newSchema: any = { };
    // const walkLayout = (layoutItems: any[], callback: Function): any[] => {
    //   let returnArray: any[] = [];
    //   for (let layoutItem of layoutItems) {
    //     const returnItem: any = callback(layoutItem);
    //     if (returnItem) { returnArray = returnArray.concat(callback(layoutItem)); }
    //     if (layoutItem.items) {
    //       returnArray = returnArray.concat(walkLayout(layoutItem.items, callback));
    //     }
    //   }
    //   return returnArray;
    // };
    // walkLayout(layout, layoutItem => {
    //   let itemKey: string;
    //   if (typeof layoutItem === 'string') {
    //     itemKey = layoutItem;
    //   } else if (layoutItem.key) {
    //     itemKey = layoutItem.key;
    //   }
    //   if (!itemKey) { return; }
    //   //
    // });
}
/**
 * 'buildSchemaFromData' function
 *
 * Build a JSON Schema from a data object
 *
 * //   data - The data object
 * //  { boolean = false } requireAllFields - Require all fields?
 * //  { boolean = true } isRoot - is root
 * //  - The new JSON Schema
 * @param {?} data
 * @param {?=} requireAllFields
 * @param {?=} isRoot
 * @return {?}
 */
function buildSchemaFromData(data, requireAllFields = false, isRoot = true) {
    /** @type {?} */
    const newSchema = {};
    /** @type {?} */
    const getFieldType = (/**
     * @param {?} value
     * @return {?}
     */
    (value) => {
        /** @type {?} */
        const fieldType = getType(value, 'strict');
        return { integer: 'number', null: 'string' }[fieldType] || fieldType;
    });
    /** @type {?} */
    const buildSubSchema = (/**
     * @param {?} value
     * @return {?}
     */
    (value) => buildSchemaFromData(value, requireAllFields, false));
    if (isRoot) {
        newSchema.$schema = 'http://json-schema.org/draft-06/schema#';
    }
    newSchema.type = getFieldType(data);
    if (newSchema.type === 'object') {
        newSchema.properties = {};
        if (requireAllFields) {
            newSchema.required = [];
        }
        for (const key of Object.keys(data)) {
            newSchema.properties[key] = buildSubSchema(data[key]);
            if (requireAllFields) {
                newSchema.required.push(key);
            }
        }
    }
    else if (newSchema.type === 'array') {
        newSchema.items = data.map(buildSubSchema);
        // If all items are the same type, use an object for items instead of an array
        if ((new Set(data.map(getFieldType))).size === 1) {
            newSchema.items = newSchema.items.reduce((/**
             * @param {?} a
             * @param {?} b
             * @return {?}
             */
            (a, b) => (Object.assign({}, a, b))), {});
        }
        if (requireAllFields) {
            newSchema.minItems = 1;
        }
    }
    return newSchema;
}
/**
 * 'getFromSchema' function
 *
 * Uses a JSON Pointer for a value within a data object to retrieve
 * the schema for that value within schema for the data object.
 *
 * The optional third parameter can also be set to return something else:
 * 'schema' (default): the schema for the value indicated by the data pointer
 * 'parentSchema': the schema for the value's parent object or array
 * 'schemaPointer': a pointer to the value's schema within the object's schema
 * 'parentSchemaPointer': a pointer to the schema for the value's parent object or array
 *
 * //   schema - The schema to get the sub-schema from
 * //  { Pointer } dataPointer - JSON Pointer (string or array)
 * //  { string = 'schema' } returnType - what to return?
 * //  - The located sub-schema
 * @param {?} schema
 * @param {?} dataPointer
 * @param {?=} returnType
 * @return {?}
 */
function getFromSchema(schema, dataPointer, returnType = 'schema') {
    /** @type {?} */
    const dataPointerArray = JsonPointer.parse(dataPointer);
    if (dataPointerArray === null) {
        console.error(`getFromSchema error: Invalid JSON Pointer: ${dataPointer}`);
        return null;
    }
    /** @type {?} */
    let subSchema = schema;
    /** @type {?} */
    const schemaPointer = [];
    /** @type {?} */
    const length = dataPointerArray.length;
    if (returnType.slice(0, 6) === 'parent') {
        dataPointerArray.length--;
    }
    for (let i = 0; i < length; ++i) {
        /** @type {?} */
        const parentSchema = subSchema;
        /** @type {?} */
        const key = dataPointerArray[i];
        /** @type {?} */
        let subSchemaFound = false;
        if (typeof subSchema !== 'object') {
            console.error(`getFromSchema error: Unable to find "${key}" key in schema.`);
            console.error(schema);
            console.error(dataPointer);
            return null;
        }
        if (subSchema.type === 'array' && (!isNaN(key) || key === '-')) {
            if (hasOwn(subSchema, 'items')) {
                if (isObject(subSchema.items)) {
                    subSchemaFound = true;
                    subSchema = subSchema.items;
                    schemaPointer.push('items');
                }
                else if (isArray(subSchema.items)) {
                    if (!isNaN(key) && subSchema.items.length >= +key) {
                        subSchemaFound = true;
                        subSchema = subSchema.items[+key];
                        schemaPointer.push('items', key);
                    }
                }
            }
            if (!subSchemaFound && isObject(subSchema.additionalItems)) {
                subSchemaFound = true;
                subSchema = subSchema.additionalItems;
                schemaPointer.push('additionalItems');
            }
            else if (subSchema.additionalItems !== false) {
                subSchemaFound = true;
                subSchema = {};
                schemaPointer.push('additionalItems');
            }
        }
        else if (subSchema.type === 'object') {
            if (isObject(subSchema.properties) && hasOwn(subSchema.properties, key)) {
                subSchemaFound = true;
                subSchema = subSchema.properties[key];
                schemaPointer.push('properties', key);
            }
            else if (isObject(subSchema.additionalProperties)) {
                subSchemaFound = true;
                subSchema = subSchema.additionalProperties;
                schemaPointer.push('additionalProperties');
            }
            else if (subSchema.additionalProperties !== false) {
                subSchemaFound = true;
                subSchema = {};
                schemaPointer.push('additionalProperties');
            }
        }
        if (!subSchemaFound) {
            console.error(`getFromSchema error: Unable to find "${key}" item in schema.`);
            console.error(schema);
            console.error(dataPointer);
            return;
        }
    }
    return returnType.slice(-7) === 'Pointer' ? schemaPointer : subSchema;
}
/**
 * 'removeRecursiveReferences' function
 *
 * Checks a JSON Pointer against a map of recursive references and returns
 * a JSON Pointer to the shallowest equivalent location in the same object.
 *
 * Using this functions enables an object to be constructed with unlimited
 * recursion, while maintaing a fixed set of metadata, such as field data types.
 * The object can grow as large as it wants, and deeply recursed nodes can
 * just refer to the metadata for their shallow equivalents, instead of having
 * to add additional redundant metadata for each recursively added node.
 *
 * Example:
 *
 * pointer:         '/stuff/and/more/and/more/and/more/and/more/stuff'
 * recursiveRefMap: [['/stuff/and/more/and/more', '/stuff/and/more/']]
 * returned:        '/stuff/and/more/stuff'
 *
 * //  { Pointer } pointer -
 * //  { Map<string, string> } recursiveRefMap -
 * //  { Map<string, number> = new Map() } arrayMap - optional
 * // { string } -
 * @param {?} pointer
 * @param {?} recursiveRefMap
 * @param {?=} arrayMap
 * @return {?}
 */
function removeRecursiveReferences(pointer, recursiveRefMap, arrayMap = new Map()) {
    if (!pointer) {
        return '';
    }
    /** @type {?} */
    let genericPointer = JsonPointer.toGenericPointer(JsonPointer.compile(pointer), arrayMap);
    if (genericPointer.indexOf('/') === -1) {
        return genericPointer;
    }
    /** @type {?} */
    let possibleReferences = true;
    while (possibleReferences) {
        possibleReferences = false;
        recursiveRefMap.forEach((/**
         * @param {?} toPointer
         * @param {?} fromPointer
         * @return {?}
         */
        (toPointer, fromPointer) => {
            if (JsonPointer.isSubPointer(toPointer, fromPointer)) {
                while (JsonPointer.isSubPointer(fromPointer, genericPointer, true)) {
                    genericPointer = JsonPointer.toGenericPointer(toPointer + genericPointer.slice(fromPointer.length), arrayMap);
                    possibleReferences = true;
                }
            }
        }));
    }
    return genericPointer;
}
/**
 * 'getInputType' function
 *
 * //   schema
 * //  { any = null } layoutNode
 * // { string }
 * @param {?} schema
 * @param {?=} layoutNode
 * @return {?}
 */
function getInputType(schema, layoutNode = null) {
    // x-schema-form = Angular Schema Form compatibility
    // widget & component = React Jsonschema Form compatibility
    /** @type {?} */
    const controlType = JsonPointer.getFirst([
        [schema, '/x-schema-form/type'],
        [schema, '/x-schema-form/widget/component'],
        [schema, '/x-schema-form/widget'],
        [schema, '/widget/component'],
        [schema, '/widget']
    ]);
    if (isString(controlType)) {
        return checkInlineType(controlType, schema, layoutNode);
    }
    /** @type {?} */
    let schemaType = schema.type;
    if (schemaType) {
        if (isArray(schemaType)) { // If multiple types listed, use most inclusive type
            schemaType =
                inArray('object', schemaType) && hasOwn(schema, 'properties') ? 'object' :
                    inArray('array', schemaType) && hasOwn(schema, 'items') ? 'array' :
                        inArray('array', schemaType) && hasOwn(schema, 'additionalItems') ? 'array' :
                            inArray('string', schemaType) ? 'string' :
                                inArray('number', schemaType) ? 'number' :
                                    inArray('integer', schemaType) ? 'integer' :
                                        inArray('boolean', schemaType) ? 'boolean' : 'unknown';
        }
        if (schemaType === 'boolean') {
            return 'checkbox';
        }
        if (schemaType === 'object') {
            if (hasOwn(schema, 'properties') || hasOwn(schema, 'additionalProperties')) {
                return 'section';
            }
            // TODO: Figure out how to handle additionalProperties
            if (hasOwn(schema, '$ref')) {
                return '$ref';
            }
        }
        if (schemaType === 'array') {
            /** @type {?} */
            const itemsObject = JsonPointer.getFirst([
                [schema, '/items'],
                [schema, '/additionalItems']
            ]) || {};
            return hasOwn(itemsObject, 'enum') && schema.maxItems !== 1 ?
                checkInlineType('checkboxes', schema, layoutNode) : 'array';
        }
        if (schemaType === 'null') {
            return 'none';
        }
        if (JsonPointer.has(layoutNode, '/options/titleMap') ||
            hasOwn(schema, 'enum') || getTitleMapFromOneOf(schema, null, true)) {
            return 'select';
        }
        if (schemaType === 'number' || schemaType === 'integer') {
            return (schemaType === 'integer' || hasOwn(schema, 'multipleOf')) &&
                hasOwn(schema, 'maximum') && hasOwn(schema, 'minimum') ? 'range' : schemaType;
        }
        if (schemaType === 'string') {
            return {
                'color': 'color',
                'date': 'date',
                'date-time': 'datetime-local',
                'email': 'email',
                'uri': 'url',
            }[schema.format] || 'text';
        }
    }
    if (hasOwn(schema, '$ref')) {
        return '$ref';
    }
    if (isArray(schema.oneOf) || isArray(schema.anyOf)) {
        return 'one-of';
    }
    console.error(`getInputType error: Unable to determine input type for ${schemaType}`);
    console.error('schema', schema);
    if (layoutNode) {
        console.error('layoutNode', layoutNode);
    }
    return 'none';
}
/**
 * 'checkInlineType' function
 *
 * Checks layout and schema nodes for 'inline: true', and converts
 * 'radios' or 'checkboxes' to 'radios-inline' or 'checkboxes-inline'
 *
 * //  { string } controlType -
 * //   schema -
 * //  { any = null } layoutNode -
 * // { string }
 * @param {?} controlType
 * @param {?} schema
 * @param {?=} layoutNode
 * @return {?}
 */
function checkInlineType(controlType, schema, layoutNode = null) {
    if (!isString(controlType) || (controlType.slice(0, 8) !== 'checkbox' && controlType.slice(0, 5) !== 'radio')) {
        return controlType;
    }
    if (JsonPointer.getFirst([
        [layoutNode, '/inline'],
        [layoutNode, '/options/inline'],
        [schema, '/inline'],
        [schema, '/x-schema-form/inline'],
        [schema, '/x-schema-form/options/inline'],
        [schema, '/x-schema-form/widget/inline'],
        [schema, '/x-schema-form/widget/component/inline'],
        [schema, '/x-schema-form/widget/component/options/inline'],
        [schema, '/widget/inline'],
        [schema, '/widget/component/inline'],
        [schema, '/widget/component/options/inline'],
    ]) === true) {
        return controlType.slice(0, 5) === 'radio' ?
            'radios-inline' : 'checkboxes-inline';
    }
    else {
        return controlType;
    }
}
/**
 * 'isInputRequired' function
 *
 * Checks a JSON Schema to see if an item is required
 *
 * //   schema - the schema to check
 * //  { string } schemaPointer - the pointer to the item to check
 * // { boolean } - true if the item is required, false if not
 * @param {?} schema
 * @param {?} schemaPointer
 * @return {?}
 */
function isInputRequired(schema, schemaPointer) {
    if (!isObject(schema)) {
        console.error('isInputRequired error: Input schema must be an object.');
        return false;
    }
    /** @type {?} */
    const listPointerArray = JsonPointer.parse(schemaPointer);
    if (isArray(listPointerArray)) {
        if (!listPointerArray.length) {
            return schema.required === true;
        }
        /** @type {?} */
        const keyName = listPointerArray.pop();
        /** @type {?} */
        const nextToLastKey = listPointerArray[listPointerArray.length - 1];
        if (['properties', 'additionalProperties', 'patternProperties', 'items', 'additionalItems']
            .includes(nextToLastKey)) {
            listPointerArray.pop();
        }
        /** @type {?} */
        const parentSchema = JsonPointer.get(schema, listPointerArray) || {};
        if (isArray(parentSchema.required)) {
            return parentSchema.required.includes(keyName);
        }
        if (parentSchema.type === 'array') {
            return hasOwn(parentSchema, 'minItems') &&
                isNumber(keyName) &&
                +parentSchema.minItems > +keyName;
        }
    }
    return false;
}
/**
 * 'updateInputOptions' function
 *
 * //   layoutNode
 * //   schema
 * //   jsf
 * // { void }
 * @param {?} layoutNode
 * @param {?} schema
 * @param {?} jsf
 * @return {?}
 */
function updateInputOptions(layoutNode, schema, jsf) {
    if (!isObject(layoutNode) || !isObject(layoutNode.options)) {
        return;
    }
    // Set all option values in layoutNode.options
    /** @type {?} */
    const newOptions = {};
    /** @type {?} */
    const fixUiKeys = (/**
     * @param {?} key
     * @return {?}
     */
    key => key.slice(0, 3).toLowerCase() === 'ui:' ? key.slice(3) : key);
    mergeFilteredObject(newOptions, jsf.formOptions.defautWidgetOptions, [], fixUiKeys);
    [[JsonPointer.get(schema, '/ui:widget/options'), []],
        [JsonPointer.get(schema, '/ui:widget'), []],
        [schema, [
                'additionalProperties', 'additionalItems', 'properties', 'items',
                'required', 'type', 'x-schema-form', '$ref'
            ]],
        [JsonPointer.get(schema, '/x-schema-form/options'), []],
        [JsonPointer.get(schema, '/x-schema-form'), ['items', 'options']],
        [layoutNode, [
                '_id', '$ref', 'arrayItem', 'arrayItemType', 'dataPointer', 'dataType',
                'items', 'key', 'name', 'options', 'recursiveReference', 'type', 'widget'
            ]],
        [layoutNode.options, []],
    ].forEach((/**
     * @param {?} __0
     * @return {?}
     */
    ([object, excludeKeys]) => mergeFilteredObject(newOptions, object, excludeKeys, fixUiKeys)));
    if (!hasOwn(newOptions, 'titleMap')) {
        /** @type {?} */
        let newTitleMap = null;
        newTitleMap = getTitleMapFromOneOf(schema, newOptions.flatList);
        if (newTitleMap) {
            newOptions.titleMap = newTitleMap;
        }
        if (!hasOwn(newOptions, 'titleMap') && !hasOwn(newOptions, 'enum') && hasOwn(schema, 'items')) {
            if (JsonPointer.has(schema, '/items/titleMap')) {
                newOptions.titleMap = schema.items.titleMap;
            }
            else if (JsonPointer.has(schema, '/items/enum')) {
                newOptions.enum = schema.items.enum;
                if (!hasOwn(newOptions, 'enumNames') && JsonPointer.has(schema, '/items/enumNames')) {
                    newOptions.enumNames = schema.items.enumNames;
                }
            }
            else if (JsonPointer.has(schema, '/items/oneOf')) {
                newTitleMap = getTitleMapFromOneOf(schema.items, newOptions.flatList);
                if (newTitleMap) {
                    newOptions.titleMap = newTitleMap;
                }
            }
        }
    }
    // If schema type is integer, enforce by setting multipleOf = 1
    if (schema.type === 'integer' && !hasValue(newOptions.multipleOf)) {
        newOptions.multipleOf = 1;
    }
    // Copy any typeahead word lists to options.typeahead.source
    if (JsonPointer.has(newOptions, '/autocomplete/source')) {
        newOptions.typeahead = newOptions.autocomplete;
    }
    else if (JsonPointer.has(newOptions, '/tagsinput/source')) {
        newOptions.typeahead = newOptions.tagsinput;
    }
    else if (JsonPointer.has(newOptions, '/tagsinput/typeahead/source')) {
        newOptions.typeahead = newOptions.tagsinput.typeahead;
    }
    layoutNode.options = newOptions;
}
/**
 * 'getTitleMapFromOneOf' function
 *
 * //  { schema } schema
 * //  { boolean = null } flatList
 * //  { boolean = false } validateOnly
 * // { validators }
 * @param {?=} schema
 * @param {?=} flatList
 * @param {?=} validateOnly
 * @return {?}
 */
function getTitleMapFromOneOf(schema = {}, flatList = null, validateOnly = false) {
    /** @type {?} */
    let titleMap = null;
    /** @type {?} */
    const oneOf = schema.oneOf || schema.anyOf || null;
    if (isArray(oneOf) && oneOf.every((/**
     * @param {?} item
     * @return {?}
     */
    item => item.title))) {
        if (oneOf.every((/**
         * @param {?} item
         * @return {?}
         */
        item => isArray(item.enum) && item.enum.length === 1))) {
            if (validateOnly) {
                return true;
            }
            titleMap = oneOf.map((/**
             * @param {?} item
             * @return {?}
             */
            item => ({ name: item.title, value: item.enum[0] })));
        }
        else if (oneOf.every((/**
         * @param {?} item
         * @return {?}
         */
        item => item.const))) {
            if (validateOnly) {
                return true;
            }
            titleMap = oneOf.map((/**
             * @param {?} item
             * @return {?}
             */
            item => ({ name: item.title, value: item.const })));
        }
        // if flatList !== false and some items have colons, make grouped map
        if (flatList !== false && (titleMap || [])
            .filter((/**
         * @param {?} title
         * @return {?}
         */
        title => ((title || {}).name || '').indexOf(': '))).length > 1) {
            // Split name on first colon to create grouped map (name -> group: name)
            /** @type {?} */
            const newTitleMap = titleMap.map((/**
             * @param {?} title
             * @return {?}
             */
            title => {
                const [group, name] = title.name.split(/: (.+)/);
                return group && name ? Object.assign({}, title, { group, name }) : title;
            }));
            // If flatList === true or at least one group has multiple items, use grouped map
            if (flatList === true || newTitleMap.some((/**
             * @param {?} title
             * @param {?} index
             * @return {?}
             */
            (title, index) => index &&
                hasOwn(title, 'group') && title.group === newTitleMap[index - 1].group))) {
                titleMap = newTitleMap;
            }
        }
    }
    return validateOnly ? false : titleMap;
}
/**
 * 'getControlValidators' function
 *
 * //  schema
 * // { validators }
 * @param {?} schema
 * @return {?}
 */
function getControlValidators(schema) {
    if (!isObject(schema)) {
        return null;
    }
    /** @type {?} */
    const validators = {};
    if (hasOwn(schema, 'type')) {
        switch (schema.type) {
            case 'string':
                forEach(['pattern', 'format', 'minLength', 'maxLength'], (/**
                 * @param {?} prop
                 * @return {?}
                 */
                (prop) => {
                    if (hasOwn(schema, prop)) {
                        validators[prop] = [schema[prop]];
                    }
                }));
                break;
            case 'number':
            case 'integer':
                forEach(['Minimum', 'Maximum'], (/**
                 * @param {?} ucLimit
                 * @return {?}
                 */
                (ucLimit) => {
                    /** @type {?} */
                    const eLimit = 'exclusive' + ucLimit;
                    /** @type {?} */
                    const limit = ucLimit.toLowerCase();
                    if (hasOwn(schema, limit)) {
                        /** @type {?} */
                        const exclusive = hasOwn(schema, eLimit) && schema[eLimit] === true;
                        validators[limit] = [schema[limit], exclusive];
                    }
                }));
                forEach(['multipleOf', 'type'], (/**
                 * @param {?} prop
                 * @return {?}
                 */
                (prop) => {
                    if (hasOwn(schema, prop)) {
                        validators[prop] = [schema[prop]];
                    }
                }));
                break;
            case 'object':
                forEach(['minProperties', 'maxProperties', 'dependencies'], (/**
                 * @param {?} prop
                 * @return {?}
                 */
                (prop) => {
                    if (hasOwn(schema, prop)) {
                        validators[prop] = [schema[prop]];
                    }
                }));
                break;
            case 'array':
                forEach(['minItems', 'maxItems', 'uniqueItems'], (/**
                 * @param {?} prop
                 * @return {?}
                 */
                (prop) => {
                    if (hasOwn(schema, prop)) {
                        validators[prop] = [schema[prop]];
                    }
                }));
                break;
        }
    }
    if (hasOwn(schema, 'enum')) {
        validators.enum = [schema.enum];
    }
    return validators;
}
/**
 * 'resolveSchemaReferences' function
 *
 * Find all $ref links in schema and save links and referenced schemas in
 * schemaRefLibrary, schemaRecursiveRefMap, and dataRecursiveRefMap
 *
 * //  schema
 * //  schemaRefLibrary
 * // { Map<string, string> } schemaRecursiveRefMap
 * // { Map<string, string> } dataRecursiveRefMap
 * // { Map<string, number> } arrayMap
 * //
 * @param {?} schema
 * @param {?} schemaRefLibrary
 * @param {?} schemaRecursiveRefMap
 * @param {?} dataRecursiveRefMap
 * @param {?} arrayMap
 * @return {?}
 */
function resolveSchemaReferences(schema, schemaRefLibrary, schemaRecursiveRefMap, dataRecursiveRefMap, arrayMap) {
    if (!isObject(schema)) {
        console.error('resolveSchemaReferences error: schema must be an object.');
        return;
    }
    /** @type {?} */
    const refLinks = new Set();
    /** @type {?} */
    const refMapSet = new Set();
    /** @type {?} */
    const refMap = new Map();
    /** @type {?} */
    const recursiveRefMap = new Map();
    /** @type {?} */
    const refLibrary = {};
    // Search schema for all $ref links, and build full refLibrary
    JsonPointer.forEachDeep(schema, (/**
     * @param {?} subSchema
     * @param {?} subSchemaPointer
     * @return {?}
     */
    (subSchema, subSchemaPointer) => {
        if (hasOwn(subSchema, '$ref') && isString(subSchema['$ref'])) {
            /** @type {?} */
            const refPointer = JsonPointer.compile(subSchema['$ref']);
            refLinks.add(refPointer);
            refMapSet.add(subSchemaPointer + '~~' + refPointer);
            refMap.set(subSchemaPointer, refPointer);
        }
    }));
    refLinks.forEach((/**
     * @param {?} ref
     * @return {?}
     */
    ref => refLibrary[ref] = getSubSchema(schema, ref)));
    // Follow all ref links and save in refMapSet,
    // to find any multi-link recursive refernces
    /** @type {?} */
    let checkRefLinks = true;
    while (checkRefLinks) {
        checkRefLinks = false;
        Array.from(refMap).forEach((/**
         * @param {?} __0
         * @return {?}
         */
        ([fromRef1, toRef1]) => Array.from(refMap)
            .filter((/**
         * @param {?} __0
         * @return {?}
         */
        ([fromRef2, toRef2]) => JsonPointer.isSubPointer(toRef1, fromRef2, true) &&
            !JsonPointer.isSubPointer(toRef2, toRef1, true) &&
            !refMapSet.has(fromRef1 + fromRef2.slice(toRef1.length) + '~~' + toRef2)))
            .forEach((/**
         * @param {?} __0
         * @return {?}
         */
        ([fromRef2, toRef2]) => {
            refMapSet.add(fromRef1 + fromRef2.slice(toRef1.length) + '~~' + toRef2);
            checkRefLinks = true;
        }))));
    }
    // Build full recursiveRefMap
    // First pass - save all internally recursive refs from refMapSet
    Array.from(refMapSet)
        .map((/**
     * @param {?} refLink
     * @return {?}
     */
    refLink => refLink.split('~~')))
        .filter((/**
     * @param {?} __0
     * @return {?}
     */
    ([fromRef, toRef]) => JsonPointer.isSubPointer(toRef, fromRef)))
        .forEach((/**
     * @param {?} __0
     * @return {?}
     */
    ([fromRef, toRef]) => recursiveRefMap.set(fromRef, toRef)));
    // Second pass - create recursive versions of any other refs that link to recursive refs
    Array.from(refMap)
        .filter((/**
     * @param {?} __0
     * @return {?}
     */
    ([fromRef1, toRef1]) => Array.from(recursiveRefMap.keys())
        .every((/**
     * @param {?} fromRef2
     * @return {?}
     */
    fromRef2 => !JsonPointer.isSubPointer(fromRef1, fromRef2, true)))))
        .forEach((/**
     * @param {?} __0
     * @return {?}
     */
    ([fromRef1, toRef1]) => Array.from(recursiveRefMap)
        .filter((/**
     * @param {?} __0
     * @return {?}
     */
    ([fromRef2, toRef2]) => !recursiveRefMap.has(fromRef1 + fromRef2.slice(toRef1.length)) &&
        JsonPointer.isSubPointer(toRef1, fromRef2, true) &&
        !JsonPointer.isSubPointer(toRef1, fromRef1, true)))
        .forEach((/**
     * @param {?} __0
     * @return {?}
     */
    ([fromRef2, toRef2]) => recursiveRefMap.set(fromRef1 + fromRef2.slice(toRef1.length), fromRef1 + toRef2.slice(toRef1.length))))));
    // Create compiled schema by replacing all non-recursive $ref links with
    // thieir linked schemas and, where possible, combining schemas in allOf arrays.
    /** @type {?} */
    let compiledSchema = Object.assign({}, schema);
    delete compiledSchema.definitions;
    compiledSchema =
        getSubSchema(compiledSchema, '', refLibrary, recursiveRefMap);
    // Make sure all remaining schema $refs are recursive, and build final
    // schemaRefLibrary, schemaRecursiveRefMap, dataRecursiveRefMap, & arrayMap
    JsonPointer.forEachDeep(compiledSchema, (/**
     * @param {?} subSchema
     * @param {?} subSchemaPointer
     * @return {?}
     */
    (subSchema, subSchemaPointer) => {
        if (isString(subSchema['$ref'])) {
            /** @type {?} */
            let refPointer = JsonPointer.compile(subSchema['$ref']);
            if (!JsonPointer.isSubPointer(refPointer, subSchemaPointer, true)) {
                refPointer = removeRecursiveReferences(subSchemaPointer, recursiveRefMap);
                JsonPointer.set(compiledSchema, subSchemaPointer, { $ref: `#${refPointer}` });
            }
            if (!hasOwn(schemaRefLibrary, 'refPointer')) {
                schemaRefLibrary[refPointer] = !refPointer.length ? compiledSchema :
                    getSubSchema(compiledSchema, refPointer, schemaRefLibrary, recursiveRefMap);
            }
            if (!schemaRecursiveRefMap.has(subSchemaPointer)) {
                schemaRecursiveRefMap.set(subSchemaPointer, refPointer);
            }
            /** @type {?} */
            const fromDataRef = JsonPointer.toDataPointer(subSchemaPointer, compiledSchema);
            if (!dataRecursiveRefMap.has(fromDataRef)) {
                /** @type {?} */
                const toDataRef = JsonPointer.toDataPointer(refPointer, compiledSchema);
                dataRecursiveRefMap.set(fromDataRef, toDataRef);
            }
        }
        if (subSchema.type === 'array' &&
            (hasOwn(subSchema, 'items') || hasOwn(subSchema, 'additionalItems'))) {
            /** @type {?} */
            const dataPointer = JsonPointer.toDataPointer(subSchemaPointer, compiledSchema);
            if (!arrayMap.has(dataPointer)) {
                /** @type {?} */
                const tupleItems = isArray(subSchema.items) ? subSchema.items.length : 0;
                arrayMap.set(dataPointer, tupleItems);
            }
        }
    }), true);
    return compiledSchema;
}
/**
 * 'getSubSchema' function
 *
 * //   schema
 * //  { Pointer } pointer
 * //  { object } schemaRefLibrary
 * //  { Map<string, string> } schemaRecursiveRefMap
 * //  { string[] = [] } usedPointers
 * //
 * @param {?} schema
 * @param {?} pointer
 * @param {?=} schemaRefLibrary
 * @param {?=} schemaRecursiveRefMap
 * @param {?=} usedPointers
 * @return {?}
 */
function getSubSchema(schema, pointer, schemaRefLibrary = null, schemaRecursiveRefMap = null, usedPointers = []) {
    if (!schemaRefLibrary || !schemaRecursiveRefMap) {
        return JsonPointer.getCopy(schema, pointer);
    }
    if (typeof pointer !== 'string') {
        pointer = JsonPointer.compile(pointer);
    }
    usedPointers = [...usedPointers, pointer];
    /** @type {?} */
    let newSchema = null;
    if (pointer === '') {
        newSchema = cloneDeep(schema);
    }
    else {
        /** @type {?} */
        const shortPointer = removeRecursiveReferences(pointer, schemaRecursiveRefMap);
        if (shortPointer !== pointer) {
            usedPointers = [...usedPointers, shortPointer];
        }
        newSchema = JsonPointer.getFirstCopy([
            [schemaRefLibrary, [shortPointer]],
            [schema, pointer],
            [schema, shortPointer]
        ]);
    }
    return JsonPointer.forEachDeepCopy(newSchema, (/**
     * @param {?} subSchema
     * @param {?} subPointer
     * @return {?}
     */
    (subSchema, subPointer) => {
        if (isObject(subSchema)) {
            // Replace non-recursive $ref links with referenced schemas
            if (isString(subSchema.$ref)) {
                /** @type {?} */
                const refPointer = JsonPointer.compile(subSchema.$ref);
                if (refPointer.length && usedPointers.every((/**
                 * @param {?} ptr
                 * @return {?}
                 */
                ptr => !JsonPointer.isSubPointer(refPointer, ptr, true)))) {
                    /** @type {?} */
                    const refSchema = getSubSchema(schema, refPointer, schemaRefLibrary, schemaRecursiveRefMap, usedPointers);
                    if (Object.keys(subSchema).length === 1) {
                        return refSchema;
                    }
                    else {
                        /** @type {?} */
                        const extraKeys = Object.assign({}, subSchema);
                        delete extraKeys.$ref;
                        return mergeSchemas(refSchema, extraKeys);
                    }
                }
            }
            // TODO: Convert schemas with 'type' arrays to 'oneOf'
            // Combine allOf subSchemas
            if (isArray(subSchema.allOf)) {
                return combineAllOf(subSchema);
            }
            // Fix incorrectly placed array object required lists
            if (subSchema.type === 'array' && isArray(subSchema.required)) {
                return fixRequiredArrayProperties(subSchema);
            }
        }
        return subSchema;
    }), true, (/** @type {?} */ (pointer)));
}
/**
 * 'combineAllOf' function
 *
 * Attempt to convert an allOf schema object into
 * a non-allOf schema object with equivalent rules.
 *
 * //   schema - allOf schema object
 * //  - converted schema object
 * @param {?} schema
 * @return {?}
 */
function combineAllOf(schema) {
    if (!isObject(schema) || !isArray(schema.allOf)) {
        return schema;
    }
    /** @type {?} */
    let mergedSchema = mergeSchemas(...schema.allOf);
    if (Object.keys(schema).length > 1) {
        /** @type {?} */
        const extraKeys = Object.assign({}, schema);
        delete extraKeys.allOf;
        mergedSchema = mergeSchemas(mergedSchema, extraKeys);
    }
    return mergedSchema;
}
/**
 * 'fixRequiredArrayProperties' function
 *
 * Fixes an incorrectly placed required list inside an array schema, by moving
 * it into items.properties or additionalItems.properties, where it belongs.
 *
 * //   schema - allOf schema object
 * //  - converted schema object
 * @param {?} schema
 * @return {?}
 */
function fixRequiredArrayProperties(schema) {
    if (schema.type === 'array' && isArray(schema.required)) {
        /** @type {?} */
        const itemsObject = hasOwn(schema.items, 'properties') ? 'items' :
            hasOwn(schema.additionalItems, 'properties') ? 'additionalItems' : null;
        if (itemsObject && !hasOwn(schema[itemsObject], 'required') && (hasOwn(schema[itemsObject], 'additionalProperties') ||
            schema.required.every((/**
             * @param {?} key
             * @return {?}
             */
            key => hasOwn(schema[itemsObject].properties, key))))) {
            schema = cloneDeep(schema);
            schema[itemsObject].required = schema.required;
            delete schema.required;
        }
    }
    return schema;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * FormGroup function library:
 *
 * buildFormGroupTemplate:  Builds a FormGroupTemplate from schema
 *
 * buildFormGroup:          Builds an Angular FormGroup from a FormGroupTemplate
 *
 * mergeValues:
 *
 * setRequiredFields:
 *
 * formatFormData:
 *
 * getControl:
 *
 * ---- TODO: ----
 * TODO: add buildFormGroupTemplateFromLayout function
 * buildFormGroupTemplateFromLayout: Builds a FormGroupTemplate from a form layout
 */
/**
 * 'buildFormGroupTemplate' function
 *
 * Builds a template for an Angular FormGroup from a JSON Schema.
 *
 * TODO: add support for pattern properties
 * https://spacetelescope.github.io/understanding-json-schema/reference/object.html
 *
 * //  {any} jsf -
 * //  {any = null} nodeValue -
 * //  {boolean = true} mapArrays -
 * //  {string = ''} schemaPointer -
 * //  {string = ''} dataPointer -
 * //  {any = ''} templatePointer -
 * // {any} -
 * @param {?} jsf
 * @param {?=} nodeValue
 * @param {?=} setValues
 * @param {?=} schemaPointer
 * @param {?=} dataPointer
 * @param {?=} templatePointer
 * @return {?}
 */
function buildFormGroupTemplate(jsf, nodeValue = null, setValues = true, schemaPointer = "", dataPointer = "", templatePointer = "") {
    /** @type {?} */
    const schema = JsonPointer.get(jsf.schema, schemaPointer);
    if (setValues) {
        if (!isDefined(nodeValue) &&
            (jsf.formOptions.setSchemaDefaults === true ||
                (jsf.formOptions.setSchemaDefaults === "auto" &&
                    isEmpty(jsf.formValues)))) {
            nodeValue = JsonPointer.get(jsf.schema, schemaPointer + "/default");
        }
    }
    else {
        nodeValue = null;
    }
    // TODO: If nodeValue still not set, check layout for default value
    /** @type {?} */
    const schemaType = JsonPointer.get(schema, "/type");
    /** @type {?} */
    const controlType = (hasOwn(schema, "properties") || hasOwn(schema, "additionalProperties")) &&
        schemaType === "object"
        ? "FormGroup"
        : (hasOwn(schema, "items") || hasOwn(schema, "additionalItems")) &&
            schemaType === "array"
            ? "FormArray"
            : !schemaType && hasOwn(schema, "$ref")
                ? "$ref"
                : "FormControl";
    /** @type {?} */
    const shortDataPointer = removeRecursiveReferences(dataPointer, jsf.dataRecursiveRefMap, jsf.arrayMap);
    if (!jsf.dataMap.has(shortDataPointer)) {
        jsf.dataMap.set(shortDataPointer, new Map());
    }
    /** @type {?} */
    const nodeOptions = jsf.dataMap.get(shortDataPointer);
    if (!nodeOptions.has("schemaType")) {
        nodeOptions.set("schemaPointer", schemaPointer);
        nodeOptions.set("schemaType", schema.type);
        if (schema.format) {
            nodeOptions.set("schemaFormat", schema.format);
            if (!schema.type) {
                nodeOptions.set("schemaType", "string");
            }
        }
        if (controlType) {
            nodeOptions.set("templatePointer", templatePointer);
            nodeOptions.set("templateType", controlType);
        }
    }
    /** @type {?} */
    let controls;
    /** @type {?} */
    const validators = getControlValidators(schema);
    switch (controlType) {
        case "FormGroup":
            controls = {};
            if (hasOwn(schema, "ui:order") || hasOwn(schema, "properties")) {
                /** @type {?} */
                const propertyKeys = schema["ui:order"] || Object.keys(schema.properties);
                if (propertyKeys.includes("*") && !hasOwn(schema.properties, "*")) {
                    /** @type {?} */
                    const unnamedKeys = Object.keys(schema.properties).filter((/**
                     * @param {?} key
                     * @return {?}
                     */
                    (key) => !propertyKeys.includes(key)));
                    for (let i = propertyKeys.length - 1; i >= 0; i--) {
                        if (propertyKeys[i] === "*") {
                            propertyKeys.splice(i, 1, ...unnamedKeys);
                        }
                    }
                }
                propertyKeys
                    .filter((/**
                 * @param {?} key
                 * @return {?}
                 */
                (key) => hasOwn(schema.properties, key) ||
                    hasOwn(schema, "additionalProperties")))
                    .forEach((/**
                 * @param {?} key
                 * @return {?}
                 */
                (key) => (controls[key] = buildFormGroupTemplate(jsf, JsonPointer.get(nodeValue, [(/** @type {?} */ (key))]), setValues, schemaPointer +
                    (hasOwn(schema.properties, key)
                        ? "/properties/" + key
                        : "/additionalProperties"), dataPointer + "/" + key, templatePointer + "/controls/" + key))));
                jsf.formOptions.fieldsRequired = setRequiredFields(schema, controls);
            }
            return { controlType, controls, validators };
        case "FormArray":
            controls = [];
            /** @type {?} */
            const minItems = Math.max(schema.minItems || 0, nodeOptions.get("minItems") || 0);
            /** @type {?} */
            const maxItems = Math.min(schema.maxItems || 1000, nodeOptions.get("maxItems") || 1000);
            /** @type {?} */
            let additionalItemsPointer = null;
            if (isArray(schema.items)) {
                // 'items' is an array = tuple items
                /** @type {?} */
                const tupleItems = nodeOptions.get("tupleItems") ||
                    (isArray(schema.items) ? Math.min(schema.items.length, maxItems) : 0);
                for (let i = 0; i < tupleItems; i++) {
                    if (i < minItems) {
                        controls.push(buildFormGroupTemplate(jsf, isArray(nodeValue) ? nodeValue[i] : nodeValue, setValues, schemaPointer + "/items/" + i, dataPointer + "/" + i, templatePointer + "/controls/" + i));
                    }
                    else {
                        /** @type {?} */
                        const schemaRefPointer = removeRecursiveReferences(schemaPointer + "/items/" + i, jsf.schemaRecursiveRefMap);
                        /** @type {?} */
                        const itemRefPointer = removeRecursiveReferences(shortDataPointer + "/" + i, jsf.dataRecursiveRefMap, jsf.arrayMap);
                        /** @type {?} */
                        const itemRecursive = itemRefPointer !== shortDataPointer + "/" + i;
                        if (!hasOwn(jsf.templateRefLibrary, itemRefPointer)) {
                            jsf.templateRefLibrary[itemRefPointer] = null;
                            jsf.templateRefLibrary[itemRefPointer] = buildFormGroupTemplate(jsf, null, setValues, schemaRefPointer, itemRefPointer, templatePointer + "/controls/" + i);
                        }
                        controls.push(isArray(nodeValue)
                            ? buildFormGroupTemplate(jsf, nodeValue[i], setValues, schemaPointer + "/items/" + i, dataPointer + "/" + i, templatePointer + "/controls/" + i)
                            : itemRecursive
                                ? null
                                : cloneDeep(jsf.templateRefLibrary[itemRefPointer]));
                    }
                }
                // If 'additionalItems' is an object = additional list items (after tuple items)
                if (schema.items.length < maxItems &&
                    isObject(schema.additionalItems)) {
                    additionalItemsPointer = schemaPointer + "/additionalItems";
                }
                // If 'items' is an object = list items only (no tuple items)
            }
            else {
                additionalItemsPointer = schemaPointer + "/items";
            }
            if (additionalItemsPointer) {
                /** @type {?} */
                const schemaRefPointer = removeRecursiveReferences(additionalItemsPointer, jsf.schemaRecursiveRefMap);
                /** @type {?} */
                const itemRefPointer = removeRecursiveReferences(shortDataPointer + "/-", jsf.dataRecursiveRefMap, jsf.arrayMap);
                /** @type {?} */
                const itemRecursive = itemRefPointer !== shortDataPointer + "/-";
                if (!hasOwn(jsf.templateRefLibrary, itemRefPointer)) {
                    jsf.templateRefLibrary[itemRefPointer] = null;
                    jsf.templateRefLibrary[itemRefPointer] = buildFormGroupTemplate(jsf, null, setValues, schemaRefPointer, itemRefPointer, templatePointer + "/controls/-");
                }
                // const itemOptions = jsf.dataMap.get(itemRefPointer) || new Map();
                /** @type {?} */
                const itemOptions = nodeOptions;
                if (!itemRecursive || hasOwn(validators, "required")) {
                    /** @type {?} */
                    const arrayLength = Math.min(Math.max(itemRecursive
                        ? 0
                        : itemOptions.get("tupleItems") +
                            itemOptions.get("listItems") || 0, isArray(nodeValue) ? nodeValue.length : 0), maxItems);
                    for (let i = controls.length; i < arrayLength; i++) {
                        controls.push(isArray(nodeValue)
                            ? buildFormGroupTemplate(jsf, nodeValue[i], setValues, schemaRefPointer, dataPointer + "/-", templatePointer + "/controls/-")
                            : itemRecursive
                                ? null
                                : cloneDeep(jsf.templateRefLibrary[itemRefPointer]));
                    }
                }
            }
            return { controlType, controls, validators };
        case "$ref":
            /** @type {?} */
            const schemaRef = JsonPointer.compile(schema.$ref);
            /** @type {?} */
            const dataRef = JsonPointer.toDataPointer(schemaRef, schema);
            /** @type {?} */
            const refPointer = removeRecursiveReferences(dataRef, jsf.dataRecursiveRefMap, jsf.arrayMap);
            if (refPointer && !hasOwn(jsf.templateRefLibrary, refPointer)) {
                // Set to null first to prevent recursive reference from causing endless loop
                jsf.templateRefLibrary[refPointer] = null;
                /** @type {?} */
                const newTemplate = buildFormGroupTemplate(jsf, setValues, setValues, schemaRef);
                if (newTemplate) {
                    jsf.templateRefLibrary[refPointer] = newTemplate;
                }
                else {
                    delete jsf.templateRefLibrary[refPointer];
                }
            }
            return null;
        case "FormControl":
            /** @type {?} */
            const value = {
                value: setValues && isPrimitive(nodeValue) ? nodeValue : null,
                disabled: nodeOptions.get("disabled") || false,
            };
            return { controlType, value, validators };
        default:
            return null;
    }
}
/**
 * 'buildFormGroup' function
 *
 * // {any} template -
 * // {AbstractControl}
 * @param {?} template
 * @return {?}
 */
function buildFormGroup(template) {
    /** @type {?} */
    const validatorFns = [];
    /** @type {?} */
    let validatorFn = null;
    // if (hasOwn(template, "validators")) {
    //   forEach(template.validators, (parameters, validator) => {
    //     if (typeof JsonValidators[validator] === "function") {
    //       validatorFns.push(JsonValidators[validator].apply(null, parameters));
    //     }
    //   });
    //   if (
    //     validatorFns.length &&
    //     inArray(template.controlType, ["FormGroup", "FormArray"])
    //   ) {
    //     validatorFn =
    //       validatorFns.length > 1
    //         ? JsonValidators.compose(validatorFns)
    //         : validatorFns[0];
    //   }
    // }
    if (hasOwn(template, "controlType")) {
        switch (template.controlType) {
            case "FormGroup":
                /** @type {?} */
                const groupControls = {};
                forEach(template.controls, (/**
                 * @param {?} controls
                 * @param {?} key
                 * @return {?}
                 */
                (controls, key) => {
                    /** @type {?} */
                    const newControl = buildFormGroup(controls);
                    if (newControl) {
                        groupControls[key] = newControl;
                    }
                }));
                return new FormGroup(groupControls, validatorFn);
            case "FormArray":
                return new FormArray(filter(map$1(template.controls, (/**
                 * @param {?} controls
                 * @return {?}
                 */
                (controls) => buildFormGroup(controls)))), validatorFn);
            case "FormControl":
                return new FormControl(template.value, validatorFns);
        }
    }
    return null;
}
/**
 * 'mergeValues' function
 *
 * //  {any[]} ...valuesToMerge - Multiple values to merge
 * // {any} - Merged values
 * @param {...?} valuesToMerge
 * @return {?}
 */
function mergeValues(...valuesToMerge) {
    /** @type {?} */
    let mergedValues = null;
    for (const currentValue of valuesToMerge) {
        if (!isEmpty(currentValue)) {
            if (typeof currentValue === "object" &&
                (isEmpty(mergedValues) || typeof mergedValues !== "object")) {
                if (isArray(currentValue)) {
                    mergedValues = [...currentValue];
                }
                else if (isObject(currentValue)) {
                    mergedValues = Object.assign({}, currentValue);
                }
            }
            else if (typeof currentValue !== "object") {
                mergedValues = currentValue;
            }
            else if (isObject(mergedValues) && isObject(currentValue)) {
                Object.assign(mergedValues, currentValue);
            }
            else if (isObject(mergedValues) && isArray(currentValue)) {
                /** @type {?} */
                const newValues = [];
                for (const value of currentValue) {
                    newValues.push(mergeValues(mergedValues, value));
                }
                mergedValues = newValues;
            }
            else if (isArray(mergedValues) && isObject(currentValue)) {
                /** @type {?} */
                const newValues = [];
                for (const value of mergedValues) {
                    newValues.push(mergeValues(value, currentValue));
                }
                mergedValues = newValues;
            }
            else if (isArray(mergedValues) && isArray(currentValue)) {
                /** @type {?} */
                const newValues = [];
                for (let i = 0; i < Math.max(mergedValues.length, currentValue.length); i++) {
                    if (i < mergedValues.length && i < currentValue.length) {
                        newValues.push(mergeValues(mergedValues[i], currentValue[i]));
                    }
                    else if (i < mergedValues.length) {
                        newValues.push(mergedValues[i]);
                    }
                    else if (i < currentValue.length) {
                        newValues.push(currentValue[i]);
                    }
                }
                mergedValues = newValues;
            }
        }
    }
    return mergedValues;
}
/**
 * 'setRequiredFields' function
 *
 * // {schema} schema - JSON Schema
 * // {object} formControlTemplate - Form Control Template object
 * // {boolean} - true if any fields have been set to required, false if not
 * @param {?} schema
 * @param {?} formControlTemplate
 * @return {?}
 */
function setRequiredFields(schema, formControlTemplate) {
    /** @type {?} */
    let fieldsRequired = false;
    if (hasOwn(schema, "required") && !isEmpty(schema.required)) {
        fieldsRequired = true;
        /** @type {?} */
        let requiredArray = isArray(schema.required)
            ? schema.required
            : [schema.required];
        requiredArray = forEach(requiredArray, (/**
         * @param {?} key
         * @return {?}
         */
        (key) => JsonPointer.set(formControlTemplate, "/" + key + "/validators/required", [])));
    }
    return fieldsRequired;
    // TODO: Add support for patternProperties
    // https://spacetelescope.github.io/understanding-json-schema/reference/object.html#pattern-properties
}
/**
 * 'formatFormData' function
 *
 * // {any} formData - Angular FormGroup data object
 * // {Map<string, any>} dataMap -
 * // {Map<string, string>} recursiveRefMap -
 * // {Map<string, number>} arrayMap -
 * // {boolean = false} fixErrors - if TRUE, tries to fix data
 * // {any} - formatted data object
 * @param {?} formData
 * @param {?} dataMap
 * @param {?} recursiveRefMap
 * @param {?} arrayMap
 * @param {?=} returnEmptyFields
 * @param {?=} fixErrors
 * @return {?}
 */
function formatFormData(formData, dataMap, recursiveRefMap, arrayMap, returnEmptyFields = false, fixErrors = false) {
    if (formData === null || typeof formData !== "object") {
        return formData;
    }
    /** @type {?} */
    const formattedData = isArray(formData) ? [] : {};
    JsonPointer.forEachDeep(formData, (/**
     * @param {?} value
     * @param {?} dataPointer
     * @return {?}
     */
    (value, dataPointer) => {
        // If returnEmptyFields === true,
        // add empty arrays and objects to all allowed keys
        if (returnEmptyFields && isArray(value)) {
            JsonPointer.set(formattedData, dataPointer, []);
        }
        else if (returnEmptyFields && isObject(value) && !isDate(value)) {
            JsonPointer.set(formattedData, dataPointer, {});
        }
        else {
            /** @type {?} */
            const genericPointer = JsonPointer.has(dataMap, [
                dataPointer,
                "schemaType",
            ])
                ? dataPointer
                : removeRecursiveReferences(dataPointer, recursiveRefMap, arrayMap);
            if (JsonPointer.has(dataMap, [genericPointer, "schemaType"])) {
                /** @type {?} */
                const schemaType = dataMap
                    .get(genericPointer)
                    .get("schemaType");
                if (schemaType === "null") {
                    JsonPointer.set(formattedData, dataPointer, null);
                }
                else if ((hasValue(value) || returnEmptyFields) &&
                    inArray(schemaType, ["string", "integer", "number", "boolean"])) {
                    /** @type {?} */
                    const newValue = fixErrors || (value === null && returnEmptyFields)
                        ? toSchemaType(value, schemaType)
                        : toJavaScriptType(value, schemaType);
                    if (isDefined(newValue) || returnEmptyFields) {
                        JsonPointer.set(formattedData, dataPointer, newValue);
                    }
                    // If returnEmptyFields === false,
                    // only add empty arrays and objects to required keys
                }
                else if (schemaType === "object" && !returnEmptyFields) {
                    (dataMap.get(genericPointer).get("required") || []).forEach((/**
                     * @param {?} key
                     * @return {?}
                     */
                    (key) => {
                        /** @type {?} */
                        const keySchemaType = dataMap
                            .get(`${genericPointer}/${key}`)
                            .get("schemaType");
                        if (keySchemaType === "array") {
                            JsonPointer.set(formattedData, `${dataPointer}/${key}`, []);
                        }
                        else if (keySchemaType === "object") {
                            JsonPointer.set(formattedData, `${dataPointer}/${key}`, {});
                        }
                    }));
                }
                // Finish incomplete 'date-time' entries
                if (dataMap.get(genericPointer).get("schemaFormat") === "date-time") {
                    // "2000-03-14T01:59:26.535" -> "2000-03-14T01:59:26.535Z" (add "Z")
                    if (/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s][0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?$/i.test(value)) {
                        JsonPointer.set(formattedData, dataPointer, `${value}Z`);
                        // "2000-03-14T01:59" -> "2000-03-14T01:59:00Z" (add ":00Z")
                    }
                    else if (/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s][0-2]\d:[0-5]\d$/i.test(value)) {
                        JsonPointer.set(formattedData, dataPointer, `${value}:00Z`);
                        // "2000-03-14" -> "2000-03-14T00:00:00Z" (add "T00:00:00Z")
                    }
                    else if (fixErrors && /^\d\d\d\d-[0-1]\d-[0-3]\d$/i.test(value)) {
                        JsonPointer.set(formattedData, dataPointer, `${value}:00:00:00Z`);
                    }
                }
            }
            else if (typeof value !== "object" ||
                isDate(value) ||
                (value === null && returnEmptyFields)) {
                console.error("formatFormData error: " +
                    `Schema type not found for form value at ${genericPointer}`);
                console.error("dataMap", dataMap);
                console.error("recursiveRefMap", recursiveRefMap);
                console.error("genericPointer", genericPointer);
            }
        }
    }));
    return formattedData;
}
/**
 * 'getControl' function
 *
 * Uses a JSON Pointer for a data object to retrieve a control from
 * an Angular formGroup or formGroup template. (Note: though a formGroup
 * template is much simpler, its basic structure is idential to a formGroup).
 *
 * If the optional third parameter 'returnGroup' is set to TRUE, the group
 * containing the control is returned, rather than the control itself.
 *
 * // {FormGroup} formGroup - Angular FormGroup to get value from
 * // {Pointer} dataPointer - JSON Pointer (string or array)
 * // {boolean = false} returnGroup - If true, return group containing control
 * // {group} - Located value (or null, if no control found)
 * @param {?} formGroup
 * @param {?} dataPointer
 * @param {?=} returnGroup
 * @return {?}
 */
function getControl(formGroup, dataPointer, returnGroup = false) {
    if (!isObject(formGroup) || !JsonPointer.isJsonPointer(dataPointer)) {
        if (!JsonPointer.isJsonPointer(dataPointer)) {
            // If dataPointer input is not a valid JSON pointer, check to
            // see if it is instead a valid object path, using dot notaion
            if (typeof dataPointer === "string") {
                /** @type {?} */
                const formControl = formGroup.get(dataPointer);
                if (formControl) {
                    return formControl;
                }
            }
            console.error(`getControl error: Invalid JSON Pointer: ${dataPointer}`);
        }
        if (!isObject(formGroup)) {
            console.error(`getControl error: Invalid formGroup: ${formGroup}`);
        }
        return null;
    }
    /** @type {?} */
    let dataPointerArray = JsonPointer.parse(dataPointer);
    if (returnGroup) {
        dataPointerArray = dataPointerArray.slice(0, -1);
    }
    // If formGroup input is a real formGroup (not a formGroup template)
    // try using formGroup.get() to return the control
    if (typeof formGroup.get === "function" &&
        dataPointerArray.every((/**
         * @param {?} key
         * @return {?}
         */
        (key) => key.indexOf(".") === -1))) {
        /** @type {?} */
        const formControl = formGroup.get(dataPointerArray.join("."));
        if (formControl) {
            return formControl;
        }
    }
    // If formGroup input is a formGroup template,
    // or formGroup.get() failed to return the control,
    // search the formGroup object for dataPointer's control
    /** @type {?} */
    let subGroup = formGroup;
    for (const key of dataPointerArray) {
        if (hasOwn(subGroup, "controls")) {
            subGroup = subGroup.controls;
        }
        if (isArray(subGroup) && key === "-") {
            subGroup = subGroup[subGroup.length - 1];
        }
        else if (hasOwn(subGroup, key)) {
            subGroup = subGroup[key];
        }
        else {
            console.error(`getControl error: Unable to find "${key}" item in FormGroup.`);
            console.error(dataPointer);
            console.error(formGroup);
            return;
        }
    }
    return subGroup;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Layout function library:
 *
 * buildLayout:            Builds a complete layout from an input layout and schema
 *
 * buildLayoutFromSchema:  Builds a complete layout entirely from an input schema
 *
 * mapLayout:
 *
 * getLayoutNode:
 *
 * buildTitleMap:
 */
/**
 * 'buildLayout' function
 *
 * //   jsf
 * //   widgetLibrary
 * //
 * @param {?} jsf
 * @param {?} widgetLibrary
 * @return {?}
 */
function buildLayout(jsf, widgetLibrary) {
    /** @type {?} */
    let hasSubmitButton = !JsonPointer.get(jsf, '/formOptions/addSubmit');
    /** @type {?} */
    const formLayout = mapLayout(jsf.layout, (/**
     * @param {?} layoutItem
     * @param {?} index
     * @param {?} layoutPointer
     * @return {?}
     */
    (layoutItem, index, layoutPointer) => {
        /** @type {?} */
        const newNode = {
            _id: uniqueId(),
            options: {},
        };
        if (isObject(layoutItem)) {
            Object.assign(newNode, layoutItem);
            Object.keys(newNode)
                .filter((/**
             * @param {?} option
             * @return {?}
             */
            option => !inArray(option, [
                '_id', '$ref', 'arrayItem', 'arrayItemType', 'dataPointer', 'dataType',
                'items', 'key', 'name', 'options', 'recursiveReference', 'type', 'widget'
            ])))
                .forEach((/**
             * @param {?} option
             * @return {?}
             */
            option => {
                newNode.options[option] = newNode[option];
                delete newNode[option];
            }));
            if (!hasOwn(newNode, 'type') && isString(newNode.widget)) {
                newNode.type = newNode.widget;
                delete newNode.widget;
            }
            if (!hasOwn(newNode.options, 'title')) {
                if (hasOwn(newNode.options, 'legend')) {
                    newNode.options.title = newNode.options.legend;
                    delete newNode.options.legend;
                }
            }
            if (!hasOwn(newNode.options, 'validationMessages')) {
                if (hasOwn(newNode.options, 'errorMessages')) {
                    newNode.options.validationMessages = newNode.options.errorMessages;
                    delete newNode.options.errorMessages;
                    // Convert Angular Schema Form (AngularJS) 'validationMessage' to
                    // Angular JSON Schema Form 'validationMessages'
                    // TV4 codes from https://github.com/geraintluff/tv4/blob/master/source/api.js
                }
                else if (hasOwn(newNode.options, 'validationMessage')) {
                    if (typeof newNode.options.validationMessage === 'string') {
                        newNode.options.validationMessages = newNode.options.validationMessage;
                    }
                    else {
                        newNode.options.validationMessages = {};
                        Object.keys(newNode.options.validationMessage).forEach((/**
                         * @param {?} key
                         * @return {?}
                         */
                        key => {
                            /** @type {?} */
                            const code = key + '';
                            /** @type {?} */
                            const newKey = code === '0' ? 'type' :
                                code === '1' ? 'enum' :
                                    code === '100' ? 'multipleOf' :
                                        code === '101' ? 'minimum' :
                                            code === '102' ? 'exclusiveMinimum' :
                                                code === '103' ? 'maximum' :
                                                    code === '104' ? 'exclusiveMaximum' :
                                                        code === '200' ? 'minLength' :
                                                            code === '201' ? 'maxLength' :
                                                                code === '202' ? 'pattern' :
                                                                    code === '300' ? 'minProperties' :
                                                                        code === '301' ? 'maxProperties' :
                                                                            code === '302' ? 'required' :
                                                                                code === '304' ? 'dependencies' :
                                                                                    code === '400' ? 'minItems' :
                                                                                        code === '401' ? 'maxItems' :
                                                                                            code === '402' ? 'uniqueItems' :
                                                                                                code === '500' ? 'format' : code + '';
                            newNode.options.validationMessages[newKey] = newNode.options.validationMessage[key];
                        }));
                    }
                    delete newNode.options.validationMessage;
                }
            }
        }
        else if (JsonPointer.isJsonPointer(layoutItem)) {
            newNode.dataPointer = layoutItem;
        }
        else if (isString(layoutItem)) {
            newNode.key = layoutItem;
        }
        else {
            console.error('buildLayout error: Form layout element not recognized:');
            console.error(layoutItem);
            return null;
        }
        /** @type {?} */
        let nodeSchema = null;
        // If newNode does not have a dataPointer, try to find an equivalent
        if (!hasOwn(newNode, 'dataPointer')) {
            // If newNode has a key, change it to a dataPointer
            if (hasOwn(newNode, 'key')) {
                newNode.dataPointer = newNode.key === '*' ? newNode.key :
                    JsonPointer.compile(JsonPointer.parseObjectPath(newNode.key), '-');
                delete newNode.key;
                // If newNode is an array, search for dataPointer in child nodes
            }
            else if (hasOwn(newNode, 'type') && newNode.type.slice(-5) === 'array') {
                /** @type {?} */
                const findDataPointer = (/**
                 * @param {?} items
                 * @return {?}
                 */
                (items) => {
                    if (items === null || typeof items !== 'object') {
                        return;
                    }
                    if (hasOwn(items, 'dataPointer')) {
                        return items.dataPointer;
                    }
                    if (isArray(items.items)) {
                        for (const item of items.items) {
                            if (hasOwn(item, 'dataPointer') && item.dataPointer.indexOf('/-') !== -1) {
                                return item.dataPointer;
                            }
                            if (hasOwn(item, 'items')) {
                                /** @type {?} */
                                const searchItem = findDataPointer(item);
                                if (searchItem) {
                                    return searchItem;
                                }
                            }
                        }
                    }
                });
                /** @type {?} */
                const childDataPointer = findDataPointer(newNode);
                if (childDataPointer) {
                    newNode.dataPointer =
                        childDataPointer.slice(0, childDataPointer.lastIndexOf('/-'));
                }
            }
        }
        if (hasOwn(newNode, 'dataPointer')) {
            if (newNode.dataPointer === '*') {
                return buildLayoutFromSchema(jsf, widgetLibrary, jsf.formValues);
            }
            /** @type {?} */
            const nodeValue = JsonPointer.get(jsf.formValues, newNode.dataPointer.replace(/\/-/g, '/1'));
            // TODO: Create function getFormValues(jsf, dataPointer, forRefLibrary)
            // check formOptions.setSchemaDefaults and formOptions.setLayoutDefaults
            // then set apropriate values from initialVaues, schema, or layout
            newNode.dataPointer =
                JsonPointer.toGenericPointer(newNode.dataPointer, jsf.arrayMap);
            /** @type {?} */
            const LastKey = JsonPointer.toKey(newNode.dataPointer);
            if (!newNode.name && isString(LastKey) && LastKey !== '-') {
                newNode.name = LastKey;
            }
            /** @type {?} */
            const shortDataPointer = removeRecursiveReferences(newNode.dataPointer, jsf.dataRecursiveRefMap, jsf.arrayMap);
            /** @type {?} */
            const recursive = !shortDataPointer.length ||
                shortDataPointer !== newNode.dataPointer;
            /** @type {?} */
            let schemaPointer;
            if (!jsf.dataMap.has(shortDataPointer)) {
                jsf.dataMap.set(shortDataPointer, new Map());
            }
            /** @type {?} */
            const nodeDataMap = jsf.dataMap.get(shortDataPointer);
            if (nodeDataMap.has('schemaPointer')) {
                schemaPointer = nodeDataMap.get('schemaPointer');
            }
            else {
                schemaPointer = JsonPointer.toSchemaPointer(shortDataPointer, jsf.schema);
                nodeDataMap.set('schemaPointer', schemaPointer);
            }
            nodeDataMap.set('disabled', !!newNode.options.disabled);
            nodeSchema = JsonPointer.get(jsf.schema, schemaPointer);
            if (nodeSchema) {
                if (!hasOwn(newNode, 'type')) {
                    newNode.type = getInputType(nodeSchema, newNode);
                }
                else if (!widgetLibrary.hasWidget(newNode.type)) {
                    /** @type {?} */
                    const oldWidgetType = newNode.type;
                    newNode.type = getInputType(nodeSchema, newNode);
                    console.error(`error: widget type "${oldWidgetType}" ` +
                        `not found in library. Replacing with "${newNode.type}".`);
                }
                else {
                    newNode.type = checkInlineType(newNode.type, nodeSchema, newNode);
                }
                if (nodeSchema.type === 'object' && isArray(nodeSchema.required)) {
                    nodeDataMap.set('required', nodeSchema.required);
                }
                newNode.dataType =
                    nodeSchema.type || (hasOwn(nodeSchema, '$ref') ? '$ref' : null);
                updateInputOptions(newNode, nodeSchema, jsf);
                // Present checkboxes as single control, rather than array
                if (newNode.type === 'checkboxes' && hasOwn(nodeSchema, 'items')) {
                    updateInputOptions(newNode, nodeSchema.items, jsf);
                }
                else if (newNode.dataType === 'array') {
                    newNode.options.maxItems = Math.min(nodeSchema.maxItems || 1000, newNode.options.maxItems || 1000);
                    newNode.options.minItems = Math.max(nodeSchema.minItems || 0, newNode.options.minItems || 0);
                    newNode.options.listItems = Math.max(newNode.options.listItems || 0, isArray(nodeValue) ? nodeValue.length : 0);
                    newNode.options.tupleItems =
                        isArray(nodeSchema.items) ? nodeSchema.items.length : 0;
                    if (newNode.options.maxItems < newNode.options.tupleItems) {
                        newNode.options.tupleItems = newNode.options.maxItems;
                        newNode.options.listItems = 0;
                    }
                    else if (newNode.options.maxItems <
                        newNode.options.tupleItems + newNode.options.listItems) {
                        newNode.options.listItems =
                            newNode.options.maxItems - newNode.options.tupleItems;
                    }
                    else if (newNode.options.minItems >
                        newNode.options.tupleItems + newNode.options.listItems) {
                        newNode.options.listItems =
                            newNode.options.minItems - newNode.options.tupleItems;
                    }
                    if (!nodeDataMap.has('maxItems')) {
                        nodeDataMap.set('maxItems', newNode.options.maxItems);
                        nodeDataMap.set('minItems', newNode.options.minItems);
                        nodeDataMap.set('tupleItems', newNode.options.tupleItems);
                        nodeDataMap.set('listItems', newNode.options.listItems);
                    }
                    if (!jsf.arrayMap.has(shortDataPointer)) {
                        jsf.arrayMap.set(shortDataPointer, newNode.options.tupleItems);
                    }
                }
                if (isInputRequired(jsf.schema, schemaPointer)) {
                    newNode.options.required = true;
                    jsf.fieldsRequired = true;
                }
            }
            else {
                // TODO: create item in FormGroup model from layout key (?)
                updateInputOptions(newNode, {}, jsf);
            }
            if (!newNode.options.title && !/^\d+$/.test(newNode.name)) {
                newNode.options.title = fixTitle(newNode.name);
            }
            if (hasOwn(newNode.options, 'copyValueTo')) {
                if (typeof newNode.options.copyValueTo === 'string') {
                    newNode.options.copyValueTo = [newNode.options.copyValueTo];
                }
                if (isArray(newNode.options.copyValueTo)) {
                    newNode.options.copyValueTo = newNode.options.copyValueTo.map((/**
                     * @param {?} item
                     * @return {?}
                     */
                    item => JsonPointer.compile(JsonPointer.parseObjectPath(item), '-')));
                }
            }
            newNode.widget = widgetLibrary.getWidget(newNode.type);
            nodeDataMap.set('inputType', newNode.type);
            nodeDataMap.set('widget', newNode.widget);
            if (newNode.dataType === 'array' &&
                (hasOwn(newNode, 'items') || hasOwn(newNode, 'additionalItems'))) {
                /** @type {?} */
                const itemRefPointer = removeRecursiveReferences(newNode.dataPointer + '/-', jsf.dataRecursiveRefMap, jsf.arrayMap);
                if (!jsf.dataMap.has(itemRefPointer)) {
                    jsf.dataMap.set(itemRefPointer, new Map());
                }
                jsf.dataMap.get(itemRefPointer).set('inputType', 'section');
                // Fix insufficiently nested array item groups
                if (newNode.items.length > 1) {
                    /** @type {?} */
                    const arrayItemGroup = [];
                    for (let i = newNode.items.length - 1; i >= 0; i--) {
                        /** @type {?} */
                        const subItem = newNode.items[i];
                        if (hasOwn(subItem, 'dataPointer') &&
                            subItem.dataPointer.slice(0, itemRefPointer.length) === itemRefPointer) {
                            /** @type {?} */
                            const arrayItem = newNode.items.splice(i, 1)[0];
                            arrayItem.dataPointer = newNode.dataPointer + '/-' +
                                arrayItem.dataPointer.slice(itemRefPointer.length);
                            arrayItemGroup.unshift(arrayItem);
                        }
                        else {
                            subItem.arrayItem = true;
                            // TODO: Check schema to get arrayItemType and removable
                            subItem.arrayItemType = 'list';
                            subItem.removable = newNode.options.removable !== false;
                        }
                    }
                    if (arrayItemGroup.length) {
                        newNode.items.push({
                            _id: uniqueId(),
                            arrayItem: true,
                            arrayItemType: newNode.options.tupleItems > newNode.items.length ?
                                'tuple' : 'list',
                            items: arrayItemGroup,
                            options: { removable: newNode.options.removable !== false, },
                            dataPointer: newNode.dataPointer + '/-',
                            type: 'section',
                            widget: widgetLibrary.getWidget('section'),
                        });
                    }
                }
                else {
                    // TODO: Fix to hndle multiple items
                    newNode.items[0].arrayItem = true;
                    if (!newNode.items[0].dataPointer) {
                        newNode.items[0].dataPointer =
                            JsonPointer.toGenericPointer(itemRefPointer, jsf.arrayMap);
                    }
                    if (!JsonPointer.has(newNode, '/items/0/options/removable')) {
                        newNode.items[0].options.removable = true;
                    }
                    if (newNode.options.orderable === false) {
                        newNode.items[0].options.orderable = false;
                    }
                    newNode.items[0].arrayItemType =
                        newNode.options.tupleItems ? 'tuple' : 'list';
                }
                if (isArray(newNode.items)) {
                    /** @type {?} */
                    const arrayListItems = newNode.items.filter((/**
                     * @param {?} item
                     * @return {?}
                     */
                    item => item.type !== '$ref')).length -
                        newNode.options.tupleItems;
                    if (arrayListItems > newNode.options.listItems) {
                        newNode.options.listItems = arrayListItems;
                        nodeDataMap.set('listItems', arrayListItems);
                    }
                }
                if (!hasOwn(jsf.layoutRefLibrary, itemRefPointer)) {
                    jsf.layoutRefLibrary[itemRefPointer] =
                        cloneDeep(newNode.items[newNode.items.length - 1]);
                    if (recursive) {
                        jsf.layoutRefLibrary[itemRefPointer].recursiveReference = true;
                    }
                    forEach(jsf.layoutRefLibrary[itemRefPointer], (/**
                     * @param {?} item
                     * @param {?} key
                     * @return {?}
                     */
                    (item, key) => {
                        if (hasOwn(item, '_id')) {
                            item._id = null;
                        }
                        if (recursive) {
                            if (hasOwn(item, 'dataPointer')) {
                                item.dataPointer = item.dataPointer.slice(itemRefPointer.length);
                            }
                        }
                    }), 'top-down');
                }
                // Add any additional default items
                if (!newNode.recursiveReference || newNode.options.required) {
                    /** @type {?} */
                    const arrayLength = Math.min(Math.max(newNode.options.tupleItems + newNode.options.listItems, isArray(nodeValue) ? nodeValue.length : 0), newNode.options.maxItems);
                    for (let i = newNode.items.length; i < arrayLength; i++) {
                        newNode.items.push(getLayoutNode({
                            $ref: itemRefPointer,
                            dataPointer: newNode.dataPointer,
                            recursiveReference: newNode.recursiveReference,
                        }, jsf, widgetLibrary));
                    }
                }
                // If needed, add button to add items to array
                if (newNode.options.addable !== false &&
                    newNode.options.minItems < newNode.options.maxItems &&
                    (newNode.items[newNode.items.length - 1] || {}).type !== '$ref') {
                    /** @type {?} */
                    let buttonText = 'Add';
                    if (newNode.options.title) {
                        if (/^add\b/i.test(newNode.options.title)) {
                            buttonText = newNode.options.title;
                        }
                        else {
                            buttonText += ' ' + newNode.options.title;
                        }
                    }
                    else if (newNode.name && !/^\d+$/.test(newNode.name)) {
                        if (/^add\b/i.test(newNode.name)) {
                            buttonText += ' ' + fixTitle(newNode.name);
                        }
                        else {
                            buttonText = fixTitle(newNode.name);
                        }
                        // If newNode doesn't have a title, look for title of parent array item
                    }
                    else {
                        /** @type {?} */
                        const parentSchema = getFromSchema(jsf.schema, newNode.dataPointer, 'parentSchema');
                        if (hasOwn(parentSchema, 'title')) {
                            buttonText += ' to ' + parentSchema.title;
                        }
                        else {
                            /** @type {?} */
                            const pointerArray = JsonPointer.parse(newNode.dataPointer);
                            buttonText += ' to ' + fixTitle(pointerArray[pointerArray.length - 2]);
                        }
                    }
                    newNode.items.push({
                        _id: uniqueId(),
                        arrayItem: true,
                        arrayItemType: 'list',
                        dataPointer: newNode.dataPointer + '/-',
                        options: {
                            listItems: newNode.options.listItems,
                            maxItems: newNode.options.maxItems,
                            minItems: newNode.options.minItems,
                            removable: false,
                            title: buttonText,
                            tupleItems: newNode.options.tupleItems,
                        },
                        recursiveReference: recursive,
                        type: '$ref',
                        widget: widgetLibrary.getWidget('$ref'),
                        $ref: itemRefPointer,
                    });
                    if (isString(JsonPointer.get(newNode, '/style/add'))) {
                        newNode.items[newNode.items.length - 1].options.fieldStyle =
                            newNode.style.add;
                        delete newNode.style.add;
                        if (isEmpty(newNode.style)) {
                            delete newNode.style;
                        }
                    }
                }
            }
            else {
                newNode.arrayItem = false;
            }
        }
        else if (hasOwn(newNode, 'type') || hasOwn(newNode, 'items')) {
            /** @type {?} */
            const parentType = JsonPointer.get(jsf.layout, layoutPointer, 0, -2).type;
            if (!hasOwn(newNode, 'type')) {
                newNode.type =
                    inArray(parentType, ['tabs', 'tabarray']) ? 'tab' : 'array';
            }
            newNode.arrayItem = parentType === 'array';
            newNode.widget = widgetLibrary.getWidget(newNode.type);
            updateInputOptions(newNode, {}, jsf);
        }
        if (newNode.type === 'submit') {
            hasSubmitButton = true;
        }
        return newNode;
    }));
    if (jsf.hasRootReference) {
        /** @type {?} */
        const fullLayout = cloneDeep(formLayout);
        if (fullLayout[fullLayout.length - 1].type === 'submit') {
            fullLayout.pop();
        }
        jsf.layoutRefLibrary[''] = {
            _id: null,
            dataPointer: '',
            dataType: 'object',
            items: fullLayout,
            name: '',
            options: cloneDeep(jsf.formOptions.defautWidgetOptions),
            recursiveReference: true,
            required: false,
            type: 'section',
            widget: widgetLibrary.getWidget('section'),
        };
    }
    if (!hasSubmitButton) {
        formLayout.push({
            _id: uniqueId(),
            options: { title: 'Submit' },
            type: 'submit',
            widget: widgetLibrary.getWidget('submit'),
        });
    }
    return formLayout;
}
/**
 * 'buildLayoutFromSchema' function
 *
 * //   jsf -
 * //   widgetLibrary -
 * //   nodeValue -
 * //  { string = '' } schemaPointer -
 * //  { string = '' } dataPointer -
 * //  { boolean = false } arrayItem -
 * //  { string = null } arrayItemType -
 * //  { boolean = null } removable -
 * //  { boolean = false } forRefLibrary -
 * //  { string = '' } dataPointerPrefix -
 * //
 * @param {?} jsf
 * @param {?} widgetLibrary
 * @param {?=} nodeValue
 * @param {?=} schemaPointer
 * @param {?=} dataPointer
 * @param {?=} arrayItem
 * @param {?=} arrayItemType
 * @param {?=} removable
 * @param {?=} forRefLibrary
 * @param {?=} dataPointerPrefix
 * @return {?}
 */
function buildLayoutFromSchema(jsf, widgetLibrary, nodeValue = null, schemaPointer = '', dataPointer = '', arrayItem = false, arrayItemType = null, removable = null, forRefLibrary = false, dataPointerPrefix = '') {
    /** @type {?} */
    const schema = JsonPointer.get(jsf.schema, schemaPointer);
    if (!hasOwn(schema, 'type') && !hasOwn(schema, '$ref') &&
        !hasOwn(schema, 'x-schema-form')) {
        return null;
    }
    /** @type {?} */
    const newNodeType = getInputType(schema);
    if (!isDefined(nodeValue) && (jsf.formOptions.setSchemaDefaults === true ||
        (jsf.formOptions.setSchemaDefaults === 'auto' && isEmpty(jsf.formValues)))) {
        nodeValue = JsonPointer.get(jsf.schema, schemaPointer + '/default');
    }
    /** @type {?} */
    let newNode = {
        _id: forRefLibrary ? null : uniqueId(),
        arrayItem: arrayItem,
        dataPointer: JsonPointer.toGenericPointer(dataPointer, jsf.arrayMap),
        dataType: schema.type || (hasOwn(schema, '$ref') ? '$ref' : null),
        options: {},
        required: isInputRequired(jsf.schema, schemaPointer),
        type: newNodeType,
        widget: widgetLibrary.getWidget(newNodeType),
    };
    /** @type {?} */
    const lastDataKey = JsonPointer.toKey(newNode.dataPointer);
    if (lastDataKey !== '-') {
        newNode.name = lastDataKey;
    }
    if (newNode.arrayItem) {
        newNode.arrayItemType = arrayItemType;
        newNode.options.removable = removable !== false;
    }
    /** @type {?} */
    const shortDataPointer = removeRecursiveReferences(dataPointerPrefix + dataPointer, jsf.dataRecursiveRefMap, jsf.arrayMap);
    /** @type {?} */
    const recursive = !shortDataPointer.length ||
        shortDataPointer !== dataPointerPrefix + dataPointer;
    if (!jsf.dataMap.has(shortDataPointer)) {
        jsf.dataMap.set(shortDataPointer, new Map());
    }
    /** @type {?} */
    const nodeDataMap = jsf.dataMap.get(shortDataPointer);
    if (!nodeDataMap.has('inputType')) {
        nodeDataMap.set('schemaPointer', schemaPointer);
        nodeDataMap.set('inputType', newNode.type);
        nodeDataMap.set('widget', newNode.widget);
        nodeDataMap.set('disabled', !!newNode.options.disabled);
    }
    updateInputOptions(newNode, schema, jsf);
    if (!newNode.options.title && newNode.name && !/^\d+$/.test(newNode.name)) {
        newNode.options.title = fixTitle(newNode.name);
    }
    if (newNode.dataType === 'object') {
        if (isArray(schema.required) && !nodeDataMap.has('required')) {
            nodeDataMap.set('required', schema.required);
        }
        if (isObject(schema.properties)) {
            /** @type {?} */
            const newSection = [];
            /** @type {?} */
            const propertyKeys = schema['ui:order'] || Object.keys(schema.properties);
            if (propertyKeys.includes('*') && !hasOwn(schema.properties, '*')) {
                /** @type {?} */
                const unnamedKeys = Object.keys(schema.properties)
                    .filter((/**
                 * @param {?} key
                 * @return {?}
                 */
                key => !propertyKeys.includes(key)));
                for (let i = propertyKeys.length - 1; i >= 0; i--) {
                    if (propertyKeys[i] === '*') {
                        propertyKeys.splice(i, 1, ...unnamedKeys);
                    }
                }
            }
            propertyKeys
                .filter((/**
             * @param {?} key
             * @return {?}
             */
            key => hasOwn(schema.properties, key) ||
                hasOwn(schema, 'additionalProperties')))
                .forEach((/**
             * @param {?} key
             * @return {?}
             */
            key => {
                /** @type {?} */
                const keySchemaPointer = hasOwn(schema.properties, key) ?
                    '/properties/' + key : '/additionalProperties';
                /** @type {?} */
                const innerItem = buildLayoutFromSchema(jsf, widgetLibrary, isObject(nodeValue) ? nodeValue[key] : null, schemaPointer + keySchemaPointer, dataPointer + '/' + key, false, null, null, forRefLibrary, dataPointerPrefix);
                if (innerItem) {
                    if (isInputRequired(schema, '/' + key)) {
                        innerItem.options.required = true;
                        jsf.fieldsRequired = true;
                    }
                    newSection.push(innerItem);
                }
            }));
            if (dataPointer === '' && !forRefLibrary) {
                newNode = newSection;
            }
            else {
                newNode.items = newSection;
            }
        }
        // TODO: Add patternProperties and additionalProperties inputs?
        // ... possibly provide a way to enter both key names and values?
        // if (isObject(schema.patternProperties)) { }
        // if (isObject(schema.additionalProperties)) { }
    }
    else if (newNode.dataType === 'array') {
        newNode.items = [];
        newNode.options.maxItems = Math.min(schema.maxItems || 1000, newNode.options.maxItems || 1000);
        newNode.options.minItems = Math.max(schema.minItems || 0, newNode.options.minItems || 0);
        if (!newNode.options.minItems && isInputRequired(jsf.schema, schemaPointer)) {
            newNode.options.minItems = 1;
        }
        if (!hasOwn(newNode.options, 'listItems')) {
            newNode.options.listItems = 1;
        }
        newNode.options.tupleItems = isArray(schema.items) ? schema.items.length : 0;
        if (newNode.options.maxItems <= newNode.options.tupleItems) {
            newNode.options.tupleItems = newNode.options.maxItems;
            newNode.options.listItems = 0;
        }
        else if (newNode.options.maxItems <
            newNode.options.tupleItems + newNode.options.listItems) {
            newNode.options.listItems = newNode.options.maxItems - newNode.options.tupleItems;
        }
        else if (newNode.options.minItems >
            newNode.options.tupleItems + newNode.options.listItems) {
            newNode.options.listItems = newNode.options.minItems - newNode.options.tupleItems;
        }
        if (!nodeDataMap.has('maxItems')) {
            nodeDataMap.set('maxItems', newNode.options.maxItems);
            nodeDataMap.set('minItems', newNode.options.minItems);
            nodeDataMap.set('tupleItems', newNode.options.tupleItems);
            nodeDataMap.set('listItems', newNode.options.listItems);
        }
        if (!jsf.arrayMap.has(shortDataPointer)) {
            jsf.arrayMap.set(shortDataPointer, newNode.options.tupleItems);
        }
        removable = newNode.options.removable !== false;
        /** @type {?} */
        let additionalItemsSchemaPointer = null;
        // If 'items' is an array = tuple items
        if (isArray(schema.items)) {
            newNode.items = [];
            for (let i = 0; i < newNode.options.tupleItems; i++) {
                /** @type {?} */
                let newItem;
                /** @type {?} */
                const itemRefPointer = removeRecursiveReferences(shortDataPointer + '/' + i, jsf.dataRecursiveRefMap, jsf.arrayMap);
                /** @type {?} */
                const itemRecursive = !itemRefPointer.length ||
                    itemRefPointer !== shortDataPointer + '/' + i;
                // If removable, add tuple item layout to layoutRefLibrary
                if (removable && i >= newNode.options.minItems) {
                    if (!hasOwn(jsf.layoutRefLibrary, itemRefPointer)) {
                        // Set to null first to prevent recursive reference from causing endless loop
                        jsf.layoutRefLibrary[itemRefPointer] = null;
                        jsf.layoutRefLibrary[itemRefPointer] = buildLayoutFromSchema(jsf, widgetLibrary, isArray(nodeValue) ? nodeValue[i] : null, schemaPointer + '/items/' + i, itemRecursive ? '' : dataPointer + '/' + i, true, 'tuple', true, true, itemRecursive ? dataPointer + '/' + i : '');
                        if (itemRecursive) {
                            jsf.layoutRefLibrary[itemRefPointer].recursiveReference = true;
                        }
                    }
                    newItem = getLayoutNode({
                        $ref: itemRefPointer,
                        dataPointer: dataPointer + '/' + i,
                        recursiveReference: itemRecursive,
                    }, jsf, widgetLibrary, isArray(nodeValue) ? nodeValue[i] : null);
                }
                else {
                    newItem = buildLayoutFromSchema(jsf, widgetLibrary, isArray(nodeValue) ? nodeValue[i] : null, schemaPointer + '/items/' + i, dataPointer + '/' + i, true, 'tuple', false, forRefLibrary, dataPointerPrefix);
                }
                if (newItem) {
                    newNode.items.push(newItem);
                }
            }
            // If 'additionalItems' is an object = additional list items, after tuple items
            if (isObject(schema.additionalItems)) {
                additionalItemsSchemaPointer = schemaPointer + '/additionalItems';
            }
            // If 'items' is an object = list items only (no tuple items)
        }
        else if (isObject(schema.items)) {
            additionalItemsSchemaPointer = schemaPointer + '/items';
        }
        if (additionalItemsSchemaPointer) {
            /** @type {?} */
            const itemRefPointer = removeRecursiveReferences(shortDataPointer + '/-', jsf.dataRecursiveRefMap, jsf.arrayMap);
            /** @type {?} */
            const itemRecursive = !itemRefPointer.length ||
                itemRefPointer !== shortDataPointer + '/-';
            /** @type {?} */
            const itemSchemaPointer = removeRecursiveReferences(additionalItemsSchemaPointer, jsf.schemaRecursiveRefMap, jsf.arrayMap);
            // Add list item layout to layoutRefLibrary
            if (itemRefPointer.length && !hasOwn(jsf.layoutRefLibrary, itemRefPointer)) {
                // Set to null first to prevent recursive reference from causing endless loop
                jsf.layoutRefLibrary[itemRefPointer] = null;
                jsf.layoutRefLibrary[itemRefPointer] = buildLayoutFromSchema(jsf, widgetLibrary, null, itemSchemaPointer, itemRecursive ? '' : dataPointer + '/-', true, 'list', removable, true, itemRecursive ? dataPointer + '/-' : '');
                if (itemRecursive) {
                    jsf.layoutRefLibrary[itemRefPointer].recursiveReference = true;
                }
            }
            // Add any additional default items
            if (!itemRecursive || newNode.options.required) {
                /** @type {?} */
                const arrayLength = Math.min(Math.max(itemRecursive ? 0 :
                    newNode.options.tupleItems + newNode.options.listItems, isArray(nodeValue) ? nodeValue.length : 0), newNode.options.maxItems);
                if (newNode.items.length < arrayLength) {
                    for (let i = newNode.items.length; i < arrayLength; i++) {
                        newNode.items.push(getLayoutNode({
                            $ref: itemRefPointer,
                            dataPointer: dataPointer + '/-',
                            recursiveReference: itemRecursive,
                        }, jsf, widgetLibrary, isArray(nodeValue) ? nodeValue[i] : null));
                    }
                }
            }
            // If needed, add button to add items to array
            if (newNode.options.addable !== false &&
                newNode.options.minItems < newNode.options.maxItems &&
                (newNode.items[newNode.items.length - 1] || {}).type !== '$ref') {
                /** @type {?} */
                let buttonText = ((jsf.layoutRefLibrary[itemRefPointer] || {}).options || {}).title;
                /** @type {?} */
                const prefix = buttonText ? 'Add ' : 'Add to ';
                if (!buttonText) {
                    buttonText = schema.title || fixTitle(JsonPointer.toKey(dataPointer));
                }
                if (!/^add\b/i.test(buttonText)) {
                    buttonText = prefix + buttonText;
                }
                newNode.items.push({
                    _id: uniqueId(),
                    arrayItem: true,
                    arrayItemType: 'list',
                    dataPointer: newNode.dataPointer + '/-',
                    options: {
                        listItems: newNode.options.listItems,
                        maxItems: newNode.options.maxItems,
                        minItems: newNode.options.minItems,
                        removable: false,
                        title: buttonText,
                        tupleItems: newNode.options.tupleItems,
                    },
                    recursiveReference: itemRecursive,
                    type: '$ref',
                    widget: widgetLibrary.getWidget('$ref'),
                    $ref: itemRefPointer,
                });
            }
        }
    }
    else if (newNode.dataType === '$ref') {
        /** @type {?} */
        const schemaRef = JsonPointer.compile(schema.$ref);
        /** @type {?} */
        const dataRef = JsonPointer.toDataPointer(schemaRef, jsf.schema);
        /** @type {?} */
        let buttonText = '';
        // Get newNode title
        if (newNode.options.add) {
            buttonText = newNode.options.add;
        }
        else if (newNode.name && !/^\d+$/.test(newNode.name)) {
            buttonText =
                (/^add\b/i.test(newNode.name) ? '' : 'Add ') + fixTitle(newNode.name);
            // If newNode doesn't have a title, look for title of parent array item
        }
        else {
            /** @type {?} */
            const parentSchema = JsonPointer.get(jsf.schema, schemaPointer, 0, -1);
            if (hasOwn(parentSchema, 'title')) {
                buttonText = 'Add to ' + parentSchema.title;
            }
            else {
                /** @type {?} */
                const pointerArray = JsonPointer.parse(newNode.dataPointer);
                buttonText = 'Add to ' + fixTitle(pointerArray[pointerArray.length - 2]);
            }
        }
        Object.assign(newNode, {
            recursiveReference: true,
            widget: widgetLibrary.getWidget('$ref'),
            $ref: dataRef,
        });
        Object.assign(newNode.options, {
            removable: false,
            title: buttonText,
        });
        if (isNumber(JsonPointer.get(jsf.schema, schemaPointer, 0, -1).maxItems)) {
            newNode.options.maxItems =
                JsonPointer.get(jsf.schema, schemaPointer, 0, -1).maxItems;
        }
        // Add layout template to layoutRefLibrary
        if (dataRef.length) {
            if (!hasOwn(jsf.layoutRefLibrary, dataRef)) {
                // Set to null first to prevent recursive reference from causing endless loop
                jsf.layoutRefLibrary[dataRef] = null;
                /** @type {?} */
                const newLayout = buildLayoutFromSchema(jsf, widgetLibrary, null, schemaRef, '', newNode.arrayItem, newNode.arrayItemType, true, true, dataPointer);
                if (newLayout) {
                    newLayout.recursiveReference = true;
                    jsf.layoutRefLibrary[dataRef] = newLayout;
                }
                else {
                    delete jsf.layoutRefLibrary[dataRef];
                }
            }
            else if (!jsf.layoutRefLibrary[dataRef].recursiveReference) {
                jsf.layoutRefLibrary[dataRef].recursiveReference = true;
            }
        }
    }
    return newNode;
}
/**
 * 'mapLayout' function
 *
 * Creates a new layout by running each element in an existing layout through
 * an iteratee. Recursively maps within array elements 'items' and 'tabs'.
 * The iteratee is invoked with four arguments: (value, index, layout, path)
 *
 * The returned layout may be longer (or shorter) then the source layout.
 *
 * If an item from the source layout returns multiple items (as '*' usually will),
 * this function will keep all returned items in-line with the surrounding items.
 *
 * If an item from the source layout causes an error and returns null, it is
 * skipped without error, and the function will still return all non-null items.
 *
 * //   layout - the layout to map
 * //  { (v: any, i?: number, l?: any, p?: string) => any }
 *   function - the funciton to invoke on each element
 * //  { string|string[] = '' } layoutPointer - the layoutPointer to layout, inside rootLayout
 * //  { any[] = layout } rootLayout - the root layout, which conatins layout
 * //
 * @param {?} layout
 * @param {?} fn
 * @param {?=} layoutPointer
 * @param {?=} rootLayout
 * @return {?}
 */
function mapLayout(layout, fn, layoutPointer = '', rootLayout = layout) {
    /** @type {?} */
    let indexPad = 0;
    /** @type {?} */
    let newLayout = [];
    forEach(layout, (/**
     * @param {?} item
     * @param {?} index
     * @return {?}
     */
    (item, index) => {
        /** @type {?} */
        const realIndex = +index + indexPad;
        /** @type {?} */
        const newLayoutPointer = layoutPointer + '/' + realIndex;
        /** @type {?} */
        let newNode = copy(item);
        /** @type {?} */
        let itemsArray = [];
        if (isObject(item)) {
            if (hasOwn(item, 'tabs')) {
                item.items = item.tabs;
                delete item.tabs;
            }
            if (hasOwn(item, 'items')) {
                itemsArray = isArray(item.items) ? item.items : [item.items];
            }
        }
        if (itemsArray.length) {
            newNode.items = mapLayout(itemsArray, fn, newLayoutPointer + '/items', rootLayout);
        }
        newNode = fn(newNode, realIndex, newLayoutPointer, rootLayout);
        if (!isDefined(newNode)) {
            indexPad--;
        }
        else {
            if (isArray(newNode)) {
                indexPad += newNode.length - 1;
            }
            newLayout = newLayout.concat(newNode);
        }
    }));
    return newLayout;
}
/**
 * 'getLayoutNode' function
 * Copy a new layoutNode from layoutRefLibrary
 *
 * //   refNode -
 * //   layoutRefLibrary -
 * //  { any = null } widgetLibrary -
 * //  { any = null } nodeValue -
 * //  copied layoutNode
 * @param {?} refNode
 * @param {?} jsf
 * @param {?=} widgetLibrary
 * @param {?=} nodeValue
 * @return {?}
 */
function getLayoutNode(refNode, jsf, widgetLibrary = null, nodeValue = null) {
    // If recursive reference and building initial layout, return Add button
    if (refNode.recursiveReference && widgetLibrary) {
        /** @type {?} */
        const newLayoutNode = cloneDeep(refNode);
        if (!newLayoutNode.options) {
            newLayoutNode.options = {};
        }
        Object.assign(newLayoutNode, {
            recursiveReference: true,
            widget: widgetLibrary.getWidget('$ref'),
        });
        Object.assign(newLayoutNode.options, {
            removable: false,
            title: 'Add ' + newLayoutNode.$ref,
        });
        return newLayoutNode;
        // Otherwise, return referenced layout
    }
    else {
        /** @type {?} */
        let newLayoutNode = jsf.layoutRefLibrary[refNode.$ref];
        // If value defined, build new node from schema (to set array lengths)
        if (isDefined(nodeValue)) {
            newLayoutNode = buildLayoutFromSchema(jsf, widgetLibrary, nodeValue, JsonPointer.toSchemaPointer(refNode.$ref, jsf.schema), refNode.$ref, newLayoutNode.arrayItem, newLayoutNode.arrayItemType, newLayoutNode.options.removable, false);
        }
        else {
            // If value not defined, copy node from layoutRefLibrary
            newLayoutNode = cloneDeep(newLayoutNode);
            JsonPointer.forEachDeep(newLayoutNode, (/**
             * @param {?} subNode
             * @param {?} pointer
             * @return {?}
             */
            (subNode, pointer) => {
                // Reset all _id's in newLayoutNode to unique values
                if (hasOwn(subNode, '_id')) {
                    subNode._id = uniqueId();
                }
                // If adding a recursive item, prefix current dataPointer
                // to all dataPointers in new layoutNode
                if (refNode.recursiveReference && hasOwn(subNode, 'dataPointer')) {
                    subNode.dataPointer = refNode.dataPointer + subNode.dataPointer;
                }
            }));
        }
        return newLayoutNode;
    }
}
/**
 * 'buildTitleMap' function
 *
 * //   titleMap -
 * //   enumList -
 * //  { boolean = true } fieldRequired -
 * //  { boolean = true } flatList -
 * // { TitleMapItem[] }
 * @param {?} titleMap
 * @param {?} enumList
 * @param {?=} fieldRequired
 * @param {?=} flatList
 * @return {?}
 */
function buildTitleMap(titleMap, enumList, fieldRequired = true, flatList = true) {
    /** @type {?} */
    let newTitleMap = [];
    /** @type {?} */
    let hasEmptyValue = false;
    if (titleMap) {
        if (isArray(titleMap)) {
            if (enumList) {
                for (const i of Object.keys(titleMap)) {
                    if (isObject(titleMap[i])) { // JSON Form style
                        // JSON Form style
                        /** @type {?} */
                        const value = titleMap[i].value;
                        if (enumList.includes(value)) {
                            /** @type {?} */
                            const name = titleMap[i].name;
                            newTitleMap.push({ name, value });
                            if (value === undefined || value === null) {
                                hasEmptyValue = true;
                            }
                        }
                    }
                    else if (isString(titleMap[i])) { // React Jsonschema Form style
                        if (i < enumList.length) {
                            /** @type {?} */
                            const name = titleMap[i];
                            /** @type {?} */
                            const value = enumList[i];
                            newTitleMap.push({ name, value });
                            if (value === undefined || value === null) {
                                hasEmptyValue = true;
                            }
                        }
                    }
                }
            }
            else { // If array titleMap and no enum list, just return the titleMap - Angular Schema Form style
                newTitleMap = titleMap;
                if (!fieldRequired) {
                    hasEmptyValue = !!newTitleMap
                        .filter((/**
                     * @param {?} i
                     * @return {?}
                     */
                    i => i.value === undefined || i.value === null))
                        .length;
                }
            }
        }
        else if (enumList) { // Alternate JSON Form style, with enum list
            for (const i of Object.keys(enumList)) {
                /** @type {?} */
                const value = enumList[i];
                if (hasOwn(titleMap, value)) {
                    /** @type {?} */
                    const name = titleMap[value];
                    newTitleMap.push({ name, value });
                    if (value === undefined || value === null) {
                        hasEmptyValue = true;
                    }
                }
            }
        }
        else { // Alternate JSON Form style, without enum list
            for (const value of Object.keys(titleMap)) {
                /** @type {?} */
                const name = titleMap[value];
                newTitleMap.push({ name, value });
                if (value === undefined || value === null) {
                    hasEmptyValue = true;
                }
            }
        }
    }
    else if (enumList) { // Build map from enum list alone
        for (const i of Object.keys(enumList)) {
            /** @type {?} */
            const name = enumList[i];
            /** @type {?} */
            const value = enumList[i];
            newTitleMap.push({ name, value });
            if (value === undefined || value === null) {
                hasEmptyValue = true;
            }
        }
    }
    else { // If no titleMap and no enum list, return default map of boolean values
        newTitleMap = [{ name: 'True', value: true }, { name: 'False', value: false }];
    }
    // Does titleMap have groups?
    if (newTitleMap.some((/**
     * @param {?} title
     * @return {?}
     */
    title => hasOwn(title, 'group')))) {
        hasEmptyValue = false;
        // If flatList = true, flatten items & update name to group: name
        if (flatList) {
            newTitleMap = newTitleMap.reduce((/**
             * @param {?} groupTitleMap
             * @param {?} title
             * @return {?}
             */
            (groupTitleMap, title) => {
                if (hasOwn(title, 'group')) {
                    if (isArray(title.items)) {
                        groupTitleMap = [
                            ...groupTitleMap,
                            ...title.items.map((/**
                             * @param {?} item
                             * @return {?}
                             */
                            item => (Object.assign({}, item, { name: `${title.group}: ${item.name}` }))))
                        ];
                        if (title.items.some((/**
                         * @param {?} item
                         * @return {?}
                         */
                        item => item.value === undefined || item.value === null))) {
                            hasEmptyValue = true;
                        }
                    }
                    if (hasOwn(title, 'name') && hasOwn(title, 'value')) {
                        title.name = `${title.group}: ${title.name}`;
                        delete title.group;
                        groupTitleMap.push(title);
                        if (title.value === undefined || title.value === null) {
                            hasEmptyValue = true;
                        }
                    }
                }
                else {
                    groupTitleMap.push(title);
                    if (title.value === undefined || title.value === null) {
                        hasEmptyValue = true;
                    }
                }
                return groupTitleMap;
            }), []);
            // If flatList = false, combine items from matching groups
        }
        else {
            newTitleMap = newTitleMap.reduce((/**
             * @param {?} groupTitleMap
             * @param {?} title
             * @return {?}
             */
            (groupTitleMap, title) => {
                if (hasOwn(title, 'group')) {
                    if (title.group !== (groupTitleMap[groupTitleMap.length - 1] || {}).group) {
                        groupTitleMap.push({ group: title.group, items: title.items || [] });
                    }
                    if (hasOwn(title, 'name') && hasOwn(title, 'value')) {
                        groupTitleMap[groupTitleMap.length - 1].items
                            .push({ name: title.name, value: title.value });
                        if (title.value === undefined || title.value === null) {
                            hasEmptyValue = true;
                        }
                    }
                }
                else {
                    groupTitleMap.push(title);
                    if (title.value === undefined || title.value === null) {
                        hasEmptyValue = true;
                    }
                }
                return groupTitleMap;
            }), []);
        }
    }
    if (!fieldRequired && !hasEmptyValue) {
        newTitleMap.unshift({ name: '<em>None</em>', value: null });
    }
    return newTitleMap;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const longMonths = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
/** @type {?} */
const longDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
/** @type {?} */
const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** @type {?} */
const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *
 * @param {?} date
 * @param {?=} options
 * return a date string which follows the JSON schema standard
 * @return {?}
 */
function dateToString(date, options = {}) {
    /** @type {?} */
    const dateFormat = options.dateFormat || 'YYYY-MM-DD';
    // TODO: Use options.locale to change default format and names
    // const locale = options.locale || 'en-US';
    date = new Date(date || undefined);
    if (!date.getDate()) {
        return null;
    }
    /** @type {?} */
    const year = date.getFullYear().toString();
    /** @type {?} */
    const month = date.getMonth();
    /** @type {?} */
    const day = date.getDate();
    /** @type {?} */
    const dayOfWeek = date.getDay();
    return dateFormat
        .replace(/S/g, getOrdinal(day))
        .replace(/YYYY/g, year)
        .replace(/YY/g, year.slice(-2))
        .replace(/MMMM/g, longMonths[month])
        .replace(/MMM/g, shortMonths[month])
        .replace(/MM/g, ('0' + (month + 1)).slice(-2))
        .replace(/M/g, month + 1)
        .replace(/DDDD/g, longDays[dayOfWeek])
        .replace(/DDD/g, shortDays[dayOfWeek])
        .replace(/DD/g, ('0' + day).slice(-2))
        .replace(/D/g, day);
}
/**
 * @param {?} day
 * @return {?}
 */
function getOrdinal(day) {
    if (day > 3 && day < 21) {
        return 'th';
    }
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
const ɵ0 = /**
 * @param {?} error
 * @return {?}
 */
function (error) {
    switch (error.requiredFormat) {
        case 'date':
            return 'Must be a date, like "2000-12-31"';
        case 'time':
            return 'Must be a time, like "16:20" or "03:14:15.9265"';
        case 'date-time':
            return 'Must be a date-time, like "2000-03-14T01:59" or "2000-03-14T01:59:26.535Z"';
        case 'email':
            return 'Must be an email address, like "name@example.com"';
        case 'hostname':
            return 'Must be a hostname, like "example.com"';
        case 'ipv4':
            return 'Must be an IPv4 address, like "127.0.0.1"';
        case 'ipv6':
            return 'Must be an IPv6 address, like "1234:5678:9ABC:DEF0:1234:5678:9ABC:DEF0"';
        // TODO: add examples for 'uri', 'uri-reference', and 'uri-template'
        // case 'uri': case 'uri-reference': case 'uri-template':
        case 'url':
            return 'Must be a url, like "http://www.example.com/page.html"';
        case 'uuid':
            return 'Must be a uuid, like "12345678-9ABC-DEF0-1234-56789ABCDEF0"';
        case 'color':
            return 'Must be a color, like "#FFFFFF" or "rgb(255, 255, 255)"';
        case 'json-pointer':
            return 'Must be a JSON Pointer, like "/pointer/to/something"';
        case 'relative-json-pointer':
            return 'Must be a relative JSON Pointer, like "2/pointer/to/something"';
        case 'regex':
            return 'Must be a regular expression, like "(1-)?\\d{3}-\\d{3}-\\d{4}"';
        default:
            return 'Must be a correctly formatted ' + error.requiredFormat;
    }
}, ɵ1 = /**
 * @param {?} error
 * @return {?}
 */
function (error) {
    if ((1 / error.multipleOfValue) % 10 === 0) {
        /** @type {?} */
        const decimals = Math.log10(1 / error.multipleOfValue);
        return `Must have ${decimals} or fewer decimal places.`;
    }
    else {
        return `Must be a multiple of ${error.multipleOfValue}.`;
    }
};
/** @type {?} */
const enValidationMessages = {
    // Default English error messages
    required: 'This field is required.',
    minLength: 'Must be {{minimumLength}} characters or longer (current length: {{currentLength}})',
    maxLength: 'Must be {{maximumLength}} characters or shorter (current length: {{currentLength}})',
    pattern: 'Must match pattern: {{requiredPattern}}',
    format: (ɵ0),
    minimum: 'Must be {{minimumValue}} or more',
    exclusiveMinimum: 'Must be more than {{exclusiveMinimumValue}}',
    maximum: 'Must be {{maximumValue}} or less',
    exclusiveMaximum: 'Must be less than {{exclusiveMaximumValue}}',
    multipleOf: (ɵ1),
    minProperties: 'Must have {{minimumProperties}} or more items (current items: {{currentProperties}})',
    maxProperties: 'Must have {{maximumProperties}} or fewer items (current items: {{currentProperties}})',
    minItems: 'Must have {{minimumItems}} or more items (current items: {{currentItems}})',
    maxItems: 'Must have {{maximumItems}} or fewer items (current items: {{currentItems}})',
    uniqueItems: 'All items must be unique',
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
const ɵ0$1 = /**
 * @param {?} error
 * @return {?}
 */
function (error) {
    switch (error.requiredFormat) {
        case 'date':
            return 'Doit être une date, tel que "2000-12-31"';
        case 'time':
            return 'Doit être une heure, tel que "16:20" ou "03:14:15.9265"';
        case 'date-time':
            return 'Doit être une date et une heure, tel que "2000-03-14T01:59" ou "2000-03-14T01:59:26.535Z"';
        case 'email':
            return 'Doit être une adresse e-mail, tel que "name@example.com"';
        case 'hostname':
            return 'Doit être un nom de domaine, tel que "example.com"';
        case 'ipv4':
            return 'Doit être une adresse IPv4, tel que "127.0.0.1"';
        case 'ipv6':
            return 'Doit être une adresse IPv6, tel que "1234:5678:9ABC:DEF0:1234:5678:9ABC:DEF0"';
        // TODO: add examples for 'uri', 'uri-reference', and 'uri-template'
        // case 'uri': case 'uri-reference': case 'uri-template':
        case 'url':
            return 'Doit être une URL, tel que "http://www.example.com/page.html"';
        case 'uuid':
            return 'Doit être un UUID, tel que "12345678-9ABC-DEF0-1234-56789ABCDEF0"';
        case 'color':
            return 'Doit être une couleur, tel que "#FFFFFF" or "rgb(255, 255, 255)"';
        case 'json-pointer':
            return 'Doit être un JSON Pointer, tel que "/pointer/to/something"';
        case 'relative-json-pointer':
            return 'Doit être un relative JSON Pointer, tel que "2/pointer/to/something"';
        case 'regex':
            return 'Doit être une expression régulière, tel que "(1-)?\\d{3}-\\d{3}-\\d{4}"';
        default:
            return 'Doit être avoir le format correct: ' + error.requiredFormat;
    }
}, ɵ1$1 = /**
 * @param {?} error
 * @return {?}
 */
function (error) {
    if ((1 / error.multipleOfValue) % 10 === 0) {
        /** @type {?} */
        const decimals = Math.log10(1 / error.multipleOfValue);
        return `Doit comporter ${decimals} ou moins de decimales.`;
    }
    else {
        return `Doit être un multiple de ${error.multipleOfValue}.`;
    }
};
/** @type {?} */
const frValidationMessages = {
    // French error messages
    required: 'Est obligatoire.',
    minLength: 'Doit avoir minimum {{minimumLength}} caractères (actuellement: {{currentLength}})',
    maxLength: 'Doit avoir maximum {{maximumLength}} caractères (actuellement: {{currentLength}})',
    pattern: 'Doit respecter: {{requiredPattern}}',
    format: (ɵ0$1),
    minimum: 'Doit être supérieur à {{minimumValue}}',
    exclusiveMinimum: 'Doit avoir minimum {{exclusiveMinimumValue}} charactères',
    maximum: 'Doit être inférieur à {{maximumValue}}',
    exclusiveMaximum: 'Doit avoir maximum {{exclusiveMaximumValue}} charactères',
    multipleOf: (ɵ1$1),
    minProperties: 'Doit comporter au minimum {{minimumProperties}} éléments',
    maxProperties: 'Doit comporter au maximum {{maximumProperties}} éléments',
    minItems: 'Doit comporter au minimum {{minimumItems}} éléments',
    maxItems: 'Doit comporter au maximum {{minimumItems}} éléments',
    uniqueItems: 'Tous les éléments doivent être uniques',
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
const ɵ0$2 = /**
 * @param {?} error
 * @return {?}
 */
function (error) {
    switch (error.requiredFormat) {
        case 'date':
            return 'Deve essere una data, come "31-12-2000"';
        case 'time':
            return 'Deve essere un orario, come "16:20" o "03:14:15.9265"';
        case 'date-time':
            return 'Deve essere data-orario, come "14-03-2000T01:59" or "14-03-2000T01:59:26.535Z"';
        case 'email':
            return 'Deve essere un indirzzo email, come "name@example.com"';
        case 'hostname':
            return 'Deve essere un hostname, come "example.com"';
        case 'ipv4':
            return 'Deve essere un indirizzo IPv4, come "127.0.0.1"';
        case 'ipv6':
            return 'Deve essere un indirizzo IPv6, come "1234:5678:9ABC:DEF0:1234:5678:9ABC:DEF0"';
        // TODO: add examples for 'uri', 'uri-reference', and 'uri-template'
        // case 'uri': case 'uri-reference': case 'uri-template':
        case 'url':
            return 'Deve essere un url, come "http://www.example.com/page.html"';
        case 'uuid':
            return 'Deve essere un uuid, come "12345678-9ABC-DEF0-1234-56789ABCDEF0"';
        case 'color':
            return 'Deve essere un colore, come "#FFFFFF" o "rgb(255, 255, 255)"';
        case 'json-pointer':
            return 'Deve essere un JSON Pointer, come "/pointer/to/something"';
        case 'relative-json-pointer':
            return 'Deve essere un JSON Pointer relativo, come "2/pointer/to/something"';
        case 'regex':
            return 'Deve essere una regular expression, come "(1-)?\\d{3}-\\d{3}-\\d{4}"';
        default:
            return 'Deve essere formattato correttamente ' + error.requiredFormat;
    }
}, ɵ1$2 = /**
 * @param {?} error
 * @return {?}
 */
function (error) {
    if ((1 / error.multipleOfValue) % 10 === 0) {
        /** @type {?} */
        const decimals = Math.log10(1 / error.multipleOfValue);
        return `Deve avere ${decimals} o meno decimali.`;
    }
    else {
        return `Deve essere multiplo di ${error.multipleOfValue}.`;
    }
};
/** @type {?} */
const itValidationMessages = {
    // Default Italian error messages
    required: 'Il campo è obbligatorio',
    minLength: 'Deve inserire almeno {{minimumLength}} caratteri (lunghezza corrente: {{currentLength}})',
    maxLength: 'Il numero massimo di caratteri consentito è {{maximumLength}} (lunghezza corrente: {{currentLength}})',
    pattern: 'Devi rispettare il pattern : {{requiredPattern}}',
    format: (ɵ0$2),
    minimum: 'Deve essere {{minimumValue}} o più',
    exclusiveMinimum: 'Deve essere più di {{exclusiveMinimumValue}}',
    maximum: 'Deve essere {{maximumValue}} o meno',
    exclusiveMaximum: 'Deve essere minore di {{exclusiveMaximumValue}}',
    multipleOf: (ɵ1$2),
    minProperties: 'Deve avere {{minimumProperties}} o più elementi (elementi correnti: {{currentProperties}})',
    maxProperties: 'Deve avere {{maximumProperties}} o meno elementi (elementi correnti: {{currentProperties}})',
    minItems: 'Deve avere {{minimumItems}} o più elementi (elementi correnti: {{currentItems}})',
    maxItems: 'Deve avere {{maximumItems}} o meno elementi (elementi correnti: {{currentItems}})',
    uniqueItems: 'Tutti gli elementi devono essere unici',
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
const ɵ0$3 = /**
 * @param {?} error
 * @return {?}
 */
function (error) {
    switch (error.requiredFormat) {
        case 'date':
            return 'Tem que ser uma data, por exemplo "2000-12-31"';
        case 'time':
            return 'Tem que ser horário, por exemplo "16:20" ou "03:14:15.9265"';
        case 'date-time':
            return 'Tem que ser data e hora, por exemplo "2000-03-14T01:59" ou "2000-03-14T01:59:26.535Z"';
        case 'email':
            return 'Tem que ser um email, por exemplo "fulano@exemplo.com.br"';
        case 'hostname':
            return 'Tem que ser uma nome de domínio, por exemplo "exemplo.com.br"';
        case 'ipv4':
            return 'Tem que ser um endereço IPv4, por exemplo "127.0.0.1"';
        case 'ipv6':
            return 'Tem que ser um endereço IPv6, por exemplo "1234:5678:9ABC:DEF0:1234:5678:9ABC:DEF0"';
        // TODO: add examples for 'uri', 'uri-reference', and 'uri-template'
        // case 'uri': case 'uri-reference': case 'uri-template':
        case 'url':
            return 'Tem que ser uma URL, por exemplo "http://www.exemplo.com.br/pagina.html"';
        case 'uuid':
            return 'Tem que ser um uuid, por exemplo "12345678-9ABC-DEF0-1234-56789ABCDEF0"';
        case 'color':
            return 'Tem que ser uma cor, por exemplo "#FFFFFF" ou "rgb(255, 255, 255)"';
        case 'json-pointer':
            return 'Tem que ser um JSON Pointer, por exemplo "/referencia/para/algo"';
        case 'relative-json-pointer':
            return 'Tem que ser um JSON Pointer relativo, por exemplo "2/referencia/para/algo"';
        case 'regex':
            return 'Tem que ser uma expressão regular, por exemplo "(1-)?\\d{3}-\\d{3}-\\d{4}"';
        default:
            return 'Tem que ser no formato: ' + error.requiredFormat;
    }
}, ɵ1$3 = /**
 * @param {?} error
 * @return {?}
 */
function (error) {
    if ((1 / error.multipleOfValue) % 10 === 0) {
        /** @type {?} */
        const decimals = Math.log10(1 / error.multipleOfValue);
        return `Tem que ter ${decimals} ou menos casas decimais.`;
    }
    else {
        return `Tem que ser um múltiplo de ${error.multipleOfValue}.`;
    }
};
/** @type {?} */
const ptValidationMessages = {
    // Brazilian Portuguese error messages
    required: 'Este campo é obrigatório.',
    minLength: 'É preciso no mínimo {{minimumLength}} caracteres ou mais (tamanho atual: {{currentLength}})',
    maxLength: 'É preciso no máximo  {{maximumLength}} caracteres ou menos (tamanho atual: {{currentLength}})',
    pattern: 'Tem que ajustar ao formato: {{requiredPattern}}',
    format: (ɵ0$3),
    minimum: 'Tem que ser {{minimumValue}} ou mais',
    exclusiveMinimum: 'Tem que ser mais que {{exclusiveMinimumValue}}',
    maximum: 'Tem que ser {{maximumValue}} ou menos',
    exclusiveMaximum: 'Tem que ser menor que {{exclusiveMaximumValue}}',
    multipleOf: (ɵ1$3),
    minProperties: 'Deve ter {{minimumProperties}} ou mais itens (itens até o momento: {{currentProperties}})',
    maxProperties: 'Deve ter {{maximumProperties}} ou menos intens (itens até o momento: {{currentProperties}})',
    minItems: 'Deve ter {{minimumItems}} ou mais itens (itens até o momento: {{currentItems}})',
    maxItems: 'Deve ter {{maximumItems}} ou menos itens (itens até o momento: {{currentItems}})',
    uniqueItems: 'Todos os itens devem ser únicos',
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
const ɵ0$4 = /**
 * @param {?} error
 * @return {?}
 */
function (error) {
    switch (error.requiredFormat) {
        case 'date':
            return '必须为日期格式, 比如 "2000-12-31"';
        case 'time':
            return '必须为时间格式, 比如 "16:20" 或者 "03:14:15.9265"';
        case 'date-time':
            return '必须为日期时间格式, 比如 "2000-03-14T01:59" 或者 "2000-03-14T01:59:26.535Z"';
        case 'email':
            return '必须为邮箱地址, 比如 "name@example.com"';
        case 'hostname':
            return '必须为主机名, 比如 "example.com"';
        case 'ipv4':
            return '必须为 IPv4 地址, 比如 "127.0.0.1"';
        case 'ipv6':
            return '必须为 IPv6 地址, 比如 "1234:5678:9ABC:DEF0:1234:5678:9ABC:DEF0"';
        // TODO: add examples for 'uri', 'uri-reference', and 'uri-template'
        // case 'uri': case 'uri-reference': case 'uri-template':
        case 'url':
            return '必须为 url, 比如 "http://www.example.com/page.html"';
        case 'uuid':
            return '必须为 uuid, 比如 "12345678-9ABC-DEF0-1234-56789ABCDEF0"';
        case 'color':
            return '必须为颜色值, 比如 "#FFFFFF" 或者 "rgb(255, 255, 255)"';
        case 'json-pointer':
            return '必须为 JSON Pointer, 比如 "/pointer/to/something"';
        case 'relative-json-pointer':
            return '必须为相对的 JSON Pointer, 比如 "2/pointer/to/something"';
        case 'regex':
            return '必须为正则表达式, 比如 "(1-)?\\d{3}-\\d{3}-\\d{4}"';
        default:
            return '必须为格式正确的 ' + error.requiredFormat;
    }
}, ɵ1$4 = /**
 * @param {?} error
 * @return {?}
 */
function (error) {
    if ((1 / error.multipleOfValue) % 10 === 0) {
        /** @type {?} */
        const decimals = Math.log10(1 / error.multipleOfValue);
        return `必须有 ${decimals} 位或更少的小数位`;
    }
    else {
        return `必须为 ${error.multipleOfValue} 的倍数`;
    }
};
/** @type {?} */
const zhValidationMessages = {
    // Chinese error messages
    required: '必填字段.',
    minLength: '字符长度必须大于或者等于 {{minimumLength}} (当前长度: {{currentLength}})',
    maxLength: '字符长度必须小于或者等于 {{maximumLength}} (当前长度: {{currentLength}})',
    pattern: '必须匹配正则表达式: {{requiredPattern}}',
    format: (ɵ0$4),
    minimum: '必须大于或者等于最小值: {{minimumValue}}',
    exclusiveMinimum: '必须大于最小值: {{exclusiveMinimumValue}}',
    maximum: '必须小于或者等于最大值: {{maximumValue}}',
    exclusiveMaximum: '必须小于最大值: {{exclusiveMaximumValue}}',
    multipleOf: (ɵ1$4),
    minProperties: '项目数必须大于或者等于 {{minimumProperties}} (当前项目数: {{currentProperties}})',
    maxProperties: '项目数必须小于或者等于 {{maximumProperties}} (当前项目数: {{currentProperties}})',
    minItems: '项目数必须大于或者等于 {{minimumItems}} (当前项目数: {{currentItems}})',
    maxItems: '项目数必须小于或者等于 {{maximumItems}} (当前项目数: {{currentItems}})',
    uniqueItems: '所有项目必须是唯一的',
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
function TitleMapItem() { }
if (false) {
    /** @type {?|undefined} */
    TitleMapItem.prototype.name;
    /** @type {?|undefined} */
    TitleMapItem.prototype.value;
    /** @type {?|undefined} */
    TitleMapItem.prototype.checked;
    /** @type {?|undefined} */
    TitleMapItem.prototype.group;
    /** @type {?|undefined} */
    TitleMapItem.prototype.items;
}
/**
 * @record
 */
function ErrorMessages() { }
class JsonSchemaFormService {
    constructor() {
        this.JsonFormCompatibility = false;
        this.ReactJsonSchemaFormCompatibility = false;
        this.AngularSchemaFormCompatibility = false;
        this.tpldata = {};
        this.ajvOptions = {
            allErrors: true,
            jsonPointers: true,
            unknownFormats: "ignore",
        };
        this.ajv = new Ajv(this.ajvOptions); // AJV: Another JSON Schema Validator
        // AJV: Another JSON Schema Validator
        this.validateFormData = null; // Compiled AJV function to validate active form's schema
        // Compiled AJV function to validate active form's schema
        this.formValues = {}; // Internal form data (may not have correct types)
        // Internal form data (may not have correct types)
        this.data = {}; // Output form data (formValues, formatted with correct data types)
        // Output form data (formValues, formatted with correct data types)
        this.schema = {}; // Internal JSON Schema
        // Internal JSON Schema
        this.layout = []; // Internal form layout
        // Internal form layout
        this.formGroupTemplate = {}; // Template used to create formGroup
        // Template used to create formGroup
        this.formGroup = null; // Angular formGroup, which powers the reactive form
        // Angular formGroup, which powers the reactive form
        this.framework = null; // Active framework component
        // Active options, used to configure the form
        this.validData = null; // Valid form data (or null) (=== isValid ? data : null)
        // Valid form data (or null) (=== isValid ? data : null)
        this.isValid = null; // Is current form data valid?
        // Is current form data valid?
        this.ajvErrors = null; // Ajv errors for current data
        // Ajv errors for current data
        this.validationErrors = null; // Any validation errors for current data
        // Any validation errors for current data
        this.dataErrors = new Map(); //
        //
        this.formValueSubscription = null; // Subscription to formGroup.valueChanges observable (for un- and re-subscribing)
        // Subscription to formGroup.valueChanges observable (for un- and re-subscribing)
        this.dataChanges = new Subject(); // Form data observable
        // Form data observable
        this.isValidChanges = new Subject(); // isValid observable
        // isValid observable
        this.validationErrorChanges = new Subject(); // validationErrors observable
        // validationErrors observable
        this.arrayMap = new Map(); // Maps arrays in data object and number of tuple values
        // Maps arrays in data object and number of tuple values
        this.dataMap = new Map(); // Maps paths in form data to schema and formGroup paths
        // Maps paths in form data to schema and formGroup paths
        this.dataRecursiveRefMap = new Map(); // Maps recursive reference points in form data
        // Maps recursive reference points in form data
        this.schemaRecursiveRefMap = new Map(); // Maps recursive reference points in schema
        // Maps recursive reference points in schema
        this.schemaRefLibrary = {}; // Library of schemas for resolving schema $refs
        // Library of schemas for resolving schema $refs
        this.layoutRefLibrary = { "": null }; // Library of layout nodes for adding to form
        // Library of layout nodes for adding to form
        this.templateRefLibrary = {}; // Library of formGroup templates for adding to form
        // Library of formGroup templates for adding to form
        this.hasRootReference = false; // Does the form include a recursive reference to itself?
        // Does the form include a recursive reference to itself?
        this.language = "en-US"; // Does the form include a recursive reference to itself?
        // Does the form include a recursive reference to itself?
        // Default global form options
        this.defaultFormOptions = {
            autocomplete: true,
            // Allow the web browser to remember previous form submission values as defaults
            addSubmit: "auto",
            // Add a submit button if layout does not have one?
            // for addSubmit: true = always, false = never,
            // 'auto' = only if layout is undefined (form is built from schema alone)
            debug: false,
            // Show debugging output?
            disableInvalidSubmit: true,
            // Disable submit if form invalid?
            formDisabled: false,
            // Set entire form as disabled? (not editable, and disables outputs)
            formReadonly: false,
            // Set entire form as read only? (not editable, but outputs still enabled)
            fieldsRequired: false,
            // (set automatically) Are there any required fields in the form?
            framework: "no-framework",
            // The framework to load
            loadExternalAssets: false,
            // Load external css and JavaScript for framework?
            pristine: { errors: true, success: true },
            supressPropertyTitles: false,
            setSchemaDefaults: "auto",
            // Set fefault values from schema?
            // true = always set (unless overridden by layout default or formValues)
            // false = never set
            // 'auto' = set in addable components, and everywhere if formValues not set
            setLayoutDefaults: "auto",
            // Set fefault values from layout?
            // true = always set (unless overridden by formValues)
            // false = never set
            // 'auto' = set in addable components, and everywhere if formValues not set
            validateOnRender: "auto",
            // Validate fields immediately, before they are touched?
            // true = validate all fields immediately
            // false = only validate fields after they are touched by user
            // 'auto' = validate fields with values immediately, empty fields after they are touched
            widgets: {},
            // Any custom widgets to load
            defautWidgetOptions: {
                // Default options for form control widgets
                listItems: 1,
                // Number of list items to initially add to arrays with no default value
                addable: true,
                // Allow adding items to an array or $ref point?
                orderable: true,
                // Allow reordering items within an array?
                removable: true,
                // Allow removing items from an array or $ref point?
                enableErrorState: true,
                // Apply 'has-error' class when field fails validation?
                // disableErrorState: false, // Don't apply 'has-error' class when field fails validation?
                enableSuccessState: true,
                // Apply 'has-success' class when field validates?
                // disableSuccessState: false, // Don't apply 'has-success' class when field validates?
                feedback: false,
                // Show inline feedback icons?
                feedbackOnRender: false,
                // Show errorMessage on Render?
                notitle: false,
                // Hide title?
                disabled: false,
                // Set control as disabled? (not editable, and excluded from output)
                readonly: false,
                // Set control as read only? (not editable, but included in output)
                returnEmptyFields: true,
                // return values for fields that contain no data?
                validationMessages: {},
            },
        };
        this.setLanguage(this.language);
        this.ajv.addMetaSchema(jsonDraft6);
    }
    /**
     * @param {?=} language
     * @return {?}
     */
    setLanguage(language = "en-US") {
        this.language = language;
        /** @type {?} */
        const languageValidationMessages = {
            fr: frValidationMessages,
            en: enValidationMessages,
            it: itValidationMessages,
            pt: ptValidationMessages,
            zh: zhValidationMessages,
        };
        /** @type {?} */
        const languageCode = language.slice(0, 2);
        /** @type {?} */
        const validationMessages = languageValidationMessages[languageCode];
        this.defaultFormOptions.defautWidgetOptions.validationMessages = cloneDeep(validationMessages);
    }
    /**
     * @return {?}
     */
    getData() {
        return this.data;
    }
    /**
     * @return {?}
     */
    getSchema() {
        return this.schema;
    }
    /**
     * @return {?}
     */
    getLayout() {
        return this.layout;
    }
    /**
     * @return {?}
     */
    resetAllValues() {
        this.JsonFormCompatibility = false;
        this.ReactJsonSchemaFormCompatibility = false;
        this.AngularSchemaFormCompatibility = false;
        this.tpldata = {};
        this.validateFormData = null;
        this.formValues = {};
        this.schema = {};
        this.layout = [];
        this.formGroupTemplate = {};
        this.formGroup = null;
        this.framework = null;
        this.data = {};
        this.validData = null;
        this.isValid = null;
        this.validationErrors = null;
        this.arrayMap = new Map();
        this.dataMap = new Map();
        this.dataRecursiveRefMap = new Map();
        this.schemaRecursiveRefMap = new Map();
        this.layoutRefLibrary = {};
        this.schemaRefLibrary = {};
        this.templateRefLibrary = {};
        this.formOptions = cloneDeep(this.defaultFormOptions);
    }
    /**
     * 'buildRemoteError' function
     *
     * Example errors:
     * {
     *   last_name: [ {
     *     message: 'Last name must by start with capital letter.',
     *     code: 'capital_letter'
     *   } ],
     *   email: [ {
     *     message: 'Email must be from example.com domain.',
     *     code: 'special_domain'
     *   }, {
     *     message: 'Email must contain an \@ symbol.',
     *     code: 'at_symbol'
     *   } ]
     * }
     * //{ErrorMessages} errors
     * @param {?} errors
     * @return {?}
     */
    buildRemoteError(errors) {
        forEach(errors, (/**
         * @param {?} value
         * @param {?} key
         * @return {?}
         */
        (value, key) => {
            if (key in this.formGroup.controls) {
                for (const error of value) {
                    /** @type {?} */
                    const err = {};
                    err[error["code"]] = error["message"];
                    this.formGroup.get(key).setErrors(err, { emitEvent: true });
                }
            }
        }));
    }
    /**
     * @param {?} newValue
     * @param {?=} updateSubscriptions
     * @return {?}
     */
    validateData(newValue, updateSubscriptions = true) {
        // Format raw form data to correct data types
        this.data = formatFormData(newValue, this.dataMap, this.dataRecursiveRefMap, this.arrayMap, this.formOptions.returnEmptyFields);
        this.isValid = this.validateFormData(this.data);
        this.validData = this.isValid ? this.data : null;
        /** @type {?} */
        const compileErrors = (/**
         * @param {?} errors
         * @return {?}
         */
        (errors) => {
            /** @type {?} */
            const compiledErrors = {};
            (errors || []).forEach((/**
             * @param {?} error
             * @return {?}
             */
            (error) => {
                if (!compiledErrors[error.dataPath]) {
                    compiledErrors[error.dataPath] = [];
                }
                compiledErrors[error.dataPath].push(error.message);
            }));
            return compiledErrors;
        });
        this.ajvErrors = this.validateFormData.errors;
        this.validationErrors = compileErrors(this.validateFormData.errors);
        if (updateSubscriptions) {
            this.dataChanges.next(this.data);
            this.isValidChanges.next(this.isValid);
            this.validationErrorChanges.next(this.ajvErrors);
        }
    }
    /**
     * @param {?=} formValues
     * @param {?=} setValues
     * @return {?}
     */
    buildFormGroupTemplate(formValues = null, setValues = true) {
        this.formGroupTemplate = buildFormGroupTemplate(this, formValues, setValues);
    }
    /**
     * @return {?}
     */
    buildFormGroup() {
        this.formGroup = (/** @type {?} */ (buildFormGroup(this.formGroupTemplate)));
        if (this.formGroup) {
            this.compileAjvSchema();
            this.validateData(this.formGroup.value);
            // Set up observables to emit data and validation info when form data changes
            if (this.formValueSubscription) {
                this.formValueSubscription.unsubscribe();
            }
            this.formValueSubscription = this.formGroup.valueChanges.subscribe((/**
             * @param {?} formValue
             * @return {?}
             */
            (formValue) => this.validateData(formValue)));
        }
    }
    /**
     * @param {?} widgetLibrary
     * @return {?}
     */
    buildLayout(widgetLibrary) {
        this.layout = buildLayout(this, widgetLibrary);
    }
    /**
     * @param {?} newOptions
     * @return {?}
     */
    setOptions(newOptions) {
        if (isObject(newOptions)) {
            /** @type {?} */
            const addOptions = cloneDeep(newOptions);
            // Backward compatibility for 'defaultOptions' (renamed 'defautWidgetOptions')
            if (isObject(addOptions.defaultOptions)) {
                Object.assign(this.formOptions.defautWidgetOptions, addOptions.defaultOptions);
                delete addOptions.defaultOptions;
            }
            if (isObject(addOptions.defautWidgetOptions)) {
                Object.assign(this.formOptions.defautWidgetOptions, addOptions.defautWidgetOptions);
                delete addOptions.defautWidgetOptions;
            }
            Object.assign(this.formOptions, addOptions);
            // convert disableErrorState / disableSuccessState to enable...
            /** @type {?} */
            const globalDefaults = this.formOptions.defautWidgetOptions;
            ["ErrorState", "SuccessState"]
                .filter((/**
             * @param {?} suffix
             * @return {?}
             */
            (suffix) => hasOwn(globalDefaults, "disable" + suffix)))
                .forEach((/**
             * @param {?} suffix
             * @return {?}
             */
            (suffix) => {
                globalDefaults["enable" + suffix] = !globalDefaults["disable" + suffix];
                delete globalDefaults["disable" + suffix];
            }));
        }
    }
    /**
     * @return {?}
     */
    compileAjvSchema() {
        if (!this.validateFormData) {
            // if 'ui:order' exists in properties, move it to root before compiling with ajv
            if (Array.isArray(this.schema.properties["ui:order"])) {
                this.schema["ui:order"] = this.schema.properties["ui:order"];
                delete this.schema.properties["ui:order"];
            }
            this.ajv.removeSchema(this.schema);
            this.validateFormData = this.ajv.compile(this.schema);
        }
    }
    /**
     * @param {?=} data
     * @param {?=} requireAllFields
     * @return {?}
     */
    buildSchemaFromData(data, requireAllFields = false) {
        if (data) {
            return buildSchemaFromData(data, requireAllFields);
        }
        this.schema = buildSchemaFromData(this.formValues, requireAllFields);
    }
    /**
     * @param {?=} layout
     * @return {?}
     */
    buildSchemaFromLayout(layout) {
        if (layout) {
            return buildSchemaFromLayout(layout);
        }
        this.schema = buildSchemaFromLayout(this.layout);
    }
    /**
     * @param {?=} newTpldata
     * @return {?}
     */
    setTpldata(newTpldata = {}) {
        this.tpldata = newTpldata;
    }
    /**
     * @param {?=} text
     * @param {?=} value
     * @param {?=} values
     * @param {?=} key
     * @return {?}
     */
    parseText(text = "", value = {}, values = {}, key = null) {
        if (!text || !/{{.+?}}/.test(text)) {
            return text;
        }
        return text.replace(/{{(.+?)}}/g, (/**
         * @param {...?} a
         * @return {?}
         */
        (...a) => this.parseExpression(a[1], value, values, key, this.tpldata)));
    }
    /**
     * @param {?=} expression
     * @param {?=} value
     * @param {?=} values
     * @param {?=} key
     * @param {?=} tpldata
     * @return {?}
     */
    parseExpression(expression = "", value = {}, values = {}, key = null, tpldata = null) {
        if (typeof expression !== "string") {
            return "";
        }
        /** @type {?} */
        const index = typeof key === "number" ? key + 1 + "" : key || "";
        expression = expression.trim();
        if ((expression[0] === "'" || expression[0] === '"') &&
            expression[0] === expression[expression.length - 1] &&
            expression.slice(1, expression.length - 1).indexOf(expression[0]) === -1) {
            return expression.slice(1, expression.length - 1);
        }
        if (expression === "idx" || expression === "$index") {
            return index;
        }
        if (expression === "value" && !hasOwn(values, "value")) {
            return value;
        }
        if (['"', "'", " ", "||", "&&", "+"].every((/**
         * @param {?} delim
         * @return {?}
         */
        (delim) => expression.indexOf(delim) === -1))) {
            /** @type {?} */
            const pointer = JsonPointer.parseObjectPath(expression);
            return pointer[0] === "value" && JsonPointer.has(value, pointer.slice(1))
                ? JsonPointer.get(value, pointer.slice(1))
                : pointer[0] === "values" && JsonPointer.has(values, pointer.slice(1))
                    ? JsonPointer.get(values, pointer.slice(1))
                    : pointer[0] === "tpldata" && JsonPointer.has(tpldata, pointer.slice(1))
                        ? JsonPointer.get(tpldata, pointer.slice(1))
                        : JsonPointer.has(values, pointer)
                            ? JsonPointer.get(values, pointer)
                            : "";
        }
        if (expression.indexOf("[idx]") > -1) {
            expression = expression.replace(/\[idx\]/g, (/** @type {?} */ (index)));
        }
        if (expression.indexOf("[$index]") > -1) {
            expression = expression.replace(/\[$index\]/g, (/** @type {?} */ (index)));
        }
        // TODO: Improve expression evaluation by parsing quoted strings first
        // let expressionArray = expression.match(/([^"']+|"[^"]+"|'[^']+')/g);
        if (expression.indexOf("||") > -1) {
            return expression
                .split("||")
                .reduce((/**
             * @param {?} all
             * @param {?} term
             * @return {?}
             */
            (all, term) => all || this.parseExpression(term, value, values, key, tpldata)), "");
        }
        if (expression.indexOf("&&") > -1) {
            return expression
                .split("&&")
                .reduce((/**
             * @param {?} all
             * @param {?} term
             * @return {?}
             */
            (all, term) => all && this.parseExpression(term, value, values, key, tpldata)), " ")
                .trim();
        }
        if (expression.indexOf("+") > -1) {
            return expression
                .split("+")
                .map((/**
             * @param {?} term
             * @return {?}
             */
            (term) => this.parseExpression(term, value, values, key, tpldata)))
                .join("");
        }
        return "";
    }
    /**
     * @param {?=} parentCtx
     * @param {?=} childNode
     * @param {?=} index
     * @return {?}
     */
    setArrayItemTitle(parentCtx = {}, childNode = null, index = null) {
        /** @type {?} */
        const parentNode = parentCtx.layoutNode;
        /** @type {?} */
        const parentValues = this.getFormControlValue(parentCtx);
        /** @type {?} */
        const isArrayItem = (parentNode.type || "").slice(-5) === "array" && isArray(parentValues);
        /** @type {?} */
        const text = JsonPointer.getFirst(isArrayItem && childNode.type !== "$ref"
            ? [
                [childNode, "/options/legend"],
                [childNode, "/options/title"],
                [parentNode, "/options/title"],
                [parentNode, "/options/legend"],
            ]
            : [
                [childNode, "/options/title"],
                [childNode, "/options/legend"],
                [parentNode, "/options/title"],
                [parentNode, "/options/legend"],
            ]);
        if (!text) {
            return text;
        }
        /** @type {?} */
        const childValue = isArray(parentValues) && index < parentValues.length
            ? parentValues[index]
            : parentValues;
        return this.parseText(text, childValue, parentValues, index);
    }
    /**
     * @param {?} ctx
     * @return {?}
     */
    setItemTitle(ctx) {
        return !ctx.options.title && /^(\d+|-)$/.test(ctx.layoutNode.name)
            ? null
            : this.parseText(ctx.options.title || toTitleCase(ctx.layoutNode.name), this.getFormControlValue(this), (this.getFormControlGroup(this) || (/** @type {?} */ ({}))).value, ctx.dataIndex[ctx.dataIndex.length - 1]);
    }
    /**
     * @param {?} layoutNode
     * @param {?} dataIndex
     * @return {?}
     */
    evaluateCondition(layoutNode, dataIndex) {
        /** @type {?} */
        const arrayIndex = dataIndex && dataIndex[dataIndex.length - 1];
        /** @type {?} */
        let result = true;
        if (hasValue((layoutNode.options || {}).condition)) {
            if (typeof layoutNode.options.condition === "string") {
                /** @type {?} */
                let pointer = layoutNode.options.condition;
                if (hasValue(arrayIndex)) {
                    pointer = pointer.replace("[arrayIndex]", `[${arrayIndex}]`);
                }
                pointer = JsonPointer.parseObjectPath(pointer);
                result = !!JsonPointer.get(this.data, pointer);
                if (!result && pointer[0] === "model") {
                    result = !!JsonPointer.get({ model: this.data }, pointer);
                }
            }
            else if (typeof layoutNode.options.condition === "function") {
                result = layoutNode.options.condition(this.data);
            }
            else if (typeof layoutNode.options.condition.functionBody === "string") {
                try {
                    /** @type {?} */
                    const dynFn = new Function("model", "arrayIndices", layoutNode.options.condition.functionBody);
                    result = dynFn(this.data, dataIndex);
                }
                catch (e) {
                    result = true;
                    console.error("condition functionBody errored out on evaluation: " +
                        layoutNode.options.condition.functionBody);
                }
            }
        }
        return result;
    }
    /**
     * @param {?} ctx
     * @param {?=} bind
     * @return {?}
     */
    initializeControl(ctx, bind = true) {
        if (!isObject(ctx)) {
            return false;
        }
        if (isEmpty(ctx.options)) {
            ctx.options = !isEmpty((ctx.layoutNode || {}).options)
                ? ctx.layoutNode.options
                : cloneDeep(this.formOptions);
        }
        ctx.formControl = this.getFormControl(ctx);
        ctx.boundControl = bind && !!ctx.formControl;
        if (ctx.formControl) {
            ctx.controlName = this.getFormControlName(ctx);
            ctx.controlValue = ctx.formControl.value;
            ctx.controlDisabled = ctx.formControl.disabled;
            // Initial error message
            ctx.options.errorMessage =
                ctx.formControl.status === "VALID"
                    ? null
                    : this.formatErrors(ctx.formControl.errors, ctx.options.validationMessages);
            ctx.options.showErrors =
                this.formOptions.validateOnRender === true ||
                    (this.formOptions.validateOnRender === "auto" &&
                        hasValue(ctx.controlValue));
            // Subscription for error messages
            // ctx.formControl.statusChanges.subscribe(
            //   (status) =>
            //     (ctx.options.errorMessage =
            //       status === "VALID"
            //         ? null
            //         : this.formatErrors(
            //             ctx.formControl.errors,
            //             ctx.options.validationMessages
            //           ))
            // );
            this.validationErrorChanges.subscribe((/**
             * @param {?} errors
             * @return {?}
             */
            (errors) => {
                ctx.options.errorMessage = `${errors}`;
            }));
            ctx.formControl.valueChanges.subscribe((/**
             * @param {?} value
             * @return {?}
             */
            (value) => {
                if (!!value) {
                    ctx.controlValue = value;
                }
            }));
        }
        else {
            ctx.controlName = ctx.layoutNode.name;
            ctx.controlValue = ctx.layoutNode.value || null;
            /** @type {?} */
            const dataPointer = this.getDataPointer(ctx);
            if (bind && dataPointer) {
                console.error(`warning: control "${dataPointer}" is not bound to the Angular FormGroup.`);
            }
        }
        return ctx.boundControl;
    }
    /**
     * @param {?} errors
     * @param {?=} validationMessages
     * @return {?}
     */
    formatErrors(errors, validationMessages = {}) {
        if (isEmpty(errors)) {
            return null;
        }
        if (!isObject(validationMessages)) {
            validationMessages = {};
        }
        /** @type {?} */
        const addSpaces = (/**
         * @param {?} string
         * @return {?}
         */
        (string) => string[0].toUpperCase() +
            (string.slice(1) || "")
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/_/g, " "));
        /** @type {?} */
        const formatError = (/**
         * @param {?} error
         * @return {?}
         */
        (error) => typeof error === "object"
            ? Object.keys(error)
                .map((/**
             * @param {?} key
             * @return {?}
             */
            (key) => error[key] === true
                ? addSpaces(key)
                : error[key] === false
                    ? "Not " + addSpaces(key)
                    : addSpaces(key) + ": " + formatError(error[key])))
                .join(", ")
            : addSpaces(error.toString()));
        /** @type {?} */
        const messages = [];
        return (Object.keys(errors)
            // Hide 'required' error, unless it is the only one
            .filter((/**
         * @param {?} errorKey
         * @return {?}
         */
        (errorKey) => errorKey !== "required" || Object.keys(errors).length === 1))
            .map((/**
         * @param {?} errorKey
         * @return {?}
         */
        (errorKey) => 
        // If validationMessages is a string, return it
        typeof validationMessages === "string"
            ? validationMessages
            : // If custom error message is a function, return function result
                typeof validationMessages[errorKey] === "function"
                    ? validationMessages[errorKey](errors[errorKey])
                    : // If custom error message is a string, replace placeholders and return
                        typeof validationMessages[errorKey] === "string"
                            ? // Does error message have any {{property}} placeholders?
                                !/{{.+?}}/.test(validationMessages[errorKey])
                                    ? validationMessages[errorKey]
                                    : // Replace {{property}} placeholders with values
                                        Object.keys(errors[errorKey]).reduce((/**
                                         * @param {?} errorMessage
                                         * @param {?} errorProperty
                                         * @return {?}
                                         */
                                        (errorMessage, errorProperty) => errorMessage.replace(new RegExp("{{" + errorProperty + "}}", "g"), errors[errorKey][errorProperty])), validationMessages[errorKey])
                            : // If no custom error message, return formatted error data instead
                                addSpaces(errorKey) + " Error: " + formatError(errors[errorKey])))
            .join("<br>"));
    }
    /**
     * @param {?} ctx
     * @param {?} value
     * @return {?}
     */
    updateValue(ctx, value) {
        // Set value of current control
        ctx.controlValue = value;
        if (ctx.boundControl) {
            ctx.formControl.setValue(value);
            ctx.formControl.markAsDirty();
        }
        ctx.layoutNode.value = value;
        // Set values of any related controls in copyValueTo array
        if (isArray(ctx.options.copyValueTo)) {
            for (const item of ctx.options.copyValueTo) {
                /** @type {?} */
                const targetControl = getControl(this.formGroup, item);
                if (isObject(targetControl) &&
                    typeof targetControl.setValue === "function") {
                    targetControl.setValue(value);
                    targetControl.markAsDirty();
                }
            }
        }
    }
    /**
     * @param {?} ctx
     * @param {?} checkboxList
     * @return {?}
     */
    updateArrayCheckboxList(ctx, checkboxList) {
        /** @type {?} */
        const formArray = (/** @type {?} */ (this.getFormControl(ctx)));
        // Remove all existing items
        while (formArray.value.length) {
            formArray.removeAt(0);
        }
        // Re-add an item for each checked box
        /** @type {?} */
        const refPointer = removeRecursiveReferences(ctx.layoutNode.dataPointer + "/-", this.dataRecursiveRefMap, this.arrayMap);
        for (const checkboxItem of checkboxList) {
            if (checkboxItem.checked) {
                /** @type {?} */
                const newFormControl = buildFormGroup(this.templateRefLibrary[refPointer]);
                newFormControl.setValue(checkboxItem.value);
                formArray.push(newFormControl);
            }
        }
        formArray.markAsDirty();
    }
    /**
     * @param {?} ctx
     * @return {?}
     */
    getFormControl(ctx) {
        if (!ctx.layoutNode ||
            !isDefined(ctx.layoutNode.dataPointer) ||
            ctx.layoutNode.type === "$ref") {
            return null;
        }
        return getControl(this.formGroup, this.getDataPointer(ctx));
    }
    /**
     * @param {?} ctx
     * @return {?}
     */
    getFormControlValue(ctx) {
        if (!ctx.layoutNode ||
            !isDefined(ctx.layoutNode.dataPointer) ||
            ctx.layoutNode.type === "$ref") {
            return null;
        }
        /** @type {?} */
        const control = getControl(this.formGroup, this.getDataPointer(ctx));
        return control ? control.value : null;
    }
    /**
     * @param {?} ctx
     * @return {?}
     */
    getFormControlGroup(ctx) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer)) {
            return null;
        }
        return getControl(this.formGroup, this.getDataPointer(ctx), true);
    }
    /**
     * @param {?} ctx
     * @return {?}
     */
    getFormControlName(ctx) {
        if (!ctx.layoutNode ||
            !isDefined(ctx.layoutNode.dataPointer) ||
            !hasValue(ctx.dataIndex)) {
            return null;
        }
        return JsonPointer.toKey(this.getDataPointer(ctx));
    }
    /**
     * @param {?} ctx
     * @return {?}
     */
    getLayoutArray(ctx) {
        return JsonPointer.get(this.layout, this.getLayoutPointer(ctx), 0, -1);
    }
    /**
     * @param {?} ctx
     * @return {?}
     */
    getParentNode(ctx) {
        return JsonPointer.get(this.layout, this.getLayoutPointer(ctx), 0, -2);
    }
    /**
     * @param {?} ctx
     * @return {?}
     */
    getDataPointer(ctx) {
        if (!ctx.layoutNode ||
            !isDefined(ctx.layoutNode.dataPointer) ||
            !hasValue(ctx.dataIndex)) {
            return null;
        }
        return JsonPointer.toIndexedPointer(ctx.layoutNode.dataPointer, ctx.dataIndex, this.arrayMap);
    }
    /**
     * @param {?} ctx
     * @return {?}
     */
    getLayoutPointer(ctx) {
        if (!hasValue(ctx.layoutIndex)) {
            return null;
        }
        return "/" + ctx.layoutIndex.join("/items/");
    }
    /**
     * @param {?} ctx
     * @return {?}
     */
    isControlBound(ctx) {
        if (!ctx.layoutNode ||
            !isDefined(ctx.layoutNode.dataPointer) ||
            !hasValue(ctx.dataIndex)) {
            return false;
        }
        /** @type {?} */
        const controlGroup = this.getFormControlGroup(ctx);
        /** @type {?} */
        const name = this.getFormControlName(ctx);
        return controlGroup ? hasOwn(controlGroup.controls, name) : false;
    }
    /**
     * @param {?} ctx
     * @param {?=} name
     * @return {?}
     */
    addItem(ctx, name) {
        if (!ctx.layoutNode ||
            !isDefined(ctx.layoutNode.$ref) ||
            !hasValue(ctx.dataIndex) ||
            !hasValue(ctx.layoutIndex)) {
            return false;
        }
        // Create a new Angular form control from a template in templateRefLibrary
        /** @type {?} */
        const newFormGroup = buildFormGroup(this.templateRefLibrary[ctx.layoutNode.$ref]);
        // Add the new form control to the parent formArray or formGroup
        if (ctx.layoutNode.arrayItem) {
            // Add new array item to formArray
            ((/** @type {?} */ (this.getFormControlGroup(ctx)))).push(newFormGroup);
        }
        else {
            // Add new $ref item to formGroup
            ((/** @type {?} */ (this.getFormControlGroup(ctx)))).addControl(name || this.getFormControlName(ctx), newFormGroup);
        }
        // Copy a new layoutNode from layoutRefLibrary
        /** @type {?} */
        const newLayoutNode = getLayoutNode(ctx.layoutNode, this);
        newLayoutNode.arrayItem = ctx.layoutNode.arrayItem;
        if (ctx.layoutNode.arrayItemType) {
            newLayoutNode.arrayItemType = ctx.layoutNode.arrayItemType;
        }
        else {
            delete newLayoutNode.arrayItemType;
        }
        if (name) {
            newLayoutNode.name = name;
            newLayoutNode.dataPointer += "/" + JsonPointer.escape(name);
            newLayoutNode.options.title = fixTitle(name);
        }
        // Add the new layoutNode to the form layout
        JsonPointer.insert(this.layout, this.getLayoutPointer(ctx), newLayoutNode);
        return true;
    }
    /**
     * @param {?} ctx
     * @param {?} oldIndex
     * @param {?} newIndex
     * @return {?}
     */
    moveArrayItem(ctx, oldIndex, newIndex) {
        if (!ctx.layoutNode ||
            !isDefined(ctx.layoutNode.dataPointer) ||
            !hasValue(ctx.dataIndex) ||
            !hasValue(ctx.layoutIndex) ||
            !isDefined(oldIndex) ||
            !isDefined(newIndex) ||
            oldIndex === newIndex) {
            return false;
        }
        // Move item in the formArray
        /** @type {?} */
        const formArray = (/** @type {?} */ (this.getFormControlGroup(ctx)));
        /** @type {?} */
        const arrayItem = formArray.at(oldIndex);
        formArray.removeAt(oldIndex);
        formArray.insert(newIndex, arrayItem);
        formArray.updateValueAndValidity();
        // Move layout item
        /** @type {?} */
        const layoutArray = this.getLayoutArray(ctx);
        layoutArray.splice(newIndex, 0, layoutArray.splice(oldIndex, 1)[0]);
        return true;
    }
    /**
     * @param {?} ctx
     * @return {?}
     */
    removeItem(ctx) {
        if (!ctx.layoutNode ||
            !isDefined(ctx.layoutNode.dataPointer) ||
            !hasValue(ctx.dataIndex) ||
            !hasValue(ctx.layoutIndex)) {
            return false;
        }
        // Remove the Angular form control from the parent formArray or formGroup
        if (ctx.layoutNode.arrayItem) {
            // Remove array item from formArray
            ((/** @type {?} */ (this.getFormControlGroup(ctx)))).removeAt(ctx.dataIndex[ctx.dataIndex.length - 1]);
        }
        else {
            // Remove $ref item from formGroup
            ((/** @type {?} */ (this.getFormControlGroup(ctx)))).removeControl(this.getFormControlName(ctx));
        }
        // Remove layoutNode from layout
        JsonPointer.remove(this.layout, this.getLayoutPointer(ctx));
        return true;
    }
}
JsonSchemaFormService.decorators = [
    { type: Injectable, args: [{
                providedIn: "root",
            },] }
];
/** @nocollapse */
JsonSchemaFormService.ctorParameters = () => [];
/** @nocollapse */ JsonSchemaFormService.ngInjectableDef = ɵɵdefineInjectable({ factory: function JsonSchemaFormService_Factory() { return new JsonSchemaFormService(); }, token: JsonSchemaFormService, providedIn: "root" });
if (false) {
    /** @type {?} */
    JsonSchemaFormService.prototype.JsonFormCompatibility;
    /** @type {?} */
    JsonSchemaFormService.prototype.ReactJsonSchemaFormCompatibility;
    /** @type {?} */
    JsonSchemaFormService.prototype.AngularSchemaFormCompatibility;
    /** @type {?} */
    JsonSchemaFormService.prototype.tpldata;
    /** @type {?} */
    JsonSchemaFormService.prototype.ajvOptions;
    /** @type {?} */
    JsonSchemaFormService.prototype.ajv;
    /** @type {?} */
    JsonSchemaFormService.prototype.validateFormData;
    /** @type {?} */
    JsonSchemaFormService.prototype.formValues;
    /** @type {?} */
    JsonSchemaFormService.prototype.data;
    /** @type {?} */
    JsonSchemaFormService.prototype.schema;
    /** @type {?} */
    JsonSchemaFormService.prototype.layout;
    /** @type {?} */
    JsonSchemaFormService.prototype.formGroupTemplate;
    /** @type {?} */
    JsonSchemaFormService.prototype.formGroup;
    /** @type {?} */
    JsonSchemaFormService.prototype.framework;
    /** @type {?} */
    JsonSchemaFormService.prototype.formOptions;
    /** @type {?} */
    JsonSchemaFormService.prototype.validData;
    /** @type {?} */
    JsonSchemaFormService.prototype.isValid;
    /** @type {?} */
    JsonSchemaFormService.prototype.ajvErrors;
    /** @type {?} */
    JsonSchemaFormService.prototype.validationErrors;
    /** @type {?} */
    JsonSchemaFormService.prototype.dataErrors;
    /** @type {?} */
    JsonSchemaFormService.prototype.formValueSubscription;
    /** @type {?} */
    JsonSchemaFormService.prototype.dataChanges;
    /** @type {?} */
    JsonSchemaFormService.prototype.isValidChanges;
    /** @type {?} */
    JsonSchemaFormService.prototype.validationErrorChanges;
    /** @type {?} */
    JsonSchemaFormService.prototype.arrayMap;
    /** @type {?} */
    JsonSchemaFormService.prototype.dataMap;
    /** @type {?} */
    JsonSchemaFormService.prototype.dataRecursiveRefMap;
    /** @type {?} */
    JsonSchemaFormService.prototype.schemaRecursiveRefMap;
    /** @type {?} */
    JsonSchemaFormService.prototype.schemaRefLibrary;
    /** @type {?} */
    JsonSchemaFormService.prototype.layoutRefLibrary;
    /** @type {?} */
    JsonSchemaFormService.prototype.templateRefLibrary;
    /** @type {?} */
    JsonSchemaFormService.prototype.hasRootReference;
    /** @type {?} */
    JsonSchemaFormService.prototype.language;
    /** @type {?} */
    JsonSchemaFormService.prototype.defaultFormOptions;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AddReferenceComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
        this.jsf = jsf;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.options = this.layoutNode.options || {};
    }
    /**
     * @return {?}
     */
    get showAddButton() {
        return !this.layoutNode.arrayItem ||
            this.layoutIndex[this.layoutIndex.length - 1] < this.options.maxItems;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    addItem(event) {
        event.preventDefault();
        this.jsf.addItem(this);
    }
    /**
     * @return {?}
     */
    get buttonText() {
        /** @type {?} */
        const parent = {
            dataIndex: this.dataIndex.slice(0, -1),
            layoutIndex: this.layoutIndex.slice(0, -1),
            layoutNode: this.jsf.getParentNode(this)
        };
        return parent.layoutNode.add ||
            this.jsf.setArrayItemTitle(parent, this.layoutNode, this.itemCount);
    }
}
AddReferenceComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'add-reference-widget',
                template: `
    <button *ngIf="showAddButton"
      [class]="options?.fieldHtmlClass || ''"
      [disabled]="options?.readonly"
      (click)="addItem($event)">
      <span *ngIf="options?.icon" [class]="options?.icon"></span>
      <span *ngIf="options?.title" [innerHTML]="buttonText"></span>
    </button>`,
                changeDetection: ChangeDetectionStrategy.Default
            }] }
];
/** @nocollapse */
AddReferenceComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
AddReferenceComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    AddReferenceComponent.prototype.options;
    /** @type {?} */
    AddReferenceComponent.prototype.itemCount;
    /** @type {?} */
    AddReferenceComponent.prototype.previousLayoutIndex;
    /** @type {?} */
    AddReferenceComponent.prototype.previousDataIndex;
    /** @type {?} */
    AddReferenceComponent.prototype.layoutNode;
    /** @type {?} */
    AddReferenceComponent.prototype.layoutIndex;
    /** @type {?} */
    AddReferenceComponent.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    AddReferenceComponent.prototype.jsf;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ButtonComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    updateValue(event) {
        if (typeof this.options.onClick === 'function') {
            this.options.onClick(event);
        }
        else {
            this.jsf.updateValue(this, event.target.value);
        }
    }
}
ButtonComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'button-widget',
                template: `
    <div
      [class]="options?.htmlClass || ''">
      <button
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [class]="options?.fieldHtmlClass || ''"
        [disabled]="controlDisabled"
        [name]="controlName"
        [type]="layoutNode?.type"
        [value]="controlValue"
        (click)="updateValue($event)">
        <span *ngIf="options?.icon || options?.title"
          [class]="options?.icon"
          [innerHTML]="options?.title"></span>
      </button>
    </div>`
            }] }
];
/** @nocollapse */
ButtonComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
ButtonComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    ButtonComponent.prototype.formControl;
    /** @type {?} */
    ButtonComponent.prototype.controlName;
    /** @type {?} */
    ButtonComponent.prototype.controlValue;
    /** @type {?} */
    ButtonComponent.prototype.controlDisabled;
    /** @type {?} */
    ButtonComponent.prototype.boundControl;
    /** @type {?} */
    ButtonComponent.prototype.options;
    /** @type {?} */
    ButtonComponent.prototype.layoutNode;
    /** @type {?} */
    ButtonComponent.prototype.layoutIndex;
    /** @type {?} */
    ButtonComponent.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    ButtonComponent.prototype.jsf;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class CheckboxComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.trueValue = true;
        this.falseValue = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        if (this.controlValue === null || this.controlValue === undefined) {
            this.controlValue = this.options.title;
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    updateValue(event) {
        event.preventDefault();
        this.jsf.updateValue(this, event.target.checked ? this.trueValue : this.falseValue);
    }
    /**
     * @return {?}
     */
    get isChecked() {
        return this.jsf.getFormControlValue(this) === this.trueValue;
    }
}
CheckboxComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'checkbox-widget',
                template: `
    <label
      [attr.for]="'control' + layoutNode?._id"
      [class]="options?.itemLabelHtmlClass || ''">
      <input *ngIf="boundControl"
        [formControl]="formControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [class]="(options?.fieldHtmlClass || '') + (isChecked ?
          (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :
          (' ' + (options?.style?.unselected || '')))"
        [id]="'control' + layoutNode?._id"
        [name]="controlName"
        [readonly]="options?.readonly ? 'readonly' : null"
        type="checkbox">
      <input *ngIf="!boundControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [checked]="isChecked ? 'checked' : null"
        [class]="(options?.fieldHtmlClass || '') + (isChecked ?
          (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :
          (' ' + (options?.style?.unselected || '')))"
        [disabled]="controlDisabled"
        [id]="'control' + layoutNode?._id"
        [name]="controlName"
        [readonly]="options?.readonly ? 'readonly' : null"
        [value]="controlValue"
        type="checkbox"
        (change)="updateValue($event)">
      <span *ngIf="options?.title"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></span>
    </label>`
            }] }
];
/** @nocollapse */
CheckboxComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
CheckboxComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    CheckboxComponent.prototype.formControl;
    /** @type {?} */
    CheckboxComponent.prototype.controlName;
    /** @type {?} */
    CheckboxComponent.prototype.controlValue;
    /** @type {?} */
    CheckboxComponent.prototype.controlDisabled;
    /** @type {?} */
    CheckboxComponent.prototype.boundControl;
    /** @type {?} */
    CheckboxComponent.prototype.options;
    /** @type {?} */
    CheckboxComponent.prototype.trueValue;
    /** @type {?} */
    CheckboxComponent.prototype.falseValue;
    /** @type {?} */
    CheckboxComponent.prototype.layoutNode;
    /** @type {?} */
    CheckboxComponent.prototype.layoutIndex;
    /** @type {?} */
    CheckboxComponent.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    CheckboxComponent.prototype.jsf;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class CheckboxesComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.checkboxList = [];
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.layoutOrientation = (this.layoutNode.type === 'checkboxes-inline' ||
            this.layoutNode.type === 'checkboxbuttons') ? 'horizontal' : 'vertical';
        this.jsf.initializeControl(this);
        this.checkboxList = buildTitleMap(this.options.titleMap || this.options.enumNames, this.options.enum, true);
        if (this.boundControl) {
            /** @type {?} */
            const formArray = this.jsf.getFormControl(this);
            this.checkboxList.forEach((/**
             * @param {?} checkboxItem
             * @return {?}
             */
            checkboxItem => checkboxItem.checked = formArray.value.includes(checkboxItem.value)));
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    updateValue(event) {
        for (const checkboxItem of this.checkboxList) {
            if (event.target.value === checkboxItem.value) {
                checkboxItem.checked = event.target.checked;
            }
        }
        if (this.boundControl) {
            this.jsf.updateArrayCheckboxList(this, this.checkboxList);
        }
    }
}
CheckboxesComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'checkboxes-widget',
                template: `
    <label *ngIf="options?.title"
      [class]="options?.labelHtmlClass || ''"
      [style.display]="options?.notitle ? 'none' : ''"
      [innerHTML]="options?.title"></label>

    <!-- 'horizontal' = checkboxes-inline or checkboxbuttons -->
    <div *ngIf="layoutOrientation === 'horizontal'" [class]="options?.htmlClass || ''">
      <label *ngFor="let checkboxItem of checkboxList"
        [attr.for]="'control' + layoutNode?._id + '/' + checkboxItem.value"
        [class]="(options?.itemLabelHtmlClass || '') + (checkboxItem.checked ?
          (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :
          (' ' + (options?.style?.unselected || '')))">
        <input type="checkbox"
          [attr.required]="options?.required"
          [checked]="checkboxItem.checked"
          [class]="options?.fieldHtmlClass || ''"
          [disabled]="controlDisabled"
          [id]="'control' + layoutNode?._id + '/' + checkboxItem.value"
          [name]="checkboxItem?.name"
          [readonly]="options?.readonly ? 'readonly' : null"
          [value]="checkboxItem.value"
          (change)="updateValue($event)">
        <span [innerHTML]="checkboxItem.name"></span>
      </label>
    </div>

    <!-- 'vertical' = regular checkboxes -->
    <div *ngIf="layoutOrientation === 'vertical'">
      <div *ngFor="let checkboxItem of checkboxList" [class]="options?.htmlClass || ''">
        <label
          [attr.for]="'control' + layoutNode?._id + '/' + checkboxItem.value"
          [class]="(options?.itemLabelHtmlClass || '') + (checkboxItem.checked ?
            (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :
            (' ' + (options?.style?.unselected || '')))">
          <input type="checkbox"
            [attr.required]="options?.required"
            [checked]="checkboxItem.checked"
            [class]="options?.fieldHtmlClass || ''"
            [disabled]="controlDisabled"
            [id]="options?.name + '/' + checkboxItem.value"
            [name]="checkboxItem?.name"
            [readonly]="options?.readonly ? 'readonly' : null"
            [value]="checkboxItem.value"
            (change)="updateValue($event)">
          <span [innerHTML]="checkboxItem?.name"></span>
        </label>
      </div>
    </div>`
            }] }
];
/** @nocollapse */
CheckboxesComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
CheckboxesComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    CheckboxesComponent.prototype.formControl;
    /** @type {?} */
    CheckboxesComponent.prototype.controlName;
    /** @type {?} */
    CheckboxesComponent.prototype.controlValue;
    /** @type {?} */
    CheckboxesComponent.prototype.controlDisabled;
    /** @type {?} */
    CheckboxesComponent.prototype.boundControl;
    /** @type {?} */
    CheckboxesComponent.prototype.options;
    /** @type {?} */
    CheckboxesComponent.prototype.layoutOrientation;
    /** @type {?} */
    CheckboxesComponent.prototype.formArray;
    /** @type {?} */
    CheckboxesComponent.prototype.checkboxList;
    /** @type {?} */
    CheckboxesComponent.prototype.layoutNode;
    /** @type {?} */
    CheckboxesComponent.prototype.layoutIndex;
    /** @type {?} */
    CheckboxesComponent.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    CheckboxesComponent.prototype.jsf;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// TODO: Add this control
class FileComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    updateValue(event) {
        this.jsf.updateValue(this, event.target.value);
    }
}
FileComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'file-widget',
                template: ``
            }] }
];
/** @nocollapse */
FileComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
FileComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    FileComponent.prototype.formControl;
    /** @type {?} */
    FileComponent.prototype.controlName;
    /** @type {?} */
    FileComponent.prototype.controlValue;
    /** @type {?} */
    FileComponent.prototype.controlDisabled;
    /** @type {?} */
    FileComponent.prototype.boundControl;
    /** @type {?} */
    FileComponent.prototype.options;
    /** @type {?} */
    FileComponent.prototype.layoutNode;
    /** @type {?} */
    FileComponent.prototype.layoutIndex;
    /** @type {?} */
    FileComponent.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    FileComponent.prototype.jsf;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class InputComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.autoCompleteList = [];
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    updateValue(event) {
        this.jsf.updateValue(this, event.target.value);
    }
}
InputComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'input-widget',
                template: `
    <div [class]="options?.htmlClass || ''">
      <label *ngIf="options?.title"
        [attr.for]="'control' + layoutNode?._id"
        [class]="options?.labelHtmlClass || ''"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></label>
      <input *ngIf="boundControl"
        [formControl]="formControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [attr.list]="'control' + layoutNode?._id + 'Autocomplete'"
        [attr.maxlength]="options?.maxLength"
        [attr.minlength]="options?.minLength"
        [attr.pattern]="options?.pattern"
        [attr.placeholder]="options?.placeholder"
        [attr.required]="options?.required"
        [class]="options?.fieldHtmlClass || ''"
        [id]="'control' + layoutNode?._id"
        [name]="controlName"
        [readonly]="options?.readonly ? 'readonly' : null"
        [type]="layoutNode?.type">
      <input *ngIf="!boundControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [attr.list]="'control' + layoutNode?._id + 'Autocomplete'"
        [attr.maxlength]="options?.maxLength"
        [attr.minlength]="options?.minLength"
        [attr.pattern]="options?.pattern"
        [attr.placeholder]="options?.placeholder"
        [attr.required]="options?.required"
        [class]="options?.fieldHtmlClass || ''"
        [disabled]="controlDisabled"
        [id]="'control' + layoutNode?._id"
        [name]="controlName"
        [readonly]="options?.readonly ? 'readonly' : null"
        [type]="layoutNode?.type"
        [value]="controlValue"
        (input)="updateValue($event)">
        <datalist *ngIf="options?.typeahead?.source"
          [id]="'control' + layoutNode?._id + 'Autocomplete'">
          <option *ngFor="let word of options?.typeahead?.source" [value]="word">
        </datalist>
    </div>`
            }] }
];
/** @nocollapse */
InputComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
InputComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    InputComponent.prototype.formControl;
    /** @type {?} */
    InputComponent.prototype.controlName;
    /** @type {?} */
    InputComponent.prototype.controlValue;
    /** @type {?} */
    InputComponent.prototype.controlDisabled;
    /** @type {?} */
    InputComponent.prototype.boundControl;
    /** @type {?} */
    InputComponent.prototype.options;
    /** @type {?} */
    InputComponent.prototype.autoCompleteList;
    /** @type {?} */
    InputComponent.prototype.layoutNode;
    /** @type {?} */
    InputComponent.prototype.layoutIndex;
    /** @type {?} */
    InputComponent.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    InputComponent.prototype.jsf;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class MessageComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
        this.jsf = jsf;
        this.message = null;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.message = this.options.help || this.options.helpvalue ||
            this.options.msg || this.options.message;
    }
}
MessageComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'message-widget',
                template: `
    <span *ngIf="message"
      [class]="options?.labelHtmlClass || ''"
      [innerHTML]="message"></span>`
            }] }
];
/** @nocollapse */
MessageComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
MessageComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    MessageComponent.prototype.options;
    /** @type {?} */
    MessageComponent.prototype.message;
    /** @type {?} */
    MessageComponent.prototype.layoutNode;
    /** @type {?} */
    MessageComponent.prototype.layoutIndex;
    /** @type {?} */
    MessageComponent.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    MessageComponent.prototype.jsf;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NoneComponent {
}
NoneComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'none-widget',
                template: ``
            }] }
];
NoneComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    NoneComponent.prototype.layoutNode;
    /** @type {?} */
    NoneComponent.prototype.layoutIndex;
    /** @type {?} */
    NoneComponent.prototype.dataIndex;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NumberComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.allowNegative = true;
        this.allowDecimal = true;
        this.allowExponents = false;
        this.lastValidNumber = '';
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        if (this.layoutNode.dataType === 'integer') {
            this.allowDecimal = false;
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    updateValue(event) {
        this.jsf.updateValue(this, event.target.value);
    }
}
NumberComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'number-widget',
                template: `
    <div [class]="options?.htmlClass || ''">
      <label *ngIf="options?.title"
        [attr.for]="'control' + layoutNode?._id"
        [class]="options?.labelHtmlClass || ''"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></label>
      <input *ngIf="boundControl"
        [formControl]="formControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [attr.max]="options?.maximum"
        [attr.min]="options?.minimum"
        [attr.placeholder]="options?.placeholder"
        [attr.required]="options?.required"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [attr.step]="options?.multipleOf || options?.step || 'any'"
        [class]="options?.fieldHtmlClass || ''"
        [id]="'control' + layoutNode?._id"
        [name]="controlName"
        [readonly]="options?.readonly ? 'readonly' : null"
        [title]="lastValidNumber"
        [type]="layoutNode?.type === 'range' ? 'range' : 'number'">
      <input *ngIf="!boundControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [attr.max]="options?.maximum"
        [attr.min]="options?.minimum"
        [attr.placeholder]="options?.placeholder"
        [attr.required]="options?.required"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [attr.step]="options?.multipleOf || options?.step || 'any'"
        [class]="options?.fieldHtmlClass || ''"
        [disabled]="controlDisabled"
        [id]="'control' + layoutNode?._id"
        [name]="controlName"
        [readonly]="options?.readonly ? 'readonly' : null"
        [title]="lastValidNumber"
        [type]="layoutNode?.type === 'range' ? 'range' : 'number'"
        [value]="controlValue"
        (input)="updateValue($event)">
      <span *ngIf="layoutNode?.type === 'range'" [innerHTML]="controlValue"></span>
    </div>`
            }] }
];
/** @nocollapse */
NumberComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
NumberComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    NumberComponent.prototype.formControl;
    /** @type {?} */
    NumberComponent.prototype.controlName;
    /** @type {?} */
    NumberComponent.prototype.controlValue;
    /** @type {?} */
    NumberComponent.prototype.controlDisabled;
    /** @type {?} */
    NumberComponent.prototype.boundControl;
    /** @type {?} */
    NumberComponent.prototype.options;
    /** @type {?} */
    NumberComponent.prototype.allowNegative;
    /** @type {?} */
    NumberComponent.prototype.allowDecimal;
    /** @type {?} */
    NumberComponent.prototype.allowExponents;
    /** @type {?} */
    NumberComponent.prototype.lastValidNumber;
    /** @type {?} */
    NumberComponent.prototype.layoutNode;
    /** @type {?} */
    NumberComponent.prototype.layoutIndex;
    /** @type {?} */
    NumberComponent.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    NumberComponent.prototype.jsf;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// TODO: Add this control
class OneOfComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    updateValue(event) {
        this.jsf.updateValue(this, event.target.value);
    }
}
OneOfComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'one-of-widget',
                template: ``
            }] }
];
/** @nocollapse */
OneOfComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
OneOfComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    OneOfComponent.prototype.formControl;
    /** @type {?} */
    OneOfComponent.prototype.controlName;
    /** @type {?} */
    OneOfComponent.prototype.controlValue;
    /** @type {?} */
    OneOfComponent.prototype.controlDisabled;
    /** @type {?} */
    OneOfComponent.prototype.boundControl;
    /** @type {?} */
    OneOfComponent.prototype.options;
    /** @type {?} */
    OneOfComponent.prototype.layoutNode;
    /** @type {?} */
    OneOfComponent.prototype.layoutIndex;
    /** @type {?} */
    OneOfComponent.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    OneOfComponent.prototype.jsf;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class RadiosComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.layoutOrientation = 'vertical';
        this.radiosList = [];
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.options = this.layoutNode.options || {};
        if (this.layoutNode.type === 'radios-inline' ||
            this.layoutNode.type === 'radiobuttons') {
            this.layoutOrientation = 'horizontal';
        }
        this.radiosList = buildTitleMap(this.options.titleMap || this.options.enumNames, this.options.enum, true);
        this.jsf.initializeControl(this);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    updateValue(event) {
        this.jsf.updateValue(this, event.target.value);
    }
}
RadiosComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'radios-widget',
                template: `
    <label *ngIf="options?.title"
      [attr.for]="'control' + layoutNode?._id"
      [class]="options?.labelHtmlClass || ''"
      [style.display]="options?.notitle ? 'none' : ''"
      [innerHTML]="options?.title"></label>

    <!-- 'horizontal' = radios-inline or radiobuttons -->
    <div *ngIf="layoutOrientation === 'horizontal'"
      [class]="options?.htmlClass || ''">
      <label *ngFor="let radioItem of radiosList"
        [attr.for]="'control' + layoutNode?._id + '/' + radioItem?.value"
        [class]="(options?.itemLabelHtmlClass || '') +
          ((controlValue + '' === radioItem?.value + '') ?
          (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :
          (' ' + (options?.style?.unselected || '')))">
        <input type="radio"
          [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
          [attr.readonly]="options?.readonly ? 'readonly' : null"
          [attr.required]="options?.required"
          [checked]="radioItem?.value === controlValue"
          [class]="options?.fieldHtmlClass || ''"
          [disabled]="controlDisabled"
          [id]="'control' + layoutNode?._id + '/' + radioItem?.value"
          [name]="controlName"
          [value]="radioItem?.value"
          (change)="updateValue($event)">
        <span [innerHTML]="radioItem?.name"></span>
      </label>
    </div>

    <!-- 'vertical' = regular radios -->
    <div *ngIf="layoutOrientation !== 'horizontal'">
      <div *ngFor="let radioItem of radiosList"
        [class]="options?.htmlClass || ''">
        <label
          [attr.for]="'control' + layoutNode?._id + '/' + radioItem?.value"
          [class]="(options?.itemLabelHtmlClass || '') +
            ((controlValue + '' === radioItem?.value + '') ?
            (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :
            (' ' + (options?.style?.unselected || '')))">
          <input type="radio"
            [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
            [attr.readonly]="options?.readonly ? 'readonly' : null"
            [attr.required]="options?.required"
            [checked]="radioItem?.value === controlValue"
            [class]="options?.fieldHtmlClass || ''"
            [disabled]="controlDisabled"
            [id]="'control' + layoutNode?._id + '/' + radioItem?.value"
            [name]="controlName"
            [value]="radioItem?.value"
            (change)="updateValue($event)">
          <span [innerHTML]="radioItem?.name"></span>
        </label>
      </div>
    </div>`
            }] }
];
/** @nocollapse */
RadiosComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
RadiosComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    RadiosComponent.prototype.formControl;
    /** @type {?} */
    RadiosComponent.prototype.controlName;
    /** @type {?} */
    RadiosComponent.prototype.controlValue;
    /** @type {?} */
    RadiosComponent.prototype.controlDisabled;
    /** @type {?} */
    RadiosComponent.prototype.boundControl;
    /** @type {?} */
    RadiosComponent.prototype.options;
    /** @type {?} */
    RadiosComponent.prototype.layoutOrientation;
    /** @type {?} */
    RadiosComponent.prototype.radiosList;
    /** @type {?} */
    RadiosComponent.prototype.layoutNode;
    /** @type {?} */
    RadiosComponent.prototype.layoutIndex;
    /** @type {?} */
    RadiosComponent.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    RadiosComponent.prototype.jsf;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class RootComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
        this.jsf = jsf;
        this.isFlexItem = false;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    isDraggable(node) {
        return node.arrayItem && node.type !== '$ref' &&
            node.arrayItemType === 'list' && this.isOrderable !== false;
    }
    // Set attributes for flexbox child
    // (container attributes are set in section.component)
    /**
     * @param {?} node
     * @param {?} attribute
     * @return {?}
     */
    getFlexAttribute(node, attribute) {
        /** @type {?} */
        const index = ['flex-grow', 'flex-shrink', 'flex-basis'].indexOf(attribute);
        return ((node.options || {}).flex || '').split(/\s+/)[index] ||
            (node.options || {})[attribute] || ['1', '1', 'auto'][index];
    }
    /**
     * @param {?} layoutNode
     * @return {?}
     */
    showWidget(layoutNode) {
        return this.jsf.evaluateCondition(layoutNode, this.dataIndex);
    }
}
RootComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'root-widget',
                template: `
    <div *ngFor="let layoutItem of layout; let i = index"
      [class.form-flex-item]="isFlexItem"
      [style.align-self]="(layoutItem.options || {})['align-self']"
      [style.flex-basis]="getFlexAttribute(layoutItem, 'flex-basis')"
      [style.flex-grow]="getFlexAttribute(layoutItem, 'flex-grow')"
      [style.flex-shrink]="getFlexAttribute(layoutItem, 'flex-shrink')"
      [style.order]="(layoutItem.options || {}).order">
      <div
        [dataIndex]="layoutItem?.arrayItem ? (dataIndex || []).concat(i) : (dataIndex || [])"
        [layoutIndex]="(layoutIndex || []).concat(i)"
        [layoutNode]="layoutItem"
        [orderable]="isDraggable(layoutItem)">
        <select-framework-widget *ngIf="showWidget(layoutItem)"
          [dataIndex]="layoutItem?.arrayItem ? (dataIndex || []).concat(i) : (dataIndex || [])"
          [layoutIndex]="(layoutIndex || []).concat(i)"
          [layoutNode]="layoutItem"></select-framework-widget>
      </div>
    </div>`,
                styles: [`
    [draggable=true] {
      transition: all 150ms cubic-bezier(.4, 0, .2, 1);
    }
    [draggable=true]:hover {
      cursor: move;
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
      position: relative; z-index: 10;
      margin-top: -1px;
      margin-left: -1px;
      margin-right: 1px;
      margin-bottom: 1px;
    }
    [draggable=true].drag-target-top {
      box-shadow: 0 -2px 0 #000;
      position: relative; z-index: 20;
    }
    [draggable=true].drag-target-bottom {
      box-shadow: 0 2px 0 #000;
      position: relative; z-index: 20;
    }
  `]
            }] }
];
/** @nocollapse */
RootComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
RootComponent.propDecorators = {
    dataIndex: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    layout: [{ type: Input }],
    isOrderable: [{ type: Input }],
    isFlexItem: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    RootComponent.prototype.options;
    /** @type {?} */
    RootComponent.prototype.dataIndex;
    /** @type {?} */
    RootComponent.prototype.layoutIndex;
    /** @type {?} */
    RootComponent.prototype.layout;
    /** @type {?} */
    RootComponent.prototype.isOrderable;
    /** @type {?} */
    RootComponent.prototype.isFlexItem;
    /**
     * @type {?}
     * @private
     */
    RootComponent.prototype.jsf;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SectionComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
        this.jsf = jsf;
        this.expanded = true;
    }
    /**
     * @return {?}
     */
    get sectionTitle() {
        return this.options.notitle ? null : this.jsf.setItemTitle(this);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.jsf.initializeControl(this);
        this.options = this.layoutNode.options || {};
        this.expanded = typeof this.options.expanded === 'boolean' ?
            this.options.expanded : !this.options.expandable;
        switch (this.layoutNode.type) {
            case 'fieldset':
            case 'array':
            case 'tab':
            case 'advancedfieldset':
            case 'authfieldset':
            case 'optionfieldset':
            case 'selectfieldset':
                this.containerType = 'fieldset';
                break;
            default: // 'div', 'flex', 'section', 'conditional', 'actions', 'tagsinput'
                this.containerType = 'div';
                break;
        }
    }
    /**
     * @return {?}
     */
    toggleExpanded() {
        if (this.options.expandable) {
            this.expanded = !this.expanded;
        }
    }
    // Set attributes for flexbox container
    // (child attributes are set in root.component)
    /**
     * @param {?} attribute
     * @return {?}
     */
    getFlexAttribute(attribute) {
        /** @type {?} */
        const flexActive = this.layoutNode.type === 'flex' ||
            !!this.options.displayFlex ||
            this.options.display === 'flex';
        if (attribute !== 'flex' && !flexActive) {
            return null;
        }
        switch (attribute) {
            case 'is-flex':
                return flexActive;
            case 'display':
                return flexActive ? 'flex' : 'initial';
            case 'flex-direction':
            case 'flex-wrap':
                /** @type {?} */
                const index = ['flex-direction', 'flex-wrap'].indexOf(attribute);
                return (this.options['flex-flow'] || '').split(/\s+/)[index] ||
                    this.options[attribute] || ['column', 'nowrap'][index];
            case 'justify-content':
            case 'align-items':
            case 'align-content':
                return this.options[attribute];
        }
    }
}
SectionComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'section-widget',
                template: `
    <div *ngIf="containerType === 'div'"
      [class]="options?.htmlClass || ''"
      [class.expandable]="options?.expandable && !expanded"
      [class.expanded]="options?.expandable && expanded">
      <label *ngIf="sectionTitle"
        class="legend"
        [class]="options?.labelHtmlClass || ''"
        [innerHTML]="sectionTitle"
        (click)="toggleExpanded()"></label>
      <root-widget *ngIf="expanded"
        [dataIndex]="dataIndex"
        [layout]="layoutNode.items"
        [layoutIndex]="layoutIndex"
        [isFlexItem]="getFlexAttribute('is-flex')"
        [isOrderable]="options?.orderable"
        [class.form-flex-column]="getFlexAttribute('flex-direction') === 'column'"
        [class.form-flex-row]="getFlexAttribute('flex-direction') === 'row'"
        [style.align-content]="getFlexAttribute('align-content')"
        [style.align-items]="getFlexAttribute('align-items')"
        [style.display]="getFlexAttribute('display')"
        [style.flex-direction]="getFlexAttribute('flex-direction')"
        [style.flex-wrap]="getFlexAttribute('flex-wrap')"
        [style.justify-content]="getFlexAttribute('justify-content')"></root-widget>
    </div>
    <fieldset *ngIf="containerType === 'fieldset'"
      [class]="options?.htmlClass || ''"
      [class.expandable]="options?.expandable && !expanded"
      [class.expanded]="options?.expandable && expanded"
      [disabled]="options?.readonly">
      <legend *ngIf="sectionTitle"
        class="legend"
        [class]="options?.labelHtmlClass || ''"
        [innerHTML]="sectionTitle"
        (click)="toggleExpanded()"></legend>
      <div *ngIf="options?.messageLocation !== 'bottom'">
        <p *ngIf="options?.description"
        class="help-block"
        [class]="options?.labelHelpBlockClass || ''"
        [innerHTML]="options?.description"></p>
      </div>
      <root-widget *ngIf="expanded"
        [dataIndex]="dataIndex"
        [layout]="layoutNode.items"
        [layoutIndex]="layoutIndex"
        [isFlexItem]="getFlexAttribute('is-flex')"
        [isOrderable]="options?.orderable"
        [class.form-flex-column]="getFlexAttribute('flex-direction') === 'column'"
        [class.form-flex-row]="getFlexAttribute('flex-direction') === 'row'"
        [style.align-content]="getFlexAttribute('align-content')"
        [style.align-items]="getFlexAttribute('align-items')"
        [style.display]="getFlexAttribute('display')"
        [style.flex-direction]="getFlexAttribute('flex-direction')"
        [style.flex-wrap]="getFlexAttribute('flex-wrap')"
        [style.justify-content]="getFlexAttribute('justify-content')"></root-widget>
      <div *ngIf="options?.messageLocation === 'bottom'">
        <p *ngIf="options?.description"
        class="help-block"
        [class]="options?.labelHelpBlockClass || ''"
        [innerHTML]="options?.description"></p>
      </div>
    </fieldset>`,
                styles: [`
    .legend { font-weight: bold; }
    .expandable > legend:before, .expandable > label:before  { content: '▶'; padding-right: .3em; }
    .expanded > legend:before, .expanded > label:before  { content: '▼'; padding-right: .2em; }
  `]
            }] }
];
/** @nocollapse */
SectionComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
SectionComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    SectionComponent.prototype.options;
    /** @type {?} */
    SectionComponent.prototype.expanded;
    /** @type {?} */
    SectionComponent.prototype.containerType;
    /** @type {?} */
    SectionComponent.prototype.layoutNode;
    /** @type {?} */
    SectionComponent.prototype.layoutIndex;
    /** @type {?} */
    SectionComponent.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    SectionComponent.prototype.jsf;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SelectComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.selectList = [];
        this.isArray = isArray;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.selectList = buildTitleMap(this.options.titleMap || this.options.enumNames, this.options.enum, !!this.options.required, !!this.options.flatList);
        this.jsf.initializeControl(this);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    updateValue(event) {
        this.jsf.updateValue(this, event.target.value);
    }
}
SelectComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'select-widget',
                template: `
    <div
      [class]="options?.htmlClass || ''">
      <label *ngIf="options?.title"
        [attr.for]="'control' + layoutNode?._id"
        [class]="options?.labelHtmlClass || ''"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></label>
      <select *ngIf="boundControl"
        [formControl]="formControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [attr.required]="options?.required"
        [class]="options?.fieldHtmlClass || ''"
        [id]="'control' + layoutNode?._id"
        [name]="controlName">
        <ng-template ngFor let-selectItem [ngForOf]="selectList">
          <option *ngIf="!isArray(selectItem?.items)"
            [value]="selectItem?.value">
            <span [innerHTML]="selectItem?.name"></span>
          </option>
          <optgroup *ngIf="isArray(selectItem?.items)"
            [label]="selectItem?.group">
            <option *ngFor="let subItem of selectItem.items"
              [value]="subItem?.value">
              <span [innerHTML]="subItem?.name"></span>
            </option>
          </optgroup>
        </ng-template>
      </select>
      <select *ngIf="!boundControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [attr.required]="options?.required"
        [class]="options?.fieldHtmlClass || ''"
        [disabled]="controlDisabled"
        [id]="'control' + layoutNode?._id"
        [name]="controlName"
        (change)="updateValue($event)">
        <ng-template ngFor let-selectItem [ngForOf]="selectList">
          <option *ngIf="!isArray(selectItem?.items)"
            [selected]="selectItem?.value === controlValue"
            [value]="selectItem?.value">
            <span [innerHTML]="selectItem?.name"></span>
          </option>
          <optgroup *ngIf="isArray(selectItem?.items)"
            [label]="selectItem?.group">
            <option *ngFor="let subItem of selectItem.items"
              [attr.selected]="subItem?.value === controlValue"
              [value]="subItem?.value">
              <span [innerHTML]="subItem?.name"></span>
            </option>
          </optgroup>
        </ng-template>
      </select>
    </div>`
            }] }
];
/** @nocollapse */
SelectComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
SelectComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    SelectComponent.prototype.formControl;
    /** @type {?} */
    SelectComponent.prototype.controlName;
    /** @type {?} */
    SelectComponent.prototype.controlValue;
    /** @type {?} */
    SelectComponent.prototype.controlDisabled;
    /** @type {?} */
    SelectComponent.prototype.boundControl;
    /** @type {?} */
    SelectComponent.prototype.options;
    /** @type {?} */
    SelectComponent.prototype.selectList;
    /** @type {?} */
    SelectComponent.prototype.isArray;
    /** @type {?} */
    SelectComponent.prototype.layoutNode;
    /** @type {?} */
    SelectComponent.prototype.layoutIndex;
    /** @type {?} */
    SelectComponent.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    SelectComponent.prototype.jsf;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SelectFrameworkComponent {
    /**
     * @param {?} componentFactory
     * @param {?} jsf
     */
    constructor(componentFactory, jsf) {
        this.componentFactory = componentFactory;
        this.jsf = jsf;
        this.newComponent = null;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.updateComponent();
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        this.updateComponent();
    }
    /**
     * @return {?}
     */
    updateComponent() {
        if (this.widgetContainer && !this.newComponent && this.jsf.framework) {
            this.newComponent = this.widgetContainer.createComponent(this.componentFactory.resolveComponentFactory(this.jsf.framework));
        }
        if (this.newComponent) {
            for (const input of ['layoutNode', 'layoutIndex', 'dataIndex']) {
                this.newComponent.instance[input] = this[input];
            }
        }
    }
}
SelectFrameworkComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'select-framework-widget',
                template: `<div #widgetContainer></div>`
            }] }
];
/** @nocollapse */
SelectFrameworkComponent.ctorParameters = () => [
    { type: ComponentFactoryResolver },
    { type: JsonSchemaFormService }
];
SelectFrameworkComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }],
    widgetContainer: [{ type: ViewChild, args: ['widgetContainer', {
                    read: ViewContainerRef,
                    static: true
                },] }]
};
if (false) {
    /** @type {?} */
    SelectFrameworkComponent.prototype.newComponent;
    /** @type {?} */
    SelectFrameworkComponent.prototype.layoutNode;
    /** @type {?} */
    SelectFrameworkComponent.prototype.layoutIndex;
    /** @type {?} */
    SelectFrameworkComponent.prototype.dataIndex;
    /** @type {?} */
    SelectFrameworkComponent.prototype.widgetContainer;
    /**
     * @type {?}
     * @private
     */
    SelectFrameworkComponent.prototype.componentFactory;
    /**
     * @type {?}
     * @private
     */
    SelectFrameworkComponent.prototype.jsf;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SelectWidgetComponent {
    /**
     * @param {?} componentFactory
     * @param {?} jsf
     */
    constructor(componentFactory, jsf) {
        this.componentFactory = componentFactory;
        this.jsf = jsf;
        this.newComponent = null;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.updateComponent();
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        this.updateComponent();
    }
    /**
     * @return {?}
     */
    updateComponent() {
        if (this.widgetContainer && !this.newComponent && (this.layoutNode || {}).widget) {
            this.newComponent = this.widgetContainer.createComponent(this.componentFactory.resolveComponentFactory(this.layoutNode.widget));
        }
        if (this.newComponent) {
            for (const input of ['layoutNode', 'layoutIndex', 'dataIndex']) {
                this.newComponent.instance[input] = this[input];
            }
        }
    }
}
SelectWidgetComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'select-widget-widget',
                template: `<div #widgetContainer></div>`
            }] }
];
/** @nocollapse */
SelectWidgetComponent.ctorParameters = () => [
    { type: ComponentFactoryResolver },
    { type: JsonSchemaFormService }
];
SelectWidgetComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }],
    widgetContainer: [{ type: ViewChild, args: ['widgetContainer', { read: ViewContainerRef, static: true },] }]
};
if (false) {
    /** @type {?} */
    SelectWidgetComponent.prototype.newComponent;
    /** @type {?} */
    SelectWidgetComponent.prototype.layoutNode;
    /** @type {?} */
    SelectWidgetComponent.prototype.layoutIndex;
    /** @type {?} */
    SelectWidgetComponent.prototype.dataIndex;
    /** @type {?} */
    SelectWidgetComponent.prototype.widgetContainer;
    /**
     * @type {?}
     * @private
     */
    SelectWidgetComponent.prototype.componentFactory;
    /**
     * @type {?}
     * @private
     */
    SelectWidgetComponent.prototype.jsf;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SubmitComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        if (hasOwn(this.options, 'disabled')) {
            this.controlDisabled = this.options.disabled;
        }
        else if (this.jsf.formOptions.disableInvalidSubmit) {
            this.controlDisabled = !this.jsf.isValid;
            this.jsf.isValidChanges.subscribe((/**
             * @param {?} isValid
             * @return {?}
             */
            isValid => this.controlDisabled = !isValid));
        }
        if (this.controlValue === null || this.controlValue === undefined) {
            this.controlValue = this.options.title;
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    updateValue(event) {
        if (typeof this.options.onClick === 'function') {
            this.options.onClick(event);
        }
        else {
            this.jsf.updateValue(this, event.target.value);
        }
    }
}
SubmitComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'submit-widget',
                template: `
    <div
      [class]="options?.htmlClass || ''">
      <input
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [attr.required]="options?.required"
        [class]="options?.fieldHtmlClass || ''"
        [disabled]="controlDisabled"
        [id]="'control' + layoutNode?._id"
        [name]="controlName"
        [type]="layoutNode?.type"
        [value]="controlValue"
        (click)="updateValue($event)">
    </div>`
            }] }
];
/** @nocollapse */
SubmitComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
SubmitComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    SubmitComponent.prototype.formControl;
    /** @type {?} */
    SubmitComponent.prototype.controlName;
    /** @type {?} */
    SubmitComponent.prototype.controlValue;
    /** @type {?} */
    SubmitComponent.prototype.controlDisabled;
    /** @type {?} */
    SubmitComponent.prototype.boundControl;
    /** @type {?} */
    SubmitComponent.prototype.options;
    /** @type {?} */
    SubmitComponent.prototype.layoutNode;
    /** @type {?} */
    SubmitComponent.prototype.layoutIndex;
    /** @type {?} */
    SubmitComponent.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    SubmitComponent.prototype.jsf;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class TabsComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
        this.jsf = jsf;
        this.selectedItem = 0;
        this.showAddTab = true;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.itemCount = this.layoutNode.items.length - 1;
        this.updateControl();
    }
    /**
     * @param {?} index
     * @return {?}
     */
    select(index) {
        if (this.layoutNode.items[index].type === '$ref') {
            this.itemCount = this.layoutNode.items.length;
            this.jsf.addItem({
                layoutNode: this.layoutNode.items[index],
                layoutIndex: this.layoutIndex.concat(index),
                dataIndex: this.dataIndex.concat(index)
            });
            this.updateControl();
        }
        this.selectedItem = index;
    }
    /**
     * @return {?}
     */
    updateControl() {
        /** @type {?} */
        const lastItem = this.layoutNode.items[this.layoutNode.items.length - 1];
        if (lastItem.type === '$ref' &&
            this.itemCount >= (lastItem.options.maxItems || 1000)) {
            this.showAddTab = false;
        }
    }
    /**
     * @param {?} item
     * @param {?} index
     * @return {?}
     */
    setTabTitle(item, index) {
        return this.jsf.setArrayItemTitle(this, item, index);
    }
}
TabsComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'tabs-widget',
                template: `
    <ul
      [class]="options?.labelHtmlClass || ''">
      <li *ngFor="let item of layoutNode?.items; let i = index"
        [class]="(options?.itemLabelHtmlClass || '') + (selectedItem === i ?
          (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :
          (' ' + options?.style?.unselected))"
        role="presentation"
        data-tabs>
        <a *ngIf="showAddTab || item.type !== '$ref'"
           [class]="'nav-link' + (selectedItem === i ? (' ' + options?.activeClass + ' ' + options?.style?.selected) :
            (' ' + options?.style?.unselected))"
          [innerHTML]="setTabTitle(item, i)"
          (click)="select(i)"></a>
      </li>
    </ul>

    <div *ngFor="let layoutItem of layoutNode?.items; let i = index"
      [class]="options?.htmlClass || ''">

      <select-framework-widget *ngIf="selectedItem === i"
        [class]="(options?.fieldHtmlClass || '') +
          ' ' + (options?.activeClass || '') +
          ' ' + (options?.style?.selected || '')"
        [dataIndex]="layoutNode?.dataType === 'array' ? (dataIndex || []).concat(i) : dataIndex"
        [layoutIndex]="(layoutIndex || []).concat(i)"
        [layoutNode]="layoutItem"></select-framework-widget>

    </div>`,
                styles: [` a { cursor: pointer; } `]
            }] }
];
/** @nocollapse */
TabsComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
TabsComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    TabsComponent.prototype.options;
    /** @type {?} */
    TabsComponent.prototype.itemCount;
    /** @type {?} */
    TabsComponent.prototype.selectedItem;
    /** @type {?} */
    TabsComponent.prototype.showAddTab;
    /** @type {?} */
    TabsComponent.prototype.layoutNode;
    /** @type {?} */
    TabsComponent.prototype.layoutIndex;
    /** @type {?} */
    TabsComponent.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    TabsComponent.prototype.jsf;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class TemplateComponent {
    /**
     * @param {?} componentFactory
     * @param {?} jsf
     */
    constructor(componentFactory, jsf) {
        this.componentFactory = componentFactory;
        this.jsf = jsf;
        this.newComponent = null;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.updateComponent();
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        this.updateComponent();
    }
    /**
     * @return {?}
     */
    updateComponent() {
        if (this.widgetContainer && !this.newComponent && this.layoutNode.options.template) {
            this.newComponent = this.widgetContainer.createComponent(this.componentFactory.resolveComponentFactory(this.layoutNode.options.template));
        }
        if (this.newComponent) {
            for (const input of ['layoutNode', 'layoutIndex', 'dataIndex']) {
                this.newComponent.instance[input] = this[input];
            }
        }
    }
}
TemplateComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'template-widget',
                template: `<div #widgetContainer></div>`
            }] }
];
/** @nocollapse */
TemplateComponent.ctorParameters = () => [
    { type: ComponentFactoryResolver },
    { type: JsonSchemaFormService }
];
TemplateComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }],
    widgetContainer: [{ type: ViewChild, args: ['widgetContainer', { read: ViewContainerRef, static: true },] }]
};
if (false) {
    /** @type {?} */
    TemplateComponent.prototype.newComponent;
    /** @type {?} */
    TemplateComponent.prototype.layoutNode;
    /** @type {?} */
    TemplateComponent.prototype.layoutIndex;
    /** @type {?} */
    TemplateComponent.prototype.dataIndex;
    /** @type {?} */
    TemplateComponent.prototype.widgetContainer;
    /**
     * @type {?}
     * @private
     */
    TemplateComponent.prototype.componentFactory;
    /**
     * @type {?}
     * @private
     */
    TemplateComponent.prototype.jsf;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class TextareaComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    updateValue(event) {
        this.jsf.updateValue(this, event.target.value);
    }
}
TextareaComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'textarea-widget',
                template: `
    <div
      [class]="options?.htmlClass || ''">
      <label *ngIf="options?.title"
        [attr.for]="'control' + layoutNode?._id"
        [class]="options?.labelHtmlClass || ''"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></label>
      <textarea *ngIf="boundControl"
        [formControl]="formControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [attr.maxlength]="options?.maxLength"
        [attr.minlength]="options?.minLength"
        [attr.pattern]="options?.pattern"
        [attr.placeholder]="options?.placeholder"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [attr.required]="options?.required"
        [class]="options?.fieldHtmlClass || ''"
        [id]="'control' + layoutNode?._id"
        [name]="controlName"></textarea>
      <textarea *ngIf="!boundControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [attr.maxlength]="options?.maxLength"
        [attr.minlength]="options?.minLength"
        [attr.pattern]="options?.pattern"
        [attr.placeholder]="options?.placeholder"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [attr.required]="options?.required"
        [class]="options?.fieldHtmlClass || ''"
        [disabled]="controlDisabled"
        [id]="'control' + layoutNode?._id"
        [name]="controlName"
        [value]="controlValue"
        (input)="updateValue($event)">{{controlValue}}</textarea>
    </div>`
            }] }
];
/** @nocollapse */
TextareaComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
TextareaComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    TextareaComponent.prototype.formControl;
    /** @type {?} */
    TextareaComponent.prototype.controlName;
    /** @type {?} */
    TextareaComponent.prototype.controlValue;
    /** @type {?} */
    TextareaComponent.prototype.controlDisabled;
    /** @type {?} */
    TextareaComponent.prototype.boundControl;
    /** @type {?} */
    TextareaComponent.prototype.options;
    /** @type {?} */
    TextareaComponent.prototype.layoutNode;
    /** @type {?} */
    TextareaComponent.prototype.layoutIndex;
    /** @type {?} */
    TextareaComponent.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    TextareaComponent.prototype.jsf;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WidgetLibraryService {
    constructor() {
        this.defaultWidget = 'text';
        this.widgetLibrary = {
            // Angular JSON Schema Form administrative widgets
            'none': NoneComponent,
            // Placeholder, for development - displays nothing
            'root': RootComponent,
            // Form root, renders a complete layout
            'select-framework': SelectFrameworkComponent,
            // Applies the selected framework to a specified widget
            'select-widget': SelectWidgetComponent,
            // Displays a specified widget
            '$ref': AddReferenceComponent,
            // Button to add a new array item or $ref element
            // Free-form text HTML 'input' form control widgets <input type="...">
            'email': 'text',
            'integer': 'number',
            // Note: 'integer' is not a recognized HTML input type
            'number': NumberComponent,
            'password': 'text',
            'search': 'text',
            'tel': 'text',
            'text': InputComponent,
            'url': 'text',
            // Controlled text HTML 'input' form control widgets <input type="...">
            'color': 'text',
            'date': 'text',
            'datetime': 'text',
            'datetime-local': 'text',
            'month': 'text',
            'range': 'number',
            'time': 'text',
            'week': 'text',
            // Non-text HTML 'input' form control widgets <input type="...">
            // 'button': <input type="button"> not used, use <button> instead
            'checkbox': CheckboxComponent,
            // TODO: Set ternary = true for 3-state ??
            'file': FileComponent,
            // TODO: Finish 'file' widget
            'hidden': 'text',
            'image': 'text',
            // TODO: Figure out how to handle these
            'radio': 'radios',
            'reset': 'submit',
            // TODO: Figure out how to handle these
            'submit': SubmitComponent,
            // Other (non-'input') HTML form control widgets
            'button': ButtonComponent,
            'select': SelectComponent,
            // 'option': automatically generated by select widgets
            // 'optgroup': automatically generated by select widgets
            'textarea': TextareaComponent,
            // HTML form control widget sets
            'checkboxes': CheckboxesComponent,
            // Grouped list of checkboxes
            'checkboxes-inline': 'checkboxes',
            // Checkboxes in one line
            'checkboxbuttons': 'checkboxes',
            // Checkboxes as html buttons
            'radios': RadiosComponent,
            // Grouped list of radio buttons
            'radios-inline': 'radios',
            // Radio controls in one line
            'radiobuttons': 'radios',
            // Radio controls as html buttons
            // HTML Layout widgets
            // 'label': automatically added to data widgets
            // 'legend': automatically added to fieldsets
            'section': SectionComponent,
            // Just a div <div>
            'div': 'section',
            // Still just a div <div>
            'fieldset': 'section',
            // A fieldset, with an optional legend <fieldset>
            'flex': 'section',
            // A flexbox container <div style="display: flex">
            // Non-HTML layout widgets
            'one-of': OneOfComponent,
            // A select box that changes another input
            // TODO: Finish 'one-of' widget
            'array': 'section',
            // A list you can add, remove and reorder <fieldset>
            'tabarray': 'tabs',
            // A tabbed version of array
            'tab': 'section',
            // A tab group, similar to a fieldset or section <fieldset>
            'tabs': TabsComponent,
            // A tabbed set of panels with different controls
            'message': MessageComponent,
            // Insert arbitrary html
            'help': 'message',
            // Insert arbitrary html
            'msg': 'message',
            // Insert arbitrary html
            'html': 'message',
            // Insert arbitrary html
            'template': TemplateComponent,
            // Insert a custom Angular component
            // Widgets included for compatibility with JSON Form API
            'advancedfieldset': 'section',
            // Adds 'Advanced settings' title <fieldset>
            'authfieldset': 'section',
            // Adds 'Authentication settings' title <fieldset>
            'optionfieldset': 'one-of',
            // Option control, displays selected sub-item <fieldset>
            'selectfieldset': 'one-of',
            // Select control, displays selected sub-item <fieldset>
            'conditional': 'section',
            // Identical to 'section' (depeciated) <div>
            'actions': 'section',
            // Horizontal button list, can only submit, uses buttons as items <div>
            'tagsinput': 'section',
            // For entering short text tags <div>
            // See: http://ulion.github.io/jsonform/playground/?example=fields-checkboxbuttons
            // Widgets included for compatibility with React JSON Schema Form API
            'updown': 'number',
            'date-time': 'datetime-local',
            'alt-datetime': 'datetime-local',
            'alt-date': 'date',
            // Widgets included for compatibility with Angular Schema Form API
            'wizard': 'section',
            // TODO: Sequential panels with "Next" and "Previous" buttons
            // Widgets included for compatibility with other libraries
            'textline': 'text',
        };
        this.registeredWidgets = {};
        this.frameworkWidgets = {};
        this.activeWidgets = {};
        this.setActiveWidgets();
    }
    /**
     * @return {?}
     */
    setActiveWidgets() {
        this.activeWidgets = Object.assign({}, this.widgetLibrary, this.frameworkWidgets, this.registeredWidgets);
        for (const widgetName of Object.keys(this.activeWidgets)) {
            /** @type {?} */
            let widget = this.activeWidgets[widgetName];
            // Resolve aliases
            if (typeof widget === 'string') {
                /** @type {?} */
                const usedAliases = [];
                while (typeof widget === 'string' && !usedAliases.includes(widget)) {
                    usedAliases.push(widget);
                    widget = this.activeWidgets[widget];
                }
                if (typeof widget !== 'string') {
                    this.activeWidgets[widgetName] = widget;
                }
            }
        }
        return true;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    setDefaultWidget(type) {
        if (!this.hasWidget(type)) {
            return false;
        }
        this.defaultWidget = type;
        return true;
    }
    /**
     * @param {?} type
     * @param {?=} widgetSet
     * @return {?}
     */
    hasWidget(type, widgetSet = 'activeWidgets') {
        if (!type || typeof type !== 'string') {
            return false;
        }
        return hasOwn(this[widgetSet], type);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    hasDefaultWidget(type) {
        return this.hasWidget(type, 'widgetLibrary');
    }
    /**
     * @param {?} type
     * @param {?} widget
     * @return {?}
     */
    registerWidget(type, widget) {
        if (!type || !widget || typeof type !== 'string') {
            return false;
        }
        this.registeredWidgets[type] = widget;
        return this.setActiveWidgets();
    }
    /**
     * @param {?} type
     * @return {?}
     */
    unRegisterWidget(type) {
        if (!hasOwn(this.registeredWidgets, type)) {
            return false;
        }
        delete this.registeredWidgets[type];
        return this.setActiveWidgets();
    }
    /**
     * @param {?=} unRegisterFrameworkWidgets
     * @return {?}
     */
    unRegisterAllWidgets(unRegisterFrameworkWidgets = true) {
        this.registeredWidgets = {};
        if (unRegisterFrameworkWidgets) {
            this.frameworkWidgets = {};
        }
        return this.setActiveWidgets();
    }
    /**
     * @param {?} widgets
     * @return {?}
     */
    registerFrameworkWidgets(widgets) {
        if (widgets === null || typeof widgets !== 'object') {
            widgets = {};
        }
        this.frameworkWidgets = widgets;
        return this.setActiveWidgets();
    }
    /**
     * @return {?}
     */
    unRegisterFrameworkWidgets() {
        if (Object.keys(this.frameworkWidgets).length) {
            this.frameworkWidgets = {};
            return this.setActiveWidgets();
        }
        return false;
    }
    /**
     * @param {?=} type
     * @param {?=} widgetSet
     * @return {?}
     */
    getWidget(type, widgetSet = 'activeWidgets') {
        if (this.hasWidget(type, widgetSet)) {
            return this[widgetSet][type];
        }
        else if (this.hasWidget(this.defaultWidget, widgetSet)) {
            return this[widgetSet][this.defaultWidget];
        }
        else {
            return null;
        }
    }
    /**
     * @return {?}
     */
    getAllWidgets() {
        return {
            widgetLibrary: this.widgetLibrary,
            registeredWidgets: this.registeredWidgets,
            frameworkWidgets: this.frameworkWidgets,
            activeWidgets: this.activeWidgets,
        };
    }
}
WidgetLibraryService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
/** @nocollapse */
WidgetLibraryService.ctorParameters = () => [];
/** @nocollapse */ WidgetLibraryService.ngInjectableDef = ɵɵdefineInjectable({ factory: function WidgetLibraryService_Factory() { return new WidgetLibraryService(); }, token: WidgetLibraryService, providedIn: "root" });
if (false) {
    /** @type {?} */
    WidgetLibraryService.prototype.defaultWidget;
    /** @type {?} */
    WidgetLibraryService.prototype.widgetLibrary;
    /** @type {?} */
    WidgetLibraryService.prototype.registeredWidgets;
    /** @type {?} */
    WidgetLibraryService.prototype.frameworkWidgets;
    /** @type {?} */
    WidgetLibraryService.prototype.activeWidgets;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// Possible future frameworks:
// - Foundation 6:
//   http://justindavis.co/2017/06/15/using-foundation-6-in-angular-4/
//   https://github.com/zurb/foundation-sites
// - Semantic UI:
//   https://github.com/edcarroll/ng2-semantic-ui
//   https://github.com/vladotesanovic/ngSemantic
class FrameworkLibraryService {
    /**
     * @param {?} frameworks
     * @param {?} widgetLibrary
     */
    constructor(frameworks, widgetLibrary) {
        this.frameworks = frameworks;
        this.widgetLibrary = widgetLibrary;
        this.activeFramework = null;
        this.loadExternalAssets = false;
        this.frameworkLibrary = {};
        this.frameworks.forEach((/**
         * @param {?} framework
         * @return {?}
         */
        framework => this.frameworkLibrary[framework.name] = framework));
        this.defaultFramework = this.frameworks[0].name;
        this.setFramework(this.defaultFramework);
    }
    /**
     * @param {?=} loadExternalAssets
     * @return {?}
     */
    setLoadExternalAssets(loadExternalAssets = true) {
        this.loadExternalAssets = !!loadExternalAssets;
    }
    /**
     * @param {?=} framework
     * @param {?=} loadExternalAssets
     * @return {?}
     */
    setFramework(framework = this.defaultFramework, loadExternalAssets = this.loadExternalAssets) {
        this.activeFramework =
            typeof framework === 'string' && this.hasFramework(framework) ?
                this.frameworkLibrary[framework] :
                typeof framework === 'object' && hasOwn(framework, 'framework') ?
                    framework :
                    this.frameworkLibrary[this.defaultFramework];
        return this.registerFrameworkWidgets(this.activeFramework);
    }
    /**
     * @param {?} framework
     * @return {?}
     */
    registerFrameworkWidgets(framework) {
        return hasOwn(framework, 'widgets') ?
            this.widgetLibrary.registerFrameworkWidgets(framework.widgets) :
            this.widgetLibrary.unRegisterFrameworkWidgets();
    }
    /**
     * @param {?} type
     * @return {?}
     */
    hasFramework(type) {
        return hasOwn(this.frameworkLibrary, type);
    }
    /**
     * @return {?}
     */
    getFramework() {
        if (!this.activeFramework) {
            this.setFramework('default', true);
        }
        return this.activeFramework.framework;
    }
    /**
     * @return {?}
     */
    getFrameworkWidgets() {
        return this.activeFramework.widgets || {};
    }
    /**
     * @param {?=} load
     * @return {?}
     */
    getFrameworkStylesheets(load = this.loadExternalAssets) {
        return (load && this.activeFramework.stylesheets) || [];
    }
    /**
     * @param {?=} load
     * @return {?}
     */
    getFrameworkScripts(load = this.loadExternalAssets) {
        return (load && this.activeFramework.scripts) || [];
    }
}
FrameworkLibraryService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
/** @nocollapse */
FrameworkLibraryService.ctorParameters = () => [
    { type: Array, decorators: [{ type: Inject, args: [Framework,] }] },
    { type: WidgetLibraryService, decorators: [{ type: Inject, args: [WidgetLibraryService,] }] }
];
/** @nocollapse */ FrameworkLibraryService.ngInjectableDef = ɵɵdefineInjectable({ factory: function FrameworkLibraryService_Factory() { return new FrameworkLibraryService(ɵɵinject(Framework), ɵɵinject(WidgetLibraryService)); }, token: FrameworkLibraryService, providedIn: "root" });
if (false) {
    /** @type {?} */
    FrameworkLibraryService.prototype.activeFramework;
    /** @type {?} */
    FrameworkLibraryService.prototype.stylesheets;
    /** @type {?} */
    FrameworkLibraryService.prototype.scripts;
    /** @type {?} */
    FrameworkLibraryService.prototype.loadExternalAssets;
    /** @type {?} */
    FrameworkLibraryService.prototype.defaultFramework;
    /** @type {?} */
    FrameworkLibraryService.prototype.frameworkLibrary;
    /**
     * @type {?}
     * @private
     */
    FrameworkLibraryService.prototype.frameworks;
    /**
     * @type {?}
     * @private
     */
    FrameworkLibraryService.prototype.widgetLibrary;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * \@module 'JsonSchemaFormComponent' - Angular JSON Schema Form
 *
 * Root module of the Angular JSON Schema Form client-side library,
 * an Angular library which generates an HTML form from a JSON schema
 * structured data model and/or a JSON Schema Form layout description.
 *
 * This library also validates input data by the user, using both validators on
 * individual controls to provide real-time feedback while the user is filling
 * out the form, and then validating the entire input against the schema when
 * the form is submitted to make sure the returned JSON data object is valid.
 *
 * This library is similar to, and mostly API compatible with:
 *
 * - JSON Schema Form's Angular Schema Form library for AngularJs
 *   http://schemaform.io
 *   http://schemaform.io/examples/bootstrap-example.html (examples)
 *
 * - Mozilla's react-jsonschema-form library for React
 *   https://github.com/mozilla-services/react-jsonschema-form
 *   https://mozilla-services.github.io/react-jsonschema-form (examples)
 *
 * - Joshfire's JSON Form library for jQuery
 *   https://github.com/joshfire/jsonform
 *   http://ulion.github.io/jsonform/playground (examples)
 *
 * This library depends on:
 *  - Angular (obviously)                  https://angular.io
 *  - lodash, JavaScript utility library   https://github.com/lodash/lodash
 *  - ajv, Another JSON Schema validator   https://github.com/epoberezkin/ajv
 *
 * In addition, the Example Playground also depends on:
 *  - brace, Browserified Ace editor       http://thlorenz.github.io/brace
 */
class JsonSchemaFormComponent {
    /**
     * @param {?} changeDetector
     * @param {?} frameworkLibrary
     * @param {?} widgetLibrary
     * @param {?} jsf
     */
    constructor(changeDetector, frameworkLibrary, widgetLibrary, jsf) {
        this.changeDetector = changeDetector;
        this.frameworkLibrary = frameworkLibrary;
        this.widgetLibrary = widgetLibrary;
        this.jsf = jsf;
        // Debug information, if requested
        this.formValueSubscription = null;
        this.formInitialized = false;
        this.objectWrap = false; // Is non-object input schema wrapped in an object?
        // Name of the input providing the form data
        this.previousInputs = {
            schema: null, layout: null, data: null, options: null, framework: null,
            widgets: null, form: null, model: null, JSONSchema: null, UISchema: null,
            formData: null, loadExternalAssets: null, debug: null,
        };
        // Outputs
        this.onChanges = new EventEmitter(); // Live unvalidated internal form data
        // Live unvalidated internal form data
        this.onSubmit = new EventEmitter(); // Complete validated form data
        // Complete validated form data
        this.isValid = new EventEmitter(); // Is current data valid?
        // Is current data valid?
        this.validationErrors = new EventEmitter(); // Validation errors (if any)
        // Validation errors (if any)
        this.formSchema = new EventEmitter(); // Final schema used to create form
        // Final schema used to create form
        this.formLayout = new EventEmitter(); // Final layout used to create form
        // Final layout used to create form
        // Outputs for possible 2-way data binding
        // Only the one input providing the initial form data will be bound.
        // If there is no inital data, input '{}' to activate 2-way data binding.
        // There is no 2-way binding if inital data is combined inside the 'form' input.
        this.dataChange = new EventEmitter();
        this.modelChange = new EventEmitter();
        this.formDataChange = new EventEmitter();
        this.ngModelChange = new EventEmitter();
    }
    // Show debug information?
    /**
     * @return {?}
     */
    get value() {
        return this.objectWrap ? this.jsf.data['1'] : this.jsf.data;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set value(value) {
        this.setFormValues(value, false);
    }
    /**
     * @private
     * @return {?}
     */
    resetScriptsAndStyleSheets() {
        document.querySelectorAll('.ajsf').forEach((/**
         * @param {?} element
         * @return {?}
         */
        element => element.remove()));
    }
    /**
     * @private
     * @return {?}
     */
    loadScripts() {
        /** @type {?} */
        const scripts = this.frameworkLibrary.getFrameworkScripts();
        scripts.map((/**
         * @param {?} script
         * @return {?}
         */
        script => {
            /** @type {?} */
            const scriptTag = document.createElement('script');
            scriptTag.src = script;
            scriptTag.type = 'text/javascript';
            scriptTag.async = true;
            scriptTag.setAttribute('class', 'ajsf');
            document.getElementsByTagName('head')[0].appendChild(scriptTag);
        }));
    }
    /**
     * @private
     * @return {?}
     */
    loadStyleSheets() {
        /** @type {?} */
        const stylesheets = this.frameworkLibrary.getFrameworkStylesheets();
        stylesheets.map((/**
         * @param {?} stylesheet
         * @return {?}
         */
        stylesheet => {
            /** @type {?} */
            const linkTag = document.createElement('link');
            linkTag.rel = 'stylesheet';
            linkTag.href = stylesheet;
            linkTag.setAttribute('class', 'ajsf');
            document.getElementsByTagName('head')[0].appendChild(linkTag);
        }));
    }
    /**
     * @private
     * @return {?}
     */
    loadAssets() {
        this.resetScriptsAndStyleSheets();
        this.loadScripts();
        this.loadStyleSheets();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.updateForm();
        this.loadAssets();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        this.updateForm();
        // Check if there's changes in Framework then load assets if that's the
        if (changes.framework) {
            if (!changes.framework.isFirstChange() &&
                (changes.framework.previousValue !== changes.framework.currentValue)) {
                this.loadAssets();
            }
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.setFormValues(value, false);
        if (!this.formValuesInput) {
            this.formValuesInput = 'ngModel';
        }
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        if (this.jsf.formOptions.formDisabled !== !!isDisabled) {
            this.jsf.formOptions.formDisabled = !!isDisabled;
            this.initializeForm();
        }
    }
    /**
     * @return {?}
     */
    updateForm() {
        if (!this.formInitialized || !this.formValuesInput ||
            (this.language && this.language !== this.jsf.language)) {
            this.initializeForm();
        }
        else {
            if (this.language && this.language !== this.jsf.language) {
                this.jsf.setLanguage(this.language);
            }
            // Get names of changed inputs
            /** @type {?} */
            let changedInput = Object.keys(this.previousInputs)
                .filter((/**
             * @param {?} input
             * @return {?}
             */
            input => this.previousInputs[input] !== this[input]));
            /** @type {?} */
            let resetFirst = true;
            if (changedInput.length === 1 && changedInput[0] === 'form' &&
                this.formValuesInput.startsWith('form.')) {
                // If only 'form' input changed, get names of changed keys
                changedInput = Object.keys(this.previousInputs.form || {})
                    .filter((/**
                 * @param {?} key
                 * @return {?}
                 */
                key => !isEqual$1(this.previousInputs.form[key], this.form[key])))
                    .map((/**
                 * @param {?} key
                 * @return {?}
                 */
                key => `form.${key}`));
                resetFirst = false;
            }
            // If only input values have changed, update the form values
            if (changedInput.length === 1 && changedInput[0] === this.formValuesInput) {
                if (this.formValuesInput.indexOf('.') === -1) {
                    this.setFormValues(this[this.formValuesInput], resetFirst);
                }
                else {
                    const [input, key] = this.formValuesInput.split('.');
                    this.setFormValues(this[input][key], resetFirst);
                }
                // If anything else has changed, re-render the entire form
            }
            else if (changedInput.length) {
                this.initializeForm();
                if (this.onChange) {
                    this.onChange(this.jsf.formValues);
                }
                if (this.onTouched) {
                    this.onTouched(this.jsf.formValues);
                }
            }
            // Update previous inputs
            Object.keys(this.previousInputs)
                .filter((/**
             * @param {?} input
             * @return {?}
             */
            input => this.previousInputs[input] !== this[input]))
                .forEach((/**
             * @param {?} input
             * @return {?}
             */
            input => this.previousInputs[input] = this[input]));
        }
    }
    /**
     * @param {?} formValues
     * @param {?=} resetFirst
     * @return {?}
     */
    setFormValues(formValues, resetFirst = true) {
        if (formValues) {
            /** @type {?} */
            const newFormValues = this.objectWrap ? formValues['1'] : formValues;
            if (!this.jsf.formGroup) {
                this.jsf.formValues = formValues;
                this.activateForm();
            }
            else if (resetFirst) {
                this.jsf.formGroup.reset();
            }
            if (this.jsf.formGroup) {
                this.jsf.formGroup.patchValue(newFormValues);
            }
            if (this.onChange) {
                this.onChange(newFormValues);
            }
            if (this.onTouched) {
                this.onTouched(newFormValues);
            }
        }
        else {
            this.jsf.formGroup.reset();
        }
    }
    /**
     * @return {?}
     */
    submitForm() {
        /** @type {?} */
        const validData = this.jsf.validData;
        this.onSubmit.emit(this.objectWrap ? validData['1'] : validData);
    }
    /**
     * 'initializeForm' function
     *
     * - Update 'schema', 'layout', and 'formValues', from inputs.
     *
     * - Create 'schemaRefLibrary' and 'schemaRecursiveRefMap'
     *   to resolve schema $ref links, including recursive $ref links.
     *
     * - Create 'dataRecursiveRefMap' to resolve recursive links in data
     *   and corectly set output formats for recursively nested values.
     *
     * - Create 'layoutRefLibrary' and 'templateRefLibrary' to store
     *   new layout nodes and formGroup elements to use when dynamically
     *   adding form components to arrays and recursive $ref points.
     *
     * - Create 'dataMap' to map the data to the schema and template.
     *
     * - Create the master 'formGroupTemplate' then from it 'formGroup'
     *   the Angular formGroup used to control the reactive form.
     * @return {?}
     */
    initializeForm() {
        if (this.schema || this.layout || this.data || this.form || this.model ||
            this.JSONSchema || this.UISchema || this.formData || this.ngModel ||
            this.jsf.data) {
            this.jsf.resetAllValues(); // Reset all form values to defaults
            this.initializeOptions(); // Update options
            this.initializeSchema(); // Update schema, schemaRefLibrary,
            // schemaRecursiveRefMap, & dataRecursiveRefMap
            this.initializeLayout(); // Update layout, layoutRefLibrary,
            this.initializeData(); // Update formValues
            this.activateForm(); // Update dataMap, templateRefLibrary,
            // formGroupTemplate, formGroup
            // Uncomment individual lines to output debugging information to console:
            // (These always work.)
            // console.log('loading form...');
            // console.log('schema', this.jsf.schema);
            // console.log('layout', this.jsf.layout);
            // console.log('options', this.options);
            // console.log('formValues', this.jsf.formValues);
            // console.log('formGroupTemplate', this.jsf.formGroupTemplate);
            // console.log('formGroup', this.jsf.formGroup);
            // console.log('formGroup.value', this.jsf.formGroup.value);
            // console.log('schemaRefLibrary', this.jsf.schemaRefLibrary);
            // console.log('layoutRefLibrary', this.jsf.layoutRefLibrary);
            // console.log('templateRefLibrary', this.jsf.templateRefLibrary);
            // console.log('dataMap', this.jsf.dataMap);
            // console.log('arrayMap', this.jsf.arrayMap);
            // console.log('schemaRecursiveRefMap', this.jsf.schemaRecursiveRefMap);
            // console.log('dataRecursiveRefMap', this.jsf.dataRecursiveRefMap);
            // Uncomment individual lines to output debugging information to browser:
            // (These only work if the 'debug' option has also been set to 'true'.)
            if (this.debug || this.jsf.formOptions.debug) {
                /** @type {?} */
                const vars = [];
                // vars.push(this.jsf.schema);
                // vars.push(this.jsf.layout);
                // vars.push(this.options);
                // vars.push(this.jsf.formValues);
                // vars.push(this.jsf.formGroup.value);
                // vars.push(this.jsf.formGroupTemplate);
                // vars.push(this.jsf.formGroup);
                // vars.push(this.jsf.schemaRefLibrary);
                // vars.push(this.jsf.layoutRefLibrary);
                // vars.push(this.jsf.templateRefLibrary);
                // vars.push(this.jsf.dataMap);
                // vars.push(this.jsf.arrayMap);
                // vars.push(this.jsf.schemaRecursiveRefMap);
                // vars.push(this.jsf.dataRecursiveRefMap);
                this.debugOutput = vars.map((/**
                 * @param {?} v
                 * @return {?}
                 */
                v => JSON.stringify(v, null, 2))).join('\n');
            }
            this.formInitialized = true;
        }
    }
    /**
     * 'initializeOptions' function
     *
     * Initialize 'options' (global form options) and set framework
     * Combine available inputs:
     * 1. options - recommended
     * 2. form.options - Single input style
     * @private
     * @return {?}
     */
    initializeOptions() {
        if (this.language && this.language !== this.jsf.language) {
            this.jsf.setLanguage(this.language);
        }
        this.jsf.setOptions({ debug: !!this.debug });
        /** @type {?} */
        let loadExternalAssets = this.loadExternalAssets || false;
        /** @type {?} */
        let framework = this.framework || 'default';
        if (isObject(this.options)) {
            this.jsf.setOptions(this.options);
            loadExternalAssets = this.options.loadExternalAssets || loadExternalAssets;
            framework = this.options.framework || framework;
        }
        if (isObject(this.form) && isObject(this.form.options)) {
            this.jsf.setOptions(this.form.options);
            loadExternalAssets = this.form.options.loadExternalAssets || loadExternalAssets;
            framework = this.form.options.framework || framework;
        }
        if (isObject(this.widgets)) {
            this.jsf.setOptions({ widgets: this.widgets });
        }
        this.frameworkLibrary.setLoadExternalAssets(loadExternalAssets);
        this.frameworkLibrary.setFramework(framework);
        this.jsf.framework = this.frameworkLibrary.getFramework();
        if (isObject(this.jsf.formOptions.widgets)) {
            for (const widget of Object.keys(this.jsf.formOptions.widgets)) {
                this.widgetLibrary.registerWidget(widget, this.jsf.formOptions.widgets[widget]);
            }
        }
        if (isObject(this.form) && isObject(this.form.tpldata)) {
            this.jsf.setTpldata(this.form.tpldata);
        }
    }
    /**
     * 'initializeSchema' function
     *
     * Initialize 'schema'
     * Use first available input:
     * 1. schema - recommended / Angular Schema Form style
     * 2. form.schema - Single input / JSON Form style
     * 3. JSONSchema - React JSON Schema Form style
     * 4. form.JSONSchema - For testing single input React JSON Schema Forms
     * 5. form - For testing single schema-only inputs
     *
     * ... if no schema input found, the 'activateForm' function, below,
     *     will make two additional attempts to build a schema
     * 6. If layout input - build schema from layout
     * 7. If data input - build schema from data
     * @private
     * @return {?}
     */
    initializeSchema() {
        // TODO: update to allow non-object schemas
        if (isObject(this.schema)) {
            this.jsf.AngularSchemaFormCompatibility = true;
            this.jsf.schema = cloneDeep(this.schema);
        }
        else if (hasOwn(this.form, 'schema') && isObject(this.form.schema)) {
            this.jsf.schema = cloneDeep(this.form.schema);
        }
        else if (isObject(this.JSONSchema)) {
            this.jsf.ReactJsonSchemaFormCompatibility = true;
            this.jsf.schema = cloneDeep(this.JSONSchema);
        }
        else if (hasOwn(this.form, 'JSONSchema') && isObject(this.form.JSONSchema)) {
            this.jsf.ReactJsonSchemaFormCompatibility = true;
            this.jsf.schema = cloneDeep(this.form.JSONSchema);
        }
        else if (hasOwn(this.form, 'properties') && isObject(this.form.properties)) {
            this.jsf.schema = cloneDeep(this.form);
        }
        else if (isObject(this.form)) {
            // TODO: Handle other types of form input
        }
        if (!isEmpty(this.jsf.schema)) {
            // If other types also allowed, render schema as an object
            if (inArray('object', this.jsf.schema.type)) {
                this.jsf.schema.type = 'object';
            }
            // Wrap non-object schemas in object.
            if (hasOwn(this.jsf.schema, 'type') && this.jsf.schema.type !== 'object') {
                this.jsf.schema = {
                    'type': 'object',
                    'properties': { 1: this.jsf.schema }
                };
                this.objectWrap = true;
            }
            else if (!hasOwn(this.jsf.schema, 'type')) {
                // Add type = 'object' if missing
                if (isObject(this.jsf.schema.properties) ||
                    isObject(this.jsf.schema.patternProperties) ||
                    isObject(this.jsf.schema.additionalProperties)) {
                    this.jsf.schema.type = 'object';
                    // Fix JSON schema shorthand (JSON Form style)
                }
                else {
                    this.jsf.JsonFormCompatibility = true;
                    this.jsf.schema = {
                        'type': 'object',
                        'properties': this.jsf.schema
                    };
                }
            }
            // If needed, update JSON Schema to draft 6 format, including
            // draft 3 (JSON Form style) and draft 4 (Angular Schema Form style)
            this.jsf.schema = convertSchemaToDraft6(this.jsf.schema);
            // Initialize ajv and compile schema
            this.jsf.compileAjvSchema();
            // Create schemaRefLibrary, schemaRecursiveRefMap, dataRecursiveRefMap, & arrayMap
            this.jsf.schema = resolveSchemaReferences(this.jsf.schema, this.jsf.schemaRefLibrary, this.jsf.schemaRecursiveRefMap, this.jsf.dataRecursiveRefMap, this.jsf.arrayMap);
            if (hasOwn(this.jsf.schemaRefLibrary, '')) {
                this.jsf.hasRootReference = true;
            }
            // TODO: (?) Resolve external $ref links
            // // Create schemaRefLibrary & schemaRecursiveRefMap
            // this.parser.bundle(this.schema)
            //   .then(schema => this.schema = resolveSchemaReferences(
            //     schema, this.jsf.schemaRefLibrary,
            //     this.jsf.schemaRecursiveRefMap, this.jsf.dataRecursiveRefMap
            //   ));
        }
    }
    /**
     * 'initializeData' function
     *
     * Initialize 'formValues'
     * defulat or previously submitted values used to populate form
     * Use first available input:
     * 1. data - recommended
     * 2. model - Angular Schema Form style
     * 3. form.value - JSON Form style
     * 4. form.data - Single input style
     * 5. formData - React JSON Schema Form style
     * 6. form.formData - For easier testing of React JSON Schema Forms
     * 7. (none) no data - initialize data from schema and layout defaults only
     * @private
     * @return {?}
     */
    initializeData() {
        if (hasValue(this.data)) {
            this.jsf.formValues = cloneDeep(this.data);
            this.formValuesInput = 'data';
        }
        else if (hasValue(this.model)) {
            this.jsf.AngularSchemaFormCompatibility = true;
            this.jsf.formValues = cloneDeep(this.model);
            this.formValuesInput = 'model';
        }
        else if (hasValue(this.ngModel)) {
            this.jsf.AngularSchemaFormCompatibility = true;
            this.jsf.formValues = cloneDeep(this.ngModel);
            this.formValuesInput = 'ngModel';
        }
        else if (isObject(this.form) && hasValue(this.form.value)) {
            this.jsf.JsonFormCompatibility = true;
            this.jsf.formValues = cloneDeep(this.form.value);
            this.formValuesInput = 'form.value';
        }
        else if (isObject(this.form) && hasValue(this.form.data)) {
            this.jsf.formValues = cloneDeep(this.form.data);
            this.formValuesInput = 'form.data';
        }
        else if (hasValue(this.formData)) {
            this.jsf.ReactJsonSchemaFormCompatibility = true;
            this.formValuesInput = 'formData';
        }
        else if (hasOwn(this.form, 'formData') && hasValue(this.form.formData)) {
            this.jsf.ReactJsonSchemaFormCompatibility = true;
            this.jsf.formValues = cloneDeep(this.form.formData);
            this.formValuesInput = 'form.formData';
        }
        else {
            this.formValuesInput = null;
        }
    }
    /**
     * 'initializeLayout' function
     *
     * Initialize 'layout'
     * Use first available array input:
     * 1. layout - recommended
     * 2. form - Angular Schema Form style
     * 3. form.form - JSON Form style
     * 4. form.layout - Single input style
     * 5. (none) no layout - set default layout instead
     *    (full layout will be built later from the schema)
     *
     * Also, if alternate layout formats are available,
     * import from 'UISchema' or 'customFormItems'
     * used for React JSON Schema Form and JSON Form API compatibility
     * Use first available input:
     * 1. UISchema - React JSON Schema Form style
     * 2. form.UISchema - For testing single input React JSON Schema Forms
     * 2. form.customFormItems - JSON Form style
     * 3. (none) no input - don't import
     * @private
     * @return {?}
     */
    initializeLayout() {
        // Rename JSON Form-style 'options' lists to
        // Angular Schema Form-style 'titleMap' lists.
        /** @type {?} */
        const fixJsonFormOptions = (/**
         * @param {?} layout
         * @return {?}
         */
        (layout) => {
            if (isObject(layout) || isArray(layout)) {
                forEach(layout, (/**
                 * @param {?} value
                 * @param {?} key
                 * @return {?}
                 */
                (value, key) => {
                    if (hasOwn(value, 'options') && isObject(value.options)) {
                        value.titleMap = value.options;
                        delete value.options;
                    }
                }), 'top-down');
            }
            return layout;
        });
        // Check for layout inputs and, if found, initialize form layout
        if (isArray(this.layout)) {
            this.jsf.layout = cloneDeep(this.layout);
        }
        else if (isArray(this.form)) {
            this.jsf.AngularSchemaFormCompatibility = true;
            this.jsf.layout = cloneDeep(this.form);
        }
        else if (this.form && isArray(this.form.form)) {
            this.jsf.JsonFormCompatibility = true;
            this.jsf.layout = fixJsonFormOptions(cloneDeep(this.form.form));
        }
        else if (this.form && isArray(this.form.layout)) {
            this.jsf.layout = cloneDeep(this.form.layout);
        }
        else {
            this.jsf.layout = ['*'];
        }
        // Check for alternate layout inputs
        /** @type {?} */
        let alternateLayout = null;
        if (isObject(this.UISchema)) {
            this.jsf.ReactJsonSchemaFormCompatibility = true;
            alternateLayout = cloneDeep(this.UISchema);
        }
        else if (hasOwn(this.form, 'UISchema')) {
            this.jsf.ReactJsonSchemaFormCompatibility = true;
            alternateLayout = cloneDeep(this.form.UISchema);
        }
        else if (hasOwn(this.form, 'uiSchema')) {
            this.jsf.ReactJsonSchemaFormCompatibility = true;
            alternateLayout = cloneDeep(this.form.uiSchema);
        }
        else if (hasOwn(this.form, 'customFormItems')) {
            this.jsf.JsonFormCompatibility = true;
            alternateLayout = fixJsonFormOptions(cloneDeep(this.form.customFormItems));
        }
        // if alternate layout found, copy alternate layout options into schema
        if (alternateLayout) {
            JsonPointer.forEachDeep(alternateLayout, (/**
             * @param {?} value
             * @param {?} pointer
             * @return {?}
             */
            (value, pointer) => {
                /** @type {?} */
                const schemaPointer = pointer
                    .replace(/\//g, '/properties/')
                    .replace(/\/properties\/items\/properties\//g, '/items/properties/')
                    .replace(/\/properties\/titleMap\/properties\//g, '/titleMap/properties/');
                if (hasValue(value) && hasValue(pointer)) {
                    /** @type {?} */
                    let key = JsonPointer.toKey(pointer);
                    /** @type {?} */
                    const groupPointer = (JsonPointer.parse(schemaPointer) || []).slice(0, -2);
                    /** @type {?} */
                    let itemPointer;
                    // If 'ui:order' object found, copy into object schema root
                    if (key.toLowerCase() === 'ui:order') {
                        itemPointer = [...groupPointer, 'ui:order'];
                        // Copy other alternate layout options to schema 'x-schema-form',
                        // (like Angular Schema Form options) and remove any 'ui:' prefixes
                    }
                    else {
                        if (key.slice(0, 3).toLowerCase() === 'ui:') {
                            key = key.slice(3);
                        }
                        itemPointer = [...groupPointer, 'x-schema-form', key];
                    }
                    if (JsonPointer.has(this.jsf.schema, groupPointer) &&
                        !JsonPointer.has(this.jsf.schema, itemPointer)) {
                        JsonPointer.set(this.jsf.schema, itemPointer, value);
                    }
                }
            }));
        }
    }
    /**
     * 'activateForm' function
     *
     * ...continued from 'initializeSchema' function, above
     * If 'schema' has not been initialized (i.e. no schema input found)
     * 6. If layout input - build schema from layout input
     * 7. If data input - build schema from data input
     *
     * Create final layout,
     * build the FormGroup template and the Angular FormGroup,
     * subscribe to changes,
     * and activate the form.
     * @private
     * @return {?}
     */
    activateForm() {
        // If 'schema' not initialized
        if (isEmpty(this.jsf.schema)) {
            // TODO: If full layout input (with no '*'), build schema from layout
            // if (!this.jsf.layout.includes('*')) {
            //   this.jsf.buildSchemaFromLayout();
            // } else
            // If data input, build schema from data
            if (!isEmpty(this.jsf.formValues)) {
                this.jsf.buildSchemaFromData();
            }
        }
        if (!isEmpty(this.jsf.schema)) {
            // If not already initialized, initialize ajv and compile schema
            this.jsf.compileAjvSchema();
            // Update all layout elements, add values, widgets, and validators,
            // replace any '*' with a layout built from all schema elements,
            // and update the FormGroup template with any new validators
            this.jsf.buildLayout(this.widgetLibrary);
            // Build the Angular FormGroup template from the schema
            this.jsf.buildFormGroupTemplate(this.jsf.formValues);
            // Build the real Angular FormGroup from the FormGroup template
            this.jsf.buildFormGroup();
        }
        if (this.jsf.formGroup) {
            // Reset initial form values
            if (!isEmpty(this.jsf.formValues) &&
                this.jsf.formOptions.setSchemaDefaults !== true &&
                this.jsf.formOptions.setLayoutDefaults !== true) {
                this.setFormValues(this.jsf.formValues);
            }
            // TODO: Figure out how to display calculated values without changing object data
            // See http://ulion.github.io/jsonform/playground/?example=templating-values
            // Calculate references to other fields
            // if (!isEmpty(this.jsf.formGroup.value)) {
            //   forEach(this.jsf.formGroup.value, (value, key, object, rootObject) => {
            //     if (typeof value === 'string') {
            //       object[key] = this.jsf.parseText(value, value, rootObject, key);
            //     }
            //   }, 'top-down');
            // }
            // Subscribe to form changes to output live data, validation, and errors
            this.jsf.dataChanges.subscribe((/**
             * @param {?} data
             * @return {?}
             */
            data => {
                this.onChanges.emit(this.objectWrap ? data['1'] : data);
                if (this.formValuesInput && this.formValuesInput.indexOf('.') === -1) {
                    this[`${this.formValuesInput}Change`].emit(this.objectWrap ? data['1'] : data);
                }
            }));
            // Trigger change detection on statusChanges to show updated errors
            this.jsf.formGroup.statusChanges.subscribe((/**
             * @return {?}
             */
            () => this.changeDetector.markForCheck()));
            this.jsf.isValidChanges.subscribe((/**
             * @param {?} isValid
             * @return {?}
             */
            isValid => this.isValid.emit(isValid)));
            this.jsf.validationErrorChanges.subscribe((/**
             * @param {?} err
             * @return {?}
             */
            err => this.validationErrors.emit(err)));
            // Output final schema, final layout, and initial data
            this.formSchema.emit(this.jsf.schema);
            this.formLayout.emit(this.jsf.layout);
            this.onChanges.emit(this.objectWrap ? this.jsf.data['1'] : this.jsf.data);
            // If validateOnRender, output initial validation and any errors
            /** @type {?} */
            const validateOnRender = JsonPointer.get(this.jsf, '/formOptions/validateOnRender');
            if (validateOnRender) { // validateOnRender === 'auto' || true
                // validateOnRender === 'auto' || true
                /** @type {?} */
                const touchAll = (/**
                 * @param {?} control
                 * @return {?}
                 */
                (control) => {
                    if (validateOnRender === true || hasValue(control.value)) {
                        control.markAsTouched();
                    }
                    Object.keys(control.controls || {})
                        .forEach((/**
                     * @param {?} key
                     * @return {?}
                     */
                    key => touchAll(control.controls[key])));
                });
                touchAll(this.jsf.formGroup);
                this.isValid.emit(this.jsf.isValid);
                this.validationErrors.emit(this.jsf.ajvErrors);
            }
        }
    }
}
JsonSchemaFormComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'json-schema-form',
                template: "<form [autocomplete]=\"jsf?.formOptions?.autocomplete ? 'on' : 'off'\" class=\"json-schema-form\" (ngSubmit)=\"submitForm()\">\n  <root-widget [layout]=\"jsf?.layout\"></root-widget>\n</form>\n<div *ngIf=\"debug || jsf?.formOptions?.debug\">\n  Debug output:\n  <pre>{{debugOutput}}</pre>\n</div>",
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
JsonSchemaFormComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: FrameworkLibraryService },
    { type: WidgetLibraryService },
    { type: JsonSchemaFormService }
];
JsonSchemaFormComponent.propDecorators = {
    schema: [{ type: Input }],
    layout: [{ type: Input }],
    data: [{ type: Input }],
    options: [{ type: Input }],
    framework: [{ type: Input }],
    widgets: [{ type: Input }],
    form: [{ type: Input }],
    model: [{ type: Input }],
    JSONSchema: [{ type: Input }],
    UISchema: [{ type: Input }],
    formData: [{ type: Input }],
    ngModel: [{ type: Input }],
    language: [{ type: Input }],
    loadExternalAssets: [{ type: Input }],
    debug: [{ type: Input }],
    value: [{ type: Input }],
    onChanges: [{ type: Output }],
    onSubmit: [{ type: Output }],
    isValid: [{ type: Output }],
    validationErrors: [{ type: Output }],
    formSchema: [{ type: Output }],
    formLayout: [{ type: Output }],
    dataChange: [{ type: Output }],
    modelChange: [{ type: Output }],
    formDataChange: [{ type: Output }],
    ngModelChange: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    JsonSchemaFormComponent.prototype.debugOutput;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.formValueSubscription;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.formInitialized;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.objectWrap;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.formValuesInput;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.previousInputs;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.schema;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.layout;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.data;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.options;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.framework;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.widgets;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.form;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.model;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.JSONSchema;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.UISchema;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.formData;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.ngModel;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.language;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.loadExternalAssets;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.debug;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.onChanges;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.onSubmit;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.isValid;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.validationErrors;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.formSchema;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.formLayout;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.dataChange;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.modelChange;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.formDataChange;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.ngModelChange;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.onChange;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.onTouched;
    /**
     * @type {?}
     * @private
     */
    JsonSchemaFormComponent.prototype.changeDetector;
    /**
     * @type {?}
     * @private
     */
    JsonSchemaFormComponent.prototype.frameworkLibrary;
    /**
     * @type {?}
     * @private
     */
    JsonSchemaFormComponent.prototype.widgetLibrary;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.jsf;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NoFrameworkComponent {
}
NoFrameworkComponent.decorators = [
    { type: Component, args: [{
                selector: 'no-framework',
                template: "<select-widget-widget [dataIndex]=\"dataIndex\" [layoutIndex]=\"layoutIndex\" [layoutNode]=\"layoutNode\">\n</select-widget-widget>"
            }] }
];
NoFrameworkComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    NoFrameworkComponent.prototype.layoutNode;
    /** @type {?} */
    NoFrameworkComponent.prototype.layoutIndex;
    /** @type {?} */
    NoFrameworkComponent.prototype.dataIndex;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// No framework - plain HTML controls (styles from form layout only)
class NoFramework extends Framework {
    constructor() {
        super(...arguments);
        this.name = 'no-framework';
        this.framework = NoFrameworkComponent;
    }
}
NoFramework.decorators = [
    { type: Injectable }
];
if (false) {
    /** @type {?} */
    NoFramework.prototype.name;
    /** @type {?} */
    NoFramework.prototype.framework;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class HiddenComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.jsf.initializeControl(this);
    }
}
HiddenComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'hidden-widget',
                template: `
    <input *ngIf="boundControl"
      [formControl]="formControl"
      [id]="'control' + layoutNode?._id"
      [name]="controlName"
      type="hidden">
    <input *ngIf="!boundControl"
      [disabled]="controlDisabled"
      [name]="controlName"
      [id]="'control' + layoutNode?._id"
      type="hidden"
      [value]="controlValue">`
            }] }
];
/** @nocollapse */
HiddenComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
HiddenComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    HiddenComponent.prototype.formControl;
    /** @type {?} */
    HiddenComponent.prototype.controlName;
    /** @type {?} */
    HiddenComponent.prototype.controlValue;
    /** @type {?} */
    HiddenComponent.prototype.controlDisabled;
    /** @type {?} */
    HiddenComponent.prototype.boundControl;
    /** @type {?} */
    HiddenComponent.prototype.layoutNode;
    /** @type {?} */
    HiddenComponent.prototype.layoutIndex;
    /** @type {?} */
    HiddenComponent.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    HiddenComponent.prototype.jsf;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class TabComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
        this.jsf = jsf;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.options = this.layoutNode.options || {};
    }
}
TabComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'tab-widget',
                template: `
    <div [class]="options?.htmlClass || ''">
      <root-widget
        [dataIndex]="dataIndex"
        [layoutIndex]="layoutIndex"
        [layout]="layoutNode.items"></root-widget>
    </div>`
            }] }
];
/** @nocollapse */
TabComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
TabComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    TabComponent.prototype.options;
    /** @type {?} */
    TabComponent.prototype.layoutNode;
    /** @type {?} */
    TabComponent.prototype.layoutIndex;
    /** @type {?} */
    TabComponent.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    TabComponent.prototype.jsf;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * OrderableDirective
 *
 * Enables array elements to be reordered by dragging and dropping.
 *
 * Only works for arrays that have at least two elements.
 *
 * Also detects arrays-within-arrays, and correctly moves either
 * the child array element or the parent array element,
 * depending on the drop targert.
 *
 * Listeners for movable element being dragged:
 * - dragstart: add 'dragging' class to element, set effectAllowed = 'move'
 * - dragover: set dropEffect = 'move'
 * - dragend: remove 'dragging' class from element
 *
 * Listeners for stationary items being dragged over:
 * - dragenter: add 'drag-target-...' classes to element
 * - dragleave: remove 'drag-target-...' classes from element
 * - drop: remove 'drag-target-...' classes from element, move dropped array item
 */
class OrderableDirective {
    /**
     * @param {?} elementRef
     * @param {?} jsf
     * @param {?} ngZone
     */
    constructor(elementRef, jsf, ngZone) {
        this.elementRef = elementRef;
        this.jsf = jsf;
        this.ngZone = ngZone;
        this.overParentElement = false;
        this.overChildElement = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.orderable && this.layoutNode && this.layoutIndex && this.dataIndex) {
            this.element = this.elementRef.nativeElement;
            this.element.draggable = true;
            this.arrayLayoutIndex = 'move:' + this.layoutIndex.slice(0, -1).toString();
            this.ngZone.runOutsideAngular((/**
             * @return {?}
             */
            () => {
                // Listeners for movable element being dragged:
                this.element.addEventListener('dragstart', (/**
                 * @param {?} event
                 * @return {?}
                 */
                (event) => {
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text', '');
                    // Hack to bypass stupid HTML drag-and-drop dataTransfer protection
                    // so drag source info will be available on dragenter
                    /** @type {?} */
                    const sourceArrayIndex = this.dataIndex[this.dataIndex.length - 1];
                    sessionStorage.setItem(this.arrayLayoutIndex, sourceArrayIndex + '');
                }));
                this.element.addEventListener('dragover', (/**
                 * @param {?} event
                 * @return {?}
                 */
                (event) => {
                    if (event.preventDefault) {
                        event.preventDefault();
                    }
                    event.dataTransfer.dropEffect = 'move';
                    return false;
                }));
                // Listeners for stationary items being dragged over:
                this.element.addEventListener('dragenter', (/**
                 * @param {?} event
                 * @return {?}
                 */
                (event) => {
                    // Part 1 of a hack, inspired by Dragster, to simulate mouseover and mouseout
                    // behavior while dragging items - http://bensmithett.github.io/dragster/
                    if (this.overParentElement) {
                        return this.overChildElement = true;
                    }
                    else {
                        this.overParentElement = true;
                    }
                    /** @type {?} */
                    const sourceArrayIndex = sessionStorage.getItem(this.arrayLayoutIndex);
                    if (sourceArrayIndex !== null) {
                        if (this.dataIndex[this.dataIndex.length - 1] < +sourceArrayIndex) {
                            this.element.classList.add('drag-target-top');
                        }
                        else if (this.dataIndex[this.dataIndex.length - 1] > +sourceArrayIndex) {
                            this.element.classList.add('drag-target-bottom');
                        }
                    }
                }));
                this.element.addEventListener('dragleave', (/**
                 * @param {?} event
                 * @return {?}
                 */
                (event) => {
                    // Part 2 of the Dragster hack
                    if (this.overChildElement) {
                        this.overChildElement = false;
                    }
                    else if (this.overParentElement) {
                        this.overParentElement = false;
                    }
                    /** @type {?} */
                    const sourceArrayIndex = sessionStorage.getItem(this.arrayLayoutIndex);
                    if (!this.overParentElement && !this.overChildElement && sourceArrayIndex !== null) {
                        this.element.classList.remove('drag-target-top');
                        this.element.classList.remove('drag-target-bottom');
                    }
                }));
                this.element.addEventListener('drop', (/**
                 * @param {?} event
                 * @return {?}
                 */
                (event) => {
                    this.element.classList.remove('drag-target-top');
                    this.element.classList.remove('drag-target-bottom');
                    // Confirm that drop target is another item in the same array as source item
                    /** @type {?} */
                    const sourceArrayIndex = sessionStorage.getItem(this.arrayLayoutIndex);
                    /** @type {?} */
                    const destArrayIndex = this.dataIndex[this.dataIndex.length - 1];
                    if (sourceArrayIndex !== null && +sourceArrayIndex !== destArrayIndex) {
                        // Move array item
                        this.jsf.moveArrayItem(this, +sourceArrayIndex, destArrayIndex);
                    }
                    sessionStorage.removeItem(this.arrayLayoutIndex);
                    return false;
                }));
            }));
        }
    }
}
OrderableDirective.decorators = [
    { type: Directive, args: [{
                // tslint:disable-next-line:directive-selector
                selector: '[orderable]',
            },] }
];
/** @nocollapse */
OrderableDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: JsonSchemaFormService },
    { type: NgZone }
];
OrderableDirective.propDecorators = {
    orderable: [{ type: Input }],
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    OrderableDirective.prototype.arrayLayoutIndex;
    /** @type {?} */
    OrderableDirective.prototype.element;
    /** @type {?} */
    OrderableDirective.prototype.overParentElement;
    /** @type {?} */
    OrderableDirective.prototype.overChildElement;
    /** @type {?} */
    OrderableDirective.prototype.orderable;
    /** @type {?} */
    OrderableDirective.prototype.layoutNode;
    /** @type {?} */
    OrderableDirective.prototype.layoutIndex;
    /** @type {?} */
    OrderableDirective.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    OrderableDirective.prototype.elementRef;
    /**
     * @type {?}
     * @private
     */
    OrderableDirective.prototype.jsf;
    /**
     * @type {?}
     * @private
     */
    OrderableDirective.prototype.ngZone;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const BASIC_WIDGETS = [
    AddReferenceComponent, OneOfComponent, ButtonComponent, CheckboxComponent,
    CheckboxesComponent, FileComponent, HiddenComponent, InputComponent,
    MessageComponent, NoneComponent, NumberComponent, RadiosComponent,
    RootComponent, SectionComponent, SelectComponent, SelectFrameworkComponent,
    SelectWidgetComponent, SubmitComponent, TabComponent, TabsComponent,
    TemplateComponent, TextareaComponent
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WidgetLibraryModule {
}
WidgetLibraryModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, FormsModule, ReactiveFormsModule],
                declarations: [...BASIC_WIDGETS, OrderableDirective],
                exports: [...BASIC_WIDGETS, OrderableDirective],
                entryComponents: [...BASIC_WIDGETS]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// No framework - plain HTML controls (styles from form layout only)
class NoFrameworkModule {
}
NoFrameworkModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, WidgetLibraryModule],
                declarations: [NoFrameworkComponent],
                exports: [NoFrameworkComponent],
                providers: [
                    { provide: Framework, useClass: NoFramework, multi: true }
                ],
                entryComponents: [NoFrameworkComponent]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class JsonSchemaFormModule {
}
JsonSchemaFormModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule, FormsModule, ReactiveFormsModule,
                    WidgetLibraryModule, NoFrameworkModule
                ],
                declarations: [JsonSchemaFormComponent],
                exports: [JsonSchemaFormComponent, WidgetLibraryModule]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { AddReferenceComponent, BASIC_WIDGETS, ButtonComponent, CheckboxComponent, CheckboxesComponent, FileComponent, Framework, FrameworkLibraryService, HiddenComponent, InputComponent, JsonPointer, JsonSchemaFormComponent, JsonSchemaFormModule, JsonSchemaFormService, JsonValidators, MessageComponent, NoneComponent, NumberComponent, OneOfComponent, OrderableDirective, RadiosComponent, RootComponent, SectionComponent, SelectComponent, SelectFrameworkComponent, SelectWidgetComponent, SubmitComponent, TabComponent, TabsComponent, TemplateComponent, TextareaComponent, WidgetLibraryModule, WidgetLibraryService, _executeAsyncValidators, _executeValidators, _mergeErrors, _mergeObjects, _toPromise, addClasses, buildFormGroup, buildFormGroupTemplate, buildLayout, buildLayoutFromSchema, buildSchemaFromData, buildSchemaFromLayout, buildTitleMap, checkInlineType, combineAllOf, commonItems, convertSchemaToDraft6, copy, dateToString, enValidationMessages, fixRequiredArrayProperties, fixTitle, forEach, forEachCopy, formatFormData, frValidationMessages, getControl, getControlValidators, getFromSchema, getInputType, getLayoutNode, getSubSchema, getTitleMapFromOneOf, getType, hasOwn, hasValue, inArray, isArray, isBoolean, isDate, isDefined, isEmpty, isFunction, isInputRequired, isInteger, isMap, isNumber, isObject, isObservable, isPrimitive, isPromise, isSet, isString, isType, itValidationMessages, mapLayout, mergeFilteredObject, mergeSchemas, ptValidationMessages, removeRecursiveReferences, resolveSchemaReferences, setRequiredFields, toJavaScriptType, toObservable, toSchemaType, toTitleCase, uniqueItems, updateInputOptions, xor, zhValidationMessages, BASIC_WIDGETS as ɵa, AddReferenceComponent as ɵb, NoFrameworkComponent as ɵba, NoFramework as ɵbb, OneOfComponent as ɵc, ButtonComponent as ɵd, CheckboxComponent as ɵe, CheckboxesComponent as ɵf, FileComponent as ɵg, HiddenComponent as ɵh, InputComponent as ɵi, MessageComponent as ɵj, NoneComponent as ɵk, NumberComponent as ɵl, OrderableDirective as ɵm, RadiosComponent as ɵn, RootComponent as ɵo, SectionComponent as ɵp, SelectComponent as ɵq, SelectFrameworkComponent as ɵr, SelectWidgetComponent as ɵs, SubmitComponent as ɵt, TabComponent as ɵu, TabsComponent as ɵv, TemplateComponent as ɵw, TextareaComponent as ɵx, WidgetLibraryService as ɵy, NoFrameworkModule as ɵz };
//# sourceMappingURL=ajsf-core.js.map
