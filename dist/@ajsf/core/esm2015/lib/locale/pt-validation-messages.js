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
            return 'Tem que ser uma data, por exemplo "2000-12-31"';
        case 'time':
            return 'Tem que ser horário, por exemplo "16:20" ou "03:14:15.9265"';
        case 'date-time':
            return 'Tem que ser data e hora, por exemplo "2000-03-14T01:59" ou "2000-03-14T01:59:26.535Z"';
        case 'email':
            return 'Tem que ser um email, por exemplo "fulano@exemplo.com.br"';
        case 'hostname':
            return 'Tem que ser uma nome de domínio, por exemplo "exemplo.com.br"';
        case 'ipv4':
            return 'Tem que ser um endereço IPv4, por exemplo "127.0.0.1"';
        case 'ipv6':
            return 'Tem que ser um endereço IPv6, por exemplo "1234:5678:9ABC:DEF0:1234:5678:9ABC:DEF0"';
        // TODO: add examples for 'uri', 'uri-reference', and 'uri-template'
        // case 'uri': case 'uri-reference': case 'uri-template':
        case 'url':
            return 'Tem que ser uma URL, por exemplo "http://www.exemplo.com.br/pagina.html"';
        case 'uuid':
            return 'Tem que ser um uuid, por exemplo "12345678-9ABC-DEF0-1234-56789ABCDEF0"';
        case 'color':
            return 'Tem que ser uma cor, por exemplo "#FFFFFF" ou "rgb(255, 255, 255)"';
        case 'json-pointer':
            return 'Tem que ser um JSON Pointer, por exemplo "/referencia/para/algo"';
        case 'relative-json-pointer':
            return 'Tem que ser um JSON Pointer relativo, por exemplo "2/referencia/para/algo"';
        case 'regex':
            return 'Tem que ser uma expressão regular, por exemplo "(1-)?\\d{3}-\\d{3}-\\d{4}"';
        default:
            return 'Tem que ser no formato: ' + error.requiredFormat;
    }
}, ɵ1 = /**
 * @param {?} error
 * @return {?}
 */
