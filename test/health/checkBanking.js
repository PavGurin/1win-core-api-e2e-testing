import { expect } from 'chai';

describe('Get methods map', () => {
  it('Withdrawal methods map without login', async () => {
    const { data } = await socket.send('BANKING:methods-withdrawal');
    // console.log(data);
    expect(data).to.be.an('object');
    expect(data.card_rub.placeholder_text.en).equal('Bank card number');
    expect(data.card_rub.placeholder_text.ru).equal('Номер банковской карты');
  });
});
