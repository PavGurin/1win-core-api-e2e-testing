import { banking } from '../../src/methods/banking';
import { register } from '../../src/methods/register';
import { cases } from '../../src/methods/cases';
import { getUserWithdrawalManualControl } from '../../src/methods/user';

describe('Anti - carding', () => {
  it('C1088636 - (+) withdrawal_manual_control = true after 2 failed deposits, new user', async () => {
    const { data: user } = await register.usualRegMailru();
    // console.log(user.id);

    await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
    await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
    await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '1', 'payterra');
    await banking.setBalance(user.id, 1000);

    const { data: caseResult } = await cases.playCaseWithoutChance(6);

    const { data } = await banking.withdrawalCreate('6363545498987171', 'card_rub', 'RUB', caseResult.result);
    // console.log(data);
    expect(await getUserWithdrawalManualControl(user.id)).toEqual('true');
  });

  it('C1088640 - (-) no withdrawal_manual_control after 1 failed deposit, new user', async () => {
    const { data: user } = await register.usualRegMailru();
    // console.log(user.id);

    await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
    await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '1', 'payterra');
    await banking.setBalance(user.id, 1000);

    const { data: caseResult } = await cases.playCaseWithoutChance(6);

    const { data } = await banking.withdrawalCreate('6363545498987171', 'card_rub', 'RUB', caseResult.result);
    // console.log(data);
    expect(await getUserWithdrawalManualControl(user.id)).toEqual(undefined);
  });

  it('C1315736 - (-) no withdrawal_manual_control after 2 failed deposits, old user', async () => {
    const { data: user } = await register.usualRegMailru();
    // console.log(user.id);
    await banking.createWithdrawalInBD(user.id, 100, new Date(), 'card_rub', '6363454521218989', 1);

    await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
    await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
    await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '1', 'payterra');
    await banking.setBalance(user.id, 1000);

    const { data: caseResult } = await cases.playCaseWithoutChance(6);

    const { data } = await banking.withdrawalCreate('6363545498987171', 'card_rub', 'RUB', caseResult.result);
    // console.log(data);
    expect(await getUserWithdrawalManualControl(user.id)).toEqual(undefined);
  });

  it('C1360990 - (-) no withdrawal_manual_control after 2 failed deposits, withdrawal on the same card', async () => {
    const { data: user } = await register.usualRegMailru();
    // console.log(user.id);

    await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
    await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
    await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '1', 'payterra');
    await banking.setBalance(user.id, 1000);

    const { data: caseResult } = await cases.playCaseWithoutChance(6);

    const { data } = await banking.withdrawalCreate('55005500663311220', 'card_rub', 'RUB', caseResult.result);
    // console.log(data);
    expect(await getUserWithdrawalManualControl(user.id)).toEqual(undefined);
  });

  it('C1360991 - (-) no withdrawal_manual_control after 2 failed deposits, withdrawal not on card', async () => {
    const { data: user } = await register.usualRegMailru();
    // console.log(user.id);

    await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
    await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
    await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '1', 'payterra');
    await banking.setBalance(user.id, 1000);

    const { data: caseResult } = await cases.playCaseWithoutChance(6);

    const { data } = await banking.withdrawalCreate('9112223344', 'mts_rub', 'RUB', caseResult.result);
    // console.log(data);
    expect(await getUserWithdrawalManualControl(user.id)).toEqual(undefined);
  });

  it('C1360992 - (-) no withdrawal_manual_control after deposits from different cards, withdrawal on one of them', async () => {
    const { data: user } = await register.usualRegMailru();
    // console.log(user.id);

    await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
    await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '9696585874741212', '2', 'payterra');
    await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '3344665588997700', '1', 'payterra');
    await banking.setBalance(user.id, 1000);

    const { data: caseResult } = await cases.playCaseWithoutChance(6);

    const { data } = await banking.withdrawalCreate('55005500663311220', 'card_rub', 'RUB', caseResult.result);
    // console.log(data);
    expect(await getUserWithdrawalManualControl(user.id)).toEqual(undefined);
  });

  it('C1360993 - (+) withdrawal_manual_control = true after deposits from different cards, withdrawal on other card', async () => {
    const { data: user } = await register.usualRegMailru();
    // console.log(user.id);

    await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
    await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '9696585874741212', '2', 'payterra');
    await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '3344665588997700', '1', 'payterra');
    await banking.setBalance(user.id, 1000);

    const { data: caseResult } = await cases.playCaseWithoutChance(6);

    const { data } = await banking.withdrawalCreate('5500220033669988', 'card_rub', 'RUB', caseResult.result);
    // console.log(data);
    expect(await getUserWithdrawalManualControl(user.id)).toEqual('true');
  });

  it('C1360994 - (-) no withdrawal_manual_control after deposits from different cards, withdrawal not on card', async () => {
    const { data: user } = await register.usualRegMailru();
    // console.log(user.id);

    await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
    await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '9696585874741212', '2', 'payterra');
    await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '3344665588997700', '1', 'payterra');
    await banking.setBalance(user.id, 1000);

    const { data: caseResult } = await cases.playCaseWithoutChance(6);

    const { data } = await banking.withdrawalCreate('79112365498', 'mts_rub', 'RUB', caseResult.result);
    // console.log(data);
    expect(await getUserWithdrawalManualControl(user.id)).toEqual(undefined);
  });
});
