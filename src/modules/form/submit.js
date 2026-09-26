import dayjs from "dayjs"

import { getService } from "../../data/service-catalog.js"
import { schedulesDay } from "../schedules/load.js"
import { showToast } from "../ui/toast.js"
import { createSchedules, resetRepeat } from "./repeat.js"

const form = document.querySelector('form')
const clientName = document.querySelector('#client')
const selectedDate = document.querySelector('#date')
const clientError = document.querySelector('#client-error')
const hoursError = document.querySelector('#hours-error')

selectedDate.value = dayjs().format('YYYY-MM-DD')
selectedDate.min = dayjs().subtract(6, "month").format("YYYY-MM-DD")
selectedDate.max = dayjs().add(1, 'month').format('YYYY-MM-DD')

clientName.addEventListener('input', () => {
    clientError.textContent = ''
    clientName.removeAttribute('aria-invalid')
    clientName.classList.remove('input--error')
})

form.addEventListener('submit', async (event) => {
    event.preventDefault()

    try {
        const name = clientName.value.trim()

        if (!name) {
            clientError.textContent = 'Informe o nome do cliente'
            clientName.setAttribute('aria-invalid', 'true')
            clientName.classList.add('input--error')
            clientName.focus()

            return
        }

        if (dayjs(selectedDate.value).isBefore(dayjs().startOf("day"))) {
            showToast("Não é possível agendar em data passada.", "error")

            return
        }

        const hourSelected = document.querySelector('.hour-selected')

        if (!hourSelected) {
            hoursError.textContent = 'Selecione um horário'

            return
        } else {
            hoursError.textContent = ''
        }

        const [hour, _] = hourSelected.textContent.split(':')

        const when = dayjs(selectedDate.value).add(hour, 'hour')

        const serviceValue = document.querySelector('#service').value
        const selectedService = getService(serviceValue)

        if (!selectedService) {
            showToast("Serviço inválido.", "error")
            return
        }

        const notesEl = document.querySelector('#notes')
        const notesValue = notesEl.value.trim()
        const { duration, price } = selectedService

        const optionsDetails = document.querySelector('details.field--options')

        if (optionsDetails) {
            optionsDetails.open = false
        }

        await createSchedules({ name, when, service: serviceValue, duration, price, notes: notesValue })
        await schedulesDay()

        resetRepeat()

        clientName.value = ''
        notesEl.value = ''
    } catch (error) {
        showToast('Não foi possivel realizar o agendamento.', 'error')
        console.log(error)
    }
})