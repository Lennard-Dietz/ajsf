/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import cloneDeep from 'lodash/cloneDeep';
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
export function OptionObject() { }
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
export function convertSchemaToDraft6(schema, options = {}) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udmVydC1zY2hlbWEtdG8tZHJhZnQ2LmZ1bmN0aW9uLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFqc2YvY29yZS8iLCJzb3VyY2VzIjpbImxpYi9zaGFyZWQvY29udmVydC1zY2hlbWEtdG8tZHJhZnQ2LmZ1bmN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLFNBQVMsTUFBTSxrQkFBa0IsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0J6QyxrQ0FBb0U7OztJQUFwQywrQkFBa0I7O0lBQUMsNkJBQWU7Ozs7Ozs7QUFDbEUsTUFBTSxVQUFVLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxVQUF3QixFQUFFOztRQUNsRSxLQUFLLEdBQVcsT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJOztRQUNyQyxPQUFPLEdBQVksT0FBTyxDQUFDLE9BQU8sSUFBSSxLQUFLO0lBRS9DLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO1FBQUUsT0FBTyxNQUFNLENBQUM7S0FBRTtJQUNsRCxJQUFJLE9BQU8sTUFBTSxDQUFDLEdBQUcsS0FBSyxVQUFVLEVBQUU7UUFDcEMsT0FBTyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUc7Ozs7WUFBQyxTQUFTLENBQUMsRUFBRSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztLQUMzRjs7UUFDRyxTQUFTLHFCQUFRLE1BQU0sQ0FBRTs7VUFDdkIsV0FBVyxHQUFHLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDO0lBRXpGLElBQUksT0FBTyxTQUFTLENBQUMsT0FBTyxLQUFLLFFBQVE7UUFDdkMsbURBQW1ELENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFDM0U7UUFDQSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FB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akQsT0FBTzs7OztJQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ2IsSUFDRSxDQUFDLGFBQWEsRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLG1CQUFtQixDQUFDO2FBQy9ELFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxPQUFPLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssVUFBVSxFQUM1RDs7a0JBQ00sTUFBTSxHQUFHLEVBQUU7WUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPOzs7O1lBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUMxRCxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFDbEUsQ0FBQztZQUNGLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7U0FDekI7YUFBTSxJQUNMLENBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLHNCQUFzQjtZQUNqRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQ2pEO1lBQ0EsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQzVFO2FBQU07WUFDTCxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQzVDO0lBQ0gsQ0FBQyxFQUFDLENBQUM7SUFFTCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsb25lRGVlcCBmcm9tICdsb2Rhc2gvY2xvbmVEZWVwJztcblxuLyoqXG4gKiAnY29udmVydFNjaGVtYVRvRHJhZnQ2JyBmdW5jdGlvblxuICpcbiAqIENvbnZlcnRzIGEgSlNPTiBTY2hlbWEgZnJvbSBkcmFmdCAxIHRocm91Z2ggNCBmb3JtYXQgdG8gZHJhZnQgNiBmb3JtYXRcbiAqXG4gKiBJbnNwaXJlZCBieSBvbiBnZXJhaW50bHVmZidzIEpTT04gU2NoZW1hIDMgdG8gNCBjb21wYXRpYmlsaXR5IGZ1bmN0aW9uOlxuICogICBodHRwczovL2dpdGh1Yi5jb20vZ2VyYWludGx1ZmYvanNvbi1zY2hlbWEtY29tcGF0aWJpbGl0eVxuICogQWxzbyB1c2VzIHN1Z2dlc3Rpb25zIGZyb20gQUpWJ3MgSlNPTiBTY2hlbWEgNCB0byA2IG1pZ3JhdGlvbiBndWlkZTpcbiAqICAgaHR0cHM6Ly9naXRodWIuY29tL2Vwb2JlcmV6a2luL2Fqdi9yZWxlYXNlcy90YWcvNS4wLjBcbiAqIEFuZCBhZGRpdGlvbmFsIGRldGFpbHMgZnJvbSB0aGUgb2ZmaWNpYWwgSlNPTiBTY2hlbWEgZG9jdW1lbnRhdGlvbjpcbiAqICAgaHR0cDovL2pzb24tc2NoZW1hLm9yZ1xuICpcbiAqIC8vICB7IG9iamVjdCB9IG9yaWdpbmFsU2NoZW1hIC0gSlNPTiBzY2hlbWEgKGRyYWZ0IDEsIDIsIDMsIDQsIG9yIDYpXG4gKiAvLyAgeyBPcHRpb25PYmplY3QgPSB7fSB9IG9wdGlvbnMgLSBvcHRpb25zOiBwYXJlbnQgc2NoZW1hIGNoYW5nZWQ/LCBzY2hlbWEgZHJhZnQgbnVtYmVyP1xuICogLy8geyBvYmplY3QgfSAtIEpTT04gc2NoZW1hIChkcmFmdCA2KVxuICovXG5leHBvcnQgaW50ZXJmYWNlIE9wdGlvbk9iamVjdCB7IGNoYW5nZWQ/OiBib29sZWFuOyBkcmFmdD86IG51bWJlcjsgfVxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRTY2hlbWFUb0RyYWZ0NihzY2hlbWEsIG9wdGlvbnM6IE9wdGlvbk9iamVjdCA9IHt9KSB7XG4gIGxldCBkcmFmdDogbnVtYmVyID0gb3B0aW9ucy5kcmFmdCB8fCBudWxsO1xuICBsZXQgY2hhbmdlZDogYm9vbGVhbiA9IG9wdGlvbnMuY2hhbmdlZCB8fCBmYWxzZTtcblxuICBpZiAodHlwZW9mIHNjaGVtYSAhPT0gJ29iamVjdCcpIHsgcmV0dXJuIHNjaGVtYTsgfVxuICBpZiAodHlwZW9mIHNjaGVtYS5tYXAgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gWy4uLnNjaGVtYS5tYXAoc3ViU2NoZW1hID0+IGNvbnZlcnRTY2hlbWFUb0RyYWZ0NihzdWJTY2hlbWEsIHsgY2hhbmdlZCwgZHJhZnQgfSkpXTtcbiAgfVxuICBsZXQgbmV3U2NoZW1hID0geyAuLi5zY2hlbWEgfTtcbiAgY29uc3Qgc2ltcGxlVHlwZXMgPSBbJ2FycmF5JywgJ2Jvb2xlYW4nLCAnaW50ZWdlcicsICdudWxsJywgJ251bWJlcicsICdvYmplY3QnLCAnc3RyaW5nJ107XG5cbiAgaWYgKHR5cGVvZiBuZXdTY2hlbWEuJHNjaGVtYSA9PT0gJ3N0cmluZycgJiZcbiAgICAvaHR0cFxcOlxcL1xcL2pzb25cXC1zY2hlbWFcXC5vcmdcXC9kcmFmdFxcLTBcXGRcXC9zY2hlbWFcXCMvLnRlc3QobmV3U2NoZW1hLiRzY2hlbWEpXG4gICkge1xuICAgIGRyYWZ0ID0gbmV3U2NoZW1hLiRzY2hlbWFbMzBdO1xuICB9XG5cbiAgLy8gQ29udmVydCB2MS12MiAnY29udGVudEVuY29kaW5nJyB0byAnbWVkaWEuYmluYXJ5RW5jb2RpbmcnXG4gIC8vIE5vdGU6IFRoaXMgaXMgb25seSB1c2VkIGluIEpTT04gaHlwZXItc2NoZW1hIChub3QgcmVndWxhciBKU09OIHNjaGVtYSlcbiAgaWYgKG5ld1NjaGVtYS5jb250ZW50RW5jb2RpbmcpIHtcbiAgICBuZXdTY2hlbWEubWVkaWEgPSB7IGJpbmFyeUVuY29kaW5nOiBuZXdTY2hlbWEuY29udGVudEVuY29kaW5nIH07XG4gICAgZGVsZXRlIG5ld1NjaGVtYS5jb250ZW50RW5jb2Rpbmc7XG4gICAgY2hhbmdlZCA9IHRydWU7XG4gIH1cblxuICAvLyBDb252ZXJ0IHYxLXYzICdleHRlbmRzJyB0byAnYWxsT2YnXG4gIGlmICh0eXBlb2YgbmV3U2NoZW1hLmV4dGVuZHMgPT09ICdvYmplY3QnKSB7XG4gICAgbmV3U2NoZW1hLmFsbE9mID0gdHlwZW9mIG5ld1NjaGVtYS5leHRlbmRzLm1hcCA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgICBuZXdTY2hlbWEuZXh0ZW5kcy5tYXAoc3ViU2NoZW1hID0+IGNvbnZlcnRTY2hlbWFUb0RyYWZ0NihzdWJTY2hlbWEsIHsgY2hhbmdlZCwgZHJhZnQgfSkpIDpcbiAgICAgIFtjb252ZXJ0U2NoZW1hVG9EcmFmdDYobmV3U2NoZW1hLmV4dGVuZHMsIHsgY2hhbmdlZCwgZHJhZnQgfSldO1xuICAgIGRlbGV0ZSBuZXdTY2hlbWEuZXh0ZW5kcztcbiAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgfVxuXG4gIC8vIENvbnZlcnQgdjEtdjMgJ2Rpc2FsbG93JyB0byAnbm90J1xuICBpZiAobmV3U2NoZW1hLmRpc2FsbG93KSB7XG4gICAgaWYgKHR5cGVvZiBuZXdTY2hlbWEuZGlzYWxsb3cgPT09ICdzdHJpbmcnKSB7XG4gICAgICBuZXdTY2hlbWEubm90ID0geyB0eXBlOiBuZXdTY2hlbWEuZGlzYWxsb3cgfTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBuZXdTY2hlbWEuZGlzYWxsb3cubWFwID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBuZXdTY2hlbWEubm90ID0ge1xuICAgICAgICBhbnlPZjogbmV3U2NoZW1hLmRpc2FsbG93XG4gICAgICAgICAgLm1hcCh0eXBlID0+IHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyA/IHR5cGUgOiB7IHR5cGUgfSlcbiAgICAgIH07XG4gICAgfVxuICAgIGRlbGV0ZSBuZXdTY2hlbWEuZGlzYWxsb3c7XG4gICAgY2hhbmdlZCA9IHRydWU7XG4gIH1cblxuICAvLyBDb252ZXJ0IHYzIHN0cmluZyAnZGVwZW5kZW5jaWVzJyBwcm9wZXJ0aWVzIHRvIGFycmF5c1xuICBpZiAodHlwZW9mIG5ld1NjaGVtYS5kZXBlbmRlbmNpZXMgPT09ICdvYmplY3QnICYmXG4gICAgT2JqZWN0LmtleXMobmV3U2NoZW1hLmRlcGVuZGVuY2llcylcbiAgICAgIC5zb21lKGtleSA9PiB0eXBlb2YgbmV3U2NoZW1hLmRlcGVuZGVuY2llc1trZXldID09PSAnc3RyaW5nJylcbiAgKSB7XG4gICAgbmV3U2NoZW1hLmRlcGVuZGVuY2llcyA9IHsgLi4ubmV3U2NoZW1hLmRlcGVuZGVuY2llcyB9O1xuICAgIE9iamVjdC5rZXlzKG5ld1NjaGVtYS5kZXBlbmRlbmNpZXMpXG4gICAgICAuZmlsdGVyKGtleSA9PiB0eXBlb2YgbmV3U2NoZW1hLmRlcGVuZGVuY2llc1trZXldID09PSAnc3RyaW5nJylcbiAgICAgIC5mb3JFYWNoKGtleSA9PiBuZXdTY2hlbWEuZGVwZW5kZW5jaWVzW2tleV0gPSBbbmV3U2NoZW1hLmRlcGVuZGVuY2llc1trZXldXSk7XG4gICAgY2hhbmdlZCA9IHRydWU7XG4gIH1cblxuICAvLyBDb252ZXJ0IHYxICdtYXhEZWNpbWFsJyB0byAnbXVsdGlwbGVPZidcbiAgaWYgKHR5cGVvZiBuZXdTY2hlbWEubWF4RGVjaW1hbCA9PT0gJ251bWJlcicpIHtcbiAgICBuZXdTY2hlbWEubXVsdGlwbGVPZiA9IDEgLyBNYXRoLnBvdygxMCwgbmV3U2NoZW1hLm1heERlY2ltYWwpO1xuICAgIGRlbGV0ZSBuZXdTY2hlbWEuZGl2aXNpYmxlQnk7XG4gICAgY2hhbmdlZCA9IHRydWU7XG4gICAgaWYgKCFkcmFmdCB8fCBkcmFmdCA9PT0gMikgeyBkcmFmdCA9IDE7IH1cbiAgfVxuXG4gIC8vIENvbnZlcnQgdjItdjMgJ2RpdmlzaWJsZUJ5JyB0byAnbXVsdGlwbGVPZidcbiAgaWYgKHR5cGVvZiBuZXdTY2hlbWEuZGl2aXNpYmxlQnkgPT09ICdudW1iZXInKSB7XG4gICAgbmV3U2NoZW1hLm11bHRpcGxlT2YgPSBuZXdTY2hlbWEuZGl2aXNpYmxlQnk7XG4gICAgZGVsZXRlIG5ld1NjaGVtYS5kaXZpc2libGVCeTtcbiAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgfVxuXG4gIC8vIENvbnZlcnQgdjEtdjIgYm9vbGVhbiAnbWluaW11bUNhbkVxdWFsJyB0byAnZXhjbHVzaXZlTWluaW11bSdcbiAgaWYgKHR5cGVvZiBuZXdTY2hlbWEubWluaW11bSA9PT0gJ251bWJlcicgJiYgbmV3U2NoZW1hLm1pbmltdW1DYW5FcXVhbCA9PT0gZmFsc2UpIHtcbiAgICBuZXdTY2hlbWEuZXhjbHVzaXZlTWluaW11bSA9IG5ld1NjaGVtYS5taW5pbXVtO1xuICAgIGRlbGV0ZSBuZXdTY2hlbWEubWluaW11bTtcbiAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICBpZiAoIWRyYWZ0KSB7IGRyYWZ0ID0gMjsgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiBuZXdTY2hlbWEubWluaW11bUNhbkVxdWFsID09PSAnYm9vbGVhbicpIHtcbiAgICBkZWxldGUgbmV3U2NoZW1hLm1pbmltdW1DYW5FcXVhbDtcbiAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICBpZiAoIWRyYWZ0KSB7IGRyYWZ0ID0gMjsgfVxuICB9XG5cbiAgLy8gQ29udmVydCB2My12NCBib29sZWFuICdleGNsdXNpdmVNaW5pbXVtJyB0byBudW1lcmljXG4gIGlmICh0eXBlb2YgbmV3U2NoZW1hLm1pbmltdW0gPT09ICdudW1iZXInICYmIG5ld1NjaGVtYS5leGNsdXNpdmVNaW5pbXVtID09PSB0cnVlKSB7XG4gICAgbmV3U2NoZW1hLmV4Y2x1c2l2ZU1pbmltdW0gPSBuZXdTY2hlbWEubWluaW11bTtcbiAgICBkZWxldGUgbmV3U2NoZW1hLm1pbmltdW07XG4gICAgY2hhbmdlZCA9IHRydWU7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG5ld1NjaGVtYS5leGNsdXNpdmVNaW5pbXVtID09PSAnYm9vbGVhbicpIHtcbiAgICBkZWxldGUgbmV3U2NoZW1hLmV4Y2x1c2l2ZU1pbmltdW07XG4gICAgY2hhbmdlZCA9IHRydWU7XG4gIH1cblxuICAvLyBDb252ZXJ0IHYxLXYyIGJvb2xlYW4gJ21heGltdW1DYW5FcXVhbCcgdG8gJ2V4Y2x1c2l2ZU1heGltdW0nXG4gIGlmICh0eXBlb2YgbmV3U2NoZW1hLm1heGltdW0gPT09ICdudW1iZXInICYmIG5ld1NjaGVtYS5tYXhpbXVtQ2FuRXF1YWwgPT09IGZhbHNlKSB7XG4gICAgbmV3U2NoZW1hLmV4Y2x1c2l2ZU1heGltdW0gPSBuZXdTY2hlbWEubWF4aW11bTtcbiAgICBkZWxldGUgbmV3U2NoZW1hLm1heGltdW07XG4gICAgY2hhbmdlZCA9IHRydWU7XG4gICAgaWYgKCFkcmFmdCkgeyBkcmFmdCA9IDI7IH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgbmV3U2NoZW1hLm1heGltdW1DYW5FcXVhbCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgZGVsZXRlIG5ld1NjaGVtYS5tYXhpbXVtQ2FuRXF1YWw7XG4gICAgY2hhbmdlZCA9IHRydWU7XG4gICAgaWYgKCFkcmFmdCkgeyBkcmFmdCA9IDI7IH1cbiAgfVxuXG4gIC8vIENvbnZlcnQgdjMtdjQgYm9vbGVhbiAnZXhjbHVzaXZlTWF4aW11bScgdG8gbnVtZXJpY1xuICBpZiAodHlwZW9mIG5ld1NjaGVtYS5tYXhpbXVtID09PSAnbnVtYmVyJyAmJiBuZXdTY2hlbWEuZXhjbHVzaXZlTWF4aW11bSA9PT0gdHJ1ZSkge1xuICAgIG5ld1NjaGVtYS5leGNsdXNpdmVNYXhpbXVtID0gbmV3U2NoZW1hLm1heGltdW07XG4gICAgZGVsZXRlIG5ld1NjaGVtYS5tYXhpbXVtO1xuICAgIGNoYW5nZWQgPSB0cnVlO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBuZXdTY2hlbWEuZXhjbHVzaXZlTWF4aW11bSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgZGVsZXRlIG5ld1NjaGVtYS5leGNsdXNpdmVNYXhpbXVtO1xuICAgIGNoYW5nZWQgPSB0cnVlO1xuICB9XG5cbiAgLy8gU2VhcmNoIG9iamVjdCAncHJvcGVydGllcycgZm9yICdvcHRpb25hbCcsICdyZXF1aXJlZCcsIGFuZCAncmVxdWlyZXMnIGl0ZW1zLFxuICAvLyBhbmQgY29udmVydCB0aGVtIGludG8gb2JqZWN0ICdyZXF1aXJlZCcgYXJyYXlzIGFuZCAnZGVwZW5kZW5jaWVzJyBvYmplY3RzXG4gIGlmICh0eXBlb2YgbmV3U2NoZW1hLnByb3BlcnRpZXMgPT09ICdvYmplY3QnKSB7XG4gICAgY29uc3QgcHJvcGVydGllcyA9IHsgLi4ubmV3U2NoZW1hLnByb3BlcnRpZXMgfTtcbiAgICBjb25zdCByZXF1aXJlZEtleXMgPSBBcnJheS5pc0FycmF5KG5ld1NjaGVtYS5yZXF1aXJlZCkgP1xuICAgICAgbmV3IFNldChuZXdTY2hlbWEucmVxdWlyZWQpIDogbmV3IFNldCgpO1xuXG4gICAgLy8gQ29udmVydCB2MS12MiBib29sZWFuICdvcHRpb25hbCcgcHJvcGVydGllcyB0byAncmVxdWlyZWQnIGFycmF5XG4gICAgaWYgKGRyYWZ0ID09PSAxIHx8IGRyYWZ0ID09PSAyIHx8XG4gICAgICBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKS5zb21lKGtleSA9PiBwcm9wZXJ0aWVzW2tleV0ub3B0aW9uYWwgPT09IHRydWUpXG4gICAgKSB7XG4gICAgICBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKVxuICAgICAgICAuZmlsdGVyKGtleSA9PiBwcm9wZXJ0aWVzW2tleV0ub3B0aW9uYWwgIT09IHRydWUpXG4gICAgICAgIC5mb3JFYWNoKGtleSA9PiByZXF1aXJlZEtleXMuYWRkKGtleSkpO1xuICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICBpZiAoIWRyYWZ0KSB7IGRyYWZ0ID0gMjsgfVxuICAgIH1cblxuICAgIC8vIENvbnZlcnQgdjMgYm9vbGVhbiAncmVxdWlyZWQnIHByb3BlcnRpZXMgdG8gJ3JlcXVpcmVkJyBhcnJheVxuICAgIGlmIChPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKS5zb21lKGtleSA9PiBwcm9wZXJ0aWVzW2tleV0ucmVxdWlyZWQgPT09IHRydWUpKSB7XG4gICAgICBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKVxuICAgICAgICAuZmlsdGVyKGtleSA9PiBwcm9wZXJ0aWVzW2tleV0ucmVxdWlyZWQgPT09IHRydWUpXG4gICAgICAgIC5mb3JFYWNoKGtleSA9PiByZXF1aXJlZEtleXMuYWRkKGtleSkpO1xuICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHJlcXVpcmVkS2V5cy5zaXplKSB7IG5ld1NjaGVtYS5yZXF1aXJlZCA9IEFycmF5LmZyb20ocmVxdWlyZWRLZXlzKTsgfVxuXG4gICAgLy8gQ29udmVydCB2MS12MiBhcnJheSBvciBzdHJpbmcgJ3JlcXVpcmVzJyBwcm9wZXJ0aWVzIHRvICdkZXBlbmRlbmNpZXMnIG9iamVjdFxuICAgIGlmIChPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKS5zb21lKGtleSA9PiBwcm9wZXJ0aWVzW2tleV0ucmVxdWlyZXMpKSB7XG4gICAgICBjb25zdCBkZXBlbmRlbmNpZXMgPSB0eXBlb2YgbmV3U2NoZW1hLmRlcGVuZGVuY2llcyA9PT0gJ29iamVjdCcgP1xuICAgICAgICB7IC4uLm5ld1NjaGVtYS5kZXBlbmRlbmNpZXMgfSA6IHt9O1xuICAgICAgT2JqZWN0LmtleXMocHJvcGVydGllcylcbiAgICAgICAgLmZpbHRlcihrZXkgPT4gcHJvcGVydGllc1trZXldLnJlcXVpcmVzKVxuICAgICAgICAuZm9yRWFjaChrZXkgPT4gZGVwZW5kZW5jaWVzW2tleV0gPVxuICAgICAgICAgIHR5cGVvZiBwcm9wZXJ0aWVzW2tleV0ucmVxdWlyZXMgPT09ICdzdHJpbmcnID9cbiAgICAgICAgICAgIFtwcm9wZXJ0aWVzW2tleV0ucmVxdWlyZXNdIDogcHJvcGVydGllc1trZXldLnJlcXVpcmVzXG4gICAgICAgICk7XG4gICAgICBuZXdTY2hlbWEuZGVwZW5kZW5jaWVzID0gZGVwZW5kZW5jaWVzO1xuICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICBpZiAoIWRyYWZ0KSB7IGRyYWZ0ID0gMjsgfVxuICAgIH1cblxuICAgIG5ld1NjaGVtYS5wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcbiAgfVxuXG4gIC8vIFJldm92ZSB2MS12MiBib29sZWFuICdvcHRpb25hbCcga2V5XG4gIGlmICh0eXBlb2YgbmV3U2NoZW1hLm9wdGlvbmFsID09PSAnYm9vbGVhbicpIHtcbiAgICBkZWxldGUgbmV3U2NoZW1hLm9wdGlvbmFsO1xuICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgIGlmICghZHJhZnQpIHsgZHJhZnQgPSAyOyB9XG4gIH1cblxuICAvLyBSZXZvdmUgdjEtdjIgJ3JlcXVpcmVzJyBrZXlcbiAgaWYgKG5ld1NjaGVtYS5yZXF1aXJlcykge1xuICAgIGRlbGV0ZSBuZXdTY2hlbWEucmVxdWlyZXM7XG4gIH1cblxuICAvLyBSZXZvdmUgdjMgYm9vbGVhbiAncmVxdWlyZWQnIGtleVxuICBpZiAodHlwZW9mIG5ld1NjaGVtYS5yZXF1aXJlZCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgZGVsZXRlIG5ld1NjaGVtYS5yZXF1aXJlZDtcbiAgfVxuXG4gIC8vIENvbnZlcnQgaWQgdG8gJGlkXG4gIGlmICh0eXBlb2YgbmV3U2NoZW1hLmlkID09PSAnc3RyaW5nJyAmJiAhbmV3U2NoZW1hLiRpZCkge1xuICAgIGlmIChuZXdTY2hlbWEuaWQuc2xpY2UoLTEpID09PSAnIycpIHtcbiAgICAgIG5ld1NjaGVtYS5pZCA9IG5ld1NjaGVtYS5pZC5zbGljZSgwLCAtMSk7XG4gICAgfVxuICAgIG5ld1NjaGVtYS4kaWQgPSBuZXdTY2hlbWEuaWQgKyAnLUNPTlZFUlRFRC1UTy1EUkFGVC0wNiMnO1xuICAgIGRlbGV0ZSBuZXdTY2hlbWEuaWQ7XG4gICAgY2hhbmdlZCA9IHRydWU7XG4gIH1cblxuICAvLyBDaGVjayBpZiB2MS12MyAnYW55JyBvciBvYmplY3QgdHlwZXMgd2lsbCBiZSBjb252ZXJ0ZWRcbiAgaWYgKG5ld1NjaGVtYS50eXBlICYmICh0eXBlb2YgbmV3U2NoZW1hLnR5cGUuZXZlcnkgPT09ICdmdW5jdGlvbicgP1xuICAgICFuZXdTY2hlbWEudHlwZS5ldmVyeSh0eXBlID0+IHNpbXBsZVR5cGVzLmluY2x1ZGVzKHR5cGUpKSA6XG4gICAgIXNpbXBsZVR5cGVzLmluY2x1ZGVzKG5ld1NjaGVtYS50eXBlKVxuICApKSB7XG4gICAgY2hhbmdlZCA9IHRydWU7XG4gIH1cblxuICAvLyBJZiBzY2hlbWEgY2hhbmdlZCwgdXBkYXRlIG9yIHJlbW92ZSAkc2NoZW1hIGlkZW50aWZpZXJcbiAgaWYgKHR5cGVvZiBuZXdTY2hlbWEuJHNjaGVtYSA9PT0gJ3N0cmluZycgJiZcbiAgICAvaHR0cFxcOlxcL1xcL2pzb25cXC1zY2hlbWFcXC5vcmdcXC9kcmFmdFxcLTBbMS00XVxcL3NjaGVtYVxcIy8udGVzdChuZXdTY2hlbWEuJHNjaGVtYSlcbiAgKSB7XG4gICAgbmV3U2NoZW1hLiRzY2hlbWEgPSAnaHR0cDovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC0wNi9zY2hlbWEjJztcbiAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgfSBlbHNlIGlmIChjaGFuZ2VkICYmIHR5cGVvZiBuZXdTY2hlbWEuJHNjaGVtYSA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25zdCBhZGRUb0Rlc2NyaXB0aW9uID0gJ0NvbnZlcnRlZCB0byBkcmFmdCA2IGZyb20gJyArIG5ld1NjaGVtYS4kc2NoZW1hO1xuICAgIGlmICh0eXBlb2YgbmV3U2NoZW1hLmRlc2NyaXB0aW9uID09PSAnc3RyaW5nJyAmJiBuZXdTY2hlbWEuZGVzY3JpcHRpb24ubGVuZ3RoKSB7XG4gICAgICBuZXdTY2hlbWEuZGVzY3JpcHRpb24gKz0gJ1xcbicgKyBhZGRUb0Rlc2NyaXB0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdTY2hlbWEuZGVzY3JpcHRpb24gPSBhZGRUb0Rlc2NyaXB0aW9uO1xuICAgIH1cbiAgICBkZWxldGUgbmV3U2NoZW1hLiRzY2hlbWE7XG4gIH1cblxuICAvLyBDb252ZXJ0IHYxLXYzICdhbnknIGFuZCBvYmplY3QgdHlwZXNcbiAgaWYgKG5ld1NjaGVtYS50eXBlICYmICh0eXBlb2YgbmV3U2NoZW1hLnR5cGUuZXZlcnkgPT09ICdmdW5jdGlvbicgP1xuICAgICFuZXdTY2hlbWEudHlwZS5ldmVyeSh0eXBlID0+IHNpbXBsZVR5cGVzLmluY2x1ZGVzKHR5cGUpKSA6XG4gICAgIXNpbXBsZVR5cGVzLmluY2x1ZGVzKG5ld1NjaGVtYS50eXBlKVxuICApKSB7XG4gICAgaWYgKG5ld1NjaGVtYS50eXBlLmxlbmd0aCA9PT0gMSkgeyBuZXdTY2hlbWEudHlwZSA9IG5ld1NjaGVtYS50eXBlWzBdOyB9XG4gICAgaWYgKHR5cGVvZiBuZXdTY2hlbWEudHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIENvbnZlcnQgc3RyaW5nICdhbnknIHR5cGUgdG8gYXJyYXkgb2YgYWxsIHN0YW5kYXJkIHR5cGVzXG4gICAgICBpZiAobmV3U2NoZW1hLnR5cGUgPT09ICdhbnknKSB7XG4gICAgICAgIG5ld1NjaGVtYS50eXBlID0gc2ltcGxlVHlwZXM7XG4gICAgICAgIC8vIERlbGV0ZSBub24tc3RhbmRhcmQgc3RyaW5nIHR5cGVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSBuZXdTY2hlbWEudHlwZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBuZXdTY2hlbWEudHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmICh0eXBlb2YgbmV3U2NoZW1hLnR5cGUuZXZlcnkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gSWYgYXJyYXkgb2Ygc3RyaW5ncywgb25seSBhbGxvdyBzdGFuZGFyZCB0eXBlc1xuICAgICAgICBpZiAobmV3U2NoZW1hLnR5cGUuZXZlcnkodHlwZSA9PiB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpKSB7XG4gICAgICAgICAgbmV3U2NoZW1hLnR5cGUgPSBuZXdTY2hlbWEudHlwZS5zb21lKHR5cGUgPT4gdHlwZSA9PT0gJ2FueScpID9cbiAgICAgICAgICAgIG5ld1NjaGVtYS50eXBlID0gc2ltcGxlVHlwZXMgOlxuICAgICAgICAgICAgbmV3U2NoZW1hLnR5cGUuZmlsdGVyKHR5cGUgPT4gc2ltcGxlVHlwZXMuaW5jbHVkZXModHlwZSkpO1xuICAgICAgICAgIC8vIElmIHR5cGUgaXMgYW4gYXJyYXkgd2l0aCBvYmplY3RzLCBjb252ZXJ0IHRoZSBjdXJyZW50IHNjaGVtYSB0byBhbiAnYW55T2YnIGFycmF5XG4gICAgICAgIH0gZWxzZSBpZiAobmV3U2NoZW1hLnR5cGUubGVuZ3RoID4gMSkge1xuICAgICAgICAgIGNvbnN0IGFycmF5S2V5cyA9IFsnYWRkaXRpb25hbEl0ZW1zJywgJ2l0ZW1zJywgJ21heEl0ZW1zJywgJ21pbkl0ZW1zJywgJ3VuaXF1ZUl0ZW1zJywgJ2NvbnRhaW5zJ107XG4gICAgICAgICAgY29uc3QgbnVtYmVyS2V5cyA9IFsnbXVsdGlwbGVPZicsICdtYXhpbXVtJywgJ2V4Y2x1c2l2ZU1heGltdW0nLCAnbWluaW11bScsICdleGNsdXNpdmVNaW5pbXVtJ107XG4gICAgICAgICAgY29uc3Qgb2JqZWN0S2V5cyA9IFsnbWF4UHJvcGVydGllcycsICdtaW5Qcm9wZXJ0aWVzJywgJ3JlcXVpcmVkJywgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJyxcbiAgICAgICAgICAgICdwcm9wZXJ0aWVzJywgJ3BhdHRlcm5Qcm9wZXJ0aWVzJywgJ2RlcGVuZGVuY2llcycsICdwcm9wZXJ0eU5hbWVzJ107XG4gICAgICAgICAgY29uc3Qgc3RyaW5nS2V5cyA9IFsnbWF4TGVuZ3RoJywgJ21pbkxlbmd0aCcsICdwYXR0ZXJuJywgJ2Zvcm1hdCddO1xuICAgICAgICAgIGNvbnN0IGZpbHRlcktleXMgPSB7XG4gICAgICAgICAgICAnYXJyYXknOiBbLi4ubnVtYmVyS2V5cywgLi4ub2JqZWN0S2V5cywgLi4uc3RyaW5nS2V5c10sXG4gICAgICAgICAgICAnaW50ZWdlcic6IFsuLi5hcnJheUtleXMsIC4uLm9iamVjdEtleXMsIC4uLnN0cmluZ0tleXNdLFxuICAgICAgICAgICAgJ251bWJlcic6IFsuLi5hcnJheUtleXMsIC4uLm9iamVjdEtleXMsIC4uLnN0cmluZ0tleXNdLFxuICAgICAgICAgICAgJ29iamVjdCc6IFsuLi5hcnJheUtleXMsIC4uLm51bWJlcktleXMsIC4uLnN0cmluZ0tleXNdLFxuICAgICAgICAgICAgJ3N0cmluZyc6IFsuLi5hcnJheUtleXMsIC4uLm51bWJlcktleXMsIC4uLm9iamVjdEtleXNdLFxuICAgICAgICAgICAgJ2FsbCc6IFsuLi5hcnJheUtleXMsIC4uLm51bWJlcktleXMsIC4uLm9iamVjdEtleXMsIC4uLnN0cmluZ0tleXNdLFxuICAgICAgICAgIH07XG4gICAgICAgICAgY29uc3QgYW55T2YgPSBbXTtcbiAgICAgICAgICBmb3IgKGNvbnN0IHR5cGUgb2YgbmV3U2NoZW1hLnR5cGUpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1R5cGUgPSB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycgPyB7IHR5cGUgfSA6IHsgLi4udHlwZSB9O1xuICAgICAgICAgICAgT2JqZWN0LmtleXMobmV3U2NoZW1hKVxuICAgICAgICAgICAgICAuZmlsdGVyKGtleSA9PiAhbmV3VHlwZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmXG4gICAgICAgICAgICAgICAgIVsuLi4oZmlsdGVyS2V5c1tuZXdUeXBlLnR5cGVdIHx8IGZpbHRlcktleXMuYWxsKSwgJ3R5cGUnLCAnZGVmYXVsdCddXG4gICAgICAgICAgICAgICAgICAuaW5jbHVkZXMoa2V5KVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIC5mb3JFYWNoKGtleSA9PiBuZXdUeXBlW2tleV0gPSBuZXdTY2hlbWFba2V5XSk7XG4gICAgICAgICAgICBhbnlPZi5wdXNoKG5ld1R5cGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBuZXdTY2hlbWEgPSBuZXdTY2hlbWEuaGFzT3duUHJvcGVydHkoJ2RlZmF1bHQnKSA/XG4gICAgICAgICAgICB7IGFueU9mLCBkZWZhdWx0OiBuZXdTY2hlbWEuZGVmYXVsdCB9IDogeyBhbnlPZiB9O1xuICAgICAgICAgIC8vIElmIHR5cGUgaXMgYW4gb2JqZWN0LCBtZXJnZSBpdCB3aXRoIHRoZSBjdXJyZW50IHNjaGVtYVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHR5cGVTY2hlbWEgPSBuZXdTY2hlbWEudHlwZTtcbiAgICAgICAgICBkZWxldGUgbmV3U2NoZW1hLnR5cGU7XG4gICAgICAgICAgT2JqZWN0LmFzc2lnbihuZXdTY2hlbWEsIHR5cGVTY2hlbWEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBuZXdTY2hlbWEudHlwZTtcbiAgICB9XG4gIH1cblxuICAvLyBDb252ZXJ0IHN1YiBzY2hlbWFzXG4gIE9iamVjdC5rZXlzKG5ld1NjaGVtYSlcbiAgICAuZmlsdGVyKGtleSA9PiB0eXBlb2YgbmV3U2NoZW1hW2tleV0gPT09ICdvYmplY3QnKVxuICAgIC5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAoXG4gICAgICAgIFsnZGVmaW5pdGlvbnMnLCAnZGVwZW5kZW5jaWVzJywgJ3Byb3BlcnRpZXMnLCAncGF0dGVyblByb3BlcnRpZXMnXVxuICAgICAgICAgIC5pbmNsdWRlcyhrZXkpICYmIHR5cGVvZiBuZXdTY2hlbWFba2V5XS5tYXAgIT09ICdmdW5jdGlvbidcbiAgICAgICkge1xuICAgICAgICBjb25zdCBuZXdLZXkgPSB7fTtcbiAgICAgICAgT2JqZWN0LmtleXMobmV3U2NoZW1hW2tleV0pLmZvckVhY2goc3ViS2V5ID0+IG5ld0tleVtzdWJLZXldID1cbiAgICAgICAgICBjb252ZXJ0U2NoZW1hVG9EcmFmdDYobmV3U2NoZW1hW2tleV1bc3ViS2V5XSwgeyBjaGFuZ2VkLCBkcmFmdCB9KVxuICAgICAgICApO1xuICAgICAgICBuZXdTY2hlbWFba2V5XSA9IG5ld0tleTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIFsnaXRlbXMnLCAnYWRkaXRpb25hbEl0ZW1zJywgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJyxcbiAgICAgICAgICAnYWxsT2YnLCAnYW55T2YnLCAnb25lT2YnLCAnbm90J10uaW5jbHVkZXMoa2V5KVxuICAgICAgKSB7XG4gICAgICAgIG5ld1NjaGVtYVtrZXldID0gY29udmVydFNjaGVtYVRvRHJhZnQ2KG5ld1NjaGVtYVtrZXldLCB7IGNoYW5nZWQsIGRyYWZ0IH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3U2NoZW1hW2tleV0gPSBjbG9uZURlZXAobmV3U2NoZW1hW2tleV0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIHJldHVybiBuZXdTY2hlbWE7XG59XG4iXX0=