import dayjs from "dayjs"
import { getEditDialog } from "../ui/edit-dialog.js"
import { openingHours } from "../../utils/opening-hours.js"
import { scheduleUpdate } from "../../services/schedule-update.js"
import { schedulesDay } from "./load.js"
import { showToast } from "../ui/toast.js"

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
        button.addEventListener('click', () => {
            const li = button.closest('li[data-id]')
            const dialog = getEditDialog()
            setupEditForm(dialog)

            const editIdInput = dialog.querySelector('#edit-id')
            const editClientInput = dialog.querySelector('#edit-client')

            editIdInput.value = li.dataset.id
            editClientInput.value = li.dataset.name

            dialog.showModal()
        })
    })
}
