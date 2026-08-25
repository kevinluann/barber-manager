import dayjs from "dayjs"
import { showToast } from "../ui/toast.js"

const periodMorning = document.querySelector('#period-morning')
const periodAfternoon = document.querySelector('#period-afternoon')
const periodNight = document.querySelector('#period-night')

export function schedulesShow({ dailySchedules }) {
    try {
        periodMorning.replaceChildren()
        periodAfternoon.replaceChildren()
        periodNight.replaceChildren()

        dailySchedules.forEach((schedule) => {
            const item = document.createElement('li')
            const time = document.createElement('strong')
            const name = document.createElement('span')

            item.setAttribute('data-id', schedule.id)
            item.dataset.name = schedule.name
            time.textContent = dayjs(schedule.when).format('HH:mm')
            name.textContent = schedule.name

            const cancelButton = document.createElement('button')
            cancelButton.classList.add('cancel-icon')
            cancelButton.setAttribute('type', 'button')
            cancelButton.setAttribute('aria-label', `Remover agendamento de ${schedule.name} às ${dayjs(schedule.when).format('HH:mm')}`)
            cancelButton.setAttribute('title', 'Remover')

            const cancelIcon = document.createElement('img')
            cancelIcon.setAttribute('src', './assets/cancel.svg')
            cancelIcon.setAttribute('alt', '')
            cancelIcon.setAttribute('aria-hidden', 'true')

            cancelButton.appendChild(cancelIcon)

            const editButton = document.createElement('button')
            editButton.className = 'edit-icon'
            editButton.type = 'button'
            editButton.setAttribute('aria-label', `Editar ${schedule.name}`)
            editButton.innerHTML = '<img src="./assets/person.svg" alt="">'

            item.append(time, name, editButton, cancelButton)

            const hour = dayjs(schedule.when).hour()

            if (hour <= 12) {
                periodMorning.appendChild(item)
            } else if (hour > 12 && hour <= 18) {
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