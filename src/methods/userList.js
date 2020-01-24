/* eslint camelcase: 'off' */

export const userList = {

  async loginWithParams(login, password, loginParams) {
    return socket.send('USER:auth-login', {
      login,
      password,
      ...loginParams,
    });
  },

  async loginWithRub() {
    return socket.send('USER:auth-login', {
      login: 'test_withdrawal@mailinator.com',
      password: '123123',
    });
  },

  async loginWithRubUsd() {
    // Должен быть баланс в валюте отличной от рублей
    return socket.send('USER:auth-login', {
      login: 'test_withdrawal2@mailinator.com',
      password: '123123',
    });
  },

  async loginWithRubUsdCase() {
    // Должен быть баланс в валюте отличной от рублей
    return socket.send('USER:auth-login', {
      login: 'hedj72@1win.xyz',
      password: '123123',
    });
  },

  // С реальными деньгами! Использовать аккуратно)
  async loginWithRealMoney() {
    return socket.send('USER:auth-login', {
      login: 'nogm75@1win.xyz',
      password: 'qatester',
    });
  },


  async loginTransferToUser() {
    // Пользователь, которому приходят переводы
    return socket.send('USER:auth-login', {
      login: 'test_transfer@test.xyz',
      password: '123123',
    });
  },

  async userWithCasinoFavourites() {
    return socket.send('USER:auth-login', {
      login: 'mexj60@1win.xyz',
      password: 'emf1ak',
    });
  },
};
