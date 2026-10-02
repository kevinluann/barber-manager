import { schedulesDay } from "./schedules/load.js"
import { initCounterMode } from "./ui/counter-mode.js"

document.addEventListener('DOMContentLoaded', async () => {
    initCounterMode()
    await schedulesDay()
})