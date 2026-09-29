import dayjs from "dayjs"

import { apiConfig } from "../../services/api-config.js"
import { scheduleComplete } from "../../services/schedule-complete.js"
import { showConfirm } from "../ui/confirm.js"
import { schedulesDay } from "./load.js"

export function enableCompleteButtons() {
    const completeButtons = document.querySelectorAll('.complete-icon')

    completeButtons.forEach((button) => {
        if (button.dataset.bound) return

        button.dataset.bound = 'true'

        button.addEventListener('click', async () => {
            const response = await fetch(`${apiConfig.baseURL}/schedules`)
            const all = await response.json()

            const today = dayjs().format("YYYY-MM-DD")
            const li = button.closest('li[data-id]')

            const doneTodayCount = all.filter((schedule) =>
                schedule.name === li.dataset.name && schedule.status === "done" && dayjs(schedule.when).format("YYYY-MM-DD") === today
            ).length

            if (doneTodayCount > 0) {
                const { confirmed: reallyConfirm } = await showConfirm(`${li.dataset.name} já tem ${doneTodayCount} ${doneTodayCount === 1 ? "agendamento concluído" : "agendamentos concluídos "} hoje. Concluir mesmo assim?`, "Concluir", "Manter")

                if (!reallyConfirm) return
            }

            const { confirmed, paid } = await showConfirm(`Concluir agendamento de ${li.dataset.name}?`, 'Concluir', 'Cancelar', { showPaid: true })

            if (!confirmed) return

            await scheduleComplete({ id: li.dataset.id, paid })
            await schedulesDay()
        })
    })
}