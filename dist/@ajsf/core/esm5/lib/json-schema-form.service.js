/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
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
var JsonSchemaFormService = /** @class */ (function () {
    function JsonSchemaFormService() {
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
    JsonSchemaFormService.prototype.setLanguage = /**
     * @param {?=} language
     * @return {?}
     */
    function (language) {
        if (language === void 0) { language = "en-US"; }
        this.language = language;
        /** @type {?} */
        var languageValidationMessages = {
            fr: frValidationMessages,
            en: enValidationMessages,
            it: itValidationMessages,
            pt: ptValidationMessages,
            zh: zhValidationMessages,
        };
        /** @type {?} */
        var languageCode = language.slice(0, 2);
        /** @type {?} */
        var validationMessages = languageValidationMessages[languageCode];
        this.defaultFormOptions.defautWidgetOptions.validationMessages = cloneDeep(validationMessages);
    };
    /**
     * @return {?}
     */
    JsonSchemaFormService.prototype.getData = /**
     * @return {?}
     */
    function () {
        return this.data;
    };
    /**
     * @return {?}
     */
    JsonSchemaFormService.prototype.getSchema = /**
     * @return {?}
     */
    function () {
        return this.schema;
    };
    /**
     * @return {?}
     */
    JsonSchemaFormService.prototype.getLayout = /**
     * @return {?}
     */
    function () {
        return this.layout;
    };
    /**
     * @return {?}
     */
    JsonSchemaFormService.prototype.resetAllValues = /**
     * @return {?}
     */
    function () {
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
    };
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
     *     message: 'Email must contain an @ symbol.',
     *     code: 'at_symbol'
     *   } ]
     * }
     * //{ErrorMessages} errors
     */
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
    JsonSchemaFormService.prototype.buildRemoteError = /**
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
    function (errors) {
        var _this = this;
        forEach(errors, (/**
         * @param {?} value
         * @param {?} key
         * @return {?}
         */
        function (value, key) {
            var e_1, _a;
            if (key in _this.formGroup.controls) {
                try {
                    for (var value_1 = tslib_1.__values(value), value_1_1 = value_1.next(); !value_1_1.done; value_1_1 = value_1.next()) {
                        var error = value_1_1.value;
                        /** @type {?} */
                        var err = {};
                        err[error["code"]] = error["message"];
                        _this.formGroup.get(key).setErrors(err, { emitEvent: true });
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (value_1_1 && !value_1_1.done && (_a = value_1.return)) _a.call(value_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
        }));
    };
    /**
     * @param {?} newValue
     * @param {?=} updateSubscriptions
     * @return {?}
     */
    JsonSchemaFormService.prototype.validateData = /**
     * @param {?} newValue
     * @param {?=} updateSubscriptions
     * @return {?}
     */
    function (newValue, updateSubscriptions) {
        if (updateSubscriptions === void 0) { updateSubscriptions = true; }
        // Format raw form data to correct data types
        this.data = formatFormData(newValue, this.dataMap, this.dataRecursiveRefMap, this.arrayMap, this.formOptions.returnEmptyFields);
        this.isValid = this.validateFormData(this.data);
        this.validData = this.isValid ? this.data : null;
        /** @type {?} */
        var compileErrors = (/**
         * @param {?} errors
         * @return {?}
         */
        function (errors) {
            /** @type {?} */
            var compiledErrors = {};
            (errors || []).forEach((/**
             * @param {?} error
             * @return {?}
             */
            function (error) {
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
    };
    /**
     * @param {?=} formValues
     * @param {?=} setValues
     * @return {?}
     */
    JsonSchemaFormService.prototype.buildFormGroupTemplate = /**
     * @param {?=} formValues
     * @param {?=} setValues
     * @return {?}
     */
    function (formValues, setValues) {
        if (formValues === void 0) { formValues = null; }
        if (setValues === void 0) { setValues = true; }
        this.formGroupTemplate = buildFormGroupTemplate(this, formValues, setValues);
    };
    /**
     * @return {?}
     */
    JsonSchemaFormService.prototype.buildFormGroup = /**
     * @return {?}
     */
    function () {
        var _this = this;
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
            function (formValue) { return _this.validateData(formValue); }));
        }
    };
    /**
     * @param {?} widgetLibrary
     * @return {?}
     */
    JsonSchemaFormService.prototype.buildLayout = /**
     * @param {?} widgetLibrary
     * @return {?}
     */
    function (widgetLibrary) {
        this.layout = buildLayout(this, widgetLibrary);
    };
    /**
     * @param {?} newOptions
     * @return {?}
     */
    JsonSchemaFormService.prototype.setOptions = /**
     * @param {?} newOptions
     * @return {?}
     */
    function (newOptions) {
        if (isObject(newOptions)) {
            /** @type {?} */
            var addOptions = cloneDeep(newOptions);
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
            var globalDefaults_1 = this.formOptions.defautWidgetOptions;
            ["ErrorState", "SuccessState"]
                .filter((/**
             * @param {?} suffix
             * @return {?}
             */
            function (suffix) { return hasOwn(globalDefaults_1, "disable" + suffix); }))
                .forEach((/**
             * @param {?} suffix
             * @return {?}
             */
            function (suffix) {
                globalDefaults_1["enable" + suffix] = !globalDefaults_1["disable" + suffix];
                delete globalDefaults_1["disable" + suffix];
            }));
        }
    };
    /**
     * @return {?}
     */
    JsonSchemaFormService.prototype.compileAjvSchema = /**
     * @return {?}
     */
    function () {
        if (!this.validateFormData) {
            // if 'ui:order' exists in properties, move it to root before compiling with ajv
            if (Array.isArray(this.schema.properties["ui:order"])) {
                this.schema["ui:order"] = this.schema.properties["ui:order"];
                delete this.schema.properties["ui:order"];
            }
            this.ajv.removeSchema(this.schema);
            this.validateFormData = this.ajv.compile(this.schema);
        }
    };
    /**
     * @param {?=} data
     * @param {?=} requireAllFields
     * @return {?}
     */
    JsonSchemaFormService.prototype.buildSchemaFromData = /**
     * @param {?=} data
     * @param {?=} requireAllFields
     * @return {?}
     */
    function (data, requireAllFields) {
        if (requireAllFields === void 0) { requireAllFields = false; }
        if (data) {
            return buildSchemaFromData(data, requireAllFields);
        }
        this.schema = buildSchemaFromData(this.formValues, requireAllFields);
    };
    /**
     * @param {?=} layout
     * @return {?}
     */
    JsonSchemaFormService.prototype.buildSchemaFromLayout = /**
     * @param {?=} layout
     * @return {?}
     */
    function (layout) {
        if (layout) {
            return buildSchemaFromLayout(layout);
        }
        this.schema = buildSchemaFromLayout(this.layout);
    };
    /**
     * @param {?=} newTpldata
     * @return {?}
     */
    JsonSchemaFormService.prototype.setTpldata = /**
     * @param {?=} newTpldata
     * @return {?}
     */
    function (newTpldata) {
        if (newTpldata === void 0) { newTpldata = {}; }
        this.tpldata = newTpldata;
    };
    /**
     * @param {?=} text
     * @param {?=} value
     * @param {?=} values
     * @param {?=} key
     * @return {?}
     */
    JsonSchemaFormService.prototype.parseText = /**
     * @param {?=} text
     * @param {?=} value
     * @param {?=} values
     * @param {?=} key
     * @return {?}
     */
    function (text, value, values, key) {
        var _this = this;
        if (text === void 0) { text = ""; }
        if (value === void 0) { value = {}; }
        if (values === void 0) { values = {}; }
        if (key === void 0) { key = null; }
        if (!text || !/{{.+?}}/.test(text)) {
            return text;
        }
        return text.replace(/{{(.+?)}}/g, (/**
         * @param {...?} a
         * @return {?}
         */
        function () {
            var a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                a[_i] = arguments[_i];
            }
            return _this.parseExpression(a[1], value, values, key, _this.tpldata);
        }));
    };
    /**
     * @param {?=} expression
     * @param {?=} value
     * @param {?=} values
     * @param {?=} key
     * @param {?=} tpldata
     * @return {?}
     */
    JsonSchemaFormService.prototype.parseExpression = /**
     * @param {?=} expression
     * @param {?=} value
     * @param {?=} values
     * @param {?=} key
     * @param {?=} tpldata
     * @return {?}
     */
    function (expression, value, values, key, tpldata) {
        var _this = this;
        if (expression === void 0) { expression = ""; }
        if (value === void 0) { value = {}; }
        if (values === void 0) { values = {}; }
        if (key === void 0) { key = null; }
        if (tpldata === void 0) { tpldata = null; }
        if (typeof expression !== "string") {
            return "";
        }
        /** @type {?} */
        var index = typeof key === "number" ? key + 1 + "" : key || "";
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
        function (delim) { return expression.indexOf(delim) === -1; }))) {
            /** @type {?} */
            var pointer = JsonPointer.parseObjectPath(expression);
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
            function (all, term) {
                return all || _this.parseExpression(term, value, values, key, tpldata);
            }), "");
        }
        if (expression.indexOf("&&") > -1) {
            return expression
                .split("&&")
                .reduce((/**
             * @param {?} all
             * @param {?} term
             * @return {?}
             */
            function (all, term) {
                return all && _this.parseExpression(term, value, values, key, tpldata);
            }), " ")
                .trim();
        }
        if (expression.indexOf("+") > -1) {
            return expression
                .split("+")
                .map((/**
             * @param {?} term
             * @return {?}
             */
            function (term) { return _this.parseExpression(term, value, values, key, tpldata); }))
                .join("");
        }
        return "";
    };
    /**
     * @param {?=} parentCtx
     * @param {?=} childNode
     * @param {?=} index
     * @return {?}
     */
    JsonSchemaFormService.prototype.setArrayItemTitle = /**
     * @param {?=} parentCtx
     * @param {?=} childNode
     * @param {?=} index
     * @return {?}
     */
    function (parentCtx, childNode, index) {
        if (parentCtx === void 0) { parentCtx = {}; }
        if (childNode === void 0) { childNode = null; }
        if (index === void 0) { index = null; }
        /** @type {?} */
        var parentNode = parentCtx.layoutNode;
        /** @type {?} */
        var parentValues = this.getFormControlValue(parentCtx);
        /** @type {?} */
        var isArrayItem = (parentNode.type || "").slice(-5) === "array" && isArray(parentValues);
        /** @type {?} */
        var text = JsonPointer.getFirst(isArrayItem && childNode.type !== "$ref"
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
        var childValue = isArray(parentValues) && index < parentValues.length
            ? parentValues[index]
            : parentValues;
        return this.parseText(text, childValue, parentValues, index);
    };
    /**
     * @param {?} ctx
     * @return {?}
     */
    JsonSchemaFormService.prototype.setItemTitle = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx) {
        return !ctx.options.title && /^(\d+|-)$/.test(ctx.layoutNode.name)
            ? null
            : this.parseText(ctx.options.title || toTitleCase(ctx.layoutNode.name), this.getFormControlValue(this), (this.getFormControlGroup(this) || (/** @type {?} */ ({}))).value, ctx.dataIndex[ctx.dataIndex.length - 1]);
    };
    /**
     * @param {?} layoutNode
     * @param {?} dataIndex
     * @return {?}
     */
    JsonSchemaFormService.prototype.evaluateCondition = /**
     * @param {?} layoutNode
     * @param {?} dataIndex
     * @return {?}
     */
    function (layoutNode, dataIndex) {
        /** @type {?} */
        var arrayIndex = dataIndex && dataIndex[dataIndex.length - 1];
        /** @type {?} */
        var result = true;
        if (hasValue((layoutNode.options || {}).condition)) {
            if (typeof layoutNode.options.condition === "string") {
                /** @type {?} */
                var pointer = layoutNode.options.condition;
                if (hasValue(arrayIndex)) {
                    pointer = pointer.replace("[arrayIndex]", "[" + arrayIndex + "]");
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
                    var dynFn = new Function("model", "arrayIndices", layoutNode.options.condition.functionBody);
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
    };
    /**
     * @param {?} ctx
     * @param {?=} bind
     * @return {?}
     */
    JsonSchemaFormService.prototype.initializeControl = /**
     * @param {?} ctx
     * @param {?=} bind
     * @return {?}
     */
    function (ctx, bind) {
        if (bind === void 0) { bind = true; }
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
            function (errors) {
                ctx.options.errorMessage = "" + errors;
            }));
            ctx.formControl.valueChanges.subscribe((/**
             * @param {?} value
             * @return {?}
             */
            function (value) {
                if (!!value) {
                    ctx.controlValue = value;
                }
            }));
        }
        else {
            ctx.controlName = ctx.layoutNode.name;
            ctx.controlValue = ctx.layoutNode.value || null;
            /** @type {?} */
            var dataPointer = this.getDataPointer(ctx);
            if (bind && dataPointer) {
                console.error("warning: control \"" + dataPointer + "\" is not bound to the Angular FormGroup.");
            }
        }
        return ctx.boundControl;
    };
    /**
     * @param {?} errors
     * @param {?=} validationMessages
     * @return {?}
     */
    JsonSchemaFormService.prototype.formatErrors = /**
     * @param {?} errors
     * @param {?=} validationMessages
     * @return {?}
     */
    function (errors, validationMessages) {
        if (validationMessages === void 0) { validationMessages = {}; }
        if (isEmpty(errors)) {
            return null;
        }
        if (!isObject(validationMessages)) {
            validationMessages = {};
        }
        /** @type {?} */
        var addSpaces = (/**
         * @param {?} string
         * @return {?}
         */
        function (string) {
            return string[0].toUpperCase() +
                (string.slice(1) || "")
                    .replace(/([a-z])([A-Z])/g, "$1 $2")
                    .replace(/_/g, " ");
        });
        /** @type {?} */
        var formatError = (/**
         * @param {?} error
         * @return {?}
         */
        function (error) {
            return typeof error === "object"
                ? Object.keys(error)
                    .map((/**
                 * @param {?} key
                 * @return {?}
                 */
                function (key) {
                    return error[key] === true
                        ? addSpaces(key)
                        : error[key] === false
                            ? "Not " + addSpaces(key)
                            : addSpaces(key) + ": " + formatError(error[key]);
                }))
                    .join(", ")
                : addSpaces(error.toString());
        });
        /** @type {?} */
        var messages = [];
        return (Object.keys(errors)
            // Hide 'required' error, unless it is the only one
            .filter((/**
         * @param {?} errorKey
         * @return {?}
         */
        function (errorKey) {
            return errorKey !== "required" || Object.keys(errors).length === 1;
        }))
            .map((/**
         * @param {?} errorKey
         * @return {?}
         */
        function (errorKey) {
            // If validationMessages is a string, return it
            return typeof validationMessages === "string"
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
                                            function (errorMessage, errorProperty) {
                                                return errorMessage.replace(new RegExp("{{" + errorProperty + "}}", "g"), errors[errorKey][errorProperty]);
                                            }), validationMessages[errorKey])
                                : // If no custom error message, return formatted error data instead
                                    addSpaces(errorKey) + " Error: " + formatError(errors[errorKey]);
        }))
            .join("<br>"));
    };
    /**
     * @param {?} ctx
     * @param {?} value
     * @return {?}
     */
    JsonSchemaFormService.prototype.updateValue = /**
     * @param {?} ctx
     * @param {?} value
     * @return {?}
     */
    function (ctx, value) {
        var e_2, _a;
        // Set value of current control
        ctx.controlValue = value;
        if (ctx.boundControl) {
            ctx.formControl.setValue(value);
            ctx.formControl.markAsDirty();
        }
        ctx.layoutNode.value = value;
        // Set values of any related controls in copyValueTo array
        if (isArray(ctx.options.copyValueTo)) {
            try {
                for (var _b = tslib_1.__values(ctx.options.copyValueTo), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var item = _c.value;
                    /** @type {?} */
                    var targetControl = getControl(this.formGroup, item);
                    if (isObject(targetControl) &&
                        typeof targetControl.setValue === "function") {
                        targetControl.setValue(value);
                        targetControl.markAsDirty();
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    };
    /**
     * @param {?} ctx
     * @param {?} checkboxList
     * @return {?}
     */
    JsonSchemaFormService.prototype.updateArrayCheckboxList = /**
     * @param {?} ctx
     * @param {?} checkboxList
     * @return {?}
     */
    function (ctx, checkboxList) {
        var e_3, _a;
        /** @type {?} */
        var formArray = (/** @type {?} */ (this.getFormControl(ctx)));
        // Remove all existing items
        while (formArray.value.length) {
            formArray.removeAt(0);
        }
        // Re-add an item for each checked box
        /** @type {?} */
        var refPointer = removeRecursiveReferences(ctx.layoutNode.dataPointer + "/-", this.dataRecursiveRefMap, this.arrayMap);
        try {
            for (var checkboxList_1 = tslib_1.__values(checkboxList), checkboxList_1_1 = checkboxList_1.next(); !checkboxList_1_1.done; checkboxList_1_1 = checkboxList_1.next()) {
                var checkboxItem = checkboxList_1_1.value;
                if (checkboxItem.checked) {
                    /** @type {?} */
                    var newFormControl = buildFormGroup(this.templateRefLibrary[refPointer]);
                    newFormControl.setValue(checkboxItem.value);
                    formArray.push(newFormControl);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (checkboxList_1_1 && !checkboxList_1_1.done && (_a = checkboxList_1.return)) _a.call(checkboxList_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        formArray.markAsDirty();
    };
    /**
     * @param {?} ctx
     * @return {?}
     */
    JsonSchemaFormService.prototype.getFormControl = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx) {
        if (!ctx.layoutNode ||
            !isDefined(ctx.layoutNode.dataPointer) ||
            ctx.layoutNode.type === "$ref") {
            return null;
        }
        return getControl(this.formGroup, this.getDataPointer(ctx));
    };
    /**
     * @param {?} ctx
     * @return {?}
     */
    JsonSchemaFormService.prototype.getFormControlValue = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx) {
        if (!ctx.layoutNode ||
            !isDefined(ctx.layoutNode.dataPointer) ||
            ctx.layoutNode.type === "$ref") {
            return null;
        }
        /** @type {?} */
        var control = getControl(this.formGroup, this.getDataPointer(ctx));
        return control ? control.value : null;
    };
    /**
     * @param {?} ctx
     * @return {?}
     */
    JsonSchemaFormService.prototype.getFormControlGroup = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer)) {
            return null;
        }
        return getControl(this.formGroup, this.getDataPointer(ctx), true);
    };
    /**
     * @param {?} ctx
     * @return {?}
     */
    JsonSchemaFormService.prototype.getFormControlName = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx) {
        if (!ctx.layoutNode ||
            !isDefined(ctx.layoutNode.dataPointer) ||
            !hasValue(ctx.dataIndex)) {
            return null;
        }
        return JsonPointer.toKey(this.getDataPointer(ctx));
    };
    /**
     * @param {?} ctx
     * @return {?}
     */
    JsonSchemaFormService.prototype.getLayoutArray = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx) {
        return JsonPointer.get(this.layout, this.getLayoutPointer(ctx), 0, -1);
    };
    /**
     * @param {?} ctx
     * @return {?}
     */
    JsonSchemaFormService.prototype.getParentNode = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx) {
        return JsonPointer.get(this.layout, this.getLayoutPointer(ctx), 0, -2);
    };
    /**
     * @param {?} ctx
     * @return {?}
     */
    JsonSchemaFormService.prototype.getDataPointer = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx) {
        if (!ctx.layoutNode ||
            !isDefined(ctx.layoutNode.dataPointer) ||
            !hasValue(ctx.dataIndex)) {
            return null;
        }
        return JsonPointer.toIndexedPointer(ctx.layoutNode.dataPointer, ctx.dataIndex, this.arrayMap);
    };
    /**
     * @param {?} ctx
     * @return {?}
     */
    JsonSchemaFormService.prototype.getLayoutPointer = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx) {
        if (!hasValue(ctx.layoutIndex)) {
            return null;
        }
        return "/" + ctx.layoutIndex.join("/items/");
    };
    /**
     * @param {?} ctx
     * @return {?}
     */
    JsonSchemaFormService.prototype.isControlBound = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx) {
        if (!ctx.layoutNode ||
            !isDefined(ctx.layoutNode.dataPointer) ||
            !hasValue(ctx.dataIndex)) {
            return false;
        }
        /** @type {?} */
        var controlGroup = this.getFormControlGroup(ctx);
        /** @type {?} */
        var name = this.getFormControlName(ctx);
        return controlGroup ? hasOwn(controlGroup.controls, name) : false;
    };
    /**
     * @param {?} ctx
     * @param {?=} name
     * @return {?}
     */
    JsonSchemaFormService.prototype.addItem = /**
     * @param {?} ctx
     * @param {?=} name
     * @return {?}
     */
    function (ctx, name) {
        if (!ctx.layoutNode ||
            !isDefined(ctx.layoutNode.$ref) ||
            !hasValue(ctx.dataIndex) ||
            !hasValue(ctx.layoutIndex)) {
            return false;
        }
        // Create a new Angular form control from a template in templateRefLibrary
        /** @type {?} */
        var newFormGroup = buildFormGroup(this.templateRefLibrary[ctx.layoutNode.$ref]);
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
        var newLayoutNode = getLayoutNode(ctx.layoutNode, this);
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
    };
    /**
     * @param {?} ctx
     * @param {?} oldIndex
     * @param {?} newIndex
     * @return {?}
     */
    JsonSchemaFormService.prototype.moveArrayItem = /**
     * @param {?} ctx
     * @param {?} oldIndex
     * @param {?} newIndex
     * @return {?}
     */
    function (ctx, oldIndex, newIndex) {
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
        var formArray = (/** @type {?} */ (this.getFormControlGroup(ctx)));
        /** @type {?} */
        var arrayItem = formArray.at(oldIndex);
        formArray.removeAt(oldIndex);
        formArray.insert(newIndex, arrayItem);
        formArray.updateValueAndValidity();
        // Move layout item
        /** @type {?} */
        var layoutArray = this.getLayoutArray(ctx);
        layoutArray.splice(newIndex, 0, layoutArray.splice(oldIndex, 1)[0]);
        return true;
    };
    /**
     * @param {?} ctx
     * @return {?}
     */
    JsonSchemaFormService.prototype.removeItem = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx) {
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
    };
    JsonSchemaFormService.decorators = [
        { type: Injectable, args: [{
                    providedIn: "root",
                },] }
    ];
    /** @nocollapse */
    JsonSchemaFormService.ctorParameters = function () { return []; };
    /** @nocollapse */ JsonSchemaFormService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function JsonSchemaFormService_Factory() { return new JsonSchemaFormService(); }, token: JsonSchemaFormService, providedIn: "root" });
    return JsonSchemaFormService;
}());
export { JsonSchemaFormService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFqc2YvY29yZS8iLCJzb3VyY2VzIjpbImxpYi9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxTQUFTLE1BQU0sa0JBQWtCLENBQUM7QUFDekMsT0FBTyxHQUFHLE1BQU0sS0FBSyxDQUFDO0FBQ3RCLE9BQU8sVUFBVSxNQUFNLHdDQUF3QyxDQUFDO0FBQ2hFLE9BQU8sRUFDTCxjQUFjLEVBQ2Qsc0JBQXNCLEVBQ3RCLGNBQWMsRUFDZCxVQUFVLEVBQ1YsUUFBUSxFQUNSLE9BQU8sRUFDUCxNQUFNLEVBQ04sV0FBVyxFQUNYLFdBQVcsRUFDWCxhQUFhLEVBQ2IsbUJBQW1CLEVBQ25CLHFCQUFxQixFQUNyQix5QkFBeUIsRUFDekIsUUFBUSxFQUNSLE9BQU8sRUFDUCxTQUFTLEVBQ1QsT0FBTyxFQUNQLFFBQVEsRUFDUixXQUFXLEdBQ1osTUFBTSxVQUFVLENBQUM7QUFDbEIsT0FBTyxFQUNMLG9CQUFvQixFQUNwQixvQkFBb0IsRUFDcEIsb0JBQW9CLEVBQ3BCLG9CQUFvQixFQUNwQixvQkFBb0IsR0FDckIsTUFBTSxVQUFVLENBQUM7Ozs7O0FBRWxCLGtDQU1DOzs7SUFMQyw0QkFBYzs7SUFDZCw2QkFBWTs7SUFDWiwrQkFBa0I7O0lBQ2xCLDZCQUFlOztJQUNmLDZCQUF1Qjs7Ozs7QUFFekIsbUNBS0M7QUFFRDtJQStGRTtRQTNGQSwwQkFBcUIsR0FBRyxLQUFLLENBQUM7UUFDOUIscUNBQWdDLEdBQUcsS0FBSyxDQUFDO1FBQ3pDLG1DQUE4QixHQUFHLEtBQUssQ0FBQztRQUN2QyxZQUFPLEdBQVEsRUFBRSxDQUFDO1FBRWxCLGVBQVUsR0FBUTtZQUNo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bUJBQVcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxFQUFBLENBQUMsQ0FBQyxhQUFhLENBQ3RELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FDN0IsQ0FBQztTQUNIO1FBRUQsZ0NBQWdDO1FBQ2hDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM1RCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7O2dCQWwwQkYsVUFBVSxTQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7Ozs7Z0NBbkREO0NBbzNCQyxBQW4wQkQsSUFtMEJDO1NBaDBCWSxxQkFBcUI7OztJQUNoQyxzREFBOEI7O0lBQzlCLGlFQUF5Qzs7SUFDekMsK0RBQXVDOztJQUN2Qyx3Q0FBa0I7O0lBRWxCLDJDQUlFOztJQUNGLG9DQUFvQzs7SUFDcEMsaURBQTZCOztJQUU3QiwyQ0FBcUI7O0lBQ3JCLHFDQUFlOztJQUNmLHVDQUFpQjs7SUFDakIsdUNBQW1COztJQUNuQixrREFBNEI7O0lBQzVCLDBDQUFzQjs7SUFDdEIsMENBQXNCOztJQUN0Qiw0Q0FBaUI7O0lBRWpCLDBDQUFzQjs7SUFDdEIsd0NBQXdCOztJQUN4QiwwQ0FBc0I7O0lBQ3RCLGlEQUE2Qjs7SUFDN0IsMkNBQTRCOztJQUM1QixzREFBa0M7O0lBQ2xDLDRDQUEwQzs7SUFDMUMsK0NBQTZDOztJQUM3Qyx1REFBcUQ7O0lBRXJELHlDQUEwQzs7SUFDMUMsd0NBQXNDOztJQUN0QyxvREFBcUQ7O0lBQ3JELHNEQUF1RDs7SUFDdkQsaURBQTJCOztJQUMzQixpREFBcUM7O0lBQ3JDLG1EQUE2Qjs7SUFDN0IsaURBQXlCOztJQUV6Qix5Q0FBbUI7O0lBR25CLG1EQTZDRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQWJzdHJhY3RDb250cm9sLCBGb3JtQXJyYXksIEZvcm1Hcm91cCB9IGZyb20gXCJAYW5ndWxhci9mb3Jtc1wiO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gXCJyeGpzXCI7XG5pbXBvcnQgY2xvbmVEZWVwIGZyb20gXCJsb2Rhc2gvY2xvbmVEZWVwXCI7XG5pbXBvcnQgQWp2IGZyb20gXCJhanZcIjtcbmltcG9ydCBqc29uRHJhZnQ2IGZyb20gXCJhanYvbGliL3JlZnMvanNvbi1zY2hlbWEtZHJhZnQtMDYuanNvblwiO1xuaW1wb3J0IHtcbiAgYnVpbGRGb3JtR3JvdXAsXG4gIGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGUsXG4gIGZvcm1hdEZvcm1EYXRhLFxuICBnZXRDb250cm9sLFxuICBmaXhUaXRsZSxcbiAgZm9yRWFjaCxcbiAgaGFzT3duLFxuICB0b1RpdGxlQ2FzZSxcbiAgYnVpbGRMYXlvdXQsXG4gIGdldExheW91dE5vZGUsXG4gIGJ1aWxkU2NoZW1hRnJvbURhdGEsXG4gIGJ1aWxkU2NoZW1hRnJvbUxheW91dCxcbiAgcmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlcyxcbiAgaGFzVmFsdWUsXG4gIGlzQXJyYXksXG4gIGlzRGVmaW5lZCxcbiAgaXNFbXB0eSxcbiAgaXNPYmplY3QsXG4gIEpzb25Qb2ludGVyLFxufSBmcm9tIFwiLi9zaGFyZWRcIjtcbmltcG9ydCB7XG4gIGVuVmFsaWRhdGlvbk1lc3NhZ2VzLFxuICBmclZhbGlkYXRpb25NZXNzYWdlcyxcbiAgaXRWYWxpZGF0aW9uTWVzc2FnZXMsXG4gIHB0VmFsaWRhdGlvbk1lc3NhZ2VzLFxuICB6aFZhbGlkYXRpb25NZXNzYWdlcyxcbn0gZnJvbSBcIi4vbG9jYWxlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGl0bGVNYXBJdGVtIHtcbiAgbmFtZT86IHN0cmluZztcbiAgdmFsdWU/OiBhbnk7XG4gIGNoZWNrZWQ/OiBib29sZWFuO1xuICBncm91cD86IHN0cmluZztcbiAgaXRlbXM/OiBUaXRsZU1hcEl0ZW1bXTtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgRXJyb3JNZXNzYWdlcyB7XG4gIFtjb250cm9sX25hbWU6IHN0cmluZ106IHtcbiAgICBtZXNzYWdlOiBzdHJpbmcgfCBGdW5jdGlvbiB8IE9iamVjdDtcbiAgICBjb2RlOiBzdHJpbmc7XG4gIH1bXTtcbn1cblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiBcInJvb3RcIixcbn0pXG5leHBvcnQgY2xhc3MgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIHtcbiAgSnNvbkZvcm1Db21wYXRpYmlsaXR5ID0gZmFsc2U7XG4gIFJlYWN0SnNvblNjaGVtYUZvcm1Db21wYXRpYmlsaXR5ID0gZmFsc2U7XG4gIEFuZ3VsYXJTY2hlbWFGb3JtQ29tcGF0aWJpbGl0eSA9IGZhbHNlO1xuICB0cGxkYXRhOiBhbnkgPSB7fTtcblxuICBhanZPcHRpb25zOiBhbnkgPSB7XG4gICAgYWxsRXJyb3JzOiB0cnVlLFxuICAgIGpzb25Qb2ludGVyczogdHJ1ZSxcbiAgICB1bmtub3duRm9ybWF0czogXCJpZ25vcmVcIixcbiAgfTtcbiAgYWp2OiBhbnkgPSBuZXcgQWp2KHRoaXMuYWp2T3B0aW9ucyk7IC8vIEFKVjogQW5vdGhlciBKU09OIFNjaGVtYSBWYWxpZGF0b3JcbiAgdmFsaWRhdGVGb3JtRGF0YTogYW55ID0gbnVsbDsgLy8gQ29tcGlsZWQgQUpWIGZ1bmN0aW9uIHRvIHZhbGlkYXRlIGFjdGl2ZSBmb3JtJ3Mgc2NoZW1hXG5cbiAgZm9ybVZhbHVlczogYW55ID0ge307IC8vIEludGVybmFsIGZvcm0gZGF0YSAobWF5IG5vdCBoYXZlIGNvcnJlY3QgdHlwZXMpXG4gIGRhdGE6IGFueSA9IHt9OyAvLyBPdXRwdXQgZm9ybSBkYXRhIChmb3JtVmFsdWVzLCBmb3JtYXR0ZWQgd2l0aCBjb3JyZWN0IGRhdGEgdHlwZXMpXG4gIHNjaGVtYTogYW55ID0ge307IC8vIEludGVybmFsIEpTT04gU2NoZW1hXG4gIGxheW91dDogYW55W10gPSBbXTsgLy8gSW50ZXJuYWwgZm9ybSBsYXlvdXRcbiAgZm9ybUdyb3VwVGVtcGxhdGU6IGFueSA9IHt9OyAvLyBUZW1wbGF0ZSB1c2VkIHRvIGNyZWF0ZSBmb3JtR3JvdXBcbiAgZm9ybUdyb3VwOiBhbnkgPSBudWxsOyAvLyBBbmd1bGFyIGZvcm1Hcm91cCwgd2hpY2ggcG93ZXJzIHRoZSByZWFjdGl2ZSBmb3JtXG4gIGZyYW1ld29yazogYW55ID0gbnVsbDsgLy8gQWN0aXZlIGZyYW1ld29yayBjb21wb25lbnRcbiAgZm9ybU9wdGlvbnM6IGFueTsgLy8gQWN0aXZlIG9wdGlvbnMsIHVzZWQgdG8gY29uZmlndXJlIHRoZSBmb3JtXG5cbiAgdmFsaWREYXRhOiBhbnkgPSBudWxsOyAvLyBWYWxpZCBmb3JtIGRhdGEgKG9yIG51bGwpICg9PT0gaXNWYWxpZCA/IGRhdGEgOiBudWxsKVxuICBpc1ZhbGlkOiBib29sZWFuID0gbnVsbDsgLy8gSXMgY3VycmVudCBmb3JtIGRhdGEgdmFsaWQ/XG4gIGFqdkVycm9yczogYW55ID0gbnVsbDsgLy8gQWp2IGVycm9ycyBmb3IgY3VycmVudCBkYXRhXG4gIHZhbGlkYXRpb25FcnJvcnM6IGFueSA9IG51bGw7IC8vIEFueSB2YWxpZGF0aW9uIGVycm9ycyBmb3IgY3VycmVudCBkYXRhXG4gIGRhdGFFcnJvcnM6IGFueSA9IG5ldyBNYXAoKTsgLy9cbiAgZm9ybVZhbHVlU3Vic2NyaXB0aW9uOiBhbnkgPSBudWxsOyAvLyBTdWJzY3JpcHRpb24gdG8gZm9ybUdyb3VwLnZhbHVlQ2hhbmdlcyBvYnNlcnZhYmxlIChmb3IgdW4tIGFuZCByZS1zdWJzY3JpYmluZylcbiAgZGF0YUNoYW5nZXM6IFN1YmplY3Q8YW55PiA9IG5ldyBTdWJqZWN0KCk7IC8vIEZvcm0gZGF0YSBvYnNlcnZhYmxlXG4gIGlzVmFsaWRDaGFuZ2VzOiBTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdCgpOyAvLyBpc1ZhbGlkIG9ic2VydmFibGVcbiAgdmFsaWRhdGlvbkVycm9yQ2hhbmdlczogU3ViamVjdDxhbnk+ID0gbmV3IFN1YmplY3QoKTsgLy8gdmFsaWRhdGlvbkVycm9ycyBvYnNlcnZhYmxlXG5cbiAgYXJyYXlNYXA6IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBuZXcgTWFwKCk7IC8vIE1hcHMgYXJyYXlzIGluIGRhdGEgb2JqZWN0IGFuZCBudW1iZXIgb2YgdHVwbGUgdmFsdWVzXG4gIGRhdGFNYXA6IE1hcDxzdHJpbmcsIGFueT4gPSBuZXcgTWFwKCk7IC8vIE1hcHMgcGF0aHMgaW4gZm9ybSBkYXRhIHRvIHNjaGVtYSBhbmQgZm9ybUdyb3VwIHBhdGhzXG4gIGRhdGFSZWN1cnNpdmVSZWZNYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7IC8vIE1hcHMgcmVjdXJzaXZlIHJlZmVyZW5jZSBwb2ludHMgaW4gZm9ybSBkYXRhXG4gIHNjaGVtYVJlY3Vyc2l2ZVJlZk1hcDogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTsgLy8gTWFwcyByZWN1cnNpdmUgcmVmZXJlbmNlIHBvaW50cyBpbiBzY2hlbWFcbiAgc2NoZW1hUmVmTGlicmFyeTogYW55ID0ge307IC8vIExpYnJhcnkgb2Ygc2NoZW1hcyBmb3IgcmVzb2x2aW5nIHNjaGVtYSAkcmVmc1xuICBsYXlvdXRSZWZMaWJyYXJ5OiBhbnkgPSB7IFwiXCI6IG51bGwgfTsgLy8gTGlicmFyeSBvZiBsYXlvdXQgbm9kZXMgZm9yIGFkZGluZyB0byBmb3JtXG4gIHRlbXBsYXRlUmVmTGlicmFyeTogYW55ID0ge307IC8vIExpYnJhcnkgb2YgZm9ybUdyb3VwIHRlbXBsYXRlcyBmb3IgYWRkaW5nIHRvIGZvcm1cbiAgaGFzUm9vdFJlZmVyZW5jZSA9IGZhbHNlOyAvLyBEb2VzIHRoZSBmb3JtIGluY2x1ZGUgYSByZWN1cnNpdmUgcmVmZXJlbmNlIHRvIGl0c2VsZj9cblxuICBsYW5ndWFnZSA9IFwiZW4tVVNcIjsgLy8gRG9lcyB0aGUgZm9ybSBpbmNsdWRlIGEgcmVjdXJzaXZlIHJlZmVyZW5jZSB0byBpdHNlbGY/XG5cbiAgLy8gRGVmYXVsdCBnbG9iYWwgZm9ybSBvcHRpb25zXG4gIGRlZmF1bHRGb3JtT3B0aW9uczogYW55ID0ge1xuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZSwgLy8gQWxsb3cgdGhlIHdlYiBicm93c2VyIHRvIHJlbWVtYmVyIHByZXZpb3VzIGZvcm0gc3VibWlzc2lvbiB2YWx1ZXMgYXMgZGVmYXVsdHNcbiAgICBhZGRTdWJtaXQ6IFwiYXV0b1wiLCAvLyBBZGQgYSBzdWJtaXQgYnV0dG9uIGlmIGxheW91dCBkb2VzIG5vdCBoYXZlIG9uZT9cbiAgICAvLyBmb3IgYWRkU3VibWl0OiB0cnVlID0gYWx3YXlzLCBmYWxzZSA9IG5ldmVyLFxuICAgIC8vICdhdXRvJyA9IG9ubHkgaWYgbGF5b3V0IGlzIHVuZGVmaW5lZCAoZm9ybSBpcyBidWlsdCBmcm9tIHNjaGVtYSBhbG9uZSlcbiAgICBkZWJ1ZzogZmFsc2UsIC8vIFNob3cgZGVidWdnaW5nIG91dHB1dD9cbiAgICBkaXNhYmxlSW52YWxpZFN1Ym1pdDogdHJ1ZSwgLy8gRGlzYWJsZSBzdWJtaXQgaWYgZm9ybSBpbnZhbGlkP1xuICAgIGZvcm1EaXNhYmxlZDogZmFsc2UsIC8vIFNldCBlbnRpcmUgZm9ybSBhcyBkaXNhYmxlZD8gKG5vdCBlZGl0YWJsZSwgYW5kIGRpc2FibGVzIG91dHB1dHMpXG4gICAgZm9ybVJlYWRvbmx5OiBmYWxzZSwgLy8gU2V0IGVudGlyZSBmb3JtIGFzIHJlYWQgb25seT8gKG5vdCBlZGl0YWJsZSwgYnV0IG91dHB1dHMgc3RpbGwgZW5hYmxlZClcbiAgICBmaWVsZHNSZXF1aXJlZDogZmFsc2UsIC8vIChzZXQgYXV0b21hdGljYWxseSkgQXJlIHRoZXJlIGFueSByZXF1aXJlZCBmaWVsZHMgaW4gdGhlIGZvcm0/XG4gICAgZnJhbWV3b3JrOiBcIm5vLWZyYW1ld29ya1wiLCAvLyBUaGUgZnJhbWV3b3JrIHRvIGxvYWRcbiAgICBsb2FkRXh0ZXJuYWxBc3NldHM6IGZhbHNlLCAvLyBMb2FkIGV4dGVybmFsIGNzcyBhbmQgSmF2YVNjcmlwdCBmb3IgZnJhbWV3b3JrP1xuICAgIHByaXN0aW5lOiB7IGVycm9yczogdHJ1ZSwgc3VjY2VzczogdHJ1ZSB9LFxuICAgIHN1cHJlc3NQcm9wZXJ0eVRpdGxlczogZmFsc2UsXG4gICAgc2V0U2NoZW1hRGVmYXVsdHM6IFwiYXV0b1wiLCAvLyBTZXQgZmVmYXVsdCB2YWx1ZXMgZnJvbSBzY2hlbWE/XG4gICAgLy8gdHJ1ZSA9IGFsd2F5cyBzZXQgKHVubGVzcyBvdmVycmlkZGVuIGJ5IGxheW91dCBkZWZhdWx0IG9yIGZvcm1WYWx1ZXMpXG4gICAgLy8gZmFsc2UgPSBuZXZlciBzZXRcbiAgICAvLyAnYXV0bycgPSBzZXQgaW4gYWRkYWJsZSBjb21wb25lbnRzLCBhbmQgZXZlcnl3aGVyZSBpZiBmb3JtVmFsdWVzIG5vdCBzZXRcbiAgICBzZXRMYXlvdXREZWZhdWx0czogXCJhdXRvXCIsIC8vIFNldCBmZWZhdWx0IHZhbHVlcyBmcm9tIGxheW91dD9cbiAgICAvLyB0cnVlID0gYWx3YXlzIHNldCAodW5sZXNzIG92ZXJyaWRkZW4gYnkgZm9ybVZhbHVlcylcbiAgICAvLyBmYWxzZSA9IG5ldmVyIHNldFxuICAgIC8vICdhdXRvJyA9IHNldCBpbiBhZGRhYmxlIGNvbXBvbmVudHMsIGFuZCBldmVyeXdoZXJlIGlmIGZvcm1WYWx1ZXMgbm90IHNldFxuICAgIHZhbGlkYXRlT25SZW5kZXI6IFwiYXV0b1wiLCAvLyBWYWxpZGF0ZSBmaWVsZHMgaW1tZWRpYXRlbHksIGJlZm9yZSB0aGV5IGFyZSB0b3VjaGVkP1xuICAgIC8vIHRydWUgPSB2YWxpZGF0ZSBhbGwgZmllbGRzIGltbWVkaWF0ZWx5XG4gICAgLy8gZmFsc2UgPSBvbmx5IHZhbGlkYXRlIGZpZWxkcyBhZnRlciB0aGV5IGFyZSB0b3VjaGVkIGJ5IHVzZXJcbiAgICAvLyAnYXV0bycgPSB2YWxpZGF0ZSBmaWVsZHMgd2l0aCB2YWx1ZXMgaW1tZWRpYXRlbHksIGVtcHR5IGZpZWxkcyBhZnRlciB0aGV5IGFyZSB0b3VjaGVkXG4gICAgd2lkZ2V0czoge30sIC8vIEFueSBjdXN0b20gd2lkZ2V0cyB0byBsb2FkXG4gICAgZGVmYXV0V2lkZ2V0T3B0aW9uczoge1xuICAgICAgLy8gRGVmYXVsdCBvcHRpb25zIGZvciBmb3JtIGNvbnRyb2wgd2lkZ2V0c1xuICAgICAgbGlzdEl0ZW1zOiAxLCAvLyBOdW1iZXIgb2YgbGlzdCBpdGVtcyB0byBpbml0aWFsbHkgYWRkIHRvIGFycmF5cyB3aXRoIG5vIGRlZmF1bHQgdmFsdWVcbiAgICAgIGFkZGFibGU6IHRydWUsIC8vIEFsbG93IGFkZGluZyBpdGVtcyB0byBhbiBhcnJheSBvciAkcmVmIHBvaW50P1xuICAgICAgb3JkZXJhYmxlOiB0cnVlLCAvLyBBbGxvdyByZW9yZGVyaW5nIGl0ZW1zIHdpdGhpbiBhbiBhcnJheT9cbiAgICAgIHJlbW92YWJsZTogdHJ1ZSwgLy8gQWxsb3cgcmVtb3ZpbmcgaXRlbXMgZnJvbSBhbiBhcnJheSBvciAkcmVmIHBvaW50P1xuICAgICAgZW5hYmxlRXJyb3JTdGF0ZTogdHJ1ZSwgLy8gQXBwbHkgJ2hhcy1lcnJvcicgY2xhc3Mgd2hlbiBmaWVsZCBmYWlscyB2YWxpZGF0aW9uP1xuICAgICAgLy8gZGlzYWJsZUVycm9yU3RhdGU6IGZhbHNlLCAvLyBEb24ndCBhcHBseSAnaGFzLWVycm9yJyBjbGFzcyB3aGVuIGZpZWxkIGZhaWxzIHZhbGlkYXRpb24/XG4gICAgICBlbmFibGVTdWNjZXNzU3RhdGU6IHRydWUsIC8vIEFwcGx5ICdoYXMtc3VjY2VzcycgY2xhc3Mgd2hlbiBmaWVsZCB2YWxpZGF0ZXM/XG4gICAgICAvLyBkaXNhYmxlU3VjY2Vzc1N0YXRlOiBmYWxzZSwgLy8gRG9uJ3QgYXBwbHkgJ2hhcy1zdWNjZXNzJyBjbGFzcyB3aGVuIGZpZWxkIHZhbGlkYXRlcz9cbiAgICAgIGZlZWRiYWNrOiBmYWxzZSwgLy8gU2hvdyBpbmxpbmUgZmVlZGJhY2sgaWNvbnM/XG4gICAgICBmZWVkYmFja09uUmVuZGVyOiBmYWxzZSwgLy8gU2hvdyBlcnJvck1lc3NhZ2Ugb24gUmVuZGVyP1xuICAgICAgbm90aXRsZTogZmFsc2UsIC8vIEhpZGUgdGl0bGU/XG4gICAgICBkaXNhYmxlZDogZmFsc2UsIC8vIFNldCBjb250cm9sIGFzIGRpc2FibGVkPyAobm90IGVkaXRhYmxlLCBhbmQgZXhjbHVkZWQgZnJvbSBvdXRwdXQpXG4gICAgICByZWFkb25seTogZmFsc2UsIC8vIFNldCBjb250cm9sIGFzIHJlYWQgb25seT8gKG5vdCBlZGl0YWJsZSwgYnV0IGluY2x1ZGVkIGluIG91dHB1dClcbiAgICAgIHJldHVybkVtcHR5RmllbGRzOiB0cnVlLCAvLyByZXR1cm4gdmFsdWVzIGZvciBmaWVsZHMgdGhhdCBjb250YWluIG5vIGRhdGE/XG4gICAgICB2YWxpZGF0aW9uTWVzc2FnZXM6IHt9LCAvLyBzZXQgYnkgc2V0TGFuZ3VhZ2UoKVxuICAgIH0sXG4gIH07XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZXRMYW5ndWFnZSh0aGlzLmxhbmd1YWdlKTtcbiAgICB0aGlzLmFqdi5hZGRNZXRhU2NoZW1hKGpzb25EcmFmdDYpO1xuICB9XG5cbiAgc2V0TGFuZ3VhZ2UobGFuZ3VhZ2U6IHN0cmluZyA9IFwiZW4tVVNcIikge1xuICAgIHRoaXMubGFuZ3VhZ2UgPSBsYW5ndWFnZTtcbiAgICBjb25zdCBsYW5ndWFnZVZhbGlkYXRpb25NZXNzYWdlcyA9IHtcbiAgICAgIGZyOiBmclZhbGlkYXRpb25NZXNzYWdlcyxcbiAgICAgIGVuOiBlblZhbGlkYXRpb25NZXNzYWdlcyxcbiAgICAgIGl0OiBpdFZhbGlkYXRpb25NZXNzYWdlcyxcbiAgICAgIHB0OiBwdFZhbGlkYXRpb25NZXNzYWdlcyxcbiAgICAgIHpoOiB6aFZhbGlkYXRpb25NZXNzYWdlcyxcbiAgICB9O1xuICAgIGNvbnN0IGxhbmd1YWdlQ29kZSA9IGxhbmd1YWdlLnNsaWNlKDAsIDIpO1xuXG4gICAgY29uc3QgdmFsaWRhdGlvbk1lc3NhZ2VzID0gbGFuZ3VhZ2VWYWxpZGF0aW9uTWVzc2FnZXNbbGFuZ3VhZ2VDb2RlXTtcblxuICAgIHRoaXMuZGVmYXVsdEZvcm1PcHRpb25zLmRlZmF1dFdpZGdldE9wdGlvbnMudmFsaWRhdGlvbk1lc3NhZ2VzID0gY2xvbmVEZWVwKFxuICAgICAgdmFsaWRhdGlvbk1lc3NhZ2VzXG4gICAgKTtcbiAgfVxuXG4gIGdldERhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YTtcbiAgfVxuXG4gIGdldFNjaGVtYSgpIHtcbiAgICByZXR1cm4gdGhpcy5zY2hlbWE7XG4gIH1cblxuICBnZXRMYXlvdXQoKSB7XG4gICAgcmV0dXJuIHRoaXMubGF5b3V0O1xuICB9XG5cbiAgcmVzZXRBbGxWYWx1ZXMoKSB7XG4gICAgdGhpcy5Kc29uRm9ybUNvbXBhdGliaWxpdHkgPSBmYWxzZTtcbiAgICB0aGlzLlJlYWN0SnNvblNjaGVtYUZvcm1Db21wYXRpYmlsaXR5ID0gZmFsc2U7XG4gICAgdGhpcy5Bbmd1bGFyU2NoZW1hRm9ybUNvbXBhdGliaWxpdHkgPSBmYWxzZTtcbiAgICB0aGlzLnRwbGRhdGEgPSB7fTtcbiAgICB0aGlzLnZhbGlkYXRlRm9ybURhdGEgPSBudWxsO1xuICAgIHRoaXMuZm9ybVZhbHVlcyA9IHt9O1xuICAgIHRoaXMuc2NoZW1hID0ge307XG4gICAgdGhpcy5sYXlvdXQgPSBbXTtcbiAgICB0aGlzLmZvcm1Hcm91cFRlbXBsYXRlID0ge307XG4gICAgdGhpcy5mb3JtR3JvdXAgPSBudWxsO1xuICAgIHRoaXMuZnJhbWV3b3JrID0gbnVsbDtcbiAgICB0aGlzLmRhdGEgPSB7fTtcbiAgICB0aGlzLnZhbGlkRGF0YSA9IG51bGw7XG4gICAgdGhpcy5pc1ZhbGlkID0gbnVsbDtcbiAgICB0aGlzLnZhbGlkYXRpb25FcnJvcnMgPSBudWxsO1xuICAgIHRoaXMuYXJyYXlNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5kYXRhTWFwID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuZGF0YVJlY3Vyc2l2ZVJlZk1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLnNjaGVtYVJlY3Vyc2l2ZVJlZk1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmxheW91dFJlZkxpYnJhcnkgPSB7fTtcbiAgICB0aGlzLnNjaGVtYVJlZkxpYnJhcnkgPSB7fTtcbiAgICB0aGlzLnRlbXBsYXRlUmVmTGlicmFyeSA9IHt9O1xuICAgIHRoaXMuZm9ybU9wdGlvbnMgPSBjbG9uZURlZXAodGhpcy5kZWZhdWx0Rm9ybU9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqICdidWlsZFJlbW90ZUVycm9yJyBmdW5jdGlvblxuICAgKlxuICAgKiBFeGFtcGxlIGVycm9yczpcbiAgICoge1xuICAgKiAgIGxhc3RfbmFtZTogWyB7XG4gICAqICAgICBtZXNzYWdlOiAnTGFzdCBuYW1lIG11c3QgYnkgc3RhcnQgd2l0aCBjYXBpdGFsIGxldHRlci4nLFxuICAgKiAgICAgY29kZTogJ2NhcGl0YWxfbGV0dGVyJ1xuICAgKiAgIH0gXSxcbiAgICogICBlbWFpbDogWyB7XG4gICAqICAgICBtZXNzYWdlOiAnRW1haWwgbXVzdCBiZSBmcm9tIGV4YW1wbGUuY29tIGRvbWFpbi4nLFxuICAgKiAgICAgY29kZTogJ3NwZWNpYWxfZG9tYWluJ1xuICAgKiAgIH0sIHtcbiAgICogICAgIG1lc3NhZ2U6ICdFbWFpbCBtdXN0IGNvbnRhaW4gYW4gQCBzeW1ib2wuJyxcbiAgICogICAgIGNvZGU6ICdhdF9zeW1ib2wnXG4gICAqICAgfSBdXG4gICAqIH1cbiAgICogLy97RXJyb3JNZXNzYWdlc30gZXJyb3JzXG4gICAqL1xuICBidWlsZFJlbW90ZUVycm9yKGVycm9yczogRXJyb3JNZXNzYWdlcykge1xuICAgIGZvckVhY2goZXJyb3JzLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgaWYgKGtleSBpbiB0aGlzLmZvcm1Hcm91cC5jb250cm9scykge1xuICAgICAgICBmb3IgKGNvbnN0IGVycm9yIG9mIHZhbHVlKSB7XG4gICAgICAgICAgY29uc3QgZXJyID0ge307XG4gICAgICAgICAgZXJyW2Vycm9yW1wiY29kZVwiXV0gPSBlcnJvcltcIm1lc3NhZ2VcIl07XG4gICAgICAgICAgdGhpcy5mb3JtR3JvdXAuZ2V0KGtleSkuc2V0RXJyb3JzKGVyciwgeyBlbWl0RXZlbnQ6IHRydWUgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHZhbGlkYXRlRGF0YShuZXdWYWx1ZTogYW55LCB1cGRhdGVTdWJzY3JpcHRpb25zID0gdHJ1ZSk6IHZvaWQge1xuICAgIC8vIEZvcm1hdCByYXcgZm9ybSBkYXRhIHRvIGNvcnJlY3QgZGF0YSB0eXBlc1xuICAgIHRoaXMuZGF0YSA9IGZvcm1hdEZvcm1EYXRhKFxuICAgICAgbmV3VmFsdWUsXG4gICAgICB0aGlzLmRhdGFNYXAsXG4gICAgICB0aGlzLmRhdGFSZWN1cnNpdmVSZWZNYXAsXG4gICAgICB0aGlzLmFycmF5TWFwLFxuICAgICAgdGhpcy5mb3JtT3B0aW9ucy5yZXR1cm5FbXB0eUZpZWxkc1xuICAgICk7XG4gICAgdGhpcy5pc1ZhbGlkID0gdGhpcy52YWxpZGF0ZUZvcm1EYXRhKHRoaXMuZGF0YSk7XG4gICAgdGhpcy52YWxpZERhdGEgPSB0aGlzLmlzVmFsaWQgPyB0aGlzLmRhdGEgOiBudWxsO1xuICAgIGNvbnN0IGNvbXBpbGVFcnJvcnMgPSAoZXJyb3JzKSA9PiB7XG4gICAgICBjb25zdCBjb21waWxlZEVycm9ycyA9IHt9O1xuICAgICAgKGVycm9ycyB8fCBbXSkuZm9yRWFjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgaWYgKCFjb21waWxlZEVycm9yc1tlcnJvci5kYXRhUGF0aF0pIHtcbiAgICAgICAgICBjb21waWxlZEVycm9yc1tlcnJvci5kYXRhUGF0aF0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBjb21waWxlZEVycm9yc1tlcnJvci5kYXRhUGF0aF0ucHVzaChlcnJvci5tZXNzYWdlKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGNvbXBpbGVkRXJyb3JzO1xuICAgIH07XG4gICAgdGhpcy5hanZFcnJvcnMgPSB0aGlzLnZhbGlkYXRlRm9ybURhdGEuZXJyb3JzO1xuICAgIHRoaXMudmFsaWRhdGlvbkVycm9ycyA9IGNvbXBpbGVFcnJvcnModGhpcy52YWxpZGF0ZUZvcm1EYXRhLmVycm9ycyk7XG4gICAgaWYgKHVwZGF0ZVN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuZGF0YUNoYW5nZXMubmV4dCh0aGlzLmRhdGEpO1xuICAgICAgdGhpcy5pc1ZhbGlkQ2hhbmdlcy5uZXh0KHRoaXMuaXNWYWxpZCk7XG4gICAgICB0aGlzLnZhbGlkYXRpb25FcnJvckNoYW5nZXMubmV4dCh0aGlzLmFqdkVycm9ycyk7XG4gICAgfVxuICB9XG5cbiAgYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZShmb3JtVmFsdWVzOiBhbnkgPSBudWxsLCBzZXRWYWx1ZXMgPSB0cnVlKSB7XG4gICAgdGhpcy5mb3JtR3JvdXBUZW1wbGF0ZSA9IGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGUoXG4gICAgICB0aGlzLFxuICAgICAgZm9ybVZhbHVlcyxcbiAgICAgIHNldFZhbHVlc1xuICAgICk7XG4gIH1cblxuICBidWlsZEZvcm1Hcm91cCgpIHtcbiAgICB0aGlzLmZvcm1Hcm91cCA9IDxGb3JtR3JvdXA+YnVpbGRGb3JtR3JvdXAodGhpcy5mb3JtR3JvdXBUZW1wbGF0ZSk7XG4gICAgaWYgKHRoaXMuZm9ybUdyb3VwKSB7XG4gICAgICB0aGlzLmNvbXBpbGVBanZTY2hlbWEoKTtcbiAgICAgIHRoaXMudmFsaWRhdGVEYXRhKHRoaXMuZm9ybUdyb3VwLnZhbHVlKTtcblxuICAgICAgLy8gU2V0IHVwIG9ic2VydmFibGVzIHRvIGVtaXQgZGF0YSBhbmQgdmFsaWRhdGlvbiBpbmZvIHdoZW4gZm9ybSBkYXRhIGNoYW5nZXNcbiAgICAgIGlmICh0aGlzLmZvcm1WYWx1ZVN1YnNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLmZvcm1WYWx1ZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5mb3JtVmFsdWVTdWJzY3JpcHRpb24gPSB0aGlzLmZvcm1Hcm91cC52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKFxuICAgICAgICAoZm9ybVZhbHVlKSA9PiB0aGlzLnZhbGlkYXRlRGF0YShmb3JtVmFsdWUpXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGJ1aWxkTGF5b3V0KHdpZGdldExpYnJhcnk6IGFueSkge1xuICAgIHRoaXMubGF5b3V0ID0gYnVpbGRMYXlvdXQodGhpcywgd2lkZ2V0TGlicmFyeSk7XG4gIH1cblxuICBzZXRPcHRpb25zKG5ld09wdGlvbnM6IGFueSkge1xuICAgIGlmIChpc09iamVjdChuZXdPcHRpb25zKSkge1xuICAgICAgY29uc3QgYWRkT3B0aW9ucyA9IGNsb25lRGVlcChuZXdPcHRpb25zKTtcbiAgICAgIC8vIEJhY2t3YXJkIGNvbXBhdGliaWxpdHkgZm9yICdkZWZhdWx0T3B0aW9ucycgKHJlbmFtZWQgJ2RlZmF1dFdpZGdldE9wdGlvbnMnKVxuICAgICAgaWYgKGlzT2JqZWN0KGFkZE9wdGlvbnMuZGVmYXVsdE9wdGlvbnMpKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgdGhpcy5mb3JtT3B0aW9ucy5kZWZhdXRXaWRnZXRPcHRpb25zLFxuICAgICAgICAgIGFkZE9wdGlvbnMuZGVmYXVsdE9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgICAgZGVsZXRlIGFkZE9wdGlvbnMuZGVmYXVsdE9wdGlvbnM7XG4gICAgICB9XG4gICAgICBpZiAoaXNPYmplY3QoYWRkT3B0aW9ucy5kZWZhdXRXaWRnZXRPcHRpb25zKSkge1xuICAgICAgICBPYmplY3QuYXNzaWduKFxuICAgICAgICAgIHRoaXMuZm9ybU9wdGlvbnMuZGVmYXV0V2lkZ2V0T3B0aW9ucyxcbiAgICAgICAgICBhZGRPcHRpb25zLmRlZmF1dFdpZGdldE9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgICAgZGVsZXRlIGFkZE9wdGlvbnMuZGVmYXV0V2lkZ2V0T3B0aW9ucztcbiAgICAgIH1cbiAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5mb3JtT3B0aW9ucywgYWRkT3B0aW9ucyk7XG5cbiAgICAgIC8vIGNvbnZlcnQgZGlzYWJsZUVycm9yU3RhdGUgLyBkaXNhYmxlU3VjY2Vzc1N0YXRlIHRvIGVuYWJsZS4uLlxuICAgICAgY29uc3QgZ2xvYmFsRGVmYXVsdHMgPSB0aGlzLmZvcm1PcHRpb25zLmRlZmF1dFdpZGdldE9wdGlvbnM7XG4gICAgICBbXCJFcnJvclN0YXRlXCIsIFwiU3VjY2Vzc1N0YXRlXCJdXG4gICAgICAgIC5maWx0ZXIoKHN1ZmZpeCkgPT4gaGFzT3duKGdsb2JhbERlZmF1bHRzLCBcImRpc2FibGVcIiArIHN1ZmZpeCkpXG4gICAgICAgIC5mb3JFYWNoKChzdWZmaXgpID0+IHtcbiAgICAgICAgICBnbG9iYWxEZWZhdWx0c1tcImVuYWJsZVwiICsgc3VmZml4XSA9ICFnbG9iYWxEZWZhdWx0c1tcbiAgICAgICAgICAgIFwiZGlzYWJsZVwiICsgc3VmZml4XG4gICAgICAgICAgXTtcbiAgICAgICAgICBkZWxldGUgZ2xvYmFsRGVmYXVsdHNbXCJkaXNhYmxlXCIgKyBzdWZmaXhdO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBjb21waWxlQWp2U2NoZW1hKCkge1xuICAgIGlmICghdGhpcy52YWxpZGF0ZUZvcm1EYXRhKSB7XG4gICAgICAvLyBpZiAndWk6b3JkZXInIGV4aXN0cyBpbiBwcm9wZXJ0aWVzLCBtb3ZlIGl0IHRvIHJvb3QgYmVmb3JlIGNvbXBpbGluZyB3aXRoIGFqdlxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5zY2hlbWEucHJvcGVydGllc1tcInVpOm9yZGVyXCJdKSkge1xuICAgICAgICB0aGlzLnNjaGVtYVtcInVpOm9yZGVyXCJdID0gdGhpcy5zY2hlbWEucHJvcGVydGllc1tcInVpOm9yZGVyXCJdO1xuICAgICAgICBkZWxldGUgdGhpcy5zY2hlbWEucHJvcGVydGllc1tcInVpOm9yZGVyXCJdO1xuICAgICAgfVxuICAgICAgdGhpcy5hanYucmVtb3ZlU2NoZW1hKHRoaXMuc2NoZW1hKTtcbiAgICAgIHRoaXMudmFsaWRhdGVGb3JtRGF0YSA9IHRoaXMuYWp2LmNvbXBpbGUodGhpcy5zY2hlbWEpO1xuICAgIH1cbiAgfVxuXG4gIGJ1aWxkU2NoZW1hRnJvbURhdGEoZGF0YT86IGFueSwgcmVxdWlyZUFsbEZpZWxkcyA9IGZhbHNlKTogYW55IHtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgcmV0dXJuIGJ1aWxkU2NoZW1hRnJvbURhdGEoZGF0YSwgcmVxdWlyZUFsbEZpZWxkcyk7XG4gICAgfVxuICAgIHRoaXMuc2NoZW1hID0gYnVpbGRTY2hlbWFGcm9tRGF0YSh0aGlzLmZvcm1WYWx1ZXMsIHJlcXVpcmVBbGxGaWVsZHMpO1xuICB9XG5cbiAgYnVpbGRTY2hlbWFGcm9tTGF5b3V0KGxheW91dD86IGFueSk6IGFueSB7XG4gICAgaWYgKGxheW91dCkge1xuICAgICAgcmV0dXJuIGJ1aWxkU2NoZW1hRnJvbUxheW91dChsYXlvdXQpO1xuICAgIH1cbiAgICB0aGlzLnNjaGVtYSA9IGJ1aWxkU2NoZW1hRnJvbUxheW91dCh0aGlzLmxheW91dCk7XG4gIH1cblxuICBzZXRUcGxkYXRhKG5ld1RwbGRhdGE6IGFueSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy50cGxkYXRhID0gbmV3VHBsZGF0YTtcbiAgfVxuXG4gIHBhcnNlVGV4dChcbiAgICB0ZXh0ID0gXCJcIixcbiAgICB2YWx1ZTogYW55ID0ge30sXG4gICAgdmFsdWVzOiBhbnkgPSB7fSxcbiAgICBrZXk6IG51bWJlciB8IHN0cmluZyA9IG51bGxcbiAgKTogc3RyaW5nIHtcbiAgICBpZiAoIXRleHQgfHwgIS97ey4rP319Ly50ZXN0KHRleHQpKSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgcmV0dXJuIHRleHQucmVwbGFjZSgve3soLis/KX19L2csICguLi5hKSA9PlxuICAgICAgdGhpcy5wYXJzZUV4cHJlc3Npb24oYVsxXSwgdmFsdWUsIHZhbHVlcywga2V5LCB0aGlzLnRwbGRhdGEpXG4gICAgKTtcbiAgfVxuXG4gIHBhcnNlRXhwcmVzc2lvbihcbiAgICBleHByZXNzaW9uID0gXCJcIixcbiAgICB2YWx1ZTogYW55ID0ge30sXG4gICAgdmFsdWVzOiBhbnkgPSB7fSxcbiAgICBrZXk6IG51bWJlciB8IHN0cmluZyA9IG51bGwsXG4gICAgdHBsZGF0YTogYW55ID0gbnVsbFxuICApIHtcbiAgICBpZiAodHlwZW9mIGV4cHJlc3Npb24gIT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgICBjb25zdCBpbmRleCA9IHR5cGVvZiBrZXkgPT09IFwibnVtYmVyXCIgPyBrZXkgKyAxICsgXCJcIiA6IGtleSB8fCBcIlwiO1xuICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnRyaW0oKTtcbiAgICBpZiAoXG4gICAgICAoZXhwcmVzc2lvblswXSA9PT0gXCInXCIgfHwgZXhwcmVzc2lvblswXSA9PT0gJ1wiJykgJiZcbiAgICAgIGV4cHJlc3Npb25bMF0gPT09IGV4cHJlc3Npb25bZXhwcmVzc2lvbi5sZW5ndGggLSAxXSAmJlxuICAgICAgZXhwcmVzc2lvbi5zbGljZSgxLCBleHByZXNzaW9uLmxlbmd0aCAtIDEpLmluZGV4T2YoZXhwcmVzc2lvblswXSkgPT09IC0xXG4gICAgKSB7XG4gICAgICByZXR1cm4gZXhwcmVzc2lvbi5zbGljZSgxLCBleHByZXNzaW9uLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgICBpZiAoZXhwcmVzc2lvbiA9PT0gXCJpZHhcIiB8fCBleHByZXNzaW9uID09PSBcIiRpbmRleFwiKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICAgIGlmIChleHByZXNzaW9uID09PSBcInZhbHVlXCIgJiYgIWhhc093bih2YWx1ZXMsIFwidmFsdWVcIikpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgWydcIicsIFwiJ1wiLCBcIiBcIiwgXCJ8fFwiLCBcIiYmXCIsIFwiK1wiXS5ldmVyeShcbiAgICAgICAgKGRlbGltKSA9PiBleHByZXNzaW9uLmluZGV4T2YoZGVsaW0pID09PSAtMVxuICAgICAgKVxuICAgICkge1xuICAgICAgY29uc3QgcG9pbnRlciA9IEpzb25Qb2ludGVyLnBhcnNlT2JqZWN0UGF0aChleHByZXNzaW9uKTtcbiAgICAgIHJldHVybiBwb2ludGVyWzBdID09PSBcInZhbHVlXCIgJiYgSnNvblBvaW50ZXIuaGFzKHZhbHVlLCBwb2ludGVyLnNsaWNlKDEpKVxuICAgICAgICA/IEpzb25Qb2ludGVyLmdldCh2YWx1ZSwgcG9pbnRlci5zbGljZSgxKSlcbiAgICAgICAgOiBwb2ludGVyWzBdID09PSBcInZhbHVlc1wiICYmIEpzb25Qb2ludGVyLmhhcyh2YWx1ZXMsIHBvaW50ZXIuc2xpY2UoMSkpXG4gICAgICAgID8gSnNvblBvaW50ZXIuZ2V0KHZhbHVlcywgcG9pbnRlci5zbGljZSgxKSlcbiAgICAgICAgOiBwb2ludGVyWzBdID09PSBcInRwbGRhdGFcIiAmJiBKc29uUG9pbnRlci5oYXModHBsZGF0YSwgcG9pbnRlci5zbGljZSgxKSlcbiAgICAgICAgPyBKc29uUG9pbnRlci5nZXQodHBsZGF0YSwgcG9pbnRlci5zbGljZSgxKSlcbiAgICAgICAgOiBKc29uUG9pbnRlci5oYXModmFsdWVzLCBwb2ludGVyKVxuICAgICAgICA/IEpzb25Qb2ludGVyLmdldCh2YWx1ZXMsIHBvaW50ZXIpXG4gICAgICAgIDogXCJcIjtcbiAgICB9XG4gICAgaWYgKGV4cHJlc3Npb24uaW5kZXhPZihcIltpZHhdXCIpID4gLTEpIHtcbiAgICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnJlcGxhY2UoL1xcW2lkeFxcXS9nLCA8c3RyaW5nPmluZGV4KTtcbiAgICB9XG4gICAgaWYgKGV4cHJlc3Npb24uaW5kZXhPZihcIlskaW5kZXhdXCIpID4gLTEpIHtcbiAgICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnJlcGxhY2UoL1xcWyRpbmRleFxcXS9nLCA8c3RyaW5nPmluZGV4KTtcbiAgICB9XG4gICAgLy8gVE9ETzogSW1wcm92ZSBleHByZXNzaW9uIGV2YWx1YXRpb24gYnkgcGFyc2luZyBxdW90ZWQgc3RyaW5ncyBmaXJzdFxuICAgIC8vIGxldCBleHByZXNzaW9uQXJyYXkgPSBleHByZXNzaW9uLm1hdGNoKC8oW15cIiddK3xcIlteXCJdK1wifCdbXiddKycpL2cpO1xuICAgIGlmIChleHByZXNzaW9uLmluZGV4T2YoXCJ8fFwiKSA+IC0xKSB7XG4gICAgICByZXR1cm4gZXhwcmVzc2lvblxuICAgICAgICAuc3BsaXQoXCJ8fFwiKVxuICAgICAgICAucmVkdWNlKFxuICAgICAgICAgIChhbGwsIHRlcm0pID0+XG4gICAgICAgICAgICBhbGwgfHwgdGhpcy5wYXJzZUV4cHJlc3Npb24odGVybSwgdmFsdWUsIHZhbHVlcywga2V5LCB0cGxkYXRhKSxcbiAgICAgICAgICBcIlwiXG4gICAgICAgICk7XG4gICAgfVxuICAgIGlmIChleHByZXNzaW9uLmluZGV4T2YoXCImJlwiKSA+IC0xKSB7XG4gICAgICByZXR1cm4gZXhwcmVzc2lvblxuICAgICAgICAuc3BsaXQoXCImJlwiKVxuICAgICAgICAucmVkdWNlKFxuICAgICAgICAgIChhbGwsIHRlcm0pID0+XG4gICAgICAgICAgICBhbGwgJiYgdGhpcy5wYXJzZUV4cHJlc3Npb24odGVybSwgdmFsdWUsIHZhbHVlcywga2V5LCB0cGxkYXRhKSxcbiAgICAgICAgICBcIiBcIlxuICAgICAgICApXG4gICAgICAgIC50cmltKCk7XG4gICAgfVxuICAgIGlmIChleHByZXNzaW9uLmluZGV4T2YoXCIrXCIpID4gLTEpIHtcbiAgICAgIHJldHVybiBleHByZXNzaW9uXG4gICAgICAgIC5zcGxpdChcIitcIilcbiAgICAgICAgLm1hcCgodGVybSkgPT4gdGhpcy5wYXJzZUV4cHJlc3Npb24odGVybSwgdmFsdWUsIHZhbHVlcywga2V5LCB0cGxkYXRhKSlcbiAgICAgICAgLmpvaW4oXCJcIik7XG4gICAgfVxuICAgIHJldHVybiBcIlwiO1xuICB9XG5cbiAgc2V0QXJyYXlJdGVtVGl0bGUoXG4gICAgcGFyZW50Q3R4OiBhbnkgPSB7fSxcbiAgICBjaGlsZE5vZGU6IGFueSA9IG51bGwsXG4gICAgaW5kZXg6IG51bWJlciA9IG51bGxcbiAgKTogc3RyaW5nIHtcbiAgICBjb25zdCBwYXJlbnROb2RlID0gcGFyZW50Q3R4LmxheW91dE5vZGU7XG4gICAgY29uc3QgcGFyZW50VmFsdWVzOiBhbnkgPSB0aGlzLmdldEZvcm1Db250cm9sVmFsdWUocGFyZW50Q3R4KTtcbiAgICBjb25zdCBpc0FycmF5SXRlbSA9XG4gICAgICAocGFyZW50Tm9kZS50eXBlIHx8IFwiXCIpLnNsaWNlKC01KSA9PT0gXCJhcnJheVwiICYmIGlzQXJyYXkocGFyZW50VmFsdWVzKTtcbiAgICBjb25zdCB0ZXh0ID0gSnNvblBvaW50ZXIuZ2V0Rmlyc3QoXG4gICAgICBpc0FycmF5SXRlbSAmJiBjaGlsZE5vZGUudHlwZSAhPT0gXCIkcmVmXCJcbiAgICAgICAgPyBbXG4gICAgICAgICAgICBbY2hpbGROb2RlLCBcIi9vcHRpb25zL2xlZ2VuZFwiXSxcbiAgICAgICAgICAgIFtjaGlsZE5vZGUsIFwiL29wdGlvbnMvdGl0bGVcIl0sXG4gICAgICAgICAgICBbcGFyZW50Tm9kZSwgXCIvb3B0aW9ucy90aXRsZVwiXSxcbiAgICAgICAgICAgIFtwYXJlbnROb2RlLCBcIi9vcHRpb25zL2xlZ2VuZFwiXSxcbiAgICAgICAgICBdXG4gICAgICAgIDogW1xuICAgICAgICAgICAgW2NoaWxkTm9kZSwgXCIvb3B0aW9ucy90aXRsZVwiXSxcbiAgICAgICAgICAgIFtjaGlsZE5vZGUsIFwiL29wdGlvbnMvbGVnZW5kXCJdLFxuICAgICAgICAgICAgW3BhcmVudE5vZGUsIFwiL29wdGlvbnMvdGl0bGVcIl0sXG4gICAgICAgICAgICBbcGFyZW50Tm9kZSwgXCIvb3B0aW9ucy9sZWdlbmRcIl0sXG4gICAgICAgICAgXVxuICAgICk7XG4gICAgaWYgKCF0ZXh0KSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgY29uc3QgY2hpbGRWYWx1ZSA9XG4gICAgICBpc0FycmF5KHBhcmVudFZhbHVlcykgJiYgaW5kZXggPCBwYXJlbnRWYWx1ZXMubGVuZ3RoXG4gICAgICAgID8gcGFyZW50VmFsdWVzW2luZGV4XVxuICAgICAgICA6IHBhcmVudFZhbHVlcztcbiAgICByZXR1cm4gdGhpcy5wYXJzZVRleHQodGV4dCwgY2hpbGRWYWx1ZSwgcGFyZW50VmFsdWVzLCBpbmRleCk7XG4gIH1cblxuICBzZXRJdGVtVGl0bGUoY3R4OiBhbnkpIHtcbiAgICByZXR1cm4gIWN0eC5vcHRpb25zLnRpdGxlICYmIC9eKFxcZCt8LSkkLy50ZXN0KGN0eC5sYXlvdXROb2RlLm5hbWUpXG4gICAgICA/IG51bGxcbiAgICAgIDogdGhpcy5wYXJzZVRleHQoXG4gICAgICAgICAgY3R4Lm9wdGlvbnMudGl0bGUgfHwgdG9UaXRsZUNhc2UoY3R4LmxheW91dE5vZGUubmFtZSksXG4gICAgICAgICAgdGhpcy5nZXRGb3JtQ29udHJvbFZhbHVlKHRoaXMpLFxuICAgICAgICAgICh0aGlzLmdldEZvcm1Db250cm9sR3JvdXAodGhpcykgfHwgPGFueT57fSkudmFsdWUsXG4gICAgICAgICAgY3R4LmRhdGFJbmRleFtjdHguZGF0YUluZGV4Lmxlbmd0aCAtIDFdXG4gICAgICAgICk7XG4gIH1cblxuICBldmFsdWF0ZUNvbmRpdGlvbihsYXlvdXROb2RlOiBhbnksIGRhdGFJbmRleDogbnVtYmVyW10pOiBib29sZWFuIHtcbiAgICBjb25zdCBhcnJheUluZGV4ID0gZGF0YUluZGV4ICYmIGRhdGFJbmRleFtkYXRhSW5kZXgubGVuZ3RoIC0gMV07XG4gICAgbGV0IHJlc3VsdCA9IHRydWU7XG4gICAgaWYgKGhhc1ZhbHVlKChsYXlvdXROb2RlLm9wdGlvbnMgfHwge30pLmNvbmRpdGlvbikpIHtcbiAgICAgIGlmICh0eXBlb2YgbGF5b3V0Tm9kZS5vcHRpb25zLmNvbmRpdGlvbiA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBsZXQgcG9pbnRlciA9IGxheW91dE5vZGUub3B0aW9ucy5jb25kaXRpb247XG4gICAgICAgIGlmIChoYXNWYWx1ZShhcnJheUluZGV4KSkge1xuICAgICAgICAgIHBvaW50ZXIgPSBwb2ludGVyLnJlcGxhY2UoXCJbYXJyYXlJbmRleF1cIiwgYFske2FycmF5SW5kZXh9XWApO1xuICAgICAgICB9XG4gICAgICAgIHBvaW50ZXIgPSBKc29uUG9pbnRlci5wYXJzZU9iamVjdFBhdGgocG9pbnRlcik7XG4gICAgICAgIHJlc3VsdCA9ICEhSnNvblBvaW50ZXIuZ2V0KHRoaXMuZGF0YSwgcG9pbnRlcik7XG4gICAgICAgIGlmICghcmVzdWx0ICYmIHBvaW50ZXJbMF0gPT09IFwibW9kZWxcIikge1xuICAgICAgICAgIHJlc3VsdCA9ICEhSnNvblBvaW50ZXIuZ2V0KHsgbW9kZWw6IHRoaXMuZGF0YSB9LCBwb2ludGVyKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbGF5b3V0Tm9kZS5vcHRpb25zLmNvbmRpdGlvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJlc3VsdCA9IGxheW91dE5vZGUub3B0aW9ucy5jb25kaXRpb24odGhpcy5kYXRhKTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHR5cGVvZiBsYXlvdXROb2RlLm9wdGlvbnMuY29uZGl0aW9uLmZ1bmN0aW9uQm9keSA9PT0gXCJzdHJpbmdcIlxuICAgICAgKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgZHluRm4gPSBuZXcgRnVuY3Rpb24oXG4gICAgICAgICAgICBcIm1vZGVsXCIsXG4gICAgICAgICAgICBcImFycmF5SW5kaWNlc1wiLFxuICAgICAgICAgICAgbGF5b3V0Tm9kZS5vcHRpb25zLmNvbmRpdGlvbi5mdW5jdGlvbkJvZHlcbiAgICAgICAgICApO1xuICAgICAgICAgIHJlc3VsdCA9IGR5bkZuKHRoaXMuZGF0YSwgZGF0YUluZGV4KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgIFwiY29uZGl0aW9uIGZ1bmN0aW9uQm9keSBlcnJvcmVkIG91dCBvbiBldmFsdWF0aW9uOiBcIiArXG4gICAgICAgICAgICAgIGxheW91dE5vZGUub3B0aW9ucy5jb25kaXRpb24uZnVuY3Rpb25Cb2R5XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaW5pdGlhbGl6ZUNvbnRyb2woY3R4OiBhbnksIGJpbmQgPSB0cnVlKTogYm9vbGVhbiB7XG4gICAgaWYgKCFpc09iamVjdChjdHgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChpc0VtcHR5KGN0eC5vcHRpb25zKSkge1xuICAgICAgY3R4Lm9wdGlvbnMgPSAhaXNFbXB0eSgoY3R4LmxheW91dE5vZGUgfHwge30pLm9wdGlvbnMpXG4gICAgICAgID8gY3R4LmxheW91dE5vZGUub3B0aW9uc1xuICAgICAgICA6IGNsb25lRGVlcCh0aGlzLmZvcm1PcHRpb25zKTtcbiAgICB9XG4gICAgY3R4LmZvcm1Db250cm9sID0gdGhpcy5nZXRGb3JtQ29udHJvbChjdHgpO1xuICAgIGN0eC5ib3VuZENvbnRyb2wgPSBiaW5kICYmICEhY3R4LmZvcm1Db250cm9sO1xuICAgIGlmIChjdHguZm9ybUNvbnRyb2wpIHtcbiAgICAgIGN0eC5jb250cm9sTmFtZSA9IHRoaXMuZ2V0Rm9ybUNvbnRyb2xOYW1lKGN0eCk7XG4gICAgICBjdHguY29udHJvbFZhbHVlID0gY3R4LmZvcm1Db250cm9sLnZhbHVlO1xuICAgICAgY3R4LmNvbnRyb2xEaXNhYmxlZCA9IGN0eC5mb3JtQ29udHJvbC5kaXNhYmxlZDtcbiAgICAgIC8vIEluaXRpYWwgZXJyb3IgbWVzc2FnZVxuICAgICAgY3R4Lm9wdGlvbnMuZXJyb3JNZXNzYWdlID1cbiAgICAgICAgY3R4LmZvcm1Db250cm9sLnN0YXR1cyA9PT0gXCJWQUxJRFwiXG4gICAgICAgICAgPyBudWxsXG4gICAgICAgICAgOiB0aGlzLmZvcm1hdEVycm9ycyhcbiAgICAgICAgICAgICAgY3R4LmZvcm1Db250cm9sLmVycm9ycyxcbiAgICAgICAgICAgICAgY3R4Lm9wdGlvbnMudmFsaWRhdGlvbk1lc3NhZ2VzXG4gICAgICAgICAgICApO1xuICAgICAgY3R4Lm9wdGlvbnMuc2hvd0Vycm9ycyA9XG4gICAgICAgIHRoaXMuZm9ybU9wdGlvbnMudmFsaWRhdGVPblJlbmRlciA9PT0gdHJ1ZSB8fFxuICAgICAgICAodGhpcy5mb3JtT3B0aW9ucy52YWxpZGF0ZU9uUmVuZGVyID09PSBcImF1dG9cIiAmJlxuICAgICAgICAgIGhhc1ZhbHVlKGN0eC5jb250cm9sVmFsdWUpKTtcbiAgICAgIC8vIFN1YnNjcmlwdGlvbiBmb3IgZXJyb3IgbWVzc2FnZXNcbiAgICAgIC8vIGN0eC5mb3JtQ29udHJvbC5zdGF0dXNDaGFuZ2VzLnN1YnNjcmliZShcbiAgICAgIC8vICAgKHN0YXR1cykgPT5cbiAgICAgIC8vICAgICAoY3R4Lm9wdGlvbnMuZXJyb3JNZXNzYWdlID1cbiAgICAgIC8vICAgICAgIHN0YXR1cyA9PT0gXCJWQUxJRFwiXG4gICAgICAvLyAgICAgICAgID8gbnVsbFxuICAgICAgLy8gICAgICAgICA6IHRoaXMuZm9ybWF0RXJyb3JzKFxuICAgICAgLy8gICAgICAgICAgICAgY3R4LmZvcm1Db250cm9sLmVycm9ycyxcbiAgICAgIC8vICAgICAgICAgICAgIGN0eC5vcHRpb25zLnZhbGlkYXRpb25NZXNzYWdlc1xuICAgICAgLy8gICAgICAgICAgICkpXG4gICAgICAvLyApO1xuICAgICAgdGhpcy52YWxpZGF0aW9uRXJyb3JDaGFuZ2VzLnN1YnNjcmliZSgoZXJyb3JzKSA9PiB7XG4gICAgICAgIGN0eC5vcHRpb25zLmVycm9yTWVzc2FnZSA9IGAke2Vycm9yc31gO1xuICAgICAgfSk7XG4gICAgICBjdHguZm9ybUNvbnRyb2wudmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgodmFsdWUpID0+IHtcbiAgICAgICAgaWYgKCEhdmFsdWUpIHtcbiAgICAgICAgICBjdHguY29udHJvbFZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdHguY29udHJvbE5hbWUgPSBjdHgubGF5b3V0Tm9kZS5uYW1lO1xuICAgICAgY3R4LmNvbnRyb2xWYWx1ZSA9IGN0eC5sYXlvdXROb2RlLnZhbHVlIHx8IG51bGw7XG4gICAgICBjb25zdCBkYXRhUG9pbnRlciA9IHRoaXMuZ2V0RGF0YVBvaW50ZXIoY3R4KTtcbiAgICAgIGlmIChiaW5kICYmIGRhdGFQb2ludGVyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgYHdhcm5pbmc6IGNvbnRyb2wgXCIke2RhdGFQb2ludGVyfVwiIGlzIG5vdCBib3VuZCB0byB0aGUgQW5ndWxhciBGb3JtR3JvdXAuYFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY3R4LmJvdW5kQ29udHJvbDtcbiAgfVxuXG4gIGZvcm1hdEVycm9ycyhlcnJvcnM6IGFueSwgdmFsaWRhdGlvbk1lc3NhZ2VzOiBhbnkgPSB7fSk6IHN0cmluZyB7XG4gICAgaWYgKGlzRW1wdHkoZXJyb3JzKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICghaXNPYmplY3QodmFsaWRhdGlvbk1lc3NhZ2VzKSkge1xuICAgICAgdmFsaWRhdGlvbk1lc3NhZ2VzID0ge307XG4gICAgfVxuICAgIGNvbnN0IGFkZFNwYWNlcyA9IChzdHJpbmcpID0+XG4gICAgICBzdHJpbmdbMF0udG9VcHBlckNhc2UoKSArXG4gICAgICAoc3RyaW5nLnNsaWNlKDEpIHx8IFwiXCIpXG4gICAgICAgIC5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCBcIiQxICQyXCIpXG4gICAgICAgIC5yZXBsYWNlKC9fL2csIFwiIFwiKTtcbiAgICBjb25zdCBmb3JtYXRFcnJvciA9IChlcnJvcikgPT5cbiAgICAgIHR5cGVvZiBlcnJvciA9PT0gXCJvYmplY3RcIlxuICAgICAgICA/IE9iamVjdC5rZXlzKGVycm9yKVxuICAgICAgICAgICAgLm1hcCgoa2V5KSA9PlxuICAgICAgICAgICAgICBlcnJvcltrZXldID09PSB0cnVlXG4gICAgICAgICAgICAgICAgPyBhZGRTcGFjZXMoa2V5KVxuICAgICAgICAgICAgICAgIDogZXJyb3Jba2V5XSA9PT0gZmFsc2VcbiAgICAgICAgICAgICAgICA/IFwiTm90IFwiICsgYWRkU3BhY2VzKGtleSlcbiAgICAgICAgICAgICAgICA6IGFkZFNwYWNlcyhrZXkpICsgXCI6IFwiICsgZm9ybWF0RXJyb3IoZXJyb3Jba2V5XSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5qb2luKFwiLCBcIilcbiAgICAgICAgOiBhZGRTcGFjZXMoZXJyb3IudG9TdHJpbmcoKSk7XG4gICAgY29uc3QgbWVzc2FnZXMgPSBbXTtcbiAgICByZXR1cm4gKFxuICAgICAgT2JqZWN0LmtleXMoZXJyb3JzKVxuICAgICAgICAvLyBIaWRlICdyZXF1aXJlZCcgZXJyb3IsIHVubGVzcyBpdCBpcyB0aGUgb25seSBvbmVcbiAgICAgICAgLmZpbHRlcihcbiAgICAgICAgICAoZXJyb3JLZXkpID0+XG4gICAgICAgICAgICBlcnJvcktleSAhPT0gXCJyZXF1aXJlZFwiIHx8IE9iamVjdC5rZXlzKGVycm9ycykubGVuZ3RoID09PSAxXG4gICAgICAgIClcbiAgICAgICAgLm1hcCgoZXJyb3JLZXkpID0+XG4gICAgICAgICAgLy8gSWYgdmFsaWRhdGlvbk1lc3NhZ2VzIGlzIGEgc3RyaW5nLCByZXR1cm4gaXRcbiAgICAgICAgICB0eXBlb2YgdmFsaWRhdGlvbk1lc3NhZ2VzID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICA/IHZhbGlkYXRpb25NZXNzYWdlc1xuICAgICAgICAgICAgOiAvLyBJZiBjdXN0b20gZXJyb3IgbWVzc2FnZSBpcyBhIGZ1bmN0aW9uLCByZXR1cm4gZnVuY3Rpb24gcmVzdWx0XG4gICAgICAgICAgICB0eXBlb2YgdmFsaWRhdGlvbk1lc3NhZ2VzW2Vycm9yS2V5XSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICA/IHZhbGlkYXRpb25NZXNzYWdlc1tlcnJvcktleV0oZXJyb3JzW2Vycm9yS2V5XSlcbiAgICAgICAgICAgIDogLy8gSWYgY3VzdG9tIGVycm9yIG1lc3NhZ2UgaXMgYSBzdHJpbmcsIHJlcGxhY2UgcGxhY2Vob2xkZXJzIGFuZCByZXR1cm5cbiAgICAgICAgICAgIHR5cGVvZiB2YWxpZGF0aW9uTWVzc2FnZXNbZXJyb3JLZXldID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICA/IC8vIERvZXMgZXJyb3IgbWVzc2FnZSBoYXZlIGFueSB7e3Byb3BlcnR5fX0gcGxhY2Vob2xkZXJzP1xuICAgICAgICAgICAgICAhL3t7Lis/fX0vLnRlc3QodmFsaWRhdGlvbk1lc3NhZ2VzW2Vycm9yS2V5XSlcbiAgICAgICAgICAgICAgPyB2YWxpZGF0aW9uTWVzc2FnZXNbZXJyb3JLZXldXG4gICAgICAgICAgICAgIDogLy8gUmVwbGFjZSB7e3Byb3BlcnR5fX0gcGxhY2Vob2xkZXJzIHdpdGggdmFsdWVzXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoZXJyb3JzW2Vycm9yS2V5XSkucmVkdWNlKFxuICAgICAgICAgICAgICAgICAgKGVycm9yTWVzc2FnZSwgZXJyb3JQcm9wZXJ0eSkgPT5cbiAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgICAgICAgbmV3IFJlZ0V4cChcInt7XCIgKyBlcnJvclByb3BlcnR5ICsgXCJ9fVwiLCBcImdcIiksXG4gICAgICAgICAgICAgICAgICAgICAgZXJyb3JzW2Vycm9yS2V5XVtlcnJvclByb3BlcnR5XVxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbk1lc3NhZ2VzW2Vycm9yS2V5XVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIDogLy8gSWYgbm8gY3VzdG9tIGVycm9yIG1lc3NhZ2UsIHJldHVybiBmb3JtYXR0ZWQgZXJyb3IgZGF0YSBpbnN0ZWFkXG4gICAgICAgICAgICAgIGFkZFNwYWNlcyhlcnJvcktleSkgKyBcIiBFcnJvcjogXCIgKyBmb3JtYXRFcnJvcihlcnJvcnNbZXJyb3JLZXldKVxuICAgICAgICApXG4gICAgICAgIC5qb2luKFwiPGJyPlwiKVxuICAgICk7XG4gIH1cblxuICB1cGRhdGVWYWx1ZShjdHg6IGFueSwgdmFsdWU6IGFueSk6IHZvaWQge1xuICAgIC8vIFNldCB2YWx1ZSBvZiBjdXJyZW50IGNvbnRyb2xcbiAgICBjdHguY29udHJvbFZhbHVlID0gdmFsdWU7XG4gICAgaWYgKGN0eC5ib3VuZENvbnRyb2wpIHtcbiAgICAgIGN0eC5mb3JtQ29udHJvbC5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgICBjdHguZm9ybUNvbnRyb2wubWFya0FzRGlydHkoKTtcbiAgICB9XG4gICAgY3R4LmxheW91dE5vZGUudmFsdWUgPSB2YWx1ZTtcblxuICAgIC8vIFNldCB2YWx1ZXMgb2YgYW55IHJlbGF0ZWQgY29udHJvbHMgaW4gY29weVZhbHVlVG8gYXJyYXlcbiAgICBpZiAoaXNBcnJheShjdHgub3B0aW9ucy5jb3B5VmFsdWVUbykpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBjdHgub3B0aW9ucy5jb3B5VmFsdWVUbykge1xuICAgICAgICBjb25zdCB0YXJnZXRDb250cm9sID0gZ2V0Q29udHJvbCh0aGlzLmZvcm1Hcm91cCwgaXRlbSk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBpc09iamVjdCh0YXJnZXRDb250cm9sKSAmJlxuICAgICAgICAgIHR5cGVvZiB0YXJnZXRDb250cm9sLnNldFZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGFyZ2V0Q29udHJvbC5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgICAgdGFyZ2V0Q29udHJvbC5tYXJrQXNEaXJ0eSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQXJyYXlDaGVja2JveExpc3QoY3R4OiBhbnksIGNoZWNrYm94TGlzdDogVGl0bGVNYXBJdGVtW10pOiB2b2lkIHtcbiAgICBjb25zdCBmb3JtQXJyYXkgPSA8Rm9ybUFycmF5PnRoaXMuZ2V0Rm9ybUNvbnRyb2woY3R4KTtcblxuICAgIC8vIFJlbW92ZSBhbGwgZXhpc3RpbmcgaXRlbXNcbiAgICB3aGlsZSAoZm9ybUFycmF5LnZhbHVlLmxlbmd0aCkge1xuICAgICAgZm9ybUFycmF5LnJlbW92ZUF0KDApO1xuICAgIH1cblxuICAgIC8vIFJlLWFkZCBhbiBpdGVtIGZvciBlYWNoIGNoZWNrZWQgYm94XG4gICAgY29uc3QgcmVmUG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoXG4gICAgICBjdHgubGF5b3V0Tm9kZS5kYXRhUG9pbnRlciArIFwiLy1cIixcbiAgICAgIHRoaXMuZGF0YVJlY3Vyc2l2ZVJlZk1hcCxcbiAgICAgIHRoaXMuYXJyYXlNYXBcbiAgICApO1xuICAgIGZvciAoY29uc3QgY2hlY2tib3hJdGVtIG9mIGNoZWNrYm94TGlzdCkge1xuICAgICAgaWYgKGNoZWNrYm94SXRlbS5jaGVja2VkKSB7XG4gICAgICAgIGNvbnN0IG5ld0Zvcm1Db250cm9sID0gYnVpbGRGb3JtR3JvdXAoXG4gICAgICAgICAgdGhpcy50ZW1wbGF0ZVJlZkxpYnJhcnlbcmVmUG9pbnRlcl1cbiAgICAgICAgKTtcbiAgICAgICAgbmV3Rm9ybUNvbnRyb2wuc2V0VmFsdWUoY2hlY2tib3hJdGVtLnZhbHVlKTtcbiAgICAgICAgZm9ybUFycmF5LnB1c2gobmV3Rm9ybUNvbnRyb2wpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3JtQXJyYXkubWFya0FzRGlydHkoKTtcbiAgfVxuXG4gIGdldEZvcm1Db250cm9sKGN0eDogYW55KTogQWJzdHJhY3RDb250cm9sIHtcbiAgICBpZiAoXG4gICAgICAhY3R4LmxheW91dE5vZGUgfHxcbiAgICAgICFpc0RlZmluZWQoY3R4LmxheW91dE5vZGUuZGF0YVBvaW50ZXIpIHx8XG4gICAgICBjdHgubGF5b3V0Tm9kZS50eXBlID09PSBcIiRyZWZcIlxuICAgICkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBnZXRDb250cm9sKHRoaXMuZm9ybUdyb3VwLCB0aGlzLmdldERhdGFQb2ludGVyKGN0eCkpO1xuICB9XG5cbiAgZ2V0Rm9ybUNvbnRyb2xWYWx1ZShjdHg6IGFueSk6IEFic3RyYWN0Q29udHJvbCB7XG4gICAgaWYgKFxuICAgICAgIWN0eC5sYXlvdXROb2RlIHx8XG4gICAgICAhaXNEZWZpbmVkKGN0eC5sYXlvdXROb2RlLmRhdGFQb2ludGVyKSB8fFxuICAgICAgY3R4LmxheW91dE5vZGUudHlwZSA9PT0gXCIkcmVmXCJcbiAgICApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBjb250cm9sID0gZ2V0Q29udHJvbCh0aGlzLmZvcm1Hcm91cCwgdGhpcy5nZXREYXRhUG9pbnRlcihjdHgpKTtcbiAgICByZXR1cm4gY29udHJvbCA/IGNvbnRyb2wudmFsdWUgOiBudWxsO1xuICB9XG5cbiAgZ2V0Rm9ybUNvbnRyb2xHcm91cChjdHg6IGFueSk6IEZvcm1BcnJheSB8IEZvcm1Hcm91cCB7XG4gICAgaWYgKCFjdHgubGF5b3V0Tm9kZSB8fCAhaXNEZWZpbmVkKGN0eC5sYXlvdXROb2RlLmRhdGFQb2ludGVyKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBnZXRDb250cm9sKHRoaXMuZm9ybUdyb3VwLCB0aGlzLmdldERhdGFQb2ludGVyKGN0eCksIHRydWUpO1xuICB9XG5cbiAgZ2V0Rm9ybUNvbnRyb2xOYW1lKGN0eDogYW55KTogc3RyaW5nIHtcbiAgICBpZiAoXG4gICAgICAhY3R4LmxheW91dE5vZGUgfHxcbiAgICAgICFpc0RlZmluZWQoY3R4LmxheW91dE5vZGUuZGF0YVBvaW50ZXIpIHx8XG4gICAgICAhaGFzVmFsdWUoY3R4LmRhdGFJbmRleClcbiAgICApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gSnNvblBvaW50ZXIudG9LZXkodGhpcy5nZXREYXRhUG9pbnRlcihjdHgpKTtcbiAgfVxuXG4gIGdldExheW91dEFycmF5KGN0eDogYW55KTogYW55W10ge1xuICAgIHJldHVybiBKc29uUG9pbnRlci5nZXQodGhpcy5sYXlvdXQsIHRoaXMuZ2V0TGF5b3V0UG9pbnRlcihjdHgpLCAwLCAtMSk7XG4gIH1cblxuICBnZXRQYXJlbnROb2RlKGN0eDogYW55KTogYW55IHtcbiAgICByZXR1cm4gSnNvblBvaW50ZXIuZ2V0KHRoaXMubGF5b3V0LCB0aGlzLmdldExheW91dFBvaW50ZXIoY3R4KSwgMCwgLTIpO1xuICB9XG5cbiAgZ2V0RGF0YVBvaW50ZXIoY3R4OiBhbnkpOiBzdHJpbmcge1xuICAgIGlmIChcbiAgICAgICFjdHgubGF5b3V0Tm9kZSB8fFxuICAgICAgIWlzRGVmaW5lZChjdHgubGF5b3V0Tm9kZS5kYXRhUG9pbnRlcikgfHxcbiAgICAgICFoYXNWYWx1ZShjdHguZGF0YUluZGV4KVxuICAgICkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBKc29uUG9pbnRlci50b0luZGV4ZWRQb2ludGVyKFxuICAgICAgY3R4LmxheW91dE5vZGUuZGF0YVBvaW50ZXIsXG4gICAgICBjdHguZGF0YUluZGV4LFxuICAgICAgdGhpcy5hcnJheU1hcFxuICAgICk7XG4gIH1cblxuICBnZXRMYXlvdXRQb2ludGVyKGN0eDogYW55KTogc3RyaW5nIHtcbiAgICBpZiAoIWhhc1ZhbHVlKGN0eC5sYXlvdXRJbmRleCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gXCIvXCIgKyBjdHgubGF5b3V0SW5kZXguam9pbihcIi9pdGVtcy9cIik7XG4gIH1cblxuICBpc0NvbnRyb2xCb3VuZChjdHg6IGFueSk6IGJvb2xlYW4ge1xuICAgIGlmIChcbiAgICAgICFjdHgubGF5b3V0Tm9kZSB8fFxuICAgICAgIWlzRGVmaW5lZChjdHgubGF5b3V0Tm9kZS5kYXRhUG9pbnRlcikgfHxcbiAgICAgICFoYXNWYWx1ZShjdHguZGF0YUluZGV4KVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBjb250cm9sR3JvdXAgPSB0aGlzLmdldEZvcm1Db250cm9sR3JvdXAoY3R4KTtcbiAgICBjb25zdCBuYW1lID0gdGhpcy5nZXRGb3JtQ29udHJvbE5hbWUoY3R4KTtcbiAgICByZXR1cm4gY29udHJvbEdyb3VwID8gaGFzT3duKGNvbnRyb2xHcm91cC5jb250cm9scywgbmFtZSkgOiBmYWxzZTtcbiAgfVxuXG4gIGFkZEl0ZW0oY3R4OiBhbnksIG5hbWU/OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBpZiAoXG4gICAgICAhY3R4LmxheW91dE5vZGUgfHxcbiAgICAgICFpc0RlZmluZWQoY3R4LmxheW91dE5vZGUuJHJlZikgfHxcbiAgICAgICFoYXNWYWx1ZShjdHguZGF0YUluZGV4KSB8fFxuICAgICAgIWhhc1ZhbHVlKGN0eC5sYXlvdXRJbmRleClcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgYSBuZXcgQW5ndWxhciBmb3JtIGNvbnRyb2wgZnJvbSBhIHRlbXBsYXRlIGluIHRlbXBsYXRlUmVmTGlicmFyeVxuICAgIGNvbnN0IG5ld0Zvcm1Hcm91cCA9IGJ1aWxkRm9ybUdyb3VwKFxuICAgICAgdGhpcy50ZW1wbGF0ZVJlZkxpYnJhcnlbY3R4LmxheW91dE5vZGUuJHJlZl1cbiAgICApO1xuXG4gICAgLy8gQWRkIHRoZSBuZXcgZm9ybSBjb250cm9sIHRvIHRoZSBwYXJlbnQgZm9ybUFycmF5IG9yIGZvcm1Hcm91cFxuICAgIGlmIChjdHgubGF5b3V0Tm9kZS5hcnJheUl0ZW0pIHtcbiAgICAgIC8vIEFkZCBuZXcgYXJyYXkgaXRlbSB0byBmb3JtQXJyYXlcbiAgICAgICg8Rm9ybUFycmF5PnRoaXMuZ2V0Rm9ybUNvbnRyb2xHcm91cChjdHgpKS5wdXNoKG5ld0Zvcm1Hcm91cCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEFkZCBuZXcgJHJlZiBpdGVtIHRvIGZvcm1Hcm91cFxuICAgICAgKDxGb3JtR3JvdXA+dGhpcy5nZXRGb3JtQ29udHJvbEdyb3VwKGN0eCkpLmFkZENvbnRyb2woXG4gICAgICAgIG5hbWUgfHwgdGhpcy5nZXRGb3JtQ29udHJvbE5hbWUoY3R4KSxcbiAgICAgICAgbmV3Rm9ybUdyb3VwXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIENvcHkgYSBuZXcgbGF5b3V0Tm9kZSBmcm9tIGxheW91dFJlZkxpYnJhcnlcbiAgICBjb25zdCBuZXdMYXlvdXROb2RlID0gZ2V0TGF5b3V0Tm9kZShjdHgubGF5b3V0Tm9kZSwgdGhpcyk7XG4gICAgbmV3TGF5b3V0Tm9kZS5hcnJheUl0ZW0gPSBjdHgubGF5b3V0Tm9kZS5hcnJheUl0ZW07XG4gICAgaWYgKGN0eC5sYXlvdXROb2RlLmFycmF5SXRlbVR5cGUpIHtcbiAgICAgIG5ld0xheW91dE5vZGUuYXJyYXlJdGVtVHlwZSA9IGN0eC5sYXlvdXROb2RlLmFycmF5SXRlbVR5cGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBuZXdMYXlvdXROb2RlLmFycmF5SXRlbVR5cGU7XG4gICAgfVxuICAgIGlmIChuYW1lKSB7XG4gICAgICBuZXdMYXlvdXROb2RlLm5hbWUgPSBuYW1lO1xuICAgICAgbmV3TGF5b3V0Tm9kZS5kYXRhUG9pbnRlciArPSBcIi9cIiArIEpzb25Qb2ludGVyLmVzY2FwZShuYW1lKTtcbiAgICAgIG5ld0xheW91dE5vZGUub3B0aW9ucy50aXRsZSA9IGZpeFRpdGxlKG5hbWUpO1xuICAgIH1cblxuICAgIC8vIEFkZCB0aGUgbmV3IGxheW91dE5vZGUgdG8gdGhlIGZvcm0gbGF5b3V0XG4gICAgSnNvblBvaW50ZXIuaW5zZXJ0KHRoaXMubGF5b3V0LCB0aGlzLmdldExheW91dFBvaW50ZXIoY3R4KSwgbmV3TGF5b3V0Tm9kZSk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIG1vdmVBcnJheUl0ZW0oY3R4OiBhbnksIG9sZEluZGV4OiBudW1iZXIsIG5ld0luZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICBpZiAoXG4gICAgICAhY3R4LmxheW91dE5vZGUgfHxcbiAgICAgICFpc0RlZmluZWQoY3R4LmxheW91dE5vZGUuZGF0YVBvaW50ZXIpIHx8XG4gICAgICAhaGFzVmFsdWUoY3R4LmRhdGFJbmRleCkgfHxcbiAgICAgICFoYXNWYWx1ZShjdHgubGF5b3V0SW5kZXgpIHx8XG4gICAgICAhaXNEZWZpbmVkKG9sZEluZGV4KSB8fFxuICAgICAgIWlzRGVmaW5lZChuZXdJbmRleCkgfHxcbiAgICAgIG9sZEluZGV4ID09PSBuZXdJbmRleFxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIE1vdmUgaXRlbSBpbiB0aGUgZm9ybUFycmF5XG4gICAgY29uc3QgZm9ybUFycmF5ID0gPEZvcm1BcnJheT50aGlzLmdldEZvcm1Db250cm9sR3JvdXAoY3R4KTtcbiAgICBjb25zdCBhcnJheUl0ZW0gPSBmb3JtQXJyYXkuYXQob2xkSW5kZXgpO1xuICAgIGZvcm1BcnJheS5yZW1vdmVBdChvbGRJbmRleCk7XG4gICAgZm9ybUFycmF5Lmluc2VydChuZXdJbmRleCwgYXJyYXlJdGVtKTtcbiAgICBmb3JtQXJyYXkudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpO1xuXG4gICAgLy8gTW92ZSBsYXlvdXQgaXRlbVxuICAgIGNvbnN0IGxheW91dEFycmF5ID0gdGhpcy5nZXRMYXlvdXRBcnJheShjdHgpO1xuICAgIGxheW91dEFycmF5LnNwbGljZShuZXdJbmRleCwgMCwgbGF5b3V0QXJyYXkuc3BsaWNlKG9sZEluZGV4LCAxKVswXSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZW1vdmVJdGVtKGN0eDogYW55KTogYm9vbGVhbiB7XG4gICAgaWYgKFxuICAgICAgIWN0eC5sYXlvdXROb2RlIHx8XG4gICAgICAhaXNEZWZpbmVkKGN0eC5sYXlvdXROb2RlLmRhdGFQb2ludGVyKSB8fFxuICAgICAgIWhhc1ZhbHVlKGN0eC5kYXRhSW5kZXgpIHx8XG4gICAgICAhaGFzVmFsdWUoY3R4LmxheW91dEluZGV4KVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSB0aGUgQW5ndWxhciBmb3JtIGNvbnRyb2wgZnJvbSB0aGUgcGFyZW50IGZvcm1BcnJheSBvciBmb3JtR3JvdXBcbiAgICBpZiAoY3R4LmxheW91dE5vZGUuYXJyYXlJdGVtKSB7XG4gICAgICAvLyBSZW1vdmUgYXJyYXkgaXRlbSBmcm9tIGZvcm1BcnJheVxuICAgICAgKDxGb3JtQXJyYXk+dGhpcy5nZXRGb3JtQ29udHJvbEdyb3VwKGN0eCkpLnJlbW92ZUF0KFxuICAgICAgICBjdHguZGF0YUluZGV4W2N0eC5kYXRhSW5kZXgubGVuZ3RoIC0gMV1cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlbW92ZSAkcmVmIGl0ZW0gZnJvbSBmb3JtR3JvdXBcbiAgICAgICg8Rm9ybUdyb3VwPnRoaXMuZ2V0Rm9ybUNvbnRyb2xHcm91cChjdHgpKS5yZW1vdmVDb250cm9sKFxuICAgICAgICB0aGlzLmdldEZvcm1Db250cm9sTmFtZShjdHgpXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSBsYXlvdXROb2RlIGZyb20gbGF5b3V0XG4gICAgSnNvblBvaW50ZXIucmVtb3ZlKHRoaXMubGF5b3V0LCB0aGlzLmdldExheW91dFBvaW50ZXIoY3R4KSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cbiJdfQ==