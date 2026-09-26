import { scheduleTogglePaid } from "../../services/schedule-toggle-paid.js"
import { showConfirm } from "../ui/confirm.js"
import { schedulesDay } from "./load.js"

export function enablePaidToggle() {
    const paidBadges = document.querySelectorAll(".badge-paid, .badge-unpaid")

    paidBadges.forEach((badge) => {
        if (badge.dataset.bound) return
        badge.dataset.bound = "true"

        badge.addEventListener("click", async (event) => {
            const { id } = badge.dataset
            const isPaid = badge.dataset.paid === "true"

            const { confirmed } = await showConfirm(`Marcar corte de ${badge.dataset.name} (R$${badge.dataset.price}) como ${isPaid ? "não pago" : "pago"}?`, isPaid ? "Desmarcar" : "Marcar pago", "Manter", { tone: isPaid ? "danger" : "success" })

            if (!confirmed) return

            await scheduleTogglePaid({ id, paid: !isPaid })
            await schedulesDay()
        })
    })
}