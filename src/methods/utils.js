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
  const month = date.getMonth() >= 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
  result.formatted = `${date.getDate()}/${month}`;
  return result;
}

export function getDateHoursAgo(hoursAgo) {
  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);
  return date;
}
