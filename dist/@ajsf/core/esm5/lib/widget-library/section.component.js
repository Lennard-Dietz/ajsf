/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
var SectionComponent = /** @class */ (function () {
    function SectionComponent(jsf) {
        this.jsf = jsf;
        this.expanded = true;
    }
    Object.defineProperty(SectionComponent.prototype, "sectionTitle", {
        get: /**
         * @return {?}
         */
        function () {
            return this.options.notitle ? null : this.jsf.setItemTitle(this);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    SectionComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.jsf.initializeControl(this);
        this.options = this.layoutNode.options || {};
        this.expanded = typeof this.options.expanded === 'boolean' ?
            this.options.expanded : !this.options.expandable;
        switch (this.layoutNode.type) {
            case 'fieldset':
            case 'array':
            case 'tab':
            case 'advancedfieldset':
            case 'authfieldset':
            case 'optionfieldset':
            case 'selectfieldset':
                this.containerType = 'fieldset';
                break;
            default: // 'div', 'flex', 'section', 'conditional', 'actions', 'tagsinput'
                this.containerType = 'div';
                break;
        }
    };
    /**
     * @return {?}
     */
    SectionComponent.prototype.toggleExpanded = /**
     * @return {?}
     */
    function () {
        if (this.options.expandable) {
            this.expanded = !this.expanded;
        }
    };
    // Set attributes for flexbox container
    // (child attributes are set in root.component)
    // Set attributes for flexbox container
    // (child attributes are set in root.component)
    /**
     * @param {?} attribute
     * @return {?}
     */
    SectionComponent.prototype.getFlexAttribute = 
    // Set attributes for flexbox container
    // (child attributes are set in root.component)
    /**
     * @param {?} attribute
     * @return {?}
     */
    function (attribute) {
        /** @type {?} */
        var flexActive = this.layoutNode.type === 'flex' ||
            !!this.options.displayFlex ||
            this.options.display === 'flex';
        if (attribute !== 'flex' && !flexActive) {
            return null;
        }
        switch (attribute) {
            case 'is-flex':
                return flexActive;
            case 'display':
                return flexActive ? 'flex' : 'initial';
            case 'flex-direction':
            case 'flex-wrap':
                /** @type {?} */
                var index = ['flex-direction', 'flex-wrap'].indexOf(attribute);
                return (this.options['flex-flow'] || '').split(/\s+/)[index] ||
                    this.options[attribute] || ['column', 'nowrap'][index];
            case 'justify-content':
            case 'align-items':
            case 'align-content':
                return this.options[attribute];
        }
    };
    SectionComponent.decorators = [
        { type: Component, args: [{
                    // tslint:disable-next-line:component-selector
                    selector: 'section-widget',
                    template: "\n    <div *ngIf=\"containerType === 'div'\"\n      [class]=\"options?.htmlClass || ''\"\n      [class.expandable]=\"options?.expandable && !expanded\"\n      [class.expanded]=\"options?.expandable && expanded\">\n      <label *ngIf=\"sectionTitle\"\n        class=\"legend\"\n        [class]=\"options?.labelHtmlClass || ''\"\n        [innerHTML]=\"sectionTitle\"\n        (click)=\"toggleExpanded()\"></label>\n      <root-widget *ngIf=\"expanded\"\n        [dataIndex]=\"dataIndex\"\n        [layout]=\"layoutNode.items\"\n        [layoutIndex]=\"layoutIndex\"\n        [isFlexItem]=\"getFlexAttribute('is-flex')\"\n        [isOrderable]=\"options?.orderable\"\n        [class.form-flex-column]=\"getFlexAttribute('flex-direction') === 'column'\"\n        [class.form-flex-row]=\"getFlexAttribute('flex-direction') === 'row'\"\n        [style.align-content]=\"getFlexAttribute('align-content')\"\n        [style.align-items]=\"getFlexAttribute('align-items')\"\n        [style.display]=\"getFlexAttribute('display')\"\n        [style.flex-direction]=\"getFlexAttribute('flex-direction')\"\n        [style.flex-wrap]=\"getFlexAttribute('flex-wrap')\"\n        [style.justify-content]=\"getFlexAttribute('justify-content')\"></root-widget>\n    </div>\n    <fieldset *ngIf=\"containerType === 'fieldset'\"\n      [class]=\"options?.htmlClass || ''\"\n      [class.expandable]=\"options?.expandable && !expanded\"\n      [class.expanded]=\"options?.expandable && expanded\"\n      [disabled]=\"options?.readonly\">\n      <legend *ngIf=\"sectionTitle\"\n        class=\"legend\"\n        [class]=\"options?.labelHtmlClass || ''\"\n        [innerHTML]=\"sectionTitle\"\n        (click)=\"toggleExpanded()\"></legend>\n      <div *ngIf=\"options?.messageLocation !== 'bottom'\">\n        <p *ngIf=\"options?.description\"\n        class=\"help-block\"\n        [class]=\"options?.labelHelpBlockClass || ''\"\n        [innerHTML]=\"options?.description\"></p>\n      </div>\n      <root-widget *ngIf=\"expanded\"\n        [dataIndex]=\"dataIndex\"\n        [layout]=\"layoutNode.items\"\n        [layoutIndex]=\"layoutIndex\"\n        [isFlexItem]=\"getFlexAttribute('is-flex')\"\n        [isOrderable]=\"options?.orderable\"\n        [class.form-flex-column]=\"getFlexAttribute('flex-direction') === 'column'\"\n        [class.form-flex-row]=\"getFlexAttribute('flex-direction') === 'row'\"\n        [style.align-content]=\"getFlexAttribute('align-content')\"\n        [style.align-items]=\"getFlexAttribute('align-items')\"\n        [style.display]=\"getFlexAttribute('display')\"\n        [style.flex-direction]=\"getFlexAttribute('flex-direction')\"\n        [style.flex-wrap]=\"getFlexAttribute('flex-wrap')\"\n        [style.justify-content]=\"getFlexAttribute('justify-content')\"></root-widget>\n      <div *ngIf=\"options?.messageLocation === 'bottom'\">\n        <p *ngIf=\"options?.description\"\n        class=\"help-block\"\n        [class]=\"options?.labelHelpBlockClass || ''\"\n        [innerHTML]=\"options?.description\"></p>\n      </div>\n    </fieldset>",
                    styles: ["\n    .legend { font-weight: bold; }\n    .expandable > legend:before, .expandable > label:before  { content: '\u25B6'; padding-right: .3em; }\n    .expanded > legend:before, .expanded > label:before  { content: '\u25BC'; padding-right: .2em; }\n  "]
                }] }
    ];
    /** @nocollapse */
    SectionComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    SectionComponent.propDecorators = {
        layoutNode: [{ type: Input }],
        layoutIndex: [{ type: Input }],
        dataIndex: [{ type: Input }]
    };
    return SectionComponent;
}());
export { SectionComponent };
if (false) {
    /** @type {?} */
    SectionComponent.prototype.options;
    /** @type {?} */
    SectionComponent.prototype.expanded;
    /** @type {?} */
    SectionComponent.prototype.containerType;
    /** @type {?} */
    SectionComponent.prototype.layoutNode;
    /** @type {?} */
    SectionComponent.prototype.layoutIndex;
    /** @type {?} */
    SectionComponent.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    SectionComponent.prototype.jsf;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWpzZi9jb3JlLyIsInNvdXJjZXMiOlsibGliL3dpZGdldC1saWJyYXJ5L3NlY3Rpb24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUN6RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUdwRTtJQStFRSwwQkFDVSxHQUEwQjtRQUExQixRQUFHLEdBQUgsR0FBRyxDQUF1QjtRQVBwQyxhQUFRLEdBQUcsSUFBSSxDQUFDO0lBUVosQ0FBQztJQUVMLHNCQUFJLDBDQUFZOzs7O1FBQWhCO1lBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuRSxDQUFDOzs7T0FBQTs7OztJQUVELG1DQUFROzs7SUFBUjtRQUNFLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQyxDQUFDO1lBQzFELElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO1FBQ25ELFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUU7WUFDNUIsS0FBSyxVQUFVLENBQUM7WUFBQyxLQUFLLE9BQU8sQ0FBQztZQUFDLEtBQUssS0FBSyxDQUFDO1lBQUMsS0FBSyxrQkFBa0IsQ0FBQztZQUNuRSxLQUFLLGNBQWMsQ0FBQztZQUFDLEtBQUssZ0JBQWdCLENBQUM7WUFBQyxLQUFLLGdCQUFnQjtnQkFDL0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUM7Z0JBQ2xDLE1BQU07WUFDTixTQUFTLGtFQUFrRTtnQkFDekUsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7Z0JBQzdCLE1BQU07U0FDUDtJQUNILENBQUM7Ozs7SUFFRCx5Q0FBYzs7O0lBQWQ7UUFDRSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO1lBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7U0FBRTtJQUNsRSxDQUFDO0lBRUQsdUNBQXVDO0lBQ3ZDLCtDQUErQzs7Ozs7OztJQUMvQywyQ0FBZ0I7Ozs7Ozs7SUFBaEIsVUFBaUIsU0FBaUI7O1lBQzFCLFVBQVUsR0FDZCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxNQUFNO1lBQy9CLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssTUFBTTtRQUNqQyxJQUFJLFNBQVMsS0FBSyxNQUFNLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFBRSxPQUFPLElBQUksQ0FBQztTQUFFO1FBQ3pELFFBQVEsU0FBUyxFQUFFO1lBQ2pCLEtBQUssU0FBUztnQkFDWixPQUFPLFVBQVUsQ0FBQztZQUNwQixLQUFLLFNBQVM7Z0JBQ1osT0FBTyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQ3pDLEtBQUssZ0JBQWdCLENBQUM7WUFBQyxLQUFLLFdBQVc7O29CQUMvQixLQUFLLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO2dCQUNoRSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDO29CQUMxRCxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNELEtBQUssaUJBQWlCLENBQUM7WUFBQyxLQUFLLGFBQWEsQ0FBQztZQUFDLEtBQUssZUFBZTtnQkFDOUQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ2xDO0lBQ0gsQ0FBQzs7Z0JBL0hGLFNBQVMsU0FBQzs7b0JBRVQsUUFBUSxFQUFFLGdCQUFnQjtvQkFDMUIsUUFBUSxFQUFFLGlnR0E2REk7NkJBQ0wsMFBBSVI7aUJBQ0Y7Ozs7Z0JBekVRLHFCQUFxQjs7OzZCQThFM0IsS0FBSzs4QkFDTCxLQUFLOzRCQUNMLEtBQUs7O0lBbURSLHVCQUFDO0NBQUEsQUFoSUQsSUFnSUM7U0F6RFksZ0JBQWdCOzs7SUFDM0IsbUNBQWE7O0lBQ2Isb0NBQWdCOztJQUNoQix5Q0FBc0I7O0lBQ3RCLHNDQUF5Qjs7SUFDekIsdUNBQStCOztJQUMvQixxQ0FBNkI7Ozs7O0lBRzNCLCtCQUFrQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIH0gZnJvbSAnLi4vanNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlJztcblxuXG5AQ29tcG9uZW50KHtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmNvbXBvbmVudC1zZWxlY3RvclxuICBzZWxlY3RvcjogJ3NlY3Rpb24td2lkZ2V0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2ICpuZ0lmPVwiY29udGFpbmVyVHlwZSA9PT0gJ2RpdidcIlxuICAgICAgW2NsYXNzXT1cIm9wdGlvbnM/Lmh0bWxDbGFzcyB8fCAnJ1wiXG4gICAgICBbY2xhc3MuZXhwYW5kYWJsZV09XCJvcHRpb25zPy5leHBhbmRhYmxlICYmICFleHBhbmRlZFwiXG4gICAgICBbY2xhc3MuZXhwYW5kZWRdPVwib3B0aW9ucz8uZXhwYW5kYWJsZSAmJiBleHBhbmRlZFwiPlxuICAgICAgPGxhYmVsICpuZ0lmPVwic2VjdGlvblRpdGxlXCJcbiAgICAgICAgY2xhc3M9XCJsZWdlbmRcIlxuICAgICAgICBbY2xhc3NdPVwib3B0aW9ucz8ubGFiZWxIdG1sQ2xhc3MgfHwgJydcIlxuICAgICAgICBbaW5uZXJIVE1MXT1cInNlY3Rpb25UaXRsZVwiXG4gICAgICAgIChjbGljayk9XCJ0b2dnbGVFeHBhbmRlZCgpXCI+PC9sYWJlbD5cbiAgICAgIDxyb290LXdpZGdldCAqbmdJZj1cImV4cGFuZGVkXCJcbiAgICAgICAgW2RhdGFJbmRleF09XCJkYXRhSW5kZXhcIlxuICAgICAgICBbbGF5b3V0XT1cImxheW91dE5vZGUuaXRlbXNcIlxuICAgICAgICBbbGF5b3V0SW5kZXhdPVwibGF5b3V0SW5kZXhcIlxuICAgICAgICBbaXNGbGV4SXRlbV09XCJnZXRGbGV4QXR0cmlidXRlKCdpcy1mbGV4JylcIlxuICAgICAgICBbaXNPcmRlcmFibGVdPVwib3B0aW9ucz8ub3JkZXJhYmxlXCJcbiAgICAgICAgW2NsYXNzLmZvcm0tZmxleC1jb2x1bW5dPVwiZ2V0RmxleEF0dHJpYnV0ZSgnZmxleC1kaXJlY3Rpb24nKSA9PT0gJ2NvbHVtbidcIlxuICAgICAgICBbY2xhc3MuZm9ybS1mbGV4LXJvd109XCJnZXRGbGV4QXR0cmlidXRlKCdmbGV4LWRpcmVjdGlvbicpID09PSAncm93J1wiXG4gICAgICAgIFtzdHlsZS5hbGlnbi1jb250ZW50XT1cImdldEZsZXhBdHRyaWJ1dGUoJ2FsaWduLWNvbnRlbnQnKVwiXG4gICAgICAgIFtzdHlsZS5hbGlnbi1pdGVtc109XCJnZXRGbGV4QXR0cmlidXRlKCdhbGlnbi1pdGVtcycpXCJcbiAgICAgICAgW3N0eWxlLmRpc3BsYXldPVwiZ2V0RmxleEF0dHJpYnV0ZSgnZGlzcGxheScpXCJcbiAgICAgICAgW3N0eWxlLmZsZXgtZGlyZWN0aW9uXT1cImdldEZsZXhBdHRyaWJ1dGUoJ2ZsZXgtZGlyZWN0aW9uJylcIlxuICAgICAgICBbc3R5bGUuZmxleC13cmFwXT1cImdldEZsZXhBdHRyaWJ1dGUoJ2ZsZXgtd3JhcCcpXCJcbiAgICAgICAgW3N0eWxlLmp1c3RpZnktY29udGVudF09XCJnZXRGbGV4QXR0cmlidXRlKCdqdXN0aWZ5LWNvbnRlbnQnKVwiPjwvcm9vdC13aWRnZXQ+XG4gICAgPC9kaXY+XG4gICAgPGZpZWxkc2V0ICpuZ0lmPVwiY29udGFpbmVyVHlwZSA9PT0gJ2ZpZWxkc2V0J1wiXG4gICAgICBbY2xhc3NdPVwib3B0aW9ucz8uaHRtbENsYXNzIHx8ICcnXCJcbiAgICAgIFtjbGFzcy5leHBhbmRhYmxlXT1cIm9wdGlvbnM/LmV4cGFuZGFibGUgJiYgIWV4cGFuZGVkXCJcbiAgICAgIFtjbGFzcy5leHBhbmRlZF09XCJvcHRpb25zPy5leHBhbmRhYmxlICYmIGV4cGFuZGVkXCJcbiAgICAgIFtkaXNhYmxlZF09XCJvcHRpb25zPy5yZWFkb25seVwiPlxuICAgICAgPGxlZ2VuZCAqbmdJZj1cInNlY3Rpb25UaXRsZVwiXG4gICAgICAgIGNsYXNzPVwibGVnZW5kXCJcbiAgICAgICAgW2NsYXNzXT1cIm9wdGlvbnM/LmxhYmVsSHRtbENsYXNzIHx8ICcnXCJcbiAgICAgICAgW2lubmVySFRNTF09XCJzZWN0aW9uVGl0bGVcIlxuICAgICAgICAoY2xpY2spPVwidG9nZ2xlRXhwYW5kZWQoKVwiPjwvbGVnZW5kPlxuICAgICAgPGRpdiAqbmdJZj1cIm9wdGlvbnM/Lm1lc3NhZ2VMb2NhdGlvbiAhPT0gJ2JvdHRvbSdcIj5cbiAgICAgICAgPHAgKm5nSWY9XCJvcHRpb25zPy5kZXNjcmlwdGlvblwiXG4gICAgICAgIGNsYXNzPVwiaGVscC1ibG9ja1wiXG4gICAgICAgIFtjbGFzc109XCJvcHRpb25zPy5sYWJlbEhlbHBCbG9ja0NsYXNzIHx8ICcnXCJcbiAgICAgICAgW2lubmVySFRNTF09XCJvcHRpb25zPy5kZXNjcmlwdGlvblwiPjwvcD5cbiAgICAgIDwvZGl2PlxuICAgICAgPHJvb3Qtd2lkZ2V0ICpuZ0lmPVwiZXhwYW5kZWRcIlxuICAgICAgICBbZGF0YUluZGV4XT1cImRhdGFJbmRleFwiXG4gICAgICAgIFtsYXlvdXRdPVwibGF5b3V0Tm9kZS5pdGVtc1wiXG4gICAgICAgIFtsYXlvdXRJbmRleF09XCJsYXlvdXRJbmRleFwiXG4gICAgICAgIFtpc0ZsZXhJdGVtXT1cImdldEZsZXhBdHRyaWJ1dGUoJ2lzLWZsZXgnKVwiXG4gICAgICAgIFtpc09yZGVyYWJsZV09XCJvcHRpb25zPy5vcmRlcmFibGVcIlxuICAgICAgICBbY2xhc3MuZm9ybS1mbGV4LWNvbHVtbl09XCJnZXRGbGV4QXR0cmlidXRlKCdmbGV4LWRpcmVjdGlvbicpID09PSAnY29sdW1uJ1wiXG4gICAgICAgIFtjbGFzcy5mb3JtLWZsZXgtcm93XT1cImdldEZsZXhBdHRyaWJ1dGUoJ2ZsZXgtZGlyZWN0aW9uJykgPT09ICdyb3cnXCJcbiAgICAgICAgW3N0eWxlLmFsaWduLWNvbnRlbnRdPVwiZ2V0RmxleEF0dHJpYnV0ZSgnYWxpZ24tY29udGVudCcpXCJcbiAgICAgICAgW3N0eWxlLmFsaWduLWl0ZW1zXT1cImdldEZsZXhBdHRyaWJ1dGUoJ2FsaWduLWl0ZW1zJylcIlxuICAgICAgICBbc3R5bGUuZGlzcGxheV09XCJnZXRGbGV4QXR0cmlidXRlKCdkaXNwbGF5JylcIlxuICAgICAgICBbc3R5bGUuZmxleC1kaXJlY3Rpb25dPVwiZ2V0RmxleEF0dHJpYnV0ZSgnZmxleC1kaXJlY3Rpb24nKVwiXG4gICAgICAgIFtzdHlsZS5mbGV4LXdyYXBdPVwiZ2V0RmxleEF0dHJpYnV0ZSgnZmxleC13cmFwJylcIlxuICAgICAgICBbc3R5bGUuanVzdGlmeS1jb250ZW50XT1cImdldEZsZXhBdHRyaWJ1dGUoJ2p1c3RpZnktY29udGVudCcpXCI+PC9yb290LXdpZGdldD5cbiAgICAgIDxkaXYgKm5nSWY9XCJvcHRpb25zPy5tZXNzYWdlTG9jYXRpb24gPT09ICdib3R0b20nXCI+XG4gICAgICAgIDxwICpuZ0lmPVwib3B0aW9ucz8uZGVzY3JpcHRpb25cIlxuICAgICAgICBjbGFzcz1cImhlbHAtYmxvY2tcIlxuICAgICAgICBbY2xhc3NdPVwib3B0aW9ucz8ubGFiZWxIZWxwQmxvY2tDbGFzcyB8fCAnJ1wiXG4gICAgICAgIFtpbm5lckhUTUxdPVwib3B0aW9ucz8uZGVzY3JpcHRpb25cIj48L3A+XG4gICAgICA8L2Rpdj5cbiAgICA8L2ZpZWxkc2V0PmAsXG4gIHN0eWxlczogW2BcbiAgICAubGVnZW5kIHsgZm9udC13ZWlnaHQ6IGJvbGQ7IH1cbiAgICAuZXhwYW5kYWJsZSA+IGxlZ2VuZDpiZWZvcmUsIC5leHBhbmRhYmxlID4gbGFiZWw6YmVmb3JlICB7IGNvbnRlbnQ6ICfilrYnOyBwYWRkaW5nLXJpZ2h0OiAuM2VtOyB9XG4gICAgLmV4cGFuZGVkID4gbGVnZW5kOmJlZm9yZSwgLmV4cGFuZGVkID4gbGFiZWw6YmVmb3JlICB7IGNvbnRlbnQ6ICfilrwnOyBwYWRkaW5nLXJpZ2h0OiAuMmVtOyB9XG4gIGBdLFxufSlcbmV4cG9ydCBjbGFzcyBTZWN0aW9uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgb3B0aW9uczogYW55O1xuICBleHBhbmRlZCA9IHRydWU7XG4gIGNvbnRhaW5lclR5cGU6IHN0cmluZztcbiAgQElucHV0KCkgbGF5b3V0Tm9kZTogYW55O1xuICBASW5wdXQoKSBsYXlvdXRJbmRleDogbnVtYmVyW107XG4gIEBJbnB1dCgpIGRhdGFJbmRleDogbnVtYmVyW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBqc2Y6IEpzb25TY2hlbWFGb3JtU2VydmljZVxuICApIHsgfVxuXG4gIGdldCBzZWN0aW9uVGl0bGUoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ub3RpdGxlID8gbnVsbCA6IHRoaXMuanNmLnNldEl0ZW1UaXRsZSh0aGlzKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuanNmLmluaXRpYWxpemVDb250cm9sKHRoaXMpO1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMubGF5b3V0Tm9kZS5vcHRpb25zIHx8IHt9O1xuICAgIHRoaXMuZXhwYW5kZWQgPSB0eXBlb2YgdGhpcy5vcHRpb25zLmV4cGFuZGVkID09PSAnYm9vbGVhbicgP1xuICAgICAgdGhpcy5vcHRpb25zLmV4cGFuZGVkIDogIXRoaXMub3B0aW9ucy5leHBhbmRhYmxlO1xuICAgIHN3aXRjaCAodGhpcy5sYXlvdXROb2RlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2ZpZWxkc2V0JzogY2FzZSAnYXJyYXknOiBjYXNlICd0YWInOiBjYXNlICdhZHZhbmNlZGZpZWxkc2V0JzpcbiAgICAgIGNhc2UgJ2F1dGhmaWVsZHNldCc6IGNhc2UgJ29wdGlvbmZpZWxkc2V0JzogY2FzZSAnc2VsZWN0ZmllbGRzZXQnOlxuICAgICAgICB0aGlzLmNvbnRhaW5lclR5cGUgPSAnZmllbGRzZXQnO1xuICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OiAvLyAnZGl2JywgJ2ZsZXgnLCAnc2VjdGlvbicsICdjb25kaXRpb25hbCcsICdhY3Rpb25zJywgJ3RhZ3NpbnB1dCdcbiAgICAgICAgdGhpcy5jb250YWluZXJUeXBlID0gJ2Rpdic7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB0b2dnbGVFeHBhbmRlZCgpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmV4cGFuZGFibGUpIHsgdGhpcy5leHBhbmRlZCA9ICF0aGlzLmV4cGFuZGVkOyB9XG4gIH1cblxuICAvLyBTZXQgYXR0cmlidXRlcyBmb3IgZmxleGJveCBjb250YWluZXJcbiAgLy8gKGNoaWxkIGF0dHJpYnV0ZXMgYXJlIHNldCBpbiByb290LmNvbXBvbmVudClcbiAgZ2V0RmxleEF0dHJpYnV0ZShhdHRyaWJ1dGU6IHN0cmluZykge1xuICAgIGNvbnN0IGZsZXhBY3RpdmU6IGJvb2xlYW4gPVxuICAgICAgdGhpcy5sYXlvdXROb2RlLnR5cGUgPT09ICdmbGV4JyB8fFxuICAgICAgISF0aGlzLm9wdGlvbnMuZGlzcGxheUZsZXggfHxcbiAgICAgIHRoaXMub3B0aW9ucy5kaXNwbGF5ID09PSAnZmxleCc7XG4gICAgaWYgKGF0dHJpYnV0ZSAhPT0gJ2ZsZXgnICYmICFmbGV4QWN0aXZlKSB7IHJldHVybiBudWxsOyB9XG4gICAgc3dpdGNoIChhdHRyaWJ1dGUpIHtcbiAgICAgIGNhc2UgJ2lzLWZsZXgnOlxuICAgICAgICByZXR1cm4gZmxleEFjdGl2ZTtcbiAgICAgIGNhc2UgJ2Rpc3BsYXknOlxuICAgICAgICByZXR1cm4gZmxleEFjdGl2ZSA/ICdmbGV4JyA6ICdpbml0aWFsJztcbiAgICAgIGNhc2UgJ2ZsZXgtZGlyZWN0aW9uJzogY2FzZSAnZmxleC13cmFwJzpcbiAgICAgICAgY29uc3QgaW5kZXggPSBbJ2ZsZXgtZGlyZWN0aW9uJywgJ2ZsZXgtd3JhcCddLmluZGV4T2YoYXR0cmlidXRlKTtcbiAgICAgICAgcmV0dXJuICh0aGlzLm9wdGlvbnNbJ2ZsZXgtZmxvdyddIHx8ICcnKS5zcGxpdCgvXFxzKy8pW2luZGV4XSB8fFxuICAgICAgICAgIHRoaXMub3B0aW9uc1thdHRyaWJ1dGVdIHx8IFsnY29sdW1uJywgJ25vd3JhcCddW2luZGV4XTtcbiAgICAgIGNhc2UgJ2p1c3RpZnktY29udGVudCc6IGNhc2UgJ2FsaWduLWl0ZW1zJzogY2FzZSAnYWxpZ24tY29udGVudCc6XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnNbYXR0cmlidXRlXTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==