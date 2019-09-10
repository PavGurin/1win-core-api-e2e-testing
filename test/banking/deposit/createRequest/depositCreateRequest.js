import { register } from '../../../../src/methods/register';
import { banking } from '../../../../src/methods/banking';
import { mysqlConnection } from '../../../../src/methods/mysqlConnection';
import { successDbDeposit } from '../../../../src/expects/exDatabaseTests';

const paymentType = 'card_rub';
const currency = 'RUB';
let user = {};

describe('Deposit requests', () => {
  beforeEach(async () => {
    user = await register.oneClickReg(socket);
  });

  // TODO больше проверок на PaymentType
  it('C19376 (+) valid request', async () => {
    await banking.depositCreateRequest(101, '3333444455556666',
      paymentType, currency);

    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
    WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 101, '3333444455556666',
      'card_rub', 'RUB');
  });
});
