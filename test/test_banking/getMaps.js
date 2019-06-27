import { expect } from 'chai';

describe('Get methods map', () => {
  it('C19356 Withdrawal methods map without login', async () => {
    const { data } = await socket.send('BANKING:methods-withdrawal');
    // console.log(data);
    expect(data).to.be.an('object');
    expect(data.card_rub.placeholder_text.en).equal('Bank card number');
    expect(data.card_rub.placeholder_text.ru).equal('Номер банковской карты');
  });

  it('C19358 Payment methods map without login', async () => {
    const { data } = await socket.send('BANKING:methods-payment');
    // console.log(data);
    expect(data).to.be.an('object');
    expect(data.card_rub.text.en).equal('Bank card');
    expect(data.card_rub.text.ru).equal('Банковская карта');
  });
});
