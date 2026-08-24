export function getEditDialog() {
  const existing = document.querySelector('#edit-dialog')

  if (existing) {
    return existing
  }

  const dialog = createDialog()
  const form = createForm()

  form.append(
    createTitle(),
    createDescription(),
    createIdField(),
    createClientField(),
    createHoursField(),
    createButtons()
  )

  dialog.appendChild(form)
  document.body.appendChild(dialog)

  return dialog
}

function createDialog() {
  const dialog = document.createElement('dialog')

  dialog.id = 'edit-dialog'
  dialog.className = 'edit-dialog'
  dialog.setAttribute('aria-labelledby', 'edit-dialog-title')

  return dialog
}

function createTitle() {
  const title = document.createElement('h3')

  title.id = 'edit-dialog-title'
  title.textContent = 'Editar agendamento'

  return title
}

function createDescription() {
  const descriptionEl = document.createElement('p')

  descriptionEl.className = 'edit-hint'
  descriptionEl.textContent = 'Altere o nome e o horário. Data permanece a do dia selecionado.'

  return descriptionEl
}

function createIdField() {
  const input = document.createElement('input')

  input.type = 'hidden'
  input.id = 'edit-id'

  return input
}

function createClientField() {
  const fieldWrapper = document.createElement('div')
  fieldWrapper.className = 'field'

  const label = document.createElement('label')
  label.htmlFor = 'edit-client'
  label.className = 'label'
  label.textContent = 'Cliente'

  const wrap = document.createElement('div')
  wrap.className = 'input'

  const iconWrap = document.createElement('i')
  iconWrap.setAttribute('aria-hidden', 'true')

  const iconImg = document.createElement('img')
  iconImg.src = './assets/person.svg'
  iconImg.alt = ''

  iconWrap.appendChild(iconImg)

  const input = document.createElement('input')
  input.type = 'text'
  input.id = 'edit-client'
  input.placeholder = 'Nome do cliente'
  input.required = true
  input.autocomplete = 'off'

  wrap.append(iconWrap, input)
  fieldWrapper.append(label, wrap)

  return fieldWrapper
}

function createHoursField() {
  const fieldWrapper = document.createElement('div')
  fieldWrapper.className = 'field'

  const label = document.createElement('span')
  label.className = 'label'
  label.id = 'edit-hours-label'
  label.textContent = 'Horário'

  const descriptionEl = document.createElement('p')
  descriptionEl.className = 'field-hint'
  descriptionEl.textContent = 'Selecione um novo horário disponível.'

  const list = document.createElement('ul')
  list.id = 'edit-hours'
  list.className = 'hours'
  list.setAttribute('aria-labelledby', 'edit-hours-label')

  fieldWrapper.append(label, descriptionEl, list)

  return fieldWrapper
}

function createButtons() {
  const actions = document.createElement('div')
  actions.className = 'edit-actions'

  const btnCancel = document.createElement('button')
  btnCancel.type = 'button'
  btnCancel.className = 'confirm-btn confirm-btn--cancel'
  btnCancel.id = 'edit-cancel'
  btnCancel.textContent = 'Cancelar'

  const btnSave = document.createElement('button')
  btnSave.type = 'submit'
  btnSave.className = 'confirm-btn confirm-btn--confirm'
  btnSave.textContent = 'Salvar'

  actions.append(btnCancel, btnSave)

  return actions
}
