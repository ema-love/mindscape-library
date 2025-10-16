const Search = {
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  },

  safeRegexCompile(pattern, flags = 'gi') {
    try {
      return new RegExp(pattern, flags);
    } catch (e) {
      return null;
    }
  },

  highlightMatches(text, searchTerm) {
    if (!searchTerm || !text) return text;
    
    const escapedTerm = this.escapeRegex(searchTerm);
    const regex = this.safeRegexCompile(escapedTerm, 'gi');
    
    if (!regex) return text;
    
    return text.replace(regex, match => `<mark>${match}</mark>`);
  },

  searchRecords(records, searchTerm, options = {}) {
    if (!searchTerm || searchTerm.trim() === '') {
      return records;
    }

    const useRegex = options.useRegex || false;
    let regex;

    if (useRegex) {
      regex = this.safeRegexCompile(searchTerm, 'i');
      if (!regex) {
        console.warn('Invalid regex pattern, falling back to literal search');
        regex = this.safeRegexCompile(this.escapeRegex(searchTerm), 'i');
      }
    } else {
      regex = this.safeRegexCompile(this.escapeRegex(searchTerm), 'i');
    }

    if (!regex) return records;

    return records.filter(record => {
      return regex.test(record.title) ||
             regex.test(record.author) ||
             regex.test(record.tag) ||
             regex.test(String(record.pages));
    });
  },

  getMatchInfo(record, searchTerm) {
    if (!searchTerm) return null;

    const escapedTerm = this.escapeRegex(searchTerm);
    const regex = this.safeRegexCompile(escapedTerm, 'i');
    
    if (!regex) return null;

    const matches = [];
    
    if (regex.test(record.title)) matches.push('title');
    if (regex.test(record.author)) matches.push('author');
    if (regex.test(record.tag)) matches.push('tag');
    if (regex.test(String(record.pages))) matches.push('pages');

    return matches.length > 0 ? matches : null;
  }
};
