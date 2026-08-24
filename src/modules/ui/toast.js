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

  if (existing) {
    existing.remove()
  }

  const toast = document.createElement('div')

  toast.className = `toast toast--${type}`
  toast.setAttribute('role', type === 'error' ? 'alert' : 'status')
  toast.textContent = message

  container.appendChild(toast)

  requestAnimationFrame(() => toast.classList.add('toast--visible'))

  const duration = 3200

  setTimeout(() => {
    toast.classList.remove('toast--visible')

    toast.addEventListener('transitionend', () => toast.remove())

    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.remove()
      }
    }, 300)
  }, duration)
}
