/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { buildTitleMap } from '../shared';
import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
var CheckboxesComponent = /** @class */ (function () {
    function CheckboxesComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.checkboxList = [];
    }
    /**
     * @return {?}
     */
    CheckboxesComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.options = this.layoutNode.options || {};
        this.layoutOrientation = (this.layoutNode.type === 'checkboxes-inline' ||
            this.layoutNode.type === 'checkboxbuttons') ? 'horizontal' : 'vertical';
        this.jsf.initializeControl(this);
        this.checkboxList = buildTitleMap(this.options.titleMap || this.options.enumNames, this.options.enum, true);
        if (this.boundControl) {
            /** @type {?} */
            var formArray_1 = this.jsf.getFormControl(this);
            this.checkboxList.forEach((/**
             * @param {?} checkboxItem
             * @return {?}
             */
            function (checkboxItem) {
                return checkboxItem.checked = formArray_1.value.includes(checkboxItem.value);
            }));
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    CheckboxesComponent.prototype.updateValue = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var e_1, _a;
        try {
            for (var _b = tslib_1.__values(this.checkboxList), _c = _b.next(); !_c.done; _c = _b.next()) {
                var checkboxItem = _c.value;
                if (event.target.value === checkboxItem.value) {
                    checkboxItem.checked = event.target.checked;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (this.boundControl) {
            this.jsf.updateArrayCheckboxList(this, this.checkboxList);
        }
    };
    CheckboxesComponent.decorators = [
        { type: Component, args: [{
                    // tslint:disable-next-line:component-selector
                    selector: 'checkboxes-widget',
                    template: "\n    <label *ngIf=\"options?.title\"\n      [class]=\"options?.labelHtmlClass || ''\"\n      [style.display]=\"options?.notitle ? 'none' : ''\"\n      [innerHTML]=\"options?.title\"></label>\n\n    <!-- 'horizontal' = checkboxes-inline or checkboxbuttons -->\n    <div *ngIf=\"layoutOrientation === 'horizontal'\" [class]=\"options?.htmlClass || ''\">\n      <label *ngFor=\"let checkboxItem of checkboxList\"\n        [attr.for]=\"'control' + layoutNode?._id + '/' + checkboxItem.value\"\n        [class]=\"(options?.itemLabelHtmlClass || '') + (checkboxItem.checked ?\n          (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :\n          (' ' + (options?.style?.unselected || '')))\">\n        <input type=\"checkbox\"\n          [attr.required]=\"options?.required\"\n          [checked]=\"checkboxItem.checked\"\n          [class]=\"options?.fieldHtmlClass || ''\"\n          [disabled]=\"controlDisabled\"\n          [id]=\"'control' + layoutNode?._id + '/' + checkboxItem.value\"\n          [name]=\"checkboxItem?.name\"\n          [readonly]=\"options?.readonly ? 'readonly' : null\"\n          [value]=\"checkboxItem.value\"\n          (change)=\"updateValue($event)\">\n        <span [innerHTML]=\"checkboxItem.name\"></span>\n      </label>\n    </div>\n\n    <!-- 'vertical' = regular checkboxes -->\n    <div *ngIf=\"layoutOrientation === 'vertical'\">\n      <div *ngFor=\"let checkboxItem of checkboxList\" [class]=\"options?.htmlClass || ''\">\n        <label\n          [attr.for]=\"'control' + layoutNode?._id + '/' + checkboxItem.value\"\n          [class]=\"(options?.itemLabelHtmlClass || '') + (checkboxItem.checked ?\n            (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :\n            (' ' + (options?.style?.unselected || '')))\">\n          <input type=\"checkbox\"\n            [attr.required]=\"options?.required\"\n            [checked]=\"checkboxItem.checked\"\n            [class]=\"options?.fieldHtmlClass || ''\"\n            [disabled]=\"controlDisabled\"\n            [id]=\"options?.name + '/' + checkboxItem.value\"\n            [name]=\"checkboxItem?.name\"\n            [readonly]=\"options?.readonly ? 'readonly' : null\"\n            [value]=\"checkboxItem.value\"\n            (change)=\"updateValue($event)\">\n          <span [innerHTML]=\"checkboxItem?.name\"></span>\n        </label>\n      </div>\n    </div>"
                }] }
    ];
    /** @nocollapse */
    CheckboxesComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    CheckboxesComponent.propDecorators = {
        layoutNode: [{ type: Input }],
        layoutIndex: [{ type: Input }],
        dataIndex: [{ type: Input }]
    };
    return CheckboxesComponent;
}());
export { CheckboxesComponent };
if (false) {
    /** @type {?} */
    CheckboxesComponent.prototype.formControl;
    /** @type {?} */
    CheckboxesComponent.prototype.controlName;
    /** @type {?} */
    CheckboxesComponent.prototype.controlValue;
    /** @type {?} */
    CheckboxesComponent.prototype.controlDisabled;
    /** @type {?} */
    CheckboxesComponent.prototype.boundControl;
    /** @type {?} */
    CheckboxesComponent.prototype.options;
    /** @type {?} */
    CheckboxesComponent.prototype.layoutOrientation;
    /** @type {?} */
    CheckboxesComponent.prototype.formArray;
    /** @type {?} */
    CheckboxesComponent.prototype.checkboxList;
    /** @type {?} */
    CheckboxesComponent.prototype.layoutNode;
    /** @type {?} */
    CheckboxesComponent.prototype.layoutIndex;
    /** @type {?} */
    CheckboxesComponent.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    CheckboxesComponent.prototype.jsf;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3hlcy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWpzZi9jb3JlLyIsInNvdXJjZXMiOlsibGliL3dpZGdldC1saWJyYXJ5L2NoZWNrYm94ZXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUMxQyxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUN6RCxPQUFPLEVBQUUscUJBQXFCLEVBQWdCLE1BQU0sNkJBQTZCLENBQUM7QUFHbEY7SUFtRUUsNkJBQ1UsR0FBMEI7UUFBMUIsUUFBRyxHQUFILEdBQUcsQ0FBdUI7UUFYcEMsb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFDeEIsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFJckIsaUJBQVksR0FBbUIsRUFBRSxDQUFDO0lBTzlCLENBQUM7Ozs7SUFFTCxzQ0FBUTs7O0lBQVI7UUFDRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxtQkFBbUI7WUFDcEUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7UUFDMUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsWUFBWSxHQUFHLGFBQWEsQ0FDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUN6RSxDQUFDO1FBQ0YsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFOztnQkFDZixXQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDO1lBQy9DLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTzs7OztZQUFDLFVBQUEsWUFBWTtnQkFDcEMsT0FBQSxZQUFZLENBQUMsT0FBTyxHQUFHLFdBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7WUFBbkUsQ0FBbUUsRUFDcEUsQ0FBQztTQUNIO0lBQ0gsQ0FBQzs7Ozs7SUFFRCx5Q0FBVzs7OztJQUFYLFVBQVksS0FBSzs7O1lBQ2YsS0FBMkIsSUFBQSxLQUFBLGlCQUFBLElBQUksQ0FBQyxZQUFZLENBQUEsZ0JBQUEsNEJBQUU7Z0JBQXpDLElBQU0sWUFBWSxXQUFBO2dCQUNyQixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxLQUFLLFlBQVksQ0FBQyxLQUFLLEVBQUU7b0JBQzdDLFlBQVksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7aUJBQzdDO2FBQ0Y7Ozs7Ozs7OztRQUNELElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDM0Q7SUFDSCxDQUFDOztnQkFoR0YsU0FBUyxTQUFDOztvQkFFVCxRQUFRLEVBQUUsbUJBQW1CO29CQUM3QixRQUFRLEVBQUUsMjNFQWdERDtpQkFDVjs7OztnQkF2RFEscUJBQXFCOzs7NkJBa0UzQixLQUFLOzhCQUNMLEtBQUs7NEJBQ0wsS0FBSzs7SUFnQ1IsMEJBQUM7Q0FBQSxBQWpHRCxJQWlHQztTQTVDWSxtQkFBbUI7OztJQUM5QiwwQ0FBNkI7O0lBQzdCLDBDQUFvQjs7SUFDcEIsMkNBQWtCOztJQUNsQiw4Q0FBd0I7O0lBQ3hCLDJDQUFxQjs7SUFDckIsc0NBQWE7O0lBQ2IsZ0RBQTBCOztJQUMxQix3Q0FBMkI7O0lBQzNCLDJDQUFrQzs7SUFDbEMseUNBQXlCOztJQUN6QiwwQ0FBK0I7O0lBQy9CLHdDQUE2Qjs7Ozs7SUFHM0Isa0NBQWtDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWJzdHJhY3RDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgYnVpbGRUaXRsZU1hcCB9IGZyb20gJy4uL3NoYXJlZCc7XG5pbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEpzb25TY2hlbWFGb3JtU2VydmljZSwgVGl0bGVNYXBJdGVtIH0gZnJvbSAnLi4vanNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlJztcblxuXG5AQ29tcG9uZW50KHtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmNvbXBvbmVudC1zZWxlY3RvclxuICBzZWxlY3RvcjogJ2NoZWNrYm94ZXMtd2lkZ2V0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bGFiZWwgKm5nSWY9XCJvcHRpb25zPy50aXRsZVwiXG4gICAgICBbY2xhc3NdPVwib3B0aW9ucz8ubGFiZWxIdG1sQ2xhc3MgfHwgJydcIlxuICAgICAgW3N0eWxlLmRpc3BsYXldPVwib3B0aW9ucz8ubm90aXRsZSA/ICdub25lJyA6ICcnXCJcbiAgICAgIFtpbm5lckhUTUxdPVwib3B0aW9ucz8udGl0bGVcIj48L2xhYmVsPlxuXG4gICAgPCEtLSAnaG9yaXpvbnRhbCcgPSBjaGVja2JveGVzLWlubGluZSBvciBjaGVja2JveGJ1dHRvbnMgLS0+XG4gICAgPGRpdiAqbmdJZj1cImxheW91dE9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCdcIiBbY2xhc3NdPVwib3B0aW9ucz8uaHRtbENsYXNzIHx8ICcnXCI+XG4gICAgICA8bGFiZWwgKm5nRm9yPVwibGV0IGNoZWNrYm94SXRlbSBvZiBjaGVja2JveExpc3RcIlxuICAgICAgICBbYXR0ci5mb3JdPVwiJ2NvbnRyb2wnICsgbGF5b3V0Tm9kZT8uX2lkICsgJy8nICsgY2hlY2tib3hJdGVtLnZhbHVlXCJcbiAgICAgICAgW2NsYXNzXT1cIihvcHRpb25zPy5pdGVtTGFiZWxIdG1sQ2xhc3MgfHwgJycpICsgKGNoZWNrYm94SXRlbS5jaGVja2VkID9cbiAgICAgICAgICAoJyAnICsgKG9wdGlvbnM/LmFjdGl2ZUNsYXNzIHx8ICcnKSArICcgJyArIChvcHRpb25zPy5zdHlsZT8uc2VsZWN0ZWQgfHwgJycpKSA6XG4gICAgICAgICAgKCcgJyArIChvcHRpb25zPy5zdHlsZT8udW5zZWxlY3RlZCB8fCAnJykpKVwiPlxuICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICBbYXR0ci5yZXF1aXJlZF09XCJvcHRpb25zPy5yZXF1aXJlZFwiXG4gICAgICAgICAgW2NoZWNrZWRdPVwiY2hlY2tib3hJdGVtLmNoZWNrZWRcIlxuICAgICAgICAgIFtjbGFzc109XCJvcHRpb25zPy5maWVsZEh0bWxDbGFzcyB8fCAnJ1wiXG4gICAgICAgICAgW2Rpc2FibGVkXT1cImNvbnRyb2xEaXNhYmxlZFwiXG4gICAgICAgICAgW2lkXT1cIidjb250cm9sJyArIGxheW91dE5vZGU/Ll9pZCArICcvJyArIGNoZWNrYm94SXRlbS52YWx1ZVwiXG4gICAgICAgICAgW25hbWVdPVwiY2hlY2tib3hJdGVtPy5uYW1lXCJcbiAgICAgICAgICBbcmVhZG9ubHldPVwib3B0aW9ucz8ucmVhZG9ubHkgPyAncmVhZG9ubHknIDogbnVsbFwiXG4gICAgICAgICAgW3ZhbHVlXT1cImNoZWNrYm94SXRlbS52YWx1ZVwiXG4gICAgICAgICAgKGNoYW5nZSk9XCJ1cGRhdGVWYWx1ZSgkZXZlbnQpXCI+XG4gICAgICAgIDxzcGFuIFtpbm5lckhUTUxdPVwiY2hlY2tib3hJdGVtLm5hbWVcIj48L3NwYW4+XG4gICAgICA8L2xhYmVsPlxuICAgIDwvZGl2PlxuXG4gICAgPCEtLSAndmVydGljYWwnID0gcmVndWxhciBjaGVja2JveGVzIC0tPlxuICAgIDxkaXYgKm5nSWY9XCJsYXlvdXRPcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJ1wiPlxuICAgICAgPGRpdiAqbmdGb3I9XCJsZXQgY2hlY2tib3hJdGVtIG9mIGNoZWNrYm94TGlzdFwiIFtjbGFzc109XCJvcHRpb25zPy5odG1sQ2xhc3MgfHwgJydcIj5cbiAgICAgICAgPGxhYmVsXG4gICAgICAgICAgW2F0dHIuZm9yXT1cIidjb250cm9sJyArIGxheW91dE5vZGU/Ll9pZCArICcvJyArIGNoZWNrYm94SXRlbS52YWx1ZVwiXG4gICAgICAgICAgW2NsYXNzXT1cIihvcHRpb25zPy5pdGVtTGFiZWxIdG1sQ2xhc3MgfHwgJycpICsgKGNoZWNrYm94SXRlbS5jaGVja2VkID9cbiAgICAgICAgICAgICgnICcgKyAob3B0aW9ucz8uYWN0aXZlQ2xhc3MgfHwgJycpICsgJyAnICsgKG9wdGlvbnM/LnN0eWxlPy5zZWxlY3RlZCB8fCAnJykpIDpcbiAgICAgICAgICAgICgnICcgKyAob3B0aW9ucz8uc3R5bGU/LnVuc2VsZWN0ZWQgfHwgJycpKSlcIj5cbiAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgIFthdHRyLnJlcXVpcmVkXT1cIm9wdGlvbnM/LnJlcXVpcmVkXCJcbiAgICAgICAgICAgIFtjaGVja2VkXT1cImNoZWNrYm94SXRlbS5jaGVja2VkXCJcbiAgICAgICAgICAgIFtjbGFzc109XCJvcHRpb25zPy5maWVsZEh0bWxDbGFzcyB8fCAnJ1wiXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwiY29udHJvbERpc2FibGVkXCJcbiAgICAgICAgICAgIFtpZF09XCJvcHRpb25zPy5uYW1lICsgJy8nICsgY2hlY2tib3hJdGVtLnZhbHVlXCJcbiAgICAgICAgICAgIFtuYW1lXT1cImNoZWNrYm94SXRlbT8ubmFtZVwiXG4gICAgICAgICAgICBbcmVhZG9ubHldPVwib3B0aW9ucz8ucmVhZG9ubHkgPyAncmVhZG9ubHknIDogbnVsbFwiXG4gICAgICAgICAgICBbdmFsdWVdPVwiY2hlY2tib3hJdGVtLnZhbHVlXCJcbiAgICAgICAgICAgIChjaGFuZ2UpPVwidXBkYXRlVmFsdWUoJGV2ZW50KVwiPlxuICAgICAgICAgIDxzcGFuIFtpbm5lckhUTUxdPVwiY2hlY2tib3hJdGVtPy5uYW1lXCI+PC9zcGFuPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+YCxcbn0pXG5leHBvcnQgY2xhc3MgQ2hlY2tib3hlc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGZvcm1Db250cm9sOiBBYnN0cmFjdENvbnRyb2w7XG4gIGNvbnRyb2xOYW1lOiBzdHJpbmc7XG4gIGNvbnRyb2xWYWx1ZTogYW55O1xuICBjb250cm9sRGlzYWJsZWQgPSBmYWxzZTtcbiAgYm91bmRDb250cm9sID0gZmFsc2U7XG4gIG9wdGlvbnM6IGFueTtcbiAgbGF5b3V0T3JpZW50YXRpb246IHN0cmluZztcbiAgZm9ybUFycmF5OiBBYnN0cmFjdENvbnRyb2w7XG4gIGNoZWNrYm94TGlzdDogVGl0bGVNYXBJdGVtW10gPSBbXTtcbiAgQElucHV0KCkgbGF5b3V0Tm9kZTogYW55O1xuICBASW5wdXQoKSBsYXlvdXRJbmRleDogbnVtYmVyW107XG4gIEBJbnB1dCgpIGRhdGFJbmRleDogbnVtYmVyW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBqc2Y6IEpzb25TY2hlbWFGb3JtU2VydmljZVxuICApIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMubGF5b3V0Tm9kZS5vcHRpb25zIHx8IHt9O1xuICAgIHRoaXMubGF5b3V0T3JpZW50YXRpb24gPSAodGhpcy5sYXlvdXROb2RlLnR5cGUgPT09ICdjaGVja2JveGVzLWlubGluZScgfHxcbiAgICAgIHRoaXMubGF5b3V0Tm9kZS50eXBlID09PSAnY2hlY2tib3hidXR0b25zJykgPyAnaG9yaXpvbnRhbCcgOiAndmVydGljYWwnO1xuICAgIHRoaXMuanNmLmluaXRpYWxpemVDb250cm9sKHRoaXMpO1xuICAgIHRoaXMuY2hlY2tib3hMaXN0ID0gYnVpbGRUaXRsZU1hcChcbiAgICAgIHRoaXMub3B0aW9ucy50aXRsZU1hcCB8fCB0aGlzLm9wdGlvbnMuZW51bU5hbWVzLCB0aGlzLm9wdGlvbnMuZW51bSwgdHJ1ZVxuICAgICk7XG4gICAgaWYgKHRoaXMuYm91bmRDb250cm9sKSB7XG4gICAgICBjb25zdCBmb3JtQXJyYXkgPSB0aGlzLmpzZi5nZXRGb3JtQ29udHJvbCh0aGlzKTtcbiAgICAgIHRoaXMuY2hlY2tib3hMaXN0LmZvckVhY2goY2hlY2tib3hJdGVtID0+XG4gICAgICAgIGNoZWNrYm94SXRlbS5jaGVja2VkID0gZm9ybUFycmF5LnZhbHVlLmluY2x1ZGVzKGNoZWNrYm94SXRlbS52YWx1ZSlcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlVmFsdWUoZXZlbnQpIHtcbiAgICBmb3IgKGNvbnN0IGNoZWNrYm94SXRlbSBvZiB0aGlzLmNoZWNrYm94TGlzdCkge1xuICAgICAgaWYgKGV2ZW50LnRhcmdldC52YWx1ZSA9PT0gY2hlY2tib3hJdGVtLnZhbHVlKSB7XG4gICAgICAgIGNoZWNrYm94SXRlbS5jaGVja2VkID0gZXZlbnQudGFyZ2V0LmNoZWNrZWQ7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLmJvdW5kQ29udHJvbCkge1xuICAgICAgdGhpcy5qc2YudXBkYXRlQXJyYXlDaGVja2JveExpc3QodGhpcywgdGhpcy5jaGVja2JveExpc3QpO1xuICAgIH1cbiAgfVxufVxuIl19