import { scheduleNoShow } from "../../services/schedule-no-show.js"
import { showConfirm } from "../ui/confirm.js"
import { schedulesDay } from "./load.js"

export function enableNoShowButtons() {
    const noShowButtons = document.querySelectorAll('.no-show-icon')

    noShowButtons.forEach((button) => {
        if (button.dataset.bound) return

        button.dataset.bound = 'true'

        button.addEventListener('click', async () => {
            const li = button.closest('li[data-id]')
            const ok = await showConfirm(`Marcar falta de ${li.dataset.name}?`, 'Faltou', 'Manter')

            if (!ok) return

            await scheduleNoShow({ id: li.dataset.id })

            await schedulesDay()
        })
    })
}