import {expect} from 'chai';
import {userList} from '../../src/methods/userList';
import {register} from "../../src/methods/register";
import {checkErrMsg} from "../../src/responseChecker";

describe('Transfer', () => {

    it('C19367 (-) Without money , not enough amount + RUB', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 1,
                currency: 'RUB'
            }
        );
        //console.log(data);
        checkErrMsg(data, 400, 'Недостаточно средств')
    });

    it('C19370 (-) Without money , enough amount + RUB', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 100,
                currency: 'RUB'
            }
        );
        //console.log(data);
        checkErrMsg(data, 400, 'Недостаточно средств')

    });

    it('C19371 (+) With money', async () => {
        await userList.login_with_real_money();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 100,
                currency: 'RUB'
            }
        );
        //console.log(data);
        expect(data.confirmationRequested).equal(true);
        expect(data.email).not.equal(null);

    });

    it('C19374 (+) With money, currency = null', async () => {
        await userList.login_with_real_money();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
            amount: 2,
            //currency: 'RUB'
            }
        );
        console.log(data);
        expect(data.confirmationRequested).equal(true);
        expect(data.email).not.equal(null);
    });

    it('C19375 (+) With money, currency = null and amount > 1000', async () => {
        await userList.login_with_real_money();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
            amount: 19990000
            }
        );
        //console.log(data);
        checkErrMsg(data, 400, 'Недостаточно средств')
    });
});

describe('Transfer USD', () => {

    it('C19373 (+) With money + USD, amount = 2 USD', async () => {
        await userList.login_with_real_money();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 2,
                currency: 'USD'
            }
        );
        //console.log(data);
        checkErrMsg(data, 400, 'Недостаточно средств')
    });

    it('C19372 (+) With money + USD, amount = 1 USD', async () => {
        await userList.login_with_real_money();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 1,
                currency: 'USD'
            }
        );
        //console.log(data);
        checkErrMsg(data, 400, 'Недостаточно средств')
    });

    it('C19368 Without money , not enough amount + USD', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 1,
                currency: 'USD'
            }
        );
        checkErrMsg(data, 400, 'Недостаточно средств')
    });

    it('C19369 (-) Without money , enough amount + USD', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 100,
                currency: 'USD'
            }
        );
        //console.log(data);
        checkErrMsg(data, 400, 'Недостаточно средств')
    });

});
