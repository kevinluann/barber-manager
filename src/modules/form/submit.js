import dayjs from "dayjs"

import { scheduleNew } from "../../services/schedules-new.js"

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
            alert('Selecione o horário.')
        }

        const [hour, _] = hourSelected.textContent.split(':')

        const when = dayjs(selectedDate.value).add(hour, 'hour')

        const id = new Date().getTime()

        await scheduleNew({id, name, when})
    } catch (error) {
        alert('Não foi possivel realizar o agendamento.')
        console.log(error)
    }
})