function extractOptionData(option) {
  const icon = option.dataset.icon
  const price = option.dataset.price
  const duration = option.dataset.duration
  const fullText = option.textContent.trim()
  const serviceName = fullText.split(" - ")[0] || option.value

  return { serviceName, price, duration, icon }
}

function hideNativeSelect(selectEl) {
  selectEl.dataset.customEnhanced = "true"
  selectEl.setAttribute("aria-hidden", "true")
  selectEl.tabIndex = -1
  selectEl.style.display = "none"
}

function buildSelectUI(selectEl) {
  const wrapper = document.createElement("div")
  wrapper.className = "custom-select"
  wrapper.dataset.for = selectEl.id

  const list = document.createElement("ul")
  list.className = "custom-select-list"
  list.setAttribute("role", "listbox")
  list.id = `${selectEl.id}-listbox`
  list.hidden = true

  const selectButton = document.createElement("button")
  selectButton.type = "button"
  selectButton.className = "custom-select-trigger"
  selectButton.id = `${selectEl.id}-trigger`
  selectButton.setAttribute("aria-haspopup", "listbox")
  selectButton.setAttribute("aria-expanded", "false")
  selectButton.setAttribute("aria-controls", list.id)

  const ariaLabel = selectEl.getAttribute("aria-label")
  if (ariaLabel) selectButton.setAttribute("aria-label", ariaLabel)

  const displayWrap = document.createElement("span")
  displayWrap.className = "custom-select-value"
  const displayIcon = document.createElement("img")
  displayIcon.alt = ""
  displayIcon.setAttribute("aria-hidden", "true")
  const displayLabel = document.createElement("span")
  displayLabel.className = "custom-select-text"
  const displayDetails = document.createElement("span")
  displayDetails.className = "custom-select-meta"
  displayWrap.append(displayIcon, displayLabel, displayDetails)

  const arrow = document.createElement("img")
  arrow.src = "./assets/arrow-down.svg"
  arrow.alt = ""
  arrow.className = "custom-select-arrow"
  arrow.setAttribute("aria-hidden", "true")
  selectButton.append(displayWrap, arrow)

  const optionElements = [...selectEl.options]
  optionElements.forEach((option) => {
    const { serviceName, price, duration } = extractOptionData(option)
    const item = document.createElement("li")
    item.className = "custom-select-option"
    item.setAttribute("role", "option")
    item.dataset.value = option.value
    item.tabIndex = -1

    const icon = document.createElement("img")
    icon.src = option.dataset.icon || ""
    icon.alt = ""
    icon.setAttribute("aria-hidden", "true")

    const name = document.createElement("span")
    name.textContent = serviceName

    const optionDetails = document.createElement("span")
    optionDetails.className = "custom-select-meta"
    const priceEl = document.createElement("span")
    priceEl.className = "price"
    priceEl.textContent = `R$${price}`
    const dot = document.createElement("span")
    dot.textContent = "·"
    dot.setAttribute("aria-hidden", "true")
    const durationEl = document.createElement("span")
    durationEl.textContent = `${duration}min`
    optionDetails.append(priceEl, dot, durationEl)

    item.append(icon, name, optionDetails)
    list.appendChild(item)
  })

  wrapper.append(selectButton, list)

  return wrapper
}

function createDropdownControls({ selectButton, list, wrapper }) {
  function shouldOpenUpward() {
    const buttonPositionOnScreen = selectButton.getBoundingClientRect()
    const dropdownListHeight = list.offsetHeight || 0

    const freeSpaceAboveButton = buttonPositionOnScreen.top
    const freeSpaceBelowButton = window.innerHeight - buttonPositionOnScreen.bottom

    return freeSpaceBelowButton < dropdownListHeight && freeSpaceAboveButton > freeSpaceBelowButton
  }

  function openDropdown() {
    list.hidden = false
    wrapper.classList.toggle("is-dropup", shouldOpenUpward())
    selectButton.setAttribute("aria-expanded", "true")
    wrapper.classList.add("is-open")
  }

  function closeDropdown() {
    list.hidden = true
    selectButton.setAttribute("aria-expanded", "false")
    wrapper.classList.remove("is-open")
    wrapper.classList.remove("is-dropup")
  }

  function toggleDropdown() {
    if (list.hidden) {
      openDropdown()
    } else {
      closeDropdown()
    }
  }

  return { openDropdown, closeDropdown, toggleDropdown }
}

export function applySelectValue({ selectEl, syncSelect, closeDropdown, selectButton, value }) {
  selectEl.value = value
  syncSelect()
  closeDropdown()
  selectButton.focus()
}

