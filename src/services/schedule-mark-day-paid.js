import { showToast } from "../modules/ui/toast.js"
import { apiConfig } from "./api-config.js"
import { scheduleFetchByDay } from "./schedule-fetch-by-day.js"

export async function scheduleMarkDayPaid({ date }) {
    try {
        const schedules = await scheduleFetchByDay({ date }) || []

        const pendingPayments = schedules.filter((schedule) => {
            return schedule.status === "pending" || (schedule.status === "done" && !schedule.paid)
        })

        if (pendingPayments.length === 0) {
            showToast("Nada em aberto neste dia.")
            return 0
        }

        for (const schedule of pendingPayments) {
            await fetch(`${apiConfig.baseURL}/schedules/${schedule.id}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ status: "done", paid: true, paidAt: new Date().toISOString() }),
            })
        }

        showToast(`${pendingPayments.length} pagamento(s) registrado(s).`)
        return pendingPayments.length
    } catch (error) {
        showToast("Não foi possível registrar os pagamentos.", "error")
        console.log(error)
    }
}