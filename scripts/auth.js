const Auth = {
  register(userData) {
    const usernameResult = Validators.validateUsername(userData.username);
    if (!usernameResult.valid) {
      return { success: false, field: 'username', message: usernameResult.message };
    }

    const emailResult = Validators.validateEmail(userData.email);
    if (!emailResult.valid) {
      return { success: false, field: 'email', message: emailResult.message };
    }

    const passwordResult = Validators.validatePassword(userData.password);
    if (!passwordResult.valid) {
      return { success: false, field: 'password', message: passwordResult.message };
    }

    const matchResult = Validators.validatePasswordMatch(
      userData.password, 
      userData.confirmPassword
    );
    if (!matchResult.valid) {
      return { success: false, field: 'confirmPassword', message: matchResult.message };
    }

    const users = Storage.getUsers();
    
    if (users.find(u => u.username === userData.username)) {
      return { success: false, field: 'username', message: 'Username already exists' };
    }
    
    if (users.find(u => u.email === userData.email)) {
      return { success: false, field: 'email', message: 'Email already registered' };
    }

    const newUser = {
      id: `user_${Date.now()}`,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    Storage.saveUsers(users);

    return { success: true, user: newUser };
  },

  login(credentials) {
    const users = Storage.getUsers();
    
    const user = users.find(u => 
      (u.username === credentials.identifier || u.email === credentials.identifier) &&
      u.password === credentials.password
    );

    if (!user) {
      return { 
        success: false, 
        message: 'Invalid username/email or password' 
      };
    }

    Storage.setCurrentUser({
      id: user.id,
      username: user.username,
      email: user.email
    });

    return { success: true, user };
  },

  logout() {
    Storage.clearCurrentUser();
    return { success: true };
  },

  getCurrentUser() {
    return Storage.getCurrentUser();
  },

  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }
};
