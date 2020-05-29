/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var ɵ0 = /**
 * @param {?} error
 * @return {?}
 */
function (error) {
    switch (error.requiredFormat) {
        case 'date':
            return '必须为日期格式, 比如 "2000-12-31"';
        case 'time':
            return '必须为时间格式, 比如 "16:20" 或者 "03:14:15.9265"';
        case 'date-time':
            return '必须为日期时间格式, 比如 "2000-03-14T01:59" 或者 "2000-03-14T01:59:26.535Z"';
        case 'email':
            return '必须为邮箱地址, 比如 "name@example.com"';
        case 'hostname':
            return '必须为主机名, 比如 "example.com"';
        case 'ipv4':
            return '必须为 IPv4 地址, 比如 "127.0.0.1"';
        case 'ipv6':
            return '必须为 IPv6 地址, 比如 "1234:5678:9ABC:DEF0:1234:5678:9ABC:DEF0"';
        // TODO: add examples for 'uri', 'uri-reference', and 'uri-template'
        // case 'uri': case 'uri-reference': case 'uri-template':
        case 'url':
            return '必须为 url, 比如 "http://www.example.com/page.html"';
        case 'uuid':
            return '必须为 uuid, 比如 "12345678-9ABC-DEF0-1234-56789ABCDEF0"';
        case 'color':
            return '必须为颜色值, 比如 "#FFFFFF" 或者 "rgb(255, 255, 255)"';
        case 'json-pointer':
            return '必须为 JSON Pointer, 比如 "/pointer/to/something"';
        case 'relative-json-pointer':
            return '必须为相对的 JSON Pointer, 比如 "2/pointer/to/something"';
        case 'regex':
            return '必须为正则表达式, 比如 "(1-)?\\d{3}-\\d{3}-\\d{4}"';
        default:
            return '必须为格式正确的 ' + error.requiredFormat;
    }
}, ɵ1 = /**
 * @param {?} error
 * @return {?}
 */
