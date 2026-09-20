import { resetAlerts, toggleShowAllAbsents, toggleShowAllRewards } from "../schedules/alerts.js"

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

        if (event.target.closest(".reward-dismiss")) return

        if (event.target.closest(".alerts-wrap")) return

        panel.open = false
    })

    const closeBtn = document.querySelector("#alerts-close")

    closeBtn.addEventListener("click", () => {
        panel.open = false

        bell.focus()
    })

    const seeAllRewardsBtn = document.querySelector("#alerts-see-all-rewards")
    const seeAllAbsentsBtn = document.querySelector("#alerts-see-all-absents")
    const resetBtn = document.querySelector("#alerts-reset")

    seeAllRewardsBtn.addEventListener("click", () => toggleShowAllRewards())
    seeAllAbsentsBtn.addEventListener("click", () => toggleShowAllAbsents())
    resetBtn.addEventListener("click", () => resetAlerts())
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

    const hasAnyAlert = totalRewards + totalAbsents > 0

    rewardsBtn.hidden = !hasAnyAlert || (!expandedRewards && totalRewards <= shownRewards)

    rewardsBtn.textContent = expandedRewards ? "Voltar aos avisos" : `Ver cortes grátis (${totalRewards})`

    absentsBtn.hidden = !hasAnyAlert || (!expandedAbsents && totalAbsents <= shownAbsents)

    absentsBtn.textContent = expandedAbsents ? "Voltar aos avisos" : `Ver clientes ausentes (${totalAbsents})`
}