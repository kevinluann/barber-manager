import dayjs from "dayjs"

import { scheduleFetchByDay } from "../../services/schedule-fetch-by-day.js"
import { monthsPtBr, weekdaysPtBr } from "../../utils/date-labels.js"
import { openingHours } from "../../utils/opening-hours.js"

const dateInput = document.querySelector('#date')
const dateValueEl = document.querySelector('#date-display-value')
const weekdayEl = document.querySelector('#date-display-weekday')
const totalCountEl = document.querySelector('#schedule-count')

function renderDateHeader(dateString) {
  if (!dateString) return

  const date = dayjs(dateString)
  const day = date.format('DD')
  const month = monthsPtBr[date.month()]
  const year = date.format('YYYY')
  const weekday = weekdaysPtBr[date.day()]

  if (dateValueEl) {
    dateValueEl.textContent = `${day} ${month} ${year}`
  }

  if (weekdayEl) {
    weekdayEl.textContent = weekday
  }
}

function updateNextAppointment(dailySchedules) {
  if (!dailySchedules) return

  const now = dayjs()

  const mapped = dailySchedules.map((schedule) => ({
    ...schedule,
    when: dayjs(schedule.when)
  }))

  const filtered = mapped.filter((schedule) => {
    return schedule.when.isAfter(now) && (schedule.status) !== 'done'
  })

  const sorted = filtered.sort((scheduleA, scheduleB) => scheduleA.when - scheduleB.when)

  const nextSchedule = sorted[0]
  const nextText = nextSchedule ? `Próximo: ${nextSchedule.when.format('HH:mm')} — ${nextSchedule.name}` : ''

  const nextAppointmentElements = document.querySelectorAll('.next-appointment')

  nextAppointmentElements.forEach((element) => {
    element.textContent = nextText
  })
}

function updateCounters() {
  const morningCount = document.querySelectorAll('#period-morning li').length
  const afternoonCount = document.querySelectorAll('#period-afternoon li').length
  const nightCount = document.querySelectorAll('#period-night li').length
  const total = morningCount + afternoonCount + nightCount

  if (totalCountEl) {
    totalCountEl.textContent = `${total} ${total === 1 ? 'atendimento' : 'atendimentos'}`
  }

  const totalSlots = openingHours.length
  const percent = Math.round((total / totalSlots) * 100)
  const bar = document.querySelector('#occupancy-bar')
  const text = document.querySelector('#occupancy-text')

  if (bar) {
    bar.style.width = `${percent}%`
  }

  if (text) {
    const slots = document.createElement('strong')
    slots.textContent = `${total}/${totalSlots}`

    const pct = document.createElement('strong')
    pct.textContent = `${percent}%`

    text.replaceChildren('Ocupação ', slots, ' · ', pct)
  }

  const morningLabel = document.querySelector('[data-period="morning"]')
  const afternoonLabel = document.querySelector('[data-period="afternoon"]')
  const nightLabel = document.querySelector('[data-period="night"]')

  if (morningLabel) {
    morningLabel.textContent = `${morningCount} —`
  }

  if (afternoonLabel) {
    afternoonLabel.textContent = `${afternoonCount} —`
  }

  if (nightLabel) {
    nightLabel.textContent = `${nightCount} —`
  }
}

if (dateInput) {
  renderDateHeader(dateInput.value)

  dateInput.addEventListener('input', () => renderDateHeader(dateInput.value))
  dateInput.addEventListener('change', () => renderDateHeader(dateInput.value))
}

document.addEventListener('DOMContentLoaded', () => {
  if (dateInput) {
    renderDateHeader(dateInput.value)
  }

  updateCounters()
})

export function refreshUI(dailySchedules) {
  if (dateInput) {
    renderDateHeader(dateInput.value)
  }

  updateCounters()

  updateNextAppointment(dailySchedules)

  const totalEl = document.querySelector('#day-total')

  const totalPaid = dailySchedules.reduce((sum, schedule) => {
    if (schedule.status !== 'done' || schedule.paid !== true) return sum

    return sum + (Number(schedule.price) || 0)
  }, 0)

  const totalToReceive = dailySchedules.reduce((sum, schedule) => {
    if (schedule.status !== 'done' || schedule.paid === true) return sum

    return sum + (Number(schedule.price) || 0)
  }, 0)

  if (totalEl) {
    if (totalPaid || totalToReceive) {
      const value = document.createElement('strong')
      value.textContent = totalToReceive > 0 ? `R$ ${totalPaid} (+R$ ${totalToReceive} a receber)` : `R$ ${totalPaid}`

      totalEl.replaceChildren('Faturamento ', value)
    } else {
      totalEl.replaceChildren()
    }
  }
}

setInterval(async () => {
  const dailySchedules = await scheduleFetchByDay({ date: dateInput.value })

  updateNextAppointment(dailySchedules)
}, 60000)