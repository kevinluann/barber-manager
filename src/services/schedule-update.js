import { apiConfig } from "./api-config.js"
import { showToast } from "../modules/ui/toast.js"

export async function scheduleUpdate({ id, name, when }) {
    try {
        await fetch(`${apiConfig.baseURL}/schedules/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ name, when })
        })

        showToast('Agendamento atualizado', 'success')
    } catch (error) {
        showToast('Não foi possível atualizar o agendamento.', 'error')
        console.log(error)
    }
}