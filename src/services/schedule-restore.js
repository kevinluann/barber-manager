import { showToast } from "../modules/ui/toast.js"
import { apiConfig } from "./api-config.js"

export async function scheduleRestore(data) {
    try {
        const { id: _, ...clean } = data

        await fetch(`${apiConfig.baseURL}/schedules`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(clean)
        })
    } catch (error) {
        showToast('Não foi possível restaurar', 'error')
        console.log(error)
    }
}