import dayjs from "dayjs"

import { scheduleNew } from "../../services/schedule-new.js"
import { schedulesDay } from "../schedules/load.js"
import { showToast } from "../ui/toast.js"

const form = document.querySelector('form')
const clientName = document.querySelector('#client')
const selectedDate = document.querySelector('#date')
const clientError = document.querySelector('#client-error')
const hoursError = document.querySelector('#hours-error')

const inputToday = dayjs().format('YYYY-MM-DD')

selectedDate.value = inputToday
selectedDate.min = inputToday
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

        const hourSelected = document.querySelector('.hour-selected')

        if (!hourSelected) {
            hoursError.textContent = 'Selecione um horário'

            return
        } else {
            hoursError.textContent = ''
        }

        const [hour, _] = hourSelected.textContent.split(':')

        const when = dayjs(selectedDate.value).add(hour, 'hour')

        await scheduleNew({ name, when })
        await schedulesDay()

        clientName.value = ''
    } catch (error) {
        showToast('Não foi possivel realizar o agendamento.', 'error')
        console.log(error)
    }
})