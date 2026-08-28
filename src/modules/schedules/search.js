import { schedulesDay } from "./load.js"

let searchTerm = ''

const searchInput = document.querySelector('#search')

searchInput.addEventListener('input', (event) => {
    searchTerm = event.target.value.toLowerCase().trim()

    schedulesDay()
})

export function filterBySearch(list) {
    if (!searchTerm) return list

    return list.filter((schedule) => {
        return schedule.name.toLowerCase().includes(searchTerm)
    })
}