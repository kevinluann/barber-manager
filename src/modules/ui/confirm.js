export function showConfirm(message) {
  return new Promise((resolve) => {
    const popup = createPopup()

    const { cancelBtn, confirmBtn } = buildDialogContent(popup, message)

    document.body.appendChild(popup)

    bindDialogEvents(popup, resolve, cancelBtn, confirmBtn)

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

function buildDialogContent(popup, message) {
  const messageEl = document.createElement('p')
  messageEl.className = 'confirm-message'
  messageEl.textContent = message

  const actionsEl = document.createElement('div')
  actionsEl.className = 'confirm-actions'

  const cancelBtn = document.createElement('button')
  cancelBtn.type = 'button'
  cancelBtn.className = 'confirm-btn confirm-btn--cancel'
  cancelBtn.value = 'cancel'
  cancelBtn.textContent = 'Manter'

  const confirmBtn = document.createElement('button')
  confirmBtn.type = 'button'
  confirmBtn.className = 'confirm-btn confirm-btn--confirm'
  confirmBtn.value = 'confirm'
  confirmBtn.textContent = 'Remover'

  actionsEl.append(cancelBtn, confirmBtn)
  popup.append(messageEl, actionsEl)

  return { cancelBtn, confirmBtn }
}

function bindDialogEvents(popup, resolve, cancelBtn, confirmBtn) {
  function close(value) {
    popup.close()
    popup.remove()

    resolve(value === 'confirm')
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
