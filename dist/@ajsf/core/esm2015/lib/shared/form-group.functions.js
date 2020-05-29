/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
export function buildFormGroupTemplate(jsf, nodeValue = null, setValues = true, schemaPointer = "", dataPointer = "", templatePointer = "") {
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
export function buildFormGroup(template) {
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
                return new FormArray(filter(map(template.controls, (/**
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
export function mergeValues(...valuesToMerge) {
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
export function setRequiredFields(schema, formControlTemplate) {
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
export function formatFormData(formData, dataMap, recursiveRefMap, arrayMap, returnEmptyFields = false, fixErrors = false) {
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
export function getControl(formGroup, dataPointer, returnGroup = false) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1ncm91cC5mdW5jdGlvbnMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWpzZi9jb3JlLyIsInNvdXJjZXMiOlsibGliL3NoYXJlZC9mb3JtLWdyb3VwLmZ1bmN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxTQUFTLE1BQU0sa0JBQWtCLENBQUM7QUFDekMsT0FBTyxNQUFNLE1BQU0sZUFBZSxDQUFDO0FBQ25DLE9BQU8sR0FBRyxNQUFNLFlBQVksQ0FBQztBQUM3QixPQUFPLEVBRUwsU0FBUyxFQUNULFdBQVcsRUFDWCxTQUFTLEdBRVYsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFDTCxvQkFBb0IsRUFDcEIseUJBQXlCLEdBQzFCLE1BQU0seUJBQXlCLENBQUM7QUFDakMsT0FBTyxFQUNMLFFBQVEsRUFDUixPQUFPLEVBQ1AsT0FBTyxFQUNQLE1BQU0sRUFDTixTQUFTLEVBQ1QsT0FBTyxFQUNQLFFBQVEsRUFDUixXQUFXLEVBRVgsZ0JBQWdCLEVBQ2hCLFlBQVksR0FDYixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBRSxXQUFXLEVBQVcsTUFBTSx5QkFBeUIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVDL0QsTUFBTSxVQUFVLHNCQUFzQixDQUNwQyxHQUFRLEVBQ1IsWUFBaUIsSUFBSSxFQUNyQixTQUFTLEdBQUcsSUFBSSxFQUNoQixhQUFhLEdBQUcsRUFBRSxFQUNsQixXQUFXLEdBQUcsRUFBRSxFQUNoQixlQUFlLEdBQUcsRUFBRTs7VUFFZCxNQUFNLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQztJQUN6RCxJQUFJLFNBQVMsRUFBRTtRQUNiLElBQ0UsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFD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QUMsQ0FBQyxDQUFDO1NBQzFDO2FBQU0sSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ2hDLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDMUI7YUFBTTtZQUNMLE9BQU8sQ0FBQyxLQUFLLENBQ1gscUNBQXFDLEdBQUcsc0JBQXNCLENBQy9ELENBQUM7WUFDRixPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzNCLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDekIsT0FBTztTQUNSO0tBQ0Y7SUFDRCxPQUFPLFFBQVEsQ0FBQztBQUNsQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsb25lRGVlcCBmcm9tIFwibG9kYXNoL2Nsb25lRGVlcFwiO1xuaW1wb3J0IGZpbHRlciBmcm9tIFwibG9kYXNoL2ZpbHRlclwiO1xuaW1wb3J0IG1hcCBmcm9tIFwibG9kYXNoL21hcFwiO1xuaW1wb3J0IHtcbiAgQWJzdHJhY3RDb250cm9sLFxuICBGb3JtQXJyYXksXG4gIEZvcm1Db250cm9sLFxuICBGb3JtR3JvdXAsXG4gIFZhbGlkYXRvckZuLFxufSBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IGZvckVhY2gsIGhhc093biB9IGZyb20gXCIuL3V0aWxpdHkuZnVuY3Rpb25zXCI7XG5pbXBvcnQge1xuICBnZXRDb250cm9sVmFsaWRhdG9ycyxcbiAgcmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlcyxcbn0gZnJvbSBcIi4vanNvbi1zY2hlbWEuZnVuY3Rpb25zXCI7XG5pbXBvcnQge1xuICBoYXNWYWx1ZSxcbiAgaW5BcnJheSxcbiAgaXNBcnJheSxcbiAgaXNEYXRlLFxuICBpc0RlZmluZWQsXG4gIGlzRW1wdHksXG4gIGlzT2JqZWN0LFxuICBpc1ByaW1pdGl2ZSxcbiAgU2NoZW1hUHJpbWl0aXZlVHlwZSxcbiAgdG9KYXZhU2NyaXB0VHlwZSxcbiAgdG9TY2hlbWFUeXBlLFxufSBmcm9tIFwiLi92YWxpZGF0b3IuZnVuY3Rpb25zXCI7XG5pbXBvcnQgeyBKc29uUG9pbnRlciwgUG9pbnRlciB9IGZyb20gXCIuL2pzb25wb2ludGVyLmZ1bmN0aW9uc1wiO1xuaW1wb3J0IHsgSnNvblZhbGlkYXRvcnMgfSBmcm9tIFwiLi9qc29uLnZhbGlkYXRvcnNcIjtcblxuLyoqXG4gKiBGb3JtR3JvdXAgZnVuY3Rpb24gbGlicmFyeTpcbiAqXG4gKiBidWlsZEZvcm1Hcm91cFRlbXBsYXRlOiAgQnVpbGRzIGEgRm9ybUdyb3VwVGVtcGxhdGUgZnJvbSBzY2hlbWFcbiAqXG4gKiBidWlsZEZvcm1Hcm91cDogICAgICAgICAgQnVpbGRzIGFuIEFuZ3VsYXIgRm9ybUdyb3VwIGZyb20gYSBGb3JtR3JvdXBUZW1wbGF0ZVxuICpcbiAqIG1lcmdlVmFsdWVzOlxuICpcbiAqIHNldFJlcXVpcmVkRmllbGRzOlxuICpcbiAqIGZvcm1hdEZvcm1EYXRhOlxuICpcbiAqIGdldENvbnRyb2w6XG4gKlxuICogLS0tLSBUT0RPOiAtLS0tXG4gKiBUT0RPOiBhZGQgYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZUZyb21MYXlvdXQgZnVuY3Rpb25cbiAqIGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGVGcm9tTGF5b3V0OiBCdWlsZHMgYSBGb3JtR3JvdXBUZW1wbGF0ZSBmcm9tIGEgZm9ybSBsYXlvdXRcbiAqL1xuXG4vKipcbiAqICdidWlsZEZvcm1Hcm91cFRlbXBsYXRlJyBmdW5jdGlvblxuICpcbiAqIEJ1aWxkcyBhIHRlbXBsYXRlIGZvciBhbiBBbmd1bGFyIEZvcm1Hcm91cCBmcm9tIGEgSlNPTiBTY2hlbWEuXG4gKlxuICogVE9ETzogYWRkIHN1cHBvcnQgZm9yIHBhdHRlcm4gcHJvcGVydGllc1xuICogaHR0cHM6Ly9zcGFjZXRlbGVzY29wZS5naXRodWIuaW8vdW5kZXJzdGFuZGluZy1qc29uLXNjaGVtYS9yZWZlcmVuY2Uvb2JqZWN0Lmh0bWxcbiAqXG4gKiAvLyAge2FueX0ganNmIC1cbiAqIC8vICB7YW55ID0gbnVsbH0gbm9kZVZhbHVlIC1cbiAqIC8vICB7Ym9vbGVhbiA9IHRydWV9IG1hcEFycmF5cyAtXG4gKiAvLyAge3N0cmluZyA9ICcnfSBzY2hlbWFQb2ludGVyIC1cbiAqIC8vICB7c3RyaW5nID0gJyd9IGRhdGFQb2ludGVyIC1cbiAqIC8vICB7YW55ID0gJyd9IHRlbXBsYXRlUG9pbnRlciAtXG4gKiAvLyB7YW55fSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEZvcm1Hcm91cFRlbXBsYXRlKFxuICBqc2Y6IGFueSxcbiAgbm9kZVZhbHVlOiBhbnkgPSBudWxsLFxuICBzZXRWYWx1ZXMgPSB0cnVlLFxuICBzY2hlbWFQb2ludGVyID0gXCJcIixcbiAgZGF0YVBvaW50ZXIgPSBcIlwiLFxuICB0ZW1wbGF0ZVBvaW50ZXIgPSBcIlwiXG4pIHtcbiAgY29uc3Qgc2NoZW1hID0gSnNvblBvaW50ZXIuZ2V0KGpzZi5zY2hlbWEsIHNjaGVtYVBvaW50ZXIpO1xuICBpZiAoc2V0VmFsdWVzKSB7XG4gICAgaWYgKFxuICAgICAgIWlzRGVmaW5lZChub2RlVmFsdWUpICYmXG4gICAgICAoanNmLmZvcm1PcHRpb25zLnNldFNjaGVtYURlZmF1bHRzID09PSB0cnVlIHx8XG4gICAgICAgIChqc2YuZm9ybU9wdGlvbnMuc2V0U2NoZW1hRGVmYXVsdHMgPT09IFwiYXV0b1wiICYmXG4gICAgICAgICAgaXNFbXB0eShqc2YuZm9ybVZhbHVlcykpKVxuICAgICkge1xuICAgICAgbm9kZVZhbHVlID0gSnNvblBvaW50ZXIuZ2V0KGpzZi5zY2hlbWEsIHNjaGVtYVBvaW50ZXIgKyBcIi9kZWZhdWx0XCIpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBub2RlVmFsdWUgPSBudWxsO1xuICB9XG4gIC8vIFRPRE86IElmIG5vZGVWYWx1ZSBzdGlsbCBub3Qgc2V0LCBjaGVjayBsYXlvdXQgZm9yIGRlZmF1bHQgdmFsdWVcbiAgY29uc3Qgc2NoZW1hVHlwZTogc3RyaW5nIHwgc3RyaW5nW10gPSBKc29uUG9pbnRlci5nZXQoc2NoZW1hLCBcIi90eXBlXCIpO1xuICBjb25zdCBjb250cm9sVHlwZSA9XG4gICAgKGhhc093bihzY2hlbWEsIFwicHJvcGVydGllc1wiKSB8fCBoYXNPd24oc2NoZW1hLCBcImFkZGl0aW9uYWxQcm9wZXJ0aWVzXCIpKSAmJlxuICAgIHNjaGVtYVR5cGUgPT09IFwib2JqZWN0XCJcbiAgICAgID8gXCJGb3JtR3JvdXBcIlxuICAgICAgOiAoaGFzT3duKHNjaGVtYSwgXCJpdGVtc1wiKSB8fCBoYXNPd24oc2NoZW1hLCBcImFkZGl0aW9uYWxJdGVtc1wiKSkgJiZcbiAgICAgICAgc2NoZW1hVHlwZSA9PT0gXCJhcnJheVwiXG4gICAgICA/IFwiRm9ybUFycmF5XCJcbiAgICAgIDogIXNjaGVtYVR5cGUgJiYgaGFzT3duKHNjaGVtYSwgXCIkcmVmXCIpXG4gICAgICA/IFwiJHJlZlwiXG4gICAgICA6IFwiRm9ybUNvbnRyb2xcIjtcbiAgY29uc3Qgc2hvcnREYXRhUG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoXG4gICAgZGF0YVBvaW50ZXIsXG4gICAganNmLmRhdGFSZWN1cnNpdmVSZWZNYXAsXG4gICAganNmLmFycmF5TWFwXG4gICk7XG4gIGlmICghanNmLmRhdGFNYXAuaGFzKHNob3J0RGF0YVBvaW50ZXIpKSB7XG4gICAganNmLmRhdGFNYXAuc2V0KHNob3J0RGF0YVBvaW50ZXIsIG5ldyBNYXAoKSk7XG4gIH1cbiAgY29uc3Qgbm9kZU9wdGlvbnMgPSBqc2YuZGF0YU1hcC5nZXQoc2hvcnREYXRhUG9pbnRlcik7XG4gIGlmICghbm9kZU9wdGlvbnMuaGFzKFwic2NoZW1hVHlwZVwiKSkge1xuICAgIG5vZGVPcHRpb25zLnNldChcInNjaGVtYVBvaW50ZXJcIiwgc2NoZW1hUG9pbnRlcik7XG4gICAgbm9kZU9wdGlvbnMuc2V0KFwic2NoZW1hVHlwZVwiLCBzY2hlbWEudHlwZSk7XG4gICAgaWYgKHNjaGVtYS5mb3JtYXQpIHtcbiAgICAgIG5vZGVPcHRpb25zLnNldChcInNjaGVtYUZvcm1hdFwiLCBzY2hlbWEuZm9ybWF0KTtcbiAgICAgIGlmICghc2NoZW1hLnR5cGUpIHtcbiAgICAgICAgbm9kZU9wdGlvbnMuc2V0KFwic2NoZW1hVHlwZVwiLCBcInN0cmluZ1wiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNvbnRyb2xUeXBlKSB7XG4gICAgICBub2RlT3B0aW9ucy5zZXQoXCJ0ZW1wbGF0ZVBvaW50ZXJcIiwgdGVtcGxhdGVQb2ludGVyKTtcbiAgICAgIG5vZGVPcHRpb25zLnNldChcInRlbXBsYXRlVHlwZVwiLCBjb250cm9sVHlwZSk7XG4gICAgfVxuICB9XG4gIGxldCBjb250cm9sczogYW55O1xuICBjb25zdCB2YWxpZGF0b3JzID0gZ2V0Q29udHJvbFZhbGlkYXRvcnMoc2NoZW1hKTtcbiAgc3dpdGNoIChjb250cm9sVHlwZSkge1xuICAgIGNhc2UgXCJGb3JtR3JvdXBcIjpcbiAgICAgIGNvbnRyb2xzID0ge307XG4gICAgICBpZiAoaGFzT3duKHNjaGVtYSwgXCJ1aTpvcmRlclwiKSB8fCBoYXNPd24oc2NoZW1hLCBcInByb3BlcnRpZXNcIikpIHtcbiAgICAgICAgY29uc3QgcHJvcGVydHlLZXlzID1cbiAgICAgICAgICBzY2hlbWFbXCJ1aTpvcmRlclwiXSB8fCBPYmplY3Qua2V5cyhzY2hlbWEucHJvcGVydGllcyk7XG4gICAgICAgIGlmIChwcm9wZXJ0eUtleXMuaW5jbHVkZXMoXCIqXCIpICYmICFoYXNPd24oc2NoZW1hLnByb3BlcnRpZXMsIFwiKlwiKSkge1xuICAgICAgICAgIGNvbnN0IHVubmFtZWRLZXlzID0gT2JqZWN0LmtleXMoc2NoZW1hLnByb3BlcnRpZXMpLmZpbHRlcihcbiAgICAgICAgICAgIChrZXkpID0+ICFwcm9wZXJ0eUtleXMuaW5jbHVkZXMoa2V5KVxuICAgICAgICAgICk7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IHByb3BlcnR5S2V5cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgaWYgKHByb3BlcnR5S2V5c1tpXSA9PT0gXCIqXCIpIHtcbiAgICAgICAgICAgICAgcHJvcGVydHlLZXlzLnNwbGljZShpLCAxLCAuLi51bm5hbWVkS2V5cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHByb3BlcnR5S2V5c1xuICAgICAgICAgIC5maWx0ZXIoXG4gICAgICAgICAgICAoa2V5KSA9PlxuICAgICAgICAgICAgICBoYXNPd24oc2NoZW1hLnByb3BlcnRpZXMsIGtleSkgfHxcbiAgICAgICAgICAgICAgaGFzT3duKHNjaGVtYSwgXCJhZGRpdGlvbmFsUHJvcGVydGllc1wiKVxuICAgICAgICAgIClcbiAgICAgICAgICAuZm9yRWFjaChcbiAgICAgICAgICAgIChrZXkpID0+XG4gICAgICAgICAgICAgIChjb250cm9sc1trZXldID0gYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZShcbiAgICAgICAgICAgICAgICBqc2YsXG4gICAgICAgICAgICAgICAgSnNvblBvaW50ZXIuZ2V0KG5vZGVWYWx1ZSwgWzxzdHJpbmc+a2V5XSksXG4gICAgICAgICAgICAgICAgc2V0VmFsdWVzLFxuICAgICAgICAgICAgICAgIHNjaGVtYVBvaW50ZXIgK1xuICAgICAgICAgICAgICAgICAgKGhhc093bihzY2hlbWEucHJvcGVydGllcywga2V5KVxuICAgICAgICAgICAgICAgICAgICA/IFwiL3Byb3BlcnRpZXMvXCIgKyBrZXlcbiAgICAgICAgICAgICAgICAgICAgOiBcIi9hZGRpdGlvbmFsUHJvcGVydGllc1wiKSxcbiAgICAgICAgICAgICAgICBkYXRhUG9pbnRlciArIFwiL1wiICsga2V5LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlUG9pbnRlciArIFwiL2NvbnRyb2xzL1wiICsga2V5XG4gICAgICAgICAgICAgICkpXG4gICAgICAgICAgKTtcbiAgICAgICAganNmLmZvcm1PcHRpb25zLmZpZWxkc1JlcXVpcmVkID0gc2V0UmVxdWlyZWRGaWVsZHMoc2NoZW1hLCBjb250cm9scyk7XG4gICAgICB9XG4gICAgICByZXR1cm4geyBjb250cm9sVHlwZSwgY29udHJvbHMsIHZhbGlkYXRvcnMgfTtcblxuICAgIGNhc2UgXCJGb3JtQXJyYXlcIjpcbiAgICAgIGNvbnRyb2xzID0gW107XG4gICAgICBjb25zdCBtaW5JdGVtcyA9IE1hdGgubWF4KFxuICAgICAgICBzY2hlbWEubWluSXRlbXMgfHwgMCxcbiAgICAgICAgbm9kZU9wdGlvbnMuZ2V0KFwibWluSXRlbXNcIikgfHwgMFxuICAgICAgKTtcbiAgICAgIGNvbnN0IG1heEl0ZW1zID0gTWF0aC5taW4oXG4gICAgICAgIHNjaGVtYS5tYXhJdGVtcyB8fCAxMDAwLFxuICAgICAgICBub2RlT3B0aW9ucy5nZXQoXCJtYXhJdGVtc1wiKSB8fCAxMDAwXG4gICAgICApO1xuICAgICAgbGV0IGFkZGl0aW9uYWxJdGVtc1BvaW50ZXI6IHN0cmluZyA9IG51bGw7XG4gICAgICBpZiAoaXNBcnJheShzY2hlbWEuaXRlbXMpKSB7XG4gICAgICAgIC8vICdpdGVtcycgaXMgYW4gYXJyYXkgPSB0dXBsZSBpdGVtc1xuICAgICAgICBjb25zdCB0dXBsZUl0ZW1zID1cbiAgICAgICAgICBub2RlT3B0aW9ucy5nZXQoXCJ0dXBsZUl0ZW1zXCIpIHx8XG4gICAgICAgICAgKGlzQXJyYXkoc2NoZW1hLml0ZW1zKSA/IE1hdGgubWluKHNjaGVtYS5pdGVtcy5sZW5ndGgsIG1heEl0ZW1zKSA6IDApO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHR1cGxlSXRlbXM7IGkrKykge1xuICAgICAgICAgIGlmIChpIDwgbWluSXRlbXMpIHtcbiAgICAgICAgICAgIGNvbnRyb2xzLnB1c2goXG4gICAgICAgICAgICAgIGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGUoXG4gICAgICAgICAgICAgICAganNmLFxuICAgICAgICAgICAgICAgIGlzQXJyYXkobm9kZVZhbHVlKSA/IG5vZGVWYWx1ZVtpXSA6IG5vZGVWYWx1ZSxcbiAgICAgICAgICAgICAgICBzZXRWYWx1ZXMsXG4gICAgICAgICAgICAgICAgc2NoZW1hUG9pbnRlciArIFwiL2l0ZW1zL1wiICsgaSxcbiAgICAgICAgICAgICAgICBkYXRhUG9pbnRlciArIFwiL1wiICsgaSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVBvaW50ZXIgKyBcIi9jb250cm9scy9cIiArIGlcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgc2NoZW1hUmVmUG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoXG4gICAgICAgICAgICAgIHNjaGVtYVBvaW50ZXIgKyBcIi9pdGVtcy9cIiArIGksXG4gICAgICAgICAgICAgIGpzZi5zY2hlbWFSZWN1cnNpdmVSZWZNYXBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBpdGVtUmVmUG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoXG4gICAgICAgICAgICAgIHNob3J0RGF0YVBvaW50ZXIgKyBcIi9cIiArIGksXG4gICAgICAgICAgICAgIGpzZi5kYXRhUmVjdXJzaXZlUmVmTWFwLFxuICAgICAgICAgICAgICBqc2YuYXJyYXlNYXBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBpdGVtUmVjdXJzaXZlID0gaXRlbVJlZlBvaW50ZXIgIT09IHNob3J0RGF0YVBvaW50ZXIgKyBcIi9cIiArIGk7XG4gICAgICAgICAgICBpZiAoIWhhc093bihqc2YudGVtcGxhdGVSZWZMaWJyYXJ5LCBpdGVtUmVmUG9pbnRlcikpIHtcbiAgICAgICAgICAgICAganNmLnRlbXBsYXRlUmVmTGlicmFyeVtpdGVtUmVmUG9pbnRlcl0gPSBudWxsO1xuICAgICAgICAgICAgICBqc2YudGVtcGxhdGVSZWZMaWJyYXJ5W2l0ZW1SZWZQb2ludGVyXSA9IGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGUoXG4gICAgICAgICAgICAgICAganNmLFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgc2V0VmFsdWVzLFxuICAgICAgICAgICAgICAgIHNjaGVtYVJlZlBvaW50ZXIsXG4gICAgICAgICAgICAgICAgaXRlbVJlZlBvaW50ZXIsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVQb2ludGVyICsgXCIvY29udHJvbHMvXCIgKyBpXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250cm9scy5wdXNoKFxuICAgICAgICAgICAgICBpc0FycmF5KG5vZGVWYWx1ZSlcbiAgICAgICAgICAgICAgICA/IGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGUoXG4gICAgICAgICAgICAgICAgICAgIGpzZixcbiAgICAgICAgICAgICAgICAgICAgbm9kZVZhbHVlW2ldLFxuICAgICAgICAgICAgICAgICAgICBzZXRWYWx1ZXMsXG4gICAgICAgICAgICAgICAgICAgIHNjaGVtYVBvaW50ZXIgKyBcIi9pdGVtcy9cIiArIGksXG4gICAgICAgICAgICAgICAgICAgIGRhdGFQb2ludGVyICsgXCIvXCIgKyBpLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVBvaW50ZXIgKyBcIi9jb250cm9scy9cIiArIGlcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICA6IGl0ZW1SZWN1cnNpdmVcbiAgICAgICAgICAgICAgICA/IG51bGxcbiAgICAgICAgICAgICAgICA6IGNsb25lRGVlcChqc2YudGVtcGxhdGVSZWZMaWJyYXJ5W2l0ZW1SZWZQb2ludGVyXSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgJ2FkZGl0aW9uYWxJdGVtcycgaXMgYW4gb2JqZWN0ID0gYWRkaXRpb25hbCBsaXN0IGl0ZW1zIChhZnRlciB0dXBsZSBpdGVtcylcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHNjaGVtYS5pdGVtcy5sZW5ndGggPCBtYXhJdGVtcyAmJlxuICAgICAgICAgIGlzT2JqZWN0KHNjaGVtYS5hZGRpdGlvbmFsSXRlbXMpXG4gICAgICAgICkge1xuICAgICAgICAgIGFkZGl0aW9uYWxJdGVtc1BvaW50ZXIgPSBzY2hlbWFQb2ludGVyICsgXCIvYWRkaXRpb25hbEl0ZW1zXCI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiAnaXRlbXMnIGlzIGFuIG9iamVjdCA9IGxpc3QgaXRlbXMgb25seSAobm8gdHVwbGUgaXRlbXMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZGRpdGlvbmFsSXRlbXNQb2ludGVyID0gc2NoZW1hUG9pbnRlciArIFwiL2l0ZW1zXCI7XG4gICAgICB9XG5cbiAgICAgIGlmIChhZGRpdGlvbmFsSXRlbXNQb2ludGVyKSB7XG4gICAgICAgIGNvbnN0IHNjaGVtYVJlZlBvaW50ZXIgPSByZW1vdmVSZWN1cnNpdmVSZWZlcmVuY2VzKFxuICAgICAgICAgIGFkZGl0aW9uYWxJdGVtc1BvaW50ZXIsXG4gICAgICAgICAganNmLnNjaGVtYVJlY3Vyc2l2ZVJlZk1hcFxuICAgICAgICApO1xuICAgICAgICBjb25zdCBpdGVtUmVmUG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoXG4gICAgICAgICAgc2hvcnREYXRhUG9pbnRlciArIFwiLy1cIixcbiAgICAgICAgICBqc2YuZGF0YVJlY3Vyc2l2ZVJlZk1hcCxcbiAgICAgICAgICBqc2YuYXJyYXlNYXBcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgaXRlbVJlY3Vyc2l2ZSA9IGl0ZW1SZWZQb2ludGVyICE9PSBzaG9ydERhdGFQb2ludGVyICsgXCIvLVwiO1xuICAgICAgICBpZiAoIWhhc093bihqc2YudGVtcGxhdGVSZWZMaWJyYXJ5LCBpdGVtUmVmUG9pbnRlcikpIHtcbiAgICAgICAgICBqc2YudGVtcGxhdGVSZWZMaWJyYXJ5W2l0ZW1SZWZQb2ludGVyXSA9IG51bGw7XG4gICAgICAgICAganNmLnRlbXBsYXRlUmVmTGlicmFyeVtpdGVtUmVmUG9pbnRlcl0gPSBidWlsZEZvcm1Hcm91cFRlbXBsYXRlKFxuICAgICAgICAgICAganNmLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIHNldFZhbHVlcyxcbiAgICAgICAgICAgIHNjaGVtYVJlZlBvaW50ZXIsXG4gICAgICAgICAgICBpdGVtUmVmUG9pbnRlcixcbiAgICAgICAgICAgIHRlbXBsYXRlUG9pbnRlciArIFwiL2NvbnRyb2xzLy1cIlxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc3QgaXRlbU9wdGlvbnMgPSBqc2YuZGF0YU1hcC5nZXQoaXRlbVJlZlBvaW50ZXIpIHx8IG5ldyBNYXAoKTtcbiAgICAgICAgY29uc3QgaXRlbU9wdGlvbnMgPSBub2RlT3B0aW9ucztcbiAgICAgICAgaWYgKCFpdGVtUmVjdXJzaXZlIHx8IGhhc093bih2YWxpZGF0b3JzLCBcInJlcXVpcmVkXCIpKSB7XG4gICAgICAgICAgY29uc3QgYXJyYXlMZW5ndGggPSBNYXRoLm1pbihcbiAgICAgICAgICAgIE1hdGgubWF4KFxuICAgICAgICAgICAgICBpdGVtUmVjdXJzaXZlXG4gICAgICAgICAgICAgICAgPyAwXG4gICAgICAgICAgICAgICAgOiBpdGVtT3B0aW9ucy5nZXQoXCJ0dXBsZUl0ZW1zXCIpICtcbiAgICAgICAgICAgICAgICAgICAgaXRlbU9wdGlvbnMuZ2V0KFwibGlzdEl0ZW1zXCIpIHx8IDAsXG4gICAgICAgICAgICAgIGlzQXJyYXkobm9kZVZhbHVlKSA/IG5vZGVWYWx1ZS5sZW5ndGggOiAwXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgbWF4SXRlbXNcbiAgICAgICAgICApO1xuICAgICAgICAgIGZvciAobGV0IGkgPSBjb250cm9scy5sZW5ndGg7IGkgPCBhcnJheUxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb250cm9scy5wdXNoKFxuICAgICAgICAgICAgICBpc0FycmF5KG5vZGVWYWx1ZSlcbiAgICAgICAgICAgICAgICA/IGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGUoXG4gICAgICAgICAgICAgICAgICAgIGpzZixcbiAgICAgICAgICAgICAgICAgICAgbm9kZVZhbHVlW2ldLFxuICAgICAgICAgICAgICAgICAgICBzZXRWYWx1ZXMsXG4gICAgICAgICAgICAgICAgICAgIHNjaGVtYVJlZlBvaW50ZXIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGFQb2ludGVyICsgXCIvLVwiLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVBvaW50ZXIgKyBcIi9jb250cm9scy8tXCJcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICA6IGl0ZW1SZWN1cnNpdmVcbiAgICAgICAgICAgICAgICA/IG51bGxcbiAgICAgICAgICAgICAgICA6IGNsb25lRGVlcChqc2YudGVtcGxhdGVSZWZMaWJyYXJ5W2l0ZW1SZWZQb2ludGVyXSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4geyBjb250cm9sVHlwZSwgY29udHJvbHMsIHZhbGlkYXRvcnMgfTtcblxuICAgIGNhc2UgXCIkcmVmXCI6XG4gICAgICBjb25zdCBzY2hlbWFSZWYgPSBKc29uUG9pbnRlci5jb21waWxlKHNjaGVtYS4kcmVmKTtcbiAgICAgIGNvbnN0IGRhdGFSZWYgPSBKc29uUG9pbnRlci50b0RhdGFQb2ludGVyKHNjaGVtYVJlZiwgc2NoZW1hKTtcbiAgICAgIGNvbnN0IHJlZlBvaW50ZXIgPSByZW1vdmVSZWN1cnNpdmVSZWZlcmVuY2VzKFxuICAgICAgICBkYXRhUmVmLFxuICAgICAgICBqc2YuZGF0YVJlY3Vyc2l2ZVJlZk1hcCxcbiAgICAgICAganNmLmFycmF5TWFwXG4gICAgICApO1xuICAgICAgaWYgKHJlZlBvaW50ZXIgJiYgIWhhc093bihqc2YudGVtcGxhdGVSZWZMaWJyYXJ5LCByZWZQb2ludGVyKSkge1xuICAgICAgICAvLyBTZXQgdG8gbnVsbCBmaXJzdCB0byBwcmV2ZW50IHJlY3Vyc2l2ZSByZWZlcmVuY2UgZnJvbSBjYXVzaW5nIGVuZGxlc3MgbG9vcFxuICAgICAgICBqc2YudGVtcGxhdGVSZWZMaWJyYXJ5W3JlZlBvaW50ZXJdID0gbnVsbDtcbiAgICAgICAgY29uc3QgbmV3VGVtcGxhdGUgPSBidWlsZEZvcm1Hcm91cFRlbXBsYXRlKFxuICAgICAgICAgIGpzZixcbiAgICAgICAgICBzZXRWYWx1ZXMsXG4gICAgICAgICAgc2V0VmFsdWVzLFxuICAgICAgICAgIHNjaGVtYVJlZlxuICAgICAgICApO1xuICAgICAgICBpZiAobmV3VGVtcGxhdGUpIHtcbiAgICAgICAgICBqc2YudGVtcGxhdGVSZWZMaWJyYXJ5W3JlZlBvaW50ZXJdID0gbmV3VGVtcGxhdGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnlbcmVmUG9pbnRlcl07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuXG4gICAgY2FzZSBcIkZvcm1Db250cm9sXCI6XG4gICAgICBjb25zdCB2YWx1ZSA9IHtcbiAgICAgICAgdmFsdWU6IHNldFZhbHVlcyAmJiBpc1ByaW1pdGl2ZShub2RlVmFsdWUpID8gbm9kZVZhbHVlIDogbnVsbCxcbiAgICAgICAgZGlzYWJsZWQ6IG5vZGVPcHRpb25zLmdldChcImRpc2FibGVkXCIpIHx8IGZhbHNlLFxuICAgICAgfTtcbiAgICAgIHJldHVybiB7IGNvbnRyb2xUeXBlLCB2YWx1ZSwgdmFsaWRhdG9ycyB9O1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8qKlxuICogJ2J1aWxkRm9ybUdyb3VwJyBmdW5jdGlvblxuICpcbiAqIC8vIHthbnl9IHRlbXBsYXRlIC1cbiAqIC8vIHtBYnN0cmFjdENvbnRyb2x9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEZvcm1Hcm91cCh0ZW1wbGF0ZTogYW55KTogQWJzdHJhY3RDb250cm9sIHtcbiAgY29uc3QgdmFsaWRhdG9yRm5zOiBWYWxpZGF0b3JGbltdID0gW107XG4gIGxldCB2YWxpZGF0b3JGbjogVmFsaWRhdG9yRm4gPSBudWxsO1xuICAvLyBpZiAoaGFzT3duKHRlbXBsYXRlLCBcInZhbGlkYXRvcnNcIikpIHtcbiAgLy8gICBmb3JFYWNoKHRlbXBsYXRlLnZhbGlkYXRvcnMsIChwYXJhbWV0ZXJzLCB2YWxpZGF0b3IpID0+IHtcbiAgLy8gICAgIGlmICh0eXBlb2YgSnNvblZhbGlkYXRvcnNbdmFsaWRhdG9yXSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gIC8vICAgICAgIHZhbGlkYXRvckZucy5wdXNoKEpzb25WYWxpZGF0b3JzW3ZhbGlkYXRvcl0uYXBwbHkobnVsbCwgcGFyYW1ldGVycykpO1xuICAvLyAgICAgfVxuICAvLyAgIH0pO1xuICAvLyAgIGlmIChcbiAgLy8gICAgIHZhbGlkYXRvckZucy5sZW5ndGggJiZcbiAgLy8gICAgIGluQXJyYXkodGVtcGxhdGUuY29udHJvbFR5cGUsIFtcIkZvcm1Hcm91cFwiLCBcIkZvcm1BcnJheVwiXSlcbiAgLy8gICApIHtcbiAgLy8gICAgIHZhbGlkYXRvckZuID1cbiAgLy8gICAgICAgdmFsaWRhdG9yRm5zLmxlbmd0aCA+IDFcbiAgLy8gICAgICAgICA/IEpzb25WYWxpZGF0b3JzLmNvbXBvc2UodmFsaWRhdG9yRm5zKVxuICAvLyAgICAgICAgIDogdmFsaWRhdG9yRm5zWzBdO1xuICAvLyAgIH1cbiAgLy8gfVxuICBpZiAoaGFzT3duKHRlbXBsYXRlLCBcImNvbnRyb2xUeXBlXCIpKSB7XG4gICAgc3dpdGNoICh0ZW1wbGF0ZS5jb250cm9sVHlwZSkge1xuICAgICAgY2FzZSBcIkZvcm1Hcm91cFwiOlxuICAgICAgICBjb25zdCBncm91cENvbnRyb2xzOiB7IFtrZXk6IHN0cmluZ106IEFic3RyYWN0Q29udHJvbCB9ID0ge307XG4gICAgICAgIGZvckVhY2godGVtcGxhdGUuY29udHJvbHMsIChjb250cm9scywga2V5KSA9PiB7XG4gICAgICAgICAgY29uc3QgbmV3Q29udHJvbDogQWJzdHJhY3RDb250cm9sID0gYnVpbGRGb3JtR3JvdXAoY29udHJvbHMpO1xuICAgICAgICAgIGlmIChuZXdDb250cm9sKSB7XG4gICAgICAgICAgICBncm91cENvbnRyb2xzW2tleV0gPSBuZXdDb250cm9sO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBuZXcgRm9ybUdyb3VwKGdyb3VwQ29udHJvbHMsIHZhbGlkYXRvckZuKTtcbiAgICAgIGNhc2UgXCJGb3JtQXJyYXlcIjpcbiAgICAgICAgcmV0dXJuIG5ldyBGb3JtQXJyYXkoXG4gICAgICAgICAgZmlsdGVyKFxuICAgICAgICAgICAgbWFwKHRlbXBsYXRlLmNvbnRyb2xzLCAoY29udHJvbHMpID0+IGJ1aWxkRm9ybUdyb3VwKGNvbnRyb2xzKSlcbiAgICAgICAgICApLFxuICAgICAgICAgIHZhbGlkYXRvckZuXG4gICAgICAgICk7XG4gICAgICBjYXNlIFwiRm9ybUNvbnRyb2xcIjpcbiAgICAgICAgcmV0dXJuIG5ldyBGb3JtQ29udHJvbCh0ZW1wbGF0ZS52YWx1ZSwgdmFsaWRhdG9yRm5zKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogJ21lcmdlVmFsdWVzJyBmdW5jdGlvblxuICpcbiAqIC8vICB7YW55W119IC4uLnZhbHVlc1RvTWVyZ2UgLSBNdWx0aXBsZSB2YWx1ZXMgdG8gbWVyZ2VcbiAqIC8vIHthbnl9IC0gTWVyZ2VkIHZhbHVlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VWYWx1ZXMoLi4udmFsdWVzVG9NZXJnZSkge1xuICBsZXQgbWVyZ2VkVmFsdWVzOiBhbnkgPSBudWxsO1xuICBmb3IgKGNvbnN0IGN1cnJlbnRWYWx1ZSBvZiB2YWx1ZXNUb01lcmdlKSB7XG4gICAgaWYgKCFpc0VtcHR5KGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgIGlmIChcbiAgICAgICAgdHlwZW9mIGN1cnJlbnRWYWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAoaXNFbXB0eShtZXJnZWRWYWx1ZXMpIHx8IHR5cGVvZiBtZXJnZWRWYWx1ZXMgIT09IFwib2JqZWN0XCIpXG4gICAgICApIHtcbiAgICAgICAgaWYgKGlzQXJyYXkoY3VycmVudFZhbHVlKSkge1xuICAgICAgICAgIG1lcmdlZFZhbHVlcyA9IFsuLi5jdXJyZW50VmFsdWVdO1xuICAgICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgICBtZXJnZWRWYWx1ZXMgPSB7IC4uLmN1cnJlbnRWYWx1ZSB9O1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjdXJyZW50VmFsdWUgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgbWVyZ2VkVmFsdWVzID0gY3VycmVudFZhbHVlO1xuICAgICAgfSBlbHNlIGlmIChpc09iamVjdChtZXJnZWRWYWx1ZXMpICYmIGlzT2JqZWN0KGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihtZXJnZWRWYWx1ZXMsIGN1cnJlbnRWYWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KG1lcmdlZFZhbHVlcykgJiYgaXNBcnJheShjdXJyZW50VmFsdWUpKSB7XG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlcyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIGN1cnJlbnRWYWx1ZSkge1xuICAgICAgICAgIG5ld1ZhbHVlcy5wdXNoKG1lcmdlVmFsdWVzKG1lcmdlZFZhbHVlcywgdmFsdWUpKTtcbiAgICAgICAgfVxuICAgICAgICBtZXJnZWRWYWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgICB9IGVsc2UgaWYgKGlzQXJyYXkobWVyZ2VkVmFsdWVzKSAmJiBpc09iamVjdChjdXJyZW50VmFsdWUpKSB7XG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlcyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIG1lcmdlZFZhbHVlcykge1xuICAgICAgICAgIG5ld1ZhbHVlcy5wdXNoKG1lcmdlVmFsdWVzKHZhbHVlLCBjdXJyZW50VmFsdWUpKTtcbiAgICAgICAgfVxuICAgICAgICBtZXJnZWRWYWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgICB9IGVsc2UgaWYgKGlzQXJyYXkobWVyZ2VkVmFsdWVzKSAmJiBpc0FycmF5KGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWVzID0gW107XG4gICAgICAgIGZvciAoXG4gICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgIGkgPCBNYXRoLm1heChtZXJnZWRWYWx1ZXMubGVuZ3RoLCBjdXJyZW50VmFsdWUubGVuZ3RoKTtcbiAgICAgICAgICBpKytcbiAgICAgICAgKSB7XG4gICAgICAgICAgaWYgKGkgPCBtZXJnZWRWYWx1ZXMubGVuZ3RoICYmIGkgPCBjdXJyZW50VmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICBuZXdWYWx1ZXMucHVzaChtZXJnZVZhbHVlcyhtZXJnZWRWYWx1ZXNbaV0sIGN1cnJlbnRWYWx1ZVtpXSkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaSA8IG1lcmdlZFZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIG5ld1ZhbHVlcy5wdXNoKG1lcmdlZFZhbHVlc1tpXSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChpIDwgY3VycmVudFZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgICAgbmV3VmFsdWVzLnB1c2goY3VycmVudFZhbHVlW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbWVyZ2VkVmFsdWVzID0gbmV3VmFsdWVzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gbWVyZ2VkVmFsdWVzO1xufVxuXG4vKipcbiAqICdzZXRSZXF1aXJlZEZpZWxkcycgZnVuY3Rpb25cbiAqXG4gKiAvLyB7c2NoZW1hfSBzY2hlbWEgLSBKU09OIFNjaGVtYVxuICogLy8ge29iamVjdH0gZm9ybUNvbnRyb2xUZW1wbGF0ZSAtIEZvcm0gQ29udHJvbCBUZW1wbGF0ZSBvYmplY3RcbiAqIC8vIHtib29sZWFufSAtIHRydWUgaWYgYW55IGZpZWxkcyBoYXZlIGJlZW4gc2V0IHRvIHJlcXVpcmVkLCBmYWxzZSBpZiBub3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldFJlcXVpcmVkRmllbGRzKFxuICBzY2hlbWE6IGFueSxcbiAgZm9ybUNvbnRyb2xUZW1wbGF0ZTogYW55XG4pOiBib29sZWFuIHtcbiAgbGV0IGZpZWxkc1JlcXVpcmVkID0gZmFsc2U7XG4gIGlmIChoYXNPd24oc2NoZW1hLCBcInJlcXVpcmVkXCIpICYmICFpc0VtcHR5KHNjaGVtYS5yZXF1aXJlZCkpIHtcbiAgICBmaWVsZHNSZXF1aXJlZCA9IHRydWU7XG4gICAgbGV0IHJlcXVpcmVkQXJyYXkgPSBpc0FycmF5KHNjaGVtYS5yZXF1aXJlZClcbiAgICAgID8gc2NoZW1hLnJlcXVpcmVkXG4gICAgICA6IFtzY2hlbWEucmVxdWlyZWRdO1xuICAgIHJlcXVpcmVkQXJyYXkgPSBmb3JFYWNoKHJlcXVpcmVkQXJyYXksIChrZXkpID0+XG4gICAgICBKc29uUG9pbnRlci5zZXQoXG4gICAgICAgIGZvcm1Db250cm9sVGVtcGxhdGUsXG4gICAgICAgIFwiL1wiICsga2V5ICsgXCIvdmFsaWRhdG9ycy9yZXF1aXJlZFwiLFxuICAgICAgICBbXVxuICAgICAgKVxuICAgICk7XG4gIH1cbiAgcmV0dXJuIGZpZWxkc1JlcXVpcmVkO1xuXG4gIC8vIFRPRE86IEFkZCBzdXBwb3J0IGZvciBwYXR0ZXJuUHJvcGVydGllc1xuICAvLyBodHRwczovL3NwYWNldGVsZXNjb3BlLmdpdGh1Yi5pby91bmRlcnN0YW5kaW5nLWpzb24tc2NoZW1hL3JlZmVyZW5jZS9vYmplY3QuaHRtbCNwYXR0ZXJuLXByb3BlcnRpZXNcbn1cblxuLyoqXG4gKiAnZm9ybWF0Rm9ybURhdGEnIGZ1bmN0aW9uXG4gKlxuICogLy8ge2FueX0gZm9ybURhdGEgLSBBbmd1bGFyIEZvcm1Hcm91cCBkYXRhIG9iamVjdFxuICogLy8ge01hcDxzdHJpbmcsIGFueT59IGRhdGFNYXAgLVxuICogLy8ge01hcDxzdHJpbmcsIHN0cmluZz59IHJlY3Vyc2l2ZVJlZk1hcCAtXG4gKiAvLyB7TWFwPHN0cmluZywgbnVtYmVyPn0gYXJyYXlNYXAgLVxuICogLy8ge2Jvb2xlYW4gPSBmYWxzZX0gZml4RXJyb3JzIC0gaWYgVFJVRSwgdHJpZXMgdG8gZml4IGRhdGFcbiAqIC8vIHthbnl9IC0gZm9ybWF0dGVkIGRhdGEgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRGb3JtRGF0YShcbiAgZm9ybURhdGE6IGFueSxcbiAgZGF0YU1hcDogTWFwPHN0cmluZywgYW55PixcbiAgcmVjdXJzaXZlUmVmTWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+LFxuICBhcnJheU1hcDogTWFwPHN0cmluZywgbnVtYmVyPixcbiAgcmV0dXJuRW1wdHlGaWVsZHMgPSBmYWxzZSxcbiAgZml4RXJyb3JzID0gZmFsc2Vcbik6IGFueSB7XG4gIGlmIChmb3JtRGF0YSA9PT0gbnVsbCB8fCB0eXBlb2YgZm9ybURhdGEgIT09IFwib2JqZWN0XCIpIHtcbiAgICByZXR1cm4gZm9ybURhdGE7XG4gIH1cbiAgY29uc3QgZm9ybWF0dGVkRGF0YSA9IGlzQXJyYXkoZm9ybURhdGEpID8gW10gOiB7fTtcbiAgSnNvblBvaW50ZXIuZm9yRWFjaERlZXAoZm9ybURhdGEsICh2YWx1ZSwgZGF0YVBvaW50ZXIpID0+IHtcbiAgICAvLyBJZiByZXR1cm5FbXB0eUZpZWxkcyA9PT0gdHJ1ZSxcbiAgICAvLyBhZGQgZW1wdHkgYXJyYXlzIGFuZCBvYmplY3RzIHRvIGFsbCBhbGxvd2VkIGtleXNcbiAgICBpZiAocmV0dXJuRW1wdHlGaWVsZHMgJiYgaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIEpzb25Qb2ludGVyLnNldChmb3JtYXR0ZWREYXRhLCBkYXRhUG9pbnRlciwgW10pO1xuICAgIH0gZWxzZSBpZiAocmV0dXJuRW1wdHlGaWVsZHMgJiYgaXNPYmplY3QodmFsdWUpICYmICFpc0RhdGUodmFsdWUpKSB7XG4gICAgICBKc29uUG9pbnRlci5zZXQoZm9ybWF0dGVkRGF0YSwgZGF0YVBvaW50ZXIsIHt9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZ2VuZXJpY1BvaW50ZXIgPSBKc29uUG9pbnRlci5oYXMoZGF0YU1hcCwgW1xuICAgICAgICBkYXRhUG9pbnRlcixcbiAgICAgICAgXCJzY2hlbWFUeXBlXCIsXG4gICAgICBdKVxuICAgICAgICA/IGRhdGFQb2ludGVyXG4gICAgICAgIDogcmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlcyhkYXRhUG9pbnRlciwgcmVjdXJzaXZlUmVmTWFwLCBhcnJheU1hcCk7XG4gICAgICBpZiAoSnNvblBvaW50ZXIuaGFzKGRhdGFNYXAsIFtnZW5lcmljUG9pbnRlciwgXCJzY2hlbWFUeXBlXCJdKSkge1xuICAgICAgICBjb25zdCBzY2hlbWFUeXBlOlxuICAgICAgICAgIHwgU2NoZW1hUHJpbWl0aXZlVHlwZVxuICAgICAgICAgIHwgU2NoZW1hUHJpbWl0aXZlVHlwZVtdID0gZGF0YU1hcFxuICAgICAgICAgIC5nZXQoZ2VuZXJpY1BvaW50ZXIpXG4gICAgICAgICAgLmdldChcInNjaGVtYVR5cGVcIik7XG4gICAgICAgIGlmIChzY2hlbWFUeXBlID09PSBcIm51bGxcIikge1xuICAgICAgICAgIEpzb25Qb2ludGVyLnNldChmb3JtYXR0ZWREYXRhLCBkYXRhUG9pbnRlciwgbnVsbCk7XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgKGhhc1ZhbHVlKHZhbHVlKSB8fCByZXR1cm5FbXB0eUZpZWxkcykgJiZcbiAgICAgICAgICBpbkFycmF5KHNjaGVtYVR5cGUsIFtcInN0cmluZ1wiLCBcImludGVnZXJcIiwgXCJudW1iZXJcIiwgXCJib29sZWFuXCJdKVxuICAgICAgICApIHtcbiAgICAgICAgICBjb25zdCBuZXdWYWx1ZSA9XG4gICAgICAgICAgICBmaXhFcnJvcnMgfHwgKHZhbHVlID09PSBudWxsICYmIHJldHVybkVtcHR5RmllbGRzKVxuICAgICAgICAgICAgICA/IHRvU2NoZW1hVHlwZSh2YWx1ZSwgc2NoZW1hVHlwZSlcbiAgICAgICAgICAgICAgOiB0b0phdmFTY3JpcHRUeXBlKHZhbHVlLCBzY2hlbWFUeXBlKTtcbiAgICAgICAgICBpZiAoaXNEZWZpbmVkKG5ld1ZhbHVlKSB8fCByZXR1cm5FbXB0eUZpZWxkcykge1xuICAgICAgICAgICAgSnNvblBvaW50ZXIuc2V0KGZvcm1hdHRlZERhdGEsIGRhdGFQb2ludGVyLCBuZXdWYWx1ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSWYgcmV0dXJuRW1wdHlGaWVsZHMgPT09IGZhbHNlLFxuICAgICAgICAgIC8vIG9ubHkgYWRkIGVtcHR5IGFycmF5cyBhbmQgb2JqZWN0cyB0byByZXF1aXJlZCBrZXlzXG4gICAgICAgIH0gZWxzZSBpZiAoc2NoZW1hVHlwZSA9PT0gXCJvYmplY3RcIiAmJiAhcmV0dXJuRW1wdHlGaWVsZHMpIHtcbiAgICAgICAgICAoZGF0YU1hcC5nZXQoZ2VuZXJpY1BvaW50ZXIpLmdldChcInJlcXVpcmVkXCIpIHx8IFtdKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGtleVNjaGVtYVR5cGUgPSBkYXRhTWFwXG4gICAgICAgICAgICAgIC5nZXQoYCR7Z2VuZXJpY1BvaW50ZXJ9LyR7a2V5fWApXG4gICAgICAgICAgICAgIC5nZXQoXCJzY2hlbWFUeXBlXCIpO1xuICAgICAgICAgICAgaWYgKGtleVNjaGVtYVR5cGUgPT09IFwiYXJyYXlcIikge1xuICAgICAgICAgICAgICBKc29uUG9pbnRlci5zZXQoZm9ybWF0dGVkRGF0YSwgYCR7ZGF0YVBvaW50ZXJ9LyR7a2V5fWAsIFtdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5U2NoZW1hVHlwZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICBKc29uUG9pbnRlci5zZXQoZm9ybWF0dGVkRGF0YSwgYCR7ZGF0YVBvaW50ZXJ9LyR7a2V5fWAsIHt9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpbmlzaCBpbmNvbXBsZXRlICdkYXRlLXRpbWUnIGVudHJpZXNcbiAgICAgICAgaWYgKGRhdGFNYXAuZ2V0KGdlbmVyaWNQb2ludGVyKS5nZXQoXCJzY2hlbWFGb3JtYXRcIikgPT09IFwiZGF0ZS10aW1lXCIpIHtcbiAgICAgICAgICAvLyBcIjIwMDAtMDMtMTRUMDE6NTk6MjYuNTM1XCIgLT4gXCIyMDAwLTAzLTE0VDAxOjU5OjI2LjUzNVpcIiAoYWRkIFwiWlwiKVxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIC9eXFxkXFxkXFxkXFxkLVswLTFdXFxkLVswLTNdXFxkW3RcXHNdWzAtMl1cXGQ6WzAtNV1cXGQ6WzAtNV1cXGQoPzpcXC5cXGQrKT8kL2kudGVzdChcbiAgICAgICAgICAgICAgdmFsdWVcbiAgICAgICAgICAgIClcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIEpzb25Qb2ludGVyLnNldChmb3JtYXR0ZWREYXRhLCBkYXRhUG9pbnRlciwgYCR7dmFsdWV9WmApO1xuICAgICAgICAgICAgLy8gXCIyMDAwLTAzLTE0VDAxOjU5XCIgLT4gXCIyMDAwLTAzLTE0VDAxOjU5OjAwWlwiIChhZGQgXCI6MDBaXCIpXG4gICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIC9eXFxkXFxkXFxkXFxkLVswLTFdXFxkLVswLTNdXFxkW3RcXHNdWzAtMl1cXGQ6WzAtNV1cXGQkL2kudGVzdCh2YWx1ZSlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIEpzb25Qb2ludGVyLnNldChmb3JtYXR0ZWREYXRhLCBkYXRhUG9pbnRlciwgYCR7dmFsdWV9OjAwWmApO1xuICAgICAgICAgICAgLy8gXCIyMDAwLTAzLTE0XCIgLT4gXCIyMDAwLTAzLTE0VDAwOjAwOjAwWlwiIChhZGQgXCJUMDA6MDA6MDBaXCIpXG4gICAgICAgICAgfSBlbHNlIGlmIChmaXhFcnJvcnMgJiYgL15cXGRcXGRcXGRcXGQtWzAtMV1cXGQtWzAtM11cXGQkL2kudGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIEpzb25Qb2ludGVyLnNldChmb3JtYXR0ZWREYXRhLCBkYXRhUG9pbnRlciwgYCR7dmFsdWV9OjAwOjAwOjAwWmApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgdHlwZW9mIHZhbHVlICE9PSBcIm9iamVjdFwiIHx8XG4gICAgICAgIGlzRGF0ZSh2YWx1ZSkgfHxcbiAgICAgICAgKHZhbHVlID09PSBudWxsICYmIHJldHVybkVtcHR5RmllbGRzKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgXCJmb3JtYXRGb3JtRGF0YSBlcnJvcjogXCIgK1xuICAgICAgICAgICAgYFNjaGVtYSB0eXBlIG5vdCBmb3VuZCBmb3IgZm9ybSB2YWx1ZSBhdCAke2dlbmVyaWNQb2ludGVyfWBcbiAgICAgICAgKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImRhdGFNYXBcIiwgZGF0YU1hcCk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJyZWN1cnNpdmVSZWZNYXBcIiwgcmVjdXJzaXZlUmVmTWFwKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImdlbmVyaWNQb2ludGVyXCIsIGdlbmVyaWNQb2ludGVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZm9ybWF0dGVkRGF0YTtcbn1cblxuLyoqXG4gKiAnZ2V0Q29udHJvbCcgZnVuY3Rpb25cbiAqXG4gKiBVc2VzIGEgSlNPTiBQb2ludGVyIGZvciBhIGRhdGEgb2JqZWN0IHRvIHJldHJpZXZlIGEgY29udHJvbCBmcm9tXG4gKiBhbiBBbmd1bGFyIGZvcm1Hcm91cCBvciBmb3JtR3JvdXAgdGVtcGxhdGUuIChOb3RlOiB0aG91Z2ggYSBmb3JtR3JvdXBcbiAqIHRlbXBsYXRlIGlzIG11Y2ggc2ltcGxlciwgaXRzIGJhc2ljIHN0cnVjdHVyZSBpcyBpZGVudGlhbCB0byBhIGZvcm1Hcm91cCkuXG4gKlxuICogSWYgdGhlIG9wdGlvbmFsIHRoaXJkIHBhcmFtZXRlciAncmV0dXJuR3JvdXAnIGlzIHNldCB0byBUUlVFLCB0aGUgZ3JvdXBcbiAqIGNvbnRhaW5pbmcgdGhlIGNvbnRyb2wgaXMgcmV0dXJuZWQsIHJhdGhlciB0aGFuIHRoZSBjb250cm9sIGl0c2VsZi5cbiAqXG4gKiAvLyB7Rm9ybUdyb3VwfSBmb3JtR3JvdXAgLSBBbmd1bGFyIEZvcm1Hcm91cCB0byBnZXQgdmFsdWUgZnJvbVxuICogLy8ge1BvaW50ZXJ9IGRhdGFQb2ludGVyIC0gSlNPTiBQb2ludGVyIChzdHJpbmcgb3IgYXJyYXkpXG4gKiAvLyB7Ym9vbGVhbiA9IGZhbHNlfSByZXR1cm5Hcm91cCAtIElmIHRydWUsIHJldHVybiBncm91cCBjb250YWluaW5nIGNvbnRyb2xcbiAqIC8vIHtncm91cH0gLSBMb2NhdGVkIHZhbHVlIChvciBudWxsLCBpZiBubyBjb250cm9sIGZvdW5kKVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udHJvbChcbiAgZm9ybUdyb3VwOiBhbnksXG4gIGRhdGFQb2ludGVyOiBQb2ludGVyLFxuICByZXR1cm5Hcm91cCA9IGZhbHNlXG4pOiBhbnkge1xuICBpZiAoIWlzT2JqZWN0KGZvcm1Hcm91cCkgfHwgIUpzb25Qb2ludGVyLmlzSnNvblBvaW50ZXIoZGF0YVBvaW50ZXIpKSB7XG4gICAgaWYgKCFKc29uUG9pbnRlci5pc0pzb25Qb2ludGVyKGRhdGFQb2ludGVyKSkge1xuICAgICAgLy8gSWYgZGF0YVBvaW50ZXIgaW5wdXQgaXMgbm90IGEgdmFsaWQgSlNPTiBwb2ludGVyLCBjaGVjayB0b1xuICAgICAgLy8gc2VlIGlmIGl0IGlzIGluc3RlYWQgYSB2YWxpZCBvYmplY3QgcGF0aCwgdXNpbmcgZG90IG5vdGFpb25cbiAgICAgIGlmICh0eXBlb2YgZGF0YVBvaW50ZXIgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgY29uc3QgZm9ybUNvbnRyb2wgPSBmb3JtR3JvdXAuZ2V0KGRhdGFQb2ludGVyKTtcbiAgICAgICAgaWYgKGZvcm1Db250cm9sKSB7XG4gICAgICAgICAgcmV0dXJuIGZvcm1Db250cm9sO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zb2xlLmVycm9yKGBnZXRDb250cm9sIGVycm9yOiBJbnZhbGlkIEpTT04gUG9pbnRlcjogJHtkYXRhUG9pbnRlcn1gKTtcbiAgICB9XG4gICAgaWYgKCFpc09iamVjdChmb3JtR3JvdXApKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBnZXRDb250cm9sIGVycm9yOiBJbnZhbGlkIGZvcm1Hcm91cDogJHtmb3JtR3JvdXB9YCk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGxldCBkYXRhUG9pbnRlckFycmF5ID0gSnNvblBvaW50ZXIucGFyc2UoZGF0YVBvaW50ZXIpO1xuICBpZiAocmV0dXJuR3JvdXApIHtcbiAgICBkYXRhUG9pbnRlckFycmF5ID0gZGF0YVBvaW50ZXJBcnJheS5zbGljZSgwLCAtMSk7XG4gIH1cblxuICAvLyBJZiBmb3JtR3JvdXAgaW5wdXQgaXMgYSByZWFsIGZvcm1Hcm91cCAobm90IGEgZm9ybUdyb3VwIHRlbXBsYXRlKVxuICAvLyB0cnkgdXNpbmcgZm9ybUdyb3VwLmdldCgpIHRvIHJldHVybiB0aGUgY29udHJvbFxuICBpZiAoXG4gICAgdHlwZW9mIGZvcm1Hcm91cC5nZXQgPT09IFwiZnVuY3Rpb25cIiAmJlxuICAgIGRhdGFQb2ludGVyQXJyYXkuZXZlcnkoKGtleSkgPT4ga2V5LmluZGV4T2YoXCIuXCIpID09PSAtMSlcbiAgKSB7XG4gICAgY29uc3QgZm9ybUNvbnRyb2wgPSBmb3JtR3JvdXAuZ2V0KGRhdGFQb2ludGVyQXJyYXkuam9pbihcIi5cIikpO1xuICAgIGlmIChmb3JtQ29udHJvbCkge1xuICAgICAgcmV0dXJuIGZvcm1Db250cm9sO1xuICAgIH1cbiAgfVxuXG4gIC8vIElmIGZvcm1Hcm91cCBpbnB1dCBpcyBhIGZvcm1Hcm91cCB0ZW1wbGF0ZSxcbiAgLy8gb3IgZm9ybUdyb3VwLmdldCgpIGZhaWxlZCB0byByZXR1cm4gdGhlIGNvbnRyb2wsXG4gIC8vIHNlYXJjaCB0aGUgZm9ybUdyb3VwIG9iamVjdCBmb3IgZGF0YVBvaW50ZXIncyBjb250cm9sXG4gIGxldCBzdWJHcm91cCA9IGZvcm1Hcm91cDtcbiAgZm9yIChjb25zdCBrZXkgb2YgZGF0YVBvaW50ZXJBcnJheSkge1xuICAgIGlmIChoYXNPd24oc3ViR3JvdXAsIFwiY29udHJvbHNcIikpIHtcbiAgICAgIHN1Ykdyb3VwID0gc3ViR3JvdXAuY29udHJvbHM7XG4gICAgfVxuICAgIGlmIChpc0FycmF5KHN1Ykdyb3VwKSAmJiBrZXkgPT09IFwiLVwiKSB7XG4gICAgICBzdWJHcm91cCA9IHN1Ykdyb3VwW3N1Ykdyb3VwLmxlbmd0aCAtIDFdO1xuICAgIH0gZWxzZSBpZiAoaGFzT3duKHN1Ykdyb3VwLCBrZXkpKSB7XG4gICAgICBzdWJHcm91cCA9IHN1Ykdyb3VwW2tleV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgIGBnZXRDb250cm9sIGVycm9yOiBVbmFibGUgdG8gZmluZCBcIiR7a2V5fVwiIGl0ZW0gaW4gRm9ybUdyb3VwLmBcbiAgICAgICk7XG4gICAgICBjb25zb2xlLmVycm9yKGRhdGFQb2ludGVyKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZm9ybUdyb3VwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN1Ykdyb3VwO1xufVxuIl19