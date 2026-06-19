// ─── SIDEBAR TOGGLE ───
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
const hamburger = document.getElementById('hamburger');

function openSidebar() {
  sidebar?.classList.add('open');
  overlay?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebar?.classList.remove('open');
  overlay?.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openSidebar);
overlay?.addEventListener('click', closeSidebar);

// Close on nav item click (mobile)
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    if (window.innerWidth < 768) closeSidebar();
  });
});

// ─── ACTIVE NAV ───
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-item').forEach(link => {
  const href = link.getAttribute('href');
  if (href && (href === currentPage || href.includes(currentPage.replace('.html','')))) {
    link.classList.add('active');
  }
});

document.querySelectorAll('.mobile-nav-item').forEach(link => {
  const href = link.getAttribute('href');
  if (href && (href === currentPage || href.includes(currentPage.replace('.html','')))) {
    link.classList.add('active');
  }
});

// ─── TABS ───
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const group = tab.closest('.tabs');
    group.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const target = tab.dataset.tab;
    if (target) {
      document.querySelectorAll('[data-panel]').forEach(panel => {
        panel.style.display = panel.dataset.panel === target ? 'block' : 'none';
      });
    }
  });
});

// ─── CLOCK ───
function updateClock() {
  const el = document.getElementById('live-clock');
  if (el) {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
}
setInterval(updateClock, 1000);
updateClock();

// ─── CONFIRM DELETE ───
document.querySelectorAll('[data-confirm]').forEach(btn => {
  btn.addEventListener('click', e => {
    if (!confirm(btn.dataset.confirm || 'Are you sure?')) e.preventDefault();
  });
});

// ─── SORT TABLE ───
document.querySelectorAll('th[data-sort]').forEach(th => {
  th.style.cursor = 'pointer';
  th.addEventListener('click', () => {
    const table = th.closest('table');
    const idx = Array.from(th.parentElement.children).indexOf(th);
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const asc = th.dataset.order !== 'asc';
    th.dataset.order = asc ? 'asc' : 'desc';

    rows.sort((a, b) => {
      const aVal = a.cells[idx]?.textContent.trim() || '';
      const bVal = b.cells[idx]?.textContent.trim() || '';
      const aNum = parseFloat(aVal);
      const bNum = parseFloat(bVal);
      if (!isNaN(aNum) && !isNaN(bNum)) return asc ? aNum - bNum : bNum - aNum;
      return asc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    rows.forEach(r => tbody.appendChild(r));
  });
});

// ─── SEARCH FILTER ───
const tableSearch = document.getElementById('tableSearch');
if (tableSearch) {
  tableSearch.addEventListener('input', () => {
    const val = tableSearch.value.toLowerCase();
    document.querySelectorAll('tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(val) ? '' : 'none';
    });
  });
}

// ─── TOAST NOTIFICATION ───
function showToast(msg, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  toast.style.cssText = `
    position:fixed; bottom:90px; right:20px; z-index:9999;
    background:${type==='success'?'var(--neon)':'var(--red)'}; 
    color:${type==='success'?'var(--navy)':'white'};
    padding:12px 20px; border-radius:8px; font-size:13px; font-weight:600;
    animation: slideIn 0.3s ease; box-shadow:0 4px 20px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ─── ADMIN FORMS ───
document.querySelectorAll('form[data-action]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Saved successfully!');
  });
});