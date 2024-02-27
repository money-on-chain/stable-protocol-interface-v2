import { formatLocalMap2 } from "./Formats";
export const myParseDate = (date_string) => {
    let [y, M, d, h, m, s] = date_string.split(/[- :T]/);
    return new Date(y, parseInt(M) - 1, d, h, parseInt(m), s.replace('Z', ''));
};
export function setToLocaleString(value, fixed, i18n) {
    return Number(value).toLocaleString(formatLocalMap2[i18n.languages[0]], {
        minimumFractionDigits: fixed,
        maximumFractionDigits: fixed
    });
}
export function setNumber(number) {
    const strNumber = number.toString();
    if (strNumber.indexOf('.') !== -1) {
        const result = strNumber.indexOf('.');
        const result2 = strNumber.substring(0, result);
        return result2;
    } else {
        return strNumber;
    }
}