export const dateUtils = (stakedDate: number) => {
  var currentDate = new Date(stakedDate);

  var date = currentDate.getDate();
  var month = currentDate.getMonth();
  var year = currentDate.getFullYear();
  var hours = currentDate.getHours();
  var min = currentDate.getMinutes();

  var minutes = min < 10 ? "0" + min : min;

  var dateString =
    year + "." + (month + 1) + "." + date + "." + hours + ":" + minutes;
  return dateString;
};
