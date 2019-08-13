import { expect } from 'chai';
import { register } from '../../src/methods/register';
import { logOut, setUserRiskCoef } from '../../src/methods/user';
import { userPool } from '../../src/methods/userPool';
import { userList } from '../../src/methods/userList';
import { getSingleMatch } from '../../src/methods/matchStorage';
import { generateOrdinaryCoupon, getMaxBetAmount } from '../../src/methods/better';
import { mysqlConnection } from '../../src/methods/mysqlConnection';

describe('User risk coefficient tests', () => {
  const USERS_NUMBER = 6;
  const BALANCE = 100;
  let currentUser = {};
  let users = [];
  const PREMATCH = 'prematch';

  beforeAll(async () => {
    users = await userPool.usersWithBalanceRub(USERS_NUMBER, BALANCE);
  });
  beforeEach(async () => { await logOut(); });

  it('C28390 (+) default = 1, one click reg', async () => {
    const { data } = await register.oneClickRegUSD();
    const meta = await socket.userMeta;
    expect(meta.user_risk_coefficient).equal(1);
    const result = await mysqlConnection.executeQuery(`SELECT value FROM 1win.ma_users_meta WHERE id_user = ${data.id} AND ma_users_meta.key = 'user_risk_coefficient'`);
    expect(result[0]).not.exist;
  });

  it('C28391 (+) default = 1, usual reg', async () => {
    const { data } = await register.usualReg();
    const meta = await socket.userMeta;
    expect(meta.user_risk_coefficient).equal(1);
    const result = await mysqlConnection.executeQuery(`SELECT value FROM 1win.ma_users_meta WHERE id_user = ${data.id} AND ma_users_meta.key = 'user_risk_coefficient'`);
    expect(result[0]).not.exist;
  });

  it('C28392 (+) user_risk_coefficient = 1 when in db != 1', async () => {
    currentUser = users.pop();
    await setUserRiskCoef(currentUser.id, 0.25);
    await userList.loginWithParams(currentUser.email, currentUser.password);
    const meta = await socket.userMeta;
    expect(meta.user_risk_coefficient).equal(1);
  });

  it('C28393 (+) set user_risk_coefficient = 0.5', async () => {
    currentUser = users.pop();

    await userList.loginWithParams(currentUser.email, currentUser.password);
    const [singleMatch] = await getSingleMatch(PREMATCH);
    const { data: { maxBetAmount: maxBetAmount1 } } = await getMaxBetAmount(
      (await generateOrdinaryCoupon(singleMatch)), singleMatch,
    );
    // console.log(maxBetAmount1);

    await setUserRiskCoef(currentUser.id, 0.5);

    const { data: { maxBetAmount: maxBetAmount2 } } = await getMaxBetAmount(
      (await generateOrdinaryCoupon(singleMatch)), singleMatch,
    );
    // console.log(maxBetAmount2);

    expect((maxBetAmount2 / maxBetAmount1).toFixed(1)).equal((0.5).toFixed(1));
  });

  it('C28394 (+) set user_risk_coefficient = 0.75', async () => {
    currentUser = users.pop();

    await userList.loginWithParams(currentUser.email, currentUser.password);
    const [singleMatch] = await getSingleMatch(PREMATCH);
    const { data: { maxBetAmount: maxBetAmount1 } } = await getMaxBetAmount(
      (await generateOrdinaryCoupon(singleMatch)), singleMatch,
    );
    // console.log(maxBetAmount1);

    await setUserRiskCoef(currentUser.id, 0.75);

    const { data: { maxBetAmount: maxBetAmount2 } } = await getMaxBetAmount(
      (await generateOrdinaryCoupon(singleMatch)), singleMatch,
    );
    // console.log(maxBetAmount2);

    expect((maxBetAmount2 / maxBetAmount1).toFixed(2)).equal((0.75).toFixed(2));
  });

  it('C28395 (+) set user_risk_coefficient = 10', async () => {
    currentUser = users.pop();

    await userList.loginWithParams(currentUser.email, currentUser.password);
    const [singleMatch] = await getSingleMatch(PREMATCH);
    const { data: { maxBetAmount: maxBetAmount1 } } = await getMaxBetAmount(
      (await generateOrdinaryCoupon(singleMatch)), singleMatch,
    );
    // console.log(maxBetAmount1);

    await setUserRiskCoef(currentUser.id, 10);

    const { data: { maxBetAmount: maxBetAmount2 } } = await getMaxBetAmount(
      (await generateOrdinaryCoupon(singleMatch)), singleMatch,
    );
    // console.log(maxBetAmount2);

    expect((maxBetAmount2 / maxBetAmount1).toFixed(1)).equal((10).toFixed(1));
  });

  it('C28396 (+) set user_risk_coefficient = 0.123456', async () => {
    currentUser = users.pop();

    await userList.loginWithParams(currentUser.email, currentUser.password);
    const [singleMatch] = await getSingleMatch(PREMATCH);
    const { data: { maxBetAmount: maxBetAmount1 } } = await getMaxBetAmount(
      (await generateOrdinaryCoupon(singleMatch)), singleMatch,
    );
    // console.log(maxBetAmount1);

    await setUserRiskCoef(currentUser.id, 0.123456);

    const { data: { maxBetAmount: maxBetAmount2 } } = await getMaxBetAmount(
      (await generateOrdinaryCoupon(singleMatch)), singleMatch,
    );
    // console.log(maxBetAmount2);

    expect((maxBetAmount2 / maxBetAmount1).toFixed(6)).equal((0.123456).toFixed(6));
  });

  it('C28397 (+) set user_risk_coefficient = 0.000005 (minimum value)', async () => {
    currentUser = users.pop();

    await userList.loginWithParams(currentUser.email, currentUser.password);
    const [singleMatch] = await getSingleMatch(PREMATCH);
    const { data: { maxBetAmount: maxBetAmount1 } } = await getMaxBetAmount(
      (await generateOrdinaryCoupon(singleMatch)), singleMatch,
    );
    // console.log(maxBetAmount1);

    await setUserRiskCoef(currentUser.id, 0.000005);

    const { data: { maxBetAmount: maxBetAmount2 } } = await getMaxBetAmount(
      (await generateOrdinaryCoupon(singleMatch)), singleMatch,
    );
    // console.log(maxBetAmount2);

    expect((maxBetAmount2 / maxBetAmount1).toFixed(6)).equal((0.000005).toFixed(6));
  });
});
