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
export class OrderableDirective {
    /**
     * @param {?} elementRef
     * @param {?} jsf
     * @param {?} ngZone
     */
    constructor(elementRef, jsf, ngZone) {
        this.elementRef = elementRef;
        this.jsf = jsf;
        this.ngZone = ngZone;
        this.overParentElement = false;
        this.overChildElement = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.orderable && this.layoutNode && this.layoutIndex && this.dataIndex) {
            this.element = this.elementRef.nativeElement;
            this.element.draggable = true;
            this.arrayLayoutIndex = 'move:' + this.layoutIndex.slice(0, -1).toString();
            this.ngZone.runOutsideAngular((/**
             * @return {?}
             */
            () => {
                // Listeners for movable element being dragged:
                this.element.addEventListener('dragstart', (/**
                 * @param {?} event
                 * @return {?}
                 */
                (event) => {
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text', '');
                    // Hack to bypass stupid HTML drag-and-drop dataTransfer protection
                    // so drag source info will be available on dragenter
                    /** @type {?} */
                    const sourceArrayIndex = this.dataIndex[this.dataIndex.length - 1];
                    sessionStorage.setItem(this.arrayLayoutIndex, sourceArrayIndex + '');
                }));
                this.element.addEventListener('dragover', (/**
                 * @param {?} event
                 * @return {?}
                 */
                (event) => {
                    if (event.preventDefault) {
                        event.preventDefault();
                    }
                    event.dataTransfer.dropEffect = 'move';
                    return false;
                }));
                // Listeners for stationary items being dragged over:
                this.element.addEventListener('dragenter', (/**
                 * @param {?} event
                 * @return {?}
                 */
                (event) => {
                    // Part 1 of a hack, inspired by Dragster, to simulate mouseover and mouseout
                    // behavior while dragging items - http://bensmithett.github.io/dragster/
                    if (this.overParentElement) {
                        return this.overChildElement = true;
                    }
                    else {
                        this.overParentElement = true;
                    }
                    /** @type {?} */
                    const sourceArrayIndex = sessionStorage.getItem(this.arrayLayoutIndex);
                    if (sourceArrayIndex !== null) {
                        if (this.dataIndex[this.dataIndex.length - 1] < +sourceArrayIndex) {
                            this.element.classList.add('drag-target-top');
                        }
                        else if (this.dataIndex[this.dataIndex.length - 1] > +sourceArrayIndex) {
                            this.element.classList.add('drag-target-bottom');
                        }
                    }
                }));
                this.element.addEventListener('dragleave', (/**
                 * @param {?} event
                 * @return {?}
                 */
                (event) => {
                    // Part 2 of the Dragster hack
                    if (this.overChildElement) {
                        this.overChildElement = false;
                    }
                    else if (this.overParentElement) {
                        this.overParentElement = false;
                    }
                    /** @type {?} */
                    const sourceArrayIndex = sessionStorage.getItem(this.arrayLayoutIndex);
                    if (!this.overParentElement && !this.overChildElement && sourceArrayIndex !== null) {
                        this.element.classList.remove('drag-target-top');
                        this.element.classList.remove('drag-target-bottom');
                    }
                }));
                this.element.addEventListener('drop', (/**
                 * @param {?} event
                 * @return {?}
                 */
                (event) => {
                    this.element.classList.remove('drag-target-top');
                    this.element.classList.remove('drag-target-bottom');
                    // Confirm that drop target is another item in the same array as source item
                    /** @type {?} */
                    const sourceArrayIndex = sessionStorage.getItem(this.arrayLayoutIndex);
                    /** @type {?} */
                    const destArrayIndex = this.dataIndex[this.dataIndex.length - 1];
                    if (sourceArrayIndex !== null && +sourceArrayIndex !== destArrayIndex) {
                        // Move array item
                        this.jsf.moveArrayItem(this, +sourceArrayIndex, destArrayIndex);
                    }
                    sessionStorage.removeItem(this.arrayLayoutIndex);
                    return false;
                }));
            }));
        }
    }
}
OrderableDirective.decorators = [
    { type: Directive, args: [{
                // tslint:disable-next-line:directive-selector
                selector: '[orderable]',
            },] }
];
/** @nocollapse */
OrderableDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: JsonSchemaFormService },
    { type: NgZone }
];
OrderableDirective.propDecorators = {
    orderable: [{ type: Input }],
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXJhYmxlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhanNmL2NvcmUvIiwic291cmNlcyI6WyJsaWIvd2lkZ2V0LWxpYnJhcnkvb3JkZXJhYmxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUNMLE1BQU0sRUFFTCxNQUFNLGVBQWUsQ0FBQztBQUN6QixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRCcEUsTUFBTSxPQUFPLGtCQUFrQjs7Ozs7O0lBVTdCLFlBQ1UsVUFBc0IsRUFDdEIsR0FBMEIsRUFDMUIsTUFBYztRQUZkLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsUUFBRyxHQUFILEdBQUcsQ0FBdUI7UUFDMUIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQVZ4QixzQkFBaUIsR0FBRyxLQUFLLENBQUM7UUFDMUIscUJBQWdCLEdBQUcsS0FBSyxDQUFDO0lBVXJCLENBQUM7Ozs7SUFFTCxRQUFRO1FBQ04sSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQzNFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7WUFDN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQzlCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7WUFFM0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUI7OztZQUFDLEdBQUcsRUFBRTtnQkFFakMsK0NBQStDO2dCQUUvQyxJ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L0IsdUNBQTZCOzs7OztJQUczQix3Q0FBOEI7Ozs7O0lBQzlCLGlDQUFrQzs7Ozs7SUFDbEMsb0NBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkluaXRcbiAgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEpzb25TY2hlbWFGb3JtU2VydmljZSB9IGZyb20gJy4uL2pzb24tc2NoZW1hLWZvcm0uc2VydmljZSc7XG5cblxuLyoqXG4gKiBPcmRlcmFibGVEaXJlY3RpdmVcbiAqXG4gKiBFbmFibGVzIGFycmF5IGVsZW1lbnRzIHRvIGJlIHJlb3JkZXJlZCBieSBkcmFnZ2luZyBhbmQgZHJvcHBpbmcuXG4gKlxuICogT25seSB3b3JrcyBmb3IgYXJyYXlzIHRoYXQgaGF2ZSBhdCBsZWFzdCB0d28gZWxlbWVudHMuXG4gKlxuICogQWxzbyBkZXRlY3RzIGFycmF5cy13aXRoaW4tYXJyYXlzLCBhbmQgY29ycmVjdGx5IG1vdmVzIGVpdGhlclxuICogdGhlIGNoaWxkIGFycmF5IGVsZW1lbnQgb3IgdGhlIHBhcmVudCBhcnJheSBlbGVtZW50LFxuICogZGVwZW5kaW5nIG9uIHRoZSBkcm9wIHRhcmdlcnQuXG4gKlxuICogTGlzdGVuZXJzIGZvciBtb3ZhYmxlIGVsZW1lbnQgYmVpbmcgZHJhZ2dlZDpcbiAqIC0gZHJhZ3N0YXJ0OiBhZGQgJ2RyYWdnaW5nJyBjbGFzcyB0byBlbGVtZW50LCBzZXQgZWZmZWN0QWxsb3dlZCA9ICdtb3ZlJ1xuICogLSBkcmFnb3Zlcjogc2V0IGRyb3BFZmZlY3QgPSAnbW92ZSdcbiAqIC0gZHJhZ2VuZDogcmVtb3ZlICdkcmFnZ2luZycgY2xhc3MgZnJvbSBlbGVtZW50XG4gKlxuICogTGlzdGVuZXJzIGZvciBzdGF0aW9uYXJ5IGl0ZW1zIGJlaW5nIGRyYWdnZWQgb3ZlcjpcbiAqIC0gZHJhZ2VudGVyOiBhZGQgJ2RyYWctdGFyZ2V0LS4uLicgY2xhc3NlcyB0byBlbGVtZW50XG4gKiAtIGRyYWdsZWF2ZTogcmVtb3ZlICdkcmFnLXRhcmdldC0uLi4nIGNsYXNzZXMgZnJvbSBlbGVtZW50XG4gKiAtIGRyb3A6IHJlbW92ZSAnZHJhZy10YXJnZXQtLi4uJyBjbGFzc2VzIGZyb20gZWxlbWVudCwgbW92ZSBkcm9wcGVkIGFycmF5IGl0ZW1cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpkaXJlY3RpdmUtc2VsZWN0b3JcbiAgc2VsZWN0b3I6ICdbb3JkZXJhYmxlXScsXG59KVxuZXhwb3J0IGNsYXNzIE9yZGVyYWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGFycmF5TGF5b3V0SW5kZXg6IHN0cmluZztcbiAgZWxlbWVudDogYW55O1xuICBvdmVyUGFyZW50RWxlbWVudCA9IGZhbHNlO1xuICBvdmVyQ2hpbGRFbGVtZW50ID0gZmFsc2U7XG4gIEBJbnB1dCgpIG9yZGVyYWJsZTogYm9vbGVhbjtcbiAgQElucHV0KCkgbGF5b3V0Tm9kZTogYW55O1xuICBASW5wdXQoKSBsYXlvdXRJbmRleDogbnVtYmVyW107XG4gIEBJbnB1dCgpIGRhdGFJbmRleDogbnVtYmVyW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUganNmOiBKc29uU2NoZW1hRm9ybVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZVxuICApIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLm9yZGVyYWJsZSAmJiB0aGlzLmxheW91dE5vZGUgJiYgdGhpcy5sYXlvdXRJbmRleCAmJiB0aGlzLmRhdGFJbmRleCkge1xuICAgICAgdGhpcy5lbGVtZW50ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICB0aGlzLmVsZW1lbnQuZHJhZ2dhYmxlID0gdHJ1ZTtcbiAgICAgIHRoaXMuYXJyYXlMYXlvdXRJbmRleCA9ICdtb3ZlOicgKyB0aGlzLmxheW91dEluZGV4LnNsaWNlKDAsIC0xKS50b1N0cmluZygpO1xuXG4gICAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG5cbiAgICAgICAgLy8gTGlzdGVuZXJzIGZvciBtb3ZhYmxlIGVsZW1lbnQgYmVpbmcgZHJhZ2dlZDpcblxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSAnbW92ZSc7XG4gICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoJ3RleHQnLCAnJyk7XG4gICAgICAgICAgLy8gSGFjayB0byBieXBhc3Mgc3R1cGlkIEhUTUwgZHJhZy1hbmQtZHJvcCBkYXRhVHJhbnNmZXIgcHJvdGVjdGlvblxuICAgICAgICAgIC8vIHNvIGRyYWcgc291cmNlIGluZm8gd2lsbCBiZSBhdmFpbGFibGUgb24gZHJhZ2VudGVyXG4gICAgICAgICAgY29uc3Qgc291cmNlQXJyYXlJbmRleCA9IHRoaXMuZGF0YUluZGV4W3RoaXMuZGF0YUluZGV4Lmxlbmd0aCAtIDFdO1xuICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0odGhpcy5hcnJheUxheW91dEluZGV4LCBzb3VyY2VBcnJheUluZGV4ICsgJycpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAoZXZlbnQucHJldmVudERlZmF1bHQpIHsgZXZlbnQucHJldmVudERlZmF1bHQoKTsgfVxuICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ21vdmUnO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTGlzdGVuZXJzIGZvciBzdGF0aW9uYXJ5IGl0ZW1zIGJlaW5nIGRyYWdnZWQgb3ZlcjpcblxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VudGVyJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgLy8gUGFydCAxIG9mIGEgaGFjaywgaW5zcGlyZWQgYnkgRHJhZ3N0ZXIsIHRvIHNpbXVsYXRlIG1vdXNlb3ZlciBhbmQgbW91c2VvdXRcbiAgICAgICAgICAvLyBiZWhhdmlvciB3aGlsZSBkcmFnZ2luZyBpdGVtcyAtIGh0dHA6Ly9iZW5zbWl0aGV0dC5naXRodWIuaW8vZHJhZ3N0ZXIvXG4gICAgICAgICAgaWYgKHRoaXMub3ZlclBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm92ZXJDaGlsZEVsZW1lbnQgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm92ZXJQYXJlbnRFbGVtZW50ID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBzb3VyY2VBcnJheUluZGV4ID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmFycmF5TGF5b3V0SW5kZXgpO1xuICAgICAgICAgIGlmIChzb3VyY2VBcnJheUluZGV4ICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhSW5kZXhbdGhpcy5kYXRhSW5kZXgubGVuZ3RoIC0gMV0gPCArc291cmNlQXJyYXlJbmRleCkge1xuICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZHJhZy10YXJnZXQtdG9wJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZGF0YUluZGV4W3RoaXMuZGF0YUluZGV4Lmxlbmd0aCAtIDFdID4gK3NvdXJjZUFycmF5SW5kZXgpIHtcbiAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2RyYWctdGFyZ2V0LWJvdHRvbScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIChldmVudCkgPT4ge1xuICAgICAgICAgIC8vIFBhcnQgMiBvZiB0aGUgRHJhZ3N0ZXIgaGFja1xuICAgICAgICAgIGlmICh0aGlzLm92ZXJDaGlsZEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMub3ZlckNoaWxkRWxlbWVudCA9IGZhbHNlO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5vdmVyUGFyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5vdmVyUGFyZW50RWxlbWVudCA9IGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHNvdXJjZUFycmF5SW5kZXggPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKHRoaXMuYXJyYXlMYXlvdXRJbmRleCk7XG4gICAgICAgICAgaWYgKCF0aGlzLm92ZXJQYXJlbnRFbGVtZW50ICYmICF0aGlzLm92ZXJDaGlsZEVsZW1lbnQgJiYgc291cmNlQXJyYXlJbmRleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWctdGFyZ2V0LXRvcCcpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWctdGFyZ2V0LWJvdHRvbScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZy10YXJnZXQtdG9wJyk7XG4gICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWctdGFyZ2V0LWJvdHRvbScpO1xuICAgICAgICAgIC8vIENvbmZpcm0gdGhhdCBkcm9wIHRhcmdldCBpcyBhbm90aGVyIGl0ZW0gaW4gdGhlIHNhbWUgYXJyYXkgYXMgc291cmNlIGl0ZW1cbiAgICAgICAgICBjb25zdCBzb3VyY2VBcnJheUluZGV4ID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmFycmF5TGF5b3V0SW5kZXgpO1xuICAgICAgICAgIGNvbnN0IGRlc3RBcnJheUluZGV4ID0gdGhpcy5kYXRhSW5kZXhbdGhpcy5kYXRhSW5kZXgubGVuZ3RoIC0gMV07XG4gICAgICAgICAgaWYgKHNvdXJjZUFycmF5SW5kZXggIT09IG51bGwgJiYgK3NvdXJjZUFycmF5SW5kZXggIT09IGRlc3RBcnJheUluZGV4KSB7XG4gICAgICAgICAgICAvLyBNb3ZlIGFycmF5IGl0ZW1cbiAgICAgICAgICAgIHRoaXMuanNmLm1vdmVBcnJheUl0ZW0odGhpcywgK3NvdXJjZUFycmF5SW5kZXgsIGRlc3RBcnJheUluZGV4KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmFycmF5TGF5b3V0SW5kZXgpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIl19