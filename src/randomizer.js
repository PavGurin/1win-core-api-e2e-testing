const maxLength = 7;

const randomStr = (size = 6) => (
  Math
    .random()
    .toString(36)
    .substring(2, 9)
    .substring(0, size)
  + (size > maxLength ? randomStr(size - maxLength) : '')
);

export { randomStr };

// returns 7 numbers *** ** **
export const randomNum = () => Math.floor(Math.random() * 9999999) + 1;
