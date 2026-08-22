import dayjs from "dayjs"

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
            time.textContent = dayjs(schedule.when).format('HH:mm')
            name.textContent = schedule.name

            const cancelIcon = document.createElement('img')

            cancelIcon.classList.add('cancel-icon')
            cancelIcon.setAttribute('src', './assets/cancel.svg')
            cancelIcon.setAttribute('alt', 'Cancelar')

            item.append(time, name, cancelIcon)

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
        alert('Não foi possível exibir os agendamentos')
        console.log(error)
    }
}