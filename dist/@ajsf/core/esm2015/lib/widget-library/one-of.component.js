/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
// TODO: Add this control
export class OneOfComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    updateValue(event) {
        this.jsf.updateValue(this, event.target.value);
    }
}
OneOfComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'one-of-widget',
                template: ``
            }] }
];
/** @nocollapse */
OneOfComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
OneOfComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    OneOfComponent.prototype.formControl;
    /** @type {?} */
    OneOfComponent.prototype.controlName;
    /** @type {?} */
    OneOfComponent.prototype.controlValue;
    /** @type {?} */
    OneOfComponent.prototype.controlDisabled;
    /** @type {?} */
    OneOfComponent.prototype.boundControl;
    /** @type {?} */
    OneOfComponent.prototype.options;
    /** @type {?} */
    OneOfComponent.prototype.layoutNode;
    /** @type {?} */
    OneOfComponent.prototype.layoutIndex;
    /** @type {?} */
    OneOfComponent.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    OneOfComponent.prototype.jsf;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib25lLW9mLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhanNmL2NvcmUvIiwic291cmNlcyI6WyJsaWIvd2lkZ2V0LWxpYnJhcnkvb25lLW9mLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFHekQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7O0FBU3BFLE1BQU0sT0FBTyxjQUFjOzs7O0lBV3pCLFlBQ1UsR0FBMEI7UUFBMUIsUUFBRyxHQUFILEdBQUcsQ0FBdUI7UUFScEMsb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFDeEIsaUJBQVksR0FBRyxLQUFLLENBQUM7SUFRakIsQ0FBQzs7OztJQUVMLFFBQVE7UUFDTixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLENBQUM7Ozs7O0lBRUQsV0FBVyxDQUFDLEtBQUs7UUFDZixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqRCxDQUFDOzs7WUEzQkYsU0FBUyxTQUFDOztnQkFFVCxRQUFRLEVBQUUsZUFBZTtnQkFDekIsUUFBUSxFQUFFLEVBQUU7YUFDYjs7OztZQVJRLHFCQUFxQjs7O3lCQWdCM0IsS0FBSzswQkFDTCxLQUFLO3dCQUNMLEtBQUs7Ozs7SUFSTixxQ0FBNkI7O0lBQzdCLHFDQUFvQjs7SUFDcEIsc0NBQWtCOztJQUNsQix5Q0FBd0I7O0lBQ3hCLHNDQUFxQjs7SUFDckIsaUNBQWE7O0lBQ2Isb0NBQXlCOztJQUN6QixxQ0FBK0I7O0lBQy9CLG1DQUE2Qjs7Ozs7SUFHM0IsNkJBQWtDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBYnN0cmFjdENvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IEpzb25TY2hlbWFGb3JtU2VydmljZSB9IGZyb20gJy4uL2pzb24tc2NoZW1hLWZvcm0uc2VydmljZSc7XG5cbi8vIFRPRE86IEFkZCB0aGlzIGNvbnRyb2xcblxuQENvbXBvbmVudCh7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjb21wb25lbnQtc2VsZWN0b3JcbiAgc2VsZWN0b3I6ICdvbmUtb2Ytd2lkZ2V0JyxcbiAgdGVtcGxhdGU6IGBgLFxufSlcbmV4cG9ydCBjbGFzcyBPbmVPZkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGZvcm1Db250cm9sOiBBYnN0cmFjdENvbnRyb2w7XG4gIGNvbnRyb2xOYW1lOiBzdHJpbmc7XG4gIGNvbnRyb2xWYWx1ZTogYW55O1xuICBjb250cm9sRGlzYWJsZWQgPSBmYWxzZTtcbiAgYm91bmRDb250cm9sID0gZmFsc2U7XG4gIG9wdGlvbnM6IGFueTtcbiAgQElucHV0KCkgbGF5b3V0Tm9kZTogYW55O1xuICBASW5wdXQoKSBsYXlvdXRJbmRleDogbnVtYmVyW107XG4gIEBJbnB1dCgpIGRhdGFJbmRleDogbnVtYmVyW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBqc2Y6IEpzb25TY2hlbWFGb3JtU2VydmljZVxuICApIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMubGF5b3V0Tm9kZS5vcHRpb25zIHx8IHt9O1xuICAgIHRoaXMuanNmLmluaXRpYWxpemVDb250cm9sKHRoaXMpO1xuICB9XG5cbiAgdXBkYXRlVmFsdWUoZXZlbnQpIHtcbiAgICB0aGlzLmpzZi51cGRhdGVWYWx1ZSh0aGlzLCBldmVudC50YXJnZXQudmFsdWUpO1xuICB9XG59XG4iXX0=