import dayjs from "dayjs"
import { schedulesDay } from "../schedules/load.js"

const dateInput = document.querySelector('#date')
const prevButton = document.querySelector('#date-prev')
const nextButton = document.querySelector('#date-next')
const todayButton = document.querySelector('#date-today')

function shiftDate(days) {
    const current = dayjs(dateInput.value)
    const next = current.add(days, 'day').format('YYYY-MM-DD')

    if (next < dateInput.min || next > dateInput.max) return

    dateInput.value = next
    schedulesDay()
}

prevButton.addEventListener('click', () => shiftDate(-1))
nextButton.addEventListener('click', () => shiftDate(+1))

todayButton.addEventListener('click', () => {
    const today = dayjs().format('YYYY-MM-DD')
    dateInput.value = today
    schedulesDay()
})