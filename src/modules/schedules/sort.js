import { schedulesDay } from "./load.js"

const sortSelect = document.querySelector('#sort-select')

export let currentSort = 'hour-asc'

sortSelect.addEventListener('change', (event) => {
    currentSort = event.target.value
    schedulesDay()
})

export function sortSchedules(list) {
    const sorted = [...list]

    if (currentSort === 'hour-asc') {
        sorted.sort((scheduleA, scheduleB) => new Date(scheduleA.when) - new Date(scheduleB.when))

    } else if (currentSort === 'hour-desc') {
        sorted.sort((scheduleA, scheduleB) => new Date(scheduleB.when) - new Date(scheduleA.when))

    } else if (currentSort === 'name-asc') {
        sorted.sort((scheduleA, scheduleB) => scheduleA.name.localeCompare(scheduleB.name))

    } else if (currentSort === 'name-desc') {
        sorted.sort((scheduleA, scheduleB) => scheduleB.name.localeCompare(scheduleA.name))
    }

    return sorted
}