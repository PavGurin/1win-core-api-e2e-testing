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
  result.formatted = `${date.getDate()}/${date.getMonth() + 1}`;
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
