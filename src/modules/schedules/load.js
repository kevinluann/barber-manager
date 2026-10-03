import dayjs from "dayjs"

import { scheduleFetchByDay } from "../../services/schedule-fetch-by-day.js"
import { scheduleComplete } from "../../services/schedule-complete.js"
import { hoursLoad } from "../form/hours-load.js"
import { refreshUI } from "../ui/enhance.js"
import { showToast } from "../ui/toast.js"
import { initCustomSelects } from "../ui/custom-select.js"
import { enableRepeatToggle } from "../form/repeat.js"
import { initAlertsBell } from "../ui/alerts-bell.js"
import { buildServiceOptions } from "../form/service-options.js"
import { initCalendar } from "../ui/calendar.js"
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
import { enableSchedulePaidToggle } from "./toggle-paid.js"
import { initGeneralHistory } from "./general-history.js"
import { renderTomorrowPreview } from "./tomorrow-preview.js"

const selectedDate = document.querySelector('#date')

export async function schedulesDay() {
    const date = selectedDate.value

    const initialSchedules = await scheduleFetchByDay({ date })

    try {
        for (const schedule of initialSchedules) {
            if (schedule.status === 'pending' && dayjs(schedule.when).isBefore(dayjs())) {
                await scheduleComplete({ id: schedule.id, paid: false })
            }
        }
    } catch (error) {
        showToast('Erro ao atualizar passados.', 'error')
        console.log(error)
    }

    const freshSchedules = await scheduleFetchByDay({ date })

    let visibleSchedules = applyStatusFilter(freshSchedules)

    updateEmptyState(visibleSchedules)

    visibleSchedules = filterBySearch(visibleSchedules)
    visibleSchedules = sortSchedules(visibleSchedules)

    await schedulesShow({ dailySchedules: visibleSchedules })

    enableCompleteButtons()
    enableNoShowButtons()
    enableEditButtons()
    enableRepeatToggle()
    enableSchedulePaidToggle()
    buildServiceOptions()
    initCustomSelects()
    initAlertsBell()
    initCalendar()
    initGeneralHistory()

    await renderHistory()
    await renderRewardAlerts()

    await renderTomorrowPreview()

    await hoursLoad({ date, dailySchedules: freshSchedules })

    await renderBlockedList()

    refreshUI(freshSchedules)
}