function (error) {
    if ((1 / error.multipleOfValue) % 10 === 0) {
        /** @type {?} */
        const decimals = Math.log10(1 / error.multipleOfValue);
        return `Tem que ter ${decimals} ou menos casas decimais.`;
    }
    else {
        return `Tem que ser um múltiplo de ${error.multipleOfValue}.`;
    }
};
/** @type {?} */
export const ptValidationMessages = {
    // Brazilian Portuguese error messages
    required: 'Este campo é obrigatório.',
    minLength: 'É preciso no mínimo {{minimumLength}} caracteres ou mais (tamanho atual: {{currentLength}})',
    maxLength: 'É preciso no máximo  {{maximumLength}} caracteres ou menos (tamanho atual: {{currentLength}})',
    pattern: 'Tem que ajustar ao formato: {{requiredPattern}}',
    format: (ɵ0),
    minimum: 'Tem que ser {{minimumValue}} ou mais',
    exclusiveMinimum: 'Tem que ser mais que {{exclusiveMinimumValue}}',
    maximum: 'Tem que ser {{maximumValue}} ou menos',
    exclusiveMaximum: 'Tem que ser menor que {{exclusiveMaximumValue}}',
    multipleOf: (ɵ1),
    minProperties: 'Deve ter {{minimumProperties}} ou mais itens (itens até o momento: {{currentProperties}})',
    maxProperties: 'Deve ter {{maximumProperties}} ou menos intens (itens até o momento: {{currentProperties}})',
    minItems: 'Deve ter {{minimumItems}} ou mais itens (itens até o momento: {{currentItems}})',
    maxItems: 'Deve ter {{maximumItems}} ou menos itens (itens até o momento: {{currentItems}})',
    uniqueItems: 'Todos os itens devem ser únicos',
};
export { ɵ0, ɵ1 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHQtdmFsaWRhdGlvbi1tZXNzYWdlcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhanNmL2NvcmUvIiwic291cmNlcyI6WyJsaWIvbG9jYWxlL3B0LXZhbGlkYXRpb24tbWVzc2FnZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFLVSxVQUFVLEtBQUs7SUFDckIsUUFBUSxLQUFLLENBQUMsY0FBYyxFQUFFO1FBQzVCLEtBQUssTUFBTTtZQUNULE9BQU8sZ0RBQWdELENBQUM7UUFDMUQsS0FBSyxNQUFNO1lBQ1QsT0FBTyw2REFBNkQsQ0FBQztRQUN2RSxLQUFLLFdBQVc7WUFDZCxPQUFPLHVGQUF1RixDQUFDO1FBQ2pHLEtBQUssT0FBTztZQUNWLE9BQU8sMkRBQTJELENBQUM7UUFDckUsS0FBSyxVQUFVO1lBQ2IsT0FBTywrREFBK0QsQ0FBQztRQUN6RSxLQUFLLE1BQU07WUFDVCxPQUFPLHVEQUF1RCxDQUFDO1FBQ2pFLEtBQUssTUFBTTtZQUNULE9BQU8scUZBQXFGLENBQUM7UUFDL0Ysb0VBQW9FO1FBQ3BFLHlEQUF5RDtRQUN6RCxLQUFLLEtBQUs7WUFDUixPQUFPLDBFQUEwRSxDQUFDO1FBQ3BGLEtBQUssTUFBTTtZQUNULE9BQU8seUVBQXlFLENBQUM7UUFDbkYsS0FBSyxPQUFPO1lBQ1YsT0FBTyxvRUFBb0UsQ0FBQztRQUM5RSxLQUFLLGNBQWM7WUFDakIsT0FBTyxrRUFBa0UsQ0FBQztRQUM1RSxLQUFLLHVCQUF1QjtZQUMxQixPQUFPLDRFQUE0RSxDQUFDO1FBQ3RGLEtBQUssT0FBTztZQUNWLE9BQU8sNEVBQTRFLENBQUM7UUFDdEY7WUFDRSxPQUFPLDBCQUEwQixHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUM7S0FDNUQ7QUFDSCxDQUFDOzs7O0FBS1csVUFBVSxLQUFLO0lBQ3pCLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUU7O2NBQ3BDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDO1FBQ3RELE9BQU8sZUFBZSxRQUFRLDJCQUEyQixDQUFDO0tBQzNEO1NBQU07UUFDTCxPQUFPLDhCQUE4QixLQUFLLENBQUMsZUFBZSxHQUFHLENBQUM7S0FDL0Q7QUFDSCxDQUFDOztBQWxESCxNQUFNLE9BQU8sb0JBQW9CLEdBQVE7O0lBQ3ZDLFFBQVEsRUFBRSwyQkFBMkI7SUFDckMsU0FBUyxFQUFFLDZGQUE2RjtJQUN4RyxTQUFTLEVBQUUsK0ZBQStGO0lBQzFHLE9BQU8sRUFBRSxpREFBaUQ7SUFDMUQsTUFBTSxNQWlDTDtJQUNELE9BQU8sRUFBRSxzQ0FBc0M7SUFDL0MsZ0JBQWdCLEVBQUUsZ0RBQWdEO0lBQ2xFLE9BQU8sRUFBRSx1Q0FBdUM7SUFDaEQsZ0JBQWdCLEVBQUUsaURBQWlEO0lBQ25FLFVBQVUsTUFPVDtJQUNELGFBQWEsRUFBRSwyRkFBMkY7SUFDMUcsYUFBYSxFQUFFLDZGQUE2RjtJQUM1RyxRQUFRLEVBQUUsaUZBQWlGO0lBQzNGLFFBQVEsRUFBRSxrRkFBa0Y7SUFDNUYsV0FBVyxFQUFFLGlDQUFpQztDQUUvQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBwdFZhbGlkYXRpb25NZXNzYWdlczogYW55ID0geyAvLyBCcmF6aWxpYW4gUG9ydHVndWVzZSBlcnJvciBtZXNzYWdlc1xuICByZXF1aXJlZDogJ0VzdGUgY2FtcG8gw6kgb2JyaWdhdMOzcmlvLicsXG4gIG1pbkxlbmd0aDogJ8OJIHByZWNpc28gbm8gbcOtbmltbyB7e21pbmltdW1MZW5ndGh9fSBjYXJhY3RlcmVzIG91IG1haXMgKHRhbWFuaG8gYXR1YWw6IHt7Y3VycmVudExlbmd0aH19KScsXG4gIG1heExlbmd0aDogJ8OJIHByZWNpc28gbm8gbcOheGltbyAge3ttYXhpbXVtTGVuZ3RofX0gY2FyYWN0ZXJlcyBvdSBtZW5vcyAodGFtYW5obyBhdHVhbDoge3tjdXJyZW50TGVuZ3RofX0pJyxcbiAgcGF0dGVybjogJ1RlbSBxdWUgYWp1c3RhciBhbyBmb3JtYXRvOiB7e3JlcXVpcmVkUGF0dGVybn19JyxcbiAgZm9ybWF0OiBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICBzd2l0Y2ggKGVycm9yLnJlcXVpcmVkRm9ybWF0KSB7XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgcmV0dXJuICdUZW0gcXVlIHNlciB1bWEgZGF0YSwgcG9yIGV4ZW1wbG8gXCIyMDAwLTEyLTMxXCInO1xuICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgIHJldHVybiAnVGVtIHF1ZSBzZXIgaG9yw6FyaW8sIHBvciBleGVtcGxvIFwiMTY6MjBcIiBvdSBcIjAzOjE0OjE1LjkyNjVcIic7XG4gICAgICBjYXNlICdkYXRlLXRpbWUnOlxuICAgICAgICByZXR1cm4gJ1RlbSBxdWUgc2VyIGRhdGEgZSBob3JhLCBwb3IgZXhlbXBsbyBcIjIwMDAtMDMtMTRUMDE6NTlcIiBvdSBcIjIwMDAtMDMtMTRUMDE6NTk6MjYuNTM1WlwiJztcbiAgICAgIGNhc2UgJ2VtYWlsJzpcbiAgICAgICAgcmV0dXJuICdUZW0gcXVlIHNlciB1bSBlbWFpbCwgcG9yIGV4ZW1wbG8gXCJmdWxhbm9AZXhlbXBsby5jb20uYnJcIic7XG4gICAgICBjYXNlICdob3N0bmFtZSc6XG4gICAgICAgIHJldHVybiAnVGVtIHF1ZSBzZXIgdW1hIG5vbWUgZGUgZG9tw61uaW8sIHBvciBleGVtcGxvIFwiZXhlbXBsby5jb20uYnJcIic7XG4gICAgICBjYXNlICdpcHY0JzpcbiAgICAgICAgcmV0dXJuICdUZW0gcXVlIHNlciB1bSBlbmRlcmXDp28gSVB2NCwgcG9yIGV4ZW1wbG8gXCIxMjcuMC4wLjFcIic7XG4gICAgICBjYXNlICdpcHY2JzpcbiAgICAgICAgcmV0dXJuICdUZW0gcXVlIHNlciB1bSBlbmRlcmXDp28gSVB2NiwgcG9yIGV4ZW1wbG8gXCIxMjM0OjU2Nzg6OUFCQzpERUYwOjEyMzQ6NTY3ODo5QUJDOkRFRjBcIic7XG4gICAgICAvLyBUT0RPOiBhZGQgZXhhbXBsZXMgZm9yICd1cmknLCAndXJpLXJlZmVyZW5jZScsIGFuZCAndXJpLXRlbXBsYXRlJ1xuICAgICAgLy8gY2FzZSAndXJpJzogY2FzZSAndXJpLXJlZmVyZW5jZSc6IGNhc2UgJ3VyaS10ZW1wbGF0ZSc6XG4gICAgICBjYXNlICd1cmwnOlxuICAgICAgICByZXR1cm4gJ1RlbSBxdWUgc2VyIHVtYSBVUkwsIHBvciBleGVtcGxvIFwiaHR0cDovL3d3dy5leGVtcGxvLmNvbS5ici9wYWdpbmEuaHRtbFwiJztcbiAgICAgIGNhc2UgJ3V1aWQnOlxuICAgICAgICByZXR1cm4gJ1RlbSBxdWUgc2VyIHVtIHV1aWQsIHBvciBleGVtcGxvIFwiMTIzNDU2NzgtOUFCQy1ERUYwLTEyMzQtNTY3ODlBQkNERUYwXCInO1xuICAgICAgY2FzZSAnY29sb3InOlxuICAgICAgICByZXR1cm4gJ1RlbSBxdWUgc2VyIHVtYSBjb3IsIHBvciBleGVtcGxvIFwiI0ZGRkZGRlwiIG91IFwicmdiKDI1NSwgMjU1LCAyNTUpXCInO1xuICAgICAgY2FzZSAnanNvbi1wb2ludGVyJzpcbiAgICAgICAgcmV0dXJuICdUZW0gcXVlIHNlciB1bSBKU09OIFBvaW50ZXIsIHBvciBleGVtcGxvIFwiL3JlZmVyZW5jaWEvcGFyYS9hbGdvXCInO1xuICAgICAgY2FzZSAncmVsYXRpdmUtanNvbi1wb2ludGVyJzpcbiAgICAgICAgcmV0dXJuICdUZW0gcXVlIHNlciB1bSBKU09OIFBvaW50ZXIgcmVsYXRpdm8sIHBvciBleGVtcGxvIFwiMi9yZWZlcmVuY2lhL3BhcmEvYWxnb1wiJztcbiAgICAgIGNhc2UgJ3JlZ2V4JzpcbiAgICAgICAgcmV0dXJuICdUZW0gcXVlIHNlciB1bWEgZXhwcmVzc8OjbyByZWd1bGFyLCBwb3IgZXhlbXBsbyBcIigxLSk/XFxcXGR7M30tXFxcXGR7M30tXFxcXGR7NH1cIic7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gJ1RlbSBxdWUgc2VyIG5vIGZvcm1hdG86ICcgKyBlcnJvci5yZXF1aXJlZEZvcm1hdDtcbiAgICB9XG4gIH0sXG4gIG1pbmltdW06ICdUZW0gcXVlIHNlciB7e21pbmltdW1WYWx1ZX19IG91IG1haXMnLFxuICBleGNsdXNpdmVNaW5pbXVtOiAnVGVtIHF1ZSBzZXIgbWFpcyBxdWUge3tleGNsdXNpdmVNaW5pbXVtVmFsdWV9fScsXG4gIG1heGltdW06ICdUZW0gcXVlIHNlciB7e21heGltdW1WYWx1ZX19IG91IG1lbm9zJyxcbiAgZXhjbHVzaXZlTWF4aW11bTogJ1RlbSBxdWUgc2VyIG1lbm9yIHF1ZSB7e2V4Y2x1c2l2ZU1heGltdW1WYWx1ZX19JyxcbiAgbXVsdGlwbGVPZjogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgaWYgKCgxIC8gZXJyb3IubXVsdGlwbGVPZlZhbHVlKSAlIDEwID09PSAwKSB7XG4gICAgICBjb25zdCBkZWNpbWFscyA9IE1hdGgubG9nMTAoMSAvIGVycm9yLm11bHRpcGxlT2ZWYWx1ZSk7XG4gICAgICByZXR1cm4gYFRlbSBxdWUgdGVyICR7ZGVjaW1hbHN9IG91IG1lbm9zIGNhc2FzIGRlY2ltYWlzLmA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBgVGVtIHF1ZSBzZXIgdW0gbcO6bHRpcGxvIGRlICR7ZXJyb3IubXVsdGlwbGVPZlZhbHVlfS5gO1xuICAgIH1cbiAgfSxcbiAgbWluUHJvcGVydGllczogJ0RldmUgdGVyIHt7bWluaW11bVByb3BlcnRpZXN9fSBvdSBtYWlzIGl0ZW5zIChpdGVucyBhdMOpIG8gbW9tZW50bzoge3tjdXJyZW50UHJvcGVydGllc319KScsXG4gIG1heFByb3BlcnRpZXM6ICdEZXZlIHRlciB7e21heGltdW1Qcm9wZXJ0aWVzfX0gb3UgbWVub3MgaW50ZW5zIChpdGVucyBhdMOpIG8gbW9tZW50bzoge3tjdXJyZW50UHJvcGVydGllc319KScsXG4gIG1pbkl0ZW1zOiAnRGV2ZSB0ZXIge3ttaW5pbXVtSXRlbXN9fSBvdSBtYWlzIGl0ZW5zIChpdGVucyBhdMOpIG8gbW9tZW50bzoge3tjdXJyZW50SXRlbXN9fSknLFxuICBtYXhJdGVtczogJ0RldmUgdGVyIHt7bWF4aW11bUl0ZW1zfX0gb3UgbWVub3MgaXRlbnMgKGl0ZW5zIGF0w6kgbyBtb21lbnRvOiB7e2N1cnJlbnRJdGVtc319KScsXG4gIHVuaXF1ZUl0ZW1zOiAnVG9kb3Mgb3MgaXRlbnMgZGV2ZW0gc2VyIMO6bmljb3MnLFxuICAvLyBOb3RlOiBObyBkZWZhdWx0IGVycm9yIG1lc3NhZ2VzIGZvciAndHlwZScsICdjb25zdCcsICdlbnVtJywgb3IgJ2RlcGVuZGVuY2llcydcbn07XG4iXX0=