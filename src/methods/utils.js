// функция для создания задержки, ms - на сколько миллисекунд
export function sleep(ms) {
  const startTime = (new Date()).getTime();
  while ((new Date()).getTime() < startTime + ms) {}
}

// форматирование даты для отправки в виде дд/мм
// daysAgo - дата за сколько дней назад от текущего будет получена
// пример: getFormattedDate(0) - сегодняшняя дата, getFormattedDate(1) - вчерашняя
export function getFormattedDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return `${date.getDate()}/${date.getMonth() + 1}`;
}
