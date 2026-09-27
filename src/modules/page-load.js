import { schedulesDay } from "./schedules/load.js"
import { initFooterStrip } from "./ui/footer-strip.js"

document.addEventListener('DOMContentLoaded', async () => {
    initFooterStrip()
    await schedulesDay()
})