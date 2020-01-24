import { banking } from '../../src/methods/banking';
import { checkErrMsg } from '../../src/responseChecker';

describe('Unauthorized requests to banking service', () => {
  const currency = 'RUB';
  const paymentType = 'card_rub';
  const payment_system = 'card_rub';

  it('C459485 - create deposit', async () => {
    const { data } = await banking.depositCreate('+7123', paymentType, currency, 100);
    // console.log(data);
    checkErrMsg(data, 401, 'Unauthorized');
  });

  it('C459486 - create request deposit', async () => {
    const { data } = await banking.depositCreateRequest('+7123', paymentType, currency, 100);
    // console.log(data);
    checkErrMsg(data, 401, 'Unauthorized');
  });
  it('C459487 - deposit request', async () => {
    const { data } = await socket.send('BANKING:deposit-request', { h: 'gjhg' });

    // console.log(data);
    checkErrMsg(data, 401, 'Unauthorized');
  });
  it('C462813 - transfer create', async () => {
    const { data } = await banking.transferCreate(100, currency);

    // console.log(data);
    checkErrMsg(data, 401, 'Unauthorized');
  });
  it('C462814 - transfer confirm', async () => {
    const { data } = await socket.send('BANKING:transfer-confirm', { code: 5372831 });

    // console.log(data);
    checkErrMsg(data, 401, 'Unauthorized');
  });
  it('C462815 - withdrawal create', async () => {
    const { data } = await banking.withdrawalCreate('lina.solodova@gmail.com', payment_system, currency, 99.99);
    checkErrMsg(data, 401, 'Unauthorized');
  });
  it('C462816 - withdrawal confirm', async () => {
    const { data } = await socket.send('BANKING:withdrawal-confirm', { code: 10704 });

    checkErrMsg(data, 401, 'Unauthorized');
  });
  it('C459484 - withdrawal get', async () => {
    const { data } = await socket.send('BANKING:withdrawal-get', { id: 0 });

    checkErrMsg(data, 401, 'Unauthorized');
  });

  it('C462817 - withdrawal history', async () => {
    const { data } = await socket.send('BANKING:withdrawal-history');

    checkErrMsg(data, 401, 'Unauthorized');
  });

  it('C459483 - balance get', async () => {
    const { data } = await socket.send('BANKING:balance-get');

    checkErrMsg(data, 401, 'Unauthorized');
  });
});
