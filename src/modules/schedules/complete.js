import { scheduleComplete } from "../../services/schedule-complete.js"
import { showConfirm } from "../ui/confirm.js"
import { schedulesDay } from "./load.js"

export function enableCompleteButtons() {
    const completeButtons = document.querySelectorAll('.complete-icon')

    completeButtons.forEach((button) => {
        if (button.dataset.bound) return

        button.dataset.bound = 'true'

        button.addEventListener('click', async () => {
            const li = button.closest('li[data-id]')

            const { confirmed, paid } = await showConfirm(`Concluir agendamento de ${li.dataset.name}?`, 'Concluir', 'Cancelar', { showPaid: true })

            if (!confirmed) return

            await scheduleComplete({ id: li.dataset.id, paid })
            await schedulesDay()
        })
    })
}