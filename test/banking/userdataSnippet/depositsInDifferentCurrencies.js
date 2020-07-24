import { banking } from '../../../src/methods/banking';
import { checkUserdataSnippet } from '../../../src/expects/exBanking';
import { register } from '../../../src/methods/register';

describe('Userdata snippet for user with diffrent currencies', () => {
  it('C2174504 correct payment method and amount for both currencies', async () => {
    const { data: user } = await register.oneClickReg();
    await banking
      .createDepositInBD(user.id, 'RUB', 547, new Date(), 'mts_rub', '79115678944');
    await banking
      .createDepositInBD(user.id, 'RUB', 1214, new Date(), 'qiwi_rub', '79115678944');
    await banking
      .createDepositInBD(user.id, 'RUB', 2541, new Date(), 'qiwi_rub', '79115678944');
    await banking
      .createDepositInBD(user.id, 'USD', 123, new Date(), 'qiwi_usd', '79115678944');
    const { data: snippetRub } = await banking.userdataSnippet('RUB');
    // console.log(snippetRub);
    checkUserdataSnippet(snippetRub, 'qiwi_rub', 1500);
    const { data: snippetUsd } = await banking.userdataSnippet('USD');
    // console.log(snippetUsd);
    checkUserdataSnippet(snippetUsd, 'qiwi_usd', 125);
  });
});
