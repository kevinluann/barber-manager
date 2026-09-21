import dayjs from "dayjs"

import { scheduleFetchByDay } from "../../services/schedule-fetch-by-day.js"
import { isHourAvailable } from "../../utils/schedule-availability.js"
import { scheduleUnblock } from "../../services/schedule-unblock.js"
import { scheduleBlock, scheduleFetchBlocked } from "../../services/schedule-block.js"
import { schedulesDay } from "./load.js"

const dateInput = document.querySelector('#date')
const blockHour = document.querySelector('#block-hour')
const blockBtn = document.querySelector('#block-btn')
const blockedList = document.querySelector('#blocked-list')

export async function renderBlockedList() {
    blockedList.replaceChildren()

    const blocked = await scheduleFetchBlocked({ date: dateInput.value })

    blocked.forEach((block) => {
        const li = document.createElement('li')
        li.className = 'blocked-item'
        li.innerHTML = `<span>${block.hour}</span><button type="button" data-unblock-id="${block.id}" aria-label="Desbloquear horário ${block.hour}"><img src="./assets/cancel.svg" alt="" aria-hidden="true" /></button>`

        blockedList.appendChild(li)
    })

    const blockedHours = blocked.map((block) => {
        return block.hour
    })
    const daily = await scheduleFetchByDay({ date: dateInput.value })
    const unavailable = daily.map((schedule) => {
        return dayjs(schedule.when).format('HH:mm')
    })

    const blockHourOptions = document.querySelectorAll('#block-hour option')

    blockHourOptions.forEach((opt) => {
        const isAvailable = isHourAvailable({ hour: opt.value, date: dateInput.value, unavailable, blocked: blockedHours })

        opt.disabled = !isAvailable
    })
}

blockedList.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-unblock-id]')

    if (!button) return

    await scheduleUnblock({ id: button.dataset.unblockId })

    await renderBlockedList()

    await schedulesDay()
})

renderBlockedList()