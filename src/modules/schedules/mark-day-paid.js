import { scheduleMarkDayPaid } from "../../services/schedule-mark-day-paid.js"
import { showConfirm } from "../ui/confirm.js"
import { schedulesDay } from "./load.js"

export function enableMarkDayPaid() {
    const button = document.querySelector("#mark-day-paid")
    if (!button || button.dataset.bound) return
    button.dataset.bound = "true"

    button.addEventListener("click", async () => {
        const date = document.querySelector("#date").value

        const { confirmed } = await showConfirm("Concluir pendentes e marcar o dia como pago?", "Marcar pago", "Manter", { tone: "success" })

        if (!confirmed) return

        await scheduleMarkDayPaid({ date })
        await schedulesDay()
    })
}