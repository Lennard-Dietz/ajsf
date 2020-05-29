/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
var TabComponent = /** @class */ (function () {
    function TabComponent(jsf) {
        this.jsf = jsf;
    }
    /**
     * @return {?}
     */
    TabComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.options = this.layoutNode.options || {};
    };
    TabComponent.decorators = [
        { type: Component, args: [{
                    // tslint:disable-next-line:component-selector
                    selector: 'tab-widget',
                    template: "\n    <div [class]=\"options?.htmlClass || ''\">\n      <root-widget\n        [dataIndex]=\"dataIndex\"\n        [layoutIndex]=\"layoutIndex\"\n        [layout]=\"layoutNode.items\"></root-widget>\n    </div>"
                }] }
    ];
    /** @nocollapse */
    TabComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    TabComponent.propDecorators = {
        layoutNode: [{ type: Input }],
        layoutIndex: [{ type: Input }],
        dataIndex: [{ type: Input }]
    };
    return TabComponent;
}());
export { TabComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhanNmL2NvcmUvIiwic291cmNlcyI6WyJsaWIvd2lkZ2V0LWxpYnJhcnkvdGFiLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDekQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFHcEU7SUFpQkUsc0JBQ1UsR0FBMEI7UUFBMUIsUUFBRyxHQUFILEdBQUcsQ0FBdUI7SUFDaEMsQ0FBQzs7OztJQUVMLCtCQUFROzs7SUFBUjtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO0lBQy9DLENBQUM7O2dCQXZCRixTQUFTLFNBQUM7O29CQUVULFFBQVEsRUFBRSxZQUFZO29CQUN0QixRQUFRLEVBQUUsa05BTUQ7aUJBQ1Y7Ozs7Z0JBYlEscUJBQXFCOzs7NkJBZ0IzQixLQUFLOzhCQUNMLEtBQUs7NEJBQ0wsS0FBSzs7SUFTUixtQkFBQztDQUFBLEFBeEJELElBd0JDO1NBYlksWUFBWTs7O0lBQ3ZCLCtCQUFhOztJQUNiLGtDQUF5Qjs7SUFDekIsbUNBQStCOztJQUMvQixpQ0FBNkI7Ozs7O0lBRzNCLDJCQUFrQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIH0gZnJvbSAnLi4vanNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlJztcblxuXG5AQ29tcG9uZW50KHtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmNvbXBvbmVudC1zZWxlY3RvclxuICBzZWxlY3RvcjogJ3RhYi13aWRnZXQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgW2NsYXNzXT1cIm9wdGlvbnM/Lmh0bWxDbGFzcyB8fCAnJ1wiPlxuICAgICAgPHJvb3Qtd2lkZ2V0XG4gICAgICAgIFtkYXRhSW5kZXhdPVwiZGF0YUluZGV4XCJcbiAgICAgICAgW2xheW91dEluZGV4XT1cImxheW91dEluZGV4XCJcbiAgICAgICAgW2xheW91dF09XCJsYXlvdXROb2RlLml0ZW1zXCI+PC9yb290LXdpZGdldD5cbiAgICA8L2Rpdj5gLFxufSlcbmV4cG9ydCBjbGFzcyBUYWJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBvcHRpb25zOiBhbnk7XG4gIEBJbnB1dCgpIGxheW91dE5vZGU6IGFueTtcbiAgQElucHV0KCkgbGF5b3V0SW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBkYXRhSW5kZXg6IG51bWJlcltdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUganNmOiBKc29uU2NoZW1hRm9ybVNlcnZpY2VcbiAgKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLmxheW91dE5vZGUub3B0aW9ucyB8fCB7fTtcbiAgfVxufVxuIl19