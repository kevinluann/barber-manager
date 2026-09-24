import { showToast } from "../modules/ui/toast.js"
import { apiConfig } from "./api-config.js"

export async function scheduleComplete({ id, paid }) {
    const paidAt = paid ? new Date().toISOString() : null

    try {
        await fetch(`${apiConfig.baseURL}/schedules/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ status: "done", paid, paidAt })
        })

        showToast('Agendamento concluído com sucesso.')
    } catch (error) {
        showToast('Não foi possível concluir o agendamento.', 'error')
        console.log(error)
    }
}