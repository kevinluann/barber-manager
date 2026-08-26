import dayjs from "dayjs"

import { scheduleFetchByDay } from "../../services/schedule-fetch-by-day.js"
import { openingHours } from "../../utils/opening-hours.js"
import { scheduleUpdate } from "../../services/schedule-update.js"
import { getEditDialog } from "../ui/edit-dialog.js"
import { showToast } from "../ui/toast.js"
import { schedulesDay } from "./load.js"

const dateInput = document.querySelector('#date')

function setupEditForm(dialog) {
    const form = dialog.querySelector('#edit-form')

    if (form.dataset.bound) return

    form.dataset.bound = 'true'

    const editClientError = form.querySelector('#edit-client-error')
    const editClientInput = form.querySelector('#edit-client')

    editClientInput.addEventListener('input', () => {
        editClientError.textContent = ''
        editClientInput.removeAttribute('aria-invalid')
    })

    form.addEventListener('submit', async (event) => {
        event.preventDefault()

        const editIdInput = form.querySelector('#edit-id')
        const hourEl = form.querySelector('#edit-hours .hour-selected')

        const id = editIdInput.value
        const name = editClientInput.value.trim()

        if (!name) {
            editClientError.textContent = 'Informe o nome'
            editClientInput.setAttribute('aria-invalid', 'true')

            return
        }

        if (!hourEl) {
            return showToast('Selecione o horário', 'error')
        }

        const [hour, _] = hourEl.textContent.split(':')
        const when = dayjs(dateInput.value).add(hour, 'hour')

        await scheduleUpdate({ id, name, when })

        dialog.close()

        schedulesDay()
    })

    const cancelBtn = dialog.querySelector('#edit-cancel')

    cancelBtn.addEventListener('click', () => dialog.close())
}

async function getUnavailableHours(date) {
    const daily = await scheduleFetchByDay({ date })

    return daily.map((schedule) => {
        return dayjs(schedule.when).format('HH:mm')
    })
}

function isHourUnavailable(hour, selectedHour, unavailable, date) {
    const [h, _] = hour.split(':')
    const isPast = dayjs(date).add(h, 'hour').isBefore(dayjs())
    const isCurrent = hour === selectedHour

    return (unavailable.includes(hour) && !isCurrent) || isPast
}

function createHourElement(hour, isCurrent, isUnavailable, list) {
    const li = document.createElement('li')
    li.textContent = hour
    li.className = `hour ${isUnavailable ? 'hour-unavailable' : 'hour-available'}`
    li.setAttribute('aria-disabled', isUnavailable ? 'true' : 'false')


    if (!isUnavailable) {
        li.addEventListener('click', (event) => {
            const hourElements = list.querySelectorAll('.hour')

            hourElements.forEach((h) => {
                h.classList.remove('hour-selected')
            })

            event.currentTarget.classList.add('hour-selected')
        })
    }

    if (isCurrent) {
        li.classList.add('hour-selected')
    }

    return li
}

function buildEditHours(dialog, selectedHour, date, unavailable) {
    const list = dialog.querySelector('#edit-hours')
    list.replaceChildren()

    openingHours.forEach(hour => {
        const isUnavailable = isHourUnavailable(hour, selectedHour, unavailable, date)
        const element = createHourElement(hour, selectedHour === hour, isUnavailable, list)

        list.appendChild(element)
    })
}

export function enableEditButtons() {
    const editButtons = document.querySelectorAll('.edit-icon')

    editButtons.forEach((button) => {
        if (button.dataset.bound) return

        button.dataset.bound = 'true'

        button.addEventListener('click', async () => {
            const li = button.closest('li[data-id]')
            const dialog = getEditDialog()

            setupEditForm(dialog)

            const unavailable = await getUnavailableHours(dateInput.value)

            buildEditHours(dialog, li.dataset.hour, dateInput.value, unavailable)

            dialog.querySelector('#edit-id').value = li.dataset.id
            dialog.querySelector('#edit-client').value = li.dataset.name

            dialog.showModal()
        })
    })
}
