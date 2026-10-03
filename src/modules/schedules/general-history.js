import dayjs from "dayjs"

import { apiConfig } from "../../services/api-config.js"
import { buildHistoryEntry } from "./history-entry.js"
import { togglePaidStatus } from "./toggle-paid.js"
import { showClientHistory } from "./history-client.js"
import { schedulesDay } from "./load.js"

const dialog = document.querySelector("#general-history-dialog")
const list = document.querySelector("#general-history-list")
const search = document.querySelector("#general-history-search")
const count = document.querySelector("#general-history-count")
const openBtn = document.querySelector("#general-history-open")
const closeBtn = document.querySelector("#general-history-close")

const PAGE_SIZE = 100
let allSchedules = []

async function refreshGeneralHistoryData() {
    const response = await fetch(`${apiConfig.baseURL}/schedules`)
    allSchedules = await response.json()
}

async function renderGeneralHistory() {
    const searchTerm = search.value.trim().toLowerCase()

    const filtered = allSchedules.filter((schedule) => {
        return !searchTerm || schedule.name.toLowerCase().includes(searchTerm) || schedule.service.toLowerCase().includes(searchTerm)
    })

    const sortedSchedules = filtered.sort((scheduleA, scheduleB) => new Date(scheduleB.when) - new Date(scheduleA.when))

    const visible = filtered.slice(0, PAGE_SIZE)

    list.replaceChildren()

    visible.forEach((schedule) => {
        const historyEntry = buildHistoryEntry(schedule, { clientName: schedule.name, showClientName: true })
        const paidTag = historyEntry.querySelector(".history-paid, .history-unpaid")

        if (paidTag) {
            paidTag.addEventListener("click", async () => {
                const paymentChanged = await togglePaidStatus({
                    id: schedule.id,
                    name: schedule.name,
                    detail: dayjs(schedule.when).format("DD/MM"),
                    isPaid: schedule.paid === true,
                })

                if (paymentChanged) {
                    await refreshGeneralHistoryData()
                    renderGeneralHistory()
                }
            })
        }

        historyEntry.addEventListener("click", (event) => {
            if (event.target.closest("button")) return

            showClientHistory(schedule.name)
        })

        list.appendChild(historyEntry)
    })

    count.textContent = `Mostrando ${visible.length} de ${filtered.length}`

    await schedulesDay()
}

export async function openGeneralHistory() {
    await refreshGeneralHistoryData()

    search.value = ""

    renderGeneralHistory()

    if (!dialog.open) {
        dialog.showModal()
    }
}

export function initGeneralHistory() {
    if (!openBtn || openBtn.dataset.bound) return
    openBtn.dataset.bound = "true"

    openBtn.addEventListener("click", () => openGeneralHistory())
    closeBtn.addEventListener("click", () => dialog.close())
    search.addEventListener("input", () => renderGeneralHistory())
}