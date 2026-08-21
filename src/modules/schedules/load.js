import { scheduleFetchByDay } from "../../services/schedule-fetch-by-day.js"
import { hoursLoad } from "../form/hours-load.js"

const selectedDate = document.querySelector('#date')

export async function schedulesDay() {
    const date = selectedDate.value

    const dailySchedules = await scheduleFetchByDay({ date })

    hoursLoad({ date })
}