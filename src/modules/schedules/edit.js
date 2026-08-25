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

    form.addEventListener('submit', async (event) => {
        event.preventDefault()

        const editIdInput = form.querySelector('#edit-id')
        const editClientInput = form.querySelector('#edit-client')
        const hourEl = form.querySelector('#edit-hours .hour-selected')

        const id = editIdInput.value
        const name = editClientInput.value.trim()

        if (!name) {
            return showToast('Informe o nome', 'error')
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

export function enableEditButtons() {
    document.querySelectorAll('.edit-icon').forEach((button) => {
        button.addEventListener('click', async () => {
            const li = button.closest('li[data-id]')
            const dialog = getEditDialog()

            const date = dateInput.value
            const dailySchedules = await scheduleFetchByDay({ date })

            const unavailable = dailySchedules.map((schedule) => {
                return dayjs(schedule.when).format('HH:mm')
            })

            const list = dialog.querySelector('#edit-hours')
            list.replaceChildren()

            openingHours.forEach((hour) => {
                const [h, _] = hour.split(':')
                const isPast = dayjs(date).add(h, 'hour').isBefore(dayjs())
                const isCurrent = hour === li.dataset.hour
                const isUnavailable = (unavailable.includes(hour) && !isCurrent) || isPast

                const hourItem = document.createElement('li')
                hourItem.textContent = hour
                hourItem.className = `hour ${isUnavailable ? 'hour-unavailable' : 'hour-available'}`
                hourItem.setAttribute('aria-disabled', isUnavailable ? 'true' : 'false')
                hourItem.setAttribute('role', 'button')
                hourItem.setAttribute('tabindex', isUnavailable ? '-1' : '0')

                if (hour === li.dataset.hour) {
                    hourItem.classList.add('hour-selected')
                }

                if (!isUnavailable) {
                    hourItem.addEventListener('click', (event) => {
                        list.querySelectorAll('.hour').forEach((h) => {
                            h.classList.remove('hour-selected')
                        })

                        event.currentTarget.classList.add('hour-selected')
                    })
                }

                list.appendChild(hourItem)
            })

            setupEditForm(dialog)

            const editIdInput = dialog.querySelector('#edit-id')
            const editClientInput = dialog.querySelector('#edit-client')

            editIdInput.value = li.dataset.id
            editClientInput.value = li.dataset.name

            dialog.showModal()
        })
    })
}
