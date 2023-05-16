/**
 * Set date as the coming day.
 * @param {Date} date
 * @returns {Date}
 */
function addDay(date) {
  date.setDate(date.getDate() + 1);
  return date;
}

/**
 * Whether two date objects refer to same date (year, month, day).
 * @param {Date} dateA
 * @param {Date} dateB
 * @returns
 */
function isSameDate(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

/**
 * Whether a date is tomorrow from current date.
 * @param {Date} date
 * @returns {boolean}
 */
function isTomorrow(date) {
  const tomorrow = addDay(new Date());
  return isSameDate(date, tomorrow);
}

module.exports = {
  addDay,
  isTomorrow,
};
