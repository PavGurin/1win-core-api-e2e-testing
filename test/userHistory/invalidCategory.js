import { register } from '../../src/methods/register';
import { history } from '../../src/methods/history';
import { checkErrMsg } from '../../src/responseChecker';

describe('History categories', () => {
  it('C1789738 (-) unexistent category', async () => {
    await register.oneClickReg();
    const { data } = await history.category('sedfdsdf');
    // console.log(data);
    checkErrMsg(data, 404, 'Not found');
  });

  it('C1789739 (-) 404 on history-cases request ', async () => {
    await register.oneClickReg();
    const { data } = await history.category('cases');
    // console.log(data);
    checkErrMsg(data, 404, 'Not Found');
  });

  it('C1789740(-) 404 on history-casino request ', async () => {
    await register.oneClickReg();
    const { data } = await history.category('casino');
    // console.log(data);
    checkErrMsg(data, 404, 'Not Found');
  });
});
