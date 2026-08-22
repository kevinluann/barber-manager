import dayjs from "dayjs"

import { scheduleNew } from "../../services/schedule-new.js"
import { schedulesDay } from "../schedules/load.js"

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
            return alert('Informe o nome do cliente!')
        }

        const hourSelected = document.querySelector('.hour-selected')

        if (!hourSelected) {
            return alert('Selecione o horário.')
        }

        const [hour, _] = hourSelected.textContent.split(':')

        const when = dayjs(selectedDate.value).add(hour, 'hour')

        await scheduleNew({ name, when })

        schedulesDay()

        clientName.value = ''
    } catch (error) {
        alert('Não foi possivel realizar o agendamento.')
        console.log(error)
    }
})