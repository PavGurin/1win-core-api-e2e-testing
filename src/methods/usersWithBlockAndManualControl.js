export const usersWithManualControl = {
  async userList() {
    return socket.send('USER:auth-login', {
      login: 'yulia.gazizova.94@list.ru', // A87654321A
      password: '123123',
    });
  },
};

export const usersWithBlock = {
  async userMail() {
    return socket.send('USER:auth-login', {
      login: 'yulia.gazizova.940@mail.ru', // A87654321A
      password: '123123',
    });
  },
  async userInbox() {
    return socket.send('USER:auth-login', {
      login: 'yulia.gazizova.940@inbox.ru', // A87654321A
      password: '123123',
    });
  },

  async userBk() {
    return socket.send('USER:auth-login', {
      login: 'yulia.gazizova.940@bk.ru', // A87654321A
      password: '123123',
    });
  },

  async userList() {
    return socket.send('USER:auth-login', {
      login: 'yulia.gazizova.940@list.ru', // A87654321A
      password: '123123',
    });
  },
};
