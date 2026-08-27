import { scheduleFetchByDay } from "../../services/schedule-fetch-by-day.js"
import { hoursLoad } from "../form/hours-load.js"
import { refreshUI } from "../ui/enhance.js"
import { schedulesShow } from "./show.js"
import { enableEditButtons } from "./edit.js"
import { enableCompleteButtons } from "./complete.js"
import { currentFilter } from "./filter.js"

const selectedDate = document.querySelector('#date')

export async function schedulesDay() {
    const date = selectedDate.value

    const dailySchedules = await scheduleFetchByDay({ date })

    let filtered = dailySchedules

    if (currentFilter !== 'all') {
        filtered = dailySchedules.filter((schedule) => {
            return (schedule.status || 'pending') === currentFilter
        })
    }

    const emptyEl = document.querySelector('#empty-filtered')

    if (filtered.length === 0 && currentFilter !== 'all') {
        emptyEl.textContent = currentFilter === 'pending' ? 'Nenhum pendente' : 'Nenhum concluído'
        emptyEl.hidden = false
    } else {
        emptyEl.hidden = true
    }

    schedulesShow({ dailySchedules: filtered })

    enableCompleteButtons()

    hoursLoad({ date, dailySchedules })

    refreshUI()

    enableEditButtons()
}