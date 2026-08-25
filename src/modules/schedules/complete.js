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

            const isConfirm = await showConfirm(`Concluir agendamento de ${li.dataset.name}?`)

            if (!isConfirm) return

            await scheduleComplete({ id: li.dataset.id })
            schedulesDay()
        })
    })
}