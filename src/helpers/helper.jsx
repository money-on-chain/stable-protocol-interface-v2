export const myParseDate = (date_string) => {
    let [y, M, d, h, m, s] = date_string.split(/[- :T]/);
    return new Date(y, parseInt(M) - 1, d, h, parseInt(m), s.replace('Z', ''));
};
