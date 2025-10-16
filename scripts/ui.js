const UI = {
  init() {
    this.setupTheme();
    this.setupAriaLive();
  },

  setupAriaLive() {
    if (!document.getElementById('aria-live-region')) {
      const liveRegion = document.createElement('div');
      liveRegion.id = 'aria-live-region';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }
  },

  announceToScreenReader(message) {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
      liveRegion.textContent = '';
      setTimeout(() => {
        liveRegion.textContent = message;
      }, 100);
    }
  },

  setupTheme() {
    const settings = Storage.getSettings();
    this.applyTheme(settings.theme);
  },

  applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    const settings = Storage.getSettings();
    settings.theme = theme;
    Storage.saveSettings(settings);
  },

  toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    this.announceToScreenReader(`Switched to ${newTheme} theme`);
    return newTheme;
  },

  showError(elementId, message) {
    const errorElement = document.getElementById(`${elementId}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      this.announceToScreenReader(message);
    }
  },

  clearError(elementId) {
    const errorElement = document.getElementById(`${elementId}-error`);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  },

  clearAllErrors(formElement) {
    const errorElements = formElement.querySelectorAll('.error-message');
    errorElements.forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
  },

  renderRecords(records, searchTerm = '') {
    const container = document.getElementById('records-container');
    if (!container) return;

    if (records.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>No records found. ${searchTerm ? 'Try a different search term.' : 'Add your first book!'}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = records.map(record => this.renderRecordCard(record, searchTerm)).join('');
  },

  renderRecordCard(record, searchTerm = '') {
    const title = searchTerm ? Search.highlightMatches(record.title, searchTerm) : record.title;
    const author = searchTerm ? Search.highlightMatches(record.author, searchTerm) : record.author;
    const tag = searchTerm ? Search.highlightMatches(record.tag, searchTerm) : record.tag;

    return `
      <article class="record-card" data-record-id="${record.id}">
        <div class="record-header">
          <h3 class="record-title">${title}</h3>
          <div class="record-actions">
            <button class="btn-icon edit-btn" data-id="${record.id}" aria-label="Edit ${record.title}">
              <span aria-hidden="true">✏️</span>
            </button>
            <button class="btn-icon delete-btn" data-id="${record.id}" aria-label="Delete ${record.title}">
              <span aria-hidden="true">🗑️</span>
            </button>
          </div>
        </div>
        <p class="record-author">by ${author}</p>
        <div class="record-meta">
          <span class="record-pages">${record.pages} pages</span>
          <span class="record-tag">${tag}</span>
          <span class="record-date">${this.formatDate(record.dateAdded)}</span>
        </div>
      </article>
    `;
  },

  renderStats(stats) {
    const statsContainer = document.getElementById('stats-dashboard');
    if (!statsContainer) return;

    statsContainer.innerHTML = `
      <div class="stat-card">
        <h3>Total Records</h3>
        <p class="stat-value">${stats.total}</p>
      </div>
      <div class="stat-card">
        <h3>Total Pages</h3>
        <p class="stat-value">${stats.totalPages.toLocaleString()}</p>
      </div>
      <div class="stat-card">
        <h3>Most Frequent Tag</h3>
        <p class="stat-value">${stats.mostFrequentTag}</p>
        <p class="stat-detail">${stats.tagCount} occurrences</p>
      </div>
      <div class="stat-card">
        <h3>Last 7 Days</h3>
        <p class="stat-value">${stats.recentRecords}</p>
        <p class="stat-detail">new records</p>
      </div>
    `;
  },

  updateSortIndicators(field, direction) {
    document.querySelectorAll('.sort-btn').forEach(btn => {
      btn.classList.remove('active', 'asc', 'desc');
      const arrow = btn.querySelector('.sort-arrow');
      if (arrow) arrow.textContent = '';
    });

    const activeBtn = document.querySelector(`[data-sort="${field}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active', direction);
      const arrow = activeBtn.querySelector('.sort-arrow');
      if (arrow) {
        arrow.textContent = direction === 'asc' ? '▲' : '▼';
      }
    }
  },

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  },

  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      const firstInput = modal.querySelector('input, button');
      if (firstInput) firstInput.focus();
    }
  },

  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  },

  populateForm(formId, data) {
    const form = document.getElementById(formId);
    if (!form) return;

    Object.keys(data).forEach(key => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) {
        input.value = data[key];
      }
    });
  },

  clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
      form.reset();
      this.clearAllErrors(form);
    }
  },

  downloadJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },

  smoothScroll(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};
