import dayjs from "dayjs"

import { apiConfig } from "../../services/api-config.js"
import { showToast } from "../ui/toast.js"
import { showClientHistory } from "./history-client.js"

const periodMorning = document.querySelector('#period-morning')
const periodAfternoon = document.querySelector('#period-afternoon')
const periodNight = document.querySelector('#period-night')

function createSep() {
    const sep = document.createElement('span')
    sep.className = 'schedule-sep'
    sep.textContent = '·'
    sep.setAttribute('aria-hidden', 'true')

    return sep
}

function getWeeklyRecurrenceId(name, when) {
    return `${name}|${dayjs(when).day()}|${dayjs(when).format('HH:mm')}`
}

export async function schedulesShow({ dailySchedules }) {
    try {
        periodMorning.replaceChildren()
        periodAfternoon.replaceChildren()
        periodNight.replaceChildren()

        const response = await fetch(`${apiConfig.baseURL}/schedules`)
        const all = await response.json()
        const bookingsByClientName = {}
        const weeklyRecurrenceCounts = {}

        all.forEach((schedule) => {
            if (!schedule.name) return

            bookingsByClientName[schedule.name] = (bookingsByClientName[schedule.name] || 0) + 1

            const recurrenceId = getWeeklyRecurrenceId(schedule.name, schedule.when)
            weeklyRecurrenceCounts[recurrenceId] = (weeklyRecurrenceCounts[recurrenceId] || 0) + 1
        })

        dailySchedules.forEach((schedule) => {
            const item = document.createElement('li')
            const time = document.createElement('strong')
            const name = document.createElement('span')

            item.dataset.id = schedule.id
            item.dataset.name = schedule.name
            time.textContent = dayjs(schedule.when).format('HH:mm')
            item.dataset.hour = time.textContent
            item.dataset.status = schedule.status
            item.dataset.service = schedule.service
            item.dataset.notes = schedule.notes || ''

            if (schedule.status === 'done') {
                item.classList.add('is-done')
            }
            if (schedule.status === 'no_show') {
                item.classList.add('is-no-show')
            }
            if (schedule.notes) {
                const maxTitle = 40

                item.title = schedule.notes.length > maxTitle ? schedule.notes.slice(0, maxTitle) + '…' : schedule.notes
            }

            const nameText = document.createElement('span')
            nameText.className = 'schedule-name'
            nameText.textContent = schedule.name
            nameText.style.cursor = 'pointer'

            const serviceText = document.createElement('span')
            serviceText.className = 'schedule-service'
            serviceText.textContent = schedule.service

            const priceText = document.createElement('span')
            priceText.className = 'schedule-service'
            priceText.textContent = `R$${schedule.price}`

            const durationText = document.createElement('span')
            durationText.className = 'schedule-service'
            durationText.textContent = `${schedule.duration}min`

            const recurrenceId = getWeeklyRecurrenceId(schedule.name, schedule.when)
            const isFixed = (weeklyRecurrenceCounts[recurrenceId] || 0) >= 2
            if (isFixed) {
                item.classList.add('is-fixed')
            }

            const badges = []

            if (isFixed) {
                const fixedBadge = document.createElement('span')
                fixedBadge.className = 'badge-fixed'
                fixedBadge.title = 'Cliente fixo'
                fixedBadge.setAttribute('aria-label', 'Cliente fixo toda semana')

                const fixedIcon = document.createElement('img')
                fixedIcon.src = './assets/repeat.svg'
                fixedIcon.alt = ''
                fixedIcon.setAttribute('aria-hidden', 'true')
                fixedBadge.appendChild(fixedIcon)

                badges.push(fixedBadge)
            }

            if ((bookingsByClientName[schedule.name] || 0) > 3) {
                const badge = document.createElement('span')
                badge.className = 'badge-fiel'
                badge.textContent = '★'
                badge.title = 'Cliente recorrente'
                badge.setAttribute('aria-label', 'Cliente fiel')
                badges.push(badge)
            }

            name.append(nameText)
            badges.forEach((badge) => {
                name.append(badge)
            })
            name.append(createSep(), serviceText, createSep(), priceText, createSep(), durationText)

            item.addEventListener('click', (event) => {
                if (event.target.closest('button')) return

                showClientHistory(schedule.name)
            })

            const cancelButton = document.createElement('button')
            cancelButton.classList.add('cancel-icon')
            cancelButton.setAttribute('type', 'button')
            cancelButton.setAttribute('aria-label', `Remover agendamento de ${schedule.name} às ${dayjs(schedule.when).format('HH:mm')}`)
            cancelButton.setAttribute('title', 'Remover')

            const cancelIcon = document.createElement('img')
            cancelIcon.setAttribute('src', './assets/trash.svg')
            cancelIcon.setAttribute('alt', '')
            cancelIcon.setAttribute('aria-hidden', 'true')

            cancelButton.appendChild(cancelIcon)

            const editButton = document.createElement('button')
            editButton.className = 'edit-icon'
            editButton.type = 'button'
            editButton.setAttribute('aria-label', `Editar ${schedule.name}`)

            const editIcon = document.createElement('img')
            editIcon.src = './assets/pencil.svg'
            editIcon.alt = ''
            editIcon.setAttribute('aria-hidden', 'true')

            editButton.appendChild(editIcon)

            const completeButton = document.createElement('button')
            completeButton.className = 'complete-icon'
            completeButton.type = 'button'
            completeButton.setAttribute('aria-label', `Concluir agendamento de ${schedule.name}`)
            completeButton.setAttribute('title', 'Concluir')

            const completeIcon = document.createElement('img')
            completeIcon.src = './assets/check.svg'
            completeIcon.alt = ''
            completeIcon.setAttribute('aria-hidden', 'true')

            completeButton.appendChild(completeIcon)

            const noShowButton = document.createElement('button')
            noShowButton.className = 'no-show-icon'
            noShowButton.type = 'button'
            noShowButton.setAttribute('aria-label', `Marcar falta de ${schedule.name}`)
            noShowButton.setAttribute('title', 'Faltou')

            const noShowIcon = document.createElement('img')
            noShowIcon.src = './assets/cancel.svg'
            noShowIcon.alt = ''
            noShowIcon.setAttribute('aria-hidden', 'true')

            noShowButton.appendChild(noShowIcon)

            item.append(time, name, editButton, completeButton, noShowButton, cancelButton)

            const hour = dayjs(schedule.when).hour()

            if (hour <= 12) {
                periodMorning.appendChild(item)
            } else if (hour > 12 && hour < 18) {
                periodAfternoon.appendChild(item)
            } else {
                periodNight.appendChild(item)
            }
        });
    } catch (error) {
        showToast('Não foi possível exibir os agendamentos', 'error')
        console.log(error)
    }
}