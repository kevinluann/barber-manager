import dayjs from "dayjs"
import { monthsPtBr, weekdaysPtBr } from "../utils/date-labels.js"

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

function updateCounters() {
  const morningCount = document.querySelectorAll('#period-morning li').length
  const afternoonCount = document.querySelectorAll('#period-afternoon li').length
  const nightCount = document.querySelectorAll('#period-night li').length
  const total = morningCount + afternoonCount + nightCount

  if (totalCountEl) {
    totalCountEl.textContent = `${total} ${total === 1 ? 'atendimento' : 'atendimentos'}`
  }

  const morningLabel = document.querySelector('[data-period="morning"]')
  const afternoonLabel = document.querySelector('[data-period="afternoon"]')
  const nightLabel = document.querySelector('[data-period="night"]')

  if (morningLabel) {
    morningLabel.textContent = morningCount ? `${morningCount} —` : 'Nenhum atendimento'
  }

  if (afternoonLabel) {
    afternoonLabel.textContent = afternoonCount ? `${afternoonCount} —` : 'Nenhum atendimento'
  }

  if (nightLabel) {
    nightLabel.textContent = nightCount ? `${nightCount} —` : 'Nenhum atendimento'
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

export function refreshUI() {
  if (dateInput) {
    renderDateHeader(dateInput.value)
  }

  updateCounters()
}
