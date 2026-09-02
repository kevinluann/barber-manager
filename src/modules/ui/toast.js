let toastContainer = null

function getContainer() {
  if (toastContainer) return toastContainer

  toastContainer = document.querySelector('#toast-container')

  if (!toastContainer) {
    toastContainer = document.createElement('div')

    toastContainer.id = 'toast-container'
    toastContainer.setAttribute('aria-live', 'polite')
    toastContainer.setAttribute('aria-atomic', 'false')

    document.body.appendChild(toastContainer)
  }

  return toastContainer
}

export function showToast(message, type = 'info') {
  const container = getContainer()

  const existing = container.querySelector('.toast')
  if (existing) existing.remove()

  const toast = document.createElement('div')
  toast.className = `toast toast--${type}`
  toast.setAttribute('role', type === 'error' ? 'alert' : 'status')
  toast.textContent = message
  toast.style.pointerEvents = 'auto'

  container.appendChild(toast)

  requestAnimationFrame(() => toast.classList.add('toast--visible'))

  const duration = 3200

  setTimeout(() => hideToast(toast), duration)

  return toast
}

export function showToastWithUndo(message) {
  const container = getContainer()
  container.querySelector('.toast')?.remove()

  const toast = document.createElement('div')
  toast.className = 'toast toast--info'
  toast.style.pointerEvents = 'auto'

  const messageEl = document.createElement('span')
  messageEl.textContent = message

  const undoBtn = document.createElement('button')
  undoBtn.className = 'toast-undo'
  undoBtn.textContent = 'Desfazer'

  toast.style.display = 'inline-flex'
  toast.style.gap = '0.6rem'
  toast.style.alignItems = 'center'
  toast.append(messageEl, undoBtn)

  container.appendChild(toast)

  requestAnimationFrame(() => toast.classList.add('toast--visible'))

  let timer = setTimeout(() => {
    hideToast(toast)
  }, 5000);

  toast.addEventListener('mouseenter', () => clearTimeout(timer))

  toast.addEventListener('mouseleave', () => {
    timer = setTimeout(() => {
      hideToast(toast)
    }, 2000);
  })

  return toast
}

function hideToast(toast) {
  toast.classList.remove('toast--visible')

  toast.addEventListener('transitionend', () => toast.remove())

  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.remove()
    }
  }, 300);
}