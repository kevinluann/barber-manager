import { scheduleFetchByDay } from "../../services/schedule-fetch-by-day.js"
import { hoursLoad } from "../form/hours-load.js"
import { refreshUI } from "../ui/enhance.js"
import { schedulesShow } from "./show.js"
import { enableEditButtons } from "./edit.js"
import { enableCompleteButtons } from "./complete.js"

const selectedDate = document.querySelector('#date')

export async function schedulesDay() {
    const date = selectedDate.value

    const dailySchedules = await scheduleFetchByDay({ date })

    schedulesShow({ dailySchedules })

    enableCompleteButtons()

    hoursLoad({ date, dailySchedules })

    refreshUI()

    enableEditButtons()
}