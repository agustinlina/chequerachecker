document.addEventListener('DOMContentLoaded', () => {
  const invoiceDateInput = document.getElementById('invoiceDate')
  const chequeList = document.getElementById('chequeList')
  const addButton = document.createElement('button')
  addButton.textContent = 'Agregar cheque'
  addButton.id = 'addChequeButton'
  let chequeCount = 0

  function createChequeItem (index) {
    const div = document.createElement('div')
    div.classList.add('cheque-item')
    div.dataset.index = index

    const label = document.createElement('label')
    label.textContent = `Cheque ${index}:`

    const input = document.createElement('input')
    input.type = 'date'
    input.classList.add('cheque-date')
    input.addEventListener('input', updateDaysRemaining)

    const span = document.createElement('span')
    span.classList.add('days-remaining')

    // Botón para borrar la fecha del cheque
    const deleteButton = document.createElement('button')
    deleteButton.style.backgroundImage = 'url(./goma.png)'
    deleteButton.style.backgroundRepeat = 'no-repeat'
    deleteButton.classList.add('delete-cheque-button')
    deleteButton.style.width = '36px'
    deleteButton.style.height = '36px'
    deleteButton.style.backgroundPosition = 'center'
    deleteButton.style.position = 'absolute'
    deleteButton.style.transform = 'translate(1100%,18%)'
    deleteButton.style.padding = '28px'
    deleteButton.addEventListener('click', () => {
      input.value = ''
      updateDaysRemaining()
    })

    div.appendChild(label)
    div.appendChild(input)
    div.appendChild(span)
    div.appendChild(deleteButton)

    return div
  }

  function updateDaysRemaining () {
    const invoiceDateValue = invoiceDateInput.value
    if (!invoiceDateValue) return

    const invoiceDate = new Date(invoiceDateValue)
    const chequeDates = document.querySelectorAll('.cheque-date')
    const daysRemainingTexts = document.querySelectorAll('.days-remaining')

    chequeDates.forEach((chequeInput, index) => {
      const chequeDateValue = chequeInput.value
      const daysText = daysRemainingTexts[index]

      if (chequeDateValue) {
        const chequeDate = new Date(chequeDateValue)
        const timeDiff = chequeDate - invoiceDate
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24))

        if (daysDiff > 180) {
          daysText.innerHTML = `<div style=\"color:red;\">${daysDiff} días 😡</div>`
        } else if (daysDiff >= 0) {
          daysText.innerHTML = `<div style=\"color:rgba(25, 245, 39, 0.8);font-weight:bold\">${daysDiff} días</div>`
        } else {
          daysText.innerHTML = `<div style=\"color:yellow;\">Cheque al día 👍🏻</div>`
        }
      } else {
        daysText.textContent = ''
      }
    })
  }

  function initializeCheques (initialCount = 7) {
    chequeList.innerHTML = '' // Limpiar lista antes de inicializar
    for (let i = 1; i <= initialCount; i++) {
      chequeList.appendChild(createChequeItem(i))
    }
    chequeCount = initialCount
    if (!document.getElementById('addChequeButton')) {
      chequeList.after(addButton)
    }
  }

  addButton.addEventListener('click', () => {
    if (chequeCount >= 20) return
    chequeCount++
    chequeList.appendChild(createChequeItem(chequeCount))
    updateDaysRemaining()
  })

  invoiceDateInput.addEventListener('input', updateDaysRemaining)

  // Inicializar solo 7 cheques
  initializeCheques(7)
})
