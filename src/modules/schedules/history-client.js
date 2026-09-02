import dayjs from "dayjs"

import { apiConfig } from "../../services/api-config.js"

export async function showClientHistory(name) {
    const response = await fetch(`${apiConfig.baseURL}/schedules`)
    const all = await response.json()

    const filtered = all.filter((schedule) => schedule.name === name)
    const sorted = filtered.sort((scheduleA, scheduleB) => new Date(scheduleB.when) - new Date(scheduleA.when))
    const history = sorted

    const dialog = document.querySelector('#client-history-dialog')
    dialog.replaceChildren()

    const title = document.createElement('h3')
    title.id = 'history-title'
    title.textContent = `Histórico · ${name}`
    dialog.appendChild(title)

    const list = document.createElement('div')
    list.className = 'history-list'

    history.forEach(schedule => {
        const service = schedule.service[0].toUpperCase() + schedule.service.slice(1)
        const status = schedule.status[0].toUpperCase() + schedule.status.slice(1)

        const entry = document.createElement('div')
        entry.className = 'history-entry'

        const dateSpan = document.createElement('span')
        dateSpan.textContent = dayjs(schedule.when).format('DD/MM HH:mm')

        const infoSpan = document.createElement('span')
        infoSpan.textContent = `${service} - ${status}`

        entry.append(dateSpan, infoSpan)
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
    dialog.showModal()
}