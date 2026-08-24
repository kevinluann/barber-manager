import dayjs from "dayjs"

import { scheduleNew } from "../../services/schedule-new.js"
import { schedulesDay } from "../schedules/load.js"
import { showToast } from "../ui/toast.js"

const form = document.querySelector('form')
const clientName = document.querySelector('#client')
const selectedDate = document.querySelector('#date')

const inputToday = dayjs().format('YYYY-MM-DD')

selectedDate.value = inputToday
selectedDate.min = inputToday
selectedDate.max = dayjs().add(1, 'month').format('YYYY-MM-DD')

form.addEventListener('submit', async (event) => {
    event.preventDefault()

    try {
        const name = clientName.value.trim()

        if (!name) {
            showToast('Informe o nome do cliente!', 'error')
            return
        }

        const hourSelected = document.querySelector('.hour-selected')

        if (!hourSelected) {
            showToast('Selecione o horário.', 'error')
            return
        }

        const [hour, _] = hourSelected.textContent.split(':')

        const when = dayjs(selectedDate.value).add(hour, 'hour')

        await scheduleNew({ name, when })

        schedulesDay()

        clientName.value = ''
    } catch (error) {
        showToast('Não foi possivel realizar o agendamento.', 'error')
        console.log(error)
    }
})