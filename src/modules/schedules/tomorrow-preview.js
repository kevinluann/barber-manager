import dayjs from "dayjs"

import { scheduleFetchByDay } from "../../services/schedule-fetch-by-day.js"

export async function renderTomorrowPreview() {
    const selectedDate = document.querySelector("#date").value

    const tomorrow = dayjs(selectedDate).add(1, "day").format("YYYY-MM-DD")
    const schedules = await scheduleFetchByDay({ date: tomorrow }) || []

    const text = document.querySelector("#tomorrow-preview-text")

    if (schedules.length === 0) {
        text.textContent = "Amanhã livre"
        return
    }

    const hours = schedules.map((schedule) => dayjs(schedule.when).format("HH:mm"))
    const orderedHours = hours.sort((hourA, hourB) => hourA.localeCompare(hourB))
    const earliestHour = orderedHours[0]

    const appointmentLabel = schedules.length === 1 ? "agendado" : "agendados"
    text.textContent = `Amanhã: ${schedules.length} ${appointmentLabel} · primeiro às ${earliestHour}`
}