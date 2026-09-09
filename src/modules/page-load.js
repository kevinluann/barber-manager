import { schedulesDay } from "./schedules/load.js"

document.addEventListener('DOMContentLoaded', async () => {
    await schedulesDay()
})