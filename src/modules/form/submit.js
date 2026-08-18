import dayjs from "dayjs"

const selectedDate = document.querySelector('#date')

const inputToday = dayjs().format('YYYY-MM-DD')

selectedDate.value = inputToday
selectedDate.min = inputToday
selectedDate.max = dayjs().add(1, 'month').format('YYYY-MM-DD')