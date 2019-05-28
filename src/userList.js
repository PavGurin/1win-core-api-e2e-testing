export const userList = {

    //Prodlike
    async login_without_money() {
        await socket.send('USER:auth-login', {login: '123123@mailinator.com', password: '123123'});
    },

    async login_with_RUB() {
        await socket.send('USER:auth-login', {login: 'test_withdrawal@mailinator.com', password: '123123'});
    },
    async login_with_RUB_USD() {
        await socket.send('USER:auth-login', {login: 'test_withdrawal2@mailinator.com', password: '123123'});
    },

    //Prod
}

