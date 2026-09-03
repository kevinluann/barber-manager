import dayjs from "dayjs"

import { apiConfig } from "../../services/api-config.js"

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

function buildHistoryDialog(name, history) {
    const dialog = document.querySelector('#client-history-dialog')
    dialog.replaceChildren()

    const title = document.createElement('h3')
    title.id = 'history-title'
    title.textContent = `Histórico · ${name}`
    dialog.appendChild(title)

    const list = document.createElement('div')
    list.className = 'history-list'

    history.forEach((schedule) => {
        const service = schedule.service[0].toUpperCase() + schedule.service.slice(1)
        const statusNames = { pending: 'Pendente', done: 'Concluído' }
        const status = statusNames[schedule.status]

        const entry = document.createElement('div')
        entry.className = 'history-entry'

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

    const closeBtn = document.createElement('button')
    closeBtn.className = 'confirm-btn confirm-btn--cancel'
    closeBtn.textContent = 'Fechar'
    closeBtn.addEventListener('click', () => dialog.close())

    dialog.append(list, closeBtn)

    return dialog
}
