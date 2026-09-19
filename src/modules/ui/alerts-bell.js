import { toggleShowAllAbsents, toggleShowAllRewards } from "../schedules/alerts.js"

export function initAlertsBell() {
    const bell = document.querySelector("#alerts-bell")
    const panel = document.querySelector("#alerts-panel")

    if (!bell || !panel || bell.dataset.bound) return

    bell.dataset.bound = "true"

    bell.addEventListener("click", () => {
        panel.open = !panel.open
    })

    document.addEventListener("click", (event) => {
        if (!panel.open) return

        if (event.target.closest(".alerts-wrap")) return

        panel.open = false
    })

    const closeBtn = document.querySelector("#alerts-close")

    closeBtn.addEventListener("click", () => {
        panel.open = false

        bell.focus()
    })

    const wrap = document.querySelector(".alerts-wrap")

    wrap.addEventListener("mouseenter", () => {
        panel.open = true
    })
    wrap.addEventListener("mouseleave", () => {
        panel.open = false
    })

    const seeAllRewardsBtn = document.querySelector("#alerts-see-all-rewards")
    const seeAllAbsentsBtn = document.querySelector("#alerts-see-all-absents")

    seeAllRewardsBtn.addEventListener("click", () => toggleShowAllRewards())
    seeAllAbsentsBtn.addEventListener("click", () => toggleShowAllAbsents())
}

export function updateAlertsBadge(count) {
    const alertsCountEl = document.querySelector("#alerts-count")
    const alertsBell = document.querySelector("#alerts-bell")

    alertsCountEl.textContent = count
    alertsBell.classList.toggle("is-empty", count === 0)
}

export function updateSeeAllButtons({ totalRewards, shownRewards, expandedRewards, totalAbsents, shownAbsents, expandedAbsents }) {
    const rewardsBtn = document.querySelector("#alerts-see-all-rewards")
    const absentsBtn = document.querySelector("#alerts-see-all-absents")

    rewardsBtn.hidden = totalRewards <= shownRewards

    rewardsBtn.textContent = expandedRewards ? "Mostrar menos grátis" : `Ver todos os grátis (${totalRewards})`

    absentsBtn.hidden = totalAbsents <= shownAbsents

    absentsBtn.textContent = expandedAbsents ? "Mostrar menos sumidos" : `Ver todos os sumidos (${totalAbsents})`
}