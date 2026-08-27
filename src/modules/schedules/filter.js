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
