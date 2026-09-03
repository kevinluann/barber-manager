import dayjs from "dayjs"

import { scheduleFetchByDay } from "../../services/schedule-fetch-by-day.js"
import { scheduleComplete } from "../../services/schedule-complete.js"
import { hoursLoad } from "../form/hours-load.js"
import { refreshUI } from "../ui/enhance.js"
import { schedulesShow } from "./show.js"
import { enableEditButtons } from "./edit.js"
import { enableCompleteButtons } from "./complete.js"
import { applyStatusFilter, updateEmptyState } from "./filter.js"
import { sortSchedules } from "./sort.js"
import { filterBySearch } from "./search.js"
import { renderHistory } from "./history.js"

const selectedDate = document.querySelector('#date')

export async function schedulesDay() {
    const date = selectedDate.value

    const dailySchedules = await scheduleFetchByDay({ date })

    for (const schedule of dailySchedules) {
        if ((schedule.status) !== 'done' && dayjs(schedule.when).isBefore(dayjs())) {
            await scheduleComplete({ id: schedule.id })
        }
    }

    const updated = await scheduleFetchByDay({ date })

    let filtered = applyStatusFilter(updated)

    updateEmptyState(filtered)

    filtered = filterBySearch(filtered)
    filtered = sortSchedules(filtered)

    schedulesShow({ dailySchedules: filtered })

    await renderHistory()

    enableCompleteButtons()

    hoursLoad({ date, dailySchedules: updated })

    refreshUI(filtered)

    enableEditButtons()
}