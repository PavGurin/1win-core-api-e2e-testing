import { banking } from '../../src/methods/banking';
import { changeCurrency, profileMeta, setUserBonusAmount } from '../../src/methods/user';
import { register } from '../../src/methods/register';

describe('Bonuses in USER:profile-meta', () => {
  const TRANSFER_AMOUNT = 100;
  const FIRST_DEPOSIT_AMOUNT = 5000;

  it('C1789810 (+) deposit in RUB', async () => {
    const { data: user } = await register.oneClickReg();
    // console.log(user);
    await banking.createDepositInBD(user.id, 'RUB', FIRST_DEPOSIT_AMOUNT, new Date(), 'card_rub', '4276550046464601', 1, 'payterra');
    await setUserBonusAmount(user.id, FIRST_DEPOSIT_AMOUNT);

    const { data: metaRub } = await profileMeta(user.id);
    expect(metaRub.meta.bonus_amount).toBe(FIRST_DEPOSIT_AMOUNT);

    await changeCurrency('USD');
    const { data: metaUsd } = await profileMeta(user.id);
    expect(metaUsd.meta.bonus_amount).toBe(0);

    await changeCurrency('EUR');
    const { data: metaEur } = await profileMeta(user.id);
    expect(metaEur.meta.bonus_amount).toBe(0);
  });

  it('C1789811 (+) deposit in USD', async () => {
    const { data: user } = await register.oneClickRegUSD();
    // console.log(user);
    await banking.createDepositInBD(user.id, 'USD', FIRST_DEPOSIT_AMOUNT, new Date(), 'card', '4276550046464601', 1, 'payterra');
    await setUserBonusAmount(user.id, FIRST_DEPOSIT_AMOUNT);

    const { data: metaUsd } = await profileMeta(user.id);
    expect(metaUsd.meta.bonus_amount).toBe(FIRST_DEPOSIT_AMOUNT);

    await changeCurrency('RUB');
    const { data: metaRub } = await profileMeta(user.id);
    expect(metaRub.meta.bonus_amount).toBe(0);

    await changeCurrency('EUR');
    const { data: metaEur } = await profileMeta(user.id);
    expect(metaEur.meta.bonus_amount).toBe(0);
  });

  it('C1789812 (+) deposit in EUR', async () => {
    const { data: user } = await register.oneClickRegEUR();
    // console.log(user);
    await banking.createDepositInBD(user.id, 'EUR', FIRST_DEPOSIT_AMOUNT, new Date(), 'card', '4276550046464601', 1, 'payterra');
    await setUserBonusAmount(user.id, FIRST_DEPOSIT_AMOUNT);

    const { data: metaEur } = await profileMeta(user.id);
    expect(metaEur.meta.bonus_amount).toBe(FIRST_DEPOSIT_AMOUNT);

    await changeCurrency('RUB');
    const { data: metaRub } = await profileMeta(user.id);
    expect(metaRub.meta.bonus_amount).toBe(0);

    await changeCurrency('USD');
    const { data: metaUsd } = await profileMeta(user.id);
    expect(metaUsd.meta.bonus_amount).toBe(0);
  });

  it('C1789813 (+) transfer in RUB, deposit in EUR', async () => {
    const { data: user } = await register.oneClickReg();
    // console.log(user);
    await banking.createTransferInBD(user.id, 'RUB', TRANSFER_AMOUNT, new Date(), 1, 136);
    await banking.createDepositInBD(user.id, 'EUR', FIRST_DEPOSIT_AMOUNT, new Date(), 'card', '4276550046464601', 1, 'payterra');
    await setUserBonusAmount(user.id, FIRST_DEPOSIT_AMOUNT);

    const { data: metaRub } = await profileMeta(user.id);
    expect(metaRub.meta.bonus_amount).toBe(0);

    await changeCurrency('EUR');
    const { data: metaEur } = await profileMeta(user.id);
    expect(metaEur.meta.bonus_amount).toBe(FIRST_DEPOSIT_AMOUNT);

    await changeCurrency('USD');
    const { data: metaUsd } = await profileMeta(user.id);
    expect(metaUsd.meta.bonus_amount).toBe(0);
  });

  it('C1789814 (+) transfer in USD, deposit in USD', async () => {
    const { data: user } = await register.oneClickRegUSD();
    // console.log(user);
    await banking.createTransferInBD(user.id, 'USD', TRANSFER_AMOUNT, new Date(), 1, 136);
    await banking.createDepositInBD(user.id, 'USD', FIRST_DEPOSIT_AMOUNT, new Date(), 'card', '4276550046464601', 1, 'payterra');
    await setUserBonusAmount(user.id, FIRST_DEPOSIT_AMOUNT);

    const { data: metaUsd } = await profileMeta(user.id);
    expect(metaUsd.meta.bonus_amount).toBe(FIRST_DEPOSIT_AMOUNT);

    await changeCurrency('RUB');
    const { data: metaRub } = await profileMeta(user.id);
    expect(metaRub.meta.bonus_amount).toBe(0);

    await changeCurrency('EUR');
    const { data: metaEur } = await profileMeta(user.id);
    expect(metaEur.meta.bonus_amount).toBe(0);
  });

  it('C1789815 (+) partner withdrawal in EUR, deposit in RUB', async () => {
    const { data: user } = await register.oneClickReg();
    // console.log(user);
    await banking.createPartnerWithdrawalInBD(user.id, 'EUR', TRANSFER_AMOUNT);
    await banking.createDepositInBD(user.id, 'RUB', FIRST_DEPOSIT_AMOUNT, new Date(), 'card_rub', '4276550046464601', 1, 'payterra');
    await setUserBonusAmount(user.id, FIRST_DEPOSIT_AMOUNT);

    const { data: metaRub } = await profileMeta(user.id);
    expect(metaRub.meta.bonus_amount).toBe(FIRST_DEPOSIT_AMOUNT);

    await changeCurrency('EUR');
    const { data: metaEur } = await profileMeta(user.id);
    expect(metaEur.meta.bonus_amount).toBe(0);

    await changeCurrency('USD');
    const { data: metaUsd } = await profileMeta(user.id);
    expect(metaUsd.meta.bonus_amount).toBe(0);
  });

  it('C1789816 (+) partner withdrawal in RUB, deposit in RUB', async () => {
    const { data: user } = await register.oneClickReg();
    // console.log(user);
    await banking.createPartnerWithdrawalInBD(user.id, 'RUB', TRANSFER_AMOUNT);
    await banking.createDepositInBD(user.id, 'RUB', FIRST_DEPOSIT_AMOUNT, new Date(), 'card_rub', '4276550046464601', 1, 'payterra');
    await setUserBonusAmount(user.id, FIRST_DEPOSIT_AMOUNT);

    const { data: metaRub } = await profileMeta(user.id);
    expect(metaRub.meta.bonus_amount).toBe(FIRST_DEPOSIT_AMOUNT);

    await changeCurrency('EUR');
    const { data: metaEur } = await profileMeta(user.id);
    expect(metaEur.meta.bonus_amount).toBe(0);

    await changeCurrency('USD');
    const { data: metaUsd } = await profileMeta(user.id);
    expect(metaUsd.meta.bonus_amount).toBe(0);
  });
});
