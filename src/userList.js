import {randomStr} from './randomizer';

export const userList = {

    //Prodlike
    async login_without_money() {
        return await socket.send('USER:auth-login', {
            login: '123123@mailinator.com',
            password: '123123'
        });
    },

    async login_without_money_tghash() {
        return await socket.send('USER:auth-login', {
            login: '123123@mailinator.com',
            password: '123123',
            tg_hash: randomStr(5)
        });
    },

    async login_by_phone() {
        return await socket.send('USER:auth-login', {
            login: '+79995654567',
            password: '123123'
        });
    },

    async login_with_RUB() {
        return await socket.send('USER:auth-login', {
            login: 'test_withdrawal@mailinator.com',
            password: '123123',
            tg_hash: randomStr(5)
        });
    },

    async login_with_RUB_USD() {
        //Должен быть баланс в валюте отличной от рублей
        await socket.send('USER:auth-login', {
            login: 'test_withdrawal2@mailinator.com',
            password: '123123',
            tg_hash: randomStr(5)
        });
    },

    async login_test_status() {
        //У пользователя статит статус тестового пользователя
        await socket.send('USER:auth-login', {
            login: 'tester_status@mailinator.com',
            password: '123123',
            tg_hash: randomStr(5)
        });
    },

    async login_full_block() {
        //У пользователя стоит полный блок
        await socket.send('USER:auth-login', {
            login: 'full_block_user@mailinator.com',
            password: '123123',
            tg_hash: randomStr(5)
        });
    },

    async login_partial_block() {
        //У пользователя стоит частичный блок
        await socket.send('USER:auth-login', {
            login: 'partial_block_user@mailinator.com',
            password: '123123',
            tg_hash: randomStr(5)
        });
    }
};

