import { showToast } from "../modules/ui/toast.js"
import { apiConfig } from "./api-config.js"

export async function scheduleCancel({ id }) {
    try {
        await fetch(`${apiConfig.baseURL}/schedules/${id}`, {
            method: 'DELETE'
        })

        showToast('Agendamento cancelado com sucesso!', 'success')
    } catch (error) {
        showToast('Não foi possível cancelar o agendamento.', 'error')
        console.log(error)
    }
}