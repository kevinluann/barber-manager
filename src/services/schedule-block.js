import { showToast } from "../modules/ui/toast.js"
import { apiConfig } from "./api-config.js"

export async function scheduleBlock({ date, hour }) {
    try {
        await fetch(`${apiConfig.baseURL}/blocked`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ date, hour, reason: 'Bloqueado' })
        })
    } catch (error) {
        showToast('Não foi possível bloquear o agendamento.', 'error')
        console.log(error)
    }
}

export async function scheduleFetchBlocked({ date }) {
    try {
        const response = await fetch(`${apiConfig.baseURL}/blocked`)
        const all = await response.json()

        const filtered = all.filter((blocked) => {
            return blocked.date === date
        })

        const hours = filtered.map((blocked) => {
            return blocked.hour
        })

        return hours
    } catch (error) {
        showToast('Não foi possivel buscar os agendamentos bloqueados.')
        console.log(error)
    }
}