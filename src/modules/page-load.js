import { schedulesDay } from "./schedules/load.js"
import { initCounterMode } from "./ui/counter-mode.js"
import { initFooterStrip } from "./ui/footer-strip.js"

document.addEventListener('DOMContentLoaded', async () => {
    initCounterMode()
    initFooterStrip()
    await schedulesDay()
})