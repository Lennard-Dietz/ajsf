/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
var AddReferenceComponent = /** @class */ (function () {
    function AddReferenceComponent(jsf) {
        this.jsf = jsf;
    }
    /**
     * @return {?}
     */
    AddReferenceComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.options = this.layoutNode.options || {};
    };
    Object.defineProperty(AddReferenceComponent.prototype, "showAddButton", {
        get: /**
         * @return {?}
         */
        function () {
            return !this.layoutNode.arrayItem ||
                this.layoutIndex[this.layoutIndex.length - 1] < this.options.maxItems;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} event
     * @return {?}
     */
    AddReferenceComponent.prototype.addItem = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        event.preventDefault();
        this.jsf.addItem(this);
    };
    Object.defineProperty(AddReferenceComponent.prototype, "buttonText", {
        get: /**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var parent = {
                dataIndex: this.dataIndex.slice(0, -1),
                layoutIndex: this.layoutIndex.slice(0, -1),
                layoutNode: this.jsf.getParentNode(this)
            };
            return parent.layoutNode.add ||
                this.jsf.setArrayItemTitle(parent, this.layoutNode, this.itemCount);
        },
        enumerable: true,
        configurable: true
    });
    AddReferenceComponent.decorators = [
        { type: Component, args: [{
                    // tslint:disable-next-line:component-selector
                    selector: 'add-reference-widget',
                    template: "\n    <button *ngIf=\"showAddButton\"\n      [class]=\"options?.fieldHtmlClass || ''\"\n      [disabled]=\"options?.readonly\"\n      (click)=\"addItem($event)\">\n      <span *ngIf=\"options?.icon\" [class]=\"options?.icon\"></span>\n      <span *ngIf=\"options?.title\" [innerHTML]=\"buttonText\"></span>\n    </button>",
                    changeDetection: ChangeDetectionStrategy.Default
                }] }
    ];
    /** @nocollapse */
    AddReferenceComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    AddReferenceComponent.propDecorators = {
        layoutNode: [{ type: Input }],
        layoutIndex: [{ type: Input }],
        dataIndex: [{ type: Input }]
    };
    return AddReferenceComponent;
}());
export { AddReferenceComponent };
if (false) {
    /** @type {?} */
    AddReferenceComponent.prototype.options;
    /** @type {?} */
    AddReferenceComponent.prototype.itemCount;
    /** @type {?} */
    AddReferenceComponent.prototype.previousLayoutIndex;
    /** @type {?} */
    AddReferenceComponent.prototype.previousDataIndex;
    /** @type {?} */
    AddReferenceComponent.prototype.layoutNode;
    /** @type {?} */
    AddReferenceComponent.prototype.layoutIndex;
    /** @type {?} */
    AddReferenceComponent.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    AddReferenceComponent.prototype.jsf;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkLXJlZmVyZW5jZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWpzZi9jb3JlLyIsInNvdXJjZXMiOlsibGliL3dpZGdldC1saWJyYXJ5L2FkZC1yZWZlcmVuY2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxLQUFLLEVBRUosTUFBTSxlQUFlLENBQUM7QUFDekIsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFHcEU7SUFzQkUsK0JBQ1UsR0FBMEI7UUFBMUIsUUFBRyxHQUFILEdBQUcsQ0FBdUI7SUFDaEMsQ0FBQzs7OztJQUVMLHdDQUFROzs7SUFBUjtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFFRCxzQkFBSSxnREFBYTs7OztRQUFqQjtZQUNFLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVM7Z0JBQy9CLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7UUFDMUUsQ0FBQzs7O09BQUE7Ozs7O0lBRUQsdUNBQU87Ozs7SUFBUCxVQUFRLEtBQUs7UUFDWCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVELHNCQUFJLDZDQUFVOzs7O1FBQWQ7O2dCQUNRLE1BQU0sR0FBUTtnQkFDbEIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDdEMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDMUMsVUFBVSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQzthQUN6QztZQUNELE9BQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHO2dCQUMxQixJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN4RSxDQUFDOzs7T0FBQTs7Z0JBaERGLFNBQVMsU0FBQzs7b0JBRVQsUUFBUSxFQUFFLHNCQUFzQjtvQkFDaEMsUUFBUSxFQUFFLG1VQU9FO29CQUNWLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxPQUFPO2lCQUNuRDs7OztnQkFmUSxxQkFBcUI7Ozs2QkFxQjNCLEtBQUs7OEJBQ0wsS0FBSzs0QkFDTCxLQUFLOztJQTZCUiw0QkFBQztDQUFBLEFBakRELElBaURDO1NBcENZLHFCQUFxQjs7O0lBQ2hDLHdDQUFhOztJQUNiLDBDQUFrQjs7SUFDbEIsb0RBQThCOztJQUM5QixrREFBNEI7O0lBQzVCLDJDQUF5Qjs7SUFDekIsNENBQStCOztJQUMvQiwwQ0FBNkI7Ozs7O0lBRzNCLG9DQUFrQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBPbkluaXRcbiAgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEpzb25TY2hlbWFGb3JtU2VydmljZSB9IGZyb20gJy4uL2pzb24tc2NoZW1hLWZvcm0uc2VydmljZSc7XG5cblxuQENvbXBvbmVudCh7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjb21wb25lbnQtc2VsZWN0b3JcbiAgc2VsZWN0b3I6ICdhZGQtcmVmZXJlbmNlLXdpZGdldCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGJ1dHRvbiAqbmdJZj1cInNob3dBZGRCdXR0b25cIlxuICAgICAgW2NsYXNzXT1cIm9wdGlvbnM/LmZpZWxkSHRtbENsYXNzIHx8ICcnXCJcbiAgICAgIFtkaXNhYmxlZF09XCJvcHRpb25zPy5yZWFkb25seVwiXG4gICAgICAoY2xpY2spPVwiYWRkSXRlbSgkZXZlbnQpXCI+XG4gICAgICA8c3BhbiAqbmdJZj1cIm9wdGlvbnM/Lmljb25cIiBbY2xhc3NdPVwib3B0aW9ucz8uaWNvblwiPjwvc3Bhbj5cbiAgICAgIDxzcGFuICpuZ0lmPVwib3B0aW9ucz8udGl0bGVcIiBbaW5uZXJIVE1MXT1cImJ1dHRvblRleHRcIj48L3NwYW4+XG4gICAgPC9idXR0b24+YCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG59KVxuZXhwb3J0IGNsYXNzIEFkZFJlZmVyZW5jZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIG9wdGlvbnM6IGFueTtcbiAgaXRlbUNvdW50OiBudW1iZXI7XG4gIHByZXZpb3VzTGF5b3V0SW5kZXg6IG51bWJlcltdO1xuICBwcmV2aW91c0RhdGFJbmRleDogbnVtYmVyW107XG4gIEBJbnB1dCgpIGxheW91dE5vZGU6IGFueTtcbiAgQElucHV0KCkgbGF5b3V0SW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBkYXRhSW5kZXg6IG51bWJlcltdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUganNmOiBKc29uU2NoZW1hRm9ybVNlcnZpY2VcbiAgKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLmxheW91dE5vZGUub3B0aW9ucyB8fCB7fTtcbiAgfVxuXG4gIGdldCBzaG93QWRkQnV0dG9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5sYXlvdXROb2RlLmFycmF5SXRlbSB8fFxuICAgICAgdGhpcy5sYXlvdXRJbmRleFt0aGlzLmxheW91dEluZGV4Lmxlbmd0aCAtIDFdIDwgdGhpcy5vcHRpb25zLm1heEl0ZW1zO1xuICB9XG5cbiAgYWRkSXRlbShldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5qc2YuYWRkSXRlbSh0aGlzKTtcbiAgfVxuXG4gIGdldCBidXR0b25UZXh0KCk6IHN0cmluZyB7XG4gICAgY29uc3QgcGFyZW50OiBhbnkgPSB7XG4gICAgICBkYXRhSW5kZXg6IHRoaXMuZGF0YUluZGV4LnNsaWNlKDAsIC0xKSxcbiAgICAgIGxheW91dEluZGV4OiB0aGlzLmxheW91dEluZGV4LnNsaWNlKDAsIC0xKSxcbiAgICAgIGxheW91dE5vZGU6IHRoaXMuanNmLmdldFBhcmVudE5vZGUodGhpcylcbiAgICB9O1xuICAgIHJldHVybiBwYXJlbnQubGF5b3V0Tm9kZS5hZGQgfHxcbiAgICAgIHRoaXMuanNmLnNldEFycmF5SXRlbVRpdGxlKHBhcmVudCwgdGhpcy5sYXlvdXROb2RlLCB0aGlzLml0ZW1Db3VudCk7XG4gIH1cbn1cbiJdfQ==