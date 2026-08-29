import { schedulesDay } from "./load.js"

export let currentFilter = 'all'

const filterTabs = document.querySelectorAll('.filter-tab')

filterTabs.forEach((button) => {
    button.addEventListener('click', () => {
        filterTabs.forEach((btn) => {
            btn.classList.remove('filter-tab--active')
            btn.setAttribute('aria-selected', 'false')
        })

        button.classList.add('filter-tab--active')
        button.setAttribute('aria-selected', 'true')

        currentFilter = button.dataset.filter

        schedulesDay()
    })
})

export function applyStatusFilter(list) {
    if (currentFilter === 'all') return list

    return list.filter((schedule) => {
        return (schedule.status) === currentFilter
    })
}

export function updateEmptyState(filtered) {
    const emptyEl = document.querySelector('#empty-filtered')

    if (filtered.length === 0 && currentFilter !== 'all') {
        emptyEl.textContent = currentFilter === 'pending' ? 'Nenhum pendente' : 'Nenhum concluído'
        emptyEl.hidden = false
    } else {
        emptyEl.hidden = true
    }
}