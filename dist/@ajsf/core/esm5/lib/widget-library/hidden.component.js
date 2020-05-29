/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
var HiddenComponent = /** @class */ (function () {
    function HiddenComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
    }
    /**
     * @return {?}
     */
    HiddenComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.jsf.initializeControl(this);
    };
    HiddenComponent.decorators = [
        { type: Component, args: [{
                    // tslint:disable-next-line:component-selector
                    selector: 'hidden-widget',
                    template: "\n    <input *ngIf=\"boundControl\"\n      [formControl]=\"formControl\"\n      [id]=\"'control' + layoutNode?._id\"\n      [name]=\"controlName\"\n      type=\"hidden\">\n    <input *ngIf=\"!boundControl\"\n      [disabled]=\"controlDisabled\"\n      [name]=\"controlName\"\n      [id]=\"'control' + layoutNode?._id\"\n      type=\"hidden\"\n      [value]=\"controlValue\">"
                }] }
    ];
    /** @nocollapse */
    HiddenComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    HiddenComponent.propDecorators = {
        layoutNode: [{ type: Input }],
        layoutIndex: [{ type: Input }],
        dataIndex: [{ type: Input }]
    };
    return HiddenComponent;
}());
export { HiddenComponent };
if (false) {
    /** @type {?} */
    HiddenComponent.prototype.formControl;
    /** @type {?} */
    HiddenComponent.prototype.controlName;
    /** @type {?} */
    HiddenComponent.prototype.controlValue;
    /** @type {?} */
    HiddenComponent.prototype.controlDisabled;
    /** @type {?} */
    HiddenComponent.prototype.boundControl;
    /** @type {?} */
    HiddenComponent.prototype.layoutNode;
    /** @type {?} */
    HiddenComponent.prototype.layoutIndex;
    /** @type {?} */
    HiddenComponent.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    HiddenComponent.prototype.jsf;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlkZGVuLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhanNmL2NvcmUvIiwic291cmNlcyI6WyJsaWIvd2lkZ2V0LWxpYnJhcnkvaGlkZGVuLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDekQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFHcEU7SUEwQkUseUJBQ1UsR0FBMEI7UUFBMUIsUUFBRyxHQUFILEdBQUcsQ0FBdUI7UUFQcEMsb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFDeEIsaUJBQVksR0FBRyxLQUFLLENBQUM7SUFPakIsQ0FBQzs7OztJQUVMLGtDQUFROzs7SUFBUjtRQUNFLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQzs7Z0JBaENGLFNBQVMsU0FBQzs7b0JBRVQsUUFBUSxFQUFFLGVBQWU7b0JBQ3pCLFFBQVEsRUFBRSx3WEFXa0I7aUJBQzdCOzs7O2dCQWxCUSxxQkFBcUI7Ozs2QkF5QjNCLEtBQUs7OEJBQ0wsS0FBSzs0QkFDTCxLQUFLOztJQVNSLHNCQUFDO0NBQUEsQUFqQ0QsSUFpQ0M7U0FqQlksZUFBZTs7O0lBQzFCLHNDQUE2Qjs7SUFDN0Isc0NBQW9COztJQUNwQix1Q0FBa0I7O0lBQ2xCLDBDQUF3Qjs7SUFDeEIsdUNBQXFCOztJQUNyQixxQ0FBeUI7O0lBQ3pCLHNDQUErQjs7SUFDL0Isb0NBQTZCOzs7OztJQUczQiw4QkFBa0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBYnN0cmFjdENvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEpzb25TY2hlbWFGb3JtU2VydmljZSB9IGZyb20gJy4uL2pzb24tc2NoZW1hLWZvcm0uc2VydmljZSc7XG5cblxuQENvbXBvbmVudCh7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjb21wb25lbnQtc2VsZWN0b3JcbiAgc2VsZWN0b3I6ICdoaWRkZW4td2lkZ2V0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8aW5wdXQgKm5nSWY9XCJib3VuZENvbnRyb2xcIlxuICAgICAgW2Zvcm1Db250cm9sXT1cImZvcm1Db250cm9sXCJcbiAgICAgIFtpZF09XCInY29udHJvbCcgKyBsYXlvdXROb2RlPy5faWRcIlxuICAgICAgW25hbWVdPVwiY29udHJvbE5hbWVcIlxuICAgICAgdHlwZT1cImhpZGRlblwiPlxuICAgIDxpbnB1dCAqbmdJZj1cIiFib3VuZENvbnRyb2xcIlxuICAgICAgW2Rpc2FibGVkXT1cImNvbnRyb2xEaXNhYmxlZFwiXG4gICAgICBbbmFtZV09XCJjb250cm9sTmFtZVwiXG4gICAgICBbaWRdPVwiJ2NvbnRyb2wnICsgbGF5b3V0Tm9kZT8uX2lkXCJcbiAgICAgIHR5cGU9XCJoaWRkZW5cIlxuICAgICAgW3ZhbHVlXT1cImNvbnRyb2xWYWx1ZVwiPmAsXG59KVxuZXhwb3J0IGNsYXNzIEhpZGRlbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGZvcm1Db250cm9sOiBBYnN0cmFjdENvbnRyb2w7XG4gIGNvbnRyb2xOYW1lOiBzdHJpbmc7XG4gIGNvbnRyb2xWYWx1ZTogYW55O1xuICBjb250cm9sRGlzYWJsZWQgPSBmYWxzZTtcbiAgYm91bmRDb250cm9sID0gZmFsc2U7XG4gIEBJbnB1dCgpIGxheW91dE5vZGU6IGFueTtcbiAgQElucHV0KCkgbGF5b3V0SW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBkYXRhSW5kZXg6IG51bWJlcltdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUganNmOiBKc29uU2NoZW1hRm9ybVNlcnZpY2VcbiAgKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmpzZi5pbml0aWFsaXplQ29udHJvbCh0aGlzKTtcbiAgfVxufVxuIl19