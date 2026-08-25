import { scheduleCancel } from "../../services/schedule-cancel.js"
import { showConfirm } from "../ui/confirm.js"
import { schedulesDay } from "./load"

const periods = document.querySelectorAll('.period')

periods.forEach((period) => {
    period.addEventListener('click', async (event) => {
        if (event.target.closest('.cancel-icon')) {
            const item = event.target.closest('li')
            const { id } = item.dataset

            if (id) {
                const isConfirm = await showConfirm('Tem certeza que deseja remover o agendamento?', 'Remover', 'Manter')

                if (isConfirm) {
                    await scheduleCancel({ id })
                    schedulesDay()
                }
            }
        }
    })
})