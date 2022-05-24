const configDate = {
  enableTime: false,
  dateFormat: "Y-m-d",
  altInput: true,
  altFormat: "F j, Y"
};

const configTime = {
  enableTime: true,
  noCalendar: true,
  dateFormat: "H:i",
  altInput: true,
  altFormat: "h:S K"
};

flatpickr(".due-date-input", configDate);
flatpickr(".due-time-input", configTime);