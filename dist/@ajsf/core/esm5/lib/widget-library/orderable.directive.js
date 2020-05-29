/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, Input, NgZone } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
/**
 * OrderableDirective
 *
 * Enables array elements to be reordered by dragging and dropping.
 *
 * Only works for arrays that have at least two elements.
 *
 * Also detects arrays-within-arrays, and correctly moves either
 * the child array element or the parent array element,
 * depending on the drop targert.
 *
 * Listeners for movable element being dragged:
 * - dragstart: add 'dragging' class to element, set effectAllowed = 'move'
 * - dragover: set dropEffect = 'move'
 * - dragend: remove 'dragging' class from element
 *
 * Listeners for stationary items being dragged over:
 * - dragenter: add 'drag-target-...' classes to element
 * - dragleave: remove 'drag-target-...' classes from element
 * - drop: remove 'drag-target-...' classes from element, move dropped array item
 */
var OrderableDirective = /** @class */ (function () {
    function OrderableDirective(elementRef, jsf, ngZone) {
        this.elementRef = elementRef;
        this.jsf = jsf;
        this.ngZone = ngZone;
        this.overParentElement = false;
        this.overChildElement = false;
    }
    /**
     * @return {?}
     */
    OrderableDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.orderable && this.layoutNode && this.layoutIndex && this.dataIndex) {
            this.element = this.elementRef.nativeElement;
            this.element.draggable = true;
            this.arrayLayoutIndex = 'move:' + this.layoutIndex.slice(0, -1).toString();
            this.ngZone.runOutsideAngular((/**
             * @return {?}
             */
            function () {
                // Listeners for movable element being dragged:
                _this.element.addEventListener('dragstart', (/**
                 * @param {?} event
                 * @return {?}
                 */
                function (event) {
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text', '');
                    // Hack to bypass stupid HTML drag-and-drop dataTransfer protection
                    // so drag source info will be available on dragenter
                    /** @type {?} */
                    var sourceArrayIndex = _this.dataIndex[_this.dataIndex.length - 1];
                    sessionStorage.setItem(_this.arrayLayoutIndex, sourceArrayIndex + '');
                }));
                _this.element.addEventListener('dragover', (/**
                 * @param {?} event
                 * @return {?}
                 */
                function (event) {
                    if (event.preventDefault) {
                        event.preventDefault();
                    }
                    event.dataTransfer.dropEffect = 'move';
                    return false;
                }));
                // Listeners for stationary items being dragged over:
                _this.element.addEventListener('dragenter', (/**
                 * @param {?} event
                 * @return {?}
                 */
                function (event) {
                    // Part 1 of a hack, inspired by Dragster, to simulate mouseover and mouseout
                    // behavior while dragging items - http://bensmithett.github.io/dragster/
                    if (_this.overParentElement) {
                        return _this.overChildElement = true;
                    }
                    else {
                        _this.overParentElement = true;
                    }
                    /** @type {?} */
                    var sourceArrayIndex = sessionStorage.getItem(_this.arrayLayoutIndex);
                    if (sourceArrayIndex !== null) {
                        if (_this.dataIndex[_this.dataIndex.length - 1] < +sourceArrayIndex) {
                            _this.element.classList.add('drag-target-top');
                        }
                        else if (_this.dataIndex[_this.dataIndex.length - 1] > +sourceArrayIndex) {
                            _this.element.classList.add('drag-target-bottom');
                        }
                    }
                }));
                _this.element.addEventListener('dragleave', (/**
                 * @param {?} event
                 * @return {?}
                 */
                function (event) {
                    // Part 2 of the Dragster hack
                    if (_this.overChildElement) {
                        _this.overChildElement = false;
                    }
                    else if (_this.overParentElement) {
                        _this.overParentElement = false;
                    }
                    /** @type {?} */
                    var sourceArrayIndex = sessionStorage.getItem(_this.arrayLayoutIndex);
                    if (!_this.overParentElement && !_this.overChildElement && sourceArrayIndex !== null) {
                        _this.element.classList.remove('drag-target-top');
                        _this.element.classList.remove('drag-target-bottom');
                    }
                }));
                _this.element.addEventListener('drop', (/**
                 * @param {?} event
                 * @return {?}
                 */
                function (event) {
                    _this.element.classList.remove('drag-target-top');
                    _this.element.classList.remove('drag-target-bottom');
                    // Confirm that drop target is another item in the same array as source item
                    /** @type {?} */
                    var sourceArrayIndex = sessionStorage.getItem(_this.arrayLayoutIndex);
                    /** @type {?} */
                    var destArrayIndex = _this.dataIndex[_this.dataIndex.length - 1];
                    if (sourceArrayIndex !== null && +sourceArrayIndex !== destArrayIndex) {
                        // Move array item
                        _this.jsf.moveArrayItem(_this, +sourceArrayIndex, destArrayIndex);
                    }
                    sessionStorage.removeItem(_this.arrayLayoutIndex);
                    return false;
                }));
            }));
        }
    };
    OrderableDirective.decorators = [
        { type: Directive, args: [{
                    // tslint:disable-next-line:directive-selector
                    selector: '[orderable]',
                },] }
    ];
    /** @nocollapse */
    OrderableDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: JsonSchemaFormService },
        { type: NgZone }
    ]; };
    OrderableDirective.propDecorators = {
        orderable: [{ type: Input }],
        layoutNode: [{ type: Input }],
        layoutIndex: [{ type: Input }],
        dataIndex: [{ type: Input }]
    };
    return OrderableDirective;
}());
export { OrderableDirective };
if (false) {
    /** @type {?} */
    OrderableDirective.prototype.arrayLayoutIndex;
    /** @type {?} */
    OrderableDirective.prototype.element;
    /** @type {?} */
    OrderableDirective.prototype.overParentElement;
    /** @type {?} */
    OrderableDirective.prototype.overChildElement;
    /** @type {?} */
    OrderableDirective.prototype.orderable;
    /** @type {?} */
    OrderableDirective.prototype.layoutNode;
    /** @type {?} */
    OrderableDirective.prototype.layoutIndex;
    /** @type {?} */
    OrderableDirective.prototype.dataIndex;
    /**
     * @type {?}
     * @private
     */
    OrderableDirective.prototype.elementRef;
    /**
     * @type {?}
     * @private
     */
    OrderableDirective.prototype.jsf;
    /**
     * @type {?}
     * @private
     */
    OrderableDirective.prototype.ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXJhYmxlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhanNmL2NvcmUvIiwic291cmNlcyI6WyJsaWIvd2lkZ2V0LWxpYnJhcnkvb3JkZXJhYmxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUNMLE1BQU0sRUFFTCxNQUFNLGVBQWUsQ0FBQztBQUN6QixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCcEU7SUFjRSw0QkFDVSxVQUFzQixFQUN0QixHQUEwQixFQUMxQixNQUFjO1FBRmQsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixRQUFHLEdBQUgsR0FBRyxDQUF1QjtRQUMxQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBVnhCLHNCQUFpQixHQUFHLEtBQUssQ0FBQztRQUMxQixxQkFBZ0IsR0FBRyxLQUFLLENBQUM7SUFVckIsQ0FBQzs7OztJQUVMLHFDQUFROzs7SUFBUjtRQUFBLGlCQTZFQztRQTVFQyxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDM0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztZQUM3QyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDOUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUUzRSxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQjs7O1lBQUM7Z0JBRTVCLCtDQUErQztnQkFFL0MsS0FBSSxDQUFDLE9B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SUFHM0Isd0NBQThCOzs7OztJQUM5QixpQ0FBa0M7Ozs7O0lBQ2xDLG9DQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25Jbml0XG4gIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBKc29uU2NoZW1hRm9ybVNlcnZpY2UgfSBmcm9tICcuLi9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UnO1xuXG5cbi8qKlxuICogT3JkZXJhYmxlRGlyZWN0aXZlXG4gKlxuICogRW5hYmxlcyBhcnJheSBlbGVtZW50cyB0byBiZSByZW9yZGVyZWQgYnkgZHJhZ2dpbmcgYW5kIGRyb3BwaW5nLlxuICpcbiAqIE9ubHkgd29ya3MgZm9yIGFycmF5cyB0aGF0IGhhdmUgYXQgbGVhc3QgdHdvIGVsZW1lbnRzLlxuICpcbiAqIEFsc28gZGV0ZWN0cyBhcnJheXMtd2l0aGluLWFycmF5cywgYW5kIGNvcnJlY3RseSBtb3ZlcyBlaXRoZXJcbiAqIHRoZSBjaGlsZCBhcnJheSBlbGVtZW50IG9yIHRoZSBwYXJlbnQgYXJyYXkgZWxlbWVudCxcbiAqIGRlcGVuZGluZyBvbiB0aGUgZHJvcCB0YXJnZXJ0LlxuICpcbiAqIExpc3RlbmVycyBmb3IgbW92YWJsZSBlbGVtZW50IGJlaW5nIGRyYWdnZWQ6XG4gKiAtIGRyYWdzdGFydDogYWRkICdkcmFnZ2luZycgY2xhc3MgdG8gZWxlbWVudCwgc2V0IGVmZmVjdEFsbG93ZWQgPSAnbW92ZSdcbiAqIC0gZHJhZ292ZXI6IHNldCBkcm9wRWZmZWN0ID0gJ21vdmUnXG4gKiAtIGRyYWdlbmQ6IHJlbW92ZSAnZHJhZ2dpbmcnIGNsYXNzIGZyb20gZWxlbWVudFxuICpcbiAqIExpc3RlbmVycyBmb3Igc3RhdGlvbmFyeSBpdGVtcyBiZWluZyBkcmFnZ2VkIG92ZXI6XG4gKiAtIGRyYWdlbnRlcjogYWRkICdkcmFnLXRhcmdldC0uLi4nIGNsYXNzZXMgdG8gZWxlbWVudFxuICogLSBkcmFnbGVhdmU6IHJlbW92ZSAnZHJhZy10YXJnZXQtLi4uJyBjbGFzc2VzIGZyb20gZWxlbWVudFxuICogLSBkcm9wOiByZW1vdmUgJ2RyYWctdGFyZ2V0LS4uLicgY2xhc3NlcyBmcm9tIGVsZW1lbnQsIG1vdmUgZHJvcHBlZCBhcnJheSBpdGVtXG4gKi9cbkBEaXJlY3RpdmUoe1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGlyZWN0aXZlLXNlbGVjdG9yXG4gIHNlbGVjdG9yOiAnW29yZGVyYWJsZV0nLFxufSlcbmV4cG9ydCBjbGFzcyBPcmRlcmFibGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuICBhcnJheUxheW91dEluZGV4OiBzdHJpbmc7XG4gIGVsZW1lbnQ6IGFueTtcbiAgb3ZlclBhcmVudEVsZW1lbnQgPSBmYWxzZTtcbiAgb3ZlckNoaWxkRWxlbWVudCA9IGZhbHNlO1xuICBASW5wdXQoKSBvcmRlcmFibGU6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGxheW91dE5vZGU6IGFueTtcbiAgQElucHV0KCkgbGF5b3V0SW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBkYXRhSW5kZXg6IG51bWJlcltdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIGpzZjogSnNvblNjaGVtYUZvcm1TZXJ2aWNlLFxuICAgIHByaXZhdGUgbmdab25lOiBOZ1pvbmVcbiAgKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5vcmRlcmFibGUgJiYgdGhpcy5sYXlvdXROb2RlICYmIHRoaXMubGF5b3V0SW5kZXggJiYgdGhpcy5kYXRhSW5kZXgpIHtcbiAgICAgIHRoaXMuZWxlbWVudCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgdGhpcy5lbGVtZW50LmRyYWdnYWJsZSA9IHRydWU7XG4gICAgICB0aGlzLmFycmF5TGF5b3V0SW5kZXggPSAnbW92ZTonICsgdGhpcy5sYXlvdXRJbmRleC5zbGljZSgwLCAtMSkudG9TdHJpbmcoKTtcblxuICAgICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuXG4gICAgICAgIC8vIExpc3RlbmVycyBmb3IgbW92YWJsZSBlbGVtZW50IGJlaW5nIGRyYWdnZWQ6XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIChldmVudCkgPT4ge1xuICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gJ21vdmUnO1xuICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCd0ZXh0JywgJycpO1xuICAgICAgICAgIC8vIEhhY2sgdG8gYnlwYXNzIHN0dXBpZCBIVE1MIGRyYWctYW5kLWRyb3AgZGF0YVRyYW5zZmVyIHByb3RlY3Rpb25cbiAgICAgICAgICAvLyBzbyBkcmFnIHNvdXJjZSBpbmZvIHdpbGwgYmUgYXZhaWxhYmxlIG9uIGRyYWdlbnRlclxuICAgICAgICAgIGNvbnN0IHNvdXJjZUFycmF5SW5kZXggPSB0aGlzLmRhdGFJbmRleFt0aGlzLmRhdGFJbmRleC5sZW5ndGggLSAxXTtcbiAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHRoaXMuYXJyYXlMYXlvdXRJbmRleCwgc291cmNlQXJyYXlJbmRleCArICcnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGV2ZW50LnByZXZlbnREZWZhdWx0KSB7IGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IH1cbiAgICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdtb3ZlJztcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIExpc3RlbmVycyBmb3Igc3RhdGlvbmFyeSBpdGVtcyBiZWluZyBkcmFnZ2VkIG92ZXI6XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIChldmVudCkgPT4ge1xuICAgICAgICAgIC8vIFBhcnQgMSBvZiBhIGhhY2ssIGluc3BpcmVkIGJ5IERyYWdzdGVyLCB0byBzaW11bGF0ZSBtb3VzZW92ZXIgYW5kIG1vdXNlb3V0XG4gICAgICAgICAgLy8gYmVoYXZpb3Igd2hpbGUgZHJhZ2dpbmcgaXRlbXMgLSBodHRwOi8vYmVuc21pdGhldHQuZ2l0aHViLmlvL2RyYWdzdGVyL1xuICAgICAgICAgIGlmICh0aGlzLm92ZXJQYXJlbnRFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vdmVyQ2hpbGRFbGVtZW50ID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vdmVyUGFyZW50RWxlbWVudCA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3Qgc291cmNlQXJyYXlJbmRleCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0odGhpcy5hcnJheUxheW91dEluZGV4KTtcbiAgICAgICAgICBpZiAoc291cmNlQXJyYXlJbmRleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YUluZGV4W3RoaXMuZGF0YUluZGV4Lmxlbmd0aCAtIDFdIDwgK3NvdXJjZUFycmF5SW5kZXgpIHtcbiAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2RyYWctdGFyZ2V0LXRvcCcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRhdGFJbmRleFt0aGlzLmRhdGFJbmRleC5sZW5ndGggLSAxXSA+ICtzb3VyY2VBcnJheUluZGV4KSB7XG4gICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkcmFnLXRhcmdldC1ib3R0b20nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAvLyBQYXJ0IDIgb2YgdGhlIERyYWdzdGVyIGhhY2tcbiAgICAgICAgICBpZiAodGhpcy5vdmVyQ2hpbGRFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLm92ZXJDaGlsZEVsZW1lbnQgPSBmYWxzZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3ZlclBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMub3ZlclBhcmVudEVsZW1lbnQgPSBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBzb3VyY2VBcnJheUluZGV4ID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmFycmF5TGF5b3V0SW5kZXgpO1xuICAgICAgICAgIGlmICghdGhpcy5vdmVyUGFyZW50RWxlbWVudCAmJiAhdGhpcy5vdmVyQ2hpbGRFbGVtZW50ICYmIHNvdXJjZUFycmF5SW5kZXggIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnLXRhcmdldC10b3AnKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnLXRhcmdldC1ib3R0b20nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWctdGFyZ2V0LXRvcCcpO1xuICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnLXRhcmdldC1ib3R0b20nKTtcbiAgICAgICAgICAvLyBDb25maXJtIHRoYXQgZHJvcCB0YXJnZXQgaXMgYW5vdGhlciBpdGVtIGluIHRoZSBzYW1lIGFycmF5IGFzIHNvdXJjZSBpdGVtXG4gICAgICAgICAgY29uc3Qgc291cmNlQXJyYXlJbmRleCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0odGhpcy5hcnJheUxheW91dEluZGV4KTtcbiAgICAgICAgICBjb25zdCBkZXN0QXJyYXlJbmRleCA9IHRoaXMuZGF0YUluZGV4W3RoaXMuZGF0YUluZGV4Lmxlbmd0aCAtIDFdO1xuICAgICAgICAgIGlmIChzb3VyY2VBcnJheUluZGV4ICE9PSBudWxsICYmICtzb3VyY2VBcnJheUluZGV4ICE9PSBkZXN0QXJyYXlJbmRleCkge1xuICAgICAgICAgICAgLy8gTW92ZSBhcnJheSBpdGVtXG4gICAgICAgICAgICB0aGlzLmpzZi5tb3ZlQXJyYXlJdGVtKHRoaXMsICtzb3VyY2VBcnJheUluZGV4LCBkZXN0QXJyYXlJbmRleCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5hcnJheUxheW91dEluZGV4KTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==