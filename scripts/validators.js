const Validators = {
  patterns: {
    username: /^[a-zA-Z0-9_]+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    title: /^\S(?:.*\S)?$/,
    pages: /^(0|[1-9]\d*)$/,
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    tag: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
    authorRepeatedSurname: /\b(\w+)\s+\1\b/i
  },

  messages: {
    username: 'Username must contain only letters, numbers, and underscores',
    email: 'Please enter a valid email address',
    password: 'Password must be at least 8 characters with uppercase, lowercase, and number',
    passwordMatch: 'Passwords do not match',
    title: 'Title cannot have leading or trailing spaces',
    pages: 'Pages must be a non-negative integer',
    date: 'Date must be in YYYY-MM-DD format',
    tag: 'Tag must contain only letters, spaces, or hyphens',
    required: 'This field is required'
  },

  validateUsername(username) {
    if (!username || !username.trim()) {
      return { valid: false, message: this.messages.required };
    }
    if (username !== username.trim()) {
      return { valid: false, message: 'Username cannot have leading or trailing spaces' };
    }
    if (!this.patterns.username.test(username)) {
      return { valid: false, message: this.messages.username };
    }
    return { valid: true };
  },

  validateEmail(email) {
    if (!email || !email.trim()) {
      return { valid: false, message: this.messages.required };
    }
    if (!this.patterns.email.test(email)) {
      return { valid: false, message: this.messages.email };
    }
    return { valid: true };
  },

  validatePassword(password) {
    if (!password) {
      return { valid: false, message: this.messages.required };
    }
    if (!this.patterns.password.test(password)) {
      return { valid: false, message: this.messages.password };
    }
    return { valid: true };
  },

  validatePasswordMatch(password, confirmPassword) {
    if (password !== confirmPassword) {
      return { valid: false, message: this.messages.passwordMatch };
    }
    return { valid: true };
  },

  validateTitle(title) {
    if (!title || !title.trim()) {
      return { valid: false, message: this.messages.required };
    }
    if (!this.patterns.title.test(title)) {
      return { valid: false, message: this.messages.title };
    }
    return { valid: true };
  },

  validateAuthor(author) {
    if (!author || !author.trim()) {
      return { valid: false, message: this.messages.required };
    }
    if (this.patterns.authorRepeatedSurname.test(author)) {
      return { 
        valid: true, 
        warning: 'Author name appears to have repeated surname (e.g., "Smith Smith")'
      };
    }
    return { valid: true };
  },

  validatePages(pages) {
    if (pages === '' || pages === null || pages === undefined) {
      return { valid: false, message: this.messages.required };
    }
    if (!this.patterns.pages.test(String(pages))) {
      return { valid: false, message: this.messages.pages };
    }
    return { valid: true };
  },

  validateDate(date) {
    if (!date || !date.trim()) {
      return { valid: false, message: this.messages.required };
    }
    if (!this.patterns.date.test(date)) {
      return { valid: false, message: this.messages.date };
    }
    
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    if (dateObj.getFullYear() !== year || 
        dateObj.getMonth() !== month - 1 || 
        dateObj.getDate() !== day) {
      return { valid: false, message: 'Invalid date (e.g., February 30th)' };
    }
    
    return { valid: true };
  },

  validateTag(tag) {
    if (!tag || !tag.trim()) {
      return { valid: false, message: this.messages.required };
    }
    if (!this.patterns.tag.test(tag)) {
      return { valid: false, message: this.messages.tag };
    }
    return { valid: true };
  },

  validateRecord(record) {
    const errors = {};
    
    const titleResult = this.validateTitle(record.title);
    if (!titleResult.valid) errors.title = titleResult.message;
    
    const authorResult = this.validateAuthor(record.author);
    if (!authorResult.valid) errors.author = authorResult.message;
    
    const pagesResult = this.validatePages(record.pages);
    if (!pagesResult.valid) errors.pages = pagesResult.message;
    
    const dateResult = this.validateDate(record.dateAdded);
    if (!dateResult.valid) errors.dateAdded = dateResult.message;
    
    const tagResult = this.validateTag(record.tag);
    if (!tagResult.valid) errors.tag = tagResult.message;
    
    return {
      valid: Object.keys(errors).length === 0,
      errors,
      warnings: authorResult.warning ? { author: authorResult.warning } : {}
    };
  }
};
