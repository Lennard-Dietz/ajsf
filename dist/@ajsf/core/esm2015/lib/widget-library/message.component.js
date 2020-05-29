/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
export class MessageComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWpzZi9jb3JlLyIsInNvdXJjZXMiOlsibGliL3dpZGdldC1saWJyYXJ5L21lc3NhZ2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUN6RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQVdwRSxNQUFNLE9BQU8sZ0JBQWdCOzs7O0lBTzNCLFlBQ1UsR0FBMEI7UUFBMUIsUUFBRyxHQUFILEdBQUcsQ0FBdUI7UUFOcEMsWUFBTyxHQUFXLElBQUksQ0FBQztJQU9uQixDQUFDOzs7O0lBRUwsUUFBUTtRQUNOLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTO1lBQ3hELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO0lBQzdDLENBQUM7OztZQXZCRixTQUFTLFNBQUM7O2dCQUVULFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLFFBQVEsRUFBRTs7O29DQUd3QjthQUNuQzs7OztZQVZRLHFCQUFxQjs7O3lCQWMzQixLQUFLOzBCQUNMLEtBQUs7d0JBQ0wsS0FBSzs7OztJQUpOLG1DQUFhOztJQUNiLG1DQUF1Qjs7SUFDdkIsc0NBQXlCOztJQUN6Qix1Q0FBK0I7O0lBQy9CLHFDQUE2Qjs7Ozs7SUFHM0IsK0JBQWtDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBKc29uU2NoZW1hRm9ybVNlcnZpY2UgfSBmcm9tICcuLi9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UnO1xuXG5cbkBDb21wb25lbnQoe1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y29tcG9uZW50LXNlbGVjdG9yXG4gIHNlbGVjdG9yOiAnbWVzc2FnZS13aWRnZXQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxzcGFuICpuZ0lmPVwibWVzc2FnZVwiXG4gICAgICBbY2xhc3NdPVwib3B0aW9ucz8ubGFiZWxIdG1sQ2xhc3MgfHwgJydcIlxuICAgICAgW2lubmVySFRNTF09XCJtZXNzYWdlXCI+PC9zcGFuPmAsXG59KVxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBvcHRpb25zOiBhbnk7XG4gIG1lc3NhZ2U6IHN0cmluZyA9IG51bGw7XG4gIEBJbnB1dCgpIGxheW91dE5vZGU6IGFueTtcbiAgQElucHV0KCkgbGF5b3V0SW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBkYXRhSW5kZXg6IG51bWJlcltdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUganNmOiBKc29uU2NoZW1hRm9ybVNlcnZpY2VcbiAgKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLmxheW91dE5vZGUub3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLm1lc3NhZ2UgPSB0aGlzLm9wdGlvbnMuaGVscCB8fCB0aGlzLm9wdGlvbnMuaGVscHZhbHVlIHx8XG4gICAgICB0aGlzLm9wdGlvbnMubXNnIHx8IHRoaXMub3B0aW9ucy5tZXNzYWdlO1xuICB9XG59XG4iXX0=