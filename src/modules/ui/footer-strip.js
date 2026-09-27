const FOOTER_UNITS = 10

export function initFooterStrip() {
    const footerStripTrack = document.querySelector(".footer-strip-track")

    if (!footerStripTrack || footerStripTrack.dataset.built) return
    footerStripTrack.dataset.built = "true"

    footerStripTrack.replaceChildren()

    for (let i = 0; i < FOOTER_UNITS; i++) {
        const stripUnit = document.createElement("span")
        stripUnit.className = "footer-strip-unit"

        const icon = document.createElement("img")
        icon.src = "./assets/sparkle.svg"
        icon.alt = ""
        icon.setAttribute("aria-hidden", "true")

        stripUnit.append("— ", icon, " —")

        footerStripTrack.appendChild(stripUnit)
    }
}