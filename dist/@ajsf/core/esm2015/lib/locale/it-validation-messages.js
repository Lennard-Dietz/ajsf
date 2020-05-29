/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
const ɵ0 = /**
 * @param {?} error
 * @return {?}
 */
function (error) {
    switch (error.requiredFormat) {
        case 'date':
            return 'Deve essere una data, come "31-12-2000"';
        case 'time':
            return 'Deve essere un orario, come "16:20" o "03:14:15.9265"';
        case 'date-time':
            return 'Deve essere data-orario, come "14-03-2000T01:59" or "14-03-2000T01:59:26.535Z"';
        case 'email':
            return 'Deve essere un indirzzo email, come "name@example.com"';
        case 'hostname':
            return 'Deve essere un hostname, come "example.com"';
        case 'ipv4':
            return 'Deve essere un indirizzo IPv4, come "127.0.0.1"';
        case 'ipv6':
            return 'Deve essere un indirizzo IPv6, come "1234:5678:9ABC:DEF0:1234:5678:9ABC:DEF0"';
        // TODO: add examples for 'uri', 'uri-reference', and 'uri-template'
        // case 'uri': case 'uri-reference': case 'uri-template':
        case 'url':
            return 'Deve essere un url, come "http://www.example.com/page.html"';
        case 'uuid':
            return 'Deve essere un uuid, come "12345678-9ABC-DEF0-1234-56789ABCDEF0"';
        case 'color':
            return 'Deve essere un colore, come "#FFFFFF" o "rgb(255, 255, 255)"';
        case 'json-pointer':
            return 'Deve essere un JSON Pointer, come "/pointer/to/something"';
        case 'relative-json-pointer':
            return 'Deve essere un JSON Pointer relativo, come "2/pointer/to/something"';
        case 'regex':
            return 'Deve essere una regular expression, come "(1-)?\\d{3}-\\d{3}-\\d{4}"';
        default:
            return 'Deve essere formattato correttamente ' + error.requiredFormat;
    }
}, ɵ1 = /**
 * @param {?} error
 * @return {?}
 */
