import dayjs from "dayjs"
import { openingHours } from "../../utils/opening-hours.js"

const hours = document.querySelector('#hours')

export function hoursLoad({ date }) {
    const opening = openingHours.map((hour) => {
        const [scheduleHour, _] = hour.split(':')

        const isHourPast = dayjs(date).add(scheduleHour, 'hour').isBefore(dayjs())

        return {
            hour,
            available: !isHourPast
        }
    })

    opening.forEach(({hour, available}) => {
        const li = document.createElement('li')

        li.classList.add('hour')
        li.classList.add(available ? "hour-available" : "hour-unavailable")
        li.textContent = hour

        hours.append(li)
    })
}