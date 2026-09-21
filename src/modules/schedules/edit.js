import dayjs from "dayjs"

import { isHourAvailable } from "../../utils/schedule-availability.js"
import { scheduleFetchBlocked } from "../../services/schedule-block.js"
import { scheduleFetchByDay } from "../../services/schedule-fetch-by-day.js"
import { openingHours } from "../../utils/opening-hours.js"
import { scheduleUpdate } from "../../services/schedule-update.js"
import { getService } from "../../data/service-catalog.js"
import { getEditDialog } from "../ui/edit-dialog.js"
import { refreshCustomSelect } from "../ui/custom-select.js"
import { showToast } from "../ui/toast.js"
import { schedulesDay } from "./load.js"

const dateInput = document.querySelector('#date')

function setupEditForm(dialog) {
    const form = dialog.querySelector('#edit-form')

    if (form.dataset.bound) return

    form.dataset.bound = 'true'

    const editClientError = form.querySelector('#edit-client-error')
    const editClientInput = form.querySelector('#edit-client')
    const editHoursError = form.querySelector('#edit-hours-error')

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
            editClientError.textContent = 'Informe o nome do cliente'
            editClientInput.setAttribute('aria-invalid', 'true')

            return
        }

        if (!hourEl) {
            editHoursError.textContent = 'Selecione um horário'

            return
        }

        const [hour, _] = hourEl.textContent.split(':')
        const when = dayjs(dateInput.value).add(hour, 'hour')

        const serviceValue = form.querySelector('#edit-service').value
        const selectedService = getService(serviceValue)

        if (!selectedService) {
            showToast("Serviço inválido.", "error")
            return
        }

        const notes = form.querySelector('#edit-notes').value.trim()
        const { duration, price } = selectedService

        await scheduleUpdate({ id, name, when, service: serviceValue, duration, price, notes })
        await schedulesDay()

        dialog.close()
    })

    const cancelBtn = dialog.querySelector('#edit-cancel')

    cancelBtn.addEventListener('click', () => dialog.close())
}

function createHourElement(hour, isCurrent, isUnavailable, list) {
    const li = document.createElement('li')
    li.textContent = hour
    li.className = `hour ${isUnavailable ? 'hour-unavailable' : 'hour-available'}`
    li.setAttribute('aria-disabled', isUnavailable ? 'true' : 'false')

    const editHoursError = list.closest('form').querySelector('#edit-hours-error')

    if (!isUnavailable) {
        li.addEventListener('click', (event) => {
            editHoursError.textContent = ''

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

async function buildEditHours(dialog, selectedHour, date) {
    const list = dialog.querySelector('#edit-hours')
    list.replaceChildren()

    const daily = await scheduleFetchByDay({ date })

    const unavailable = daily.map((schedule) => {
        return dayjs(schedule.when).format('HH:mm')
    })

    const blocked = await scheduleFetchBlocked({ date })

    openingHours.forEach(hour => {
        const available = isHourAvailable({ hour, date, unavailable, blocked })
        const isCurrent = hour === selectedHour
        const isUnavailable = !available && !isCurrent

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

            const editServiceInput = dialog.querySelector('#edit-service')
            editServiceInput.value = li.dataset.service

            refreshCustomSelect(editServiceInput)

            setupEditForm(dialog)

            try {
                await buildEditHours(dialog, li.dataset.hour, dateInput.value)
            } catch (error) {
                showToast('Não foi possível carregar horários para edição', 'error')
                console.log(error)
            }

            dialog.querySelector('#edit-id').value = li.dataset.id
            dialog.querySelector('#edit-client').value = li.dataset.name
            dialog.querySelector('#edit-notes').value = li.dataset.notes || ''

            dialog.showModal()
        })
    })
}
