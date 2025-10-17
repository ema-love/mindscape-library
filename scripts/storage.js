const Storage = {
  KEYS: {
    USERS: 'mindscape_users',
    RECORDS: 'mindscape_records',
    CURRENT_USER: 'mindscape_current_user',
    SETTINGS: 'mindscape_settings'
  },

  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      return false;
    }
  },

  getUsers() {
    return this.get(this.KEYS.USERS) || [];
  },

  saveUsers(users) {
    return this.set(this.KEYS.USERS, users);
  },

  getRecords() {
    return this.get(this.KEYS.RECORDS) || [];
  },

  saveRecords(records) {
    return this.set(this.KEYS.RECORDS, records);
  },

  getCurrentUser() {
    return this.get(this.KEYS.CURRENT_USER);
  },

  setCurrentUser(user) {
    return this.set(this.KEYS.CURRENT_USER, user);
  },

  clearCurrentUser() {
    return this.remove(this.KEYS.CURRENT_USER);
  },

  getSettings() {
    return this.get(this.KEYS.SETTINGS) || {
      theme: 'dark',
      pageUnits: 'pages'
    };
  },

  saveSettings(settings) {
    return this.set(this.KEYS.SETTINGS, settings);
  },

  exportData() {
    return {
      users: this.getUsers(),
      records: this.getRecords(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString()
    };
  },

  importData(data) {
    try {
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data format: expected an object');
      }

      if (data.users) {
        if (!Array.isArray(data.users)) {
          throw new Error('Invalid users format: expected an array');
        }
        data.users.forEach((user, index) => {
          if (!user.id || !user.username || !user.email || !user.password) {
            throw new Error(`Invalid user at index ${index}: missing required fields`);
          }
        });
        this.saveUsers(data.users);
      }

      if (data.records) {
        if (!Array.isArray(data.records)) {
          throw new Error('Invalid records format: expected an array');
        }
        data.records.forEach((record, index) => {
          if (!record.title || !record.author || record.pages === undefined || !record.tag || !record.dateAdded) {
            throw new Error(`Invalid record at index ${index}: missing required fields (title, author, pages, tag, dateAdded)`);
          }
        });
        this.saveRecords(data.records);
      }

      if (data.settings) {
        if (typeof data.settings !== 'object') {
          throw new Error('Invalid settings format: expected an object');
        }
        this.saveSettings(data.settings);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
