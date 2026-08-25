import { showToast } from "../modules/ui/toast.js"
import { apiConfig } from "./api-config.js"

export async function scheduleComplete({ id }) {
    try {
        await fetch(`${apiConfig.baseURL}/schedules/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ status: 'done' })
        })

        showToast('Agendamento concluído com sucesso.')
    } catch (error) {
        showToast('Não foi possível concluir o agendamento.', 'error')
        console.log(error)
    }
}