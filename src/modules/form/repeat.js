import dayjs from "dayjs"

import { scheduleNew } from "../../services/schedule-new.js"

export function enableRepeatToggle() {
    const checkBox = document.querySelector('#repeat')

    if (!checkBox || checkBox.dataset.bound) return
    checkBox.dataset.bound = 'true'

    const repeatCountContainer = document.querySelector('#repeat-row')

    checkBox.addEventListener('change', () => {
        repeatCountContainer.hidden = !checkBox.checked
    })
}

function getRepeatCount() {
    const checkBox = document.querySelector('#repeat')
    const repeatCountSelect = document.querySelector('#repeat-count')

    return checkBox.checked ? Number(repeatCountSelect.value) : 1
}

export async function createSchedules({ name, when, service, duration, price, notes }) {
    const count = getRepeatCount()

    for (let weekIndex = 0; weekIndex < count; weekIndex++) {
        await scheduleNew({ name, when: dayjs(when).add(weekIndex, 'week'), service, duration, price, status: 'pending', notes })
    }
}

export function resetRepeat() {
    const checkBox = document.querySelector('#repeat')
    checkBox.checked = false

    const repeatCountContainer = document.querySelector('#repeat-row')
    repeatCountContainer.hidden = true
}