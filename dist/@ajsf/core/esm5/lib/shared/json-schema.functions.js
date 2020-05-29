/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import cloneDeep from 'lodash/cloneDeep';
import { forEach, hasOwn, mergeFilteredObject } from './utility.functions';
import { getType, hasValue, inArray, isArray, isNumber, isObject, isString } from './validator.functions';
import { JsonPointer } from './jsonpointer.functions';
import { mergeSchemas } from './merge-schemas.function';
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
export function buildSchemaFromLayout(layout) {
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
export function buildSchemaFromData(data, requireAllFields, isRoot) {
    var e_1, _a;
    if (requireAllFields === void 0) { requireAllFields = false; }
    if (isRoot === void 0) { isRoot = true; }
    /** @type {?} */
    var newSchema = {};
    /** @type {?} */
    var getFieldType = (/**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        /** @type {?} */
        var fieldType = getType(value, 'strict');
        return { integer: 'number', null: 'string' }[fieldType] || fieldType;
    });
    /** @type {?} */
    var buildSubSchema = (/**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        return buildSchemaFromData(value, requireAllFields, false);
    });
    if (isRoot) {
        newSchema.$schema = 'http://json-schema.org/draft-06/schema#';
    }
    newSchema.type = getFieldType(data);
    if (newSchema.type === 'object') {
        newSchema.properties = {};
        if (requireAllFields) {
            newSchema.required = [];
        }
        try {
            for (var _b = tslib_1.__values(Object.keys(data)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                newSchema.properties[key] = buildSubSchema(data[key]);
                if (requireAllFields) {
                    newSchema.required.push(key);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
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
            function (a, b) { return (tslib_1.__assign({}, a, b)); }), {});
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
export function getFromSchema(schema, dataPointer, returnType) {
    if (returnType === void 0) { returnType = 'schema'; }
    /** @type {?} */
    var dataPointerArray = JsonPointer.parse(dataPointer);
    if (dataPointerArray === null) {
        console.error("getFromSchema error: Invalid JSON Pointer: " + dataPointer);
        return null;
    }
    /** @type {?} */
    var subSchema = schema;
    /** @type {?} */
    var schemaPointer = [];
    /** @type {?} */
    var length = dataPointerArray.length;
    if (returnType.slice(0, 6) === 'parent') {
        dataPointerArray.length--;
    }
    for (var i = 0; i < length; ++i) {
        /** @type {?} */
        var parentSchema = subSchema;
        /** @type {?} */
        var key = dataPointerArray[i];
        /** @type {?} */
        var subSchemaFound = false;
        if (typeof subSchema !== 'object') {
            console.error("getFromSchema error: Unable to find \"" + key + "\" key in schema.");
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
            console.error("getFromSchema error: Unable to find \"" + key + "\" item in schema.");
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
export function removeRecursiveReferences(pointer, recursiveRefMap, arrayMap) {
    if (arrayMap === void 0) { arrayMap = new Map(); }
    if (!pointer) {
        return '';
    }
    /** @type {?} */
    var genericPointer = JsonPointer.toGenericPointer(JsonPointer.compile(pointer), arrayMap);
    if (genericPointer.indexOf('/') === -1) {
        return genericPointer;
    }
    /** @type {?} */
    var possibleReferences = true;
    while (possibleReferences) {
        possibleReferences = false;
        recursiveRefMap.forEach((/**
         * @param {?} toPointer
         * @param {?} fromPointer
         * @return {?}
         */
        function (toPointer, fromPointer) {
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
export function getInputType(schema, layoutNode) {
    if (layoutNode === void 0) { layoutNode = null; }
    // x-schema-form = Angular Schema Form compatibility
    // widget & component = React Jsonschema Form compatibility
    /** @type {?} */
    var controlType = JsonPointer.getFirst([
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
    var schemaType = schema.type;
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
            var itemsObject = JsonPointer.getFirst([
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
    console.error("getInputType error: Unable to determine input type for " + schemaType);
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
export function checkInlineType(controlType, schema, layoutNode) {
    if (layoutNode === void 0) { layoutNode = null; }
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
export function isInputRequired(schema, schemaPointer) {
    if (!isObject(schema)) {
        console.error('isInputRequired error: Input schema must be an object.');
        return false;
    }
    /** @type {?} */
    var listPointerArray = JsonPointer.parse(schemaPointer);
    if (isArray(listPointerArray)) {
        if (!listPointerArray.length) {
            return schema.required === true;
        }
        /** @type {?} */
        var keyName = listPointerArray.pop();
        /** @type {?} */
        var nextToLastKey = listPointerArray[listPointerArray.length - 1];
        if (['properties', 'additionalProperties', 'patternProperties', 'items', 'additionalItems']
            .includes(nextToLastKey)) {
            listPointerArray.pop();
        }
        /** @type {?} */
        var parentSchema = JsonPointer.get(schema, listPointerArray) || {};
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
export function updateInputOptions(layoutNode, schema, jsf) {
    if (!isObject(layoutNode) || !isObject(layoutNode.options)) {
        return;
    }
    // Set all option values in layoutNode.options
    /** @type {?} */
    var newOptions = {};
    /** @type {?} */
    var fixUiKeys = (/**
     * @param {?} key
     * @return {?}
     */
    function (key) { return key.slice(0, 3).toLowerCase() === 'ui:' ? key.slice(3) : key; });
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
    function (_a) {
        var _b = tslib_1.__read(_a, 2), object = _b[0], excludeKeys = _b[1];
        return mergeFilteredObject(newOptions, object, excludeKeys, fixUiKeys);
    }));
    if (!hasOwn(newOptions, 'titleMap')) {
        /** @type {?} */
        var newTitleMap = null;
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
export function getTitleMapFromOneOf(schema, flatList, validateOnly) {
    if (schema === void 0) { schema = {}; }
    if (flatList === void 0) { flatList = null; }
    if (validateOnly === void 0) { validateOnly = false; }
    /** @type {?} */
    var titleMap = null;
    /** @type {?} */
    var oneOf = schema.oneOf || schema.anyOf || null;
    if (isArray(oneOf) && oneOf.every((/**
     * @param {?} item
     * @return {?}
     */
    function (item) { return item.title; }))) {
        if (oneOf.every((/**
         * @param {?} item
         * @return {?}
         */
        function (item) { return isArray(item.enum) && item.enum.length === 1; }))) {
            if (validateOnly) {
                return true;
            }
            titleMap = oneOf.map((/**
             * @param {?} item
             * @return {?}
             */
            function (item) { return ({ name: item.title, value: item.enum[0] }); }));
        }
        else if (oneOf.every((/**
         * @param {?} item
         * @return {?}
         */
        function (item) { return item.const; }))) {
            if (validateOnly) {
                return true;
            }
            titleMap = oneOf.map((/**
             * @param {?} item
             * @return {?}
             */
            function (item) { return ({ name: item.title, value: item.const }); }));
        }
        // if flatList !== false and some items have colons, make grouped map
        if (flatList !== false && (titleMap || [])
            .filter((/**
         * @param {?} title
         * @return {?}
         */
        function (title) { return ((title || {}).name || '').indexOf(': '); })).length > 1) {
            // Split name on first colon to create grouped map (name -> group: name)
            /** @type {?} */
            var newTitleMap_1 = titleMap.map((/**
             * @param {?} title
             * @return {?}
             */
            function (title) {
                var _a = tslib_1.__read(title.name.split(/: (.+)/), 2), group = _a[0], name = _a[1];
                return group && name ? tslib_1.__assign({}, title, { group: group, name: name }) : title;
            }));
            // If flatList === true or at least one group has multiple items, use grouped map
            if (flatList === true || newTitleMap_1.some((/**
             * @param {?} title
             * @param {?} index
             * @return {?}
             */
            function (title, index) { return index &&
                hasOwn(title, 'group') && title.group === newTitleMap_1[index - 1].group; }))) {
                titleMap = newTitleMap_1;
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
export function getControlValidators(schema) {
    if (!isObject(schema)) {
        return null;
    }
    /** @type {?} */
    var validators = {};
    if (hasOwn(schema, 'type')) {
        switch (schema.type) {
            case 'string':
                forEach(['pattern', 'format', 'minLength', 'maxLength'], (/**
                 * @param {?} prop
                 * @return {?}
                 */
                function (prop) {
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
                function (ucLimit) {
                    /** @type {?} */
                    var eLimit = 'exclusive' + ucLimit;
                    /** @type {?} */
                    var limit = ucLimit.toLowerCase();
                    if (hasOwn(schema, limit)) {
                        /** @type {?} */
                        var exclusive = hasOwn(schema, eLimit) && schema[eLimit] === true;
                        validators[limit] = [schema[limit], exclusive];
                    }
                }));
                forEach(['multipleOf', 'type'], (/**
                 * @param {?} prop
                 * @return {?}
                 */
                function (prop) {
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
                function (prop) {
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
                function (prop) {
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
export function resolveSchemaReferences(schema, schemaRefLibrary, schemaRecursiveRefMap, dataRecursiveRefMap, arrayMap) {
    if (!isObject(schema)) {
        console.error('resolveSchemaReferences error: schema must be an object.');
        return;
    }
    /** @type {?} */
    var refLinks = new Set();
    /** @type {?} */
    var refMapSet = new Set();
    /** @type {?} */
    var refMap = new Map();
    /** @type {?} */
    var recursiveRefMap = new Map();
    /** @type {?} */
    var refLibrary = {};
    // Search schema for all $ref links, and build full refLibrary
    JsonPointer.forEachDeep(schema, (/**
     * @param {?} subSchema
     * @param {?} subSchemaPointer
     * @return {?}
     */
    function (subSchema, subSchemaPointer) {
        if (hasOwn(subSchema, '$ref') && isString(subSchema['$ref'])) {
            /** @type {?} */
            var refPointer = JsonPointer.compile(subSchema['$ref']);
            refLinks.add(refPointer);
            refMapSet.add(subSchemaPointer + '~~' + refPointer);
            refMap.set(subSchemaPointer, refPointer);
        }
    }));
    refLinks.forEach((/**
     * @param {?} ref
     * @return {?}
     */
    function (ref) { return refLibrary[ref] = getSubSchema(schema, ref); }));
    // Follow all ref links and save in refMapSet,
    // to find any multi-link recursive refernces
    /** @type {?} */
    var checkRefLinks = true;
    while (checkRefLinks) {
        checkRefLinks = false;
        Array.from(refMap).forEach((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var _b = tslib_1.__read(_a, 2), fromRef1 = _b[0], toRef1 = _b[1];
            return Array.from(refMap)
                .filter((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var _b = tslib_1.__read(_a, 2), fromRef2 = _b[0], toRef2 = _b[1];
                return JsonPointer.isSubPointer(toRef1, fromRef2, true) &&
                    !JsonPointer.isSubPointer(toRef2, toRef1, true) &&
                    !refMapSet.has(fromRef1 + fromRef2.slice(toRef1.length) + '~~' + toRef2);
            }))
                .forEach((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var _b = tslib_1.__read(_a, 2), fromRef2 = _b[0], toRef2 = _b[1];
                refMapSet.add(fromRef1 + fromRef2.slice(toRef1.length) + '~~' + toRef2);
                checkRefLinks = true;
            }));
        }));
    }
    // Build full recursiveRefMap
    // First pass - save all internally recursive refs from refMapSet
    Array.from(refMapSet)
        .map((/**
     * @param {?} refLink
     * @return {?}
     */
    function (refLink) { return refLink.split('~~'); }))
        .filter((/**
     * @param {?} __0
     * @return {?}
     */
    function (_a) {
        var _b = tslib_1.__read(_a, 2), fromRef = _b[0], toRef = _b[1];
        return JsonPointer.isSubPointer(toRef, fromRef);
    }))
        .forEach((/**
     * @param {?} __0
     * @return {?}
     */
    function (_a) {
        var _b = tslib_1.__read(_a, 2), fromRef = _b[0], toRef = _b[1];
        return recursiveRefMap.set(fromRef, toRef);
    }));
    // Second pass - create recursive versions of any other refs that link to recursive refs
    Array.from(refMap)
        .filter((/**
     * @param {?} __0
     * @return {?}
     */
    function (_a) {
        var _b = tslib_1.__read(_a, 2), fromRef1 = _b[0], toRef1 = _b[1];
        return Array.from(recursiveRefMap.keys())
            .every((/**
         * @param {?} fromRef2
         * @return {?}
         */
        function (fromRef2) { return !JsonPointer.isSubPointer(fromRef1, fromRef2, true); }));
    }))
        .forEach((/**
     * @param {?} __0
     * @return {?}
     */
    function (_a) {
        var _b = tslib_1.__read(_a, 2), fromRef1 = _b[0], toRef1 = _b[1];
        return Array.from(recursiveRefMap)
            .filter((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var _b = tslib_1.__read(_a, 2), fromRef2 = _b[0], toRef2 = _b[1];
            return !recursiveRefMap.has(fromRef1 + fromRef2.slice(toRef1.length)) &&
                JsonPointer.isSubPointer(toRef1, fromRef2, true) &&
                !JsonPointer.isSubPointer(toRef1, fromRef1, true);
        }))
            .forEach((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var _b = tslib_1.__read(_a, 2), fromRef2 = _b[0], toRef2 = _b[1];
            return recursiveRefMap.set(fromRef1 + fromRef2.slice(toRef1.length), fromRef1 + toRef2.slice(toRef1.length));
        }));
    }));
    // Create compiled schema by replacing all non-recursive $ref links with
    // thieir linked schemas and, where possible, combining schemas in allOf arrays.
    /** @type {?} */
    var compiledSchema = tslib_1.__assign({}, schema);
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
    function (subSchema, subSchemaPointer) {
        if (isString(subSchema['$ref'])) {
            /** @type {?} */
            var refPointer = JsonPointer.compile(subSchema['$ref']);
            if (!JsonPointer.isSubPointer(refPointer, subSchemaPointer, true)) {
                refPointer = removeRecursiveReferences(subSchemaPointer, recursiveRefMap);
                JsonPointer.set(compiledSchema, subSchemaPointer, { $ref: "#" + refPointer });
            }
            if (!hasOwn(schemaRefLibrary, 'refPointer')) {
                schemaRefLibrary[refPointer] = !refPointer.length ? compiledSchema :
                    getSubSchema(compiledSchema, refPointer, schemaRefLibrary, recursiveRefMap);
            }
            if (!schemaRecursiveRefMap.has(subSchemaPointer)) {
                schemaRecursiveRefMap.set(subSchemaPointer, refPointer);
            }
            /** @type {?} */
            var fromDataRef = JsonPointer.toDataPointer(subSchemaPointer, compiledSchema);
            if (!dataRecursiveRefMap.has(fromDataRef)) {
                /** @type {?} */
                var toDataRef = JsonPointer.toDataPointer(refPointer, compiledSchema);
                dataRecursiveRefMap.set(fromDataRef, toDataRef);
            }
        }
        if (subSchema.type === 'array' &&
            (hasOwn(subSchema, 'items') || hasOwn(subSchema, 'additionalItems'))) {
            /** @type {?} */
            var dataPointer = JsonPointer.toDataPointer(subSchemaPointer, compiledSchema);
            if (!arrayMap.has(dataPointer)) {
                /** @type {?} */
                var tupleItems = isArray(subSchema.items) ? subSchema.items.length : 0;
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
export function getSubSchema(schema, pointer, schemaRefLibrary, schemaRecursiveRefMap, usedPointers) {
    if (schemaRefLibrary === void 0) { schemaRefLibrary = null; }
    if (schemaRecursiveRefMap === void 0) { schemaRecursiveRefMap = null; }
    if (usedPointers === void 0) { usedPointers = []; }
    if (!schemaRefLibrary || !schemaRecursiveRefMap) {
        return JsonPointer.getCopy(schema, pointer);
    }
    if (typeof pointer !== 'string') {
        pointer = JsonPointer.compile(pointer);
    }
    usedPointers = tslib_1.__spread(usedPointers, [pointer]);
    /** @type {?} */
    var newSchema = null;
    if (pointer === '') {
        newSchema = cloneDeep(schema);
    }
    else {
        /** @type {?} */
        var shortPointer = removeRecursiveReferences(pointer, schemaRecursiveRefMap);
        if (shortPointer !== pointer) {
            usedPointers = tslib_1.__spread(usedPointers, [shortPointer]);
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
    function (subSchema, subPointer) {
        if (isObject(subSchema)) {
            // Replace non-recursive $ref links with referenced schemas
            if (isString(subSchema.$ref)) {
                /** @type {?} */
                var refPointer_1 = JsonPointer.compile(subSchema.$ref);
                if (refPointer_1.length && usedPointers.every((/**
                 * @param {?} ptr
                 * @return {?}
                 */
                function (ptr) {
                    return !JsonPointer.isSubPointer(refPointer_1, ptr, true);
                }))) {
                    /** @type {?} */
                    var refSchema = getSubSchema(schema, refPointer_1, schemaRefLibrary, schemaRecursiveRefMap, usedPointers);
                    if (Object.keys(subSchema).length === 1) {
                        return refSchema;
                    }
                    else {
                        /** @type {?} */
                        var extraKeys = tslib_1.__assign({}, subSchema);
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
export function combineAllOf(schema) {
    if (!isObject(schema) || !isArray(schema.allOf)) {
        return schema;
    }
    /** @type {?} */
    var mergedSchema = mergeSchemas.apply(void 0, tslib_1.__spread(schema.allOf));
    if (Object.keys(schema).length > 1) {
        /** @type {?} */
        var extraKeys = tslib_1.__assign({}, schema);
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
export function fixRequiredArrayProperties(schema) {
    if (schema.type === 'array' && isArray(schema.required)) {
        /** @type {?} */
        var itemsObject_1 = hasOwn(schema.items, 'properties') ? 'items' :
            hasOwn(schema.additionalItems, 'properties') ? 'additionalItems' : null;
        if (itemsObject_1 && !hasOwn(schema[itemsObject_1], 'required') && (hasOwn(schema[itemsObject_1], 'additionalProperties') ||
            schema.required.every((/**
             * @param {?} key
             * @return {?}
             */
            function (key) { return hasOwn(schema[itemsObject_1].properties, key); })))) {
            schema = cloneDeep(schema);
            schema[itemsObject_1].required = schema.required;
            delete schema.required;
        }
    }
    return schema;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1zY2hlbWEuZnVuY3Rpb25zLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFqc2YvY29yZS8iLCJzb3VyY2VzIjpbImxpYi9zaGFyZWQvanNvbi1zY2hlbWEuZnVuY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxTQUFTLE1BQU0sa0JBQWtCLENBQUM7QUFDekMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMzRSxPQUFPLEVBQ0wsT0FBTyxFQUNQLFFBQVEsRUFDUixPQUFPLEVBQ1AsT0FBTyxFQUNQLFFBQVEsRUFDUixRQUFRLEVBQ1IsUUFBUSxFQUNQLE1BQU0sdUJBQXVCLENBQUM7QUFDakMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3RELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkN4RCxNQUFNLFVBQVUscUJBQXFCLENBQUMsTUFBTTtJQUMxQyxPQUFPO0lBQ1AsNEJBQTRCO0lBQzVCLDBFQUEwRTtJQUMxRSxpQ0FBaUM7SUFDakMsMENBQTBDO0lBQzFDLG9EQUFvRDtJQUNwRCxrRkFBa0Y7SUFDbEYsOEJBQThCO0lBQzlCLGtGQUFrRjtJQUNsRixRQUFRO0lBQ1IsTUFBTTtJQUNOLHdCQUF3QjtJQUN4QixLQUFLO0lBQ0wscUNBQXFDO0lBQ3JDLHlCQUF5QjtJQUN6QiwwQ0FBMEM7SUFDMUMsNEJBQTRCO0lBQzVCLGlDQUFpQztJQUNqQyxnQ0FBZ0M7SUFDaEMsTUFBTTtJQUNOLDhCQUE4QjtJQUM5QixPQUFPO0lBQ1AsTUFBTTtBQUNSLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQVlELE1BQU0sVUFBVSxtQkFBbUIsQ0FDakMsSUFBSSxFQUFFLGdCQUF3QixFQUFFLE1BQWE7O0lBQXZDLGlDQUFBLEVBQUEsd0JBQXdC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Q3pFLElBQUksYUFBVyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFXLENBQUMsRUFBRSxVQUFVLENBQUMsSUFBSSxDQUM3RCxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQVcsQ0FBQyxFQUFFLHNCQUFzQixDQUFDO1lBQ25ELE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSzs7OztZQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFXLENBQUMsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLEVBQTNDLENBQTJDLEVBQUMsQ0FDMUUsRUFBRTtZQUNELE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDM0IsTUFBTSxDQUFDLGFBQVcsQ0FBQyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQy9DLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQztTQUN4QjtLQUNGO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbG9uZURlZXAgZnJvbSAnbG9kYXNoL2Nsb25lRGVlcCc7XG5pbXBvcnQgeyBmb3JFYWNoLCBoYXNPd24sIG1lcmdlRmlsdGVyZWRPYmplY3QgfSBmcm9tICcuL3V0aWxpdHkuZnVuY3Rpb25zJztcbmltcG9ydCB7XG4gIGdldFR5cGUsXG4gIGhhc1ZhbHVlLFxuICBpbkFycmF5LFxuICBpc0FycmF5LFxuICBpc051bWJlcixcbiAgaXNPYmplY3QsXG4gIGlzU3RyaW5nXG4gIH0gZnJvbSAnLi92YWxpZGF0b3IuZnVuY3Rpb25zJztcbmltcG9ydCB7IEpzb25Qb2ludGVyIH0gZnJvbSAnLi9qc29ucG9pbnRlci5mdW5jdGlvbnMnO1xuaW1wb3J0IHsgbWVyZ2VTY2hlbWFzIH0gZnJvbSAnLi9tZXJnZS1zY2hlbWFzLmZ1bmN0aW9uJztcblxuXG4vKipcbiAqIEpTT04gU2NoZW1hIGZ1bmN0aW9uIGxpYnJhcnk6XG4gKlxuICogYnVpbGRTY2hlbWFGcm9tTGF5b3V0OiAgIFRPRE86IFdyaXRlIHRoaXMgZnVuY3Rpb25cbiAqXG4gKiBidWlsZFNjaGVtYUZyb21EYXRhOlxuICpcbiAqIGdldEZyb21TY2hlbWE6XG4gKlxuICogcmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlczpcbiAqXG4gKiBnZXRJbnB1dFR5cGU6XG4gKlxuICogY2hlY2tJbmxpbmVUeXBlOlxuICpcbiAqIGlzSW5wdXRSZXF1aXJlZDpcbiAqXG4gKiB1cGRhdGVJbnB1dE9wdGlvbnM6XG4gKlxuICogZ2V0VGl0bGVNYXBGcm9tT25lT2Y6XG4gKlxuICogZ2V0Q29udHJvbFZhbGlkYXRvcnM6XG4gKlxuICogcmVzb2x2ZVNjaGVtYVJlZmVyZW5jZXM6XG4gKlxuICogZ2V0U3ViU2NoZW1hOlxuICpcbiAqIGNvbWJpbmVBbGxPZjpcbiAqXG4gKiBmaXhSZXF1aXJlZEFycmF5UHJvcGVydGllczpcbiAqL1xuXG4vKipcbiAqICdidWlsZFNjaGVtYUZyb21MYXlvdXQnIGZ1bmN0aW9uXG4gKlxuICogVE9ETzogQnVpbGQgYSBKU09OIFNjaGVtYSBmcm9tIGEgSlNPTiBGb3JtIGxheW91dFxuICpcbiAqIC8vICAgbGF5b3V0IC0gVGhlIEpTT04gRm9ybSBsYXlvdXRcbiAqIC8vICAtIFRoZSBuZXcgSlNPTiBTY2hlbWFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkU2NoZW1hRnJvbUxheW91dChsYXlvdXQpIHtcbiAgcmV0dXJuO1xuICAvLyBsZXQgbmV3U2NoZW1hOiBhbnkgPSB7IH07XG4gIC8vIGNvbnN0IHdhbGtMYXlvdXQgPSAobGF5b3V0SXRlbXM6IGFueVtdLCBjYWxsYmFjazogRnVuY3Rpb24pOiBhbnlbXSA9PiB7XG4gIC8vICAgbGV0IHJldHVybkFycmF5OiBhbnlbXSA9IFtdO1xuICAvLyAgIGZvciAobGV0IGxheW91dEl0ZW0gb2YgbGF5b3V0SXRlbXMpIHtcbiAgLy8gICAgIGNvbnN0IHJldHVybkl0ZW06IGFueSA9IGNhbGxiYWNrKGxheW91dEl0ZW0pO1xuICAvLyAgICAgaWYgKHJldHVybkl0ZW0pIHsgcmV0dXJuQXJyYXkgPSByZXR1cm5BcnJheS5jb25jYXQoY2FsbGJhY2sobGF5b3V0SXRlbSkpOyB9XG4gIC8vICAgICBpZiAobGF5b3V0SXRlbS5pdGVtcykge1xuICAvLyAgICAgICByZXR1cm5BcnJheSA9IHJldHVybkFycmF5LmNvbmNhdCh3YWxrTGF5b3V0KGxheW91dEl0ZW0uaXRlbXMsIGNhbGxiYWNrKSk7XG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyAgIHJldHVybiByZXR1cm5BcnJheTtcbiAgLy8gfTtcbiAgLy8gd2Fsa0xheW91dChsYXlvdXQsIGxheW91dEl0ZW0gPT4ge1xuICAvLyAgIGxldCBpdGVtS2V5OiBzdHJpbmc7XG4gIC8vICAgaWYgKHR5cGVvZiBsYXlvdXRJdGVtID09PSAnc3RyaW5nJykge1xuICAvLyAgICAgaXRlbUtleSA9IGxheW91dEl0ZW07XG4gIC8vICAgfSBlbHNlIGlmIChsYXlvdXRJdGVtLmtleSkge1xuICAvLyAgICAgaXRlbUtleSA9IGxheW91dEl0ZW0ua2V5O1xuICAvLyAgIH1cbiAgLy8gICBpZiAoIWl0ZW1LZXkpIHsgcmV0dXJuOyB9XG4gIC8vICAgLy9cbiAgLy8gfSk7XG59XG5cbi8qKlxuICogJ2J1aWxkU2NoZW1hRnJvbURhdGEnIGZ1bmN0aW9uXG4gKlxuICogQnVpbGQgYSBKU09OIFNjaGVtYSBmcm9tIGEgZGF0YSBvYmplY3RcbiAqXG4gKiAvLyAgIGRhdGEgLSBUaGUgZGF0YSBvYmplY3RcbiAqIC8vICB7IGJvb2xlYW4gPSBmYWxzZSB9IHJlcXVpcmVBbGxGaWVsZHMgLSBSZXF1aXJlIGFsbCBmaWVsZHM/XG4gKiAvLyAgeyBib29sZWFuID0gdHJ1ZSB9IGlzUm9vdCAtIGlzIHJvb3RcbiAqIC8vICAtIFRoZSBuZXcgSlNPTiBTY2hlbWFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkU2NoZW1hRnJvbURhdGEoXG4gIGRhdGEsIHJlcXVpcmVBbGxGaWVsZHMgPSBmYWxzZSwgaXNSb290ID0gdHJ1ZVxuKSB7XG4gIGNvbnN0IG5ld1NjaGVtYTogYW55ID0ge307XG4gIGNvbnN0IGdldEZpZWxkVHlwZSA9ICh2YWx1ZTogYW55KTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBmaWVsZFR5cGUgPSBnZXRUeXBlKHZhbHVlLCAnc3RyaWN0Jyk7XG4gICAgcmV0dXJuIHsgaW50ZWdlcjogJ251bWJlcicsIG51bGw6ICdzdHJpbmcnIH1bZmllbGRUeXBlXSB8fCBmaWVsZFR5cGU7XG4gIH07XG4gIGNvbnN0IGJ1aWxkU3ViU2NoZW1hID0gKHZhbHVlKSA9PlxuICAgIGJ1aWxkU2NoZW1hRnJvbURhdGEodmFsdWUsIHJlcXVpcmVBbGxGaWVsZHMsIGZhbHNlKTtcbiAgaWYgKGlzUm9vdCkgeyBuZXdTY2hlbWEuJHNjaGVtYSA9ICdodHRwOi8vanNvbi1zY2hlbWEub3JnL2RyYWZ0LTA2L3NjaGVtYSMnOyB9XG4gIG5ld1NjaGVtYS50eXBlID0gZ2V0RmllbGRUeXBlKGRhdGEpO1xuICBpZiAobmV3U2NoZW1hLnR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgbmV3U2NoZW1hLnByb3BlcnRpZXMgPSB7fTtcbiAgICBpZiAocmVxdWlyZUFsbEZpZWxkcykgeyBuZXdTY2hlbWEucmVxdWlyZWQgPSBbXTsgfVxuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGRhdGEpKSB7XG4gICAgICBuZXdTY2hlbWEucHJvcGVydGllc1trZXldID0gYnVpbGRTdWJTY2hlbWEoZGF0YVtrZXldKTtcbiAgICAgIGlmIChyZXF1aXJlQWxsRmllbGRzKSB7IG5ld1NjaGVtYS5yZXF1aXJlZC5wdXNoKGtleSk7IH1cbiAgICB9XG4gIH0gZWxzZSBpZiAobmV3U2NoZW1hLnR5cGUgPT09ICdhcnJheScpIHtcbiAgICBuZXdTY2hlbWEuaXRlbXMgPSBkYXRhLm1hcChidWlsZFN1YlNjaGVtYSk7XG4gICAgLy8gSWYgYWxsIGl0ZW1zIGFyZSB0aGUgc2FtZSB0eXBlLCB1c2UgYW4gb2JqZWN0IGZvciBpdGVtcyBpbnN0ZWFkIG9mIGFuIGFycmF5XG4gICAgaWYgKChuZXcgU2V0KGRhdGEubWFwKGdldEZpZWxkVHlwZSkpKS5zaXplID09PSAxKSB7XG4gICAgICBuZXdTY2hlbWEuaXRlbXMgPSBuZXdTY2hlbWEuaXRlbXMucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSk7XG4gICAgfVxuICAgIGlmIChyZXF1aXJlQWxsRmllbGRzKSB7IG5ld1NjaGVtYS5taW5JdGVtcyA9IDE7IH1cbiAgfVxuICByZXR1cm4gbmV3U2NoZW1hO1xufVxuXG4vKipcbiAqICdnZXRGcm9tU2NoZW1hJyBmdW5jdGlvblxuICpcbiAqIFVzZXMgYSBKU09OIFBvaW50ZXIgZm9yIGEgdmFsdWUgd2l0aGluIGEgZGF0YSBvYmplY3QgdG8gcmV0cmlldmVcbiAqIHRoZSBzY2hlbWEgZm9yIHRoYXQgdmFsdWUgd2l0aGluIHNjaGVtYSBmb3IgdGhlIGRhdGEgb2JqZWN0LlxuICpcbiAqIFRoZSBvcHRpb25hbCB0aGlyZCBwYXJhbWV0ZXIgY2FuIGFsc28gYmUgc2V0IHRvIHJldHVybiBzb21ldGhpbmcgZWxzZTpcbiAqICdzY2hlbWEnIChkZWZhdWx0KTogdGhlIHNjaGVtYSBmb3IgdGhlIHZhbHVlIGluZGljYXRlZCBieSB0aGUgZGF0YSBwb2ludGVyXG4gKiAncGFyZW50U2NoZW1hJzogdGhlIHNjaGVtYSBmb3IgdGhlIHZhbHVlJ3MgcGFyZW50IG9iamVjdCBvciBhcnJheVxuICogJ3NjaGVtYVBvaW50ZXInOiBhIHBvaW50ZXIgdG8gdGhlIHZhbHVlJ3Mgc2NoZW1hIHdpdGhpbiB0aGUgb2JqZWN0J3Mgc2NoZW1hXG4gKiAncGFyZW50U2NoZW1hUG9pbnRlcic6IGEgcG9pbnRlciB0byB0aGUgc2NoZW1hIGZvciB0aGUgdmFsdWUncyBwYXJlbnQgb2JqZWN0IG9yIGFycmF5XG4gKlxuICogLy8gICBzY2hlbWEgLSBUaGUgc2NoZW1hIHRvIGdldCB0aGUgc3ViLXNjaGVtYSBmcm9tXG4gKiAvLyAgeyBQb2ludGVyIH0gZGF0YVBvaW50ZXIgLSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSlcbiAqIC8vICB7IHN0cmluZyA9ICdzY2hlbWEnIH0gcmV0dXJuVHlwZSAtIHdoYXQgdG8gcmV0dXJuP1xuICogLy8gIC0gVGhlIGxvY2F0ZWQgc3ViLXNjaGVtYVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RnJvbVNjaGVtYShzY2hlbWEsIGRhdGFQb2ludGVyLCByZXR1cm5UeXBlID0gJ3NjaGVtYScpIHtcbiAgY29uc3QgZGF0YVBvaW50ZXJBcnJheTogYW55W10gPSBKc29uUG9pbnRlci5wYXJzZShkYXRhUG9pbnRlcik7XG4gIGlmIChkYXRhUG9pbnRlckFycmF5ID09PSBudWxsKSB7XG4gICAgY29uc29sZS5lcnJvcihgZ2V0RnJvbVNjaGVtYSBlcnJvcjogSW52YWxpZCBKU09OIFBvaW50ZXI6ICR7ZGF0YVBvaW50ZXJ9YCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgbGV0IHN1YlNjaGVtYSA9IHNjaGVtYTtcbiAgY29uc3Qgc2NoZW1hUG9pbnRlciA9IFtdO1xuICBjb25zdCBsZW5ndGggPSBkYXRhUG9pbnRlckFycmF5Lmxlbmd0aDtcbiAgaWYgKHJldHVyblR5cGUuc2xpY2UoMCwgNikgPT09ICdwYXJlbnQnKSB7IGRhdGFQb2ludGVyQXJyYXkubGVuZ3RoLS07IH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGNvbnN0IHBhcmVudFNjaGVtYSA9IHN1YlNjaGVtYTtcbiAgICBjb25zdCBrZXkgPSBkYXRhUG9pbnRlckFycmF5W2ldO1xuICAgIGxldCBzdWJTY2hlbWFGb3VuZCA9IGZhbHNlO1xuICAgIGlmICh0eXBlb2Ygc3ViU2NoZW1hICE9PSAnb2JqZWN0Jykge1xuICAgICAgY29uc29sZS5lcnJvcihgZ2V0RnJvbVNjaGVtYSBlcnJvcjogVW5hYmxlIHRvIGZpbmQgXCIke2tleX1cIiBrZXkgaW4gc2NoZW1hLmApO1xuICAgICAgY29uc29sZS5lcnJvcihzY2hlbWEpO1xuICAgICAgY29uc29sZS5lcnJvcihkYXRhUG9pbnRlcik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKHN1YlNjaGVtYS50eXBlID09PSAnYXJyYXknICYmICghaXNOYU4oa2V5KSB8fCBrZXkgPT09ICctJykpIHtcbiAgICAgIGlmIChoYXNPd24oc3ViU2NoZW1hLCAnaXRlbXMnKSkge1xuICAgICAgICBpZiAoaXNPYmplY3Qoc3ViU2NoZW1hLml0ZW1zKSkge1xuICAgICAgICAgIHN1YlNjaGVtYUZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICBzdWJTY2hlbWEgPSBzdWJTY2hlbWEuaXRlbXM7XG4gICAgICAgICAgc2NoZW1hUG9pbnRlci5wdXNoKCdpdGVtcycpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkoc3ViU2NoZW1hLml0ZW1zKSkge1xuICAgICAgICAgIGlmICghaXNOYU4oa2V5KSAmJiBzdWJTY2hlbWEuaXRlbXMubGVuZ3RoID49ICtrZXkpIHtcbiAgICAgICAgICAgIHN1YlNjaGVtYUZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIHN1YlNjaGVtYSA9IHN1YlNjaGVtYS5pdGVtc1sra2V5XTtcbiAgICAgICAgICAgIHNjaGVtYVBvaW50ZXIucHVzaCgnaXRlbXMnLCBrZXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFzdWJTY2hlbWFGb3VuZCAmJiBpc09iamVjdChzdWJTY2hlbWEuYWRkaXRpb25hbEl0ZW1zKSkge1xuICAgICAgICBzdWJTY2hlbWFGb3VuZCA9IHRydWU7XG4gICAgICAgIHN1YlNjaGVtYSA9IHN1YlNjaGVtYS5hZGRpdGlvbmFsSXRlbXM7XG4gICAgICAgIHNjaGVtYVBvaW50ZXIucHVzaCgnYWRkaXRpb25hbEl0ZW1zJyk7XG4gICAgICB9IGVsc2UgaWYgKHN1YlNjaGVtYS5hZGRpdGlvbmFsSXRlbXMgIT09IGZhbHNlKSB7XG4gICAgICAgIHN1YlNjaGVtYUZvdW5kID0gdHJ1ZTtcbiAgICAgICAgc3ViU2NoZW1hID0geyB9O1xuICAgICAgICBzY2hlbWFQb2ludGVyLnB1c2goJ2FkZGl0aW9uYWxJdGVtcycpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc3ViU2NoZW1hLnR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAoaXNPYmplY3Qoc3ViU2NoZW1hLnByb3BlcnRpZXMpICYmIGhhc093bihzdWJTY2hlbWEucHJvcGVydGllcywga2V5KSkge1xuICAgICAgICBzdWJTY2hlbWFGb3VuZCA9IHRydWU7XG4gICAgICAgIHN1YlNjaGVtYSA9IHN1YlNjaGVtYS5wcm9wZXJ0aWVzW2tleV07XG4gICAgICAgIHNjaGVtYVBvaW50ZXIucHVzaCgncHJvcGVydGllcycsIGtleSk7XG4gICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KHN1YlNjaGVtYS5hZGRpdGlvbmFsUHJvcGVydGllcykpIHtcbiAgICAgICAgc3ViU2NoZW1hRm91bmQgPSB0cnVlO1xuICAgICAgICBzdWJTY2hlbWEgPSBzdWJTY2hlbWEuYWRkaXRpb25hbFByb3BlcnRpZXM7XG4gICAgICAgIHNjaGVtYVBvaW50ZXIucHVzaCgnYWRkaXRpb25hbFByb3BlcnRpZXMnKTtcbiAgICAgIH0gZWxzZSBpZiAoc3ViU2NoZW1hLmFkZGl0aW9uYWxQcm9wZXJ0aWVzICE9PSBmYWxzZSkge1xuICAgICAgICBzdWJTY2hlbWFGb3VuZCA9IHRydWU7XG4gICAgICAgIHN1YlNjaGVtYSA9IHsgfTtcbiAgICAgICAgc2NoZW1hUG9pbnRlci5wdXNoKCdhZGRpdGlvbmFsUHJvcGVydGllcycpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIXN1YlNjaGVtYUZvdW5kKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBnZXRGcm9tU2NoZW1hIGVycm9yOiBVbmFibGUgdG8gZmluZCBcIiR7a2V5fVwiIGl0ZW0gaW4gc2NoZW1hLmApO1xuICAgICAgY29uc29sZS5lcnJvcihzY2hlbWEpO1xuICAgICAgY29uc29sZS5lcnJvcihkYXRhUG9pbnRlcik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHJldHVybiByZXR1cm5UeXBlLnNsaWNlKC03KSA9PT0gJ1BvaW50ZXInID8gc2NoZW1hUG9pbnRlciA6IHN1YlNjaGVtYTtcbn1cblxuLyoqXG4gKiAncmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlcycgZnVuY3Rpb25cbiAqXG4gKiBDaGVja3MgYSBKU09OIFBvaW50ZXIgYWdhaW5zdCBhIG1hcCBvZiByZWN1cnNpdmUgcmVmZXJlbmNlcyBhbmQgcmV0dXJuc1xuICogYSBKU09OIFBvaW50ZXIgdG8gdGhlIHNoYWxsb3dlc3QgZXF1aXZhbGVudCBsb2NhdGlvbiBpbiB0aGUgc2FtZSBvYmplY3QuXG4gKlxuICogVXNpbmcgdGhpcyBmdW5jdGlvbnMgZW5hYmxlcyBhbiBvYmplY3QgdG8gYmUgY29uc3RydWN0ZWQgd2l0aCB1bmxpbWl0ZWRcbiAqIHJlY3Vyc2lvbiwgd2hpbGUgbWFpbnRhaW5nIGEgZml4ZWQgc2V0IG9mIG1ldGFkYXRhLCBzdWNoIGFzIGZpZWxkIGRhdGEgdHlwZXMuXG4gKiBUaGUgb2JqZWN0IGNhbiBncm93IGFzIGxhcmdlIGFzIGl0IHdhbnRzLCBhbmQgZGVlcGx5IHJlY3Vyc2VkIG5vZGVzIGNhblxuICoganVzdCByZWZlciB0byB0aGUgbWV0YWRhdGEgZm9yIHRoZWlyIHNoYWxsb3cgZXF1aXZhbGVudHMsIGluc3RlYWQgb2YgaGF2aW5nXG4gKiB0byBhZGQgYWRkaXRpb25hbCByZWR1bmRhbnQgbWV0YWRhdGEgZm9yIGVhY2ggcmVjdXJzaXZlbHkgYWRkZWQgbm9kZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIHBvaW50ZXI6ICAgICAgICAgJy9zdHVmZi9hbmQvbW9yZS9hbmQvbW9yZS9hbmQvbW9yZS9hbmQvbW9yZS9zdHVmZidcbiAqIHJlY3Vyc2l2ZVJlZk1hcDogW1snL3N0dWZmL2FuZC9tb3JlL2FuZC9tb3JlJywgJy9zdHVmZi9hbmQvbW9yZS8nXV1cbiAqIHJldHVybmVkOiAgICAgICAgJy9zdHVmZi9hbmQvbW9yZS9zdHVmZidcbiAqXG4gKiAvLyAgeyBQb2ludGVyIH0gcG9pbnRlciAtXG4gKiAvLyAgeyBNYXA8c3RyaW5nLCBzdHJpbmc+IH0gcmVjdXJzaXZlUmVmTWFwIC1cbiAqIC8vICB7IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBuZXcgTWFwKCkgfSBhcnJheU1hcCAtIG9wdGlvbmFsXG4gKiAvLyB7IHN0cmluZyB9IC1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoXG4gIHBvaW50ZXIsIHJlY3Vyc2l2ZVJlZk1hcCwgYXJyYXlNYXAgPSBuZXcgTWFwKClcbikge1xuICBpZiAoIXBvaW50ZXIpIHsgcmV0dXJuICcnOyB9XG4gIGxldCBnZW5lcmljUG9pbnRlciA9XG4gICAgSnNvblBvaW50ZXIudG9HZW5lcmljUG9pbnRlcihKc29uUG9pbnRlci5jb21waWxlKHBvaW50ZXIpLCBhcnJheU1hcCk7XG4gIGlmIChnZW5lcmljUG9pbnRlci5pbmRleE9mKCcvJykgPT09IC0xKSB7IHJldHVybiBnZW5lcmljUG9pbnRlcjsgfVxuICBsZXQgcG9zc2libGVSZWZlcmVuY2VzID0gdHJ1ZTtcbiAgd2hpbGUgKHBvc3NpYmxlUmVmZXJlbmNlcykge1xuICAgIHBvc3NpYmxlUmVmZXJlbmNlcyA9IGZhbHNlO1xuICAgIHJlY3Vyc2l2ZVJlZk1hcC5mb3JFYWNoKCh0b1BvaW50ZXIsIGZyb21Qb2ludGVyKSA9PiB7XG4gICAgICBpZiAoSnNvblBvaW50ZXIuaXNTdWJQb2ludGVyKHRvUG9pbnRlciwgZnJvbVBvaW50ZXIpKSB7XG4gICAgICAgIHdoaWxlIChKc29uUG9pbnRlci5pc1N1YlBvaW50ZXIoZnJvbVBvaW50ZXIsIGdlbmVyaWNQb2ludGVyLCB0cnVlKSkge1xuICAgICAgICAgIGdlbmVyaWNQb2ludGVyID0gSnNvblBvaW50ZXIudG9HZW5lcmljUG9pbnRlcihcbiAgICAgICAgICAgIHRvUG9pbnRlciArIGdlbmVyaWNQb2ludGVyLnNsaWNlKGZyb21Qb2ludGVyLmxlbmd0aCksIGFycmF5TWFwXG4gICAgICAgICAgKTtcbiAgICAgICAgICBwb3NzaWJsZVJlZmVyZW5jZXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGdlbmVyaWNQb2ludGVyO1xufVxuXG4vKipcbiAqICdnZXRJbnB1dFR5cGUnIGZ1bmN0aW9uXG4gKlxuICogLy8gICBzY2hlbWFcbiAqIC8vICB7IGFueSA9IG51bGwgfSBsYXlvdXROb2RlXG4gKiAvLyB7IHN0cmluZyB9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbnB1dFR5cGUoc2NoZW1hLCBsYXlvdXROb2RlOiBhbnkgPSBudWxsKSB7XG4gIC8vIHgtc2NoZW1hLWZvcm0gPSBBbmd1bGFyIFNjaGVtYSBGb3JtIGNvbXBhdGliaWxpdHlcbiAgLy8gd2lkZ2V0ICYgY29tcG9uZW50ID0gUmVhY3QgSnNvbnNjaGVtYSBGb3JtIGNvbXBhdGliaWxpdHlcbiAgY29uc3QgY29udHJvbFR5cGUgPSBKc29uUG9pbnRlci5nZXRGaXJzdChbXG4gICAgW3NjaGVtYSwgJy94LXNjaGVtYS1mb3JtL3R5cGUnXSxcbiAgICBbc2NoZW1hLCAnL3gtc2NoZW1hLWZvcm0vd2lkZ2V0L2NvbXBvbmVudCddLFxuICAgIFtzY2hlbWEsICcveC1zY2hlbWEtZm9ybS93aWRnZXQnXSxcbiAgICBbc2NoZW1hLCAnL3dpZGdldC9jb21wb25lbnQnXSxcbiAgICBbc2NoZW1hLCAnL3dpZGdldCddXG4gIF0pO1xuICBpZiAoaXNTdHJpbmcoY29udHJvbFR5cGUpKSB7IHJldHVybiBjaGVja0lubGluZVR5cGUoY29udHJvbFR5cGUsIHNjaGVtYSwgbGF5b3V0Tm9kZSk7IH1cbiAgbGV0IHNjaGVtYVR5cGUgPSBzY2hlbWEudHlwZTtcbiAgaWYgKHNjaGVtYVR5cGUpIHtcbiAgICBpZiAoaXNBcnJheShzY2hlbWFUeXBlKSkgeyAvLyBJZiBtdWx0aXBsZSB0eXBlcyBsaXN0ZWQsIHVzZSBtb3N0IGluY2x1c2l2ZSB0eXBlXG4gICAgICBzY2hlbWFUeXBlID1cbiAgICAgICAgaW5BcnJheSgnb2JqZWN0Jywgc2NoZW1hVHlwZSkgJiYgaGFzT3duKHNjaGVtYSwgJ3Byb3BlcnRpZXMnKSA/ICdvYmplY3QnIDpcbiAgICAgICAgaW5BcnJheSgnYXJyYXknLCBzY2hlbWFUeXBlKSAmJiBoYXNPd24oc2NoZW1hLCAnaXRlbXMnKSA/ICdhcnJheScgOlxuICAgICAgICBpbkFycmF5KCdhcnJheScsIHNjaGVtYVR5cGUpICYmIGhhc093bihzY2hlbWEsICdhZGRpdGlvbmFsSXRlbXMnKSA/ICdhcnJheScgOlxuICAgICAgICBpbkFycmF5KCdzdHJpbmcnLCBzY2hlbWFUeXBlKSA/ICdzdHJpbmcnIDpcbiAgICAgICAgaW5BcnJheSgnbnVtYmVyJywgc2NoZW1hVHlwZSkgPyAnbnVtYmVyJyA6XG4gICAgICAgIGluQXJyYXkoJ2ludGVnZXInLCBzY2hlbWFUeXBlKSA/ICdpbnRlZ2VyJyA6XG4gICAgICAgIGluQXJyYXkoJ2Jvb2xlYW4nLCBzY2hlbWFUeXBlKSA/ICdib29sZWFuJyA6ICd1bmtub3duJztcbiAgICB9XG4gICAgaWYgKHNjaGVtYVR5cGUgPT09ICdib29sZWFuJykgeyByZXR1cm4gJ2NoZWNrYm94JzsgfVxuICAgIGlmIChzY2hlbWFUeXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKGhhc093bihzY2hlbWEsICdwcm9wZXJ0aWVzJykgfHwgaGFzT3duKHNjaGVtYSwgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJykpIHtcbiAgICAgICAgcmV0dXJuICdzZWN0aW9uJztcbiAgICAgIH1cbiAgICAgIC8vIFRPRE86IEZpZ3VyZSBvdXQgaG93IHRvIGhhbmRsZSBhZGRpdGlvbmFsUHJvcGVydGllc1xuICAgICAgaWYgKGhhc093bihzY2hlbWEsICckcmVmJykpIHsgcmV0dXJuICckcmVmJzsgfVxuICAgIH1cbiAgICBpZiAoc2NoZW1hVHlwZSA9PT0gJ2FycmF5Jykge1xuICAgICAgY29uc3QgaXRlbXNPYmplY3QgPSBKc29uUG9pbnRlci5nZXRGaXJzdChbXG4gICAgICAgIFtzY2hlbWEsICcvaXRlbXMnXSxcbiAgICAgICAgW3NjaGVtYSwgJy9hZGRpdGlvbmFsSXRlbXMnXVxuICAgICAgXSkgfHwge307XG4gICAgICByZXR1cm4gaGFzT3duKGl0ZW1zT2JqZWN0LCAnZW51bScpICYmIHNjaGVtYS5tYXhJdGVtcyAhPT0gMSA/XG4gICAgICAgIGNoZWNrSW5saW5lVHlwZSgnY2hlY2tib3hlcycsIHNjaGVtYSwgbGF5b3V0Tm9kZSkgOiAnYXJyYXknO1xuICAgIH1cbiAgICBpZiAoc2NoZW1hVHlwZSA9PT0gJ251bGwnKSB7IHJldHVybiAnbm9uZSc7IH1cbiAgICBpZiAoSnNvblBvaW50ZXIuaGFzKGxheW91dE5vZGUsICcvb3B0aW9ucy90aXRsZU1hcCcpIHx8XG4gICAgICBoYXNPd24oc2NoZW1hLCAnZW51bScpIHx8IGdldFRpdGxlTWFwRnJvbU9uZU9mKHNjaGVtYSwgbnVsbCwgdHJ1ZSlcbiAgICApIHsgcmV0dXJuICdzZWxlY3QnOyB9XG4gICAgaWYgKHNjaGVtYVR5cGUgPT09ICdudW1iZXInIHx8IHNjaGVtYVR5cGUgPT09ICdpbnRlZ2VyJykge1xuICAgICAgcmV0dXJuIChzY2hlbWFUeXBlID09PSAnaW50ZWdlcicgfHwgaGFzT3duKHNjaGVtYSwgJ211bHRpcGxlT2YnKSkgJiZcbiAgICAgICAgaGFzT3duKHNjaGVtYSwgJ21heGltdW0nKSAmJiBoYXNPd24oc2NoZW1hLCAnbWluaW11bScpID8gJ3JhbmdlJyA6IHNjaGVtYVR5cGU7XG4gICAgfVxuICAgIGlmIChzY2hlbWFUeXBlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ2NvbG9yJzogJ2NvbG9yJyxcbiAgICAgICAgJ2RhdGUnOiAnZGF0ZScsXG4gICAgICAgICdkYXRlLXRpbWUnOiAnZGF0ZXRpbWUtbG9jYWwnLFxuICAgICAgICAnZW1haWwnOiAnZW1haWwnLFxuICAgICAgICAndXJpJzogJ3VybCcsXG4gICAgICB9W3NjaGVtYS5mb3JtYXRdIHx8ICd0ZXh0JztcbiAgICB9XG4gIH1cbiAgaWYgKGhhc093bihzY2hlbWEsICckcmVmJykpIHsgcmV0dXJuICckcmVmJzsgfVxuICBpZiAoaXNBcnJheShzY2hlbWEub25lT2YpIHx8IGlzQXJyYXkoc2NoZW1hLmFueU9mKSkgeyByZXR1cm4gJ29uZS1vZic7IH1cbiAgY29uc29sZS5lcnJvcihgZ2V0SW5wdXRUeXBlIGVycm9yOiBVbmFibGUgdG8gZGV0ZXJtaW5lIGlucHV0IHR5cGUgZm9yICR7c2NoZW1hVHlwZX1gKTtcbiAgY29uc29sZS5lcnJvcignc2NoZW1hJywgc2NoZW1hKTtcbiAgaWYgKGxheW91dE5vZGUpIHsgY29uc29sZS5lcnJvcignbGF5b3V0Tm9kZScsIGxheW91dE5vZGUpOyB9XG4gIHJldHVybiAnbm9uZSc7XG59XG5cbi8qKlxuICogJ2NoZWNrSW5saW5lVHlwZScgZnVuY3Rpb25cbiAqXG4gKiBDaGVja3MgbGF5b3V0IGFuZCBzY2hlbWEgbm9kZXMgZm9yICdpbmxpbmU6IHRydWUnLCBhbmQgY29udmVydHNcbiAqICdyYWRpb3MnIG9yICdjaGVja2JveGVzJyB0byAncmFkaW9zLWlubGluZScgb3IgJ2NoZWNrYm94ZXMtaW5saW5lJ1xuICpcbiAqIC8vICB7IHN0cmluZyB9IGNvbnRyb2xUeXBlIC1cbiAqIC8vICAgc2NoZW1hIC1cbiAqIC8vICB7IGFueSA9IG51bGwgfSBsYXlvdXROb2RlIC1cbiAqIC8vIHsgc3RyaW5nIH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrSW5saW5lVHlwZShjb250cm9sVHlwZSwgc2NoZW1hLCBsYXlvdXROb2RlOiBhbnkgPSBudWxsKSB7XG4gIGlmICghaXNTdHJpbmcoY29udHJvbFR5cGUpIHx8IChcbiAgICBjb250cm9sVHlwZS5zbGljZSgwLCA4KSAhPT0gJ2NoZWNrYm94JyAmJiBjb250cm9sVHlwZS5zbGljZSgwLCA1KSAhPT0gJ3JhZGlvJ1xuICApKSB7XG4gICAgcmV0dXJuIGNvbnRyb2xUeXBlO1xuICB9XG4gIGlmIChcbiAgICBKc29uUG9pbnRlci5nZXRGaXJzdChbXG4gICAgICBbbGF5b3V0Tm9kZSwgJy9pbmxpbmUnXSxcbiAgICAgIFtsYXlvdXROb2RlLCAnL29wdGlvbnMvaW5saW5lJ10sXG4gICAgICBbc2NoZW1hLCAnL2lubGluZSddLFxuICAgICAgW3NjaGVtYSwgJy94LXNjaGVtYS1mb3JtL2lubGluZSddLFxuICAgICAgW3NjaGVtYSwgJy94LXNjaGVtYS1mb3JtL29wdGlvbnMvaW5saW5lJ10sXG4gICAgICBbc2NoZW1hLCAnL3gtc2NoZW1hLWZvcm0vd2lkZ2V0L2lubGluZSddLFxuICAgICAgW3NjaGVtYSwgJy94LXNjaGVtYS1mb3JtL3dpZGdldC9jb21wb25lbnQvaW5saW5lJ10sXG4gICAgICBbc2NoZW1hLCAnL3gtc2NoZW1hLWZvcm0vd2lkZ2V0L2NvbXBvbmVudC9vcHRpb25zL2lubGluZSddLFxuICAgICAgW3NjaGVtYSwgJy93aWRnZXQvaW5saW5lJ10sXG4gICAgICBbc2NoZW1hLCAnL3dpZGdldC9jb21wb25lbnQvaW5saW5lJ10sXG4gICAgICBbc2NoZW1hLCAnL3dpZGdldC9jb21wb25lbnQvb3B0aW9ucy9pbmxpbmUnXSxcbiAgICBdKSA9PT0gdHJ1ZVxuICApIHtcbiAgICByZXR1cm4gY29udHJvbFR5cGUuc2xpY2UoMCwgNSkgPT09ICdyYWRpbycgP1xuICAgICAgJ3JhZGlvcy1pbmxpbmUnIDogJ2NoZWNrYm94ZXMtaW5saW5lJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY29udHJvbFR5cGU7XG4gIH1cbn1cblxuLyoqXG4gKiAnaXNJbnB1dFJlcXVpcmVkJyBmdW5jdGlvblxuICpcbiAqIENoZWNrcyBhIEpTT04gU2NoZW1hIHRvIHNlZSBpZiBhbiBpdGVtIGlzIHJlcXVpcmVkXG4gKlxuICogLy8gICBzY2hlbWEgLSB0aGUgc2NoZW1hIHRvIGNoZWNrXG4gKiAvLyAgeyBzdHJpbmcgfSBzY2hlbWFQb2ludGVyIC0gdGhlIHBvaW50ZXIgdG8gdGhlIGl0ZW0gdG8gY2hlY2tcbiAqIC8vIHsgYm9vbGVhbiB9IC0gdHJ1ZSBpZiB0aGUgaXRlbSBpcyByZXF1aXJlZCwgZmFsc2UgaWYgbm90XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0lucHV0UmVxdWlyZWQoc2NoZW1hLCBzY2hlbWFQb2ludGVyKSB7XG4gIGlmICghaXNPYmplY3Qoc2NoZW1hKSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2lzSW5wdXRSZXF1aXJlZCBlcnJvcjogSW5wdXQgc2NoZW1hIG11c3QgYmUgYW4gb2JqZWN0LicpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBsaXN0UG9pbnRlckFycmF5ID0gSnNvblBvaW50ZXIucGFyc2Uoc2NoZW1hUG9pbnRlcik7XG4gIGlmIChpc0FycmF5KGxpc3RQb2ludGVyQXJyYXkpKSB7XG4gICAgaWYgKCFsaXN0UG9pbnRlckFycmF5Lmxlbmd0aCkgeyByZXR1cm4gc2NoZW1hLnJlcXVpcmVkID09PSB0cnVlOyB9XG4gICAgY29uc3Qga2V5TmFtZSA9IGxpc3RQb2ludGVyQXJyYXkucG9wKCk7XG4gICAgY29uc3QgbmV4dFRvTGFzdEtleSA9IGxpc3RQb2ludGVyQXJyYXlbbGlzdFBvaW50ZXJBcnJheS5sZW5ndGggLSAxXTtcbiAgICBpZiAoWydwcm9wZXJ0aWVzJywgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJywgJ3BhdHRlcm5Qcm9wZXJ0aWVzJywgJ2l0ZW1zJywgJ2FkZGl0aW9uYWxJdGVtcyddXG4gICAgICAuaW5jbHVkZXMobmV4dFRvTGFzdEtleSlcbiAgICApIHtcbiAgICAgIGxpc3RQb2ludGVyQXJyYXkucG9wKCk7XG4gICAgfVxuICAgIGNvbnN0IHBhcmVudFNjaGVtYSA9IEpzb25Qb2ludGVyLmdldChzY2hlbWEsIGxpc3RQb2ludGVyQXJyYXkpIHx8IHt9O1xuICAgIGlmIChpc0FycmF5KHBhcmVudFNjaGVtYS5yZXF1aXJlZCkpIHtcbiAgICAgIHJldHVybiBwYXJlbnRTY2hlbWEucmVxdWlyZWQuaW5jbHVkZXMoa2V5TmFtZSk7XG4gICAgfVxuICAgIGlmIChwYXJlbnRTY2hlbWEudHlwZSA9PT0gJ2FycmF5Jykge1xuICAgICAgcmV0dXJuIGhhc093bihwYXJlbnRTY2hlbWEsICdtaW5JdGVtcycpICYmXG4gICAgICAgIGlzTnVtYmVyKGtleU5hbWUpICYmXG4gICAgICAgICtwYXJlbnRTY2hlbWEubWluSXRlbXMgPiAra2V5TmFtZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqICd1cGRhdGVJbnB1dE9wdGlvbnMnIGZ1bmN0aW9uXG4gKlxuICogLy8gICBsYXlvdXROb2RlXG4gKiAvLyAgIHNjaGVtYVxuICogLy8gICBqc2ZcbiAqIC8vIHsgdm9pZCB9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVJbnB1dE9wdGlvbnMobGF5b3V0Tm9kZSwgc2NoZW1hLCBqc2YpIHtcbiAgaWYgKCFpc09iamVjdChsYXlvdXROb2RlKSB8fCAhaXNPYmplY3QobGF5b3V0Tm9kZS5vcHRpb25zKSkgeyByZXR1cm47IH1cblxuICAvLyBTZXQgYWxsIG9wdGlvbiB2YWx1ZXMgaW4gbGF5b3V0Tm9kZS5vcHRpb25zXG4gIGNvbnN0IG5ld09wdGlvbnM6IGFueSA9IHsgfTtcbiAgY29uc3QgZml4VWlLZXlzID0ga2V5ID0+IGtleS5zbGljZSgwLCAzKS50b0xvd2VyQ2FzZSgpID09PSAndWk6JyA/IGtleS5zbGljZSgzKSA6IGtleTtcbiAgbWVyZ2VGaWx0ZXJlZE9iamVjdChuZXdPcHRpb25zLCBqc2YuZm9ybU9wdGlvbnMuZGVmYXV0V2lkZ2V0T3B0aW9ucywgW10sIGZpeFVpS2V5cyk7XG4gIFsgWyBKc29uUG9pbnRlci5nZXQoc2NoZW1hLCAnL3VpOndpZGdldC9vcHRpb25zJyksIFtdIF0sXG4gICAgWyBKc29uUG9pbnRlci5nZXQoc2NoZW1hLCAnL3VpOndpZGdldCcpLCBbXSBdLFxuICAgIFsgc2NoZW1hLCBbXG4gICAgICAnYWRkaXRpb25hbFByb3BlcnRpZXMnLCAnYWRkaXRpb25hbEl0ZW1zJywgJ3Byb3BlcnRpZXMnLCAnaXRlbXMnLFxuICAgICAgJ3JlcXVpcmVkJywgJ3R5cGUnLCAneC1zY2hlbWEtZm9ybScsICckcmVmJ1xuICAgIF0gXSxcbiAgICBbIEpzb25Qb2ludGVyLmdldChzY2hlbWEsICcveC1zY2hlbWEtZm9ybS9vcHRpb25zJyksIFtdIF0sXG4gICAgWyBKc29uUG9pbnRlci5nZXQoc2NoZW1hLCAnL3gtc2NoZW1hLWZvcm0nKSwgWydpdGVtcycsICdvcHRpb25zJ10gXSxcbiAgICBbIGxheW91dE5vZGUsIFtcbiAgICAgICdfaWQnLCAnJHJlZicsICdhcnJheUl0ZW0nLCAnYXJyYXlJdGVtVHlwZScsICdkYXRhUG9pbnRlcicsICdkYXRhVHlwZScsXG4gICAgICAnaXRlbXMnLCAna2V5JywgJ25hbWUnLCAnb3B0aW9ucycsICdyZWN1cnNpdmVSZWZlcmVuY2UnLCAndHlwZScsICd3aWRnZXQnXG4gICAgXSBdLFxuICAgIFsgbGF5b3V0Tm9kZS5vcHRpb25zLCBbXSBdLFxuICBdLmZvckVhY2goKFsgb2JqZWN0LCBleGNsdWRlS2V5cyBdKSA9PlxuICAgIG1lcmdlRmlsdGVyZWRPYmplY3QobmV3T3B0aW9ucywgb2JqZWN0LCBleGNsdWRlS2V5cywgZml4VWlLZXlzKVxuICApO1xuICBpZiAoIWhhc093bihuZXdPcHRpb25zLCAndGl0bGVNYXAnKSkge1xuICAgIGxldCBuZXdUaXRsZU1hcDogYW55ID0gbnVsbDtcbiAgICBuZXdUaXRsZU1hcCA9IGdldFRpdGxlTWFwRnJvbU9uZU9mKHNjaGVtYSwgbmV3T3B0aW9ucy5mbGF0TGlzdCk7XG4gICAgaWYgKG5ld1RpdGxlTWFwKSB7IG5ld09wdGlvbnMudGl0bGVNYXAgPSBuZXdUaXRsZU1hcDsgfVxuICAgIGlmICghaGFzT3duKG5ld09wdGlvbnMsICd0aXRsZU1hcCcpICYmICFoYXNPd24obmV3T3B0aW9ucywgJ2VudW0nKSAmJiBoYXNPd24oc2NoZW1hLCAnaXRlbXMnKSkge1xuICAgICAgaWYgKEpzb25Qb2ludGVyLmhhcyhzY2hlbWEsICcvaXRlbXMvdGl0bGVNYXAnKSkge1xuICAgICAgICBuZXdPcHRpb25zLnRpdGxlTWFwID0gc2NoZW1hLml0ZW1zLnRpdGxlTWFwO1xuICAgICAgfSBlbHNlIGlmIChKc29uUG9pbnRlci5oYXMoc2NoZW1hLCAnL2l0ZW1zL2VudW0nKSkge1xuICAgICAgICBuZXdPcHRpb25zLmVudW0gPSBzY2hlbWEuaXRlbXMuZW51bTtcbiAgICAgICAgaWYgKCFoYXNPd24obmV3T3B0aW9ucywgJ2VudW1OYW1lcycpICYmIEpzb25Qb2ludGVyLmhhcyhzY2hlbWEsICcvaXRlbXMvZW51bU5hbWVzJykpIHtcbiAgICAgICAgICBuZXdPcHRpb25zLmVudW1OYW1lcyA9IHNjaGVtYS5pdGVtcy5lbnVtTmFtZXM7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoSnNvblBvaW50ZXIuaGFzKHNjaGVtYSwgJy9pdGVtcy9vbmVPZicpKSB7XG4gICAgICAgIG5ld1RpdGxlTWFwID0gZ2V0VGl0bGVNYXBGcm9tT25lT2Yoc2NoZW1hLml0ZW1zLCBuZXdPcHRpb25zLmZsYXRMaXN0KTtcbiAgICAgICAgaWYgKG5ld1RpdGxlTWFwKSB7IG5ld09wdGlvbnMudGl0bGVNYXAgPSBuZXdUaXRsZU1hcDsgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIElmIHNjaGVtYSB0eXBlIGlzIGludGVnZXIsIGVuZm9yY2UgYnkgc2V0dGluZyBtdWx0aXBsZU9mID0gMVxuICBpZiAoc2NoZW1hLnR5cGUgPT09ICdpbnRlZ2VyJyAmJiAhaGFzVmFsdWUobmV3T3B0aW9ucy5tdWx0aXBsZU9mKSkge1xuICAgIG5ld09wdGlvbnMubXVsdGlwbGVPZiA9IDE7XG4gIH1cblxuICAvLyBDb3B5IGFueSB0eXBlYWhlYWQgd29yZCBsaXN0cyB0byBvcHRpb25zLnR5cGVhaGVhZC5zb3VyY2VcbiAgaWYgKEpzb25Qb2ludGVyLmhhcyhuZXdPcHRpb25zLCAnL2F1dG9jb21wbGV0ZS9zb3VyY2UnKSkge1xuICAgIG5ld09wdGlvbnMudHlwZWFoZWFkID0gbmV3T3B0aW9ucy5hdXRvY29tcGxldGU7XG4gIH0gZWxzZSBpZiAoSnNvblBvaW50ZXIuaGFzKG5ld09wdGlvbnMsICcvdGFnc2lucHV0L3NvdXJjZScpKSB7XG4gICAgbmV3T3B0aW9ucy50eXBlYWhlYWQgPSBuZXdPcHRpb25zLnRhZ3NpbnB1dDtcbiAgfSBlbHNlIGlmIChKc29uUG9pbnRlci5oYXMobmV3T3B0aW9ucywgJy90YWdzaW5wdXQvdHlwZWFoZWFkL3NvdXJjZScpKSB7XG4gICAgbmV3T3B0aW9ucy50eXBlYWhlYWQgPSBuZXdPcHRpb25zLnRhZ3NpbnB1dC50eXBlYWhlYWQ7XG4gIH1cblxuICBsYXlvdXROb2RlLm9wdGlvbnMgPSBuZXdPcHRpb25zO1xufVxuXG4vKipcbiAqICdnZXRUaXRsZU1hcEZyb21PbmVPZicgZnVuY3Rpb25cbiAqXG4gKiAvLyAgeyBzY2hlbWEgfSBzY2hlbWFcbiAqIC8vICB7IGJvb2xlYW4gPSBudWxsIH0gZmxhdExpc3RcbiAqIC8vICB7IGJvb2xlYW4gPSBmYWxzZSB9IHZhbGlkYXRlT25seVxuICogLy8geyB2YWxpZGF0b3JzIH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFRpdGxlTWFwRnJvbU9uZU9mKFxuICBzY2hlbWE6IGFueSA9IHt9LCBmbGF0TGlzdDogYm9vbGVhbiA9IG51bGwsIHZhbGlkYXRlT25seSA9IGZhbHNlXG4pIHtcbiAgbGV0IHRpdGxlTWFwID0gbnVsbDtcbiAgY29uc3Qgb25lT2YgPSBzY2hlbWEub25lT2YgfHwgc2NoZW1hLmFueU9mIHx8IG51bGw7XG4gIGlmIChpc0FycmF5KG9uZU9mKSAmJiBvbmVPZi5ldmVyeShpdGVtID0+IGl0ZW0udGl0bGUpKSB7XG4gICAgaWYgKG9uZU9mLmV2ZXJ5KGl0ZW0gPT4gaXNBcnJheShpdGVtLmVudW0pICYmIGl0ZW0uZW51bS5sZW5ndGggPT09IDEpKSB7XG4gICAgICBpZiAodmFsaWRhdGVPbmx5KSB7IHJldHVybiB0cnVlOyB9XG4gICAgICB0aXRsZU1hcCA9IG9uZU9mLm1hcChpdGVtID0+ICh7IG5hbWU6IGl0ZW0udGl0bGUsIHZhbHVlOiBpdGVtLmVudW1bMF0gfSkpO1xuICAgIH0gZWxzZSBpZiAob25lT2YuZXZlcnkoaXRlbSA9PiBpdGVtLmNvbnN0KSkge1xuICAgICAgaWYgKHZhbGlkYXRlT25seSkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgdGl0bGVNYXAgPSBvbmVPZi5tYXAoaXRlbSA9PiAoeyBuYW1lOiBpdGVtLnRpdGxlLCB2YWx1ZTogaXRlbS5jb25zdCB9KSk7XG4gICAgfVxuXG4gICAgLy8gaWYgZmxhdExpc3QgIT09IGZhbHNlIGFuZCBzb21lIGl0ZW1zIGhhdmUgY29sb25zLCBtYWtlIGdyb3VwZWQgbWFwXG4gICAgaWYgKGZsYXRMaXN0ICE9PSBmYWxzZSAmJiAodGl0bGVNYXAgfHwgW10pXG4gICAgICAuZmlsdGVyKHRpdGxlID0+ICgodGl0bGUgfHwge30pLm5hbWUgfHwgJycpLmluZGV4T2YoJzogJykpLmxlbmd0aCA+IDFcbiAgICApIHtcblxuICAgICAgLy8gU3BsaXQgbmFtZSBvbiBmaXJzdCBjb2xvbiB0byBjcmVhdGUgZ3JvdXBlZCBtYXAgKG5hbWUgLT4gZ3JvdXA6IG5hbWUpXG4gICAgICBjb25zdCBuZXdUaXRsZU1hcCA9IHRpdGxlTWFwLm1hcCh0aXRsZSA9PiB7XG4gICAgICAgIGNvbnN0IFtncm91cCwgbmFtZV0gPSB0aXRsZS5uYW1lLnNwbGl0KC86ICguKykvKTtcbiAgICAgICAgcmV0dXJuIGdyb3VwICYmIG5hbWUgPyB7IC4uLnRpdGxlLCBncm91cCwgbmFtZSB9IDogdGl0bGU7XG4gICAgICB9KTtcblxuICAgICAgLy8gSWYgZmxhdExpc3QgPT09IHRydWUgb3IgYXQgbGVhc3Qgb25lIGdyb3VwIGhhcyBtdWx0aXBsZSBpdGVtcywgdXNlIGdyb3VwZWQgbWFwXG4gICAgICBpZiAoZmxhdExpc3QgPT09IHRydWUgfHwgbmV3VGl0bGVNYXAuc29tZSgodGl0bGUsIGluZGV4KSA9PiBpbmRleCAmJlxuICAgICAgICBoYXNPd24odGl0bGUsICdncm91cCcpICYmIHRpdGxlLmdyb3VwID09PSBuZXdUaXRsZU1hcFtpbmRleCAtIDFdLmdyb3VwXG4gICAgICApKSB7XG4gICAgICAgIHRpdGxlTWFwID0gbmV3VGl0bGVNYXA7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB2YWxpZGF0ZU9ubHkgPyBmYWxzZSA6IHRpdGxlTWFwO1xufVxuXG4vKipcbiAqICdnZXRDb250cm9sVmFsaWRhdG9ycycgZnVuY3Rpb25cbiAqXG4gKiAvLyAgc2NoZW1hXG4gKiAvLyB7IHZhbGlkYXRvcnMgfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udHJvbFZhbGlkYXRvcnMoc2NoZW1hKSB7XG4gIGlmICghaXNPYmplY3Qoc2NoZW1hKSkgeyByZXR1cm4gbnVsbDsgfVxuICBjb25zdCB2YWxpZGF0b3JzOiBhbnkgPSB7IH07XG4gIGlmIChoYXNPd24oc2NoZW1hLCAndHlwZScpKSB7XG4gICAgc3dpdGNoIChzY2hlbWEudHlwZSkge1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgZm9yRWFjaChbJ3BhdHRlcm4nLCAnZm9ybWF0JywgJ21pbkxlbmd0aCcsICdtYXhMZW5ndGgnXSwgKHByb3ApID0+IHtcbiAgICAgICAgICBpZiAoaGFzT3duKHNjaGVtYSwgcHJvcCkpIHsgdmFsaWRhdG9yc1twcm9wXSA9IFtzY2hlbWFbcHJvcF1dOyB9XG4gICAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdudW1iZXInOiBjYXNlICdpbnRlZ2VyJzpcbiAgICAgICAgZm9yRWFjaChbJ01pbmltdW0nLCAnTWF4aW11bSddLCAodWNMaW1pdCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGVMaW1pdCA9ICdleGNsdXNpdmUnICsgdWNMaW1pdDtcbiAgICAgICAgICBjb25zdCBsaW1pdCA9IHVjTGltaXQudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICBpZiAoaGFzT3duKHNjaGVtYSwgbGltaXQpKSB7XG4gICAgICAgICAgICBjb25zdCBleGNsdXNpdmUgPSBoYXNPd24oc2NoZW1hLCBlTGltaXQpICYmIHNjaGVtYVtlTGltaXRdID09PSB0cnVlO1xuICAgICAgICAgICAgdmFsaWRhdG9yc1tsaW1pdF0gPSBbc2NoZW1hW2xpbWl0XSwgZXhjbHVzaXZlXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmb3JFYWNoKFsnbXVsdGlwbGVPZicsICd0eXBlJ10sIChwcm9wKSA9PiB7XG4gICAgICAgICAgaWYgKGhhc093bihzY2hlbWEsIHByb3ApKSB7IHZhbGlkYXRvcnNbcHJvcF0gPSBbc2NoZW1hW3Byb3BdXTsgfVxuICAgICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgZm9yRWFjaChbJ21pblByb3BlcnRpZXMnLCAnbWF4UHJvcGVydGllcycsICdkZXBlbmRlbmNpZXMnXSwgKHByb3ApID0+IHtcbiAgICAgICAgICBpZiAoaGFzT3duKHNjaGVtYSwgcHJvcCkpIHsgdmFsaWRhdG9yc1twcm9wXSA9IFtzY2hlbWFbcHJvcF1dOyB9XG4gICAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhcnJheSc6XG4gICAgICAgIGZvckVhY2goWydtaW5JdGVtcycsICdtYXhJdGVtcycsICd1bmlxdWVJdGVtcyddLCAocHJvcCkgPT4ge1xuICAgICAgICAgIGlmIChoYXNPd24oc2NoZW1hLCBwcm9wKSkgeyB2YWxpZGF0b3JzW3Byb3BdID0gW3NjaGVtYVtwcm9wXV07IH1cbiAgICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgaWYgKGhhc093bihzY2hlbWEsICdlbnVtJykpIHsgdmFsaWRhdG9ycy5lbnVtID0gW3NjaGVtYS5lbnVtXTsgfVxuICByZXR1cm4gdmFsaWRhdG9ycztcbn1cblxuLyoqXG4gKiAncmVzb2x2ZVNjaGVtYVJlZmVyZW5jZXMnIGZ1bmN0aW9uXG4gKlxuICogRmluZCBhbGwgJHJlZiBsaW5rcyBpbiBzY2hlbWEgYW5kIHNhdmUgbGlua3MgYW5kIHJlZmVyZW5jZWQgc2NoZW1hcyBpblxuICogc2NoZW1hUmVmTGlicmFyeSwgc2NoZW1hUmVjdXJzaXZlUmVmTWFwLCBhbmQgZGF0YVJlY3Vyc2l2ZVJlZk1hcFxuICpcbiAqIC8vICBzY2hlbWFcbiAqIC8vICBzY2hlbWFSZWZMaWJyYXJ5XG4gKiAvLyB7IE1hcDxzdHJpbmcsIHN0cmluZz4gfSBzY2hlbWFSZWN1cnNpdmVSZWZNYXBcbiAqIC8vIHsgTWFwPHN0cmluZywgc3RyaW5nPiB9IGRhdGFSZWN1cnNpdmVSZWZNYXBcbiAqIC8vIHsgTWFwPHN0cmluZywgbnVtYmVyPiB9IGFycmF5TWFwXG4gKiAvL1xuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVNjaGVtYVJlZmVyZW5jZXMoXG4gIHNjaGVtYSwgc2NoZW1hUmVmTGlicmFyeSwgc2NoZW1hUmVjdXJzaXZlUmVmTWFwLCBkYXRhUmVjdXJzaXZlUmVmTWFwLCBhcnJheU1hcFxuKSB7XG4gIGlmICghaXNPYmplY3Qoc2NoZW1hKSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ3Jlc29sdmVTY2hlbWFSZWZlcmVuY2VzIGVycm9yOiBzY2hlbWEgbXVzdCBiZSBhbiBvYmplY3QuJyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IHJlZkxpbmtzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGNvbnN0IHJlZk1hcFNldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBjb25zdCByZWZNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICBjb25zdCByZWN1cnNpdmVSZWZNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICBjb25zdCByZWZMaWJyYXJ5OiBhbnkgPSB7fTtcblxuICAvLyBTZWFyY2ggc2NoZW1hIGZvciBhbGwgJHJlZiBsaW5rcywgYW5kIGJ1aWxkIGZ1bGwgcmVmTGlicmFyeVxuICBKc29uUG9pbnRlci5mb3JFYWNoRGVlcChzY2hlbWEsIChzdWJTY2hlbWEsIHN1YlNjaGVtYVBvaW50ZXIpID0+IHtcbiAgICBpZiAoaGFzT3duKHN1YlNjaGVtYSwgJyRyZWYnKSAmJiBpc1N0cmluZyhzdWJTY2hlbWFbJyRyZWYnXSkpIHtcbiAgICAgIGNvbnN0IHJlZlBvaW50ZXIgPSBKc29uUG9pbnRlci5jb21waWxlKHN1YlNjaGVtYVsnJHJlZiddKTtcbiAgICAgIHJlZkxpbmtzLmFkZChyZWZQb2ludGVyKTtcbiAgICAgIHJlZk1hcFNldC5hZGQoc3ViU2NoZW1hUG9pbnRlciArICd+ficgKyByZWZQb2ludGVyKTtcbiAgICAgIHJlZk1hcC5zZXQoc3ViU2NoZW1hUG9pbnRlciwgcmVmUG9pbnRlcik7XG4gICAgfVxuICB9KTtcbiAgcmVmTGlua3MuZm9yRWFjaChyZWYgPT4gcmVmTGlicmFyeVtyZWZdID0gZ2V0U3ViU2NoZW1hKHNjaGVtYSwgcmVmKSk7XG5cbiAgLy8gRm9sbG93IGFsbCByZWYgbGlua3MgYW5kIHNhdmUgaW4gcmVmTWFwU2V0LFxuICAvLyB0byBmaW5kIGFueSBtdWx0aS1saW5rIHJlY3Vyc2l2ZSByZWZlcm5jZXNcbiAgbGV0IGNoZWNrUmVmTGlua3MgPSB0cnVlO1xuICB3aGlsZSAoY2hlY2tSZWZMaW5rcykge1xuICAgIGNoZWNrUmVmTGlua3MgPSBmYWxzZTtcbiAgICBBcnJheS5mcm9tKHJlZk1hcCkuZm9yRWFjaCgoW2Zyb21SZWYxLCB0b1JlZjFdKSA9PiBBcnJheS5mcm9tKHJlZk1hcClcbiAgICAgIC5maWx0ZXIoKFtmcm9tUmVmMiwgdG9SZWYyXSkgPT5cbiAgICAgICAgSnNvblBvaW50ZXIuaXNTdWJQb2ludGVyKHRvUmVmMSwgZnJvbVJlZjIsIHRydWUpICYmXG4gICAgICAgICFKc29uUG9pbnRlci5pc1N1YlBvaW50ZXIodG9SZWYyLCB0b1JlZjEsIHRydWUpICYmXG4gICAgICAgICFyZWZNYXBTZXQuaGFzKGZyb21SZWYxICsgZnJvbVJlZjIuc2xpY2UodG9SZWYxLmxlbmd0aCkgKyAnfn4nICsgdG9SZWYyKVxuICAgICAgKVxuICAgICAgLmZvckVhY2goKFtmcm9tUmVmMiwgdG9SZWYyXSkgPT4ge1xuICAgICAgICByZWZNYXBTZXQuYWRkKGZyb21SZWYxICsgZnJvbVJlZjIuc2xpY2UodG9SZWYxLmxlbmd0aCkgKyAnfn4nICsgdG9SZWYyKTtcbiAgICAgICAgY2hlY2tSZWZMaW5rcyA9IHRydWU7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICAvLyBCdWlsZCBmdWxsIHJlY3Vyc2l2ZVJlZk1hcFxuICAvLyBGaXJzdCBwYXNzIC0gc2F2ZSBhbGwgaW50ZXJuYWxseSByZWN1cnNpdmUgcmVmcyBmcm9tIHJlZk1hcFNldFxuICBBcnJheS5mcm9tKHJlZk1hcFNldClcbiAgICAubWFwKHJlZkxpbmsgPT4gcmVmTGluay5zcGxpdCgnfn4nKSlcbiAgICAuZmlsdGVyKChbZnJvbVJlZiwgdG9SZWZdKSA9PiBKc29uUG9pbnRlci5pc1N1YlBvaW50ZXIodG9SZWYsIGZyb21SZWYpKVxuICAgIC5mb3JFYWNoKChbZnJvbVJlZiwgdG9SZWZdKSA9PiByZWN1cnNpdmVSZWZNYXAuc2V0KGZyb21SZWYsIHRvUmVmKSk7XG4gIC8vIFNlY29uZCBwYXNzIC0gY3JlYXRlIHJlY3Vyc2l2ZSB2ZXJzaW9ucyBvZiBhbnkgb3RoZXIgcmVmcyB0aGF0IGxpbmsgdG8gcmVjdXJzaXZlIHJlZnNcbiAgQXJyYXkuZnJvbShyZWZNYXApXG4gICAgLmZpbHRlcigoW2Zyb21SZWYxLCB0b1JlZjFdKSA9PiBBcnJheS5mcm9tKHJlY3Vyc2l2ZVJlZk1hcC5rZXlzKCkpXG4gICAgICAuZXZlcnkoZnJvbVJlZjIgPT4gIUpzb25Qb2ludGVyLmlzU3ViUG9pbnRlcihmcm9tUmVmMSwgZnJvbVJlZjIsIHRydWUpKVxuICAgIClcbiAgICAuZm9yRWFjaCgoW2Zyb21SZWYxLCB0b1JlZjFdKSA9PiBBcnJheS5mcm9tKHJlY3Vyc2l2ZVJlZk1hcClcbiAgICAgIC5maWx0ZXIoKFtmcm9tUmVmMiwgdG9SZWYyXSkgPT5cbiAgICAgICAgIXJlY3Vyc2l2ZVJlZk1hcC5oYXMoZnJvbVJlZjEgKyBmcm9tUmVmMi5zbGljZSh0b1JlZjEubGVuZ3RoKSkgJiZcbiAgICAgICAgSnNvblBvaW50ZXIuaXNTdWJQb2ludGVyKHRvUmVmMSwgZnJvbVJlZjIsIHRydWUpICYmXG4gICAgICAgICFKc29uUG9pbnRlci5pc1N1YlBvaW50ZXIodG9SZWYxLCBmcm9tUmVmMSwgdHJ1ZSlcbiAgICAgIClcbiAgICAgIC5mb3JFYWNoKChbZnJvbVJlZjIsIHRvUmVmMl0pID0+IHJlY3Vyc2l2ZVJlZk1hcC5zZXQoXG4gICAgICAgIGZyb21SZWYxICsgZnJvbVJlZjIuc2xpY2UodG9SZWYxLmxlbmd0aCksXG4gICAgICAgIGZyb21SZWYxICsgdG9SZWYyLnNsaWNlKHRvUmVmMS5sZW5ndGgpXG4gICAgICApKVxuICAgICk7XG5cbiAgLy8gQ3JlYXRlIGNvbXBpbGVkIHNjaGVtYSBieSByZXBsYWNpbmcgYWxsIG5vbi1yZWN1cnNpdmUgJHJlZiBsaW5rcyB3aXRoXG4gIC8vIHRoaWVpciBsaW5rZWQgc2NoZW1hcyBhbmQsIHdoZXJlIHBvc3NpYmxlLCBjb21iaW5pbmcgc2NoZW1hcyBpbiBhbGxPZiBhcnJheXMuXG4gIGxldCBjb21waWxlZFNjaGVtYSA9IHsgLi4uc2NoZW1hIH07XG4gIGRlbGV0ZSBjb21waWxlZFNjaGVtYS5kZWZpbml0aW9ucztcbiAgY29tcGlsZWRTY2hlbWEgPVxuICAgIGdldFN1YlNjaGVtYShjb21waWxlZFNjaGVtYSwgJycsIHJlZkxpYnJhcnksIHJlY3Vyc2l2ZVJlZk1hcCk7XG5cbiAgLy8gTWFrZSBzdXJlIGFsbCByZW1haW5pbmcgc2NoZW1hICRyZWZzIGFyZSByZWN1cnNpdmUsIGFuZCBidWlsZCBmaW5hbFxuICAvLyBzY2hlbWFSZWZMaWJyYXJ5LCBzY2hlbWFSZWN1cnNpdmVSZWZNYXAsIGRhdGFSZWN1cnNpdmVSZWZNYXAsICYgYXJyYXlNYXBcbiAgSnNvblBvaW50ZXIuZm9yRWFjaERlZXAoY29tcGlsZWRTY2hlbWEsIChzdWJTY2hlbWEsIHN1YlNjaGVtYVBvaW50ZXIpID0+IHtcbiAgICBpZiAoaXNTdHJpbmcoc3ViU2NoZW1hWyckcmVmJ10pKSB7XG4gICAgICBsZXQgcmVmUG9pbnRlciA9IEpzb25Qb2ludGVyLmNvbXBpbGUoc3ViU2NoZW1hWyckcmVmJ10pO1xuICAgICAgaWYgKCFKc29uUG9pbnRlci5pc1N1YlBvaW50ZXIocmVmUG9pbnRlciwgc3ViU2NoZW1hUG9pbnRlciwgdHJ1ZSkpIHtcbiAgICAgICAgcmVmUG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoc3ViU2NoZW1hUG9pbnRlciwgcmVjdXJzaXZlUmVmTWFwKTtcbiAgICAgICAgSnNvblBvaW50ZXIuc2V0KGNvbXBpbGVkU2NoZW1hLCBzdWJTY2hlbWFQb2ludGVyLCB7ICRyZWY6IGAjJHtyZWZQb2ludGVyfWAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoIWhhc093bihzY2hlbWFSZWZMaWJyYXJ5LCAncmVmUG9pbnRlcicpKSB7XG4gICAgICAgIHNjaGVtYVJlZkxpYnJhcnlbcmVmUG9pbnRlcl0gPSAhcmVmUG9pbnRlci5sZW5ndGggPyBjb21waWxlZFNjaGVtYSA6XG4gICAgICAgICAgZ2V0U3ViU2NoZW1hKGNvbXBpbGVkU2NoZW1hLCByZWZQb2ludGVyLCBzY2hlbWFSZWZMaWJyYXJ5LCByZWN1cnNpdmVSZWZNYXApO1xuICAgICAgfVxuICAgICAgaWYgKCFzY2hlbWFSZWN1cnNpdmVSZWZNYXAuaGFzKHN1YlNjaGVtYVBvaW50ZXIpKSB7XG4gICAgICAgIHNjaGVtYVJlY3Vyc2l2ZVJlZk1hcC5zZXQoc3ViU2NoZW1hUG9pbnRlciwgcmVmUG9pbnRlcik7XG4gICAgICB9XG4gICAgICBjb25zdCBmcm9tRGF0YVJlZiA9IEpzb25Qb2ludGVyLnRvRGF0YVBvaW50ZXIoc3ViU2NoZW1hUG9pbnRlciwgY29tcGlsZWRTY2hlbWEpO1xuICAgICAgaWYgKCFkYXRhUmVjdXJzaXZlUmVmTWFwLmhhcyhmcm9tRGF0YVJlZikpIHtcbiAgICAgICAgY29uc3QgdG9EYXRhUmVmID0gSnNvblBvaW50ZXIudG9EYXRhUG9pbnRlcihyZWZQb2ludGVyLCBjb21waWxlZFNjaGVtYSk7XG4gICAgICAgIGRhdGFSZWN1cnNpdmVSZWZNYXAuc2V0KGZyb21EYXRhUmVmLCB0b0RhdGFSZWYpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc3ViU2NoZW1hLnR5cGUgPT09ICdhcnJheScgJiZcbiAgICAgIChoYXNPd24oc3ViU2NoZW1hLCAnaXRlbXMnKSB8fCBoYXNPd24oc3ViU2NoZW1hLCAnYWRkaXRpb25hbEl0ZW1zJykpXG4gICAgKSB7XG4gICAgICBjb25zdCBkYXRhUG9pbnRlciA9IEpzb25Qb2ludGVyLnRvRGF0YVBvaW50ZXIoc3ViU2NoZW1hUG9pbnRlciwgY29tcGlsZWRTY2hlbWEpO1xuICAgICAgaWYgKCFhcnJheU1hcC5oYXMoZGF0YVBvaW50ZXIpKSB7XG4gICAgICAgIGNvbnN0IHR1cGxlSXRlbXMgPSBpc0FycmF5KHN1YlNjaGVtYS5pdGVtcykgPyBzdWJTY2hlbWEuaXRlbXMubGVuZ3RoIDogMDtcbiAgICAgICAgYXJyYXlNYXAuc2V0KGRhdGFQb2ludGVyLCB0dXBsZUl0ZW1zKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHRydWUpO1xuICByZXR1cm4gY29tcGlsZWRTY2hlbWE7XG59XG5cbi8qKlxuICogJ2dldFN1YlNjaGVtYScgZnVuY3Rpb25cbiAqXG4gKiAvLyAgIHNjaGVtYVxuICogLy8gIHsgUG9pbnRlciB9IHBvaW50ZXJcbiAqIC8vICB7IG9iamVjdCB9IHNjaGVtYVJlZkxpYnJhcnlcbiAqIC8vICB7IE1hcDxzdHJpbmcsIHN0cmluZz4gfSBzY2hlbWFSZWN1cnNpdmVSZWZNYXBcbiAqIC8vICB7IHN0cmluZ1tdID0gW10gfSB1c2VkUG9pbnRlcnNcbiAqIC8vXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdWJTY2hlbWEoXG4gIHNjaGVtYSwgcG9pbnRlciwgc2NoZW1hUmVmTGlicmFyeSA9IG51bGwsXG4gIHNjaGVtYVJlY3Vyc2l2ZVJlZk1hcDogTWFwPHN0cmluZywgc3RyaW5nPiA9IG51bGwsIHVzZWRQb2ludGVyczogc3RyaW5nW10gPSBbXVxuKSB7XG4gIGlmICghc2NoZW1hUmVmTGlicmFyeSB8fCAhc2NoZW1hUmVjdXJzaXZlUmVmTWFwKSB7XG4gICAgcmV0dXJuIEpzb25Qb2ludGVyLmdldENvcHkoc2NoZW1hLCBwb2ludGVyKTtcbiAgfVxuICBpZiAodHlwZW9mIHBvaW50ZXIgIT09ICdzdHJpbmcnKSB7IHBvaW50ZXIgPSBKc29uUG9pbnRlci5jb21waWxlKHBvaW50ZXIpOyB9XG4gIHVzZWRQb2ludGVycyA9IFsgLi4udXNlZFBvaW50ZXJzLCBwb2ludGVyIF07XG4gIGxldCBuZXdTY2hlbWE6IGFueSA9IG51bGw7XG4gIGlmIChwb2ludGVyID09PSAnJykge1xuICAgIG5ld1NjaGVtYSA9IGNsb25lRGVlcChzY2hlbWEpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHNob3J0UG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMocG9pbnRlciwgc2NoZW1hUmVjdXJzaXZlUmVmTWFwKTtcbiAgICBpZiAoc2hvcnRQb2ludGVyICE9PSBwb2ludGVyKSB7IHVzZWRQb2ludGVycyA9IFsgLi4udXNlZFBvaW50ZXJzLCBzaG9ydFBvaW50ZXIgXTsgfVxuICAgIG5ld1NjaGVtYSA9IEpzb25Qb2ludGVyLmdldEZpcnN0Q29weShbXG4gICAgICBbc2NoZW1hUmVmTGlicmFyeSwgW3Nob3J0UG9pbnRlcl1dLFxuICAgICAgW3NjaGVtYSwgcG9pbnRlcl0sXG4gICAgICBbc2NoZW1hLCBzaG9ydFBvaW50ZXJdXG4gICAgXSk7XG4gIH1cbiAgcmV0dXJuIEpzb25Qb2ludGVyLmZvckVhY2hEZWVwQ29weShuZXdTY2hlbWEsIChzdWJTY2hlbWEsIHN1YlBvaW50ZXIpID0+IHtcbiAgICBpZiAoaXNPYmplY3Qoc3ViU2NoZW1hKSkge1xuXG4gICAgICAvLyBSZXBsYWNlIG5vbi1yZWN1cnNpdmUgJHJlZiBsaW5rcyB3aXRoIHJlZmVyZW5jZWQgc2NoZW1hc1xuICAgICAgaWYgKGlzU3RyaW5nKHN1YlNjaGVtYS4kcmVmKSkge1xuICAgICAgICBjb25zdCByZWZQb2ludGVyID0gSnNvblBvaW50ZXIuY29tcGlsZShzdWJTY2hlbWEuJHJlZik7XG4gICAgICAgIGlmIChyZWZQb2ludGVyLmxlbmd0aCAmJiB1c2VkUG9pbnRlcnMuZXZlcnkocHRyID0+XG4gICAgICAgICAgIUpzb25Qb2ludGVyLmlzU3ViUG9pbnRlcihyZWZQb2ludGVyLCBwdHIsIHRydWUpXG4gICAgICAgICkpIHtcbiAgICAgICAgICBjb25zdCByZWZTY2hlbWEgPSBnZXRTdWJTY2hlbWEoXG4gICAgICAgICAgICBzY2hlbWEsIHJlZlBvaW50ZXIsIHNjaGVtYVJlZkxpYnJhcnksIHNjaGVtYVJlY3Vyc2l2ZVJlZk1hcCwgdXNlZFBvaW50ZXJzXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoc3ViU2NoZW1hKS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiByZWZTY2hlbWE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGV4dHJhS2V5cyA9IHsgLi4uc3ViU2NoZW1hIH07XG4gICAgICAgICAgICBkZWxldGUgZXh0cmFLZXlzLiRyZWY7XG4gICAgICAgICAgICByZXR1cm4gbWVyZ2VTY2hlbWFzKHJlZlNjaGVtYSwgZXh0cmFLZXlzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVE9ETzogQ29udmVydCBzY2hlbWFzIHdpdGggJ3R5cGUnIGFycmF5cyB0byAnb25lT2YnXG5cbiAgICAgIC8vIENvbWJpbmUgYWxsT2Ygc3ViU2NoZW1hc1xuICAgICAgaWYgKGlzQXJyYXkoc3ViU2NoZW1hLmFsbE9mKSkgeyByZXR1cm4gY29tYmluZUFsbE9mKHN1YlNjaGVtYSk7IH1cblxuICAgICAgLy8gRml4IGluY29ycmVjdGx5IHBsYWNlZCBhcnJheSBvYmplY3QgcmVxdWlyZWQgbGlzdHNcbiAgICAgIGlmIChzdWJTY2hlbWEudHlwZSA9PT0gJ2FycmF5JyAmJiBpc0FycmF5KHN1YlNjaGVtYS5yZXF1aXJlZCkpIHtcbiAgICAgICAgcmV0dXJuIGZpeFJlcXVpcmVkQXJyYXlQcm9wZXJ0aWVzKHN1YlNjaGVtYSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdWJTY2hlbWE7XG4gIH0sIHRydWUsIDxzdHJpbmc+cG9pbnRlcik7XG59XG5cbi8qKlxuICogJ2NvbWJpbmVBbGxPZicgZnVuY3Rpb25cbiAqXG4gKiBBdHRlbXB0IHRvIGNvbnZlcnQgYW4gYWxsT2Ygc2NoZW1hIG9iamVjdCBpbnRvXG4gKiBhIG5vbi1hbGxPZiBzY2hlbWEgb2JqZWN0IHdpdGggZXF1aXZhbGVudCBydWxlcy5cbiAqXG4gKiAvLyAgIHNjaGVtYSAtIGFsbE9mIHNjaGVtYSBvYmplY3RcbiAqIC8vICAtIGNvbnZlcnRlZCBzY2hlbWEgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lQWxsT2Yoc2NoZW1hKSB7XG4gIGlmICghaXNPYmplY3Qoc2NoZW1hKSB8fCAhaXNBcnJheShzY2hlbWEuYWxsT2YpKSB7IHJldHVybiBzY2hlbWE7IH1cbiAgbGV0IG1lcmdlZFNjaGVtYSA9IG1lcmdlU2NoZW1hcyguLi5zY2hlbWEuYWxsT2YpO1xuICBpZiAoT2JqZWN0LmtleXMoc2NoZW1hKS5sZW5ndGggPiAxKSB7XG4gICAgY29uc3QgZXh0cmFLZXlzID0geyAuLi5zY2hlbWEgfTtcbiAgICBkZWxldGUgZXh0cmFLZXlzLmFsbE9mO1xuICAgIG1lcmdlZFNjaGVtYSA9IG1lcmdlU2NoZW1hcyhtZXJnZWRTY2hlbWEsIGV4dHJhS2V5cyk7XG4gIH1cbiAgcmV0dXJuIG1lcmdlZFNjaGVtYTtcbn1cblxuLyoqXG4gKiAnZml4UmVxdWlyZWRBcnJheVByb3BlcnRpZXMnIGZ1bmN0aW9uXG4gKlxuICogRml4ZXMgYW4gaW5jb3JyZWN0bHkgcGxhY2VkIHJlcXVpcmVkIGxpc3QgaW5zaWRlIGFuIGFycmF5IHNjaGVtYSwgYnkgbW92aW5nXG4gKiBpdCBpbnRvIGl0ZW1zLnByb3BlcnRpZXMgb3IgYWRkaXRpb25hbEl0ZW1zLnByb3BlcnRpZXMsIHdoZXJlIGl0IGJlbG9uZ3MuXG4gKlxuICogLy8gICBzY2hlbWEgLSBhbGxPZiBzY2hlbWEgb2JqZWN0XG4gKiAvLyAgLSBjb252ZXJ0ZWQgc2NoZW1hIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gZml4UmVxdWlyZWRBcnJheVByb3BlcnRpZXMoc2NoZW1hKSB7XG4gIGlmIChzY2hlbWEudHlwZSA9PT0gJ2FycmF5JyAmJiBpc0FycmF5KHNjaGVtYS5yZXF1aXJlZCkpIHtcbiAgICBjb25zdCBpdGVtc09iamVjdCA9IGhhc093bihzY2hlbWEuaXRlbXMsICdwcm9wZXJ0aWVzJykgPyAnaXRlbXMnIDpcbiAgICAgIGhhc093bihzY2hlbWEuYWRkaXRpb25hbEl0ZW1zLCAncHJvcGVydGllcycpID8gJ2FkZGl0aW9uYWxJdGVtcycgOiBudWxsO1xuICAgIGlmIChpdGVtc09iamVjdCAmJiAhaGFzT3duKHNjaGVtYVtpdGVtc09iamVjdF0sICdyZXF1aXJlZCcpICYmIChcbiAgICAgIGhhc093bihzY2hlbWFbaXRlbXNPYmplY3RdLCAnYWRkaXRpb25hbFByb3BlcnRpZXMnKSB8fFxuICAgICAgc2NoZW1hLnJlcXVpcmVkLmV2ZXJ5KGtleSA9PiBoYXNPd24oc2NoZW1hW2l0ZW1zT2JqZWN0XS5wcm9wZXJ0aWVzLCBrZXkpKVxuICAgICkpIHtcbiAgICAgIHNjaGVtYSA9IGNsb25lRGVlcChzY2hlbWEpO1xuICAgICAgc2NoZW1hW2l0ZW1zT2JqZWN0XS5yZXF1aXJlZCA9IHNjaGVtYS5yZXF1aXJlZDtcbiAgICAgIGRlbGV0ZSBzY2hlbWEucmVxdWlyZWQ7XG4gICAgfVxuICB9XG4gIHJldHVybiBzY2hlbWE7XG59XG4iXX0=