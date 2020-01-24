export const userForAutoConfirm = {

  async EmailMail() {
    return socket.send('USER:auth-login', {
      login: 'lina.solodova.94@mail.ru',
      password: '123123',
    });
  },

  async EmailInbox() {
    return socket.send('USER:auth-login', {
      login: 'lina.solodova.94@inbox.ru',
      password: '123123',
    });
  },

  async EmailBk() {
    return socket.send('USER:auth-login', {
      login: 'lina.solodova.941@bk.ru',
      password: '123123',
    });
  },

  async EmailList() {
    return socket.send('USER:auth-login', {
      login: 'lina.solodova.94@list.ru',
      password: '123123',
    });
  },
};
