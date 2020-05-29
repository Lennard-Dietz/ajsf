/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import cloneDeep from "lodash/cloneDeep";
import Ajv from "ajv";
import jsonDraft6 from "ajv/lib/refs/json-schema-draft-06.json";
import { buildFormGroup, buildFormGroupTemplate, formatFormData, getControl, fixTitle, forEach, hasOwn, toTitleCase, buildLayout, getLayoutNode, buildSchemaFromData, buildSchemaFromLayout, removeRecursiveReferences, hasValue, isArray, isDefined, isEmpty, isObject, JsonPointer, } from "./shared";
import { enValidationMessages, frValidationMessages, itValidationMessages, ptValidationMessages, zhValidationMessages, } from "./locale";
import * as i0 from "@angular/core";
/**
 * @record
 */
export function TitleMapItem() { }
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
export function ErrorMessages() { }
export class JsonSchemaFormService {
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
/** @nocollapse */ JsonSchemaFormService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function JsonSchemaFormService_Factory() { return new JsonSchemaFormService(); }, token: JsonSchemaFormService, providedIn: "root" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFqc2YvY29yZS8iLCJzb3VyY2VzIjpbImxpYi9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLFNBQVMsTUFBTSxrQkFBa0IsQ0FBQztBQUN6QyxPQUFPLEdBQUcsTUFBTSxLQUFLLENBQUM7QUFDdEIsT0FBTyxVQUFVLE1BQU0sd0NBQXdDLENBQUM7QUFDaEUsT0FBTyxFQUNMLGNBQWMsRUFDZCxzQkFBc0IsRUFDdEIsY0FBYyxFQUNkLFVBQVUsRUFDVixRQUFRLEVBQ1IsT0FBTyxFQUNQLE1BQU0sRUFDTixXQUFXLEVBQ1gsV0FBVyxFQUNYLGFBQWEsRUFDYixtQkFBbUIsRUFDbkIscUJBQXFCLEVBQ3JCLHlCQUF5QixFQUN6QixRQUFRLEVBQ1IsT0FBTyxFQUNQLFNBQVMsRUFDVCxPQUFPLEVBQ1AsUUFBUSxFQUNSLFdBQVcsR0FDWixNQUFNLFVBQVUsQ0FBQztBQUNsQixPQUFPLEVBQ0wsb0JBQW9CLEVBQ3BCLG9CQUFvQixFQUNwQixvQkFBb0IsRUFDcEIsb0JBQW9CLEVBQ3BCLG9CQUFvQixHQUNyQixNQUFNLFVBQVUsQ0FBQzs7Ozs7QUFFbEIsa0NBTUM7OztJQUxDLDRCQUFjOztJQUNkLDZCQUFZOztJQUNaLCtCQUFrQjs7SUFDbEIsNkJBQWU7O0lBQ2YsNkJBQXVCOzs7OztBQUV6QixtQ0FLQztBQUtELE1BQU0sT0FBTyxxQkFBcUI7SUE0RmhDO1FBM0ZBLDBCQUFxQixHQUFHLEtBQUssQ0FBQztRQUM5QixxQ0FBZ0MsR0FBRyxLQUFLLENBQUM7UUFDekMsbUNBQThCLEdBQUcsS0FBSyxDQUFDO1FBQ3ZDLFlBQU8sR0FBUSxFQUFFLENBQUM7UUFF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QUFrQixDQUFDLEdBQUcsQ0FBQyxDQUM3QixDQUFDO1NBQ0g7UUFFRCxnQ0FBZ0M7UUFDaEMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzVELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQzs7O1lBbDBCRixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7Ozs7Ozs7SUFFQyxzREFBOEI7O0lBQzlCLGlFQUF5Qzs7SUFDekMsK0RBQXVDOztJQUN2Qyx3Q0FBa0I7O0lBRWxCLDJDQUlFOztJQUNGLG9DQUFvQzs7SUFDcEMsaURBQTZCOztJQUU3QiwyQ0FBcUI7O0lBQ3JCLHFDQUFlOztJQUNmLHVDQUFpQjs7SUFDakIsdUNBQW1COztJQUNuQixrREFBNEI7O0lBQzVCLDBDQUFzQjs7SUFDdEIsMENBQXNCOztJQUN0Qiw0Q0FBaUI7O0lBRWpCLDBDQUFzQjs7SUFDdEIsd0NBQXdCOztJQUN4QiwwQ0FBc0I7O0lBQ3RCLGlEQUE2Qjs7SUFDN0IsMkNBQTRCOztJQUM1QixzREFBa0M7O0lBQ2xDLDRDQUEwQzs7SUFDMUMsK0NBQTZDOztJQUM3Qyx1REFBcUQ7O0lBRXJELHlDQUEwQzs7SUFDMUMsd0NBQXNDOztJQUN0QyxvREFBcUQ7O0lBQ3JELHNEQUF1RDs7SUFDdkQsaURBQTJCOztJQUMzQixpREFBcUM7O0lBQ3JDLG1EQUE2Qjs7SUFDN0IsaURBQXlCOztJQUV6Qix5Q0FBbUI7O0lBR25CLG1EQTZDRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQWJzdHJhY3RDb250cm9sLCBGb3JtQXJyYXksIEZvcm1Hcm91cCB9IGZyb20gXCJAYW5ndWxhci9mb3Jtc1wiO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gXCJyeGpzXCI7XG5pbXBvcnQgY2xvbmVEZWVwIGZyb20gXCJsb2Rhc2gvY2xvbmVEZWVwXCI7XG5pbXBvcnQgQWp2IGZyb20gXCJhanZcIjtcbmltcG9ydCBqc29uRHJhZnQ2IGZyb20gXCJhanYvbGliL3JlZnMvanNvbi1zY2hlbWEtZHJhZnQtMDYuanNvblwiO1xuaW1wb3J0IHtcbiAgYnVpbGRGb3JtR3JvdXAsXG4gIGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGUsXG4gIGZvcm1hdEZvcm1EYXRhLFxuICBnZXRDb250cm9sLFxuICBmaXhUaXRsZSxcbiAgZm9yRWFjaCxcbiAgaGFzT3duLFxuICB0b1RpdGxlQ2FzZSxcbiAgYnVpbGRMYXlvdXQsXG4gIGdldExheW91dE5vZGUsXG4gIGJ1aWxkU2NoZW1hRnJvbURhdGEsXG4gIGJ1aWxkU2NoZW1hRnJvbUxheW91dCxcbiAgcmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlcyxcbiAgaGFzVmFsdWUsXG4gIGlzQXJyYXksXG4gIGlzRGVmaW5lZCxcbiAgaXNFbXB0eSxcbiAgaXNPYmplY3QsXG4gIEpzb25Qb2ludGVyLFxufSBmcm9tIFwiLi9zaGFyZWRcIjtcbmltcG9ydCB7XG4gIGVuVmFsaWRhdGlvbk1lc3NhZ2VzLFxuICBmclZhbGlkYXRpb25NZXNzYWdlcyxcbiAgaXRWYWxpZGF0aW9uTWVzc2FnZXMsXG4gIHB0VmFsaWRhdGlvbk1lc3NhZ2VzLFxuICB6aFZhbGlkYXRpb25NZXNzYWdlcyxcbn0gZnJvbSBcIi4vbG9jYWxlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGl0bGVNYXBJdGVtIHtcbiAgbmFtZT86IHN0cmluZztcbiAgdmFsdWU/OiBhbnk7XG4gIGNoZWNrZWQ/OiBib29sZWFuO1xuICBncm91cD86IHN0cmluZztcbiAgaXRlbXM/OiBUaXRsZU1hcEl0ZW1bXTtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgRXJyb3JNZXNzYWdlcyB7XG4gIFtjb250cm9sX25hbWU6IHN0cmluZ106IHtcbiAgICBtZXNzYWdlOiBzdHJpbmcgfCBGdW5jdGlvbiB8IE9iamVjdDtcbiAgICBjb2RlOiBzdHJpbmc7XG4gIH1bXTtcbn1cblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiBcInJvb3RcIixcbn0pXG5leHBvcnQgY2xhc3MgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIHtcbiAgSnNvbkZvcm1Db21wYXRpYmlsaXR5ID0gZmFsc2U7XG4gIFJlYWN0SnNvblNjaGVtYUZvcm1Db21wYXRpYmlsaXR5ID0gZmFsc2U7XG4gIEFuZ3VsYXJTY2hlbWFGb3JtQ29tcGF0aWJpbGl0eSA9IGZhbHNlO1xuICB0cGxkYXRhOiBhbnkgPSB7fTtcblxuICBhanZPcHRpb25zOiBhbnkgPSB7XG4gICAgYWxsRXJyb3JzOiB0cnVlLFxuICAgIGpzb25Qb2ludGVyczogdHJ1ZSxcbiAgICB1bmtub3duRm9ybWF0czogXCJpZ25vcmVcIixcbiAgfTtcbiAgYWp2OiBhbnkgPSBuZXcgQWp2KHRoaXMuYWp2T3B0aW9ucyk7IC8vIEFKVjogQW5vdGhlciBKU09OIFNjaGVtYSBWYWxpZGF0b3JcbiAgdmFsaWRhdGVGb3JtRGF0YTogYW55ID0gbnVsbDsgLy8gQ29tcGlsZWQgQUpWIGZ1bmN0aW9uIHRvIHZhbGlkYXRlIGFjdGl2ZSBmb3JtJ3Mgc2NoZW1hXG5cbiAgZm9ybVZhbHVlczogYW55ID0ge307IC8vIEludGVybmFsIGZvcm0gZGF0YSAobWF5IG5vdCBoYXZlIGNvcnJlY3QgdHlwZXMpXG4gIGRhdGE6IGFueSA9IHt9OyAvLyBPdXRwdXQgZm9ybSBkYXRhIChmb3JtVmFsdWVzLCBmb3JtYXR0ZWQgd2l0aCBjb3JyZWN0IGRhdGEgdHlwZXMpXG4gIHNjaGVtYTogYW55ID0ge307IC8vIEludGVybmFsIEpTT04gU2NoZW1hXG4gIGxheW91dDogYW55W10gPSBbXTsgLy8gSW50ZXJuYWwgZm9ybSBsYXlvdXRcbiAgZm9ybUdyb3VwVGVtcGxhdGU6IGFueSA9IHt9OyAvLyBUZW1wbGF0ZSB1c2VkIHRvIGNyZWF0ZSBmb3JtR3JvdXBcbiAgZm9ybUdyb3VwOiBhbnkgPSBudWxsOyAvLyBBbmd1bGFyIGZvcm1Hcm91cCwgd2hpY2ggcG93ZXJzIHRoZSByZWFjdGl2ZSBmb3JtXG4gIGZyYW1ld29yazogYW55ID0gbnVsbDsgLy8gQWN0aXZlIGZyYW1ld29yayBjb21wb25lbnRcbiAgZm9ybU9wdGlvbnM6IGFueTsgLy8gQWN0aXZlIG9wdGlvbnMsIHVzZWQgdG8gY29uZmlndXJlIHRoZSBmb3JtXG5cbiAgdmFsaWREYXRhOiBhbnkgPSBudWxsOyAvLyBWYWxpZCBmb3JtIGRhdGEgKG9yIG51bGwpICg9PT0gaXNWYWxpZCA/IGRhdGEgOiBudWxsKVxuICBpc1ZhbGlkOiBib29sZWFuID0gbnVsbDsgLy8gSXMgY3VycmVudCBmb3JtIGRhdGEgdmFsaWQ/XG4gIGFqdkVycm9yczogYW55ID0gbnVsbDsgLy8gQWp2IGVycm9ycyBmb3IgY3VycmVudCBkYXRhXG4gIHZhbGlkYXRpb25FcnJvcnM6IGFueSA9IG51bGw7IC8vIEFueSB2YWxpZGF0aW9uIGVycm9ycyBmb3IgY3VycmVudCBkYXRhXG4gIGRhdGFFcnJvcnM6IGFueSA9IG5ldyBNYXAoKTsgLy9cbiAgZm9ybVZhbHVlU3Vic2NyaXB0aW9uOiBhbnkgPSBudWxsOyAvLyBTdWJzY3JpcHRpb24gdG8gZm9ybUdyb3VwLnZhbHVlQ2hhbmdlcyBvYnNlcnZhYmxlIChmb3IgdW4tIGFuZCByZS1zdWJzY3JpYmluZylcbiAgZGF0YUNoYW5nZXM6IFN1YmplY3Q8YW55PiA9IG5ldyBTdWJqZWN0KCk7IC8vIEZvcm0gZGF0YSBvYnNlcnZhYmxlXG4gIGlzVmFsaWRDaGFuZ2VzOiBTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdCgpOyAvLyBpc1ZhbGlkIG9ic2VydmFibGVcbiAgdmFsaWRhdGlvbkVycm9yQ2hhbmdlczogU3ViamVjdDxhbnk+ID0gbmV3IFN1YmplY3QoKTsgLy8gdmFsaWRhdGlvbkVycm9ycyBvYnNlcnZhYmxlXG5cbiAgYXJyYXlNYXA6IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBuZXcgTWFwKCk7IC8vIE1hcHMgYXJyYXlzIGluIGRhdGEgb2JqZWN0IGFuZCBudW1iZXIgb2YgdHVwbGUgdmFsdWVzXG4gIGRhdGFNYXA6IE1hcDxzdHJpbmcsIGFueT4gPSBuZXcgTWFwKCk7IC8vIE1hcHMgcGF0aHMgaW4gZm9ybSBkYXRhIHRvIHNjaGVtYSBhbmQgZm9ybUdyb3VwIHBhdGhzXG4gIGRhdGFSZWN1cnNpdmVSZWZNYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7IC8vIE1hcHMgcmVjdXJzaXZlIHJlZmVyZW5jZSBwb2ludHMgaW4gZm9ybSBkYXRhXG4gIHNjaGVtYVJlY3Vyc2l2ZVJlZk1hcDogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTsgLy8gTWFwcyByZWN1cnNpdmUgcmVmZXJlbmNlIHBvaW50cyBpbiBzY2hlbWFcbiAgc2NoZW1hUmVmTGlicmFyeTogYW55ID0ge307IC8vIExpYnJhcnkgb2Ygc2NoZW1hcyBmb3IgcmVzb2x2aW5nIHNjaGVtYSAkcmVmc1xuICBsYXlvdXRSZWZMaWJyYXJ5OiBhbnkgPSB7IFwiXCI6IG51bGwgfTsgLy8gTGlicmFyeSBvZiBsYXlvdXQgbm9kZXMgZm9yIGFkZGluZyB0byBmb3JtXG4gIHRlbXBsYXRlUmVmTGlicmFyeTogYW55ID0ge307IC8vIExpYnJhcnkgb2YgZm9ybUdyb3VwIHRlbXBsYXRlcyBmb3IgYWRkaW5nIHRvIGZvcm1cbiAgaGFzUm9vdFJlZmVyZW5jZSA9IGZhbHNlOyAvLyBEb2VzIHRoZSBmb3JtIGluY2x1ZGUgYSByZWN1cnNpdmUgcmVmZXJlbmNlIHRvIGl0c2VsZj9cblxuICBsYW5ndWFnZSA9IFwiZW4tVVNcIjsgLy8gRG9lcyB0aGUgZm9ybSBpbmNsdWRlIGEgcmVjdXJzaXZlIHJlZmVyZW5jZSB0byBpdHNlbGY/XG5cbiAgLy8gRGVmYXVsdCBnbG9iYWwgZm9ybSBvcHRpb25zXG4gIGRlZmF1bHRGb3JtT3B0aW9uczogYW55ID0ge1xuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZSwgLy8gQWxsb3cgdGhlIHdlYiBicm93c2VyIHRvIHJlbWVtYmVyIHByZXZpb3VzIGZvcm0gc3VibWlzc2lvbiB2YWx1ZXMgYXMgZGVmYXVsdHNcbiAgICBhZGRTdWJtaXQ6IFwiYXV0b1wiLCAvLyBBZGQgYSBzdWJtaXQgYnV0dG9uIGlmIGxheW91dCBkb2VzIG5vdCBoYXZlIG9uZT9cbiAgICAvLyBmb3IgYWRkU3VibWl0OiB0cnVlID0gYWx3YXlzLCBmYWxzZSA9IG5ldmVyLFxuICAgIC8vICdhdXRvJyA9IG9ubHkgaWYgbGF5b3V0IGlzIHVuZGVmaW5lZCAoZm9ybSBpcyBidWlsdCBmcm9tIHNjaGVtYSBhbG9uZSlcbiAgICBkZWJ1ZzogZmFsc2UsIC8vIFNob3cgZGVidWdnaW5nIG91dHB1dD9cbiAgICBkaXNhYmxlSW52YWxpZFN1Ym1pdDogdHJ1ZSwgLy8gRGlzYWJsZSBzdWJtaXQgaWYgZm9ybSBpbnZhbGlkP1xuICAgIGZvcm1EaXNhYmxlZDogZmFsc2UsIC8vIFNldCBlbnRpcmUgZm9ybSBhcyBkaXNhYmxlZD8gKG5vdCBlZGl0YWJsZSwgYW5kIGRpc2FibGVzIG91dHB1dHMpXG4gICAgZm9ybVJlYWRvbmx5OiBmYWxzZSwgLy8gU2V0IGVudGlyZSBmb3JtIGFzIHJlYWQgb25seT8gKG5vdCBlZGl0YWJsZSwgYnV0IG91dHB1dHMgc3RpbGwgZW5hYmxlZClcbiAgICBmaWVsZHNSZXF1aXJlZDogZmFsc2UsIC8vIChzZXQgYXV0b21hdGljYWxseSkgQXJlIHRoZXJlIGFueSByZXF1aXJlZCBmaWVsZHMgaW4gdGhlIGZvcm0/XG4gICAgZnJhbWV3b3JrOiBcIm5vLWZyYW1ld29ya1wiLCAvLyBUaGUgZnJhbWV3b3JrIHRvIGxvYWRcbiAgICBsb2FkRXh0ZXJuYWxBc3NldHM6IGZhbHNlLCAvLyBMb2FkIGV4dGVybmFsIGNzcyBhbmQgSmF2YVNjcmlwdCBmb3IgZnJhbWV3b3JrP1xuICAgIHByaXN0aW5lOiB7IGVycm9yczogdHJ1ZSwgc3VjY2VzczogdHJ1ZSB9LFxuICAgIHN1cHJlc3NQcm9wZXJ0eVRpdGxlczogZmFsc2UsXG4gICAgc2V0U2NoZW1hRGVmYXVsdHM6IFwiYXV0b1wiLCAvLyBTZXQgZmVmYXVsdCB2YWx1ZXMgZnJvbSBzY2hlbWE/XG4gICAgLy8gdHJ1ZSA9IGFsd2F5cyBzZXQgKHVubGVzcyBvdmVycmlkZGVuIGJ5IGxheW91dCBkZWZhdWx0IG9yIGZvcm1WYWx1ZXMpXG4gICAgLy8gZmFsc2UgPSBuZXZlciBzZXRcbiAgICAvLyAnYXV0bycgPSBzZXQgaW4gYWRkYWJsZSBjb21wb25lbnRzLCBhbmQgZXZlcnl3aGVyZSBpZiBmb3JtVmFsdWVzIG5vdCBzZXRcbiAgICBzZXRMYXlvdXREZWZhdWx0czogXCJhdXRvXCIsIC8vIFNldCBmZWZhdWx0IHZhbHVlcyBmcm9tIGxheW91dD9cbiAgICAvLyB0cnVlID0gYWx3YXlzIHNldCAodW5sZXNzIG92ZXJyaWRkZW4gYnkgZm9ybVZhbHVlcylcbiAgICAvLyBmYWxzZSA9IG5ldmVyIHNldFxuICAgIC8vICdhdXRvJyA9IHNldCBpbiBhZGRhYmxlIGNvbXBvbmVudHMsIGFuZCBldmVyeXdoZXJlIGlmIGZvcm1WYWx1ZXMgbm90IHNldFxuICAgIHZhbGlkYXRlT25SZW5kZXI6IFwiYXV0b1wiLCAvLyBWYWxpZGF0ZSBmaWVsZHMgaW1tZWRpYXRlbHksIGJlZm9yZSB0aGV5IGFyZSB0b3VjaGVkP1xuICAgIC8vIHRydWUgPSB2YWxpZGF0ZSBhbGwgZmllbGRzIGltbWVkaWF0ZWx5XG4gICAgLy8gZmFsc2UgPSBvbmx5IHZhbGlkYXRlIGZpZWxkcyBhZnRlciB0aGV5IGFyZSB0b3VjaGVkIGJ5IHVzZXJcbiAgICAvLyAnYXV0bycgPSB2YWxpZGF0ZSBmaWVsZHMgd2l0aCB2YWx1ZXMgaW1tZWRpYXRlbHksIGVtcHR5IGZpZWxkcyBhZnRlciB0aGV5IGFyZSB0b3VjaGVkXG4gICAgd2lkZ2V0czoge30sIC8vIEFueSBjdXN0b20gd2lkZ2V0cyB0byBsb2FkXG4gICAgZGVmYXV0V2lkZ2V0T3B0aW9uczoge1xuICAgICAgLy8gRGVmYXVsdCBvcHRpb25zIGZvciBmb3JtIGNvbnRyb2wgd2lkZ2V0c1xuICAgICAgbGlzdEl0ZW1zOiAxLCAvLyBOdW1iZXIgb2YgbGlzdCBpdGVtcyB0byBpbml0aWFsbHkgYWRkIHRvIGFycmF5cyB3aXRoIG5vIGRlZmF1bHQgdmFsdWVcbiAgICAgIGFkZGFibGU6IHRydWUsIC8vIEFsbG93IGFkZGluZyBpdGVtcyB0byBhbiBhcnJheSBvciAkcmVmIHBvaW50P1xuICAgICAgb3JkZXJhYmxlOiB0cnVlLCAvLyBBbGxvdyByZW9yZGVyaW5nIGl0ZW1zIHdpdGhpbiBhbiBhcnJheT9cbiAgICAgIHJlbW92YWJsZTogdHJ1ZSwgLy8gQWxsb3cgcmVtb3ZpbmcgaXRlbXMgZnJvbSBhbiBhcnJheSBvciAkcmVmIHBvaW50P1xuICAgICAgZW5hYmxlRXJyb3JTdGF0ZTogdHJ1ZSwgLy8gQXBwbHkgJ2hhcy1lcnJvcicgY2xhc3Mgd2hlbiBmaWVsZCBmYWlscyB2YWxpZGF0aW9uP1xuICAgICAgLy8gZGlzYWJsZUVycm9yU3RhdGU6IGZhbHNlLCAvLyBEb24ndCBhcHBseSAnaGFzLWVycm9yJyBjbGFzcyB3aGVuIGZpZWxkIGZhaWxzIHZhbGlkYXRpb24/XG4gICAgICBlbmFibGVTdWNjZXNzU3RhdGU6IHRydWUsIC8vIEFwcGx5ICdoYXMtc3VjY2VzcycgY2xhc3Mgd2hlbiBmaWVsZCB2YWxpZGF0ZXM/XG4gICAgICAvLyBkaXNhYmxlU3VjY2Vzc1N0YXRlOiBmYWxzZSwgLy8gRG9uJ3QgYXBwbHkgJ2hhcy1zdWNjZXNzJyBjbGFzcyB3aGVuIGZpZWxkIHZhbGlkYXRlcz9cbiAgICAgIGZlZWRiYWNrOiBmYWxzZSwgLy8gU2hvdyBpbmxpbmUgZmVlZGJhY2sgaWNvbnM/XG4gICAgICBmZWVkYmFja09uUmVuZGVyOiBmYWxzZSwgLy8gU2hvdyBlcnJvck1lc3NhZ2Ugb24gUmVuZGVyP1xuICAgICAgbm90aXRsZTogZmFsc2UsIC8vIEhpZGUgdGl0bGU/XG4gICAgICBkaXNhYmxlZDogZmFsc2UsIC8vIFNldCBjb250cm9sIGFzIGRpc2FibGVkPyAobm90IGVkaXRhYmxlLCBhbmQgZXhjbHVkZWQgZnJvbSBvdXRwdXQpXG4gICAgICByZWFkb25seTogZmFsc2UsIC8vIFNldCBjb250cm9sIGFzIHJlYWQgb25seT8gKG5vdCBlZGl0YWJsZSwgYnV0IGluY2x1ZGVkIGluIG91dHB1dClcbiAgICAgIHJldHVybkVtcHR5RmllbGRzOiB0cnVlLCAvLyByZXR1cm4gdmFsdWVzIGZvciBmaWVsZHMgdGhhdCBjb250YWluIG5vIGRhdGE/XG4gICAgICB2YWxpZGF0aW9uTWVzc2FnZXM6IHt9LCAvLyBzZXQgYnkgc2V0TGFuZ3VhZ2UoKVxuICAgIH0sXG4gIH07XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZXRMYW5ndWFnZSh0aGlzLmxhbmd1YWdlKTtcbiAgICB0aGlzLmFqdi5hZGRNZXRhU2NoZW1hKGpzb25EcmFmdDYpO1xuICB9XG5cbiAgc2V0TGFuZ3VhZ2UobGFuZ3VhZ2U6IHN0cmluZyA9IFwiZW4tVVNcIikge1xuICAgIHRoaXMubGFuZ3VhZ2UgPSBsYW5ndWFnZTtcbiAgICBjb25zdCBsYW5ndWFnZVZhbGlkYXRpb25NZXNzYWdlcyA9IHtcbiAgICAgIGZyOiBmclZhbGlkYXRpb25NZXNzYWdlcyxcbiAgICAgIGVuOiBlblZhbGlkYXRpb25NZXNzYWdlcyxcbiAgICAgIGl0OiBpdFZhbGlkYXRpb25NZXNzYWdlcyxcbiAgICAgIHB0OiBwdFZhbGlkYXRpb25NZXNzYWdlcyxcbiAgICAgIHpoOiB6aFZhbGlkYXRpb25NZXNzYWdlcyxcbiAgICB9O1xuICAgIGNvbnN0IGxhbmd1YWdlQ29kZSA9IGxhbmd1YWdlLnNsaWNlKDAsIDIpO1xuXG4gICAgY29uc3QgdmFsaWRhdGlvbk1lc3NhZ2VzID0gbGFuZ3VhZ2VWYWxpZGF0aW9uTWVzc2FnZXNbbGFuZ3VhZ2VDb2RlXTtcblxuICAgIHRoaXMuZGVmYXVsdEZvcm1PcHRpb25zLmRlZmF1dFdpZGdldE9wdGlvbnMudmFsaWRhdGlvbk1lc3NhZ2VzID0gY2xvbmVEZWVwKFxuICAgICAgdmFsaWRhdGlvbk1lc3NhZ2VzXG4gICAgKTtcbiAgfVxuXG4gIGdldERhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YTtcbiAgfVxuXG4gIGdldFNjaGVtYSgpIHtcbiAgICByZXR1cm4gdGhpcy5zY2hlbWE7XG4gIH1cblxuICBnZXRMYXlvdXQoKSB7XG4gICAgcmV0dXJuIHRoaXMubGF5b3V0O1xuICB9XG5cbiAgcmVzZXRBbGxWYWx1ZXMoKSB7XG4gICAgdGhpcy5Kc29uRm9ybUNvbXBhdGliaWxpdHkgPSBmYWxzZTtcbiAgICB0aGlzLlJlYWN0SnNvblNjaGVtYUZvcm1Db21wYXRpYmlsaXR5ID0gZmFsc2U7XG4gICAgdGhpcy5Bbmd1bGFyU2NoZW1hRm9ybUNvbXBhdGliaWxpdHkgPSBmYWxzZTtcbiAgICB0aGlzLnRwbGRhdGEgPSB7fTtcbiAgICB0aGlzLnZhbGlkYXRlRm9ybURhdGEgPSBudWxsO1xuICAgIHRoaXMuZm9ybVZhbHVlcyA9IHt9O1xuICAgIHRoaXMuc2NoZW1hID0ge307XG4gICAgdGhpcy5sYXlvdXQgPSBbXTtcbiAgICB0aGlzLmZvcm1Hcm91cFRlbXBsYXRlID0ge307XG4gICAgdGhpcy5mb3JtR3JvdXAgPSBudWxsO1xuICAgIHRoaXMuZnJhbWV3b3JrID0gbnVsbDtcbiAgICB0aGlzLmRhdGEgPSB7fTtcbiAgICB0aGlzLnZhbGlkRGF0YSA9IG51bGw7XG4gICAgdGhpcy5pc1ZhbGlkID0gbnVsbDtcbiAgICB0aGlzLnZhbGlkYXRpb25FcnJvcnMgPSBudWxsO1xuICAgIHRoaXMuYXJyYXlNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5kYXRhTWFwID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuZGF0YVJlY3Vyc2l2ZVJlZk1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLnNjaGVtYVJlY3Vyc2l2ZVJlZk1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmxheW91dFJlZkxpYnJhcnkgPSB7fTtcbiAgICB0aGlzLnNjaGVtYVJlZkxpYnJhcnkgPSB7fTtcbiAgICB0aGlzLnRlbXBsYXRlUmVmTGlicmFyeSA9IHt9O1xuICAgIHRoaXMuZm9ybU9wdGlvbnMgPSBjbG9uZURlZXAodGhpcy5kZWZhdWx0Rm9ybU9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqICdidWlsZFJlbW90ZUVycm9yJyBmdW5jdGlvblxuICAgKlxuICAgKiBFeGFtcGxlIGVycm9yczpcbiAgICoge1xuICAgKiAgIGxhc3RfbmFtZTogWyB7XG4gICAqICAgICBtZXNzYWdlOiAnTGFzdCBuYW1lIG11c3QgYnkgc3RhcnQgd2l0aCBjYXBpdGFsIGxldHRlci4nLFxuICAgKiAgICAgY29kZTogJ2NhcGl0YWxfbGV0dGVyJ1xuICAgKiAgIH0gXSxcbiAgICogICBlbWFpbDogWyB7XG4gICAqICAgICBtZXNzYWdlOiAnRW1haWwgbXVzdCBiZSBmcm9tIGV4YW1wbGUuY29tIGRvbWFpbi4nLFxuICAgKiAgICAgY29kZTogJ3NwZWNpYWxfZG9tYWluJ1xuICAgKiAgIH0sIHtcbiAgICogICAgIG1lc3NhZ2U6ICdFbWFpbCBtdXN0IGNvbnRhaW4gYW4gQCBzeW1ib2wuJyxcbiAgICogICAgIGNvZGU6ICdhdF9zeW1ib2wnXG4gICAqICAgfSBdXG4gICAqIH1cbiAgICogLy97RXJyb3JNZXNzYWdlc30gZXJyb3JzXG4gICAqL1xuICBidWlsZFJlbW90ZUVycm9yKGVycm9yczogRXJyb3JNZXNzYWdlcykge1xuICAgIGZvckVhY2goZXJyb3JzLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgaWYgKGtleSBpbiB0aGlzLmZvcm1Hcm91cC5jb250cm9scykge1xuICAgICAgICBmb3IgKGNvbnN0IGVycm9yIG9mIHZhbHVlKSB7XG4gICAgICAgICAgY29uc3QgZXJyID0ge307XG4gICAgICAgICAgZXJyW2Vycm9yW1wiY29kZVwiXV0gPSBlcnJvcltcIm1lc3NhZ2VcIl07XG4gICAgICAgICAgdGhpcy5mb3JtR3JvdXAuZ2V0KGtleSkuc2V0RXJyb3JzKGVyciwgeyBlbWl0RXZlbnQ6IHRydWUgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHZhbGlkYXRlRGF0YShuZXdWYWx1ZTogYW55LCB1cGRhdGVTdWJzY3JpcHRpb25zID0gdHJ1ZSk6IHZvaWQge1xuICAgIC8vIEZvcm1hdCByYXcgZm9ybSBkYXRhIHRvIGNvcnJlY3QgZGF0YSB0eXBlc1xuICAgIHRoaXMuZGF0YSA9IGZvcm1hdEZvcm1EYXRhKFxuICAgICAgbmV3VmFsdWUsXG4gICAgICB0aGlzLmRhdGFNYXAsXG4gICAgICB0aGlzLmRhdGFSZWN1cnNpdmVSZWZNYXAsXG4gICAgICB0aGlzLmFycmF5TWFwLFxuICAgICAgdGhpcy5mb3JtT3B0aW9ucy5yZXR1cm5FbXB0eUZpZWxkc1xuICAgICk7XG4gICAgdGhpcy5pc1ZhbGlkID0gdGhpcy52YWxpZGF0ZUZvcm1EYXRhKHRoaXMuZGF0YSk7XG4gICAgdGhpcy52YWxpZERhdGEgPSB0aGlzLmlzVmFsaWQgPyB0aGlzLmRhdGEgOiBudWxsO1xuICAgIGNvbnN0IGNvbXBpbGVFcnJvcnMgPSAoZXJyb3JzKSA9PiB7XG4gICAgICBjb25zdCBjb21waWxlZEVycm9ycyA9IHt9O1xuICAgICAgKGVycm9ycyB8fCBbXSkuZm9yRWFjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgaWYgKCFjb21waWxlZEVycm9yc1tlcnJvci5kYXRhUGF0aF0pIHtcbiAgICAgICAgICBjb21waWxlZEVycm9yc1tlcnJvci5kYXRhUGF0aF0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBjb21waWxlZEVycm9yc1tlcnJvci5kYXRhUGF0aF0ucHVzaChlcnJvci5tZXNzYWdlKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGNvbXBpbGVkRXJyb3JzO1xuICAgIH07XG4gICAgdGhpcy5hanZFcnJvcnMgPSB0aGlzLnZhbGlkYXRlRm9ybURhdGEuZXJyb3JzO1xuICAgIHRoaXMudmFsaWRhdGlvbkVycm9ycyA9IGNvbXBpbGVFcnJvcnModGhpcy52YWxpZGF0ZUZvcm1EYXRhLmVycm9ycyk7XG4gICAgaWYgKHVwZGF0ZVN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuZGF0YUNoYW5nZXMubmV4dCh0aGlzLmRhdGEpO1xuICAgICAgdGhpcy5pc1ZhbGlkQ2hhbmdlcy5uZXh0KHRoaXMuaXNWYWxpZCk7XG4gICAgICB0aGlzLnZhbGlkYXRpb25FcnJvckNoYW5nZXMubmV4dCh0aGlzLmFqdkVycm9ycyk7XG4gICAgfVxuICB9XG5cbiAgYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZShmb3JtVmFsdWVzOiBhbnkgPSBudWxsLCBzZXRWYWx1ZXMgPSB0cnVlKSB7XG4gICAgdGhpcy5mb3JtR3JvdXBUZW1wbGF0ZSA9IGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGUoXG4gICAgICB0aGlzLFxuICAgICAgZm9ybVZhbHVlcyxcbiAgICAgIHNldFZhbHVlc1xuICAgICk7XG4gIH1cblxuICBidWlsZEZvcm1Hcm91cCgpIHtcbiAgICB0aGlzLmZvcm1Hcm91cCA9IDxGb3JtR3JvdXA+YnVpbGRGb3JtR3JvdXAodGhpcy5mb3JtR3JvdXBUZW1wbGF0ZSk7XG4gICAgaWYgKHRoaXMuZm9ybUdyb3VwKSB7XG4gICAgICB0aGlzLmNvbXBpbGVBanZTY2hlbWEoKTtcbiAgICAgIHRoaXMudmFsaWRhdGVEYXRhKHRoaXMuZm9ybUdyb3VwLnZhbHVlKTtcblxuICAgICAgLy8gU2V0IHVwIG9ic2VydmFibGVzIHRvIGVtaXQgZGF0YSBhbmQgdmFsaWRhdGlvbiBpbmZvIHdoZW4gZm9ybSBkYXRhIGNoYW5nZXNcbiAgICAgIGlmICh0aGlzLmZvcm1WYWx1ZVN1YnNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLmZvcm1WYWx1ZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5mb3JtVmFsdWVTdWJzY3JpcHRpb24gPSB0aGlzLmZvcm1Hcm91cC52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKFxuICAgICAgICAoZm9ybVZhbHVlKSA9PiB0aGlzLnZhbGlkYXRlRGF0YShmb3JtVmFsdWUpXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGJ1aWxkTGF5b3V0KHdpZGdldExpYnJhcnk6IGFueSkge1xuICAgIHRoaXMubGF5b3V0ID0gYnVpbGRMYXlvdXQodGhpcywgd2lkZ2V0TGlicmFyeSk7XG4gIH1cblxuICBzZXRPcHRpb25zKG5ld09wdGlvbnM6IGFueSkge1xuICAgIGlmIChpc09iamVjdChuZXdPcHRpb25zKSkge1xuICAgICAgY29uc3QgYWRkT3B0aW9ucyA9IGNsb25lRGVlcChuZXdPcHRpb25zKTtcbiAgICAgIC8vIEJhY2t3YXJkIGNvbXBhdGliaWxpdHkgZm9yICdkZWZhdWx0T3B0aW9ucycgKHJlbmFtZWQgJ2RlZmF1dFdpZGdldE9wdGlvbnMnKVxuICAgICAgaWYgKGlzT2JqZWN0KGFkZE9wdGlvbnMuZGVmYXVsdE9wdGlvbnMpKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgdGhpcy5mb3JtT3B0aW9ucy5kZWZhdXRXaWRnZXRPcHRpb25zLFxuICAgICAgICAgIGFkZE9wdGlvbnMuZGVmYXVsdE9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgICAgZGVsZXRlIGFkZE9wdGlvbnMuZGVmYXVsdE9wdGlvbnM7XG4gICAgICB9XG4gICAgICBpZiAoaXNPYmplY3QoYWRkT3B0aW9ucy5kZWZhdXRXaWRnZXRPcHRpb25zKSkge1xuICAgICAgICBPYmplY3QuYXNzaWduKFxuICAgICAgICAgIHRoaXMuZm9ybU9wdGlvbnMuZGVmYXV0V2lkZ2V0T3B0aW9ucyxcbiAgICAgICAgICBhZGRPcHRpb25zLmRlZmF1dFdpZGdldE9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgICAgZGVsZXRlIGFkZE9wdGlvbnMuZGVmYXV0V2lkZ2V0T3B0aW9ucztcbiAgICAgIH1cbiAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5mb3JtT3B0aW9ucywgYWRkT3B0aW9ucyk7XG5cbiAgICAgIC8vIGNvbnZlcnQgZGlzYWJsZUVycm9yU3RhdGUgLyBkaXNhYmxlU3VjY2Vzc1N0YXRlIHRvIGVuYWJsZS4uLlxuICAgICAgY29uc3QgZ2xvYmFsRGVmYXVsdHMgPSB0aGlzLmZvcm1PcHRpb25zLmRlZmF1dFdpZGdldE9wdGlvbnM7XG4gICAgICBbXCJFcnJvclN0YXRlXCIsIFwiU3VjY2Vzc1N0YXRlXCJdXG4gICAgICAgIC5maWx0ZXIoKHN1ZmZpeCkgPT4gaGFzT3duKGdsb2JhbERlZmF1bHRzLCBcImRpc2FibGVcIiArIHN1ZmZpeCkpXG4gICAgICAgIC5mb3JFYWNoKChzdWZmaXgpID0+IHtcbiAgICAgICAgICBnbG9iYWxEZWZhdWx0c1tcImVuYWJsZVwiICsgc3VmZml4XSA9ICFnbG9iYWxEZWZhdWx0c1tcbiAgICAgICAgICAgIFwiZGlzYWJsZVwiICsgc3VmZml4XG4gICAgICAgICAgXTtcbiAgICAgICAgICBkZWxldGUgZ2xvYmFsRGVmYXVsdHNbXCJkaXNhYmxlXCIgKyBzdWZmaXhdO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBjb21waWxlQWp2U2NoZW1hKCkge1xuICAgIGlmICghdGhpcy52YWxpZGF0ZUZvcm1EYXRhKSB7XG4gICAgICAvLyBpZiAndWk6b3JkZXInIGV4aXN0cyBpbiBwcm9wZXJ0aWVzLCBtb3ZlIGl0IHRvIHJvb3QgYmVmb3JlIGNvbXBpbGluZyB3aXRoIGFqdlxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5zY2hlbWEucHJvcGVydGllc1tcInVpOm9yZGVyXCJdKSkge1xuICAgICAgICB0aGlzLnNjaGVtYVtcInVpOm9yZGVyXCJdID0gdGhpcy5zY2hlbWEucHJvcGVydGllc1tcInVpOm9yZGVyXCJdO1xuICAgICAgICBkZWxldGUgdGhpcy5zY2hlbWEucHJvcGVydGllc1tcInVpOm9yZGVyXCJdO1xuICAgICAgfVxuICAgICAgdGhpcy5hanYucmVtb3ZlU2NoZW1hKHRoaXMuc2NoZW1hKTtcbiAgICAgIHRoaXMudmFsaWRhdGVGb3JtRGF0YSA9IHRoaXMuYWp2LmNvbXBpbGUodGhpcy5zY2hlbWEpO1xuICAgIH1cbiAgfVxuXG4gIGJ1aWxkU2NoZW1hRnJvbURhdGEoZGF0YT86IGFueSwgcmVxdWlyZUFsbEZpZWxkcyA9IGZhbHNlKTogYW55IHtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgcmV0dXJuIGJ1aWxkU2NoZW1hRnJvbURhdGEoZGF0YSwgcmVxdWlyZUFsbEZpZWxkcyk7XG4gICAgfVxuICAgIHRoaXMuc2NoZW1hID0gYnVpbGRTY2hlbWFGcm9tRGF0YSh0aGlzLmZvcm1WYWx1ZXMsIHJlcXVpcmVBbGxGaWVsZHMpO1xuICB9XG5cbiAgYnVpbGRTY2hlbWFGcm9tTGF5b3V0KGxheW91dD86IGFueSk6IGFueSB7XG4gICAgaWYgKGxheW91dCkge1xuICAgICAgcmV0dXJuIGJ1aWxkU2NoZW1hRnJvbUxheW91dChsYXlvdXQpO1xuICAgIH1cbiAgICB0aGlzLnNjaGVtYSA9IGJ1aWxkU2NoZW1hRnJvbUxheW91dCh0aGlzLmxheW91dCk7XG4gIH1cblxuICBzZXRUcGxkYXRhKG5ld1RwbGRhdGE6IGFueSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy50cGxkYXRhID0gbmV3VHBsZGF0YTtcbiAgfVxuXG4gIHBhcnNlVGV4dChcbiAgICB0ZXh0ID0gXCJcIixcbiAgICB2YWx1ZTogYW55ID0ge30sXG4gICAgdmFsdWVzOiBhbnkgPSB7fSxcbiAgICBrZXk6IG51bWJlciB8IHN0cmluZyA9IG51bGxcbiAgKTogc3RyaW5nIHtcbiAgICBpZiAoIXRleHQgfHwgIS97ey4rP319Ly50ZXN0KHRleHQpKSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgcmV0dXJuIHRleHQucmVwbGFjZSgve3soLis/KX19L2csICguLi5hKSA9PlxuICAgICAgdGhpcy5wYXJzZUV4cHJlc3Npb24oYVsxXSwgdmFsdWUsIHZhbHVlcywga2V5LCB0aGlzLnRwbGRhdGEpXG4gICAgKTtcbiAgfVxuXG4gIHBhcnNlRXhwcmVzc2lvbihcbiAgICBleHByZXNzaW9uID0gXCJcIixcbiAgICB2YWx1ZTogYW55ID0ge30sXG4gICAgdmFsdWVzOiBhbnkgPSB7fSxcbiAgICBrZXk6IG51bWJlciB8IHN0cmluZyA9IG51bGwsXG4gICAgdHBsZGF0YTogYW55ID0gbnVsbFxuICApIHtcbiAgICBpZiAodHlwZW9mIGV4cHJlc3Npb24gIT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgICBjb25zdCBpbmRleCA9IHR5cGVvZiBrZXkgPT09IFwibnVtYmVyXCIgPyBrZXkgKyAxICsgXCJcIiA6IGtleSB8fCBcIlwiO1xuICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnRyaW0oKTtcbiAgICBpZiAoXG4gICAgICAoZXhwcmVzc2lvblswXSA9PT0gXCInXCIgfHwgZXhwcmVzc2lvblswXSA9PT0gJ1wiJykgJiZcbiAgICAgIGV4cHJlc3Npb25bMF0gPT09IGV4cHJlc3Npb25bZXhwcmVzc2lvbi5sZW5ndGggLSAxXSAmJlxuICAgICAgZXhwcmVzc2lvbi5zbGljZSgxLCBleHByZXNzaW9uLmxlbmd0aCAtIDEpLmluZGV4T2YoZXhwcmVzc2lvblswXSkgPT09IC0xXG4gICAgKSB7XG4gICAgICByZXR1cm4gZXhwcmVzc2lvbi5zbGljZSgxLCBleHByZXNzaW9uLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgICBpZiAoZXhwcmVzc2lvbiA9PT0gXCJpZHhcIiB8fCBleHByZXNzaW9uID09PSBcIiRpbmRleFwiKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICAgIGlmIChleHByZXNzaW9uID09PSBcInZhbHVlXCIgJiYgIWhhc093bih2YWx1ZXMsIFwidmFsdWVcIikpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgWydcIicsIFwiJ1wiLCBcIiBcIiwgXCJ8fFwiLCBcIiYmXCIsIFwiK1wiXS5ldmVyeShcbiAgICAgICAgKGRlbGltKSA9PiBleHByZXNzaW9uLmluZGV4T2YoZGVsaW0pID09PSAtMVxuICAgICAgKVxuICAgICkge1xuICAgICAgY29uc3QgcG9pbnRlciA9IEpzb25Qb2ludGVyLnBhcnNlT2JqZWN0UGF0aChleHByZXNzaW9uKTtcbiAgICAgIHJldHVybiBwb2ludGVyWzBdID09PSBcInZhbHVlXCIgJiYgSnNvblBvaW50ZXIuaGFzKHZhbHVlLCBwb2ludGVyLnNsaWNlKDEpKVxuICAgICAgICA/IEpzb25Qb2ludGVyLmdldCh2YWx1ZSwgcG9pbnRlci5zbGljZSgxKSlcbiAgICAgICAgOiBwb2ludGVyWzBdID09PSBcInZhbHVlc1wiICYmIEpzb25Qb2ludGVyLmhhcyh2YWx1ZXMsIHBvaW50ZXIuc2xpY2UoMSkpXG4gICAgICAgID8gSnNvblBvaW50ZXIuZ2V0KHZhbHVlcywgcG9pbnRlci5zbGljZSgxKSlcbiAgICAgICAgOiBwb2ludGVyWzBdID09PSBcInRwbGRhdGFcIiAmJiBKc29uUG9pbnRlci5oYXModHBsZGF0YSwgcG9pbnRlci5zbGljZSgxKSlcbiAgICAgICAgPyBKc29uUG9pbnRlci5nZXQodHBsZGF0YSwgcG9pbnRlci5zbGljZSgxKSlcbiAgICAgICAgOiBKc29uUG9pbnRlci5oYXModmFsdWVzLCBwb2ludGVyKVxuICAgICAgICA/IEpzb25Qb2ludGVyLmdldCh2YWx1ZXMsIHBvaW50ZXIpXG4gICAgICAgIDogXCJcIjtcbiAgICB9XG4gICAgaWYgKGV4cHJlc3Npb24uaW5kZXhPZihcIltpZHhdXCIpID4gLTEpIHtcbiAgICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnJlcGxhY2UoL1xcW2lkeFxcXS9nLCA8c3RyaW5nPmluZGV4KTtcbiAgICB9XG4gICAgaWYgKGV4cHJlc3Npb24uaW5kZXhPZihcIlskaW5kZXhdXCIpID4gLTEpIHtcbiAgICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnJlcGxhY2UoL1xcWyRpbmRleFxcXS9nLCA8c3RyaW5nPmluZGV4KTtcbiAgICB9XG4gICAgLy8gVE9ETzogSW1wcm92ZSBleHByZXNzaW9uIGV2YWx1YXRpb24gYnkgcGFyc2luZyBxdW90ZWQgc3RyaW5ncyBmaXJzdFxuICAgIC8vIGxldCBleHByZXNzaW9uQXJyYXkgPSBleHByZXNzaW9uLm1hdGNoKC8oW15cIiddK3xcIlteXCJdK1wifCdbXiddKycpL2cpO1xuICAgIGlmIChleHByZXNzaW9uLmluZGV4T2YoXCJ8fFwiKSA+IC0xKSB7XG4gICAgICByZXR1cm4gZXhwcmVzc2lvblxuICAgICAgICAuc3BsaXQoXCJ8fFwiKVxuICAgICAgICAucmVkdWNlKFxuICAgICAgICAgIChhbGwsIHRlcm0pID0+XG4gICAgICAgICAgICBhbGwgfHwgdGhpcy5wYXJzZUV4cHJlc3Npb24odGVybSwgdmFsdWUsIHZhbHVlcywga2V5LCB0cGxkYXRhKSxcbiAgICAgICAgICBcIlwiXG4gICAgICAgICk7XG4gICAgfVxuICAgIGlmIChleHByZXNzaW9uLmluZGV4T2YoXCImJlwiKSA+IC0xKSB7XG4gICAgICByZXR1cm4gZXhwcmVzc2lvblxuICAgICAgICAuc3BsaXQoXCImJlwiKVxuICAgICAgICAucmVkdWNlKFxuICAgICAgICAgIChhbGwsIHRlcm0pID0+XG4gICAgICAgICAgICBhbGwgJiYgdGhpcy5wYXJzZUV4cHJlc3Npb24odGVybSwgdmFsdWUsIHZhbHVlcywga2V5LCB0cGxkYXRhKSxcbiAgICAgICAgICBcIiBcIlxuICAgICAgICApXG4gICAgICAgIC50cmltKCk7XG4gICAgfVxuICAgIGlmIChleHByZXNzaW9uLmluZGV4T2YoXCIrXCIpID4gLTEpIHtcbiAgICAgIHJldHVybiBleHByZXNzaW9uXG4gICAgICAgIC5zcGxpdChcIitcIilcbiAgICAgICAgLm1hcCgodGVybSkgPT4gdGhpcy5wYXJzZUV4cHJlc3Npb24odGVybSwgdmFsdWUsIHZhbHVlcywga2V5LCB0cGxkYXRhKSlcbiAgICAgICAgLmpvaW4oXCJcIik7XG4gICAgfVxuICAgIHJldHVybiBcIlwiO1xuICB9XG5cbiAgc2V0QXJyYXlJdGVtVGl0bGUoXG4gICAgcGFyZW50Q3R4OiBhbnkgPSB7fSxcbiAgICBjaGlsZE5vZGU6IGFueSA9IG51bGwsXG4gICAgaW5kZXg6IG51bWJlciA9IG51bGxcbiAgKTogc3RyaW5nIHtcbiAgICBjb25zdCBwYXJlbnROb2RlID0gcGFyZW50Q3R4LmxheW91dE5vZGU7XG4gICAgY29uc3QgcGFyZW50VmFsdWVzOiBhbnkgPSB0aGlzLmdldEZvcm1Db250cm9sVmFsdWUocGFyZW50Q3R4KTtcbiAgICBjb25zdCBpc0FycmF5SXRlbSA9XG4gICAgICAocGFyZW50Tm9kZS50eXBlIHx8IFwiXCIpLnNsaWNlKC01KSA9PT0gXCJhcnJheVwiICYmIGlzQXJyYXkocGFyZW50VmFsdWVzKTtcbiAgICBjb25zdCB0ZXh0ID0gSnNvblBvaW50ZXIuZ2V0Rmlyc3QoXG4gICAgICBpc0FycmF5SXRlbSAmJiBjaGlsZE5vZGUudHlwZSAhPT0gXCIkcmVmXCJcbiAgICAgICAgPyBbXG4gICAgICAgICAgICBbY2hpbGROb2RlLCBcIi9vcHRpb25zL2xlZ2VuZFwiXSxcbiAgICAgICAgICAgIFtjaGlsZE5vZGUsIFwiL29wdGlvbnMvdGl0bGVcIl0sXG4gICAgICAgICAgICBbcGFyZW50Tm9kZSwgXCIvb3B0aW9ucy90aXRsZVwiXSxcbiAgICAgICAgICAgIFtwYXJlbnROb2RlLCBcIi9vcHRpb25zL2xlZ2VuZFwiXSxcbiAgICAgICAgICBdXG4gICAgICAgIDogW1xuICAgICAgICAgICAgW2NoaWxkTm9kZSwgXCIvb3B0aW9ucy90aXRsZVwiXSxcbiAgICAgICAgICAgIFtjaGlsZE5vZGUsIFwiL29wdGlvbnMvbGVnZW5kXCJdLFxuICAgICAgICAgICAgW3BhcmVudE5vZGUsIFwiL29wdGlvbnMvdGl0bGVcIl0sXG4gICAgICAgICAgICBbcGFyZW50Tm9kZSwgXCIvb3B0aW9ucy9sZWdlbmRcIl0sXG4gICAgICAgICAgXVxuICAgICk7XG4gICAgaWYgKCF0ZXh0KSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgY29uc3QgY2hpbGRWYWx1ZSA9XG4gICAgICBpc0FycmF5KHBhcmVudFZhbHVlcykgJiYgaW5kZXggPCBwYXJlbnRWYWx1ZXMubGVuZ3RoXG4gICAgICAgID8gcGFyZW50VmFsdWVzW2luZGV4XVxuICAgICAgICA6IHBhcmVudFZhbHVlcztcbiAgICByZXR1cm4gdGhpcy5wYXJzZVRleHQodGV4dCwgY2hpbGRWYWx1ZSwgcGFyZW50VmFsdWVzLCBpbmRleCk7XG4gIH1cblxuICBzZXRJdGVtVGl0bGUoY3R4OiBhbnkpIHtcbiAgICByZXR1cm4gIWN0eC5vcHRpb25zLnRpdGxlICYmIC9eKFxcZCt8LSkkLy50ZXN0KGN0eC5sYXlvdXROb2RlLm5hbWUpXG4gICAgICA/IG51bGxcbiAgICAgIDogdGhpcy5wYXJzZVRleHQoXG4gICAgICAgICAgY3R4Lm9wdGlvbnMudGl0bGUgfHwgdG9UaXRsZUNhc2UoY3R4LmxheW91dE5vZGUubmFtZSksXG4gICAgICAgICAgdGhpcy5nZXRGb3JtQ29udHJvbFZhbHVlKHRoaXMpLFxuICAgICAgICAgICh0aGlzLmdldEZvcm1Db250cm9sR3JvdXAodGhpcykgfHwgPGFueT57fSkudmFsdWUsXG4gICAgICAgICAgY3R4LmRhdGFJbmRleFtjdHguZGF0YUluZGV4Lmxlbmd0aCAtIDFdXG4gICAgICAgICk7XG4gIH1cblxuICBldmFsdWF0ZUNvbmRpdGlvbihsYXlvdXROb2RlOiBhbnksIGRhdGFJbmRleDogbnVtYmVyW10pOiBib29sZWFuIHtcbiAgICBjb25zdCBhcnJheUluZGV4ID0gZGF0YUluZGV4ICYmIGRhdGFJbmRleFtkYXRhSW5kZXgubGVuZ3RoIC0gMV07XG4gICAgbGV0IHJlc3VsdCA9IHRydWU7XG4gICAgaWYgKGhhc1ZhbHVlKChsYXlvdXROb2RlLm9wdGlvbnMgfHwge30pLmNvbmRpdGlvbikpIHtcbiAgICAgIGlmICh0eXBlb2YgbGF5b3V0Tm9kZS5vcHRpb25zLmNvbmRpdGlvbiA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBsZXQgcG9pbnRlciA9IGxheW91dE5vZGUub3B0aW9ucy5jb25kaXRpb247XG4gICAgICAgIGlmIChoYXNWYWx1ZShhcnJheUluZGV4KSkge1xuICAgICAgICAgIHBvaW50ZXIgPSBwb2ludGVyLnJlcGxhY2UoXCJbYXJyYXlJbmRleF1cIiwgYFske2FycmF5SW5kZXh9XWApO1xuICAgICAgICB9XG4gICAgICAgIHBvaW50ZXIgPSBKc29uUG9pbnRlci5wYXJzZU9iamVjdFBhdGgocG9pbnRlcik7XG4gICAgICAgIHJlc3VsdCA9ICEhSnNvblBvaW50ZXIuZ2V0KHRoaXMuZGF0YSwgcG9pbnRlcik7XG4gICAgICAgIGlmICghcmVzdWx0ICYmIHBvaW50ZXJbMF0gPT09IFwibW9kZWxcIikge1xuICAgICAgICAgIHJlc3VsdCA9ICEhSnNvblBvaW50ZXIuZ2V0KHsgbW9kZWw6IHRoaXMuZGF0YSB9LCBwb2ludGVyKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbGF5b3V0Tm9kZS5vcHRpb25zLmNvbmRpdGlvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJlc3VsdCA9IGxheW91dE5vZGUub3B0aW9ucy5jb25kaXRpb24odGhpcy5kYXRhKTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHR5cGVvZiBsYXlvdXROb2RlLm9wdGlvbnMuY29uZGl0aW9uLmZ1bmN0aW9uQm9keSA9PT0gXCJzdHJpbmdcIlxuICAgICAgKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgZHluRm4gPSBuZXcgRnVuY3Rpb24oXG4gICAgICAgICAgICBcIm1vZGVsXCIsXG4gICAgICAgICAgICBcImFycmF5SW5kaWNlc1wiLFxuICAgICAgICAgICAgbGF5b3V0Tm9kZS5vcHRpb25zLmNvbmRpdGlvbi5mdW5jdGlvbkJvZHlcbiAgICAgICAgICApO1xuICAgICAgICAgIHJlc3VsdCA9IGR5bkZuKHRoaXMuZGF0YSwgZGF0YUluZGV4KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgIFwiY29uZGl0aW9uIGZ1bmN0aW9uQm9keSBlcnJvcmVkIG91dCBvbiBldmFsdWF0aW9uOiBcIiArXG4gICAgICAgICAgICAgIGxheW91dE5vZGUub3B0aW9ucy5jb25kaXRpb24uZnVuY3Rpb25Cb2R5XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaW5pdGlhbGl6ZUNvbnRyb2woY3R4OiBhbnksIGJpbmQgPSB0cnVlKTogYm9vbGVhbiB7XG4gICAgaWYgKCFpc09iamVjdChjdHgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChpc0VtcHR5KGN0eC5vcHRpb25zKSkge1xuICAgICAgY3R4Lm9wdGlvbnMgPSAhaXNFbXB0eSgoY3R4LmxheW91dE5vZGUgfHwge30pLm9wdGlvbnMpXG4gICAgICAgID8gY3R4LmxheW91dE5vZGUub3B0aW9uc1xuICAgICAgICA6IGNsb25lRGVlcCh0aGlzLmZvcm1PcHRpb25zKTtcbiAgICB9XG4gICAgY3R4LmZvcm1Db250cm9sID0gdGhpcy5nZXRGb3JtQ29udHJvbChjdHgpO1xuICAgIGN0eC5ib3VuZENvbnRyb2wgPSBiaW5kICYmICEhY3R4LmZvcm1Db250cm9sO1xuICAgIGlmIChjdHguZm9ybUNvbnRyb2wpIHtcbiAgICAgIGN0eC5jb250cm9sTmFtZSA9IHRoaXMuZ2V0Rm9ybUNvbnRyb2xOYW1lKGN0eCk7XG4gICAgICBjdHguY29udHJvbFZhbHVlID0gY3R4LmZvcm1Db250cm9sLnZhbHVlO1xuICAgICAgY3R4LmNvbnRyb2xEaXNhYmxlZCA9IGN0eC5mb3JtQ29udHJvbC5kaXNhYmxlZDtcbiAgICAgIC8vIEluaXRpYWwgZXJyb3IgbWVzc2FnZVxuICAgICAgY3R4Lm9wdGlvbnMuZXJyb3JNZXNzYWdlID1cbiAgICAgICAgY3R4LmZvcm1Db250cm9sLnN0YXR1cyA9PT0gXCJWQUxJRFwiXG4gICAgICAgICAgPyBudWxsXG4gICAgICAgICAgOiB0aGlzLmZvcm1hdEVycm9ycyhcbiAgICAgICAgICAgICAgY3R4LmZvcm1Db250cm9sLmVycm9ycyxcbiAgICAgICAgICAgICAgY3R4Lm9wdGlvbnMudmFsaWRhdGlvbk1lc3NhZ2VzXG4gICAgICAgICAgICApO1xuICAgICAgY3R4Lm9wdGlvbnMuc2hvd0Vycm9ycyA9XG4gICAgICAgIHRoaXMuZm9ybU9wdGlvbnMudmFsaWRhdGVPblJlbmRlciA9PT0gdHJ1ZSB8fFxuICAgICAgICAodGhpcy5mb3JtT3B0aW9ucy52YWxpZGF0ZU9uUmVuZGVyID09PSBcImF1dG9cIiAmJlxuICAgICAgICAgIGhhc1ZhbHVlKGN0eC5jb250cm9sVmFsdWUpKTtcbiAgICAgIC8vIFN1YnNjcmlwdGlvbiBmb3IgZXJyb3IgbWVzc2FnZXNcbiAgICAgIC8vIGN0eC5mb3JtQ29udHJvbC5zdGF0dXNDaGFuZ2VzLnN1YnNjcmliZShcbiAgICAgIC8vICAgKHN0YXR1cykgPT5cbiAgICAgIC8vICAgICAoY3R4Lm9wdGlvbnMuZXJyb3JNZXNzYWdlID1cbiAgICAgIC8vICAgICAgIHN0YXR1cyA9PT0gXCJWQUxJRFwiXG4gICAgICAvLyAgICAgICAgID8gbnVsbFxuICAgICAgLy8gICAgICAgICA6IHRoaXMuZm9ybWF0RXJyb3JzKFxuICAgICAgLy8gICAgICAgICAgICAgY3R4LmZvcm1Db250cm9sLmVycm9ycyxcbiAgICAgIC8vICAgICAgICAgICAgIGN0eC5vcHRpb25zLnZhbGlkYXRpb25NZXNzYWdlc1xuICAgICAgLy8gICAgICAgICAgICkpXG4gICAgICAvLyApO1xuICAgICAgdGhpcy52YWxpZGF0aW9uRXJyb3JDaGFuZ2VzLnN1YnNjcmliZSgoZXJyb3JzKSA9PiB7XG4gICAgICAgIGN0eC5vcHRpb25zLmVycm9yTWVzc2FnZSA9IGAke2Vycm9yc31gO1xuICAgICAgfSk7XG4gICAgICBjdHguZm9ybUNvbnRyb2wudmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgodmFsdWUpID0+IHtcbiAgICAgICAgaWYgKCEhdmFsdWUpIHtcbiAgICAgICAgICBjdHguY29udHJvbFZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdHguY29udHJvbE5hbWUgPSBjdHgubGF5b3V0Tm9kZS5uYW1lO1xuICAgICAgY3R4LmNvbnRyb2xWYWx1ZSA9IGN0eC5sYXlvdXROb2RlLnZhbHVlIHx8IG51bGw7XG4gICAgICBjb25zdCBkYXRhUG9pbnRlciA9IHRoaXMuZ2V0RGF0YVBvaW50ZXIoY3R4KTtcbiAgICAgIGlmIChiaW5kICYmIGRhdGFQb2ludGVyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgYHdhcm5pbmc6IGNvbnRyb2wgXCIke2RhdGFQb2ludGVyfVwiIGlzIG5vdCBib3VuZCB0byB0aGUgQW5ndWxhciBGb3JtR3JvdXAuYFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY3R4LmJvdW5kQ29udHJvbDtcbiAgfVxuXG4gIGZvcm1hdEVycm9ycyhlcnJvcnM6IGFueSwgdmFsaWRhdGlvbk1lc3NhZ2VzOiBhbnkgPSB7fSk6IHN0cmluZyB7XG4gICAgaWYgKGlzRW1wdHkoZXJyb3JzKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICghaXNPYmplY3QodmFsaWRhdGlvbk1lc3NhZ2VzKSkge1xuICAgICAgdmFsaWRhdGlvbk1lc3NhZ2VzID0ge307XG4gICAgfVxuICAgIGNvbnN0IGFkZFNwYWNlcyA9IChzdHJpbmcpID0+XG4gICAgICBzdHJpbmdbMF0udG9VcHBlckNhc2UoKSArXG4gICAgICAoc3RyaW5nLnNsaWNlKDEpIHx8IFwiXCIpXG4gICAgICAgIC5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCBcIiQxICQyXCIpXG4gICAgICAgIC5yZXBsYWNlKC9fL2csIFwiIFwiKTtcbiAgICBjb25zdCBmb3JtYXRFcnJvciA9IChlcnJvcikgPT5cbiAgICAgIHR5cGVvZiBlcnJvciA9PT0gXCJvYmplY3RcIlxuICAgICAgICA/IE9iamVjdC5rZXlzKGVycm9yKVxuICAgICAgICAgICAgLm1hcCgoa2V5KSA9PlxuICAgICAgICAgICAgICBlcnJvcltrZXldID09PSB0cnVlXG4gICAgICAgICAgICAgICAgPyBhZGRTcGFjZXMoa2V5KVxuICAgICAgICAgICAgICAgIDogZXJyb3Jba2V5XSA9PT0gZmFsc2VcbiAgICAgICAgICAgICAgICA/IFwiTm90IFwiICsgYWRkU3BhY2VzKGtleSlcbiAgICAgICAgICAgICAgICA6IGFkZFNwYWNlcyhrZXkpICsgXCI6IFwiICsgZm9ybWF0RXJyb3IoZXJyb3Jba2V5XSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5qb2luKFwiLCBcIilcbiAgICAgICAgOiBhZGRTcGFjZXMoZXJyb3IudG9TdHJpbmcoKSk7XG4gICAgY29uc3QgbWVzc2FnZXMgPSBbXTtcbiAgICByZXR1cm4gKFxuICAgICAgT2JqZWN0LmtleXMoZXJyb3JzKVxuICAgICAgICAvLyBIaWRlICdyZXF1aXJlZCcgZXJyb3IsIHVubGVzcyBpdCBpcyB0aGUgb25seSBvbmVcbiAgICAgICAgLmZpbHRlcihcbiAgICAgICAgICAoZXJyb3JLZXkpID0+XG4gICAgICAgICAgICBlcnJvcktleSAhPT0gXCJyZXF1aXJlZFwiIHx8IE9iamVjdC5rZXlzKGVycm9ycykubGVuZ3RoID09PSAxXG4gICAgICAgIClcbiAgICAgICAgLm1hcCgoZXJyb3JLZXkpID0+XG4gICAgICAgICAgLy8gSWYgdmFsaWRhdGlvbk1lc3NhZ2VzIGlzIGEgc3RyaW5nLCByZXR1cm4gaXRcbiAgICAgICAgICB0eXBlb2YgdmFsaWRhdGlvbk1lc3NhZ2VzID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICA/IHZhbGlkYXRpb25NZXNzYWdlc1xuICAgICAgICAgICAgOiAvLyBJZiBjdXN0b20gZXJyb3IgbWVzc2FnZSBpcyBhIGZ1bmN0aW9uLCByZXR1cm4gZnVuY3Rpb24gcmVzdWx0XG4gICAgICAgICAgICB0eXBlb2YgdmFsaWRhdGlvbk1lc3NhZ2VzW2Vycm9yS2V5XSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICA/IHZhbGlkYXRpb25NZXNzYWdlc1tlcnJvcktleV0oZXJyb3JzW2Vycm9yS2V5XSlcbiAgICAgICAgICAgIDogLy8gSWYgY3VzdG9tIGVycm9yIG1lc3NhZ2UgaXMgYSBzdHJpbmcsIHJlcGxhY2UgcGxhY2Vob2xkZXJzIGFuZCByZXR1cm5cbiAgICAgICAgICAgIHR5cGVvZiB2YWxpZGF0aW9uTWVzc2FnZXNbZXJyb3JLZXldID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICA/IC8vIERvZXMgZXJyb3IgbWVzc2FnZSBoYXZlIGFueSB7e3Byb3BlcnR5fX0gcGxhY2Vob2xkZXJzP1xuICAgICAgICAgICAgICAhL3t7Lis/fX0vLnRlc3QodmFsaWRhdGlvbk1lc3NhZ2VzW2Vycm9yS2V5XSlcbiAgICAgICAgICAgICAgPyB2YWxpZGF0aW9uTWVzc2FnZXNbZXJyb3JLZXldXG4gICAgICAgICAgICAgIDogLy8gUmVwbGFjZSB7e3Byb3BlcnR5fX0gcGxhY2Vob2xkZXJzIHdpdGggdmFsdWVzXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoZXJyb3JzW2Vycm9yS2V5XSkucmVkdWNlKFxuICAgICAgICAgICAgICAgICAgKGVycm9yTWVzc2FnZSwgZXJyb3JQcm9wZXJ0eSkgPT5cbiAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgICAgICAgbmV3IFJlZ0V4cChcInt7XCIgKyBlcnJvclByb3BlcnR5ICsgXCJ9fVwiLCBcImdcIiksXG4gICAgICAgICAgICAgICAgICAgICAgZXJyb3JzW2Vycm9yS2V5XVtlcnJvclByb3BlcnR5XVxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbk1lc3NhZ2VzW2Vycm9yS2V5XVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIDogLy8gSWYgbm8gY3VzdG9tIGVycm9yIG1lc3NhZ2UsIHJldHVybiBmb3JtYXR0ZWQgZXJyb3IgZGF0YSBpbnN0ZWFkXG4gICAgICAgICAgICAgIGFkZFNwYWNlcyhlcnJvcktleSkgKyBcIiBFcnJvcjogXCIgKyBmb3JtYXRFcnJvcihlcnJvcnNbZXJyb3JLZXldKVxuICAgICAgICApXG4gICAgICAgIC5qb2luKFwiPGJyPlwiKVxuICAgICk7XG4gIH1cblxuICB1cGRhdGVWYWx1ZShjdHg6IGFueSwgdmFsdWU6IGFueSk6IHZvaWQge1xuICAgIC8vIFNldCB2YWx1ZSBvZiBjdXJyZW50IGNvbnRyb2xcbiAgICBjdHguY29udHJvbFZhbHVlID0gdmFsdWU7XG4gICAgaWYgKGN0eC5ib3VuZENvbnRyb2wpIHtcbiAgICAgIGN0eC5mb3JtQ29udHJvbC5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgICBjdHguZm9ybUNvbnRyb2wubWFya0FzRGlydHkoKTtcbiAgICB9XG4gICAgY3R4LmxheW91dE5vZGUudmFsdWUgPSB2YWx1ZTtcblxuICAgIC8vIFNldCB2YWx1ZXMgb2YgYW55IHJlbGF0ZWQgY29udHJvbHMgaW4gY29weVZhbHVlVG8gYXJyYXlcbiAgICBpZiAoaXNBcnJheShjdHgub3B0aW9ucy5jb3B5VmFsdWVUbykpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBjdHgub3B0aW9ucy5jb3B5VmFsdWVUbykge1xuICAgICAgICBjb25zdCB0YXJnZXRDb250cm9sID0gZ2V0Q29udHJvbCh0aGlzLmZvcm1Hcm91cCwgaXRlbSk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBpc09iamVjdCh0YXJnZXRDb250cm9sKSAmJlxuICAgICAgICAgIHR5cGVvZiB0YXJnZXRDb250cm9sLnNldFZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGFyZ2V0Q29udHJvbC5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgICAgdGFyZ2V0Q29udHJvbC5tYXJrQXNEaXJ0eSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQXJyYXlDaGVja2JveExpc3QoY3R4OiBhbnksIGNoZWNrYm94TGlzdDogVGl0bGVNYXBJdGVtW10pOiB2b2lkIHtcbiAgICBjb25zdCBmb3JtQXJyYXkgPSA8Rm9ybUFycmF5PnRoaXMuZ2V0Rm9ybUNvbnRyb2woY3R4KTtcblxuICAgIC8vIFJlbW92ZSBhbGwgZXhpc3RpbmcgaXRlbXNcbiAgICB3aGlsZSAoZm9ybUFycmF5LnZhbHVlLmxlbmd0aCkge1xuICAgICAgZm9ybUFycmF5LnJlbW92ZUF0KDApO1xuICAgIH1cblxuICAgIC8vIFJlLWFkZCBhbiBpdGVtIGZvciBlYWNoIGNoZWNrZWQgYm94XG4gICAgY29uc3QgcmVmUG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoXG4gICAgICBjdHgubGF5b3V0Tm9kZS5kYXRhUG9pbnRlciArIFwiLy1cIixcbiAgICAgIHRoaXMuZGF0YVJlY3Vyc2l2ZVJlZk1hcCxcbiAgICAgIHRoaXMuYXJyYXlNYXBcbiAgICApO1xuICAgIGZvciAoY29uc3QgY2hlY2tib3hJdGVtIG9mIGNoZWNrYm94TGlzdCkge1xuICAgICAgaWYgKGNoZWNrYm94SXRlbS5jaGVja2VkKSB7XG4gICAgICAgIGNvbnN0IG5ld0Zvcm1Db250cm9sID0gYnVpbGRGb3JtR3JvdXAoXG4gICAgICAgICAgdGhpcy50ZW1wbGF0ZVJlZkxpYnJhcnlbcmVmUG9pbnRlcl1cbiAgICAgICAgKTtcbiAgICAgICAgbmV3Rm9ybUNvbnRyb2wuc2V0VmFsdWUoY2hlY2tib3hJdGVtLnZhbHVlKTtcbiAgICAgICAgZm9ybUFycmF5LnB1c2gobmV3Rm9ybUNvbnRyb2wpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3JtQXJyYXkubWFya0FzRGlydHkoKTtcbiAgfVxuXG4gIGdldEZvcm1Db250cm9sKGN0eDogYW55KTogQWJzdHJhY3RDb250cm9sIHtcbiAgICBpZiAoXG4gICAgICAhY3R4LmxheW91dE5vZGUgfHxcbiAgICAgICFpc0RlZmluZWQoY3R4LmxheW91dE5vZGUuZGF0YVBvaW50ZXIpIHx8XG4gICAgICBjdHgubGF5b3V0Tm9kZS50eXBlID09PSBcIiRyZWZcIlxuICAgICkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBnZXRDb250cm9sKHRoaXMuZm9ybUdyb3VwLCB0aGlzLmdldERhdGFQb2ludGVyKGN0eCkpO1xuICB9XG5cbiAgZ2V0Rm9ybUNvbnRyb2xWYWx1ZShjdHg6IGFueSk6IEFic3RyYWN0Q29udHJvbCB7XG4gICAgaWYgKFxuICAgICAgIWN0eC5sYXlvdXROb2RlIHx8XG4gICAgICAhaXNEZWZpbmVkKGN0eC5sYXlvdXROb2RlLmRhdGFQb2ludGVyKSB8fFxuICAgICAgY3R4LmxheW91dE5vZGUudHlwZSA9PT0gXCIkcmVmXCJcbiAgICApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBjb250cm9sID0gZ2V0Q29udHJvbCh0aGlzLmZvcm1Hcm91cCwgdGhpcy5nZXREYXRhUG9pbnRlcihjdHgpKTtcbiAgICByZXR1cm4gY29udHJvbCA/IGNvbnRyb2wudmFsdWUgOiBudWxsO1xuICB9XG5cbiAgZ2V0Rm9ybUNvbnRyb2xHcm91cChjdHg6IGFueSk6IEZvcm1BcnJheSB8IEZvcm1Hcm91cCB7XG4gICAgaWYgKCFjdHgubGF5b3V0Tm9kZSB8fCAhaXNEZWZpbmVkKGN0eC5sYXlvdXROb2RlLmRhdGFQb2ludGVyKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBnZXRDb250cm9sKHRoaXMuZm9ybUdyb3VwLCB0aGlzLmdldERhdGFQb2ludGVyKGN0eCksIHRydWUpO1xuICB9XG5cbiAgZ2V0Rm9ybUNvbnRyb2xOYW1lKGN0eDogYW55KTogc3RyaW5nIHtcbiAgICBpZiAoXG4gICAgICAhY3R4LmxheW91dE5vZGUgfHxcbiAgICAgICFpc0RlZmluZWQoY3R4LmxheW91dE5vZGUuZGF0YVBvaW50ZXIpIHx8XG4gICAgICAhaGFzVmFsdWUoY3R4LmRhdGFJbmRleClcbiAgICApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gSnNvblBvaW50ZXIudG9LZXkodGhpcy5nZXREYXRhUG9pbnRlcihjdHgpKTtcbiAgfVxuXG4gIGdldExheW91dEFycmF5KGN0eDogYW55KTogYW55W10ge1xuICAgIHJldHVybiBKc29uUG9pbnRlci5nZXQodGhpcy5sYXlvdXQsIHRoaXMuZ2V0TGF5b3V0UG9pbnRlcihjdHgpLCAwLCAtMSk7XG4gIH1cblxuICBnZXRQYXJlbnROb2RlKGN0eDogYW55KTogYW55IHtcbiAgICByZXR1cm4gSnNvblBvaW50ZXIuZ2V0KHRoaXMubGF5b3V0LCB0aGlzLmdldExheW91dFBvaW50ZXIoY3R4KSwgMCwgLTIpO1xuICB9XG5cbiAgZ2V0RGF0YVBvaW50ZXIoY3R4OiBhbnkpOiBzdHJpbmcge1xuICAgIGlmIChcbiAgICAgICFjdHgubGF5b3V0Tm9kZSB8fFxuICAgICAgIWlzRGVmaW5lZChjdHgubGF5b3V0Tm9kZS5kYXRhUG9pbnRlcikgfHxcbiAgICAgICFoYXNWYWx1ZShjdHguZGF0YUluZGV4KVxuICAgICkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBKc29uUG9pbnRlci50b0luZGV4ZWRQb2ludGVyKFxuICAgICAgY3R4LmxheW91dE5vZGUuZGF0YVBvaW50ZXIsXG4gICAgICBjdHguZGF0YUluZGV4LFxuICAgICAgdGhpcy5hcnJheU1hcFxuICAgICk7XG4gIH1cblxuICBnZXRMYXlvdXRQb2ludGVyKGN0eDogYW55KTogc3RyaW5nIHtcbiAgICBpZiAoIWhhc1ZhbHVlKGN0eC5sYXlvdXRJbmRleCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gXCIvXCIgKyBjdHgubGF5b3V0SW5kZXguam9pbihcIi9pdGVtcy9cIik7XG4gIH1cblxuICBpc0NvbnRyb2xCb3VuZChjdHg6IGFueSk6IGJvb2xlYW4ge1xuICAgIGlmIChcbiAgICAgICFjdHgubGF5b3V0Tm9kZSB8fFxuICAgICAgIWlzRGVmaW5lZChjdHgubGF5b3V0Tm9kZS5kYXRhUG9pbnRlcikgfHxcbiAgICAgICFoYXNWYWx1ZShjdHguZGF0YUluZGV4KVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBjb250cm9sR3JvdXAgPSB0aGlzLmdldEZvcm1Db250cm9sR3JvdXAoY3R4KTtcbiAgICBjb25zdCBuYW1lID0gdGhpcy5nZXRGb3JtQ29udHJvbE5hbWUoY3R4KTtcbiAgICByZXR1cm4gY29udHJvbEdyb3VwID8gaGFzT3duKGNvbnRyb2xHcm91cC5jb250cm9scywgbmFtZSkgOiBmYWxzZTtcbiAgfVxuXG4gIGFkZEl0ZW0oY3R4OiBhbnksIG5hbWU/OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBpZiAoXG4gICAgICAhY3R4LmxheW91dE5vZGUgfHxcbiAgICAgICFpc0RlZmluZWQoY3R4LmxheW91dE5vZGUuJHJlZikgfHxcbiAgICAgICFoYXNWYWx1ZShjdHguZGF0YUluZGV4KSB8fFxuICAgICAgIWhhc1ZhbHVlKGN0eC5sYXlvdXRJbmRleClcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgYSBuZXcgQW5ndWxhciBmb3JtIGNvbnRyb2wgZnJvbSBhIHRlbXBsYXRlIGluIHRlbXBsYXRlUmVmTGlicmFyeVxuICAgIGNvbnN0IG5ld0Zvcm1Hcm91cCA9IGJ1aWxkRm9ybUdyb3VwKFxuICAgICAgdGhpcy50ZW1wbGF0ZVJlZkxpYnJhcnlbY3R4LmxheW91dE5vZGUuJHJlZl1cbiAgICApO1xuXG4gICAgLy8gQWRkIHRoZSBuZXcgZm9ybSBjb250cm9sIHRvIHRoZSBwYXJlbnQgZm9ybUFycmF5IG9yIGZvcm1Hcm91cFxuICAgIGlmIChjdHgubGF5b3V0Tm9kZS5hcnJheUl0ZW0pIHtcbiAgICAgIC8vIEFkZCBuZXcgYXJyYXkgaXRlbSB0byBmb3JtQXJyYXlcbiAgICAgICg8Rm9ybUFycmF5PnRoaXMuZ2V0Rm9ybUNvbnRyb2xHcm91cChjdHgpKS5wdXNoKG5ld0Zvcm1Hcm91cCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEFkZCBuZXcgJHJlZiBpdGVtIHRvIGZvcm1Hcm91cFxuICAgICAgKDxGb3JtR3JvdXA+dGhpcy5nZXRGb3JtQ29udHJvbEdyb3VwKGN0eCkpLmFkZENvbnRyb2woXG4gICAgICAgIG5hbWUgfHwgdGhpcy5nZXRGb3JtQ29udHJvbE5hbWUoY3R4KSxcbiAgICAgICAgbmV3Rm9ybUdyb3VwXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIENvcHkgYSBuZXcgbGF5b3V0Tm9kZSBmcm9tIGxheW91dFJlZkxpYnJhcnlcbiAgICBjb25zdCBuZXdMYXlvdXROb2RlID0gZ2V0TGF5b3V0Tm9kZShjdHgubGF5b3V0Tm9kZSwgdGhpcyk7XG4gICAgbmV3TGF5b3V0Tm9kZS5hcnJheUl0ZW0gPSBjdHgubGF5b3V0Tm9kZS5hcnJheUl0ZW07XG4gICAgaWYgKGN0eC5sYXlvdXROb2RlLmFycmF5SXRlbVR5cGUpIHtcbiAgICAgIG5ld0xheW91dE5vZGUuYXJyYXlJdGVtVHlwZSA9IGN0eC5sYXlvdXROb2RlLmFycmF5SXRlbVR5cGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBuZXdMYXlvdXROb2RlLmFycmF5SXRlbVR5cGU7XG4gICAgfVxuICAgIGlmIChuYW1lKSB7XG4gICAgICBuZXdMYXlvdXROb2RlLm5hbWUgPSBuYW1lO1xuICAgICAgbmV3TGF5b3V0Tm9kZS5kYXRhUG9pbnRlciArPSBcIi9cIiArIEpzb25Qb2ludGVyLmVzY2FwZShuYW1lKTtcbiAgICAgIG5ld0xheW91dE5vZGUub3B0aW9ucy50aXRsZSA9IGZpeFRpdGxlKG5hbWUpO1xuICAgIH1cblxuICAgIC8vIEFkZCB0aGUgbmV3IGxheW91dE5vZGUgdG8gdGhlIGZvcm0gbGF5b3V0XG4gICAgSnNvblBvaW50ZXIuaW5zZXJ0KHRoaXMubGF5b3V0LCB0aGlzLmdldExheW91dFBvaW50ZXIoY3R4KSwgbmV3TGF5b3V0Tm9kZSk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIG1vdmVBcnJheUl0ZW0oY3R4OiBhbnksIG9sZEluZGV4OiBudW1iZXIsIG5ld0luZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICBpZiAoXG4gICAgICAhY3R4LmxheW91dE5vZGUgfHxcbiAgICAgICFpc0RlZmluZWQoY3R4LmxheW91dE5vZGUuZGF0YVBvaW50ZXIpIHx8XG4gICAgICAhaGFzVmFsdWUoY3R4LmRhdGFJbmRleCkgfHxcbiAgICAgICFoYXNWYWx1ZShjdHgubGF5b3V0SW5kZXgpIHx8XG4gICAgICAhaXNEZWZpbmVkKG9sZEluZGV4KSB8fFxuICAgICAgIWlzRGVmaW5lZChuZXdJbmRleCkgfHxcbiAgICAgIG9sZEluZGV4ID09PSBuZXdJbmRleFxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIE1vdmUgaXRlbSBpbiB0aGUgZm9ybUFycmF5XG4gICAgY29uc3QgZm9ybUFycmF5ID0gPEZvcm1BcnJheT50aGlzLmdldEZvcm1Db250cm9sR3JvdXAoY3R4KTtcbiAgICBjb25zdCBhcnJheUl0ZW0gPSBmb3JtQXJyYXkuYXQob2xkSW5kZXgpO1xuICAgIGZvcm1BcnJheS5yZW1vdmVBdChvbGRJbmRleCk7XG4gICAgZm9ybUFycmF5Lmluc2VydChuZXdJbmRleCwgYXJyYXlJdGVtKTtcbiAgICBmb3JtQXJyYXkudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpO1xuXG4gICAgLy8gTW92ZSBsYXlvdXQgaXRlbVxuICAgIGNvbnN0IGxheW91dEFycmF5ID0gdGhpcy5nZXRMYXlvdXRBcnJheShjdHgpO1xuICAgIGxheW91dEFycmF5LnNwbGljZShuZXdJbmRleCwgMCwgbGF5b3V0QXJyYXkuc3BsaWNlKG9sZEluZGV4LCAxKVswXSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZW1vdmVJdGVtKGN0eDogYW55KTogYm9vbGVhbiB7XG4gICAgaWYgKFxuICAgICAgIWN0eC5sYXlvdXROb2RlIHx8XG4gICAgICAhaXNEZWZpbmVkKGN0eC5sYXlvdXROb2RlLmRhdGFQb2ludGVyKSB8fFxuICAgICAgIWhhc1ZhbHVlKGN0eC5kYXRhSW5kZXgpIHx8XG4gICAgICAhaGFzVmFsdWUoY3R4LmxheW91dEluZGV4KVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSB0aGUgQW5ndWxhciBmb3JtIGNvbnRyb2wgZnJvbSB0aGUgcGFyZW50IGZvcm1BcnJheSBvciBmb3JtR3JvdXBcbiAgICBpZiAoY3R4LmxheW91dE5vZGUuYXJyYXlJdGVtKSB7XG4gICAgICAvLyBSZW1vdmUgYXJyYXkgaXRlbSBmcm9tIGZvcm1BcnJheVxuICAgICAgKDxGb3JtQXJyYXk+dGhpcy5nZXRGb3JtQ29udHJvbEdyb3VwKGN0eCkpLnJlbW92ZUF0KFxuICAgICAgICBjdHguZGF0YUluZGV4W2N0eC5kYXRhSW5kZXgubGVuZ3RoIC0gMV1cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlbW92ZSAkcmVmIGl0ZW0gZnJvbSBmb3JtR3JvdXBcbiAgICAgICg8Rm9ybUdyb3VwPnRoaXMuZ2V0Rm9ybUNvbnRyb2xHcm91cChjdHgpKS5yZW1vdmVDb250cm9sKFxuICAgICAgICB0aGlzLmdldEZvcm1Db250cm9sTmFtZShjdHgpXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSBsYXlvdXROb2RlIGZyb20gbGF5b3V0XG4gICAgSnNvblBvaW50ZXIucmVtb3ZlKHRoaXMubGF5b3V0LCB0aGlzLmdldExheW91dFBvaW50ZXIoY3R4KSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cbiJdfQ==