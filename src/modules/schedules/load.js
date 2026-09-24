import dayjs from "dayjs"

import { scheduleFetchByDay } from "../../services/schedule-fetch-by-day.js"
import { scheduleComplete } from "../../services/schedule-complete.js"
import { hoursLoad } from "../form/hours-load.js"
import { refreshUI } from "../ui/enhance.js"
import { showToast } from "../ui/toast.js"
import { initCustomSelects } from "../ui/custom-select.js"
import { enableRepeatToggle } from "../form/repeat.js"
import { initAlertsBell } from "../ui/alerts-bell.js"
import { schedulesShow } from "./show.js"
import { enableEditButtons } from "./edit.js"
import { enableCompleteButtons } from "./complete.js"
import { applyStatusFilter, updateEmptyState } from "./filter.js"
import { sortSchedules } from "./sort.js"
import { filterBySearch } from "./search.js"
import { renderHistory } from "./history.js"
import { renderBlockedList } from "./unblock.js"
import { enableNoShowButtons } from "./no-show.js"
import { renderRewardAlerts } from "./alerts.js"
import { buildServiceOptions } from "../form/service-options.js"

const selectedDate = document.querySelector('#date')

export async function schedulesDay() {
    const date = selectedDate.value

    const dailySchedules = await scheduleFetchByDay({ date })

    try {
        for (const schedule of dailySchedules) {
            if ((schedule.status) !== 'done' && dayjs(schedule.when).isBefore(dayjs())) {
                await scheduleComplete({ id: schedule.id, paid: false })
            }
        }
    } catch (error) {
        showToast('Erro ao atualizar passados.', 'error')
        console.log(error)
    }

    const updated = await scheduleFetchByDay({ date })

    let filtered = applyStatusFilter(updated)

    updateEmptyState(filtered)

    filtered = filterBySearch(filtered)
    filtered = sortSchedules(filtered)

    await schedulesShow({ dailySchedules: filtered })

    enableCompleteButtons()
    enableNoShowButtons()
    enableEditButtons()
    enableRepeatToggle()
    buildServiceOptions()
    initCustomSelects()
    initAlertsBell()

    await renderHistory()
    await renderRewardAlerts()

    await hoursLoad({ date, dailySchedules: updated })

    await renderBlockedList()

    refreshUI(filtered)
}