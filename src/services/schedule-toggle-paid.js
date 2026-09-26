import { showToast } from "../modules/ui/toast.js"
import { apiConfig } from "./api-config.js"

export async function scheduleTogglePaid({ id, paid }) {
    const paidAt = paid ? new Date().toISOString() : null

    try {
        await fetch(`${apiConfig.baseURL}/schedules/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ paid, paidAt })
        })

        showToast(paid ? 'Pagamento registrado.' : 'Marcado como não pago.')
    } catch (error) {
        showToast('Não foi possível atualizar o pagamento.', 'error')
        console.log(error)
    }
}