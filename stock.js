document.addEventListener('DOMContentLoaded', () => {
  const updateSpan    = document.getElementById('lastUpdate');
  const tableBody     = document.getElementById('stockBody');
  const filterSelect  = document.getElementById('filterSelect');
  const searchInput   = document.getElementById('searchInput');
  const excelFile     = './STOCK.XLS';

  // Mostrar fecha de actualización
  const parts = excelFile.split('_');
  updateSpan.textContent = (parts.length >= 3)
    ? parts[2].replace('.XLS', '')
    : 'Desconocida';

  // Leer Excel
  fetch(excelFile)
    .then(res => res.arrayBuffer())
    .then(ab => {
      const data  = new Uint8Array(ab);
      const wb    = XLSX.read(data, { type: 'array' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const range = XLSX.utils.decode_range(sheet['!ref']);

      // Construir filas desde r=10
      const startRow = 10;
      for (let r = startRow; r <= range.e.r + 1; r++) {
        const descCell  = sheet['C' + r];
        const rubroCell = sheet['F' + r];
        const qtyCell   = sheet['H' + r];
        if (!descCell || !descCell.v || !rubroCell || !rubroCell.v) continue;

        const description = descCell.v.toString();
        const rubro       = rubroCell.v.toString().toUpperCase();
        const quantity    = qtyCell ? qtyCell.v : '';

        const tr = document.createElement('tr');
        tr.dataset.rubro       = rubro;
        tr.dataset.descripcion = description.toLowerCase();

        const tdDesc = document.createElement('td');
        tdDesc.textContent = description;
        const tdQty  = document.createElement('td');
        tdQty.textContent  = quantity;

        tr.appendChild(tdDesc);
        tr.appendChild(tdQty);
        tableBody.appendChild(tr);
      }

      applyFilter();
    })
    .catch(err => {
      console.error('Error leyendo el Excel:', err);
      updateSpan.textContent = 'Error al cargar';
    });

  // Filtrar según selección y búsqueda
  function applyFilter() {
    const filterTerm = filterSelect.value;
    const searchTerm = searchInput.value.trim().toLowerCase();

    document.querySelectorAll('#stockBody tr').forEach(tr => {
      const rubro = tr.dataset.rubro;
      const desc  = tr.dataset.descripcion;
      let show = true;

      // Lógica de filtro por rubro
      if (filterTerm === 'cubierta_china') {
        show = (rubro === 'TERCELO' || rubro.startsWith('ROYAL'));
      } else if (filterTerm === 'camion_chino') {
        show = (rubro === 'DIRECCION' || rubro === 'TRACCION');
      }

      // Lógica de búsqueda por descripción
      if (show && searchTerm) {
        show = desc.includes(searchTerm);
      }

      tr.style.display = show ? '' : 'none';
    });
  }

  // Eventos de filtrado y búsqueda
  filterSelect.addEventListener('change', applyFilter);
  searchInput.addEventListener('input', applyFilter);
});