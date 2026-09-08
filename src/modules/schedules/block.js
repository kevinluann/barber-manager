import dayjs from "dayjs"

import { isHourAvailable } from "../../utils/schedule-availability.js"
import { scheduleFetchBlocked } from "../../services/schedule-block.js"
import { scheduleFetchByDay } from "../../services/schedule-fetch-by-day.js"
import { scheduleBlock } from "../../services/schedule-block.js"
import { showToast } from "../ui/toast.js"
import { schedulesDay } from "./load.js"

const dateInput = document.querySelector('#date')
const blockHour = document.querySelector('#block-hour')
const blockBtn = document.querySelector('#block-btn')

blockBtn.addEventListener('click', async () => {
    try {
        const blocked = await scheduleFetchBlocked({ date: dateInput.value })

        const daily = await scheduleFetchByDay({ date: dateInput.value })

        const unavailable = daily.map((schedule) => {
            return dayjs(schedule.when).format('HH:mm')
        })

        if (!isHourAvailable({ hour: blockHour.value, date: dateInput.value, unavailable, blocked })) {
            return showToast('Horário indisponível para bloqueio', 'error')
        }

        await scheduleBlock({ date: dateInput.value, hour: blockHour.value })

        showToast(`Horário ${blockHour.value} bloqueado`, 'success')

        await schedulesDay()
    } catch (error) {
        showToast('Não foi possível bloquear', 'error')
        console.log(error)
    }
})