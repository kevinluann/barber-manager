export function initCounterMode() {
    const counterToggle = document.querySelector("#balcao-toggle")

    if (!counterToggle || counterToggle.dataset.bound) return
    counterToggle.dataset.bound = "true"

    if (window.matchMedia("(pointer: coarse)").matches) {
        document.body.classList.add("balcao")
        counterToggle.setAttribute("aria-pressed", "true")
    }

    counterToggle.addEventListener("click", () => {
        document.body.classList.toggle("balcao")

        const isCounterModeActive = document.body.classList.contains("balcao")
        counterToggle.setAttribute("aria-pressed", String(isCounterModeActive))
    })
}