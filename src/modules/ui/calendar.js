import dayjs from "dayjs"

import { apiConfig } from "../../services/api-config.js"
import { schedulesDay } from "../schedules/load.js"

const dateInput = document.querySelector("#date")

let displayedYear = null
let displayedMonth = null

async function getScheduledDays() {
    const response = await fetch(`${apiConfig.baseURL}/schedules`)
    const all = await response.json()
    const days = []

    all.forEach((schedule) => {
        const day = dayjs(schedule.when).format("YYYY-MM-DD")

        if (!days.includes(day)) {
            days.push(day)
        }
    })

    return days
}

function isDayDisabled(date, scheduledDays) {
    const day = dayjs(date)

    if (date < dateInput.min || date > dateInput.max) return true

    if (day.isBefore(dayjs().startOf("day")) && !scheduledDays.includes(date)) return true

    return false
}

const calendarOpener = document.querySelector("#calendar-toggle")
const calendarSelectedDate = document.querySelector("#calendar-toggle-text")
const calendarPanel = document.querySelector("#calendar-popover")
const calendarMonthTitle = document.querySelector("#calendar-title")
const calendarDaysGrid = document.querySelector("#calendar-grid")
const prevMonthButton = document.querySelector("#calendar-prev")
const nextMonthButton = document.querySelector("#calendar-next")

function updateCalendarSelectedDate() {
    calendarSelectedDate.textContent = dayjs(dateInput.value).format("DD/MM/YYYY")
}

export async function renderCalendar() {
    const scheduledDays = await getScheduledDays()

    const firstDayOfMonth = dayjs(`${displayedYear}-${String(displayedMonth + 1).padStart(2, "0")}-01`)
    calendarMonthTitle.textContent = firstDayOfMonth.format("MMMM YYYY")

    calendarDaysGrid.replaceChildren()

    for (let i = 0; i < firstDayOfMonth.day(); i++) {
        const emptySlot = document.createElement("span")
        emptySlot.className = "calendar-day--empty"

        calendarDaysGrid.appendChild(emptySlot)
    }

    for (let day = 1; day <= firstDayOfMonth.daysInMonth(); day++) {
        const date = firstDayOfMonth.date(day).format("YYYY-MM-DD")

        const dayButton = document.createElement("button")
        dayButton.type = "button"
        dayButton.className = "calendar-day"
        dayButton.textContent = day

        if (date === dayjs().format("YYYY-MM-DD")) {
            dayButton.classList.add("is-today")
        }
        if (date === dateInput.value) {
            dayButton.classList.add("is-selected")
        }
        if (scheduledDays.includes(date)) {
            dayButton.classList.add("has-events")
        }
        if (isDayDisabled(date, scheduledDays)) {
            dayButton.disabled = true
        }

        dayButton.addEventListener("click", async () => {
            dateInput.value = date
            updateCalendarSelectedDate()
            setCalendarOpen(false)

            await schedulesDay()
        })

        calendarDaysGrid.appendChild(dayButton)
    }
}

function setCalendarOpen(open) {
    calendarPanel.hidden = !open
    calendarOpener.setAttribute("aria-expanded", String(open))
}

export function initCalendar() {
    if (!calendarOpener || calendarOpener.dataset.bound) return
    calendarOpener.dataset.bound = "true"

    const now = dayjs()
    displayedYear = now.year()
    displayedMonth = now.month()

    updateCalendarSelectedDate()

    calendarOpener.addEventListener("click", async () => {
        if (calendarPanel.hidden) {
            await renderCalendar()
        }

        setCalendarOpen(calendarPanel.hidden)
    })

    nextMonthButton.addEventListener("click", async () => {
        const nextMonth = dayjs(`${displayedYear}-${displayedMonth + 1}-01`).add(1, "month")

        displayedYear = nextMonth.year()
        displayedMonth = nextMonth.month()

        await renderCalendar()
    })

    prevMonthButton.addEventListener("click", async () => {
        const previousMonth = dayjs(`${displayedYear}-${displayedMonth + 1}-01`).subtract(1, "month")

        displayedYear = previousMonth.year()
        displayedMonth = previousMonth.month()

        await renderCalendar()
    })

    document.addEventListener("click", (event) => {
        if (!calendarPanel.hidden && !event.target.closest(".calendar-wrap")) {
            setCalendarOpen(false)
        }
    })

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setCalendarOpen(false)
        }
    })
}