
export function randomStr(length = 6) {
    if (length > 10) {
        let finalStr = '';
        for (let i = 0; i < ((length - length % 10) / 10); i++) {
            finalStr += Math.random().toString(36).slice(-10);
        }
        if (length % 10 === 0) {
            return finalStr;
        } else
            return finalStr + Math.random().toString(36).slice(-(length % 10));
    } else
        return Math.random().toString(36).slice(-length);
}

export function randomNum() { // returns 7 numbers *** ** **
    return Math.floor(Math.random() * 9999999) + 1;
}
