/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
// TODO: Add this control
export class FileComponent {
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
FileComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'file-widget',
                template: ``
            }] }
];
/** @nocollapse */
FileComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
FileComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    FileComponent.prototype.formControl;
    /** @type {?} */
    FileComponent.prototype.controlName;
    /** @type {?} */
    FileComponent.prototype.controlValue;
    /** @type {?} */
    FileComponent.prototype.controlDisabled;
    /** @type {?} */
    FileComponent.prototype.boundControl;
    /** @type {?} */
    FileComponent.prototype.options;
    /** @type {?} */
    FileComponent.prototype.layoutNode;
    /** @type {?} */
    FileComponent.prototype.layoutIndex;
    /** @type {?} */
    FileComponent.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    FileComponent.prototype.jsf;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWpzZi9jb3JlLyIsInNvdXJjZXMiOlsibGliL3dpZGdldC1saWJyYXJ5L2ZpbGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUN6RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQzs7QUFVcEUsTUFBTSxPQUFPLGFBQWE7Ozs7SUFXeEIsWUFDVSxHQUEwQjtRQUExQixRQUFHLEdBQUgsR0FBRyxDQUF1QjtRQVJwQyxvQkFBZSxHQUFHLEtBQUssQ0FBQztRQUN4QixpQkFBWSxHQUFHLEtBQUssQ0FBQztJQVFqQixDQUFDOzs7O0lBRUwsUUFBUTtRQUNOLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQzs7Ozs7SUFFRCxXQUFXLENBQUMsS0FBSztRQUNmLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pELENBQUM7OztZQTNCRixTQUFTLFNBQUM7O2dCQUVULFFBQVEsRUFBRSxhQUFhO2dCQUN2QixRQUFRLEVBQUUsRUFBRTthQUNiOzs7O1lBVFEscUJBQXFCOzs7eUJBaUIzQixLQUFLOzBCQUNMLEtBQUs7d0JBQ0wsS0FBSzs7OztJQVJOLG9DQUE2Qjs7SUFDN0Isb0NBQW9COztJQUNwQixxQ0FBa0I7O0lBQ2xCLHdDQUF3Qjs7SUFDeEIscUNBQXFCOztJQUNyQixnQ0FBYTs7SUFDYixtQ0FBeUI7O0lBQ3pCLG9DQUErQjs7SUFDL0Isa0NBQTZCOzs7OztJQUczQiw0QkFBa0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBYnN0cmFjdENvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEpzb25TY2hlbWFGb3JtU2VydmljZSB9IGZyb20gJy4uL2pzb24tc2NoZW1hLWZvcm0uc2VydmljZSc7XG5cblxuLy8gVE9ETzogQWRkIHRoaXMgY29udHJvbFxuXG5AQ29tcG9uZW50KHtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmNvbXBvbmVudC1zZWxlY3RvclxuICBzZWxlY3RvcjogJ2ZpbGUtd2lkZ2V0JyxcbiAgdGVtcGxhdGU6IGBgLFxufSlcbmV4cG9ydCBjbGFzcyBGaWxlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgZm9ybUNvbnRyb2w6IEFic3RyYWN0Q29udHJvbDtcbiAgY29udHJvbE5hbWU6IHN0cmluZztcbiAgY29udHJvbFZhbHVlOiBhbnk7XG4gIGNvbnRyb2xEaXNhYmxlZCA9IGZhbHNlO1xuICBib3VuZENvbnRyb2wgPSBmYWxzZTtcbiAgb3B0aW9uczogYW55O1xuICBASW5wdXQoKSBsYXlvdXROb2RlOiBhbnk7XG4gIEBJbnB1dCgpIGxheW91dEluZGV4OiBudW1iZXJbXTtcbiAgQElucHV0KCkgZGF0YUluZGV4OiBudW1iZXJbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGpzZjogSnNvblNjaGVtYUZvcm1TZXJ2aWNlXG4gICkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5vcHRpb25zID0gdGhpcy5sYXlvdXROb2RlLm9wdGlvbnMgfHwge307XG4gICAgdGhpcy5qc2YuaW5pdGlhbGl6ZUNvbnRyb2wodGhpcyk7XG4gIH1cblxuICB1cGRhdGVWYWx1ZShldmVudCkge1xuICAgIHRoaXMuanNmLnVwZGF0ZVZhbHVlKHRoaXMsIGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gIH1cbn1cbiJdfQ==