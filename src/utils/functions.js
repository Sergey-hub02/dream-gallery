/**
 * Преобрузет дату и время из базы данных в человекочитаемые дату и время
 * @param {string} date       строка, описывающая дату и время из базы данных
 * @returns {`${string} ${string}`}
 */
export const getTime = date => {
  const dateObj = new Date(date);

  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();

  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();

  const datePart =  [
    (day > 9 ? "" : "0") + day,
    (month > 9 ? "" : "0") + month,
    year,
  ].join(".");

  const timePart = [
    (hours > 9 ? "" : "0") + hours,
    (minutes > 9 ? "" : "0") + minutes,
  ].join(":");

  return `${datePart} ${timePart}`;
}
