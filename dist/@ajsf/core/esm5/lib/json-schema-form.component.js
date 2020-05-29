/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, } from '@angular/core';
import { convertSchemaToDraft6 } from './shared/convert-schema-to-draft6.function';
import { forEach, hasOwn } from './shared/utility.functions';
import { FrameworkLibraryService } from './framework-library/framework-library.service';
import { hasValue, inArray, isArray, isEmpty, isObject } from './shared/validator.functions';
import { JsonPointer } from './shared/jsonpointer.functions';
import { JsonSchemaFormService } from './json-schema-form.service';
import { resolveSchemaReferences } from './shared/json-schema.functions';
import { WidgetLibraryService } from './widget-library/widget-library.service';
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
var JsonSchemaFormComponent = /** @class */ (function () {
    function JsonSchemaFormComponent(changeDetector, frameworkLibrary, widgetLibrary, jsf) {
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
    Object.defineProperty(JsonSchemaFormComponent.prototype, "value", {
        get: 
        // Show debug information?
        /**
         * @return {?}
         */
        function () {
            return this.objectWrap ? this.jsf.data['1'] : this.jsf.data;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.setFormValues(value, false);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     * @return {?}
     */
    JsonSchemaFormComponent.prototype.resetScriptsAndStyleSheets = /**
     * @private
     * @return {?}
     */
    function () {
        document.querySelectorAll('.ajsf').forEach((/**
         * @param {?} element
         * @return {?}
         */
        function (element) { return element.remove(); }));
    };
    /**
     * @private
     * @return {?}
     */
    JsonSchemaFormComponent.prototype.loadScripts = /**
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var scripts = this.frameworkLibrary.getFrameworkScripts();
        scripts.map((/**
         * @param {?} script
         * @return {?}
         */
        function (script) {
            /** @type {?} */
            var scriptTag = document.createElement('script');
            scriptTag.src = script;
            scriptTag.type = 'text/javascript';
            scriptTag.async = true;
            scriptTag.setAttribute('class', 'ajsf');
            document.getElementsByTagName('head')[0].appendChild(scriptTag);
        }));
    };
    /**
     * @private
     * @return {?}
     */
    JsonSchemaFormComponent.prototype.loadStyleSheets = /**
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var stylesheets = this.frameworkLibrary.getFrameworkStylesheets();
        stylesheets.map((/**
         * @param {?} stylesheet
         * @return {?}
         */
        function (stylesheet) {
            /** @type {?} */
            var linkTag = document.createElement('link');
            linkTag.rel = 'stylesheet';
            linkTag.href = stylesheet;
            linkTag.setAttribute('class', 'ajsf');
            document.getElementsByTagName('head')[0].appendChild(linkTag);
        }));
    };
    /**
     * @private
     * @return {?}
     */
    JsonSchemaFormComponent.prototype.loadAssets = /**
     * @private
     * @return {?}
     */
    function () {
        this.resetScriptsAndStyleSheets();
        this.loadScripts();
        this.loadStyleSheets();
    };
    /**
     * @return {?}
     */
    JsonSchemaFormComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.updateForm();
        this.loadAssets();
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    JsonSchemaFormComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        this.updateForm();
        // Check if there's changes in Framework then load assets if that's the
        if (changes.framework) {
            if (!changes.framework.isFirstChange() &&
                (changes.framework.previousValue !== changes.framework.currentValue)) {
                this.loadAssets();
            }
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    JsonSchemaFormComponent.prototype.writeValue = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this.setFormValues(value, false);
        if (!this.formValuesInput) {
            this.formValuesInput = 'ngModel';
        }
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    JsonSchemaFormComponent.prototype.registerOnChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.onChange = fn;
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    JsonSchemaFormComponent.prototype.registerOnTouched = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.onTouched = fn;
    };
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    JsonSchemaFormComponent.prototype.setDisabledState = /**
     * @param {?} isDisabled
     * @return {?}
     */
    function (isDisabled) {
        if (this.jsf.formOptions.formDisabled !== !!isDisabled) {
            this.jsf.formOptions.formDisabled = !!isDisabled;
            this.initializeForm();
        }
    };
    /**
     * @return {?}
     */
    JsonSchemaFormComponent.prototype.updateForm = /**
     * @return {?}
     */
    function () {
        var _this = this;
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
            var changedInput = Object.keys(this.previousInputs)
                .filter((/**
             * @param {?} input
             * @return {?}
             */
            function (input) { return _this.previousInputs[input] !== _this[input]; }));
            /** @type {?} */
            var resetFirst = true;
            if (changedInput.length === 1 && changedInput[0] === 'form' &&
                this.formValuesInput.startsWith('form.')) {
                // If only 'form' input changed, get names of changed keys
                changedInput = Object.keys(this.previousInputs.form || {})
                    .filter((/**
                 * @param {?} key
                 * @return {?}
                 */
                function (key) { return !isEqual(_this.previousInputs.form[key], _this.form[key]); }))
                    .map((/**
                 * @param {?} key
                 * @return {?}
                 */
                function (key) { return "form." + key; }));
                resetFirst = false;
            }
            // If only input values have changed, update the form values
            if (changedInput.length === 1 && changedInput[0] === this.formValuesInput) {
                if (this.formValuesInput.indexOf('.') === -1) {
                    this.setFormValues(this[this.formValuesInput], resetFirst);
                }
                else {
                    var _a = tslib_1.__read(this.formValuesInput.split('.'), 2), input = _a[0], key = _a[1];
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
            function (input) { return _this.previousInputs[input] !== _this[input]; }))
                .forEach((/**
             * @param {?} input
             * @return {?}
             */
            function (input) { return _this.previousInputs[input] = _this[input]; }));
        }
    };
    /**
     * @param {?} formValues
     * @param {?=} resetFirst
     * @return {?}
     */
    JsonSchemaFormComponent.prototype.setFormValues = /**
     * @param {?} formValues
     * @param {?=} resetFirst
     * @return {?}
     */
    function (formValues, resetFirst) {
        if (resetFirst === void 0) { resetFirst = true; }
        if (formValues) {
            /** @type {?} */
            var newFormValues = this.objectWrap ? formValues['1'] : formValues;
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
    };
    /**
     * @return {?}
     */
    JsonSchemaFormComponent.prototype.submitForm = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var validData = this.jsf.validData;
        this.onSubmit.emit(this.objectWrap ? validData['1'] : validData);
    };
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
     */
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
    JsonSchemaFormComponent.prototype.initializeForm = /**
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
    function () {
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
                var vars = [];
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
                function (v) { return JSON.stringify(v, null, 2); })).join('\n');
            }
            this.formInitialized = true;
        }
    };
    /**
     * 'initializeOptions' function
     *
     * Initialize 'options' (global form options) and set framework
     * Combine available inputs:
     * 1. options - recommended
     * 2. form.options - Single input style
     */
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
    JsonSchemaFormComponent.prototype.initializeOptions = /**
     * 'initializeOptions' function
     *
     * Initialize 'options' (global form options) and set framework
     * Combine available inputs:
     * 1. options - recommended
     * 2. form.options - Single input style
     * @private
     * @return {?}
     */
    function () {
        var e_1, _a;
        if (this.language && this.language !== this.jsf.language) {
            this.jsf.setLanguage(this.language);
        }
        this.jsf.setOptions({ debug: !!this.debug });
        /** @type {?} */
        var loadExternalAssets = this.loadExternalAssets || false;
        /** @type {?} */
        var framework = this.framework || 'default';
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
            try {
                for (var _b = tslib_1.__values(Object.keys(this.jsf.formOptions.widgets)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var widget = _c.value;
                    this.widgetLibrary.registerWidget(widget, this.jsf.formOptions.widgets[widget]);
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
        if (isObject(this.form) && isObject(this.form.tpldata)) {
            this.jsf.setTpldata(this.form.tpldata);
        }
    };
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
     */
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
    JsonSchemaFormComponent.prototype.initializeSchema = /**
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
    function () {
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
    };
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
     */
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
    JsonSchemaFormComponent.prototype.initializeData = /**
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
    function () {
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
    };
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
     */
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
    JsonSchemaFormComponent.prototype.initializeLayout = /**
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
    function () {
        var _this = this;
        // Rename JSON Form-style 'options' lists to
        // Angular Schema Form-style 'titleMap' lists.
        /** @type {?} */
        var fixJsonFormOptions = (/**
         * @param {?} layout
         * @return {?}
         */
        function (layout) {
            if (isObject(layout) || isArray(layout)) {
                forEach(layout, (/**
                 * @param {?} value
                 * @param {?} key
                 * @return {?}
                 */
                function (value, key) {
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
        var alternateLayout = null;
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
            function (value, pointer) {
                /** @type {?} */
                var schemaPointer = pointer
                    .replace(/\//g, '/properties/')
                    .replace(/\/properties\/items\/properties\//g, '/items/properties/')
                    .replace(/\/properties\/titleMap\/properties\//g, '/titleMap/properties/');
                if (hasValue(value) && hasValue(pointer)) {
                    /** @type {?} */
                    var key = JsonPointer.toKey(pointer);
                    /** @type {?} */
                    var groupPointer = (JsonPointer.parse(schemaPointer) || []).slice(0, -2);
                    /** @type {?} */
                    var itemPointer = void 0;
                    // If 'ui:order' object found, copy into object schema root
                    if (key.toLowerCase() === 'ui:order') {
                        itemPointer = tslib_1.__spread(groupPointer, ['ui:order']);
                        // Copy other alternate layout options to schema 'x-schema-form',
                        // (like Angular Schema Form options) and remove any 'ui:' prefixes
                    }
                    else {
                        if (key.slice(0, 3).toLowerCase() === 'ui:') {
                            key = key.slice(3);
                        }
                        itemPointer = tslib_1.__spread(groupPointer, ['x-schema-form', key]);
                    }
                    if (JsonPointer.has(_this.jsf.schema, groupPointer) &&
                        !JsonPointer.has(_this.jsf.schema, itemPointer)) {
                        JsonPointer.set(_this.jsf.schema, itemPointer, value);
                    }
                }
            }));
        }
    };
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
     */
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
    JsonSchemaFormComponent.prototype.activateForm = /**
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
    function () {
        var _this = this;
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
            function (data) {
                _this.onChanges.emit(_this.objectWrap ? data['1'] : data);
                if (_this.formValuesInput && _this.formValuesInput.indexOf('.') === -1) {
                    _this[_this.formValuesInput + "Change"].emit(_this.objectWrap ? data['1'] : data);
                }
            }));
            // Trigger change detection on statusChanges to show updated errors
            this.jsf.formGroup.statusChanges.subscribe((/**
             * @return {?}
             */
            function () { return _this.changeDetector.markForCheck(); }));
            this.jsf.isValidChanges.subscribe((/**
             * @param {?} isValid
             * @return {?}
             */
            function (isValid) { return _this.isValid.emit(isValid); }));
            this.jsf.validationErrorChanges.subscribe((/**
             * @param {?} err
             * @return {?}
             */
            function (err) { return _this.validationErrors.emit(err); }));
            // Output final schema, final layout, and initial data
            this.formSchema.emit(this.jsf.schema);
            this.formLayout.emit(this.jsf.layout);
            this.onChanges.emit(this.objectWrap ? this.jsf.data['1'] : this.jsf.data);
            // If validateOnRender, output initial validation and any errors
            /** @type {?} */
            var validateOnRender_1 = JsonPointer.get(this.jsf, '/formOptions/validateOnRender');
            if (validateOnRender_1) { // validateOnRender === 'auto' || true
                // validateOnRender === 'auto' || true
                /** @type {?} */
                var touchAll_1 = (/**
                 * @param {?} control
                 * @return {?}
                 */
                function (control) {
                    if (validateOnRender_1 === true || hasValue(control.value)) {
                        control.markAsTouched();
                    }
                    Object.keys(control.controls || {})
                        .forEach((/**
                     * @param {?} key
                     * @return {?}
                     */
                    function (key) { return touchAll_1(control.controls[key]); }));
                });
                touchAll_1(this.jsf.formGroup);
                this.isValid.emit(this.jsf.isValid);
                this.validationErrors.emit(this.jsf.ajvErrors);
            }
        }
    };
    JsonSchemaFormComponent.decorators = [
        { type: Component, args: [{
                    // tslint:disable-next-line:component-selector
                    selector: 'json-schema-form',
                    template: "<form [autocomplete]=\"jsf?.formOptions?.autocomplete ? 'on' : 'off'\" class=\"json-schema-form\" (ngSubmit)=\"submitForm()\">\n  <root-widget [layout]=\"jsf?.layout\"></root-widget>\n</form>\n<div *ngIf=\"debug || jsf?.formOptions?.debug\">\n  Debug output:\n  <pre>{{debugOutput}}</pre>\n</div>",
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    JsonSchemaFormComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: FrameworkLibraryService },
        { type: WidgetLibraryService },
        { type: JsonSchemaFormService }
    ]; };
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
    return JsonSchemaFormComponent;
}());
export { JsonSchemaFormComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1zY2hlbWEtZm9ybS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWpzZi9jb3JlLyIsInNvdXJjZXMiOlsibGliL2pzb24tc2NoZW1hLWZvcm0uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxTQUFTLE1BQU0sa0JBQWtCLENBQUM7QUFDekMsT0FBTyxPQUFPLE1BQU0sZ0JBQWdCLENBQUM7QUFFckMsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBR0wsTUFBTSxHQUVQLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ25GLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDN0QsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDeEYsT0FBTyxFQUNMLFFBQVEsRUFDUixPQUFPLEVBQ1AsT0FBTyxFQUNQLE9BQU8sRUFDUCxRQUFRLEVBQ1QsTUFBTSw4QkFBOEIsQ0FBQztBQUN0QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDN0QsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDbkUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDekUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0seUNBQXlDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUMvRTtJQThFRSxpQ0FDVSxjQUFpQyxFQUNqQyxnQkFBeUMsRUFDekMsYUFBbUMsRUFDcEMsR0FBMEI7UUFIekIsbUJBQWMsR0FBZCxjQUFjLENBQW1CO1FBQ2pDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBeUI7UUFDekMsa0JBQWEsR0FBYixh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QUNMLEtBQUs7d0JBRUwsS0FBSzs0QkFTTCxNQUFNOzJCQUNOLE1BQU07MEJBQ04sTUFBTTttQ0FDTixNQUFNOzZCQUNOLE1BQU07NkJBQ04sTUFBTTs2QkFNTixNQUFNOzhCQUNOLE1BQU07aUNBQ04sTUFBTTtnQ0FDTixNQUFNOztJQWttQlQsOEJBQUM7Q0FBQSxBQTNxQkQsSUEycUJDO1NBcnFCWSx1QkFBdUI7OztJQUNsQyw4Q0FBaUI7O0lBQ2pCLHdEQUFrQzs7SUFDbEMsa0RBQXdCOztJQUN4Qiw2Q0FBbUI7O0lBRW5CLGtEQUF3Qjs7SUFDeEIsaURBUUk7O0lBR0oseUNBQXFCOztJQUNyQix5Q0FBdUI7O0lBQ3ZCLHVDQUFtQjs7SUFDbkIsMENBQXNCOztJQUN0Qiw0Q0FBaUM7O0lBQ2pDLDBDQUFzQjs7SUFHdEIsdUNBQW1COztJQUduQix3Q0FBb0I7O0lBR3BCLDZDQUF5Qjs7SUFDekIsMkNBQXVCOztJQUN2QiwyQ0FBdUI7O0lBRXZCLDBDQUFzQjs7SUFFdEIsMkNBQTBCOztJQUcxQixxREFBcUM7O0lBQ3JDLHdDQUF3Qjs7SUFXeEIsNENBQThDOztJQUM5QywyQ0FBNkM7O0lBQzdDLDBDQUFnRDs7SUFDaEQsbURBQXFEOztJQUNyRCw2Q0FBK0M7O0lBQy9DLDZDQUErQzs7SUFNL0MsNkNBQStDOztJQUMvQyw4Q0FBZ0Q7O0lBQ2hELGlEQUFtRDs7SUFDbkQsZ0RBQWtEOztJQUVsRCwyQ0FBbUI7O0lBQ25CLDRDQUFvQjs7Ozs7SUFHbEIsaURBQXlDOzs7OztJQUN6QyxtREFBaUQ7Ozs7O0lBQ2pELGdEQUEyQzs7SUFDM0Msc0NBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsb25lRGVlcCBmcm9tICdsb2Rhc2gvY2xvbmVEZWVwJztcbmltcG9ydCBpc0VxdWFsIGZyb20gJ2xvZGFzaC9pc0VxdWFsJztcblxuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBjb252ZXJ0U2NoZW1hVG9EcmFmdDYgfSBmcm9tICcuL3NoYXJlZC9jb252ZXJ0LXNjaGVtYS10by1kcmFmdDYuZnVuY3Rpb24nO1xuaW1wb3J0IHsgZm9yRWFjaCwgaGFzT3duIH0gZnJvbSAnLi9zaGFyZWQvdXRpbGl0eS5mdW5jdGlvbnMnO1xuaW1wb3J0IHsgRnJhbWV3b3JrTGlicmFyeVNlcnZpY2UgfSBmcm9tICcuL2ZyYW1ld29yay1saWJyYXJ5L2ZyYW1ld29yay1saWJyYXJ5LnNlcnZpY2UnO1xuaW1wb3J0IHtcbiAgaGFzVmFsdWUsXG4gIGluQXJyYXksXG4gIGlzQXJyYXksXG4gIGlzRW1wdHksXG4gIGlzT2JqZWN0XG59IGZyb20gJy4vc2hhcmVkL3ZhbGlkYXRvci5mdW5jdGlvbnMnO1xuaW1wb3J0IHsgSnNvblBvaW50ZXIgfSBmcm9tICcuL3NoYXJlZC9qc29ucG9pbnRlci5mdW5jdGlvbnMnO1xuaW1wb3J0IHsgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIH0gZnJvbSAnLi9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UnO1xuaW1wb3J0IHsgcmVzb2x2ZVNjaGVtYVJlZmVyZW5jZXMgfSBmcm9tICcuL3NoYXJlZC9qc29uLXNjaGVtYS5mdW5jdGlvbnMnO1xuaW1wb3J0IHsgV2lkZ2V0TGlicmFyeVNlcnZpY2UgfSBmcm9tICcuL3dpZGdldC1saWJyYXJ5L3dpZGdldC1saWJyYXJ5LnNlcnZpY2UnO1xuXG5cbi8qKlxuICogQG1vZHVsZSAnSnNvblNjaGVtYUZvcm1Db21wb25lbnQnIC0gQW5ndWxhciBKU09OIFNjaGVtYSBGb3JtXG4gKlxuICogUm9vdCBtb2R1bGUgb2YgdGhlIEFuZ3VsYXIgSlNPTiBTY2hlbWEgRm9ybSBjbGllbnQtc2lkZSBsaWJyYXJ5LFxuICogYW4gQW5ndWxhciBsaWJyYXJ5IHdoaWNoIGdlbmVyYXRlcyBhbiBIVE1MIGZvcm0gZnJvbSBhIEpTT04gc2NoZW1hXG4gKiBzdHJ1Y3R1cmVkIGRhdGEgbW9kZWwgYW5kL29yIGEgSlNPTiBTY2hlbWEgRm9ybSBsYXlvdXQgZGVzY3JpcHRpb24uXG4gKlxuICogVGhpcyBsaWJyYXJ5IGFsc28gdmFsaWRhdGVzIGlucHV0IGRhdGEgYnkgdGhlIHVzZXIsIHVzaW5nIGJvdGggdmFsaWRhdG9ycyBvblxuICogaW5kaXZpZHVhbCBjb250cm9scyB0byBwcm92aWRlIHJlYWwtdGltZSBmZWVkYmFjayB3aGlsZSB0aGUgdXNlciBpcyBmaWxsaW5nXG4gKiBvdXQgdGhlIGZvcm0sIGFuZCB0aGVuIHZhbGlkYXRpbmcgdGhlIGVudGlyZSBpbnB1dCBhZ2FpbnN0IHRoZSBzY2hlbWEgd2hlblxuICogdGhlIGZvcm0gaXMgc3VibWl0dGVkIHRvIG1ha2Ugc3VyZSB0aGUgcmV0dXJuZWQgSlNPTiBkYXRhIG9iamVjdCBpcyB2YWxpZC5cbiAqXG4gKiBUaGlzIGxpYnJhcnkgaXMgc2ltaWxhciB0bywgYW5kIG1vc3RseSBBUEkgY29tcGF0aWJsZSB3aXRoOlxuICpcbiAqIC0gSlNPTiBTY2hlbWEgRm9ybSdzIEFuZ3VsYXIgU2NoZW1hIEZvcm0gbGlicmFyeSBmb3IgQW5ndWxhckpzXG4gKiAgIGh0dHA6Ly9zY2hlbWFmb3JtLmlvXG4gKiAgIGh0dHA6Ly9zY2hlbWFmb3JtLmlvL2V4YW1wbGVzL2Jvb3RzdHJhcC1leGFtcGxlLmh0bWwgKGV4YW1wbGVzKVxuICpcbiAqIC0gTW96aWxsYSdzIHJlYWN0LWpzb25zY2hlbWEtZm9ybSBsaWJyYXJ5IGZvciBSZWFjdFxuICogICBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS1zZXJ2aWNlcy9yZWFjdC1qc29uc2NoZW1hLWZvcm1cbiAqICAgaHR0cHM6Ly9tb3ppbGxhLXNlcnZpY2VzLmdpdGh1Yi5pby9yZWFjdC1qc29uc2NoZW1hLWZvcm0gKGV4YW1wbGVzKVxuICpcbiAqIC0gSm9zaGZpcmUncyBKU09OIEZvcm0gbGlicmFyeSBmb3IgalF1ZXJ5XG4gKiAgIGh0dHBzOi8vZ2l0aHViLmNvbS9qb3NoZmlyZS9qc29uZm9ybVxuICogICBodHRwOi8vdWxpb24uZ2l0aHViLmlvL2pzb25mb3JtL3BsYXlncm91bmQgKGV4YW1wbGVzKVxuICpcbiAqIFRoaXMgbGlicmFyeSBkZXBlbmRzIG9uOlxuICogIC0gQW5ndWxhciAob2J2aW91c2x5KSAgICAgICAgICAgICAgICAgIGh0dHBzOi8vYW5ndWxhci5pb1xuICogIC0gbG9kYXNoLCBKYXZhU2NyaXB0IHV0aWxpdHkgbGlicmFyeSAgIGh0dHBzOi8vZ2l0aHViLmNvbS9sb2Rhc2gvbG9kYXNoXG4gKiAgLSBhanYsIEFub3RoZXIgSlNPTiBTY2hlbWEgdmFsaWRhdG9yICAgaHR0cHM6Ly9naXRodWIuY29tL2Vwb2JlcmV6a2luL2FqdlxuICpcbiAqIEluIGFkZGl0aW9uLCB0aGUgRXhhbXBsZSBQbGF5Z3JvdW5kIGFsc28gZGVwZW5kcyBvbjpcbiAqICAtIGJyYWNlLCBCcm93c2VyaWZpZWQgQWNlIGVkaXRvciAgICAgICBodHRwOi8vdGhsb3JlbnouZ2l0aHViLmlvL2JyYWNlXG4gKi9cbkBDb21wb25lbnQoe1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y29tcG9uZW50LXNlbGVjdG9yXG4gIHNlbGVjdG9yOiAnanNvbi1zY2hlbWEtZm9ybScsXG4gIHRlbXBsYXRlVXJsOiAnLi9qc29uLXNjaGVtYS1mb3JtLmNvbXBvbmVudC5odG1sJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgSnNvblNjaGVtYUZvcm1Db21wb25lbnQgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25DaGFuZ2VzLCBPbkluaXQge1xuICBkZWJ1Z091dHB1dDogYW55OyAvLyBEZWJ1ZyBpbmZvcm1hdGlvbiwgaWYgcmVxdWVzdGVkXG4gIGZvcm1WYWx1ZVN1YnNjcmlwdGlvbjogYW55ID0gbnVsbDtcbiAgZm9ybUluaXRpYWxpemVkID0gZmFsc2U7XG4gIG9iamVjdFdyYXAgPSBmYWxzZTsgLy8gSXMgbm9uLW9iamVjdCBpbnB1dCBzY2hlbWEgd3JhcHBlZCBpbiBhbiBvYmplY3Q/XG5cbiAgZm9ybVZhbHVlc0lucHV0OiBzdHJpbmc7IC8vIE5hbWUgb2YgdGhlIGlucHV0IHByb3ZpZGluZyB0aGUgZm9ybSBkYXRhXG4gIHByZXZpb3VzSW5wdXRzOiB7IC8vIFByZXZpb3VzIGlucHV0IHZhbHVlcywgdG8gZGV0ZWN0IHdoaWNoIGlucHV0IHRyaWdnZXJzIG9uQ2hhbmdlc1xuICAgIHNjaGVtYTogYW55LCBsYXlvdXQ6IGFueVtdLCBkYXRhOiBhbnksIG9wdGlvbnM6IGFueSwgZnJhbWV3b3JrOiBhbnkgfCBzdHJpbmcsXG4gICAgd2lkZ2V0czogYW55LCBmb3JtOiBhbnksIG1vZGVsOiBhbnksIEpTT05TY2hlbWE6IGFueSwgVUlTY2hlbWE6IGFueSxcbiAgICBmb3JtRGF0YTogYW55LCBsb2FkRXh0ZXJuYWxBc3NldHM6IGJvb2xlYW4sIGRlYnVnOiBib29sZWFuLFxuICB9ID0ge1xuICAgICAgc2NoZW1hOiBudWxsLCBsYXlvdXQ6IG51bGwsIGRhdGE6IG51bGwsIG9wdGlvbnM6IG51bGwsIGZyYW1ld29yazogbnVsbCxcbiAgICAgIHdpZGdldHM6IG51bGwsIGZvcm06IG51bGwsIG1vZGVsOiBudWxsLCBKU09OU2NoZW1hOiBudWxsLCBVSVNjaGVtYTogbnVsbCxcbiAgICAgIGZvcm1EYXRhOiBudWxsLCBsb2FkRXh0ZXJuYWxBc3NldHM6IG51bGwsIGRlYnVnOiBudWxsLFxuICAgIH07XG5cbiAgLy8gUmVjb21tZW5kZWQgaW5wdXRzXG4gIEBJbnB1dCgpIHNjaGVtYTogYW55OyAvLyBUaGUgSlNPTiBTY2hlbWFcbiAgQElucHV0KCkgbGF5b3V0OiBhbnlbXTsgLy8gVGhlIGZvcm0gbGF5b3V0XG4gIEBJbnB1dCgpIGRhdGE6IGFueTsgLy8gVGhlIGZvcm0gZGF0YVxuICBASW5wdXQoKSBvcHRpb25zOiBhbnk7IC8vIFRoZSBnbG9iYWwgZm9ybSBvcHRpb25zXG4gIEBJbnB1dCgpIGZyYW1ld29yazogYW55IHwgc3RyaW5nOyAvLyBUaGUgZnJhbWV3b3JrIHRvIGxvYWRcbiAgQElucHV0KCkgd2lkZ2V0czogYW55OyAvLyBBbnkgY3VzdG9tIHdpZGdldHMgdG8gbG9hZFxuXG4gIC8vIEFsdGVybmF0ZSBjb21iaW5lZCBzaW5nbGUgaW5wdXRcbiAgQElucHV0KCkgZm9ybTogYW55OyAvLyBGb3IgdGVzdGluZywgYW5kIEpTT04gU2NoZW1hIEZvcm0gQVBJIGNvbXBhdGliaWxpdHlcblxuICAvLyBBbmd1bGFyIFNjaGVtYSBGb3JtIEFQSSBjb21wYXRpYmlsaXR5IGlucHV0XG4gIEBJbnB1dCgpIG1vZGVsOiBhbnk7IC8vIEFsdGVybmF0ZSBpbnB1dCBmb3IgZm9ybSBkYXRhXG5cbiAgLy8gUmVhY3QgSlNPTiBTY2hlbWEgRm9ybSBBUEkgY29tcGF0aWJpbGl0eSBpbnB1dHNcbiAgQElucHV0KCkgSlNPTlNjaGVtYTogYW55OyAvLyBBbHRlcm5hdGUgaW5wdXQgZm9yIEpTT04gU2NoZW1hXG4gIEBJbnB1dCgpIFVJU2NoZW1hOiBhbnk7IC8vIFVJIHNjaGVtYSAtIGFsdGVybmF0ZSBmb3JtIGxheW91dCBmb3JtYXRcbiAgQElucHV0KCkgZm9ybURhdGE6IGFueTsgLy8gQWx0ZXJuYXRlIGlucHV0IGZvciBmb3JtIGRhdGFcblxuICBASW5wdXQoKSBuZ01vZGVsOiBhbnk7IC8vIEFsdGVybmF0ZSBpbnB1dCBmb3IgQW5ndWxhciBmb3Jtc1xuXG4gIEBJbnB1dCgpIGxhbmd1YWdlOiBzdHJpbmc7IC8vIExhbmd1YWdlXG5cbiAgLy8gRGV2ZWxvcG1lbnQgaW5wdXRzLCBmb3IgdGVzdGluZyBhbmQgZGVidWdnaW5nXG4gIEBJbnB1dCgpIGxvYWRFeHRlcm5hbEFzc2V0czogYm9vbGVhbjsgLy8gTG9hZCBleHRlcm5hbCBmcmFtZXdvcmsgYXNzZXRzP1xuICBASW5wdXQoKSBkZWJ1ZzogYm9vbGVhbjsgLy8gU2hvdyBkZWJ1ZyBpbmZvcm1hdGlvbj9cblxuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5vYmplY3RXcmFwID8gdGhpcy5qc2YuZGF0YVsnMSddIDogdGhpcy5qc2YuZGF0YTtcbiAgfVxuICBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xuICAgIHRoaXMuc2V0Rm9ybVZhbHVlcyh2YWx1ZSwgZmFsc2UpO1xuICB9XG5cbiAgLy8gT3V0cHV0c1xuICBAT3V0cHV0KCkgb25DaGFuZ2VzID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7IC8vIExpdmUgdW52YWxpZGF0ZWQgaW50ZXJuYWwgZm9ybSBkYXRhXG4gIEBPdXRwdXQoKSBvblN1Ym1pdCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpOyAvLyBDb21wbGV0ZSB2YWxpZGF0ZWQgZm9ybSBkYXRhXG4gIEBPdXRwdXQoKSBpc1ZhbGlkID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpOyAvLyBJcyBjdXJyZW50IGRhdGEgdmFsaWQ/XG4gIEBPdXRwdXQoKSB2YWxpZGF0aW9uRXJyb3JzID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7IC8vIFZhbGlkYXRpb24gZXJyb3JzIChpZiBhbnkpXG4gIEBPdXRwdXQoKSBmb3JtU2NoZW1hID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7IC8vIEZpbmFsIHNjaGVtYSB1c2VkIHRvIGNyZWF0ZSBmb3JtXG4gIEBPdXRwdXQoKSBmb3JtTGF5b3V0ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7IC8vIEZpbmFsIGxheW91dCB1c2VkIHRvIGNyZWF0ZSBmb3JtXG5cbiAgLy8gT3V0cHV0cyBmb3IgcG9zc2libGUgMi13YXkgZGF0YSBiaW5kaW5nXG4gIC8vIE9ubHkgdGhlIG9uZSBpbnB1dCBwcm92aWRpbmcgdGhlIGluaXRpYWwgZm9ybSBkYXRhIHdpbGwgYmUgYm91bmQuXG4gIC8vIElmIHRoZXJlIGlzIG5vIGluaXRhbCBkYXRhLCBpbnB1dCAne30nIHRvIGFjdGl2YXRlIDItd2F5IGRhdGEgYmluZGluZy5cbiAgLy8gVGhlcmUgaXMgbm8gMi13YXkgYmluZGluZyBpZiBpbml0YWwgZGF0YSBpcyBjb21iaW5lZCBpbnNpZGUgdGhlICdmb3JtJyBpbnB1dC5cbiAgQE91dHB1dCgpIGRhdGFDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIG1vZGVsQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBmb3JtRGF0YUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgbmdNb2RlbENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIG9uQ2hhbmdlOiBGdW5jdGlvbjtcbiAgb25Ub3VjaGVkOiBGdW5jdGlvbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGNoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIGZyYW1ld29ya0xpYnJhcnk6IEZyYW1ld29ya0xpYnJhcnlTZXJ2aWNlLFxuICAgIHByaXZhdGUgd2lkZ2V0TGlicmFyeTogV2lkZ2V0TGlicmFyeVNlcnZpY2UsXG4gICAgcHVibGljIGpzZjogSnNvblNjaGVtYUZvcm1TZXJ2aWNlLFxuICApIHsgfVxuXG4gIHByaXZhdGUgcmVzZXRTY3JpcHRzQW5kU3R5bGVTaGVldHMoKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFqc2YnKS5mb3JFYWNoKGVsZW1lbnQgPT4gZWxlbWVudC5yZW1vdmUoKSk7XG4gIH1cbiAgcHJpdmF0ZSBsb2FkU2NyaXB0cygpIHtcbiAgICBjb25zdCBzY3JpcHRzID0gdGhpcy5mcmFtZXdvcmtMaWJyYXJ5LmdldEZyYW1ld29ya1NjcmlwdHMoKTtcbiAgICBzY3JpcHRzLm1hcChzY3JpcHQgPT4ge1xuICAgICAgY29uc3Qgc2NyaXB0VGFnOiBIVE1MU2NyaXB0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgc2NyaXB0VGFnLnNyYyA9IHNjcmlwdDtcbiAgICAgIHNjcmlwdFRhZy50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gICAgICBzY3JpcHRUYWcuYXN5bmMgPSB0cnVlO1xuICAgICAgc2NyaXB0VGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnYWpzZicpO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzY3JpcHRUYWcpO1xuICAgIH0pO1xuICB9XG4gIHByaXZhdGUgbG9hZFN0eWxlU2hlZXRzKCkge1xuICAgIGNvbnN0IHN0eWxlc2hlZXRzID0gdGhpcy5mcmFtZXdvcmtMaWJyYXJ5LmdldEZyYW1ld29ya1N0eWxlc2hlZXRzKCk7XG4gICAgc3R5bGVzaGVldHMubWFwKHN0eWxlc2hlZXQgPT4ge1xuICAgICAgY29uc3QgbGlua1RhZzogSFRNTExpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICAgICAgbGlua1RhZy5yZWwgPSAnc3R5bGVzaGVldCc7XG4gICAgICBsaW5rVGFnLmhyZWYgPSBzdHlsZXNoZWV0O1xuICAgICAgbGlua1RhZy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2Fqc2YnKTtcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQobGlua1RhZyk7XG4gICAgfSk7XG4gIH1cbiAgcHJpdmF0ZSBsb2FkQXNzZXRzKCkge1xuICAgIHRoaXMucmVzZXRTY3JpcHRzQW5kU3R5bGVTaGVldHMoKTtcbiAgICB0aGlzLmxvYWRTY3JpcHRzKCk7XG4gICAgdGhpcy5sb2FkU3R5bGVTaGVldHMoKTtcbiAgfVxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnVwZGF0ZUZvcm0oKTtcbiAgICB0aGlzLmxvYWRBc3NldHMoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICB0aGlzLnVwZGF0ZUZvcm0oKTtcbiAgICAvLyBDaGVjayBpZiB0aGVyZSdzIGNoYW5nZXMgaW4gRnJhbWV3b3JrIHRoZW4gbG9hZCBhc3NldHMgaWYgdGhhdCdzIHRoZVxuICAgIGlmIChjaGFuZ2VzLmZyYW1ld29yaykge1xuICAgICAgaWYgKCFjaGFuZ2VzLmZyYW1ld29yay5pc0ZpcnN0Q2hhbmdlKCkgJiZcbiAgICAgICAgKGNoYW5nZXMuZnJhbWV3b3JrLnByZXZpb3VzVmFsdWUgIT09IGNoYW5nZXMuZnJhbWV3b3JrLmN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgdGhpcy5sb2FkQXNzZXRzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5zZXRGb3JtVmFsdWVzKHZhbHVlLCBmYWxzZSk7XG4gICAgaWYgKCF0aGlzLmZvcm1WYWx1ZXNJbnB1dCkgeyB0aGlzLmZvcm1WYWx1ZXNJbnB1dCA9ICduZ01vZGVsJzsgfVxuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogRnVuY3Rpb24pIHtcbiAgICB0aGlzLm9uQ2hhbmdlID0gZm47XG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogRnVuY3Rpb24pIHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgaWYgKHRoaXMuanNmLmZvcm1PcHRpb25zLmZvcm1EaXNhYmxlZCAhPT0gISFpc0Rpc2FibGVkKSB7XG4gICAgICB0aGlzLmpzZi5mb3JtT3B0aW9ucy5mb3JtRGlzYWJsZWQgPSAhIWlzRGlzYWJsZWQ7XG4gICAgICB0aGlzLmluaXRpYWxpemVGb3JtKCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlRm9ybSgpIHtcbiAgICBpZiAoIXRoaXMuZm9ybUluaXRpYWxpemVkIHx8ICF0aGlzLmZvcm1WYWx1ZXNJbnB1dCB8fFxuICAgICAgKHRoaXMubGFuZ3VhZ2UgJiYgdGhpcy5sYW5ndWFnZSAhPT0gdGhpcy5qc2YubGFuZ3VhZ2UpXG4gICAgKSB7XG4gICAgICB0aGlzLmluaXRpYWxpemVGb3JtKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmxhbmd1YWdlICYmIHRoaXMubGFuZ3VhZ2UgIT09IHRoaXMuanNmLmxhbmd1YWdlKSB7XG4gICAgICAgIHRoaXMuanNmLnNldExhbmd1YWdlKHRoaXMubGFuZ3VhZ2UpO1xuICAgICAgfVxuXG4gICAgICAvLyBHZXQgbmFtZXMgb2YgY2hhbmdlZCBpbnB1dHNcbiAgICAgIGxldCBjaGFuZ2VkSW5wdXQgPSBPYmplY3Qua2V5cyh0aGlzLnByZXZpb3VzSW5wdXRzKVxuICAgICAgICAuZmlsdGVyKGlucHV0ID0+IHRoaXMucHJldmlvdXNJbnB1dHNbaW5wdXRdICE9PSB0aGlzW2lucHV0XSk7XG4gICAgICBsZXQgcmVzZXRGaXJzdCA9IHRydWU7XG4gICAgICBpZiAoY2hhbmdlZElucHV0Lmxlbmd0aCA9PT0gMSAmJiBjaGFuZ2VkSW5wdXRbMF0gPT09ICdmb3JtJyAmJlxuICAgICAgICB0aGlzLmZvcm1WYWx1ZXNJbnB1dC5zdGFydHNXaXRoKCdmb3JtLicpXG4gICAgICApIHtcbiAgICAgICAgLy8gSWYgb25seSAnZm9ybScgaW5wdXQgY2hhbmdlZCwgZ2V0IG5hbWVzIG9mIGNoYW5nZWQga2V5c1xuICAgICAgICBjaGFuZ2VkSW5wdXQgPSBPYmplY3Qua2V5cyh0aGlzLnByZXZpb3VzSW5wdXRzLmZvcm0gfHwge30pXG4gICAgICAgICAgLmZpbHRlcihrZXkgPT4gIWlzRXF1YWwodGhpcy5wcmV2aW91c0lucHV0cy5mb3JtW2tleV0sIHRoaXMuZm9ybVtrZXldKSlcbiAgICAgICAgICAubWFwKGtleSA9PiBgZm9ybS4ke2tleX1gKTtcbiAgICAgICAgcmVzZXRGaXJzdCA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBvbmx5IGlucHV0IHZhbHVlcyBoYXZlIGNoYW5nZWQsIHVwZGF0ZSB0aGUgZm9ybSB2YWx1ZXNcbiAgICAgIGlmIChjaGFuZ2VkSW5wdXQubGVuZ3RoID09PSAxICYmIGNoYW5nZWRJbnB1dFswXSA9PT0gdGhpcy5mb3JtVmFsdWVzSW5wdXQpIHtcbiAgICAgICAgaWYgKHRoaXMuZm9ybVZhbHVlc0lucHV0LmluZGV4T2YoJy4nKSA9PT0gLTEpIHtcbiAgICAgICAgICB0aGlzLnNldEZvcm1WYWx1ZXModGhpc1t0aGlzLmZvcm1WYWx1ZXNJbnB1dF0sIHJlc2V0Rmlyc3QpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IFtpbnB1dCwga2V5XSA9IHRoaXMuZm9ybVZhbHVlc0lucHV0LnNwbGl0KCcuJyk7XG4gICAgICAgICAgdGhpcy5zZXRGb3JtVmFsdWVzKHRoaXNbaW5wdXRdW2tleV0sIHJlc2V0Rmlyc3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgYW55dGhpbmcgZWxzZSBoYXMgY2hhbmdlZCwgcmUtcmVuZGVyIHRoZSBlbnRpcmUgZm9ybVxuICAgICAgfSBlbHNlIGlmIChjaGFuZ2VkSW5wdXQubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUZvcm0oKTtcbiAgICAgICAgaWYgKHRoaXMub25DaGFuZ2UpIHsgdGhpcy5vbkNoYW5nZSh0aGlzLmpzZi5mb3JtVmFsdWVzKTsgfVxuICAgICAgICBpZiAodGhpcy5vblRvdWNoZWQpIHsgdGhpcy5vblRvdWNoZWQodGhpcy5qc2YuZm9ybVZhbHVlcyk7IH1cbiAgICAgIH1cblxuICAgICAgLy8gVXBkYXRlIHByZXZpb3VzIGlucHV0c1xuICAgICAgT2JqZWN0LmtleXModGhpcy5wcmV2aW91c0lucHV0cylcbiAgICAgICAgLmZpbHRlcihpbnB1dCA9PiB0aGlzLnByZXZpb3VzSW5wdXRzW2lucHV0XSAhPT0gdGhpc1tpbnB1dF0pXG4gICAgICAgIC5mb3JFYWNoKGlucHV0ID0+IHRoaXMucHJldmlvdXNJbnB1dHNbaW5wdXRdID0gdGhpc1tpbnB1dF0pO1xuICAgIH1cbiAgfVxuXG4gIHNldEZvcm1WYWx1ZXMoZm9ybVZhbHVlczogYW55LCByZXNldEZpcnN0ID0gdHJ1ZSkge1xuICAgIGlmIChmb3JtVmFsdWVzKSB7XG4gICAgICBjb25zdCBuZXdGb3JtVmFsdWVzID0gdGhpcy5vYmplY3RXcmFwID8gZm9ybVZhbHVlc1snMSddIDogZm9ybVZhbHVlcztcbiAgICAgIGlmICghdGhpcy5qc2YuZm9ybUdyb3VwKSB7XG4gICAgICAgIHRoaXMuanNmLmZvcm1WYWx1ZXMgPSBmb3JtVmFsdWVzO1xuICAgICAgICB0aGlzLmFjdGl2YXRlRm9ybSgpO1xuICAgICAgfSBlbHNlIGlmIChyZXNldEZpcnN0KSB7XG4gICAgICAgIHRoaXMuanNmLmZvcm1Hcm91cC5yZXNldCgpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuanNmLmZvcm1Hcm91cCkge1xuICAgICAgICB0aGlzLmpzZi5mb3JtR3JvdXAucGF0Y2hWYWx1ZShuZXdGb3JtVmFsdWVzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9uQ2hhbmdlKSB7IHRoaXMub25DaGFuZ2UobmV3Rm9ybVZhbHVlcyk7IH1cbiAgICAgIGlmICh0aGlzLm9uVG91Y2hlZCkgeyB0aGlzLm9uVG91Y2hlZChuZXdGb3JtVmFsdWVzKTsgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmpzZi5mb3JtR3JvdXAucmVzZXQoKTtcbiAgICB9XG4gIH1cblxuICBzdWJtaXRGb3JtKCkge1xuICAgIGNvbnN0IHZhbGlkRGF0YSA9IHRoaXMuanNmLnZhbGlkRGF0YTtcbiAgICB0aGlzLm9uU3VibWl0LmVtaXQodGhpcy5vYmplY3RXcmFwID8gdmFsaWREYXRhWycxJ10gOiB2YWxpZERhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqICdpbml0aWFsaXplRm9ybScgZnVuY3Rpb25cbiAgICpcbiAgICogLSBVcGRhdGUgJ3NjaGVtYScsICdsYXlvdXQnLCBhbmQgJ2Zvcm1WYWx1ZXMnLCBmcm9tIGlucHV0cy5cbiAgICpcbiAgICogLSBDcmVhdGUgJ3NjaGVtYVJlZkxpYnJhcnknIGFuZCAnc2NoZW1hUmVjdXJzaXZlUmVmTWFwJ1xuICAgKiAgIHRvIHJlc29sdmUgc2NoZW1hICRyZWYgbGlua3MsIGluY2x1ZGluZyByZWN1cnNpdmUgJHJlZiBsaW5rcy5cbiAgICpcbiAgICogLSBDcmVhdGUgJ2RhdGFSZWN1cnNpdmVSZWZNYXAnIHRvIHJlc29sdmUgcmVjdXJzaXZlIGxpbmtzIGluIGRhdGFcbiAgICogICBhbmQgY29yZWN0bHkgc2V0IG91dHB1dCBmb3JtYXRzIGZvciByZWN1cnNpdmVseSBuZXN0ZWQgdmFsdWVzLlxuICAgKlxuICAgKiAtIENyZWF0ZSAnbGF5b3V0UmVmTGlicmFyeScgYW5kICd0ZW1wbGF0ZVJlZkxpYnJhcnknIHRvIHN0b3JlXG4gICAqICAgbmV3IGxheW91dCBub2RlcyBhbmQgZm9ybUdyb3VwIGVsZW1lbnRzIHRvIHVzZSB3aGVuIGR5bmFtaWNhbGx5XG4gICAqICAgYWRkaW5nIGZvcm0gY29tcG9uZW50cyB0byBhcnJheXMgYW5kIHJlY3Vyc2l2ZSAkcmVmIHBvaW50cy5cbiAgICpcbiAgICogLSBDcmVhdGUgJ2RhdGFNYXAnIHRvIG1hcCB0aGUgZGF0YSB0byB0aGUgc2NoZW1hIGFuZCB0ZW1wbGF0ZS5cbiAgICpcbiAgICogLSBDcmVhdGUgdGhlIG1hc3RlciAnZm9ybUdyb3VwVGVtcGxhdGUnIHRoZW4gZnJvbSBpdCAnZm9ybUdyb3VwJ1xuICAgKiAgIHRoZSBBbmd1bGFyIGZvcm1Hcm91cCB1c2VkIHRvIGNvbnRyb2wgdGhlIHJlYWN0aXZlIGZvcm0uXG4gICAqL1xuICBpbml0aWFsaXplRm9ybSgpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLnNjaGVtYSB8fCB0aGlzLmxheW91dCB8fCB0aGlzLmRhdGEgfHwgdGhpcy5mb3JtIHx8IHRoaXMubW9kZWwgfHxcbiAgICAgIHRoaXMuSlNPTlNjaGVtYSB8fCB0aGlzLlVJU2NoZW1hIHx8IHRoaXMuZm9ybURhdGEgfHwgdGhpcy5uZ01vZGVsIHx8XG4gICAgICB0aGlzLmpzZi5kYXRhXG4gICAgKSB7XG5cbiAgICAgIHRoaXMuanNmLnJlc2V0QWxsVmFsdWVzKCk7ICAvLyBSZXNldCBhbGwgZm9ybSB2YWx1ZXMgdG8gZGVmYXVsdHNcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZU9wdGlvbnMoKTsgICAvLyBVcGRhdGUgb3B0aW9uc1xuICAgICAgdGhpcy5pbml0aWFsaXplU2NoZW1hKCk7ICAgIC8vIFVwZGF0ZSBzY2hlbWEsIHNjaGVtYVJlZkxpYnJhcnksXG4gICAgICAvLyBzY2hlbWFSZWN1cnNpdmVSZWZNYXAsICYgZGF0YVJlY3Vyc2l2ZVJlZk1hcFxuICAgICAgdGhpcy5pbml0aWFsaXplTGF5b3V0KCk7ICAgIC8vIFVwZGF0ZSBsYXlvdXQsIGxheW91dFJlZkxpYnJhcnksXG4gICAgICB0aGlzLmluaXRpYWxpemVEYXRhKCk7ICAgICAgLy8gVXBkYXRlIGZvcm1WYWx1ZXNcbiAgICAgIHRoaXMuYWN0aXZhdGVGb3JtKCk7ICAgICAgICAvLyBVcGRhdGUgZGF0YU1hcCwgdGVtcGxhdGVSZWZMaWJyYXJ5LFxuICAgICAgLy8gZm9ybUdyb3VwVGVtcGxhdGUsIGZvcm1Hcm91cFxuXG4gICAgICAvLyBVbmNvbW1lbnQgaW5kaXZpZHVhbCBsaW5lcyB0byBvdXRwdXQgZGVidWdnaW5nIGluZm9ybWF0aW9uIHRvIGNvbnNvbGU6XG4gICAgICAvLyAoVGhlc2UgYWx3YXlzIHdvcmsuKVxuICAgICAgLy8gY29uc29sZS5sb2coJ2xvYWRpbmcgZm9ybS4uLicpO1xuICAgICAgLy8gY29uc29sZS5sb2coJ3NjaGVtYScsIHRoaXMuanNmLnNjaGVtYSk7XG4gICAgICAvLyBjb25zb2xlLmxvZygnbGF5b3V0JywgdGhpcy5qc2YubGF5b3V0KTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdvcHRpb25zJywgdGhpcy5vcHRpb25zKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdmb3JtVmFsdWVzJywgdGhpcy5qc2YuZm9ybVZhbHVlcyk7XG4gICAgICAvLyBjb25zb2xlLmxvZygnZm9ybUdyb3VwVGVtcGxhdGUnLCB0aGlzLmpzZi5mb3JtR3JvdXBUZW1wbGF0ZSk7XG4gICAgICAvLyBjb25zb2xlLmxvZygnZm9ybUdyb3VwJywgdGhpcy5qc2YuZm9ybUdyb3VwKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdmb3JtR3JvdXAudmFsdWUnLCB0aGlzLmpzZi5mb3JtR3JvdXAudmFsdWUpO1xuICAgICAgLy8gY29uc29sZS5sb2coJ3NjaGVtYVJlZkxpYnJhcnknLCB0aGlzLmpzZi5zY2hlbWFSZWZMaWJyYXJ5KTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdsYXlvdXRSZWZMaWJyYXJ5JywgdGhpcy5qc2YubGF5b3V0UmVmTGlicmFyeSk7XG4gICAgICAvLyBjb25zb2xlLmxvZygndGVtcGxhdGVSZWZMaWJyYXJ5JywgdGhpcy5qc2YudGVtcGxhdGVSZWZMaWJyYXJ5KTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdkYXRhTWFwJywgdGhpcy5qc2YuZGF0YU1hcCk7XG4gICAgICAvLyBjb25zb2xlLmxvZygnYXJyYXlNYXAnLCB0aGlzLmpzZi5hcnJheU1hcCk7XG4gICAgICAvLyBjb25zb2xlLmxvZygnc2NoZW1hUmVjdXJzaXZlUmVmTWFwJywgdGhpcy5qc2Yuc2NoZW1hUmVjdXJzaXZlUmVmTWFwKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdkYXRhUmVjdXJzaXZlUmVmTWFwJywgdGhpcy5qc2YuZGF0YVJlY3Vyc2l2ZVJlZk1hcCk7XG5cbiAgICAgIC8vIFVuY29tbWVudCBpbmRpdmlkdWFsIGxpbmVzIHRvIG91dHB1dCBkZWJ1Z2dpbmcgaW5mb3JtYXRpb24gdG8gYnJvd3NlcjpcbiAgICAgIC8vIChUaGVzZSBvbmx5IHdvcmsgaWYgdGhlICdkZWJ1Zycgb3B0aW9uIGhhcyBhbHNvIGJlZW4gc2V0IHRvICd0cnVlJy4pXG4gICAgICBpZiAodGhpcy5kZWJ1ZyB8fCB0aGlzLmpzZi5mb3JtT3B0aW9ucy5kZWJ1Zykge1xuICAgICAgICBjb25zdCB2YXJzOiBhbnlbXSA9IFtdO1xuICAgICAgICAvLyB2YXJzLnB1c2godGhpcy5qc2Yuc2NoZW1hKTtcbiAgICAgICAgLy8gdmFycy5wdXNoKHRoaXMuanNmLmxheW91dCk7XG4gICAgICAgIC8vIHZhcnMucHVzaCh0aGlzLm9wdGlvbnMpO1xuICAgICAgICAvLyB2YXJzLnB1c2godGhpcy5qc2YuZm9ybVZhbHVlcyk7XG4gICAgICAgIC8vIHZhcnMucHVzaCh0aGlzLmpzZi5mb3JtR3JvdXAudmFsdWUpO1xuICAgICAgICAvLyB2YXJzLnB1c2godGhpcy5qc2YuZm9ybUdyb3VwVGVtcGxhdGUpO1xuICAgICAgICAvLyB2YXJzLnB1c2godGhpcy5qc2YuZm9ybUdyb3VwKTtcbiAgICAgICAgLy8gdmFycy5wdXNoKHRoaXMuanNmLnNjaGVtYVJlZkxpYnJhcnkpO1xuICAgICAgICAvLyB2YXJzLnB1c2godGhpcy5qc2YubGF5b3V0UmVmTGlicmFyeSk7XG4gICAgICAgIC8vIHZhcnMucHVzaCh0aGlzLmpzZi50ZW1wbGF0ZVJlZkxpYnJhcnkpO1xuICAgICAgICAvLyB2YXJzLnB1c2godGhpcy5qc2YuZGF0YU1hcCk7XG4gICAgICAgIC8vIHZhcnMucHVzaCh0aGlzLmpzZi5hcnJheU1hcCk7XG4gICAgICAgIC8vIHZhcnMucHVzaCh0aGlzLmpzZi5zY2hlbWFSZWN1cnNpdmVSZWZNYXApO1xuICAgICAgICAvLyB2YXJzLnB1c2godGhpcy5qc2YuZGF0YVJlY3Vyc2l2ZVJlZk1hcCk7XG4gICAgICAgIHRoaXMuZGVidWdPdXRwdXQgPSB2YXJzLm1hcCh2ID0+IEpTT04uc3RyaW5naWZ5KHYsIG51bGwsIDIpKS5qb2luKCdcXG4nKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZm9ybUluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogJ2luaXRpYWxpemVPcHRpb25zJyBmdW5jdGlvblxuICAgKlxuICAgKiBJbml0aWFsaXplICdvcHRpb25zJyAoZ2xvYmFsIGZvcm0gb3B0aW9ucykgYW5kIHNldCBmcmFtZXdvcmtcbiAgICogQ29tYmluZSBhdmFpbGFibGUgaW5wdXRzOlxuICAgKiAxLiBvcHRpb25zIC0gcmVjb21tZW5kZWRcbiAgICogMi4gZm9ybS5vcHRpb25zIC0gU2luZ2xlIGlucHV0IHN0eWxlXG4gICAqL1xuICBwcml2YXRlIGluaXRpYWxpemVPcHRpb25zKCkge1xuICAgIGlmICh0aGlzLmxhbmd1YWdlICYmIHRoaXMubGFuZ3VhZ2UgIT09IHRoaXMuanNmLmxhbmd1YWdlKSB7XG4gICAgICB0aGlzLmpzZi5zZXRMYW5ndWFnZSh0aGlzLmxhbmd1YWdlKTtcbiAgICB9XG4gICAgdGhpcy5qc2Yuc2V0T3B0aW9ucyh7IGRlYnVnOiAhIXRoaXMuZGVidWcgfSk7XG4gICAgbGV0IGxvYWRFeHRlcm5hbEFzc2V0czogYm9vbGVhbiA9IHRoaXMubG9hZEV4dGVybmFsQXNzZXRzIHx8IGZhbHNlO1xuICAgIGxldCBmcmFtZXdvcms6IGFueSA9IHRoaXMuZnJhbWV3b3JrIHx8ICdkZWZhdWx0JztcbiAgICBpZiAoaXNPYmplY3QodGhpcy5vcHRpb25zKSkge1xuICAgICAgdGhpcy5qc2Yuc2V0T3B0aW9ucyh0aGlzLm9wdGlvbnMpO1xuICAgICAgbG9hZEV4dGVybmFsQXNzZXRzID0gdGhpcy5vcHRpb25zLmxvYWRFeHRlcm5hbEFzc2V0cyB8fCBsb2FkRXh0ZXJuYWxBc3NldHM7XG4gICAgICBmcmFtZXdvcmsgPSB0aGlzLm9wdGlvbnMuZnJhbWV3b3JrIHx8IGZyYW1ld29yaztcbiAgICB9XG4gICAgaWYgKGlzT2JqZWN0KHRoaXMuZm9ybSkgJiYgaXNPYmplY3QodGhpcy5mb3JtLm9wdGlvbnMpKSB7XG4gICAgICB0aGlzLmpzZi5zZXRPcHRpb25zKHRoaXMuZm9ybS5vcHRpb25zKTtcbiAgICAgIGxvYWRFeHRlcm5hbEFzc2V0cyA9IHRoaXMuZm9ybS5vcHRpb25zLmxvYWRFeHRlcm5hbEFzc2V0cyB8fCBsb2FkRXh0ZXJuYWxBc3NldHM7XG4gICAgICBmcmFtZXdvcmsgPSB0aGlzLmZvcm0ub3B0aW9ucy5mcmFtZXdvcmsgfHwgZnJhbWV3b3JrO1xuICAgIH1cbiAgICBpZiAoaXNPYmplY3QodGhpcy53aWRnZXRzKSkge1xuICAgICAgdGhpcy5qc2Yuc2V0T3B0aW9ucyh7IHdpZGdldHM6IHRoaXMud2lkZ2V0cyB9KTtcbiAgICB9XG4gICAgdGhpcy5mcmFtZXdvcmtMaWJyYXJ5LnNldExvYWRFeHRlcm5hbEFzc2V0cyhsb2FkRXh0ZXJuYWxBc3NldHMpO1xuICAgIHRoaXMuZnJhbWV3b3JrTGlicmFyeS5zZXRGcmFtZXdvcmsoZnJhbWV3b3JrKTtcbiAgICB0aGlzLmpzZi5mcmFtZXdvcmsgPSB0aGlzLmZyYW1ld29ya0xpYnJhcnkuZ2V0RnJhbWV3b3JrKCk7XG4gICAgaWYgKGlzT2JqZWN0KHRoaXMuanNmLmZvcm1PcHRpb25zLndpZGdldHMpKSB7XG4gICAgICBmb3IgKGNvbnN0IHdpZGdldCBvZiBPYmplY3Qua2V5cyh0aGlzLmpzZi5mb3JtT3B0aW9ucy53aWRnZXRzKSkge1xuICAgICAgICB0aGlzLndpZGdldExpYnJhcnkucmVnaXN0ZXJXaWRnZXQod2lkZ2V0LCB0aGlzLmpzZi5mb3JtT3B0aW9ucy53aWRnZXRzW3dpZGdldF0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNPYmplY3QodGhpcy5mb3JtKSAmJiBpc09iamVjdCh0aGlzLmZvcm0udHBsZGF0YSkpIHtcbiAgICAgIHRoaXMuanNmLnNldFRwbGRhdGEodGhpcy5mb3JtLnRwbGRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAnaW5pdGlhbGl6ZVNjaGVtYScgZnVuY3Rpb25cbiAgICpcbiAgICogSW5pdGlhbGl6ZSAnc2NoZW1hJ1xuICAgKiBVc2UgZmlyc3QgYXZhaWxhYmxlIGlucHV0OlxuICAgKiAxLiBzY2hlbWEgLSByZWNvbW1lbmRlZCAvIEFuZ3VsYXIgU2NoZW1hIEZvcm0gc3R5bGVcbiAgICogMi4gZm9ybS5zY2hlbWEgLSBTaW5nbGUgaW5wdXQgLyBKU09OIEZvcm0gc3R5bGVcbiAgICogMy4gSlNPTlNjaGVtYSAtIFJlYWN0IEpTT04gU2NoZW1hIEZvcm0gc3R5bGVcbiAgICogNC4gZm9ybS5KU09OU2NoZW1hIC0gRm9yIHRlc3Rpbmcgc2luZ2xlIGlucHV0IFJlYWN0IEpTT04gU2NoZW1hIEZvcm1zXG4gICAqIDUuIGZvcm0gLSBGb3IgdGVzdGluZyBzaW5nbGUgc2NoZW1hLW9ubHkgaW5wdXRzXG4gICAqXG4gICAqIC4uLiBpZiBubyBzY2hlbWEgaW5wdXQgZm91bmQsIHRoZSAnYWN0aXZhdGVGb3JtJyBmdW5jdGlvbiwgYmVsb3csXG4gICAqICAgICB3aWxsIG1ha2UgdHdvIGFkZGl0aW9uYWwgYXR0ZW1wdHMgdG8gYnVpbGQgYSBzY2hlbWFcbiAgICogNi4gSWYgbGF5b3V0IGlucHV0IC0gYnVpbGQgc2NoZW1hIGZyb20gbGF5b3V0XG4gICAqIDcuIElmIGRhdGEgaW5wdXQgLSBidWlsZCBzY2hlbWEgZnJvbSBkYXRhXG4gICAqL1xuICBwcml2YXRlIGluaXRpYWxpemVTY2hlbWEoKSB7XG5cbiAgICAvLyBUT0RPOiB1cGRhdGUgdG8gYWxsb3cgbm9uLW9iamVjdCBzY2hlbWFzXG5cbiAgICBpZiAoaXNPYmplY3QodGhpcy5zY2hlbWEpKSB7XG4gICAgICB0aGlzLmpzZi5Bbmd1bGFyU2NoZW1hRm9ybUNvbXBhdGliaWxpdHkgPSB0cnVlO1xuICAgICAgdGhpcy5qc2Yuc2NoZW1hID0gY2xvbmVEZWVwKHRoaXMuc2NoZW1hKTtcbiAgICB9IGVsc2UgaWYgKGhhc093bih0aGlzLmZvcm0sICdzY2hlbWEnKSAmJiBpc09iamVjdCh0aGlzLmZvcm0uc2NoZW1hKSkge1xuICAgICAgdGhpcy5qc2Yuc2NoZW1hID0gY2xvbmVEZWVwKHRoaXMuZm9ybS5zY2hlbWEpO1xuICAgIH0gZWxzZSBpZiAoaXNPYmplY3QodGhpcy5KU09OU2NoZW1hKSkge1xuICAgICAgdGhpcy5qc2YuUmVhY3RKc29uU2NoZW1hRm9ybUNvbXBhdGliaWxpdHkgPSB0cnVlO1xuICAgICAgdGhpcy5qc2Yuc2NoZW1hID0gY2xvbmVEZWVwKHRoaXMuSlNPTlNjaGVtYSk7XG4gICAgfSBlbHNlIGlmIChoYXNPd24odGhpcy5mb3JtLCAnSlNPTlNjaGVtYScpICYmIGlzT2JqZWN0KHRoaXMuZm9ybS5KU09OU2NoZW1hKSkge1xuICAgICAgdGhpcy5qc2YuUmVhY3RKc29uU2NoZW1hRm9ybUNvbXBhdGliaWxpdHkgPSB0cnVlO1xuICAgICAgdGhpcy5qc2Yuc2NoZW1hID0gY2xvbmVEZWVwKHRoaXMuZm9ybS5KU09OU2NoZW1hKTtcbiAgICB9IGVsc2UgaWYgKGhhc093bih0aGlzLmZvcm0sICdwcm9wZXJ0aWVzJykgJiYgaXNPYmplY3QodGhpcy5mb3JtLnByb3BlcnRpZXMpKSB7XG4gICAgICB0aGlzLmpzZi5zY2hlbWEgPSBjbG9uZURlZXAodGhpcy5mb3JtKTtcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuZm9ybSkpIHtcbiAgICAgIC8vIFRPRE86IEhhbmRsZSBvdGhlciB0eXBlcyBvZiBmb3JtIGlucHV0XG4gICAgfVxuXG4gICAgaWYgKCFpc0VtcHR5KHRoaXMuanNmLnNjaGVtYSkpIHtcblxuICAgICAgLy8gSWYgb3RoZXIgdHlwZXMgYWxzbyBhbGxvd2VkLCByZW5kZXIgc2NoZW1hIGFzIGFuIG9iamVjdFxuICAgICAgaWYgKGluQXJyYXkoJ29iamVjdCcsIHRoaXMuanNmLnNjaGVtYS50eXBlKSkge1xuICAgICAgICB0aGlzLmpzZi5zY2hlbWEudHlwZSA9ICdvYmplY3QnO1xuICAgICAgfVxuXG4gICAgICAvLyBXcmFwIG5vbi1vYmplY3Qgc2NoZW1hcyBpbiBvYmplY3QuXG4gICAgICBpZiAoaGFzT3duKHRoaXMuanNmLnNjaGVtYSwgJ3R5cGUnKSAmJiB0aGlzLmpzZi5zY2hlbWEudHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhpcy5qc2Yuc2NoZW1hID0ge1xuICAgICAgICAgICd0eXBlJzogJ29iamVjdCcsXG4gICAgICAgICAgJ3Byb3BlcnRpZXMnOiB7IDE6IHRoaXMuanNmLnNjaGVtYSB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMub2JqZWN0V3JhcCA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKCFoYXNPd24odGhpcy5qc2Yuc2NoZW1hLCAndHlwZScpKSB7XG5cbiAgICAgICAgLy8gQWRkIHR5cGUgPSAnb2JqZWN0JyBpZiBtaXNzaW5nXG4gICAgICAgIGlmIChpc09iamVjdCh0aGlzLmpzZi5zY2hlbWEucHJvcGVydGllcykgfHxcbiAgICAgICAgICBpc09iamVjdCh0aGlzLmpzZi5zY2hlbWEucGF0dGVyblByb3BlcnRpZXMpIHx8XG4gICAgICAgICAgaXNPYmplY3QodGhpcy5qc2Yuc2NoZW1hLmFkZGl0aW9uYWxQcm9wZXJ0aWVzKVxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzLmpzZi5zY2hlbWEudHlwZSA9ICdvYmplY3QnO1xuXG4gICAgICAgICAgLy8gRml4IEpTT04gc2NoZW1hIHNob3J0aGFuZCAoSlNPTiBGb3JtIHN0eWxlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuanNmLkpzb25Gb3JtQ29tcGF0aWJpbGl0eSA9IHRydWU7XG4gICAgICAgICAgdGhpcy5qc2Yuc2NoZW1hID0ge1xuICAgICAgICAgICAgJ3R5cGUnOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICdwcm9wZXJ0aWVzJzogdGhpcy5qc2Yuc2NoZW1hXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJZiBuZWVkZWQsIHVwZGF0ZSBKU09OIFNjaGVtYSB0byBkcmFmdCA2IGZvcm1hdCwgaW5jbHVkaW5nXG4gICAgICAvLyBkcmFmdCAzIChKU09OIEZvcm0gc3R5bGUpIGFuZCBkcmFmdCA0IChBbmd1bGFyIFNjaGVtYSBGb3JtIHN0eWxlKVxuICAgICAgdGhpcy5qc2Yuc2NoZW1hID0gY29udmVydFNjaGVtYVRvRHJhZnQ2KHRoaXMuanNmLnNjaGVtYSk7XG5cbiAgICAgIC8vIEluaXRpYWxpemUgYWp2IGFuZCBjb21waWxlIHNjaGVtYVxuICAgICAgdGhpcy5qc2YuY29tcGlsZUFqdlNjaGVtYSgpO1xuXG4gICAgICAvLyBDcmVhdGUgc2NoZW1hUmVmTGlicmFyeSwgc2NoZW1hUmVjdXJzaXZlUmVmTWFwLCBkYXRhUmVjdXJzaXZlUmVmTWFwLCAmIGFycmF5TWFwXG4gICAgICB0aGlzLmpzZi5zY2hlbWEgPSByZXNvbHZlU2NoZW1hUmVmZXJlbmNlcyhcbiAgICAgICAgdGhpcy5qc2Yuc2NoZW1hLCB0aGlzLmpzZi5zY2hlbWFSZWZMaWJyYXJ5LCB0aGlzLmpzZi5zY2hlbWFSZWN1cnNpdmVSZWZNYXAsXG4gICAgICAgIHRoaXMuanNmLmRhdGFSZWN1cnNpdmVSZWZNYXAsIHRoaXMuanNmLmFycmF5TWFwXG4gICAgICApO1xuICAgICAgaWYgKGhhc093bih0aGlzLmpzZi5zY2hlbWFSZWZMaWJyYXJ5LCAnJykpIHtcbiAgICAgICAgdGhpcy5qc2YuaGFzUm9vdFJlZmVyZW5jZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIFRPRE86ICg/KSBSZXNvbHZlIGV4dGVybmFsICRyZWYgbGlua3NcbiAgICAgIC8vIC8vIENyZWF0ZSBzY2hlbWFSZWZMaWJyYXJ5ICYgc2NoZW1hUmVjdXJzaXZlUmVmTWFwXG4gICAgICAvLyB0aGlzLnBhcnNlci5idW5kbGUodGhpcy5zY2hlbWEpXG4gICAgICAvLyAgIC50aGVuKHNjaGVtYSA9PiB0aGlzLnNjaGVtYSA9IHJlc29sdmVTY2hlbWFSZWZlcmVuY2VzKFxuICAgICAgLy8gICAgIHNjaGVtYSwgdGhpcy5qc2Yuc2NoZW1hUmVmTGlicmFyeSxcbiAgICAgIC8vICAgICB0aGlzLmpzZi5zY2hlbWFSZWN1cnNpdmVSZWZNYXAsIHRoaXMuanNmLmRhdGFSZWN1cnNpdmVSZWZNYXBcbiAgICAgIC8vICAgKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICdpbml0aWFsaXplRGF0YScgZnVuY3Rpb25cbiAgICpcbiAgICogSW5pdGlhbGl6ZSAnZm9ybVZhbHVlcydcbiAgICogZGVmdWxhdCBvciBwcmV2aW91c2x5IHN1Ym1pdHRlZCB2YWx1ZXMgdXNlZCB0byBwb3B1bGF0ZSBmb3JtXG4gICAqIFVzZSBmaXJzdCBhdmFpbGFibGUgaW5wdXQ6XG4gICAqIDEuIGRhdGEgLSByZWNvbW1lbmRlZFxuICAgKiAyLiBtb2RlbCAtIEFuZ3VsYXIgU2NoZW1hIEZvcm0gc3R5bGVcbiAgICogMy4gZm9ybS52YWx1ZSAtIEpTT04gRm9ybSBzdHlsZVxuICAgKiA0LiBmb3JtLmRhdGEgLSBTaW5nbGUgaW5wdXQgc3R5bGVcbiAgICogNS4gZm9ybURhdGEgLSBSZWFjdCBKU09OIFNjaGVtYSBGb3JtIHN0eWxlXG4gICAqIDYuIGZvcm0uZm9ybURhdGEgLSBGb3IgZWFzaWVyIHRlc3Rpbmcgb2YgUmVhY3QgSlNPTiBTY2hlbWEgRm9ybXNcbiAgICogNy4gKG5vbmUpIG5vIGRhdGEgLSBpbml0aWFsaXplIGRhdGEgZnJvbSBzY2hlbWEgYW5kIGxheW91dCBkZWZhdWx0cyBvbmx5XG4gICAqL1xuICBwcml2YXRlIGluaXRpYWxpemVEYXRhKCkge1xuICAgIGlmIChoYXNWYWx1ZSh0aGlzLmRhdGEpKSB7XG4gICAgICB0aGlzLmpzZi5mb3JtVmFsdWVzID0gY2xvbmVEZWVwKHRoaXMuZGF0YSk7XG4gICAgICB0aGlzLmZvcm1WYWx1ZXNJbnB1dCA9ICdkYXRhJztcbiAgICB9IGVsc2UgaWYgKGhhc1ZhbHVlKHRoaXMubW9kZWwpKSB7XG4gICAgICB0aGlzLmpzZi5Bbmd1bGFyU2NoZW1hRm9ybUNvbXBhdGliaWxpdHkgPSB0cnVlO1xuICAgICAgdGhpcy5qc2YuZm9ybVZhbHVlcyA9IGNsb25lRGVlcCh0aGlzLm1vZGVsKTtcbiAgICAgIHRoaXMuZm9ybVZhbHVlc0lucHV0ID0gJ21vZGVsJztcbiAgICB9IGVsc2UgaWYgKGhhc1ZhbHVlKHRoaXMubmdNb2RlbCkpIHtcbiAgICAgIHRoaXMuanNmLkFuZ3VsYXJTY2hlbWFGb3JtQ29tcGF0aWJpbGl0eSA9IHRydWU7XG4gICAgICB0aGlzLmpzZi5mb3JtVmFsdWVzID0gY2xvbmVEZWVwKHRoaXMubmdNb2RlbCk7XG4gICAgICB0aGlzLmZvcm1WYWx1ZXNJbnB1dCA9ICduZ01vZGVsJztcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuZm9ybSkgJiYgaGFzVmFsdWUodGhpcy5mb3JtLnZhbHVlKSkge1xuICAgICAgdGhpcy5qc2YuSnNvbkZvcm1Db21wYXRpYmlsaXR5ID0gdHJ1ZTtcbiAgICAgIHRoaXMuanNmLmZvcm1WYWx1ZXMgPSBjbG9uZURlZXAodGhpcy5mb3JtLnZhbHVlKTtcbiAgICAgIHRoaXMuZm9ybVZhbHVlc0lucHV0ID0gJ2Zvcm0udmFsdWUnO1xuICAgIH0gZWxzZSBpZiAoaXNPYmplY3QodGhpcy5mb3JtKSAmJiBoYXNWYWx1ZSh0aGlzLmZvcm0uZGF0YSkpIHtcbiAgICAgIHRoaXMuanNmLmZvcm1WYWx1ZXMgPSBjbG9uZURlZXAodGhpcy5mb3JtLmRhdGEpO1xuICAgICAgdGhpcy5mb3JtVmFsdWVzSW5wdXQgPSAnZm9ybS5kYXRhJztcbiAgICB9IGVsc2UgaWYgKGhhc1ZhbHVlKHRoaXMuZm9ybURhdGEpKSB7XG4gICAgICB0aGlzLmpzZi5SZWFjdEpzb25TY2hlbWFGb3JtQ29tcGF0aWJpbGl0eSA9IHRydWU7XG4gICAgICB0aGlzLmZvcm1WYWx1ZXNJbnB1dCA9ICdmb3JtRGF0YSc7XG4gICAgfSBlbHNlIGlmIChoYXNPd24odGhpcy5mb3JtLCAnZm9ybURhdGEnKSAmJiBoYXNWYWx1ZSh0aGlzLmZvcm0uZm9ybURhdGEpKSB7XG4gICAgICB0aGlzLmpzZi5SZWFjdEpzb25TY2hlbWFGb3JtQ29tcGF0aWJpbGl0eSA9IHRydWU7XG4gICAgICB0aGlzLmpzZi5mb3JtVmFsdWVzID0gY2xvbmVEZWVwKHRoaXMuZm9ybS5mb3JtRGF0YSk7XG4gICAgICB0aGlzLmZvcm1WYWx1ZXNJbnB1dCA9ICdmb3JtLmZvcm1EYXRhJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mb3JtVmFsdWVzSW5wdXQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAnaW5pdGlhbGl6ZUxheW91dCcgZnVuY3Rpb25cbiAgICpcbiAgICogSW5pdGlhbGl6ZSAnbGF5b3V0J1xuICAgKiBVc2UgZmlyc3QgYXZhaWxhYmxlIGFycmF5IGlucHV0OlxuICAgKiAxLiBsYXlvdXQgLSByZWNvbW1lbmRlZFxuICAgKiAyLiBmb3JtIC0gQW5ndWxhciBTY2hlbWEgRm9ybSBzdHlsZVxuICAgKiAzLiBmb3JtLmZvcm0gLSBKU09OIEZvcm0gc3R5bGVcbiAgICogNC4gZm9ybS5sYXlvdXQgLSBTaW5nbGUgaW5wdXQgc3R5bGVcbiAgICogNS4gKG5vbmUpIG5vIGxheW91dCAtIHNldCBkZWZhdWx0IGxheW91dCBpbnN0ZWFkXG4gICAqICAgIChmdWxsIGxheW91dCB3aWxsIGJlIGJ1aWx0IGxhdGVyIGZyb20gdGhlIHNjaGVtYSlcbiAgICpcbiAgICogQWxzbywgaWYgYWx0ZXJuYXRlIGxheW91dCBmb3JtYXRzIGFyZSBhdmFpbGFibGUsXG4gICAqIGltcG9ydCBmcm9tICdVSVNjaGVtYScgb3IgJ2N1c3RvbUZvcm1JdGVtcydcbiAgICogdXNlZCBmb3IgUmVhY3QgSlNPTiBTY2hlbWEgRm9ybSBhbmQgSlNPTiBGb3JtIEFQSSBjb21wYXRpYmlsaXR5XG4gICAqIFVzZSBmaXJzdCBhdmFpbGFibGUgaW5wdXQ6XG4gICAqIDEuIFVJU2NoZW1hIC0gUmVhY3QgSlNPTiBTY2hlbWEgRm9ybSBzdHlsZVxuICAgKiAyLiBmb3JtLlVJU2NoZW1hIC0gRm9yIHRlc3Rpbmcgc2luZ2xlIGlucHV0IFJlYWN0IEpTT04gU2NoZW1hIEZvcm1zXG4gICAqIDIuIGZvcm0uY3VzdG9tRm9ybUl0ZW1zIC0gSlNPTiBGb3JtIHN0eWxlXG4gICAqIDMuIChub25lKSBubyBpbnB1dCAtIGRvbid0IGltcG9ydFxuICAgKi9cbiAgcHJpdmF0ZSBpbml0aWFsaXplTGF5b3V0KCkge1xuXG4gICAgLy8gUmVuYW1lIEpTT04gRm9ybS1zdHlsZSAnb3B0aW9ucycgbGlzdHMgdG9cbiAgICAvLyBBbmd1bGFyIFNjaGVtYSBGb3JtLXN0eWxlICd0aXRsZU1hcCcgbGlzdHMuXG4gICAgY29uc3QgZml4SnNvbkZvcm1PcHRpb25zID0gKGxheW91dDogYW55KTogYW55ID0+IHtcbiAgICAgIGlmIChpc09iamVjdChsYXlvdXQpIHx8IGlzQXJyYXkobGF5b3V0KSkge1xuICAgICAgICBmb3JFYWNoKGxheW91dCwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICBpZiAoaGFzT3duKHZhbHVlLCAnb3B0aW9ucycpICYmIGlzT2JqZWN0KHZhbHVlLm9wdGlvbnMpKSB7XG4gICAgICAgICAgICB2YWx1ZS50aXRsZU1hcCA9IHZhbHVlLm9wdGlvbnM7XG4gICAgICAgICAgICBkZWxldGUgdmFsdWUub3B0aW9ucztcbiAgICAgICAgICB9XG4gICAgICAgIH0sICd0b3AtZG93bicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxheW91dDtcbiAgICB9O1xuXG4gICAgLy8gQ2hlY2sgZm9yIGxheW91dCBpbnB1dHMgYW5kLCBpZiBmb3VuZCwgaW5pdGlhbGl6ZSBmb3JtIGxheW91dFxuICAgIGlmIChpc0FycmF5KHRoaXMubGF5b3V0KSkge1xuICAgICAgdGhpcy5qc2YubGF5b3V0ID0gY2xvbmVEZWVwKHRoaXMubGF5b3V0KTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkodGhpcy5mb3JtKSkge1xuICAgICAgdGhpcy5qc2YuQW5ndWxhclNjaGVtYUZvcm1Db21wYXRpYmlsaXR5ID0gdHJ1ZTtcbiAgICAgIHRoaXMuanNmLmxheW91dCA9IGNsb25lRGVlcCh0aGlzLmZvcm0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mb3JtICYmIGlzQXJyYXkodGhpcy5mb3JtLmZvcm0pKSB7XG4gICAgICB0aGlzLmpzZi5Kc29uRm9ybUNvbXBhdGliaWxpdHkgPSB0cnVlO1xuICAgICAgdGhpcy5qc2YubGF5b3V0ID0gZml4SnNvbkZvcm1PcHRpb25zKGNsb25lRGVlcCh0aGlzLmZvcm0uZm9ybSkpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mb3JtICYmIGlzQXJyYXkodGhpcy5mb3JtLmxheW91dCkpIHtcbiAgICAgIHRoaXMuanNmLmxheW91dCA9IGNsb25lRGVlcCh0aGlzLmZvcm0ubGF5b3V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5qc2YubGF5b3V0ID0gWycqJ107XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZm9yIGFsdGVybmF0ZSBsYXlvdXQgaW5wdXRzXG4gICAgbGV0IGFsdGVybmF0ZUxheW91dDogYW55ID0gbnVsbDtcbiAgICBpZiAoaXNPYmplY3QodGhpcy5VSVNjaGVtYSkpIHtcbiAgICAgIHRoaXMuanNmLlJlYWN0SnNvblNjaGVtYUZvcm1Db21wYXRpYmlsaXR5ID0gdHJ1ZTtcbiAgICAgIGFsdGVybmF0ZUxheW91dCA9IGNsb25lRGVlcCh0aGlzLlVJU2NoZW1hKTtcbiAgICB9IGVsc2UgaWYgKGhhc093bih0aGlzLmZvcm0sICdVSVNjaGVtYScpKSB7XG4gICAgICB0aGlzLmpzZi5SZWFjdEpzb25TY2hlbWFGb3JtQ29tcGF0aWJpbGl0eSA9IHRydWU7XG4gICAgICBhbHRlcm5hdGVMYXlvdXQgPSBjbG9uZURlZXAodGhpcy5mb3JtLlVJU2NoZW1hKTtcbiAgICB9IGVsc2UgaWYgKGhhc093bih0aGlzLmZvcm0sICd1aVNjaGVtYScpKSB7XG4gICAgICB0aGlzLmpzZi5SZWFjdEpzb25TY2hlbWFGb3JtQ29tcGF0aWJpbGl0eSA9IHRydWU7XG4gICAgICBhbHRlcm5hdGVMYXlvdXQgPSBjbG9uZURlZXAodGhpcy5mb3JtLnVpU2NoZW1hKTtcbiAgICB9IGVsc2UgaWYgKGhhc093bih0aGlzLmZvcm0sICdjdXN0b21Gb3JtSXRlbXMnKSkge1xuICAgICAgdGhpcy5qc2YuSnNvbkZvcm1Db21wYXRpYmlsaXR5ID0gdHJ1ZTtcbiAgICAgIGFsdGVybmF0ZUxheW91dCA9IGZpeEpzb25Gb3JtT3B0aW9ucyhjbG9uZURlZXAodGhpcy5mb3JtLmN1c3RvbUZvcm1JdGVtcykpO1xuICAgIH1cblxuICAgIC8vIGlmIGFsdGVybmF0ZSBsYXlvdXQgZm91bmQsIGNvcHkgYWx0ZXJuYXRlIGxheW91dCBvcHRpb25zIGludG8gc2NoZW1hXG4gICAgaWYgKGFsdGVybmF0ZUxheW91dCkge1xuICAgICAgSnNvblBvaW50ZXIuZm9yRWFjaERlZXAoYWx0ZXJuYXRlTGF5b3V0LCAodmFsdWUsIHBvaW50ZXIpID0+IHtcbiAgICAgICAgY29uc3Qgc2NoZW1hUG9pbnRlciA9IHBvaW50ZXJcbiAgICAgICAgICAucmVwbGFjZSgvXFwvL2csICcvcHJvcGVydGllcy8nKVxuICAgICAgICAgIC5yZXBsYWNlKC9cXC9wcm9wZXJ0aWVzXFwvaXRlbXNcXC9wcm9wZXJ0aWVzXFwvL2csICcvaXRlbXMvcHJvcGVydGllcy8nKVxuICAgICAgICAgIC5yZXBsYWNlKC9cXC9wcm9wZXJ0aWVzXFwvdGl0bGVNYXBcXC9wcm9wZXJ0aWVzXFwvL2csICcvdGl0bGVNYXAvcHJvcGVydGllcy8nKTtcbiAgICAgICAgaWYgKGhhc1ZhbHVlKHZhbHVlKSAmJiBoYXNWYWx1ZShwb2ludGVyKSkge1xuICAgICAgICAgIGxldCBrZXkgPSBKc29uUG9pbnRlci50b0tleShwb2ludGVyKTtcbiAgICAgICAgICBjb25zdCBncm91cFBvaW50ZXIgPSAoSnNvblBvaW50ZXIucGFyc2Uoc2NoZW1hUG9pbnRlcikgfHwgW10pLnNsaWNlKDAsIC0yKTtcbiAgICAgICAgICBsZXQgaXRlbVBvaW50ZXI6IHN0cmluZyB8IHN0cmluZ1tdO1xuXG4gICAgICAgICAgLy8gSWYgJ3VpOm9yZGVyJyBvYmplY3QgZm91bmQsIGNvcHkgaW50byBvYmplY3Qgc2NoZW1hIHJvb3RcbiAgICAgICAgICBpZiAoa2V5LnRvTG93ZXJDYXNlKCkgPT09ICd1aTpvcmRlcicpIHtcbiAgICAgICAgICAgIGl0ZW1Qb2ludGVyID0gWy4uLmdyb3VwUG9pbnRlciwgJ3VpOm9yZGVyJ107XG5cbiAgICAgICAgICAgIC8vIENvcHkgb3RoZXIgYWx0ZXJuYXRlIGxheW91dCBvcHRpb25zIHRvIHNjaGVtYSAneC1zY2hlbWEtZm9ybScsXG4gICAgICAgICAgICAvLyAobGlrZSBBbmd1bGFyIFNjaGVtYSBGb3JtIG9wdGlvbnMpIGFuZCByZW1vdmUgYW55ICd1aTonIHByZWZpeGVzXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChrZXkuc2xpY2UoMCwgMykudG9Mb3dlckNhc2UoKSA9PT0gJ3VpOicpIHsga2V5ID0ga2V5LnNsaWNlKDMpOyB9XG4gICAgICAgICAgICBpdGVtUG9pbnRlciA9IFsuLi5ncm91cFBvaW50ZXIsICd4LXNjaGVtYS1mb3JtJywga2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKEpzb25Qb2ludGVyLmhhcyh0aGlzLmpzZi5zY2hlbWEsIGdyb3VwUG9pbnRlcikgJiZcbiAgICAgICAgICAgICFKc29uUG9pbnRlci5oYXModGhpcy5qc2Yuc2NoZW1hLCBpdGVtUG9pbnRlcilcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIEpzb25Qb2ludGVyLnNldCh0aGlzLmpzZi5zY2hlbWEsIGl0ZW1Qb2ludGVyLCB2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogJ2FjdGl2YXRlRm9ybScgZnVuY3Rpb25cbiAgICpcbiAgICogLi4uY29udGludWVkIGZyb20gJ2luaXRpYWxpemVTY2hlbWEnIGZ1bmN0aW9uLCBhYm92ZVxuICAgKiBJZiAnc2NoZW1hJyBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQgKGkuZS4gbm8gc2NoZW1hIGlucHV0IGZvdW5kKVxuICAgKiA2LiBJZiBsYXlvdXQgaW5wdXQgLSBidWlsZCBzY2hlbWEgZnJvbSBsYXlvdXQgaW5wdXRcbiAgICogNy4gSWYgZGF0YSBpbnB1dCAtIGJ1aWxkIHNjaGVtYSBmcm9tIGRhdGEgaW5wdXRcbiAgICpcbiAgICogQ3JlYXRlIGZpbmFsIGxheW91dCxcbiAgICogYnVpbGQgdGhlIEZvcm1Hcm91cCB0ZW1wbGF0ZSBhbmQgdGhlIEFuZ3VsYXIgRm9ybUdyb3VwLFxuICAgKiBzdWJzY3JpYmUgdG8gY2hhbmdlcyxcbiAgICogYW5kIGFjdGl2YXRlIHRoZSBmb3JtLlxuICAgKi9cbiAgcHJpdmF0ZSBhY3RpdmF0ZUZvcm0oKSB7XG5cbiAgICAvLyBJZiAnc2NoZW1hJyBub3QgaW5pdGlhbGl6ZWRcbiAgICBpZiAoaXNFbXB0eSh0aGlzLmpzZi5zY2hlbWEpKSB7XG5cbiAgICAgIC8vIFRPRE86IElmIGZ1bGwgbGF5b3V0IGlucHV0ICh3aXRoIG5vICcqJyksIGJ1aWxkIHNjaGVtYSBmcm9tIGxheW91dFxuICAgICAgLy8gaWYgKCF0aGlzLmpzZi5sYXlvdXQuaW5jbHVkZXMoJyonKSkge1xuICAgICAgLy8gICB0aGlzLmpzZi5idWlsZFNjaGVtYUZyb21MYXlvdXQoKTtcbiAgICAgIC8vIH0gZWxzZVxuXG4gICAgICAvLyBJZiBkYXRhIGlucHV0LCBidWlsZCBzY2hlbWEgZnJvbSBkYXRhXG4gICAgICBpZiAoIWlzRW1wdHkodGhpcy5qc2YuZm9ybVZhbHVlcykpIHtcbiAgICAgICAgdGhpcy5qc2YuYnVpbGRTY2hlbWFGcm9tRGF0YSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghaXNFbXB0eSh0aGlzLmpzZi5zY2hlbWEpKSB7XG5cbiAgICAgIC8vIElmIG5vdCBhbHJlYWR5IGluaXRpYWxpemVkLCBpbml0aWFsaXplIGFqdiBhbmQgY29tcGlsZSBzY2hlbWFcbiAgICAgIHRoaXMuanNmLmNvbXBpbGVBanZTY2hlbWEoKTtcblxuICAgICAgLy8gVXBkYXRlIGFsbCBsYXlvdXQgZWxlbWVudHMsIGFkZCB2YWx1ZXMsIHdpZGdldHMsIGFuZCB2YWxpZGF0b3JzLFxuICAgICAgLy8gcmVwbGFjZSBhbnkgJyonIHdpdGggYSBsYXlvdXQgYnVpbHQgZnJvbSBhbGwgc2NoZW1hIGVsZW1lbnRzLFxuICAgICAgLy8gYW5kIHVwZGF0ZSB0aGUgRm9ybUdyb3VwIHRlbXBsYXRlIHdpdGggYW55IG5ldyB2YWxpZGF0b3JzXG4gICAgICB0aGlzLmpzZi5idWlsZExheW91dCh0aGlzLndpZGdldExpYnJhcnkpO1xuXG4gICAgICAvLyBCdWlsZCB0aGUgQW5ndWxhciBGb3JtR3JvdXAgdGVtcGxhdGUgZnJvbSB0aGUgc2NoZW1hXG4gICAgICB0aGlzLmpzZi5idWlsZEZvcm1Hcm91cFRlbXBsYXRlKHRoaXMuanNmLmZvcm1WYWx1ZXMpO1xuXG4gICAgICAvLyBCdWlsZCB0aGUgcmVhbCBBbmd1bGFyIEZvcm1Hcm91cCBmcm9tIHRoZSBGb3JtR3JvdXAgdGVtcGxhdGVcbiAgICAgIHRoaXMuanNmLmJ1aWxkRm9ybUdyb3VwKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuanNmLmZvcm1Hcm91cCkge1xuXG4gICAgICAvLyBSZXNldCBpbml0aWFsIGZvcm0gdmFsdWVzXG4gICAgICBpZiAoIWlzRW1wdHkodGhpcy5qc2YuZm9ybVZhbHVlcykgJiZcbiAgICAgICAgdGhpcy5qc2YuZm9ybU9wdGlvbnMuc2V0U2NoZW1hRGVmYXVsdHMgIT09IHRydWUgJiZcbiAgICAgICAgdGhpcy5qc2YuZm9ybU9wdGlvbnMuc2V0TGF5b3V0RGVmYXVsdHMgIT09IHRydWVcbiAgICAgICkge1xuICAgICAgICB0aGlzLnNldEZvcm1WYWx1ZXModGhpcy5qc2YuZm9ybVZhbHVlcyk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRPRE86IEZpZ3VyZSBvdXQgaG93IHRvIGRpc3BsYXkgY2FsY3VsYXRlZCB2YWx1ZXMgd2l0aG91dCBjaGFuZ2luZyBvYmplY3QgZGF0YVxuICAgICAgLy8gU2VlIGh0dHA6Ly91bGlvbi5naXRodWIuaW8vanNvbmZvcm0vcGxheWdyb3VuZC8/ZXhhbXBsZT10ZW1wbGF0aW5nLXZhbHVlc1xuICAgICAgLy8gQ2FsY3VsYXRlIHJlZmVyZW5jZXMgdG8gb3RoZXIgZmllbGRzXG4gICAgICAvLyBpZiAoIWlzRW1wdHkodGhpcy5qc2YuZm9ybUdyb3VwLnZhbHVlKSkge1xuICAgICAgLy8gICBmb3JFYWNoKHRoaXMuanNmLmZvcm1Hcm91cC52YWx1ZSwgKHZhbHVlLCBrZXksIG9iamVjdCwgcm9vdE9iamVjdCkgPT4ge1xuICAgICAgLy8gICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyAgICAgICBvYmplY3Rba2V5XSA9IHRoaXMuanNmLnBhcnNlVGV4dCh2YWx1ZSwgdmFsdWUsIHJvb3RPYmplY3QsIGtleSk7XG4gICAgICAvLyAgICAgfVxuICAgICAgLy8gICB9LCAndG9wLWRvd24nKTtcbiAgICAgIC8vIH1cblxuICAgICAgLy8gU3Vic2NyaWJlIHRvIGZvcm0gY2hhbmdlcyB0byBvdXRwdXQgbGl2ZSBkYXRhLCB2YWxpZGF0aW9uLCBhbmQgZXJyb3JzXG4gICAgICB0aGlzLmpzZi5kYXRhQ2hhbmdlcy5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgIHRoaXMub25DaGFuZ2VzLmVtaXQodGhpcy5vYmplY3RXcmFwID8gZGF0YVsnMSddIDogZGF0YSk7XG4gICAgICAgIGlmICh0aGlzLmZvcm1WYWx1ZXNJbnB1dCAmJiB0aGlzLmZvcm1WYWx1ZXNJbnB1dC5pbmRleE9mKCcuJykgPT09IC0xKSB7XG4gICAgICAgICAgdGhpc1tgJHt0aGlzLmZvcm1WYWx1ZXNJbnB1dH1DaGFuZ2VgXS5lbWl0KHRoaXMub2JqZWN0V3JhcCA/IGRhdGFbJzEnXSA6IGRhdGEpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gVHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uIG9uIHN0YXR1c0NoYW5nZXMgdG8gc2hvdyB1cGRhdGVkIGVycm9yc1xuICAgICAgdGhpcy5qc2YuZm9ybUdyb3VwLnN0YXR1c0NoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHRoaXMuY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCkpO1xuICAgICAgdGhpcy5qc2YuaXNWYWxpZENoYW5nZXMuc3Vic2NyaWJlKGlzVmFsaWQgPT4gdGhpcy5pc1ZhbGlkLmVtaXQoaXNWYWxpZCkpO1xuICAgICAgdGhpcy5qc2YudmFsaWRhdGlvbkVycm9yQ2hhbmdlcy5zdWJzY3JpYmUoZXJyID0+IHRoaXMudmFsaWRhdGlvbkVycm9ycy5lbWl0KGVycikpO1xuXG4gICAgICAvLyBPdXRwdXQgZmluYWwgc2NoZW1hLCBmaW5hbCBsYXlvdXQsIGFuZCBpbml0aWFsIGRhdGFcbiAgICAgIHRoaXMuZm9ybVNjaGVtYS5lbWl0KHRoaXMuanNmLnNjaGVtYSk7XG4gICAgICB0aGlzLmZvcm1MYXlvdXQuZW1pdCh0aGlzLmpzZi5sYXlvdXQpO1xuICAgICAgdGhpcy5vbkNoYW5nZXMuZW1pdCh0aGlzLm9iamVjdFdyYXAgPyB0aGlzLmpzZi5kYXRhWycxJ10gOiB0aGlzLmpzZi5kYXRhKTtcblxuICAgICAgLy8gSWYgdmFsaWRhdGVPblJlbmRlciwgb3V0cHV0IGluaXRpYWwgdmFsaWRhdGlvbiBhbmQgYW55IGVycm9yc1xuICAgICAgY29uc3QgdmFsaWRhdGVPblJlbmRlciA9XG4gICAgICAgIEpzb25Qb2ludGVyLmdldCh0aGlzLmpzZiwgJy9mb3JtT3B0aW9ucy92YWxpZGF0ZU9uUmVuZGVyJyk7XG4gICAgICBpZiAodmFsaWRhdGVPblJlbmRlcikgeyAvLyB2YWxpZGF0ZU9uUmVuZGVyID09PSAnYXV0bycgfHwgdHJ1ZVxuICAgICAgICBjb25zdCB0b3VjaEFsbCA9IChjb250cm9sKSA9PiB7XG4gICAgICAgICAgaWYgKHZhbGlkYXRlT25SZW5kZXIgPT09IHRydWUgfHwgaGFzVmFsdWUoY29udHJvbC52YWx1ZSkpIHtcbiAgICAgICAgICAgIGNvbnRyb2wubWFya0FzVG91Y2hlZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBPYmplY3Qua2V5cyhjb250cm9sLmNvbnRyb2xzIHx8IHt9KVxuICAgICAgICAgICAgLmZvckVhY2goa2V5ID0+IHRvdWNoQWxsKGNvbnRyb2wuY29udHJvbHNba2V5XSkpO1xuICAgICAgICB9O1xuICAgICAgICB0b3VjaEFsbCh0aGlzLmpzZi5mb3JtR3JvdXApO1xuICAgICAgICB0aGlzLmlzVmFsaWQuZW1pdCh0aGlzLmpzZi5pc1ZhbGlkKTtcbiAgICAgICAgdGhpcy52YWxpZGF0aW9uRXJyb3JzLmVtaXQodGhpcy5qc2YuYWp2RXJyb3JzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==