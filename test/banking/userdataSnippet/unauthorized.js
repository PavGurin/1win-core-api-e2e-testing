import { banking } from '../../../src/methods/banking';
import { checkUserdataSnippet } from '../../../src/expects/exBanking';

describe('Userdata snippet for unauthorized user', () => {
  it('RUB', async () => {
    const { data } = await banking.userdataSnippet('RUB');
    // console.log(data);
    checkUserdataSnippet(data, 'card_rub', 900);
  });
  it('USD', async () => {
    const { data } = await banking.userdataSnippet('USD');
    // console.log(data);
    checkUserdataSnippet(data, 'card', 15);
  });
  it('EUR', async () => {
    const { data } = await banking.userdataSnippet('EUR');
    // console.log(data);
    checkUserdataSnippet(data, 'card', 15);
  });
  it('UAH', async () => {
    const { data } = await banking.userdataSnippet('UAH');
    // console.log(data);
    checkUserdataSnippet(data, 'card', 350);
  });
});
