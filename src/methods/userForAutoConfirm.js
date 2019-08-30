import { randomStr } from '../randomizer';

export const userForAutoConfirm = {

  async EmailMail(socket) {
    return socket.send('USER:auth-login', {
      login: 'lina.solodova.94@mail.ru',
      password: '123123',
      tg_hash: randomStr(5),
    });
  },

  async EmailInbox(socket) {
    return socket.send('USER:auth-login', {
      login: 'lina.solodova.94@inbox.ru',
      password: '123123',
      tg_hash: randomStr(5),
    });
  },

  async EmailBk(socket) {
    return socket.send('USER:auth-login', {
      login: 'lina.solodova.94@bk.ru',
      password: '123123',
      tg_hash: randomStr(5),
    });
  },

  async EmailList(socket) {
    return socket.send('USER:auth-login', {
      login: 'lina.solodova.94@list.ru',
      password: '123123',
      tg_hash: randomStr(5),
    });
  },
};
