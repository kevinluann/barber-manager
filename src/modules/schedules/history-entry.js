import dayjs from "dayjs"

export function buildHistoryEntry(schedule, { clientName, showClientName = false }) {
    const statusNames = { pending: "Pendente", done: "Concluído", no_show: "Faltou" }
    const status = statusNames[schedule.status]
    const service = schedule.service[0].toUpperCase() + schedule.service.slice(1)

    const entry = document.createElement("div")
    entry.className = "history-entry"

    if (schedule.status === "no_show") {
        entry.classList.add("is-no-show")
    }

    const dateSpan = document.createElement("span")
    dateSpan.textContent = dayjs(schedule.when).format("DD/MM HH:mm")

    const infoSpan = document.createElement("span")
    infoSpan.textContent = showClientName ? `${clientName} - ${service} - ${status}` : `${service} - ${status}`

    entry.append(dateSpan, infoSpan)

    if (schedule.status === "done") {
        const isPaid = schedule.paid === true

        const paidTag = document.createElement("button")
        paidTag.type = "button"
        paidTag.className = isPaid ? "history-paid" : "history-unpaid"
        paidTag.textContent = isPaid ? "PAGO" : "EM ABERTO"

        entry.append(paidTag)
    }

    if (schedule.notes) {
        const notesEl = document.createElement("p")
        notesEl.className = "history-notes"
        notesEl.textContent = schedule.notes

        entry.appendChild(notesEl)
    }

    return entry
}