export function showConfirm(message, confirmText, cancelText, { showPaid = false } = {}) {
  return new Promise((resolve) => {
    const popup = createPopup()

    const { cancelBtn, confirmBtn, paidBox } = buildDialogContent(popup, message, confirmText, cancelText, showPaid)

    document.body.appendChild(popup)

    bindDialogEvents(popup, resolve, cancelBtn, confirmBtn, paidBox)

    openPopup(popup)
  })
}

function createPopup() {
  document.querySelector('#confirm-dialog')?.remove()

  const popup = document.createElement('dialog')

  popup.id = 'confirm-dialog'
  popup.className = 'confirm-dialog'

  return popup
}

function buildDialogContent(popup, message, confirmText, cancelText, showPaid) {
  const messageEl = document.createElement('p')
  messageEl.className = 'confirm-message'
  messageEl.textContent = message

  const actionsEl = document.createElement('div')
  actionsEl.className = 'confirm-actions'

  const cancelBtn = document.createElement('button')
  cancelBtn.type = 'button'
  cancelBtn.className = 'confirm-btn confirm-btn--cancel'
  cancelBtn.value = 'cancel'

  const cancelIcon = document.createElement('img')
  cancelIcon.src = './assets/cancel-dark.svg'
  cancelIcon.alt = ''
  cancelIcon.setAttribute('aria-hidden', 'true')

  const cancelLabel = document.createElement('span')
  cancelLabel.textContent = cancelText
  cancelBtn.append(cancelIcon, cancelLabel)

  const confirmBtn = document.createElement('button')
  confirmBtn.type = 'button'
  confirmBtn.className = 'confirm-btn confirm-btn--confirm'
  confirmBtn.value = 'confirm'

  const confirmIcon = document.createElement('img')
  confirmIcon.src = './assets/check-paper.svg'
  confirmIcon.alt = ''
  confirmIcon.setAttribute('aria-hidden', 'true')

  const confirmLabel = document.createElement('span')
  confirmLabel.textContent = confirmText
  confirmBtn.append(confirmIcon, confirmLabel)

  actionsEl.append(cancelBtn, confirmBtn)

  let paidBox = null

  if (showPaid) {
    const paidLabel = document.createElement("label")
    paidLabel.className = "confirm-paid"

    paidBox = document.createElement("input")
    paidBox.type = "checkbox"
    paidBox.checked = true

    paidLabel.append(paidBox, " Pagamento recebido")

    popup.append(messageEl, paidLabel, actionsEl)
  } else {
    popup.append(messageEl, actionsEl)
  }

  return { cancelBtn, confirmBtn, paidBox }
}

function bindDialogEvents(popup, resolve, cancelBtn, confirmBtn, paidBox) {
  function close(value) {
    popup.close()
    popup.remove()

    resolve({
      confirmed: value === "confirm",
      paid: paidBox ? paidBox.checked : false
    })
  }

  cancelBtn.addEventListener('click', () => close('cancel'))
  confirmBtn.addEventListener('click', () => close('confirm'))

  popup.addEventListener('cancel', (event) => {
    event.preventDefault()

    close('cancel')
  })

  popup.addEventListener('click', (event) => {
    if (event.target === popup) {
      close('cancel')
    }
  })
}

function openPopup(popup) {
  if (typeof popup.showModal === 'function') {
    popup.showModal()
  } else {
    popup.setAttribute('open', '')
  }
}
