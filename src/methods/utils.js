// функция для создания задержки, ms - на сколько миллисекунд
export const sleep = ms => new Promise(res => setTimeout(res, ms));

// форматирование даты для отправки в виде дд/мм
// daysAgo - дата за сколько дней назад от текущего будет получена
// пример: getDateDaysAgo(0) - сегодняшняя дата, getDateDaysAgo(1) - вчерашняя
export function getDateDaysAgo(daysAgo) {
  const result = {};
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  result.timestamp = date;
  date.getDate() > 9 ? result.formatted = `${date.getDate()}/` : result.formatted = `0${date.getDate()}/`;
  date.getMonth() > 8 ? result.formatted += `${date.getMonth() + 1}` : result.formatted += `0${date.getMonth() + 1}`;
  return result;
}

export function getDateHoursAgo(hoursAgo) {
  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);
  return date;
}

export function round(value) {
  return Math.round(value * 100) / 100;
}


export function isKyrillic(str) {
  return /[а-яё -0-9_.,?!()]/i.test(str.toLowerCase());
}

export function isLatinic(str) {
  return /[a-z -0-9_.,?!()]/i.test(str.toLowerCase());
}

export function checkArraySortedById(array) {
  // check if received array is sorted
  if (array.length === 0 || array.length === 1) return true;
  let sorted = true;
  for (let i = 1; i < array.length; i++) {
    if (array[i].id < array[i - 1].id) {
      sorted = false;
      return sorted;
    }
  }
  return sorted;
}

export function formatDateYyyyMmDd(date) {
  let result = `${date.getFullYear()}-`;
  date.getMonth() < 9 ? result += `0${date.getMonth() + 1}-` : result += `${date.getMonth() + 1}-`;
  date.getDate() < 10 ? result += `0${date.getDate()}` : result += `${date.getDate()}`;
  return result;
}

export function formatDateYyyyMmDdHhIiSs(date) {
  let result = formatDateYyyyMmDd(date);
  date.getHours() < 10 ? result += ` 0${date.getHours()}:` : result += ` ${date.getHours()}:`;
  date.getMinutes() < 10 ? result += `0${date.getMinutes()}:` : result += `${date.getMinutes()}:`;
  date.getSeconds() < 10 ? result += `0${date.getSeconds()}` : result += `${date.getSeconds()}`;
  return result;
}

export function dateRemoveTZ(date) {
  return (date.replace('T', ' ')).slice(0, date.length - 5);
}

export function rndNumInRange(min, max) {
  return Math.floor((Math.random() * (max - min) + min) * 100) / 100;
}
