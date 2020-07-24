import { banking, getMinDepAmount } from '../../../src/methods/banking';
import { checkUserdataSnippet } from '../../../src/expects/exBanking';

describe('Userdata snippet for unauthorized user', () => {
  it('C2172085 RUB', async () => {
    const { data } = await banking.userdataSnippet('RUB');
    // console.log(data);
    checkUserdataSnippet(data, 'card_rub', 900);
  });
  it('C2172086 USD', async () => {
    const { data } = await banking.userdataSnippet('USD');
    // console.log(data);
    checkUserdataSnippet(data, 'card', await getMinDepAmount('USD'));
  });
  it('C2172087 EUR', async () => {
    const { data } = await banking.userdataSnippet('EUR');
    // console.log(data);
    checkUserdataSnippet(data, 'card', await getMinDepAmount('EUR'));
  });
  it('C2172088 UAH', async () => {
    const { data } = await banking.userdataSnippet('UAH');
    // console.log(data);
    checkUserdataSnippet(data, 'card', await getMinDepAmount('UAH'));
  });
});
