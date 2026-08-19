import { schedulesDay } from "../schedules/load"

const selectedDate = document.querySelector('#date')

selectedDate.addEventListener('change', () => {
    schedulesDay()
})