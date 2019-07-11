// функция для создания задержки, ms - на сколько миллисекунд
export const sleep = ms => new Promise(res => setTimeout(res, ms));

// форматирование даты для отправки в виде дд/мм
// daysAgo - дата за сколько дней назад от текущего будет получена
// пример: getFormattedDate(0) - сегодняшняя дата, getFormattedDate(1) - вчерашняя
export function getFormattedDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return `${date.getDate()}/${date.getMonth() + 1}`;
}
