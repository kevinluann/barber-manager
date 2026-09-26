import dayjs from "dayjs"

import { scheduleFetchByDay } from "../../services/schedule-fetch-by-day.js"
import { schedulesDay } from "../schedules/load"
import { showToast } from "../ui/toast.js"

const selectedDate = document.querySelector('#date')
let lastValidDate = selectedDate.value

selectedDate.addEventListener('change', async () => {
    if (dayjs(selectedDate.value).isBefore(dayjs().startOf("day"))) {
        const schedules = await scheduleFetchByDay({ date: selectedDate.value }) || []

        if (schedules.length === 0) {
            showToast("Sem agendamentos neste dia.")
            selectedDate.value = lastValidDate

            return
        }
    }

    lastValidDate = selectedDate.value

    await schedulesDay()
})