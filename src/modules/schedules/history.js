import dayjs from "dayjs"

import { scheduleFetchByDay } from "../../services/schedule-fetch-by-day.js"

export async function renderHistory() {
    const container = document.querySelector('#history-7d')
    container.replaceChildren()

    let weekTotal = 0

    for (const i of [6, 5, 4, 3, 2, 1, 0]) {
        const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD')
        const schedules = await scheduleFetchByDay({ date }) || []
        const label = dayjs(date).format('DD/MM')

        const doneSchedules = schedules.filter((schedule) => {
            return schedule.status === 'done'
        })
        const dayRevenue = doneSchedules.reduce((sum, schedule) => {
            return sum + (Number(schedule.price) || 0)
        }, 0)

        weekTotal += dayRevenue

        const item = document.createElement('span')
        item.className = 'history-item'
        item.textContent = `${label}: ${schedules.length} · R$${dayRevenue}`
        container.appendChild(item)
    }

    const totalEl = document.createElement('span')
    totalEl.className = 'history-item history-item--total'
    totalEl.textContent = `Semana R$${weekTotal}`
    container.appendChild(totalEl)
}