/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { longDays, longMonths, shortDays, shortMonths } from '../locale-dates/en-US';
/**
 *
 * @param {?} date
 * @param {?=} options
 * return a date string which follows the JSON schema standard
 * @return {?}
 */
export function dateToString(date, options) {
    if (options === void 0) { options = {}; }
    /** @type {?} */
    var dateFormat = options.dateFormat || 'YYYY-MM-DD';
    // TODO: Use options.locale to change default format and names
    // const locale = options.locale || 'en-US';
    date = new Date(date || undefined);
    if (!date.getDate()) {
        return null;
    }
    /** @type {?} */
    var year = date.getFullYear().toString();
    /** @type {?} */
    var month = date.getMonth();
    /** @type {?} */
    var day = date.getDate();
    /** @type {?} */
    var dayOfWeek = date.getDay();
    return dateFormat
        .replace(/S/g, getOrdinal(day))
        .replace(/YYYY/g, year)
        .replace(/YY/g, year.slice(-2))
        .replace(/MMMM/g, longMonths[month])
        .replace(/MMM/g, shortMonths[month])
        .replace(/MM/g, ('0' + (month + 1)).slice(-2))
        .replace(/M/g, month + 1)
        .replace(/DDDD/g, longDays[dayOfWeek])
        .replace(/DDD/g, shortDays[dayOfWeek])
        .replace(/DD/g, ('0' + day).slice(-2))
        .replace(/D/g, day);
}
/**
 * @param {?} day
 * @return {?}
 */
export function getOrdinal(day) {
    if (day > 3 && day < 21) {
        return 'th';
    }
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS5mdW5jdGlvbnMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWpzZi9jb3JlLyIsInNvdXJjZXMiOlsibGliL3NoYXJlZC9kYXRlLmZ1bmN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxNQUFNLHVCQUF1QixDQUFDOzs7Ozs7OztBQVFyRixNQUFNLFVBQVUsWUFBWSxDQUFDLElBQW1CLEVBQUUsT0FBaUI7SUFBakIsd0JBQUEsRUFBQSxZQUFpQjs7UUFDM0QsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksWUFBWTtJQUNyRCw4REFBOEQ7SUFDOUQsNENBQTRDO0lBQzVDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksU0FBUyxDQUFDLENBQUM7SUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRTtRQUFFLE9BQU8sSUFBSSxDQUFDO0tBQUU7O1FBQy9CLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxFQUFFOztRQUNwQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRTs7UUFDdkIsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUU7O1FBQ3BCLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFO0lBQy9CLE9BQU8sVUFBVTtTQUNkLE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzlCLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDO1NBQ3RCLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzlCLE9BQU8sQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ25DLE9BQU8sQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ25DLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM3QyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUM7U0FDeEIsT0FBTyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDckMsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDckMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNyQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLENBQUM7Ozs7O0FBRUQsTUFBTSxVQUFVLFVBQVUsQ0FBQyxHQUFXO0lBQ3BDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsRUFBRSxFQUFFO1FBQUUsT0FBTyxJQUFJLENBQUM7S0FBRTtJQUN6QyxRQUFRLEdBQUcsR0FBRyxFQUFFLEVBQUU7UUFDaEIsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQztRQUNwQixLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDO1FBQ3BCLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUM7UUFDcEIsT0FBTyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUM7S0FDdEI7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbG9uZ0RheXMsIGxvbmdNb250aHMsIHNob3J0RGF5cywgc2hvcnRNb250aHMgfSBmcm9tICcuLi9sb2NhbGUtZGF0ZXMvZW4tVVMnO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0gZGF0ZVxuICogQHBhcmFtIG9wdGlvbnNcbiAqIHJldHVybiBhIGRhdGUgc3RyaW5nIHdoaWNoIGZvbGxvd3MgdGhlIEpTT04gc2NoZW1hIHN0YW5kYXJkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkYXRlVG9TdHJpbmcoZGF0ZTogc3RyaW5nIHwgRGF0ZSwgb3B0aW9uczogYW55ID0ge30pOiBzdHJpbmcge1xuICBjb25zdCBkYXRlRm9ybWF0ID0gb3B0aW9ucy5kYXRlRm9ybWF0IHx8ICdZWVlZLU1NLUREJztcbiAgLy8gVE9ETzogVXNlIG9wdGlvbnMubG9jYWxlIHRvIGNoYW5nZSBkZWZhdWx0IGZvcm1hdCBhbmQgbmFtZXNcbiAgLy8gY29uc3QgbG9jYWxlID0gb3B0aW9ucy5sb2NhbGUgfHwgJ2VuLVVTJztcbiAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUgfHwgdW5kZWZpbmVkKTtcbiAgaWYgKCFkYXRlLmdldERhdGUoKSkgeyByZXR1cm4gbnVsbDsgfVxuICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCk7XG4gIGNvbnN0IG1vbnRoID0gZGF0ZS5nZXRNb250aCgpO1xuICBjb25zdCBkYXkgPSBkYXRlLmdldERhdGUoKTtcbiAgY29uc3QgZGF5T2ZXZWVrID0gZGF0ZS5nZXREYXkoKTtcbiAgcmV0dXJuIGRhdGVGb3JtYXRcbiAgICAucmVwbGFjZSgvUy9nLCBnZXRPcmRpbmFsKGRheSkpXG4gICAgLnJlcGxhY2UoL1lZWVkvZywgeWVhcilcbiAgICAucmVwbGFjZSgvWVkvZywgeWVhci5zbGljZSgtMikpXG4gICAgLnJlcGxhY2UoL01NTU0vZywgbG9uZ01vbnRoc1ttb250aF0pXG4gICAgLnJlcGxhY2UoL01NTS9nLCBzaG9ydE1vbnRoc1ttb250aF0pXG4gICAgLnJlcGxhY2UoL01NL2csICgnMCcgKyAobW9udGggKyAxKSkuc2xpY2UoLTIpKVxuICAgIC5yZXBsYWNlKC9NL2csIG1vbnRoICsgMSlcbiAgICAucmVwbGFjZSgvRERERC9nLCBsb25nRGF5c1tkYXlPZldlZWtdKVxuICAgIC5yZXBsYWNlKC9EREQvZywgc2hvcnREYXlzW2RheU9mV2Vla10pXG4gICAgLnJlcGxhY2UoL0REL2csICgnMCcgKyBkYXkpLnNsaWNlKC0yKSlcbiAgICAucmVwbGFjZSgvRC9nLCBkYXkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3JkaW5hbChkYXk6IG51bWJlcik6IHN0cmluZyB7XG4gIGlmIChkYXkgPiAzICYmIGRheSA8IDIxKSB7IHJldHVybiAndGgnOyB9XG4gIHN3aXRjaCAoZGF5ICUgMTApIHtcbiAgICBjYXNlIDE6IHJldHVybiAnc3QnO1xuICAgIGNhc2UgMjogcmV0dXJuICduZCc7XG4gICAgY2FzZSAzOiByZXR1cm4gJ3JkJztcbiAgICBkZWZhdWx0OiByZXR1cm4gJ3RoJztcbiAgfVxufVxuIl19