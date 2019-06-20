import {userList} from '../../src/methods/userList';
import {register} from '../../src/methods/register';
import {banking} from '../../src/methods/banking';
import {checkError404, checkErrorMsg} from '../../src/responseChecker';

describe('Transfer confirm', () => {

    //TODO продумать логику теста так, чтобы нужный код подставлялся сам в момент запуска теста
    it('C19365 (-) Incorrect code with 404 code response', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:transfer-confirm', {code: 5372831});
        // console.log(data);
        checkError404(data, 'Перевод не найден');
    });

    it('C19366 (-) Incorrect code with 400 code response', async () => {
        await userList.login_with_real_money();
        await banking.transfet_create();
        const {data} = await socket.send('BANKING:transfer-confirm', {code: 111});
        // console.log(data);
        checkErrorMsg(data, 'Неверный ключ запроса');
    });
});
