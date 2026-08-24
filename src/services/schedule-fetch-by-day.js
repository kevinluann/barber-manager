import dayjs from "dayjs"
import { showToast } from "../modules/ui/toast.js"
import { apiConfig } from "./api-config.js"

export async function scheduleFetchByDay({ date }) {
    try {
        const response = await fetch(`${apiConfig.baseURL}/schedules`)

        const data = await response.json()

        const dailySchedules = data.filter((schedule) => {
            return dayjs(date).isSame(schedule.when, 'day')
        })

        return dailySchedules
    } catch (error) {
        showToast('Não foi possível buscar os agendamentos do dia.', 'error')
        console.log(error)
    }
}