function (error) {
    if ((1 / error.multipleOfValue) % 10 === 0) {
        /** @type {?} */
        const decimals = Math.log10(1 / error.multipleOfValue);
        return `Deve avere ${decimals} o meno decimali.`;
    }
    else {
        return `Deve essere multiplo di ${error.multipleOfValue}.`;
    }
};
/** @type {?} */
export const itValidationMessages = {
    // Default Italian error messages
    required: 'Il campo è obbligatorio',
    minLength: 'Deve inserire almeno {{minimumLength}} caratteri (lunghezza corrente: {{currentLength}})',
    maxLength: 'Il numero massimo di caratteri consentito è {{maximumLength}} (lunghezza corrente: {{currentLength}})',
    pattern: 'Devi rispettare il pattern : {{requiredPattern}}',
    format: (ɵ0),
    minimum: 'Deve essere {{minimumValue}} o più',
    exclusiveMinimum: 'Deve essere più di {{exclusiveMinimumValue}}',
    maximum: 'Deve essere {{maximumValue}} o meno',
    exclusiveMaximum: 'Deve essere minore di {{exclusiveMaximumValue}}',
    multipleOf: (ɵ1),
    minProperties: 'Deve avere {{minimumProperties}} o più elementi (elementi correnti: {{currentProperties}})',
    maxProperties: 'Deve avere {{maximumProperties}} o meno elementi (elementi correnti: {{currentProperties}})',
    minItems: 'Deve avere {{minimumItems}} o più elementi (elementi correnti: {{currentItems}})',
    maxItems: 'Deve avere {{maximumItems}} o meno elementi (elementi correnti: {{currentItems}})',
    uniqueItems: 'Tutti gli elementi devono essere unici',
};
export { ɵ0, ɵ1 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXQtdmFsaWRhdGlvbi1tZXNzYWdlcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhanNmL2NvcmUvIiwic291cmNlcyI6WyJsaWIvbG9jYWxlL2l0LXZhbGlkYXRpb24tbWVzc2FnZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFLVSxVQUFVLEtBQUs7SUFDckIsUUFBUSxLQUFLLENBQUMsY0FBYyxFQUFFO1FBQzVCLEtBQUssTUFBTTtZQUNULE9BQU8seUNBQXlDLENBQUM7UUFDbkQsS0FBSyxNQUFNO1lBQ1QsT0FBTyx1REFBdUQsQ0FBQztRQUNqRSxLQUFLLFdBQVc7WUFDZCxPQUFPLGdGQUFnRixDQUFDO1FBQzFGLEtBQUssT0FBTztZQUNWLE9BQU8sd0RBQXdELENBQUM7UUFDbEUsS0FBSyxVQUFVO1lBQ2IsT0FBTyw2Q0FBNkMsQ0FBQztRQUN2RCxLQUFLLE1BQU07WUFDVCxPQUFPLGlEQUFpRCxDQUFDO1FBQzNELEtBQUssTUFBTTtZQUNULE9BQU8sK0VBQStFLENBQUM7UUFDekYsb0VBQW9FO1FBQ3BFLHlEQUF5RDtRQUN6RCxLQUFLLEtBQUs7WUFDUixPQUFPLDZEQUE2RCxDQUFDO1FBQ3ZFLEtBQUssTUFBTTtZQUNULE9BQU8sa0VBQWtFLENBQUM7UUFDNUUsS0FBSyxPQUFPO1lBQ1YsT0FBTyw4REFBOEQsQ0FBQztRQUN4RSxLQUFLLGNBQWM7WUFDakIsT0FBTywyREFBMkQsQ0FBQztRQUNyRSxLQUFLLHVCQUF1QjtZQUMxQixPQUFPLHFFQUFxRSxDQUFDO1FBQy9FLEtBQUssT0FBTztZQUNWLE9BQU8sc0VBQXNFLENBQUM7UUFDaEY7WUFDRSxPQUFPLHVDQUF1QyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUM7S0FDekU7QUFDSCxDQUFDOzs7O0FBS1csVUFBVSxLQUFLO0lBQ3pCLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUU7O2NBQ3BDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDO1FBQ3RELE9BQU8sY0FBYyxRQUFRLG1CQUFtQixDQUFDO0tBQ2xEO1NBQU07UUFDTCxPQUFPLDJCQUEyQixLQUFLLENBQUMsZUFBZSxHQUFHLENBQUM7S0FDNUQ7QUFDSCxDQUFDOztBQWxESCxNQUFNLE9BQU8sb0JBQW9CLEdBQVE7O0lBQ3ZDLFFBQVEsRUFBRSx5QkFBeUI7SUFDbkMsU0FBUyxFQUFFLDBGQUEwRjtJQUNyRyxTQUFTLEVBQUUsdUdBQXVHO0lBQ2xILE9BQU8sRUFBRSxrREFBa0Q7SUFDM0QsTUFBTSxNQWlDTDtJQUNELE9BQU8sRUFBRSxvQ0FBb0M7SUFDN0MsZ0JBQWdCLEVBQUUsOENBQThDO0lBQ2hFLE9BQU8sRUFBRSxxQ0FBcUM7SUFDOUMsZ0JBQWdCLEVBQUUsaURBQWlEO0lBQ25FLFVBQVUsTUFPVDtJQUNELGFBQWEsRUFBRSw0RkFBNEY7SUFDM0csYUFBYSxFQUFFLDZGQUE2RjtJQUM1RyxRQUFRLEVBQUUsa0ZBQWtGO0lBQzVGLFFBQVEsRUFBRSxtRkFBbUY7SUFDN0YsV0FBVyxFQUFFLHdDQUF3QztDQUV0RCIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBpdFZhbGlkYXRpb25NZXNzYWdlczogYW55ID0geyAvLyBEZWZhdWx0IEl0YWxpYW4gZXJyb3IgbWVzc2FnZXNcbiAgcmVxdWlyZWQ6ICdJbCBjYW1wbyDDqCBvYmJsaWdhdG9yaW8nLFxuICBtaW5MZW5ndGg6ICdEZXZlIGluc2VyaXJlIGFsbWVubyB7e21pbmltdW1MZW5ndGh9fSBjYXJhdHRlcmkgKGx1bmdoZXp6YSBjb3JyZW50ZToge3tjdXJyZW50TGVuZ3RofX0pJyxcbiAgbWF4TGVuZ3RoOiAnSWwgbnVtZXJvIG1hc3NpbW8gZGkgY2FyYXR0ZXJpIGNvbnNlbnRpdG8gw6gge3ttYXhpbXVtTGVuZ3RofX0gKGx1bmdoZXp6YSBjb3JyZW50ZToge3tjdXJyZW50TGVuZ3RofX0pJyxcbiAgcGF0dGVybjogJ0RldmkgcmlzcGV0dGFyZSBpbCBwYXR0ZXJuIDoge3tyZXF1aXJlZFBhdHRlcm59fScsXG4gIGZvcm1hdDogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgc3dpdGNoIChlcnJvci5yZXF1aXJlZEZvcm1hdCkge1xuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgIHJldHVybiAnRGV2ZSBlc3NlcmUgdW5hIGRhdGEsIGNvbWUgXCIzMS0xMi0yMDAwXCInO1xuICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgIHJldHVybiAnRGV2ZSBlc3NlcmUgdW4gb3JhcmlvLCBjb21lIFwiMTY6MjBcIiBvIFwiMDM6MTQ6MTUuOTI2NVwiJztcbiAgICAgIGNhc2UgJ2RhdGUtdGltZSc6XG4gICAgICAgIHJldHVybiAnRGV2ZSBlc3NlcmUgZGF0YS1vcmFyaW8sIGNvbWUgXCIxNC0wMy0yMDAwVDAxOjU5XCIgb3IgXCIxNC0wMy0yMDAwVDAxOjU5OjI2LjUzNVpcIic7XG4gICAgICBjYXNlICdlbWFpbCc6XG4gICAgICAgIHJldHVybiAnRGV2ZSBlc3NlcmUgdW4gaW5kaXJ6em8gZW1haWwsIGNvbWUgXCJuYW1lQGV4YW1wbGUuY29tXCInO1xuICAgICAgY2FzZSAnaG9zdG5hbWUnOlxuICAgICAgICByZXR1cm4gJ0RldmUgZXNzZXJlIHVuIGhvc3RuYW1lLCBjb21lIFwiZXhhbXBsZS5jb21cIic7XG4gICAgICBjYXNlICdpcHY0JzpcbiAgICAgICAgcmV0dXJuICdEZXZlIGVzc2VyZSB1biBpbmRpcml6em8gSVB2NCwgY29tZSBcIjEyNy4wLjAuMVwiJztcbiAgICAgIGNhc2UgJ2lwdjYnOlxuICAgICAgICByZXR1cm4gJ0RldmUgZXNzZXJlIHVuIGluZGlyaXp6byBJUHY2LCBjb21lIFwiMTIzNDo1Njc4OjlBQkM6REVGMDoxMjM0OjU2Nzg6OUFCQzpERUYwXCInO1xuICAgICAgLy8gVE9ETzogYWRkIGV4YW1wbGVzIGZvciAndXJpJywgJ3VyaS1yZWZlcmVuY2UnLCBhbmQgJ3VyaS10ZW1wbGF0ZSdcbiAgICAgIC8vIGNhc2UgJ3VyaSc6IGNhc2UgJ3VyaS1yZWZlcmVuY2UnOiBjYXNlICd1cmktdGVtcGxhdGUnOlxuICAgICAgY2FzZSAndXJsJzpcbiAgICAgICAgcmV0dXJuICdEZXZlIGVzc2VyZSB1biB1cmwsIGNvbWUgXCJodHRwOi8vd3d3LmV4YW1wbGUuY29tL3BhZ2UuaHRtbFwiJztcbiAgICAgIGNhc2UgJ3V1aWQnOlxuICAgICAgICByZXR1cm4gJ0RldmUgZXNzZXJlIHVuIHV1aWQsIGNvbWUgXCIxMjM0NTY3OC05QUJDLURFRjAtMTIzNC01Njc4OUFCQ0RFRjBcIic7XG4gICAgICBjYXNlICdjb2xvcic6XG4gICAgICAgIHJldHVybiAnRGV2ZSBlc3NlcmUgdW4gY29sb3JlLCBjb21lIFwiI0ZGRkZGRlwiIG8gXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIic7XG4gICAgICBjYXNlICdqc29uLXBvaW50ZXInOlxuICAgICAgICByZXR1cm4gJ0RldmUgZXNzZXJlIHVuIEpTT04gUG9pbnRlciwgY29tZSBcIi9wb2ludGVyL3RvL3NvbWV0aGluZ1wiJztcbiAgICAgIGNhc2UgJ3JlbGF0aXZlLWpzb24tcG9pbnRlcic6XG4gICAgICAgIHJldHVybiAnRGV2ZSBlc3NlcmUgdW4gSlNPTiBQb2ludGVyIHJlbGF0aXZvLCBjb21lIFwiMi9wb2ludGVyL3RvL3NvbWV0aGluZ1wiJztcbiAgICAgIGNhc2UgJ3JlZ2V4JzpcbiAgICAgICAgcmV0dXJuICdEZXZlIGVzc2VyZSB1bmEgcmVndWxhciBleHByZXNzaW9uLCBjb21lIFwiKDEtKT9cXFxcZHszfS1cXFxcZHszfS1cXFxcZHs0fVwiJztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiAnRGV2ZSBlc3NlcmUgZm9ybWF0dGF0byBjb3JyZXR0YW1lbnRlICcgKyBlcnJvci5yZXF1aXJlZEZvcm1hdDtcbiAgICB9XG4gIH0sXG4gIG1pbmltdW06ICdEZXZlIGVzc2VyZSB7e21pbmltdW1WYWx1ZX19IG8gcGnDuScsXG4gIGV4Y2x1c2l2ZU1pbmltdW06ICdEZXZlIGVzc2VyZSBwacO5IGRpIHt7ZXhjbHVzaXZlTWluaW11bVZhbHVlfX0nLFxuICBtYXhpbXVtOiAnRGV2ZSBlc3NlcmUge3ttYXhpbXVtVmFsdWV9fSBvIG1lbm8nLFxuICBleGNsdXNpdmVNYXhpbXVtOiAnRGV2ZSBlc3NlcmUgbWlub3JlIGRpIHt7ZXhjbHVzaXZlTWF4aW11bVZhbHVlfX0nLFxuICBtdWx0aXBsZU9mOiBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICBpZiAoKDEgLyBlcnJvci5tdWx0aXBsZU9mVmFsdWUpICUgMTAgPT09IDApIHtcbiAgICAgIGNvbnN0IGRlY2ltYWxzID0gTWF0aC5sb2cxMCgxIC8gZXJyb3IubXVsdGlwbGVPZlZhbHVlKTtcbiAgICAgIHJldHVybiBgRGV2ZSBhdmVyZSAke2RlY2ltYWxzfSBvIG1lbm8gZGVjaW1hbGkuYDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGBEZXZlIGVzc2VyZSBtdWx0aXBsbyBkaSAke2Vycm9yLm11bHRpcGxlT2ZWYWx1ZX0uYDtcbiAgICB9XG4gIH0sXG4gIG1pblByb3BlcnRpZXM6ICdEZXZlIGF2ZXJlIHt7bWluaW11bVByb3BlcnRpZXN9fSBvIHBpw7kgZWxlbWVudGkgKGVsZW1lbnRpIGNvcnJlbnRpOiB7e2N1cnJlbnRQcm9wZXJ0aWVzfX0pJyxcbiAgbWF4UHJvcGVydGllczogJ0RldmUgYXZlcmUge3ttYXhpbXVtUHJvcGVydGllc319IG8gbWVubyBlbGVtZW50aSAoZWxlbWVudGkgY29ycmVudGk6IHt7Y3VycmVudFByb3BlcnRpZXN9fSknLFxuICBtaW5JdGVtczogJ0RldmUgYXZlcmUge3ttaW5pbXVtSXRlbXN9fSBvIHBpw7kgZWxlbWVudGkgKGVsZW1lbnRpIGNvcnJlbnRpOiB7e2N1cnJlbnRJdGVtc319KScsXG4gIG1heEl0ZW1zOiAnRGV2ZSBhdmVyZSB7e21heGltdW1JdGVtc319IG8gbWVubyBlbGVtZW50aSAoZWxlbWVudGkgY29ycmVudGk6IHt7Y3VycmVudEl0ZW1zfX0pJyxcbiAgdW5pcXVlSXRlbXM6ICdUdXR0aSBnbGkgZWxlbWVudGkgZGV2b25vIGVzc2VyZSB1bmljaScsXG4gIC8vIE5vdGU6IE5vIGRlZmF1bHQgZXJyb3IgbWVzc2FnZXMgZm9yICd0eXBlJywgJ2NvbnN0JywgJ2VudW0nLCBvciAnZGVwZW5kZW5jaWVzJ1xufTtcbiJdfQ==