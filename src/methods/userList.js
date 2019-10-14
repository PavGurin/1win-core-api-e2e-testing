/* eslint camelcase: 'off' */
import { randomStr } from '../randomizer';

export const userList = {

  async loginWithParams(socket, login, password, tg_hash, loginParams) {
    return socket.send('USER:auth-login', {
      login,
      password,
      tg_hash,
      ...loginParams,
    });
  },

  async loginWithRub(socket) {
    return socket.send('USER:auth-login', {
      login: 'test_withdrawal@mailinator.com',
      password: '123123',
      tg_hash: randomStr(5),
    });
  },

  async loginWithRubUsd(socket) {
    // Должен быть баланс в валюте отличной от рублей
    return socket.send('USER:auth-login', {
      login: 'test_withdrawal2@mailinator.com',
      password: '123123',
      tg_hash: randomStr(5),
    });
  },

  // С реальными деньгами! Использовать аккуратно)
  async loginWithRealMoney(socket) {
    return socket.send('USER:auth-login', {
      login: 'nogm75@1win.xyz',
      password: 'qatester',
      tg_hash: randomStr(5),
    });
  },


  async loginTransferToUser(socket) {
    // Пользователь, которому приходят переводы
    return socket.send('USER:auth-login', {
      login: 'test_transfer@test.xyz',
      password: '123123',
      tg_hash: randomStr(5),
    });
  },
};
