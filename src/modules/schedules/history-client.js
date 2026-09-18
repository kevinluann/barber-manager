import dayjs from "dayjs"

import { apiConfig } from "../../services/api-config.js"
import { hasRewardFor, LOYALTY_GOAL } from "../../utils/loyalty.js"

export async function showClientHistory(name) {
    const history = await fetchClientHistory(name)
    const dialog = buildHistoryDialog(name, history)

    dialog.showModal()
}

async function fetchClientHistory(name) {
    const response = await fetch(`${apiConfig.baseURL}/schedules`)
    const all = await response.json()

    const filtered = all.filter((schedule) => schedule.name === name)
    const sorted = filtered.sort((scheduleA, scheduleB) => new Date(scheduleB.when) - new Date(scheduleA.when))

    return sorted
}

function getSummary(history) {
    const total = history.length
    const done = history.filter((schedule) => schedule.status === 'done').length
    const noshow = history.filter((schedule) => schedule.status === 'no_show').length

    const last = history.find((schedule) => dayjs(schedule.when).isBefore(dayjs()))

    function formatLast(when) {
        if (!when) return "—"

        const today = dayjs().startOf("day")
        const cutDate = dayjs(when).startOf("day")
        const days = today.diff(cutDate, "day")

        if (days <= 0) return "Hoje"
        if (days === 1) return "Há 1 dia"

        return `Há ${days} dias`
    }

    const lastText = formatLast(last ? last.when : undefined)


    const progress = done % LOYALTY_GOAL

    const loyaltyCount = `${progress}/${LOYALTY_GOAL}`
    const loyaltyPercent = (progress / LOYALTY_GOAL) * 100
    const loyaltyText = hasRewardFor(done) ? "Cliente chegou aos 10 cortes - corte grátis!" : `Faltam ${LOYALTY_GOAL - progress} cortes para o grátis`

    return { total, done, noshow, lastText, loyaltyCount, loyaltyPercent, loyaltyText }
}

function buildHistoryDialog(name, history) {
    const dialog = document.querySelector('#client-history-dialog')

    const { total, done, noshow, lastText, loyaltyCount, loyaltyPercent, loyaltyText } = getSummary(history)

    const titleEl = dialog.querySelector('#history-title')
    const headlineEl = dialog.querySelector('#history-headline')
    const totalEl = dialog.querySelector('#summary-total')
    const doneEl = dialog.querySelector('#summary-done')
    const noshowEl = dialog.querySelector('#summary-noshow')
    const lastEl = dialog.querySelector('#summary-last')

    titleEl.textContent = `Histórico · ${name}`

    function headlineElement() {
        headlineEl.replaceChildren()

        const nameEl = document.createElement("strong")
        nameEl.textContent = name

        const sep1 = document.createElement("span")
        sep1.className = "headline-sep"
        sep1.textContent = "·"
        sep1.setAttribute("aria-hidden", "true")

        const totalSpan = document.createElement("span")
        if (total === 1) {
            totalSpan.textContent = `${total} Corte`
        } else {
            totalSpan.textContent = `${total} Cortes`
        }

        const sep2 = document.createElement("span")
        sep2.className = "headline-sep"
        sep2.textContent = "·"
        sep2.setAttribute("aria-hidden", "true")

        const lastSpan = document.createElement("span")
        lastSpan.textContent = `Último: ${lastText}`

        headlineEl.append(nameEl, sep1, totalSpan, sep2, lastSpan)
    }

    headlineElement()

    totalEl.textContent = total
    doneEl.textContent = done
    noshowEl.textContent = noshow
    lastEl.textContent = lastText

    const loyaltyBox = dialog.querySelector(".loyalty")
    const loyaltyCountEl = dialog.querySelector("#loyalty-count")
    const loyaltyBarEl = dialog.querySelector("#loyalty-bar")
    const loyaltyTextEl = dialog.querySelector("#loyalty-text")

    loyaltyCountEl.textContent = loyaltyCount
    loyaltyBarEl.style.width = loyaltyPercent + "%"
    loyaltyTextEl.textContent = loyaltyText
    loyaltyBox.classList.toggle("is-complete", hasRewardFor(done))

    const list = dialog.querySelector('.history-list')
    list.replaceChildren()

    history.forEach((schedule) => {
        const service = schedule.service[0].toUpperCase() + schedule.service.slice(1)
        const statusNames = { pending: 'Pendente', done: 'Concluído', no_show: 'Faltou' }
        const status = statusNames[schedule.status]

        const entry = document.createElement('div')
        entry.className = 'history-entry'

        if (schedule.status === 'no_show') {
            entry.classList.add('is-no-show')
        }

        const dateSpan = document.createElement('span')
        dateSpan.textContent = dayjs(schedule.when).format('DD/MM HH:mm')

        const infoSpan = document.createElement('span')
        infoSpan.textContent = `${service} - ${status}`

        entry.append(dateSpan, infoSpan)

        if (schedule.notes) {
            const notesEl = document.createElement('p')
            notesEl.className = 'history-notes'
            notesEl.textContent = schedule.notes

            entry.appendChild(notesEl)
        }

        list.appendChild(entry)
    })

    if (history.length === 0) {
        list.textContent = 'Nenhum histórico'
    }

    let closeBtn = dialog.querySelector('button')

    if (!closeBtn) {
        closeBtn = document.createElement('button')
        closeBtn.className = 'confirm-btn confirm-btn--cancel'
        closeBtn.textContent = 'Fechar'

        closeBtn.addEventListener('click', () => dialog.close())

        dialog.appendChild(closeBtn)
    }

    return dialog
}

const dismissedRewards = {}

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

    dismiss.addEventListener("click", (event) => {
        dismissedRewards[name] = total

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

export async function renderRewardAlerts() {
    const response = await fetch(`${apiConfig.baseURL}/schedules`)
    const all = await response.json()

    const doneByName = {}
    const totalByName = {}

    all.forEach((schedule) => {
        totalByName[schedule.name] = (totalByName[schedule.name] || 0) + 1

        if (schedule.status === "done") {
            doneByName[schedule.name] = (doneByName[schedule.name] || 0) + 1
        }
    })

    const box = document.querySelector("#reward-alerts")
    box.replaceChildren()

    const clientsAndTotals = Object.entries(doneByName)

    clientsAndTotals.forEach(([name, done]) => {
        if (!hasRewardFor(done)) return

        if (dismissedRewards[name] === totalByName[name]) return

        delete dismissedRewards[name]

        box.appendChild(buildRewardAlert(name, done, totalByName[name]))
    })
}