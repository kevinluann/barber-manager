import dayjs from "dayjs"

import { isHourAvailable } from "../../utils/schedule-availability.js"
import { scheduleFetchBlocked } from "../../services/schedule-block.js"
import { openingHours } from "../../utils/opening-hours.js"
import { hoursClick } from "./hours-click.js"

const hours = document.querySelector('#hours')

export async function hoursLoad({ date, dailySchedules }) {
    hours.replaceChildren()

    const blocked = await scheduleFetchBlocked({ date })

    const unavailableHours = dailySchedules.map((schedule) => {
        return dayjs(schedule.when).format('HH:mm')
    })

    const opening = openingHours.map((hour) => {
        const available = isHourAvailable({ hour, date, unavailable: unavailableHours, blocked })

        return {
            hour,
            available
        }
    })

    opening.forEach(({ hour, available }) => {
        const li = document.createElement('li')

        li.classList.add('hour')
        li.classList.add(available ? "hour-available" : "hour-unavailable")
        li.textContent = hour
        li.setAttribute('role', 'button')
        li.setAttribute('tabindex', available ? '0' : '-1')
        li.setAttribute('aria-label', `${hour} ${available ? 'disponível' : 'indisponível'}`)
        if (!available) li.setAttribute('aria-disabled', 'true')

        if (hour === '09:00') {
            hourHeaderAdd('Manhã')
        } else if (hour === '13:00') {
            hourHeaderAdd('Tarde')
        } else if (hour === '18:00') {
            hourHeaderAdd('Noite')
        }

        hours.append(li)
    })

    hoursClick()
}

function hourHeaderAdd(title) {
    const header = document.createElement('li')

    header.classList.add('hour-period')
    header.textContent = title

    hours.append(header)
}