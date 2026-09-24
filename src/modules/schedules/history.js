import dayjs from "dayjs"

import { scheduleFetchByDay } from "../../services/schedule-fetch-by-day.js"

export async function renderHistory() {
    const container = document.querySelector('#history-7d')
    container.replaceChildren()

    let weekTotal = 0
    let weekToReceive = 0

    for (const i of [6, 5, 4, 3, 2, 1, 0]) {
        const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD')
        const schedules = await scheduleFetchByDay({ date }) || []
        const label = dayjs(date).format('DD/MM')

        const paidSchedules = schedules.filter((schedule) => schedule.status === "done" && schedule.paid)
        const unpaidSchedules = schedules.filter((schedule) => schedule.status === "done" && !schedule.paid)

        const dayRevenue = sum(paidSchedules)
        const dayToReceive = sum(unpaidSchedules)

        weekTotal += dayRevenue
        weekToReceive += dayToReceive

        const item = document.createElement('span')
        item.className = 'history-item'
        item.textContent = `${label}: ${schedules.length} · R$${dayRevenue}`
        container.appendChild(item)
    }

    const totalEl = document.createElement('span')
    totalEl.className = 'history-item history-item--total'

    const totalIcon = document.createElement('img')
    totalIcon.src = './assets/coin.svg'
    totalIcon.alt = ''
    totalIcon.setAttribute('aria-hidden', 'true')

    const totalText = document.createElement('span')
    totalText.textContent = weekToReceive > 0 ? `Semana R$${weekTotal} (+R$${weekToReceive} a receber)` : `Semana R$${weekTotal}`

    totalEl.append(totalIcon, totalText)
    container.appendChild(totalEl)
}

function sum(list) {
    return list.reduce((total, schedule) => {
        return total + (Number(schedule.price) || 0)
    }, 0)
}