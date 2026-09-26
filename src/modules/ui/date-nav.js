import dayjs from "dayjs"

import { apiConfig } from "../../services/api-config.js"
import { schedulesDay } from "../schedules/load.js"
import { showToast } from "./toast.js"
import { updateCalendarSelectedDate } from "./calendar.js"

const dateInput = document.querySelector('#date')
const prevButton = document.querySelector('#date-prev')
const nextButton = document.querySelector('#date-next')
const todayButton = document.querySelector('#date-today')

async function shiftDate(days) {
    const selectedDay = dayjs(dateInput.value)
    const next = selectedDay.add(days, 'day').format('YYYY-MM-DD')

    if (next < dateInput.min || next > dateInput.max) return

    dateInput.value = next

    updateCalendarSelectedDate()

    await schedulesDay()
}

async function goToPreviousDayWithSchedules() {
    const response = await fetch(`${apiConfig.baseURL}/schedules`)
    const all = await response.json()

    const selectedDay = dayjs(dateInput.value).startOf("day")
    let previousDayWithSchedules = null

    all.forEach((schedule) => {
        const scheduleDay = dayjs(schedule.when).startOf("day")

        if (scheduleDay.isBefore(selectedDay) && (!previousDayWithSchedules || scheduleDay.isAfter(previousDayWithSchedules))) {
            previousDayWithSchedules = scheduleDay
        }
    })

    if (!previousDayWithSchedules) {
        showToast("Sem agendamentos em dias anteriores.")

        return
    }

    dateInput.value = previousDayWithSchedules.format("YYYY-MM-DD")

    updateCalendarSelectedDate()

    await schedulesDay()
}

prevButton.addEventListener("click", () => goToPreviousDayWithSchedules())
nextButton.addEventListener('click', () => shiftDate(+1))

todayButton.addEventListener('click', async () => {
    const today = dayjs().format('YYYY-MM-DD')
    dateInput.value = today

    updateCalendarSelectedDate()

    await schedulesDay()
})