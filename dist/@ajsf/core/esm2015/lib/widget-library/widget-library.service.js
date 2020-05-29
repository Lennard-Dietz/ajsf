/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { AddReferenceComponent } from './add-reference.component';
import { ButtonComponent } from './button.component';
import { CheckboxComponent } from './checkbox.component';
import { CheckboxesComponent } from './checkboxes.component';
import { FileComponent } from './file.component';
import { hasOwn } from '../shared/utility.functions';
import { Injectable } from '@angular/core';
import { InputComponent } from './input.component';
import { MessageComponent } from './message.component';
import { NoneComponent } from './none.component';
import { NumberComponent } from './number.component';
import { OneOfComponent } from './one-of.component';
import { RadiosComponent } from './radios.component';
import { RootComponent } from './root.component';
import { SectionComponent } from './section.component';
import { SelectComponent } from './select.component';
import { SelectFrameworkComponent } from './select-framework.component';
import { SelectWidgetComponent } from './select-widget.component';
import { SubmitComponent } from './submit.component';
import { TabsComponent } from './tabs.component';
import { TemplateComponent } from './template.component';
import { TextareaComponent } from './textarea.component';
import * as i0 from "@angular/core";
export class WidgetLibraryService {
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
/** @nocollapse */ WidgetLibraryService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function WidgetLibraryService_Factory() { return new WidgetLibraryService(); }, token: WidgetLibraryService, providedIn: "root" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0LWxpYnJhcnkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhanNmL2NvcmUvIiwic291cmNlcyI6WyJsaWIvd2lkZ2V0LWxpYnJhcnkvd2lkZ2V0LWxpYnJhcnkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDbEUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzdELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNqRCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDckQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDcEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNqRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDckQsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sOEJBQThC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RixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7Ozs7Ozs7SUFHQyw2Q0FBdUI7O0lBQ3ZCLDZDQTZHRTs7SUFDRixpREFBNkI7O0lBQzdCLGdEQUE0Qjs7SUFDNUIsNkNBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWRkUmVmZXJlbmNlQ29tcG9uZW50IH0gZnJvbSAnLi9hZGQtcmVmZXJlbmNlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBCdXR0b25Db21wb25lbnQgfSBmcm9tICcuL2J1dHRvbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2hlY2tib3hDb21wb25lbnQgfSBmcm9tICcuL2NoZWNrYm94LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDaGVja2JveGVzQ29tcG9uZW50IH0gZnJvbSAnLi9jaGVja2JveGVzLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBGaWxlQ29tcG9uZW50IH0gZnJvbSAnLi9maWxlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBoYXNPd24gfSBmcm9tICcuLi9zaGFyZWQvdXRpbGl0eS5mdW5jdGlvbnMnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSW5wdXRDb21wb25lbnQgfSBmcm9tICcuL2lucHV0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNZXNzYWdlQ29tcG9uZW50IH0gZnJvbSAnLi9tZXNzYWdlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOb25lQ29tcG9uZW50IH0gZnJvbSAnLi9ub25lLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOdW1iZXJDb21wb25lbnQgfSBmcm9tICcuL251bWJlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgT25lT2ZDb21wb25lbnQgfSBmcm9tICcuL29uZS1vZi5jb21wb25lbnQnO1xuaW1wb3J0IHsgUmFkaW9zQ29tcG9uZW50IH0gZnJvbSAnLi9yYWRpb3MuY29tcG9uZW50JztcbmltcG9ydCB7IFJvb3RDb21wb25lbnQgfSBmcm9tICcuL3Jvb3QuY29tcG9uZW50JztcbmltcG9ydCB7IFNlY3Rpb25Db21wb25lbnQgfSBmcm9tICcuL3NlY3Rpb24uY29tcG9uZW50JztcbmltcG9ydCB7IFNlbGVjdENvbXBvbmVudCB9IGZyb20gJy4vc2VsZWN0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTZWxlY3RGcmFtZXdvcmtDb21wb25lbnQgfSBmcm9tICcuL3NlbGVjdC1mcmFtZXdvcmsuY29tcG9uZW50JztcbmltcG9ydCB7IFNlbGVjdFdpZGdldENvbXBvbmVudCB9IGZyb20gJy4vc2VsZWN0LXdpZGdldC5jb21wb25lbnQnO1xuaW1wb3J0IHsgU3VibWl0Q29tcG9uZW50IH0gZnJvbSAnLi9zdWJtaXQuY29tcG9uZW50JztcbmltcG9ydCB7IFRhYnNDb21wb25lbnQgfSBmcm9tICcuL3RhYnMuY29tcG9uZW50JztcbmltcG9ydCB7IFRlbXBsYXRlQ29tcG9uZW50IH0gZnJvbSAnLi90ZW1wbGF0ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgVGV4dGFyZWFDb21wb25lbnQgfSBmcm9tICcuL3RleHRhcmVhLmNvbXBvbmVudCc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBXaWRnZXRMaWJyYXJ5U2VydmljZSB7XG5cbiAgZGVmYXVsdFdpZGdldCA9ICd0ZXh0JztcbiAgd2lkZ2V0TGlicmFyeTogYW55ID0ge1xuXG4gIC8vIEFuZ3VsYXIgSlNPTiBTY2hlbWEgRm9ybSBhZG1pbmlzdHJhdGl2ZSB3aWRnZXRzXG4gICAgJ25vbmUnOiBOb25lQ29tcG9uZW50LCAvLyBQbGFjZWhvbGRlciwgZm9yIGRldmVsb3BtZW50IC0gZGlzcGxheXMgbm90aGluZ1xuICAgICdyb290JzogUm9vdENvbXBvbmVudCwgLy8gRm9ybSByb290LCByZW5kZXJzIGEgY29tcGxldGUgbGF5b3V0XG4gICAgJ3NlbGVjdC1mcmFtZXdvcmsnOiBTZWxlY3RGcmFtZXdvcmtDb21wb25lbnQsIC8vIEFwcGxpZXMgdGhlIHNlbGVjdGVkIGZyYW1ld29yayB0byBhIHNwZWNpZmllZCB3aWRnZXRcbiAgICAnc2VsZWN0LXdpZGdldCc6IFNlbGVjdFdpZGdldENvbXBvbmVudCwgLy8gRGlzcGxheXMgYSBzcGVjaWZpZWQgd2lkZ2V0XG4gICAgJyRyZWYnOiBBZGRSZWZlcmVuY2VDb21wb25lbnQsIC8vIEJ1dHRvbiB0byBhZGQgYSBuZXcgYXJyYXkgaXRlbSBvciAkcmVmIGVsZW1lbnRcblxuICAvLyBGcmVlLWZvcm0gdGV4dCBIVE1MICdpbnB1dCcgZm9ybSBjb250cm9sIHdpZGdldHMgPGlucHV0IHR5cGU9XCIuLi5cIj5cbiAgICAnZW1haWwnOiAndGV4dCcsXG4gICAgJ2ludGVnZXInOiAnbnVtYmVyJywgLy8gTm90ZTogJ2ludGVnZXInIGlzIG5vdCBhIHJlY29nbml6ZWQgSFRNTCBpbnB1dCB0eXBlXG4gICAgJ251bWJlcic6IE51bWJlckNvbXBvbmVudCxcbiAgICAncGFzc3dvcmQnOiAndGV4dCcsXG4gICAgJ3NlYXJjaCc6ICd0ZXh0JyxcbiAgICAndGVsJzogJ3RleHQnLFxuICAgICd0ZXh0JzogSW5wdXRDb21wb25lbnQsXG4gICAgJ3VybCc6ICd0ZXh0JyxcblxuICAvLyBDb250cm9sbGVkIHRleHQgSFRNTCAnaW5wdXQnIGZvcm0gY29udHJvbCB3aWRnZXRzIDxpbnB1dCB0eXBlPVwiLi4uXCI+XG4gICAgJ2NvbG9yJzogJ3RleHQnLFxuICAgICdkYXRlJzogJ3RleHQnLFxuICAgICdkYXRldGltZSc6ICd0ZXh0JyxcbiAgICAnZGF0ZXRpbWUtbG9jYWwnOiAndGV4dCcsXG4gICAgJ21vbnRoJzogJ3RleHQnLFxuICAgICdyYW5nZSc6ICdudW1iZXInLFxuICAgICd0aW1lJzogJ3RleHQnLFxuICAgICd3ZWVrJzogJ3RleHQnLFxuXG4gIC8vIE5vbi10ZXh0IEhUTUwgJ2lucHV0JyBmb3JtIGNvbnRyb2wgd2lkZ2V0cyA8aW5wdXQgdHlwZT1cIi4uLlwiPlxuICAgIC8vICdidXR0b24nOiA8aW5wdXQgdHlwZT1cImJ1dHRvblwiPiBub3QgdXNlZCwgdXNlIDxidXR0b24+IGluc3RlYWRcbiAgICAnY2hlY2tib3gnOiBDaGVja2JveENvbXBvbmVudCwgLy8gVE9ETzogU2V0IHRlcm5hcnkgPSB0cnVlIGZvciAzLXN0YXRlID8/XG4gICAgJ2ZpbGUnOiBGaWxlQ29tcG9uZW50LCAvLyBUT0RPOiBGaW5pc2ggJ2ZpbGUnIHdpZGdldFxuICAgICdoaWRkZW4nOiAndGV4dCcsXG4gICAgJ2ltYWdlJzogJ3RleHQnLCAvLyBUT0RPOiBGaWd1cmUgb3V0IGhvdyB0byBoYW5kbGUgdGhlc2VcbiAgICAncmFkaW8nOiAncmFkaW9zJyxcbiAgICAncmVzZXQnOiAnc3VibWl0JywgLy8gVE9ETzogRmlndXJlIG91dCBob3cgdG8gaGFuZGxlIHRoZXNlXG4gICAgJ3N1Ym1pdCc6IFN1Ym1pdENvbXBvbmVudCxcblxuICAvLyBPdGhlciAobm9uLSdpbnB1dCcpIEhUTUwgZm9ybSBjb250cm9sIHdpZGdldHNcbiAgICAnYnV0dG9uJzogQnV0dG9uQ29tcG9uZW50LFxuICAgICdzZWxlY3QnOiBTZWxlY3RDb21wb25lbnQsXG4gICAgLy8gJ29wdGlvbic6IGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIGJ5IHNlbGVjdCB3aWRnZXRzXG4gICAgLy8gJ29wdGdyb3VwJzogYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgYnkgc2VsZWN0IHdpZGdldHNcbiAgICAndGV4dGFyZWEnOiBUZXh0YXJlYUNvbXBvbmVudCxcblxuICAvLyBIVE1MIGZvcm0gY29udHJvbCB3aWRnZXQgc2V0c1xuICAgICdjaGVja2JveGVzJzogQ2hlY2tib3hlc0NvbXBvbmVudCwgLy8gR3JvdXBlZCBsaXN0IG9mIGNoZWNrYm94ZXNcbiAgICAnY2hlY2tib3hlcy1pbmxpbmUnOiAnY2hlY2tib3hlcycsIC8vIENoZWNrYm94ZXMgaW4gb25lIGxpbmVcbiAgICAnY2hlY2tib3hidXR0b25zJzogJ2NoZWNrYm94ZXMnLCAvLyBDaGVja2JveGVzIGFzIGh0bWwgYnV0dG9uc1xuICAgICdyYWRpb3MnOiBSYWRpb3NDb21wb25lbnQsIC8vIEdyb3VwZWQgbGlzdCBvZiByYWRpbyBidXR0b25zXG4gICAgJ3JhZGlvcy1pbmxpbmUnOiAncmFkaW9zJywgLy8gUmFkaW8gY29udHJvbHMgaW4gb25lIGxpbmVcbiAgICAncmFkaW9idXR0b25zJzogJ3JhZGlvcycsIC8vIFJhZGlvIGNvbnRyb2xzIGFzIGh0bWwgYnV0dG9uc1xuXG4gIC8vIEhUTUwgTGF5b3V0IHdpZGdldHNcbiAgICAvLyAnbGFiZWwnOiBhdXRvbWF0aWNhbGx5IGFkZGVkIHRvIGRhdGEgd2lkZ2V0c1xuICAgIC8vICdsZWdlbmQnOiBhdXRvbWF0aWNhbGx5IGFkZGVkIHRvIGZpZWxkc2V0c1xuICAgICdzZWN0aW9uJzogU2VjdGlvbkNvbXBvbmVudCwgLy8gSnVzdCBhIGRpdiA8ZGl2PlxuICAgICdkaXYnOiAnc2VjdGlvbicsIC8vIFN0aWxsIGp1c3QgYSBkaXYgPGRpdj5cbiAgICAnZmllbGRzZXQnOiAnc2VjdGlvbicsIC8vIEEgZmllbGRzZXQsIHdpdGggYW4gb3B0aW9uYWwgbGVnZW5kIDxmaWVsZHNldD5cbiAgICAnZmxleCc6ICdzZWN0aW9uJywgLy8gQSBmbGV4Ym94IGNvbnRhaW5lciA8ZGl2IHN0eWxlPVwiZGlzcGxheTogZmxleFwiPlxuXG4gIC8vIE5vbi1IVE1MIGxheW91dCB3aWRnZXRzXG4gICAgJ29uZS1vZic6IE9uZU9mQ29tcG9uZW50LCAvLyBBIHNlbGVjdCBib3ggdGhhdCBjaGFuZ2VzIGFub3RoZXIgaW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IEZpbmlzaCAnb25lLW9mJyB3aWRnZXRcbiAgICAnYXJyYXknOiAnc2VjdGlvbicsIC8vIEEgbGlzdCB5b3UgY2FuIGFkZCwgcmVtb3ZlIGFuZCByZW9yZGVyIDxmaWVsZHNldD5cbiAgICAndGFiYXJyYXknOiAndGFicycsIC8vIEEgdGFiYmVkIHZlcnNpb24gb2YgYXJyYXlcbiAgICAndGFiJzogJ3NlY3Rpb24nLCAvLyBBIHRhYiBncm91cCwgc2ltaWxhciB0byBhIGZpZWxkc2V0IG9yIHNlY3Rpb24gPGZpZWxkc2V0PlxuICAgICd0YWJzJzogVGFic0NvbXBvbmVudCwgLy8gQSB0YWJiZWQgc2V0IG9mIHBhbmVscyB3aXRoIGRpZmZlcmVudCBjb250cm9sc1xuICAgICdtZXNzYWdlJzogTWVzc2FnZUNvbXBvbmVudCwgLy8gSW5zZXJ0IGFyYml0cmFyeSBodG1sXG4gICAgJ2hlbHAnOiAnbWVzc2FnZScsIC8vIEluc2VydCBhcmJpdHJhcnkgaHRtbFxuICAgICdtc2cnOiAnbWVzc2FnZScsIC8vIEluc2VydCBhcmJpdHJhcnkgaHRtbFxuICAgICdodG1sJzogJ21lc3NhZ2UnLCAvLyBJbnNlcnQgYXJiaXRyYXJ5IGh0bWxcbiAgICAndGVtcGxhdGUnOiBUZW1wbGF0ZUNvbXBvbmVudCwgLy8gSW5zZXJ0IGEgY3VzdG9tIEFuZ3VsYXIgY29tcG9uZW50XG5cbiAgLy8gV2lkZ2V0cyBpbmNsdWRlZCBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIEpTT04gRm9ybSBBUElcbiAgICAnYWR2YW5jZWRmaWVsZHNldCc6ICdzZWN0aW9uJywgLy8gQWRkcyAnQWR2YW5jZWQgc2V0dGluZ3MnIHRpdGxlIDxmaWVsZHNldD5cbiAgICAnYXV0aGZpZWxkc2V0JzogJ3NlY3Rpb24nLCAvLyBBZGRzICdBdXRoZW50aWNhdGlvbiBzZXR0aW5ncycgdGl0bGUgPGZpZWxkc2V0PlxuICAgICdvcHRpb25maWVsZHNldCc6ICdvbmUtb2YnLCAvLyBPcHRpb24gY29udHJvbCwgZGlzcGxheXMgc2VsZWN0ZWQgc3ViLWl0ZW0gPGZpZWxkc2V0PlxuICAgICdzZWxlY3RmaWVsZHNldCc6ICdvbmUtb2YnLCAvLyBTZWxlY3QgY29udHJvbCwgZGlzcGxheXMgc2VsZWN0ZWQgc3ViLWl0ZW0gPGZpZWxkc2V0PlxuICAgICdjb25kaXRpb25hbCc6ICdzZWN0aW9uJywgLy8gSWRlbnRpY2FsIHRvICdzZWN0aW9uJyAoZGVwZWNpYXRlZCkgPGRpdj5cbiAgICAnYWN0aW9ucyc6ICdzZWN0aW9uJywgLy8gSG9yaXpvbnRhbCBidXR0b24gbGlzdCwgY2FuIG9ubHkgc3VibWl0LCB1c2VzIGJ1dHRvbnMgYXMgaXRlbXMgPGRpdj5cbiAgICAndGFnc2lucHV0JzogJ3NlY3Rpb24nLCAvLyBGb3IgZW50ZXJpbmcgc2hvcnQgdGV4dCB0YWdzIDxkaXY+XG4gICAgLy8gU2VlOiBodHRwOi8vdWxpb24uZ2l0aHViLmlvL2pzb25mb3JtL3BsYXlncm91bmQvP2V4YW1wbGU9ZmllbGRzLWNoZWNrYm94YnV0dG9uc1xuXG4gIC8vIFdpZGdldHMgaW5jbHVkZWQgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBSZWFjdCBKU09OIFNjaGVtYSBGb3JtIEFQSVxuICAgICd1cGRvd24nOiAnbnVtYmVyJyxcbiAgICAnZGF0ZS10aW1lJzogJ2RhdGV0aW1lLWxvY2FsJyxcbiAgICAnYWx0LWRhdGV0aW1lJzogJ2RhdGV0aW1lLWxvY2FsJyxcbiAgICAnYWx0LWRhdGUnOiAnZGF0ZScsXG5cbiAgLy8gV2lkZ2V0cyBpbmNsdWRlZCBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIEFuZ3VsYXIgU2NoZW1hIEZvcm0gQVBJXG4gICAgJ3dpemFyZCc6ICdzZWN0aW9uJywgLy8gVE9ETzogU2VxdWVudGlhbCBwYW5lbHMgd2l0aCBcIk5leHRcIiBhbmQgXCJQcmV2aW91c1wiIGJ1dHRvbnNcblxuICAvLyBXaWRnZXRzIGluY2x1ZGVkIGZvciBjb21wYXRpYmlsaXR5IHdpdGggb3RoZXIgbGlicmFyaWVzXG4gICAgJ3RleHRsaW5lJzogJ3RleHQnLFxuXG4gIC8vIFJlY29tbWVuZGVkIDNyZC1wYXJ0eSBhZGQtb24gd2lkZ2V0cyAoVE9ETzogY3JlYXRlIHdyYXBwZXJzIGZvciB0aGVzZS4uLilcbiAgICAvLyAnbmcyLXNlbGVjdCc6IFNlbGVjdCBjb250cm9sIHJlcGxhY2VtZW50IC0gaHR0cDovL3ZhbG9yLXNvZnR3YXJlLmNvbS9uZzItc2VsZWN0L1xuICAgIC8vICdmbGF0cGlja3InOiBGbGF0cGlja3IgZGF0ZSBwaWNrZXIgLSBodHRwczovL2dpdGh1Yi5jb20vY2htbG4vZmxhdHBpY2tyXG4gICAgLy8gJ3Bpa2FkYXknOiBQaWthZGF5IGRhdGUgcGlja2VyIC0gaHR0cHM6Ly9naXRodWIuY29tL2RidXNoZWxsL1Bpa2FkYXlcbiAgICAvLyAnc3BlY3RydW0nOiBTcGVjdHJ1bSBjb2xvciBwaWNrZXIgLSBodHRwOi8vYmdyaW5zLmdpdGh1Yi5pby9zcGVjdHJ1bVxuICAgIC8vICdib290c3RyYXAtc2xpZGVyJzogQm9vdHN0cmFwIFNsaWRlciByYW5nZSBjb250cm9sIC0gaHR0cHM6Ly9naXRodWIuY29tL3NlaXlyaWEvYm9vdHN0cmFwLXNsaWRlclxuICAgIC8vICdhY2UnOiBBQ0UgY29kZSBlZGl0b3IgLSBodHRwczovL2FjZS5jOS5pb1xuICAgIC8vICdja2VkaXRvcic6IENLRWRpdG9yIEhUTUwgLyByaWNoIHRleHQgZWRpdG9yIC0gaHR0cDovL2NrZWRpdG9yLmNvbVxuICAgIC8vICd0aW55bWNlJzogVGlueU1DRSBIVE1MIC8gcmljaCB0ZXh0IGVkaXRvciAtIGh0dHBzOi8vd3d3LnRpbnltY2UuY29tXG4gICAgLy8gJ2ltYWdlc2VsZWN0JzogQm9vdHN0cmFwIGRyb3AtZG93biBpbWFnZSBzZWxlY3RvciAtIGh0dHA6Ly9zaWx2aW9tb3JldG8uZ2l0aHViLmlvL2Jvb3RzdHJhcC1zZWxlY3RcbiAgICAvLyAnd3lzaWh0bWw1JzogSFRNTCBlZGl0b3IgLSBodHRwOi8vamhvbGxpbmd3b3J0aC5naXRodWIuaW8vYm9vdHN0cmFwLXd5c2lodG1sNVxuICAgIC8vICdxdWlsbCc6IFF1aWxsIEhUTUwgLyByaWNoIHRleHQgZWRpdG9yICg/KSAtIGh0dHBzOi8vcXVpbGxqcy5jb21cbiAgfTtcbiAgcmVnaXN0ZXJlZFdpZGdldHM6IGFueSA9IHsgfTtcbiAgZnJhbWV3b3JrV2lkZ2V0czogYW55ID0geyB9O1xuICBhY3RpdmVXaWRnZXRzOiBhbnkgPSB7IH07XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZXRBY3RpdmVXaWRnZXRzKCk7XG4gIH1cblxuICBzZXRBY3RpdmVXaWRnZXRzKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuYWN0aXZlV2lkZ2V0cyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7IH0sIHRoaXMud2lkZ2V0TGlicmFyeSwgdGhpcy5mcmFtZXdvcmtXaWRnZXRzLCB0aGlzLnJlZ2lzdGVyZWRXaWRnZXRzXG4gICAgKTtcbiAgICBmb3IgKGNvbnN0IHdpZGdldE5hbWUgb2YgT2JqZWN0LmtleXModGhpcy5hY3RpdmVXaWRnZXRzKSkge1xuICAgICAgbGV0IHdpZGdldDogYW55ID0gdGhpcy5hY3RpdmVXaWRnZXRzW3dpZGdldE5hbWVdO1xuICAgICAgLy8gUmVzb2x2ZSBhbGlhc2VzXG4gICAgICBpZiAodHlwZW9mIHdpZGdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc3QgdXNlZEFsaWFzZXM6IHN0cmluZ1tdID0gW107XG4gICAgICAgIHdoaWxlICh0eXBlb2Ygd2lkZ2V0ID09PSAnc3RyaW5nJyAmJiAhdXNlZEFsaWFzZXMuaW5jbHVkZXMod2lkZ2V0KSkge1xuICAgICAgICAgIHVzZWRBbGlhc2VzLnB1c2god2lkZ2V0KTtcbiAgICAgICAgICB3aWRnZXQgPSB0aGlzLmFjdGl2ZVdpZGdldHNbd2lkZ2V0XTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHdpZGdldCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aGlzLmFjdGl2ZVdpZGdldHNbd2lkZ2V0TmFtZV0gPSB3aWRnZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBzZXREZWZhdWx0V2lkZ2V0KHR5cGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5oYXNXaWRnZXQodHlwZSkpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgdGhpcy5kZWZhdWx0V2lkZ2V0ID0gdHlwZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGhhc1dpZGdldCh0eXBlOiBzdHJpbmcsIHdpZGdldFNldCA9ICdhY3RpdmVXaWRnZXRzJyk6IGJvb2xlYW4ge1xuICAgIGlmICghdHlwZSB8fCB0eXBlb2YgdHlwZSAhPT0gJ3N0cmluZycpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgcmV0dXJuIGhhc093bih0aGlzW3dpZGdldFNldF0sIHR5cGUpO1xuICB9XG5cbiAgaGFzRGVmYXVsdFdpZGdldCh0eXBlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5oYXNXaWRnZXQodHlwZSwgJ3dpZGdldExpYnJhcnknKTtcbiAgfVxuXG4gIHJlZ2lzdGVyV2lkZ2V0KHR5cGU6IHN0cmluZywgd2lkZ2V0OiBhbnkpOiBib29sZWFuIHtcbiAgICBpZiAoIXR5cGUgfHwgIXdpZGdldCB8fCB0eXBlb2YgdHlwZSAhPT0gJ3N0cmluZycpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgdGhpcy5yZWdpc3RlcmVkV2lkZ2V0c1t0eXBlXSA9IHdpZGdldDtcbiAgICByZXR1cm4gdGhpcy5zZXRBY3RpdmVXaWRnZXRzKCk7XG4gIH1cblxuICB1blJlZ2lzdGVyV2lkZ2V0KHR5cGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICghaGFzT3duKHRoaXMucmVnaXN0ZXJlZFdpZGdldHMsIHR5cGUpKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGRlbGV0ZSB0aGlzLnJlZ2lzdGVyZWRXaWRnZXRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzLnNldEFjdGl2ZVdpZGdldHMoKTtcbiAgfVxuXG4gIHVuUmVnaXN0ZXJBbGxXaWRnZXRzKHVuUmVnaXN0ZXJGcmFtZXdvcmtXaWRnZXRzID0gdHJ1ZSk6IGJvb2xlYW4ge1xuICAgIHRoaXMucmVnaXN0ZXJlZFdpZGdldHMgPSB7IH07XG4gICAgaWYgKHVuUmVnaXN0ZXJGcmFtZXdvcmtXaWRnZXRzKSB7IHRoaXMuZnJhbWV3b3JrV2lkZ2V0cyA9IHsgfTsgfVxuICAgIHJldHVybiB0aGlzLnNldEFjdGl2ZVdpZGdldHMoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyRnJhbWV3b3JrV2lkZ2V0cyh3aWRnZXRzOiBhbnkpOiBib29sZWFuIHtcbiAgICBpZiAod2lkZ2V0cyA9PT0gbnVsbCB8fCB0eXBlb2Ygd2lkZ2V0cyAhPT0gJ29iamVjdCcpIHsgd2lkZ2V0cyA9IHsgfTsgfVxuICAgIHRoaXMuZnJhbWV3b3JrV2lkZ2V0cyA9IHdpZGdldHM7XG4gICAgcmV0dXJuIHRoaXMuc2V0QWN0aXZlV2lkZ2V0cygpO1xuICB9XG5cbiAgdW5SZWdpc3RlckZyYW1ld29ya1dpZGdldHMoKTogYm9vbGVhbiB7XG4gICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuZnJhbWV3b3JrV2lkZ2V0cykubGVuZ3RoKSB7XG4gICAgICB0aGlzLmZyYW1ld29ya1dpZGdldHMgPSB7IH07XG4gICAgICByZXR1cm4gdGhpcy5zZXRBY3RpdmVXaWRnZXRzKCk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldFdpZGdldCh0eXBlPzogc3RyaW5nLCB3aWRnZXRTZXQgPSAnYWN0aXZlV2lkZ2V0cycpOiBhbnkge1xuICAgIGlmICh0aGlzLmhhc1dpZGdldCh0eXBlLCB3aWRnZXRTZXQpKSB7XG4gICAgICByZXR1cm4gdGhpc1t3aWRnZXRTZXRdW3R5cGVdO1xuICAgIH0gZWxzZSBpZiAodGhpcy5oYXNXaWRnZXQodGhpcy5kZWZhdWx0V2lkZ2V0LCB3aWRnZXRTZXQpKSB7XG4gICAgICByZXR1cm4gdGhpc1t3aWRnZXRTZXRdW3RoaXMuZGVmYXVsdFdpZGdldF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGdldEFsbFdpZGdldHMoKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgd2lkZ2V0TGlicmFyeTogdGhpcy53aWRnZXRMaWJyYXJ5LFxuICAgICAgcmVnaXN0ZXJlZFdpZGdldHM6IHRoaXMucmVnaXN0ZXJlZFdpZGdldHMsXG4gICAgICBmcmFtZXdvcmtXaWRnZXRzOiB0aGlzLmZyYW1ld29ya1dpZGdldHMsXG4gICAgICBhY3RpdmVXaWRnZXRzOiB0aGlzLmFjdGl2ZVdpZGdldHMsXG4gICAgfTtcbiAgfVxufVxuIl19