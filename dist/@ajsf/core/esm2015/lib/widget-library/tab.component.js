/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
export class TabComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhanNmL2NvcmUvIiwic291cmNlcyI6WyJsaWIvd2lkZ2V0LWxpYnJhcnkvdGFiLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDekQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFjcEUsTUFBTSxPQUFPLFlBQVk7Ozs7SUFNdkIsWUFDVSxHQUEwQjtRQUExQixRQUFHLEdBQUgsR0FBRyxDQUF1QjtJQUNoQyxDQUFDOzs7O0lBRUwsUUFBUTtRQUNOLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO0lBQy9DLENBQUM7OztZQXZCRixTQUFTLFNBQUM7O2dCQUVULFFBQVEsRUFBRSxZQUFZO2dCQUN0QixRQUFRLEVBQUU7Ozs7OztXQU1EO2FBQ1Y7Ozs7WUFiUSxxQkFBcUI7Ozt5QkFnQjNCLEtBQUs7MEJBQ0wsS0FBSzt3QkFDTCxLQUFLOzs7O0lBSE4sK0JBQWE7O0lBQ2Isa0NBQXlCOztJQUN6QixtQ0FBK0I7O0lBQy9CLGlDQUE2Qjs7Ozs7SUFHM0IsMkJBQWtDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBKc29uU2NoZW1hRm9ybVNlcnZpY2UgfSBmcm9tICcuLi9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UnO1xuXG5cbkBDb21wb25lbnQoe1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y29tcG9uZW50LXNlbGVjdG9yXG4gIHNlbGVjdG9yOiAndGFiLXdpZGdldCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBbY2xhc3NdPVwib3B0aW9ucz8uaHRtbENsYXNzIHx8ICcnXCI+XG4gICAgICA8cm9vdC13aWRnZXRcbiAgICAgICAgW2RhdGFJbmRleF09XCJkYXRhSW5kZXhcIlxuICAgICAgICBbbGF5b3V0SW5kZXhdPVwibGF5b3V0SW5kZXhcIlxuICAgICAgICBbbGF5b3V0XT1cImxheW91dE5vZGUuaXRlbXNcIj48L3Jvb3Qtd2lkZ2V0PlxuICAgIDwvZGl2PmAsXG59KVxuZXhwb3J0IGNsYXNzIFRhYkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIG9wdGlvbnM6IGFueTtcbiAgQElucHV0KCkgbGF5b3V0Tm9kZTogYW55O1xuICBASW5wdXQoKSBsYXlvdXRJbmRleDogbnVtYmVyW107XG4gIEBJbnB1dCgpIGRhdGFJbmRleDogbnVtYmVyW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBqc2Y6IEpzb25TY2hlbWFGb3JtU2VydmljZVxuICApIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMubGF5b3V0Tm9kZS5vcHRpb25zIHx8IHt9O1xuICB9XG59XG4iXX0=