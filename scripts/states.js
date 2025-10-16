const State = {
  records: [],
  filteredRecords: [],
  currentSort: { field: 'dateAdded', direction: 'desc' },
  searchTerm: '',
  editingId: null,

  init() {
    this.records = Storage.getRecords();
    this.filteredRecords = [...this.records];
  },

  addRecord(recordData) {
    const validation = Validators.validateRecord(recordData);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const newRecord = {
      id: `rec_${Date.now()}`,
      title: recordData.title,
      author: recordData.author,
      pages: parseInt(recordData.pages, 10),
      tag: recordData.tag,
      dateAdded: recordData.dateAdded,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.records.push(newRecord);
    Storage.saveRecords(this.records);
    this.applyFiltersAndSort();

    return { 
      success: true, 
      record: newRecord, 
      warnings: validation.warnings 
    };
  },

  updateRecord(id, recordData) {
    const validation = Validators.validateRecord(recordData);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const index = this.records.findIndex(r => r.id === id);
    if (index === -1) {
      return { success: false, error: 'Record not found' };
    }

    this.records[index] = {
      ...this.records[index],
      title: recordData.title,
      author: recordData.author,
      pages: parseInt(recordData.pages, 10),
      tag: recordData.tag,
      dateAdded: recordData.dateAdded,
      updatedAt: new Date().toISOString()
    };

    Storage.saveRecords(this.records);
    this.applyFiltersAndSort();

    return { 
      success: true, 
      record: this.records[index],
      warnings: validation.warnings 
    };
  },

  deleteRecord(id) {
    const index = this.records.findIndex(r => r.id === id);
    if (index === -1) {
      return { success: false, error: 'Record not found' };
    }

    this.records.splice(index, 1);
    Storage.saveRecords(this.records);
    this.applyFiltersAndSort();

    return { success: true };
  },

  getRecord(id) {
    return this.records.find(r => r.id === id);
  },

  setSearch(searchTerm) {
    this.searchTerm = searchTerm;
    this.applyFiltersAndSort();
  },

  setSort(field, direction) {
    this.currentSort = { field, direction };
    this.applyFiltersAndSort();
  },

  toggleSortDirection(field) {
    if (this.currentSort.field === field) {
      this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort.field = field;
      this.currentSort.direction = 'asc';
    }
    this.applyFiltersAndSort();
  },

  applyFiltersAndSort() {
    let filtered = Search.searchRecords(this.records, this.searchTerm);
    
    filtered.sort((a, b) => {
      const field = this.currentSort.field;
      let aVal = a[field];
      let bVal = b[field];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (this.currentSort.direction === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

    this.filteredRecords = filtered;
  },

  getStats() {
    const total = this.records.length;
    const totalPages = this.records.reduce((sum, r) => sum + r.pages, 0);
    
    const tagCounts = {};
    this.records.forEach(r => {
      tagCounts[r.tag] = (tagCounts[r.tag] || 0) + 1;
    });
    
    let mostFrequentTag = null;
    let maxCount = 0;
    for (const [tag, count] of Object.entries(tagCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentTag = tag;
      }
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRecords = this.records.filter(r => 
      new Date(r.dateAdded) >= sevenDaysAgo
    ).length;

    return {
      total,
      totalPages,
      mostFrequentTag: mostFrequentTag || 'None',
      tagCount: maxCount,
      recentRecords
    };
  },

  importRecords(records) {
    const validRecords = [];
    const errors = [];

    records.forEach((record, index) => {
      const validation = Validators.validateRecord(record);
      if (validation.valid) {
        validRecords.push({
          id: record.id || `rec_${Date.now()}_${index}`,
          ...record,
          pages: parseInt(record.pages, 10),
          createdAt: record.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } else {
        errors.push({ index, errors: validation.errors });
      }
    });

    if (validRecords.length > 0) {
      this.records = validRecords;
      Storage.saveRecords(this.records);
      this.applyFiltersAndSort();
    }

    return {
      success: validRecords.length > 0,
      imported: validRecords.length,
      errors
    };
  },

  exportRecords() {
    return {
      records: this.records,
      exportedAt: new Date().toISOString(),
      total: this.records.length
    };
  }
};
