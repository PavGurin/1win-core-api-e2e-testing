import { randomStr } from '../randomizer';

export const usersWithManualControl = {
  async userMail(socket) {
    return socket.send('USER:auth-login', {
      login: 'yulia.gazizova.94@mail.ru', // A87654321A
      password: '123123',
      tg_hash: randomStr(5),
    });
  },
  async userInbox(socket) {
    return socket.send('USER:auth-login', {
      login: 'yulia.gazizova.94@inbox.ru', // A87654321A
      password: '123123',
      tg_hash: randomStr(5),
    });
  },

  async userBk(socket) {
    return socket.send('USER:auth-login', {
      login: 'yulia.gazizova.94@bk.ru', // A87654321A
      password: '123123',
      tg_hash: randomStr(5),
    });
  },

  async userList(socket) {
    return socket.send('USER:auth-login', {
      login: 'yulia.gazizova.94@list.ru', // A87654321A
      password: '123123',
      tg_hash: randomStr(5),
    });
  },
};

export const usersWithBlock = {
  async userMail(socket) {
    return socket.send('USER:auth-login', {
      login: 'yulia.gazizova.940@mail.ru', // A87654321A
      password: '123123',
      tg_hash: randomStr(5),
    });
  },
  async userInbox(socket) {
    return socket.send('USER:auth-login', {
      login: 'yulia.gazizova.940@inbox.ru', // A87654321A
      password: '123123',
      tg_hash: randomStr(5),
    });
  },

  async userBk(socket) {
    return socket.send('USER:auth-login', {
      login: 'yulia.gazizova.940@bk.ru', // A87654321A
      password: '123123',
      tg_hash: randomStr(5),
    });
  },

  async userList(socket) {
    return socket.send('USER:auth-login', {
      login: 'yulia.gazizova.940@list.ru', // A87654321A
      password: '123123',
      tg_hash: randomStr(5),
    });
  },
};
