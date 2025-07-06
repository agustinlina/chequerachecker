document.addEventListener('DOMContentLoaded', () => {
  const invoiceDateInput = document.getElementById('invoiceDate');
  const chequeList = document.getElementById('chequeList');
  const addButton = document.createElement('button');
  addButton.textContent = 'Agregar cheque';
  addButton.id = 'addChequeButton';
  let chequeCount = 0;

  function createChequeItem(index) {
    const div = document.createElement('div');
    div.classList.add('cheque-item');
    div.dataset.index = index;

    const label = document.createElement('label');
    label.textContent = `Cheque ${index}:`;

    const input = document.createElement('input');
    input.type = 'date';
    input.classList.add('cheque-date');
    input.addEventListener('input', updateDaysRemaining);

    const span = document.createElement('span');
    span.classList.add('days-remaining');

    div.appendChild(label);
    div.appendChild(input);
    div.appendChild(span);

    return div;
  }

  function updateDaysRemaining() {
    const invoiceDateValue = invoiceDateInput.value;
    if (!invoiceDateValue) return;

    const invoiceDate = new Date(invoiceDateValue);
    const chequeDates = document.querySelectorAll('.cheque-date');
    const daysRemainingTexts = document.querySelectorAll('.days-remaining');

    chequeDates.forEach((chequeInput, index) => {
      const chequeDateValue = chequeInput.value;
      const daysText = daysRemainingTexts[index];

      if (chequeDateValue) {
        const chequeDate = new Date(chequeDateValue);
        const timeDiff = chequeDate - invoiceDate;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        if (daysDiff > 180) {
          daysText.textContent = `${daysDiff} días, te estas yendo al posta papu`;
        } else if (daysDiff >= 0) {
          daysText.textContent = `${daysDiff} días hasta cobrar`;
        } else {
          daysText.textContent = `Ya vencido (${Math.abs(daysDiff)} días atrás)`;
        }
      } else {
        daysText.textContent = '';
      }
    });
  }

  function initializeCheques(initialCount = 7) {
    chequeList.innerHTML = '';
    for (let i = 1; i <= initialCount; i++) {
      chequeList.appendChild(createChequeItem(i));
    }
    chequeCount = initialCount;
    if (!document.getElementById('addChequeButton')) {
      chequeList.after(addButton);
    }
  }

  addButton.addEventListener('click', () => {
    if (chequeCount >= 20) return;
    chequeCount++;
    chequeList.appendChild(createChequeItem(chequeCount));
    updateDaysRemaining();
  });

  invoiceDateInput.addEventListener('input', updateDaysRemaining);

  // Inicializar solo 7 cheques
  initializeCheques(7);
});