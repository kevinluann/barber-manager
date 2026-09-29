export function initCounterMode() {
    const toggle = document.querySelector("#balcao-toggle")

    if (!toggle || toggle.dataset.bound) return
    toggle.dataset.bound = "true"

    if (window.matchMedia("(pointer: coarse)").matches) {
        document.body.classList.add("balcao")
        toggle.setAttribute("aria-pressed", "true")
    }

    toggle.addEventListener("click", () => {
        const active = document.body.classList.toggle("balcao")
        toggle.setAttribute("aria-pressed", String(active))
    })
}