import { scheduleTogglePaid } from "../../services/schedule-toggle-paid.js"
import { showConfirm } from "../ui/confirm.js"
import { schedulesDay } from "./load.js"

export function enablePaidToggle() {
    const paidBadges = document.querySelectorAll(".badge-paid, .badge-unpaid")

    paidBadges.forEach((badge) => {
        if (badge.dataset.bound) return
        badge.dataset.bound = "true"

        badge.addEventListener("click", async () => {
            const paymentChanged = await togglePaidStatus({
                id: badge.dataset.id,
                name: badge.dataset.name,
                detail: `R$${badge.dataset.price}`,
                isPaid: badge.dataset.paid === "true",
            })

            if (paymentChanged) {
                await schedulesDay()
            }
        })
    })
}

export async function togglePaidStatus({ id, name, detail, isPaid }) {
    const { confirmed } = await showConfirm(
        `Marcar corte de ${name} (${detail}) como ${isPaid ? "não pago" : "pago"}?`,
        isPaid ? "Desmarcar" : "Marcar pago", "Manter",
        { tone: isPaid ? "danger" : "success" }
    )

    if (!confirmed) return false

    await scheduleTogglePaid({ id, paid: !isPaid })

    return true
}