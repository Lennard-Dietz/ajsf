/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
export class RootComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
        this.jsf = jsf;
        this.isFlexItem = false;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    isDraggable(node) {
        return node.arrayItem && node.type !== '$ref' &&
            node.arrayItemType === 'list' && this.isOrderable !== false;
    }
    // Set attributes for flexbox child
    // (container attributes are set in section.component)
    /**
     * @param {?} node
     * @param {?} attribute
     * @return {?}
     */
    getFlexAttribute(node, attribute) {
        /** @type {?} */
        const index = ['flex-grow', 'flex-shrink', 'flex-basis'].indexOf(attribute);
        return ((node.options || {}).flex || '').split(/\s+/)[index] ||
            (node.options || {})[attribute] || ['1', '1', 'auto'][index];
    }
    /**
     * @param {?} layoutNode
     * @return {?}
     */
    showWidget(layoutNode) {
        return this.jsf.evaluateCondition(layoutNode, this.dataIndex);
    }
}
RootComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'root-widget',
                template: `
    <div *ngFor="let layoutItem of layout; let i = index"
      [class.form-flex-item]="isFlexItem"
      [style.align-self]="(layoutItem.options || {})['align-self']"
      [style.flex-basis]="getFlexAttribute(layoutItem, 'flex-basis')"
      [style.flex-grow]="getFlexAttribute(layoutItem, 'flex-grow')"
      [style.flex-shrink]="getFlexAttribute(layoutItem, 'flex-shrink')"
      [style.order]="(layoutItem.options || {}).order">
      <div
        [dataIndex]="layoutItem?.arrayItem ? (dataIndex || []).concat(i) : (dataIndex || [])"
        [layoutIndex]="(layoutIndex || []).concat(i)"
        [layoutNode]="layoutItem"
        [orderable]="isDraggable(layoutItem)">
        <select-framework-widget *ngIf="showWidget(layoutItem)"
          [dataIndex]="layoutItem?.arrayItem ? (dataIndex || []).concat(i) : (dataIndex || [])"
          [layoutIndex]="(layoutIndex || []).concat(i)"
          [layoutNode]="layoutItem"></select-framework-widget>
      </div>
    </div>`,
                styles: [`
    [draggable=true] {
      transition: all 150ms cubic-bezier(.4, 0, .2, 1);
    }
    [draggable=true]:hover {
      cursor: move;
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
      position: relative; z-index: 10;
      margin-top: -1px;
      margin-left: -1px;
      margin-right: 1px;
      margin-bottom: 1px;
    }
    [draggable=true].drag-target-top {
      box-shadow: 0 -2px 0 #000;
      position: relative; z-index: 20;
    }
    [draggable=true].drag-target-bottom {
      box-shadow: 0 2px 0 #000;
      position: relative; z-index: 20;
    }
  `]
            }] }
];
/** @nocollapse */
RootComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
RootComponent.propDecorators = {
    dataIndex: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    layout: [{ type: Input }],
    isOrderable: [{ type: Input }],
    isFlexItem: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    RootComponent.prototype.options;
    /** @type {?} */
    RootComponent.prototype.dataIndex;
    /** @type {?} */
    RootComponent.prototype.layoutIndex;
    /** @type {?} */
    RootComponent.prototype.layout;
    /** @type {?} */
    RootComponent.prototype.isOrderable;
    /** @type {?} */
    RootComponent.prototype.isFlexItem;
    /**
     * @type {?}
     * @private
     */
    RootComponent.prototype.jsf;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWpzZi9jb3JlLyIsInNvdXJjZXMiOlsibGliL3dpZGdldC1saWJyYXJ5L3Jvb3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqRCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQWdEcEUsTUFBTSxPQUFPLGFBQWE7Ozs7SUFReEIsWUFDVSxHQUEwQjtRQUExQixRQUFHLEdBQUgsR0FBRyxDQUF1QjtRQUgzQixlQUFVLEdBQUcsS0FBSyxDQUFDO0lBSXhCLENBQUM7Ozs7O0lBRUwsV0FBVyxDQUFDLElBQVM7UUFDbkIsT0FBTyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTTtZQUMzQyxJQUFJLENBQUMsYUFBYSxLQUFLLE1BQU0sSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLEtBQUssQ0FBQztJQUNoRSxDQUFDOzs7Ozs7OztJQUlELGdCQUFnQixDQUFDLElBQVMsRUFBRSxTQUFpQjs7Y0FDckMsS0FBSyxHQUFHLENBQUMsV0FBVyxFQUFFLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO1FBQzNFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDMUQsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqRSxDQUFDOzs7OztJQUVELFVBQVUsQ0FBQyxVQUFlO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7OztZQXhFRixTQUFTLFNBQUM7O2dCQUVULFFBQVEsRUFBRSxhQUFhO2dCQUN2QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7OztXQWtCRDt5QkFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUJSO2FBQ0Y7Ozs7WUEvQ1EscUJBQXFCOzs7d0JBa0QzQixLQUFLOzBCQUNMLEtBQUs7cUJBQ0wsS0FBSzswQkFDTCxLQUFLO3lCQUNMLEtBQUs7Ozs7SUFMTixnQ0FBYTs7SUFDYixrQ0FBNkI7O0lBQzdCLG9DQUErQjs7SUFDL0IsK0JBQXVCOztJQUN2QixvQ0FBOEI7O0lBQzlCLG1DQUE0Qjs7Ozs7SUFHMUIsNEJBQWtDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIH0gZnJvbSAnLi4vanNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlJztcblxuXG5AQ29tcG9uZW50KHtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmNvbXBvbmVudC1zZWxlY3RvclxuICBzZWxlY3RvcjogJ3Jvb3Qtd2lkZ2V0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2ICpuZ0Zvcj1cImxldCBsYXlvdXRJdGVtIG9mIGxheW91dDsgbGV0IGkgPSBpbmRleFwiXG4gICAgICBbY2xhc3MuZm9ybS1mbGV4LWl0ZW1dPVwiaXNGbGV4SXRlbVwiXG4gICAgICBbc3R5bGUuYWxpZ24tc2VsZl09XCIobGF5b3V0SXRlbS5vcHRpb25zIHx8IHt9KVsnYWxpZ24tc2VsZiddXCJcbiAgICAgIFtzdHlsZS5mbGV4LWJhc2lzXT1cImdldEZsZXhBdHRyaWJ1dGUobGF5b3V0SXRlbSwgJ2ZsZXgtYmFzaXMnKVwiXG4gICAgICBbc3R5bGUuZmxleC1ncm93XT1cImdldEZsZXhBdHRyaWJ1dGUobGF5b3V0SXRlbSwgJ2ZsZXgtZ3JvdycpXCJcbiAgICAgIFtzdHlsZS5mbGV4LXNocmlua109XCJnZXRGbGV4QXR0cmlidXRlKGxheW91dEl0ZW0sICdmbGV4LXNocmluaycpXCJcbiAgICAgIFtzdHlsZS5vcmRlcl09XCIobGF5b3V0SXRlbS5vcHRpb25zIHx8IHt9KS5vcmRlclwiPlxuICAgICAgPGRpdlxuICAgICAgICBbZGF0YUluZGV4XT1cImxheW91dEl0ZW0/LmFycmF5SXRlbSA/IChkYXRhSW5kZXggfHwgW10pLmNvbmNhdChpKSA6IChkYXRhSW5kZXggfHwgW10pXCJcbiAgICAgICAgW2xheW91dEluZGV4XT1cIihsYXlvdXRJbmRleCB8fCBbXSkuY29uY2F0KGkpXCJcbiAgICAgICAgW2xheW91dE5vZGVdPVwibGF5b3V0SXRlbVwiXG4gICAgICAgIFtvcmRlcmFibGVdPVwiaXNEcmFnZ2FibGUobGF5b3V0SXRlbSlcIj5cbiAgICAgICAgPHNlbGVjdC1mcmFtZXdvcmstd2lkZ2V0ICpuZ0lmPVwic2hvd1dpZGdldChsYXlvdXRJdGVtKVwiXG4gICAgICAgICAgW2RhdGFJbmRleF09XCJsYXlvdXRJdGVtPy5hcnJheUl0ZW0gPyAoZGF0YUluZGV4IHx8IFtdKS5jb25jYXQoaSkgOiAoZGF0YUluZGV4IHx8IFtdKVwiXG4gICAgICAgICAgW2xheW91dEluZGV4XT1cIihsYXlvdXRJbmRleCB8fCBbXSkuY29uY2F0KGkpXCJcbiAgICAgICAgICBbbGF5b3V0Tm9kZV09XCJsYXlvdXRJdGVtXCI+PC9zZWxlY3QtZnJhbWV3b3JrLXdpZGdldD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PmAsXG4gIHN0eWxlczogW2BcbiAgICBbZHJhZ2dhYmxlPXRydWVdIHtcbiAgICAgIHRyYW5zaXRpb246IGFsbCAxNTBtcyBjdWJpYy1iZXppZXIoLjQsIDAsIC4yLCAxKTtcbiAgICB9XG4gICAgW2RyYWdnYWJsZT10cnVlXTpob3ZlciB7XG4gICAgICBjdXJzb3I6IG1vdmU7XG4gICAgICBib3gtc2hhZG93OiAycHggMnB4IDRweCByZ2JhKDAsIDAsIDAsIDAuMik7XG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7IHotaW5kZXg6IDEwO1xuICAgICAgbWFyZ2luLXRvcDogLTFweDtcbiAgICAgIG1hcmdpbi1sZWZ0OiAtMXB4O1xuICAgICAgbWFyZ2luLXJpZ2h0OiAxcHg7XG4gICAgICBtYXJnaW4tYm90dG9tOiAxcHg7XG4gICAgfVxuICAgIFtkcmFnZ2FibGU9dHJ1ZV0uZHJhZy10YXJnZXQtdG9wIHtcbiAgICAgIGJveC1zaGFkb3c6IDAgLTJweCAwICMwMDA7XG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7IHotaW5kZXg6IDIwO1xuICAgIH1cbiAgICBbZHJhZ2dhYmxlPXRydWVdLmRyYWctdGFyZ2V0LWJvdHRvbSB7XG4gICAgICBib3gtc2hhZG93OiAwIDJweCAwICMwMDA7XG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7IHotaW5kZXg6IDIwO1xuICAgIH1cbiAgYF0sXG59KVxuZXhwb3J0IGNsYXNzIFJvb3RDb21wb25lbnQge1xuICBvcHRpb25zOiBhbnk7XG4gIEBJbnB1dCgpIGRhdGFJbmRleDogbnVtYmVyW107XG4gIEBJbnB1dCgpIGxheW91dEluZGV4OiBudW1iZXJbXTtcbiAgQElucHV0KCkgbGF5b3V0OiBhbnlbXTtcbiAgQElucHV0KCkgaXNPcmRlcmFibGU6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGlzRmxleEl0ZW0gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGpzZjogSnNvblNjaGVtYUZvcm1TZXJ2aWNlXG4gICkgeyB9XG5cbiAgaXNEcmFnZ2FibGUobm9kZTogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIG5vZGUuYXJyYXlJdGVtICYmIG5vZGUudHlwZSAhPT0gJyRyZWYnICYmXG4gICAgICBub2RlLmFycmF5SXRlbVR5cGUgPT09ICdsaXN0JyAmJiB0aGlzLmlzT3JkZXJhYmxlICE9PSBmYWxzZTtcbiAgfVxuXG4gIC8vIFNldCBhdHRyaWJ1dGVzIGZvciBmbGV4Ym94IGNoaWxkXG4gIC8vIChjb250YWluZXIgYXR0cmlidXRlcyBhcmUgc2V0IGluIHNlY3Rpb24uY29tcG9uZW50KVxuICBnZXRGbGV4QXR0cmlidXRlKG5vZGU6IGFueSwgYXR0cmlidXRlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBpbmRleCA9IFsnZmxleC1ncm93JywgJ2ZsZXgtc2hyaW5rJywgJ2ZsZXgtYmFzaXMnXS5pbmRleE9mKGF0dHJpYnV0ZSk7XG4gICAgcmV0dXJuICgobm9kZS5vcHRpb25zIHx8IHt9KS5mbGV4IHx8ICcnKS5zcGxpdCgvXFxzKy8pW2luZGV4XSB8fFxuICAgICAgKG5vZGUub3B0aW9ucyB8fCB7fSlbYXR0cmlidXRlXSB8fCBbJzEnLCAnMScsICdhdXRvJ11baW5kZXhdO1xuICB9XG5cbiAgc2hvd1dpZGdldChsYXlvdXROb2RlOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5qc2YuZXZhbHVhdGVDb25kaXRpb24obGF5b3V0Tm9kZSwgdGhpcy5kYXRhSW5kZXgpO1xuICB9XG59XG4iXX0=