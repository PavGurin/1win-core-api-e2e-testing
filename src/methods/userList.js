/* eslint camelcase: 'off' */
import { randomStr } from '../randomizer';

export const userList = {

  async loginWithParams(login, password, tg_hash) {
    return socket.send('USER:auth-login', {
      login,
      password,
      tg_hash,
    });
  },

  // Prodlike

  async loginWithRub() {
    return socket.send('USER:auth-login', {
      login: 'test_withdrawal@mailinator.com',
      password: '123123',
      tg_hash: randomStr(5),
    });
  },

  async loginWithRubUsd() {
    // Должен быть баланс в валюте отличной от рублей
    return socket.send('USER:auth-login', {
      login: 'test_withdrawal2@mailinator.com',
      password: '123123',
      tg_hash: randomStr(5),
    });
  },

  // С реальными деньгами! Использовать аккуратно)
  async loginWithRealMoney() {
    return socket.send('USER:auth-login', {
      login: 'nogm75@1win.xyz',
      password: '123456',
    });
  },

  async loginTestStatus() {
    // У пользователя статит статус тестового пользователя
    return socket.send('USER:auth-login', {
      login: 'tester_status@mailinator.com',
      password: '123123',
      tg_hash: randomStr(5),
    });
  },

  async loginFullBlock() {
    // У пользователя стоит полный блок
    return socket.send('USER:auth-login', {
      login: 'full_block_user@mailinator.com',
      password: '123123',
      tg_hash: randomStr(5),
    });
  },

  async loginPartialBlock() {
    // У пользователя стоит частичный блок
    return socket.send('USER:auth-login', {
      login: 'partial_block_user@mailinator.com',
      password: '123123',
      tg_hash: randomStr(5),
    });
  },

  async loginManualControl() {
    // У пользователя стоит частичный блок
    return socket.send('USER:auth-login', {
      login: 'partial_block_user@mailinator.com',
      password: '123123',
      tg_hash: randomStr(5),
    });
  },
};
