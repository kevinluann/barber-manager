import dayjs from "dayjs"

import { apiConfig } from "../../services/api-config.js"
import { hasRewardFor, isAbsentFor } from "../../utils/client-rules.js"
import { updateAlertsBadge, updateSeeAllButtons } from "../ui/alerts-bell.js"
import { showClientHistory } from "./history-client.js"

const dismissedAlerts = {}
let showAllRewards = false
let showAllAbsents = false

function buildRewardAlert(name, done, total) {
    const alert = document.createElement("div")
    alert.className = "reward-alert"
    alert.setAttribute("role", "button")
    alert.tabIndex = 0

    const tag = document.createElement("span")
    tag.className = "reward-tag"
    tag.textContent = "GRÁTIS"

    const text = document.createElement("span")
    const strong = document.createElement("strong")
    strong.textContent = name
    text.append(strong, ` chegou aos ${done} cortes - corte grátis disponível!`)

    const dismiss = document.createElement("button")
    dismiss.type = "button"
    dismiss.className = "reward-dismiss"
    dismiss.textContent = "×"
    dismiss.setAttribute("aria-label", `Dispensar aviso de ${name}`)

    dismiss.addEventListener("click", () => {
        dismissedAlerts[name] = {
            ...(dismissedAlerts[name] || {}), reward: total
        }

        alert.remove()
    })

    alert.append(tag, text, dismiss)

    alert.addEventListener("click", (event) => {
        if (event.target.closest(".reward-dismiss")) return

        showClientHistory(name)
    })

    alert.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()

            showClientHistory(name)
        }
    })

    return alert
}

function buildAbsentAlert(name, days, total) {
    const alert = document.createElement("div")
    alert.className = "reward-alert reward-alert--absent"
    alert.setAttribute("role", "button")
    alert.tabIndex = 0

    const tag = document.createElement("span")
    tag.className = "reward-tag"
    tag.textContent = "SUMIDO"

    const text = document.createElement("span")
    const strong = document.createElement("strong")
    strong.textContent = name
    text.append(strong, ` Sumiu há ${days} dias`)

    const dismiss = document.createElement("button")
    dismiss.type = "button"
    dismiss.className = "reward-dismiss"
    dismiss.textContent = "×"
    dismiss.setAttribute("aria-label", `Dispensar aviso de ${name}`)

    dismiss.addEventListener("click", () => {
        dismissedAlerts[name] = {
            ...(dismissedAlerts[name] || {}), absent: total
        }

        alert.remove()
    })

    alert.append(tag, text, dismiss)

    alert.addEventListener("click", (event) => {
        if (event.target.closest(".reward-dismiss")) return

        showClientHistory(name)
    })

    alert.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()

            showClientHistory(name)
        }
    })

    return alert
}

function collectRewards(all) {
    const doneByName = {}
    const totalByName = {}

    all.forEach((schedule) => {
        totalByName[schedule.name] = (totalByName[schedule.name] || 0) + 1

        if (schedule.status === "done") {
            doneByName[schedule.name] = (doneByName[schedule.name] || 0) + 1
        }
    })

    const clientsAndTotals = Object.entries(doneByName)

    const clientsWithReward = clientsAndTotals.filter(([name, done]) => hasRewardFor(done))

    const rewardedClients = clientsWithReward.map(([name, done]) => ({
        name, done
    }))

    return { rewardedClients, totalByName }
}

function collectAbsents(all) {
    const lastSeenByName = {}

    all.forEach((schedule) => {
        if (!dayjs(schedule.when).isBefore(dayjs())) return

        if (!lastSeenByName[schedule.name] || dayjs(schedule.when).isAfter(dayjs(lastSeenByName[schedule.name]))) {
            lastSeenByName[schedule.name] = schedule.when
        }
    })

    const lastVisitByName = Object.entries(lastSeenByName)

    const clientsWithDays = lastVisitByName.map(([name, when]) => ({
        name,
        days: dayjs().startOf("day").diff(dayjs(when).startOf("day"), "day"),
    }))

    const missingClients = clientsWithDays.filter((client) => isAbsentFor(client.days))

    const sortedAbsents = missingClients.sort((absentA, absentB) => absentA.days - absentB.days)

    return sortedAbsents
}

const MAX_ALERTS = 5

export async function renderRewardAlerts() {
    const response = await fetch(`${apiConfig.baseURL}/schedules`)
    const all = await response.json()

    const { rewardedClients, totalByName } = collectRewards(all)
    const absents = collectAbsents(all)

    const box = document.querySelector("#reward-alerts")
    box.replaceChildren()

    const alerts = [
        ...rewardedClients.map((reward) => ({
            type: "reward", ...reward
        })),

        ...absents.map((absent) => ({
            type: "absent", ...absent
        }))
    ]

    const initialVisible = alerts.slice(0, MAX_ALERTS)

    const shownRewards = showAllRewards ? alerts.filter((item) => item.type === "reward") : initialVisible.filter((item) => item.type === "reward")

    const shownAbsents = showAllAbsents ? alerts.filter((item) => item.type === "absent") : initialVisible.filter((item) => item.type === "absent")

    const totalRewards = alerts.filter((item) => item.type === "reward").length
    const totalAbsents = alerts.length - totalRewards

    const visibleAlerts = [...shownRewards, ...shownAbsents]

    visibleAlerts.forEach((item) => {
        const alertType = item.type
        const dismissalRecord = dismissedAlerts[item.name]

        if (dismissalRecord && dismissalRecord[alertType] === totalByName[item.name]) return

        if (dismissalRecord) {
            delete dismissalRecord[alertType]
        }

        box.appendChild(alertType === "reward" ? buildRewardAlert(item.name, item.done, totalByName[item.name]) : buildAbsentAlert(item.name, item.days, totalByName[item.name]))
    })

    updateSeeAllButtons({
        totalRewards,
        shownRewards: shownRewards.length,
        expandedRewards: showAllRewards,
        totalAbsents,
        shownAbsents: shownAbsents.length,
        expandedAbsents: showAllAbsents
    })

    updateAlertsBadge(box.children.length)
}

export function toggleShowAllRewards() {
    showAllRewards = !showAllRewards

    renderRewardAlerts()
}

export function toggleShowAllAbsents() {
    showAllAbsents = !showAllAbsents

    renderRewardAlerts()
}