function (error) {
    if ((1 / error.multipleOfValue) % 10 === 0) {
        /** @type {?} */
        var decimals = Math.log10(1 / error.multipleOfValue);
        return "\u5FC5\u987B\u6709 " + decimals + " \u4F4D\u6216\u66F4\u5C11\u7684\u5C0F\u6570\u4F4D";
    }
    else {
        return "\u5FC5\u987B\u4E3A " + error.multipleOfValue + " \u7684\u500D\u6570";
    }
};
/** @type {?} */
export var zhValidationMessages = {
    // Chinese error messages
    required: '必填字段.',
    minLength: '字符长度必须大于或者等于 {{minimumLength}} (当前长度: {{currentLength}})',
    maxLength: '字符长度必须小于或者等于 {{maximumLength}} (当前长度: {{currentLength}})',
    pattern: '必须匹配正则表达式: {{requiredPattern}}',
    format: (ɵ0),
    minimum: '必须大于或者等于最小值: {{minimumValue}}',
    exclusiveMinimum: '必须大于最小值: {{exclusiveMinimumValue}}',
    maximum: '必须小于或者等于最大值: {{maximumValue}}',
    exclusiveMaximum: '必须小于最大值: {{exclusiveMaximumValue}}',
    multipleOf: (ɵ1),
    minProperties: '项目数必须大于或者等于 {{minimumProperties}} (当前项目数: {{currentProperties}})',
    maxProperties: '项目数必须小于或者等于 {{maximumProperties}} (当前项目数: {{currentProperties}})',
    minItems: '项目数必须大于或者等于 {{minimumItems}} (当前项目数: {{currentItems}})',
    maxItems: '项目数必须小于或者等于 {{maximumItems}} (当前项目数: {{currentItems}})',
    uniqueItems: '所有项目必须是唯一的',
};
export { ɵ0, ɵ1 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemgtdmFsaWRhdGlvbi1tZXNzYWdlcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhanNmL2NvcmUvIiwic291cmNlcyI6WyJsaWIvbG9jYWxlL3poLXZhbGlkYXRpb24tbWVzc2FnZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFLVSxVQUFVLEtBQUs7SUFDckIsUUFBUSxLQUFLLENBQUMsY0FBYyxFQUFFO1FBQzVCLEtBQUssTUFBTTtZQUNULE9BQU8sMEJBQTBCLENBQUM7UUFDcEMsS0FBSyxNQUFNO1lBQ1QsT0FBTyx3Q0FBd0MsQ0FBQztRQUNsRCxLQUFLLFdBQVc7WUFDZCxPQUFPLGdFQUFnRSxDQUFDO1FBQzFFLEtBQUssT0FBTztZQUNWLE9BQU8sZ0NBQWdDLENBQUM7UUFDMUMsS0FBSyxVQUFVO1lBQ2IsT0FBTywwQkFBMEIsQ0FBQztRQUNwQyxLQUFLLE1BQU07WUFDVCxPQUFPLDZCQUE2QixDQUFDO1FBQ3ZDLEtBQUssTUFBTTtZQUNULE9BQU8sMkRBQTJELENBQUM7UUFDckUsb0VBQW9FO1FBQ3BFLHlEQUF5RDtRQUN6RCxLQUFLLEtBQUs7WUFDUixPQUFPLGdEQUFnRCxDQUFDO1FBQzFELEtBQUssTUFBTTtZQUNULE9BQU8scURBQXFELENBQUM7UUFDL0QsS0FBSyxPQUFPO1lBQ1YsT0FBTyw4Q0FBOEMsQ0FBQztRQUN4RCxLQUFLLGNBQWM7WUFDakIsT0FBTyw4Q0FBOEMsQ0FBQztRQUN4RCxLQUFLLHVCQUF1QjtZQUMxQixPQUFPLGtEQUFrRCxDQUFDO1FBQzVELEtBQUssT0FBTztZQUNWLE9BQU8sMENBQTBDLENBQUM7UUFDcEQ7WUFDRSxPQUFPLFdBQVcsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDO0tBQzdDO0FBQ0gsQ0FBQzs7OztBQUtXLFVBQVUsS0FBSztJQUN6QixJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFOztZQUNwQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQztRQUN0RCxPQUFPLHdCQUFPLFFBQVEsc0RBQVcsQ0FBQztLQUNuQztTQUFNO1FBQ0wsT0FBTyx3QkFBTyxLQUFLLENBQUMsZUFBZSx3QkFBTSxDQUFDO0tBQzNDO0FBQ0gsQ0FBQzs7QUFsREgsTUFBTSxLQUFPLG9CQUFvQixHQUFROztJQUN2QyxRQUFRLEVBQUUsT0FBTztJQUNqQixTQUFTLEVBQUUsMERBQTBEO0lBQ3JFLFNBQVMsRUFBRSwwREFBMEQ7SUFDckUsT0FBTyxFQUFFLGdDQUFnQztJQUN6QyxNQUFNLE1BaUNMO0lBQ0QsT0FBTyxFQUFFLCtCQUErQjtJQUN4QyxnQkFBZ0IsRUFBRSxvQ0FBb0M7SUFDdEQsT0FBTyxFQUFFLCtCQUErQjtJQUN4QyxnQkFBZ0IsRUFBRSxvQ0FBb0M7SUFDdEQsVUFBVSxNQU9UO0lBQ0QsYUFBYSxFQUFFLGtFQUFrRTtJQUNqRixhQUFhLEVBQUUsa0VBQWtFO0lBQ2pGLFFBQVEsRUFBRSx3REFBd0Q7SUFDbEUsUUFBUSxFQUFFLHdEQUF3RDtJQUNsRSxXQUFXLEVBQUUsWUFBWTtDQUUxQiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCB6aFZhbGlkYXRpb25NZXNzYWdlczogYW55ID0geyAvLyBDaGluZXNlIGVycm9yIG1lc3NhZ2VzXG4gIHJlcXVpcmVkOiAn5b+F5aGr5a2X5q61LicsXG4gIG1pbkxlbmd0aDogJ+Wtl+espumVv+W6puW/hemhu+Wkp+S6juaIluiAheetieS6jiB7e21pbmltdW1MZW5ndGh9fSAo5b2T5YmN6ZW/5bqmOiB7e2N1cnJlbnRMZW5ndGh9fSknLFxuICBtYXhMZW5ndGg6ICflrZfnrKbplb/luqblv4XpobvlsI/kuo7miJbogIXnrYnkuo4ge3ttYXhpbXVtTGVuZ3RofX0gKOW9k+WJjemVv+W6pjoge3tjdXJyZW50TGVuZ3RofX0pJyxcbiAgcGF0dGVybjogJ+W/hemhu+WMuemFjeato+WImeihqOi+vuW8jzoge3tyZXF1aXJlZFBhdHRlcm59fScsXG4gIGZvcm1hdDogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgc3dpdGNoIChlcnJvci5yZXF1aXJlZEZvcm1hdCkge1xuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgIHJldHVybiAn5b+F6aG75Li65pel5pyf5qC85byPLCDmr5TlpoIgXCIyMDAwLTEyLTMxXCInO1xuICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgIHJldHVybiAn5b+F6aG75Li65pe26Ze05qC85byPLCDmr5TlpoIgXCIxNjoyMFwiIOaIluiAhSBcIjAzOjE0OjE1LjkyNjVcIic7XG4gICAgICBjYXNlICdkYXRlLXRpbWUnOlxuICAgICAgICByZXR1cm4gJ+W/hemhu+S4uuaXpeacn+aXtumXtOagvOW8jywg5q+U5aaCIFwiMjAwMC0wMy0xNFQwMTo1OVwiIOaIluiAhSBcIjIwMDAtMDMtMTRUMDE6NTk6MjYuNTM1WlwiJztcbiAgICAgIGNhc2UgJ2VtYWlsJzpcbiAgICAgICAgcmV0dXJuICflv4XpobvkuLrpgq7nrrHlnLDlnYAsIOavlOWmgiBcIm5hbWVAZXhhbXBsZS5jb21cIic7XG4gICAgICBjYXNlICdob3N0bmFtZSc6XG4gICAgICAgIHJldHVybiAn5b+F6aG75Li65Li75py65ZCNLCDmr5TlpoIgXCJleGFtcGxlLmNvbVwiJztcbiAgICAgIGNhc2UgJ2lwdjQnOlxuICAgICAgICByZXR1cm4gJ+W/hemhu+S4uiBJUHY0IOWcsOWdgCwg5q+U5aaCIFwiMTI3LjAuMC4xXCInO1xuICAgICAgY2FzZSAnaXB2Nic6XG4gICAgICAgIHJldHVybiAn5b+F6aG75Li6IElQdjYg5Zyw5Z2ALCDmr5TlpoIgXCIxMjM0OjU2Nzg6OUFCQzpERUYwOjEyMzQ6NTY3ODo5QUJDOkRFRjBcIic7XG4gICAgICAvLyBUT0RPOiBhZGQgZXhhbXBsZXMgZm9yICd1cmknLCAndXJpLXJlZmVyZW5jZScsIGFuZCAndXJpLXRlbXBsYXRlJ1xuICAgICAgLy8gY2FzZSAndXJpJzogY2FzZSAndXJpLXJlZmVyZW5jZSc6IGNhc2UgJ3VyaS10ZW1wbGF0ZSc6XG4gICAgICBjYXNlICd1cmwnOlxuICAgICAgICByZXR1cm4gJ+W/hemhu+S4uiB1cmwsIOavlOWmgiBcImh0dHA6Ly93d3cuZXhhbXBsZS5jb20vcGFnZS5odG1sXCInO1xuICAgICAgY2FzZSAndXVpZCc6XG4gICAgICAgIHJldHVybiAn5b+F6aG75Li6IHV1aWQsIOavlOWmgiBcIjEyMzQ1Njc4LTlBQkMtREVGMC0xMjM0LTU2Nzg5QUJDREVGMFwiJztcbiAgICAgIGNhc2UgJ2NvbG9yJzpcbiAgICAgICAgcmV0dXJuICflv4XpobvkuLrpopzoibLlgLwsIOavlOWmgiBcIiNGRkZGRkZcIiDmiJbogIUgXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIic7XG4gICAgICBjYXNlICdqc29uLXBvaW50ZXInOlxuICAgICAgICByZXR1cm4gJ+W/hemhu+S4uiBKU09OIFBvaW50ZXIsIOavlOWmgiBcIi9wb2ludGVyL3RvL3NvbWV0aGluZ1wiJztcbiAgICAgIGNhc2UgJ3JlbGF0aXZlLWpzb24tcG9pbnRlcic6XG4gICAgICAgIHJldHVybiAn5b+F6aG75Li655u45a+555qEIEpTT04gUG9pbnRlciwg5q+U5aaCIFwiMi9wb2ludGVyL3RvL3NvbWV0aGluZ1wiJztcbiAgICAgIGNhc2UgJ3JlZ2V4JzpcbiAgICAgICAgcmV0dXJuICflv4XpobvkuLrmraPliJnooajovr7lvI8sIOavlOWmgiBcIigxLSk/XFxcXGR7M30tXFxcXGR7M30tXFxcXGR7NH1cIic7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gJ+W/hemhu+S4uuagvOW8j+ato+ehrueahCAnICsgZXJyb3IucmVxdWlyZWRGb3JtYXQ7XG4gICAgfVxuICB9LFxuICBtaW5pbXVtOiAn5b+F6aG75aSn5LqO5oiW6ICF562J5LqO5pyA5bCP5YC8OiB7e21pbmltdW1WYWx1ZX19JyxcbiAgZXhjbHVzaXZlTWluaW11bTogJ+W/hemhu+Wkp+S6juacgOWwj+WAvDoge3tleGNsdXNpdmVNaW5pbXVtVmFsdWV9fScsXG4gIG1heGltdW06ICflv4XpobvlsI/kuo7miJbogIXnrYnkuo7mnIDlpKflgLw6IHt7bWF4aW11bVZhbHVlfX0nLFxuICBleGNsdXNpdmVNYXhpbXVtOiAn5b+F6aG75bCP5LqO5pyA5aSn5YC8OiB7e2V4Y2x1c2l2ZU1heGltdW1WYWx1ZX19JyxcbiAgbXVsdGlwbGVPZjogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgaWYgKCgxIC8gZXJyb3IubXVsdGlwbGVPZlZhbHVlKSAlIDEwID09PSAwKSB7XG4gICAgICBjb25zdCBkZWNpbWFscyA9IE1hdGgubG9nMTAoMSAvIGVycm9yLm11bHRpcGxlT2ZWYWx1ZSk7XG4gICAgICByZXR1cm4gYOW/hemhu+aciSAke2RlY2ltYWxzfSDkvY3miJbmm7TlsJHnmoTlsI/mlbDkvY1gO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYOW/hemhu+S4uiAke2Vycm9yLm11bHRpcGxlT2ZWYWx1ZX0g55qE5YCN5pWwYDtcbiAgICB9XG4gIH0sXG4gIG1pblByb3BlcnRpZXM6ICfpobnnm67mlbDlv4XpobvlpKfkuo7miJbogIXnrYnkuo4ge3ttaW5pbXVtUHJvcGVydGllc319ICjlvZPliY3pobnnm67mlbA6IHt7Y3VycmVudFByb3BlcnRpZXN9fSknLFxuICBtYXhQcm9wZXJ0aWVzOiAn6aG555uu5pWw5b+F6aG75bCP5LqO5oiW6ICF562J5LqOIHt7bWF4aW11bVByb3BlcnRpZXN9fSAo5b2T5YmN6aG555uu5pWwOiB7e2N1cnJlbnRQcm9wZXJ0aWVzfX0pJyxcbiAgbWluSXRlbXM6ICfpobnnm67mlbDlv4XpobvlpKfkuo7miJbogIXnrYnkuo4ge3ttaW5pbXVtSXRlbXN9fSAo5b2T5YmN6aG555uu5pWwOiB7e2N1cnJlbnRJdGVtc319KScsXG4gIG1heEl0ZW1zOiAn6aG555uu5pWw5b+F6aG75bCP5LqO5oiW6ICF562J5LqOIHt7bWF4aW11bUl0ZW1zfX0gKOW9k+WJjemhueebruaVsDoge3tjdXJyZW50SXRlbXN9fSknLFxuICB1bmlxdWVJdGVtczogJ+aJgOaciemhueebruW/hemhu+aYr+WUr+S4gOeahCcsXG4gIC8vIE5vdGU6IE5vIGRlZmF1bHQgZXJyb3IgbWVzc2FnZXMgZm9yICd0eXBlJywgJ2NvbnN0JywgJ2VudW0nLCBvciAnZGVwZW5kZW5jaWVzJ1xufTtcbiJdfQ==