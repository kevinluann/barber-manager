import { showToast, showToastWithUndo } from "../modules/ui/toast.js"
import { schedulesDay } from "../modules/schedules/load.js"
import { scheduleRestore } from "./schedule-restore.js"
import { apiConfig } from "./api-config.js"

export async function scheduleCancel({ id }) {
    try {
        const response = await fetch(`${apiConfig.baseURL}/schedules/${id}`)
        const backup = await response.json()

        await fetch(`${apiConfig.baseURL}/schedules/${id}`, {
            method: 'DELETE'
        })

        setupUndoToast(backup)
    } catch (error) {
        showToast('Não foi possível cancelar o agendamento.', 'error')
        console.log(error)
    }
}

function setupUndoToast(backup) {
    const toast = showToastWithUndo('Agendamento cancelado com sucesso!')
    const undoBtn = toast.querySelector('.toast-undo')

    undoBtn.addEventListener('click', async () => {
        await scheduleRestore(backup)
        await schedulesDay()

        toast.remove()
    })
}