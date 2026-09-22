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

    const tagIcon = document.createElement("img")
    tagIcon.src = "./assets/gift.svg"
    tagIcon.alt = ""
    tagIcon.setAttribute("aria-hidden", "true")
    tag.append(tagIcon, "GRÁTIS")

    const text = document.createElement("span")
    const strong = document.createElement("strong")
    strong.textContent = name
    text.append(strong, ` chegou aos ${done} cortes - corte grátis disponível!`)

    const dismiss = document.createElement("button")
    dismiss.type = "button"
    dismiss.className = "reward-dismiss"
    dismiss.setAttribute("aria-label", `Dispensar aviso de ${name}`)

    const dismissIcon = document.createElement("img")
    dismissIcon.src = "./assets/cancel.svg"
    dismissIcon.alt = ""
    dismissIcon.setAttribute("aria-hidden", "true")
    dismiss.appendChild(dismissIcon)

    dismiss.addEventListener("click", () => {
        dismissedAlerts[name] = {
            ...(dismissedAlerts[name] || {}), reward: total
        }

        renderRewardAlerts()

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

    const tagIcon = document.createElement("img")
    tagIcon.src = "./assets/user-x.svg"
    tagIcon.alt = ""
    tagIcon.setAttribute("aria-hidden", "true")
    tag.append(tagIcon, "SUMIDO")

    const text = document.createElement("span")
    const strong = document.createElement("strong")
    strong.textContent = name
    text.append(strong, ` Sumiu há ${days} dias`)

    const dismiss = document.createElement("button")
    dismiss.type = "button"
    dismiss.className = "reward-dismiss"
    dismiss.setAttribute("aria-label", `Dispensar aviso de ${name}`)

    const dismissIcon = document.createElement("img")
    dismissIcon.src = "./assets/cancel.svg"
    dismissIcon.alt = ""
    dismissIcon.setAttribute("aria-hidden", "true")
    dismiss.appendChild(dismissIcon)

    dismiss.addEventListener("click", () => {
        dismissedAlerts[name] = {
            ...(dismissedAlerts[name] || {}), absent: total
        }

        renderRewardAlerts()

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

    const eligibleAlerts = alerts.filter((item) => {
        const dismissalRecord = dismissedAlerts[item.name]

        return !(dismissalRecord && dismissalRecord[item.type] === totalByName[item.name])
    })

    const baseVisible = eligibleAlerts.slice(0, MAX_ALERTS)

    let shownRewards = showAllRewards ? eligibleAlerts.filter((item) => item.type === "reward") : baseVisible.filter((item) => item.type === "reward")
    let shownAbsents = showAllAbsents ? eligibleAlerts.filter((item) => item.type === "absent") : baseVisible.filter((item) => item.type === "absent")

    if (showAllRewards) {
        shownAbsents = []
    }
    if (showAllAbsents) {
        shownRewards = []
    }

    const visibleAlerts = [...shownRewards, ...shownAbsents]

    let shownCount = 0

    visibleAlerts.forEach((item) => {
        const alertType = item.type
        const dismissalRecord = dismissedAlerts[item.name]

        if (dismissalRecord) {
            delete dismissalRecord[alertType]
        }

        box.appendChild(alertType === "reward" ? buildRewardAlert(item.name, item.done, totalByName[item.name]) : buildAbsentAlert(item.name, item.days, totalByName[item.name]))

        shownCount++
    })

    if (eligibleAlerts.length > visibleAlerts.length) {
        const more = document.createElement("p")
        more.className = "reward-more"
        more.textContent = `+${eligibleAlerts.length - visibleAlerts.length} outros avisos`
        box.appendChild(more)
    }

    if (shownCount === 0) {
        const empty = document.createElement("p")
        empty.className = "reward-empty"
        empty.textContent = "Nenhum aviso no momento."

        box.appendChild(empty)
    }

    const totalRewards = eligibleAlerts.filter((item) => item.type === "reward").length
    const totalAbsents = eligibleAlerts.length - totalRewards

    updateSeeAllButtons({
        totalRewards,
        shownRewards: shownRewards.length,
        expandedRewards: showAllRewards,
        totalAbsents,
        shownAbsents: shownAbsents.length,
        expandedAbsents: showAllAbsents,
        shownCount
    })

    updateAlertsBadge(shownCount)

    const dismissedValues = Object.values(dismissedAlerts)

    const activeDismissals = dismissedValues.filter((record) => {
        return Object.entries(record).length > 0
    })

    const dismissedCount = activeDismissals.length

    const dismissedEl = document.querySelector("#dismissed-count")
    dismissedEl.hidden = dismissedCount === 0
    dismissedEl.textContent = `${dismissedCount} Dispensados`
}

export function toggleShowAllRewards() {
    showAllRewards = !showAllRewards

    if (showAllRewards) {
        showAllAbsents = false
    }

    renderRewardAlerts()
}

export function toggleShowAllAbsents() {
    showAllAbsents = !showAllAbsents

    if (showAllAbsents) {
        showAllRewards = false
    }

    renderRewardAlerts()
}

export function resetAlerts() {
    const dismissedEntries = Object.entries(dismissedAlerts)

    dismissedEntries.forEach(([name]) => {
        delete dismissedAlerts[name]
    })

    showAllRewards = false
    showAllAbsents = false

    renderRewardAlerts()
}