import { randomStr } from '../randomizer';

export const userList = {

  async login_with_params(login, password, tg_hash) {
    return socket.send('USER:auth-login', {
      login,
      password,
      tg_hash,
    });
  },

  // Prodlike

  async login_with_RUB() {
    return await socket.send('USER:auth-login', {
      login: 'test_withdrawal@mailinator.com',
      password: '123123',
      tg_hash: randomStr(5),
    });
  },

  async login_with_RUB_USD() {
    // Должен быть баланс в валюте отличной от рублей
    await socket.send('USER:auth-login', {
      login: 'test_withdrawal2@mailinator.com',
      password: '123123',
      tg_hash: randomStr(5),
    });
  },

  // С реальными деньгами! Использовать аккуратно)
  async login_with_real_money() {
    return await socket.send('USER:auth-login', {
      login: 'nogm75@1win.xyz',
      password: '123456',
    });
  },

  async login_test_status() {
    // У пользователя статит статус тестового пользователя
    await socket.send('USER:auth-login', {
      login: 'tester_status@mailinator.com',
      password: '123123',
      tg_hash: randomStr(5),
    });
  },

  async login_full_block() {
    // У пользователя стоит полный блок
    await socket.send('USER:auth-login', {
      login: 'full_block_user@mailinator.com',
      password: '123123',
      tg_hash: randomStr(5),
    });
  },

  async login_partial_block() {
    // У пользователя стоит частичный блок
    await socket.send('USER:auth-login', {
      login: 'partial_block_user@mailinator.com',
      password: '123123',
      tg_hash: randomStr(5),
    });
  },
};