function bindSelectButtonEvents({ selectButton, list, selectEl, syncSelect, openDropdown, closeDropdown, toggleDropdown }) {
  selectButton.addEventListener("click", toggleDropdown)

  selectButton.addEventListener("keydown", (event) => {
    const isOpen = !list.hidden

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()

      if (!isOpen) {
        openDropdown()
      }

      const items = [...list.querySelectorAll(".custom-select-option")]
      const current = items.findIndex((element) => {
        element.getAttribute("aria-selected") === "true"
      })

      let next = current

      if (event.key === "ArrowDown") {
        next = Math.min(items.length - 1, current + 1)
      }
      if (event.key === "ArrowUp") {
        next = Math.max(0, current - 1)
      }

      if (items[next]) {
        applySelectValue({ selectEl, syncSelect, closeDropdown, selectButton, value: items[next].dataset.value })
      }
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()

      if (!isOpen) {
        openDropdown()
      } else {
        const selected = list.querySelector('[aria-selected="true"]')

        if (selected) {
          applySelectValue({ selectEl, syncSelect, closeDropdown, selectButton, value: selected.dataset.value })
        }
      }
    }

    if (event.key === "Escape") {
      closeDropdown()
      selectButton.focus()
    }
  })
}

function bindCustomEvents({ list, wrapper, closeDropdown, selectEl, syncSelect, selectButton }) {
  list.addEventListener("click", (event) => {
    const item = event.target.closest(".custom-select-option")

    if (!item) return

    applySelectValue({ selectEl, syncSelect, closeDropdown, selectButton, value: item.dataset.value })
  })

  document.addEventListener("click", (event) => {
    if (!wrapper.contains(event.target)) {
      closeDropdown()
    }
  })

  selectEl.addEventListener("change", syncSelect)
}

export function enhanceSelect(selectEl) {
  if (!selectEl || selectEl.dataset.customEnhanced === "true") return
  if (!selectEl.options || typeof selectEl.value === "undefined") return

  hideNativeSelect(selectEl)

  const linkedLabel = document.querySelector(`label[for="${selectEl.id}"]`)
  const wrapper = buildSelectUI(selectEl)
  const selectButton = wrapper.querySelector(".custom-select-trigger")
  const displayIcon = wrapper.querySelector(".custom-select-value img")
  const displayLabel = wrapper.querySelector(".custom-select-text")
  const displayDetails = wrapper.querySelector(".custom-select-value .custom-select-meta")
  const list = wrapper.querySelector(".custom-select-list")
  const optionElements = [...selectEl.options]

  function syncSelect() {
    const selected = selectEl.selectedOptions[0] || optionElements[0]
    const { serviceName, price, duration } = extractOptionData(selected)
    displayIcon.src = selected.dataset.icon || ""
    displayLabel.textContent = serviceName
    displayDetails.textContent = `R$${price} · ${duration}min`

    const optionItems = list.querySelectorAll(".custom-select-option")

    optionItems.forEach((item) => {
      const isSelected = item.dataset.value === selected.value

      item.setAttribute("aria-selected", isSelected ? "true" : "false")
      item.classList.toggle("is-selected", isSelected)
    })
  }

  const { openDropdown, closeDropdown, toggleDropdown } = createDropdownControls({ selectButton, list, wrapper })

  bindSelectButtonEvents({ selectButton, list, selectEl, syncSelect, openDropdown, closeDropdown, toggleDropdown })
  bindCustomEvents({ list, wrapper, closeDropdown, selectEl, syncSelect, selectButton })

  syncSelect()

  selectEl.insertAdjacentElement("afterend", wrapper)

  if (linkedLabel) {
    linkedLabel.htmlFor = selectButton.id
  }
}

export function refreshCustomSelect(selectEl) {
  const wrapper = document.querySelector(`.custom-select[data-for="${selectEl.id}"]`)

  if (!wrapper) return

  const displayIcon = wrapper.querySelector(".custom-select-value img")
  const displayLabel = wrapper.querySelector(".custom-select-text")
  const displayDetails = wrapper.querySelector(".custom-select-value .custom-select-meta")
  const list = wrapper.querySelector(".custom-select-list")
  const selected = selectEl.selectedOptions[0] || selectEl.options[0]

  if (!selected) return

  const { serviceName, price, duration } = extractOptionData(selected)
  displayIcon.src = selected.dataset.icon || ""
  displayLabel.textContent = serviceName
  displayDetails.textContent = `R$${price} · ${duration}min`

  const optionItems = list.querySelectorAll(".custom-select-option")

  optionItems.forEach((item) => {
    const isSelected = item.dataset.value === selected.value

    item.setAttribute("aria-selected", isSelected ? "true" : "false")
    item.classList.toggle("is-selected", isSelected)
  })
}

export function initCustomSelects() {
  const serviceSelect = document.querySelector("#service")

  if (serviceSelect) {
    enhanceSelect(serviceSelect)
  }

  const editServiceSelect = document.querySelector("#edit-service")

  if (editServiceSelect) {
    enhanceSelect(editServiceSelect)
  }
}
