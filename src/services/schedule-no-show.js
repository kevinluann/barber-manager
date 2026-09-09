import { showToast } from "../modules/ui/toast.js"
import { apiConfig } from "./api-config.js"

export async function scheduleNoShow({ id }) {
    try {
        await fetch(`${apiConfig.baseURL}/schedules/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ status: 'no_show' })
        })
    } catch (error) {
        showToast('Não foi possível atualizar o status.', 'error')
        console.log(error)
    }
}