import dayjs from "dayjs"

export function isHourAvailable({ hour, date, unavailable, blocked }) {
    const [h, _] = hour.split(':')

    const isPast = dayjs(date).add(h, 'hour').isBefore(dayjs())

    return !unavailable.includes(hour) && !blocked.includes(hour) && !isPast
}