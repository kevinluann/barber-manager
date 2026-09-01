import dayjs from "dayjs"
import { scheduleFetchByDay } from "../../services/schedule-fetch-by-day.js"

export async function renderHistory() {
    const container = document.querySelector('#history-7d')
    container.replaceChildren()

    for (const i of [6, 5, 4, 3, 2, 1, 0]) {
        const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD')
        const schedules = await scheduleFetchByDay({ date })
        const label = dayjs(date).format('DD/MM')

        const item = document.createElement('span')
        item.className = 'history-item'
        item.textContent = `${label}: ${schedules.length}`
        container.appendChild(item)
    }
}