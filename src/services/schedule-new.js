import { showToast } from "../modules/ui/toast.js"
import { apiConfig } from "./api-config.js"

export async function scheduleNew({ name, when, service, duration, status, notes }) {
    try {
        await fetch(`${apiConfig.baseURL}/schedules`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ name, when, service, duration, status, notes })
        })

        showToast('Agendamento realizado com sucesso.', 'success')
    } catch (error) {
        showToast('Não foi possível agendar. Tente novamente mais tarde.', 'error')
        console.log(error)
    }
}