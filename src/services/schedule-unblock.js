import { showToast } from "../modules/ui/toast.js"
import { apiConfig } from "./api-config.js"

export async function scheduleUnblock({ id }) {
    try {
        await fetch(`${apiConfig.baseURL}/blocked/${id}`, {
            method: 'DELETE'
        })
    } catch (error) {
        showToast('Não foi posssível desbloquear.')
        console.log(error)
    }
}