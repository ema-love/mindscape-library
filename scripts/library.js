if (!Auth.requireAuth()) {
  throw new Error('Authentication required');
}

State.init();
UI.init();

const currentUser = Auth.getCurrentUser();
document.querySelector('.app-title').textContent = `MindScape Library - ${currentUser.username}`;

function render() {
  UI.renderRecords(State.filteredRecords, State.searchTerm);
  UI.updateSortIndicators(State.currentSort.field, State.currentSort.direction);
  setupRecordEventListeners();
}

function setupRecordEventListeners() {
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      handleEdit(id);
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      handleDelete(id);
    });
  });
}

function handleEdit(id) {
  const record = State.getRecord(id);
  if (!record) return;

  State.editingId = id;
  document.getElementById('modal-title').textContent = 'Edit Book';
  document.getElementById('book-id').value = id;
  
  UI.populateForm('book-form', {
    title: record.title,
    author: record.author,
    pages: record.pages,
    tag: record.tag,
    dateAdded: record.dateAdded
  });

  UI.showModal('add-edit-modal');
}

function handleDelete(id) {
  const record = State.getRecord(id);
  if (!record) return;

  if (confirm(`Are you sure you want to delete "${record.title}"?`)) {
    const result = State.deleteRecord(id);
    if (result.success) {
      UI.announceToScreenReader(`Book "${record.title}" deleted`);
      render();
    }
  }
}

document.getElementById('add-book-btn').addEventListener('click', () => {
  State.editingId = null;
  document.getElementById('modal-title').textContent = 'Add Book';
  document.getElementById('book-id').value = '';
  UI.clearForm('book-form');
  
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('book-date').value = today;
  
  UI.showModal('add-edit-modal');
});

document.getElementById('book-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const form = e.target;
  UI.clearAllErrors(form);
  
  const formData = new FormData(form);
  const recordData = {
    title: formData.get('title'),
    author: formData.get('author'),
    pages: formData.get('pages'),
    tag: formData.get('tag'),
    dateAdded: formData.get('dateAdded')
  };

  let result;
  if (State.editingId) {
    result = State.updateRecord(State.editingId, recordData);
  } else {
    result = State.addRecord(recordData);
  }

  if (!result.success) {
    Object.keys(result.errors).forEach(field => {
      UI.showError(`book-${field}`, result.errors[field]);
    });
    return;
  }

  if (result.warnings && result.warnings.author) {
    const warningEl = document.getElementById('book-author-warning');
    warningEl.textContent = '⚠️ ' + result.warnings.author;
    warningEl.style.display = 'block';
  }

  UI.announceToScreenReader(State.editingId ? 'Book updated successfully' : 'Book added successfully');
  UI.hideModal('add-edit-modal');
  render();
});

document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const modal = e.target.closest('.modal');
    if (modal) {
      UI.hideModal(modal.id);
    }
  });
});

document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      UI.hideModal(modal.id);
    }
  });
});

document.getElementById('search-input').addEventListener('input', (e) => {
  State.setSearch(e.target.value);
  render();
  
  if (e.target.value) {
    UI.announceToScreenReader(`Found ${State.filteredRecords.length} books`);
  }
});

document.querySelectorAll('.sort-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const field = e.currentTarget.dataset.sort;
    State.toggleSortDirection(field);
    render();
    UI.announceToScreenReader(`Sorted by ${field} ${State.currentSort.direction}ending`);
  });
});

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('span');
const currentTheme = document.body.getAttribute('data-theme');
themeIcon.textContent = currentTheme === 'dark' ? '🌙' : '☀️';

themeToggle.addEventListener('click', () => {
  const newTheme = UI.toggleTheme();
  themeIcon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
});

document.getElementById('logout-btn').addEventListener('click', () => {
  if (confirm('Are you sure you want to logout?')) {
    Auth.logout();
    window.location.href = 'index.html';
  }
});

document.getElementById('stats-btn').addEventListener('click', () => {
  const stats = State.getStats();
  UI.renderStats(stats);
  UI.showModal('stats-modal');
});

document.getElementById('export-btn').addEventListener('click', () => {
  const data = State.exportRecords();
  const filename = `mindscape-library-${new Date().toISOString().split('T')[0]}.json`;
  UI.downloadJSON(data, filename);
  UI.announceToScreenReader('Library exported successfully');
});

document.getElementById('import-btn').addEventListener('click', () => {
  document.getElementById('import-file').value = '';
  document.getElementById('import-result').textContent = '';
  UI.showModal('import-modal');
});

document.getElementById('import-confirm').addEventListener('click', () => {
  const fileInput = document.getElementById('import-file');
  const resultDiv = document.getElementById('import-result');
  
  if (!fileInput.files.length) {
    resultDiv.textContent = 'Please select a file';
    resultDiv.className = 'import-result error';
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      const records = data.records || data;
      
      if (!Array.isArray(records)) {
        throw new Error('Invalid format: expected array of records');
      }

      const result = State.importRecords(records);
      
      if (result.success) {
        resultDiv.textContent = `Successfully imported ${result.imported} books`;
        resultDiv.className = 'import-result success';
        
        if (result.errors.length > 0) {
          resultDiv.textContent += ` (${result.errors.length} records skipped due to validation errors)`;
        }
        
        UI.announceToScreenReader(`Imported ${result.imported} books`);
        
        setTimeout(() => {
          UI.hideModal('import-modal');
          render();
        }, 2000);
      } else {
        throw new Error('No valid records found');
      }
    } catch (error) {
      resultDiv.textContent = `Import failed: ${error.message}`;
      resultDiv.className = 'import-result error';
    }
  };

  reader.readAsText(file);
});

render();
