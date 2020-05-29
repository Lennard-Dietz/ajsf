/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import cloneDeep from "lodash/cloneDeep";
import filter from "lodash/filter";
import map from "lodash/map";
import { FormArray, FormControl, FormGroup, } from "@angular/forms";
import { forEach, hasOwn } from "./utility.functions";
import { getControlValidators, removeRecursiveReferences, } from "./json-schema.functions";
import { hasValue, inArray, isArray, isDate, isDefined, isEmpty, isObject, isPrimitive, toJavaScriptType, toSchemaType, } from "./validator.functions";
import { JsonPointer } from "./jsonpointer.functions";
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
export function buildFormGroupTemplate(jsf, nodeValue, setValues, schemaPointer, dataPointer, templatePointer) {
    if (nodeValue === void 0) { nodeValue = null; }
    if (setValues === void 0) { setValues = true; }
    if (schemaPointer === void 0) { schemaPointer = ""; }
    if (dataPointer === void 0) { dataPointer = ""; }
    if (templatePointer === void 0) { templatePointer = ""; }
    /** @type {?} */
    var schema = JsonPointer.get(jsf.schema, schemaPointer);
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
    var schemaType = JsonPointer.get(schema, "/type");
    /** @type {?} */
    var controlType = (hasOwn(schema, "properties") || hasOwn(schema, "additionalProperties")) &&
        schemaType === "object"
        ? "FormGroup"
        : (hasOwn(schema, "items") || hasOwn(schema, "additionalItems")) &&
            schemaType === "array"
            ? "FormArray"
            : !schemaType && hasOwn(schema, "$ref")
                ? "$ref"
                : "FormControl";
    /** @type {?} */
    var shortDataPointer = removeRecursiveReferences(dataPointer, jsf.dataRecursiveRefMap, jsf.arrayMap);
    if (!jsf.dataMap.has(shortDataPointer)) {
        jsf.dataMap.set(shortDataPointer, new Map());
    }
    /** @type {?} */
    var nodeOptions = jsf.dataMap.get(shortDataPointer);
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
    var controls;
    /** @type {?} */
    var validators = getControlValidators(schema);
    switch (controlType) {
        case "FormGroup":
            controls = {};
            if (hasOwn(schema, "ui:order") || hasOwn(schema, "properties")) {
                /** @type {?} */
                var propertyKeys_1 = schema["ui:order"] || Object.keys(schema.properties);
                if (propertyKeys_1.includes("*") && !hasOwn(schema.properties, "*")) {
                    /** @type {?} */
                    var unnamedKeys = Object.keys(schema.properties).filter((/**
                     * @param {?} key
                     * @return {?}
                     */
                    function (key) { return !propertyKeys_1.includes(key); }));
                    for (var i = propertyKeys_1.length - 1; i >= 0; i--) {
                        if (propertyKeys_1[i] === "*") {
                            propertyKeys_1.splice.apply(propertyKeys_1, tslib_1.__spread([i, 1], unnamedKeys));
                        }
                    }
                }
                propertyKeys_1
                    .filter((/**
                 * @param {?} key
                 * @return {?}
                 */
                function (key) {
                    return hasOwn(schema.properties, key) ||
                        hasOwn(schema, "additionalProperties");
                }))
                    .forEach((/**
                 * @param {?} key
                 * @return {?}
                 */
                function (key) {
                    return (controls[key] = buildFormGroupTemplate(jsf, JsonPointer.get(nodeValue, [(/** @type {?} */ (key))]), setValues, schemaPointer +
                        (hasOwn(schema.properties, key)
                            ? "/properties/" + key
                            : "/additionalProperties"), dataPointer + "/" + key, templatePointer + "/controls/" + key));
                }));
                jsf.formOptions.fieldsRequired = setRequiredFields(schema, controls);
            }
            return { controlType: controlType, controls: controls, validators: validators };
        case "FormArray":
            controls = [];
            /** @type {?} */
            var minItems = Math.max(schema.minItems || 0, nodeOptions.get("minItems") || 0);
            /** @type {?} */
            var maxItems = Math.min(schema.maxItems || 1000, nodeOptions.get("maxItems") || 1000);
            /** @type {?} */
            var additionalItemsPointer = null;
            if (isArray(schema.items)) {
                // 'items' is an array = tuple items
                /** @type {?} */
                var tupleItems = nodeOptions.get("tupleItems") ||
                    (isArray(schema.items) ? Math.min(schema.items.length, maxItems) : 0);
                for (var i = 0; i < tupleItems; i++) {
                    if (i < minItems) {
                        controls.push(buildFormGroupTemplate(jsf, isArray(nodeValue) ? nodeValue[i] : nodeValue, setValues, schemaPointer + "/items/" + i, dataPointer + "/" + i, templatePointer + "/controls/" + i));
                    }
                    else {
                        /** @type {?} */
                        var schemaRefPointer = removeRecursiveReferences(schemaPointer + "/items/" + i, jsf.schemaRecursiveRefMap);
                        /** @type {?} */
                        var itemRefPointer = removeRecursiveReferences(shortDataPointer + "/" + i, jsf.dataRecursiveRefMap, jsf.arrayMap);
                        /** @type {?} */
                        var itemRecursive = itemRefPointer !== shortDataPointer + "/" + i;
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
                var schemaRefPointer = removeRecursiveReferences(additionalItemsPointer, jsf.schemaRecursiveRefMap);
                /** @type {?} */
                var itemRefPointer = removeRecursiveReferences(shortDataPointer + "/-", jsf.dataRecursiveRefMap, jsf.arrayMap);
                /** @type {?} */
                var itemRecursive = itemRefPointer !== shortDataPointer + "/-";
                if (!hasOwn(jsf.templateRefLibrary, itemRefPointer)) {
                    jsf.templateRefLibrary[itemRefPointer] = null;
                    jsf.templateRefLibrary[itemRefPointer] = buildFormGroupTemplate(jsf, null, setValues, schemaRefPointer, itemRefPointer, templatePointer + "/controls/-");
                }
                // const itemOptions = jsf.dataMap.get(itemRefPointer) || new Map();
                /** @type {?} */
                var itemOptions = nodeOptions;
                if (!itemRecursive || hasOwn(validators, "required")) {
                    /** @type {?} */
                    var arrayLength = Math.min(Math.max(itemRecursive
                        ? 0
                        : itemOptions.get("tupleItems") +
                            itemOptions.get("listItems") || 0, isArray(nodeValue) ? nodeValue.length : 0), maxItems);
                    for (var i = controls.length; i < arrayLength; i++) {
                        controls.push(isArray(nodeValue)
                            ? buildFormGroupTemplate(jsf, nodeValue[i], setValues, schemaRefPointer, dataPointer + "/-", templatePointer + "/controls/-")
                            : itemRecursive
                                ? null
                                : cloneDeep(jsf.templateRefLibrary[itemRefPointer]));
                    }
                }
            }
            return { controlType: controlType, controls: controls, validators: validators };
        case "$ref":
            /** @type {?} */
            var schemaRef = JsonPointer.compile(schema.$ref);
            /** @type {?} */
            var dataRef = JsonPointer.toDataPointer(schemaRef, schema);
            /** @type {?} */
            var refPointer = removeRecursiveReferences(dataRef, jsf.dataRecursiveRefMap, jsf.arrayMap);
            if (refPointer && !hasOwn(jsf.templateRefLibrary, refPointer)) {
                // Set to null first to prevent recursive reference from causing endless loop
                jsf.templateRefLibrary[refPointer] = null;
                /** @type {?} */
                var newTemplate = buildFormGroupTemplate(jsf, setValues, setValues, schemaRef);
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
            var value = {
                value: setValues && isPrimitive(nodeValue) ? nodeValue : null,
                disabled: nodeOptions.get("disabled") || false,
            };
            return { controlType: controlType, value: value, validators: validators };
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
export function buildFormGroup(template) {
    /** @type {?} */
    var validatorFns = [];
    /** @type {?} */
    var validatorFn = null;
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
                var groupControls_1 = {};
                forEach(template.controls, (/**
                 * @param {?} controls
                 * @param {?} key
                 * @return {?}
                 */
                function (controls, key) {
                    /** @type {?} */
                    var newControl = buildFormGroup(controls);
                    if (newControl) {
                        groupControls_1[key] = newControl;
                    }
                }));
                return new FormGroup(groupControls_1, validatorFn);
            case "FormArray":
                return new FormArray(filter(map(template.controls, (/**
                 * @param {?} controls
                 * @return {?}
                 */
                function (controls) { return buildFormGroup(controls); }))), validatorFn);
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
export function mergeValues() {
    var e_1, _a, e_2, _b, e_3, _c;
    var valuesToMerge = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        valuesToMerge[_i] = arguments[_i];
    }
    /** @type {?} */
    var mergedValues = null;
    try {
        for (var valuesToMerge_1 = tslib_1.__values(valuesToMerge), valuesToMerge_1_1 = valuesToMerge_1.next(); !valuesToMerge_1_1.done; valuesToMerge_1_1 = valuesToMerge_1.next()) {
            var currentValue = valuesToMerge_1_1.value;
            if (!isEmpty(currentValue)) {
                if (typeof currentValue === "object" &&
                    (isEmpty(mergedValues) || typeof mergedValues !== "object")) {
                    if (isArray(currentValue)) {
                        mergedValues = tslib_1.__spread(currentValue);
                    }
                    else if (isObject(currentValue)) {
                        mergedValues = tslib_1.__assign({}, currentValue);
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
                    var newValues = [];
                    try {
                        for (var currentValue_1 = tslib_1.__values(currentValue), currentValue_1_1 = currentValue_1.next(); !currentValue_1_1.done; currentValue_1_1 = currentValue_1.next()) {
                            var value = currentValue_1_1.value;
                            newValues.push(mergeValues(mergedValues, value));
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (currentValue_1_1 && !currentValue_1_1.done && (_b = currentValue_1.return)) _b.call(currentValue_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    mergedValues = newValues;
                }
                else if (isArray(mergedValues) && isObject(currentValue)) {
                    /** @type {?} */
                    var newValues = [];
                    try {
                        for (var mergedValues_1 = tslib_1.__values(mergedValues), mergedValues_1_1 = mergedValues_1.next(); !mergedValues_1_1.done; mergedValues_1_1 = mergedValues_1.next()) {
                            var value = mergedValues_1_1.value;
                            newValues.push(mergeValues(value, currentValue));
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (mergedValues_1_1 && !mergedValues_1_1.done && (_c = mergedValues_1.return)) _c.call(mergedValues_1);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    mergedValues = newValues;
                }
                else if (isArray(mergedValues) && isArray(currentValue)) {
                    /** @type {?} */
                    var newValues = [];
                    for (var i = 0; i < Math.max(mergedValues.length, currentValue.length); i++) {
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
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (valuesToMerge_1_1 && !valuesToMerge_1_1.done && (_a = valuesToMerge_1.return)) _a.call(valuesToMerge_1);
        }
        finally { if (e_1) throw e_1.error; }
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
export function setRequiredFields(schema, formControlTemplate) {
    /** @type {?} */
    var fieldsRequired = false;
    if (hasOwn(schema, "required") && !isEmpty(schema.required)) {
        fieldsRequired = true;
        /** @type {?} */
        var requiredArray = isArray(schema.required)
            ? schema.required
            : [schema.required];
        requiredArray = forEach(requiredArray, (/**
         * @param {?} key
         * @return {?}
         */
        function (key) {
            return JsonPointer.set(formControlTemplate, "/" + key + "/validators/required", []);
        }));
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
export function formatFormData(formData, dataMap, recursiveRefMap, arrayMap, returnEmptyFields, fixErrors) {
    if (returnEmptyFields === void 0) { returnEmptyFields = false; }
    if (fixErrors === void 0) { fixErrors = false; }
    if (formData === null || typeof formData !== "object") {
        return formData;
    }
    /** @type {?} */
    var formattedData = isArray(formData) ? [] : {};
    JsonPointer.forEachDeep(formData, (/**
     * @param {?} value
     * @param {?} dataPointer
     * @return {?}
     */
    function (value, dataPointer) {
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
            var genericPointer_1 = JsonPointer.has(dataMap, [
                dataPointer,
                "schemaType",
            ])
                ? dataPointer
                : removeRecursiveReferences(dataPointer, recursiveRefMap, arrayMap);
            if (JsonPointer.has(dataMap, [genericPointer_1, "schemaType"])) {
                /** @type {?} */
                var schemaType = dataMap
                    .get(genericPointer_1)
                    .get("schemaType");
                if (schemaType === "null") {
                    JsonPointer.set(formattedData, dataPointer, null);
                }
                else if ((hasValue(value) || returnEmptyFields) &&
                    inArray(schemaType, ["string", "integer", "number", "boolean"])) {
                    /** @type {?} */
                    var newValue = fixErrors || (value === null && returnEmptyFields)
                        ? toSchemaType(value, schemaType)
                        : toJavaScriptType(value, schemaType);
                    if (isDefined(newValue) || returnEmptyFields) {
                        JsonPointer.set(formattedData, dataPointer, newValue);
                    }
                    // If returnEmptyFields === false,
                    // only add empty arrays and objects to required keys
                }
                else if (schemaType === "object" && !returnEmptyFields) {
                    (dataMap.get(genericPointer_1).get("required") || []).forEach((/**
                     * @param {?} key
                     * @return {?}
                     */
                    function (key) {
                        /** @type {?} */
                        var keySchemaType = dataMap
                            .get(genericPointer_1 + "/" + key)
                            .get("schemaType");
                        if (keySchemaType === "array") {
                            JsonPointer.set(formattedData, dataPointer + "/" + key, []);
                        }
                        else if (keySchemaType === "object") {
                            JsonPointer.set(formattedData, dataPointer + "/" + key, {});
                        }
                    }));
                }
                // Finish incomplete 'date-time' entries
                if (dataMap.get(genericPointer_1).get("schemaFormat") === "date-time") {
                    // "2000-03-14T01:59:26.535" -> "2000-03-14T01:59:26.535Z" (add "Z")
                    if (/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s][0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?$/i.test(value)) {
                        JsonPointer.set(formattedData, dataPointer, value + "Z");
                        // "2000-03-14T01:59" -> "2000-03-14T01:59:00Z" (add ":00Z")
                    }
                    else if (/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s][0-2]\d:[0-5]\d$/i.test(value)) {
                        JsonPointer.set(formattedData, dataPointer, value + ":00Z");
                        // "2000-03-14" -> "2000-03-14T00:00:00Z" (add "T00:00:00Z")
                    }
                    else if (fixErrors && /^\d\d\d\d-[0-1]\d-[0-3]\d$/i.test(value)) {
                        JsonPointer.set(formattedData, dataPointer, value + ":00:00:00Z");
                    }
                }
            }
            else if (typeof value !== "object" ||
                isDate(value) ||
                (value === null && returnEmptyFields)) {
                console.error("formatFormData error: " +
                    ("Schema type not found for form value at " + genericPointer_1));
                console.error("dataMap", dataMap);
                console.error("recursiveRefMap", recursiveRefMap);
                console.error("genericPointer", genericPointer_1);
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
export function getControl(formGroup, dataPointer, returnGroup) {
    var e_4, _a;
    if (returnGroup === void 0) { returnGroup = false; }
    if (!isObject(formGroup) || !JsonPointer.isJsonPointer(dataPointer)) {
        if (!JsonPointer.isJsonPointer(dataPointer)) {
            // If dataPointer input is not a valid JSON pointer, check to
            // see if it is instead a valid object path, using dot notaion
            if (typeof dataPointer === "string") {
                /** @type {?} */
                var formControl = formGroup.get(dataPointer);
                if (formControl) {
                    return formControl;
                }
            }
            console.error("getControl error: Invalid JSON Pointer: " + dataPointer);
        }
        if (!isObject(formGroup)) {
            console.error("getControl error: Invalid formGroup: " + formGroup);
        }
        return null;
    }
    /** @type {?} */
    var dataPointerArray = JsonPointer.parse(dataPointer);
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
        function (key) { return key.indexOf(".") === -1; }))) {
        /** @type {?} */
        var formControl = formGroup.get(dataPointerArray.join("."));
        if (formControl) {
            return formControl;
        }
    }
    // If formGroup input is a formGroup template,
    // or formGroup.get() failed to return the control,
    // search the formGroup object for dataPointer's control
    /** @type {?} */
    var subGroup = formGroup;
    try {
        for (var dataPointerArray_1 = tslib_1.__values(dataPointerArray), dataPointerArray_1_1 = dataPointerArray_1.next(); !dataPointerArray_1_1.done; dataPointerArray_1_1 = dataPointerArray_1.next()) {
            var key = dataPointerArray_1_1.value;
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
                console.error("getControl error: Unable to find \"" + key + "\" item in FormGroup.");
                console.error(dataPointer);
                console.error(formGroup);
                return;
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (dataPointerArray_1_1 && !dataPointerArray_1_1.done && (_a = dataPointerArray_1.return)) _a.call(dataPointerArray_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return subGroup;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1ncm91cC5mdW5jdGlvbnMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWpzZi9jb3JlLyIsInNvdXJjZXMiOlsibGliL3NoYXJlZC9mb3JtLWdyb3VwLmZ1bmN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sU0FBUyxNQUFNLGtCQUFrQixDQUFDO0FBQ3pDLE9BQU8sTUFBTSxNQUFNLGVBQWUsQ0FBQztBQUNuQyxPQUFPLEdBQUcsTUFBTSxZQUFZLENBQUM7QUFDN0IsT0FBTyxFQUVMLFNBQVMsRUFDVCxXQUFXLEVBQ1gsU0FBUyxHQUVWLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEIsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN0RCxPQUFPLEVBQ0wsb0JBQW9CLEVBQ3BCLHlCQUF5QixHQUMxQixNQUFNLHlCQUF5QixDQUFDO0FBQ2pDLE9BQU8sRUFDTCxRQUFRLEVBQ1IsT0FBTyxFQUNQLE9BQU8sRUFDUCxNQUFNLEVBQ04sU0FBUyxFQUNULE9BQU8sRUFDUCxRQUFRLEVBQ1IsV0FBVyxFQUVYLGdCQUFnQixFQUNoQixZQUFZLEdBQ2IsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQUUsV0FBVyxFQUFXLE1BQU0seUJBQXlCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1Qy9ELE1BQU0sVUFBVSxzQkFBc0IsQ0FDcEMsR0FBUSxFQUNSLFNBQXFCLEVBQ3JCLFNBQWdCLEVBQ2hCLGFBQWtCLEVBQ2xCLFdBQWdCLEVBQ2hCLGVBQW9CO0lBSnBCLDBCQUFBLEVBQUEsZ0JBQXFCO0lBQ3JCLDBCQUFBLEVBQUEsZ0JBQWdCO0lBQ2hCLDhCQUFBLEVBQUEsa0JBQWtCO0lBQ2xCLDRCQUFBLEVBQUEsZ0JBQWdCO0lBQ2hCLGdDQUFBLEVBQUEsb0JBQW9COztRQUVkLE1BQU0sR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcs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QUMsR0FBRyxDQUFDLENBQUM7UUFDN0QsSUFBSSxXQUFXLEVBQUU7WUFDZixPQUFPLFdBQVcsQ0FBQztTQUNwQjtLQUNGOzs7OztRQUtHLFFBQVEsR0FBRyxTQUFTOztRQUN4QixLQUFrQixJQUFBLHFCQUFBLGlCQUFBLGdCQUFnQixDQUFBLGtEQUFBLGdGQUFFO1lBQS9CLElBQU0sR0FBRyw2QkFBQTtZQUNaLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsRUFBRTtnQkFDaEMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUM7YUFDOUI7WUFDRCxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLEtBQUssR0FBRyxFQUFFO2dCQUNwQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDMUM7aUJBQU0sSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUNoQyxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQzFCO2lCQUFNO2dCQUNMLE9BQU8sQ0FBQyxLQUFLLENBQ1gsd0NBQXFDLEdBQUcsMEJBQXNCLENBQy9ELENBQUM7Z0JBQ0YsT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDM0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDekIsT0FBTzthQUNSO1NBQ0Y7Ozs7Ozs7OztJQUNELE9BQU8sUUFBUSxDQUFDO0FBQ2xCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xvbmVEZWVwIGZyb20gXCJsb2Rhc2gvY2xvbmVEZWVwXCI7XG5pbXBvcnQgZmlsdGVyIGZyb20gXCJsb2Rhc2gvZmlsdGVyXCI7XG5pbXBvcnQgbWFwIGZyb20gXCJsb2Rhc2gvbWFwXCI7XG5pbXBvcnQge1xuICBBYnN0cmFjdENvbnRyb2wsXG4gIEZvcm1BcnJheSxcbiAgRm9ybUNvbnRyb2wsXG4gIEZvcm1Hcm91cCxcbiAgVmFsaWRhdG9yRm4sXG59IGZyb20gXCJAYW5ndWxhci9mb3Jtc1wiO1xuaW1wb3J0IHsgZm9yRWFjaCwgaGFzT3duIH0gZnJvbSBcIi4vdXRpbGl0eS5mdW5jdGlvbnNcIjtcbmltcG9ydCB7XG4gIGdldENvbnRyb2xWYWxpZGF0b3JzLFxuICByZW1vdmVSZWN1cnNpdmVSZWZlcmVuY2VzLFxufSBmcm9tIFwiLi9qc29uLXNjaGVtYS5mdW5jdGlvbnNcIjtcbmltcG9ydCB7XG4gIGhhc1ZhbHVlLFxuICBpbkFycmF5LFxuICBpc0FycmF5LFxuICBpc0RhdGUsXG4gIGlzRGVmaW5lZCxcbiAgaXNFbXB0eSxcbiAgaXNPYmplY3QsXG4gIGlzUHJpbWl0aXZlLFxuICBTY2hlbWFQcmltaXRpdmVUeXBlLFxuICB0b0phdmFTY3JpcHRUeXBlLFxuICB0b1NjaGVtYVR5cGUsXG59IGZyb20gXCIuL3ZhbGlkYXRvci5mdW5jdGlvbnNcIjtcbmltcG9ydCB7IEpzb25Qb2ludGVyLCBQb2ludGVyIH0gZnJvbSBcIi4vanNvbnBvaW50ZXIuZnVuY3Rpb25zXCI7XG5pbXBvcnQgeyBKc29uVmFsaWRhdG9ycyB9IGZyb20gXCIuL2pzb24udmFsaWRhdG9yc1wiO1xuXG4vKipcbiAqIEZvcm1Hcm91cCBmdW5jdGlvbiBsaWJyYXJ5OlxuICpcbiAqIGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGU6ICBCdWlsZHMgYSBGb3JtR3JvdXBUZW1wbGF0ZSBmcm9tIHNjaGVtYVxuICpcbiAqIGJ1aWxkRm9ybUdyb3VwOiAgICAgICAgICBCdWlsZHMgYW4gQW5ndWxhciBGb3JtR3JvdXAgZnJvbSBhIEZvcm1Hcm91cFRlbXBsYXRlXG4gKlxuICogbWVyZ2VWYWx1ZXM6XG4gKlxuICogc2V0UmVxdWlyZWRGaWVsZHM6XG4gKlxuICogZm9ybWF0Rm9ybURhdGE6XG4gKlxuICogZ2V0Q29udHJvbDpcbiAqXG4gKiAtLS0tIFRPRE86IC0tLS1cbiAqIFRPRE86IGFkZCBidWlsZEZvcm1Hcm91cFRlbXBsYXRlRnJvbUxheW91dCBmdW5jdGlvblxuICogYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZUZyb21MYXlvdXQ6IEJ1aWxkcyBhIEZvcm1Hcm91cFRlbXBsYXRlIGZyb20gYSBmb3JtIGxheW91dFxuICovXG5cbi8qKlxuICogJ2J1aWxkRm9ybUdyb3VwVGVtcGxhdGUnIGZ1bmN0aW9uXG4gKlxuICogQnVpbGRzIGEgdGVtcGxhdGUgZm9yIGFuIEFuZ3VsYXIgRm9ybUdyb3VwIGZyb20gYSBKU09OIFNjaGVtYS5cbiAqXG4gKiBUT0RPOiBhZGQgc3VwcG9ydCBmb3IgcGF0dGVybiBwcm9wZXJ0aWVzXG4gKiBodHRwczovL3NwYWNldGVsZXNjb3BlLmdpdGh1Yi5pby91bmRlcnN0YW5kaW5nLWpzb24tc2NoZW1hL3JlZmVyZW5jZS9vYmplY3QuaHRtbFxuICpcbiAqIC8vICB7YW55fSBqc2YgLVxuICogLy8gIHthbnkgPSBudWxsfSBub2RlVmFsdWUgLVxuICogLy8gIHtib29sZWFuID0gdHJ1ZX0gbWFwQXJyYXlzIC1cbiAqIC8vICB7c3RyaW5nID0gJyd9IHNjaGVtYVBvaW50ZXIgLVxuICogLy8gIHtzdHJpbmcgPSAnJ30gZGF0YVBvaW50ZXIgLVxuICogLy8gIHthbnkgPSAnJ30gdGVtcGxhdGVQb2ludGVyIC1cbiAqIC8vIHthbnl9IC1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGUoXG4gIGpzZjogYW55LFxuICBub2RlVmFsdWU6IGFueSA9IG51bGwsXG4gIHNldFZhbHVlcyA9IHRydWUsXG4gIHNjaGVtYVBvaW50ZXIgPSBcIlwiLFxuICBkYXRhUG9pbnRlciA9IFwiXCIsXG4gIHRlbXBsYXRlUG9pbnRlciA9IFwiXCJcbikge1xuICBjb25zdCBzY2hlbWEgPSBKc29uUG9pbnRlci5nZXQoanNmLnNjaGVtYSwgc2NoZW1hUG9pbnRlcik7XG4gIGlmIChzZXRWYWx1ZXMpIHtcbiAgICBpZiAoXG4gICAgICAhaXNEZWZpbmVkKG5vZGVWYWx1ZSkgJiZcbiAgICAgIChqc2YuZm9ybU9wdGlvbnMuc2V0U2NoZW1hRGVmYXVsdHMgPT09IHRydWUgfHxcbiAgICAgICAgKGpzZi5mb3JtT3B0aW9ucy5zZXRTY2hlbWFEZWZhdWx0cyA9PT0gXCJhdXRvXCIgJiZcbiAgICAgICAgICBpc0VtcHR5KGpzZi5mb3JtVmFsdWVzKSkpXG4gICAgKSB7XG4gICAgICBub2RlVmFsdWUgPSBKc29uUG9pbnRlci5nZXQoanNmLnNjaGVtYSwgc2NoZW1hUG9pbnRlciArIFwiL2RlZmF1bHRcIik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG5vZGVWYWx1ZSA9IG51bGw7XG4gIH1cbiAgLy8gVE9ETzogSWYgbm9kZVZhbHVlIHN0aWxsIG5vdCBzZXQsIGNoZWNrIGxheW91dCBmb3IgZGVmYXVsdCB2YWx1ZVxuICBjb25zdCBzY2hlbWFUeXBlOiBzdHJpbmcgfCBzdHJpbmdbXSA9IEpzb25Qb2ludGVyLmdldChzY2hlbWEsIFwiL3R5cGVcIik7XG4gIGNvbnN0IGNvbnRyb2xUeXBlID1cbiAgICAoaGFzT3duKHNjaGVtYSwgXCJwcm9wZXJ0aWVzXCIpIHx8IGhhc093bihzY2hlbWEsIFwiYWRkaXRpb25hbFByb3BlcnRpZXNcIikpICYmXG4gICAgc2NoZW1hVHlwZSA9PT0gXCJvYmplY3RcIlxuICAgICAgPyBcIkZvcm1Hcm91cFwiXG4gICAgICA6IChoYXNPd24oc2NoZW1hLCBcIml0ZW1zXCIpIHx8IGhhc093bihzY2hlbWEsIFwiYWRkaXRpb25hbEl0ZW1zXCIpKSAmJlxuICAgICAgICBzY2hlbWFUeXBlID09PSBcImFycmF5XCJcbiAgICAgID8gXCJGb3JtQXJyYXlcIlxuICAgICAgOiAhc2NoZW1hVHlwZSAmJiBoYXNPd24oc2NoZW1hLCBcIiRyZWZcIilcbiAgICAgID8gXCIkcmVmXCJcbiAgICAgIDogXCJGb3JtQ29udHJvbFwiO1xuICBjb25zdCBzaG9ydERhdGFQb2ludGVyID0gcmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlcyhcbiAgICBkYXRhUG9pbnRlcixcbiAgICBqc2YuZGF0YVJlY3Vyc2l2ZVJlZk1hcCxcbiAgICBqc2YuYXJyYXlNYXBcbiAgKTtcbiAgaWYgKCFqc2YuZGF0YU1hcC5oYXMoc2hvcnREYXRhUG9pbnRlcikpIHtcbiAgICBqc2YuZGF0YU1hcC5zZXQoc2hvcnREYXRhUG9pbnRlciwgbmV3IE1hcCgpKTtcbiAgfVxuICBjb25zdCBub2RlT3B0aW9ucyA9IGpzZi5kYXRhTWFwLmdldChzaG9ydERhdGFQb2ludGVyKTtcbiAgaWYgKCFub2RlT3B0aW9ucy5oYXMoXCJzY2hlbWFUeXBlXCIpKSB7XG4gICAgbm9kZU9wdGlvbnMuc2V0KFwic2NoZW1hUG9pbnRlclwiLCBzY2hlbWFQb2ludGVyKTtcbiAgICBub2RlT3B0aW9ucy5zZXQoXCJzY2hlbWFUeXBlXCIsIHNjaGVtYS50eXBlKTtcbiAgICBpZiAoc2NoZW1hLmZvcm1hdCkge1xuICAgICAgbm9kZU9wdGlvbnMuc2V0KFwic2NoZW1hRm9ybWF0XCIsIHNjaGVtYS5mb3JtYXQpO1xuICAgICAgaWYgKCFzY2hlbWEudHlwZSkge1xuICAgICAgICBub2RlT3B0aW9ucy5zZXQoXCJzY2hlbWFUeXBlXCIsIFwic3RyaW5nXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoY29udHJvbFR5cGUpIHtcbiAgICAgIG5vZGVPcHRpb25zLnNldChcInRlbXBsYXRlUG9pbnRlclwiLCB0ZW1wbGF0ZVBvaW50ZXIpO1xuICAgICAgbm9kZU9wdGlvbnMuc2V0KFwidGVtcGxhdGVUeXBlXCIsIGNvbnRyb2xUeXBlKTtcbiAgICB9XG4gIH1cbiAgbGV0IGNvbnRyb2xzOiBhbnk7XG4gIGNvbnN0IHZhbGlkYXRvcnMgPSBnZXRDb250cm9sVmFsaWRhdG9ycyhzY2hlbWEpO1xuICBzd2l0Y2ggKGNvbnRyb2xUeXBlKSB7XG4gICAgY2FzZSBcIkZvcm1Hcm91cFwiOlxuICAgICAgY29udHJvbHMgPSB7fTtcbiAgICAgIGlmIChoYXNPd24oc2NoZW1hLCBcInVpOm9yZGVyXCIpIHx8IGhhc093bihzY2hlbWEsIFwicHJvcGVydGllc1wiKSkge1xuICAgICAgICBjb25zdCBwcm9wZXJ0eUtleXMgPVxuICAgICAgICAgIHNjaGVtYVtcInVpOm9yZGVyXCJdIHx8IE9iamVjdC5rZXlzKHNjaGVtYS5wcm9wZXJ0aWVzKTtcbiAgICAgICAgaWYgKHByb3BlcnR5S2V5cy5pbmNsdWRlcyhcIipcIikgJiYgIWhhc093bihzY2hlbWEucHJvcGVydGllcywgXCIqXCIpKSB7XG4gICAgICAgICAgY29uc3QgdW5uYW1lZEtleXMgPSBPYmplY3Qua2V5cyhzY2hlbWEucHJvcGVydGllcykuZmlsdGVyKFxuICAgICAgICAgICAgKGtleSkgPT4gIXByb3BlcnR5S2V5cy5pbmNsdWRlcyhrZXkpXG4gICAgICAgICAgKTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gcHJvcGVydHlLZXlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAocHJvcGVydHlLZXlzW2ldID09PSBcIipcIikge1xuICAgICAgICAgICAgICBwcm9wZXJ0eUtleXMuc3BsaWNlKGksIDEsIC4uLnVubmFtZWRLZXlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcHJvcGVydHlLZXlzXG4gICAgICAgICAgLmZpbHRlcihcbiAgICAgICAgICAgIChrZXkpID0+XG4gICAgICAgICAgICAgIGhhc093bihzY2hlbWEucHJvcGVydGllcywga2V5KSB8fFxuICAgICAgICAgICAgICBoYXNPd24oc2NoZW1hLCBcImFkZGl0aW9uYWxQcm9wZXJ0aWVzXCIpXG4gICAgICAgICAgKVxuICAgICAgICAgIC5mb3JFYWNoKFxuICAgICAgICAgICAgKGtleSkgPT5cbiAgICAgICAgICAgICAgKGNvbnRyb2xzW2tleV0gPSBidWlsZEZvcm1Hcm91cFRlbXBsYXRlKFxuICAgICAgICAgICAgICAgIGpzZixcbiAgICAgICAgICAgICAgICBKc29uUG9pbnRlci5nZXQobm9kZVZhbHVlLCBbPHN0cmluZz5rZXldKSxcbiAgICAgICAgICAgICAgICBzZXRWYWx1ZXMsXG4gICAgICAgICAgICAgICAgc2NoZW1hUG9pbnRlciArXG4gICAgICAgICAgICAgICAgICAoaGFzT3duKHNjaGVtYS5wcm9wZXJ0aWVzLCBrZXkpXG4gICAgICAgICAgICAgICAgICAgID8gXCIvcHJvcGVydGllcy9cIiArIGtleVxuICAgICAgICAgICAgICAgICAgICA6IFwiL2FkZGl0aW9uYWxQcm9wZXJ0aWVzXCIpLFxuICAgICAgICAgICAgICAgIGRhdGFQb2ludGVyICsgXCIvXCIgKyBrZXksXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVQb2ludGVyICsgXCIvY29udHJvbHMvXCIgKyBrZXlcbiAgICAgICAgICAgICAgKSlcbiAgICAgICAgICApO1xuICAgICAgICBqc2YuZm9ybU9wdGlvbnMuZmllbGRzUmVxdWlyZWQgPSBzZXRSZXF1aXJlZEZpZWxkcyhzY2hlbWEsIGNvbnRyb2xzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7IGNvbnRyb2xUeXBlLCBjb250cm9scywgdmFsaWRhdG9ycyB9O1xuXG4gICAgY2FzZSBcIkZvcm1BcnJheVwiOlxuICAgICAgY29udHJvbHMgPSBbXTtcbiAgICAgIGNvbnN0IG1pbkl0ZW1zID0gTWF0aC5tYXgoXG4gICAgICAgIHNjaGVtYS5taW5JdGVtcyB8fCAwLFxuICAgICAgICBub2RlT3B0aW9ucy5nZXQoXCJtaW5JdGVtc1wiKSB8fCAwXG4gICAgICApO1xuICAgICAgY29uc3QgbWF4SXRlbXMgPSBNYXRoLm1pbihcbiAgICAgICAgc2NoZW1hLm1heEl0ZW1zIHx8IDEwMDAsXG4gICAgICAgIG5vZGVPcHRpb25zLmdldChcIm1heEl0ZW1zXCIpIHx8IDEwMDBcbiAgICAgICk7XG4gICAgICBsZXQgYWRkaXRpb25hbEl0ZW1zUG9pbnRlcjogc3RyaW5nID0gbnVsbDtcbiAgICAgIGlmIChpc0FycmF5KHNjaGVtYS5pdGVtcykpIHtcbiAgICAgICAgLy8gJ2l0ZW1zJyBpcyBhbiBhcnJheSA9IHR1cGxlIGl0ZW1zXG4gICAgICAgIGNvbnN0IHR1cGxlSXRlbXMgPVxuICAgICAgICAgIG5vZGVPcHRpb25zLmdldChcInR1cGxlSXRlbXNcIikgfHxcbiAgICAgICAgICAoaXNBcnJheShzY2hlbWEuaXRlbXMpID8gTWF0aC5taW4oc2NoZW1hLml0ZW1zLmxlbmd0aCwgbWF4SXRlbXMpIDogMCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHVwbGVJdGVtczsgaSsrKSB7XG4gICAgICAgICAgaWYgKGkgPCBtaW5JdGVtcykge1xuICAgICAgICAgICAgY29udHJvbHMucHVzaChcbiAgICAgICAgICAgICAgYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZShcbiAgICAgICAgICAgICAgICBqc2YsXG4gICAgICAgICAgICAgICAgaXNBcnJheShub2RlVmFsdWUpID8gbm9kZVZhbHVlW2ldIDogbm9kZVZhbHVlLFxuICAgICAgICAgICAgICAgIHNldFZhbHVlcyxcbiAgICAgICAgICAgICAgICBzY2hlbWFQb2ludGVyICsgXCIvaXRlbXMvXCIgKyBpLFxuICAgICAgICAgICAgICAgIGRhdGFQb2ludGVyICsgXCIvXCIgKyBpLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlUG9pbnRlciArIFwiL2NvbnRyb2xzL1wiICsgaVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBzY2hlbWFSZWZQb2ludGVyID0gcmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlcyhcbiAgICAgICAgICAgICAgc2NoZW1hUG9pbnRlciArIFwiL2l0ZW1zL1wiICsgaSxcbiAgICAgICAgICAgICAganNmLnNjaGVtYVJlY3Vyc2l2ZVJlZk1hcFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1SZWZQb2ludGVyID0gcmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlcyhcbiAgICAgICAgICAgICAgc2hvcnREYXRhUG9pbnRlciArIFwiL1wiICsgaSxcbiAgICAgICAgICAgICAganNmLmRhdGFSZWN1cnNpdmVSZWZNYXAsXG4gICAgICAgICAgICAgIGpzZi5hcnJheU1hcFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1SZWN1cnNpdmUgPSBpdGVtUmVmUG9pbnRlciAhPT0gc2hvcnREYXRhUG9pbnRlciArIFwiL1wiICsgaTtcbiAgICAgICAgICAgIGlmICghaGFzT3duKGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnksIGl0ZW1SZWZQb2ludGVyKSkge1xuICAgICAgICAgICAgICBqc2YudGVtcGxhdGVSZWZMaWJyYXJ5W2l0ZW1SZWZQb2ludGVyXSA9IG51bGw7XG4gICAgICAgICAgICAgIGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnlbaXRlbVJlZlBvaW50ZXJdID0gYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZShcbiAgICAgICAgICAgICAgICBqc2YsXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICBzZXRWYWx1ZXMsXG4gICAgICAgICAgICAgICAgc2NoZW1hUmVmUG9pbnRlcixcbiAgICAgICAgICAgICAgICBpdGVtUmVmUG9pbnRlcixcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVBvaW50ZXIgKyBcIi9jb250cm9scy9cIiArIGlcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRyb2xzLnB1c2goXG4gICAgICAgICAgICAgIGlzQXJyYXkobm9kZVZhbHVlKVxuICAgICAgICAgICAgICAgID8gYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZShcbiAgICAgICAgICAgICAgICAgICAganNmLFxuICAgICAgICAgICAgICAgICAgICBub2RlVmFsdWVbaV0sXG4gICAgICAgICAgICAgICAgICAgIHNldFZhbHVlcyxcbiAgICAgICAgICAgICAgICAgICAgc2NoZW1hUG9pbnRlciArIFwiL2l0ZW1zL1wiICsgaSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YVBvaW50ZXIgKyBcIi9cIiArIGksXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlUG9pbnRlciArIFwiL2NvbnRyb2xzL1wiICsgaVxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIDogaXRlbVJlY3Vyc2l2ZVxuICAgICAgICAgICAgICAgID8gbnVsbFxuICAgICAgICAgICAgICAgIDogY2xvbmVEZWVwKGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnlbaXRlbVJlZlBvaW50ZXJdKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiAnYWRkaXRpb25hbEl0ZW1zJyBpcyBhbiBvYmplY3QgPSBhZGRpdGlvbmFsIGxpc3QgaXRlbXMgKGFmdGVyIHR1cGxlIGl0ZW1zKVxuICAgICAgICBpZiAoXG4gICAgICAgICAgc2NoZW1hLml0ZW1zLmxlbmd0aCA8IG1heEl0ZW1zICYmXG4gICAgICAgICAgaXNPYmplY3Qoc2NoZW1hLmFkZGl0aW9uYWxJdGVtcylcbiAgICAgICAgKSB7XG4gICAgICAgICAgYWRkaXRpb25hbEl0ZW1zUG9pbnRlciA9IHNjaGVtYVBvaW50ZXIgKyBcIi9hZGRpdGlvbmFsSXRlbXNcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmICdpdGVtcycgaXMgYW4gb2JqZWN0ID0gbGlzdCBpdGVtcyBvbmx5IChubyB0dXBsZSBpdGVtcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFkZGl0aW9uYWxJdGVtc1BvaW50ZXIgPSBzY2hlbWFQb2ludGVyICsgXCIvaXRlbXNcIjtcbiAgICAgIH1cblxuICAgICAgaWYgKGFkZGl0aW9uYWxJdGVtc1BvaW50ZXIpIHtcbiAgICAgICAgY29uc3Qgc2NoZW1hUmVmUG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoXG4gICAgICAgICAgYWRkaXRpb25hbEl0ZW1zUG9pbnRlcixcbiAgICAgICAgICBqc2Yuc2NoZW1hUmVjdXJzaXZlUmVmTWFwXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGl0ZW1SZWZQb2ludGVyID0gcmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlcyhcbiAgICAgICAgICBzaG9ydERhdGFQb2ludGVyICsgXCIvLVwiLFxuICAgICAgICAgIGpzZi5kYXRhUmVjdXJzaXZlUmVmTWFwLFxuICAgICAgICAgIGpzZi5hcnJheU1hcFxuICAgICAgICApO1xuICAgICAgICBjb25zdCBpdGVtUmVjdXJzaXZlID0gaXRlbVJlZlBvaW50ZXIgIT09IHNob3J0RGF0YVBvaW50ZXIgKyBcIi8tXCI7XG4gICAgICAgIGlmICghaGFzT3duKGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnksIGl0ZW1SZWZQb2ludGVyKSkge1xuICAgICAgICAgIGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnlbaXRlbVJlZlBvaW50ZXJdID0gbnVsbDtcbiAgICAgICAgICBqc2YudGVtcGxhdGVSZWZMaWJyYXJ5W2l0ZW1SZWZQb2ludGVyXSA9IGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGUoXG4gICAgICAgICAgICBqc2YsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgc2V0VmFsdWVzLFxuICAgICAgICAgICAgc2NoZW1hUmVmUG9pbnRlcixcbiAgICAgICAgICAgIGl0ZW1SZWZQb2ludGVyLFxuICAgICAgICAgICAgdGVtcGxhdGVQb2ludGVyICsgXCIvY29udHJvbHMvLVwiXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zdCBpdGVtT3B0aW9ucyA9IGpzZi5kYXRhTWFwLmdldChpdGVtUmVmUG9pbnRlcikgfHwgbmV3IE1hcCgpO1xuICAgICAgICBjb25zdCBpdGVtT3B0aW9ucyA9IG5vZGVPcHRpb25zO1xuICAgICAgICBpZiAoIWl0ZW1SZWN1cnNpdmUgfHwgaGFzT3duKHZhbGlkYXRvcnMsIFwicmVxdWlyZWRcIikpIHtcbiAgICAgICAgICBjb25zdCBhcnJheUxlbmd0aCA9IE1hdGgubWluKFxuICAgICAgICAgICAgTWF0aC5tYXgoXG4gICAgICAgICAgICAgIGl0ZW1SZWN1cnNpdmVcbiAgICAgICAgICAgICAgICA/IDBcbiAgICAgICAgICAgICAgICA6IGl0ZW1PcHRpb25zLmdldChcInR1cGxlSXRlbXNcIikgK1xuICAgICAgICAgICAgICAgICAgICBpdGVtT3B0aW9ucy5nZXQoXCJsaXN0SXRlbXNcIikgfHwgMCxcbiAgICAgICAgICAgICAgaXNBcnJheShub2RlVmFsdWUpID8gbm9kZVZhbHVlLmxlbmd0aCA6IDBcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBtYXhJdGVtc1xuICAgICAgICAgICk7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IGNvbnRyb2xzLmxlbmd0aDsgaSA8IGFycmF5TGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnRyb2xzLnB1c2goXG4gICAgICAgICAgICAgIGlzQXJyYXkobm9kZVZhbHVlKVxuICAgICAgICAgICAgICAgID8gYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZShcbiAgICAgICAgICAgICAgICAgICAganNmLFxuICAgICAgICAgICAgICAgICAgICBub2RlVmFsdWVbaV0sXG4gICAgICAgICAgICAgICAgICAgIHNldFZhbHVlcyxcbiAgICAgICAgICAgICAgICAgICAgc2NoZW1hUmVmUG9pbnRlcixcbiAgICAgICAgICAgICAgICAgICAgZGF0YVBvaW50ZXIgKyBcIi8tXCIsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlUG9pbnRlciArIFwiL2NvbnRyb2xzLy1cIlxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIDogaXRlbVJlY3Vyc2l2ZVxuICAgICAgICAgICAgICAgID8gbnVsbFxuICAgICAgICAgICAgICAgIDogY2xvbmVEZWVwKGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnlbaXRlbVJlZlBvaW50ZXJdKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB7IGNvbnRyb2xUeXBlLCBjb250cm9scywgdmFsaWRhdG9ycyB9O1xuXG4gICAgY2FzZSBcIiRyZWZcIjpcbiAgICAgIGNvbnN0IHNjaGVtYVJlZiA9IEpzb25Qb2ludGVyLmNvbXBpbGUoc2NoZW1hLiRyZWYpO1xuICAgICAgY29uc3QgZGF0YVJlZiA9IEpzb25Qb2ludGVyLnRvRGF0YVBvaW50ZXIoc2NoZW1hUmVmLCBzY2hlbWEpO1xuICAgICAgY29uc3QgcmVmUG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoXG4gICAgICAgIGRhdGFSZWYsXG4gICAgICAgIGpzZi5kYXRhUmVjdXJzaXZlUmVmTWFwLFxuICAgICAgICBqc2YuYXJyYXlNYXBcbiAgICAgICk7XG4gICAgICBpZiAocmVmUG9pbnRlciAmJiAhaGFzT3duKGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnksIHJlZlBvaW50ZXIpKSB7XG4gICAgICAgIC8vIFNldCB0byBudWxsIGZpcnN0IHRvIHByZXZlbnQgcmVjdXJzaXZlIHJlZmVyZW5jZSBmcm9tIGNhdXNpbmcgZW5kbGVzcyBsb29wXG4gICAgICAgIGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnlbcmVmUG9pbnRlcl0gPSBudWxsO1xuICAgICAgICBjb25zdCBuZXdUZW1wbGF0ZSA9IGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGUoXG4gICAgICAgICAganNmLFxuICAgICAgICAgIHNldFZhbHVlcyxcbiAgICAgICAgICBzZXRWYWx1ZXMsXG4gICAgICAgICAgc2NoZW1hUmVmXG4gICAgICAgICk7XG4gICAgICAgIGlmIChuZXdUZW1wbGF0ZSkge1xuICAgICAgICAgIGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnlbcmVmUG9pbnRlcl0gPSBuZXdUZW1wbGF0ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUganNmLnRlbXBsYXRlUmVmTGlicmFyeVtyZWZQb2ludGVyXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICBjYXNlIFwiRm9ybUNvbnRyb2xcIjpcbiAgICAgIGNvbnN0IHZhbHVlID0ge1xuICAgICAgICB2YWx1ZTogc2V0VmFsdWVzICYmIGlzUHJpbWl0aXZlKG5vZGVWYWx1ZSkgPyBub2RlVmFsdWUgOiBudWxsLFxuICAgICAgICBkaXNhYmxlZDogbm9kZU9wdGlvbnMuZ2V0KFwiZGlzYWJsZWRcIikgfHwgZmFsc2UsXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHsgY29udHJvbFR5cGUsIHZhbHVlLCB2YWxpZGF0b3JzIH07XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiAnYnVpbGRGb3JtR3JvdXAnIGZ1bmN0aW9uXG4gKlxuICogLy8ge2FueX0gdGVtcGxhdGUgLVxuICogLy8ge0Fic3RyYWN0Q29udHJvbH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRm9ybUdyb3VwKHRlbXBsYXRlOiBhbnkpOiBBYnN0cmFjdENvbnRyb2wge1xuICBjb25zdCB2YWxpZGF0b3JGbnM6IFZhbGlkYXRvckZuW10gPSBbXTtcbiAgbGV0IHZhbGlkYXRvckZuOiBWYWxpZGF0b3JGbiA9IG51bGw7XG4gIC8vIGlmIChoYXNPd24odGVtcGxhdGUsIFwidmFsaWRhdG9yc1wiKSkge1xuICAvLyAgIGZvckVhY2godGVtcGxhdGUudmFsaWRhdG9ycywgKHBhcmFtZXRlcnMsIHZhbGlkYXRvcikgPT4ge1xuICAvLyAgICAgaWYgKHR5cGVvZiBKc29uVmFsaWRhdG9yc1t2YWxpZGF0b3JdID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgLy8gICAgICAgdmFsaWRhdG9yRm5zLnB1c2goSnNvblZhbGlkYXRvcnNbdmFsaWRhdG9yXS5hcHBseShudWxsLCBwYXJhbWV0ZXJzKSk7XG4gIC8vICAgICB9XG4gIC8vICAgfSk7XG4gIC8vICAgaWYgKFxuICAvLyAgICAgdmFsaWRhdG9yRm5zLmxlbmd0aCAmJlxuICAvLyAgICAgaW5BcnJheSh0ZW1wbGF0ZS5jb250cm9sVHlwZSwgW1wiRm9ybUdyb3VwXCIsIFwiRm9ybUFycmF5XCJdKVxuICAvLyAgICkge1xuICAvLyAgICAgdmFsaWRhdG9yRm4gPVxuICAvLyAgICAgICB2YWxpZGF0b3JGbnMubGVuZ3RoID4gMVxuICAvLyAgICAgICAgID8gSnNvblZhbGlkYXRvcnMuY29tcG9zZSh2YWxpZGF0b3JGbnMpXG4gIC8vICAgICAgICAgOiB2YWxpZGF0b3JGbnNbMF07XG4gIC8vICAgfVxuICAvLyB9XG4gIGlmIChoYXNPd24odGVtcGxhdGUsIFwiY29udHJvbFR5cGVcIikpIHtcbiAgICBzd2l0Y2ggKHRlbXBsYXRlLmNvbnRyb2xUeXBlKSB7XG4gICAgICBjYXNlIFwiRm9ybUdyb3VwXCI6XG4gICAgICAgIGNvbnN0IGdyb3VwQ29udHJvbHM6IHsgW2tleTogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sIH0gPSB7fTtcbiAgICAgICAgZm9yRWFjaCh0ZW1wbGF0ZS5jb250cm9scywgKGNvbnRyb2xzLCBrZXkpID0+IHtcbiAgICAgICAgICBjb25zdCBuZXdDb250cm9sOiBBYnN0cmFjdENvbnRyb2wgPSBidWlsZEZvcm1Hcm91cChjb250cm9scyk7XG4gICAgICAgICAgaWYgKG5ld0NvbnRyb2wpIHtcbiAgICAgICAgICAgIGdyb3VwQ29udHJvbHNba2V5XSA9IG5ld0NvbnRyb2w7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG5ldyBGb3JtR3JvdXAoZ3JvdXBDb250cm9scywgdmFsaWRhdG9yRm4pO1xuICAgICAgY2FzZSBcIkZvcm1BcnJheVwiOlxuICAgICAgICByZXR1cm4gbmV3IEZvcm1BcnJheShcbiAgICAgICAgICBmaWx0ZXIoXG4gICAgICAgICAgICBtYXAodGVtcGxhdGUuY29udHJvbHMsIChjb250cm9scykgPT4gYnVpbGRGb3JtR3JvdXAoY29udHJvbHMpKVxuICAgICAgICAgICksXG4gICAgICAgICAgdmFsaWRhdG9yRm5cbiAgICAgICAgKTtcbiAgICAgIGNhc2UgXCJGb3JtQ29udHJvbFwiOlxuICAgICAgICByZXR1cm4gbmV3IEZvcm1Db250cm9sKHRlbXBsYXRlLnZhbHVlLCB2YWxpZGF0b3JGbnMpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiAnbWVyZ2VWYWx1ZXMnIGZ1bmN0aW9uXG4gKlxuICogLy8gIHthbnlbXX0gLi4udmFsdWVzVG9NZXJnZSAtIE11bHRpcGxlIHZhbHVlcyB0byBtZXJnZVxuICogLy8ge2FueX0gLSBNZXJnZWQgdmFsdWVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVZhbHVlcyguLi52YWx1ZXNUb01lcmdlKSB7XG4gIGxldCBtZXJnZWRWYWx1ZXM6IGFueSA9IG51bGw7XG4gIGZvciAoY29uc3QgY3VycmVudFZhbHVlIG9mIHZhbHVlc1RvTWVyZ2UpIHtcbiAgICBpZiAoIWlzRW1wdHkoY3VycmVudFZhbHVlKSkge1xuICAgICAgaWYgKFxuICAgICAgICB0eXBlb2YgY3VycmVudFZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgIChpc0VtcHR5KG1lcmdlZFZhbHVlcykgfHwgdHlwZW9mIG1lcmdlZFZhbHVlcyAhPT0gXCJvYmplY3RcIilcbiAgICAgICkge1xuICAgICAgICBpZiAoaXNBcnJheShjdXJyZW50VmFsdWUpKSB7XG4gICAgICAgICAgbWVyZ2VkVmFsdWVzID0gWy4uLmN1cnJlbnRWYWx1ZV07XG4gICAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3QoY3VycmVudFZhbHVlKSkge1xuICAgICAgICAgIG1lcmdlZFZhbHVlcyA9IHsgLi4uY3VycmVudFZhbHVlIH07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGN1cnJlbnRWYWx1ZSAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICBtZXJnZWRWYWx1ZXMgPSBjdXJyZW50VmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KG1lcmdlZFZhbHVlcykgJiYgaXNPYmplY3QoY3VycmVudFZhbHVlKSkge1xuICAgICAgICBPYmplY3QuYXNzaWduKG1lcmdlZFZhbHVlcywgY3VycmVudFZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3QobWVyZ2VkVmFsdWVzKSAmJiBpc0FycmF5KGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWVzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgY3VycmVudFZhbHVlKSB7XG4gICAgICAgICAgbmV3VmFsdWVzLnB1c2gobWVyZ2VWYWx1ZXMobWVyZ2VkVmFsdWVzLCB2YWx1ZSkpO1xuICAgICAgICB9XG4gICAgICAgIG1lcmdlZFZhbHVlcyA9IG5ld1ZhbHVlcztcbiAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShtZXJnZWRWYWx1ZXMpICYmIGlzT2JqZWN0KGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWVzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgbWVyZ2VkVmFsdWVzKSB7XG4gICAgICAgICAgbmV3VmFsdWVzLnB1c2gobWVyZ2VWYWx1ZXModmFsdWUsIGN1cnJlbnRWYWx1ZSkpO1xuICAgICAgICB9XG4gICAgICAgIG1lcmdlZFZhbHVlcyA9IG5ld1ZhbHVlcztcbiAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShtZXJnZWRWYWx1ZXMpICYmIGlzQXJyYXkoY3VycmVudFZhbHVlKSkge1xuICAgICAgICBjb25zdCBuZXdWYWx1ZXMgPSBbXTtcbiAgICAgICAgZm9yIChcbiAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgaSA8IE1hdGgubWF4KG1lcmdlZFZhbHVlcy5sZW5ndGgsIGN1cnJlbnRWYWx1ZS5sZW5ndGgpO1xuICAgICAgICAgIGkrK1xuICAgICAgICApIHtcbiAgICAgICAgICBpZiAoaSA8IG1lcmdlZFZhbHVlcy5sZW5ndGggJiYgaSA8IGN1cnJlbnRWYWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIG5ld1ZhbHVlcy5wdXNoKG1lcmdlVmFsdWVzKG1lcmdlZFZhbHVlc1tpXSwgY3VycmVudFZhbHVlW2ldKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChpIDwgbWVyZ2VkVmFsdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgbmV3VmFsdWVzLnB1c2gobWVyZ2VkVmFsdWVzW2ldKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGkgPCBjdXJyZW50VmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICBuZXdWYWx1ZXMucHVzaChjdXJyZW50VmFsdWVbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBtZXJnZWRWYWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBtZXJnZWRWYWx1ZXM7XG59XG5cbi8qKlxuICogJ3NldFJlcXVpcmVkRmllbGRzJyBmdW5jdGlvblxuICpcbiAqIC8vIHtzY2hlbWF9IHNjaGVtYSAtIEpTT04gU2NoZW1hXG4gKiAvLyB7b2JqZWN0fSBmb3JtQ29udHJvbFRlbXBsYXRlIC0gRm9ybSBDb250cm9sIFRlbXBsYXRlIG9iamVjdFxuICogLy8ge2Jvb2xlYW59IC0gdHJ1ZSBpZiBhbnkgZmllbGRzIGhhdmUgYmVlbiBzZXQgdG8gcmVxdWlyZWQsIGZhbHNlIGlmIG5vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0UmVxdWlyZWRGaWVsZHMoXG4gIHNjaGVtYTogYW55LFxuICBmb3JtQ29udHJvbFRlbXBsYXRlOiBhbnlcbik6IGJvb2xlYW4ge1xuICBsZXQgZmllbGRzUmVxdWlyZWQgPSBmYWxzZTtcbiAgaWYgKGhhc093bihzY2hlbWEsIFwicmVxdWlyZWRcIikgJiYgIWlzRW1wdHkoc2NoZW1hLnJlcXVpcmVkKSkge1xuICAgIGZpZWxkc1JlcXVpcmVkID0gdHJ1ZTtcbiAgICBsZXQgcmVxdWlyZWRBcnJheSA9IGlzQXJyYXkoc2NoZW1hLnJlcXVpcmVkKVxuICAgICAgPyBzY2hlbWEucmVxdWlyZWRcbiAgICAgIDogW3NjaGVtYS5yZXF1aXJlZF07XG4gICAgcmVxdWlyZWRBcnJheSA9IGZvckVhY2gocmVxdWlyZWRBcnJheSwgKGtleSkgPT5cbiAgICAgIEpzb25Qb2ludGVyLnNldChcbiAgICAgICAgZm9ybUNvbnRyb2xUZW1wbGF0ZSxcbiAgICAgICAgXCIvXCIgKyBrZXkgKyBcIi92YWxpZGF0b3JzL3JlcXVpcmVkXCIsXG4gICAgICAgIFtdXG4gICAgICApXG4gICAgKTtcbiAgfVxuICByZXR1cm4gZmllbGRzUmVxdWlyZWQ7XG5cbiAgLy8gVE9ETzogQWRkIHN1cHBvcnQgZm9yIHBhdHRlcm5Qcm9wZXJ0aWVzXG4gIC8vIGh0dHBzOi8vc3BhY2V0ZWxlc2NvcGUuZ2l0aHViLmlvL3VuZGVyc3RhbmRpbmctanNvbi1zY2hlbWEvcmVmZXJlbmNlL29iamVjdC5odG1sI3BhdHRlcm4tcHJvcGVydGllc1xufVxuXG4vKipcbiAqICdmb3JtYXRGb3JtRGF0YScgZnVuY3Rpb25cbiAqXG4gKiAvLyB7YW55fSBmb3JtRGF0YSAtIEFuZ3VsYXIgRm9ybUdyb3VwIGRhdGEgb2JqZWN0XG4gKiAvLyB7TWFwPHN0cmluZywgYW55Pn0gZGF0YU1hcCAtXG4gKiAvLyB7TWFwPHN0cmluZywgc3RyaW5nPn0gcmVjdXJzaXZlUmVmTWFwIC1cbiAqIC8vIHtNYXA8c3RyaW5nLCBudW1iZXI+fSBhcnJheU1hcCAtXG4gKiAvLyB7Ym9vbGVhbiA9IGZhbHNlfSBmaXhFcnJvcnMgLSBpZiBUUlVFLCB0cmllcyB0byBmaXggZGF0YVxuICogLy8ge2FueX0gLSBmb3JtYXR0ZWQgZGF0YSBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdEZvcm1EYXRhKFxuICBmb3JtRGF0YTogYW55LFxuICBkYXRhTWFwOiBNYXA8c3RyaW5nLCBhbnk+LFxuICByZWN1cnNpdmVSZWZNYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4sXG4gIGFycmF5TWFwOiBNYXA8c3RyaW5nLCBudW1iZXI+LFxuICByZXR1cm5FbXB0eUZpZWxkcyA9IGZhbHNlLFxuICBmaXhFcnJvcnMgPSBmYWxzZVxuKTogYW55IHtcbiAgaWYgKGZvcm1EYXRhID09PSBudWxsIHx8IHR5cGVvZiBmb3JtRGF0YSAhPT0gXCJvYmplY3RcIikge1xuICAgIHJldHVybiBmb3JtRGF0YTtcbiAgfVxuICBjb25zdCBmb3JtYXR0ZWREYXRhID0gaXNBcnJheShmb3JtRGF0YSkgPyBbXSA6IHt9O1xuICBKc29uUG9pbnRlci5mb3JFYWNoRGVlcChmb3JtRGF0YSwgKHZhbHVlLCBkYXRhUG9pbnRlcikgPT4ge1xuICAgIC8vIElmIHJldHVybkVtcHR5RmllbGRzID09PSB0cnVlLFxuICAgIC8vIGFkZCBlbXB0eSBhcnJheXMgYW5kIG9iamVjdHMgdG8gYWxsIGFsbG93ZWQga2V5c1xuICAgIGlmIChyZXR1cm5FbXB0eUZpZWxkcyAmJiBpc0FycmF5KHZhbHVlKSkge1xuICAgICAgSnNvblBvaW50ZXIuc2V0KGZvcm1hdHRlZERhdGEsIGRhdGFQb2ludGVyLCBbXSk7XG4gICAgfSBlbHNlIGlmIChyZXR1cm5FbXB0eUZpZWxkcyAmJiBpc09iamVjdCh2YWx1ZSkgJiYgIWlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIEpzb25Qb2ludGVyLnNldChmb3JtYXR0ZWREYXRhLCBkYXRhUG9pbnRlciwge30pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBnZW5lcmljUG9pbnRlciA9IEpzb25Qb2ludGVyLmhhcyhkYXRhTWFwLCBbXG4gICAgICAgIGRhdGFQb2ludGVyLFxuICAgICAgICBcInNjaGVtYVR5cGVcIixcbiAgICAgIF0pXG4gICAgICAgID8gZGF0YVBvaW50ZXJcbiAgICAgICAgOiByZW1vdmVSZWN1cnNpdmVSZWZlcmVuY2VzKGRhdGFQb2ludGVyLCByZWN1cnNpdmVSZWZNYXAsIGFycmF5TWFwKTtcbiAgICAgIGlmIChKc29uUG9pbnRlci5oYXMoZGF0YU1hcCwgW2dlbmVyaWNQb2ludGVyLCBcInNjaGVtYVR5cGVcIl0pKSB7XG4gICAgICAgIGNvbnN0IHNjaGVtYVR5cGU6XG4gICAgICAgICAgfCBTY2hlbWFQcmltaXRpdmVUeXBlXG4gICAgICAgICAgfCBTY2hlbWFQcmltaXRpdmVUeXBlW10gPSBkYXRhTWFwXG4gICAgICAgICAgLmdldChnZW5lcmljUG9pbnRlcilcbiAgICAgICAgICAuZ2V0KFwic2NoZW1hVHlwZVwiKTtcbiAgICAgICAgaWYgKHNjaGVtYVR5cGUgPT09IFwibnVsbFwiKSB7XG4gICAgICAgICAgSnNvblBvaW50ZXIuc2V0KGZvcm1hdHRlZERhdGEsIGRhdGFQb2ludGVyLCBudWxsKTtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAoaGFzVmFsdWUodmFsdWUpIHx8IHJldHVybkVtcHR5RmllbGRzKSAmJlxuICAgICAgICAgIGluQXJyYXkoc2NoZW1hVHlwZSwgW1wic3RyaW5nXCIsIFwiaW50ZWdlclwiLCBcIm51bWJlclwiLCBcImJvb2xlYW5cIl0pXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnN0IG5ld1ZhbHVlID1cbiAgICAgICAgICAgIGZpeEVycm9ycyB8fCAodmFsdWUgPT09IG51bGwgJiYgcmV0dXJuRW1wdHlGaWVsZHMpXG4gICAgICAgICAgICAgID8gdG9TY2hlbWFUeXBlKHZhbHVlLCBzY2hlbWFUeXBlKVxuICAgICAgICAgICAgICA6IHRvSmF2YVNjcmlwdFR5cGUodmFsdWUsIHNjaGVtYVR5cGUpO1xuICAgICAgICAgIGlmIChpc0RlZmluZWQobmV3VmFsdWUpIHx8IHJldHVybkVtcHR5RmllbGRzKSB7XG4gICAgICAgICAgICBKc29uUG9pbnRlci5zZXQoZm9ybWF0dGVkRGF0YSwgZGF0YVBvaW50ZXIsIG5ld1ZhbHVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBJZiByZXR1cm5FbXB0eUZpZWxkcyA9PT0gZmFsc2UsXG4gICAgICAgICAgLy8gb25seSBhZGQgZW1wdHkgYXJyYXlzIGFuZCBvYmplY3RzIHRvIHJlcXVpcmVkIGtleXNcbiAgICAgICAgfSBlbHNlIGlmIChzY2hlbWFUeXBlID09PSBcIm9iamVjdFwiICYmICFyZXR1cm5FbXB0eUZpZWxkcykge1xuICAgICAgICAgIChkYXRhTWFwLmdldChnZW5lcmljUG9pbnRlcikuZ2V0KFwicmVxdWlyZWRcIikgfHwgW10pLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qga2V5U2NoZW1hVHlwZSA9IGRhdGFNYXBcbiAgICAgICAgICAgICAgLmdldChgJHtnZW5lcmljUG9pbnRlcn0vJHtrZXl9YClcbiAgICAgICAgICAgICAgLmdldChcInNjaGVtYVR5cGVcIik7XG4gICAgICAgICAgICBpZiAoa2V5U2NoZW1hVHlwZSA9PT0gXCJhcnJheVwiKSB7XG4gICAgICAgICAgICAgIEpzb25Qb2ludGVyLnNldChmb3JtYXR0ZWREYXRhLCBgJHtkYXRhUG9pbnRlcn0vJHtrZXl9YCwgW10pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXlTY2hlbWFUeXBlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgIEpzb25Qb2ludGVyLnNldChmb3JtYXR0ZWREYXRhLCBgJHtkYXRhUG9pbnRlcn0vJHtrZXl9YCwge30pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmluaXNoIGluY29tcGxldGUgJ2RhdGUtdGltZScgZW50cmllc1xuICAgICAgICBpZiAoZGF0YU1hcC5nZXQoZ2VuZXJpY1BvaW50ZXIpLmdldChcInNjaGVtYUZvcm1hdFwiKSA9PT0gXCJkYXRlLXRpbWVcIikge1xuICAgICAgICAgIC8vIFwiMjAwMC0wMy0xNFQwMTo1OToyNi41MzVcIiAtPiBcIjIwMDAtMDMtMTRUMDE6NTk6MjYuNTM1WlwiIChhZGQgXCJaXCIpXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgL15cXGRcXGRcXGRcXGQtWzAtMV1cXGQtWzAtM11cXGRbdFxcc11bMC0yXVxcZDpbMC01XVxcZDpbMC01XVxcZCg/OlxcLlxcZCspPyQvaS50ZXN0KFxuICAgICAgICAgICAgICB2YWx1ZVxuICAgICAgICAgICAgKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgSnNvblBvaW50ZXIuc2V0KGZvcm1hdHRlZERhdGEsIGRhdGFQb2ludGVyLCBgJHt2YWx1ZX1aYCk7XG4gICAgICAgICAgICAvLyBcIjIwMDAtMDMtMTRUMDE6NTlcIiAtPiBcIjIwMDAtMDMtMTRUMDE6NTk6MDBaXCIgKGFkZCBcIjowMFpcIilcbiAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgL15cXGRcXGRcXGRcXGQtWzAtMV1cXGQtWzAtM11cXGRbdFxcc11bMC0yXVxcZDpbMC01XVxcZCQvaS50ZXN0KHZhbHVlKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgSnNvblBvaW50ZXIuc2V0KGZvcm1hdHRlZERhdGEsIGRhdGFQb2ludGVyLCBgJHt2YWx1ZX06MDBaYCk7XG4gICAgICAgICAgICAvLyBcIjIwMDAtMDMtMTRcIiAtPiBcIjIwMDAtMDMtMTRUMDA6MDA6MDBaXCIgKGFkZCBcIlQwMDowMDowMFpcIilcbiAgICAgICAgICB9IGVsc2UgaWYgKGZpeEVycm9ycyAmJiAvXlxcZFxcZFxcZFxcZC1bMC0xXVxcZC1bMC0zXVxcZCQvaS50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgSnNvblBvaW50ZXIuc2V0KGZvcm1hdHRlZERhdGEsIGRhdGFQb2ludGVyLCBgJHt2YWx1ZX06MDA6MDA6MDBaYCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICB0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIgfHxcbiAgICAgICAgaXNEYXRlKHZhbHVlKSB8fFxuICAgICAgICAodmFsdWUgPT09IG51bGwgJiYgcmV0dXJuRW1wdHlGaWVsZHMpXG4gICAgICApIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICBcImZvcm1hdEZvcm1EYXRhIGVycm9yOiBcIiArXG4gICAgICAgICAgICBgU2NoZW1hIHR5cGUgbm90IGZvdW5kIGZvciBmb3JtIHZhbHVlIGF0ICR7Z2VuZXJpY1BvaW50ZXJ9YFxuICAgICAgICApO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiZGF0YU1hcFwiLCBkYXRhTWFwKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcInJlY3Vyc2l2ZVJlZk1hcFwiLCByZWN1cnNpdmVSZWZNYXApO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiZ2VuZXJpY1BvaW50ZXJcIiwgZ2VuZXJpY1BvaW50ZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmb3JtYXR0ZWREYXRhO1xufVxuXG4vKipcbiAqICdnZXRDb250cm9sJyBmdW5jdGlvblxuICpcbiAqIFVzZXMgYSBKU09OIFBvaW50ZXIgZm9yIGEgZGF0YSBvYmplY3QgdG8gcmV0cmlldmUgYSBjb250cm9sIGZyb21cbiAqIGFuIEFuZ3VsYXIgZm9ybUdyb3VwIG9yIGZvcm1Hcm91cCB0ZW1wbGF0ZS4gKE5vdGU6IHRob3VnaCBhIGZvcm1Hcm91cFxuICogdGVtcGxhdGUgaXMgbXVjaCBzaW1wbGVyLCBpdHMgYmFzaWMgc3RydWN0dXJlIGlzIGlkZW50aWFsIHRvIGEgZm9ybUdyb3VwKS5cbiAqXG4gKiBJZiB0aGUgb3B0aW9uYWwgdGhpcmQgcGFyYW1ldGVyICdyZXR1cm5Hcm91cCcgaXMgc2V0IHRvIFRSVUUsIHRoZSBncm91cFxuICogY29udGFpbmluZyB0aGUgY29udHJvbCBpcyByZXR1cm5lZCwgcmF0aGVyIHRoYW4gdGhlIGNvbnRyb2wgaXRzZWxmLlxuICpcbiAqIC8vIHtGb3JtR3JvdXB9IGZvcm1Hcm91cCAtIEFuZ3VsYXIgRm9ybUdyb3VwIHRvIGdldCB2YWx1ZSBmcm9tXG4gKiAvLyB7UG9pbnRlcn0gZGF0YVBvaW50ZXIgLSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSlcbiAqIC8vIHtib29sZWFuID0gZmFsc2V9IHJldHVybkdyb3VwIC0gSWYgdHJ1ZSwgcmV0dXJuIGdyb3VwIGNvbnRhaW5pbmcgY29udHJvbFxuICogLy8ge2dyb3VwfSAtIExvY2F0ZWQgdmFsdWUgKG9yIG51bGwsIGlmIG5vIGNvbnRyb2wgZm91bmQpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250cm9sKFxuICBmb3JtR3JvdXA6IGFueSxcbiAgZGF0YVBvaW50ZXI6IFBvaW50ZXIsXG4gIHJldHVybkdyb3VwID0gZmFsc2Vcbik6IGFueSB7XG4gIGlmICghaXNPYmplY3QoZm9ybUdyb3VwKSB8fCAhSnNvblBvaW50ZXIuaXNKc29uUG9pbnRlcihkYXRhUG9pbnRlcikpIHtcbiAgICBpZiAoIUpzb25Qb2ludGVyLmlzSnNvblBvaW50ZXIoZGF0YVBvaW50ZXIpKSB7XG4gICAgICAvLyBJZiBkYXRhUG9pbnRlciBpbnB1dCBpcyBub3QgYSB2YWxpZCBKU09OIHBvaW50ZXIsIGNoZWNrIHRvXG4gICAgICAvLyBzZWUgaWYgaXQgaXMgaW5zdGVhZCBhIHZhbGlkIG9iamVjdCBwYXRoLCB1c2luZyBkb3Qgbm90YWlvblxuICAgICAgaWYgKHR5cGVvZiBkYXRhUG9pbnRlciA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBjb25zdCBmb3JtQ29udHJvbCA9IGZvcm1Hcm91cC5nZXQoZGF0YVBvaW50ZXIpO1xuICAgICAgICBpZiAoZm9ybUNvbnRyb2wpIHtcbiAgICAgICAgICByZXR1cm4gZm9ybUNvbnRyb2w7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnNvbGUuZXJyb3IoYGdldENvbnRyb2wgZXJyb3I6IEludmFsaWQgSlNPTiBQb2ludGVyOiAke2RhdGFQb2ludGVyfWApO1xuICAgIH1cbiAgICBpZiAoIWlzT2JqZWN0KGZvcm1Hcm91cCkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYGdldENvbnRyb2wgZXJyb3I6IEludmFsaWQgZm9ybUdyb3VwOiAke2Zvcm1Hcm91cH1gKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgbGV0IGRhdGFQb2ludGVyQXJyYXkgPSBKc29uUG9pbnRlci5wYXJzZShkYXRhUG9pbnRlcik7XG4gIGlmIChyZXR1cm5Hcm91cCkge1xuICAgIGRhdGFQb2ludGVyQXJyYXkgPSBkYXRhUG9pbnRlckFycmF5LnNsaWNlKDAsIC0xKTtcbiAgfVxuXG4gIC8vIElmIGZvcm1Hcm91cCBpbnB1dCBpcyBhIHJlYWwgZm9ybUdyb3VwIChub3QgYSBmb3JtR3JvdXAgdGVtcGxhdGUpXG4gIC8vIHRyeSB1c2luZyBmb3JtR3JvdXAuZ2V0KCkgdG8gcmV0dXJuIHRoZSBjb250cm9sXG4gIGlmIChcbiAgICB0eXBlb2YgZm9ybUdyb3VwLmdldCA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgZGF0YVBvaW50ZXJBcnJheS5ldmVyeSgoa2V5KSA9PiBrZXkuaW5kZXhPZihcIi5cIikgPT09IC0xKVxuICApIHtcbiAgICBjb25zdCBmb3JtQ29udHJvbCA9IGZvcm1Hcm91cC5nZXQoZGF0YVBvaW50ZXJBcnJheS5qb2luKFwiLlwiKSk7XG4gICAgaWYgKGZvcm1Db250cm9sKSB7XG4gICAgICByZXR1cm4gZm9ybUNvbnRyb2w7XG4gICAgfVxuICB9XG5cbiAgLy8gSWYgZm9ybUdyb3VwIGlucHV0IGlzIGEgZm9ybUdyb3VwIHRlbXBsYXRlLFxuICAvLyBvciBmb3JtR3JvdXAuZ2V0KCkgZmFpbGVkIHRvIHJldHVybiB0aGUgY29udHJvbCxcbiAgLy8gc2VhcmNoIHRoZSBmb3JtR3JvdXAgb2JqZWN0IGZvciBkYXRhUG9pbnRlcidzIGNvbnRyb2xcbiAgbGV0IHN1Ykdyb3VwID0gZm9ybUdyb3VwO1xuICBmb3IgKGNvbnN0IGtleSBvZiBkYXRhUG9pbnRlckFycmF5KSB7XG4gICAgaWYgKGhhc093bihzdWJHcm91cCwgXCJjb250cm9sc1wiKSkge1xuICAgICAgc3ViR3JvdXAgPSBzdWJHcm91cC5jb250cm9scztcbiAgICB9XG4gICAgaWYgKGlzQXJyYXkoc3ViR3JvdXApICYmIGtleSA9PT0gXCItXCIpIHtcbiAgICAgIHN1Ykdyb3VwID0gc3ViR3JvdXBbc3ViR3JvdXAubGVuZ3RoIC0gMV07XG4gICAgfSBlbHNlIGlmIChoYXNPd24oc3ViR3JvdXAsIGtleSkpIHtcbiAgICAgIHN1Ykdyb3VwID0gc3ViR3JvdXBba2V5XTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgYGdldENvbnRyb2wgZXJyb3I6IFVuYWJsZSB0byBmaW5kIFwiJHtrZXl9XCIgaXRlbSBpbiBGb3JtR3JvdXAuYFxuICAgICAgKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZGF0YVBvaW50ZXIpO1xuICAgICAgY29uc29sZS5lcnJvcihmb3JtR3JvdXApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3ViR3JvdXA7XG59XG4iXX0=